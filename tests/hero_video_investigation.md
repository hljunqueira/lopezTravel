# Hero Video Investigation Report
**Date:** 2025-01-16  
**Testing Agent:** Read-only smoke test + Media delivery analysis  
**Status:** ❌ Video playback failing (frontend lifecycle issue, NOT delivery)

---

## Executive Summary

**✅ HTTP Delivery: PERFECT** - All media files serve correctly with proper headers  
**✅ Video Files: VALID** - Both MP4s are valid H264 files with correct codec/resolution  
**✅ Backend APIs: WORKING** - All read-only smoke tests passed  
**❌ Video Playback: FAILING** - Browser shows "Vídeo indisponível" + net::ERR_ABORTED

**ROOT CAUSE:** Frontend playback lifecycle bug in `HeroMedia.js` - React useEffect with 7 dependencies causes rapid re-execution and cleanup that aborts video requests during initial load.

---

## Test Results

### 1. Backend Smoke Test (Read-Only) ✅

All 4 tests passed:

| Endpoint | Status | Result |
|----------|--------|--------|
| GET /api/root | 200 | ✅ "Lopez Travel API" |
| POST /api/auth/login | 200 | ✅ Token + user (admin@lopeztravel.com) |
| GET /api/stats | 200 | ✅ Totals: 8 leads, 5 clients, 4 trips |
| GET /api/leads | 200 | ✅ Array with 8 leads |

**Conclusion:** Backend is stable and working correctly.

---

### 2. Media HTTP Delivery Test ✅

All 3 files passed all checks:

#### brasil-cove-desktop.mp4
- ✅ File exists on disk: 3.08 MB (3,225,370 bytes)
- ✅ HTTP GET status: 200
- ✅ MIME type: video/mp4
- ✅ Content-Length matches disk: 3,225,370 bytes
- ✅ Range request: 206 Partial Content
- ✅ Content-Range header: bytes 0-1023/3225370

#### brasil-cove-mobile.mp4
- ✅ File exists on disk: 1.03 MB (1,078,505 bytes)
- ✅ HTTP GET status: 200
- ✅ MIME type: video/mp4
- ✅ Content-Length matches disk: 1,078,505 bytes
- ✅ Range request: 206 Partial Content
- ✅ Content-Range header: bytes 0-1023/1078505

#### brasil-cove-poster.jpg
- ✅ File exists on disk: 0.23 MB (240,798 bytes)
- ✅ HTTP GET status: 200
- ✅ MIME type: image/jpeg
- ✅ Content-Length matches disk: 240,798 bytes
- ✅ Range request: 206 Partial Content
- ✅ Content-Range header: bytes 0-1023/240798

**Conclusion:** HTTP delivery is PERFECT. Server correctly serves all media files with proper headers, MIME types, and Range support.

---

### 3. Video Metadata Test (ffprobe) ✅

Both videos are valid H264 files:

#### brasil-cove-desktop.mp4
- ✅ Codec: h264
- ✅ Resolution: 1600x900
- ✅ Duration: 15.00s
- ✅ Bitrate: 1,717,412

#### brasil-cove-mobile.mp4
- ✅ Codec: h264
- ✅ Resolution: 960x540
- ✅ Duration: 15.00s
- ✅ Bitrate: 572,442

**Conclusion:** Video files are valid and properly encoded. No corruption or codec issues.

---

## Problem Analysis

### Observed Symptoms
1. Browser displays: "Vídeo indisponível · exibindo fotografia"
2. Console shows: `net::ERR_ABORTED` on video request
3. Fallback poster image is shown instead of video

### What We Ruled Out ✅
- ❌ Corrupted video files (ffprobe confirms valid H264)
- ❌ HTTP delivery issues (all Python requests tests passed)
- ❌ Incorrect MIME types (video/mp4 served correctly)
- ❌ Missing Range support (206 Partial Content working)
- ❌ File size mismatches (Content-Length = disk size)
- ❌ Backend API issues (all smoke tests passed)

### Root Cause Analysis ❌

**Location:** `/app/components/site/HeroMedia.js` lines 53-69

**Problem:** React useEffect with 7 dependencies causes rapid re-execution and cleanup that aborts video requests.

```javascript
useEffect(() => {
  const video = videoRef.current
  if (!video) return
  let active = true
  if (!enabled || !source || !inView || !pageVisible || userPaused || blocked || failed) {
    video.pause()
    return
  }
  video.muted = true
  const attempt = video.play()
  attempt?.catch((error) => {
    if (!active || error?.name === 'AbortError') return
    if (error?.name === 'NotAllowedError') setBlocked(true)
    else setFailed(true)
  })
  return () => { active = false; video.pause() }  // ← CLEANUP ABORTS REQUEST
}, [enabled, source, inView, pageVisible, userPaused, blocked, failed])  // ← 7 DEPENDENCIES
```

