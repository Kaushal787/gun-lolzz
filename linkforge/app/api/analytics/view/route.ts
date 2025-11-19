import { prisma } from "@/lib/db";
import { z } from "zod";

export async function POST(req: Request) {
  const schema = z.object({
    profileId: z.string(),
    referrer: z.string().optional(),
    deviceType: z.enum(["mobile","desktop","tablet","unknown"]).optional(),
    country: z.string().optional(),
    viewerSessionId: z.string().min(8)
  });
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return new Response("Invalid", { status: 400 });

  const { profileId, referrer, deviceType, country, viewerSessionId } = parsed.data;
  const since = new Date(Date.now() - 60 * 60 * 1000);
  const exists = await prisma.viewEvent.findFirst({ where: { profileId, viewerSessionId, createdAt: { gte: since } } });
  if (!exists) {
    await prisma.viewEvent.create({ data: { profileId, referrer: referrer || null, deviceType: (deviceType || "unknown") as any, country: country || null, viewerSessionId } });
    await prisma.profile.update({ where: { id: profileId }, data: { totalViews: { increment: 1 } } });
  }
  return Response.json({ ok: true });
}

