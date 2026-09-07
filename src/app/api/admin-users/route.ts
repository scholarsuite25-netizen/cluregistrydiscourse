import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(req: NextRequest) {
  try {
    const { email, password, role } = await req.json();

    if (!email || !password || !role) {
      return NextResponse.json({ error: "Email, password, and role are required" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const validRoles = ["super_admin", "content_admin", "checkin_staff"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const admin = createClient(supabaseUrl, serviceKey);

    // Create auth user
    const { data: userData, error: userError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 400 });
    }

    // Add to admin_users table
    const { error: roleError } = await admin.from("admin_users").insert({
      id: userData.user.id,
      role,
    });

    if (roleError) {
      // Rollback: delete the auth user
      await admin.auth.admin.deleteUser(userData.user.id);
      return NextResponse.json({ error: roleError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, userId: userData.user.id });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const admin = createClient(supabaseUrl, serviceKey);

    // Delete from admin_users
    await admin.from("admin_users").delete().eq("id", userId);

    // Delete auth user
    await admin.auth.admin.deleteUser(userId);

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Internal server error" }, { status: 500 });
  }
}
