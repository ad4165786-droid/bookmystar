import React from 'react';
import { Booking } from '../../types';
import { X, Printer, Download, Sparkles, CheckCircle2 } from 'lucide-react';

interface InvoiceModalProps {
  booking: Booking;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ booking, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const gstAmount = Math.round(booking.amount * 0.1525); // ~18% reverse tax approx
  const baseAmount = booking.amount - gstAmount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white text-slate-900 border border-slate-200 shadow-2xl overflow-hidden p-8">
        
        {/* Header Controls */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-slate-900">BookMyStar India</span>
              <p className="text-[10px] text-slate-500 font-medium">Digital Service Invoice & Tax Receipt</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="py-6 space-y-6 text-xs">
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Billed To (Customer):</span>
              <div className="font-bold text-sm text-slate-800 mt-0.5">{booking.userName}</div>
              <div className="text-slate-600">{booking.userEmail}</div>
              <div className="text-slate-600">{booking.userPhone}</div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400">Invoice Information:</span>
              <div className="font-bold text-sm text-purple-700 mt-0.5">INV-{booking.bookingRef}</div>
              <div className="text-slate-600">Booking Ref: {booking.bookingRef}</div>
              <div className="text-slate-600">Date: {booking.paidAt}</div>
              <div className="text-slate-600 font-mono text-[11px]">Txn ID: {booking.transactionId}</div>
            </div>
          </div>

          {/* Line Item Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase">
                <tr>
                  <th className="py-2.5 px-4">Item & Description</th>
                  <th className="py-2.5 px-4">Mode / Duration</th>
                  <th className="py-2.5 px-4">Schedule</th>
                  <th className="py-2.5 px-4 text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">1-on-1 Session with {booking.influencerName}</div>
                    <div className="text-[11px] text-slate-500">Creator Category: {booking.influencerCategory}</div>
                  </td>
                  <td className="py-3 px-4 capitalize font-medium">{booking.callType} Call ({booking.durationMinutes} min)</td>
                  <td className="py-3 px-4">{booking.scheduledDate} {booking.scheduledTime}</td>
                  <td className="py-3 px-4 text-right font-semibold">₹{baseAmount}</td>
                </tr>
                <tr>
                  <td colSpan={3} className="py-2 px-4 text-right text-slate-500">GST (18% integrated goods & services tax):</td>
                  <td className="py-2 px-4 text-right font-semibold">₹{gstAmount}</td>
                </tr>
                <tr className="bg-slate-50 font-bold text-sm text-slate-900">
                  <td colSpan={3} className="py-3 px-4 text-right">Total Amount Paid:</td>
                  <td className="py-3 px-4 text-right text-purple-700 font-extrabold text-base">₹{booking.amount}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Status stamp */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Payment Confirmed:</strong> Paid via {booking.paymentMethod.toUpperCase()} (Status: {booking.paymentStatus.toUpperCase()})
              </span>
            </div>
            <span className="font-bold font-mono">AUTHORIZED</span>
          </div>

        </div>

        <div className="text-center pt-2 border-t border-slate-100 text-[10px] text-slate-400">
          BookMyStar Internet Services Pvt Ltd • GSTIN: 27AABCB1234F1Z8 • Mumbai, Maharashtra, India
        </div>

      </div>
    </div>
  );
};

