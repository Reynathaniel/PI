-- ═══════════════════════════════════════════════════════════
-- π PROJECT INTELLIGENCE - COMPLETE DATABASE SCHEMA
-- Karimun LNG Terminal Phase 2 - USD 2.4B EPC Project
-- ═══════════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ═══════════════════════════════════════════════
-- 1. CORE TABLES
-- ═══════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  client TEXT NOT NULL,
  contract_value NUMERIC(15,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  forecast_end DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','on_hold','completed','cancelled')),
  overall_progress NUMERIC(5,2) DEFAULT 0,
  spi NUMERIC(5,3) DEFAULT 1.000,
  cpi NUMERIC(5,3) DEFAULT 1.000,
  location TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'General Manpower',
  avatar_url TEXT,
  phone TEXT,
  company TEXT,
  department TEXT,
  project_id UUID REFERENCES projects(id),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════
-- 2. HSSE MODULE
-- ═══════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS permits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) NOT NULL,
  permit_number TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('hot_work','confined_space','work_at_height','excavation','electrical','general','cold_work','radiation','lifting')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','pending','active','closed','suspended','expired','cancelled')),
  location TEXT NOT NULL,
  area TEXT,
  description TEXT,
  hazards TEXT[],
  precautions TEXT[],
  issued_by UUID REFERENCES profiles(id),
  issued_date TIMESTAMPTZ,
  expiry_date TIMESTAMPTZ,
  closed_by UUID REFERENCES profiles(id),
  closed_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS incidents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) NOT NULL,
  incident_number TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('near_miss','first_aid','mtc','lti','fatality','property_damage','environmental','fire','vehicle')),
  severity TEXT NOT NULL CHECK (severity IN ('low','medium','high','critical')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','investigating','corrective_action','closed','escalated')),
  date TIMESTAMPTZ NOT NULL,
  time_of_incident TIME,
  location TEXT NOT NULL,
  area TEXT,
  description TEXT NOT NULL,
  immediate_cause TEXT,
  root_cause TEXT,
  corrective_actions TEXT[],
  reported_by UUID REFERENCES profiles(id),
  investigated_by UUID REFERENCES profiles(id),
  witnesses TEXT[],
  photos TEXT[],
  days_lost INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hira_register (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) NOT NULL,
  activity TEXT NOT NULL,
  hazard TEXT NOT NULL,
  risk_description TEXT,
  likelihood INTEGER CHECK (likelihood BETWEEN 1 AND 5),
  consequence INTEGER CHECK (consequence BETWEEN 1 AND 5),
  risk_rating INTEGER GENERATED ALWAYS AS (likelihood * consequence) STORED,
  risk_level TEXT GENERATED ALWAYS AS (
    CASE WHEN likelihood * consequence >= 20 THEN 'extreme'
         WHEN likelihood * consequence >= 12 THEN 'high'
         WHEN likelihood * consequence >= 6 THEN 'medium'
         ELSE 'low' END
  ) STORED,
  existing_controls TEXT[],
  additional_controls TEXT[],
  residual_likelihood INTEGER,
  residual_consequence INTEGER,
  responsible TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','under_review','closed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bbs_observations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) NOT NULL,
  observer_id UUID REFERENCES profiles(id),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  location TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('ppe','housekeeping','body_positioning','tools_equipment','procedures','communication','line_of_fire','energy_isolation')),
  observation_type TEXT NOT NULL CHECK (observation_type IN ('safe','at_risk')),
  description TEXT NOT NULL,
  corrective_action TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open','closed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inspections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('housekeeping','scaffold','electrical','fire_safety','lifting','ppe','environmental','general')),
  location TEXT NOT NULL,
  area TEXT,
  inspector_id UUID REFERENCES profiles(id),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  score NUMERIC(5,2),
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled','completed','overdue','cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS findings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inspection_id UUID REFERENCES inspections(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low','medium','high','critical')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open','in_progress','closed','overdue')),
  photo_url TEXT,
  assigned_to UUID REFERENCES profiles(id),
  due_date DATE,
  closed_date DATE,
  corrective_action TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS emergency_drills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) NOT NULL,
  drill_type TEXT NOT NULL CHECK (drill_type IN ('fire','evacuation','medical','spill','confined_space','man_overboard')),
  date DATE NOT NULL,
  duration_minutes INTEGER,
  participants INTEGER,
  scenario TEXT,
  observations TEXT,
  muster_time_seconds INTEGER,
  target_time_seconds INTEGER,
  rating TEXT CHECK (rating IN ('excellent','good','satisfactory','needs_improvement','failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════
-- 3. PLANNING & SCHEDULING
-- ═══════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS schedule_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) NOT NULL,
  activity_id TEXT NOT NULL,
  wbs TEXT,
  description TEXT NOT NULL,
  discipline TEXT,
  area TEXT,
  planned_start DATE,
  planned_finish DATE,
  actual_start DATE,
  actual_finish DATE,
  duration_days INTEGER,
  progress NUMERIC(5,2) DEFAULT 0,
  predecessor TEXT,
  successor TEXT,
  float_days INTEGER,
  is_critical BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started','in_progress','completed','delayed','suspended')),
  resource_type TEXT,
  budget_hours NUMERIC(10,2),
  actual_hours NUMERIC(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════
-- 4. DAILY REPORTS
-- ═══════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS daily_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) NOT NULL,
  report_number TEXT NOT NULL,
  date DATE NOT NULL,
  submitted_by UUID REFERENCES profiles(id),
  approved_by UUID REFERENCES profiles(id),
  weather TEXT,
  temperature_high NUMERIC(4,1),
  temperature_low NUMERIC(4,1),
  wind_speed NUMERIC(5,1),
  rainfall_mm NUMERIC(5,1),
  working_hours NUMERIC(4,1),
  total_manpower INTEGER DEFAULT 0,
  total_equipment INTEGER DEFAULT 0,
  summary TEXT,
  issues TEXT[],
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','submitted','approved','rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS manpower_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  daily_report_id UUID REFERENCES daily_reports(id) ON DELETE CASCADE NOT NULL,
  discipline TEXT NOT NULL,
  staff_count INTEGER DEFAULT 0,
  labor_count INTEGER DEFAULT 0,
  subcontractor TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS equipment_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  daily_report_id UUID REFERENCES daily_reports(id) ON DELETE CASCADE NOT NULL,
  equipment_type TEXT NOT NULL,
  total_count INTEGER DEFAULT 0,
  active_count INTEGER DEFAULT 0,
  idle_count INTEGER DEFAULT 0,
  breakdown_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS daily_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  daily_report_id UUID REFERENCES daily_reports(id) ON DELETE CASCADE NOT NULL,
  area TEXT NOT NULL,
  activity TEXT NOT NULL,
  discipline TEXT,
  progress NUMERIC(5,2) DEFAULT 0,
  status TEXT DEFAULT 'on_track' CHECK (status IN ('on_track','delayed','at_risk','completed')),
  remarks TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════
-- 5. COST CONTROL
-- ═══════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS cost_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) NOT NULL,
  wbs TEXT NOT NULL,
  description TEXT NOT NULL,
  budget NUMERIC(15,2) DEFAULT 0,
  committed NUMERIC(15,2) DEFAULT 0,
  actual_cost NUMERIC(15,2) DEFAULT 0,
  earned_value NUMERIC(15,2) DEFAULT 0,
  forecast NUMERIC(15,2) DEFAULT 0,
  variance NUMERIC(15,2) GENERATED ALWAYS AS (budget - forecast) STORED,
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS change_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) NOT NULL,
  co_number TEXT NOT NULL,
  description TEXT NOT NULL,
  value NUMERIC(15,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','under_review','approved','rejected','withdrawn')),
  requested_by TEXT,
  approved_by UUID REFERENCES profiles(id),
  date_submitted DATE DEFAULT CURRENT_DATE,
  date_approved DATE,
  impact_schedule_days INTEGER DEFAULT 0,
  justification TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════
-- 6. PROCUREMENT
-- ═══════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS purchase_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) NOT NULL,
  po_number TEXT NOT NULL,
  vendor TEXT NOT NULL,
  item_description TEXT NOT NULL,
  value NUMERIC(15,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','issued','acknowledged','manufacturing','inspection','in_transit','delivered','cancelled')),
  eta DATE,
  delivery_date DATE,
  progress NUMERIC(5,2) DEFAULT 0,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  unit TEXT NOT NULL,
  ordered_qty NUMERIC(15,2) DEFAULT 0,
  received_qty NUMERIC(15,2) DEFAULT 0,
  installed_qty NUMERIC(15,2) DEFAULT 0,
  wastage_qty NUMERIC(15,2) DEFAULT 0,
  po_id UUID REFERENCES purchase_orders(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vendor_ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) NOT NULL,
  vendor TEXT NOT NULL,
  po_count INTEGER DEFAULT 0,
  on_time_pct NUMERIC(5,2) DEFAULT 0,
  quality_pct NUMERIC(5,2) DEFAULT 0,
  rating TEXT CHECK (rating IN ('A','A-','B+','B','B-','C+','C','D','F')),
  evaluation_date DATE DEFAULT CURRENT_DATE,
  evaluated_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════
-- 7. QC/QA
-- ═══════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS ncr (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) NOT NULL,
  ncr_number TEXT NOT NULL,
  description TEXT NOT NULL,
  discipline TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('minor','major','critical')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open','investigating','corrective_action','closed','escalated')),
  location TEXT,
  date_raised DATE DEFAULT CURRENT_DATE,
  raised_by UUID REFERENCES profiles(id),
  responsible TEXT,
  root_cause TEXT,
  corrective_action TEXT,
  preventive_action TEXT,
  closed_date DATE,
  closed_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS welding_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) NOT NULL,
  joint_number TEXT NOT NULL,
  weld_process TEXT NOT NULL CHECK (weld_process IN ('SMAW','GTAW','FCAW','SAW','GMAW')),
  welder_id TEXT,
  pipe_size TEXT,
  material TEXT,
  wps_number TEXT,
  ndt_type TEXT[],
  result TEXT CHECK (result IN ('accepted','repair','rejected','pending')),
  date_welded DATE DEFAULT CURRENT_DATE,
  date_inspected DATE,
  inspector_id UUID REFERENCES profiles(id),
  remarks TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS itp (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) NOT NULL,
  itp_number TEXT NOT NULL,
  discipline TEXT NOT NULL,
  description TEXT NOT NULL,
  total_checkpoints INTEGER DEFAULT 0,
  completed_checkpoints INTEGER DEFAULT 0,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started','in_progress','completed','overdue')),
  due_date DATE,
  inspector_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════
