import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const { email, password, role } = await req.json();

    if (!email || !password || !role) {
      return NextResponse.json({ error: "Email, password, and role required" }, { status: 400 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceKey) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
    }

    // Use service_role to create auth user
    const admin = createClient(url, serviceKey);

    // Create auth user
    const { data: userData, error: userErr } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (userErr) {
      // If user already exists, try to get their ID
      if (userErr.message.includes("already")) {
        const { data: existingUsers } = await admin.auth.admin.listUsers();
        const existing = existingUsers?.users?.find((u: any) => u.email === email);
        if (existing) {
          // Insert into admin_users if not exists
          const { error: insErr } = await admin.from("admin_users").upsert({
            id: existing.id,
            role,
          }, { onConflict: "id" });
          if (insErr) throw new Error(insErr.message);
          return NextResponse.json({ ok: true, userId: existing.id, message: "Admin role assigned to existing user" });
        }
      }
      throw new Error(userErr.message);
    }

    if (!userData?.user) {
      throw new Error("Failed to create user");
    }

    // Insert into admin_users
    const { error: insErr } = await admin.from("admin_users").upsert({
      id: userData.user.id,
      role,
    }, { onConflict: "id" });

    if (insErr) throw new Error(insErr.message);

    return NextResponse.json({ ok: true, userId: userData.user.id, email });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
