import { describe, expect, it } from "vitest";
import { buildAudit } from "@/lib/audit-engine";

describe("audit engine", () => {
  it("downgrades small cursor teams off business", () => {
    const report = buildAudit({
      teamSize: 2,
      primaryUseCase: "coding",
      tools: [{ toolKey: "cursor", planName: "Business", monthlySpend: 80, seats: 2 }]
    });

    expect(report.results[0]?.recommendedPlan).toBe("Pro");
    expect(report.totalSavingsMonthly).toBeGreaterThan(0);
  });

  it("flags large savings for expensive research plan", () => {
    const report = buildAudit({
      teamSize: 1,
      primaryUseCase: "writing",
      tools: [{ toolKey: "claude", planName: "Max", monthlySpend: 100, seats: 1 }]
    });

    expect(report.results[0]?.recommendedPlan).toBe("Pro");
    expect(report.totalSavingsMonthly).toBe(80);
  });

  it("keeps api-direct tools usage based", () => {
    const report = buildAudit({
      teamSize: 4,
      primaryUseCase: "data",
      tools: [{ toolKey: "openai-api", planName: "API direct", monthlySpend: 400, seats: 4 }]
    });

    expect(report.results[0]?.action).toBe("keep");
    expect(report.results[0]?.reason).toContain("usage based");
  });

  it("adds credit savings for eligible high-spend tools", () => {
    const report = buildAudit({
      teamSize: 10,
      primaryUseCase: "coding",
      tools: [{ toolKey: "cursor", planName: "Business", monthlySpend: 400, seats: 10 }]
    });

    expect(report.results[0]?.action).toBe("use-credits");
    expect(report.results[0]?.recommendedMonthlySpend).toBeLessThan(400);
  });

  it("marks low-savings audits honestly", () => {
    const report = buildAudit({
      teamSize: 1,
      primaryUseCase: "mixed",
      tools: [{ toolKey: "chatgpt", planName: "Plus", monthlySpend: 20, seats: 1 }]
    });

    expect(report.totalSavingsMonthly).toBeLessThan(100);
    expect(report.summary.toLowerCase()).toContain("fairly disciplined");
  });
});

