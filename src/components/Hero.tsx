import { useState, useEffect, useRef } from 'react';
import { Volume2, Video, Pause, Play, Star, ArrowRight } from 'lucide-react';

interface HeroProps {
  onNavigate: (page: 'landing' | 'auth', mode?: 'login' | 'signup') => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const container = feedRef.current;
    if (!container) return;

    let scrollAmount = 0;
    const step = 0.45; // Smooth scroll rate
    let direction = 1;
    let pauseCounter = 0;

    const scrollInterval = setInterval(() => {
      if (!container) return;
      
      const maxScroll = container.scrollHeight - container.clientHeight;
      if (maxScroll <= 0) return;

      if (pauseCounter > 0) {
        pauseCounter--;
        return;
      }

      scrollAmount += step * direction;

      if (scrollAmount >= maxScroll) {
        scrollAmount = maxScroll;
        direction = -1;
        pauseCounter = 60; // Pause at bottom
      } else if (scrollAmount <= 0) {
        scrollAmount = 0;
        direction = 1;
        pauseCounter = 60; // Pause at top
      }

      container.scrollTop = scrollAmount;
    }, 30);

    return () => clearInterval(scrollInterval);
  }, [isMounted]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-transparent select-none"
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(var(--r, 0deg)); }
          50% { transform: translateY(-8px) rotate(var(--r, 0deg)); }
        }
        .animate-float-card {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes waveform {
          0%, 100% { height: 8px; }
          50% { height: 28px; }
        }
        .waveform-bar {
          animation: waveform 1.2s ease-in-out infinite alternate;
        }
        .waveform-bar:nth-child(2) { animation-delay: 0.15s; }
        .waveform-bar:nth-child(3) { animation-delay: 0.3s; }
        .waveform-bar:nth-child(4) { animation-delay: 0.45s; }
        .waveform-bar:nth-child(5) { animation-delay: 0.6s; }
        .waveform-bar:nth-child(6) { animation-delay: 0.2s; }
        .waveform-bar:nth-child(7) { animation-delay: 0.35s; }
        .waveform-bar:nth-child(8) { animation-delay: 0.5s; }
      `}} />

      {/* ── Background Gradients & Glow Orbs (No animations, bluish + red, adaptive) ──────────────────────── */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none" aria-hidden="true">
        {/* Adaptive Radial Blend */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 20% 30%, rgba(26,107,245,0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 85% 45%, rgba(239,68,68,0.08) 0%, transparent 50%)',
          }}
        />
        {/* Static Adaptive Bluish Glow Orb */}
        <div
          className="absolute -top-16 -right-16 w-[55vw] h-[55vw] max-w-[600px] max-h-[600px] min-w-[280px] min-h-[280px] rounded-full blur-[100px] md:blur-[140px]"
          style={{
            background: 'radial-gradient(circle, rgba(26,107,245,0.28) 0%, transparent 70%)',
          }}
        />
        {/* Static Adaptive Red/Rose Glow Orb */}
        <div
          className="absolute -bottom-16 -left-16 w-[45vw] h-[45vw] max-w-[500px] max-h-[500px] min-w-[240px] min-h-[240px] rounded-full blur-[100px] md:blur-[140px]"
          style={{
            background: 'radial-gradient(circle, rgba(239,68,68,0.18) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* ── Main Content Grid ─────────────────────────────────────── */}
      <div className="relative z-10 flex-grow flex items-center pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6 w-full grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* ── Left Column: Headline & CTA Buttons (Column Span 5) ── */}
          <div className={`flex flex-col items-start font-inter lg:col-span-5 transition-all duration-1000 transform ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            
            {/* Main Heading */}
            <h1 className="font-sora font-extrabold text-4xl md:text-5xl lg:text-5xl xl:text-6xl text-white leading-[1.1] tracking-tight mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-rose-400">
                Get Referred. Get Hired.
              </span>
              <br />
              No connections needed.
            </h1>

            {/* Subtext description */}
            <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-md mb-8">
              NextInCampus registers college networks, validates student qualifications, and enables verified alumni to issue referrals instantly — without manual outreach.
            </p>

            {/* Custom Pill Button Row */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-8">
              {/* Start for free pill with nested arrow circle */}
              <button
                id="hero-start-free-btn"
                onClick={() => onNavigate('auth', 'signup')}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:opacity-95 text-white font-bold text-sm tracking-wide transition-all duration-300 hover:scale-105 shadow-[0_4px_20px_rgba(168,85,247,0.3)] shrink-0"
              >
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </div>
                <span>Start for free</span>
              </button>

              {/* I'm an Alumni outline pill */}
              <button
                id="hero-alumni-btn"
                onClick={() => onNavigate('auth', 'signup')}
                className="w-full sm:w-auto px-6 py-3 rounded-full border border-white/20 hover:border-white/40 text-slate-200 hover:text-white font-semibold text-sm tracking-wide transition-all duration-300 bg-white/5 hover:bg-white/10 hover:scale-105"
              >
                I'm an Alumni
              </button>
            </div>

            {/* Bulleted trust indicators */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-[11px] text-slate-400 font-medium select-none">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> College-verified
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" /> Cancel anytime
              </span>
            </div>
          </div>

          {/* ── Right Column: Interactive Phone & Floating Video Cards (Column Span 7) ── */}
          <div className={`relative flex justify-center items-center lg:col-span-7 w-full h-[500px] transition-all duration-1000 delay-300 transform ${isMounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            
            {/* SVG Connecting Curved Line (Guy with glasses -> Center Phone) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none hidden md:block" fill="none" viewBox="0 0 500 500">
              <path
                d="M 100,160 Q 180,190 220,240"
                stroke="url(#connector-grad)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                className="opacity-60"
              />
              <defs>
                <linearGradient id="connector-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#38BDF8" />
                </linearGradient>
              </defs>
            </svg>

            {/* Sparkle node along the connecting path */}
            <div
              className="absolute pointer-events-none hidden md:block bg-gradient-to-r from-purple-500 to-cyan-400 w-4 h-4 rounded-full flex items-center justify-center shadow-lg animate-pulse"
              style={{ left: '30%', top: '35%' }}
            >
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
            </div>

            {/* ── Center Phone Mockup ── */}
            <div className="relative w-64 h-[380px] md:w-72 md:h-[420px] rounded-[2.5rem] border border-white/10 bg-slate-950/80 backdrop-blur-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8),0_0_40px_rgba(56,189,248,0.05)] overflow-hidden flex flex-col p-4 z-20">
              {/* Phone Speaker Notch */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-20 h-4 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center">
                <span className="w-6 h-[2px] bg-slate-800 rounded-full" />
              </div>

              {/* Title Section */}
              <div className="text-center mt-6">
                <h3 className="text-xs font-bold text-slate-200 tracking-wide">IIT Delhi Hub / Referral Room</h3>
                <p className="text-[9px] text-slate-500 mt-0.5">Live Connection Handshake</p>
              </div>

              {/* Speech Waveform Area */}
              <div className="flex items-end justify-center gap-1.5 h-16 my-4 px-4 bg-slate-900/60 rounded-2xl border border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 pointer-events-none" />
                
                <span className={`w-1 bg-cyan-400 rounded-full ${isPlaying ? 'waveform-bar' : 'h-2'}`} style={{ '--r': '0deg' } as any} />
                <span className={`w-1 bg-cyan-500 rounded-full ${isPlaying ? 'waveform-bar' : 'h-2'}`} style={{ '--r': '0deg' } as any} />
                <span className={`w-1 bg-indigo-400 rounded-full ${isPlaying ? 'waveform-bar' : 'h-2'}`} style={{ '--r': '0deg' } as any} />
                <span className={`w-1 bg-indigo-500 rounded-full ${isPlaying ? 'waveform-bar' : 'h-2'}`} style={{ '--r': '0deg' } as any} />
                <span className={`w-1 bg-purple-400 rounded-full ${isPlaying ? 'waveform-bar' : 'h-2'}`} style={{ '--r': '0deg' } as any} />
                <span className={`w-1 bg-purple-500 rounded-full ${isPlaying ? 'waveform-bar' : 'h-2'}`} style={{ '--r': '0deg' } as any} />
                <span className={`w-1 bg-rose-400 rounded-full ${isPlaying ? 'waveform-bar' : 'h-2'}`} style={{ '--r': '0deg' } as any} />
                <span className={`w-1 bg-rose-50 rounded-full ${isPlaying ? 'waveform-bar' : 'h-2'}`} style={{ '--r': '0deg' } as any} />
              </div>

              {/* Timer and Status Indicator */}
              <div className="flex items-center justify-between px-2 mb-3">
                <span className="text-[10px] text-slate-450 font-mono flex items-center gap-1">
                  ⏱️ 00:05:39
                </span>
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold tracking-wider uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Verified
                </span>
              </div>

              {/* Dialogue Transcript Bubble (Mentors advice) */}
              <div className="flex flex-col gap-2 flex-grow overflow-y-auto no-scrollbar mask-scroll-fade">
                
                {/* Rohan's card overlaying the phone */}
                <div className="p-3 bg-white/[0.04] border border-white/10 rounded-2xl shadow-xl flex items-start gap-2.5">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                    alt="Rohan K."
                    className="w-7 h-7 rounded-full object-cover border border-white/15"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-200">Rohan K. (Alumni)</span>
                      <span className="text-[8px] bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 px-1 py-0.2 rounded font-semibold uppercase">Google SWE</span>
                    </div>
                    <p className="text-[10px] text-slate-300 mt-1 leading-relaxed">
                      Hey Amit! I've reviewed your IITD project and resume. I will submit your referral to Google's internal portal today.
                    </p>
                  </div>
                </div>

                {/* Subtext dialogue history */}
                <div ref={feedRef} className="px-2 space-y-1.5 pb-4 overflow-y-auto no-scrollbar max-h-[90px]">
                  <div className="text-[9px] leading-relaxed">
                    <span className="font-bold text-slate-350">Amit (Student):</span> <span className="text-slate-400">Awesome, thank you Rohan! Any suggestions for the technical rounds?</span>
                  </div>
                  <div className="text-[9px] leading-relaxed">
                    <span className="font-bold text-slate-350">Rohan:</span> <span className="text-slate-400">Focus on system design. Let's schedule a mock session on NiC next week.</span>
                  </div>
                </div>

              </div>

              {/* Pause/Resume Overlay Button */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-slate-900 border border-white/10 hover:border-white/30 flex items-center justify-center text-slate-300 hover:text-white transition-all shadow-md z-30"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
              </button>
            </div>

            {/* ── Top-Right Floating Review Badge ── */}
            <div className="absolute top-8 right-6 md:right-12 bg-slate-900/90 border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg backdrop-blur-md z-30 select-none transform hover:scale-105 transition-all duration-300">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-[9px] font-bold text-slate-200 tracking-wide">
                98% Success
              </span>
              <span className="text-[8px] text-slate-500 border-l border-white/10 pl-2">
                Verified Referrals
              </span>
            </div>

            {/* ── 4 Floating Video Chat Cards ── */}

            {/* Card 1: Top Left (Guy with glasses - Connected) */}
            <div
              className="absolute top-12 left-2 md:left-10 w-20 h-20 md:w-24 md:h-24 rounded-2xl border-2 border-white/10 bg-slate-950 overflow-hidden shadow-2xl flex flex-col justify-end animate-float-card group hover:scale-105 hover:border-purple-500/40 transition-all duration-300 z-30"
              style={{ '--r': '-2deg' } as any}
            >
              <img
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80"
                alt="Alumni profile"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="relative p-1 bg-black/60 backdrop-blur-sm border-t border-white/5 flex items-center justify-between z-10">
                <span className="text-[8px] font-bold text-slate-200 pl-1 font-inter">Amit (Student)</span>
                <Volume2 className="w-2.5 h-2.5 text-cyan-400" />
              </div>
            </div>

            {/* Card 2: Top Right (Woman with glasses) */}
            <div
              className="absolute top-20 right-2 md:right-8 w-20 h-20 md:w-24 md:h-24 rounded-2xl border-2 border-white/10 bg-slate-950 overflow-hidden shadow-2xl flex flex-col justify-end animate-float-card group hover:scale-105 hover:border-indigo-500/40 transition-all duration-300 z-10"
              style={{ '--r': '3deg', animationDelay: '1.5s' } as any}
            >
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
                alt="Alumni profile"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="relative p-1 bg-black/60 backdrop-blur-sm border-t border-white/5 flex items-center justify-between z-10">
                <span className="text-[8px] font-bold text-slate-200 pl-1 font-inter">Karan (SWE)</span>
                <Video className="w-2.5 h-2.5 text-slate-400" />
              </div>
            </div>

            {/* Card 3: Bottom Left (Woman profile) */}
            <div
              className="absolute bottom-16 left-4 md:left-12 w-20 h-20 md:w-24 md:h-24 rounded-2xl border-2 border-white/10 bg-slate-950 overflow-hidden shadow-2xl flex flex-col justify-end animate-float-card group hover:scale-105 hover:border-pink-500/40 transition-all duration-300 z-30"
              style={{ '--r': '1.5deg', animationDelay: '0.8s' } as any}
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                alt="Student profile"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="relative p-1 bg-black/60 backdrop-blur-sm border-t border-white/5 flex items-center justify-between z-10">
                <span className="text-[8px] font-bold text-slate-200 pl-1 font-inter">Neha (PM)</span>
                <Video className="w-2.5 h-2.5 text-cyan-400" />
              </div>
            </div>

            {/* Card 4: Bottom Right (Woman with glasses profile) */}
            <div
              className="absolute bottom-12 right-4 md:right-10 w-20 h-20 md:w-24 md:h-24 rounded-2xl border-2 border-white/10 bg-slate-950 overflow-hidden shadow-2xl flex flex-col justify-end animate-float-card group hover:scale-105 hover:border-orange-500/40 transition-all duration-300 z-10"
              style={{ '--r': '-2.5deg', animationDelay: '2.2s' } as any}
            >
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
                alt="Student profile"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="relative p-1 bg-black/60 backdrop-blur-sm border-t border-white/5 flex items-center justify-between z-10">
                <span className="text-[8px] font-bold text-slate-200 pl-1 font-inter">Sofia (Recruiter)</span>
                <Volume2 className="w-2.5 h-2.5 text-slate-400" />
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ── Bottom Section: Text Promo Banner & Grayscale Logo Ticker ── */}
      <div className="w-full relative z-10 border-t border-white/5 bg-slate-950/65 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col items-center gap-6">
          
          {/* Promo Text Banner */}
          <div className="flex items-center flex-wrap justify-center gap-x-2 gap-y-1 text-xs text-slate-350 select-none">
            <span>Verify your college domain to unlock exclusive placement networks</span>
            <button
              onClick={() => onNavigate('auth', 'signup')}
              className="text-white font-bold hover:underline inline-flex items-center gap-1 transition-all duration-200 group"
            >
              Find your college 
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Grayscale partner logos strip matching the reference design layout */}
          <div className="w-full border-t border-white/5 pt-5 pb-1 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 md:gap-x-16 select-none opacity-40 hover:opacity-60 transition-opacity duration-300">
            
            {/* Google */}
            <span className="font-sora text-sm font-extrabold tracking-tight">
              GOOGLE
            </span>

            {/* Microsoft */}
            <span className="font-sora text-sm font-extrabold tracking-tight">
              MICROSOFT
            </span>

            {/* Amazon */}
            <span className="font-sora text-sm font-extrabold tracking-tight">
              AMAZON
            </span>

            {/* Meta */}
            <span className="font-sora text-sm font-extrabold tracking-tight">
              META
            </span>

            {/* Flipkart */}
            <span className="font-sora text-sm font-extrabold tracking-tight">
              FLIPKART
            </span>

            {/* Netflix */}
            <span className="font-sora text-sm font-extrabold tracking-tight">
              NETFLIX
            </span>
          </div>

        </div>
      </div>
    </section>
  );
};
