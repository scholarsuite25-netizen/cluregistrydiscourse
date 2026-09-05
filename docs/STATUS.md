# STATUS — CLU Registry Discourse

**Date:** 2026-09-06  
**Branch:** main (local build)  
**Build:** `npm run build` ✓ passes • Turbopack • 17 routes prerendered

## Milestones

- [x] M1: Repo inspection, branded design system (deep purple #4C1769, gold #C9B676), layout shell
- [x] M2: Public experience — /, /register, /programme, /people, /materials, portal, success, docs
- [x] M3: Supabase migrations (`supabase/migrations/001_initial.sql`), RLS, safe view, localStorage fallback so app works with zero config
- [x] M4: Genuine activity widget, QR pass, countdown, PWA manifest, .env.example
- [x] M5: Admin workspace stub, certificate verify, attendance/communication adapters documented
- [ ] M6: Real Supabase project linking + Resend/Gmail + Meta WhatsApp + VAPID (requires human secrets)
- [ ] M7: Playwright, axe, Lighthouse checks & CI

## Verification

- `npm run build` — no TS errors, all 17 routes static.
- `npm run dev` — http://localhost:3000 ready in 2.0s
- No fake registrations/LOC/photos — LOC=0, activity via real rows or honest empty state.

## Next human actions (one-time)

1. Create Supabase project → paste URL/anon key into `.env.local` → run migration.
2. Create Vercel project → connect GitHub → add env vars → deploy `main`.
3. Configure email provider (Gmail OAuth or Resend) and WhatsApp Meta if needed.
