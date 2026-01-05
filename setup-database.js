// Quick script to set up Supabase database
// Run with: node setup-database.js

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

console.log('🔗 Connecting to Supabase...');
console.log(`   URL: ${supabaseUrl}`);

// Note: We need the service_role key to run DDL commands
// The anon key doesn't have permissions to create tables
console.log('\n⚠️  This script requires your SUPABASE_SERVICE_ROLE_KEY');
console.log('📍 Find it in: Supabase Dashboard → Settings → API → service_role key');
console.log('\n✋ For security, please run the SQL manually in the Supabase SQL Editor instead:');
console.log('   1. Go to: https://supabase.com/dashboard/project/gcvpxiyesidhkklalqia/sql/new');
console.log('   2. Copy all contents from: supabase-schema.sql');
console.log('   3. Paste and click "Run"');
console.log('\n✅ This is the recommended and safest approach!');
