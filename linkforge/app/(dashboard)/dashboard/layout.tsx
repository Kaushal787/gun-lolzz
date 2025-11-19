import { ReactNode } from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <main className="min-h-dvh grid place-items-center">
        <div className="card p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Please sign in</h2>
          <Link href="/auth/signin" className="btn btn-primary">Sign in</Link>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-dvh flex">
      <aside className="w-64 p-4 hidden md:block">
        <nav className="grid gap-2">
          <Link href="/dashboard" className="btn btn-ghost">Overview</Link>
          <Link href="/dashboard/profile" className="btn btn-ghost">Profile</Link>
          <Link href="/dashboard/blocks" className="btn btn-ghost">Blocks</Link>
          <Link href="/dashboard/links" className="btn btn-ghost">Links</Link>
          <Link href="/dashboard/files" className="btn btn-ghost">Files</Link>
          <Link href="/dashboard/subscribers" className="btn btn-ghost">Subscribers</Link>
          <Link href="/dashboard/settings" className="btn btn-ghost">Settings</Link>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

