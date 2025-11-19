import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const blockSchema = z.object({
  id: z.string().optional(),
  type: z.enum(["links","text","embed","faq","support","email_capture"]),
  title: z.string().optional(),
  contentJson: z.any(),
  order: z.number().int(),
  isActive: z.boolean()
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });
  const prof = await prisma.profile.findFirst({ where: { userId: (session.user as any).id } });
  const blocks = await prisma.profileBlock.findMany({ where: { profileId: prof?.id || "" }, orderBy: { order: "asc" } });
  return Response.json(blocks);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });
  const prof = await prisma.profile.findFirst({ where: { userId: (session.user as any).id } });
  if (!prof) return new Response("No profile", { status: 400 });

  const body = await req.json();
  const parsed = blockSchema.safeParse(body);
  if (!parsed.success) return new Response("Invalid", { status: 400 });

  const result = parsed.data.id
    ? await prisma.profileBlock.update({ where: { id: parsed.data.id }, data: { ...parsed.data, profileId: prof.id } })
    : await prisma.profileBlock.create({ data: { ...parsed.data, profileId: prof.id } });

  return Response.json(result);
}

