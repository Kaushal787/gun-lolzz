import Link from 'next/link'

export default function PricingPage() {
  return (
    <main className="max-w-3xl mx-auto p-6">
      <div className="frost rounded-2xl p-8 space-y-6">
        <h1 className="text-3xl font-bold">Pricing</h1>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-white/10 p-6">
            <h2 className="text-xl font-semibold">Free</h2>
            <p className="text-neutral-300 text-sm">0€ / lifetime. Link all your socials in one place.</p>
            <ul className="text-sm text-neutral-300 list-disc pl-5 mt-2">
              <li>Basic customization</li>
              <li>Profile analytics</li>
              <li>Add your socials</li>
            </ul>
          </div>
          <div className="rounded-xl border border-white/10 p-6">
            <h2 className="text-xl font-semibold">Premium</h2>
            <p className="text-neutral-300 text-sm">One-time — unlock layouts, fonts and special effects.</p>
            <ul className="text-sm text-neutral-300 list-disc pl-5 mt-2">
              <li>Exclusive badge</li>
              <li>Advanced customization</li>
              <li>SEO & metadata controls</li>
            </ul>
          </div>
        </div>
        <div className="flex gap-3">
          <Link className="px-4 py-2 rounded-md bg-brand" href="/register">Sign Up Free</Link>
          <Link className="px-4 py-2 rounded-md border border-white/20" href="/">Back Home</Link>
        </div>
      </div>
    </main>
  )
}

