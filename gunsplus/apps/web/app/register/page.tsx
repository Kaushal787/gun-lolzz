import Link from 'next/link'

export default function RegisterPage() {
  return (
    <main className="min-h-dvh grid place-items-center p-6">
      <div className="w-full max-w-md frost rounded-2xl p-8 text-center space-y-4">
        <h1 className="text-2xl font-semibold">Create your guns<span className="text-brand">+</span> account</h1>
        <p className="text-neutral-300 text-sm">Signup flow is coming soon. For now, use the admin login to try the editor.</p>
        <div className="flex gap-3 justify-center">
          <Link className="px-4 py-2 rounded-md bg-brand" href="/admin/login">Go to Admin Login</Link>
          <Link className="px-4 py-2 rounded-md border border-white/20" href="/">Back Home</Link>
        </div>
      </div>
    </main>
  )
}

