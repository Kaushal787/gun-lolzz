import { prisma } from "@/lib/db";
import { z } from "zod";

export async function POST(req: Request) {
  const schema = z.object({
    profileId: z.string(),
    linkId: z.string(),
    referrer: z.string().optional(),
    deviceType: z.enum(["mobile","desktop","tablet","unknown"]).optional(),
    country: z.string().optional()
  });
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return new Response("Invalid", { status: 400 });

  const { profileId, linkId, referrer, deviceType, country } = parsed.data;
  await prisma.clickEvent.create({ data: { profileId, linkId, referrer: referrer || null, deviceType: (deviceType || "unknown") as any, country: country || null } });
  return Response.json({ ok: true });
}

