'use client';
import { useState } from 'react';
import {
  ShieldCheck, FileText, AlertTriangle, ClipboardCheck, Eye,
  Siren, Leaf, FlaskConical, ChevronsUp, BarChart3, Activity,
  CheckCircle2, XCircle, Clock, Target
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

type Tab = 'overview' | 'ptw' | 'incidents' | 'hira' | 'inspections' | 'bbs' | 'emergency' | 'environment' | 'lifting' | 'statistics';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Overview', icon: <BarChart3 size={14} /> },
  { id: 'ptw', label: 'PTW', icon: <FileText size={14} /> },
  { id: 'incidents', label: 'Incidents', icon: <AlertTriangle size={14} /> },
  { id: 'hira', label: 'HIRA', icon: <Target size={14} /> },
  { id: 'inspections', label: 'Inspections', icon: <ClipboardCheck size={14} /> },
  { id: 'bbs', label: 'BBS', icon: <Eye size={14} /> },
  { id: 'emergency', label: 'Emergency', icon: <Siren size={14} /> },
];

// ─── KPI DATA ──────────────────────────────────────────────
const KPI = {
  ltifr: 0.00, trir: 0.42, fatality: 0, nearMiss: 23, firstAid: 8,
  manHoursWorked: 4780000, safeDays: 847, activePermits: 34,
  openIncidents: 5, overdueFinding: 12, bbsSafe: 87.3, siteCompliance: 98.2,
};

const INCIDENTS = [
  { id: 'INC-047', type: 'Near Miss', severity: 'Medium', status: 'Open', date: '25 Apr', location: 'Tank Farm', desc: 'Unsecured scaffold board at 12m elevation' },
  { id: 'INC-046', type: 'First Aid', severity: 'Low', status: 'Investigating', date: '24 Apr', location: 'Pipe Rack B', desc: 'Minor laceration from sharp edge' },
  { id: 'INC-045', type: 'Near Miss', severity: 'High', status: 'Open', date: '23 Apr', location: 'LNG Storage', desc: 'Crane load indicator malfunction' },
  { id: 'INC-044', type: 'Property Damage', severity: 'Medium', status: 'Closed', date: '22 Apr', location: 'Fab Yard', desc: 'Forklift contact with temp structure' },
  { id: 'INC-043', type: 'Near Miss', severity: 'Low', status: 'Closed', date: '20 Apr', location: 'Jetty', desc: 'Dropped object from 3m (no personnel)' },
];

const HIRA_DATA = [
  { id: 'HIRA-001', activity: 'Hot Work on LNG Piping', hazard: 'Fire/Explosion', risk: 'Extreme', residual: 'Medium', controls: 8 },
  { id: 'HIRA-002', activity: 'Confined Space Entry', hazard: 'Asphyxiation', risk: 'High', residual: 'Low', controls: 12 },
  { id: 'HIRA-003', activity: 'Crane Lifting >10T', hazard: 'Struck By/Crush', risk: 'High', residual: 'Medium', controls: 10 },
  { id: 'HIRA-004', activity: 'Excavation >1.5m', hazard: 'Cave-in', risk: 'High', residual: 'Low', controls: 7 },
  { id: 'HIRA-005', activity: 'Scaffolding Erection', hazard: 'Fall from Height', risk: 'High', residual: 'Medium', controls: 9 },
  { id: 'HIRA-006', activity: 'Chemical Handling', hazard: 'Toxic Exposure', risk: 'Medium', residual: 'Low', controls: 6 },
];

const INSPECTION_TYPES = [
  { type: 'Housekeeping', count: 89, score: 87 }, { type: 'Scaffold', count: 56, score: 92 },
  { type: 'Electrical', count: 42, score: 85 }, { type: 'Fire Safety', count: 38, score: 91 },
  { type: 'PPE Compliance', count: 65, score: 94 }, { type: 'Work at Height', count: 52, score: 88 },
];

const BBS_UNSAFE = [
  { cat: 'PPE Non-Compliance', count: 42 }, { cat: 'Body Position', count: 31 },
  { cat: 'Housekeeping', count: 28 }, { cat: 'Tools & Equipment', count: 24 },
  { cat: 'Line of Fire', count: 18 }, { cat: 'Barricading', count: 15 },
];

// ─── HELPER COMPONENTS ─────────────────────────────────────
function KPICard({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 hover:bg-white/[0.07] transition-all">
      <p className="text-[10px] text-slate-500 uppercase tracking-widest">{label}</p>
      <p className={cn('text-2xl font-bold mt-1', color)}>{value}</p>
      <p className="text-[11px] text-slate-500 mt-1">{sub}</p>
    </div>
  );
}

function SeverityBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    Extreme: 'bg-red-500/20 text-red-400 border-red-500/30',
    High: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    Medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    Low: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  };
  return <span className={cn('px-2 py-0.5 rounded text-xs border', colors[level] || colors.Low)}>{level}</span>;
}

