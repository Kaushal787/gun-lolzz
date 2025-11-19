import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const linkSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1),
  url: z.string().url(),
  icon: z.string().optional(),
  order: z.number().int(),
  isActive: z.boolean()
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });
  const prof = await prisma.profile.findFirst({ where: { userId: (session.user as any).id } });
  const links = await prisma.link.findMany({ where: { profileId: prof?.id || "" }, orderBy: { order: "asc" } });
  return Response.json(links);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });
  const prof = await prisma.profile.findFirst({ where: { userId: (session.user as any).id } });
  if (!prof) return new Response("No profile", { status: 400 });

  const body = await req.json();
  const parsed = linkSchema.safeParse(body);
  if (!parsed.success) return new Response("Invalid", { status: 400 });

  const result = parsed.data.id
    ? await prisma.link.update({ where: { id: parsed.data.id }, data: { ...parsed.data, profileId: prof.id } })
    : await prisma.link.create({ data: { ...parsed.data, profileId: prof.id } });

  return Response.json(result);
}

