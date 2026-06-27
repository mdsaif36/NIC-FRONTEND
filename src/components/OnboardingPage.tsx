import { useState, useMemo } from 'react';
import { API_BASE_URL } from '../config';
import { LogOut, ArrowRight, ArrowLeft, Check, Sparkles, Plus, X, Briefcase } from 'lucide-react';

interface OnboardingPageProps {
  session: {
    id: number;
    role: 'seeker' | 'alumni';
    name: string;
    college?: string;
    company?: string;
    email?: string;
  };
  onComplete: (updatedUser: any) => void;
  onLogout: () => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ session, onComplete, onLogout }) => {
  const isSeeker = session.role === 'seeker';
  const themeAccent = isSeeker ? 'purple' : 'emerald';

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Welcome flow states
  const [showWelcome, setShowWelcome] = useState(false);
  const [savedUser, setSavedUser] = useState<any>(null);

  // --- Seeker Fields State ---
  const [seekerName, setSeekerName] = useState(session.name || '');
  const [seekerCollege, setSeekerCollege] = useState(session.college || '');
  const [seekerBranch, setSeekerBranch] = useState('');
  const [seekerGradYear, setSeekerGradYear] = useState('2026');
  const [seekerResume, setSeekerResume] = useState('');
  const [seekerLinkedIn, setSeekerLinkedIn] = useState('');
  const [seekerDomain, setSeekerDomain] = useState('Software Engineering');
  const [seekerSkills, setSeekerSkills] = useState<string[]>(['React', 'Node.js']);
  const [newSkill, setNewSkill] = useState('');
  const [seekerTargetRoles, setSeekerTargetRoles] = useState<string[]>(['Frontend Developer']);
  const [newRole, setNewRole] = useState('');
  const [seekerBio, setSeekerBio] = useState('');
  const [portfolioLinks, setPortfolioLinks] = useState<Array<{ name: string; url: string }>>([
    { name: 'GitHub', url: '' }
  ]);

  // --- Alumni Fields State ---
  const [alumniCompany, setAlumniCompany] = useState(session.company || '');
  const [alumniRole, setAlumniRole] = useState('');
  const [alumniExperience, setAlumniExperience] = useState('3-5 years');
  const [alumniWorkEmail, setAlumniWorkEmail] = useState('');
  const [alumniLinkedIn, setAlumniLinkedIn] = useState('');
  const [alumniAvailability, setAlumniAvailability] = useState<boolean>(true); // true = Open to Mentorship, false = Referrals Only
  const [alumniBio, setAlumniBio] = useState('');
  const [alumniHours, setAlumniHours] = useState('Weekends, 10:00 AM - 2:00 PM IST');
  const [preferredReferrals, setPreferredReferrals] = useState<string[]>([]);
  const [newCompanyInput, setNewCompanyInput] = useState('');
  const [alumniExpertise, setAlumniExpertise] = useState<string[]>(['Resume Review', 'System Design']);
  const [newExpertiseInput, setNewExpertiseInput] = useState('');

  // Handle Seeker Portfolio Links
  const addPortfolioLink = () => {
    setPortfolioLinks([...portfolioLinks, { name: 'Project / Website', url: '' }]);
  };

  const removePortfolioLink = (index: number) => {
    setPortfolioLinks(portfolioLinks.filter((_, i) => i !== index));
  };

  const updatePortfolioLink = (index: number, key: 'name' | 'url', value: string) => {
    const updated = [...portfolioLinks];
    updated[index][key] = value;
    setPortfolioLinks(updated);
  };

  // Seeker Tags helpers
  const addSkill = () => {
    if (newSkill.trim() && !seekerSkills.includes(newSkill.trim())) {
      setSeekerSkills([...seekerSkills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setSeekerSkills(seekerSkills.filter(s => s !== skill));
  };

  const addRole = () => {
    if (newRole.trim() && !seekerTargetRoles.includes(newRole.trim())) {
      setSeekerTargetRoles([...seekerTargetRoles, newRole.trim()]);
      setNewRole('');
    }
  };

  const removeRole = (r: string) => {
    setSeekerTargetRoles(seekerTargetRoles.filter(item => item !== r));
  };

  // Alumni Preferred Companies helpers
  const addPreferredCompany = () => {
    if (newCompanyInput.trim() && !preferredReferrals.includes(newCompanyInput.trim())) {
      setPreferredReferrals([...preferredReferrals, newCompanyInput.trim()]);
      setNewCompanyInput('');
    }
  };

  const removePreferredCompany = (comp: string) => {
    setPreferredReferrals(preferredReferrals.filter(c => c !== comp));
  };

  // Alumni Expertise tags helpers
  const addExpertise = () => {
    if (newExpertiseInput.trim() && !alumniExpertise.includes(newExpertiseInput.trim())) {
      setAlumniExpertise([...alumniExpertise, newExpertiseInput.trim()]);
      setNewExpertiseInput('');
    }
  };

  const removeExpertise = (exp: string) => {
    setAlumniExpertise(alumniExpertise.filter(e => e !== exp));
  };

  // Step validation
  const isStepValid = useMemo(() => {
    if (isSeeker) {
      if (step === 1) {
        return !!seekerName.trim() && !!seekerCollege.trim() && !!seekerBranch.trim();
      }
      if (step === 2) {
        return !!seekerResume.trim() && !!seekerLinkedIn.trim();
      }
      if (step === 3) {
        return seekerSkills.length > 0 && !!seekerBio.trim();
      }
    } else {
      if (step === 1) {
        return !!alumniCompany.trim() && !!alumniRole.trim() && !!alumniWorkEmail.trim();
      }
      if (step === 2) {
        return alumniExpertise.length > 0;
      }
      if (step === 3) {
        return !!alumniBio.trim() && !!alumniLinkedIn.trim();
      }
    }
    return false;
  }, [
    step, isSeeker, seekerName, seekerCollege, seekerBranch, seekerResume, seekerLinkedIn, seekerSkills, seekerBio,
    alumniCompany, alumniRole, alumniWorkEmail, alumniExpertise, alumniBio, alumniLinkedIn
  ]);

  // Submit profile to backend
  const handleSubmit = async () => {
    if (!isStepValid) return;
    setError(null);
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      
      const payload: any = {
        isProfileComplete: true
      };

      if (isSeeker) {
        payload.name = seekerName;
        payload.college = seekerCollege;
        payload.branch = seekerBranch;
        payload.year = `${seekerGradYear} Batch`;
        payload.resumeName = seekerResume;
        payload.resumeUploaded = true;
        payload.linkedinUrl = seekerLinkedIn;
        payload.primaryDomain = seekerDomain;
        payload.skills = seekerSkills;
        payload.bio = seekerBio;
        payload.targetRole = seekerTargetRoles.join(', ');
        
        // Save portfolio links to projects array
        payload.projects = portfolioLinks
          .filter(l => l.url.trim() !== '')
          .map(l => `${l.name}: ${l.url}`);
      } else {
        payload.company = alumniCompany;
        payload.jobTitle = alumniRole;
        payload.experience = alumniExperience;
        payload.companyEmail = alumniWorkEmail;
        payload.linkedinUrl = alumniLinkedIn;
        payload.canHelpWith = alumniExpertise;
        payload.availability = alumniAvailability ? 'Open to Mentorship' : 'Referrals Only';
        payload.bio = alumniBio;
        payload.preferredContactHours = alumniHours;
        
        // Preferred companies saved to targetCompanies list
        payload.targetCompanies = preferredReferrals.length > 0 ? preferredReferrals : [alumniCompany];
      }

      const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to complete onboarding profile.');
      }

      const updatedUser = await res.json();
      setSavedUser(updatedUser);
      setShowWelcome(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'A network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const accentColorClass = themeAccent === 'purple' ? 'text-purple-400' : 'text-emerald-400';
  const accentBorderClass = themeAccent === 'purple' ? 'border-purple-500/30 focus:border-purple-500' : 'border-emerald-500/30 focus:border-emerald-500';
  const accentBgClass = themeAccent === 'purple' ? 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/20' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20';
  const accentBgMutedClass = themeAccent === 'purple' ? 'bg-purple-500/10 border-purple-500/20 text-purple-300' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300';
  const accentGlowClass = themeAccent === 'purple' ? 'shadow-[0_0_20px_rgba(168,85,247,0.15)]' : 'shadow-[0_0_20px_rgba(16,185,129,0.15)]';
  const iconThemeColor = themeAccent === 'purple' ? 'from-purple-500 to-indigo-500' : 'from-emerald-500 to-teal-500';

  return (
    <div className={`w-full max-w-xl bg-slate-950/90 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-2xl ${accentGlowClass} relative font-sora text-white`}>
      
      {/* Onboarding Header */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-black tracking-widest bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">NEXUS CONNECT</span>
          <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase ${accentBgMutedClass}`}>
            {isSeeker ? 'Seeker' : 'Alumni'}
          </span>
        </div>
        
        {!showWelcome && (
          <button 
            type="button"
            onClick={onLogout}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-bold text-slate-400 hover:text-white transition-all"
          >
            <LogOut size={11} />
            <span>Sign Out</span>
          </button>
        )}
      </div>

      {showWelcome ? (
        /* Celebration Welcome Step */
        <div className="text-center py-6 space-y-6 animate-fadeIn">
          <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-tr ${iconThemeColor} flex items-center justify-center animate-bounce shadow-lg`}>
            <Sparkles className="text-white" size={32} />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Welcome to NextInCampus!
            </h1>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              {isSeeker 
                ? "Your professional referral profile is ready. You can now explore alumni networks, check out target companies, and apply for referrals." 
                : "Thank you for completing your verification setup. You are now ready to refer seekers, provide mentorship, and build trust in our community."}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onComplete(savedUser)}
            className={`w-full py-3 px-4 rounded-xl text-white text-xs font-black uppercase tracking-wider transition-all duration-300 ${accentBgClass} flex items-center justify-center gap-2`}
          >
            <span>Enter Dashboard</span>
            <ArrowRight size={14} />
          </button>
        </div>
      ) : (
        /* Regular Setup Wizard Steps */
        <div>
          {/* Progress Tracker */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">STEP {step} OF 3</span>
              <span className="text-xs font-bold text-slate-300">
                {step === 1 && 'Basic Identity'}
                {step === 2 && (isSeeker ? 'Referral Assets' : 'Match Preferences')}
                {step === 3 && 'Pitch & Profile Bio'}
              </span>
            </div>
            
            {/* Step Progress Line */}
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden flex gap-1">
              <div className={`h-full rounded-full transition-all duration-300 ${step >= 1 ? (themeAccent === 'purple' ? 'bg-purple-500' : 'bg-emerald-500') : 'bg-white/5'} flex-1`} />
              <div className={`h-full rounded-full transition-all duration-300 ${step >= 2 ? (themeAccent === 'purple' ? 'bg-purple-500' : 'bg-emerald-500') : 'bg-white/5'} flex-1`} />
              <div className={`h-full rounded-full transition-all duration-300 ${step >= 3 ? (themeAccent === 'purple' ? 'bg-purple-500' : 'bg-emerald-500') : 'bg-white/5'} flex-1`} />
            </div>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* STEP 1: Academic & Basic Identity (Seeker) OR Verification & Professional Identity (Alumni) */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="mb-2">
                <h2 className="text-base md:text-lg font-black flex items-center gap-1.5">
                  <Sparkles className={accentColorClass} size={16} />
                  <span>Tell us about yourself</span>
                </h2>
                <p className="text-[10px] text-slate-400 mt-0.5">Let's set up your profile identity.</p>
              </div>

              {isSeeker ? (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Full Name</label>
                    <input 
                      type="text"
                      value={seekerName}
                      onChange={(e) => setSeekerName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className={`w-full bg-black/40 border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 ${themeAccent === 'purple' ? 'focus:ring-purple-500' : 'focus:ring-emerald-500'} ${accentBorderClass} transition-all`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">College / University</label>
                    <input 
                      type="text"
                      value={seekerCollege}
                      onChange={(e) => setSeekerCollege(e.target.value)}
                      placeholder="e.g. KIIT University"
                      className={`w-full bg-black/40 border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 ${themeAccent === 'purple' ? 'focus:ring-purple-500' : 'focus:ring-emerald-500'} ${accentBorderClass} transition-all`}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Degree & Branch</label>
                      <input 
                        type="text"
                        value={seekerBranch}
                        onChange={(e) => setSeekerBranch(e.target.value)}
                        placeholder="e.g. B.Tech in CSE"
                        className={`w-full bg-black/40 border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 ${themeAccent === 'purple' ? 'focus:ring-purple-500' : 'focus:ring-emerald-500'} ${accentBorderClass} transition-all`}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Graduation Year</label>
                      <select 
                        value={seekerGradYear}
                        onChange={(e) => setSeekerGradYear(e.target.value)}
                        className={`w-full bg-black/40 border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 ${themeAccent === 'purple' ? 'focus:ring-purple-500' : 'focus:ring-emerald-500'} ${accentBorderClass} transition-all`}
                      >
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                        <option value="2027">2027</option>
                        <option value="2028">2028</option>
                        <option value="2029">2029</option>
                      </select>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Company</label>
                      <input 
                        type="text"
                        value={alumniCompany}
                        onChange={(e) => setAlumniCompany(e.target.value)}
                        placeholder="e.g. Google"
                        className={`w-full bg-black/40 border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 ${themeAccent === 'purple' ? 'focus:ring-purple-500' : 'focus:ring-emerald-500'} ${accentBorderClass} transition-all`}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Designation / Role</label>
                      <input 
                        type="text"
                        value={alumniRole}
                        onChange={(e) => setAlumniRole(e.target.value)}
                        placeholder="e.g. Senior SWE"
                        className={`w-full bg-black/40 border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 ${themeAccent === 'purple' ? 'focus:ring-purple-500' : 'focus:ring-emerald-500'} ${accentBorderClass} transition-all`}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Years of Experience</label>
                    <select 
                      value={alumniExperience}
                      onChange={(e) => setAlumniExperience(e.target.value)}
                      className={`w-full bg-black/40 border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 ${themeAccent === 'purple' ? 'focus:ring-purple-500' : 'focus:ring-emerald-500'} ${accentBorderClass} transition-all`}
                    >
                      <option value="0-2 years">0-2 years</option>
                      <option value="3-5 years">3-5 years</option>
                      <option value="5+ years">5+ years</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Work Email (Mandatory Verification)</label>
                    <input 
                      type="email"
                      value={alumniWorkEmail}
                      onChange={(e) => setAlumniWorkEmail(e.target.value)}
                      placeholder="e.g. name@company.com"
                      className={`w-full bg-black/40 border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 ${themeAccent === 'purple' ? 'focus:ring-purple-500' : 'focus:ring-emerald-500'} ${accentBorderClass} transition-all`}
                    />
                    <p className="text-[9px] text-slate-500 leading-normal">
                      We verify work emails to maintain a secure and trusted community. Stale or personal emails are rejected.
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* STEP 2: The Seeker "Referral Arsenal" OR Alumni Preferences */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="mb-2">
                <h2 className="text-base md:text-lg font-black flex items-center gap-1.5">
                  <Briefcase className={accentColorClass} size={16} />
                  <span>{isSeeker ? 'Referral Arsenal' : 'Preferences & Support'}</span>
                </h2>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {isSeeker ? 'Provide links that verify your skills and project work.' : 'Let seekers know how you can refer or support them.'}
                </p>
              </div>

              {isSeeker ? (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Resume Drive Link / Hosted PDF</label>
                    <input 
                      type="url"
                      value={seekerResume}
                      onChange={(e) => setSeekerResume(e.target.value)}
                      placeholder="e.g. https://drive.google.com/file/d/..."
                      className={`w-full bg-black/40 border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 ${themeAccent === 'purple' ? 'focus:ring-purple-500' : 'focus:ring-emerald-500'} ${accentBorderClass} transition-all`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">LinkedIn Profile URL</label>
                    <input 
                      type="url"
                      value={seekerLinkedIn}
                      onChange={(e) => setSeekerLinkedIn(e.target.value)}
                      placeholder="e.g. https://linkedin.com/in/username"
                      className={`w-full bg-black/40 border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 ${themeAccent === 'purple' ? 'focus:ring-purple-500' : 'focus:ring-emerald-500'} ${accentBorderClass} transition-all`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Primary Domain</label>
                    <select 
                      value={seekerDomain}
                      onChange={(e) => setSeekerDomain(e.target.value)}
                      className={`w-full bg-black/40 border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 ${themeAccent === 'purple' ? 'focus:ring-purple-500' : 'focus:ring-emerald-500'} ${accentBorderClass} transition-all`}
                    >
                      <option value="Software Engineering">Software Engineering</option>
                      <option value="Product Management">Product Management</option>
                      <option value="Design">Design</option>
                      <option value="Finance">Finance</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Portfolio & Project Links</label>
                      <button 
                        type="button" 
                        onClick={addPortfolioLink}
                        className={`text-[9px] font-bold uppercase flex items-center gap-1 ${accentColorClass}`}
                      >
                        <Plus size={11} /> Add link
                      </button>
                    </div>

                    {portfolioLinks.map((link, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input 
                          type="text"
                          value={link.name}
                          onChange={(e) => updatePortfolioLink(idx, 'name', e.target.value)}
                          placeholder="e.g. GitHub or Portfolio"
                          className="w-1/3 bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
                        />
                        <input 
                          type="url"
                          value={link.url}
                          onChange={(e) => updatePortfolioLink(idx, 'url', e.target.value)}
                          placeholder="https://..."
                          className={`w-2/3 bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 ${themeAccent === 'purple' ? 'focus:ring-purple-500' : 'focus:ring-emerald-500'} transition-all`}
                        />
                        {portfolioLinks.length > 1 && (
                          <button 
                            type="button" 
                            onClick={() => removePortfolioLink(idx)}
                            className="p-1.5 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-slate-400 hover:text-white"
                          >
                            <X size={12} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  {/* Preferred referral companies (Tag input) */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Companies you can refer to</label>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        value={newCompanyInput}
                        onChange={(e) => setNewCompanyInput(e.target.value)}
                        placeholder="e.g. Google, Amazon, Microsoft"
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addPreferredCompany())}
                        className={`w-full bg-black/40 border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 ${accentBorderClass} transition-all`}
                      />
                      <button 
                        type="button" 
                        onClick={addPreferredCompany}
                        className={`px-3 py-2 rounded-lg text-white font-bold text-xs ${accentBgClass}`}
                      >
                        Add
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-1.5 pt-1.5">
                      {preferredReferrals.length === 0 ? (
                        <span className="text-[9px] text-slate-500 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                          Defaults to current company ({alumniCompany || 'None'})
                        </span>
                      ) : (
                        preferredReferrals.map(c => (
                          <span key={c} className={`text-[9px] font-medium px-2 py-0.5 rounded-full border flex items-center gap-1 ${accentBgMutedClass}`}>
                            <span>{c}</span>
                            <button type="button" onClick={() => removePreferredCompany(c)}>
                              <X size={9} />
                            </button>
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Areas of expertise (Tag input) */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Areas of Expertise (Mentorship / Guidance)</label>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        value={newExpertiseInput}
                        onChange={(e) => setNewExpertiseInput(e.target.value)}
                        placeholder="e.g. System Design, Resume Review"
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addExpertise())}
                        className={`w-full bg-black/40 border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 ${accentBorderClass} transition-all`}
                      />
                      <button 
                        type="button" 
                        onClick={addExpertise}
                        className={`px-3 py-2 rounded-lg text-white font-bold text-xs ${accentBgClass}`}
                      >
                        Add
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-1.5 pt-1.5">
                      {alumniExpertise.map(e => (
                        <span key={e} className={`text-[9px] font-medium px-2 py-0.5 rounded-full border flex items-center gap-1 ${accentBgMutedClass}`}>
                          <span>{e}</span>
                          <button type="button" onClick={() => removeExpertise(e)}>
                            <X size={9} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Mentorship availability toggle */}
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between mt-2">
                    <div className="space-y-0.5">
                      <label className="text-xs font-black text-white">Mentorship Availability</label>
                      <p className="text-[9px] text-slate-500">
                        {alumniAvailability 
                          ? 'Seekers can request meetings.' 
                          : 'Referrals Only.'}
                      </p>
                    </div>
                    
                    <button 
                      type="button"
                      onClick={() => setAlumniAvailability(!alumniAvailability)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${alumniAvailability ? (themeAccent === 'purple' ? 'bg-purple-600' : 'bg-emerald-600') : 'bg-white/10'}`}
                    >
                      <span 
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${alumniAvailability ? 'translate-x-4' : 'translate-x-0'}`} 
                      />
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* STEP 3: Seeker Pitch & Skills OR Alumni Impact Bio */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="mb-2">
                <h2 className="text-base md:text-lg font-black flex items-center gap-1.5">
                  <Sparkles className={accentColorClass} size={16} />
                  <span>Stand out from the crowd</span>
                </h2>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {isSeeker ? 'Showcase your tech stack and introduce yourself.' : 'Share your professional background and contact preferences.'}
                </p>
              </div>

              {isSeeker ? (
                <>
                  {/* Tag input for skills */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Top Technical Skills</label>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="e.g. React, Node.js, Python"
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                        className={`w-full bg-black/40 border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 ${accentBorderClass} transition-all`}
                      />
                      <button 
                        type="button" 
                        onClick={addSkill}
                        className={`px-3 py-2 rounded-lg text-white font-bold text-xs ${accentBgClass}`}
                      >
                        Add
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-1.5 pt-1.5">
                      {seekerSkills.map(s => (
                        <span key={s} className={`text-[9px] font-medium px-2 py-0.5 rounded-full border flex items-center gap-1 ${accentBgMutedClass}`}>
                          <span>{s}</span>
                          <button type="button" onClick={() => removeSkill(s)}>
                            <X size={9} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tag input for target roles */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Target Roles</label>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        placeholder="e.g. Frontend Developer"
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRole())}
                        className={`w-full bg-black/40 border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 ${accentBorderClass} transition-all`}
                      />
                      <button 
                        type="button" 
                        onClick={addRole}
                        className={`px-3 py-2 rounded-lg text-white font-bold text-xs ${accentBgClass}`}
                      >
                        Add
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-1.5 pt-1.5">
                      {seekerTargetRoles.map(r => (
                        <span key={r} className={`text-[9px] font-medium px-2 py-0.5 rounded-full border flex items-center gap-1 ${accentBgMutedClass}`}>
                          <span>{r}</span>
                          <button type="button" onClick={() => removeRole(r)}>
                            <X size={9} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 150-Word Elevator Pitch Bio */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Elevator Pitch (150 Words max)</label>
                    <textarea 
                      value={seekerBio}
                      onChange={(e) => setSeekerBio(e.target.value)}
                      rows={3}
                      placeholder="I am a full-stack developer passionate about building scalable AI platforms..."
                      className={`w-full bg-black/40 border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 ${themeAccent === 'purple' ? 'focus:ring-purple-500' : 'focus:ring-emerald-500'} ${accentBorderClass} transition-all`}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">LinkedIn Profile URL</label>
                    <input 
                      type="url"
                      value={alumniLinkedIn}
                      onChange={(e) => setAlumniLinkedIn(e.target.value)}
                      placeholder="e.g. https://linkedin.com/in/username"
                      className={`w-full bg-black/40 border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 ${themeAccent === 'purple' ? 'focus:ring-purple-500' : 'focus:ring-emerald-500'} ${accentBorderClass} transition-all`}
                    />
                  </div>

                  {/* Alumni Professional Journey (100 words) */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Professional Journey / Background</label>
                    <textarea 
                      value={alumniBio}
                      onChange={(e) => setAlumniBio(e.target.value)}
                      rows={3}
                      placeholder="KIIT University alumnus. Currently leading cloud scaling services at Google..."
                      className={`w-full bg-black/40 border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 ${themeAccent === 'purple' ? 'focus:ring-purple-500' : 'focus:ring-emerald-500'} ${accentBorderClass} transition-all`}
                    />
                  </div>

                  {/* Preferred contact hours */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Preferred Contact Hours / Timezone</label>
                    <input 
                      type="text"
                      value={alumniHours}
                      onChange={(e) => setAlumniHours(e.target.value)}
                      placeholder="e.g. Weekends, 10:00 AM - 2:00 PM IST"
                      className={`w-full bg-black/40 border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 ${themeAccent === 'purple' ? 'focus:ring-purple-500' : 'focus:ring-emerald-500'} ${accentBorderClass} transition-all`}
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
            {step > 1 ? (
              <button 
                type="button" 
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white transition-all font-bold uppercase"
              >
                <ArrowLeft size={12} /> Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button 
                type="button" 
                onClick={() => isStepValid && setStep(step + 1)}
                disabled={!isStepValid}
                className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-3.5 py-2 rounded-lg transition-all duration-200 ${isStepValid ? (themeAccent === 'purple' ? 'bg-purple-600 text-white hover:bg-purple-500' : 'bg-emerald-600 text-white hover:bg-emerald-500') : 'bg-white/5 border border-white/10 text-slate-500 cursor-not-allowed'}`}
              >
                <span>Continue</span>
                <ArrowRight size={12} />
              </button>
            ) : (
              <button 
                type="button" 
                onClick={handleSubmit}
                disabled={!isStepValid || isSubmitting}
                className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-4 py-2 rounded-lg transition-all duration-200 ${isStepValid && !isSubmitting ? (themeAccent === 'purple' ? 'bg-purple-600 text-white hover:bg-purple-500' : 'bg-emerald-600 text-white hover:bg-emerald-500') : 'bg-white/5 border border-white/10 text-slate-500 cursor-not-allowed'}`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check size={12} />
                    <span>Complete Profile</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
