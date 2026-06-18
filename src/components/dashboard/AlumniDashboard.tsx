import React, { useState, useEffect } from 'react';
import {
  BarChart2, Bookmark, CheckCircle, Clock, FileText,
  Home, LogOut, MessageSquare, ShieldCheck, TrendingUp,
  UserCheck, Users, XCircle, Send, Bell, Star,
  ChevronRight, Activity, Award, Zap, Settings, Briefcase,
  Sparkles, Filter, Trash2, Plus, ChevronDown, X, Download
} from 'lucide-react';
import { MessagesTab } from './MessagesTab.js';

interface AlumniDashboardProps {
  college: string;
  company: string;
  handleAction: (id: number, action: 'referred' | 'info' | 'declined') => void;
  name: string;
  onLogout: () => void;
  referralsSentCount: number;
  requests: any[];
  activeChatId: number | null;
  setActiveChatId: (id: number | null) => void;
  chatMessages: { [key: number]: any[] };
  newMessageText: string;
  setNewMessageText: (text: string) => void;
  handleSendMessage: () => void;
  isSchedulerOpen: boolean;
  setIsSchedulerOpen: (open: boolean) => void;
  scheduledDate: string;
  setScheduledDate: (date: string) => void;
  scheduledTime: string;
  setScheduledTime: (time: string) => void;
  handleScheduleCall: () => void;
  conversations: any[];
  alumniNetwork: any[];
}

type AlumniTab = 'overview' | 'inbox' | 'my_referrals' | 'messages' | 'analytics' | 'accounting' | 'profile';

