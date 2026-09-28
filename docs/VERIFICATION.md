# Verification record — 28 September 2026

## Automated checks

- `npm test`: 22 tests; business rules and PEAK fake-transport tests (no external account called).
- `npm run typecheck`: TypeScript check passed.
- `npm run lint`: ESLint passed, including CRM components and starter source.
- `npm run build`: Cloudflare-compatible worker/client output builds successfully. Secondary-module code splitting removed the earlier chunk-size warning. This is not a load/performance certification.

Tests cover exact-cent installments and month-end dates, minimum/month limits, refund 60-day boundary and ambiguous rules, certificate AND gates and unpaid balance, phone/email dedup, minor consent/interviews, approval permissions and separation of duties, duplicate/overpayment rejection, queue idempotency and required contact mapping, third-retry carry, seed balance reconciliation, role union/scope, CSV quoting/errors/duplicates, UTC timestamp/HMAC, token cache/concurrency and HTTP-200 business error rejection.

## Browser checks completed

- All 15 main modules render through navigation.
- Desktop 1440px light/dark themes visually inspected.
- Mobile 390×844 dashboard inspected: no document horizontal overflow; mobile navigation and customer form operate.
- Created synthetic customer `ทดสอบ ระบบเดโม` / `qa-lifelab@example.com`; customer count 24→25; record persisted after reload and could be found via read-only browser tool.
- Approved sample `PAY-3013` for 12,000 THB; status became Success and exactly one Payment queue item appeared in PEAK module.
- Retried `INV-2609-010`: Error→Success, attempt 2→3, stable DEMO external ID, repeat button disabled.
- Operations role hides finance navigation/amounts; direct `#finance` shows access denied in demo UI.
- Certificate `ENR-4002` eligible, `ENR-4005` disabled; eligible unlock changed HIDE→SHOW and exposed document/shipping actions.
- CSV preview classified a three-row synthetic file as 1 valid / 1 duplicate / 1 error. Parser/dedup also covered by unit tests. Full migration of real exports was not performed.
- `search_lifelab_customers` browser tool returns role-scoped synthetic results and rejects a numeric query.

## Clean-build browser verification

The built worker was started on http://127.0.0.1:8787 and the dashboard rendered with fresh synthetic seed. The lazy-loaded integration module opened successfully, and the real local GET status route returned the explicit disconnected Demo message. Tablet width 768 and mobile width 390 had document scrollWidth equal to viewport width.

## Development issues addressed

During hot updates, Vinext/React refreshed the provider and consumers at different revisions, causing a development-only missing-context overlay. Clean reload restored the app. Browser-only state now initializes after hydration, theme reads do not overwrite saved preference during mount, and secondary modules use lazy loading. An intermediate missing lazy import was fixed and typecheck/lint rerun. These intermediate errors are retained in dev console history and do not constitute a clean-build runtime result.

## Limits

This does not certify production RBAC/RLS, real identity/session handling, financial reconciliation against a bank, PEAK/2C2P/LINE/WooCommerce/LearnDash delivery, vulnerability/pentest, backup/restore, 50,000 records, 20 concurrent users, SLA, data residency or cross-browser compatibility. Mobile/tablet checks use viewport simulation, not physical devices. Local demo storage and audit are editable and unsuitable for real customer data.

## PEAK payment link update and GitHub Pages — 28 September 2026

- `npm test`: 30 tests passed (the original 22 plus 8 payment-link and notification checks).
- `npm run typecheck`, `npm run lint` and `npm run build:pages`: passed.
- Payment-link checks cover PEAK invoice/customer mapping, payable balance, automatic Email/SMS records, deduplication, PEAK failure recovery, retry of SMS without repeating Email, expiry and amount changes, invalid contact details, and validation of a future verified provider response.
- Browser on the Pages build: INV-2609-005 created one link and two DemoSent records. INV-2609-006 with simulated SMS failure retried SMS to attempt 2 while Email remained at attempt 1. Light and Dark views inspected.
- GitHub Actions run 36451751089 on commit c92c8a1 completed build and deploy successfully. Public URL https://naamoh23.github.io/CRMLifelab-Demo/ opened and rendered the CRM dashboard.
- Word deliverables were rendered and visually inspected, with Noto Sans Thai and 72 baseline requirement IDs preserved. They document demo coverage and remaining production work.
- The live public site is a static demo. It does not send real Email/SMS, charge cards or call the PEAK payment-link API. A verified PEAK endpoint/response and server integration remain required.
