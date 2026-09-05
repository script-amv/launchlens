import { randomUUID } from "crypto";
import { assertPublicUrl } from "./url";
import type { AuditReport, Category, Finding } from "./types";

type Psi = { lighthouseResult?: { categories?: Record<string, { score?: number }>; audits?: Record<string, { numericValue?: number; displayValue?: string; details?: { data?: string } }> } };
const score = (value?: number) => Math.round((value ?? 0) * 100);
const formatMs = (ms?: number) => !ms ? undefined : ms > 1000 ? `${(ms / 1000).toFixed(1)}s` : `${Math.round(ms)}ms`;

async function pageSpeed(url: string, strategy: "mobile" | "desktop"): Promise<Psi | null> {
  const key = process.env.GOOGLE_PAGESPEED_API_KEY; if (!key) return null;
  const params = new URLSearchParams({ url, strategy, key, category: "PERFORMANCE" });
  ["ACCESSIBILITY", "SEO", "BEST_PRACTICES"].forEach(category => params.append("category", category));
  // A signal is single-use: creating it per request prevents every later audit
  // from inheriting an already-expired timeout.
  const res = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params}`, { signal: AbortSignal.timeout(18_000) });
  if (!res.ok) throw new Error(res.status === 429 ? "The audit service is busy. Please try again shortly." : "Google PageSpeed could not analyze this website.");
  return res.json();
}

async function inspect(url: string) {
  let current = url; let response: Response | undefined;
  for (let hops = 0; hops <= 5; hops++) { response = await fetch(current, { signal: AbortSignal.timeout(18_000), redirect: "manual", headers: { "user-agent": "LaunchLens/1.0 (+website health audit)" } }); if (![301, 302, 303, 307, 308].includes(response.status)) break; const location = response.headers.get("location"); if (!location || hops === 5) throw new Error("This website has an invalid redirect chain."); current = await assertPublicUrl(new URL(location, current).toString()); }
  if (!response) throw new Error("We could not reach that website.");
  const html = (await response.text()).slice(0, 1_000_000); const finalUrl = response.url;
  const attr = (name: string, value: string) => new RegExp(`<[^>]+${name}=["'][^"']*${value}[^"']*["'][^>]*>`, "i").test(html);
  const tag = (name: string) => new RegExp(`<${name}(?:\\s|>)`, "i").test(html);
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/\s+/g, " ").trim();
  const description = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)/i)?.[1];
  const h1Count = (html.match(/<h1(?:\s|>)/gi) ?? []).length;
  const hasViewport = attr("name", "viewport"); const hasCanonical = attr("rel", "canonical");
  const imagesWithoutAlt = (html.match(/<img\b[^>]*>/gi) ?? []).filter(img => !/\balt\s*=/.test(img)).length;
  let hasRobots = false; let hasSitemap = false;
  try { hasRobots = (await fetch(new URL("/robots.txt", finalUrl), { signal: AbortSignal.timeout(6_000) })).ok; } catch { /* non-fatal */ }
  try { hasSitemap = (await fetch(new URL("/sitemap.xml", finalUrl), { signal: AbortSignal.timeout(6_000) })).ok; } catch { /* non-fatal */ }
  return { finalUrl, title, description, h1Count, hasViewport, hasCanonical, imagesWithoutAlt, hasRobots, hasSitemap, hasHttps: finalUrl.startsWith("https://"), hasOg: attr("property", "og:") || tag("meta") && /og:title/i.test(html) };
}

function localCategories(data: Awaited<ReturnType<typeof inspect>>): Record<"performance" | "seo" | "accessibility" | "bestPractices", Category> {
  const seo = Math.max(20, 100 - (!data.title ? 25 : 0) - (!data.description ? 20 : 0) - (!data.hasCanonical ? 10 : 0) - (!data.hasRobots ? 10 : 0) - (!data.hasSitemap ? 5 : 0));
  const access = Math.max(30, 100 - (!data.hasViewport ? 20 : 0) - Math.min(35, data.imagesWithoutAlt * 4));
  return { performance: { score: 76, label: "Performance", summary: "Connect Google PageSpeed for measured lab data." }, seo: { score: seo, label: "SEO", summary: "On-page technical signals." }, accessibility: { score: access, label: "Accessibility", summary: "Basic content accessibility signals." }, bestPractices: { score: data.hasHttps ? 92 : 45, label: "Best practices", summary: "Security and browser-ready setup." } };
}

