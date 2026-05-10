import type { AuditReport } from "@/lib/types";

function fallbackSummary(report: AuditReport) {
  const topTools = [...report.results].sort((a, b) => b.savingsMonthly - a.savingsMonthly).slice(0, 2);
  const toolText = topTools.map((item) => `${item.toolLabel} (${item.recommendedPlan})`).join(" and ");
  return `Your audit shows about $${report.totalSavingsMonthly.toFixed(0)}/month in savings potential. The highest-leverage move is simplifying spend around ${toolText || "the current stack"}, while avoiding enterprise-style pricing before the team genuinely needs those controls.`;
}

export async function generateSummary(report: AuditReport) {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openAiKey = process.env.OPENAI_API_KEY;
  const prompt = [
    "Write a 90-120 word founder-facing summary of this AI spend audit.",
    "Be direct, practical, and numeric.",
    "Mention whether the savings are minor, moderate, or high.",
    "Input:",
    JSON.stringify(
      {
        companyName: report.input.companyName ?? "Not provided",
        teamSize: report.input.teamSize,
        useCase: report.input.primaryUseCase,
        totalCurrentMonthly: report.totalCurrentMonthly,
        totalRecommendedMonthly: report.totalRecommendedMonthly,
        totalSavingsMonthly: report.totalSavingsMonthly,
        totalSavingsAnnual: report.totalSavingsAnnual,
        results: report.results
      },
      null,
      2
    )
  ].join("\n");

  try {
    if (anthropicKey) {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": anthropicKey,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-20250514",
          max_tokens: 220,
          messages: [{ role: "user", content: prompt }]
        })
      });

      if (response.ok) {
        const data = (await response.json()) as {
          content?: Array<{ type: string; text?: string }>;
        };
        const text = data.content?.find((item) => item.type === "text")?.text?.trim();
        if (text) {
          return text;
        }
      }
    }

    if (openAiKey) {
      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${openAiKey}`
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL ?? "gpt-5-mini",
          input: prompt
        })
      });

      if (response.ok) {
        const data = (await response.json()) as { output_text?: string };
        if (data.output_text?.trim()) {
          return data.output_text.trim();
        }
      }
    }
  } catch {
    return fallbackSummary(report);
  }

  return fallbackSummary(report);
}

