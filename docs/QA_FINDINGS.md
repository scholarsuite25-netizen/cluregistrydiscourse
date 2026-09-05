# QA and Security Findings

This document tracks identified defects, security vulnerabilities, and gaps against Prompt A requirements.

## 1. Missing Database RLS (High Severity)
- **Description:** Only the `registrations` table has RLS enabled. `event_settings` (which holds the protected Zoom link) and `audit_logs` lack RLS, potentially allowing anonymous users to access sensitive data if queried directly via the Supabase Data API.
- **Affected Requirement:** "Security, privacy, and compliance" (Prompt A, Section 14)
- **Proposed Fix:** Create migration `002_rls_and_roles.sql` to explicitly enable RLS on all tables, and deny anonymous access strictly, allowing it only where required (e.g. `public_activity_view` or specific materials).

## 2. Admin Roles / Auth (High Severity)
- **Description:** No explicit `admin_users` or `user_roles` table exists in the initial migration. Prompt A strictly requires: "explicit admin_users/roles table. Never authorize an admin merely by checking a client-side email string."
- **Affected Requirement:** "Admin workspace" (Prompt A, Section 12)
- **Proposed Fix:** Create `admin_users` table in `002_rls_and_roles.sql` and integrate it into a secure RLS checking mechanism.

## 3. Plaintext Access Code Storage (Medium Severity)
- **Description:** The `registrations` table schema stores both `access_code` and `access_code_hash`. Storing a generated credential in plaintext contradicts the instruction to "Store a keyed hash for verification where practical".
- **Affected Requirement:** "Registration and access-code workflow" (Prompt A, Section 6)
- **Proposed Fix:** Drop the `access_code` column from the `registrations` table and rely entirely on `access_code_hash` for verification.

## 4. Incomplete Test Coverage (Medium Severity)
- **Description:** No Playwright, Jest, or RLS tests exist in the repository yet.
- **Affected Requirement:** "Testing and quality gates" (Prompt A, Section 16)
- **Proposed Fix:** Implement Playwright end-to-end tests for the registration flow, and SQL-based tests (pgTAP or simple scripts) for the RLS rules.

## 5. Missing Admin Notifications/Uploads Tables (Low Severity)
- **Description:** The schema is missing tables for `push_subscriptions`, `attendance_records`, `material_downloads`, `notification_campaigns`, and `feedback`.
- **Affected Requirement:** "Suggested database model" (Prompt A, Section 13)
- **Proposed Fix:** Implement the remaining schema structures.

*Note: UI elements like the Activity Widget, People list, and event times (9:00 a.m. WAT) have been verified and comply with the requirements regarding "no fake data".*