export const AlumniDashboard: React.FC<AlumniDashboardProps> = ({
  college,
  company,
  handleAction,
  name,
  onLogout,
  referralsSentCount,
  requests,
  activeChatId,
  setActiveChatId,
  chatMessages,
  newMessageText,
  setNewMessageText,
  handleSendMessage,
  isSchedulerOpen,
  setIsSchedulerOpen,
  scheduledDate,
  setScheduledDate,
  scheduledTime,
  setScheduledTime,
  handleScheduleCall,
  conversations,
  alumniNetwork
}) => {
  const [activeTab, setActiveTab] = useState<AlumniTab>(() => {
    const savedTab = localStorage.getItem('alumniActiveTab');
    return (savedTab as AlumniTab) || 'overview';
  });

  useEffect(() => {
    localStorage.setItem('alumniActiveTab', activeTab);
  }, [activeTab]);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  // Helper functions for candidate college tier mapping
  const getCandidateCollege = (req: any) => {
    if (req.college) return req.college;
    if (req.class) {
      const parts = req.class.split(',');
      if (parts.length > 1) return parts[parts.length - 1].trim();
      return req.class;
    }
    return "Unknown College";
  };

  const getCollegeTier = (collegeName: string): 'Top-tier' | 'State' | 'Private' => {
    const c = collegeName.toLowerCase();
    if (c.includes('iit') || c.includes('nit') || c.includes('bits') || c.includes('pilani') || c.includes('dtu') || c.includes('delhi technological') || c.includes('iiit') || c.includes('nsut') || c.includes('rvce')) {
      return 'Top-tier';
    }
    if (c.includes('university') || c.includes('state') || c.includes('government') || c.includes('coep') || c.includes('vjti')) {
      return 'State';
    }
    return 'Private';
  };

  // Local state for requests, fallback to mock if DB is empty
  const [localRequests, setLocalRequests] = useState<any[]>(() => {
    const defaults = [
      {
        id: 101,
        studentName: "Arjun Sharma",
        college: "IIT Bombay",
        class: "CSE Junior, IIT Bombay",
        company: company,
        role: "Software Engineer Intern",
        score: "94%",
        message: "Hi! I saw your profile and noticed you also graduated from IIT Bombay. I'm really interested in the SWE Intern roles at Google and would love to get a referral or some feedback on my projects, especially my work on distributed system simulations. Thanks!",
        status: "pending",
      },
      {
        id: 102,
        studentName: "Priya Rao",
        college: "BITS Pilani",
        class: "EEE Senior, BITS Pilani",
        company: company,
        role: "Associate Product Manager",
        score: "89%",
        message: "Hello! I am a senior at BITS Pilani transitioning to Product Management. I have built 2 products during my internships and would appreciate a referral for the APM role at Google. My resume highlights my user research and product metrics work.",
        status: "pending",
      },
      {
        id: 103,
        studentName: "Rohan Das",
        college: "Delhi Technological University",
        class: "IT Senior, Delhi Technological University",
        company: company,
        role: "Software Engineer",
        score: "92%",
        message: "Hello sir, I have 3 internships in Full Stack development and a 9.1 CGPA. I'm looking for a referral for the full-time SWE position. I've optimized databases and built React projects that handle 10k+ active users.",
        status: "pending",
      },
      {
        id: 104,
        studentName: "Sneha Reddy",
        college: "Vellore Institute of Technology",
        class: "CSE Junior, Vellore Institute of Technology",
        company: company,
        role: "Data Scientist Intern",
        score: "87%",
        message: "Hi! I am working on deep learning for computer vision and have published a paper in a student journal. I'd love to apply for the Data Science Intern role. Although I am from VIT, I believe my research profile is a strong match for Google's ML team.",
        status: "pending",
      },
      {
        id: 105,
        studentName: "Karan Johar",
        college: "Mumbai University",
        class: "IT Junior, Mumbai University",
        company: company,
        role: "Software Engineer Intern",
        score: "78%",
        message: "Hey, looking for a referral to Google for SWE role. Check out my resume.",
        status: "pending",
      }
    ];

    if (requests && requests.length > 0) {
      const merged = [...requests];
      defaults.forEach(def => {
        if (!merged.some(r => r.studentName === def.studentName)) {
          merged.push(def);
        }
      });
      return merged;
    }
    return defaults;
  });

  // Local tab filters
  const [inboxFilter, setInboxFilter] = useState<'All' | 'Pending' | 'Referred' | 'Info' | 'Declined'>('Pending');
  const [previewingResume, setPreviewingResume] = useState<{ seekerId: number; resumeName: string; studentName: string } | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isLoadingFile, setIsLoadingFile] = useState(false);

  const handleViewResume = async (seekerId: number, resumeName: string, studentName: string) => {
    setIsLoadingFile(true);
    setPreviewingResume({ seekerId, resumeName, studentName });
    
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
      setFileUrl(null);
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/users/resume/download/${seekerId}/${encodeURIComponent(resumeName)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const blob = await res.blob();
        const objectUrl = URL.createObjectURL(blob);
        setFileUrl(objectUrl);
      } else {
        console.error("Failed to load resume file from backend.");
      }
    } catch (err) {
      console.error("Error fetching resume:", err);
    } finally {
      setIsLoadingFile(false);
    }
  };

  const handleClosePreview = () => {
    setPreviewingResume(null);
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
      setFileUrl(null);
    }
  };
  const [collegeTierFilter, setCollegeTierFilter] = useState<'All' | 'Top-tier' | 'State' | 'Private'>('All');
  const [declineReasonOpenId, setDeclineReasonOpenId] = useState<number | null>(null);

  // Accounting tab settings
  const [monthlyLimit, setMonthlyLimit] = useState<number>(10);
  const [visibilityFilter, setVisibilityFilter] = useState<string>('all'); // 'all', 'tier', 'own'
  const [savedTemplates, setSavedTemplates] = useState<string[]>([
    "Hi [Candidate Name], I reviewed your profile and projects. I would be happy to refer you for the role! Let's schedule a call to sync.",
    "Hi [Candidate Name], thanks for reaching out. Your projects are impressive, but I recommend adding more detail to your experience section before I submit the referral.",
    "Hi [Candidate Name], could you please share your GitHub repositories and any live demo links? I want to see your actual implementation before moving forward."
  ]);
  const [newTemplateText, setNewTemplateText] = useState('');
  const [isAddingTemplate, setIsAddingTemplate] = useState(false);

  // Wrap handler
  const onHandleAction = (id: number, action: 'referred' | 'info' | 'declined') => {
    handleAction(id, action);
    setLocalRequests(prev => prev.map(r => r.id === id ? { ...r, status: action } : r));
  };

  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const pendingCount = localRequests.filter(r => r.status === 'pending').length;
  const referredCount = localRequests.filter(r => r.status === 'referred').length;

  const sidebarItems: { id: AlumniTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'overview',     label: 'Overview',     icon: Home },
    { id: 'inbox',        label: 'Inbox',        icon: Users,        badge: pendingCount },
    { id: 'my_referrals', label: 'My Referrals', icon: Briefcase },
    { id: 'messages',     label: 'Messages',     icon: MessageSquare },
    { id: 'analytics',    label: 'Analytics',    icon: BarChart2 },
    { id: 'accounting',   label: 'Accounting',   icon: Settings },
  ];

  return (
    <section className="min-h-screen w-full bg-[#07070a] text-slate-100 flex relative overflow-hidden font-inter select-none">

      {/* ── Sidebar ── */}
      <aside className="hidden md:flex w-[240px] bg-[#08080d]/95 border-r border-white/[0.055] flex-col shrink-0 relative z-30 backdrop-blur-xl">
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-emerald-950/10 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-emerald-950/5 to-transparent pointer-events-none" />
        
        {/* Brand Header */}
        <div className="px-5 pt-6 pb-5 border-b border-white/[0.055] shrink-0 relative z-10">
          <div className="flex flex-col select-none">
            <span className="font-space-grotesk font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF1E3C] to-[#1E40FF] text-base tracking-tight leading-none block">
              NextInCampus
            </span>
            <span className="text-[9px] font-bold text-emerald-400/80 uppercase tracking-widest mt-2 block">
              Alumni Portal
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-3 py-5 relative z-10">
          <span className="block text-[8px] font-bold text-slate-700 uppercase tracking-widest px-3 mb-2.5">Navigation</span>
          <nav className="space-y-0.5">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600/10 to-teal-500/10 border border-white/[0.055] text-white shadow-[0_0_12px_rgba(16,185,129,0.05)]'
                      : 'text-slate-500 hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[8px] font-bold flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom profile + logout */}
        <div className="px-3 pb-5 border-t border-white/[0.055] pt-4 relative z-10 space-y-0.5">
          <span className="block text-[8px] font-bold text-slate-700 uppercase tracking-widest px-3 mb-2.5">Account</span>
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group relative ${
              activeTab === 'profile' ? 'bg-emerald-500/10 text-white' : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.03]'
            }`}
          >
            {activeTab === 'profile' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-r-full" />}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-[10px] font-black uppercase shadow-md">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <span className="block text-xs font-bold text-white truncate leading-tight">{name}</span>
              <span className="block text-[9px] text-emerald-400/70 font-medium">Alumni Mentor</span>
            </div>
          </button>
          
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-slate-600 hover:text-rose-400 hover:bg-rose-500/5 transition-all duration-200 group"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:bg-rose-500/10 transition-all">
              <LogOut className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── Mobile Bottom Bar ── */}
      <aside className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#07070a]/95 border-t border-white/5 flex items-center justify-around z-40 px-3 backdrop-blur-md">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                isActive ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'text-slate-500'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[7px] font-bold flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 h-screen overflow-y-auto no-scrollbar pb-24 md:pb-8 flex flex-col relative z-20">

        {/* Top header bar */}
        <header className="px-6 md:px-8 py-5 border-b border-white/5 bg-black/40 backdrop-blur-sm flex items-center justify-between shrink-0">
          <div>
            <h2 className="font-sora text-white text-base font-extrabold flex items-center gap-2">
              {activeTab === 'overview'     && 'Alumni Overview'}
              {activeTab === 'inbox'        && 'Candidate Inbox'}
              {activeTab === 'my_referrals' && 'My Referrals'}
              {activeTab === 'messages'     && 'Messages'}
              {activeTab === 'analytics'    && 'Impact Analytics'}
              {activeTab === 'accounting'   && 'Accounting'}
              {activeTab === 'profile'      && 'My Profile'}
            </h2>
            <p className="text-[10px] text-slate-500 mt-0.5 font-medium">{company} · Verified Alumni Mentor</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button type="button" className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white transition">
                <Bell className="w-4 h-4" />
              </button>
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[8px] font-bold flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-3 h-3" />
              Verified Alumni
            </span>
          </div>
        </header>

        {/* Tab content */}
        <div className="flex-1 p-6 md:p-8">

          {/* ══════════════════════════════
              OVERVIEW TAB
          ══════════════════════════════ */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fade-in-up text-left">

              {/* Welcome banner */}
              <div className="relative rounded-2xl overflow-hidden border border-white/5 bg-gradient-to-br from-emerald-950/30 via-[#07070a] to-blue-950/20 p-6 md:p-8">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white text-sm font-black shadow-lg">
                        {initials}
                      </div>
                      <div>
                        <h1 className="font-sora text-xl font-extrabold text-white">Good morning, {name.split(' ')[0]} 👋</h1>
                        <p className="text-[11px] text-slate-400 font-medium">{college} · {company}</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-md">
                      You have <span className="text-emerald-400 font-bold">{pendingCount} pending request{pendingCount !== 1 ? 's' : ''}</span> from talented juniors. Your referrals have helped {referredCount} candidates land interviews.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('inbox')}
                    className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-sora font-bold text-xs uppercase tracking-wider shadow-lg hover:opacity-90 transition"
                  >
                    Review Requests
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Metrics row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Referrals', value: referralsSentCount, sub: '+3 this month', icon: Send, color: 'emerald', glow: 'rgba(16,185,129,0.15)' },
                  { label: 'Interviews Secured', value: 12, sub: '42.8% conversion', icon: TrendingUp, color: 'blue', glow: 'rgba(59,130,246,0.15)' },
                  { label: 'Pending Queue', value: pendingCount, sub: 'Needs your review', icon: Clock, color: 'amber', glow: 'rgba(245,158,11,0.15)' },
                  { label: 'Success Rate', value: '86%', sub: 'Above platform avg', icon: Award, color: 'purple', glow: 'rgba(168,85,247,0.15)' },
                ].map((metric) => {
                  const Icon = metric.icon;
                  const colorMap: Record<string, { text: string; bg: string; border: string }> = {
                    emerald: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
                    blue:    { text: 'text-blue-400',    bg: 'bg-blue-500/10',    border: 'border-blue-500/20' },
                    amber:   { text: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/20' },
                    purple:  { text: 'text-purple-400',  bg: 'bg-purple-500/10',  border: 'border-purple-500/20' },
                  };
                  const c = colorMap[metric.color];
                  return (
                    <div key={metric.label} className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md text-left group hover:border-white/10 transition-all duration-300 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl pointer-events-none" style={{ background: metric.glow }} />
                      <div className={`w-9 h-9 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center mb-4`}>
                        <Icon className={`w-4 h-4 ${c.text}`} />
                      </div>
                      <span className="block font-sora text-2xl font-extrabold text-white">{metric.value}</span>
                      <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-1">{metric.label}</span>
                      <span className={`block text-[10px] font-semibold mt-0.5 ${c.text}`}>{metric.sub}</span>
                    </div>
                  );
                })}
              </div>

              {/* Recent requests preview */}
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Queue preview */}
                <div className="lg:col-span-2 p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-sora text-sm font-extrabold text-white">Pending Requests</h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('inbox')}
                      className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold uppercase tracking-wider flex items-center gap-1 transition"
                    >
                      View All <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {localRequests.filter(r => r.status === 'pending').slice(0, 2).map((req) => (
                      <div key={req.id} className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-black/30 hover:border-white/10 transition group">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-white/10 flex items-center justify-center text-[10px] font-bold text-slate-300 shrink-0">
                          {req.studentName[0]}{req.studentName.split(' ')[1]?.[0] ?? ''}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white truncate">{req.studentName}</span>
                            <span className="shrink-0 px-1.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[8px] font-bold">{req.score}</span>
                          </div>
                          <span className="text-[10px] text-slate-500">{req.class} · {req.role} at {req.company}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => onHandleAction(req.id, 'referred')}
                          className="shrink-0 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold uppercase tracking-wider hover:bg-emerald-500/20 transition opacity-0 group-hover:opacity-100"
                        >
                          Refer
                        </button>
                      </div>
                    ))}
                    {localRequests.filter(r => r.status === 'pending').length === 0 && (
                      <div className="text-center py-8">
                        <CheckCircle className="w-8 h-8 text-emerald-500/40 mx-auto mb-2" />
                        <p className="text-xs text-slate-500">All caught up! No pending requests.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Impact panel */}
                <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md">
                  <h3 className="font-sora text-sm font-extrabold text-white mb-5">Your Impact</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Referrals sent', value: referralsSentCount, max: 50, color: 'bg-emerald-500' },
                      { label: 'Interviews secured', value: 12, max: 30, color: 'bg-blue-500' },
                      { label: 'Offers received', value: 7, max: 15, color: 'bg-purple-500' },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] text-slate-400 font-semibold">{item.label}</span>
                          <span className="text-[10px] text-white font-bold">{item.value}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${item.color} rounded-full transition-all duration-700`}
                            style={{ width: `${Math.min((item.value / item.max) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-5 border-t border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-[10px] font-bold text-white uppercase tracking-wider">Mentor Level</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {['★','★','★','★','☆'].map((s, i) => (
                        <span key={i} className={`text-sm ${i < 4 ? 'text-amber-400' : 'text-slate-700'}`}>{s}</span>
                      ))}
                      <span className="text-[10px] text-slate-400 font-medium ml-1">Gold Mentor</span>
                    </div>
                    <p className="text-[9px] text-slate-500 mt-1.5">4 more referrals to reach Platinum</p>
                  </div>
                </div>
              </div>

              {/* Recent activity feed */}
              <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md">
                <h3 className="font-sora text-sm font-extrabold text-white mb-5">Recent Activity</h3>
                <div className="space-y-4">
                  {[
                    { icon: UserCheck, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', text: 'You referred Amit Sharma for SWE Intern at Google', time: '2 hours ago' },
                    { icon: MessageSquare, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', text: 'New message from Karan Patel about Associate SWE role', time: '5 hours ago' },
                    { icon: Star, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', text: 'You received a 5-star review from a referred candidate', time: '1 day ago' },
                    { icon: Bell, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20', text: '2 new referral requests from IIT Delhi juniors', time: '2 days ago' },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className="flex items-start gap-4">
                        <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${item.color}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-300 leading-relaxed">{item.text}</p>
                          <span className="text-[9px] text-slate-600 font-medium">{item.time}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════
              CANDIDATE INBOX (TABS)
          ══════════════════════════════ */}
          {activeTab === 'inbox' && (
            <div className="space-y-6 animate-fade-in-up text-left">
              {/* Filter controls row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-white/5 bg-white/[0.01] backdrop-blur-md">
                {/* Status Filters */}
                <div className="flex items-center gap-2 flex-wrap">
                  {['All', 'Pending', 'Referred', 'Info', 'Declined'].map((filter) => {
                    const count = filter === 'Pending' 
                      ? localRequests.filter(r => r.status === 'pending').length 
                      : filter === 'Referred' 
                      ? localRequests.filter(r => r.status === 'referred').length
                      : 0;
                    return (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => setInboxFilter(filter as any)}
                        className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all duration-300 ${
                          inboxFilter === filter
                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.12)]'
                            : 'border-white/5 text-slate-400 hover:text-white hover:border-white/10 hover:bg-white/5'
                        }`}
                      >
                        {filter}
                        {count > 0 && (
                          <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[7px]">{count}</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* College Tier Filters */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Filter className="w-3 h-3" /> Tier:
                  </span>
                  {['All', 'Top-tier', 'State', 'Private'].map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setCollegeTierFilter(tier as any)}
                      className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all duration-300 border ${
                        collegeTierFilter === tier
                          ? 'bg-blue-500/15 border-blue-500/30 text-blue-400'
                          : 'border-transparent text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>

              {/* Request cards */}
              <div className="space-y-5">
                {localRequests
                  .filter((req) => {
                    // Filter by status
                    if (inboxFilter !== 'All') {
                      const matchStatus = inboxFilter.toLowerCase() === req.status.toLowerCase();
                      if (!matchStatus) return false;
                    }
                    // Filter by college tier
                    if (collegeTierFilter !== 'All') {
                      const collName = getCandidateCollege(req);
                      const tier = getCollegeTier(collName);
                      if (tier !== collegeTierFilter) return false;
                    }
                    return true;
                  })
                  .map((req) => {
                    const scoreVal = parseInt(req.score) || 85;
                    const cCollege = getCandidateCollege(req);
                    const isOwnCollege = cCollege.toLowerCase().includes(college.toLowerCase());
                    const showAiWarning = !isOwnCollege && scoreVal >= 85;

                    return (
                      <div
                        key={req.id}
                        className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md hover:border-white/10 transition-all duration-300 relative overflow-hidden"
                      >
                        {/* Status bar */}
                        {req.status !== 'pending' && (
                          <div className={`absolute top-0 left-0 right-0 h-[3px] ${
                            req.status === 'referred' ? 'bg-gradient-to-r from-emerald-500 to-teal-400' :
                            req.status === 'info'     ? 'bg-gradient-to-r from-amber-500 to-yellow-400' :
                            'bg-gradient-to-r from-rose-500 to-red-400'
                          }`} />
                        )}

                        <div className="flex flex-col md:flex-row md:items-start gap-6">
                          {/* Candidate info */}
                          <div className="flex-1 space-y-4">
                            <div className="flex items-start justify-between gap-4 flex-wrap">
                              <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center font-bold text-xs uppercase text-slate-300 shadow-md">
                                  {req.studentName[0]}{req.studentName.split(' ')[1]?.[0] ?? ''}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-bold text-white text-sm">
                                      {req.studentName} <span className="text-slate-400 font-normal">({cCollege})</span>
                                    </span>
                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold border border-emerald-500/20 text-emerald-400 bg-emerald-500/5">
                                      {req.score.includes('%') ? req.score : `${req.score}%`} Match
                                    </span>
                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                                      getCollegeTier(cCollege) === 'Top-tier' ? 'border-blue-500/20 text-blue-400 bg-blue-500/5' :
                                      getCollegeTier(cCollege) === 'State' ? 'border-amber-500/20 text-amber-400 bg-amber-500/5' :
                                      'border-slate-500/20 text-slate-400 bg-slate-500/5'
                                    }`}>
                                      {getCollegeTier(cCollege)}
                                    </span>
                                  </div>
                                  <span className="block text-[10px] text-slate-500 mt-0.5">{req.class}</span>
                                </div>
                              </div>

                              {/* AI warning badge */}
                              {showAiWarning && (
                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/25 text-purple-300 text-[10px] font-bold">
                                  <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                                  <span>Quality Match: High matching score ({scoreVal}%)</span>
                                </div>
                              )}
                            </div>

                            <div className="grid sm:grid-cols-2 gap-3">
                              <div className="p-3 rounded-xl bg-black/30 border border-white/5">
                                <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-wide mb-1">Target Role</span>
                                <span className="text-xs text-slate-200 font-semibold">{req.role} at {req.company}</span>
                              </div>
                              <div className="p-3 rounded-xl bg-black/30 border border-white/5">
                                <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-wide mb-1">Resume</span>
                                {req.resumeUploaded && req.resumeName ? (
                                  <button 
                                    type="button" 
                                    onClick={() => handleViewResume(req.seekerId, req.resumeName, req.studentName)} 
                                    className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-purple-400 hover:text-purple-355 transition"
                                  >
                                    <FileText className="w-3.5 h-3.5 text-rose-500" />
                                    {req.resumeName}
                                  </button>
                                ) : (
                                  <span className="text-[10px] text-slate-500 italic">No resume uploaded</span>
                                )}
                              </div>
                            </div>

                            <div>
                              <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-wide mb-2">Outreach Note</span>
                              <p className="p-4 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-300 leading-relaxed font-inter italic">
                                "{req.message}"
                              </p>
                            </div>
                          </div>

                          {/* Action panel */}
                          <div className="flex flex-col gap-2.5 shrink-0 md:w-44 relative">
                            {req.status === 'pending' ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => onHandleAction(req.id, 'referred')}
                                  className="w-full py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 text-white font-sora font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition shadow-md"
                                >
                                  <UserCheck className="w-3.5 h-3.5" />
                                  Refer
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onHandleAction(req.id, 'info')}
                                  className="w-full py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition"
                                >
                                  <Clock className="w-3.5 h-3.5" />
                                  Need Info
                                </button>
                                <div className="relative w-full">
                                  <button
                                    type="button"
                                    onClick={() => setDeclineReasonOpenId(declineReasonOpenId === req.id ? null : req.id)}
                                    className="w-full py-2.5 rounded-full hover:bg-rose-500/10 text-rose-400 border border-rose-500/10 hover:border-rose-500/20 font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition"
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                    Decline
                                    <ChevronDown className="w-3 h-3 ml-0.5" />
                                  </button>

                                  {/* Quick Decline Reason Dropdown */}
                                  {declineReasonOpenId === req.id && (
                                    <div className="absolute right-0 bottom-full mb-2 w-56 rounded-xl bg-slate-950 border border-white/10 p-2 shadow-2xl backdrop-blur-md z-50 animate-fade-in-up">
                                      <div className="px-2 py-1 text-[9px] font-bold text-slate-500 uppercase tracking-wider border-b border-white/5 mb-1">Reason for decline</div>
                                      {[
                                        "Pitch is too generic",
                                        "Resume needs work",
                                        "Not the right fit",
                                        "No open positions"
                                      ].map((reason) => (
                                        <button
                                          key={reason}
                                          type="button"
                                          onClick={() => {
                                            onHandleAction(req.id, 'declined');
                                            setDeclineReasonOpenId(null);
                                          }}
                                          className="w-full text-left px-2 py-1.5 rounded-lg text-[10.5px] text-slate-300 hover:text-white hover:bg-white/5 transition"
                                        >
                                          {reason}
                                        </button>
                                      ))}
                                      <button
                                        type="button"
                                        onClick={() => setDeclineReasonOpenId(null)}
                                        className="w-full text-center mt-1 border-t border-white/5 pt-1.5 text-[9px] font-bold text-slate-500 hover:text-slate-300 transition"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </>
                            ) : (
                              <div className={`p-4 rounded-xl border text-center flex flex-col items-center justify-center gap-2 w-full ${
                                req.status === 'referred' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' :
                                req.status === 'info'     ? 'bg-amber-500/5 border-amber-500/20 text-amber-400' :
                                'bg-rose-500/5 border-rose-500/20 text-rose-400'
                              }`}>
                                {req.status === 'referred' && (
                                  <>
                                    <CheckCircle className="w-6 h-6 animate-logo-pulse" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Referred!</span>
                                    <span className="text-[8px] text-slate-400">ID: #REF-{1000 + req.id}</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActiveTab('messages');
                                        setActiveChatId(req.seekerId);
                                      }}
                                      className="mt-2 w-full py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-[10px] font-bold uppercase tracking-wider transition flex items-center justify-center gap-1.5"
                                    >
                                      <MessageSquare className="w-3.5 h-3.5" />
                                      Message
                                    </button>
                                  </>
                                )}
                                {req.status === 'info' && (
                                  <>
                                    <Clock className="w-6 h-6" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Info Requested</span>
                                    <span className="text-[8px] text-slate-400">Candidate notified</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActiveTab('messages');
                                        setActiveChatId(req.seekerId);
                                      }}
                                      className="mt-2 w-full py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 text-[10px] font-bold uppercase tracking-wider transition flex items-center justify-center gap-1.5"
                                    >
                                      <MessageSquare className="w-3.5 h-3.5" />
                                      Message
                                    </button>
                                  </>
                                )}
                                {req.status === 'declined' && (
                                  <>
                                    <XCircle className="w-6 h-6" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Declined</span>
                                    <span className="text-[8px] text-slate-400">Feedback sent</span>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                {localRequests.filter((req) => {
                  if (inboxFilter !== 'All' && inboxFilter.toLowerCase() !== req.status.toLowerCase()) return false;
                  if (collegeTierFilter !== 'All') {
                    const collName = getCandidateCollege(req);
                    const tier = getCollegeTier(collName);
                    if (tier !== collegeTierFilter) return false;
                  }
                  return true;
                }).length === 0 && (
                  <div className="text-center py-16 rounded-2xl border border-dashed border-white/5 bg-white/[0.01]">
                    <Clock className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                    <h4 className="font-sora text-sm font-bold text-slate-400">No requests found</h4>
                    <p className="text-xs text-slate-500 mt-1">Try switching filters or check back later.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══════════════════════════════
              MY REFERRALS TAB
          ══════════════════════════════ */}
          {activeTab === 'my_referrals' && (
            <div className="space-y-6 animate-fade-in-up text-left">
              {/* Header metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Referred Pipeline', value: (1 + localRequests.filter(r => r.status === 'referred').length), sub: 'Active candidates', color: 'blue' },
                  { label: 'Interview Stage', value: 2, sub: 'Recruiter screen passed', color: 'emerald' },
                  { label: 'Offers Secured', value: 1, sub: 'Success stories', color: 'purple' },
                  { label: 'Avg Interview Conversion', value: '50%', sub: '2x platform average', color: 'amber' },
                ].map((stat, i) => (
                  <div key={i} className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
                    <span className="block font-sora text-2xl font-black text-white">{stat.value}</span>
                    <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-1">{stat.label}</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5 font-medium">{stat.sub}</span>
                  </div>
                ))}
              </div>

              {/* Candidate Pipeline list */}
              <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-sora text-sm font-extrabold text-white">Referred Candidates Tracking</h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">Real-time application pipeline tracking for your referrals</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                    Pipeline Active
                  </span>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      id: 201,
                      seekerId: 8, // Seeded Amit Sharma ID
                      name: "Amit Sharma",
                      college: "IIT Delhi",
                      role: "Software Engineer Intern",
                      stage: "Interviewing",
                      date: "Referred May 14, 2026",
                      progress: 75,
                      details: "Technical Round 2 scheduled for June 8"
                    },
                    {
                      id: 202,
                      seekerId: 9, // Seeded Karan Patel ID
                      name: "Karan Patel",
                      college: "BITS Pilani",
                      role: "Associate SWE",
                      stage: "Offered",
                      date: "Referred May 10, 2026",
                      progress: 100,
                      details: "Offer letter sent! Base: ₹24LPA"
                    },
                    {
                      id: 203,
                      seekerId: 7, // Fallback to Arjun Singh
                      name: "Riya Sen",
                      college: "NIT Trichy",
                      role: "Product Manager Intern",
                      stage: "Referred",
                      date: "Referred May 28, 2026",
                      progress: 25,
                      details: "Resume parsed & sent to hiring manager"
                    },
                    {
                      id: 204,
                      seekerId: 7, // Fallback to Arjun Singh
                      name: "Sneha Rao",
                      college: "IIT Bombay",
                      role: "Data Scientist",
                      stage: "Under Review",
                      date: "Referred May 22, 2026",
                      progress: 50,
                      details: "Passed initial technical screening"
                    },
                    // Newly referred ones from localRequests
                    ...localRequests
                      .filter(r => r.status === 'referred')
                      .map((req, idx) => ({
                        id: 300 + idx,
                        seekerId: req.seekerId,
                        name: req.studentName,
                        college: getCandidateCollege(req),
                        role: req.role,
                        stage: "Referred",
                        date: "Referred just now",
                        progress: 25,
                        details: "Candidate referred. Resume sent to recruiter pipeline."
                      }))
                  ].map((candidate) => (
                    <div key={candidate.id} className="p-4 rounded-xl border border-white/5 bg-black/40 hover:border-white/10 transition-all duration-300">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Name & role */}
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-[11px] text-white">
                            {candidate.name[0]}{candidate.name.split(' ')[1]?.[0] ?? ''}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-white">{candidate.name}</span>
                              <span className="text-[9px] text-slate-500">· {candidate.college}</span>
                            </div>
                            <span className="block text-[10px] text-slate-400 mt-0.5">{candidate.role}</span>
                          </div>
                        </div>

                        {/* Progress visualizer */}
                        <div className="flex-1 md:max-w-xs space-y-1.5">
                          <div className="flex items-center justify-between text-[9px] font-bold">
                            <span className="text-slate-500 uppercase tracking-wide">Progress</span>
                            <span className="text-slate-300">{candidate.progress}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full bg-gradient-to-r transition-all duration-500 ${
                                candidate.stage === 'Offered' ? 'from-purple-500 to-indigo-400' :
                                candidate.stage === 'Interviewing' ? 'from-blue-500 to-cyan-400' :
                                candidate.stage === 'Under Review' ? 'from-amber-500 to-yellow-400' :
                                'from-slate-600 to-slate-400'
                              }`} 
                              style={{ width: `${candidate.progress}%` }} 
                            />
                          </div>
                        </div>

                        {/* Status detail */}
                        <div className="text-left md:text-right shrink-0 flex flex-col items-start md:items-end gap-1.5">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wide border ${
                              candidate.stage === 'Offered' ? 'bg-purple-500/10 border-purple-500/25 text-purple-400' :
                              candidate.stage === 'Interviewing' ? 'bg-blue-500/10 border-blue-500/25 text-blue-400' :
                              candidate.stage === 'Under Review' ? 'bg-amber-500/10 border-amber-500/25 text-amber-400' :
                              'bg-slate-500/10 border-slate-500/25 text-slate-400'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                candidate.stage === 'Offered' ? 'bg-purple-400 animate-pulse' :
                                candidate.stage === 'Interviewing' ? 'bg-blue-400 animate-pulse' :
                                candidate.stage === 'Under Review' ? 'bg-amber-400 animate-pulse' :
                                'bg-slate-400'
                              }`} />
                              {candidate.stage}
                            </span>
                            
                            <button
                              type="button"
                              onClick={() => {
                                setActiveTab('messages');
                                setActiveChatId(candidate.seekerId);
                              }}
                              className="px-2.5 py-1 rounded-lg border border-white/10 bg-white/5 text-slate-355 hover:text-white hover:bg-white/10 text-[9.5px] font-bold uppercase tracking-wider transition flex items-center gap-1"
                            >
                              <MessageSquare className="w-3 h-3" />
                              Chat
                            </button>
                          </div>
                          <span className="block text-[9.5px] text-slate-500 font-medium">{candidate.details}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════
              MESSAGES TAB
          ══════════════════════════════ */}
          {activeTab === 'messages' && (
            <MessagesTab
              activeChatId={activeChatId}
              setActiveChatId={setActiveChatId}
              chatMessages={chatMessages}
              newMessageText={newMessageText}
              setNewMessageText={setNewMessageText}
              handleSendMessage={handleSendMessage}
              isSchedulerOpen={isSchedulerOpen}
              setIsSchedulerOpen={setIsSchedulerOpen}
              scheduledDate={scheduledDate}
              setScheduledDate={setScheduledDate}
              scheduledTime={scheduledTime}
              setScheduledTime={setScheduledTime}
              handleScheduleCall={handleScheduleCall}
              conversations={conversations}
              alumniNetwork={alumniNetwork}
              role="alumni"
            />
          )}

          {/* ══════════════════════════════
              ANALYTICS TAB
          ══════════════════════════════ */}
          {activeTab === 'analytics' && (
            <div className="space-y-8 animate-fade-in-up text-left">
              {/* Top metrics */}
              <div className="grid sm:grid-cols-3 gap-6">
                {[
                  { label: 'Total Referrals', value: referralsSentCount, delta: '+3 this month', positive: true, icon: Send },
                  { label: 'Conversion Rate', value: '42.8%', delta: '+5% vs last month', positive: true, icon: TrendingUp },
                  { label: 'Avg Response Time', value: '< 1 day', delta: 'Top 10% of mentors', positive: true, icon: Activity },
                ].map((m) => {
                  const Icon = m.icon;
                  return (
                    <div key={m.label} className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{m.label}</span>
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-emerald-400" />
                        </div>
                      </div>
                      <span className="block font-sora text-3xl font-extrabold text-white">{m.value}</span>
                      <span className={`block text-[10px] font-semibold mt-1 ${m.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {m.delta}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Funnel chart and College Distribution */}
              <div className="grid sm:grid-cols-2 gap-6">
                {/* Funnel chart */}
                <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md">
                  <h3 className="font-sora text-sm font-extrabold text-white mb-6">Referral Funnel</h3>
                  <div className="space-y-4">
                    {[
                      { stage: 'Requests Received', value: referralsSentCount + 10, pct: 100, color: 'bg-blue-500' },
                      { stage: 'Reviewed',          value: referralsSentCount + 5,  pct: 87,  color: 'bg-purple-500' },
                      { stage: 'Referred',          value: referralsSentCount,       pct: 72,  color: 'bg-emerald-500' },
                      { stage: 'Interviewed',       value: 12,                       pct: 43,  color: 'bg-amber-500' },
                      { stage: 'Offers',            value: 7,                        pct: 25,  color: 'bg-rose-500' },
                    ].map((row) => (
                      <div key={row.stage} className="flex items-center gap-4">
                        <span className="w-32 text-[10px] text-slate-400 font-medium shrink-0">{row.stage}</span>
                        <div className="flex-1 h-2 bg-slate-950 rounded-full overflow-hidden">
                          <div className={`h-full ${row.color} rounded-full transition-all duration-700`} style={{ width: `${row.pct}%` }} />
                        </div>
                        <span className="w-8 text-right text-xs font-bold text-white shrink-0">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* College distribution */}
                <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md">
                  <h3 className="font-sora text-sm font-extrabold text-white mb-6">Incoming Requests by College</h3>
                  <div className="space-y-4">
                    {[
                      { collName: "IIT Bombay", count: 18, pct: 60, color: "from-blue-500 to-cyan-500" },
                      { collName: "BITS Pilani", count: 6, pct: 20, color: "from-purple-500 to-pink-500" },
                      { collName: "Delhi Technological University", count: 4, pct: 13, color: "from-emerald-500 to-teal-500" },
                      { collName: "Other Tier-2/3 Colleges", count: 2, pct: 7, color: "from-slate-500 to-slate-400" }
                    ].map((item, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-semibold text-slate-300 truncate max-w-[150px] inline-block">{item.collName}</span>
                          <span className="font-bold text-white shrink-0">{item.count} ({item.pct}%)</span>
                        </div>
                        <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                          <div className={`h-full bg-gradient-to-r ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Placed Success Stories */}
              <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md">
                <div className="flex items-center gap-2 mb-5">
                  <Award className="w-4 h-4 text-amber-400" />
                  <h3 className="font-sora text-sm font-extrabold text-white">Referred Success Stories</h3>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { name: "Amit Sharma", college: "IIT Delhi", company: "Google", role: "SWE Intern", text: "Got referred by Arjun, cleared 3 rounds of interviews, and received an offer for the Summer 2026 cohort!", date: "Placed 2 weeks ago" },
                    { name: "Sneha Rao", college: "IIT Bombay", company: "Microsoft", role: "Data Scientist", text: "Verified referral helped bypass the resume screening stage completely. Offer accepted!", date: "Placed 1 month ago" },
                    { name: "Karan Patel", college: "BITS Pilani", company: "Amazon", role: "Software Engineer", text: "Referred for SWE-1. Received full preparation support from mentor and cracked the system design round.", date: "Placed 3 months ago" },
                    { name: "Riya Sen", college: "NIT Trichy", company: "Google", role: "Product Manager Intern", text: "Arjun reviewed my mock interview pitches and referred me to the APM hiring manager. Joined this May!", date: "Placed 1 week ago" }
                  ].map((story, i) => (
                    <div key={i} className="p-4 rounded-xl border border-white/5 bg-black/45 flex flex-col justify-between hover:border-white/10 transition">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-xs text-white">{story.name}</span>
                          <span className="text-[8px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full uppercase tracking-wider">{story.company}</span>
                        </div>
                        <span className="block text-[9px] text-slate-500 font-semibold">{story.college} · {story.role}</span>
                        <p className="text-[11px] text-slate-400 mt-2 leading-relaxed italic">"{story.text}"</p>
                      </div>
                      <span className="block text-[8px] text-slate-600 font-medium text-right mt-3">{story.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════
              ACCOUNTING / CONTROLS TAB
          ══════════════════════════════ */}
          {activeTab === 'accounting' && (
            <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up text-left">
              {/* Request Volume Control */}
              <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-sora text-sm font-extrabold text-white">Monthly Request Volume</h3>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-6">
                  Set a cap on the maximum number of incoming referral requests you wish to receive per calendar month. If exceeded, your profile is hidden from active searches to protect your time.
                </p>

                <div className="grid grid-cols-4 gap-3">
                  {[5, 10, 20, 50].map((limit) => (
                    <button
                      key={limit}
                      type="button"
                      onClick={() => setMonthlyLimit(limit)}
                      className={`py-3 rounded-xl border text-center transition-all duration-300 ${
                        monthlyLimit === limit
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 font-bold shadow-[0_0_12px_rgba(16,185,129,0.12)]'
                          : 'border-white/5 bg-black/20 text-slate-400 hover:text-slate-200 hover:border-white/10'
                      }`}
                    >
                      <span className="block font-sora text-sm">{limit === 50 ? '∞' : limit}</span>
                      <span className="block text-[8px] font-bold uppercase tracking-wider mt-0.5">{limit === 50 ? 'Unlimited' : 'per month'}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-300">Remaining limit for this month</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">Calculated based on active pending queue</span>
                  </div>
                  <span className="text-sm font-sora font-black text-white">
                    {localRequests.filter(r => r.status === 'pending').length} / {monthlyLimit}
                  </span>
                </div>
              </div>

              {/* College Visibility Filter */}
              <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md">
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <h3 className="font-sora text-sm font-extrabold text-white">College Filtering Selector</h3>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-5">
                  Select which tier of college students are allowed to request referrals from you. Set this restriction based on your preferences.
                </p>

                <div className="space-y-3">
                  {[
                    { id: 'all', label: 'Open to all students', sub: 'Receive requests from any verified student on the platform' },
                    { id: 'tier', label: 'Top-tier colleges only', sub: 'Only accept requests from students at BITS, IITs, NITs, and IIITs' },
                    { id: 'own', label: `Restrict to my own college only (${college})`, sub: 'Only students from your alma mater can see your profile and request referrals' }
                  ].map((opt) => (
                    <label
                      key={opt.id}
                      onClick={() => setVisibilityFilter(opt.id)}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all duration-300 ${
                        visibilityFilter === opt.id
                          ? 'bg-blue-500/10 border-blue-500/40 text-blue-400'
                          : 'border-white/5 bg-black/20 text-slate-400 hover:bg-black/30'
                      }`}
                    >
                      <input
                        type="radio"
                        name="visibility"
                        value={opt.id}
                        checked={visibilityFilter === opt.id}
                        onChange={() => {}}
                        className="mt-0.5 text-blue-500 focus:ring-0 focus:ring-offset-0 bg-transparent shrink-0"
                      />
                      <div className="ml-2">
                        <span className="block text-xs font-bold text-white">{opt.label}</span>
                        <span className="block text-[10px] text-slate-500 mt-0.5 leading-relaxed">{opt.sub}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Saved Templates Manager */}
              <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-400" />
                    <h3 className="font-sora text-sm font-extrabold text-white">Saved Templates Manager</h3>
                  </div>
                  {!isAddingTemplate && (
                    <button
                      type="button"
                      onClick={() => setIsAddingTemplate(true)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[9px] font-bold uppercase tracking-wider hover:bg-purple-500/20 transition"
                    >
                      <Plus className="w-3 h-3" /> Add New
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-5">
                  Create and manage template responses you can use to copy/paste or send quickly to students during request review.
                </p>

                {isAddingTemplate && (
                  <div className="p-4 rounded-xl border border-purple-500/20 bg-purple-500/5 mb-4 space-y-3 animate-fade-in-up">
                    <span className="block text-[10px] font-bold text-purple-400 uppercase tracking-wider">New Template</span>
                    <textarea
                      placeholder="Write your response template here..."
                      value={newTemplateText}
                      onChange={(e) => setNewTemplateText(e.target.value)}
                      className="w-full h-20 rounded-lg bg-black/40 border border-white/10 p-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/40 resize-none font-inter"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingTemplate(false);
                          setNewTemplateText('');
                        }}
                        className="px-3 py-1.5 rounded-lg border border-white/5 text-[10px] font-bold text-slate-400 hover:text-white transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={!newTemplateText.trim()}
                        onClick={() => {
                          setSavedTemplates(prev => [...prev, newTemplateText]);
                          setIsAddingTemplate(false);
                          setNewTemplateText('');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-purple-500 text-white text-[10px] font-bold uppercase tracking-wider hover:bg-purple-600 transition disabled:opacity-50"
                      >
                        Save Template
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {savedTemplates.map((template, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-white/5 bg-black/40 group relative">
                      <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition">
                        <button
                          type="button"
                          onClick={() => setSavedTemplates(prev => prev.filter((_, i) => i !== idx))}
                          className="p-1 rounded-lg hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 transition"
                          aria-label="Delete template"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Template #{idx + 1}</span>
                      <p className="text-[11px] text-slate-300 leading-relaxed font-inter">{template}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════
              PROFILE TAB
          ══════════════════════════════ */}
          {activeTab === 'profile' && (
            <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up text-left">
              {/* Profile card */}
              <div className="p-8 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="flex flex-col sm:flex-row items-start gap-6 relative z-10">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white text-2xl font-black shadow-xl shrink-0">
                    {initials}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="font-sora text-xl font-extrabold text-white">{name}</h2>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <ShieldCheck className="w-3 h-3" />
                        Verified Alumni
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 font-medium mt-1">{company} · {college}</p>
                    <div className="flex items-center gap-4 mt-4">
                      <div className="text-center">
                        <span className="block font-sora text-lg font-bold text-white">{referralsSentCount}</span>
                        <span className="block text-[9px] text-slate-500 uppercase tracking-wide">Referrals</span>
                      </div>
                      <div className="w-px h-8 bg-white/5" />
                      <div className="text-center">
                        <span className="block font-sora text-lg font-bold text-white">12</span>
                        <span className="block text-[9px] text-slate-500 uppercase tracking-wide">Interviews</span>
                      </div>
                      <div className="w-px h-8 bg-white/5" />
                      <div className="text-center">
                        <span className="block font-sora text-lg font-bold text-white">4.9</span>
                        <span className="block text-[9px] text-slate-500 uppercase tracking-wide">Rating</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md">
                <h3 className="font-sora text-sm font-extrabold text-white mb-5">Achievements</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Award,    label: 'Gold Mentor',      sub: '25+ referrals', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
                    { icon: Zap,      label: 'Fast Responder',   sub: '< 1 day avg',   color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
                    { icon: Star,     label: 'Top Rated',        sub: '4.9/5 score',   color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
                    { icon: Bookmark, label: 'Most Saved',       sub: 'By 40+ seekers',color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
                  ].map((badge) => {
                    const Icon = badge.icon;
                    return (
                      <div key={badge.label} className={`flex items-center gap-3 p-4 rounded-xl border ${badge.color}`}>
                        <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${badge.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-white">{badge.label}</span>
                          <span className="block text-[9px] text-slate-400">{badge.sub}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Logout button */}
              <button
                type="button"
                onClick={onLogout}
                className="w-full py-3 rounded-full border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-rose-400 font-sora font-semibold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout Account
              </button>
            </div>
          )}

        </div>
      </main>

      {/* ── Premium Resume Viewer Overlay Drawer ── */}
      {previewingResume && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl h-[85vh] rounded-[2rem] border border-white/10 bg-[#08080b] p-6 shadow-2xl flex flex-col justify-between animate-fade-in-up">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/5 shrink-0">
              <div>
                <h3 className="font-sora text-white text-base font-extrabold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-rose-500" />
                  {previewingResume.studentName}'s Resume
                </h3>
                <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                  File: {previewingResume.resumeName}
                </p>
              </div>
              <button 
                onClick={handleClosePreview}
                className="w-8 h-8 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Viewer Area */}
            <div className="flex-1 my-5 rounded-xl border border-white/5 bg-slate-950/40 relative overflow-hidden flex items-center justify-center p-4 min-h-[300px]">
              {isLoadingFile ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Loading PDF from server...</span>
                </div>
              ) : fileUrl ? (
                previewingResume.resumeName.toLowerCase().endsWith('.pdf') ? (
                  <iframe 
                    src={fileUrl} 
                    className="w-full h-full rounded-xl border border-white/10"
                    title="Resume PDF Preview"
                  />
                ) : (
                  <div className="text-center p-8">
                    <FileText className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                    <p className="text-xs text-slate-400 font-semibold mb-3">
                      Word Documents (.docx/.doc) cannot be previewed directly in the browser.
                    </p>
                    <a
                      href={fileUrl}
                      download={previewingResume.resumeName}
                      className="px-4 py-2 rounded-xl bg-purple-650 hover:bg-purple-600 text-white font-bold text-xs uppercase tracking-wider inline-flex items-center gap-1.5"
                    >
                      <Download className="w-4 h-4" />
                      Download to View
                    </a>
                  </div>
                )
              ) : (
                <div className="text-center p-8">
                  <XCircle className="w-12 h-12 text-rose-500/40 mx-auto mb-3" />
                  <p className="text-xs text-slate-400">Failed to load resume file. It might have been deleted or moved.</p>
                </div>
              )}
            </div>

            {/* Footer actions */}
            <div className="flex items-center justify-between pt-3 border-t border-white/5 shrink-0">
              <span className="text-[9px] text-slate-550 leading-relaxed max-w-sm italic">
                * NextInCampus secures all document channels. Keep document details confidential.
              </span>
              <div className="flex gap-3">
                {fileUrl && (
                  <a
                    href={fileUrl}
                    download={previewingResume.resumeName}
                    className="px-4 py-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 transition flex items-center gap-1.5"
                  >
                    <Download className="w-4 h-4" />
                    Download File
                  </a>
                )}
                <button
                  onClick={handleClosePreview}
                  className="px-4 py-2 rounded-xl bg-purple-650 hover:bg-purple-600 text-white font-bold text-xs uppercase tracking-wider transition"
                >
                  Close Viewer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
