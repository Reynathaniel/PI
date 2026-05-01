'use client';
import {
  BarChart3, Activity, DollarSign, ShieldCheck, Users,
  ClipboardCheck, Building2, Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MODULES } from '@/components/Sidebar';
import { useAppStore } from '@/stores/useAppStore';

const STATS = [
  { label: 'Overall Progress', value: '38.2%', change: '+1.4% this week', gradient: 'from-blue-500 to-cyan-500', icon: <BarChart3 size={20} /> },
  { label: 'Schedule (SPI)', value: '0.94', change: '-0.02 vs last month', gradient: 'from-amber-500 to-orange-500', icon: <Activity size={20} /> },
  { label: 'Cost (CPI)', value: '1.02', change: '+0.01 under budget', gradient: 'from-emerald-500 to-green-500', icon: <DollarSign size={20} /> },
  { label: 'Safe Man-Hours', value: '4.78M', change: '847 days LTI-free', gradient: 'from-violet-500 to-purple-500', icon: <ShieldCheck size={20} /> },
  { label: 'Active Workers', value: '2,847', change: '+23 this week', gradient: 'from-pink-500 to-rose-500', icon: <Users size={20} /> },
  { label: 'Open Permits', value: '34', change: '8 hot work active', gradient: 'from-red-500 to-orange-500', icon: <ClipboardCheck size={20} /> },
];

const ACTIVITIES = [
  { time: '2m ago', text: 'Daily Report submitted by Site Manager', color: 'bg-blue-400' },
  { time: '15m ago', text: 'PTW-487 issued for Hot Work at Tank Farm', color: 'bg-red-400' },
  { time: '30m ago', text: 'QC Inspection completed - Pipe Rack B', color: 'bg-green-400' },
  { time: '1h ago', text: 'Safety Observation #1245 recorded', color: 'bg-yellow-400' },
  { time: '2h ago', text: 'Procurement PO-2847 approved', color: 'bg-purple-400' },
  { time: '3h ago', text: 'Milestone M-12 achieved ahead of schedule', color: 'bg-cyan-400' },
];

const PROJECT_DETAILS = [
  ['Project', 'Karimun LNG Terminal - Phase 2'],
  ['Client', 'PT Karimun Gas Energy'],
  ['Contract Value', 'USD 2.4 Billion'],
  ['Duration', '36 Months (Jan 2025 - Dec 2027)'],
  ['Forecast Finish', '28 Jan 2028 (+44 days)'],
  ['Workforce', '2,847 personnel on site'],
];

export default function OverviewDashboard() {
  const { setActiveModule } = useAppStore();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">π</span> Project Intelligence
          </h1>
          <p className="text-slate-400 mt-1 text-sm">KARIMUN LNG TERMINAL - PHASE 2 | Data Date: 26 Apr 2026</p>
        </div>
        <span className="px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30 animate-pulse">
          ● LIVE
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {STATS.map((stat, i) => (
          <div key={stat.label} className="rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-4 hover:bg-white/[0.07] transition-all hover:-translate-y-0.5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                <p className="text-xs text-slate-500 mt-1">{stat.change}</p>
              </div>
              <div className={cn('w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center text-white', stat.gradient)}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Building2 size={16} /> Project Details
          </h3>
          <div className="space-y-3 text-sm">
            {PROJECT_DETAILS.map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-slate-400">{k}</span>
                <span className="text-white font-medium">{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Activity size={16} /> Recent Activity
          </h3>
          <div className="space-y-3">
            {ACTIVITIES.map((act, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <span className="text-[11px] text-slate-500 w-14 shrink-0 mt-0.5">{act.time}</span>
                <div className={cn('w-2 h-2 rounded-full mt-1.5 shrink-0', act.color)} />
                <span className="text-slate-300">{act.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Module Grid */}
      <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Globe size={16} /> System Modules
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {MODULES.filter(m => m.id !== 'overview').map(m => (
            <button key={m.id} onClick={() => setActiveModule(m.id)}
              className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-center hover:bg-white/[0.08] transition-colors cursor-pointer">
              <div className="text-blue-400 flex justify-center mb-2">{m.icon}</div>
              <p className="text-xs text-slate-300">{m.label}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
