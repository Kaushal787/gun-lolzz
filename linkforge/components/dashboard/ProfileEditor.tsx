"use client";
import { useEffect, useState } from "react";

export default function ProfileEditor() {
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [themeKey, setThemeKey] = useState("dark");
  const [layout, setLayout] = useState("stacked");
  const [discoverable, setDiscoverable] = useState(true);
  const [showCounter, setShowCounter] = useState(true);
  const [tags, setTags] = useState<string>("");

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const prof = await res.json();
        if (prof) {
          setTitle(prof.title || "");
          setDescription(prof.description || "");
          setThemeKey(prof.themeKey || "dark");
          setLayout(prof.layout || "stacked");
          setDiscoverable(!!prof.isDiscoverable);
          setShowCounter(!!prof.showViewCounter);
          setTags((prof.tags || []).join(", "));
        }
      }
      setLoading(false);
    })();
  }, []);

  async function save() {
    setLoading(true);
    await fetch("/api/profile", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        title, description, themeKey, layout,
        showViewCounter: showCounter,
        isDiscoverable: discoverable,
        tags: tags.split(",").map(t => t.trim()).filter(Boolean)
      })
    });
    setLoading(false);
  }

  return (
    <div className="grid gap-2">
      <input className="bg-white/10 border border-white/20 rounded px-3 py-2" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
      <textarea className="bg-white/10 border border-white/20 rounded px-3 py-2" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
      <div className="grid md:grid-cols-2 gap-2">
        <select className="bg-white/10 border border-white/20 rounded px-3 py-2" value={themeKey} onChange={e=>setThemeKey(e.target.value)}>
          <option value="dark">Dark</option>
          <option value="light">Light</option>
          <option value="gradient_neon">Gradient Neon</option>
          <option value="minimal">Minimal</option>
        </select>
        <select className="bg-white/10 border border-white/20 rounded px-3 py-2" value={layout} onChange={e=>setLayout(e.target.value)}>
          <option value="stacked">Stacked</option>
          <option value="centered">Centered</option>
          <option value="grid">Grid</option>
        </select>
      </div>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2"><input type="checkbox" checked={discoverable} onChange={e=>setDiscoverable(e.target.checked)} /> Discoverable</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={showCounter} onChange={e=>setShowCounter(e.target.checked)} /> Show view counter</label>
      </div>
      <input className="bg-white/10 border border-white/20 rounded px-3 py-2" placeholder="Tags (comma separated)" value={tags} onChange={e=>setTags(e.target.value)} />
      <div className="flex gap-2">
        <button className="btn btn-primary" disabled={loading} onClick={save}>Save</button>
        {loading && <div className="text-sm text-neutral-300 self-center">Saving...</div>}
      </div>
    </div>
  );
}

