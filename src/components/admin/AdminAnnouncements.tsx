import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  Send, 
  Radio, 
  Users, 
  Video, 
  ShieldCheck, 
  Sparkles, 
  Clock,
  CheckCircle2
} from 'lucide-react';

export const AdminAnnouncements: React.FC = () => {
  const { notifications, broadcastAnnouncement, showToast } = useApp();

  const [audience, setAudience] = useState<'all' | 'users' | 'influencers'>('all');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const handleSendAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    broadcastAnnouncement(audience, title.trim(), message.trim());
    setTitle('');
    setMessage('');
  };

  const applyTemplate = (tmplTitle: string, tmplMsg: string, tmplAudience: 'all' | 'users' | 'influencers') => {
    setTitle(tmplTitle);
    setMessage(tmplMsg);
    setAudience(tmplAudience);
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl">
      
      {/* Title */}
      <div className="pb-2 border-b border-slate-800">
        <h1 className="text-2xl font-black text-white">Broadcast Platform Announcements</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Send push updates, system maintenance notices, or festival promotions across user and creator channels
        </p>
      </div>

      {/* Quick Templates Bar (PDF Section 13: Use templates for common operational messages) */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quick Operational Templates</span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <button
            type="button"
            onClick={() => applyTemplate(
              'Scheduled Server Maintenance Notice',
              'BookMyStar will undergo routine database upgrades on Sunday between 02:00 AM - 04:00 AM IST. Call sessions will not be interrupted.',
              'all'
            )}
            className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-left space-y-1 transition-colors"
          >
            <div className="font-bold text-white">System Maintenance</div>
            <p className="text-[11px] text-slate-400 line-clamp-1">Sunday routine database upgrades notice</p>
          </button>

          <button
            type="button"
            onClick={() => applyTemplate(
              'Diwali Creator Bonus: 0% Gateway Charges!',
              'Celebrate festive cheer! Enjoy 0% payment gateway processing charges on all video calls booked this weekend.',
              'users'
            )}
            className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-left space-y-1 transition-colors"
          >
            <div className="font-bold text-brand-300">Festive Fan Promo</div>
            <p className="text-[11px] text-slate-400 line-clamp-1">0% payment gateway processing promotion</p>
          </button>

          <button
            type="button"
            onClick={() => applyTemplate(
              'New Instant UPI Payout Disbursals Active',
              'Creators can now request instant daily UPI withdrawals with zero bank transfer lag. Ensure your UPI VPA handle is up to date in settings.',
              'influencers'
            )}
            className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-left space-y-1 transition-colors"
          >
            <div className="font-bold text-emerald-400">Creator UPI Update</div>
            <p className="text-[11px] text-slate-400 line-clamp-1">Instant daily UPI withdrawals active</p>
          </button>
        </div>
      </div>

      {/* Composer Form */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-800">
          Announcement Composer
        </h3>

        <form onSubmit={handleSendAnnouncement} className="space-y-4 text-xs">
          
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Target Audience</label>
            <div className="grid grid-cols-3 gap-2 max-w-md">
              <button
                type="button"
                onClick={() => setAudience('all')}
                className={`py-2 px-3 rounded-xl font-bold border transition-all ${
                  audience === 'all' ? 'bg-amber-600 text-white border-amber-400' : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                Everyone (All)
              </button>
              <button
                type="button"
                onClick={() => setAudience('users')}
                className={`py-2 px-3 rounded-xl font-bold border transition-all ${
                  audience === 'users' ? 'bg-brand-600 text-white border-brand-400' : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                Fans / Users Only
              </button>
              <button
                type="button"
                onClick={() => setAudience('influencers')}
                className={`py-2 px-3 rounded-xl font-bold border transition-all ${
                  audience === 'influencers' ? 'bg-purple-600 text-white border-purple-400' : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                Creators Only
              </button>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Announcement Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Important Service Update"
              className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Message Content</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Write the operational notice here..."
              rows={4}
              className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none leading-relaxed"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 py-2.5 px-6 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Announcement Now</span>
            </button>
          </div>

        </form>
      </div>

      {/* Broadcast History Feed */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-800">
          Sent Platform Notifications & Announcements
        </h3>

        <div className="space-y-3">
          {notifications.map(n => (
            <div key={n.id} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">{n.title}</span>
                <span className="text-[10px] text-slate-500">{n.createdAt}</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-xs">{n.message}</p>
              <div className="pt-1 flex items-center gap-2 text-[10px] text-amber-400 font-semibold uppercase">
                <span>Audience: {n.targetAudience}</span>
                <span>•</span>
                <span>Type: {n.type}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

