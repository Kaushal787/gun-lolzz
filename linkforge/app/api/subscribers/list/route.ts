import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const profileId = url.searchParams.get("profileId");
  if (!profileId) return new Response("Missing", { status: 400 });
  const list = await prisma.emailSubscriber.findMany({ where: { profileId }, orderBy: { createdAt: "desc" } });
  return Response.json(list);
}

