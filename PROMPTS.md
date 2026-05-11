# Prompts

## Summary prompt

```text
Write a 90-120 word founder-facing summary of this AI spend audit.
Be direct, practical, and numeric.
Mention whether the savings are minor, moderate, or high.
Input:
{report json}
```

## Why this prompt

The summary needs to sound like a concise operating note, not a marketing paragraph. I kept the prompt short because the report object already contains the structured facts, and the model’s job is only to synthesize, not to calculate.

## What I did not trust AI with

I did not use AI for the actual audit math. Plan-fit decisions, seat-count logic, downgrade recommendations, and savings calculations are deterministic because those are the parts a reviewer should be able to trace and defend.

## Fallback strategy

If the Anthropic or OpenAI request fails, the app returns a templated summary based on top savings drivers and total savings bands.

