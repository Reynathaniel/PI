'use client';
import { useState } from 'react';
import { Package, Truck, FileText, Clock, CheckCircle2, AlertTriangle, Search, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const KPI = {
  totalPO: 847, activePO: 234, deliveredPO: 578, cancelledPO: 35,
  totalValue: 1245.6, committed: 986.4, spent: 812.2,
  onTime: 87.4, avgLeadTime: 42,
  pendingRFQ: 12, pendingApproval: 8,
};

const PO_LIST = [
  { po: 'PO-2847', vendor: 'Sumitomo Heavy Industries', item: 'LNG Storage Tank Internal', value: 24.5, status: 'in_transit', eta: '15 May 26', progress: 85 },
  { po: 'PO-2846', vendor: 'Emerson Process', item: 'DCS System - Deltav', value: 8.2, status: 'manufacturing', eta: '30 Jun 26', progress: 45 },
  { po: 'PO-2845', vendor: 'Valvitalia SpA', item: 'Cryogenic Valves Lot 3', value: 3.8, status: 'delivered', eta: '20 Apr 26', progress: 100 },
  { po: 'PO-2844', vendor: 'Tubacex Group', item: 'SS316L Pipe 12" Sch40', value: 5.6, status: 'in_transit', eta: '10 May 26', progress: 70 },
  { po: 'PO-2843', vendor: 'Hiap Teck Venture', item: 'Carbon Steel Plates', value: 2.1, status: 'delivered', eta: '18 Apr 26', progress: 100 },
  { po: 'PO-2842', vendor: 'ABB Indonesia', item: 'MV Switchgear 6.6kV', value: 6.4, status: 'manufacturing', eta: '15 Jul 26', progress: 30 },
  { po: 'PO-2841', vendor: 'Yokogawa Electric', item: 'Field Instruments Batch 5', value: 1.8, status: 'inspection', eta: '05 May 26', progress: 90 },
];

const VENDOR_PERF = [
  { vendor: 'Sumitomo Heavy Industries', po_count: 12, on_time: 92, quality: 98, rating: 'A' },
  { vendor: 'Emerson Process', po_count: 8, on_time: 88, quality: 99, rating: 'A' },
  { vendor: 'ABB Indonesia', po_count: 15, on_time: 85, quality: 95, rating: 'B+' },
  { vendor: 'Tubacex Group', po_count: 6, on_time: 78, quality: 97, rating: 'B' },
  { vendor: 'Valvitalia SpA', po_count: 9, on_time: 94, quality: 96, rating: 'A' },
  { vendor: 'Yokogawa Electric', po_count: 11, on_time: 91, quality: 98, rating: 'A' },
];

const MATERIAL_STATUS = [
  { category: 'Structural Steel', ordered: 4500, received: 3820, installed: 3240, unit: 'MT' },
  { category: 'Piping (CS)', ordered: 28000, received: 18400, installed: 14200, unit: 'LM' },
  { category: 'Piping (SS)', ordered: 8500, received: 5200, installed: 3800, unit: 'LM' },
  { category: 'Cable', ordered: 185000, received: 98000, installed: 72000, unit: 'LM' },
  { category: 'Valves', ordered: 2400, received: 1680, installed: 1240, unit: 'EA' },
  { category: 'Instruments', ordered: 3200, received: 1450, installed: 980, unit: 'EA' },
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

export default function ProcurementDashboard() {
  const [tab, setTab] = useState<'overview' | 'orders' | 'vendors' | 'materials'>('overview');
  const statusColors: Record<string, string> = { delivered: 'text-emerald-400', in_transit: 'text-blue-400', manufacturing: 'text-amber-400', inspection: 'text-cyan-400', cancelled: 'text-red-400' };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2"><Package size={22} className="text-purple-400" /> Procurement & Materials</h1>
          <p className="text-slate-400 text-sm mt-1">Supply Chain Management | 26 Apr 2026</p>
        </div>
        <Badge variant="default">{KPI.activePO} Active POs</Badge>
      </div>

      <div className="flex gap-1 bg-white/5 rounded-lg p-1">
        {(['overview', 'orders', 'vendors', 'materials'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={cn('px-3 py-1.5 rounded-md text-xs capitalize cursor-pointer transition-colors', tab === t ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5')}>
            {t === 'orders' ? 'Purchase Orders' : t}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KPICard label="Total POs" value={KPI.totalPO.toString()} sub={`${KPI.activePO} active`} color="text-white" />
            <KPICard label="Total Value" value={`$${KPI.totalValue}M`} sub={`$${KPI.committed}M committed`} color="text-blue-400" />
            <KPICard label="On-Time Delivery" value={`${KPI.onTime}%`} sub={`Avg lead: ${KPI.avgLeadTime} days`} color="text-emerald-400" />
            <KPICard label="Pending Actions" value={(KPI.pendingRFQ + KPI.pendingApproval).toString()} sub={`${KPI.pendingRFQ} RFQ, ${KPI.pendingApproval} approval`} color="text-amber-400" />
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
            <h3 className="text-sm font-semibold text-white mb-3">PO Status Distribution</h3>
            <div className="grid grid-cols-4 gap-3">
              {[['Active', KPI.activePO, 'text-blue-400', 'bg-blue-500/20'], ['Delivered', KPI.deliveredPO, 'text-emerald-400', 'bg-emerald-500/20'], ['Cancelled', KPI.cancelledPO, 'text-red-400', 'bg-red-500/20'], ['Total Value', `$${KPI.totalValue}M`, 'text-violet-400', 'bg-violet-500/20']].map(([l, v, tc, bg]) => (
                <div key={l as string} className={cn('rounded-lg p-3 text-center', bg as string)}>
                  <p className={cn('text-2xl font-bold', tc as string)}>{v}</p>
                  <p className="text-xs text-slate-400 mt-1">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/10">
              {['PO #', 'Vendor', 'Item', 'Value (M)', 'Status', 'ETA', 'Progress'].map(h => (
                <th key={h} className="text-left py-2 px-2 text-[10px] uppercase tracking-wider text-slate-500">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {PO_LIST.map(po => (
                <tr key={po.po} className="border-b border-white/5 hover:bg-white/[0.03]">
                  <td className="py-2 px-2 text-blue-400 font-mono text-xs">{po.po}</td>
                  <td className="py-2 px-2 text-white">{po.vendor}</td>
                  <td className="py-2 px-2 text-slate-300 max-w-[200px] truncate">{po.item}</td>
                  <td className="py-2 px-2 text-white font-semibold">${po.value}</td>
                  <td className={cn('py-2 px-2 capitalize', statusColors[po.status])}>{po.status.replace('_', ' ')}</td>
                  <td className="py-2 px-2 text-slate-400">{po.eta}</td>
                  <td className="py-2 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-white/10"><div className={cn('h-full rounded-full', po.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500')} style={{ width: `${po.progress}%` }} /></div>
                      <span className="text-xs text-slate-400">{po.progress}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'vendors' && (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5 overflow-x-auto">
          <h3 className="text-sm font-semibold text-white mb-3">Vendor Performance</h3>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/10">
              {['Vendor', 'POs', 'On-Time %', 'Quality %', 'Rating'].map(h => (
                <th key={h} className="text-left py-2 px-2 text-[10px] uppercase tracking-wider text-slate-500">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {VENDOR_PERF.map(v => (
                <tr key={v.vendor} className="border-b border-white/5 hover:bg-white/[0.03]">
                  <td className="py-2 px-2 text-white">{v.vendor}</td>
                  <td className="py-2 px-2 text-slate-300">{v.po_count}</td>
                  <td className={cn('py-2 px-2 font-semibold', v.on_time >= 90 ? 'text-emerald-400' : v.on_time >= 80 ? 'text-amber-400' : 'text-red-400')}>{v.on_time}%</td>
                  <td className="py-2 px-2 text-emerald-400">{v.quality}%</td>
                  <td className="py-2 px-2"><Badge variant={v.rating.startsWith('A') ? 'success' : 'warning'}>{v.rating}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'materials' && (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
          <h3 className="text-sm font-semibold text-white mb-3">Material Tracking</h3>
          <div className="space-y-4">
            {MATERIAL_STATUS.map(m => (
              <div key={m.category} className="border-b border-white/5 pb-3">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white font-medium">{m.category}</span>
                  <span className="text-slate-400 text-xs">{m.unit}</span>
                </div>
                <div className="flex gap-2 text-xs mb-1">
                  <span className="text-blue-400">Ordered: {m.ordered.toLocaleString()}</span>
                  <span className="text-amber-400">Received: {m.received.toLocaleString()}</span>
                  <span className="text-emerald-400">Installed: {m.installed.toLocaleString()}</span>
                </div>
                <div className="relative h-3 rounded-full bg-white/10">
                  <div className="absolute h-full rounded-full bg-blue-500/20" style={{ width: '100%' }} />
                  <div className="absolute h-full rounded-full bg-amber-500/40" style={{ width: `${(m.received/m.ordered)*100}%` }} />
                  <div className="absolute h-full rounded-full bg-emerald-500/70" style={{ width: `${(m.installed/m.ordered)*100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
