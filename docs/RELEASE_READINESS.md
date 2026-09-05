# Release Readiness

**Recommendation:** NOT READY

## Evidence
While the primary UI routes are constructed and follow the brand and content constraints (e.g., proper event times, no fake data), the application is currently **not ready for production release** due to significant gaps in security and requirements.

### Blockers for Release:
1. **Missing RLS and Admin Roles:** Row Level Security is currently unenforced on most tables. The required `admin_users` table does not exist, and there is no secure authorization enforcement for administrative actions.
2. **Access Code Vulnerability:** The generated access codes are stored in plaintext in the `registrations` table alongside their hashes.
3. **Incomplete Back-End Schema:** Several critical tables (e.g., `attendance_records`, `push_subscriptions`, `materials` policies) are missing.
4. **Missing Tests:** There are no automated tests (Playwright E2E, Unit, RLS).

## Shortest Next Actions
1. OpenCode must implement `002_rls_and_roles.sql` to explicitly secure all tables and create the `admin_users` schema.
2. OpenCode must remove the plaintext `access_code` column from `registrations`.
3. Antigravity will finalize the Playwright E2E test suite to verify the registration and check-in flows.
4. Setup CI/CD checks for tests before PRs can be merged.
