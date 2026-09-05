import { AuditForm } from "@/components/audit-form";
import { ArrowUpRight, CheckCircle2, Gauge, SearchCheck, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { SectionFrame } from "@/components/section-frame";

const features = [
  [Gauge, "Performance", "See what slows your site down — on mobile and desktop."],
  [SearchCheck, "Search readiness", "Understand the technical signals search engines actually see."],
  [ShieldCheck, "Trust & accessibility", "Find issues that make visitors lose confidence or leave."],
];

export default function Home() {
  return <main className="landing-page">
    <SiteHeader />
    <SectionFrame className="hero shell" label={<div className="eyebrow"><span /> Your website, explained clearly</div>}>
      <h1>Know what is holding<br />your website back.</h1>
      <p className="hero-copy">LaunchLens turns a public URL into a clear, shareable website health report — performance, SEO, accessibility and the actions that matter most.</p>
      <AuditForm />
      <p className="fine-print">No account required. Reports are private, shareable links and expire after 30 days.</p>
      <div className="hero-proof"><CheckCircle2 size={17} /> Real Lighthouse data <CheckCircle2 size={17} /> Mobile + desktop <CheckCircle2 size={17} /> PDF export</div>
    </SectionFrame>
    <SectionFrame className="feature-section shell" label="One URL. A clearer next step.">
      <div className="section-intro"><h2>Technical insight without the technical fog.</h2></div>
      <div className="features">{features.map(([Icon, title, copy]) => <article className="feature-card" key={title as string}><Icon size={25} strokeWidth={1.7} /><h3>{title as string}</h3><p>{copy as string}</p></article>)}</div>
    </SectionFrame>
    <SectionFrame className="landing-sample-section shell" label="Built for useful conversations"><div className="sample"><div><h2>A report your client<br />will understand.</h2><p>Start with the few changes most likely to improve a visitor&apos;s experience. Open the technical detail only when you need it.</p><Link href="/example" className="text-link">View an example report <ArrowUpRight size={16}/></Link></div><div className="score-preview"><p>Website health score</p><div className="score">84</div><span>Strong foundation</span><div className="preview-bars"><i /><i /><i /><i /></div></div></div></SectionFrame>
    <SiteFooter />
  </main>;
}
