import React, { useState } from 'react';
import { API_BASE_URL } from '../config';
import { Mail, Lock, User, Briefcase, GraduationCap, ChevronLeft, ChevronRight, ArrowLeft, Eye, EyeOff, AlertCircle } from 'lucide-react';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

const seekerTestimonials: Testimonial[] = [
  {
    quote: "Verify email, find a senior, get referred. It is the most powerful career accelerator for college students.",
    author: "Amit Sharma",
    role: "SWE at Microsoft"
  },
  {
    quote: "Search and find your dream job is now easier than ever. Just browse a job and apply if you need to.",
    author: "Mas Parjono",
    role: "UI Designer at Google"
  },
  {
    quote: "NiC connected me with an alum from my own college who referred me for my dream internship!",
    author: "Sneha Reddy",
    role: "Student at IIT Bombay"
  }
];

const alumniTestimonials: Testimonial[] = [
  {
    quote: "As an alumni, referring juniors from my college is incredibly rewarding. NiC makes the routing seamless.",
    author: "Priya Patel",
    role: "Product Manager at Meta"
  },
  {
    quote: "Giving back to my alma mater by mentoring and referring talented students has never been this easy and structured.",
    author: "Rohan Sen",
    role: "Staff Engineer at Netflix"
  },
  {
    quote: "I found amazing talent for my team directly from my college. It's a win-win for everyone involved.",
    author: "Sarah Jenkins",
    role: "Engineering Manager at Apple"
  }
];

interface AuthPageProps {
  initialMode?: 'login' | 'signup';
  initialRole?: 'seeker' | 'alumni';
  onSuccess: (token: string, user: { id: number, role: 'seeker' | 'alumni', name: string, email?: string, company?: string, college?: string, isProfileComplete?: boolean }) => void;
  onBack: () => void;
  onForgotPassword: () => void;
}