-- 8. DOCUMENT CONTROL
-- ═══════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) NOT NULL,
  doc_number TEXT NOT NULL,
  title TEXT NOT NULL,
  discipline TEXT NOT NULL,
  doc_type TEXT CHECK (doc_type IN ('drawing','specification','calculation','procedure','report','datasheet','method_statement','schedule','other')),
  revision TEXT DEFAULT 'A0',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','in_review','under_review','approved','approved_with_comments','rejected','superseded','cancelled')),
  originator TEXT,
  file_url TEXT,
  file_size BIGINT,
  submitted_date DATE,
  review_due_date DATE,
  approved_date DATE,
  reviewed_by UUID REFERENCES profiles(id),
  approved_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transmittals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) NOT NULL,
  transmittal_number TEXT NOT NULL,
  from_party TEXT NOT NULL,
  to_party TEXT NOT NULL,
  purpose TEXT CHECK (purpose IN ('for_approval','for_review','for_information','for_construction','approved','approved_with_comments','rejected')),
  doc_count INTEGER DEFAULT 0,
  date_sent DATE DEFAULT CURRENT_DATE,
  date_acknowledged DATE,
  status TEXT DEFAULT 'sent' CHECK (status IN ('draft','sent','acknowledged','received','responded')),
  remarks TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rfi (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) NOT NULL,
  rfi_number TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  discipline TEXT,
  from_party TEXT,
  to_party TEXT,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low','medium','high','urgent')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open','responded','closed')),
  date_raised DATE DEFAULT CURRENT_DATE,
  date_required DATE,
  date_responded DATE,
  response TEXT,
  raised_by UUID REFERENCES profiles(id),
  responded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════
