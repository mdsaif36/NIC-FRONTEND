import { useState, useEffect } from 'react';

const SCREENSHOTS = [
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
    }, 4000); // Rotates every 4 seconds
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
        transform: 'translateX(0) scale(0.4) translateZ(-300px)', 
        zIndex: 0, 
        pointerEvents: 'none' as const,
        filter: 'blur(10px) brightness(20%)'
      };
    }

    // Calculate dynamic styles based on how far from center the card is
    const translateX = diff * 45; // Horizontal offset spacing (spread out)
    const scale = 1 - absDiff * 0.18; // Scale down background cards
    const zIndex = 20 - absDiff; // Layer stacking
    const opacity = 1 - absDiff * 0.50; // Fade out background cards
    const rotateY = diff * -18; // 3D Y-tilt angle
    const translateZ = absDiff * -150; // Depth coordinate in 3D space

    return {
      transform: `translateX(${translateX}%) scale(${scale}) perspective(1500px) rotateY(${rotateY}deg) translateZ(${translateZ}px)`,
      zIndex,
      opacity,
      // Fades, blurs and darkens background cards while making the front card pop crisp and clear
      filter: index === currentIndex ? 'none' : 'blur(4px) brightness(35%)',
      // Premium Apple-style easing for buttery smooth movement
      transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1)'
    };
  };

  return (
    // ========================================= 
    // STANDALONE 3D CAROUSEL COMPONENT
    // ========================================= 
    <div className="relative w-full h-[320px] sm:h-[450px] md:h-[580px] lg:h-[680px] bg-[#030303] flex items-center justify-center perspective-[1200px] overflow-hidden border-t border-b border-white/5 py-8">
      
      {/* Intense Core Glow Behind Carousel */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 blur-[120px] rounded-full scale-75 pointer-events-none"></div>

      {/* 16:9 Aspect Ratio Container to fit desktop screenshots without cropping */}
      <div className="relative w-[85%] max-w-[280px] sm:max-w-[480px] md:max-w-[680px] lg:max-w-[880px] aspect-video flex items-center justify-center">
        
        {SCREENSHOTS.map((src, index) => (
          <div 
            key={index}
            onClick={() => setCurrentIndex(index)}
            className="absolute w-full h-full rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer border border-white/10 bg-[#0c0c14] select-none"
            style={{
              ...getCardStyles(index),
              boxShadow: index === currentIndex 
                ? '0 30px 70px -10px rgba(0,0,0,0.95), 0 0 50px rgba(99, 102, 241, 0.25)' 
                : '0 15px 30px -10px rgba(0,0,0,0.85)'
            }}
          >
            {/* Darkening overlay for inactive background cards */}
            <div className={`absolute inset-0 bg-black transition-opacity duration-900 z-10 ${index === currentIndex ? 'opacity-0' : 'opacity-40'}`}></div>
            
            {/* Premium subtle inner gradient shine */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-30 z-20 pointer-events-none mix-blend-overlay"></div>

            {/* object-contain shows the whole image clearly without cropping or stretching */}
            <img 
              src={src} 
              alt={`Platform View ${index + 1}`} 
              className="w-full h-full object-contain pointer-events-none bg-black/90"
            />
          </div>
        ))}
      </div>

      {/* Frosted Glass Navigation Controls */}
      <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 flex justify-center gap-6 z-30">
        <button 
          onClick={() => setCurrentIndex((prev) => (prev - 1 + SCREENSHOTS.length) % SCREENSHOTS.length)}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center backdrop-blur-xl border border-white/10 transition-all duration-300 hover:scale-110 text-gray-300 hover:text-white shadow-lg cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <button 
          onClick={() => setCurrentIndex((prev) => (prev + 1) % SCREENSHOTS.length)}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center backdrop-blur-xl border border-white/10 transition-all duration-300 hover:scale-110 text-gray-300 hover:text-white shadow-lg cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
        </button>
      </div>

    </div>
  );
}
