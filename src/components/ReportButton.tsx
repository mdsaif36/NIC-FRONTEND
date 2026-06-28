import { useState } from 'react';
import { API_BASE_URL } from '../config';
import { MessageSquareWarning, X } from 'lucide-react';

export const ReportButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!description.trim()) return;
    setIsSubmitting(true);
    try {
      let userData: any = null;
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const meRes = await fetch(`${API_BASE_URL}/api/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (meRes.ok) {
            userData = await meRes.json();
          }
        } catch (e) {
          console.error("Failed to fetch user data for report:", e);
        }
      }

      console.log("User Data:", userData);

      const res = await fetch(`${API_BASE_URL}/api/report-issue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          description, 
          pageUrl: window.location.href,
          userEmail: userData?.email || "No Email Provided",
          userName: userData?.name || "Unknown User",
          userRole: userData?.role || "Unknown Role",
          createdAt: userData?.createdAt || "Unknown Date"
        }),
      });

      if (res.ok) {
        alert("Report sent successfully! Thank you.");
        setIsOpen(false);
        setDescription('');
      } else {
        alert("Failed to send report. Please try again later.");
      }
    } catch (err) {
      console.error(err);
      alert("Error sending report.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 md:bottom-6 right-4 md:right-6 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-4 py-2.5 rounded-full shadow-[0_10px_20px_-10px_rgba(0,0,0,0.5)] z-[90] text-sm font-semibold flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
      >
        <MessageSquareWarning className="w-4 h-4" />
        <span className="hidden sm:inline">Report Issue</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-2xl w-full max-w-md shadow-2xl relative animate-scale-in">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-bold text-lg mb-4 text-white">Report an Issue</h2>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-32 bg-white/5 border border-white/10 focus:border-purple-500/50 p-3 rounded-xl mb-4 text-white text-sm focus:outline-none resize-none transition-colors"
              placeholder="Describe the bug or issue you encountered..."
            />
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit} 
                disabled={isSubmitting || !description.trim()}
                className="bg-white text-black px-5 py-2 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
