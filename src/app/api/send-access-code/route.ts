import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, firstName, surname, accessCode, participationMode } = await req.json();

    if (!email || !accessCode) {
      return NextResponse.json({ error: "Email and access code are required" }, { status: 400 });
    }

    const resendKey = process.env.RESEND_API_KEY;

    if (!resendKey) {
      // Email not configured — return success anyway so registration still works
      console.log("[email] RESEND_API_KEY not set — skipping email to", email);
      return NextResponse.json({ ok: true, skipped: true, reason: "Email not configured" });
    }

    const name = firstName ? `${firstName} ${surname || ""}`.trim() : "Participant";

    const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8f5ff; margin: 0; padding: 20px; }
  .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 24px; overflow: hidden; border: 1px solid #e5e7eb; }
  .header { background: #4C1769; color: white; padding: 32px; text-align: center; }
  .header h1 { margin: 0; font-size: 24px; font-weight: 900; }
  .header p { margin: 8px 0 0; color: rgba(255,255,255,0.7); font-size: 14px; }
  .body { padding: 32px; }
  .code-box { background: #f8f5ff; border: 2px dashed #C9B676; border-radius: 16px; padding: 24px; text-align: center; margin: 24px 0; }
  .code-label { font-size: 12px; font-weight: 700; letter-spacing: 0.15em; color: #4C1769; margin-bottom: 8px; }
  .code-value { font-size: 36px; font-weight: 900; letter-spacing: 0.12em; color: #4C1769; font-family: monospace; }
  .detail { font-size: 14px; color: #374151; line-height: 1.6; }
  .detail b { color: #4C1769; }
  .btn { display: inline-block; background: #4C1769; color: white; text-decoration: none; padding: 14px 32px; border-radius: 9999px; font-weight: 700; font-size: 14px; margin-top: 16px; }
  .footer { padding: 24px 32px; background: #FFFBEB; border-top: 1px solid #fde68a; font-size: 12px; color: #92400e; text-align: center; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>CLU Registry Discourse 2026</h1>
    <p>Registration Confirmed</p>
  </div>
  <div class="body">
    <p class="detail">Hello <b>${name}</b>,</p>
    <p class="detail">You are registered for the <b>Maiden Registry Discourse</b> of Chrisland University.</p>

    <div class="code-box">
      <div class="code-label">YOUR ACCESS CODE</div>
      <div class="code-value">${accessCode}</div>
    </div>

    <p class="detail"><b>Event:</b> Governance, Innovation & Service: Changing Higher Education Management</p>
    <p class="detail"><b>Date:</b> Thursday, 15 October 2026</p>
    <p class="detail"><b>Time:</b> 9:00 a.m. WAT</p>
    <p class="detail"><b>Venue:</b> University Auditorium, Chrisland University, Abeokuta</p>
    <p class="detail"><b>Mode:</b> ${participationMode === "Physical" ? "Physical (In-Person)" : "Online via Zoom"}</p>

    <p class="detail" style="margin-top:24px;">
      <b>On event day:</b><br>
      • Show your access code at the entrance for check-in<br>
      • ${participationMode === "Physical" ? "Arrive by 8:00 AM for registration" : "Sign in at /portal to join Zoom"}<br>
      • Keep this email — you'll need the code to access materials and your certificate
    </p>

    <div style="text-align:center; margin-top:24px;">
      <a href="https://cluregistrydiscourse.vercel.app/portal" class="btn">Go to Your Portal</a>
    </div>
  </div>
  <div class="footer">
    CLU Registry Discourse 2026 • Chrisland University, Abeokuta<br>
    Questions? Call +234 703 834 7947 or WhatsApp us
  </div>
</div>
</body>
</html>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "CLU Registry Discourse <onboarding@resend.dev>",
        to: [email],
        subject: `Your Access Code: ${accessCode} — CLU Registry Discourse 2026`,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[email] Resend error:", res.status, err);
      // Return ok:true so registration still succeeds even if email fails
      return NextResponse.json({ ok: true, skipped: true, reason: "Email delivery limited — domain verification needed for production" });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("[email] Error:", e.message);
    return NextResponse.json({ ok: true, skipped: true, reason: e.message });
  }
}
