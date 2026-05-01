'use client';
import { useState } from 'react';
import { Wrench, CheckCircle2, AlertTriangle, Clock, Zap, Thermometer, Droplets, Wind } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const KPI = {
  totalSystems: 186, precomm: 42, commissioned: 28, readyForComm: 14,
  completionPct: 15.1, mechanicalCompletion: 38.2,
  punchA: 124, punchB: 892, punchC: 2340,
  punchAClosed: 86, punchBClosed: 645, punchCClosed: 1890,
  checksheets: 4280, checksheetsComplete: 1245,
};

const SYSTEMS = [
  { sys: 'SYS-001', desc: 'Instrument Air System', subsys: 4, mc: 95, precomm: 80, comm: 0, status: 'precomm', punchA: 0, punchB: 4 },
  { sys: 'SYS-002', desc: 'Firewater System', subsys: 6, mc: 92, precomm: 65, comm: 0, status: 'precomm', punchA: 2, punchB: 8 },
  { sys: 'SYS-003', desc: 'Cooling Water System', subsys: 5, mc: 88, precomm: 40, comm: 0, status: 'precomm', punchA: 3, punchB: 12 },
  { sys: 'SYS-004', desc: 'Power Distribution 6.6kV', subsys: 8, mc: 78, precomm: 20, comm: 0, status: 'mc', punchA: 5, punchB: 18 },
  { sys: 'SYS-005', desc: 'LNG Storage Tank T-101', subsys: 3, mc: 65, precomm: 0, comm: 0, status: 'mc', punchA: 8, punchB: 24 },
  { sys: 'SYS-006', desc: 'BOG Compressor', subsys: 4, mc: 52, precomm: 0, comm: 0, status: 'construction', punchA: 12, punchB: 32 },
  { sys: 'SYS-007', desc: 'LNG Liquefaction Train', subsys: 12, mc: 35, precomm: 0, comm: 0, status: 'construction', punchA: 18, punchB: 45 },
];

const MC_BY_AREA = [
  { area: 'Utilities', systems: 24, mc: 82, precomm: 45 },
  { area: 'Tank Farm', systems: 12, mc: 65, precomm: 10 },
  { area: 'Process Area', systems: 48, mc: 42, precomm: 5 },
  { area: 'Jetty/Marine', systems: 18, mc: 38, precomm: 0 },
  { area: 'Electrical', systems: 32, mc: 55, precomm: 15 },
  { area: 'Control Systems', systems: 28, mc: 48, precomm: 8 },
  { area: 'Offsite/Flare', systems: 24, mc: 30, precomm: 0 },
];

