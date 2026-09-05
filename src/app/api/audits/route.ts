import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { auditRequestSchema } from "@/lib/url";
import { runAudit } from "@/lib/audit";
import { saveReport } from "@/lib/storage";
export const runtime = "nodejs";
export const maxDuration = 60;
export async function POST(request: Request) {
  try {
    const body = auditRequestSchema.parse(await request.json());
    const report = await runAudit(body.url);
    await saveReport(report);
    return NextResponse.json({
      id: report.id,
      reportUrl: `/report/${report.id}`,
    });
  } catch (error) {
    const message =
      error instanceof ZodError
        ? "Enter a public website URL to begin."
        : error instanceof Error
          ? error.message
          : "Audit failed. Please try again.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
