'use client';
import { useState } from 'react';
import {
  LayoutDashboard, ShieldCheck, GanttChart, FileText, DollarSign,
  Package, ClipboardCheck, Users, Wrench, Lock, Settings,
  ChevronLeft, ChevronRight, ChevronDown, Search, FolderOpen, HardHat, Ruler,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/stores/useAppStore';

interface ModuleItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  group: string;
}

const MODULES: ModuleItem[] = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} />, group: 'Main' },
  { id: 'hsse', label: 'HSSE Manager', icon: <ShieldCheck size={18} />, group: 'Main' },
  { id: 'planning', label: 'Planning & Scheduling', icon: <GanttChart size={18} />, group: 'Main' },
  { id: 'engineering', label: 'Engineering', icon: <Ruler size={18} />, group: 'Execution' },
  { id: 'daily-reports', label: 'Daily Reports', icon: <FileText size={18} />, group: 'Operations' },
  { id: 'document-control', label: 'Document Control', icon: <FolderOpen size={18} />, group: 'Operations' },
  { id: 'cost-control', label: 'Cost Control', icon: <DollarSign size={18} />, group: 'Controls' },
  { id: 'procurement', label: 'Procurement', icon: <Package size={18} />, group: 'Supply Chain' },
  { id: 'qc', label: 'Quality Control', icon: <ClipboardCheck size={18} />, group: 'Quality' },
  { id: 'hr', label: 'HR & Admin', icon: <Users size={18} />, group: 'Support' },
  { id: 'finance', label: 'Finance', icon: <DollarSign size={18} />, group: 'Support' },
  { id: 'commissioning', label: 'Commissioning', icon: <Wrench size={18} />, group: 'Execution' },
  { id: 'security', label: 'Security', icon: <Lock size={18} />, group: 'Safety' },
  { id: 'admin', label: 'Admin Panel', icon: <Settings size={18} />, group: 'System' },
];

const GROUPS = [...new Set(MODULES.map(m => m.group))];

export default function Sidebar() {
  const { activeModule, setActiveModule, sidebarOpen, toggleSidebar } = useAppStore();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(GROUPS));
  const [search, setSearch] = useState('');

  const toggleGroup = (g: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      next.has(g) ? next.delete(g) : next.add(g);
      return next;
    });
  };

  const filtered = MODULES.filter(m => m.label.toLowerCase().includes(search.toLowerCase()));

  return (
    <aside className={cn('flex flex-col border-r border-white/10 bg-[#0d1117] shrink-0 transition-all duration-200', sidebarOpen ? 'w-[260px]' : 'w-16')}>
      {/* Logo */}
      <div className="flex items-center gap-3 p-4 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white text-xl shrink-0 shadow-lg shadow-blue-500/20">π</div>
        {sidebarOpen && (
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-white leading-tight">Project Intelligence</p>
            <p className="text-[10px] text-slate-500">EPC Management System</p>
          </div>
        )}
      </div>

      {/* Search */}
      {sidebarOpen && (
        <div className="p-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
            <Search size={14} className="text-slate-500 shrink-0" />
            <input type="text" placeholder="Search modules..." value={search} onChange={e => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-xs text-white placeholder:text-slate-500 w-full" />
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 px-2">
        {GROUPS.map(group => {
          const items = filtered.filter(m => m.group === group);
          if (!items.length) return null;
          return (
            <div key={group} className="mb-1">
              {sidebarOpen && (
                <button onClick={() => toggleGroup(group)}
                  className="flex items-center justify-between w-full px-2 py-1 text-[10px] uppercase tracking-wider text-slate-500 hover:text-slate-300 cursor-pointer">
                  <span>{group}</span>
                  <ChevronDown size={12} className={cn('transition-transform', !expandedGroups.has(group) && '-rotate-90')} />
                </button>
              )}
              {(expandedGroups.has(group) || !sidebarOpen) && items.map(mod => (
                <button key={mod.id} onClick={() => setActiveModule(mod.id)}
                  className={cn('flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm transition-colors cursor-pointer mb-0.5',
                    activeModule === mod.id
                      ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                  )} title={mod.label}>
                  <span className="shrink-0">{mod.icon}</span>
                  {sidebarOpen && <span className="truncate">{mod.label}</span>}
                </button>
              ))}
            </div>
          );
        })}
      </nav>

      {/* Toggle */}
      <div className="border-t border-white/10 p-3">
        <button onClick={toggleSidebar} className="flex items-center justify-center w-full py-1.5 rounded-lg hover:bg-white/5 text-slate-400 cursor-pointer">
          {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>
    </aside>
  );
}

export { MODULES };
