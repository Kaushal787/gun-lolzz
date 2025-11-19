"use client";
import { useEffect, useState } from "react";

type Point = { date: string; value: number };

export default function OverviewCharts({ profileId }: { profileId: string }) {
  const [last7, setLast7] = useState<Point[]>([]);
  const [topLinks, setTopLinks] = useState<{ label: string; count: number }[]>([]);

  useEffect(() => {
    if (!profileId) return;
    (async () => {
      const res = await fetch(`/api/analytics/summary?profileId=${encodeURIComponent(profileId)}&range=7`);
      if (res.ok) {
        const data = await res.json();
        setLast7(data.views7 || []);
        setTopLinks(data.topLinks || []);
      }
    })();
  }, [profileId]);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <h3 className="font-semibold mb-2">Views (7 days)</h3>
        <MiniChart points={last7} />
      </div>
      <div>
        <h3 className="font-semibold mb-2">Top Links</h3>
        <ul className="text-sm text-neutral-300">
          {topLinks.map(x => <li key={x.label}>{x.label} — {x.count}</li>)}
        </ul>
      </div>
    </div>
  );
}

function MiniChart({ points }: { points: Point[] }) {
  const max = Math.max(...points.map(p => p.value), 1);
  return (
    <svg width="100%" height="120">
      {points.map((p, i) => {
        if (i === 0) return null;
        const x1 = ((i - 1) / (points.length - 1)) * 300 + 10;
        const x2 = (i / (points.length - 1)) * 300 + 10;
        const y1 = 110 - (points[i - 1].value * 100) / max;
        const y2 = 110 - (points[i].value * 100) / max;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#20C6B7" strokeWidth="2" />;
      })}
    </svg>
  );
}

