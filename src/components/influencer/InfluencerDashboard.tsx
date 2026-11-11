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
    navigate,
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
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 sm:p-8 overflow-hidden shadow-xl border border-slate-700/80">
        <div className="absolute right-0 top-0 -mr-10 -mt-10 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <img
              src={currentInfluencer.avatar}
              alt={currentInfluencer.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-3 ring-brand-500/70 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">{currentInfluencer.name}</h1>
                {currentInfluencer.isVerified ? (
                  <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 backdrop-blur-md border border-emerald-500/40">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Verified Creator
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-300/30">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-300" />
                    Verification {currentInfluencer.verificationStatus}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-1">
                <span className="text-brand-400 font-semibold">{currentInfluencer.handle}</span> • {currentInfluencer.category} Specialist • 1-on-1 Creator Studio
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                setActiveView('availability');
                navigate('/influencer/availability');
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-white font-bold border border-slate-700 transition-all shadow-sm"
            >
              Update Schedule
            </button>
            <button
              onClick={() => {
                setActiveView('payouts');
                navigate('/influencer/earnings');
              }}
              className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-black shadow-md shadow-brand-500/30 transition-all"
            >
              Request Payout
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards Grid (Pure White Cards on Light Neutral Background) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Total Net Earnings */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Net Earnings</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              ₹
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            ₹{currentInfluencer.totalEarnings.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-600 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>After {settings.commissionRate}% platform fee</span>
          </div>
        </div>

        {/* Available for Payout */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Available Balance</span>
            <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-brand-600">
            ₹{currentInfluencer.pendingBalance.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500">
            Min. withdrawal ₹{settings.minPayoutAmount}
          </div>
        </div>

        {/* Upcoming Live Calls */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Upcoming Sessions</span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {upcomingBookings.length}
          </div>
          <div className="text-[11px] text-sky-600 font-semibold">
            Ready to join room
          </div>
        </div>

        {/* Rating & Completed */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Fan Satisfaction</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {currentInfluencer.rating > 0 ? currentInfluencer.rating : '5.0'}
            <span className="text-xs text-slate-400 font-normal"> / 5.0</span>
          </div>
          <div className="text-[11px] text-slate-500">
            {currentInfluencer.completedCallsCount} completed calls
          </div>
        </div>

      </div>

      {/* Next Upcoming Call Highlight */}
      {upcomingBookings.length > 0 && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 uppercase border border-emerald-200">
                  Next Scheduled Call
                </span>
                <span className="text-xs font-mono text-slate-400">Ref: {upcomingBookings[0].bookingRef}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                {upcomingBookings[0].durationMinutes}-Minute {upcomingBookings[0].callType} Session with {upcomingBookings[0].userName}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Scheduled for {upcomingBookings[0].scheduledDate} at {upcomingBookings[0].scheduledTime} • Net Payout: ₹{upcomingBookings[0].influencerEarnings}
              </p>
            </div>
          </div>

          <button
            onClick={() => startCall(upcomingBookings[0], true)}
            className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-transform hover:scale-105 shrink-0"
          >
            <Radio className="w-4 h-4" />
            <span>Launch Host Call Room</span>
          </button>
        </div>
      )}

      {/* Recent Booking Activity Feed */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Recent Booking Inquiries</h3>
            <p className="text-xs text-slate-500">Fans who booked voice or video calls with you</p>
          </div>

          <button
            onClick={() => {
              setActiveView('bookings');
              navigate('/influencer/bookings');
            }}
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            <span>View All Bookings ({creatorBookings.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {creatorBookings.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No booking requests yet. Once fans book calls with you, they will appear here.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 text-xs">
            {creatorBookings.slice(0, 5).map(b => (
              <div key={b.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={b.userAvatar}
                    alt={b.userName}
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-100"
                  />
                  <div>
                    <div className="font-bold text-slate-900">{b.userName}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2">
                      <span className="capitalize">{b.callType} Call</span>
                      <span>•</span>
                      <span>{b.durationMinutes} mins</span>
                      <span>•</span>
                      <span>{b.scheduledDate} {b.scheduledTime}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-emerald-600">+₹{b.influencerEarnings}</div>
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                    b.bookingStatus === 'upcoming' 
                      ? 'bg-sky-50 text-sky-700' 
                      : b.bookingStatus === 'completed' 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {b.bookingStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
