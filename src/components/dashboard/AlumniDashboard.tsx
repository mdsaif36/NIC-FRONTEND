import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart2, CheckCircle, Clock, FileText, Check,
  Home, LogOut, MessageSquare, ShieldCheck, TrendingUp,
  UserCheck, Users, XCircle, Send, Bell, 
  ChevronRight, Activity, Award, Zap, Settings, Briefcase,
  Sparkles, Filter, Trash2, Plus, ChevronDown, X, Download,
  CalendarDays, Trophy
} from 'lucide-react';
import { MessagesTab } from './MessagesTab.js';
import { SlotManagementTab } from './SlotManagementTab.js';
import { LeaderboardTab } from './LeaderboardTab.js';
import { API_BASE_URL } from '../../config';

interface AlumniDashboardProps {
  college: string;
  company: string;
  handleAction: (id: number, action: 'referred' | 'info' | 'declined') => void;
  name: string;
  onLogout: () => void;
  referralsSentCount: number;
  requests: any[];
  activeChatId: number | null;
  setActiveChatId: (id: number | null) => void;
  chatMessages: { [key: number]: any[] };
  newMessageText: string;
  setNewMessageText: (text: string) => void;
  handleSendMessage: () => void;
  isSchedulerOpen: boolean;
  setIsSchedulerOpen: (open: boolean) => void;
  scheduledDate: string;
  setScheduledDate: (date: string) => void;
  scheduledTime: string;
  setScheduledTime: (time: string) => void;
  handleScheduleCall: () => void;
  conversations: any[];
  alumniNetwork: any[];
  currentUser?: any;
  fetchProfile?: () => Promise<void>;
}

type AlumniTab = 'overview' | 'inbox' | 'my_referrals' | 'messages' | 'analytics' | 'accounting' | 'profile' | 'admin_panel' | 'slot_management' | 'leaderboard';

