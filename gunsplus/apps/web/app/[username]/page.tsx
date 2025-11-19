import type { Metadata } from 'next'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { getProfile } from '../../lib/store'
import SnowFX from '../../components/SnowFX'
import SparklesFX from '../../components/SparklesFX'
import BokehFX from '../../components/BokehFX'
import LinkItem from '../../components/LinkItem'

type Params = { params: { username: string } }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const u = params.username
  return {
    title: `@${u} | gunsplus`,
    description: `Profile for @${u} on gunsplus.`,
    openGraph: {
      title: `@${u} | gunsplus`,
      images: [ { url: `/api/og?u=${encodeURIComponent(u)}`, width: 1200, height: 630 } ],
    },
    themeColor: '#ffffff',
  }
}

export default async function Profile({ params }: Params) {
  const { username } = params
  const profile = (await getProfile(username)) || { username, displayName: username, links: [] }

  const t = profile.theme || {}
  const styleVars: React.CSSProperties = {
    // @ts-ignore CSS vars
    '--accent': t.accent || '#ffffff',
    '--accent2': t.accent || '#ffffff',
    '--text': t.text || '#ffffff',
    '--backdrop': t.backdrop || 'rgba(255,255,255,0.10)',
    '--containerOpacity': String(t.profileOpacity ?? 0.12),
    '--containerBlur': `${t.profileBlur ?? 8}px`,
    '--iconTint': t.iconColor || '#ffffff',
  } as React.CSSProperties

  const AudioPlayer = dynamic(() => import('../../components/AudioPlayer'), { ssr: false })

  const discordUIDFrom = (s: string): string | null => {
    const trimmed = (s || '').trim()
    if (/^\d{17,20}$/.test(trimmed)) return trimmed
    try {
      const u = new URL(trimmed, 'https://example.com')
      if ((u.hostname.includes('discord.com') || u.hostname.includes('discordapp.com')) && u.pathname.startsWith('/users/')) {
        const id = u.pathname.split('/').pop() || ''
        if (/^\d{17,20}$/.test(id)) return id
      }
    } catch {}
    return null
  }

  const bg = profile.theme?.backgroundUrl || ''
  const isVideo = /\.(mp4|webm)$/i.test(bg)
  const displayTitle = (profile.username.toLowerCase() === 'yourname' && (!profile.displayName || profile.displayName.trim() === ''))
    ? 'ZΞUS'
    : profile.displayName
  // Only render non-empty links (prevents blank rows)
  const links = (profile.links || []).filter((l: any) => String(l?.url || '').trim().length > 0)

  return (
    <main className="min-h-dvh relative">
      {bg && isVideo && (
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src={bg} />
        </video>
      )}
      {bg && !isVideo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={bg} alt="" className="absolute inset-0 w-full h-full object-cover" />
      )}

      <div className="absolute inset-0" style={{ background: t.gradientEnabled ? `linear-gradient(135deg, ${t.accent||'#ffffff'}22, ${t.accent2||t.accent||'#ffffff'}22)` : (t.backgroundColor||'transparent') }} />
      {t.backgroundEffect === 'snow' && <SnowFX />}
      {t.backgroundEffect === 'sparkles' && <SparklesFX />}
      {t.backgroundEffect === 'bokeh' && <BokehFX />}

      <div className="relative min-h-dvh flex flex-col items-center justify-center p-4 gap-6" style={styleVars}>
        <div className="relative text-center space-y-3">
          <div className="pointer-events-none absolute -inset-10 -z-10 rounded-[2rem]" style={{
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0) 75%)'
          }} />
          {profile.avatarUrl && (
            <div className="mx-auto relative w-32 h-32">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={profile.avatarUrl} alt="avatar" className="w-32 h-32 rounded-full border border-white/30 shadow" style={{ boxShadow:'0 0 22px rgba(255,255,255,0.38)' }} />
              {(() => {
                const st = (profile as any).discordStatus as ('online'|'idle'|'dnd'|'offline'|null)|undefined
                if (!st || st === 'offline') return null
                const color = st === 'online' ? '#22c55e' : st === 'idle' ? '#f59e0b' : '#ef4444'
                return (
                  <span
                    title={st.toUpperCase()}
                    className="absolute w-6 h-6 rounded-full grid place-items-center"
                    style={{ background: color, boxShadow:'0 0 6px rgba(0,0,0,.35)', outline:'2px solid #0b0b0b', bottom:'4px', right:'4px', transform:'translate(-15%,-15%)' }}
                  >
                    {st === 'dnd' && <span className="w-3 h-[3px] rounded bg-white" />}
                  </span>
                )
              })()}
            </div>
          )}
          <h1 className="text-5xl font-extrabold glow" style={{ color: 'var(--text)' }}>{displayTitle}</h1>
          <div className="text-neutral-200 glow flex items-center justify-center gap-2">
            @{profile.username}{profile.discordTag ? <span className="ml-2 text-neutral-300">· {profile.discordTag}</span> : null}
            {(() => {
              const text = (profile as any).guildTag || ''
              if (!text) return null
              return (
                <span className="ml-1 text-xs px-2 py-0.5 rounded-md border border-white/10 flex items-center gap-1" style={{ background: (profile as any).guildTagColor || 'rgba(17,24,39,0.6)' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="text-cyan-300">
                    <path d="M13 3L4 14h6l-1 7 9-11h-6l1-7z"/>
                  </svg>
                  {text}
                </span>
              )
            })()}
          </div>
          {profile.location ? (
            <div className="text-neutral-300 glow flex items-center justify-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="opacity-90">
                <path d="M12 2C8.686 2 6 4.686 6 8c0 5.25 6 14 6 14s6-8.75 6-14c0-3.314-2.686-6-6-6zm0 8.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
              </svg>
              <span>{profile.location}</span>
            </div>
          ) : null}
          {profile.bio ? (
            <p className="text-neutral-200 font-semibold max-w-2xl mx-auto glow" style={{ textShadow:'0 0 14px rgba(255,255,255,0.35)' }}>{profile.bio}</p>
          ) : null}
        </div>

        {profile.theme?.audioUrl ? (
          <div className="w-full max-w-2xl">
            <AudioPlayer src={profile.theme.audioUrl} autoPlay={true} showSlider={t.showVolume ?? true} />
          </div>
        ) : null}

        {(((t.showIconRow ?? false) || links.length === 1)) && (
          <div className="flex gap-3 flex-wrap justify-center">
            {links.map((l) => {
              const uid = discordUIDFrom(l.url)
              if (uid) {
                return (
                  <LinkItem key={l.label+uid+':circle'} type="circle" icon={{ kind: 'discord' }} monochrome={!!t.monochromeIcons} iconTint={'var(--iconTint)'} glow={true} copyText={uid} label={l.label} />
                )
              }
              let host = 'example.com'
              try { const u = new URL(l.url, 'https://example.com'); host = u.hostname.replace(/^www\./,'') } catch {}
              const icon = `https://icons.duckduckgo.com/ip3/${host}.ico`
              return (
                <LinkItem key={l.label+host+':circle'} type="circle" icon={{ kind: 'url', url: icon }} monochrome={!!t.monochromeIcons} iconTint={'var(--iconTint)'} glow={true} href={l.url} label={l.label} />
              )
            })}
          </div>
        )}

        <div className="w-full max-w-xl rounded-2xl p-6 md:p-8 space-y-4 glassy" style={{ background: `rgba(255,255,255,var(--containerOpacity))`, backdropFilter: `blur(var(--containerBlur))` }}>
          <div className="grid gap-3">
            {links.map((l) => {
              const uid = discordUIDFrom(l.url)
              if (uid) {
                return (
                  <LinkItem key={l.label+uid+':button'} type="button" icon={{ kind: 'discord' }} monochrome={!!t.monochromeIcons} iconTint={'var(--iconTint)'} glow={!!t.glowSocials} copyText={uid} label={l.label} />
                )
              }
              let host = 'example.com'
              try { const u = new URL(l.url, 'https://example.com'); host = u.hostname.replace(/^www\./,'') } catch {}
              const icon = `https://icons.duckduckgo.com/ip3/${host}.ico`
              return (
                <LinkItem key={l.label+host+':button'} type="button" icon={{ kind: 'url', url: icon }} monochrome={!!t.monochromeIcons} iconTint={'var(--iconTint)'} glow={!!t.glowSocials} href={l.url} label={l.label} />
              )
            })}
          </div>
        </div>
      </div>
    </main>
  )
}