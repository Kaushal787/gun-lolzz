"use client"
import { useState } from 'react'

type IconDef = { kind: 'discord' } | { kind: 'url', url: string }

export default function LinkItem({
  type,
  href,
  label,
  icon,
  monochrome,
  iconTint,
  glow,
  copyText,
}: {
  type: 'circle' | 'button'
  href?: string
  label?: string
  icon: IconDef
  monochrome: boolean
  iconTint: string
  glow?: boolean
  copyText?: string
}) {
  const [copied, setCopied] = useState(false)
  const onCopy = async () => {
    if (!copyText) return
    try {
      await navigator.clipboard.writeText(copyText)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {}
  }

  const Icon = () => (
    icon.kind === 'discord' ? (
      <svg width={type==='circle'?20:16} height={type==='circle'?20:16} viewBox="0 0 24 24" fill="currentColor" aria-hidden className="align-middle">
        <path d="M20.317 4.369A19.791 19.791 0 0 0 16.558 3a13.447 13.447 0 0 0-.622 1.295 18.27 18.27 0 0 0-5.871 0A13.613 13.613 0 0 0 9.443 3 19.736 19.736 0 0 0 5.682 4.37 21.276 21.276 0 0 0 2 12.315a19.916 19.916 0 0 0 6.093 3.098c.486-.669.92-1.379 1.296-2.122a12.265 12.265 0 0 1-1.98-.947c.166-.12.329-.245.488-.375a13.61 13.61 0 0 0 8.206 0c.159.131.322.256.488.375-.64.38-1.311.699-2.01.949.375.743.808 1.452 1.294 2.121a19.876 19.876 0 0 0 6.094-3.098 21.21 21.21 0 0 0-3.632-7.946ZM9.59 12.75c-.9 0-1.63-.83-1.63-1.852 0-1.022.729-1.852 1.63-1.852.902 0 1.631.83 1.631 1.852 0 1.022-.73 1.852-1.63 1.852Zm4.82 0c-.9 0-1.63-.83-1.63-1.852 0-1.022.729-1.852 1.63-1.852.902 0 1.631.83 1.631 1.852 0 1.022-.73 1.852-1.63 1.852Z"/>
      </svg>
    ) : (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={icon.url} width={type==='circle'?20:16} height={type==='circle'?20:16} alt="" className="icon-glow block align-middle" style={{ filter: monochrome ? 'grayscale(1) brightness(1.1)' : 'none' }} />
    )
  )

  // icon circle variant
  if (type === 'circle') {
    const common = (
      <span
        className="inline-grid place-items-center rounded-full p-2 transition-transform hover:scale-110"
        style={{ background: 'transparent' }}
      >
        <Icon />
      </span>
    )
    if (copyText) {
      return (
        <button onClick={onCopy} title={copied ? 'Copied!' : (label || 'Copy')} className="rounded-full">
          {common}
        </button>
      )
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" title={label} className="rounded-full">
        {common}
      </a>
    )
  }

  // big button variant
  const inner = (
    <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-white/10 hover:bg-white/20 transition glassy" style={{ background: monochrome ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.12)' }}>
      <span className="inline-grid place-items-center w-6 h-6 rounded-full" style={{ background: monochrome ? 'transparent' : iconTint }}>
        <Icon />
      </span>
      <span className={(glow ? 'glow ' : '') + 'font-semibold leading-none'}>{label}</span>
      {copied && <span className="text-xs text-neutral-300">Copied!</span>}
    </div>
  )
  if (copyText) {
    return <button onClick={onCopy} className="w-full">{inner}</button>
  }
  return <a href={href} target="_blank" rel="noopener noreferrer" className="w-full">{inner}</a>
}
