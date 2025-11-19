import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });
  const schema = z.object({ targetUserId: z.string(), action: z.enum(["follow","unfollow"]) });
  const body = await req.json(); const parsed = schema.safeParse(body);
  if (!parsed.success) return new Response("Invalid", { status: 400 });
  const { targetUserId, action } = parsed.data;

  if (action === "follow") {
    await prisma.follower.upsert({
      where: { followerUserId_followingUserId: { followerUserId: (session.user as any).id, followingUserId: targetUserId } },
      update: {},
      create: { followerUserId: (session.user as any).id, followingUserId: targetUserId }
    });
  } else {
    await prisma.follower.deleteMany({ where: { followerUserId: (session.user as any).id, followingUserId: targetUserId } });
  }

  return Response.json({ ok: true });
}

