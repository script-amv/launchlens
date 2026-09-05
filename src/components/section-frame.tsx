import type { ReactNode } from "react";

export function SectionFrame({ label, className = "", children }: { label: ReactNode; className?: string; children: ReactNode }) {
  return <section className={`section-frame ${className}`.trim()}><div className="section-frame-kickoff">{typeof label === "string" ? <p className="kicker">{label}</p> : label}</div><div className="section-frame-content">{children}</div></section>;
}
