"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <main className="min-h-dvh grid place-items-center p-6">
      <div className="card p-6 space-y-4 w-full max-w-sm">
        <h1 className="text-xl font-semibold">Sign in</h1>
        <button className="btn btn-ghost w-full" onClick={() => signIn("discord")}>Continue with Discord</button>
        <button className="btn btn-ghost w-full" onClick={() => signIn("google")}>Continue with Google</button>
        <div className="text-neutral-400 text-sm text-center">or</div>
        <input className="bg-white/10 border border-white/20 rounded px-3 py-2 w-full" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" className="bg-white/10 border border-white/20 rounded px-3 py-2 w-full" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn btn-primary w-full" onClick={() => signIn("credentials", { email, password })}>Sign in</button>
      </div>
    </main>
  );
}

