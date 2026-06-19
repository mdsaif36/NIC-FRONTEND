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
      {/* ── Background Ambient Glows (Dim light theme) ──────────────────────── */}
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

        {/* Dark radial overlay to vignette the edges */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(2, 2, 5, 0.05) 0%, rgba(2, 2, 5, 0.95) 90%)',
          }}
        />
      </div>

      {/* ── Main Content Container ─────────────────────────────────────── */}
      <div className="relative z-10 flex-grow flex items-center pt-24 pb-20 md:pb-28">
        <div className="max-w-7xl 3xl:max-w-[1500px] 4xl:max-w-[1800px] mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center justify-between">
          
          {/* Headline & Subtext Column */}
          <div className={`lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left font-inter transition-all duration-1000 transform ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            
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

          {/* Image Column with Fades */}
          <div className={`lg:col-span-7 relative flex items-center justify-center w-full h-full min-h-[350px] lg:min-h-[480px] transition-all duration-1000 delay-300 transform ${isMounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            {/* The Image element */}
            <img 
              src="/referral_flow_bg_v2.jpg" 
              alt="NextInCampus Referral Flow Diagram" 
              className="w-full h-auto max-h-[75vh] object-contain rounded-2xl relative z-0 select-none pointer-events-none"
            />
            {/* Edge Fade Gradients (desktop only) */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#020205] via-[#020205]/10 to-transparent z-10 pointer-events-none hidden lg:block" />
            <div className="absolute inset-0 bg-gradient-to-l from-[#020205] via-transparent to-transparent z-10 pointer-events-none hidden lg:block" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020205] via-transparent to-[#020205] z-10 pointer-events-none" />
          </div>

        </div>
      </div>
    </section>
  );
};
