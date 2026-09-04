"use client";

import { useState } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export function AuditForm() {
  const [url, setUrl] = useState(""); const [error, setError] = useState(""); const [loading, setLoading] = useState(false); const router = useRouter();
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError(""); setLoading(true);
    try { const res = await fetch("/api/audits", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ url }) }); const data = await res.json(); if (!res.ok) throw new Error(data.error ?? "We could not audit that address."); router.push(data.reportUrl); }
    catch (err) { setError(err instanceof Error ? err.message : "Something went wrong."); setLoading(false); }
  }
  return <form className="audit-form" onSubmit={submit}><div><input aria-label="Website URL" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://yourwebsite.com" inputMode="url" disabled={loading} /><span className="input-hint">Public website URL</span></div><button disabled={loading}>{loading ? <LoaderCircle className="spin" size={18}/> : <>Audit my site <ArrowRight size={18}/></>}</button>{error && <p className="form-error" role="alert">{error}</p>}</form>;
}
