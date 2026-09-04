import Link from "next/link";
export default function NotFound() { return <main className="empty-state shell"><p className="kicker">Report unavailable</p><h1>This report has expired or does not exist.</h1><p>Reports are kept for 30 days to protect the privacy of the websites we audit.</p><Link href="/" className="button-primary">Run a new audit</Link></main>; }
