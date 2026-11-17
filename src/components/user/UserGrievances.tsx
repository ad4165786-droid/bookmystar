import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GrievanceTicket } from '../../types';
import {
  LifeBuoy,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Send,
  MessageSquare,
  ShieldAlert,
  ChevronRight,
  X
} from 'lucide-react';

export const UserGrievances: React.FC = () => {
  const {
    grievances,
    currentUser,
    submitGrievance,
    replyToGrievance,
    bookings,
    showToast
  } = useApp();

  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  // Form states
  const [category, setCategory] = useState<GrievanceTicket['category']>('call');
  const [customCategory, setCustomCategory] = useState('');
  const [priority, setPriority] = useState<GrievanceTicket['priority']>('medium');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [selectedBookingRef, setSelectedBookingRef] = useState('');
  const [replyText, setReplyText] = useState('');

  // User's tickets
  const userTickets = grievances.filter(g => g.submitterId === currentUser.id);
  const selectedTicket = grievances.find(g => g.id === selectedTicketId) || userTickets[0];

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;
    if (category === 'other' && !customCategory.trim()) return;

    submitGrievance({
      raisedBy: 'user',
      submitterId: currentUser.id,
      submitterName: currentUser.name,
      submitterRole: 'user',
      category: category === 'other' ? (customCategory.trim() || 'other') : category,
      customCategory: category === 'other' ? customCategory.trim() : undefined,
      priority,
      subject: subject.trim(),
      description: description.trim(),
      bookingRef: selectedBookingRef || undefined
    });

    setSubject('');
    setDescription('');
    setCustomCategory('');
    setCategory('call');
    setShowNewModal(false);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    replyToGrievance(selectedTicket.id, replyText.trim(), false);
    setReplyText('');
  };

  return (
    <div className="space-y-6 pb-6">

      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Grievance & Support Desk</h1>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 py-2 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold text-xs shadow-glow transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Open Support Ticket</span>
        </button>
      </div>

      {userTickets.length === 0 ? (
        <div className="p-12 sm:p-16 text-center rounded-3xl bg-white border border-slate-200/90 shadow-md ring-1 ring-slate-900/5 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 border border-brand-100 text-brand-600 flex items-center justify-center mx-auto shadow-2xs">
            <LifeBuoy className="w-7 h-7 text-brand-600" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-slate-900">No Support Cases Raised</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
              All your bookings and payment transactions are in good standing. Have questions? Our support team is here.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Ticket List (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            {userTickets.map(ticket => (
              <div
                key={ticket.id}
                onClick={() => setSelectedTicketId(ticket.id)}
                className={`p-4 rounded-2xl border text-xs cursor-pointer transition-all ${selectedTicket?.id === ticket.id
                  ? 'bg-white border-2 border-brand-500 shadow-md ring-2 ring-brand-500/20'
                  : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-sm ring-1 ring-slate-900/5 hover:shadow-md'
                  }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-brand-600 font-bold">{ticket.ticketRef}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${ticket.status === 'resolved'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : ticket.status === 'in_progress'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 line-clamp-1">{ticket.subject}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                  {ticket.description}
                </p>

                <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                  <span className="capitalize font-medium text-slate-600">
                    Category: {ticket.customCategory || ticket.category}
                  </span>
                  <span>{ticket.createdAt.split(' ')[0]}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Ticket Conversation Detail View (7 cols) */}
          <div className="lg:col-span-7">
            {selectedTicket ? (
              <div className="rounded-3xl bg-white border border-slate-200/90 shadow-md ring-1 ring-slate-900/5 flex flex-col h-[580px] overflow-hidden hover:shadow-lg transition-all">

                {/* Header */}
                <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono text-brand-600 font-bold">{selectedTicket.ticketRef}</span>
                      <h3 className="text-sm font-bold text-slate-900 mt-0.5">{selectedTicket.subject}</h3>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 uppercase border border-slate-200">
                      {selectedTicket.priority} Priority
                    </span>
                  </div>
                  {selectedTicket.bookingRef && (
                    <div className="text-[11px] text-slate-500 mt-1">
                      Associated Booking: <span className="font-mono text-slate-800 font-bold">{selectedTicket.bookingRef}</span>
                    </div>
                  )}
                </div>

                {/* Message Log */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-slate-50/30">
                  {selectedTicket.responses.map(resp => {
                    const isAdmin = resp.role === 'admin';
                    return (
                      <div
                        key={resp.id}
                        className={`p-3.5 rounded-2xl border leading-relaxed shadow-2xs ${isAdmin
                          ? 'bg-brand-50/80 border-brand-200/80 text-brand-950 ml-4'
                          : 'bg-white border-slate-200/90 text-slate-800 mr-4'
                          }`}
                      >
                        <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-200/60 text-[10px]">
                          <span className={`font-bold ${isAdmin ? 'text-brand-700' : 'text-slate-700'}`}>
                            {resp.sender} {isAdmin && '(BMS Support)'}
                          </span>
                          <span className="text-slate-400">{resp.timestamp}</span>
                        </div>
                        <p className="text-slate-700">{resp.message}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Reply Box */}
                {selectedTicket.status !== 'closed' ? (
                  <form onSubmit={handleSendReply} className="p-3.5 border-t border-slate-100 bg-slate-50/70 flex gap-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder="Add information or ask support team..."
                      className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition-all"
                    />
                    <button
                      type="submit"
                      className="py-2 px-4 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/25 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Reply</span>
                    </button>
                  </form>
                ) : (
                  <div className="p-3.5 text-center text-xs text-slate-500 bg-slate-50 border-t border-slate-100">
                    This ticket is resolved and closed.
                  </div>
                )}

              </div>
            ) : null}
          </div>

        </div>
      )}

      {/* New Ticket Modal */}
      {showNewModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowNewModal(false);
          }}
        >
          <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">Create New Support Case</h3>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Issue Category</label>
                <div className="space-y-2">
                  <select
                    value={category}
                    onChange={e => {
                      const val = e.target.value as any;
                      setCategory(val);
                      if (val !== 'other') {
                        setCustomCategory('');
                      }
                    }}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-brand-500"
                  >
                    <option value="call">Call Disconnect / Technical Glitch</option>
                    <option value="payment">Payment / Refund / Billing</option>
                    <option value="booking">Booking / Schedule Issue</option>
                    <option value="behaviour">Influencer Conduct / Boundary Issue</option>
                    <option value="account">Account Access</option>
                    <option value="other">Other</option>
                  </select>

                  {category === 'other' && (
                    <div className="animate-fadeIn">
                      <input
                        type="text"
                        value={customCategory}
                        onChange={e => setCustomCategory(e.target.value)}
                        placeholder="Please enter your custom issue category..."
                        className="w-full p-2.5 rounded-xl bg-white border border-brand-500 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 shadow-xs"
                        required
                        autoFocus
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Associated Booking (Optional)</label>
                <select
                  value={selectedBookingRef}
                  onChange={e => setSelectedBookingRef(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-brand-500"
                >
                  <option value="">None / General Inquiry</option>
                  {bookings.filter(b => b.userId === currentUser.id).map(b => (
                    <option key={b.id} value={b.bookingRef}>
                      {b.bookingRef} — {b.influencerName} ({b.scheduledDate})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="e.g. Video call froze after 2 minutes"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Detailed Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Provide timestamps and details for our operations team..."
                  rows={4}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-extrabold text-xs shadow-md shadow-brand-500/25 transition-all cursor-pointer"
                >
                  Submit Ticket
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
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

