import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Radio,
  TrendingUp,
  Wallet,
  Users,
  Star,
  Video,
  Phone,
  Clock,
  Sparkles,
  BarChart3,
  Flame,
  ArrowUp,
  ChevronDown,
  Layers,
  HelpCircle,
  Eye,
  Activity,
  Check
} from 'lucide-react';

type TimeRangeFilter = '7d' | '30d' | '90d' | 'year';

interface ChartDataPoint {
  label: string;
  fullDate: string;
  revenue: number;
  bookingsCount: number;
  videoRevenue: number;
  voiceRevenue: number;
}

export const InfluencerDashboard: React.FC = () => {
  const {
    currentInfluencer,
    bookings,
    setActiveView,
    navigate,
    startCall,
    showToast
  } = useApp();

  if (!currentInfluencer) return null;

  // Timeframe filter state
  const [timeRange, setTimeRange] = useState<TimeRangeFilter>('7d');
  const [activeDataIndex, setActiveDataIndex] = useState<number | null>(null);

  // Bookings for this influencer
  const creatorBookings = useMemo(() => {
    return bookings.filter(b => b.influencerId === currentInfluencer.id);
  }, [bookings, currentInfluencer.id]);

  const upcomingBookings = useMemo(() => {
    return creatorBookings.filter(b => b.bookingStatus === 'upcoming');
  }, [creatorBookings]);

  const completedBookings = useMemo(() => {
    return creatorBookings.filter(b => b.bookingStatus === 'completed');
  }, [creatorBookings]);

  // Financial aggregates
  const totalCompletedEarnings = useMemo(() => {
    return completedBookings.reduce((sum, b) => sum + (b.influencerEarnings || 0), 0);
  }, [completedBookings]);

  const grossEarnings = useMemo(() => {
    return Math.max(
      totalCompletedEarnings,
      currentInfluencer.totalEarnings || currentInfluencer.pendingBalance || 24800
    );
  }, [totalCompletedEarnings, currentInfluencer]);

  const averageBookingValue = useMemo(() => {
    if (creatorBookings.length === 0) return 1200;
    const totalAmount = creatorBookings.reduce((sum, b) => sum + (b.amount || 0), 0);
    return Math.round(totalAmount / creatorBookings.length);
  }, [creatorBookings]);

  // Breakdown by call types
  const videoBookings = useMemo(() => creatorBookings.filter(b => b.callType === 'video'), [creatorBookings]);
  const voiceBookings = useMemo(() => creatorBookings.filter(b => b.callType === 'voice'), [creatorBookings]);

  const videoRevenue = useMemo(() => {
    return videoBookings.reduce((sum, b) => sum + (b.influencerEarnings || b.amount * 0.8), 0);
  }, [videoBookings]);

  const voiceRevenue = useMemo(() => {
    return voiceBookings.reduce((sum, b) => sum + (b.influencerEarnings || b.amount * 0.8), 0);
  }, [voiceBookings]);

  const totalSplit = videoRevenue + voiceRevenue || 1;
  const videoPercent = Math.round((videoRevenue / totalSplit) * 100) || 72;
  const voicePercent = 100 - videoPercent;

  // Illustrative Chart Dataset per selected timeRange
  const chartDataset: ChartDataPoint[] = useMemo(() => {
    if (timeRange === '7d') {
      return [
        { label: 'Mon', fullDate: 'Nov 07', revenue: 3200, bookingsCount: 3, videoRevenue: 2400, voiceRevenue: 800 },
        { label: 'Tue', fullDate: 'Nov 08', revenue: 4800, bookingsCount: 4, videoRevenue: 3800, voiceRevenue: 1000 },
        { label: 'Wed', fullDate: 'Nov 09', revenue: 2600, bookingsCount: 2, videoRevenue: 1800, voiceRevenue: 800 },
        { label: 'Thu', fullDate: 'Nov 10', revenue: 5400, bookingsCount: 5, videoRevenue: 4200, voiceRevenue: 1200 },
        { label: 'Fri', fullDate: 'Nov 11', revenue: 7200, bookingsCount: 6, videoRevenue: 5600, voiceRevenue: 1600 },
        { label: 'Sat', fullDate: 'Nov 12', revenue: 8900, bookingsCount: 7, videoRevenue: 7100, voiceRevenue: 1800 },
        { label: 'Sun', fullDate: 'Nov 13 (Today)', revenue: 6400, bookingsCount: 5, videoRevenue: 4800, voiceRevenue: 1600 },
      ];
    }
    if (timeRange === '30d') {
      return [
        { label: 'Week 1', fullDate: 'Oct 15 - Oct 21', revenue: 16400, bookingsCount: 14, videoRevenue: 12400, voiceRevenue: 4000 },
        { label: 'Week 2', fullDate: 'Oct 22 - Oct 28', revenue: 21200, bookingsCount: 18, videoRevenue: 16800, voiceRevenue: 4400 },
        { label: 'Week 3', fullDate: 'Oct 29 - Nov 04', revenue: 19800, bookingsCount: 16, videoRevenue: 14600, voiceRevenue: 5200 },
        { label: 'Week 4', fullDate: 'Nov 05 - Nov 13', revenue: 28500, bookingsCount: 23, videoRevenue: 22100, voiceRevenue: 6400 },
      ];
    }
    if (timeRange === '90d') {
      return [
        { label: 'September', fullDate: 'Sep 2026', revenue: 58200, bookingsCount: 48, videoRevenue: 44200, voiceRevenue: 14000 },
        { label: 'October', fullDate: 'Oct 2026', revenue: 76400, bookingsCount: 62, videoRevenue: 59100, voiceRevenue: 17300 },
        { label: 'November (MTD)', fullDate: 'Nov 2026', revenue: 42800, bookingsCount: 35, videoRevenue: 33400, voiceRevenue: 9400 },
      ];
    }
    return [
      { label: 'Q1', fullDate: 'Jan - Mar 2026', revenue: 142000, bookingsCount: 120, videoRevenue: 108000, voiceRevenue: 34000 },
      { label: 'Q2', fullDate: 'Apr - Jun 2026', revenue: 188500, bookingsCount: 154, videoRevenue: 145000, voiceRevenue: 43500 },
      { label: 'Q3', fullDate: 'Jul - Sep 2026', revenue: 215000, bookingsCount: 178, videoRevenue: 168000, voiceRevenue: 47000 },
      { label: 'Q4 (Current)', fullDate: 'Oct - Dec 2026', revenue: 129000, bookingsCount: 105, videoRevenue: 101000, voiceRevenue: 28000 },
    ];
  }, [timeRange]);

  const maxRevenue = useMemo(() => {
    return Math.max(...chartDataset.map(d => d.revenue), 1000);
  }, [chartDataset]);

  const totalPeriodRevenue = useMemo(() => {
    return chartDataset.reduce((sum, d) => sum + d.revenue, 0);
  }, [chartDataset]);

  const totalPeriodBookings = useMemo(() => {
    return chartDataset.reduce((sum, d) => sum + d.bookingsCount, 0);
  }, [chartDataset]);

  const activePoint = activeDataIndex !== null ? chartDataset[activeDataIndex] : chartDataset[chartDataset.length - 1];

  return (
    <div className="space-y-8 pb-6 font-sans">

      {/* ================= 1. WELCOME BANNER ================= */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 sm:p-8 overflow-hidden shadow-xl border border-slate-700/80">
        <div className="absolute right-0 top-0 -mr-10 -mt-10 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <img
              src={currentInfluencer.avatar}
              alt={currentInfluencer.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-3 ring-brand-500/70 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">{currentInfluencer.name}</h1>
                {currentInfluencer.isVerified ? (
                  <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 backdrop-blur-md border border-emerald-500/40">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Verified Creator
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-300/30">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-300" />
                    Verification {currentInfluencer.verificationStatus}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-1">
                <span className="text-brand-400 font-semibold">{currentInfluencer.handle}</span> • {currentInfluencer.category} Specialist • 1-on-1 Creator Studio
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                setActiveView('availability');
                navigate('/influencer/availability');
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-white font-bold border border-slate-700 transition-all shadow-sm cursor-pointer"
            >
              Update Schedule
            </button>
            <button
              onClick={() => {
                setActiveView('payouts');
                navigate('/influencer/earnings');
              }}
              className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-black shadow-md shadow-brand-500/30 transition-all cursor-pointer"
            >
              Request Payout
            </button>
          </div>
        </div>
      </div>

      {/* ================= 2. NEXT UPCOMING CALL HIGHLIGHT ================= */}
      {upcomingBookings.length > 0 && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 uppercase border border-emerald-200">
                  Next Scheduled Call
                </span>
                <span className="text-xs font-mono text-slate-400">Ref: {upcomingBookings[0].bookingRef}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                {upcomingBookings[0].durationMinutes}-Minute {upcomingBookings[0].callType} Session with {upcomingBookings[0].userName}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Scheduled for {upcomingBookings[0].scheduledDate} at {upcomingBookings[0].scheduledTime} • Net Payout: ₹{upcomingBookings[0].influencerEarnings}
              </p>
            </div>
          </div>

          <button
            onClick={() => startCall(upcomingBookings[0], true)}
            className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-transform hover:scale-105 shrink-0 cursor-pointer"
          >
            <Radio className="w-4 h-4" />
            <span>Launch Host Call Room</span>
          </button>
        </div>
      )}

      {/* ================= 3. ILLUSTRATIVE BOOKING OVERVIEW & REVENUE CHART ================= */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-6">
        
        {/* Section Header with Timeframe Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                <BarChart3 className="w-4 h-4 text-brand-600" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Booking Overview & Illustrative Revenue Chart
              </h2>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <TrendingUp className="w-3 h-3 text-emerald-600" />
                <span>+18.4% Growth</span>
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Interactive timeline of completed sessions, booking velocity, and earnings breakdown.
            </p>
          </div>

          {/* Timeframe Filter Buttons */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-100 border border-slate-200/60 self-start md:self-auto">
            {(['7d', '30d', '90d', 'year'] as TimeRangeFilter[]).map(range => {
              const labelMap: Record<TimeRangeFilter, string> = {
                '7d': 'Last 7 Days',
                '30d': '30 Days',
                '90d': '3 Months',
                'year': 'This Year',
              };
              const isActive = timeRange === range;
              return (
                <button
                  key={range}
                  type="button"
                  onClick={() => {
                    setTimeRange(range);
                    setActiveDataIndex(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  {labelMap[range]}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4 Summary Highlight Tiles Above the Chart */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Period Revenue
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-900">
              ₹{totalPeriodRevenue.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              <ArrowUp className="w-3 h-3" />
              <span>Direct fan take-home</span>
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Total Bookings
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-900">
              {totalPeriodBookings} <span className="text-xs font-normal text-slate-400">Sessions</span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium">
              {(totalPeriodBookings / chartDataset.length).toFixed(1)} avg calls / day
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Average Order Value
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-900">
              ₹{averageBookingValue.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-brand-600 font-semibold">
              Per 1-on-1 booking
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Top Monetization Format
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-1.5">
              <Video className="w-5 h-5 text-brand-500" />
              <span>{videoPercent}% Video</span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium">
              Voice accounts for {voicePercent}%
            </span>
          </div>

        </div>

        {/* Dynamic Chart Display Box */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-slate-50/70 to-white border border-slate-200 space-y-4">
          
          {/* Active Data Point Inspection Card (Hovered / Selected) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 border border-brand-200 flex items-center justify-center font-bold text-xs">
                {activePoint.label.slice(0, 3)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{activePoint.fullDate}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {activePoint.bookingsCount} Completed Calls
                  </span>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                  <span>Video: <strong className="text-slate-800">₹{activePoint.videoRevenue.toLocaleString('en-IN')}</strong></span>
                  <span>•</span>
                  <span>Voice: <strong className="text-slate-800">₹{activePoint.voiceRevenue.toLocaleString('en-IN')}</strong></span>
                </div>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Interval Net Earnings</span>
              <span className="text-lg sm:text-xl font-black text-brand-600">
                ₹{activePoint.revenue.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Illustrative Bar Chart Representation */}
          <div className="pt-4">
            {/* Chart Grid and Columns */}
            <div className="h-56 flex items-end justify-between gap-3 sm:gap-5 px-2 relative">
              
              {/* Background Guide Lines */}
              <div className="absolute inset-x-0 top-0 border-b border-dashed border-slate-200 pointer-events-none" />
              <div className="absolute inset-x-0 top-1/2 border-b border-dashed border-slate-200 pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 border-b border-slate-200 pointer-events-none" />

              {chartDataset.map((point, index) => {
                const heightPercentage = Math.round((point.revenue / maxRevenue) * 100);
                const isSelected = activeDataIndex === index || (activeDataIndex === null && index === chartDataset.length - 1);
                
                return (
                  <div
                    key={index}
                    onMouseEnter={() => setActiveDataIndex(index)}
                    onClick={() => setActiveDataIndex(index)}
                    className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative z-10"
                  >
                    {/* Tooltip on top of column */}
                    <div
                      className={`mb-2 text-[10px] font-extrabold px-2 py-0.5 rounded-md transition-all ${
                        isSelected
                          ? 'bg-slate-900 text-white shadow-md -translate-y-1'
                          : 'bg-slate-100 text-slate-500 opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      ₹{point.revenue > 9999 ? `${(point.revenue / 1000).toFixed(1)}k` : point.revenue}
                    </div>

                    {/* Dual-Stack Bar (Video on top, Voice below) */}
                    <div className="w-full max-w-[56px] h-40 bg-slate-100 rounded-t-xl flex flex-col justify-end overflow-hidden border border-slate-200/50">
                      <div
                        style={{ height: `${heightPercentage}%` }}
                        className={`w-full flex flex-col justify-end transition-all rounded-t-xl overflow-hidden ${
                          isSelected
                            ? 'ring-2 ring-brand-500 brightness-105'
                            : 'hover:brightness-105'
                        }`}
                      >
                        {/* Video Portion */}
                        <div
                          style={{ height: `${(point.videoRevenue / point.revenue) * 100}%` }}
                          className="w-full bg-gradient-to-t from-brand-600 via-brand-500 to-amber-400"
                        />
                        {/* Voice Portion */}
                        <div
                          style={{ height: `${(point.voiceRevenue / point.revenue) * 100}%` }}
                          className="w-full bg-gradient-to-t from-sky-600 to-sky-400"
                        />
                      </div>
                    </div>

                    {/* Bottom Label */}
                    <div className="mt-2.5 text-center">
                      <span
                        className={`text-xs font-bold block transition-colors ${
                          isSelected ? 'text-brand-600 font-extrabold' : 'text-slate-500 group-hover:text-slate-900'
                        }`}
                      >
                        {point.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend & Summary Info */}
            <div className="mt-5 pt-3 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-brand-500" />
                  <span className="font-semibold text-slate-800">Video Calls (₹{videoRevenue.toLocaleString('en-IN')})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-sky-500" />
                  <span className="font-semibold text-slate-800">Voice Calls (₹{voiceRevenue.toLocaleString('en-IN')})</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>Peak Volume: <strong>Saturdays 6:00 PM – 9:30 PM</strong></span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ================= 4. RECENT BOOKING INQUIRIES & ACTIVITY FEED ================= */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Recent Booking Inquiries</h3>
            <p className="text-xs text-slate-500">Fans who booked voice or video calls with you</p>
          </div>

          <button
            onClick={() => {
              setActiveView('bookings');
              navigate('/influencer/bookings');
            }}
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Bookings ({creatorBookings.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {creatorBookings.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No booking requests yet. Once fans book calls with you, they will appear here.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 text-xs">
            {creatorBookings.slice(0, 5).map(b => (
              <div key={b.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={b.userAvatar}
                    alt={b.userName}
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-100"
                  />
                  <div>
                    <div className="font-bold text-slate-900">{b.userName}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2">
                      <span className="capitalize">{b.callType} Call</span>
                      <span>•</span>
                      <span>{b.durationMinutes} mins</span>
                      <span>•</span>
                      <span>{b.scheduledDate} {b.scheduledTime}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-emerald-600">+₹{b.influencerEarnings}</div>
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${b.bookingStatus === 'upcoming'
                      ? 'bg-sky-50 text-sky-700'
                      : b.bookingStatus === 'completed'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                    {b.bookingStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
