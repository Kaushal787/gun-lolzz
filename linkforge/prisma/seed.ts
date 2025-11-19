import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
  const email = "demo@linkforge.local";
  const username = "demo";
  const passwordHash = await bcrypt.hash("Password123!", 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, username, displayName: "Demo User", passwordHash }
  });

  await prisma.profile.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      slug: username,
      title: "Demo Profile",
      description: "Welcome to LinkForge",
      themeKey: "dark",
      layout: "stacked",
      showViewCounter: true,
      isDiscoverable: true,
      tags: ["creator","demo"]
    }
  });

  console.log("Seeded demo user:", email, "password: Password123!");
}

main().finally(() => prisma.$disconnect());

