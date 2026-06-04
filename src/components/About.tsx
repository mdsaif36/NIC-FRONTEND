import React from 'react';
import { Target, Sparkles, Compass } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <section id="about" className="bg-transparent py-24 md:py-32 relative overflow-hidden select-none">
      
      {/* Glow Orbs specifically for this section */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-72 h-72 rounded-full bg-blue-500/5 blur-[90px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-72 h-72 rounded-full bg-red-500/5 blur-[90px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10 flex flex-col gap-12">
        
        {/* Decorative background watermark symbol */}
        <div className="absolute -top-16 -right-12 opacity-5 pointer-events-none select-none hidden md:block">
          <svg viewBox="0 0 160 100" className="w-80 h-80 text-white" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 25 65 L 25 36 C 25 22, 45 22, 45 30 L 60 50" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
            <path d="M 38 48 L 53 68 C 58 74, 68 74, 68 64 L 68 36" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
            <circle cx="68" cy="20" r="4" fill="currentColor" />
            <path d="M 130 35 A 21.2 21.2 0 1 0 130 65" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
          </svg>
        </div>

        {/* Section Header */}
        <div className="text-center md:text-left">
          <div className="flex items-center gap-2 mb-3 justify-center md:justify-start">
            <span className="h-[1px] w-8 bg-gradient-to-r from-cyan-500 to-transparent" />
            <span className="text-[10px] tracking-widest font-black uppercase text-cyan-400 font-space-grotesk flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Why We Exist
            </span>
          </div>
          <h2 className="font-sora font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight">
            About NexInCampus
          </h2>
        </div>

        {/* Paragraph Grid & Cards */}
        <div className="grid gap-6 md:gap-8">
          
          {/* Card 1: The Core Mission Statement (Opening Paragraph) */}
          <div className="relative p-6 md:p-8 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)] group overflow-hidden">
            {/* Top-Right Glowing Orb */}
            <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-cyan-500/10 blur-xl pointer-events-none transition-transform duration-700 group-hover:scale-125" />
            
            <div className="flex flex-col md:flex-row gap-5 items-start">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 select-none">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <p className="text-base sm:text-lg md:text-xl font-medium font-sora text-white leading-relaxed">
                  "Getting a referral should not depend on who your parents know or which college you went to. It should depend on how good you are and how hard you worked. NexInCampus exists to make that true."
                </p>
              </div>
            </div>
          </div>

          {/* Cards 2 & 3 Side by Side */}
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Card 2: Why We Built It (Second Paragraph) */}
            <div className="p-6 rounded-3xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] hover:border-white/10 transition-all duration-300 flex flex-col gap-4 relative overflow-hidden">
              <div className="absolute -bottom-12 -left-12 w-24 h-24 rounded-full bg-indigo-500/5 blur-xl pointer-events-none" />
              
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 select-none">
                <span className="text-xs font-bold font-space-grotesk">01</span>
              </div>
              <h3 className="font-sora font-bold text-sm text-slate-200">The Access Problem</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-inter">
                "We built NexInCampus because we watched brilliant students get filtered out before a single human ever read their resume — while others with weaker profiles sailed through because they happened to know someone on the inside. That is not a skills problem. That is an access problem. And access problems have solutions."
              </p>
            </div>

            {/* Card 3: The Solution (Third Paragraph) */}
            <div className="p-6 rounded-3xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] hover:border-white/10 transition-all duration-300 flex flex-col gap-4 relative overflow-hidden">
              <div className="absolute -bottom-12 -right-12 w-24 h-24 rounded-full bg-rose-500/5 blur-xl pointer-events-none" />
              
              <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-455 select-none">
                <Compass className="w-4 h-4" />
              </div>
              <h3 className="font-sora font-bold text-sm text-slate-200">The Solution</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-inter">
                "NexInCampus is that solution. A platform where any verified student can find, connect with, and get referred by alumni working at the companies they dream of — regardless of which college they went to, which city they are from, or who they know. The only thing that matters here is the quality of your work and the sincerity of your ask."
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
