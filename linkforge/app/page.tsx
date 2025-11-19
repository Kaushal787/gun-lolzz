import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full card p-10 text-center space-y-6">
        <h1 className="text-5xl font-extrabold">LinkForge</h1>
        <p className="text-neutral-300">One link for everything you create: customizable profiles, file hosting, analytics, and more.</p>
        <div className="flex gap-3 justify-center">
          <Link className="btn btn-primary" href="/auth/signin">Get Started</Link>
          <Link className="btn btn-ghost" href="/explore">Explore</Link>
        </div>
      </div>
    </main>
  );
}

