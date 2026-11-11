import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Category } from '../../types';
import { 
  User, 
  Camera, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  FileText, 
  Save,
  UploadCloud,
  Link,
  Play
} from 'lucide-react';

const CATEGORIES: Category[] = [
  'Gaming',
  'Music',
  'Tech & Coding',
  'Fashion & Beauty',
  'Fitness & Health',
  'Comedy & Entertainment',
  'Education & Career',
  'Lifestyle & Travel'
];

export const InfluencerContentProfile: React.FC = () => {
  const { 
    currentInfluencer, 
    updateInfluencerProfile, 
    addGalleryItem, 
    deleteGalleryItem, 
    setSelectedInfluencerId,
    setActiveView,
    showToast 
  } = useApp();

  // Basic profile states
  const [name, setName] = useState(currentInfluencer.name);
  const [handle, setHandle] = useState(currentInfluencer.handle);
  const [category, setCategory] = useState<Category>(currentInfluencer.category);
  const [bio, setBio] = useState(currentInfluencer.bio);
  const [avatar, setAvatar] = useState(currentInfluencer.avatar);
  const [coverImage, setCoverImage] = useState(currentInfluencer.coverImage);
  const [instagram, setInstagram] = useState(currentInfluencer.socialLinks.instagram || '');
  const [youtube, setYoutube] = useState(currentInfluencer.socialLinks.youtube || '');
  const [twitter, setTwitter] = useState(currentInfluencer.socialLinks.twitter || '');

  // Media upload modal/form
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [mediaTitle, setMediaTitle] = useState('');
  const [mediaDesc, setMediaDesc] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateInfluencerProfile(currentInfluencer.id, {
      name,
      handle,
      category,
      bio,
      avatar,
      coverImage,
      socialLinks: {
        instagram,
        youtube,
        twitter
      }
    });
  };

  const handleUploadMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaTitle.trim()) return;

    const fallbackUrl = mediaType === 'video'
      ? 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80';

    addGalleryItem(currentInfluencer.id, {
      title: mediaTitle.trim(),
      description: mediaDesc.trim() || 'Showcase media item.',
      url: mediaUrl.trim() || fallbackUrl,
      type: mediaType
    });

    setMediaTitle('');
    setMediaDesc('');
    setMediaUrl('');
    setShowUploadModal(false);
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white">Creator Profile & Media Portfolio</h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage your public bio, creator category, social links, and showcase gallery</p>
        </div>

        <button
          onClick={() => {
            setSelectedInfluencerId(currentInfluencer.id);
            setActiveView('influencer-detail');
          }}
          className="flex items-center gap-2 py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
        >
          <Eye className="w-4 h-4 text-brand-400" />
          <span>Preview Public Profile as User</span>
        </button>
      </div>

      {/* Identity Verification & Age Onboarding Card (PDF Section 2 & 4) */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-sky-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Government Identity & Age Verification</h3>
          </div>

          <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
            currentInfluencer.verificationStatus === 'approved'
              ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/30'
              : 'bg-amber-950/70 text-amber-300 border border-amber-500/30'
          }`}>
            Status: {currentInfluencer.verificationStatus}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Age Confirmation (18+ Requirement)</span>
            <div className="font-bold text-white mt-1 text-sm">{currentInfluencer.age} Years Old</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">Date of Birth: {currentInfluencer.dob} (Eligible)</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Submitted ID Document</span>
            <div className="font-bold text-white mt-1 text-sm flex items-center gap-1.5 truncate">
              <FileText className="w-4 h-4 text-brand-400 shrink-0" />
              <span className="truncate">{currentInfluencer.idDocName}</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Verified by BMS Admin Desk</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Paid Booking Privilege</span>
            <div className="font-bold text-emerald-400 mt-1 text-sm flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Paid Bookings Active</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Escrow payout routing authorized</div>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-slate-800">
          Core Creator Details
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-5 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Display / Stage Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-brand-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Creator Handle</label>
              <input
                type="text"
                value={handle}
                onChange={e => setHandle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-brand-300 focus:outline-none focus:border-brand-500 font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Primary Creator Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as Category)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-brand-500"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Avatar Image URL</label>
              <input
                type="text"
                value={avatar}
                onChange={e => setAvatar(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Cover Banner Image URL</label>
            <input
              type="text"
              value={coverImage}
              onChange={e => setCoverImage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Bio / Profile Introduction</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={4}
              className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-brand-500 leading-relaxed"
              required
            />
          </div>

          {/* Social Links */}
          <div className="pt-2">
            <label className="block text-slate-300 font-bold mb-2">Connected Social Media Channels</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">YouTube URL</label>
                <input
                  type="text"
                  value={youtube}
                  onChange={e => setYoutube(e.target.value)}
                  placeholder="https://youtube.com/@channel"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Instagram URL</label>
                <input
                  type="text"
                  value={instagram}
                  onChange={e => setInstagram(e.target.value)}
                  placeholder="https://instagram.com/handle"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Twitter / X URL</label>
                <input
                  type="text"
                  value={twitter}
                  onChange={e => setTwitter(e.target.value)}
                  placeholder="https://twitter.com/handle"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="flex items-center gap-2 py-2.5 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs shadow-glow transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Updates</span>
            </button>
          </div>

        </form>
      </div>

      {/* Content Portfolio Showcase Manager (PDF Section 4) */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Showcase Gallery & Clips</h3>
            <p className="text-xs text-slate-400">Add highlight photos and video clips to show fans what you do</p>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Media</span>
          </button>
        </div>

        {currentInfluencer.gallery.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-6">No gallery items uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentInfluencer.gallery.map(item => (
              <div key={item.id} className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-md flex flex-col justify-between">
                <div className="relative h-40">
                  <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-black/70 text-white uppercase">
                    {item.type}
                  </span>
                </div>

                <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{item.description}</p>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-800/80 text-[10px] text-slate-400">
                    <span>Uploaded: {item.uploadedAt}</span>
                    <button
                      onClick={() => deleteGalleryItem(currentInfluencer.id, item.id)}
                      className="p-1 rounded text-rose-400 hover:bg-rose-500/20 transition-colors"
                      title="Delete Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Add Showcase Item to Portfolio</h3>

            <form onSubmit={handleUploadMedia} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Media Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMediaType('image')}
                    className={`py-2 rounded-lg font-bold border transition-all ${
                      mediaType === 'image' ? 'bg-brand-600 text-white border-brand-400' : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    Image / Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaType('video')}
                    className={`py-2 rounded-lg font-bold border transition-all ${
                      mediaType === 'video' ? 'bg-purple-600 text-white border-purple-400' : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    Video Clip
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Item Title</label>
                <input
                  type="text"
                  value={mediaTitle}
                  onChange={e => setMediaTitle(e.target.value)}
                  placeholder="e.g. Stage performance at Bengaluru Arena"
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  value={mediaDesc}
                  onChange={e => setMediaDesc(e.target.value)}
                  placeholder="Short context about this showcase clip..."
                  rows={2}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Media URL (CDN / Image Link)</label>
                <input
                  type="text"
                  value={mediaUrl}
                  onChange={e => setMediaUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-glow"
                >
                  Publish to Profile
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

