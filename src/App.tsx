import { useState, useEffect } from 'react';
import './App.css';

import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';

import { AuthPage } from './components/AuthPage';
import { DashboardPage } from './components/DashboardPage';
import { About } from './components/About';
import { LandingLeaderboard } from './components/LandingLeaderboard';
import { ForgotPassword } from './components/ForgotPassword';
import { ResetPassword } from './components/ResetPassword';

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'auth' | 'dashboard' | 'forgot-password' | 'reset-password'>('landing');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [session, setSession] = useState<{
    id: number;
    role: 'seeker' | 'alumni';
    name: string;
    college?: string;
    company?: string;
  } | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Simple path routing and popstate listener
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/forgot-password') {
        setCurrentPage('forgot-password');
      } else if (path === '/reset-password') {
        setCurrentPage('reset-password');
      } else if (path === '/login' || path === '/signup') {
        setAuthMode(path === '/signup' ? 'signup' : 'login');
        setCurrentPage('auth');
      } else {
        const hasToken = !!localStorage.getItem('token');
        setCurrentPage(hasToken ? 'dashboard' : 'landing');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Check user session on startup
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('token');
      const path = window.location.pathname;

      // Determine initial page from path first (for refreshes/direct links)
      if (path === '/forgot-password') {
        setCurrentPage('forgot-password');
      } else if (path === '/reset-password') {
        setCurrentPage('reset-password');
      }

      if (token) {
        try {
          const res = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (res.ok) {
            const user = await res.json();
            setSession({
              id: user.id,
              role: user.role,
              name: user.name,
              college: user.college,
              company: user.company
            });
            // Only redirect to dashboard if we're not on reset or forgot password routes
            if (path !== '/forgot-password' && path !== '/reset-password') {
              setCurrentPage('dashboard');
            }
          } else {
            localStorage.removeItem('token');
            if (path !== '/forgot-password' && path !== '/reset-password') {
              setCurrentPage('landing');
            }
          }
        } catch (err) {
          console.error("Error validating session:", err);
        }
      } else {
        // No token, check if we should be on landing page
        if (path !== '/forgot-password' && path !== '/reset-password') {
          if (path === '/login' || path === '/signup') {
            setAuthMode(path === '/signup' ? 'signup' : 'login');
            setCurrentPage('auth');
          } else {
            setCurrentPage('landing');
          }
        }
      }
      setIsInitializing(false);
    };
    checkSession();
  }, []);

  // Scroll to top when changing pages
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  }, [currentPage]);

  const handleNavigate = (page: 'landing' | 'auth' | 'forgot-password' | 'reset-password', mode: 'login' | 'signup' = 'login') => {
    setAuthMode(mode);
    setCurrentPage(page);

    // Update browser URL history
    if (page === 'forgot-password') {
      window.history.pushState({}, '', '/forgot-password');
    } else if (page === 'reset-password') {
      window.history.pushState({}, '', '/reset-password' + window.location.search);
    } else if (page === 'landing') {
      window.history.pushState({}, '', '/');
    } else if (page === 'auth') {
      window.history.pushState({}, '', mode === 'signup' ? '/signup' : '/login');
    }
  };

  const handleAuthSuccess = (token: string, user: { id: number; role: 'seeker' | 'alumni'; name: string; company?: string; college?: string }) => {
    localStorage.setItem('token', token);
    setSession(user);
    setCurrentPage('dashboard');
    window.history.pushState({}, '', '/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setSession(null);
    setCurrentPage('landing');
    window.history.pushState({}, '', '/');
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-sora select-none">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
          <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Initializing Nexus Connect...</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative min-h-screen flex flex-col justify-between overflow-x-hidden select-none transition-all duration-200 bg-black text-white"
    >
      {/* Premium Static Aurora Background (No animations, bluish + red, adapts to screen) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#020205]">
        {/* Premium Bluish Glow (Top-Left) */}
        <div className="absolute w-[80vw] h-[80vw] sm:w-[60vw] sm:h-[60vw] md:w-[50vw] md:h-[50vw] max-w-[800px] max-h-[800px] min-w-[300px] min-h-[300px] rounded-full bg-[#1A6BF5]/26 -left-[15%] -top-[15%] blur-[120px] sm:blur-[160px] md:blur-[220px]" />
        
        {/* Premium Red Glow (Bottom-Right) */}
        <div className="absolute w-[90vw] h-[90vw] sm:w-[70vw] sm:h-[70vw] md:w-[55vw] md:h-[55vw] max-w-[900px] max-h-[900px] min-w-[350px] min-h-[350px] rounded-full bg-[#EF4444]/22 -right-[15%] -bottom-[15%] blur-[120px] sm:blur-[160px] md:blur-[220px]" />
        
        {/* Purple Depth Blend Transition Glow */}
        <div className="absolute w-[45vw] h-[45vw] rounded-full bg-purple-600/12 left-[30%] top-[20%] blur-[110px] md:blur-[180px]" />
        
        {/* Matte Frosted Ice Glass Overlay */}
        <div className="absolute inset-0 bg-[#020205]/10 backdrop-blur-[110px] md:backdrop-blur-[160px]" />
      </div>

      {/* Navbar Header Section (Only on Landing Page) */}
      {currentPage === 'landing' && (
        <Navbar 
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}

      <main className="flex-grow relative z-10">
        {currentPage === 'landing' && (
          <>
            {/* Section 1 — Hero */}
            <Hero onNavigate={handleNavigate} />

            {/* Section 2 — How It Works */}
            <HowItWorks />

            {/* Section 3 — Alumni Leaderboard / Hall of Fame */}
            <LandingLeaderboard onNavigate={handleNavigate} />

            {/* Section 4 — About NexInCampus */}
            <About />
            {/* Giant Brand Watermark with Sliced Tagline Cutout */}
            <div className="w-full overflow-hidden select-none pointer-events-none mt-12 mb-20 flex items-center justify-center relative h-32 md:h-44 bg-transparent" aria-hidden="true">
              <style dangerouslySetInnerHTML={{ __html: `
                @keyframes watermarkShimmer {
                  0% { background-position: 0% 50%; }
                  50% { background-position: 100% 50%; }
                  100% { background-position: 0% 50%; }
                }
                .animate-watermark-shimmer {
                  background-size: 200% auto !important;
                  animation: watermarkShimmer 7s ease-in-out infinite;
                }
              `}} />
              
              <span
                className="animate-watermark-shimmer absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap select-none pointer-events-none z-0"
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: 'clamp(2.6rem, 9vw, 8rem)',
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                  background: 'linear-gradient(90deg, rgba(56,189,248,0.24) 0%, rgba(139,92,246,0.18) 25%, rgba(244,63,94,0.24) 50%, rgba(139,92,246,0.18) 75%, rgba(56,189,248,0.24) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  display: 'block',
                }}
              >
                NexInCampus
              </span>

              {/* The Horizontal Cut/Slicing Bar masking the background text */}
              <div className="absolute w-full left-0 top-1/2 -translate-y-1/2 h-[20px] sm:h-[32px] md:h-[40px] bg-[#020205] flex items-center justify-center z-10 border-y border-white/5">
                {/* Tagline centered inside the cut */}
                <span className="text-center px-4 font-space-grotesk text-[7.5px] sm:text-[10px] md:text-[11px] font-extrabold tracking-[0.18em] sm:tracking-[0.3em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-rose-400 drop-shadow-[0_2px_8px_rgba(56,189,248,0.15)]">
                  where your college network becomes your career
                </span>
              </div>
            </div>

          </>
        )}

        {currentPage === 'auth' && (
          <AuthPage 
            initialMode={authMode}
            onSuccess={handleAuthSuccess}
            onBack={() => handleNavigate('landing')}
            onForgotPassword={() => handleNavigate('forgot-password')}
          />
        )}

        {currentPage === 'forgot-password' && (
          <ForgotPassword onBack={() => handleNavigate('auth', 'login')} />
        )}

        {currentPage === 'reset-password' && (
          <ResetPassword onBack={() => handleNavigate('auth', 'login')} />
        )}

        {currentPage === 'dashboard' && session && (
          <DashboardPage 
            id={session.id}
            role={session.role}
            name={session.name}
            college={session.college}
            company={session.company}
            onLogout={handleLogout}
          />
        )}
      </main>
    </div>
  );
}

export default App;
