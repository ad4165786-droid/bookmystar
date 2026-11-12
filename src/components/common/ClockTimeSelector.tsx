import React, { useMemo } from 'react';
import { Clock, User, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';

export interface SlotItem {
  coachId: string;      // id of the person the slot belongs to; "unassigned" if none
  coachName: string;
  date: string;         // "YYYY-MM-DD"
  slot: string;         // e.g. "09:30 AM", "14:00", or "02:00 PM - 03:00 PM"
  timezone: string;
}

export interface ClockTimeSelectorProps {
  availableSlots: SlotItem[];
  selectedSlot: SlotItem | null;
  onSelectSlot: (slot: SlotItem) => void;
  loading?: boolean;
  selectedDate?: string;   // "YYYY-MM-DD"
  onRetry?: () => void;
}

export interface ParsedSlotTime {
  hour12: number;
  minute: number;
  isPm: boolean;
  label: string;
}

/**
 * 1. parseSlotTime(slotStr) -> { hour12, minute, isPm, label }
 * - Takes only the part before "-" when given a range.
 * - Regex: /(\d{1,2}):(\d{2})\s*(AM|PM)?/i
 * - With no AM/PM, treat hour >= 12 as PM. Convert 24h to 12h (13 -> 1, 0 -> 12).
 * - Fallback for empty/unparseable input: 9:00 AM.
 */
export function parseSlotTime(slotStr: string): ParsedSlotTime {
  if (!slotStr || typeof slotStr !== 'string') {
    return { hour12: 9, minute: 0, isPm: false, label: '09:00 AM' };
  }

  // 1. Take only the part before "-" if given a range (e.g. "02:00 PM - 03:00 PM")
  const startPart = slotStr.split('-')[0].trim();
  const match = startPart.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);

  if (!match) {
    return { hour12: 9, minute: 0, isPm: false, label: '09:00 AM' };
  }

  const rawHour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10);
  const ampm = match[3] ? match[3].toUpperCase() : null;

  let hour12: number;
  let isPm: boolean;

  if (ampm) {
    isPm = ampm === 'PM';
    if (rawHour === 0) {
      hour12 = 12;
    } else if (rawHour > 12) {
      hour12 = rawHour - 12;
    } else {
      hour12 = rawHour;
    }
  } else {
    // With no AM/PM, treat hour >= 12 as PM. Convert 24h to 12h
    isPm = rawHour >= 12;
    if (rawHour === 0) {
      hour12 = 12;
    } else if (rawHour > 12) {
      hour12 = rawHour - 12;
    } else {
      hour12 = rawHour;
    }
  }

  // Normalize minute (0-59)
  const validMinute = isNaN(minute) || minute < 0 || minute > 59 ? 0 : minute;
  const minutePadded = String(validMinute).padStart(2, '0');
  const hourPadded = String(hour12).padStart(2, '0');
  const label = `${hourPadded}:${minutePadded} ${isPm ? 'PM' : 'AM'}`;

  return {
    hour12,
    minute: validMinute,
    isPm,
    label
  };
}

/**
 * 2. isSlotTimePassed(selectedDate, slotStr) -> boolean
 * - Compares against the user's local "today" (YYYY-MM-DD).
 * - Past dates -> true, future dates -> false.
 * - Today -> true if the slot's start time (converted to minutes since midnight)
 *   is <= the current time.
 */
export function isSlotTimePassed(selectedDate?: string, slotStr?: string): boolean {
  if (!selectedDate || !slotStr) return false;

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;

  // Past dates are always passed
  if (selectedDate < todayStr) return true;
  // Future dates are not passed
  if (selectedDate > todayStr) return false;

  // For today, compare minutes from midnight
  const parsed = parseSlotTime(slotStr);
  let hour24 = parsed.hour12 % 12;
  if (parsed.isPm) {
    hour24 += 12;
  }
  const slotMinutes = hour24 * 60 + parsed.minute;
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  return slotMinutes <= currentMinutes;
}

