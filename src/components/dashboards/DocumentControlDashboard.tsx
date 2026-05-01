'use client';
import { useState } from 'react';
import { FolderOpen, FileText, Upload, Download, Search, Clock, CheckCircle2, AlertTriangle, Filter, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const KPI = {
  totalDocs: 12847, approved: 9823, underReview: 1456, rejected: 342, pending: 1226,
  transmittals: 4823, rfi: 342, rfiOpen: 28, rfiClosed: 314,
  avgReviewDays: 8.4, overdueReview: 34,
};

const RECENT_DOCS = [
  { num: 'KLT-PIP-DWG-2847', title: 'Piping GA Drawing - Area 300 Rev.3', disc: 'Piping', rev: 'C3', status: 'approved', date: '26 Apr 26', originator: 'Worley' },
  { num: 'KLT-STR-CAL-1205', title: 'Structural Calc - Pipe Rack B Rev.2', disc: 'Structural', rev: 'B2', status: 'under_review', date: '25 Apr 26', originator: 'Technip' },
  { num: 'KLT-ELE-SLD-0892', title: 'Single Line Diagram - Substation 2', disc: 'Electrical', rev: 'A1', status: 'approved', date: '25 Apr 26', originator: 'ABB' },
  { num: 'KLT-INS-DSH-0456', title: 'Instrument Data Sheet - FT-2001', disc: 'Instrument', rev: 'B1', status: 'rejected', date: '24 Apr 26', originator: 'Yokogawa' },
  { num: 'KLT-MEC-SPE-0234', title: 'Pump Specification P-1205A/B', disc: 'Mechanical', rev: 'C1', status: 'under_review', date: '24 Apr 26', originator: 'Worley' },
  { num: 'KLT-PRO-PFD-0089', title: 'Process Flow Diagram - LNG Train', disc: 'Process', rev: 'D2', status: 'approved', date: '23 Apr 26', originator: 'Technip' },
  { num: 'KLT-CIV-DWG-0567', title: 'Foundation Detail - Tank T-105', disc: 'Civil', rev: 'B3', status: 'approved', date: '23 Apr 26', originator: 'Worley' },
];

const DISC_SUMMARY = [
  { disc: 'Piping', total: 3240, approved: 2680, review: 320, rejected: 85, pending: 155 },
  { disc: 'Structural', total: 2180, approved: 1845, review: 198, rejected: 48, pending: 89 },
  { disc: 'Electrical', total: 1890, approved: 1520, review: 212, rejected: 56, pending: 102 },
  { disc: 'Mechanical', total: 1680, approved: 1340, review: 186, rejected: 42, pending: 112 },
  { disc: 'Process', total: 1420, approved: 1210, review: 124, rejected: 38, pending: 48 },
  { disc: 'Instrument', total: 1340, approved: 985, review: 198, rejected: 45, pending: 112 },
  { disc: 'Civil', total: 1097, approved: 843, review: 118, rejected: 28, pending: 108 },
];

const TRANSMITTAL_LOG = [
  { id: 'TR-4823', from: 'Worley', to: 'Client', docs: 5, purpose: 'For Approval', date: '26 Apr 26', status: 'sent' },
  { id: 'TR-4822', from: 'ABB', to: 'PMC', docs: 3, purpose: 'For Review', date: '25 Apr 26', status: 'acknowledged' },
  { id: 'TR-4821', from: 'Client', to: 'Worley', docs: 2, purpose: 'Approved w/ Comments', date: '25 Apr 26', status: 'received' },
  { id: 'TR-4820', from: 'Technip', to: 'Client', docs: 8, purpose: 'For Information', date: '24 Apr 26', status: 'sent' },
  { id: 'TR-4819', from: 'Yokogawa', to: 'PMC', docs: 4, purpose: 'For Approval', date: '24 Apr 26', status: 'acknowledged' },
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

export default function DocumentControlDashboard() {
  const [tab, setTab] = useState<'overview' | 'register' | 'transmittals' | 'disciplines'>('overview');
  const statusColors: Record<string, string> = { approved: 'text-emerald-400', under_review: 'text-blue-400', rejected: 'text-red-400', pending: 'text-amber-400' };
  const trStatusColors: Record<string, string> = { sent: 'text-blue-400', acknowledged: 'text-emerald-400', received: 'text-cyan-400' };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2"><FolderOpen size={22} className="text-orange-400" /> Document Control Center</h1>
          <p className="text-slate-400 text-sm mt-1">Document Management | 26 Apr 2026</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="default">{KPI.underReview.toLocaleString()} Under Review</Badge>
          <Badge variant={KPI.overdueReview > 20 ? 'warning' : 'success'}>{KPI.overdueReview} Overdue</Badge>
        </div>
      </div>

      <div className="flex gap-1 bg-white/5 rounded-lg p-1">
        {(['overview', 'register', 'transmittals', 'disciplines'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={cn('px-3 py-1.5 rounded-md text-xs capitalize cursor-pointer transition-colors', tab === t ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5')}>
            {t === 'register' ? 'Doc Register' : t}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KPICard label="Total Documents" value={KPI.totalDocs.toLocaleString()} sub={`${KPI.approved.toLocaleString()} approved`} color="text-white" />
            <KPICard label="Under Review" value={KPI.underReview.toLocaleString()} sub={`Avg ${KPI.avgReviewDays} days`} color="text-blue-400" />
            <KPICard label="Open RFI" value={KPI.rfiOpen.toString()} sub={`${KPI.rfi} total RFIs`} color="text-amber-400" />
            <KPICard label="Transmittals" value={KPI.transmittals.toLocaleString()} sub="Total sent/received" color="text-cyan-400" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Document Status</h3>
              <div className="grid grid-cols-4 gap-3 text-center">
                {[['Approved', KPI.approved, 'text-emerald-400', 'bg-emerald-500/20'], ['Review', KPI.underReview, 'text-blue-400', 'bg-blue-500/20'], ['Rejected', KPI.rejected, 'text-red-400', 'bg-red-500/20'], ['Pending', KPI.pending, 'text-amber-400', 'bg-amber-500/20']].map(([l, v, c, bg]) => (
                  <div key={l as string} className={cn('rounded-lg p-3', bg as string)}>
                    <p className={cn('text-xl font-bold', c as string)}>{(v as number).toLocaleString()}</p>
                    <p className="text-xs text-slate-400">{l}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Review Performance</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm"><span className="text-slate-400">Avg Review Time</span><span className="text-white font-semibold">{KPI.avgReviewDays} days</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-400">Overdue Reviews</span><span className="text-red-400 font-semibold">{KPI.overdueReview}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-400">Approval Rate</span><span className="text-emerald-400 font-semibold">{((KPI.approved / KPI.totalDocs) * 100).toFixed(1)}%</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-400">Rejection Rate</span><span className="text-red-400 font-semibold">{((KPI.rejected / KPI.totalDocs) * 100).toFixed(1)}%</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'register' && (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5 overflow-x-auto">
          <h3 className="text-sm font-semibold text-white mb-3">Recent Documents</h3>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/10">
              {['Doc Number', 'Title', 'Discipline', 'Rev', 'Status', 'Date', 'Originator'].map(h => (
                <th key={h} className="text-left py-2 px-2 text-[10px] uppercase tracking-wider text-slate-500">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {RECENT_DOCS.map(d => (
                <tr key={d.num} className="border-b border-white/5 hover:bg-white/[0.03]">
                  <td className="py-2 px-2 text-blue-400 font-mono text-xs">{d.num}</td>
                  <td className="py-2 px-2 text-slate-300 max-w-[250px] truncate">{d.title}</td>
                  <td className="py-2 px-2 text-slate-300">{d.disc}</td>
                  <td className="py-2 px-2 text-white font-mono">{d.rev}</td>
                  <td className={cn('py-2 px-2 capitalize', statusColors[d.status])}>{d.status.replace('_', ' ')}</td>
                  <td className="py-2 px-2 text-slate-400">{d.date}</td>
                  <td className="py-2 px-2 text-slate-300">{d.originator}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'transmittals' && (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5 overflow-x-auto">
          <h3 className="text-sm font-semibold text-white mb-3">Transmittal Log</h3>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/10">
              {['TR #', 'From', 'To', 'Docs', 'Purpose', 'Date', 'Status'].map(h => (
                <th key={h} className="text-left py-2 px-2 text-[10px] uppercase tracking-wider text-slate-500">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {TRANSMITTAL_LOG.map(t => (
                <tr key={t.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                  <td className="py-2 px-2 text-blue-400 font-mono text-xs">{t.id}</td>
                  <td className="py-2 px-2 text-white">{t.from}</td>
                  <td className="py-2 px-2 text-slate-300">{t.to}</td>
                  <td className="py-2 px-2 text-white font-semibold">{t.docs}</td>
                  <td className="py-2 px-2 text-slate-300">{t.purpose}</td>
                  <td className="py-2 px-2 text-slate-400">{t.date}</td>
                  <td className={cn('py-2 px-2 capitalize', trStatusColors[t.status])}>{t.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'disciplines' && (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
          <h3 className="text-sm font-semibold text-white mb-3">Documents by Discipline</h3>
          <div className="space-y-3">
            {DISC_SUMMARY.map(d => (
              <div key={d.disc} className="border-b border-white/5 pb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white font-medium">{d.disc}</span>
                  <div className="flex gap-3 text-xs">
                    <span className="text-emerald-400">{d.approved} approved</span>
                    <span className="text-blue-400">{d.review} review</span>
                    <span className="text-slate-400">{d.total} total</span>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: `${(d.approved / d.total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
