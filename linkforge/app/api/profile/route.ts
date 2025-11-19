import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const updateSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  themeKey: z.enum(["dark","light","gradient_neon","minimal"]),
  layout: z.enum(["stacked","centered","grid"]),
  showViewCounter: z.boolean(),
  isDiscoverable: z.boolean(),
  tags: z.array(z.string()).default([])
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });
  const profile = await prisma.profile.findFirst({ where: { userId: (session.user as any).id }, include: { links: true, blocks: true } });
  return Response.json(profile);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return new Response("Invalid", { status: 400 });

  const user = await prisma.user.findUnique({ where: { id: (session.user as any).id } });
  if (!user) return new Response("Unauthorized", { status: 401 });

  const prof = await prisma.profile.upsert({
    where: { userId: user.id },
    update: parsed.data,
    create: {
      userId: user.id,
      slug: user.username || user.email.split("@")[0],
      title: parsed.data.title,
      description: parsed.data.description,
      themeKey: parsed.data.themeKey as any,
      layout: parsed.data.layout as any,
      showViewCounter: parsed.data.showViewCounter,
      isDiscoverable: parsed.data.isDiscoverable,
      tags: parsed.data.tags
    }
  });
  return Response.json(prof);
}

