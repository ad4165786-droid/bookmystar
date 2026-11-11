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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white">Earnings & Payout Disbursals</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Transparent revenue tracking, platform commission breakdown, and direct bank/UPI withdrawals
          </p>
        </div>

        <button
          onClick={() => setShowWithdrawModal(true)}
          disabled={currentInfluencer.pendingBalance < settings.minPayoutAmount}
          className="flex items-center gap-2 py-2.5 px-5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs shadow-glow transition-all disabled:opacity-40"
        >
          <Wallet className="w-4 h-4" />
          <span>Request Payout (₹{currentInfluencer.pendingBalance})</span>
        </button>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        {/* Available for Withdrawal */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-950/40 via-slate-900 to-slate-900 border border-purple-500/40 space-y-3 shadow-lg">
          <div className="flex items-center justify-between text-xs text-purple-300 font-semibold">
            <span>Available for Withdrawal</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="text-3xl font-black text-white">
            ₹{currentInfluencer.pendingBalance.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400">
            Threshold: ₹{settings.minPayoutAmount} min withdrawal
          </div>
        </div>

        {/* Total Paid Out */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Total Paid Out to Bank</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400">
            ₹{currentInfluencer.paidOutBalance.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400">
            Settled via IMPS / NEFT / UPI
          </div>
        </div>

        {/* Lifetime Net Earnings */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Lifetime Creator Earnings</span>
            <TrendingUp className="w-4 h-4 text-brand-400" />
          </div>
          <div className="text-3xl font-black text-white">
            ₹{currentInfluencer.totalEarnings.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400">
            From {creatorBookings.length} completed & confirmed calls
          </div>
        </div>

      </div>

      {/* Platform Commission & Revenue Stream Breakdown (PDF Section 8 & 9) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Commission Transparency Ledger */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Revenue & Fee Transparency</h3>
            <span className="text-xs font-mono text-brand-400">{settings.commissionRate}% Standard Fee</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400">Gross Fan Bookings:</span>
              <span className="font-extrabold text-white">₹{totalGrossBookingValue.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400">Platform Infrastructure Fee ({settings.commissionRate}%):</span>
              <span className="font-extrabold text-rose-400">-₹{totalCommissionPaid.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 font-bold text-sm">
              <span className="text-emerald-300">Creator Net Earnings:</span>
              <span className="font-black text-emerald-400">₹{(totalGrossBookingValue - totalCommissionPaid).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Video vs Voice Revenue Share */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Channel Revenue Breakdown</h3>
            <span className="text-xs text-slate-400">Performance</span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Video Call Revenue Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span className="flex items-center gap-1.5 text-purple-300">
                  <Video className="w-3.5 h-3.5" /> 1-on-1 Video Calls
                </span>
                <span className="text-white font-bold">₹{videoRevenue.toLocaleString('en-IN')}</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                  style={{ width: `${totalGrossBookingValue > 0 ? (videoRevenue / (videoRevenue + voiceRevenue || 1)) * 100 : 70}%` }}
                />
              </div>
            </div>

            {/* Voice Call Revenue Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span className="flex items-center gap-1.5 text-emerald-300">
                  <PhoneCall className="w-3.5 h-3.5" /> 1-on-1 Voice Calls
                </span>
                <span className="text-white font-bold">₹{voiceRevenue.toLocaleString('en-IN')}</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                  style={{ width: `${totalGrossBookingValue > 0 ? (voiceRevenue / (videoRevenue + voiceRevenue || 1)) * 100 : 30}%` }}
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Payout Requests History Ledger (PDF Section 10) */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Payout History & Disbursal Status</h3>
            <p className="text-xs text-slate-400">Auditable withdrawal requests sent to BMS Finance Operations</p>
          </div>
          <span className="text-xs text-slate-400">{creatorPayouts.length} payout records</span>
        </div>

        {creatorPayouts.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-6">No payout requests submitted yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 text-[10px] uppercase font-bold">
                <tr>
                  <th className="py-2.5 px-3">Date Requested</th>
                  <th className="py-2.5 px-3">Payout Ref</th>
                  <th className="py-2.5 px-3">Disbursal Destination</th>
                  <th className="py-2.5 px-3">Bank UTR Ref</th>
                  <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {creatorPayouts.map(p => (
                  <tr key={p.id}>
                    <td className="py-3 px-3 text-[11px] text-slate-400">{p.requestedAt}</td>
                    <td className="py-3 px-3 font-mono font-bold text-purple-300">{p.payoutRef}</td>
                    <td className="py-3 px-3 font-semibold text-white">{p.destination}</td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-400">
                      {p.utrRef || 'Pending Bank Processing'}
                    </td>
                    <td className="py-3 px-3 text-right font-extrabold text-white text-sm">
                      ₹{p.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                        p.status === 'paid'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                          : p.status === 'processing'
                          ? 'bg-sky-950 text-sky-300 border border-sky-500/30'
                          : 'bg-amber-950 text-amber-300 border border-amber-500/30'
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">Withdraw Creator Earnings</h3>
              </div>
              <button onClick={() => setShowWithdrawModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="space-y-4 text-xs">
              
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Available Balance:</span>
                <span className="text-base font-extrabold text-emerald-400">₹{currentInfluencer.pendingBalance}</span>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Withdrawal Amount (₹ INR)</label>
                <input
                  type="number"
                  min={settings.minPayoutAmount}
                  max={currentInfluencer.pendingBalance}
                  value={withdrawAmount}
                  onChange={e => setWithdrawAmount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold text-base focus:outline-none"
                  required
                />
                <span className="text-[10px] text-slate-400 block mt-1">Minimum withdrawal: ₹{settings.minPayoutAmount}</span>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Select Transfer Channel</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setWithdrawMethod('upi')}
                    className={`py-2 px-3 rounded-xl font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      withdrawMethod === 'upi' ? 'bg-purple-600 text-white border-purple-400' : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" /> UPI Instant
                  </button>

                  <button
                    type="button"
                    onClick={() => setWithdrawMethod('bank')}
                    className={`py-2 px-3 rounded-xl font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      withdrawMethod === 'bank' ? 'bg-purple-600 text-white border-purple-400' : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    <Building2 className="w-4 h-4" /> Bank Account
                  </button>
                </div>
              </div>

              {withdrawMethod === 'upi' ? (
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Your UPI ID (VPA)</label>
                  <input
                    type="text"
                    value={upiVpa}
                    onChange={e => setUpiVpa(e.target.value)}
                    placeholder="creator@okhdfcbank"
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"
                    required
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-0.5">Bank Name</label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={e => setBankName(e.target.value)}
                      className="w-full p-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-0.5">Account Number</label>
                    <input
                      type="text"
                      value={bankAccNumber}
                      onChange={e => setBankAccNumber(e.target.value)}
                      className="w-full p-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-0.5">IFSC Code</label>
                    <input
                      type="text"
                      value={bankIfsc}
                      onChange={e => setBankIfsc(e.target.value)}
                      className="w-full p-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono uppercase"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs shadow-glow"
                >
                  Confirm Payout Request
                </button>
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="px-4 py-3 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
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

