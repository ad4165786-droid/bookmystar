import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  DayScheduleItem, 
  TimeIntervalItem, 
  BookingPreferencesConfig,
  CustomDateOverrideConfig,
  Booking
} from '../../types';
import { ClockTimeSelector, SlotItem } from '../common/ClockTimeSelector';
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
  Sparkles, 
  Check, 
  X, 
  ShieldCheck, 
  CalendarDays,
  Sliders,
  Power,
  Ban,
  PhoneCall,
  Video,
  Info
} from 'lucide-react';

const ALL_DAYS: { day: DayScheduleItem['day']; short: DayScheduleItem['short'] }[] = [
  { day: 'Monday', short: 'Mon' },
  { day: 'Tuesday', short: 'Tue' },
  { day: 'Wednesday', short: 'Wed' },
  { day: 'Thursday', short: 'Thu' },
  { day: 'Friday', short: 'Fri' },
  { day: 'Saturday', short: 'Sat' },
  { day: 'Sunday', short: 'Sun' },
];

const TIME_OPTIONS = [
  '06:00 AM', '06:30 AM', '07:00 AM', '07:30 AM',
  '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM',
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
  '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM',
  '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM',
  '10:00 PM', '10:30 PM', '11:00 PM'
];

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

export const InfluencerPricingSchedule: React.FC = () => {
  const { 
    currentInfluencer, 
    updateInfluencerAvailability, 
    updateInfluencerProfile,
    bookings, 
    showToast,
    setActiveView,
    setSelectedInfluencerId
  } = useApp();

  // --- Initial Schedule Generator ---
  const initialWeeklySchedule: DayScheduleItem[] = useMemo(() => {
    if (currentInfluencer.availability?.weeklySchedule && currentInfluencer.availability.weeklySchedule.length === 7) {
      return currentInfluencer.availability.weeklySchedule;
    }

    const activeDays = currentInfluencer.availability?.days || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return ALL_DAYS.map(d => {
      const isEnabled = activeDays.includes(d.short);
      return {
        day: d.day,
        short: d.short,
        enabled: isEnabled,
        intervals: isEnabled ? [
          { id: `int-${d.short}-1`, start: '09:00 AM', end: '01:00 PM' },
          { id: `int-${d.short}-2`, start: '03:00 PM', end: '07:00 PM' }
        ] : [
          { id: `int-${d.short}-1`, start: '09:00 AM', end: '05:00 PM' }
        ]
      };
    });
  }, [currentInfluencer.availability]);

  // --- Core State Variables ---
  const [weeklySchedule, setWeeklySchedule] = useState<DayScheduleItem[]>(initialWeeklySchedule);
  const [blockedDates, setBlockedDates] = useState<string[]>(currentInfluencer.availability?.blockedDates || []);
  const [isTakingBookings, setIsTakingBookings] = useState<boolean>(
    currentInfluencer.availability?.isTakingBookings !== false
  );
  
  // Booking Preferences (Collapsible)
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [preferences, setPreferences] = useState<BookingPreferencesConfig>(
    currentInfluencer.availability?.preferences || {
      minNoticeHours: 2,
      maxAdvanceDays: 30,
      bufferMinutes: 10,
      maxBookingsPerDay: 8,
      allowedDurations: [10, 15, 30]
    }
  );

  // Custom date overrides (e.g. holiday or custom hours)
  const [customOverrides, setCustomOverrides] = useState<Record<string, CustomDateOverrideConfig>>(
    currentInfluencer.availability?.customDateOverrides || {}
  );

  // Calendar State
  const [currentMonthDate, setCurrentMonthDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => {
    // Default to tomorrow's date YYYY-MM-DD
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });

  // Preview Selected Slot
  const [previewSelectedSlot, setPreviewSelectedSlot] = useState<SlotItem | null>(null);

  // UI state feedback
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessBanner, setSaveSuccessBanner] = useState(false);
  const [scheduleErrors, setScheduleErrors] = useState<Record<string, string>>({});
  const [showCustomHoursModal, setShowCustomHoursModal] = useState(false);
  const [customStart, setCustomStart] = useState('10:00 AM');
  const [customEnd, setCustomEnd] = useState('02:00 PM');

  // Filter bookings for this creator
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

    return origSchedule !== currSchedule || origBlocked !== currBlocked || origStatus !== isTakingBookings || origPref !== currPref;
  }, [weeklySchedule, blockedDates, isTakingBookings, preferences, initialWeeklySchedule, currentInfluencer.availability]);

  // --- Interval Validation ---
  const validateIntervals = (schedule: DayScheduleItem[]): boolean => {
    const errors: Record<string, string> = {};

    schedule.forEach(dayItem => {
      if (!dayItem.enabled) return;

      dayItem.intervals.forEach((interval, idx) => {
        const startMin = timeToMinutes(interval.start);
        const endMin = timeToMinutes(interval.end);

        if (startMin >= endMin) {
          errors[`${dayItem.short}-${interval.id}`] = 'End time must be after start time.';
        }

        // Check overlap with other intervals on same day
        for (let j = idx + 1; j < dayItem.intervals.length; j++) {
          const other = dayItem.intervals[j];
          const oStart = timeToMinutes(other.start);
          const oEnd = timeToMinutes(other.end);

          if (Math.max(startMin, oStart) < Math.min(endMin, oEnd)) {
            errors[`${dayItem.short}-${interval.id}`] = 'Intervals cannot overlap.';
            errors[`${dayItem.short}-${other.id}`] = 'Intervals cannot overlap.';
          }
        }
      });
    });

    setScheduleErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // --- Day Toggle & Interval Handlers ---
  const handleToggleDay = (dayIndex: number) => {
    setWeeklySchedule(prev => {
      const updated = [...prev];
      const target = updated[dayIndex];
      const nextEnabled = !target.enabled;
      updated[dayIndex] = {
        ...target,
        enabled: nextEnabled,
        intervals: target.intervals.length === 0 ? [{ id: `int-${target.short}-1`, start: '09:00 AM', end: '05:00 PM' }] : target.intervals
      };
      validateIntervals(updated);
      return updated;
    });
  };

  const handleUpdateInterval = (dayIndex: number, intervalId: string, field: 'start' | 'end', value: string) => {
    setWeeklySchedule(prev => {
      const updated = [...prev];
      const day = updated[dayIndex];
      const intervals = day.intervals.map(inv => inv.id === intervalId ? { ...inv, [field]: value } : inv);
      updated[dayIndex] = { ...day, intervals };
      validateIntervals(updated);
      return updated;
    });
  };

  const handleAddInterval = (dayIndex: number) => {
    setWeeklySchedule(prev => {
      const updated = [...prev];
      const day = updated[dayIndex];
      const lastInterval = day.intervals[day.intervals.length - 1];
      
      let nextStart = '02:00 PM';
      let nextEnd = '06:00 PM';
      if (lastInterval) {
        const lastEndMin = timeToMinutes(lastInterval.end);
        const newStartMin = Math.min(lastEndMin + 60, 22 * 60);
        const newEndMin = Math.min(newStartMin + 180, 23 * 60);
        nextStart = minutesToTime(newStartMin);
        nextEnd = minutesToTime(newEndMin);
      }

      const newInv: TimeIntervalItem = {
        id: `int-${day.short}-${Date.now().toString(36)}`,
        start: nextStart,
        end: nextEnd
      };

      updated[dayIndex] = {
        ...day,
        intervals: [...day.intervals, newInv]
      };
      validateIntervals(updated);
      return updated;
    });
  };

  const handleRemoveInterval = (dayIndex: number, intervalId: string) => {
    setWeeklySchedule(prev => {
      const updated = [...prev];
      const day = updated[dayIndex];
      if (day.intervals.length <= 1) return prev; // Keep at least one interval
      const intervals = day.intervals.filter(inv => inv.id !== intervalId);
      updated[dayIndex] = { ...day, intervals };
      validateIntervals(updated);
      return updated;
    });
  };

  // Quick Action: Copy Monday to all other weekdays
  const handleCopyMondayToWeekdays = () => {
    const monday = weeklySchedule[0];
    if (!monday) return;

    setWeeklySchedule(prev => {
      const updated = prev.map((item, idx) => {
        // Only weekdays Mon-Fri (idx 0 to 4)
        if (idx > 0 && idx < 5) {
          return {
            ...item,
            enabled: monday.enabled,
            intervals: monday.intervals.map(inv => ({
              ...inv,
              id: `int-${item.short}-${Math.random().toString(36).substring(2, 6)}`
            }))
          };
        }
        return item;
      });
      validateIntervals(updated);
      return updated;
    });

    showToast('Monday working intervals applied to all weekdays (Mon-Fri).');
  };

  // --- Blocked Dates & Overrides Handlers ---
  const isDateBlocked = (dateStr: string) => blockedDates.includes(dateStr);

  const toggleBlockSelectedDate = (dateStr: string) => {
    if (isDateBlocked(dateStr)) {
      setBlockedDates(prev => prev.filter(d => d !== dateStr));
      showToast(`${dateStr} unblocked. Bookings allowed.`);
    } else {
      setBlockedDates(prev => [...prev, dateStr]);
      showToast(`${dateStr} marked as blocked/holiday.`);
    }
  };

  const handleApplyCustomHours = () => {
    if (timeToMinutes(customStart) >= timeToMinutes(customEnd)) {
      showToast('End time must be after start time.');
      return;
    }

    setCustomOverrides(prev => ({
      ...prev,
      [selectedDate]: {
        date: selectedDate,
        isUnavailable: false,
        intervals: [{ id: `custom-${Date.now()}`, start: customStart, end: customEnd }],
        note: 'Custom date override hours.'
      }
    }));

    // If it was blocked, unblock it
    if (blockedDates.includes(selectedDate)) {
      setBlockedDates(prev => prev.filter(d => d !== selectedDate));
    }

    setShowCustomHoursModal(false);
    showToast(`Custom schedule applied for ${selectedDate}: ${customStart} - ${customEnd}`);
  };

  const handleRemoveCustomOverride = (dateStr: string) => {
    setCustomOverrides(prev => {
      const copy = { ...prev };
      delete copy[dateStr];
      return copy;
    });
    showToast(`Custom hours removed for ${dateStr}. Reverted to standard schedule.`);
  };

  // --- Calendar Calculation Helpers ---
  const calendarYear = currentMonthDate.getFullYear();
  const calendarMonth = currentMonthDate.getMonth();

  const calendarDays = useMemo(() => {
    const firstDay = new Date(calendarYear, calendarMonth, 1);
    const lastDay = new Date(calendarYear, calendarMonth + 1, 0);

    // Monday as first day of week (0: Mon, 6: Sun)
    let startDayOfWeek = firstDay.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    const daysInMonth = lastDay.getDate();
    const days: { dateStr: string; dayNum: number; isCurrentMonth: boolean }[] = [];

    // Leading padding from prev month
    const prevMonthLastDay = new Date(calendarYear, calendarMonth, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = prevMonthLastDay - i;
      const prevDate = new Date(calendarYear, calendarMonth - 1, d);
      days.push({
        dateStr: prevDate.toISOString().split('T')[0],
        dayNum: d,
        isCurrentMonth: false
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const curr = new Date(calendarYear, calendarMonth, d);
      days.push({
        dateStr: curr.toISOString().split('T')[0],
        dayNum: d,
        isCurrentMonth: true
      });
    }

    // Trailing padding to fill full 35 or 42 grid cells
    const remaining = (7 - (days.length % 7)) % 7;
    for (let d = 1; d <= remaining; d++) {
      const nextDate = new Date(calendarYear, calendarMonth + 1, d);
      days.push({
        dateStr: nextDate.toISOString().split('T')[0],
        dayNum: d,
        isCurrentMonth: false
      });
    }

    return days;
  }, [calendarYear, calendarMonth]);

  // Check if a given date is available based on weekly schedule, blocked dates, and overrides
  const getDateAvailabilityStatus = (dateStr: string) => {
    if (!isTakingBookings) return { available: false, reason: 'All bookings paused' };
    if (blockedDates.includes(dateStr)) return { available: false, reason: 'Holiday / Blocked' };

    // Check custom date override
    if (customOverrides[dateStr]) {
      return { 
        available: !customOverrides[dateStr].isUnavailable, 
        isCustom: true,
        reason: customOverrides[dateStr].isUnavailable ? 'Custom off-day' : 'Custom Hours' 
      };
    }

    // Check weekday
    const dateObj = new Date(dateStr + 'T00:00:00');
    let dayIdx = dateObj.getDay() - 1;
    if (dayIdx === -1) dayIdx = 6;
    const dayItem = weeklySchedule[dayIdx];

    return {
      available: !!(dayItem && dayItem.enabled && dayItem.intervals.length > 0),
      reason: dayItem?.enabled ? 'Standard Working Day' : 'Day off (Weekly Schedule)'
    };
  };

  // Get bookings for a date
  const getBookingsForDate = (dateStr: string) => {
    return creatorBookings.filter(b => b.scheduledDate === dateStr && b.bookingStatus !== 'cancelled' && b.bookingStatus !== 'rejected');
  };

  // --- Generated Preview Available Slots for Selected Date ---
  const generatedSlotsForDate: SlotItem[] = useMemo(() => {
    const status = getDateAvailabilityStatus(selectedDate);
    if (!status.available) return [];

    // Determine intervals: custom override or standard day
    let intervals: TimeIntervalItem[] = [];
    if (customOverrides[selectedDate]?.intervals) {
      intervals = customOverrides[selectedDate].intervals!;
    } else {
      const dateObj = new Date(selectedDate + 'T00:00:00');
      let dayIdx = dateObj.getDay() - 1;
      if (dayIdx === -1) dayIdx = 6;
      intervals = weeklySchedule[dayIdx]?.intervals || [];
    }

    const slotDuration = 30; // 30-min fan booking slot interval
    const buffer = preferences.bufferMinutes || 10;
    const step = slotDuration + buffer;
    const dateBookings = getBookingsForDate(selectedDate);
    const bookedTimes = new Set(dateBookings.map(b => b.scheduledTime));

    const slots: SlotItem[] = [];

    intervals.forEach(inv => {
      const startMin = timeToMinutes(inv.start);
      const endMin = timeToMinutes(inv.end);

      for (let m = startMin; m + slotDuration <= endMin; m += step) {
        const timeLabel = minutesToTime(m);
        // Exclude if already booked
        if (!bookedTimes.has(timeLabel)) {
          slots.push({
            coachId: currentInfluencer.id,
            coachName: currentInfluencer.name,
            date: selectedDate,
            slot: timeLabel,
            timezone: 'Asia/Kolkata'
          });
        }
      }
    });

    return slots;
  }, [selectedDate, weeklySchedule, blockedDates, customOverrides, isTakingBookings, preferences, creatorBookings, currentInfluencer]);

  // --- Reset All Changes ---
  const handleReset = () => {
    setWeeklySchedule(initialWeeklySchedule);
    setBlockedDates(currentInfluencer.availability?.blockedDates || []);
    setIsTakingBookings(currentInfluencer.availability?.isTakingBookings !== false);
    setPreferences(currentInfluencer.availability?.preferences || {
      minNoticeHours: 2,
      maxAdvanceDays: 30,
      bufferMinutes: 10,
      maxBookingsPerDay: 8,
      allowedDurations: [10, 15, 30]
    });
    setCustomOverrides(currentInfluencer.availability?.customDateOverrides || {});
    setScheduleErrors({});
    showToast('Changes discarded.');
  };

  // --- Save Availability to Backend ---
  const handleSave = async () => {
    if (!validateIntervals(weeklySchedule)) {
      showToast('Please resolve interval conflicts and overlapping times before saving.');
      return;
    }

    setIsSaving(true);

    // Synchronize legacy `days` and `timeSlots` arrays so fan checkout and landing pages work 100%
    const activeShortDays = weeklySchedule.filter(d => d.enabled).map(d => d.short);
    
    // Flatten standard time slots preview
    const sampleSlots: string[] = [];
    weeklySchedule.forEach(d => {
      if (!d.enabled) return;
      d.intervals.forEach(inv => {
        if (!sampleSlots.includes(inv.start)) sampleSlots.push(inv.start);
      });
    });

    const updatedAvailability = {
      days: activeShortDays,
      timeSlots: sampleSlots.length > 0 ? sampleSlots : ['10:00 AM', '11:00 AM', '04:00 PM', '05:00 PM'],
      blockedDates,
      isTakingBookings,
      weeklySchedule,
      preferences,
      customDateOverrides: customOverrides
    };

    await new Promise(resolve => setTimeout(resolve, 600));

    updateInfluencerAvailability(currentInfluencer.id, updatedAvailability);
    updateInfluencerProfile(currentInfluencer.id, {
      availability: updatedAvailability
    });

    setIsSaving(false);
    setSaveSuccessBanner(true);
    showToast('Availability and scheduling preferences saved successfully!');
    setTimeout(() => setSaveSuccessBanner(false), 5000);
  };

  return (
    <div className="space-y-8 pb-24 max-w-7xl mx-auto font-sans">
      
      {/* ================= 1. PAGE HEADER ================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] text-[#1D4ED8] border border-[#DBEAFE] flex items-center justify-center shrink-0">
              <CalendarDays className="w-6 h-6 stroke-[2]" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#172554] tracking-tight">
                  Availability & Schedule
                </h1>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  isTakingBookings 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isTakingBookings ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                  <span>{isTakingBookings ? 'Taking Bookings' : 'Bookings Paused'}</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#64748B]">
                Manage your working hours, available dates and booking preferences.
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 shrink-0 self-stretch sm:self-auto justify-end">
            <button
              type="button"
              onClick={() => {
                setSelectedInfluencerId(currentInfluencer.id);
                setActiveView('influencer-detail');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#F8FAFC] hover:bg-[#EFF6FF] text-[#172554] hover:text-[#1D4ED8] border border-slate-200/90 font-bold text-xs transition-colors cursor-pointer shadow-xs"
              title="Preview public profile booking slot view as a fan"
            >
              <Eye className="w-4 h-4 text-brand-500" />
              <span>Preview Booking Page</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 active:scale-[0.98] text-white font-bold text-xs shadow-md shadow-brand-500/25 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>

        </div>

        {/* Global Save Success Notification Banner */}
        {saveSuccessBanner && (
          <div className="mt-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900 font-bold animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Your weekly schedule, blackout dates, and booking rules are live on BookMyStar!</span>
            </div>
            <button
              type="button"
              onClick={() => setSaveSuccessBanner(false)}
              className="p-1 rounded-lg hover:bg-emerald-100 text-emerald-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* ================= 2. AVAILABILITY OVERVIEW (Compact Summary Cards) ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Availability Status Toggle */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
              Availability Status
            </span>
            <span className={`text-sm font-extrabold ${isTakingBookings ? 'text-emerald-700' : 'text-slate-500'}`}>
              {isTakingBookings ? 'Active' : 'Inactive'}
            </span>
            <p className="text-[10px] text-[#64748B]">
              {isTakingBookings ? 'Fans can book calls' : 'New bookings paused'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsTakingBookings(prev => !prev)}
            className={`w-12 h-6.5 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out ${
              isTakingBookings ? 'bg-emerald-600' : 'bg-slate-300'
            }`}
            title="Toggle active booking status"
          >
            <div
              className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                isTakingBookings ? 'translate-x-5.5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Card 2: Available Days */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
              Available Days
            </span>
            <div className="text-base font-extrabold text-[#172554]">
              {weeklySchedule.filter(d => d.enabled).length} of 7 Days Active
            </div>
            <p className="text-[10px] text-[#64748B] truncate">
              {weeklySchedule.filter(d => d.enabled).map(d => d.short).join(', ') || 'No active days'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#1D4ED8] border border-[#DBEAFE] flex items-center justify-center shrink-0">
            <CalendarIcon className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Working Hours Average */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
              Working Hours
            </span>
            <div className="text-base font-extrabold text-[#172554]">
              {(() => {
                const active = weeklySchedule.filter(d => d.enabled);
                if (active.length === 0) return 'Unavailable';
                const first = active[0].intervals[0];
                return first ? `${first.start} – ${first.end}` : 'Standard Hours';
              })()}
            </div>
            <p className="text-[10px] text-[#64748B]">
              Buffer: {preferences.bufferMinutes}m between calls
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#1D4ED8] border border-[#DBEAFE] flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Upcoming Bookings */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
              Upcoming Bookings
            </span>
            <div className="text-base font-extrabold text-[#172554]">
              {upcomingBookings.length} {upcomingBookings.length === 1 ? 'Call' : 'Calls'} Scheduled
            </div>
            <p className="text-[10px] text-emerald-600 font-semibold">
              {upcomingBookings[0] ? `Next: ${upcomingBookings[0].scheduledDate} at ${upcomingBookings[0].scheduledTime}` : 'All caught up'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
            <PhoneCall className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* ================= 3. WEEKLY AVAILABILITY MANAGEMENT ================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        
        {/* Section Heading + Copy Monday Shortcut */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] text-[#1D4ED8] border border-[#DBEAFE] flex items-center justify-center">
              <Clock className="w-4 h-4 text-[#1D4ED8]" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#172554] tracking-tight">
                Weekly Working Hours
              </h2>
              <p className="text-xs text-[#64748B]">
                Set routine working windows for each day of the week. Supports multiple intervals.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopyMondayToWeekdays}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#F8FAFC] hover:bg-[#EFF6FF] text-[#172554] hover:text-[#1D4ED8] border border-slate-200/90 text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto shadow-2xs"
            title="Duplicate Monday hours across Tue-Fri"
          >
            <Copy className="w-3.5 h-3.5 text-brand-500" />
            <span>Copy Mon to Weekdays</span>
          </button>
        </div>

        {/* 7 Days Schedule Table */}
        <div className="divide-y divide-slate-100">
          {weeklySchedule.map((dayItem, dayIdx) => {
            return (
              <div 
                key={dayItem.day} 
                className="py-4.5 flex flex-col md:flex-row md:items-start justify-between gap-4 transition-colors"
              >
                {/* Left: Toggle & Day Name */}
                <div className="flex items-center gap-3.5 min-w-[180px]">
                  <button
                    type="button"
                    onClick={() => handleToggleDay(dayIdx)}
                    className={`w-10 h-6 flex items-center rounded-full p-0.5 cursor-pointer transition-colors duration-200 ease-in-out shrink-0 ${
                      dayItem.enabled ? 'bg-brand-500' : 'bg-slate-300'
                    }`}
                    title={dayItem.enabled ? `Disable ${dayItem.day}` : `Enable ${dayItem.day}`}
                  >
                    <div
                      className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                        dayItem.enabled ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-extrabold ${dayItem.enabled ? 'text-[#172554]' : 'text-slate-400'}`}>
                        {dayItem.day}
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                        dayItem.enabled 
                          ? 'bg-[#EFF6FF] text-[#1D4ED8]' 
                          : 'bg-slate-100 text-slate-400'
                      }`}>
                        {dayItem.short}
                      </span>
                    </div>
                    {!dayItem.enabled && (
                      <span className="text-[11px] text-slate-400 font-medium block">
                        Unavailable
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Working Intervals or Unavailable Badge */}
                <div className="flex-1 max-w-2xl space-y-2.5">
                  {!dayItem.enabled ? (
                    <div className="py-2 text-xs text-slate-400 font-medium italic flex items-center gap-1.5">
                      <Ban className="w-3.5 h-3.5 text-slate-300" />
                      <span>Not taking bookings on {dayItem.day}s</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {dayItem.intervals.map((interval, invIdx) => {
                        const errorKey = `${dayItem.short}-${interval.id}`;
                        const errorMsg = scheduleErrors[errorKey];

                        return (
                          <div key={interval.id} className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              {/* Start Time Dropdown */}
                              <div className="relative">
                                <select
                                  value={interval.start}
                                  onChange={e => handleUpdateInterval(dayIdx, interval.id, 'start', e.target.value)}
                                  className="px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs font-semibold text-[#172554] focus:outline-none focus:bg-white focus:border-brand-500 cursor-pointer"
                                >
                                  {TIME_OPTIONS.map(t => (
                                    <option key={t} value={t}>{t}</option>
                                  ))}
                                </select>
                              </div>

                              <span className="text-xs text-[#64748B] font-bold">to</span>

                              {/* End Time Dropdown */}
                              <div className="relative">
                                <select
                                  value={interval.end}
                                  onChange={e => handleUpdateInterval(dayIdx, interval.id, 'end', e.target.value)}
                                  className="px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs font-semibold text-[#172554] focus:outline-none focus:bg-white focus:border-brand-500 cursor-pointer"
                                >
                                  {TIME_OPTIONS.map(t => (
                                    <option key={t} value={t}>{t}</option>
                                  ))}
                                </select>
                              </div>

                              {/* Remove Interval Button (if > 1 interval) */}
                              {dayItem.intervals.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveInterval(dayIdx, interval.id)}
                                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                  title="Remove this time interval"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {/* Add Interval inline button on last interval */}
                              {invIdx === dayItem.intervals.length - 1 && dayItem.intervals.length < 3 && (
                                <button
                                  type="button"
                                  onClick={() => handleAddInterval(dayIdx)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold text-brand-600 hover:bg-[#EFF6FF] transition-colors cursor-pointer"
                                  title="Add another time interval for this day"
                                >
                                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                                  <span>Add Interval</span>
                                </button>
                              )}
                            </div>

                            {/* Validation error message */}
                            {errorMsg && (
                              <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-1 animate-fadeIn">
                                <AlertCircle className="w-3 h-3 shrink-0" />
                                <span>{errorMsg}</span>
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* ================= 4. CALENDAR AND DATE MANAGEMENT ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Interactive Month Calendar (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] text-[#1D4ED8] border border-[#DBEAFE] flex items-center justify-center">
                <CalendarDays className="w-4 h-4 text-[#1D4ED8]" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-[#172554] tracking-tight">
                  Calendar & Blackout Dates
                </h2>
                <p className="text-xs text-[#64748B]">
                  Click any date to block it or set custom date-specific hours.
                </p>
              </div>
            </div>

            {/* Month Navigation & Today Shortcut */}
            <div className="flex items-center gap-1.5 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => {
                  const today = new Date();
                  setCurrentMonthDate(new Date(today.getFullYear(), today.getMonth(), 1));
                  setSelectedDate(today.toISOString().split('T')[0]);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-[#F8FAFC] hover:bg-slate-100 text-[#172554] border border-slate-200 text-xs font-bold transition-colors cursor-pointer mr-1"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                className="p-1.5 rounded-xl bg-[#F8FAFC] hover:bg-slate-100 text-[#172554] border border-slate-200 transition-colors cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-extrabold text-[#172554] px-2 min-w-[120px] text-center">
                {currentMonthDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </span>
              <button
                type="button"
                onClick={() => setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                className="p-1.5 rounded-xl bg-[#F8FAFC] hover:bg-slate-100 text-[#172554] border border-slate-200 transition-colors cursor-pointer"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 7-Day Calendar Grid */}
          <div>
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 text-center pb-2 border-b border-slate-100">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(wd => (
                <span key={wd} className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                  {wd}
                </span>
              ))}
            </div>

            {/* Days cells */}
            <div className="grid grid-cols-7 gap-1.5 pt-2">
              {calendarDays.map((cell) => {
                const isSelected = selectedDate === cell.dateStr;
                const status = getDateAvailabilityStatus(cell.dateStr);
                const isBlocked = blockedDates.includes(cell.dateStr);
                const dayBookings = getBookingsForDate(cell.dateStr);
                const hasBookings = dayBookings.length > 0;
                
                const todayStr = new Date().toISOString().split('T')[0];
                const isToday = cell.dateStr === todayStr;

                return (
                  <button
                    key={cell.dateStr}
                    type="button"
                    onClick={() => setSelectedDate(cell.dateStr)}
                    className={`aspect-square p-1 sm:p-1.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between relative ${
                      isSelected
                        ? 'border-brand-500 ring-2 ring-brand-500/30 bg-[#EFF6FF] text-[#172554] font-black shadow-sm'
                        : isBlocked
                        ? 'bg-rose-50/70 border-rose-200 text-rose-700 hover:bg-rose-100/60'
                        : status.available
                        ? 'bg-white hover:bg-[#F8FAFC] border-slate-200 text-[#172554] font-semibold'
                        : 'bg-slate-50 border-slate-100 text-slate-400'
                    } ${!cell.isCurrentMonth ? 'opacity-35' : ''}`}
                  >
                    {/* Top Row: Day Number & Today indicator */}
                    <div className="w-full flex items-center justify-between text-[11px] leading-none">
                      <span className={isSelected ? 'font-black text-brand-600' : ''}>
                        {cell.dayNum}
                      </span>
                      {isToday && (
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-500" title="Today" />
                      )}
                    </div>

                    {/* Bottom Status Indicators */}
                    <div className="flex items-center gap-1 justify-center w-full">
                      {isBlocked ? (
                        <span className="text-[9px] font-bold text-rose-600 bg-rose-100/80 px-1 rounded">
                          Off
                        </span>
                      ) : hasBookings ? (
                        <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-1 rounded flex items-center gap-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <span>{dayBookings.length}</span>
                        </span>
                      ) : status.isCustom ? (
                        <span className="text-[9px] font-bold text-blue-700 bg-blue-100 px-1 rounded">
                          Mod
                        </span>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-[11px] font-semibold text-[#64748B]">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-white border border-slate-300" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-rose-100 border border-rose-300" />
              <span>Blocked Date</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-amber-100 border border-amber-300" />
              <span>Has Bookings</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-[#EFF6FF] border border-brand-500" />
              <span>Selected</span>
            </div>
          </div>
        </div>

        {/* Right Column: Selected Date Control Card (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                  Date Configuration
                </span>
                <h3 className="text-base font-extrabold text-[#172554]">
                  {new Date(selectedDate + 'T00:00:00').toLocaleDateString('default', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </h3>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                isDateBlocked(selectedDate)
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : getDateAvailabilityStatus(selectedDate).available
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-slate-100 text-slate-500'
              }`}>
                {isDateBlocked(selectedDate)
                  ? 'Blocked / Off'
                  : getDateAvailabilityStatus(selectedDate).available
                  ? 'Available'
                  : 'Routine Off'}
              </span>
            </div>

            {/* Status overview for this date */}
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#64748B] font-medium">Routine Schedule:</span>
                <span className="font-bold text-[#172554]">
                  {(() => {
                    const dateObj = new Date(selectedDate + 'T00:00:00');
                    let dayIdx = dateObj.getDay() - 1;
                    if (dayIdx === -1) dayIdx = 6;
                    const dayItem = weeklySchedule[dayIdx];
                    return dayItem?.enabled 
                      ? `${dayItem.intervals.map(i => `${i.start} - ${i.end}`).join(', ')}` 
                      : 'Unavailable on routine schedule';
                  })()}
                </span>
              </div>

              {customOverrides[selectedDate] && (
                <div className="flex items-center justify-between text-blue-700 font-semibold pt-1 border-t border-slate-200">
                  <span>Custom Override:</span>
                  <span>
                    {customOverrides[selectedDate].intervals?.map(i => `${i.start} - ${i.end}`).join(', ') || 'Custom Hours'}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                <span className="text-[#64748B] font-medium">Confirmed Fan Bookings:</span>
                <span className="font-bold text-[#172554]">
                  {getBookingsForDate(selectedDate).length} session(s)
                </span>
              </div>
            </div>

            {/* Quick Actions for Selected Date */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => toggleBlockSelectedDate(selectedDate)}
                className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer border shadow-xs ${
                  isDateBlocked(selectedDate)
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500'
                    : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
                }`}
              >
                <Ban className="w-4 h-4" />
                <span>{isDateBlocked(selectedDate) ? 'Unblock Date (Allow Bookings)' : 'Mark Date Unavailable (Block Date)'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowCustomHoursModal(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-[#F8FAFC] hover:bg-[#EFF6FF] text-[#172554] hover:text-[#1D4ED8] border border-slate-200/90 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Sliders className="w-4 h-4 text-brand-500" />
                <span>Set Custom Hours for this Date</span>
              </button>

              {customOverrides[selectedDate] && (
                <button
                  type="button"
                  onClick={() => handleRemoveCustomOverride(selectedDate)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs transition-colors cursor-pointer"
                >
                  Remove Custom Override
                </button>
              )}
            </div>
          </div>

          <p className="text-[11px] text-[#64748B] text-center pt-2 border-t border-slate-100">
            Changes will take effect once you click <span className="font-bold text-[#172554]">Save Changes</span> above.
          </p>
        </div>

      </div>

      {/* ================= 5. BOOKING PREFERENCES (Collapsible Section) ================= */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        
        {/* Accordion Trigger */}
        <button
          type="button"
          onClick={() => setPreferencesOpen(prev => !prev)}
          className="w-full p-6 sm:p-8 flex items-center justify-between text-left cursor-pointer hover:bg-[#F8FAFC]/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] text-[#1D4ED8] border border-[#DBEAFE] flex items-center justify-center">
              <Sliders className="w-4 h-4 text-[#1D4ED8]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-extrabold text-[#172554] tracking-tight">
                  Booking Preferences
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#1D4ED8] border border-[#DBEAFE]">
                  Advanced Rules
                </span>
              </div>
              <p className="text-xs text-[#64748B]">
                Buffer time, advance notice, daily session limits, and supported durations.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block text-xs font-bold text-[#64748B]">
              {preferencesOpen ? 'Hide' : 'Configure'}
            </span>
            {preferencesOpen ? (
              <ChevronUp className="w-5 h-5 text-[#64748B]" />
            ) : (
              <ChevronDown className="w-5 h-5 text-[#64748B]" />
            )}
          </div>
        </button>

        {/* Accordion Body */}
        {preferencesOpen && (
          <div className="p-6 sm:p-8 pt-0 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
            
            {/* Setting 1: Minimum Advance Booking Time */}
            <div className="p-4.5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-2">
              <label className="block text-xs font-bold text-[#172554]">
                Minimum Advance Notice
              </label>
              <select
                value={preferences.minNoticeHours}
                onChange={e => setPreferences(prev => ({ ...prev, minNoticeHours: parseInt(e.target.value, 10) }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-[#172554] focus:outline-none focus:border-brand-500"
              >
                <option value={1}>1 hour before session</option>
                <option value={2}>2 hours before session (Recommended)</option>
                <option value={4}>4 hours before session</option>
                <option value={12}>12 hours before session</option>
                <option value={24}>24 hours (1 full day notice)</option>
                <option value={48}>48 hours (2 days notice)</option>
              </select>
              <p className="text-[11px] text-[#64748B]">
                Prevents sudden bookings so you always have time to prepare.
              </p>
            </div>

            {/* Setting 2: Maximum Advance Booking Window */}
            <div className="p-4.5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-2">
              <label className="block text-xs font-bold text-[#172554]">
                Maximum Advance Booking Window
              </label>
              <select
                value={preferences.maxAdvanceDays}
                onChange={e => setPreferences(prev => ({ ...prev, maxAdvanceDays: parseInt(e.target.value, 10) }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-[#172554] focus:outline-none focus:border-brand-500"
              >
                <option value={7}>Up to 7 days ahead</option>
                <option value={14}>Up to 14 days ahead</option>
                <option value={30}>Up to 30 days ahead (Recommended)</option>
                <option value={60}>Up to 60 days ahead</option>
                <option value={90}>Up to 90 days ahead</option>
              </select>
              <p className="text-[11px] text-[#64748B]">
                How far into the future fans can schedule booking sessions.
              </p>
            </div>

            {/* Setting 3: Buffer Time Between Calls */}
            <div className="p-4.5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-2">
              <label className="block text-xs font-bold text-[#172554]">
                Buffer Time Between Calls
              </label>
              <select
                value={preferences.bufferMinutes}
                onChange={e => setPreferences(prev => ({ ...prev, bufferMinutes: parseInt(e.target.value, 10) }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-[#172554] focus:outline-none focus:border-brand-500"
              >
                <option value={0}>0 minutes (Back-to-back)</option>
                <option value={5}>5 minutes break</option>
                <option value={10}>10 minutes break (Recommended)</option>
                <option value={15}>15 minutes break</option>
                <option value={30}>30 minutes break</option>
              </select>
              <p className="text-[11px] text-[#64748B]">
                Automatic breathing room added between consecutive bookings.
              </p>
            </div>

            {/* Setting 4: Maximum Bookings per Day */}
            <div className="p-4.5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-2">
              <label className="block text-xs font-bold text-[#172554]">
                Maximum Bookings per Day
              </label>
              <select
                value={preferences.maxBookingsPerDay}
                onChange={e => setPreferences(prev => ({ ...prev, maxBookingsPerDay: parseInt(e.target.value, 10) }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-[#172554] focus:outline-none focus:border-brand-500"
              >
                <option value={3}>Max 3 calls / day</option>
                <option value={5}>Max 5 calls / day</option>
                <option value={8}>Max 8 calls / day (Recommended)</option>
                <option value={10}>Max 10 calls / day</option>
                <option value={999}>Unlimited</option>
              </select>
              <p className="text-[11px] text-[#64748B]">
                Prevents creator fatigue by capping the daily booking volume.
              </p>
            </div>

            {/* Setting 5: Call Duration Compatibility */}
            <div className="md:col-span-2 p-4.5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-2">
              <label className="block text-xs font-bold text-[#172554]">
                Call Duration Compatibility
              </label>
              <div className="flex flex-wrap gap-3">
                {[10, 15, 30].map(duration => {
                  const isChecked = preferences.allowedDurations?.includes(duration);
                  return (
                    <button
                      key={duration}
                      type="button"
                      onClick={() => {
                        const current = preferences.allowedDurations || [10, 15, 30];
                        if (isChecked && current.length === 1) {
                          showToast('At least one call duration must remain active.');
                          return;
                        }
                        const updated = isChecked ? current.filter(d => d !== duration) : [...current, duration];
                        setPreferences(prev => ({ ...prev, allowedDurations: updated }));
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-2 ${
                        isChecked
                          ? 'bg-[#EFF6FF] text-[#172554] border-brand-500 shadow-xs'
                          : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-md flex items-center justify-center ${
                        isChecked ? 'bg-brand-500 text-white' : 'border border-slate-300'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span>{duration} Minutes Session</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-[#64748B]">
                Only durations enabled above will be generated as bookable slots for fans.
              </p>
            </div>

          </div>
        )}

      </div>

      {/* ================= 6. TIME-SLOT PREVIEW (ClockTimeSelector) ================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] text-[#1D4ED8] border border-[#DBEAFE] flex items-center justify-center">
              <Eye className="w-4 h-4 text-[#1D4ED8]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-[#172554] tracking-tight">
                  Time-Slot Preview (Fan Booking View)
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {generatedSlotsForDate.length} Available Slots
                </span>
              </div>
              <p className="text-xs text-[#64748B]">
                Preview real-time slots generated for {new Date(selectedDate + 'T00:00:00').toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })}.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-[#64748B]">
            <span>Selected Date:</span>
            <span className="text-brand-600 font-mono font-bold bg-[#F8FAFC] px-2.5 py-1 rounded-lg border border-slate-200">
              {selectedDate}
            </span>
          </div>
        </div>

        {/* Embedded ClockTimeSelector Component */}
        <ClockTimeSelector
          availableSlots={generatedSlotsForDate}
          selectedSlot={previewSelectedSlot}
          onSelectSlot={setPreviewSelectedSlot}
          selectedDate={selectedDate}
          onRetry={() => {
            showToast('Refreshed slot calculation.');
          }}
        />

      </div>

      {/* ================= 7. FOOTER SAVE ACTIONS ================= */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-[#64748B]">
          {isDirty ? (
            <span className="text-amber-600 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              You have unsaved schedule changes
            </span>
          ) : (
            <span className="text-slate-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              All schedule settings and working hours are synchronized
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
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-7 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:bg-slate-300 text-white font-bold text-xs shadow-md shadow-brand-500/25 transition-all cursor-pointer"
          >
            {isSaving ? (
              <>
                <Clock className="w-4 h-4 animate-spin" />
                <span>Saving Schedule...</span>
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

      {/* ================= CUSTOM HOURS OVERRIDE MODAL ================= */}
      {showCustomHoursModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200/90 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h4 className="text-sm font-bold text-[#172554]">Set Custom Schedule</h4>
                <p className="text-[11px] text-[#64748B]">Date: {selectedDate}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowCustomHoursModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#64748B]">
              Specify special working hours for this single date (e.g. half-day or extended evening slots):
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#172554] mb-1">Start Time</label>
                <select
                  value={customStart}
                  onChange={e => setCustomStart(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs font-semibold text-[#172554] focus:outline-none focus:border-brand-500"
                >
                  {TIME_OPTIONS.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172554] mb-1">End Time</label>
                <select
                  value={customEnd}
                  onChange={e => setCustomEnd(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs font-semibold text-[#172554] focus:outline-none focus:border-brand-500"
                >
                  {TIME_OPTIONS.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowCustomHoursModal(false)}
                className="px-4 py-2 rounded-xl bg-[#F8FAFC] hover:bg-slate-100 text-[#64748B] hover:text-[#172554] border border-slate-200 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyCustomHours}
                className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-sm shadow-brand-500/25 cursor-pointer"
              >
                Apply Custom Schedule
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
