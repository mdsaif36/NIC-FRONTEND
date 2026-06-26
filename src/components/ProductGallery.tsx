import { useState, useEffect } from 'react';

const SCREENSHOTS = [
  '/screenshots/landing_hero.png',
  '/screenshots/landing_leaderboard.png',
  '/screenshots/auth_login.png',
  '/screenshots/seeker_dashboard.png',
  '/screenshots/seeker_network.png',
  '/screenshots/alumni_inbox.png',
  '/screenshots/alumni_slots.png',
  '/screenshots/user_screenshot_1.png',
  '/screenshots/user_screenshot_2.png',
  '/screenshots/user_screenshot_3.png',
  '/screenshots/user_screenshot_4.png',
  '/screenshots/user_screenshot_5.png'
];

export default function ProductGallery() {
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
    // ========================================= 
    // STANDALONE 3D CAROUSEL COMPONENT
    // ========================================= 
    <div className="relative w-full h-[450px] sm:h-[550px] lg:h-[650px] bg-[#030303] flex items-center justify-center perspective-[1200px] overflow-hidden border-t border-b border-white/5">
      
      {/* Intense Core Glow Behind Carousel */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-[120px] rounded-full scale-75 pointer-events-none"></div>

      <div className="relative w-full max-w-[280px] sm:max-w-[360px] h-[80%] flex items-center justify-center">
        
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
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-6 z-30">
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
  );
}
