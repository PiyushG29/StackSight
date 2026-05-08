"use client";

import { useEffect, useState } from "react";
import { getCatalogSnapshot } from "@/lib/audit-engine";
import type { AuditReport } from "@/lib/types";
import { ResultsView } from "@/components/results-view";
import { LeadForm } from "@/components/lead-form";

const catalog = getCatalogSnapshot();
const storageKey = "stacksight-form-v1";

type FormState = {
  companyName: string;
  teamSize: number;
  primaryUseCase: "coding" | "writing" | "data" | "research" | "mixed";
  tools: Array<{
    toolKey: string;
    planName: string;
    monthlySpend: number;
    seats: number;
  }>;
};

const initialState: FormState = {
  companyName: "",
  teamSize: 6,
  primaryUseCase: "coding",
  tools: [
    { toolKey: "cursor", planName: "Business", monthlySpend: 240, seats: 6 },
    { toolKey: "chatgpt", planName: "Team", monthlySpend: 180, seats: 6 }
  ]
};

export function AuditForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [report, setReport] = useState<AuditReport | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      try {
        setForm(JSON.parse(saved) as FormState);
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(form));
  }, [form]);

  function updateTool(index: number, field: keyof FormState["tools"][number], value: string | number) {
    setForm((current) => {
      const tools = [...current.tools];
      tools[index] = { ...tools[index], [field]: value };
      return { ...current, tools };
    });
  }

  function addTool() {
    setForm((current) => ({
      ...current,
      tools: [...current.tools, { toolKey: "copilot", planName: "Individual", monthlySpend: 10, seats: 1 }]
    }));
  }

  function removeTool(index: number) {
    setForm((current) => ({ ...current, tools: current.tools.filter((_, itemIndex) => itemIndex !== index) }));
  }

  async function runAudit() {
    setPending(true);
    setError("");
    const response = await fetch("/api/audits", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = (await response.json()) as { report?: AuditReport; error?: string };
    setPending(false);

    if (!response.ok || !data.report) {
      setError(data.error ?? "Could not create report.");
      return;
    }

    setReport(data.report);
  }

  return (
    <div className="grid">
      <div className="stack">
        <section className="hero">
          <span className="pill">Free AI spend benchmark for startup teams</span>
          <h1 className="headline">Find the AI budget leaks before finance does.</h1>
          <p className="subhead">
            StackSight audits what your team pays for Cursor, Copilot, Claude, ChatGPT, Gemini, APIs, and v0, then shows where to downgrade, consolidate, or switch without losing capability.
          </p>
          <div className="ctaRow">
            <button className="btn" type="button" onClick={() => document.getElementById("audit-form")?.scrollIntoView()}>
              Run a free audit
            </button>
            <a className="btnGhost" href="#proof">
              See sample signals
            </a>
          </div>
          <div className="statRow" id="proof">
            <div className="card statCard">
              <div className="muted fine">Decision style</div>
              <div className="statValue">Rule based</div>
              <div className="muted">Plan fit, seat count, use case, and credit eligibility instead of vibe-based LLM math.</div>
            </div>
            <div className="card statCard">
              <div className="muted fine">Lead gen trigger</div>
              <div className="statValue">$500+</div>
              <div className="muted">High-savings audits get a stronger Credex call-to-action because there is enough budget to matter.</div>
            </div>
            <div className="card statCard">
              <div className="muted fine">Shareability</div>
              <div className="statValue">Public URL</div>
              <div className="muted">Each audit is stored server-side and exposed through a redacted report page with social metadata.</div>
            </div>
          </div>
        </section>

        <section className="card panel" id="audit-form">
          <h2>Audit input</h2>
          <p className="muted">Value first, email later. Add the tools you actually pay for and the amount you really see on the bill.</p>
          <div className="inputGrid">
            <label className="field">
              <span>Company name</span>
              <input value={form.companyName} onChange={(event) => setForm({ ...form, companyName: event.target.value })} />
            </label>
            <label className="field">
              <span>Team size</span>
              <input
                min="1"
                type="number"
                value={form.teamSize}
                onChange={(event) => setForm({ ...form, teamSize: Number(event.target.value) || 1 })}
              />
            </label>
            <label className="field">
              <span>Primary use case</span>
              <select
                value={form.primaryUseCase}
                onChange={(event) => setForm({ ...form, primaryUseCase: event.target.value as FormState["primaryUseCase"] })}
              >
                <option value="coding">Coding</option>
                <option value="writing">Writing</option>
                <option value="data">Data</option>
                <option value="research">Research</option>
                <option value="mixed">Mixed</option>
              </select>
            </label>
          </div>

          <div className="toolGrid">
            {form.tools.map((tool, index) => {
              const toolConfig = catalog.find((item) => item.key === tool.toolKey) ?? catalog[0];
              const availablePlans = toolConfig.plans;
              return (
                <div className="toolCard card" key={`${tool.toolKey}-${index}`}>
                  <label className="field">
                    <span>Tool</span>
                    <select
                      value={tool.toolKey}
                      onChange={(event) => {
                        const nextTool = catalog.find((item) => item.key === event.target.value) ?? catalog[0];
                        updateTool(index, "toolKey", nextTool.key);
                        updateTool(index, "planName", nextTool.plans[0]?.name ?? "");
                      }}
                    >
                      {catalog.map((item) => (
                        <option key={item.key} value={item.key}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="field">
                    <span>Plan</span>
                    <select value={tool.planName} onChange={(event) => updateTool(index, "planName", event.target.value)}>
                      {availablePlans.map((plan) => (
                        <option key={plan.name} value={plan.name}>
                          {plan.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="field">
                    <span>Monthly spend</span>
                    <input
                      min="0"
                      type="number"
                      value={tool.monthlySpend}
                      onChange={(event) => updateTool(index, "monthlySpend", Number(event.target.value) || 0)}
                    />
                  </label>
                  <label className="field">
                    <span>Seats</span>
                    <input min="1" type="number" value={tool.seats} onChange={(event) => updateTool(index, "seats", Number(event.target.value) || 1)} />
                  </label>
                  <button className="btnGhost" type="button" onClick={() => removeTool(index)}>
                    Remove tool
                  </button>
                </div>
              );
            })}
          </div>

          <div className="ctaRow">
            <button className="btnGhost" type="button" onClick={addTool}>
              Add another tool
            </button>
            <button className="btn" disabled={pending} type="button" onClick={runAudit}>
              {pending ? "Running audit..." : "Generate audit"}
            </button>
          </div>
          {error ? <div className="error">{error}</div> : null}
        </section>
      </div>

      <aside className="stack">
        <section className="card panel">
          <h3>What the engine checks</h3>
          <div className="list">
            <div className="listItem">Plan-to-seat fit. Two users on an enterprise-style plan are usually paying for controls they do not use.</div>
            <div className="listItem">Same-vendor downgrade path. If a cheaper plan can still support the team, the engine recommends that first.</div>
            <div className="listItem">Cross-vendor substitute. The tool only suggests a switch when another product covers the same primary job materially cheaper.</div>
            <div className="listItem">Credit arbitrage. For high monthly spend, the engine models additional savings from discounted infrastructure credits.</div>
          </div>
        </section>

        {report ? (
          <>
            <ResultsView report={report} />
            <LeadForm reportId={report.id} thresholdHighSavings={report.totalSavingsMonthly > 500} />
          </>
        ) : (
          <section className="card panel">
            <h3>What happens after submit</h3>
            <div className="list">
              <div className="listItem">The backend calculates a deterministic audit, then stores a shareable public report.</div>
              <div className="listItem">A personalized summary is generated with Anthropic or OpenAI when an API key exists. Otherwise the app falls back gracefully.</div>
              <div className="listItem">Lead capture happens after the result is visible, not before.</div>
            </div>
          </section>
        )}
      </aside>
    </div>
  );
}