export const AlumniDashboard: React.FC<AlumniDashboardProps> = ({
  college,
  company,
  handleAction,
  name,
  onLogout,
  referralsSentCount,
  requests,
  activeChatId,
  setActiveChatId,
  chatMessages,
  newMessageText,
  setNewMessageText,
  handleSendMessage,
  isSchedulerOpen,
  setIsSchedulerOpen,
  scheduledDate,
  setScheduledDate,
  scheduledTime,
  setScheduledTime,
  handleScheduleCall,
  conversations,
  alumniNetwork,
  currentUser,
  fetchProfile
}) => {
  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good morning';
    if (hr < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const [activeTab, setActiveTab] = useState<AlumniTab>(() => {
    const savedTab = localStorage.getItem('alumniActiveTab');
    return (savedTab as AlumniTab) || 'overview';
  });

  useEffect(() => {
    localStorage.setItem('alumniActiveTab', activeTab);
  }, [activeTab]);

  const [compEmailInput, setCompEmailInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [selectedStudentReq, setSelectedStudentReq] = useState<any | null>(null);
  const [linkedinUrlInput, setLinkedinUrlInput] = useState('');
  const [isVerifyingLinkedin, setIsVerifyingLinkedin] = useState(false);
  const [linkedinVerifyStep, setLinkedinVerifyStep] = useState('');
  const [selectedScreenshot, setSelectedScreenshot] = useState<File | null>(null);
  const [isUploadingScreenshot, setIsUploadingScreenshot] = useState(false);
  const [screenshotPreviewUrl, setScreenshotPreviewUrl] = useState<string | null>(null);
  const [messageNotification, setMessageNotification] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Profile Edit & Privacy State Hooks
  const [bioInput, setBioInput] = useState('');
  const [experienceInput, setExperienceInput] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [canHelpWithInput, setCanHelpWithInput] = useState<string[]>([]);
  const [phoneInput, setPhoneInput] = useState('');
  const [isPrivateInput, setIsPrivateInput] = useState(false);
  const [hideEmailInput, setHideEmailInput] = useState(false);
  const [hidePhoneInput, setHidePhoneInput] = useState(false);
  const [hideLinkedInInput, setHideLinkedInInput] = useState(false);
  const [hideCompanyEmailInput, setHideCompanyEmailInput] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [adminPendingReviews, setAdminPendingReviews] = useState<any[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  const fetchPendingReviews = async () => {
    setIsLoadingReviews(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/verify/admin-list`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAdminPendingReviews(data);
      }
    } catch (error) {
      console.error("Error fetching pending review list:", error);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'admin_panel') {
      fetchPendingReviews();
    }
  }, [activeTab]);

  const handleAdminApprove = async (userId: number) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/verify/admin-approve/${userId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setMessageNotification({ text: 'User successfully verified as Gold Alumni!', type: 'success' });
        fetchPendingReviews();
        if (fetchProfile) await fetchProfile();
      } else {
        const err = await res.json();
        setMessageNotification({ text: err.message || 'Approval failed.', type: 'error' });
      }
    } catch (error) {
      console.error(error);
      setMessageNotification({ text: 'Network error approving user.', type: 'error' });
    }
  };

  const handleAdminReject = async (userId: number) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/verify/admin-reject/${userId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setMessageNotification({ text: 'User verification request rejected & reset.', type: 'info' });
        fetchPendingReviews();
        if (fetchProfile) await fetchProfile();
      } else {
        const err = await res.json();
        setMessageNotification({ text: err.message || 'Rejection failed.', type: 'error' });
      }
    } catch (error) {
      console.error(error);
      setMessageNotification({ text: 'Network error rejecting user.', type: 'error' });
    }
  };

  useEffect(() => {
    if (currentUser) {
      if (currentUser.companyEmail) setCompEmailInput(currentUser.companyEmail);
      if (currentUser.linkedinUrl) setLinkedinUrlInput(currentUser.linkedinUrl);
      setBioInput(currentUser.bio || '');
      setExperienceInput(currentUser.experience || '3 Years');
      setSkillsInput(currentUser.skills ? currentUser.skills.join(', ') : '');
      setCanHelpWithInput(currentUser.canHelpWith || ['Referrals', 'Resume Review', 'Mock Interviews', 'Career Guidance']);
      setPhoneInput(currentUser.phone || '');
      setIsPrivateInput(currentUser.isPrivateProfile || false);
      setHideEmailInput(currentUser.hideEmail || false);
      setHidePhoneInput(currentUser.hidePhone || false);
      setHideLinkedInInput(currentUser.hideLinkedIn || false);
      setHideCompanyEmailInput(currentUser.hideCompanyEmail || false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (messageNotification) {
      const timer = setTimeout(() => setMessageNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [messageNotification]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    const token = localStorage.getItem('token');
    
    // Parse skills from comma-separated string
    const skillsArray = skillsInput
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    try {
      const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bio: bioInput,
          experience: experienceInput,
          skills: skillsArray,
          canHelpWith: canHelpWithInput,
          phone: phoneInput,
          isPrivateProfile: isPrivateInput,
          hideEmail: hideEmailInput,
          hidePhone: hidePhoneInput,
          hideLinkedIn: hideLinkedInInput,
          hideCompanyEmail: hideCompanyEmailInput
        })
      });

      if (res.ok) {
        setMessageNotification({ text: 'Profile and privacy settings saved successfully!', type: 'success' });
        if (fetchProfile) await fetchProfile();
      } else {
        const err = await res.json();
        setMessageNotification({ text: err.message || 'Failed to update profile.', type: 'error' });
      }
    } catch (error) {
      console.error("Error updating profile settings:", error);
      setMessageNotification({ text: 'Network error saving profile.', type: 'error' });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!compEmailInput) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/verify/email-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ companyEmail: compEmailInput })
      });
      if (res.ok) {
        const data = await res.json();
        setOtpSent(true);
        setMessageNotification({
          text: `Simulated OTP Sent! Check your console or use OTP: ${data.otp}`,
          type: 'success'
        });
      } else {
        const err = await res.json();
        setMessageNotification({ text: err.message || 'Failed to send OTP.', type: 'error' });
      }
    } catch (error) {
      console.error(error);
      setMessageNotification({ text: 'Network error requesting OTP.', type: 'error' });
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpInput) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/verify/email-confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ otp: otpInput })
      });
      if (res.ok) {
        setMessageNotification({ text: 'Company email verified successfully! (Bronze Level)', type: 'success' });
        setOtpSent(false);
        setOtpInput('');
        if (fetchProfile) await fetchProfile();
      } else {
        const err = await res.json();
        setMessageNotification({ text: err.message || 'Invalid OTP.', type: 'error' });
      }
    } catch (error) {
      console.error(error);
      setMessageNotification({ text: 'Error verifying OTP.', type: 'error' });
    }
  };

  const handleVerifyLinkedin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkedinUrlInput) return;
    setIsVerifyingLinkedin(true);
    setLinkedinVerifyStep('Connecting to LinkedIn API...');
    
    setTimeout(() => {
      setLinkedinVerifyStep('Fetching profile: Name, Job Title & Company...');
      setTimeout(() => {
        setLinkedinVerifyStep('Verifying work history consistency...');
        setTimeout(async () => {
          const token = localStorage.getItem('token');
          try {
            const res = await fetch(`${API_BASE_URL}/api/users/verify/linkedin`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ linkedinUrl: linkedinUrlInput })
            });
            if (res.ok) {
              setMessageNotification({ text: 'LinkedIn credentials matched & verified! (Silver Level)', type: 'success' });
              if (fetchProfile) await fetchProfile();
            } else {
              const err = await res.json();
              setMessageNotification({ text: err.message || 'LinkedIn verification failed.', type: 'error' });
            }
          } catch (error) {
            console.error(error);
            setMessageNotification({ text: 'Network error verifying LinkedIn.', type: 'error' });
          } finally {
            setIsVerifyingLinkedin(false);
            setLinkedinVerifyStep('');
          }
        }, 1000);
      }, 1000);
    }, 1000);
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedScreenshot(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadScreenshot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedScreenshot) return;
    setIsUploadingScreenshot(true);
    const token = localStorage.getItem('token');
    
    const formData = new FormData();
    formData.append('screenshot', selectedScreenshot);

    try {
      const res = await fetch(`${API_BASE_URL}/api/users/verify/manual-upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      if (res.ok) {
        setMessageNotification({ text: 'Employee screenshot uploaded! Pending admin approval. (Awaiting Gold)', type: 'success' });
        setSelectedScreenshot(null);
        setScreenshotPreviewUrl(null);
        if (fetchProfile) await fetchProfile();
      } else {
        const err = await res.json();
        setMessageNotification({ text: err.message || 'Failed to upload screenshot.', type: 'error' });
      }
    } catch (error) {
      console.error(error);
      setMessageNotification({ text: 'Error uploading screenshot file.', type: 'error' });
    } finally {
      setIsUploadingScreenshot(false);
    }
  };

  // Helper functions for candidate college tier mapping
  const getCandidateCollege = (req: any) => {
    if (req.college) return req.college;
    if (req.class) {
      const parts = req.class.split(',');
      if (parts.length > 1) return parts[parts.length - 1].trim();
      return req.class;
    }
    return "Unknown College";
  };

  const getCollegeTier = (collegeName: string): 'Top-tier' | 'State' | 'Private' => {
    const c = collegeName.toLowerCase();
    if (c.includes('iit') || c.includes('nit') || c.includes('bits') || c.includes('pilani') || c.includes('dtu') || c.includes('delhi technological') || c.includes('iiit') || c.includes('nsut') || c.includes('rvce')) {
      return 'Top-tier';
    }
    if (c.includes('university') || c.includes('state') || c.includes('government') || c.includes('coep') || c.includes('vjti')) {
      return 'State';
    }
    return 'Private';
  };

  // Local state for requests, initialized with requests props or empty array
  const [localRequests, setLocalRequests] = useState<any[]>(() => {
    return requests || [];
  });

  // Keep localRequests synchronized with requests props
  useEffect(() => {
    if (requests) {
      setLocalRequests(requests);
    }
  }, [requests]);

  // Local tab filters
  const [inboxFilter, setInboxFilter] = useState<'All' | 'Pending' | 'Referred' | 'Info' | 'Declined'>('Pending');
  const [previewingResume, setPreviewingResume] = useState<{ seekerId: number; resumeName: string; studentName: string } | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isLoadingFile, setIsLoadingFile] = useState(false);

  const handleViewResume = async (seekerId: number, resumeName: string, studentName: string) => {
    setIsLoadingFile(true);
    setPreviewingResume({ seekerId, resumeName, studentName });
    
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
      setFileUrl(null);
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/users/resume/download/${seekerId}/${encodeURIComponent(resumeName)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const blob = await res.blob();
        const objectUrl = URL.createObjectURL(blob);
        setFileUrl(objectUrl);
      } else {
        console.error("Failed to load resume file from backend.");
      }
    } catch (err) {
      console.error("Error fetching resume:", err);
    } finally {
      setIsLoadingFile(false);
    }
  };

  const handleClosePreview = () => {
    setPreviewingResume(null);
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
      setFileUrl(null);
    }
  };
  const [collegeTierFilter, setCollegeTierFilter] = useState<'All' | 'Top-tier' | 'State' | 'Private'>('All');
  const [declineReasonOpenId, setDeclineReasonOpenId] = useState<number | null>(null);

  // Referral posts state
  const [myReferralsSubTab, setMyReferralsSubTab] = useState<'candidates' | 'posts'>('candidates');
  const [alumniPosts, setAlumniPosts] = useState<any[]>([]);
  const [isPostingReferral, setIsPostingReferral] = useState(false);
  const [selectedJdFile, setSelectedJdFile] = useState<File | null>(null);
  const [createdPostSuccess, setCreatedPostSuccess] = useState<any | null>(null);
  const [newPostData, setNewPostData] = useState({
    company: '',
    role: '',
    location: 'Remote',
    jobType: 'Full-time',
    domain: 'Engineering',
    skills: '',
    description: '',
    deadline: '',
    slots: 1
  });

  useEffect(() => {
    if (currentUser?.company) {
      setNewPostData(prev => ({ ...prev, company: currentUser.company }));
    }
  }, [currentUser]);

  const fetchAlumniPosts = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/referral-posts/my`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setAlumniPosts(data);
      }
    } catch (err) {
      console.error("Error fetching alumni posts:", err);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'my_referrals') {
      fetchAlumniPosts();
    }
  }, [activeTab, fetchAlumniPosts]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostData.company || !newPostData.role) {
      alert("Company and role are required.");
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('company', newPostData.company);
      formData.append('role', newPostData.role);
      formData.append('location', newPostData.location);
      formData.append('jobType', newPostData.jobType);
      formData.append('domain', newPostData.domain);
      formData.append('skills', newPostData.skills);
      formData.append('description', newPostData.description);
      formData.append('deadline', newPostData.deadline);
      formData.append('slots', String(newPostData.slots));
      
      if (selectedJdFile) {
        formData.append('pdf', selectedJdFile);
      }
        
      const res = await fetch(`${API_BASE_URL}/api/referral-posts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (res.ok) {
        const post = await res.json();
        setCreatedPostSuccess(post);
        setIsPostingReferral(false);
        setSelectedJdFile(null);
        setNewPostData({
          company: currentUser?.company || '',
          role: '',
          location: 'Remote',
          jobType: 'Full-time',
          domain: 'Engineering',
          skills: '',
          description: '',
          deadline: '',
          slots: 1
        });
        fetchAlumniPosts();
        if (fetchProfile) fetchProfile();
      } else {
        const errData = await res.json();
        alert(errData.message || "Failed to create referral post.");
      }
    } catch (error) {
      console.error("Failed to post referral:", error);
      alert("Error posting referral.");
    }
  };

  const handleClosePost = async (postId: number) => {
    if (!confirm("Are you sure you want to close this referral post? Seekers will no longer see it.")) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/referral-posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: false })
      });
      if (res.ok) {
        alert("Referral post closed successfully.");
        fetchAlumniPosts();
      } else {
        alert("Failed to close referral post.");
      }
    } catch (error) {
      console.error("Error closing post:", error);
      alert("Error closing post.");
    }
  };

  const handleDeletePost = async (postId: number) => {
    if (!confirm("Are you sure you want to permanently delete this referral post? This action cannot be undone.")) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/referral-posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        alert("Referral post permanently deleted.");
        fetchAlumniPosts();
      } else {
        alert("Failed to delete referral post.");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Error deleting post.");
    }
  };

  // Accounting tab settings
  const [monthlyLimit, setMonthlyLimit] = useState<number>(10);
  const [visibilityFilter, setVisibilityFilter] = useState<string>('all'); // 'all', 'tier', 'own'
  const [savedTemplates, setSavedTemplates] = useState<string[]>([
    "Hi [Candidate Name], I reviewed your profile and projects. I would be happy to refer you for the role! Let's schedule a call to sync.",
    "Hi [Candidate Name], thanks for reaching out. Your projects are impressive, but I recommend adding more detail to your experience section before I submit the referral.",
    "Hi [Candidate Name], could you please share your GitHub repositories and any live demo links? I want to see your actual implementation before moving forward."
  ]);
  const [newTemplateText, setNewTemplateText] = useState('');
  const [isAddingTemplate, setIsAddingTemplate] = useState(false);

  // Wrap handler
  const onHandleAction = (id: number, action: 'referred' | 'info' | 'declined') => {
    handleAction(id, action);
    setLocalRequests(prev => prev.map(r => r.id === id ? { ...r, status: action } : r));
  };

  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const pendingCount = localRequests.filter(r => r.status === 'pending').length;
  const referredCount = localRequests.filter(r => r.status === 'referred').length;

  const sidebarItems: { id: AlumniTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'overview',        label: 'Overview',        icon: Home },
    { id: 'inbox',           label: 'Inbox',           icon: Users,        badge: pendingCount },
    { id: 'my_referrals',    label: 'My Referrals',    icon: Briefcase },
    { id: 'slot_management', label: 'Slot Management', icon: CalendarDays },
    { id: 'leaderboard',     label: 'Leaderboard',     icon: Trophy },
    { id: 'messages',        label: 'Messages',        icon: MessageSquare },
    { id: 'analytics',       label: 'Analytics',       icon: BarChart2 },
    { id: 'accounting',      label: 'Accounting',      icon: Settings },
    { id: 'admin_panel',     label: 'Admin Panel',     icon: ShieldCheck },
  ];

  return (
    <section className="min-h-screen w-full bg-[#07070a] text-slate-100 flex relative overflow-hidden font-inter select-none">

      {/* ── Sidebar ── */}
      <aside className="hidden md:flex w-[240px] bg-[#08080d]/95 border-r border-white/[0.055] flex-col shrink-0 relative z-30 backdrop-blur-xl">
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-emerald-950/10 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-emerald-950/5 to-transparent pointer-events-none" />
        
        {/* Brand Header */}
        <div className="px-5 pt-6 pb-5 border-b border-white/[0.055] shrink-0 relative z-10">
          <div className="flex flex-col select-none">
            <span className="font-space-grotesk font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF1E3C] to-[#1E40FF] text-base tracking-tight leading-none block">
              NextInCampus
            </span>
            <span className="text-[9px] font-bold text-emerald-400/80 uppercase tracking-widest mt-2 block">
              Alumni Portal
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-3 py-5 relative z-10">
          <span className="block text-[8px] font-bold text-slate-700 uppercase tracking-widest px-3 mb-2.5">Navigation</span>
          <nav className="space-y-0.5">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600/10 to-teal-500/10 border border-white/[0.055] text-white shadow-[0_0_12px_rgba(16,185,129,0.05)]'
                      : 'text-slate-500 hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[8px] font-bold flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom profile + logout */}
        <div className="px-3 pb-5 border-t border-white/[0.055] pt-4 relative z-10 space-y-0.5">
          <span className="block text-[8px] font-bold text-slate-700 uppercase tracking-widest px-3 mb-2.5">Account</span>
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group relative ${
              activeTab === 'profile' ? 'bg-emerald-500/10 text-white' : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.03]'
            }`}
          >
            {activeTab === 'profile' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-r-full" />}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-[10px] font-black uppercase shadow-md">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <span className="block text-xs font-bold text-white truncate leading-tight">{name}</span>
              <span className="block text-[9px] text-emerald-400/70 font-medium">Alumni Mentor</span>
            </div>
          </button>
          
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-slate-600 hover:text-rose-400 hover:bg-rose-500/5 transition-all duration-200 group"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:bg-rose-500/10 transition-all">
              <LogOut className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── Mobile Bottom Bar ── */}
      <aside className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#07070a]/95 border-t border-white/5 flex items-center justify-around z-40 px-3 backdrop-blur-md">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                isActive ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'text-slate-500'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[7px] font-bold flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 h-screen overflow-y-auto no-scrollbar pb-24 md:pb-8 flex flex-col relative z-20 w-full">

        {/* Top header bar */}
        <header className="border-b border-white/5 bg-black/40 backdrop-blur-sm shrink-0 w-full">
          <div className="px-6 md:px-8 py-5 flex items-center justify-between w-full max-w-[1440px] xl:max-w-[1600px] 3xl:max-w-[2000px] 4xl:max-w-[2400px] mx-auto">
            <div>
              <h2 className="font-sora text-white text-base font-extrabold flex items-center gap-2">
                {activeTab === 'overview'        && 'Alumni Overview'}
                {activeTab === 'inbox'           && 'Candidate Inbox'}
                {activeTab === 'my_referrals'    && 'My Referrals'}
                {activeTab === 'slot_management' && 'Slot Management'}
                {activeTab === 'leaderboard'     && '🏆 Hall of Fame'}
                {activeTab === 'messages'        && 'Messages'}
                {activeTab === 'analytics'       && 'Impact Analytics'}
                {activeTab === 'accounting'      && 'Accounting'}
                {activeTab === 'profile'         && 'My Profile'}
                {activeTab === 'admin_panel'     && 'Admin Review Console'}
              </h2>
              <p className="text-[10px] text-slate-500 mt-0.5 font-medium">{company} · Verified Alumni Mentor</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <button type="button" className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white transition">
                  <Bell className="w-4 h-4" />
                </button>
                {pendingCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[8px] font-bold flex items-center justify-center">
                    {pendingCount}
                  </span>
                )}
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-3 h-3" />
                Verified Alumni
              </span>
            </div>
          </div>
        </header>

        {/* Tab content */}
        <div className="flex-1 p-6 md:p-8 w-full max-w-[1440px] xl:max-w-[1600px] 3xl:max-w-[2000px] 4xl:max-w-[2400px] mx-auto">

          {/* ══════════════════════════════
              OVERVIEW TAB
          ══════════════════════════════ */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fade-in-up text-left">

              {/* Welcome banner */}
              <div className="relative rounded-2xl overflow-hidden border border-white/5 bg-gradient-to-br from-emerald-950/30 via-[#07070a] to-blue-950/20 p-6 md:p-8">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white text-sm font-black shadow-lg">
                        {initials}
                      </div>
                      <div>
                        <h1 className="font-sora text-xl font-extrabold text-white">{getGreeting()}, {name.split(' ')[0]} 👋</h1>
                        <p className="text-[11px] text-slate-400 font-medium">{college} · {company}</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-md">
                      You have <span className="text-emerald-400 font-bold">{pendingCount} pending request{pendingCount !== 1 ? 's' : ''}</span> from talented juniors. Your referrals have helped {referredCount} candidates land interviews.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('inbox')}
                    className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-sora font-bold text-xs uppercase tracking-wider shadow-lg hover:opacity-90 transition"
                  >
                    Review Requests
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Metrics row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Referrals', value: referralsSentCount, sub: 'Active this month', icon: Send, color: 'emerald', glow: 'rgba(16,185,129,0.15)' },
                  { label: 'Interviews Secured', value: 0, sub: '0% conversion', icon: TrendingUp, color: 'blue', glow: 'rgba(59,130,246,0.15)' },
                  { label: 'Pending Queue', value: pendingCount, sub: 'Needs your review', icon: Clock, color: 'amber', glow: 'rgba(245,158,11,0.15)' },
                  { label: 'Success Rate', value: '0%', sub: 'Platform avg: 40%', icon: Award, color: 'purple', glow: 'rgba(168,85,247,0.15)' },
                ].map((metric) => {
                  const Icon = metric.icon;
                  const colorMap: Record<string, { text: string; bg: string; border: string }> = {
                    emerald: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
                    blue:    { text: 'text-blue-400',    bg: 'bg-blue-500/10',    border: 'border-blue-500/20' },
                    amber:   { text: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/20' },
                    purple:  { text: 'text-purple-400',  bg: 'bg-purple-500/10',  border: 'border-purple-500/20' },
                  };
                  const c = colorMap[metric.color];
                  return (
                    <div key={metric.label} className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md text-left group hover:border-white/10 transition-all duration-300 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl pointer-events-none" style={{ background: metric.glow }} />
                      <div className={`w-9 h-9 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center mb-4`}>
                        <Icon className={`w-4 h-4 ${c.text}`} />
                      </div>
                      <span className="block font-sora text-2xl font-extrabold text-white">{metric.value}</span>
                      <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-1">{metric.label}</span>
                      <span className={`block text-[10px] font-semibold mt-0.5 ${c.text}`}>{metric.sub}</span>
                    </div>
                  );
                })}
              </div>

              {/* Recent requests preview */}
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Queue preview */}
                <div className="lg:col-span-2 p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-sora text-sm font-extrabold text-white">Pending Requests</h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('inbox')}
                      className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold uppercase tracking-wider flex items-center gap-1 transition"
                    >
                      View All <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {localRequests.filter(r => r.status === 'pending').slice(0, 2).map((req) => (
                      <div key={req.id} className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-black/30 hover:border-white/10 transition group">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-white/10 flex items-center justify-center text-[10px] font-bold text-slate-300 shrink-0">
                          {req.studentName[0]}{req.studentName.split(' ')[1]?.[0] ?? ''}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const fullReq = localRequests.find(r => r.id === req.id);
                                if (fullReq) setSelectedStudentReq(fullReq);
                              }}
                              className="text-xs font-bold text-white hover:text-purple-400 hover:underline truncate text-left"
                            >
                              {req.studentName}
                            </button>
                            <span className="shrink-0 px-1.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[8px] font-bold">{req.score}</span>
                          </div>
                          <span className="text-[10px] text-slate-500">{req.class} · {req.role} at {req.company}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => onHandleAction(req.id, 'referred')}
                          className="shrink-0 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold uppercase tracking-wider hover:bg-emerald-500/20 transition opacity-0 group-hover:opacity-100"
                        >
                          Refer
                        </button>
                      </div>
                    ))}
                    {localRequests.filter(r => r.status === 'pending').length === 0 && (
                      <div className="text-center py-8">
                        <CheckCircle className="w-8 h-8 text-emerald-500/40 mx-auto mb-2" />
                        <p className="text-xs text-slate-500">All caught up! No pending requests.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Impact panel */}
                <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md">
                  <h3 className="font-sora text-sm font-extrabold text-white mb-5">Your Impact</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Referrals sent', value: referralsSentCount, max: 50, color: 'bg-emerald-500' },
                      { label: 'Interviews secured', value: 0, max: 30, color: 'bg-blue-500' },
                      { label: 'Offers received', value: 0, max: 15, color: 'bg-purple-500' },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] text-slate-400 font-semibold">{item.label}</span>
                          <span className="text-[10px] text-white font-bold">{item.value}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${item.color} rounded-full transition-all duration-700`}
                            style={{ width: `${Math.min((item.value / item.max) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-5 border-t border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-[10px] font-bold text-white uppercase tracking-wider">Mentor Level</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {['★','★','★','★','☆'].map((s, i) => (
                        <span key={i} className={`text-sm ${i < 4 ? 'text-amber-400' : 'text-slate-700'}`}>{s}</span>
                      ))}
                      <span className="text-[10px] text-slate-400 font-medium ml-1">Gold Mentor</span>
                    </div>
                    <p className="text-[9px] text-slate-500 mt-1.5">4 more referrals to reach Platinum</p>
                  </div>
                </div>
              </div>

              {/* Recent activity feed */}
              <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md">
                <h3 className="font-sora text-sm font-extrabold text-white mb-5">Recent Activity</h3>
                <div className="space-y-4">
                  {((pendingCount === 0 && referralsSentCount === 0) ? [
                    { icon: ShieldCheck, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20', text: 'Welcome to your Alumni Dashboard! Wait for students to send requests.', time: 'Just now' }
                  ] : [
                    { icon: Activity, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', text: `You currently have ${pendingCount} pending requests to review.`, time: 'Recently' }
                  ]).map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className="flex items-start gap-4">
                        <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${item.color}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-300 leading-relaxed">{item.text}</p>
                          <span className="text-[9px] text-slate-600 font-medium">{item.time}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════
              CANDIDATE INBOX (TABS)
          ══════════════════════════════ */}
          {activeTab === 'inbox' && (
            <div className="space-y-6 animate-fade-in-up text-left">
              {/* Filter controls row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-white/5 bg-white/[0.01] backdrop-blur-md">
                {/* Status Filters */}
                <div className="flex items-center gap-2 flex-wrap">
                  {['All', 'Pending', 'Referred', 'Info', 'Declined'].map((filter) => {
                    const count = filter === 'Pending' 
                      ? localRequests.filter(r => r.status === 'pending').length 
                      : filter === 'Referred' 
                      ? localRequests.filter(r => r.status === 'referred').length
                      : 0;
                    return (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => setInboxFilter(filter as any)}
                        className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all duration-300 ${
                          inboxFilter === filter
                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.12)]'
                            : 'border-white/5 text-slate-400 hover:text-white hover:border-white/10 hover:bg-white/5'
                        }`}
                      >
                        {filter}
                        {count > 0 && (
                          <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[7px]">{count}</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* College Tier Filters */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Filter className="w-3 h-3" /> Tier:
                  </span>
                  {['All', 'Top-tier', 'State', 'Private'].map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setCollegeTierFilter(tier as any)}
                      className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all duration-300 border ${
                        collegeTierFilter === tier
                          ? 'bg-blue-500/15 border-blue-500/30 text-blue-400'
                          : 'border-transparent text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>

              {/* Request cards */}
              <div className="space-y-5">
                {localRequests
                  .filter((req) => {
                    // Filter by status
                    if (inboxFilter !== 'All') {
                      const matchStatus = inboxFilter.toLowerCase() === req.status.toLowerCase();
                      if (!matchStatus) return false;
                    }
                    // Filter by college tier
                    if (collegeTierFilter !== 'All') {
                      const collName = getCandidateCollege(req);
                      const tier = getCollegeTier(collName);
                      if (tier !== collegeTierFilter) return false;
                    }
                    return true;
                  })
                  .map((req) => {
                    const scoreVal = parseInt(req.score) || 85;
                    const cCollege = getCandidateCollege(req);
                    const isOwnCollege = cCollege.toLowerCase().includes(college.toLowerCase());
                    const showAiWarning = !isOwnCollege && scoreVal >= 85;

                    return (
                      <div
                        key={req.id}
                        className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md hover:border-white/10 transition-all duration-300 relative overflow-hidden"
                      >
                        {/* Status bar */}
                        {req.status !== 'pending' && (
                          <div className={`absolute top-0 left-0 right-0 h-[3px] ${
                            req.status === 'referred' ? 'bg-gradient-to-r from-emerald-500 to-teal-400' :
                            req.status === 'info'     ? 'bg-gradient-to-r from-amber-500 to-yellow-400' :
                            'bg-gradient-to-r from-rose-500 to-red-400'
                          }`} />
                        )}

                        <div className="flex flex-col md:flex-row md:items-start gap-6">
                          {/* Candidate info */}
                          <div className="flex-1 space-y-4">
                            <div className="flex items-start justify-between gap-4 flex-wrap">
                              <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center font-bold text-xs uppercase text-slate-300 shadow-md">
                                  {req.studentName[0]}{req.studentName.split(' ')[1]?.[0] ?? ''}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <button
                                      type="button"
                                      onClick={() => setSelectedStudentReq(req)}
                                      className="font-bold text-white text-sm hover:text-purple-400 hover:underline transition-all text-left"
                                    >
                                      {req.studentName}
                                    </button>
                                    <span className="text-slate-400 font-normal">({cCollege})</span>
                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold border border-emerald-500/20 text-emerald-400 bg-emerald-500/5">
                                      {req.score.includes('%') ? req.score : `${req.score}%`} Match
                                    </span>
                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                                      getCollegeTier(cCollege) === 'Top-tier' ? 'border-blue-500/20 text-blue-400 bg-blue-500/5' :
                                      getCollegeTier(cCollege) === 'State' ? 'border-amber-500/20 text-amber-400 bg-amber-500/5' :
                                      'border-slate-500/20 text-slate-400 bg-slate-500/5'
                                    }`}>
                                      {getCollegeTier(cCollege)}
                                    </span>
                                  </div>
                                  <span className="block text-[10px] text-slate-500 mt-0.5">{req.class}</span>
                                </div>
                              </div>

                              {/* AI warning badge */}
                              {showAiWarning && (
                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/25 text-purple-300 text-[10px] font-bold">
                                  <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                                  <span>Quality Match: High matching score ({scoreVal}%)</span>
                                </div>
                              )}
                            </div>

                            <div className="grid sm:grid-cols-2 gap-3">
                              <div className="p-3 rounded-xl bg-black/30 border border-white/5">
                                <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-wide mb-1">Target Role</span>
                                <span className="text-xs text-slate-200 font-semibold">{req.role} at {req.company}</span>
                              </div>
                              <div className="p-3 rounded-xl bg-black/30 border border-white/5">
                                <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-wide mb-1">Resume</span>
                                {req.resumeUploaded && req.resumeName ? (
                                  <button 
                                    type="button" 
                                    onClick={() => handleViewResume(req.seekerId, req.resumeName, req.studentName)} 
                                    className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-purple-400 hover:text-purple-355 transition"
                                  >
                                    <FileText className="w-3.5 h-3.5 text-rose-500" />
                                    {req.resumeName}
                                  </button>
                                ) : (
                                  <span className="text-[10px] text-slate-500 italic">No resume uploaded</span>
                                )}
                              </div>
                            </div>

                            <div>
                              <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-wide mb-2">Outreach Note</span>
                              <p className="p-4 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-300 leading-relaxed font-inter italic">
                                "{req.message}"
                              </p>
                            </div>
                          </div>

                          {/* Action panel */}
                          <div className="flex flex-col gap-2.5 shrink-0 md:w-44 relative">
                            {req.status === 'pending' ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => onHandleAction(req.id, 'referred')}
                                  className="w-full py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 text-white font-sora font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition shadow-md"
                                >
                                  <UserCheck className="w-3.5 h-3.5" />
                                  Refer
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onHandleAction(req.id, 'info')}
                                  className="w-full py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition"
                                >
                                  <Clock className="w-3.5 h-3.5" />
                                  Need Info
                                </button>
                                <div className="relative w-full">
                                  <button
                                    type="button"
                                    onClick={() => setDeclineReasonOpenId(declineReasonOpenId === req.id ? null : req.id)}
                                    className="w-full py-2.5 rounded-full hover:bg-rose-500/10 text-rose-400 border border-rose-500/10 hover:border-rose-500/20 font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition"
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                    Decline
                                    <ChevronDown className="w-3 h-3 ml-0.5" />
                                  </button>

                                  {/* Quick Decline Reason Dropdown */}
                                  {declineReasonOpenId === req.id && (
                                    <div className="absolute right-0 bottom-full mb-2 w-56 rounded-xl bg-slate-950 border border-white/10 p-2 shadow-2xl backdrop-blur-md z-50 animate-fade-in-up">
                                      <div className="px-2 py-1 text-[9px] font-bold text-slate-500 uppercase tracking-wider border-b border-white/5 mb-1">Reason for decline</div>
                                      {[
                                        "Pitch is too generic",
                                        "Resume needs work",
                                        "Not the right fit",
                                        "No open positions"
                                      ].map((reason) => (
                                        <button
                                          key={reason}
                                          type="button"
                                          onClick={() => {
                                            onHandleAction(req.id, 'declined');
                                            setDeclineReasonOpenId(null);
                                          }}
                                          className="w-full text-left px-2 py-1.5 rounded-lg text-[10.5px] text-slate-300 hover:text-white hover:bg-white/5 transition"
                                        >
                                          {reason}
                                        </button>
                                      ))}
                                      <button
                                        type="button"
                                        onClick={() => setDeclineReasonOpenId(null)}
                                        className="w-full text-center mt-1 border-t border-white/5 pt-1.5 text-[9px] font-bold text-slate-500 hover:text-slate-300 transition"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </>
                            ) : (
                              <div className={`p-4 rounded-xl border text-center flex flex-col items-center justify-center gap-2 w-full ${
                                req.status === 'referred' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' :
                                req.status === 'info'     ? 'bg-amber-500/5 border-amber-500/20 text-amber-400' :
                                'bg-rose-500/5 border-rose-500/20 text-rose-400'
                              }`}>
                                {req.status === 'referred' && (
                                  <>
                                    <CheckCircle className="w-6 h-6 animate-logo-pulse" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Referred!</span>
                                    <span className="text-[8px] text-slate-400">ID: #REF-{1000 + req.id}</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActiveTab('messages');
                                        setActiveChatId(req.seekerId);
                                      }}
                                      className="mt-2 w-full py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-[10px] font-bold uppercase tracking-wider transition flex items-center justify-center gap-1.5"
                                    >
                                      <MessageSquare className="w-3.5 h-3.5" />
                                      Message
                                    </button>
                                  </>
                                )}
                                {req.status === 'info' && (
                                  <>
                                    <Clock className="w-6 h-6" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Info Requested</span>
                                    <span className="text-[8px] text-slate-400">Candidate notified</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActiveTab('messages');
                                        setActiveChatId(req.seekerId);
                                      }}
                                      className="mt-2 w-full py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 text-[10px] font-bold uppercase tracking-wider transition flex items-center justify-center gap-1.5"
                                    >
                                      <MessageSquare className="w-3.5 h-3.5" />
                                      Message
                                    </button>
                                  </>
                                )}
                                {req.status === 'declined' && (
                                  <>
                                    <XCircle className="w-6 h-6" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Declined</span>
                                    <span className="text-[8px] text-slate-400">Feedback sent</span>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                {localRequests.filter((req) => {
                  if (inboxFilter !== 'All' && inboxFilter.toLowerCase() !== req.status.toLowerCase()) return false;
                  if (collegeTierFilter !== 'All') {
                    const collName = getCandidateCollege(req);
                    const tier = getCollegeTier(collName);
                    if (tier !== collegeTierFilter) return false;
                  }
                  return true;
                }).length === 0 && (
                  <div className="text-center py-16 rounded-2xl border border-dashed border-white/5 bg-white/[0.01]">
                    <Clock className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                    <h4 className="font-sora text-sm font-bold text-slate-400">No requests found</h4>
                    <p className="text-xs text-slate-500 mt-1">Try switching filters or check back later.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══════════════════════════════
              MY REFERRALS TAB
          ══════════════════════════════ */}
          {activeTab === 'my_referrals' && (
            <div className="space-y-6 animate-fade-in-up text-left">
              {/* Sub-navigation bar */}
              <div className="flex gap-2 p-1 rounded-xl bg-white/[0.02] border border-white/5 max-w-md">
                <button
                  type="button"
                  onClick={() => setMyReferralsSubTab('candidates')}
                  className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${
                    myReferralsSubTab === 'candidates'
                      ? 'bg-white/[0.05] border border-white/10 text-white'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Referred Candidates
                </button>
                <button
                  type="button"
                  onClick={() => setMyReferralsSubTab('posts')}
                  className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${
                    myReferralsSubTab === 'posts'
                      ? 'bg-white/[0.05] border border-white/10 text-white'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Referral Posts ({alumniPosts.length})
                </button>
              </div>

              {myReferralsSubTab === 'candidates' ? (
                <>
                  {/* Header metrics */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: 'Referred Pipeline', value: localRequests.filter(r => r.status === 'referred').length, sub: 'Active candidates', color: 'blue' },
                      { label: 'Interview Stage', value: 0, sub: 'Recruiter screen passed', color: 'emerald' },
                      { label: 'Offers Secured', value: 0, sub: 'Success stories', color: 'purple' },
                      { label: 'Avg Interview Conversion', value: '0%', sub: 'Platform average', color: 'amber' },
                    ].map((stat, i) => (
                      <div key={i} className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
                        <span className="block font-sora text-2xl font-black text-white">{stat.value}</span>
                        <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-1">{stat.label}</span>
                        <span className="block text-[10px] text-slate-400 mt-0.5 font-medium">{stat.sub}</span>
                      </div>
                    ))}
                  </div>

                  {/* Candidate Pipeline list */}
                  <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="font-sora text-sm font-extrabold text-white">Referred Candidates Tracking</h3>
                        <p className="text-[10px] text-slate-500 mt-0.5">Real-time application pipeline tracking for your referrals</p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                        Pipeline Active
                      </span>
                    </div>

                    <div className="space-y-4">
                      {[
                        ...localRequests
                          .filter(r => r.status === 'referred')
                          .map((req, idx) => ({
                            id: 300 + idx,
                            seekerId: req.seekerId,
                            name: req.studentName,
                            college: getCandidateCollege(req),
                            role: req.role,
                            stage: "Referred",
                            date: "Referred just now",
                            progress: 25,
                            details: "Candidate referred. Resume sent to recruiter pipeline."
                          }))
                      ].map((candidate) => (
                        <div key={candidate.id} className="p-4 rounded-xl border border-white/5 bg-black/40 hover:border-white/10 transition-all duration-300">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            {/* Name & role */}
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-[11px] text-white">
                                {candidate.name[0]}{candidate.name.split(' ')[1]?.[0] ?? ''}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-xs text-white">{candidate.name}</span>
                                  <span className="text-[9px] text-slate-550">· {candidate.college}</span>
                                </div>
                                <span className="block text-[10px] text-slate-400 mt-0.5">{candidate.role}</span>
                              </div>
                            </div>

                            {/* Progress visualizer */}
                            <div className="flex-1 md:max-w-xs space-y-1.5">
                              <div className="flex items-center justify-between text-[9px] font-bold">
                                <span className="text-slate-500 uppercase tracking-wide">Progress</span>
                                <span className="text-slate-300">{candidate.progress}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full bg-gradient-to-r transition-all duration-500 ${
                                    candidate.stage === 'Offered' ? 'from-purple-500 to-indigo-400' :
                                    candidate.stage === 'Interviewing' ? 'from-blue-500 to-cyan-400' :
                                    candidate.stage === 'Under Review' ? 'from-amber-500 to-yellow-400' :
                                    'from-slate-600 to-slate-400'
                                  }`} 
                                  style={{ width: `${candidate.progress}%` }} 
                                />
                              </div>
                            </div>

                            {/* Status detail */}
                            <div className="text-left md:text-right shrink-0 flex flex-col items-start md:items-end gap-1.5">
                              <div className="flex items-center gap-2">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wide border ${
                                  candidate.stage === 'Offered' ? 'bg-purple-500/10 border-purple-500/25 text-purple-400' :
                                  candidate.stage === 'Interviewing' ? 'bg-blue-500/10 border-blue-500/25 text-blue-400' :
                                  candidate.stage === 'Under Review' ? 'bg-amber-500/10 border-amber-500/25 text-amber-400' :
                                  'bg-slate-500/10 border-slate-500/25 text-slate-400'
                                }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${
                                    candidate.stage === 'Offered' ? 'bg-purple-400 animate-pulse' :
                                    candidate.stage === 'Interviewing' ? 'bg-blue-400 animate-pulse' :
                                    candidate.stage === 'Under Review' ? 'bg-amber-400 animate-pulse' :
                                    'bg-slate-400'
                                  }`} />
                                  {candidate.stage}
                                </span>
                                
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveTab('messages');
                                    setActiveChatId(candidate.seekerId);
                                  }}
                                  className="px-2.5 py-1 rounded-lg border border-white/10 bg-white/5 text-slate-355 hover:text-white hover:bg-white/10 text-[9.5px] font-bold uppercase tracking-wider transition flex items-center gap-1"
                                >
                                  <MessageSquare className="w-3 h-3" />
                                  Chat
                                </button>
                              </div>
                              <span className="block text-[9.5px] text-slate-500 font-medium">{candidate.details}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {localRequests.filter(r => r.status === 'referred').length === 0 && (
                        <div className="text-center py-10 border border-white/5 border-dashed rounded-xl">
                          <p className="text-xs text-slate-500">No candidates referred yet. Check your inbox!</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  {/* Action Bar */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-sora text-sm font-extrabold text-white">Your Referral Posts</h3>
                      <p className="text-[10px] text-slate-500 mt-0.5">Manage job openings you can refer seekers for</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsPostingReferral(true)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 transition-all font-sora font-extrabold text-xs text-white uppercase tracking-wider"
                    >
                      Post Referral
                    </button>
                  </div>

                  {/* Posts Grid */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {alumniPosts.map((post) => (
                      <div key={post.id} className="p-5 rounded-2xl border border-white/5 bg-[#08080d]/80 hover:border-white/10 transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <div>
                              <span className="inline-block px-2 py-0.5 rounded bg-white/5 text-[9px] font-bold text-slate-400 border border-white/5 mb-1.5 uppercase">
                                {post.jobType}
                              </span>
                              <h4 className="font-sora font-bold text-sm text-white">{post.role}</h4>
                              <p className="text-xs text-slate-400">{post.company} · {post.location}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider border ${
                              post.isActive
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                : 'bg-slate-500/10 border-slate-500/20 text-slate-400'
                            }`}>
                              {post.isActive ? 'Active' : 'Closed'}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-400 line-clamp-3 mb-4">{post.description || 'No description provided.'}</p>

                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {post.skills && post.skills.map((skill: string, sIdx: number) => (
                              <span key={sIdx} className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/15 text-[8.5px] font-bold text-purple-400">
                                {skill}
                              </span>
                            ))}
                          </div>
                          {post.jdFileName && (
                            <a
                              href={`${API_BASE_URL}/api/referrals/files/${post.jdFileName}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/15 text-[8.5px] font-bold text-teal-400 hover:bg-teal-500/20 transition mb-3"
                            >
                              <FileText className="w-2.5 h-2.5" />
                              View Criteria PDF
                            </a>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-white/5 text-[10px] text-slate-500">
                          <div className="flex gap-4">
                            <span>Slots: <strong className="text-white">{post.slots}</strong></span>
                            <span>Views: <strong className="text-white">{post.viewCount}</strong></span>
                            <span>Applied: <strong className="text-white">{post.applyCount}</strong></span>
                          </div>

                          <div className="flex gap-2">
                            {post.isActive && (
                              <button
                                type="button"
                                onClick={() => handleClosePost(post.id)}
                                className="px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/20 text-[9px] font-bold uppercase tracking-wider text-rose-450 hover:bg-rose-500/20 transition"
                              >
                                Close Post
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDeletePost(post.id)}
                              className="px-2.5 py-1 rounded bg-red-650/15 border border-red-650/30 text-[9px] font-bold uppercase tracking-wider text-red-400 hover:bg-red-650/25 transition flex items-center gap-1"
                            >
                              <Trash2 className="w-2.5 h-2.5" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {alumniPosts.length === 0 && (
                      <div className="col-span-2 text-center py-16 border border-white/5 border-dashed rounded-2xl">
                        <p className="text-xs text-slate-500">You haven't posted any active referrals yet.</p>
                        <button
                          type="button"
                          onClick={() => setIsPostingReferral(true)}
                          className="mt-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-white/20 text-xs font-semibold transition"
                        >
                          Create your first referral post
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════
              MESSAGES TAB
          ══════════════════════════════ */}
          {activeTab === 'messages' && (
            <MessagesTab
              activeChatId={activeChatId}
              setActiveChatId={setActiveChatId}
              chatMessages={chatMessages}
              newMessageText={newMessageText}
              setNewMessageText={setNewMessageText}
              handleSendMessage={handleSendMessage}
              isSchedulerOpen={isSchedulerOpen}
              setIsSchedulerOpen={setIsSchedulerOpen}
              scheduledDate={scheduledDate}
              setScheduledDate={setScheduledDate}
              scheduledTime={scheduledTime}
              setScheduledTime={setScheduledTime}
              handleScheduleCall={handleScheduleCall}
              conversations={conversations}
              alumniNetwork={alumniNetwork}
              role="alumni"
            />
          )}

          {/* ══════════════════════════════
              ANALYTICS TAB
          ══════════════════════════════ */}
          {activeTab === 'analytics' && (
            <div className="space-y-8 animate-fade-in-up text-left">
              {/* Top metrics */}
              <div className="grid sm:grid-cols-3 gap-6">
                {[
                  { label: 'Total Referrals', value: referralsSentCount, delta: 'Active this month', positive: true, icon: Send },
                  { label: 'Conversion Rate', value: '0%', delta: 'No data yet', positive: true, icon: TrendingUp },
                  { label: 'Avg Response Time', value: 'N/A', delta: 'No data yet', positive: true, icon: Activity },
                ].map((m) => {
                  const Icon = m.icon;
                  return (
                    <div key={m.label} className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{m.label}</span>
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-emerald-400" />
                        </div>
                      </div>
                      <span className="block font-sora text-3xl font-extrabold text-white">{m.value}</span>
                      <span className={`block text-[10px] font-semibold mt-1 ${m.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {m.delta}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Funnel chart and College Distribution */}
              <div className="grid sm:grid-cols-2 gap-6">
                {/* Funnel chart */}
                <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md">
                  <h3 className="font-sora text-sm font-extrabold text-white mb-6">Referral Funnel</h3>
                  <div className="space-y-4">
                    {[
                      { stage: 'Requests Received', value: localRequests.length, pct: localRequests.length > 0 ? 100 : 0, color: 'bg-blue-500' },
                      { stage: 'Reviewed',          value: localRequests.filter(r => r.status !== 'pending').length,  pct: localRequests.length > 0 ? 100 : 0,  color: 'bg-purple-500' },
                      { stage: 'Referred',          value: referralsSentCount,       pct: localRequests.length > 0 ? 100 : 0,  color: 'bg-emerald-500' },
                      { stage: 'Interviewed',       value: 0,                       pct: 0,  color: 'bg-amber-500' },
                      { stage: 'Offers',            value: 0,                        pct: 0,  color: 'bg-rose-500' },
                    ].map((row) => (
                      <div key={row.stage} className="flex items-center gap-4">
                        <span className="w-32 text-[10px] text-slate-400 font-medium shrink-0">{row.stage}</span>
                        <div className="flex-1 h-2 bg-slate-950 rounded-full overflow-hidden">
                          <div className={`h-full ${row.color} rounded-full transition-all duration-700`} style={{ width: `${row.pct}%` }} />
                        </div>
                        <span className="w-8 text-right text-xs font-bold text-white shrink-0">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* College distribution */}
                <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md">
                  <h3 className="font-sora text-sm font-extrabold text-white mb-6">Incoming Requests by College</h3>
                  <div className="space-y-4">
                    {[
                      { collName: "IIT Bombay", count: 18, pct: 60, color: "from-blue-500 to-cyan-500" },
                      { collName: "BITS Pilani", count: 6, pct: 20, color: "from-purple-500 to-pink-500" },
                      { collName: "Delhi Technological University", count: 4, pct: 13, color: "from-emerald-500 to-teal-500" },
                      { collName: "Other Tier-2/3 Colleges", count: 2, pct: 7, color: "from-slate-500 to-slate-400" }
                    ].map((item, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-semibold text-slate-300 truncate max-w-[150px] inline-block">{item.collName}</span>
                          <span className="font-bold text-white shrink-0">{item.count} ({item.pct}%)</span>
                        </div>
                        <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                          <div className={`h-full bg-gradient-to-r ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent activity feed (Analytics version) */}
              <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md">
                <div className="flex items-center gap-2 mb-5">
                  <Award className="w-4 h-4 text-amber-400" />
                  <h3 className="font-sora text-sm font-extrabold text-white">Recent Activity</h3>
                </div>
                <div className="space-y-4">
                  {((pendingCount === 0 && referralsSentCount === 0) ? [
                    { icon: ShieldCheck, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20', text: 'Welcome to your Alumni Dashboard! Wait for students to send requests.', time: 'Just now' }
                  ] : [
                    { icon: Activity, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', text: `You currently have ${pendingCount} pending requests to review.`, time: 'Recently' }
                  ]).map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className="flex items-start gap-4">
                        <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${item.color}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-300 leading-relaxed">{item.text}</p>
                          <span className="text-[9px] text-slate-600 font-medium">{item.time}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* ══════════════════════════════
              ACCOUNTING / CONTROLS TAB
          ══════════════════════════════ */}
          {activeTab === 'accounting' && (
            <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up text-left">
              {/* Request Volume Control */}
              <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-sora text-sm font-extrabold text-white">Monthly Request Volume</h3>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-6">
                  Set a cap on the maximum number of incoming referral requests you wish to receive per calendar month. If exceeded, your profile is hidden from active searches to protect your time.
                </p>

                <div className="grid grid-cols-4 gap-3">
                  {[5, 10, 20, 50].map((limit) => (
                    <button
                      key={limit}
                      type="button"
                      onClick={() => setMonthlyLimit(limit)}
                      className={`py-3 rounded-xl border text-center transition-all duration-300 ${
                        monthlyLimit === limit
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 font-bold shadow-[0_0_12px_rgba(16,185,129,0.12)]'
                          : 'border-white/5 bg-black/20 text-slate-400 hover:text-slate-200 hover:border-white/10'
                      }`}
                    >
                      <span className="block font-sora text-sm">{limit === 50 ? '∞' : limit}</span>
                      <span className="block text-[8px] font-bold uppercase tracking-wider mt-0.5">{limit === 50 ? 'Unlimited' : 'per month'}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-300">Remaining limit for this month</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">Calculated based on active pending queue</span>
                  </div>
                  <span className="text-sm font-sora font-black text-white">
                    {localRequests.filter(r => r.status === 'pending').length} / {monthlyLimit}
                  </span>
                </div>
              </div>

              {/* College Visibility Filter */}
              <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md">
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <h3 className="font-sora text-sm font-extrabold text-white">College Filtering Selector</h3>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-5">
                  Select which tier of college students are allowed to request referrals from you. Set this restriction based on your preferences.
                </p>

                <div className="space-y-3">
                  {[
                    { id: 'all', label: 'Open to all students', sub: 'Receive requests from any verified student on the platform' },
                    { id: 'tier', label: 'Top-tier colleges only', sub: 'Only accept requests from students at BITS, IITs, NITs, and IIITs' },
                    { id: 'own', label: `Restrict to my own college only (${college})`, sub: 'Only students from your alma mater can see your profile and request referrals' }
                  ].map((opt) => (
                    <label
                      key={opt.id}
                      onClick={() => setVisibilityFilter(opt.id)}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all duration-300 ${
                        visibilityFilter === opt.id
                          ? 'bg-blue-500/10 border-blue-500/40 text-blue-400'
                          : 'border-white/5 bg-black/20 text-slate-400 hover:bg-black/30'
                      }`}
                    >
                      <input
                        type="radio"
                        name="visibility"
                        value={opt.id}
                        checked={visibilityFilter === opt.id}
                        onChange={() => {}}
                        className="mt-0.5 text-blue-500 focus:ring-0 focus:ring-offset-0 bg-transparent shrink-0"
                      />
                      <div className="ml-2">
                        <span className="block text-xs font-bold text-white">{opt.label}</span>
                        <span className="block text-[10px] text-slate-500 mt-0.5 leading-relaxed">{opt.sub}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Saved Templates Manager */}
              <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-400" />
                    <h3 className="font-sora text-sm font-extrabold text-white">Saved Templates Manager</h3>
                  </div>
                  {!isAddingTemplate && (
                    <button
                      type="button"
                      onClick={() => setIsAddingTemplate(true)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[9px] font-bold uppercase tracking-wider hover:bg-purple-500/20 transition"
                    >
                      <Plus className="w-3 h-3" /> Add New
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-5">
                  Create and manage template responses you can use to copy/paste or send quickly to students during request review.
                </p>

                {isAddingTemplate && (
                  <div className="p-4 rounded-xl border border-purple-500/20 bg-purple-500/5 mb-4 space-y-3 animate-fade-in-up">
                    <span className="block text-[10px] font-bold text-purple-400 uppercase tracking-wider">New Template</span>
                    <textarea
                      placeholder="Write your response template here..."
                      value={newTemplateText}
                      onChange={(e) => setNewTemplateText(e.target.value)}
                      className="w-full h-20 rounded-lg bg-black/40 border border-white/10 p-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/40 resize-none font-inter"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingTemplate(false);
                          setNewTemplateText('');
                        }}
                        className="px-3 py-1.5 rounded-lg border border-white/5 text-[10px] font-bold text-slate-400 hover:text-white transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={!newTemplateText.trim()}
                        onClick={() => {
                          setSavedTemplates(prev => [...prev, newTemplateText]);
                          setIsAddingTemplate(false);
                          setNewTemplateText('');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-purple-500 text-white text-[10px] font-bold uppercase tracking-wider hover:bg-purple-600 transition disabled:opacity-50"
                      >
                        Save Template
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {savedTemplates.map((template, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-white/5 bg-black/40 group relative">
                      <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition">
                        <button
                          type="button"
                          onClick={() => setSavedTemplates(prev => prev.filter((_, i) => i !== idx))}
                          className="p-1 rounded-lg hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 transition"
                          aria-label="Delete template"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Template #{idx + 1}</span>
                      <p className="text-[11px] text-slate-300 leading-relaxed font-inter">{template}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════
              PROFILE TAB
          ══════════════════════════════ */}
          {activeTab === 'profile' && (
            <div className="max-w-2xl mx-auto space-y-6 text-left pb-12">
              
              {/* Notification Banner */}
              {messageNotification && (
                <div className={`p-4 rounded-xl border text-xs font-semibold ${
                  messageNotification.type === 'success' 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                    : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                }`}>
                  {messageNotification.text}
                </div>
              )}

              {/* Profile Card with Trust Score and Badge */}
              <div className="p-8 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="flex flex-col sm:flex-row items-start gap-6 relative z-10">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white text-2xl font-black shadow-xl shrink-0">
                    {initials}
                  </div>
                  
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="font-sora text-xl font-extrabold text-white">{name}</h2>
                      
                      {/* Verification Badge */}
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold border ${
                        (currentUser?.verificationLevel || 'Unverified') === 'Platinum' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                        (currentUser?.verificationLevel || 'Unverified') === 'Gold' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        (currentUser?.verificationLevel || 'Unverified') === 'Silver' ? 'bg-slate-300/10 text-slate-300 border-slate-300/20' :
                        (currentUser?.verificationLevel || 'Unverified') === 'Bronze' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                        'bg-white/5 text-slate-400 border-white/10'
                      }`}>
                        <ShieldCheck className="w-3 h-3" />
                        {currentUser?.verificationLevel || 'Unverified'} Level
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 font-medium mt-1">{company} · {college}</p>
                    
                    {/* Trust Score indicator */}
                    <div className="mt-5 space-y-2">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-slate-500 font-bold uppercase tracking-wider">Referral Trust Score</span>
                        <span className="text-white font-black font-space-grotesk">{currentUser?.trustScore || 0}/100</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500" 
                          style={{ width: `${currentUser?.trustScore || 0}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-5">
                      <div className="text-center">
                        <span className="block font-sora text-lg font-bold text-white">{referralsSentCount}</span>
                        <span className="block text-[9px] text-slate-550 uppercase tracking-wide">Referrals</span>
                      </div>
                      <div className="w-px h-8 bg-white/5" />
                      <div className="text-center">
                        <span className="block font-sora text-lg font-bold text-white">0</span>
                        <span className="block text-[9px] text-slate-555 uppercase tracking-wide">Interviews</span>
                      </div>
                      <div className="w-px h-8 bg-white/5" />
                      <div className="text-center">
                        <span className="block font-sora text-lg font-bold text-white">New</span>
                        <span className="block text-[9px] text-slate-555 uppercase tracking-wide">Rating</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Editor and Privacy Control Form */}
              <form onSubmit={handleSaveProfile} className="space-y-6">
                
                {/* Section 1: Edit Professional Profile */}
                <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md space-y-4">
                  <div>
                    <h3 className="font-sora text-sm font-extrabold text-white">Edit Professional Profile</h3>
                    <p className="text-[10px] text-slate-550 mt-1 leading-normal">
                      Update your career details and how you can support student seekers on NextInCampus.
                    </p>
                  </div>

                  <div className="space-y-3.5">
                    {/* Bio */}
                    <div className="space-y-1">
                      <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider font-space-grotesk">Professional Bio</label>
                      <textarea
                        rows={3}
                        value={bioInput}
                        onChange={(e) => setBioInput(e.target.value)}
                        placeholder="Share a brief overview of your background, tech stacks, or domains you focus on..."
                        className="w-full px-3 py-2 bg-black border border-white/10 rounded-xl text-white text-[11px] placeholder-slate-650 focus:outline-none focus:border-purple-500/40 resize-none leading-normal font-medium"
                      />
                    </div>

                    {/* Grid of Experience & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider font-space-grotesk">Years of Experience</label>
                        <select
                          value={experienceInput}
                          onChange={(e) => setExperienceInput(e.target.value)}
                          className="w-full px-3 py-2 bg-black border border-white/10 rounded-xl text-white text-[11px] focus:outline-none focus:border-purple-500/40 font-medium"
                        >
                          <option>1 Year</option>
                          <option>2 Years</option>
                          <option>3 Years</option>
                          <option>4 Years</option>
                          <option>5 Years</option>
                          <option>6 Years</option>
                          <option>7 Years</option>
                          <option>8 Years</option>
                          <option>9 Years</option>
                          <option>10+ Years</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider font-space-grotesk">Phone Number</label>
                        <input
                          type="text"
                          value={phoneInput}
                          onChange={(e) => setPhoneInput(e.target.value)}
                          placeholder="e.g. +91 98765 43210"
                          className="w-full px-3 py-2 bg-black border border-white/10 rounded-xl text-white text-[11px] placeholder-slate-650 focus:outline-none focus:border-purple-500/40 font-medium"
                        />
                      </div>
                    </div>

                    {/* Skills comma-separated */}
                    <div className="space-y-1">
                      <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider font-space-grotesk">Skills (Comma-separated)</label>
                      <input
                        type="text"
                        value={skillsInput}
                        onChange={(e) => setSkillsInput(e.target.value)}
                        placeholder="e.g. React, Node.js, Python, System Design, AWS"
                        className="w-full px-3 py-2 bg-black border border-white/10 rounded-xl text-white text-[11px] placeholder-slate-650 focus:outline-none focus:border-purple-500/40 font-medium"
                      />
                    </div>

                    {/* Can Help With Checklist */}
                    <div className="space-y-1.5">
                      <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider font-space-grotesk">Can Help With</label>
                      <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-300 font-semibold font-inter">
                        {['Referrals', 'Resume Review', 'Mock Interviews', 'Career Guidance'].map((option) => {
                          const isChecked = canHelpWithInput.includes(option);
                          return (
                            <label key={option} className="flex items-center gap-2 cursor-pointer select-none bg-black/35 border border-white/5 px-3 py-2 rounded-xl hover:border-purple-500/25 transition">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {
                                  if (isChecked) {
                                    setCanHelpWithInput(prev => prev.filter(item => item !== option));
                                  } else {
                                    setCanHelpWithInput(prev => [...prev, option]);
                                  }
                                }}
                                className="accent-purple-500 rounded border-white/10 bg-black cursor-pointer"
                              />
                              <span>{option}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Privacy Controls */}
                <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md space-y-4">
                  <div>
                    <h3 className="font-sora text-sm font-extrabold text-white">Privacy & Visibility Settings</h3>
                    <p className="text-[10px] text-slate-550 mt-1 leading-normal">
                      Control who can view your profile and hide/reveal specific personal contact details.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Public vs Private Profile Radio */}
                    <div className="space-y-1">
                      <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider font-space-grotesk">Profile Type</label>
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-350 font-inter">
                        <label className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition ${!isPrivateInput ? 'bg-purple-950/15 border-purple-500/35 text-white' : 'bg-black/35 border-white/5'}`}>
                          <input
                            type="radio"
                            name="profileType"
                            checked={!isPrivateInput}
                            onChange={() => setIsPrivateInput(false)}
                            className="accent-purple-500 cursor-pointer"
                          />
                          <div>
                            <span className="block">Public Profile</span>
                            <span className="block text-[8px] font-normal text-slate-500 mt-0.5 font-space-grotesk">Visible to all student seekers</span>
                          </div>
                        </label>

                        <label className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition ${isPrivateInput ? 'bg-purple-950/15 border-purple-500/35 text-white' : 'bg-black/35 border-white/5'}`}>
                          <input
                            type="radio"
                            name="profileType"
                            checked={isPrivateInput}
                            onChange={() => setIsPrivateInput(true)}
                            className="accent-purple-500 cursor-pointer"
                          />
                          <div>
                            <span className="block">Private Profile</span>
                            <span className="block text-[8px] font-normal text-slate-500 mt-0.5 font-space-grotesk">Hide contact details entirely</span>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Hide Checkboxes */}
                    <div className={`space-y-2.5 transition ${isPrivateInput ? 'opacity-40 pointer-events-none' : ''}`}>
                      <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider font-space-grotesk">Hide Contact Channels</label>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] text-slate-300 font-semibold font-inter">
                        <label className="flex items-center justify-between bg-black/35 border border-white/5 px-3 py-2 rounded-xl hover:border-purple-500/25 transition cursor-pointer select-none">
                          <span className="flex items-center gap-2">
                            <span>Hide Personal Email</span>
                          </span>
                          <input
                            type="checkbox"
                            checked={hideEmailInput}
                            onChange={() => setHideEmailInput(!hideEmailInput)}
                            className="accent-purple-500 cursor-pointer"
                          />
                        </label>

                        <label className="flex items-center justify-between bg-black/35 border border-white/5 px-3 py-2 rounded-xl hover:border-purple-500/25 transition cursor-pointer select-none">
                          <span className="flex items-center gap-2">
                            <span>Hide Company Email</span>
                          </span>
                          <input
                            type="checkbox"
                            checked={hideCompanyEmailInput}
                            onChange={() => setHideCompanyEmailInput(!hideCompanyEmailInput)}
                            className="accent-purple-500 cursor-pointer"
                          />
                        </label>

                        <label className="flex items-center justify-between bg-black/35 border border-white/5 px-3 py-2 rounded-xl hover:border-purple-500/25 transition cursor-pointer select-none">
                          <span className="flex items-center gap-2">
                            <span>Hide LinkedIn Profile</span>
                          </span>
                          <input
                            type="checkbox"
                            checked={hideLinkedInInput}
                            onChange={() => setHideLinkedInInput(!hideLinkedInInput)}
                            className="accent-purple-500 cursor-pointer"
                          />
                        </label>

                        <label className="flex items-center justify-between bg-black/35 border border-white/5 px-3 py-2 rounded-xl hover:border-purple-500/25 transition cursor-pointer select-none">
                          <span className="flex items-center gap-2">
                            <span>Hide Phone Number</span>
                          </span>
                          <input
                            type="checkbox"
                            checked={hidePhoneInput}
                            onChange={() => setHidePhoneInput(!hidePhoneInput)}
                            className="accent-purple-500 cursor-pointer"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save Profile Button */}
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="w-full py-3 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:opacity-95 text-white font-sora font-extrabold text-xs uppercase tracking-wider transition shadow-lg disabled:opacity-40"
                >
                  {isSavingProfile ? 'Saving Changes...' : 'Save Settings'}
                </button>
              </form>

              {/* Verification Center */}
              <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md space-y-6">
                <div>
                  <h3 className="font-sora text-sm font-extrabold text-white">Verification Center</h3>
                  <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                    Validate your identity to earn badges. Students instantly trust and prioritize requests to verified alumni.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Step 1: Company Email (Bronze) */}
                  <div className="p-4 rounded-xl border border-white/5 bg-black/40 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[9px] font-bold text-purple-400 uppercase tracking-wider font-space-grotesk">Level 1: Company Email</span>
                        <h4 className="text-xs font-bold text-white mt-0.5">Corporate Domain Verification</h4>
                      </div>
                      {currentUser?.isEmailVerified ? (
                        <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-0.5">
                          <Check className="w-2.5 h-2.5" /> Verified
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-slate-800 text-slate-400 border border-white/5">
                          Pending
                        </span>
                      )}
                    </div>

                    {currentUser?.isEmailVerified ? (
                      <p className="text-[10px] text-slate-400">
                        ✓ Verified company email: <strong className="text-white">{currentUser?.companyEmail}</strong> (Bronze Badge Earned +30 Points)
                      </p>
                    ) : (
                      <div className="pt-2">
                        {otpSent ? (
                          <form onSubmit={handleVerifyOtp} className="flex gap-2">
                            <input 
                              type="text" 
                              value={otpInput} 
                              onChange={(e) => setOtpInput(e.target.value)}
                              placeholder="Enter OTP" 
                              className="px-3 py-1.5 bg-black border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500/40 w-32 font-space-grotesk font-bold tracking-widest text-center"
                            />
                            <button 
                              type="submit" 
                              className="px-4 py-1.5 bg-purple-650 hover:bg-purple-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition"
                            >
                              Verify OTP
                            </button>
                            <button 
                              type="button" 
                              onClick={() => setOtpSent(false)}
                              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg text-[10px] font-bold uppercase tracking-wider transition"
                            >
                              Back
                            </button>
                          </form>
                        ) : (
                          <form onSubmit={handleRequestOtp} className="flex gap-2">
                            <input 
                              type="email" 
                              value={compEmailInput} 
                              onChange={(e) => setCompEmailInput(e.target.value)}
                              placeholder="e.g. john@google.com" 
                              className="px-3 py-1.5 bg-black border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500/40 w-56 font-medium"
                              required
                            />
                            <button 
                              type="submit" 
                              className="px-4 py-1.5 bg-purple-650 hover:bg-purple-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition"
                            >
                              Send OTP
                            </button>
                          </form>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Step 2: LinkedIn Verification (Silver) */}
                  <div className={`p-4 rounded-xl border border-white/5 bg-black/40 space-y-3 transition-opacity duration-300 ${!currentUser?.isEmailVerified ? 'opacity-40 pointer-events-none' : ''}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[9px] font-bold text-purple-400 uppercase tracking-wider font-space-grotesk">Level 2: LinkedIn Verification</span>
                        <h4 className="text-xs font-bold text-white mt-0.5">Profile Match & Validation</h4>
                      </div>
                      {currentUser?.isLinkedinVerified ? (
                        <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-0.5">
                          <Check className="w-2.5 h-2.5" /> Verified
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-slate-800 text-slate-400 border border-white/5">
                          Pending
                        </span>
                      )}
                    </div>

                    {currentUser?.isLinkedinVerified ? (
                      <p className="text-[10px] text-slate-400">
                        ✓ Connected Profile: <a href={currentUser?.linkedinUrl} target="_blank" rel="noreferrer" className="text-blue-400 underline">{currentUser?.linkedinUrl}</a> (Silver Badge Earned +25 Points)
                      </p>
                    ) : isVerifyingLinkedin ? (
                      <div className="flex items-center gap-2 pt-2 text-[10px] text-slate-400">
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
                        <span>{linkedinVerifyStep}</span>
                      </div>
                    ) : (
                      <form onSubmit={handleVerifyLinkedin} className="flex gap-2 pt-2">
                        <input 
                          type="url" 
                          value={linkedinUrlInput} 
                          onChange={(e) => setLinkedinUrlInput(e.target.value)}
                          placeholder="https://linkedin.com/in/username" 
                          className="px-3 py-1.5 bg-black border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500/40 w-56 font-medium"
                          required
                        />
                        <button 
                          type="submit" 
                          className="px-4 py-1.5 bg-purple-650 hover:bg-purple-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition"
                        >
                          Verify URL
                        </button>
                      </form>
                    )}
                  </div>

                  {/* Step 3: Manual Verification (Gold) */}
                  <div className={`p-4 rounded-xl border border-white/5 bg-black/40 space-y-3 transition-opacity duration-300 ${(!currentUser?.isEmailVerified || !currentUser?.isLinkedinVerified) ? 'opacity-40 pointer-events-none' : ''}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[9px] font-bold text-purple-400 uppercase tracking-wider font-space-grotesk">Level 3: Manual Review</span>
                        <h4 className="text-xs font-bold text-white mt-0.5">Admin Badge Endorsement</h4>
                      </div>
                      {currentUser?.isAdminVerified ? (
                        <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-0.5">
                          <Check className="w-2.5 h-2.5" /> Verified
                        </span>
                      ) : currentUser?.employeeScreenshot ? (
                        <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-0.5 animate-pulse">
                          Under Review
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-slate-800 text-slate-400 border border-white/5">
                          Pending
                        </span>
                      )}
                    </div>

                    {currentUser?.isAdminVerified ? (
                      <p className="text-[10px] text-slate-400">
                        ✓ Admin Approved & Endorsed. Gold Verified Alumni status unlocked (+25 Points)
                      </p>
                    ) : currentUser?.employeeScreenshot ? (
                      <div className="text-[10px] text-slate-400 space-y-2">
                        <p>Your ID verification request is pending. Admin will approve shortly.</p>
                        <div className="relative w-32 h-20 rounded border border-white/10 overflow-hidden bg-black flex items-center justify-center">
                          <img 
                            src={`/api/users/verify/screenshot/${currentUser.id}`} 
                            alt="ID Screenshot" 
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleUploadScreenshot} className="space-y-3 pt-2">
                        <div className="flex items-center gap-3">
                          <label className="px-4 py-2 border border-white/15 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 transition cursor-pointer">
                            Choose ID/Badge Image
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={handleScreenshotChange}
                              className="hidden" 
                            />
                          </label>
                          <span className="text-[10px] text-slate-500">
                            {selectedScreenshot ? selectedScreenshot.name : 'Select screenshot or photo of employee badge'}
                          </span>
                        </div>
                        {screenshotPreviewUrl && (
                          <div className="w-32 h-20 rounded border border-white/10 overflow-hidden bg-black flex items-center justify-center">
                            <img src={screenshotPreviewUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                          </div>
                        )}
                        {selectedScreenshot && (
                          <button 
                            type="submit" 
                            disabled={isUploadingScreenshot}
                            className="px-4 py-2 bg-purple-650 hover:bg-purple-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition disabled:opacity-50"
                          >
                            {isUploadingScreenshot ? 'Uploading...' : 'Submit to Admin Review'}
                          </button>
                        )}
                      </form>
                    )}
                  </div>
                </div>
              </div>

              {/* Logout button */}
              <button
                type="button"
                onClick={onLogout}
                className="w-full py-3 rounded-full border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-rose-400 font-sora font-semibold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout Account
              </button>
            </div>
          )}

          {activeTab === 'slot_management' && (
            <SlotManagementTab />
          )}

          {activeTab === 'leaderboard' && (
            <LeaderboardTab />
          )}

          {activeTab === 'admin_panel' && (
            <div className="max-w-3xl mx-auto space-y-6 text-left pb-12 font-inter">
              
              {/* Notification Banner */}
              {messageNotification && (
                <div className={`p-4 rounded-xl border text-xs font-semibold ${
                  messageNotification.type === 'success' 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                    : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                }`}>
                  {messageNotification.text}
                </div>
              )}

              <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md">
                <h3 className="font-sora text-sm font-extrabold text-white">Manual Verification Requests</h3>
                <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                  Review submitted employee ID badges and verify corporate email and LinkedIn matching details before endorsing.
                </p>
                
                {isLoadingReviews ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <div className="w-8 h-8 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Fetching requests...</span>
                  </div>
                ) : adminPendingReviews.length === 0 ? (
                  <div className="py-16 text-center border border-dashed border-white/5 rounded-2xl bg-black/20 mt-6">
                    <ShieldCheck className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                    <span className="block text-xs font-bold text-slate-400">All caught up!</span>
                    <p className="text-[10px] text-slate-500 mt-1">No pending alumni manual verification requests found.</p>
                  </div>
                ) : (
                  <div className="space-y-6 mt-6">
                    {adminPendingReviews.map((reviewUser) => (
                      <div key={reviewUser.id} className="p-5 rounded-xl border border-white/5 bg-black/40 flex flex-col md:flex-row gap-5 items-start justify-between">
                        
                        {/* Info details */}
                        <div className="space-y-3 flex-1 min-w-0">
                          <div>
                            <h4 className="text-sm font-extrabold text-white">{reviewUser.name}</h4>
                            <p className="text-[10px] text-slate-400 mt-0.5">{reviewUser.jobTitle || 'Alumni'} @ <strong className="text-white">{reviewUser.company}</strong></p>
                            <p className="text-[9px] text-slate-500 mt-0.5">Registration Email: {reviewUser.email}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-3 text-[10px] font-medium border-t border-white/5 pt-2">
                            <div>
                              <span className="block text-[8px] font-bold text-slate-550 uppercase tracking-wider">Company Email</span>
                              <span className="text-white block mt-0.5 truncate">{reviewUser.companyEmail || 'N/A'}</span>
                              <span className={`inline-block text-[8px] font-bold mt-1 px-1.5 py-0.2 rounded ${
                                reviewUser.isEmailVerified ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10' : 'bg-rose-500/10 text-rose-450'
                              }`}>
                                {reviewUser.isEmailVerified ? 'Verified' : 'Unverified'}
                              </span>
                            </div>
                            
                            <div>
                              <span className="block text-[8px] font-bold text-slate-550 uppercase tracking-wider">LinkedIn URL</span>
                              {reviewUser.linkedinUrl ? (
                                <a href={reviewUser.linkedinUrl} target="_blank" rel="noreferrer" className="text-blue-400 block mt-0.5 truncate hover:underline">
                                  {reviewUser.linkedinUrl}
                                </a>
                              ) : (
                                <span className="text-slate-500 block mt-0.5">Not Provided</span>
                              )}
                              <span className={`inline-block text-[8px] font-bold mt-1 px-1.5 py-0.2 rounded ${
                                reviewUser.isLinkedinVerified ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10' : 'bg-rose-500/10 text-rose-450'
                              }`}>
                                {reviewUser.isLinkedinVerified ? 'Verified' : 'Unverified'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Screenshot preview */}
                        <div className="shrink-0 space-y-1">
                          <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider">Employee Badge Screenshot</span>
                          <a 
                            href={`/api/users/verify/screenshot/${reviewUser.id}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="relative block w-40 h-24 rounded border border-white/10 overflow-hidden bg-black hover:border-purple-500/50 transition cursor-zoom-in"
                          >
                            <img 
                              src={`/api/users/verify/screenshot/${reviewUser.id}`} 
                              alt="Manual Badge" 
                              className="w-full h-full object-contain"
                            />
                          </a>
                        </div>

                        {/* Admin Action Buttons */}
                        <div className="flex flex-row md:flex-col gap-2 shrink-0 self-center md:self-stretch justify-center">
                          <button
                            type="button"
                            onClick={() => handleAdminApprove(reviewUser.id)}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition shadow-md shrink-0"
                          >
                            Approve
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => handleAdminReject(reviewUser.id)}
                            className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-450 border border-rose-650/30 rounded-lg text-[10px] font-bold uppercase tracking-wider transition shrink-0"
                          >
                            Reject
                          </button>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      </main>

      {/* ── Premium Resume Viewer Overlay Drawer ── */}
      {previewingResume && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl h-[85vh] rounded-[2rem] border border-white/10 bg-[#08080b] p-6 shadow-2xl flex flex-col justify-between animate-fade-in-up">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/5 shrink-0">
              <div>
                <h3 className="font-sora text-white text-base font-extrabold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-rose-500" />
                  {previewingResume.studentName}'s Resume
                </h3>
                <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                  File: {previewingResume.resumeName}
                </p>
              </div>
              <button 
                onClick={handleClosePreview}
                className="w-8 h-8 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Viewer Area */}
            <div className="flex-1 my-5 rounded-xl border border-white/5 bg-slate-950/40 relative overflow-hidden flex items-center justify-center p-4 min-h-[300px]">
              {isLoadingFile ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Loading PDF from server...</span>
                </div>
              ) : fileUrl ? (
                previewingResume.resumeName.toLowerCase().endsWith('.pdf') ? (
                  <iframe 
                    src={fileUrl} 
                    className="w-full h-full rounded-xl border border-white/10"
                    title="Resume PDF Preview"
                  />
                ) : (
                  <div className="text-center p-8">
                    <FileText className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                    <p className="text-xs text-slate-400 font-semibold mb-3">
                      Word Documents (.docx/.doc) cannot be previewed directly in the browser.
                    </p>
                    <a
                      href={fileUrl}
                      download={previewingResume.resumeName}
                      className="px-4 py-2 rounded-xl bg-purple-650 hover:bg-purple-600 text-white font-bold text-xs uppercase tracking-wider inline-flex items-center gap-1.5"
                    >
                      <Download className="w-4 h-4" />
                      Download to View
                    </a>
                  </div>
                )
              ) : (
                <div className="text-center p-8">
                  <XCircle className="w-12 h-12 text-rose-500/40 mx-auto mb-3" />
                  <p className="text-xs text-slate-400">Failed to load resume file. It might have been deleted or moved.</p>
                </div>
              )}
            </div>

            {/* Footer actions */}
            <div className="flex items-center justify-between pt-3 border-t border-white/5 shrink-0">
              <span className="text-[9px] text-slate-550 leading-relaxed max-w-sm italic">
                * NextInCampus secures all document channels. Keep document details confidential.
              </span>
              <div className="flex gap-3">
                {fileUrl && (
                  <a
                    href={fileUrl}
                    download={previewingResume.resumeName}
                    className="px-4 py-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 transition flex items-center gap-1.5"
                  >
                    <Download className="w-4 h-4" />
                    Download File
                  </a>
                )}
                <button
                  onClick={handleClosePreview}
                  className="px-4 py-2 rounded-xl bg-purple-650 hover:bg-purple-600 text-white font-bold text-xs uppercase tracking-wider transition"
                >
                  Close Viewer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* SCREEN: STUDENT PUBLIC/SEMI-PUBLIC PROFILE DRAWER */}
      {selectedStudentReq && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end animate-fade-in cursor-pointer" onClick={() => setSelectedStudentReq(null)}>
          <div 
            className="w-full max-w-md bg-[#07070a] border-l border-white/5 h-full p-5 overflow-y-auto no-scrollbar shadow-2xl relative text-left flex flex-col justify-between cursor-default"
            onClick={e => e.stopPropagation()}
          >
            <div>
              {/* Header close panel */}
              <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest font-space-grotesk">Student Profile Details</span>
                <button 
                  onClick={() => setSelectedStudentReq(null)} 
                  className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white border border-white/5 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Basic student card */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-650 to-indigo-650 flex items-center justify-center font-bold text-white text-sm uppercase shadow-lg shrink-0">
                  {selectedStudentReq.studentName[0]}{selectedStudentReq.studentName.split(' ')[1]?.[0] ?? ''}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-sora text-white text-base font-extrabold">{selectedStudentReq.studentName}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold border border-purple-500/20 text-purple-400 bg-purple-500/5">
                      {selectedStudentReq.score.includes('%') ? selectedStudentReq.score : `${selectedStudentReq.score}%`} Match
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-350 mt-0.5 font-semibold">
                    {selectedStudentReq.seeker?.targetRole || selectedStudentReq.role || 'Software Engineer Intern'}
                  </p>
                  <p className="text-[9px] text-slate-500 mt-0.5">
                    {selectedStudentReq.class}
                  </p>
                </div>
              </div>

              {/* AI Career Summary / Bio */}
              <div className="mb-5">
                <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-space-grotesk">AI Career Summary</span>
                <div className="p-3.5 rounded-xl border border-white/5 bg-slate-950/40 text-slate-350 text-[11px] leading-relaxed font-medium">
                  {selectedStudentReq.seeker?.bio || 'CSE Student passionate about backend systems, database scaling, and machine learning architectures.'}
                </div>
              </div>

              {/* Skills section */}
              <div className="mb-5">
                <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider mb-2 font-space-grotesk">Skills & Proficiencies</span>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedStudentReq.seeker?.skills && selectedStudentReq.seeker.skills.length > 0
                    ? selectedStudentReq.seeker.skills
                    : ['React', 'Node.js', 'Java', 'Python', 'System Design', 'SQL']
                  ).map((skill: string, idx: number) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] text-slate-300 font-semibold">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Projects section */}
              <div className="mb-5">
                <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider mb-2 font-space-grotesk">Technical Projects</span>
                <div className="space-y-2">
                  {(selectedStudentReq.seeker?.projects && selectedStudentReq.seeker.projects.length > 0
                    ? selectedStudentReq.seeker.projects
                    : ['PrepNerve', 'NextInCampus']
                  ).map((proj: string, idx: number) => (
                    <div key={idx} className="p-3 rounded-xl border border-white/5 bg-white/[0.01] flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center font-bold text-xs text-purple-400 uppercase font-space-grotesk shrink-0">
                        {proj[0]}
                      </div>
                      <div>
                        <span className="block text-[11px] font-bold text-white">{proj}</span>
                        <span className="block text-[8.5px] text-slate-550 font-semibold mt-0.5">Developer · Web Application</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Companies */}
              <div className="mb-5">
                <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider mb-2 font-space-grotesk">Target Companies</span>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedStudentReq.seeker?.targetCompanies && selectedStudentReq.seeker.targetCompanies.length > 0
                    ? selectedStudentReq.seeker.targetCompanies
                    : ['Google', 'Microsoft', 'Amazon']
                  ).map((comp: string, idx: number) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/25 text-[10px] text-purple-300 font-bold font-mono">
                      {comp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Seeker Private Profile Section (Resume, Contact info) */}
              <div className="mb-5 p-3.5 rounded-2xl border border-purple-500/20 bg-purple-950/10 space-y-3 font-inter shadow-[0_4px_15px_rgba(168,85,247,0.03)]">
                <div className="flex items-center gap-1.5 text-purple-400 font-bold font-space-grotesk text-[9px] uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  <span>Verified Contact Details (Private Profile)</span>
                </div>
                
                <div className="space-y-2.5 text-[10px]">
                  {/* Email */}
                  <div className="flex justify-between items-center bg-black/40 p-2 rounded-xl border border-white/5">
                    <span className="text-slate-500 font-bold uppercase tracking-wider text-[8px]">Student Email</span>
                    <span className="text-white font-mono font-semibold">{selectedStudentReq.seeker?.email || 'student@iitb.edu'}</span>
                  </div>

                  {/* LinkedIn & GitHub urls */}
                  <div className="grid grid-cols-2 gap-2">
                    <a 
                      href={selectedStudentReq.seeker?.linkedinUrl || 'https://linkedin.com'} 
                      target="_blank" 
                      rel="noreferrer"
                      className="p-2 bg-black/40 rounded-xl border border-white/5 text-center text-purple-400 hover:text-purple-300 transition-all font-semibold font-sora text-[9px] uppercase tracking-wider"
                    >
                      LinkedIn
                    </a>
                    <a 
                      href={selectedStudentReq.seeker?.githubUrl || 'https://github.com'} 
                      target="_blank" 
                      rel="noreferrer"
                      className="p-2 bg-black/40 rounded-xl border border-white/5 text-center text-purple-400 hover:text-purple-300 transition-all font-semibold font-sora text-[9px] uppercase tracking-wider"
                    >
                      GitHub
                    </a>
                  </div>

                  {/* Resume preview download */}
                  <div className="p-2 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-rose-500 shrink-0" />
                      <span className="text-white font-bold truncate max-w-[150px]">{selectedStudentReq.resumeName || 'resume.pdf'}</span>
                    </div>
                    {selectedStudentReq.resumeUploaded ? (
                      <button
                        type="button"
                        onClick={() => {
                          handleViewResume(selectedStudentReq.seekerId, selectedStudentReq.resumeName, selectedStudentReq.studentName);
                          setSelectedStudentReq(null);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-purple-650 hover:bg-purple-600 text-white text-[8px] font-bold uppercase tracking-wider transition"
                      >
                        Preview Resume
                      </button>
                    ) : (
                      <span className="text-slate-500 italic text-[9px]">No resume</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions panel */}
            <div className="pt-3 border-t border-white/5 mt-auto">
              {selectedStudentReq.status === 'pending' ? (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      onHandleAction(selectedStudentReq.id, 'referred');
                      setSelectedStudentReq(null);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-650 hover:opacity-95 text-white font-sora font-bold text-[10px] uppercase tracking-wider transition shadow-md"
                  >
                    Refer Student
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onHandleAction(selectedStudentReq.id, 'info');
                      setSelectedStudentReq(null);
                    }}
                    className="flex-1 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 font-sora font-bold text-[10px] uppercase tracking-wider transition"
                  >
                    Need Info
                  </button>
                </div>
              ) : (
                <div className="text-center py-2.5">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                    selectedStudentReq.status === 'referred' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    selectedStudentReq.status === 'info'     ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                    'bg-rose-500/10 text-rose-450 border-rose-500/20'
                  }`}>
                    Status: {selectedStudentReq.status}
                  </span>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ── Create Referral Post Modal ── */}
      {isPostingReferral && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div 
            className="w-full max-w-lg bg-[#07070a] border border-white/10 rounded-2xl p-6 shadow-2xl relative text-left flex flex-col justify-between animate-fade-in-up"
            onClick={e => e.stopPropagation()}
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest font-space-grotesk">Post a New Referral Slot</span>
                <button 
                  onClick={() => setIsPostingReferral(false)} 
                  className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white border border-white/5 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleCreatePost} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {/* Company */}
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Company *</label>
                    <input
                      type="text"
                      required
                      value={newPostData.company}
                      onChange={e => setNewPostData(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="e.g. Google"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Job Role *</label>
                    <input
                      type="text"
                      required
                      value={newPostData.role}
                      onChange={e => setNewPostData(prev => ({ ...prev, role: e.target.value }))}
                      placeholder="e.g. Frontend Engineer"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {/* Job Type */}
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Job Type</label>
                    <select
                      value={newPostData.jobType}
                      onChange={e => setNewPostData(prev => ({ ...prev, jobType: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                    >
                      <option value="Full-time" className="bg-[#0a0a0f]">Full-time</option>
                      <option value="Internship" className="bg-[#0a0a0f]">Internship</option>
                      <option value="Contract" className="bg-[#0a0a0f]">Contract</option>
                    </select>
                  </div>

                  {/* Domain */}
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Domain</label>
                    <select
                      value={newPostData.domain}
                      onChange={e => setNewPostData(prev => ({ ...prev, domain: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                    >
                      <option value="Engineering" className="bg-[#0a0a0f]">Engineering</option>
                      <option value="Data & AI" className="bg-[#0a0a0f]">Data & AI</option>
                      <option value="Product" className="bg-[#0a0a0f]">Product</option>
                      <option value="Design" className="bg-[#0a0a0f]">Design</option>
                      <option value="Marketing" className="bg-[#0a0a0f]">Marketing</option>
                      <option value="Finance" className="bg-[#0a0a0f]">Finance</option>
                      <option value="Operations" className="bg-[#0a0a0f]">Operations</option>
                    </select>
                  </div>

                  {/* Slots */}
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Available Slots</label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={newPostData.slots}
                      onChange={e => setNewPostData(prev => ({ ...prev, slots: Number(e.target.value) }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Location */}
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Location</label>
                    <input
                      type="text"
                      value={newPostData.location}
                      onChange={e => setNewPostData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g. Remote, Bangalore"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>

                  {/* Deadline */}
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Application Deadline</label>
                    <input
                      type="date"
                      value={newPostData.deadline}
                      onChange={e => setNewPostData(prev => ({ ...prev, deadline: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>
                </div>

                {/* Required Skills */}
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Required Skills (comma-separated)</label>
                  <input
                    type="text"
                    value={newPostData.skills}
                    onChange={e => setNewPostData(prev => ({ ...prev, skills: e.target.value }))}
                    placeholder="e.g. React, Node.js, TypeScript"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Description / Requirements</label>
                  <textarea
                    rows={3}
                    value={newPostData.description}
                    onChange={e => setNewPostData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief details about the role, referral process, or criteria..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50 resize-none"
                  />
                </div>

                {/* PDF Job Description Upload */}
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Upload Job Description / Criteria PDF (Optional)
                  </label>
                  <div className="relative flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-350">
                    <span className="truncate max-w-[200px]">
                      {selectedJdFile ? selectedJdFile.name : 'No PDF selected'}
                    </span>
                    <label className="cursor-pointer px-2.5 py-1 rounded bg-white/10 hover:bg-white/15 text-[10px] font-bold text-white transition">
                      Choose PDF
                      <input
                        type="file"
                        accept=".pdf,.docx,.doc"
                        onChange={e => {
                          if (e.target.files && e.target.files[0]) {
                            setSelectedJdFile(e.target.files[0]);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Submit button */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-655 hover:opacity-95 text-white font-sora font-bold text-xs uppercase tracking-wider transition shadow-md"
                  >
                    Post Referral
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPostingReferral(false)}
                    className="flex-1 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 font-sora font-bold text-xs uppercase tracking-wider transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Premium Referral Post Success Modal */}
      {createdPostSuccess && (
        <div className="fixed inset-0 bg-[#020205]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#09090f] border border-white/10 rounded-2xl max-w-sm w-full overflow-hidden shadow-[0_10px_50px_rgba(0,0,0,0.5)] animate-fade-in flex flex-col p-6 items-center text-center font-inter">
            {/* Sparkles / Glowing success icon */}
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 relative shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <div className="absolute inset-0 rounded-full border border-emerald-500/30 animate-ping opacity-75" />
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>

            <h3 className="font-sora text-base font-bold text-white mb-2">Referral Posted!</h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Your referral slot for <strong className="text-white">{createdPostSuccess.role}</strong> at <strong className="text-white">{createdPostSuccess.company}</strong> is now live on the Seeker board.
            </p>

            {/* Quick stats / summary */}
            <div className="w-full p-3 rounded-xl bg-white/3 border border-white/5 space-y-1.5 text-[11px] text-slate-400 mb-5 text-left">
              <div className="flex justify-between">
                <span>Domain:</span>
                <span className="text-white font-semibold">{createdPostSuccess.domain}</span>
              </div>
              <div className="flex justify-between">
                <span>Slots Available:</span>
                <span className="text-white font-semibold">{createdPostSuccess.slots}</span>
              </div>
              {createdPostSuccess.deadline && (
                <div className="flex justify-between">
                  <span>Deadline:</span>
                  <span className="text-white font-semibold">{createdPostSuccess.deadline}</span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setCreatedPostSuccess(null)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-white font-sora font-extrabold text-xs uppercase tracking-wider transition shadow-md"
            >
              Great, thank you!
            </button>
          </div>
        </div>
      )}
    </section>
  );
};