import { 
  UserProfile, 
  InfluencerProfile, 
  Booking, 
  PayoutRequest, 
  GrievanceTicket, 
  ReviewItem, 
  AuditLogItem, 
  PlatformNotification, 
  PlatformSettings 
} from '../types';

export const INITIAL_SETTINGS: PlatformSettings = {
  commissionRate: 15, // 15% platform fee
  minPayoutAmount: 500, // ₹500 min withdrawal
  requireVerificationForBooking: true,
  lockSlotDurationMinutes: 10,
  allowUserRescheduling: true,
  maintenanceMode: false
};

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'usr-1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@gmail.com',
    phone: '+91 98201 44810',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    role: 'user',
    status: 'active',
    createdAt: '2026-08-12',
    totalSpent: 3497,
    totalBookings: 5
  },
  {
    id: 'usr-2',
    name: 'Priya Mehra',
    email: 'priya.m@outlook.com',
    phone: '+91 98450 19321',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    role: 'user',
    status: 'active',
    createdAt: '2026-09-01',
    totalSpent: 1298,
    totalBookings: 2
  },
  {
    id: 'usr-3',
    name: 'Rohan Gupta',
    email: 'rohan.tech@gmail.com',
    phone: '+91 99100 87342',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    role: 'user',
    status: 'active',
    createdAt: '2026-09-18',
    totalSpent: 499,
    totalBookings: 1
  },
  {
    id: 'usr-4',
    name: 'Sneha Patel',
    email: 'sneha.patel99@gmail.com',
    phone: '+91 97234 11209',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'user',
    status: 'suspended',
    createdAt: '2026-07-22',
    totalSpent: 199,
    totalBookings: 1
  }
];

