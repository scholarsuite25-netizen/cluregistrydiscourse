const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function runTest() {
  console.log('Testing RLS Vulnerabilities...');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('Skipping RLS test. Supabase credentials not found in .env.local');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Test 1: Can anon read event_settings?
  console.log('\n--- Test 1: Read event_settings as anonymous user ---');
  const { data: settingsData, error: settingsError } = await supabase
    .from('event_settings')
    .select('*');
  
  if (settingsError) {
    console.log('✅ PASS: Anonymous users cannot read event_settings.', settingsError.message);
  } else {
    console.log('❌ FAIL: Anonymous users CAN read event_settings (RLS missing).');
    if (settingsData && settingsData.length > 0) {
      console.log(`Exposed Zoom URL: ${settingsData[0].zoom_join_url}`);
    }
  }

  // Test 2: Can anon read registrations?
  console.log('\n--- Test 2: Read registrations as anonymous user ---');
  const { data: regData, error: regError } = await supabase
    .from('registrations')
    .select('*');

  if (regError) {
    console.log('✅ PASS: Anonymous users cannot read registrations directly.', regError.message);
  } else {
    console.log('❌ FAIL: Anonymous users CAN read registrations directly.');
  }

  // Test 3: Can anon read audit_logs?
  console.log('\n--- Test 3: Read audit_logs as anonymous user ---');
  const { data: auditData, error: auditError } = await supabase
    .from('audit_logs')
    .select('*');

  if (auditError) {
    console.log('✅ PASS: Anonymous users cannot read audit_logs.', auditError.message);
  } else {
    console.log('❌ FAIL: Anonymous users CAN read audit_logs (RLS missing).');
  }

  console.log('\n--- SUMMARY ---');
  console.log('If any FAIL occurred above, the application has severe RLS misconfigurations that expose sensitive data.');
}

runTest();
