import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GrievanceTicket } from '../../types';
import { 
  Star, 
  Flag, 
  MessageSquareWarning, 
  ShieldAlert, 
  LifeBuoy, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Send,
  X
} from 'lucide-react';

export const InfluencerReviewsGrievances: React.FC = () => {
  const { 
    currentInfluencer, 
    reviews, 
    grievances, 
    flagReview, 
    submitGrievance, 
    replyToGrievance,
    showToast 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'reviews' | 'grievances'>('reviews');
  const [showGrievanceModal, setShowGrievanceModal] = useState(false);
  const [reportSubject, setReportSubject] = useState('');
  const [reportDesc, setReportDesc] = useState('');
  const [reportCategory, setReportCategory] = useState<GrievanceTicket['category']>('behaviour');
  
  // Flag review modal
  const [flaggingReviewId, setFlaggingReviewId] = useState<string | null>(null);
  const [flagReason, setFlagReason] = useState('');

  // Reviews for this creator
  const creatorReviews = reviews.filter(r => r.influencerId === currentInfluencer.id);

  // Grievances involving this creator (raised by them or raised against them)
  const creatorGrievances = grievances.filter(
    g => g.submitterId === currentInfluencer.id || g.targetId === currentInfluencer.id
  );

  const handleFlagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flaggingReviewId || !flagReason.trim()) return;

    flagReview(flaggingReviewId, flagReason.trim());
    setFlaggingReviewId(null);
    setFlagReason('');
  };

  const handleGrievanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportSubject.trim() || !reportDesc.trim()) return;

    submitGrievance({
      raisedBy: 'influencer',
      submitterId: currentInfluencer.id,
      submitterName: currentInfluencer.name,
      submitterRole: 'influencer',
      category: reportCategory,
      priority: 'high',
      subject: reportSubject.trim(),
      description: reportDesc.trim()
    });

    setReportSubject('');
    setReportDesc('');
    setShowGrievanceModal(false);
  };

  return (
    <div className="space-y-6 pb-16 max-w-5xl">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white">Fan Reviews & Safety Reports</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor post-call fan ratings and report misconduct or boundary violations to platform admins
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('reviews')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === 'reviews'
                ? 'bg-purple-600 text-white shadow-glow'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Fan Reviews ({creatorReviews.length})
          </button>
          <button
            onClick={() => setActiveSubTab('grievances')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === 'grievances'
                ? 'bg-purple-600 text-white shadow-glow'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Safety Grievances ({creatorGrievances.length})
          </button>
        </div>
      </div>

      {/* Subtab 1: Fan Reviews */}
      {activeSubTab === 'reviews' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-black text-white">
                  {currentInfluencer.rating > 0 ? currentInfluencer.rating : '5.0'}
                </div>
                <div className="flex items-center text-amber-400">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Based on {creatorReviews.length} fan ratings</p>
            </div>

            <div className="text-right text-[11px] text-slate-400 max-w-xs">
              <span className="font-semibold text-slate-300">Policy Notice:</span> Influencers cannot alter or delete fan ratings directly. Inappropriate reviews can be flagged for Admin moderation.
            </div>
          </div>

          {creatorReviews.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-8">No fan reviews posted yet.</p>
          ) : (
            <div className="space-y-3">
              {creatorReviews.map(rev => (
                <div
                  key={rev.id}
                  className={`p-4 rounded-xl border text-xs space-y-2 ${
                    rev.isFlagged
                      ? 'bg-rose-950/20 border-rose-500/30'
                      : 'bg-slate-900/80 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img src={rev.userAvatar} alt={rev.userName} className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-700" />
                      <div>
                        <span className="font-bold text-white">{rev.userName}</span>
                        <span className="text-[10px] text-slate-400 ml-2 font-mono">Ref: {rev.bookingRef}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>

                      {!rev.isFlagged ? (
                        <button
                          onClick={() => setFlaggingReviewId(rev.id)}
                          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-400 transition-colors"
                          title="Report abusive or fake review"
                        >
                          <Flag className="w-3 h-3" />
                          <span>Report</span>
                        </button>
                      ) : (
                        <span className="text-[10px] font-bold text-rose-400 px-2 py-0.5 rounded bg-rose-950/40 border border-rose-500/30">
                          Flagged for Admin Review
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-slate-300 leading-relaxed text-xs">
                    "{rev.comment}"
                  </p>

                  <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800/80 flex justify-between">
                    <span>{rev.callType === 'video' ? 'Video Call' : 'Voice Call'}</span>
                    <span>{rev.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Subtab 2: Grievances */}
      {activeSubTab === 'grievances' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Creator Safety & Grievance Tickets</h3>
            <button
              onClick={() => setShowGrievanceModal(true)}
              className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Report User Misconduct</span>
            </button>
          </div>

          {creatorGrievances.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-400">
              No safety complaints filed. All creator calls have met safety guidelines.
            </div>
          ) : (
            <div className="space-y-3">
              {creatorGrievances.map(ticket => (
                <div key={ticket.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-purple-300">{ticket.ticketRef}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 uppercase">
                      Status: {ticket.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h4 className="font-bold text-white text-sm">{ticket.subject}</h4>
                  <p className="text-slate-300 leading-relaxed">{ticket.description}</p>

                  <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex justify-between">
                    <span>Filed on: {ticket.createdAt}</span>
                    <span className="capitalize font-semibold text-rose-400">Category: {ticket.category}</span>
                  </div>

                  {ticket.responses.length > 0 && (
                    <div className="mt-2 p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1.5">
                      <span className="text-[10px] font-bold text-brand-300 uppercase block">Admin Action Thread:</span>
                      {ticket.responses.map(r => (
                        <div key={r.id} className="text-[11px] text-slate-300">
                          <strong className="text-white">{r.sender}:</strong> {r.message}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Flag Review Modal */}
      {flaggingReviewId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Report Inappropriate Fan Feedback</h3>
            
            <form onSubmit={handleFlagSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Reason for Flagging</label>
                <textarea
                  value={flagReason}
                  onChange={e => setFlagReason(e.target.value)}
                  placeholder="Explain why this review violates platform terms (e.g. abusive language, spam, harassment)..."
                  rows={3}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md"
                >
                  Submit for Admin Review
                </button>
                <button
                  type="button"
                  onClick={() => setFlaggingReviewId(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Misconduct Modal */}
      {showGrievanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Report Inappropriate User Conduct</h3>

            <form onSubmit={handleGrievanceSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Subject</label>
                <input
                  type="text"
                  value={reportSubject}
                  onChange={e => setReportSubject(e.target.value)}
                  placeholder="e.g. User made non-professional remarks during coaching"
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Details & Context</label>
                <textarea
                  value={reportDesc}
                  onChange={e => setReportDesc(e.target.value)}
                  placeholder="Provide call timestamps, specific remarks, or harassment details..."
                  rows={4}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md"
                >
                  File Complaint
                </button>
                <button
                  type="button"
                  onClick={() => setShowGrievanceModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
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

