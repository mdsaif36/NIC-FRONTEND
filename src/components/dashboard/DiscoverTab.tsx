import React from 'react';
import {
  AlertCircle, Bookmark, FileText, Search, ShieldCheck, Sparkles, X, MessageSquare
} from 'lucide-react';
import ReferralModal from '../ReferralModal';


const getNextResetDate = () => {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const day = nextMonth.getDate();
  const month = nextMonth.toLocaleString('en-US', { month: 'long' });
  const year = nextMonth.getFullYear();
  return `${day} ${month} ${year}`;
};

interface DiscoverTabProps {
  aiMatchToggle: boolean;
  aiTipWarning: string;
  alumniForRequest: any | null;
  alumniNetwork: any[];
  availabilityFilter: string;
  getFilteredAlumni: () => any[];
  isRequestModalOpen: boolean;
  openRequestModal: (alumni: any) => void;
  pitchMessage: string;
  resumeName: string;
  savedAlumniIds: number[];
  searchQuery: string;
  selectedAlumni: any | null;
  selectedCompanyFilter: string;
  selectedRoleFilter: string;
  setAiMatchToggle: (toggle: boolean) => void;
  setAvailabilityFilter: (filter: string) => void;
  setIsRequestModalOpen: (open: boolean) => void;
  setPitchMessage: (message: string) => void;
  setSavedAlumniIds: React.Dispatch<React.SetStateAction<number[]>>;
  setSearchQuery: (query: string) => void;
  setSelectedAlumni: (alumni: any | null) => void;
  setSelectedCompanyFilter: (filter: string) => void;
  setSelectedRoleFilter: (filter: string) => void;
  setShowSuggestions: (show: boolean) => void;
  setTargetRole: (role: string) => void;
  setTimeline: (timeline: string) => void;
  showSuggestions: boolean;
  submitReferralRequest: (e: React.FormEvent) => void;
  targetRole: string;
  timeline: string;
  setActiveTab?: (tab: any) => void;
  setActiveChatId?: (id: number | null) => void;
  referralCreditsRemaining: number;
  monthlyReferralLimit: number;
  requestsList?: any[];
}

