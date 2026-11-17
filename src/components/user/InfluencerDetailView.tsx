import React, { useState, useRef } from 'react';
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
  ChevronRight,
  User,
  Sparkles
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

  // Booking date state
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const dateInputRef = useRef<HTMLInputElement>(null);
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
    <div className="space-y-8 pb-6">

      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            setActiveView('explore');
            navigate('/fan/dashboard');
          }}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 hover:text-slate-900 hover:bg-slate-50 shadow-2xs transition-all"
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
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-brand-900/60 text-brand-300 border border-brand-500/30">
                  {influencer.category}
                </span>
                {influencer.secondaryCategory && (
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-navy-900/60 text-navy-300 border border-navy-500/30">
                    {influencer.secondaryCategory}
                  </span>
                )}
                {influencer.locationCity && (
                  <span className="text-xs text-slate-300">
                    • {influencer.locationCity}, {influencer.locationState}
                  </span>
                )}
                {influencer.isVerified && (
                  <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-sky-950/70 text-sky-300 border border-sky-500/30">
                    <CheckCircle2 className="w-3 h-3 text-sky-400" />
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
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-rose-400 hover:border-rose-500/30 transition-colors text-xs font-bold"
                  title="YouTube"
                >
                  YT
                </a>
              )}
              {influencer.socialLinks.instagram && (
                <a
                  href={influencer.socialLinks.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-pink-400 hover:border-pink-500/30 transition-colors text-xs font-bold"
                  title="Instagram"
                >
                  IG
                </a>
              )}
              {influencer.socialLinks.twitter && (
                <a
                  href={influencer.socialLinks.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-sky-400 hover:border-sky-500/30 transition-colors text-xs font-bold"
                  title="X (Twitter)"
                >
                  X
                </a>
              )}
              {influencer.socialLinks.facebook && (
                <a
                  href={influencer.socialLinks.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-blue-400 hover:border-blue-500/30 transition-colors text-xs font-bold"
                  title="Facebook"
                >
                  FB
                </a>
              )}
              {influencer.socialLinks.other && (
                <a
                  href={influencer.socialLinks.other}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-indigo-400 hover:border-indigo-500/30 transition-colors"
                  title="Website / Portfolio"
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
          <section className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-md ring-1 ring-slate-900/5 space-y-4 transition-all hover:shadow-lg">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-200/60 text-brand-600 flex items-center justify-center shrink-0 shadow-2xs">
                <User className="w-4 h-4 text-brand-600 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-wide text-slate-900">
                  About the Creator
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">Background, experience & consultation focus</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {influencer.bio}
            </p>

            {influencer.languages && influencer.languages.length > 0 && (
              <div className="pt-3 flex items-center gap-2 flex-wrap border-t border-slate-100">
                <span className="text-xs text-slate-500 font-semibold">Spoken Languages:</span>
                {influencer.languages.map(l => (
                  <span key={l} className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs">
                    {l}
                  </span>
                ))}
              </div>
            )}
          </section>

          {/* Media Showcase / Content Portfolio */}
          <section className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-md ring-1 ring-slate-900/5 space-y-5 transition-all hover:shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200/60 text-purple-600 flex items-center justify-center shrink-0 shadow-2xs">
                  <Sparkles className="w-4 h-4 text-purple-600 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-wide text-slate-900">
                    Creator Showcase & Portfolio
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">Highlights, past work & video moments</p>
                </div>
              </div>
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                {influencer.gallery.length} Verified Uploads
              </span>
            </div>

            {influencer.gallery.length === 0 ? (
              <div className="text-center py-8 rounded-2xl bg-slate-50 border border-dashed border-slate-200">
                <p className="text-xs text-slate-400 font-medium italic">No media uploaded yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {influencer.gallery.filter(g => g.isVisible).map(item => (
                  <div key={item.id} className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-sm hover:shadow-md transition-all">
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-3.5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                        {item.type === 'video' && (
                          <span className="p-1 rounded-full bg-brand-500 text-white shadow-xs">
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
          <section className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-md ring-1 ring-slate-900/5 space-y-5 transition-all hover:shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-wide text-slate-900">
                    Fan Ratings & Feedback
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-extrabold text-sm shadow-2xs">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{influencer.rating > 0 ? influencer.rating : '5.0'} / 5.0</span>
              </div>
            </div>

            {creatorReviews.length === 0 ? (
              <div className="text-center py-8 rounded-2xl bg-slate-50 border border-dashed border-slate-200">
                <p className="text-xs text-slate-400 font-medium">No reviews yet. Be the first to book a session!</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {creatorReviews.map(rev => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-2 text-xs shadow-2xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img src={rev.userAvatar} alt={rev.userName} className="w-7 h-7 rounded-full object-cover ring-2 ring-white shadow-2xs" />
                        <div>
                          <div className="font-bold text-slate-900">{rev.userName}</div>
                          <div className="text-[10px] text-slate-500">{rev.callType === 'video' ? 'Video Session' : 'Voice Session'} • {rev.createdAt.split(' ')[0]}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>

                    <p className="text-slate-600 leading-relaxed text-xs">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>

        {/* Right Column: Clean Light Booking Console (5 cols) matching Image 2 UI/UX */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 rounded-3xl bg-white border border-slate-200/90 shadow-md ring-1 ring-slate-900/5 p-6 sm:p-7 space-y-5">

            {/* Header: Interactive Booking Console */}
            <div className="pb-4 border-b border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-1 rounded-md border border-brand-200/80 inline-block mb-1.5">
                INTERACTIVE BOOKING CONSOLE
              </span>
              <h3 className="text-xl font-black text-[#0B132B] mt-0.5">
                Select Session & Lock Slot
              </h3>
            </div>

            {/* 1. Select Call Mode */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">1. Select Call Mode</label>
              <div className="grid grid-cols-2 gap-2.5">
                {influencer.videoCallEnabled && (
                  <button
                    type="button"
                    onClick={() => setSelectedCallType('video')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${selectedCallType === 'video'
                        ? 'bg-purple-50/70 border-2 border-purple-500 text-purple-800 shadow-xs ring-1 ring-purple-500/20'
                        : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                  >
                    <Video className="w-4 h-4 text-purple-600" />
                    <span>HD Video Call</span>
                  </button>
                )}

                {influencer.voiceCallEnabled && (
                  <button
                    type="button"
                    onClick={() => setSelectedCallType('voice')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${selectedCallType === 'voice'
                        ? 'bg-emerald-50/70 border-2 border-emerald-500 text-emerald-800 shadow-xs ring-1 ring-emerald-500/20'
                        : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                  >
                    <PhoneCall className="w-4 h-4 text-emerald-600" />
                    <span>Private Voice Call</span>
                  </button>
                )}
              </div>
            </div>

            {/* 2. Choose Session Duration */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">2. Choose Session Duration</label>
              <div className="grid grid-cols-3 gap-2">
                {[10, 15, 30].map(dur => {
                  let priceForDur = 0;
                  if (selectedCallType === 'voice') {
                    priceForDur = dur === 10 ? influencer.rates.voice10 : dur === 15 ? influencer.rates.voice15 : influencer.rates.voice30;
                  } else {
                    priceForDur = dur === 10 ? influencer.rates.video10 : dur === 15 ? influencer.rates.video15 : influencer.rates.video30;
                  }

                  const isSelected = selectedDuration === dur;
                  return (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => setSelectedDuration(dur as any)}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${isSelected
                          ? 'border-2 border-brand-500 bg-brand-50/50 shadow-xs ring-1 ring-brand-500/20'
                          : 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                    >
                      <div className={`text-xs font-bold ${isSelected ? 'text-brand-900' : 'text-slate-800'}`}>
                        {dur} Minutes
                      </div>
                      <div className="text-xs font-black text-brand-600 mt-0.5">
                        ₹{priceForDur}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Select Date & 4. Available Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5 text-xs">3. Select Date</label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={selectedDate}
                  onChange={e => {
                    if (e.target.value) setSelectedDate(e.target.value);
                  }}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:border-brand-500 text-xs cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5 text-xs">4. Available Time Slot</label>
                <select
                  value={selectedSlot}
                  onChange={e => setSelectedSlot(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:border-brand-500 text-xs cursor-pointer"
                >
                  {influencer.availability.timeSlots.map(slot => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dark Navy Session Fee Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0B132B] text-white flex items-center justify-between shadow-md">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                  SESSION FEE
                </span>
                <span className="text-xs text-slate-200 font-medium mt-0.5 block">
                  {selectedDuration} Min {selectedCallType === 'video' ? 'Video' : 'Voice'} Session
                </span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-brand-500 tracking-tight">
                  ₹{currentPrice}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  + GST & platform fee
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              type="button"
              onClick={handleInitiateBooking}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-extrabold text-sm shadow-md shadow-brand-500/25 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <span>Proceed to Payment</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

