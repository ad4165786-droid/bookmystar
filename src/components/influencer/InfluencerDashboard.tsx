import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Clock, 
  Video, 
  PhoneCall, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight, 
  PlusCircle, 
  Wallet, 
  ShieldCheck,
  Star,
  Radio
} from 'lucide-react';

export const InfluencerDashboard: React.FC = () => {
  const { 
    currentInfluencer, 
    bookings, 
    setActiveView, 
    startCall,
    settings 
  } = useApp();

  // Bookings for this influencer
  const creatorBookings = bookings.filter(b => b.influencerId === currentInfluencer.id);
  const upcomingBookings = creatorBookings.filter(b => b.bookingStatus === 'upcoming');
  const completedBookings = creatorBookings.filter(b => b.bookingStatus === 'completed');

  return (
    <div className="space-y-8 pb-16">
      
      {/* Welcome Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-purple-900/60 via-slate-900 to-[#121927] border border-purple-500/30 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 -mr-10 -mt-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <img
              src={currentInfluencer.avatar}
              alt={currentInfluencer.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-purple-400/50 shadow-glow"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">{currentInfluencer.name}</h1>
                {currentInfluencer.isVerified ? (
                  <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/70 text-emerald-300 border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Verified Creator
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-950/70 text-amber-300 border border-amber-500/30">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                    Verification {currentInfluencer.verificationStatus}
                  </span>
                )}
              </div>
              <p className="text-xs text-purple-300 mt-1">
                {currentInfluencer.handle} • {currentInfluencer.category} Specialist • 1-on-1 Creator Studio
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActiveView('availability')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-semibold border border-slate-700 transition-colors"
            >
              Update Schedule
            </button>
            <button
              onClick={() => setActiveView('payouts')}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-xs text-white font-bold shadow-md transition-all"
            >
              Request Payout
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards Grid (PDF Section 1) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Total Net Earnings */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Net Earnings</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              ₹
            </div>
          </div>
          <div className="text-2xl font-black text-white">
            ₹{currentInfluencer.totalEarnings.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>After {settings.commissionRate}% platform commission</span>
          </div>
        </div>

        {/* Available for Payout */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Available Balance</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-purple-300">
            ₹{currentInfluencer.pendingBalance.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400">
            Min. withdrawal ₹{settings.minPayoutAmount}
          </div>
        </div>

        {/* Upcoming Live Calls */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Upcoming Sessions</span>
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">
            {upcomingBookings.length}
          </div>
          <div className="text-[11px] text-sky-400 font-semibold">
            Ready to join room
          </div>
        </div>

        {/* Rating & Completed */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Fan Satisfaction</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">
            {currentInfluencer.rating > 0 ? currentInfluencer.rating : '5.0'}
            <span className="text-xs text-slate-400 font-normal"> / 5.0</span>
          </div>
          <div className="text-[11px] text-slate-400">
            {currentInfluencer.completedCallsCount} completed calls
          </div>
        </div>

      </div>

      {/* Next Upcoming Call Highlight */}
      {upcomingBookings.length > 0 && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 uppercase">
                  Next Scheduled Call
                </span>
                <span className="text-xs font-mono text-slate-400">Ref: {upcomingBookings[0].bookingRef}</span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">
                {upcomingBookings[0].durationMinutes}-Minute {upcomingBookings[0].callType} Session with {upcomingBookings[0].userName}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Scheduled for {upcomingBookings[0].scheduledDate} at {upcomingBookings[0].scheduledTime} • Earnings: ₹{upcomingBookings[0].influencerEarnings}
              </p>
            </div>
          </div>

          <button
            onClick={() => startCall(upcomingBookings[0], true)}
            className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-glow transition-transform hover:scale-105 shrink-0"
          >
            <Radio className="w-4 h-4" />
            <span>Launch Host Call Room</span>
          </button>
        </div>
      )}

      {/* Recent Booking Activity Feed */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Booking Inquiries</h3>
            <p className="text-xs text-slate-400">Fans who booked voice or video calls with you</p>
          </div>

          <button
            onClick={() => setActiveView('bookings')}
            className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
          >
            <span>View All Bookings</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {creatorBookings.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-6">No bookings registered yet.</p>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {creatorBookings.slice(0, 4).map(b => (
              <div key={b.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <img src={b.userAvatar} alt={b.userName} className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-700" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{b.userName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({b.bookingRef})</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-[11px] mt-0.5">
                      <span>{b.callType === 'video' ? 'Video Call' : 'Voice Call'} ({b.durationMinutes}m)</span>
                      <span>•</span>
                      <span>{b.scheduledDate} {b.scheduledTime}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="text-right">
                    <div className="font-bold text-emerald-400">₹{b.influencerEarnings} net</div>
                    <div className="text-[10px] text-slate-500 uppercase">{b.bookingStatus}</div>
                  </div>

                  {b.bookingStatus === 'upcoming' && (
                    <button
                      onClick={() => startCall(b, true)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] shadow-sm"
                    >
                      Join Call
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

