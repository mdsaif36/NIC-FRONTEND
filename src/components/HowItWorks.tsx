import React, { useState } from 'react';
import { 
  Mail, Search, Send, CheckCircle2, Clock, Lock, Sparkles, 
  BookOpen, UserCheck, Plus, ChevronRight, Activity, Building, Compass
} from 'lucide-react';

interface MockAlumni {
  id: number;
  name: string;
  role: string;
  company: string;
  college: string;
  match: number;
  available: boolean;
  responseRate: string;
  referrals: number;
  connections: number;
  reputation: number;
  bio: string;
  avatarText: string;
  skills: string[];
}

const mockAlumniData: MockAlumni[] = [
  {
    id: 1,
    name: 'Rahul Mehta',
    role: 'Software Engineer III',
    company: 'Google',
    college: 'IIT Bombay',
    match: 94,
    available: true,
    responseRate: '97%',
    referrals: 12,
    connections: 320,
    reputation: 1200,
    bio: 'I can review engineering projects and give referrals.',
    avatarText: 'RM',
    skills: ['Python', 'SQL', 'System Design']
  },
  {
    id: 2,
    name: 'Priya Singh',
    role: 'Product Manager Lead',
    company: 'Microsoft',
    college: 'BITS Pilani',
    match: 87,
    available: true,
    responseRate: '89%',
    referrals: 5,
    connections: 280,
    reputation: 1050,
    bio: 'Focused on Azure cloud products. Love sharing tips about product strategy.',
    avatarText: 'PS',
    skills: ['React', 'ML', 'System Design']
  }
];

