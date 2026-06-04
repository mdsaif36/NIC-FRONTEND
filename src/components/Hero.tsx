import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onNavigate: (page: 'landing' | 'auth', mode?: 'login' | 'signup') => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-transparent select-none"
    >
      {/* ── Background Gradients & Glow Orbs (No animations, bluish + red, adaptive) ──────────────────────── */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none" aria-hidden="true">
        {/* Adaptive Radial Blend */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(26,107,245,0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 50% 50%, rgba(239,68,68,0.08) 0%, transparent 50%)',
          }}
        />
        {/* Static Adaptive Bluish Glow Orb */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[55vw] h-[55vw] max-w-[600px] max-h-[600px] min-w-[280px] min-h-[280px] rounded-full blur-[100px] md:blur-[140px]"
          style={{
            background: 'radial-gradient(circle, rgba(26,107,245,0.28) 0%, transparent 70%)',
          }}
        />
        {/* Static Adaptive Red/Rose Glow Orb */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[45vw] h-[45vw] max-w-[500px] max-h-[500px] min-w-[240px] min-h-[240px] rounded-full blur-[100px] md:blur-[140px]"
          style={{
            background: 'radial-gradient(circle, rgba(239,68,68,0.18) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* ── Main Content Container ─────────────────────────────────────── */}
      <div className="relative z-10 flex-grow flex items-center pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6 w-full flex flex-col items-center justify-center text-center">
          
          {/* Headline & CTA Buttons */}
          <div className={`flex flex-col items-center justify-center text-center font-inter transition-all duration-1000 transform ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            
            {/* Main Heading */}
            <h1 className="font-sora font-extrabold text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] tracking-tight mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-rose-400">
                Get Referred. Get Hired.
              </span>
              <br />
              No connections needed.
            </h1>

            {/* Subtext description */}
            <p className="text-slate-350 text-sm md:text-base leading-relaxed max-w-2xl mb-8">
              A referral from an insider multiplies your interview chances by 10×. NextInCampus gives every student access to that inside.
            </p>

            {/* Custom Pill Button Row */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-8">
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
            <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-5 text-[11px] text-slate-400 font-medium select-none">
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
