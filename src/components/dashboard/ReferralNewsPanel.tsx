import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Newspaper, Search, Filter, RefreshCw, Building2, Bell,
  Flame, BarChart2, Globe, Code, Layers, Palette, Megaphone, Database,
  SlidersHorizontal, X
} from 'lucide-react';
import { API_BASE_URL } from '../../config';

// Types
interface ReferralPost {
  id: number;
  company: string;
  role: string;
  location: string;
  jobType: 'Full-time' | 'Internship' | 'Contract';
  domain: string;
  skills: string[];
  description: string;
  deadline: string;
  slots: number;
  viewCount: number;
  applyCount: number;
  createdAt: string;
  alumni: {
    id: number;
    name: string;
    college: string;
    company: string;
    jobTitle: string;
    availability: string;
  };
}

interface Stats {
  totalOpen: number;
  topCompanies: { name: string; count: number }[];
  topDomains: { name: string; count: number }[];
}

interface ReferralNewsPanelProps {
  seekerId: number;
  resumeName?: string;
  alumniNetwork?: any[];
  setSelectedAlumni?: (alumni: any) => void;
  setActiveTab?: (tab: any) => void;
}

// Helpers
const DOMAIN_ICONS: Record<string, React.ElementType> = {
  'Engineering':  Code,
  'Data & AI':    Database,
  'Product':      Layers,
  'Design':       Palette,
  'Marketing':    Megaphone,
  'Finance':      BarChart2,
  'Operations':   Globe,
};

const COMPANY_COLORS: Record<string, string> = {
  'Google':    'from-blue-500/20 to-green-500/20 border-green-500/20 text-green-300',
  'Microsoft': 'from-blue-500/20 to-cyan-500/20 border-blue-500/20 text-blue-300',
  'Amazon':    'from-orange-500/20 to-amber-500/20 border-orange-500/20 text-orange-300',
  'Netflix':   'from-red-600/20 to-rose-500/20 border-red-500/20 text-red-300',
  'Stripe':    'from-indigo-500/20 to-purple-500/20 border-indigo-500/20 text-indigo-300',
  'Flipkart':  'from-yellow-500/20 to-orange-500/20 border-yellow-500/20 text-yellow-300',
  'Razorpay':  'from-blue-500/20 to-indigo-500/20 border-blue-500/20 text-blue-300',
  'Meesho':    'from-pink-500/20 to-purple-500/20 border-pink-500/20 text-pink-300',
  'Atlassian': 'from-blue-600/20 to-teal-500/20 border-teal-500/20 text-teal-300',
};

