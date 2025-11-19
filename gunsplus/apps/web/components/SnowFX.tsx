"use client"
import React from 'react'

export default function SnowFX() {
  const flakes = new Array(20).fill(0)
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <style>{`
        @keyframes lf_snow_fall {
          0% { transform: translateY(-10%) translateX(0); opacity: 0; }
          10% { opacity: 0.8; }
          100% { transform: translateY(110%) translateX(20px); opacity: 0.9; }
        }
      `}</style>
      {flakes.map((_, i) => (
        <div
          key={i}
          className="absolute text-white/90"
          style={{
            left: `${(i * 7) % 100}%`,
            top: `${-(i % 5) * 10}%`,
            animation: `lf_snow_fall ${8 + (i % 5)}s linear ${i * 0.6}s infinite`,
            fontSize: `${8 + (i % 6) * 2}px`,
          }}
        >
          ❅
        </div>
      ))}
    </div>
  )
}

