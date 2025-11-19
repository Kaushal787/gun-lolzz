import fs from 'node:fs/promises'
import path from 'node:path'

export const runtime = 'nodejs'

function extFromName(name: string) {
  const ix = name.lastIndexOf('.')
  return ix >= 0 ? name.slice(ix + 1).toLowerCase() : 'bin'
}

export async function POST(request: Request) {
  try {
    const form = await request.formData()
    const file = form.get('file') as unknown as File | null
    if (!file) return new Response('Missing file', { status: 400 })

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await fs.mkdir(uploadDir, { recursive: true })

    const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_') || 'upload'
    const ext = extFromName(safeName)
    const fname = `${Date.now()}-${crypto.randomUUID()}.${ext}`
    const fpath = path.join(uploadDir, fname)
    await fs.writeFile(fpath, buffer)

    const url = `/uploads/${fname}`
    return Response.json({ url, mimeType: file.type || 'application/octet-stream', sizeBytes: buffer.length })
  } catch (e) {
    console.error('upload error', e)
    return new Response('Upload failed', { status: 500 })
  }
}

