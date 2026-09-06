const { createClient } = require('@supabase/supabase-js');

const url = 'https://udivbycgtdfshdnbaukq.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkaXZieWNndGRmc2hkbmJhdWtxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODY0MzU4OCwiZXhwIjoyMTA0MjE5NTg4fQ.EXUCp7cNcpKFH9qMQKOklgLQ_x7hNMVAb3GODq6rTHE';

const admins = [
  { email: 'admin@cluregistrydiscourse.com', password: 'CLU2026Admin!', role: 'super_admin', label: 'SUPER ADMIN' },
  { email: 'content@cluregistrydiscourse.com', password: 'CLU2026Content!', role: 'content_admin', label: 'CONTENT ADMIN' },
  { email: 'checkin@cluregistrydiscourse.com', password: 'CLU2026Checkin!', role: 'checkin_staff', label: 'CHECK-IN STAFF' },
];

async function main() {
  const adminClient = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  for (const a of admins) {
    console.log(`\n--- Creating ${a.label} ---`);
    console.log(`Email: ${a.email}`);
    console.log(`Password: ${a.password}`);

    // Create auth user
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email: a.email,
      password: a.password,
      email_confirm: true,
    });

    if (authError) {
      if (authError.message.includes('already exists')) {
        console.log('Auth user already exists — finding existing user...');
        const { data: users } = await adminClient.auth.admin.listUsers();
        const existing = users?.users?.find(u => u.email === a.email);
        if (existing) {
          console.log(`Found existing user: ${existing.id}`);
          // Insert role
          const { error: roleErr } = await adminClient
            .from('admin_users')
            .upsert({ id: existing.id, role: a.role }, { onConflict: 'id' });
          if (roleErr) console.log('Role insert error:', roleErr.message);
          else console.log(`Role set to: ${a.role}`);
        }
        continue;
      }
      console.log('Auth error:', authError.message);
      continue;
    }

    console.log(`Auth user created: ${authData.user.id}`);

    // Add to admin_users table
    const { error: roleErr } = await adminClient
      .from('admin_users')
      .insert({ id: authData.user.id, role: a.role });

    if (roleErr) console.log('Role insert error:', roleErr.message);
    else console.log(`Role assigned: ${a.role}`);
  }

  // Verify
  console.log('\n--- Verifying admin_users table ---');
  const { data: admins_list, error } = await adminClient
    .from('admin_users')
    .select('*');

  if (error) console.log('Verify error:', error.message);
  else console.log('Admin users in DB:', JSON.stringify(admins_list, null, 2));
}

main().catch(e => console.error('Fatal:', e.message));
