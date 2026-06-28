import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

export interface MobileNavItem {
  id: string;
  label: string;
  icon: React.ComponentType<any> | React.ElementType;
  badge?: number | null;
}

interface MobileSidebarProps {
  items: MobileNavItem[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  role: 'seeker' | 'alumni';
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({
  items,
  activeTab,
  setActiveTab,
  role,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const isSeeker = role === 'seeker';

  const activeColor = isSeeker ? 'text-purple-400' : 'text-emerald-400';
  const activeBg = isSeeker ? 'bg-purple-500/10' : 'bg-emerald-500/10';
  const badgeBg = isSeeker ? 'bg-purple-500' : 'bg-rose-500';

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    setIsOpen(false);
  };

  return (
    <>
      {/* Header with Hamburger Menu */}
      <div className="md:hidden flex items-center justify-between bg-[#050508]/85 backdrop-blur-xl border-b border-white/5 p-4 z-40 sticky top-0 shadow-sm">
        <span className="font-sora font-bold text-lg tracking-wider text-white">NextInCampus</span>
        <button 
          onClick={() => setIsOpen(true)} 
          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          aria-label="Open Menu"
        >
          <Menu className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Slide-in Overlay */}
      <div 
        className={`fixed inset-0 z-[100] transition-all duration-300 md:hidden ${isOpen ? 'visible' : 'invisible'}`}
      >
        {/* Background Fade */}
        <div 
          onClick={() => setIsOpen(false)}
          className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        />
        
        {/* Sidebar Panel */}
        <div 
          className={`absolute top-0 right-0 h-full w-[280px] bg-[#050508] border-l border-white/10 shadow-2xl p-6 transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex items-center justify-between mb-8">
            <span className="font-sora font-bold text-lg text-white tracking-widest">MENU</span>
            <button 
              onClick={() => setIsOpen(false)} 
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-slate-400 hover:text-white" />
            </button>
          </div>

          <nav className="flex flex-col gap-2 overflow-y-auto no-scrollbar pb-10">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-4 w-full p-4 rounded-xl transition-all duration-200 text-left ${
                    isActive 
                      ? `${activeBg} ${activeColor} border border-white/5` 
                      : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? activeColor : 'text-slate-500'}`} />
                  <span className={`text-xs font-space-grotesk uppercase tracking-widest font-bold flex-1 ${isActive ? 'text-white' : ''}`}>
                    {item.label}
                  </span>
                  
                  {item.badge !== undefined && item.badge !== null && item.badge > 0 && (
                    <span className={`px-2 py-0.5 text-[10px] font-bold text-white rounded-full ${badgeBg}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
};
