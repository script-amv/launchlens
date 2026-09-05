import type { ReactNode } from "react";

export function SectionFrame({
  label,
  className = "",
  children,
  id,
}: {
  label: ReactNode;
  className?: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section className={`section-frame ${className}`.trim()} id={id}>
      <div className="section-frame-kickoff">
        {typeof label === "string" ? <p className="kicker">{label}</p> : label}
      </div>
      <div className="section-frame-content">{children}</div>
    </section>
  );
}
