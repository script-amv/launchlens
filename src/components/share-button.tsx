"use client";
import { Copy, Download } from "lucide-react";
import { useState } from "react";
export function ReportActions() {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }
  return (
    <div className="report-actions">
      <button onClick={copy} className="button-secondary">
        <Copy size={16} />
        {copied ? "Link copied" : "Copy report link"}
      </button>
      <button className="button-secondary" onClick={() => window.print()}>
        <Download size={16} /> Save as PDF
      </button>
    </div>
  );
}
