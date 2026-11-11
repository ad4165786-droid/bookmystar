import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Category, CallType, InfluencerProfile } from '../../types';
import { 
  Sparkles, 
  User, 
  Video, 
  Mail, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  Star, 
  Eye, 
  EyeOff, 
  KeyRound, 
  X,
  PhoneCall, 
  ShieldCheck, 
  Zap, 
  AtSign,
  Search,
  SlidersHorizontal,
  Clock,
  Heart,
  ChevronDown,
  Award,
  FileText,
  BadgeCheck,
  Check,
  Headphones,
  Calendar,
  Layers,
  HelpCircle
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

export const CommercialLandingPage: React.FC = () => {
  const { 
    isAuthenticated, 
    currentRole, 
    currentUser, 
    currentInfluencer, 
    currentAdmin, 
    navigate, 
    logout,
    influencers, 
    loginUser, 
    registerUser, 
    loginInfluencer, 
    registerInfluencer, 
    showToast,
    openCheckout
  } = useApp();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | Category>('All');
  const [callTypeFilter, setCallTypeFilter] = useState<'all' | CallType>('all');
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [onlyVerified, setOnlyVerified] = useState(false);

  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeRoleTab, setActiveRoleTab] = useState<'user' | 'influencer'>('user');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  // Form Fields
  const [identifier, setIdentifier] = useState('aarav.sharma@gmail.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);

  // User Reg Fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Influencer Reg Fields
  const [infName, setInfName] = useState('');
  const [infHandle, setInfHandle] = useState('');
  const [infEmail, setInfEmail] = useState('');
  const [infPhone, setInfPhone] = useState('');
  const [infCategory, setInfCategory] = useState<Category>('Gaming');
  const [infBio, setInfBio] = useState('');
  const [infPassword, setInfPassword] = useState('');

  // Forgot Password Modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Quick switch role
  const handleRoleSwitch = (role: 'user' | 'influencer') => {
    setActiveRoleTab(role);
    setAuthMode('signin');
    if (role === 'user') {
      setIdentifier('aarav.sharma@gmail.com');
      setPassword('password123');
    } else {
      setIdentifier('@vortex_esports');
      setPassword('creator123');
    }
  };

  const openAuthWithRole = (role: 'user' | 'influencer', mode: 'signin' | 'signup' = 'signin') => {
    handleRoleSwitch(role);
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  // Submit Sign In
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeRoleTab === 'user') {
      const res = loginUser(identifier, password);
      if (res.success) {
        setIsAuthModalOpen(false);
      } else if (res.message) {
        showToast(res.message);
      }
    } else {
      const res = loginInfluencer(identifier, password);
      if (res.success) {
        setIsAuthModalOpen(false);
      } else if (res.message) {
        showToast(res.message);
      }
    }
  };

  // Submit Sign Up
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeRoleTab === 'user') {
      if (!regName.trim() || !regEmail.trim()) {
        showToast('Please provide your name and email.');
        return;
      }
      const res = registerUser({
        name: regName,
        email: regEmail,
        phone: regPhone || '+91 98000 12345',
        password: regPassword || 'password123'
      });
      if (res.success) setIsAuthModalOpen(false);
    } else {
      if (!infName.trim() || !infHandle.trim() || !infEmail.trim()) {
        showToast('Please fill in all creator details.');
        return;
      }
      const res = registerInfluencer({
        name: infName,
        handle: infHandle,
        email: infEmail,
        phone: infPhone || '+91 99000 54321',
        category: infCategory,
        bio: infBio,
        password: infPassword || 'creator123'
      });
      if (res.success) setIsAuthModalOpen(false);
    }
  };

  // Forgot password submit
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    showToast(`Password reset link sent to ${forgotEmail}. Please check your inbox.`);
    setShowForgotModal(false);
    setForgotEmail('');
  };

  // Filtered Creators
  const filteredInfluencers = useMemo(() => {
    return influencers.filter(inf => {
      if (onlyVerified && !inf.isVerified) return false;
      if (selectedCategory !== 'All' && inf.category !== selectedCategory) return false;
      if (callTypeFilter === 'voice' && !inf.voiceCallEnabled) return false;
      if (callTypeFilter === 'video' && !inf.videoCallEnabled) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = inf.name.toLowerCase().includes(q);
        const matchesBio = inf.bio.toLowerCase().includes(q);
        const matchesHandle = inf.handle.toLowerCase().includes(q);
        const matchesCat = inf.category.toLowerCase().includes(q);
        if (!matchesName && !matchesBio && !matchesHandle && !matchesCat) return false;
      }

      const lowestVoice = inf.voiceCallEnabled ? inf.rates.voice10 : 99999;
      const lowestVideo = inf.videoCallEnabled ? inf.rates.video10 : 99999;
      const startingPrice = Math.min(lowestVoice, lowestVideo);
      if (startingPrice > maxPrice) return false;

      return true;
    });
  }, [influencers, selectedCategory, callTypeFilter, searchQuery, maxPrice, onlyVerified]);

  // Handle Star Booking Click
  const handleBookStar = (inf: InfluencerProfile) => {
    if (!isAuthenticated) {
      // Prompt user to sign in
      openAuthWithRole('user', 'signin');
      showToast('Please sign in as a fan to book your slot.');
      return;
    }
    if (currentRole !== 'user') {
      showToast('Please sign in as a fan user to book sessions.');
      return;
    }
    // Launch booking checkout flow
    const scheduledDate = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const scheduledTime = inf.availability?.timeSlots?.[0] || '16:00';
    openCheckout({
      influencer: inf,
      callType: inf.videoCallEnabled ? 'video' : 'voice',
      duration: 15,
      scheduledDate,
      scheduledTime,
      price: inf.videoCallEnabled ? inf.rates.video15 : inf.rates.voice15
    });
  };

  // Featured Hero Star (Vikram Rajput)
  const heroStar = influencers[0] || {
    id: 'inf-hero',
    name: 'Vikram Rajput',
    handle: '@vortex_esports',
    category: 'Gaming',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=600&auto=format&fit=crop&q=80',
    bio: 'Pro Esports Caster, Valorant analyst & PC Build Specialist. 1-on-1 strategic gameplay reviews and PC optimizations.',
    rating: 4.98,
    reviewCount: 412,
    completedCallsCount: 1420,
    rates: { voice10: 349, voice15: 499, voice30: 899, video10: 699, video15: 999, video30: 1799 }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-brand-500 selection:text-white">
      
      {/* 1. STICKY TOP NAVBAR (matching petcarecomodizo.vercel.app) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo & Indian Flag Badge */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white shadow-orange-glow">
              <Sparkles className="w-6 h-6 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-2xl tracking-tight text-slate-900">
                  BookMy<span className="text-brand-600">Star</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-orange-50 text-brand-700 border border-brand-200">
                  <span>🇮🇳</span> India's #1 Star Calls
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Verified 1-on-1 Influencer Video & Voice Platform</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#stars-directory" className="hover:text-brand-600 transition-colors">Find Stars</a>
            <a href="#categories" className="hover:text-brand-600 transition-colors">Categories</a>
            <a href="#how-it-works" className="hover:text-brand-600 transition-colors">How It Works</a>
            <a href="#trust-safety" className="hover:text-brand-600 transition-colors">Platform Guarantees</a>
            <a href="#fan-reviews" className="hover:text-brand-600 transition-colors">Reviews</a>
            <a href="#faq" className="hover:text-brand-600 transition-colors">FAQ</a>
          </nav>

          {/* Right Action / Auth Buttons */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              // Authenticated User Menu
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <img 
                    src={currentUser?.avatar || currentInfluencer?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'} 
                    alt="User" 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="text-left hidden sm:block">
                    <div className="text-xs font-bold text-slate-900 leading-tight">
                      {currentUser?.name || currentInfluencer?.name || currentAdmin?.name}
                    </div>
                    <div className="text-[10px] text-brand-600 font-semibold capitalize">
                      {currentRole === 'user' ? 'Fan Account' : currentRole === 'influencer' ? 'Star Creator' : 'Administrator'}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (currentRole === 'user') navigate('/user/dashboard');
                    else if (currentRole === 'influencer') navigate('/influencer/dashboard');
                    else if (currentRole === 'admin') navigate('/admin/dashboard');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-orange-glow transition-all flex items-center gap-1.5"
                >
                  <span>My Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={logout}
                  className="p-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors text-xs font-semibold"
                  title="Sign Out"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              // Unauthenticated Actions (User Sign In + Influencer Sign In)
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => openAuthWithRole('user', 'signin')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                >
                  <User className="w-4 h-4 text-brand-600" />
                  <span className="hidden sm:inline">User Sign In</span>
                  <span className="sm:hidden">Sign In</span>
                </button>

                <button
                  type="button"
                  onClick={() => openAuthWithRole('influencer', 'signin')}
                  className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                >
                  <Video className="w-4 h-4 text-brand-400" />
                  <span>Creator Sign In</span>
                </button>

                <button
                  type="button"
                  onClick={() => openAuthWithRole('user', 'signin')}
                  className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-orange-glow transition-all flex items-center gap-1.5"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* 2. HERO SECTION (2 Columns, matching PetCare layout) */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-white via-orange-50/20 to-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Headline, Trust Badges, CTAs (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold tracking-wide">
                <ShieldCheck className="w-4 h-4 text-brand-600" />
                <span>India's #1 Verified Influencer Call Platform</span>
              </div>

              <div className="space-y-4">
                <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
                  Connect With Your <br />
                  <span className="bg-gradient-to-r from-brand-600 via-orange-500 to-amber-500 bg-clip-text text-transparent">
                    Favourite Stars
                  </span>
                </h1>
                
                <p className="text-base sm:text-lg text-slate-600 max-w-xl font-normal leading-relaxed">
                  Book exclusive voice and video calls with your favourite influencers. Private, high-definition 1-on-1 sessions with top creators in Gaming, Music, Tech, Fashion, and Entertainment.
                </p>
              </div>

              {/* Dual CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#stars-directory"
                  className="px-6 py-4 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-orange-glow transition-all flex items-center gap-2 transform active:scale-95"
                >
                  <span>Explore Stars Now</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={() => openAuthWithRole('influencer', 'signup')}
                  className="px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-soft transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-brand-400" />
                  <span>Join as Creator</span>
                </button>
              </div>

              {/* Overlapping Fan & Star Avatars + Trust Score */}
              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-200/80">
                <div className="flex -space-x-3 overflow-hidden p-1">
                  <img
                    className="inline-block h-12 w-12 rounded-full ring-2 ring-white object-cover shadow-sm"
                    src="https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=120&auto=format&fit=crop&q=80"
                    alt="Vikram Rajput"
                  />
                  <img
                    className="inline-block h-12 w-12 rounded-full ring-2 ring-white object-cover shadow-sm"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                    alt="Ananya Roy"
                  />
                  <img
                    className="inline-block h-12 w-12 rounded-full ring-2 ring-white object-cover shadow-sm"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
                    alt="Kabir Dev"
                  />
                  <img
                    className="inline-block h-12 w-12 rounded-full ring-2 ring-white object-cover shadow-sm"
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80"
                    alt="Mira Kapoor"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                    {[1, 2, 3, 4, 5].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-slate-900 ml-1 font-heading font-extrabold">4.9/5.0</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">Over 2,400+ Verified 1-on-1 Sessions Completed</p>
                </div>
              </div>

              {/* Value Props Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 max-w-xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 text-brand-600 flex items-center justify-center font-bold text-xs shrink-0">
                    <Video className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-slate-900">HD 1080p Video</div>
                    <div className="text-slate-500">Crystal clear streams</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-slate-900">Voice Audio Mode</div>
                    <div className="text-slate-500">Rates from ₹199</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-slate-900">Instant UPI & QR</div>
                    <div className="text-slate-500">Secure Indian escrow</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Interactive Featured Specialist Card (5 cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white rounded-3xl border border-slate-200/90 shadow-soft-lg p-5 sm:p-6 overflow-hidden">
                
                {/* Floating Live Badge */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold border border-white/10 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Available in 15 mins</span>
                </div>

                {/* Floating Rating Pill */}
                <div className="absolute top-4 right-4 z-10 flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-400 text-slate-900 text-xs font-black shadow-md">
                  <Star className="w-3.5 h-3.5 fill-slate-900" />
                  <span>4.98</span>
                </div>

                {/* Star Image */}
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100 mb-5 group">
                  <img 
                    src={heroStar.avatar} 
                    alt={heroStar.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-extrabold text-xl">{heroStar.name}</span>
                      <BadgeCheck className="w-5 h-5 text-brand-400 fill-brand-400" />
                    </div>
                    <span className="text-xs text-slate-300 font-mono">{heroStar.handle}</span>
                  </div>
                </div>

                {/* Star Bio Snippet */}
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                  {heroStar.bio}
                </p>

                {/* Rates Row */}
                <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100 mb-4">
                  <div className="text-left">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Voice Call</span>
                    <span className="text-sm font-extrabold text-slate-900 font-mono">₹499 <span className="text-[10px] font-normal text-slate-500">/ 15m</span></span>
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Video Call</span>
                    <span className="text-sm font-extrabold text-brand-600 font-mono">₹999 <span className="text-[10px] font-normal text-slate-500">/ 15m</span></span>
                  </div>
                </div>

                {/* Interactive Instant Book Button */}
                <button
                  type="button"
                  onClick={() => handleBookStar(influencers[0] || (heroStar as any))}
                  className="w-full py-3.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-orange-glow transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Book 1-on-1 Session with {heroStar.name.split(' ')[0]}</span>
                </button>

                <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>100% Escrow Protected • Instant UPI & NetBanking</span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. CATEGORIES QUICK-FILTER STRIP (matching PetCare) */}
      <section id="categories" className="py-8 bg-slate-50/70 border-b border-slate-200/60 sticky top-20 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map(cat => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80'
                  }`}
                >
                  <span>{cat === 'All' ? '⚡ All Stars' : cat}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. LIVE STAR DIRECTORY / MARKETPLACE (The Heart of the Portal) */}
      <section id="stars-directory" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Section Header + Search & Filter Controls */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Verified Influencer Directory</span>
              </div>
              <h2 className="font-heading text-3xl font-black text-slate-900 tracking-tight">
                Find Your Star & Book a Call
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Showing {filteredInfluencers.length} verified creators ready for private voice & video calls
              </p>
            </div>

            {/* Live Search & Filter Bar */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search Input */}
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by name, game, niche..."
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:bg-white"
                />
              </div>

              {/* Call Type Filter */}
              <select
                value={callTypeFilter}
                onChange={e => setCallTypeFilter(e.target.value as any)}
                className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-brand-500"
              >
                <option value="all">All Call Types</option>
                <option value="video">Video Calls Only</option>
                <option value="voice">Voice Calls Only</option>
              </select>

              {/* Price Slider Dropdown / Pill */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                <span>Max:</span>
                <span className="font-bold text-slate-900 font-mono">₹{maxPrice}</span>
                <input
                  type="range"
                  min="500"
                  max="5000"
                  step="250"
                  value={maxPrice}
                  onChange={e => setMaxPrice(Number(e.target.value))}
                  className="w-20 accent-brand-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Creators Card Grid (matching PetCare specialist cards) */}
          {filteredInfluencers.length === 0 ? (
            <div className="py-16 text-center rounded-3xl bg-slate-50 border border-slate-100 p-8 space-y-3">
              <Sparkles className="w-8 h-8 text-slate-400 mx-auto" />
              <h4 className="font-bold text-slate-800 text-base">No creators found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try widening your price range or clearing search keywords to view available creators.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setCallTypeFilter('all');
                  setMaxPrice(5000);
                }}
                className="px-4 py-2 rounded-xl bg-brand-600 text-white font-bold text-xs"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInfluencers.map(inf => {
                const nextSlotTime = inf.availability?.timeSlots?.[0] || '16:00';
                return (
                  <div 
                    key={inf.id} 
                    className="bg-white rounded-3xl border border-slate-200/90 shadow-soft hover:shadow-soft-lg transition-all duration-300 p-5 flex flex-col justify-between group hover:-translate-y-1"
                  >
                    <div>
                      {/* Card Header: Avatar + Status + Category */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                          <img 
                            src={inf.avatar} 
                            alt={inf.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <span className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-heading font-extrabold text-base text-slate-900 truncate">
                              {inf.name}
                            </span>
                            {inf.isVerified && (
                              <BadgeCheck className="w-4 h-4 text-brand-600 fill-brand-600 shrink-0" />
                            )}
                          </div>
                          
                          <div className="text-xs text-slate-500 font-mono truncate">{inf.handle}</div>
                          
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                              {inf.category}
                            </span>
                            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
                              <Star className="w-3.5 h-3.5 fill-amber-400" />
                              <span>{inf.rating.toFixed(1)}</span>
                              <span className="text-slate-400 font-normal">({inf.completedCallsCount})</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bio Snippet */}
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                        {inf.bio}
                      </p>

                      {/* Languages Badges */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-4">
                        {(inf.languages || ['English', 'Hindi']).map(lang => (
                          <span key={lang} className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-50 text-slate-500 border border-slate-100">
                            {lang}
                          </span>
                        ))}
                      </div>

                      {/* Rates Matrix Row */}
                      <div className="grid grid-cols-2 gap-2 p-2.5 rounded-2xl bg-slate-50 border border-slate-100 mb-4 text-xs font-mono">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-sans font-bold block">🎙️ Voice (15m)</span>
                          <span className="font-extrabold text-slate-800">
                            {inf.voiceCallEnabled ? `₹${inf.rates.voice15}` : 'Disabled'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-sans font-bold block">📹 Video (15m)</span>
                          <span className="font-extrabold text-brand-600">
                            {inf.videoCallEnabled ? `₹${inf.rates.video15}` : 'Disabled'}
                          </span>
                        </div>
                      </div>

                      {/* Next Available Slot Badge */}
                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold mb-4 bg-emerald-50 px-2.5 py-1 rounded-xl">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Next Slot: Today at {nextSlotTime}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      type="button"
                      onClick={() => handleBookStar(inf)}
                      className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-brand-600 text-white font-bold text-xs shadow-soft transition-all flex items-center justify-center gap-2 group-hover:bg-brand-600 group-hover:shadow-orange-glow"
                    >
                      <span>Book Call Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>

      {/* 5. HOW IT WORKS 3-STEP SECTION (matching PetCare) */}
      <section id="how-it-works" className="py-20 bg-slate-50/80 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Simple 3-Step Process</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              How BookMyStar Works
            </h2>
            <p className="text-sm text-slate-600">
              Direct, private 1-on-1 consultations with verified industry leaders and celebrity influencers in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-soft relative space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-brand-600 flex items-center justify-center font-heading font-black text-xl">
                1
              </div>
              <h3 className="font-heading font-extrabold text-lg text-slate-900">
                Choose Your Star
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Explore 500+ verified creators across Gaming, Music, Tech, and Fitness. View transparent transparent per-minute rates and fan ratings.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-soft relative space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-heading font-black text-xl">
                2
              </div>
              <h3 className="font-heading font-extrabold text-lg text-slate-900">
                Lock a Guaranteed Slot
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Select a 15, 30, or 60 minute slot. Our anti-collision engine reserves your time instantly with secure escrow UPI or Card checkout.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-soft relative space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-heading font-black text-xl">
                3
              </div>
              <h3 className="font-heading font-extrabold text-lg text-slate-900">
                Connect 1-on-1 Live
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Join the private WebRTC encrypted video or voice call room. Zero recordings stored without mutual consent. Creator paid only upon call completion.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 6. PLATFORM TRUST & SAFETY GUARANTEES (Why BookMyStar) */}
      <section id="trust-safety" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Enterprise-Grade Security</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Built on Trust & Escrow Protection
            </h2>
            <p className="text-sm text-slate-600">
              India's first compliance-ready celebrity booking architecture designed to safeguard both fans and creators.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-brand-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">100% Escrow Protection</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your payment is safely held in escrow. The influencer is only disbursed funds once the call has successfully completed.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">End-to-End Call Privacy</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Private peer-to-peer WebRTC connections. No session recordings or audio snooping without mutual explicit opt-in.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Instant GST Tax Invoices</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Download formal compliant digital invoices with platform GSTIN and SAC code 998413 immediately upon booking.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Anti-Collision Slot Locking</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Guaranteed slot reservations. When you initiate booking, the slot is locked for 10 minutes to prevent double-booking.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 7. VERIFIED FAN TESTIMONIALS (matching PetCare) */}
      <section id="fan-reviews" className="py-20 bg-slate-50/70 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Real Stories from Fans</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Loved by Thousands of Fans Across India
            </h2>
            <p className="text-sm text-slate-600">
              Read how 1-on-1 calls with mentors and stars have inspired gaming careers, music journeys, and tech breakthroughs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Review 1 */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[1, 2, 3, 4, 5].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-700 italic leading-relaxed">
                "Had a 30-min strategy review with Vikram Rajput for my competitive Valorant squad. He spotted 4 key mistakes we were making on Ascent within minutes. Worth every single rupee!"
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80" 
                  alt="Aarav Sharma" 
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <div className="font-bold text-slate-900 text-xs">Aarav Sharma</div>
                  <div className="text-[10px] text-slate-500">Valorant Player • Delhi</div>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[1, 2, 3, 4, 5].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-700 italic leading-relaxed">
                "Ananya Roy heard my original acoustic track and gave me live feedback on my vocal harmonies. She even guided me on Spotify distribution! A dream come true."
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80" 
                  alt="Priya Mehra" 
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <div className="font-bold text-slate-900 text-xs">Priya Mehra</div>
                  <div className="text-[10px] text-slate-500">Aspiring Singer • Mumbai</div>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[1, 2, 3, 4, 5].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-700 italic leading-relaxed">
                "Kabir Dev roasted my distributed systems architecture and gave me the exact blueprint that helped me crack my L6 staff engineer interview. Best career investment."
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80" 
                  alt="Rohan Verma" 
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <div className="font-bold text-slate-900 text-xs">Rohan Verma</div>
                  <div className="text-[10px] text-slate-500">Backend Lead • Bengaluru</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 8. INTERACTIVE FAQ ACCORDION */}
      <section id="faq" className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Frequently Asked Questions</span>
            <h2 className="font-heading text-3xl font-black text-slate-900 tracking-tight">
              Got Questions? We've Got Answers
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'How does 1-on-1 call booking work on BookMyStar?',
                a: 'You simply browse our directory of verified creators, pick your preferred session duration (15, 30, or 60 minutes), and choose a date and time slot. Once you pay via UPI or Card, the slot is locked, and an encrypted call room link is sent to both you and the creator.'
              },
              {
                q: 'What happens if the influencer does not join the scheduled call?',
                a: 'We operate under a strict 100% Escrow Protection guarantee. If a creator fails to join within 10 minutes of the scheduled time or cancels, your payment is automatically refunded back to your original payment method with zero platform cancellation fees.'
              },
              {
                q: 'Are the video and voice calls private and recorded?',
                a: 'All sessions use end-to-end encrypted WebRTC. BookMyStar strictly does not record audio or video streams without explicit mutual written consent from both parties. Only call metadata (start time, end time, duration) is logged for billing reconciliation.'
              },
              {
                q: 'Do I get a GST tax invoice for my booking?',
                a: 'Yes! An itemized digital GST tax invoice with the platform GSTIN, influencer SAC code 998413, and clear breakup of fees is instantly generated and accessible from your User Dashboard under Invoices.'
              },
              {
                q: 'How can I join as an influencer or creator?',
                a: 'Click on the "Join as Creator" button to submit your registration with your handle, category, and mobile number. Our operations team verifies your identity and social handles via KYC before approving your rates and opening your booking calendar.'
              }
            ].map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx} 
                  className="rounded-2xl border border-slate-200/90 overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <span className="font-bold text-slate-900 text-sm">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180 text-brand-600' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-6 py-4 bg-white text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 9. HIGH-CONVERTING BOTTOM CTA BANNER */}
      <section className="py-16 bg-gradient-to-r from-brand-600 via-orange-500 to-amber-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-heading text-3xl sm:text-5xl font-black tracking-tight">
            Ready to Connect with Your Favourite Star?
          </h2>
          <p className="text-orange-100 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Join thousands of passionate fans having unforgettable 1-on-1 video calls. Guaranteed slots, verified stars, and instant booking.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => openAuthWithRole('user', 'signin')}
              className="px-8 py-4 rounded-2xl bg-white text-slate-900 font-extrabold text-sm shadow-soft-lg hover:bg-slate-100 transition-all transform active:scale-95"
            >
              Sign In as Fan
            </button>
            <button
              type="button"
              onClick={() => openAuthWithRole('influencer', 'signup')}
              className="px-8 py-4 rounded-2xl bg-slate-950 text-white font-extrabold text-sm shadow-soft-lg hover:bg-slate-900 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span>Apply as Star Creator</span>
            </button>
          </div>
        </div>
      </section>

      {/* 10. MULTI-COLUMN COMMERCIAL FOOTER (matching PetCare) */}
      <footer className="bg-slate-950 text-slate-400 py-16 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4 fill-white" />
              </div>
              <span className="font-heading font-black text-xl text-white">
                BookMy<span className="text-brand-500">Star</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                🇮🇳 IN
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              India's premier verified influencer 1-on-1 video and voice call marketplace. Connect directly with creators with guaranteed escrow and privacy.
            </p>
            <div className="text-[11px] text-slate-500">
              © 2026 BookMyStar Internet Services Pvt Ltd.<br />All rights reserved.
            </div>
          </div>

          {/* Quick Links For Fans */}
          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-xs">For Fans</h5>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#stars-directory" className="hover:text-white transition-colors">Explore Creators</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#categories" className="hover:text-white transition-colors">Browse Categories</a></li>
              <li><a href="#trust-safety" className="hover:text-white transition-colors">Escrow Guarantee</a></li>
              <li>
                <button 
                  onClick={() => openAuthWithRole('user', 'signin')} 
                  className="hover:text-brand-400 transition-colors font-semibold"
                >
                  Fan Login / Register
                </button>
              </li>
            </ul>
          </div>

          {/* For Creators */}
          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-xs">For Creators</h5>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button 
                  onClick={() => openAuthWithRole('influencer', 'signup')} 
                  className="hover:text-white transition-colors"
                >
                  Creator Registration
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openAuthWithRole('influencer', 'signin')} 
                  className="hover:text-white transition-colors"
                >
                  Creator Studio Login
                </button>
              </li>
              <li><a href="#trust-safety" className="hover:text-white transition-colors">Payout Schedule</a></li>
              <li><a href="#trust-safety" className="hover:text-white transition-colors">KYC Requirements</a></li>
              <li><a href="#trust-safety" className="hover:text-white transition-colors">Anti-Harassment Terms</a></li>
            </ul>
          </div>

          {/* Trust & Compliance */}
          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-xs">Trust & Legal</h5>
            <ul className="space-y-2 text-slate-400">
              <li><span className="hover:text-white cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-white cursor-pointer">Terms of Service</span></li>
              <li><span className="hover:text-white cursor-pointer">Refund & Cancellation Policy</span></li>
              <li><span className="hover:text-white cursor-pointer">GST Compliance & Tax Invoicing</span></li>
              <li><span className="hover:text-white cursor-pointer">WebRTC Call Security</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
          <p>BookMyStar adheres strictly to the Information Technology Act, 2000 and RBI Escrow regulations.</p>
          <p>Made with ❤️ in India for Creators & Fans</p>
        </div>
      </footer>

      {/* 11. AUTHENTICATION MODAL (With Role Switch: User Sign In vs Influencer Sign In) */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-7 sm:p-8 relative overflow-hidden transition-all max-h-[92vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Subtle Gradient Blob */}
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-44 h-44 bg-gradient-to-br from-brand-100 to-amber-100 rounded-full blur-2xl opacity-60 pointer-events-none" />

            {/* Modal Header */}
            <div className="relative z-10 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-brand-600 text-white flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="font-heading font-black text-lg text-slate-900">
                  BookMy<span className="text-brand-600">Star</span>
                </span>
              </div>
              <h3 className="font-heading text-2xl font-black text-slate-900">
                {activeRoleTab === 'user' 
                  ? (authMode === 'signin' ? 'Welcome Back, Fan!' : 'Create Fan Account')
                  : (authMode === 'signin' ? 'Creator Studio Login' : 'Influencer Registration')
                }
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeRoleTab === 'user'
                  ? (authMode === 'signin' ? 'Sign in to book and join 1-on-1 star calls' : 'Join thousands of fans connecting with stars')
                  : (authMode === 'signin' ? 'Manage your availability, bookings and payouts' : 'Monetize 1-on-1 time with your community')
                }
              </p>
            </div>

            {/* ROLE SWITCH TABS: User Sign In vs Influencer Sign In */}
            <div className="relative z-10 mb-6">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Select Sign In Portal:
              </div>
              <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200/80">
                <button
                  type="button"
                  onClick={() => handleRoleSwitch('user')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                    activeRoleTab === 'user'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <User className={`w-4 h-4 ${activeRoleTab === 'user' ? 'text-brand-600' : 'text-slate-400'}`} />
                  <span>User Sign In</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleSwitch('influencer')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                    activeRoleTab === 'influencer'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Video className={`w-4 h-4 ${activeRoleTab === 'influencer' ? 'text-brand-400' : 'text-slate-400'}`} />
                  <span>Influencer Sign In</span>
                </button>
              </div>
            </div>

            {/* AUTH FORMS */}
            {authMode === 'signin' ? (
              /* SIGN IN FORM */
              <form onSubmit={handleSignIn} className="space-y-4 text-xs relative z-10">
                {/* Email or Mobile */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">
                    {activeRoleTab === 'user' ? 'Email or Mobile Number' : 'Registered Email or Handle'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      {activeRoleTab === 'user' ? <Mail className="w-4 h-4" /> : <AtSign className="w-4 h-4" />}
                    </div>
                    <input
                      type="text"
                      value={identifier}
                      onChange={e => setIdentifier(e.target.value)}
                      placeholder={activeRoleTab === 'user' ? "aarav.sharma@gmail.com or +91..." : "@vortex_esports or creator@mail..."}
                      className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:bg-white text-xs font-medium"
                      required
                    />
                  </div>
                </div>

                {/* Password with Show/Hide */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-slate-700 font-bold">Password</label>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-[11px] font-semibold text-brand-600 hover:text-brand-700"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter account password"
                      className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:bg-white text-xs"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 transform active:scale-[0.99] ${
                    activeRoleTab === 'user'
                      ? 'bg-brand-600 hover:bg-brand-500 text-white shadow-orange-glow'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  <span>
                    {activeRoleTab === 'user' ? 'Sign In as Fan' : 'Sign In to Creator Studio'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Toggle to Registration */}
                <div className="pt-2 text-center text-xs text-slate-500">
                  {activeRoleTab === 'user' ? (
                    <span>
                      Don't have a user account?{' '}
                      <button
                        type="button"
                        onClick={() => setAuthMode('signup')}
                        className="font-bold text-brand-600 hover:underline"
                      >
                        Create Account
                      </button>
                    </span>
                  ) : (
                    <span>
                      Are you an influencer or celebrity?{' '}
                      <button
                        type="button"
                        onClick={() => setAuthMode('signup')}
                        className="font-bold text-slate-900 hover:underline"
                      >
                        Influencer Registration
                      </button>
                    </span>
                  )}
                </div>

                {/* One-Click Demo Credentials */}
                <div className="pt-4 mt-2 border-t border-slate-100 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider text-center">
                    Quick Demo One-Click Sign In
                  </span>
                  {activeRoleTab === 'user' ? (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          loginUser('aarav.sharma@gmail.com', 'pass');
                          setIsAuthModalOpen(false);
                        }}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-brand-50 border border-slate-200 hover:border-brand-300 text-left transition-colors"
                      >
                        <div className="font-bold text-slate-800 text-[11px]">Aarav Sharma</div>
                        <div className="text-[10px] text-slate-500 truncate">Fan Account</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          loginUser('priya.m@outlook.com', 'pass');
                          setIsAuthModalOpen(false);
                        }}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-brand-50 border border-slate-200 hover:border-brand-300 text-left transition-colors"
                      >
                        <div className="font-bold text-slate-800 text-[11px]">Priya Mehra</div>
                        <div className="text-[10px] text-slate-500 truncate">Fan Account</div>
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          loginInfluencer('@vortex_esports', 'pass');
                          setIsAuthModalOpen(false);
                        }}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors"
                      >
                        <div className="font-bold text-slate-800 text-[11px]">Vikram Rajput</div>
                        <div className="text-[10px] text-brand-600 truncate">@vortex_esports (Gaming)</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          loginInfluencer('@ananya_acoustics', 'pass');
                          setIsAuthModalOpen(false);
                        }}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors"
                      >
                        <div className="font-bold text-slate-800 text-[11px]">Ananya Roy</div>
                        <div className="text-[10px] text-brand-600 truncate">@ananya_acoustics (Music)</div>
                      </button>
                    </div>
                  )}
                </div>

              </form>
            ) : (
              /* REGISTRATION FORM */
              <form onSubmit={handleSignUp} className="space-y-3.5 text-xs relative z-10">
                {activeRoleTab === 'user' ? (
                  /* User Registration */
                  <>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Full Legal Name</label>
                      <input
                        type="text"
                        value={regName}
                        onChange={e => setRegName(e.target.value)}
                        placeholder="e.g. Rahul Sen"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-brand-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Email Address</label>
                      <input
                        type="email"
                        value={regEmail}
                        onChange={e => setRegEmail(e.target.value)}
                        placeholder="rahul.sen@gmail.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-brand-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Mobile Number (India +91)</label>
                      <input
                        type="text"
                        value={regPhone}
                        onChange={e => setRegPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-brand-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Password</label>
                      <input
                        type="password"
                        value={regPassword}
                        onChange={e => setRegPassword(e.target.value)}
                        placeholder="Create strong password (min 6 chars)"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-brand-500"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-orange-glow transition-all"
                    >
                      Create Fan Account
                    </button>
                  </>
                ) : (
                  /* Influencer Registration */
                  <>
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Stage / Full Name</label>
                        <input
                          type="text"
                          value={infName}
                          onChange={e => setInfName(e.target.value)}
                          placeholder="e.g. Tanmay Bhat"
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-brand-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Handle</label>
                        <input
                          type="text"
                          value={infHandle}
                          onChange={e => setInfHandle(e.target.value)}
                          placeholder="@handle"
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-brand-500 font-mono"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Primary Category</label>
                        <select
                          value={infCategory}
                          onChange={e => setInfCategory(e.target.value as Category)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none"
                        >
                          {CATEGORIES.filter(c => c !== 'All').map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Mobile Number</label>
                        <input
                          type="text"
                          value={infPhone}
                          onChange={e => setInfPhone(e.target.value)}
                          placeholder="+91..."
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Email Address</label>
                      <input
                        type="email"
                        value={infEmail}
                        onChange={e => setInfEmail(e.target.value)}
                        placeholder="creator@brand.com"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Creator Bio</label>
                      <input
                        type="text"
                        value={infBio}
                        onChange={e => setInfBio(e.target.value)}
                        placeholder="Brief description of what you offer on calls..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all"
                    >
                      Submit Influencer Registration
                    </button>
                  </>
                )}

                <div className="pt-2 text-center text-xs text-slate-500">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('signin')}
                    className="font-bold text-slate-900 hover:underline"
                  >
                    Sign In here
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* 12. FORGOT PASSWORD MODAL */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 space-y-4 shadow-soft-lg">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-50 text-brand-600 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">Reset Account Password</h4>
              </div>
              <button onClick={() => setShowForgotModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Enter your registered email address or mobile number. We will send you an OTP verification token to reset your password.
            </p>

            <form onSubmit={handleForgotSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Registered Email or Phone</label>
                <input
                  type="text"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  placeholder="name@email.com or +91..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md"
                >
                  Send Reset Link
                </button>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-semibold text-xs hover:bg-slate-200"
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
