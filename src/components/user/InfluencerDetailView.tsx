import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CallType } from '../../types';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Star, 
  Video, 
  PhoneCall, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Share2, 
  Heart, 
  ExternalLink,
  MessageCircle,
  Play,
  Lock,
  ChevronRight
} from 'lucide-react';

export const InfluencerDetailView: React.FC = () => {
  const { 
    selectedInfluencerId, 
    influencers, 
    reviews, 
    setActiveView, 
    navigate,
    openCheckout,
    showToast 
  } = useApp();

  const influencer = influencers.find(i => i.id === selectedInfluencerId) || influencers[0];

  // Booking configuration state
  const [selectedCallType, setSelectedCallType] = useState<CallType>(
    influencer.videoCallEnabled ? 'video' : 'voice'
  );
  const [selectedDuration, setSelectedDuration] = useState<10 | 15 | 30>(10);
  
  // Available dates (Next 5 days)
  const availableDates = [
    { label: 'Today', date: '2026-11-11' },
    { label: 'Tomorrow', date: '2026-11-12' },
    { label: 'Thu, Nov 13', date: '2026-11-13' },
    { label: 'Fri, Nov 14', date: '2026-11-14' },
    { label: 'Sat, Nov 15', date: '2026-11-15' },
  ];
  const [selectedDate, setSelectedDate] = useState(availableDates[1].date);
  const [selectedSlot, setSelectedSlot] = useState(influencer.availability.timeSlots[0] || '06:00 PM');

  // Reviews for this influencer
  const creatorReviews = reviews.filter(r => r.influencerId === influencer.id && !r.isHidden);

  // Price computation based on selected type and duration
  const getPrice = () => {
    if (selectedCallType === 'voice') {
      if (selectedDuration === 10) return influencer.rates.voice10;
      if (selectedDuration === 15) return influencer.rates.voice15;
      return influencer.rates.voice30;
    } else {
      if (selectedDuration === 10) return influencer.rates.video10;
      if (selectedDuration === 15) return influencer.rates.video15;
      return influencer.rates.video30;
    }
  };

  const currentPrice = getPrice();

  const handleInitiateBooking = () => {
    openCheckout({
      influencer,
      callType: selectedCallType,
      duration: selectedDuration,
      scheduledDate: selectedDate,
      scheduledTime: selectedSlot,
      price: currentPrice
    });
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            setActiveView('explore');
            navigate('/fan/dashboard');
          }}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore Creators</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const url = window.location.origin + `/fan/creators/${influencer.id}`;
              navigator.clipboard?.writeText(url);
              showToast('Creator profile link copied to clipboard!');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white hover:bg-slate-800"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Profile</span>
          </button>
        </div>
      </div>

      {/* Hero Cover Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
        <div className="h-48 sm:h-64 w-full relative">
          <img
            src={influencer.coverImage}
            alt={influencer.name}
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </div>

        {/* Profile Details Header */}
        <div className="relative px-6 sm:px-10 pb-8 -mt-20 z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
            <img
              src={influencer.avatar}
              alt={influencer.name}
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover ring-4 ring-[#0b0f19] shadow-2xl bg-slate-800"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-brand-900/60 text-brand-300 border border-brand-500/30">
                  {influencer.category}
                </span>
                {influencer.isVerified && (
                  <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-sky-950/70 text-sky-300 border border-sky-500/30">
                    <CheckCircle2 className="w-3 h-3 text-sky-400" />
                    Verified Star
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white">{influencer.name}</h1>
              <p className="text-xs sm:text-sm text-brand-400 font-semibold">{influencer.handle}</p>
            </div>
          </div>

          {/* Quick Creator Stats & Socials */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1 text-amber-400 font-bold text-sm">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{influencer.rating > 0 ? influencer.rating : '5.0'}</span>
              </div>
              <div className="text-[10px] text-slate-400">{influencer.reviewCount} Fan Reviews</div>
            </div>

            <div className="px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
              <div className="text-white font-bold text-sm">{influencer.completedCallsCount}</div>
              <div className="text-[10px] text-slate-400">1-on-1 Calls Done</div>
            </div>

            {/* Social handles */}
            <div className="flex items-center gap-2">
              {influencer.socialLinks.youtube && (
                <a
                  href={influencer.socialLinks.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-rose-400 hover:border-rose-500/30 transition-colors"
                  title="YouTube"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {influencer.socialLinks.instagram && (
                <a
                  href={influencer.socialLinks.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-pink-400 hover:border-pink-500/30 transition-colors"
                  title="Instagram"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Bio, Gallery, Reviews (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* About Bio Section */}
          <section className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">About the Creator</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {influencer.bio}
            </p>
          </section>

          {/* Media Showcase / Content Portfolio */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                Creator Showcase & Portfolio ({influencer.gallery.length})
              </h3>
              <span className="text-xs text-slate-400">Verified Uploads</span>
            </div>

            {influencer.gallery.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No media uploaded yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {influencer.gallery.filter(g => g.isVisible).map(item => (
                  <div key={item.id} className="group relative rounded-xl overflow-hidden bg-slate-800 border border-slate-700/80 shadow-md">
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3.5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                        {item.type === 'video' && (
                          <span className="p-1 rounded-full bg-brand-500/80 text-white">
                            <Play className="w-3 h-3 fill-white" />
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-300 line-clamp-1 mt-0.5">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Reviews & Ratings Section */}
          <section className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">Fan Ratings & Feedback</h3>
                <p className="text-xs text-slate-400 mt-0.5">Verified attendees after completed sessions</p>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 font-bold text-sm">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{influencer.rating > 0 ? influencer.rating : '5.0'} / 5.0</span>
              </div>
            </div>

            {creatorReviews.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No reviews yet. Be the first to book a session!</p>
            ) : (
              <div className="space-y-3.5">
                {creatorReviews.map(rev => (
                  <div key={rev.id} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/80 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img src={rev.userAvatar} alt={rev.userName} className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-700" />
                        <div>
                          <div className="font-bold text-white">{rev.userName}</div>
                          <div className="text-[10px] text-slate-400">{rev.callType === 'video' ? 'Video Session' : 'Voice Session'} • {rev.createdAt.split(' ')[0]}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>

                    <p className="text-slate-300 leading-relaxed text-xs">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>

        {/* Right Column: Interactive Booking Widget (5 cols) */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 rounded-3xl bg-slate-900 border border-brand-500/30 p-6 sm:p-7 shadow-2xl space-y-6">
            
            <div className="pb-4 border-b border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400">Interactive Booking Console</span>
              <h3 className="text-xl font-black text-white mt-0.5">Select Session & Lock Slot</h3>
              <p className="text-xs text-slate-400 mt-1">Direct 1-on-1 private connection with {influencer.name}</p>
            </div>

            {/* 1. Call Type Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">1. Choose Call Mode</label>
              <div className="grid grid-cols-2 gap-2.5">
                
                {influencer.videoCallEnabled && (
                  <button
                    type="button"
                    onClick={() => setSelectedCallType('video')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                      selectedCallType === 'video'
                        ? 'bg-purple-900/50 border-purple-500 text-white shadow-glow'
                        : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Video className="w-4 h-4 text-purple-400" />
                    <span>1-on-1 Video</span>
                  </button>
                )}

                {influencer.voiceCallEnabled && (
                  <button
                    type="button"
                    onClick={() => setSelectedCallType('voice')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                      selectedCallType === 'voice'
                        ? 'bg-emerald-900/50 border-emerald-500 text-white shadow-glow'
                        : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <PhoneCall className="w-4 h-4 text-emerald-400" />
                    <span>1-on-1 Voice</span>
                  </button>
                )}

              </div>
            </div>

            {/* 2. Duration Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">2. Select Duration</label>
              <div className="grid grid-cols-3 gap-2">
                {[10, 15, 30].map(dur => {
                  let priceForDur = 0;
                  if (selectedCallType === 'voice') {
                    priceForDur = dur === 10 ? influencer.rates.voice10 : dur === 15 ? influencer.rates.voice15 : influencer.rates.voice30;
                  } else {
                    priceForDur = dur === 10 ? influencer.rates.video10 : dur === 15 ? influencer.rates.video15 : influencer.rates.video30;
                  }

                  return (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => setSelectedDuration(dur as any)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        selectedDuration === dur
                          ? 'bg-brand-900/50 border-brand-500 text-white shadow-glow'
                          : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-bold">{dur} mins</div>
                      <div className="text-[11px] text-emerald-400 font-extrabold mt-0.5">₹{priceForDur}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Date Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>3. Select Date</span>
                <span className="text-[10px] text-brand-400 font-medium">IST (Indian Standard Time)</span>
              </label>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {availableDates.map(d => (
                  <button
                    key={d.date}
                    type="button"
                    onClick={() => setSelectedDate(d.date)}
                    className={`whitespace-nowrap px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                      selectedDate === d.date
                        ? 'bg-slate-100 text-slate-900 border-white shadow-md'
                        : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:text-white'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Time Slot Grid */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">4. Select Available Time Slot</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {influencer.availability.timeSlots.map(slot => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-medium transition-all ${
                      selectedSlot === slot
                        ? 'bg-brand-600 border-brand-400 text-white font-bold shadow-md'
                        : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Total & CTA */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-medium">Total Payable (Excl. Tax)</div>
                  <div className="text-2xl font-black text-white">
                    ₹{currentPrice}
                  </div>
                </div>

                <div className="text-right text-[11px] text-slate-400">
                  <div className="text-emerald-400 font-semibold flex items-center gap-1 justify-end">
                    <ShieldCheck className="w-3.5 h-3.5" /> 100% Guaranteed
                  </div>
                  <div>Instant slot confirmation</div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleInitiateBooking}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-brand-600 via-pink-600 to-amber-500 hover:opacity-95 text-white font-extrabold text-sm shadow-glow flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Proceed to Pay ₹{currentPrice}</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-slate-400 text-center">
                Slot is held for 10 minutes upon proceeding to checkout.
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

