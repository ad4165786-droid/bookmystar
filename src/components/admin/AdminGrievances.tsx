import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GrievanceTicket } from '../../types';
import { 
  LifeBuoy, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  User, 
  Lock,
  Search,
  Filter,
  X
} from 'lucide-react';

export const AdminGrievances: React.FC = () => {
  const { 
    grievances, 
    replyToGrievance, 
    updateGrievanceStatus, 
    refundBooking, 
    bookings, 
    showToast 
  } = useApp();

  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [replyMessage, setReplyMessage] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);

  const filteredTickets = grievances.filter(g => {
    if (filterCategory !== 'all' && g.category !== filterCategory) return false;
    if (filterStatus !== 'all' && g.status !== filterStatus) return false;
    return true;
  });

  const selectedTicket = grievances.find(g => g.id === selectedTicketId) || filteredTickets[0];

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTicket) return;

    replyToGrievance(selectedTicket.id, replyMessage.trim(), isInternalNote);
    setReplyMessage('');
    setIsInternalNote(false);
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Title & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white">Grievance & Dispute Resolution Desk</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Customer dispute adjudication, technical connection investigations, and misconduct reports
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none"
          >
            <option value="all">All Ticket Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="call">Call Failure / Quality</option>
            <option value="payment">Payment / Billing</option>
            <option value="behaviour">Behavior / Boundary</option>
            <option value="booking">Booking / Schedule</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Ticket List + Conversation Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Ticket List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {filteredTickets.map(ticket => (
            <div
              key={ticket.id}
              onClick={() => setSelectedTicketId(ticket.id)}
              className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
                selectedTicket?.id === ticket.id
                  ? 'bg-slate-900 border-amber-500 shadow-glow'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-amber-300 font-bold">{ticket.ticketRef}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                  ticket.status === 'resolved'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                    : ticket.status === 'in_progress'
                    ? 'bg-amber-950 text-amber-300 border border-amber-500/30'
                    : 'bg-slate-800 text-slate-300'
                }`}>
                  {ticket.status.replace('_', ' ')}
                </span>
              </div>

              <h4 className="font-bold text-white line-clamp-1 text-sm">{ticket.subject}</h4>
              <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                {ticket.description}
              </p>

              <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-800/80">
                <span className="font-semibold text-slate-300">
                  {ticket.submitterName} ({ticket.submitterRole})
                </span>
                <span className="capitalize text-amber-400 font-medium">{ticket.category}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Ticket Adjudication Panel (7 cols) */}
        <div className="lg:col-span-7">
          {selectedTicket ? (
            <div className="rounded-2xl bg-slate-900 border border-slate-800 flex flex-col h-[600px] overflow-hidden shadow-xl">
              
              {/* Header */}
              <div className="p-4 border-b border-slate-800 bg-slate-950/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono text-amber-400 font-bold">{selectedTicket.ticketRef}</span>
                    <h3 className="text-base font-bold text-white mt-0.5">{selectedTicket.subject}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={selectedTicket.status}
                      onChange={e => updateGrievanceStatus(selectedTicket.id, e.target.value as any)}
                      className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white font-semibold focus:outline-none"
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                  <span>Filed by: <strong className="text-white">{selectedTicket.submitterName}</strong></span>
                  <span>•</span>
                  <span>Category: <strong className="text-amber-300 capitalize">{selectedTicket.category}</strong></span>
                  {selectedTicket.bookingRef && (
                    <>
                      <span>•</span>
                      <span>Booking: <strong className="font-mono text-brand-300">{selectedTicket.bookingRef}</strong></span>
                    </>
                  )}
                </div>
              </div>

              {/* Message Feed */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
                {selectedTicket.responses.map(resp => (
                  <div
                    key={resp.id}
                    className={`p-3.5 rounded-xl border leading-relaxed ${
                      resp.isInternalNote
                        ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                        : resp.role === 'admin'
                        ? 'bg-brand-950/40 border-brand-500/30 text-brand-100 ml-4'
                        : 'bg-slate-800/80 border-slate-700/60 text-slate-200 mr-4'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-1 mb-1 border-b border-white/5 text-[10px]">
                      <span className="font-bold flex items-center gap-1.5">
                        {resp.isInternalNote && <Lock className="w-3 h-3 text-amber-400" />}
                        <span>{resp.sender}</span>
                        {resp.isInternalNote && <span className="text-amber-400 font-mono">[INTERNAL ADMIN NOTE]</span>}
                      </span>
                      <span className="text-slate-500">{resp.timestamp}</span>
                    </div>
                    <p>{resp.message}</p>
                  </div>
                ))}
              </div>

              {/* Response & Internal Notes Input */}
              <form onSubmit={handleSendReply} className="p-3 border-t border-slate-800 bg-slate-950/60 space-y-2">
                <div className="flex items-center gap-3 text-xs">
                  <label className="flex items-center gap-1.5 text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isInternalNote}
                      onChange={e => setIsInternalNote(e.target.checked)}
                      className="w-3.5 h-3.5 accent-amber-500 rounded"
                    />
                    <span>Post as Internal Staff Note (Hidden from User)</span>
                  </label>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={replyMessage}
                    onChange={e => setReplyMessage(e.target.value)}
                    placeholder={isInternalNote ? "Record internal note for support team..." : "Send official response to complainant..."}
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="py-2 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </div>
              </form>

            </div>
          ) : null}
        </div>

      </div>

    </div>
  );
};

