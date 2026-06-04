import React, { useState } from 'react';
import { GraduationCap, TrendingUp, Clock, Users, Copy, Check, Network } from 'lucide-react';

interface College {
  name: string;
  code: string;
}

interface TargetCompany {
  name: string;
  color: string;
}

interface Alumni {
  name: string;
  role: string;
  college: string;
  graduationYear: string;
  avatarGradient: string;
  probability: string;
  speed: string;
  activeAlumniCount: number;
  draftMessage: string;
}

const colleges: College[] = [
  { name: 'IIT Bombay', code: 'IITB' },
  { name: 'NIT Trichy', code: 'NITT' },
  { name: 'BITS Pilani', code: 'BITS' },
  { name: 'Delhi Technological University', code: 'DTU' },
  { name: 'VIT Vellore', code: 'VIT' },
  { name: 'IIT Delhi', code: 'IITD' }
];

const companies: TargetCompany[] = [
  { name: 'Google', color: 'gradient' },
  { name: 'Microsoft', color: '#00A4EF' },
  { name: 'Amazon', color: '#FF9900' },
  { name: 'Meta', color: '#0668E1' },
  { name: 'Flipkart', color: '#2874F0' },
  { name: 'Zomato', color: '#E23744' }
];

const FIRST_NAMES = [
  "Rohan", "Sneha", "Aarav", "Ananya", "Vikram", "Priyanka", 
  "Kabir", "Ishita", "Aditya", "Meera", "Siddharth", "Tanvi", 
  "Karan", "Riya", "Varun", "Pooja", "Arjun", "Kriti", "Rahul", "Neha"
];

const LAST_NAMES = [
  "Sharma", "Iyer", "Mehta", "Patel", "Rao", "Nair", 
  "Joshi", "Gupta", "Verma", "Kulkarni", "Sen", "Malhotra", 
  "Mishra", "Reddy", "Menon", "Jain", "Bansal", "Choudhury", "Bose", "Das"
];

const ROLES = [
  "Software Engineer II",
  "Senior SDE",
  "Product Manager",
  "Machine Learning Engineer",
  "Frontend Lead",
  "Data Scientist",
  "Systems Architect",
  "Technical Lead"
];

function getDeterministicIndex(str: string, max: number): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % max;
}

const getAlumniData = (collegeCode: string, companyName: string): Alumni => {
  const key = `${collegeCode}-${companyName}`;
  
  const firstName = FIRST_NAMES[getDeterministicIndex(key + "-first", FIRST_NAMES.length)];
  const lastName = LAST_NAMES[getDeterministicIndex(key + "-last", LAST_NAMES.length)];
  const fullName = `${firstName} ${lastName}`;
  
  const role = ROLES[getDeterministicIndex(key + "-role", ROLES.length)];
  const collegeObj = colleges.find(c => c.code === collegeCode) || colleges[0];
  const collegeName = collegeObj.name;
  
  const gradYear = (2017 + getDeterministicIndex(key + "-year", 8)).toString();
  
  const gradients = [
    "from-blue-500 to-indigo-600",
    "from-emerald-400 to-teal-600",
    "from-orange-400 to-rose-600",
    "from-pink-500 to-rose-600",
    "from-purple-500 to-indigo-500",
    "from-amber-400 to-orange-500"
  ];
  const avatarGradient = gradients[getDeterministicIndex(key + "-grad", gradients.length)];
  
  const successRate = 86 + getDeterministicIndex(key + "-rate", 12); // 86% to 97%
  const speedHours = 1 + getDeterministicIndex(key + "-speed", 6); // 1 to 6 hours
  const activeCount = 8 + getDeterministicIndex(key + "-count", 18); // 8 to 25 alumni
  
  const draftMessage = `Hi ${fullName}, I am a junior at ${collegeName} studying CSE. I saw your amazing journey to ${companyName} as a ${role} and would love to ask you a quick question regarding the hiring process. Would you be open to a quick chat?`;

  return {
    name: fullName,
    role,
    college: collegeName,
    graduationYear: gradYear,
    avatarGradient,
    probability: `${successRate}% Success Rate`,
    speed: `Average ${speedHours} hours`,
    activeAlumniCount: activeCount,
    draftMessage
  };
};

