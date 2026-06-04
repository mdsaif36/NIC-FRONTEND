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
      {/* ── Background Image with Premium Lighter-Tone Fade ──────────────────────── */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
        {/* Background Image itself */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/vr_bg_hero.png')",
            opacity: 0.45, // Clearly visible backdrop artwork as requested
            filter: 'brightness(0.9) contrast(1.1) saturate(1.15)',
          }}
        />

        {/* Ambient Left Red Glow (blends with the left side of the artwork) */}
        <div 
          className="absolute top-1/2 left-[5vw] -translate-y-1/2 w-[50vw] h-[50vw] max-w-[600px] rounded-full blur-[120px]"
          style={{
            background: 'radial-gradient(circle, rgba(239,68,68,0.25) 0%, transparent 80%)',
          }}
        />

        {/* Ambient Right Blue Glow (blends with the right side of the artwork) */}
        <div 
          className="absolute top-1/2 right-[5vw] -translate-y-1/2 w-[50vw] h-[50vw] max-w-[600px] rounded-full blur-[120px]"
          style={{
            background: 'radial-gradient(circle, rgba(26,107,245,0.28) 0%, transparent 80%)',
          }}
        />

        {/* Dark radial overlay to vignette the edges and keep the text readable */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(2, 2, 5, 0.15) 0%, rgba(2, 2, 5, 0.95) 90%)',
          }}
        />
      </div>

      {/* ── Main Content Container ─────────────────────────────────────── */}
      <div className="relative z-10 flex-grow flex items-center pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6 w-full flex flex-col items-center justify-center text-center">
          
          {/* Headline & Subtext */}
          <div className={`flex flex-col items-center justify-center text-center font-inter transition-all duration-1000 transform ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            
            {/* Main Heading */}
            <h1 className="font-sora font-extrabold text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] tracking-tight mb-6 drop-shadow-[0_4px_20px_rgba(0,0,0,0.85)]">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-rose-400">
                Get Referred. Get Hired.
              </span>
              <br />
              No connections needed.
            </h1>

            {/* Subtext description */}
            <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl font-medium drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              A referral from an insider multiplies your interview chances by 10×. NexInCampus gives every student access to that inside track.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};
