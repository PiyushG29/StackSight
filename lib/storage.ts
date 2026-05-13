import { getSupabaseAdmin } from "@/lib/supabase";
import type { AuditReport, LeadCapturePayload } from "@/lib/types";

type RateLimitRow = {
  key: string;
  hits: number;
  window_started_at: string;
};

export async function saveReport(report: AuditReport) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("audit_reports").upsert({
    id: report.id,
    created_at: report.createdAt,
    team_size: report.input.teamSize,
    primary_use_case: report.input.primaryUseCase,
    company_name: report.input.companyName ?? null,
    total_current_monthly: report.totalCurrentMonthly,
    total_recommended_monthly: report.totalRecommendedMonthly,
    total_savings_monthly: report.totalSavingsMonthly,
    total_savings_annual: report.totalSavingsAnnual,
    summary: report.summary,
    call_to_action: report.callToAction,
    input_json: report.input,
    results_json: report.results
  });

  if (error) {
    throw error;
  }
}

export async function getReport(id: string): Promise<AuditReport | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("audit_reports")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    createdAt: data.created_at,
    input: data.input_json as AuditReport["input"],
    results: data.results_json as AuditReport["results"],
    totalCurrentMonthly: data.total_current_monthly,
    totalRecommendedMonthly: data.total_recommended_monthly,
    totalSavingsMonthly: data.total_savings_monthly,
    totalSavingsAnnual: data.total_savings_annual,
    summary: data.summary,
    callToAction: data.call_to_action
  };
}

export async function saveLead(payload: LeadCapturePayload) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("audit_leads").insert({
    report_id: payload.reportId,
    email: payload.email,
    company_name: payload.companyName ?? null,
    role: payload.role ?? null,
    team_size: payload.teamSize ?? null
  });

  if (error) {
    throw error;
  }
}

export async function consumeRateLimit(key: string, maxHits = 5, windowMs = 5 * 60 * 1000) {
  const supabase = getSupabaseAdmin();
  const now = Date.now();
  const safeKey = key.replace(/[^a-z0-9-]/gi, "_");

  const { data, error } = await supabase
    .from("rate_limits")
    .select("key,hits,window_started_at")
    .eq("key", safeKey)
    .maybeSingle<RateLimitRow>();

  if (error) {
    throw error;
  }

  let hits = 1;
  let windowStartedAt = new Date(now).toISOString();

  if (data) {
    const started = new Date(data.window_started_at).getTime();
    if (now - started < windowMs) {
      hits = data.hits + 1;
      windowStartedAt = data.window_started_at;
    }
  }

  const { error: upsertError } = await supabase.from("rate_limits").upsert({
    key: safeKey,
    hits,
    window_started_at: windowStartedAt
  });

  if (upsertError) {
    throw upsertError;
  }

  return {
    allowed: hits <= maxHits,
    remaining: Math.max(0, maxHits - hits)
  };
}

