import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { InfluencerProfile } from '../../types';
import { 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Eye, 
  Search, 
  Filter, 
  Calendar, 
  ExternalLink,
  Ban,
  Clock,
  X
} from 'lucide-react';

export const AdminInfluencers: React.FC = () => {
  const { 
    influencers, 
    approveVerification, 
    rejectVerification, 
    toggleInfluencerStatus, 
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'queue' | 'all'>('queue');
  const [search, setSearch] = useState('');
  const [selectedInfluencer, setSelectedInfluencer] = useState<InfluencerProfile | null>(null);
  
  // Reject reason modal
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Pending queue
  const pendingQueue = influencers.filter(i => i.verificationStatus === 'pending');

  const filteredInfluencers = influencers.filter(i => {
    if (activeTab === 'queue') return i.verificationStatus === 'pending';
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return i.name.toLowerCase().includes(q) || i.handle.toLowerCase().includes(q) || i.category.toLowerCase().includes(q);
  });

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingId || !rejectReason.trim()) return;

    rejectVerification(rejectingId, rejectReason.trim());
    setRejectingId(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Title & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white">Creator Verification & KYC Approval Queue</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Strict 18+ age verification, government identity inspection, and paid booking licensing
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('queue')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'queue'
                ? 'bg-amber-600 text-white shadow-glow'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Review ({pendingQueue.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-slate-700 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Creators ({influencers.length})
          </button>
        </div>
      </div>

      {/* Influencers Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 text-slate-400 text-[10px] uppercase font-bold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Creator Details</th>
                <th className="py-3 px-4">Age / DOB (18+ Check)</th>
                <th className="py-3 px-4">Identity Document</th>
                <th className="py-3 px-4 text-center">Verification Badge</th>
                <th className="py-3 px-4 text-right">Lifetime Earnings</th>
                <th className="py-3 px-4 text-right">Review Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredInfluencers.map(inf => (
                <tr key={inf.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img src={inf.avatar} alt={inf.name} className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-700" />
                      <div>
                        <div className="font-bold text-white text-sm flex items-center gap-1.5">
                          <span>{inf.name}</span>
                          {inf.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />}
                        </div>
                        <div className="text-[11px] text-purple-400 font-medium">{inf.handle} • {inf.category}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white text-xs">{inf.age} Years Old</div>
                    <div className="text-[10px] text-slate-400">DOB: {inf.dob}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2 text-brand-300 font-mono text-[11px]">
                      <FileText className="w-4 h-4 text-brand-400" />
                      <span className="truncate max-w-[150px]">{inf.idDocName}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Encrypted Admin Storage</div>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                      inf.verificationStatus === 'approved'
                        ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/30'
                        : inf.verificationStatus === 'pending'
                        ? 'bg-amber-950/70 text-amber-300 border border-amber-500/30'
                        : 'bg-rose-950/70 text-rose-300 border border-rose-500/30'
                    }`}>
                      {inf.verificationStatus}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right font-extrabold text-white">
                    ₹{inf.totalEarnings.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedInfluencer(inf)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-[11px]"
                      >
                        Inspect Dossier
                      </button>

                      {inf.verificationStatus === 'pending' && (
                        <>
                          <button
                            onClick={() => approveVerification(inf.id)}
                            className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-sm"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => setRejectingId(inf.id)}
                            className="px-2.5 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 font-semibold text-[11px] border border-rose-500/30"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Influencer Dossier Modal */}
      {selectedInfluencer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <img src={selectedInfluencer.avatar} alt={selectedInfluencer.name} className="w-12 h-12 rounded-xl object-cover ring-2 ring-purple-500" />
                <div>
                  <h3 className="text-base font-bold text-white">{selectedInfluencer.name}</h3>
                  <p className="text-xs text-purple-400">{selectedInfluencer.handle} • {selectedInfluencer.category}</p>
                </div>
              </div>

              <button onClick={() => setSelectedInfluencer(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Verification & ID Inspector */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase">
                <span>Government ID Verification Document</span>
                <span className="text-[10px] text-amber-400">Strict Confidentiality Guard</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-brand-400" />
                  <div>
                    <div className="text-xs font-bold text-white">{selectedInfluencer.idDocName}</div>
                    <div className="text-[10px] text-slate-400">Age: {selectedInfluencer.age} (DOB: {selectedInfluencer.dob})</div>
                  </div>
                </div>

                <a
                  href={selectedInfluencer.idDocUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview Doc</span>
                </a>
              </div>
            </div>

            {/* Bio & Socials */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-300">Creator Bio</h4>
              <p className="text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                {selectedInfluencer.bio}
              </p>
            </div>

            {/* Approval / Rejection Actions */}
            <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
              {selectedInfluencer.verificationStatus === 'pending' ? (
                <>
                  <button
                    onClick={() => {
                      approveVerification(selectedInfluencer.id);
                      setSelectedInfluencer({ ...selectedInfluencer, isVerified: true, verificationStatus: 'approved' });
                    }}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md"
                  >
                    Grant Verification Badge & Enable Bookings
                  </button>
                  <button
                    onClick={() => setRejectingId(selectedInfluencer.id)}
                    className="px-4 py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 font-bold text-xs border border-rose-500/30"
                  >
                    Reject Application
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    toggleInfluencerStatus(selectedInfluencer.id, selectedInfluencer.isVerified ? 'suspend' : 'activate');
                    setSelectedInfluencer({ ...selectedInfluencer, isVerified: !selectedInfluencer.isVerified });
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 hover:text-white font-semibold text-xs"
                >
                  {selectedInfluencer.isVerified ? 'Suspend Creator Account' : 'Re-activate Creator'}
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Rejection Notice Reason</h3>
            
            <form onSubmit={handleConfirmReject} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">State Reason for Rejection</label>
                <textarea
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  placeholder="e.g. Identity document photo is blurred / Inconsistent birth date..."
                  rows={3}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md"
                >
                  Confirm Rejection
                </button>
                <button
                  type="button"
                  onClick={() => setRejectingId(null)}
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

