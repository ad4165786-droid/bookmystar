export type UserRole = 'user' | 'influencer' | 'admin';

export type Category = 
  | 'Gaming' 
  | 'Music' 
  | 'Fashion & Beauty' 
  | 'Fitness & Health' 
  | 'Tech & Coding' 
  | 'Education & Career' 
  | 'Comedy & Entertainment' 
  | 'Lifestyle & Travel';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: 'user';
  status: 'active' | 'suspended';
  createdAt: string;
  totalSpent: number;
  totalBookings: number;
}

export interface InfluencerGalleryItem {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'image' | 'video';
  isVisible: boolean;
  uploadedAt: string;
}

export interface InfluencerProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  coverImage: string;
  category: Category;
  bio: string;
  isVerified: boolean;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  dob: string;
  age: number;
  idDocUrl: string;
  idDocName: string;
  socialLinks: {
    instagram?: string;
    youtube?: string;
    twitter?: string;
    tiktok?: string;
  };
  gallery: InfluencerGalleryItem[];
  voiceCallEnabled: boolean;
  videoCallEnabled: boolean;
  rates: {
    voice10: number;
    voice15: number;
    voice30: number;
    video10: number;
    video15: number;
    video30: number;
  };
  rating: number;
  reviewCount: number;
  totalEarnings: number;
  todayEarnings: number;
  pendingBalance: number;
  paidOutBalance: number;
  completedCallsCount: number;
  languages?: string[];
  availability: {
    days: string[]; // ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    timeSlots: string[]; // ['10:00 AM', '11:00 AM', ...]
    blockedDates: string[]; // ['2026-11-20']
  };
  payoutDetails?: {
    method: 'bank' | 'upi';
    accountNumber?: string;
    ifsc?: string;
    bankName?: string;
    accountHolderName?: string;
    upiId?: string;
  };
}

export type CallType = 'voice' | 'video';
export type BookingStatus = 'upcoming' | 'pending' | 'completed' | 'cancelled' | 'rejected' | 'refunded';
export type PaymentStatus = 'success' | 'pending' | 'failed' | 'refunded';

export interface Booking {
  id: string;
  bookingRef: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userEmail: string;
  userPhone: string;
  influencerId: string;
  influencerName: string;
  influencerAvatar: string;
  influencerCategory: Category;
  callType: CallType;
  durationMinutes: number;
  scheduledDate: string;
  scheduledTime: string;
  amount: number; // in INR ₹
  commissionRate: number; // e.g., 0.15 for 15%
  commissionAmount: number;
  influencerEarnings: number;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  paymentMethod: 'upi' | 'card' | 'netbanking';
  transactionId: string;
  paidAt: string;
  rejectionReason?: string;
  cancellationReason?: string;
  refundRef?: string;
  meetingUrl?: string;
  notes?: string;
}

export interface PayoutRequest {
  id: string;
  payoutRef: string;
  influencerId: string;
  influencerName: string;
  influencerAvatar: string;
  amount: number;
  method: 'bank' | 'upi';
  destination: string; // "HDFC Bank (..4902)" or "raj@okaxis"
  status: 'pending' | 'processing' | 'paid' | 'rejected';
  requestedAt: string;
  processedAt?: string;
  utrRef?: string;
  rejectionReason?: string;
}

export interface GrievanceTicket {
  id: string;
  ticketRef: string;
  raisedBy: 'user' | 'influencer';
  submitterId: string;
  submitterName: string;
  submitterRole: UserRole;
  targetId?: string;
  targetName?: string;
  bookingRef?: string;
  category: 'payment' | 'booking' | 'call' | 'account' | 'behaviour';
  priority: 'low' | 'medium' | 'high';
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  responses: {
    id: string;
    sender: string;
    role: UserRole;
    message: string;
    timestamp: string;
    isInternalNote?: boolean;
  }[];
}

export interface ReviewItem {
  id: string;
  bookingRef: string;
  userId: string;
  userName: string;
  userAvatar: string;
  influencerId: string;
  influencerName: string;
  rating: number; // 1 to 5
  comment: string;
  callType: CallType;
  createdAt: string;
  isFlagged: boolean;
  isHidden: boolean;
  flagReason?: string;
}

export interface AuditLogItem {
  id: string;
  adminName: string;
  action: string;
  targetType: 'User' | 'Influencer' | 'Booking' | 'Payout' | 'Content' | 'Settings';
  targetId: string;
  details: string;
  reason?: string;
  timestamp: string;
  ipAddress: string;
}

export interface PlatformNotification {
  id: string;
  targetAudience: 'all' | 'users' | 'influencers' | 'specific';
  recipientId?: string;
  title: string;
  message: string;
  type: 'booking' | 'payout' | 'verification' | 'system' | 'alert';
  read: boolean;
  createdAt: string;
}

export interface PlatformSettings {
  commissionRate: number; // e.g. 15 for 15%
  minPayoutAmount: number; // e.g. 500 ₹
  requireVerificationForBooking: boolean;
  lockSlotDurationMinutes: number; // e.g. 10
  allowUserRescheduling: boolean;
  maintenanceMode: boolean;
}


export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Support Lead' | 'Content Moderator' | 'Finance Officer';
  accessLevel: number;
}
