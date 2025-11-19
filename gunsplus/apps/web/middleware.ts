import { NextResponse, NextRequest } from 'next/server'

const DEFAULT_PUBLIC_PROFILE = process.env.DEFAULT_PUBLIC_PROFILE || 'ZEUS'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const def = `/${DEFAULT_PUBLIC_PROFILE}`

  // Always allow assets and static
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/uploads') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt'
  ) {
    return NextResponse.next()
  }

  // Allow API generally, but protect admin API by cookie
  if (pathname.startsWith('/api')) {
    if (pathname.startsWith('/api/admin')) {
      const admin = req.cookies.get('admin')?.value === '1'
      if (!admin) return new NextResponse('Forbidden', { status: 403 })
    }
    return NextResponse.next()
  }

  // Admin pages: require cookie except login page
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    if (pathname === '/admin/login') return NextResponse.next()
    const admin = req.cookies.get('admin')?.value === '1'
    if (!admin) return NextResponse.redirect(new URL(def, req.url))
    return NextResponse.next()
  }

  // Only allow the default public profile page; redirect everything else
  if (pathname === def) return NextResponse.next()

  // Redirect root and all other pages to the public profile
  return NextResponse.redirect(new URL(def, req.url))
}

export const config = {
  matcher: ['/((?!_next/static).*)'],
}

