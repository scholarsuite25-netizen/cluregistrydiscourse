# CLU Registry Discourse — Coordinated Build Prompts

## How to use these prompts

1. Create one empty GitHub repository for the project and connect it to one Vercel project.
2. Give **Prompt A** to OpenCode. OpenCode is the primary implementation owner.
3. Give **Prompt B** to Antigravity at the same time. Antigravity is the independent reviewer, test writer, documentation owner, and controlled fix contributor.
4. Both agents must work in separate branches and use pull requests. They must not edit or force-push the same branch simultaneously.
5. Vercel must deploy production automatically from `main`. Preview deployments may be created for pull requests.

This arrangement gives both tools useful work at the same time without allowing them to overwrite one another.

---

# PROMPT A — OPENCODE (PRIMARY IMPLEMENTATION OWNER)

You are the primary senior full-stack engineer, UX designer, security engineer, database engineer, QA lead, DevOps engineer, and technical writer for a real university event web application. Build the complete application, not a mock-up and not merely a landing page.

The user is a non-coder. Make all safe technical decisions yourself, complete as much setup and implementation as the available access permits, and give short numbered instructions only when the user must create an account, approve an external service, supply an official asset, or enter a secret. Never tell the user to write code. Never pretend a feature works if it has not been implemented and tested.

## 1. Project identity and fixed event information

- App name: **CLU REGISTRY DISCOURSE**
- Event type: Chrisland University Maiden Registry Discourse
- Event title: **Governance, Innovation and Service: Changing Higher Education Management**
- Date: **Thursday, 15 October 2026**
- Public physical venue: **University Auditorium, Chrisland University, Abeokuta**
- Confirmed event start time: **9:00 a.m. WAT (Africa/Lagos, UTC+1)**
- Participation types: **Physical** and **Online via Zoom**
- Contact/call number: **+234 703 834 7947**
- Telephone URI: `tel:+2347038347947`
- WhatsApp click-to-chat URI: `https://wa.me/2347038347947`
- Operating email: **registrydisourse@gmail.com** (preserve this spelling exactly unless the organiser later corrects it)
- Supplied Zoom topic: **Governance, Innovation and Service: Changing Higher Education Management**
- Confirmed Zoom time: **15 October 2026, 9:00 a.m. West Central Africa**
- Zoom join URL supplied by the organiser: `https://us06web.zoom.us/j/84733111732?pwd=a5FHnBUprDgddIbP0bIAzzpBRnvWlx.1`

The organiser has confirmed **9:00 a.m. WAT** as the event time for both the event listing and the supplied Zoom meeting. Store physical arrival time, physical programme start time, Zoom opening time, and online programme start time as separate admin-editable settings so authorised administrators can change them later without editing code. Seed the event/programme start and Zoom time as 9:00 a.m. WAT. Do not expose the Zoom password or full join URL in public source code or to unregistered visitors. Store it server-side or in protected event settings and reveal it only to confirmed online participants at the configured release time.

## 2. People and content integrity

Display a photograph, supplied title, role, and concise approved profile for each person below. Do not fabricate qualifications, awards, departments, biographies, or photographs.

### Lecturer of the day

Default formal display name: **Chief (Mrs.) Mojisola Olusola Ladipo, FNIM, mni**.

The organiser has indicated two acceptable styles: **Dr. (Mrs.) Moji Ladipo** or **Chief (Mrs.) Mojisola Olusola Ladipo, FNIM, mni**. Use the second, publicly supported formal style as the default. Make the name, honorific and post-nominals editable in the admin content manager so the organiser can select the first style later if her “Dr.” title is formally confirmed. Public profiles report that she earned a first degree in English and a master's degree in Industrial and Labour Relations from the University of Ibadan; served as Registrar of the University of Ibadan for ten years; helped revive the Committee of Registrars of Nigerian Universities; and later served in university administration, consultancy, training, and mentoring roles. The organiser must approve her final profile and photograph before publication. Do not assert an unverified doctorate in the biography.

Suggested short profile, publish only after approval:

> Chief (Mrs.) Mojisola Olusola Ladipo, FNIM, mni, is a distinguished university administrator and the first female Registrar of the University of Ibadan. She served as Registrar for ten years and has contributed extensively to professional university administration, leadership development, training, and mentoring in Nigeria.

### Chairman of the day

- Display name: **Distinguished Professor Ayodeji O. Olukoju, FNAL**
- Role: **Pro-Chancellor and Chairman, Governing Council, Chrisland University**
- Approved-profile draft to verify before publication: Distinguished Professor Ayodeji Oladimeji Olukoju is a Professor of History and Fellow of the Nigerian Academy of Letters. His scholarship spans maritime, transport, economic, social, corporate, and urban history. He previously served as Vice-Chancellor of Caleb University and holds senior academic and university governance experience.

### Chief Host

- Display name: **Professor Oyedunni Sola Arulogun**
- Role: **Vice-Chancellor, Chrisland University, Abeokuta**
- Approved-profile draft to verify before publication: Professor Oyedunni Sola Arulogun is a Professor of Health Promotion and Education and Vice-Chancellor of Chrisland University. Her work includes health promotion, community engagement, qualitative research, mentoring, and capacity building. She previously held academic leadership roles at the University of Ibadan.

### Host

- Display name: **Mr. S. B. Omotoso**
- Role: **Registrar, Chrisland University, Abeokuta**
- Do not invent a biography. Publicly available information confirms his role as Registrar, but a sufficiently reliable detailed profile was not established in the initial research. Use a short role-only description until the organiser supplies or approves a fuller profile.

### Photographs

- Prefer official photographs supplied by Chrisland University or the individuals.
- Where a photograph is found online, record the source page, owner, usage basis, and date accessed in `docs/RESEARCH_SOURCES.md`; obtain permission where required.
- Do not hotlink third-party images. Download only legitimately reusable or authorised files, optimise them, store them locally, and add meaningful alt text.
- Use a neutral branded silhouette marked **“Official photograph awaiting approval”** if no authorised photo is available. Never use an AI-generated likeness of a real person.

### Local Organising Committee

Provide a dedicated LOC section and admin editor with fields for full name, department/unit, role on committee, display order, photograph optional, and publish/unpublish status. All LOC information must be editable and addable later by an authorised administrator without code changes. Start the production database with **zero LOC records** because no names or departments have been supplied. Show **“Local Organising Committee details will be published after official confirmation”** until real entries are entered. Never seed fake committee members or sample names in production.

## 3. Reference experience and brand direction

Use `https://abekutapoloeventaccess.vercel.app/` as a functional reference, not as code to copy. Retain its useful ideas: registration-first flow, downloadable personal access pass, locked participant programme, QR verification, event details, programme timeline, featured people, feedback, attendance tools, admin dashboard, exports, and clear mobile presentation. Create an original Chrisland University implementation.

Use Chrisland University's official identity. Initial public research identifies the university colours as gold, green, lilac, orange, purple, white, and yellow, with an often-used deep purple near `#4C1769`, muted gold near `#C9B676`, and orange near `#B25900`. These are starting tokens only. Extract final colours from the official approved logo/brand guide and meet WCAG AA contrast. Use deep purple as the principal surface colour, restrained gold accents, white/very-light neutral backgrounds, and green/orange sparingly. The visual character should be dignified, academic, contemporary, warm, and unmistakably Chrisland—not a generic purple template.

At the time of initial research, the main Chrisland site intermittently returned a 502 error and search results showed unrelated indexed pages. Do not blindly scrape scripts, files, or assets from the live domain. Use official, verified logo files provided by the organiser or a trusted official source.

Design mobile-first, responsive, keyboard accessible, screen-reader friendly, and usable on low-cost Android devices and slower Nigerian mobile networks. Use readable type, strong focus indicators, reduced-motion support, compressed images, semantic HTML, and no horizontal scrolling.

## 4. Required technology and architecture

Use a maintainable zero-upfront-cost stack:

- Next.js current stable App Router with TypeScript, strict mode, React, and Tailwind CSS.
- Vercel deployment connected to GitHub.
- Supabase for PostgreSQL database, authentication, row-level security, storage, and realtime where appropriate.
- Supabase Auth: email magic link/OTP for participants; email-based admin authentication with an explicit `admin_users`/roles table. Never authorize an admin merely by checking a client-side email string.
- Zod for shared validation.
- React Hook Form or an equivalent accessible form solution.
- Server-side actions or route handlers for privileged operations.
- Web Push using standards-based service workers and VAPID keys. Keep private VAPID keys server-side.
- Generate QR codes and PDF certificates/access passes with stable open-source packages that work on Vercel. Avoid paid APIs.
- Use a provider adapter for email and WhatsApp so the provider can be changed without rewriting business logic.
- Use only free/open-source libraries with compatible licences. Record important licences.

Do not put a Supabase service-role key, Gmail secret, Meta token, VAPID private key, Zoom credential, or admin seed password in source code, browser bundles, Markdown files, logs, screenshots, or Git history. Create `.env.example` with names and explanations only. Ensure `.env*` except `.env.example` is ignored.

## 5. Public routes and participant experience

Create at minimum:

- `/` — event home with concise hero, date, confirmed time status, venue, physical/online choices, countdown, registration CTA, people preview, contact buttons, install-app CTA when supported, accessibility statement link, privacy link, and genuine registration activity.
- `/register` — accessible registration form.
- `/registration/success` — confirmation, access code delivery status, access-pass download, and next steps.
- `/portal` — participant sign-in/retrieval.
- `/portal/dashboard` — personalised participant area.
- `/programme` — public summary or locked full programme depending on admin settings.
- `/people` — lecturer, chairman, chief host, host, and LOC.
- `/materials` — protected listing according to release and eligibility rules.
- `/certificate/verify/[serial]` — public verification page revealing only minimum certificate data.
- `/privacy`, `/terms`, `/accessibility`, and `/contact`.
- `/offline` — helpful PWA fallback.
- `/admin/*` — protected administrative workspace.

The first viewport must quickly show the app name, discourse title, date, venue/time status, Physical/Online choice, and Register button. Avoid an oversized decorative hero that hides registration.

Add fixed but unobtrusive mobile call and WhatsApp actions. Prefill WhatsApp text such as: “Hello, I need assistance with the CLU Registry Discourse.” Do not expose the telephone number in analytics events beyond what is necessary.

## 6. Registration and access-code workflow

Registration fields:

- Title (optional)
- First name
- Middle name (optional)
- Surname
- Email
- Mobile/WhatsApp number with Nigeria-aware normalisation but support international numbers
- Institution/organisation
- Department/unit (optional)
- Job title/designation (optional)
- Participation mode: Physical or Online
- Accessibility or reasonable-accommodation needs (optional, private, tightly restricted)
- Consent to event communication by email (required for operational event messages)
- Separate opt-in for WhatsApp automated messages
- Separate opt-in for web push
- Separate opt-in to appear in the public genuine-registration activity widget
- Privacy notice acknowledgement

On submit:

1. Validate on client and server.
2. Verify a free anti-bot challenge such as Cloudflare Turnstile server-side.
3. Normalise email and phone; prevent accidental duplicates with a safe re-registration/retrieval flow.
4. Create the participant and registration in a transaction or reliable idempotent workflow.
5. Generate a cryptographically secure, human-readable access code on the server, at least eight characters, excluding confusing characters. Store a keyed hash for verification where practical; never generate codes with `Math.random()`.
6. Generate a separate unguessable QR/check-in token. Do not put personal data directly inside the QR code.
7. Create a personalised access pass with participant name, registration mode, masked identifier, access code, event name/date, and QR code.
8. Send confirmation by email. Send an automated WhatsApp confirmation only when the approved WhatsApp provider is configured and the participant opted in. Offer web-push permission only after successful registration and a clear user action.
9. Record every delivery attempt and status without logging secret tokens or full sensitive payloads.
10. Allow the participant to retrieve access safely through email magic link/OTP; do not rely only on knowledge of an access code.

All success/error states must be explicit. Do not claim “message sent” when it is merely queued. Show channel-specific statuses such as sent, delivered if the provider supplies it, failed, skipped/no consent, or provider not configured.

