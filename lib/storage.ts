import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { AuditReport, LeadCapturePayload } from "@/lib/types";

const root = process.cwd();
const reportsDir = path.join(root, "data", "reports");
const leadsDir = path.join(root, "data", "leads");
const rateLimitDir = path.join(root, "data", "rate-limit");

async function ensure(dir: string) {
  await mkdir(dir, { recursive: true });
}

export async function saveReport(report: AuditReport) {
  await ensure(reportsDir);
  const reportPath = path.join(reportsDir, `${report.id}.json`);
  await writeFile(reportPath, JSON.stringify(report, null, 2), "utf8");
}

export async function getReport(id: string): Promise<AuditReport | null> {
  try {
    const reportPath = path.join(reportsDir, `${id}.json`);
    const contents = await readFile(reportPath, "utf8");
    return JSON.parse(contents) as AuditReport;
  } catch {
    return null;
  }
}

export async function saveLead(payload: LeadCapturePayload) {
  await ensure(leadsDir);
  const leadPath = path.join(leadsDir, `${payload.reportId}-${Date.now()}.json`);
  await writeFile(leadPath, JSON.stringify({ ...payload, capturedAt: new Date().toISOString() }, null, 2), "utf8");
}

export async function consumeRateLimit(key: string, maxHits = 5, windowMs = 5 * 60 * 1000) {
  await ensure(rateLimitDir);
  const safeKey = key.replace(/[^a-z0-9-]/gi, "_");
  const limitPath = path.join(rateLimitDir, `${safeKey}.json`);
  let history: number[] = [];

  try {
    const contents = await readFile(limitPath, "utf8");
    history = JSON.parse(contents) as number[];
  } catch {
    history = [];
  }

  const now = Date.now();
  const recent = history.filter((stamp) => now - stamp < windowMs);
  recent.push(now);

  await writeFile(limitPath, JSON.stringify(recent), "utf8");
  return {
    allowed: recent.length <= maxHits,
    remaining: Math.max(0, maxHits - recent.length)
  };
}