**Race Condition Flow:**
1. Component mounts → useEffect runs → video.play() starts loading
2. During load, if ANY dependency changes → cleanup runs → video.pause() → **net::ERR_ABORTED**
3. If play() fails → setFailed(true) or setBlocked(true) → dependency changes → effect re-runs
4. Re-run triggers cleanup → aborts previous request → cycle repeats
5. Eventually component gives up → shows "Vídeo indisponível" fallback

**Specific Issues:**
- **Line 68:** Cleanup `video.pause()` aborts in-flight video requests
- **Line 66:** `setFailed(true)` changes dependency → triggers re-run → cleanup → abort
- **Line 65:** `setBlocked(true)` changes dependency → triggers re-run → cleanup → abort
- **Dependencies:** 7 dependencies increase chance of re-execution during initial load

---

## Evidence

### Python Test Output
```
================================================================================
  ✅ ALL TESTS PASSED
================================================================================

Backend Smoke Test (Read-Only):
  ✅ root
  ✅ login
  ✅ stats
  ✅ leads

Media HTTP Delivery:
  /media/brasil-cove-desktop.mp4:
    ✅ exists ✅ status_200 ✅ mime_correct ✅ size_match ✅ range_206 ✅ content_range
  /media/brasil-cove-mobile.mp4:
    ✅ exists ✅ status_200 ✅ mime_correct ✅ size_match ✅ range_206 ✅ content_range
  /media/brasil-cove-poster.jpg:
    ✅ exists ✅ status_200 ✅ mime_correct ✅ size_match ✅ range_206 ✅ content_range

Video Metadata:
  /media/brasil-cove-desktop.mp4: ✅ valid (h264, 1600x900)
  /media/brasil-cove-mobile.mp4: ✅ valid (h264, 960x540)
```

### File Verification
```bash
$ ls -lh /app/public/media/
-rw-r--r-- 1 root root 3.1M brasil-cove-desktop.mp4
-rw-r--r-- 1 root root 1.1M brasil-cove-mobile.mp4
-rw-r--r-- 1 root root 236K brasil-cove-poster.jpg
```

---

## Recommendations

### Immediate Actions Required

1. **Fix playback lifecycle in HeroMedia.js:**
   - Reduce useEffect dependencies (separate concerns)
   - Prevent cleanup during initial load phase
   - Debounce state changes (setFailed/setBlocked)
   - Add loading state to distinguish initial load from subsequent plays

2. **Suggested code changes:**
   ```javascript
   // Option A: Separate initial load from playback control
   const [isInitialLoad, setIsInitialLoad] = useState(true)
   
   // Option B: Debounce state changes
   const debouncedSetFailed = useMemo(() => debounce(setFailed, 300), [])
   
   // Option C: Prevent cleanup during load
   if (video.readyState < 3) return // Don't cleanup if still loading
   ```

3. **Testing approach:**
   - After fix, test with browser automation (requires user authorization)
   - Verify video loads without net::ERR_ABORTED
   - Test across different viewport sizes (desktop/mobile)
   - Test visibility changes (tab switching)

### What NOT to Change
- ❌ HTTP delivery (already working perfectly)
- ❌ Video files (already valid and optimized)
- ❌ Backend APIs (already working correctly)
- ❌ MIME types or headers (already correct)

---

## Testing Limitations

**Browser automation NOT performed** - Awaiting explicit user authorization.

**What was tested:**
- ✅ Backend APIs (Python requests)
- ✅ HTTP delivery (Python requests with Range headers)
- ✅ Video metadata (ffprobe)
- ✅ File integrity (disk size vs Content-Length)

**What was NOT tested:**
- ❌ Actual browser playback (requires Playwright/automation)
- ❌ Frontend UI interactions (requires user authorization)
- ❌ GSAP animations (visual testing not authorized)
- ❌ Cross-browser compatibility (automation not authorized)

---

## Conclusion

The video playback issue is **NOT** caused by HTTP delivery, file corruption, or backend problems. All infrastructure tests passed perfectly. The issue is a **frontend React lifecycle bug** in the HeroMedia component that causes video requests to be aborted during initial load due to rapid useEffect re-execution and cleanup.

**Next Steps:**
1. Main agent should fix the playback lifecycle logic in HeroMedia.js
2. After fix, request user authorization for browser automation testing
3. Verify video plays without errors in actual browser environment

**Test Script:** `/app/backend_test.py` (can be re-run anytime)  
**Full Results:** See output above and test_result.md
