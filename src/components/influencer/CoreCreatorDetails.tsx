import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Category, InfluencerProfile } from '../../types';
import { 
  User, 
  Camera, 
  UploadCloud, 
  Trash2, 
  Save, 
  RotateCcw, 
  Sparkles, 
  Share2, 
  Globe, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Briefcase, 
  ExternalLink, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  X, 
  Plus, 
  Loader2, 
  Check, 
  Info,
  Layers,
  Link as LinkIcon,
  HelpCircle,
  Award,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

const CATEGORIES: Category[] = [
  'Gaming',
  'Music',
  'Fashion & Beauty',
  'Fitness & Health',
  'Tech & Coding',
  'Education & Career',
  'Comedy & Entertainment',
  'Lifestyle & Travel'
];

const POPULAR_LANGUAGES = [
  'English',
  'Hindi',
  'Punjabi',
  'Bengali',
  'Tamil',
  'Telugu',
  'Marathi',
  'Gujarati',
  'Kannada',
  'Malayalam',
  'Odia',
  'Urdu',
  'Spanish',
  'French',
  'German',
  'Arabic'
];

const COUNTRY_CODES = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+1', country: 'United States / Canada', flag: '🇺🇸' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
];

const EXPERIENCE_OPTIONS = [
  'Less than 1 year',
  '1-2 years',
  '3-5 years',
  '5-8 years',
  '8+ years'
];

interface FormErrors {
  fullName?: string;
  name?: string;
  handle?: string;
  email?: string;
  phone?: string;
  dob?: string;
  bio?: string;
  instagram?: string;
  youtube?: string;
  facebook?: string;
  twitter?: string;
  otherSocial?: string;
  avatar?: string;
}

