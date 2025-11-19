import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import OverviewCharts from "@/components/charts/OverviewCharts";

export default async function DashboardHome() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const profile = await prisma.profile.findFirst({ where: { userId: (session.user as any).id } });
  const linksCount = await prisma.link.count({ where: { profileId: profile?.id } });
  const filesCount = await prisma.fileAsset.count({ where: { userId: (session.user as any).id, isDeleted: false } });
  const recentViews = await prisma.viewEvent.findMany({
    where: { profileId: profile?.id || "" },
    orderBy: { createdAt: "desc" },
    take: 5
  });

  return (
    <div className="grid gap-6">
      <div className="card p-6 grid md:grid-cols-4 gap-4">
        <Stat label="Profile URL" value={profile ? `${process.env.NEXTAUTH_URL}/@${profile.slug}` : "-"} />
        <Stat label="Total views" value={`${profile?.totalViews ?? 0}`} />
        <Stat label="Links" value={`${linksCount}`} />
        <Stat label="Files" value={`${filesCount}`} />
      </div>
      <div className="card p-6">
        <OverviewCharts profileId={profile?.id || ""} />
      </div>
      <div className="card p-6">
        <h3 className="font-semibold mb-2">Recent Activity</h3>
        <ul className="text-sm text-neutral-300">
          {recentViews.map(v => (
            <li key={v.id}>View from {v.country ?? "unknown"} · {v.deviceType} · {v.referrer ?? "-"}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-neutral-400 text-sm">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

