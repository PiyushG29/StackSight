import { NextResponse } from "next/server";
import { buildAudit } from "@/lib/audit-engine";
import { generateSummary } from "@/lib/summary";
import { saveReport } from "@/lib/storage";
import type { SpendAuditInput } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const input = (await request.json()) as SpendAuditInput;
    if (!input || !Array.isArray(input.tools) || input.tools.length === 0) {
      return NextResponse.json({ error: "At least one tool is required." }, { status: 400 });
    }

    const report = buildAudit(input);
    report.summary = await generateSummary(report);
    await saveReport(report);

    return NextResponse.json({ report });
  } catch {
    return NextResponse.json({ error: "Unable to build audit." }, { status: 500 });
  }
}

