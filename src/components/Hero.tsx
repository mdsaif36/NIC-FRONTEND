import { useState, useEffect } from 'react';

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
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-transparent select-none"
    >
      {/* ── Background Ambient Glows & Logo Watermark (Dim light theme) ──────── */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
        {/* Ambient Left Red Glow (very dim) */}
        <div 
          className="absolute top-1/2 left-[5vw] -translate-y-1/2 w-[50vw] h-[50vw] max-w-[600px] rounded-full blur-[140px]"
          style={{
            background: 'radial-gradient(circle, rgba(239,68,68,0.1) 0%, transparent 80%)',
          }}
        />

        {/* Ambient Right Blue Glow (very dim) */}
        <div 
          className="absolute top-1/2 right-[5vw] -translate-y-1/2 w-[50vw] h-[50vw] max-w-[600px] rounded-full blur-[140px]"
          style={{
            background: 'radial-gradient(circle, rgba(26,107,245,0.12) 0%, transparent 80%)',
          }}
        />

        {/* Spotlight Glow Behind the Logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[85vw] h-[85vw] max-w-[700px] rounded-full bg-gradient-to-tr from-[#FF1E3C]/4 via-purple-600/3 to-[#1E40FF]/5 blur-[120px] pointer-events-none" />
        </div>

        {/* Static Watermark Background Image */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 delay-300 transform ${isMounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <img 
            src="/nic_3d_logo.png" 
            alt="NextInCampus Logo Watermark" 
            className="w-full max-w-[280px] sm:max-w-[420px] md:max-w-[560px] aspect-[3/4] object-contain animate-float opacity-[0.14] sm:opacity-[0.18] select-none pointer-events-none blur-[1px]"
          />
        </div>

        {/* Dark radial overlay to vignette the edges and keep the text perfectly readable */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(2, 2, 5, 0.02) 0%, rgba(2, 2, 5, 0.96) 95%)',
          }}
        />
      </div>

      {/* ── Main Content Container ─────────────────────────────────────── */}
      <div className="relative z-10 flex-grow flex items-center pt-24 pb-20 md:pb-28">
        <div className="max-w-4xl mx-auto px-6 w-full flex flex-col items-center text-center">
          
          {/* Headline & Subtext Column */}
          <div className={`flex flex-col items-center text-center font-inter transition-all duration-1000 transform ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            
            {/* Main Heading */}
            <h1 className="font-sora font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] tracking-tight mb-6 drop-shadow-[0_4px_20px_rgba(0,0,0,0.85)]">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-rose-400">
                Get Referred. Get Hired.
              </span>
              <br />
              No connections needed.
            </h1>

            {/* Subtext description */}
            <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl font-medium drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] mb-8">
              A referral from an insider multiplies your interview chances by 10×. NexInCampus gives every student access to that inside track.
            </p>

            {/* CTA Buttons with responsive layouts & premium glassmorphism */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto shrink-0">
              {/* Seeker CTA Button */}
              <button
                type="button"
                onClick={() => onNavigate('auth', 'login')}
                className="w-full sm:w-auto relative group overflow-hidden px-8 py-3.5 rounded-full text-white font-sora font-semibold text-sm tracking-wide shadow-[0_0_20px_rgba(255,30,60,0.12)] hover:shadow-[0_0_30px_rgba(255,30,60,0.35)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
              >
                {/* Background Shifting Gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF1E3C] via-[#8B5CF6] to-[#1E40FF] transition-all duration-500 z-0" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300 z-0" />
                
                <div className="relative z-10 flex items-center justify-center gap-2">
                  <span>Access Seeker Portal</span>
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </button>

              {/* Alumni CTA Button */}
              <button
                type="button"
                onClick={() => onNavigate('auth', 'login')}
                className="w-full sm:w-auto relative group overflow-hidden px-8 py-3.5 rounded-full text-slate-200 font-sora font-semibold text-sm tracking-wide border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
              >
                {/* Neon Border Glow */}
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#1E40FF] to-[#FF1E3C] opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-500 z-0" />
                
                <div className="relative z-10 flex items-center justify-center gap-2">
                  <span>Enter Alumni Portal</span>
                  <svg className="w-4 h-4 text-slate-400 group-hover:text-white transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
