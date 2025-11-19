import { prisma } from "@/lib/db";
import PublicProfileClient from "@/components/public/PublicProfileClient";

export default async function PublicProfilePage({ params }: { params: { slug: string } }) {
  const profile = await prisma.profile.findUnique({
    where: { slug: params.slug },
    include: { user: true, links: { where: { isActive: true }, orderBy: { order: "asc" } }, blocks: { where: { isActive: true }, orderBy: { order: "asc" } } }
  });

  if (!profile) {
    return <div className="min-h-dvh grid place-items-center"><div className="card p-6">Profile not found.</div></div>;
  }

  return (
    <PublicProfileClient profile={profile} />
  );
}

