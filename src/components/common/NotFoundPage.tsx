import React from 'react';
import { useApp } from '../../context/AppContext';
import { Compass, ArrowLeft, Home, Sparkles, ShieldCheck } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { currentPath, navigate, isAuthenticated, currentRole } = useApp();

  const handleDashboardRedirect = () => {
    if (currentRole === 'user') navigate('/fan/dashboard');
    else if (currentRole === 'influencer') navigate('/influencer/dashboard');
    else if (currentRole === 'admin') navigate('/admin/dashboard');
    else navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between font-sans selection:bg-brand-500 selection:text-white">
      {/* Top Bar */}
      <header className="w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white shadow-orange-glow">
            <Sparkles className="w-5 h-5 fill-white" />
          </div>
          <div>
            <span className="font-extrabold text-lg text-slate-900">
              BookMy<span className="text-brand-600">Star</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-400">
              Navigation Error
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <Home className="w-4 h-4 text-brand-600" />
          <span>Go to Homepage</span>
        </button>
      </header>

      {/* Main 404 Center Card */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200/90 shadow-soft-lg p-8 sm:p-10 text-center space-y-6 relative overflow-hidden">
          {/* Subtle Top Accent bar */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-brand-600 via-orange-500 to-amber-500" />

          {/* 404 Icon Badge */}
          <div className="w-20 h-20 rounded-3xl bg-orange-50 border border-orange-100 text-brand-600 flex items-center justify-center mx-auto shadow-sm">
            <Compass className="w-10 h-10 text-brand-600 animate-pulse" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 bg-orange-50 border border-brand-200 px-3 py-1 rounded-full uppercase tracking-wider">
              <span>Error 404</span>
              <span>•</span>
              <span>Page Not Found</span>
            </div>
            
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Lost in the Galaxy?
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
              The page or route you were trying to access{' '}
              <code className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-800 font-mono text-xs font-bold border border-slate-200">
                {currentPath || window.location.pathname}
              </code>{' '}
              does not exist or has been relocated in our updated directory structure.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                if (window.history.length > 1) {
                  window.history.back();
                } else {
                  navigate('/');
                }
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go Back</span>
            </button>

            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleDashboardRedirect}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-orange-glow transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  Return to{' '}
                  {currentRole === 'user' ? 'Fan Dashboard' : currentRole === 'influencer' ? 'Creator Studio' : 'Admin Console'}
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-orange-glow transition-all flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                <span>Return to Homepage</span>
              </button>
            )}
          </div>

          {/* Escrow Guarantee note */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
            <span>BookMyStar • India's #1 Verified Influencer Call Network</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-slate-400 border-t border-slate-100 bg-white">
        © 2026 BookMyStar Technologies Pvt. Ltd. All rights reserved.
      </footer>
    </div>
  );
};

