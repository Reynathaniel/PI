import * as React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const v: Record<string, string> = {
    default: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    secondary: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    destructive: 'bg-red-500/20 text-red-400 border-red-500/30',
    outline: 'bg-transparent border-white/20 text-white',
    success: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  };
  return (
    <div className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold', v[variant], className)} {...props} />
  );
}

export { Badge };