export const INITIAL_INFLUENCERS: InfluencerProfile[] = [
  {
    id: 'inf-1',
    name: 'Vikram "Vortex" Rajput',
    handle: '@vortex_esports',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=300&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
    category: 'Gaming',
    bio: 'Pro Esports athlete & battle royale tournament MVP. Book a call for 1-on-1 gameplay analysis, squad tactics, and streaming career guidance.',
    isVerified: true,
    verificationStatus: 'approved',
    dob: '1998-05-14',
    age: 28,
    idDocUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
    idDocName: 'Government_PAN_Card_Vikram.pdf',
    socialLinks: {
      youtube: 'https://youtube.com/@vortex_esports',
      instagram: 'https://instagram.com/vortex_gaming',
      twitter: 'https://twitter.com/vortex_live'
    },
    gallery: [
      {
        id: 'gal-1',
        title: 'Tournament Championship Finals Trophy',
        description: 'Lifting the national battle royale cup with the squad in Mumbai.',
        url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80',
        type: 'image',
        isVisible: true,
        uploadedAt: '2026-10-01'
      },
      {
        id: 'gal-2',
        title: 'High-Tech Studio Setup Tour',
        description: 'Dual PC rig with 360Hz monitor and broadcast mic.',
        url: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=600&auto=format&fit=crop&q=80',
        type: 'image',
        isVisible: true,
        uploadedAt: '2026-10-05'
      }
    ],
    voiceCallEnabled: true,
    videoCallEnabled: true,
    rates: {
      voice10: 199,
      voice15: 299,
      voice30: 549,
      video10: 499,
      video15: 699,
      video30: 1299
    },
    rating: 4.9,
    reviewCount: 42,
    totalEarnings: 24800,
    todayEarnings: 1198,
    pendingBalance: 4200,
    paidOutBalance: 20600,
    completedCallsCount: 38,
    availability: {
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      timeSlots: ['02:00 PM', '03:00 PM', '04:30 PM', '06:00 PM', '07:30 PM', '09:00 PM'],
      blockedDates: ['2026-11-25']
    },
    payoutDetails: {
      method: 'bank',
      bankName: 'HDFC Bank',
      accountHolderName: 'Vikram Rajput',
      accountNumber: '•••• •••• 4902',
      ifsc: 'HDFC0001244'
    }
  },
  {
    id: 'inf-2',
    name: 'Ananya Roy',
    handle: '@ananya_acoustics',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80',
    category: 'Music',
    bio: 'Singer-songwriter & vocal coach with 1.2M listeners. Let’s collaborate on songwriting, vocal warmup techniques, or industry release strategies.',
    isVerified: true,
    verificationStatus: 'approved',
    dob: '1999-11-20',
    age: 26,
    idDocUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
    idDocName: 'Aadhaar_Card_Ananya.pdf',
    socialLinks: {
      instagram: 'https://instagram.com/ananya_roy_music',
      youtube: 'https://youtube.com/@ananyaroymusic',
      twitter: 'https://twitter.com/ananya_tunes'
    },
    gallery: [
      {
        id: 'gal-3',
        title: 'Acoustic Studio Session',
        description: 'Behind the scenes recording my latest single.',
        url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
        type: 'image',
        isVisible: true,
        uploadedAt: '2026-09-15'
      }
    ],
    voiceCallEnabled: true,
    videoCallEnabled: true,
    rates: {
      voice10: 249,
      voice15: 349,
      voice30: 649,
      video10: 599,
      video15: 799,
      video30: 1499
    },
    rating: 5.0,
    reviewCount: 31,
    totalEarnings: 18950,
    todayEarnings: 599,
    pendingBalance: 2950,
    paidOutBalance: 16000,
    completedCallsCount: 29,
    availability: {
      days: ['Mon', 'Wed', 'Fri', 'Sun'],
      timeSlots: ['11:00 AM', '01:00 PM', '05:00 PM', '07:00 PM', '08:30 PM'],
      blockedDates: []
    },
    payoutDetails: {
      method: 'upi',
      upiId: 'ananya.sing@oksbi'
    }
  },
  {
    id: 'inf-3',
    name: 'Kabir Dev',
    handle: '@kabir_techpulse',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
    category: 'Tech & Coding',
    bio: 'Staff Engineer & Tech Content Creator. 1-on-1 mock interviews, system design teardowns, and tech career roadmapping for top product companies.',
    isVerified: true,
    verificationStatus: 'approved',
    dob: '1995-03-08',
    age: 31,
    idDocUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
    idDocName: 'Passport_Scan_KabirDev.pdf',
    socialLinks: {
      youtube: 'https://youtube.com/@techpulse_kabir',
      twitter: 'https://twitter.com/kabir_dev',
      instagram: 'https://instagram.com/kabir_codes'
    },
    gallery: [
      {
        id: 'gal-4',
        title: 'Keynote Speaker at TechCon 2026',
        description: 'Speaking on Distributed AI Architecture.',
        url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&auto=format&fit=crop&q=80',
        type: 'image',
        isVisible: true,
        uploadedAt: '2026-10-12'
      }
    ],
    voiceCallEnabled: true,
    videoCallEnabled: true,
    rates: {
      voice10: 299,
      voice15: 449,
      voice30: 899,
      video10: 699,
      video15: 999,
      video30: 1899
    },
    rating: 4.95,
    reviewCount: 56,
    totalEarnings: 39400,
    todayEarnings: 1698,
    pendingBalance: 5400,
    paidOutBalance: 34000,
    completedCallsCount: 48,
    availability: {
      days: ['Tue', 'Thu', 'Sat', 'Sun'],
      timeSlots: ['10:00 AM', '11:30 AM', '04:00 PM', '06:30 PM', '08:00 PM'],
      blockedDates: []
    },
    payoutDetails: {
      method: 'bank',
      bankName: 'ICICI Bank',
      accountHolderName: 'Kabir Dev',
      accountNumber: '•••• •••• 9811',
      ifsc: 'ICIC0000392'
    }
  },
  {
    id: 'inf-4',
    name: 'Mira Kapoor',
    handle: '@mira_glow',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop&q=80',
    category: 'Fashion & Beauty',
    bio: 'Luxury fashion stylist and skincare consultant. Personalized wardrobe overhaul, event styling advice, and dermat-tested skincare routines.',
    isVerified: true,
    verificationStatus: 'approved',
    dob: '1997-08-19',
    age: 29,
    idDocUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
    idDocName: 'Drivers_License_Mira.pdf',
    socialLinks: {
      instagram: 'https://instagram.com/miraglowstyle',
      youtube: 'https://youtube.com/@mirakapoorofficial'
    },
    gallery: [
      {
        id: 'gal-5',
        title: 'Lakme Fashion Week Backstage',
        description: 'Styling celebrity showstoppers.',
        url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&auto=format&fit=crop&q=80',
        type: 'image',
        isVisible: true,
        uploadedAt: '2026-10-18'
      }
    ],
    voiceCallEnabled: false,
    videoCallEnabled: true,
    rates: {
      voice10: 199,
      voice15: 299,
      voice30: 499,
      video10: 549,
      video15: 799,
      video30: 1399
    },
    rating: 4.88,
    reviewCount: 28,
    totalEarnings: 15400,
    todayEarnings: 0,
    pendingBalance: 1900,
    paidOutBalance: 13500,
    completedCallsCount: 22,
    availability: {
      days: ['Mon', 'Tue', 'Thu', 'Fri'],
      timeSlots: ['03:00 PM', '04:30 PM', '06:00 PM', '07:30 PM'],
      blockedDates: []
    },
    payoutDetails: {
      method: 'upi',
      upiId: 'mira.style@okicici'
    }
  },
  {
    id: 'inf-5',
    name: 'Coach Rannvijay',
    handle: '@rannvijay_fit',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200&auto=format&fit=crop&q=80',
    category: 'Fitness & Health',
    bio: 'Certified Sports Nutritionist & Strength Coach. Calorie profiling, personalized home/gym split routines, and fat loss plateaus addressed in real-time.',
    isVerified: true,
    verificationStatus: 'approved',
    dob: '1993-02-11',
    age: 33,
    idDocUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
    idDocName: 'Govt_ID_Rannvijay.pdf',
    socialLinks: {
      instagram: 'https://instagram.com/coach_rannvijay',
      youtube: 'https://youtube.com/@rannvijayfit'
    },
    gallery: [
      {
        id: 'gal-6',
        title: 'Client Transformation Bootcamp',
        description: '12-week body recomposition results.',
        url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80',
        type: 'image',
        isVisible: true,
        uploadedAt: '2026-10-22'
      }
    ],
    voiceCallEnabled: true,
    videoCallEnabled: true,
    rates: {
      voice10: 199,
      voice15: 299,
      voice30: 599,
      video10: 449,
      video15: 649,
      video30: 1199
    },
    rating: 4.92,
    reviewCount: 39,
    totalEarnings: 21300,
    todayEarnings: 449,
    pendingBalance: 3200,
    paidOutBalance: 18100,
    completedCallsCount: 35,
    availability: {
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      timeSlots: ['06:30 AM', '08:00 AM', '09:30 AM', '05:00 PM', '06:30 PM'],
      blockedDates: []
    },
    payoutDetails: {
      method: 'bank',
      bankName: 'Axis Bank',
      accountHolderName: 'Rannvijay Singh',
      accountNumber: '•••• •••• 7731',
      ifsc: 'UTIB0001882'
    }
  },
  {
    id: 'inf-6',
    name: 'Zoya Khan',
    handle: '@zoya_standup',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=1200&auto=format&fit=crop&q=80',
    category: 'Comedy & Entertainment',
    bio: 'Standup comic & digital satirist with 3 Amazon specials. Have a fun roast session, brainstorm comedy scripts, or just chill and chat!',
    isVerified: false,
    verificationStatus: 'pending',
    dob: '2000-04-16',
    age: 26,
    idDocUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
    idDocName: 'Voter_ID_ZoyaKhan.pdf',
    socialLinks: {
      instagram: 'https://instagram.com/zoyalaughs',
      youtube: 'https://youtube.com/@zoyakhan'
    },
    gallery: [
      {
        id: 'gal-7',
        title: 'Housefull Auditorium in Bangalore',
        description: 'Standup special live recording.',
        url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80',
        type: 'image',
        isVisible: true,
        uploadedAt: '2026-11-01'
      }
    ],
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
    rating: 0,
    reviewCount: 0,
    totalEarnings: 0,
    todayEarnings: 0,
    pendingBalance: 0,
    paidOutBalance: 0,
    completedCallsCount: 0,
    availability: {
      days: ['Fri', 'Sat', 'Sun'],
      timeSlots: ['05:00 PM', '07:00 PM', '09:00 PM'],
      blockedDates: []
    },
    payoutDetails: {
      method: 'upi',
      upiId: 'zoyakhan@paytm'
    }
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bkg-1',
    bookingRef: 'BMS-91024',
    userId: 'usr-1',
    userName: 'Aarav Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    userEmail: 'aarav.sharma@gmail.com',
    userPhone: '+91 98201 44810',
    influencerId: 'inf-1',
    influencerName: 'Vikram "Vortex" Rajput',
    influencerAvatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
    influencerCategory: 'Gaming',
    callType: 'video',
    durationMinutes: 10,
    scheduledDate: '2026-11-12',
    scheduledTime: '06:00 PM',
    amount: 499,
    commissionRate: 0.15,
    commissionAmount: 74.85,
    influencerEarnings: 424.15,
    paymentStatus: 'success',
    bookingStatus: 'upcoming',
    paymentMethod: 'upi',
    transactionId: 'TXN-UPI-9921448',
    paidAt: '2026-11-10 18:24',
    meetingUrl: 'https://bookmystar.live/room/BMS-91024'
  },
  {
    id: 'bkg-2',
    bookingRef: 'BMS-88410',
    userId: 'usr-2',
    userName: 'Priya Mehra',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    userEmail: 'priya.m@outlook.com',
    userPhone: '+91 98450 19321',
    influencerId: 'inf-2',
    influencerName: 'Ananya Roy',
    influencerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    influencerCategory: 'Music',
    callType: 'video',
    durationMinutes: 15,
    scheduledDate: '2026-11-13',
    scheduledTime: '05:00 PM',
    amount: 799,
    commissionRate: 0.15,
    commissionAmount: 119.85,
    influencerEarnings: 679.15,
    paymentStatus: 'success',
    bookingStatus: 'upcoming',
    paymentMethod: 'card',
    transactionId: 'TXN-CRD-8821901',
    paidAt: '2026-11-10 14:10',
    meetingUrl: 'https://bookmystar.live/room/BMS-88410'
  },
  {
    id: 'bkg-3',
    bookingRef: 'BMS-74190',
    userId: 'usr-3',
    userName: 'Rohan Gupta',
    userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    userEmail: 'rohan.tech@gmail.com',
    userPhone: '+91 99100 87342',
    influencerId: 'inf-3',
    influencerName: 'Kabir Dev',
    influencerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    influencerCategory: 'Tech & Coding',
    callType: 'video',
    durationMinutes: 10,
    scheduledDate: '2026-11-09',
    scheduledTime: '04:00 PM',
    amount: 699,
    commissionRate: 0.15,
    commissionAmount: 104.85,
    influencerEarnings: 594.15,
    paymentStatus: 'success',
    bookingStatus: 'completed',
    paymentMethod: 'upi',
    transactionId: 'TXN-UPI-7718290',
    paidAt: '2026-11-08 20:05'
  },
  {
    id: 'bkg-4',
    bookingRef: 'BMS-61029',
    userId: 'usr-1',
    userName: 'Aarav Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    userEmail: 'aarav.sharma@gmail.com',
    userPhone: '+91 98201 44810',
    influencerId: 'inf-5',
    influencerName: 'Coach Rannvijay',
    influencerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    influencerCategory: 'Fitness & Health',
    callType: 'voice',
    durationMinutes: 10,
    scheduledDate: '2026-11-05',
    scheduledTime: '08:00 AM',
    amount: 199,
    commissionRate: 0.15,
    commissionAmount: 29.85,
    influencerEarnings: 169.15,
    paymentStatus: 'success',
    bookingStatus: 'completed',
    paymentMethod: 'netbanking',
    transactionId: 'TXN-NB-6618491',
    paidAt: '2026-11-04 11:30'
  },
  {
    id: 'bkg-5',
    bookingRef: 'BMS-50912',
    userId: 'usr-4',
    userName: 'Sneha Patel',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    userEmail: 'sneha.patel99@gmail.com',
    userPhone: '+91 97234 11209',
    influencerId: 'inf-4',
    influencerName: 'Mira Kapoor',
    influencerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    influencerCategory: 'Fashion & Beauty',
    callType: 'video',
    durationMinutes: 10,
    scheduledDate: '2026-10-28',
    scheduledTime: '03:00 PM',
    amount: 549,
    commissionRate: 0.15,
    commissionAmount: 82.35,
    influencerEarnings: 466.65,
    paymentStatus: 'refunded',
    bookingStatus: 'refunded',
    refundRef: 'REF-884910',
    cancellationReason: 'Technical audio disconnect during session. Full refund issued.',
    paymentMethod: 'upi',
    transactionId: 'TXN-UPI-5510928',
    paidAt: '2026-10-27 15:45'
  }
];

