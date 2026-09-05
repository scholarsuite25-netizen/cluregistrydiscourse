export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 prose prose-zinc">
      <h1>Privacy Notice</h1>
      <p><b>Effective:</b> 6 September 2026 • <b>Contact:</b> registrydisourse@gmail.com • <b>Phone:</b> +234 703 834 7947</p>
      <h2>What we collect & why</h2>
      <ul>
        <li>Name, email, phone, institution, department, designation — to register you, issue your access pass/QR and verify attendance.</li>
        <li>Participation mode — to manage physical vs online access & Zoom release.</li>
        <li>Accessibility needs — private, tightly restricted, only to arrange reasonable accommodation.</li>
        <li>Consent flags — email (required for operational messages), WhatsApp opt-in, push opt-in, public-activity opt-in.</li>
      </ul>
      <h2>Public activity</h2>
      <p>First name + surname initial (and organisation if you approve) may appear in a live widget only if you tick “public activity opt-in”. Email, phone, access code and exact timestamps are never shown. Production counts come only from confirmed Supabase rows.</p>
      <h2>Processors & storage</h2>
      <p>Supabase (PostgreSQL, Auth, Storage) and Vercel (hosting). Files in private buckets via signed URLs. No Supabase service role in browser.</p>
      <h2>Your rights</h2>
      <p>Request correction, export or deletion via the contact above. Retention per admin data-retention policy; critical exports before/after event.</p>
      <h2>Cookies & tracking</h2>
      <p>No third-party tracking beyond necessary delivery logs. Access codes, OTPs, Zoom credentials and tokens are never logged.</p>
    </div>
  );
}
