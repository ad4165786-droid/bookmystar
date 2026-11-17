import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Category, InfluencerProfile, SupportedSocialPlatform, SavedSocialLink, InfluencerGalleryItem } from '../../types';
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
  Link as LinkIcon,
  ChevronDown,
  Video,
  Hash,
  Ghost,
  Send,
  Pin,
  Pencil,
  Image as ImageIcon,
  Play
} from 'lucide-react';

const CATEGORIES: Category[] = [
  'Gaming',
  'Music',
  'Fashion & Beauty',
  'Fitness & Health',
  'Tech & Coding',
  'Education & Career',
  'Comedy & Entertainment',
  'Lifestyle & Travel',
  'Other'
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
    placeholder: 'Paste your Instagram profile URL',
    domains: ['instagram.com'],
    badgeColor: 'text-pink-600',
    bgColor: 'bg-pink-50',
    borderLight: 'border-pink-200',
    icon: Camera,
  },
  {
    name: 'Facebook',
    key: 'facebook',
    placeholder: 'Paste your Facebook profile URL',
    domains: ['facebook.com', 'fb.com'],
    badgeColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderLight: 'border-blue-200',
    icon: Share2,
  },
  {
    name: 'YouTube',
    key: 'youtube',
    placeholder: 'Paste your YouTube channel URL',
    domains: ['youtube.com', 'youtu.be'],
    badgeColor: 'text-red-600',
    bgColor: 'bg-red-50',
    borderLight: 'border-red-200',
    icon: Video,
  },
  {
    name: 'X (Twitter)',
    key: 'twitter',
    placeholder: 'Paste your X (Twitter) profile URL',
    domains: ['x.com', 'twitter.com'],
    badgeColor: 'text-slate-900',
    bgColor: 'bg-slate-100',
    borderLight: 'border-slate-300',
    icon: Hash,
  },
  {
    name: 'LinkedIn',
    key: 'linkedin',
    placeholder: 'Paste your LinkedIn profile URL',
    domains: ['linkedin.com'],
    badgeColor: 'text-sky-700',
    bgColor: 'bg-sky-50',
    borderLight: 'border-sky-200',
    icon: Briefcase,
  },
  {
    name: 'Snapchat',
    key: 'snapchat',
    placeholder: 'Paste your Snapchat profile URL',
    domains: ['snapchat.com'],
    badgeColor: 'text-amber-500',
    bgColor: 'bg-amber-50',
    borderLight: 'border-amber-200',
    icon: Ghost,
  },
  {
    name: 'Telegram',
    key: 'telegram',
    placeholder: 'Paste your Telegram profile URL',
    domains: ['t.me', 'telegram.me', 'telegram.org'],
    badgeColor: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    borderLight: 'border-cyan-200',
    icon: Send,
  },
  {
    name: 'Pinterest',
    key: 'pinterest',
    placeholder: 'Paste your Pinterest profile URL',
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

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=300&auto=format&fit=crop&q=80'
];

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
    addGalleryItem,
    deleteGalleryItem,
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

  // --- 1. Personal Information State ---
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

  // --- 2. Creator Information State ---
  const initialCategoryIsOther = !CATEGORIES.slice(0, 8).includes(currentInfluencer.category as any) || currentInfluencer.category === 'Other';
  const [category, setCategory] = useState<Category>(initialCategoryIsOther ? 'Other' : currentInfluencer.category);
  const [customCategory, setCustomCategory] = useState<string>(
    currentInfluencer.customCategory || (initialCategoryIsOther && currentInfluencer.category !== 'Other' ? currentInfluencer.category : '')
  );
  const [secondaryCategory, setSecondaryCategory] = useState<Category | ''>(currentInfluencer.secondaryCategory || '');
  const [professionalTitle, setProfessionalTitle] = useState(currentInfluencer.professionalTitle || '');
  const [bio, setBio] = useState(currentInfluencer.bio || '');
  const [experienceYears, setExperienceYears] = useState(currentInfluencer.experienceYears || '3-5 years');
  const [languages, setLanguages] = useState<string[]>(currentInfluencer.languages || ['English', 'Hindi']);
  const [showLanguagesDropdown, setShowLanguagesDropdown] = useState(false);

  // --- 3. Dynamic Social Media Links State ---
  const [socialLinksList, setSocialLinksList] = useState<SavedSocialLink[]>(() => extractInitialSocialLinks(currentInfluencer));
  const [selectedPlatform, setSelectedPlatform] = useState<SupportedSocialPlatform>('Instagram');
  const [platformDropdownOpen, setPlatformDropdownOpen] = useState(false);
  const [socialUrlInput, setSocialUrlInput] = useState('');
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [socialInputError, setSocialInputError] = useState<string | null>(null);
  const [socialSuccessMessage, setSocialSuccessMessage] = useState<string | null>(null);
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

  // --- 4. Profile Picture / Avatar State ---
  const [avatar, setAvatar] = useState(currentInfluencer.avatar);
  const [avatarPreview, setAvatarPreview] = useState(currentInfluencer.avatar);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [photoUploadSuccess, setPhotoUploadSuccess] = useState<string | null>(null);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // --- 5. Creator Content / Media State ---
  const [showMediaUploadForm, setShowMediaUploadForm] = useState(false);
  const [mediaTitle, setMediaTitle] = useState('');
  const [mediaDesc, setMediaDesc] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [mediaPreviewModal, setMediaPreviewModal] = useState<InfluencerGalleryItem | null>(null);

  // ESC key and body scroll lock for modals in CoreCreatorDetails
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showUrlModal) {
          setShowUrlModal(false);
          setUrlError(null);
        }
        if (mediaPreviewModal) {
          setMediaPreviewModal(null);
        }
      }
    };
    if (showUrlModal || mediaPreviewModal) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showUrlModal, mediaPreviewModal]);

  // --- 6. Form Saving & Validation State ---
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessBanner, setSaveSuccessBanner] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Sync state if currentInfluencer changes externally
  useEffect(() => {
    setFullName(currentInfluencer.fullName || currentInfluencer.name);
    setName(currentInfluencer.name);
    setHandle(currentInfluencer.handle);
    setProfessionalTitle(currentInfluencer.professionalTitle || '');
    setEmail(currentInfluencer.email || 'creator@bookmystar.in');
    setAvatar(currentInfluencer.avatar);
    setAvatarPreview(currentInfluencer.avatar);
    const isOther = !CATEGORIES.slice(0, 8).includes(currentInfluencer.category as any) || currentInfluencer.category === 'Other';
    setCategory(isOther ? 'Other' : currentInfluencer.category);
    setCustomCategory(currentInfluencer.customCategory || (isOther && currentInfluencer.category !== 'Other' ? currentInfluencer.category : ''));
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

    const cleanNoAt = formatted.replace(/^@/, '');
    if (!/^[a-zA-Z0-9_]{3,30}$/.test(cleanNoAt)) {
      return {
        checked: true,
        available: false,
        message: 'Must be 3-30 characters (letters, numbers, underscores)'
      };
    }

    const isDuplicate = influencers.some(
      inf => inf.id !== currentInfluencer.id && inf.handle.toLowerCase() === formatted.toLowerCase()
    );

    if (isDuplicate) {
      return { checked: true, available: false, message: 'Username is taken by another creator' };
    }
    return { checked: true, available: true, message: 'Username is available' };
  }, [handle, influencers, currentInfluencer.id]);

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
      professionalTitle !== (currentInfluencer.professionalTitle || '') ||
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
    fullName, name, handle, professionalTitle, email, phoneCountryCode, phoneDigits,
    dob, gender, locationCity, locationState, bio, category, secondaryCategory,
    languages, experienceYears, avatar, socialLinksList, currentInfluencer
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
      newErrors.email = 'Please enter a valid email address.';
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

  // --- Profile Photo Handlers ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrors(prev => ({ ...prev, avatar: undefined }));
    setPhotoUploadSuccess(null);

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, avatar: 'Unsupported format. Please upload JPG, PNG, or WEBP only.' }));
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrors(prev => ({ ...prev, avatar: 'File size exceeds 5MB limit. Please choose a smaller image.' }));
      return;
    }

    setIsUploadingPhoto(true);
    setUploadProgress(20);

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setTimeout(() => {
        setUploadProgress(100);
        setTimeout(() => {
          setAvatar(dataUrl);
          setAvatarPreview(dataUrl);
          setIsUploadingPhoto(false);
          setPhotoUploadSuccess('Profile picture updated successfully!');
          setTimeout(() => setPhotoUploadSuccess(null), 3500);
        }, 250);
      }, 300);
    };

    reader.onerror = () => {
      setIsUploadingPhoto(false);
      setErrors(prev => ({ ...prev, avatar: 'Failed to read image file. Please try again.' }));
    };

    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    const initials = (name || 'Creator').substring(0, 2).toUpperCase();
    const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=f97316&color=ffffff&bold=true&size=300`;
    setAvatar(fallbackUrl);
    setAvatarPreview(fallbackUrl);
    setPhotoUploadSuccess('Reset to default initials avatar.');
    setTimeout(() => setPhotoUploadSuccess(null), 3000);
  };

  const handleApplyCustomUrl = (urlToApply?: string) => {
    const raw = (urlToApply !== undefined ? urlToApply : customUrlInput).trim();
    if (!raw) {
      setUrlError('Please enter or select a valid image URL.');
      return;
    }
    let targetUrl = raw;
    if (!/^https?:\/\//i.test(targetUrl) && !targetUrl.startsWith('data:image/')) {
      targetUrl = `https://${targetUrl}`;
    }
    setUrlError(null);
    setPreviewError(false);
    setAvatar(targetUrl);
    setAvatarPreview(targetUrl);
    setShowUrlModal(false);
    setCustomUrlInput('');
    setPhotoUploadSuccess('Profile photo URL applied!');
    setTimeout(() => setPhotoUploadSuccess(null), 3000);
  };

  // --- Spoken Languages Handlers ---
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

  // --- Social Links Backend Persistence ---
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

    let normalizedUrl = trimmed;
    if (!/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

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

    const platformConfig = SUPPORTED_PLATFORMS.find(p => p.name === selectedPlatform);
    if (platformConfig) {
      const host = parsed.hostname.toLowerCase();
      const isDomainMatch = platformConfig.domains.some(d => host === d || host.endsWith(`.${d}`));
      if (!isDomainMatch) {
        setSocialInputError(`The URL must belong to ${selectedPlatform} (allowed: ${platformConfig.domains.join(', ')}).`);
        return;
      }
    }

    const duplicate = socialLinksList.find(
      item => item.platform === selectedPlatform && item.id !== editingLinkId
    );
    if (duplicate) {
      setSocialInputError(`${selectedPlatform} is already connected. You can edit the existing link below.`);
      return;
    }

    let updatedList: SavedSocialLink[];
    if (editingLinkId) {
      updatedList = socialLinksList.map(item =>
        item.id === editingLinkId
          ? { ...item, platform: selectedPlatform, url: normalizedUrl }
          : item
      );
      setSocialSuccessMessage(`${selectedPlatform} link updated successfully.`);
    } else {
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

    syncSocialToBackend(updatedList);
  };

  const handleStartEdit = (link: SavedSocialLink) => {
    setEditingLinkId(link.id);
    setSelectedPlatform(link.platform);
    setSocialUrlInput(link.url);
    setSocialInputError(null);
    setSocialSuccessMessage(null);
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

  // --- Showcase Media Handlers ---
  const handleAddMediaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaTitle.trim()) return;

    const fallbackUrl = mediaType === 'video'
      ? 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80';

    addGalleryItem(currentInfluencer.id, {
      title: mediaTitle.trim(),
      description: mediaDesc.trim() || 'Showcase media item.',
      url: mediaUrl.trim() || fallbackUrl,
      type: mediaType
    });

    setMediaTitle('');
    setMediaDesc('');
    setMediaUrl('');
    setShowMediaUploadForm(false);
    showToast('Showcase media item uploaded successfully.');
  };

  // --- Reset All Form Changes ---
  const handleReset = () => {
    setFullName(currentInfluencer.fullName || currentInfluencer.name);
    setName(currentInfluencer.name);
    setHandle(currentInfluencer.handle);
    setProfessionalTitle(currentInfluencer.professionalTitle || '');
    setEmail(currentInfluencer.email || 'creator@bookmystar.in');
    setPhoneCountryCode(initialCountryCode);
    setPhoneDigits(initialPhoneDigits);
    setDob(currentInfluencer.dob || '1998-05-14');
    setGender(currentInfluencer.gender || 'male');
    setLocationCity(currentInfluencer.locationCity || 'Mumbai');
    setLocationState(currentInfluencer.locationState || 'Maharashtra');
    setBio(currentInfluencer.bio || '');
    const isOther = !CATEGORIES.slice(0, 8).includes(currentInfluencer.category as any) || currentInfluencer.category === 'Other';
    setCategory(isOther ? 'Other' : currentInfluencer.category);
    setCustomCategory(currentInfluencer.customCategory || (isOther && currentInfluencer.category !== 'Other' ? currentInfluencer.category : ''));
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

  // --- Save Changes to Profile ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('Please fix the highlighted errors before saving.');
      return;
    }

    setIsSaving(true);

    const formattedHandle = handle.trim().startsWith('@') ? handle.trim() : `@${handle.trim()}`;
    const fullPhone = `${phoneCountryCode} ${phoneDigits.trim()}`;

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
      professionalTitle: professionalTitle.trim(),
      email: email.trim(),
      phone: fullPhone,
      phoneCountryCode,
      dob,
      age: calculatedAge,
      gender: gender as any,
      locationCity: locationCity.trim(),
      locationState: locationState.trim(),
      bio: bio.trim(),
      category: (category === 'Other' && customCategory.trim()) ? (customCategory.trim() as Category) : category,
      customCategory: category === 'Other' ? customCategory.trim() : undefined,
      secondaryCategory: secondaryCategory || undefined,
      languages,
      experienceYears,
      avatar,
      socialLinks: legacySocialLinks,
      socialLinkList: socialLinksList,
    };

    await new Promise(resolve => setTimeout(resolve, 600));

    updateInfluencerProfile(currentInfluencer.id, updates);
    setIsSaving(false);
    setSaveSuccessBanner(true);
    showToast('Creator profile updated successfully!');
    setTimeout(() => setSaveSuccessBanner(false), 5000);
  };

  return (
    <div className="space-y-8 pb-24 max-w-6xl mx-auto font-sans">

      {/* ================= 1. PROFILE HEADER ================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md ring-1 ring-slate-900/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

          {/* Left: Avatar + Title & Meta */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Profile Picture with Upload/Change */}
            <div className="relative group shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-slate-200 shadow-md bg-slate-100 relative">
                <img
                  src={avatarPreview}
                  alt={name}
                  className="w-full h-full object-cover"
                />
                {isUploadingPhoto && (
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-[10px] font-bold">
                    <Loader2 className="w-5 h-5 animate-spin mb-1 text-brand-400" />
                    <span>{uploadProgress}%</span>
                  </div>
                )}
              </div>

              {/* Change Photo Overlay Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white shadow-md shadow-brand-500/30 transition-transform hover:scale-105 cursor-pointer"
                title="Change profile picture"
              >
                <Camera className="w-4 h-4" />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Creator Info */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Edit Creator Profile
                </h1>
                {currentInfluencer.isVerified ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                    <span>Verified Creator</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Verification Pending</span>
                  </span>
                )}
              </div>

              {/* Creator Handle */}
              <div className="flex items-center gap-3 pt-1 text-xs font-semibold text-slate-600 flex-wrap">
                <span className="text-brand-600 font-mono font-bold">{handle || '@username'}</span>
              </div>
            </div>

          </div>

          {/* Right: Header Save / Cancel Actions */}
          <div className="flex items-center gap-3 shrink-0 self-stretch sm:self-auto justify-end">
            <button
              type="button"
              onClick={handleReset}
              disabled={!isDirty || isSaving}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs disabled:opacity-40 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 active:scale-[0.98] text-white font-bold text-xs transition-all shadow-md shadow-brand-500/25 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
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

        {photoUploadSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{photoUploadSuccess}</span>
          </div>
        )}

        {/* Global Save Success Banner */}
        {saveSuccessBanner && (
          <div className="mt-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900 font-bold animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Your creator profile has been updated and published to the BookMyStar marketplace!</span>
            </div>
            <button
              type="button"
              onClick={() => setSaveSuccessBanner(false)}
              className="p-1 rounded-lg hover:bg-emerald-100 text-emerald-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* ================= MAIN HORIZONTAL FORM ================= */}
      <form onSubmit={handleSave} className="space-y-8">

        {/* ================= 2. PERSONAL INFORMATION (2-Column Grid) ================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md ring-1 ring-slate-900/5 space-y-6 hover:shadow-lg transition-all">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 border border-brand-200/60 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                Personal Information
              </h2>

            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">

            {/* Row 1: Full Name | Username */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={e => {
                  setFullName(e.target.value);
                  if (errors.fullName) setErrors(prev => ({ ...prev, fullName: undefined }));
                }}
                placeholder="Enter your full legal name"
                className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 border text-xs font-medium text-slate-900 focus:outline-none focus:bg-white transition-all ${errors.fullName ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-brand-500'
                  }`}
              />
              {errors.fullName && (
                <p className="text-[11px] font-semibold text-rose-500">{errors.fullName}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-800">
                  Username <span className="text-rose-500">*</span>
                </label>
                {handleAvailability.checked && (
                  <span className={`text-[10px] font-bold ${handleAvailability.available ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {handleAvailability.message}
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={handle}
                  onChange={e => {
                    const val = e.target.value.startsWith('@') ? e.target.value : `@${e.target.value}`;
                    setHandle(val);
                    if (errors.handle) setErrors(prev => ({ ...prev, handle: undefined }));
                  }}
                  placeholder="@username"
                  className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 border text-xs font-medium text-slate-900 font-mono focus:outline-none focus:bg-white transition-all ${errors.handle ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-brand-500'
                    }`}
                />
              </div>
              {errors.handle && (
                <p className="text-[11px] font-semibold text-rose-500">{errors.handle}</p>
              )}
            </div>

            {/* Row 2: Email Address | Mobile Number */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                  }}
                  placeholder="creator@domain.com"
                  className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 border text-xs font-medium text-slate-900 focus:outline-none focus:bg-white transition-all ${errors.email ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-brand-500'
                    }`}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] font-semibold text-rose-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  value={phoneCountryCode}
                  onChange={e => setPhoneCountryCode(e.target.value)}
                  className="w-28 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-brand-500 shrink-0"
                >
                  {COUNTRY_CODES.map(c => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  value={phoneDigits}
                  onChange={e => {
                    const digits = e.target.value.replace(/\D/g, '');
                    setPhoneDigits(digits);
                    if (errors.phone) setErrors(prev => ({ ...prev, phone: undefined }));
                  }}
                  placeholder="9820144820"
                  className={`flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border text-xs font-medium text-slate-900 focus:outline-none focus:bg-white transition-all ${errors.phone ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-brand-500'
                    }`}
                />
              </div>
              {errors.phone && (
                <p className="text-[11px] font-semibold text-rose-500">{errors.phone}</p>
              )}
            </div>

            {/* Row 3: Date of Birth | Gender */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-800">
                  Date of Birth <span className="text-rose-500">*</span>
                </label>
                {dob && (
                  <span className="text-[10px] text-slate-500">
                    Age: {calculatedAge} years {calculatedAge < 18 ? '(Must be 18+)' : '(Eligible)'}
                  </span>
                )}
              </div>
              <input
                type="date"
                value={dob}
                onChange={e => {
                  setDob(e.target.value);
                  if (errors.dob) setErrors(prev => ({ ...prev, dob: undefined }));
                }}
                className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 border text-xs font-medium text-slate-900 focus:outline-none focus:bg-white transition-all ${errors.dob ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-brand-500'
                  }`}
              />
              {errors.dob && (
                <p className="text-[11px] font-semibold text-rose-500">{errors.dob}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                Gender
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
            </div>

            {/* Row 4: City | State */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                City
              </label>
              <input
                type="text"
                value={locationCity}
                onChange={e => setLocationCity(e.target.value)}
                placeholder="e.g. Mumbai"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                State
              </label>
              <input
                type="text"
                value={locationState}
                onChange={e => setLocationState(e.target.value)}
                placeholder="e.g. Maharashtra"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-all"
              />
            </div>

          </div>
        </div>

        {/* ================= 3. CREATOR INFORMATION (2-Column Grid) ================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md ring-1 ring-slate-900/5 space-y-6 hover:shadow-lg transition-all">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-navy-50 text-navy-600 border border-navy-200/60 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-navy-600" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                Creator Information
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">

            {/* Row 1: Creator Category (dropdown) | Professional Title */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                Creator Category <span className="text-rose-500">*</span>
              </label>
              <div className="space-y-2">
                <select
                  value={category}
                  onChange={e => {
                    const val = e.target.value as Category;
                    setCategory(val);
                    if (val !== 'Other') {
                      setCustomCategory('');
                    }
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-all"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                {category === 'Other' && (
                  <div className="animate-fadeIn">
                    <input
                      type="text"
                      value={customCategory}
                      onChange={e => setCustomCategory(e.target.value)}
                      placeholder="Please enter your custom creator category..."
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-brand-500 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 shadow-xs"
                      required
                      autoFocus
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                Professional Title
              </label>
              <input
                type="text"
                value={professionalTitle}
                onChange={e => setProfessionalTitle(e.target.value)}
                placeholder="e.g. Pro Esports Athlete & Live Streamer"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-all"
              />
            </div>

            {/* Row 2: Short Bio | Years of Experience */}
            <div className="space-y-1.5 md:col-span-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-800">
                  Short Bio <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] text-slate-400">
                  {bio.length} characters (min 20)
                </span>
              </div>
              <textarea
                rows={4}
                value={bio}
                onChange={e => {
                  setBio(e.target.value);
                  if (errors.bio) setErrors(prev => ({ ...prev, bio: undefined }));
                }}
                placeholder="Describe your background, what you advise on, and what fans can expect in a 1-on-1 call..."
                className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 border text-xs font-medium text-slate-900 focus:outline-none focus:bg-white transition-all resize-none ${errors.bio ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-brand-500'
                  }`}
              />
              {errors.bio && (
                <p className="text-[11px] font-semibold text-rose-500">{errors.bio}</p>
              )}
            </div>

            <div className="space-y-4 md:col-span-1">
              {/* Spoken Languages Pills */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800">
                    Languages Spoken ({languages.length})
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowLanguagesDropdown(!showLanguagesDropdown)}
                    className="text-[10px] font-bold text-brand-600 hover:underline cursor-pointer"
                  >
                    {showLanguagesDropdown ? 'Hide List' : 'Edit Languages'}
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {languages.map(lang => (
                    <span
                      key={lang}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200"
                    >
                      <span>{lang}</span>
                      {showLanguagesDropdown && languages.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleToggleLanguage(lang)}
                          className="text-slate-400 hover:text-rose-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>

                {showLanguagesDropdown && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 mt-2 space-y-2 animate-fadeIn">
                    <div className="flex flex-wrap gap-1">
                      {POPULAR_LANGUAGES.map(lang => {
                        const isSelected = languages.includes(lang);
                        return (
                          <button
                            key={lang}
                            type="button"
                            onClick={() => handleToggleLanguage(lang)}
                            className={`px-2 py-1 rounded-md text-[11px] font-bold border cursor-pointer ${isSelected
                              ? 'bg-brand-500 text-white border-brand-500'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                              }`}
                          >
                            {lang}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* ================= 4. CONNECTED SOCIAL MEDIA DETAILS ================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md ring-1 ring-slate-900/5 space-y-5 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 border border-purple-200/60 flex items-center justify-center">
                <Share2 className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                    Social Media Links
                  </h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                    {socialLinksList.length} Connected
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Single Dropdown + Single Dynamic URL Input Section */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200/90 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">

              {/* 1. Platform Dropdown */}
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
                                  className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs text-left transition-colors cursor-pointer ${isSelected ? 'bg-brand-50/70 text-brand-700 font-bold' : 'hover:bg-slate-50 text-slate-700 font-medium'
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

              {/* 2. Dynamic URL Input Field & Add Button */}
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
                      className={`w-full px-4 py-2.5 rounded-xl bg-white border text-xs font-medium text-slate-900 transition-all focus:outline-none ${socialInputError
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

            {/* Inline Validation Error */}
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

          {/* Saved Social Media Links Management List */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Connected Profiles ({socialLinksList.length})
            </h3>

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
                      className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl border transition-all gap-3 ${isCurrentlyEditing
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
                          className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${isCurrentlyEditing
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
        </div>

        {/* ================= 5. CREATOR CONTENT & PROFILE MEDIA ================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md ring-1 ring-slate-900/5 space-y-6 hover:shadow-lg transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] text-[#1D4ED8] border border-[#DBEAFE] flex items-center justify-center">
                <ImageIcon className="w-4 h-4 text-[#1D4ED8]" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-[#172554] tracking-tight">
                  Creator Content & Profile Media
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowMediaUploadForm(prev => !prev)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs transition-colors shadow-sm shadow-brand-500/20 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Media Item</span>
            </button>
          </div>

          {/* Inline Media Upload Form */}
          {showMediaUploadForm && (
            <div className="p-4 sm:p-5 rounded-2xl bg-[#EFF6FF]/50 border border-[#DBEAFE] space-y-4 animate-fadeIn">
              <h3 className="text-xs font-bold text-[#172554] uppercase tracking-wider">
                Add Showcase Photo / Video Clip
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#172554] mb-1">
                    Media Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={mediaTitle}
                    onChange={e => setMediaTitle(e.target.value)}
                    placeholder="e.g. Esports Finals MVP Trophy"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-[#172554] placeholder-[#94A3B8] focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#172554] mb-1">
                    Media Type
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setMediaType('image')}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${mediaType === 'image' ? 'bg-brand-500 text-white border-brand-500' : 'bg-white text-[#64748B] border-slate-200 hover:text-[#172554]'
                        }`}
                    >
                      Photo / Image
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaType('video')}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${mediaType === 'video' ? 'bg-brand-500 text-white border-brand-500' : 'bg-white text-[#64748B] border-slate-200 hover:text-[#172554]'
                        }`}
                    >
                      Video Highlight
                    </button>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#172554] mb-1">
                    Media URL (Direct Link to Image or Video) <span className="text-[#64748B] font-normal">(Optional, default provided)</span>
                  </label>
                  <input
                    type="url"
                    value={mediaUrl}
                    onChange={e => setMediaUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-[#172554] placeholder-[#94A3B8] focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#172554] mb-1">
                    Brief Caption / Description
                  </label>
                  <input
                    type="text"
                    value={mediaDesc}
                    onChange={e => setMediaDesc(e.target.value)}
                    placeholder="Short description of this highlight..."
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-[#172554] placeholder-[#94A3B8] focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMediaUploadForm(false)}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#172554] border border-slate-200/90 font-bold text-xs cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddMediaSubmit}
                  className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-sm shadow-brand-500/20 cursor-pointer"
                >
                  Upload to Showcase
                </button>
              </div>
            </div>
          )}

          {/* Media Grid */}
          {(!currentInfluencer.gallery || currentInfluencer.gallery.length === 0) ? (
            <div className="p-8 text-center bg-[#F8FAFC] rounded-2xl border border-dashed border-slate-200 space-y-2">
              <ImageIcon className="w-8 h-8 text-[#94A3B8] mx-auto" />
              <p className="text-xs font-bold text-[#172554]">No showcase media added yet</p>
              <p className="text-[11px] text-[#64748B] max-w-sm mx-auto">
                Upload pictures, event photos, or video thumbnails to stand out in the BookMyStar marketplace.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {currentInfluencer.gallery.map(item => (
                <div
                  key={item.id}
                  className="group rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
                >
                  <div className="aspect-video bg-slate-100 relative overflow-hidden">
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold text-white shadow-xs ${item.type === 'video' ? 'bg-rose-600' : 'bg-slate-900/80 backdrop-blur-sm'
                      }`}>
                      {item.type === 'video' ? 'Video' : 'Photo'}
                    </span>
                  </div>

                  <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h4 className="text-xs font-bold text-[#172554] truncate" title={item.title}>
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-[#64748B] line-clamp-1 mt-0.5">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-[9px] text-[#64748B] font-medium">
                        {item.uploadedAt}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setMediaPreviewModal(item)}
                          className="p-1.5 rounded-lg text-[#64748B] hover:text-brand-600 hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                          title="Preview media"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteGalleryItem(currentInfluencer.id, item.id)}
                          className="p-1.5 rounded-lg text-[#64748B] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete media"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ================= 6. FOOTER ACTIONS ================= */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-md ring-1 ring-slate-900/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#64748B]">
            {isDirty ? (
              <span className="text-amber-600 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                You have unsaved creator profile changes
              </span>
            ) : (
              <span className="text-[#64748B] flex items-center gap-1">
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
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#F8FAFC] hover:bg-slate-100 text-[#64748B] hover:text-[#172554] border border-slate-200/90 disabled:opacity-40 font-bold text-xs transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </button>

            <button
              type="submit"
              disabled={isSaving}
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

      {/* ================= DIRECT IMAGE URL MODAL ================= */}
      {showUrlModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowUrlModal(false);
              setUrlError(null);
            }
          }}
        >
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-slate-200/90 shadow-2xl space-y-5 animate-scaleUp">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 border border-brand-200/80 flex items-center justify-center shrink-0">
                  <LinkIcon className="w-4 h-4 text-brand-600" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-[#172554]">Direct Image URL</h4>
                  <p className="text-[11px] text-[#64748B]">Set your profile photo via direct link or presets</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowUrlModal(false);
                  setUrlError(null);
                }}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Close (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Live Preview Card */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-sm bg-slate-200 shrink-0">
                <img
                  src={customUrlInput.trim() || avatarPreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={() => setPreviewError(true)}
                  onLoad={() => setPreviewError(false)}
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[11px] font-bold text-slate-800 block">
                  {customUrlInput.trim() ? 'Live URL Preview' : 'Current Profile Photo'}
                </span>
                {customUrlInput.trim() ? (
                  previewError ? (
                    <span className="text-[10px] text-rose-600 font-semibold flex items-center gap-1 mt-0.5">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      Unable to load image. Check the URL link.
                    </span>
                  ) : (
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3 h-3 shrink-0" />
                      Image loaded successfully!
                    </span>
                  )
                ) : (
                  <span className="text-[10px] text-slate-500 block truncate mt-0.5">
                    Paste an image link below or choose a preset.
                  </span>
                )}
              </div>
            </div>

            {/* URL Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#172554]">
                Web Image URL (HTTPS)
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={customUrlInput}
                  onChange={e => {
                    setCustomUrlInput(e.target.value);
                    if (urlError) setUrlError(null);
                    setPreviewError(false);
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleApplyCustomUrl();
                    }
                  }}
                  placeholder="https://images.unsplash.com/photo-..."
                  className={`w-full pl-3.5 pr-9 py-2.5 rounded-xl bg-[#F8FAFC] border text-xs text-[#172554] placeholder-[#94A3B8] transition-all focus:outline-none focus:bg-white ${
                    urlError ? 'border-rose-400 ring-2 ring-rose-500/10' : 'border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
                  }`}
                  autoFocus
                />
                {customUrlInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setCustomUrlInput('');
                      setUrlError(null);
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                    title="Clear"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              {urlError && (
                <p className="text-[11px] text-rose-600 font-medium">{urlError}</p>
              )}
            </div>

            {/* Curated Presets Selection */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-bold text-[#172554] block">
                Or choose from high-res creator presets:
              </span>
              <div className="grid grid-cols-6 gap-2">
                {PRESET_AVATARS.map((url, idx) => {
                  const isSelected = customUrlInput.trim() === url || (!customUrlInput.trim() && avatar === url);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setCustomUrlInput(url);
                        setUrlError(null);
                        setPreviewError(false);
                      }}
                      className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all cursor-pointer group ${
                        isSelected ? 'border-brand-500 ring-2 ring-brand-500/20 shadow-sm' : 'border-slate-200 hover:border-slate-400'
                      }`}
                      title={`Preset ${idx + 1}`}
                    >
                      <img src={url} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      {isSelected && (
                        <div className="absolute inset-0 bg-brand-500/20 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  handleRemovePhoto();
                  setShowUrlModal(false);
                  setUrlError(null);
                }}
                className="text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
              >
                Reset to initials
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowUrlModal(false);
                    setUrlError(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#F8FAFC] hover:bg-slate-100 text-[#64748B] hover:text-[#172554] border border-slate-200 text-xs font-bold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyCustomUrl()}
                  className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 active:scale-[0.98] text-white text-xs font-bold shadow-sm shadow-brand-500/25 cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Apply Image</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MEDIA PREVIEW MODAL ================= */}
      {mediaPreviewModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setMediaPreviewModal(null);
          }}
        >
          <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200/90 animate-scaleUp">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                  mediaPreviewModal.type === 'video' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {mediaPreviewModal.type === 'video' ? 'Video' : 'Photo'}
                </span>
                <h4 className="text-xs font-bold text-[#172554] truncate">{mediaPreviewModal.title}</h4>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href={mediaPreviewModal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  title="Open Original Link"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => setMediaPreviewModal(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Close (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="aspect-video bg-black flex items-center justify-center overflow-hidden">
              {mediaPreviewModal.type === 'video' ? (
                <video
                  src={mediaPreviewModal.url}
                  controls
                  autoPlay
                  className="max-h-full max-w-full"
                />
              ) : (
                <img
                  src={mediaPreviewModal.url}
                  alt={mediaPreviewModal.title}
                  className="max-h-full max-w-full object-contain"
                />
              )}
            </div>
            <div className="p-4 space-y-1 bg-slate-50/50">
              <p className="text-xs text-[#64748B]">{mediaPreviewModal.description}</p>
              <span className="text-[10px] text-[#64748B]/70 block">Uploaded {mediaPreviewModal.uploadedAt}</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Sticky Save Bar when dirty */}
      {isDirty && (
        <div className="fixed bottom-6 inset-x-4 sm:inset-x-auto sm:right-8 z-30 animate-slideDown">
          <div className="bg-slate-900/95 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center gap-4">
            <div className="hidden sm:block">
              <span className="text-xs font-bold text-slate-200 block">Unsaved Profile Changes</span>
              <span className="text-[10px] text-slate-400">Save changes to publish them to your fans</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-xs font-bold text-white transition-all shadow-md shadow-brand-500/30 flex items-center gap-1.5"
              >
                {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
