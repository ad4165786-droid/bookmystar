import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Booking } from '../../types';
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Bell,
  Lock,
  CreditCard,
  CheckCircle2,
  Clock,
  Save,
  Camera,
  Sparkles,
  AlertCircle,
  ExternalLink,
  Calendar,
  Heart,
  ShieldAlert,
  KeyRound,
  Smartphone,
  Laptop,
  Download,
  Trash2,
  Search,
  Filter,
  RefreshCw,
  ChevronRight,
  FileText,
  Printer,
  Check,
  Eye,
  EyeOff,
  MapPin,
  Globe,
  Award,
  Video,
  PhoneCall,
  X
} from 'lucide-react';
import { InvoiceModal } from '../modals/InvoiceModal';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80'
];

const PRESET_BANNERS = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80'
];

export const UserProfileSettings: React.FC = () => {
  const {
    currentUser,
    updateUserProfile,
    bookings,
    influencers,
    setSelectedInfluencerId,
    navigate,
    showToast
  } = useApp();

  // If no user is logged in, show fallback
  if (!currentUser) {
    return (
      <div className="p-8 text-center text-slate-500 bg-white rounded-3xl border border-slate-200">
        <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
        <p className="font-semibold text-sm">Please sign in to view your profile settings.</p>
      </div>
    );
  }

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'personal' | 'security' | 'notifications' | 'billing' | 'favorites'>('personal');

  // Personal Information State
  const [name, setName] = useState(currentUser.name || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [avatar, setAvatar] = useState(currentUser.avatar || PRESET_AVATARS[0]);
  const [coverImage, setCoverImage] = useState(currentUser.coverImage || '');
  const [bio, setBio] = useState(currentUser.bio || 'Passionate supporter, tech enthusiast, and regular BookMyStar attendee.');
  const [city, setCity] = useState(currentUser.city || 'Mumbai');
  const [state, setState] = useState(currentUser.state || 'Maharashtra');
  const [language, setLanguage] = useState(currentUser.language || 'English');
  const [dob, setDob] = useState(currentUser.dob || '1998-05-14');
  const [gender, setGender] = useState(currentUser.gender || 'Male');
  const [upiId, setUpiId] = useState(currentUser.upiId || 'aarav.sharma@oksbi');

  // Avatar & Banner Modal State
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [customBannerUrl, setCustomBannerUrl] = useState('');

  // ESC key and body scroll lock for modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showAvatarModal) setShowAvatarModal(false);
        if (showBannerModal) setShowBannerModal(false);
      }
    };
    if (showAvatarModal || showBannerModal) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showAvatarModal, showBannerModal]);

  // Password & Security State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [twoFactor, setTwoFactor] = useState(currentUser.twoFactorEnabled ?? true);

  // Notification Preferences State
  const [notifState, setNotifState] = useState({
    whatsapp: currentUser.notificationPreferences?.whatsapp ?? true,
    sms: currentUser.notificationPreferences?.sms ?? true,
    email: currentUser.notificationPreferences?.email ?? true,
    creatorAvailability: currentUser.notificationPreferences?.creatorAvailability ?? true,
    promotional: currentUser.notificationPreferences?.promotional ?? false
  });

  // Billing / Transactions Filter & Invoice Modal
  const [searchTxn, setSearchTxn] = useState('');
  const [txnStatusFilter, setTxnStatusFilter] = useState<'all' | 'success' | 'pending' | 'refunded'>('all');
  const [selectedInvoiceBooking, setSelectedInvoiceBooking] = useState<Booking | null>(null);

  // User's bookings
  const userBookings = useMemo(() => {
    return bookings.filter(b => b.userId === currentUser.id);
  }, [bookings, currentUser.id]);

  const completedBookings = useMemo(() => {
    return userBookings.filter(b => b.bookingStatus === 'completed');
  }, [userBookings]);

  // Unique creators booked by this user
  const bookedCreators = useMemo(() => {
    const creatorIds = Array.from(new Set(userBookings.map(b => b.influencerId)));
    return influencers.filter(inf => creatorIds.includes(inf.id));
  }, [userBookings, influencers]);

  // Filtered transactions for the billing table
  const filteredTransactions = useMemo(() => {
    return userBookings.filter(t => {
      if (txnStatusFilter !== 'all' && t.paymentStatus !== txnStatusFilter) return false;
      if (searchTxn.trim()) {
        const q = searchTxn.toLowerCase();
        const matchesRef = t.bookingRef.toLowerCase().includes(q);
        const matchesCreator = t.influencerName.toLowerCase().includes(q);
        const matchesTxnId = t.transactionId.toLowerCase().includes(q);
        if (!matchesRef && !matchesCreator && !matchesTxnId) return false;
      }
      return true;
    });
  }, [userBookings, txnStatusFilter, searchTxn]);

  // Save Personal Profile
  const handleSavePersonal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Name cannot be empty.');
      return;
    }

    updateUserProfile(currentUser.id, {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      avatar,
      coverImage: coverImage.trim() || undefined,
      bio: bio.trim(),
      city: city.trim(),
      state: state.trim(),
      language,
      dob,
      gender,
      upiId: upiId.trim()
    });
  };

  // Save Security / Password
  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      showToast('Please provide your current password.');
      return;
    }
    if (newPassword.length < 8) {
      showToast('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New password and confirm password do not match.');
      return;
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast('Account password updated successfully.');
  };

  // Toggle 2FA
  const handleToggle2FA = () => {
    const nextVal = !twoFactor;
    setTwoFactor(nextVal);
    updateUserProfile(currentUser.id, { twoFactorEnabled: nextVal });
    showToast(nextVal ? 'Two-Factor Authentication (2FA) enabled.' : 'Two-Factor Authentication disabled.');
  };

  // Save Notifications
  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(currentUser.id, {
      notificationPreferences: notifState
    });
  };

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto font-sans">

      {/* 1. Header Banner & Profile Hero */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 bg-white shadow-md ring-1 ring-slate-900/5">

        {/* Cover Background Graphic */}
        <div className="h-44 sm:h-52 w-full bg-gradient-to-r from-slate-900 via-brand-950 to-brand-900 relative overflow-hidden group">
          {coverImage ? (
            <>
              <img src={coverImage} alt="Cover Banner" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-black/20" />
            </>
          ) : (
            <>
              {/* Subtle Ambient Shapes */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(249,115,22,0.22),transparent_60%)]" />
              <div className="absolute right-0 bottom-0 top-0 w-1/2 bg-[radial-gradient(ellipse_at_top_right,rgba(217,119,6,0.18),transparent_70%)]" />
              <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:32px_32px]" />
            </>
          )}

          {/* Edit Banner Button */}
          <button
            type="button"
            onClick={() => setShowBannerModal(true)}
            className="absolute top-4 left-4 sm:top-6 sm:left-6 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/60 hover:bg-slate-900/80 text-white text-xs font-bold backdrop-blur-md border border-white/20 shadow-md transition-all cursor-pointer ring-1 ring-white/10"
            title="Edit profile banner"
          >
            <Camera className="w-3.5 h-3.5 text-white/90" />
            <span>Edit Banner</span>
          </button>

          {/* Top Brand Badges */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 backdrop-blur-md text-white border border-white/20 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Escrow Protected Fan</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-brand-500/20 backdrop-blur-md text-brand-300 border border-brand-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gold Tier</span>
            </span>
          </div>
        </div>

        {/* Profile Identity Bar */}
        <div className="px-6 sm:px-8 pb-6 pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 -mt-12 sm:-mt-14 relative z-10">

            {/* Avatar & Basic Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
              <div className="relative group">
                <img
                  src={avatar}
                  alt={currentUser.name}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 ring-white shadow-xl bg-slate-100 transition-transform group-hover:scale-[1.02]"
                />
                <button
                  type="button"
                  onClick={() => setShowAvatarModal(true)}
                  className="absolute bottom-1 right-1 p-2 rounded-xl bg-slate-900/80 hover:bg-brand-600 text-white backdrop-blur-md shadow-lg transition-all cursor-pointer ring-2 ring-white"
                  title="Change profile avatar"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1.5 sm:pb-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {name || currentUser.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified Fan
                  </span>
                </div>

                <div className="flex flex-wrap sm:flex-nowrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 text-xs text-slate-500 font-medium">
                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{email || currentUser.email}</span>
                  </span>
                  <span className="hidden sm:inline text-slate-300 select-none">•</span>
                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{[city, state].filter(Boolean).join(', ') || 'Mumbai, Maharashtra'}</span>
                  </span>
                  <span className="hidden sm:inline text-slate-300 select-none">•</span>
                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      Member since {currentUser.createdAt ? (currentUser.createdAt.includes('-') ? new Date(currentUser.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : currentUser.createdAt) : 'Aug 2026'}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Summary Pill Badges */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  setSelectedInfluencerId(null);
                  navigate('/fan/dashboard');
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-extrabold text-xs shadow-md shadow-brand-500/20 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Explore Creators</span>
              </button>
            </div>

          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-100">
            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">Total Bookings</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl sm:text-2xl font-black text-slate-900">{userBookings.length}</span>
                <span className="text-[10px] font-semibold text-brand-600">Lifetime</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">Completed Sessions</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl sm:text-2xl font-black text-emerald-600">{completedBookings.length}</span>
                <span className="text-[10px] font-semibold text-slate-500">1-on-1 Calls</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">Total Invested</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl sm:text-2xl font-black text-slate-900">₹{currentUser.totalSpent.toLocaleString('en-IN')}</span>
                <span className="text-[10px] font-semibold text-slate-500">INR</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 2. Unified Settings & Navigation Section */}
      <div className="rounded-3xl bg-white border border-slate-200/90 shadow-md ring-1 ring-slate-900/5 overflow-hidden transition-all">

        {/* Integrated Navigation Tabs Header */}
        <div className="p-2 sm:p-2.5 bg-slate-50/70 border-b border-slate-200/80">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5 p-1 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">

            <button
              type="button"
              onClick={() => setActiveTab('personal')}
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${activeTab === 'personal'
                ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
            >
              <User className="w-4 h-4" />
              <span>Personal Details</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('security')}
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${activeTab === 'security'
                ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Security & Privacy</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${activeTab === 'notifications'
                ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
            >
              <Bell className="w-4 h-4" />
              <span>Notifications & Alerts</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('billing')}
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${activeTab === 'billing'
                ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Billing & Invoices</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${activeTab === 'billing' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                {userBookings.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('favorites')}
              className={`col-span-2 sm:col-span-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${activeTab === 'favorites'
                ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
            >
              <Heart className="w-4 h-4" />
              <span>Favorite Creators</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${activeTab === 'favorites' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                {bookedCreators.length}
              </span>
            </button>

          </div>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 sm:p-8">

          {/* TAB 1: Personal Details */}
          {activeTab === 'personal' && (
            <form onSubmit={handleSavePersonal} className="space-y-6">

              {/* Identity & Legal Information */}
              <div id="personal-details-section" className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Personal & Contact Information</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Used for call room identification, tax receipts, and booking notifications.</p>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                    KYC Verified
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">

                  {/* Full Name */}
                  <div>
                    <label className="block text-slate-700 font-bold mb-1.5">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        placeholder="e.g. Aarav Sharma"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/10 text-xs font-semibold transition-all"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">This name will appear on official booking invoices and tax receipts.</p>
                  </div>

                  {/* Email Address */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-slate-700 font-bold">Email Address</label>
                      <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </span>
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/10 text-xs font-semibold transition-all"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">Meeting room calendar invites will be sent to this email.</p>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-slate-700 font-bold">Phone Number</label>
                      <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> SMS Verified
                      </span>
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        required
                        placeholder="Enter phone number"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/10 text-xs font-semibold transition-all"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">Used for WhatsApp call room access links and OTP verification.</p>
                  </div>

                  {/* Default Currency */}
                  <div>
                    <label className="block text-slate-700 font-bold mb-1.5">Billing Currency</label>
                    <div className="relative">
                      <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value="Indian Rupee (₹ INR) — Domestic Banking & UPI"
                        disabled
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 text-xs font-medium cursor-not-allowed"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">Directly complies with RBI payment gateway settlement norms.</p>
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-slate-700 font-bold mb-1.5">City</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        placeholder="e.g. Mumbai, Bengaluru"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/10 text-xs font-semibold transition-all"
                      />
                    </div>
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-slate-700 font-bold mb-1.5">State</label>
                    <input
                      type="text"
                      value={state}
                      onChange={e => setState(e.target.value)}
                      placeholder="e.g. Maharashtra, Karnataka"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/10 text-xs font-semibold transition-all"
                    />
                  </div>

                  {/* Preferred Language */}
                  <div>
                    <label className="block text-slate-700 font-bold mb-1.5">Preferred Interaction Language</label>
                    <select
                      value={language}
                      onChange={e => setLanguage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/10 text-xs font-semibold transition-all"
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi (हिंदी)</option>
                      <option value="Hinglish">Hinglish</option>
                      <option value="Tamil">Tamil (தமிழ்)</option>
                      <option value="Telugu">Telugu (తెలుగు)</option>
                      <option value="Bengali">Bengali (বাংলা)</option>
                    </select>
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-slate-700 font-bold mb-1.5">Gender (Optional)</label>
                    <select
                      value={gender}
                      onChange={e => setGender(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/10 text-xs font-semibold transition-all"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>

                </div>

                {/* Bio / Fan Note */}
                <div className="text-xs">
                  <label className="block text-slate-700 font-bold mb-1.5">
                    Fan Note / Introduction (Visible to Creator when call is booked)
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    placeholder="Tell creators a little about who you are, topics you love discussing, or goals for your session..."
                    className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/10 text-xs font-medium transition-all"
                  />

                </div>

                {/* Submit Button */}
                <div className="pt-2 flex items-center justify-between">

                  <button
                    type="submit"
                    className="flex items-center gap-2 py-2.5 px-6 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-extrabold text-xs shadow-md shadow-brand-500/25 transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Profile Changes</span>
                  </button>
                </div>

              </div>

            </form>
          )}

          {/* TAB 2: Security & Privacy */}
          {activeTab === 'security' && (
            <div className="space-y-6">

              {/* Change Password */}
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600">
                      <KeyRound className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">Account Password & Credentials</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Protect your account with a high-entropy passphrase.</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400">
                    Last changed 42 days ago
                  </span>
                </div>

                <form onSubmit={handleUpdatePassword} className="space-y-4 text-xs max-w-xl">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1.5">Current Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/10 text-xs transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1.5">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="At least 8 characters with numbers & symbols"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/10 text-xs transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1.5">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/10 text-xs transition-all"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="flex items-center gap-2 py-2.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Update Password</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Active Device Sessions */}
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
                  <h3 className="text-base font-extrabold text-slate-900">Active Device Sessions</h3>
                  <button
                    type="button"
                    onClick={() => showToast('All other sessions revoked successfully.')}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700"
                  >
                    Sign Out Other Devices
                  </button>
                </div>

                <div className="space-y-3 text-xs">

                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 shadow-2xs">
                        <Laptop className="w-5 h-5 text-brand-600" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          <span>Windows 11 PC • Chrome 124</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                            Current Device
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">Mumbai, India • IP 103.21.244.18 • Active now</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                        <Smartphone className="w-5 h-5 text-slate-500" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">iPhone 15 Pro • Safari Mobile</div>
                        <p className="text-[11px] text-slate-500 mt-0.5">Mumbai, India • IP 103.21.244.20 • 3 hours ago</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => showToast('Mobile session terminated.')}
                      className="text-xs font-bold text-slate-400 hover:text-rose-600 transition-colors"
                    >
                      Revoke
                    </button>
                  </div>

                </div>
              </div>

              {/* Data Privacy & Compliance */}
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-4">
                <h3 className="text-base font-extrabold text-slate-900">Privacy, Compliance & Data Access</h3>
                <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div>
                    <div className="font-bold text-rose-900">Deactivate Fan Account</div>
                    <p className="text-[11px] text-rose-700 mt-1">Temporarily pause or permanently request deletion of your account. Ongoing bookings will be refunded via standard escrow rules.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast('Deactivation request logged. Our compliance officer will reach out.')}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 font-bold self-start sm:self-auto shrink-0 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Deactivate Account</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: Notifications & Alerts */}
          {activeTab === 'notifications' && (
            <form onSubmit={handleSaveNotifications} className="space-y-6">

              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Call Reminders & Communications</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Control how and when BookMyStar alerts you about upcoming sessions, invoices, and creators.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-xs">

                <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 cursor-pointer transition-colors">
                  <div className="pr-4">
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <span>WhatsApp Call Reminders & Live Link</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Recommended
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Receive your secure video/voice call room link directly on WhatsApp 10 minutes prior to session start.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifState.whatsapp}
                    onChange={e => setNotifState({ ...notifState, whatsapp: e.target.checked })}
                    className="w-5 h-5 accent-brand-600 rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 cursor-pointer transition-colors">
                  <div className="pr-4">
                    <div className="font-bold text-slate-900">SMS Booking Confirmations & OTPs</div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Receive instant SMS confirmation with Booking Reference code immediately upon payment clearance.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifState.sms}
                    onChange={e => setNotifState({ ...notifState, sms: e.target.checked })}
                    className="w-5 h-5 accent-brand-600 rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 cursor-pointer transition-colors">
                  <div className="pr-4">
                    <div className="font-bold text-slate-900">Email Invoices & GST Tax Receipts</div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Automatically receive downloadable PDF tax invoices and payment receipts in your inbox.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifState.email}
                    onChange={e => setNotifState({ ...notifState, email: e.target.checked })}
                    className="w-5 h-5 accent-brand-600 rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 cursor-pointer transition-colors">
                  <div className="pr-4">
                    <div className="font-bold text-slate-900">Favorite Creator Availability Drops</div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Get an instant ping when creators you have booked or follow release new session time slots.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifState.creatorAvailability}
                    onChange={e => setNotifState({ ...notifState, creatorAvailability: e.target.checked })}
                    className="w-5 h-5 accent-brand-600 rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 cursor-pointer transition-colors">
                  <div className="pr-4">
                    <div className="font-bold text-slate-900">Promotions, Creator Discounts & Platform Offers</div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Special promotional discount coupon codes and early access announcements.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifState.promotional}
                    onChange={e => setNotifState({ ...notifState, promotional: e.target.checked })}
                    className="w-5 h-5 accent-brand-600 rounded cursor-pointer"
                  />
                </label>

              </div>

              <div className="pt-4 flex items-center justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 py-2.5 px-6 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-extrabold text-xs shadow-md shadow-brand-500/25 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Notification Preferences</span>
                </button>
              </div>

            </form>
          )}

          {/* TAB 4: Billing, Escrow & Invoices */}
          {activeTab === 'billing' && (
            <div className="space-y-5">

              {/* Transactions Table & Controls */}
              <div className="space-y-5">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Payment & Escrow Transaction Ledger</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Audit log of all booking disbursements, escrow holdings, and refunds.</p>
                  </div>

                  {/* Status Tabs */}
                  <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 self-start sm:self-auto text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setTxnStatusFilter('all')}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${txnStatusFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                        }`}
                    >
                      All ({userBookings.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setTxnStatusFilter('success')}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${txnStatusFilter === 'success' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                        }`}
                    >
                      Success
                    </button>
                    <button
                      type="button"
                      onClick={() => setTxnStatusFilter('pending')}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${txnStatusFilter === 'pending' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                        }`}
                    >
                      In Escrow / Pending
                    </button>
                    <button
                      type="button"
                      onClick={() => setTxnStatusFilter('refunded')}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${txnStatusFilter === 'refunded' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                        }`}
                    >
                      Refunded
                    </button>
                  </div>
                </div>

                {/* Search Input */}
                <div className="relative max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchTxn}
                    onChange={e => setSearchTxn(e.target.value)}
                    placeholder="Search by creator name, booking ref (BMS-...), or Txn ID..."
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white text-xs font-medium transition-all"
                  />
                </div>

                {/* Table */}
                {filteredTransactions.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-400">
                    <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    No transactions found matching your criteria.
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 text-[10px] uppercase font-bold border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-4">Date & Time</th>
                          <th className="py-3 px-4">Booking Ref</th>
                          <th className="py-3 px-4">Creator</th>
                          <th className="py-3 px-4">Transaction ID</th>
                          <th className="py-3 px-4">Method</th>
                          <th className="py-3 px-4 text-right">Amount (₹)</th>
                          <th className="py-3 px-4 text-center">Status</th>
                          <th className="py-3 px-4 text-center">Tax Invoice</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
                        {filteredTransactions.map(t => (
                          <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3 px-4 text-[11px] text-slate-500 font-medium whitespace-nowrap">
                              {t.paidAt || t.scheduledDate}
                            </td>
                            <td className="py-3 px-4 font-mono text-brand-600 font-bold whitespace-nowrap">
                              {t.bookingRef}
                            </td>
                            <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                              {t.influencerName}
                            </td>
                            <td className="py-3 px-4 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                              {t.transactionId}
                            </td>
                            <td className="py-3 px-4 uppercase text-[10px] font-bold text-slate-500 whitespace-nowrap">
                              {t.paymentMethod}
                            </td>
                            <td className="py-3 px-4 text-right font-black text-slate-900 whitespace-nowrap">
                              ₹{t.amount}
                            </td>
                            <td className="py-3 px-4 text-center whitespace-nowrap">
                              {t.paymentStatus === 'success' && (
                                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 uppercase">
                                  Success
                                </span>
                              )}
                              {t.paymentStatus === 'pending' && (
                                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200/80 uppercase">
                                  In Escrow
                                </span>
                              )}
                              {t.paymentStatus === 'refunded' && (
                                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 uppercase">
                                  Refunded
                                </span>
                              )}
                              {t.paymentStatus === 'failed' && (
                                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/80 uppercase">
                                  Failed
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-center whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => setSelectedInvoiceBooking(t)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-brand-50 hover:text-brand-600 text-slate-700 text-[11px] font-bold transition-colors cursor-pointer"
                              >
                                <FileText className="w-3 h-3" />
                                <span>Invoice</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* TAB 5: Favorite & Booked Creators */}
          {activeTab === 'favorites' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Your Connected Creators</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Creators you have previously scheduled 1-on-1 sessions with. Quick-book your next interaction.</p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedInfluencerId(null);
                    navigate('/fan/dashboard');
                  }}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs self-start transition-colors"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Browse All Creators</span>
                </button>
              </div>

              {bookedCreators.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  <Sparkles className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  <p>You haven't booked any creators yet.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedInfluencerId(null);
                      navigate('/fan/dashboard');
                    }}
                    className="mt-4 px-4 py-2 rounded-xl bg-brand-500 text-white font-bold inline-block"
                  >
                    Explore Creators Now
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {bookedCreators.map(creator => (
                    <div
                      key={creator.id}
                      className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm ring-1 ring-slate-900/5 hover:border-brand-500/50 hover:shadow-md transition-all flex flex-col justify-between gap-4 group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={creator.avatar}
                            alt={creator.name}
                            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100 group-hover:ring-brand-500 transition-all"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1">
                              <h4 className="font-extrabold text-sm text-slate-900 truncate">{creator.name}</h4>
                              {creator.isVerified && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 font-mono truncate">{creator.handle}</p>
                            <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                              {creator.category}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {creator.bio}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div className="text-xs">
                          <span className="text-[10px] text-slate-400 block font-medium">Starting from</span>
                          <span className="font-black text-slate-900 text-sm">₹{creator.rates.voice10} <span className="text-[10px] text-slate-500 font-normal">/ 10m</span></span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedInfluencerId(creator.id);
                            navigate(`/fan/creators/${creator.id}`);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-50 text-brand-600 hover:bg-brand-500 hover:text-white font-extrabold text-xs transition-colors cursor-pointer"
                        >
                          <span>Book Again</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* 4. Avatar Selection Modal */}
      {showAvatarModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAvatarModal(false);
          }}
        >
          <div className="relative w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">Choose Profile Avatar</h3>
              <button
                type="button"
                onClick={() => setShowAvatarModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Preset Avatars</label>
              <div className="grid grid-cols-3 gap-3">
                {PRESET_AVATARS.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setAvatar(url);
                      setShowAvatarModal(false);
                      showToast('Avatar selected. Click Save to persist.');
                    }}
                    className={`relative rounded-2xl overflow-hidden p-0.5 border-2 transition-all cursor-pointer ${avatar === url ? 'border-brand-500 ring-2 ring-brand-500/20' : 'border-transparent hover:border-slate-300'
                      }`}
                  >
                    <img src={url} alt={`Preset ${idx}`} className="w-full h-20 rounded-xl object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-xs">
              <label className="block font-bold text-slate-700 mb-1.5">Or Paste Custom Image URL</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={customAvatarUrl}
                  onChange={e => setCustomAvatarUrl(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-brand-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customAvatarUrl.trim()) {
                      setAvatar(customAvatarUrl.trim());
                      setShowAvatarModal(false);
                      showToast('Custom avatar applied. Click Save to persist.');
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-brand-500 text-white font-bold text-xs"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4b. Banner Customization Modal */}
      {showBannerModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowBannerModal(false);
          }}
        >
          <div className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Customize Profile Banner</h3>
                <p className="text-xs text-slate-500 mt-0.5">Select a curated banner or paste an image link.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowBannerModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-700">Curated Banners</label>
                {coverImage && (
                  <button
                    type="button"
                    onClick={() => {
                      setCoverImage('');
                      setShowBannerModal(false);
                      updateUserProfile(currentUser.id, { coverImage: undefined });
                      showToast('Banner reset to default gradient theme.');
                    }}
                    className="text-[11px] font-bold text-brand-600 hover:text-brand-700 cursor-pointer"
                  >
                    Reset to Default Gradient
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PRESET_BANNERS.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setCoverImage(url);
                      setShowBannerModal(false);
                      updateUserProfile(currentUser.id, { coverImage: url });
                      showToast('Profile banner updated.');
                    }}
                    className={`relative rounded-2xl overflow-hidden p-0.5 border-2 transition-all cursor-pointer group ${coverImage === url ? 'border-brand-500 ring-2 ring-brand-500/20' : 'border-transparent hover:border-slate-300'
                      }`}
                  >
                    <img src={url} alt={`Banner preset ${idx + 1}`} className="w-full h-20 rounded-xl object-cover group-hover:scale-105 transition-transform" />
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-xs">
              <label className="block font-bold text-slate-700 mb-1.5">Or Paste Custom Banner Image URL</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={customBannerUrl}
                  onChange={e => setCustomBannerUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/your-banner.jpg"
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-brand-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customBannerUrl.trim()) {
                      const url = customBannerUrl.trim();
                      setCoverImage(url);
                      setShowBannerModal(false);
                      updateUserProfile(currentUser.id, { coverImage: url });
                      showToast('Custom banner applied successfully.');
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs cursor-pointer shadow-sm"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Invoice Modal Popup */}
      {selectedInvoiceBooking && (
        <InvoiceModal
          booking={selectedInvoiceBooking}
          onClose={() => setSelectedInvoiceBooking(null)}
        />
      )}

    </div>
  );
};
