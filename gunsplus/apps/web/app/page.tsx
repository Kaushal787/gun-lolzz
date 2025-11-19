import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl w-full frost rounded-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold glow">guns<span className="text-brand">+</span></h1>
          <p className="text-neutral-300">Everything you want, right here.</p>
        </div>
        <div className="flex gap-3 justify-center">
          <Link className="px-4 py-2 rounded-md bg-brand hover:bg-brand-soft" href="/register">Sign Up Free</Link>
          <Link className="px-4 py-2 rounded-md border border-white/20" href="/pricing">View Pricing</Link>
        </div>
        <div className="text-center text-sm text-neutral-400">
          Over <b>1,150,000</b> people use link-in-bio — what are you waiting for?
        </div>
      </div>
    </main>
  )
}

