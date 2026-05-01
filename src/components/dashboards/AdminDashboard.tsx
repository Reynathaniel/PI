'use client';
import { useState } from 'react';
import { Settings, Users, Shield, Database, Activity, Key, Globe, Server } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { getRolesByGroup } from '@/config/roleRegistry';

const KPI = {
  totalUsers: 248, activeUsers: 234, inactiveUsers: 14,
  rolesConfigured: 96, modulesActive: 14,
  loginToday: 186, loginWeek: 228,
  dbSize: '2.4 GB', apiCalls: '12,847',
  uptime: 99.92, lastBackup: '26 Apr 2026, 03:00',
};

const ACTIVE_SESSIONS = [
  { user: 'Ahmad Rizal', role: 'Site Manager', module: 'Daily Reports', lastActive: '2 min ago', ip: '10.0.1.42' },
  { user: 'Sarah Chen', role: 'Project Controls Manager', module: 'Cost Control', lastActive: '5 min ago', ip: '10.0.1.88' },
  { user: 'Budi Santoso', role: 'HSE Manager', module: 'HSSE Manager', lastActive: '8 min ago', ip: '10.0.2.15' },
  { user: 'James Wilson', role: 'Project Director', module: 'Overview', lastActive: '12 min ago', ip: '10.0.1.10' },
  { user: 'Dewi Putri', role: 'QA Manager', module: 'Quality Control', lastActive: '15 min ago', ip: '10.0.3.22' },
  { user: 'Rudi Hartono', role: 'Planning Engineer', module: 'Planning', lastActive: '18 min ago', ip: '10.0.2.34' },
];

const AUDIT_LOG = [
  { time: '16:42', user: 'Ahmad Rizal', action: 'Submitted Daily Report DR-2026-116', module: 'Daily Reports', level: 'info' },
  { time: '16:38', user: 'Sarah Chen', action: 'Approved Change Order CO-014', module: 'Cost Control', level: 'info' },
  { time: '16:25', user: 'Budi Santoso', action: 'Closed Incident INC-2026-042', module: 'HSSE', level: 'info' },
  { time: '16:12', user: 'System', action: 'Auto-backup completed successfully', module: 'System', level: 'success' },
  { time: '15:58', user: 'Dewi Putri', action: 'Raised NCR-089 for weld defect', module: 'QC', level: 'warning' },
  { time: '15:45', user: 'Admin', action: 'User Agus Wijaya role changed to Supervisor', module: 'Admin', level: 'info' },
  { time: '15:30', user: 'System', action: 'Certificate expiry alert: 5 certs expiring in 14 days', module: 'System', level: 'warning' },
];

