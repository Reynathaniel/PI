// ═══════════════════════════════════════════════════════════
// π PROJECT INTELLIGENCE - TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════

export type PermissionLevel = 'owner' | 'manager' | 'editor' | 'viewer' | 'reporter' | 'none';

export type AppModule =
  | 'overview' | 'daily_reports' | 'project_mgmt' | 'cost_control'
  | 'planning' | 'civil' | 'hsse' | 'qc' | 'procurement'
  | 'hr' | 'commissioning' | 'finance' | 'document_control'
  | 'security' | 'admin' | 'manpower_portal';

export type UserRole =
  // Group A: Project Management
  | 'Project Director' | 'Project Manager' | 'Deputy Project Manager'
  | 'Site Manager' | 'Construction Manager' | 'Engineering Manager'
  | 'Project Controls Manager' | 'Operations Coordinator'
  // Group B: Project Controls
  | 'Cost Control' | 'Planning Engineer' | 'Estimator'
  | 'Quantity Surveyor' | 'Risk Manager' | 'Contract Administrator'
  | 'Document Control' | 'Expeditor'
  // Group C: Engineering
  | 'Process Engineer' | 'Mechanical Engineer' | 'Electrical Engineer'
  | 'Instrumentation Engineer' | 'Piping Engineer' | 'Civil Engineer'
  | 'Architectural Engineer' | 'HVAC Engineer' | 'Telecommunications Engineer'
  | 'Welding Engineer' | 'Insulation Engineer' | 'Geotechnical Engineer'
  | 'BIM Coordinator' | 'CAD Designer'
  // Group D: Construction Field
  | 'Field Engineer' | 'Supervisor' | 'Foreman' | 'General Manpower'
  | 'Rigger' | 'Scaffolder' | 'Heavy Equipment Operator'
  | 'Site Surveyor' | 'Marine Coordinator' | 'Drilling Supervisor' | 'Diving Supervisor'
  // Group E: Quality
  | 'QA Manager' | 'QA Engineer' | 'QC Engineer' | 'QC Inspector'
  | 'Welding Inspector' | 'Welding QC' | 'NDT Coordinator' | 'NDT Inspector' | 'QC'
  // Group F: HSSE
  | 'HSE Manager' | 'HSE Engineer' | 'Safety Officer' | 'Safety Supervisor'
  | 'Fire Safety Officer' | 'Environmental Engineer' | 'Industrial Hygienist'
  | 'Paramedic' | 'Permit Officer' | 'HSE'
  // Group G: Procurement
  | 'Procurement Manager' | 'Procurement' | 'Materials Manager'
  | 'Warehouse Manager' | 'Logistics' | 'Customs Coordinator' | 'Vendor Inspector'
  // Group H: Commissioning
  | 'Commissioning Manager' | 'Commissioning Engineer' | 'Pre-Commissioning Lead'
  | 'Loop Check Engineer' | 'Startup Engineer'
  // Group I: HR & Admin
  | 'HR' | 'HR Officer' | 'Recruitment Officer' | 'Training Coordinator'
  | 'Payroll Officer' | 'Camp Boss' | 'IR Officer' | 'Site Administrator' | 'Catering Coordinator'
  // Group J: Finance
  | 'Finance Manager' | 'Project Accountant' | 'Tax Officer'
  // Group K: Subcontractor
  | 'Subcontractor Coordinator' | 'Subcontractor Engineer'
  // Group L: Client
  | 'Client Representative' | 'Owner Engineer' | 'Third Party Inspector' | 'Authorized Inspector'
  // Group M: Security
  | 'Security Manager' | 'Security Officer'
  // Group N: IT
  | 'IT Coordinator' | 'CAD Admin'
  // Group O: Specialized
  | 'Coating QC' | 'Painting Inspector' | 'Fireproofing Inspector'
  | 'Radiographic Technician' | 'Transport Coordinator'
  // System
  | 'Admin' | 'Super Admin' | 'Subcontractor Super Admin';

export type ModulePermission = Record<AppModule, PermissionLevel>;

export interface RoleConfig {
  role: UserRole;
  label: string;
  shortLabel: string;
  group: string;
  groupLabel: string;
  icon: string;
  color: string;
  accentColor: string;
  primaryView: string;
  permissions: ModulePermission;
  canSubmitReport: boolean;
  canViewAllProjects: boolean;
  seniority: number;
  description: string;
  reportTo?: UserRole;
  reportDiscipline?: UserRole;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  project_id?: string;
  is_active: boolean;
  created_at: string;
}

export interface Project {
  id: string;
  name: string;
  code: string;
  client: string;
  contract_value: number;
  currency: string;
  start_date: string;
  end_date: string;
  forecast_end: string;
  status: 'active' | 'on_hold' | 'completed' | 'cancelled';
  overall_progress: number;
  spi: number;
  cpi: number;
}

export interface Permit {
  id: string;
  permit_number: string;
  type: 'hot_work' | 'confined_space' | 'work_at_height' | 'excavation' | 'electrical' | 'general';
  status: 'active' | 'closed' | 'suspended' | 'expired';
  location: string;
  issued_by: string;
  issued_date: string;
  expiry_date: string;
  description: string;
}

export interface Incident {
  id: string;
  incident_number: string;
  type: 'near_miss' | 'first_aid' | 'mtc' | 'lti' | 'fatality' | 'property_damage' | 'environmental';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'closed';
  date: string;
  location: string;
  description: string;
  reported_by: string;
}

export interface DailyReport {
  id: string;
  date: string;
  submitted_by: string;
  weather: string;
  manpower_count: number;
  equipment_count: number;
  activities: string[];
  issues: string[];
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
}

export interface Inspection {
  id: string;
  type: string;
  location: string;
  inspector: string;
  date: string;
  score: number;
  findings_count: number;
  status: 'completed' | 'overdue' | 'scheduled';
}