export const INITIAL_PAYOUTS: PayoutRequest[] = [
  {
    id: 'pay-1',
    payoutRef: 'PAY-2026-901',
    influencerId: 'inf-1',
    influencerName: 'Vikram "Vortex" Rajput',
    influencerAvatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
    amount: 4200,
    method: 'bank',
    destination: 'HDFC Bank (•••• 4902)',
    status: 'pending',
    requestedAt: '2026-11-10 11:20'
  },
  {
    id: 'pay-2',
    payoutRef: 'PAY-2026-890',
    influencerId: 'inf-3',
    influencerName: 'Kabir Dev',
    influencerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    amount: 5400,
    method: 'bank',
    destination: 'ICICI Bank (•••• 9811)',
    status: 'processing',
    requestedAt: '2026-11-09 17:45'
  },
  {
    id: 'pay-3',
    payoutRef: 'PAY-2026-784',
    influencerId: 'inf-2',
    influencerName: 'Ananya Roy',
    influencerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    amount: 8500,
    method: 'upi',
    destination: 'ananya.sing@oksbi',
    status: 'paid',
    requestedAt: '2026-11-01 10:15',
    processedAt: '2026-11-02 14:30',
    utrRef: 'UTR-HDFC-991823901'
  }
];

export const INITIAL_GRIEVANCES: GrievanceTicket[] = [
  {
    id: 'grv-1',
    ticketRef: 'GRV-7402',
    raisedBy: 'user',
    submitterId: 'usr-4',
    submitterName: 'Sneha Patel',
    submitterRole: 'user',
    targetId: 'inf-4',
    targetName: 'Mira Kapoor',
    bookingRef: 'BMS-50912',
    category: 'call',
    priority: 'high',
    subject: 'Audio connection dropped after 2 minutes',
    description: 'During the video call, the audio cut off completely on both ends and could not be recovered. Requesting a full refund.',
    status: 'resolved',
    assignedTo: 'Super Admin',
    createdAt: '2026-10-28 15:40',
    updatedAt: '2026-10-28 17:15',
    responses: [
      {
        id: 'resp-1',
        sender: 'Sneha Patel',
        role: 'user',
        message: 'The call disconnected abruptly. Please check the logs.',
        timestamp: '2026-10-28 15:40'
      },
      {
        id: 'resp-2',
        sender: 'Super Admin',
        role: 'admin',
        message: 'Checked WebRTC connection records; confirmed packet loss anomaly. Initiated 100% refund of ₹549 to original UPI payment.',
        timestamp: '2026-10-28 17:15',
        isInternalNote: false
      }
    ]
  },
  {
    id: 'grv-2',
    ticketRef: 'GRV-8109',
    raisedBy: 'influencer',
    submitterId: 'inf-1',
    submitterName: 'Vikram "Vortex" Rajput',
    submitterRole: 'influencer',
    targetId: 'usr-3',
    targetName: 'Rohan Gupta',
    category: 'behaviour',
    priority: 'medium',
    subject: 'User asking inappropriate non-esports personal queries',
    description: 'A user kept insisting on sharing private home address during a coaching session. Requesting platform guidance.',
    status: 'in_progress',
    assignedTo: 'Safety & Trust Team',
    createdAt: '2026-11-09 19:10',
    updatedAt: '2026-11-10 09:30',
    responses: [
      {
        id: 'resp-3',
        sender: 'Vikram "Vortex" Rajput',
        role: 'influencer',
        message: 'Reporting user behavior that breached creator boundary policy.',
        timestamp: '2026-11-09 19:10'
      },
      {
        id: 'resp-4',
        sender: 'Super Admin',
        role: 'admin',
        message: 'Warning note sent to user account. Incident tagged for 30-day monitor.',
        timestamp: '2026-11-10 09:30'
      }
    ]
  },
  {
    id: 'grv-3',
    ticketRef: 'GRV-9210',
    raisedBy: 'user',
    submitterId: 'usr-2',
    submitterName: 'Priya Mehra',
    submitterRole: 'user',
    category: 'payment',
    priority: 'low',
    subject: 'Need GST invoice receipt for business expense filing',
    description: 'Can you please provide the signed tax invoice for booking BMS-88410?',
    status: 'open',
    createdAt: '2026-11-10 16:00',
    updatedAt: '2026-11-10 16:00',
    responses: []
  }
];

