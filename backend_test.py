#!/usr/bin/env python3
"""
Lopez Travel - Backend Smoke Test + Media Delivery Test
Read-only smoke test + HTTP asset delivery verification
"""

import requests
import json
import subprocess
import os
from pathlib import Path

# Configuration
BASE_URL = "https://lopez-curadoria.preview.emergentagent.com"
API_BASE = f"{BASE_URL}/api"
ADMIN_EMAIL = "admin@lopeztravel.com"
ADMIN_PASSWORD = "lopez2025"

# Media files to test
MEDIA_FILES = [
    {
        "path": "/media/brasil-cove-desktop.mp4",
        "disk_path": "/app/public/media/brasil-cove-desktop.mp4",
        "expected_mime": "video/mp4",
        "expected_size_mb": 3.23,
        "type": "video"
    },
    {
        "path": "/media/brasil-cove-mobile.mp4",
        "disk_path": "/app/public/media/brasil-cove-mobile.mp4",
        "expected_mime": "video/mp4",
        "expected_size_mb": 1.08,
        "type": "video"
    },
    {
        "path": "/media/brasil-cove-poster.jpg",
        "disk_path": "/app/public/media/brasil-cove-poster.jpg",
        "expected_mime": "image/jpeg",
        "expected_size_mb": 0.23,
        "type": "image"
    }
]

def print_section(title):
    print(f"\n{'='*80}")
    print(f"  {title}")
    print(f"{'='*80}\n")

def print_test(name, passed, details=""):
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"{status} - {name}")
    if details:
        print(f"    {details}")

