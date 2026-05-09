"use client";

import Link from "next/link";
import type { AuditReport } from "@/lib/types";

export function ResultsView({ report }: { report: AuditReport }) {
  return (
    <div className="stack">
      <div className="card resultCard heroResult">
        <span className="kicker">Audit result</span>
        <h2 className="savings">${report.totalSavingsMonthly.toFixed(0)}/mo saved</h2>
        <p className="subhead">{report.summary}</p>
        <div className="detailGrid">
          <div>
            <div className="muted fine">Current monthly spend</div>
            <strong>${report.totalCurrentMonthly.toFixed(2)}</strong>
          </div>
          <div>
            <div className="muted fine">Recommended monthly spend</div>
            <strong>${report.totalRecommendedMonthly.toFixed(2)}</strong>
          </div>
          <div>
            <div className="muted fine">Annual savings</div>
            <strong>${report.totalSavingsAnnual.toFixed(2)}</strong>
          </div>
        </div>
        <span className="badge">{report.callToAction}</span>
        <Link className="btn" href={`/report/${report.id}`}>
          Open shareable report
        </Link>
      </div>

      <div className="list">
        {report.results.map((item) => (
          <div className="listItem" key={`${item.toolKey}-${item.currentPlan}`}>
            <div className="priceLine">
              <strong>{item.toolLabel}</strong>
              <span className="badge">${item.savingsMonthly.toFixed(2)} / month</span>
            </div>
            <div className="muted fine">
              {item.currentPlan} to {item.recommendedTool ?? item.toolLabel} {item.recommendedPlan}
            </div>
            <div className="priceLine">
              <span>${item.currentMonthlySpend.toFixed(2)} now</span>
              <span>${item.recommendedMonthlySpend.toFixed(2)} recommended</span>
            </div>
            <div>{item.reason}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