export const DiscoverTab: React.FC<DiscoverTabProps> = ({
  aiMatchToggle,
  aiTipWarning,
  alumniForRequest,
  alumniNetwork,
  availabilityFilter,
  getFilteredAlumni,
  isRequestModalOpen,
  openRequestModal,
  pitchMessage,
  resumeName,
  savedAlumniIds,
  searchQuery,
  selectedAlumni,
  selectedCompanyFilter,
  selectedRoleFilter,
  setAiMatchToggle,
  setAvailabilityFilter,
  setIsRequestModalOpen,
  setPitchMessage,
  setSavedAlumniIds,
  setSearchQuery,
  setSelectedAlumni,
  setSelectedCompanyFilter,
  setSelectedRoleFilter,
  setShowSuggestions,
  setTargetRole,
  setTimeline,
  showSuggestions,
  submitReferralRequest,
  targetRole,
  timeline,
  setActiveTab,
  setActiveChatId,
  referralCreditsRemaining,
  monthlyReferralLimit
}) => {
  const [showConfirmStep, setShowConfirmStep] = React.useState(false);

  React.useEffect(() => {
    if (!isRequestModalOpen) {
      setShowConfirmStep(false);
    }
  }, [isRequestModalOpen]);

  return (
    <>
    <div className="space-y-6 animate-fade-in-up text-left relative">
                
                {/* Search Control Row with Autosuggest */}
                <div className="relative w-full rounded-full p-[1.5px] bg-gradient-to-r from-purple-500/10 to-blue-500/10 focus-within:from-purple-500/50 focus-within:to-blue-500/50 transition-all duration-300">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-450 z-10" />
                  <input
                    type="text"
                    value={searchQuery}
                    onFocus={() => setShowSuggestions(true)}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    placeholder="Search by name, company, role, or skill..."
                    className="w-full pl-11 pr-4 py-3 bg-black hover:bg-[#07070a] rounded-full text-white placeholder-slate-550 focus:outline-none transition text-xs font-inter relative z-0"
                  />
                  
                  {/* Search Autosuggest Dropdown */}
                  {showSuggestions && searchQuery.trim().length > 0 && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setShowSuggestions(false)} />
                      <div className="absolute left-0 right-0 top-[52px] bg-[#09090c] border border-white/10 rounded-2xl shadow-2xl z-40 overflow-hidden text-left max-h-60 overflow-y-auto no-scrollbar font-inter">
                        {alumniNetwork
                          .filter(a => 
                            a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            a.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            a.role.toLowerCase().includes(searchQuery.toLowerCase())
                          )
                          .map(a => (
                            <div 
                              key={a.id}
                              onClick={() => {
                                setSearchQuery(a.name);
                                setSelectedAlumni(a);
                                setShowSuggestions(false);
                              }}
                              className="p-3 hover:bg-purple-950/15 border-b border-white/5 cursor-pointer flex items-center justify-between transition-colors"
                            >
                              <div>
                                <span className="block text-xs font-bold text-white">{a.name}</span>
                                <span className="block text-[10px] text-slate-400 mt-0.5">{a.role} at {a.company}</span>
                              </div>
                              <span className="text-[9px] font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">{a.company}</span>
                            </div>
                          ))}
                        {alumniNetwork.filter(a => 
                          a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          a.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.role.toLowerCase().includes(searchQuery.toLowerCase())
                        ).length === 0 && (
                          <div className="p-4 text-xs text-slate-500 text-center font-medium">
                            No matching alumni found
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Filters Area */}
                <div className="space-y-3.5 py-2 border-b border-white/5">
                  {/* Company filter row */}
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-2 font-space-grotesk">Company:</span>
                    {['All', 'Google', 'Microsoft', 'Amazon', 'Meta', 'Flipkart', 'Zomato'].map((comp) => (
                      <button
                        key={comp}
                        onClick={() => setSelectedCompanyFilter(comp)}
                        className={`px-3 py-1 rounded-full text-[10px] font-semibold tracking-wide transition shrink-0 ${
                          selectedCompanyFilter === comp 
                            ? 'bg-purple-650 text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]' 
                            : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                        }`}
                      >
                        {comp}
                      </button>
                    ))}
                  </div>

                  {/* Role filter row */}
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-2 font-space-grotesk">Role Area:</span>
                    {['All', 'SWE', 'PM', 'Design', 'Data', 'Finance'].map((roleArea) => (
                      <button
                        key={roleArea}
                        onClick={() => setSelectedRoleFilter(roleArea)}
                        className={`px-3 py-1 rounded-full text-[10px] font-semibold tracking-wide transition shrink-0 ${
                          selectedRoleFilter === roleArea 
                            ? 'bg-purple-650 text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]' 
                            : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                        }`}
                      >
                        {roleArea}
                      </button>
                    ))}
                  </div>

                  {/* Availability filter + AI / College Toggles */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-2 font-space-grotesk">Availability:</span>
                      {['All', 'Available Now', 'Open to chat'].map((statusOption) => (
                        <button
                          key={statusOption}
                          onClick={() => setAvailabilityFilter(statusOption)}
                          className={`px-3 py-1 rounded-full text-[10px] font-semibold tracking-wide transition ${
                            availabilityFilter === statusOption 
                              ? 'bg-purple-650 text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]' 
                              : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                          }`}
                        >
                          {statusOption}
                        </button>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 select-none self-end sm:self-auto">
                      {/* AI Match Toggle */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1 font-space-grotesk">
                          <Sparkles className="w-3.5 h-3.5" />
                          AI Match sorting
                        </span>
                        <button
                          onClick={() => setAiMatchToggle(!aiMatchToggle)}
                          className={`w-9 h-5 rounded-full flex items-center transition-colors p-0.5 ${
                            aiMatchToggle ? 'bg-purple-650' : 'bg-slate-800'
                          }`}
                        >
                          <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                            aiMatchToggle ? 'translate-x-4' : 'translate-x-0'
                          }`} />
                        </button>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Grid of Alumni */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {getFilteredAlumni().map((alumni) => {
                    const isSaved = savedAlumniIds.includes(alumni.id);
                    return (
                      <div 
                        key={alumni.id}
                        className="p-4 lg:p-5 rounded-2xl border border-white/5 bg-[#08080b]/90 hover:border-purple-500/35 transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(168,85,247,0.06)] flex flex-col justify-between text-left"
                      >
                        <div>
                          {/* Top Header Card */}
                          <div className="flex items-start justify-between gap-3 mb-4">
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${alumni.color} flex items-center justify-center font-bold text-white text-xs uppercase shadow-md`}>
                              {alumni.initial}
                            </div>
                            
                            <div className="flex items-center gap-1.5">
                              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                {alumni.match}% match
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSavedAlumniIds(prev => 
                                    isSaved ? prev.filter(id => id !== alumni.id) : [...prev, alumni.id]
                                  );
                                }}
                                className={`p-1.5 rounded-lg border transition ${
                                  isSaved ? 'bg-purple-500/10 border-purple-500/35 text-purple-400' : 'bg-white/5 border-white/5 text-slate-500 hover:text-white'
                                }`}
                              >
                                <Bookmark className="w-3.5 h-3.5" fill={isSaved ? "currentColor" : "none"} />
                              </button>
                            </div>
                          </div>

                          {/* Name & Title */}
                          <div className="flex items-center gap-1 flex-wrap">
                            <h4 
                              onClick={() => setSelectedAlumni(alumni)}
                              className="font-sora text-sm font-bold text-white hover:text-purple-400 cursor-pointer transition flex items-center gap-1"
                            >
                              {alumni.name}
                            </h4>
                            {alumni.isAdminVerified && <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />}
                          </div>
                          
                          <p className="text-[10px] text-slate-400 mt-1.5 font-semibold">
                            {alumni.jobTitle || alumni.role || 'Alumni'} at <span className="text-white font-bold">{alumni.company}</span>
                          </p>
                          
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            {alumni.college} network
                          </p>

                          {/* Verification Badges */}
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {(alumni.verificationLevel && alumni.verificationLevel !== 'Unverified') ? (
                              <span className="px-2 py-0.5 rounded-full text-[8px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                                🟢 Verified Alumni
                              </span>
                            ) : null}

                            {alumni.experience && (
                              <span className="px-2 py-0.5 rounded-full text-[8px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                Exp: {alumni.experience}
                              </span>
                            )}

                            {(alumni.verificationLevel && alumni.verificationLevel !== 'Unverified') ? (
                              <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold border ${
                                alumni.verificationLevel === 'Platinum' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                                alumni.verificationLevel === 'Gold' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                alumni.verificationLevel === 'Silver' ? 'bg-slate-350/10 text-slate-300 border-slate-350/20' :
                                'bg-orange-500/10 text-orange-400 border-orange-500/20'
                              }`}>
                                ✓ {alumni.verificationLevel} Verified
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[8px] font-semibold bg-white/5 text-slate-500 border border-white/5">
                                Unverified
                              </span>
                            )}
                            
                            {alumni.isEmailVerified && (
                              <span className="px-2 py-0.5 rounded-full text-[8px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/10">
                                Email Verified
                              </span>
                            )}
                            
                            {alumni.isLinkedinVerified && (
                              <span className="px-2 py-0.5 rounded-full text-[8px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/10">
                                LinkedIn Verified
                              </span>
                            )}
                          </div>

                          {/* Referral Trust Score */}
                          <div className="mt-3 space-y-1 bg-white/[0.01] p-2 rounded-lg border border-white/[0.02]">
                            <div className="flex justify-between items-center text-[9px]">
                              <span className="text-slate-500 font-bold uppercase tracking-wider">Trust Score</span>
                              <span className="text-white font-black font-space-grotesk">{alumni.trustScore || 0}/100</span>
                            </div>
                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300"
                                style={{ width: `${alumni.trustScore || 0}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-[8px] text-slate-500 font-medium">
                              <span>Given: {alumni.referralsSentCount || 0} refs</span>
                              <span>Rate: {alumni.responseRate || '90%'}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 mt-3">
                            <span className={`w-1.5 h-1.5 rounded-full ${alumni.available ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">
                              {alumni.available ? 'Available Now' : 'Busy'}
                            </span>
                          </div>
                        </div>

                        {/* Lower actions buttons */}
                        <div className="grid grid-cols-2 gap-2 mt-5">
                          <button
                            type="button"
                            onClick={() => setSelectedAlumni(alumni)}
                            className="w-full py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-[9px] font-bold text-slate-200 uppercase tracking-wider transition"
                          >
                            View Bio
                          </button>
                          <button
                            type="button"
                            onClick={() => openRequestModal(alumni)}
                            className="w-full py-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-650 hover:opacity-95 text-white font-sora font-bold text-[9px] uppercase tracking-wider transition shadow-md"
                          >
                            Request
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {getFilteredAlumni().length === 0 && (
                    <div className="col-span-full py-16 text-center border border-dashed border-white/5 rounded-2xl bg-[#09090c]">
                      <Search className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                      <span className="block text-xs font-bold text-slate-400">No alumni match your filters</span>
                      <p className="text-[10px] text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
                        Try widening your search queries or resetting company filters.
                      </p>
                    </div>
                  )}
                </div>

                {/* Right Profile Drawer Detail */}
                {selectedAlumni && (
                  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end animate-fade-in">
                    <div className="w-full max-w-md bg-[#07070a] border-l border-white/5 h-full p-4 overflow-y-auto no-scrollbar shadow-2xl relative text-left flex flex-col justify-between">
                      
                      <div>
                        {/* Close button */}
                        <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
                          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest font-space-grotesk">Alumni Profile Details</span>
                          <button 
                            onClick={() => setSelectedAlumni(null)} 
                            className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white border border-white/5 transition"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
 
                        {/* Info Card Layout */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${selectedAlumni.color} flex items-center justify-center font-bold text-white text-sm uppercase shadow-lg shrink-0`}>
                            {selectedAlumni.initial}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h3 className="font-sora text-white text-sm font-extrabold flex items-center gap-1">
                                {selectedAlumni.name}
                              </h3>
                              {selectedAlumni.verificationLevel !== 'Unverified' && (
                                <span className="px-2 py-0.5 rounded-full text-[7.5px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                                  🟢 Verified
                                </span>
                              )}
                              {selectedAlumni.isAdminVerified && <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />}
                            </div>
                            <p className="text-[10px] text-slate-350 mt-0.5 font-semibold">
                              {selectedAlumni.jobTitle || selectedAlumni.role || 'Alumni'} at <strong className="text-white">{selectedAlumni.company}</strong>
                            </p>
                            <p className="text-[9px] text-slate-500 mt-0.5">
                              {selectedAlumni.college} network {selectedAlumni.experience ? `· ${selectedAlumni.experience} Exp` : ''}
                            </p>
                          </div>
                        </div>

                        {/* Verification badge & Trust Score in Drawer */}
                        <div className="mb-4 p-3 rounded-xl border border-white/5 bg-slate-950/40 space-y-3 font-inter">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="text-slate-500 font-bold uppercase tracking-wider">Verification Level</span>
                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold border ${
                              selectedAlumni.verificationLevel === 'Platinum' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                              selectedAlumni.verificationLevel === 'Gold' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                              selectedAlumni.verificationLevel === 'Silver' ? 'bg-slate-350/10 text-slate-300 border-slate-350/20' :
                              selectedAlumni.verificationLevel === 'Bronze' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                              'bg-white/5 text-slate-400 border-white/10'
                            }`}>
                              ✓ {selectedAlumni.verificationLevel || 'Unverified'}
                            </span>
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center text-[9px]">
                              <span className="text-slate-500 font-bold uppercase tracking-wider">Trust Score</span>
                              <span className="text-white font-black font-space-grotesk">{selectedAlumni.trustScore || 0}/100</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300"
                                style={{ width: `${selectedAlumni.trustScore || 0}%` }}
                              />
                            </div>
                          </div>
                        </div>
 
                        {/* Telemetry Stats */}
                        <div className="grid grid-cols-2 gap-3 mb-4 p-3 rounded-xl border border-white/5 bg-slate-950/40 font-inter">
                          <div>
                            <span className="block text-[8px] font-bold text-slate-550 uppercase tracking-wider">Response Rate</span>
                            <span className="block text-xs font-bold text-white mt-0.5">{selectedAlumni.responseRate || '92%'}</span>
                          </div>
                          <div>
                            <span className="block text-[8px] font-bold text-slate-550 uppercase tracking-wider">Avg Reply Time</span>
                            <span className="block text-xs font-bold text-white mt-0.5">{selectedAlumni.responseSpeed || 'Within 8 hours'}</span>
                          </div>
                          <div>
                            <span className="block text-[8px] font-bold text-slate-550 uppercase tracking-wider">Successful Referrals</span>
                            <span className="block text-xs font-bold text-white mt-0.5">{selectedAlumni.referralsSentCount || 0} Sent</span>
                          </div>
                          <div>
                            <span className="block text-[8px] font-bold text-slate-555 uppercase tracking-wider">Students Hired</span>
                            <span className="block text-xs font-bold text-emerald-400 mt-0.5">
                              {selectedAlumni.successStories?.length || Math.max(2, Math.floor((selectedAlumni.referralsSentCount || 0) * 0.4))} Placed
                            </span>
                          </div>
                        </div>

                        {/* Recent Activity Card */}
                        <div className="mb-4 font-inter p-3 rounded-xl border border-white/5 bg-slate-950/40 space-y-2">
                          <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider font-space-grotesk">Mentor Activity</span>
                          <div className="flex justify-between text-[10px] font-medium text-slate-350">
                            <span>Last Active: <strong className="text-white">2 Hours Ago</strong></span>
                            <span>Accepted: <strong className="text-emerald-400">{(selectedAlumni.referralsSentCount || 0) * 3 || 12}</strong></span>
                            <span>Declined: <strong className="text-rose-400">{Math.floor((selectedAlumni.referralsSentCount || 0) / 2) || 2}</strong></span>
                          </div>
                        </div>
 
                        {/* Bio details */}
                        <div className="space-y-3.5 mb-4 font-inter">
                          {selectedAlumni.matchReasons && selectedAlumni.matchReasons.length > 0 && (
                            <div>
                              <span className="block text-[8px] font-bold text-purple-450 uppercase tracking-wider mb-1 font-space-grotesk flex items-center gap-1">
                                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                                AI Matchmaker Explanation
                              </span>
                              <div className="bg-purple-950/15 border border-purple-500/15 rounded-xl p-3 space-y-1.5 shadow-[0_4px_15px_rgba(168,85,247,0.03)]">
                                {selectedAlumni.matchReasons.map((reason: string, idx: number) => (
                                  <div key={idx} className="flex items-start gap-2 text-[10.5px] text-purple-200 leading-normal font-medium">
                                    <span className="text-purple-450 mt-0.5 select-none font-bold">•</span>
                                    <span>{reason}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div>
                            <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider mb-1 font-space-grotesk">About Mentor</span>
                            <div className="max-h-[90px] overflow-y-auto no-scrollbar pr-1 bg-white/[0.01] rounded-lg p-2 border border-white/[0.02]">
                              <p className="text-[11px] text-slate-350 leading-normal font-medium">
                                {selectedAlumni.bio || "No biography provided by mentor."}
                              </p>
                            </div>
                          </div>

                          {/* Skills Tags */}
                          <div>
                            <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-space-grotesk">Skills & Expertise</span>
                            <div className="flex flex-wrap gap-1.5">
                              {(selectedAlumni.skills && selectedAlumni.skills.length > 0
                                ? selectedAlumni.skills
                                : ['React', 'Node.js', 'Java', 'System Design', 'AWS']
                              ).map((skill: string, idx: number) => (
                                <span key={idx} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[9.5px] text-slate-350 font-semibold">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Can Help With checks */}
                          <div>
                            <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-space-grotesk">Can Help With</span>
                            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-300 font-semibold">
                              {(selectedAlumni.canHelpWith && selectedAlumni.canHelpWith.length > 0
                                ? selectedAlumni.canHelpWith
                                : ['Referrals', 'Resume Review', 'Mock Interviews', 'Career Guidance']
                              ).map((help: string, idx: number) => (
                                <div key={idx} className="flex items-center gap-1.5 bg-white/[0.01] border border-white/[0.02] px-3 py-2 rounded-xl">
                                  <span className="text-purple-400 font-extrabold select-none">✓</span>
                                  <span>{help}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Success Stories */}
                          {selectedAlumni.successStories && selectedAlumni.successStories.length > 0 && (
                            <div>
                              <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-space-grotesk">Mentee Success Stories</span>
                              <div className="space-y-2">
                                {selectedAlumni.successStories.map((story: any, idx: number) => (
                                  <div key={idx} className="p-3 rounded-xl border border-white/5 bg-white/[0.01] flex items-center justify-between">
                                    <div>
                                      <span className="block text-[11px] font-bold text-white">{story.studentName}</span>
                                      <span className="block text-[8.5px] text-slate-500 font-semibold mt-0.5">{story.studentCollege || 'KIIT'} Network</span>
                                    </div>
                                    <div className="text-right">
                                      <span className="inline-block text-[9px] font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                        → {story.company || selectedAlumni.company}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Contact Details Block (Privacy-Aware) */}
                          {(!selectedAlumni.isPrivateProfile && (selectedAlumni.email || selectedAlumni.linkedinUrl || selectedAlumni.companyEmail || selectedAlumni.phone)) ? (
                            <div className="p-3.5 rounded-2xl border border-purple-500/10 bg-purple-950/5 space-y-3 font-inter shadow-[0_4px_15px_rgba(168,85,247,0.02)]">
                              <div className="text-purple-450 font-bold font-space-grotesk text-[8.5px] uppercase tracking-wider flex items-center gap-1">
                                <span>⚡ Verified Contact Details</span>
                              </div>
                              
                              <div className="space-y-2 text-[10px]">
                                {selectedAlumni.email && (
                                  <div className="flex justify-between items-center bg-black/30 p-2 rounded-xl border border-white/5">
                                    <span className="text-slate-500 font-semibold text-[8px] uppercase tracking-wider">Email</span>
                                    <span className="text-white font-mono font-medium select-all">{selectedAlumni.email}</span>
                                  </div>
                                )}

                                {selectedAlumni.companyEmail && (
                                  <div className="flex justify-between items-center bg-black/30 p-2 rounded-xl border border-white/5">
                                    <span className="text-slate-500 font-semibold text-[8px] uppercase tracking-wider">Work Email</span>
                                    <span className="text-white font-mono font-medium select-all">{selectedAlumni.companyEmail}</span>
                                  </div>
                                )}

                                {selectedAlumni.phone && (
                                  <div className="flex justify-between items-center bg-black/30 p-2 rounded-xl border border-white/5">
                                    <span className="text-slate-500 font-semibold text-[8px] uppercase tracking-wider">Phone</span>
                                    <span className="text-white font-mono font-medium select-all">{selectedAlumni.phone}</span>
                                  </div>
                                )}

                                {selectedAlumni.linkedinUrl && (
                                  <a
                                    href={selectedAlumni.linkedinUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block p-2 bg-black/30 hover:bg-black/50 text-center rounded-xl border border-white/5 text-purple-400 hover:text-purple-300 font-bold text-[9px] uppercase tracking-wider transition"
                                  >
                                    View LinkedIn Profile
                                  </a>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="p-3.5 rounded-2xl border border-white/5 bg-slate-950/20 text-center font-inter space-y-2">
                              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center justify-center gap-1.5">
                                <span>🔒 Contact Details Private</span>
                              </div>
                              <p className="text-[9px] text-slate-550 leading-normal">
                                This mentor's contact details are private. Submit a referral request to communicate.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
 
                      {/* Actions footer */}
                      <div className="pt-3 border-t border-white/5 grid grid-cols-3 gap-2 mt-auto">
                        <button
                          type="button"
                          onClick={() => {
                            const isSaved = savedAlumniIds.includes(selectedAlumni.id);
                            setSavedAlumniIds(prev => 
                              isSaved ? prev.filter(id => id !== selectedAlumni.id) : [...prev, selectedAlumni.id]
                            );
                          }}
                          className="py-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-200 font-sora font-semibold text-[9px] uppercase tracking-wider hover:bg-white/10 transition"
                        >
                          {savedAlumniIds.includes(selectedAlumni.id) ? 'Saved' : 'Bookmark'}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (setActiveChatId && setActiveTab) {
                              setActiveChatId(selectedAlumni.id);
                              setActiveTab('messages');
                              setSelectedAlumni(null);
                            }
                          }}
                          className="py-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-200 font-sora font-semibold text-[9px] uppercase tracking-wider hover:bg-white/10 transition flex items-center justify-center gap-1"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          Chat
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => {
                            const targetAlum = selectedAlumni;
                            setSelectedAlumni(null);
                            openRequestModal(targetAlum);
                          }}
                          className="py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-650 hover:opacity-95 text-white font-sora font-bold text-[9px] uppercase tracking-wider transition shadow-md"
                        >
                          Request
                        </button>
                      </div>
 
                    </div>
                  </div>
                )}

              </div>
            {/* SCREEN 3: REFERRAL MODAL (SINGLE PAGE FORM) */}
            <ReferralModal
              isOpen={isRequestModalOpen && alumniForRequest !== null}
              onClose={() => {
                setIsRequestModalOpen(false);
                setShowConfirmStep(false);
              }}
              title="Request Referral"
            >
              {alumniForRequest && (
                <div className="flex items-center gap-3 pb-3 border-b border-white/5 mb-3 shrink-0">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${alumniForRequest.color} flex items-center justify-center font-bold text-white text-[10px] uppercase`}>
                    {alumniForRequest.initials || alumniForRequest.initial || 'A'}
                  </div>
                  <div>
                    <p className="text-[11px] text-white font-bold">{alumniForRequest.name}</p>
                    <p className="text-[9px] text-slate-400">{alumniForRequest.role} at {alumniForRequest.company}</p>
                  </div>
                </div>
              )}


                  {/* Scrollable Form Content */}
                  <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pr-0.5">
                    {showConfirmStep ? (
                      <div className="space-y-4 py-3">
                        <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-center space-y-3 animate-scale-in">
                          <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto">
                            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-sora text-[11px] font-bold text-white uppercase tracking-wider">Confirm Referral Request</h4>
                            <p className="text-[10px] text-slate-400 leading-normal">
                              You have <strong className="text-amber-300 font-mono">{referralCreditsRemaining}</strong> referral credits remaining.
                            </p>
                          </div>
                          <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-[9.5px] text-slate-350 leading-relaxed text-left">
                            {referralCreditsRemaining <= 0 ? (
                              <span>
                                <strong className="text-amber-450 block mb-1">⚠️ LOW CREDITS WARNING</strong>
                                You have 0 credits left. Sending this request will exceed your monthly limit, but it is allowed and will be sent. Credits are not refunded.
                              </span>
                            ) : (
                              <span>
                                This request will consume <strong className="text-white">1 referral credit</strong>. Credits are <strong className="text-rose-450">not refunded</strong> if the request is declined, ignored, or fails to get a response.
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Role & Timeline (2-column layout) */}
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider mb-1 font-space-grotesk">
                              Target Role
                            </label>
                            <select 
                              value={targetRole} 
                              onChange={(e) => setTargetRole(e.target.value)}
                              className="w-full px-2 py-1.5 bg-black border border-white/10 rounded-lg text-white text-[10px] focus:outline-none focus:border-purple-500/40"
                            >
                              {alumniForRequest?.company === 'Google' && (
                                <>
                                  <option>L3 Software Engineer</option>
                                  <option>Software Engineer Intern (Fall)</option>
                                  <option>Silicon & Hardware Architect</option>
                                </>
                              )}
                              {alumniForRequest?.company === 'Microsoft' && (
                                <>
                                  <option>Associate Product Manager</option>
                                  <option>Azure Cloud SWE Intern</option>
                                  <option>Data & ML Specialist</option>
                                </>
                              )}
                              {alumniForRequest?.company === 'Amazon' && (
                                <>
                                  <option>SDE I (Full-time)</option>
                                  <option>Cloud Infrastructure Intern</option>
                                  <option>Business Analyst Intern</option>
                                </>
                              )}
                              {alumniForRequest && !['Google', 'Microsoft', 'Amazon'].includes(alumniForRequest.company) && (
                                <>
                                  <option>Software Developer Associate</option>
                                  <option>Product Consultant Intern</option>
                                  <option>Graduate Engineer Trainee</option>
                                </>
                              )}
                            </select>
                          </div>

                          <div>
                            <label className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider mb-1 font-space-grotesk">Timeline</label>
                            <select 
                              value={timeline} 
                              onChange={(e) => setTimeline(e.target.value)}
                              className="w-full px-2 py-1.5 bg-black border border-white/10 rounded-lg text-white text-[10px] focus:outline-none focus:border-purple-500/40"
                            >
                              <option>Actively looking (Immediate)</option>
                              <option>Next 3 months</option>
                              <option>Exploring opportunities</option>
                            </select>
                          </div>
                        </div>

                        {/* Pitch Message */}
                        <div className="space-y-1">
                          <label className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider font-space-grotesk">
                            Why are you a good fit?
                          </label>
                          <textarea
                            rows={3}
                            value={pitchMessage}
                            onChange={(e) => setPitchMessage(e.target.value)}
                            placeholder="State your strongest project/achievement..."
                            className="w-full px-3 py-2 bg-black border border-white/10 rounded-xl text-white text-[11px] placeholder-slate-600 focus:outline-none focus:border-purple-500/40 resize-none leading-normal"
                            maxLength={300}
                          />
                          
                          <div className="flex items-center justify-between text-[7px] text-slate-550 font-bold uppercase tracking-wider">
                            <span>{pitchMessage.length}/300 chars</span>
                            <span>AI Pitch Guard Active</span>
                          </div>

                          {/* AI warning prompts */}
                          {aiTipWarning && (
                            <div className="p-2 rounded-lg bg-purple-500/5 border border-purple-500/10 text-[9px] text-purple-300 leading-normal flex gap-1.5">
                              <AlertCircle className="w-3.5 h-3.5 text-purple-400 shrink-0 animate-pulse" />
                              <div>{aiTipWarning}</div>
                            </div>
                          )}
                        </div>

                        {referralCreditsRemaining <= 0 ? (
                          <div className="p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/10 text-[9.5px] text-amber-300 leading-normal flex gap-1.5 mb-1.5">
                            <AlertCircle className="w-4 h-4 text-amber-450 shrink-0 mt-0.5" />
                            <div>
                              <strong>Low Credits Warning.</strong> You have used all {monthlyReferralLimit} referral credits for this month. Additional requests are allowed but may be marked as low priority. Your credits will reset on {getNextResetDate()}.
                            </div>
                          </div>
                        ) : (
                          <div className="p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/10 text-[9.5px] text-amber-300 leading-normal flex gap-1.5 mb-1.5">
                            <AlertCircle className="w-4 h-4 text-amber-450 shrink-0 mt-0.5" />
                            <div>
                              You have <strong>{referralCreditsRemaining}</strong> referral credits remaining. This request will consume 1 credit. Credits are not refunded if the request is declined.
                            </div>
                          </div>
                        )}

                        {/* Attached Resume */}
                        <div className="space-y-1">
                          <label className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider font-space-grotesk">Verified Resume</label>
                          <div className="p-2 rounded-xl border border-white/10 bg-white/[0.01] flex items-center gap-2">
                            <FileText className="w-5 h-5 text-rose-500 shrink-0" />
                            <div className="min-w-0">
                              <span className="block font-bold text-white text-[10px] truncate">{resumeName || "No resume uploaded"}</span>
                              <span className="block text-[8px] text-slate-550">PDF Encrypted · Automatically attached</span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Modal Footer Controls */}
                  <div className="pt-3 border-t border-white/5 mt-3 shrink-0 flex flex-col gap-1.5">
                    {showConfirmStep ? (
                      <div className="flex gap-2 w-full">
                        <button
                          type="button"
                          onClick={() => setShowConfirmStep(false)}
                          className="flex-1 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 font-sora font-bold text-[10px] uppercase tracking-wider transition"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={submitReferralRequest}
                          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-650 hover:opacity-95 text-white font-sora font-bold text-[10px] uppercase tracking-wider transition shadow-md"
                        >
                          Confirm & Send
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowConfirmStep(true)}
                        disabled={pitchMessage.trim().length === 0}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-650 hover:opacity-95 text-white font-sora font-bold text-[11px] uppercase tracking-wider transition shadow-md disabled:opacity-40 disabled:pointer-events-none"
                      >
                        Send Request
                      </button>
                    )}
                    {alumniForRequest && (
                      <div className="text-center">
                        <span className="text-[8px] text-slate-555 font-semibold">
                          {alumniForRequest.name} typically responds {alumniForRequest.responseSpeed?.toLowerCase() || 'in a few days'}.
                        </span>
                      </div>
                    )}
                  </div>

            </ReferralModal>
    </>
  );
};
