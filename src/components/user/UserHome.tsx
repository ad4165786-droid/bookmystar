import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Category, CallType, InfluencerProfile } from '../../types';
import {
  Search,
  Sparkles,
  Star,
  CheckCircle2,
  Video,
  PhoneCall,
  SlidersHorizontal,
  ArrowRight,
  Calendar,
  Clock,
  Play,
  Image as ImageIcon,
  ExternalLink,
  X,
  CreditCard,
  ShieldCheck,
  ChevronRight
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
  const { influencers, setSelectedInfluencerId, setActiveView, navigate, settings, openCheckout } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | Category>('All');
  const [callTypeFilter, setCallTypeFilter] = useState<'all' | CallType>('all');
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [onlyVerified, setOnlyVerified] = useState(false);

  // Quick Booking Modal State
  const [bookingInfluencer, setBookingInfluencer] = useState<InfluencerProfile | null>(null);
  const [modalCallType, setModalCallType] = useState<CallType>('video');
  const [modalDuration, setModalDuration] = useState<10 | 15 | 30>(10);
  const [modalDate, setModalDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [modalSlot, setModalSlot] = useState<string>('');

  // Media Preview Modal State (Content preview)
  const [previewMedia, setPreviewMedia] = useState<{
    influencerName: string;
    item: { title: string; description: string; url: string; type: 'image' | 'video' };
  } | null>(null);

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

      // Search query (search by name, handle, bio, or category)
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

  // Open Quick Booking Modal for a creator
  const handleOpenBookingModal = (inf: InfluencerProfile) => {
    setBookingInfluencer(inf);
    const initialCallType = inf.videoCallEnabled ? 'video' : 'voice';
    setModalCallType(initialCallType);
    setModalDuration(10);
    const d = new Date();
    d.setDate(d.getDate() + 1);
    setModalDate(d.toISOString().split('T')[0]);
    setModalSlot(inf.availability?.timeSlots?.[0] || '06:00 PM');
  };

  // Compute calculated price for modal
  const getModalPrice = () => {
    if (!bookingInfluencer) return 0;
    if (modalCallType === 'voice') {
      if (modalDuration === 10) return bookingInfluencer.rates.voice10;
      if (modalDuration === 15) return bookingInfluencer.rates.voice15;
      return bookingInfluencer.rates.voice30;
    } else {
      if (modalDuration === 10) return bookingInfluencer.rates.video10;
      if (modalDuration === 15) return bookingInfluencer.rates.video15;
      return bookingInfluencer.rates.video30;
    }
  };

  const handleProceedToPayment = () => {
    if (!bookingInfluencer) return;
    const price = getModalPrice();
    openCheckout({
      influencer: bookingInfluencer,
      callType: modalCallType,
      duration: modalDuration,
      scheduledDate: modalDate,
      scheduledTime: modalSlot || '06:00 PM',
      price
    });
    setBookingInfluencer(null);
  };

  return (
    <div className="space-y-8 pb-8 font-sans">

      {/* Discovery Hero & Search Bar */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200/60 inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-brand-600" /> Discover & Connect
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#0B132B] mt-2 tracking-tight">
              Explore Verified Creators & Stars
            </h2>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs font-bold px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
              <strong className="text-brand-600 font-extrabold">{filteredInfluencers.length}</strong> Creators Available
            </span>
          </div>
        </div>

        {/* Search Input & Primary Controls - Single Row Clean Alignment */}
        <div className="flex flex-col xl:flex-row gap-3 items-stretch xl:items-center justify-between">
          {/* Search Field */}
          <div className="relative flex-1 max-w-md min-w-[260px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search creator by name or username..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#F8F9FC] border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition-all font-medium h-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Secondary Controls (Call Type, Price Slider, Verified) - Fixed Single Horizontal Row */}
          <div className="flex items-center gap-2.5 flex-nowrap overflow-x-auto pb-1 xl:pb-0 scrollbar-none shrink-0">
            {/* Call Type Pill Switcher */}
            <div className="flex items-center bg-[#F8F9FC] p-1 rounded-xl border border-slate-200 text-xs shrink-0 h-10">
              <button
                onClick={() => setCallTypeFilter('all')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer h-full ${
                  callTypeFilter === 'all'
                    ? 'bg-white text-[#0B132B] shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                All Calls
              </button>
              <button
                onClick={() => setCallTypeFilter('video')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-all cursor-pointer h-full ${
                  callTypeFilter === 'video'
                    ? 'bg-purple-50 text-purple-700 shadow-xs border border-purple-200'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Video className="w-3.5 h-3.5 text-purple-600" /> Video
              </button>
              <button
                onClick={() => setCallTypeFilter('voice')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-all cursor-pointer h-full ${
                  callTypeFilter === 'voice'
                    ? 'bg-emerald-50 text-emerald-700 shadow-xs border border-emerald-200'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-600" /> Voice
              </button>
            </div>

            {/* Price Slider Badge */}
            <div className="flex items-center gap-2 px-3 rounded-xl bg-[#F8F9FC] border border-slate-200 text-xs text-slate-700 shrink-0 h-10">
              <span className="text-slate-500 font-medium">Max:</span>
              <span className="font-extrabold text-[#0B132B]">₹{maxPrice}</span>
              <input
                type="range"
                min="200"
                max="3000"
                step="100"
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                className="w-16 sm:w-20 accent-brand-500 cursor-pointer"
              />
            </div>

            {/* Verified Filter Checkbox */}
            <label className="flex items-center gap-2 px-3 rounded-xl bg-[#F8F9FC] border border-slate-200 text-xs text-slate-700 font-semibold cursor-pointer hover:border-slate-300 shrink-0 select-none h-10">
              <input
                type="checkbox"
                checked={onlyVerified}
                onChange={e => setOnlyVerified(e.target.checked)}
                className="rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
              />
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-500" />
              <span>Verified Only</span>
            </label>
          </div>
        </div>

        {/* Category Horizontal Pills */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${selectedCategory === cat
                  ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-md shadow-brand-500/25 ring-1 ring-brand-400/30'
                  : 'bg-white text-slate-600 hover:text-[#0B132B] hover:bg-slate-50 border border-slate-200/90 shadow-2xs'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Creator Grid Section */}
      <section className="space-y-5">
        {filteredInfluencers.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-[#0B132B]">No Creators Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn't find any creators matching "{searchQuery || selectedCategory}". Try resetting your filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setCallTypeFilter('all');
                setMaxPrice(3000);
                setSearchQuery('');
                setOnlyVerified(false);
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInfluencers.map(inf => {
              return (
                <div
                  key={inf.id}
                  className="group relative rounded-3xl bg-white border border-slate-200/90 hover:border-brand-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-sm flex flex-col overflow-hidden text-slate-800"
                >
                  {/* Creator Cover Image Header */}
                  <div className="relative h-32 w-full overflow-hidden bg-slate-100">
                    <img
                      src={inf.coverImage}
                      alt={inf.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    {/* Category Pill Tag */}
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#0B132B] border border-white/60 shadow-xs">
                        {inf.category}
                      </span>
                    </div>

                    {/* Star Rating Badge */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[11px] font-black text-[#0B132B] border border-white/60 shadow-xs">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>{inf.rating > 0 ? inf.rating.toFixed(1) : '5.0'}</span>
                      {inf.reviewCount > 0 && (
                        <span className="text-[9px] text-slate-500 font-normal">({inf.reviewCount})</span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">

                    {/* Avatar & Creator Name & Username */}
                    <div>
                      <div className="flex items-start gap-3.5 -mt-10 relative z-10">
                        <img
                          src={inf.avatar}
                          alt={inf.name}
                          className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white shadow-md bg-white shrink-0"
                        />
                        <div className="pt-4 flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-sm font-extrabold text-[#0B132B] truncate">{inf.name}</h3>
                            {inf.isVerified && (
                              <span title="Verified Creator">
                                <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-brand-600 font-bold truncate">{inf.handle}</p>
                        </div>
                      </div>

                      {/* Social Media Links Row */}
                      <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-slate-100 flex-wrap">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Social:</span>
                        {inf.socialLinks.youtube && (
                          <a
                            href={inf.socialLinks.youtube}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2 py-0.5 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-600 text-[10px] font-bold border border-rose-200 transition-colors"
                            title="YouTube Channel"
                          >
                            YouTube
                          </a>
                        )}
                        {inf.socialLinks.instagram && (
                          <a
                            href={inf.socialLinks.instagram}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2 py-0.5 rounded-md bg-pink-50 hover:bg-pink-100 text-pink-600 text-[10px] font-bold border border-pink-200 transition-colors"
                            title="Instagram Profile"
                          >
                            Instagram
                          </a>
                        )}
                        {inf.socialLinks.twitter && (
                          <a
                            href={inf.socialLinks.twitter}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2 py-0.5 rounded-md bg-sky-50 hover:bg-sky-100 text-sky-600 text-[10px] font-bold border border-sky-200 transition-colors"
                            title="X (Twitter)"
                          >
                            Twitter/X
                          </a>
                        )}
                      </div>

                      {/* Short Description */}
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mt-2.5 font-normal">
                        {inf.bio}
                      </p>
                    </div>

                    {/* Content Preview (Images & Videos Thumbnails) */}
                    {inf.gallery && inf.gallery.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                          <span className="flex items-center gap-1">
                            <ImageIcon className="w-3.5 h-3.5 text-slate-400" /> Creator Content:
                          </span>
                          <span className="text-[10px] text-slate-400">{inf.gallery.length} items</span>
                        </div>
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                          {inf.gallery.slice(0, 3).map(item => (
                            <div
                              key={item.id}
                              onClick={() => setPreviewMedia({ influencerName: inf.name, item })}
                              className="relative w-16 h-12 rounded-lg overflow-hidden bg-slate-900 shrink-0 cursor-pointer group/media border border-slate-200"
                              title={item.title}
                            >
                              <img
                                src={item.url}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover/media:scale-110 transition-transform"
                              />
                              {item.type === 'video' && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                  <Play className="w-3 h-3 text-white fill-white" />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Voice Call & Video Call Prices */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                      <div className="p-2.5 rounded-xl bg-purple-50/70 border border-purple-100 flex flex-col justify-between">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-purple-700">
                          <Video className="w-3 h-3 text-purple-600" />
                          <span>Video Call</span>
                        </div>
                        <div className="mt-1">
                          {inf.videoCallEnabled ? (
                            <span className="text-xs font-black text-purple-900">
                              ₹{inf.rates.video10}
                              <span className="text-[10px] font-normal text-purple-600"> / 10m</span>
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400 font-semibold italic">Disabled</span>
                          )}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 flex flex-col justify-between">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                          <PhoneCall className="w-3 h-3 text-emerald-600" />
                          <span>Voice Call</span>
                        </div>
                        <div className="mt-1">
                          {inf.voiceCallEnabled ? (
                            <span className="text-xs font-black text-emerald-900">
                              ₹{inf.rates.voice10}
                              <span className="text-[10px] font-normal text-emerald-600"> / 10m</span>
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400 font-semibold italic">Disabled</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons: View Profile & Book a Call */}
                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedInfluencerId(inf.id);
                          setActiveView('influencer-detail');
                          navigate(`/fan/creators/${inf.id}`);
                        }}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0B132B] text-xs font-bold transition-colors cursor-pointer text-center"
                      >
                        View Profile
                      </button>

                      <button
                        onClick={() => handleOpenBookingModal(inf)}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white text-xs font-extrabold shadow-md shadow-brand-500/25 transition-all cursor-pointer text-center flex items-center justify-center gap-1"
                      >
                        <span>Book a Call</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Quick Booking Modal matching Image 2 UI/UX exactly */}
      {bookingInfluencer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setBookingInfluencer(null)}
        >
          <div
            className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 space-y-5 shadow-2xl text-slate-900"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={bookingInfluencer.avatar}
                  alt={bookingInfluencer.name}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-brand-500/30 shadow-xs"
                />
                <div>
                  <h3 className="text-base font-extrabold text-[#0B132B]">
                    Book a Call with {bookingInfluencer.name}
                  </h3>
                  <p className="text-xs text-brand-600 font-bold">{bookingInfluencer.handle}</p>
                </div>
              </div>
              <button
                onClick={() => setBookingInfluencer(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Booking Form Controls matching Image 2 */}
            <div className="space-y-4 text-xs">

              {/* 1. Select Call Mode */}
              <div className="space-y-1.5">
                <label className="block text-slate-700 font-bold">1. Select Call Mode</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {bookingInfluencer.videoCallEnabled && (
                    <button
                      type="button"
                      onClick={() => setModalCallType('video')}
                      className={`flex items-center justify-center gap-2 p-3 rounded-2xl border font-bold transition-all cursor-pointer ${modalCallType === 'video'
                          ? 'bg-purple-50/70 border-2 border-purple-500 text-purple-800 shadow-xs ring-1 ring-purple-500/20'
                          : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                      <Video className="w-4 h-4 text-purple-600" />
                      <span>HD Video Call</span>
                    </button>
                  )}
                  {bookingInfluencer.voiceCallEnabled && (
                    <button
                      type="button"
                      onClick={() => setModalCallType('voice')}
                      className={`flex items-center justify-center gap-2 p-3 rounded-2xl border font-bold transition-all cursor-pointer ${modalCallType === 'voice'
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
              <div className="space-y-1.5">
                <label className="block text-slate-700 font-bold">2. Choose Session Duration</label>
                <div className="grid grid-cols-3 gap-2">
                  {([10, 15, 30] as const).map(dur => {
                    const price = modalCallType === 'voice'
                      ? (dur === 10 ? bookingInfluencer.rates.voice10 : dur === 15 ? bookingInfluencer.rates.voice15 : bookingInfluencer.rates.voice30)
                      : (dur === 10 ? bookingInfluencer.rates.video10 : dur === 15 ? bookingInfluencer.rates.video15 : bookingInfluencer.rates.video30);
                    const isSelected = modalDuration === dur;
                    return (
                      <button
                        key={dur}
                        type="button"
                        onClick={() => setModalDuration(dur)}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${isSelected
                            ? 'border-2 border-brand-500 bg-brand-50/50 shadow-xs ring-1 ring-brand-500/20'
                            : 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                          }`}
                      >
                        <div className={`text-xs font-bold ${isSelected ? 'text-brand-900' : 'text-slate-800'}`}>
                          {dur} Minutes
                        </div>
                        <div className="text-xs font-black text-brand-600 mt-0.5">
                          ₹{price}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Select Date & 4. Available Time Slot (Side-by-Side Grid) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">3. Select Date</label>
                  <input
                    type="date"
                    value={modalDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => setModalDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold focus:outline-none focus:border-brand-500 text-xs cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">4. Available Time Slot</label>
                  <select
                    value={modalSlot}
                    onChange={e => setModalSlot(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold focus:outline-none focus:border-brand-500 text-xs cursor-pointer"
                  >
                    {bookingInfluencer.availability?.timeSlots?.map(slot => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dark Navy Session Fee Banner matching Image 2 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0B132B] text-white flex items-center justify-between shadow-md">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                    SESSION FEE
                  </span>
                  <span className="text-xs text-slate-200 font-medium mt-0.5 block">
                    {modalDuration} Min {modalCallType === 'video' ? 'Video' : 'Voice'} Session
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-brand-500 tracking-tight">
                    ₹{getModalPrice()}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    + GST & platform fee
                  </span>
                </div>
              </div>

            </div>

            {/* Modal Actions matching Image 2 */}
            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setBookingInfluencer(null)}
                className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleProceedToPayment}
                className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-extrabold text-xs shadow-md shadow-brand-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Proceed to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Creator Media Preview Modal */}
      {previewMedia && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setPreviewMedia(null)}
        >
          <div
            className="w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 p-5 space-y-4 shadow-2xl text-white"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h4 className="text-sm font-bold text-white">{previewMedia.item.title}</h4>
                <p className="text-xs text-slate-400">Uploaded by {previewMedia.influencerName}</p>
              </div>
              <button
                onClick={() => setPreviewMedia(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden bg-black max-h-[60vh] flex items-center justify-center">
              <img
                src={previewMedia.item.url}
                alt={previewMedia.item.title}
                className="max-h-[60vh] w-auto object-contain"
              />
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {previewMedia.item.description}
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
