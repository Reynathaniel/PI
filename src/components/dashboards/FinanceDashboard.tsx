'use client';
import { useState } from 'react';
import { DollarSign, CreditCard, Receipt, TrendingUp, FileText, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const KPI = {
  totalBudget: 2400, totalInvoiced: 876.2, totalPaid: 812.4,
  outstanding: 63.8, retention: 48.6, retentionPct: 5,
  cashIn: 920.4, cashOut: 812.4, netCash: 108.0,
  payables: 63.8, payablesDue30: 42.1, payablesDue60: 15.4, payablesOverdue: 6.3,
  receivables: 124.5, receivablesDue30: 82.4, receivablesOverdue: 12.8,
  taxWithheld: 28.4, bankGuarantee: 120.0, insurancePremium: 18.6,
};

const INVOICE_LOG = [
  { inv: 'INV-2026-089', vendor: 'Worley Engineering', amount: 12.4, currency: 'USD', date: '25 Apr 26', due: '25 May 26', status: 'pending', category: 'Engineering' },
  { inv: 'INV-2026-088', vendor: 'PT Krakatau Steel', amount: 5.8, currency: 'USD', date: '24 Apr 26', due: '24 May 26', status: 'approved', category: 'Materials' },
  { inv: 'INV-2026-087', vendor: 'ABB Indonesia', amount: 8.2, currency: 'USD', date: '22 Apr 26', due: '22 May 26', status: 'paid', category: 'Equipment' },
  { inv: 'INV-2026-086', vendor: 'Saipem Indonesia', amount: 18.5, currency: 'USD', date: '20 Apr 26', due: '20 May 26', status: 'approved', category: 'Construction' },
  { inv: 'INV-2026-085', vendor: 'PT Rekayasa Industri', amount: 4.2, currency: 'USD', date: '18 Apr 26', due: '18 May 26', status: 'paid', category: 'Subcontract' },
  { inv: 'INV-2026-084', vendor: 'Yokogawa Electric', amount: 3.6, currency: 'USD', date: '15 Apr 26', due: '15 May 26', status: 'overdue', category: 'Instrumentation' },
];

const CASHFLOW = [
  { month: 'Jan', inflow: 145, outflow: 128 }, { month: 'Feb', inflow: 158, outflow: 142 },
  { month: 'Mar', inflow: 172, outflow: 165 }, { month: 'Apr', inflow: 168, outflow: 155 },
  { month: 'May', inflow: 180, outflow: 0 }, { month: 'Jun', inflow: 195, outflow: 0 },
];

const BUDGET_CATEGORY = [
  { cat: 'Engineering & Design', budget: 192.0, spent: 168.4, committed: 185.2, pct: 87.7 },
  { cat: 'Equipment & Materials', budget: 960.0, spent: 312.6, committed: 845.0, pct: 32.6 },
  { cat: 'Construction Labor', budget: 576.0, spent: 186.4, committed: 245.8, pct: 32.4 },
  { cat: 'Subcontracts', budget: 384.0, spent: 98.2, committed: 156.4, pct: 25.6 },
  { cat: 'Project Management', budget: 96.0, spent: 42.8, committed: 48.2, pct: 44.6 },
  { cat: 'Insurance & Bonds', budget: 48.0, spent: 18.6, committed: 24.0, pct: 38.8 },
  { cat: 'Contingency', budget: 120.0, spent: 34.2, committed: 34.2, pct: 28.5 },
  { cat: 'Others', budget: 24.0, spent: 8.4, committed: 12.6, pct: 35.0 },
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

export default function FinanceDashboard() {
  const [tab, setTab] = useState<'overview' | 'invoices' | 'cashflow' | 'budget'>('overview');
  const statusColors: Record<string, string> = { paid: 'text-emerald-400', approved: 'text-blue-400', pending: 'text-amber-400', overdue: 'text-red-400' };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2"><CreditCard size={22} className="text-green-400" /> Finance Center</h1>
          <p className="text-slate-400 text-sm mt-1">Financial Management | 26 Apr 2026</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="default">Net Cash: ${KPI.netCash}M</Badge>
          <Badge variant={KPI.payablesOverdue > 5 ? 'warning' : 'success'}>${KPI.payablesOverdue}M Overdue</Badge>
        </div>
      </div>

      <div className="flex gap-1 bg-white/5 rounded-lg p-1">
        {(['overview', 'invoices', 'cashflow', 'budget'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={cn('px-3 py-1.5 rounded-md text-xs capitalize cursor-pointer transition-colors', tab === t ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5')}>
            {t === 'cashflow' ? 'Cash Flow' : t}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KPICard label="Total Invoiced" value={`$${KPI.totalInvoiced}M`} sub={`$${KPI.totalPaid}M paid`} color="text-white" />
            <KPICard label="Outstanding" value={`$${KPI.outstanding}M`} sub={`$${KPI.payablesOverdue}M overdue`} color="text-amber-400" />
            <KPICard label="Retention Held" value={`$${KPI.retention}M`} sub={`${KPI.retentionPct}% retention`} color="text-blue-400" />
            <KPICard label="Net Cash Position" value={`$${KPI.netCash}M`} sub="Inflow - Outflow" color="text-emerald-400" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Accounts Payable Aging</h3>
              <div className="space-y-3">
                {[['Current (0-30 days)', KPI.payablesDue30, 'text-emerald-400'], ['30-60 days', KPI.payablesDue60, 'text-amber-400'], ['Overdue (60+ days)', KPI.payablesOverdue, 'text-red-400']].map(([l, v, c]) => (
                  <div key={l as string} className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-sm text-slate-400">{l}</span>
                    <span className={cn('text-sm font-semibold', c as string)}>${v}M</span>
                  </div>
                ))}
                <div className="flex justify-between font-semibold pt-1">
                  <span className="text-white">Total Payables</span>
                  <span className="text-white">${KPI.payables}M</span>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Financial Instruments</h3>
              <div className="space-y-3">
                {[['Bank Guarantee', KPI.bankGuarantee, 'text-blue-400'], ['Insurance Premium', KPI.insurancePremium, 'text-cyan-400'], ['Tax Withheld', KPI.taxWithheld, 'text-amber-400'], ['Receivables', KPI.receivables, 'text-emerald-400']].map(([l, v, c]) => (
                  <div key={l as string} className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-sm text-slate-400">{l}</span>
                    <span className={cn('text-sm font-semibold', c as string)}>${v}M</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'invoices' && (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5 overflow-x-auto">
          <h3 className="text-sm font-semibold text-white mb-3">Invoice Register</h3>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/10">
              {['Invoice #', 'Vendor', 'Category', 'Amount (M)', 'Date', 'Due Date', 'Status'].map(h => (
                <th key={h} className="text-left py-2 px-2 text-[10px] uppercase tracking-wider text-slate-500">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {INVOICE_LOG.map(inv => (
                <tr key={inv.inv} className="border-b border-white/5 hover:bg-white/[0.03]">
                  <td className="py-2 px-2 text-blue-400 font-mono text-xs">{inv.inv}</td>
                  <td className="py-2 px-2 text-white">{inv.vendor}</td>
                  <td className="py-2 px-2 text-slate-300">{inv.category}</td>
                  <td className="py-2 px-2 text-white font-semibold">${inv.amount}</td>
                  <td className="py-2 px-2 text-slate-400">{inv.date}</td>
                  <td className="py-2 px-2 text-slate-400">{inv.due}</td>
                  <td className={cn('py-2 px-2 capitalize', statusColors[inv.status])}>{inv.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'cashflow' && (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Monthly Cash Flow (USD Millions)</h3>
          <div className="flex items-end gap-3 h-40">
            {CASHFLOW.map(d => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex gap-1 items-end" style={{ height: `${Math.max(d.inflow, d.outflow) * 0.7}px` }}>
                  <div className="flex-1 bg-emerald-500/30 rounded-t" style={{ height: `${d.inflow * 0.7}px` }} />
                  {d.outflow > 0 && <div className="flex-1 bg-red-500/30 rounded-t" style={{ height: `${d.outflow * 0.7}px` }} />}
                </div>
                <span className="text-[9px] text-slate-500">{d.month}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-3 text-[10px] text-slate-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-500/50" />Inflow</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-red-500/50" />Outflow</span>
          </div>
        </div>
      )}

      {tab === 'budget' && (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
          <h3 className="text-sm font-semibold text-white mb-3">Budget vs Spent by Category (USD Millions)</h3>
          <div className="space-y-3">
            {BUDGET_CATEGORY.map(b => (
              <div key={b.cat} className="border-b border-white/5 pb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white font-medium">{b.cat}</span>
                  <div className="flex gap-3 text-xs">
                    <span className="text-emerald-400">${b.spent}M spent</span>
                    <span className="text-blue-400">${b.committed}M committed</span>
                    <span className="text-slate-400">${b.budget}M budget</span>
                  </div>
                </div>
                <div className="relative h-3 rounded-full bg-white/10">
                  <div className="absolute h-full rounded-full bg-blue-500/30" style={{ width: `${(b.committed / b.budget) * 100}%` }} />
                  <div className="absolute h-full rounded-full bg-emerald-500/60" style={{ width: `${b.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-3 text-[10px] text-slate-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-500/60" />Spent</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-blue-500/30" />Committed</span>
          </div>
        </div>
      )}
    </div>
  );
}
