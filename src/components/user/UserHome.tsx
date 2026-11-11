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
    <div className="space-y-10 pb-16">
      
      {/* Hero Commercial Showcase Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#18112e] to-[#0f172a] border border-brand-500/20 p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-300 text-xs font-bold tracking-wide uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>India's Premier 1-on-1 Celebrity & Creator Booking Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Talk Directly with Your <span className="bg-gradient-to-r from-brand-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">Favorite Stars</span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Book private voice and video calls with verified esports athletes, chart-topping musicians, industry staff engineers, and lifestyle creators. Powered by real-time slot locking and secured escrow payments in Indian Rupees (₹).
          </p>

          {/* Quick Metrics Bar */}
          <div className="mt-8 grid grid-cols-3 gap-4 border-t border-slate-800/80 pt-6 max-w-lg">
            <div>
              <div className="text-xl sm:text-2xl font-black text-white">100%</div>
              <div className="text-[11px] text-slate-400 font-medium">Govt ID Verified Stars</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-emerald-400">₹199</div>
              <div className="text-[11px] text-slate-400 font-medium">Starting Call Rate</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-brand-400">256-Bit</div>
              <div className="text-[11px] text-slate-400 font-medium">Encrypted Private Calls</div>
            </div>
          </div>
        </div>
      </section>

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
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 shadow-inner"
            />
          </div>

          {/* Secondary Controls (Call Type, Price, Verified) */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            
            {/* Call Type Pill */}
            <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setCallTypeFilter('all')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  callTypeFilter === 'all' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                All Calls
              </button>
              <button
                onClick={() => setCallTypeFilter('video')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all ${
                  callTypeFilter === 'video' ? 'bg-purple-900/60 text-purple-300 font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Video className="w-3 h-3 text-purple-400" /> Video
              </button>
              <button
                onClick={() => setCallTypeFilter('voice')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all ${
                  callTypeFilter === 'voice' ? 'bg-emerald-900/60 text-emerald-300 font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <PhoneCall className="w-3 h-3 text-emerald-400" /> Voice
              </button>
            </div>

            {/* Price Slider Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <span className="text-slate-400">Max:</span>
              <span className="font-bold text-emerald-400">₹{maxPrice}</span>
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
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-glow'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
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
            <h2 className="text-lg font-bold text-white">Available Influencers & Stars</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
              {filteredInfluencers.length} listed
            </span>
          </div>

          <div className="text-xs text-slate-400">
            Real-time availability updated
          </div>
        </div>

        {filteredInfluencers.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
            <Sparkles className="w-8 h-8 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No Creators Match Your Filters</h3>
            <p className="text-xs text-slate-400">Try adjusting your price range or category selector.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setCallTypeFilter('all');
                setMaxPrice(2000);
                setSearchQuery('');
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700"
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
                  className="group relative rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-brand-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow flex flex-col overflow-hidden"
                >
                  {/* Cover Header */}
                  <div className="relative h-28 w-full overflow-hidden bg-slate-800">
                    <img
                      src={inf.coverImage}
                      alt={inf.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/30" />
                    
                    {/* Category Tag */}
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-brand-300 border border-brand-500/20">
                        {inf.category}
                      </span>
                    </div>

                    {/* Star Rating Badge */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[11px] font-bold text-amber-300 border border-amber-500/20">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span>{inf.rating > 0 ? inf.rating : 'New'}</span>
                      {inf.reviewCount > 0 && (
                        <span className="text-[9px] text-slate-400">({inf.reviewCount})</span>
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
                        className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-900 shadow-xl bg-slate-800 shrink-0"
                      />
                      <div className="pt-4 flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-bold text-white truncate">{inf.name}</h3>
                          {inf.isVerified && (
                            <span title="Government ID Verified">
                              <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-brand-400 font-medium truncate">{inf.handle}</p>
                      </div>
                    </div>

                    {/* Bio Snippet */}
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {inf.bio}
                    </p>

                    {/* Available Call Tiers Preview */}
                    <div className="flex items-center gap-2 pt-1 text-[11px]">
                      {inf.videoCallEnabled && (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-purple-950/60 text-purple-300 border border-purple-800/40 font-medium">
                          <Video className="w-3 h-3 text-purple-400" />
                          <span>Video from ₹{inf.rates.video10}</span>
                        </div>
                      )}
                      {inf.voiceCallEnabled && (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 font-medium">
                          <PhoneCall className="w-3 h-3 text-emerald-400" />
                          <span>Voice from ₹{inf.rates.voice10}</span>
                        </div>
                      )}
                    </div>

                    {/* Footer Row: Starting Rate & Book CTA */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Starting from</div>
                        <div className="text-base font-extrabold text-white">
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
                        className="flex items-center gap-1.5 py-2 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold text-xs shadow-md group-hover:shadow-glow transition-all"
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
      <section className="rounded-2xl bg-slate-900/40 border border-slate-800 p-6 sm:p-8">
        <h3 className="text-center text-sm font-bold uppercase tracking-wider text-slate-400 mb-6">
          Why Fans & Creators Trust BookMyStar
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-white">100% Money-Back Escrow</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Funds are held securely by the server and disbursed to creators only after successful call completion.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-white">Anti-Collision Slot Locking</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              When booking begins, time slots are automatically locked across users to strictly prevent double-booking.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-white">Strict Participant Privacy</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Live rooms are authenticated with private single-use tokens. Administrators cannot listen or record calls.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