export const HowItWorks: React.FC = () => {
  // Discovery steps active item
  const [activeStep, setActiveStep] = useState<number>(0);
  
  // Seeker search mockup state
  const [activeCompanyFilter, setActiveCompanyFilter] = useState<string>('All');
  const [activeSkillFilter, setActiveSkillFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredMockAlumni = mockAlumniData.filter(alumni => {
    // Company match
    if (activeCompanyFilter !== 'All' && alumni.company !== activeCompanyFilter) {
      return false;
    }
    // Skill match
    if (activeSkillFilter !== 'All' && !alumni.skills.includes(activeSkillFilter)) {
      return false;
    }
    // Search query match
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        alumni.name.toLowerCase().includes(q) ||
        alumni.company.toLowerCase().includes(q) ||
        alumni.role.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <section id="how-it-works" className="relative py-28 overflow-hidden bg-transparent border-t border-white/5 font-inter select-none">
      
      {/* Background Glows */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-6xl 3xl:max-w-[1440px] 4xl:max-w-[1700px] mx-auto px-6">
        
        {/* ======================================================== */}
        {/* 1. TRUST CORE MODEL                                      */}
        {/* ======================================================== */}
        <div className="text-center mb-24">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-cyan-400 mb-4 font-space-grotesk">
            Trust Core Model
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-space-grotesk text-white tracking-tight leading-tight mb-12">
            Open Network, No College Gate
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="transparent-neon-card text-left">
              <div className="transparent-neon-card-inner p-6 flex flex-col justify-between h-full min-h-[190px]">
                <div>
                  <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
                    <UserCheck className="w-4 h-4 text-blue-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white font-sora mb-2">Any Seeker &rarr; Any Alumni</h3>
                  <p className="text-xs text-slate-350 leading-relaxed font-inter">
                    Any seeker from any college can request a referral from any alumni at any company. No college-matching logic is required, closing accuracy gaps for alumni who want to refer.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="transparent-neon-card text-left">
              <div className="transparent-neon-card-inner p-6 flex flex-col justify-between h-full min-h-[190px]">
                <div>
                  <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4">
                    <Compass className="w-4 h-4 text-purple-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white font-sora mb-2">Digital-Only: Offline-Capable</h3>
                  <p className="text-xs text-slate-350 leading-relaxed font-inter">
                    Allows offline-mode data loads for fast searching without availability gaps. If availability drops (e.g. temporary outages), users search locally-cached data to match names and positions.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="transparent-neon-card text-left">
              <div className="transparent-neon-card-inner p-6 flex flex-col justify-between h-full min-h-[190px]">
                <div>
                  <div className="w-9 h-9 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-4">
                    <Activity className="w-4 h-4 text-pink-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white font-sora mb-2">Trust Signals Replace College Wall</h3>
                  <p className="text-xs text-slate-350 leading-relaxed font-inter">
                    Instead of completely screening based on college walls, NIC recommendations prioritize trust signals. System tracks peer reputation, responses, and verification logs to rank matches.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. COMPLETE SEEKER DISCOVERY FLOW (SPLIT SECTION)        */}
        {/* ======================================================== */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-cyan-400 mb-4 font-space-grotesk">
              Discovery Engine
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-space-grotesk text-white tracking-tight leading-tight">
              Complete Seeker Discovery Flow — Step by Step
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left: Discovery steps timeline */}
            <div className="lg:col-span-5 space-y-3">
              {[
                {
                  step: '01',
                  title: 'Verify Student Email',
                  desc: 'Seeker logs in with college domain and enters credentials.',
                  bullets: ['Verify domain', 'Domain verified', 'Get verified badge']
                },
                {
                  step: '02',
                  title: 'Search for Alumni',
                  desc: 'Browse or filter for alumni with autocomplete suggestions and live filters.',
                  bullets: ['Autocomplete suggestions', 'Live typing search filter', 'Filter by company/school']
                },
                {
                  step: '03',
                  title: 'Set Target Company + Role',
                  desc: 'Input target company, filters target role, name, and experience years.',
                  bullets: ['Select target company', 'Select target role', 'Search by name', 'Filter by experience']
                },
                {
                  step: '04',
                  title: 'Scan and Score Matches',
                  desc: 'System scans and outputs matching alumni profiles with matching scores.',
                  bullets: ['Show matching alumni', 'Show matching score', 'Display match details']
                },
                {
                  step: '05',
                  title: 'View Alumni Profile + Pitch',
                  desc: 'Click matching profile to view background details, availability calendar, and pitch guidelines.',
                  bullets: ['Show profile info', 'View pitch answers', 'Show availability calendar']
                },
                {
                  step: '06',
                  title: 'Send Request + Resume',
                  desc: 'Fill referral request form with custom messages, connection timeline, and links.',
                  bullets: ['Enter custom message', 'Select connection timeline', 'Attach resume link']
                },
                {
                  step: '07',
                  title: 'Receive Review Status',
                  desc: 'Outreach request is submitted to alumni dashboard. Track status changes in real-time.',
                  bullets: ['Show request card', 'Notify alumni', 'Receive review status']
                }
              ].map((s, idx) => {
                const isActive = idx === activeStep;
                return (
                  <div
                    key={s.step}
                    onMouseEnter={() => setActiveStep(idx)}
                    className={`relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer text-left ${
                      isActive 
                        ? 'bg-white/[0.03] border-white/10 shadow-lg' 
                        : 'bg-transparent border-transparent opacity-40 hover:opacity-75'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute inset-y-4 left-0 w-[3px] bg-gradient-to-b from-cyan-400 to-indigo-500 rounded-full" />
                    )}
                    <div className="flex gap-4">
                      <span className={`font-space-grotesk font-black text-sm ${isActive ? 'text-cyan-400' : 'text-slate-500'}`}>
                        {s.step}
                      </span>
                      <div>
                        <h4 className="font-space-grotesk font-bold text-white text-xs uppercase tracking-wider mb-1">
                          {s.title}
                        </h4>
                        <p className="text-[11px] text-slate-350 leading-relaxed font-inter mb-2">
                          {s.desc}
                        </p>
                        {isActive && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {s.bullets.map(b => (
                              <span key={b} className="text-[9px] font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider select-none">
                                {b}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: Seeker Search Mockup Container */}
            <div className="lg:col-span-7 w-full flex flex-col gap-6">
              
              {/* Prime Individual Alumni Card Container Mockup */}
              <div className="w-full rounded-[2rem] border border-white/10 bg-[#08080b]/90 backdrop-blur-2xl p-6 shadow-2xl relative text-left">
                <div className="absolute -top-3 -right-3 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-full px-3 py-1 text-[9px] font-black tracking-widest uppercase font-space-grotesk animate-pulse">
                  ● Live Seeker Mockup
                </div>

                <h3 className="font-space-grotesk font-extrabold text-white text-sm uppercase tracking-wider mb-4 border-b border-white/5 pb-2">
                  Prime Individual Alumni Card Container
                </h3>

                {/* Mock Search input */}
                <div className="relative w-full mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by company, role, or name..."
                    className="w-full pl-9 pr-4 py-2 bg-black border border-white/10 rounded-xl text-[11px] text-white placeholder-slate-500 focus:outline-none focus:border-white/20 transition-all font-inter"
                  />
                </div>

                {/* Company filter pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar mb-3 pb-1.5 border-b border-white/5">
                  {['All', 'Google', 'Microsoft', 'Amazon', 'Meta'].map(c => (
                    <button
                      key={c}
                      onClick={() => setActiveCompanyFilter(c)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
                        activeCompanyFilter === c
                          ? 'bg-white text-black font-extrabold shadow-sm'
                          : 'bg-white/5 border border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                  <span className="text-[10px] text-slate-500 px-1 font-semibold">+ More</span>
                </div>

                {/* Skill filter pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar mb-5 pb-1">
                  {['All', 'Python', 'React', 'ML', 'SQL', 'System Design'].map(s => (
                    <button
                      key={s}
                      onClick={() => setActiveSkillFilter(s)}
                      className={`px-3 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all duration-300 ${
                        activeSkillFilter === s
                          ? 'bg-cyan-500/25 border border-cyan-400/40 text-cyan-300'
                          : 'bg-white/5 border border-white/5 text-slate-500 hover:text-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                {/* List of Mock Alumni Cards */}
                <div className="space-y-4 mb-6">
                  {filteredMockAlumni.length > 0 ? (
                    filteredMockAlumni.map(alumni => (
                      <div 
                        key={alumni.id} 
                        className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-white/10 transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${alumni.id === 1 ? 'from-blue-500 to-indigo-600' : 'from-purple-500 to-pink-500'} flex items-center justify-center text-white text-[10px] font-black border border-white/15 select-none shrink-0`}>
                            {alumni.avatarText}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white">{alumni.name}</span>
                              <span className="text-[9px] bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 px-1.5 py-0.2 rounded font-bold uppercase">
                                {alumni.company} {alumni.id === 1 ? 'SWE' : 'PM'}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 block mt-0.5">{alumni.role} · {alumni.college}</span>
                            <p className="text-[10px] text-slate-300 italic mt-2 leading-relaxed">
                              "{alumni.bio}"
                            </p>
                            <div className="flex flex-wrap gap-1 mt-3">
                              {alumni.skills.map(s => (
                                <span key={s} className="text-[8px] font-semibold bg-white/5 border border-white/5 text-slate-400 px-2 py-0.2 rounded">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Right side of alumni card: Match metrics & CTA */}
                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 border-t border-white/5 pt-3 md:pt-0 md:border-none">
                          <div className="text-left md:text-right">
                            <span className="text-[18px] font-black text-cyan-400 font-space-grotesk tracking-tight">
                              {alumni.match}%
                            </span>
                            <span className="text-[9px] text-slate-500 block uppercase tracking-wider font-semibold">Match Score</span>
                          </div>
                          <div className="flex gap-2">
                            <button className="px-3 py-1 rounded-lg bg-white text-black text-[10px] font-bold hover:bg-slate-100 transition-colors shadow-sm">
                              Request Referral
                            </button>
                            <button className="p-1 rounded-lg border border-white/10 hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-[11px] text-slate-500 border border-dashed border-white/5 rounded-2xl">
                      No matching mock profiles found. Click "All" to reset filters.
                    </div>
                  )}
                </div>

                {/* Parameter Score Chart Panel */}
                <div className="p-4 bg-black/40 border border-white/5 rounded-2xl text-left">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5 font-space-grotesk">
                    <Activity className="w-3.5 h-3.5 text-cyan-400" />
                    How Matching Score is Calculated
                  </h4>
                  <div className="space-y-2.5">
                    {[
                      { name: 'Match score for seeker', percent: 94, color: 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]' },
                      { name: 'Response rate', percent: 89, color: 'bg-indigo-400 shadow-[0_0_8px_#818cf8]' },
                      { name: 'Response speed', percent: 92, color: 'bg-purple-400 shadow-[0_0_8px_#c084fc]' },
                      { name: 'Match speed', percent: 85, color: 'bg-pink-400 shadow-[0_0_8px_#f472b6]' },
                      { name: 'Activity score', percent: 91, color: 'bg-rose-450 shadow-[0_0_8px_#f43f5e]' }
                    ].map(p => (
                      <div key={p.name} className="space-y-1">
                        <div className="flex justify-between items-center text-[9px] text-slate-350 font-medium">
                          <span>{p.name}</span>
                          <span className="font-mono text-white font-bold">{p.percent}%</span>
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${p.color}`} 
                            style={{ width: `${p.percent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>

        {/* ======================================================== */}
        {/* Giant container card wrapping both sections */}
        <div className="mb-28 p-8 md:p-12 rounded-[2.5rem] border border-white/[0.04] bg-slate-950/20 backdrop-blur-xl relative overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.6)] group/container transition-all duration-700 hover:border-white/[0.08] hover:bg-slate-950/30">
          
          {/* Dynamic Background Glows inside container */}
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none transition-all duration-700 group-hover/container:bg-blue-500/10" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none transition-all duration-700 group-hover/container:bg-emerald-500/10" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative z-10">
            
            {/* Left: How Trust Works Atlas */}
            <div className="lg:col-span-5 text-left">
              <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-cyan-400 mb-4 font-space-grotesk">
                Trust Engine
              </span>
              <h2 className="text-3xl font-extrabold font-space-grotesk text-white tracking-tight leading-tight mb-8">
                How Trust Works: A Reassuring Trust Atlas That Replaces the College Gate
              </h2>

              <div className="space-y-4">
                
                {/* Trust Card 1 */}
                <div className="p-5 rounded-2xl border border-white/[0.04] bg-slate-950/40 backdrop-blur-md hover:border-emerald-500/25 hover:bg-slate-950/65 hover:shadow-[0_8px_32px_rgba(16,185,129,0.05)] transition-all duration-300 flex gap-4 items-start group shadow-lg">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-space-grotesk mb-1.5 group-hover:text-emerald-450 transition-colors">
                      Verified via Email
                    </h4>
                    <p className="text-[11px] text-slate-350 leading-relaxed font-inter">
                      Users are verified with academic email (.edu) or work email to verify domain, once done, checks are generally static.
                    </p>
                  </div>
                </div>

                {/* Trust Card 2 */}
                <div className="p-5 rounded-2xl border border-white/[0.04] bg-slate-950/40 backdrop-blur-md hover:border-cyan-500/25 hover:bg-slate-950/65 hover:shadow-[0_8px_32px_rgba(6,182,212,0.05)] transition-all duration-300 flex gap-4 items-start group shadow-lg">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all duration-300">
                    <Activity className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-space-grotesk mb-1.5 group-hover:text-cyan-450 transition-colors">
                      NIC Reputation Score
                    </h4>
                    <p className="text-[11px] text-slate-350 leading-relaxed font-inter">
                      Points are calculated dynamically based on feedback, response rate, activity. Gives users a score to know who is active.
                    </p>
                  </div>
                </div>

                {/* Trust Card 3 */}
                <div className="p-5 rounded-2xl border border-white/[0.04] bg-slate-950/40 backdrop-blur-md hover:border-purple-500/25 hover:bg-slate-950/65 hover:shadow-[0_8px_32px_rgba(168,85,247,0.05)] transition-all duration-300 flex gap-4 items-start group shadow-lg">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all duration-300">
                    <Building className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-space-grotesk mb-1.5 group-hover:text-purple-450 transition-colors">
                      Work/Campus Verification
                    </h4>
                    <p className="text-[11px] text-slate-350 leading-relaxed font-inter">
                      Domain-level security checks ensure only current students and active employees participate, providing an authentic collegial network.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Right: Referral lifecycle tracker */}
            <div className="lg:col-span-7 text-left">
              <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-cyan-400 mb-4 font-space-grotesk">
                Transparency
              </span>
              <h2 className="text-3xl font-extrabold font-space-grotesk text-white tracking-tight leading-tight mb-8">
                Track the Life-Cycle of Referral Status After Sending
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                
                {/* Step 1: Sent */}
                <div className="p-5 bg-slate-950/50 border border-white/[0.04] rounded-2xl flex flex-col justify-between min-h-[160px] relative group hover:border-blue-500/25 hover:bg-black/60 backdrop-blur-md shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]">
                  <div className="absolute inset-0 bg-transparent group-hover:bg-blue-500/5 rounded-2xl blur-xl transition-all duration-500 -z-10 pointer-events-none" />
                  <div className="w-7 h-7 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center mb-4 text-blue-400 text-xs font-black shadow-md group-hover:scale-110 group-hover:bg-blue-500/25 transition-all duration-300">
                    1
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-space-grotesk mb-1.5 group-hover:text-blue-400 transition-colors">
                      Sent
                    </h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-inter">
                      Request transmitted. Seeker and alumni notified via email.
                    </p>
                  </div>
                </div>

                {/* Step 2: Viewed */}
                <div className="p-5 bg-slate-950/50 border border-white/[0.04] rounded-2xl flex flex-col justify-between min-h-[160px] relative group hover:border-purple-500/25 hover:bg-black/60 backdrop-blur-md shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]">
                  <div className="absolute inset-0 bg-transparent group-hover:bg-purple-500/5 rounded-2xl blur-xl transition-all duration-500 -z-10 pointer-events-none" />
                  <div className="w-7 h-7 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center mb-4 text-purple-400 text-xs font-black shadow-md group-hover:scale-110 group-hover:bg-purple-500/25 transition-all duration-300">
                    2
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-space-grotesk mb-1.5 group-hover:text-purple-400 transition-colors">
                      Viewed
                    </h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-inter">
                      Alumni opened request. Reviewing resume, skills & pitch.
                    </p>
                  </div>
                </div>

                {/* Step 3: Accepted */}
                <div className="p-5 bg-slate-950/50 border border-white/[0.04] rounded-2xl flex flex-col justify-between min-h-[160px] relative group hover:border-cyan-500/25 hover:bg-black/60 backdrop-blur-md shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]">
                  <div className="absolute inset-0 bg-transparent group-hover:bg-cyan-500/5 rounded-2xl blur-xl transition-all duration-500 -z-10 pointer-events-none" />
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center mb-4 text-cyan-400 text-xs font-black shadow-md group-hover:scale-110 group-hover:bg-cyan-500/25 transition-all duration-300">
                    3
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-space-grotesk mb-1.5 group-hover:text-cyan-400 transition-colors">
                      Accepted
                    </h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-inter">
                      Alumni accepted request. Chat and schedule call unlocked.
                    </p>
                  </div>
                </div>

                {/* Step 4: Referred */}
                <div className="p-5 bg-slate-950/50 border border-white/[0.04] rounded-2xl flex flex-col justify-between min-h-[160px] relative group hover:border-emerald-500/25 hover:bg-black/60 backdrop-blur-md shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]">
                  <div className="absolute inset-0 bg-transparent group-hover:bg-emerald-500/5 rounded-2xl blur-xl transition-all duration-500 -z-10 pointer-events-none" />
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-4 text-emerald-400 text-xs font-black shadow-md group-hover:scale-110 group-hover:bg-emerald-500/25 transition-all duration-300">
                    4
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-space-grotesk mb-1.5 group-hover:text-emerald-450 transition-colors">
                      Referred
                    </h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-inter">
                      Referral submitted directly to target company system.
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* ======================================================== */}
        {/* Credit System Section                                   */}
        {/* ======================================================== */}
        <div className="mb-28 p-8 md:p-12 rounded-[2.5rem] border border-white/[0.04] bg-slate-950/20 backdrop-blur-xl relative overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.6)] group/credit transition-all duration-700 hover:border-white/[0.08] hover:bg-slate-950/30">
          {/* Ambient Glows */}
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none transition-all duration-700 group-hover/credit:bg-purple-500/10" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-pink-500/5 rounded-full blur-[120px] pointer-events-none transition-all duration-700 group-hover/credit:bg-pink-500/10" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            {/* Left: Text Content */}
            <div className="lg:col-span-7 text-left space-y-6">
              <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-purple-400 font-space-grotesk">
                Credit System
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-space-grotesk text-white tracking-tight leading-tight">
                A High-Intent Economy.<br />Built for Quality.
              </h2>
              <div className="space-y-4 text-slate-300 text-sm md:text-base leading-relaxed font-inter">
                <p>
                  Traditional networking platforms are broken. Alumni inboxes are flooded with generic messages, leaving talented students waiting in the dark. NextInCampus fixes this by operating strictly on a high-intent economy.
                </p>
                <p className="border-l-2 border-purple-500/50 pl-4 py-1 text-slate-450 italic">
                  To respect our mentors' time and guarantee visibility for our candidates, every verified student is allocated 5 Premium Referral Credits per month.
                </p>
              </div>
            </div>

            {/* Right: Beautiful Visual Credit Card/Display */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-[340px] rounded-3xl border border-white/10 bg-black/40 backdrop-blur-2xl p-6 relative overflow-hidden shadow-2xl group/card transition-all duration-500 hover:border-purple-500/30 hover:scale-[1.02]">
                {/* Card Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover/card:bg-purple-500/20 transition-all duration-500" />
                
                {/* Header: Brand and Badge */}
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-[9px] font-black text-white">N</div>
                    <span className="font-space-grotesk font-black text-[10px] tracking-wider text-slate-400">NEXTINCAMPUS</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full border border-purple-500/35 bg-purple-500/10 text-purple-300 text-[8px] font-bold uppercase tracking-wider font-space-grotesk">
                    Active Seeker
                  </span>
                </div>

                {/* Body: Monthly Credits Display */}
                <div className="space-y-1 mb-8 text-left">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Monthly Allocation</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black font-space-grotesk text-white">5</span>
                    <span className="text-slate-400 text-sm font-medium font-inter">/ 5 Credits</span>
                  </div>
                  <span className="text-[10px] text-slate-450 block pt-1">Resets dynamically on the 1st of every month</span>
                </div>

                {/* Footer: Credit Pills list */}
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div 
                      key={i} 
                      className="flex-1 h-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-[0_0_10px_rgba(168,85,247,0.3)] animate-pulse" 
                      style={{ animationDelay: `${i * 150}ms`, animationDuration: '2s' }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 4. COMPLETE FLOW GRID (MATRIX INDEX TAGS)                */}
        {/* ======================================================== */}
        {/* Giant container card with light frosted glass style wrapping both headings and tags */}
        <div className="text-center pt-12 pb-14 px-8 md:px-12 rounded-[2.5rem] border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl relative overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.5)] group/matrix transition-all duration-750 hover:border-white/15 hover:bg-white/[0.05]">
          {/* Light glowing background inside container */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-500/5 to-purple-500/5 rounded-full blur-[120px] pointer-events-none transition-all duration-700 group-hover/matrix:scale-110" />

          <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-cyan-400 mb-4 font-space-grotesk relative z-10">
            Campus Ecosystem
          </span>
          <h2 className="text-3xl font-extrabold font-space-grotesk text-white tracking-tight leading-tight mb-8 relative z-10">
            Complete Flow — Joining NIC
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-4xl mx-auto relative z-10">
            {[
              { text: 'Verify student email', icon: Mail, color: 'text-cyan-300 border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500/10 hover:border-cyan-400/40' },
              { text: 'Set target company + role', icon: Search, color: 'text-purple-300 border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 hover:border-purple-400/40' },
              { text: 'Filter alumni database', icon: Compass, color: 'text-indigo-300 border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10 hover:border-indigo-400/40' },
              { text: 'Read alumni profile + pitch', icon: BookOpen, color: 'text-pink-300 border-pink-500/20 bg-pink-500/5 hover:bg-pink-500/10 hover:border-pink-400/40' },
              { text: 'Open referral modal', icon: Plus, color: 'text-blue-300 border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 hover:border-blue-400/40' },
              { text: 'Send request + resume', icon: Send, color: 'text-emerald-300 border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-400/40' },
              { text: 'Alumni profile check pass', icon: UserCheck, color: 'text-amber-300 border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 hover:border-amber-400/40' },
              { text: 'Track status (sent -> seen -> decision)', icon: Clock, color: 'text-rose-300 border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 hover:border-rose-400/40' },
              { text: 'Accepted + chat unlocks', icon: Lock, color: 'text-sky-300 border-sky-500/20 bg-sky-500/5 hover:bg-sky-500/10 hover:border-sky-400/40' },
              { text: 'Talk / Schedule call', icon: Sparkles, color: 'text-violet-300 border-violet-500/20 bg-violet-500/5 hover:bg-violet-500/10 hover:border-violet-400/40' },
              { text: 'Referral submitted', icon: CheckCircle2, color: 'text-green-300 border-green-500/20 bg-green-500/5 hover:bg-green-500/10 hover:border-green-400/40' },
              { text: 'Interview', icon: Activity, color: 'text-yellow-300 border-yellow-500/20 bg-yellow-500/5 hover:bg-yellow-500/10 hover:border-yellow-400/40' },
              { text: 'Hired 🎉', icon: Sparkles, highlights: true },
              { text: 'Become alumni on NIC', icon: UserCheck, color: 'text-teal-300 border-teal-500/20 bg-teal-500/5 hover:bg-teal-500/10 hover:border-teal-400/40' }
            ].map((tag, idx) => {
              const TagIcon = tag.icon;
              return (
                <div 
                  key={tag.text}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border transition-all duration-300 group hover:-translate-y-0.5 select-none ${
                    tag.highlights
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-650 text-white border-purple-500/40 shadow-[0_4px_14px_rgba(168,85,247,0.3)] scale-[1.03] hover:scale-[1.05]'
                      : `${tag.color} text-slate-200`
                  }`}
                >
                  <TagIcon className={`w-3.5 h-3.5 ${tag.highlights ? 'text-white' : 'transition-colors'}`} />
                  <span className="text-[10px] font-bold uppercase tracking-wider font-space-grotesk">{tag.text}</span>
                  {idx < 13 && (
                    <ChevronRight className="w-3 h-3 text-slate-500 hidden group-hover:block transition-all ml-1 animate-pulse" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
