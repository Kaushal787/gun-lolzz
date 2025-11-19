import NextAuth, { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Discord from "next-auth/providers/discord";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "database" },
  providers: [
    Discord({ clientId: process.env.DISCORD_CLIENT_ID!, clientSecret: process.env.DISCORD_CLIENT_SECRET! }),
    Google({ clientId: process.env.GOOGLE_CLIENT_ID!, clientSecret: process.env.GOOGLE_CLIENT_SECRET! }),
    Credentials({
      name: "Email/Password",
      credentials: { email: { label: "Email", type: "email" }, password: { label: "Password", type: "password" } },
      async authorize(creds) {
        const schema = z.object({ email: z.string().email(), password: z.string().min(8) });
        const parsed = schema.safeParse(creds);
        if (!parsed.success) return null;
        const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
        if (!user?.passwordHash) return null;
        if (user.isSuspended) return null;
        const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!ok) return null;
        return { id: user.id, email: user.email, name: user.displayName, image: user.avatarUrl } as any;
      }
    })
  ],
  pages: { signIn: "/auth/signin" },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        (session.user as any).id = user.id;
        (session.user as any).username = (user as any).username;
        (session.user as any).isAdmin = (user as any).isAdmin;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
};

export const { auth } = NextAuth(authOptions);

