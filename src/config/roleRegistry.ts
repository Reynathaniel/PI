// src/config/roleRegistry.ts
// ═══════════════════════════════════════════════════════════════
// ROLE REGISTRY SYSTEM - FONDASI UTAMA π (Project Intelligence)
// 96 Roles across Groups A-O + System Roles
// ═══════════════════════════════════════════════════════════════

import type { UserRole } from '../types';

// ─── PERMISSION LEVELS ───────────────────────────────────────
export type PermissionLevel =
  | 'owner'       // full CRUD + admin
  | 'manager'     // CRUD own + read all
  | 'editor'      // create + edit own
  | 'viewer'      // read-only
  | 'reporter'    // submit reports only
  | 'none';       // no access

// ─── FEATURE FLAGS PER MODULE ────────────────────────────────
export type AppModule =
  | 'overview'
  | 'daily_reports'
  | 'project_mgmt'
  | 'cost_control'
  | 'planning'
  | 'civil'
  | 'hsse'
  | 'qc'
  | 'procurement'
  | 'hr'
  | 'commissioning'
  | 'finance'
  | 'document_control'
  | 'security'
  | 'admin'
  | 'manpower_portal';

export type ModulePermission = Record<AppModule, PermissionLevel>;

// ─── ROLE CONFIGURATION ──────────────────────────────────────
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
  reportDiscipline?: UserRole;
  canViewAllProjects: boolean;
  seniority: number;
  description: string;
}

// ─── DEFAULT PERMISSION TEMPLATES ────────────────────────────
const PERM_NONE: ModulePermission = {
  overview: 'none', daily_reports: 'none', project_mgmt: 'none',
  cost_control: 'none', planning: 'none', civil: 'none',
  hsse: 'none', qc: 'none', procurement: 'none',
  hr: 'none', commissioning: 'none', finance: 'none',
  document_control: 'none', security: 'none', admin: 'none',
  manpower_portal: 'none'
};

const PERM_ALL_OWNER: ModulePermission = {
  overview: 'owner', daily_reports: 'owner', project_mgmt: 'owner',
  cost_control: 'owner', planning: 'owner', civil: 'owner',
  hsse: 'owner', qc: 'owner', procurement: 'owner',
  hr: 'owner', commissioning: 'owner', finance: 'owner',
  document_control: 'owner', security: 'owner', admin: 'owner',
  manpower_portal: 'owner'
};

const p = (overrides: Partial<ModulePermission>): ModulePermission => ({
  ...PERM_NONE, ...overrides
});

