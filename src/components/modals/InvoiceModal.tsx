import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Booking } from '../../types';
import { X, Printer, Download, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

interface InvoiceModalProps {
  booking: Booking;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ booking, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    document.body.classList.add('invoice-modal-open');
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('invoice-modal-open');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const gstAmount = Math.round(booking.amount * 0.1525); // ~18% reverse tax approx
  const baseAmount = booking.amount - gstAmount;

  const modalContent = (
    <div
      id="printable-invoice-container"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="printable-invoice-content"
        className="relative w-full max-w-2xl rounded-2xl bg-white text-slate-900 border border-slate-200 shadow-2xl ring-1 ring-slate-900/10 overflow-hidden p-8"
      >
        {/* Header Controls (Hidden during print) */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200 no-print">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 via-orange-500 to-brand-600 flex items-center justify-center text-white shadow-sm">
              <ShieldCheck className="w-4 h-4 fill-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-slate-900">BookMy<span className="text-amber-500">Star</span></span>
              <p className="text-[10px] text-slate-500 font-medium">Digital Service Invoice & Tax Receipt</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-xs font-bold text-white shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Letterhead (Shown in print or screen) */}
        <div className="hidden print:flex items-center justify-between pb-6 border-b border-slate-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5 fill-white" />
            </div>
            <div>
              <span className="font-black text-xl text-slate-900">BookMyStar India</span>
              <p className="text-xs text-slate-600">Official Tax Invoice & GST Receipt</p>
            </div>
          </div>
          <div className="text-right text-xs text-slate-500">
            <div>Original for Recipient</div>
            <div className="font-mono text-[11px] font-semibold text-slate-800">TAX INVOICE</div>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="py-6 space-y-6 text-xs">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Billed To (Customer):</span>
              <div className="font-bold text-sm text-slate-900 mt-1">{booking.userName}</div>
              <div className="text-slate-600 mt-0.5">{booking.userEmail}</div>
              <div className="text-slate-600">{booking.userPhone}</div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Invoice Information:</span>
              <div className="font-bold text-sm text-purple-700 mt-1 font-mono">INV-{booking.bookingRef}</div>
              <div className="text-slate-600 mt-0.5">Booking Ref: <strong className="text-slate-800 font-mono">{booking.bookingRef}</strong></div>
              <div className="text-slate-600">Date: {booking.paidAt || booking.scheduledDate}</div>
              <div className="text-slate-600 font-mono text-[11px]">Txn ID: {booking.transactionId}</div>
            </div>
          </div>

          {/* Line Item Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase">
                <tr>
                  <th className="py-2.5 px-4">Item & Description</th>
                  <th className="py-2.5 px-4">Mode / Duration</th>
                  <th className="py-2.5 px-4">Schedule</th>
                  <th className="py-2.5 px-4 text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">1-on-1 Session with {booking.influencerName}</div>
                    <div className="text-[11px] text-slate-500">Creator Category: {booking.influencerCategory}</div>
                  </td>
                  <td className="py-3.5 px-4 capitalize font-medium">{booking.callType} Call ({booking.durationMinutes} min)</td>
                  <td className="py-3.5 px-4">{booking.scheduledDate} {booking.scheduledTime}</td>
                  <td className="py-3.5 px-4 text-right font-semibold text-slate-900">₹{baseAmount}</td>
                </tr>
                <tr>
                  <td colSpan={3} className="py-2.5 px-4 text-right text-slate-500">
                    GST (18% integrated goods & services tax):
                  </td>
                  <td className="py-2.5 px-4 text-right font-semibold text-slate-900">₹{gstAmount}</td>
                </tr>
                <tr className="bg-slate-50/80 font-bold text-sm text-slate-900">
                  <td colSpan={3} className="py-3.5 px-4 text-right">Total Amount Paid:</td>
                  <td className="py-3.5 px-4 text-right text-purple-700 font-extrabold text-base">₹{booking.amount}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Status stamp */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Payment Confirmed:</strong> Paid via {booking.paymentMethod.toUpperCase()} • Escrow Protected (Status: {booking.paymentStatus.toUpperCase()})
              </span>
            </div>
            <span className="font-bold font-mono tracking-wider text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-300">
              AUTHORIZED
            </span>
          </div>
        </div>

        <div className="text-center pt-4 border-t border-slate-100 text-[10px] text-slate-500 space-y-0.5">
          <div className="font-medium text-slate-700">BookMyStar Internet Services Pvt Ltd • GSTIN: 27AABCB1234F1Z8</div>
          <div>Registered Office: Bandra-Kurla Complex, Mumbai, Maharashtra 400051, India</div>
          <div className="text-slate-400">This is a computer-generated tax invoice and requires no physical signature.</div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
