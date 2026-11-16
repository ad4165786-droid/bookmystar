import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BookingStatus, Booking } from '../../types';
import {
  Calendar,
  Clock,
  Video,
  PhoneCall,
  Radio,
  CheckCircle2,
  XCircle,
  AlertCircle,
  User,
  Mail,
  Phone,
  FileText
} from 'lucide-react';
import { InvoiceModal } from '../modals/InvoiceModal';

export const InfluencerBookings: React.FC = () => {
  const {
    currentInfluencer,
    bookings,
    startCall,
    cancelBooking,
    showToast,
    settings
  } = useApp();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled' | 'all'>('upcoming');
  const [selectedInvoiceBooking, setSelectedInvoiceBooking] = useState<Booking | null>(null);

  const creatorBookings = bookings.filter(b => b.influencerId === currentInfluencer.id);

  const filteredBookings = creatorBookings.filter(b => {
    if (activeTab === 'all') return true;
    return b.bookingStatus === activeTab;
  });

  return (
    <div className="space-y-6 pb-6">

      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Call Booking Schedule</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-white border border-slate-200/90 shadow-sm ring-1 ring-slate-900/5 text-xs">
            <span className="text-slate-500 font-medium">Total Bookings: </span>
            <span className="font-extrabold text-brand-600">{creatorBookings.length}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {(['upcoming', 'completed', 'cancelled', 'all'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`capitalize px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === tab
                ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-md shadow-brand-500/25'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200/90 shadow-2xs'
              }`}
          >
            {tab} ({tab === 'all' ? creatorBookings.length : creatorBookings.filter(b => b.bookingStatus === tab).length})
          </button>
        ))}
      </div>

      {/* Booking List */}
      {filteredBookings.length === 0 ? (
        <div className="p-12 sm:p-16 text-center rounded-3xl bg-white border border-slate-200/90 space-y-4 shadow-md ring-1 ring-slate-900/5 hover:shadow-lg transition-all">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 border border-brand-200/80 text-brand-600 flex items-center justify-center mx-auto shadow-2xs">
            <Calendar className="w-7 h-7 text-brand-600" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-slate-900">No {activeTab} bookings found</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
              When fans book 1-on-1 video or voice calls with you from your marketplace profile, they will appear here in real-time.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map(b => (
            <div
              key={b.id}
              className="rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-6 shadow-md ring-1 ring-slate-900/5 hover:shadow-lg transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3.5">
                  <img
                    src={b.userAvatar}
                    alt={b.userName}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{b.userName}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${b.bookingStatus === 'upcoming'
                          ? 'bg-sky-50 text-sky-700 border border-sky-200'
                          : b.bookingStatus === 'completed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                        {b.bookingStatus}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5" /> {b.userEmail}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" /> {b.userPhone}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col sm:items-end justify-between text-right">
                  <div className="text-xs font-bold text-slate-700">Booking Ref: <span className="font-mono text-brand-600">{b.bookingRef}</span></div>
                  <div className="text-sm font-black text-emerald-600 mt-0.5">
                    +₹{b.influencerEarnings} Net Payout
                  </div>
                  <div className="text-[10px] text-slate-400">Gross: ₹{b.amount} ({settings.commissionRate}% fee: ₹{b.commissionAmount})</div>
                </div>
              </div>

              {/* Call Details */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Session Type</span>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 mt-0.5 capitalize">
                    {b.callType === 'video' ? <Video className="w-3.5 h-3.5 text-brand-500" /> : <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />}
                    <span>{b.callType} Call ({b.durationMinutes} Minutes)</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Scheduled Time</span>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-brand-500" />
                    <span>{b.scheduledDate} at {b.scheduledTime}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Payment Verification</span>
                  <div className="font-mono font-bold text-emerald-700 mt-0.5 uppercase">
                    Paid via {b.paymentMethod}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setSelectedInvoiceBooking(b)}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View Customer Receipt</span>
                </button>

                {b.bookingStatus === 'upcoming' && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => cancelBooking(b.id, 'Creator had an emergency scheduling conflict')}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
                    >
                      Decline / Reschedule
                    </button>

                    <button
                      onClick={() => startCall(b, true)}
                      className="flex items-center gap-2 py-2 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-all transform hover:scale-105"
                    >
                      <Radio className="w-3.5 h-3.5 animate-pulse" />
                      <span>Start Host Call</span>
                    </button>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

      {selectedInvoiceBooking && (
        <InvoiceModal
          booking={selectedInvoiceBooking}
          onClose={() => setSelectedInvoiceBooking(null)}
        />
      )}

    </div>
  );
};
