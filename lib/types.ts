export type ToolPlan = {
  name: string;
  monthlySeatPrice: number | null;
  note?: string;
};

export type ToolCatalogItem = {
  key: string;
  label: string;
  category: "coding" | "assistant" | "api" | "workspace";
  vendor: string;
  plans: ToolPlan[];
  enterpriseOnly?: boolean;
};

export type ToolInput = {
  toolKey: string;
  planName: string;
  monthlySpend: number;
  seats: number;
};

export type SpendAuditInput = {
  companyName?: string;
  teamSize: number;
  primaryUseCase: "coding" | "writing" | "data" | "research" | "mixed";
  tools: ToolInput[];
};

export type AuditAction = "keep" | "downgrade" | "switch" | "use-credits" | "trim-seats";

export type ToolAudit = {
  toolKey: string;
  toolLabel: string;
  currentPlan: string;
  currentMonthlySpend: number;
  recommendedPlan: string;
  recommendedMonthlySpend: number;
  recommendedTool?: string;
  savingsMonthly: number;
  savingsAnnual: number;
  reason: string;
  action: AuditAction;
};

export type AuditReport = {
  id: string;
  createdAt: string;
  input: SpendAuditInput;
  results: ToolAudit[];
  totalCurrentMonthly: number;
  totalRecommendedMonthly: number;
  totalSavingsMonthly: number;
  totalSavingsAnnual: number;
  summary: string;
  callToAction: string;
};

export type LeadCapturePayload = {
  reportId: string;
  email: string;
  companyName?: string;
  role?: string;
  teamSize?: number;
  honeypot?: string;
};

