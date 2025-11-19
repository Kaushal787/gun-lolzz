import { prisma } from "@/lib/db";
import { requireApiKey } from "@/lib/apiKey";

export async function GET(req: Request) {
  const ok = await requireApiKey(req);
  if (!ok) return new Response("Unauthorized", { status: 401 });

  const url = new URL(req.url);
  const slug = url.searchParams.get("slug");
  if (!slug) return new Response("Missing slug", { status: 400 });

  const profile = await prisma.profile.findUnique({
    where: { slug },
    include: { links: { where: { isActive: true }, orderBy: { order: "asc" } }, blocks: { where: { isActive: true }, orderBy: { order: "asc" } } }
  });

  return Response.json(profile);
}

