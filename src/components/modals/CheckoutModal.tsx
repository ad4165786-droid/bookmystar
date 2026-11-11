import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  ShieldCheck, 
  Clock, 
  Calendar, 
  Video, 
  PhoneCall, 
  CheckCircle2, 
  Lock, 
  CreditCard, 
  Smartphone, 
  Building2, 
  AlertCircle,
  FileText,
  QrCode,
  Loader2
} from 'lucide-react';
import { Booking } from '../../types';

export const CheckoutModal: React.FC = () => {
  const { checkoutFlow, closeCheckout, createBooking, startCall } = useApp();
  
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('4532 8812 9021 3418');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('412');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  if (!checkoutFlow) return null;

  const { influencer, callType, duration, scheduledDate, scheduledTime, price } = checkoutFlow;

  const basePrice = price;
  const platformFee = Math.round(basePrice * 0.05); // 5% convenience fee
  const gstAmount = Math.round((basePrice + platformFee) * 0.18); // 18% GST
  const totalPrice = basePrice + platformFee + gstAmount;

  const handlePayNow = async () => {
    setIsProcessing(true);
    try {
      // Simulate server-side payment verification delay
      await new Promise(r => setTimeout(r, 1400));
      
      const newBooking = await createBooking({
        influencerId: influencer.id,
        callType,
        durationMinutes: duration,
        scheduledDate,
        scheduledTime,
        amount: totalPrice,
        paymentMethod: selectedMethod
      });

      setConfirmedBooking(newBooking);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#121927] border border-slate-700/80 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/30 flex items-center justify-center">
              <Lock className="w-4 h-4 text-brand-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {confirmedBooking ? 'Booking Confirmed!' : 'Secure 1-on-1 Call Checkout'}
              </h3>
              <p className="text-xs text-slate-400">256-Bit Encrypted Payment Processing</p>
            </div>
          </div>

          <button
            onClick={closeCheckout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {confirmedBooking ? (
            /* Success State */
            <div className="text-center py-4 space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                  Payment Successful • Ref: {confirmedBooking.bookingRef}
                </span>
                <h2 className="mt-3 text-2xl font-black text-white">You're Booked with {influencer.name}!</h2>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                  Your 1-on-1 {confirmedBooking.callType} call session has been reserved and verified on the server.
                </p>
              </div>

              {/* Booking Summary Box */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-left space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <img src={influencer.avatar} alt={influencer.name} className="w-10 h-10 rounded-xl object-cover ring-1 ring-brand-500/30" />
                    <div>
                      <h4 className="text-sm font-bold text-white">{influencer.name}</h4>
                      <p className="text-xs text-brand-400">{influencer.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-emerald-400">₹{confirmedBooking.amount} Paid</div>
                    <div className="text-[10px] text-slate-400 uppercase">{confirmedBooking.paymentMethod}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>{confirmedBooking.scheduledDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>{confirmedBooking.scheduledTime} ({confirmedBooking.durationMinutes} min)</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    closeCheckout();
                    startCall(confirmedBooking, false);
                  }}
                  className="w-full flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold text-sm shadow-glow transition-all"
                >
                  <Video className="w-4 h-4" />
                  Launch Call Room Preview
                </button>
                <button
                  onClick={closeCheckout}
                  className="w-full sm:w-auto py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Order Flow */
            <>
              {/* Slot Locked Banner */}
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong className="font-semibold text-amber-200">Time Slot Reserved:</strong> This slot is locked for 10 minutes to prevent double-booking.
                </span>
              </div>

              {/* Order Item Summary */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={influencer.avatar} alt={influencer.name} className="w-12 h-12 rounded-xl object-cover ring-1 ring-brand-500/30" />
                  <div>
                    <h4 className="text-sm font-bold text-white">{influencer.name}</h4>
                    <p className="text-xs text-brand-400">{influencer.category} • Verified Creator</p>
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-300">
                      <span className="flex items-center gap-1 font-medium">
                        {callType === 'video' ? <Video className="w-3 h-3 text-purple-400" /> : <PhoneCall className="w-3 h-3 text-emerald-400" />}
                        {duration} mins {callType === 'video' ? 'Video Call' : 'Voice Call'}
                      </span>
                      <span>•</span>
                      <span>{scheduledDate} at {scheduledTime}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-white">₹{basePrice}</div>
                  <div className="text-[10px] text-slate-400">Creator Base Fee</div>
                </div>
              </div>

              {/* Payment Methods Tabs */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  Select Indian Rupee (₹) Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('upi')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                      selectedMethod === 'upi'
                        ? 'bg-brand-900/40 border-brand-500 text-brand-300 shadow-glow'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 mb-1 text-emerald-400" />
                    <span>UPI / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('card')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                      selectedMethod === 'card'
                        ? 'bg-brand-900/40 border-brand-500 text-brand-300 shadow-glow'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 mb-1 text-blue-400" />
                    <span>Cards (Debit/Credit)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('netbanking')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                      selectedMethod === 'netbanking'
                        ? 'bg-brand-900/40 border-brand-500 text-brand-300 shadow-glow'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Building2 className="w-5 h-5 mb-1 text-amber-400" />
                    <span>Net Banking</span>
                  </button>
                </div>

                {/* Method Details */}
                <div className="mt-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  {selectedMethod === 'upi' && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-20 h-20 bg-white rounded-lg p-1.5 flex items-center justify-center shadow-md">
                          <QrCode className="w-full h-full text-slate-900" />
                        </div>
                        <div className="flex-1 text-xs">
                          <div className="font-semibold text-slate-200">Scan QR Code with any UPI App</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">Google Pay, PhonePe, Paytm, CRED, BHIM</div>
                          <div className="mt-2 text-[10px] text-brand-300 font-mono bg-brand-950/60 px-2 py-1 rounded inline-block border border-brand-500/20">
                            VPA: bookmystar.pay@icici
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80">
                        <span className="text-[11px] text-slate-400 block mb-1">Or enter your UPI ID</span>
                        <input
                          type="text"
                          value={upiId}
                          onChange={e => setUpiId(e.target.value)}
                          placeholder="yourname@okaxis / yourname@upi"
                          className="w-full px-3 py-2 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                        />
                      </div>
                    </div>
                  )}

                  {selectedMethod === 'card' && (
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Card Number</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={e => setCardNumber(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">Expiry</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={e => setCardExpiry(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">CVV</label>
                          <input
                            type="password"
                            value={cardCvv}
                            onChange={e => setCardCvv(e.target.value)}
                            maxLength={4}
                            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedMethod === 'netbanking' && (
                    <div className="space-y-2 text-xs">
                      <label className="text-[11px] text-slate-400 block">Select Your Bank</label>
                      <select
                        value={selectedBank}
                        onChange={e => setSelectedBank(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none"
                      >
                        <option>HDFC Bank</option>
                        <option>ICICI Bank</option>
                        <option>State Bank of India (SBI)</option>
                        <option>Axis Bank</option>
                        <option>Kotak Mahindra Bank</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Price Breakdown Calculation */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Call Booking Base Price</span>
                  <span className="text-slate-200">₹{basePrice}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Platform Convenience Fee (5%)</span>
                  <span className="text-slate-200">₹{platformFee}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Goods & Services Tax (18% GST)</span>
                  <span className="text-slate-200">₹{gstAmount}</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold text-white">
                  <span>Total Amount Payable</span>
                  <span className="text-emerald-400 font-extrabold text-base">₹{totalPrice}</span>
                </div>
              </div>

              {/* Cancellation Policy Note */}
              <div className="text-[11px] text-slate-400 flex items-start gap-1.5 leading-relaxed">
                <ShieldCheck className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span>
                  <strong>100% Protection Policy:</strong> Free cancellation up to 4 hours before the session. If the creator fails to attend or technical issues interrupt the call, a full refund is immediately credited.
                </span>
              </div>

              {/* Submit Payment CTA */}
              <button
                type="button"
                onClick={handlePayNow}
                disabled={isProcessing}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold text-sm shadow-glow flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying with Payment Gateway...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay ₹{totalPrice} Securely</span>
                  </>
                )}
              </button>
            </>
          )}

        </div>

      </div>
    </div>
  );
};

