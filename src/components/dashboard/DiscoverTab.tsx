import React from 'react';
import {
  AlertCircle, Bookmark, FileText, Search, ShieldCheck, Sparkles, X, MessageSquare
} from 'lucide-react';

interface DiscoverTabProps {
  aiMatchToggle: boolean;
  aiTipWarning: string;
  alumniForRequest: any | null;
  alumniNetwork: any[];
  availabilityFilter: string;
  collegeOnlyFilter: boolean;
  getFilteredAlumni: () => any[];
  isRequestModalOpen: boolean;
  openRequestModal: (alumni: any) => void;
  pitchMessage: string;
  profileCollege: string;
  resumeName: string;
  savedAlumniIds: number[];
  searchQuery: string;
  selectedAlumni: any | null;
  selectedCompanyFilter: string;
  selectedRoleFilter: string;
  setAiMatchToggle: (toggle: boolean) => void;
  setAvailabilityFilter: (filter: string) => void;
  setCollegeOnlyFilter: (filter: boolean) => void;
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
}

export const DiscoverTab: React.FC<DiscoverTabProps> = ({
  aiMatchToggle,
  aiTipWarning,
  alumniForRequest,
  alumniNetwork,
  availabilityFilter,
  collegeOnlyFilter,
  getFilteredAlumni,
  isRequestModalOpen,
  openRequestModal,
  pitchMessage,
  profileCollege,
  resumeName,
  savedAlumniIds,
  searchQuery,
  selectedAlumni,
  selectedCompanyFilter,
  selectedRoleFilter,
  setAiMatchToggle,
  setAvailabilityFilter,
  setCollegeOnlyFilter,
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
  setActiveChatId
}) => {
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
                      {/* College Toggle */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1 font-space-grotesk">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Show {profileCollege} only
                        </span>
                        <button
                          onClick={() => setCollegeOnlyFilter(!collegeOnlyFilter)}
                          className={`w-9 h-5 rounded-full flex items-center transition-colors p-0.5 ${
                            collegeOnlyFilter ? 'bg-purple-650' : 'bg-slate-800'
                          }`}
                        >
                          <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                            collegeOnlyFilter ? 'translate-x-4' : 'translate-x-0'
                          }`} />
                        </button>
                      </div>

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getFilteredAlumni().map((alumni) => {
                    const isSaved = savedAlumniIds.includes(alumni.id);
                    return (
                      <div 
                        key={alumni.id}
                        className="p-5 rounded-2xl border border-white/5 bg-[#08080b]/90 hover:border-purple-500/35 transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(168,85,247,0.06)] flex flex-col justify-between text-left"
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
                          <h4 
                            onClick={() => setSelectedAlumni(alumni)}
                            className="font-sora text-sm font-bold text-white hover:text-purple-400 cursor-pointer transition flex items-center gap-1"
                          >
                            {alumni.name}
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                          </h4>
                          
                          <p className="text-[10px] text-slate-400 mt-1.5 font-semibold">
                            {alumni.role} at <span className="text-white font-bold">{alumni.company}</span>
                          </p>
                          
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            {alumni.college} network · Verified
                          </p>

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
                        {collegeOnlyFilter ? `Try turning off the "Show ${profileCollege} only" toggle to search alumni from all campuses.` : 'Try widening your search queries or resetting company filters.'}
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
                          <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${selectedAlumni.color} flex items-center justify-center font-bold text-white text-sm uppercase shadow-lg`}>
                            {selectedAlumni.initial}
                          </div>
                          <div>
                            <h3 className="font-sora text-white text-sm font-extrabold flex items-center gap-1">
                              {selectedAlumni.name}
                              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                            </h3>
                            <p className="text-[10px] text-slate-350 mt-0.5 font-semibold">{selectedAlumni.role} at {selectedAlumni.company}</p>
                            <p className="text-[9px] text-slate-500 mt-0.5">{selectedAlumni.college}</p>
                          </div>
                        </div>
 
                        {/* Telemetry Stats */}
                        <div className="grid grid-cols-2 gap-3 mb-4 p-3 rounded-xl border border-white/5 bg-slate-950/40 font-inter">
                          <div>
                            <span className="block text-[8px] font-bold text-slate-550 uppercase tracking-wider">Response Rate</span>
                            <span className="block text-xs font-bold text-white mt-0.5">{selectedAlumni.responseRate}</span>
                            <span className="block text-[8px] text-slate-500 mt-0.5">{selectedAlumni.responseSpeed}</span>
                          </div>
                          <div>
                            <span className="block text-[8px] font-bold text-slate-555 uppercase tracking-wider">Referral success</span>
                            <span className="block text-xs font-bold text-white mt-0.5">{selectedAlumni.successRate.split(' ')[0]} Referred</span>
                            <span className="block text-[8px] text-emerald-450 mt-0.5">Active track records</span>
                          </div>
                        </div>
 
                        {/* Bio details */}
                        <div className="space-y-3 mb-4 font-inter">
                          <div>
                            <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider mb-1 font-space-grotesk">About Mentor</span>
                            <div className="max-h-[90px] overflow-y-auto no-scrollbar pr-1 bg-white/[0.01] rounded-lg p-2 border border-white/[0.02]">
                              <p className="text-[11px] text-slate-350 leading-normal font-medium">
                                {selectedAlumni.bio}
                              </p>
                            </div>
                          </div>
                          <div>
                            <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider mb-1 font-space-grotesk">Referral Success Wall</span>
                            <div className="bg-white/[0.01] rounded-lg p-2 border border-white/[0.02]">
                              <p className="text-[11px] text-slate-400 leading-normal italic font-medium">
                                "Alumni referred {selectedAlumni.successRate.split(' ')[0]} students to {selectedAlumni.company} recently with high success rates."
                              </p>
                            </div>
                          </div>
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
            {isRequestModalOpen && alumniForRequest && (
              <div 
                className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in cursor-pointer"
                onClick={() => setIsRequestModalOpen(false)}
              >
                <div 
                  className="w-full max-w-md bg-[#07070a] border border-white/10 p-5 rounded-2xl shadow-2xl relative text-left flex flex-col max-h-[90vh] overflow-hidden animate-modal-scale-in cursor-default"
                  onClick={e => e.stopPropagation()}
                >
                  
                  {/* Close Button */}
                  <button 
                    onClick={() => setIsRequestModalOpen(false)}
                    className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white border border-white/5 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Modal Header */}
                  <div className="flex items-center gap-3 pb-3 border-b border-white/5 mb-3 shrink-0">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${alumniForRequest.color} flex items-center justify-center font-bold text-white text-[10px] uppercase`}>
                      {alumniForRequest.initial}
                    </div>
                    <div>
                      <h3 className="font-sora text-xs font-bold text-white">
                        Request Referral
                      </h3>
                      <p className="text-[9px] text-slate-400">To {alumniForRequest.name} · {alumniForRequest.role} at {alumniForRequest.company}</p>
                    </div>
                  </div>

                  {/* Scrollable Form Content */}
                  <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pr-0.5">
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
                          {alumniForRequest.company === 'Google' && (
                            <>
                              <option>L3 Software Engineer</option>
                              <option>Software Engineer Intern (Fall)</option>
                              <option>Silicon & Hardware Architect</option>
                            </>
                          )}
                          {alumniForRequest.company === 'Microsoft' && (
                            <>
                              <option>Associate Product Manager</option>
                              <option>Azure Cloud SWE Intern</option>
                              <option>Data & ML Specialist</option>
                            </>
                          )}
                          {alumniForRequest.company === 'Amazon' && (
                            <>
                              <option>SDE I (Full-time)</option>
                              <option>Cloud Infrastructure Intern</option>
                              <option>Business Analyst Intern</option>
                            </>
                          )}
                          {!['Google', 'Microsoft', 'Amazon'].includes(alumniForRequest.company) && (
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

                    {/* Attached Resume */}
                    <div className="space-y-1">
                      <label className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider font-space-grotesk">Verified Resume</label>
                      <div className="p-2 rounded-xl border border-white/10 bg-white/[0.01] flex items-center gap-2">
                        <FileText className="w-5 h-5 text-rose-500 shrink-0" />
                        <div className="min-w-0">
                          <span className="block font-bold text-white text-[10px] truncate">{resumeName || "No resume uploaded"}</span>
                          <span className="block text-[8px] text-slate-500">PDF Encrypted · Automatically attached</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer Controls */}
                  <div className="pt-3 border-t border-white/5 mt-3 shrink-0 flex flex-col gap-1.5">
                    <button
                      type="button"
                      onClick={submitReferralRequest}
                      disabled={pitchMessage.trim().length === 0}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-650 hover:opacity-95 text-white font-sora font-bold text-[11px] uppercase tracking-wider transition shadow-md disabled:opacity-40 disabled:pointer-events-none"
                    >
                      Send Request
                    </button>
                    <div className="text-center">
                      <span className="text-[8px] text-slate-500 font-semibold">
                        {alumniForRequest.name} typically responds {alumniForRequest.responseSpeed.toLowerCase()}.
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            )}
    </>
  );
};
