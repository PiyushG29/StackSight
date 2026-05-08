import { CREDIT_ELIGIBLE_TOOLS, TOOL_CATALOG, findTool } from "@/lib/catalog";
import type { AuditReport, SpendAuditInput, ToolAudit, ToolPlan } from "@/lib/types";

const CREDIT_DISCOUNT = 0.18;

function getPlan(toolKey: string, planName: string): ToolPlan | undefined {
  return findTool(toolKey)?.plans.find((plan) => plan.name === planName);
}

function inferRecommendedPlan(input: SpendAuditInput, toolKey: string, seats: number, currentPlan: string) {
  const tool = findTool(toolKey);
  if (!tool) {
    return { planName: currentPlan, monthlySpend: 0, reason: "Unknown tool; keeping current setup.", action: "keep" as const };
  }

  const plan = getPlan(toolKey, currentPlan);
  const listSpend = plan?.monthlySeatPrice ? plan.monthlySeatPrice * Math.max(seats, 1) : 0;

  if (tool.category === "api") {
    return {
      planName: currentPlan,
      monthlySpend: listSpend,
      reason: "API spend is usage based, so the defensible optimization is rightsizing prompts and routing volume.",
      action: "keep" as const
    };
  }

  if (currentPlan === "Enterprise" && seats <= 20) {
    const fallback = tool.plans.find((item) => item.name === "Business" || item.name === "Team");
    return {
      planName: fallback?.name ?? currentPlan,
      monthlySpend: (fallback?.monthlySeatPrice ?? 0) * Math.max(seats, 1),
      reason: "Enterprise controls are usually unnecessary at this seat count unless you need procurement, legal, or SSO requirements.",
      action: "downgrade" as const
    };
  }

  if ((currentPlan === "Team" || currentPlan === "Business") && seats <= 2) {
    const fallback = tool.plans.find((item) => ["Pro", "Plus", "Premium", "Individual"].includes(item.name));
    if (fallback?.monthlySeatPrice !== null && fallback?.monthlySeatPrice !== undefined) {
      return {
        planName: fallback.name,
        monthlySpend: fallback.monthlySeatPrice * Math.max(seats, 1),
        reason: "Small teams usually do not need centralized billing or admin controls badly enough to justify a team plan.",
        action: "downgrade" as const
      };
    }
  }

  if (currentPlan === "Max" && input.primaryUseCase !== "research") {
    return {
      planName: "Pro",
      monthlySpend: 20 * Math.max(seats, 1),
      reason: "The Max premium is hard to justify unless the team is leaning heavily on long-form reasoning every day.",
      action: "downgrade" as const
    };
  }

  return {
    planName: currentPlan,
    monthlySpend: listSpend,
    reason: "Current plan broadly matches the seat count and collaboration needs.",
    action: "keep" as const
  };
}

function inferAlternative(toolKey: string, useCase: SpendAuditInput["primaryUseCase"], seats: number) {
  if (useCase === "coding") {
    if (toolKey !== "copilot") {
      return { toolLabel: "GitHub Copilot", planName: "Individual", monthlySpend: 10 * seats };
    }
    return { toolLabel: "Cursor", planName: "Pro", monthlySpend: 20 * seats };
  }

  if (useCase === "writing" || useCase === "research") {
    return { toolLabel: "ChatGPT", planName: "Plus", monthlySpend: 20 * seats };
  }

  if (useCase === "data") {
    return { toolLabel: "Gemini", planName: "Pro", monthlySpend: 20 * seats };
  }

  return { toolLabel: "Claude", planName: "Pro", monthlySpend: 20 * seats };
}

function roundCurrency(value: number) {
  return Math.round(value * 100) / 100;
}

