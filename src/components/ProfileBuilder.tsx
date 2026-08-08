import React, { useState } from 'react';
import { 
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
  Zap,
  Target,
  User as UserIcon,
  Code,
  Terminal,
  Globe,
  DollarSign,
  Building,
  Trophy,
  Cpu,
  Heart
} from 'lucide-react';
import { StudentProfile, Project, Internship, Hackathon } from '../types';
import { sampleProfiles } from '../data/sampleProfiles';

interface ProfileBuilderProps {
  profile: StudentProfile;
  setProfile: React.Dispatch<React.SetStateAction<StudentProfile>>;
  onSaveProfile: () => void;
  onGenerateRecommendations: () => void;
  isSaving: boolean;
  isGenerating: boolean;
}

const POPULAR_SKILLS = [
  "Python", "TypeScript", "React", "SQL", "Node.js", "Docker", "PyTorch", 
  "Tableau", "Figma", "AWS", "Git", "Excel", "User Research", "Machine Learning", 
  "A/B Testing", "Data Structures", "Tailwind CSS", "REST APIs"
];

const POPULAR_LANGUAGES = [
  "Python", "TypeScript", "JavaScript", "C++", "Java", "SQL", "Go", "Rust", "Swift", "Kotlin", "HTML/CSS"
];

const POPULAR_FRAMEWORKS = [
  "React", "Next.js", "Node.js", "Express.js", "PyTorch", "TensorFlow", "Tailwind CSS", "Django", "FastAPI", "Spring Boot", "GraphQL"
];

const POPULAR_INTERESTS = [
  "Software Engineering", "Artificial Intelligence", "Product Management", 
  "Data Analytics", "UI/UX Design", "Cloud Computing", "Fintech", 
  "Management Consulting", "Healthcare Tech", "EdTech", "Startups"
];

