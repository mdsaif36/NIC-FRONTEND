import React, { useState, useEffect } from 'react';
import {
  Trophy, Crown, Star, Award, Target, Users,
  Flame, Rocket,
  ArrowUp, ArrowDown, Minus,
  Calendar, Gift, BadgeCheck, Timer, Building2
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type MentorLevel = 'Rising Mentor' | 'Trusted Mentor' | 'Career Guide' | 'Elite Mentor' | 'Hall of Fame';

interface AlumniRankEntry {
  id: number;
  name: string;
  company: string;
  role: string;
  initials: string;
  impactScore: number;
  level: MentorLevel;
  badges: string[];
  referrals: number;
  interviews: number;
  offers: number;
  rating: number;
  responseTime: string;
  responseRate: number;
  meetingsConducted: number;
  monthlyPoints: number;
  allTimePoints: number;
  gradient: string;
  trendUp: boolean | null; // null = stable
  rankChange: number;
}

interface MonthlyChallenge {
  id: string;
  label: string;
  icon: React.ElementType;
  target: number;
  current: number;
  points: number;
  color: string;
}

type LeaderboardCategory = 'global' | 'company' | 'responders' | 'rated' | 'myrank';
type TimeRange = 'month' | 'alltime';
type CompanyFilter = 'Google' | 'Microsoft' | 'Amazon' | 'Meta' | 'Adobe';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MENTOR_LEVELS: { level: MentorLevel; min: number; max: number; icon: string; color: string; bg: string }[] = [
  { level: 'Rising Mentor', min: 0,    max: 100,  icon: '🌱', color: 'text-emerald-400',  bg: 'bg-emerald-500/10 border-emerald-500/25' },
  { level: 'Trusted Mentor',min: 100,  max: 300,  icon: '⭐', color: 'text-blue-400',     bg: 'bg-blue-500/10 border-blue-500/25' },
  { level: 'Career Guide',  min: 300,  max: 600,  icon: '🚀', color: 'text-purple-400',   bg: 'bg-purple-500/10 border-purple-500/25' },
  { level: 'Elite Mentor',  min: 600,  max: 1000, icon: '🏆', color: 'text-amber-400',    bg: 'bg-amber-500/10 border-amber-500/25' },
  { level: 'Hall of Fame',  min: 1000, max: 9999, icon: '👑', color: 'text-yellow-300',   bg: 'bg-yellow-500/10 border-yellow-500/25' },
];

const getLevelInfo = (level: MentorLevel) => MENTOR_LEVELS.find(l => l.level === level) ?? MENTOR_LEVELS[0];



// My profile data (simulated — the logged-in alumni's own metrics)
const MY_DATA_CONST: AlumniRankEntry = {
  id: 0, name: 'You', company: 'Pending Verification', role: 'Alumni',
  initials: 'ME', impactScore: 0, level: 'Rising Mentor',
  badges: [],
  referrals: 0, interviews: 0, offers: 0, rating: 5.0, responseTime: '0 hrs',
  responseRate: 100, meetingsConducted: 0, monthlyPoints: 0, allTimePoints: 0,
  gradient: 'from-emerald-500 to-teal-500', trendUp: null, rankChange: 0
};

const COMPANY_FILTERS: CompanyFilter[] = ['Google', 'Microsoft', 'Amazon', 'Meta', 'Adobe'];

// ─── Color helpers ─────────────────────────────────────────────────────────────
const colorMap: Record<string, { text: string; bg: string; border: string; glow: string }> = {
  amber:   { text: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/25',   glow: 'rgba(245,158,11,0.15)'  },
  violet:  { text: 'text-violet-400',  bg: 'bg-violet-500/10',  border: 'border-violet-500/25',  glow: 'rgba(139,92,246,0.15)'  },
  blue:    { text: 'text-blue-400',    bg: 'bg-blue-500/10',    border: 'border-blue-500/25',    glow: 'rgba(59,130,246,0.15)'  },
  emerald: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/25', glow: 'rgba(16,185,129,0.15)'  },
  rose:    { text: 'text-rose-400',    bg: 'bg-rose-500/10',    border: 'border-rose-500/25',    glow: 'rgba(244,63,94,0.15)'   },
  purple:  { text: 'text-purple-400',  bg: 'bg-purple-500/10',  border: 'border-purple-500/25',  glow: 'rgba(168,85,247,0.15)'  },
  cyan:    { text: 'text-cyan-400',    bg: 'bg-cyan-500/10',    border: 'border-cyan-500/25',    glow: 'rgba(34,211,238,0.15)'  },
  yellow:  { text: 'text-yellow-300',  bg: 'bg-yellow-500/10',  border: 'border-yellow-500/25',  glow: 'rgba(234,179,8,0.15)'   },
};

// ─── Sub-components ────────────────────────────────────────────────────────────

const RankMedal: React.FC<{ rank: number; size?: 'sm' | 'lg' }> = ({ rank, size = 'sm' }) => {
  const medals = ['', '🥇', '🥈', '🥉'];
  const sz = size === 'lg' ? 'text-3xl' : 'text-lg';
  if (rank <= 3) return <span className={`${sz} select-none`}>{medals[rank]}</span>;
  return (
    <span className={`font-sora font-black ${size === 'lg' ? 'text-xl text-white' : 'text-xs text-slate-500'}`}>
      #{rank}
    </span>
  );
};

const ImpactBar: React.FC<{ score: number; max?: number }> = ({ score, max = 1000 }) => {
  const pct = Math.min(100, (score / max) * 100);
  return (
    <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-1000"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

const TrendBadge: React.FC<{ trendUp: boolean | null; change: number }> = ({ trendUp, change }) => {
  if (trendUp === null || change === 0) return (
    <div className="flex items-center gap-0.5 text-slate-600">
      <Minus className="w-3 h-3" />
      <span className="text-[9px] font-bold">—</span>
    </div>
  );
  if (trendUp) return (
    <div className="flex items-center gap-0.5 text-emerald-400">
      <ArrowUp className="w-3 h-3" />
      <span className="text-[9px] font-bold">+{change}</span>
    </div>
  );
  return (
    <div className="flex items-center gap-0.5 text-rose-400">
      <ArrowDown className="w-3 h-3" />
      <span className="text-[9px] font-bold">{change}</span>
    </div>
  );
};

const LeaderboardRow: React.FC<{
  entry: AlumniRankEntry; rank: number; isMe?: boolean; view: 'global' | 'responders' | 'rated';
  onClick: () => void; isSelected: boolean;
}> = ({ entry, rank, isMe = false, view, onClick, isSelected }) => {
  const levelInfo = getLevelInfo(entry.level);
  const scoreDisplay = view === 'responders' ? entry.responseTime : view === 'rated' ? `${entry.rating}/5` : entry.impactScore;
  const scoreLabel = view === 'responders' ? 'Avg Reply' : view === 'rated' ? 'Rating' : 'Impact';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all duration-200 text-left ${
        isSelected
          ? 'border-amber-500/30 bg-amber-500/8'
          : isMe
          ? 'border-emerald-500/25 bg-emerald-500/5'
          : 'border-transparent bg-white/[0.015] hover:border-white/8 hover:bg-white/[0.03]'
      }`}
    >
      {/* Rank */}
      <div className="w-8 shrink-0 flex justify-center">
        <RankMedal rank={rank} />
      </div>

      {/* Avatar */}
      <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${entry.gradient} flex items-center justify-center text-white text-[10px] font-black shrink-0 shadow-md`}>
        {entry.initials}
      </div>

      {/* Name + level */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`text-xs font-bold ${isMe ? 'text-emerald-400' : 'text-white'}`}>
            {isMe ? `${entry.name} (You)` : entry.name}
          </span>
          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full border ${levelInfo.bg}`}>
            {levelInfo.icon} {entry.level}
          </span>
        </div>
        <span className="text-[9px] text-slate-500 font-medium">{entry.role} · {entry.company}</span>
      </div>

      {/* Trend */}
      <div className="shrink-0 hidden sm:flex">
        <TrendBadge trendUp={entry.trendUp} change={Math.abs(entry.rankChange)} />
      </div>

      {/* Score */}
      <div className="shrink-0 text-right">
        <div className={`text-sm font-sora font-extrabold ${rank <= 3 ? 'text-amber-400' : 'text-white'}`}>
          {scoreDisplay}
        </div>
        <div className="text-[8px] text-slate-600 font-semibold uppercase tracking-wider">{scoreLabel}</div>
      </div>
    </button>
  );
};

// ─── Impact Score Breakdown Card ───────────────────────────────────────────────
const ImpactBreakdown: React.FC<{ entry: AlumniRankEntry }> = ({ entry }) => {
  const levelInfo = getLevelInfo(entry.level);
  const factors = [
    { label: 'Referral Quality',        pct: 35, score: Math.round(entry.referrals * 3.2), maxScore: 350, color: 'amber'   },
    { label: 'Career Impact (Offers)',  pct: 20, score: Math.round(entry.offers * 15),     maxScore: 200, color: 'emerald' },
    { label: 'Student Ratings',         pct: 20, score: Math.round((entry.rating / 5) * 200), maxScore: 200, color: 'blue'    },
    { label: 'Response Performance',    pct: 15, score: Math.round((entry.responseRate / 100) * 150), maxScore: 150, color: 'violet'  },
    { label: 'Activity Score',          pct: 10, score: Math.round(entry.meetingsConducted * 1.1), maxScore: 100, color: 'cyan'    },
  ];

  return (
    <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${entry.gradient} flex items-center justify-center text-white text-xs font-black shadow-lg`}>
          {entry.initials}
        </div>
        <div>
          <div className="text-xs font-bold text-white">{entry.name}</div>
          <div className="text-[9px] text-slate-500 font-medium">{entry.role} · {entry.company}</div>
        </div>
        <div className="ml-auto text-right">
          <div className="text-xl font-sora font-extrabold text-amber-400">{entry.impactScore}</div>
          <div className="text-[8px] text-slate-600 uppercase tracking-wider">Impact Score</div>
        </div>
      </div>

      {/* Level badge */}
      <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${levelInfo.bg}`}>
        <span className="text-lg">{levelInfo.icon}</span>
        <div>
          <div className={`text-xs font-bold ${levelInfo.color}`}>{entry.level}</div>
          <div className="text-[9px] text-slate-600 font-medium">Mentor Tier</div>
        </div>
        <div className="ml-auto text-right">
          <ImpactBar score={entry.impactScore} />
          <div className="text-[8px] text-slate-600 mt-1">{entry.impactScore} / 1000+</div>
        </div>
      </div>

      {/* Factor breakdown */}
      <div className="space-y-2.5">
        <div className="text-[9px] text-slate-600 font-bold uppercase tracking-wider">Score Breakdown</div>
        {factors.map(f => {
          const c = colorMap[f.color];
          const barPct = Math.min(100, (f.score / f.maxScore) * 100);
          return (
            <div key={f.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-semibold text-slate-400">{f.label}</span>
                <div className="flex items-center gap-1">
                  <span className={`text-[10px] font-bold ${c.text}`}>{f.score}</span>
                  <span className="text-[8px] text-slate-600">/ {f.maxScore}</span>
                  <span className="text-[8px] text-slate-700">({f.pct}%)</span>
                </div>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div className={`h-full rounded-full bg-gradient-to-r transition-all duration-700`}
                  style={{ width: `${barPct}%`, background: `linear-gradient(to right, var(--tw-gradient-stops))` }}
                >
                  <div className={`h-full w-full ${f.color === 'amber' ? 'bg-amber-500' : f.color === 'emerald' ? 'bg-emerald-500' : f.color === 'blue' ? 'bg-blue-500' : f.color === 'violet' ? 'bg-violet-500' : 'bg-cyan-500'} opacity-80`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5">
        {[
          { label: 'Referrals', value: entry.referrals, icon: '🔗' },
          { label: 'Interviews', value: entry.interviews, icon: '📋' },
          { label: 'Offers',    value: entry.offers,    icon: '🎉' },
        ].map(m => (
          <div key={m.label} className="text-center p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="text-base">{m.icon}</div>
            <div className="font-sora font-extrabold text-white text-base">{m.value}</div>
            <div className="text-[8px] text-slate-600 font-semibold uppercase">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Badges */}
      {entry.badges.length > 0 && (
        <div className="pt-2 border-t border-white/5">
          <div className="text-[9px] text-slate-600 font-bold uppercase tracking-wider mb-2">Badges</div>
          <div className="flex flex-wrap gap-1.5">
            {entry.badges.map(b => (
              <span key={b} className="px-2.5 py-1 rounded-full text-[9px] font-bold bg-white/5 border border-white/10 text-slate-300">
                {b}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Monthly Challenges ────────────────────────────────────────────────────────
const MonthlyChallenges: React.FC = () => {
  const now = new Date();
  const monthName = now.toLocaleString('en', { month: 'long', year: 'numeric' });

  const challenges: MonthlyChallenge[] = [
    { id: 'c1', label: 'Help 5 Students',    icon: Users,       target: 5,  current: 3,  points: 50,  color: 'blue'    },
    { id: 'c2', label: 'Conduct 3 Meetings', icon: Calendar,    target: 3,  current: 2,  points: 40,  color: 'violet'  },
    { id: 'c3', label: 'Give 2 Referrals',   icon: BadgeCheck,  target: 2,  current: 2,  points: 60,  color: 'emerald' },
    { id: 'c4', label: 'Respond in 1 Hour',  icon: Timer,       target: 5,  current: 5,  points: 30,  color: 'amber'   },
    { id: 'c5', label: 'Rate 2 Seekers',     icon: Star,        target: 2,  current: 1,  points: 20,  color: 'rose'    },
  ];

  const totalEarned = challenges.filter(c => c.current >= c.target).reduce((s, c) => s + c.points, 0);
  const totalPossible = challenges.reduce((s, c) => s + c.points, 0);

  return (
    <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-sora text-sm font-extrabold text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" />
            Monthly Challenges
          </h3>
          <p className="text-[9px] text-slate-500 font-medium">{monthName}</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-sora font-extrabold text-amber-400">+{totalEarned}</div>
          <div className="text-[8px] text-slate-600 uppercase tracking-wider">/ {totalPossible} pts</div>
        </div>
      </div>

      <div className="space-y-2.5">
        {challenges.map(c => {
          const Icon = c.icon;
          const done = c.current >= c.target;
          const pct = Math.min(100, (c.current / c.target) * 100);
          const col = colorMap[c.color];
          return (
            <div key={c.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${done ? `${col.border} ${col.bg}` : 'border-white/5 bg-white/[0.01]'}`}>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${col.bg} border ${col.border}`}>
                <Icon className={`w-3.5 h-3.5 ${col.text}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-bold ${done ? 'text-white' : 'text-slate-400'}`}>{c.label}</span>
                  <span className={`text-[9px] font-bold ${col.text}`}>+{c.points} pts</span>
                </div>
                <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, backgroundColor: done ? undefined : undefined }}
                  >
                    <div className={`h-full w-full ${done ? 'bg-emerald-500' : c.color === 'blue' ? 'bg-blue-500' : c.color === 'violet' ? 'bg-violet-500' : c.color === 'amber' ? 'bg-amber-500' : c.color === 'rose' ? 'bg-rose-500' : 'bg-emerald-500'} opacity-80`} />
                  </div>
                </div>
                <div className="text-[8px] text-slate-600 mt-0.5">{c.current}/{c.target} {done ? '✓ Complete' : 'in progress'}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 rounded-xl border border-amber-500/20 bg-amber-500/5">
        <div className="flex items-center gap-2">
          <Gift className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[10px] font-bold text-amber-400">Complete all challenges → Earn Elite Badge!</span>
        </div>
      </div>
    </div>
  );
};

// ─── My Rank Card ──────────────────────────────────────────────────────────────
const MyRankCard: React.FC<{ myRank: number; myData: AlumniRankEntry }> = ({ myRank, myData }) => {
  const levelInfo = getLevelInfo(myData.level);

  // Next level progress
  const nextLevel = MENTOR_LEVELS.find(l => l.min > myData.impactScore) ?? MENTOR_LEVELS[MENTOR_LEVELS.length - 1];
  const currentLevelData = MENTOR_LEVELS.find(l => l.level === myData.level) ?? MENTOR_LEVELS[0];
  const progressInLevel = myData.impactScore - currentLevelData.min;
  const levelRange = currentLevelData.max - currentLevelData.min;
  const levelPct = Math.min(100, (progressInLevel / levelRange) * 100);

  return (
    <div className="space-y-4">
      {/* Hero card */}
      <div className="relative rounded-2xl overflow-hidden border border-white/5 bg-gradient-to-br from-emerald-950/30 via-[#07070a] to-teal-950/20 p-6">
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${myData.gradient} flex items-center justify-center text-white text-sm font-black shadow-xl ring-2 ring-emerald-500/30`}>
              {myData.initials}
            </div>
            <div>
              <div className="font-sora text-xl font-extrabold text-white">Your Rank</div>
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border w-fit mt-1 ${levelInfo.bg}`}>
                <span className="text-sm">{levelInfo.icon}</span>
                <span className={`text-[9px] font-bold ${levelInfo.color}`}>{myData.level}</span>
              </div>
            </div>
            <div className="ml-auto text-right">
              <div className="font-sora text-3xl font-extrabold text-amber-400">#{myRank}</div>
              <div className="text-[9px] text-slate-500 uppercase tracking-wider">Platform Wide</div>
            </div>
          </div>

          {/* Score */}
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="font-sora text-2xl font-extrabold text-white">{myData.impactScore}</div>
              <div className="text-[9px] text-slate-500 uppercase tracking-wider">Impact Score</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-emerald-400">{myData.responseRate}%</div>
              <div className="text-[9px] text-slate-500">Response Rate</div>
            </div>
          </div>

          {/* Level progress */}
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[9px] text-slate-600 font-semibold">Progress to {nextLevel.level}</span>
            <span className="text-[9px] text-emerald-400 font-bold">{Math.round(levelPct)}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-1000"
              style={{ width: `${levelPct}%` }}
            />
          </div>
          <div className="text-[9px] text-slate-600 mt-1">
            {nextLevel.min - myData.impactScore} points to reach {nextLevel.icon} {nextLevel.level}
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Referrals Given',    value: myData.referrals,          icon: '🔗', color: 'blue'    },
          { label: 'Interviews',         value: myData.interviews,         icon: '📋', color: 'violet'  },
          { label: 'Offers Generated',   value: myData.offers,             icon: '🎉', color: 'emerald' },
          { label: 'Student Rating',     value: `${myData.rating}/5`,      icon: '⭐', color: 'amber'   },
          { label: 'Meetings Conducted', value: myData.meetingsConducted,  icon: '📅', color: 'cyan'    },
          { label: 'Monthly Points',     value: myData.monthlyPoints,      icon: '🏅', color: 'rose'    },
        ].map(stat => {
          const c = colorMap[stat.color];
          return (
            <div key={stat.label} className={`p-4 rounded-xl border ${c.border} ${c.bg} text-left relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-12 h-12 rounded-full blur-xl pointer-events-none" style={{ background: c.glow }} />
              <div className="text-base mb-1">{stat.icon}</div>
              <div className={`font-sora text-lg font-extrabold ${c.text}`}>{stat.value}</div>
              <div className="text-[9px] text-slate-600 font-semibold uppercase tracking-wider leading-tight">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* My Badges */}
      <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md">
        <div className="text-[9px] text-slate-600 font-bold uppercase tracking-wider mb-3">Your Badges</div>
        <div className="flex flex-wrap gap-2">
          {myData.badges.map((b: string) => (
            <span key={b} className="px-3 py-1.5 rounded-full text-[10px] font-bold bg-white/5 border border-white/10 text-slate-300">
              {b}
            </span>
          ))}
          <span className="px-3 py-1.5 rounded-full text-[10px] font-bold border border-dashed border-white/10 text-slate-600 italic">
            + earn more badges
          </span>
        </div>
      </div>

      {/* Monthly Challenges */}
      <MonthlyChallenges />
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────

