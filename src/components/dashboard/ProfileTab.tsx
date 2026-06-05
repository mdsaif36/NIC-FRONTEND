import React from 'react';
import {
  Activity, Award, Briefcase, Calendar, CheckCircle, CheckSquare, Edit, FileText, Fingerprint, Globe, Lock, Network, Plus, Send, Settings, ShieldCheck, TrendingUp, X, UploadCloud, Check, Trash2, Download
} from 'lucide-react';
import { SkillGlobe } from './SkillGlobe';

interface ProfileTabProps {
  bio: string;
  getProfileCompletion: () => number;
  githubUrl: string;
  handleAddCompany: () => void;
  handleAddSkill: () => void;
  handleRemoveCompany: (company: string) => void;
  handleRemoveSkill: (skill: string) => void;
  hoveredSkill: string | null;
  isEditMode: boolean;
  linkedinUrl: string;
  newCompanyInput: string;
  newSkillInput: string;
  privacyCollegeOnly: boolean;
  profileBranch: string;
  profileCollege: string;
  profileName: string;
  profileYear: string;
  requestsList: any[];
  resumeName: string;
  resumeUploaded: boolean;
  savedAlumniIds: number[];
  setBio: (bio: string) => void;
  setGithubUrl: (url: string) => void;
  setHoveredSkill: (skill: string | null) => void;
  setIsEditMode: (edit: boolean) => void;
  setLinkedinUrl: (url: string) => void;
  setNewCompanyInput: (input: string) => void;
  setNewSkillInput: (input: string) => void;
  setPrivacyCollegeOnly: (filter: boolean) => void;
  setProfileBranch: (branch: string) => void;
  setProfileCollege: (college: string) => void;
  setProfileName: (name: string) => void;
  setProfileYear: (year: string) => void;
  setResumeName: (name: string) => void;
  setResumeUploaded: (uploaded: boolean) => void;
  setSkillDetails: React.Dispatch<React.SetStateAction<{ [key: string]: { proficiency: number; type: 'technical' | 'soft' | 'domain' } }>>;
  skillDetails: { [key: string]: { proficiency: number; type: 'technical' | 'soft' | 'domain' } };
  skills: string[];
  targetCompanies: string[];
  userId: number;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  bio,
  getProfileCompletion,
  githubUrl,
  handleAddCompany,
  handleAddSkill,
  handleRemoveCompany,
  handleRemoveSkill,
  hoveredSkill,
  isEditMode,
  linkedinUrl,
  newCompanyInput,
  newSkillInput,
  privacyCollegeOnly,
  profileBranch,
  profileCollege,
  profileName,
  profileYear,
  requestsList,
  resumeName,
  resumeUploaded,
  savedAlumniIds,
  setBio,
  setGithubUrl,
  setHoveredSkill,
  setIsEditMode,
  setLinkedinUrl,
  setNewCompanyInput,
  setNewSkillInput,
  setPrivacyCollegeOnly,
  setProfileBranch,
  setProfileCollege,
  setProfileName,
  setProfileYear,
  setResumeName,
  setResumeUploaded,
  setSkillDetails,
  skillDetails,
  skills,
  targetCompanies,
  userId
}) => {
  interface ResumeHistoryItem {
    id: string;
    name: string;
    size: string;
    uploadedAt: string;
  }

  const [resumesHistory, setResumesHistory] = React.useState<ResumeHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(`resumes_history_${userId}`);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Error loading resume history from localStorage:", e);
    }
    if (resumeUploaded && resumeName) {
      return [
        {
          id: 'res-default',
          name: resumeName,
          size: '1.2 MB',
          uploadedAt: '3 days ago'
        }
      ];
    }
    return [];
  });

  const [dragActive, setDragActive] = React.useState(false);
  const [uploadStatus, setUploadStatus] = React.useState<{ type: 'success' | 'error', message: string } | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (resumeUploaded && resumeName && !resumesHistory.some(item => item.name === resumeName)) {
      const newItem: ResumeHistoryItem = {
        id: `res-${Date.now()}`,
        name: resumeName,
        size: '1.2 MB',
        uploadedAt: 'Just now'
      };
      const updated = [newItem, ...resumesHistory];
      setResumesHistory(updated);
      localStorage.setItem(`resumes_history_${userId}`, JSON.stringify(updated));
    }
  }, [resumeName, resumeUploaded, userId]);

  const saveHistory = (history: ResumeHistoryItem[]) => {
    setResumesHistory(history);
    localStorage.setItem(`resumes_history_${userId}`, JSON.stringify(history));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'docx', 'doc'].includes(ext || '')) {
      setUploadStatus({
        type: 'error',
        message: 'Invalid file format. Please upload PDF, DOCX, or DOC documents.'
      });
      setTimeout(() => setUploadStatus(null), 4000);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus({
        type: 'error',
        message: 'File size exceeds 5MB limit. Please upload a smaller document.'
      });
      setTimeout(() => setUploadStatus(null), 4000);
      return;
    }

    const name = file.name;
    const rawSize = file.size;
    let sizeStr = '0 KB';
    if (rawSize >= 1024 * 1024) {
      sizeStr = `${(rawSize / (1024 * 1024)).toFixed(1)} MB`;
    } else {
      sizeStr = `${(rawSize / 1024).toFixed(0)} KB`;
    }

    const timeStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const newItem: ResumeHistoryItem = {
      id: `res-${Date.now()}`,
      name: name,
      size: sizeStr,
      uploadedAt: timeStr
    };

    const updated = [newItem, ...resumesHistory.filter(item => item.name !== name)];
    saveHistory(updated);
    setResumeName(name);
    setResumeUploaded(true);

    setUploadStatus({
      type: 'success',
      message: `Successfully uploaded and activated "${name}"!`
    });
    setTimeout(() => setUploadStatus(null), 4000);
  };

  const handleActivateResume = (name: string) => {
    setResumeName(name);
    setResumeUploaded(true);
    setUploadStatus({
      type: 'success',
      message: `Switched active resume to "${name}"!`
    });
    setTimeout(() => setUploadStatus(null), 3000);
  };

  const handleDeleteResume = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const itemToDelete = resumesHistory.find(item => item.id === id);
    if (!itemToDelete) return;

    if (itemToDelete.name === resumeName) {
      setUploadStatus({
        type: 'error',
        message: "Cannot remove the active resume. Switch active resumes first."
      });
      setTimeout(() => setUploadStatus(null), 3000);
      return;
    }

    const updated = resumesHistory.filter(item => item.id !== id);
    saveHistory(updated);
    setUploadStatus({
      type: 'success',
      message: `Removed "${itemToDelete.name}" from history.`
    });
    setTimeout(() => setUploadStatus(null), 3000);
  };

  return (

    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up text-left pb-16 font-inter">
              
              {/* 1. TOP ROW: VERIFICATION STATUS CARDS (3 columns) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Card 1: Verify Email */}
                <div className="relative p-5 rounded-2xl border border-purple-500/10 bg-[#08080b]/90 overflow-hidden flex flex-col justify-between h-[130px] group hover:border-purple-500/30 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl pointer-events-none" />
                  <div className="flex items-start justify-between">
                    <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:scale-110 transition-transform duration-300">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Completed
                    </span>
                  </div>
                  <div>
                    <h4 className="text-white text-xs font-bold font-sora">Verify email</h4>
                    <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                      University email validated. Active network connection unlocked.
                    </p>
                  </div>
                </div>

                {/* Card 2: Explore Network */}
                <div className="relative p-5 rounded-2xl border border-blue-500/10 bg-[#08080b]/90 overflow-hidden flex flex-col justify-between h-[130px] group hover:border-blue-500/30 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
                  <div className="flex items-start justify-between">
                    <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                      <Network className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      Active
                    </span>
                  </div>
                  <div>
                    <h4 className="text-white text-xs font-bold font-sora">Explore network</h4>
                    <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                      Browse 500+ verified alumni and target company links.
                    </p>
                  </div>
                </div>

                {/* Card 3: Send a Request */}
                <div className="relative p-5 rounded-2xl border border-amber-500/10 bg-[#08080b]/90 overflow-hidden flex flex-col justify-between h-[130px] group hover:border-amber-500/30 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
                  <div className="flex items-start justify-between">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-110 transition-transform duration-300">
                      <Send className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      Active
                    </span>
                  </div>
                  <div>
                    <h4 className="text-white text-xs font-bold font-sora">Send a request</h4>
                    <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                      Submit referral outlines to unlocked mentors.
                    </p>
                  </div>
                </div>

              </div>

              {/* 2. HEADER CARD: BIOGRAPHY / CONTROL CENTER CARD */}
              <div className="p-6 rounded-2xl border border-white/5 bg-[#08080b]/90 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
                <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex items-center gap-4">
                  {/* Completion ring around avatar */}
                  <div className="relative p-1 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-red-500 shadow-md animate-logo-pulse">
                    <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center font-bold text-white text-lg uppercase shadow-xl select-none">
                      {profileName ? profileName.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 'S'}
                    </div>
                    <div className="absolute inset-0 rounded-full border-[3px] border-purple-400/20 border-t-purple-400 pointer-events-none" />
                  </div>

                  <div>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="px-3 py-1.5 bg-black border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500/40 font-bold"
                      />
                    ) : (
                      <h3 className="font-sora text-white text-base font-extrabold flex flex-wrap items-center gap-2">
                        {profileName}
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Verified student email
                        </span>
                      </h3>
                    )}
                    
                    {isEditMode ? (
                      <div className="flex flex-wrap gap-2 mt-2">
                        <input
                          type="text"
                          value={profileCollege}
                          onChange={(e) => setProfileCollege(e.target.value)}
                          className="px-2 py-1 bg-black border border-white/10 rounded text-[10px] text-white focus:outline-none"
                          placeholder="College name"
                        />
                        <input
                          type="text"
                          value={profileYear}
                          onChange={(e) => setProfileYear(e.target.value)}
                          className="px-2 py-1 bg-black border border-white/10 rounded text-[10px] text-white focus:outline-none"
                          placeholder="Year"
                        />
                        <input
                          type="text"
                          value={profileBranch}
                          onChange={(e) => setProfileBranch(e.target.value)}
                          className="px-2 py-1 bg-black border border-white/10 rounded text-[10px] text-white focus:outline-none"
                          placeholder="Branch/Major"
                        />
                      </div>
                    ) : (
                      <>
                        <p className="text-[11px] text-slate-400 mt-1 font-semibold">{profileCollege} · {profileBranch}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{profileYear}</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditMode(!isEditMode)}
                    className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold text-purple-400 transition flex items-center gap-1.5 shadow-sm active:scale-95"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    {isEditMode ? 'Close Edit' : 'Edit Profile'}
                  </button>
                </div>
              </div>

              {/* 3. SCORECARD HEADER ROW (TELEMETRY STATISTICS) */}
              <div className="p-6 rounded-2xl border border-white/5 bg-[#08080b]/90 text-left shadow-[0_4px_35px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-4 h-4 text-purple-400" />
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-space-grotesk">Seeker Telemetry Scorecard</span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                  <div className="p-3 bg-slate-950/40 rounded-xl border border-purple-500/10 hover:border-purple-500/20 transition-all duration-300">
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Rating Score</span>
                    <span className="block text-lg font-sora font-extrabold text-white mt-1">4.9 ⭐</span>
                  </div>
                  <div className="p-3 bg-slate-950/40 rounded-xl border border-blue-500/10 hover:border-blue-500/20 transition-all duration-300">
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Referred</span>
                    <span className="block text-lg font-sora font-extrabold text-white mt-1">8 times</span>
                  </div>
                  <div className="p-3 bg-slate-950/40 rounded-xl border border-emerald-500/10 hover:border-emerald-500/20 transition-all duration-300">
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Match Index</span>
                    <span className="block text-lg font-sora font-extrabold text-white mt-1">94%</span>
                  </div>
                  <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-700/20 hover:border-slate-700/40 transition-all duration-300">
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Saved Alumni</span>
                    <span className="block text-lg font-sora font-extrabold text-white mt-1">{savedAlumniIds.length} users</span>
                  </div>
                  <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-700/20 hover:border-slate-700/40 transition-all duration-300">
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Pending</span>
                    <span className="block text-lg font-sora font-extrabold text-white mt-1">
                      {requestsList.filter((r: any) => r.status === 'pending').length} reqs
                    </span>
                  </div>
                  <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-700/20 hover:border-slate-700/40 transition-all duration-300">
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Interviews</span>
                    <span className="block text-lg font-sora font-extrabold text-white mt-1">12 scheduled</span>
                  </div>
                </div>
              </div>

              {/* 4. DUAL ROW: COMPLETION CHECKLIST & GIT ACTIVITY GRAPH */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Profile Items Completion Checklist (Span 5) */}
                <div className="p-6 rounded-2xl border border-white/5 bg-[#08080b]/90 space-y-4 lg:col-span-5 flex flex-col justify-between shadow-[0_4px_25px_rgba(0,0,0,0.4)]">
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-white/5 mb-3">
                      <h4 className="font-sora text-white text-xs font-bold uppercase tracking-wider font-space-grotesk flex items-center gap-1.5">
                        <CheckSquare className="w-4 h-4 text-purple-400" />
                        Completion Items
                      </h4>
                      <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full animate-pulse">
                        {getProfileCompletion()}% Complete
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {/* Item 1 */}
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/40 border border-white/5 hover:border-purple-500/10 transition-colors">
                        <div className="flex items-center gap-2 text-xs">
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span className="text-slate-300 font-medium">Verify College Email</span>
                        </div>
                        <span className="text-[9px] font-bold text-emerald-400 font-mono">+20%</span>
                      </div>

                      {/* Item 2 */}
                      <div 
                        onClick={() => {
                          const element = document.getElementById('resume-section');
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth' });
                            setTimeout(() => {
                              if (fileInputRef.current) {
                                fileInputRef.current.click();
                              }
                            }, 500);
                          }
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/40 border border-white/5 hover:border-purple-500/20 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2 text-xs">
                          {resumeUploaded ? (
                            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-slate-700 shrink-0" />
                          )}
                          <span className={`${resumeUploaded ? 'text-slate-350 line-through' : 'text-slate-300'} font-medium`}>Upload Resume Document</span>
                        </div>
                        <span className="text-[9px] font-bold text-purple-400 font-mono">+20%</span>
                      </div>

                      {/* Item 3 */}
                      <div 
                        onClick={() => setIsEditMode(true)}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/40 border border-white/5 hover:border-purple-500/20 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2 text-xs">
                          {skills.length >= 8 ? (
                            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-slate-700 shrink-0" />
                          )}
                          <span className={`${skills.length >= 8 ? 'text-slate-350 line-through' : 'text-slate-300'} font-medium`}>Add 8 technical skills</span>
                        </div>
                        <span className="text-[9px] font-bold text-purple-400 font-mono">+25%</span>
                      </div>

                      {/* Item 4 */}
                      <div 
                        onClick={() => setIsEditMode(true)}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/40 border border-white/5 hover:border-purple-500/20 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2 text-xs">
                          {targetCompanies.length >= 3 ? (
                            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-slate-700 shrink-0" />
                          )}
                          <span className={`${targetCompanies.length >= 3 ? 'text-slate-350 line-through' : 'text-slate-300'} font-medium`}>Add 3 Target Companies</span>
                        </div>
                        <span className="text-[9px] font-bold text-purple-400 font-mono">+20%</span>
                      </div>

                      {/* Item 5 */}
                      <div 
                        onClick={() => setIsEditMode(true)}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/40 border border-white/5 hover:border-purple-500/20 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2 text-xs">
                          {githubUrl && linkedinUrl ? (
                            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-slate-700 shrink-0" />
                          )}
                          <span className={`${githubUrl && linkedinUrl ? 'text-slate-350 line-through' : 'text-slate-300'} font-medium`}>Link Portfolio URLs</span>
                        </div>
                        <span className="text-[9px] font-bold text-purple-400 font-mono">+15%</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-[9px] text-slate-550 leading-relaxed italic border-t border-white/5 pt-2 mt-1">
                    * Reach 100% profile completions to unlock automatic AI match priority pipelines.
                  </p>
                </div>

                {/* Git Activity Verification Calendar (Span 7) */}
                <div className="p-6 rounded-2xl border border-white/5 bg-[#08080b]/90 space-y-4 lg:col-span-7 flex flex-col justify-between shadow-[0_4px_25px_rgba(0,0,0,0.4)]">
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-white/5 mb-4">
                      <h4 className="font-sora text-white text-xs font-bold uppercase tracking-wider font-space-grotesk flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-purple-400" />
                        Alumni Git Commit Verification
                      </h4>
                      <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Active Stream Validation
                      </span>
                    </div>

                    <div className="flex gap-2.5 select-none relative">
                      {/* Y-axis days */}
                      <div className="flex flex-col justify-between text-[8px] text-slate-500 font-bold h-[92px] pt-1 shrink-0 font-space-grotesk">
                        <span>Mon</span>
                        <span>Wed</span>
                        <span>Fri</span>
                      </div>

                      {/* Contribution Grid */}
                      <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                        {/* Month Headers */}
                        <div className="flex justify-between text-[8px] text-slate-500 font-bold px-1 select-none font-space-grotesk mb-0.5">
                          <span>Jan</span>
                          <span>Feb</span>
                          <span>Mar</span>
                          <span>Apr</span>
                          <span>May</span>
                          <span>Jun</span>
                        </div>

                        {/* Calendar cells (arranged 7 rows, 24 cols) */}
                        <div className="grid grid-flow-col grid-rows-7 gap-[3.5px] overflow-x-auto no-scrollbar">
                          {Array.from({ length: 168 }).map((_, idx) => {
                            // Generate mock levels of green shades representing validation check density
                            let level = 0;
                            // Pseudo-random distribution of validation commits
                            if ((idx * 3) % 19 === 0) level = 4;
                            else if ((idx * 7) % 13 === 0) level = 3;
                            else if ((idx * 5) % 11 === 0) level = 2;
                            else if ((idx * 11) % 7 === 0) level = 1;
                            else if (idx % 2 === 0) level = 0;

                            // Dynamic tailwind bg and shadow classes
                            const levelStyles = [
                              'bg-slate-900 border border-white/5', // 0
                              'bg-emerald-950/50 border border-emerald-500/10', // 1
                              'bg-emerald-800/40 border border-emerald-500/20', // 2
                              'bg-emerald-600/70 border border-emerald-500/30', // 3
                              'bg-emerald-400 border border-emerald-400/50 shadow-[0_0_8px_rgba(52,211,153,0.3)]' // 4
                            ];

                            // Mock tooltip text
                            const tooltips = [
                              "No validation logging",
                              "1 reference signal confirmed",
                              "3 target connection checks",
                              "5 referral validations active",
                              "8+ interactive endorsements completed"
                            ];

                            return (
                              <div
                                key={idx}
                                className={`w-[9px] h-[9px] rounded-[1.5px] ${levelStyles[level]} hover:scale-130 transition-transform duration-100 cursor-help group/cell relative`}
                              >
                                {/* Tooltip display on hover */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover/cell:block bg-slate-900 border border-white/10 px-2 py-1 rounded text-[8px] font-bold text-white whitespace-nowrap z-50 shadow-2xl">
                                  {tooltips[level]}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-1 font-space-grotesk text-[8px] text-slate-500 font-bold">
                    <span className="flex items-center gap-1">
                      47 validation actions in last 6 months
                    </span>
                    <div className="flex items-center gap-1 select-none">
                      <span>Less</span>
                      <div className="w-[8px] h-[8px] rounded-[1px] bg-slate-900 border border-white/5" />
                      <div className="w-[8px] h-[8px] rounded-[1px] bg-emerald-950/50 border border-emerald-500/10" />
                      <div className="w-[8px] h-[8px] rounded-[1px] bg-emerald-800/40 border border-emerald-500/20" />
                      <div className="w-[8px] h-[8px] rounded-[1px] bg-emerald-600/70 border border-emerald-500/30" />
                      <div className="w-[8px] h-[8px] rounded-[1px] bg-emerald-400 border border-emerald-400/50" />
                      <span>More</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* 5. SKILLSET INTEGRATED SECTION (3D GLOBE + SLIDER EDITOR) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 3D Skill Globe Visualizer & Proficiency Editor */}
                <div className="p-6 rounded-2xl border border-white/5 bg-[#08080b]/90 space-y-5 shadow-[0_4px_30px_rgba(0,0,0,0.5)] md:col-span-2">
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <h4 className="font-sora text-white text-xs font-bold uppercase tracking-wider font-space-grotesk flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-purple-400" />
                      3D Skill Globe & Proficiency Editor
                    </h4>
                    <span className="text-[9px] font-bold text-slate-500 font-mono">
                      Active Skills: {skills.length}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    
                    {/* Left Half: 3D Globe Visualizer */}
                    <div className="lg:col-span-6 flex flex-col items-center justify-center p-4 bg-slate-950/40 border border-white/5 rounded-xl relative min-h-[360px] overflow-hidden select-none">
                      <div className="absolute top-3 left-4 text-[8px] font-bold text-slate-500 uppercase tracking-widest font-space-grotesk z-10">
                        Interactive Projection Canvas
                      </div>
                      <SkillGlobe 
                        skills={skills} 
                        skillDetails={skillDetails} 
                        hoveredSkill={hoveredSkill} 
                        setHoveredSkill={setHoveredSkill} 
                      />
                      <div className="absolute bottom-3 text-[7.5px] text-slate-500 uppercase tracking-wide leading-relaxed text-center max-w-xs font-space-grotesk select-none pointer-events-none">
                        Auto-rotating slowly. Drag to rotate manually in 3D.
                      </div>
                    </div>

                    {/* Right Half: Skills Slider Editor */}
                    <div className="lg:col-span-6 space-y-4 text-left">
                      <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider font-space-grotesk">Proficiency & Type Editor</span>
                      
                      <div className="max-h-[290px] overflow-y-auto pr-2 space-y-3 no-scrollbar border border-white/5 bg-slate-950/20 p-3.5 rounded-xl">
                        {skills.map((s) => {
                          const details = skillDetails[s] || { proficiency: 3, type: 'technical' };
                          
                          // Color mapping
                          let badgeStyle = 'bg-blue-500/10 text-blue-300 border-blue-500/20';
                          if (details.type === 'soft') badgeStyle = 'bg-purple-500/10 text-purple-300 border-purple-500/20';
                          else if (details.type === 'domain') badgeStyle = 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20';

                          return (
                            <div 
                              key={s}
                              onMouseEnter={() => setHoveredSkill(s)}
                              onMouseLeave={() => setHoveredSkill(null)}
                              className={`p-3 rounded-lg border border-white/5 bg-slate-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all duration-200 ${
                                hoveredSkill === s ? 'border-purple-500/30 bg-purple-950/5 shadow-[0_0_8px_rgba(168,85,247,0.1)]' : ''
                              }`}
                            >
                              {/* Left details */}
                              <div className="flex items-center justify-between sm:justify-start gap-2.5 shrink-0">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badgeStyle} w-24 text-center shrink-0`}>
                                  {s}
                                </span>
                                
                                <span className="text-[9px] font-bold text-slate-500 uppercase shrink-0">
                                  {details.proficiency >= 4 ? 'Strong' : details.proficiency >= 3 ? 'Intermediate' : 'Learning'}
                                </span>
                              </div>

                              {/* Interactive controls */}
                              <div className="flex items-center justify-between sm:justify-end gap-3 flex-1">
                                {/* Proficiency Slider */}
                                <div className="flex items-center gap-1.5 flex-1 max-w-[120px]">
                                  <input 
                                    type="range" 
                                    min="1" 
                                    max="5" 
                                    value={details.proficiency}
                                    onChange={(e) => {
                                      const val = parseInt(e.target.value);
                                      setSkillDetails(prev => ({
                                        ...prev,
                                        [s]: { ...details, proficiency: val }
                                      }));
                                    }}
                                    disabled={!isEditMode}
                                    className="w-full accent-purple-500 h-1 bg-slate-800 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                  />
                                  <span className="text-[10px] font-bold text-white font-mono w-3.5 text-right">{details.proficiency}</span>
                                </div>

                                {/* Type selector */}
                                <select
                                  value={details.type}
                                  onChange={(e) => {
                                    const val = e.target.value as 'technical' | 'soft' | 'domain';
                                    setSkillDetails(prev => ({
                                      ...prev,
                                      [s]: { ...details, type: val }
                                    }));
                                  }}
                                  disabled={!isEditMode}
                                  className="bg-black border border-white/10 rounded px-1.5 py-0.5 text-[9px] font-bold text-slate-300 focus:outline-none focus:border-purple-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <option value="technical">Technical</option>
                                  <option value="soft">Soft</option>
                                  <option value="domain">Domain</option>
                                </select>

                                {/* Delete skill button */}
                                {isEditMode && (
                                  <button 
                                    onClick={() => handleRemoveSkill(s)}
                                    className="p-1 rounded bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/10 text-rose-455 transition"
                                    title="Delete skill"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Add new skill form */}
                      {isEditMode && (
                        <div className="flex gap-2 pt-1 font-inter">
                          <input
                            type="text"
                            value={newSkillInput}
                            onChange={(e) => setNewSkillInput(e.target.value)}
                            placeholder="Add skill (e.g. Three.js)..."
                            className="flex-1 px-3 py-2 bg-black border border-white/10 rounded-xl text-white text-[10px] focus:outline-none focus:border-purple-500/40"
                          />
                          <button
                            type="button"
                            onClick={handleAddSkill}
                            className="px-4 py-2 rounded-xl bg-purple-650 hover:bg-purple-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                </div>

                {/* Target Companies & Verified Connections */}
                <div className="p-6 rounded-2xl border border-white/5 bg-[#08080b]/90 space-y-4 shadow-[0_4px_25px_rgba(0,0,0,0.4)]">
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <h4 className="font-sora text-white text-xs font-bold uppercase tracking-wider font-space-grotesk flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-purple-400" />
                      Target Companies & Connections
                    </h4>
                  </div>
                  
                  {/* Editable target companies list */}
                  <div className="flex flex-wrap gap-2 min-h-[40px] content-start">
                    {targetCompanies.map((c) => (
                      <span 
                        key={c} 
                        className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px] font-bold tracking-wide flex items-center gap-1.5 hover:border-purple-500/40 transition-colors"
                      >
                        {c}
                        {isEditMode && (
                          <button 
                            onClick={() => handleRemoveCompany(c)} 
                            className="hover:text-red-400 transition text-xs font-bold font-mono ml-0.5 text-slate-400"
                          >
                            ×
                          </button>
                        )}
                      </span>
                    ))}
                  </div>

                  {isEditMode && (
                    <div className="flex gap-2 pt-2">
                      <input
                        type="text"
                        value={newCompanyInput}
                        onChange={(e) => setNewCompanyInput(e.target.value)}
                        placeholder="Add company (e.g. Meta)..."
                        className="flex-1 px-3 py-2 bg-black border border-white/10 rounded-xl text-white text-[10px] focus:outline-none focus:border-purple-500/40"
                      />
                      <button
                        type="button"
                        onClick={handleAddCompany}
                        className="px-4 py-2 rounded-xl bg-purple-650 hover:bg-purple-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Verified Connections */}
                  <div className="pt-2 border-t border-white/5 space-y-2">
                    <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider font-space-grotesk">Verified Network Alumni Coverage</span>
                    {[
                      { name: 'Google', count: 14, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
                      { name: 'Microsoft', count: 8, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
                      { name: 'Amazon', count: 12, color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' }
                    ].map((comp) => (
                      <div 
                        key={comp.name}
                        className="flex items-center justify-between p-2 rounded-xl bg-slate-950/20 border border-white/5"
                      >
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${comp.color}`}>
                          {comp.name}
                        </span>
                        <span className="text-[9px] text-slate-400 font-semibold font-space-grotesk">
                          {comp.count} Alumni verified
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* 6. BOTTOM TELEMETRY GRID: 4 DETAILED TRACKING/INSIGHTS CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Card 1: Active Referrals Trackers */}
                <div className="p-6 rounded-2xl border border-white/5 bg-[#08080b]/90 space-y-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <h4 className="font-sora text-white text-xs font-bold uppercase tracking-wider font-space-grotesk flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-purple-400" />
                      Active Referrals Trackers
                    </h4>
                  </div>
                  
                  <div className="space-y-3">
                    {/* Item 1 */}
                    <div className="p-3 rounded-xl bg-slate-950/30 border border-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-white">Google — SWE Intern</span>
                        <span className="px-2 py-0.5 rounded-full text-[8px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                          Interview (3/4)
                        </span>
                      </div>
                      
                      {/* Stepper bar */}
                      <div className="grid grid-cols-4 gap-1.5 h-1.5">
                        <div className="bg-purple-500 rounded-full" />
                        <div className="bg-purple-500 rounded-full" />
                        <div className="bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.6)] animate-pulse" />
                        <div className="bg-slate-800 rounded-full" />
                      </div>
                      <div className="flex justify-between text-[8px] text-slate-500 font-bold uppercase tracking-wider mt-1.5 font-space-grotesk">
                        <span>Outreach</span>
                        <span>Review</span>
                        <span className="text-purple-400">Referred</span>
                        <span>Interview</span>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="p-3 rounded-xl bg-slate-950/30 border border-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-white">Microsoft — PM Intern</span>
                        <span className="px-2 py-0.5 rounded-full text-[8px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          Review (2/4)
                        </span>
                      </div>
                      
                      {/* Stepper bar */}
                      <div className="grid grid-cols-4 gap-1.5 h-1.5">
                        <div className="bg-amber-500 rounded-full" />
                        <div className="bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.6)] animate-pulse" />
                        <div className="bg-slate-800 rounded-full" />
                        <div className="bg-slate-800 rounded-full" />
                      </div>
                      <div className="flex justify-between text-[8px] text-slate-500 font-bold uppercase tracking-wider mt-1.5 font-space-grotesk">
                        <span>Outreach</span>
                        <span className="text-amber-400">Review</span>
                        <span>Referred</span>
                        <span>Interview</span>
                      </div>
                    </div>
                  </div>

                  {/* SVG Line Sparkline for Referral pipeline index */}
                  <div className="pt-2 border-t border-white/5">
                    <span className="block text-[8px] font-bold text-slate-550 uppercase tracking-wider mb-2 font-space-grotesk">Referral Velocity Index (30d)</span>
                    <div className="h-16 w-full bg-slate-950/30 rounded-xl overflow-hidden relative border border-white/5 flex items-center justify-center p-1">
                      <svg className="w-full h-full" viewBox="0 0 300 60" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="glow-area-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#9333EA" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#9333EA" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        {/* Area Gradient */}
                        <path 
                          d="M0,50 L20,48 L40,55 L60,40 L80,45 L100,32 L120,38 L140,25 L160,28 L180,12 L200,18 L220,5 L240,10 L260,3 L280,2 L300,2 L300,60 L0,60 Z" 
                          fill="url(#glow-area-grad)" 
                        />
                        {/* Line glow */}
                        <path 
                          d="M0,50 L20,48 L40,55 L60,40 L80,45 L100,32 L120,38 L140,25 L160,28 L180,12 L200,18 L220,5 L240,10 L260,3 L280,2 L300,2" 
                          fill="none" 
                          stroke="#a855f7" 
                          strokeWidth="2" 
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute top-1.5 right-2 px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 text-[7px] font-bold text-purple-400 rounded animate-pulse">
                        High Speed ⚡
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 2: Match History Insights */}
                <div className="p-6 rounded-2xl border border-white/5 bg-[#08080b]/90 space-y-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <h4 className="font-sora text-white text-xs font-bold uppercase tracking-wider font-space-grotesk flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-purple-400" />
                      Match History Insights
                    </h4>
                  </div>
                  
                  <div className="space-y-3.5 py-1">
                    {/* Item 1 */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-medium">Technical credentials matching</span>
                        <span className="font-bold text-blue-400 font-mono">95%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5 relative">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full" 
                          style={{ width: '95%' }}
                        />
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-medium">College alumni network overlap</span>
                        <span className="font-bold text-purple-400 font-mono">90%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5 relative">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full" 
                          style={{ width: '90%' }}
                        />
                      </div>
                    </div>

                    {/* Item 3 */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-medium">Project and domain relevance</span>
                        <span className="font-bold text-emerald-400 font-mono">92%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5 relative">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full" 
                          style={{ width: '92%' }}
                        />
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 leading-relaxed font-medium bg-purple-500/5 p-3 rounded-xl border border-purple-500/10">
                    💡 **AI recommendation**: Link another ML project validation to raise matching alignment with Google and Meta pipelines to 98%.
                  </p>
                </div>

                {/* Card 3: Connection Scorecard (Spider chart) */}
                <div className="p-6 rounded-2xl border border-white/5 bg-[#08080b]/90 space-y-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <h4 className="font-sora text-white text-xs font-bold uppercase tracking-wider font-space-grotesk flex items-center gap-1.5">
                      <Network className="w-4 h-4 text-purple-400" />
                      Connection Scorecard
                    </h4>
                  </div>
                  
                  {/* Real mathematical SVG Radar Chart */}
                  <div className="flex items-center justify-center p-1">
                    <div className="relative">
                      <svg className="w-[170px] h-[160px]" viewBox="0 0 160 140">
                        {/* Outer background Pentagram Web Grid */}
                        <polygon points="80,15 137,56 115,124 45,124 23,56" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                        <polygon points="80,35 123,66 106,111 54,111 37,66" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                        <polygon points="80,55 109,76 98,99 62,99 51,76" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                        
                        {/* Grid axes lines */}
                        <line x1="80" y1="75" x2="80" y2="15" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                        <line x1="80" y1="75" x2="137" y2="56" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                        <line x1="80" y1="75" x2="115" y2="124" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                        <line x1="80" y1="75" x2="45" y2="124" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                        <line x1="80" y1="75" x2="23" y2="56" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                        
                        {/* Radar polygon representing the stats values */}
                        <polygon 
                          points="80,26 123,60 105,109 49,116 34,60" 
                          fill="rgba(168,85,247,0.25)" 
                          stroke="rgb(168,85,247)" 
                          strokeWidth="2" 
                        />
                        
                        {/* Point nodes */}
                        <circle cx="80" cy="26" r="3" fill="#a855f7" />
                        <circle cx="123" cy="60" r="3" fill="#a855f7" />
                        <circle cx="105" cy="109" r="3" fill="#a855f7" />
                        <circle cx="49" cy="116" r="3" fill="#a855f7" />
                        <circle cx="34" cy="60" r="3" fill="#a855f7" />
                      </svg>
                      
                      {/* Anchor text labels around the SVG */}
                      <span className="absolute top-[3px] left-[61px] text-[8px] text-slate-400 font-bold uppercase tracking-wider font-space-grotesk">Response</span>
                      <span className="absolute top-[48px] -right-[15px] text-[8px] text-slate-400 font-bold uppercase tracking-wider font-space-grotesk">Acceptance</span>
                      <span className="absolute bottom-[2px] right-[5px] text-[8px] text-slate-400 font-bold uppercase tracking-wider font-space-grotesk">Completeness</span>
                      <span className="absolute bottom-[2px] left-[5px] text-[8px] text-slate-400 font-bold uppercase tracking-wider font-space-grotesk">Projects</span>
                      <span className="absolute top-[48px] -left-[18px] text-[8px] text-slate-400 font-bold uppercase tracking-wider font-space-grotesk">Outreach</span>
                    </div>
                  </div>
                </div>

                {/* Card 4: Security/privacy controls */}
                <div className="p-6 rounded-2xl border border-white/5 bg-[#08080b]/90 space-y-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <h4 className="font-sora text-white text-xs font-bold uppercase tracking-wider font-space-grotesk flex items-center gap-1.5">
                      <Lock className="w-4 h-4 text-purple-400" />
                      Security & Privacy Controls
                    </h4>
                  </div>
                  
                  <div className="space-y-4 font-inter">
                    {/* Control 1 */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="block text-xs font-bold text-white">Trust Privacy Scope</span>
                        <span className="block text-[9px] text-slate-500 mt-0.5">Restrict profile scope to matching graduates</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-slate-400 font-semibold">
                          {privacyCollegeOnly ? `Only ${profileCollege}` : 'All Alumni'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setPrivacyCollegeOnly(!privacyCollegeOnly)}
                          className={`w-9 h-5 rounded-full flex items-center transition-colors p-0.5 ${
                            privacyCollegeOnly ? 'bg-purple-650' : 'bg-slate-800'
                          }`}
                        >
                          <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                            privacyCollegeOnly ? 'translate-x-4' : 'translate-x-0'
                          }`} />
                        </button>
                      </div>
                    </div>

                    {/* Control 2 */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="block text-xs font-bold text-white">Incognito Search Mode</span>
                        <span className="block text-[9px] text-slate-500 mt-0.5">Hide your profile from non-alumni matching catalogs</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          className="w-9 h-5 rounded-full flex items-center transition-colors p-0.5 bg-slate-800"
                        >
                          <div className="bg-white w-4 h-4 rounded-full shadow-md transform transition-transform translate-x-0" />
                        </button>
                      </div>
                    </div>

                    {/* Control 3 */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="block text-xs font-bold text-white">Direct Corporate Bypass</span>
                        <span className="block text-[9px] text-slate-500 mt-0.5">Automatch credentials directly to verified recruiters</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          className="w-9 h-5 rounded-full flex items-center transition-colors p-0.5 bg-purple-650"
                        >
                          <div className="bg-white w-4 h-4 rounded-full shadow-md transform transition-transform translate-x-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* 7. MINOR SETTINGS ACTION PILLS */}
              <div className="pt-4 border-t border-white/5 flex flex-wrap gap-3 items-center justify-center select-none font-space-grotesk">
                <button 
                  onClick={() => alert("Verification portal initializing... Upload document in settings drawer.")}
                  className="px-4 py-2 rounded-full border border-white/10 hover:border-purple-500/30 bg-[#08080b]/80 hover:bg-purple-950/20 text-[9px] font-bold uppercase tracking-wider text-slate-350 hover:text-white transition flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <Fingerprint className="w-3.5 h-3.5 text-purple-400" />
                  Verify your identity
                </button>

                <button 
                  onClick={() => alert("Credentials manager open: syncing GitHub integrations.")}
                  className="px-4 py-2 rounded-full border border-white/10 hover:border-purple-500/30 bg-[#08080b]/80 hover:bg-purple-950/20 text-[9px] font-bold uppercase tracking-wider text-slate-350 hover:text-white transition flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <Settings className="w-3.5 h-3.5 text-blue-400" />
                  Manage credentials
                </button>

                <button 
                  onClick={() => alert("Mentoring request sent to admissions board.")}
                  className="px-4 py-2 rounded-full border border-white/10 hover:border-purple-500/30 bg-[#08080b]/80 hover:bg-purple-950/20 text-[9px] font-bold uppercase tracking-wider text-slate-350 hover:text-white transition flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  Request mentoring
                </button>

                <button 
                  onClick={() => alert("Referral queue status: 2 matches checking.")}
                  className="px-4 py-2 rounded-full border border-white/10 hover:border-purple-500/30 bg-[#08080b]/80 hover:bg-purple-950/20 text-[9px] font-bold uppercase tracking-wider text-slate-350 hover:text-white transition flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                  Referral queue
                </button>
              </div>

              {/* Bio & Resume File details */}
              <div className="p-6 rounded-2xl border border-white/5 bg-[#08080b]/90 space-y-5 shadow-[0_4px_25px_rgba(0,0,0,0.4)]">
                <div>
                  <h4 className="font-sora text-white text-xs font-bold uppercase tracking-wider pb-2 border-b border-white/5 mb-3 font-space-grotesk">Professional Bio</h4>
                  {isEditMode ? (
                    <div>
                      <textarea
                        rows={3}
                        value={bio}
                        onChange={(e) => {
                          if (e.target.value.length <= 100) {
                            setBio(e.target.value);
                          }
                        }}
                        className="w-full p-4 bg-black border border-white/10 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
                        maxLength={100}
                      />
                      <span className="block text-[9px] text-slate-500 mt-1">Character count: {bio.length}/100 max</span>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-350 leading-relaxed font-medium italic">
                      "{bio}"
                    </p>
                  )}
                </div>

                <div id="resume-section" className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <h4 className="font-sora text-white text-xs font-bold uppercase tracking-wider font-space-grotesk flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-rose-500" />
                      Resume Portfolio
                    </h4>
                    <span className="text-[9px] font-bold text-slate-500 font-mono">
                      Stored Profiles: {resumesHistory.length}
                    </span>
                  </div>

                  {uploadStatus && (
                    <div className={`p-3 py-2.5 rounded-xl border text-[10px] leading-relaxed font-semibold transition-all duration-300 flex items-center justify-between gap-3 animate-fade-in ${
                      uploadStatus.type === 'success' 
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                        : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                    }`}>
                      <span>{uploadStatus.message}</span>
                      <button 
                        type="button"
                        onClick={() => setUploadStatus(null)} 
                        className="text-[9px] opacity-75 hover:opacity-100 uppercase tracking-wider font-bold"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Left: Active Showcase & Upload Area */}
                    <div className="md:col-span-7 space-y-4">
                      {/* Active Showcase */}
                      <div className="p-4 rounded-xl border border-purple-500/15 bg-slate-950/40 flex items-center justify-between gap-4 relative overflow-hidden group hover:border-purple-500/30 transition-all duration-300">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/5 rounded-full blur-xl pointer-events-none" />
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-rose-500/10 rounded-xl border border-rose-500/20 animate-pulse">
                            <FileText className="w-6 h-6 text-rose-500" />
                          </div>
                          <div>
                            <span className="block font-bold text-white text-xs truncate max-w-[200px] sm:max-w-[280px]" title={resumeName}>
                              {resumeName}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[8px] text-slate-500">
                                {resumesHistory.find(r => r.name === resumeName)?.size || '1.2 MB'}
                              </span>
                              <span className="text-slate-700 text-[8px]">·</span>
                              <span className="text-[8px] text-slate-500">
                                {resumesHistory.find(r => r.name === resumeName)?.uploadedAt || '3 days ago'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-450 animate-ping" />
                            Active
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setUploadStatus({
                                type: 'success',
                                message: `Opening encrypted document download stream for "${resumeName}"...`
                              });
                              setTimeout(() => setUploadStatus(null), 3000);
                            }}
                            className="p-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-slate-300 transition"
                            title="Download Active Resume"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Interactive Drag & Drop Upload Zone */}
                      <div 
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`p-6 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 min-h-[140px] select-none ${
                          dragActive 
                            ? 'border-purple-500 bg-purple-950/15 shadow-[0_0_15px_rgba(168,85,247,0.1)]' 
                            : 'border-white/10 hover:border-purple-500/30 bg-slate-950/20'
                        }`}
                      >
                        <input 
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept=".pdf,.docx,.doc"
                          className="hidden"
                        />
                        <UploadCloud className={`w-8 h-8 mb-2 transition-transform duration-300 ${dragActive ? 'scale-110 text-purple-400' : 'text-slate-500 group-hover:scale-105'}`} />
                        <span className="block text-xs font-bold text-white leading-relaxed">
                          {dragActive ? 'Drop your resume here' : 'Drag & drop your resume, or click to browse'}
                        </span>
                        <span className="block text-[9px] text-slate-500 mt-1 font-semibold">
                          PDF, DOCX, or DOC formats up to 5MB
                        </span>
                      </div>
                    </div>

                    {/* Right: Upload History List */}
                    <div className="md:col-span-5 p-4 rounded-xl border border-white/5 bg-slate-950/20 flex flex-col justify-between min-h-[296px] h-full">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
                          <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider font-space-grotesk">Uploaded Resumes History</span>
                          <span className="text-[8px] font-bold text-purple-400 bg-purple-500/10 px-1.5 py-0.2 rounded">Unlimited updates</span>
                        </div>

                        <div className="max-h-[210px] overflow-y-auto space-y-2 pr-1 no-scrollbar">
                          {resumesHistory.map((item) => {
                            const isActive = item.name === resumeName;
                            return (
                              <div 
                                key={item.id}
                                className={`p-2.5 rounded-lg border transition-all duration-200 flex items-center justify-between gap-3 ${
                                  isActive 
                                    ? 'border-purple-500/20 bg-purple-950/5' 
                                    : 'border-white/5 bg-slate-900/30 hover:border-white/10 hover:bg-slate-900/50'
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <FileText className={`w-4 h-4 shrink-0 ${isActive ? 'text-rose-500' : 'text-slate-600'}`} />
                                  <div className="min-w-0">
                                    <span 
                                      className={`block text-[10px] font-bold truncate max-w-[130px] sm:max-w-[180px] ${isActive ? 'text-white' : 'text-slate-350'}`}
                                      title={item.name}
                                    >
                                      {item.name}
                                    </span>
                                    <span className="block text-[7.5px] text-slate-500 mt-0.5 font-medium">
                                      {item.size} · {item.uploadedAt}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                  {isActive ? (
                                    <span className="p-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                      <Check className="w-3 h-3" />
                                    </span>
                                  ) : (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() => handleActivateResume(item.name)}
                                        className="px-2 py-0.5 rounded text-[8px] font-bold bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-400 uppercase tracking-wider transition"
                                      >
                                        Use
                                      </button>
                                      <button
                                        type="button"
                                        onClick={(e) => handleDeleteResume(item.id, e)}
                                        className="p-1 rounded bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/10 text-rose-450 transition"
                                        title="Delete resume"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="pt-2 border-t border-white/5 mt-3 text-center">
                        <span className="text-[7.5px] text-slate-500 leading-relaxed font-semibold italic font-space-grotesk">
                          * Keep multiple resumes tailored for different target roles (e.g. Frontend vs ML).
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Portfolio Links */}
                <div>
                  <h4 className="font-sora text-white text-xs font-bold uppercase tracking-wider pb-2 border-b border-white/5 mb-3 font-space-grotesk">Portfolio Links</h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider mb-1 font-space-grotesk">GitHub URL</span>
                      {isEditMode ? (
                        <input
                          type="text"
                          value={githubUrl}
                          onChange={(e) => setGithubUrl(e.target.value)}
                          className="w-full px-4 py-2 bg-black border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500/40"
                        />
                      ) : (
                        <a href={githubUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-purple-400 hover:underline">{githubUrl}</a>
                      )}
                    </div>

                    <div>
                      <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider mb-1 font-space-grotesk">LinkedIn URL</span>
                      {isEditMode ? (
                        <input
                          type="text"
                          value={linkedinUrl}
                          onChange={(e) => setLinkedinUrl(e.target.value)}
                          className="w-full px-4 py-2 bg-black border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500/40"
                        />
                      ) : (
                        <a href={linkedinUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-purple-400 hover:underline">{linkedinUrl}</a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Mode Save Button */}
              {isEditMode && (
                <div className="flex justify-end pt-4 font-sora">
                  <button
                    type="button"
                    onClick={() => setIsEditMode(false)}
                    className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-650 hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition active:scale-95"
                  >
                    Save Changes
                  </button>
                </div>
              )}

            </div>
  );
};
