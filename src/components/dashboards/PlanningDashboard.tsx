'use client';
import { useState } from 'react';
import {
  GanttChart, TrendingUp, Calendar, AlertTriangle, Activity,
  BarChart3, Clock, CheckCircle2, Target, Flag, Timer
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

// ─── DATA ──────────────────────────────────────────────────
const KPI = {
  spi: 0.94, cpi: 1.02, progress: 38.2, planned: 40.6,
  bac: 2400, ev: 916.8, pv: 974.4, ac: 898.8,
  sv: -57.6, cv: 18.0, eac: 2352.9, vac: 47.1,
  totalActivities: 12847, completed: 4912, inProgress: 1823, notStarted: 6112,
  critical: 342, nearCritical: 518, delayDays: 44,
};

const SCURVE = [
  { m: 'Jan 25', p: 0, e: 0 }, { m: 'Apr 25', p: 3, e: 2.8 },
  { m: 'Jul 25', p: 8, e: 7.5 }, { m: 'Oct 25', p: 15, e: 14.2 },
  { m: 'Jan 26', p: 24, e: 22.8 }, { m: 'Apr 26', p: 40.6, e: 38.2 },
];

const MILESTONES = [
  { id: 'M-08', name: 'Foundation Complete', planned: '15 Mar 26', actual: '12 Mar 26', status: 'achieved', variance: '+3d' },
  { id: 'M-09', name: 'Steel Structure 50%', planned: '01 Apr 26', actual: '05 Apr 26', status: 'achieved', variance: '-4d' },
  { id: 'M-10', name: 'Mechanical Equipment Received', planned: '15 Apr 26', actual: '18 Apr 26', status: 'achieved', variance: '-3d' },
  { id: 'M-11', name: 'Piping 30% Complete', planned: '30 Apr 26', actual: '-', status: 'at_risk', variance: '-5d' },
  { id: 'M-12', name: 'E&I Bulk Install Start', planned: '15 May 26', actual: '-', status: 'on_track', variance: '0d' },
  { id: 'M-13', name: 'Pre-Commissioning Start', planned: '01 Sep 26', actual: '-', status: 'on_track', variance: '0d' },
];

const DISCIPLINES = [
  { name: 'Civil/Structural', planned: 62.0, actual: 58.4, weight: 22 },
  { name: 'Mechanical', planned: 35.0, actual: 33.1, weight: 28 },
  { name: 'Piping', planned: 28.0, actual: 25.2, weight: 25 },
  { name: 'Electrical', planned: 18.0, actual: 17.5, weight: 12 },
  { name: 'Instrumentation', planned: 12.0, actual: 11.8, weight: 8 },
  { name: 'Insulation/Painting', planned: 5.0, actual: 4.2, weight: 5 },
];

// ─── HELPERS ───────────────────────────────────────────────
function KPICard({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 hover:bg-white/[0.07] transition-all">
      <p className="text-[10px] text-slate-500 uppercase tracking-widest">{label}</p>
      <p className={cn('text-2xl font-bold mt-1', color)}>{value}</p>
      <p className="text-[11px] text-slate-500 mt-1">{sub}</p>
    </div>
  );
}

function ProgressBar({ value, color = 'bg-blue-500' }: { value: number; color?: string }) {
  return (
    <div className="h-2 rounded-full bg-white/10">
      <div className={cn('h-full rounded-full transition-all duration-700', color)} style={{ width: `${Math.min(value, 100)}%` }} />
    </div>
  );
}

// ─── MAIN ──────────────────────────────────────────────────
export default function PlanningDashboard() {
  const [tab, setTab] = useState<'overview' | 'milestones' | 'disciplines' | 'evm'>('overview');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <GanttChart size={22} className="text-blue-400" /> SCHEDULE COMMAND CENTER
          </h1>
          <p className="text-slate-400 text-sm mt-1">Planning & Scheduling | Data Date: 26 Apr 2026</p>
        </div>
        <div className="flex gap-2">
          <Badge variant={KPI.spi < 1 ? 'warning' : 'success'}>SPI: {KPI.spi}</Badge>
          <Badge variant="success">CPI: {KPI.cpi}</Badge>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 rounded-lg p-1">
        {(['overview', 'milestones', 'disciplines', 'evm'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={cn('px-3 py-1.5 rounded-md text-xs capitalize cursor-pointer transition-colors',
              tab === t ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5')}>
            {t === 'evm' ? 'EVM Analysis' : t}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KPICard label="Overall Progress" value={`${KPI.progress}%`} sub={`Planned: ${KPI.planned}%`} color="text-blue-400" />
            <KPICard label="Schedule Variance" value={`${KPI.sv}M`} sub={`${KPI.delayDays} days behind`} color="text-amber-400" />
            <KPICard label="Critical Activities" value={KPI.critical.toString()} sub={`of ${KPI.totalActivities.toLocaleString()} total`} color="text-red-400" />
            <KPICard label="Forecast Finish" value="28 Jan 2028" sub="vs 15 Dec 2027 baseline" color="text-orange-400" />
          </div>

          {/* S-Curve */}
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
            <h3 className="text-sm font-semibold text-white mb-4">S-Curve Progress</h3>
            <div className="flex items-end gap-2 h-40">
              {SCURVE.map(d => (
                <div key={d.m} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex gap-px items-end" style={{ height: `${Math.max(d.p, d.e) * 3.2}px` }}>
                    <div className="flex-1 bg-blue-500/30 rounded-t" style={{ height: `${d.p * 3.2}px` }} />
                    <div className="flex-1 bg-emerald-500/50 rounded-t" style={{ height: `${d.e * 3.2}px` }} />
                  </div>
                  <span className="text-[8px] text-slate-500">{d.m}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-3 text-[10px] text-slate-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-blue-500/50" />Planned</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-500/50" />Earned</span>
            </div>
          </div>

          {/* Activity Summary */}
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Activity Status</h3>
            <div className="space-y-3">
              {[
                ['Completed', KPI.completed.toLocaleString(), 'bg-emerald-500', (KPI.completed / KPI.totalActivities) * 100],
                ['In Progress', KPI.inProgress.toLocaleString(), 'bg-blue-500', (KPI.inProgress / KPI.totalActivities) * 100],
                ['Not Started', KPI.notStarted.toLocaleString(), 'bg-slate-500', (KPI.notStarted / KPI.totalActivities) * 100],
              ].map(([label, val, color, pct]) => (
                <div key={label as string}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">{label}</span>
                    <span className="text-white font-semibold">{val} ({(pct as number).toFixed(1)}%)</span>
                  </div>
                  <ProgressBar value={pct as number} color={color as string} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Milestones Tab */}
      {tab === 'milestones' && (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5 overflow-x-auto">
          <h3 className="text-sm font-semibold text-white mb-3">Key Milestones</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                {['ID', 'Milestone', 'Planned', 'Actual', 'Status', 'Variance'].map(h => (
                  <th key={h} className="text-left py-2 px-2 text-[10px] uppercase tracking-wider text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MILESTONES.map(m => {
                const statusColors: Record<string, string> = {
                  achieved: 'text-emerald-400', at_risk: 'text-amber-400', on_track: 'text-blue-400', delayed: 'text-red-400',
                };
                return (
                  <tr key={m.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                    <td className="py-2 px-2 text-blue-400 font-mono text-xs">{m.id}</td>
                    <td className="py-2 px-2 text-white">{m.name}</td>
                    <td className="py-2 px-2 text-slate-400">{m.planned}</td>
                    <td className="py-2 px-2 text-slate-300">{m.actual}</td>
                    <td className={cn('py-2 px-2 capitalize', statusColors[m.status])}>{m.status.replace('_', ' ')}</td>
                    <td className={cn('py-2 px-2 font-mono', m.variance.startsWith('+') ? 'text-emerald-400' : m.variance.startsWith('-') ? 'text-red-400' : 'text-slate-400')}>{m.variance}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Disciplines Tab */}
      {tab === 'disciplines' && (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Progress by Discipline</h3>
          <div className="space-y-4">
            {DISCIPLINES.map(d => {
              const variance = d.actual - d.planned;
              return (
                <div key={d.name} className="border-b border-white/5 pb-3">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white font-medium">{d.name} <span className="text-slate-500 text-xs">({d.weight}% weight)</span></span>
                    <div className="flex gap-4 text-xs">
                      <span className="text-blue-400">Plan: {d.planned}%</span>
                      <span className="text-emerald-400">Actual: {d.actual}%</span>
                      <span className={variance >= 0 ? 'text-emerald-400' : 'text-red-400'}>{variance >= 0 ? '+' : ''}{variance.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="relative h-3 rounded-full bg-white/10">
                    <div className="absolute h-full rounded-full bg-blue-500/30" style={{ width: `${d.planned}%` }} />
                    <div className="absolute h-full rounded-full bg-emerald-500/70" style={{ width: `${d.actual}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* EVM Tab */}
      {tab === 'evm' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Earned Value Summary (USD Millions)</h3>
            <div className="space-y-2 text-sm">
              {[
                ['BAC (Budget at Completion)', `${KPI.bac.toFixed(1)}`, 'text-white'],
                ['EV (Earned Value / BCWP)', `${KPI.ev.toFixed(1)}`, 'text-emerald-400'],
                ['PV (Planned Value / BCWS)', `${KPI.pv.toFixed(1)}`, 'text-blue-400'],
                ['AC (Actual Cost / ACWP)', `${KPI.ac.toFixed(1)}`, 'text-amber-400'],
                ['SV (Schedule Variance)', `${KPI.sv.toFixed(1)}`, 'text-red-400'],
                ['CV (Cost Variance)', `+${KPI.cv.toFixed(1)}`, 'text-emerald-400'],
                ['EAC (Estimate at Completion)', `${KPI.eac.toFixed(1)}`, 'text-cyan-400'],
                ['VAC (Variance at Completion)', `+${KPI.vac.toFixed(1)}`, 'text-emerald-400'],
              ].map(([label, val, color]) => (
                <div key={label} className="flex justify-between border-b border-white/5 pb-1.5">
                  <span className="text-slate-400">{label}</span>
                  <span className={cn('font-mono font-semibold', color)}>{val}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Performance Indices</h3>
            <div className="space-y-4">
              {[
                { label: 'SPI (Schedule Performance Index)', value: KPI.spi, target: 1.0 },
                { label: 'CPI (Cost Performance Index)', value: KPI.cpi, target: 1.0 },
                { label: 'TCPI (To Complete PI)', value: 1.04, target: 1.0 },
              ].map(idx => (
                <div key={idx.label}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300">{idx.label}</span>
                    <span className={cn('font-bold', idx.value >= idx.target ? 'text-emerald-400' : 'text-amber-400')}>{idx.value.toFixed(2)}</span>
                  </div>
                  <div className="relative h-3 rounded-full bg-white/10">
                    <div className={cn('h-full rounded-full', idx.value >= idx.target ? 'bg-emerald-500' : 'bg-amber-500')}
                      style={{ width: `${Math.min(idx.value * 50, 100)}%` }} />
                    <div className="absolute top-0 h-full w-0.5 bg-white/40" style={{ left: '50%' }} title="Target: 1.0" />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-3 rounded-lg bg-white/[0.04] border border-white/10">
              <p className="text-xs text-slate-400">
                <span className="text-white font-semibold">Analysis:</span> Project is behind schedule (SPI 0.94) but under budget (CPI 1.02).
                Cost savings partially offset schedule delay. EAC indicates USD 47.1M savings vs BAC.
                Critical path requires acceleration to recover 44-day delay.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
