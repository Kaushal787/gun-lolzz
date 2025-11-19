"use client";
import { useEffect, useState } from "react";

export default function BlocksEditor() {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { (async () => {
    const res = await fetch("/api/blocks"); if (res.ok) setBlocks(await res.json()); setLoading(false);
  })(); }, []);

  async function addBlock() {
    const b = { type: "text", title: "New Text", contentJson: { text: "Hello" }, order: blocks.length, isActive: true };
    const res = await fetch("/api/blocks", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(b) });
    if (res.ok) setBlocks([...blocks, await res.json()]);
  }

  return (
    <div className="grid gap-3">
      <button className="btn btn-primary" onClick={addBlock}>+ Add Block</button>
      {loading ? <div>Loading...</div> : blocks.map(b => (
        <div key={b.id} className="card p-4">
          <div className="font-semibold">{b.title || b.type}</div>
          <div className="text-xs text-neutral-400">order {b.order} · {b.isActive ? "active" : "inactive"}</div>
        </div>
      ))}
    </div>
  );
}

