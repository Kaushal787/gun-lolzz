import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function ExplorePage() {
  const profiles = await prisma.profile.findMany({
    where: { isDiscoverable: true },
    orderBy: { totalViews: "desc" },
    take: 24
  });

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Explore</h1>
      <div className="grid md:grid-cols-3 gap-4">
        {profiles.map(p => (
          <Link key={p.id} href={`/@${p.slug}`} className="card p-4 hover:bg-white/10 transition">
            <div className="font-semibold">{p.title}</div>
            <div className="text-sm text-neutral-400">{p.description || "—"}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}

