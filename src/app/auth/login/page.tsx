'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else window.location.href = '/';
    } else {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: email.split('@')[0] } }
      });
      if (error) setError(error.message);
      else setError('Check your email for confirmation link!');
    }

    setLoading(false);
  };

  // Demo login (skip auth for development)
  const handleDemoLogin = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white text-3xl shadow-lg shadow-blue-500/25 mb-4">π</div>
          <h1 className="text-2xl font-bold text-white">Project Intelligence</h1>
          <p className="text-slate-400 mt-1 text-sm">EPC Management System</p>
        </div>

        {/* Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-6 space-y-4">
            <div>
              <label className="text-xs text-slate-400 uppercase tracking-wider mb-1 block">Email</label>
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 focus-within:border-blue-500/50">
                <Mail size={16} className="text-slate-500" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com"
                  className="bg-transparent border-none outline-none text-sm text-white placeholder:text-slate-500 w-full" required />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 uppercase tracking-wider mb-1 block">Password</label>
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 focus-within:border-blue-500/50">
                <Lock size={16} className="text-slate-500" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                  className="bg-transparent border-none outline-none text-sm text-white placeholder:text-slate-500 w-full" required />
              </div>
            </div>

            {error && (
              <p className={`text-xs ${error.includes('Check your email') ? 'text-emerald-400' : 'text-red-400'}`}>{error}</p>
            )}

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : <ArrowRight size={16} className="mr-2" />}
              {mode === 'login' ? 'Sign In' : 'Sign Up'}
            </Button>
          </div>
        </form>

        <div className="text-center">
          <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-sm text-slate-400 hover:text-white cursor-pointer">
            {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>

        {/* Demo Mode */}
        <div className="border-t border-white/10 pt-4">
          <button onClick={handleDemoLogin}
            className="w-full py-2.5 rounded-lg border border-white/10 bg-white/5 text-sm text-slate-300 hover:bg-white/10 transition-colors cursor-pointer">
            🚀 Enter Demo Mode (No login required)
          </button>
        </div>
      </div>
    </div>
  );
}
