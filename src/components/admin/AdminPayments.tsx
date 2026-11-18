import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CreditCard,
  Wallet,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  ExternalLink,
  Building2,
  Smartphone,
  AlertCircle,
  FileCheck
} from 'lucide-react';

export const AdminPayments: React.FC = () => {
  const { payouts, bookings, approvePayout, rejectPayout, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'payouts' | 'transactions'>('payouts');
  const [rejectingPayoutId, setRejectingPayoutId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const pendingPayouts = payouts.filter(p => p.status === 'pending');

  const handleConfirmPayoutReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingPayoutId) return;

    if (!rejectionReason.trim()) {
      showToast('Please state a reason for payout rejection.');
      return;
    }

    rejectPayout(rejectingPayoutId, rejectionReason.trim());
    setRejectingPayoutId(null);
    setRejectionReason('');
  };

  return (
    <div className="space-y-6 pb-16">

      {/* Title & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Payments & Creator Payout Disbursals</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('payouts')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${activeTab === 'payouts'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-slate-200/90 shadow-sm'
              }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Payout Queue ({pendingPayouts.length} Pending)</span>
          </button>

          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${activeTab === 'transactions'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-slate-200/90 shadow-sm'
              }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Fan Payments ({bookings.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Payout Queue */}
      {activeTab === 'payouts' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md ring-1 ring-slate-900/5 overflow-hidden transition-shadow">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-600 text-[10px] uppercase font-bold border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Payout Ref</th>
                    <th className="py-3 px-4">Influencer</th>
                    <th className="py-3 px-4">Withdrawal Channel</th>
                    <th className="py-3 px-4 text-right">Amount (INR)</th>
                    <th className="py-3 px-4">Bank UTR Reference</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Disbursal Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {payouts.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-purple-700">
                        {p.payoutRef}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <img src={p.influencerAvatar} alt={p.influencerName} className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200" />
                          <span className="font-bold text-slate-900">{p.influencerName}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-medium text-slate-700">
                          {p.method === 'upi' ? <Smartphone className="w-3.5 h-3.5 text-emerald-600" /> : <Building2 className="w-3.5 h-3.5 text-blue-600" />}
                          <span>{p.destination}</span>
                        </div>
                        <div className="text-[10px] text-slate-500">{p.requestedAt}</div>
                      </td>

                      <td className="py-3.5 px-4 text-right font-extrabold text-slate-900 text-sm">
                        ₹{p.amount.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                        {p.utrRef || (
                          <span className="text-amber-700 italic font-medium">Pending Transfer</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize ${p.status === 'paid'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : p.status === 'processing'
                              ? 'bg-sky-50 text-sky-700 border border-sky-200'
                              : p.status === 'rejected'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                          {p.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {p.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => approvePayout(p.id)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-sm"
                            >
                              Approve & Pay
                            </button>
                            <button
                              onClick={() => setRejectingPayoutId(p.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-[11px] border border-rose-200"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-500 font-medium">Processed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: User Transactions */}
      {activeTab === 'transactions' && (
        <div className="rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md ring-1 ring-slate-900/5 overflow-hidden transition-shadow">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-600 text-[10px] uppercase font-bold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Txn ID / Date</th>
                  <th className="py-3 px-4">Booking Ref</th>
                  <th className="py-3 px-4">Payer (User)</th>
                  <th className="py-3 px-4">Influencer</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4 text-right">Gross (₹)</th>
                  <th className="py-3 px-4 text-right">BMS Cut (₹)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {bookings.map(b => (
                  <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono text-slate-900 text-[11px] font-semibold">{b.transactionId}</div>
                      <div className="text-[10px] text-slate-500">{b.paidAt}</div>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-amber-700">
                      {b.bookingRef}
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {b.userName}
                    </td>

                    <td className="py-3 px-4 text-purple-600 font-semibold">
                      {b.influencerName}
                    </td>

                    <td className="py-3 px-4 uppercase font-bold text-slate-500 text-[10px]">
                      {b.paymentMethod}
                    </td>

                    <td className="py-3 px-4 text-right font-extrabold text-slate-900">
                      ₹{b.amount}
                    </td>

                    <td className="py-3 px-4 text-right font-bold text-emerald-600">
                      ₹{b.commissionAmount}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${b.paymentStatus === 'success'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                        {b.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reject Payout Reason Modal */}
      {rejectingPayoutId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200/90 p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Reject Creator Payout Request</h3>

            <form onSubmit={handleConfirmPayoutReject} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Reason for Rejection</label>
                <textarea
                  value={rejectionReason}
                  onChange={e => setRejectionReason(e.target.value)}
                  placeholder="e.g. Bank IFSC code mismatch / Incorrect UPI VPA handle..."
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
                  Reject & Refund Balance
                </button>
                <button
                  type="button"
                  onClick={() => setRejectingPayoutId(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