const JOB_TYPE_COLORS: Record<string, string> = {
  'Full-time':  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Internship': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'Contract':   'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

const daysUntil = (deadline: string): number => {
  if (!deadline) return 999;
  const d = new Date(deadline);
  const now = new Date();
  return Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
};

const getInitials = (name: string) =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

const AVATAR_GRADIENTS = [
  'from-violet-500 to-purple-700',
  'from-blue-500 to-indigo-700',
  'from-emerald-500 to-teal-700',
  'from-rose-500 to-pink-700',
  'from-amber-500 to-orange-700',
  'from-cyan-500 to-blue-700',
];

// Main Component
export const ReferralNewsPanel: React.FC<ReferralNewsPanelProps> = ({
  seekerId: _seekerId,
  resumeName: _resumeName = 'arjun_resume.pdf',
  alumniNetwork = [],
  setSelectedAlumni,
  setActiveTab,
}) => {
  const [posts, setPosts]           = useState<ReferralPost[]>([]);
  const [stats, setStats]           = useState<Stats | null>(null);
  const [loading, setLoading]       = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState('All');
  const [jobTypeFilter, setJobTypeFilter] = useState('All');
  const [companyFilter, setCompanyFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [tickerOffset, setTickerOffset] = useState(0);
  const tickerRef = useRef<HTMLDivElement>(null);

  const domains = ['All', 'Engineering', 'Data & AI', 'Product', 'Design', 'Marketing', 'Finance', 'Operations'];
  const jobTypes = ['All', 'Full-time', 'Internship', 'Contract'];

  // Fetch posts
  const fetchPosts = useCallback(async () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('search', searchQuery);
      if (domainFilter !== 'All') params.set('domain', domainFilter);
      if (jobTypeFilter !== 'All') params.set('jobType', jobTypeFilter);
      if (companyFilter !== 'All') params.set('company', companyFilter);

      const res = await fetch(`${API_BASE_URL}/api/referral-posts?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (e) {
      console.error('Error fetching referral posts:', e);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, domainFilter, jobTypeFilter, companyFilter]);

  const fetchStats = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/api/referral-posts/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setStats(await res.json());
    } catch (e) {
      console.error('Error fetching stats:', e);
    }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);
  useEffect(() => { fetchStats(); }, [fetchStats]);

  // Auto-refresh every 60s
  useEffect(() => {
    const iv = setInterval(() => { fetchPosts(); fetchStats(); }, 60000);
    return () => clearInterval(iv);
  }, [fetchPosts, fetchStats]);

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

  // Unique companies from posts
  const uniqueCompanies = ['All', ...Array.from(new Set(posts.map(p => p.company)))];

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
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in-up pb-16 font-inter text-left">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/20">
              <Newspaper className="w-5 h-5 text-purple-400" />
            </div>
            <h2 className="font-sora text-xl font-extrabold text-white tracking-tight">
              Referral Board
            </h2>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
              Live
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Open referrals posted by alumni - find who's hiring and apply directly
          </p>
        </div>

        <button
          onClick={() => { fetchPosts(); fetchStats(); }}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:border-white/10 text-xs font-semibold transition-all active:scale-95"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Live Ticker */}
      <div className="relative flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#0d0d18] border border-purple-500/15 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent pointer-events-none" />
        <div className="flex items-center gap-1.5 shrink-0 z-10">
          <Bell className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
          <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest">Live Feed</span>
          <div className="w-px h-4 bg-white/10 mx-1" />
        </div>
        <div className="overflow-hidden flex-1 z-10">
          <div
            ref={tickerRef}
            className="flex gap-8 text-[11px] text-slate-400 font-medium whitespace-nowrap"
            style={{ transform: `translateX(-${tickerOffset}px)`, transition: 'transform 0.03s linear' }}
          >
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <span key={i} className="shrink-0">
                {item}
                <span className="mx-4 text-white/10">|</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-[#08080d]/90 border border-white/5 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <Building2 className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <div className="text-xl font-black text-white font-sora">{stats.totalOpen}</div>
              <div className="text-[10px] text-slate-500 font-semibold">Open Slots</div>
            </div>
          </div>

          {stats.topCompanies.slice(0, 2).map(c => (
            <div key={c.name} className="p-4 rounded-2xl bg-[#08080d]/90 border border-white/5 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <Building2 className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <div className="text-xl font-black text-white font-sora">{c.count}</div>
                <div className="text-[10px] text-slate-500 font-semibold truncate">{c.name}</div>
              </div>
            </div>
          ))}

          <div className="p-4 rounded-2xl bg-[#08080d]/90 border border-white/5 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <Building2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-sm font-black text-white font-sora">
                {stats.topDomains[0]?.name || 'Engineering'}
              </div>
              <div className="text-[10px] text-slate-500 font-semibold font-sora">Top Domain</div>
            </div>
          </div>
        </div>
      )}

      {/* Search + Filters */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by role, company, skill..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-[#09090f] border border-white/8 rounded-xl text-white text-xs placeholder:text-slate-655 focus:outline-none focus:border-purple-500/40 focus:ring-1 focus:ring-purple-500/20 transition"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
              showFilters
                ? 'bg-purple-500/15 border-purple-500/30 text-purple-300'
                : 'bg-white/5 border-white/8 text-slate-400 hover:text-white hover:border-white/15'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
            {(domainFilter !== 'All' || jobTypeFilter !== 'All' || companyFilter !== 'All') && (
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            )}
          </button>
        </div>

        {/* Filter chips */}
        {showFilters && (
          <div className="p-4 rounded-xl bg-[#09090f] border border-white/8 space-y-3 animate-fade-in-up">
            {/* Domain filter */}
            <div>
              <span className="text-[9px] text-slate-600 uppercase tracking-widest font-bold block mb-2">Domain</span>
              <div className="flex flex-wrap gap-1.5">
                {domains.map(d => (
                  <button
                    key={d}
                    onClick={() => setDomainFilter(d)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                      domainFilter === d
                        ? 'bg-purple-500/15 border-purple-500/30 text-purple-300'
                        : 'bg-white/3 border-white/5 text-slate-500 hover:text-slate-200 hover:border-white/15'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Job type filter */}
            <div>
              <span className="text-[9px] text-slate-600 uppercase tracking-widest font-bold block mb-2">Job Type</span>
              <div className="flex flex-wrap gap-1.5">
                {jobTypes.map(t => (
                  <button
                    key={t}
                    onClick={() => setJobTypeFilter(t)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                      jobTypeFilter === t
                        ? 'bg-purple-500/15 border-purple-500/30 text-purple-300'
                        : 'bg-white/3 border-white/5 text-slate-500 hover:text-slate-200 hover:border-white/15'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Company filter */}
            <div>
              <span className="text-[9px] text-slate-600 uppercase tracking-widest font-bold block mb-2">Company</span>
              <div className="flex flex-wrap gap-1.5">
                {uniqueCompanies.map(c => (
                  <button
                    key={c}
                    onClick={() => setCompanyFilter(c)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                      companyFilter === c
                        ? 'bg-purple-500/15 border-purple-500/30 text-purple-300'
                        : 'bg-white/3 border-white/5 text-slate-500 hover:text-slate-200 hover:border-white/15'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => { setDomainFilter('All'); setJobTypeFilter('All'); setCompanyFilter('All'); setSearchQuery(''); }}
              className="text-[10px] text-rose-400/70 hover:text-rose-400 font-bold transition"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Domain Quick Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {domains.map(d => {
          const Icon = DOMAIN_ICONS[d] || Filter;
          const count = d === 'All' ? posts.length : posts.filter(p => p.domain === d).length;
          return (
            <button
              key={d}
              onClick={() => setDomainFilter(d)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold border shrink-0 transition-all ${
                domainFilter === d
                  ? 'bg-purple-500/15 border-purple-500/40 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.15)]'
                  : 'bg-white/3 border-white/5 text-slate-500 hover:text-slate-200 hover:border-white/15'
              }`}
            >
              <Icon className="w-3 h-3" />
              {d}
              {count > 0 && (
                <span className={`px-1.5 py-px rounded-full text-[8px] font-black ${
                  domainFilter === d ? 'bg-purple-500/20 text-purple-300' : 'bg-white/5 text-slate-600'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Posts Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-5 rounded-2xl bg-[#08080d]/90 border border-white/5 space-y-3 animate-pulse">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-2/3 bg-white/5 rounded" />
                  <div className="h-2.5 w-1/2 bg-white/5 rounded" />
                </div>
              </div>
              <div className="h-2 w-full bg-white/5 rounded" />
              <div className="h-2 w-4/5 bg-white/5 rounded" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto">
            <Newspaper className="w-7 h-7 text-purple-400/60" />
          </div>
          <p className="text-slate-400 font-semibold text-sm">No referrals found</p>
          <p className="text-slate-600 text-xs">Try adjusting your filters or search query</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map(post => {
            const days = daysUntil(post.deadline);
            const isUrgent = days <= 7;
            const companyColorClass = COMPANY_COLORS[post.company] || 'from-purple-500/20 to-blue-500/20 border-purple-500/20 text-purple-300';
            const avatarGrad = AVATAR_GRADIENTS[post.alumni.id % AVATAR_GRADIENTS.length];

            return (
              <div
                key={post.id}
                onClick={() => {
                  if (setSelectedAlumni && setActiveTab) {
                    const alumni = alumniNetwork.find(
                      a => a.id === post.alumni.id || a.name.toLowerCase() === post.alumni.name.toLowerCase()
                    );
                    if (alumni) {
                      setSelectedAlumni(alumni);
                      setActiveTab('network');
                    } else {
                      // Fallback matching details
                      const fallbackAlumni = {
                        id: post.alumni.id,
                        name: post.alumni.name,
                        initial: post.alumni.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
                        role: post.alumni.jobTitle,
                        company: post.alumni.company,
                        college: post.alumni.college,
                        color: avatarGrad,
                        responseRate: '92%',
                        responseSpeed: 'Within a day',
                        successRate: `${post.applyCount} Referred`,
                        bio: `Alumni member working at ${post.alumni.company} as ${post.alumni.jobTitle}. Aligned with the referral board post for ${post.role}.`
                      };
                      setSelectedAlumni(fallbackAlumni);
                      setActiveTab('network');
                    }
                  }
                }}
                className="group relative p-5 rounded-2xl bg-[#08080d]/90 border border-white/5 hover:border-purple-500/20 transition-all duration-300 cursor-pointer hover:shadow-[0_4px_30px_rgba(168,85,247,0.08)] overflow-hidden flex flex-col justify-between animate-fade-in"
              >
                {/* Gradient glow bg */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/3 group-hover:to-blue-500/3 transition-all duration-300 pointer-events-none rounded-2xl" />

                {/* Top row: News type badge & urgent banner */}
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[9px] font-bold uppercase tracking-widest">
                      <Newspaper className="w-2.5 h-2.5" />
                      {post.domain} News
                    </span>
                    {isUrgent && days > 0 && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-[9px] font-bold text-rose-400">
                        <Flame className="w-2.5 h-2.5 animate-pulse" />
                        {days}d left
                      </span>
                    )}
                  </div>

                  {/* Company logo, role & details */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${companyColorClass} border flex items-center justify-center shrink-0 font-black text-sm`}>
                      {post.company.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-white truncate group-hover:text-purple-200 transition-colors">
                        {post.role}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        <span className="text-[11px] text-slate-400 font-medium">{post.company}</span>
                        <span className="text-white/10">·</span>
                        <span className="text-[10px] text-slate-500">{post.location}</span>
                        <span className="text-white/10">·</span>
                        <span className={`text-[9.5px] font-bold px-1.5 py-px rounded border ${JOB_TYPE_COLORS[post.jobType] || JOB_TYPE_COLORS['Full-time']}`}>
                          {post.jobType}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description preview */}
                  <p className="text-[11.5px] text-slate-500 leading-relaxed line-clamp-2 mb-3 font-medium">
                    {post.description}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1 mb-1">
                    {post.skills.slice(0, 3).map(skill => (
                      <span key={skill} className="px-2 py-0.5 rounded-md bg-slate-900 border border-white/5 text-[9px] font-mono text-slate-400">
                        {skill}
                      </span>
                    ))}
                    {post.skills.length > 3 && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-white/5 text-[9px] font-mono text-slate-650">
                        +{post.skills.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer: Poster info & Go to Profile Link */}
                <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-4 shrink-0">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${avatarGrad} flex items-center justify-center text-[8px] font-black text-white shrink-0`}>
                      {getInitials(post.alumni.name)}
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[10px] text-slate-400 font-semibold">{post.alumni.name}</span>
                      <span className="block text-[9px] text-slate-500 truncate max-w-[140px]">{post.alumni.jobTitle} · {post.alumni.company}</span>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-purple-400 group-hover:text-purple-300 flex items-center gap-1 transition-colors">
                    View Profile
                    <span className="transform group-hover:translate-x-0.5 transition-transform">→</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
