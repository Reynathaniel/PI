'use client';
import { useState } from 'react';
import { Ruler, FileText, CheckCircle2, AlertTriangle, Clock, Target, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const KPI = {
  totalDeliverables: 2840, issued: 2156, inProgress: 498, notStarted: 186,
  overallProgress: 75.9, planned: 78.4, variance: -2.5,
  ifc: 1845, ifcTarget: 2200, ifcPct: 83.9,
  mto: 892, mtoCompleted: 756,
  tq: 428, tqOpen: 34, tqClosed: 394,
};

const DISC_PROGRESS = [
  { disc: 'Process', deliverables: 320, issued: 298, progress: 93.1, weight: 12 },
  { disc: 'Piping', deliverables: 680, issued: 498, progress: 73.2, weight: 24 },
  { disc: 'Structural', deliverables: 420, issued: 356, progress: 84.8, weight: 15 },
  { disc: 'Mechanical', deliverables: 380, issued: 278, progress: 73.2, weight: 14 },
  { disc: 'Electrical', deliverables: 340, issued: 268, progress: 78.8, weight: 12 },
  { disc: 'Instrumentation', deliverables: 310, issued: 212, progress: 68.4, weight: 11 },
  { disc: 'Civil', deliverables: 240, issued: 168, progress: 70.0, weight: 8 },
  { disc: 'HSE', deliverables: 150, issued: 78, progress: 52.0, weight: 4 },
];

const MILESTONES = [
  { id: 'EM-001', desc: 'Process Design Basis - IFC', target: '15 Jan 26', actual: '12 Jan 26', status: 'completed', variance: '+3d' },
  { id: 'EM-002', desc: 'P&ID - Issued for Construction', target: '28 Feb 26', actual: '05 Mar 26', status: 'completed', variance: '-5d' },
  { id: 'EM-003', desc: 'Piping 60% Model Review', target: '30 Mar 26', actual: '02 Apr 26', status: 'completed', variance: '-3d' },
  { id: 'EM-004', desc: 'Electrical SLD - IFC', target: '15 Apr 26', actual: '15 Apr 26', status: 'completed', variance: '0d' },
  { id: 'EM-005', desc: 'Piping Isometrics 80% IFC', target: '15 May 26', actual: '-', status: 'in_progress', variance: 'On track' },
  { id: 'EM-006', desc: 'Structural Detail Dwg 100%', target: '30 May 26', actual: '-', status: 'in_progress', variance: 'At risk' },
  { id: 'EM-007', desc: 'Instrumentation IFC 90%', target: '30 Jun 26', actual: '-', status: 'not_started', variance: '-' },
];

const TQ_LOG = [
  { id: 'TQ-428', from: 'Construction', disc: 'Piping', subject: 'Pipe support detail at Rack B junction', status: 'open', days: 3, priority: 'High' },
  { id: 'TQ-427', from: 'Procurement', disc: 'Mechanical', subject: 'Pump motor rating confirmation P-1205', status: 'open', days: 5, priority: 'Medium' },
  { id: 'TQ-426', from: 'Construction', disc: 'Structural', subject: 'Steel connection detail at elevation +12m', status: 'open', days: 7, priority: 'High' },
  { id: 'TQ-425', from: 'QC', disc: 'Piping', subject: 'Weld procedure clarification for SS316L', status: 'closed', days: 4, priority: 'Medium' },
  { id: 'TQ-424', from: 'Construction', disc: 'Electrical', subject: 'Cable tray routing conflict Area 200', status: 'closed', days: 2, priority: 'Low' },
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

export default function EngineeringDashboard() {
  const [tab, setTab] = useState<'overview' | 'disciplines' | 'milestones' | 'tq'>('overview');
  const statusColors: Record<string, string> = { completed: 'text-emerald-400', in_progress: 'text-blue-400', not_started: 'text-slate-400', delayed: 'text-red-400' };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2"><Ruler size={22} className="text-indigo-400" /> Engineering Center</h1>
          <p className="text-slate-400 text-sm mt-1">Design & Engineering Management | 26 Apr 2026</p>
        </div>
        <div className="flex gap-2">
          <Badge variant={KPI.variance >= 0 ? 'success' : 'warning'}>Variance: {KPI.variance}%</Badge>
          <Badge variant="default">{KPI.tqOpen} Open TQ</Badge>
        </div>
      </div>

      <div className="flex gap-1 bg-white/5 rounded-lg p-1">
        {(['overview', 'disciplines', 'milestones', 'tq'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={cn('px-3 py-1.5 rounded-md text-xs uppercase cursor-pointer transition-colors', tab === t ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5')}>
            {t === 'tq' ? 'Tech Queries' : t}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KPICard label="Overall Progress" value={`${KPI.overallProgress}%`} sub={`Planned: ${KPI.planned}%`} color="text-white" />
            <KPICard label="IFC Issued" value={`${KPI.ifc}/${KPI.ifcTarget}`} sub={`${KPI.ifcPct}% complete`} color="text-emerald-400" />
            <KPICard label="MTO Status" value={`${KPI.mtoCompleted}/${KPI.mto}`} sub={`${((KPI.mtoCompleted / KPI.mto) * 100).toFixed(0)}% finalized`} color="text-blue-400" />
            <KPICard label="Tech Queries" value={KPI.tqOpen.toString()} sub={`${KPI.tq} total TQs`} color="text-amber-400" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Deliverable Status</h3>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[['Issued', KPI.issued, 'text-emerald-400', 'bg-emerald-500/20'], ['In Progress', KPI.inProgress, 'text-blue-400', 'bg-blue-500/20'], ['Not Started', KPI.notStarted, 'text-slate-400', 'bg-slate-500/20']].map(([l, v, c, bg]) => (
                  <div key={l as string} className={cn('rounded-lg p-3', bg as string)}>
                    <p className={cn('text-xl font-bold', c as string)}>{(v as number).toLocaleString()}</p>
                    <p className="text-xs text-slate-400">{l}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
              <h3 className="text-sm font-semibold text-white mb-3">S-Curve Progress</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1"><span className="text-slate-400">Planned</span><span className="text-blue-400">{KPI.planned}%</span></div>
                  <div className="h-2 rounded-full bg-white/10"><div className="h-full rounded-full bg-blue-500/60" style={{ width: `${KPI.planned}%` }} /></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1"><span className="text-slate-400">Actual</span><span className="text-emerald-400">{KPI.overallProgress}%</span></div>
                  <div className="h-2 rounded-full bg-white/10"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${KPI.overallProgress}%` }} /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'disciplines' && (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
          <h3 className="text-sm font-semibold text-white mb-3">Engineering Progress by Discipline</h3>
          <div className="space-y-3">
            {DISC_PROGRESS.map(d => (
              <div key={d.disc} className="border-b border-white/5 pb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white font-medium">{d.disc}</span>
                  <div className="flex gap-3 text-xs">
                    <span className="text-emerald-400">{d.issued} issued</span>
                    <span className="text-slate-400">{d.deliverables} total</span>
                    <span className={cn('font-semibold', d.progress >= 80 ? 'text-emerald-400' : d.progress >= 60 ? 'text-amber-400' : 'text-red-400')}>{d.progress}%</span>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div className={cn('h-full rounded-full', d.progress >= 80 ? 'bg-emerald-500' : d.progress >= 60 ? 'bg-amber-500' : 'bg-red-500')} style={{ width: `${d.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'milestones' && (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5 overflow-x-auto">
          <h3 className="text-sm font-semibold text-white mb-3">Engineering Milestones</h3>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/10">
              {['ID', 'Description', 'Target', 'Actual', 'Status', 'Variance'].map(h => (
                <th key={h} className="text-left py-2 px-2 text-[10px] uppercase tracking-wider text-slate-500">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {MILESTONES.map(m => (
                <tr key={m.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                  <td className="py-2 px-2 text-blue-400 font-mono text-xs">{m.id}</td>
                  <td className="py-2 px-2 text-slate-300">{m.desc}</td>
                  <td className="py-2 px-2 text-slate-400">{m.target}</td>
                  <td className="py-2 px-2 text-white">{m.actual}</td>
                  <td className={cn('py-2 px-2 capitalize', statusColors[m.status])}>{m.status.replace('_', ' ')}</td>
                  <td className={cn('py-2 px-2 font-mono text-xs', m.variance.includes('+') ? 'text-emerald-400' : m.variance.includes('-') ? 'text-red-400' : 'text-slate-400')}>{m.variance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'tq' && (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5 overflow-x-auto">
          <h3 className="text-sm font-semibold text-white mb-3">Technical Queries</h3>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/10">
              {['TQ #', 'From', 'Discipline', 'Subject', 'Priority', 'Days Open', 'Status'].map(h => (
                <th key={h} className="text-left py-2 px-2 text-[10px] uppercase tracking-wider text-slate-500">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {TQ_LOG.map(t => (
                <tr key={t.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                  <td className="py-2 px-2 text-blue-400 font-mono text-xs">{t.id}</td>
                  <td className="py-2 px-2 text-slate-300">{t.from}</td>
                  <td className="py-2 px-2 text-slate-300">{t.disc}</td>
                  <td className="py-2 px-2 text-slate-300 max-w-[250px] truncate">{t.subject}</td>
                  <td className="py-2 px-2"><Badge variant={t.priority === 'High' ? 'destructive' : t.priority === 'Medium' ? 'warning' : 'default'}>{t.priority}</Badge></td>
                  <td className="py-2 px-2 text-white">{t.days}</td>
                  <td className={cn('py-2 px-2 capitalize', t.status === 'open' ? 'text-amber-400' : 'text-emerald-400')}>{t.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
