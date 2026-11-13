import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Bell,
  Lock,
  CreditCard,
  CheckCircle2,
  Clock,
  Save
} from 'lucide-react';

export const UserProfileSettings: React.FC = () => {
  const { currentUser, bookings, showToast } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);

  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(true);
  const [whatsappNotif, setWhatsappNotif] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    currentUser.name = name;
    currentUser.email = email;
    currentUser.phone = phone;
    showToast('Profile information saved successfully.');
  };

  const userTransactions = bookings.filter(b => b.userId === currentUser.id);

  return (
    <div className="space-y-8 pb-6 max-w-4xl">

      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Account Settings & Profile</h1>
        <p className="text-xs text-slate-500 mt-1">Manage your fan account identity, communications, and verified payment transactions.</p>
      </div>

      {/* Profile Info Form */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex items-center gap-4 pb-5 border-b border-slate-100">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-brand-500 shadow-md bg-white"
          />
          <div>
            <h3 className="text-base font-extrabold text-slate-900">{currentUser.name}</h3>
            <p className="text-xs text-slate-500 font-medium">Fan Account • Member since {currentUser.createdAt}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Full Legal Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/10 text-xs transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/10 text-xs transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Mobile Number (India +91)</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/10 text-xs transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Default Currency</label>
              <input
                type="text"
                value="Indian Rupee (₹ INR)"
                disabled
                className="w-full px-3 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 text-xs cursor-not-allowed font-medium"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 py-2.5 px-6 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-extrabold text-xs shadow-md shadow-brand-500/25 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>

      {/* Notification Preferences */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Bell className="w-4 h-4 text-brand-600" />
          <h3 className="text-sm font-extrabold text-slate-900">Call Reminders & Notification Channels</h3>
        </div>

        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 cursor-pointer transition-colors">
            <div>
              <div className="font-bold text-slate-800">WhatsApp Call Alerts</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Receive instant meeting room link 10 mins before your call</div>
            </div>
            <input
              type="checkbox"
              checked={whatsappNotif}
              onChange={e => setWhatsappNotif(e.target.checked)}
              className="w-4 h-4 accent-brand-600 rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 cursor-pointer transition-colors">
            <div>
              <div className="font-bold text-slate-800">SMS Booking Confirmations</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Receive OTP and booking receipt reference via SMS</div>
            </div>
            <input
              type="checkbox"
              checked={smsNotif}
              onChange={e => setSmsNotif(e.target.checked)}
              className="w-4 h-4 accent-brand-600 rounded cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* Transaction & Payment History */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-extrabold text-slate-900">Payment & Escrow History</h3>
          </div>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            {userTransactions.length} transactions
          </span>
        </div>

        {userTransactions.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No payment transactions recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 text-[10px] uppercase font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3.5">Date</th>
                  <th className="py-3 px-3.5">Booking Ref</th>
                  <th className="py-3 px-3.5">Creator</th>
                  <th className="py-3 px-3.5">Txn ID</th>
                  <th className="py-3 px-3.5">Method</th>
                  <th className="py-3 px-3.5 text-right">Amount (₹)</th>
                  <th className="py-3 px-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
                {userTransactions.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3.5 text-[11px] text-slate-500">{t.paidAt}</td>
                    <td className="py-3 px-3.5 font-mono text-brand-600 font-bold">{t.bookingRef}</td>
                    <td className="py-3 px-3.5 font-bold text-slate-900">{t.influencerName}</td>
                    <td className="py-3 px-3.5 font-mono text-slate-500 text-[11px]">{t.transactionId}</td>
                    <td className="py-3 px-3.5 uppercase text-[10px] font-bold text-slate-500">{t.paymentMethod}</td>
                    <td className="py-3 px-3.5 text-right font-black text-slate-900">₹{t.amount}</td>
                    <td className="py-3 px-3.5 text-center">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 uppercase">
                        {t.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
