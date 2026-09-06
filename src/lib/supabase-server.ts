// Placeholder for Next.js server client (requires @supabase/ssr when credentials exist)
// This file documents intended usage — keep anon/service separation.
export const SUPABASE_RLS_NOTES = `
- anon key: public_activity_view only (masked)
- service_role: server-only, never in browser, never in git
- registrations: no anonymous select *; attendance/materials via signed URLs + auth
`;
