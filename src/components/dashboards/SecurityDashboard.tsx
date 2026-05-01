'use client';
import { useState } from 'react';
import { Lock, Shield, UserCheck, AlertTriangle, Camera, Car, DoorOpen, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const KPI = {
  totalPersonnel: 3842, activeGates: 4, cctvCameras: 186, cctvOnline: 182,
  dailyEntry: 2847, dailyExit: 2692, currentOnsite: 3155,
  vehiclesOnsite: 148, visitorToday: 34,
  incidentsThisMonth: 3, incidentsThisYear: 18,
  passExpiring: 56, passExpired: 12, passBlocked: 4,
  patrolCompleted: 18, patrolTotal: 24, patrolPct: 75.0,
};

const GATE_LOG = [
  { gate: 'Main Gate A', entries: 1842, exits: 1724, vehicles: 86, status: 'operational', guards: 4 },
  { gate: 'Gate B - Jetty', entries: 456, exits: 412, vehicles: 28, status: 'operational', guards: 2 },
  { gate: 'Gate C - Camp', entries: 389, exits: 398, vehicles: 22, status: 'operational', guards: 2 },
  { gate: 'Gate D - Emergency', entries: 12, exits: 8, vehicles: 4, status: 'standby', guards: 1 },
];

const SECURITY_INCIDENTS = [
  { id: 'SEC-018', type: 'Unauthorized Access', location: 'Restricted Area B', date: '24 Apr 26', severity: 'Medium', status: 'closed', details: 'Worker without valid permit entered restricted area' },
  { id: 'SEC-017', type: 'Vehicle Incident', location: 'Main Gate A', date: '18 Apr 26', severity: 'Low', status: 'closed', details: 'Minor fender bender at gate entrance' },
  { id: 'SEC-016', type: 'Lost ID Badge', location: 'Process Area', date: '12 Apr 26', severity: 'Low', status: 'closed', details: 'Worker reported lost badge, replacement issued' },
];

const PATROL_SCHEDULE = [
  { zone: 'Perimeter North', time: '06:00', guard: 'Ahmad', status: 'completed' },
  { zone: 'Process Area', time: '08:00', guard: 'Budi', status: 'completed' },
  { zone: 'Tank Farm', time: '10:00', guard: 'Rudi', status: 'completed' },
  { zone: 'Jetty Area', time: '12:00', guard: 'Deni', status: 'in_progress' },
  { zone: 'Camp Area', time: '14:00', guard: 'Agus', status: 'scheduled' },
  { zone: 'Perimeter South', time: '16:00', guard: 'Hendra', status: 'scheduled' },
];

const ACCESS_ZONES = [
  { zone: 'General Access', personnel: 3842, level: 'Green', description: 'All registered personnel' },
  { zone: 'Controlled Area', personnel: 2456, level: 'Yellow', description: 'Workers with valid permits' },
  { zone: 'Restricted Area', personnel: 486, level: 'Orange', description: 'Authorized supervisors & engineers' },
  { zone: 'High Security', personnel: 124, level: 'Red', description: 'Management & security only' },
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

export default function SecurityDashboard() {
  const [tab, setTab] = useState<'overview' | 'gates' | 'incidents' | 'patrols'>('overview');
  const statusColors: Record<string, string> = { completed: 'text-emerald-400', in_progress: 'text-blue-400', scheduled: 'text-slate-400', operational: 'text-emerald-400', standby: 'text-amber-400' };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2"><Shield size={22} className="text-red-400" /> Security Command Center</h1>
          <p className="text-slate-400 text-sm mt-1">Site Security Management | 26 Apr 2026</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="success">CCTV: {KPI.cctvOnline}/{KPI.cctvCameras}</Badge>
          <Badge variant={KPI.passExpired > 10 ? 'warning' : 'default'}>{KPI.passExpired} Expired Passes</Badge>
        </div>
      </div>

      <div className="flex gap-1 bg-white/5 rounded-lg p-1">
        {(['overview', 'gates', 'incidents', 'patrols'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={cn('px-3 py-1.5 rounded-md text-xs capitalize cursor-pointer transition-colors', tab === t ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5')}>{t}</button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KPICard label="Currently Onsite" value={KPI.currentOnsite.toLocaleString()} sub={`${KPI.vehiclesOnsite} vehicles`} color="text-white" icon={<UserCheck size={18} />} />
            <KPICard label="Daily Entries" value={KPI.dailyEntry.toLocaleString()} sub={`${KPI.visitorToday} visitors`} color="text-blue-400" icon={<DoorOpen size={18} />} />
            <KPICard label="CCTV Status" value={`${KPI.cctvOnline}/${KPI.cctvCameras}`} sub={`${((KPI.cctvOnline / KPI.cctvCameras) * 100).toFixed(0)}% online`} color="text-emerald-400" icon={<Camera size={18} />} />
            <KPICard label="Patrol Completion" value={`${KPI.patrolPct}%`} sub={`${KPI.patrolCompleted}/${KPI.patrolTotal} done`} color="text-amber-400" icon={<Shield size={18} />} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Access Pass Status</h3>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[['Active', KPI.totalPersonnel - KPI.passExpired - KPI.passBlocked, 'text-emerald-400', 'bg-emerald-500/20'], ['Expiring', KPI.passExpiring, 'text-amber-400', 'bg-amber-500/20'], ['Blocked', KPI.passBlocked, 'text-red-400', 'bg-red-500/20']].map(([l, v, c, bg]) => (
                  <div key={l as string} className={cn('rounded-lg p-3', bg as string)}>
                    <p className={cn('text-xl font-bold', c as string)}>{(v as number).toLocaleString()}</p>
                    <p className="text-xs text-slate-400">{l}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Access Zones</h3>
              <div className="space-y-2">
                {ACCESS_ZONES.map(z => {
                  const zoneColors: Record<string, string> = { Green: 'bg-emerald-500', Yellow: 'bg-amber-500', Orange: 'bg-orange-500', Red: 'bg-red-500' };
                  return (
                    <div key={z.zone} className="flex items-center gap-3 border-b border-white/5 pb-2">
                      <span className={cn('w-2 h-2 rounded-full shrink-0', zoneColors[z.level])} />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="text-sm text-white">{z.zone}</span>
                          <span className="text-xs text-slate-400">{z.personnel.toLocaleString()} persons</span>
                        </div>
                        <p className="text-[10px] text-slate-500">{z.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'gates' && (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5 overflow-x-auto">
          <h3 className="text-sm font-semibold text-white mb-3">Gate Activity (Today)</h3>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/10">
              {['Gate', 'Entries', 'Exits', 'Vehicles', 'Guards', 'Status'].map(h => (
                <th key={h} className="text-left py-2 px-2 text-[10px] uppercase tracking-wider text-slate-500">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {GATE_LOG.map(g => (
                <tr key={g.gate} className="border-b border-white/5 hover:bg-white/[0.03]">
                  <td className="py-2 px-2 text-white font-medium">{g.gate}</td>
                  <td className="py-2 px-2 text-emerald-400 font-semibold">{g.entries.toLocaleString()}</td>
                  <td className="py-2 px-2 text-blue-400">{g.exits.toLocaleString()}</td>
                  <td className="py-2 px-2 text-slate-300">{g.vehicles}</td>
                  <td className="py-2 px-2 text-white">{g.guards}</td>
                  <td className={cn('py-2 px-2 capitalize', statusColors[g.status])}>{g.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'incidents' && (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5 overflow-x-auto">
          <h3 className="text-sm font-semibold text-white mb-3">Security Incidents (This Month)</h3>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/10">
              {['ID', 'Type', 'Location', 'Date', 'Severity', 'Status'].map(h => (
                <th key={h} className="text-left py-2 px-2 text-[10px] uppercase tracking-wider text-slate-500">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {SECURITY_INCIDENTS.map(i => (
                <tr key={i.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                  <td className="py-2 px-2 text-blue-400 font-mono text-xs">{i.id}</td>
                  <td className="py-2 px-2 text-white">{i.type}</td>
                  <td className="py-2 px-2 text-slate-300">{i.location}</td>
                  <td className="py-2 px-2 text-slate-400">{i.date}</td>
                  <td className="py-2 px-2"><Badge variant={i.severity === 'High' ? 'destructive' : i.severity === 'Medium' ? 'warning' : 'default'}>{i.severity}</Badge></td>
                  <td className={cn('py-2 px-2 capitalize', statusColors[i.status] || 'text-slate-400')}>{i.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {SECURITY_INCIDENTS.length === 0 && <p className="text-center text-slate-500 py-8">No incidents this month</p>}
        </div>
      )}

      {tab === 'patrols' && (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
          <h3 className="text-sm font-semibold text-white mb-3">Patrol Schedule (Today)</h3>
          <div className="space-y-2">
            {PATROL_SCHEDULE.map((p, i) => (
              <div key={i} className="flex items-center gap-4 border-b border-white/5 pb-2">
                <span className="text-xs text-slate-500 w-12 shrink-0 font-mono">{p.time}</span>
                <div className={cn('w-2 h-2 rounded-full shrink-0', p.status === 'completed' ? 'bg-emerald-500' : p.status === 'in_progress' ? 'bg-blue-500 animate-pulse' : 'bg-slate-600')} />
                <div className="flex-1">
                  <p className="text-sm text-white">{p.zone}</p>
                  <p className="text-xs text-slate-500">Guard: {p.guard}</p>
                </div>
                <span className={cn('text-xs capitalize', statusColors[p.status])}>{p.status.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