export async function runAudit(input: string): Promise<AuditReport> {
  const url = await assertPublicUrl(input); const [inspection, mobile, desktop] = await Promise.all([inspect(url), pageSpeed(url, "mobile"), pageSpeed(url, "desktop")]);
  const fallback = localCategories(inspection); const categories = mobile?.lighthouseResult?.categories;
  const category = (key: string, label: string, fallbackCategory: Category): Category => ({ score: categories ? score(categories[key]?.score) : fallbackCategory.score, label, summary: fallbackCategory.summary });
  const result = { performance: category("performance", "Performance", fallback.performance), seo: category("seo", "SEO", fallback.seo), accessibility: category("accessibility", "Accessibility", fallback.accessibility), bestPractices: category("best-practices", "Best practices", fallback.bestPractices) };
  const findings: Finding[] = [];
  const add = (condition: boolean, id: string, title: string, severity: Finding["severity"], detail: string, action: string) => condition && findings.push({ id, title, severity, detail, action });
  add(result.performance.score < 50, "performance", "Your site feels slow on mobile", "high", `Mobile performance scored ${result.performance.score}/100.`, "Prioritise image compression, unused JavaScript, and server response time.");
  add(!inspection.hasHttps, "https", "Your site is not served securely", "critical", "The final page does not use HTTPS.", "Install and enforce an SSL certificate, then redirect all HTTP traffic to HTTPS.");
  add(!inspection.title, "title", "Page title is missing", "high", "Search engines and browser tabs have no clear page title.", "Add one concise, descriptive title element to the page.");
  add(!inspection.description, "description", "Meta description is missing", "high", "Search previews may use less useful page text.", "Add a unique 140–160 character meta description.");
  add(inspection.h1Count !== 1, "h1", "Heading structure needs attention", "medium", `We found ${inspection.h1Count} H1 headings; one clear primary heading is usually best.`, "Use one descriptive H1 for the main page topic.");
  add(!inspection.hasViewport, "viewport", "Mobile viewport is missing", "critical", "Mobile browsers may render the site at the wrong scale.", "Add the standard responsive viewport meta tag.");
  add(!inspection.hasCanonical, "canonical", "Canonical URL is missing", "medium", "Search engines may see duplicate URL variants as separate pages.", "Set a canonical URL for this page.");
  add(inspection.imagesWithoutAlt > 0, "alt", "Some images need alt text", "medium", `${inspection.imagesWithoutAlt} image${inspection.imagesWithoutAlt === 1 ? " is" : "s are"} missing alt text.`, "Add concise alternative text for informative images.");
  add(!inspection.hasRobots, "robots", "robots.txt was not found", "low", "We could not find a robots.txt file.", "Add robots.txt to document crawler guidance.");
  add(!inspection.hasSitemap, "sitemap", "Sitemap was not found", "low", "We could not find sitemap.xml.", "Publish an XML sitemap and reference it from robots.txt.");
  findings.sort((a, b) => ({ critical: 0, high: 1, medium: 2, low: 3 }[a.severity] - { critical: 0, high: 1, medium: 2, low: 3 }[b.severity]));
  const audits = mobile?.lighthouseResult?.audits ?? {}; const get = (id: string) => audits[id]; const screenshot = get("final-screenshot")?.details?.data;
  const created = new Date(); const overallScore = Math.round(result.performance.score * .35 + result.seo.score * .3 + result.accessibility.score * .2 + result.bestPractices.score * .15);
  return { id: randomUUID(), url, hostname: new URL(url).hostname, createdAt: created.toISOString(), expiresAt: new Date(created.getTime() + 30 * 864e5).toISOString(), overallScore, categories: result, metrics: { lcp: formatMs(get("largest-contentful-paint")?.numericValue), cls: get("cumulative-layout-shift")?.displayValue, inp: formatMs(get("interaction-to-next-paint")?.numericValue), fcp: formatMs(get("first-contentful-paint")?.numericValue) }, metadata: { ...inspection }, findings, screenshots: screenshot ? { mobile: screenshot } : {}, source: mobile ? "pagespeed" : "local" };
}
