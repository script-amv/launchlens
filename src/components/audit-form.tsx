"use client";

import { useRef, useState } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export function AuditForm() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSlowNotice, setShowSlowNotice] = useState(false);
  const slowTimer = useRef<number | undefined>(undefined);
  const router = useRouter();
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setShowSlowNotice(false);
    if (!url.trim()) {
      router.push("/example");
      return;
    }
    setLoading(true);
    slowTimer.current = window.setTimeout(
      () => setShowSlowNotice(true),
      10_000,
    );
    try {
      const res = await fetch("/api/audits", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error ?? "We could not audit that address.");
      router.push(data.reportUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    } finally {
      if (slowTimer.current) window.clearTimeout(slowTimer.current);
    }
  }
  return (
    <div className="audit-form-wrap">
      <form className="audit-form" onSubmit={submit}>
        <div>
          <label className="sr-only" htmlFor="audit-url">
            Public website URL
          </label>
          <input
            id="audit-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://brightfield.studio/"
            inputMode="url"
            disabled={loading}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "audit-error" : undefined}
          />
        </div>
        <button disabled={loading}>
          {loading ? (
            <LoaderCircle className="spin" size={18} />
          ) : (
            <>
              Audit my site <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>
      {loading && showSlowNotice && (
        <p className="form-loading-note" role="status">
          Still analysing your site — complex pages can take up to a minute.
        </p>
      )}
      {error && (
        <p className="form-error" id="audit-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
