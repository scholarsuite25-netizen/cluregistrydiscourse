# Requirements Traceability Matrix

This document maps the requirements defined in Prompt A to their implementation status, files, tests, and evidence.

| Req # | Requirement Description | Implementation Files | Test Files | Status | Evidence/Notes |
|-------|-------------------------|----------------------|------------|--------|----------------|
| 1 | Project identity and fixed event information (Date, Venue, Zoom info, 9:00 a.m. WAT) | `src/lib/constants.ts`, `src/app/page.tsx`, `src/components/home/Countdown.tsx` | (To be written) | Partially Implemented | Found constants and countdown. Needs full verification against all public routes. |
| 2 | People and content integrity (Lecturer, Chairman, Host, Chief Host, LOC) | `src/app/people/page.tsx` | (To be written) | Stubbed | Need to verify no fake data/photos are seeded. |
| 3 | Reference experience and brand direction (Zero-cost stack, Deep purple & Gold colors) | `src/app/globals.css`, `tailwind.config.ts` | N/A | In Progress | Need to verify color codes (#4C1769, #C9B676) and accessibility. |
| 4 | Required technology and architecture (Next.js, Supabase, Tailwind, PWA) | `package.json`, `supabase/migrations/001_initial.sql` | N/A | In Progress | Basic setup is present. Supabase migrations need review. |
| 5 | Public routes and participant experience | `src/app/page.tsx`, `src/app/register/page.tsx`, etc. | (To be written) | In Progress | Need to ensure all requested routes exist and function as expected. |
| 6 | Registration and access-code workflow | `src/app/register/page.tsx`, API routes | (To be written) | Not Verified | Requires E2E test and manual verification of idempotency/security. |
| 7 | Genuine registration activity pop-up | `src/components/home/ActivityWidget.tsx` | (To be written) | Implemented | Need to check real vs mock data. |
| 8 | Programme and downloadable materials | `src/app/programme/page.tsx`, `src/app/materials/page.tsx` | (To be written) | Stubbed | |
| 9 | Participation and attendance (QR scanner, check-in, online attendance) | Not yet located | (To be written) | Not Implemented | |
| 10 | Certificates and post-event automation | `src/app/certificate/verify/[serial]/page.tsx` | (To be written) | Stubbed | |
| 11 | PWA and notifications (Manifest, SW, Web Push) | `public/manifest.json` | N/A | Partially Implemented | Manifest exists, need to verify offline support and Service Worker. |
| 12 | Admin workspace | `src/app/admin/page.tsx` | (To be written) | Stubbed | Security rules (RLS) and auth need strict review. |
| 13 | Database model and migrations | `supabase/migrations/001_initial.sql` | RLS Tests (To be written) | In Progress | Needs a thorough review of roles and RLS policies. |
| 14 | Security, privacy, and compliance | `src/app/privacy/page.tsx` | (To be written) | In Progress | Will conduct threat model and privacy review in `SECURITY_REVIEW.md`. |
| 15 | SDLC and required Markdown documentation | `docs/*` | N/A | In Progress | Currently only `STATUS.md` exists. Others are missing. |
| 16 | Testing and quality gates (Lighthouse, Axe, E2E, Unit) | `tests/*` (None found yet) | N/A | Not Implemented | Must write Playwright, RLS, and unit tests. |

*This matrix will be continuously updated throughout the QA and testing process.*
