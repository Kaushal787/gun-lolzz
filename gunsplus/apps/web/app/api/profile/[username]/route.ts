import { cookies } from 'next/headers'
import { deleteProfile, getProfile, upsertProfile } from '../../../../lib/store'

function isAdmin(request: Request) {
  const c = cookies()
  const adminCookie = c.get('admin')?.value === '1'
  const header = request.headers.get('x-admin-secret')
  const env = process.env.ADMIN_SECRET
  return adminCookie || (!!env && header === env)
}

export async function GET(_: Request, { params }: { params: { username: string } }) {
  const p = await getProfile(params.username)
  if (!p) return new Response('Not found', { status: 404 })
  return Response.json(p)
}

export async function PUT(request: Request, { params }: { params: { username: string } }) {
  if (!isAdmin(request)) return new Response('Unauthorized', { status: 401 })
  const body = (await request.json()) as any
  const rawLinks = Array.isArray(body.links) ? body.links : []
  const links = rawLinks
    .filter((l: any) => l && String(l.url || '').trim().length > 0)
    .map((l: any) => ({ label: String(l.label || '').trim() || 'Link', url: String(l.url).trim() }))
  const record = {
    username: params.username,
    displayName: body.displayName || params.username,
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

export async function DELETE(request: Request, { params }: { params: { username: string } }) {
  if (!isAdmin(request)) return new Response('Unauthorized', { status: 401 })
  const ok = await deleteProfile(params.username)
  return Response.json({ ok })
}
