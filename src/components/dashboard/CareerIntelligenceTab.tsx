import React, { useState } from 'react';
import {
  Award,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Check,
  Sparkles,
  HelpCircle,
  UploadCloud,
  FileText
} from 'lucide-react';

interface CareerIntelligenceTabProps {
  currentUser: any;
  fetchProfile: () => Promise<void>;
}

export const CareerIntelligenceTab: React.FC<CareerIntelligenceTabProps> = ({
  currentUser,
  fetchProfile
}) => {
  const [activeCompanyTab, setActiveCompanyTab] = useState<string>('Google');
  const [completedRoadmapItems, setCompletedRoadmapItems] = useState<Record<number, boolean>>({});
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshSuccess, setRefreshSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Parse Career Intelligence Report safely
  let report: any = null;
  if (currentUser && currentUser.careerIntelligence) {
    if (typeof currentUser.careerIntelligence === 'string') {
      try {
        report = JSON.parse(currentUser.careerIntelligence);
      } catch (e) {
        console.error("Failed to parse careerIntelligence string", e);
      }
    } else {
      report = currentUser.careerIntelligence;
    }
  }

  const isResumeMissing = !currentUser?.resumeUploaded;

  // Build History list dynamically
  let historyList = currentUser?.resumesHistory || [];
  if (historyList.length === 0 && currentUser?.resumeUploaded && currentUser?.resumeName) {
    historyList = [{
      id: 'default-active',
      name: currentUser.resumeName,
      size: '150 KB',
      uploadedAt: 'Seeded Version'
    }];
  }

  // Handle Manual Trigger to Refresh Report
  const handleRefreshReport = async () => {
    setIsRefreshing(true);
    setRefreshSuccess(false);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          skills: currentUser.skills,
          projects: currentUser.projects,
          targetCompanies: currentUser.targetCompanies,
          targetRole: currentUser.targetRole
        })
      });

      if (response.ok) {
        await fetchProfile();
        setRefreshSuccess(true);
        setTimeout(() => setRefreshSuccess(false), 4000);
      } else {
        console.error("Failed to refresh report:", response.statusText);
      }
    } catch (err) {
      console.error("Error refreshing report:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle Switch Active Resume from History
  const handleSwitchActiveResume = async (fileName: string) => {
    setIsRefreshing(true);
    setUploadError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          skills: currentUser.skills,
          projects: currentUser.projects,
          targetCompanies: currentUser.targetCompanies,
          targetRole: currentUser.targetRole,
          resumeUploaded: true,
          resumeName: fileName
        })
      });

      if (!response.ok) {
        throw new Error('Failed to switch active resume');
      }

      await fetchProfile();
      setRefreshSuccess(true);
      setTimeout(() => setRefreshSuccess(false), 4000);
    } catch (err: any) {
      console.error("[AI Coach Switch Active Resume] Error:", err);
      setUploadError(err.message || 'Failed to switch active resume.');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle Resume Upload directly from the AI Coach view
  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate format
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'docx', 'doc'].includes(ext || '')) {
      setUploadError('Invalid format. Please upload PDF, DOCX, or DOC documents.');
      return;
    }

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size exceeds 5MB limit.');
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('resume', file);

      const response = await fetch('/api/users/resume/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Server resume upload failed');
      }

      await fetchProfile();
      setRefreshSuccess(true);
      setTimeout(() => setRefreshSuccess(false), 4000);
    } catch (err: any) {
      console.error("[AI Coach Resume Upload] Error:", err);
      setUploadError(err.message || 'Failed to upload and parse resume.');
    } finally {
      setIsUploading(false);
    }
  };

  // Safe Fallback if report is missing
  if (!report) {
    return (
      <div className="space-y-6 text-left animate-fade-in-up">
        <div className="p-8 rounded-2xl border border-white/5 bg-slate-950/40 backdrop-blur-md text-center max-w-xl mx-auto my-12">
          <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-purple-500/20">
            <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
          </div>
          <h3 className="font-sora text-white font-extrabold text-lg mb-2">
            AI Career Intelligence Pending
          </h3>
          <p className="text-slate-400 text-xs leading-relaxed mb-6">
            Upload your resume or complete your profile details (Skills, Projects, Target Companies, and Target Role) to generate a high-fidelity Referral Readiness report, SDE verdict, and visual career graph.
          </p>
          
          <div className="space-y-4">
            {/* Upload Area */}
            <div className="max-w-md mx-auto">
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 hover:border-purple-500/40 rounded-xl p-6 cursor-pointer bg-white/[0.01] hover:bg-purple-500/[0.02] transition group relative">
                <input 
                  type="file" 
                  accept=".pdf,.docx,.doc" 
                  onChange={handleResumeUpload}
                  className="hidden" 
                  disabled={isUploading}
                />
                <UploadCloud className="w-8 h-8 text-slate-500 group-hover:text-purple-400 transition mb-3" />
                <span className="block text-xs font-bold text-slate-355 mb-1">
                  {isUploading ? 'Uploading and AI-parsing...' : 'Upload Seeker Resume'}
                </span>
                <span className="block text-[10px] text-slate-500">PDF, DOCX, or DOC up to 5MB</span>
              </label>
              {uploadError && (
                <p className="text-[10px] text-rose-400 font-bold mt-2 text-center">{uploadError}</p>
              )}
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleRefreshReport}
                disabled={isRefreshing || isUploading}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-650 text-white hover:from-purple-500 hover:to-indigo-600 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all flex items-center justify-center gap-2"
              >
                {isRefreshing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Generating Report...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Estimate from Profile Data
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Dynamic Node Graph Calculations ---
  const graphWidth = 900;
  const graphHeight = 440;
  const nodeW = 130;
  const nodeH = 36;

  // 1. Seeker Node
  const seekerNode = {
    id: 'seeker',
    label: currentUser?.name || 'Candidate Seeker',
    type: 'seeker',
    x: 85,
    y: graphHeight / 2,
    details: {
      title: currentUser?.name || 'Candidate Seeker',
      subtitle: currentUser?.targetRole || 'Software Engineer Seeker',
      desc: currentUser?.bio || 'Preparing for referral opportunities.',
      stats: [
        { label: 'Overall Readiness', value: `${report.readinessScore}%` },
        { label: 'Skills Stored', value: `${currentUser?.skills?.length || 0}` },
        { label: 'Projects Listed', value: `${currentUser?.projects?.length || 0}` }
      ]
    }
  };

  // 2. Skills Nodes
  const activeSkills = currentUser?.skills || [];
  const skillNodes = activeSkills.map((skill: string, index: number) => {
    const spacing = graphHeight / (activeSkills.length || 1);
    const detailObj = currentUser?.skillDetails?.[skill] || { proficiency: 4, type: 'technical' };
    return {
      id: `skill_${skill}`,
      label: skill,
      type: 'skill',
      x: 290,
      y: (index + 0.5) * spacing,
      details: {
        title: `${skill} Skill`,
        subtitle: `Proficiency: ${detailObj.proficiency}/5`,
        desc: `Identified as a core ${detailObj.type || 'technical'} skill matching target opportunities.`,
        stats: [
          { label: 'Skill Type', value: detailObj.type ? detailObj.type.toUpperCase() : 'TECHNICAL' },
          { label: 'Competency', value: `${(detailObj.proficiency / 5) * 100}%` }
        ]
      }
    };
  });

  // 3. Projects Nodes
  const activeProjects = currentUser?.projects || [];
  const projectNodes = activeProjects.map((proj: any, index: number) => {
    const projName = typeof proj === 'string' ? proj : proj.name;
    const spacing = graphHeight / (activeProjects.length || 1);
    const analysis = report.projectsAnalysis?.find((p: any) => p.name.toLowerCase().includes(projName.toLowerCase())) || {
      complexity: 7,
      stack: 'N/A',
      verdict: 'Project evaluation in progress.'
    };
    return {
      id: `project_${projName}`,
      label: projName,
      type: 'project',
      x: 550,
      y: (index + 0.5) * spacing,
      details: {
        title: projName,
        subtitle: `Complexity: ${analysis.complexity}/10`,
        desc: analysis.verdict,
        stats: [
          { label: 'Stack Used', value: analysis.stack },
          { label: 'Complexity Tier', value: analysis.complexity >= 8 ? 'Advanced' : 'Intermediate' }
        ]
      }
    };
  });

  // 4. Company Nodes
  const activeCompanies = currentUser?.targetCompanies || [];
  const companyNodes = activeCompanies.map((comp: string, index: number) => {
    const spacing = graphHeight / (activeCompanies.length || 1);
    const benchmark = report.benchmarks?.[comp] || { score: 75, required: [], missing: [] };
    return {
      id: `company_${comp}`,
      label: comp,
      type: 'company',
      x: 810,
      y: (index + 0.5) * spacing,
      details: {
        title: `${comp} Alignment`,
        subtitle: `Benchmark Score: ${benchmark.score}%`,
        desc: `Required skills: ${benchmark.required?.join(', ')}. Gaps detected: ${benchmark.missing?.join(', ')}.`,
        stats: [
          { label: 'Required Count', value: `${benchmark.required?.length || 0}` },
          { label: 'Missing Gaps', value: `${benchmark.missing?.length || 0}` }
        ]
      }
    };
  });

  const allNodes = [seekerNode, ...skillNodes, ...projectNodes, ...companyNodes];

  // 5. Draw connections based on relationships
  const links: { source: string; target: string; id: string }[] = [];

  // Seeker connects to all skills
  skillNodes.forEach((sn: any) => {
    links.push({ source: 'seeker', target: sn.id, id: `seeker-${sn.id}` });
  });

  // Connect skills to projects based on text association
  projectNodes.forEach((pn: any) => {
    const pNameLower = pn.label.toLowerCase();
    const matchingAnalysis = report.projectsAnalysis?.find((p: any) => p.name.toLowerCase().includes(pNameLower)) || {};
    const stackStr = (matchingAnalysis.stack || '').toLowerCase();

    skillNodes.forEach((sn: any) => {
      const sNameLower = sn.label.toLowerCase();
      // Match react/node/python/sql keyword inside stack string or project name
      if (stackStr.includes(sNameLower) || pNameLower.includes(sNameLower)) {
        links.push({ source: sn.id, target: pn.id, id: `${sn.id}-${pn.id}` });
      }
    });
  });

  // Connect projects to companies
  projectNodes.forEach((pn: any) => {
    companyNodes.forEach((cn: any) => {
      links.push({ source: pn.id, target: cn.id, id: `${pn.id}-${cn.id}` });
    });
  });

  // Highlight connections when node is hovered/clicked
  const activeNodeId = hoveredNodeId || selectedNodeId;
  const isAnyNodeActive = !!activeNodeId;

  const isNodeConnected = (nodeId: string) => {
    if (!activeNodeId) return false;
    if (nodeId === activeNodeId) return true;
    return links.some(l => 
      (l.source === activeNodeId && l.target === nodeId) ||
      (l.target === activeNodeId && l.source === nodeId)
    );
  };

  const isLinkActive = (sourceId: string, targetId: string) => {
    if (!activeNodeId) return true; // default all active
    return sourceId === activeNodeId || targetId === activeNodeId;
  };

  const isLinkDimmed = (sourceId: string, targetId: string) => {
    if (!activeNodeId) return false;
    return sourceId !== activeNodeId && targetId !== activeNodeId;
  };

  // Bezier path helper
  const getBezierPath = (x1: number, y1: number, x2: number, y2: number) => {
    const cx = (x1 + x2) / 2;
    return `M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`;
  };

  // Get details of active node
  const activeNodeDetails = allNodes.find(n => n.id === activeNodeId)?.details || null;

  // Circular progress calculations for readiness Score Gauge
  const readinessRadius = 48;
  const readinessCircumference = 2 * Math.PI * readinessRadius; // ~301.59
  const readinessStrokeOffset = readinessCircumference - (report.readinessScore / 100) * readinessCircumference;

  return (
    <div className="space-y-6 text-left animate-fade-in-up">
      {/* HEADER WITH REFRESH */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.055] pb-4">
        <div>
          <h3 className="font-sora text-white font-extrabold text-sm uppercase tracking-wider">
            AI Profile Intelligence Report
          </h3>
          <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
            Level 1-10: Benchmarking, Project Quality, Git/LinkedIn Audits, and SDE Referability.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {refreshSuccess && (
            <span className="text-[10px] text-emerald-450 font-bold bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-md animate-pulse">
              ✓ Audit Refreshed
            </span>
          )}
          <button
            onClick={handleRefreshReport}
            disabled={isRefreshing || isUploading}
            className="px-3.5 py-1.5 rounded-lg text-[10px] font-bold bg-white/5 border border-white/10 text-slate-355 hover:bg-white/10 transition flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Regenerating...' : 'Refresh Audit'}
          </button>
        </div>
      </div>

      {/* WARNING BANNER FOR MISSING RESUME */}
      {isResumeMissing && (
        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 md:mt-0" />
            <div>
              <span className="block text-xs font-bold text-amber-300">Preliminary Estimate: Resume Pending Upload</span>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                This report is calculated based on your manual profile settings. Upload your resume PDF to unlock a complete AI audit of your resume structure, metrics impact, and high-fidelity alumni SDE-II verdict.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <label className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-amber-400/10 border border-amber-400/20 text-amber-400 hover:bg-amber-400/25 transition cursor-pointer select-none">
              <input 
                type="file" 
                accept=".pdf,.docx,.doc" 
                onChange={handleResumeUpload} 
                className="hidden" 
                disabled={isUploading}
              />
              {isUploading ? 'Uploading PDF...' : 'Upload Resume PDF'}
            </label>
          </div>
        </div>
      )}

      {/* RESUME CONTROL CENTER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 rounded-2xl border border-white/5 bg-slate-950/40 backdrop-blur-md relative overflow-hidden">
        {/* Left Side: Upload Zone */}
        <div className="lg:col-span-6 flex flex-col justify-between gap-4">
          <div>
            <span className="block text-[8.5px] font-bold text-slate-500 uppercase tracking-wider font-space-grotesk">
              Active Resume PDF
            </span>
            <div className="mt-2 p-4 rounded-xl border border-white/5 bg-black/40 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center border border-purple-500/20 text-purple-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="block text-xs font-bold text-white truncate max-w-[200px]">
                    {currentUser.resumeName || 'No resume uploaded'}
                  </span>
                  <span className="block text-[9px] text-slate-500 font-semibold mt-0.5">
                    {currentUser.resumeUploaded ? 'Active Audit Target' : 'Preliminary Profile Estimate'}
                  </span>
                </div>
              </div>
              {currentUser.resumeUploaded && (
                <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[8px] font-bold uppercase tracking-wider">
                  ACTIVE
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 hover:border-purple-500/40 rounded-xl p-5 cursor-pointer bg-white/[0.01] hover:bg-purple-500/[0.02] transition group relative">
              <input 
                type="file" 
                accept=".pdf,.docx,.doc" 
                onChange={handleResumeUpload}
                className="hidden" 
                disabled={isUploading || isRefreshing}
              />
              <UploadCloud className="w-6 h-6 text-slate-500 group-hover:text-purple-400 transition mb-2" />
              <span className="block text-[10px] font-bold text-slate-355 mb-0.5">
                {isUploading ? 'Uploading and AI-parsing...' : 'Upload New Version'}
              </span>
              <span className="block text-[8px] text-slate-500">PDF, DOCX, or DOC up to 5MB</span>
            </label>
            {uploadError && (
              <p className="text-[9px] text-rose-455 font-bold mt-2">{uploadError}</p>
            )}
          </div>
        </div>

        {/* Right Side: Version History */}
        <div className="lg:col-span-6 border-t lg:border-t-0 lg:border-l border-white/[0.055] pt-6 lg:pt-0 lg:pl-6 flex flex-col justify-between gap-4 text-left">
          <div>
            <span className="block text-[8.5px] font-bold text-slate-500 uppercase tracking-wider font-space-grotesk">
              Resume Upload History & Version Switching
            </span>
            <div className="mt-3 space-y-2 overflow-y-auto max-h-[140px] pr-1 no-scrollbar">
              {historyList.map((item: any) => {
                const isActive = currentUser.resumeUploaded && currentUser.resumeName === item.name;
                return (
                  <div 
                    key={item.id}
                    className={`flex items-center justify-between p-2.5 rounded-lg border text-left transition ${
                      isActive 
                        ? 'bg-purple-950/15 border-purple-500/30' 
                        : 'bg-white/[0.01] border-white/5 hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="min-w-0">
                      <span className="block text-[10.5px] font-bold text-white truncate max-w-[220px]">
                        {item.name}
                      </span>
                      <span className="block text-[8.5px] text-slate-500 font-semibold mt-0.5">
                        Uploaded {item.uploadedAt} · {item.size}
                      </span>
                    </div>
                    {isActive ? (
                      <span className="text-[8.5px] font-black text-purple-400 uppercase tracking-wider flex items-center gap-1">
                        ● Active
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSwitchActiveResume(item.name)}
                        disabled={isRefreshing || isUploading}
                        className="px-2.5 py-1 rounded text-[8.5px] font-bold bg-white/5 border border-white/10 text-slate-350 hover:bg-white/10 hover:text-white transition"
                      >
                        Activate
                      </button>
                    )}
                  </div>
                );
              })}
              {historyList.length === 0 && (
                <div className="text-[10px] text-slate-500 italic p-6 text-center border border-dashed border-white/5 rounded-xl">
                  No previous resumes uploaded yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* TOP ROW: SCORE GAUGE & ALUMNI REFERRAL VERDICT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SCORE GAUGE CARD (4 Cols) */}
        <div className="lg:col-span-4 p-6 rounded-2xl border border-white/5 bg-slate-950/40 backdrop-blur-md flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />
          
          <div>
            <div className="flex justify-between items-center">
              <span className="block text-[8.5px] font-bold text-slate-500 uppercase tracking-wider font-space-grotesk">
                Level 7: Composite Referral Readiness
              </span>
              {isResumeMissing && (
                <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[8px] font-bold uppercase tracking-wide">
                  Estimate
                </span>
              )}
            </div>
            <div className="flex items-center justify-center my-6">
              <div className="relative flex items-center justify-center">
                <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 110 110">
                  <circle
                    cx="55"
                    cy="55"
                    r={readinessRadius}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.02)"
                    strokeWidth="6"
                  />
                  <circle
                    cx="55"
                    cy="55"
                    r={readinessRadius}
                    fill="none"
                    stroke="url(#readiness-gradient)"
                    strokeWidth="6.5"
                    strokeDasharray={readinessCircumference}
                    strokeDashoffset={readinessStrokeOffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center select-none">
                  <span className="text-3xl font-black font-space-grotesk text-white leading-none">
                    {report.readinessScore}%
                  </span>
                  <span className="text-[8.5px] font-bold uppercase tracking-widest text-purple-400 mt-1.5">
                    {report.readinessScore >= 85 ? 'Referral Ready' : report.readinessScore >= 70 ? 'Intermediate' : 'Critical Gaps'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">Weighted Score Factors</span>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px]">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400 font-semibold">Resume Quality</span>
                  <span className={`font-bold ${isResumeMissing ? 'text-amber-400/80' : 'text-white'}`}>
                    {isResumeMissing ? 'Pending' : `${report.factors?.resumeQuality || 0}%`}
                  </span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${isResumeMissing ? 'bg-amber-450/40' : 'bg-purple-500'}`} 
                    style={{ width: `${isResumeMissing ? 0 : report.factors?.resumeQuality || 0}%` }} 
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400 font-semibold">Projects Complex</span>
                  <span className="text-white font-bold">{report.factors?.projectQuality || 0}%</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${report.factors?.projectQuality || 0}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400 font-semibold">GitHub Strength</span>
                  <span className="text-white font-bold">{report.factors?.githubActivity || 0}%</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500" style={{ width: `${report.factors?.githubActivity || 0}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400 font-semibold">Target Alignment</span>
                  <span className="text-white font-bold">{report.factors?.targetCompanyAlignment || 0}%</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${report.factors?.targetCompanyAlignment || 0}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ALUMNI REFERRAL VERDICT (8 Cols) */}
        <div className="lg:col-span-8 p-6 rounded-2xl border border-white/5 bg-slate-950/40 backdrop-blur-md flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -ml-8 -mt-8 pointer-events-none" />
          
          <div>
            <div className="flex justify-between items-start">
              <div>
                <span className="block text-[8.5px] font-bold text-slate-500 uppercase tracking-wider font-space-grotesk">
                  Level 8: Alumni SDE Referral Verdict
                </span>
                <h4 className="font-sora text-white font-extrabold text-sm mt-1">
                  Referral Audit by {report.alumniPerspective?.role || 'Google SDE-II'}
                </h4>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                report.alumniPerspective?.referral === 'YES'
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.25)] animate-pulse'
                  : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
              }`}>
                {report.alumniPerspective?.referral === 'YES' ? '✔ WOULD REFER' : '❌ PENDING REPAIRS'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Reasons */}
              <div className="space-y-3">
                <span className="block text-[9.5px] font-extrabold text-emerald-400/80 uppercase tracking-widest font-space-grotesk flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Key Strengths
                </span>
                <ul className="space-y-2">
                  {report.alumniPerspective?.reasons?.map((reason: string, i: number) => (
                    <li key={i} className="flex gap-2 text-[10px] text-slate-300 font-medium leading-relaxed">
                      <span className="text-emerald-500 mt-0.5 shrink-0">✦</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                  {(!report.alumniPerspective?.reasons || report.alumniPerspective.reasons.length === 0) && (
                    <li className="text-[10px] text-slate-500 italic">No direct referral reasons noted.</li>
                  )}
                </ul>
              </div>

              {/* Concerns */}
              <div className="space-y-3">
                <span className="block text-[9.5px] font-extrabold text-amber-400/80 uppercase tracking-widest font-space-grotesk flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Referral Concerns
                </span>
                <ul className="space-y-2">
                  {report.alumniPerspective?.concerns?.map((concern: string, i: number) => (
                    <li key={i} className="flex gap-2 text-[10px] text-slate-355 font-medium leading-relaxed">
                      <span className="text-amber-500 mt-0.5 shrink-0">⚠</span>
                      <span>{concern}</span>
                    </li>
                  ))}
                  {(!report.alumniPerspective?.concerns || report.alumniPerspective.concerns.length === 0) && (
                    <li className="text-[10px] text-emerald-400 italic">No critical referral concerns reported!</li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Outcome Prediction (Level 9) */}
          <div className="border-t border-white/[0.055] pt-5 mt-6 grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[9.5px] font-bold text-slate-400 font-space-grotesk flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-purple-400" />
                  Interview Response Probability
                </span>
                <span className="text-xs font-black text-purple-400 font-mono">
                  {report.successPrediction?.interviewProb || 0}%
                </span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500" 
                  style={{ width: `${report.successPrediction?.interviewProb || 0}%` }} 
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[9.5px] font-bold text-slate-400 font-space-grotesk flex items-center gap-1">
                  <Award className="w-3 h-3 text-blue-450" />
                  Offer Success Probability
                </span>
                <span className="text-xs font-black text-blue-455 font-mono">
                  {report.successPrediction?.offerProb || 0}%
                </span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500" 
                  style={{ width: `${report.successPrediction?.offerProb || 0}%` }} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DEDICATED FULL-WIDTH CAREER connections MAP */}
      <div className="p-6 rounded-2xl border border-white/5 bg-slate-950/40 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl -ml-8 -mt-8 pointer-events-none" />
        
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="block text-[8.5px] font-bold text-slate-500 uppercase tracking-wider font-space-grotesk">
              Level 2: AI Career Connections Map
            </span>
            <span className="block text-[9.5px] text-slate-400 font-medium">
              Hover or click on any node below to inspect trajectories from Seeker &rarr; Skills &rarr; Projects &rarr; Target Companies.
            </span>
          </div>
          {activeNodeId && (
            <button 
              onClick={() => { setSelectedNodeId(null); setHoveredNodeId(null); }}
              className="text-[10px] font-bold text-purple-400 hover:text-purple-300 bg-purple-500/10 px-3 py-1 rounded-lg border border-purple-500/20"
            >
              Clear Focus
            </button>
          )}
        </div>

        {/* Scrollable Container for aspect stability on all screens */}
        <div className="border border-white/5 bg-slate-950/50 rounded-xl overflow-x-auto no-scrollbar relative min-h-[460px]">
          <div className="min-w-[900px] h-[450px] relative mx-auto flex items-center justify-center">
            {/* SVG Interactive Canvas */}
            <svg 
              className="w-full h-full" 
              viewBox={`0 0 ${graphWidth} ${graphHeight}`}
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id="readiness-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
                <linearGradient id="active-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#c084fc" />
                  <stop offset="100%" stopColor="#60a5fa" />
                </linearGradient>
                <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Draw connection paths */}
              {links.map((link) => {
                const sourceNode = allNodes.find(n => n.id === link.source);
                const targetNode = allNodes.find(n => n.id === link.target);
                if (!sourceNode || !targetNode) return null;

                const isActive = isLinkActive(link.source, link.target);
                const isDimmed = isLinkDimmed(link.source, link.target);

                const pathData = getBezierPath(sourceNode.x, sourceNode.y, targetNode.x, targetNode.y);

                return (
                  <g key={link.id}>
                    <path
                      d={pathData}
                      fill="none"
                      stroke={
                        isDimmed 
                          ? 'rgba(255, 255, 255, 0.015)' 
                          : isActive && isAnyNodeActive 
                          ? 'url(#active-gradient)' 
                          : 'rgba(147, 51, 234, 0.15)'
                      }
                      strokeWidth={isActive && isAnyNodeActive ? 2.5 : 1.25}
                      className="transition-all duration-300"
                      style={isActive && isAnyNodeActive ? { filter: 'url(#glow-filter)' } : {}}
                    />
                    {/* Glowing flow animation particles */}
                    {isActive && (
                      <circle r="2.5" fill="#a855f7" style={{ filter: 'drop-shadow(0 0 3px #c084fc)' }}>
                        <animateMotion dur="3s" repeatCount="indefinite" path={pathData} />
                      </circle>
                    )}
                  </g>
                );
              })}

              {/* Render Nodes using foreignObject for Tailwind styling */}
              {allNodes.map((node) => {
                const isActive = isNodeConnected(node.id) || node.id === activeNodeId;
                const isDimmed = isAnyNodeActive && !isActive;

                return (
                  <foreignObject
                    key={node.id}
                    x={node.x - (nodeW / 2)}
                    y={node.y - (nodeH / 2)}
                    width={nodeW}
                    height={nodeH}
                    className="overflow-visible"
                  >
                    <div
                      onClick={() => setSelectedNodeId(selectedNodeId === node.id ? null : node.id)}
                      onMouseEnter={() => setHoveredNodeId(node.id)}
                      onMouseLeave={() => setHoveredNodeId(null)}
                      className={`cursor-pointer w-full h-full flex items-center justify-center text-center px-3 rounded-xl border text-[10px] font-bold transition-all duration-300 select-none ${
                        node.id === activeNodeId
                          ? 'bg-purple-500/25 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] scale-105'
                          : isActive
                          ? 'bg-purple-950/20 border-purple-500/50 text-purple-200 shadow-[0_0_8px_rgba(168,85,247,0.15)]'
                          : isDimmed
                          ? 'bg-slate-900/10 border-white/5 text-slate-600 opacity-25 scale-95'
                          : node.type === 'seeker'
                          ? 'bg-gradient-to-br from-purple-500/15 to-indigo-500/5 border-purple-500/30 text-purple-300'
                          : node.type === 'skill'
                          ? 'bg-blue-500/5 border-blue-500/20 text-blue-400 hover:border-blue-400/40'
                          : node.type === 'project'
                          ? 'bg-cyan-500/5 border-cyan-500/20 text-cyan-400 hover:border-cyan-400/40'
                          : node.type === 'company'
                          ? 'bg-amber-500/5 border-amber-500/20 text-amber-400 hover:border-amber-400/40'
                          : 'bg-slate-900/40 border-white/5 text-slate-400'
                      }`}
                    >
                      <span className="truncate">{node.label}</span>
                    </div>
                  </foreignObject>
                );
              })}
            </svg>
          </div>

          {/* Details inspector overlay */}
          <div className="absolute bottom-3 left-3 right-3 p-3 bg-black/75 backdrop-blur-md rounded-xl border border-white/10 text-[9.5px] text-slate-450 min-h-[50px] flex items-center">
            {activeNodeDetails ? (
              <div className="w-full flex justify-between items-center gap-4">
                <div className="min-w-0 flex-1">
                  <span className="block font-bold text-white text-xs font-space-grotesk">{activeNodeDetails.title}</span>
                  <span className="block text-[8.5px] text-purple-400 font-semibold">{activeNodeDetails.subtitle}</span>
                  <span className="block leading-relaxed truncate max-w-[550px] mt-0.5">{activeNodeDetails.desc}</span>
                </div>
                <div className="flex gap-6 shrink-0 border-l border-white/10 pl-6 items-center">
                  {activeNodeDetails.stats.map((st: any, i: number) => (
                    <div key={i} className="text-right">
                      <span className="block text-[7.5px] font-bold text-slate-500 uppercase">{st.label}</span>
                      <span className="block text-[10px] font-black text-white">{st.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 mx-auto font-semibold text-slate-400">
                <HelpCircle className="w-4 h-4 text-purple-400" />
                Select or hover over any node in the map to audit career trajectories, skill details, project veridicton, or target alignment gaps.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* GRID ROW: PROJECT EVALUATION & PROFILE AUDITS */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* PROJECT QUALITY EVALUATOR (6 Cols) */}
        <div className="xl:col-span-6 p-6 rounded-2xl border border-white/5 bg-slate-950/40 backdrop-blur-md flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl -ml-8 -mt-8 pointer-events-none" />

          <div>
            <span className="block text-[8.5px] font-bold text-slate-500 uppercase tracking-wider font-space-grotesk">
              Level 4: Project Quality Evaluator
            </span>
            <h4 className="font-sora text-white font-extrabold text-sm mt-1">
              Project Architecture & Complexity Auditing
            </h4>

            <div className="space-y-4 mt-5">
              {report.projectsAnalysis?.map((proj: any, idx: number) => (
                <div 
                  key={idx} 
                  className="p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] hover:border-white/10 transition"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="block text-xs font-bold text-white">{proj.name}</span>
                      <span className="text-[8.5px] font-bold text-purple-400 font-mono mt-0.5 block">{proj.stack}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[8.5px] font-bold text-slate-500 uppercase tracking-widest block">Complexity</span>
                      <span className="text-xs font-black text-cyan-400 font-mono">{proj.complexity}/10</span>
                    </div>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden mb-3">
                    <div className="h-full bg-cyan-500" style={{ width: `${proj.complexity * 10}%` }} />
                  </div>
                  <p className="text-[9.5px] text-slate-400 leading-relaxed font-semibold">
                    {proj.verdict}
                  </p>
                </div>
              ))}
              {(!report.projectsAnalysis || report.projectsAnalysis.length === 0) && (
                <div className="text-[10px] text-slate-500 italic p-4 text-center border border-dashed border-white/5 rounded-xl">
                  No projects evaluated yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* PROFILE AUDITS: GITHUB & LINKEDIN (6 Cols) */}
        <div className="xl:col-span-6 p-6 rounded-2xl border border-white/5 bg-slate-950/40 backdrop-blur-md flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />

          <div className="space-y-6">
            <div>
              <span className="block text-[8.5px] font-bold text-slate-500 uppercase tracking-wider font-space-grotesk">
                Level 5 & 6: Codebase & LinkedIn Profile Audits
              </span>
              <h4 className="font-sora text-white font-extrabold text-sm mt-1">
                Outreach Channel Quality Metrics
              </h4>
            </div>

            {/* GITHUB AUDIT CARD */}
            <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01]">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-extrabold text-white flex items-center gap-1.5 font-space-grotesk">
                  {/* GitHub Inline SVG */}
                  <svg className="w-4 h-4 text-slate-350" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg>
                  GitHub Repository Audit
                </span>
                <span className="text-xs font-black text-purple-400 font-mono">
                  {report.githubStrength?.score || 0}% Strength
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-[9.5px] mt-2">
                <div className="space-y-1.5">
                  <span className="block text-[8.5px] font-bold text-emerald-400/80 uppercase">Strong Areas</span>
                  <div className="flex flex-wrap gap-1">
                    {report.githubStrength?.strong?.map((st: string, i: number) => (
                      <span key={i} className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        {st}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <span className="block text-[8.5px] font-bold text-amber-400/80 uppercase">Gaps Detected</span>
                  <div className="flex flex-wrap gap-1">
                    {report.githubStrength?.weak?.map((wk: string, i: number) => (
                      <span key={i} className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400">
                        {wk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* LINKEDIN AUDIT CARD */}
            <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01]">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-extrabold text-white flex items-center gap-1.5 font-space-grotesk">
                  {/* LinkedIn Inline SVG */}
                  <svg className="w-4 h-4 text-blue-450" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  LinkedIn Outreach Audit
                </span>
                <span className="text-xs font-black text-blue-400 font-mono">
                  {report.linkedinStrength?.score || 0}% Completeness
                </span>
              </div>
              <div className="space-y-2 mt-2">
                <span className="block text-[8.5px] font-bold text-slate-500 uppercase tracking-wider">
                  Missing High-Value Profile Sections
                </span>
                <ul className="space-y-1.5">
                  {report.linkedinStrength?.missing?.map((miss: string, i: number) => (
                    <li key={i} className="flex gap-2 text-[9.5px] text-slate-350 font-medium">
                      <span className="text-rose-500 shrink-0">○</span>
                      <span>{miss}</span>
                    </li>
                  ))}
                  {(!report.linkedinStrength?.missing || report.linkedinStrength.missing.length === 0) && (
                    <li className="text-[9.5px] text-emerald-400 font-bold italic flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      All core sections completed.
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ROADMAP & INDUSTRY BENCHMARKING ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ROADMAP CARD (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl border border-white/5 bg-slate-950/40 backdrop-blur-md flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />

          <div>
            <span className="block text-[8.5px] font-bold text-slate-500 uppercase tracking-wider font-space-grotesk">
              Level 10: AI Coach Action Roadmap
            </span>
            <h4 className="font-sora text-white font-extrabold text-sm mt-1">
              Personalized Development Path
            </h4>
            
            <div className="space-y-2 mt-5">
              {report.roadmap?.map((step: string, index: number) => {
                const isCompleted = !!completedRoadmapItems[index];
                return (
                  <button
                    key={index}
                    onClick={() => setCompletedRoadmapItems({ ...completedRoadmapItems, [index]: !isCompleted })}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                      isCompleted 
                        ? 'bg-purple-950/10 border-purple-500/20 text-slate-500' 
                        : 'bg-white/[0.01] border-white/5 text-slate-200 hover:bg-white/[0.02] hover:border-white/10'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                      isCompleted 
                        ? 'bg-purple-500 border-purple-400 text-white' 
                        : 'border-white/20 text-transparent'
                    }`}>
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span className={`text-[10px] font-semibold leading-relaxed ${isCompleted ? 'line-through' : ''}`}>
                      {step}
                    </span>
                  </button>
                );
              })}
              {(!report.roadmap || report.roadmap.length === 0) && (
                <div className="text-[10px] text-slate-500 italic p-4 text-center border border-dashed border-white/5 rounded-xl">
                  No explicit action roadmap defined yet. Keep completing profile sections!
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-white/[0.055] pt-4 mt-6 flex justify-between items-center text-[10px]">
            <span className="text-slate-500 font-semibold uppercase tracking-wider">
              Roadmap Progress
            </span>
            <span className="font-mono text-purple-400 font-black">
              {Object.values(completedRoadmapItems).filter(Boolean).length} / {report.roadmap?.length || 0} Solved
            </span>
          </div>
        </div>

        {/* COMPANY BENCHMARK SLIDES (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl border border-white/5 bg-slate-950/40 backdrop-blur-md relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -translate-x-1/2 -mt-32 pointer-events-none" />

          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/[0.055] pb-4">
              <div>
                <span className="block text-[8.5px] font-bold text-slate-500 uppercase tracking-wider font-space-grotesk">
                  Level 3: Industry Benchmarking
                </span>
                <h4 className="font-sora text-white font-extrabold text-sm mt-0.5">
                  Score Alignments for Target Companies
                </h4>
              </div>
              <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 shrink-0">
                {Object.keys(report.benchmarks || {}).map((company) => {
                  const isActive = activeCompanyTab === company;
                  return (
                    <button
                      key={company}
                      onClick={() => setActiveCompanyTab(company)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition ${
                        isActive
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'text-slate-500 hover:text-slate-355 border border-transparent'
                      }`}
                    >
                      {company}
                    </button>
                  );
                })}
              </div>
            </div>

            {(() => {
              const benchmark = report.benchmarks?.[activeCompanyTab];
              if (!benchmark) {
                return (
                  <div className="py-8 text-center text-slate-500 text-[10px] italic">
                    No alignment profile defined for "{activeCompanyTab}".
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-6 items-center text-left">
                  {/* Score circle */}
                  <div className="md:col-span-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/[0.055] pb-6 md:pb-0">
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="6" />
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="42" 
                          fill="none" 
                          stroke={
                            benchmark.score >= 80 
                              ? '#10b981' 
                              : benchmark.score >= 65 
                              ? '#a855f7' 
                              : '#f43f5e'
                          } 
                          strokeWidth="6" 
                          strokeDasharray="263.89" 
                          strokeDashoffset={263.89 - (benchmark.score / 100) * 263.89}
                          strokeLinecap="round" 
                          className="transition-all duration-750"
                        />
                      </svg>
                      <div className="flex flex-col items-center select-none">
                        <span className="text-xl font-black text-white leading-none">{benchmark.score}%</span>
                        <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest mt-1">Fit Score</span>
                      </div>
                    </div>
                    <span className="text-[9.5px] text-slate-400 font-bold mt-3 font-space-grotesk text-center">
                      Target Company Readiness
                    </span>
                  </div>

                  {/* Requirements & Missing Gaps checklists */}
                  <div className="md:col-span-8 space-y-4">
                    {/* Required Profile criteria */}
                    <div className="space-y-2">
                      <span className="block text-[8.5px] font-extrabold text-slate-500 uppercase tracking-widest font-space-grotesk">
                        Benchmark Core Standards
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {benchmark.required?.map((req: string, i: number) => {
                          const isAcquired = !benchmark.missing?.some((m: string) => m.toLowerCase().includes(req.toLowerCase()));
                          return (
                            <span 
                              key={i} 
                              className={`px-2 py-1 rounded text-[8.5px] font-black uppercase tracking-wider ${
                                isAcquired 
                                  ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                                  : 'bg-white/5 border border-white/10 text-slate-500'
                              }`}
                            >
                              {isAcquired ? '✔' : '○'} {req}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* Gaps detected */}
                    <div className="space-y-1.5">
                      <span className="block text-[8.5px] font-extrabold text-slate-500 uppercase tracking-widest font-space-grotesk">
                        Detected Gaps to Fix
                      </span>
                      <ul className="space-y-1">
                        {benchmark.missing?.map((miss: string, i: number) => (
                          <li key={i} className="flex gap-2 text-[9.5px] text-slate-350 font-medium">
                            <span className="text-rose-550 shrink-0">●</span>
                            <span>{miss}</span>
                          </li>
                        ))}
                        {(!benchmark.missing || benchmark.missing.length === 0) && (
                          <li className="text-[9.5px] text-emerald-400 font-bold italic flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            No missing gaps detected!
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};
