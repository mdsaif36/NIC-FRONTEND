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

      {/* ── Bottom Section: Text Promo Banner & Grayscale Logo Ticker ── */}
      <div className="w-full relative z-10 border-t border-white/5 bg-slate-950/65 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col items-center gap-6">
          
          {/* CTA Buttons Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            {/* Primary CTA */}
            <button
              onClick={() => {}}
              className="group relative inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full font-sora font-semibold text-sm text-white overflow-hidden transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #1a6bf5 0%, #7c3aed 50%, #ef4444 100%)',
                boxShadow: '0 0 24px rgba(26,107,245,0.35)',
              }}
            >
              <span className="relative z-10">Start for Free</span>
              <svg className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
            </button>

            {/* Alumni CTA */}
            <button
              onClick={() => {}}
              className="group inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full font-sora font-semibold text-sm text-white border border-white/15 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/30 transition-all duration-300"
            >
              <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
              </svg>
              I am Alumni
            </button>

            {/* College Verify CTA */}
            <button
              onClick={() => {}}
              className="group inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full font-sora font-semibold text-sm text-white border border-white/15 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/30 transition-all duration-300"
            >
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.745 3.745 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.745 3.745 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
              College Verify
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
