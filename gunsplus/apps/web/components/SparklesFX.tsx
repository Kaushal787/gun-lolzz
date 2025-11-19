"use client"
export default function SparklesFX(){
  const dots = new Array(60).fill(0)
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <style>{`
        @keyframes lf_sparkle { 0%{transform:translateY(0) scale(0.6); opacity:.0} 10%{opacity:.8} 100%{transform:translateY(-120vh) scale(1); opacity:0} }
      `}</style>
      {dots.map((_,i)=> (
        <div key={i} className="absolute" style={{
          left: `${(i*137)%100}%`,
          bottom: `${- (i%10)*20}px`,
          width: 3 + (i%3), height: 3 + (i%3),
          borderRadius: 9999,
          background: 'rgba(255,255,255,.8)',
          filter: 'drop-shadow(0 0 6px rgba(255,255,255,.6))',
          animation: `lf_sparkle ${6 + (i%5)}s linear ${i*0.15}s infinite`
        }} />
      ))}
    </div>
  )
}

