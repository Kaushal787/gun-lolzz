"use client";
import { useEffect, useState } from "react";

type LinkT = { id?: string; label: string; url: string; icon?: string; order: number; isActive: boolean };

export default function LinksManager() {
  const [links, setLinks] = useState<LinkT[]>([]);

  useEffect(() => { (async () => {
    const res = await fetch("/api/links"); if (res.ok) setLinks(await res.json());
  })(); }, []);

  async function add() {
    const payload: LinkT = { label: "New Link", url: "https://", order: links.length, isActive: true };
    const res = await fetch("/api/links", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
    if (res.ok) setLinks([...links, await res.json()]);
  }

  return (
    <div className="grid gap-3">
      <button className="btn btn-primary" onClick={add}>+ Add Link</button>
      {links.map(l => (
        <div key={l.id} className="card p-4 grid md:grid-cols-3 gap-2 items-center">
          <input className="bg-white/10 border border-white/20 rounded px-3 py-2" value={l.label} readOnly />
          <input className="bg-white/10 border border-white/20 rounded px-3 py-2" value={l.url} readOnly />
          <span className="text-sm text-neutral-400 text-center">{l.isActive ? "active" : "inactive"}</span>
        </div>
      ))}
    </div>
  );
}

