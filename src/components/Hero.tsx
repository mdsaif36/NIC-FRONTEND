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
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-transparent select-none"
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
    </section>
  );
};
