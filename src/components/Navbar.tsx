import { useState, useEffect } from 'react';
import { Menu, X, LogIn, User } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Stats', href: '#stats' },
] as const;

interface NavbarProps {
  currentPage: 'landing' | 'auth' | 'dashboard';
  onNavigate: (page: 'landing' | 'auth', mode?: 'login' | 'signup') => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, onLogout }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Scroll & Active Section spy listener
  useEffect(() => {
    if (currentPage !== 'landing') return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);

      const scrollPos = window.scrollY + 160; // offset for navbar height
      
      const howItWorksSection = document.getElementById('how-it-works');
      const statsSection = document.getElementById('stats');
      const ctaSection = document.getElementById('cta');

      if (ctaSection && scrollPos >= ctaSection.offsetTop) {
        setActiveSection('cta');
      } else if (statsSection && scrollPos >= statsSection.offsetTop) {
        setActiveSection('stats');
      } else if (howItWorksSection && scrollPos >= howItWorksSection.offsetTop) {
        setActiveSection('how-it-works');
      } else {
        setActiveSection('home');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage]);

  const handleLinkClick = (href: string) => {
    setIsMenuOpen(false);
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

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate('landing');
    if (currentPage === 'landing') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header
      id="navbar"
      className="fixed left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-6xl top-6 transition-all duration-300 font-inter"
    >
      <div className={`
        w-full flex flex-col floating-navbar-pill backdrop-blur-2xl
        transition-all duration-300 ease-in-out
        ${isScrolled ? 'px-4 py-2 md:px-5' : 'px-5 py-3 md:px-6'}
        ${isMenuOpen ? 'rounded-[2rem]' : 'rounded-full'}
      `}>
        
        {/* Main Row */}
        <div className="flex items-center justify-between w-full relative">
          
          {/* Spacing placeholder for the absolute logo */}
          <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 invisible" />

          {/* Logo Badge (Left) overlapping the capsule boundary */}
          <a
            id="navbar-logo"
            href="#hero"
            onClick={handleLogoClick}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 md:-translate-x-1/3 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white border-2 border-slate-900/10 shadow-[0_4px_16px_rgba(0,0,0,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center select-none cursor-pointer z-50 group"
            aria-label="Home"
          >
            <svg viewBox="0 0 100 100" className="w-6.5 h-6.5 md:w-7.5 md:h-7.5" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="logo-grad-dark" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#090D1A" />
                  <stop offset="100%" stopColor="#1E293B" />
                </linearGradient>
              </defs>
              <path 
                d="M30 72V28L70 72V28" 
                stroke="url(#logo-grad-dark)" 
                strokeWidth="14" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <circle cx="70" cy="28" r="7.5" fill="#38BDF8" className="animate-pulse" />
            </svg>
          </a>

          {/* Links (Center) */}
          <nav className="hidden md:flex items-center gap-1">
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

          {/* Combined Action Pill (Right) */}
          <div className="hidden md:flex items-center shrink-0">
            {currentPage === 'landing' && (
              <div className="bg-white rounded-full p-1 pl-4 pr-1 flex items-center gap-3 border border-slate-200/20 shadow-md">
                {/* Login Button */}
                <button
                  type="button"
                  onClick={() => onNavigate('auth', 'login')}
                  className="text-xs font-bold text-slate-700 hover:text-black transition-colors py-1 cursor-pointer"
                >
                  Login
                </button>
                
                {/* Register Button */}
                <button
                  id="navbar-signup-btn"
                  type="button"
                  onClick={() => onNavigate('auth', 'signup')}
                  className="px-4 py-1.5 rounded-full bg-black hover:bg-slate-900 text-white text-xs font-bold transition-all duration-200 shadow-sm cursor-pointer hover:scale-102 active:scale-98"
                >
                  Register
                </button>
              </div>
            )}

            {currentPage === 'dashboard' && (
              <button
                type="button"
                onClick={onLogout}
                className="px-5 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold uppercase tracking-wider transition font-sora"
              >
                Logout
              </button>
            )}
          </div>

          {/* Hamburger Menu Button (Mobile only) */}
          <button
            id="navbar-hamburger"
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-1.5 rounded-full border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Accordion Menu Body */}
        <div className={`
          md:hidden flex flex-col gap-4 w-full transition-all duration-300 font-inter
          ${isMenuOpen ? 'max-h-[300px] opacity-100 pt-4 pb-2 border-t border-white/5 mt-3' : 'max-h-0 opacity-0 pointer-events-none overflow-hidden'}
        `}>
          <div className="flex flex-col gap-1.5 text-left">
            {currentPage === 'landing' && NAV_LINKS.map(({ label, href }) => {
              const isActive = activeSection === href.replace('#', '') || (href === '#hero' && activeSection === 'home');
              return (
                <a
                  key={label}
                  href={href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(href);
                  }}
                  className={`
                    px-4 py-2 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200
                    ${isActive 
                      ? 'bg-white/10 text-white font-bold shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]' 
                      : 'text-slate-350 hover:text-white'
                    }
                  `}
                >
                  {label}
                </a>
              );
            })}

            {currentPage === 'dashboard' && (
              <div className="px-4 py-2 text-sm text-slate-350 font-medium">
                Candidate Dashboard Workspace
              </div>
            )}
          </div>
          
          <div className="flex gap-3 pb-1">
            {currentPage === 'landing' && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onNavigate('auth', 'login');
                  }}
                  className="flex-1 py-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold text-white uppercase tracking-wider font-sora flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" /> Login
                </button>
                <button
                  id="mobile-signup-btn"
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onNavigate('auth', 'signup');
                  }}
                  className="flex-1 py-2.5 rounded-full bg-white hover:bg-slate-100 text-xs font-bold text-black uppercase tracking-wider font-sora flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <User className="w-4 h-4" /> Register
                </button>
              </>
            )}

            {currentPage === 'dashboard' && (
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  onLogout();
                }}
                className="w-full py-2.5 rounded-full bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider font-sora"
              >
                Logout
              </button>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};