let googleInitializedGlobal = false;
let activeGoogleCallback: ((response: any) => void) | null = null;

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'login', initialRole = 'seeker', onSuccess, onBack, onForgotPassword }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [role, setRole] = useState<'seeker' | 'alumni'>(initialRole);
  const [showPassword, setShowPassword] = useState(false);

  // API_BASE_URL is imported from centralized config

  React.useEffect(() => {
    setIsLogin(initialMode === 'login');
    setShowPassword(false);
    setEmail('');
    setPassword('');
    setError(null);
  }, [initialMode]);

  React.useEffect(() => {
    setRole(initialRole);
  }, [initialRole]);

  React.useEffect(() => {
    setEmail('');
    setPassword('');
    setShowPassword(false);
    setError(null);
    setCurrentTestimonial(0);
  }, [isLogin, role]);
  
  
  // Load Google GSI client library dynamically
  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    
    return () => {
      const scriptElement = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (scriptElement && document.body.contains(scriptElement)) {
        document.body.removeChild(scriptElement);
      }
    };
  }, []);

  // Handle GitHub OAuth Redirect Code
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      // Clear URL params so it doesn't trigger again on reload
      window.history.replaceState({}, document.title, window.location.pathname);
      
      const storedRole = (localStorage.getItem('auth_role') as 'seeker' | 'alumni') || 'seeker';
      
      const handleGithubCallback = async () => {
        setError(null);
        setIsSubmitting(true);
        try {
          const res = await fetch(`${API_BASE_URL}/api/auth/github`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code, role: storedRole })
          });
          const data = await res.json();
          if (res.ok) {
            onSuccess(data.token, data.user);
          } else {
            setError(data.message || 'GitHub login failed.');
          }
        } catch (err) {
          setError('Failed to authenticate with GitHub.');
        } finally {
          setIsSubmitting(false);
          localStorage.removeItem('auth_role');
        }
      };
      
      handleGithubCallback();
    }
  }, [onSuccess, API_BASE_URL]);

  // Testimonial slider state
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');

  const activeTestimonials = role === 'seeker' ? seekerTestimonials : alumniTestimonials;

  const handlePrevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev === 0 ? activeTestimonials.length - 1 : prev - 1));
  };

  const handleNextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev === activeTestimonials.length - 1 ? 0 : prev + 1));
  };

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMockSocialLogin = async (provider: 'google' | 'github') => {
    setError(null);
    setIsSubmitting(true);
    
    const emailInput = prompt(
      `[Developer Testing Mode] Enter email to sign up/login with ${provider}:`,
      provider === 'google' ? 'mock_google_user@kiit.ac.in' : 'mock_github_user@kiit.ac.in'
    );
    if (emailInput === null) {
      setIsSubmitting(false);
      return;
    }
    
    const nameInput = prompt(
      `[Developer Testing Mode] Enter name for this profile:`,
      provider === 'google' ? 'Mock Google User' : 'Mock GitHub User'
    );
    if (nameInput === null) {
      setIsSubmitting(false);
      return;
    }

    try {
      const endpoint = provider === 'google' ? '/api/auth/google' : '/api/auth/github';
      const payload = provider === 'google' 
        ? { token: 'mock-google-token', role, email: emailInput, name: nameInput }
        : { code: 'mock-github-code', role, email: emailInput, name: nameInput };

      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (res.ok) {
        onSuccess(data.token, data.user);
      } else {
        setError(data.message || `${provider} authentication failed.`);
      }
    } catch (err) {
      console.error(err);
      setError('Connection to backend failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    const googleClientId = (import.meta as any).env.VITE_GOOGLE_CLIENT_ID;
    if (googleClientId && (window as any).google?.accounts?.id) {
      activeGoogleCallback = async (response: any) => {
        setError(null);
        setIsSubmitting(true);
        try {
          const res = await fetch(`${API_BASE_URL}/api/auth/google`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: response.credential, role })
          });
          const data = await res.json();
          if (res.ok) {
            onSuccess(data.token, data.user);
          } else {
            setError(data.message || 'Google authentication failed.');
          }
        } catch (err) {
          setError('Connection to backend failed.');
        } finally {
          setIsSubmitting(false);
        }
      };

      if (!googleInitializedGlobal) {
        (window as any).google.accounts.id.initialize({
          client_id: googleClientId,
          callback: (response: any) => {
            if (activeGoogleCallback) {
              activeGoogleCallback(response);
            }
          }
        });
        googleInitializedGlobal = true;
      }
      (window as any).google.accounts.id.prompt();
    } else {
      handleMockSocialLogin('google');
    }
  };

  const handleGithubLogin = () => {
    const githubClientId = (import.meta as any).env.VITE_GITHUB_CLIENT_ID;
    if (githubClientId) {
      localStorage.setItem('auth_role', role);
      const redirectUri = window.location.origin;
      window.location.href = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email`;
    } else {
      handleMockSocialLogin('github');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setError(null);
    setIsSubmitting(true);

    try {
      if (isLogin) {
        const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password, role })
        });
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem('savedEmail', email);
          onSuccess(data.token, {
            id: data.user.id,
            role: data.user.role,
            name: data.user.name,
            college: data.user.college,
            company: data.user.company,
            email: data.user.email,
            isProfileComplete: data.user.isProfileComplete
          });
        } else {
          setError(data.message || 'Login failed. Please check your credentials.');
        }
      } else {
        const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            password,
            role,
            name: name || email.split('@')[0],
            college: college || '',
            company: role === 'alumni' ? company : undefined,
            jobTitle: role === 'alumni' ? jobTitle : undefined
          })
        });
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem('savedEmail', email);
          onSuccess(data.token, {
            id: data.user.id,
            role: data.user.role,
            name: data.user.name,
            college: data.user.college,
            company: data.user.company,
            email: data.user.email,
            isProfileComplete: data.user.isProfileComplete
          });
        } else {
          setError(data.message || 'Registration failed. Please check details.');
        }
      }
    } catch (err) {
      console.error(err);
      setError('Connection to backend failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="h-screen max-h-screen w-full flex items-center justify-center px-4 md:px-6 relative overflow-hidden bg-black font-inter z-10">
      
      {/* Dynamic inline styles for rotating wireframe star graphic and moving neon borders */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes starRotate {
          0% { transform: rotate(0deg) scale(1); opacity: 0.3; }
          50% { transform: rotate(180deg) scale(1.08); opacity: 0.55; }
          100% { transform: rotate(360deg) scale(1); opacity: 0.3; }
        }
        .animate-star-rotate {
          animation: starRotate 24s linear infinite;
        }
      `}} />

      {/* Back to landing page button (only arrow icon) */}
      <button
        onClick={onBack}
        className="absolute top-6 right-6 md:right-12 flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-slate-300 hover:text-white transition-all z-30"
        aria-label="Back to landing page"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      {/* Main split-screen panel container matching mockup layout */}
      <div 
        className="relative w-full max-w-md lg:max-w-5xl max-h-[92vh] lg:max-h-[90vh] rounded-[2rem] md:rounded-[2.5rem] border border-white/10 bg-white/[0.02] backdrop-blur-3xl shadow-[0_30px_70px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.05)] overflow-visible grid lg:grid-cols-2 p-5 md:p-6 lg:p-8 gap-6 lg:gap-8 z-20"
      >
        {/* Card Ambient Glow Orbs */}
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-red-500/5 blur-[90px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-blue-500/5 blur-[90px] pointer-events-none" />

        {/* ── Left Pane: Auth Form ── */}
        <div className="flex flex-col justify-between py-2 md:py-4 px-1 md:px-2 text-left overflow-y-auto no-scrollbar h-full">
          
          {/* Logo & Welcome Header combined to save critical vertical space */}
          <div className="mb-3 lg:mb-5 shrink-0">
            <div className="flex items-center gap-2 mb-2 select-none">
              <svg viewBox="0 0 160 100" className="w-8 h-8 lg:w-10 lg:h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="logo-grad-ni-auth" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF8F7B" />
                    <stop offset="100%" stopColor="#FF5E7E" />
                  </linearGradient>
                  <linearGradient id="logo-grad-c-auth" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38BDF8" />
                    <stop offset="100%" stopColor="#1E40FF" />
                  </linearGradient>
                </defs>
                <path d="M 25 65 L 25 36 C 25 22, 45 22, 45 30 L 60 50" stroke="url(#logo-grad-ni-auth)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 38 48 L 53 68 C 58 74, 68 74, 68 64 L 68 36" stroke="url(#logo-grad-ni-auth)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="68" cy="20" r="6" fill="#FF8F7B" />
                <path d="M 130 35 A 21.2 21.2 0 1 0 130 65" stroke="url(#logo-grad-c-auth)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="font-space-grotesk font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF1E3C] to-[#1E40FF] text-base lg:text-lg tracking-tight select-none flex items-center cursor-pointer">
                NextInCampus
              </span>
            </div>
            <h1 className="font-sora font-extrabold text-xl sm:text-2xl lg:text-3xl text-white tracking-tight leading-none mb-1 sm:mb-1.5">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-slate-400 text-xs font-medium">
              {isLogin ? 'Please enter your account details' : 'Enter your details below to join the referral network'}
            </p>
          </div>

          {/* User Type Switcher Tabs (Seeker vs Alumni) */}
          <div className="flex p-1 bg-white/[0.04] border border-white/5 backdrop-blur-xl rounded-full mb-3 sm:mb-4 lg:mb-5 max-w-[280px] lg:max-w-sm shrink-0">
            <button
              type="button"
              onClick={() => setRole('seeker')}
              className={`flex-1 text-center py-1.5 sm:py-2 rounded-full text-[10px] lg:text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                role === 'seeker'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-blue-600'
              }`}
            >
              Seeker
            </button>
            <button
              type="button"
              onClick={() => setRole('alumni')}
              className={`flex-1 text-center py-1.5 sm:py-2 rounded-full text-[10px] lg:text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                role === 'alumni'
                  ? 'bg-gradient-to-r from-red-650 to-rose-500 text-white shadow-md shadow-red-500/20'
                  : 'text-slate-400 hover:text-red-600'
              }`}
            >
              Alumni
            </button>
          </div>

          {/* Core Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-3 lg:space-y-4 grow flex flex-col justify-center">
            
            {/* Conditional input fields for registration */}
            {!isLogin ? (
              <div className="space-y-3">
                {/* Row 1: Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="relative w-full">
                    <label className="block text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-space-grotesk">Full Name</label>
                    <div className="relative rounded-full p-[1.5px] premium-neon-input-wrap">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 z-10" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="E.g., Priya Sharma"
                        className="w-full pl-8 pr-3 py-1.5 sm:py-2 lg:py-2.5 bg-black hover:bg-slate-950/80 rounded-full text-white placeholder-slate-500 focus:outline-none transition text-xs font-inter relative z-0"
                      />
                    </div>
                  </div>
                  <div className="relative w-full">
                    <label className="block text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-space-grotesk">
                      Email
                    </label>
                    <div className="relative rounded-full p-[1.5px] premium-neon-input-wrap">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 z-10" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full pl-8 pr-3 py-1.5 sm:py-2 lg:py-2.5 bg-black hover:bg-slate-950/80 rounded-full text-white placeholder-slate-500 focus:outline-none transition text-xs font-inter relative z-0"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 2: College Name & Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="relative w-full">
                    <label className="block text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-space-grotesk">College Name</label>
                    <div className="relative rounded-full p-[1.5px] premium-neon-input-wrap">
                      <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 z-10" />
                      <input
                        type="text"
                        required
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                        placeholder="E.g., IIT Delhi"
                        className="w-full pl-8 pr-3 py-1.5 sm:py-2 lg:py-2.5 bg-black hover:bg-slate-950/80 rounded-full text-white placeholder-slate-500 focus:outline-none transition text-xs font-inter relative z-0"
                      />
                    </div>
                  </div>
                  <div className="relative w-full">
                    <label className="block text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-space-grotesk font-inter">Password</label>
                    <div className="relative rounded-full p-[1.5px] premium-neon-input-wrap">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 z-10" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create password"
                        autoComplete="new-password"
                        className="w-full pl-8 pr-10 py-1.5 sm:py-2 lg:py-2.5 bg-black hover:bg-slate-950/80 rounded-full text-white placeholder-slate-500 focus:outline-none transition text-xs font-inter relative z-0"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition z-20"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Row 3 (Alumni Only): Company & Role */}
                {role === 'alumni' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="relative w-full">
                      <label className="block text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-space-grotesk font-inter">Company</label>
                      <div className="relative rounded-full p-[1.5px] premium-neon-input-wrap">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 z-10" />
                        <input
                          type="text"
                          required
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="Google"
                          className="w-full pl-8 pr-3 py-1.5 sm:py-2 bg-black hover:bg-slate-950/80 rounded-full text-white placeholder-slate-500 focus:outline-none transition text-xs font-inter relative z-0"
                        />
                      </div>
                    </div>
                    <div className="relative w-full">
                      <label className="block text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-space-grotesk font-inter">Role Title</label>
                      <div className="relative rounded-full p-[1.5px] premium-neon-input-wrap">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 z-10" />
                        <input
                          type="text"
                          required
                          value={jobTitle}
                          onChange={(e) => setJobTitle(e.target.value)}
                          placeholder="SWE III"
                          className="w-full pl-8 pr-3 py-1.5 sm:py-2 bg-black hover:bg-slate-950/80 rounded-full text-white placeholder-slate-500 focus:outline-none transition text-xs font-inter relative z-0"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Login Mode Inputs */
              <div className="space-y-3">
                <div className="relative w-full">
                  <label className="block text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-space-grotesk">
                    Email
                  </label>
                  <div className="relative rounded-full p-[1.5px] premium-neon-input-wrap">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 z-10" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      autoComplete="off"
                      className="w-full pl-9 pr-4 py-2 sm:py-2.5 bg-black hover:bg-slate-950/80 rounded-full text-white placeholder-slate-500 focus:outline-none transition text-xs font-inter relative z-0"
                    />
                  </div>
                </div>

                <div className="relative w-full">
                  <label className="block text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-space-grotesk font-inter">Password</label>
                  <div className="relative rounded-full p-[1.5px] premium-neon-input-wrap">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 z-10" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      autoComplete="new-password"
                      className="w-full pl-9 pr-10 py-2 sm:py-2.5 bg-black hover:bg-slate-950/80 rounded-full text-white placeholder-slate-500 focus:outline-none transition text-xs font-inter relative z-0"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition z-20"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <div className="flex justify-end mt-2">
                    <a 
                      href="/forgot-password" 
                      onClick={(e) => { e.preventDefault(); onForgotPassword(); }}
                      className="text-[10px] text-purple-400 font-bold hover:text-purple-300 transition"
                    >
                      Forgot Password?
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Checkbox (Sign In mode only) */}
            {isLogin && (
              <div className="flex items-center justify-between text-[11px] py-0.5 select-none shrink-0 text-slate-400">
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-400 hover:text-white transition">
                  <input 
                    type="checkbox" 
                    className="rounded border-white/15 bg-black/40 text-purple-600 focus:ring-0 focus:outline-none w-3.5 h-3.5 cursor-pointer"
                  />
                  Keep me logged in
                </label>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-[10px] text-rose-400 font-semibold leading-relaxed flex gap-2 font-inter shrink-0">
                <AlertCircle className="w-4 h-4 text-rose-455 shrink-0 mt-0.5" />
                <div>{error}</div>
              </div>
            )}

            {/* Submit button (Dark premium styling) */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 lg:py-3 mt-2 rounded-full bg-[#0d0d12] border border-white/10 text-white font-sora font-bold text-[11px] lg:text-xs tracking-wider uppercase shrink-0 disabled:opacity-50 disabled:pointer-events-none transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-black/50"
            >
              {isSubmitting ? 'Processing...' : (isLogin ? 'Sign in' : 'Create Account')}
            </button>
          </form>

          {/* Toggle between Sign In / Sign Up */}
          <div className="text-center mt-3 sm:mt-4 text-[11px] text-slate-400 shrink-0 select-none">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-white hover:underline font-bold transition ml-0.5"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </div>

          {/* ── OAuth social buttons matching mockup circles ── */}
          {isLogin && (
            <div className="mt-3 sm:mt-4 lg:mt-6 shrink-0">
              <div className="flex items-center justify-center gap-3">
                {/* Google */}
                <button 
                  type="button" 
                  onClick={handleGoogleLogin}
                  className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition"
                  title="Login with Google"
                >
                  <svg className="w-4 h-4 lg:w-5 lg:h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.62-.57-1.07-1.3-1.21-2.18-.08-.5-.12-1.01-.12-1.54s.04-1.04.12-1.54z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                  </svg>
                </button>
                {/* GitHub */}
                <button 
                  type="button" 
                  onClick={handleGithubLogin}
                  className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition"
                  title="Login with GitHub"
                >
                  <svg className="w-4 h-4 lg:w-5 lg:h-5" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                  </svg>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* ── Right Pane: Testimonial & Glowing Geometric Wireframe Star ── */}
        <div className={`hidden lg:flex relative rounded-[2rem] bg-slate-950/80 p-8 md:p-10 border ${role === 'seeker' ? 'border-blue-500/10' : 'border-rose-500/10'} overflow-hidden flex-col justify-between select-none h-full transition-all duration-500`}>
          
          {/* Subtle Ambient light inside panel */}
          <div className={`absolute top-0 right-0 w-64 h-64 ${role === 'seeker' ? 'bg-indigo-500/10' : 'bg-rose-500/10'} rounded-full blur-3xl pointer-events-none transition-all duration-500`} />
          <div className={`absolute bottom-0 left-0 w-64 h-64 ${role === 'seeker' ? 'bg-cyan-500/10' : 'bg-amber-500/10'} rounded-full blur-3xl pointer-events-none transition-all duration-500`} />

          {/* Testimonial Header Title */}
          <div className="relative z-10 text-left">
            {role === 'seeker' ? (
              <h2 className="font-sora text-white text-2xl md:text-3xl font-extrabold tracking-tight leading-tight mb-2">
                Accelerating
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Jobseekers.</span>
              </h2>
            ) : (
              <h2 className="font-sora text-white text-2xl md:text-3xl font-extrabold tracking-tight leading-tight mb-2">
                Empowering
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-300">Alumni.</span>
              </h2>
            )}
            {/* Elegant massive quote sign */}
            <span className={`block font-serif text-[5.5rem] leading-none ${role === 'seeker' ? 'text-cyan-400/20' : 'text-rose-400/20'} font-black h-12 -ml-2 select-none transition-colors duration-500`}>
              “
            </span>
          </div>

          {/* Testimonial Active Quote Area */}
          <div className="relative z-10 text-left my-8 min-h-[100px] flex flex-col justify-center">
            <p className="text-slate-200 text-sm md:text-base font-medium leading-relaxed italic transition-all duration-300">
              "{activeTestimonials[currentTestimonial]?.quote}"
            </p>
            <div className="mt-4">
              <span className="block font-bold text-white text-sm">{activeTestimonials[currentTestimonial]?.author}</span>
              <span className="block text-slate-400 text-xs mt-0.5">{activeTestimonials[currentTestimonial]?.role}</span>
            </div>
          </div>

          {/* Control Arrows Footer Row */}
          <div className="relative z-10 flex items-center justify-between mt-auto">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handlePrevTestimonial}
                className="w-9 h-9 rounded-lg border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition pointer-events-auto"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextTestimonial}
                className="w-9 h-9 rounded-lg border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition pointer-events-auto"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ── Rotating Animated Wireframe Star Graphic (mockup bottom-right) ── */}
          <div 
            className="absolute bottom-2 -right-8 w-56 h-56 z-0 pointer-events-none animate-star-rotate"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <svg viewBox="0 0 100 100" className={`w-full h-full ${role === 'seeker' ? 'text-indigo-400/30' : 'text-rose-400/30'} opacity-70 transition-colors duration-500`} fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" />
              <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.3" />
              {/* Star spikes */}
              {Array.from({ length: 8 }).map((_, i) => {
                const angle1 = (i * 45 * Math.PI) / 180;
                const angle2 = ((i * 45 + 22.5) * Math.PI) / 180;
                const x1 = 50 + 44 * Math.cos(angle1);
                const y1 = 50 + 44 * Math.sin(angle1);
                const x2 = 50 + 15 * Math.cos(angle2);
                const y2 = 50 + 15 * Math.sin(angle2);
                const x3 = 50 + 44 * Math.cos(angle1 + 45 * Math.PI / 180);
                const y3 = 50 + 44 * Math.sin(angle1 + 45 * Math.PI / 180);
                return (
                  <g key={i}>
                    <line x1="50" y1="50" x2={x1} y2={y1} stroke="currentColor" strokeWidth="0.8" />
                    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="0.5" />
                    <line x1={x2} y1={y2} x2={x3} y2={y3} stroke="currentColor" strokeWidth="0.5" />
                  </g>
                );
              })}
            </svg>
          </div>

        </div>

        {/* ── Overlay Float Card (Bottom Right Hovering) ── */}
        <div className="hidden lg:block absolute -bottom-10 right-10 z-20 pointer-events-auto transform rotate-2 hover:rotate-0 transition-all duration-500 shadow-2xl">
          <div className="bg-white/95 backdrop-blur-xl border border-white/20 p-6 rounded-[2rem] text-left max-w-[260px]">
            <h3 className="font-space-grotesk text-sm font-extrabold text-slate-900 tracking-tight leading-snug">
              Get your right job and right place apply now
            </h3>
            <p className="text-slate-600 text-[10px] leading-relaxed mt-2">
              Be among the first founders to experience the easiest way to start run a business.
            </p>
            {/* Avatar overlapping circles */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center -space-x-2">
                <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white overflow-hidden flex items-center justify-center font-bold text-[8px] text-slate-800">
                  <div className="w-full h-full bg-slate-400 flex items-center justify-center text-white">AS</div>
                </div>
                <div className="w-6 h-6 rounded-full bg-[#FF8F7B] border-2 border-white flex items-center justify-center font-bold text-[8px] text-white">
                  RS
                </div>
                <div className="w-6 h-6 rounded-full bg-[#1E40FF] border-2 border-white flex items-center justify-center font-bold text-[8px] text-white">
                  PM
                </div>
                <div className="w-6 h-6 rounded-full bg-slate-900 text-white border-2 border-white flex items-center justify-center font-black text-[7px]">
                  +2
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};