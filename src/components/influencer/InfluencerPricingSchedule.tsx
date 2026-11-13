import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  DayScheduleItem,
  TimeIntervalItem,
  BookingPreferencesConfig,
  CustomDateOverrideConfig,
  Booking
} from '../../types';
import {
  Calendar as CalendarIcon,
  Clock,
  Save,
  Trash2,
  Plus,
  CheckCircle2,
  AlertCircle,
  Eye,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  X,
  ShieldCheck,
  CalendarDays,
  Sliders,
  Ban,
  PhoneCall,
  Video,
  Info,
  AlertTriangle,
  Globe,
  Lock,
  User,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';

// Predefined Days of the Week
const ALL_DAYS: { day: DayScheduleItem['day']; short: DayScheduleItem['short'] }[] = [
  { day: 'Monday', short: 'Mon' },
  { day: 'Tuesday', short: 'Tue' },
  { day: 'Wednesday', short: 'Wed' },
  { day: 'Thursday', short: 'Thu' },
  { day: 'Friday', short: 'Fri' },
  { day: 'Saturday', short: 'Sat' },
  { day: 'Sunday', short: 'Sun' },
];

// Time Options in 30-minute intervals
const TIME_OPTIONS = [
  '06:00 AM', '06:30 AM', '07:00 AM', '07:30 AM',
  '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM',
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
  '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM',
  '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM',
  '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM'
];

// Preset blackout reasons
const BLACKOUT_REASON_PRESETS = [
  'Personal Time Off',
  'Vacation & Travel',
  'Public Holiday / Festival',
  'Health & Medical Leave',
  'Content Shoot & Production',
  'Conference / Event Speaker',
  'Family Commitment'
];

// Helper: Convert time string ("09:00 AM") to minutes from midnight
function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!match) return 0;
  let hour = parseInt(match[1], 10);
  const min = parseInt(match[2], 10) || 0;
  const ampm = match[3]?.toUpperCase();

  if (ampm) {
    if (ampm === 'PM' && hour < 12) hour += 12;
    if (ampm === 'AM' && hour === 12) hour = 0;
  } else if (hour >= 24) {
    hour = 0;
  }
  return hour * 60 + min;
}

// Helper: Convert minutes from midnight to 12-hour formatted time ("09:00 AM")
function minutesToTime(minutes: number): string {
  const normalized = ((minutes % (24 * 60)) + 24 * 60) % (24 * 60);
  let hour24 = Math.floor(normalized / 60);
  const min = normalized % 60;
  const isPm = hour24 >= 12;
  let hour12 = hour24 % 12;
  if (hour12 === 0) hour12 = 12;
  const hPadded = String(hour12).padStart(2, '0');
  const mPadded = String(min).padStart(2, '0');
  return `${hPadded}:${mPadded} ${isPm ? 'PM' : 'AM'}`;
}

// Helper: Generate calendar cells for a month (Mon to Sun)
function generateMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  let startDayOfWeek = firstDay.getDay() - 1;
  if (startDayOfWeek === -1) startDayOfWeek = 6;

  const daysInMonth = lastDay.getDate();
  const days: { dateStr: string; dayNum: number; isCurrentMonth: boolean }[] = [];

  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const d = prevMonthLastDay - i;
    const prevDate = new Date(year, month - 1, d);
    days.push({
      dateStr: prevDate.toISOString().split('T')[0],
      dayNum: d,
      isCurrentMonth: false
    });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const curr = new Date(year, month, d);
    days.push({
      dateStr: curr.toISOString().split('T')[0],
      dayNum: d,
      isCurrentMonth: true
    });
  }

  const remaining = (7 - (days.length % 7)) % 7;
  for (let d = 1; d <= remaining; d++) {
    const nextDate = new Date(year, month + 1, d);
    days.push({
      dateStr: nextDate.toISOString().split('T')[0],
      dayNum: d,
      isCurrentMonth: false
    });
  }

  return days;
}

// Validate day intervals
function validateDayIntervals(intervals: TimeIntervalItem[]): { valid: boolean; error?: string } {
  for (let i = 0; i < intervals.length; i++) {
    const startM = timeToMinutes(intervals[i].start);
    const endM = timeToMinutes(intervals[i].end);
    if (startM >= endM) {
      return {
        valid: false,
        error: `End time (${intervals[i].end}) must be strictly after start time (${intervals[i].start}).`
      };
    }
  }

  for (let i = 0; i < intervals.length; i++) {
    const aStart = timeToMinutes(intervals[i].start);
    const aEnd = timeToMinutes(intervals[i].end);
    for (let j = i + 1; j < intervals.length; j++) {
      const bStart = timeToMinutes(intervals[j].start);
      const bEnd = timeToMinutes(intervals[j].end);
      if (aStart < bEnd && aEnd > bStart) {
        return {
          valid: false,
          error: `Time interval ${intervals[i].start}–${intervals[i].end} overlaps with ${intervals[j].start}–${intervals[j].end}.`
        };
      }
    }
  }

  return { valid: true };
}