const getCompanyStyle = (companyName: string) => {
  switch (companyName) {
    case 'Google':
      return {
        borderClass: 'border-blue-500/30 hover:border-blue-500/50 shadow-blue-500/10',
        textColor: 'text-white',
        logo: (
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
        )
      };
    case 'Microsoft':
      return {
        borderClass: 'border-[#00A4EF]/30 hover:border-[#00A4EF]/50 shadow-[#00A4EF]/10',
        textColor: 'text-[#00A4EF]',
        logo: (
          <svg className="w-8 h-8" viewBox="0 0 23 23">
            <rect x="0" y="0" width="11" height="11" fill="#F25022" />
            <rect x="12" y="0" width="11" height="11" fill="#7FBA00" />
            <rect x="0" y="12" width="11" height="11" fill="#00A4EF" />
            <rect x="12" y="12" width="11" height="11" fill="#FFB900" />
          </svg>
        )
      };
    case 'Amazon':
      return {
        borderClass: 'border-[#FF9900]/30 hover:border-[#FF9900]/50 shadow-[#FF9900]/10',
        textColor: 'text-[#FF9900]',
        logo: (
          <div className="flex flex-col items-center justify-center">
            <span className="text-white font-black tracking-tighter text-xs leading-none">amazon</span>
            <svg className="w-12 h-2.5 -mt-0.5" viewBox="0 0 100 15" fill="none">
              <path d="M5 2 C 20 12, 80 12, 95 2 M 90 0 L 97 3 L 93 10" stroke="#FF9900" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </div>
        )
      };
    case 'Meta':
      return {
        borderClass: 'border-[#0668E1]/30 hover:border-[#0668E1]/50 shadow-[#0668E1]/10',
        textColor: 'text-[#0668E1]',
        logo: (
          <svg className="w-10 h-6" viewBox="0 0 24 12" fill="none" stroke="#0668E1" strokeWidth="2.5">
            <path d="M17.5 1.5C15 1.5 13.5 3 12 4.5C10.5 3 9 1.5 6.5 1.5C3.5 1.5 1 3.5 1 6C1 8.5 3.5 10.5 6.5 10.5C9 10.5 10.5 9 12 7.5C13.5 9 15 10.5 17.5 10.5C20.5 10.5 23 8.5 23 6C23 3.5 20.5 1.5 17.5 1.5Z" strokeLinejoin="round" />
          </svg>
        )
      };
    case 'Flipkart':
      return {
        borderClass: 'border-[#2874F0]/30 hover:border-[#2874F0]/50 shadow-[#2874F0]/10',
        textColor: 'text-[#2874F0]',
        logo: (
          <div className="flex items-center gap-1">
            <span className="text-[#2874F0] font-black italic text-sm tracking-tight">Flipkart</span>
            <div className="w-4 h-4 rounded bg-[#FFE500] flex items-center justify-center shadow-sm">
              <span className="text-[#2874F0] font-black text-[9px]">f</span>
            </div>
          </div>
        )
      };
    case 'Zomato':
      return {
        borderClass: 'border-[#E23744]/30 hover:border-[#E23744]/50 shadow-[#E23744]/10',
        textColor: 'text-[#E23744]',
        logo: (
          <span className="text-white font-extrabold italic text-base tracking-tighter">zomato</span>
        )
      };
    default:
      return {
        borderClass: 'border-white/10 shadow-white/5',
        textColor: 'text-white',
        logo: null
      };
  }
};

