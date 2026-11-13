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
  Info,
  HelpCircle,
  AlertTriangle
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

// Generate calendar cells for a month (Mon to Sun)
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

  // --- Initial Weekly Schedule Generator (Mon-Sat 9-1 & 3-7, Sun disabled) ---
  const initialWeeklySchedule: DayScheduleItem[] = useMemo(() => {
    if (currentInfluencer.availability?.weeklySchedule && currentInfluencer.availability.weeklySchedule.length === 7) {
      return currentInfluencer.availability.weeklySchedule;
    }

    return ALL_DAYS.map(d => {
      const isEnabled = d.short !== 'Sun';
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

  // ================= SECTION 1 CALENDAR STATE (Calendar & Blackout Dates) =================
  const [section1MonthDate, setSection1MonthDate] = useState(() => new Date());
  const [section1SelectedDate, setSection1SelectedDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });

  // ================= SECTION 2 CALENDAR STATE (Weekly Working Hours Calendar) =================
  const [section2MonthDate, setSection2MonthDate] = useState(() => new Date());
  const [section2SelectedDate, setSection2SelectedDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });

  // UI state feedback
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessBanner, setSaveSuccessBanner] = useState(false);

  // --- Modals State ---
  // 1. Block date confirmation modal (when bookings exist)
  const [showBlockConfirmModal, setShowBlockConfirmModal] = useState(false);
  const [dateToBlock, setDateToBlock] = useState<string | null>(null);

  // 2. Custom hours modal (supports multiple intervals)
  const [showCustomHoursModal, setShowCustomHoursModal] = useState(false);
  const [targetDateForCustom, setTargetDateForCustom] = useState<string>(section1SelectedDate);
  const [customIntervals, setCustomIntervals] = useState<TimeIntervalItem[]>([
    { id: 'custom-1', start: '10:00 AM', end: '02:00 PM' }
  ]);
  const [customModalError, setCustomModalError] = useState<string | null>(null);

  // 3. Weekly Routine Configuration Modal (for Section 2)
  const [showRoutineConfigModal, setShowRoutineConfigModal] = useState(false);
  const [routineActiveDayIdx, setRoutineActiveDayIdx] = useState<number>(0);
  const [routineTempSchedule, setRoutineTempSchedule] = useState<DayScheduleItem[]>(weeklySchedule);
  const [routineModalError, setRoutineModalError] = useState<string | null>(null);

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
    const origOverrides = JSON.stringify(currentInfluencer.availability?.customDateOverrides || {});
    const currOverrides = JSON.stringify(customOverrides);

    return origSchedule !== currSchedule || 
           origBlocked !== currBlocked || 
           origStatus !== isTakingBookings || 
           origPref !== currPref ||
           origOverrides !== currOverrides;
  }, [weeklySchedule, blockedDates, isTakingBookings, preferences, customOverrides, initialWeeklySchedule, currentInfluencer.availability]);

  // Check if a date is blocked
  const isDateBlocked = (dateStr: string) => blockedDates.includes(dateStr);

  const getBookingsForDate = (dateStr: string) => {
    return creatorBookings.filter(b => b.scheduledDate === dateStr && b.bookingStatus !== 'cancelled' && b.bookingStatus !== 'rejected');
  };

  // Determine availability status for any date
  const getDateAvailabilityStatus = (dateStr: string) => {
    if (!isTakingBookings) return { available: false, isCustom: false, isBlocked: false, reason: 'All bookings paused' };
    if (blockedDates.includes(dateStr)) return { available: false, isCustom: false, isBlocked: true, reason: 'Blocked Date (Off)' };

    // Check custom date override
    if (customOverrides[dateStr]) {
      return { 
        available: !customOverrides[dateStr].isUnavailable, 
        isCustom: true,
        isBlocked: false,
        reason: customOverrides[dateStr].isUnavailable ? 'Custom off-day' : 'Custom Hours' 
      };
    }

    // Check routine weekday
    const dateObj = new Date(dateStr + 'T00:00:00');
    let dayIdx = dateObj.getDay() - 1;
    if (dayIdx === -1) dayIdx = 6;
    const dayItem = weeklySchedule[dayIdx];

    return {
      available: !!(dayItem && dayItem.enabled && dayItem.intervals.length > 0),
      isCustom: false,
      isBlocked: false,
      reason: dayItem?.enabled ? 'Standard Working Day' : 'Day off (Weekly Routine)'
    };
  };

  // --- Block/Unblock Handlers ---
  const handleBlockDateClick = (dateStr: string) => {
    if (isDateBlocked(dateStr)) {
      setBlockedDates(prev => prev.filter(d => d !== dateStr));
      showToast(`${dateStr} unblocked. Bookings allowed.`);
      return;
    }

    const dateBookings = getBookingsForDate(dateStr);
    if (dateBookings.length > 0) {
      setDateToBlock(dateStr);
      setShowBlockConfirmModal(true);
    } else {
      setBlockedDates(prev => [...prev, dateStr]);
      showToast(`${dateStr} marked as unavailable.`);
    }
  };

  const handleConfirmBlockDate = () => {
    if (dateToBlock) {
      setBlockedDates(prev => [...prev, dateToBlock]);
      showToast(`${dateToBlock} marked as unavailable.`);
      setDateToBlock(null);
      setShowBlockConfirmModal(false);
    }
  };

  // --- Restore Routine Schedule for a Date ---
  const handleRestoreRoutineSchedule = (dateStr: string) => {
    let hadChanges = false;
    if (blockedDates.includes(dateStr)) {
      setBlockedDates(prev => prev.filter(d => d !== dateStr));
      hadChanges = true;
    }
    if (customOverrides[dateStr]) {
      setCustomOverrides(prev => {
        const copy = { ...prev };
        delete copy[dateStr];
        return copy;
      });
      hadChanges = true;
    }

    const dateObj = new Date(dateStr + 'T00:00:00');
    const weekdayName = dateObj.toLocaleDateString('default', { weekday: 'long' });

    if (hadChanges) {
      showToast(`Restored ${dateStr} to recurring ${weekdayName} routine.`);
    } else {
      showToast(`${dateStr} is already using the recurring ${weekdayName} routine.`);
    }
  };

  // --- Custom Hours Modal Open ---
  const handleOpenCustomHoursModal = (dateStr: string) => {
    setTargetDateForCustom(dateStr);
    if (customOverrides[dateStr]?.intervals && customOverrides[dateStr].intervals!.length > 0) {
      setCustomIntervals(customOverrides[dateStr].intervals!);
    } else {
      // Prefill with routine hours if available
      const dateObj = new Date(dateStr + 'T00:00:00');
      let dayIdx = dateObj.getDay() - 1;
      if (dayIdx === -1) dayIdx = 6;
      const routineDay = weeklySchedule[dayIdx];
      if (routineDay?.enabled && routineDay.intervals.length > 0) {
        setCustomIntervals(routineDay.intervals.map(inv => ({ ...inv, id: `custom-${Date.now()}-${inv.id}` })));
      } else {
        setCustomIntervals([
          { id: `custom-${Date.now()}-1`, start: '10:00 AM', end: '02:00 PM' }
        ]);
      }
    }
    setCustomModalError(null);
    setShowCustomHoursModal(true);
  };

  const handleSaveCustomHours = () => {
    for (let i = 0; i < customIntervals.length; i++) {
      const inv = customIntervals[i];
      const startMin = timeToMinutes(inv.start);
      const endMin = timeToMinutes(inv.end);
      if (startMin >= endMin) {
        setCustomModalError('End time must be after start time.');
        return;
      }
      for (let j = i + 1; j < customIntervals.length; j++) {
        const other = customIntervals[j];
        const oStart = timeToMinutes(other.start);
        const oEnd = timeToMinutes(other.end);
        if (Math.max(startMin, oStart) < Math.min(endMin, oEnd)) {
          setCustomModalError('Custom intervals cannot overlap.');
          return;
        }
      }
    }

    setCustomOverrides(prev => ({
      ...prev,
      [targetDateForCustom]: {
        date: targetDateForCustom,
        isUnavailable: false,
        intervals: customIntervals,
        note: 'Custom date override hours.'
      }
    }));

    if (blockedDates.includes(targetDateForCustom)) {
      setBlockedDates(prev => prev.filter(d => d !== targetDateForCustom));
    }

    setShowCustomHoursModal(false);
    showToast(`Custom hours applied for ${targetDateForCustom}.`);
  };

  // --- Routine Modal Open & Save ---
  const handleOpenRoutineModal = (initialWeekdayIdx?: number) => {
    setRoutineTempSchedule(JSON.parse(JSON.stringify(weeklySchedule)));
    if (typeof initialWeekdayIdx === 'number') {
      setRoutineActiveDayIdx(initialWeekdayIdx);
    }
    setRoutineModalError(null);
    setShowRoutineConfigModal(true);
  };

  const handleSaveRoutineConfig = () => {
    // Validate intervals across all days in routineTempSchedule
    for (const d of routineTempSchedule) {
      if (!d.enabled) continue;
      for (let i = 0; i < d.intervals.length; i++) {
        const inv = d.intervals[i];
        const startMin = timeToMinutes(inv.start);
        const endMin = timeToMinutes(inv.end);
        if (startMin >= endMin) {
          setRoutineModalError(`Invalid interval on ${d.day}: end time must be after start time.`);
          return;
        }
        for (let j = i + 1; j < d.intervals.length; j++) {
          const other = d.intervals[j];
          const oStart = timeToMinutes(other.start);
          const oEnd = timeToMinutes(other.end);
          if (Math.max(startMin, oStart) < Math.min(endMin, oEnd)) {
            setRoutineModalError(`Overlapping intervals detected on ${d.day}.`);
            return;
          }
        }
      }
    }

    setWeeklySchedule(routineTempSchedule);
    setShowRoutineConfigModal(false);
    showToast('Weekly routine working hours updated and applied across all calendar weeks!');
  };

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
    showToast('Changes discarded.');
  };

  // --- Save Availability to Backend ---
  const handleSave = async () => {
    setIsSaving(true);

    const activeShortDays = weeklySchedule.filter(d => d.enabled).map(d => d.short);
    
    const sampleSlots: string[] = [];
    weeklySchedule.forEach(d => {
      if (!d.enabled) return;
      d.intervals.forEach(inv => {
        if (!sampleSlots.includes(inv.start)) sampleSlots.push(inv.start);
      });
    });

    const updatedAvailability = {
      days: activeShortDays,
      timeSlots: sampleSlots.length > 0 ? sampleSlots : ['09:00 AM', '10:00 AM', '03:00 PM', '04:00 PM'],
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

  const todayStr = new Date().toISOString().split('T')[0];

  // Calendar cells for Section 1 and Section 2
  const section1Days = useMemo(() => {
    return generateMonthDays(section1MonthDate.getFullYear(), section1MonthDate.getMonth());
  }, [section1MonthDate]);

  const section2Days = useMemo(() => {
    return generateMonthDays(section2MonthDate.getFullYear(), section2MonthDate.getMonth());
  }, [section2MonthDate]);

  return (
    <div className="space-y-5 pb-16 max-w-7xl mx-auto font-sans">
      
      {/* ================= PAGE HEADER ================= */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-[#E2E8F0] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F2F7FF] text-[#102B5C] border border-[#DBEAFE] flex items-center justify-center shrink-0">
              <CalendarDays className="w-6 h-6 stroke-[2]" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#102B5C] tracking-tight">
                  Availability & Schedule
                </h1>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  isTakingBookings 
                    ? 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]' 
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
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#F8FAFC] hover:bg-[#F2F7FF] text-[#102B5C] border border-[#E2E8F0] font-bold text-xs transition-colors cursor-pointer shadow-xs"
              title="Preview public profile booking slot view as a fan"
            >
              <Eye className="w-4 h-4 text-[#FF7417]" />
              <span>Preview Booking Page</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#FF7417] hover:bg-[#e0620f] active:scale-[0.98] text-white font-bold text-xs shadow-md shadow-[#FF7417]/25 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>

        </div>

        {/* Global Save Success Notification Banner */}
        {saveSuccessBanner && (
          <div className="mt-4 p-3.5 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-between text-xs text-[#065F46] font-bold animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Your weekly schedule, blackout dates, and booking rules are live on BookMyStar!</span>
            </div>
            <button
              type="button"
              onClick={() => setSaveSuccessBanner(false)}
              className="p-1 rounded-lg hover:bg-emerald-100 text-[#065F46] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* ================= AVAILABILITY OVERVIEW (Compact Summary Cards) ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        
        {/* Card 1: Availability Status Toggle */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
              Availability Status
            </span>
            <span className={`text-sm font-extrabold ${isTakingBookings ? 'text-[#065F46]' : 'text-slate-500'}`}>
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
              isTakingBookings ? 'bg-[#FF7417]' : 'bg-slate-300'
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
        <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
              Available Days
            </span>
            <div className="text-base font-extrabold text-[#102B5C]">
              {weeklySchedule.filter(d => d.enabled).length} of 7 Days Active
            </div>
            <p className="text-[10px] text-[#64748B] truncate">
              {weeklySchedule.filter(d => d.enabled).map(d => d.short).join(', ') || 'No active days'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#F2F7FF] text-[#102B5C] border border-[#DBEAFE] flex items-center justify-center shrink-0">
            <CalendarIcon className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Working Hours Average */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
              Working Hours
            </span>
            <div className="text-base font-extrabold text-[#102B5C]">
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
          <div className="w-10 h-10 rounded-xl bg-[#F2F7FF] text-[#102B5C] border border-[#DBEAFE] flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Upcoming Bookings */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
              Upcoming Bookings
            </span>
            <div className="text-base font-extrabold text-[#102B5C]">
              {upcomingBookings.length} {upcomingBookings.length === 1 ? 'Call' : 'Calls'} Scheduled
            </div>
            <p className="text-[10px] text-emerald-600 font-semibold truncate">
              {upcomingBookings[0] ? `Next: ${upcomingBookings[0].scheduledDate} at ${upcomingBookings[0].scheduledTime}` : 'All caught up'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] flex items-center justify-center shrink-0">
            <PhoneCall className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* ================= 1. WEEKLY WORKING HOURS (CALENDAR-BASED INTERFACE) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Section – Weekly Working Hours Monthly Calendar (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-4 sm:p-5 border border-[#E2E8F0] shadow-sm space-y-3">
          
          {/* Header with Title + Configure Routine Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#F2F7FF] text-[#102B5C] border border-[#DBEAFE] flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-[#102B5C]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm sm:text-base font-extrabold text-[#102B5C] tracking-tight">
                    Weekly Working Hours
                  </h2>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
                    Recurring
                  </span>
                </div>
                <p className="text-[11px] text-[#64748B]">
                  View and manage your recurring weekly working hours across the monthly calendar.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
              {/* Configure Recurring Weekday Routine Button */}
              <button
                type="button"
                onClick={() => handleOpenRoutineModal()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F8FAFC] hover:bg-[#F2F7FF] text-[#102B5C] border border-[#E2E8F0] text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                title="Configure Monday–Sunday recurring routine hours"
              >
                <Sliders className="w-3.5 h-3.5 text-[#FF7417]" />
                <span>Configure Weekly Routine</span>
              </button>
            </div>
          </div>

          {/* Month Navigation & Today Shortcut for Weekly Working Hours */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#64748B]">
              Recurring Schedule Overview
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  const today = new Date();
                  setSection2MonthDate(new Date(today.getFullYear(), today.getMonth(), 1));
                  setSection2SelectedDate(today.toISOString().split('T')[0]);
                }}
                className="px-2.5 py-1 rounded-lg bg-[#F8FAFC] hover:bg-[#F2F7FF] text-[#102B5C] border border-[#E2E8F0] text-xs font-bold transition-colors cursor-pointer mr-1"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setSection2MonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                className="p-1 rounded-lg bg-[#F8FAFC] hover:bg-[#F2F7FF] text-[#102B5C] border border-[#E2E8F0] transition-colors cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-extrabold text-[#102B5C] px-1.5 min-w-[120px] text-center">
                {section2MonthDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </span>
              <button
                type="button"
                onClick={() => setSection2MonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                className="p-1 rounded-lg bg-[#F8FAFC] hover:bg-[#F2F7FF] text-[#102B5C] border border-[#E2E8F0] transition-colors cursor-pointer"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Monthly Calendar Grid for Weekly Working Hours */}
          <div>
            <div className="grid grid-cols-7 gap-1 text-center pb-1 border-b border-slate-100">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(wd => (
                <span key={wd} className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                  {wd}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 pt-1">
              {section2Days.map((cell) => {
                const isSelected = section2SelectedDate === cell.dateStr;
                const status = getDateAvailabilityStatus(cell.dateStr);
                const isBlocked = blockedDates.includes(cell.dateStr);
                const dayBookings = getBookingsForDate(cell.dateStr);
                const hasBookings = dayBookings.length > 0;
                const isPast = cell.dateStr < todayStr;
                const isToday = cell.dateStr === todayStr;

                return (
                  <button
                    key={cell.dateStr}
                    type="button"
                    onClick={() => setSection2SelectedDate(cell.dateStr)}
                    className={`h-11 sm:h-12 p-1 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center justify-between relative ${
                      isSelected
                        ? 'border-2 border-[#FF7417] bg-[#FF7417]/10 text-[#102B5C] font-black shadow-sm ring-2 ring-[#FF7417]/20'
                        : isBlocked
                        ? 'bg-[#FEF2F2] border-[#FECACA] text-[#B91C1C] hover:bg-red-100/70'
                        : isPast
                        ? 'bg-slate-50/60 border-slate-100 text-slate-300'
                        : status.available
                        ? 'bg-[#ECFDF5]/60 hover:bg-[#ECFDF5] border-[#A7F3D0]/80 text-[#102B5C] font-semibold'
                        : 'bg-slate-50 border-slate-100 text-slate-400'
                    } ${!cell.isCurrentMonth ? 'opacity-35' : ''}`}
                  >
                    <div className="w-full flex items-center justify-between text-[11px] leading-none">
                      <span className={isSelected ? 'font-black text-[#FF7417]' : ''}>
                        {cell.dayNum}
                      </span>
                      {isToday && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF7417]" title="Today" />
                      )}
                    </div>

                    <div className="flex items-center gap-1 justify-center w-full">
                      {isBlocked ? (
                        <span className="text-[8.5px] font-bold text-[#B91C1C] bg-red-100 px-1 py-0.2 rounded">
                          Off
                        </span>
                      ) : hasBookings ? (
                        <span className="text-[8.5px] font-bold text-amber-800 bg-amber-100 px-1 rounded flex items-center gap-0.5">
                          <span className="w-1 h-1 rounded-full bg-[#FF7417]" />
                          <span>{dayBookings.length}</span>
                        </span>
                      ) : status.isCustom ? (
                        <span className="text-[8.5px] font-bold text-blue-700 bg-blue-100 px-1 rounded">
                          Mod
                        </span>
                      ) : (
                        <span className="w-1 h-1 rounded-full bg-emerald-500 opacity-60" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Legend for Weekly Working Hours */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[10px] font-semibold text-[#64748B]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-[#ECFDF5] border border-[#A7F3D0]" />
              <span>Available (Routine Active)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-[#FEF2F2] border border-[#FECACA]" />
              <span>Unavailable (Off)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-amber-100 border border-amber-300 flex items-center justify-center">
                <span className="w-1 h-1 rounded-full bg-[#FF7417]" />
              </span>
              <span>Has Bookings</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-[#FF7417]/10 border-2 border-[#FF7417]" />
              <span>Selected</span>
            </div>
          </div>
        </div>

        {/* Right Section – Selected Date Configuration Panel for Weekly Working Hours (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-4 sm:p-5 border border-[#E2E8F0] shadow-sm flex flex-col justify-between space-y-3">
          <div className="space-y-2.5">
            
            <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                  Date Configuration
                </span>
                <h3 className="text-sm sm:text-base font-extrabold text-[#102B5C]">
                  {new Date(section2SelectedDate + 'T00:00:00').toLocaleDateString('default', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </h3>
              </div>

              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                isDateBlocked(section2SelectedDate)
                  ? 'bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA]'
                  : getDateAvailabilityStatus(section2SelectedDate).available
                  ? 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]'
                  : 'bg-slate-100 text-slate-500'
              }`}>
                {isDateBlocked(section2SelectedDate)
                  ? 'Unavailable / Blocked'
                  : getDateAvailabilityStatus(section2SelectedDate).available
                  ? 'Available'
                  : 'Routine Off'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5 text-xs">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[#64748B] font-medium shrink-0">Routine Schedule:</span>
                <span className="font-bold text-[#102B5C] text-right">
                  {(() => {
                    const dateObj = new Date(section2SelectedDate + 'T00:00:00');
                    let dayIdx = dateObj.getDay() - 1;
                    if (dayIdx === -1) dayIdx = 6;
                    const dayItem = weeklySchedule[dayIdx];
                    return dayItem?.enabled 
                      ? dayItem.intervals.map(i => `${i.start} – ${i.end}`).join(', ')
                      : `Not taking bookings on ${dayItem?.day || 'this day'}s`;
                  })()}
                </span>
              </div>

              {customOverrides[section2SelectedDate] && (
                <div className="flex items-center justify-between text-blue-700 font-semibold pt-1 border-t border-slate-200">
                  <span className="text-xs">Custom Override:</span>
                  <span className="text-xs">
                    {customOverrides[section2SelectedDate].intervals?.map(i => `${i.start} – ${i.end}`).join(', ') || 'Custom Hours'}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                <span className="text-[#64748B] font-medium">Confirmed Fan Bookings:</span>
                <span className="font-bold text-[#102B5C] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF7417]" />
                  <span>{getBookingsForDate(section2SelectedDate).length} session(s)</span>
                </span>
              </div>
            </div>

            {/* Actions for Weekly Working Hours: Block Date, Custom Hours, Restore Routine */}
            <div className="space-y-2 pt-1">
              
              {/* Action 1: Mark Date Unavailable (Block Date) */}
              <button
                type="button"
                onClick={() => handleBlockDateClick(section2SelectedDate)}
                className={`w-full py-2 px-3.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer border shadow-xs ${
                  isDateBlocked(section2SelectedDate)
                    ? 'bg-[#ECFDF5] hover:bg-emerald-100 text-[#065F46] border-[#A7F3D0]'
                    : 'bg-[#FEF2F2] hover:bg-red-100 text-[#B91C1C] border-[#FECACA]'
                }`}
              >
                <Ban className="w-3.5 h-3.5" />
                <span>
                  {isDateBlocked(section2SelectedDate) ? 'Unblock Date (Allow Bookings)' : 'Mark Date Unavailable (Block Date)'}
                </span>
              </button>

              {/* Action 2: Set Custom Hours for this Date */}
              <button
                type="button"
                onClick={() => handleOpenCustomHoursModal(section2SelectedDate)}
                className="w-full py-2 px-3.5 rounded-lg bg-[#F8FAFC] hover:bg-[#F2F7FF] text-[#102B5C] border border-[#E2E8F0] font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Sliders className="w-3.5 h-3.5 text-[#FF7417]" />
                <span>Set Custom Hours for this Date</span>
              </button>

              {/* Action 3: Restore Routine Schedule */}
              <button
                type="button"
                onClick={() => handleRestoreRoutineSchedule(section2SelectedDate)}
                disabled={!isDateBlocked(section2SelectedDate) && !customOverrides[section2SelectedDate]}
                className="w-full py-2 px-3.5 rounded-lg bg-white hover:bg-[#F8FAFC] text-[#102B5C] border border-[#E2E8F0] disabled:opacity-40 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#FF7417]" />
                <span>Restore Routine Schedule</span>
              </button>

            </div>
          </div>

          <p className="text-[10px] text-[#64748B] text-center pt-1.5 border-t border-slate-100">
            Weekly routine hours repeat automatically every week.
          </p>
        </div>

      </div>

      {/* ================= 2. CALENDAR & BLACKOUT DATES ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Section – Monthly Calendar (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-4 sm:p-5 border border-[#E2E8F0] shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#F2F7FF] text-[#102B5C] border border-[#DBEAFE] flex items-center justify-center shrink-0">
                <CalendarDays className="w-4 h-4 text-[#102B5C]" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-extrabold text-[#102B5C] tracking-tight">
                  Calendar & Blackout Dates
                </h2>
                <p className="text-[11px] text-[#64748B]">
                  Click any date to block it or set custom date-specific hours.
                </p>
              </div>
            </div>

            {/* Month Navigation & Today Shortcut */}
            <div className="flex items-center gap-1 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => {
                  const today = new Date();
                  setSection1MonthDate(new Date(today.getFullYear(), today.getMonth(), 1));
                  setSection1SelectedDate(today.toISOString().split('T')[0]);
                }}
                className="px-2.5 py-1 rounded-lg bg-[#F8FAFC] hover:bg-[#F2F7FF] text-[#102B5C] border border-[#E2E8F0] text-xs font-bold transition-colors cursor-pointer mr-1"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setSection1MonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                className="p-1 rounded-lg bg-[#F8FAFC] hover:bg-[#F2F7FF] text-[#102B5C] border border-[#E2E8F0] transition-colors cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-extrabold text-[#102B5C] px-1.5 min-w-[120px] text-center">
                {section1MonthDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </span>
              <button
                type="button"
                onClick={() => setSection1MonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                className="p-1 rounded-lg bg-[#F8FAFC] hover:bg-[#F2F7FF] text-[#102B5C] border border-[#E2E8F0] transition-colors cursor-pointer"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 7-Day Monthly Calendar Grid */}
          <div>
            <div className="grid grid-cols-7 gap-1 text-center pb-1 border-b border-slate-100">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(wd => (
                <span key={wd} className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                  {wd}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 pt-1">
              {section1Days.map((cell) => {
                const isSelected = section1SelectedDate === cell.dateStr;
                const status = getDateAvailabilityStatus(cell.dateStr);
                const isBlocked = blockedDates.includes(cell.dateStr);
                const dayBookings = getBookingsForDate(cell.dateStr);
                const hasBookings = dayBookings.length > 0;
                const isPast = cell.dateStr < todayStr;
                const isToday = cell.dateStr === todayStr;

                return (
                  <button
                    key={cell.dateStr}
                    type="button"
                    onClick={() => setSection1SelectedDate(cell.dateStr)}
                    className={`h-11 sm:h-12 p-1 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center justify-between relative ${
                      isSelected
                        ? 'border-2 border-[#FF7417] bg-[#FF7417]/10 text-[#102B5C] font-black shadow-sm ring-2 ring-[#FF7417]/20'
                        : isBlocked
                        ? 'bg-[#FEF2F2] border-[#FECACA] text-[#B91C1C] hover:bg-red-100/70'
                        : isPast
                        ? 'bg-slate-50/60 border-slate-100 text-slate-300'
                        : status.available
                        ? 'bg-[#ECFDF5]/60 hover:bg-[#ECFDF5] border-[#A7F3D0]/80 text-[#102B5C] font-semibold'
                        : 'bg-slate-50 border-slate-100 text-slate-400'
                    } ${!cell.isCurrentMonth ? 'opacity-35' : ''}`}
                  >
                    <div className="w-full flex items-center justify-between text-[11px] leading-none">
                      <span className={isSelected ? 'font-black text-[#FF7417]' : ''}>
                        {cell.dayNum}
                      </span>
                      {isToday && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF7417]" title="Today" />
                      )}
                    </div>

                    <div className="flex items-center gap-1 justify-center w-full">
                      {isBlocked ? (
                        <span className="text-[8.5px] font-bold text-[#B91C1C] bg-red-100 px-1 py-0.2 rounded">
                          Off
                        </span>
                      ) : hasBookings ? (
                        <span className="text-[8.5px] font-bold text-amber-800 bg-amber-100 px-1 rounded flex items-center gap-0.5">
                          <span className="w-1 h-1 rounded-full bg-[#FF7417]" />
                          <span>{dayBookings.length}</span>
                        </span>
                      ) : status.isCustom ? (
                        <span className="text-[8.5px] font-bold text-blue-700 bg-blue-100 px-1 rounded">
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
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[10px] font-semibold text-[#64748B]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-[#ECFDF5] border border-[#A7F3D0]" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-[#FEF2F2] border border-[#FECACA]" />
              <span>Blocked Date (Off)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-amber-100 border border-amber-300 flex items-center justify-center">
                <span className="w-1 h-1 rounded-full bg-[#FF7417]" />
              </span>
              <span>Has Bookings</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-[#FF7417]/10 border-2 border-[#FF7417]" />
              <span>Selected</span>
            </div>
          </div>
        </div>

        {/* Right Section – Date Configuration (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-4 sm:p-5 border border-[#E2E8F0] shadow-sm flex flex-col justify-between space-y-3">
          <div className="space-y-2.5">
            
            <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                  Date Configuration
                </span>
                <h3 className="text-sm sm:text-base font-extrabold text-[#102B5C]">
                  {new Date(section1SelectedDate + 'T00:00:00').toLocaleDateString('default', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </h3>
              </div>

              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                isDateBlocked(section1SelectedDate)
                  ? 'bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA]'
                  : getDateAvailabilityStatus(section1SelectedDate).available
                  ? 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]'
                  : 'bg-slate-100 text-slate-500'
              }`}>
                {isDateBlocked(section1SelectedDate)
                  ? 'Unavailable / Blocked'
                  : getDateAvailabilityStatus(section1SelectedDate).available
                  ? 'Available'
                  : 'Routine Off'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5 text-xs">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[#64748B] font-medium shrink-0">Routine Schedule:</span>
                <span className="font-bold text-[#102B5C] text-right">
                  {(() => {
                    const dateObj = new Date(section1SelectedDate + 'T00:00:00');
                    let dayIdx = dateObj.getDay() - 1;
                    if (dayIdx === -1) dayIdx = 6;
                    const dayItem = weeklySchedule[dayIdx];
                    return dayItem?.enabled 
                      ? dayItem.intervals.map(i => `${i.start} – ${i.end}`).join(', ')
                      : `Not taking bookings on ${dayItem?.day || 'this day'}s`;
                  })()}
                </span>
              </div>

              {customOverrides[section1SelectedDate] && (
                <div className="flex items-center justify-between text-blue-700 font-semibold pt-1 border-t border-slate-200">
                  <span className="text-xs">Custom Override:</span>
                  <span className="text-xs">
                    {customOverrides[section1SelectedDate].intervals?.map(i => `${i.start} – ${i.end}`).join(', ') || 'Custom Hours'}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                <span className="text-[#64748B] font-medium">Confirmed Fan Bookings:</span>
                <span className="font-bold text-[#102B5C] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF7417]" />
                  <span>{getBookingsForDate(section1SelectedDate).length} session(s)</span>
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => handleBlockDateClick(section1SelectedDate)}
                className={`w-full py-2 px-3.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer border shadow-xs ${
                  isDateBlocked(section1SelectedDate)
                    ? 'bg-[#ECFDF5] hover:bg-emerald-100 text-[#065F46] border-[#A7F3D0]'
                    : 'bg-[#FEF2F2] hover:bg-red-100 text-[#B91C1C] border-[#FECACA]'
                }`}
              >
                <Ban className="w-3.5 h-3.5" />
                <span>
                  {isDateBlocked(section1SelectedDate) ? 'Unblock Date (Allow Bookings)' : 'Mark Date Unavailable (Block Date)'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleOpenCustomHoursModal(section1SelectedDate)}
                className="w-full py-2 px-3.5 rounded-lg bg-[#F8FAFC] hover:bg-[#F2F7FF] text-[#102B5C] border border-[#E2E8F0] font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Sliders className="w-3.5 h-3.5 text-[#FF7417]" />
                <span>Set Custom Hours for this Date</span>
              </button>
            </div>
          </div>

          <p className="text-[10px] text-[#64748B] text-center pt-1.5 border-t border-slate-100">
            Changes will take effect once you click <span className="font-bold text-[#102B5C]">Save Changes</span>.
          </p>
        </div>

      </div>

      {/* ================= SECTION 3: BOOKING PREFERENCES (COLLAPSIBLE ACCORDION) ================= */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        
        {/* Accordion Trigger */}
        <button
          type="button"
          onClick={() => setPreferencesOpen(prev => !prev)}
          className="w-full p-4 sm:p-5 flex items-center justify-between text-left cursor-pointer hover:bg-[#F8FAFC]/50 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#F2F7FF] text-[#102B5C] border border-[#DBEAFE] flex items-center justify-center shrink-0">
              <Sliders className="w-4 h-4 text-[#102B5C]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm sm:text-base font-extrabold text-[#102B5C] tracking-tight">
                  Booking Preferences
                </h2>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#F2F7FF] text-[#102B5C] border border-[#DBEAFE]">
                  Rules
                </span>
              </div>
              <p className="text-[11px] text-[#64748B]">
                Buffer time, advance notice, daily session limits, and supported durations.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block text-xs font-bold text-[#64748B]">
              {preferencesOpen ? 'Hide' : 'Configure'}
            </span>
            {preferencesOpen ? (
              <ChevronUp className="w-4 h-4 text-[#64748B]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#64748B]" />
            )}
          </div>
        </button>

        {/* Accordion Body */}
        {preferencesOpen && (
          <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-3.5 animate-fadeIn">
            
            {/* Setting 1: Minimum Advance Booking Time */}
            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5">
              <label className="block text-xs font-bold text-[#102B5C]">
                Minimum Advance Notice
              </label>
              <select
                value={preferences.minNoticeHours}
                onChange={e => setPreferences(prev => ({ ...prev, minNoticeHours: parseInt(e.target.value, 10) }))}
                className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-xs font-semibold text-[#102B5C] focus:outline-none focus:border-[#FF7417]"
              >
                <option value={1}>1 hour before session</option>
                <option value={2}>2 hours before session (Recommended)</option>
                <option value={4}>4 hours before session</option>
                <option value={12}>12 hours before session</option>
                <option value={24}>24 hours (1 full day notice)</option>
                <option value={48}>48 hours (2 days notice)</option>
              </select>
              <p className="text-[10px] text-[#64748B]">
                Prevents sudden bookings so you always have time to prepare.
              </p>
            </div>

            {/* Setting 2: Maximum Advance Booking Window */}
            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5">
              <label className="block text-xs font-bold text-[#102B5C]">
                Maximum Advance Booking Window
              </label>
              <select
                value={preferences.maxAdvanceDays}
                onChange={e => setPreferences(prev => ({ ...prev, maxAdvanceDays: parseInt(e.target.value, 10) }))}
                className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-xs font-semibold text-[#102B5C] focus:outline-none focus:border-[#FF7417]"
              >
                <option value={7}>Up to 7 days ahead</option>
                <option value={14}>Up to 14 days ahead</option>
                <option value={30}>Up to 30 days ahead (Recommended)</option>
                <option value={60}>Up to 60 days ahead</option>
                <option value={90}>Up to 90 days ahead</option>
              </select>
              <p className="text-[10px] text-[#64748B]">
                How far into the future fans can schedule booking sessions.
              </p>
            </div>

            {/* Setting 3: Buffer Time Between Calls */}
            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5">
              <label className="block text-xs font-bold text-[#102B5C]">
                Buffer Time Between Calls
              </label>
              <select
                value={preferences.bufferMinutes}
                onChange={e => setPreferences(prev => ({ ...prev, bufferMinutes: parseInt(e.target.value, 10) }))}
                className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-xs font-semibold text-[#102B5C] focus:outline-none focus:border-[#FF7417]"
              >
                <option value={0}>0 minutes (Back-to-back)</option>
                <option value={5}>5 minutes break</option>
                <option value={10}>10 minutes break (Recommended)</option>
                <option value={15}>15 minutes break</option>
                <option value={30}>30 minutes break</option>
              </select>
              <p className="text-[10px] text-[#64748B]">
                Automatic breathing room added between consecutive bookings.
              </p>
            </div>

            {/* Setting 4: Maximum Bookings per Day */}
            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5">
              <label className="block text-xs font-bold text-[#102B5C]">
                Maximum Bookings per Day
              </label>
              <select
                value={preferences.maxBookingsPerDay}
                onChange={e => setPreferences(prev => ({ ...prev, maxBookingsPerDay: parseInt(e.target.value, 10) }))}
                className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-xs font-semibold text-[#102B5C] focus:outline-none focus:border-[#FF7417]"
              >
                <option value={3}>Max 3 calls / day</option>
                <option value={5}>Max 5 calls / day</option>
                <option value={8}>Max 8 calls / day (Recommended)</option>
                <option value={10}>Max 10 calls / day</option>
                <option value={999}>Unlimited</option>
              </select>
              <p className="text-[10px] text-[#64748B]">
                Prevents creator fatigue by capping the daily booking volume.
              </p>
            </div>

            {/* Setting 5: Call Duration Compatibility */}
            <div className="md:col-span-2 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5">
              <label className="block text-xs font-bold text-[#102B5C]">
                Call Duration Compatibility
              </label>
              <div className="flex flex-wrap gap-2.5">
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
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center gap-2 ${
                        isChecked
                          ? 'bg-[#F2F7FF] text-[#102B5C] border-[#FF7417] shadow-xs'
                          : 'bg-white text-slate-400 border-[#E2E8F0] hover:bg-slate-100'
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded flex items-center justify-center ${
                        isChecked ? 'bg-[#FF7417] text-white' : 'border border-slate-300'
                      }`}>
                        {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                      <span>{duration} Minutes Session</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-[#64748B]">
                Only durations enabled above will be generated as bookable slots for fans.
              </p>
            </div>

          </div>
        )}

      </div>

      {/* ================= SECTION 4: FOOTER SAVE ACTIONS ================= */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E2E8F0] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-[#64748B]">
          {isDirty ? (
            <span className="text-amber-600 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FF7417] animate-ping" />
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
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#F8FAFC] hover:bg-slate-100 text-[#64748B] hover:text-[#102B5C] border border-[#E2E8F0] disabled:opacity-40 font-bold text-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-7 py-2.5 rounded-xl bg-[#FF7417] hover:bg-[#e0620f] disabled:bg-slate-300 text-white font-bold text-xs shadow-md shadow-[#FF7417]/25 transition-all cursor-pointer"
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

      {/* ================= MODAL 1: BLOCK DATE CONFIRMATION ================= */}
      {showBlockConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#E2E8F0] shadow-2xl space-y-4">
            
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-[#102B5C]">
                  Confirmed Bookings on this Date
                </h4>
                <p className="text-xs text-[#64748B]">
                  Date: {dateToBlock}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 space-y-1">
              <p className="font-bold">
                This date has {dateToBlock ? getBookingsForDate(dateToBlock).length : 0} confirmed fan booking(s).
              </p>
              <p className="text-[11px] text-amber-800">
                Marking this date unavailable will block any new fan bookings, but your existing confirmed appointments will remain in your schedule.
              </p>
            </div>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setShowBlockConfirmModal(false);
                  setDateToBlock(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#F8FAFC] hover:bg-slate-100 text-[#64748B] hover:text-[#102B5C] border border-[#E2E8F0] text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmBlockDate}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm shadow-rose-600/25 cursor-pointer"
              >
                Yes, Block Date
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= MODAL 2: CUSTOM HOURS OVERRIDE (MULTI-INTERVALS) ================= */}
      {showCustomHoursModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-[#E2E8F0] shadow-2xl space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#F2F7FF] text-[#102B5C] flex items-center justify-center">
                  <Sliders className="w-4 h-4 text-[#FF7417]" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-[#102B5C]">Set Custom Hours</h4>
                  <p className="text-xs text-[#64748B]">Date: {targetDateForCustom}</p>
                </div>
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
              Specify special working intervals for this date. Supports multiple working shifts:
            </p>

            <div className="space-y-3">
              {customIntervals.map((inv, idx) => (
                <div key={inv.id} className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#102B5C]">
                      Shift {idx + 1}
                    </span>
                    {customIntervals.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setCustomIntervals(prev => prev.filter(i => i.id !== inv.id))}
                        className="p-1 rounded text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Remove interval"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-[#64748B] mb-1">Start Time</label>
                      <select
                        value={inv.start}
                        onChange={e => setCustomIntervals(prev => prev.map(item => item.id === inv.id ? { ...item, start: e.target.value } : item))}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2E8F0] text-xs font-semibold text-[#102B5C] focus:outline-none focus:border-[#FF7417]"
                      >
                        {TIME_OPTIONS.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#64748B] mb-1">End Time</label>
                      <select
                        value={inv.end}
                        onChange={e => setCustomIntervals(prev => prev.map(item => item.id === inv.id ? { ...item, end: e.target.value } : item))}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#E2E8F0] text-xs font-semibold text-[#102B5C] focus:outline-none focus:border-[#FF7417]"
                      >
                        {TIME_OPTIONS.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}

              {customIntervals.length < 3 && (
                <button
                  type="button"
                  onClick={() => {
                    const last = customIntervals[customIntervals.length - 1];
                    let nextStart = '02:00 PM';
                    let nextEnd = '06:00 PM';
                    if (last) {
                      const lastEndMin = timeToMinutes(last.end);
                      const newStartMin = Math.min(lastEndMin + 60, 20 * 60);
                      const newEndMin = Math.min(newStartMin + 180, 22 * 60);
                      nextStart = minutesToTime(newStartMin);
                      nextEnd = minutesToTime(newEndMin);
                    }
                    setCustomIntervals(prev => [
                      ...prev,
                      { id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`, start: nextStart, end: nextEnd }
                    ]);
                  }}
                  className="w-full py-2.5 rounded-xl border border-dashed border-[#FF7417]/60 text-xs font-bold text-[#FF7417] hover:bg-[#F2F7FF] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Add Another Interval</span>
                </button>
              )}
            </div>

            {customModalError && (
              <p className="text-xs font-semibold text-rose-500 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{customModalError}</span>
              </p>
            )}

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowCustomHoursModal(false)}
                className="px-4 py-2 rounded-xl bg-[#F8FAFC] hover:bg-slate-100 text-[#64748B] hover:text-[#102B5C] border border-[#E2E8F0] text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCustomHours}
                className="px-5 py-2 rounded-xl bg-[#FF7417] hover:bg-[#e0620f] text-white text-xs font-bold shadow-sm shadow-[#FF7417]/25 cursor-pointer"
              >
                Apply Custom Schedule
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= MODAL 3: CONFIGURE RECURRING WEEKDAY ROUTINE ================= */}
      {showRoutineConfigModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-[#E2E8F0] shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F2F7FF] text-[#102B5C] border border-[#DBEAFE] flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[#102B5C]" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-[#102B5C]">
                    Configure Recurring Weekly Routine
                  </h4>
                  <p className="text-xs text-[#64748B]">
                    Set routine working intervals that repeat automatically every week.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowRoutineConfigModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 7 Weekday Selector Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {routineTempSchedule.map((d, idx) => {
                const isActive = routineActiveDayIdx === idx;
                return (
                  <button
                    key={d.day}
                    type="button"
                    onClick={() => setRoutineActiveDayIdx(idx)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 border ${
                      isActive
                        ? 'bg-[#102B5C] text-white border-[#102B5C] shadow-sm'
                        : d.enabled
                        ? 'bg-[#F2F7FF] text-[#102B5C] border-[#DBEAFE] hover:bg-blue-100'
                        : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${d.enabled ? 'bg-emerald-400' : 'bg-slate-300'}`} />
                    <span>{d.short}</span>
                  </button>
                );
              })}
            </div>

            {/* Selected Weekday Configuration Form */}
            {(() => {
              const activeDay = routineTempSchedule[routineActiveDayIdx];
              if (!activeDay) return null;

              return (
                <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-4">
                  
                  {/* Top Bar: Weekday Name & Toggle */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-[#102B5C]">
                        {activeDay.day} Routine
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        activeDay.enabled 
                          ? 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]' 
                          : 'bg-slate-100 text-slate-400'
                      }`}>
                        {activeDay.enabled ? 'Taking Bookings' : 'Day Off'}
                      </span>
                    </div>

                    {/* Day Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => {
                        setRoutineTempSchedule(prev => {
                          const updated = [...prev];
                          const target = updated[routineActiveDayIdx];
                          const nextEnabled = !target.enabled;
                          updated[routineActiveDayIdx] = {
                            ...target,
                            enabled: nextEnabled,
                            intervals: target.intervals.length === 0 ? [
                              { id: `int-${target.short}-1`, start: '09:00 AM', end: '01:00 PM' }
                            ] : target.intervals
                          };
                          return updated;
                        });
                      }}
                      className={`w-11 h-6 flex items-center rounded-full p-0.5 cursor-pointer transition-colors ${
                        activeDay.enabled ? 'bg-[#FF7417]' : 'bg-slate-300'
                      }`}
                    >
                      <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${
                        activeDay.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  {/* Intervals or Day Off Notice */}
                  {!activeDay.enabled ? (
                    <div className="py-6 text-center text-xs text-slate-400 italic flex flex-col items-center justify-center gap-1.5">
                      <Ban className="w-5 h-5 text-slate-300" />
                      <span>Not taking bookings on {activeDay.day}s. Click toggle above to enable.</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {activeDay.intervals.map((inv, invIdx) => (
                        <div key={inv.id} className="p-3 rounded-xl bg-white border border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
                          <span className="text-xs font-bold text-[#102B5C] w-14">
                            Shift {invIdx + 1}
                          </span>

                          <div className="flex items-center gap-2 flex-1">
                            <select
                              value={inv.start}
                              onChange={e => {
                                const val = e.target.value;
                                setRoutineTempSchedule(prev => {
                                  const updated = [...prev];
                                  const target = updated[routineActiveDayIdx];
                                  target.intervals = target.intervals.map(i => i.id === inv.id ? { ...i, start: val } : i);
                                  return updated;
                                });
                              }}
                              className="px-3 py-1.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-semibold text-[#102B5C]"
                            >
                              {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>

                            <span className="text-xs text-[#64748B] font-bold">to</span>

                            <select
                              value={inv.end}
                              onChange={e => {
                                const val = e.target.value;
                                setRoutineTempSchedule(prev => {
                                  const updated = [...prev];
                                  const target = updated[routineActiveDayIdx];
                                  target.intervals = target.intervals.map(i => i.id === inv.id ? { ...i, end: val } : i);
                                  return updated;
                                });
                              }}
                              className="px-3 py-1.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-semibold text-[#102B5C]"
                            >
                              {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                          </div>

                          {activeDay.intervals.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                setRoutineTempSchedule(prev => {
                                  const updated = [...prev];
                                  const target = updated[routineActiveDayIdx];
                                  target.intervals = target.intervals.filter(i => i.id !== inv.id);
                                  return updated;
                                });
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete shift"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}

                      {activeDay.intervals.length < 3 && (
                        <button
                          type="button"
                          onClick={() => {
                            setRoutineTempSchedule(prev => {
                              const updated = [...prev];
                              const target = updated[routineActiveDayIdx];
                              const last = target.intervals[target.intervals.length - 1];
                              let nextStart = '02:00 PM';
                              let nextEnd = '06:00 PM';
                              if (last) {
                                const lastEndMin = timeToMinutes(last.end);
                                const newStartMin = Math.min(lastEndMin + 60, 20 * 60);
                                const newEndMin = Math.min(newStartMin + 180, 22 * 60);
                                nextStart = minutesToTime(newStartMin);
                                nextEnd = minutesToTime(newEndMin);
                              }
                              target.intervals.push({
                                id: `int-${target.short}-${Date.now().toString(36)}`,
                                start: nextStart,
                                end: nextEnd
                              });
                              return updated;
                            });
                          }}
                          className="w-full py-2 rounded-xl border border-dashed border-[#FF7417]/60 text-xs font-bold text-[#FF7417] hover:bg-[#F2F7FF] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Add Shift Interval</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Routine Quick Duplication Shortcuts */}
                  <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] text-[#64748B] font-medium">Quick Duplicate:</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const src = routineTempSchedule[routineActiveDayIdx];
                          setRoutineTempSchedule(prev => prev.map((item, idx) => {
                            if (idx >= 0 && idx <= 4) {
                              return {
                                ...item,
                                enabled: src.enabled,
                                intervals: src.intervals.map(i => ({ ...i, id: `int-${item.short}-${Math.random().toString(36).substring(2, 6)}` }))
                              };
                            }
                            return item;
                          }));
                          showToast(`Applied ${src.day}'s routine to Mon–Fri.`);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white border border-[#E2E8F0] hover:bg-[#F2F7FF] text-[10px] font-bold text-[#102B5C] cursor-pointer"
                      >
                        Copy to Weekdays (Mon-Fri)
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const src = routineTempSchedule[routineActiveDayIdx];
                          setRoutineTempSchedule(prev => prev.map(item => ({
                            ...item,
                            enabled: src.enabled,
                            intervals: src.intervals.map(i => ({ ...i, id: `int-${item.short}-${Math.random().toString(36).substring(2, 6)}` }))
                          })));
                          showToast(`Applied ${src.day}'s routine to all 7 days.`);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white border border-[#E2E8F0] hover:bg-[#F2F7FF] text-[10px] font-bold text-[#102B5C] cursor-pointer"
                      >
                        Apply to All 7 Days
                      </button>
                    </div>
                  </div>

                </div>
              );
            })()}

            {routineModalError && (
              <p className="text-xs font-semibold text-rose-500 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{routineModalError}</span>
              </p>
            )}

            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowRoutineConfigModal(false)}
                className="px-4 py-2 rounded-xl bg-[#F8FAFC] hover:bg-slate-100 text-[#64748B] hover:text-[#102B5C] border border-[#E2E8F0] text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveRoutineConfig}
                className="px-5 py-2 rounded-xl bg-[#FF7417] hover:bg-[#e0620f] text-white text-xs font-bold shadow-sm shadow-[#FF7417]/25 cursor-pointer"
              >
                Save & Apply Routine
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