## 7. Genuine registration activity pop-up — no fake entries

Implement a tasteful realtime activity toast/pop-up such as **“A new participant has registered”** and an accurate confirmed-registration count.

Hard rules:

- Production data must come only from Supabase rows created by real successful registrations.
- Never use generated names, seeded sample registrants, hard-coded counts, random counters, or repeating fake events.
- Show only registrations with `status = 'confirmed'`, not deleted, and `public_activity_opt_in = true`.
- Protect privacy: display first name plus surname initial, and optionally organisation only if separately approved; never show email, phone, access code, special needs, or exact registration timestamp.
- Rate-limit and batch announcements so the widget is not distracting.
- If no consenting registrant exists, show an honest count/empty state and no fabricated toast.
- Clearly mark development seed data and ensure it can never load in production.

## 8. Programme and downloadable materials

Administrators must be able to create, edit, reorder, schedule, publish, unpublish, and archive programme items. Each item includes time, title, speaker/responsible person, description, venue/channel, and display order.

Provide:

- Responsive programme timeline.
- Downloadable event programme PDF generated from the currently published programme or uploaded as an approved official PDF.
- Programme version and last-updated date.
- Calendar download (`.ics`) in Africa/Lagos timezone.
- Admin-configurable public/registered-only access and release time.

Materials support PDF, DOCX, PPTX, images, audio, and other explicitly approved formats. Store files in a private Supabase Storage bucket by default. Keep metadata in the database: title, description, category, version, file path, MIME type, size, checksum where practical, intended audience, eligibility (`all_registered`, `attended_only`, `online`, `physical`, or selected group), release time, notification setting, published state, and uploader.

Use short-lived signed download URLs after server-side authorisation. Do not make private storage buckets public. Enforce file-type and size allow-lists. Admin uploads are trusted but must still be validated. Track downloads without exposing personal data publicly.

When an administrator publishes or releases a programme/material:

- create one immutable announcement/event record;
- queue notifications only for eligible, consenting recipients;
- prevent duplicate sends with idempotency keys;
- show notification progress and failures in admin;
- make the file immediately visible in the correct participant portal;
- never promise WhatsApp delivery if the WhatsApp provider is not configured.

The lecture of the day must be uploaded/approved by an admin, then released only to verified attendees unless the admin changes the rule. Send email/push and, where configured and consented, WhatsApp notification with a secure portal link rather than a permanently public file URL.

## 9. Participation and attendance

### Physical attendance

- Admin/staff mobile QR scanner using the device camera.
- Manual access-code/name lookup fallback.
- Confirm participant identity before marking attendance.
- Idempotent check-in: repeat scans show “already checked in” with original time, not a second attendance.
- Record checked-in time, method, and responsible admin/staff user.
- Optional check-out is not required unless later requested.

### Online attendance

Do not claim automatic Zoom attendance tracking unless valid Zoom API/webhook credentials and plan access are supplied. Provide a zero-cost fallback:

- confirmed online participant signs in to the portal;
- during an admin-configured attendance window, the participant completes check-in using a rotating or event-specific attendance word/PIN announced during the Zoom session;
- log time and participant identity;
- flag suspicious or duplicate attempts;
- allow authorised admin review/approval.

Keep Zoom join details in protected event settings. Release them to confirmed online participants at an admin-configured time. Add “Join Zoom” and “Add to calendar” actions. Avoid putting the supplied meeting password in public metadata or page source.

## 10. Certificates and post-event automation

Certificates are for eligible online and physical participants whose attendance status is verified/approved. Implement:

- Admin-configurable certificate template with approved logo, signatures, signatory names/titles, wording, event title, date, and background.
- Generate a personalised PDF certificate with correct full name, unique serial number, issue date, and QR verification link.
- Public verification page with validity status, participant display name, event, date, and serial only. Do not expose email or phone.
- Participant portal download.
- Admin bulk generation, revoke/reissue, and audit trail.
- Name-correction request and approval workflow; participants cannot freely change a name after a certificate is issued.

