import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  DollarSign, 
  Video, 
  PhoneCall, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Save, 
  Plus, 
  Trash2, 
  Ban,
  ShieldCheck,
  Zap
} from 'lucide-react';

const ALL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const InfluencerPricingSchedule: React.FC = () => {
  const { 
    currentInfluencer, 
    updateInfluencerRates, 
    updateInfluencerAvailability, 
    showToast 
  } = useApp();

  // Pricing states
  const [voiceEnabled, setVoiceEnabled] = useState(currentInfluencer.voiceCallEnabled);
  const [videoEnabled, setVideoEnabled] = useState(currentInfluencer.videoCallEnabled);
  const [voice10, setVoice10] = useState(currentInfluencer.rates.voice10);
  const [voice15, setVoice15] = useState(currentInfluencer.rates.voice15);
  const [voice30, setVoice30] = useState(currentInfluencer.rates.voice30);
  const [video10, setVideo10] = useState(currentInfluencer.rates.video10);
  const [video15, setVideo15] = useState(currentInfluencer.rates.video15);
  const [video30, setVideo30] = useState(currentInfluencer.rates.video30);

  // Availability states
  const [selectedDays, setSelectedDays] = useState<string[]>(currentInfluencer.availability.days);
  const [timeSlots, setTimeSlots] = useState<string[]>(currentInfluencer.availability.timeSlots);
  const [blockedDates, setBlockedDates] = useState<string[]>(currentInfluencer.availability.blockedDates);
  const [newSlot, setNewSlot] = useState('');
  const [newBlockDate, setNewBlockDate] = useState('');

  const handleSaveRates = (e: React.FormEvent) => {
    e.preventDefault();
    updateInfluencerRates(
      currentInfluencer.id,
      {
        voice10: Number(voice10),
        voice15: Number(voice15),
        voice30: Number(voice30),
        video10: Number(video10),
        video15: Number(video15),
        video30: Number(video30)
      },
      voiceEnabled,
      videoEnabled
    );
  };

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
      <div className="pb-2 border-b border-slate-800">
        <h1 className="text-2xl font-black text-white">Call Pricing & Schedule Management</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure your 1-on-1 voice and video rates in Indian Rupees (₹) and manage your calendar availability
        </p>
      </div>

      {/* 1. Pricing Section (PDF Section 5) */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Voice & Video Call Rate Matrix</h3>
          </div>
          <span className="text-xs text-emerald-400 font-semibold">Instant Marketplace Sync</span>
        </div>

        <form onSubmit={handleSaveRates} className="space-y-6 text-xs">
          
          {/* Video Calls Config */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-purple-400" />
                <span className="font-bold text-white text-sm">1-on-1 Video Calls</span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-slate-400 text-xs">Offer Video Calls:</span>
                <input
                  type="checkbox"
                  checked={videoEnabled}
                  onChange={e => setVideoEnabled(e.target.checked)}
                  className="w-4 h-4 accent-purple-500 rounded"
                />
              </label>
            </div>

            {videoEnabled && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">10-Minute Video (₹ INR)</label>
                  <input
                    type="number"
                    value={video10}
                    onChange={e => setVideo10(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">15-Minute Video (₹ INR)</label>
                  <input
                    type="number"
                    value={video15}
                    onChange={e => setVideo15(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">30-Minute Video (₹ INR)</label>
                  <input
                    type="number"
                    value={video30}
                    onChange={e => setVideo30(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-bold"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Voice Calls Config */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white text-sm">1-on-1 Voice Calls</span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-slate-400 text-xs">Offer Voice Calls:</span>
                <input
                  type="checkbox"
                  checked={voiceEnabled}
                  onChange={e => setVoiceEnabled(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 rounded"
                />
              </label>
            </div>

            {voiceEnabled && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">10-Minute Voice (₹ INR)</label>
                  <input
                    type="number"
                    value={voice10}
                    onChange={e => setVoice10(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">15-Minute Voice (₹ INR)</label>
                  <input
                    type="number"
                    value={voice15}
                    onChange={e => setVoice15(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">30-Minute Voice (₹ INR)</label>
                  <input
                    type="number"
                    value={voice30}
                    onChange={e => setVoice30(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-bold"
                  />
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 py-2.5 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs shadow-glow transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Update Call Pricing Rates</span>
          </button>
        </form>
      </div>

      {/* 2. Availability & Schedule Manager (PDF Section 6) */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-sky-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Bookable Days & Time Slots</h3>
          </div>
          <span className="text-xs text-sky-400 font-semibold">Indian Standard Time (IST)</span>
        </div>

        {/* Working Days Pill selector */}
        <div className="space-y-2 text-xs">
          <label className="block text-slate-300 font-bold">Active Bookable Days</label>
          <div className="flex flex-wrap gap-2">
            {ALL_DAYS.map(day => (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={`py-2 px-4 rounded-xl font-bold border transition-all ${
                  selectedDays.includes(day)
                    ? 'bg-purple-600 text-white border-purple-400 shadow-glow'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Daily Time Slots */}
        <div className="space-y-3 text-xs">
          <label className="block text-slate-300 font-bold">Configured Daily Time Slots</label>
          
          <div className="flex flex-wrap gap-2">
            {timeSlots.map(slot => (
              <div
                key={slot}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold"
              >
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{slot}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSlot(slot)}
                  className="text-slate-400 hover:text-rose-400 transition-colors ml-1"
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
              className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddSlot}
              className="py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold border border-slate-700"
            >
              Add Slot
            </button>
          </div>
        </div>

        {/* Blocked Dates / Vacation Time */}
        <div className="space-y-3 text-xs pt-2 border-t border-slate-800">
          <label className="block text-slate-300 font-bold">Blocked Vacation Dates / Personal Breaks</label>
          <div className="flex flex-wrap gap-2">
            {blockedDates.length === 0 ? (
              <span className="text-slate-500 italic">No dates blocked currently.</span>
            ) : (
              blockedDates.map(date => (
                <div
                  key={date}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 font-semibold"
                >
                  <Ban className="w-3.5 h-3.5 text-rose-400" />
                  <span>{date}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveBlockedDate(date)}
                    className="text-rose-400 hover:text-rose-200 ml-1"
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
              className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddBlockedDate}
              className="py-2 px-3.5 rounded-xl bg-rose-600/20 text-rose-300 hover:bg-rose-600/30 font-bold border border-rose-500/30"
            >
              Block Date
            </button>
          </div>
        </div>

        <div className="pt-3">
          <button
            type="button"
            onClick={handleSaveAvailability}
            className="flex items-center gap-2 py-2.5 px-6 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Availability Calendar</span>
          </button>
        </div>

      </div>

    </div>
  );
};

