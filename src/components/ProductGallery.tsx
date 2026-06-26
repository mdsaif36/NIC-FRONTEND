import { useState, useEffect } from 'react';

const SCREENSHOTS = [
  '/screenshots/user_screenshot_1.png',
  '/screenshots/user_screenshot_2.png',
  '/screenshots/user_screenshot_3.png',
  '/screenshots/user_screenshot_4.png',
  '/screenshots/user_screenshot_5.png'
];

// Exact aspect ratios mapped to the image dimensions to eliminate empty borders
const ASPECT_RATIOS = [
  'aspect-[1024/522]', // Landscape (1.96)
  'aspect-[1024/580]', // Landscape (1.76)
  'aspect-[1024/625]', // Landscape (1.63)
  'aspect-[756/1024]', // Portrait (0.73)
  'aspect-[735/1024]'  // Portrait (0.71)
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
    const translateX = diff * 48; // Horizontal offset spacing (spread out)
    const scale = 1 - absDiff * 0.18; // Scale down background cards
    const zIndex = 20 - absDiff; // Layer stacking
    const opacity = 1 - absDiff * 0.45; // Fade out background cards
    const rotateY = diff * -15; // 3D Y-tilt angle
    const translateZ = absDiff * -150; // Depth coordinate in 3D space

    return {
      transform: `translateX(${translateX}%) scale(${scale}) perspective(1500px) rotateY(${rotateY}deg) translateZ(${translateZ}px)`,
      zIndex,
      opacity,
      filter: index === currentIndex ? 'none' : 'blur(4px) brightness(30%)',
      transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1)'
    };
  };

  return (
    // ========================================= 
    // STANDALONE 3D CAROUSEL COMPONENT
    // ========================================= 
    <div className="relative w-full h-[250px] sm:h-[350px] md:h-[460px] lg:h-[530px] bg-[#030303] flex items-center justify-center perspective-[1200px] overflow-hidden border-t border-b border-white/5 py-6">
      
      {/* Intense Core Glow Behind Carousel */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 blur-[120px] rounded-full scale-75 pointer-events-none"></div>

      {/* Flexible width container supporting dynamic card aspects based on their index */}
      <div className="relative w-[90%] max-w-[800px] h-[80%] flex items-center justify-center">
        
        {SCREENSHOTS.map((src, index) => (
          <div 
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`absolute h-full rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer border border-white/10 select-none ${ASPECT_RATIOS[index]}`}
            style={{
              ...getCardStyles(index),
              boxShadow: index === currentIndex 
                ? '0 25px 60px -10px rgba(0,0,0,0.95), 0 0 45px rgba(99, 102, 241, 0.22)' 
                : '0 12px 25px -10px rgba(0,0,0,0.85)'
            }}
          >
            {/* Darkening overlay for inactive background cards */}
            <div className={`absolute inset-0 bg-black transition-opacity duration-900 z-10 ${index === currentIndex ? 'opacity-0' : 'opacity-50'}`}></div>
            
            {/* Premium subtle inner gradient shine */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-20 z-20 pointer-events-none mix-blend-overlay"></div>

            {/* object-cover fits perfectly since card dimensions match the screenshot dimensions */}
            <img 
              src={src} 
              alt={`Platform View ${index + 1}`} 
              className="w-full h-full object-cover pointer-events-none"
            />
          </div>
        ))}
      </div>

      {/* Frosted Glass Navigation Controls */}
      <div className="absolute bottom-3 sm:bottom-4 left-0 right-0 flex justify-center gap-6 z-30">
        <button 
          onClick={() => setCurrentIndex((prev) => (prev - 1 + SCREENSHOTS.length) % SCREENSHOTS.length)}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center backdrop-blur-xl border border-white/10 transition-all duration-300 hover:scale-110 text-gray-300 hover:text-white shadow-lg cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <button 
          onClick={() => setCurrentIndex((prev) => (prev + 1) % SCREENSHOTS.length)}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center backdrop-blur-xl border border-white/10 transition-all duration-300 hover:scale-110 text-gray-300 hover:text-white shadow-lg cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
        </button>
      </div>

    </div>
  );
}
