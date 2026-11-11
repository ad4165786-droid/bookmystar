import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldAlert, 
  Star, 
  Trash2, 
  CheckCircle2, 
  EyeOff, 
  Eye, 
  AlertTriangle, 
  Image, 
  Video, 
  Flag,
  X
} from 'lucide-react';

export const AdminModeration: React.FC = () => {
  const { 
    reviews, 
    moderateReview, 
    influencers, 
    deleteGalleryItem, 
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'reviews' | 'content'>('reviews');

  // Flagged reviews
  const flaggedReviews = reviews.filter(r => r.isFlagged);

  // All creator media
  const allMedia = influencers.flatMap(inf => 
    inf.gallery.map(g => ({ ...g, creatorName: inf.name, creatorId: inf.id }))
  );

  return (
    <div className="space-y-6 pb-16 max-w-5xl">
      
      {/* Title & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white">Trust, Safety & Content Moderation</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit fan review disputes, inspect creator portfolio uploads, and maintain platform standards
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'reviews'
                ? 'bg-amber-600 text-white shadow-glow'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Review Moderation ({reviews.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'content'
                ? 'bg-slate-700 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
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
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Flagged Review Queue:</strong> {flaggedReviews.length} reviews flagged by creators for policy violations.
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {reviews.map(rev => (
              <div
                key={rev.id}
                className={`p-4 rounded-xl border text-xs space-y-3 ${
                  rev.isFlagged
                    ? 'bg-rose-950/20 border-rose-500/40'
                    : rev.isHidden
                    ? 'bg-slate-950/50 border-slate-800 opacity-60'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img src={rev.userAvatar} alt={rev.userName} className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-700" />
                    <div>
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{rev.userName}</span>
                        <span className="text-slate-500 font-normal">reviewed</span>
                        <span className="text-purple-300">{rev.influencerName}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">Ref: {rev.bookingRef} • {rev.createdAt}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center text-amber-400">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    {rev.isFlagged && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/30 uppercase">
                        Flagged: {rev.flagReason || 'Abusive language'}
                      </span>
                    )}

                    <div className="flex items-center gap-2">
                      {!rev.isHidden ? (
                        <button
                          onClick={() => moderateReview(rev.id, true)}
                          className="px-2.5 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 text-[11px] font-semibold border border-rose-500/30 flex items-center gap-1"
                          title="Hide from public"
                        >
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Hide Review</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => moderateReview(rev.id, false)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-[11px] font-semibold border border-emerald-500/30 flex items-center gap-1"
                          title="Restore review"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve & Restore</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-slate-300 leading-relaxed text-xs">
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
            <div key={item.id} className="rounded-xl overflow-hidden bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div className="relative h-44">
                <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-black/70 text-white uppercase">
                  {item.type}
                </span>
                <span className="absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-purple-950/80 text-purple-200 border border-purple-500/30">
                  {item.creatorName}
                </span>
              </div>

              <div className="p-3.5 space-y-2 text-xs">
                <div>
                  <h4 className="font-bold text-white truncate">{item.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{item.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[11px]">
                  <span className="text-slate-500">{item.uploadedAt}</span>
                  <button
                    onClick={() => {
                      deleteGalleryItem(item.creatorId, item.id);
                      showToast('Media taken down due to policy moderation.');
                    }}
                    className="flex items-center gap-1 text-rose-400 hover:text-rose-300 font-semibold"
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

