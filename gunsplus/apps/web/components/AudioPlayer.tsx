"use client"
import React, { useEffect, useRef, useState } from 'react'

export default function AudioPlayer({ src, autoPlay = true, showSlider = true }: { src: string; autoPlay?: boolean; showSlider?: boolean }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [muted, setMuted] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [blocked, setBlocked] = useState(false)
  const [volume, setVolume] = useState(1)

  // Try autoplay at full volume; on failure, try muted autoplay
  useEffect(() => {
    const a = audioRef.current
    if (!a || !autoPlay) return
    a.volume = 1
    a.muted = false
    a.play().then(() => {
      setPlaying(true)
      setBlocked(false)
    }).catch(() => {
      a.muted = true
      setMuted(true)
      a.play().then(() => {
        setPlaying(true)
        setBlocked(true)
      }).catch(() => setBlocked(true))
    })
  }, [autoPlay])

  function toggleMute() {
    const a = audioRef.current; if (!a) return
    a.muted = !a.muted
    setMuted(a.muted)
    if (a.muted === false && a.paused) a.play().catch(()=>{})
  }

  return (
    <>
      {/* floating volume HUD (expands on hover) */}
      <div className="fixed top-4 left-4 z-50 group hud hud-btn rounded-2xl px-3 py-2" data-muted={muted}
           style={{boxShadow:'0 4px 16px rgba(0,0,0,0.35), 0 0 10px rgba(255,255,255,0.12)'}}>
        <button
          onClick={toggleMute}
          aria-label={muted ? 'Unmute' : 'Mute'}
          title={muted ? 'Unmute' : 'Mute'}
          className="p-0 m-0 hud-icon"
        >
          <SpeakerIcon muted={muted} />
        </button>
        {showSlider && (
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e)=>{
            const v = Number(e.target.value)
            setVolume(v)
            const a = audioRef.current; if (a) { a.volume = v; if (a.muted && v>0) { a.muted=false; setMuted(false) } }
          }}
          className="hud-slider hud-range w-0 group-hover:w-28 transition-all duration-300 ease-out"
          onMouseEnter={()=>{
            const a = audioRef.current; if (a && a.muted) { a.muted=false; setMuted(false) }
          }}
        />
        )}
      </div>
      {/* Hidden audio element; UI is just the mute button */}
      <audio ref={audioRef} src={src} preload="auto" playsInline className="hidden" />
    </>
  )
}

function SpeakerIcon({ muted }: { muted: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* speaker */}
      <path d="M11 5v14l-5-4H3V9h3l5-4z" fill="currentColor" opacity="0.9" />
      {muted ? (
        <g>
          <line x1="16" y1="8" x2="22" y2="14" />
          <line x1="16" y1="14" x2="22" y2="8" />
        </g>
      ) : (
        <g>
          <path d="M16 9a5 5 0 0 1 0 6" />
          <path d="M18.5 6.5a8.5 8.5 0 0 1 0 11" />
        </g>
      )}
    </svg>
  )}
