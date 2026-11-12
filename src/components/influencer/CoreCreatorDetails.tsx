import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Category, InfluencerProfile, SupportedSocialPlatform, SavedSocialLink } from '../../types';
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
  ChevronRight,
  ChevronDown,
  Video,
  Hash,
  Ghost,
  Send,
  Pin,
  Pencil
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

export interface PlatformOption {
  name: SupportedSocialPlatform;
  key: string;
  placeholder: string;
  domains: string[];
  badgeColor: string;
  bgColor: string;
  borderLight: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const SUPPORTED_PLATFORMS: PlatformOption[] = [
  {
    name: 'Instagram',
    key: 'instagram',
    placeholder: 'Paste your Instagram profile URL (e.g. https://instagram.com/username)',
    domains: ['instagram.com'],
    badgeColor: 'text-pink-600',
    bgColor: 'bg-pink-50',
    borderLight: 'border-pink-200',
    icon: Camera,
  },
  {
    name: 'Facebook',
    key: 'facebook',
    placeholder: 'Paste your Facebook profile URL (e.g. https://facebook.com/username)',
    domains: ['facebook.com', 'fb.com'],
    badgeColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderLight: 'border-blue-200',
    icon: Share2,
  },
  {
    name: 'YouTube',
    key: 'youtube',
    placeholder: 'Paste your YouTube channel URL (e.g. https://youtube.com/@channel)',
    domains: ['youtube.com', 'youtu.be'],
    badgeColor: 'text-red-600',
    bgColor: 'bg-red-50',
    borderLight: 'border-red-200',
    icon: Video,
  },
  {
    name: 'X (Twitter)',
    key: 'twitter',
    placeholder: 'Paste your X (Twitter) profile URL (e.g. https://x.com/username)',
    domains: ['x.com', 'twitter.com'],
    badgeColor: 'text-slate-900',
    bgColor: 'bg-slate-100',
    borderLight: 'border-slate-300',
    icon: Hash,
  },
  {
    name: 'LinkedIn',
    key: 'linkedin',
    placeholder: 'Paste your LinkedIn profile URL (e.g. https://linkedin.com/in/username)',
    domains: ['linkedin.com'],
    badgeColor: 'text-sky-700',
    bgColor: 'bg-sky-50',
    borderLight: 'border-sky-200',
    icon: Briefcase,
  },
  {
    name: 'Snapchat',
    key: 'snapchat',
    placeholder: 'Paste your Snapchat profile URL (e.g. https://snapchat.com/add/username)',
    domains: ['snapchat.com'],
    badgeColor: 'text-amber-500',
    bgColor: 'bg-amber-50',
    borderLight: 'border-amber-200',
    icon: Ghost,
  },
  {
    name: 'Telegram',
    key: 'telegram',
    placeholder: 'Paste your Telegram profile URL (e.g. https://t.me/username)',
    domains: ['t.me', 'telegram.me', 'telegram.org'],
    badgeColor: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    borderLight: 'border-cyan-200',
    icon: Send,
  },
  {
    name: 'Pinterest',
    key: 'pinterest',
    placeholder: 'Paste your Pinterest profile URL (e.g. https://pinterest.com/username)',
    domains: ['pinterest.com'],
    badgeColor: 'text-rose-600',
    bgColor: 'bg-rose-50',
    borderLight: 'border-rose-200',
    icon: Pin,
  },
];

export const extractInitialSocialLinks = (inf: InfluencerProfile): SavedSocialLink[] => {
  if (inf.socialLinkList && inf.socialLinkList.length > 0) {
    return inf.socialLinkList;
  }
  const list: SavedSocialLink[] = [];
  const map: Record<string, SupportedSocialPlatform> = {
    instagram: 'Instagram',
    facebook: 'Facebook',
    youtube: 'YouTube',
    twitter: 'X (Twitter)',
    linkedin: 'LinkedIn',
    snapchat: 'Snapchat',
    telegram: 'Telegram',
    pinterest: 'Pinterest',
  };

  if (inf.socialLinks) {
    Object.entries(map).forEach(([key, platformName]) => {
      const url = inf.socialLinks[key];
      if (url && url.trim()) {
        list.push({
          id: `social-${key}-${Date.now()}`,
          platform: platformName,
          url: url.trim(),
          addedAt: new Date().toISOString().split('T')[0],
        });
      }
    });
  }
  return list;
};

interface FormErrors {
  fullName?: string;
  name?: string;
  handle?: string;
  email?: string;
  phone?: string;
  dob?: string;
  bio?: string;
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

