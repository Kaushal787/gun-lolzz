"use client";
import { useState } from "react";

export default function SettingsPage() {
  const [status, setStatus] = useState("");
  return (
    <div className="grid gap-4">
      <div className="card p-6">
        <h3 className="font-semibold mb-2">Account</h3>
        <div className="grid gap-2">
          <input className="bg-white/10 border border-white/20 rounded px-3 py-2" placeholder="New email" />
          <input className="bg-white/10 border border-white/20 rounded px-3 py-2" type="password" placeholder="New password" />
          <button className="btn btn-primary" onClick={() => setStatus("Saved")}>Save</button>
          {status && <div className="text-sm text-neutral-300">{status}</div>}
        </div>
      </div>
      <div className="card p-6">
        <h3 className="font-semibold mb-2">API Key</h3>
        <p className="text-sm text-neutral-300">Manage and rotate your API key in future versions.</p>
      </div>
    </div>
  );
}

