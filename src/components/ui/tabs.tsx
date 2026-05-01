'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';

const TabsContext = React.createContext<{ value: string; onChange: (v: string) => void }>({ value: '', onChange: () => {} });

function Tabs({ value, onValueChange, defaultValue, children, className }: {
  value?: string; onValueChange?: (v: string) => void; defaultValue?: string;
  children: React.ReactNode; className?: string;
}) {
  const [internal, setInternal] = React.useState(defaultValue || '');
  return (
    <TabsContext.Provider value={{ value: value ?? internal, onChange: onValueChange ?? setInternal }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

function TabsList({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('inline-flex items-center gap-1 rounded-lg bg-white/5 p-1', className)}>{children}</div>;
}

function TabsTrigger({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  const ctx = React.useContext(TabsContext);
  return (
    <button
      className={cn('inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-all cursor-pointer',
        ctx.value === value ? 'bg-white/15 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-white/5', className)}
      onClick={() => ctx.onChange(value)}
    >{children}</button>
  );
}

function TabsContent({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  const ctx = React.useContext(TabsContext);
  if (ctx.value !== value) return null;
  return <div className={cn('mt-2', className)}>{children}</div>;
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
