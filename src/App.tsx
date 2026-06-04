import { useState, useEffect } from 'react';
import './App.css';

import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';

import { AuthPage } from './components/AuthPage';
import { DashboardPage } from './components/DashboardPage';
import { About } from './components/About';

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'auth' | 'dashboard'>('landing');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [session, setSession] = useState<{
    id: number;
    role: 'seeker' | 'alumni';
    name: string;
    college?: string;
    company?: string;
  } | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Check user session on startup
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('token');
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
            setCurrentPage('dashboard');
          } else {
            localStorage.removeItem('token');
          }
        } catch (err) {
          console.error("Error validating session:", err);
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

  const handleNavigate = (page: 'landing' | 'auth', mode: 'login' | 'signup' = 'login') => {
    setAuthMode(mode);
    setCurrentPage(page);
  };

  const handleAuthSuccess = (token: string, user: { id: number; role: 'seeker' | 'alumni'; name: string; company?: string; college?: string }) => {
    localStorage.setItem('token', token);
    setSession(user);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setSession(null);
    setCurrentPage('landing');
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

            {/* Section 3 — About NexInCampus */}
            <About />

            {/* Giant Brand Watermark with Centered Tagline Overlay */}
            <div className="w-full overflow-hidden select-none pointer-events-none mt-12 mb-20 flex items-center justify-center relative h-32 md:h-44" aria-hidden="true">
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
              
              {/* Giant background text (dimmed outline/shimmer) */}
              <span
                className="animate-watermark-shimmer absolute"
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: 'clamp(2.5rem, 9vw, 8rem)',
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                  background: 'linear-gradient(90deg, rgba(56,189,248,0.05) 0%, rgba(139,92,246,0.03) 25%, rgba(244,63,94,0.05) 50%, rgba(139,92,246,0.03) 75%, rgba(56,189,248,0.05) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  WebkitTextStroke: '1px rgba(255, 255, 255, 0.03)',
                  userSelect: 'none',
                  pointerEvents: 'none',
                  whiteSpace: 'nowrap',
                  display: 'block',
                  zIndex: 1,
                }}
              >
                NextInCampus
              </span>

              {/* Tagline centered in front with another color (vibrant gradient) */}
              <span className="relative z-10 text-center px-4 font-space-grotesk text-xs sm:text-sm md:text-base font-extrabold tracking-[0.2em] sm:tracking-[0.3em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-rose-400 drop-shadow-[0_2px_8px_rgba(56,189,248,0.15)]">
                where your college network becomes your career
              </span>
            </div>

          </>
        )}

        {currentPage === 'auth' && (
          <AuthPage 
            initialMode={authMode}
            onSuccess={handleAuthSuccess}
            onBack={() => handleNavigate('landing')}
          />
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
