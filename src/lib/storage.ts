import { createClient } from "@supabase/supabase-js";
import type { AuditReport } from "./types";
const memory = new Map<string, AuditReport>();
const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY) : null;
export async function saveReport(report: AuditReport) { memory.set(report.id, report); if (supabase) { const { error } = await supabase.from("audit_reports").upsert({ id: report.id, target_url: report.url, hostname: report.hostname, created_at: report.createdAt, expires_at: report.expiresAt, status: "complete", result: report }); if (error) throw new Error(error.message); } }
export async function getReport(id: string) { if (supabase) { const { data } = await supabase.from("audit_reports").select("result").eq("id", id).single(); return data?.result as AuditReport | undefined; } return memory.get(id); }
