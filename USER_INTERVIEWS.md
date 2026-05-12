# User Interviews

## Interview 1

- Name / initials: PrintX team lead
- Role: Design and brand operations lead
- Company stage: Mid-sized startup
- Quote 1: "We just add tools when a designer says they need a specific look or better prose."
- Quote 2: "Claude and ChatGPT do roughly the same thing for us, but the team is split on which personality they prefer, so we pay for both."
- Quote 3: "If someone hasn't touched Midjourney in 20 days, I want to know."
- Most surprising thing they said: The waste was not coming from a lack of interest in AI, but from aesthetic preference and workflow taste. They were willing to pay for overlapping tools simply because different creatives liked different output styles.
- What it changed about the design: This pushed me to think beyond price comparisons and include inactive-seat visibility and duplication signals. It also reinforced that the product should recommend consolidation opportunities, such as moving scattered individual subscriptions into one cleaner team-level setup where appropriate.

PrintX is a merch and digital-printing startup using AI mostly for creative exploration and marketing support. Their team currently pays for ChatGPT Plus, Claude Pro, Midjourney, and Canva's AI features, with monthly spend roughly in the $150-$200 range. The conversation made it clear that the company is not making centralized procurement decisions; instead, tool adoption happens organically when a designer or marketer wants a particular style or output quality.

The strongest signal from this interview was that "duplicate" tools do not always feel duplicate to users. From a finance lens, Claude and ChatGPT overlap heavily. From a creative team's point of view, they can feel different enough to justify keeping both. That means the audit product cannot just say "cancel one" without explanation. It needs to show why the overlap matters financially, and ideally surface low-friction actions like dormant-seat detection, last-used timestamps, and a guided path to consolidation.

## Interview 2

- Name / initials: QSkip engineering lead
- Role: Engineering manager / technical operator
- Company stage: High-growth startup
- Quote 1: "Having Copilot and Cursor feels redundant, but the devs claim they need both for different workflows."
- Quote 2: "If we're paying for a seat but the dev is mostly using their own API key, we're burning cash."
- Quote 3: "If I have to type in my spend, I'm out."
- Most surprising thing they said: Their biggest frustration was not just vendor overlap, but the inability to connect seat subscriptions with actual usage behavior. The waste was in the mismatch between what the company pays for and what developers really use day-to-day.
- What it changed about the design: It pushed me to think about integrations and workflow automation instead of treating the product like a one-time calculator. It also made me more confident that a future version should support alerts, team-level recommendations, and API-versus-seat comparisons.

QSkip is a lean fintech startup with a small but high-output engineering team. Their tool stack includes GitHub Copilot for most developers, Cursor for lead developers, and OpenAI API credits for product features. Their estimated spend is around $400-$600 per month, but they described the API portion as volatile and harder to reason about than seat-based subscriptions.

This conversation highlighted a very different kind of buyer from PrintX. The engineering lead was less concerned with copy style or output personality and more concerned with operational efficiency. They were already fairly confident in some parts of their stack, but still had blind spots, especially when a non-engineering teammate bought an additional AI tool without clear team-level visibility. The most useful direction for them was not "show me what ChatGPT costs," but "show me when I am paying twice for the same capability and which payment method is actually doing the work."

## Interview 3

- Name / initials: TheLastMile operations stakeholder
- Role: Operations / systems lead
- Company stage: Late-stage startup
- Quote 1: "We have shadow AI where employees buy their own subs and expense them because the corporate version is too restrictive."
- Quote 2: "We're paying for Enterprise seats that aren't being used, while simultaneously reimbursing individual Pro subs."
- Quote 3: "If it doesn't comply with our security and SOC2 standards, we can't use it."
- Most surprising thing they said: The real budget leak was not poor plan selection alone. It was governance failure: unused enterprise licenses on one side, employee-expensed shadow subscriptions on the other, all happening at the same time.
- What it changed about the design: This made security and admin controls feel much more central to the product. It also introduced a more enterprise-ready use case: identifying shadow AI, reclaiming inactive seats, and showing where reimbursement behavior conflicts with official company tooling.

TheLastMile is a larger logistics startup with a broad operations organization and high internal complexity. Their current stack includes ChatGPT Enterprise, Perplexity for research-heavy work, and Microsoft 365 Copilot. Their AI spend is already above $2,500 per month, but the stakeholder described having "zero" confidence in whether the company is spending well because individual employees keep bypassing official tools and expensing their own subscriptions.

This interview expanded the product from a startup savings calculator into something closer to an internal AI spend governance layer. The most compelling opportunities were not simple downgrades, but identifying shadow AI usage, reconciling corporate licenses with reimbursement behavior, and creating workflows to reclaim or reassign unused seats. It also raised an important trust requirement: if the product wants larger teams to adopt it, it cannot feel like a lightweight consumer tool. It needs to signal security maturity and operational credibility.
