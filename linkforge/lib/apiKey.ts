import { prisma } from "./db";

export async function requireApiKey(req: Request) {
  const key = req.headers.get("x-api-key");
  if (!key) return false;
  const user = await prisma.user.findFirst({ where: { apiKey: key, isSuspended: false } });
  return !!user;
}

