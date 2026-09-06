const { createClient } = require('@supabase/supabase-js');
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://udivbycgtdfshdnbaukq.supabase.co';
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkaXZieWNndGRmc2hkbmJhdWtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2NDM1ODgsImV4cCI6MjEwNDIxOTU4OH0.HHRVYyj6PA19QKtnaUuOoZho-0hoOnKsWWkq4CbnoWg';
const svc = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkaXZieWNndGRmc2hkbmJhdWtxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODY0MzU4OCwiZXhwIjoyMTA0MjE5NTg4fQ.EXUCp7cNcpKFH9qMQKOklgLQ_x7hNMVAb3GODq6rTHE';
async function main(){
  const anonClient = createClient(url, anon);
  const svcClient = createClient(url, svc);
  console.log('URL', url);
  for (const [name, client] of [['anon', anonClient], ['service', svcClient]]){
    for (const tbl of ['events','registrations','admin_users']){
      const r = await client.from(tbl).select('id').limit(1);
      console.log(`[${name}] ${tbl}:`, r.error ? `ERROR ${r.error.code}: ${r.error.message}` : `OK ${JSON.stringify(r.data)}`);
    }
  }
  // try insert test registration with service
  const test = await svcClient.from('registrations').insert({ first_name:'Test', surname:'User', email:`test_${Date.now()}@example.com`, phone:`+234700${Date.now().toString().slice(-7)}`, institution:'Test Uni', participation_mode:'Physical', consent_email:true, status:'confirmed', access_code:'TEST'+Math.random().toString(36).slice(2,6).toUpperCase() }).select('id');
  console.log('insert test:', test.error ? test.error.message : `OK id=${test.data?.[0]?.id}`);
  if (!test.error) await svcClient.from('registrations').delete().eq('id', test.data[0].id);
}
main();