export const CoreCreatorDetails: React.FC = () => {
  const { 
    currentInfluencer, 
    influencers, 
    updateInfluencerProfile, 
    setSelectedInfluencerId,
    setActiveView,
    navigate,
    showToast 
  } = useApp();

  // If no authenticated creator is present (fallback safety)
  if (!currentInfluencer) {
    return (
      <div className="p-8 max-w-xl mx-auto my-12 bg-white rounded-3xl border border-slate-200 text-center shadow-soft">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-900">Creator Session Required</h3>
        <p className="text-xs text-slate-500 mt-1 mb-5">
          Please sign in to your verified creator account to manage your profile details.
        </p>
        <button
          onClick={() => navigate('/auth')}
          className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-500/20"
        >
          Sign In as Creator
        </button>
      </div>
    );
  }

  // --- Form State ---
  const [fullName, setFullName] = useState(currentInfluencer.fullName || currentInfluencer.name);
  const [name, setName] = useState(currentInfluencer.name);
  const [handle, setHandle] = useState(currentInfluencer.handle);
  const [email, setEmail] = useState(currentInfluencer.email || 'creator@bookmystar.in');
  
  // Phone parsing
  const initialCountryCode = currentInfluencer.phoneCountryCode || (currentInfluencer.phone?.startsWith('+') ? currentInfluencer.phone.split(' ')[0] : '+91');
  const initialPhoneDigits = currentInfluencer.phone ? currentInfluencer.phone.replace(/^\+\d+\s*/, '') : '9820144820';
  const [phoneCountryCode, setPhoneCountryCode] = useState(initialCountryCode);
  const [phoneDigits, setPhoneDigits] = useState(initialPhoneDigits);

  const [dob, setDob] = useState(currentInfluencer.dob || '1998-05-14');
  const [gender, setGender] = useState<string>(currentInfluencer.gender || 'male');
  const [locationCity, setLocationCity] = useState(currentInfluencer.locationCity || 'Mumbai');
  const [locationState, setLocationState] = useState(currentInfluencer.locationState || 'Maharashtra');
  const [bio, setBio] = useState(currentInfluencer.bio || '');

  // Category & Experience
  const [category, setCategory] = useState<Category>(currentInfluencer.category);
  const [secondaryCategory, setSecondaryCategory] = useState<Category | ''>(currentInfluencer.secondaryCategory || '');
  const [languages, setLanguages] = useState<string[]>(currentInfluencer.languages || ['English', 'Hindi']);
  const [customLanguage, setCustomLanguage] = useState('');
  const [showLanguagesDropdown, setShowLanguagesDropdown] = useState(false);
  const [showExperienceDropdown, setShowExperienceDropdown] = useState(false);
  const [experienceYears, setExperienceYears] = useState(currentInfluencer.experienceYears || '3-5 years');

  // Social Links
  const [instagram, setInstagram] = useState(currentInfluencer.socialLinks.instagram || '');
  const [youtube, setYoutube] = useState(currentInfluencer.socialLinks.youtube || '');
  const [facebook, setFacebook] = useState(currentInfluencer.socialLinks.facebook || '');
  const [twitter, setTwitter] = useState(currentInfluencer.socialLinks.twitter || '');
  const [otherSocial, setOtherSocial] = useState(currentInfluencer.socialLinks.other || '');

  // Avatar states
  const [avatar, setAvatar] = useState(currentInfluencer.avatar);
  const [avatarPreview, setAvatarPreview] = useState(currentInfluencer.avatar);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [photoUploadSuccess, setPhotoUploadSuccess] = useState<string | null>(null);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState('');

  // Save / Action States
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessBanner, setSaveSuccessBanner] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync state if currentInfluencer changes externally
  useEffect(() => {
    setFullName(currentInfluencer.fullName || currentInfluencer.name);
    setName(currentInfluencer.name);
    setHandle(currentInfluencer.handle);
    setEmail(currentInfluencer.email || 'creator@bookmystar.in');
    setAvatar(currentInfluencer.avatar);
    setAvatarPreview(currentInfluencer.avatar);
    setCategory(currentInfluencer.category);
    setSecondaryCategory(currentInfluencer.secondaryCategory || '');
    setDob(currentInfluencer.dob || '1998-05-14');
    setGender(currentInfluencer.gender || 'male');
    setLocationCity(currentInfluencer.locationCity || 'Mumbai');
    setLocationState(currentInfluencer.locationState || 'Maharashtra');
    setBio(currentInfluencer.bio || '');
    setLanguages(currentInfluencer.languages || ['English', 'Hindi']);
    setExperienceYears(currentInfluencer.experienceYears || '3-5 years');
    setInstagram(currentInfluencer.socialLinks.instagram || '');
    setYoutube(currentInfluencer.socialLinks.youtube || '');
    setFacebook(currentInfluencer.socialLinks.facebook || '');
    setTwitter(currentInfluencer.socialLinks.twitter || '');
    setOtherSocial(currentInfluencer.socialLinks.other || '');
  }, [currentInfluencer.id]);

  // --- Calculate Age from DOB ---
  const calculatedAge = useMemo(() => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }, [dob]);

  // --- Duplicate Handle Check ---
  const handleAvailability = useMemo(() => {
    const formatted = handle.trim().startsWith('@') ? handle.trim() : `@${handle.trim()}`;
    if (!formatted || formatted === '@') return { checked: false, available: false, message: 'Username is required' };
    
    // Check if format is valid: alphanumeric + underscores
    const cleanNoAt = formatted.replace(/^@/, '');
    if (!/^[a-zA-Z0-9_]{3,30}$/.test(cleanNoAt)) {
      return { 
        checked: true, 
        available: false, 
        message: 'Must be 3-30 characters (letters, numbers, underscores only)' 
      };
    }

    const isDuplicate = influencers.some(
      inf => inf.id !== currentInfluencer.id && inf.handle.toLowerCase() === formatted.toLowerCase()
    );

    if (isDuplicate) {
      return { checked: true, available: false, message: 'This username is already taken by another creator' };
    }
    return { checked: true, available: true, message: 'Username is available' };
  }, [handle, influencers, currentInfluencer.id]);

  // --- Calculate Profile Completion Rate ---
  const completionStats = useMemo(() => {
    const items = [
      { id: 'avatar', label: 'Profile Photo', weight: 10, complete: !!avatar && !avatar.includes('ui-avatars') },
      { id: 'fullName', label: 'Full Legal Name', weight: 10, complete: !!fullName.trim() },
      { id: 'name', label: 'Display Name', weight: 10, complete: !!name.trim() },
      { id: 'handle', label: 'Unique Username', weight: 10, complete: !!handle.trim() && handleAvailability.available },
      { id: 'email', label: 'Professional Email', weight: 10, complete: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) },
      { id: 'phone', label: 'Mobile Phone', weight: 10, complete: phoneDigits.replace(/\D/g, '').length >= 7 },
      { id: 'dob', label: 'Date of Birth (18+)', weight: 10, complete: !!dob && calculatedAge >= 18 },
      { id: 'location', label: 'City & State', weight: 10, complete: !!locationCity.trim() && !!locationState.trim() },
      { id: 'bio', label: 'Professional Bio', weight: 10, complete: bio.trim().length >= 30 },
      { id: 'category', label: 'Primary Category', weight: 5, complete: !!category },
      { id: 'languages', label: 'Languages Spoken', weight: 5, complete: languages.length > 0 },
    ];

    const totalWeight = items.reduce((sum, i) => sum + i.weight, 0);
    const completedWeight = items.filter(i => i.complete).reduce((sum, i) => sum + i.weight, 0);
    const percentage = Math.round((completedWeight / totalWeight) * 100);

    const missingItems = items.filter(i => !i.complete);

    return { percentage, items, missingItems };
  }, [
    avatar, fullName, name, handle, handleAvailability.available, 
    email, phoneDigits, dob, calculatedAge, locationCity, locationState, 
    bio, category, languages
  ]);

  // --- Check Dirty State (Has Unsaved Changes) ---
  const isDirty = useMemo(() => {
    const currentPhone = `${phoneCountryCode} ${phoneDigits.trim()}`;
    return (
      fullName !== (currentInfluencer.fullName || currentInfluencer.name) ||
      name !== currentInfluencer.name ||
      handle !== currentInfluencer.handle ||
      email !== (currentInfluencer.email || 'creator@bookmystar.in') ||
      currentPhone !== (currentInfluencer.phone || '+91 98201 44820') ||
      dob !== (currentInfluencer.dob || '1998-05-14') ||
      gender !== (currentInfluencer.gender || 'male') ||
      locationCity !== (currentInfluencer.locationCity || 'Mumbai') ||
      locationState !== (currentInfluencer.locationState || 'Maharashtra') ||
      bio !== currentInfluencer.bio ||
      category !== currentInfluencer.category ||
      secondaryCategory !== (currentInfluencer.secondaryCategory || '') ||
      JSON.stringify(languages) !== JSON.stringify(currentInfluencer.languages || ['English', 'Hindi']) ||
      experienceYears !== (currentInfluencer.experienceYears || '3-5 years') ||
      avatar !== currentInfluencer.avatar ||
      instagram !== (currentInfluencer.socialLinks.instagram || '') ||
      youtube !== (currentInfluencer.socialLinks.youtube || '') ||
      facebook !== (currentInfluencer.socialLinks.facebook || '') ||
      twitter !== (currentInfluencer.socialLinks.twitter || '') ||
      otherSocial !== (currentInfluencer.socialLinks.other || '')
    );
  }, [
    fullName, name, handle, email, phoneCountryCode, phoneDigits,
    dob, gender, locationCity, locationState, bio, category, secondaryCategory,
    languages, experienceYears, avatar, instagram, youtube, facebook, twitter,
    otherSocial, currentInfluencer
  ]);

  // --- Validation Helpers ---
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      newErrors.fullName = 'Full legal name is required (min 2 characters).';
    }

    if (!name.trim()) {
      newErrors.name = 'Display / Creator name is required.';
    }

    if (!handle.trim()) {
      newErrors.handle = 'Username is required.';
    } else if (!handleAvailability.available) {
      newErrors.handle = handleAvailability.message;
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address (e.g. name@domain.com).';
    }

    const cleanDigits = phoneDigits.replace(/\D/g, '');
    if (!cleanDigits) {
      newErrors.phone = 'Mobile number is required.';
    } else if (cleanDigits.length < 7 || cleanDigits.length > 15) {
      newErrors.phone = 'Please enter a valid mobile number (7-15 digits).';
    }

    if (!dob) {
      newErrors.dob = 'Date of birth is required.';
    } else if (calculatedAge < 18) {
      newErrors.dob = 'You must be at least 18 years old to offer bookings on BookMyStar.';
    }

    if (!bio.trim()) {
      newErrors.bio = 'Professional bio is required.';
    } else if (bio.trim().length < 20) {
      newErrors.bio = 'Bio should be at least 20 characters to give fans clear context.';
    }

    // URL Validation helpers
    const urlPattern = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z0-9().%-_+~#?&//=]+$/;
    
    if (instagram.trim() && !instagram.toLowerCase().includes('instagram.com')) {
      newErrors.instagram = 'Must be a valid Instagram URL (e.g. https://instagram.com/handle)';
    }

    if (youtube.trim() && !youtube.toLowerCase().includes('youtube.com') && !youtube.toLowerCase().includes('youtu.be')) {
      newErrors.youtube = 'Must be a valid YouTube URL (e.g. https://youtube.com/@channel)';
    }

    if (facebook.trim() && !facebook.toLowerCase().includes('facebook.com') && !facebook.toLowerCase().includes('fb.com')) {
      newErrors.facebook = 'Must be a valid Facebook URL (e.g. https://facebook.com/page)';
    }

    if (twitter.trim() && !twitter.toLowerCase().includes('twitter.com') && !twitter.toLowerCase().includes('x.com')) {
      newErrors.twitter = 'Must be a valid X/Twitter URL (e.g. https://x.com/handle)';
    }

    if (otherSocial.trim() && !urlPattern.test(otherSocial.trim())) {
      newErrors.otherSocial = 'Please enter a valid URL (e.g. https://yourportfolio.com)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- Image Upload Handlers ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset errors & status
    setErrors(prev => ({ ...prev, avatar: undefined }));
    setPhotoUploadSuccess(null);

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, avatar: 'Unsupported format. Please upload JPG, PNG, or WEBP only.' }));
      return;
    }

    // Validate size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrors(prev => ({ ...prev, avatar: 'File size exceeds 5MB limit. Please choose a smaller image.' }));
      return;
    }

    // Simulate progress
    setIsUploadingPhoto(true);
    setUploadProgress(15);

    const reader = new FileReader();
    reader.onprogress = (pe) => {
      if (pe.lengthComputable) {
        const percent = Math.round((pe.loaded / pe.total) * 90);
        setUploadProgress(percent);
      }
    };

    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setTimeout(() => {
        setUploadProgress(100);
        setTimeout(() => {
          setAvatar(dataUrl);
          setAvatarPreview(dataUrl);
          setIsUploadingPhoto(false);
          setPhotoUploadSuccess('Photo uploaded successfully! Save changes to apply.');
          setTimeout(() => setPhotoUploadSuccess(null), 4000);
        }, 300);
      }, 350);
    };

    reader.onerror = () => {
      setIsUploadingPhoto(false);
      setErrors(prev => ({ ...prev, avatar: 'Failed to read image file. Please try again.' }));
    };

    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    // Generate initials avatar fallback
    const initials = (name || 'Creator').substring(0, 2).toUpperCase();
    const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=f97316&color=ffffff&bold=true&size=300`;
    setAvatar(fallbackUrl);
    setAvatarPreview(fallbackUrl);
    setPhotoUploadSuccess('Profile photo removed. Default initials avatar applied.');
    setTimeout(() => setPhotoUploadSuccess(null), 3000);
  };

  const handleApplyCustomUrl = () => {
    if (!customUrlInput.trim()) return;
    setAvatar(customUrlInput.trim());
    setAvatarPreview(customUrlInput.trim());
    setShowUrlModal(false);
    setCustomUrlInput('');
    setPhotoUploadSuccess('Image URL updated! Save changes to publish.');
    setTimeout(() => setPhotoUploadSuccess(null), 3000);
  };

  // --- Language Tags Handlers ---
  const handleToggleLanguage = (lang: string) => {
    if (languages.includes(lang)) {
      if (languages.length === 1) {
        showToast('At least one spoken language must be selected.');
        return;
      }
      setLanguages(prev => prev.filter(l => l !== lang));
    } else {
      setLanguages(prev => [...prev, lang]);
    }
  };

  const handleAddCustomLanguage = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = customLanguage.trim();
    if (!clean) return;
    if (languages.some(l => l.toLowerCase() === clean.toLowerCase())) {
      setCustomLanguage('');
      return;
    }
    setLanguages(prev => [...prev, clean]);
    setCustomLanguage('');
  };

  // --- Reset Changes ---
  const handleReset = () => {
    setFullName(currentInfluencer.fullName || currentInfluencer.name);
    setName(currentInfluencer.name);
    setHandle(currentInfluencer.handle);
    setEmail(currentInfluencer.email || 'creator@bookmystar.in');
    setPhoneCountryCode(initialCountryCode);
    setPhoneDigits(initialPhoneDigits);
    setDob(currentInfluencer.dob || '1998-05-14');
    setGender(currentInfluencer.gender || 'male');
    setLocationCity(currentInfluencer.locationCity || 'Mumbai');
    setLocationState(currentInfluencer.locationState || 'Maharashtra');
    setBio(currentInfluencer.bio || '');
    setCategory(currentInfluencer.category);
    setSecondaryCategory(currentInfluencer.secondaryCategory || '');
    setLanguages(currentInfluencer.languages || ['English', 'Hindi']);
    setExperienceYears(currentInfluencer.experienceYears || '3-5 years');
    setAvatar(currentInfluencer.avatar);
    setAvatarPreview(currentInfluencer.avatar);
    setInstagram(currentInfluencer.socialLinks.instagram || '');
    setYoutube(currentInfluencer.socialLinks.youtube || '');
    setFacebook(currentInfluencer.socialLinks.facebook || '');
    setTwitter(currentInfluencer.socialLinks.twitter || '');
    setOtherSocial(currentInfluencer.socialLinks.other || '');
    setErrors({});
    showToast('Changes discarded.');
  };

  // --- Save Changes ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('Please fix the highlighted errors before saving.');
      return;
    }

    setIsSaving(true);

    // Format handle with leading @
    const formattedHandle = handle.trim().startsWith('@') ? handle.trim() : `@${handle.trim()}`;
    const fullPhone = `${phoneCountryCode} ${phoneDigits.trim()}`;

    // Normalize social URLs (ensure https://)
    const normalizeUrl = (url: string) => {
      if (!url.trim()) return '';
      let clean = url.trim();
      if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
        clean = `https://${clean}`;
      }
      return clean;
    };

    const updates: Partial<InfluencerProfile> = {
      fullName: fullName.trim(),
      name: name.trim(),
      handle: formattedHandle,
      email: email.trim(),
      phone: fullPhone,
      phoneCountryCode,
      dob,
      age: calculatedAge,
      gender: gender as any,
      locationCity: locationCity.trim(),
      locationState: locationState.trim(),
      bio: bio.trim(),
      category,
      secondaryCategory: secondaryCategory || undefined,
      languages,
      experienceYears,
      avatar,
      socialLinks: {
        ...currentInfluencer.socialLinks,
        instagram: normalizeUrl(instagram),
        youtube: normalizeUrl(youtube),
        facebook: normalizeUrl(facebook),
        twitter: normalizeUrl(twitter),
        other: normalizeUrl(otherSocial),
      }
    };

    // Realistic API delay
    await new Promise(resolve => setTimeout(resolve, 600));

    updateInfluencerProfile(currentInfluencer.id, updates);
    setIsSaving(false);
    setSaveSuccessBanner(true);
    setTimeout(() => setSaveSuccessBanner(false), 5000);
  };

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto font-sans">
      
      {/* 1. Page Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200/80 text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-brand-500 fill-brand-500" />
              <span>Creator Identity & SaaS Settings</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Core Creator Details
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
              Manage your public creator identity, category expertise, and professional contact information. 
              Verified details appear directly on the BookMyStar discovery marketplace.
            </p>
          </div>

          {/* Profile Completion Indicator Pill & Header Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 shrink-0">
            {/* Completion Meter */}
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-12 h-12 transform -rotate-90">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="#e2e8f0"
                    strokeWidth="3.5"
                    fill="transparent"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="url(#gradientProgress)"
                    strokeWidth="3.5"
                    strokeDasharray={2 * Math.PI * 20}
                    strokeDashoffset={2 * Math.PI * 20 * (1 - completionStats.percentage / 100)}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-700 ease-out"
                  />
                  <defs>
                    <linearGradient id="gradientProgress" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="absolute text-[11px] font-extrabold text-slate-900">
                  {completionStats.percentage}%
                </span>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span>Profile Strength</span>
                  {completionStats.percentage >= 85 ? (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Excellent
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      Good
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {completionStats.missingItems.length === 0 
                    ? 'All details complete' 
                    : `${completionStats.missingItems.length} recommendations remaining`}
                </p>
              </div>
            </div>

            {/* Quick Public Preview Button */}
            <div className="border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-4 flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  setSelectedInfluencerId(currentInfluencer.id);
                  setActiveView('influencer-detail');
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-all shadow-xs"
              >
                <Eye className="w-3.5 h-3.5 text-navy-600" />
                <span>View Fan Page</span>
              </button>
            </div>

          </div>

        </div>

        {/* Success Alert Banner */}
        {saveSuccessBanner && (
          <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200/90 text-emerald-800 flex items-start sm:items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/20">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-emerald-900">Profile Changes Saved to BookMyStar Cloud</h4>
                <p className="text-[11px] text-emerald-700">
                  Your public creator identity, categories, and social media handles are live and active.
                </p>
              </div>
            </div>
            <button
              onClick={() => setSaveSuccessBanner(false)}
              className="p-1 rounded-lg hover:bg-emerald-100 text-emerald-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* 2. Main Content Grid: Left Preview & Summary + Right Form Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ================= LEFT SECTION (4 cols): Photo, Live Summary, Tips ================= */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          
          {/* A. Profile Photo Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-brand-500" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Creator Profile Photo
                </h3>
              </div>
              <span className="text-[10px] font-semibold text-slate-400">Public Avatar</span>
            </div>

            {/* Avatar Preview Display */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative group">
                <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-3xl overflow-hidden bg-slate-100 border-4 border-white shadow-soft-lg ring-1 ring-slate-200/80 transition-transform group-hover:scale-[1.02] relative">
                  <img
                    src={avatarPreview}
                    alt={name}
                    className="w-full h-full object-cover"
                    onError={() => {
                      setAvatarPreview(`https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Star')}&background=f97316&color=ffffff&bold=true&size=300`);
                    }}
                  />

                  {/* Upload Overlay on Hover */}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-slate-950/50 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer p-2"
                  >
                    <Camera className="w-6 h-6 mb-1 text-white" />
                    <span className="text-[11px] font-bold">Change Photo</span>
                    <span className="text-[9px] text-slate-200">JPG, PNG, WEBP</span>
                  </div>
                </div>

                {/* Verified Creator Badge on avatar corner */}
                {currentInfluencer.isVerified && (
                  <div 
                    className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-gradient-to-tr from-navy-600 to-navy-500 text-white flex items-center justify-center shadow-md ring-2 ring-white"
                    title="Verified Creator Badge"
                  >
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Upload Progress Bar */}
              {isUploadingPhoto && (
                <div className="w-full space-y-1.5 animate-fadeIn">
                  <div className="flex justify-between text-[10px] font-bold text-slate-600">
                    <span>Processing Image...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-brand-500 to-navy-500 rounded-full transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Photo Feedback / Error Message */}
              {photoUploadSuccess && (
                <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 animate-fadeIn">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{photoUploadSuccess}</span>
                </p>
              )}
              {errors.avatar && (
                <p className="text-[11px] font-semibold text-rose-600 flex items-center gap-1 animate-fadeIn text-left">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.avatar}</span>
                </p>
              )}

              {/* Action Buttons: Upload & Remove */}
              <div className="flex flex-wrap items-center justify-center gap-2 w-full pt-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingPhoto}
                  className="flex-1 min-w-[120px] inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 text-xs font-bold transition-colors cursor-pointer"
                >
                  <UploadCloud className="w-3.5 h-3.5 text-brand-600" />
                  <span>Upload File</span>
                </button>

                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  disabled={isUploadingPhoto}
                  className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 border border-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                  title="Remove photo & use initials"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>

              {/* CDN URL Modal Trigger */}
              <button
                type="button"
                onClick={() => setShowUrlModal(true)}
                className="text-[11px] font-semibold text-navy-600 hover:text-navy-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <LinkIcon className="w-3 h-3" />
                <span>Or use direct image URL</span>
              </button>

              <div className="pt-2 border-t border-slate-100 w-full text-center">
                <span className="text-[10px] text-slate-400 font-medium">
                  Supported formats: JPG, PNG, WEBP (Max 5MB)
                </span>
              </div>
            </div>
          </div>

          {/* B. Live Public Profile Summary Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Live Public Preview
                </h3>
              </div>
              <span className="text-[10px] font-bold text-brand-600 uppercase bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200/60">
                Fans See This
              </span>
            </div>

            {/* Simulated Marketplace Creator Card */}
            <div className="rounded-2xl border border-slate-200/90 overflow-hidden bg-slate-50/60 shadow-xs">
              
              {/* Card Banner */}
              <div className="h-16 bg-gradient-to-r from-slate-900 via-slate-800 to-brand-900 relative">
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full text-white text-[10px] font-semibold">
                  <span>★ {currentInfluencer.rating.toFixed(1)}</span>
                  <span className="text-slate-300">({currentInfluencer.reviewCount})</span>
                </div>
              </div>

              {/* Profile Details Container */}
              <div className="p-4 pt-0 relative space-y-3">
                
                {/* Floating Avatar */}
                <div className="flex items-end justify-between -mt-8 mb-2">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-white">
                    <img 
                      src={avatarPreview} 
                      alt={name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  
                  {/* Category Pill */}
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-brand-500 text-white shadow-xs">
                    {category}
                  </span>
                </div>

                {/* Identity */}
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="text-sm font-extrabold text-slate-900 leading-tight">
                      {name || 'Creator Name'}
                    </h4>
                    {currentInfluencer.isVerified && (
                      <span className="text-navy-600" title="Verified Creator">
                        <CheckCircle2 className="w-3.5 h-3.5 fill-navy-600 text-white" />
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] font-bold text-brand-600">
                    {handle || '@username'}
                  </p>
                </div>

                {/* Meta details */}
                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-600 font-medium pt-1 border-t border-slate-200/60">
                  <div className="flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{locationCity || 'City'}, {locationState || 'State'}</span>
                  </div>
                  <div className="flex items-center gap-1 truncate">
                    <Briefcase className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{experienceYears}</span>
                  </div>
                </div>

                {/* Bio Snippet */}
                <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed bg-white p-2.5 rounded-xl border border-slate-200/70">
                  {bio || 'Your public introduction will display here to prospective fans.'}
                </p>

                {/* Spoken Languages */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {languages.slice(0, 3).map(lang => (
                    <span key={lang} className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-slate-200/70 text-slate-700">
                      {lang}
                    </span>
                  ))}
                  {languages.length > 3 && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-slate-200/70 text-slate-500">
                      +{languages.length - 3} more
                    </span>
                  )}
                </div>

                {/* Social Icons Bar in Preview */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60 text-slate-400">
                  <span className="text-[10px] font-semibold text-slate-500">Channels:</span>
                  {instagram && <span className="text-pink-600 text-xs font-bold">IG</span>}
                  {youtube && <span className="text-red-600 text-xs font-bold">YT</span>}
                  {facebook && <span className="text-blue-600 text-xs font-bold">FB</span>}
                  {twitter && <span className="text-slate-900 text-xs font-bold">X</span>}
                  {otherSocial && <span className="text-indigo-600 text-xs font-bold">Web</span>}
                  {!instagram && !youtube && !facebook && !twitter && !otherSocial && (
                    <span className="text-[10px] italic text-slate-400">No social links added yet</span>
                  )}
                </div>

              </div>

            </div>
          </div>

          {/* C. Pro Optimization Tips */}
          <div className="bg-gradient-to-br from-navy-50/70 via-slate-50 to-brand-50/50 rounded-3xl p-5 border border-navy-100 shadow-soft space-y-3">
            <div className="flex items-center gap-2 text-navy-800">
              <Award className="w-4 h-4 text-navy-600" />
              <h4 className="text-xs font-bold uppercase tracking-wider">Creator Economy Insights</h4>
            </div>
            <ul className="text-[11px] text-slate-600 space-y-2">
              <li className="flex items-start gap-1.5">
                <span className="text-brand-500 font-bold">•</span>
                <span>Profiles with a verified profile picture receive <strong>3.4x</strong> more call bookings.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-navy-600 font-bold">•</span>
                <span>Listing 2 or more spoken languages helps reach regional fans seeking 1-on-1 mentorship.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Connecting your YouTube or Instagram provides social proof during fan discovery.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* ================= RIGHT SECTION (8 cols): Complete Form Cards ================= */}
        <div className="lg:col-span-8 space-y-6">
          <form onSubmit={handleSave} className="space-y-6">
            
            {/* CARD 1: Basic Information */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-200/60">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                      1. Basic Creator Information
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Essential identity credentials shown on BookMyStar marketplace and receipts.
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-slate-400">
                  <span className="text-rose-500">*</span> Required
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* Full Legal Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    Full Legal Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => {
                      setFullName(e.target.value);
                      if (errors.fullName) setErrors(prev => ({ ...prev, fullName: undefined }));
                    }}
                    placeholder="e.g. Vikram Singh Rajput"
                    className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 border text-xs font-medium text-slate-900 transition-all focus:outline-none focus:bg-white ${
                      errors.fullName 
                        ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10' 
                        : 'border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10'
                    }`}
                  />
                  {errors.fullName ? (
                    <p className="text-[10px] font-semibold text-rose-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.fullName}</span>
                    </p>
                  ) : (
                    <p className="text-[10px] text-slate-400">
                      Required for KYC verification and payout tax receipts.
                    </p>
                  )}
                </div>

                {/* Display Name / Creator Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    Display Name / Creator Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => {
                      setName(e.target.value);
                      if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                    }}
                    placeholder="e.g. Vikram 'Vortex' Rajput"
                    className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 border text-xs font-medium text-slate-900 transition-all focus:outline-none focus:bg-white ${
                      errors.name 
                        ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10' 
                        : 'border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10'
                    }`}
                  />
                  {errors.name ? (
                    <p className="text-[10px] font-semibold text-rose-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.name}</span>
                    </p>
                  ) : (
                    <p className="text-[10px] text-slate-400">
                      The public stage name fans see on explore lists & call screens.
                    </p>
                  )}
                </div>

                {/* Username / Unique Handle */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    Username / Handle <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400 select-none">
                      @
                    </span>
                    <input
                      type="text"
                      value={handle.replace(/^@/, '')}
                      onChange={e => {
                        const val = e.target.value.replace(/[^a-zA-Z0-9_]/g, '');
                        setHandle(`@${val}`);
                        if (errors.handle) setErrors(prev => ({ ...prev, handle: undefined }));
                      }}
                      placeholder="vortex_esports"
                      className={`w-full pl-8 pr-9 py-2.5 rounded-xl bg-slate-50 border text-xs font-bold transition-all focus:outline-none focus:bg-white ${
                        errors.handle || !handleAvailability.available
                          ? 'border-rose-400 text-rose-700 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10' 
                          : 'border-slate-200 text-brand-600 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10'
                      }`}
                    />
                    <div className="absolute right-3 top-2.5">
                      {handleAvailability.available ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-500" />
                      )}
                    </div>
                  </div>
                  {errors.handle ? (
                    <p className="text-[10px] font-semibold text-rose-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.handle}</span>
                    </p>
                  ) : handleAvailability.available ? (
                    <p className="text-[10px] font-medium text-emerald-600 flex items-center gap-1">
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>{handleAvailability.message}</span>
                    </p>
                  ) : (
                    <p className="text-[10px] font-semibold text-rose-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{handleAvailability.message}</span>
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                      }}
                      placeholder="vikram.vortex@esportsmail.com"
                      className={`w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border text-xs font-medium text-slate-900 transition-all focus:outline-none focus:bg-white ${
                        errors.email 
                          ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10' 
                          : 'border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10'
                      }`}
                    />
                  </div>
                  {errors.email ? (
                    <p className="text-[10px] font-semibold text-rose-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.email}</span>
                    </p>
                  ) : (
                    <p className="text-[10px] text-slate-400">
                      Receives call reminders and payout notifications.
                    </p>
                  )}
                </div>

                {/* Mobile Number with Country Code */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={phoneCountryCode}
                      onChange={e => setPhoneCountryCode(e.target.value)}
                      className="w-28 shrink-0 px-2.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white transition-all"
                    >
                      {COUNTRY_CODES.map(c => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code}
                        </option>
                      ))}
                    </select>

                    <div className="relative flex-1">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                      <input
                        type="tel"
                        value={phoneDigits}
                        onChange={e => {
                          setPhoneDigits(e.target.value);
                          if (errors.phone) setErrors(prev => ({ ...prev, phone: undefined }));
                        }}
                        placeholder="98201 44820"
                        className={`w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border text-xs font-medium text-slate-900 transition-all focus:outline-none focus:bg-white ${
                          errors.phone 
                            ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10' 
                            : 'border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10'
                        }`}
                      />
                    </div>
                  </div>
                  {errors.phone ? (
                    <p className="text-[10px] font-semibold text-rose-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.phone}</span>
                    </p>
                  ) : (
                    <p className="text-[10px] text-slate-400">
                      Used for SMS 1-on-1 session alerts and OTP logins.
                    </p>
                  )}
                </div>

                {/* Date of Birth & 18+ Age Indicator */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-800">
                      Date of Birth <span className="text-rose-500">*</span>
                    </label>
                    {calculatedAge > 0 && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        calculatedAge >= 18 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {calculatedAge} Years Old ({calculatedAge >= 18 ? 'Eligible' : 'Underage'})
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                    <input
                      type="date"
                      value={dob}
                      max={new Date().toISOString().split('T')[0]}
                      onChange={e => {
                        setDob(e.target.value);
                        if (errors.dob) setErrors(prev => ({ ...prev, dob: undefined }));
                      }}
                      className={`w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border text-xs font-medium text-slate-900 transition-all focus:outline-none focus:bg-white ${
                        errors.dob 
                          ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10' 
                          : 'border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10'
                      }`}
                    />
                  </div>
                  {errors.dob ? (
                    <p className="text-[10px] font-semibold text-rose-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.dob}</span>
                    </p>
                  ) : (
                    <p className="text-[10px] text-slate-400">
                      Platform requires creators to be 18+ to accept bookings.
                    </p>
                  )}
                </div>

                {/* Gender (Optional) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    Gender <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white transition-all"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="non-binary">Non-Binary</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                  <p className="text-[10px] text-slate-400">
                    Used for platform diversity insights and matching filters.
                  </p>
                </div>

                {/* Location: City & State */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    Location (City & State)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={locationCity}
                        onChange={e => setLocationCity(e.target.value)}
                        placeholder="City (e.g. Mumbai)"
                        className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-all"
                      />
                    </div>
                    <input
                      type="text"
                      value={locationState}
                      onChange={e => setLocationState(e.target.value)}
                      placeholder="State (e.g. Maharashtra)"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-all"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Helps fans find local creators for regional time zones.
                  </p>
                </div>

              </div>

              {/* Professional Bio */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800">
                    Short Professional Bio <span className="text-rose-500">*</span>
                  </label>
                  <span className={`text-[10px] font-bold ${
                    bio.length > 500 ? 'text-rose-500' : 'text-slate-400'
                  }`}>
                    {bio.length} / 500 characters
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={e => {
                    setBio(e.target.value);
                    if (errors.bio) setErrors(prev => ({ ...prev, bio: undefined }));
                  }}
                  placeholder="Introduce yourself to fans, highlight your achievements, and describe what valuable takeaways they will get from your 1-on-1 audio/video calls..."
                  className={`w-full p-4 rounded-xl bg-slate-50 border text-xs font-medium text-slate-900 leading-relaxed transition-all focus:outline-none focus:bg-white ${
                    errors.bio 
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10' 
                      : 'border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10'
                  }`}
                />
                {errors.bio ? (
                  <p className="text-[10px] font-semibold text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.bio}</span>
                  </p>
                ) : (
                  <p className="text-[10px] text-slate-400">
                    Tip: State your niche, credibility, and what topics you cover during consultations.
                  </p>
                )}
              </div>

            </div>

            {/* CARD 2: Creator Category & Expertise */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-navy-50 text-navy-600 flex items-center justify-center border border-navy-200/60">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                      2. Creator Category & Languages
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Determine where your profile ranks in search catalogs and fan filters.
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-slate-400">Niche Targeting</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* Primary Category */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    Primary Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as Category)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-all"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <p className="text-[10px] text-slate-400">
                    Your core discipline shown as your primary tag across BookMyStar.
                  </p>
                </div>

                {/* Secondary Category (Optional) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    Secondary Category <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <select
                    value={secondaryCategory}
                    onChange={e => setSecondaryCategory(e.target.value as Category | '')}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white transition-all"
                  >
                    <option value="">None / Single Category</option>
                    {CATEGORIES.filter(c => c !== category).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <p className="text-[10px] text-slate-400">
                    Cross-list your profile under a relevant complementary category.
                  </p>
                </div>

              </div>

              {/* Professional Experience (Collapsible Dropdown Effect) */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowExperienceDropdown(!showExperienceDropdown)}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/90 border border-slate-200/90 transition-all text-left group shadow-xs cursor-pointer"
                  aria-expanded={showExperienceDropdown}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-navy-600 flex items-center justify-center shrink-0 shadow-xs">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-navy-600 transition-colors">
                          Professional Experience Tier
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-navy-50 text-navy-700 border border-navy-200/80">
                          {experienceYears || 'Not specified'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                        {experienceYears ? `${experienceYears} in creator & industry consulting` : 'Click to select your experience level'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-400 group-hover:text-slate-600 shrink-0 ml-2">
                    <span className="text-[11px] font-semibold hidden sm:inline">
                      {showExperienceDropdown ? 'Hide' : 'Select'}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showExperienceDropdown ? 'rotate-180 text-navy-600' : ''}`} />
                  </div>
                </button>

                {/* Dropdown Menu Content (Smoothly dropped down when active) */}
                {showExperienceDropdown && (
                  <div className="mt-3 p-4 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] text-slate-600 font-medium">
                        Select how many years of professional experience you have in this discipline:
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowExperienceDropdown(false)}
                        className="text-[10px] font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                      >
                        Hide Dropdown
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {EXPERIENCE_OPTIONS.map(exp => (
                        <button
                          key={exp}
                          type="button"
                          onClick={() => setExperienceYears(exp)}
                          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                            experienceYears === exp
                              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {exp}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Languages Spoken (Collapsible Dropdown Effect) */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowLanguagesDropdown(!showLanguagesDropdown)}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/90 border border-slate-200/90 transition-all text-left group shadow-xs cursor-pointer"
                  aria-expanded={showLanguagesDropdown}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-brand-600 flex items-center justify-center shrink-0 shadow-xs">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                          Languages Spoken for Calls
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200/80">
                          {languages.length} selected
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                        {languages.length > 0 ? languages.join(', ') : 'Click to select conversational languages'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-400 group-hover:text-slate-600 shrink-0 ml-2">
                    <span className="text-[11px] font-semibold hidden sm:inline">
                      {showLanguagesDropdown ? 'Hide' : 'Select'}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showLanguagesDropdown ? 'rotate-180 text-brand-600' : ''}`} />
                  </div>
                </button>

                {/* Dropdown Menu Content (Smoothly dropped down when active) */}
                {showLanguagesDropdown && (
                  <div className="mt-3 p-4 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] text-slate-600 font-medium">
                        Select the languages you can fluently converse in during fan calls:
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowLanguagesDropdown(false)}
                        className="text-[10px] font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                      >
                        Hide Dropdown
                      </button>
                    </div>

                    {/* Language Pills */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {POPULAR_LANGUAGES.map(lang => {
                        const isSelected = languages.includes(lang);
                        return (
                          <button
                            key={lang}
                            type="button"
                            onClick={() => handleToggleLanguage(lang)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                              isSelected
                                ? 'bg-brand-500 text-white border-brand-500 shadow-xs shadow-brand-500/25'
                                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            <span>{lang}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Custom Language Input */}
                    <div className="pt-2 flex gap-2 max-w-sm">
                      <input
                        type="text"
                        value={customLanguage}
                        onChange={e => setCustomLanguage(e.target.value)}
                        placeholder="Add other language (e.g. Telugu)..."
                        className="flex-1 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-brand-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomLanguage}
                        disabled={!customLanguage.trim()}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 disabled:opacity-40 text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* CARD 3: Social Media Channels */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200/60">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                      3. Connected Social Media Details
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Link your public channels to verify your creator reach and display on your star card.
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-slate-400">Public Links</span>
              </div>

              <div className="space-y-4">
                
                {/* Instagram */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center text-[10px] font-black">
                      IG
                    </span>
                    <span>Instagram Profile URL</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={instagram}
                      onChange={e => {
                        setInstagram(e.target.value);
                        if (errors.instagram) setErrors(prev => ({ ...prev, instagram: undefined }));
                      }}
                      placeholder="https://instagram.com/your_handle"
                      className={`flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border text-xs font-medium text-slate-900 transition-all focus:outline-none focus:bg-white ${
                        errors.instagram ? 'border-rose-400' : 'border-slate-200 focus:border-brand-500'
                      }`}
                    />
                    {instagram && (
                      <a
                        href={instagram.startsWith('http') ? instagram : `https://${instagram}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold inline-flex items-center gap-1"
                        title="Test link"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Test</span>
                      </a>
                    )}
                  </div>
                  {errors.instagram && (
                    <p className="text-[10px] font-semibold text-rose-500">{errors.instagram}</p>
                  )}
                </div>

                {/* YouTube */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-red-600 text-white flex items-center justify-center text-[10px] font-black">
                      YT
                    </span>
                    <span>YouTube Channel URL</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={youtube}
                      onChange={e => {
                        setYoutube(e.target.value);
                        if (errors.youtube) setErrors(prev => ({ ...prev, youtube: undefined }));
                      }}
                      placeholder="https://youtube.com/@channel"
                      className={`flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border text-xs font-medium text-slate-900 transition-all focus:outline-none focus:bg-white ${
                        errors.youtube ? 'border-rose-400' : 'border-slate-200 focus:border-brand-500'
                      }`}
                    />
                    {youtube && (
                      <a
                        href={youtube.startsWith('http') ? youtube : `https://${youtube}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold inline-flex items-center gap-1"
                        title="Test link"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Test</span>
                      </a>
                    )}
                  </div>
                  {errors.youtube && (
                    <p className="text-[10px] font-semibold text-rose-500">{errors.youtube}</p>
                  )}
                </div>

                {/* Facebook */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center text-[10px] font-black">
                      FB
                    </span>
                    <span>Facebook Profile or Page URL</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={facebook}
                      onChange={e => {
                        setFacebook(e.target.value);
                        if (errors.facebook) setErrors(prev => ({ ...prev, facebook: undefined }));
                      }}
                      placeholder="https://facebook.com/your_page"
                      className={`flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border text-xs font-medium text-slate-900 transition-all focus:outline-none focus:bg-white ${
                        errors.facebook ? 'border-rose-400' : 'border-slate-200 focus:border-brand-500'
                      }`}
                    />
                    {facebook && (
                      <a
                        href={facebook.startsWith('http') ? facebook : `https://${facebook}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold inline-flex items-center gap-1"
                        title="Test link"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Test</span>
                      </a>
                    )}
                  </div>
                  {errors.facebook && (
                    <p className="text-[10px] font-semibold text-rose-500">{errors.facebook}</p>
                  )}
                </div>

                {/* X (Twitter) */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-slate-900 text-white flex items-center justify-center text-[10px] font-black">
                      X
                    </span>
                    <span>X (Twitter) URL</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={twitter}
                      onChange={e => {
                        setTwitter(e.target.value);
                        if (errors.twitter) setErrors(prev => ({ ...prev, twitter: undefined }));
                      }}
                      placeholder="https://x.com/your_handle"
                      className={`flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border text-xs font-medium text-slate-900 transition-all focus:outline-none focus:bg-white ${
                        errors.twitter ? 'border-rose-400' : 'border-slate-200 focus:border-brand-500'
                      }`}
                    />
                    {twitter && (
                      <a
                        href={twitter.startsWith('http') ? twitter : `https://${twitter}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold inline-flex items-center gap-1"
                        title="Test link"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Test</span>
                      </a>
                    )}
                  </div>
                  {errors.twitter && (
                    <p className="text-[10px] font-semibold text-rose-500">{errors.twitter}</p>
                  )}
                </div>

                {/* Other Social Profile / Website */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black">
                      <Globe className="w-3 h-3" />
                    </span>
                    <span>Other Portfolio / Linktree / Twitch Profile <span className="text-slate-400 font-normal">(Optional)</span></span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={otherSocial}
                      onChange={e => {
                        setOtherSocial(e.target.value);
                        if (errors.otherSocial) setErrors(prev => ({ ...prev, otherSocial: undefined }));
                      }}
                      placeholder="https://linktr.ee/yourname or https://twitch.tv/..."
                      className={`flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border text-xs font-medium text-slate-900 transition-all focus:outline-none focus:bg-white ${
                        errors.otherSocial ? 'border-rose-400' : 'border-slate-200 focus:border-brand-500'
                      }`}
                    />
                    {otherSocial && (
                      <a
                        href={otherSocial.startsWith('http') ? otherSocial : `https://${otherSocial}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold inline-flex items-center gap-1"
                        title="Test link"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Test</span>
                      </a>
                    )}
                  </div>
                  {errors.otherSocial && (
                    <p className="text-[10px] font-semibold text-rose-500">{errors.otherSocial}</p>
                  )}
                </div>

              </div>

            </div>

            {/* Bottom Actions Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500">
                {isDirty ? (
                  <span className="text-amber-600 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                    You have unsaved creator profile changes
                  </span>
                ) : (
                  <span className="text-slate-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    All profile information is synchronized
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={!isDirty || isSaving}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 font-bold text-xs transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </button>

                <button
                  type="submit"
                  disabled={isSaving || (!isDirty && completionStats.percentage === 100)}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-7 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:bg-slate-300 text-white font-bold text-xs shadow-md shadow-brand-500/25 transition-all cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Profile...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </form>
        </div>

      </div>

      {/* Floating Sticky Save Bar (appears when user has modified fields and scrolls down) */}
      {isDirty && (
        <div className="fixed bottom-6 inset-x-4 sm:inset-x-auto sm:right-8 z-30 animate-slideDown">
          <div className="bg-slate-900/95 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center gap-4">
            <div className="hidden sm:block">
              <span className="text-xs font-bold text-slate-200 block">Unsaved Profile Changes</span>
              <span className="text-[10px] text-slate-400">Remember to save before leaving studio</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleReset}
                disabled={isSaving}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-500/30 transition-all"
              >
                {isSaving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>Save Now</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Direct CDN Image URL Modal */}
      {showUrlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Set Photo from Web URL</h3>
              <button 
                onClick={() => setShowUrlModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Paste a direct HTTPS link to an image file (e.g. Unsplash, Cloudinary, AWS S3).
            </p>
            <input
              type="text"
              value={customUrlInput}
              onChange={e => setCustomUrlInput(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowUrlModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyCustomUrl}
                disabled={!customUrlInput.trim()}
                className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-40 text-white text-xs font-bold shadow-md shadow-brand-500/20"
              >
                Apply URL
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

