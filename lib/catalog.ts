import type { ToolCatalogItem } from "@/lib/types";

export const TOOL_CATALOG: ToolCatalogItem[] = [
  {
    key: "cursor",
    label: "Cursor",
    vendor: "Cursor",
    category: "coding",
    plans: [
      { name: "Hobby", monthlySeatPrice: 0 },
      { name: "Pro", monthlySeatPrice: 20 },
      { name: "Business", monthlySeatPrice: 40 },
      { name: "Enterprise", monthlySeatPrice: null, note: "Custom pricing" }
    ]
  },
  {
    key: "copilot",
    label: "GitHub Copilot",
    vendor: "GitHub",
    category: "coding",
    plans: [
      { name: "Individual", monthlySeatPrice: 10 },
      { name: "Business", monthlySeatPrice: 19 },
      { name: "Enterprise", monthlySeatPrice: 39 }
    ]
  },
  {
    key: "claude",
    label: "Claude",
    vendor: "Anthropic",
    category: "assistant",
    plans: [
      { name: "Free", monthlySeatPrice: 0 },
      { name: "Pro", monthlySeatPrice: 20 },
      { name: "Max", monthlySeatPrice: 100 },
      { name: "Team", monthlySeatPrice: 30 },
      { name: "Enterprise", monthlySeatPrice: null, note: "Contact sales" },
      { name: "API direct", monthlySeatPrice: null, note: "Usage based" }
    ]
  },
  {
    key: "chatgpt",
    label: "ChatGPT",
    vendor: "OpenAI",
    category: "assistant",
    plans: [
      { name: "Plus", monthlySeatPrice: 20 },
      { name: "Team", monthlySeatPrice: 30 },
      { name: "Enterprise", monthlySeatPrice: null, note: "Contact sales" },
      { name: "API direct", monthlySeatPrice: null, note: "Usage based" }
    ]
  },
  {
    key: "anthropic-api",
    label: "Anthropic API direct",
    vendor: "Anthropic",
    category: "api",
    plans: [{ name: "API direct", monthlySeatPrice: null, note: "Usage based" }]
  },
  {
    key: "openai-api",
    label: "OpenAI API direct",
    vendor: "OpenAI",
    category: "api",
    plans: [{ name: "API direct", monthlySeatPrice: null, note: "Usage based" }]
  },
  {
    key: "gemini",
    label: "Gemini",
    vendor: "Google",
    category: "assistant",
    plans: [
      { name: "Pro", monthlySeatPrice: 20 },
      { name: "Ultra", monthlySeatPrice: 250 },
      { name: "API", monthlySeatPrice: null, note: "Usage based" }
    ]
  },
  {
    key: "v0",
    label: "v0",
    vendor: "Vercel",
    category: "coding",
    plans: [
      { name: "Premium", monthlySeatPrice: 20 },
      { name: "Team", monthlySeatPrice: 30 },
      { name: "Business", monthlySeatPrice: 100 },
      { name: "Enterprise", monthlySeatPrice: null, note: "Custom pricing" }
    ]
  }
];

export const CREDIT_ELIGIBLE_TOOLS = new Set(["cursor", "claude", "chatgpt", "copilot"]);

export function findTool(toolKey: string) {
  return TOOL_CATALOG.find((tool) => tool.key === toolKey);
}

