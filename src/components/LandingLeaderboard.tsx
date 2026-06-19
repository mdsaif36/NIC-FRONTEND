import React, { useEffect, useRef, useState } from 'react';
import { Trophy, Star, ArrowRight, Award } from 'lucide-react';

interface TopMentor {
  id: number;
  name: string;
  company: string;
  role: string;
  initials: string;
  impactScore: number;
  offers: number;
  rating: number;
  responseRate: number;
  level: string;
  levelIcon: string;
  gradient: string;
  badge: string;
  badgeIcon: string;
}

const TOP_MENTORS: TopMentor[] = [
  {
    id: 1,
    name: 'Rahul Sharma',
    company: 'Google',
    role: 'SDE II',
    initials: 'RS',
    impactScore: 942,
    offers: 14,
    rating: 4.97,
    responseRate: 97,
    level: 'Hall of Fame',
    levelIcon: '👑',
    gradient: 'from-amber-500 to-orange-500',
    badge: '🥇 Referral Champion',
    badgeIcon: '🥇',
  },
  {
    id: 2,
    name: 'Priya Singh',
    company: 'Microsoft',
    role: 'SWE',
    initials: 'PS',
    impactScore: 891,
    offers: 11,
    rating: 4.95,
    responseRate: 95,
    level: 'Hall of Fame',
    levelIcon: '👑',
    gradient: 'from-violet-500 to-purple-600',
    badge: '🥈 Career Mentor',
    badgeIcon: '🥈',
  },
  {
    id: 3,
    name: 'Aman Verma',
    company: 'Amazon',
    role: 'SDE',
    initials: 'AV',
    impactScore: 867,
    offers: 10,
    rating: 4.92,
    responseRate: 93,
    level: 'Elite Mentor',
    levelIcon: '🏆',
    gradient: 'from-blue-500 to-cyan-500',
    badge: '🥉 Top Contributor',
    badgeIcon: '🥉',
  },
];



interface Props {
  onNavigate?: (page: 'landing' | 'auth', mode?: 'login' | 'signup') => void;
}

