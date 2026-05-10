import type { AuditReport, LeadCapturePayload } from "@/lib/types";

export async function sendConfirmationEmail(report: AuditReport, lead: LeadCapturePayload) {
  const resendKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!resendKey || !fromEmail) {
    return { delivered: false, reason: "Resend not configured" };
  }

  const html = `
    <h1>Your StackSight audit is ready</h1>
    <p>Estimated savings: <strong>$${report.totalSavingsMonthly.toFixed(2)}/month</strong> and <strong>$${report.totalSavingsAnnual.toFixed(2)}/year</strong>.</p>
    <p>Public report: ${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/report/${report.id}</p>
    <p>${report.callToAction}</p>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: fromEmail,
      to: lead.email,
      subject: "Your StackSight AI spend audit",
      html
    })
  });

  return { delivered: response.ok, reason: response.ok ? undefined : "Resend rejected request" };
}

