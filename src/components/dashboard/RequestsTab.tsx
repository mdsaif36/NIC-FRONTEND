import React from 'react';
import {
  FileText, X, Star
} from 'lucide-react';
import { API_BASE_URL } from '../../config';

interface RequestsTabProps {
  expandedRequest: any | null;
  requestsList: any[];
  resumeName: string;
  setActiveChatId: (id: number | null) => void;
  setActiveTab: (tab: 'dashboard' | 'discover' | 'requests' | 'messages' | 'saved' | 'profile') => void;
  setExpandedRequest: (request: any | null) => void;
  setSelectedCompanyFilter: (filter: string) => void;
  setTrackerFilter: (filter: 'All' | 'Pending' | 'Accepted' | 'Declined' | 'Hired') => void;
  trackerFilter: 'All' | 'Pending' | 'Accepted' | 'Declined' | 'Hired';
  fetchRequests?: () => Promise<void>;
}

export const RequestsTab: React.FC<RequestsTabProps> = ({
  expandedRequest,
  requestsList,
  resumeName,
  setActiveChatId,
  setActiveTab,
  setExpandedRequest,
  setSelectedCompanyFilter,
  setTrackerFilter,
  trackerFilter,
  fetchRequests
}) => {
  const [ratingVal, setRatingVal] = React.useState<number>(0);
  const [hoverRating, setHoverRating] = React.useState<number>(0);
  const [feedbackText, setFeedbackText] = React.useState<string>('');
  const [isSubmittingRating, setIsSubmittingRating] = React.useState<boolean>(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setRatingVal(0);
    setHoverRating(0);
    setFeedbackText('');
    setSubmitError(null);
  }, [expandedRequest]);

  const handleRatingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (ratingVal === 0) {
      setSubmitError('Please select a star rating.');
      return;
    }
    setIsSubmittingRating(true);
    setSubmitError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/requests/${expandedRequest.id}/rate`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rating: ratingVal,
          feedback: feedbackText
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit rating');
      }

      if (fetchRequests) {
        await fetchRequests();
      }
      
      // Update expandedRequest locally
      expandedRequest.rating = ratingVal;
      expandedRequest.ratingFeedback = feedbackText;
      setExpandedRequest({ ...expandedRequest });
    } catch (err: any) {
      console.error("Error submitting rating:", err);
      setSubmitError(err.message || 'Error submitting rating.');
    } finally {
      setIsSubmittingRating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up text-left relative">
              
              {/* Tracker filter headers */}
              <div className="flex items-center gap-2 border-b border-white/5 pb-4 overflow-x-auto no-scrollbar">
                {(['All', 'Pending', 'Accepted', 'Declined', 'Hired'] as const).map((tab) => {
                  const isActive = trackerFilter === tab;
                  const count = tab === 'All' 
                    ? requestsList.length 
                    : requestsList.filter((r: any) => r.status === tab.toLowerCase()).length;
                  return (
                    <button
                      key={tab}
                      onClick={() => setTrackerFilter(tab)}
                      className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition shrink-0 ${
                        isActive 
                          ? 'bg-purple-650 text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]' 
                          : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                      }`}
                    >
                      {tab} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Rows List */}
              <div className="space-y-4">
                {requestsList
                  .filter((req: any) => trackerFilter === 'All' || req.status === trackerFilter.toLowerCase())
                  .map((req) => (
                    <div 
                      key={req.id}
                      onClick={() => setExpandedRequest(req)}
                      className="p-5 rounded-2xl border border-white/5 bg-[#08080b]/90 hover:border-purple-500/20 hover:bg-[#0c0c10] transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-9 h-9 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center font-bold text-slate-350 text-[10px] uppercase shrink-0">
                          {req.alumniName.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-white text-xs">{req.alumniName}</span>
                            <span className="text-[10px] text-slate-400 font-medium">{req.role} at {req.company} {req.location && `· ${req.location}`}</span>
                          </div>
                          <span className="block text-[9px] text-slate-500 mt-1 font-semibold">{req.date}</span>
                        </div>
                      </div>

                      {/* Status Pills */}
                      <div className="flex items-center gap-3 self-end sm:self-auto" onClick={(e) => e.stopPropagation()}>
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold border uppercase tracking-wider ${
                          req.status === 'accepted' 
                            ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
                            : req.status === 'pending'
                            ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                            : req.status === 'declined'
                            ? 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                            : 'text-purple-400 bg-purple-500/10 border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                        }`}>
                          {req.status === 'hired' ? 'Hired 🎉' : req.status}
                        </span>

                        {(req.status === 'accepted' || req.status === 'referred' || req.status === 'hired' || req.status === 'info') && (
                          <button
                            onClick={() => {
                              setActiveTab('messages');
                              setActiveChatId(req.alumniId);
                            }}
                            className="px-4 py-1.5 rounded-full bg-purple-650 hover:bg-purple-600 border border-purple-500/30 text-white font-semibold text-[10px] uppercase tracking-wider transition"
                          >
                            Open Chat
                          </button>
                        )}
                        {req.status === 'pending' && (
                          <button
                            className="px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-350 hover:text-white font-semibold text-[10px] uppercase tracking-wider transition"
                            onClick={() => alert('Follow-up reminder sent to mentor.')}
                          >
                            Send Reminder
                          </button>
                        )}
                        {req.status === 'declined' && (
                          <button
                            onClick={() => {
                              setSelectedCompanyFilter(req.company);
                              setActiveTab('discover');
                            }}
                            className="px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 font-semibold text-[10px] uppercase tracking-wider transition"
                          >
                            Find Similar
                          </button>
                        )}
                        {req.status === 'hired' && (
                          <button
                            onClick={() => {
                              setActiveTab('messages');
                              setActiveChatId(req.alumniId);
                            }}
                            className="px-4 py-1.5 rounded-full bg-purple-650 hover:bg-purple-600 border border-purple-500/30 text-white font-semibold text-[10px] uppercase tracking-wider transition animate-pulse"
                          >
                            Write Thank You
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Expand row details drawer overlay */}
              {expandedRequest && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end animate-fade-in">
                  <div className="w-full max-w-md bg-[#07070a] border-l border-white/5 h-full p-4 overflow-y-auto no-scrollbar shadow-2xl relative text-left flex flex-col justify-between font-inter">
                    
                    <div>
                      {/* Close Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
                        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest font-space-grotesk">Referral Application Details</span>
                        <button 
                          onClick={() => setExpandedRequest(null)} 
                          className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white border border-white/5 transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Request Info Card */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-550 to-indigo-650 flex items-center justify-center font-bold text-white text-xs uppercase shadow-lg">
                          {expandedRequest.alumniName.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="font-sora text-white text-xs font-bold flex items-center gap-1.5">
                            {expandedRequest.alumniName}
                          </h3>
                          <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">{expandedRequest.role} at {expandedRequest.company} {expandedRequest.location && `· ${expandedRequest.location}`}</p>
                          <span className="block text-[8px] text-slate-550 mt-0.5">{expandedRequest.date}</span>
                        </div>
                      </div>

                      {/* Pitch Message Sent */}
                      <div className="space-y-3 mb-4">
                        <div>
                          <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider mb-1 font-space-grotesk">Pitch Message Sent</span>
                          <div className="max-h-[100px] overflow-y-auto no-scrollbar pr-1 bg-slate-950/40 p-3 rounded-xl border border-white/5">
                            <p className="text-[11px] text-slate-350 leading-relaxed font-medium italic">
                              "{expandedRequest.message}"
                            </p>
                          </div>
                        </div>

                        {/* Resume document attached */}
                        <div>
                          <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider mb-1 font-space-grotesk">Attached Asset</span>
                          <div className="p-2.5 rounded-xl border border-white/5 bg-slate-950/40 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-rose-500 shrink-0" />
                            <div className="min-w-0">
                              <span className="block font-bold text-white text-[11px] truncate">{resumeName}</span>
                              <span className="block text-[8px] text-slate-555 mt-0.5">PDF encrypted · Verified</span>
                            </div>
                          </div>
                        </div>

                        {/* Declination insights if declined */}
                        {expandedRequest.status === 'declined' && (
                          <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/10 text-[11px] leading-relaxed text-rose-350">
                            <span className="block text-[8px] font-bold text-rose-400 uppercase tracking-wider mb-0.5 font-space-grotesk">Feedback from {expandedRequest.alumniName}</span>
                            "Your technical qualifications are good, but Google typically expects 2+ complex developer projects on the resume. Please build more React/Go projects and request again!"
                          </div>
                        )}

                        {expandedRequest.status === 'info' && (
                          <div className="p-3.5 rounded-xl bg-purple-500/5 border border-purple-500/10 text-[11.5px] leading-relaxed text-purple-300">
                            <span className="block text-[8px] font-bold text-purple-400 uppercase tracking-wider mb-1.5 font-space-grotesk">Action Required: More Details Requested</span>
                            <p className="text-slate-350 mb-2.5">
                              Your mentor needs additional details or updates (e.g., latest projects, resume changes) before making a referral decision.
                            </p>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveTab('messages');
                                  setActiveChatId(expandedRequest.alumniId);
                                  setExpandedRequest(null);
                                }}
                                className="px-3.5 py-1.5 rounded-lg bg-purple-650 hover:bg-purple-600 text-white text-[9.5px] font-bold uppercase transition"
                              >
                                Answer in Chat
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveTab('profile');
                                  setExpandedRequest(null);
                                }}
                                className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-[9.5px] font-bold uppercase transition"
                              >
                                Update Resume / Profile
                              </button>
                            </div>
                          </div>
                        )}
                        
                        {/* Hired congrats details */}
                        {expandedRequest.status === 'hired' && (
                          <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/10 text-[11px] leading-relaxed text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.05)]">
                            <span className="block text-[8px] font-bold text-purple-400 uppercase tracking-wider mb-0.5 font-space-grotesk">Congratulations 🎉</span>
                            You have been hired at {expandedRequest.company}! Your network journey is complete. The next step is to transition to an alumni mentor to support future candidates.
                          </div>
                        )}

                        {/* Student Ratings & Experience Feedback */}
                        {(expandedRequest.status === 'accepted' || expandedRequest.status === 'referred' || expandedRequest.status === 'hired' || expandedRequest.status === 'declined') && (
                          <div className="p-4 rounded-xl border border-white/5 bg-slate-950/20 space-y-3 mt-4">
                            <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider font-space-grotesk">
                              Rate Your Experience
                            </span>
                            
                            {expandedRequest.rating ? (
                              <div className="space-y-1">
                                <div className="flex items-center gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star 
                                      key={star} 
                                      className={`w-3.5 h-3.5 ${star <= expandedRequest.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`} 
                                    />
                                  ))}
                                  <span className="text-[10px] text-white font-bold ml-1">{expandedRequest.rating} / 5</span>
                                </div>
                                {expandedRequest.ratingFeedback && (
                                  <p className="text-[10px] text-slate-400 italic">"{expandedRequest.ratingFeedback}"</p>
                                )}
                              </div>
                            ) : (
                              <form onSubmit={handleRatingSubmit} className="space-y-3">
                                <div className="flex items-center gap-1.5">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      key={star}
                                      type="button"
                                      onClick={() => setRatingVal(star)}
                                      onMouseEnter={() => setHoverRating(star)}
                                      onMouseLeave={() => setHoverRating(0)}
                                      className="transition transform active:scale-125 focus:outline-none"
                                    >
                                      <Star 
                                        className={`w-5 h-5 ${
                                          star <= (hoverRating || ratingVal) 
                                            ? 'text-amber-450 fill-amber-400' 
                                            : 'text-slate-700'
                                        }`} 
                                      />
                                    </button>
                                  ))}
                                  <span className="text-[10px] text-slate-500 font-bold ml-1">
                                    {ratingVal > 0 ? `${ratingVal} Stars` : 'Select rating'}
                                  </span>
                                </div>

                                <textarea
                                  rows={2}
                                  value={feedbackText}
                                  onChange={(e) => setFeedbackText(e.target.value)}
                                  placeholder="Write a brief review of your experience..."
                                  className="w-full p-2.5 bg-black border border-white/10 rounded-xl text-[10px] text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/40 resize-none leading-relaxed"
                                />

                                {submitError && (
                                  <p className="text-[9px] text-rose-450 font-bold">{submitError}</p>
                                )}

                                <button
                                  type="submit"
                                  disabled={isSubmittingRating || ratingVal === 0}
                                  className="w-full py-1.5 rounded-lg bg-purple-650 hover:bg-purple-600 text-white font-bold text-[9px] uppercase tracking-wider transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {isSubmittingRating ? 'Submitting review...' : 'Submit Rating'}
                                </button>
                              </form>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions Drawer Footer */}
                    <div className="pt-3 border-t border-white/5 flex gap-3 mt-auto">
                      <button
                        type="button"
                        onClick={() => setExpandedRequest(null)}
                        className="flex-1 py-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-200 font-sora font-semibold text-[10px] uppercase tracking-wider hover:bg-white/10 transition text-center"
                      >
                        Close Details
                      </button>
                      
                      {(expandedRequest.status === 'accepted' || expandedRequest.status === 'referred' || expandedRequest.status === 'hired') && (
                        <button
                          type="button"
                          onClick={() => {
                            setExpandedRequest(null);
                            setActiveTab('messages');
                            setActiveChatId(expandedRequest.alumniId);
                          }}
                          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-650 hover:opacity-95 text-white font-sora font-bold text-[10px] uppercase tracking-wider transition text-center"
                        >
                          Open Chat
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              )}

            </div>
  );
};
