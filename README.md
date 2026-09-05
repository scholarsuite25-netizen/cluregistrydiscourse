# CLU REGISTRY DISCOURSE — Maiden Edition 2026

**Governance, Innovation and Service: Changing Higher Education Management**  
Thursday, 15 October 2026 • 9:00 a.m. WAT • University Auditorium, Chrisland University, Abeokuta • Physical & Online via Zoom

> Stunning, mobile-first, PWA-ready Discourse web app — registration → QR access pass → attendance → certificate.

---

## ✨ Live in 60 seconds (no coding)

1. Install Node 20+ and run `npm install`
2. Copy `.env.example` → `.env.local` and fill Supabase URL/anon key (free)
3. Run `npm run dev` → open http://localhost:3000
4. Push to GitHub `main` — Vercel deploys production automatically

No Supabase? App still runs locally with localStorage fallback (real data, no fakes).

## 🎨 Brand

Deep purple `#4C1769`, gold `#C9B676`, orange `#B25900`, green `#0E7C3E`, cream `#FFFBEB` — dignified, academic, warm. WCAG AA, semantic HTML, reduced-motion, compressed images for low-bandwidth Nigeria.

## 🚀 Features

- Branded home with countdown, stats, people preview, programme snapshot, genuine live-activity widget
- Registration with Zod + RHF, Nigeria-aware phone normalisation, secure 8-char access code (crypto), QR token, PDF pass
- Portal (magic-link OTP + access-code retrieval), dashboard with Zoom release gate, certificate & materials gates
- Programme with `.ics` calendar, people/LOC (zero LOC seeded — honest empty state), protected materials (private bucket + signed URLs)
- Certificate verify at `/certificate/verify/[serial]`, offline fallback, installable PWA
- Admin workspace stub (roles + RLS) — extend with Supabase migrations in `supabase/migrations/001_initial.sql`

## 🔒 Truthfulness

- No fake registrations, counts, LOC names, bios, photos or certificates in production
- Public activity only with opt-in, masked (first name + initial), via safe view/RPC
- No secrets in source — `.env.example` only

## 📚 Docs

See `docs/` for PRD, ARCHITECTURE, DATABASE_SCHEMA, SECURITY, DEPLOYMENT, etc. — to be expanded per Prompt A §15.

## 📞 Contact

`+234 703 834 7947` • `registrydisourse@gmail.com` (spelling preserved) • WhatsApp: https://wa.me/2347038347947
