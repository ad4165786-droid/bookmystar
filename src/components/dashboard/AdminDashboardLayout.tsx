import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Users, 
  Calendar, 
  CreditCard, 
  Percent, 
  LifeBuoy, 
  ShieldAlert, 
  Bell, 
  FileSpreadsheet, 
  Lock, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight,
  Server,
  Sparkles
} from 'lucide-react';

// Child views
import { AdminOverview } from '../admin/AdminOverview';
import { AdminUsers } from '../admin/AdminUsers';
import { AdminInfluencers } from '../admin/AdminInfluencers';
import { AdminBookings } from '../admin/AdminBookings';
import { AdminPayments } from '../admin/AdminPayments';
import { AdminCommission } from '../admin/AdminCommission';
import { AdminGrievances } from '../admin/AdminGrievances';
import { AdminModeration } from '../admin/AdminModeration';
import { AdminAnnouncements } from '../admin/AdminAnnouncements';
import { AdminReports } from '../admin/AdminReports';
import { AdminAuditRoles } from '../admin/AdminAuditRoles';

export const AdminDashboardLayout: React.FC = () => {
  const { 
    currentAdmin, 
    currentPath,
    navigate,
    activeView, 
    setActiveView, 
    logout, 
    notifications,
    showToast 
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const navItems = [
    { path: '/admin/dashboard', id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { path: '/admin/users', id: 'users', label: 'User Directory', icon: Users },
    { path: '/admin/creators', id: 'influencers', label: 'Creator Verification', icon: ShieldCheck },
    { path: '/admin/bookings', id: 'bookings', label: 'Call Bookings & Privacy', icon: Calendar },
    { path: '/admin/payments', id: 'payments', label: 'Payments & Payouts', icon: CreditCard },
    { path: '/admin/commission', id: 'commission', label: 'Commission Rules', icon: Percent },
    { path: '/admin/grievances', id: 'grievances', label: 'Grievance Desk', icon: LifeBuoy },
    { path: '/admin/moderation', id: 'moderation', label: 'Content Moderation', icon: ShieldAlert },
    { path: '/admin/announcements', id: 'announcements', label: 'Broadcast Notices', icon: Bell },
    { path: '/admin/reports', id: 'reports', label: 'Reports & CSV Export', icon: FileSpreadsheet },
    { path: '/admin/audit', id: 'audit', label: 'Security & Audit Log', icon: Lock },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col lg:flex-row font-sans selection:bg-brand-500 selection:text-white">
      
      {/* 1. Left Sidebar for Admin Console */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-slate-950 text-white flex flex-col justify-between transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
        mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
      }`}>
        
        {/* Top: Logo & Operator Identity */}
        <div>
          {/* Logo Bar */}
          <div className="h-18 p-5 border-b border-slate-800 flex items-center justify-between">
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => {
                setActiveView('overview');
                navigate('/admin/dashboard');
              }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-brand-600 flex items-center justify-center text-white shadow-orange-glow">
                <ShieldCheck className="w-5 h-5 fill-white" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-white">
                  BookMy<span className="text-amber-400">Star</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider block text-amber-400">
                  Operations Console
                </span>
              </div>
            </div>

            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Admin Operator Badge */}
          <div className="p-4 mx-4 my-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-sm">
                A
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-white truncate">{currentAdmin?.name || 'Administrator'}</h4>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <p className="text-[11px] text-amber-300 font-medium truncate">{currentAdmin?.role || 'Super Admin'}</p>
                <div className="mt-1 text-[10px] text-slate-400 font-mono">
                  Level {currentAdmin?.accessLevel || 4} • Full Permissions
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-0.5 max-h-[calc(100vh-270px)] overflow-y-auto">
            <span className="px-3 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Management Modules
            </span>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom: Logout */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of Admin Console</span>
          </button>
        </div>

      </aside>

      {/* Backdrop for mobile */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/60 z-30 lg:hidden"
        />
      )}

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        
        {/* Top Header */}
        <header className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                Operations & Governance Center
              </h2>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                KYC approvals, live call diagnostics, escrow disbursements, and platform audit records.
              </p>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-slate-700">
              <Server className="w-3.5 h-3.5 text-brand-600" />
              <span>Root Privileges Active</span>
            </div>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className="relative p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {notifications.length}
                </span>
              </button>

              {showNotifDropdown && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-slate-200 shadow-soft-lg p-4 z-50 animate-fadeIn">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-900">System Activity</span>
                    <span className="text-[10px] text-slate-400">{notifications.length} notices</span>
                  </div>
                  <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
                    {notifications.slice(0, 4).map(n => (
                      <div key={n.id} className="p-2 rounded-xl bg-slate-50 text-xs">
                        <div className="font-semibold text-slate-900">{n.title}</div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Dynamic Views */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {currentPath === '/admin/users' && <AdminUsers />}
          {currentPath === '/admin/creators' && <AdminInfluencers />}
          {currentPath === '/admin/bookings' && <AdminBookings />}
          {currentPath === '/admin/payments' && <AdminPayments />}
          {currentPath === '/admin/commission' && <AdminCommission />}
          {currentPath === '/admin/grievances' && <AdminGrievances />}
          {currentPath === '/admin/moderation' && <AdminModeration />}
          {currentPath === '/admin/announcements' && <AdminAnnouncements />}
          {currentPath === '/admin/reports' && <AdminReports />}
          {currentPath === '/admin/audit' && <AdminAuditRoles />}
          {(currentPath === '/admin/dashboard' || (currentPath !== '/admin/users' && currentPath !== '/admin/creators' && currentPath !== '/admin/bookings' && currentPath !== '/admin/payments' && currentPath !== '/admin/commission' && currentPath !== '/admin/grievances' && currentPath !== '/admin/moderation' && currentPath !== '/admin/announcements' && currentPath !== '/admin/reports' && currentPath !== '/admin/audit')) && (
            <AdminOverview />
          )}
        </main>

      </div>

    </div>
  );
};

