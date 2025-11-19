import { prisma } from "@/lib/db";

export default async function FileViewer({ params }: { params: { id: string } }) {
  const file = await prisma.fileAsset.findUnique({ where: { id: params.id } });
  if (!file || file.isDeleted) return <div className="min-h-dvh grid place-items-center"><div className="card p-6">File not found.</div></div>;

  const isImage = file.mimeType.startsWith("image/");
  const canView = file.privacy !== "private"; // enhance with owner check
  if (!canView) return <div className="min-h-dvh grid place-items-center"><div className="card p-6">Access denied.</div></div>;

  return (
    <main className="min-h-dvh grid place-items-center p-6">
      <div className="card p-4 max-w-4xl w-full text-center">
        <h1 className="font-semibold mb-4">{file.originalFilename}</h1>
        {isImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={file.publicUrl} alt={file.originalFilename} className="mx-auto rounded" />
        ) : (
          <a className="btn btn-primary" href={file.publicUrl} download>Download</a>
        )}
      </div>
    </main>
  );
}

