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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Earnings & Payout Disbursals</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent revenue tracking, platform commission breakdown, and direct bank/UPI withdrawals
          </p>
        </div>

        <button
          onClick={() => setShowWithdrawModal(true)}
          disabled={currentInfluencer.pendingBalance < settings.minPayoutAmount}
          className="flex items-center gap-2 py-2.5 px-5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-500/25 transition-all disabled:opacity-40"
        >
          <Wallet className="w-4 h-4" />
          <span>Request Payout (₹{currentInfluencer.pendingBalance})</span>
        </button>
      </div>

      {/* Financial Overview Cards (Pure White Cards on Clean Neutral Background) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        {/* Available for Withdrawal */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 space-y-3 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-xs text-slate-700 font-bold">
            <span>Available for Withdrawal</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="text-3xl font-black text-brand-600">
            ₹{currentInfluencer.pendingBalance.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500">
            Threshold: ₹{settings.minPayoutAmount} min withdrawal
          </div>
        </div>

        {/* Total Paid Out */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 space-y-3 shadow-sm hover:shadow-md transition-shadow">
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
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 space-y-3 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>Lifetime Creator Earnings</span>
            <TrendingUp className="w-4 h-4 text-brand-500" />
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
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Revenue & Fee Transparency</h3>
            <span className="text-xs font-mono font-bold text-brand-600">{settings.commissionRate}% Standard Fee</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
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
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Channel Revenue Breakdown</h3>
            <span className="text-xs text-slate-500 font-semibold">Performance</span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Video Call Revenue Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span className="flex items-center gap-1.5 text-slate-800">
                  <Video className="w-3.5 h-3.5 text-brand-500" /> 1-on-1 Video Calls
                </span>
                <span className="text-slate-900 font-bold">₹{videoRevenue.toLocaleString('en-IN')}</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-500 to-amber-500 rounded-full"
                  style={{ width: `${totalGrossBookingValue > 0 ? (videoRevenue / (videoRevenue + voiceRevenue || 1)) * 100 : 70}%` }}
                />
              </div>
            </div>

            {/* Voice Call Revenue Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span className="flex items-center gap-1.5 text-slate-800">
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-600" /> 1-on-1 Voice Calls
                </span>
                <span className="text-slate-900 font-bold">₹{voiceRevenue.toLocaleString('en-IN')}</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${totalGrossBookingValue > 0 ? (voiceRevenue / (videoRevenue + voiceRevenue || 1)) * 100 : 30}%` }}
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Payout History Ledger */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Disbursal Withdrawal Ledger</h3>
            <p className="text-xs text-slate-500">History of requested and settled payouts to your accounts</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">{creatorPayouts.length} Transactions</span>
          </div>
        </div>

        {creatorPayouts.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No withdrawal requests made yet. When your balance reaches ₹{settings.minPayoutAmount}, click "Request Payout".
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                  <th className="py-3 px-3">Reference ID</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Channel / Beneficiary</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Settlement Ref</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {creatorPayouts.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-3 font-mono font-bold text-brand-600">{p.payoutRef}</td>
                    <td className="py-3.5 px-3 text-slate-600">{p.requestedAt}</td>
                    <td className="py-3.5 px-3 font-black text-slate-900 text-sm">₹{p.amount.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-3 text-slate-600 font-medium">
                      {p.destination}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        p.status === 'paid'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : p.status === 'rejected'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-[11px] text-slate-500">
                      {p.utrRef ? `UTR: ${p.utrRef}` : 'Processing via RazorpayX...'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-brand-500" />
                <h3 className="text-base font-bold text-slate-900">Request Balance Withdrawal</h3>
              </div>
              <button 
                onClick={() => setShowWithdrawModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex justify-between items-center">
              <span className="text-slate-600">Available Disbursal Balance:</span>
              <span className="font-extrabold text-base text-brand-600">₹{currentInfluencer.pendingBalance.toLocaleString('en-IN')}</span>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Withdrawal Amount (₹) - Min ₹{settings.minPayoutAmount}
                </label>
                <input
                  type="number"
                  min={settings.minPayoutAmount}
                  max={currentInfluencer.pendingBalance}
                  value={withdrawAmount}
                  onChange={e => setWithdrawAmount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-base focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Select Transfer Channel</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setWithdrawMethod('upi')}
                    className={`py-2 px-3 rounded-xl font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      withdrawMethod === 'upi' ? 'bg-brand-500 text-white border-brand-500 shadow-sm' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" /> UPI Instant
                  </button>

                  <button
                    type="button"
                    onClick={() => setWithdrawMethod('bank')}
                    className={`py-2 px-3 rounded-xl font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      withdrawMethod === 'bank' ? 'bg-brand-500 text-white border-brand-500 shadow-sm' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Building2 className="w-4 h-4" /> Bank Account
                  </button>
                </div>
              </div>

              {withdrawMethod === 'upi' ? (
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Your UPI ID (VPA)</label>
                  <input
                    type="text"
                    value={upiVpa}
                    onChange={e => setUpiVpa(e.target.value)}
                    placeholder="creator@okhdfcbank"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-0.5">Bank Name</label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={e => setBankName(e.target.value)}
                      className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-brand-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-0.5">Account Number</label>
                    <input
                      type="text"
                      value={bankAccNumber}
                      onChange={e => setBankAccNumber(e.target.value)}
                      className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:outline-none focus:border-brand-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-0.5">IFSC Code</label>
                    <input
                      type="text"
                      value={bankIfsc}
                      onChange={e => setBankIfsc(e.target.value)}
                      className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono uppercase focus:outline-none focus:border-brand-500"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-500/25 transition-all"
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
