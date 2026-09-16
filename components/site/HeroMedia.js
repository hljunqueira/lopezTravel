'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Film, Loader2, Pause, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'

const POSTER = '/media/brasil-cove-poster.jpg'

const HeroMedia = ({ motionRef }) => {
  const rootRef = useRef(null)
  const videoRef = useRef(null)
  const [preferences, setPreferences] = useState(null)
  const [source, setSource] = useState(null)
  const [inView, setInView] = useState(false)
  const [pageVisible, setPageVisible] = useState(true)
  const [userPaused, setUserPaused] = useState(false)
  const [blocked, setBlocked] = useState(false)
  const [failed, setFailed] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [hasPlayed, setHasPlayed] = useState(false)

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const connection = navigator.connection
    const updatePreferences = () => setPreferences({ reduced: motion.matches, saveData: Boolean(connection?.saveData) })
    const updateVisibility = () => setPageVisible(document.visibilityState === 'visible')
    updatePreferences()
    updateVisibility()
    motion.addEventListener('change', updatePreferences)
    connection?.addEventListener?.('change', updatePreferences)
    document.addEventListener('visibilitychange', updateVisibility)

    const observer = new IntersectionObserver(([entry]) => setInView(Boolean(entry?.isIntersecting)), { threshold: 0 })
    if (rootRef.current) observer.observe(rootRef.current)

    return () => {
      motion.removeEventListener('change', updatePreferences)
      connection?.removeEventListener?.('change', updatePreferences)
      document.removeEventListener('visibilitychange', updateVisibility)
      observer.disconnect()
    }
  }, [])

  const enabled = Boolean(preferences && !preferences.reduced && !preferences.saveData)

  useEffect(() => {
    if (enabled && inView && !source) {
      setSource(window.matchMedia('(max-width: 767px)').matches ? '/media/brasil-cove-mobile.mp4' : '/media/brasil-cove-desktop.mp4')
    }
  }, [enabled, inView, source])

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
    return () => { active = false; video.pause() }
  }, [enabled, source, inView, pageVisible, userPaused, blocked, failed])

  const pauseRequested = !userPaused && !blocked
  const togglePlayback = () => {
    if (pauseRequested) {
      setUserPaused(true)
      videoRef.current?.pause()
      return
    }
    setUserPaused(false)
    setBlocked(false)
    // Call directly from the gesture to support browsers that block autoplay.
    videoRef.current?.play()?.catch((error) => {
      if (error?.name === 'NotAllowedError') setBlocked(true)
      else if (error?.name !== 'AbortError') setFailed(true)
    })
  }

  const staticMessage = failed ? 'Vídeo indisponível · exibindo fotografia' : preferences?.reduced ? 'Movimento reduzido · fotografia' : preferences?.saveData ? 'Economia de dados · fotografia' : null

  return (
    <div ref={rootRef} className="pointer-events-none absolute inset-0" data-testid="hero-media" data-playback={staticMessage ? 'static' : blocked ? 'blocked' : playing ? 'playing' : userPaused ? 'paused' : 'idle'}>
      <div ref={motionRef} className="absolute -inset-x-2 -inset-y-[8%] motion-safe:will-change-transform">
        <Image src={POSTER} alt="Vista aérea de uma enseada do litoral brasileiro, com mar azul-esverdeado e montanhas cobertas de vegetação" fill priority sizes="100vw" className="object-cover object-[62%_center] md:object-center" />
        <video
          ref={videoRef}
          id="hero-background-video"
          src={enabled ? source || undefined : undefined}
          poster={POSTER}
          muted
          loop
          playsInline
          preload="none"
          disablePictureInPicture
          disableRemotePlayback
          aria-hidden="true"
          tabIndex={-1}
          onPlaying={() => { setPlaying(true); setHasPlayed(true) }}
          onPause={() => setPlaying(false)}
          onError={() => { if (enabled && source) setFailed(true) }}
          className={`absolute inset-0 h-full w-full object-cover object-[62%_center] transition-opacity duration-1000 motion-reduce:transition-none md:object-center ${hasPlayed && enabled && !failed && !blocked ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/35 to-background/10" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />
      <div className="absolute inset-x-0 bottom-0 z-30">
        <div className="container flex justify-end pb-7 sm:pb-9">
          {staticMessage ? (
            <span role="status" className="inline-flex max-w-[185px] items-center gap-2 text-[10px] leading-relaxed text-foreground/60 sm:max-w-none sm:text-xs">
              <Film className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />{staticMessage}
            </span>
          ) : enabled ? (
            <Button type="button" variant="outline" size="sm" onClick={togglePlayback} aria-controls="hero-background-video" aria-label={pauseRequested ? 'Pausar vídeo' : 'Reproduzir vídeo'} className="pointer-events-auto h-11 gap-2.5 rounded-full border-foreground/25 bg-background/30 px-4 text-[11px] text-foreground backdrop-blur-sm hover:border-primary/60 hover:bg-background/60 hover:text-foreground focus-visible:ring-2">
              {pauseRequested ? (!hasPlayed && !playing ? <Loader2 className="motion-safe:animate-spin" aria-hidden="true" /> : <Pause aria-hidden="true" />) : <Play aria-hidden="true" />}
              {pauseRequested ? 'Pausar vídeo' : 'Reproduzir vídeo'}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default HeroMedia