export const LeaderboardTab: React.FC = () => {
  const [category, setCategory] = useState<LeaderboardCategory>('global');
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const [companyFilter, setCompanyFilter] = useState<CompanyFilter>('Google');
  const [selectedEntry, setSelectedEntry] = useState<AlumniRankEntry | null>(null);

  const [alumniData, setAlumniData] = useState<AlumniRankEntry[]>([]);
  const [myRankData, setMyRankData] = useState<AlumniRankEntry>(MY_DATA_CONST);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const fetchLeaderboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/users/leaderboard', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok && isMounted) {
          const data = await res.json();
          if (data.leaderboard) {
            setAlumniData(data.leaderboard);
            if (data.myRank) {
              setMyRankData(data.myRank);
            }
            if (data.leaderboard.length > 0) {
              setSelectedEntry(data.leaderboard[0]);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching leaderboard data:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchLeaderboard();
    return () => {
      isMounted = false;
    };
  }, []);

  const MY_DATA = myRankData;

  const now = new Date();
  const monthLabel = now.toLocaleString('en', { month: 'long', year: 'numeric' });

  // Sorted lists
  const globalList = [...alumniData].sort((a, b) =>
    timeRange === 'month' ? b.monthlyPoints - a.monthlyPoints : b.allTimePoints - a.allTimePoints
  );

  const companyList = alumniData
    .filter(a => a.company.toLowerCase() === companyFilter.toLowerCase())
    .sort((a, b) => b.impactScore - a.impactScore);

  const responderList = [...alumniData].sort((a, b) => {
    const toMin = (s: string) => {
      if (s.includes('hr')) return parseFloat(s) * 60;
      return parseFloat(s);
    };
    return toMin(a.responseTime) - toMin(b.responseTime);
  });

  const ratedList = [...alumniData].sort((a, b) => b.rating - a.rating);

  const myGlobalRank = globalList.findIndex(a => a.id === MY_DATA.id) + 1;
  const actualRank = myGlobalRank === 0 ? 14 : myGlobalRank; // fallback if not in top 10

  const activeList = category === 'global' ? globalList
    : category === 'company' ? companyList
    : category === 'responders' ? responderList
    : ratedList;

  const top3 = globalList.slice(0, 3);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 font-inter">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-amber-500/20" />
          <div className="absolute inset-0 rounded-full border-2 border-t-amber-400 animate-spin" />
        </div>
        <p className="text-xs text-slate-400 font-medium tracking-wide">Recalculating AI Impact Scores...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left animate-fade-in-up font-inter">

      {/* ── Page Header ── */}
      <div className="relative rounded-2xl overflow-hidden border border-white/5 bg-gradient-to-br from-amber-950/25 via-[#07070a] to-yellow-950/15 p-6 md:p-8">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-500/3 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center shadow-lg">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-sora text-xl font-extrabold text-white flex items-center gap-2">
                  Hall of Fame
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/25 text-amber-400 uppercase tracking-wider">
                    Live
                  </span>
                </h1>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">Alumni Reputation Engine · NextInCampus</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
              Rankings are powered by our AI Impact Score — not just raw numbers. Quality mentorship, student outcomes, and response speed all count.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="text-right">
              <div className="text-[9px] text-slate-600 uppercase tracking-wider font-semibold">Resets</div>
              <div className="text-xs font-bold text-amber-400">{monthLabel}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Top 3 Podium ── */}
      {(category === 'global') && (
        <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md">
          <div className="flex items-center gap-2 mb-6">
            <Crown className="w-4 h-4 text-yellow-400" />
            <h2 className="font-sora text-sm font-extrabold text-white">
              Top Mentors — {timeRange === 'month' ? monthLabel : 'All Time'}
            </h2>
          </div>

          <div className="flex items-end justify-center gap-4 min-h-[200px] flex-wrap sm:flex-nowrap">
            {/* #2 */}
            {top3[1] ? (
              <div className="flex flex-col items-center gap-3 flex-1 max-w-[160px] min-w-[120px]">
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${top3[1].gradient} flex items-center justify-center text-white text-sm font-black shadow-xl ring-2 ring-slate-500/30`}>
                  {top3[1].initials}
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold text-white truncate max-w-[120px]">{top3[1].name}</div>
                  <div className="text-[9px] text-slate-500 truncate max-w-[120px]">{top3[1].company}</div>
                  <div className="font-sora font-extrabold text-slate-300 text-base mt-1">{top3[1].impactScore}</div>
                </div>
                <div className="w-full h-24 rounded-t-xl bg-gradient-to-t from-slate-700/40 to-slate-600/20 border border-white/5 flex items-end justify-center pb-2">
                  <span className="text-2xl">🥈</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 flex-1 max-w-[160px] min-w-[120px] opacity-40">
                <div className="w-14 h-14 rounded-full bg-slate-900 flex items-center justify-center text-slate-600 text-xs shrink-0 border border-white/5">-</div>
                <div className="text-center">
                  <div className="text-xs font-bold text-slate-600">Pending</div>
                  <div className="text-[9px] text-slate-700">-</div>
                </div>
                <div className="w-full h-24 rounded-t-xl bg-slate-900/40 border border-white/5" />
              </div>
            )}

            {/* #1 */}
            {top3[0] ? (
              <div className="flex flex-col items-center gap-3 flex-1 max-w-[160px] min-w-[120px]">
                <div className="relative">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${top3[0].gradient} flex items-center justify-center text-white text-sm font-black shadow-2xl ring-3 ring-amber-400/40`}>
                    {top3[0].initials}
                  </div>
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xl">👑</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold text-amber-300 truncate max-w-[120px]">{top3[0].name}</div>
                  <div className="text-[9px] text-slate-500 truncate max-w-[120px]">{top3[0].company}</div>
                  <div className="font-sora font-extrabold text-amber-400 text-lg mt-1">{top3[0].impactScore}</div>
                </div>
                <div className="w-full h-36 rounded-t-xl bg-gradient-to-t from-amber-700/30 to-amber-500/10 border border-amber-500/20 flex items-end justify-center pb-2">
                  <span className="text-3xl">🥇</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 flex-1 max-w-[160px] min-w-[120px] opacity-40">
                <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center text-slate-600 text-xs shrink-0 border border-white/5">-</div>
                <div className="text-center">
                  <div className="text-xs font-bold text-slate-600">Pending</div>
                  <div className="text-[9px] text-slate-700">-</div>
                </div>
                <div className="w-full h-36 rounded-t-xl bg-slate-900/40 border border-white/5" />
              </div>
            )}

            {/* #3 */}
            {top3[2] ? (
              <div className="flex flex-col items-center gap-3 flex-1 max-w-[160px] min-w-[120px]">
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${top3[2].gradient} flex items-center justify-center text-white text-sm font-black shadow-xl ring-2 ring-orange-500/30`}>
                  {top3[2].initials}
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold text-white truncate max-w-[120px]">{top3[2].name}</div>
                  <div className="text-[9px] text-slate-500 truncate max-w-[120px]">{top3[2].company}</div>
                  <div className="font-sora font-extrabold text-orange-300 text-base mt-1">{top3[2].impactScore}</div>
                </div>
                <div className="w-full h-16 rounded-t-xl bg-gradient-to-t from-orange-700/30 to-orange-500/10 border border-orange-500/15 flex items-end justify-center pb-2">
                  <span className="text-2xl">🥉</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 flex-1 max-w-[160px] min-w-[120px] opacity-40">
                <div className="w-14 h-14 rounded-full bg-slate-900 flex items-center justify-center text-slate-600 text-xs shrink-0 border border-white/5">-</div>
                <div className="text-center">
                  <div className="text-xs font-bold text-slate-600">Pending</div>
                  <div className="text-[9px] text-slate-700">-</div>
                </div>
                <div className="w-full h-16 rounded-t-xl bg-slate-900/40 border border-white/5" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Main Leaderboard + Sidebar ── */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Left: Leaderboard Table */}
        <div className="lg:col-span-2 space-y-4">

          {/* Category Tabs */}
          <div className="flex gap-1 p-1 rounded-xl bg-white/[0.02] border border-white/5 flex-wrap">
            {[
              { id: 'global',     label: 'Global',       icon: Trophy },
              { id: 'company',    label: 'By Company',   icon: Building2 },
              { id: 'responders', label: 'Fastest',      icon: Timer },
              { id: 'rated',      label: 'Top Rated',    icon: Star },
              { id: 'myrank',     label: 'My Rank',      icon: Target },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = category === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setCategory(tab.id as LeaderboardCategory)}
                  className={`flex-1 min-w-0 flex items-center justify-center gap-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? 'bg-amber-500/15 border border-amber-500/25 text-amber-400'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sub-controls */}
          {category === 'global' && (
            <div className="flex gap-2">
              {(['month', 'alltime'] as TimeRange[]).map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setTimeRange(r)}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-bold border transition-all ${
                    timeRange === r
                      ? 'bg-amber-500/15 border-amber-500/25 text-amber-400'
                      : 'border-white/5 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {r === 'month' ? `🗓 ${monthLabel}` : '♾ All Time'}
                </button>
              ))}
            </div>
          )}

          {category === 'company' && (
            <div className="flex gap-1.5 flex-wrap">
              {COMPANY_FILTERS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCompanyFilter(c)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all ${
                    companyFilter === c
                      ? 'bg-blue-500/15 border-blue-500/25 text-blue-400'
                      : 'border-white/5 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          {/* My Rank View */}
          {category === 'myrank' ? (
            <MyRankCard myRank={actualRank} myData={myRankData} />
          ) : (
            <div className="space-y-1.5">
              {activeList.length === 0 ? (
                <div className="text-center py-12 text-slate-600 text-sm font-semibold">
                  No mentors in this category yet.
                </div>
              ) : (
                activeList.map((entry, idx) => (
                  <LeaderboardRow
                    key={entry.id}
                    entry={entry}
                    rank={idx + 1}
                    view={category === 'responders' ? 'responders' : category === 'rated' ? 'rated' : 'global'}
                    onClick={() => setSelectedEntry(entry === selectedEntry ? null : entry)}
                    isSelected={selectedEntry?.id === entry.id}
                  />
                ))
              )}
            </div>
          )}
        </div>

        {/* Right: Detail Panel */}
        <div className="space-y-4">
          {selectedEntry && category !== 'myrank' ? (
            <ImpactBreakdown entry={selectedEntry} />
          ) : category !== 'myrank' ? (
            <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] text-center text-slate-600 text-xs font-semibold">
              Select a mentor to see their impact breakdown
            </div>
          ) : null}

          {/* Mentor Level Guide */}
          <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md">
            <h3 className="font-sora text-xs font-extrabold text-white mb-4 flex items-center gap-2">
              <Rocket className="w-3.5 h-3.5 text-violet-400" />
              Mentor Level Guide
            </h3>
            <div className="space-y-2">
              {MENTOR_LEVELS.map(l => (
                <div key={l.level} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border ${l.bg} transition-all`}>
                  <span className="text-base">{l.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className={`text-[10px] font-bold ${l.color}`}>{l.level}</div>
                    <div className="text-[8px] text-slate-600 font-medium">
                      {l.min}–{l.max === 9999 ? '1000+' : l.max} Impact Points
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Badge Showcase */}
          <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md">
            <h3 className="font-sora text-xs font-extrabold text-white mb-4 flex items-center gap-2">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              Badge Showcase
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                '🥇 Referral Champion',
                '🥈 Career Mentor',
                '🥉 Top Contributor',
                '⭐ Rising Mentor',
                '🚀 Fast Responder',
                '❤️ Most Helpful',
                '🎯 Impact Leader',
              ].map(badge => (
                <span key={badge} className="px-2.5 py-1.5 rounded-full text-[9px] font-bold bg-white/5 border border-white/10 text-slate-300">
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
