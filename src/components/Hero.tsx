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
      {/* ── Background Ambient Glows & Logo Watermark (Dim light theme) ──────── */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden bg-[#020205]" aria-hidden="true">
        {/* Ambient Left Red Glow (very dim) */}
        <div 
          className="absolute top-1/2 left-[5vw] -translate-y-1/2 w-[50vw] h-[50vw] max-w-[600px] rounded-full blur-[140px]"
          style={{
            background: 'radial-gradient(circle, rgba(239,68,68,0.06) 0%, transparent 80%)',
          }}
        />

        {/* Ambient Right Blue Glow (very dim) */}
        <div 
          className="absolute top-1/2 right-[5vw] -translate-y-1/2 w-[50vw] h-[50vw] max-w-[600px] rounded-full blur-[140px]"
          style={{
            background: 'radial-gradient(circle, rgba(26,107,245,0.08) 0%, transparent 80%)',
          }}
        />

        {/* Static Referral Flow Background Image (Flat, non-3D) */}
        <div className={`absolute inset-0 w-full h-full transition-all duration-1000 transform ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
          <img 
            src="/referral_flow_bg_v2.jpg" 
            alt="NextInCampus Referral Flow Background" 
            className="w-full h-full object-contain opacity-75 md:opacity-90 select-none pointer-events-none"
          />
        </div>

        {/* Dark radial overlay to vignette the edges and keep the text perfectly readable */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60"
        />
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(2, 2, 5, 0.15) 0%, rgba(2, 2, 5, 0.85) 95%)',
          }}
        />
      </div>

      {/* ── Main Content Container ─────────────────────────────────────── */}
      <div className="relative z-10 flex-grow flex items-end pt-24 pb-14 md:pb-16">
        <div className="max-w-4xl mx-auto px-6 w-full flex flex-col items-center text-center">
          
          {/* Headline & Subtext Column */}
          <div className={`flex flex-col items-center text-center font-inter transition-all duration-1000 transform ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            
            {/* Main Heading */}
            <h1 className="font-sora font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] tracking-tight mb-5 drop-shadow-[0_4px_20px_rgba(0,0,0,0.85)]">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-rose-400">
                Get Referred. Get Hired.
              </span>
              <br />
              No connections needed.
            </h1>

            {/* Subtext description */}
            <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl font-medium drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] mb-0">
              A referral from an insider multiplies your interview chances by 10×. NexInCampus gives every student access to that inside track.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};
