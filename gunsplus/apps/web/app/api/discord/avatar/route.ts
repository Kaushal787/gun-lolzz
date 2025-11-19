export const runtime = 'nodejs'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const userId = url.searchParams.get('userId')
  if (!userId) return new Response('Missing userId', { status: 400 })

  try {
    const token = process.env.DISCORD_BOT_TOKEN
    if (token) {
      const res = await fetch(`https://discord.com/api/users/${encodeURIComponent(userId)}`, {
        headers: { Authorization: `Bot ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        let avatarUrl: string | null = null
        if (data.avatar) {
          const format = data.avatar.startsWith('a_') ? 'gif' : 'png'
          avatarUrl = `https://cdn.discordapp.com/avatars/${userId}/${data.avatar}.${format}?size=256`
        } else if (typeof data.discriminator !== 'undefined') {
          const idx = Number(data.discriminator) % 5
          avatarUrl = `https://cdn.discordapp.com/embed/avatars/${isNaN(idx) ? 0 : idx}.png`
        }
        const tag = data.global_name || (data.username ? `@${data.username}` : undefined)
        return Response.json({ avatarUrl, tag, source: 'discord' })
      }
      // If discord denied, fall through to fallback below
    }
    // Fallback: try unavatar (no token needed)
    const fallback = await fetch(`https://unavatar.io/discord/${encodeURIComponent(userId)}.json`).catch(() => null as any)
    if (fallback && fallback.ok) {
      const data = await fallback.json().catch(() => ({} as any))
      if (data?.url) {
        return Response.json({ avatarUrl: data.url, tag: undefined, source: 'unavatar' })
      }
    }
    return new Response('Discord fetch failed', { status: 502 })
  } catch (e) {
    return new Response('Discord fetch failed', { status: 500 })
  }
}