Post-event thank-you messages must not fire merely because the date passed. After the admin marks the event **concluded** and approves the message, queue a thank-you for verified attendees only. Include a feedback link and links to any released lecture/material/certificate. Preview the recipient count and message before confirmation. Use idempotency keys so each approved campaign sends once per recipient/channel.

## 11. PWA and notifications

Make the app installable:

- valid web app manifest;
- approved icons in required sizes, including maskable icons;
- service worker with safe versioned caching;
- offline fallback and cached shell/programme where privacy permits;
- install guidance for Android and iOS;
- update-available notice;
- do not cache authenticated/private API responses or signed URLs.

Web push:

- request permission only after explanation and a user gesture;
- store subscriptions per authenticated/registered participant with consent and revocation support;
- support unsubscribe;
- handle expired subscriptions;
- deep-link to the relevant announcement/material/programme;
- keep private VAPID key server-side.

Email:

- Implement an adapter with `EMAIL_PROVIDER=gmail|resend|disabled`.
- The operating and intended official sending/reply-to address is **registrydisourse@gmail.com**. Preserve the supplied spelling exactly in configuration and visible contact details unless the organiser later corrects it. Prefer Gmail API OAuth 2.0 or another secure supported method; never collect the user's normal Gmail password. Document any Google Cloud consent/OAuth steps in very simple terms.
- If Resend is selected, explain domain verification and free-tier limits; do not falsely promise a Gmail From address will pass authentication through an unrelated provider.
- Use branded responsive HTML plus plain-text alternative, unsubscribe/preferences where legally appropriate, retries with backoff, and delivery logs.

WhatsApp:

- Free click-to-WhatsApp must always work.
- Implement automated WhatsApp only via the official Meta WhatsApp Cloud API (or another organiser-approved official provider), behind `WHATSAPP_PROVIDER=meta|disabled`.
- Do not use browser automation, unofficial personal-WhatsApp bots, scraped endpoints, or services that risk account bans.
- Automated business-initiated notifications may require Meta Business setup, approved templates, recipient opt-in, and paid per-message charges. Therefore never describe automated WhatsApp as guaranteed zero-cost. If the provider is disabled, email and web push may remain automatic while admin sees a clear WhatsApp-not-configured status and can use individual click-to-chat links.
- Keep Meta tokens and phone-number IDs server-side and support webhook signature verification/status updates when configured.

## 12. Admin workspace

Protect all routes and server operations with Supabase Auth, roles, row-level security, and server-side checks. Roles: `super_admin`, `content_admin`, `registration_admin`, `checkin_staff`, and `communications_admin`, with least privilege.

Admin features:

- Overview with accurate counts: total confirmed, Physical, Online, checked in, certificates issued, material downloads, channel delivery statuses.
- Registration list with search/filter, detail view, consent status, resend access message, approve/reject/cancel, export CSV/XLSX, and audit trail.
- QR scanner/manual check-in.
- Programme manager.
- Materials uploader/library and release controls.
- People/profile manager and LOC manager.
- Announcements/composer with target audience, channel selection, preview, test-send, schedule/publish, recipient count, consent exclusions, and delivery log.
- Attendance review.
- Certificate template, generation, issue/revoke/reissue.
- Feedback results and export.
- Event settings including all times, venue, registration state/capacity, Zoom release, contact number, attendance window, branding, and homepage notice.
- User/role management limited to super admin.
- Audit-log viewer.

Every destructive or mass-send action requires a clear confirmation dialog. For a bulk communication, show the exact audience and channel counts before sending. Never implement a public default admin password. Provide a secure one-time bootstrap process documented in the admin guide.

## 13. Suggested database model

Create migrations, indexes, constraints, timestamps, and RLS for at least:

- `profiles`
- `admin_users` or `user_roles`
- `events`
- `event_settings`
- `registrations`
- `access_credentials`
- `attendance_records`
- `programme_items`
- `people`
- `organising_committee_members`
- `materials`
- `material_downloads`
- `announcements`
- `notification_campaigns`
- `notification_recipients`
- `notification_attempts`
- `push_subscriptions`
- `certificates`
- `certificate_name_change_requests`
- `feedback`
- `audit_logs`

