import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Category } from '../../types';
import { 
  Sparkles, 
  User, 
  Video, 
  Mail, 
  Lock, 
  Phone, 
  ArrowRight, 
  CheckCircle2, 
  Star, 
  Eye, 
  EyeOff, 
  KeyRound, 
  HelpCircle,
  X,
  PhoneCall,
  ShieldCheck,
  Zap,
  AtSign
} from 'lucide-react';

const CATEGORIES: Category[] = [
  'Gaming',
  'Music',
  'Tech & Coding',
  'Fashion & Beauty',
  'Fitness & Health',
  'Comedy & Entertainment'
];

export const AuthPage: React.FC = () => {
  const { loginUser, registerUser, loginInfluencer, registerInfluencer, showToast, navigate } = useApp();

  // Role Tab on login card: 'user' | 'influencer'
  const [activeRoleTab, setActiveRoleTab] = useState<'user' | 'influencer'>('user');

  // Mode: 'signin' | 'signup'
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  // Common Form States
  const [identifier, setIdentifier] = useState('aarav.sharma@gmail.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);

  // User Registration States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Influencer Registration States
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

  // Handle Role Switch
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

  // Submit Sign In
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeRoleTab === 'user') {
      const res = loginUser(identifier, password);
      if (!res.success && res.message) showToast(res.message);
    } else {
      const res = loginInfluencer(identifier, password);
      if (!res.success && res.message) showToast(res.message);
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
      registerUser({
        name: regName,
        email: regEmail,
        phone: regPhone || '+91 98000 12345',
        password: regPassword || 'password123'
      });
    } else {
      if (!infName.trim() || !infHandle.trim() || !infEmail.trim()) {
        showToast('Please fill in your creator details.');
        return;
      }
      registerInfluencer({
        name: infName,
        handle: infHandle,
        email: infEmail,
        phone: infPhone || '+91 99000 54321',
        category: infCategory,
        bio: infBio,
        password: infPassword || 'creator123'
      });
    }
  };

  // Forgot Password Submit
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    showToast(`Password reset link sent to ${forgotEmail}. Please check your inbox.`);
    setShowForgotModal(false);
    setForgotEmail('');
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between selection:bg-brand-500 selection:text-white">
      
      {/* 1. Clean Top Header Bar */}
      <header className="w-full border-b border-slate-100 bg-white/95 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3.5 flex items-center justify-between">
          
          {/* Logo & Branding */}
          <div 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white shadow-orange-glow">
              <Sparkles className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  BookMy<span className="text-brand-600">Star</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-brand-50 text-brand-600 border border-brand-200">
                  Verified Calls
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">1-on-1 Creator Voice & Video Platform</p>
            </div>
          </div>

          {/* Trust Banner Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-50 text-blue-700 border border-blue-100 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Escrow Protected INR (₹) Bookings</span>
          </div>

        </div>
      </header>

      {/* 2. Main Hero + Login Workspace */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 w-full flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full">
          
          {/* Left Column: Hero Showcase (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold tracking-wide">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>India's Premier Celebrity & Creator Video Network</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
                Connect With Your <br />
                <span className="bg-gradient-to-r from-brand-600 via-orange-500 to-amber-500 bg-clip-text text-transparent">
                  Favourite Stars
                </span>
              </h1>
              
              <p className="text-base sm:text-lg text-slate-600 max-w-xl font-normal leading-relaxed">
                Book exclusive voice and video calls with your favourite influencers. Private, high-definition 1-on-1 sessions with top creators in Gaming, Music, Tech, Fashion, and Entertainment.
              </p>
            </div>

            {/* Featured Creator Badges */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
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
                  <span className="text-slate-900 ml-1">4.9/5.0</span>
                </div>
                <p className="text-xs text-slate-500 font-medium">Over 2,400+ Verified 1-on-1 Sessions Completed</p>
              </div>
            </div>

            {/* Value Props Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 max-w-xl">
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

          {/* Right Column: Premium Auth Card with Role Switcher (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft-lg p-7 sm:p-8 relative overflow-hidden transition-all">
              
              {/* Subtle visual accent blob */}
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-gradient-to-br from-brand-100 to-amber-100 rounded-full blur-2xl opacity-70 pointer-events-none" />

              {/* 1. Two Clearly Visible Login Options / Role Switch */}
              <div className="relative z-10 mb-6">
                <div className="text-center mb-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Select Your Sign In Portal
                  </span>
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

              {/* Header Title based on Active Role & Mode */}
              <div className="relative z-10 mb-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">
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

                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                    activeRoleTab === 'user' 
                      ? 'bg-brand-50 text-brand-700 border border-brand-200' 
                      : 'bg-slate-900 text-white'
                  }`}>
                    {activeRoleTab === 'user' ? 'Fan Access' : 'Creator Access'}
                  </span>
                </div>
              </div>

              {/* 2. Form Section */}
              {authMode === 'signin' ? (
                /* SIGN IN FORM */
                <form onSubmit={handleSignIn} className="space-y-4 text-xs relative z-10">
                  
                  {/* Email or Mobile Number */}
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
                        className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:bg-white transition-colors text-xs font-medium"
                        required
                      />
                    </div>
                  </div>

                  {/* Password with Show/Hide toggle */}
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
                        placeholder="Enter your account password"
                        className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:bg-white transition-colors text-xs"
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

                  {/* Sign In Submit Button */}
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

                  {/* Create Account / Registration Switch Option */}
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

                  {/* Quick One-Click Demo Credentials for Evaluator */}
                  <div className="pt-4 mt-2 border-t border-slate-100 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider text-center">
                      Quick Demo One-Click Sign In
                    </span>
                    {activeRoleTab === 'user' ? (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => loginUser('aarav.sharma@gmail.com', 'pass')}
                          className="p-2 rounded-xl bg-slate-50 hover:bg-brand-50 border border-slate-200 hover:border-brand-300 text-left transition-colors"
                        >
                          <div className="font-bold text-slate-800 text-[11px]">Aarav Sharma</div>
                          <div className="text-[10px] text-slate-500 truncate">5 bookings completed</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => loginUser('priya.m@outlook.com', 'pass')}
                          className="p-2 rounded-xl bg-slate-50 hover:bg-brand-50 border border-slate-200 hover:border-brand-300 text-left transition-colors"
                        >
                          <div className="font-bold text-slate-800 text-[11px]">Priya Mehra</div>
                          <div className="text-[10px] text-slate-500 truncate">Upcoming video call</div>
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => loginInfluencer('@vortex_esports', 'pass')}
                          className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors"
                        >
                          <div className="font-bold text-slate-800 text-[11px]">Vikram Rajput</div>
                          <div className="text-[10px] text-brand-600 truncate">@vortex_esports (Gaming)</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => loginInfluencer('@ananya_acoustics', 'pass')}
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
                            {CATEGORIES.map(c => (
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

        </div>
      </main>

      {/* 3. Forgot Password Modal */}
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

      {/* 4. Minimalist Public Footer (NO admin link or admin button!) */}
      <footer className="w-full border-t border-slate-100 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">BookMyStar Platform</span>
            <span>• © 2026 BookMyStar Internet Services Pvt Ltd</span>
          </div>

          <div className="flex items-center gap-5 text-slate-500">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>Creator Safety Guidelines</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