def test_backend_smoke():
    """Read-only backend smoke tests"""
    print_section("BACKEND SMOKE TEST (READ-ONLY)")
    
    results = {
        "root": False,
        "login": False,
        "stats": False,
        "leads": False
    }
    
    # Test 1: Health check
    try:
        response = requests.get(f"{API_BASE}/root", timeout=10)
        if response.status_code == 200:
            data = response.json()
            results["root"] = True
            print_test("GET /api/root (health check)", True, f"Status: {response.status_code}, Message: {data.get('message', 'N/A')}")
        else:
            print_test("GET /api/root (health check)", False, f"Status: {response.status_code}")
    except Exception as e:
        print_test("GET /api/root (health check)", False, f"Error: {str(e)}")
    
    # Test 2: Login with existing credentials
    try:
        response = requests.post(
            f"{API_BASE}/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
            timeout=10
        )
        if response.status_code == 200:
            data = response.json()
            if "token" in data and "user" in data:
                results["login"] = True
                print_test("POST /api/auth/login (valid credentials)", True, 
                          f"Token received, User: {data['user'].get('email', 'N/A')}")
            else:
                print_test("POST /api/auth/login (valid credentials)", False, 
                          "Missing token or user in response")
        else:
            print_test("POST /api/auth/login (valid credentials)", False, 
                      f"Status: {response.status_code}")
    except Exception as e:
        print_test("POST /api/auth/login (valid credentials)", False, f"Error: {str(e)}")
    
    # Test 3: Stats endpoint
    try:
        response = requests.get(f"{API_BASE}/stats", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if "totals" in data and "leadsByStatus" in data:
                results["stats"] = True
                print_test("GET /api/stats", True, 
                          f"Totals: leads={data['totals'].get('leads', 0)}, clients={data['totals'].get('clients', 0)}, trips={data['totals'].get('trips', 0)}")
            else:
                print_test("GET /api/stats", False, "Missing required fields in response")
        else:
            print_test("GET /api/stats", False, f"Status: {response.status_code}")
    except Exception as e:
        print_test("GET /api/stats", False, f"Error: {str(e)}")
    
    # Test 4: Leads listing (read-only)
    try:
        response = requests.get(f"{API_BASE}/leads", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                results["leads"] = True
                print_test("GET /api/leads (list only)", True, f"Found {len(data)} leads")
            else:
                print_test("GET /api/leads (list only)", False, "Response is not an array")
        else:
            print_test("GET /api/leads (list only)", False, f"Status: {response.status_code}")
    except Exception as e:
        print_test("GET /api/leads (list only)", False, f"Error: {str(e)}")
    
    return results

def test_media_http_delivery():
    """Test HTTP delivery of media files"""
    print_section("MEDIA HTTP DELIVERY TEST")
    
    results = {}
    
    for media in MEDIA_FILES:
        media_name = media["path"]
        results[media_name] = {
            "exists": False,
            "status_200": False,
            "mime_correct": False,
            "size_match": False,
            "range_206": False,
            "content_range": False
        }
        
        print(f"\n--- Testing: {media_name} ---")
        
        # Check file exists on disk
        disk_path = Path(media["disk_path"])
        if disk_path.exists():
            disk_size = disk_path.stat().st_size
            disk_size_mb = disk_size / (1024 * 1024)
            results[media_name]["exists"] = True
            print_test(f"File exists on disk", True, f"Size: {disk_size_mb:.2f} MB ({disk_size} bytes)")
        else:
            print_test(f"File exists on disk", False, f"Not found: {media['disk_path']}")
            continue
        
        # Test 1: Full GET request
        try:
            url = f"{BASE_URL}{media['path']}"
            response = requests.get(url, timeout=15, stream=True)
            
            # Status code
            if response.status_code == 200:
                results[media_name]["status_200"] = True
                print_test(f"HTTP GET status", True, f"Status: {response.status_code}")
            else:
                print_test(f"HTTP GET status", False, f"Status: {response.status_code}")
                continue
            
            # MIME type
            content_type = response.headers.get("Content-Type", "")
            if media["expected_mime"] in content_type:
                results[media_name]["mime_correct"] = True
                print_test(f"MIME type", True, f"Content-Type: {content_type}")
            else:
                print_test(f"MIME type", False, f"Expected: {media['expected_mime']}, Got: {content_type}")
            
            # Content-Length vs disk size
            content_length = response.headers.get("Content-Length")
            if content_length:
                content_length = int(content_length)
                if content_length == disk_size:
                    results[media_name]["size_match"] = True
                    print_test(f"Content-Length matches disk", True, 
                              f"Content-Length: {content_length} bytes, Disk: {disk_size} bytes")
                else:
                    print_test(f"Content-Length matches disk", False, 
                              f"Content-Length: {content_length} bytes, Disk: {disk_size} bytes (diff: {abs(content_length - disk_size)} bytes)")
            else:
                print_test(f"Content-Length header", False, "Missing Content-Length header")
            
        except Exception as e:
            print_test(f"HTTP GET request", False, f"Error: {str(e)}")
            continue
        
        # Test 2: Range request (first 1KB)
        try:
            url = f"{BASE_URL}{media['path']}"
            headers = {"Range": "bytes=0-1023"}
            response = requests.get(url, headers=headers, timeout=15)
            
            if response.status_code == 206:
                results[media_name]["range_206"] = True
                print_test(f"Range request (206 Partial Content)", True, f"Status: {response.status_code}")
            else:
                print_test(f"Range request (206 Partial Content)", False, 
                          f"Expected: 206, Got: {response.status_code}")
            
            # Content-Range header
            content_range = response.headers.get("Content-Range")
            if content_range:
                results[media_name]["content_range"] = True
                print_test(f"Content-Range header", True, f"Content-Range: {content_range}")
            else:
                print_test(f"Content-Range header", False, "Missing Content-Range header")
            
        except Exception as e:
            print_test(f"Range request", False, f"Error: {str(e)}")
    
    return results

def test_video_metadata():
    """Test video metadata using ffprobe"""
    print_section("VIDEO METADATA TEST (ffprobe)")
    
    results = {}
    
    for media in MEDIA_FILES:
        if media["type"] != "video":
            continue
        
        media_name = media["path"]
        disk_path = media["disk_path"]
        results[media_name] = {
            "valid": False,
            "codec": None,
            "duration": None,
            "resolution": None,
            "bitrate": None
        }
        
        print(f"\n--- Analyzing: {media_name} ---")
        
        try:
            # Run ffprobe
            cmd = [
                "ffprobe",
                "-v", "quiet",
                "-print_format", "json",
                "-show_format",
                "-show_streams",
                disk_path
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=10)
            
            if result.returncode == 0:
                data = json.loads(result.stdout)
                
                # Extract video stream info
                video_stream = next((s for s in data.get("streams", []) if s.get("codec_type") == "video"), None)
                
                if video_stream:
                    results[media_name]["valid"] = True
                    results[media_name]["codec"] = video_stream.get("codec_name")
                    results[media_name]["resolution"] = f"{video_stream.get('width')}x{video_stream.get('height')}"
                    results[media_name]["bitrate"] = video_stream.get("bit_rate")
                    
                    format_info = data.get("format", {})
                    results[media_name]["duration"] = format_info.get("duration")
                    
                    print_test(f"Video is valid", True, 
                              f"Codec: {results[media_name]['codec']}, Resolution: {results[media_name]['resolution']}")
                    print(f"    Duration: {float(results[media_name]['duration']):.2f}s, Bitrate: {results[media_name]['bitrate']}")
                else:
                    print_test(f"Video is valid", False, "No video stream found")
            else:
                print_test(f"Video is valid", False, f"ffprobe error: {result.stderr}")
                
        except Exception as e:
            print_test(f"Video metadata", False, f"Error: {str(e)}")
    
    return results

def main():
    print("\n" + "="*80)
    print("  LOPEZ TRAVEL - READ-ONLY SMOKE TEST + MEDIA DELIVERY")
    print("="*80)
    print(f"\nBase URL: {BASE_URL}")
    print(f"API Base: {API_BASE}")
    
    # Run tests
    backend_results = test_backend_smoke()
    media_results = test_media_http_delivery()
    video_results = test_video_metadata()
    
    # Summary
    print_section("TEST SUMMARY")
    
    print("Backend Smoke Test (Read-Only):")
    for test, passed in backend_results.items():
        print(f"  {'✅' if passed else '❌'} {test}")
    
    print("\nMedia HTTP Delivery:")
    for media_path, checks in media_results.items():
        print(f"\n  {media_path}:")
        for check, passed in checks.items():
            print(f"    {'✅' if passed else '❌'} {check}")
    
    print("\nVideo Metadata:")
    for media_path, info in video_results.items():
        print(f"\n  {media_path}:")
        print(f"    {'✅' if info['valid'] else '❌'} valid: {info['valid']}")
        if info['valid']:
            print(f"    Codec: {info['codec']}, Resolution: {info['resolution']}")
    
    # Overall status
    backend_ok = all(backend_results.values())
    media_ok = all(all(checks.values()) for checks in media_results.values())
    video_ok = all(info['valid'] for info in video_results.values())
    
    print("\n" + "="*80)
    if backend_ok and media_ok and video_ok:
        print("  ✅ ALL TESTS PASSED")
    else:
        print("  ❌ SOME TESTS FAILED")
        if not backend_ok:
            print("     - Backend smoke test has failures")
        if not media_ok:
            print("     - Media HTTP delivery has failures")
        if not video_ok:
            print("     - Video metadata validation has failures")
    print("="*80 + "\n")

if __name__ == "__main__":
    main()
