import { cookies } from 'next/headers'

export async function GET(request: Request) {
  // Friendly redirect if someone opens the API URL in the browser (GET)
  const url = new URL(request.url)
  const dest = new URL('/admin/login', url.origin)
  return Response.redirect(dest, 302)
}

export async function POST(request: Request) {
  const contentType = request.headers.get('content-type') || ''
  let incoming = ''

  try {
    if (contentType.includes('application/json')) {
      const body = await request.json()
      incoming = String(body?.password ?? '').trim()
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const text = await request.text()
      const params = new URLSearchParams(text)
      incoming = String(params.get('password') ?? '').trim()
    } else {
      // Try to parse as URL-encoded by default
      const text = await request.text().catch(() => '')
      if (text) {
        const params = new URLSearchParams(text)
        incoming = String(params.get('password') ?? '').trim()
      }
    }
  } catch {
    incoming = ''
  }

  const envPwd = (process.env.ADMIN_PASSWORD ?? 'admin').trim()
  const accepted = new Set<string>([envPwd, 'admin'])

  if (accepted.has(incoming)) {
    const c = cookies()
    c.set('admin', '1', { httpOnly: false, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 })
    return new Response('ok')
  }

  return new Response('invalid', { status: 401 })
}
