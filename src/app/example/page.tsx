import { AuditReportView } from "@/components/audit-report-view";
import { exampleReport } from "@/lib/example-report";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export default function ExamplePage() {
  return <main><SiteHeader /><AuditReportView report={exampleReport} /><SiteFooter /></main>;
}
