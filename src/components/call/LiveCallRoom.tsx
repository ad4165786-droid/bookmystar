import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  PhoneOff, 
  Share2, 
  MessageSquare, 
  AlertTriangle, 
  ShieldCheck, 
  Maximize2, 
  Sparkles, 
  Star, 
  Send,
  Radio,
  CheckCircle2,
  X
} from 'lucide-react';

export const LiveCallRoom: React.FC = () => {
  const { activeCall, endCall, addReview, submitGrievance, showToast } = useApp();

  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Remaining duration countdown
  const durationSec = (activeCall?.booking.durationMinutes || 10) * 60;
  const [secondsLeft, setSecondsLeft] = useState(durationSec);

  // In-call chat messages
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: 'System', text: 'Call session established with 256-bit E2E encryption.', time: '00:00' }
  ]);
  const [newMsg, setNewMsg] = useState('');

  // Review states
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // Report issue state
  const [issueCategory, setIssueCategory] = useState<'call' | 'behaviour'>('call');
  const [issueDesc, setIssueDesc] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowReviewModal(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!activeCall) return null;

  const { booking, isInfluencerPerspective } = activeCall;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim()) return;

    setChatMessages(prev => [
      ...prev,
      {
        sender: isInfluencerPerspective ? booking.influencerName : booking.userName,
        text: newMsg.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setNewMsg('');
  };

  const handleEndCallClicked = () => {
    if (!isInfluencerPerspective) {
      setShowReviewModal(true);
    } else {
      showToast('Call ended by host.');
      endCall();
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    addReview({
      bookingRef: booking.bookingRef,
      influencerId: booking.influencerId,
      rating,
      comment: reviewComment || 'Great 1-on-1 session!',
      callType: booking.callType
    });
    setShowReviewModal(false);
    endCall();
  };

  const handleSubmitIssueReport = (e: React.FormEvent) => {
    e.preventDefault();
    submitGrievance({
      raisedBy: isInfluencerPerspective ? 'influencer' : 'user',
      submitterId: isInfluencerPerspective ? booking.influencerId : booking.userId,
      submitterName: isInfluencerPerspective ? booking.influencerName : booking.userName,
      submitterRole: isInfluencerPerspective ? 'influencer' : 'user',
      category: issueCategory,
      priority: 'high',
      subject: `Call issue reported during ${booking.bookingRef}`,
      description: issueDesc || 'Technical malfunction experienced during call session.',
      bookingRef: booking.bookingRef
    });
    setShowReportModal(false);
    showToast('Incident logged. Our 24/7 technical team has been notified.');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#080b12] flex flex-col text-white select-none">
      
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-6 py-3.5 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md">
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>LIVE SESSION</span>
          </div>

          <div className="hidden sm:block text-xs text-slate-300">
            <span className="font-semibold text-white">{booking.influencerName}</span>
            <span className="mx-1.5 text-slate-500">•</span>
            <span>{booking.callType === 'video' ? '1-on-1 Video' : '1-on-1 Voice'} ({booking.durationMinutes}m)</span>
            <span className="mx-1.5 text-slate-500">•</span>
            <span className="font-mono text-slate-400">Ref: {booking.bookingRef}</span>
          </div>
        </div>

        {/* Center Countdown Timer */}
        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-xl border font-mono font-bold text-sm tracking-widest ${
          secondsLeft < 120 
            ? 'bg-rose-950/60 border-rose-500/50 text-rose-400 animate-pulse' 
            : 'bg-slate-800/80 border-slate-700 text-emerald-400'
        }`}>
          <span>TIME REMAINING: {formatTime(secondsLeft)}</span>
        </div>

        {/* Security / Quality Indicator */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>E2E Encrypted</span>
          </div>

          <button
            onClick={() => setShowReportModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Report Issue</span>
          </button>
        </div>

      </div>

      {/* Main Video Stream Arena */}
      <div className="flex-1 relative flex overflow-hidden">
        
        {/* Call Canvas View */}
        <div className="flex-1 relative flex items-center justify-center p-4">
          
          {/* Main Feed: The other participant */}
          <div className="relative w-full h-full max-h-[82vh] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl flex items-center justify-center group">
            
            {booking.callType === 'video' ? (
              <div className="relative w-full h-full">
                {/* Simulated Remote Video Stream */}
                <img
                  src={isInfluencerPerspective ? booking.userAvatar : booking.influencerAvatar}
                  alt="Remote participant"
                  className="w-full h-full object-cover filter brightness-95"
                />
                
                {/* Gradient Overlay for high-end aesthetic */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/40 pointer-events-none" />

                {/* Animated Audio Waveform overlay */}
                <div className="absolute bottom-6 left-6 flex items-center gap-3 bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10">
                  <div className="flex items-center gap-1">
                    <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1 h-6 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1 h-4 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="w-1 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '75ms' }} />
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-white">
                      {isInfluencerPerspective ? booking.userName : booking.influencerName}
                    </span>
                    <span className="text-[10px] text-emerald-400 ml-2 font-mono">1080p 60fps</span>
                  </div>
                </div>
              </div>
            ) : (
              /* Voice Call Mode Audio Screen */
              <div className="flex flex-col items-center justify-center text-center p-6 space-y-5">
                <div className="relative">
                  <img
                    src={isInfluencerPerspective ? booking.userAvatar : booking.influencerAvatar}
                    alt="Audio participant"
                    className="w-32 h-32 rounded-full object-cover ring-4 ring-brand-500/40 shadow-glow"
                  />
                  <div className="absolute inset-0 rounded-full ring-8 ring-brand-500/20 live-pulse" />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">
                    {isInfluencerPerspective ? booking.userName : booking.influencerName}
                  </h3>
                  <p className="text-xs text-brand-300 mt-1">High-Definition Voice Stream Active</p>
                </div>

                {/* Audio visualizer spectrum bars */}
                <div className="flex items-center gap-1.5 h-12">
                  {[40, 75, 95, 60, 85, 100, 70, 90, 45, 80, 65, 85, 95, 50].map((h, i) => (
                    <div
                      key={i}
                      className="w-1.5 bg-gradient-to-t from-brand-500 to-amber-300 rounded-full transition-all duration-150 animate-pulse"
                      style={{ height: `${h}%`, animationDelay: `${i * 100}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Self Picture-in-Picture (PiP) Feed */}
            <div className="absolute top-6 right-6 w-36 sm:w-48 aspect-video rounded-xl overflow-hidden bg-slate-950 border-2 border-slate-700 shadow-2xl z-20">
              {isCameraOff ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-slate-400 text-xs">
                  <VideoOff className="w-5 h-5 mb-1" />
                  <span>Camera Off</span>
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <img
                    src={isInfluencerPerspective ? booking.influencerAvatar : booking.userAvatar}
                    alt="Self"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1 left-2 text-[10px] bg-black/60 px-1.5 py-0.5 rounded text-white font-medium">
                    You {isMicMuted && '(Muted)'}
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* In-Call Chat Sidebar */}
        {showChat && (
          <div className="w-80 border-l border-slate-800 bg-slate-900/95 flex flex-col h-full animate-slideIn">
            <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-brand-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">In-Call Messages</h4>
              </div>
              <button onClick={() => setShowChat(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className="p-2 rounded-lg bg-slate-800/70 border border-slate-700/50">
                  <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                    <span className="font-semibold text-brand-300">{msg.sender}</span>
                    <span>{msg.time}</span>
                  </div>
                  <p className="text-slate-200 leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChat} className="p-3 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                value={newMsg}
                onChange={e => setNewMsg(e.target.value)}
                placeholder="Type a note or message..."
                className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
              <button
                type="submit"
                className="p-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

      </div>

      {/* Floating Call Action Controls Bar */}
      <div className="py-4 px-6 bg-slate-950/95 border-t border-slate-800/80 flex items-center justify-center gap-4 z-30">
        
        {/* Toggle Mic */}
        <button
          onClick={() => setIsMicMuted(!isMicMuted)}
          className={`p-3.5 rounded-full transition-all ${
            isMicMuted 
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30' 
              : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
          }`}
          title={isMicMuted ? 'Unmute Mic' : 'Mute Mic'}
        >
          {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Toggle Camera (if video call) */}
        {booking.callType === 'video' && (
          <button
            onClick={() => setIsCameraOff(!isCameraOff)}
            className={`p-3.5 rounded-full transition-all ${
              isCameraOff 
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30' 
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
            }`}
            title={isCameraOff ? 'Turn Camera On' : 'Turn Camera Off'}
          >
            {isCameraOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </button>
        )}

        {/* Screen Share simulation */}
        <button
          onClick={() => {
            setIsScreenSharing(!isScreenSharing);
            showToast(isScreenSharing ? 'Screen sharing stopped.' : 'Screen sharing active.');
          }}
          className={`p-3.5 rounded-full transition-all ${
            isScreenSharing 
              ? 'bg-brand-600 text-white border border-brand-400' 
              : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
          }`}
          title="Share Screen"
        >
          <Share2 className="w-5 h-5" />
        </button>

        {/* In-Call Chat Button */}
        <button
          onClick={() => setShowChat(!showChat)}
          className={`p-3.5 rounded-full transition-all ${
            showChat 
              ? 'bg-brand-600 text-white' 
              : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
          }`}
          title="Chat & Notes"
        >
          <MessageSquare className="w-5 h-5" />
        </button>

        {/* End Call Button */}
        <button
          onClick={handleEndCallClicked}
          className="flex items-center gap-2 py-3 px-6 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          <PhoneOff className="w-5 h-5" />
          <span>End Call</span>
        </button>

      </div>

      {/* Post-Call Review Modal (For User) */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-5 shadow-2xl">
            <div className="text-center space-y-2">
              <img src={booking.influencerAvatar} alt={booking.influencerName} className="w-16 h-16 rounded-full mx-auto object-cover ring-2 ring-brand-500 shadow-glow" />
              <h3 className="text-lg font-bold text-white">How was your session with {booking.influencerName}?</h3>
              <p className="text-xs text-slate-400">Your feedback helps creators and keeps BookMyStar quality high.</p>
            </div>

            {/* Star Rating Selector */}
            <div className="flex items-center justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRating(s)}
                  className="p-1 text-slate-500 hover:text-amber-400 transition-colors"
                >
                  <Star className={`w-8 h-8 ${s <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <textarea
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                placeholder="Share your experience (e.g. insightful gameplay tips, inspiring career guidance)..."
                rows={3}
                className="w-full p-3 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-white font-bold text-xs shadow-glow"
                >
                  Submit Review & Exit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowReviewModal(false);
                    endCall();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Skip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Issue / Grievance Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-rose-400">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="text-sm font-bold text-white">Report Call Interruption / Issue</h3>
              </div>
              <button onClick={() => setShowReportModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitIssueReport} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Issue Category</label>
                <select
                  value={issueCategory}
                  onChange={e => setIssueCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none"
                >
                  <option value="call">Technical Call Failure (Audio / Video Dropped)</option>
                  <option value="behaviour">Inappropriate Participant Conduct / Boundary Violation</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  value={issueDesc}
                  onChange={e => setIssueDesc(e.target.value)}
                  placeholder="Detail what occurred so the operations team can verify server diagnostics..."
                  rows={3}
                  className="w-full p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md"
                >
                  Submit Incident Report
                </button>
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
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

