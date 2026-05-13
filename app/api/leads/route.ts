import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { sendConfirmationEmail } from "@/lib/mail";
import { consumeRateLimit, getReport, saveLead } from "@/lib/storage";
import type { LeadCapturePayload } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as LeadCapturePayload;
    if (payload.honeypot) {
      return NextResponse.json({ message: "Saved." });
    }

    if (!payload.email || !payload.reportId) {
      return NextResponse.json({ message: "Email and report are required." }, { status: 400 });
    }

    const headerStore = await headers();
    const fingerprint = `${headerStore.get("x-forwarded-for") ?? "local"}-${payload.email}`;
    const limit = await consumeRateLimit(fingerprint, 4, 10 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json({ message: "Too many attempts. Please wait before trying again." }, { status: 429 });
    }

    const report = await getReport(payload.reportId);
    if (!report) {
      return NextResponse.json({ message: "Could not find report." }, { status: 404 });
    }

    await saveLead(payload);
    await sendConfirmationEmail(report, payload);

    return NextResponse.json({ message: "Saved. Check your inbox if email delivery is configured." });
  } catch (error) {
    console.error("Lead capture failed", error);
    return NextResponse.json({ message: "Could not save lead." }, { status: 500 });
  }
}