-- 9. ENGINEERING
-- ═══════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS engineering_deliverables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) NOT NULL,
  deliverable_number TEXT NOT NULL,
  title TEXT NOT NULL,
  discipline TEXT NOT NULL,
  doc_type TEXT,
  planned_issue_date DATE,
  actual_issue_date DATE,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started','in_progress','internal_check','issued_ifc','issued_ifa','issued_ifr','superseded')),
  weight NUMERIC(5,2) DEFAULT 1,
  progress NUMERIC(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS technical_queries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) NOT NULL,
  tq_number TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  discipline TEXT NOT NULL,
  from_dept TEXT,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low','medium','high','urgent')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open','assigned','responded','closed')),
  date_raised DATE DEFAULT CURRENT_DATE,
  date_required DATE,
  date_closed DATE,
  response TEXT,
  raised_by UUID REFERENCES profiles(id),
  assigned_to UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════
-- 10. COMMISSIONING
-- ═══════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS commissioning_systems (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) NOT NULL,
  system_number TEXT NOT NULL,
  description TEXT NOT NULL,
  area TEXT,
  subsystem_count INTEGER DEFAULT 0,
  mc_progress NUMERIC(5,2) DEFAULT 0,
  precomm_progress NUMERIC(5,2) DEFAULT 0,
  comm_progress NUMERIC(5,2) DEFAULT 0,
  status TEXT DEFAULT 'construction' CHECK (status IN ('construction','mc_complete','precomm','commissioned','operational')),
  priority TEXT DEFAULT 'medium',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS punch_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  system_id UUID REFERENCES commissioning_systems(id) NOT NULL,
  punch_number TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('A','B','C')),
  description TEXT NOT NULL,
  discipline TEXT,
  location TEXT,
  raised_by UUID REFERENCES profiles(id),
  assigned_to TEXT,
  date_raised DATE DEFAULT CURRENT_DATE,
  date_closed DATE,
  status TEXT DEFAULT 'open' CHECK (status IN ('open','in_progress','closed','rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS checksheets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  system_id UUID REFERENCES commissioning_systems(id) NOT NULL,
  checksheet_number TEXT NOT NULL,
  title TEXT NOT NULL,
  type TEXT CHECK (type IN ('mechanical','electrical','instrument','piping','process','safety')),
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started','in_progress','completed','rejected')),
  completed_by UUID REFERENCES profiles(id),
  completed_date DATE,
  verified_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════
-- 11. HR
-- ═══════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS employee_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id),
  employee_number TEXT NOT NULL,
  full_name TEXT NOT NULL,
  nationality TEXT,
  department TEXT NOT NULL,
  position TEXT,
  category TEXT CHECK (category IN ('staff','labor','expat','national')),
  company TEXT,
  join_date DATE,
  contract_end DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','terminated','resigned','transfer','leave')),
  camp_assigned TEXT,
  medical_expiry DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID REFERENCES employee_records(id) ON DELETE CASCADE NOT NULL,
  cert_name TEXT NOT NULL,
  cert_number TEXT,
  issuing_body TEXT,
  issue_date DATE,
  expiry_date DATE,
  status TEXT DEFAULT 'valid' CHECK (status IN ('valid','expiring_soon','expired','revoked')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS training_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID REFERENCES employee_records(id) ON DELETE CASCADE NOT NULL,
  training_name TEXT NOT NULL,
  training_type TEXT CHECK (training_type IN ('induction','toolbox_talk','competency','certification','hsse','technical','leadership')),
  date DATE NOT NULL,
  duration_hours NUMERIC(5,1),
  trainer TEXT,
  result TEXT CHECK (result IN ('passed','failed','attended','pending')),
  certificate_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════
-- 12. RLS
-- ═══════════════════════════════════════════════

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE permits ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_read_all" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "projects_read_all" ON projects FOR SELECT USING (true);
CREATE POLICY "permits_read" ON permits FOR SELECT USING (true);
CREATE POLICY "incidents_read" ON incidents FOR SELECT USING (true);
CREATE POLICY "daily_reports_read" ON daily_reports FOR SELECT USING (true);
CREATE POLICY "documents_read" ON documents FOR SELECT USING (true);
CREATE POLICY "permits_insert" ON permits FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "incidents_insert" ON incidents FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "daily_reports_insert" ON daily_reports FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "documents_insert" ON documents FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ═══════════════════════════════════════════════
-- 13. TRIGGERS
-- ═══════════════════════════════════════════════

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE tbl TEXT;
BEGIN
  FOR tbl IN
    SELECT table_name FROM information_schema.columns
    WHERE column_name = 'updated_at' AND table_schema = 'public'
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS set_updated_at ON %I', tbl);
    EXECUTE format('CREATE TRIGGER set_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at()', tbl);
  END LOOP;
END;
$$;

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id, NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'General Manpower')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ═══════════════════════════════════════════════
-- 14. SEED DATA
-- ═══════════════════════════════════════════════

INSERT INTO projects (name, code, client, contract_value, currency, start_date, end_date, forecast_end, status, overall_progress, spi, cpi, location, description)
VALUES (
  'Karimun LNG Terminal - Phase 2', 'KLT-P2', 'PT Karimun Gas Indonesia',
  2400000000, 'USD', '2025-01-15', '2028-06-30', '2028-08-15',
  'active', 38.2, 0.94, 1.02,
  'Karimun Island, Riau Islands, Indonesia',
  'LNG receiving, storage, and regasification terminal with 2x 160,000m³ full containment tanks'
) ON CONFLICT (code) DO NOTHING;

-- ═══════════════════════════════════════════════
-- 15. INDEXES
-- ═══════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_permits_project ON permits(project_id);
CREATE INDEX IF NOT EXISTS idx_permits_status ON permits(status);
CREATE INDEX IF NOT EXISTS idx_incidents_project ON incidents(project_id);
CREATE INDEX IF NOT EXISTS idx_incidents_date ON incidents(date);
CREATE INDEX IF NOT EXISTS idx_daily_reports_date ON daily_reports(date);
CREATE INDEX IF NOT EXISTS idx_documents_discipline ON documents(discipline);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_schedule_activities_project ON schedule_activities(project_id);
CREATE INDEX IF NOT EXISTS idx_welding_log_project ON welding_log(project_id);
CREATE INDEX IF NOT EXISTS idx_ncr_project ON ncr(project_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_project ON purchase_orders(project_id);
CREATE INDEX IF NOT EXISTS idx_cost_items_wbs ON cost_items(wbs);
CREATE INDEX IF NOT EXISTS idx_punch_items_system ON punch_items(system_id);
CREATE INDEX IF NOT EXISTS idx_employee_records_dept ON employee_records(department);
