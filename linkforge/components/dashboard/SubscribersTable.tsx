"use client";
import { useEffect, useState } from "react";

export default function SubscribersTable() {
  const [subs, setSubs] = useState<any[]>([]);
  useEffect(() => { (async ()=>{ const prof = await fetch("/api/profile").then(r=>r.json()); if (!prof?.id) return;
    const data = await fetch(`/api/subscribers/list?profileId=${prof.id}`).then(r=>r.json()); setSubs(data||[]);
  })(); }, []);
  return (
    <div>
      <div className="text-sm text-neutral-300 mb-2">Total: {subs.length}</div>
      <table className="w-full text-sm">
        <thead className="text-neutral-400"><tr><th className="text-left">Email</th><th className="text-left">Source</th><th className="text-left">Date</th></tr></thead>
        <tbody>
          {subs.map((s:any)=> (
            <tr key={s.id}><td>{s.email}</td><td>{s.source}</td><td>{new Date(s.createdAt).toLocaleString()}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

