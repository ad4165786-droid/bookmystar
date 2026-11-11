import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Wallet, 
  TrendingUp, 
  DollarSign, 
  Video, 
  PhoneCall, 
  Building2, 
  Smartphone, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight, 
  PlusCircle, 
  FileText,
  X
} from 'lucide-react';

export const InfluencerEarningsPayouts: React.FC = () => {
  const { 
    currentInfluencer, 
    bookings, 
    payouts, 
    requestPayout, 
    settings, 
    showToast 
  } = useApp();

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(currentInfluencer.pendingBalance || 1000);
  const [withdrawMethod, setWithdrawMethod] = useState<'bank' | 'upi'>('upi');
  const [upiVpa, setUpiVpa] = useState(currentInfluencer.payoutDetails?.upiId || 'creator@okaxis');
  const [bankAccNumber, setBankAccNumber] = useState(currentInfluencer.payoutDetails?.accountNumber || '5010049281920');
  const [bankIfsc, setBankIfsc] = useState(currentInfluencer.payoutDetails?.ifsc || 'HDFC0001244');
  const [bankName, setBankName] = useState(currentInfluencer.payoutDetails?.bankName || 'HDFC Bank');

  // Bookings and payouts for this influencer
  const creatorBookings = bookings.filter(b => b.influencerId === currentInfluencer.id);
  const creatorPayouts = payouts.filter(p => p.influencerId === currentInfluencer.id);

  // Revenue breakdown: voice vs video
  const videoRevenue = creatorBookings
    .filter(b => b.callType === 'video' && b.paymentStatus === 'success')
    .reduce((sum, b) => sum + b.influencerEarnings, 0);

  const voiceRevenue = creatorBookings
    .filter(b => b.callType === 'voice' && b.paymentStatus === 'success')
    .reduce((sum, b) => sum + b.influencerEarnings, 0);

  const totalGrossBookingValue = creatorBookings
    .filter(b => b.paymentStatus === 'success')
    .reduce((sum, b) => sum + b.amount, 0);

  const totalCommissionPaid = creatorBookings
    .filter(b => b.paymentStatus === 'success')
    .reduce((sum, b) => sum + b.commissionAmount, 0);

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount > currentInfluencer.pendingBalance) {
      showToast('Amount exceeds your available balance!');
      return;
    }
    if (withdrawAmount < settings.minPayoutAmount) {
      showToast(`Minimum withdrawal is ₹${settings.minPayoutAmount}`);
      return;
    }

    const destination = withdrawMethod === 'upi' ? upiVpa : `${bankName} (${bankAccNumber.slice(-4)})`;
    requestPayout(currentInfluencer.id, withdrawAmount, withdrawMethod, destination);
    setShowWithdrawModal(false);
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-purple-100">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Earnings & Payout Disbursals</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent revenue tracking, platform commission breakdown, and direct bank/UPI withdrawals
          </p>
        </div>

        <button
          onClick={() => setShowWithdrawModal(true)}
          disabled={currentInfluencer.pendingBalance < settings.minPayoutAmount}
          className="flex items-center gap-2 py-2.5 px-5 rounded-xl bg-[#7047EB] hover:bg-[#5F34E2] text-white font-bold text-xs shadow-md transition-all disabled:opacity-40"
        >
          <Wallet className="w-4 h-4" />
          <span>Request Payout (₹{currentInfluencer.pendingBalance})</span>
        </button>
      </div>

      {/* Financial Overview Cards (Pure White Cards on Soft Lavender) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        {/* Available for Withdrawal */}
        <div className="p-6 rounded-3xl bg-white border border-purple-100 space-y-3 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-xs text-purple-700 font-bold">
            <span>Available for Withdrawal</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="text-3xl font-black text-[#7047EB]">
            ₹{currentInfluencer.pendingBalance.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500">
            Threshold: ₹{settings.minPayoutAmount} min withdrawal
          </div>
        </div>

        {/* Total Paid Out */}
        <div className="p-6 rounded-3xl bg-white border border-purple-100 space-y-3 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>Total Paid Out to Bank</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-600">
            ₹{currentInfluencer.paidOutBalance.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500">
            Settled via IMPS / NEFT / UPI
          </div>
        </div>

        {/* Lifetime Net Earnings */}
        <div className="p-6 rounded-3xl bg-white border border-purple-100 space-y-3 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>Lifetime Creator Earnings</span>
            <TrendingUp className="w-4 h-4 text-[#7047EB]" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            ₹{currentInfluencer.totalEarnings.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500">
            From {creatorBookings.length} completed & confirmed calls
          </div>
        </div>

      </div>

      {/* Platform Commission & Revenue Stream Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Commission Transparency Ledger */}
        <div className="p-6 rounded-3xl bg-white border border-purple-100 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-purple-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Revenue & Fee Transparency</h3>
            <span className="text-xs font-mono font-bold text-[#7047EB]">{settings.commissionRate}% Standard Fee</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between p-3 rounded-xl bg-purple-50/50 border border-purple-100">
              <span className="text-slate-600 font-medium">Gross Fan Bookings:</span>
              <span className="font-extrabold text-slate-900">₹{totalGrossBookingValue.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between p-3 rounded-xl bg-rose-50/60 border border-rose-100">
              <span className="text-slate-600 font-medium">Platform Fee ({settings.commissionRate}%):</span>
              <span className="font-extrabold text-rose-600">-₹{totalCommissionPaid.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 font-bold text-sm">
              <span className="text-emerald-800">Creator Net Earnings:</span>
              <span className="font-black text-emerald-700">₹{(totalGrossBookingValue - totalCommissionPaid).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Video vs Voice Revenue Share */}
        <div className="p-6 rounded-3xl bg-white border border-purple-100 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-purple-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Channel Revenue Breakdown</h3>
            <span className="text-xs text-slate-500 font-semibold">Performance</span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Video Call Revenue Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span className="flex items-center gap-1.5 text-purple-700">
                  <Video className="w-3.5 h-3.5" /> 1-on-1 Video Calls
                </span>
                <span className="text-slate-900 font-bold">₹{videoRevenue.toLocaleString('en-IN')}</span>
              </div>
              <div className="w-full h-3 bg-purple-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#7047EB] to-[#9333ea] rounded-full"
                  style={{ width: `${totalGrossBookingValue > 0 ? (videoRevenue / (videoRevenue + voiceRevenue || 1)) * 100 : 70}%` }}
                />
              </div>
            </div>

            {/* Voice Call Revenue Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span className="flex items-center gap-1.5 text-emerald-700">
                  <PhoneCall className="w-3.5 h-3.5" /> 1-on-1 Voice Calls
                </span>
                <span className="text-slate-900 font-bold">₹{voiceRevenue.toLocaleString('en-IN')}</span>
              </div>
              <div className="w-full h-3 bg-emerald-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                  style={{ width: `${totalGrossBookingValue > 0 ? (voiceRevenue / (videoRevenue + voiceRevenue || 1)) * 100 : 30}%` }}
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Payout Requests History Ledger */}
      <div className="p-6 rounded-3xl bg-white border border-purple-100 space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-purple-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Payout History & Disbursal Status</h3>
            <p className="text-xs text-slate-500">Auditable withdrawal requests sent to BMS Finance Operations</p>
          </div>
          <span className="text-xs text-purple-700 font-bold">{creatorPayouts.length} payout records</span>
        </div>

        {creatorPayouts.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">No payout requests submitted yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-purple-50/70 text-slate-600 text-[10px] uppercase font-bold">
                <tr>
                  <th className="py-2.5 px-3 rounded-l-xl">Date Requested</th>
                  <th className="py-2.5 px-3">Payout Ref</th>
                  <th className="py-2.5 px-3">Disbursal Destination</th>
                  <th className="py-2.5 px-3">Bank UTR Ref</th>
                  <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                  <th className="py-2.5 px-3 text-center rounded-r-xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-50 text-slate-700">
                {creatorPayouts.map(p => (
                  <tr key={p.id} className="hover:bg-purple-50/30 transition-colors">
                    <td className="py-3 px-3 text-[11px] text-slate-500">{p.requestedAt}</td>
                    <td className="py-3 px-3 font-mono font-bold text-[#7047EB]">{p.payoutRef}</td>
                    <td className="py-3 px-3 font-semibold text-slate-900">{p.destination}</td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                      {p.utrRef || 'Pending Bank Processing'}
                    </td>
                    <td className="py-3 px-3 text-right font-extrabold text-slate-900 text-sm">
                      ₹{p.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                        p.status === 'paid'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : p.status === 'processing'
                          ? 'bg-sky-50 text-sky-700 border border-sky-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payout Request Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl bg-white border border-purple-100 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-purple-100">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-[#7047EB]" />
                <h3 className="text-base font-bold text-slate-900">Withdraw Creator Earnings</h3>
              </div>
              <button onClick={() => setShowWithdrawModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="space-y-4 text-xs">
              
              <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100 flex justify-between items-center">
                <span className="text-slate-600 font-semibold">Available Balance:</span>
                <span className="text-lg font-black text-[#7047EB]">₹{currentInfluencer.pendingBalance}</span>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Withdrawal Amount (₹ INR)</label>
                <input
                  type="number"
                  min={settings.minPayoutAmount}
                  max={currentInfluencer.pendingBalance}
                  value={withdrawAmount}
                  onChange={e => setWithdrawAmount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-base focus:outline-none focus:border-[#7047EB]"
                  required
                />
                <span className="text-[10px] text-slate-500 block mt-1">Minimum withdrawal: ₹{settings.minPayoutAmount}</span>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Select Transfer Channel</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setWithdrawMethod('upi')}
                    className={`py-2 px-3 rounded-xl font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      withdrawMethod === 'upi' ? 'bg-[#7047EB] text-white border-[#7047EB] shadow-sm' : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" /> UPI Instant
                  </button>

                  <button
                    type="button"
                    onClick={() => setWithdrawMethod('bank')}
                    className={`py-2 px-3 rounded-xl font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      withdrawMethod === 'bank' ? 'bg-[#7047EB] text-white border-[#7047EB] shadow-sm' : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    <Building2 className="w-4 h-4" /> Bank Account
                  </button>
                </div>
              </div>

              {withdrawMethod === 'upi' ? (
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Your UPI ID (VPA)</label>
                  <input
                    type="text"
                    value={upiVpa}
                    onChange={e => setUpiVpa(e.target.value)}
                    placeholder="creator@okhdfcbank"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:outline-none focus:border-[#7047EB]"
                    required
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <div>
                    <label className="block text-slate-700 font-bold mb-0.5">Bank Name</label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={e => setBankName(e.target.value)}
                      className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#7047EB]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-0.5">Account Number</label>
                    <input
                      type="text"
                      value={bankAccNumber}
                      onChange={e => setBankAccNumber(e.target.value)}
                      className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:outline-none focus:border-[#7047EB]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-0.5">IFSC Code</label>
                    <input
                      type="text"
                      value={bankIfsc}
                      onChange={e => setBankIfsc(e.target.value)}
                      className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-mono uppercase focus:outline-none focus:border-[#7047EB]"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#7047EB] hover:bg-[#5F34E2] text-white font-bold text-xs shadow-md transition-all"
                >
                  Confirm Payout Request
                </button>
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="px-4 py-3 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors"
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

