import { prisma } from "@/lib/db";

function toKey(d: Date) { return `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,"0")}-${d.getDate().toString().padStart(2,"0")}`; }

export async function GET(req: Request) {
  const url = new URL(req.url);
  const profileId = url.searchParams.get("profileId");
  const range = Number(url.searchParams.get("range") || 7);
  if (!profileId) return new Response("Missing", { status: 400 });

  const since = new Date(Date.now() - range * 86400000);
  const views = await prisma.viewEvent.findMany({ where: { profileId, createdAt: { gte: since } } });
  const clicks = await prisma.clickEvent.findMany({ where: { profileId, createdAt: { gte: since } } });

  const dayMap: Record<string, number> = {};
  for (let i=0;i<range;i++){ const d = new Date(Date.now() - (range-1-i)*86400000); dayMap[toKey(d)] = 0; }
  views.forEach(v => { const k = toKey(v.createdAt); dayMap[k] = (dayMap[k] || 0) + 1; });
  const viewsSeries = Object.entries(dayMap).map(([date, value]) => ({ date, value }));

  const linkAgg = new Map<string, number>();
  clicks.forEach(c => linkAgg.set(c.linkId, (linkAgg.get(c.linkId) || 0) + 1));
  const linkIds = Array.from(linkAgg.keys());
  const linkRows = await prisma.link.findMany({ where: { id: { in: linkIds } } });
  const topLinks = linkRows.map(l => ({ label: l.label, count: linkAgg.get(l.id) || 0 })).sort((a,b)=>b.count-a.count).slice(0,10);

  return Response.json({ views7: viewsSeries, topLinks });
}

