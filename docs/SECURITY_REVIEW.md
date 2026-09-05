# Security Review and Threat Model

This document outlines the security architecture review of the CLU Registry Discourse application based on the requirements defined in Prompt A.

## 1. Supabase Migrations and RLS Policies

**Findings:**
- **Incomplete RLS Enforcement:** Row Level Security (RLS) is currently only enabled on the `registrations` table. Other sensitive tables like `event_settings` (which contains the protected Zoom URL) and `audit_logs` lack RLS, potentially exposing them if accessed via the Data API.
- **Missing Admin Roles Table:** The `admin_users` or `user_roles` table explicitly requested in Prompt A is missing. Relying solely on client-side metadata or hardcoded emails for admin authorization violates the requirement "explicit admin_users/roles table. Never authorize an admin merely by checking a client-side email string."
- **Incomplete Registration RLS:** The RLS policy `deny anon select registrations` is a good start, but there is no policy to prevent authenticated non-admin users from selecting other participants' registrations.
- **Missing Required Tables:** Several tables required for full functionality and auditability (e.g., `attendance_records`, `push_subscriptions`, `notification_campaigns`) are not defined in `001_initial.sql`.

## 2. Authentication and Authorization

**Findings:**
- Needs verification that Supabase Auth handles email magic links properly without exposing access tokens in URLs beyond the first click.
- Need to implement Server-Side Actions for all privileged operations instead of relying on client-side Supabase client with an anon key.
- A `super_admin` role must be created to manage other admin roles (least privilege principle).

## 3. Access Codes and QR Tokens

**Findings:**
- The schema currently defines `access_code text unique` AND `access_code_hash text`. Storing the `access_code` in plaintext negates the benefit of hashing it. The plaintext column should be removed or strictly used only if hashing is deemed impractical for the current lookup mechanism.

## 4. Protected Storage and Uploads

**Findings:**
- The storage bucket for `materials` has not been defined in the migrations. It must be created as a **private** bucket.
- RLS policies must be applied to the `materials` table to restrict access based on the `audience` and `release_at` rules.

## 5. Public Activity Masking

**Findings:**
- The `public_activity_view` successfully masks the user's name (`first_name || ' ' || left(surname,1) || '.'`) and filters by `public_activity_opt_in = true` and `status='confirmed'`. This correctly fulfills the privacy requirement.

## Next Steps / Remediation

1. Update `001_initial.sql` or create `002_rls_and_roles.sql` to enforce RLS on all tables.
2. Introduce the `admin_users` table.
3. Remove `access_code` plaintext column if `access_code_hash` is intended to be the only verifiable credential.
4. Implement proper RLS for participants viewing their own records.
