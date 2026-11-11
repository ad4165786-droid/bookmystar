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
    <div className="space-y-8 pb-16 max-w-4xl">
      
      <div className="pb-2 border-b border-slate-800">
        <h1 className="text-2xl font-black text-white">Account Settings & Profile</h1>
        <p className="text-xs text-slate-400 mt-0.5">Manage your personal credentials, contact numbers, and security</p>
      </div>

      {/* Profile Info Form */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-brand-500 shadow-md"
          />
          <div>
            <h3 className="text-base font-bold text-white">{currentUser.name}</h3>
            <p className="text-xs text-slate-400">Fan Account • Member since {currentUser.createdAt}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Full Legal Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Mobile Number (India +91)</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Default Currency</label>
              <input
                type="text"
                value="Indian Rupee (₹ INR)"
                disabled
                className="w-full px-3 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-400"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 py-2.5 px-5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-white font-bold text-xs shadow-glow hover:opacity-95"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>

      {/* Notification Preferences */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <Bell className="w-4 h-4 text-brand-400" />
          <h3 className="text-sm font-bold text-white">Call Reminders & Notification Channels</h3>
        </div>

        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 cursor-pointer">
            <div>
              <div className="font-semibold text-slate-200">WhatsApp Call Alerts</div>
              <div className="text-[11px] text-slate-400">Receive instant meeting room link 10 mins before your call</div>
            </div>
            <input
              type="checkbox"
              checked={whatsappNotif}
              onChange={e => setWhatsappNotif(e.target.checked)}
              className="w-4 h-4 accent-brand-500 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 cursor-pointer">
            <div>
              <div className="font-semibold text-slate-200">SMS Booking Confirmations</div>
              <div className="text-[11px] text-slate-400">Receive OTP and booking receipt reference via SMS</div>
            </div>
            <input
              type="checkbox"
              checked={smsNotif}
              onChange={e => setSmsNotif(e.target.checked)}
              className="w-4 h-4 accent-brand-500 rounded"
            />
          </label>
        </div>
      </div>

      {/* Transaction & Payment History */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Payment & Escrow History</h3>
          </div>
          <span className="text-xs text-slate-400">{userTransactions.length} transactions</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 text-[10px] uppercase font-bold">
              <tr>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Booking Ref</th>
                <th className="py-2.5 px-3">Creator</th>
                <th className="py-2.5 px-3">Txn ID</th>
                <th className="py-2.5 px-3">Method</th>
                <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {userTransactions.map(t => (
                <tr key={t.id}>
                  <td className="py-2.5 px-3 text-[11px]">{t.paidAt}</td>
                  <td className="py-2.5 px-3 font-mono text-brand-300 font-bold">{t.bookingRef}</td>
                  <td className="py-2.5 px-3 font-semibold text-white">{t.influencerName}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-400 text-[11px]">{t.transactionId}</td>
                  <td className="py-2.5 px-3 uppercase text-[10px] font-bold text-slate-400">{t.paymentMethod}</td>
                  <td className="py-2.5 px-3 text-right font-extrabold text-white">₹{t.amount}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 uppercase">
                      {t.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