export const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    bookingRef: 'BMS-74190',
    userId: 'usr-3',
    userName: 'Rohan Gupta',
    userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    influencerId: 'inf-3',
    influencerName: 'Kabir Dev',
    rating: 5,
    comment: 'Mindblowing 1-on-1 system design breakdown! Kabir dissected my distributed cache architecture in 15 minutes with actionable tips. Totally worth every rupee!',
    callType: 'video',
    createdAt: '2026-11-09 16:30',
    isFlagged: false,
    isHidden: false
  },
  {
    id: 'rev-2',
    bookingRef: 'BMS-61029',
    userId: 'usr-1',
    userName: 'Aarav Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    influencerId: 'inf-5',
    influencerName: 'Coach Rannvijay',
    rating: 5,
    comment: 'Super practical workout adjustments and clear calorie deficit plan. Rannvijay was punctual and motivating!',
    callType: 'voice',
    createdAt: '2026-11-05 08:30',
    isFlagged: false,
    isHidden: false
  },
  {
    id: 'rev-3',
    bookingRef: 'BMS-41098',
    userId: 'usr-2',
    userName: 'Priya Mehra',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    influencerId: 'inf-2',
    influencerName: 'Ananya Roy',
    rating: 5,
    comment: 'Ananya gave wonderful feedback on my vocal breath control. She even sang a verse with me on video. Dream come true moment!',
    callType: 'video',
    createdAt: '2026-10-20 18:00',
    isFlagged: false,
    isHidden: false
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'log-1',
    adminName: 'Super Admin (Rajesh)',
    action: 'APPROVE_VERIFICATION',
    targetType: 'Influencer',
    targetId: 'inf-1',
    details: 'Verified government identity credentials and approved Vortex Esports for paid booking calls.',
    timestamp: '2026-10-01 10:14',
    ipAddress: '103.21.244.18'
  },
  {
    id: 'log-2',
    adminName: 'Super Admin (Rajesh)',
    action: 'PROCESS_REFUND',
    targetType: 'Booking',
    targetId: 'bkg-5',
    details: 'Issued full refund ₹549 for BMS-50912 due to confirmed WebRTC connection failure.',
    reason: 'Policy-backed technical disruption refund',
    timestamp: '2026-10-28 17:16',
    ipAddress: '103.21.244.18'
  },
  {
    id: 'log-3',
    adminName: 'Support Manager (Neha)',
    action: 'SUSPEND_USER',
    targetType: 'User',
    targetId: 'usr-4',
    details: 'Account temporarily suspended pending investigation of suspicious multiple card failures.',
    reason: 'Risk & Fraud alert rule #42',
    timestamp: '2026-10-29 11:05',
    ipAddress: '103.21.244.22'
  },
  {
    id: 'log-4',
    adminName: 'Super Admin (Rajesh)',
    action: 'UPDATE_COMMISSION',
    targetType: 'Settings',
    targetId: 'platform_config',
    details: 'Configured platform standard commission rate to 15.0%.',
    timestamp: '2026-11-01 09:00',
    ipAddress: '103.21.244.18'
  }
];

export const INITIAL_NOTIFICATIONS: PlatformNotification[] = [
  {
    id: 'notif-1',
    targetAudience: 'all',
    title: 'Diwali Creator Fest announced!',
    message: 'Book calls with top gaming & entertainment stars with 0% gateway charges this weekend.',
    type: 'system',
    read: false,
    createdAt: '2026-11-10 08:00'
  },
  {
    id: 'notif-2',
    targetAudience: 'influencers',
    title: 'Payout Dispatched',
    message: 'Your payout request of ₹8,500 has been credited via UPI reference UTR-HDFC-991823901.',
    type: 'payout',
    read: true,
    createdAt: '2026-11-02 14:35'
  },
  {
    id: 'notif-3',
    targetAudience: 'users',
    recipientId: 'usr-1',
    title: 'Booking Confirmed!',
    message: 'Your 10-minute video session with Vikram Rajput is booked for tomorrow at 06:00 PM.',
    type: 'booking',
    read: false,
    createdAt: '2026-11-10 18:25'
  }
];

