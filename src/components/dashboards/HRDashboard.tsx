'use client';
import { useState } from 'react';
import { Users, UserCheck, UserX, Clock, Building, GraduationCap, Award, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const KPI = {
  totalHeadcount: 3842, expat: 124, national: 3718,
  staff: 485, labor: 3357,
  onboard: 38, offboard: 12, turnoverRate: 2.8,
  trainingHours: 12450, certExpiring: 23,
  campOccupancy: 89.4, campCapacity: 4200,
  medicalFit: 3698, medicalExpiring: 144,
};

const DEPT_HEADCOUNT = [
  { dept: 'Construction', staff: 48, labor: 1680, total: 1728, pct: 45.0 },
  { dept: 'Piping/Welding', staff: 24, labor: 620, total: 644, pct: 16.8 },
  { dept: 'Mechanical', staff: 32, labor: 412, total: 444, pct: 11.6 },
  { dept: 'Electrical', staff: 28, labor: 284, total: 312, pct: 8.1 },
  { dept: 'QC/QA', staff: 42, labor: 25, total: 67, pct: 1.7 },
  { dept: 'HSSE', staff: 38, labor: 51, total: 89, pct: 2.3 },
  { dept: 'Engineering', staff: 86, labor: 0, total: 86, pct: 2.2 },
  { dept: 'Project Management', staff: 45, labor: 0, total: 45, pct: 1.2 },
  { dept: 'Admin/Support', staff: 68, labor: 148, total: 216, pct: 5.6 },
  { dept: 'Commissioning', staff: 34, labor: 98, total: 132, pct: 3.4 },
  { dept: 'Procurement', staff: 28, labor: 12, total: 40, pct: 1.0 },
  { dept: 'Others', staff: 12, labor: 27, total: 39, pct: 1.0 },
];

const CERT_EXPIRING = [
  { name: 'Ahmad Razak', cert: 'SMAW 6G Welder', expiry: '05 May 26', dept: 'Piping', status: 'expiring_soon' },
  { name: 'Bambang S.', cert: 'Crane Operator License', expiry: '10 May 26', dept: 'Construction', status: 'expiring_soon' },
  { name: 'Rudi Hartono', cert: 'NDT Level II - UT', expiry: '12 May 26', dept: 'QC', status: 'expiring_soon' },
  { name: 'Deni Pratama', cert: 'Scaffolder Competency', expiry: '15 May 26', dept: 'Construction', status: 'expiring_soon' },
  { name: 'Agus Wijaya', cert: 'Rigger Certificate', expiry: '18 May 26', dept: 'Mechanical', status: 'expiring_soon' },
];

const MANPOWER_PLAN = [
  { month: 'Jan', plan: 3200, actual: 3150 }, { month: 'Feb', plan: 3400, actual: 3380 },
  { month: 'Mar', plan: 3600, actual: 3520 }, { month: 'Apr', plan: 3850, actual: 3842 },
  { month: 'May', plan: 4100, actual: 0 }, { month: 'Jun', plan: 4350, actual: 0 },
];

function KPICard({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-[10px] text-slate-500 uppercase tracking-widest">{label}</p>
      <p className={cn('text-2xl font-bold mt-1', color)}>{value}</p>
      <p className="text-[11px] text-slate-500 mt-1">{sub}</p>
    </div>
  );
}

export default function HRDashboard() {
  const [tab, setTab] = useState<'overview' | 'departments' | 'certifications' | 'mobilization'>('overview');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2"><Users size={22} className="text-pink-400" /> HR & Administration</h1>
          <p className="text-slate-400 text-sm mt-1">Human Resources Management | 26 Apr 2026</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="default">{KPI.totalHeadcount.toLocaleString()} Total HC</Badge>
          <Badge variant={KPI.certExpiring > 20 ? 'warning' : 'success'}>{KPI.certExpiring} Certs Expiring</Badge>
        </div>
      </div>

      <div className="flex gap-1 bg-white/5 rounded-lg p-1">
        {(['overview', 'departments', 'certifications', 'mobilization'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={cn('px-3 py-1.5 rounded-md text-xs capitalize cursor-pointer transition-colors', tab === t ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5')}>{t}</button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KPICard label="Total Headcount" value={KPI.totalHeadcount.toLocaleString()} sub={`${KPI.expat} expat, ${KPI.national.toLocaleString()} national`} color="text-white" />
            <KPICard label="Turnover Rate" value={`${KPI.turnoverRate}%`} sub={`+${KPI.onboard} / -${KPI.offboard} this month`} color="text-emerald-400" />
            <KPICard label="Training Hours" value={KPI.trainingHours.toLocaleString()} sub="This month" color="text-blue-400" />
            <KPICard label="Camp Occupancy" value={`${KPI.campOccupancy}%`} sub={`Capacity: ${KPI.campCapacity.toLocaleString()}`} color="text-amber-400" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Workforce Composition</h3>
              <div className="grid grid-cols-2 gap-3">
                {[['Staff', KPI.staff, 'text-blue-400', 'bg-blue-500/20'], ['Labor', KPI.labor, 'text-amber-400', 'bg-amber-500/20'], ['Expat', KPI.expat, 'text-violet-400', 'bg-violet-500/20'], ['National', KPI.national, 'text-emerald-400', 'bg-emerald-500/20']].map(([l, v, c, bg]) => (
                  <div key={l as string} className={cn('rounded-lg p-3 text-center', bg as string)}>
                    <p className={cn('text-xl font-bold', c as string)}>{(v as number).toLocaleString()}</p>
                    <p className="text-xs text-slate-400">{l}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Compliance Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm"><span className="text-slate-400">Medical Fitness</span><span className="text-emerald-400 font-semibold">{KPI.medicalFit.toLocaleString()} / {KPI.totalHeadcount.toLocaleString()}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-400">Medical Expiring</span><span className="text-amber-400 font-semibold">{KPI.medicalExpiring}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-400">Cert. Expiring (30d)</span><span className="text-amber-400 font-semibold">{KPI.certExpiring}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-400">Compliance Rate</span><span className="text-emerald-400 font-semibold">{((KPI.medicalFit / KPI.totalHeadcount) * 100).toFixed(1)}%</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'departments' && (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
          <h3 className="text-sm font-semibold text-white mb-3">Headcount by Department</h3>
          <div className="space-y-2">
            {DEPT_HEADCOUNT.map(d => (
              <div key={d.dept} className="flex items-center gap-3">
                <span className="text-sm text-slate-300 w-36 shrink-0">{d.dept}</span>
                <div className="flex-1 h-2 rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-blue-500/60" style={{ width: `${d.pct * 2}%` }} />
                </div>
                <span className="text-xs text-white font-semibold w-14 text-right">{d.total.toLocaleString()}</span>
                <span className="text-xs text-slate-500 w-10">{d.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'certifications' && (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5 overflow-x-auto">
          <h3 className="text-sm font-semibold text-white mb-3">Certifications Expiring Soon</h3>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/10">
              {['Name', 'Certification', 'Department', 'Expiry Date', 'Status'].map(h => (
                <th key={h} className="text-left py-2 px-2 text-[10px] uppercase tracking-wider text-slate-500">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {CERT_EXPIRING.map(c => (
                <tr key={c.name} className="border-b border-white/5 hover:bg-white/[0.03]">
                  <td className="py-2 px-2 text-white">{c.name}</td>
                  <td className="py-2 px-2 text-slate-300">{c.cert}</td>
                  <td className="py-2 px-2 text-slate-300">{c.dept}</td>
                  <td className="py-2 px-2 text-amber-400">{c.expiry}</td>
                  <td className="py-2 px-2"><Badge variant="warning">Expiring Soon</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'mobilization' && (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Manpower Mobilization Plan vs Actual</h3>
          <div className="flex items-end gap-3 h-40">
            {MANPOWER_PLAN.map(d => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex gap-1 items-end" style={{ height: `${d.plan * 0.032}px` }}>
                  <div className="flex-1 bg-blue-500/30 rounded-t" style={{ height: `${d.plan * 0.032}px` }} />
                  {d.actual > 0 && <div className="flex-1 bg-emerald-500/50 rounded-t" style={{ height: `${d.actual * 0.032}px` }} />}
                </div>
                <span className="text-[9px] text-slate-500">{d.month}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-3 text-[10px] text-slate-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-blue-500/50" />Planned</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-500/50" />Actual</span>
          </div>
        </div>
      )}
    </div>
  );
}
