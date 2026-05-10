import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LeadForm } from "@/components/lead-form";
import { getReport } from "@/lib/storage";

type Params = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const report = await getReport(id);

  if (!report) {
    return { title: "Report not found" };
  }

  const title = `StackSight audit: save $${report.totalSavingsMonthly.toFixed(0)}/month`;
  const description = report.summary;
  return {
    title,
    description,
    openGraph: { title, description, type: "article" },
    twitter: { card: "summary_large_image", title, description }
  };
}

export default async function ReportPage({ params }: Params) {
  const { id } = await params;
  const report = await getReport(id);

  if (!report) {
    notFound();
  }

  return (
    <main className="shell" style={{ padding: "2rem 0 4rem" }}>
      <div className="grid">
        <section className="stack">
          <div className="card resultCard heroResult">
            <span className="kicker">Public report</span>
            <h1 className="savings">${report.totalSavingsMonthly.toFixed(0)}/mo in potential savings</h1>
            <p className="subhead">{report.summary}</p>
            <div className="detailGrid">
              <div>
                <div className="muted fine">Primary use case</div>
                <strong>{report.input.primaryUseCase}</strong>
              </div>
              <div>
                <div className="muted fine">Team size</div>
                <strong>{report.input.teamSize}</strong>
              </div>
              <div>
                <div className="muted fine">Annual savings</div>
                <strong>${report.totalSavingsAnnual.toFixed(2)}</strong>
              </div>
            </div>
            <span className="badge">{report.callToAction}</span>
          </div>

          <div className="list">
            {report.results.map((item) => (
              <div className="listItem" key={`${item.toolKey}-${item.currentPlan}`}>
                <div className="priceLine">
                  <strong>{item.toolLabel}</strong>
                  <span>${item.currentMonthlySpend.toFixed(2)} to ${item.recommendedMonthlySpend.toFixed(2)}</span>
                </div>
                <div className="muted fine">
                  {item.currentPlan} to {item.recommendedTool ?? item.toolLabel} {item.recommendedPlan}
                </div>
                <div>{item.reason}</div>
              </div>
            ))}
          </div>
        </section>
        <aside className="stack">
          <LeadForm reportId={report.id} thresholdHighSavings={report.totalSavingsMonthly > 500} />
          <section className="card panel">
            <h3>Privacy note</h3>
            <p className="muted">Company name and email are intentionally excluded from this public page. Only tool choices and savings logic are shared.</p>
          </section>
        </aside>
      </div>
    </main>
  );
}