export const InfluencerPricingSchedule: React.FC = () => {
  const {
    currentInfluencer,
    updateInfluencerAvailability,
    bookings,
    showToast,
    setActiveView,
    setSelectedInfluencerId
  } = useApp();

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // --- Initial Schedule Generator ---
  const initialWeeklySchedule: DayScheduleItem[] = useMemo(() => {
    if (currentInfluencer.availability?.weeklySchedule && currentInfluencer.availability.weeklySchedule.length === 7) {
      return currentInfluencer.availability.weeklySchedule;
    }

    const hasLegacyDays = Array.isArray(currentInfluencer.availability?.days) && currentInfluencer.availability.days.length > 0;

    return ALL_DAYS.map(d => {
      const isEnabled = hasLegacyDays
        ? currentInfluencer.availability!.days.includes(d.short)
        : d.short !== 'Sun';
      return {
        day: d.day,
        short: d.short,
        enabled: isEnabled,
        intervals: isEnabled ? [
          { id: `int-${d.short}-1`, start: '09:00 AM', end: '01:00 PM' },
          { id: `int-${d.short}-2`, start: '02:00 PM', end: '06:00 PM' }
        ] : [
          { id: `int-${d.short}-1`, start: '09:00 AM', end: '05:00 PM' }
        ]
      };
    });
  }, [currentInfluencer.availability]);

  // --- Core State ---
  const [weeklySchedule, setWeeklySchedule] = useState<DayScheduleItem[]>(initialWeeklySchedule);
  const [weeklyHoursOpen, setWeeklyHoursOpen] = useState<boolean>(true);
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('all');
  const [blockedDates, setBlockedDates] = useState<string[]>(currentInfluencer.availability?.blockedDates || []);
  const [isTakingBookings, setIsTakingBookings] = useState<boolean>(
    currentInfluencer.availability?.isTakingBookings !== false
  );

  // Booking Preferences
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [preferences, setPreferences] = useState<BookingPreferencesConfig>(
    currentInfluencer.availability?.preferences || {
      minNoticeHours: 2,
      maxAdvanceDays: 30,
      bufferMinutes: 10,
      maxBookingsPerDay: 8,
      allowedDurations: [15, 30, 45, 60]
    }
  );

  // Custom date overrides (blackout reasons, partial hours)
  const [customOverrides, setCustomOverrides] = useState<Record<string, CustomDateOverrideConfig>>(
    currentInfluencer.availability?.customDateOverrides || {}
  );

  // --- Section 2: Slot Management State ---
  const [slotSelectedDuration, setSlotSelectedDuration] = useState<number>(30); // 15, 30, 45, 60
  const [slotInspectorDate, setSlotInspectorDate] = useState<string>(todayStr);

  // --- Section 3: Blackout Calendar State ---
  const [blackoutMonthDate, setBlackoutMonthDate] = useState(() => new Date());
  const [selectedBlackoutDate, setSelectedBlackoutDate] = useState<string>(todayStr);

  // --- Modals State ---
  // Copy schedule modal
  const [copyModalDayIndex, setCopyModalDayIndex] = useState<number | null>(null);
  const [copyTargetDays, setCopyTargetDays] = useState<number[]>([]);

  // Add Blackout Date modal
  const [showAddBlackoutModal, setShowAddBlackoutModal] = useState(false);
  const [blackoutFormMode, setBlackoutFormMode] = useState<'single' | 'range'>('single');
  const [blackoutStartDate, setBlackoutStartDate] = useState(todayStr);
  const [blackoutEndDate, setBlackoutEndDate] = useState(todayStr);
  const [blackoutAllDay, setBlackoutAllDay] = useState(true);
  const [blackoutStartTime, setBlackoutStartTime] = useState('09:00 AM');
  const [blackoutEndTime, setBlackoutEndTime] = useState('06:00 PM');
  const [blackoutReasonPreset, setBlackoutReasonPreset] = useState(BLACKOUT_REASON_PRESETS[0]);
  const [blackoutCustomReason, setBlackoutCustomReason] = useState('');
  const [blackoutClashWarning, setBlackoutClashWarning] = useState<string | null>(null);

  // Confirm unblock or block modal with clash
  const [showClashConfirmModal, setShowClashConfirmModal] = useState(false);
  const [pendingClashAction, setPendingClashAction] = useState<(() => void) | null>(null);
  const [pendingClashBookings, setPendingClashBookings] = useState<Booking[]>([]);

  // Feedback & Saving
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessBanner, setSaveSuccessBanner] = useState(false);

  // Influencer confirmed bookings
  const creatorBookings = useMemo(() => {
    return bookings.filter(b => b.influencerId === currentInfluencer.id);
  }, [bookings, currentInfluencer.id]);

  const upcomingBookings = useMemo(() => {
    return creatorBookings.filter(b => b.bookingStatus === 'upcoming');
  }, [creatorBookings]);

  // Track Unsaved Changes
  const isDirty = useMemo(() => {
    const origSchedule = JSON.stringify(initialWeeklySchedule);
    const currSchedule = JSON.stringify(weeklySchedule);
    const origBlocked = JSON.stringify((currentInfluencer.availability?.blockedDates || []).slice().sort());
    const currBlocked = JSON.stringify(blockedDates.slice().sort());
    const origStatus = currentInfluencer.availability?.isTakingBookings !== false;
    const origPref = JSON.stringify(currentInfluencer.availability?.preferences || {});
    const currPref = JSON.stringify(preferences);
    const origOverrides = JSON.stringify(currentInfluencer.availability?.customDateOverrides || {});
    const currOverrides = JSON.stringify(customOverrides);

    return origSchedule !== currSchedule ||
      origBlocked !== currBlocked ||
      origStatus !== isTakingBookings ||
      origPref !== currPref ||
      origOverrides !== currOverrides;
  }, [weeklySchedule, blockedDates, isTakingBookings, preferences, customOverrides, initialWeeklySchedule, currentInfluencer.availability]);

  // Month days for Blackout Calendar
  const blackoutMonthDays = useMemo(() => {
    return generateMonthDays(blackoutMonthDate.getFullYear(), blackoutMonthDate.getMonth());
  }, [blackoutMonthDate]);

  // Helper: Bookings on a specific date
  const getBookingsForDate = (dateStr: string) => {
    return creatorBookings.filter(b => b.scheduledDate === dateStr && b.bookingStatus !== 'cancelled' && b.bookingStatus !== 'rejected');
  };

  // Helper: Get status for any date
  const getDateStatus = (dateStr: string) => {
    if (!isTakingBookings) {
      return { type: 'paused', label: 'Bookings Paused', color: 'slate', isAvailable: false };
    }

    if (blockedDates.includes(dateStr)) {
      const reason = customOverrides[dateStr]?.note || 'Blackout Date';
      return { type: 'blackout', label: reason, color: 'rose', isAvailable: false };
    }

    if (customOverrides[dateStr]) {
      if (customOverrides[dateStr].isUnavailable) {
        return { type: 'blackout', label: customOverrides[dateStr].note || 'Blackout Date', color: 'rose', isAvailable: false };
      }
      return { type: 'custom', label: 'Custom Hours', color: 'blue', isAvailable: true };
    }

    const dateObj = new Date(dateStr + 'T00:00:00');
    let dayIdx = dateObj.getDay() - 1;
    if (dayIdx === -1) dayIdx = 6;
    const dayItem = weeklySchedule[dayIdx];

    if (!dayItem || !dayItem.enabled || dayItem.intervals.length === 0) {
      return { type: 'off', label: 'Weekly Day Off', color: 'slate', isAvailable: false };
    }

    return { type: 'available', label: 'Standard Hours', color: 'emerald', isAvailable: true };
  };

  // --- SECTION 1: WEEKLY HOURS HANDLERS ---
  const handleToggleDay = (dayIdx: number, forceState?: boolean) => {
    setWeeklySchedule(prev => prev.map((item, idx) => {
      if (idx !== dayIdx) return item;
      const nextEnabled = typeof forceState === 'boolean' ? forceState : !item.enabled;
      return {
        ...item,
        enabled: nextEnabled,
        intervals: nextEnabled && item.intervals.length === 0 ? [
          { id: `int-${item.short}-1`, start: '09:00 AM', end: '05:00 PM' }
        ] : item.intervals
      };
    }));
  };

  // Quick Preset for a single day
  const handleApplyDayPreset = (dayIdx: number, presetKey: string) => {
    const short = weeklySchedule[dayIdx]?.short || 'Day';
    let intervals: TimeIntervalItem[] = [];

    switch (presetKey) {
      case 'standard':
        intervals = [{ id: `int-${short}-${Date.now()}`, start: '09:00 AM', end: '05:00 PM' }];
        break;
      case 'midday':
        intervals = [{ id: `int-${short}-${Date.now()}`, start: '10:00 AM', end: '06:00 PM' }];
        break;
      case 'afternoon':
        intervals = [{ id: `int-${short}-${Date.now()}`, start: '02:00 PM', end: '08:00 PM' }];
        break;
      case 'evening':
        intervals = [{ id: `int-${short}-${Date.now()}`, start: '06:00 PM', end: '10:00 PM' }];
        break;
      case 'split':
        intervals = [
          { id: `int-${short}-${Date.now()}-1`, start: '10:00 AM', end: '01:00 PM' },
          { id: `int-${short}-${Date.now()}-2`, start: '03:00 PM', end: '07:00 PM' }
        ];
        break;
      case 'custom':
      default:
        intervals = [{ id: `int-${short}-${Date.now()}`, start: '09:00 AM', end: '05:00 PM' }];
        break;
    }

    setWeeklySchedule(prev => prev.map((item, idx) => {
      if (idx !== dayIdx) return item;
      return {
        ...item,
        enabled: true,
        intervals
      };
    }));
    showToast(`Updated ${weeklySchedule[dayIdx]?.day} schedule.`);
  };

  // Quick Preset template for entire week
  const handleApplyWeeklyTemplate = (templateKey: string) => {
    setWeeklySchedule(prev => prev.map(item => {
      const isWeekend = item.short === 'Sat' || item.short === 'Sun';

      switch (templateKey) {
        case 'weekdays-9-5':
          return {
            ...item,
            enabled: !isWeekend,
            intervals: !isWeekend ? [{ id: `int-${item.short}-1`, start: '09:00 AM', end: '05:00 PM' }] : item.intervals
          };
        case 'weekdays-10-6':
          return {
            ...item,
            enabled: !isWeekend,
            intervals: !isWeekend ? [{ id: `int-${item.short}-1`, start: '10:00 AM', end: '06:00 PM' }] : item.intervals
          };
        case 'weekdays-split':
          return {
            ...item,
            enabled: !isWeekend,
            intervals: !isWeekend ? [
              { id: `int-${item.short}-1`, start: '10:00 AM', end: '01:00 PM' },
              { id: `int-${item.short}-2`, start: '03:00 PM', end: '07:00 PM' }
            ] : item.intervals
          };
        case 'weekdays-evening':
          return {
            ...item,
            enabled: !isWeekend,
            intervals: !isWeekend ? [{ id: `int-${item.short}-1`, start: '06:00 PM', end: '10:00 PM' }] : item.intervals
          };
        case 'all-7-days':
          return {
            ...item,
            enabled: true,
            intervals: [{ id: `int-${item.short}-1`, start: '10:00 AM', end: '06:00 PM' }]
          };
        case 'weekends-only':
          return {
            ...item,
            enabled: isWeekend,
            intervals: isWeekend ? [{ id: `int-${item.short}-1`, start: '11:00 AM', end: '05:00 PM' }] : item.intervals
          };
        case 'clear-all':
          return {
            ...item,
            enabled: false
          };
        default:
          return item;
      }
    }));
    showToast('Applied schedule template to week.');
  };

  const handleUpdateInterval = (dayIdx: number, intervalIdx: number, field: 'start' | 'end', val: string) => {
    setWeeklySchedule(prev => prev.map((item, dIdx) => {
      if (dIdx !== dayIdx) return item;
      const updatedIntervals = item.intervals.map((inv, iIdx) => {
        if (iIdx !== intervalIdx) return inv;
        return { ...inv, [field]: val };
      });
      return { ...item, intervals: updatedIntervals };
    }));
  };

  const handleAddInterval = (dayIdx: number) => {
    setWeeklySchedule(prev => prev.map((item, idx) => {
      if (idx !== dayIdx) return item;
      const lastInv = item.intervals[item.intervals.length - 1];
      let newStart = '02:00 PM';
      let newEnd = '06:00 PM';

      if (lastInv) {
        const lastEndMin = timeToMinutes(lastInv.end);
        if (lastEndMin + 120 <= 23 * 60) {
          newStart = minutesToTime(lastEndMin + 60);
          newEnd = minutesToTime(lastEndMin + 180);
        }
      }

      return {
        ...item,
        intervals: [
          ...item.intervals,
          { id: `int-${item.short}-${Date.now()}`, start: newStart, end: newEnd }
        ]
      };
    }));
  };

  const handleRemoveInterval = (dayIdx: number, intervalIdx: number) => {
    setWeeklySchedule(prev => prev.map((item, idx) => {
      if (idx !== dayIdx) return item;
      if (item.intervals.length <= 1) {
        return { ...item, enabled: false };
      }
      return {
        ...item,
        intervals: item.intervals.filter((_, iIdx) => iIdx !== intervalIdx)
      };
    }));
  };

  // Copy schedule to other days
  const handleOpenCopyModal = (dayIdx: number) => {
    setCopyModalDayIndex(dayIdx);
    setCopyTargetDays(ALL_DAYS.map((_, i) => i).filter(i => i !== dayIdx && i < 5)); // default Mon-Fri targets
  };

  const handleApplyCopySchedule = () => {
    if (copyModalDayIndex === null) return;
    const source = weeklySchedule[copyModalDayIndex];
    if (!source) return;

    setWeeklySchedule(prev => prev.map((item, idx) => {
      if (!copyTargetDays.includes(idx)) return item;
      return {
        ...item,
        enabled: source.enabled,
        intervals: source.intervals.map((inv, i) => ({
          ...inv,
          id: `int-${item.short}-${Date.now()}-${i}`
        }))
      };
    }));

    showToast(`Copied ${source.day}'s routine to ${copyTargetDays.length} selected days.`);
    setCopyModalDayIndex(null);
  };

  // --- SECTION 2: AUTO-GENERATED SLOTS CALCULATOR ---
  const generatedSlotsForDate = useMemo(() => {
    const dateStr = slotInspectorDate;
    const status = getDateStatus(dateStr);
    const dateBookings = getBookingsForDate(dateStr);
    const buffer = preferences.bufferMinutes || 10;
    const duration = slotSelectedDuration || 30;
    const step = duration + buffer;

    if (!status.isAvailable) {
      return {
        dateStr,
        status,
        slots: [],
        totalCount: 0,
        availableCount: 0,
        bookedCount: dateBookings.length,
        blockedCount: 0
      };
    }

    let intervals: TimeIntervalItem[] = [];
    if (customOverrides[dateStr]?.intervals && customOverrides[dateStr].intervals!.length > 0) {
      intervals = customOverrides[dateStr].intervals!;
    } else {
      const dateObj = new Date(dateStr + 'T00:00:00');
      let dayIdx = dateObj.getDay() - 1;
      if (dayIdx === -1) dayIdx = 6;
      intervals = weeklySchedule[dayIdx]?.intervals || [];
    }

    interface GeneratedSlot {
      id: string;
      timeLabel: string;
      startMinutes: number;
      endMinutes: number;
      status: 'available' | 'booked' | 'pending' | 'blocked';
      booking?: Booking;
      reason?: string;
    }

    const slots: GeneratedSlot[] = [];

    intervals.forEach(inv => {
      const invStart = timeToMinutes(inv.start);
      const invEnd = timeToMinutes(inv.end);

      for (let m = invStart; m + duration <= invEnd; m += step) {
        const slotStart = m;
        const slotEnd = m + duration;
        const timeLabel = `${minutesToTime(slotStart)} – ${minutesToTime(slotEnd)}`;

        // Check if overlaps with any existing booking
        const overlappingBooking = dateBookings.find(b => {
          const bStart = timeToMinutes(b.scheduledTime);
          const bEnd = bStart + (b.durationMinutes || 30);
          return bStart < slotEnd && bEnd > slotStart;
        });

        if (overlappingBooking) {
          const isPending = overlappingBooking.bookingStatus === 'pending' || overlappingBooking.paymentStatus === 'pending';
          slots.push({
            id: `slot-${slotStart}`,
            timeLabel,
            startMinutes: slotStart,
            endMinutes: slotEnd,
            status: isPending ? 'pending' : 'booked',
            booking: overlappingBooking
          });
        } else {
          slots.push({
            id: `slot-${slotStart}`,
            timeLabel,
            startMinutes: slotStart,
            endMinutes: slotEnd,
            status: 'available'
          });
        }
      }
    });

    const availableCount = slots.filter(s => s.status === 'available').length;
    const bookedCount = slots.filter(s => s.status === 'booked').length;
    const pendingCount = slots.filter(s => s.status === 'pending').length;
    const blockedCount = slots.filter(s => s.status === 'blocked').length;

    return {
      dateStr,
      status,
      slots,
      totalCount: slots.length,
      availableCount,
      bookedCount,
      pendingCount,
      blockedCount
    };
  }, [slotInspectorDate, slotSelectedDuration, weeklySchedule, blockedDates, customOverrides, preferences, isTakingBookings, creatorBookings]);

  // --- SECTION 3: BLACKOUT DATES HANDLERS ---
  const handleOpenAddBlackout = (initialDate?: string) => {
    const target = initialDate || todayStr;
    setBlackoutStartDate(target);
    setBlackoutEndDate(target);
    setBlackoutFormMode('single');
    setBlackoutAllDay(true);
    setBlackoutStartTime('09:00 AM');
    setBlackoutEndTime('06:00 PM');
    setBlackoutReasonPreset(BLACKOUT_REASON_PRESETS[0]);
    setBlackoutCustomReason('');

    // Check clash
    const clashes = getBookingsForDate(target);
    if (clashes.length > 0) {
      setBlackoutClashWarning(`Warning: ${clashes.length} confirmed fan call(s) already exist on this date.`);
    } else {
      setBlackoutClashWarning(null);
    }

    setShowAddBlackoutModal(true);
  };

  const handleSaveBlackoutModal = () => {
    const reasonText = blackoutReasonPreset === 'Other / Custom Reason' && blackoutCustomReason.trim()
      ? blackoutCustomReason.trim()
      : blackoutReasonPreset;

    const datesToAdd: string[] = [];

    if (blackoutFormMode === 'single') {
      datesToAdd.push(blackoutStartDate);
    } else {
      let curr = new Date(blackoutStartDate + 'T00:00:00');
      const end = new Date(blackoutEndDate + 'T00:00:00');
      while (curr <= end) {
        datesToAdd.push(curr.toISOString().split('T')[0]);
        curr.setDate(curr.getDate() + 1);
      }
    }

    // Check confirmed booking clashes across all dates
    const allClashes: Booking[] = [];
    datesToAdd.forEach(d => {
      allClashes.push(...getBookingsForDate(d));
    });

    const applyBlackout = () => {
      setBlockedDates(prev => Array.from(new Set([...prev, ...datesToAdd])));
      setCustomOverrides(prev => {
        const next = { ...prev };
        datesToAdd.forEach(d => {
          next[d] = {
            date: d,
            isUnavailable: blackoutAllDay,
            intervals: blackoutAllDay ? undefined : [{ id: `block-${d}`, start: blackoutStartTime, end: blackoutEndTime }],
            note: reasonText
          };
        });
        return next;
      });

      showToast(`Added blackout on ${datesToAdd.length} date(s): "${reasonText}".`);
      setShowAddBlackoutModal(false);
      setShowClashConfirmModal(false);
    };

    if (allClashes.length > 0) {
      setPendingClashBookings(allClashes);
      setPendingClashAction(() => applyBlackout);
      setShowClashConfirmModal(true);
    } else {
      applyBlackout();
    }
  };

  const handleRemoveBlackoutDate = (dateStr: string) => {
    setBlockedDates(prev => prev.filter(d => d !== dateStr));
    setCustomOverrides(prev => {
      const copy = { ...prev };
      delete copy[dateStr];
      return copy;
    });
    showToast(`Removed blackout for ${dateStr}. Routine schedule restored.`);
  };

  // --- SAVE & RESET ACTIONS ---
  const handleReset = () => {
    setWeeklySchedule(initialWeeklySchedule);
    setBlockedDates(currentInfluencer.availability?.blockedDates || []);
    setIsTakingBookings(currentInfluencer.availability?.isTakingBookings !== false);
    setPreferences(currentInfluencer.availability?.preferences || {
      minNoticeHours: 2,
      maxAdvanceDays: 30,
      bufferMinutes: 10,
      maxBookingsPerDay: 8,
      allowedDurations: [15, 30, 45, 60]
    });
    setCustomOverrides(currentInfluencer.availability?.customDateOverrides || {});
    showToast('All unsaved changes discarded.');
  };

  const handleSave = async () => {
    // Validate all 7 days intervals
    for (let i = 0; i < weeklySchedule.length; i++) {
      const day = weeklySchedule[i];
      if (day.enabled) {
        const res = validateDayIntervals(day.intervals);
        if (!res.valid) {
          showToast(`Error on ${day.day}: ${res.error}`);
          return;
        }
      }
    }

    setIsSaving(true);

    const activeDaysShort = weeklySchedule.filter(d => d.enabled).map(d => d.short);

    // Sample slot times for backward compatibility
    const sampleSlots: string[] = [];
    weeklySchedule.forEach(d => {
      if (d.enabled) {
        d.intervals.forEach(inv => {
          if (!sampleSlots.includes(inv.start)) sampleSlots.push(inv.start);
        });
      }
    });

    const updatedAvailability = {
      days: activeDaysShort,
      timeSlots: sampleSlots.slice(0, 8),
      blockedDates,
      isTakingBookings,
      weeklySchedule,
      preferences,
      customDateOverrides: customOverrides
    };

    try {
      updateInfluencerAvailability(currentInfluencer.id, updatedAvailability);
      setIsSaving(false);
      setSaveSuccessBanner(true);
      showToast('Weekly schedule, booking slots, and blackout dates saved successfully!');
    } catch {
      setIsSaving(false);
      showToast('Error saving availability schedule.');
    }
  };

  // Distinct list of blackout dates
  const activeBlackoutList = useMemo(() => {
    return Array.from(new Set([...blockedDates, ...Object.keys(customOverrides)]))
      .filter(dateStr => {
        return blockedDates.includes(dateStr) || customOverrides[dateStr]?.isUnavailable;
      })
      .sort();
  }, [blockedDates, customOverrides]);

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto font-sans">

      {/* ================= HEADER CONTROL BAR ================= */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 border border-brand-200/70 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-brand-600 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Availability & Slot Management
              </h1>

              {/* Taking Bookings Switch */}
              <button
                type="button"
                onClick={() => setIsTakingBookings(prev => !prev)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer border ${isTakingBookings
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-2xs hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                  }`}
                title="Click to pause or enable commercial bookings"
              >
                <span className={`w-2 h-2 rounded-full ${isTakingBookings ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <span>{isTakingBookings ? 'Bookings Active' : 'Bookings Paused'}</span>
              </button>

              {/* Timezone Badge */}
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold border border-slate-200">
                <Globe className="w-3 h-3 text-slate-500" />
                <span>Asia/Kolkata (IST, UTC+05:30)</span>
              </span>
            </div>


          </div>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0 flex-wrap">
          {isDirty && (
            <span className="text-xs font-bold text-amber-600 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 animate-fadeIn">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span>Unsaved Changes</span>
            </span>
          )}

          <button
            type="button"
            onClick={handleReset}
            disabled={!isDirty || isSaving}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 text-xs font-bold transition-all cursor-pointer disabled:opacity-40"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Discard</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedInfluencerId(currentInfluencer.id);
              setActiveView('influencer-detail');
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-bold transition-all cursor-pointer shadow-xs"
            title="Preview fan discovery view"
          >
            <Eye className="w-3.5 h-3.5 text-brand-500" />
            <span>Fan Preview</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 active:scale-[0.98] text-white font-bold text-xs shadow-md shadow-brand-500/25 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Clock className="w-3.5 h-3.5 animate-spin" />
                <span>Saving Schedule...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Global Success Banner */}
      {saveSuccessBanner && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800 font-bold animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Your schedule, slot configuration, and blackout dates are live on BookMyStar!</span>
          </div>
          <button
            type="button"
            onClick={() => setSaveSuccessBanner(false)}
            className="p-1 rounded-lg hover:bg-emerald-100 text-emerald-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ================= SUMMARY KPI STRIP ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">

        {/* Metric 1: Active Routine Days */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Active Routine
            </span>
            <div className="text-sm font-extrabold text-slate-900">
              {weeklySchedule.filter(d => d.enabled).length} of 7 Days Taking Calls
            </div>
            <p className="text-[11px] text-slate-500 truncate">
              {weeklySchedule.filter(d => d.enabled).map(d => d.short).join(', ') || 'No routine active'}
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 border border-brand-200/60 flex items-center justify-center shrink-0">
            <CalendarDays className="w-4 h-4" />
          </div>
        </div>

        {/* Metric 2: Standard Day Working Hours */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Standard Shift
            </span>
            <div className="text-sm font-extrabold text-slate-900">
              {(() => {
                const active = weeklySchedule.filter(d => d.enabled);
                if (active.length === 0) return 'Unavailable';
                const first = active[0].intervals[0];
                return first ? `${first.start} – ${first.end}` : 'Standard Hours';
              })()}
            </div>
            <p className="text-[11px] text-slate-500">
              {preferences.bufferMinutes}m automatic breathing room
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-200/60 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        {/* Metric 3: Blackout & Time Off */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Blackout Dates
            </span>
            <div className="text-sm font-extrabold text-slate-900">
              {activeBlackoutList.length} Date{activeBlackoutList.length === 1 ? '' : 's'} Blocked
            </div>
            <p className="text-[11px] text-slate-500 truncate">
              {activeBlackoutList.length > 0 ? `Next: ${activeBlackoutList[0]}` : 'No upcoming time-off'}
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 border border-rose-200/60 flex items-center justify-center shrink-0">
            <Ban className="w-4 h-4" />
          </div>
        </div>

        {/* Metric 4: Booked Fan Sessions */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Confirmed Calls
            </span>
            <div className="text-sm font-extrabold text-slate-900">
              {upcomingBookings.length} Upcoming Session{upcomingBookings.length === 1 ? '' : 's'}
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold truncate">
              Protected & non-overwriting
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center shrink-0">
            <PhoneCall className="w-4 h-4" />
          </div>
        </div>

      </div>

      {/* ================= SECTION 1: WEEKLY WORKING HOURS ================= */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">

        {/* Section Header with Dropdown / Accordion Toggle */}
        <div className={`p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white ${weeklyHoursOpen ? 'border-b border-slate-100' : ''}`}>
          <div
            onClick={() => setWeeklyHoursOpen(!weeklyHoursOpen)}
            className="flex items-center gap-3 cursor-pointer select-none shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 border border-brand-200/60 flex items-center justify-center shrink-0">
              <Sliders className="w-4 h-4 text-brand-600" />
            </div>
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight whitespace-nowrap">
                1. Weekly Working Hours
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap shrink-0">
                {weeklySchedule.filter(d => d.enabled).length} of 7 Days Active
              </span>
            </div>
          </div>

          {/* Header Controls: Routine Template Dropdown, Day Filter & Accordion Toggle */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
            {/* Quick Template Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap hidden xl:inline">
                Template:
              </span>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleApplyWeeklyTemplate(e.target.value);
                    e.target.value = '';
                  }
                }}
                defaultValue=""
                className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold bg-white text-slate-800 hover:border-brand-500 focus:outline-none focus:border-brand-500 cursor-pointer shadow-xs transition-colors max-w-[190px] sm:max-w-[210px] truncate"
                title="Quick schedule templates"
              >
                <option value="" disabled>⚡ Routine Templates...</option>
                <option value="weekdays-9-5">Weekdays (Mon–Fri, 09:00 AM – 05:00 PM)</option>
                <option value="weekdays-10-6">Weekdays (Mon–Fri, 10:00 AM – 06:00 PM)</option>
                <option value="weekdays-split">Weekdays Split (10 AM–1 PM, 3 PM–7 PM)</option>
                <option value="weekdays-evening">Weekdays Evening (06:00 PM – 10:00 PM)</option>
                <option value="all-7-days">Full Week (Mon–Sun, 10:00 AM – 06:00 PM)</option>
                <option value="weekends-only">Weekends Only (Sat–Sun, 11:00 AM – 05:00 PM)</option>
                <option value="clear-all">Clear All (Mark All Days Off)</option>
              </select>
            </div>

            {/* View / Filter By Day Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap hidden xl:inline">
                Filter:
              </span>
              <select
                value={selectedDayFilter}
                onChange={(e) => setSelectedDayFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 hover:bg-white text-slate-700 hover:border-brand-400 focus:outline-none cursor-pointer max-w-[145px]"
                title="Filter which days to display"
              >
                <option value="all">View: All 7 Days</option>
                <option value="active">View: Active Days Only</option>
                <option value="Mon">Monday Only</option>
                <option value="Tue">Tuesday Only</option>
                <option value="Wed">Wednesday Only</option>
                <option value="Thu">Thursday Only</option>
                <option value="Fri">Friday Only</option>
                <option value="Sat">Saturday Only</option>
                <option value="Sun">Sunday Only</option>
              </select>
            </div>

            {/* Accordion Dropdown Collapse/Expand Toggle Button */}
            <button
              type="button"
              onClick={() => setWeeklyHoursOpen(!weeklyHoursOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-bold transition-colors cursor-pointer shrink-0"
              title={weeklyHoursOpen ? "Collapse Weekly Working Hours" : "Expand Weekly Working Hours"}
            >
              <span>{weeklyHoursOpen ? 'Collapse' : 'Expand'}</span>
              {weeklyHoursOpen ? (
                <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              )}
            </button>
          </div>
        </div>

        {/* 7-Day Interactive Weekly Schedule Rows (when open) */}
        {weeklyHoursOpen && (
          <div className="divide-y divide-slate-100">
            {weeklySchedule
              .filter(d => {
                if (selectedDayFilter === 'all') return true;
                if (selectedDayFilter === 'active') return d.enabled;
                return d.short === selectedDayFilter;
              })
              .map((dayItem) => {
                const dayIdx = weeklySchedule.findIndex(d => d.day === dayItem.day);
                const hasIntervals = dayItem.enabled && dayItem.intervals.length > 0;
                const validation = dayItem.enabled ? validateDayIntervals(dayItem.intervals) : { valid: true };

                return (
                  <div
                    key={dayItem.day}
                    className={`p-4 sm:p-5 transition-colors ${dayItem.enabled ? 'bg-white' : 'bg-slate-50/60'
                      }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">

                      {/* Left: Day Name, Toggle Switch & Status Dropdown */}
                      <div className="flex items-center gap-3 w-full sm:w-64 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleToggleDay(dayIdx)}
                          className={`w-11 h-6 flex items-center rounded-full px-0.5 cursor-pointer transition-colors duration-200 shrink-0 ${dayItem.enabled ? 'bg-brand-500' : 'bg-slate-300'
                            }`}
                          title={dayItem.enabled ? `Disable ${dayItem.day}` : `Enable ${dayItem.day}`}
                        >
                          <div className={`bg-white w-5 h-5 rounded-full shadow-sm transform transition-transform duration-200 ${dayItem.enabled ? 'translate-x-5' : 'translate-x-0'
                            }`} />
                        </button>

                        <div className="min-w-[85px]">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-sm font-bold ${dayItem.enabled ? 'text-slate-900' : 'text-slate-500'}`}>
                              {dayItem.day}
                            </span>
                          </div>
                          <span className={`text-[10px] font-semibold block ${dayItem.enabled ? 'text-emerald-600' : 'text-slate-400'}`}>
                            {dayItem.enabled ? `${dayItem.intervals.length} shift(s)` : 'Unavailable / Day Off'}
                          </span>
                        </div>

                        {/* Status Dropdown Option for this Day */}
                        <select
                          value={dayItem.enabled ? 'available' : 'unavailable'}
                          onChange={(e) => {
                            const isAvail = e.target.value === 'available';
                            if (dayItem.enabled !== isAvail) {
                              handleToggleDay(dayIdx, isAvail);
                            }
                          }}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-lg border cursor-pointer focus:outline-none transition-colors ${dayItem.enabled
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 focus:border-emerald-500'
                            : 'bg-white text-slate-600 border-slate-300 focus:border-brand-500 hover:border-slate-400'
                            }`}
                          title="Change day availability status"
                        >
                          <option value="available">✓ Available</option>
                          <option value="unavailable">✕ Day Off</option>
                        </select>
                      </div>

                      {/* Middle: Working Time Ranges & Breaks */}
                      <div className="flex-1 space-y-2.5">
                        {!dayItem.enabled ? (
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-1">
                            <div className="text-xs text-slate-400 italic">
                              Not taking bookings on {dayItem.day}s.
                            </div>

                            {/* Quick Schedule Dropdown Option to Activate */}
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-medium text-slate-500">Quick set:</span>
                              <select
                                value="none"
                                onChange={(e) => {
                                  if (e.target.value !== 'none') {
                                    handleApplyDayPreset(dayIdx, e.target.value);
                                  }
                                }}
                                className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white text-slate-800 hover:border-brand-500 focus:outline-none focus:border-brand-500 cursor-pointer shadow-xs"
                              >
                                <option value="none">Choose Hours Dropdown...</option>
                                <option value="standard">✓ 09:00 AM – 05:00 PM (Standard)</option>
                                <option value="midday">✓ 10:00 AM – 06:00 PM (Mid-day)</option>
                                <option value="afternoon">✓ 02:00 PM – 08:00 PM (Afternoon/Eve)</option>
                                <option value="evening">✓ 06:00 PM – 10:00 PM (Evening Only)</option>
                                <option value="split">✓ Split: 10 AM-1 PM & 3 PM-7 PM</option>
                              </select>

                              <button
                                type="button"
                                onClick={() => handleToggleDay(dayIdx, true)}
                                className="px-3 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold border border-brand-200 transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Enable {dayItem.short}</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {dayItem.intervals.map((inv, invIdx) => {
                              const isInvalid = timeToMinutes(inv.start) >= timeToMinutes(inv.end);

                              // Calculate break with previous interval if exists
                              let breakText = '';
                              if (invIdx > 0) {
                                const prevEnd = timeToMinutes(dayItem.intervals[invIdx - 1].end);
                                const thisStart = timeToMinutes(inv.start);
                                if (thisStart > prevEnd) {
                                  const breakMin = thisStart - prevEnd;
                                  const hrs = Math.floor(breakMin / 60);
                                  const mins = breakMin % 60;
                                  breakText = `Break: ${hrs > 0 ? `${hrs}h ` : ''}${mins > 0 ? `${mins}m` : ''}`;
                                }
                              }

                              return (
                                <div key={inv.id} className="space-y-1">
                                  {breakText && (
                                    <div className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md inline-flex items-center gap-1 border border-amber-200/60 my-0.5">
                                      <span>☕ {breakText}</span>
                                    </div>
                                  )}

                                  <div className="flex items-center gap-2 flex-wrap">
                                    {/* Start Time Select */}
                                    <select
                                      value={inv.start}
                                      onChange={e => handleUpdateInterval(dayIdx, invIdx, 'start', e.target.value)}
                                      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold bg-white text-slate-900 focus:outline-none cursor-pointer ${isInvalid ? 'border-rose-400 bg-rose-50' : 'border-slate-200 focus:border-brand-500'
                                        }`}
                                    >
                                      {TIME_OPTIONS.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                      ))}
                                    </select>

                                    <span className="text-xs font-bold text-slate-400">to</span>

                                    {/* End Time Select */}
                                    <select
                                      value={inv.end}
                                      onChange={e => handleUpdateInterval(dayIdx, invIdx, 'end', e.target.value)}
                                      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold bg-white text-slate-900 focus:outline-none cursor-pointer ${isInvalid ? 'border-rose-400 bg-rose-50' : 'border-slate-200 focus:border-brand-500'
                                        }`}
                                    >
                                      {TIME_OPTIONS.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                      ))}
                                    </select>

                                    {/* Delete interval */}
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveInterval(dayIdx, invIdx)}
                                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                      title="Remove this time interval"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}

                            {!validation.valid && (
                              <p className="text-[11px] text-rose-600 font-semibold pt-0.5">
                                {validation.error}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Right Actions: Presets Dropdown, Add Hours & Copy to Other Days */}
                      {dayItem.enabled && (
                        <div className="flex items-center gap-2 self-start lg:self-center shrink-0 flex-wrap">
                          {/* Quick Day Preset Dropdown */}
                          <select
                            defaultValue=""
                            onChange={(e) => {
                              if (e.target.value) {
                                handleApplyDayPreset(dayIdx, e.target.value);
                                e.target.value = '';
                              }
                            }}
                            className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 hover:bg-white text-slate-700 hover:border-brand-400 focus:outline-none cursor-pointer"
                            title="Apply quick preset hours to this day"
                          >
                            <option value="" disabled>Presets Dropdown...</option>
                            <option value="standard">09:00 AM – 05:00 PM</option>
                            <option value="midday">10:00 AM – 06:00 PM</option>
                            <option value="afternoon">02:00 PM – 08:00 PM</option>
                            <option value="evening">06:00 PM – 10:00 PM</option>
                            <option value="split">Split: 10AM-1PM & 3PM-7PM</option>
                          </select>

                          {/* Add Interval / Shift */}
                          <button
                            type="button"
                            onClick={() => handleAddInterval(dayIdx)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                            title="Add another working interval (supports lunch/tea breaks)"
                          >
                            <Plus className="w-3.5 h-3.5 text-brand-500" />
                            <span>Add Hours</span>
                          </button>

                          {/* Copy Hours */}
                          <button
                            type="button"
                            onClick={() => handleOpenCopyModal(dayIdx)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                            title={`Copy ${dayItem.day}'s schedule to other weekdays`}
                          >
                            <Copy className="w-3.5 h-3.5 text-slate-400" />
                            <span>Copy</span>
                          </button>
                        </div>
                      )}

                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* ================= SECTION 2: BOOKING SLOT MANAGEMENT ================= */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">

        {/* Section Header */}
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-200/60 flex items-center justify-center shrink-0">
              <CalendarIcon className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900 tracking-tight whitespace-nowrap">
                  2. Booking Slot Management
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap shrink-0">
                  Auto-Generated Slots
                </span>
              </div>

            </div>
          </div>

          {/* Slot Inspector Controls: Durations & Buffer */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Duration Selector Tabs */}
            <div className="flex items-center p-0.5 rounded-xl bg-slate-100 border border-slate-200">
              {[15, 30, 45, 60].map(dur => (
                <button
                  key={dur}
                  type="button"
                  onClick={() => setSlotSelectedDuration(dur)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${slotSelectedDuration === dur
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                    }`}
                >
                  {dur}m
                </button>
              ))}
            </div>

            {/* Buffer Selector */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500 font-medium hidden sm:inline">Buffer:</span>
              <select
                value={preferences.bufferMinutes}
                onChange={e => setPreferences(prev => ({ ...prev, bufferMinutes: parseInt(e.target.value, 10) }))}
                className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-brand-500 cursor-pointer"
              >
                <option value={0}>0m Break</option>
                <option value={5}>5m Break</option>
                <option value={10}>10m Break (Rec)</option>
                <option value={15}>15m Break</option>
                <option value={30}>30m Break</option>
              </select>
            </div>
          </div>
        </div>

        {/* Date Selector Strip */}
        <div className="p-4 bg-slate-50/70 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-xs font-bold text-slate-600 shrink-0 mr-1">Inspect Date:</span>

            {/* Quick 7-Day Picker */}
            {Array.from({ length: 7 }).map((_, i) => {
              const d = new Date();
              d.setDate(d.getDate() + i);
              const dStr = d.toISOString().split('T')[0];
              const isSelected = slotInspectorDate === dStr;
              const isToday = i === 0;

              return (
                <button
                  key={dStr}
                  type="button"
                  onClick={() => setSlotInspectorDate(dStr)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 border ${isSelected
                    ? 'bg-brand-500 text-white border-brand-500 shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                    }`}
                >
                  <span>{isToday ? 'Today' : d.toLocaleDateString('default', { weekday: 'short' })}</span>
                  <span className="ml-1 opacity-80">{d.getDate()}</span>
                </button>
              );
            })}

            {/* Custom Date Input */}
            <input
              type="date"
              value={slotInspectorDate}
              onChange={e => e.target.value && setSlotInspectorDate(e.target.value)}
              className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
            />
          </div>

          {/* Color Legend for Slots */}
          <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Available ({generatedSlotsForDate.availableCount})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>Booked ({generatedSlotsForDate.bookedCount})</span>
            </div>
            {generatedSlotsForDate.pendingCount > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Pending ({generatedSlotsForDate.pendingCount})</span>
              </div>
            )}
          </div>
        </div>

        {/* Live Slot Grid Display */}
        <div className="p-5">
          {!generatedSlotsForDate.status.isAvailable ? (
            <div className="text-center py-10 bg-slate-50/80 rounded-2xl border border-dashed border-slate-200 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 mx-auto flex items-center justify-center border border-rose-200">
                <Ban className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                No Slots Available on {new Date(slotInspectorDate + 'T00:00:00').toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })}
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Reason: {generatedSlotsForDate.status.label}. Check Section 1 weekly working hours or Section 3 blackout dates to adjust.
              </p>
            </div>
          ) : generatedSlotsForDate.slots.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No bookable slots generated for {slotSelectedDuration}m duration within working hours.
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>
                  Generated {generatedSlotsForDate.totalCount} Slots for {new Date(slotInspectorDate + 'T00:00:00').toLocaleDateString('default', { weekday: 'long', month: 'short', day: 'numeric' })}
                </span>
                <span className="text-[11px] font-normal text-slate-500">
                  {slotSelectedDuration}-min slots • {preferences.bufferMinutes}m buffer
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
                {generatedSlotsForDate.slots.map(slot => {
                  const isBooked = slot.status === 'booked';
                  const isPending = slot.status === 'pending';
                  const isAvailable = slot.status === 'available';

                  return (
                    <div
                      key={slot.id}
                      className={`p-3 rounded-xl border text-center transition-all flex flex-col justify-between ${isBooked
                        ? 'bg-blue-50/80 border-blue-200 text-blue-900 shadow-2xs'
                        : isPending
                          ? 'bg-amber-50 border-amber-200 text-amber-900 shadow-2xs'
                          : 'bg-emerald-50/60 hover:bg-emerald-50 border-emerald-200/80 text-emerald-900 shadow-2xs'
                        }`}
                    >
                      <div className="text-xs font-extrabold text-slate-900">
                        {slot.timeLabel.split(' – ')[0]}
                      </div>

                      <div className="mt-1 pt-1 border-t border-slate-200/50 flex items-center justify-between text-[10px]">
                        <span className={`px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider ${isBooked
                          ? 'bg-blue-200/80 text-blue-800'
                          : isPending
                            ? 'bg-amber-200/80 text-amber-800'
                            : 'bg-emerald-200/80 text-emerald-800'
                          }`}>
                          {slot.status}
                        </span>

                        {slot.booking && (
                          <span className="font-semibold text-slate-700 truncate max-w-[60px]" title={slot.booking.userName}>
                            {slot.booking.userName.split(' ')[0]}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* ================= SECTION 3: BLACKOUT DATES ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Left: Interactive Monthly Blackout Calendar (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 border border-rose-200/60 flex items-center justify-center shrink-0">
                <Ban className="w-4 h-4 text-rose-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-extrabold text-slate-900 tracking-tight whitespace-nowrap">
                    3. Blackout Dates
                  </h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 whitespace-nowrap shrink-0">
                    Time-Off Manager
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Block vacation, holidays, and personal days. Unavailable dates are highlighted in red.
                </p>
              </div>
            </div>

            {/* Month Switcher */}
            <div className="flex items-center gap-1.5 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => {
                  const today = new Date();
                  setBlackoutMonthDate(new Date(today.getFullYear(), today.getMonth(), 1));
                  setSelectedBlackoutDate(todayStr);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-colors cursor-pointer mr-1"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setBlackoutMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                className="p-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-extrabold text-slate-900 px-2 min-w-[120px] text-center">
                {blackoutMonthDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </span>
              <button
                type="button"
                onClick={() => setBlackoutMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                className="p-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Monthly Calendar Grid */}
          <div>
            <div className="grid grid-cols-7 gap-1 text-center pb-1.5 border-b border-slate-100">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(wd => (
                <span key={wd} className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {wd}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 pt-1.5">
              {blackoutMonthDays.map(cell => {
                const isSelected = selectedBlackoutDate === cell.dateStr;
                const status = getDateStatus(cell.dateStr);
                const isBlocked = blockedDates.includes(cell.dateStr);
                const dayBookings = getBookingsForDate(cell.dateStr);
                const hasBookings = dayBookings.length > 0;
                const isPast = cell.dateStr < todayStr;
                const isToday = cell.dateStr === todayStr;

                return (
                  <button
                    key={cell.dateStr}
                    type="button"
                    onClick={() => setSelectedBlackoutDate(cell.dateStr)}
                    className={`h-11 sm:h-12 p-1 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center justify-between relative ${isSelected
                      ? 'border-2 border-brand-500 bg-brand-50 text-slate-900 font-black shadow-xs ring-2 ring-brand-500/20'
                      : isBlocked
                        ? 'bg-rose-50 border-rose-200 text-rose-700 font-bold hover:bg-rose-100'
                        : isPast
                          ? 'bg-slate-50/50 border-slate-100 text-slate-300'
                          : status.isAvailable
                            ? 'bg-emerald-50/40 hover:bg-emerald-50 border-emerald-200/70 text-slate-800'
                            : 'bg-slate-50 border-slate-100 text-slate-400'
                      } ${!cell.isCurrentMonth ? 'opacity-30' : ''}`}
                  >
                    <div className="w-full flex items-center justify-between text-[11px] leading-none">
                      <span className={isSelected ? 'font-black text-brand-600' : ''}>
                        {cell.dayNum}
                      </span>
                      {isToday && (
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-500" title="Today" />
                      )}
                    </div>

                    <div className="flex items-center gap-1 justify-center w-full">
                      {isBlocked ? (
                        <span className="text-[8.5px] font-bold text-rose-700 bg-rose-100 px-1 py-0.2 rounded">
                          Off
                        </span>
                      ) : hasBookings ? (
                        <span className="text-[8.5px] font-bold text-amber-800 bg-amber-100 px-1 rounded flex items-center gap-0.5">
                          <span className="w-1 h-1 rounded-full bg-brand-500" />
                          <span>{dayBookings.length}</span>
                        </span>
                      ) : status.type === 'custom' ? (
                        <span className="text-[8.5px] font-bold text-blue-700 bg-blue-100 px-1 rounded">
                          Mod
                        </span>
                      ) : status.isAvailable ? (
                        <span className="w-1 h-1 rounded-full bg-emerald-500 opacity-60" />
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Legend */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[10px] font-semibold text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-emerald-50 border border-emerald-300" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-rose-100 border border-rose-300" />
              <span>Blackout Date (Off)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-amber-100 border border-amber-300 flex items-center justify-center">
                <span className="w-1 h-1 rounded-full bg-brand-500" />
              </span>
              <span>Has Bookings</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-brand-100 border border-brand-400" />
              <span>Selected</span>
            </div>
          </div>

        </div>

        {/* Right: Blackout Action Panel & Active Dates Ledger (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">

          <div className="space-y-3.5">
            {/* Header & Quick Add */}
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Time-Off Control
                </span>
                <h3 className="text-sm font-extrabold text-slate-900">
                  {new Date(selectedBlackoutDate + 'T00:00:00').toLocaleDateString('default', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => handleOpenAddBlackout(selectedBlackoutDate)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-sm shadow-rose-500/25 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Blackout</span>
              </button>
            </div>

            {/* Selected Date Status Card */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Status:</span>
                <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${blockedDates.includes(selectedBlackoutDate)
                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                  : getDateStatus(selectedBlackoutDate).isAvailable
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-slate-200 text-slate-600'
                  }`}>
                  {blockedDates.includes(selectedBlackoutDate)
                    ? 'Unavailable / Blocked'
                    : getDateStatus(selectedBlackoutDate).label}
                </span>
              </div>

              {customOverrides[selectedBlackoutDate]?.note && (
                <div className="flex items-center justify-between text-rose-700 font-semibold pt-1 border-t border-slate-200">
                  <span>Reason:</span>
                  <span>{customOverrides[selectedBlackoutDate].note}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                <span className="text-slate-500 font-medium">Confirmed Fan Calls:</span>
                <span className="font-bold text-slate-900">
                  {getBookingsForDate(selectedBlackoutDate).length} session(s)
                </span>
              </div>
            </div>

            {/* Active Blackout Dates List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Active Blackout Dates ({activeBlackoutList.length})</span>
                <span className="text-[10px] text-slate-400 font-normal">Auto-blocks fan bookings</span>
              </div>

              {activeBlackoutList.length === 0 ? (
                <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-400">
                  No blackout dates scheduled. You are available according to your weekly routine.
                </div>
              ) : (
                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
                  {activeBlackoutList.map(dateStr => {
                    const reason = customOverrides[dateStr]?.note || 'Scheduled Time-Off';
                    const dObj = new Date(dateStr + 'T00:00:00');

                    return (
                      <div
                        key={dateStr}
                        className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs shadow-2xs hover:border-slate-300 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-rose-500" />
                          <div>
                            <div className="font-bold text-slate-900">
                              {dObj.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                            <div className="text-[10px] text-rose-600 font-semibold">
                              {reason}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveBlackoutDate(dateStr)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Unblock date"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          <div className="text-[10px] text-slate-400 text-center pt-2 border-t border-slate-100">
            Blackout dates take precedence over weekly recurring working hours.
          </div>
        </div>

      </div>

      {/* ================= ADDITIONAL SETTINGS (BOOKING RULES & LIMITS) ================= */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">

        {/* Accordion Trigger */}
        <button
          type="button"
          onClick={() => setPreferencesOpen(prev => !prev)}
          className="w-full p-5 flex items-center justify-between text-left cursor-pointer hover:bg-slate-50/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 border border-purple-200/60 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                  Booking Rules, Buffers & Policies
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                  Settings
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Minimum notice, advance booking window, daily call limits, and supported session durations.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 hidden sm:inline">
              {preferencesOpen ? 'Collapse' : 'Configure'}
            </span>
            {preferencesOpen ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </div>
        </button>

        {/* Accordion Body */}
        {preferencesOpen && (
          <div className="p-5 pt-0 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">

            {/* Setting 1: Minimum Advance Booking Time */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <label className="block text-xs font-bold text-slate-900">
                Minimum Advance Notice
              </label>
              <select
                value={preferences.minNoticeHours}
                onChange={e => setPreferences(prev => ({ ...prev, minNoticeHours: parseInt(e.target.value, 10) }))}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-brand-500"
              >
                <option value={1}>1 hour notice</option>
                <option value={2}>2 hours notice (Recommended)</option>
                <option value={4}>4 hours notice</option>
                <option value={12}>12 hours notice</option>
                <option value={24}>24 hours notice (1 full day)</option>
                <option value={48}>48 hours notice (2 full days)</option>
              </select>
              <p className="text-[10px] text-slate-500">
                Prevents last-minute surprise bookings so you can prepare.
              </p>
            </div>

            {/* Setting 2: Maximum Advance Booking Window */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <label className="block text-xs font-bold text-slate-900">
                Maximum Advance Booking Window
              </label>
              <select
                value={preferences.maxAdvanceDays}
                onChange={e => setPreferences(prev => ({ ...prev, maxAdvanceDays: parseInt(e.target.value, 10) }))}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-brand-500"
              >
                <option value={7}>Up to 7 days ahead</option>
                <option value={14}>Up to 14 days ahead</option>
                <option value={30}>Up to 30 days ahead (Recommended)</option>
                <option value={60}>Up to 60 days ahead</option>
                <option value={90}>Up to 90 days ahead</option>
              </select>
              <p className="text-[10px] text-slate-500">
                Controls how far into the future fans can schedule booking slots.
              </p>
            </div>

            {/* Setting 3: Buffer Time Between Calls */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <label className="block text-xs font-bold text-slate-900">
                Buffer Time Between Calls
              </label>
              <select
                value={preferences.bufferMinutes}
                onChange={e => setPreferences(prev => ({ ...prev, bufferMinutes: parseInt(e.target.value, 10) }))}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-brand-500"
              >
                <option value={0}>0 minutes (Back-to-back)</option>
                <option value={5}>5 minutes break</option>
                <option value={10}>10 minutes break (Recommended)</option>
                <option value={15}>15 minutes break</option>
                <option value={30}>30 minutes break</option>
              </select>
              <p className="text-[10px] text-slate-500">
                Automatic cooldown added after each session to prevent schedule overrun.
              </p>
            </div>

            {/* Setting 4: Maximum Bookings per Day */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <label className="block text-xs font-bold text-slate-900">
                Maximum Bookings per Day
              </label>
              <select
                value={preferences.maxBookingsPerDay}
                onChange={e => setPreferences(prev => ({ ...prev, maxBookingsPerDay: parseInt(e.target.value, 10) }))}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-brand-500"
              >
                <option value={3}>Max 3 calls / day</option>
                <option value={5}>Max 5 calls / day</option>
                <option value={8}>Max 8 calls / day (Recommended)</option>
                <option value={10}>Max 10 calls / day</option>
                <option value={999}>Unlimited capacity</option>
              </select>
              <p className="text-[10px] text-slate-500">
                Prevents creator fatigue by capping the total daily booking volume.
              </p>
            </div>

            {/* Setting 5: Call Duration Compatibility */}
            <div className="md:col-span-2 p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="block text-xs font-bold text-slate-900">
                Supported Call Durations for Fans
              </label>
              <div className="flex flex-wrap gap-2.5">
                {[15, 30, 45, 60].map(duration => {
                  const isChecked = preferences.allowedDurations?.includes(duration);
                  return (
                    <button
                      key={duration}
                      type="button"
                      onClick={() => {
                        const current = preferences.allowedDurations || [15, 30, 45, 60];
                        if (isChecked && current.length === 1) {
                          showToast('At least one duration must remain active.');
                          return;
                        }
                        const updated = isChecked ? current.filter(d => d !== duration) : [...current, duration];
                        setPreferences(prev => ({ ...prev, allowedDurations: updated }));
                      }}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center gap-2 ${isChecked
                        ? 'bg-brand-50 text-brand-700 border-brand-400 shadow-xs'
                        : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-100'
                        }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded flex items-center justify-center ${isChecked ? 'bg-brand-500 text-white' : 'border border-slate-300'
                        }`}>
                        {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                      <span>{duration} Minutes Session</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-slate-500">
                Only enabled durations can be booked by fans on your marketplace profile.
              </p>
            </div>

          </div>
        )}

      </div>

      {/* ================= FOOTER PERSISTENCE ACTIONS ================= */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-slate-500">
          {isDirty ? (
            <span className="text-amber-600 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              You have unsaved changes in your availability schedule or blackout dates
            </span>
          ) : (
            <span className="text-slate-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              All schedule settings and booking rules are synchronized
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleReset}
            disabled={!isDirty || isSaving}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 disabled:opacity-40 font-bold text-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 active:scale-[0.98] text-white font-bold text-xs shadow-md shadow-brand-500/25 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Clock className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ================= MODAL 1: COPY SCHEDULE TO OTHER DAYS ================= */}
      {copyModalDayIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4">

            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Copy className="w-4 h-4 text-brand-500" />
                <h3 className="text-sm font-extrabold text-slate-900">
                  Copy {weeklySchedule[copyModalDayIndex]?.day}'s Schedule
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCopyModalDayIndex(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-500 font-medium">Source Working Hours:</span>
              <div className="font-bold text-slate-900 mt-0.5">
                {weeklySchedule[copyModalDayIndex]?.enabled
                  ? weeklySchedule[copyModalDayIndex].intervals.map(inv => `${inv.start} – ${inv.end}`).join(', ')
                  : 'Unavailable'}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Select Target Days:</span>
                <button
                  type="button"
                  onClick={() => {
                    const allIndices = ALL_DAYS.map((_, i) => i).filter(i => i !== copyModalDayIndex);
                    setCopyTargetDays(prev => prev.length === allIndices.length ? [] : allIndices);
                  }}
                  className="text-brand-600 hover:underline cursor-pointer"
                >
                  Toggle All
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {ALL_DAYS.map((d, idx) => {
                  if (idx === copyModalDayIndex) return null;
                  const isChecked = copyTargetDays.includes(idx);

                  return (
                    <button
                      key={d.day}
                      type="button"
                      onClick={() => {
                        setCopyTargetDays(prev =>
                          prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
                        );
                      }}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-between ${isChecked
                        ? 'bg-brand-50 text-brand-700 border-brand-400'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                    >
                      <span>{d.day}</span>
                      <div className={`w-4 h-4 rounded flex items-center justify-center ${isChecked ? 'bg-brand-500 text-white' : 'border border-slate-300'
                        }`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCopyModalDayIndex(null)}
                className="flex-1 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyCopySchedule}
                disabled={copyTargetDays.length === 0}
                className="flex-1 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs transition-colors cursor-pointer shadow-sm disabled:opacity-40"
              >
                Apply to {copyTargetDays.length} Days
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= MODAL 2: ADD BLACKOUT DATE ================= */}
      {showAddBlackoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4">

            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Ban className="w-4 h-4 text-rose-600" />
                <h3 className="text-sm font-extrabold text-slate-900">
                  Add Blackout Date / Time-Off
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddBlackoutModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mode: Single Date vs Date Range */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setBlackoutFormMode('single')}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${blackoutFormMode === 'single'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
                  }`}
              >
                Single Date
              </button>
              <button
                type="button"
                onClick={() => setBlackoutFormMode('range')}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${blackoutFormMode === 'range'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
                  }`}
              >
                Date Range (Vacation)
              </button>
            </div>

            {/* Date Selection */}
            {blackoutFormMode === 'single' ? (
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800">
                  Unavailable Date
                </label>
                <input
                  type="date"
                  value={blackoutStartDate}
                  onChange={e => {
                    setBlackoutStartDate(e.target.value);
                    const clashes = getBookingsForDate(e.target.value);
                    setBlackoutClashWarning(clashes.length > 0 ? `Warning: ${clashes.length} confirmed fan call(s) already exist on this date.` : null);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-brand-500"
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800">Start Date</label>
                  <input
                    type="date"
                    value={blackoutStartDate}
                    onChange={e => setBlackoutStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800">End Date</label>
                  <input
                    type="date"
                    value={blackoutEndDate}
                    min={blackoutStartDate}
                    onChange={e => setBlackoutEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>
            )}

            {/* All Day vs Specific Time Range */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 cursor-pointer flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={blackoutAllDay}
                    onChange={e => setBlackoutAllDay(e.target.checked)}
                    className="rounded text-brand-500 focus:ring-0 cursor-pointer"
                  />
                  <span>Block Entire Day (All-Day Unavailable)</span>
                </label>
              </div>

              {!blackoutAllDay && (
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-500 block mb-1">From Time:</span>
                    <select
                      value={blackoutStartTime}
                      onChange={e => setBlackoutStartTime(e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold"
                    >
                      {TIME_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-500 block mb-1">To Time:</span>
                    <select
                      value={blackoutEndTime}
                      onChange={e => setBlackoutEndTime(e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold"
                    >
                      {TIME_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Reason Selection */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800">
                Reason for Unavailability
              </label>
              <select
                value={blackoutReasonPreset}
                onChange={e => setBlackoutReasonPreset(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-brand-500 cursor-pointer"
              >
                {BLACKOUT_REASON_PRESETS.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
                <option value="Other / Custom Reason">Other / Custom Reason</option>
              </select>

              {blackoutReasonPreset === 'Other / Custom Reason' && (
                <input
                  type="text"
                  placeholder="Enter custom reason (e.g. Flight travel to Mumbai)"
                  value={blackoutCustomReason}
                  onChange={e => setBlackoutCustomReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-brand-500 mt-1"
                />
              )}
            </div>

            {/* Warning if bookings exist */}
            {blackoutClashWarning && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{blackoutClashWarning}</span>
              </div>
            )}

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddBlackoutModal(false)}
                className="flex-1 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveBlackoutModal}
                className="flex-1 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs transition-colors cursor-pointer shadow-sm"
              >
                Confirm Blackout
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= MODAL 3: CLASH CONFIRMATION WARNING ================= */}
      {showClashConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-2xl border border-amber-200 shadow-2xl p-6 space-y-4">

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Confirmed Bookings Conflict Warning
                </h3>
                <p className="text-xs text-slate-500">
                  Fans already have confirmed calls during this time-off period.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-xs space-y-1.5">
              <div className="font-bold text-amber-900">
                {pendingClashBookings.length} Existing Booking(s) Found:
              </div>
              <div className="max-h-32 overflow-y-auto space-y-1 text-[11px] text-amber-800">
                {pendingClashBookings.map(b => (
                  <div key={b.id} className="flex justify-between py-0.5 border-b border-amber-200/40">
                    <span>{b.scheduledDate} at {b.scheduledTime} ({b.userName})</span>
                    <span className="font-bold">Ref: {b.bookingRef}</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-amber-700 pt-1 font-medium">
                Note: Confirmed bookings will NOT be automatically cancelled. Blacking out this date prevents new fan bookings.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowClashConfirmModal(false);
                  setPendingClashAction(null);
                }}
                className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={() => {
                  if (pendingClashAction) pendingClashAction();
                }}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-sm"
              >
                Proceed & Block
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