function ProgressBar({ value, color = 'bg-blue-500', height = 'h-2' }: { value: number; color?: string; height?: string }) {
  return (
    <div className={cn('rounded-full bg-white/10', height)}>
      <div className={cn('rounded-full transition-all duration-700', height, color)} style={{ width: `${Math.min(value, 100)}%` }} />
    </div>
  );
}

// ─── TAB CONTENT ───────────────────────────────────────────
function OverviewTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPICard label="LTI Free Hours" value="4,780,000" sub="847 Safe Days" color="text-emerald-400" />
        <KPICard label="TRIR" value="0.42" sub="Target < 0.50" color="text-blue-400" />
        <KPICard label="Near Misses (MTD)" value="23" sub="+5 vs last month" color="text-amber-400" />
        <KPICard label="Active Permits" value="34" sub="12 Hot Work" color="text-red-400" />
        <KPICard label="Open Incidents" value="5" sub="2 investigating" color="text-orange-400" />
        <KPICard label="BBS Safe Acts" value="87.3%" sub="Target 90%" color="text-cyan-400" />
        <KPICard label="Overdue Findings" value="12" sub="4 critical" color="text-pink-400" />
        <KPICard label="Site Compliance" value="98.2%" sub="↑ 0.3% vs prev" color="text-violet-400" />
      </div>
      <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
        <h3 className="text-sm font-semibold text-white mb-3">Incident Trend (10 Months)</h3>
        <div className="flex items-end gap-2 h-32">
          {[5,7,4,6,3,8,5,4,6,3].map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full bg-gradient-to-t from-amber-500/60 to-amber-400/20 rounded-t transition-all" style={{ height: `${v * 12}px` }} />
              <span className="text-[9px] text-slate-500">{['Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr'][i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PTWTab() {
  const types = [
    { type: 'Hot Work', count: 12, color: 'text-red-400' }, { type: 'Confined Space', count: 5, color: 'text-orange-400' },
    { type: 'Work at Height', count: 8, color: 'text-amber-400' }, { type: 'Excavation', count: 4, color: 'text-yellow-400' },
    { type: 'Electrical', count: 3, color: 'text-blue-400' }, { type: 'General', count: 2, color: 'text-slate-400' },
  ];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPICard label="Total Issued" value="487" sub="All time" color="text-white" />
        <KPICard label="Active" value="34" sub="Currently open" color="text-emerald-400" />
        <KPICard label="Suspended" value="8" sub="Awaiting clearance" color="text-amber-400" />
        <KPICard label="Expired" value="4" sub="Needs renewal" color="text-red-400" />
      </div>
      <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
        <h3 className="text-sm font-semibold text-white mb-3">Active Permits by Type</h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {types.map(t => (
            <div key={t.type} className="rounded-lg border border-white/10 bg-white/[0.03] p-3 flex items-center justify-between">
              <span className="text-sm text-slate-300">{t.type}</span>
              <span className={cn('text-lg font-bold', t.color)}>{t.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function IncidentsTab() {
  const statusColor: Record<string, string> = { Open: 'text-amber-400', Investigating: 'text-blue-400', Closed: 'text-emerald-400' };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        <KPICard label="Total (YTD)" value="47" sub="All types" color="text-white" />
        <KPICard label="Open" value="5" sub="Action needed" color="text-amber-400" />
        <KPICard label="Investigating" value="2" sub="In progress" color="text-blue-400" />
        <KPICard label="Closed" value="40" sub="Resolved" color="text-emerald-400" />
      </div>
      <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5 overflow-x-auto">
        <h3 className="text-sm font-semibold text-white mb-3">Incident Log</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              {['ID', 'Type', 'Severity', 'Status', 'Date', 'Location', 'Description'].map(h => (
                <th key={h} className="text-left py-2 px-2 text-[10px] uppercase tracking-wider text-slate-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {INCIDENTS.map(inc => (
              <tr key={inc.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                <td className="py-2 px-2 text-blue-400 font-mono text-xs">{inc.id}</td>
                <td className="py-2 px-2 text-slate-300">{inc.type}</td>
                <td className="py-2 px-2"><SeverityBadge level={inc.severity} /></td>
                <td className={cn('py-2 px-2', statusColor[inc.status])}>{inc.status}</td>
                <td className="py-2 px-2 text-slate-400">{inc.date}</td>
                <td className="py-2 px-2 text-slate-300">{inc.location}</td>
                <td className="py-2 px-2 text-slate-400 max-w-xs truncate">{inc.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function HIRATab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        <KPICard label="Total HIRA" value="89" sub="Active assessments" color="text-white" />
        <KPICard label="Extreme Risk" value="3" sub="Requires attention" color="text-red-400" />
        <KPICard label="High Risk" value="42" sub="Controls in place" color="text-orange-400" />
        <KPICard label="Active Controls" value="847" sub="Implemented" color="text-emerald-400" />
      </div>
      <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5 overflow-x-auto">
        <h3 className="text-sm font-semibold text-white mb-3">Risk Register</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              {['ID', 'Activity', 'Hazard', 'Inherent', 'Residual', 'Controls'].map(h => (
                <th key={h} className="text-left py-2 px-2 text-[10px] uppercase tracking-wider text-slate-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HIRA_DATA.map(d => (
              <tr key={d.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                <td className="py-2 px-2 text-blue-400 font-mono text-xs">{d.id}</td>
                <td className="py-2 px-2 text-white">{d.activity}</td>
                <td className="py-2 px-2 text-slate-300">{d.hazard}</td>
                <td className="py-2 px-2"><SeverityBadge level={d.risk} /></td>
                <td className="py-2 px-2"><SeverityBadge level={d.residual} /></td>
                <td className="py-2 px-2 text-white font-semibold">{d.controls}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InspectionsTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        <KPICard label="Total Inspections" value="342" sub="Year to date" color="text-white" />
        <KPICard label="Completed" value="318" sub="93% completion" color="text-emerald-400" />
        <KPICard label="Overdue" value="12" sub="Action needed" color="text-red-400" />
        <KPICard label="Open Findings" value="36" sub="4 critical" color="text-amber-400" />
      </div>
      <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
        <h3 className="text-sm font-semibold text-white mb-3">Inspection Scores by Type</h3>
        <div className="space-y-3">
          {INSPECTION_TYPES.map(t => (
            <div key={t.type}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300">{t.type} ({t.count})</span>
                <span className={cn('font-semibold', t.score >= 90 ? 'text-emerald-400' : 'text-amber-400')}>{t.score}%</span>
              </div>
              <ProgressBar value={t.score} color={t.score >= 90 ? 'bg-emerald-500' : 'bg-amber-500'} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BBSTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        <KPICard label="Total Observations" value="1,245" sub="All time" color="text-white" />
        <KPICard label="Safe Acts" value="1,087" sub="87.3%" color="text-emerald-400" />
        <KPICard label="Unsafe Acts" value="158" sub="12.7%" color="text-red-400" />
        <KPICard label="Target" value="90%" sub="2.7% gap" color="text-cyan-400" />
      </div>
      <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
        <h3 className="text-sm font-semibold text-white mb-3">Top Unsafe Behaviors</h3>
        <div className="space-y-2">
          {BBS_UNSAFE.map((u, i) => (
            <div key={u.cat} className="flex items-center gap-3">
              <span className="text-xs text-slate-500 w-4">{i + 1}</span>
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300">{u.cat}</span>
                  <span className="text-red-400 font-semibold">{u.count}</span>
                </div>
                <ProgressBar value={(u.count / 42) * 100} color="bg-red-500/60" height="h-1.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EmergencyTab() {
  const drills = [
    { type: 'Fire Drill', done: 2, score: 92 }, { type: 'Medical Evacuation', done: 1, score: 88 },
    { type: 'Gas Leak Response', done: 1, score: 85 }, { type: 'Man Overboard', done: 1, score: 90 },
    { type: 'Tsunami Alert', done: 1, score: 87 },
  ];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        <KPICard label="Drills Done" value="6/12" sub="50% complete" color="text-blue-400" />
        <KPICard label="Avg Response" value="4.2 min" sub="Target: 5 min" color="text-emerald-400" />
        <KPICard label="Muster Points" value="8/8" sub="All functional" color="text-emerald-400" />
        <KPICard label="Fire Equipment" value="338/342" sub="4 need service" color="text-amber-400" />
      </div>
      <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
        <h3 className="text-sm font-semibold text-white mb-3">Drill Performance</h3>
        <div className="space-y-3">
          {drills.map(d => (
            <div key={d.type} className="flex items-center justify-between border-b border-white/5 pb-2">
              <div>
                <span className="text-sm text-slate-300">{d.type}</span>
                <span className="text-xs text-slate-500 ml-2">({d.done} completed)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-20"><ProgressBar value={d.score} color="bg-emerald-500" height="h-1.5" /></div>
                <span className="text-xs text-emerald-400 font-semibold w-8">{d.score}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ────────────────────────────────────────
export default function HSSEDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const tabContent: Record<Tab, React.ReactNode> = {
    overview: <OverviewTab />,
    ptw: <PTWTab />,
    incidents: <IncidentsTab />,
    hira: <HIRATab />,
    inspections: <InspectionsTab />,
    bbs: <BBSTab />,
    emergency: <EmergencyTab />,
    environment: <div className="flex items-center justify-center min-h-[40vh] text-slate-400">Environmental Management - Coming Soon</div>,
    lifting: <div className="flex items-center justify-center min-h-[40vh] text-slate-400">Lifting Operations - Coming Soon</div>,
    statistics: <div className="flex items-center justify-center min-h-[40vh] text-slate-400">HSSE Statistics - Coming Soon</div>,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck size={22} className="text-emerald-400" /> HSE INTEGRITY COMMAND
          </h1>
          <p className="text-slate-400 text-sm mt-1">HSSE Manager Dashboard | 26 Apr 2026</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="success">{KPI.safeDays} SAFE DAYS</Badge>
          <Badge variant="default">LTIFR: {KPI.ltifr.toFixed(2)}</Badge>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 flex-wrap bg-white/5 rounded-lg p-1">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-colors cursor-pointer',
              activeTab === t.id ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
            )}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {tabContent[activeTab]}
    </div>
  );
}
