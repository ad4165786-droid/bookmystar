import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Category, CallType } from '../../types';
import { 
  Search, 
  Sparkles, 
  Star, 
  CheckCircle2, 
  Video, 
  PhoneCall, 
  ShieldCheck, 
  SlidersHorizontal, 
  ArrowRight,
  TrendingUp,
  Zap,
  Clock,
  Heart,
  Lock
} from 'lucide-react';

const CATEGORIES: ('All' | Category)[] = [
  'All',
  'Gaming',
  'Music',
  'Tech & Coding',
  'Fashion & Beauty',
  'Fitness & Health',
  'Comedy & Entertainment'
];

export const UserHome: React.FC = () => {
  const { influencers, setSelectedInfluencerId, setActiveView, navigate, settings } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | Category>('All');
  const [callTypeFilter, setCallTypeFilter] = useState<'all' | CallType>('all');
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [onlyVerified, setOnlyVerified] = useState(true);

  // Filter influencers
  const filteredInfluencers = useMemo(() => {
    return influencers.filter(inf => {
      // Must be approved if platform rule enforces verification for paid bookings
      if (settings.requireVerificationForBooking && inf.verificationStatus !== 'approved') {
        return false;
      }

      if (onlyVerified && !inf.isVerified) return false;

      // Category check
      if (selectedCategory !== 'All' && inf.category !== selectedCategory) return false;

      // Call type filter
      if (callTypeFilter === 'voice' && !inf.voiceCallEnabled) return false;
      if (callTypeFilter === 'video' && !inf.videoCallEnabled) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = inf.name.toLowerCase().includes(q);
        const matchesBio = inf.bio.toLowerCase().includes(q);
        const matchesHandle = inf.handle.toLowerCase().includes(q);
        const matchesCat = inf.category.toLowerCase().includes(q);
        if (!matchesName && !matchesBio && !matchesHandle && !matchesCat) return false;
      }

      // Starting price filter
      const lowestVoice = inf.voiceCallEnabled ? inf.rates.voice10 : 99999;
      const lowestVideo = inf.videoCallEnabled ? inf.rates.video10 : 99999;
      const startingPrice = Math.min(lowestVoice, lowestVideo);
      if (startingPrice > maxPrice) return false;

      return true;
    });
  }, [influencers, selectedCategory, callTypeFilter, searchQuery, maxPrice, onlyVerified, settings]);

  return (
    <div className="space-y-8 pb-6 font-sans">

      {/* Discovery Filters & Search */}
      <section className="space-y-4">
        
        {/* Search Bar + Controls */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search creator by name, game, music, skills..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-500 shadow-2xs transition-all"
            />
          </div>

          {/* Secondary Controls (Call Type, Price, Verified) */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            
            {/* Call Type Pill */}
            <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 text-xs shadow-2xs">
              <button
                onClick={() => setCallTypeFilter('all')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  callTypeFilter === 'all'
                    ? 'bg-slate-100 text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                All Calls
              </button>
              <button
                onClick={() => setCallTypeFilter('video')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  callTypeFilter === 'video'
                    ? 'bg-purple-50 text-purple-700 shadow-2xs border border-purple-200'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Video className="w-3 h-3 text-purple-600" /> Video
              </button>
              <button
                onClick={() => setCallTypeFilter('voice')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  callTypeFilter === 'voice'
                    ? 'bg-emerald-50 text-emerald-700 shadow-2xs border border-emerald-200'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <PhoneCall className="w-3 h-3 text-emerald-600" /> Voice
              </button>
            </div>

            {/* Price Slider Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 shadow-2xs">
              <span className="text-slate-400 font-medium">Max:</span>
              <span className="font-extrabold text-emerald-600">₹{maxPrice}</span>
              <input
                type="range"
                min="200"
                max="2000"
                step="100"
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                className="w-20 accent-brand-500 cursor-pointer"
              />
            </div>

          </div>

        </div>

        {/* Category Horizontal Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-md shadow-brand-500/25'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200/90 shadow-2xs'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </section>

      {/* Influencer Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Available Influencers & Stars</h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {filteredInfluencers.length} listed
            </span>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Real-time availability updated
          </div>
        </div>

        {filteredInfluencers.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
            <Sparkles className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-base font-extrabold text-slate-900">No Creators Match Your Filters</h3>
            <p className="text-xs text-slate-500">Try adjusting your price range or category selector.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setCallTypeFilter('all');
                setMaxPrice(2000);
                setSearchQuery('');
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInfluencers.map(inf => {
              const lowestPrice = Math.min(
                inf.voiceCallEnabled ? inf.rates.voice10 : 99999,
                inf.videoCallEnabled ? inf.rates.video10 : 99999
              );

              return (
                <div
                  key={inf.id}
                  className="group relative rounded-3xl bg-white border border-slate-200/90 hover:border-brand-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg shadow-sm flex flex-col overflow-hidden text-slate-900"
                >
                  {/* Cover Header */}
                  <div className="relative h-28 w-full overflow-hidden bg-slate-100">
                    <img
                      src={inf.coverImage}
                      alt={inf.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
                    
                    {/* Category Tag */}
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-brand-700 border border-white/60 shadow-2xs">
                        {inf.category}
                      </span>
                    </div>

                    {/* Star Rating Badge */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-[11px] font-black text-slate-900 border border-white/60 shadow-2xs">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span>{inf.rating > 0 ? inf.rating : 'New'}</span>
                      {inf.reviewCount > 0 && (
                        <span className="text-[9px] text-slate-500 font-normal">({inf.reviewCount})</span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    
                    {/* Avatar & Title Row */}
                    <div className="flex items-start gap-3.5 -mt-10 relative z-10">
                      <img
                        src={inf.avatar}
                        alt={inf.name}
                        className="w-16 h-16 rounded-2xl object-cover ring-3 ring-white shadow-md bg-white shrink-0"
                      />
                      <div className="pt-4 flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-extrabold text-slate-900 truncate">{inf.name}</h3>
                          {inf.isVerified && (
                            <span title="Government ID Verified">
                              <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-brand-600 font-bold truncate">{inf.handle}</p>
                      </div>
                    </div>

                    {/* Bio Snippet */}
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {inf.bio}
                    </p>

                    {/* Available Call Tiers Preview */}
                    <div className="flex items-center gap-2 pt-1 text-[11px]">
                      {inf.videoCallEnabled && (
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200/80 font-bold">
                          <Video className="w-3 h-3 text-purple-600" />
                          <span>Video from ₹{inf.rates.video10}</span>
                        </div>
                      )}
                      {inf.voiceCallEnabled && (
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-bold">
                          <PhoneCall className="w-3 h-3 text-emerald-600" />
                          <span>Voice from ₹{inf.rates.voice10}</span>
                        </div>
                      )}
                    </div>

                    {/* Footer Row: Starting Rate & Book CTA */}
                    <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Starting from</div>
                        <div className="text-base font-black text-slate-900">
                          ₹{lowestPrice}
                          <span className="text-[10px] text-slate-400 font-normal"> / 10 min</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedInfluencerId(inf.id);
                          setActiveView('influencer-detail');
                          navigate(`/fan/creators/${inf.id}`);
                        }}
                        className="flex items-center gap-1.5 py-2 px-4 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-extrabold text-xs shadow-md shadow-brand-500/25 transition-all cursor-pointer"
                      >
                        <span>View Profile & Book</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </section>

      {/* Trust & Guarantee Commercial Footer Section */}
      <section className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-sm">
        <h3 className="text-center text-xs font-black uppercase tracking-wider text-slate-400 mb-6">
          Why Fans & Creators Trust BookMyStar
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 border border-brand-200/80 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-5 h-5 text-brand-600" />
            </div>
            <h4 className="text-xs font-extrabold text-slate-900">100% Money-Back Escrow</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Funds are held securely by the server and disbursed to creators only after successful call completion.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/80 flex items-center justify-center mx-auto">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <h4 className="text-xs font-extrabold text-slate-900">Anti-Collision Slot Locking</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              When booking begins, time slots are automatically locked across users to strictly prevent double-booking.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/80 flex items-center justify-center mx-auto">
              <Lock className="w-5 h-5 text-emerald-600" />
            </div>
            <h4 className="text-xs font-extrabold text-slate-900">Strict Participant Privacy</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Live rooms are authenticated with private single-use tokens. Administrators cannot listen or record calls.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
