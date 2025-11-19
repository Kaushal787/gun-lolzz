import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const u = searchParams.get('u') || 'gunsplus'
  const title = `@${u} | gunsplus`

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg,#1a0f1f,#0b0b0b)',
          color: 'white',
          fontSize: 64,
        }}
      >
        <div style={{ fontWeight: 700 }}>guns+</div>
        <div style={{ fontSize: 36, opacity: 0.9 }}>{title}</div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}

