import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, 
  Clock, 
  Save, 
  Trash2, 
  Ban
} from 'lucide-react';

const ALL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const InfluencerPricingSchedule: React.FC = () => {
  const { 
    currentInfluencer, 
    updateInfluencerAvailability 
  } = useApp();

  // Availability states
  const [selectedDays, setSelectedDays] = useState<string[]>(currentInfluencer.availability.days);
  const [timeSlots, setTimeSlots] = useState<string[]>(currentInfluencer.availability.timeSlots);
  const [blockedDates, setBlockedDates] = useState<string[]>(currentInfluencer.availability.blockedDates);
  const [newSlot, setNewSlot] = useState('');
  const [newBlockDate, setNewBlockDate] = useState('');

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleAddSlot = () => {
    if (!newSlot.trim()) return;
    if (!timeSlots.includes(newSlot.trim())) {
      setTimeSlots([...timeSlots, newSlot.trim()]);
    }
    setNewSlot('');
  };

  const handleRemoveSlot = (slot: string) => {
    setTimeSlots(timeSlots.filter(s => s !== slot));
  };

  const handleAddBlockedDate = () => {
    if (!newBlockDate) return;
    if (!blockedDates.includes(newBlockDate)) {
      setBlockedDates([...blockedDates, newBlockDate]);
    }
    setNewBlockDate('');
  };

  const handleRemoveBlockedDate = (d: string) => {
    setBlockedDates(blockedDates.filter(x => x !== d));
  };

  const handleSaveAvailability = () => {
    updateInfluencerAvailability(currentInfluencer.id, {
      days: selectedDays,
      timeSlots,
      blockedDates
    });
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl">
      
      {/* Title */}
      <div className="pb-2 border-b border-slate-200/80">
        <h1 className="text-2xl font-black text-slate-900">Availability & Schedule Management</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your active bookable days, time slots, and blocked calendar breaks
        </p>
      </div>

      {/* Availability & Schedule Manager (Pure White on Clean Neutral Background) */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 space-y-6 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-brand-500" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Bookable Days & Time Slots</h3>
          </div>
          <span className="text-xs text-slate-500 font-bold">Indian Standard Time (IST)</span>
        </div>

        {/* Working Days Pill selector */}
        <div className="space-y-2 text-xs">
          <label className="block text-slate-700 font-bold">Active Bookable Days</label>
          <div className="flex flex-wrap gap-2">
            {ALL_DAYS.map(day => (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={`py-2 px-4 rounded-xl font-bold border transition-all ${
                  selectedDays.includes(day)
                    ? 'bg-brand-500 text-white border-brand-500 shadow-sm shadow-brand-500/25'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Time Slot Chips */}
        <div className="space-y-3 text-xs">
          <label className="block text-slate-700 font-bold">Daily Active Time Windows</label>
          <div className="flex flex-wrap gap-2">
            {timeSlots.map(slot => (
              <div
                key={slot}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 text-slate-800 border border-slate-200 text-xs font-semibold"
              >
                <Clock className="w-3.5 h-3.5 text-brand-500" />
                <span>{slot}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSlot(slot)}
                  className="text-slate-400 hover:text-rose-500 transition-colors ml-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add custom slot */}
          <div className="flex gap-2 max-w-sm pt-2">
            <input
              type="text"
              placeholder="e.g. 05:00 PM - 06:00 PM"
              value={newSlot}
              onChange={e => setNewSlot(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-brand-500 text-xs font-medium"
            />
            <button
              type="button"
              onClick={handleAddSlot}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
            >
              Add Slot
            </button>
          </div>
        </div>

        {/* Blocked Dates */}
        <div className="space-y-3 text-xs pt-2 border-t border-slate-100">
          <label className="block text-slate-700 font-bold">Blocked Holiday / Blackout Dates</label>
          <div className="flex flex-wrap gap-2">
            {blockedDates.length === 0 ? (
              <span className="text-slate-400 text-xs">No dates blocked yet. Fans can book any active day.</span>
            ) : (
              blockedDates.map(d => (
                <div
                  key={d}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold"
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>{d}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveBlockedDate(d)}
                    className="text-rose-400 hover:text-rose-700 transition-colors ml-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Add blackout date */}
          <div className="flex gap-2 max-w-sm pt-2">
            <input
              type="date"
              value={newBlockDate}
              onChange={e => setNewBlockDate(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-brand-500 text-xs"
            />
            <button
              type="button"
              onClick={handleAddBlockedDate}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
            >
              Block Date
            </button>
          </div>
        </div>

        {/* Save button */}
        <div className="pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handleSaveAvailability}
            className="flex items-center gap-2 py-2.5 px-6 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-500/25 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Schedule & Availability</span>
          </button>
        </div>

      </div>

    </div>
  );
};
