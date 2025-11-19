"use client"
import { useState } from 'react'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [ok, setOk] = useState<boolean | null>(null)

  return (
    <main className="min-h-dvh flex items-center justify-center p-6">
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          const res = await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ password }),
          })
          setOk(res.ok)
          if (res.ok) window.location.href = '/admin'
        }}
        className="w-full max-w-sm frost rounded-2xl p-6 space-y-4"
      >
        <h1 className="text-xl font-semibold">Admin Login</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-3 py-2 rounded bg-white/10 border border-white/20"
        />
        <button className="px-4 py-2 rounded bg-brand" type="submit">Sign in</button>
        {ok === false && <div className="text-red-400">Invalid password</div>}
      </form>
    </main>
  )
}

