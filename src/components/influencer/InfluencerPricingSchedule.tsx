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
      <div className="pb-2 border-b border-purple-100">
        <h1 className="text-2xl font-black text-slate-900">Availability & Schedule Management</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your active bookable days, time slots, and blocked calendar breaks
        </p>
      </div>

      {/* Availability & Schedule Manager (Pure White on Soft Lavender) */}
      <div className="p-6 rounded-3xl bg-white border border-purple-100 space-y-6 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-purple-100">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#7047EB]" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Bookable Days & Time Slots</h3>
          </div>
          <span className="text-xs text-purple-700 font-bold">Indian Standard Time (IST)</span>
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
                    ? 'bg-[#7047EB] text-white border-[#7047EB] shadow-sm'
                    : 'bg-purple-50 text-slate-600 border-purple-100 hover:bg-purple-100 hover:text-purple-900'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Daily Time Slots */}
        <div className="space-y-3 text-xs">
          <label className="block text-slate-700 font-bold">Configured Daily Time Slots</label>
          
          <div className="flex flex-wrap gap-2">
            {timeSlots.map(slot => (
              <div
                key={slot}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-100 text-slate-900 font-semibold"
              >
                <Clock className="w-3.5 h-3.5 text-[#7047EB]" />
                <span>{slot}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSlot(slot)}
                  className="text-slate-400 hover:text-rose-600 transition-colors ml-1"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Time Slot Input */}
          <div className="flex items-center gap-2 max-w-sm pt-1">
            <input
              type="text"
              value={newSlot}
              onChange={e => setNewSlot(e.target.value)}
              placeholder="e.g. 05:30 PM"
              className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#7047EB]"
            />
            <button
              type="button"
              onClick={handleAddSlot}
              className="py-2 px-4 rounded-xl bg-[#7047EB] hover:bg-[#5F34E2] text-white font-bold shadow-sm"
            >
              Add Slot
            </button>
          </div>
        </div>

        {/* Blocked Dates / Vacation Time */}
        <div className="space-y-3 text-xs pt-4 border-t border-purple-100">
          <label className="block text-slate-700 font-bold">Blocked Vacation Dates / Personal Breaks</label>
          <div className="flex flex-wrap gap-2">
            {blockedDates.length === 0 ? (
              <span className="text-slate-400 italic">No dates blocked currently.</span>
            ) : (
              blockedDates.map(date => (
                <div
                  key={date}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-semibold"
                >
                  <Ban className="w-3.5 h-3.5 text-rose-500" />
                  <span>{date}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveBlockedDate(date)}
                    className="text-rose-400 hover:text-rose-600 ml-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="flex items-center gap-2 max-w-sm pt-1">
            <input
              type="date"
              value={newBlockDate}
              onChange={e => setNewBlockDate(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#7047EB]"
            />
            <button
              type="button"
              onClick={handleAddBlockedDate}
              className="py-2 px-4 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold border border-rose-200"
            >
              Block Date
            </button>
          </div>
        </div>

        <div className="pt-3">
          <button
            type="button"
            onClick={handleSaveAvailability}
            className="flex items-center gap-2 py-2.5 px-6 rounded-xl bg-[#7047EB] hover:bg-[#5F34E2] text-white font-bold text-xs shadow-md transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Availability Calendar</span>
          </button>
        </div>

      </div>

    </div>
  );
};

