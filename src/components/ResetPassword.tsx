import React, { useState } from 'react';
import { API_BASE_URL } from '../config';

interface ResetPasswordProps {
  onBack: () => void;
}

export const ResetPassword: React.FC<ResetPasswordProps> = ({ onBack }) => {
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // Grab the token securely from the web address bar
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  // API_BASE_URL is imported from centralized config

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setStatus('error');
      setMessage('Invalid or missing reset token.');
      return;
    }

    setStatus('loading');

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage('Your password has been successfully reset! You can now log in.');
      } else {
        setStatus('error');
        setMessage(data.message || 'Failed to reset password.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  if (!token) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 font-inter text-slate-200 relative z-10 select-none">
        <div className="max-w-md w-full p-8 rounded-2xl border border-rose-500/20 bg-rose-500/5 backdrop-blur-2xl text-center space-y-4">
          <p className="text-sm text-rose-400">Error: No reset token found in the URL.</p>
          <button
            onClick={onBack}
            className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition uppercase tracking-wider"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 font-inter text-slate-200 relative z-10 select-none">
      <div className="max-w-md w-full p-8 rounded-2xl border border-white/5 bg-[#0a0a0f]/60 backdrop-blur-2xl shadow-2xl text-center">
        <h2 className="text-2xl font-sora font-extrabold text-white mb-2 tracking-tight">Set New Password</h2>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">Please enter your new secure password below.</p>

        {status === 'success' ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold leading-relaxed">
              {message}
            </div>
            <button
              onClick={onBack}
              className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition uppercase tracking-wider"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min. 6 chars)"
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/50 focus:outline-none text-white text-xs transition"
              />
            </div>
            {status === 'error' && <p className="text-[10px] text-rose-450 font-semibold">{message}</p>}
            
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold uppercase tracking-wider text-xs transition hover:opacity-90 disabled:opacity-50 text-center"
            >
              {status === 'loading' ? 'Saving...' : 'Update Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
