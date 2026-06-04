import React, { useState } from 'react';
import { Mail } from 'lucide-react';

interface AvatarProps {
  initials: string;
  color: string;
  offset: string;
}

const avatars: AvatarProps[] = [
  { initials: 'AK', color: 'bg-blue-500 border-blue-400/30', offset: 'z-30' },
  { initials: 'RS', color: 'bg-indigo-500 border-indigo-400/30', offset: '-ml-3 z-20' },
  { initials: 'PM', color: 'bg-slate-700 border-slate-600/30', offset: '-ml-3 z-10' },
];

interface CTABannerProps {
  onNavigate: (page: 'landing' | 'auth', mode?: 'login' | 'signup') => void;
}

export const CTABanner: React.FC<CTABannerProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onNavigate('auth', 'signup');
    }
  };

  return (
    <section
      id="cta"
      className="relative w-full overflow-hidden bg-transparent py-24 border-t border-white/5"
    >
      {/* Radial gradient background accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 select-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(99,102,241,0.12) 0%, rgba(26,107,245,0.04) 50%, transparent 80%)',
        }}
      />

      {/* Floating particles background wrapper */}
      <style dangerouslySetInnerHTML={{ __html: `
        .cta-particles::before,
        .cta-particles::after {
          content: '';
          position: absolute;
          border-radius: 9999px;
          pointer-events: none;
          opacity: 0;
          animation: ctaFloat 8s ease-in-out infinite;
        }

        .cta-particles::before {
          width: 3px;
          height: 3px;
          top: 18%;
          left: 12%;
          background: rgba(139, 92, 246, 0.6);
          box-shadow:
            68vw  8vh  2px rgba(26,107,245,0.45),
            25vw 60vh  1.5px rgba(255,255,255,0.35),
            82vw 45vh  2px rgba(139, 92, 246, 0.35),
            40vw 20vh  1px rgba(255,255,255,0.25),
            55vw 75vh  2px rgba(26,107,245,0.3),
            10vw 80vh  1.5px rgba(255,255,255,0.2),
            90vw 25vh  1px rgba(139, 92, 246, 0.35),
            35vw 85vh  2px rgba(255,255,255,0.18);
          animation-delay: 0s;
        }

        .cta-particles::after {
          width: 2px;
          height: 2px;
          top: 55%;
          left: 75%;
          background: rgba(255,255,255,0.4);
          box-shadow:
            -50vw -20vh 2px rgba(26,107,245,0.4),
            -30vw  15vh 1.5px rgba(255,255,255,0.3),
            -65vw  30vh 1px rgba(139, 92, 246, 0.35),
            15vw  -35vh 2px rgba(255,255,255,0.2),
            -20vw -40vh 1.5px rgba(139, 92, 246, 0.25),
            30vw   10vh 1px rgba(26,107,245,0.3),
            -45vw  40vh 2px rgba(255,255,255,0.15);
          animation-delay: 4s;
        }

        @keyframes ctaFloat {
          0%, 100% {
            opacity: 0.35;
            transform: translateY(0px);
          }
          50% {
            opacity: 0.8;
            transform: translateY(-12px);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}} />
      
      <div aria-hidden="true" className="cta-particles absolute inset-0 pointer-events-none select-none" />

      {/* ── Main content (Wrapped inside a premium glassmorphic card) ── */}
      <div className="relative z-10 mx-auto max-w-5xl px-6">
        <div 
          className="relative w-full rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl transition-all duration-300 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6),0_0_40px_rgba(59,130,246,0.03)] hover:border-blue-500/20 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),0_0_50px_rgba(59,130,246,0.1)] font-inter"
        >
          <div className="relative rounded-3xl bg-slate-950/45 backdrop-blur-2xl p-10 md:p-16 text-center overflow-hidden border-t border-l border-white/10">
          
          {/* Card Ambient Glow Orbs */}
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-blue-500/5 blur-[80px] pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-indigo-500/5 blur-[80px] pointer-events-none" />

          {/* Headline */}
          <h2 className="font-sora text-3xl font-extrabold leading-tight text-white md:text-4xl tracking-tight max-w-2xl mx-auto">
            Your dream company has a <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-rose-400 animate-text-shimmer">NiC alumni</span> waiting.
          </h2>

          {/* Subline */}
          <p className="mx-auto mt-5 max-w-lg font-inter text-sm md:text-base text-slate-350 leading-relaxed">
            Enter your college email to sign up. Get referred and speed up your career.
          </p>

          {/* ── Email form ── */}
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-10 flex max-w-md w-full flex-col gap-3.5 sm:flex-row sm:gap-2 relative z-20"
          >
            {/* Input */}
            <div className="relative flex-1 p-[1.5px] rounded-full premium-neon-input-wrap">
              <Mail className="absolute left-4.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 z-10" />
              <input
                id="cta-email-input"
                type="email"
                required
                placeholder="Enter your college email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-full bg-black py-3.5 pl-12.5 pr-4 text-sm text-white placeholder-slate-500 transition-all duration-300 focus:outline-none shadow-inner font-inter relative z-0"
              />
            </div>

            {/* Button */}
            <button
              id="cta-submit-button"
              type="submit"
              className="w-full sm:w-auto shrink-0 rounded-full premium-neon-btn text-white px-8 py-3.5 text-sm font-semibold transition-all duration-300"
            >
              Sign Up
            </button>
          </form>

          {/* Login option */}
          <div className="mt-5 text-xs text-slate-400 relative z-20 flex items-center justify-center gap-1.5 font-medium select-none animate-fade-in">
            <span>Already have an account?</span>
            <button
              type="button"
              onClick={() => onNavigate('auth', 'login')}
              className="text-white hover:underline font-bold transition duration-200"
            >
              Login
            </button>
          </div>

          {/* ── Social proof ── */}
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row relative z-20">
            {/* Avatar stack */}
            <div className="flex items-center">
              {avatars.map((a) => (
                <div
                  key={a.initials}
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#090B1E] text-[10px] font-bold text-white shadow-md ${a.color} ${a.offset}`}
                >
                  {a.initials}
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-350 font-medium">
              Join <span className="font-bold text-blue-400">500+</span>{' '}
              students already connected
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Giant Brand Watermark — ghost/watermark style matching hero */}
    <div className="w-full overflow-hidden select-none pointer-events-none mt-16 flex justify-center items-center relative h-36 md:h-52" aria-hidden="true">
      <span
        style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: 'clamp(3.5rem, 13vw, 12rem)',
          fontWeight: 900,
          letterSpacing: '-0.03em',
          lineHeight: 1,
          background: 'linear-gradient(110deg, rgba(56,189,248,0.08) 0%, rgba(139,92,246,0.07) 50%, rgba(244,63,94,0.08) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          userSelect: 'none',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          display: 'block',
        }}
      >
        NextInCampus
      </span>
    </div>
  </section>
  );
};
