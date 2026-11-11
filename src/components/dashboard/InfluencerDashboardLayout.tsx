import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  LayoutDashboard, 
  Image, 
  Clock, 
  Calendar, 
  Wallet, 
  LogOut, 
  Bell, 
  Menu, 
  X, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight
} from 'lucide-react';

// Child views
import { InfluencerDashboard } from '../influencer/InfluencerDashboard';
import { InfluencerContentProfile } from '../influencer/InfluencerContentProfile';
import { InfluencerPricingSchedule } from '../influencer/InfluencerPricingSchedule';
import { InfluencerBookings } from '../influencer/InfluencerBookings';
import { InfluencerEarningsPayouts } from '../influencer/InfluencerEarningsPayouts';

export const InfluencerDashboardLayout: React.FC = () => {
  const { 
    currentInfluencer, 
    activeView, 
    setActiveView, 
    logout, 
    notifications,
    showToast 
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const unreadNotifs = notifications.filter(n => 
    !n.read && (n.targetAudience === 'all' || n.targetAudience === 'influencers' || n.recipientId === currentInfluencer?.id)
  );

  const navItems = [
    { id: 'dashboard', label: 'Studio Overview', icon: LayoutDashboard },
    { id: 'profile-content', label: 'Profile & Portfolio', icon: Image },
    { id: 'availability', label: 'Availability & Slots', icon: Clock },
    { id: 'bookings', label: 'Fan Bookings', icon: Calendar },
    { id: 'payouts', label: 'Earnings & Payouts', icon: Wallet },
  ];

  return (
    <div className="min-h-screen bg-[#F3EEFF] text-slate-900 flex flex-col lg:flex-row font-sans selection:bg-[#7047EB] selection:text-white">
      
      {/* 1. Left Sidebar for Influencer Portal */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-[#1A0F35] text-white border-r border-[#2C1959] flex flex-col justify-between transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
        mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
      }`}>
        
        {/* Top: Logo & Creator Identity */}
        <div>
          {/* Logo Bar */}
          <div className="h-18 p-5 border-b border-[#2C1959] flex items-center justify-between">
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setActiveView('dashboard')}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7047EB] via-[#9466F2] to-amber-400 flex items-center justify-center text-white shadow-[0_4px_20px_rgba(112,71,235,0.4)]">
                <Sparkles className="w-5 h-5 fill-white" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-white">
                  BookMy<span className="text-[#B892F7]">Star</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider block text-[#B892F7]">
                  Creator Studio
                </span>
              </div>
            </div>

            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-purple-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Creator Profile Mini Badge */}
          <div className="p-4 mx-4 my-4 rounded-2xl bg-[#241548] border border-[#3A2272]">
            <div className="flex items-center gap-3">
              <img
                src={currentInfluencer?.avatar || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=300&auto=format&fit=crop&q=80'}
                alt={currentInfluencer?.name || 'Creator'}
                className="w-11 h-11 rounded-xl object-cover ring-2 ring-[#7047EB]"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-white truncate">{currentInfluencer?.name}</h4>
                  {currentInfluencer?.isVerified && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-[#B892F7] font-medium truncate">{currentInfluencer?.handle}</p>
                <div className="mt-1 flex items-center gap-1.5 text-[10px] text-purple-300/80">
                  <span>Bal: ₹{currentInfluencer?.pendingBalance.toLocaleString('en-IN')}</span>
                  <span>•</span>
                  <span>{currentInfluencer?.completedCallsCount} Calls</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            <span className="px-3 text-[10px] uppercase font-bold text-purple-400/70 tracking-wider">
              Creator Navigation
            </span>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#7047EB] to-[#865BF5] text-white shadow-[0_4px_16px_rgba(112,71,235,0.4)]'
                      : 'text-purple-200/80 hover:text-white hover:bg-[#281850]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-purple-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom: Logout */}
        <div className="p-4 border-t border-[#2C1959]">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of Studio</span>
          </button>
        </div>

      </aside>

      {/* Backdrop for mobile */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-[#120924]/60 z-30 lg:hidden"
        />
      )}

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        
        {/* Top Header */}
        <header className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur-md border-b border-purple-100 px-4 sm:px-8 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-purple-900 hover:bg-purple-50"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                Creator Studio • {currentInfluencer?.name}
              </h2>
              <p className="text-[11px] text-purple-700/70 hidden sm:block">
                Manage rates, upcoming fan calls, live rooms, and payout balance.
              </p>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            
            {/* Verification Status Pill */}
            {currentInfluencer?.isVerified ? (
              <span className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Creator</span>
              </span>
            ) : (
              <span className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>KYC Pending Review</span>
              </span>
            )}

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className="relative p-2 rounded-xl bg-purple-50 hover:bg-purple-100/80 text-[#7047EB] border border-purple-200 transition-colors"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#7047EB] text-white text-[9px] font-bold flex items-center justify-center">
                    {unreadNotifs.length}
                  </span>
                )}
              </button>

              {showNotifDropdown && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-purple-100 shadow-xl p-4 z-50 animate-fadeIn">
                  <div className="flex items-center justify-between pb-2 border-b border-purple-100">
                    <span className="text-xs font-bold text-slate-900">Studio Alerts</span>
                    <span className="text-[10px] text-purple-600 font-semibold">{unreadNotifs.length} new</span>
                  </div>
                  <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
                    {notifications.slice(0, 4).map(n => (
                      <div key={n.id} className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100 text-xs">
                        <div className="font-semibold text-slate-900">{n.title}</div>
                        <p className="text-[11px] text-slate-600 mt-0.5">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Views */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {activeView === 'dashboard' && <InfluencerDashboard />}
          {activeView === 'profile-content' && <InfluencerContentProfile />}
          {activeView === 'availability' && <InfluencerPricingSchedule />}
          {activeView === 'bookings' && <InfluencerBookings />}
          {activeView === 'payouts' && <InfluencerEarningsPayouts />}
        </main>

      </div>

    </div>
  );
};

