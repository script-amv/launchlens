import { getReport } from "@/lib/storage";
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const report = await getReport(id);
  if (!report || new Date(report.expiresAt) < new Date())
    return Response.json({ error: "Report not found" }, { status: 404 });
  return Response.json(report, { headers: { "x-robots-tag": "noindex" } });
}
