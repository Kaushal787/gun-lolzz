"use client"
export default function BokehFX(){
  const circles = new Array(18).fill(0)
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <style>{`
        @keyframes lf_bokeh { 0%{ transform: translateY(0) translateX(0); opacity:.2 } 50%{ transform: translateY(-20vh) translateX(10vw); opacity:.35 } 100%{ transform: translateY(-40vh) translateX(-5vw); opacity:.15 } }
      `}</style>
      {circles.map((_,i)=> (
        <div key={i} className="absolute rounded-full" style={{
          left: `${(i*53)%100}%`,
          bottom: `${(i%6)*10}%`,
          width: `${120 + (i%4)*40}px`, height: `${120 + (i%4)*40}px`,
          background: 'radial-gradient(circle, rgba(255,255,255,.15), rgba(255,255,255,0))',
          filter: 'blur(8px)',
          animation: `lf_bokeh ${14 + (i%5)*2}s ease-in-out ${i*0.8}s infinite`
        }} />
      ))}
    </div>
  )
}

