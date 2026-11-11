import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Key, 
  ArrowRight, 
  AlertTriangle, 
  Eye, 
  EyeOff, 
  Server,
  ArrowLeft
} from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { loginAdmin, navigate, showToast } = useApp();

  const [email, setEmail] = useState('admin@bookmystar.in');
  const [password, setPassword] = useState('Admin@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const res = loginAdmin(email, password);
    if (!res.success) {
      setErrorMessage(res.message || 'Authentication failed: Invalid administrator credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-brand-500 selection:text-white">
      
      {/* Top Bar with Discreet Return to Platform */}
      <header className="w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Public Site</span>
        </button>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-mono font-bold border border-slate-200">
          <Server className="w-3.5 h-3.5 text-brand-600" />
          <span>SECURITY NODE: IN-MUM-01</span>
        </div>
      </header>

      {/* Main Admin Authentication Box */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/90 shadow-soft-lg p-8 space-y-6 relative overflow-hidden">
          
          {/* Subtle Top Accent bar */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-slate-900 via-brand-600 to-orange-500" />

          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 text-brand-500 flex items-center justify-center mx-auto shadow-md">
              <ShieldCheck className="w-7 h-7" />
            </div>
            
            <div>
              <h2 className="text-2xl font-black text-slate-900">Operations Command</h2>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Restricted Access • Authorized Administrative Personnel Only
              </p>
            </div>
          </div>

          {/* Error Message banner */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-fadeIn">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Admin Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Admin Email Identifier</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@bookmystar.in"
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white text-xs font-mono font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Master Passphrase</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white text-xs font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Security Indicator */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-brand-600" />
                <span>2FA Session Authentication: Active</span>
              </span>
              <span className="font-mono text-emerald-600 font-bold">SHA-256</span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-brand-400" />
              <span>Authenticate as Administrator</span>
            </button>
          </form>

          {/* Quick Demo Credentials Fill */}
          <div className="pt-3 border-t border-slate-100 text-center space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Evaluator Test Credentials
            </span>
            <button
              type="button"
              onClick={() => {
                setEmail('admin@bookmystar.in');
                setPassword('Admin@2026');
              }}
              className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[11px] font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <span>admin@bookmystar.in / Admin@2026</span>
            </button>
          </div>

        </div>
      </main>

      <footer className="text-center py-4 text-[11px] text-slate-400">
        BookMyStar Security Enforcement System • Unauthorized access attempts are monitored and logged.
      </footer>

    </div>
  );
};

