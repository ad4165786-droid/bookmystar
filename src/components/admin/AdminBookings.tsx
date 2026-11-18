import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BookingStatus, CallType, Booking } from '../../types';
import {
  Calendar,
  Clock,
  Video,
  PhoneCall,
  Search,
  Filter,
  RotateCcw,
  ShieldCheck,
  Lock,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Radio,
  X
} from 'lucide-react';
import { InvoiceModal } from '../modals/InvoiceModal';

export const AdminBookings: React.FC = () => {
  const { bookings, refundBooking, showToast } = useApp();

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | BookingStatus>('all');
  const [selectedCallType, setSelectedCallType] = useState<'all' | CallType>('all');

  const [selectedBookingDetails, setSelectedBookingDetails] = useState<Booking | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Booking | null>(null);
  const [refundReason, setRefundReason] = useState('');
  const [showRefundModal, setShowRefundModal] = useState<Booking | null>(null);

  const filteredBookings = bookings.filter(b => {
    if (selectedStatus !== 'all' && b.bookingStatus !== selectedStatus) return false;
    if (selectedCallType !== 'all' && b.callType !== selectedCallType) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return b.bookingRef.toLowerCase().includes(q) ||
        b.userName.toLowerCase().includes(q) ||
        b.influencerName.toLowerCase().includes(q);
    }
    return true;
  });

  const handleProcessRefund = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showRefundModal) return;

    refundBooking(showRefundModal.id, refundReason || 'Refund authorized by BMS Operations Lead');
    setShowRefundModal(null);
    setRefundReason('');
  };

  return (
    <div className="space-y-6 pb-16">

      {/* Title & Privacy Guarantee Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Call Records & Booking Master Ledger</h1>
        </div>

        {/* E2E Privacy Banner */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200/90 shadow-sm ring-1 ring-slate-900/5 text-xs text-slate-700">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-[11px] font-medium">Private Call Audio/Video is E2E Encrypted (Metadata Only)</span>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search booking ref, user, or creator..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-slate-200/90 shadow-sm ring-1 ring-slate-900/5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          {/* Status selector */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value as any)}
            className="px-3 py-2 text-xs rounded-xl bg-white border border-slate-200/90 shadow-sm text-slate-700 focus:outline-none focus:border-amber-500 font-medium"
          >
            <option value="all">All Booking Statuses</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>

          {/* Call type selector */}
          <select
            value={selectedCallType}
            onChange={e => setSelectedCallType(e.target.value as any)}
            className="px-3 py-2 text-xs rounded-xl bg-white border border-slate-200/90 shadow-sm text-slate-700 focus:outline-none focus:border-amber-500 font-medium"
          >
            <option value="all">All Call Types</option>
            <option value="video">Video Calls</option>
            <option value="voice">Voice Calls</option>
          </select>
        </div>
      </div>

      {/* Bookings Table Section Box */}
      <div className="rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md ring-1 ring-slate-900/5 overflow-hidden transition-shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-600 text-[10px] uppercase font-bold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Booking Ref</th>
                <th className="py-3 px-4">Fan (Customer)</th>
                <th className="py-3 px-4">Creator Star</th>
                <th className="py-3 px-4">Call Mode</th>
                <th className="py-3 px-4">Schedule Date/Time</th>
                <th className="py-3 px-4 text-right">Fee (₹)</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredBookings.map(b => (
                <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-amber-700 text-[11px]">
                    {b.bookingRef}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900">{b.userName}</div>
                    <div className="text-[10px] text-slate-500">{b.userEmail}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-purple-600">{b.influencerName}</div>
                    <div className="text-[10px] text-slate-500">{b.influencerCategory}</div>
                  </td>

                  <td className="py-3.5 px-4 capitalize">
                    <span className="flex items-center gap-1.5 font-medium text-slate-700">
                      {b.callType === 'video' ? <Video className="w-3.5 h-3.5 text-purple-600" /> : <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />}
                      {b.callType} ({b.durationMinutes}m)
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-700">
                    <div>{b.scheduledDate}</div>
                    <div className="text-[10px] text-slate-500">{b.scheduledTime}</div>
                  </td>

                  <td className="py-3.5 px-4 text-right font-extrabold text-slate-900">
                    ₹{b.amount}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${b.bookingStatus === 'upcoming'
                        ? 'bg-sky-50 text-sky-700 border border-sky-200'
                        : b.bookingStatus === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : b.bookingStatus === 'refunded'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                      {b.bookingStatus}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedInvoice(b)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                        title="View Receipt"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>

                      {b.paymentStatus === 'success' && b.bookingStatus !== 'refunded' && (
                        <button
                          onClick={() => setShowRefundModal(b)}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-[11px] border border-rose-200 transition-colors"
                        >
                          Issue Refund
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Refund Modal */}
      {showRefundModal && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setShowRefundModal(null); }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
        >
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200/90 p-6 space-y-4 shadow-2xl ring-1 ring-slate-900/10">
            <h3 className="text-base font-bold text-slate-900">Authorize Escrow Refund</h3>
            <p className="text-xs text-slate-600">
              Confirm full refund of <strong className="text-slate-900">₹{showRefundModal.amount}</strong> to {showRefundModal.userName} for booking <span className="font-mono text-amber-700 font-semibold">{showRefundModal.bookingRef}</span>.
            </p>

            <form onSubmit={handleProcessRefund} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Reason for Refund</label>
                <textarea
                  value={refundReason}
                  onChange={e => setRefundReason(e.target.value)}
                  placeholder="e.g. Verified call failure due to audio packet loss / mutual cancellation agreement..."
                  rows={3}
                  className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-sm"
                >
                  Confirm & Reverse Funds
                </button>
                <button
                  type="button"
                  onClick={() => setShowRefundModal(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Receipt Modal */}
      {selectedInvoice && (
        <InvoiceModal
          booking={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}

    </div>
  );
};
