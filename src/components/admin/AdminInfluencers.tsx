import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { InfluencerProfile } from '../../types';
import {
  ShieldCheck,
  Clock,
  XCircle,
  CheckCircle2,
  Search,
  ExternalLink,
  FileText,
  AlertTriangle,
  Eye,
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
  const [selectedInfluencer, setSelectedInfluencer] = useState<InfluencerProfile | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const pendingQueue = influencers.filter(i => i.verificationStatus === 'pending');
  const filteredInfluencers = activeTab === 'queue' ? pendingQueue : influencers;

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingId) return;

    if (!rejectReason.trim()) {
      showToast('Please provide an official rejection note for the creator.');
      return;
    }

    rejectVerification(rejectingId, rejectReason.trim());
    setRejectingId(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-6 pb-16">

      {/* Title & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Creator Verification & KYC Approval Queue</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('queue')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${activeTab === 'queue'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-slate-200/90 shadow-sm'
              }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Review ({pendingQueue.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${activeTab === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-slate-200/90 shadow-sm'
              }`}
          >
            All Creators ({influencers.length})
          </button>
        </div>
      </div>

      {/* Influencers Table Section Box */}
      <div className="rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md ring-1 ring-slate-900/5 overflow-hidden transition-shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-600 text-[10px] uppercase font-bold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Creator Details</th>
                <th className="py-3 px-4">Age / DOB (18+ Check)</th>
                <th className="py-3 px-4">Identity Document</th>
                <th className="py-3 px-4 text-center">Verification Badge</th>
                <th className="py-3 px-4 text-right">Lifetime Earnings</th>
                <th className="py-3 px-4 text-right">Review Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredInfluencers.map(inf => (
                <tr key={inf.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img src={inf.avatar} alt={inf.name} className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200" />
                      <div>
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                          <span>{inf.name}</span>
                          {inf.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-sky-500" />}
                        </div>
                        <div className="text-[11px] text-purple-600 font-medium">{inf.handle} • {inf.category}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 text-xs">{inf.age} Years Old</div>
                    <div className="text-[10px] text-slate-500">DOB: {inf.dob}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2 text-indigo-600 font-mono text-[11px]">
                      <FileText className="w-4 h-4 text-indigo-500" />
                      <span className="truncate max-w-[150px]">{inf.idDocName}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Encrypted Admin Storage</div>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${inf.verificationStatus === 'approved'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : inf.verificationStatus === 'pending'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                      {inf.verificationStatus}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right font-extrabold text-slate-900">
                    ₹{inf.totalEarnings.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedInfluencer(inf)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition-colors"
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
                            className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-[11px] border border-rose-200"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl rounded-2xl bg-white border border-slate-200/90 p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">

            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-3">
                <img src={selectedInfluencer.avatar} alt={selectedInfluencer.name} className="w-12 h-12 rounded-xl object-cover ring-2 ring-purple-500" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedInfluencer.name}</h3>
                  <p className="text-xs text-purple-600 font-medium">{selectedInfluencer.handle} • {selectedInfluencer.category}</p>
                </div>
              </div>

              <button onClick={() => setSelectedInfluencer(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Verification & ID Inspector */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase">
                <span>Government ID Verification Document</span>
                <span className="text-[10px] text-amber-700 font-semibold">Strict Confidentiality Guard</span>
              </div>

              <div className="p-3 rounded-lg bg-white border border-slate-200/90 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-indigo-600" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">{selectedInfluencer.idDocName}</div>
                    <div className="text-[10px] text-slate-500">Age: {selectedInfluencer.age} (DOB: {selectedInfluencer.dob})</div>
                  </div>
                </div>

                <a
                  href={selectedInfluencer.idDocUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 flex items-center gap-1 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview Doc</span>
                </a>
              </div>
            </div>

            {/* Bio & Socials */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-800">Creator Bio</h4>
              <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {selectedInfluencer.bio}
              </p>
            </div>

            {/* Approval / Rejection Actions */}
            <div className="pt-2 flex justify-end gap-3">
              {selectedInfluencer.verificationStatus === 'pending' ? (
                <>
                  <button
                    onClick={() => {
                      approveVerification(selectedInfluencer.id);
                      setSelectedInfluencer({ ...selectedInfluencer, isVerified: true, verificationStatus: 'approved' });
                    }}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm"
                  >
                    Grant Verification Badge & Enable Bookings
                  </button>
                  <button
                    onClick={() => setRejectingId(selectedInfluencer.id)}
                    className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200"
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
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200/90 p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Rejection Notice Reason</h3>

            <form onSubmit={handleConfirmReject} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">State Reason for Rejection</label>
                <textarea
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  placeholder="e.g. Identity document photo is blurred / Inconsistent birth date..."
                  rows={3}
                  className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-sm"
                >
                  Confirm Rejection
                </button>
                <button
                  type="button"
                  onClick={() => setRejectingId(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
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
