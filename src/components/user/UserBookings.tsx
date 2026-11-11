import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BookingStatus, Booking } from '../../types';
import { 
  Calendar, 
  Clock, 
  Video, 
  PhoneCall, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  FileText, 
  Star, 
  AlertCircle,
  Radio,
  ArrowRight
} from 'lucide-react';
import { InvoiceModal } from '../modals/InvoiceModal';

export const UserBookings: React.FC = () => {
  const { 
    bookings, 
    currentUser, 
    startCall, 
    cancelBooking, 
    refundBooking,
    setActiveView,
    navigate,
    setSelectedInfluencerId,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | BookingStatus>('upcoming');
  const [selectedInvoiceBooking, setSelectedInvoiceBooking] = useState<Booking | null>(null);

  // Filter bookings for this logged-in user
  const userBookings = bookings.filter(b => b.userId === currentUser.id);

  const filteredBookings = userBookings.filter(b => {
    if (activeTab === 'all') return true;
    return b.bookingStatus === activeTab;
  });

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'upcoming':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-950/70 text-sky-300 border border-sky-500/30">Upcoming</span>;
      case 'completed':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950/70 text-emerald-300 border border-emerald-500/30">Completed</span>;
      case 'cancelled':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-slate-400 border border-slate-700">Cancelled</span>;
      case 'refunded':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-950/70 text-amber-300 border border-amber-500/30">Refunded</span>;
      case 'pending':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-950/70 text-purple-300 border border-purple-500/30">Pending Approval</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Page Title & Summary Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white">My Call Bookings</h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage your upcoming and past 1-on-1 sessions</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <span className="text-slate-400">Total Bookings: </span>
            <span className="font-bold text-white">{userBookings.length}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <span className="text-slate-400">Total Spent: </span>
            <span className="font-bold text-emerald-400">₹{currentUser.totalSpent}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {(['upcoming', 'completed', 'cancelled', 'refunded', 'all'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`capitalize px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === tab
                ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-glow'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tab} ({tab === 'all' ? userBookings.length : userBookings.filter(b => b.bookingStatus === tab).length})
          </button>
        ))}
      </div>

      {/* Booking List Cards */}
      {filteredBookings.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
          <Calendar className="w-8 h-8 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No {activeTab} bookings found</h3>
          <p className="text-xs text-slate-400">Explore creators and book your first 1-on-1 live call.</p>
          <button
            onClick={() => {
              setActiveView('explore');
              navigate('/fan/dashboard');
            }}
            className="mt-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md transition-colors"
          >
            Explore Influencers
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map(booking => (
            <div
              key={booking.id}
              className="rounded-2xl bg-slate-900/70 border border-slate-800/90 p-5 sm:p-6 shadow-md hover:border-slate-700 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-3.5">
                  <img
                    src={booking.influencerAvatar}
                    alt={booking.influencerName}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-brand-500/20"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">{booking.influencerName}</h3>
                      {getStatusBadge(booking.bookingStatus)}
                    </div>
                    <p className="text-xs text-brand-400 font-medium">{booking.influencerCategory} Creator</p>
                  </div>
                </div>

                <div className="flex sm:flex-col sm:items-end justify-between text-right">
                  <div className="text-xs font-bold text-white">Ref: <span className="font-mono text-brand-300">{booking.bookingRef}</span></div>
                  <div className="text-sm font-black text-emerald-400 mt-0.5">₹{booking.amount} Paid</div>
                </div>
              </div>

              {/* Call Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
                  <span className="text-[10px] text-slate-400 block">Call Mode</span>
                  <div className="flex items-center gap-1.5 font-bold text-slate-200 mt-0.5 capitalize">
                    {booking.callType === 'video' ? <Video className="w-3.5 h-3.5 text-purple-400" /> : <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />}
                    <span>{booking.callType} Call</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
                  <span className="text-[10px] text-slate-400 block">Duration</span>
                  <div className="flex items-center gap-1.5 font-bold text-slate-200 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{booking.durationMinutes} Minutes</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
                  <span className="text-[10px] text-slate-400 block">Date & Time</span>
                  <div className="flex items-center gap-1.5 font-bold text-slate-200 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{booking.scheduledDate} {booking.scheduledTime}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
                  <span className="text-[10px] text-slate-400 block">Payment Method</span>
                  <div className="font-mono font-bold text-slate-200 mt-0.5 uppercase">
                    {booking.paymentMethod} • Verified
                  </div>
                </div>
              </div>

              {/* Cancellation or Refund notes if present */}
              {booking.cancellationReason && (
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    <strong>Note:</strong> {booking.cancellationReason} {booking.refundRef && `(Refund Ref: ${booking.refundRef})`}
                  </span>
                </div>
              )}

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedInvoiceBooking(booking)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-semibold transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>View Invoice / Tax Receipt</span>
                  </button>

                  {booking.bookingStatus === 'upcoming' && (
                    <button
                      onClick={() => cancelBooking(booking.id, 'Cancelled by user before session')}
                      className="px-3 py-1.5 rounded-lg hover:bg-rose-500/10 text-xs text-rose-400 font-semibold border border-rose-500/20 transition-colors"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>

                {booking.bookingStatus === 'upcoming' && (
                  <button
                    onClick={() => startCall(booking, false)}
                    className="flex items-center gap-2 py-2 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-xs shadow-glow transition-all transform hover:scale-105"
                  >
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                    <span>Join Live Call Room</span>
                  </button>
                )}

                {booking.bookingStatus === 'completed' && (
                  <button
                    onClick={() => {
                      setSelectedInfluencerId(booking.influencerId);
                      setActiveView('influencer-detail');
                      navigate(`/fan/creators/${booking.influencerId}`);
                    }}
                    className="flex items-center gap-1.5 py-1.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                  >
                    <span>Book Again</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Invoice Modal */}
      {selectedInvoiceBooking && (
        <InvoiceModal
          booking={selectedInvoiceBooking}
          onClose={() => setSelectedInvoiceBooking(null)}
        />
      )}

    </div>
  );
};

