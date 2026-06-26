import { useState, useEffect } from 'react';

const STEPS = [
  {
    id: 1,
    number: "01",
    phase: "ALUMNI POSTS",
    title: "Post Referral Slot",
    description: "Alumni specify roles, company, target skills, deadline, and the number of slots available for referral.",
    accent: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    glow: "shadow-[0_0_50px_rgba(16,185,129,0.15)]"
  },
  {
    id: 2,
    number: "02",
    phase: "STUDENT DISCOVERS",
    title: "Discover Opportunities",
    description: "Students view a real-time board showing active opportunities matching their profile and targets.",
    accent: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
    glow: "shadow-[0_0_50px_rgba(168,85,247,0.15)]"
  },
  {
    id: 3,
    number: "03",
    phase: "STUDENT REQUESTS",
    title: "Submit Pitch & Resume",
    description: "Students attach their verified resume and write a concise pitch explaining why they are a strong fit.",
    accent: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    glow: "shadow-[0_0_50px_rgba(59,130,246,0.15)]"
  },
  {
    id: 4,
    number: "04",
    phase: "ALUMNI REVIEWS",
    title: "Review Candidate Profile",
    description: "Alumni inspect candidate details, verifying resume, CGPA, match scores, and profile tags in one view.",
    accent: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
    glow: "shadow-[0_0_50px_rgba(245,158,11,0.15)]"
  },
  {
    id: 5,
    number: "05",
    phase: "SUCCESS!",
    title: "Referral Confirmed",
    description: "Once approved, the referral is submitted to the corporate portal, and a direct chat workspace unlocks.",
    accent: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/20",
    glow: "shadow-[0_0_50px_rgba(6,182,212,0.15)]"
  }
];

