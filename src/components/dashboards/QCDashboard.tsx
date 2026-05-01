'use client';
import { useState } from 'react';
import { ClipboardCheck, AlertTriangle, CheckCircle2, XCircle, FileText, Flame, Search, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const KPI = {
  totalInspections: 4823, passed: 4512, failed: 198, pending: 113,
  passRate: 95.8, ncrOpen: 14, ncrClosed: 89, ncrTotal: 103,
  weldJoints: 12480, weldAccepted: 12148, weldRepair: 284, weldReject: 48,
  weldRepairRate: 2.27, ndtCompleted: 8940, itpCompleted: 342, itpTotal: 480,
};

const NCR_LIST = [
  { id: 'NCR-089', desc: 'Weld defect on P-1205 joint W-342', discipline: 'Piping', severity: 'Major', status: 'open', date: '25 Apr 26', responsible: 'Welding QC' },
  { id: 'NCR-088', desc: 'Concrete cover insufficient at FDN-45', discipline: 'Civil', severity: 'Minor', status: 'open', date: '24 Apr 26', responsible: 'Civil QC' },
  { id: 'NCR-087', desc: 'Missing torque records for flange F-892', discipline: 'Mechanical', severity: 'Minor', status: 'open', date: '23 Apr 26', responsible: 'Mech QC' },
  { id: 'NCR-086', desc: 'Paint DFT below minimum spec on Rack B', discipline: 'Painting', severity: 'Major', status: 'investigating', date: '22 Apr 26', responsible: 'Coating QC' },
  { id: 'NCR-085', desc: 'Cable termination not per drawing CB-102', discipline: 'Electrical', severity: 'Minor', status: 'closed', date: '20 Apr 26', responsible: 'E&I QC' },
];

const WELD_SUMMARY = [
  { process: 'SMAW', joints: 4200, accepted: 4098, repair: 92, reject: 10 },
  { process: 'GTAW', joints: 3800, accepted: 3740, repair: 48, reject: 12 },
  { process: 'FCAW', joints: 2480, accepted: 2412, repair: 56, reject: 12 },
  { process: 'SAW', joints: 2000, accepted: 1898, repair: 88, reject: 14 },
];

const ITP_STATUS = [
  { disc: 'Piping', total: 148, done: 112, overdue: 4 },
  { disc: 'Structural', total: 98, done: 82, overdue: 2 },
  { disc: 'Mechanical', total: 86, done: 58, overdue: 3 },
  { disc: 'Electrical', total: 72, done: 48, overdue: 1 },
  { disc: 'Instrumentation', total: 48, done: 28, overdue: 0 },
  { disc: 'Painting/Coating', total: 28, done: 14, overdue: 2 },
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

export default function QCDashboard() {
  const [tab, setTab] = useState<'overview' | 'ncr' | 'welding' | 'itp'>('overview');
  const sevColors: Record<string, string> = { Major: 'destructive', Minor: 'warning', Critical: 'destructive' };
  const statusColors: Record<string, string> = { open: 'text-amber-400', investigating: 'text-blue-400', closed: 'text-emerald-400' };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2"><ClipboardCheck size={22} className="text-cyan-400" /> Quality Control Center</h1>
          <p className="text-slate-400 text-sm mt-1">QC/QA Management | 26 Apr 2026</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="success">Pass Rate: {KPI.passRate}%</Badge>
          <Badge variant={KPI.ncrOpen > 10 ? 'warning' : 'success'}>{KPI.ncrOpen} Open NCR</Badge>
        </div>
      </div>

      <div className="flex gap-1 bg-white/5 rounded-lg p-1">
        {(['overview', 'ncr', 'welding', 'itp'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={cn('px-3 py-1.5 rounded-md text-xs uppercase cursor-pointer transition-colors', tab === t ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5')}>
            {t === 'itp' ? 'ITP Status' : t}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KPICard label="Inspections" value={KPI.totalInspections.toLocaleString()} sub={`${KPI.passRate}% pass rate`} color="text-white" />
            <KPICard label="Open NCRs" value={KPI.ncrOpen.toString()} sub={`${KPI.ncrTotal} total YTD`} color="text-amber-400" />
            <KPICard label="Weld Joints" value={KPI.weldJoints.toLocaleString()} sub={`${KPI.weldRepairRate}% repair rate`} color="text-cyan-400" />
            <KPICard label="ITP Progress" value={`${KPI.itpCompleted}/${KPI.itpTotal}`} sub={`${((KPI.itpCompleted/KPI.itpTotal)*100).toFixed(0)}% completed`} color="text-blue-400" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Inspection Results</h3>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[['Passed', KPI.passed, 'text-emerald-400', 'bg-emerald-500/20'], ['Failed', KPI.failed, 'text-red-400', 'bg-red-500/20'], ['Pending', KPI.pending, 'text-amber-400', 'bg-amber-500/20']].map(([l, v, c, bg]) => (
                  <div key={l as string} className={cn('rounded-lg p-3', bg as string)}>
                    <p className={cn('text-xl font-bold', c as string)}>{(v as number).toLocaleString()}</p>
                    <p className="text-xs text-slate-400">{l}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Weld Summary</h3>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[['Accepted', KPI.weldAccepted, 'text-emerald-400'], ['Repair', KPI.weldRepair, 'text-amber-400'], ['Rejected', KPI.weldReject, 'text-red-400']].map(([l, v, c]) => (
                  <div key={l as string} className="rounded-lg border border-white/10 p-3">
                    <p className={cn('text-xl font-bold', c as string)}>{(v as number).toLocaleString()}</p>
                    <p className="text-xs text-slate-400">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'ncr' && (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5 overflow-x-auto">
          <h3 className="text-sm font-semibold text-white mb-3">Non-Conformance Reports</h3>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/10">
              {['NCR #', 'Description', 'Discipline', 'Severity', 'Status', 'Date', 'Responsible'].map(h => (
                <th key={h} className="text-left py-2 px-2 text-[10px] uppercase tracking-wider text-slate-500">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {NCR_LIST.map(n => (
                <tr key={n.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                  <td className="py-2 px-2 text-blue-400 font-mono text-xs">{n.id}</td>
                  <td className="py-2 px-2 text-slate-300 max-w-[250px] truncate">{n.desc}</td>
                  <td className="py-2 px-2 text-slate-300">{n.discipline}</td>
                  <td className="py-2 px-2"><Badge variant={sevColors[n.severity] as 'destructive' | 'warning'}>{n.severity}</Badge></td>
                  <td className={cn('py-2 px-2 capitalize', statusColors[n.status])}>{n.status}</td>
                  <td className="py-2 px-2 text-slate-400">{n.date}</td>
                  <td className="py-2 px-2 text-slate-300">{n.responsible}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'welding' && (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5 overflow-x-auto">
          <h3 className="text-sm font-semibold text-white mb-3">Welding Log by Process</h3>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/10">
              {['Process', 'Total Joints', 'Accepted', 'Repair', 'Rejected', 'Repair Rate'].map(h => (
                <th key={h} className="text-left py-2 px-2 text-[10px] uppercase tracking-wider text-slate-500">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {WELD_SUMMARY.map(w => (
                <tr key={w.process} className="border-b border-white/5 hover:bg-white/[0.03]">
                  <td className="py-2 px-2 text-white font-semibold">{w.process}</td>
                  <td className="py-2 px-2 text-slate-300">{w.joints.toLocaleString()}</td>
                  <td className="py-2 px-2 text-emerald-400">{w.accepted.toLocaleString()}</td>
                  <td className="py-2 px-2 text-amber-400">{w.repair}</td>
                  <td className="py-2 px-2 text-red-400">{w.reject}</td>
                  <td className="py-2 px-2 text-slate-300">{((w.repair/w.joints)*100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'itp' && (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
          <h3 className="text-sm font-semibold text-white mb-3">Inspection Test Plan Status</h3>
          <div className="space-y-3">
            {ITP_STATUS.map(itp => (
              <div key={itp.disc} className="border-b border-white/5 pb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white">{itp.disc}</span>
                  <div className="flex gap-3 text-xs">
                    <span className="text-emerald-400">{itp.done} done</span>
                    {itp.overdue > 0 && <span className="text-red-400">{itp.overdue} overdue</span>}
                    <span className="text-slate-400">{itp.total} total</span>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: `${(itp.done/itp.total)*100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
