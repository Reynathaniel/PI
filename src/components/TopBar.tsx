'use client';
import { Bell } from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import { MODULES } from './Sidebar';
import type { UserRole } from '@/types';

const DEMO_ROLES: UserRole[] = [
  'Project Director', 'Project Manager', 'HSE Manager', 'Planning Engineer',
  'Construction Manager', 'QA Manager', 'Finance Manager', 'Super Admin',
];

export default function TopBar() {
  const { activeModule, currentRole, setCurrentRole } = useAppStore();
  const title = MODULES.find(m => m.id === activeModule)?.label || 'Overview';

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-[#0d1117]/80 backdrop-blur-sm shrink-0">
      <h2 className="text-sm font-semibold text-white">{title}</h2>
      <div className="flex items-center gap-4">
        <select value={currentRole} onChange={e => setCurrentRole(e.target.value as UserRole)}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none cursor-pointer">
          {DEMO_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <button className="relative text-slate-400 hover:text-white cursor-pointer">
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[8px] flex items-center justify-center text-white font-bold">5</span>
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
          {currentRole.split(' ').map(w => w[0]).join('').slice(0, 2)}
        </div>
      </div>
    </header>
  );
}