export const LandingLeaderboard: React.FC<Props> = ({ onNavigate }) => {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="leaderboard"
      className="relative py-24 md:py-32 overflow-hidden bg-transparent"
    >
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500/4 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/3 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl 3xl:max-w-[1500px] 4xl:max-w-[1800px] mx-auto px-6">



        {/* Section Header */}
        <div
          className={`text-center mb-14 transition-all duration-700 delay-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold tracking-widest uppercase mb-5">
            <Trophy className="w-3.5 h-3.5" />
            Alumni Reputation Engine
          </div>
          <h2 className="font-sora font-extrabold text-3xl md:text-5xl text-white leading-tight tracking-tight mb-4">
            🏆 Top Mentors This Month
          </h2>
          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Every mentor is ranked by our AI <span className="text-amber-400 font-bold">Impact Score</span> — measuring referral quality, student outcomes, response speed, and ratings. Not just raw numbers.
          </p>
        </div>

        {/* Mentor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {TOP_MENTORS.map((mentor, i) => {
            const rankLabels = ['', '🥇 #1', '🥈 #2', '🥉 #3'];
            const isFirst = i === 0;
            return (
              <div
                key={mentor.id}
                className={`relative rounded-2xl border overflow-hidden transition-all duration-700 group hover:-translate-y-1 hover:shadow-2xl cursor-default ${
                  isFirst
                    ? 'border-amber-500/30 bg-gradient-to-br from-amber-950/30 via-[#07070a] to-orange-950/20 shadow-[0_0_40px_rgba(245,158,11,0.06)]'
                    : 'border-white/5 bg-white/[0.02] backdrop-blur-md'
                }`}
                style={{ transitionDelay: `${200 + i * 100}ms`, opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(32px)' }}
              >
                {/* Glow */}
                {isFirst && (
                  <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/8 rounded-full blur-3xl pointer-events-none" />
                )}

                {/* Crown for #1 */}
                {isFirst && (
                  <div className="absolute top-3 right-3 text-2xl select-none">👑</div>
                )}

                <div className="relative z-10 p-6">
                  {/* Rank badge */}
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold mb-4 border ${
                    i === 0 ? 'bg-amber-500/15 border-amber-500/25 text-amber-400' :
                    i === 1 ? 'bg-slate-500/15 border-slate-500/25 text-slate-300' :
                    'bg-orange-600/15 border-orange-500/25 text-orange-400'
                  }`}>
                    {rankLabels[i + 1]} Mentor
                  </div>

                  {/* Avatar + name */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${mentor.gradient} flex items-center justify-center text-white text-base font-black shadow-xl ring-2 ${isFirst ? 'ring-amber-400/30' : 'ring-white/10'}`}>
                      {mentor.initials}
                    </div>
                    <div>
                      <div className={`font-sora font-extrabold text-sm ${isFirst ? 'text-amber-300' : 'text-white'}`}>
                        {mentor.name}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">{mentor.role}</div>
                      <div className={`flex items-center gap-1 mt-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full w-fit ${
                        isFirst ? 'bg-amber-500/15 text-amber-400' : 'bg-blue-500/10 text-blue-400'
                      }`}>
                        <span>{mentor.company}</span>
                      </div>
                    </div>
                  </div>

                  {/* Level */}
                  <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg mb-4 border ${
                    isFirst
                      ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-300'
                      : 'bg-white/5 border-white/8 text-slate-400'
                  }`}>
                    <span className="text-sm">{mentor.levelIcon}</span>
                    <span className="text-[10px] font-bold">{mentor.level}</span>
                  </div>

                  {/* Impact Score */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className={`font-sora text-3xl font-extrabold ${isFirst ? 'text-amber-400' : 'text-white'}`}>
                        {mentor.impactScore}
                      </div>
                      <div className="text-[9px] text-slate-600 font-semibold uppercase tracking-wider">Impact Score</div>
                    </div>
                    <div className="flex flex-col gap-1 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-[10px] font-bold text-amber-400">{mentor.rating}</span>
                      </div>
                      <div className="text-[9px] text-slate-600">Rating</div>
                    </div>
                  </div>

                  {/* Score bar */}
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden mb-4">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${mentor.gradient}`}
                      style={{ width: `${(mentor.impactScore / 1000) * 100}%`, opacity: 0.8 }}
                    />
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/5">
                    {[
                      { label: 'Offers', value: mentor.offers },
                      { label: 'Response', value: `${mentor.responseRate}%` },
                    ].map(s => (
                      <div key={s.label} className="text-center">
                        <div className="font-sora font-extrabold text-white text-sm">{s.value}</div>
                        <div className="text-[8px] text-slate-600 font-semibold uppercase">{s.label}</div>
                      </div>
                    ))}
                    <div className="text-center">
                      <div className="text-base">{mentor.badgeIcon}</div>
                      <div className="text-[8px] text-slate-600 font-semibold uppercase">Badge</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom row: CTA + Rank Info */}
        <div
          className={`flex flex-col md:flex-row items-center justify-between gap-6 p-6 md:p-8 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md transition-all duration-700 delay-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 mb-1 justify-center md:justify-start">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-white uppercase tracking-widest">Build Your Reputation</span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Alumni who mentor juniors earn <span className="text-amber-400 font-bold">Impact Points</span>, unlock badges, and climb the Hall of Fame — making their profile the most sought-after on campus.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate?.('auth', 'signup')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-sora font-extrabold text-xs uppercase tracking-wider hover:opacity-90 transition shadow-lg hover:shadow-amber-500/20"
            >
              Join as Alumni
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate?.('auth', 'login')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 text-white font-sora font-bold text-xs uppercase tracking-wider hover:border-white/25 hover:bg-white/5 transition"
            >
              View Full Rankings
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
