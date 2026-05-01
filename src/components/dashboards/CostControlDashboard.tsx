'use client';
import { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, BarChart3, PieChart, AlertTriangle, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const KPI = {
  bac: 2400, eac: 2352.9, etc: 1436.1, ac: 898.8, ev: 916.8,
  cv: 18.0, sv: -57.6, cpi: 1.02, spi: 0.94, vac: 47.1,
  committed: 1245.6, invoiced: 876.2, paid: 812.4,
  contingency: 120, contingencyUsed: 34.2,
};

const WBS_COSTS = [
  { wbs: '1000', desc: 'Project Management', budget: 96.0, actual: 42.8, forecast: 98.2, var: -2.2 },
  { wbs: '2000', desc: 'Engineering', budget: 192.0, actual: 168.4, forecast: 188.5, var: 3.5 },
  { wbs: '3000', desc: 'Procurement', budget: 960.0, actual: 312.6, forecast: 945.0, var: 15.0 },
  { wbs: '4000', desc: 'Civil/Structural', budget: 336.0, actual: 148.2, forecast: 342.8, var: -6.8 },
  { wbs: '5000', desc: 'Mechanical', budget: 384.0, actual: 98.4, forecast: 378.2, var: 5.8 },
  { wbs: '6000', desc: 'Piping', budget: 240.0, actual: 67.8, forecast: 235.6, var: 4.4 },
  { wbs: '7000', desc: 'Electrical', budget: 96.0, actual: 28.4, forecast: 94.2, var: 1.8 },
  { wbs: '8000', desc: 'Instrumentation', budget: 48.0, actual: 12.6, forecast: 46.8, var: 1.2 },
  { wbs: '9000', desc: 'Commissioning', budget: 48.0, actual: 4.2, forecast: 47.6, var: 0.4 },
];

const CASHFLOW_MONTHLY = [
  { m: 'Jan 26', plan: 85, actual: 82 }, { m: 'Feb', plan: 92, actual: 88 },
  { m: 'Mar', plan: 105, actual: 98 }, { m: 'Apr', plan: 118, actual: 112 },
  { m: 'May', plan: 125, actual: 0 }, { m: 'Jun', plan: 132, actual: 0 },
];

const CHANGE_ORDERS = [
  { id: 'CO-012', desc: 'Additional piling at Tank T-105', value: 2.8, status: 'approved' },
  { id: 'CO-013', desc: 'Design change - pipe rack routing', value: 1.4, status: 'pending' },
  { id: 'CO-014', desc: 'Soil remediation - contaminated area', value: 4.2, status: 'approved' },
  { id: 'CO-015', desc: 'Client-requested control room upgrade', value: 3.1, status: 'under_review' },
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

export default function CostControlDashboard() {
  const [tab, setTab] = useState<'overview' | 'wbs' | 'cashflow' | 'changes'>('overview');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2"><DollarSign size={22} className="text-emerald-400" /> Cost Control Center</h1>
          <p className="text-slate-400 text-sm mt-1">Budget & Cost Management | Data Date: 26 Apr 2026</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="success">CPI: {KPI.cpi}</Badge>
          <Badge variant={KPI.cv >= 0 ? 'success' : 'destructive'}>CV: +{KPI.cv}M</Badge>
        </div>
      </div>

      <div className="flex gap-1 bg-white/5 rounded-lg p-1">
        {(['overview', 'wbs', 'cashflow', 'changes'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={cn('px-3 py-1.5 rounded-md text-xs capitalize cursor-pointer transition-colors', tab === t ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5')}>
            {t === 'wbs' ? 'WBS Breakdown' : t === 'changes' ? 'Change Orders' : t}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KPICard label="BAC" value={`$${KPI.bac}M`} sub="Budget at Completion" color="text-white" />
            <KPICard label="EAC" value={`$${KPI.eac}M`} sub="Estimate at Completion" color="text-cyan-400" />
            <KPICard label="Cost Variance" value={`+$${KPI.cv}M`} sub="Under budget" color="text-emerald-400" />
            <KPICard label="VAC" value={`+$${KPI.vac}M`} sub="Projected savings" color="text-emerald-400" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Cost Summary (USD Millions)</h3>
              <div className="space-y-2 text-sm">
                {[
                  ['Committed', `$${KPI.committed}M`, 'text-blue-400'],
                  ['Invoiced', `$${KPI.invoiced}M`, 'text-amber-400'],
                  ['Paid', `$${KPI.paid}M`, 'text-emerald-400'],
                  ['Actual Cost (AC)', `$${KPI.ac}M`, 'text-white'],
                  ['Earned Value (EV)', `$${KPI.ev}M`, 'text-cyan-400'],
                ].map(([l, v, c]) => (
                  <div key={l} className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-slate-400">{l}</span><span className={cn('font-mono font-semibold', c)}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Contingency Usage</h3>
              <div className="text-center mb-4">
                <p className="text-3xl font-bold text-amber-400">{((KPI.contingencyUsed/KPI.contingency)*100).toFixed(1)}%</p>
                <p className="text-xs text-slate-500">${ KPI.contingencyUsed}M of ${KPI.contingency}M used</p>
              </div>
              <div className="h-4 rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-amber-500" style={{ width: `${(KPI.contingencyUsed/KPI.contingency)*100}%` }} />
              </div>
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>$0</span><span>Remaining: ${(KPI.contingency - KPI.contingencyUsed).toFixed(1)}M</span><span>${KPI.contingency}M</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'wbs' && (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5 overflow-x-auto">
          <h3 className="text-sm font-semibold text-white mb-3">WBS Cost Breakdown (USD Millions)</h3>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/10">
              {['WBS', 'Description', 'Budget', 'Actual', 'Forecast', 'Variance', '% Spent'].map(h => (
                <th key={h} className="text-left py-2 px-2 text-[10px] uppercase tracking-wider text-slate-500">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {WBS_COSTS.map(w => (
                <tr key={w.wbs} className="border-b border-white/5 hover:bg-white/[0.03]">
                  <td className="py-2 px-2 text-blue-400 font-mono text-xs">{w.wbs}</td>
                  <td className="py-2 px-2 text-white">{w.desc}</td>
                  <td className="py-2 px-2 text-slate-300">{w.budget.toFixed(1)}</td>
                  <td className="py-2 px-2 text-white font-semibold">{w.actual.toFixed(1)}</td>
                  <td className="py-2 px-2 text-slate-300">{w.forecast.toFixed(1)}</td>
                  <td className={cn('py-2 px-2 font-mono', w.var >= 0 ? 'text-emerald-400' : 'text-red-400')}>{w.var >= 0 ? '+' : ''}{w.var.toFixed(1)}</td>
                  <td className="py-2 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-white/10"><div className="h-full rounded-full bg-blue-500" style={{ width: `${(w.actual/w.budget)*100}%` }} /></div>
                      <span className="text-xs text-slate-400">{((w.actual/w.budget)*100).toFixed(0)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
              <tr className="border-t border-white/20 font-semibold">
                <td className="py-2 px-2" colSpan={2}><span className="text-white">TOTAL</span></td>
                <td className="py-2 px-2 text-white">{WBS_COSTS.reduce((s,w)=>s+w.budget,0).toFixed(1)}</td>
                <td className="py-2 px-2 text-white">{WBS_COSTS.reduce((s,w)=>s+w.actual,0).toFixed(1)}</td>
                <td className="py-2 px-2 text-white">{WBS_COSTS.reduce((s,w)=>s+w.forecast,0).toFixed(1)}</td>
                <td className="py-2 px-2 text-emerald-400">+{WBS_COSTS.reduce((s,w)=>s+w.var,0).toFixed(1)}</td>
                <td className="py-2 px-2" />
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {tab === 'cashflow' && (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Monthly Cash Flow (USD Millions)</h3>
          <div className="flex items-end gap-3 h-40">
            {CASHFLOW_MONTHLY.map(d => (
              <div key={d.m} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex gap-1 items-end" style={{ height: `${d.plan * 1.1}px` }}>
                  <div className="flex-1 bg-blue-500/30 rounded-t" style={{ height: `${d.plan * 1.1}px` }} />
                  {d.actual > 0 && <div className="flex-1 bg-emerald-500/50 rounded-t" style={{ height: `${d.actual * 1.1}px` }} />}
                </div>
                <span className="text-[8px] text-slate-500">{d.m}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-3 text-[10px] text-slate-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-blue-500/50" />Planned</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-500/50" />Actual</span>
          </div>
        </div>
      )}

      {tab === 'changes' && (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
          <h3 className="text-sm font-semibold text-white mb-3">Change Orders / Variations</h3>
          <div className="space-y-3">
            {CHANGE_ORDERS.map(co => (
              <div key={co.id} className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400 font-mono text-xs">{co.id}</span>
                    <Badge variant={co.status === 'approved' ? 'success' : co.status === 'pending' ? 'warning' : 'default'}>{co.status.replace('_', ' ')}</Badge>
                  </div>
                  <p className="text-sm text-slate-300 mt-1">{co.desc}</p>
                </div>
                <span className="text-lg font-bold text-white">${co.value}M</span>
              </div>
            ))}
            <div className="flex justify-between pt-2 font-semibold">
              <span className="text-slate-400">Total Approved</span>
              <span className="text-emerald-400">${CHANGE_ORDERS.filter(c=>c.status==='approved').reduce((s,c)=>s+c.value,0).toFixed(1)}M</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