export const ConnectionSimulator: React.FC = () => {
  const [collegeCode, setCollegeCode] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasRun, setHasRun] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const activeAlumni = collegeCode && companyName ? getAlumniData(collegeCode, companyName) : null;
  const companyStyle = companyName ? getCompanyStyle(companyName) : null;

  const handleCollegeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCollegeCode(e.target.value);
    setHasRun(false);
  };

  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCompanyName(e.target.value);
    setHasRun(false);
  };

  const handleRunSimulation = () => {
    if (!collegeCode || !companyName) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setHasRun(true);
    }, 800);
  };

  const handleCopyText = () => {
    if (!activeAlumni) return;
    navigator.clipboard.writeText(activeAlumni.draftMessage).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Get initials for Avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <section id="simulator" className="relative py-24 bg-transparent overflow-hidden border-t border-white/5 font-inter">
      {/* Inline styles for custom path-flow animation */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes flowLineHorizontal {
          0% { left: -20%; opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { left: 120%; opacity: 0; }
        }
        @keyframes flowLineVertical {
          0% { top: -20%; opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { top: 120%; opacity: 0; }
        }
        .animate-flow-line-h {
          animation: flowLineHorizontal 2s infinite linear;
        }
        .animate-flow-line-v {
          animation: flowLineVertical 2s infinite linear;
        }
      `}} />

      {/* Decorative background glow circles - brightened and mixed for dark view */}
      <div
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-[#1A6BF5]/[0.08] blur-[130px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-purple-500/[0.08] blur-[130px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-cyan-500/[0.05] blur-[100px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-cyan-400 mb-4 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
            Interactive Tool
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-sora text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-cyan-200 mb-4">
            Connection Simulator
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-base sm:text-lg">
            Experience how our verified college network routes you directly to top alumni. Enter your university and target organization to simulate routing metrics.
          </p>
        </div>

        {/* Glassmorphic Control Center Wrapper - Premium dark card styling */}
        <div className="glossy-neon-card">
          <div className="glossy-neon-card-inner p-6 sm:p-10 lg:p-12 relative overflow-hidden">
            
            {/* Input Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pb-8 border-b border-white/5">
              
              {/* College Selector */}
              <div className="flex flex-col gap-2.5">
                <label htmlFor="simulator-college-select" className="text-xs font-bold uppercase tracking-wider text-cyan-300 font-sora">
                  Your University
                </label>
                <select
                  id="simulator-college-select"
                  value={collegeCode}
                  onChange={handleCollegeChange}
                  className="w-full bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/10 hover:border-white/20 backdrop-blur-xl focus:border-cyan-400/50 shadow-inner rounded-xl px-4 py-3.5 text-white focus:outline-none transition-all font-inter text-sm cursor-pointer"
                >
                  <option value="" disabled className="bg-[#0A0F2E] text-gray-400">Select your college</option>
                  {colleges.map((c) => (
                    <option key={c.code} value={c.code} className="bg-[#0A0F2E] text-white">
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Company Selector */}
              <div className="flex flex-col gap-2.5">
                <label htmlFor="simulator-company-select" className="text-xs font-bold uppercase tracking-wider text-cyan-300 font-sora">
                  Target Company
                </label>
                <select
                  id="simulator-company-select"
                  value={companyName}
                  onChange={handleCompanyChange}
                  className="w-full bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/10 hover:border-white/20 backdrop-blur-xl focus:border-cyan-400/50 shadow-inner rounded-xl px-4 py-3.5 text-white focus:outline-none transition-all font-inter text-sm cursor-pointer"
                >
                  <option value="" disabled className="bg-[#0A0F2E] text-gray-400">Select target company</option>
                  {companies.map((comp) => (
                    <option key={comp.name} value={comp.name} className="bg-[#0A0F2E] text-white">
                      {comp.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Simulate Trigger Button */}
              <div>
                <button
                  id="simulator-run-btn"
                  onClick={handleRunSimulation}
                  disabled={!collegeCode || !companyName || isLoading}
                  className={`
                    w-full py-3.5 px-6 rounded-xl font-sora font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 active:scale-95
                    ${(!collegeCode || !companyName || isLoading)
                      ? 'bg-white/5 text-gray-500 border border-white/5 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-red-500 hover:opacity-95 text-white animate-btn-glow shadow-lg'
                    }
                  `}
                >
                  <Network className="w-4 h-4" />
                  <span>Find Referral Path</span>
                </button>
              </div>
            </div>

            {/* Simulated Path & Diagnostics Output */}
            <div className="pt-8 min-h-[320px] flex flex-col justify-center">
              
              {/* State 1: Prompt before run */}
              {!hasRun && !isLoading && (
                <div className="flex flex-col items-center justify-center text-center py-12 px-4 transition-all duration-500">
                  <div className="w-16 h-16 rounded-full bg-cyan-500/15 flex items-center justify-center mb-5 text-cyan-300 animate-pulse border border-cyan-500/20">
                    <Network className="w-8 h-8" />
                  </div>
                  <p className="text-gray-300 font-medium text-base sm:text-lg mb-2 font-sora">
                    Select your details above to calculate active pathways.
                  </p>
                  <p className="text-gray-400 text-xs sm:text-sm max-w-md leading-relaxed font-inter">
                    Choose your college and target employer to analyze connection probabilities, response times, and review personalized outreach templates.
                  </p>
                </div>
              )}

              {/* State 2: Loading State */}
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-12 transition-all duration-300">
                  <div className="relative w-20 h-20 mb-8">
                    {/* Background glowing circle */}
                    <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20" />
                    {/* Spinning neon circle */}
                    <div className="absolute inset-0 rounded-full border-4 border-t-cyan-400 border-r-indigo-500 border-b-transparent border-l-transparent animate-spin shadow-[0_0_20px_rgba(6,182,212,0.5)]" />
                  </div>
                  <h4 className="text-white font-sora font-semibold text-base mb-1.5 animate-pulse">
                    Routing referrals...
                  </h4>
                  <p className="text-gray-300 text-xs font-mono max-w-xs text-center leading-relaxed">
                    Analyzing nodes, calculating path weights & locating match profiles.
                  </p>
                </div>
              )}

              {/* State 3: Pathway visualizer & widget summary */}
              {hasRun && !isLoading && activeAlumni && companyStyle && (
                <div className="space-y-12 animate-scale-in">
                  
                  {/* Active Path Visualizer */}
                  <div>
                    <h4 className="text-center text-xs font-bold uppercase tracking-wider text-cyan-300 font-sora mb-8">
                      Calculated Active Connection Path
                    </h4>
                    
                    {/* Path Nodes Grid */}
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-0 max-w-4xl mx-auto px-4">
                      
                      {/* Node 1: Student (You) */}
                      <div className="w-full lg:w-auto shrink-0">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 w-full lg:w-48 text-center flex flex-col items-center justify-center shadow-lg transition-transform hover:-translate-y-1 duration-300">
                          <div className="w-12 h-12 rounded-full bg-cyan-500/15 flex items-center justify-center mb-4 text-cyan-300">
                            <GraduationCap className="w-6 h-6" />
                          </div>
                          <span className="text-white font-semibold text-sm block mb-1">Student (You)</span>
                          <span className="text-cyan-300 text-xs font-medium font-sora uppercase tracking-wider">
                            {collegeCode}
                          </span>
                        </div>
                      </div>

                      {/* Line 1 */}
                      <div className="hidden lg:flex flex-grow h-[2px] bg-gradient-to-r from-cyan-400 to-indigo-400 relative self-center min-w-[50px] mx-2">
                        <div className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-cyan-300 rounded-full blur-[2px] animate-flow-line-h shadow-[0_0_8px_#22d3ee]" />
                      </div>
                      <div className="lg:hidden flex flex-col items-center justify-center h-10 w-[2px] bg-gradient-to-b from-cyan-400 to-indigo-400 relative">
                        <div className="absolute left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-cyan-300 rounded-full blur-[2px] animate-flow-line-v shadow-[0_0_8px_#22d3ee]" />
                      </div>

                      {/* Node 2: Alumni */}
                      <div className="w-full lg:w-auto shrink-0 relative">
                        <div className="bg-gradient-to-b from-indigo-950/50 to-indigo-950/20 border border-indigo-500/30 rounded-2xl p-6 w-full lg:w-64 text-center flex flex-col items-center justify-center shadow-xl shadow-indigo-500/5 transition-transform hover:-translate-y-1 duration-300">
                          
                          {/* Inner glowing effect */}
                          <div className="absolute inset-0 bg-[#1A6BF5]/10 rounded-2xl pointer-events-none filter blur-md" />
                          
                          {/* Avatar Circle */}
                          <div className={`relative z-10 w-14 h-14 rounded-full bg-gradient-to-br ${activeAlumni.avatarGradient} flex items-center justify-center text-white font-bold text-lg shadow-md mb-4`}>
                            {getInitials(activeAlumni.name)}
                          </div>
                          <h5 className="relative z-10 text-white font-bold text-base mb-1 font-sora">
                            {activeAlumni.name}
                          </h5>
                          <p className="relative z-10 text-cyan-200 text-xs mb-1 font-semibold">
                            {activeAlumni.role}
                          </p>
                          <p className="relative z-10 text-gray-300 text-[11px] font-inter">
                            {activeAlumni.college} ('{activeAlumni.graduationYear.slice(-2)})
                          </p>
                        </div>
                      </div>

                      {/* Line 2 */}
                      <div className="hidden lg:flex flex-grow h-[2px] bg-gradient-to-r from-indigo-400 to-purple-400 relative self-center min-w-[50px] mx-2">
                        <div className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-purple-300 rounded-full blur-[2px] animate-flow-line-h shadow-[0_0_8px_#c084fc]" style={{ animationDelay: '1s' }} />
                      </div>
                      <div className="lg:hidden flex flex-col items-center justify-center h-10 w-[2px] bg-gradient-to-b from-indigo-400 to-purple-400 relative">
                        <div className="absolute left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-purple-300 rounded-full blur-[2px] animate-flow-line-v shadow-[0_0_8px_#c084fc]" style={{ animationDelay: '1s' }} />
                      </div>

                      {/* Node 3: Target Company */}
                      <div className="w-full lg:w-auto shrink-0">
                        <div className={`
                          bg-white/5 border ${companyStyle.borderClass} rounded-2xl p-6 w-full lg:w-48 text-center flex flex-col items-center justify-center shadow-lg transition-transform hover:-translate-y-1 duration-300 min-h-[142px]
                        `}>
                          <div className="mb-4 flex items-center justify-center">
                            {companyStyle.logo}
                          </div>
                          <span className="text-white font-bold text-sm block mb-1">
                            {companyName}
                          </span>
                          <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                            Destination
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Route Diagnostics Widgets */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    
                    {/* Diagnostic Card 1 */}
                    <div className="bg-white/5 border border-emerald-500/20 rounded-2xl p-5 flex items-center gap-4 shadow-md hover:border-emerald-500/35 transition-all">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-gray-400 text-xs font-semibold block mb-0.5 uppercase tracking-wider">Route Probability</span>
                        <span className="text-white font-bold text-base sm:text-lg font-sora block leading-none">
                          {activeAlumni.probability}
                        </span>
                      </div>
                    </div>

                    {/* Diagnostic Card 2 */}
                    <div className="bg-white/5 border border-cyan-500/20 rounded-2xl p-5 flex items-center gap-4 shadow-md hover:border-cyan-500/35 transition-all">
                      <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-300 shrink-0">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-gray-400 text-xs font-semibold block mb-0.5 uppercase tracking-wider">Response Speed</span>
                        <span className="text-white font-bold text-base sm:text-lg font-sora block leading-none">
                          {activeAlumni.speed}
                        </span>
                      </div>
                    </div>

                    {/* Diagnostic Card 3 */}
                    <div className="bg-white/5 border border-purple-500/20 rounded-2xl p-5 flex items-center gap-4 shadow-md hover:border-purple-500/35 transition-all">
                      <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-gray-400 text-xs font-semibold block mb-0.5 uppercase tracking-wider">Active Community</span>
                        <span className="text-white font-bold text-base sm:text-lg font-sora block leading-none">
                          {activeAlumni.activeAlumniCount} Alumni Available
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Referral Request Draft Widget */}
                  <div className="max-w-4xl mx-auto font-inter">
                    <div className="relative p-[1px] rounded-2xl bg-gradient-to-r from-white/10 to-transparent">
                      <div className="bg-black/50 backdrop-blur-md border border-white/8 rounded-[15px] p-6 shadow-xl">
                        
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                          <div>
                            <h5 className="text-white font-semibold font-sora text-sm sm:text-base mb-1">
                              60-Second Referral Request Draft
                            </h5>
                            <p className="text-gray-400 text-xs">
                              Personalized cold message optimized for LinkedIn or email outreach.
                            </p>
                          </div>
                          
                          {/* Copy Button */}
                          <button
                            id="simulator-copy-btn"
                            onClick={handleCopyText}
                            className={`
                              self-start sm:self-center py-2 px-4 rounded-lg font-sora font-semibold text-xs transition-all duration-200 flex items-center gap-2 border
                              ${copied 
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                                : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10 hover:border-white/20 active:scale-[0.98]'
                              }
                            `}
                          >
                            {copied ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy to Clipboard</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* TextArea Content */}
                        <div className="relative">
                          <textarea
                            readOnly
                            value={activeAlumni.draftMessage}
                            className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-gray-300 text-xs sm:text-sm font-mono leading-relaxed h-32 focus:outline-none resize-none shadow-inner"
                          />
                          <div className="absolute bottom-2.5 right-3 text-[10px] text-gray-500 select-none font-mono">
                            Ready to send
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              )}

            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
