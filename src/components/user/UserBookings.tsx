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
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200">Upcoming</span>;
      case 'completed':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Completed</span>;
      case 'cancelled':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">Cancelled</span>;
      case 'refunded':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">Refunded</span>;
      case 'pending':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">Pending Approval</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 pb-6 font-sans">

      {/* Page Title & Summary Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Call Bookings</h1>

        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-white border border-slate-200/90 shadow-2xs text-xs">
            <span className="text-slate-500 font-medium">Total Bookings: </span>
            <span className="font-extrabold text-slate-900">{userBookings.length}</span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-white border border-slate-200/90 shadow-2xs text-xs">
            <span className="text-slate-500 font-medium">Total Spent: </span>
            <span className="font-black text-emerald-600">₹{currentUser.totalSpent}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {(['upcoming', 'completed', 'cancelled', 'refunded', 'all'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`capitalize px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === tab
                ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-md shadow-brand-500/25'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200/90 shadow-2xs'
              }`}
          >
            {tab} ({tab === 'all' ? userBookings.length : userBookings.filter(b => b.bookingStatus === tab).length})
          </button>
        ))}
      </div>

      {/* Booking List Cards */}
      {filteredBookings.length === 0 ? (
        <div className="p-12 sm:p-16 text-center rounded-3xl bg-white border border-slate-200/90 shadow-md ring-1 ring-slate-900/5 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 text-brand-600 flex items-center justify-center mx-auto shadow-2xs">
            <Calendar className="w-7 h-7 text-brand-600" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-slate-900 capitalize">No {activeTab} bookings found</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
              Explore verified creators and schedule your next 1-on-1 private video or audio session.
            </p>
          </div>
          <button
            onClick={() => {
              setActiveView('explore');
              navigate('/fan/dashboard');
            }}
            className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white text-xs font-extrabold shadow-md shadow-brand-500/25 transition-all cursor-pointer"
          >
            Explore Influencers
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map(booking => (
            <div
              key={booking.id}
              className="rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-6 shadow-md ring-1 ring-slate-900/5 hover:shadow-lg transition-all space-y-4 text-slate-900"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
                <div className="flex items-center gap-3.5">
                  <img
                    src={booking.influencerAvatar}
                    alt={booking.influencerName}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-brand-500/30 shadow-xs"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{booking.influencerName}</h3>
                      {getStatusBadge(booking.bookingStatus)}
                    </div>
                    <p className="text-xs text-brand-600 font-semibold">{booking.influencerCategory} Creator</p>
                  </div>
                </div>

                <div className="flex sm:flex-col sm:items-end justify-between text-right">
                  <div className="text-xs font-semibold text-slate-500">Ref: <span className="font-mono text-slate-700 font-bold">{booking.bookingRef}</span></div>
                  <div className="text-sm font-black text-emerald-600 mt-0.5">₹{booking.amount} Paid</div>
                </div>
              </div>

              {/* Call Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] text-slate-500 block">Call Mode</span>
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 mt-0.5 capitalize">
                    {booking.callType === 'video' ? <Video className="w-3.5 h-3.5 text-purple-600" /> : <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />}
                    <span>{booking.callType} Call</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] text-slate-500 block">Duration</span>
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{booking.durationMinutes} Minutes</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] text-slate-500 block">Date & Time</span>
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{booking.scheduledDate} {booking.scheduledTime}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] text-slate-500 block">Payment Method</span>
                  <div className="font-mono font-bold text-slate-800 mt-0.5 uppercase">
                    {booking.paymentMethod} • Verified
                  </div>
                </div>
              </div>

              {/* Cancellation or Refund notes if present */}
              {booking.cancellationReason && (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
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
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs text-slate-700 border border-slate-200 font-semibold transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span>View Invoice / Tax Receipt</span>
                  </button>

                  {booking.bookingStatus === 'upcoming' && (
                    <button
                      onClick={() => cancelBooking(booking.id, 'Cancelled by user before session')}
                      className="px-3 py-1.5 rounded-lg hover:bg-rose-50 text-xs text-rose-600 font-semibold border border-rose-200 transition-colors cursor-pointer"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>

                {booking.bookingStatus === 'upcoming' && (
                  <button
                    onClick={() => startCall(booking, false)}
                    className="flex items-center gap-2 py-2 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-xs shadow-md shadow-emerald-600/25 transition-all transform hover:scale-105 cursor-pointer"
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
                    className="flex items-center gap-1.5 py-1.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors cursor-pointer"
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

