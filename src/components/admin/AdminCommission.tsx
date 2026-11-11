import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Percent, 
  DollarSign, 
  TrendingUp, 
  Sliders, 
  Video, 
  PhoneCall, 
  ShieldCheck, 
  Save,
  CheckCircle2
} from 'lucide-react';

export const AdminCommission: React.FC = () => {
  const { settings, updateSettings, bookings, showToast } = useApp();

  const [rate, setRate] = useState(settings.commissionRate);
  const [minPayout, setMinPayout] = useState(settings.minPayoutAmount);
  const [requireKyc, setRequireKyc] = useState(settings.requireVerificationForBooking);

  // Compute metrics
  const successfulBookings = bookings.filter(b => b.paymentStatus === 'success');
  const grossValue = successfulBookings.reduce((sum, b) => sum + b.amount, 0);
  const platformEarnings = successfulBookings.reduce((sum, b) => sum + b.commissionAmount, 0);
  const creatorDisbursals = grossValue - platformEarnings;

  const videoGross = successfulBookings.filter(b => b.callType === 'video').reduce((sum, b) => sum + b.amount, 0);
  const voiceGross = successfulBookings.filter(b => b.callType === 'voice').reduce((sum, b) => sum + b.amount, 0);

  const handleSaveCommission = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      commissionRate: Number(rate),
      minPayoutAmount: Number(minPayout),
      requireVerificationForBooking: requireKyc
    });
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl">
      
      {/* Title */}
      <div className="pb-2 border-b border-slate-800">
        <h1 className="text-2xl font-black text-white">Platform Commission & Financial Rules</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure platform cut percentage, payout minimums, and inspect platform profit ledger
        </p>
      </div>

      {/* Financial Matrix Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-semibold block">Gross Booking Volume (GBV)</span>
          <div className="text-3xl font-black text-white">
            ₹{grossValue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400">Total customer card & UPI spend</div>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 space-y-2">
          <span className="text-xs text-emerald-400 font-semibold block">Platform Commission Cut ({settings.commissionRate}%)</span>
          <div className="text-3xl font-black text-emerald-400">
            ₹{Math.round(platformEarnings).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400">Net platform operational revenue</div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs text-purple-400 font-semibold block">Influencer Net Remittance</span>
          <div className="text-3xl font-black text-purple-300">
            ₹{Math.round(creatorDisbursals).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400">Disbursed to verified stars</div>
        </div>

      </div>

      {/* Dynamic Commission Rate Config Form */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Dynamic Commission & Escrow Governance</h3>
          </div>
          <span className="text-xs text-amber-400 font-semibold">Strict Server-side Validation</span>
        </div>

        <form onSubmit={handleSaveCommission} className="space-y-6 text-xs">
          
          {/* Commission Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-slate-300 font-bold">Standard Platform Commission Rate</label>
              <span className="text-base font-extrabold text-amber-400 font-mono">{rate}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="35"
              step="1"
              value={rate}
              onChange={e => setRate(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>5% (Competitive)</span>
              <span>15% (Industry Standard)</span>
              <span>35% (Exclusive Premium)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Minimum Influencer Withdrawal (₹ INR)</label>
              <input
                type="number"
                value={minPayout}
                onChange={e => setMinPayout(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
              />
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-800/80 border border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requireKyc}
                  onChange={e => setRequireKyc(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
                <div>
                  <div className="font-bold text-white text-xs">Enforce Mandatory KYC for Bookings</div>
                  <div className="text-[10px] text-slate-400">Fans cannot book unverified creators</div>
                </div>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 py-2.5 px-6 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Apply Global Platform Rules</span>
          </button>
        </form>
      </div>

      {/* Voice vs Video Revenue Breakdown */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-800">
          Voice vs Video Channel Contribution
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-white">1-on-1 Video Calls</div>
                <div className="text-[10px] text-slate-400">{successfulBookings.filter(b => b.callType === 'video').length} Sessions</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-extrabold text-white text-base">₹{videoGross.toLocaleString('en-IN')}</div>
              <div className="text-[10px] text-emerald-400">Commission: ₹{Math.round(videoGross * (settings.commissionRate / 100))}</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-white">1-on-1 Voice Calls</div>
                <div className="text-[10px] text-slate-400">{successfulBookings.filter(b => b.callType === 'voice').length} Sessions</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-extrabold text-white text-base">₹{voiceGross.toLocaleString('en-IN')}</div>
              <div className="text-[10px] text-emerald-400">Commission: ₹{Math.round(voiceGross * (settings.commissionRate / 100))}</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

