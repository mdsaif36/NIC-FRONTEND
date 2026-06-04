import React from 'react';
import {
  AlertCircle, ArrowRight, Bookmark, Check,
  CheckCircle, Search, Send, Sparkles, TrendingUp, UserCheck, Zap
} from 'lucide-react';

interface DashboardTabProps {
  alumniNetwork: any[];
  getProfileCompletion: () => number;
  openRequestModal: (alumni: any) => void;
  profileCollege: string;
  requestsList: any[];
  resumeUploaded: boolean;
  savedAlumniIds: number[];
  setActiveTab: (tab: 'dashboard' | 'discover' | 'requests' | 'messages' | 'saved' | 'profile') => void;
  skills: string[];
  targetCompanies: string[];
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  alumniNetwork,
  getProfileCompletion,
  openRequestModal,
  profileCollege,
  requestsList,
  resumeUploaded,
  savedAlumniIds,
  setActiveTab,
  skills,
  targetCompanies,
}) => {
  const completion = getProfileCompletion();
  const pendingRequests = requestsList.filter((r: any) => r.status === 'pending').length;
  const respondedRequests = requestsList.filter((r: any) => r.status !== 'pending').length;

  return (
    <div className="space-y-6 animate-fade-in-up text-left">

      {/* ── Hero Banner ── */}
      <div className="relative rounded-2xl overflow-hidden border border-purple-500/10 p-6 md:p-8">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950/25 via-[#07070a] to-blue-950/15" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500/6 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        {/* Grid texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            {/* Completion ring + headline */}
            <div className="flex items-center gap-4">
              {/* Circular progress ring */}
              <div className="relative w-14 h-14 shrink-0">
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 56 56">
                  <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(168,85,247,0.1)" strokeWidth="3" />
                  <circle
                    cx="28" cy="28" r="24" fill="none"
                    stroke="url(#hero-ring-grad)" strokeWidth="3"
                    strokeDasharray={`${(completion / 100) * 150.8} 150.8`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="hero-ring-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#A855F7" />
                      <stop offset="100%" stopColor="#3B82F6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-sora text-[11px] font-extrabold text-white">{completion}%</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-sora text-lg font-extrabold text-white leading-tight">
                    Career Command Center
                  </h3>
                  {completion >= 80 && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold uppercase">
                      <Zap className="w-2.5 h-2.5" /> Profile Strong
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 font-medium mt-1 leading-relaxed">
                  {profileCollege} · {pendingRequests > 0
                    ? `${pendingRequests} request${pendingRequests > 1 ? 's' : ''} awaiting response`
                    : 'All caught up — explore more alumni'}
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="flex items-center gap-3 max-w-sm">
              <div className="flex-1 h-1.5 bg-slate-900/80 rounded-full overflow-hidden border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(168,85,247,0.4)]"
                  style={{ width: `${completion}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 font-medium shrink-0">{completion}% complete</span>
            </div>
          </div>

          {/* CTA group */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('discover')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-sora font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(168,85,247,0.25)] hover:shadow-[0_0_28px_rgba(168,85,247,0.4)] hover:opacity-95 transition-all duration-300"
            >
              <Search className="w-3.5 h-3.5" />
              Find Alumni
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-white font-sora font-semibold text-xs uppercase tracking-wider transition-all duration-300"
            >
              Complete Profile
            </button>
          </div>
        </div>
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Requests Sent',
            value: requestsList.length,
            sub: pendingRequests > 0 ? `${pendingRequests} pending` : 'All responded',
            icon: Send,
            color: 'purple',
            glow: 'rgba(168,85,247,0.12)',
            onClick: () => setActiveTab('requests'),
          },
          {
            label: 'Responses',
            value: respondedRequests,
            sub: requestsList.length > 0 ? `${Math.round((respondedRequests / requestsList.length) * 100)}% rate` : '—',
            icon: CheckCircle,
            color: 'emerald',
            glow: 'rgba(16,185,129,0.12)',
            onClick: () => setActiveTab('requests'),
          },
          {
            label: 'Saved Alumni',
            value: savedAlumniIds.length,
            sub: 'Bookmarked mentors',
            icon: Bookmark,
            color: 'blue',
            glow: 'rgba(59,130,246,0.12)',
            onClick: () => setActiveTab('saved'),
          },
          {
            label: 'Profile Score',
            value: `${completion}%`,
            sub: completion >= 80 ? 'Fully optimised' : 'Needs completion',
            icon: TrendingUp,
            color: 'amber',
            glow: 'rgba(245,158,11,0.12)',
            onClick: () => setActiveTab('profile'),
          },
        ].map((card) => {
          const Icon = card.icon;
          const colorMap: Record<string, { text: string; iconBg: string; iconBorder: string; ring: string }> = {
            purple:  { text: 'text-purple-400',  iconBg: 'bg-purple-500/10',  iconBorder: 'border-purple-500/20',  ring: 'group-hover:shadow-[0_0_0_1px_rgba(168,85,247,0.2)]' },
            emerald: { text: 'text-emerald-400', iconBg: 'bg-emerald-500/10', iconBorder: 'border-emerald-500/20', ring: 'group-hover:shadow-[0_0_0_1px_rgba(16,185,129,0.2)]' },
            blue:    { text: 'text-blue-400',    iconBg: 'bg-blue-500/10',    iconBorder: 'border-blue-500/20',    ring: 'group-hover:shadow-[0_0_0_1px_rgba(59,130,246,0.2)]' },
            amber:   { text: 'text-amber-400',   iconBg: 'bg-amber-500/10',   iconBorder: 'border-amber-500/20',   ring: 'group-hover:shadow-[0_0_0_1px_rgba(245,158,11,0.2)]' },
          };
          const c = colorMap[card.color];
          return (
            <button
              key={card.label}
              type="button"
              onClick={card.onClick}
              className={`p-5 rounded-2xl border border-white/[0.055] bg-[#09090d] text-left group hover:border-white/10 transition-all duration-300 relative overflow-hidden cursor-pointer ${c.ring}`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl pointer-events-none" style={{ background: card.glow }} />
              <div className={`w-9 h-9 rounded-xl ${c.iconBg} border ${c.iconBorder} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-200`}>
                <Icon className={`w-4 h-4 ${c.text}`} />
              </div>
              <span className="block font-sora text-2xl font-extrabold text-white tracking-tight">{card.value}</span>
              <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-1">{card.label}</span>
              <span className={`block text-[10px] font-semibold mt-0.5 ${c.text}`}>{card.sub}</span>
            </button>
          );
        })}
      </div>

      {/* ── Setup Checklist + Recommended Alumni ── */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Profile checklist */}
        <div className="lg:col-span-1 p-6 rounded-2xl border border-white/[0.055] bg-[#09090d] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-purple-500/4 rounded-full blur-2xl pointer-events-none" />
          <h3 className="font-sora text-sm font-extrabold text-white mb-5 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Profile Setup
          </h3>

          <div className="space-y-3">
            {[
              {
                step: '01',
                title: 'Upload Resume',
                desc: resumeUploaded ? 'Completed' : '+20% profile boost',
                done: resumeUploaded,
              },
              {
                step: '02',
                title: 'Target Companies',
                desc: targetCompanies.length >= 3 ? 'Completed' : `${targetCompanies.length}/3 added`,
                done: targetCompanies.length >= 3,
              },
              {
                step: '03',
                title: 'Add Skills',
                desc: skills.length >= 4 ? 'Completed' : `${skills.length}/4 skills added`,
                done: skills.length >= 4,
              },
            ].map((item) => (
              <button
                key={item.step}
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-4 p-3.5 rounded-xl border transition-all duration-200 text-left group ${
                  item.done
                    ? 'border-emerald-500/15 bg-emerald-950/5 hover:bg-emerald-950/8'
                    : 'border-purple-500/15 bg-purple-950/5 hover:border-purple-500/25 hover:bg-purple-950/8'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-mono text-[10px] font-bold transition-all ${
                  item.done
                    ? 'bg-emerald-500/15 border border-emerald-500/20 text-emerald-400'
                    : 'bg-purple-500/10 border border-purple-500/20 text-purple-400'
                }`}>
                  {item.done ? <Check className="w-3.5 h-3.5" /> : item.step}
                </div>
                <div className="flex-1 min-w-0">
                  <span className={`block text-xs font-bold leading-tight ${item.done ? 'text-slate-400' : 'text-white'}`}>
                    {item.title}
                  </span>
                  <span className={`block text-[9px] font-medium mt-0.5 ${item.done ? 'text-emerald-500' : 'text-slate-500'}`}>
                    {item.desc}
                  </span>
                </div>
                {!item.done && (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Top Alumni Matches */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-white/[0.055] bg-[#09090d] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/4 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-sora text-sm font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
              Top Matches
            </h3>
            <button
              onClick={() => setActiveTab('discover')}
              className="text-[10px] font-bold text-purple-400 hover:text-purple-300 uppercase tracking-wider flex items-center gap-1 transition"
            >
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {alumniNetwork.slice(0, 3).map((alumni, idx) => (
              <div
                key={alumni.id}
                className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-black/20 hover:border-purple-500/20 hover:bg-purple-950/5 transition-all duration-300 group"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${alumni.color} flex items-center justify-center font-bold text-white text-[10px] uppercase shadow-md shrink-0`}>
                  {alumni.initial}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-white">{alumni.name}</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[8px] font-bold">
                      {alumni.match}% Match
                    </span>
                  </div>
                  <span className="block text-[10px] text-slate-500 font-medium mt-0.5">
                    {alumni.company} · {alumni.college}
                  </span>
                </div>

                {/* Action */}
                <button
                  type="button"
                  onClick={() => openRequestModal(alumni)}
                  className="shrink-0 px-3 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/5 text-purple-400 text-[9px] font-bold uppercase tracking-wider hover:bg-purple-500/15 hover:border-purple-500/40 transition-all duration-200 opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0"
                >
                  Request
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Activity Feed + Quick Stats ── */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Activity feed */}
        <div className="p-6 rounded-2xl border border-white/[0.055] bg-[#09090d] relative overflow-hidden">
          <h3 className="font-sora text-sm font-extrabold text-white mb-5">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { txt: 'Priya S. accepted your referral request for Microsoft PM', time: '2 hours ago', icon: CheckCircle, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
              { txt: 'Rahul M. from Google viewed your profile', time: 'Yesterday', icon: Search, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
              { txt: `3 new alumni from ${profileCollege} joined NiC`, time: '2 days ago', icon: UserCheck, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
              { txt: `Profile at ${completion}% — add resume to unlock all features`, time: '3 days ago', icon: AlertCircle, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-start gap-3">
                  <div className={`p-1.5 rounded-lg border shrink-0 ${item.color}`}>
                    <Icon className="w-3 h-3" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-medium">{item.txt}</p>
                    <span className="block text-[9px] text-slate-600 mt-0.5">{item.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Career command center card */}
        <div className="p-6 rounded-2xl border border-purple-500/10 bg-gradient-to-br from-purple-950/8 to-[#09090d] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
          <h3 className="font-sora text-sm font-extrabold text-white mb-2 relative z-10">Your Referral Funnel</h3>
          <p className="text-[11px] text-slate-500 leading-relaxed mb-6 relative z-10">
            Track how your outreach converts into real opportunities.
          </p>

          <div className="space-y-3.5 relative z-10">
            {[
              { label: 'Requests Sent',   value: requestsList.length,                                                        max: 10, color: 'bg-purple-500' },
              { label: 'Responses',       value: respondedRequests,                                                          max: 10, color: 'bg-blue-500' },
              { label: 'Conversations',   value: Math.max(respondedRequests - 1, 0),                                        max: 10, color: 'bg-cyan-500' },
            ].map((row) => (
              <div key={row.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] text-slate-400 font-semibold">{row.label}</span>
                  <span className="text-[10px] font-bold text-white">{row.value}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${row.color} rounded-full transition-all duration-700`}
                    style={{ width: `${Math.min((row.value / row.max) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Quick action row */}
          <div className="grid grid-cols-3 gap-2 mt-6 pt-5 border-t border-white/5 relative z-10">
            {[
              { label: 'Find Alumni', tab: 'discover', icon: Search },
              { label: 'Track Requests', tab: 'requests', icon: Send },
              { label: 'My Profile', tab: 'profile', icon: TrendingUp },
            ].map((btn) => {
              const Icon = btn.icon;
              return (
                <button
                  key={btn.label}
                  onClick={() => setActiveTab(btn.tab as any)}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:border-purple-500/20 hover:bg-purple-950/5 transition-all duration-200 group"
                >
                  <Icon className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-colors" />
                  <span className="text-[8px] font-bold text-slate-500 group-hover:text-slate-300 uppercase tracking-wide transition-colors text-center leading-tight">{btn.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
};