const PUNCH_TREND = [
  { week: 'W13', raised: 145, closed: 120 },
  { week: 'W14', raised: 168, closed: 142 },
  { week: 'W15', raised: 182, closed: 165 },
  { week: 'W16', raised: 156, closed: 178 },
  { week: 'W17', raised: 142, closed: 190 },
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

export default function CommissioningDashboard() {
  const [tab, setTab] = useState<'overview' | 'systems' | 'punch' | 'areas'>('overview');
  const statusColors: Record<string, string> = { commissioned: 'text-emerald-400', precomm: 'text-blue-400', mc: 'text-amber-400', construction: 'text-slate-400' };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2"><Wrench size={22} className="text-teal-400" /> Commissioning Center</h1>
          <p className="text-slate-400 text-sm mt-1">Pre-Commissioning & Commissioning | 26 Apr 2026</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="default">MC: {KPI.mechanicalCompletion}%</Badge>
          <Badge variant={KPI.punchA - KPI.punchAClosed > 30 ? 'destructive' : 'warning'}>{KPI.punchA - KPI.punchAClosed} Punch A Open</Badge>
        </div>
      </div>

      <div className="flex gap-1 bg-white/5 rounded-lg p-1">
        {(['overview', 'systems', 'punch', 'areas'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={cn('px-3 py-1.5 rounded-md text-xs capitalize cursor-pointer transition-colors', tab === t ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5')}>
            {t === 'punch' ? 'Punch List' : t === 'areas' ? 'MC by Area' : t}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KPICard label="Total Systems" value={KPI.totalSystems.toString()} sub={`${KPI.commissioned} commissioned`} color="text-white" />
            <KPICard label="Mech. Completion" value={`${KPI.mechanicalCompletion}%`} sub="Overall MC progress" color="text-amber-400" />
            <KPICard label="Pre-Commissioning" value={KPI.precomm.toString()} sub={`${KPI.readyForComm} ready for comm`} color="text-blue-400" />
            <KPICard label="Checksheets" value={`${KPI.checksheetsComplete}/${KPI.checksheets}`} sub={`${((KPI.checksheetsComplete / KPI.checksheets) * 100).toFixed(0)}% complete`} color="text-cyan-400" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
              <h3 className="text-sm font-semibold text-white mb-3">System Status</h3>
              <div className="grid grid-cols-4 gap-3 text-center">
                {[['Construction', KPI.totalSystems - KPI.precomm - KPI.commissioned - KPI.readyForComm, 'text-slate-400', 'bg-slate-500/20'], ['MC Complete', KPI.readyForComm, 'text-amber-400', 'bg-amber-500/20'], ['Pre-Comm', KPI.precomm, 'text-blue-400', 'bg-blue-500/20'], ['Commissioned', KPI.commissioned, 'text-emerald-400', 'bg-emerald-500/20']].map(([l, v, c, bg]) => (
                  <div key={l as string} className={cn('rounded-lg p-3', bg as string)}>
                    <p className={cn('text-xl font-bold', c as string)}>{v as number}</p>
                    <p className="text-[10px] text-slate-400">{l}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Punch List Summary</h3>
              <div className="space-y-3">
                {[['Cat A (Safety)', KPI.punchA, KPI.punchAClosed, 'text-red-400'], ['Cat B (Operational)', KPI.punchB, KPI.punchBClosed, 'text-amber-400'], ['Cat C (Cosmetic)', KPI.punchC, KPI.punchCClosed, 'text-blue-400']].map(([l, total, closed, c]) => (
                  <div key={l as string}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className={c as string}>{l}</span>
                      <span className="text-slate-400">{closed as number}/{total as number} closed</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-emerald-500/60" style={{ width: `${((closed as number) / (total as number)) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'systems' && (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5 overflow-x-auto">
          <h3 className="text-sm font-semibold text-white mb-3">System Completion Status</h3>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/10">
              {['System', 'Description', 'Sub-Sys', 'MC %', 'Pre-Comm %', 'Status', 'Punch A', 'Punch B'].map(h => (
                <th key={h} className="text-left py-2 px-2 text-[10px] uppercase tracking-wider text-slate-500">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {SYSTEMS.map(s => (
                <tr key={s.sys} className="border-b border-white/5 hover:bg-white/[0.03]">
                  <td className="py-2 px-2 text-blue-400 font-mono text-xs">{s.sys}</td>
                  <td className="py-2 px-2 text-slate-300">{s.desc}</td>
                  <td className="py-2 px-2 text-white">{s.subsys}</td>
                  <td className="py-2 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 rounded-full bg-white/10"><div className={cn('h-full rounded-full', s.mc >= 90 ? 'bg-emerald-500' : s.mc >= 70 ? 'bg-amber-500' : 'bg-red-500')} style={{ width: `${s.mc}%` }} /></div>
                      <span className="text-xs text-slate-400">{s.mc}%</span>
                    </div>
                  </td>
                  <td className="py-2 px-2 text-slate-300">{s.precomm}%</td>
                  <td className={cn('py-2 px-2 capitalize', statusColors[s.status])}>{s.status === 'mc' ? 'MC Phase' : s.status}</td>
                  <td className={cn('py-2 px-2', s.punchA > 0 ? 'text-red-400' : 'text-emerald-400')}>{s.punchA}</td>
                  <td className="py-2 px-2 text-amber-400">{s.punchB}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'punch' && (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Punch List Trend (Weekly)</h3>
          <div className="flex items-end gap-3 h-40">
            {PUNCH_TREND.map(d => (
              <div key={d.week} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex gap-1 items-end" style={{ height: `${Math.max(d.raised, d.closed) * 0.7}px` }}>
                  <div className="flex-1 bg-red-500/30 rounded-t" style={{ height: `${d.raised * 0.7}px` }} />
                  <div className="flex-1 bg-emerald-500/40 rounded-t" style={{ height: `${d.closed * 0.7}px` }} />
                </div>
                <span className="text-[9px] text-slate-500">{d.week}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-3 text-[10px] text-slate-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-red-500/50" />Raised</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-500/50" />Closed</span>
          </div>
          <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-xs text-emerald-400">Punch closure rate exceeds creation rate for 2 consecutive weeks - positive trend.</p>
          </div>
        </div>
      )}

      {tab === 'areas' && (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
          <h3 className="text-sm font-semibold text-white mb-3">Mechanical Completion by Area</h3>
          <div className="space-y-3">
            {MC_BY_AREA.map(a => (
              <div key={a.area} className="border-b border-white/5 pb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white font-medium">{a.area}</span>
                  <div className="flex gap-3 text-xs">
                    <span className="text-slate-400">{a.systems} systems</span>
                    <span className={cn('font-semibold', a.mc >= 70 ? 'text-emerald-400' : a.mc >= 50 ? 'text-amber-400' : 'text-red-400')}>{a.mc}% MC</span>
                  </div>
                </div>
                <div className="relative h-3 rounded-full bg-white/10">
                  <div className="absolute h-full rounded-full bg-amber-500/40" style={{ width: `${a.mc}%` }} />
                  <div className="absolute h-full rounded-full bg-blue-500/60" style={{ width: `${a.precomm}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-3 text-[10px] text-slate-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-amber-500/50" />MC Progress</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-blue-500/60" />Pre-Comm</span>
          </div>
        </div>
      )}
    </div>
  );
}