export const ProfileBuilder: React.FC<ProfileBuilderProps> = ({
  profile,
  setProfile,
  onSaveProfile,
  onGenerateRecommendations,
  isSaving,
  isGenerating,
}) => {
  // Local Tag Inputs
  const [newSkill, setNewSkill] = useState('');
  const [newLang, setNewLang] = useState('');
  const [newFramework, setNewFramework] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [newCert, setNewCert] = useState('');
  const [newAchievement, setNewAchievement] = useState('');

  // Project Form
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectTech, setProjectTech] = useState('');
  const [projectLink, setProjectLink] = useState('');

  // Internship Form
  const [internCompany, setInternCompany] = useState('');
  const [internRole, setInternRole] = useState('');
  const [internDuration, setInternDuration] = useState('');
  const [internDesc, setInternDesc] = useState('');

  // Hackathon Form
  const [hackName, setHackName] = useState('');
  const [hackAward, setHackAward] = useState('');
  const [hackYear, setHackYear] = useState('');

  // Handlers for Skills
  const handleAddSkill = (skillToAdd: string) => {
    const trimmed = skillToAdd.trim();
    if (trimmed && !profile.skills.includes(trimmed)) {
      setProfile(prev => ({ ...prev, skills: [...prev.skills, trimmed] }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  // Handlers for Programming Languages
  const handleAddLanguage = (langToAdd: string) => {
    const trimmed = langToAdd.trim();
    const currentLangs = profile.programmingLanguages || [];
    if (trimmed && !currentLangs.includes(trimmed)) {
      setProfile(prev => ({ ...prev, programmingLanguages: [...currentLangs, trimmed] }));
      setNewLang('');
    }
  };

  const handleRemoveLanguage = (langToRemove: string) => {
    setProfile(prev => ({
      ...prev,
      programmingLanguages: (prev.programmingLanguages || []).filter(l => l !== langToRemove)
    }));
  };

  // Handlers for Frameworks
  const handleAddFramework = (frameworkToAdd: string) => {
    const trimmed = frameworkToAdd.trim();
    const currentFw = profile.frameworks || [];
    if (trimmed && !currentFw.includes(trimmed)) {
      setProfile(prev => ({ ...prev, frameworks: [...currentFw, trimmed] }));
      setNewFramework('');
    }
  };

  const handleRemoveFramework = (fwToRemove: string) => {
    setProfile(prev => ({
      ...prev,
      frameworks: (prev.frameworks || []).filter(f => f !== fwToRemove)
    }));
  };

  // Handlers for Interests
  const handleAddInterest = (interestToAdd: string) => {
    const trimmed = interestToAdd.trim();
    if (trimmed && !profile.interests.includes(trimmed)) {
      setProfile(prev => ({ ...prev, interests: [...prev.interests, trimmed] }));
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interestToRemove: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interestToRemove)
    }));
  };

  // Certifications
  const handleAddCert = () => {
    if (newCert.trim() && !profile.certifications.includes(newCert.trim())) {
      setProfile(prev => ({ ...prev, certifications: [...prev.certifications, newCert.trim()] }));
      setNewCert('');
    }
  };

  const handleRemoveCert = (certToRemove: string) => {
    setProfile(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c !== certToRemove)
    }));
  };

  // Achievements
  const handleAddAchievement = () => {
    if (newAchievement.trim()) {
      const currentList = profile.achievements || [];
      if (!currentList.includes(newAchievement.trim())) {
        setProfile(prev => ({ ...prev, achievements: [...currentList, newAchievement.trim()] }));
        setNewAchievement('');
      }
    }
  };

  const handleRemoveAchievement = (achToRemove: string) => {
    setProfile(prev => ({
      ...prev,
      achievements: (prev.achievements || []).filter(a => a !== achToRemove)
    }));
  };

  // Add Project
  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle.trim() || !projectDesc.trim()) return;

    const newProj: Project = {
      id: Date.now().toString(),
      title: projectTitle.trim(),
      description: projectDesc.trim(),
      technologies: projectTech.split(',').map(t => t.trim()).filter(Boolean),
      link: projectLink.trim() || undefined
    };

    setProfile(prev => ({
      ...prev,
      projects: [...prev.projects, newProj]
    }));

    setProjectTitle('');
    setProjectDesc('');
    setProjectTech('');
    setProjectLink('');
  };

  const handleRemoveProject = (id: string) => {
    setProfile(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id)
    }));
  };

  // Add Internship
  const handleAddInternship = (e: React.FormEvent) => {
    e.preventDefault();
    if (!internCompany.trim() || !internRole.trim()) return;

    const newIntern: Internship = {
      id: Date.now().toString(),
      company: internCompany.trim(),
      role: internRole.trim(),
      duration: internDuration.trim() || 'Summer Intern',
      description: internDesc.trim()
    };

    setProfile(prev => ({
      ...prev,
      internships: [...(prev.internships || []), newIntern]
    }));

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

    const newHack: Hackathon = {
      id: Date.now().toString(),
      name: hackName.trim(),
      projectOrAward: hackAward.trim() || 'Participant',
      year: hackYear.trim() || new Date().getFullYear().toString()
    };

    setProfile(prev => ({
      ...prev,
      hackathons: [...(prev.hackathons || []), newHack]
    }));

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

  // Preset loader
  const loadPreset = (preset: Partial<StudentProfile>) => {
    setProfile(prev => ({
      ...prev,
      ...preset,
      skills: preset.skills || prev.skills,
      programmingLanguages: preset.programmingLanguages || prev.programmingLanguages || POPULAR_LANGUAGES.slice(0, 4),
      frameworks: preset.frameworks || prev.frameworks || POPULAR_FRAMEWORKS.slice(0, 4),
      interests: preset.interests || prev.interests,
      certifications: preset.certifications || prev.certifications,
      projects: preset.projects || prev.projects,
    }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/50 to-purple-900/40 border border-slate-800 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Complete Student Profile Matrix</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              Student Profile & Skill Inventory
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Fill out your university credentials, programming languages, coursework projects, hackathons, and dream goals to unlock AI career matches.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onSaveProfile}
              disabled={isSaving}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-2 shadow-sm"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{isSaving ? 'Saving to Firebase...' : 'Save Profile'}</span>
            </button>

            <button
              onClick={onGenerateRecommendations}
              disabled={isGenerating || !profile.major}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-blue-900/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? 'AI Analyzing...' : 'Discover Career Paths'}</span>
            </button>
          </div>
        </div>

        {/* Quick Demo Presets Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <p className="text-xs font-semibold text-slate-300 mb-2.5 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Instant Demo Presets (Click to Auto-Fill):</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {sampleProfiles.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => loadPreset(sample.profile)}
                className="px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-blue-600/20 text-slate-300 hover:text-white border border-slate-800 hover:border-blue-500/40 text-xs font-medium transition-all"
              >
                + {sample.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 1: Personal & Academic Details */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-xl space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <UserIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">1. Personal & Academic Credentials</h2>
            <p className="text-xs text-slate-400">Basic student information, university department, semester, and grades.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
            <input
              type="text"
              value={profile.fullName || ''}
              onChange={e => setProfile({ ...profile, fullName: e.target.value })}
              placeholder="e.g. Alex Richards"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* University */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">University / College *</label>
            <input
              type="text"
              required
              value={profile.university}
              onChange={e => setProfile({ ...profile, university: e.target.value })}
              placeholder="e.g. Stanford University"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Department</label>
            <input
              type="text"
              value={profile.department || ''}
              onChange={e => setProfile({ ...profile, department: e.target.value })}
              placeholder="e.g. Dept of Computer Science & Engineering"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Major */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Major / Degree Program *</label>
            <input
              type="text"
              required
              value={profile.major}
              onChange={e => setProfile({ ...profile, major: e.target.value })}
              placeholder="e.g. Computer Science (AI Track)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Semester */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Semester</label>
            <select
              value={profile.semester || '7th Semester (Senior)'}
              onChange={e => setProfile({ ...profile, semester: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="1st Semester (Freshman)">1st Semester (Freshman)</option>
              <option value="2nd Semester (Freshman)">2nd Semester (Freshman)</option>
              <option value="3rd Semester (Sophomore)">3rd Semester (Sophomore)</option>
              <option value="4th Semester (Sophomore)">4th Semester (Sophomore)</option>
              <option value="5th Semester (Junior)">5th Semester (Junior)</option>
              <option value="6th Semester (Junior)">6th Semester (Junior)</option>
              <option value="7th Semester (Senior)">7th Semester (Senior)</option>
              <option value="8th Semester (Senior)">8th Semester (Senior)</option>
              <option value="Postgraduate / Master's">Postgraduate / Master's</option>
            </select>
          </div>

          {/* Graduation Year */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Graduation Year</label>
            <select
              value={profile.gradYear}
              onChange={e => setProfile({ ...profile, gradYear: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
              <option value="2028">2028</option>
              <option value="2029">2029+</option>
            </select>
          </div>

          {/* CGPA / GPA */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">CGPA / Cumulative GPA</label>
            <input
              type="text"
              value={profile.cgpa || profile.gpa || ''}
              onChange={e => setProfile({ ...profile, cgpa: e.target.value, gpa: e.target.value })}
              placeholder="e.g. 3.8 / 4.0 or 8.9 / 10"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: Technical Stack & Skills Breakdown */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-xl space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Code className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">2. Technical Stack & Skill Matrix</h2>
            <p className="text-xs text-slate-400">Programming languages, frameworks, core technical skills, and key domain interests.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Programming Languages */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
            <label className="text-xs font-semibold text-purple-300 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-purple-400" />
              <span>Programming Languages</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newLang}
                onChange={e => setNewLang(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddLanguage(newLang))}
                placeholder="e.g. Python, Rust, C++"
                className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-purple-500"
              />
              <button
                type="button"
                onClick={() => handleAddLanguage(newLang)}
                className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl transition-all"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 min-h-[38px] p-2 rounded-xl bg-slate-900/50 border border-slate-800/60">
              {(profile.programmingLanguages || []).map(lang => (
                <span key={lang} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium">
                  {lang}
                  <button type="button" onClick={() => handleRemoveLanguage(lang)} className="hover:text-rose-400 ml-1">×</button>
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              {POPULAR_LANGUAGES.filter(l => !(profile.programmingLanguages || []).includes(l)).slice(0, 6).map(l => (
                <button
                  key={l}
                  type="button"
                  onClick={() => handleAddLanguage(l)}
                  className="px-2 py-0.5 rounded-md bg-slate-800/60 text-slate-400 hover:text-slate-200 text-[10px] border border-slate-700/50"
                >
                  + {l}
                </button>
              ))}
            </div>
          </div>

          {/* Frameworks & Developer Tools */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
            <label className="text-xs font-semibold text-blue-300 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-blue-400" />
              <span>Frameworks & Libraries</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newFramework}
                onChange={e => setNewFramework(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddFramework(newFramework))}
                placeholder="e.g. React, PyTorch, Node.js"
                className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => handleAddFramework(newFramework)}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-all"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 min-h-[38px] p-2 rounded-xl bg-slate-900/50 border border-slate-800/60">
              {(profile.frameworks || []).map(fw => (
                <span key={fw} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium">
                  {fw}
                  <button type="button" onClick={() => handleRemoveFramework(fw)} className="hover:text-rose-400 ml-1">×</button>
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              {POPULAR_FRAMEWORKS.filter(f => !(profile.frameworks || []).includes(f)).slice(0, 6).map(f => (
                <button
                  key={f}
                  type="button"
                  onClick={() => handleAddFramework(f)}
                  className="px-2 py-0.5 rounded-md bg-slate-800/60 text-slate-400 hover:text-slate-200 text-[10px] border border-slate-700/50"
                >
                  + {f}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Core Skills & Domain Interests */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          
          {/* General Skills */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
            <label className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Core Technical & Soft Skills</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddSkill(newSkill))}
                placeholder="e.g. Data Structures, Figma, System Design"
                className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={() => handleAddSkill(newSkill)}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-all"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 min-h-[38px] p-2 rounded-xl bg-slate-900/50 border border-slate-800/60">
              {profile.skills.map(skill => (
                <span key={skill} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium">
                  {skill}
                  <button type="button" onClick={() => handleRemoveSkill(skill)} className="hover:text-rose-400 ml-1">×</button>
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              {POPULAR_SKILLS.filter(s => !profile.skills.includes(s)).slice(0, 8).map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleAddSkill(s)}
                  className="px-2 py-0.5 rounded-md bg-slate-800/60 text-slate-400 hover:text-slate-200 text-[10px] border border-slate-700/50"
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>

          {/* Industry Interests */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
            <label className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-amber-400" />
              <span>Career Interests & Field Focus</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newInterest}
                onChange={e => setNewInterest(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddInterest(newInterest))}
                placeholder="e.g. Artificial Intelligence, Cloud, Fintech"
                className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={() => handleAddInterest(newInterest)}
                className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-xl transition-all"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 min-h-[38px] p-2 rounded-xl bg-slate-900/50 border border-slate-800/60">
              {profile.interests.map(interest => (
                <span key={interest} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium">
                  {interest}
                  <button type="button" onClick={() => handleRemoveInterest(interest)} className="hover:text-rose-400 ml-1">×</button>
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              {POPULAR_INTERESTS.filter(i => !profile.interests.includes(i)).slice(0, 6).map(i => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleAddInterest(i)}
                  className="px-2 py-0.5 rounded-md bg-slate-800/60 text-slate-400 hover:text-slate-200 text-[10px] border border-slate-700/50"
                >
                  + {i}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 3: Internships, Projects, Hackathons & Honors */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-xl space-y-8">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <FolderPlus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">3. Experience, Projects & Achievements</h2>
            <p className="text-xs text-slate-400">Internship work history, academic/side projects, hackathon awards, and certifications.</p>
          </div>
        </div>

        {/* Sub-block A: Internships */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-400" />
            <span>Internships & Work Experience ({(profile.internships || []).length})</span>
          </h3>

          {(profile.internships || []).length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(profile.internships || []).map(intern => (
                <div key={intern.id} className="relative p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                  <button
                    type="button"
                    onClick={() => handleRemoveInternship(intern.id)}
                    className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <h4 className="font-bold text-sm text-slate-100 pr-6">{intern.role}</h4>
                  <p className="text-xs font-semibold text-blue-400">{intern.company} • <span className="text-slate-400 font-normal">{intern.duration}</span></p>
                  {intern.description && <p className="text-xs text-slate-400 leading-relaxed pt-1">{intern.description}</p>}
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleAddInternship} className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 space-y-3">
            <p className="text-xs font-semibold text-slate-300">Add Internship Record:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={internCompany}
                onChange={e => setInternCompany(e.target.value)}
                placeholder="Company (e.g. Google)"
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                value={internRole}
                onChange={e => setInternRole(e.target.value)}
                placeholder="Role (e.g. Software Engineering Intern)"
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                value={internDuration}
                onChange={e => setInternDuration(e.target.value)}
                placeholder="Duration (e.g. Summer 2025)"
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
            <textarea
              value={internDesc}
              onChange={e => setInternDesc(e.target.value)}
              rows={2}
              placeholder="Responsibilities or achievements during the internship..."
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Internship
              </button>
            </div>
          </form>
        </div>

        {/* Sub-block B: Projects Portfolio */}
        <div className="space-y-4 pt-4 border-t border-slate-800/80">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Code className="w-4 h-4 text-purple-400" />
            <span>Coursework & Technical Projects ({profile.projects.length})</span>
          </h3>

          {profile.projects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {profile.projects.map(p => (
                <div key={p.id} className="relative p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <button
                    type="button"
                    onClick={() => handleRemoveProject(p.id)}
                    className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <h4 className="font-bold text-sm text-slate-100 pr-6">{p.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{p.description}</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {p.technologies.map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 text-[10px] border border-purple-500/20">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleAddProject} className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 space-y-3">
            <p className="text-xs font-semibold text-slate-300">Add Technical Project:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={projectTitle}
                onChange={e => setProjectTitle(e.target.value)}
                placeholder="Project Title (e.g. AI Career Navigator)"
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-purple-500"
              />
              <input
                type="text"
                value={projectTech}
                onChange={e => setProjectTech(e.target.value)}
                placeholder="Tech Stack (e.g. React, Python, Gemini API)"
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-purple-500"
              />
            </div>
            <textarea
              value={projectDesc}
              onChange={e => setProjectDesc(e.target.value)}
              rows={2}
              placeholder="Brief summary of what you built, system architecture, or outcome..."
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-purple-500"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Project
              </button>
            </div>
          </form>
        </div>

        {/* Sub-block C: Hackathons & Certifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800/80">
          
          {/* Hackathons */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Hackathons & Coding Competitions</span>
            </h3>
            
            {(profile.hackathons || []).map(h => (
              <div key={h.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                <div>
                  <p className="font-bold text-slate-200">{h.name} <span className="text-slate-500 font-normal">({h.year})</span></p>
                  <p className="text-amber-400 font-medium text-[11px]">{h.projectOrAward}</p>
                </div>
                <button type="button" onClick={() => handleRemoveHackathon(h.id)} className="text-slate-500 hover:text-rose-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            <form onSubmit={handleAddHackathon} className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={hackName}
                  onChange={e => setHackName(e.target.value)}
                  placeholder="Hackathon Name (e.g. HackMIT)"
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-xs"
                />
                <input
                  type="text"
                  value={hackAward}
                  onChange={e => setHackAward(e.target.value)}
                  placeholder="Award / Project Name"
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-xs"
                />
              </div>
              <div className="flex justify-end">
                <button type="submit" className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold">
                  + Add Hackathon
                </button>
              </div>
            </form>
          </div>

          {/* Certifications & Badges */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Certifications & Online Badges</span>
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                value={newCert}
                onChange={e => setNewCert(e.target.value)}
                placeholder="e.g. AWS Developer, Google Data Analytics"
                className="flex-1 px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={handleAddCert}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {profile.certifications.map(c => (
                <span key={c} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium">
                  {c}
                  <button type="button" onClick={() => handleRemoveCert(c)} className="hover:text-rose-400 ml-1">×</button>
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Sub-block D: Achievements */}
        <div className="space-y-3 pt-4 border-t border-slate-800/80">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-blue-400" />
            <span>Honors & Key Achievements</span>
          </h3>

          <div className="flex gap-2">
            <input
              type="text"
              value={newAchievement}
              onChange={e => setNewAchievement(e.target.value)}
              placeholder="e.g. Dean's Honor List 2024 & 2025, 1st Place University Algorithmic Coding Challenge"
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              onClick={handleAddAchievement}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl"
            >
              Add
            </button>
          </div>

          <div className="space-y-1.5">
            {(profile.achievements || []).map(ach => (
              <div key={ach} className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-200">
                <span>• {ach}</span>
                <button type="button" onClick={() => handleRemoveAchievement(ach)} className="text-slate-500 hover:text-rose-400">×</button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* SECTION 4: Dream Career Aspirations & Work Preferences */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-xl space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">4. Dream Company, Role & Work Preferences</h2>
            <p className="text-xs text-slate-400">Specify target organizations, expected compensation, geographic preference, and work setup.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Dream Company */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-blue-400" />
              <span>Dream Company</span>
            </label>
            <input
              type="text"
              value={profile.dreamCompany || ''}
              onChange={e => setProfile({ ...profile, dreamCompany: e.target.value })}
              placeholder="e.g. Google / OpenAI / Apple"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Dream Role */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-purple-400" />
              <span>Dream Role</span>
            </label>
            <input
              type="text"
              value={profile.dreamRole || ''}
              onChange={e => setProfile({ ...profile, dreamRole: e.target.value })}
              placeholder="e.g. AI Research Engineer / Staff Developer"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Preferred Country */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>Preferred Country / Region</span>
            </label>
            <input
              type="text"
              value={profile.preferredCountry || ''}
              onChange={e => setProfile({ ...profile, preferredCountry: e.target.value })}
              placeholder="e.g. United States, United Kingdom, Remote"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Expected Salary */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
              <span>Expected Starting Salary</span>
            </label>
            <input
              type="text"
              value={profile.expectedSalary || ''}
              onChange={e => setProfile({ ...profile, expectedSalary: e.target.value })}
              placeholder="e.g. $120,000 - $140,000 / year"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Work Style */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Preferred Work Style</label>
            <div className="grid grid-cols-4 gap-2">
              {(['Remote', 'Hybrid', 'On-site', 'Flexible'] as const).map(pref => (
                <button
                  key={pref}
                  type="button"
                  onClick={() => setProfile({ ...profile, workPreference: pref, preferredWorkStyle: pref })}
                  className={`py-2 rounded-xl text-xs font-medium transition-all ${
                    (profile.preferredWorkStyle || profile.workPreference) === pref
                      ? 'bg-blue-600 text-white font-bold border border-blue-400 shadow-md'
                      : 'bg-slate-950/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {pref}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Career Statement */}
        <div className="pt-2">
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Overall Career Vision & Goals Statement</label>
          <textarea
            value={profile.careerGoals}
            onChange={e => setProfile({ ...profile, careerGoals: e.target.value })}
            rows={3}
            placeholder="Describe what kind of impact you hope to achieve, core values, or post-graduation vision..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500 leading-relaxed"
          />
        </div>
      </div>

      {/* Save & Analyze Footer Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          onClick={onSaveProfile}
          disabled={isSaving}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{isSaving ? 'Saving to Firebase...' : 'Save Profile to Firebase'}</span>
        </button>

        <button
          onClick={onGenerateRecommendations}
          disabled={isGenerating || !profile.major}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-extrabold text-xs bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl shadow-blue-900/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isGenerating ? 'AI Analyzing Profile...' : 'Analyze Profile & Match Top Careers'}</span>
        </button>
      </div>

    </div>
  );
};
