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

  // Active theme classes matching the dashboard
  const activeClass = isSeeker
    ? 'bg-purple-500/15 text-purple-400 border border-purple-500/20'
    : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20';

  const inactiveClass = 'text-slate-500 hover:text-slate-200 border border-transparent';
  const badgeClass = isSeeker ? 'bg-purple-500 text-white' : 'bg-rose-500 text-white';

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-gray-900 border-t border-gray-800 z-50 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-around h-16 px-2 overflow-x-auto no-scrollbar">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 cursor-pointer ${
                isActive ? activeClass : inactiveClass
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[9px] mt-0.5 font-medium truncate max-w-full px-0.5">
                {item.label}
              </span>

              {item.badge !== undefined && item.badge !== null && item.badge > 0 && (
                <span className={`absolute -top-1 -right-1 min-w-[14px] h-[14px] px-1 rounded-full text-[8px] font-bold flex items-center justify-center ${badgeClass}`}>
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
