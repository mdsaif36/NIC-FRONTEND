import React from 'react';
import { LogOut } from 'lucide-react';

export interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<any> | React.ElementType;
  badge?: number | null;
}

interface SidebarProps {
  items: SidebarItem[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  role: 'seeker' | 'alumni';
  profileName: string;
  profileCollegeOrCompany?: string;
  onLogout: () => void;
  referralCredits?: { remaining: number; limit: number; nextResetDate: string } | null;
}

export default function Sidebar({
  items,
  activeTab,
  setActiveTab,
  role,
  profileName,
  profileCollegeOrCompany = '',
  onLogout,
  referralCredits = null,
}: SidebarProps) {
  const isSeeker = role === 'seeker';
  
  // Theme colors
  const activeBgClass = isSeeker 
    ? 'bg-purple-500/10 text-white' 
    : 'bg-emerald-500/10 text-white border border-white/[0.055]';
  const activeIconClass = isSeeker 
    ? 'text-purple-400' 
    : 'text-emerald-400';
  const badgeClass = isSeeker 
    ? 'bg-purple-450/20 text-purple-300' 
    : 'bg-rose-500 text-white';

  const initials = profileName 
    ? profileName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) 
    : 'S';

  return (
    <aside className="hidden md:flex flex-col bg-gray-900 border-r border-gray-800 transition-all duration-300 w-20 lg:w-64 shrink-0 relative z-30">
      {/* Brand Logo Area */}
      <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-gray-800 shrink-0">
        <span className="font-space-grotesk font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF1E3C] to-[#1E40FF] text-xl tracking-tight leading-none block lg:hidden">
          N'
        </span>
        <div className="hidden lg:flex flex-col select-none">
          <span className="font-space-grotesk font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF1E3C] to-[#1E40FF] text-base tracking-tight leading-none block">
            NextInCampus
          </span>
          <span className={`text-[9px] font-bold uppercase tracking-widest mt-2 block ${isSeeker ? 'text-purple-400/80' : 'text-emerald-400/80'}`}>
            {isSeeker ? 'Seeker Portal' : 'Alumni Portal'}
          </span>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-3 py-5 relative z-10 flex flex-col gap-1">
        <span className="hidden lg:block text-[8px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2.5">
          Navigation
        </span>
        <nav className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-center lg:justify-start gap-3 p-3 rounded-lg hover:bg-gray-800 transition-all duration-200 group relative ${
                  isActive ? activeBgClass : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isActive && isSeeker && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gradient-to-b from-purple-400 to-blue-500 rounded-r-full" />
                )}
                
                <div className={`w-5 h-5 flex items-center justify-center shrink-0 transition-colors duration-200 ${isActive ? activeIconClass : 'text-slate-500 group-hover:text-slate-350'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                
                <span className={`hidden lg:block text-xs font-semibold ${isActive ? 'text-white font-bold' : ''}`}>
                  {item.label}
                </span>

                {item.badge !== undefined && item.badge !== null && item.badge > 0 && (
                  <span className={`lg:relative absolute top-1 right-1 lg:top-0 lg:right-0 px-1.5 py-0.5 rounded-full text-[9px] font-bold min-w-[18px] text-center ${badgeClass}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Seeker Referral Credits (Only visible on Seeker portal + Desktop view) */}
        {isSeeker && referralCredits && (
          <div className="hidden lg:block mt-6 px-4 py-3.5 bg-black/40 border border-white/5 rounded-xl space-y-3 font-inter text-left shadow-md">
            <div className="flex items-center justify-between">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sora">Referral Credits</span>
              <span className="text-[10px] font-bold text-purple-400 font-mono bg-purple-500/10 px-2 py-0.5 rounded-md">
                {referralCredits.remaining} / {referralCredits.limit}
              </span>
            </div>
            
            <div className="flex items-center justify-between gap-1 py-1 px-0.5">
              {Array.from({ length: referralCredits.limit }).map((_, idx) => {
                const isActive = idx < referralCredits.remaining;
                return (
                  <div 
                    key={idx} 
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      isActive 
                        ? 'bg-purple-500' 
                        : 'bg-white/10'
                    }`} 
                    title={isActive ? "Active Credit" : "Spent Credit"}
                  />
                );
              })}
            </div>

            <div className="text-[8.5px] text-slate-500 font-medium">
              Cycle resets on {referralCredits.nextResetDate}
            </div>
          </div>
        )}
      </div>

      {/* Account Info and Sign Out Area */}
      <div className="px-3 pb-5 border-t border-gray-800 pt-4 relative z-10 flex flex-col gap-2 shrink-0">
        <span className="hidden lg:block text-[8px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">
          Account
        </span>
        
        {/* Profile Link */}
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`w-full flex items-center justify-center lg:justify-start gap-3 p-3 rounded-lg transition-all duration-200 group relative ${
            activeTab === 'profile' ? activeBgClass : 'text-slate-400 hover:text-slate-200 hover:bg-gray-800'
          }`}
        >
          {activeTab === 'profile' && isSeeker && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gradient-to-b from-purple-400 to-blue-500 rounded-r-full" />
          )}
          <div className="relative w-7 h-7 shrink-0">
            <div className={`absolute inset-0 rounded-full flex items-center justify-center text-white text-[9px] font-black shadow-md bg-gradient-to-br ${isSeeker ? 'from-purple-500 to-blue-600' : 'from-emerald-500 to-teal-650'}`}>
              {initials}
            </div>
          </div>
          <div className="hidden lg:block flex-1 min-w-0 text-left">
            <span className="block text-xs font-bold text-white truncate leading-tight">{profileName}</span>
            <span className="block text-[9px] text-slate-500 font-medium truncate">
              {profileCollegeOrCompany || (isSeeker ? 'Candidate Profile' : 'Alumni Mentor')}
            </span>
          </div>
        </button>

        {/* Logout Button */}
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center justify-center lg:justify-start gap-3 p-3 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/5 transition-all duration-200 group"
        >
          <div className="w-5 h-5 flex items-center justify-center shrink-0 group-hover:bg-rose-500/10 rounded transition-all">
            <LogOut className="w-4 h-4" />
          </div>
          <span className="hidden lg:block text-xs font-semibold">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
