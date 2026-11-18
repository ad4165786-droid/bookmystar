import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GrievanceTicket } from '../../types';
import { 
  LifeBuoy, 
  Search, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  RotateCcw, 
  Lock, 
  Send,
  User,
  ShieldCheck,
  PhoneCall,
  Video
} from 'lucide-react';

export const AdminGrievances: React.FC = () => {
  const { grievances, replyToGrievance, updateGrievanceStatus, showToast } = useApp();

  const [selectedTicketId, setSelectedTicketId] = useState<string>(grievances[0]?.id || '');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [replyMessage, setReplyMessage] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);

  const selectedTicket = grievances.find(g => g.id === selectedTicketId) || grievances[0];

  const filteredTickets = grievances.filter(g => {
    if (filterStatus !== 'all' && g.status !== filterStatus) return false;
    if (filterCategory !== 'all' && g.category !== filterCategory) return false;
    return true;
  });

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Grievance & Dispute Resolution Desk</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Customer dispute adjudication, technical connection investigations, and misconduct reports
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl bg-white border border-slate-200/90 shadow-sm text-slate-700 font-medium focus:outline-none focus:border-amber-500"
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
            className="px-3 py-1.5 text-xs rounded-xl bg-white border border-slate-200/90 shadow-sm text-slate-700 font-medium focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Categories</option>
            <option value="call">Call Failure / Quality</option>
            <option value="payment">Payment / Billing</option>
            <option value="behaviour">Behavior / Boundary</option>
            <option value="booking">Booking / Schedule</option>
            <option value="other">Other / Custom</option>
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
                  ? 'bg-white border-2 border-amber-500 shadow-md ring-1 ring-amber-500/20'
                  : 'bg-white border border-slate-200/90 shadow-sm hover:shadow-md ring-1 ring-slate-900/5 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-amber-700 font-bold">{ticket.ticketRef}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                  ticket.status === 'resolved'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : ticket.status === 'in_progress'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}>
                  {ticket.status.replace('_', ' ')}
                </span>
              </div>

              <h4 className="font-bold text-slate-900 line-clamp-1 text-sm">{ticket.subject}</h4>
              <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                {ticket.description}
              </p>

              <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500 pt-1">
                <span className="font-semibold text-slate-700">
                  {ticket.submitterName} ({ticket.submitterRole})
                </span>
                <span className="capitalize text-amber-700 font-semibold">{ticket.customCategory || ticket.category}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Ticket Adjudication Panel (7 cols) */}
        <div className="lg:col-span-7">
          {selectedTicket ? (
            <div className="rounded-2xl bg-white border border-slate-200/90 shadow-md ring-1 ring-slate-900/5 flex flex-col h-[600px] overflow-hidden">
              
              {/* Header */}
              <div className="p-4 bg-slate-50 border-b border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono text-amber-700 font-bold">{selectedTicket.ticketRef}</span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">{selectedTicket.subject}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={selectedTicket.status}
                      onChange={e => updateGrievanceStatus(selectedTicket.id, e.target.value as any)}
                      className="px-2.5 py-1 text-xs rounded-lg bg-white border border-slate-200 text-slate-800 font-semibold shadow-sm focus:outline-none focus:border-amber-500"
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                  <span>Filed by: <strong className="text-slate-900">{selectedTicket.submitterName}</strong></span>
                  <span>•</span>
                  <span>Category: <strong className="text-amber-700 capitalize">{selectedTicket.customCategory || selectedTicket.category}</strong></span>
                  {selectedTicket.bookingRef && (
                    <>
                      <span>•</span>
                      <span>Booking: <strong className="font-mono text-indigo-600">{selectedTicket.bookingRef}</strong></span>
                    </>
                  )}
                </div>
              </div>

              {/* Message Feed */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-white">
                {selectedTicket.responses.map(resp => (
                  <div
                    key={resp.id}
                    className={`p-3.5 rounded-xl border leading-relaxed ${
                      resp.isInternalNote
                        ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                        : resp.role === 'admin'
                        ? 'bg-indigo-50/80 border-indigo-200 text-indigo-950 ml-4'
                        : 'bg-slate-50 border-slate-200 text-slate-800 mr-4'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-1 mb-1 text-[10px]">
                      <span className="font-bold flex items-center gap-1.5">
                        {resp.isInternalNote && <Lock className="w-3 h-3 text-amber-600" />}
                        <span className={resp.isInternalNote ? 'text-amber-800' : resp.role === 'admin' ? 'text-indigo-800' : 'text-slate-800'}>{resp.sender}</span>
                        {resp.isInternalNote && <span className="text-amber-700 font-mono font-bold">[INTERNAL ADMIN NOTE]</span>}
                      </span>
                      <span className="text-slate-500">{resp.timestamp}</span>
                    </div>
                    <p>{resp.message}</p>
                  </div>
                ))}
              </div>

              {/* Response & Internal Notes Input */}
              <form onSubmit={handleSendReply} className="p-3 border-t border-slate-100 bg-slate-50 space-y-2">
                <div className="flex items-center gap-3 text-xs">
                  <label className="flex items-center gap-1.5 text-slate-600 font-medium cursor-pointer">
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
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                  <button
                    type="submit"
                    className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-1.5"
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
