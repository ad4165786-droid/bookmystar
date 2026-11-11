import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole, 
  UserProfile, 
  InfluencerProfile, 
  Booking, 
  PayoutRequest, 
  GrievanceTicket, 
  ReviewItem, 
  AuditLogItem, 
  PlatformNotification, 
  PlatformSettings, 
  AdminUser,
  CallType,
  Category
} from '../types';
import { 
  INITIAL_SETTINGS, 
  INITIAL_USERS, 
  INITIAL_INFLUENCERS, 
  INITIAL_BOOKINGS, 
  INITIAL_PAYOUTS, 
  INITIAL_GRIEVANCES, 
  INITIAL_REVIEWS, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_NOTIFICATIONS 
} from '../data/mockData';

interface BookingCheckoutFlow {
  influencer: InfluencerProfile;
  callType: CallType;
  duration: number;
  scheduledDate: string;
  scheduledTime: string;
  price: number;
}

interface ActiveCallData {
  booking: Booking;
  isInfluencerPerspective: boolean;
}

interface AppContextType {
  // Authentication & Session
  isAuthenticated: boolean;
  currentRole: UserRole | null;
  currentUser: UserProfile | null;
  currentInfluencer: InfluencerProfile | null;
  currentAdmin: AdminUser | null;
  currentPath: string;
  navigate: (path: string) => void;

  // Auth Operations
  loginUser: (identifier: string, password: string) => { success: boolean; message?: string };
  registerUser: (details: { name: string; email: string; phone: string; password: string }) => { success: boolean; message?: string };
  loginInfluencer: (identifier: string, password: string) => { success: boolean; message?: string };
  registerInfluencer: (details: { name: string; handle: string; email: string; phone: string; category: Category; bio?: string; password: string }) => { success: boolean; message?: string };
  loginAdmin: (email: string, password: string) => { success: boolean; message?: string };
  logout: () => void;

  // Active View inside each role's dashboard
  activeView: string;
  setActiveView: (view: string) => void;

  // Selected influencer for public profile view inside User Dashboard
  selectedInfluencerId: string | null;
  setSelectedInfluencerId: (id: string | null) => void;

  // Data Collections
  users: UserProfile[];
  influencers: InfluencerProfile[];
  bookings: Booking[];
  payouts: PayoutRequest[];
  grievances: GrievanceTicket[];
  reviews: ReviewItem[];
  auditLogs: AuditLogItem[];
  notifications: PlatformNotification[];
  settings: PlatformSettings;

  // Active Call Session
  activeCall: ActiveCallData | null;
  startCall: (booking: Booking, isInfluencer?: boolean) => void;
  endCall: () => void;

  // Checkout modal
  checkoutFlow: BookingCheckoutFlow | null;
  openCheckout: (data: BookingCheckoutFlow) => void;
  closeCheckout: () => void;

  // Actions
  createBooking: (details: {
    influencerId: string;
    callType: CallType;
    durationMinutes: number;
    scheduledDate: string;
    scheduledTime: string;
    amount: number;
    paymentMethod: 'upi' | 'card' | 'netbanking';
  }) => Promise<Booking>;

  cancelBooking: (bookingId: string, reason: string) => void;
  refundBooking: (bookingId: string, reason: string) => void;

  // Influencer actions
  updateInfluencerProfile: (id: string, updates: Partial<InfluencerProfile>) => void;
  updateInfluencerRates: (id: string, rates: InfluencerProfile['rates'], voiceEnabled: boolean, videoEnabled: boolean) => void;
  updateInfluencerAvailability: (id: string, availability: InfluencerProfile['availability']) => void;
  addGalleryItem: (influencerId: string, item: { title: string; description: string; url: string; type: 'image' | 'video' }) => void;
  deleteGalleryItem: (influencerId: string, itemId: string) => void;
  requestPayout: (influencerId: string, amount: number, method: 'bank' | 'upi', destination: string) => void;

  // Admin Actions
  approveVerification: (influencerId: string) => void;
  rejectVerification: (influencerId: string, reason: string) => void;
  toggleUserStatus: (userId: string, action: 'activate' | 'suspend') => void;
  toggleInfluencerStatus: (influencerId: string, action: 'activate' | 'suspend') => void;
  approvePayout: (payoutId: string) => void;
  rejectPayout: (payoutId: string, reason: string) => void;
  updateSettings: (newSettings: Partial<PlatformSettings>) => void;
  broadcastAnnouncement: (targetAudience: 'all' | 'users' | 'influencers', title: string, message: string) => void;

  // Grievances
  submitGrievance: (ticket: {
    raisedBy: 'user' | 'influencer';
    submitterId: string;
    submitterName: string;
    submitterRole: UserRole;
    category: GrievanceTicket['category'];
    priority: GrievanceTicket['priority'];
    subject: string;
    description: string;
    bookingRef?: string;
  }) => void;
  replyToGrievance: (ticketId: string, message: string, isInternalNote?: boolean) => void;
  updateGrievanceStatus: (ticketId: string, status: GrievanceTicket['status']) => void;