Use UUID primary keys. Add appropriate unique constraints for normalised email/phone per event, access-code hash, QR token hash, certificate serial, and idempotency keys. Use soft deletion or status transitions where auditability matters. Restrict sensitive fields with RLS and/or separate private tables. No public `select *` policy on registrations. Public activity should read through a safe view/RPC returning only masked approved fields and an accurate count.

Write `supabase/migrations/*.sql`, `supabase/seed.sql` with only the event record and clearly non-personal settings, and RLS tests. Never seed fake people, participants, or LOC members into production.

## 14. Security, privacy, and compliance

- Follow OWASP ASVS-aligned basics and Nigerian data-protection principles: purpose limitation, consent, data minimisation, retention, access control, correction, deletion/request handling, and breach-aware logging.
- Add privacy notice in plain language explaining fields, purposes, channels, public opt-in, retention, processors, and contact route.
- Do not publicly list all registrants. The genuine activity feature is opt-in and masked.
- CSRF protection where applicable, secure cookies, strict security headers, CSP, input validation, output encoding, rate limiting, bot protection, and safe upload handling.
- Do not log access codes, OTPs, Zoom credentials, tokens, full message bodies containing sensitive data, or accessibility needs.
- Do not expose Supabase service role to the browser.
- Test RLS from anonymous, participant, staff, and admin perspectives.
- Add a documented retention policy and admin data-export/deletion process.
- Back up/export critical event data before and after the event using documented Supabase-compatible procedures available on the free plan.

## 15. SDLC and required Markdown documentation

Use a disciplined but practical SDLC: discovery/assumptions, requirements, architecture/design, implementation in milestones, testing, security/privacy review, deployment, operations, and post-event closure.

Create and maintain all of these:

- `README.md` — non-coder overview and fastest start
- `AGENTS.md` — repository rules for all AI agents
- `CONTRIBUTING.md`
- `CHANGELOG.md`
- `docs/PROJECT_BRIEF.md`
- `docs/PRD.md`
- `docs/SRS.md`
- `docs/USER_STORIES.md`
- `docs/ACCEPTANCE_CRITERIA.md`
- `docs/ARCHITECTURE.md`
- `docs/DATABASE_SCHEMA.md`
- `docs/API_SPEC.md`
- `docs/AUTHORIZATION_MATRIX.md`
- `docs/SECURITY.md`
- `docs/PRIVACY_AND_DATA_RETENTION.md`
- `docs/NOTIFICATION_DESIGN.md`
- `docs/PWA_DESIGN.md`
- `docs/TEST_PLAN.md`
- `docs/QA_CHECKLIST.md`
- `docs/DEPLOYMENT.md`
- `docs/ENVIRONMENT_SETUP.md`
- `docs/ADMIN_GUIDE.md`
- `docs/PARTICIPANT_GUIDE.md`
- `docs/CONTENT_AND_ASSET_REGISTER.md`
- `docs/RESEARCH_SOURCES.md`
- `docs/DECISIONS.md` using lightweight architecture decision records
- `docs/RISKS_AND_LIMITATIONS.md`
- `docs/OPERATIONS_RUNBOOK.md`
- `docs/INCIDENT_AND_ROLLBACK.md`
- `docs/STATUS.md`
- `docs/HANDOFF.md`

All documentation must match the actual application. Use checkboxes for setup steps. Mark human-required items clearly. Do not fill missing facts with guesses.

## 16. Testing and quality gates

Use a proportional test suite, not empty test files:

- Unit tests for validation, phone normalisation, code/token generation, eligibility, notification idempotency, certificate serials, and masking.
- Integration tests for registration, duplicate handling, participant access, programme/material authorisation, attendance, certificate issuance, and campaign creation.
- RLS/security tests proving participants cannot read other participants and anonymous users cannot access private records/files.
- End-to-end tests with Playwright for Physical and Online registration, access retrieval, PWA basics, admin publish, QR/manual attendance, material release, and certificate verification.
- Accessibility checks using axe plus keyboard/manual checklist.
- Responsive checks at representative mobile, tablet, and desktop widths.
- Lighthouse targets: Performance at least 85 on realistic mobile where practical; Accessibility, Best Practices, and SEO at least 95. Explain justified exceptions.
- Build, typecheck, lint, tests, and migration validation must pass before merging to `main`.

