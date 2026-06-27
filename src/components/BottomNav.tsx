import React from 'react';

export interface BottomNavItem {
  id: string;
  label: string;
  icon: React.ComponentType<any> | React.ElementType;
  badge?: number | null;
}

interface BottomNavProps {
  items: BottomNavItem[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  role: 'seeker' | 'alumni';
}

export default function BottomNav({
  items,
  activeTab,
  setActiveTab,
  role,
}: BottomNavProps) {
  const isSeeker = role === 'seeker';

  const activeColor = isSeeker ? 'text-purple-400' : 'text-emerald-400';
  const activeGlow = isSeeker ? 'drop-shadow-[0_0_6px_rgba(168,85,247,0.45)]' : 'drop-shadow-[0_0_6px_rgba(16,185,129,0.45)]';
  const badgeBg = isSeeker ? 'bg-purple-500' : 'bg-rose-500';

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#050508]/85 backdrop-blur-xl border-t border-white/[0.05] z-50 shadow-[0_-8px_30px_rgba(0,0,0,0.7)] pb-safe">
      <div className="flex items-center justify-around h-[60px] px-3.5 w-full max-w-md mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className="relative flex flex-col items-center justify-center flex-1 h-full py-1.5 text-center transition-all duration-200 cursor-pointer active:scale-95"
            >
              <Icon 
                className={`w-[20px] h-[20px] transition-all duration-300 ${
                  isActive 
                    ? `${activeColor} ${activeGlow} scale-110` 
                    : 'text-slate-500 hover:text-slate-350'
                }`} 
              />
              
              <span 
                className={`text-[9px] font-bold mt-1.5 tracking-wider uppercase transition-all duration-200 ${
                  isActive 
                    ? `${activeColor} opacity-100 font-black` 
                    : 'text-slate-600 opacity-80 font-medium'
                }`}
              >
                {item.label}
              </span>

              {item.badge !== undefined && item.badge !== null && item.badge > 0 && (
                <span className={`absolute top-1.5 right-1/4 translate-x-2 min-w-[13px] h-[13px] px-0.5 rounded-full text-[7.5px] font-bold flex items-center justify-center ${badgeBg} text-white`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
