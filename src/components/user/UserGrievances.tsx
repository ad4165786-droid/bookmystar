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

    submitGrievance({
      raisedBy: 'user',
      submitterId: currentUser.id,
      submitterName: currentUser.name,
      submitterRole: 'user',
      category,
      priority,
      subject: subject.trim(),
      description: description.trim(),
      bookingRef: selectedBookingRef || undefined
    });

    setSubject('');
    setDescription('');
    setShowNewModal(false);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    replyToGrievance(selectedTicket.id, replyText.trim(), false);
    setReplyText('');
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white">Grievance & Support Desk</h1>
          <p className="text-xs text-slate-400 mt-0.5">Submit complaints regarding calls, payments, or creator conduct</p>
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
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
          <LifeBuoy className="w-8 h-8 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Support Cases Raised</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            All your bookings and payment transactions are in good standing. Have questions? Our support team is here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Ticket List (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            {userTickets.map(ticket => (
              <div
                key={ticket.id}
                onClick={() => setSelectedTicketId(ticket.id)}
                className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
                  selectedTicket?.id === ticket.id
                    ? 'bg-slate-900 border-brand-500 shadow-glow'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-brand-300 font-bold">{ticket.ticketRef}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                    ticket.status === 'resolved'
                      ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/30'
                      : ticket.status === 'in_progress'
                      ? 'bg-amber-950/70 text-amber-300 border border-amber-500/30'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                </div>

                <h4 className="font-bold text-white line-clamp-1">{ticket.subject}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                  {ticket.description}
                </p>

                <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-800/80">
                  <span className="capitalize font-medium text-slate-400">Category: {ticket.category}</span>
                  <span>{ticket.createdAt.split(' ')[0]}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Ticket Conversation Detail View (7 cols) */}
          <div className="lg:col-span-7">
            {selectedTicket ? (
              <div className="rounded-2xl bg-slate-900 border border-slate-800 flex flex-col h-[580px] overflow-hidden shadow-xl">
                
                {/* Header */}
                <div className="p-4 border-b border-slate-800 bg-slate-950/60">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono text-brand-400 font-bold">{selectedTicket.ticketRef}</span>
                      <h3 className="text-sm font-bold text-white mt-0.5">{selectedTicket.subject}</h3>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 uppercase">
                      {selectedTicket.priority} Priority
                    </span>
                  </div>
                  {selectedTicket.bookingRef && (
                    <div className="text-[11px] text-slate-400 mt-1">
                      Associated Booking: <span className="font-mono text-white">{selectedTicket.bookingRef}</span>
                    </div>
                  )}
                </div>

                {/* Message Log */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
                  {selectedTicket.responses.map(resp => {
                    const isAdmin = resp.role === 'admin';
                    return (
                      <div
                        key={resp.id}
                        className={`p-3.5 rounded-xl border leading-relaxed ${
                          isAdmin
                            ? 'bg-brand-950/40 border-brand-500/30 text-brand-100 ml-4'
                            : 'bg-slate-800/80 border-slate-700/60 text-slate-200 mr-4'
                        }`}
                      >
                        <div className="flex items-center justify-between pb-1 mb-1 border-b border-white/5 text-[10px]">
                          <span className={`font-bold ${isAdmin ? 'text-brand-300' : 'text-slate-300'}`}>
                            {resp.sender} {isAdmin && '(BMS Support)'}
                          </span>
                          <span className="text-slate-500">{resp.timestamp}</span>
                        </div>
                        <p>{resp.message}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Reply Box */}
                {selectedTicket.status !== 'closed' ? (
                  <form onSubmit={handleSendReply} className="p-3 border-t border-slate-800 bg-slate-950/60 flex gap-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder="Add information or ask support team..."
                      className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                    />
                    <button
                      type="submit"
                      className="py-2 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Reply</span>
                    </button>
                  </form>
                ) : (
                  <div className="p-3 text-center text-xs text-slate-500 bg-slate-950/40 border-t border-slate-800">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Create New Support Case</h3>
              <button onClick={() => setShowNewModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Issue Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                >
                  <option value="call">Call Disconnect / Technical Glitch</option>
                  <option value="payment">Payment / Refund / Billing</option>
                  <option value="booking">Booking / Schedule Issue</option>
                  <option value="behaviour">Influencer Conduct / Boundary Issue</option>
                  <option value="account">Account Access</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Associated Booking (Optional)</label>
                <select
                  value={selectedBookingRef}
                  onChange={e => setSelectedBookingRef(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
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
                <label className="block text-slate-300 font-semibold mb-1">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="e.g. Video call froze after 2 minutes"
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Detailed Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Provide timestamps and details for our operations team..."
                  rows={4}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-glow transition-colors"
                >
                  Submit Ticket
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
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

