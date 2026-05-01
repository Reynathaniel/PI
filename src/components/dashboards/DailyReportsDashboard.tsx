'use client';
import { useState } from 'react';
import {
  FileText, Sun, Cloud, CloudRain, Users, Truck, Clock,
  CheckCircle2, XCircle, AlertTriangle, Plus, Send, Eye,
  Calendar, ThermometerSun, Wind, Droplets
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const REPORTS = [
  { id: 'DR-2026-116', date: '26 Apr 2026', submitter: 'Ahmad Rizal', status: 'submitted', manpower: 2847, equipment: 312, weather: 'Sunny', activities: 14, issues: 2 },
  { id: 'DR-2026-115', date: '25 Apr 2026', submitter: 'Ahmad Rizal', status: 'approved', manpower: 2831, equipment: 308, weather: 'Partly Cloudy', activities: 16, issues: 1 },
  { id: 'DR-2026-114', date: '24 Apr 2026', submitter: 'Ahmad Rizal', status: 'approved', manpower: 2856, equipment: 315, weather: 'Sunny', activities: 15, issues: 3 },
  { id: 'DR-2026-113', date: '23 Apr 2026', submitter: 'Budi Santoso', status: 'approved', manpower: 2812, equipment: 305, weather: 'Rain', activities: 11, issues: 4 },
  { id: 'DR-2026-112', date: '22 Apr 2026', submitter: 'Ahmad Rizal', status: 'approved', manpower: 2845, equipment: 310, weather: 'Sunny', activities: 17, issues: 1 },
  { id: 'DR-2026-111', date: '21 Apr 2026', submitter: 'Ahmad Rizal', status: 'rejected', manpower: 2820, equipment: 302, weather: 'Cloudy', activities: 13, issues: 2 },
];

const MANPOWER_TREND = [
  { day: 'Mon', count: 2845 }, { day: 'Tue', count: 2856 }, { day: 'Wed', count: 2831 },
  { day: 'Thu', count: 2812 }, { day: 'Fri', count: 2847 }, { day: 'Sat', count: 1420 }, { day: 'Sun', count: 280 },
];

const DISCIPLINE_MANPOWER = [
  { disc: 'Civil/Structural', count: 680, pct: 23.9 },
  { disc: 'Mechanical', count: 542, pct: 19.0 },
  { disc: 'Piping', count: 498, pct: 17.5 },
  { disc: 'Electrical', count: 312, pct: 11.0 },
  { disc: 'Instrumentation', count: 198, pct: 7.0 },
  { disc: 'Scaffolding', count: 245, pct: 8.6 },
  { disc: 'Insulation/Painting', count: 156, pct: 5.5 },
  { disc: 'HSSE', count: 89, pct: 3.1 },
  { disc: 'QC/QA', count: 67, pct: 2.4 },
  { disc: 'Others', count: 60, pct: 2.1 },
];

const EQUIPMENT_SUMMARY = [
  { type: 'Cranes (>50T)', count: 8, active: 7 },
  { type: 'Cranes (<50T)', count: 14, active: 12 },
  { type: 'Excavators', count: 18, active: 16 },
  { type: 'Forklifts', count: 24, active: 22 },
  { type: 'Welding Machines', count: 186, active: 178 },
  { type: 'Generators', count: 32, active: 30 },
  { type: 'Compressors', count: 12, active: 11 },
  { type: 'Trucks/Trailers', count: 18, active: 16 },
];

const TODAY_ACTIVITIES = [
  { area: 'Tank Farm', activity: 'Foundation pouring Tank T-103', progress: 45, status: 'on_track' },
  { area: 'Pipe Rack B', activity: 'Piping spool installation Rack B-12 to B-15', progress: 72, status: 'on_track' },
  { area: 'Substation', activity: 'Cable tray installation Level 2', progress: 30, status: 'delayed' },
  { area: 'Jetty', activity: 'Marine loading arm structural support', progress: 88, status: 'on_track' },
  { area: 'Control Room', activity: 'DCS panel installation', progress: 15, status: 'on_track' },
  { area: 'Fab Yard', activity: 'Pipe spool fabrication batch PS-047', progress: 60, status: 'at_risk' },
];

function KPICard({ label, value, sub, color, icon }: { label: string; value: string; sub: string; color: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest">{label}</p>
          <p className={cn('text-2xl font-bold mt-1', color)}>{value}</p>
          <p className="text-[11px] text-slate-500 mt-1">{sub}</p>
        </div>
        <div className="text-slate-500">{icon}</div>
      </div>
    </div>
  );
}

export default function DailyReportsDashboard() {
  const [tab, setTab] = useState<'overview' | 'reports' | 'manpower' | 'equipment'>('overview');
  const statusColors: Record<string, string> = { approved: 'text-emerald-400', submitted: 'text-blue-400', rejected: 'text-red-400', draft: 'text-slate-400' };
  const weatherIcon: Record<string, React.ReactNode> = { Sunny: <Sun size={14} className="text-amber-400" />, 'Partly Cloudy': <Cloud size={14} className="text-slate-400" />, Cloudy: <Cloud size={14} className="text-slate-400" />, Rain: <CloudRain size={14} className="text-blue-400" /> };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2"><FileText size={22} className="text-blue-400" /> Daily Progress Reports</h1>
          <p className="text-slate-400 text-sm mt-1">26 Apr 2026 | KARIMUN LNG TERMINAL</p>
        </div>
        <Button size="sm"><Plus size={14} className="mr-1" /> New Report</Button>
      </div>

      <div className="flex gap-1 bg-white/5 rounded-lg p-1">
        {(['overview', 'reports', 'manpower', 'equipment'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={cn('px-3 py-1.5 rounded-md text-xs capitalize cursor-pointer transition-colors', tab === t ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5')}>{t}</button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KPICard label="Today's Manpower" value="2,847" sub="+16 vs yesterday" color="text-blue-400" icon={<Users size={18} />} />
            <KPICard label="Equipment Active" value="312" sub="96% utilization" color="text-emerald-400" icon={<Truck size={18} />} />
            <KPICard label="Weather" value="32°C" sub="Sunny, Wind 12 km/h" color="text-amber-400" icon={<ThermometerSun size={18} />} />
            <KPICard label="Working Hours" value="10.5h" sub="06:00 - 16:30" color="text-violet-400" icon={<Clock size={18} />} />
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Today&apos;s Key Activities</h3>
            <div className="space-y-2">
              {TODAY_ACTIVITIES.map((a, i) => (
                <div key={i} className="flex items-center gap-3 border-b border-white/5 pb-2">
                  <span className="text-xs text-slate-500 w-24 shrink-0">{a.area}</span>
                  <div className="flex-1">
                    <p className="text-sm text-slate-300">{a.activity}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 rounded-full bg-white/10 max-w-[200px]">
                        <div className={cn('h-full rounded-full', a.status === 'delayed' ? 'bg-red-500' : a.status === 'at_risk' ? 'bg-amber-500' : 'bg-emerald-500')} style={{ width: `${a.progress}%` }} />
                      </div>
                      <span className="text-xs text-slate-400">{a.progress}%</span>
                    </div>
                  </div>
                  <Badge variant={a.status === 'on_track' ? 'success' : a.status === 'delayed' ? 'destructive' : 'warning'}>{a.status.replace('_', ' ')}</Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Weekly Manpower Trend</h3>
            <div className="flex items-end gap-2 h-32">
              {MANPOWER_TREND.map(d => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-white font-mono">{d.count > 999 ? `${(d.count/1000).toFixed(1)}k` : d.count}</span>
                  <div className="w-full bg-gradient-to-t from-blue-500/60 to-blue-400/20 rounded-t" style={{ height: `${(d.count / 3000) * 120}px` }} />
                  <span className="text-[9px] text-slate-500">{d.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'reports' && (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/10">
              {['Report ID', 'Date', 'Submitted By', 'Weather', 'Manpower', 'Equipment', 'Activities', 'Issues', 'Status'].map(h => (
                <th key={h} className="text-left py-2 px-2 text-[10px] uppercase tracking-wider text-slate-500">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {REPORTS.map(r => (
                <tr key={r.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                  <td className="py-2 px-2 text-blue-400 font-mono text-xs">{r.id}</td>
                  <td className="py-2 px-2 text-slate-300">{r.date}</td>
                  <td className="py-2 px-2 text-slate-300">{r.submitter}</td>
                  <td className="py-2 px-2 flex items-center gap-1">{weatherIcon[r.weather]}<span className="text-slate-400">{r.weather}</span></td>
                  <td className="py-2 px-2 text-white font-semibold">{r.manpower.toLocaleString()}</td>
                  <td className="py-2 px-2 text-slate-300">{r.equipment}</td>
                  <td className="py-2 px-2 text-slate-300">{r.activities}</td>
                  <td className="py-2 px-2 text-amber-400">{r.issues}</td>
                  <td className={cn('py-2 px-2 capitalize', statusColors[r.status])}>{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'manpower' && (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
          <h3 className="text-sm font-semibold text-white mb-3">Manpower by Discipline</h3>
          <div className="space-y-2">
            {DISCIPLINE_MANPOWER.map(d => (
              <div key={d.disc} className="flex items-center gap-3">
                <span className="text-sm text-slate-300 w-40 shrink-0">{d.disc}</span>
                <div className="flex-1 h-2 rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-blue-500/60" style={{ width: `${d.pct * 2}%` }} />
                </div>
                <span className="text-xs text-white font-semibold w-12 text-right">{d.count}</span>
                <span className="text-xs text-slate-500 w-10">{d.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'equipment' && (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
          <h3 className="text-sm font-semibold text-white mb-3">Equipment Status</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {EQUIPMENT_SUMMARY.map(e => (
              <div key={e.type} className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                <p className="text-xs text-slate-400">{e.type}</p>
                <p className="text-xl font-bold text-white mt-1">{e.active}<span className="text-sm text-slate-500">/{e.count}</span></p>
                <div className="mt-2 h-1.5 rounded-full bg-white/10">
                  <div className={cn('h-full rounded-full', e.active/e.count >= 0.9 ? 'bg-emerald-500' : 'bg-amber-500')} style={{ width: `${(e.active/e.count)*100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
