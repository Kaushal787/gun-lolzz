import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const schema = z.object({ targetType: z.enum(["profile","file","user"]), targetId: z.string(), reason: z.string().min(5) });
  const body = await req.json(); const parsed = schema.safeParse(body);
  if (!parsed.success) return new Response("Invalid", { status: 400 });
  const report = await prisma.report.create({ data: { ...parsed.data, reporterUserId: (session?.user as any)?.id ?? null } });
  return Response.json(report);
}

