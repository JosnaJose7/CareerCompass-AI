import React, { useState } from 'react';
import { 
  User as UserIcon,
  GraduationCap, 
  BookOpen, 
  Award, 
  FolderPlus, 
  Sparkles, 
  Plus, 
  Trash2, 
  Check, 
  Briefcase, 
  Layers,
  Target,
  Code,
  Globe,
  Trophy,
  ChevronDown,
  ChevronUp,
  Building,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Zap,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { StudentProfile, Project, Internship, Hackathon, CareerRecommendation, SkillGapAnalysisResult } from '../types';
import { sampleProfiles } from '../data/sampleProfiles';
import { BackButton } from './BackButton';
import { FirebaseUser } from '../lib/firebase';

interface ProfileBuilderProps {
  profile: StudentProfile;
  setProfile: React.Dispatch<React.SetStateAction<StudentProfile>>;
  onSaveProfile: () => void;
  onGenerateRecommendations: () => void;
  isSaving: boolean;
  isGenerating: boolean;
  topRecommendation?: CareerRecommendation;
  skillGapAnalysis?: SkillGapAnalysisResult | null;
  user?: FirebaseUser | null;
  onOpenAuth?: () => void;
  onSignOut?: () => void;
  onOpenSettings?: () => void;
  onNavigateToTab?: (tab: string) => void;
  onBack?: () => void;
}

const POPULAR_SKILLS = [
  "Python", "TypeScript", "React", "SQL", "Node.js", "Docker", "PyTorch", 
  "AWS", "Git", "Machine Learning", "Data Structures", "Tailwind CSS", "REST APIs"
];

const POPULAR_LANGUAGES = [
  "Python", "TypeScript", "JavaScript", "C++", "Java", "SQL", "Go", "Rust"
];

const POPULAR_FRAMEWORKS = [
  "React", "Next.js", "Node.js", "Express.js", "PyTorch", "TensorFlow", "Tailwind CSS", "FastAPI"
];

export const ProfileBuilder: React.FC<ProfileBuilderProps> = ({
  profile,
  setProfile,
  onSaveProfile,
  onGenerateRecommendations,
  isSaving,
  isGenerating,
  topRecommendation,
  onBack,
}) => {
  // Active Accordion / Section tab: 'academic' | 'technical' | 'experience' | 'credentials' | 'direction'
  const [activeSection, setActiveSection] = useState<string>('academic');

  // Input states
  const [newSkill, setNewSkill] = useState('');
  const [newLang, setNewLang] = useState('');
  const [newFramework, setNewFramework] = useState('');
  const [newCert, setNewCert] = useState('');
  const [newAchievement, setNewAchievement] = useState('');

  // Project Form State
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectTech, setProjectTech] = useState('');
  const [projectLink, setProjectLink] = useState('');

  // Internship Form State
  const [internCompany, setInternCompany] = useState('');
  const [internRole, setInternRole] = useState('');
  const [internDuration, setInternDuration] = useState('');
  const [internDesc, setInternDesc] = useState('');

  // Hackathon Form State
  const [hackName, setHackName] = useState('');
  const [hackAward, setHackAward] = useState('');
  const [hackYear, setHackYear] = useState('');

  // Skill Add / Remove
  const handleAddSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !profile.skills.includes(trimmed)) {
      setProfile(prev => ({ ...prev, skills: [...prev.skills, trimmed] }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setProfile(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  // Language Add / Remove
  const handleAddLanguage = (lang: string) => {
    const trimmed = lang.trim();
    const cur = profile.programmingLanguages || [];
    if (trimmed && !cur.includes(trimmed)) {
      setProfile(prev => ({ ...prev, programmingLanguages: [...cur, trimmed] }));
      setNewLang('');
    }
  };

  const handleRemoveLanguage = (lang: string) => {
    setProfile(prev => ({
      ...prev,
      programmingLanguages: (prev.programmingLanguages || []).filter(l => l !== lang)
    }));
  };

  // Framework Add / Remove
  const handleAddFramework = (fw: string) => {
    const trimmed = fw.trim();
    const cur = profile.frameworks || [];
    if (trimmed && !cur.includes(trimmed)) {
      setProfile(prev => ({ ...prev, frameworks: [...cur, trimmed] }));
      setNewFramework('');
    }
  };

  const handleRemoveFramework = (fw: string) => {
    setProfile(prev => ({
      ...prev,
      frameworks: (prev.frameworks || []).filter(f => f !== fw)
    }));
  };

  // Add Project
  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle.trim() || !projectDesc.trim()) return;
    const newP: Project = {
      id: Date.now().toString(),
      title: projectTitle.trim(),
      description: projectDesc.trim(),
      technologies: projectTech ? projectTech.split(',').map(t => t.trim()).filter(Boolean) : [],
      link: projectLink.trim() || undefined
    };
    setProfile(prev => ({ ...prev, projects: [...prev.projects, newP] }));
    setProjectTitle('');
    setProjectDesc('');
    setProjectTech('');
    setProjectLink('');
  };

  const handleRemoveProject = (id: string) => {
    setProfile(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) }));
  };

  // Add Internship
  const handleAddInternship = (e: React.FormEvent) => {
    e.preventDefault();
    if (!internCompany.trim() || !internRole.trim()) return;
    const newI: Internship = {
      id: Date.now().toString(),
      company: internCompany.trim(),
      role: internRole.trim(),
      duration: internDuration.trim() || 'Summer 2025',
      description: internDesc.trim()
    };
    const current = profile.internships || [];
    setProfile(prev => ({ ...prev, internships: [...current, newI] }));
    setInternCompany('');
    setInternRole('');
    setInternDuration('');
    setInternDesc('');
  };

  const handleRemoveInternship = (id: string) => {
    setProfile(prev => ({
      ...prev,
      internships: (prev.internships || []).filter(i => i.id !== id)
    }));
  };

  // Add Hackathon
  const handleAddHackathon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hackName.trim()) return;
    const newH: Hackathon = {
      id: Date.now().toString(),
      name: hackName.trim(),
      award: hackAward.trim() || 'Participant',
      year: hackYear.trim() || '2025'
    };
    const current = profile.hackathons || [];
    setProfile(prev => ({ ...prev, hackathons: [...current, newH] }));
    setHackName('');
    setHackAward('');
    setHackYear('');
  };

  const handleRemoveHackathon = (id: string) => {
    setProfile(prev => ({
      ...prev,
      hackathons: (prev.hackathons || []).filter(h => h.id !== id)
    }));
  };

  // Add Certification
  const handleAddCert = () => {
    if (!newCert.trim()) return;
    const cur = profile.certifications || [];
    if (!cur.includes(newCert.trim())) {
      setProfile(prev => ({ ...prev, certifications: [...cur, newCert.trim()] }));
      setNewCert('');
    }
  };

  const handleRemoveCert = (cert: string) => {
    setProfile(prev => ({
      ...prev,
      certifications: (prev.certifications || []).filter(c => c !== cert)
    }));
  };

  // Add Achievement
  const handleAddAchievement = () => {
    if (!newAchievement.trim()) return;
    const cur = profile.achievements || [];
    if (!cur.includes(newAchievement.trim())) {
      setProfile(prev => ({ ...prev, achievements: [...cur, newAchievement.trim()] }));
      setNewAchievement('');
    }
  };

  const handleRemoveAchievement = (ach: string) => {
    setProfile(prev => ({
      ...prev,
      achievements: (prev.achievements || []).filter(a => a !== ach)
    }));
  };

  // Calculate completion percentage
  let score = 0;
  if (profile.major) score += 20;
  if (profile.skills && profile.skills.length > 0) score += 20;
  if (profile.projects && profile.projects.length > 0) score += 20;
  if (profile.careerGoals) score += 20;
  if ((profile.certifications && profile.certifications.length > 0) || (profile.internships && profile.internships.length > 0)) score += 20;
  const completionPct = Math.min(100, score);

  const sections = [
    { id: 'academic', title: '1. Academic Foundation', icon: GraduationCap, summary: `${profile.major || 'Major'}, ${profile.university || 'University'}` },
    { id: 'technical', title: '2. Technical Competencies', icon: Code, summary: `${profile.skills?.length || 0} skills & languages` },
    { id: 'experience', title: '3. Experience & Projects', icon: Briefcase, summary: `${profile.projects?.length || 0} projects, ${profile.internships?.length || 0} internships` },
    { id: 'credentials', title: '4. Credentials & Awards', icon: Award, summary: `${profile.certifications?.length || 0} certs, ${profile.achievements?.length || 0} achievements` },
    { id: 'direction', title: '5. Career Direction', icon: Target, summary: profile.careerGoals ? 'Goals Defined' : 'Set Targets' },
  ];

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div className="flex items-center gap-3">
          {onBack && <BackButton onClick={onBack} />}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Career Identity
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              11-dimensional student evaluation matrix & technical portfolio.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              const sample = sampleProfiles[0];
              if (sample) setProfile({ ...profile, ...sample });
            }}
            className="px-3 py-1.5 rounded-lg border border-white/[0.10] bg-white/[0.04] text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer"
          >
            Load Sample Profile
          </button>

          <button
            type="button"
            onClick={onSaveProfile}
            disabled={isSaving}
            className="px-3.5 py-1.5 rounded-lg border border-white/[0.12] bg-[#141724] hover:bg-[#1E2336] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isSaving ? 'Saving...' : 'Save Profile'}</span>
          </button>

          <button
            type="button"
            onClick={onGenerateRecommendations}
            disabled={isGenerating}
            className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isGenerating ? 'Analyzing...' : 'Generate Recommendations'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. DIGITAL CAREER IDENTITY CARD (Hero Identity Component) */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-2xl bg-[#131724] border border-white/[0.08] relative overflow-hidden shadow-sm space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          {/* Student Portrait & Primary Info */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold text-2xl shrink-0">
              {profile.university ? profile.university.charAt(0) : 'S'}
            </div>
            
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  {profile.major || 'Computer Science Candidate'}
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/[0.06] text-slate-300 border border-white/[0.10]">
                  Class of {profile.gradYear || '2026'}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  GPA: {profile.gpa || '3.80'}
                </span>
              </div>

              <div className="text-xs text-slate-300 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span>{profile.university || 'Stanford University'}</span>
                <span>&bull;</span>
                <span className="text-indigo-400">{profile.workPreference || 'Hybrid'}</span>
              </div>

              <p className="text-xs text-slate-400 max-w-xl line-clamp-2 pt-0.5">
                {profile.careerGoals || 'Aspiring Full-Stack Software Engineer & Distributed Systems Developer.'}
              </p>
            </div>
          </div>

          {/* Readiness & Completion Quick Gauges */}
          <div className="flex items-center gap-4 shrink-0 border-t md:border-t-0 md:border-l border-white/[0.08] pt-4 md:pt-0 md:pl-6">
            <div className="text-center">
              <div className="text-2xl font-extrabold text-white font-mono leading-none">{completionPct}%</div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-1">Profile Health</div>
            </div>

            <div className="h-8 w-px bg-white/[0.08]" />

            <div className="text-center">
              <div className="text-2xl font-extrabold text-indigo-400 font-mono leading-none">78</div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-1">Readiness Index</div>
            </div>
          </div>
        </div>

        {/* Selected Highlight Tags */}
        <div className="pt-4 border-t border-white/[0.06] flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Verified Stack:</span>
          {profile.skills.slice(0, 8).map((skill, sIdx) => (
            <span key={sIdx} className="px-2 py-0.5 rounded text-xs font-medium bg-[#0E111B] text-slate-200 border border-white/[0.08]">
              {skill}
            </span>
          ))}
          {profile.skills.length > 8 && (
            <span className="text-xs text-slate-400">+{profile.skills.length - 8} more</span>
          )}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. PROGRESSIVE DISCLOSURE SECTIONS (5 Steps) */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        {sections.map((sec) => {
          const Icon = sec.icon;
          const isOpen = activeSection === sec.id;
          return (
            <div 
              key={sec.id}
              className={`rounded-xl bg-[#131724] border transition-all ${
                isOpen ? 'border-indigo-500/40 shadow-sm' : 'border-white/[0.08] hover:border-white/[0.14]'
              }`}
            >
              {/* Accordion Header */}
              <button
                type="button"
                onClick={() => setActiveSection(isOpen ? '' : sec.id)}
                className="w-full p-4 flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                    isOpen ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-white/[0.04] text-slate-400 border border-white/[0.08]'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">{sec.title}</h3>
                    <p className="text-[11px] text-slate-400">{sec.summary}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <span className="text-xs font-medium">{isOpen ? 'Collapse' : 'Edit'}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Accordion Body */}
              {isOpen && (
                <div className="p-5 border-t border-white/[0.06] space-y-6 text-xs animate-in fade-in duration-150">
                  
                  {/* SECTION 1: ACADEMIC */}
                  {sec.id === 'academic' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">University / College</label>
                        <input
                          type="text"
                          value={profile.university}
                          onChange={e => setProfile({ ...profile, university: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#0F121C] border border-white/[0.12] text-white text-xs"
                          placeholder="e.g. Stanford University"
                        />
                      </div>

                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Major / Field of Study</label>
                        <input
                          type="text"
                          value={profile.major}
                          onChange={e => setProfile({ ...profile, major: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#0F121C] border border-white/[0.12] text-white text-xs"
                          placeholder="e.g. Computer Science"
                        />
                      </div>

                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Expected Graduation Year</label>
                        <input
                          type="text"
                          value={profile.gradYear}
                          onChange={e => setProfile({ ...profile, gradYear: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#0F121C] border border-white/[0.12] text-white text-xs"
                          placeholder="e.g. 2026"
                        />
                      </div>

                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">CGPA / GPA (4.0 Scale)</label>
                        <input
                          type="text"
                          value={profile.gpa}
                          onChange={e => setProfile({ ...profile, gpa: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#0F121C] border border-white/[0.12] text-white text-xs"
                          placeholder="e.g. 3.85"
                        />
                      </div>
                    </div>
                  )}

                  {/* SECTION 2: TECHNICAL */}
                  {sec.id === 'technical' && (
                    <div className="space-y-5">
                      {/* Skills List */}
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Core Technical Skills</label>
                        <div className="flex flex-wrap gap-1.5">
                          {profile.skills.map((s, idx) => (
                            <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#0E111B] text-slate-200 border border-white/[0.08]">
                              <span>{s}</span>
                              <button onClick={() => handleRemoveSkill(s)} className="text-slate-400 hover:text-rose-400">
                                &times;
                              </button>
                            </span>
                          ))}
                        </div>

                        <div className="flex gap-2 pt-1">
                          <input
                            type="text"
                            value={newSkill}
                            onChange={e => setNewSkill(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddSkill(newSkill))}
                            placeholder="Type skill & press Enter (e.g. Docker, PyTorch)"
                            className="flex-1 px-3 py-2 rounded-lg bg-[#0F121C] border border-white/[0.12] text-white text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddSkill(newSkill)}
                            className="px-3.5 py-2 rounded-lg bg-indigo-600 text-white font-semibold"
                          >
                            Add
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          <span className="text-[10px] text-slate-400 mr-1">Quick Add:</span>
                          {POPULAR_SKILLS.filter(s => !profile.skills.includes(s)).slice(0, 6).map(s => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => handleAddSkill(s)}
                              className="px-2 py-0.5 rounded text-[10px] bg-white/[0.04] text-slate-300 border border-white/[0.08] hover:border-indigo-400"
                            >
                              + {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SECTION 3: EXPERIENCE */}
                  {sec.id === 'experience' && (
                    <div className="space-y-6">
                      
                      {/* Projects List */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Real-World Projects ({profile.projects.length})</label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {profile.projects.map(p => (
                            <div key={p.id} className="p-3 rounded-lg bg-[#0E111B] border border-white/[0.08] space-y-1.5 relative group">
                              <div className="flex items-center justify-between">
                                <h4 className="font-bold text-white">{p.title}</h4>
                                <button onClick={() => handleRemoveProject(p.id)} className="text-slate-500 hover:text-rose-400">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <p className="text-slate-400 text-[11px]">{p.description}</p>
                              {p.technologies && p.technologies.length > 0 && (
                                <div className="flex flex-wrap gap-1 pt-1">
                                  {p.technologies.map((t, tidx) => (
                                    <span key={tidx} className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.06] text-slate-300">
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Add Project Sub-form */}
                        <div className="p-3.5 rounded-lg bg-[#0E111B] border border-white/[0.06] space-y-3">
                          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">+ Add New Project</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <input
                              type="text"
                              value={projectTitle}
                              onChange={e => setProjectTitle(e.target.value)}
                              placeholder="Project Title"
                              className="px-3 py-1.5 rounded-lg bg-[#141724] border border-white/[0.12] text-white text-xs"
                            />
                            <input
                              type="text"
                              value={projectTech}
                              onChange={e => setProjectTech(e.target.value)}
                              placeholder="Technologies (comma separated)"
                              className="px-3 py-1.5 rounded-lg bg-[#141724] border border-white/[0.12] text-white text-xs"
                            />
                          </div>
                          <textarea
                            value={projectDesc}
                            onChange={e => setProjectDesc(e.target.value)}
                            placeholder="What problem did you solve and what was the quantifiable impact?"
                            rows={2}
                            className="w-full px-3 py-1.5 rounded-lg bg-[#141724] border border-white/[0.12] text-white text-xs"
                          />
                          <button
                            type="button"
                            onClick={handleAddProject}
                            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold text-xs"
                          >
                            Save Project
                          </button>
                        </div>
                      </div>

                      {/* Internships List */}
                      <div className="space-y-3 pt-3 border-t border-white/[0.06]">
                        <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Internships & Work History</label>
                        {profile.internships && profile.internships.length > 0 && (
                          <div className="space-y-2">
                            {profile.internships.map(i => (
                              <div key={i.id} className="p-3 rounded-lg bg-[#0E111B] border border-white/[0.08] flex items-start justify-between">
                                <div>
                                  <h4 className="font-bold text-white">{i.role} &bull; <span className="text-indigo-400">{i.company}</span></h4>
                                  <span className="text-[10px] text-slate-400">{i.duration}</span>
                                  <p className="text-slate-400 text-[11px] mt-1">{i.description}</p>
                                </div>
                                <button onClick={() => handleRemoveInternship(i.id)} className="text-slate-500 hover:text-rose-400">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="p-3.5 rounded-lg bg-[#0E111B] border border-white/[0.06] space-y-3">
                          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">+ Add Internship</span>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            <input
                              type="text"
                              value={internCompany}
                              onChange={e => setInternCompany(e.target.value)}
                              placeholder="Company Name"
                              className="px-3 py-1.5 rounded-lg bg-[#141724] border border-white/[0.12] text-white text-xs"
                            />
                            <input
                              type="text"
                              value={internRole}
                              onChange={e => setInternRole(e.target.value)}
                              placeholder="Role (e.g. SWE Intern)"
                              className="px-3 py-1.5 rounded-lg bg-[#141724] border border-white/[0.12] text-white text-xs"
                            />
                            <input
                              type="text"
                              value={internDuration}
                              onChange={e => setInternDuration(e.target.value)}
                              placeholder="Duration (e.g. Summer 2025)"
                              className="px-3 py-1.5 rounded-lg bg-[#141724] border border-white/[0.12] text-white text-xs"
                            />
                          </div>
                          <textarea
                            value={internDesc}
                            onChange={e => setInternDesc(e.target.value)}
                            placeholder="Key responsibilities and engineering accomplishments..."
                            rows={2}
                            className="w-full px-3 py-1.5 rounded-lg bg-[#141724] border border-white/[0.12] text-white text-xs"
                          />
                          <button
                            type="button"
                            onClick={handleAddInternship}
                            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold text-xs"
                          >
                            Save Internship
                          </button>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* SECTION 4: CREDENTIALS */}
                  {sec.id === 'credentials' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Certifications</label>
                        <div className="flex flex-wrap gap-1.5">
                          {profile.certifications?.map((c, idx) => (
                            <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#0E111B] text-slate-200 border border-white/[0.08]">
                              <span>{c}</span>
                              <button onClick={() => handleRemoveCert(c)} className="text-slate-400 hover:text-rose-400">&times;</button>
                            </span>
                          ))}
                        </div>

                        <div className="flex gap-2 pt-1">
                          <input
                            type="text"
                            value={newCert}
                            onChange={e => setNewCert(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddCert())}
                            placeholder="e.g. AWS Certified Developer Associate"
                            className="flex-1 px-3 py-2 rounded-lg bg-[#0F121C] border border-white/[0.12] text-white text-xs"
                          />
                          <button type="button" onClick={handleAddCert} className="px-3.5 py-2 rounded-lg bg-indigo-600 text-white font-semibold">
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SECTION 5: CAREER DIRECTION */}
                  {sec.id === 'direction' && (
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Career Goals & Aspirations</label>
                        <textarea
                          value={profile.careerGoals}
                          onChange={e => setProfile({ ...profile, careerGoals: e.target.value })}
                          rows={3}
                          className="w-full px-3 py-2 rounded-lg bg-[#0F121C] border border-white/[0.12] text-white text-xs"
                          placeholder="Describe your ideal role, company size, and domain interests..."
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Work Preference</label>
                          <select
                            value={profile.workPreference}
                            onChange={e => setProfile({ ...profile, workPreference: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-[#0F121C] border border-white/[0.12] text-white text-xs"
                          >
                            <option value="Hybrid">Hybrid</option>
                            <option value="Remote">Remote</option>
                            <option value="In-Person">In-Person</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Target Starting Salary</label>
                          <input
                            type="text"
                            value={profile.targetSalary || '$95,000 - $120,000'}
                            onChange={e => setProfile({ ...profile, targetSalary: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-[#0F121C] border border-white/[0.12] text-white text-xs"
                            placeholder="e.g. $95,000 - $120,000"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