// ═══════════════════════════════════════════════════════════════
// FULL ROLE REGISTRY - 96 ROLES
// ═══════════════════════════════════════════════════════════════
export const ROLE_REGISTRY: Record<UserRole, RoleConfig> = {

  // ══════════════════════════════════════════
  // GROUP A: PROJECT MANAGEMENT (8 roles)
  // ══════════════════════════════════════════

  'Project Director': {
    role: 'Project Director', label: 'Project Director', shortLabel: 'PD',
    group: 'A', groupLabel: 'Project Management', icon: 'Crown',
    color: 'text-amber-400', accentColor: 'amber', primaryView: 'pm-command',
    permissions: PERM_ALL_OWNER,
    canSubmitReport: false, canViewAllProjects: true, seniority: 10,
    description: 'Executive oversight of all project operations'
  },

  'Project Manager': {
    role: 'Project Manager', label: 'Project Manager', shortLabel: 'PM',
    group: 'A', groupLabel: 'Project Management', icon: 'Briefcase',
    color: 'text-emerald-400', accentColor: 'emerald', primaryView: 'pm-command',
    permissions: p({
      overview: 'owner', daily_reports: 'owner', project_mgmt: 'owner',
      cost_control: 'owner', planning: 'owner', civil: 'manager',
      hsse: 'manager', qc: 'manager', procurement: 'owner',
      hr: 'manager', commissioning: 'manager', finance: 'manager',
      document_control: 'manager', security: 'viewer', admin: 'viewer',
      manpower_portal: 'owner'
    }),
    canSubmitReport: false, canViewAllProjects: true, seniority: 9,
    description: 'Overall project delivery management'
  },

  'Deputy Project Manager': {
    role: 'Deputy Project Manager', label: 'Deputy Project Manager', shortLabel: 'DPM',
    group: 'A', groupLabel: 'Project Management', icon: 'UserCog',
    color: 'text-emerald-300', accentColor: 'emerald', primaryView: 'pm-command',
    permissions: p({
      overview: 'manager', daily_reports: 'owner', project_mgmt: 'manager',
      cost_control: 'manager', planning: 'manager', civil: 'manager',
      hsse: 'manager', qc: 'manager', procurement: 'manager',
      hr: 'viewer', commissioning: 'manager', finance: 'viewer',
      document_control: 'manager', security: 'viewer', manpower_portal: 'manager'
    }),
    canSubmitReport: false, canViewAllProjects: true, seniority: 8,
    description: 'Deputy to Project Manager'
  },

  'Construction Manager': {
    role: 'Construction Manager', label: 'Construction Manager', shortLabel: 'CM',
    group: 'A', groupLabel: 'Project Management', icon: 'HardHat',
    color: 'text-orange-400', accentColor: 'orange', primaryView: 'civil-command',
    permissions: p({
      overview: 'manager', daily_reports: 'manager', project_mgmt: 'manager',
      cost_control: 'manager', planning: 'manager', civil: 'owner',
      hsse: 'manager', qc: 'manager', procurement: 'manager',
      hr: 'viewer', commissioning: 'viewer', document_control: 'manager',
      security: 'viewer', manpower_portal: 'manager'
    }),
    canSubmitReport: false, canViewAllProjects: false, seniority: 8,
    description: 'Construction activities management'
  },

  'Engineering Manager': {
    role: 'Engineering Manager', label: 'Engineering Manager', shortLabel: 'EM',
    group: 'A', groupLabel: 'Project Management', icon: 'Cog',
    color: 'text-blue-400', accentColor: 'blue', primaryView: 'pm-command',
    permissions: p({
      overview: 'manager', daily_reports: 'manager', project_mgmt: 'manager',
      cost_control: 'viewer', planning: 'manager', civil: 'owner',
      hsse: 'viewer', qc: 'owner', procurement: 'manager',
      commissioning: 'manager', document_control: 'owner', manpower_portal: 'viewer'
    }),
    canSubmitReport: false, canViewAllProjects: false, seniority: 8,
    description: 'Engineering disciplines oversight'
  },

  'Procurement Manager': {
    role: 'Procurement Manager', label: 'Procurement Manager', shortLabel: 'PROC',
    group: 'A', groupLabel: 'Project Management', icon: 'ShoppingCart',
    color: 'text-teal-400', accentColor: 'teal', primaryView: 'procurement-hub',
    permissions: p({
      overview: 'viewer', daily_reports: 'viewer', project_mgmt: 'viewer',
      cost_control: 'manager', planning: 'viewer', procurement: 'owner',
      document_control: 'manager', finance: 'viewer', manpower_portal: 'viewer'
    }),
    canSubmitReport: false, canViewAllProjects: false, seniority: 8,
    description: 'Procurement and supply chain management'
  },

  'Commissioning Manager': {
    role: 'Commissioning Manager', label: 'Commissioning Manager', shortLabel: 'COMMGR',
    group: 'A', groupLabel: 'Project Management', icon: 'Zap',
    color: 'text-violet-400', accentColor: 'violet', primaryView: 'comm-command',
    permissions: p({
      overview: 'manager', daily_reports: 'manager', project_mgmt: 'viewer',
      cost_control: 'viewer', planning: 'manager', civil: 'viewer',
      hsse: 'manager', qc: 'manager', procurement: 'viewer',
      commissioning: 'owner', document_control: 'manager', manpower_portal: 'viewer'
    }),
    canSubmitReport: false, canViewAllProjects: false, seniority: 8,
    description: 'Commissioning and startup management'
  },

  'Site Manager': {
    role: 'Site Manager', label: 'Site Manager', shortLabel: 'SM',
    group: 'A', groupLabel: 'Project Management', icon: 'MapPin',
    color: 'text-orange-300', accentColor: 'orange', primaryView: 'civil-command',
    permissions: p({
      overview: 'manager', daily_reports: 'manager', project_mgmt: 'viewer',
      cost_control: 'viewer', planning: 'viewer', civil: 'manager',
      hsse: 'manager', qc: 'viewer', procurement: 'viewer',
      hr: 'viewer', security: 'manager', document_control: 'viewer',
      manpower_portal: 'manager'
    }),
    canSubmitReport: false, canViewAllProjects: false, seniority: 7,
    description: 'Site operations management'
  },

  // ══════════════════════════════════════════
  // GROUP B: PROJECT CONTROLS (8 roles)
  // ══════════════════════════════════════════

  'Project Controls Manager': {
    role: 'Project Controls Manager', label: 'Project Controls Manager', shortLabel: 'PCM',
    group: 'B', groupLabel: 'Project Controls', icon: 'BarChart3',
    color: 'text-cyan-400', accentColor: 'cyan', primaryView: 'cost-control',
    permissions: p({
      overview: 'manager', daily_reports: 'manager', project_mgmt: 'manager',
      cost_control: 'owner', planning: 'owner', document_control: 'manager',
      finance: 'manager', manpower_portal: 'viewer'
    }),
    canSubmitReport: false, canViewAllProjects: true, seniority: 8,
    description: 'Project controls oversight'
  },

  'Cost Control': {
    role: 'Cost Control', label: 'Cost Control Engineer', shortLabel: 'CC',
    group: 'B', groupLabel: 'Project Controls', icon: 'DollarSign',
    color: 'text-green-400', accentColor: 'green', primaryView: 'cost-control',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor', project_mgmt: 'viewer',
      cost_control: 'owner', planning: 'viewer', procurement: 'manager',
      finance: 'manager', document_control: 'viewer', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, reportDiscipline: 'Cost Control',
    canViewAllProjects: false, seniority: 6,
    description: 'Budget control and cost reporting'
  },

  'Planning Engineer': {
    role: 'Planning Engineer', label: 'Planning Engineer', shortLabel: 'PLAN',
    group: 'B', groupLabel: 'Project Controls', icon: 'GanttChartSquare',
    color: 'text-cyan-400', accentColor: 'cyan', primaryView: 'planning',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor', project_mgmt: 'manager',
      cost_control: 'viewer', planning: 'owner', document_control: 'viewer',
      manpower_portal: 'viewer'
    }),
    canSubmitReport: true, reportDiscipline: 'Planning Engineer',
    canViewAllProjects: false, seniority: 6,
    description: 'Schedule development and progress tracking'
  },

  'Document Control': {
    role: 'Document Control', label: 'Document Controller', shortLabel: 'DC',
    group: 'B', groupLabel: 'Project Controls', icon: 'FileStack',
    color: 'text-indigo-400', accentColor: 'indigo', primaryView: 'drawings',
    permissions: p({
      overview: 'viewer', daily_reports: 'viewer',
      document_control: 'owner', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, reportDiscipline: 'Document Control',
    canViewAllProjects: false, seniority: 4,
    description: 'Document and drawing management'
  },

  'Risk Manager': {
    role: 'Risk Manager', label: 'Risk Manager', shortLabel: 'RISK',
    group: 'B', groupLabel: 'Project Controls', icon: 'AlertTriangle',
    color: 'text-rose-400', accentColor: 'rose', primaryView: 'pm-command',
    permissions: p({
      overview: 'manager', daily_reports: 'viewer', project_mgmt: 'manager',
      cost_control: 'viewer', planning: 'viewer', hsse: 'viewer',
      document_control: 'viewer', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, canViewAllProjects: false, seniority: 6,
    description: 'Project risk identification and mitigation'
  },

  'Contract Administrator': {
    role: 'Contract Administrator', label: 'Contract Administrator', shortLabel: 'CA',
    group: 'B', groupLabel: 'Project Controls', icon: 'ScrollText',
    color: 'text-amber-300', accentColor: 'amber', primaryView: 'cost-control',
    permissions: p({
      overview: 'viewer', daily_reports: 'viewer', project_mgmt: 'viewer',
      cost_control: 'manager', procurement: 'manager', finance: 'viewer',
      document_control: 'manager', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, canViewAllProjects: false, seniority: 6,
    description: 'Contract administration and claims'
  },

  'Estimator': {
    role: 'Estimator', label: 'Estimator', shortLabel: 'EST',
    group: 'B', groupLabel: 'Project Controls', icon: 'Calculator',
    color: 'text-lime-400', accentColor: 'lime', primaryView: 'cost-control',
    permissions: p({
      overview: 'viewer', daily_reports: 'viewer',
      cost_control: 'manager', planning: 'viewer', procurement: 'viewer',
      document_control: 'viewer', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, canViewAllProjects: false, seniority: 5,
    description: 'Cost estimation and quantity take-off'
  },

  'Quantity Surveyor': {
    role: 'Quantity Surveyor', label: 'Quantity Surveyor', shortLabel: 'QS',
    group: 'B', groupLabel: 'Project Controls', icon: 'Ruler',
    color: 'text-emerald-300', accentColor: 'emerald', primaryView: 'boq',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor',
      cost_control: 'manager', civil: 'viewer', procurement: 'viewer',
      document_control: 'viewer', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, reportDiscipline: 'Quantity Surveyor',
    canViewAllProjects: false, seniority: 5,
    description: 'Quantity surveying and measurement'
  },

  // ══════════════════════════════════════════
  // GROUP C: ENGINEERING (13 roles)
  // ══════════════════════════════════════════

  'Civil Engineer': {
    role: 'Civil Engineer', label: 'Civil Engineer', shortLabel: 'CVL',
    group: 'C', groupLabel: 'Engineering', icon: 'Building2',
    color: 'text-yellow-400', accentColor: 'yellow', primaryView: 'civil-command',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor', civil: 'owner',
      hsse: 'viewer', qc: 'manager', document_control: 'manager', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, reportDiscipline: 'Supervisor',
    canViewAllProjects: false, seniority: 5, description: 'Civil and structural engineering'
  },

  'Mechanical Engineer': {
    role: 'Mechanical Engineer', label: 'Mechanical Engineer', shortLabel: 'MECH',
    group: 'C', groupLabel: 'Engineering', icon: 'Cog',
    color: 'text-blue-400', accentColor: 'blue', primaryView: 'civil-command',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor', civil: 'manager',
      hsse: 'viewer', qc: 'manager', document_control: 'manager', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, canViewAllProjects: false, seniority: 5,
    description: 'Mechanical engineering and equipment'
  },

  'Piping Engineer': {
    role: 'Piping Engineer', label: 'Piping Engineer', shortLabel: 'PIPE',
    group: 'C', groupLabel: 'Engineering', icon: 'GitBranch',
    color: 'text-cyan-300', accentColor: 'cyan', primaryView: 'civil-command',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor', civil: 'manager',
      hsse: 'viewer', qc: 'manager', document_control: 'manager', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, canViewAllProjects: false, seniority: 5,
    description: 'Piping design and installation'
  },

  'Electrical Engineer': {
    role: 'Electrical Engineer', label: 'Electrical Engineer', shortLabel: 'ELEC',
    group: 'C', groupLabel: 'Engineering', icon: 'Plug',
    color: 'text-yellow-300', accentColor: 'yellow', primaryView: 'civil-command',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor', civil: 'manager',
      hsse: 'viewer', qc: 'manager', commissioning: 'viewer',
      document_control: 'manager', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, canViewAllProjects: false, seniority: 5,
    description: 'Electrical systems engineering'
  },

  'Instrumentation Engineer': {
    role: 'Instrumentation Engineer', label: 'Instrumentation Engineer', shortLabel: 'INST',
    group: 'C', groupLabel: 'Engineering', icon: 'Gauge',
    color: 'text-purple-400', accentColor: 'purple', primaryView: 'civil-command',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor', civil: 'manager',
      hsse: 'viewer', qc: 'manager', commissioning: 'viewer',
      document_control: 'manager', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, canViewAllProjects: false, seniority: 5,
    description: 'Instrumentation and control systems'
  },

  'Process Engineer': {
    role: 'Process Engineer', label: 'Process Engineer', shortLabel: 'PROC-E',
    group: 'C', groupLabel: 'Engineering', icon: 'FlaskConical',
    color: 'text-emerald-300', accentColor: 'emerald', primaryView: 'civil-command',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor', civil: 'manager',
      hsse: 'manager', qc: 'manager', commissioning: 'manager',
      document_control: 'manager', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, canViewAllProjects: false, seniority: 6,
    description: 'Process engineering and design'
  },

  'Telecommunications Engineer': {
    role: 'Telecommunications Engineer', label: 'Telecom Engineer', shortLabel: 'TCOM',
    group: 'C', groupLabel: 'Engineering', icon: 'Radio',
    color: 'text-sky-400', accentColor: 'sky', primaryView: 'civil-command',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor', civil: 'editor',
      document_control: 'editor', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, canViewAllProjects: false, seniority: 5,
    description: 'Telecommunications systems'
  },

  'HVAC Engineer': {
    role: 'HVAC Engineer', label: 'HVAC Engineer', shortLabel: 'HVAC',
    group: 'C', groupLabel: 'Engineering', icon: 'Wind',
    color: 'text-blue-300', accentColor: 'blue', primaryView: 'civil-command',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor', civil: 'editor',
      qc: 'viewer', document_control: 'editor', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, canViewAllProjects: false, seniority: 5,
    description: 'HVAC systems engineering'
  },

  'Architectural Engineer': {
    role: 'Architectural Engineer', label: 'Architectural Engineer', shortLabel: 'ARCH',
    group: 'C', groupLabel: 'Engineering', icon: 'Home',
    color: 'text-rose-300', accentColor: 'rose', primaryView: 'civil-command',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor', civil: 'editor',
      document_control: 'editor', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, canViewAllProjects: false, seniority: 5,
    description: 'Architectural design'
  },

  'Geotechnical Engineer': {
    role: 'Geotechnical Engineer', label: 'Geotechnical Engineer', shortLabel: 'GEO',
    group: 'C', groupLabel: 'Engineering', icon: 'Mountain',
    color: 'text-amber-600', accentColor: 'amber', primaryView: 'civil-command',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor', civil: 'manager',
      qc: 'viewer', document_control: 'editor', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, canViewAllProjects: false, seniority: 5,
    description: 'Geotechnical investigation and design'
  },

  'Welding Engineer': {
    role: 'Welding Engineer', label: 'Welding Engineer', shortLabel: 'WELD-E',
    group: 'C', groupLabel: 'Engineering', icon: 'Flame',
    color: 'text-orange-500', accentColor: 'orange', primaryView: 'civil-command',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor', civil: 'manager',
      qc: 'owner', document_control: 'manager', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, canViewAllProjects: false, seniority: 5,
    description: 'Welding engineering and procedures'
  },

  'CAD Designer': {
    role: 'CAD Designer', label: 'CAD Designer', shortLabel: 'CAD',
    group: 'C', groupLabel: 'Engineering', icon: 'PenTool',
    color: 'text-indigo-300', accentColor: 'indigo', primaryView: 'drawings',
    permissions: p({
      overview: 'viewer', daily_reports: 'reporter', civil: 'viewer',
      document_control: 'editor', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, canViewAllProjects: false, seniority: 3,
    description: 'CAD drawing production'
  },

  'BIM Coordinator': {
    role: 'BIM Coordinator', label: 'BIM Coordinator', shortLabel: 'BIM',
    group: 'C', groupLabel: 'Engineering', icon: 'Box',
    color: 'text-violet-300', accentColor: 'violet', primaryView: 'drawings',
    permissions: p({
      overview: 'viewer', daily_reports: 'reporter', civil: 'viewer',
      document_control: 'manager', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, canViewAllProjects: false, seniority: 5,
    description: 'BIM model coordination and clash detection'
  },

  // ══════════════════════════════════════════
  // GROUP D: CONSTRUCTION FIELD (10 roles)
  // ══════════════════════════════════════════

  'Supervisor': {
    role: 'Supervisor', label: 'Site Supervisor', shortLabel: 'SUP',
    group: 'D', groupLabel: 'Construction Field', icon: 'Clipboard',
    color: 'text-orange-400', accentColor: 'orange', primaryView: 'supervisor',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor', civil: 'editor',
      hsse: 'viewer', qc: 'viewer', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, reportDiscipline: 'Supervisor',
    canViewAllProjects: false, seniority: 4, description: 'Field supervision'
  },

  'Field Engineer': {
    role: 'Field Engineer', label: 'Field Engineer', shortLabel: 'FE',
    group: 'D', groupLabel: 'Construction Field', icon: 'Wrench',
    color: 'text-yellow-300', accentColor: 'yellow', primaryView: 'supervisor',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor', civil: 'editor',
      hsse: 'viewer', qc: 'viewer', document_control: 'viewer', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, reportDiscipline: 'Supervisor',
    canViewAllProjects: false, seniority: 4, description: 'Field engineering support'
  },

  'Foreman': {
    role: 'Foreman', label: 'Foreman', shortLabel: 'FRMN',
    group: 'D', groupLabel: 'Construction Field', icon: 'Users',
    color: 'text-orange-300', accentColor: 'orange', primaryView: 'supervisor',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor', civil: 'reporter',
      hsse: 'viewer', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, reportDiscipline: 'Supervisor',
    canViewAllProjects: false, seniority: 3, description: 'Crew leadership and coordination'
  },

  'Site Surveyor': {
    role: 'Site Surveyor', label: 'Site Surveyor', shortLabel: 'SRV',
    group: 'D', groupLabel: 'Construction Field', icon: 'Crosshair',
    color: 'text-green-300', accentColor: 'green', primaryView: 'civil-command',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor', civil: 'editor',
      document_control: 'viewer', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, canViewAllProjects: false, seniority: 4,
    description: 'Land and construction surveying'
  },

  'Welding Inspector': {
    role: 'Welding Inspector', label: 'Welding Inspector', shortLabel: 'WI',
    group: 'D', groupLabel: 'Construction Field', icon: 'Flame',
    color: 'text-red-300', accentColor: 'red', primaryView: 'qc',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor', civil: 'viewer',
      qc: 'editor', document_control: 'viewer', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, canViewAllProjects: false, seniority: 4,
    description: 'Welding inspection and NDE coordination'
  },

  'Painting Inspector': {
    role: 'Painting Inspector', label: 'Painting Inspector', shortLabel: 'PI',
    group: 'D', groupLabel: 'Construction Field', icon: 'Paintbrush',
    color: 'text-blue-300', accentColor: 'blue', primaryView: 'qc',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor', civil: 'viewer',
      qc: 'editor', document_control: 'viewer', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, canViewAllProjects: false, seniority: 4,
    description: 'Coating and painting inspection'
  },

  'NDT Inspector': {
    role: 'NDT Inspector', label: 'NDT Inspector', shortLabel: 'NDT',
    group: 'D', groupLabel: 'Construction Field', icon: 'ScanLine',
    color: 'text-purple-300', accentColor: 'purple', primaryView: 'qc',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor', qc: 'editor',
      document_control: 'viewer', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, canViewAllProjects: false, seniority: 4,
    description: 'Non-destructive testing'
  },

  'Heavy Equipment Operator': {
    role: 'Heavy Equipment Operator', label: 'Heavy Equipment Operator', shortLabel: 'HEO',
    group: 'D', groupLabel: 'Construction Field', icon: 'Truck',
    color: 'text-amber-300', accentColor: 'amber', primaryView: 'manpower-portal',
    permissions: p({ daily_reports: 'reporter', hsse: 'viewer', manpower_portal: 'viewer' }),
    canSubmitReport: true, reportDiscipline: 'Supervisor',
    canViewAllProjects: false, seniority: 2, description: 'Heavy equipment operation'
  },

  'Rigger': {
    role: 'Rigger', label: 'Rigger', shortLabel: 'RIG',
    group: 'D', groupLabel: 'Construction Field', icon: 'Anchor',
    color: 'text-slate-300', accentColor: 'slate', primaryView: 'manpower-portal',
    permissions: p({ daily_reports: 'reporter', hsse: 'viewer', manpower_portal: 'viewer' }),
    canSubmitReport: true, reportDiscipline: 'Supervisor',
    canViewAllProjects: false, seniority: 2, description: 'Rigging and lifting support'
  },

  'Scaffolder': {
    role: 'Scaffolder', label: 'Scaffolder', shortLabel: 'SCAF',
    group: 'D', groupLabel: 'Construction Field', icon: 'Grid3X3',
    color: 'text-neutral-300', accentColor: 'neutral', primaryView: 'manpower-portal',
    permissions: p({ daily_reports: 'reporter', hsse: 'viewer', manpower_portal: 'viewer' }),
    canSubmitReport: true, reportDiscipline: 'Supervisor',
    canViewAllProjects: false, seniority: 2, description: 'Scaffold erection and inspection'
  },

  // ══════════════════════════════════════════
  // GROUP E: QUALITY (8 roles)
  // ══════════════════════════════════════════

  'QC': {
    role: 'QC', label: 'QC Officer', shortLabel: 'QC',
    group: 'E', groupLabel: 'Quality', icon: 'ClipboardCheck',
    color: 'text-purple-400', accentColor: 'purple', primaryView: 'qc',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor', civil: 'viewer',
      qc: 'owner', document_control: 'manager', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, reportDiscipline: 'QC',
    canViewAllProjects: false, seniority: 5, description: 'Quality control and inspections'
  },

  'QA Manager': {
    role: 'QA Manager', label: 'QA Manager', shortLabel: 'QAM',
    group: 'E', groupLabel: 'Quality', icon: 'ShieldCheck',
    color: 'text-purple-500', accentColor: 'purple', primaryView: 'qc',
    permissions: p({
      overview: 'manager', daily_reports: 'manager', civil: 'viewer',
      qc: 'owner', document_control: 'owner', manpower_portal: 'viewer'
    }),
    canSubmitReport: false, canViewAllProjects: false, seniority: 7,
    description: 'Quality assurance system management'
  },

  'QA Engineer': {
    role: 'QA Engineer', label: 'QA Engineer', shortLabel: 'QAE',
    group: 'E', groupLabel: 'Quality', icon: 'FileCheck',
    color: 'text-purple-300', accentColor: 'purple', primaryView: 'qc',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor', qc: 'manager',
      document_control: 'manager', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, canViewAllProjects: false, seniority: 5,
    description: 'QA procedures and audits'
  },

  'QC Engineer': {
    role: 'QC Engineer', label: 'QC Engineer', shortLabel: 'QCE',
    group: 'E', groupLabel: 'Quality', icon: 'SearchCheck',
    color: 'text-violet-300', accentColor: 'violet', primaryView: 'qc',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor', civil: 'viewer',
      qc: 'manager', document_control: 'editor', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, canViewAllProjects: false, seniority: 5,
    description: 'QC engineering and testing'
  },

  'QC Inspector': {
    role: 'QC Inspector', label: 'QC Inspector', shortLabel: 'QCI',
    group: 'E', groupLabel: 'Quality', icon: 'Search',
    color: 'text-violet-400', accentColor: 'violet', primaryView: 'qc',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor', qc: 'editor',
      document_control: 'viewer', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, canViewAllProjects: false, seniority: 4,
    description: 'Field quality inspections'
  },

  'Welding QC': {
    role: 'Welding QC', label: 'Welding QC', shortLabel: 'WQC',
    group: 'E', groupLabel: 'Quality', icon: 'Flame',
    color: 'text-orange-400', accentColor: 'orange', primaryView: 'qc',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor', qc: 'editor',
      document_control: 'viewer', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, canViewAllProjects: false, seniority: 4,
    description: 'Welding quality control'
  },

  'Coating QC': {
    role: 'Coating QC', label: 'Coating QC', shortLabel: 'CQC',
    group: 'E', groupLabel: 'Quality', icon: 'Layers',
    color: 'text-blue-300', accentColor: 'blue', primaryView: 'qc',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor', qc: 'editor',
      document_control: 'viewer', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, canViewAllProjects: false, seniority: 4,
    description: 'Coating and painting QC'
  },

  'NDT Coordinator': {
    role: 'NDT Coordinator', label: 'NDT Coordinator', shortLabel: 'NDTC',
    group: 'E', groupLabel: 'Quality', icon: 'Radar',
    color: 'text-indigo-400', accentColor: 'indigo', primaryView: 'qc',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor', qc: 'manager',
      document_control: 'manager', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, canViewAllProjects: false, seniority: 5,
    description: 'NDT coordination and scheduling'
  },

  // ══════════════════════════════════════════
  // GROUP F: HSSE (10 roles)
  // ══════════════════════════════════════════

  'HSE': {
    role: 'HSE', label: 'HSE Officer', shortLabel: 'HSE',
    group: 'F', groupLabel: 'HSSE', icon: 'ShieldAlert',
    color: 'text-red-400', accentColor: 'red', primaryView: 'hsse-command',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor', civil: 'viewer',
      hsse: 'owner', qc: 'viewer', hr: 'viewer', commissioning: 'viewer',
      document_control: 'viewer', security: 'viewer', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, reportDiscipline: 'HSE',
    canViewAllProjects: false, seniority: 5, description: 'HSE compliance and monitoring'
  },

  'HSE Manager': {
    role: 'HSE Manager', label: 'HSE Manager', shortLabel: 'HSEM',
    group: 'F', groupLabel: 'HSSE', icon: 'Shield',
    color: 'text-red-500', accentColor: 'red', primaryView: 'hsse-command',
    permissions: p({
      overview: 'manager', daily_reports: 'manager', civil: 'viewer',
      hsse: 'owner', qc: 'manager', hr: 'viewer', commissioning: 'viewer',
      document_control: 'manager', security: 'manager', manpower_portal: 'viewer'
    }),
    canSubmitReport: false, canViewAllProjects: false, seniority: 7,
    description: 'HSSE department management'
  },

  'HSE Engineer': {
    role: 'HSE Engineer', label: 'HSE Engineer', shortLabel: 'HSEE',
    group: 'F', groupLabel: 'HSSE', icon: 'ShieldCheck',
    color: 'text-red-300', accentColor: 'red', primaryView: 'hsse-command',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor', hsse: 'manager',
      qc: 'viewer', document_control: 'editor', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, reportDiscipline: 'HSE',
    canViewAllProjects: false, seniority: 5, description: 'HSE engineering and analysis'
  },

  'Safety Officer': {
    role: 'Safety Officer', label: 'Safety Officer', shortLabel: 'SO',
    group: 'F', groupLabel: 'HSSE', icon: 'AlertOctagon',
    color: 'text-orange-400', accentColor: 'orange', primaryView: 'hsse-command',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor', hsse: 'editor',
      manpower_portal: 'viewer'
    }),
    canSubmitReport: true, reportDiscipline: 'HSE',
    canViewAllProjects: false, seniority: 4, description: 'Field safety monitoring'
  },

  'Safety Supervisor': {
    role: 'Safety Supervisor', label: 'Safety Supervisor', shortLabel: 'SS',
    group: 'F', groupLabel: 'HSSE', icon: 'Eye',
    color: 'text-orange-300', accentColor: 'orange', primaryView: 'hsse-command',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor', hsse: 'editor',
      manpower_portal: 'viewer'
    }),
    canSubmitReport: true, reportDiscipline: 'HSE',
    canViewAllProjects: false, seniority: 4, description: 'Safety supervision and patrol'
  },

  'Environmental Engineer': {
    role: 'Environmental Engineer', label: 'Environmental Engineer', shortLabel: 'ENV',
    group: 'F', groupLabel: 'HSSE', icon: 'Leaf',
    color: 'text-green-400', accentColor: 'green', primaryView: 'environment',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor', hsse: 'manager',
      document_control: 'editor', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, reportDiscipline: 'HSE',
    canViewAllProjects: false, seniority: 5, description: 'Environmental management'
  },

  'Paramedic': {
    role: 'Paramedic', label: 'Paramedic', shortLabel: 'MED',
    group: 'F', groupLabel: 'HSSE', icon: 'HeartPulse',
    color: 'text-pink-400', accentColor: 'pink', primaryView: 'hsse-command',
    permissions: p({
      overview: 'viewer', daily_reports: 'reporter', hsse: 'editor',
      manpower_portal: 'viewer'
    }),
    canSubmitReport: true, reportDiscipline: 'HSE',
    canViewAllProjects: false, seniority: 3, description: 'Medical and first aid services'
  },

  'Fire Safety Officer': {
    role: 'Fire Safety Officer', label: 'Fire Safety Officer', shortLabel: 'FSO',
    group: 'F', groupLabel: 'HSSE', icon: 'Flame',
    color: 'text-red-500', accentColor: 'red', primaryView: 'emergency',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor', hsse: 'editor',
      security: 'viewer', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, reportDiscipline: 'HSE',
    canViewAllProjects: false, seniority: 4, description: 'Fire prevention and response'
  },

  'Industrial Hygienist': {
    role: 'Industrial Hygienist', label: 'Industrial Hygienist', shortLabel: 'IH',
    group: 'F', groupLabel: 'HSSE', icon: 'FlaskConical',
    color: 'text-teal-400', accentColor: 'teal', primaryView: 'hygiene',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor', hsse: 'manager',
      document_control: 'editor', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, reportDiscipline: 'HSE',
    canViewAllProjects: false, seniority: 5, description: 'Industrial hygiene monitoring'
  },

  'Permit Officer': {
    role: 'Permit Officer', label: 'Permit Officer', shortLabel: 'PTW',
    group: 'F', groupLabel: 'HSSE', icon: 'Key',
    color: 'text-amber-400', accentColor: 'amber', primaryView: 'ptw',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor', hsse: 'manager',
      document_control: 'viewer', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, reportDiscipline: 'HSE',
    canViewAllProjects: false, seniority: 4, description: 'Permit to Work management'
  },

  // ══════════════════════════════════════════
  // GROUP G: PROCUREMENT & SUPPLY CHAIN (7 roles)
  // ══════════════════════════════════════════

  'Procurement': {
    role: 'Procurement', label: 'Procurement Officer', shortLabel: 'PROC',
    group: 'G', groupLabel: 'Procurement & Supply Chain', icon: 'ShoppingBag',
    color: 'text-blue-400', accentColor: 'blue', primaryView: 'procurement-hub',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor', cost_control: 'viewer',
      procurement: 'owner', document_control: 'editor', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, reportDiscipline: 'Procurement',
    canViewAllProjects: false, seniority: 5, description: 'Procurement processing'
  },

  'Expeditor': {
    role: 'Expeditor', label: 'Expeditor', shortLabel: 'EXP',
    group: 'G', groupLabel: 'Procurement & Supply Chain', icon: 'Clock',
    color: 'text-cyan-300', accentColor: 'cyan', primaryView: 'procurement-hub',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor', procurement: 'editor',
      document_control: 'viewer', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, canViewAllProjects: false, seniority: 4,
    description: 'Material expediting and tracking'
  },

  'Materials Manager': {
    role: 'Materials Manager', label: 'Materials Manager', shortLabel: 'MATM',
    group: 'G', groupLabel: 'Procurement & Supply Chain', icon: 'Package',
    color: 'text-teal-400', accentColor: 'teal', primaryView: 'warehouse',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor', cost_control: 'viewer',
      procurement: 'owner', document_control: 'viewer', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, canViewAllProjects: false, seniority: 6,
    description: 'Materials management and inventory'
  },

  'Logistics': {
    role: 'Logistics', label: 'Logistics Coordinator', shortLabel: 'LOG',
    group: 'G', groupLabel: 'Procurement & Supply Chain', icon: 'Truck',
    color: 'text-blue-300', accentColor: 'blue', primaryView: 'logistics',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor', cost_control: 'viewer',
      procurement: 'owner', document_control: 'viewer', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, reportDiscipline: 'Logistics',
    canViewAllProjects: false, seniority: 4, description: 'Material logistics and delivery'
  },

  'Warehouse Manager': {
    role: 'Warehouse Manager', label: 'Warehouse Manager', shortLabel: 'WH',
    group: 'G', groupLabel: 'Procurement & Supply Chain', icon: 'Warehouse',
    color: 'text-indigo-300', accentColor: 'indigo', primaryView: 'warehouse',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor', procurement: 'manager',
      document_control: 'viewer', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, canViewAllProjects: false, seniority: 5,
    description: 'Warehouse operations'
  },

  'Vendor Inspector': {
    role: 'Vendor Inspector', label: 'Vendor Inspector', shortLabel: 'VI',
    group: 'G', groupLabel: 'Procurement & Supply Chain', icon: 'SearchCheck',
    color: 'text-green-300', accentColor: 'green', primaryView: 'qc',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor', qc: 'editor',
      procurement: 'viewer', document_control: 'viewer', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, canViewAllProjects: false, seniority: 4,
    description: 'Vendor and fabrication inspection'
  },

  'Customs Coordinator': {
    role: 'Customs Coordinator', label: 'Customs Coordinator', shortLabel: 'CUST',
    group: 'G', groupLabel: 'Procurement & Supply Chain', icon: 'FileText',
    color: 'text-amber-300', accentColor: 'amber', primaryView: 'logistics',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor', procurement: 'editor',
      document_control: 'viewer', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, canViewAllProjects: false, seniority: 4,
    description: 'Import/export customs clearance'
  },

  // ══════════════════════════════════════════
  // GROUP H: COMMISSIONING (5 roles)
  // ══════════════════════════════════════════

  'Commissioning Engineer': {
    role: 'Commissioning Engineer', label: 'Commissioning Engineer', shortLabel: 'COMM',
    group: 'H', groupLabel: 'Commissioning & Startup', icon: 'Zap',
    color: 'text-violet-400', accentColor: 'violet', primaryView: 'comm-command',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor', civil: 'viewer',
      hsse: 'viewer', qc: 'manager', commissioning: 'owner',
      document_control: 'manager', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, reportDiscipline: 'Commissioning Engineer',
    canViewAllProjects: false, seniority: 6, description: 'System commissioning'
  },

  'Pre-Commissioning Lead': {
    role: 'Pre-Commissioning Lead', label: 'Pre-Commissioning Lead', shortLabel: 'PCOMM',
    group: 'H', groupLabel: 'Commissioning & Startup', icon: 'Settings',
    color: 'text-violet-300', accentColor: 'violet', primaryView: 'pre-comm',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor', civil: 'viewer',
      qc: 'editor', commissioning: 'manager', document_control: 'editor',
      manpower_portal: 'viewer'
    }),
    canSubmitReport: true, canViewAllProjects: false, seniority: 5,
    description: 'Pre-commissioning activities lead'
  },

  'Startup Engineer': {
    role: 'Startup Engineer', label: 'Startup Engineer', shortLabel: 'START',
    group: 'H', groupLabel: 'Commissioning & Startup', icon: 'Play',
    color: 'text-emerald-400', accentColor: 'emerald', primaryView: 'comm-command',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor', hsse: 'viewer',
      commissioning: 'manager', document_control: 'editor', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, canViewAllProjects: false, seniority: 6,
    description: 'Plant startup and performance testing'
  },

  'Operations Coordinator': {
    role: 'Operations Coordinator', label: 'Operations Coordinator', shortLabel: 'OPS',
    group: 'H', groupLabel: 'Commissioning & Startup', icon: 'RefreshCw',
    color: 'text-sky-400', accentColor: 'sky', primaryView: 'comm-command',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor', hsse: 'viewer',
      commissioning: 'editor', document_control: 'viewer', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, canViewAllProjects: false, seniority: 5,
    description: 'Operations coordination during commissioning'
  },

  'Loop Check Engineer': {
    role: 'Loop Check Engineer', label: 'Loop Check Engineer', shortLabel: 'LOOP',
    group: 'H', groupLabel: 'Commissioning & Startup', icon: 'CircuitBoard',
    color: 'text-indigo-400', accentColor: 'indigo', primaryView: 'loop-check',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor', commissioning: 'editor',
      document_control: 'editor', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, canViewAllProjects: false, seniority: 4,
    description: 'Instrument loop checking and testing'
  },

  // ══════════════════════════════════════════
  // GROUP I: HR & ADMIN (9 roles)
  // ══════════════════════════════════════════

  'HR': {
    role: 'HR', label: 'HR Manager', shortLabel: 'HR',
    group: 'I', groupLabel: 'Human Resources & Admin', icon: 'Users',
    color: 'text-pink-400', accentColor: 'pink', primaryView: 'hr-command',
    permissions: p({
      overview: 'viewer', daily_reports: 'viewer', cost_control: 'viewer',
      planning: 'viewer', hsse: 'viewer', hr: 'owner', finance: 'manager',
      document_control: 'viewer', admin: 'viewer', manpower_portal: 'owner'
    }),
    canSubmitReport: true, reportDiscipline: 'HR',
    canViewAllProjects: false, seniority: 6, description: 'Human resource management'
  },

  'HR Officer': {
    role: 'HR Officer', label: 'HR Officer', shortLabel: 'HRO',
    group: 'I', groupLabel: 'Human Resources & Admin', icon: 'UserCheck',
    color: 'text-pink-300', accentColor: 'pink', primaryView: 'hr-command',
    permissions: p({
      overview: 'viewer', daily_reports: 'viewer', hr: 'editor',
      manpower_portal: 'manager'
    }),
    canSubmitReport: true, reportDiscipline: 'HR',
    canViewAllProjects: false, seniority: 4, description: 'HR administration'
  },

  'Recruitment Officer': {
    role: 'Recruitment Officer', label: 'Recruitment Officer', shortLabel: 'REC',
    group: 'I', groupLabel: 'Human Resources & Admin', icon: 'UserPlus',
    color: 'text-rose-300', accentColor: 'rose', primaryView: 'recruitment',
    permissions: p({
      overview: 'viewer', hr: 'editor', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, canViewAllProjects: false, seniority: 4,
    description: 'Recruitment and hiring'
  },

  'Training Coordinator': {
    role: 'Training Coordinator', label: 'Training Coordinator', shortLabel: 'TRN',
    group: 'I', groupLabel: 'Human Resources & Admin', icon: 'GraduationCap',
    color: 'text-indigo-300', accentColor: 'indigo', primaryView: 'training',
    permissions: p({
      overview: 'viewer', hr: 'editor', hsse: 'viewer', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, canViewAllProjects: false, seniority: 4,
    description: 'Training program management'
  },

  'IR Officer': {
    role: 'IR Officer', label: 'Industrial Relations Officer', shortLabel: 'IR',
    group: 'I', groupLabel: 'Human Resources & Admin', icon: 'Handshake',
    color: 'text-amber-300', accentColor: 'amber', primaryView: 'hr-command',
    permissions: p({
      overview: 'viewer', hr: 'editor', security: 'viewer', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, canViewAllProjects: false, seniority: 5,
    description: 'Industrial relations and labor compliance'
  },

  'Site Administrator': {
    role: 'Site Administrator', label: 'Site Administrator', shortLabel: 'SADM',
    group: 'I', groupLabel: 'Human Resources & Admin', icon: 'Building',
    color: 'text-neutral-300', accentColor: 'neutral', primaryView: 'hr-command',
    permissions: p({
      overview: 'viewer', hr: 'editor', security: 'viewer', manpower_portal: 'manager'
    }),
    canSubmitReport: true, canViewAllProjects: false, seniority: 4,
    description: 'Site administration and facilities'
  },

  'Camp Boss': {
    role: 'Camp Boss', label: 'Camp Boss', shortLabel: 'CAMP',
    group: 'I', groupLabel: 'Human Resources & Admin', icon: 'Home',
    color: 'text-amber-400', accentColor: 'amber', primaryView: 'hr-command',
    permissions: p({
      overview: 'viewer', hr: 'editor', security: 'viewer', manpower_portal: 'manager'
    }),
    canSubmitReport: true, canViewAllProjects: false, seniority: 4,
    description: 'Camp and accommodation management'
  },

  'Catering Coordinator': {
    role: 'Catering Coordinator', label: 'Catering Coordinator', shortLabel: 'CATR',
    group: 'I', groupLabel: 'Human Resources & Admin', icon: 'UtensilsCrossed',
    color: 'text-orange-200', accentColor: 'orange', primaryView: 'hr-command',
    permissions: p({
      overview: 'viewer', hr: 'reporter', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, canViewAllProjects: false, seniority: 3,
    description: 'Catering and food services'
  },

  'Transport Coordinator': {
    role: 'Transport Coordinator', label: 'Transport Coordinator', shortLabel: 'TRNS',
    group: 'I', groupLabel: 'Human Resources & Admin', icon: 'Bus',
    color: 'text-blue-200', accentColor: 'blue', primaryView: 'logistics',
    permissions: p({
      overview: 'viewer', hr: 'reporter', procurement: 'viewer', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, canViewAllProjects: false, seniority: 3,
    description: 'Personnel transportation'
  },

  // ══════════════════════════════════════════
  // GROUP J: FINANCE (4 roles)
  // ══════════════════════════════════════════

  'Project Accountant': {
    role: 'Project Accountant', label: 'Project Accountant', shortLabel: 'ACCT',
    group: 'J', groupLabel: 'Finance & Accounting', icon: 'FileSpreadsheet',
    color: 'text-lime-400', accentColor: 'lime', primaryView: 'finance',
    permissions: p({
      overview: 'viewer', cost_control: 'manager', finance: 'owner',
      document_control: 'viewer', manpower_portal: 'viewer'
    }),
    canSubmitReport: false, canViewAllProjects: false, seniority: 6,
    description: 'Project accounting'
  },

  'Finance Manager': {
    role: 'Finance Manager', label: 'Finance Manager', shortLabel: 'FIN',
    group: 'J', groupLabel: 'Finance & Accounting', icon: 'Calculator',
    color: 'text-lime-500', accentColor: 'lime', primaryView: 'finance',
    permissions: p({
      overview: 'viewer', cost_control: 'manager', procurement: 'manager',
      hr: 'manager', finance: 'owner', document_control: 'viewer', manpower_portal: 'viewer'
    }),
    canSubmitReport: false, canViewAllProjects: false, seniority: 7,
    description: 'Project financial management'
  },

  'Payroll Officer': {
    role: 'Payroll Officer', label: 'Payroll Officer', shortLabel: 'PAY',
    group: 'J', groupLabel: 'Finance & Accounting', icon: 'Banknote',
    color: 'text-green-300', accentColor: 'green', primaryView: 'payroll',
    permissions: p({
      overview: 'viewer', hr: 'viewer', finance: 'editor', manpower_portal: 'viewer'
    }),
    canSubmitReport: false, canViewAllProjects: false, seniority: 4,
    description: 'Payroll processing'
  },

  'Tax Officer': {
    role: 'Tax Officer', label: 'Tax Officer', shortLabel: 'TAX',
    group: 'J', groupLabel: 'Finance & Accounting', icon: 'Receipt',
    color: 'text-emerald-300', accentColor: 'emerald', primaryView: 'finance',
    permissions: p({
      overview: 'viewer', finance: 'editor', document_control: 'viewer',
      manpower_portal: 'viewer'
    }),
    canSubmitReport: false, canViewAllProjects: false, seniority: 5,
    description: 'Tax compliance and reporting'
  },

  // ══════════════════════════════════════════
  // GROUP K: SUBCONTRACTOR (2 roles)
  // ══════════════════════════════════════════

  'Subcontractor Coordinator': {
    role: 'Subcontractor Coordinator', label: 'Subcontractor Coordinator', shortLabel: 'SUBC',
    group: 'K', groupLabel: 'Subcontractor Management', icon: 'Handshake',
    color: 'text-sky-400', accentColor: 'sky', primaryView: 'pm-command',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor', project_mgmt: 'viewer',
      cost_control: 'viewer', civil: 'viewer', hsse: 'viewer',
      qc: 'viewer', procurement: 'viewer', document_control: 'viewer',
      manpower_portal: 'viewer'
    }),
    canSubmitReport: true, canViewAllProjects: false, seniority: 5,
    description: 'Subcontractor coordination'
  },

  'Subcontractor Engineer': {
    role: 'Subcontractor Engineer', label: 'Subcontractor Engineer', shortLabel: 'SUBE',
    group: 'K', groupLabel: 'Subcontractor Management', icon: 'UserCog',
    color: 'text-sky-300', accentColor: 'sky', primaryView: 'supervisor',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor', civil: 'viewer',
      hsse: 'viewer', qc: 'viewer', document_control: 'viewer', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, canViewAllProjects: false, seniority: 4,
    description: 'Subcontractor engineering interface'
  },

  // ══════════════════════════════════════════
  // GROUP L: CLIENT INTERFACE (4 roles)
  // ══════════════════════════════════════════

  'Client Representative': {
    role: 'Client Representative', label: 'Client Representative', shortLabel: 'CLIENT',
    group: 'L', groupLabel: 'Client Interface', icon: 'Building',
    color: 'text-sky-400', accentColor: 'sky', primaryView: 'client-portal',
    permissions: p({
      overview: 'viewer', daily_reports: 'viewer', project_mgmt: 'viewer',
      cost_control: 'viewer', planning: 'viewer', civil: 'viewer',
      hsse: 'viewer', qc: 'manager', procurement: 'viewer',
      commissioning: 'manager', document_control: 'manager'
    }),
    canSubmitReport: false, canViewAllProjects: false, seniority: 7,
    description: 'Client oversight and approval'
  },

  'Owner Engineer': {
    role: 'Owner Engineer', label: 'Owner Engineer', shortLabel: 'OE',
    group: 'L', groupLabel: 'Client Interface', icon: 'UserCheck',
    color: 'text-indigo-400', accentColor: 'indigo', primaryView: 'client-portal',
    permissions: p({
      overview: 'viewer', daily_reports: 'viewer', project_mgmt: 'viewer',
      planning: 'viewer', civil: 'viewer', hsse: 'viewer',
      qc: 'manager', commissioning: 'viewer', document_control: 'manager'
    }),
    canSubmitReport: false, canViewAllProjects: false, seniority: 7,
    description: 'Owner engineering representative'
  },

  'Third Party Inspector': {
    role: 'Third Party Inspector', label: 'Third Party Inspector', shortLabel: 'TPI',
    group: 'L', groupLabel: 'Client Interface', icon: 'ShieldCheck',
    color: 'text-violet-400', accentColor: 'violet', primaryView: 'qc',
    permissions: p({
      overview: 'viewer', civil: 'viewer', qc: 'manager',
      document_control: 'viewer'
    }),
    canSubmitReport: false, canViewAllProjects: false, seniority: 6,
    description: 'Third party inspection services'
  },

  'Authorized Inspector': {
    role: 'Authorized Inspector', label: 'Authorized Inspector', shortLabel: 'AI',
    group: 'L', groupLabel: 'Client Interface', icon: 'BadgeCheck',
    color: 'text-amber-400', accentColor: 'amber', primaryView: 'qc',
    permissions: p({
      overview: 'viewer', qc: 'manager', document_control: 'viewer'
    }),
    canSubmitReport: false, canViewAllProjects: false, seniority: 7,
    description: 'Code-authorized inspection (ASME, API)'
  },

  // ══════════════════════════════════════════
  // GROUP M: SECURITY (2 roles)
  // ══════════════════════════════════════════

  'Security Manager': {
    role: 'Security Manager', label: 'Security Manager', shortLabel: 'SEC',
    group: 'M', groupLabel: 'Security', icon: 'Shield',
    color: 'text-slate-400', accentColor: 'slate', primaryView: 'security',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor', hsse: 'manager',
      hr: 'viewer', security: 'owner', document_control: 'viewer', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, reportDiscipline: 'Security Manager',
    canViewAllProjects: false, seniority: 5, description: 'Site security management'
  },

  'Security Officer': {
    role: 'Security Officer', label: 'Security Officer', shortLabel: 'SECO',
    group: 'M', groupLabel: 'Security', icon: 'ShieldAlert',
    color: 'text-slate-300', accentColor: 'slate', primaryView: 'security',
    permissions: p({
      overview: 'viewer', daily_reports: 'reporter', security: 'editor',
      manpower_portal: 'viewer'
    }),
    canSubmitReport: true, reportDiscipline: 'Security Manager',
    canViewAllProjects: false, seniority: 3, description: 'Security patrol and access control'
  },

  // ══════════════════════════════════════════
  // GROUP N: IT & SYSTEMS (2 roles)
  // ══════════════════════════════════════════

  'IT Coordinator': {
    role: 'IT Coordinator', label: 'IT Coordinator', shortLabel: 'IT',
    group: 'N', groupLabel: 'IT & Systems', icon: 'Monitor',
    color: 'text-cyan-400', accentColor: 'cyan', primaryView: 'admin',
    permissions: p({
      overview: 'viewer', document_control: 'manager', admin: 'editor',
      manpower_portal: 'viewer'
    }),
    canSubmitReport: true, canViewAllProjects: false, seniority: 5,
    description: 'IT infrastructure and support'
  },

  'CAD Admin': {
    role: 'CAD Admin', label: 'CAD Administrator', shortLabel: 'CADA',
    group: 'N', groupLabel: 'IT & Systems', icon: 'PenTool',
    color: 'text-indigo-300', accentColor: 'indigo', primaryView: 'drawings',
    permissions: p({
      overview: 'viewer', document_control: 'owner', admin: 'viewer',
      manpower_portal: 'viewer'
    }),
    canSubmitReport: true, canViewAllProjects: false, seniority: 4,
    description: 'CAD system administration'
  },

  // ══════════════════════════════════════════
  // GROUP O: SPECIALIZED (6 roles)
  // ══════════════════════════════════════════

  'Insulation Engineer': {
    role: 'Insulation Engineer', label: 'Insulation Engineer', shortLabel: 'INS',
    group: 'O', groupLabel: 'Specialized', icon: 'Layers',
    color: 'text-teal-300', accentColor: 'teal', primaryView: 'civil-command',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor', civil: 'editor',
      qc: 'viewer', document_control: 'viewer', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, canViewAllProjects: false, seniority: 4,
    description: 'Thermal insulation engineering'
  },

  'Fireproofing Inspector': {
    role: 'Fireproofing Inspector', label: 'Fireproofing Inspector', shortLabel: 'FPI',
    group: 'O', groupLabel: 'Specialized', icon: 'Flame',
    color: 'text-red-300', accentColor: 'red', primaryView: 'qc',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor', qc: 'editor',
      hsse: 'viewer', document_control: 'viewer', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, canViewAllProjects: false, seniority: 4,
    description: 'Fireproofing inspection'
  },

  'Radiographic Technician': {
    role: 'Radiographic Technician', label: 'Radiographic Technician', shortLabel: 'RT',
    group: 'O', groupLabel: 'Specialized', icon: 'ScanLine',
    color: 'text-yellow-300', accentColor: 'yellow', primaryView: 'qc',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor', qc: 'editor',
      hsse: 'viewer', document_control: 'viewer', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, canViewAllProjects: false, seniority: 4,
    description: 'Radiographic testing and film interpretation'
  },

  'Diving Supervisor': {
    role: 'Diving Supervisor', label: 'Diving Supervisor', shortLabel: 'DIVE',
    group: 'O', groupLabel: 'Specialized', icon: 'Waves',
    color: 'text-blue-500', accentColor: 'blue', primaryView: 'supervisor',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor', civil: 'viewer',
      hsse: 'manager', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, canViewAllProjects: false, seniority: 5,
    description: 'Diving operations supervision'
  },

  'Marine Coordinator': {
    role: 'Marine Coordinator', label: 'Marine Coordinator', shortLabel: 'MARINE',
    group: 'O', groupLabel: 'Specialized', icon: 'Anchor',
    color: 'text-cyan-500', accentColor: 'cyan', primaryView: 'logistics',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor', civil: 'viewer',
      hsse: 'viewer', procurement: 'viewer', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, canViewAllProjects: false, seniority: 5,
    description: 'Marine operations coordination'
  },

  'Drilling Supervisor': {
    role: 'Drilling Supervisor', label: 'Drilling Supervisor', shortLabel: 'DRILL',
    group: 'O', groupLabel: 'Specialized', icon: 'ArrowDownToLine',
    color: 'text-amber-500', accentColor: 'amber', primaryView: 'supervisor',
    permissions: p({
      overview: 'viewer', daily_reports: 'editor', civil: 'editor',
      hsse: 'manager', manpower_portal: 'viewer'
    }),
    canSubmitReport: true, canViewAllProjects: false, seniority: 5,
    description: 'Drilling operations supervision'
  },

  // ══════════════════════════════════════════
  // SYSTEM ROLES (5 roles)
  // ══════════════════════════════════════════

  'Admin': {
    role: 'Admin', label: 'Administrator', shortLabel: 'ADM',
    group: 'SYSTEM', groupLabel: 'System', icon: 'ShieldCheck',
    color: 'text-emerald-400', accentColor: 'emerald', primaryView: 'admin',
    permissions: PERM_ALL_OWNER,
    canSubmitReport: true, canViewAllProjects: true, seniority: 10,
    description: 'System administrator'
  },

  'Super Admin': {
    role: 'Super Admin', label: 'Super Administrator', shortLabel: 'SA',
    group: 'SYSTEM', groupLabel: 'System', icon: 'Crown',
    color: 'text-amber-400', accentColor: 'amber', primaryView: 'admin',
    permissions: PERM_ALL_OWNER,
    canSubmitReport: true, canViewAllProjects: true, seniority: 10,
    description: 'Full system access'
  },

  'General Manpower': {
    role: 'General Manpower', label: 'General Manpower', shortLabel: 'GMP',
    group: 'SYSTEM', groupLabel: 'Field', icon: 'UserCheck',
    color: 'text-neutral-400', accentColor: 'neutral', primaryView: 'manpower-portal',
    permissions: p({ manpower_portal: 'viewer' }),
    canSubmitReport: false, canViewAllProjects: false, seniority: 1,
    description: 'Field worker with limited access'
  },

  'Subcontractor Super Admin': {
    role: 'Subcontractor Super Admin', label: 'Subcontractor Super Admin', shortLabel: 'SSA',
    group: 'SYSTEM', groupLabel: 'System', icon: 'ShieldCheck',
    color: 'text-sky-400', accentColor: 'sky', primaryView: 'overview',
    permissions: p({
      overview: 'viewer', daily_reports: 'manager', civil: 'viewer',
      hsse: 'viewer', qc: 'viewer', manpower_portal: 'manager'
    }),
    canSubmitReport: true, canViewAllProjects: false, seniority: 6,
    description: 'Subcontractor admin access'
  },
};

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

export const getRoleConfig = (role: UserRole): RoleConfig => {
  return ROLE_REGISTRY[role] ?? ROLE_REGISTRY['General Manpower'];
};

export const getRolesByGroup = (): Record<string, RoleConfig[]> => {
  const groups: Record<string, RoleConfig[]> = {};
  Object.values(ROLE_REGISTRY).forEach(config => {
    if (!groups[config.groupLabel]) groups[config.groupLabel] = [];
    groups[config.groupLabel].push(config);
  });
  return groups;
};

export const hasPermission = (
  userRoles: UserRole[],
  module: AppModule,
  requiredLevel: PermissionLevel
): boolean => {
  const levels: PermissionLevel[] = ['none', 'reporter', 'viewer', 'editor', 'manager', 'owner'];
  const required = levels.indexOf(requiredLevel);
  return userRoles.some(role => {
    const config = getRoleConfig(role);
    const userLevel = levels.indexOf(config.permissions[module]);
    return userLevel >= required;
  });
};

export const getHighestSeniority = (roles: UserRole[]): RoleConfig => {
  return roles.reduce((highest, role) => {
    const config = getRoleConfig(role);
    return config.seniority > highest.seniority ? config : highest;
  }, getRoleConfig('General Manpower'));
};

export const getPrimaryView = (roles: UserRole[]): string => {
  return getHighestSeniority(roles).primaryView;
};

export const getAllRolesByGroup = (): { group: string; label: string; roles: RoleConfig[] }[] => {
  const groupOrder = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'SYSTEM'];
  const grouped = new Map<string, { label: string; roles: RoleConfig[] }>();

  Object.values(ROLE_REGISTRY).forEach(config => {
    if (!grouped.has(config.group)) {
      grouped.set(config.group, { label: config.groupLabel, roles: [] });
    }
    grouped.get(config.group)!.roles.push(config);
  });

  return groupOrder
    .filter(g => grouped.has(g))
    .map(g => ({ group: g, ...grouped.get(g)! }));
};
