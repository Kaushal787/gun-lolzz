"use client"
import { useEffect, useState } from 'react'

type Link = { label: string; url: string }
type Theme = {
  accent?: string
  text?: string
  backdrop?: string
  backgroundUrl?: string | null
  audioUrl?: string | null
  accent2?: string | null
  backgroundColor?: string | null
  iconColor?: string | null
  gradientEnabled?: boolean
  profileOpacity?: number | null
  profileBlur?: number | null
  backgroundEffect?: 'none' | 'snow' | 'sparkles' | 'bokeh'
  usernameEffect?: 'none' | 'glow' | 'typewriter'
  monochromeIcons?: boolean
  swapBoxColors?: boolean
  showVolume?: boolean
  useDiscordAvatar?: boolean
  avatarDecoration?: boolean
}
type Profile = { username: string; displayName: string; bio?: string | null; avatarUrl?: string | null; discordUserId?: string | null; discordTag?: string | null; discordStatus?: 'online' | 'idle' | 'dnd' | 'offline' | null; guildTag?: string | null; guildTagColor?: string | null; location?: string | null; links: Link[]; theme?: Theme }

export default function Admin() {
  const [username, setUsername] = useState('ZEUS')
  const [profile, setProfile] = useState<Profile | null>(null)
  const [msg, setMsg] = useState('')
  const bgInputRef = useState<HTMLInputElement | null>(null)[0]
  const audioInputRef = useState<HTMLInputElement | null>(null)[0]

  async function load(u: string) {
    const res = await fetch(`/api/profile/${encodeURIComponent(u)}`)
    if (res.ok) setProfile(await res.json())
    else setProfile({ username: u, displayName: u, links: [], theme: {} })
  }

  useEffect(() => { load(username) }, [])

  const updateLink = (i: number, key: keyof Link, value: string) => {
    if (!profile) return
    const links = profile.links.slice()
    const l = links[i]
    links[i] = { ...l, [key]: value }
    setProfile({ ...profile, links })
  }

  return (
    <main className="min-h-dvh p-6">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex gap-2">
          <input className="px-3 py-2 rounded bg-white/10 border border-white/20" value={username} onChange={(e)=>setUsername(e.target.value)} />
          <button className="px-3 py-2 rounded bg-brand" onClick={()=>load(username)}>Load</button>
        </div>

        {profile && (
          <div className="grid gap-4">
            <div className="frost rounded-xl p-4 grid gap-2">
              <h2 className="font-semibold">Profile</h2>
              <input className="px-3 py-2 rounded bg-white/10 border border-white/20" value={profile.displayName} onChange={(e)=>setProfile({...profile!, displayName:e.target.value})} placeholder="Display name" />
              <textarea className="px-3 py-2 rounded bg-white/10 border border-white/20" value={profile.bio||''} onChange={(e)=>setProfile({...profile!, bio:e.target.value})} placeholder="Bio" />
              <div className="flex gap-2">
                <input className="flex-1 px-3 py-2 rounded bg-white/10 border border-white/20" value={profile.avatarUrl||''} placeholder="Avatar URL (.jpg/.png)" onChange={(e)=>setProfile({...profile!, avatarUrl:e.target.value})} />
                <button className="px-3 py-2 rounded bg-white/10 border border-white/20" onClick={()=>{
                  const el = document.createElement('input'); el.type='file'; el.accept='image/*'; el.onchange = async () => {
                    const f = el.files?.[0]; if(!f) return;
                    const fd = new FormData(); fd.append('file', f)
                    const res = await fetch('/api/upload',{method:'POST', body: fd});
                    if(res.ok){ const data = await res.json(); setProfile({...profile!, avatarUrl: data.url}); setMsg('Uploaded avatar') } else setMsg('Upload failed')
                  }; el.click();
                }}>Upload</button>
              </div>
              <div className="grid md:grid-cols-2 gap-2">
                <input className="px-3 py-2 rounded bg-white/10 border border-white/20" value={profile.discordTag||''} placeholder="Discord Tag (e.g. @name)" onChange={(e)=>setProfile({...profile!, discordTag:e.target.value})} />
                <div className="flex gap-2">
                  <input className="flex-1 px-3 py-2 rounded bg-white/10 border border-white/20" value={profile.discordUserId||''} placeholder="Discord User ID (UID)" onChange={(e)=>setProfile({...profile!, discordUserId:e.target.value})} />
                  <button className="px-3 py-2 rounded bg-white/10 border border-white/20" onClick={async()=>{
                    if(!profile.discordUserId){ setMsg('Enter Discord UID'); return }
                    const res = await fetch(`/api/discord/avatar?userId=${encodeURIComponent(profile.discordUserId)}`)
                    if(res.ok){ const data = await res.json(); setProfile({...profile!, avatarUrl: data.avatarUrl || profile.avatarUrl, discordTag: data.tag || profile.discordTag}); setMsg('Fetched from Discord') } else { setMsg('Discord fetch failed') }
                  }}>Fetch</button>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm">Discord Status</label>
                  <select className="px-3 py-2 rounded bg-white/10 border border-white/20" value={profile.discordStatus||'offline'} onChange={(e)=>setProfile({...profile!, discordStatus: e.target.value as any})}>
                    <option value="online">Online</option>
                    <option value="idle">Idle</option>
                    <option value="dnd">Do Not Disturb</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm">Guild Tag (badge text)</label>
                  <input className="px-3 py-2 rounded bg-white/10 border border-white/20" value={profile.guildTag||''} placeholder="e.g. ⚡ツフ" onChange={(e)=>setProfile({...profile!, guildTag:e.target.value})} />
                </div>
                <div className="grid gap-2 md:col-span-2">
                  <label className="text-sm">Guild Tag Color (bg)</label>
                  <input className="px-3 py-2 rounded bg-white/10 border border-white/20" value={profile.guildTagColor||''} placeholder="#111827 or rgba()" onChange={(e)=>setProfile({...profile!, guildTagColor:e.target.value})} />
                </div>
                <input className="px-3 py-2 rounded bg-white/10 border border-white/20 md:col-span-2" value={profile.location||''} placeholder="Location" onChange={(e)=>setProfile({...profile!, location:e.target.value})} />
              </div>
            </div>

            <div className="frost rounded-xl p-4 grid gap-2">
              <h2 className="font-semibold">Links</h2>
              {profile.links.map((l, i) => (
                <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
                  <input className="px-3 py-2 rounded bg-white/10 border border-white/20" value={l.label} placeholder="Label" onChange={(e)=>updateLink(i,'label',e.target.value)} />
                  <input className="px-3 py-2 rounded bg-white/10 border border-white/20" value={l.url} placeholder="URL" onChange={(e)=>updateLink(i,'url',e.target.value)} />
                  <button className="px-3 py-2 rounded bg-white/10 border border-white/20" title="Remove" onClick={()=>{
                    if(!profile) return; const links = profile.links.slice(); links.splice(i,1); setProfile({...profile, links});
                  }}>Remove</button>
                </div>
              ))}
              <div>
                <button className="px-3 py-2 rounded bg-white/10 border border-white/20" onClick={()=>setProfile({...profile!, links:[...profile!.links, {label:'New', url:'https://'}]})}>+ Add link</button>
              </div>
            </div>

            <div className="frost rounded-xl p-4 grid gap-2">
              <h2 className="font-semibold">Theme</h2>
              <div className="grid grid-cols-2 gap-2">
                <input className="px-3 py-2 rounded bg-white/10 border border-white/20" value={profile.theme?.accent||''} placeholder="Accent (e.g. #ffffff)" onChange={(e)=>setProfile({...profile!, theme:{...profile!.theme, accent:e.target.value}})} />
                <input className="px-3 py-2 rounded bg-white/10 border border-white/20" value={profile.theme?.text||''} placeholder="Text color" onChange={(e)=>setProfile({...profile!, theme:{...profile!.theme, text:e.target.value}})} />
                <input className="px-3 py-2 rounded bg-white/10 border border-white/20" value={profile.theme?.accent2||''} placeholder="Accent 2 (gradient)" onChange={(e)=>setProfile({...profile!, theme:{...profile!.theme, accent2:e.target.value}})} />
                <input className="px-3 py-2 rounded bg-white/10 border border-white/20" value={profile.theme?.backgroundColor||''} placeholder="Background color (fallback)" onChange={(e)=>setProfile({...profile!, theme:{...profile!.theme, backgroundColor:e.target.value}})} />
                <input className="px-3 py-2 rounded bg-white/10 border border-white/20" value={profile.theme?.backdrop||''} placeholder="Backdrop rgba()" onChange={(e)=>setProfile({...profile!, theme:{...profile!.theme, backdrop:e.target.value}})} />
                <div className="flex gap-2">
                  <input className="flex-1 px-3 py-2 rounded bg-white/10 border border-white/20" value={profile.theme?.backgroundUrl||''} placeholder="Background image/video URL (.jpg/.png/.mp4)" onChange={(e)=>setProfile({...profile!, theme:{...profile!.theme, backgroundUrl:e.target.value}})} />
                  <button className="px-3 py-2 rounded bg-white/10 border border-white/20" onClick={()=>{
                    const el = document.createElement('input'); el.type='file'; el.accept='image/*,video/*'; el.onchange = async () => {
                      const f = el.files?.[0]; if(!f) return;
                      const fd = new FormData(); fd.append('file', f)
                      const res = await fetch('/api/upload',{method:'POST', body: fd});
                      if(res.ok){ const data = await res.json(); setProfile({...profile!, theme:{...profile!.theme, backgroundUrl: data.url}}); setMsg('Uploaded background') } else setMsg('Upload failed')
                    }; el.click();
                  }}>Upload</button>
                </div>
                <div className="flex gap-2 col-span-2">
                  <input className="flex-1 px-3 py-2 rounded bg-white/10 border border-white/20" value={profile.theme?.audioUrl||''} placeholder="Audio URL (mp3/ogg) for background player (optional)" onChange={(e)=>setProfile({...profile!, theme:{...profile!.theme, audioUrl:e.target.value}})} />
                  <button className="px-3 py-2 rounded bg-white/10 border border-white/20" onClick={()=>{
                    const el = document.createElement('input'); el.type='file'; el.accept='audio/*'; el.onchange = async () => {
                      const f = el.files?.[0]; if(!f) return;
                      const fd = new FormData(); fd.append('file', f)
                      const res = await fetch('/api/upload',{method:'POST', body: fd});
                      if(res.ok){ const data = await res.json(); setProfile({...profile!, theme:{...profile!.theme, audioUrl: data.url}}); setMsg('Uploaded audio') } else setMsg('Upload failed')
                    }; el.click();
                  }}>Upload</button>
                </div>
                <div className="grid grid-cols-2 gap-2 col-span-2">
                  <label className="text-sm text-neutral-300">Profile Opacity
                    <input type="range" min={0} max={1} step={0.01} value={profile.theme?.profileOpacity ?? 0.12} onChange={(e)=>setProfile({...profile!, theme:{...profile!.theme, profileOpacity: Number(e.target.value)}})} className="w-full" />
                  </label>
                  <label className="text-sm text-neutral-300">Profile Blur (px)
                    <input type="range" min={0} max={20} step={1} value={profile.theme?.profileBlur ?? 8} onChange={(e)=>setProfile({...profile!, theme:{...profile!.theme, profileBlur: Number(e.target.value)}})} className="w-full" />
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-2 col-span-2">
                  <select className="px-3 py-2 rounded bg-white/10 border border-white/20" value={profile.theme?.backgroundEffect || 'none'} onChange={(e)=>setProfile({...profile!, theme:{...profile!.theme, backgroundEffect: e.target.value as any}})}>
                    <option value="none">No Effect</option>
                    <option value="snow">Snow</option>
                    <option value="sparkles">Sparkles</option>
                    <option value="bokeh">Bokeh</option>
                  </select>
                  <select className="px-3 py-2 rounded bg-white/10 border border-white/20" value={profile.theme?.usernameEffect || 'none'} onChange={(e)=>setProfile({...profile!, theme:{...profile!.theme, usernameEffect: e.target.value as any}})}>
                    <option value="none">Username: None</option>
                    <option value="glow">Glow</option>
                    <option value="typewriter">Typewriter</option>
                  </select>
                </div>
                <div className="grid md:grid-cols-3 grid-cols-2 gap-2 col-span-2">
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!profile.theme?.gradientEnabled} onChange={e=>setProfile({...profile!, theme:{...profile!.theme, gradientEnabled:e.target.checked}})} /> Gradient</label>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!profile.theme?.monochromeIcons} onChange={e=>setProfile({...profile!, theme:{...profile!.theme, monochromeIcons:e.target.checked}})} /> Monochrome Icons</label>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!profile.theme?.swapBoxColors} onChange={e=>setProfile({...profile!, theme:{...profile!.theme, swapBoxColors:e.target.checked}})} /> Swap Box Colors</label>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={profile.theme?.showVolume ?? true} onChange={e=>setProfile({...profile!, theme:{...profile!.theme, showVolume:e.target.checked}})} /> Volume Control</label>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!profile.theme?.useDiscordAvatar} onChange={e=>setProfile({...profile!, theme:{...profile!.theme, useDiscordAvatar:e.target.checked}})} /> Use Discord Avatar</label>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!profile.theme?.avatarDecoration} onChange={e=>setProfile({...profile!, theme:{...profile!.theme, avatarDecoration:e.target.checked}})} /> Avatar Decoration</label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!profile.theme?.gradientEnabled} onChange={e=>setProfile({...profile!, theme:{...profile!.theme, gradientEnabled:e.target.checked}})} /> Gradient</label>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!profile.theme?.monochromeIcons} onChange={e=>setProfile({...profile!, theme:{...profile!.theme, monochromeIcons:e.target.checked}})} /> Monochrome Icons</label>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!profile.theme?.swapBoxColors} onChange={e=>setProfile({...profile!, theme:{...profile!.theme, swapBoxColors:e.target.checked}})} /> Swap Box Colors</label>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={profile.theme?.showVolume ?? true} onChange={e=>setProfile({...profile!, theme:{...profile!.theme, showVolume:e.target.checked}})} /> Volume Control</label>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!profile.theme?.showIconRow} onChange={e=>setProfile({...profile!, theme:{...profile!.theme, showIconRow:e.target.checked}})} /> Show Top Icon Row</label>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!profile.theme?.useDiscordAvatar} onChange={e=>setProfile({...profile!, theme:{...profile!.theme, useDiscordAvatar:e.target.checked}})} /> Use Discord Avatar</label>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!profile.theme?.avatarDecoration} onChange={e=>setProfile({...profile!, theme:{...profile!.theme, avatarDecoration:e.target.checked}})} /> Avatar Decoration</label>
                </div>
                <input className="px-3 py-2 rounded bg-white/10 border border-white/20 col-span-2" value={profile.theme?.iconColor||''} placeholder="Icon Color (circle behind icons)" onChange={(e)=>setProfile({...profile!, theme:{...profile!.theme, iconColor: e.target.value}})} />
              </div>
            </div>

            <div className="flex gap-2">
              <button className="px-4 py-2 rounded bg-brand" onClick={async ()=>{
                const res = await fetch(`/api/profile/${encodeURIComponent(profile.username)}`, {
                  method: 'PUT',
                  headers: { 'content-type': 'application/json' },
                  body: JSON.stringify(profile),
                })
                setMsg(res.ok ? 'Saved' : 'Failed')
              }}>Save</button>
              <a className="px-4 py-2 rounded bg-white/10 border border-white/20" href={`/${encodeURIComponent(profile.username)}`} target="_blank">View</a>
              {msg && <div className="self-center text-sm text-neutral-300">{msg}</div>}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
