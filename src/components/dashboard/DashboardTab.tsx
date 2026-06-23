import React, { useState, useEffect, useRef } from 'react';
import {
  AlertCircle, ArrowRight, Bookmark, CheckCircle, Search, Send, Sparkles, UserCheck, Newspaper, Briefcase, Bell
} from 'lucide-react';
import { API_BASE_URL } from '../../config';

interface DashboardTabProps {
  alumniNetwork: any[];
  openRequestModal: (alumni: any) => void;
  profileCollege: string;
  requestsList: any[];
  savedAlumniIds: number[];
  setActiveTab: (tab: 'dashboard' | 'discover' | 'requests' | 'messages' | 'saved' | 'profile' | 'referral_board') => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  alumniNetwork,
  openRequestModal,
  profileCollege,
  requestsList,
  savedAlumniIds,
  setActiveTab,
}) => {
  const pendingRequests = requestsList.filter((r: any) => r.status === 'pending').length;
  const respondedRequests = requestsList.filter((r: any) => r.status !== 'pending').length;

  const [feedPosts, setFeedPosts] = useState<any[]>([]);
  const [feedLoading, setFeedLoading] = useState(true);
  const [stats, setStats] = useState<{ totalOpen: number; topCompanies: any[]; topDomains: any[] } | null>(null);

  const [tickerOffset, setTickerOffset] = useState(0);
  const tickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchFeedPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/api/referral-posts`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          // Take top 4 active posts
          setFeedPosts(data.slice(0, 4));
        }
      } catch (err) {
        console.error("Error fetching feed posts:", err);
      } finally {
        setFeedLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/api/referral-posts/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchFeedPosts();
    fetchStats();
  }, []);

  // Ticker animation
  useEffect(() => {
    const iv = setInterval(() => {
      setTickerOffset(prev => {
        const el = tickerRef.current;
        if (!el) return prev;
        const max = el.scrollWidth - el.clientWidth;
        if (prev >= max) return 0;
        return prev + 1;
      });
    }, 30);
    return () => clearInterval(iv);
  }, []);

  // Live ticker items
  const tickerItems = stats
    ? [
        `${stats.totalOpen} referral slots open right now`,
        ...stats.topCompanies.map(c => `${c.count} open at ${c.name}`),
        ...stats.topDomains.map(d => `${d.count} roles in ${d.name}`),
        `New referral posted every few hours - stay active!`,
      ]
    : ['Loading referral feed...'];

  return (
    <div className="space-y-6 animate-fade-in-up text-left">



      {/* ── Live Moving Ticker Bar ── */}
      <div className="relative flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#0d0d18] border border-purple-500/15 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent pointer-events-none" />
        <div className="flex items-center gap-1.5 shrink-0 z-10">
          <Bell className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
          <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest font-space-grotesk">Live Feed</span>
          <div className="w-px h-4 bg-white/10 mx-1" />
        </div>
        <div className="overflow-hidden flex-1 z-10">
          <div
            ref={tickerRef}
            className="flex gap-8 text-[11px] text-slate-400 font-medium whitespace-nowrap"
            style={{ transform: `translateX(-${tickerOffset}px)`, transition: 'transform 0.03s linear' }}
          >
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <span key={i} className="shrink-0 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 inline-block animate-pulse" />
                {item}
                <span className="mx-4 text-white/10">|</span>
              </span>
            ))}
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
            label: 'Open Opportunities',
            value: stats ? stats.totalOpen : '...',
            sub: 'Active referral slots',
            icon: Briefcase,
            color: 'amber',
            glow: 'rgba(245,158,11,0.12)',
            onClick: () => setActiveTab('referral_board'),
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
              <span className="block text-[9px] text-slate-550 font-bold uppercase tracking-wider mt-1">{card.label}</span>
              <span className={`block text-[10px] font-semibold mt-0.5 ${c.text}`}>{card.sub}</span>
            </button>
          );
        })}
      </div>

      {/* ── Live Referral Feed + Recommended Alumni ── */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Live Referral Feed */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-white/[0.055] bg-[#09090d] relative overflow-hidden text-left">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/4 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-sora text-sm font-extrabold text-white flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-purple-400" />
              Live Referral Feed
            </h3>
            <button
              onClick={() => setActiveTab('referral_board')}
              className="text-[10px] font-bold text-purple-400 hover:text-purple-300 uppercase tracking-wider flex items-center gap-1 transition"
            >
              View Board <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {feedLoading ? (
            <div className="flex items-center justify-center py-12">
              <span className="text-xs text-slate-550 font-medium">Loading active slots...</span>
            </div>
          ) : feedPosts.length === 0 ? (
            <div className="text-center py-12 border border-white/5 border-dashed rounded-xl">
              <p className="text-xs text-slate-550">No active referral posts available right now.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {feedPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => setActiveTab('referral_board')}
                  className="p-4 rounded-xl border border-white/5 bg-black/20 hover:border-purple-500/20 hover:bg-purple-950/5 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/15 text-[8.5px] font-bold text-purple-400 uppercase">
                        {post.jobType}
                      </span>
                      <span className="text-[9px] text-slate-550">
                        Slots: <strong className="text-white">{post.applyCount}/{post.slots}</strong>
                      </span>
                    </div>
                    <h4 className="font-sora font-bold text-xs text-white leading-tight">{post.role}</h4>
                    <p className="text-[10px] text-slate-450 mt-0.5">{post.company} · {post.location}</p>
                    {post.skills && post.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {post.skills.slice(0, 3).map((skill: string, sIdx: number) => (
                          <span key={sIdx} className="px-1.5 py-0.5 rounded bg-white/5 text-[8px] font-bold text-slate-400">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="mt-3.5 pt-2.5 border-t border-white/5 flex items-center justify-between text-[9px]">
                    <span className="text-slate-550">By <strong className="text-slate-400 font-medium">{post.alumniName || post.alumni?.name}</strong></span>
                    <span className="text-purple-400 font-bold uppercase tracking-wider">Request</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Alumni Matches */}
        <div className="lg:col-span-1 p-6 rounded-2xl border border-white/[0.055] bg-[#09090d] relative overflow-hidden text-left">
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
                className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-black/20 hover:border-purple-500/20 hover:bg-purple-955/5 transition-all duration-300 group"
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
                  <span className="block text-[10px] text-slate-550 font-medium mt-0.5">
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
        <div className="p-6 rounded-2xl border border-white/[0.055] bg-[#09090d] relative overflow-hidden text-left">
          <h3 className="font-sora text-sm font-extrabold text-white mb-5">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { txt: 'Priya S. accepted your referral request for Microsoft PM', time: '2 hours ago', icon: CheckCircle, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
              { txt: 'Rahul M. from Google viewed your profile', time: 'Yesterday', icon: Search, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
              { txt: `3 new alumni from ${profileCollege} joined NiC`, time: '2 days ago', icon: UserCheck, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
              { txt: 'Keep your target companies updated to get matching referrals', time: '3 days ago', icon: AlertCircle, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-start gap-3">
                  <div className={`p-1.5 rounded-lg border shrink-0 ${item.color}`}>
                    <Icon className="w-3 h-3" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-medium">{item.txt}</p>
                    <span className="block text-[9px] text-slate-655 mt-0.5">{item.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Career command center card */}
        <div className="p-6 rounded-2xl border border-purple-500/10 bg-gradient-to-br from-purple-950/8 to-[#09090d] relative overflow-hidden text-left">
          <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
          <h3 className="font-sora text-sm font-extrabold text-white mb-2 relative z-10">Your Referral Funnel</h3>
          <p className="text-[11px] text-slate-550 leading-relaxed mb-6 relative z-10">
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
                  <span className="text-[10px] text-slate-455 font-semibold">{row.label}</span>
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
          <div className="grid grid-cols-3 gap-2 mt-6 pt-5 border-t border-white/5 relative z-10 text-center">
            {[
              { label: 'Find Alumni', tab: 'discover', icon: Search },
              { label: 'Track Requests', tab: 'requests', icon: Send },
              { label: 'Referral Board', tab: 'referral_board', icon: Newspaper },
            ].map((btn) => {
              const Icon = btn.icon;
              return (
                <button
                  key={btn.label}
                  onClick={() => setActiveTab(btn.tab as any)}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:border-purple-500/20 hover:bg-purple-950/5 transition-all duration-200 group"
                >
                  <Icon className="w-4 h-4 text-slate-555 group-hover:text-purple-400 transition-colors" />
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
