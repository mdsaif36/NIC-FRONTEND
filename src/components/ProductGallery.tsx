import { useState, useEffect } from 'react';

const SCREENSHOTS = [
  '/screenshots/landing_hero.png',
  '/screenshots/landing_leaderboard.png',
  '/screenshots/auth_login.png',
  '/screenshots/seeker_dashboard.png',
  '/screenshots/seeker_network.png',
  '/screenshots/alumni_inbox.png',
  '/screenshots/alumni_slots.png'
];

interface ProductGalleryProps {
  onNavigate?: (
    page: 'landing' | 'auth' | 'forgot-password' | 'reset-password',
    mode?: 'login' | 'signup',
    role?: 'seeker' | 'alumni'
  ) => void;
}

export default function ProductGallery({ onNavigate }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play interval to rotate the carousel automatically
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SCREENSHOTS.length);
    }, 3500); // Rotates every 3.5 seconds
    return () => clearInterval(timer);
  }, []);

  // Complex math to calculate 3D positioning for the "Round" coverflow effect
  const getCardStyles = (index: number) => {
    // Determine distance from the current center image
    const offset = (index - currentIndex + SCREENSHOTS.length) % SCREENSHOTS.length;
    let diff = offset;
    
    // Normalize difference to handle the infinite loop wrap-around
    if (diff > SCREENSHOTS.length / 2) diff -= SCREENSHOTS.length;

    const absDiff = Math.abs(diff);

    // If it's more than 2 spaces away, hide it completely
    if (absDiff > 2) {
      return { 
        opacity: 0, 
        transform: 'translateX(0) scale(0.5)', 
        zIndex: 0, 
        pointerEvents: 'none' as const
      };
    }

    // Calculate dynamic styles based on how far from center the card is
    const translateX = diff * 55; // Spread horizontal distance (%)
    const scale = 1 - absDiff * 0.15; // Shrink as it goes back
    const zIndex = 20 - absDiff; // Layer stacking
    const opacity = 1 - absDiff * 0.35; // Fade out as it goes back
    const rotateY = diff * -25; // Slightly deeper 3D tilt

    return {
      transform: `translateX(${translateX}%) scale(${scale}) perspective(1400px) rotateY(${rotateY}deg)`,
      zIndex,
      opacity,
      // Premium Apple-style easing for buttery smooth movement
      transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
    };
  };

  return (
    // Main Container with ultra-dark background and custom selection color
    <section className="relative min-h-[90vh] bg-[#030303] text-white flex items-center justify-center overflow-hidden font-sans pt-20 pb-20 selection:bg-blue-500/30 border-t border-b border-white/5">
      
      {/* Premium subtle grid background with radial fade mask */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      {/* Sophisticated Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>

      <div className="max-w-7xl mx-auto w-full px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16 lg:gap-8 relative z-10">
        
        {/* ========================================= */}
        {/* LEFT COLUMN: HERO TEXT                    */}
        {/* ========================================= */}
        <div className="w-full lg:w-[45%] flex flex-col items-center lg:items-start text-center lg:text-left">
          
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md mb-8 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-semibold tracking-widest text-gray-300 uppercase">Live Referral Slots Open</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70">
              Get Referred.
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
              Get Hired.
            </span>
          </h1>
          
          <h2 className="text-2xl sm:text-3xl font-medium text-gray-300 mb-6 tracking-tight">
            No connections needed.
          </h2>

          <p className="text-gray-400 text-lg max-w-xl leading-relaxed mb-10 font-light">
            A referral from an insider multiplies your interview chances by <strong className="text-white font-semibold">10x</strong>. NextInCampus gives every student access to that inside track.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button 
              onClick={() => onNavigate && onNavigate('auth', 'signup')}
              className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-300 cursor-pointer"
            >
              Create your account
            </button>
            <button 
              onClick={() => onNavigate && onNavigate('auth', 'login')}
              className="px-8 py-4 bg-white/5 text-white font-semibold rounded-full border border-white/10 hover:bg-white/10 backdrop-blur-md transition-all duration-300 cursor-pointer"
            >
              Sign in
            </button>
          </div>

        </div>

        {/* ========================================= */}
        {/* RIGHT COLUMN: 3D CAROUSEL GALLERY         */}
        {/* ========================================= */}
        <div className="w-full lg:w-[55%] relative h-[450px] sm:h-[550px] lg:h-[650px] flex items-center justify-center perspective-[1200px]">
          
          {/* Intense Core Glow Behind Carousel */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-[120px] rounded-full scale-75 pointer-events-none"></div>

          <div className="relative w-full max-w-[280px] sm:max-w-[360px] h-full flex items-center justify-center">
            
            {SCREENSHOTS.map((src, index) => (
              <div 
                key={index}
                onClick={() => setCurrentIndex(index)}
                className="absolute w-full h-[65%] sm:h-[70%] rounded-2xl overflow-hidden cursor-pointer ring-1 ring-white/10 bg-[#0a0a0a]"
                style={{
                  ...getCardStyles(index),
                  boxShadow: index === currentIndex 
                    ? '0 30px 60px -12px rgba(0,0,0,1), 0 0 40px rgba(59, 130, 246, 0.3)' 
                    : '0 25px 50px -12px rgba(0,0,0,0.9)'
                }}
              >
                {/* Darkening overlay for inactive background cards */}
                <div className={`absolute inset-0 bg-black transition-opacity duration-700 z-10 ${index === currentIndex ? 'opacity-0' : 'opacity-60'}`}></div>
                
                {/* Premium subtle inner gradient shine */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-50 z-20 pointer-events-none mix-blend-overlay"></div>

                <img 
                  src={src} 
                  alt={`Platform View ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Frosted Glass Navigation Controls */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-6 z-30">
            <button 
              onClick={() => setCurrentIndex((prev) => (prev - 1 + SCREENSHOTS.length) % SCREENSHOTS.length)}
              className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center backdrop-blur-xl border border-white/10 transition-all duration-300 hover:scale-110 text-gray-300 hover:text-white shadow-lg cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <button 
              onClick={() => setCurrentIndex((prev) => (prev + 1) % SCREENSHOTS.length)}
              className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center backdrop-blur-xl border border-white/10 transition-all duration-300 hover:scale-110 text-gray-300 hover:text-white shadow-lg cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
