import { prisma } from "@/lib/db";
import { z } from "zod";

export async function POST(req: Request) {
  const schema = z.object({ profileId: z.string(), email: z.string().email(), source: z.string() });
  const body = await req.json(); const parsed = schema.safeParse(body);
  if (!parsed.success) return new Response("Invalid", { status: 400 });
  const sub = await prisma.emailSubscriber.create({ data: parsed.data });
  return Response.json(sub);
}