export default function ProductGallery() {
  const [activeStep, setActiveStep] = useState(1);
  const [progress, setProgress] = useState(0);

  // Auto-play interval for cycling through steps
  useEffect(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveStep((current) => (current % STEPS.length) + 1);
          return 0;
        }
        return prev + 1.25; // Speed of progress bar
      });
    }, 50);

    return () => clearInterval(interval);
  }, [activeStep]);

  return (
    <section className="relative min-h-[600px] bg-[#030303] text-white flex items-center justify-center overflow-hidden font-sans py-20 px-6 sm:px-8">
      {/* Background Grid Pattern & Glowing Orbs */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808004_1px,transparent_1px),linear-gradient(to_bottom,#80808004_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-12 relative z-10">
        
        {/* ========================================= */}
        {/* LEFT COLUMN: INTERACTIVE TIMELINE STAGE  */}
        {/* ========================================= */}
        <div className="w-full lg:w-[42%] space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-400 font-space-grotesk">Interactive Explainer</span>
            <h2 className="text-3xl font-extrabold font-space-grotesk tracking-tight text-white leading-tight">
              How the Referral Flow Works
            </h2>
          </div>

          <div className="space-y-3">
            {STEPS.map((step) => {
              const isActive = activeStep === step.id;
              return (
                <div
                  key={step.id}
                  onClick={() => {
                    setActiveStep(step.id);
                    setProgress(0);
                  }}
                  className={`p-4 rounded-xl border transition-all duration-500 cursor-pointer flex items-start gap-4 select-none ${
                    isActive 
                      ? `bg-white/[0.02] backdrop-blur-xl border-white/10 ${step.glow}`
                      : 'bg-transparent border-transparent hover:bg-white/[0.01]'
                  }`}
                >
                  {/* Step Number with Progress Ring Indicator */}
                  <div className="relative shrink-0 flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 border border-white/10 font-bold text-xs">
                    {isActive && (
                      <div 
                        className="absolute inset-0 rounded-lg border-2 border-indigo-500/80 transition-all duration-300"
                        style={{ clipPath: `inset(0 ${100 - progress}% 0 0)` }}
                      />
                    )}
                    <span className={isActive ? step.accent : 'text-slate-500'}>
                      {step.number}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[8.5px] font-black tracking-widest ${isActive ? step.accent : 'text-slate-500'}`}>
                        {step.phase}
                      </span>
                    </div>
                    <h4 className={`text-sm font-bold font-space-grotesk transition-colors ${isActive ? 'text-white' : 'text-slate-450'}`}>
                      {step.title}
                    </h4>
                    {isActive && (
                      <p className="text-[11.5px] text-slate-450 leading-relaxed font-medium animate-fade-in">
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================= */}
        {/* RIGHT COLUMN: ANIMATED LIVE MOCK SCREEN  */}
        {/* ========================================= */}
        <div className="w-full lg:w-[58%] h-[420px] sm:h-[480px] rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-2xl relative overflow-hidden flex flex-col justify-between shadow-[0_30px_70px_-15px_rgba(0,0,0,0.9)]">
          
          {/* Mock Window Top Bar */}
          <div className="h-10 border-b border-white/5 bg-white/[0.01] flex items-center justify-between px-5 shrink-0 select-none">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/40" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
            </div>
            <div className="px-3 py-1 rounded bg-white/5 border border-white/5 text-[9px] font-mono text-slate-500 tracking-wider">
              {activeStep === 1 || activeStep === 4 || activeStep === 5 ? "alumni.nextincampus.in/dashboard" : "seeker.nextincampus.in/board"}
            </div>
            <div className="w-8 h-1 bg-white/5 rounded" />
          </div>

          {/* Dynamic Mock Canvas Content Area */}
          <div className="flex-grow p-6 flex items-center justify-center relative overflow-hidden">
            
            {/* Step 1 Canvas: Alumni Creates Post */}
            {activeStep === 1 && (
              <div className="w-full max-w-[360px] rounded-xl border border-emerald-500/20 bg-white/[0.02] backdrop-blur-md p-5 space-y-4 animate-scale-in relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
                
                <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                  <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Referral Creation</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-[8.5px] text-slate-500 font-semibold">Active Editor</span>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xs shrink-0 select-none">G</div>
                    <div className="flex-1">
                      <label className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Company</label>
                      <span className="text-white font-semibold text-xs">Google</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider mb-1">Target Role</label>
                    <div className="p-2 rounded bg-black/40 border border-white/5 text-white font-medium">Software Engineer II</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider mb-1">Location</label>
                      <div className="p-2 rounded bg-black/40 border border-white/5 text-slate-350">Bangalore, India</div>
                    </div>
                    <div>
                      <label className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider mb-1">Available Slots</label>
                      <div className="p-2 rounded bg-black/40 border border-white/5 text-emerald-400 font-bold">3 Slots</div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider mb-1">Skills Desired</label>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-white/5 text-[8px] font-bold text-slate-300">React</span>
                      <span className="px-1.5 py-0.5 rounded bg-white/5 text-[8px] font-bold text-slate-300">TypeScript</span>
                      <span className="px-1.5 py-0.5 rounded bg-white/5 text-[8px] font-bold text-slate-300">System Design</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[8.5px] text-slate-500 font-semibold">Form Complete</span>
                  {/* Glowing Pulse Button */}
                  <button className="px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/35 text-emerald-300 text-[10px] font-bold uppercase tracking-wider animate-pulse select-none">
                    Publish Slot
                  </button>
                </div>
              </div>
            )}

            {/* Step 2 Canvas: Student Discovers */}
            {activeStep === 2 && (
              <div className="w-full max-w-[380px] rounded-xl border border-purple-500/20 bg-white/[0.02] backdrop-blur-md p-5 space-y-4 animate-scale-in">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-purple-400 uppercase tracking-wider">Seeker Dashboard</span>
                  <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[8px] font-bold uppercase">12 slots open</span>
                </div>
                
                {/* Active Post Card appearing in feed */}
                <div className="p-4 rounded-xl border border-purple-500/30 bg-black/40 backdrop-blur-md shadow-[0_15px_30px_-5px_rgba(168,85,247,0.1)] flex items-start justify-between gap-4 animate-pulse">
                  <div>
                    <span className="px-1.5 py-0.5 rounded bg-white/5 text-[7.5px] font-bold text-slate-400 uppercase">Full-Time</span>
                    <h5 className="font-bold text-xs text-white mt-1.5">Software Engineer II</h5>
                    <p className="text-[9.5px] text-slate-450 mt-0.5">Google · Bangalore, India</p>
                    <div className="flex items-center gap-1.5 mt-3">
                      <span className="px-1.5 py-0.5 rounded bg-purple-500/15 border border-purple-500/20 text-purple-400 text-[7px] font-bold">React</span>
                      <span className="px-1.5 py-0.5 rounded bg-white/5 text-[7px] font-bold text-slate-450">TypeScript</span>
                    </div>
                  </div>
                  <span className="shrink-0 px-2 py-0.5 rounded-full border border-emerald-500/20 text-emerald-400 bg-emerald-500/5 text-[8.5px] font-bold">
                    98% Match
                  </span>
                </div>

                {/* Secondary card in feed to show list context */}
                <div className="p-3.5 rounded-xl border border-white/5 bg-black/20 opacity-40 flex items-start justify-between gap-4">
                  <div>
                    <h5 className="font-bold text-[11px] text-white">Product Manager</h5>
                    <p className="text-[8.5px] text-slate-450">Microsoft · Hyderabad</p>
                  </div>
                  <span className="shrink-0 px-2 py-0.5 rounded-full border border-white/5 text-slate-400 text-[7.5px]">85% Match</span>
                </div>
                
                <span className="block text-[8px] text-slate-500 text-center uppercase tracking-wide">Live board update active</span>
              </div>
            )}

            {/* Step 3 Canvas: Student Requests */}
            {activeStep === 3 && (
              <div className="w-full max-w-[360px] rounded-xl border border-blue-500/20 bg-white/[0.02] backdrop-blur-md p-5 space-y-4 animate-scale-in">
                <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                  <div>
                    <h5 className="font-bold text-xs text-white">Google - Software Engineer II</h5>
                    <p className="text-[8.5px] text-slate-500">Requesting from Alumni Riya Mehta</p>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-white/5 text-[8px] text-slate-400 font-bold uppercase">ASAP</span>
                </div>

                {/* Resume Attachment Mock */}
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-[9px] text-rose-400 font-black">PDF</div>
                    <span className="text-[10px] text-white font-medium">resume_amit_sharma.pdf</span>
                  </div>
                  <span className="text-[8.5px] text-slate-500">142 KB</span>
                </div>

                {/* Animated Typing Out Note */}
                <div className="space-y-1">
                  <label className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider">Outreach Pitch Note</label>
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-[10px] text-slate-300 font-medium italic min-h-[55px] relative leading-relaxed">
                    "Hi Riya, I'm a final year student at IIT Bombay. I built a scalable real-time chat app using React and WebSockets, and would love to request a referral for the SWE II role at Google. Thank you!"
                    <span className="absolute bottom-2 right-2 w-1.5 h-3 bg-blue-500 animate-ping" />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-white/5">
                  <span className="text-[8px] text-slate-550">Review ready</span>
                  <button className="px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-500/35 text-blue-300 text-[10px] font-bold uppercase tracking-wider">
                    Submit Request
                  </button>
                </div>
              </div>
            )}

            {/* Step 4 Canvas: Alumni Reviews */}
            {activeStep === 4 && (
              <div className="w-full max-w-[370px] rounded-xl border border-amber-500/20 bg-white/[0.02] backdrop-blur-md p-5 space-y-3.5 animate-scale-in">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded bg-amber-500/20 border border-amber-500/30 flex items-center justify-center font-bold text-xs text-amber-300">
                      AS
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-white">Amit Sharma</h5>
                      <span className="block text-[8.5px] text-slate-450">B.Tech CSE, IIT Bombay · 2026 Grad</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full border border-emerald-500/20 text-emerald-400 bg-emerald-500/5 text-[8.5px] font-bold">
                    98% Match
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[9.5px]">
                  <div className="p-2 rounded bg-black/40 border border-white/5">
                    <span className="block text-[7.5px] text-slate-500 uppercase font-bold mb-0.5">CGPA</span>
                    <span className="text-white font-semibold">9.2 / 10</span>
                  </div>
                  <div className="p-2 rounded bg-black/40 border border-white/5">
                    <span className="block text-[7.5px] text-slate-500 uppercase font-bold mb-0.5">Skills Match</span>
                    <span className="text-white font-semibold">React, TypeScript, SQL</span>
                  </div>
                </div>

                {/* Profile Links & Assets */}
                <div className="flex items-center justify-between gap-4 text-[9px]">
                  <button className="flex-1 p-2 rounded bg-black/40 border border-white/5 flex items-center justify-center gap-1.5 text-slate-300">
                    <span className="text-rose-400 font-black">PDF</span>
                    <span className="truncate max-w-[100px]">resume_amit.pdf</span>
                  </button>
                  <div className="flex gap-2">
                    <span className="px-2 py-1.5 rounded bg-white/5 text-[8px] font-semibold text-slate-400">GitHub</span>
                    <span className="px-2 py-1.5 rounded bg-white/5 text-[8px] font-semibold text-slate-400">LinkedIn</span>
                  </div>
                </div>

                <div className="p-2.5 rounded bg-black/50 border border-white/5 text-[9.5px] text-slate-400 leading-relaxed italic">
                  "Hi Riya, I'm a final year student at IIT Bombay. I built a scalable real-time chat app using React and WebSockets..."
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-2.5">
                  <span className="text-[8.5px] text-amber-400 font-bold uppercase tracking-wider">Verification Review</span>
                  <div className="flex gap-2">
                    <button className="px-2.5 py-1.5 rounded bg-white/5 border border-white/10 text-slate-350 text-[9px] font-bold">Decline</button>
                    <button className="px-3 py-1.5 rounded bg-amber-500/20 border border-amber-500/35 text-amber-300 text-[9px] font-bold uppercase tracking-wider">Approve & Refer</button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5 Canvas: Success */}
            {activeStep === 5 && (
              <div className="w-full max-w-[340px] rounded-xl border border-cyan-500/20 bg-white/[0.02] backdrop-blur-md p-6 text-center space-y-4 animate-scale-in relative">
                
                {/* Glowing Success Badge */}
                <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                  <svg className="w-7 h-7 text-cyan-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-space-grotesk text-sm font-extrabold text-white">Referral Confirmed!</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed px-2">
                    Amit's profile was successfully referred to Google's internal applicant portal. A direct chat room is now open.
                  </p>
                </div>

                {/* Animated status pipeline indicator */}
                <div className="flex items-center justify-center gap-1.5 pt-3 border-t border-white/5 text-[8.5px]">
                  <span className="text-slate-500 font-medium">Applied</span>
                  <span className="text-slate-650">→</span>
                  <span className="text-slate-500 font-medium">Approved</span>
                  <span className="text-slate-650">→</span>
                  <span className="text-cyan-400 font-extrabold uppercase tracking-wide">Referred 🎉</span>
                </div>
              </div>
            )}

          </div>

          {/* Interactive Step Navigation Indicator Bar */}
          <div className="h-12 border-t border-white/5 bg-white/[0.01] flex items-center justify-between px-6 shrink-0 select-none">
            <span className="text-[8.5px] font-bold text-slate-500 uppercase tracking-widest font-space-grotesk">Process Simulation</span>
            <div className="flex gap-2">
              {STEPS.map((step) => (
                <button
                  key={step.id}
                  onClick={() => {
                    setActiveStep(step.id);
                    setProgress(0);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    activeStep === step.id ? 'w-5 bg-indigo-500' : 'bg-white/10 hover:bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
