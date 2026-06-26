import { useState } from 'react';

const CARDS_DATA = [
  {
    step: "01",
    title: "Verify Student Profile",
    description: "Authenticate using your official college email domain. Our secure verification system locks in your student identity to maintain a highly trusted, invite-only campus network.",
    color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20 hover:border-emerald-400/40",
    glow: "bg-emerald-500/20",
    textGlow: "text-emerald-400"
  },
  {
    step: "02",
    title: "Define Career Targets",
    description: "Input your target roles, select your dream companies, and upload your resume. Our system parses your profile details and constructs a dynamic match score matrix.",
    color: "from-indigo-500/10 to-purple-500/10 border-indigo-500/20 hover:border-indigo-400/40",
    glow: "bg-indigo-500/20",
    textGlow: "text-indigo-400"
  },
  {
    step: "03",
    title: "Explore Active Slots",
    description: "Browse the real-time referral board. Filter by company, domain, or job location to discover open slots posted by verified alumni active at top tech companies.",
    color: "from-amber-500/10 to-orange-500/10 border-amber-500/20 hover:border-amber-400/40",
    glow: "bg-amber-500/20",
    textGlow: "text-amber-400"
  },
  {
    step: "04",
    title: "Submit Outreach Pitch",
    description: "Craft a compelling, short pitch explaining why you are a strong fit for the role. Submit it directly to the alumni mentor along with your resume in one click.",
    color: "from-pink-500/10 to-rose-500/10 border-pink-500/20 hover:border-rose-400/40",
    glow: "bg-pink-500/20",
    textGlow: "text-rose-400"
  },
  {
    step: "05",
    title: "Unlock Chat & Get Referred",
    description: "Once the alumni accepts your request, direct chat unlocks automatically. Coordinate review feedback, get referred directly, and land interviews 10x faster.",
    color: "from-blue-500/10 to-cyan-500/10 border-blue-500/20 hover:border-cyan-400/40",
    glow: "bg-blue-500/20",
    textGlow: "text-cyan-400"
  }
];

export default function ProductGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Complex math to calculate 3D positioning for the "Round" coverflow effect
  const getCardStyles = (index: number) => {
    // Determine distance from the current center card
    const offset = (index - currentIndex + CARDS_DATA.length) % CARDS_DATA.length;
    let diff = offset;
    
    // Normalize difference to handle the infinite loop wrap-around
    if (diff > CARDS_DATA.length / 2) diff -= CARDS_DATA.length;

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
    const translateX = diff * 50; // Horizontal spacing
    const scale = 1 - absDiff * 0.16; // Scale down background cards
    const zIndex = 20 - absDiff; // Stack layering
    const opacity = 1 - absDiff * 0.45; // Fade out background cards
    const rotateY = diff * -15; // 3D Y-rotation
    const translateZ = absDiff * -150; //Receding depth transform

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
    <div className="relative w-full h-[280px] sm:h-[380px] md:h-[480px] lg:h-[550px] bg-[#030303] flex items-center justify-center perspective-[1500px] overflow-hidden border-t border-b border-white/5 py-8">
      
      {/* Intense Core Glow Behind Carousel */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 blur-[120px] rounded-full scale-75 pointer-events-none"></div>

      {/* Grid background mask for a premium feel */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      {/* Flexible width container supporting dynamic card aspects based on their index */}
      <div className="relative w-[90%] max-w-[800px] h-[80%] flex items-center justify-center">
        
        {CARDS_DATA.map((card, index) => (
          <div 
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`absolute h-full aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer border bg-black/40 backdrop-blur-2xl select-none transition-all duration-300 ${card.color}`}
            style={{
              ...getCardStyles(index),
              boxShadow: index === currentIndex 
                ? '0 30px 60px -15px rgba(0,0,0,0.95), 0 0 50px rgba(99, 102, 241, 0.2)' 
                : '0 15px 30px -10px rgba(0,0,0,0.85)'
            }}
          >
            {/* Ambient colorful glow bubble inside each card */}
            <div className={`absolute -top-12 -left-12 w-44 h-44 rounded-full ${card.glow} blur-[40px] pointer-events-none opacity-40`} />

            {/* Geometric layout grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-30" />

            {/* Inactive overlay filter */}
            <div className={`absolute inset-0 bg-[#030305]/40 transition-opacity duration-900 z-10 ${index === currentIndex ? 'opacity-0' : 'opacity-80'}`} />

            {/* Card Content Details */}
            <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between z-20">
              
              {/* Header Badge */}
              <div className="flex items-center justify-between">
                <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-white/5 border border-white/10 ${card.textGlow}`}>
                  Step {card.step}
                </span>
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${card.textGlow.replace('text', 'bg')}`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${card.textGlow.replace('text', 'bg')}`}></span>
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-3">
                <h3 className="font-space-grotesk text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                  {card.title}
                </h3>
                <p className="text-[11px] text-slate-300 leading-relaxed font-medium opacity-90">
                  {card.description}
                </p>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest font-space-grotesk">NextInCampus Journey</span>
                <span className={`text-xs font-bold ${card.textGlow}`}>→</span>
              </div>

            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