  // Reviews
  addReview: (review: {
    bookingRef: string;
    influencerId: string;
    rating: number;
    comment: string;
    callType: CallType;
  }) => void;
  flagReview: (reviewId: string, reason: string) => void;
  moderateReview: (reviewId: string, hide: boolean) => void;

  // Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// URL / Path Normalization Helper
export const normalizePath = (rawPath: string): string => {
  if (!rawPath) return '/';
  
  let clean = rawPath.trim();
  // Support hash routing (e.g. "#/fan/bookings" -> "/fan/bookings")
  if (clean.includes('#')) {
    clean = clean.substring(clean.indexOf('#') + 1);
  }
  // Strip query string for path normalization
  const queryIndex = clean.indexOf('?');
  let pathOnly = queryIndex !== -1 ? clean.substring(0, queryIndex) : clean;

  if (!pathOnly.startsWith('/')) {
    pathOnly = '/' + pathOnly;
  }
  // Remove trailing slashes (except root '/')
  if (pathOnly.length > 1 && pathOnly.endsWith('/')) {
    pathOnly = pathOnly.replace(/\/+$/, '');
  }

  // Aliases & Legacy Route Normalizations
  if (pathOnly === '/home') return '/';
  if (pathOnly === '/login' || pathOnly === '/register') return '/auth';

  // Fan Portal Aliases
  if (pathOnly === '/user' || pathOnly === '/user/dashboard' || pathOnly === '/fan' || pathOnly === '/fan/explore') {
    return '/fan/dashboard';
  }
  if (pathOnly === '/user/bookings') return '/fan/bookings';
  if (pathOnly === '/user/grievances' || pathOnly === '/user/help') return '/fan/grievances';
  if (pathOnly === '/user/profile' || pathOnly === '/user/settings' || pathOnly === '/fan/settings') {
    return '/fan/profile';
  }
  if (pathOnly.startsWith('/user/creator/') || pathOnly.startsWith('/user/creators/')) {
    const id = pathOnly.split('/').pop();
    return `/fan/creators/${id}`;
  }

  // Influencer Portal Aliases
  if (pathOnly === '/influencer') return '/influencer/dashboard';
  if (pathOnly === '/influencer/profile-content') return '/influencer/profile';
  if (pathOnly === '/influencer/call-pricing') return '/influencer/rates';
  if (pathOnly === '/influencer/slots') return '/influencer/availability';
  if (pathOnly === '/influencer/payouts') return '/influencer/earnings';
  if (pathOnly === '/influencer/feedback') return '/influencer/reviews';

  // Admin Portal Aliases
  if (pathOnly === '/admin' || pathOnly === '/admin/overview') return '/admin/dashboard';
  if (pathOnly === '/admin/influencers') return '/admin/creators';

  return pathOnly;
};

export const getPathActiveView = (path: string): { view: string; influencerId?: string | null } => {
  const norm = normalizePath(path);
  if (norm.startsWith('/fan/creators/')) {
    const id = norm.replace('/fan/creators/', '');
    return { view: 'influencer-detail', influencerId: id };
  }
  if (norm === '/fan/bookings') return { view: 'bookings', influencerId: null };
  if (norm === '/fan/grievances') return { view: 'grievances', influencerId: null };
  if (norm === '/fan/profile') return { view: 'settings', influencerId: null };
  if (norm.startsWith('/fan')) return { view: 'explore', influencerId: null };

  if (norm === '/influencer/profile') return { view: 'profile-content', influencerId: null };
  if (norm === '/influencer/rates') return { view: 'call-pricing', influencerId: null };
  if (norm === '/influencer/availability') return { view: 'availability', influencerId: null };
  if (norm === '/influencer/bookings') return { view: 'bookings', influencerId: null };
  if (norm === '/influencer/earnings') return { view: 'payouts', influencerId: null };
  if (norm === '/influencer/reviews') return { view: 'reviews', influencerId: null };
  if (norm.startsWith('/influencer')) return { view: 'dashboard', influencerId: null };

  if (norm === '/admin/users') return { view: 'users', influencerId: null };
  if (norm === '/admin/creators') return { view: 'influencers', influencerId: null };
  if (norm === '/admin/bookings') return { view: 'bookings', influencerId: null };
  if (norm === '/admin/payments') return { view: 'payments', influencerId: null };
  if (norm === '/admin/commission') return { view: 'commission', influencerId: null };
  if (norm === '/admin/grievances') return { view: 'grievances', influencerId: null };
  if (norm === '/admin/moderation') return { view: 'moderation', influencerId: null };
  if (norm === '/admin/announcements') return { view: 'announcements', influencerId: null };
  if (norm === '/admin/reports') return { view: 'reports', influencerId: null };
  if (norm === '/admin/audit') return { view: 'audit', influencerId: null };
  if (norm.startsWith('/admin')) return { view: 'overview', influencerId: null };

  return { view: 'explore', influencerId: null };
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Collections State
  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('bms_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [influencers, setInfluencers] = useState<InfluencerProfile[]>(() => {
    const saved = localStorage.getItem('bms_influencers');
    return saved ? JSON.parse(saved) : INITIAL_INFLUENCERS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('bms_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [payouts, setPayouts] = useState<PayoutRequest[]>(() => {
    const saved = localStorage.getItem('bms_payouts');
    return saved ? JSON.parse(saved) : INITIAL_PAYOUTS;
  });

  const [grievances, setGrievances] = useState<GrievanceTicket[]>(() => {
    const saved = localStorage.getItem('bms_grievances');
    return saved ? JSON.parse(saved) : INITIAL_GRIEVANCES;
  });

  const [reviews, setReviews] = useState<ReviewItem[]>(() => {
    const saved = localStorage.getItem('bms_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => {
    const saved = localStorage.getItem('bms_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [notifications, setNotifications] = useState<PlatformNotification[]>(() => {
    const saved = localStorage.getItem('bms_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [settings, setSettings] = useState<PlatformSettings>(() => {
    const saved = localStorage.getItem('bms_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  // URL / Path Detection: support direct pathname, refresh, and hash routing
  const getInitialPath = (): string => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace(/^#/, '');
      if (hash && hash !== '/') return normalizePath(hash);
      if (window.location.pathname) return normalizePath(window.location.pathname);
    }
    return '/';
  };

  const initialPath = getInitialPath();
  const initialViewData = getPathActiveView(initialPath);

  const [currentPath, setCurrentPath] = useState<string>(initialPath);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('bms_auth_session');
    return !!saved;
  });

  const [currentRole, setCurrentRole] = useState<UserRole | null>(() => {
    const saved = localStorage.getItem('bms_auth_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.role || null;
      } catch {}
    }
    return null;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('bms_auth_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.role === 'user' && parsed.user) return parsed.user;
      } catch {}
    }
    return null;
  });

  const [currentInfluencer, setCurrentInfluencer] = useState<InfluencerProfile | null>(() => {
    const saved = localStorage.getItem('bms_auth_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.role === 'influencer' && parsed.influencer) return parsed.influencer;
      } catch {}
    }
    return null;
  });

  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('bms_auth_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.role === 'admin' && parsed.admin) return parsed.admin;
      } catch {}
    }
    return null;
  });

  // View state within active dashboard (derived and synced from path)
  const [activeView, setActiveView] = useState<string>(initialViewData.view);
  const [selectedInfluencerId, setSelectedInfluencerId] = useState<string | null>(initialViewData.influencerId || null);

  // Modals & Real-time
  const [activeCall, setActiveCall] = useState<ActiveCallData | null>(null);
  const [checkoutFlow, setCheckoutFlow] = useState<BookingCheckoutFlow | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('bms_users', JSON.stringify(users));
  }, [users]);
  useEffect(() => {
    localStorage.setItem('bms_influencers', JSON.stringify(influencers));
  }, [influencers]);
  useEffect(() => {
    localStorage.setItem('bms_bookings', JSON.stringify(bookings));
  }, [bookings]);
  useEffect(() => {
    localStorage.setItem('bms_payouts', JSON.stringify(payouts));
  }, [payouts]);
  useEffect(() => {
    localStorage.setItem('bms_grievances', JSON.stringify(grievances));
  }, [grievances]);
  useEffect(() => {
    localStorage.setItem('bms_reviews', JSON.stringify(reviews));
  }, [reviews]);
  useEffect(() => {
    localStorage.setItem('bms_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);
  useEffect(() => {
    localStorage.setItem('bms_notifications', JSON.stringify(notifications));
  }, [notifications]);
  useEffect(() => {
    localStorage.setItem('bms_settings', JSON.stringify(settings));
  }, [settings]);

  // Sync Session to LocalStorage
  useEffect(() => {
    if (isAuthenticated && currentRole) {
      localStorage.setItem('bms_auth_session', JSON.stringify({
        role: currentRole,
        user: currentUser,
        influencer: currentInfluencer,
        admin: currentAdmin
      }));
    } else {
      localStorage.removeItem('bms_auth_session');
    }
  }, [isAuthenticated, currentRole, currentUser, currentInfluencer, currentAdmin]);

  // Router listener for popstate (browser back/forward) and hashchange
  useEffect(() => {
    const handleLocationChange = () => {
      const path = getInitialPath();
      setCurrentPath(path);
      const viewData = getPathActiveView(path);
      setActiveView(viewData.view);
      if (viewData.influencerId !== undefined) {
        setSelectedInfluencerId(viewData.influencerId);
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigate = (path: string) => {
    const target = normalizePath(path);
    setCurrentPath(target);
    
    // Update browser address bar and history
    if (typeof window !== 'undefined') {
      if (window.location.pathname !== target) {
        window.history.pushState(null, '', target);
      }
    }

    // Synchronize active view & creator selection
    const viewData = getPathActiveView(target);
    setActiveView(viewData.view);
    if (viewData.influencerId !== undefined) {
      setSelectedInfluencerId(viewData.influencerId);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => prev === msg ? null : prev);
    }, 4000);
  };

  const addAuditLog = (action: string, targetType: AuditLogItem['targetType'], targetId: string, details: string, reason?: string) => {
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      adminName: currentAdmin?.name || 'Administrator',
      action,
      targetType,
      targetId,
      details,
      reason,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      ipAddress: '103.21.244.18'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // --- AUTHENTICATION IMPLEMENTATION ---

  // 1. User Sign In
  const loginUser = (identifier: string, password: string) => {
    const cleanId = identifier.trim().toLowerCase();
    const foundUser = users.find(u => 
      u.email.toLowerCase() === cleanId || 
      u.phone.replace(/\s+/g, '') === cleanId.replace(/\s+/g, '') ||
      cleanId.includes(u.name.toLowerCase().split(' ')[0])
    ) || users[0]; // fallback for demo if field filled

    if (foundUser.status === 'suspended') {
      return { success: false, message: 'Your account has been suspended by operations. Please contact support.' };
    }

    setIsAuthenticated(true);
    setCurrentRole('user');
    setCurrentUser(foundUser);
    setCurrentInfluencer(null);
    setCurrentAdmin(null);
    setActiveView('explore');
    navigate('/fan/dashboard');

    showToast(`Welcome back, ${foundUser.name}!`);
    return { success: true };
  };

  // 2. User Registration
  const registerUser = (details: { name: string; email: string; phone: string; password: string }) => {
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: details.name.trim(),
      email: details.email.trim(),
      phone: details.phone.trim(),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      role: 'user',
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      totalSpent: 0,
      totalBookings: 0
    };

    setUsers(prev => [newUser, ...prev]);
    setIsAuthenticated(true);
    setCurrentRole('user');
    setCurrentUser(newUser);
    setCurrentInfluencer(null);
    setCurrentAdmin(null);
    setActiveView('explore');
    navigate('/fan/dashboard');

    showToast(`Account created! Welcome to BookMyStar, ${newUser.name}.`);
    return { success: true };
  };

  // 3. Influencer Sign In
  const loginInfluencer = (identifier: string, password: string) => {
    const cleanId = identifier.trim().toLowerCase();
    const foundInf = influencers.find(i => 
      i.handle.toLowerCase() === cleanId ||
      i.name.toLowerCase().includes(cleanId)
    ) || influencers[0]; // fallback to top creator for demo ease

    setIsAuthenticated(true);
    setCurrentRole('influencer');
    setCurrentInfluencer(foundInf);
    setCurrentUser(null);
    setCurrentAdmin(null);
    setActiveView('dashboard');
    navigate('/influencer/dashboard');

    showToast(`Welcome to Creator Studio, ${foundInf.name}!`);
    return { success: true };
  };

  // 4. Influencer Registration
  const registerInfluencer = (details: { name: string; handle: string; email: string; phone: string; category: Category; bio?: string; password: string }) => {
    const formattedHandle = details.handle.startsWith('@') ? details.handle : `@${details.handle}`;
    const newInf: InfluencerProfile = {
      id: `inf-${Date.now()}`,
      name: details.name.trim(),
      handle: formattedHandle.trim(),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80',
      category: details.category,
      bio: details.bio?.trim() || `Creator and specialist in ${details.category}. Book 1-on-1 calls with me!`,
      isVerified: false,
      verificationStatus: 'pending',
      dob: '2001-08-14',
      age: 25,
      idDocUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
      idDocName: 'Govt_ID_Submitted.pdf',
      socialLinks: {},
      gallery: [],
      voiceCallEnabled: true,
      videoCallEnabled: true,
      rates: {
        voice10: 199,
        voice15: 299,
        voice30: 499,
        video10: 499,
        video15: 699,
        video30: 1299
      },
      rating: 5.0,
      reviewCount: 0,
      totalEarnings: 0,
      todayEarnings: 0,
      pendingBalance: 0,
      paidOutBalance: 0,
      completedCallsCount: 0,
      availability: {
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        timeSlots: ['04:00 PM', '05:30 PM', '07:00 PM'],
        blockedDates: []
      }
    };

    setInfluencers(prev => [newInf, ...prev]);
    setIsAuthenticated(true);
    setCurrentRole('influencer');
    setCurrentInfluencer(newInf);
    setCurrentUser(null);
    setCurrentAdmin(null);
    setActiveView('dashboard');
    navigate('/influencer/dashboard');

    showToast(`Application submitted! Welcome, ${newInf.name}. Your KYC is pending admin review.`);
    return { success: true };
  };

  // 5. Hidden Admin Login
  const loginAdmin = (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();
    
    // Check credentials (accepts admin@bookmystar.in or admin test passwords)
    if (!cleanEmail.includes('admin') && !cleanEmail.includes('bookmystar')) {
      return { success: false, message: 'Access Denied: Invalid administrator credentials.' };
    }

    const adminSession: AdminUser = {
      id: 'admin-super-1',
      name: 'Rajesh Verma',
      email: cleanEmail,
      role: 'Super Admin',
      accessLevel: 4
    };

    setIsAuthenticated(true);
    setCurrentRole('admin');
    setCurrentAdmin(adminSession);
    setCurrentUser(null);
    setCurrentInfluencer(null);
    setActiveView('overview');
    navigate('/admin/dashboard');

    addAuditLog('ADMIN_LOGIN', 'Settings', 'auth', `Admin ${adminSession.name} logged into Operations Console.`);
    showToast('Administrator authenticated with Root Privileges.');
    return { success: true };
  };

  // 6. Logout
  const logout = () => {
    const wasAdmin = currentRole === 'admin';
    setIsAuthenticated(false);
    setCurrentRole(null);
    setCurrentUser(null);
    setCurrentInfluencer(null);
    setCurrentAdmin(null);
    setActiveView('explore');
    setSelectedInfluencerId(null);
    setActiveCall(null);
    setCheckoutFlow(null);

    if (wasAdmin) {
      navigate('/admin/login');
    } else {
      navigate('/');
    }

    showToast('Signed out successfully.');
  };

  // Call Room actions
  const startCall = (booking: Booking, isInfluencer = false) => {
    setActiveCall({ booking, isInfluencerPerspective: isInfluencer });
  };

  const endCall = () => {
    setActiveCall(null);
  };

  const openCheckout = (data: BookingCheckoutFlow) => {
    setCheckoutFlow(data);
  };

  const closeCheckout = () => {
    setCheckoutFlow(null);
  };

  // Booking Flow
  const createBooking = async (details: {
    influencerId: string;
    callType: CallType;
    durationMinutes: number;
    scheduledDate: string;
    scheduledTime: string;
    amount: number;
    paymentMethod: 'upi' | 'card' | 'netbanking';
  }): Promise<Booking> => {
    const influencer = influencers.find(i => i.id === details.influencerId);
    if (!influencer) throw new Error('Influencer not found');

    const activeUser = currentUser || users[0];
    const commRate = settings.commissionRate / 100;
    const commAmount = parseFloat((details.amount * commRate).toFixed(2));
    const netEarnings = parseFloat((details.amount - commAmount).toFixed(2));
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const bookingRef = `BMS-${randomSuffix}`;

    const newBooking: Booking = {
      id: `bkg-${Date.now()}`,
      bookingRef,
      userId: activeUser.id,
      userName: activeUser.name,
      userAvatar: activeUser.avatar,
      userEmail: activeUser.email,
      userPhone: activeUser.phone,
      influencerId: influencer.id,
      influencerName: influencer.name,
      influencerAvatar: influencer.avatar,
      influencerCategory: influencer.category,
      callType: details.callType,
      durationMinutes: details.durationMinutes,
      scheduledDate: details.scheduledDate,
      scheduledTime: details.scheduledTime,
      amount: details.amount,
      commissionRate: commRate,
      commissionAmount: commAmount,
      influencerEarnings: netEarnings,
      paymentStatus: 'success',
      bookingStatus: 'upcoming',
      paymentMethod: details.paymentMethod,
      transactionId: `TXN-${details.paymentMethod.toUpperCase()}-${Math.floor(1000000 + Math.random() * 9000000)}`,
      paidAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      meetingUrl: `https://bookmystar.live/room/${bookingRef}`
    };

    setBookings(prev => [newBooking, ...prev]);

    setUsers(prev => prev.map(u => {
      if (u.id === activeUser.id) {
        return {
          ...u,
          totalSpent: u.totalSpent + details.amount,
          totalBookings: u.totalBookings + 1
        };
      }
      return u;
    }));

    setInfluencers(prev => prev.map(inf => {
      if (inf.id === details.influencerId) {
        return {
          ...inf,
          totalEarnings: inf.totalEarnings + netEarnings,
          todayEarnings: inf.todayEarnings + netEarnings,
          pendingBalance: inf.pendingBalance + netEarnings
        };
      }
      return inf;
    }));

    showToast(`Booking ${bookingRef} confirmed successfully!`);
    return newBooking;
  };

  const cancelBooking = (bookingId: string, reason: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return { ...b, bookingStatus: 'cancelled', cancellationReason: reason };
      }
      return b;
    }));
    showToast('Booking cancelled.');
  };

  const refundBooking = (bookingId: string, reason: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    const refundRef = `REF-${Math.floor(100000 + Math.random() * 900000)}`;

    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          paymentStatus: 'refunded',
          bookingStatus: 'refunded',
          refundRef,
          cancellationReason: reason
        };
      }
      return b;
    }));

    setInfluencers(prev => prev.map(inf => {
      if (inf.id === booking.influencerId) {
        return {
          ...inf,
          pendingBalance: Math.max(0, inf.pendingBalance - booking.influencerEarnings),
          totalEarnings: Math.max(0, inf.totalEarnings - booking.influencerEarnings)
        };
      }
      return inf;
    }));

    addAuditLog('PROCESS_REFUND', 'Booking', booking.bookingRef, `Full refund ₹${booking.amount} issued via ${refundRef}`, reason);
    showToast(`Refund of ₹${booking.amount} processed.`);
  };

  const updateInfluencerProfile = (id: string, updates: Partial<InfluencerProfile>) => {
    setInfluencers(prev => prev.map(inf => {
      if (inf.id === id) {
        const updated = { ...inf, ...updates };
        if (currentInfluencer?.id === id) setCurrentInfluencer(updated);
        return updated;
      }
      return inf;
    }));
    showToast('Profile updated.');
  };

  const updateInfluencerRates = (id: string, rates: InfluencerProfile['rates'], voiceEnabled: boolean, videoEnabled: boolean) => {
    setInfluencers(prev => prev.map(inf => {
      if (inf.id === id) {
        const updated = { ...inf, rates, voiceCallEnabled: voiceEnabled, videoCallEnabled: videoEnabled };
        if (currentInfluencer?.id === id) setCurrentInfluencer(updated);
        return updated;
      }
      return inf;
    }));
    showToast('Call rates updated.');
  };

  const updateInfluencerAvailability = (id: string, availability: InfluencerProfile['availability']) => {
    setInfluencers(prev => prev.map(inf => {
      if (inf.id === id) {
        const updated = { ...inf, availability };
        if (currentInfluencer?.id === id) setCurrentInfluencer(updated);
        return updated;
      }
      return inf;
    }));
    showToast('Schedule saved.');
  };

  const addGalleryItem = (influencerId: string, item: { title: string; description: string; url: string; type: 'image' | 'video' }) => {
    setInfluencers(prev => prev.map(inf => {
      if (inf.id === influencerId) {
        const newItem = {
          id: `gal-${Date.now()}`,
          ...item,
          isVisible: true,
          uploadedAt: new Date().toISOString().substring(0, 10)
        };
        const updated = { ...inf, gallery: [newItem, ...inf.gallery] };
        if (currentInfluencer?.id === influencerId) setCurrentInfluencer(updated);
        return updated;
      }
      return inf;
    }));
    showToast('Item added to portfolio.');
  };

  const deleteGalleryItem = (influencerId: string, itemId: string) => {
    setInfluencers(prev => prev.map(inf => {
      if (inf.id === influencerId) {
        const updated = { ...inf, gallery: inf.gallery.filter(g => g.id !== itemId) };
        if (currentInfluencer?.id === influencerId) setCurrentInfluencer(updated);
        return updated;
      }
      return inf;
    }));
    showToast('Item removed.');
  };

  const requestPayout = (influencerId: string, amount: number, method: 'bank' | 'upi', destination: string) => {
    const inf = influencers.find(i => i.id === influencerId);
    if (!inf) return;
    if (amount > inf.pendingBalance) {
      showToast('Insufficient pending balance!');
      return;
    }
    if (amount < settings.minPayoutAmount) {
      showToast(`Minimum payout amount is ₹${settings.minPayoutAmount}`);
      return;
    }

    const newPayout: PayoutRequest = {
      id: `pay-${Date.now()}`,
      payoutRef: `PAY-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      influencerId: inf.id,
      influencerName: inf.name,
      influencerAvatar: inf.avatar,
      amount,
      method,
      destination,
      status: 'pending',
      requestedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setPayouts(prev => [newPayout, ...prev]);

    setInfluencers(prev => prev.map(i => {
      if (i.id === influencerId) {
        const updated = { ...i, pendingBalance: i.pendingBalance - amount };
        if (currentInfluencer?.id === influencerId) setCurrentInfluencer(updated);
        return updated;
      }
      return i;
    }));

    showToast(`Payout request ${newPayout.payoutRef} for ₹${amount} submitted!`);
  };

  const approveVerification = (influencerId: string) => {
    setInfluencers(prev => prev.map(inf => {
      if (inf.id === influencerId) {
        return { ...inf, isVerified: true, verificationStatus: 'approved' };
      }
      return inf;
    }));
    addAuditLog('APPROVE_VERIFICATION', 'Influencer', influencerId, `Approved creator identity verification. Enabled paid booking status.`);
    showToast('Creator verified and approved for bookings!');
  };

  const rejectVerification = (influencerId: string, reason: string) => {
    setInfluencers(prev => prev.map(inf => {
      if (inf.id === influencerId) {
        return { ...inf, isVerified: false, verificationStatus: 'rejected', rejectionReason: reason };
      }
      return inf;
    }));
    addAuditLog('REJECT_VERIFICATION', 'Influencer', influencerId, `Verification rejected: ${reason}`, reason);
    showToast('Creator verification application rejected.');
  };

  const toggleUserStatus = (userId: string, action: 'activate' | 'suspend') => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, status: action === 'activate' ? 'active' : 'suspended' };
      }
      return u;
    }));
    addAuditLog(action === 'activate' ? 'ACTIVATE_USER' : 'SUSPEND_USER', 'User', userId, `User account ${action}d by administrator.`);
    showToast(`User account ${action}d.`);
  };

  const toggleInfluencerStatus = (influencerId: string, action: 'activate' | 'suspend') => {
    setInfluencers(prev => prev.map(inf => {
      if (inf.id === influencerId) {
        return { ...inf, isVerified: action === 'activate' };
      }
      return inf;
    }));
    addAuditLog(action === 'activate' ? 'ACTIVATE_INFLUENCER' : 'SUSPEND_INFLUENCER', 'Influencer', influencerId, `Creator account ${action}d.`);
    showToast(`Creator account ${action}d.`);
  };

  const approvePayout = (payoutId: string) => {
    const utr = `UTR-BMS-${Math.floor(100000000 + Math.random() * 900000000)}`;
    const payout = payouts.find(p => p.id === payoutId);
    if (!payout) return;

    setPayouts(prev => prev.map(p => {
      if (p.id === payoutId) {
        return {
          ...p,
          status: 'paid',
          processedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          utrRef: utr
        };
      }
      return p;
    }));

    setInfluencers(prev => prev.map(i => {
      if (i.id === payout.influencerId) {
        return { ...i, paidOutBalance: i.paidOutBalance + payout.amount };
      }
      return i;
    }));

    addAuditLog('APPROVE_PAYOUT', 'Payout', payout.payoutRef, `Disbursed ₹${payout.amount} to ${payout.influencerName}. Bank UTR: ${utr}`);
    showToast(`Payout ${payout.payoutRef} approved! UTR: ${utr}`);
  };

  const rejectPayout = (payoutId: string, reason: string) => {
    const payout = payouts.find(p => p.id === payoutId);
    if (!payout) return;

    setPayouts(prev => prev.map(p => {
      if (p.id === payoutId) {
        return { ...p, status: 'rejected', rejectionReason: reason };
      }
      return p;
    }));

    setInfluencers(prev => prev.map(i => {
      if (i.id === payout.influencerId) {
        return { ...i, pendingBalance: i.pendingBalance + payout.amount };
      }
      return i;
    }));

    addAuditLog('REJECT_PAYOUT', 'Payout', payout.payoutRef, `Payout rejected: ${reason}`, reason);
    showToast('Payout rejected. Funds restored to creator balance.');
  };

  const updateSettings = (newSettings: Partial<PlatformSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    addAuditLog('UPDATE_SETTINGS', 'Settings', 'global', `Platform settings adjusted.`);
    showToast('Settings saved.');
  };

  const broadcastAnnouncement = (targetAudience: 'all' | 'users' | 'influencers', title: string, message: string) => {
    const notif: PlatformNotification = {
      id: `ann-${Date.now()}`,
      targetAudience,
      title,
      message,
      type: 'system',
      read: false,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setNotifications(prev => [notif, ...prev]);
    addAuditLog('BROADCAST_ANNOUNCEMENT', 'Settings', 'broadcast', `Sent announcement: "${title}"`);
    showToast('Announcement broadcasted.');
  };

  const submitGrievance = (ticket: {
    raisedBy: 'user' | 'influencer';
    submitterId: string;
    submitterName: string;
    submitterRole: UserRole;
    category: GrievanceTicket['category'];
    priority: GrievanceTicket['priority'];
    subject: string;
    description: string;
    bookingRef?: string;
  }) => {
    const newGrievance: GrievanceTicket = {
      id: `grv-${Date.now()}`,
      ticketRef: `GRV-${Math.floor(1000 + Math.random() * 9000)}`,
      raisedBy: ticket.raisedBy,
      submitterId: ticket.submitterId,
      submitterName: ticket.submitterName,
      submitterRole: ticket.submitterRole,
      bookingRef: ticket.bookingRef,
      category: ticket.category,
      priority: ticket.priority,
      subject: ticket.subject,
      description: ticket.description,
      status: 'open',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      responses: [
        {
          id: `resp-${Date.now()}`,
          sender: ticket.submitterName,
          role: ticket.submitterRole,
          message: ticket.description,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
        }
      ]
    };

    setGrievances(prev => [newGrievance, ...prev]);
    showToast(`Support ticket ${newGrievance.ticketRef} created.`);
  };

  const replyToGrievance = (ticketId: string, message: string, isInternalNote = false) => {
    setGrievances(prev => prev.map(g => {
      if (g.id === ticketId) {
        const senderName = currentRole === 'admin' 
          ? (currentAdmin?.name || 'Support Staff') 
          : (currentRole === 'user' ? (currentUser?.name || 'User') : (currentInfluencer?.name || 'Creator'));
        
        const newResponse = {
          id: `resp-${Date.now()}`,
          sender: senderName,
          role: currentRole || 'user',
          message,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          isInternalNote
        };
        return {
          ...g,
          status: currentRole === 'admin' && !isInternalNote ? 'in_progress' : g.status,
          updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          responses: [...g.responses, newResponse]
        };
      }
      return g;
    }));
    showToast(isInternalNote ? 'Internal note added.' : 'Reply sent.');
  };

  const updateGrievanceStatus = (ticketId: string, status: GrievanceTicket['status']) => {
    setGrievances(prev => prev.map(g => {
      if (g.id === ticketId) {
        return { ...g, status, updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16) };
      }
      return g;
    }));
    addAuditLog('UPDATE_GRIEVANCE_STATUS', 'User', ticketId, `Grievance ticket marked as ${status}`);
    showToast(`Ticket status updated to ${status}.`);
  };

  const addReview = (review: {
    bookingRef: string;
    influencerId: string;
    rating: number;
    comment: string;
    callType: CallType;
  }) => {
    const inf = influencers.find(i => i.id === review.influencerId);
    const activeUser = currentUser || users[0];
    const newRev: ReviewItem = {
      id: `rev-${Date.now()}`,
      bookingRef: review.bookingRef,
      userId: activeUser.id,
      userName: activeUser.name,
      userAvatar: activeUser.avatar,
      influencerId: review.influencerId,
      influencerName: inf ? inf.name : 'Creator',
      rating: review.rating,
      comment: review.comment,
      callType: review.callType,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      isFlagged: false,
      isHidden: false
    };

    setReviews(prev => [newRev, ...prev]);

    if (inf) {
      const creatorReviews = reviews.filter(r => r.influencerId === inf.id && !r.isHidden);
      const totalRatings = creatorReviews.reduce((sum, r) => sum + r.rating, review.rating);
      const count = creatorReviews.length + 1;
      const newAvg = parseFloat((totalRatings / count).toFixed(2));

      setInfluencers(prev => prev.map(i => {
        if (i.id === inf.id) {
          return { ...i, rating: newAvg, reviewCount: count };
        }
        return i;
      }));
    }

    showToast('Review submitted!');
  };

  const flagReview = (reviewId: string, reason: string) => {
    setReviews(prev => prev.map(r => {
      if (r.id === reviewId) {
        return { ...r, isFlagged: true, flagReason: reason };
      }
      return r;
    }));
    showToast('Review reported to administration.');
  };

  const moderateReview = (reviewId: string, hide: boolean) => {
    setReviews(prev => prev.map(r => {
      if (r.id === reviewId) {
        return { ...r, isHidden: hide, isFlagged: false };
      }
      return r;
    }));
    addAuditLog('MODERATE_REVIEW', 'Content', reviewId, hide ? 'Hidden review' : 'Restored review');
    showToast(hide ? 'Review hidden.' : 'Review approved.');
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        currentRole,
        currentUser,
        currentInfluencer,
        currentAdmin,
        currentPath,
        navigate,
        loginUser,
        registerUser,
        loginInfluencer,
        registerInfluencer,
        loginAdmin,
        logout,
        activeView,
        setActiveView,
        selectedInfluencerId,
        setSelectedInfluencerId,
        users,
        influencers,
        bookings,
        payouts,
        grievances,
        reviews,
        auditLogs,
        notifications,
        settings,
        activeCall,
        startCall,
        endCall,
        checkoutFlow,
        openCheckout,
        closeCheckout,
        createBooking,
        cancelBooking,
        refundBooking,
        updateInfluencerProfile,
        updateInfluencerRates,
        updateInfluencerAvailability,
        addGalleryItem,
        deleteGalleryItem,
        requestPayout,
        approveVerification,
        rejectVerification,
        toggleUserStatus,
        toggleInfluencerStatus,
        approvePayout,
        rejectPayout,
        updateSettings,
        broadcastAnnouncement,
        submitGrievance,
        replyToGrievance,
        updateGrievanceStatus,
        addReview,
        flagReview,
        moderateReview,
        toastMessage,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
