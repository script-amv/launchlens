import type { AuditReport } from "./types";

export const exampleReport: AuditReport = {
  id: "example", url: "https://brightfield.studio", hostname: "brightfield.studio", createdAt: "2026-10-24T10:00:00.000Z", expiresAt: "2026-11-23T10:00:00.000Z", overallScore: 84, source: "pagespeed",
  categories: { performance: { score: 91, label: "Performance", summary: "Fast mobile page load." }, seo: { score: 88, label: "SEO", summary: "Strong on-page technical signals." }, accessibility: { score: 76, label: "Accessibility", summary: "A few improvements remain." }, bestPractices: { score: 92, label: "Best practices", summary: "Secure and browser-ready." } },
  metrics: { lcp: "1.8s", inp: "88ms", cls: "0.03", fcp: "1.1s" },
  metadata: { title: "Brightfield Studio — Creative spaces", description: "Flexible studio spaces for ambitious teams.", h1Count: 1, hasViewport: true, hasCanonical: true, hasRobots: true, hasSitemap: true, hasHttps: true, finalUrl: "https://brightfield.studio" },
  findings: [
    { id: "images", severity: "high", title: "Compress oversized homepage images", detail: "Large images delay the first meaningful view on mobile.", action: "Convert hero and gallery assets to AVIF or WebP, then serve responsive sizes." },
    { id: "alt", severity: "high", title: "Add alt text to product photography", detail: "Important visual content is not described for assistive technology.", action: "Write concise alt text for each product image that adds meaning." },
    { id: "contrast", severity: "medium", title: "Improve mobile text contrast", detail: "Some secondary text is difficult to read against its background.", action: "Increase contrast for muted copy to meet accessible contrast guidance." },
  ], screenshots: { mobile: "/example-mobile-preview.svg" },
};
