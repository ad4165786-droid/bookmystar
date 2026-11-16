import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CoreCreatorDetails } from './CoreCreatorDetails';
import { 
  User, 
  Image, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  FileText, 
  Eye, 
  Play, 
  UploadCloud, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const InfluencerContentProfile: React.FC = () => {
  const { 
    currentInfluencer, 
    addGalleryItem, 
    deleteGalleryItem, 
    setSelectedInfluencerId,
    setActiveView 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'core' | 'gallery' | 'kyc'>('core');

  // Media upload modal/form
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [mediaTitle, setMediaTitle] = useState('');
  const [mediaDesc, setMediaDesc] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');

  // ESC key and body scroll lock for upload modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showUploadModal) {
        setShowUploadModal(false);
      }
    };
    if (showUploadModal) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showUploadModal]);

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
    <div className="space-y-6 pb-6 max-w-7xl mx-auto">
      
      {/* Studio Profile Top Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white border border-slate-200/90 self-start sm:self-auto shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab('core')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'core'
                ? 'bg-[#EFF6FF] text-[#172554] border border-[#BFDBFE]/70 shadow-xs'
                : 'text-[#64748B] hover:text-[#172554]'
            }`}
          >
            <User className="w-4 h-4 text-brand-500" />
            <span>Edit Creator Profile</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'gallery'
                ? 'bg-[#EFF6FF] text-[#172554] border border-[#BFDBFE]/70 shadow-xs'
                : 'text-[#64748B] hover:text-[#172554]'
            }`}
          >
            <Image className="w-4 h-4 text-[#1D4ED8]" />
            <span>Showcase Portfolio</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-[#64748B] font-bold">
              {currentInfluencer.gallery?.length || 0}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('kyc')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'kyc'
                ? 'bg-[#EFF6FF] text-[#172554] border border-[#BFDBFE]/70 shadow-xs'
                : 'text-[#64748B] hover:text-[#172554]'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>KYC & Verification</span>
            {currentInfluencer.isVerified && (
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            )}
          </button>
        </div>

        {/* Fan Marketplace Preview Action */}
        <button
          type="button"
          onClick={() => {
            setSelectedInfluencerId(currentInfluencer.id);
            setActiveView('influencer-detail');
          }}
          className="inline-flex items-center gap-1.5 py-2 px-4 rounded-xl bg-white hover:bg-[#F8FAFC] text-[#172554] text-xs font-bold border border-slate-200/90 transition-colors shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5 text-brand-500" />
          <span>Preview Public Profile as Fan</span>
        </button>
      </div>

      {/* TAB 1: Core Creator Details (Primary Featured Section) */}
      {activeTab === 'core' && (
        <div className="animate-fadeIn">
          <CoreCreatorDetails />
        </div>
      )}

      {/* TAB 2: Showcase Portfolio & Media Clips */}
      {activeTab === 'gallery' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-[#172554]">
                  Media Showcase & Video Clips
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Display your best highlights, stage events, esports trophies, or sample videos to potential fans.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-1.5 py-2.5 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-md shadow-brand-500/25 transition-all self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Showcase Item</span>
              </button>
            </div>

            {(!currentInfluencer.gallery || currentInfluencer.gallery.length === 0) ? (
              <div className="text-center py-12 bg-[#F8FAFC] rounded-2xl border border-dashed border-slate-200 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white text-[#64748B] mx-auto flex items-center justify-center border border-slate-200 shadow-xs">
                  <Image className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#172554]">No media uploaded yet</h4>
                  <p className="text-[11px] text-[#64748B] max-w-sm mx-auto mt-0.5">
                    Upload photos and clips of your previous talks, games, concerts, or consultations.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(true)}
                  className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
                >
                  Upload First Media
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {currentInfluencer.gallery.map(item => (
                  <div 
                    key={item.id} 
                    className="rounded-2xl overflow-hidden bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-md transition-all"
                  >
                    <div className="relative h-48 bg-slate-100">
                      <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                      <span className="absolute top-2.5 left-2.5 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-sm text-white uppercase tracking-wider">
                        {item.type}
                      </span>
                    </div>

                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-[#172554] truncate">{item.title}</h4>
                        <p className="text-[11px] text-[#64748B] line-clamp-2 mt-1 leading-relaxed">{item.description}</p>
                      </div>

                      <div className="pt-3 flex items-center justify-between border-t border-slate-100 text-[10px] text-[#64748B]">
                        <span>Uploaded: {item.uploadedAt}</span>
                        <button
                          type="button"
                          onClick={() => deleteGalleryItem(currentInfluencer.id, item.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      )}

      {/* TAB 3: KYC & Identity Verification */}
      {activeTab === 'kyc' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] text-[#1D4ED8] flex items-center justify-center border border-[#DBEAFE]">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#172554] uppercase tracking-wider">
                    Government Identity & Legal KYC Onboarding
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Mandatory Indian compliance verification for hosting paid 1-on-1 audio/video sessions.
                  </p>
                </div>
              </div>

              <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                currentInfluencer.verificationStatus === 'approved'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                Status: {currentInfluencer.verificationStatus}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
              <div className="p-5 rounded-2xl bg-[#EFF6FF]/40 border border-[#DBEAFE] space-y-2">
                <span className="text-[#64748B] block text-[10px] uppercase font-bold tracking-wider">
                  Age Confirmation (18+ Mandatory)
                </span>
                <div className="font-extrabold text-[#172554] text-base">{currentInfluencer.age} Years Old</div>
                <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>DOB: {currentInfluencer.dob} (Age Requirement Met)</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#EFF6FF]/40 border border-[#DBEAFE] space-y-2">
                <span className="text-[#64748B] block text-[10px] uppercase font-bold tracking-wider">
                  Verified Government Document
                </span>
                <div className="font-bold text-[#172554] text-sm flex items-center gap-1.5 truncate">
                  <FileText className="w-4 h-4 text-brand-500 shrink-0" />
                  <span className="truncate">{currentInfluencer.idDocName || 'PAN_Card_Submitted.pdf'}</span>
                </div>
                <div className="text-[11px] text-[#64748B]">
                  Audited & approved by BookMyStar Trust Desk
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#EFF6FF]/40 border border-[#DBEAFE] space-y-2">
                <span className="text-[#64748B] block text-[10px] uppercase font-bold tracking-wider">
                  Commercial Booking Privilege
                </span>
                <div className="font-bold text-emerald-600 text-sm flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Paid Calls Authorized</span>
                </div>
                <div className="text-[11px] text-[#64748B]">
                  Escrow fund settlement enabled (UPI / Bank NEFT)
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Media Upload Modal */}
      {showUploadModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowUploadModal(false);
          }}
        >
          <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200/90 p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-extrabold text-[#172554]">Add Showcase Item to Portfolio</h3>

            <form onSubmit={handleUploadMedia} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#172554] font-bold mb-1">Media Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMediaType('image')}
                    className={`py-2 rounded-xl font-bold border transition-all cursor-pointer ${
                      mediaType === 'image' 
                        ? 'bg-brand-500 text-white border-brand-500 shadow-sm' 
                        : 'bg-[#F8FAFC] text-[#64748B] border-slate-200 hover:text-[#172554]'
                    }`}
                  >
                    Image / Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaType('video')}
                    className={`py-2 rounded-xl font-bold border transition-all cursor-pointer ${
                      mediaType === 'video' 
                        ? 'bg-brand-500 text-white border-brand-500 shadow-sm' 
                        : 'bg-[#F8FAFC] text-[#64748B] border-slate-200 hover:text-[#172554]'
                    }`}
                  >
                    Video Clip
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[#172554] font-bold mb-1">Item Title *</label>
                <input
                  type="text"
                  value={mediaTitle}
                  onChange={e => setMediaTitle(e.target.value)}
                  placeholder="e.g. Stage performance at Bengaluru Arena"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-[#172554] placeholder-[#94A3B8] focus:outline-none focus:border-brand-500 focus:bg-white text-xs font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-[#172554] font-bold mb-1">Description</label>
                <textarea
                  value={mediaDesc}
                  onChange={e => setMediaDesc(e.target.value)}
                  placeholder="Short context about this showcase clip..."
                  rows={2}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-[#172554] placeholder-[#94A3B8] focus:outline-none focus:border-brand-500 focus:bg-white text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-[#172554] font-bold mb-1">Media URL (CDN / Image Link)</label>
                <input
                  type="text"
                  value={mediaUrl}
                  onChange={e => setMediaUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-[#172554] placeholder-[#94A3B8] focus:outline-none focus:border-brand-500 focus:bg-white text-xs font-medium"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-500/25 cursor-pointer"
                >
                  Publish to Profile
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#64748B] hover:text-[#172554] text-xs font-semibold cursor-pointer"
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
