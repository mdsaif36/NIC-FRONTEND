import { useEffect, useState, useRef, useCallback } from 'react';

interface StatItemProps {
  target: number;
  label: string;
}

const AnimatedCounter = ({ target, label }: StatItemProps) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const animate = useCallback(() => {
    if (hasAnimated) return;
    setHasAnimated(true);

    const duration = 2000;
    const frameRate = 16;
    const totalFrames = duration / frameRate;
    const increment = target / totalFrames;
    let current = 0;

    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(Math.floor(current));
      }
    }, frameRate);
  }, [target, hasAnimated]);

  useEffect(() => {
    const node = elementRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animate();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);

    return () => {
      observer.unobserve(node);
    };
  }, [animate]);

  return (
    <div
      ref={elementRef}
      className="transparent-neon-card w-full h-full font-inter"
    >
      {/* Card Inner Content */}
      <div className="transparent-neon-card-inner px-6 py-10 text-center flex flex-col items-center justify-center">
        <span className="font-sora text-4xl sm:text-5xl font-bold text-white tabular-nums tracking-tight flex items-center justify-center">
          {count}
          <span className="text-blue-400 font-light ml-0.5">+</span>
        </span>
        <span className="mt-3 font-inter text-xs sm:text-sm font-semibold tracking-wider text-slate-350 uppercase">
          {label}
        </span>
      </div>
    </div>
  );
};

const companyLogos = [
  {
    name: 'Google',
    element: (
      <span className="font-sora text-xl font-bold tracking-tight select-none">
        <span className="text-[#4285F4]">G</span>
        <span className="text-[#EA4335]">o</span>
        <span className="text-[#FBBC05]">o</span>
        <span className="text-[#4285F4]">g</span>
        <span className="text-[#34A853]">l</span>
        <span className="text-[#EA4335]">e</span>
      </span>
    ),
  },
  {
    name: 'Microsoft',
    element: (
      <span className="font-sora text-xl font-semibold tracking-tight text-[#00A4EF] select-none">
        Microsoft
      </span>
    ),
  },
  {
    name: 'Amazon',
    element: (
      <span className="font-sora text-xl font-bold tracking-tight text-[#FF9900] select-none">
        amazon
      </span>
    ),
  },
  {
    name: 'Meta',
    element: (
      <span className="font-sora text-xl font-bold tracking-tight text-[#0668E1] select-none">
        Meta
      </span>
    ),
  },
  {
    name: 'Flipkart',
    element: (
      <span className="font-sora text-xl font-bold italic tracking-tight text-[#2874F0] select-none">
        Flipkart
      </span>
    ),
  },
  {
    name: 'Zomato',
    element: (
      <span className="font-sora text-xl font-bold tracking-tight text-[#E23744] select-none">
        zomato
      </span>
    ),
  },
];

export const Stats = () => {
  return (
    <section id="stats" className="bg-transparent py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Animated Counter Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <AnimatedCounter target={500} label="Alumni Connected" />
          <AnimatedCounter target={200} label="Referrals Sent" />
          <AnimatedCounter target={45} label="Companies" />
          <AnimatedCounter target={12} label="Colleges" />
        </div>

        {/* Company Logo Strip */}
        <div className="mt-20">
          <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Trusted by Alumni at
          </p>

          <div className="bg-black/30 border border-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-inner shadow-black/30">
            <div className="grid grid-cols-3 md:flex md:flex-wrap md:items-center md:justify-center gap-x-8 gap-y-6 md:gap-x-16">
              {companyLogos.map((logo) => (
                <div
                  key={logo.name}
                  className="filter grayscale brightness-[1.5] contrast-[0.8] opacity-50 hover:grayscale-0 hover:brightness-100 hover:opacity-100 hover:contrast-100 transition-all duration-300 flex justify-center items-center"
                >
                  {logo.element}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
