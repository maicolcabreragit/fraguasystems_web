import { createClient } from "@supabase/supabase-js";

/* ═══════════════════════════════════════════════════════════════════
   Database Migration — Create CRM tables in Supabase
   
   Run with: npx tsx scripts/migrate.ts
   ═══════════════════════════════════════════════════════════════════ */

const supabaseUrl = "https://mdcympkmliinozeslnjx.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kY3ltcGttbGlpbm96ZXNsbmp4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mjc5MDIzOSwiZXhwIjoyMDg4MzY2MjM5fQ.JjNkV8ob4Ooyn77njjUVWSLt0xU1NKbmRU9XGDrmfu8";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const SCHEMA_SQL = `
-- ═══════════════════════════════════════════════════════
-- Fragua Systems CRM — Database Schema
-- ═══════════════════════════════════════════════════════

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_role TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  business_type TEXT NOT NULL DEFAULT 'hotel',
  tier TEXT NOT NULL DEFAULT 'B',
  status TEXT NOT NULL DEFAULT 'nuevo',
  location TEXT DEFAULT 'Lleida',
  size TEXT DEFAULT '',
  pain_points TEXT[] DEFAULT '{}',
  estimated_ticket INTEGER DEFAULT 0,
  next_action TEXT DEFAULT '',
  next_action_date DATE,
  notes TEXT DEFAULT '',
  assigned_to TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  client_name TEXT NOT NULL,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'active',
  current_phase TEXT NOT NULL DEFAULT 'discovery',
  phases JSONB NOT NULL DEFAULT '[]',
  package_type TEXT NOT NULL DEFAULT 'starter',
  total_budget INTEGER DEFAULT 0,
  paid_amount INTEGER DEFAULT 0,
  deadline DATE,
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Activities table
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'note',
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  outcome TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- CRM Users table (for auth beyond hardcoded)
CREATE TABLE IF NOT EXISTS crm_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'client',
  client_project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_tier ON leads(tier);
CREATE INDEX IF NOT EXISTS idx_leads_business_type ON leads(business_type);
CREATE INDEX IF NOT EXISTS idx_activities_lead_id ON activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_crm_users_email ON crm_users(email);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to leads
DO $$ BEGIN
  CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Apply trigger to projects
DO $$ BEGIN
  CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Disable RLS for now (we use JWT auth at app level)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_users ENABLE ROW LEVEL SECURITY;

-- Allow service_role full access
CREATE POLICY IF NOT EXISTS "Service role full access on leads" ON leads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Service role full access on projects" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Service role full access on activities" ON activities FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Service role full access on crm_users" ON crm_users FOR ALL USING (true) WITH CHECK (true);
`;

async function migrate() {
  console.log("\n  🔄 Running database migration...\n");
  
  const { error } = await supabase.rpc('exec_sql', { sql: SCHEMA_SQL }).single();
  
  if (error) {
    // If rpc doesn't work, try running SQL directly via fetch
    console.log("  ⚠️  RPC not available, using REST API...\n");
    
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": supabaseServiceKey,
        "Authorization": `Bearer ${supabaseServiceKey}`,
      },
      body: JSON.stringify({ sql: SCHEMA_SQL }),
    });
    
    if (!response.ok) {
      // Fallback: use the SQL API directly
      console.log("  ⚠️  REST API fallback, using SQL endpoint...\n");
      
      const sqlResponse = await fetch(`${supabaseUrl}/pg`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": supabaseServiceKey,
          "Authorization": `Bearer ${supabaseServiceKey}`,
        },
        body: JSON.stringify({ query: SCHEMA_SQL }),
      });

      if (!sqlResponse.ok) {
        console.log("  ❌ Could not run migration automatically.");
        console.log("  📋 Please run the SQL manually in Supabase SQL Editor.\n");
        console.log("  Copy the SQL from: scripts/schema.sql\n");
        
        // Save SQL to file for manual execution
        const { writeFileSync } = await import("fs");
        const { join } = await import("path");
        writeFileSync(join(process.cwd(), "scripts", "schema.sql"), SCHEMA_SQL.trim(), "utf-8");
        console.log("  ✅ SQL saved to scripts/schema.sql\n");
        return false;
      }
    }
  }
  
  console.log("  ✅ Migration completed successfully!\n");
  return true;
}

migrate().catch(console.error);
