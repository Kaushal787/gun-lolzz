import fs from 'node:fs/promises'
import path from 'node:path'

export type Link = { label: string; url: string; order?: number }
export type Theme = {
  accent?: string
  text?: string
  backdrop?: string
  backgroundUrl?: string | null
  audioUrl?: string | null
  // New customization
  accent2?: string | null
  backgroundColor?: string | null
  iconColor?: string | null
  gradientEnabled?: boolean
  profileOpacity?: number | null // 0..1
  profileBlur?: number | null // px
  backgroundEffect?: 'none' | 'snow' | 'sparkles' | 'bokeh'
  usernameEffect?: 'none' | 'glow' | 'typewriter'
  glowUsername?: boolean
  glowSocials?: boolean
  glowBadges?: boolean
  monochromeIcons?: boolean
  swapBoxColors?: boolean
  animatedTitle?: boolean
  showVolume?: boolean
  useDiscordAvatar?: boolean
  avatarDecoration?: boolean
  showIconRow?: boolean
}
export type ProfileRecord = {
  username: string
  displayName: string
  bio?: string | null
  avatarUrl?: string | null
  discordUserId?: string | null
  discordTag?: string | null
  discordStatus?: 'online' | 'idle' | 'dnd' | 'offline' | null
  guildTag?: string | null
  guildTagColor?: string | null
  location?: string | null
  links: Link[]
  theme?: Theme
}

type DataShape = { profiles: ProfileRecord[] }

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'apps', 'web', 'data')
const DATA_FILE = path.join(DATA_DIR, 'profiles.json')

async function ensureFile() {
  await fs.mkdir(DATA_DIR, { recursive: true })
  try {
    await fs.access(DATA_FILE)
  } catch {
    const seed: DataShape = { profiles: [] }
    await fs.writeFile(DATA_FILE, JSON.stringify(seed, null, 2), 'utf8')
  }
}

async function read(): Promise<DataShape> {
  await ensureFile()
  const raw = await fs.readFile(DATA_FILE, 'utf8')
  return JSON.parse(raw)
}

async function write(data: DataShape) {
  await ensureFile()
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8')
}

export async function getProfile(username: string): Promise<ProfileRecord | null> {
  const data = await read()
  return data.profiles.find((p) => p.username.toLowerCase() === username.toLowerCase()) || null
}

export async function upsertProfile(record: ProfileRecord): Promise<ProfileRecord> {
  const data = await read()
  const i = data.profiles.findIndex((p) => p.username.toLowerCase() === record.username.toLowerCase())
  if (i >= 0) data.profiles[i] = record
  else data.profiles.push(record)
  await write(data)
  return record
}

export async function listProfiles(): Promise<ProfileRecord[]> {
  const data = await read()
  // shallow copy
  return data.profiles.slice().sort((a, b) => a.username.localeCompare(b.username))
}

export async function deleteProfile(username: string): Promise<boolean> {
  const data = await read()
  const before = data.profiles.length
  data.profiles = data.profiles.filter((p) => p.username.toLowerCase() !== username.toLowerCase())
  await write(data)
  return data.profiles.length !== before
}
