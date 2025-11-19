import { cookies } from 'next/headers'
import { getProfile, upsertProfile } from '../../../lib/store'

function isAdmin(request: Request) {
  const c = cookies()
  const adminCookie = c.get('admin')?.value === '1'
  const header = request.headers.get('x-admin-secret')
  const env = process.env.ADMIN_SECRET
  return adminCookie || (!!env && header === env)
}

export async function POST(request: Request) {
  if (!isAdmin(request)) return new Response('Unauthorized', { status: 401 })
  const body = (await request.json()) as any
  const username = String(body.username || '').trim()
  if (!username) return new Response('username required', { status: 400 })
  const exists = await getProfile(username)
  if (exists) return new Response('username taken', { status: 409 })
  const rawLinks = Array.isArray(body.links) ? body.links : []
  const links = rawLinks
    .filter((l: any) => l && String(l.url || '').trim().length > 0)
    .map((l: any) => ({ label: String(l.label || '').trim() || 'Link', url: String(l.url).trim() }))
  const record = {
    username,
    displayName: body.displayName || username,
    bio: body.bio || null,
    avatarUrl: body.avatarUrl || null,
    discordTag: body.discordTag || null,
    discordStatus: body.discordStatus || null,
    guildTag: body.guildTag || null,
    guildTagColor: body.guildTagColor || null,
    location: body.location || null,
    links,
    theme: body.theme || {},
  }
  const saved = await upsertProfile(record)
  return Response.json(saved)
}