export const ClockTimeSelector: React.FC<ClockTimeSelectorProps> = ({
  availableSlots,
  selectedSlot,
  onSelectSlot,
  loading = false,
  selectedDate,
  onRetry
}) => {
  // Filter out passed slots (using slot.date falling back to selectedDate)
  const validSlots = useMemo(() => {
    return availableSlots.filter(s => {
      const dateToCheck = s.date || selectedDate;
      return !isSlotTimePassed(dateToCheck, s.slot);
    });
  }, [availableSlots, selectedDate]);

  // Build Map<hour12, SlotItem[]> of remaining bookable slots
  const slotsByHour = useMemo(() => {
    const map = new Map<number, SlotItem[]>();
    for (let h = 1; h <= 12; h++) {
      map.set(h, []);
    }

    validSlots.forEach(s => {
      const parsed = parseSlotTime(s.slot);
      const existing = map.get(parsed.hour12) || [];
      existing.push(s);
      map.set(parsed.hour12, existing);
    });

    return map;
  }, [validSlots]);

  // Parsed selected slot details
  const parsedSelected = useMemo(() => {
    if (!selectedSlot) return null;
    return parseSlotTime(selectedSlot.slot);
  }, [selectedSlot]);

  // Handle clicking an hour on the clock face -> selects first available slot in that hour
  const handleClockHourClick = (hour: number) => {
    const slotsInHour = slotsByHour.get(hour) || [];
    if (slotsInHour.length > 0) {
      onSelectSlot(slotsInHour[0]);
    }
  };

  // Check if a slot is currently selected
  const isSelected = (slot: SlotItem) => {
    if (!selectedSlot) return false;
    const sameDate = (slot.date || selectedDate) === (selectedSlot.date || selectedDate);
    return sameDate && slot.slot === selectedSlot.slot;
  };

  return (
    <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xl font-sans transition-colors">
      
      {/* Header Row */}
      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#2A8C7A]/10 text-[#2A8C7A] dark:text-[#34ad97] flex items-center justify-center">
            <Clock className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
              Select Appointment Time
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Interactive analog slot picker (IST)
            </p>
          </div>
        </div>

        {selectedSlot && (
          <span className="rounded-full px-3 py-1 bg-[#2A8C7A]/10 text-[#2A8C7A] dark:text-[#34ad97] border border-[#2A8C7A]/30 font-mono text-xs font-bold shadow-xs">
            {parsedSelected?.label || selectedSlot.slot}
          </span>
        )}
      </div>

      {/* Body States */}
      {/* 1. Loading State */}
      {loading ? (
        <div className="py-14 flex flex-col items-center justify-center gap-3 text-center animate-fadeIn">
          <div className="w-9 h-9 rounded-full border-2 border-[#2A8C7A] border-t-transparent animate-spin" />
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Checking real-time slot availability...
          </p>
        </div>
      ) : validSlots.length === 0 ? (
        /* 2. Empty State */
        <div className="py-10 px-4 flex flex-col items-center justify-center text-center gap-3 animate-fadeIn">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 stroke-[2]" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
              No available time slots for this date.
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs">
              Please choose another working day on the calendar or adjust booking rules.
            </p>
          </div>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-1 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Availability</span>
            </button>
          )}
        </div>
      ) : (
        /* 3. Two-Column Slot Picker (Clock Left + Slots Right) */
        <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start animate-fadeIn">
          
          {/* LEFT: Clock Face */}
          <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 shrink-0">
            
            {/* 144px x 144px (w-36 h-36) Clock Circle */}
            <div className="w-36 h-36 relative rounded-full border-2 border-slate-200 dark:border-slate-700 shadow-inner overflow-hidden bg-white dark:bg-slate-900">
              
              {/* 12 Hour Buttons placed using Trigonometry:
                  angleRad = ((hour * 30 - 90) * Math.PI) / 180
                  x = 72 + 50 * Math.cos(angleRad)
                  y = 72 + 50 * Math.sin(angleRad)
              */}
              {Array.from({ length: 12 }, (_, i) => i + 1).map(hour => {
                const angleRad = ((hour * 30 - 90) * Math.PI) / 180;
                const x = 72 + 50 * Math.cos(angleRad);
                const y = 72 + 50 * Math.sin(angleRad);

                const hasSlots = (slotsByHour.get(hour)?.length || 0) > 0;
                const isSelectedHour = parsedSelected?.hour12 === hour;

                return (
                  <button
                    key={hour}
                    type="button"
                    onClick={() => handleClockHourClick(hour)}
                    disabled={!hasSlots}
                    style={{ left: `${x}px`, top: `${y}px` }}
                    title={hasSlots ? `Select slot at ${hour}:00` : `No slots at ${hour}:00`}
                    className={`w-5 h-5 rounded-full absolute -translate-x-1/2 -translate-y-1/2 font-mono text-[9px] font-bold flex items-center justify-center transition-all ${
                      isSelectedHour
                        ? 'bg-[#2A8C7A] text-white shadow-md shadow-[#2A8C7A]/50 scale-125 z-10'
                        : hasSlots
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-600 hover:scale-110 cursor-pointer shadow-2xs'
                        : 'opacity-30 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    {hour}
                  </button>
                );
              })}

              {/* Center Pivot: 10px accent-colored dot */}
              <div 
                className="w-2.5 h-2.5 rounded-full bg-[#2A8C7A] absolute shadow-xs z-20 pointer-events-none"
                style={{ top: '67px', left: '67px' }}
              />

              {/* Hour & Minute Hands when a slot is selected */}
              {parsedSelected && (
                <>
                  {/* Hour Hand: 4px wide, 28px tall, accent gradient, glow */}
                  <div
                    className="absolute bg-gradient-to-t from-[#2A8C7A] to-[#34ad97] shadow-sm shadow-[#2A8C7A] z-15 rounded-full pointer-events-none transition-all duration-300"
                    style={{
                      width: '4px',
                      height: '28px',
                      top: '44px',
                      left: '70px',
                      transformOrigin: '50% 100%',
                      transform: `rotate(${(parsedSelected.hour12 % 12 + parsedSelected.minute / 60) * 30}deg)`
                    }}
                  />

                  {/* Minute Hand: 2px wide, 44px tall, dark slate (white in dark mode), 80% opacity */}
                  <div
                    className="absolute bg-slate-700 dark:bg-white opacity-80 z-14 rounded-full pointer-events-none transition-all duration-300"
                    style={{
                      width: '2px',
                      height: '44px',
                      top: '28px',
                      left: '71px',
                      transformOrigin: '50% 100%',
                      transform: `rotate(${parsedSelected.minute * 6}deg)`
                    }}
                  />
                </>
              )}
            </div>

            {/* Under Clock: AM / PM Badges */}
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold">
              <span
                className={`px-2.5 py-0.5 rounded-md transition-all ${
                  parsedSelected && !parsedSelected.isPm
                    ? 'bg-[#2A8C7A] text-white shadow-sm shadow-[#2A8C7A]/40'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                }`}
              >
                AM
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-md transition-all ${
                  parsedSelected && parsedSelected.isPm
                    ? 'bg-[#2A8C7A] text-white shadow-sm shadow-[#2A8C7A]/40'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                }`}
              >
                PM
              </span>
            </div>

          </div>

          {/* RIGHT: Slot List */}
          <div className="flex-1 w-full space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Available Slots ({validSlots.length} bookable):
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                Click to select
              </span>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {validSlots.map((slotItem, idx) => {
                const active = isSelected(slotItem);
                const isRealCoach = slotItem.coachId && slotItem.coachId !== 'unassigned' && 
                  slotItem.coachName && !slotItem.coachName.toLowerCase().includes('placeholder');

                return (
                  <button
                    key={`${slotItem.date || selectedDate}-${slotItem.slot}-${idx}`}
                    type="button"
                    onClick={() => onSelectSlot(slotItem)}
                    className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
                      active
                        ? 'bg-gradient-to-r from-[#2A8C7A] to-[#237768] text-white shadow-md shadow-[#2A8C7A]/20 border-[#2A8C7A]'
                        : 'bg-slate-50 hover:bg-[#2A8C7A]/5 dark:bg-slate-800/60 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-[#2A8C7A]/40 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {/* Top Row: Clock + Time | Timezone badge */}
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-1.5 font-semibold text-xs">
                        <Clock className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-[#2A8C7A] dark:text-[#34ad97]'}`} />
                        <span>{slotItem.slot}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className={`font-mono text-[10px] px-2 py-0.5 rounded-md ${
                          active 
                            ? 'bg-white/20 text-white' 
                            : 'bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}>
                          {slotItem.timezone || 'Asia/Kolkata'}
                        </span>
                        {active && (
                          <CheckCircle2 className="w-4 h-4 text-white stroke-[2.5]" />
                        )}
                      </div>
                    </div>

                    {/* Bottom Row: Coach / Assigned on confirmation */}
                    <div className="flex items-center text-[10px]">
                      {isRealCoach ? (
                        <span className={`inline-flex items-center gap-1 font-medium ${
                          active ? 'text-white/90' : 'text-slate-600 dark:text-slate-400'
                        }`}>
                          <User className="w-3 h-3" />
                          <span>{slotItem.coachName}</span>
                        </span>
                      ) : (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold ${
                          active 
                            ? 'bg-white/20 text-white' 
                            : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                        }`}>
                          Assigned on confirmation
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

