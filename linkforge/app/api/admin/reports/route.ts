import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!(session as any)?.user?.isAdmin) return new Response("Forbidden", { status: 403 });
  const reports = await prisma.report.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  return Response.json(reports);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!(session as any)?.user?.isAdmin) return new Response("Forbidden", { status: 403 });
  const schema = z.object({ id: z.string(), status: z.enum(["open","resolved","dismissed"]) });
  const body = await req.json(); const parsed = schema.safeParse(body);
  if (!parsed.success) return new Response("Invalid", { status: 400 });
  const updated = await prisma.report.update({ where: { id: parsed.data.id }, data: { status: parsed.data.status } });
  return Response.json(updated);
}

