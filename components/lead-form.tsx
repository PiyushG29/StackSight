"use client";

import { useState } from "react";

export function LeadForm({ reportId, thresholdHighSavings }: { reportId: string; thresholdHighSavings: boolean }) {
  const [status, setStatus] = useState<string>("");
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setPending(true);
    setStatus("");

    const response = await fetch("/api/leads", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        reportId,
        email: formData.get("email"),
        companyName: formData.get("companyName"),
        role: formData.get("role"),
        teamSize: Number(formData.get("teamSize") || 0),
        honeypot: formData.get("website")
      })
    });

    const data = (await response.json()) as { message?: string };
    setStatus(data.message ?? (response.ok ? "Saved." : "Something went wrong."));
    setPending(false);
  }

  return (
    <div className="card leadCard">
      <h3>{thresholdHighSavings ? "Capture the savings" : "Get notified later"}</h3>
      <p className="muted">
        {thresholdHighSavings
          ? "Leave your email and StackSight will send the audit plus the next-step note for discounted credits."
          : "Your stack looks pretty healthy already. Leave an email to hear when new optimizations apply."}
      </p>
      <form
        action={async (formData) => {
          await onSubmit(formData);
        }}
        className="stack"
      >
        <div className="detailGrid">
          <label className="field">
            <span>Email</span>
            <input required name="email" type="email" placeholder="founder@company.com" />
          </label>
          <label className="field">
            <span>Company name</span>
            <input name="companyName" type="text" placeholder="Northstar Labs" />
          </label>
          <label className="field">
            <span>Role</span>
            <input name="role" type="text" placeholder="Engineering manager" />
          </label>
          <label className="field">
            <span>Team size</span>
            <input name="teamSize" type="number" min="1" placeholder="8" />
          </label>
        </div>
        <input name="website" tabIndex={-1} autoComplete="off" style={{ display: "none" }} />
        <button className="btn" disabled={pending} type="submit">
          {pending ? "Saving..." : "Email me the audit"}
        </button>
        {status ? <div className={status.toLowerCase().includes("saved") ? "success" : "muted"}>{status}</div> : null}
      </form>
    </div>
  );
}

