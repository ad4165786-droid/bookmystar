import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserProfile } from '../../types';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  Ban, 
  RotateCcw, 
  Mail, 
  Phone, 
  Calendar, 
  CreditCard,
  X
} from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const { users, bookings, toggleUserStatus, showToast } = useApp();

  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  const filteredUsers = users.filter(u => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.phone.includes(q);
  });

  const getUserBookings = (userId: string) => bookings.filter(b => b.userId === userId);

  return (
    <div className="space-y-6 pb-16">
      
      {/* Title & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white">Registered User Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Customer directory, account status governance, booking & refund transaction records
          </p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email, phone..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Users Master Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 text-slate-400 text-[10px] uppercase font-bold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">User / Customer</th>
                <th className="py-3 px-4">Contact Details</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4 text-center">Total Calls</th>
                <th className="py-3 px-4 text-right">Lifetime Spent</th>
                <th className="py-3 px-4 text-center">Account Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredUsers.map(user => {
                const userCalls = getUserBookings(user.id);
                return (
                  <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-700" />
                        <div>
                          <div className="font-bold text-white text-sm">{user.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Mail className="w-3.5 h-3.5 text-slate-500" /> {user.email}
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                        <Phone className="w-3.5 h-3.5 text-slate-500" /> {user.phone}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-400">{user.createdAt}</td>

                    <td className="py-3.5 px-4 text-center font-bold text-white">
                      {userCalls.length}
                    </td>

                    <td className="py-3.5 px-4 text-right font-extrabold text-emerald-400">
                      ₹{user.totalSpent.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                        user.status === 'active'
                          ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-950/70 text-rose-300 border border-rose-500/30'
                      }`}>
                        {user.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-[11px]"
                        >
                          View Dossier
                        </button>

                        {user.status === 'active' ? (
                          <button
                            onClick={() => toggleUserStatus(user.id, 'suspend')}
                            className="p-1 rounded-lg hover:bg-rose-500/20 text-rose-400 transition-colors"
                            title="Suspend Account"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => toggleUserStatus(user.id, 'activate')}
                            className="p-1 rounded-lg hover:bg-emerald-500/20 text-emerald-400 transition-colors"
                            title="Re-activate Account"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Dossier Drawer / Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <img src={selectedUser.avatar} alt={selectedUser.name} className="w-12 h-12 rounded-xl object-cover ring-2 ring-amber-500" />
                <div>
                  <h3 className="text-base font-bold text-white">{selectedUser.name}</h3>
                  <p className="text-xs text-slate-400">{selectedUser.email} • {selectedUser.phone}</p>
                </div>
              </div>

              <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Total Lifetime Spent</span>
                <span className="text-lg font-extrabold text-emerald-400">₹{selectedUser.totalSpent}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Total Bookings Count</span>
                <span className="text-lg font-extrabold text-white">{selectedUser.totalBookings} Calls</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Current Status</span>
                <span className={`text-sm font-bold capitalize ${selectedUser.status === 'active' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {selectedUser.status}
                </span>
              </div>
            </div>

            {/* Bookings / Transaction History for this User */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Call Booking & Payment History</h4>
              
              {getUserBookings(selectedUser.id).length === 0 ? (
                <p className="text-xs text-slate-500 italic">No bookings made by this user.</p>
              ) : (
                <div className="space-y-2">
                  {getUserBookings(selectedUser.id).map(b => (
                    <div key={b.id} className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 text-xs flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white">Call with {b.influencerName} ({b.callType})</div>
                        <div className="text-[10px] text-slate-400 font-mono">Ref: {b.bookingRef} • {b.scheduledDate} {b.scheduledTime}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-white">₹{b.amount}</div>
                        <span className="text-[10px] text-emerald-400 font-semibold uppercase">{b.bookingStatus}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Governance Actions */}
            <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
              {selectedUser.status === 'active' ? (
                <button
                  onClick={() => {
                    toggleUserStatus(selectedUser.id, 'suspend');
                    setSelectedUser({ ...selectedUser, status: 'suspended' });
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                >
                  Suspend User Account
                </button>
              ) : (
                <button
                  onClick={() => {
                    toggleUserStatus(selectedUser.id, 'activate');
                    setSelectedUser({ ...selectedUser, status: 'active' });
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  Re-activate User Account
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

