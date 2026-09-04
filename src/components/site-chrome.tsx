import Link from "next/link";

export function SiteHeader() {
  return <nav className="site-header shell"><Link href="/" className="brand">launch<span>lens</span></Link><div className="nav-links"><Link href="/example">Example report</Link><Link href="/#how-it-works">How it works</Link></div></nav>;
}

export function SiteFooter() {
  return <footer className="site-footer shell"><Link href="/" className="brand">launch<span>lens</span></Link><span>Website health, made clear.</span><div><Link href="/legal/privacy">Privacy</Link><Link href="/legal/terms">Terms</Link></div></footer>;
}
