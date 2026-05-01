'use client';
import {
  BarChart3, Activity, DollarSign, ShieldCheck, Users,
  ClipboardCheck, Building2, Globe, Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MODULES } from '@/components/Sidebar';
import { useAppStore } from '@/stores/useAppStore';
import { useProjectData } from '@/hooks/useProjectData';

function formatCurrency(value: number, currency: string): string {
  if (value >= 1e9) return `${currency} ${(value / 1e9).toFixed(1)} Billion`;
  if (value >= 1e6) return `${currency} ${(value / 1e6).toFixed(1)} Million`;
  return `${currency} ${value.toLocaleString()}`;
}

function formatNumber(n: number): string {
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return n.toLocaleString();
  return String(n);
}

function calcDuration(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const months = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
  const sy = s.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  const ey = e.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  return `${months} Months (${sy} - ${ey})`;
}

function calcDelay(end: string, forecast: string): string {
  const e = new Date(end);
  const f = new Date(forecast);
  const diff = Math.round((f.getTime() - e.getTime()) / 86400000);
  const fd = f.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  if (diff > 0) return `${fd} (+${diff} days)`;
  if (diff < 0) return `${fd} (${diff} days ahead)`;
  return fd;
}

export default function OverviewDashboard() {
  const { setActiveModule } = useAppStore();
  const { project, stats, activities, loading, isDemo } = useProjectData();

  const STATS = [
    { label: 'Overall Progress', value: `${project.overall_progress}%`, change: '+1.4% this week', gradient: 'from-blue-500 to-cyan-500', icon: <BarChart3 size={20} /> },
    { label: 'Schedule (SPI)', value: project.spi.toFixed(2), change: '-0.02 vs last month', gradient: 'from-amber-500 to-orange-500', icon: <Activity size={20} /> },
    { label: 'Cost (CPI)', value: project.cpi.toFixed(2), change: project.cpi >= 1 ? 'Under budget' : 'Over budget', gradient: 'from-emerald-500 to-green-500', icon: <DollarSign size={20} /> },
    { label: 'Safe Man-Hours', value: formatNumber(stats.safeManHours), change: `${stats.ltiFreeDays} days LTI-free`, gradient: 'from-violet-500 to-purple-500', icon: <ShieldCheck size={20} /> },
    { label: 'Active Workers', value: stats.activeWorkers.toLocaleString(), change: '+23 this week', gradient: 'from-pink-500 to-rose-500', icon: <Users size={20} /> },
    { label: 'Open Permits', value: String(stats.openPermits), change: '8 hot work active', gradient: 'from-red-500 to-orange-500', icon: <ClipboardCheck size={20} /> },
  ];

  const PROJECT_DETAILS: [string, string][] = [
    ['Project', project.name],
    ['Client', project.client],
    ['Contract Value', formatCurrency(project.contract_value, project.currency)],
    ['Duration', calcDuration(project.start_date, project.end_date)],
    ['Forecast Finish', calcDelay(project.end_date, project.forecast_end)],
    ['Workforce', `${stats.activeWorkers.toLocaleString()} personnel on site`],
  ];

  const dataDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">π</span> Project Intelligence
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            {project.code} - {project.name.toUpperCase()} | Data Date: {dataDate}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isDemo && (
            <span className="px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-semibold border border-amber-500/30">
              DEMO DATA
            </span>
          )}
          {loading ? (
            <Loader2 size={16} className="text-slate-400 animate-spin" />
          ) : (
            <span className="px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30 animate-pulse">
              ● LIVE
            </span>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {STATS.map((stat) => (
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
            {activities.map((act, i) => (
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
