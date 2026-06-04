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
        flex items-center gap-6 justify-center backdrop-blur-2xl px-5 py-2 rounded-full border border-white/10 shadow-lg transition-all duration-300
        ${isScrolled ? 'bg-slate-950/80 shadow-2xl py-1.5 px-4' : 'bg-slate-950/40'}
      `}>
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
            <div className="bg-white rounded-full p-0.5 pl-3.5 pr-0.5 flex items-center gap-3 border border-slate-200/20 shadow-md">
              {/* Login Button */}
              <button
                type="button"
                onClick={() => onNavigate('auth', 'login')}
                className="text-[11px] font-bold text-slate-700 hover:text-black transition-colors py-1 cursor-pointer"
              >
                Login
              </button>
              
              {/* Register Button */}
              <button
                id="navbar-signup-btn"
                type="button"
                onClick={() => onNavigate('auth', 'signup')}
                className="px-3.5 py-1 rounded-full bg-black hover:bg-slate-900 text-white text-[11px] font-bold transition-all duration-200 shadow-sm cursor-pointer hover:scale-102 active:scale-98"
              >
                Register
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
