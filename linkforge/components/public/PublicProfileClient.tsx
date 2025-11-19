"use client";
import { useEffect } from "react";

export default function PublicProfileClient({ profile }: { profile: any }) {
  useEffect(() => {
    const viewerSessionId = (localStorage.getItem("lf_sid") || (() => {
      const id = crypto.randomUUID(); localStorage.setItem("lf_sid", id); return id;
    })());
    fetch("/api/analytics/view", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        profileId: profile.id,
        referrer: document.referrer || null,
        deviceType: /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop",
        viewerSessionId
      })
    });
  }, [profile.id]);

  return (
    <main className="min-h-dvh flex items-center justify-center p-6 relative">
      <div className="absolute inset-0 opacity-30 pointer-events-none bg-gradient-to-br from-brand to-pink-500" />
      <div className="relative w-full max-w-xl card p-6 space-y-4">
        <h1 className="text-3xl font-bold">{profile.title}</h1>
        <p className="text-neutral-300">{profile.description}</p>
        <div className="grid gap-3">
          {profile.links.map((l: any) => (
            <a key={l.id} href={l.url} className="btn btn-ghost" target="_blank" onClick={()=> {
              fetch("/api/analytics/click", { method:"POST", headers:{ "content-type":"application/json" }, body: JSON.stringify({ profileId: profile.id, linkId: l.id, referrer: location.href }) });
            }}>
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}

