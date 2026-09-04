import Link from "next/link";
import { AuditReportView } from "@/components/audit-report-view";
import { exampleReport } from "@/lib/example-report";

export default function ExamplePage() {
  return <main><nav className="nav shell"><Link href="/" className="brand">launch<span>lens</span></Link><div className="nav-links"><Link href="/example">Example report</Link><Link href="/#how-it-works">How it works</Link></div></nav><AuditReportView report={exampleReport} example /><footer className="footer shell"><Link href="/" className="brand">launch<span>lens</span></Link><span>Website health, made clear.</span><div><Link href="/legal/privacy">Privacy</Link><Link href="/legal/terms">Terms</Link></div></footer></main>;
}