export function buildAudit(input: SpendAuditInput): AuditReport {
  const results: ToolAudit[] = input.tools.map((toolInput) => {
    const tool = findTool(toolInput.toolKey);
    const currentSpend = roundCurrency(toolInput.monthlySpend);
    const planRecommendation = inferRecommendedPlan(input, toolInput.toolKey, toolInput.seats, toolInput.planName);
    const alternative = inferAlternative(toolInput.toolKey, input.primaryUseCase, Math.max(toolInput.seats, 1));
    const isUsageBasedTool = tool?.category === "api" || toolInput.planName === "API direct";

    let recommendedMonthlySpend = currentSpend;
    let recommendedPlan = toolInput.planName;
    let recommendedTool = tool?.label;
    let reason = planRecommendation.reason;
    let action: ToolAudit["action"] = planRecommendation.action;

    if (planRecommendation.action !== "keep" && planRecommendation.monthlySpend > 0) {
      recommendedMonthlySpend = roundCurrency(planRecommendation.monthlySpend);
      recommendedPlan = planRecommendation.planName;
    } else if (!isUsageBasedTool && currentSpend > 0 && alternative.monthlySpend < currentSpend * 0.75) {
      recommendedMonthlySpend = roundCurrency(alternative.monthlySpend);
      recommendedPlan = alternative.planName;
      recommendedTool = alternative.toolLabel;
      reason = `A ${alternative.planName} subscription on ${alternative.toolLabel} covers this use case materially cheaper for the same seat count.`;
      action = "switch";
    }

    if (CREDIT_ELIGIBLE_TOOLS.has(toolInput.toolKey) && currentSpend >= 300) {
      const creditedSpend = roundCurrency(recommendedMonthlySpend * (1 - CREDIT_DISCOUNT));
      if (creditedSpend < recommendedMonthlySpend) {
        recommendedMonthlySpend = creditedSpend;
        reason = `${reason} On top of that, this category is a strong fit for discounted infrastructure credits instead of paying list price.`;
        action = "use-credits";
      }
    }

    const savingsMonthly = Math.max(0, roundCurrency(currentSpend - recommendedMonthlySpend));
    return {
      toolKey: toolInput.toolKey,
      toolLabel: tool?.label ?? toolInput.toolKey,
      currentPlan: toolInput.planName,
      currentMonthlySpend: currentSpend,
      recommendedPlan,
      recommendedMonthlySpend,
      recommendedTool,
      savingsMonthly,
      savingsAnnual: roundCurrency(savingsMonthly * 12),
      reason,
      action
    };
  });

  const totalCurrentMonthly = roundCurrency(results.reduce((sum, item) => sum + item.currentMonthlySpend, 0));
  const totalRecommendedMonthly = roundCurrency(results.reduce((sum, item) => sum + item.recommendedMonthlySpend, 0));
  const totalSavingsMonthly = roundCurrency(totalCurrentMonthly - totalRecommendedMonthly);
  const totalSavingsAnnual = roundCurrency(totalSavingsMonthly * 12);

  const summary =
    totalSavingsMonthly >= 500
      ? `Your stack has meaningful budget leakage. The biggest opportunities are plan compression, eliminating team-tier overhead for low seat counts, and capturing additional savings through discounted AI credits.`
      : totalSavingsMonthly < 100
        ? `Your stack is already fairly disciplined. The main value here is keeping a benchmark on file and watching for pricing changes, duplicate tools, or seat sprawl as the team grows.`
        : `You have clear but moderate savings available. Most of the upside comes from rightsizing a few plans and standardizing on cheaper tools for the jobs your team actually does most often.`;

  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    input,
    results,
    totalCurrentMonthly,
    totalRecommendedMonthly,
    totalSavingsMonthly,
    totalSavingsAnnual,
    summary,
    callToAction:
      totalSavingsMonthly >= 500
        ? "Book a Credex consultation to convert the identified savings into discounted credit procurement."
        : "Save this audit and opt in for pricing-change alerts so you hear when a new optimization applies."
  };
}

export function getCatalogSnapshot() {
  return TOOL_CATALOG.map((tool) => ({
    key: tool.key,
    label: tool.label,
    plans: tool.plans
  }));
}
