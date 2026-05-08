# Tests

Automated tests live in [`tests/audit-engine.test.ts`](./tests/audit-engine.test.ts).

- `tests/audit-engine.test.ts` — downgrades small Cursor teams off Business when Pro fits
- `tests/audit-engine.test.ts` — flags oversized Claude Max spend and recommends Pro
- `tests/audit-engine.test.ts` — keeps usage-based API tools from receiving fake seat-plan recommendations
- `tests/audit-engine.test.ts` — applies credit discount logic for high-spend eligible tools
- `tests/audit-engine.test.ts` — labels low-savings audits honestly instead of manufacturing upside

## How to run

```bash
npm run test
```

