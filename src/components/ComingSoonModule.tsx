'use client';
import { Activity, Zap } from 'lucide-react';

export default function ComingSoonModule({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-6">
        <div className="mx-auto w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
          <Zap size={36} className="text-blue-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">{name}</h2>
          <p className="text-slate-400 max-w-md mx-auto">
            Module ini sedang dalam pengembangan aktif. Fitur lengkap akan segera tersedia
            sebagai bagian dari sistem π Project Intelligence.
          </p>
        </div>
        <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
          <Activity size={14} />
          <span>Under Active Development</span>
        </div>
      </div>
    </div>
  );
}
