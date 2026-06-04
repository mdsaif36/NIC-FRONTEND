import { useState, useEffect } from 'react';

interface HeroProps {
  onNavigate: (page: 'landing' | 'auth', mode?: 'login' | 'signup') => void;
}

export const Hero: React.FC<HeroProps> = () => {
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
            <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-2xl">
              A referral from an insider multiplies your interview chances by 10×. NexInCampus gives every student access to that inside track.
            </p>
          </div>

        </div>
      </div>

      {/* ── Bottom Section: Giant Brand Watermark with Sliced Tagline Cutout ── */}
      <div className="w-full overflow-hidden select-none pointer-events-none mt-12 mb-16 flex items-center justify-center relative h-32 md:h-44 bg-transparent z-10" aria-hidden="true">
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes watermarkShimmer {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-watermark-shimmer {
            background-size: 200% auto !important;
            animation: watermarkShimmer 7s ease-in-out infinite;
          }
        `}} />
        
        {/* Giant background text (NexInCampus shimmering design) */}
        <span
          className="animate-watermark-shimmer absolute"
          style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: 'clamp(2.5rem, 9vw, 8rem)',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            lineHeight: 1,
            background: 'linear-gradient(90deg, rgba(56,189,248,0.24) 0%, rgba(139,92,246,0.18) 25%, rgba(244,63,94,0.24) 50%, rgba(139,92,246,0.18) 75%, rgba(56,189,248,0.24) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            userSelect: 'none',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            display: 'block',
            zIndex: 0,
          }}
        >
          NexInCampus
        </span>

        {/* The Horizontal Cut/Slicing Bar masking the background text */}
        <div className="absolute w-full h-[24px] sm:h-[32px] md:h-[40px] bg-[#020205] flex items-center justify-center z-10 border-y border-white/5">
          {/* Tagline centered inside the cut */}
          <span className="text-center px-4 font-space-grotesk text-[8px] sm:text-[10px] md:text-[11px] font-extrabold tracking-[0.2em] sm:tracking-[0.3em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-rose-400 drop-shadow-[0_2px_8px_rgba(56,189,248,0.15)]">
            where your college network becomes your career
          </span>
        </div>
      </div>
    </section>
  );
};