  // Dynamic Social Media Links State
  const [socialLinksList, setSocialLinksList] = useState<SavedSocialLink[]>(() => extractInitialSocialLinks(currentInfluencer));
  const [selectedPlatform, setSelectedPlatform] = useState<SupportedSocialPlatform>('Instagram');
  const [platformDropdownOpen, setPlatformDropdownOpen] = useState(false);
  const [socialUrlInput, setSocialUrlInput] = useState('');
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [socialInputError, setSocialInputError] = useState<string | null>(null);
  const [socialSuccessMessage, setSocialSuccessMessage] = useState<string | null>(null);
  const [showSocialDropdown, setShowSocialDropdown] = useState(true);
  const platformDropdownRef = useRef<HTMLDivElement | null>(null);

  // Click outside to close platform dropdown smoothly
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (platformDropdownRef.current && !platformDropdownRef.current.contains(event.target as Node)) {
        setPlatformDropdownOpen(false);
      }
    };
    if (platformDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [platformDropdownOpen]);

  // Connected channels count
  const connectedSocialCount = useMemo(() => {
    return socialLinksList.length;
  }, [socialLinksList]);

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
    setSocialLinksList(extractInitialSocialLinks(currentInfluencer));
    setEditingLinkId(null);
    setSocialUrlInput('');
    setSocialInputError(null);
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
      { id: 'social', label: 'Social Channels', weight: 5, complete: socialLinksList.length > 0 },
    ];

    const totalWeight = items.reduce((sum, i) => sum + i.weight, 0);
    const completedWeight = items.filter(i => i.complete).reduce((sum, i) => sum + i.weight, 0);
    const percentage = Math.round((completedWeight / totalWeight) * 100);

    const missingItems = items.filter(i => !i.complete);

    return { percentage, items, missingItems };
  }, [
    avatar, fullName, name, handle, handleAvailability.available, 
    email, phoneDigits, dob, calculatedAge, locationCity, locationState, 
    bio, category, languages, socialLinksList
  ]);

  // --- Check Dirty State (Has Unsaved Changes) ---
  const isDirty = useMemo(() => {
    const currentPhone = `${phoneCountryCode} ${phoneDigits.trim()}`;
    const initialLinks = extractInitialSocialLinks(currentInfluencer);
    const socialLinksChanged = JSON.stringify(socialLinksList.map(l => ({ p: l.platform, u: l.url }))) !== 
      JSON.stringify(initialLinks.map(l => ({ p: l.platform, u: l.url })));

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
      socialLinksChanged
    );
  }, [
    fullName, name, handle, email, phoneCountryCode, phoneDigits,
    dob, gender, locationCity, locationState, bio, category, secondaryCategory,
    languages, experienceYears, avatar, socialLinksList, currentInfluencer
  ]);

  // --- Backend Persistence for Social Links ---
  const syncSocialToBackend = (updatedList: SavedSocialLink[]) => {
    const legacySocialLinks: InfluencerProfile['socialLinks'] = {
      ...currentInfluencer.socialLinks,
      instagram: '',
      youtube: '',
      facebook: '',
      twitter: '',
      linkedin: '',
      snapchat: '',
      telegram: '',
      pinterest: '',
      other: '',
    };
    updatedList.forEach(link => {
      const p = SUPPORTED_PLATFORMS.find(opt => opt.name === link.platform);
      if (p) {
        legacySocialLinks[p.key] = link.url;
      }
    });

    updateInfluencerProfile(currentInfluencer.id, {
      socialLinkList: updatedList,
      socialLinks: legacySocialLinks,
    });
  };

  // --- Add or Update Social Media Link ---
  const handleAddOrUpdateLink = () => {
    const trimmed = socialUrlInput.trim();
    if (!trimmed) {
      setSocialInputError(`Please enter your ${selectedPlatform} profile URL.`);
      return;
    }

    // Auto-normalize protocol prefix if missing
    let normalizedUrl = trimmed;
    if (!/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    // Validate URL syntax
    let parsed: URL;
    try {
      parsed = new URL(normalizedUrl);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        setSocialInputError('URL must use HTTP or HTTPS protocol.');
        return;
      }
    } catch {
      setSocialInputError('Please enter a valid web URL (e.g. https://instagram.com/username).');
      return;
    }

    // Validate URL belongs to selected social media platform
    const platformConfig = SUPPORTED_PLATFORMS.find(p => p.name === selectedPlatform);
    if (platformConfig) {
      const host = parsed.hostname.toLowerCase();
      const isDomainMatch = platformConfig.domains.some(d => host === d || host.endsWith(`.${d}`));
      if (!isDomainMatch) {
        setSocialInputError(`The URL must belong to ${selectedPlatform} (allowed: ${platformConfig.domains.join(', ')}).`);
        return;
      }
    }

    // Prevent duplicate platform entries unless editing the same link
    const duplicate = socialLinksList.find(
      item => item.platform === selectedPlatform && item.id !== editingLinkId
    );
    if (duplicate) {
      setSocialInputError(`${selectedPlatform} is already connected. You can edit the existing link below.`);
      return;
    }

    let updatedList: SavedSocialLink[];
    if (editingLinkId) {
      // Update existing link
      updatedList = socialLinksList.map(item => 
        item.id === editingLinkId 
          ? { ...item, platform: selectedPlatform, url: normalizedUrl }
          : item
      );
      setSocialSuccessMessage(`${selectedPlatform} link updated successfully.`);
    } else {
      // Create new link
      const newLink: SavedSocialLink = {
        id: `social-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        platform: selectedPlatform,
        url: normalizedUrl,
        addedAt: new Date().toISOString().split('T')[0],
      };
      updatedList = [...socialLinksList, newLink];
      setSocialSuccessMessage(`${selectedPlatform} link added successfully.`);
    }

    setSocialLinksList(updatedList);
    setEditingLinkId(null);
    setSocialUrlInput('');
    setSocialInputError(null);
    setTimeout(() => setSocialSuccessMessage(null), 3500);

    // Save directly to creator profile in database/state
    syncSocialToBackend(updatedList);
  };

  const handleStartEdit = (link: SavedSocialLink) => {
    setEditingLinkId(link.id);
    setSelectedPlatform(link.platform);
    setSocialUrlInput(link.url);
    setSocialInputError(null);
    setSocialSuccessMessage(null);
    setShowSocialDropdown(true);
  };

  const handleCancelEdit = () => {
    setEditingLinkId(null);
    setSocialUrlInput('');
    setSocialInputError(null);
  };

  const handleDeleteLink = (id: string) => {
    const target = socialLinksList.find(l => l.id === id);
    const updatedList = socialLinksList.filter(l => l.id !== id);
    setSocialLinksList(updatedList);
    if (editingLinkId === id) {
      setEditingLinkId(null);
      setSocialUrlInput('');
      setSocialInputError(null);
    }
    setSocialSuccessMessage(target ? `${target.platform} link removed.` : 'Link removed.');
    setTimeout(() => setSocialSuccessMessage(null), 3000);
    syncSocialToBackend(updatedList);
  };

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
    setSocialLinksList(extractInitialSocialLinks(currentInfluencer));
    setEditingLinkId(null);
    setSocialUrlInput('');
    setSocialInputError(null);
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

    // Map to legacy socialLinks dictionary and update socialLinkList
    const legacySocialLinks: InfluencerProfile['socialLinks'] = {
      ...currentInfluencer.socialLinks,
      instagram: '',
      youtube: '',
      facebook: '',
      twitter: '',
      linkedin: '',
      snapchat: '',
      telegram: '',
      pinterest: '',
      other: '',
    };
    socialLinksList.forEach(item => {
      const p = SUPPORTED_PLATFORMS.find(opt => opt.name === item.platform);
      if (p) {
        legacySocialLinks[p.key] = item.url;
      }
    });

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
      socialLinks: legacySocialLinks,
      socialLinkList: socialLinksList,
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
                <div className="flex items-center gap-1.5 pt-2 border-t border-slate-200/60 text-slate-400 flex-wrap">
                  <span className="text-[10px] font-semibold text-slate-500 mr-0.5">Channels:</span>
                  {socialLinksList.map(link => {
                    const platformOpt = SUPPORTED_PLATFORMS.find(p => p.name === link.platform);
                    const PlatformIcon = platformOpt?.icon || Globe;
                    return (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-6 h-6 rounded-lg ${platformOpt?.bgColor || 'bg-slate-100'} ${platformOpt?.badgeColor || 'text-slate-700'} border ${platformOpt?.borderLight || 'border-slate-200'} flex items-center justify-center hover:scale-110 transition-transform shadow-2xs`}
                        title={`${link.platform}: ${link.url}`}
                      >
                        <PlatformIcon className="w-3 h-3" />
                      </a>
                    );
                  })}
                  {socialLinksList.length === 0 && (
                    <span className="text-[10px] italic text-slate-400">No social links added yet</span>
                  )}
                </div>

              </div>

            </div>
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

            {/* CARD 3: Social Media Channels (with Single Dropdown + Single URL Input) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-5">
              
              <button
                type="button"
                onClick={() => setShowSocialDropdown(!showSocialDropdown)}
                className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left group cursor-pointer"
                aria-expanded={showSocialDropdown}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200/60 shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider group-hover:text-purple-600 transition-colors">
                        3. Connected Social Media Details
                      </h2>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200/80">
                        {connectedSocialCount} connected
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Link your public channels to verify your creator reach and display on your star card.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                  {/* Mini channel icons preview when collapsed */}
                  {!showSocialDropdown && (
                    <div className="flex items-center gap-1.5 text-[10px] font-bold">
                      {socialLinksList.slice(0, 4).map(link => {
                        const plat = SUPPORTED_PLATFORMS.find(p => p.name === link.platform);
                        const Icon = plat?.icon || Globe;
                        return (
                          <span
                            key={link.id}
                            className={`w-6 h-6 rounded-md ${plat?.bgColor || 'bg-slate-100'} ${plat?.badgeColor || 'text-slate-700'} border ${plat?.borderLight || 'border-slate-200'} flex items-center justify-center`}
                            title={link.platform}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </span>
                        );
                      })}
                      {socialLinksList.length > 4 && (
                        <span className="text-[10px] text-slate-500 font-bold px-1.5 py-0.5 rounded-md bg-slate-100">
                          +{socialLinksList.length - 4}
                        </span>
                      )}
                      {socialLinksList.length === 0 && (
                        <span className="text-[11px] text-slate-400 italic">No links added</span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 group-hover:bg-purple-50 text-slate-600 group-hover:text-purple-700 text-xs font-bold transition-colors">
                    <span>{showSocialDropdown ? 'Hide' : 'Manage Links'}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showSocialDropdown ? 'rotate-180 text-purple-600' : ''}`} />
                  </div>
                </div>
              </button>

              {/* Collapsible Dropdown Content */}
              {showSocialDropdown && (
                <div className="space-y-6 pt-4 border-t border-slate-100 animate-fadeIn">
                  
                  {/* Informational Guidance */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-50/70 to-indigo-50/40 border border-purple-100/80 flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-purple-900 leading-relaxed font-medium">
                      Select your platform from the dropdown, paste your profile URL, and click <strong className="font-bold">Add Link</strong>. You can open, edit, or remove linked profiles anytime.
                    </p>
                  </div>

                  {/* Single Dropdown + Single Dynamic URL Input Section */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200/90 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                      
                      {/* 1. Social Media Platform Dropdown */}
                      <div className="md:col-span-4 relative" ref={platformDropdownRef}>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                          <span>Social Media Platform</span>
                          <span className="text-[10px] text-slate-400 font-normal">8 options</span>
                        </label>
                        
                        {(() => {
                          const activePlatformConfig = SUPPORTED_PLATFORMS.find(p => p.name === selectedPlatform) || SUPPORTED_PLATFORMS[0];
                          const ActiveIcon = activePlatformConfig.icon;
                          return (
                            <>
                              <button
                                type="button"
                                onClick={() => setPlatformDropdownOpen(prev => !prev)}
                                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all cursor-pointer shadow-xs"
                                aria-haspopup="listbox"
                                aria-expanded={platformDropdownOpen}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className={`w-6 h-6 rounded-lg ${activePlatformConfig.bgColor} ${activePlatformConfig.badgeColor} border ${activePlatformConfig.borderLight} flex items-center justify-center shrink-0`}>
                                    <ActiveIcon className="w-3.5 h-3.5" />
                                  </div>
                                  <span className="truncate">{selectedPlatform}</span>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-1.5 ${platformDropdownOpen ? 'rotate-180 text-brand-600' : ''}`} />
                              </button>

                              {/* Dropdown Options Menu */}
                              {platformDropdownOpen && (
                                <div className="absolute z-30 left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-fadeIn py-1 min-w-[220px]">
                                  <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
                                    {SUPPORTED_PLATFORMS.map(platform => {
                                      const IconComp = platform.icon;
                                      const isSelected = selectedPlatform === platform.name;
                                      const isAlreadyAdded = socialLinksList.some(l => l.platform === platform.name && l.id !== editingLinkId);

                                      return (
                                        <button
                                          key={platform.name}
                                          type="button"
                                          onClick={() => {
                                            setSelectedPlatform(platform.name);
                                            setPlatformDropdownOpen(false);
                                            setSocialInputError(null);
                                          }}
                                          className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs text-left transition-colors cursor-pointer ${
                                            isSelected ? 'bg-brand-50/70 text-brand-700 font-bold' : 'hover:bg-slate-50 text-slate-700 font-medium'
                                          }`}
                                        >
                                          <div className="flex items-center gap-2.5 min-w-0">
                                            <div className={`w-6 h-6 rounded-lg ${platform.bgColor} ${platform.badgeColor} border ${platform.borderLight} flex items-center justify-center shrink-0`}>
                                              <IconComp className="w-3.5 h-3.5" />
                                            </div>
                                            <div className="min-w-0">
                                              <div className="flex items-center gap-1.5">
                                                <span className="font-bold text-slate-900 truncate">{platform.name}</span>
                                                {isAlreadyAdded && (
                                                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                                                    Added
                                                  </span>
                                                )}
                                              </div>
                                              <span className="text-[10px] text-slate-400 font-normal truncate block">
                                                {platform.domains[0]}
                                              </span>
                                            </div>
                                          </div>
                                          {isSelected && (
                                            <Check className="w-4 h-4 text-brand-600 stroke-[2.5] shrink-0" />
                                          )}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </div>

                      {/* 2. URL Input Field & Add Button */}
                      <div className="md:col-span-8 space-y-1.5">
                        <label className="block text-xs font-bold text-slate-800 flex items-center justify-between">
                          <span>Profile URL</span>
                          {editingLinkId && (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                              Editing {selectedPlatform} Link
                            </span>
                          )}
                        </label>
                        
                        <div className="flex flex-col sm:flex-row gap-2">
                          <div className="relative flex-1">
                            <input
                              type="text"
                              value={socialUrlInput}
                              onChange={e => {
                                setSocialUrlInput(e.target.value);
                                if (socialInputError) setSocialInputError(null);
                              }}
                              onKeyDown={e => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddOrUpdateLink();
                                }
                              }}
                              placeholder={`Paste your ${selectedPlatform} profile URL`}
                              className={`w-full px-4 py-2.5 rounded-xl bg-white border text-xs font-medium text-slate-900 transition-all focus:outline-none ${
                                socialInputError 
                                  ? 'border-rose-400 focus:border-rose-500 ring-2 ring-rose-500/10' 
                                  : 'border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
                              }`}
                            />
                            {socialUrlInput && (
                              <button
                                type="button"
                                onClick={() => setSocialUrlInput('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                                title="Clear input"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={handleAddOrUpdateLink}
                              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 active:scale-[0.98] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm shadow-brand-500/20 cursor-pointer"
                            >
                              {editingLinkId ? (
                                <>
                                  <Check className="w-4 h-4 stroke-[2.5]" />
                                  <span>Update Link</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-4 h-4 stroke-[2.5]" />
                                  <span>Add Link</span>
                                </>
                              )}
                            </button>

                            {editingLinkId && (
                              <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="px-3 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Inline Validation Error Message */}
                    {socialInputError && (
                      <div className="flex items-center gap-1.5 pt-1 text-[11px] font-semibold text-rose-600 animate-fadeIn">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-500" />
                        <span>{socialInputError}</span>
                      </div>
                    )}

                    {/* Inline Success Notification */}
                    {socialSuccessMessage && (
                      <div className="flex items-center gap-1.5 pt-1 text-[11px] font-bold text-emerald-600 animate-fadeIn">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
                        <span>{socialSuccessMessage}</span>
                      </div>
                    )}
                  </div>

                  {/* 3. Saved Social Media Links Management List */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                        <span>Connected Profiles</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {socialLinksList.length}
                        </span>
                      </h3>
                      {socialLinksList.length > 0 && (
                        <span className="text-[10px] text-slate-400">
                          Open in browser or edit anytime
                        </span>
                      )}
                    </div>

                    {socialLinksList.length === 0 ? (
                      <div className="p-8 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 text-center space-y-1">
                        <Share2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-xs font-bold text-slate-700">No social media links connected yet</p>
                        <p className="text-[11px] text-slate-400 max-w-md mx-auto">
                          Choose a platform from the dropdown above, enter your public profile URL, and click Add Link.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {socialLinksList.map(link => {
                          const platformConfig = SUPPORTED_PLATFORMS.find(p => p.name === link.platform);
                          const IconComp = platformConfig?.icon || Globe;
                          const isCurrentlyEditing = editingLinkId === link.id;

                          return (
                            <div
                              key={link.id}
                              className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl border transition-all gap-3 ${
                                isCurrentlyEditing
                                  ? 'bg-amber-50/60 border-amber-300 shadow-xs'
                                  : 'bg-white hover:bg-slate-50/80 border-slate-200/90 shadow-xs'
                              }`}
                            >
                              {/* Left: Platform Icon & Details */}
                              <div className="flex items-center gap-3 min-w-0">
                                <div className={`w-9 h-9 rounded-xl ${platformConfig?.bgColor || 'bg-slate-100'} ${platformConfig?.badgeColor || 'text-slate-700'} border ${platformConfig?.borderLight || 'border-slate-200'} flex items-center justify-center shrink-0 shadow-xs`}>
                                  <IconComp className="w-4 h-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs font-bold text-slate-900">
                                      {link.platform}
                                    </span>
                                    {isCurrentlyEditing && (
                                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800">
                                        Editing
                                      </span>
                                    )}
                                    <span className="text-[10px] text-slate-400 font-normal hidden md:inline">
                                      Connected {link.addedAt}
                                    </span>
                                  </div>
                                  <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[11px] text-slate-500 hover:text-brand-600 hover:underline truncate block max-w-xs sm:max-w-sm md:max-w-md font-mono mt-0.5"
                                    title={link.url}
                                  >
                                    {link.url}
                                  </a>
                                </div>
                              </div>

                              {/* Right: Actions (Open Link, Edit, Delete) */}
                              <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                                <a
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-600 text-xs font-bold transition-colors cursor-pointer"
                                  title="Open profile in new tab"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                  <span>Open Link</span>
                                </a>

                                <button
                                  type="button"
                                  onClick={() => handleStartEdit(link)}
                                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                                    isCurrentlyEditing
                                      ? 'bg-amber-500 text-white shadow-xs'
                                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                  }`}
                                  title="Edit this link"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                  <span>Edit</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteLink(link.id)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-bold transition-colors cursor-pointer"
                                  title="Delete this link"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Section Collapse Footer */}
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowSocialDropdown(false)}
                      className="text-[11px] font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                    >
                      Hide Social Media Links
                    </button>
                  </div>

                </div>
              )}

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

