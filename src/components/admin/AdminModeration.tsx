import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  Star,
  Trash2,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  Image,
  Video,
  ExternalLink,
  MessageSquare,
  Ban
} from 'lucide-react';

export const AdminModeration: React.FC = () => {
  const { reviews, influencers, moderateReview, deleteGalleryItem, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'reviews' | 'content'>('reviews');

  const flaggedReviews = reviews.filter(r => r.isFlagged);

  // Flatten media items from all creators
  const allMedia = influencers.flatMap(inf =>
    inf.gallery.map(g => ({
      ...g,
      creatorId: inf.id,
      creatorName: inf.name,
      creatorAvatar: inf.avatar
    }))
  );

  return (
    <div className="space-y-6 pb-16 max-w-5xl">

      {/* Title & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Trust, Safety & Content Moderation</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${activeTab === 'reviews'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-slate-200/90 shadow-sm'
              }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Review Moderation ({reviews.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${activeTab === 'content'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-slate-200/90 shadow-sm'
              }`}
          >
            <Image className="w-3.5 h-3.5" />
            <span>Media Showcase Moderation ({allMedia.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Reviews Moderation */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Flagged Review Queue:</strong> {flaggedReviews.length} reviews flagged by creators for policy violations.
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {reviews.map(rev => (
              <div
                key={rev.id}
                className={`p-5 rounded-2xl border text-xs space-y-3 transition-shadow ${rev.isFlagged
                    ? 'bg-white border-rose-300 shadow-sm hover:shadow-md ring-1 ring-rose-500/10'
                    : rev.isHidden
                      ? 'bg-slate-50/80 border-slate-200 opacity-75'
                      : 'bg-white border-slate-200/90 shadow-sm hover:shadow-md ring-1 ring-slate-900/5'
                  }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <img src={rev.userAvatar} alt={rev.userName} className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200" />
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span>{rev.userName}</span>
                        <span className="text-slate-400 font-normal">reviewed</span>
                        <span className="text-purple-600">{rev.influencerName}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">Ref: {rev.bookingRef} • {rev.createdAt}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center text-amber-400">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    {rev.isFlagged && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 uppercase">
                        Flagged: {rev.flagReason || 'Abusive language'}
                      </span>
                    )}

                    <div className="flex items-center gap-2">
                      {!rev.isHidden ? (
                        <button
                          onClick={() => moderateReview(rev.id, true)}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-semibold border border-rose-200 flex items-center gap-1 transition-colors"
                          title="Hide from public"
                        >
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Hide Review</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => moderateReview(rev.id, false)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-semibold border border-emerald-200 flex items-center gap-1 transition-colors"
                          title="Restore review"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve & Restore</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-slate-700 leading-relaxed text-xs italic">
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Content Showcase Moderation */}
      {activeTab === 'content' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allMedia.map(item => (
            <div key={item.id} className="rounded-2xl overflow-hidden bg-white border border-slate-200/90 shadow-sm hover:shadow-md ring-1 ring-slate-900/5 flex flex-col justify-between transition-shadow">
              <div className="relative h-44">
                <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-black/70 text-white uppercase backdrop-blur-sm">
                  {item.type}
                </span>
                <span className="absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-white/90 text-purple-900 border border-purple-200 shadow-sm backdrop-blur-sm">
                  {item.creatorName}
                </span>
              </div>

              <div className="p-4 space-y-2 text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 truncate">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{item.description}</p>
                </div>

                <div className="pt-2 flex justify-between items-center text-[11px]">
                  <span className="text-slate-500">{item.uploadedAt}</span>
                  <button
                    onClick={() => {
                      deleteGalleryItem(item.creatorId, item.id);
                      showToast('Media taken down due to policy moderation.');
                    }}
                    className="flex items-center gap-1 text-rose-600 hover:text-rose-700 font-semibold transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Takedown Media</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
