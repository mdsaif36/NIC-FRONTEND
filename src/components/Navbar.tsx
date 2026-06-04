import { useState, useEffect } from 'react';

const NAV_LINKS = [
  { label: 'Home', href: '#hero' },
] as const;

interface NavbarProps {
  currentPage: 'landing' | 'auth' | 'dashboard';
  onNavigate: (page: 'landing' | 'auth', mode?: 'login' | 'signup') => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, onLogout }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Scroll active section spy
  useEffect(() => {
    if (currentPage !== 'landing') return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      setActiveSection('home');
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage]);

  const handleLinkClick = (href: string) => {
    if (currentPage !== 'landing') {
      onNavigate('landing');
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return;
    }
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="navbar"
      className="fixed left-1/2 -translate-x-1/2 z-50 top-6 transition-all duration-300 font-inter w-auto px-4"
    >
      <div className={`
        flex items-center gap-4 justify-center backdrop-blur-2xl px-5 py-2 rounded-full border border-white/10 shadow-lg transition-all duration-300
        ${isScrolled ? 'bg-slate-950/80 shadow-2xl py-1.5 px-4' : 'bg-slate-950/40'}
      `}>
        {/* Logo */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('#hero');
          }}
          className="flex items-center select-none shrink-0 transition-transform duration-300 hover:scale-105 active:scale-95"
        >
          <svg viewBox="0 0 160 100" className="w-9 h-6 filter drop-shadow-[0_0_4px_rgba(56,189,248,0.25)]" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="logo-grad-ni-nav" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
              <linearGradient id="logo-grad-c-nav" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#EF4444" />
              </linearGradient>
            </defs>
            <path d="M 25 65 L 25 36 C 25 22, 45 22, 45 30 L 60 50" stroke="url(#logo-grad-ni-nav)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 38 48 L 53 68 C 58 74, 68 74, 68 64 L 68 36" stroke="url(#logo-grad-ni-nav)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="68" cy="20" r="6.5" fill="#38BDF8" />
            <path d="M 130 35 A 21.2 21.2 0 1 0 130 65" stroke="url(#logo-grad-c-nav)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>

        {/* Separator Line */}
        <div className="w-[1px] h-4 bg-white/10 shrink-0" />

        {/* Links */}
        <nav className="flex items-center gap-1">
          {currentPage === 'landing' && NAV_LINKS.map(({ label, href }) => {
            const isActive = activeSection === href.replace('#', '') || (href === '#hero' && activeSection === 'home');
            return (
              <a
                key={label}
                id={`nav-link-${label.toLowerCase().replace(/\s+/g, '-')}`}
                href={href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(href);
                }}
                className={`
                  px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 font-inter
                  ${isActive 
                    ? 'bg-white/10 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] font-bold' 
                    : 'text-slate-300 hover:text-white'
                  }
                `}
              >
                {label}
              </a>
            );
          })}

          {currentPage === 'dashboard' && (
            <span className="px-4 py-1.5 rounded-full text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 uppercase tracking-wider font-space-grotesk flex items-center gap-1.5 select-none">
              💻 Control Center
            </span>
          )}
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center shrink-0">
          {currentPage === 'landing' && (
            <div className="bg-white/5 border border-white/10 rounded-full p-0.5 pl-2.5 pr-0.5 flex items-center gap-2 backdrop-blur-md shadow-sm">
              {/* Login Button */}
              <button
                type="button"
                onClick={() => onNavigate('auth', 'login')}
                className="text-[11px] font-bold text-slate-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#38BDF8] hover:to-[#EF4444] transition-all duration-300 py-1 px-3.5 cursor-pointer"
              >
                Login
              </button>
              
              {/* Register Button */}
              <button
                id="navbar-signup-btn"
                type="button"
                onClick={() => onNavigate('auth', 'signup')}
                className="relative px-4 py-1.5 rounded-full text-white text-[11px] font-bold transition-all duration-300 shadow-[0_0_8px_rgba(255,255,255,0.05)] hover:shadow-[0_0_12px_rgba(239,68,68,0.45)] overflow-hidden cursor-pointer hover:scale-103 active:scale-97 group"
              >
                {/* Shifting Gradient Background (Visible on Hover) */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#1A6BF5] via-[#8B5CF6] to-[#EF4444] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
                
                {/* Little Black Background (Default) */}
                <div className="absolute inset-0 bg-[#0e0e12] border border-white/10 rounded-full group-hover:opacity-0 transition-opacity duration-300 z-0" />
                
                {/* Text Label */}
                <span className="relative z-10">Register</span>
              </button>
            </div>
          )}

          {currentPage === 'dashboard' && (
            <button
              type="button"
              onClick={onLogout}
              className="px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold uppercase tracking-wider transition font-sora"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
