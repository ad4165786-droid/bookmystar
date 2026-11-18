import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { GrievanceTicket } from '../../types';
import {
  Star,
  Flag,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Plus,
  Send,
  X,
  Search,
  MessageSquare,
  Calendar,
  Video,
  Phone,
  ShieldCheck,
  Award,
  TrendingUp,
  UserCheck
} from 'lucide-react';

interface InfluencerReviewsGrievancesProps {
  initialTab?: 'reviews' | 'grievances';
}

export const InfluencerReviewsGrievances: React.FC<InfluencerReviewsGrievancesProps> = ({
  initialTab = 'reviews'
}) => {
  const {
    currentInfluencer,
    reviews,
    grievances,
    flagReview,
    submitGrievance,
    replyToGrievance,
    showToast
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'reviews' | 'grievances'>(initialTab);

  // Review Filters
  const [reviewSearch, setReviewSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState<'all' | '5' | '4' | '3' | 'flagged'>('all');

  // Grievance Filters
  const [grievanceStatusFilter, setGrievanceStatusFilter] = useState<'all' | 'open' | 'in_progress' | 'resolved' | 'closed'>('all');

  // Modals & Forms
  const [showGrievanceModal, setShowGrievanceModal] = useState(false);
  const [reportSubject, setReportSubject] = useState('');
  const [reportDesc, setReportDesc] = useState('');
  const [reportCategory, setReportCategory] = useState<GrievanceTicket['category']>('behaviour');
  const [customCategory, setCustomCategory] = useState('');

  // Flag review modal
  const [flaggingReviewId, setFlaggingReviewId] = useState<string | null>(null);
  const [flagReason, setFlagReason] = useState('');

  // Inline reply to grievance ticket
  const [activeReplyingTicketId, setActiveReplyingTicketId] = useState<string | null>(null);
  const [ticketReplyText, setTicketReplyText] = useState('');

  // ESC key and body scroll lock for modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (flaggingReviewId) setFlaggingReviewId(null);
        if (showGrievanceModal) setShowGrievanceModal(false);
      }
    };
    if (flaggingReviewId || showGrievanceModal) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [flaggingReviewId, showGrievanceModal]);

  // Reviews for this creator
  const creatorReviews = reviews.filter(r => r.influencerId === currentInfluencer.id);

  // Grievances involving this creator
  const creatorGrievances = grievances.filter(
    g => g.submitterId === currentInfluencer.id || g.targetId === currentInfluencer.id
  );

  // Filtered reviews
  const filteredReviews = creatorReviews.filter(rev => {
    if (ratingFilter === 'flagged' && !rev.isFlagged) return false;
    if (ratingFilter === '5' && rev.rating !== 5) return false;
    if (ratingFilter === '4' && rev.rating !== 4) return false;
    if (ratingFilter === '3' && rev.rating > 3) return false;

    if (reviewSearch.trim()) {
      const q = reviewSearch.toLowerCase();
      const matchName = rev.userName.toLowerCase().includes(q);
      const matchComment = rev.comment.toLowerCase().includes(q);
      const matchRef = rev.bookingRef.toLowerCase().includes(q);
      if (!matchName && !matchComment && !matchRef) return false;
    }
    return true;
  });

  // Filtered grievances
  const filteredGrievances = creatorGrievances.filter(g => {
    if (grievanceStatusFilter !== 'all' && g.status !== grievanceStatusFilter) return false;
    return true;
  });

  // Calculated metrics
  const totalReviewsCount = creatorReviews.length;
  const avgRating = totalReviewsCount > 0
    ? (creatorReviews.reduce((acc, r) => acc + r.rating, 0) / totalReviewsCount).toFixed(2)
    : (currentInfluencer.rating > 0 ? currentInfluencer.rating.toFixed(2) : '5.00');

  const fiveStarCount = creatorReviews.filter(r => r.rating === 5).length;
  const fiveStarPercentage = totalReviewsCount > 0
    ? Math.round((fiveStarCount / totalReviewsCount) * 100)
    : 100;

  const openGrievancesCount = creatorGrievances.filter(g => g.status === 'open' || g.status === 'in_progress').length;

  const handleFlagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flaggingReviewId || !flagReason.trim()) return;

    flagReview(flaggingReviewId, flagReason.trim());
    showToast('Review reported for platform admin moderation review.');
    setFlaggingReviewId(null);
    setFlagReason('');
  };

  const handleGrievanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportSubject.trim() || !reportDesc.trim()) return;
    if (reportCategory === 'other' && !customCategory.trim()) return;

    submitGrievance({
      raisedBy: 'influencer',
      submitterId: currentInfluencer.id,
      submitterName: currentInfluencer.name,
      submitterRole: 'influencer',
      category: reportCategory === 'other' ? (customCategory.trim() || 'other') : reportCategory,
      customCategory: reportCategory === 'other' ? customCategory.trim() : undefined,
      priority: 'high',
      subject: reportSubject.trim(),
      description: reportDesc.trim()
    });

    setReportSubject('');
    setReportDesc('');
    setCustomCategory('');
    setReportCategory('behaviour');
    setShowGrievanceModal(false);
  };

  const handleSendTicketReply = (ticketId: string) => {
    if (!ticketReplyText.trim()) return;
    replyToGrievance(ticketId, ticketReplyText.trim());
    setTicketReplyText('');
    setActiveReplyingTicketId(null);
    showToast('Response submitted to Trust & Safety case thread.');
  };

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto font-sans animate-fadeIn">

      {/* 1. Header & Segmented Subtab Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 shadow-2xs">
              <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Reviews & Grievances
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Monitor verified client ratings, review sentiment, and manage platform safety & dispute cases.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Controls & Direct Report Trigger */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="p-1 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveSubTab('reviews')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'reviews'
                  ? 'bg-brand-50 text-brand-700 border border-brand-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>Fan Reviews</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                activeSubTab === 'reviews' ? 'bg-brand-100 text-brand-800' : 'bg-slate-100 text-slate-600'
              }`}>
                {creatorReviews.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('grievances')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'grievances'
                  ? 'bg-rose-50 text-rose-700 border border-rose-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>Safety Grievances</span>
              {openGrievancesCount > 0 ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500 text-white font-extrabold animate-pulse">
                  {openGrievancesCount}
                </span>
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
                  {creatorGrievances.length}
                </span>
              )}
            </button>
          </div>

          {activeSubTab === 'grievances' && (
            <button
              type="button"
              onClick={() => setShowGrievanceModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>File Safety Report</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Executive Metrics KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Average Rating */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-md ring-1 ring-slate-900/5 space-y-2 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Overall Rating</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-3xl font-black text-slate-900 tracking-tight">{avgRating}</span>
            <span className="text-xs font-bold text-slate-400">/ 5.0</span>
          </div>
          <div className="flex items-center gap-1 text-amber-400">
            {[1, 2, 3, 4, 5].map(s => (
              <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ))}
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 ml-1.5">
              Top 2% Creator
            </span>
          </div>
        </div>

        {/* Metric 2: Total Reviews */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-md ring-1 ring-slate-900/5 space-y-2 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Verified Reviews</span>
            <div className="p-2 rounded-xl bg-brand-50 text-brand-600 border border-brand-200/60">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-3xl font-black text-slate-900 tracking-tight">{totalReviewsCount}</span>
            <span className="text-xs font-bold text-slate-400">Feedback Posts</span>
          </div>
          <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>100% verified post-call bookings</span>
          </p>
        </div>

        {/* Metric 3: Positive Sentiment */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-md ring-1 ring-slate-900/5 space-y-2 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>5-Star Sentiment</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-3xl font-black text-emerald-600 tracking-tight">{fiveStarPercentage}%</span>
            <span className="text-xs font-bold text-slate-400">Excellent</span>
          </div>
          <p className="text-[11px] font-medium text-slate-500">
            {fiveStarCount} out of {totalReviewsCount} fans awarded full 5 stars
          </p>
        </div>

        {/* Metric 4: Trust & Safety Standing */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-md ring-1 ring-slate-900/5 space-y-2 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Safety Standing</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200/60">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {openGrievancesCount === 0 ? '100% Clear' : `${openGrievancesCount} Under Review`}
            </span>
          </div>
          <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Escrow-guaranteed policy compliance</span>
          </p>
        </div>
      </div>

      {/* 3. TAB 1: FAN REVIEWS */}
      {activeSubTab === 'reviews' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Search, Filter & Sort Controls */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-md ring-1 ring-slate-900/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Box */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={reviewSearch}
                onChange={e => setReviewSearch(e.target.value)}
                placeholder="Search reviews by fan name, comment or booking ref..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:bg-white transition-all"
              />
              {reviewSearch && (
                <button
                  type="button"
                  onClick={() => setReviewSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => setRatingFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  ratingFilter === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                All ({creatorReviews.length})
              </button>

              <button
                type="button"
                onClick={() => setRatingFilter('5')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  ratingFilter === '5'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>5 Stars ({creatorReviews.filter(r => r.rating === 5).length})</span>
              </button>

              <button
                type="button"
                onClick={() => setRatingFilter('4')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  ratingFilter === '4'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>4 Stars ({creatorReviews.filter(r => r.rating === 4).length})</span>
              </button>

              <button
                type="button"
                onClick={() => setRatingFilter('3')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  ratingFilter === '3'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                <span>3★ & Below ({creatorReviews.filter(r => r.rating <= 3).length})</span>
              </button>

              {creatorReviews.some(r => r.isFlagged) && (
                <button
                  type="button"
                  onClick={() => setRatingFilter('flagged')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    ratingFilter === 'flagged'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                  }`}
                >
                  <Flag className="w-3 h-3" />
                  <span>Reported ({creatorReviews.filter(r => r.isFlagged).length})</span>
                </button>
              )}
            </div>
          </div>

          {/* Review Cards Grid */}
          {filteredReviews.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white border border-slate-200/90 shadow-md ring-1 ring-slate-900/5 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No reviews found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {reviewSearch || ratingFilter !== 'all'
                  ? 'No reviews match your active filter criteria. Try clearing search keywords or filters.'
                  : 'You have not received any fan reviews yet. Completed calls will automatically generate feedback invitations.'}
              </p>
              {(reviewSearch || ratingFilter !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setReviewSearch('');
                    setRatingFilter('all');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredReviews.map(rev => (
                <div
                  key={rev.id}
                  className={`rounded-3xl p-6 transition-all duration-200 border flex flex-col justify-between ${
                    rev.isFlagged
                      ? 'bg-rose-50/30 border-rose-200 shadow-sm'
                      : 'bg-white border-slate-200/90 shadow-md ring-1 ring-slate-900/5 hover:shadow-lg hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Review Header: User Info & Star Rating */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={rev.userAvatar}
                          alt={rev.userName}
                          className="w-10 h-10 rounded-2xl object-cover ring-2 ring-slate-100 shadow-2xs"
                          onError={e => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-sm text-slate-900">{rev.userName}</h4>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200/80 font-mono">
                              {rev.bookingRef}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                            <span className="flex items-center gap-1">
                              {rev.callType === 'video' ? (
                                <Video className="w-3 h-3 text-blue-500" />
                              ) : (
                                <Phone className="w-3 h-3 text-emerald-500" />
                              )}
                              <span className="capitalize">{rev.callType} Call</span>
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              <span>{rev.createdAt}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Star Rating Badge */}
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200/70 shrink-0 shadow-2xs">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        <span className="font-black text-xs text-amber-900">{rev.rating}.0</span>
                      </div>
                    </div>

                    {/* Review Comment Body */}
                    <div className="relative pl-3 border-l-2 border-brand-200">
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                        "{rev.comment}"
                      </p>
                    </div>
                  </div>

                  {/* Review Footer & Moderation Action */}
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Verified Client Booking</span>
                    </div>

                    <div>
                      {rev.isFlagged ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 text-[10px] font-bold border border-rose-200">
                          <AlertCircle className="w-3 h-3 text-rose-600" />
                          <span>Under Admin Review</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setFlaggingReviewId(rev.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Report defamatory, abusive or fraudulent review"
                        >
                          <Flag className="w-3 h-3" />
                          <span>Report Issue</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. TAB 2: SAFETY GRIEVANCES & TICKETS */}
      {activeSubTab === 'grievances' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Status Filter Bar */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-md ring-1 ring-slate-900/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status Filter:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {(['all', 'open', 'in_progress', 'resolved'] as const).map(status => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setGrievanceStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                      grievanceStatusFilter === status
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {status === 'all' ? 'All Tickets' : status.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs font-medium text-slate-500">
              Showing <span className="font-bold text-slate-900">{filteredGrievances.length}</span> safety reports
            </div>
          </div>

          {/* Grievances List */}
          {filteredGrievances.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white border border-slate-200/90 shadow-md ring-1 ring-slate-900/5 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No Safety Grievances</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No active complaints filed by or against your account. All scheduled sessions have adhered to community safety and conduct rules.
              </p>
              <button
                type="button"
                onClick={() => setShowGrievanceModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>File a Safety Complaint</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredGrievances.map(ticket => {
                const isOpen = ticket.status === 'open';
                const isInProgress = ticket.status === 'in_progress';

                return (
                  <div
                    key={ticket.id}
                    className="rounded-3xl bg-white border border-slate-200/90 shadow-md ring-1 ring-slate-900/5 p-6 space-y-4 hover:shadow-lg transition-all"
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-lg bg-brand-50 text-brand-700 border border-brand-200">
                          {ticket.ticketRef}
                        </span>
                        <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          isOpen
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : isInProgress
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}>
                          {ticket.status.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase border border-slate-200">
                          {ticket.priority} Priority
                        </span>
                        <span className="text-xs font-semibold text-slate-500 capitalize bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/70">
                          Category: {ticket.customCategory || ticket.category}
                        </span>
                      </div>

                      <div className="text-[11px] font-medium text-slate-400">
                        Filed: {ticket.createdAt}
                      </div>
                    </div>

                    {/* Subject & Description */}
                    <div className="space-y-1.5">
                      <h3 className="font-bold text-base text-slate-900">{ticket.subject}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{ticket.description}</p>
                    </div>

                    {/* Submitter & Involved Parties */}
                    <div className="flex items-center gap-4 text-[11px] text-slate-500 bg-slate-50 p-3 rounded-2xl border border-slate-200/70 flex-wrap">
                      <span>
                        Filed By: <strong className="text-slate-800">{ticket.submitterName}</strong> ({ticket.submitterRole})
                      </span>
                      {ticket.targetName && (
                        <>
                          <span>•</span>
                          <span>
                            Target User: <strong className="text-slate-800">{ticket.targetName}</strong>
                          </span>
                        </>
                      )}
                      {ticket.bookingRef && (
                        <>
                          <span>•</span>
                          <span>
                            Booking: <strong className="font-mono text-slate-800">{ticket.bookingRef}</strong>
                          </span>
                        </>
                      )}
                    </div>

                    {/* Admin Response Thread */}
                    {ticket.responses.length > 0 && (
                      <div className="space-y-2 pt-2">
                        <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-brand-600" />
                          <span>Trust & Safety Resolution Thread ({ticket.responses.length})</span>
                        </span>

                        <div className="space-y-2.5">
                          {ticket.responses.map(resp => {
                            const isAdmin = resp.role === 'admin';
                            return (
                              <div
                                key={resp.id}
                                className={`p-3.5 rounded-2xl text-xs leading-relaxed border ${
                                  isAdmin
                                    ? 'bg-brand-50/60 border-brand-200 text-slate-900 ml-4'
                                    : 'bg-white border-slate-200 text-slate-800 mr-4 shadow-2xs'
                                }`}
                              >
                                <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-200/60 text-[10px]">
                                  <span className={`font-bold ${isAdmin ? 'text-brand-700' : 'text-slate-700'}`}>
                                    {resp.sender} {isAdmin && '(BMS Compliance Officer)'}
                                  </span>
                                  <span className="text-slate-400">{resp.timestamp}</span>
                                </div>
                                <p className="text-slate-700">{resp.message}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Quick Creator Reply Trigger */}
                    {ticket.status !== 'resolved' && ticket.status !== 'closed' && (
                      <div className="pt-2">
                        {activeReplyingTicketId === ticket.id ? (
                          <div className="space-y-2 pt-2">
                            <textarea
                              rows={3}
                              value={ticketReplyText}
                              onChange={e => setTicketReplyText(e.target.value)}
                              placeholder="Type your response to the platform safety team..."
                              className="w-full p-3 rounded-2xl bg-white border border-brand-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 shadow-xs"
                              autoFocus
                            />
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleSendTicketReply(ticket.id)}
                                className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer"
                              >
                                <Send className="w-3.5 h-3.5" />
                                <span>Send to Support</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveReplyingTicketId(null);
                                  setTicketReplyText('');
                                }}
                                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setActiveReplyingTicketId(ticket.id)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Add note or response to this case</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 5. MODAL: Flag / Report Inappropriate Review */}
      {flaggingReviewId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
          onClick={e => {
            if (e.target === e.currentTarget) setFlaggingReviewId(null);
          }}
        >
          <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-rose-600">
                <Flag className="w-5 h-5" />
                <h3 className="text-base font-extrabold text-slate-900">Report Inappropriate Review</h3>
              </div>
              <button
                type="button"
                onClick={() => setFlaggingReviewId(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Reviews can be flagged if they contain defamatory statements, abusive language, private personal details, or fraudulent claims unrelated to the coaching session.
            </p>

            <form onSubmit={handleFlagSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Reason for Flagging <span className="text-rose-500">*</span></label>
                <textarea
                  value={flagReason}
                  onChange={e => setFlagReason(e.target.value)}
                  placeholder="Provide specific details regarding why this review breaches BookMyStar community standards..."
                  rows={4}
                  className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:bg-white shadow-xs"
                  required
                  autoFocus
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all cursor-pointer"
                >
                  Submit for Compliance Review
                </button>
                <button
                  type="button"
                  onClick={() => setFlaggingReviewId(null)}
                  className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. MODAL: Report Misconduct / Grievance */}
      {showGrievanceModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
          onClick={e => {
            if (e.target === e.currentTarget) setShowGrievanceModal(false);
          }}
        >
          <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-rose-600">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="text-base font-extrabold text-slate-900">File Trust & Safety Report</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGrievanceModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGrievanceSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Incident Category <span className="text-rose-500">*</span></label>
                <div className="space-y-2">
                  <select
                    value={reportCategory}
                    onChange={e => {
                      const val = e.target.value as any;
                      setReportCategory(val);
                      if (val !== 'other') setCustomCategory('');
                    }}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-brand-500"
                  >
                    <option value="behaviour">Inappropriate User Conduct / Boundary Violation</option>
                    <option value="call">Call Disconnect / Malicious Interruption</option>
                    <option value="payment">Dispute / Chargeback Inquiry</option>
                    <option value="account">Safety / Harassment Threat</option>
                    <option value="other">Other (Specify below)</option>
                  </select>

                  {reportCategory === 'other' && (
                    <div className="animate-fadeIn">
                      <input
                        type="text"
                        value={customCategory}
                        onChange={e => setCustomCategory(e.target.value)}
                        placeholder="Please specify custom incident category..."
                        className="w-full p-2.5 rounded-xl bg-white border border-brand-500 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 shadow-xs"
                        required
                        autoFocus
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Subject Summary <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  value={reportSubject}
                  onChange={e => setReportSubject(e.target.value)}
                  placeholder="e.g. Participant made personal queries outside session scope"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Detailed Description & Evidence <span className="text-rose-500">*</span></label>
                <textarea
                  value={reportDesc}
                  onChange={e => setReportDesc(e.target.value)}
                  placeholder="Provide call timestamps, specific remarks, chat logs, or context..."
                  rows={4}
                  className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all cursor-pointer"
                >
                  File Complaint
                </button>
                <button
                  type="button"
                  onClick={() => setShowGrievanceModal(false)}
                  className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
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
