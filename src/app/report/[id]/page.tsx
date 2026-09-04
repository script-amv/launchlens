import { notFound } from "next/navigation";
import { getReport } from "@/lib/storage";
import { AuditReportView } from "@/components/audit-report-view";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const report = await getReport(id); if (!report || new Date(report.expiresAt) < new Date()) notFound();
  return <main><SiteHeader /><AuditReportView report={report} /><SiteFooter /></main>;
}
