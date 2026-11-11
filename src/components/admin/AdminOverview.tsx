import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Video, 
  ShieldCheck, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  DollarSign, 
  Wallet, 
  AlertCircle, 
  TrendingUp, 
  ArrowRight,
  LifeBuoy,
  FileText,
  Radio,
  SlidersHorizontal
} from 'lucide-react';

export const AdminOverview: React.FC = () => {
  const { 
    users, 
    influencers, 
    bookings, 
    payouts, 
    grievances, 
    settings, 
    setActiveView,
    navigate 
  } = useApp();

  const [dateRange, setDateRange] = useState<'today' | '7d' | '30d' | 'all'>('30d');

  // Key metrics calculation
  const totalRegisteredUsers = users.length;
  const totalInfluencers = influencers.length;
  const verifiedInfluencers = influencers.filter(i => i.isVerified).length;
  const pendingApprovals = influencers.filter(i => i.verificationStatus === 'pending').length;
  const totalBookings = bookings.length;
  const upcomingCalls = bookings.filter(b => b.bookingStatus === 'upcoming').length;
  const completedCalls = bookings.filter(b => b.bookingStatus === 'completed').length;
  
  const platformRevenue = bookings
    .filter(b => b.paymentStatus === 'success')
    .reduce((sum, b) => sum + b.commissionAmount, 0);

  const grossBookingValue = bookings
    .filter(b => b.paymentStatus === 'success')
    .reduce((sum, b) => sum + b.amount, 0);

  const pendingPayouts = payouts.filter(p => p.status === 'pending').length;
  const openGrievances = grievances.filter(g => g.status === 'open' || g.status === 'in_progress').length;

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Banner & Quick Links */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white">Platform Operations & Executive Dashboard</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            BookMyStar Command Center • Multi-Role Governance, Escrow Payments, and Safety
          </p>
        </div>

        {/* Date Filter Pills */}
        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setDateRange('today')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              dateRange === 'today' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setDateRange('7d')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              dateRange === '7d' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setDateRange('30d')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              dateRange === '30d' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => setDateRange('all')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              dateRange === 'all' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      {/* Quick Attention Action Bar (PDF Section 1: Quick links to pending approvals, payouts, grievances) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Verification Queue Pill */}
        <div
          onClick={() => {
            setActiveView('influencers');
            navigate('/admin/creators');
          }}
          className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 hover:border-amber-400 cursor-pointer transition-all flex items-center justify-between shadow-md group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                {pendingApprovals} Pending Verifications
              </div>
              <div className="text-[11px] text-amber-400/80">Review age & government ID docs</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
        </div>

        {/* Payout Queue Pill */}
        <div
          onClick={() => {
            setActiveView('payments');
            navigate('/admin/payments');
          }}
          className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 hover:border-purple-400 cursor-pointer transition-all flex items-center justify-between shadow-md group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                {pendingPayouts} Payout Requests
              </div>
              <div className="text-[11px] text-purple-400/80">Process creator withdrawals</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
        </div>

        {/* Open Grievances Pill */}
        <div
          onClick={() => {
            setActiveView('grievances');
            navigate('/admin/grievances');
          }}
          className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 hover:border-rose-400 cursor-pointer transition-all flex items-center justify-between shadow-md group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors">
                {openGrievances} Unresolved Cases
              </div>
              <div className="text-[11px] text-rose-400/80">Refund disputes & call failure reports</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-rose-400 group-hover:translate-x-1 transition-transform" />
        </div>

      </div>

      {/* 10 Summary KPI Cards (PDF Section 1) */}
      <div>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">10 Core Operational Metrics</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 block font-medium">1. Registered Users</span>
            <div className="text-2xl font-black text-white">{totalRegisteredUsers}</div>
            <div className="text-[10px] text-emerald-400">Fans on platform</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 block font-medium">2. Total Creators</span>
            <div className="text-2xl font-black text-white">{totalInfluencers}</div>
            <div className="text-[10px] text-purple-400">All registered stars</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 block font-medium">3. Verified Stars</span>
            <div className="text-2xl font-black text-sky-400">{verifiedInfluencers}</div>
            <div className="text-[10px] text-sky-400">Govt ID approved</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 block font-medium">4. Pending Approvals</span>
            <div className="text-2xl font-black text-amber-400">{pendingApprovals}</div>
            <div className="text-[10px] text-amber-400">Awaiting review</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 block font-medium">5. Total Bookings</span>
            <div className="text-2xl font-black text-white">{totalBookings}</div>
            <div className="text-[10px] text-slate-400">Calls registered</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 block font-medium">6. Upcoming Calls</span>
            <div className="text-2xl font-black text-brand-300">{upcomingCalls}</div>
            <div className="text-[10px] text-brand-400">Scheduled sessions</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 block font-medium">7. Completed Calls</span>
            <div className="text-2xl font-black text-emerald-400">{completedCalls}</div>
            <div className="text-[10px] text-emerald-400">Fully serviced</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 block font-medium">8. Platform Net Revenue</span>
            <div className="text-2xl font-black text-emerald-400">₹{Math.round(platformRevenue).toLocaleString('en-IN')}</div>
            <div className="text-[10px] text-slate-400">At {settings.commissionRate}% fee</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 block font-medium">9. Pending Payouts</span>
            <div className="text-2xl font-black text-purple-400">{pendingPayouts}</div>
            <div className="text-[10px] text-purple-400">Disbursals in queue</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 block font-medium">10. Open Grievances</span>
            <div className="text-2xl font-black text-rose-400">{openGrievances}</div>
            <div className="text-[10px] text-rose-400">Safety & support cases</div>
          </div>

        </div>
      </div>

      {/* Revenue Chart & Live Transactions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Interactive Volume Breakdown Chart (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Gross Booking Value & Growth</h3>
              <p className="text-xs text-slate-400">Daily booking volume across Voice & Video categories</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-black text-emerald-400">₹{grossBookingValue.toLocaleString('en-IN')}</div>
              <div className="text-[10px] text-slate-400">Total Transacted</div>
            </div>
          </div>

          {/* Bar Chart Simulation */}
          <div className="space-y-4 pt-2">
            <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-slate-800">
              {[
                { day: 'Nov 05', amount: 199, h: '25%' },
                { day: 'Nov 06', amount: 549, h: '45%' },
                { day: 'Nov 07', amount: 699, h: '60%' },
                { day: 'Nov 08', amount: 799, h: '70%' },
                { day: 'Nov 09', amount: 1198, h: '85%' },
                { day: 'Nov 10', amount: 1498, h: '95%' },
                { day: 'Nov 11', amount: 499, h: '40%' }
              ].map(item => (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <div className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                    ₹{item.amount}
                  </div>
                  <div
                    className="w-full max-w-[32px] rounded-t-lg bg-gradient-to-t from-brand-600 via-purple-600 to-amber-400 group-hover:brightness-125 transition-all"
                    style={{ height: item.h }}
                  />
                  <span className="text-[10px] text-slate-400">{item.day}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 px-2">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-brand-500 inline-block" />
                Video Sessions (68%)
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                Voice Sessions (32%)
              </span>
            </div>
          </div>
        </div>

        {/* Recent Platform Transactions (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Latest Escrow Payments</h3>
            <button
              onClick={() => {
                setActiveView('payments');
                navigate('/admin/payments');
              }}
              className="text-xs text-brand-400 hover:text-brand-300 font-semibold"
            >
              All Transactions
            </button>
          </div>

          <div className="space-y-3">
            {bookings.slice(0, 4).map(b => (
              <div key={b.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs flex items-center justify-between">
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>{b.userName}</span>
                    <span className="text-slate-500">→</span>
                    <span className="text-purple-300">{b.influencerName}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {b.bookingRef} • {b.paymentMethod.toUpperCase()}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-extrabold text-white">₹{b.amount}</div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                    b.paymentStatus === 'success' ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'
                  }`}>
                    {b.paymentStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

