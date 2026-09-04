import { notFound } from "next/navigation";
import Link from "next/link";
import { getReport } from "@/lib/storage";
import { AuditReportView } from "@/components/audit-report-view";

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const report = await getReport(id); if (!report || new Date(report.expiresAt) < new Date()) notFound();
  return <main><nav className="nav shell"><Link href="/" className="brand">launch<span>lens</span></Link><div className="nav-links"><Link href="/example">Example report</Link><Link href="/#how-it-works">How it works</Link></div></nav><AuditReportView report={report} /><footer className="footer shell"><Link href="/" className="brand">launch<span>lens</span></Link><span>Website health, made clear.</span><div><Link href="/legal/privacy">Privacy</Link><Link href="/legal/terms">Terms</Link></div></footer></main>;
}