const MODULE_USAGE = [
  { module: 'Overview', views: 2456, users: 186 },
  { module: 'HSSE Manager', views: 1842, users: 124 },
  { module: 'Daily Reports', views: 1654, users: 98 },
  { module: 'Planning', views: 1245, users: 86 },
  { module: 'Cost Control', views: 984, users: 42 },
  { module: 'Quality Control', views: 876, users: 56 },
  { module: 'Procurement', views: 654, users: 38 },
  { module: 'Document Control', views: 542, users: 45 },
  { module: 'Engineering', views: 486, users: 32 },
  { module: 'HR & Admin', views: 345, users: 28 },
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

export default function AdminDashboard() {
  const [tab, setTab] = useState<'overview' | 'users' | 'roles' | 'audit'>('overview');
  const roleGroups = getRolesByGroup();
  const levelColors: Record<string, string> = { info: 'text-blue-400', success: 'text-emerald-400', warning: 'text-amber-400', error: 'text-red-400' };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2"><Settings size={22} className="text-slate-300" /> Admin Panel</h1>
          <p className="text-slate-400 text-sm mt-1">System Administration | 26 Apr 2026</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="success">Uptime: {KPI.uptime}%</Badge>
          <Badge variant="default">{KPI.activeUsers} Active Users</Badge>
        </div>
      </div>

      <div className="flex gap-1 bg-white/5 rounded-lg p-1">
        {(['overview', 'users', 'roles', 'audit'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={cn('px-3 py-1.5 rounded-md text-xs capitalize cursor-pointer transition-colors', tab === t ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5')}>
            {t === 'roles' ? 'Role Registry' : t === 'audit' ? 'Audit Log' : t}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KPICard label="Total Users" value={KPI.totalUsers.toString()} sub={`${KPI.activeUsers} active`} color="text-white" icon={<Users size={18} />} />
            <KPICard label="Logins Today" value={KPI.loginToday.toString()} sub={`${KPI.loginWeek} this week`} color="text-blue-400" icon={<Key size={18} />} />
            <KPICard label="System Uptime" value={`${KPI.uptime}%`} sub={`Backup: ${KPI.lastBackup.split(',')[0]}`} color="text-emerald-400" icon={<Server size={18} />} />
            <KPICard label="API Calls (24h)" value={KPI.apiCalls} sub={`DB size: ${KPI.dbSize}`} color="text-cyan-400" icon={<Activity size={18} />} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Active Sessions</h3>
              <div className="space-y-2">
                {ACTIVE_SESSIONS.slice(0, 5).map((s, i) => (
                  <div key={i} className="flex items-center gap-3 border-b border-white/5 pb-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <span className="text-sm text-white truncate">{s.user}</span>
                        <span className="text-[10px] text-slate-500 shrink-0">{s.lastActive}</span>
                      </div>
                      <p className="text-[10px] text-slate-500">{s.role} → {s.module}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Module Usage (This Month)</h3>
              <div className="space-y-2">
                {MODULE_USAGE.slice(0, 6).map(m => (
                  <div key={m.module} className="flex items-center gap-3">
                    <span className="text-xs text-slate-300 w-28 shrink-0 truncate">{m.module}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-blue-500/60" style={{ width: `${(m.views / MODULE_USAGE[0].views) * 100}%` }} />
                    </div>
                    <span className="text-[10px] text-slate-500 w-12 text-right">{m.views}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'users' && (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5 overflow-x-auto">
          <h3 className="text-sm font-semibold text-white mb-3">Online Users</h3>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/10">
              {['User', 'Role', 'Current Module', 'Last Active', 'IP Address'].map(h => (
                <th key={h} className="text-left py-2 px-2 text-[10px] uppercase tracking-wider text-slate-500">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {ACTIVE_SESSIONS.map((s, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/[0.03]">
                  <td className="py-2 px-2 text-white">{s.user}</td>
                  <td className="py-2 px-2 text-slate-300">{s.role}</td>
                  <td className="py-2 px-2 text-blue-400">{s.module}</td>
                  <td className="py-2 px-2 text-slate-400">{s.lastActive}</td>
                  <td className="py-2 px-2 text-slate-500 font-mono text-xs">{s.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'roles' && (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
          <h3 className="text-sm font-semibold text-white mb-1">Role Registry ({KPI.rolesConfigured} roles configured)</h3>
          <p className="text-xs text-slate-500 mb-4">RBAC foundation for all module access control</p>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {Object.entries(roleGroups).map(([group, roles]) => (
              <div key={group}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">{group}</span>
                  <Badge variant="default">{roles.length} roles</Badge>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                  {roles.map(r => (
                    <div key={r.role} className="rounded-lg border border-white/5 bg-white/[0.02] p-2 hover:bg-white/[0.05] transition-colors">
                      <div className="flex items-center gap-2">
                        <span className={cn('text-xs font-mono', r.color)}>{r.shortLabel}</span>
                        <span className="text-xs text-white truncate">{r.label}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5 truncate">{r.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'audit' && (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
          <h3 className="text-sm font-semibold text-white mb-3">Audit Trail (Today)</h3>
          <div className="space-y-2">
            {AUDIT_LOG.map((a, i) => (
              <div key={i} className="flex items-start gap-3 border-b border-white/5 pb-2">
                <span className="text-xs text-slate-500 font-mono w-12 shrink-0">{a.time}</span>
                <div className={cn('w-1.5 h-1.5 rounded-full mt-1.5 shrink-0', a.level === 'success' ? 'bg-emerald-500' : a.level === 'warning' ? 'bg-amber-500' : a.level === 'error' ? 'bg-red-500' : 'bg-blue-500')} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-300">{a.action}</p>
                  <div className="flex gap-2 text-[10px] text-slate-500 mt-0.5">
                    <span>{a.user}</span>
                    <span>•</span>
                    <span>{a.module}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
