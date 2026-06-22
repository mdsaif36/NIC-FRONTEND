import React, { useState } from 'react';
import { API_BASE_URL } from '../config';

interface ForgotPasswordProps {
  onBack: () => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // API_BASE_URL is imported from centralized config

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage('If an account exists, a reset link has been sent to your email.');
      } else {
        setStatus('error');
        setMessage(data.message || 'Something went wrong.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 font-inter text-slate-200 relative z-10 select-none">
      <div className="max-w-md w-full p-8 rounded-2xl border border-white/5 bg-[#0a0a0f]/60 backdrop-blur-2xl shadow-2xl text-center">
        <h2 className="text-2xl font-sora font-extrabold text-white mb-2 tracking-tight">Forgot Password?</h2>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">Enter your email address and we'll send you a link to reset your password.</p>

        {status === 'success' ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold leading-relaxed">
              {message}
            </div>
            <button
              onClick={onBack}
              className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition uppercase tracking-wider"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/50 focus:outline-none text-white text-xs transition"
              />
            </div>
            {status === 'error' && <p className="text-[10px] text-rose-450 font-semibold">{message}</p>}
            
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onBack}
                className="w-1/3 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold uppercase tracking-wider text-xs transition hover:bg-white/10"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold uppercase tracking-wider text-xs transition hover:opacity-90 disabled:opacity-50 text-center"
              >
                {status === 'loading' ? 'Sending...' : 'Send Link'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
