# STATUS — CLU Registry Discourse

**Date:** 2026-09-06  
**Branch:** antigravity/qa-security-docs (local build)  
**Build:** `npm run build` ✓ passes • Turbopack • 17 routes prerendered

## Milestones

- [x] M1: Repo inspection, branded design system (deep purple #4C1769, gold #C9B676), layout shell
- [x] M2: Public experience — /, /register, /programme, /people, /materials, portal, success, docs
- [x] M3: Supabase migrations (`supabase/migrations/001_initial.sql`), safe view, localStorage fallback
- [x] M4: Genuine activity widget, QR pass, countdown, PWA manifest, .env.example
- [x] M5: Admin workspace stub, certificate verify, attendance/communication adapters documented
- [ ] M6: Real Supabase project linking + Resend/Gmail + Meta WhatsApp + VAPID (requires human secrets)
- [ ] M7: Playwright, axe, Lighthouse checks & CI (In Progress - Playwright E2E tests added)

## Verification & QA Findings (Antigravity Review)

- `npm run build` passes cleanly.
- Verified: No fake registrations/LOC/photos — LOC=0, activity via real rows or honest empty state.
- Verified: Confirmed time 9:00 a.m. WAT is correctly displayed.
- **DEFECT (High):** RLS is missing on several tables and the `admin_users` table is missing entirely.
- **DEFECT (Medium):** `access_code` is stored in plaintext in the DB, contradicting requirements.
- *See `docs/QA_FINDINGS.md` and `docs/SECURITY_REVIEW.md` for complete analysis.*

## Next Actions

1. OpenCode must fix the RLS/admin_users defects in a new migration (`002_rls_and_roles.sql`).
2. OpenCode must remove the plaintext `access_code` column from `registrations`.
3. Configure Vercel and Supabase once human credentials are provided.