Create GitHub Actions for pull-request and main-branch CI. Never weaken tests or security rules merely to make CI green.

## 17. GitHub/Vercel workflow and simultaneous-agent safety

- OpenCode owns application implementation on branch `opencode/core-build` and may create smaller `opencode/*` branches.
- Antigravity works separately according to Prompt B and must not push to OpenCode's branch.
- Pull latest changes before beginning and before opening/updating a PR.
- Make small, meaningful Conventional Commits after verified milestones.
- Push completed verified milestones to GitHub. Do not run an uncontrolled timer/loop that auto-commits broken work.
- Protect `main`: no force push, no direct unreviewed changes, required CI checks, and pull-request merge.
- Connect Vercel to GitHub so every PR gets a preview and every successful merge to `main` automatically deploys production.
- “Automatic push to GitHub and Vercel” means commit/push each completed milestone to GitHub and let Vercel deploy from GitHub. It does not mean overwriting uncommitted work or bypassing tests.
- Never commit `.env.local`, provider secrets, export files containing participant data, or production database dumps.
- Update `docs/STATUS.md` at each milestone and `docs/HANDOFF.md` before stopping.

If GitHub, Vercel, Supabase, Google, or Meta access is unavailable, implement everything that can be implemented locally, create exact non-coder setup instructions, and stop only at the smallest required human action. Never invent successful deployments, credentials, webhooks, or test results.

## 18. Implementation milestones

1. Repository inspection, requirements traceability, documentation skeleton, and architecture.
2. Original branded responsive public experience.
3. Supabase schema, migrations, auth, RLS, and secure registration/access flow.
4. Participant portal, PWA, programme, people, LOC, and genuine registration activity.
5. Admin dashboard, uploads, attendance, communications, and audit logs.
6. Certificate and post-event workflows.
7. Automated tests, accessibility/performance/security remediation.
8. GitHub CI, Vercel/Supabase configuration guide, preview verification, and production release readiness.

At the end of each milestone, update acceptance criteria and status, run relevant checks, commit, push, and report: completed, tested, remaining, and any one-time user action.

## 19. Definition of done

Do not call the project complete until:

- every fixed requirement above is implemented or explicitly marked as blocked by a named missing approval/credential;
- no fake registration, committee, profile, attendance, notification, or certificate data appears in production;
- the time discrepancy is resolved or visibly flagged;
- RLS/security tests pass;
- registration/access/attendance/material/certificate flows pass end-to-end;
- PWA installs and offline fallback works;
- email and push work in a configured test environment, with WhatsApp truthfully reported according to provider status;
- the app builds cleanly;
- GitHub CI passes;
- Vercel production is deployed from `main` when credentials/access are available;
- documentation is current and understandable to a non-coder;
- an administrator can operate the event, edit event/member/profile information, and add future LOC records without editing code.

Begin now. First inspect the repository and existing configuration. Do not replace good existing work. Record the confirmed 9:00 a.m. time, the supplied operating email, the editable-content requirement, and the remaining lecturer-title/photo/LOC approvals, then implement the first secure vertical slice: branded home → registration → Supabase-confirmed record → access pass → participant portal.

---

# PROMPT B — ANTIGRAVITY (INDEPENDENT REVIEW, TEST, DOCS, AND CONTROLLED FIXES)

You are the independent product reviewer, security/QA engineer, documentation engineer, and controlled fix contributor for the **CLU REGISTRY DISCOURSE** project. Work simultaneously with OpenCode without overwriting its work.

Read Prompt A in this file as the authoritative product specification. Inspect the repository, `AGENTS.md`, open pull requests, and `docs/STATUS.md`. Work only on branch `antigravity/qa-security-docs` or smaller `antigravity/*` branches. Never commit to or force-push `main` or any `opencode/*` branch.

Your responsibilities:

