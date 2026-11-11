import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  Compass, 
  Calendar, 
  LifeBuoy, 
  User, 
  LogOut, 
  Bell, 
  Menu, 
  X, 
  ShieldCheck,
  CreditCard,
  ChevronRight
} from 'lucide-react';

// Child views
import { UserHome } from '../user/UserHome';
import { InfluencerDetailView } from '../user/InfluencerDetailView';
import { UserBookings } from '../user/UserBookings';
import { UserGrievances } from '../user/UserGrievances';
import { UserProfileSettings } from '../user/UserProfileSettings';

export const UserDashboardLayout: React.FC = () => {
  const { 
    currentUser, 
    currentPath,
    navigate,
    activeView, 
    setActiveView, 
    selectedInfluencerId, 
    setSelectedInfluencerId,
    logout, 
    notifications,
    showToast 
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const unreadNotifs = notifications.filter(n => 
    !n.read && (n.targetAudience === 'all' || n.targetAudience === 'users' || n.recipientId === currentUser?.id)
  );

  const navItems = [
    { path: '/fan/dashboard', id: 'explore', label: 'Explore Creators', icon: Compass },
    { path: '/fan/bookings', id: 'bookings', label: 'My Call Bookings', icon: Calendar },
    { path: '/fan/grievances', id: 'grievances', label: 'Help & Grievances', icon: LifeBuoy },
    { path: '/fan/profile', id: 'settings', label: 'Profile & Settings', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col lg:flex-row font-sans selection:bg-brand-500 selection:text-white">
      
      {/* 1. Left Sidebar for Fan Portal */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-200/90 flex flex-col justify-between transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
        mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
      }`}>
        
        {/* Top: Logo & User Identity */}
        <div>
          {/* Logo Bar */}
          <div className="h-18 p-5 border-b border-slate-100 flex items-center justify-between">
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => {
                setSelectedInfluencerId(null);
                setActiveView('explore');
                navigate('/fan/dashboard');
              }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white shadow-orange-glow">
                <Sparkles className="w-5 h-5 fill-white" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-slate-900">
                  BookMy<span className="text-brand-600">Star</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider block text-brand-600">
                  Fan Dashboard
                </span>
              </div>
            </div>

            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Mini Badge */}
          <div className="p-4 mx-4 my-4 rounded-2xl bg-gradient-to-br from-slate-50 to-orange-50/50 border border-slate-200/80">
            <div className="flex items-center gap-3">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                alt={currentUser?.name || 'User'}
                className="w-11 h-11 rounded-xl object-cover ring-2 ring-brand-500/30"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-slate-900 truncate">{currentUser?.name}</h4>
                <p className="text-[11px] text-slate-500 truncate">{currentUser?.email}</p>
                <div className="mt-1 flex items-center gap-1.5 text-[10px] text-brand-700 font-bold">
                  <span>Spent: ₹{currentUser?.totalSpent.toLocaleString('en-IN')}</span>
                  <span>•</span>
                  <span>{currentUser?.totalBookings} Calls</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            <span className="px-3 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Navigation
            </span>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = (currentPath === item.path) || (item.id === 'explore' && currentPath.startsWith('/fan/creators/'));
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(item.path);
                    if (item.id === 'explore') setSelectedInfluencerId(null);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-orange-glow'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
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
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

      </aside>

      {/* Backdrop for mobile */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/40 z-30 lg:hidden"
        />
      )}

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        
        {/* Top Sticky Header */}
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
                Welcome, {currentUser?.name.split(' ')[0]} 👋
              </h2>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Discover creators, schedule 1-on-1 sessions, and join live rooms.
              </p>
            </div>
          </div>

          {/* Right Header Badges & Actions */}
          <div className="flex items-center gap-3">
            
            {/* Currency Pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-emerald-700">
              <span>₹ INR</span>
            </div>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className="relative p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-600 text-white text-[9px] font-bold flex items-center justify-center">
                    {unreadNotifs.length}
                  </span>
                )}
              </button>

              {showNotifDropdown && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-slate-200 shadow-soft-lg p-4 z-50 animate-fadeIn">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-900">Notifications</span>
                    <span className="text-[10px] text-slate-400">{unreadNotifs.length} unread</span>
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
          </div>
        </header>

        {/* Dynamic User Views */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {currentPath.startsWith('/fan/creators/') && selectedInfluencerId && (
            <InfluencerDetailView />
          )}
          {currentPath === '/fan/bookings' && <UserBookings />}
          {currentPath === '/fan/grievances' && <UserGrievances />}
          {currentPath === '/fan/profile' && <UserProfileSettings />}
          {(currentPath === '/fan/dashboard' || (!currentPath.startsWith('/fan/creators/') && currentPath !== '/fan/bookings' && currentPath !== '/fan/grievances' && currentPath !== '/fan/profile')) && (
            <UserHome />
          )}
        </main>

      </div>

    </div>
  );
};

