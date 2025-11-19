import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getStorage } from "@/lib/storage";
import crypto from "node:crypto";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });
  const files = await prisma.fileAsset.findMany({ where: { userId: (session.user as any).id, isDeleted: false }, orderBy: { createdAt: "desc" } });
  return Response.json(files);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  const form = await req.formData();
  const file = form.get("file") as unknown as File | null;
  if (!file) return new Response("Missing file", { status: 400 });

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const ext = (file.name.split(".").pop() || "bin").toLowerCase();
  const key = `${(session.user as any).id}/${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const storage = getStorage();
  const stored = await storage.putObject({ key, data: buffer, contentType: file.type || "application/octet-stream" });

  const created = await prisma.fileAsset.create({
    data: {
      userId: (session.user as any).id,
      originalFilename: file.name,
      mimeType: file.type || "application/octet-stream",
      sizeBytes: buffer.length,
      storageKey: stored.storageKey,
      publicUrl: stored.publicUrl,
      thumbUrl: null,
      tags: [],
      privacy: "unlisted"
    }
  });

  return Response.json(created);
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });
  const { id } = await req.json();
  await prisma.fileAsset.update({ where: { id }, data: { isDeleted: true } });
  return Response.json({ ok: true });
}

