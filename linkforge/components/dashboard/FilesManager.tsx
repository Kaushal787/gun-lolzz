"use client";
import { useEffect, useRef, useState } from "react";

export default function FilesManager() {
  const [files, setFiles] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  async function refresh() {
    const res = await fetch("/api/files"); if (res.ok) setFiles(await res.json());
  }

  useEffect(() => {
    refresh();
    const onPaste = async (e: ClipboardEvent) => {
      const item = e.clipboardData?.files?.[0];
      if (item) await uploadFile(item);
    };
    window.addEventListener("paste", onPaste as any);
    return () => window.removeEventListener("paste", onPaste as any);
  }, []);

  async function uploadFile(file: File | Blob) {
    const fd = new FormData(); fd.append("file", file);
    const res = await fetch("/api/files", { method: "POST", body: fd });
    if (res.ok) await refresh();
  }

  return (
    <div className="grid gap-4">
      <div className="flex gap-2">
        <input ref={inputRef} type="file" className="hidden" onChange={e => e.target.files && uploadFile(e.target.files[0])} />
        <button className="btn btn-primary" onClick={() => inputRef.current?.click()}>Upload</button>
        <span className="text-sm text-neutral-400 self-center">Tip: Paste an image to upload</span>
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        {files.map(f => (
          <div key={f.id} className="card p-3">
            <div className="text-sm font-semibold">{f.originalFilename}</div>
            <div className="text-xs text-neutral-400 mb-2">{(f.sizeBytes/1024).toFixed(1)} KB · {f.privacy}</div>
            {String(f.mimeType).startsWith("image/") && /* eslint-disable-next-line @next/next/no-img-element */ <img src={f.thumbUrl || f.publicUrl} alt="" className="rounded mb-2" />}
            <div className="flex gap-2">
              <a className="btn btn-ghost" href={f.publicUrl} target="_blank">Open</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