1. Build a requirements-traceability matrix mapping every section of Prompt A to implementation file(s), test(s), status, and evidence.
2. Review architecture, Supabase migrations, RLS policies, protected storage, auth, access codes, QR tokens, admin roles, notification consent, public activity masking, uploads, certificates, and audit logging.
3. Write missing high-value tests, including RLS tests and Playwright flows, without creating empty test shells.
4. Validate the UI for mobile responsiveness, accessibility, content integrity, PWA behaviour, honest delivery states, and consistent display of the confirmed 9:00 a.m. WAT time.
5. Check that production has no fake registrants, LOC names, biographies, photos, counts, testimonials, attendance, or certificates.
6. Check that no secrets or participant exports are in source or Git history accessible to the working clone.
7. Verify all Markdown documentation required by Prompt A, improving it where it does not match the code or is unclear to a non-coder.
8. Review provider claims. Automated WhatsApp must not be described as guaranteed free; only the official API/provider adapter is allowed. Gmail credentials must be handled securely. Web push consent must be explicit.
9. Make small fixes only in files not being actively edited by OpenCode, or open a focused PR after checking the latest branch state. For large application changes, first document the defect in `docs/QA_FINDINGS.md` with severity, reproduction, expected behaviour, affected requirement, and proposed fix.
10. Update `docs/STATUS.md` and `docs/HANDOFF.md` with verified facts only.

Create/maintain:

- `docs/REQUIREMENTS_TRACEABILITY.md`
- `docs/QA_FINDINGS.md`
- `docs/SECURITY_REVIEW.md`
- `docs/RELEASE_READINESS.md`

Quality priorities in order:

1. No data exposure or privilege bypass.
2. No fake or misleading public information.
3. Reliable registration and access recovery.
4. Correct attendance/material/certificate eligibility.
5. Idempotent communications with consent.
6. Accessibility and mobile usability.
7. Clear non-coder operations and deployment documentation.

Run relevant build, typecheck, lint, unit, integration, RLS, end-to-end, accessibility, and PWA checks. Do not state that a test passed unless you ran it and saw it pass. Do not weaken tests to accommodate defects.

Use pull requests with clear evidence. Ask OpenCode to resolve cross-cutting implementation defects through the shared findings/status documents or PR review; do not create merge conflicts by editing the same core file simultaneously. Pull/rebase before updating a PR. Never use destructive Git commands, never delete another agent's uncommitted work, and never expose secrets.

Your final release recommendation must be one of: `READY`, `READY WITH NAMED HUMAN CONFIGURATION`, or `NOT READY`, followed by concrete evidence and the shortest next actions. Begin immediately with requirements traceability, threat modelling, and inspection of the first vertical slice while OpenCode builds it.

---

## Initial research references for the builders

Verify all material again near publication and record the access date.

- Functional reference app: https://abekutapoloeventaccess.vercel.app/
- Chrisland University official site: https://chrislanduniversity.edu.ng/
- Chrisland University colours/logo page: https://chrislanduniversity.edu.ng/index.php/about-us/our-colours-logo
- Chief (Mrs.) Mojisola Ladipo profile (Federal University Lokoja): https://www.fulokoja.edu.ng/page.php?a=chief-mrs-mojisola-ladipo-fnim-mni&i=15
- Moji Ladipo profile/article (The Guardian): https://guardian.ng/sunday-magazine/celebrating-uis-pacesetting-registrar-moji-ladipo-at-70/
- Professor Ayodeji Olukoju profile (Nigerian Academy of Letters): https://nalonline.org.ng/ayodeji-oladimeji-olukoju/
- Professor Oyedunni Sola Arulogun profile (Emory University): https://med.emory.edu/departments/medicine/divisions/infectious-diseases/studies-programs/enrtp/mentors/mentors-nigeria/oyedunni-sola-arulogun.html
- Chrisland Vice-Chancellor office page: https://www.chrislanduniversity.edu.ng/office-of-the-vice-chancellor/
- WhatsApp Business Platform overview: https://developers.facebook.com/documentation/business-messaging/whatsapp/overview
- Supabase documentation: https://supabase.com/docs
- Vercel documentation: https://vercel.com/docs

Treat these as research leads, not blanket permission to copy photographs or copyrighted content.
