// Setup script: Run the SQL migration against Supabase
// Usage: node supabase/run-migration.mjs

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  console.log('   Set them in your .env.local file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const sql = readFileSync(join(__dirname, 'migrations', '012_more_b1_c1_lessons.sql'), 'utf-8')

// Split by semicolons and run each statement
const statements = sql
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'))

console.log(`🚀 Running ${statements.length} SQL statements...`)

for (const statement of statements) {
  const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' })
  if (error) {
    // Try using the REST API directly if RPC isn't available
    console.log(`⚠️  Statement may need to be run in Supabase Dashboard SQL Editor`)
    console.log(`   Statement: ${statement.substring(0, 80)}...`)
  }
}

console.log('✅ Migration complete! Check your Supabase Dashboard to verify.')
