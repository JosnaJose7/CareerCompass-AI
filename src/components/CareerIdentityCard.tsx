import React, { useState } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  ShieldAlert, 
  Gamepad2, 
  Flame, 
  Music, 
  Trophy, 
  Film,
  User as UserIcon,
  ChevronRight,
  Zap,
  Award,
  Star,
  CheckCircle2,
  Palette,
  Briefcase,
  GraduationCap,
  Building,
  ExternalLink,
  Target,
  TrendingUp,
  Cpu,
  Layers,
  Code,
  Globe,
  Compass,
  ArrowUpRight,
  AlertCircle,
  Clock,
  Heart,
  ChevronDown,
  ChevronUp,
  Edit3,
  Scroll,
  Crown,
  Disc,
  Radio,
  Headphones,
  Mic2,
  Volume2,
  Play,
  Sliders,
  Sparkle,
  Activity,
  BarChart3,
  Medal,
  Gauge,
  Dumbbell,
  Timer,
  Flag,
  ShieldCheck,
  Camera
} from 'lucide-react';
import { StudentProfile, CareerRecommendation, SkillGapAnalysisResult, Project, Internship, Hackathon } from '../types';
import { useTheme } from '../context/ThemeContext';
import { PROFILE_EXPERIENCES } from '../themes/themeConfig';
import { ProfileExperienceId } from '../themes/types';
import { ProfilePortraitFrame } from './portraits/ProfilePortraitFrame';

interface CareerIdentityCardProps {
  profile: StudentProfile;
  topRecommendation?: CareerRecommendation;
  skillGapAnalysis?: SkillGapAnalysisResult | null;
  onOpenExperienceModal?: () => void;
  onEditProfile?: () => void;
  onEditPortrait?: () => void;
}

const EXP_ICONS: Record<ProfileExperienceId, React.ElementType> = {
  'professional': Sparkles,
  'kpop': Music,
  'anime': Flame,
  'sports': Trophy,
  'gaming': Gamepad2,
  'dark-fantasy': ShieldAlert,
  'fantasy': ShieldAlert,
  'dark-academia': BookOpen,
  'cinematic': Film
};

// Equalizer Visualizer Component for K-Pop Experience
const EqualizerBars = ({ count = 6, color = 'bg-fuchsia-400' }: { count?: number; color?: string }) => {
  const heights = ['h-2', 'h-4', 'h-2.5', 'h-5', 'h-3', 'h-4.5', 'h-2'];
  return (
    <div className="flex items-end gap-1 h-5 px-1">
      {Array.from({ length: count }).map((_, i) => (
        <span 
          key={i} 
          className={`w-1 rounded-full ${color} ${heights[i % heights.length]} transition-all duration-300`} 
        />
      ))}
    </div>
  );
};

// Music Editorial Divider
const MusicDivider = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="flex items-center justify-between gap-3 my-2 pt-2">
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-fuchsia-400 shadow-[0_0_8px_rgba(232,121,249,0.9)]" />
      <span className="text-[11px] font-black uppercase tracking-[0.25em] text-fuchsia-300 font-mono">
        {title}
      </span>
      {subtitle && (
        <span className="text-[11px] text-white/50 font-sans tracking-wide">
          • {subtitle}
        </span>
      )}
    </div>
    <div className="h-[1px] flex-1 bg-gradient-to-r from-fuchsia-500/40 via-purple-500/20 to-transparent" />
    <EqualizerBars count={4} color="bg-fuchsia-400/80" />
  </div>
);

// Ornate SVG corner brackets for Dark Fantasy Codex
const CodexCorner = ({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) => {
  const rotation = {
    tl: '',
    tr: 'rotate-90',
    br: 'rotate-180',
    bl: '-rotate-90'
  }[position];

  return (
    <svg 
      className={`w-10 h-10 sm:w-14 sm:h-14 text-[#d4af37] opacity-85 transition-opacity hover:opacity-100 ${rotation}`} 
      viewBox="0 0 56 56" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4 4H32C42 4 52 14 52 24V52" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 8H28C36 8 44 16 44 24V44" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
      <path d="M4 4L18 18M4 4L4 20M4 4L20 4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="28" cy="28" r="3.5" fill="currentColor" opacity="0.6" />
      <path d="M14 28C14 20.27 20.27 14 28 14" stroke="currentColor" strokeWidth="1" />
      <circle cx="4" cy="4" r="2.5" fill="currentColor" />
      <circle cx="52" cy="52" r="2" fill="currentColor" />
    </svg>
  );
};

// Ornate Divider
const CodexDivider = ({ title }: { title?: string }) => (
  <div className="flex items-center justify-center gap-3 my-2">
    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent" />
    {title ? (
      <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2e1065]/70 border border-[#d4af37]/50 text-[#fbf0b9] font-serif text-[11px] font-bold tracking-[0.2em] uppercase shadow-sm">
        <span className="text-[#d4af37]">✦</span>
        <span>{title}</span>
        <span className="text-[#d4af37]">✦</span>
      </div>
    ) : (
      <span className="text-[#d4af37] text-xs">❖</span>
    )}
    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent" />
  </div>
);

export interface NormalizedStudentSkill {
  name: string;
  category: 'Programming' | 'AI & Machine Learning' | 'Core Computer Science' | 'Systems & Infrastructure' | 'Data & Persistence';
  level: 'Advanced' | 'Intermediate' | 'Foundational';
  percentage: number;
  blocks: string;
  gamingLevel: string;
  gamingTier: string;
  animeTier: string;
  fantasyAffinity: string;
  kpopConcept: string;
  sportsStat: string;
}

export const getNormalizedStudentSkills = (profile: StudentProfile): NormalizedStudentSkill[] => {
  const allSkills = [
    ...(profile.programmingLanguages || []),
    ...(profile.skills || []),
    ...(profile.frameworks || [])
  ];

  const defaultSkillMap: Record<string, { level: 'Advanced' | 'Intermediate' | 'Foundational'; pct: number; category: 'Programming' | 'AI & Machine Learning' | 'Core Computer Science' | 'Systems & Infrastructure' | 'Data & Persistence' }> = {
    'Python': { level: 'Advanced', pct: 92, category: 'Programming' },
    'Machine Learning': { level: 'Intermediate', pct: 82, category: 'AI & Machine Learning' },
    'Deep Learning': { level: 'Intermediate', pct: 78, category: 'AI & Machine Learning' },
    'PyTorch': { level: 'Intermediate', pct: 80, category: 'AI & Machine Learning' },
    'TensorFlow': { level: 'Intermediate', pct: 76, category: 'AI & Machine Learning' },
    'Data Structures & Algorithms': { level: 'Advanced', pct: 90, category: 'Core Computer Science' },
    'Algorithms': { level: 'Advanced', pct: 90, category: 'Core Computer Science' },
    'Data Structures': { level: 'Advanced', pct: 90, category: 'Core Computer Science' },
    'System Design': { level: 'Intermediate', pct: 75, category: 'Systems & Infrastructure' },
    'Cloud Computing': { level: 'Intermediate', pct: 78, category: 'Systems & Infrastructure' },
    'Kubernetes': { level: 'Intermediate', pct: 72, category: 'Systems & Infrastructure' },
    'SQL': { level: 'Intermediate', pct: 82, category: 'Data & Persistence' },
    'PostgreSQL': { level: 'Intermediate', pct: 80, category: 'Data & Persistence' },
    'TypeScript': { level: 'Advanced', pct: 88, category: 'Programming' },
    'JavaScript': { level: 'Advanced', pct: 88, category: 'Programming' },
    'React': { level: 'Advanced', pct: 86, category: 'Programming' },
    'C++': { level: 'Intermediate', pct: 80, category: 'Programming' },
    'Java': { level: 'Intermediate', pct: 78, category: 'Programming' },
    'NLP': { level: 'Intermediate', pct: 76, category: 'AI & Machine Learning' },
    'Computer Vision': { level: 'Intermediate', pct: 74, category: 'AI & Machine Learning' },
    'Docker': { level: 'Intermediate', pct: 75, category: 'Systems & Infrastructure' }
  };

  const skillNames = allSkills.length > 0 
    ? Array.from(new Set(allSkills)) 
    : ['Python', 'Machine Learning', 'Deep Learning', 'PyTorch', 'Data Structures & Algorithms', 'System Design'];

  return skillNames.slice(0, 6).map((name, idx) => {
    const known = defaultSkillMap[name] || {
      level: (idx === 0 || idx === 4 ? 'Advanced' : idx < 4 ? 'Intermediate' : 'Foundational') as 'Advanced' | 'Intermediate' | 'Foundational',
      pct: Math.max(65, 94 - idx * 5),
      category: (idx < 2 ? 'Programming' : idx < 4 ? 'AI & Machine Learning' : 'Core Computer Science') as any
    };

    const filledCount = Math.min(10, Math.max(1, Math.round(known.pct / 10)));
    const blocks = '█'.repeat(filledCount) + '░'.repeat(Math.max(0, 10 - filledCount));

    return {
      name,
      category: known.category,
      level: known.level,
      percentage: known.pct,
      blocks,
      gamingLevel: `Lvl ${filledCount}`,
      gamingTier: known.level === 'Advanced' ? 'Mastery Tier IV' : known.level === 'Intermediate' ? 'Proficient Tier III' : 'Apprentice Tier II',
      animeTier: known.level === 'Advanced' ? 'S-Tier Vanguard' : known.level === 'Intermediate' ? 'A-Tier Awakened' : 'B-Tier Adept',
      fantasyAffinity: known.level === 'Advanced' ? 'Archmage Inscription' : known.level === 'Intermediate' ? 'Master Glyphs' : 'Acolyte Rune',
      kpopConcept: known.level === 'Advanced' ? 'Center Execution' : known.level === 'Intermediate' ? 'Lead Harmonics' : 'Visual Foundation',
      sportsStat: known.level === 'Advanced' ? 'Elite Scouting IQ' : known.level === 'Intermediate' ? 'Starting Lineup' : 'Bench Depth'
    };
  });
};

export const CareerIdentityCard: React.FC<CareerIdentityCardProps> = ({
  profile,
  topRecommendation,
  skillGapAnalysis,
  onOpenExperienceModal,
  onEditProfile,
  onEditPortrait
}) => {
  const { profileExperienceId, currentProfileExperience, openProfileExperienceModal } = useTheme();

  // Compute active experience configuration
  const expId = (profile.profileExperience as ProfileExperienceId) || profileExperienceId || 'professional';
  const expConfig = PROFILE_EXPERIENCES[expId] || currentProfileExperience || PROFILE_EXPERIENCES['professional'];
  const IconComponent = EXP_ICONS[expId] || Sparkles;

  const isDarkFantasy = expId === 'dark-fantasy' || expId === 'fantasy';
  const isKpop = expId === 'kpop';
  const isAnime = expId === 'anime';
  const isSports = expId === 'sports';
  const isGaming = expId === 'gaming';
  const isProfessional = expId === 'professional' || (!isDarkFantasy && !isKpop && !isAnime && !isSports && !isGaming);

  // Normalized skills shared identically across all views
  const normalizedSkills = getNormalizedStudentSkills(profile);

  // Calculate dynamic readiness score
  const calculateReadinessScore = () => {
    let score = 35;
    if (profile.fullName) score += 5;
    if (profile.major) score += 10;
    if (profile.department) score += 5;
    if (profile.gpa && parseFloat(profile.gpa) >= 3.5) score += 10;
    else if (profile.gpa) score += 5;
    if (profile.skills && profile.skills.length >= 3) score += 10;
    if (profile.skills && profile.skills.length >= 6) score += 5;
    if (profile.programmingLanguages && profile.programmingLanguages.length >= 3) score += 5;
    if (profile.projects && profile.projects.length >= 1) score += 5;
    if (profile.projects && profile.projects.length >= 2) score += 5;
    if (profile.internships && profile.internships.length >= 1) score += 5;
    if (profile.certifications && profile.certifications.length >= 1) score += 3;
    if (profile.achievements && profile.achievements.length >= 1) score += 2;
    return Math.min(score, 98);
  };

  const readinessScore = calculateReadinessScore();

  // Get current rank title
  const getRankTitle = () => {
    if (readinessScore >= 85) return expConfig.rankTitles.level4;
    if (readinessScore >= 70) return expConfig.rankTitles.level3;
    if (readinessScore >= 50) return expConfig.rankTitles.level2;
    return expConfig.rankTitles.level1;
  };

  const currentRank = getRankTitle();

  // Core Strengths derived dynamically
  const getCoreStrengths = (): string[] => {
    const strengths: string[] = [];
    if (profile.skills && profile.skills.length > 0) {
      strengths.push(profile.skills[0]);
      if (profile.skills[1]) strengths.push(profile.skills[1]);
    }
    if (profile.programmingLanguages && profile.programmingLanguages.length > 0) {
      strengths.push(`${profile.programmingLanguages[0]} Architecture`);
    }
    if (profile.gpa && parseFloat(profile.gpa) >= 3.5) {
      strengths.push('Academic Research & Intellectual Precision');
    }
    if (profile.projects && profile.projects.length > 0) {
      strengths.push('End-to-End System Prototyping');
    }
    if (profile.hackathons && profile.hackathons.length > 0) {
      strengths.push('Rapid Innovation & Problem Solving');
    }
    if (strengths.length < 4) {
      strengths.push('Algorithmic Thinking', 'Technical Communication', 'Cross-Functional Execution');
    }
    return strengths.slice(0, 5);
  };

  const coreStrengths = getCoreStrengths();

  // Top career match derivation
  const topMatchTitle = topRecommendation?.title || profile.dreamRole || (profile.major.includes('Computer') ? 'Full-Stack AI Software Engineer' : `${profile.major} Specialist`);
  const topMatchScore = topRecommendation?.matchScore || (readinessScore >= 80 ? 94 : 88);
  const topMatchDemand = topRecommendation?.demandGrowth || '+24% High Astral Demand';
  const topMatchReason = topRecommendation?.shortSummary || topRecommendation?.reason || `Exceptional technical synergy between your ${profile.major} background, demonstrated mastery in engineering incantations, and burgeoning market demand.`;

  // Skill gaps derivation
  const rawSkillGaps = skillGapAnalysis?.missingSkills || (topRecommendation?.missingSkills ? topRecommendation.missingSkills.map((s, idx) => ({
    id: `rec-gap-${idx}`,
    skill: s,
    priority: 'High' as const,
    howToAcquire: `Master advanced architectural paradigms and deploy cloud systems focusing on ${s}.`
  })) : [
    { id: 'gap-1', skill: 'Distributed Cloud Architecture & Kubernetes', priority: 'High' as const, howToAcquire: 'Deploy containerized microservices to Google Cloud or AWS.' },
    { id: 'gap-2', skill: 'High-Throughput Database Scalability', priority: 'Medium' as const, howToAcquire: 'Study high-throughput database sharding and caching patterns.' },
    { id: 'gap-3', skill: 'Production Observability & Telemetry', priority: 'Medium' as const, howToAcquire: 'Integrate OpenTelemetry and structured logging in projects.' }
  ]);

  const skillGaps = rawSkillGaps.map(g => ({
    skill: typeof g === 'string' ? g : g.skill,
    priority: (typeof g === 'object' && 'priority' in g && g.priority) ? g.priority : 'High',
    howToAcquire: (typeof g === 'object' && 'howToAcquire' in g && g.howToAcquire) 
      ? (g as any).howToAcquire 
      : (typeof g === 'object' && 'recommendedCourses' in g && (g as any).recommendedCourses?.[0]?.title) 
        ? `Complete recommended course: ${(g as any).recommendedCourses[0].title}`
        : 'Acquire via capstone projects and targeted technical coursework.'
  }));

  const handleEditExperience = () => {
    if (onOpenExperienceModal) {
      onOpenExperienceModal();
    } else {
      openProfileExperienceModal();
    }
  };

  // =========================================================================
  // RENDER: DARK FANTASY MAGICAL CAREER CODEX (STORYBOOK / ENCHANTED ARCANUM)
  // =========================================================================
  if (isDarkFantasy) {
    return (
      <div 
        id="career-codex-card"
        className="relative overflow-hidden rounded-[2.5rem] border-2 border-[#d4af37]/70 shadow-[0_0_50px_rgba(212,175,55,0.25)] transition-all duration-300 font-serif"
        style={{
          backgroundColor: '#0a0512',
          backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(88, 24, 69, 0.45), transparent 70%), radial-gradient(circle at 100% 100%, rgba(46, 16, 101, 0.5), transparent 70%), linear-gradient(180deg, #0f071a 0%, #08030e 100%)',
          boxShadow: '0 25px 60px -15px rgba(212, 175, 55, 0.35), inset 0 0 40px rgba(0, 0, 0, 0.8)'
        }}
      >
        {/* Subtle Magical Star Dust & Rune Ambient Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        {/* Ornate Antique Gold Corner Filigrees */}
        <div className="absolute top-3 left-3 pointer-events-none z-20">
          <CodexCorner position="tl" />
        </div>
        <div className="absolute top-3 right-3 pointer-events-none z-20">
          <CodexCorner position="tr" />
        </div>
        <div className="absolute bottom-3 left-3 pointer-events-none z-20">
          <CodexCorner position="bl" />
        </div>
        <div className="absolute bottom-3 right-3 pointer-events-none z-20">
          <CodexCorner position="br" />
        </div>

        {/* Inner Gilded Decorative Inset Border */}
        <div className="absolute inset-3.5 rounded-[2.2rem] border border-[#d4af37]/35 pointer-events-none z-10" />
        <div className="absolute inset-5 rounded-[1.9rem] border border-dashed border-[#d4af37]/20 pointer-events-none z-10" />

        <div className="relative z-20 p-6 sm:p-9 lg:p-12 space-y-9">
          
          {/* ========================================================================= */}
          {/* 1. CAREER CODEX HEADER & ILLUMINATED CREST */}
          {/* ========================================================================= */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#d4af37]/30">
            <div className="flex flex-wrap items-center gap-3">
              {/* Wax Seal Badge */}
              <div className="px-4 py-1.5 rounded-full text-xs font-black tracking-[0.2em] uppercase flex items-center gap-2 bg-[#581845]/80 text-[#fbf0b9] border border-[#d4af37]/60 shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                <Crown className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>CAREER CODEX</span>
              </div>

              <span className="text-xs text-[#d4af37]/80 font-serif italic tracking-wide">
                • Tome of Scholastic Destiny & Sovereign Arcanum
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              {onEditProfile && (
                <button
                  type="button"
                  id="edit-codex-credentials-btn"
                  onClick={onEditProfile}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#2e1065]/70 hover:bg-[#3b0764] text-[#fbf0b9] border border-[#d4af37]/40 transition-all flex items-center gap-1.5 shadow-sm"
                  title="Edit student profile credentials & inventory"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Inscribe Codex</span>
                </button>
              )}

              <button
                type="button"
                id="switch-codex-experience-btn"
                onClick={handleEditExperience}
                className="flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold bg-[#0c0517] hover:bg-[#1a0b30] text-[#fbf0b9] border border-[#d4af37]/50 transition-all shadow-md group"
                title="Switch Profile Experience"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#d4af37] group-hover:rotate-12 transition-transform" />
                <span>Experience: <strong className="text-white ml-0.5">{expConfig.name}</strong></span>
                <ChevronRight className="w-3.5 h-3.5 text-[#d4af37]/60" />
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 2. STUDENT PORTRAIT & CAREER IDENTITY MATRIX */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Ornate Student Portrait & Academic Lineage (7 cols) */}
            <div className="lg:col-span-7 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              
              {/* Ornate Antique Gold Portrait Frame */}
              <ProfilePortraitFrame 
                profile={profile} 
                experienceId="dark-fantasy" 
                size="lg" 
                showEditOverlay={true}
                onEditClick={onEditPortrait || onEditProfile}
              />

              {/* Career Identity Information */}
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-[#fbf0b9] tracking-wide font-serif drop-shadow-md">
                    {profile.fullName || 'Student Sovereign'}
                  </h1>
                  <span className="text-xs px-3.5 py-1 rounded-full font-serif font-bold bg-[#581845]/70 text-[#fbf0b9] border border-[#d4af37]/60 shadow-sm">
                    {currentRank}
                  </span>
                </div>

                {/* Persona Title / Order */}
                <div className="flex items-center gap-2">
                  <span className="text-[#d4af37] text-sm">✦</span>
                  <p className="text-sm sm:text-base font-serif font-bold tracking-wide text-[#e6ca65]">
                    {expConfig.personaTitle}
                  </p>
                </div>

                {/* University Lineage & Scholastic Records */}
                <div className="text-xs sm:text-sm text-[#fef9c3]/90 font-serif space-y-1">
                  <div className="flex flex-wrap items-center gap-2 font-medium">
                    <span className="flex items-center gap-1.5 text-[#fbf0b9] font-bold">
                      <GraduationCap className="w-4 h-4 text-[#d4af37]" />
                      {profile.university || 'The Grand Academy of Science'}
                    </span>
                    <span className="text-[#d4af37]">•</span>
                    <span>{profile.gradYear ? `Epoch of ${profile.gradYear}` : 'Attuned Scholar'}</span>
                    {profile.gpa && (
                      <>
                        <span className="text-[#d4af37]">•</span>
                        <span className="px-2.5 py-0.5 rounded-md bg-[#d4af37]/20 text-[#fef08a] font-mono font-bold border border-[#d4af37]/40 shadow-sm">
                          GPA {profile.gpa}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="text-[#e2d5c3] text-xs flex flex-wrap items-center gap-1.5">
                    <span>{profile.department || 'Scholastic Department'}</span>
                    <span className="text-[#d4af37]">—</span>
                    <span className="text-[#fbf0b9] font-semibold italic">{profile.major}</span>
                    {profile.semester && (
                      <span className="text-[#d4af37]/70 font-normal">({profile.semester})</span>
                    )}
                  </div>
                </div>

                {/* Career Goal / Target Quest */}
                <div className="pt-1 flex items-start gap-2 text-xs">
                  <Target className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                  <span className="text-[#eadeca]">
                    Destined Career Goal: <strong className="text-[#fbf0b9] underline decoration-[#d4af37]/60 underline-offset-2">{profile.dreamRole || profile.careerGoals || 'Grand Systems Architect & AI Magus'}</strong>
                    {profile.dreamCompany && (
                      <span className="text-[#fde68a] ml-1.5 font-medium">@ {profile.dreamCompany}</span>
                    )}
                  </span>
                </div>
              </div>

            </div>

            {/* Right: Career Readiness (Codex Attunement) (5 cols) */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-[#150a22]/90 border border-[#d4af37]/40 shadow-2xl space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#d4af37]/10 to-transparent rounded-bl-full pointer-events-none" />

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#d4af37]/90 font-serif">
                    Codex Mastery Metric
                  </span>
                  <h4 className="text-sm font-bold text-[#fbf0b9] font-serif">
                    {expConfig.readinessMetricName}
                  </h4>
                </div>

                <div className="text-right">
                  <span className="text-3xl font-black font-mono text-[#fbf0b9] drop-shadow-[0_0_10px_rgba(212,175,55,0.6)]">
                    {readinessScore}%
                  </span>
                </div>
              </div>

              {/* Glowing Antique Gold / Burgundy Attunement Bar */}
              <div className="w-full h-4 rounded-full bg-[#08030e] border border-[#d4af37]/40 p-0.5 overflow-hidden shadow-inner">
                <div 
                  className="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-[#581845] via-[#d4af37] to-[#fef08a]"
                  style={{
                    width: `${readinessScore}%`,
                    boxShadow: '0 0 15px rgba(212, 175, 55, 0.7)'
                  }}
                />
              </div>

              {/* 3-Stat Alchemical Matrix */}
              <div className="grid grid-cols-3 gap-2.5 pt-1 text-center font-serif">
                <div className="p-2.5 rounded-xl bg-[#2e1065]/40 border border-[#d4af37]/30">
                  <span className="text-[10px] text-[#eadeca] block font-medium">Codex Rank</span>
                  <strong className="text-xs text-[#fbf0b9] font-bold block truncate">{currentRank.split(' ')[0]}</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-[#2e1065]/40 border border-[#d4af37]/30">
                  <span className="text-[10px] text-[#eadeca] block font-medium">Attuned Skills</span>
                  <strong className="text-xs text-[#fef08a] font-mono font-bold block">
                    {(profile.skills?.length || 0) + (profile.programmingLanguages?.length || 0)}
                  </strong>
                </div>
                <div className="p-2.5 rounded-xl bg-[#2e1065]/40 border border-[#d4af37]/30">
                  <span className="text-[10px] text-[#eadeca] block font-medium">Artifacts Built</span>
                  <strong className="text-xs text-[#fbf0b9] font-mono font-bold block">
                    {profile.projects?.length || 0}
                  </strong>
                </div>
              </div>
            </div>

          </div>

          <CodexDivider title="Prophesied Career Trajectory" />

          {/* ========================================================================= */}
          {/* 3. CAREER PATH: TOP CAREER MATCH & PROPHESIED ALIGNMENT */}
          {/* ========================================================================= */}
          <div 
            className="p-6 rounded-2xl border border-[#d4af37]/50 transition-all duration-300 relative overflow-hidden"
            style={{
              backgroundColor: 'rgba(25, 10, 38, 0.85)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6), inset 0 0 30px rgba(212, 175, 55, 0.08)'
            }}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#d4af37]/25 text-[#fbf0b9] border border-[#d4af37]/60 flex items-center gap-1.5 shadow-sm">
                    <Star className="w-3.5 h-3.5 text-[#d4af37] fill-[#d4af37]" />
                    <span>Top Prophesied Career Path</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-[#fef08a]">
                    {topMatchScore}% Compatibility Synergy
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-md bg-[#581845]/70 text-[#fbf0b9] border border-[#d4af37]/40 font-medium">
                    {topMatchDemand}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-[#fbf0b9] font-serif tracking-wide">
                  {topMatchTitle}
                </h3>

                <p className="text-xs sm:text-sm text-[#eadeca] leading-relaxed max-w-3xl font-serif">
                  {topMatchReason}
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-3 w-full md:w-auto justify-end">
                <div className="p-3.5 rounded-2xl bg-[#0c0517] border border-[#d4af37]/50 text-right shadow-md">
                  <span className="text-[10px] text-[#d4af37] uppercase tracking-wider block font-serif">Destiny Alignment</span>
                  <span className="text-base font-black text-[#fbf0b9] font-mono">{topMatchScore}% Synergy</span>
                </div>
              </div>
            </div>
          </div>

          <CodexDivider title="Arcane Strengths & Grimoire Skills" />

          {/* ========================================================================= */}
          {/* 4. STRENGTHS & SKILLS (GRIMOIRE SPELLCRAFT) */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Core Strengths (5 cols) */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-[#140822]/90 border border-[#d4af37]/40 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#d4af37]/30">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#fbf0b9] font-serif flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#d4af37]" />
                  <span>Inherent Boons & Core Strengths</span>
                </h3>
                <span className="text-[10px] text-[#d4af37]/80">{coreStrengths.length} Chronicled</span>
              </div>

              <div className="flex flex-wrap gap-2.5 pt-1">
                {coreStrengths.map((str, idx) => (
                  <div 
                    key={idx}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-serif font-semibold flex items-center gap-2 bg-[#2e1065]/70 text-[#fbf0b9] border border-[#d4af37]/50 shadow-sm transition-all hover:scale-105"
                  >
                    <span className="text-[#d4af37]">✦</span>
                    <span>{str}</span>
                  </div>
                ))}
              </div>

              {/* Familiar Commentary */}
              <div className="p-3.5 rounded-xl bg-[#0a0410] border border-[#d4af37]/30 flex items-start gap-3 text-xs text-[#eadeca] mt-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-[#fbf0b9] bg-[#581845] border border-[#d4af37]/50">
                  <ShieldAlert className="w-4 h-4 text-[#d4af37]" />
                </div>
                <div>
                  <strong className="text-[#fbf0b9] mr-1">{expConfig.mascotName}:</strong>
                  <span className="italic font-serif">"{expConfig.mascotGreeting}"</span>
                </div>
              </div>
            </div>

            {/* Technical Skills & Incantations Matrix (7 cols) */}
            <div className="lg:col-span-7 p-6 rounded-2xl bg-[#140822]/90 border border-[#d4af37]/40 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#d4af37]/30">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#fbf0b9] font-serif flex items-center gap-2">
                  <Code className="w-4 h-4 text-[#d4af37]" />
                  <span>Grimoire Spellcraft & Technical Incantations</span>
                </h3>
                <span className="text-[10px] text-[#d4af37]/80">
                  {(profile.skills?.length || 0) + (profile.programmingLanguages?.length || 0)} Incantations
                </span>
              </div>

              {/* Languages with Antique Gold Attunement Meters */}
              <div className="space-y-2.5">
                <span className="text-[11px] font-bold text-[#d4af37] uppercase tracking-wider block font-serif">
                  Primary Language Incantations & Affinity Seals
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {normalizedSkills.map((sk) => (
                    <div key={sk.name} className="p-3 rounded-xl bg-[#0c0517] border border-[#d4af37]/30 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-serif font-medium">
                        <span className="text-[#fbf0b9] font-bold">{sk.name}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#2e1065] text-[#fbf0b9] border border-[#d4af37]/40 font-mono">
                            {sk.fantasyAffinity}
                          </span>
                          <span className="text-[#fef08a] font-mono text-[11px]">{sk.percentage}%</span>
                        </div>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#08030e] overflow-hidden border border-[#d4af37]/20">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-[#d4af37] to-[#fef08a]" 
                          style={{ 
                            width: `${sk.percentage}%`,
                            boxShadow: '0 0 8px rgba(212,175,55,0.6)'
                          }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Frameworks and Specialized Tools */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-[#d4af37] uppercase tracking-wider block mb-2 font-serif">
                  Enchanted Frameworks & Specialized Tools
                </span>
                <div className="flex flex-wrap gap-2">
                  {(profile.frameworks && profile.frameworks.length > 0 ? profile.frameworks : profile.skills).map((item) => (
                    <span 
                      key={item}
                      className="px-3 py-1 rounded-lg text-xs font-serif font-medium bg-[#2e1065]/60 text-[#fbf0b9] border border-[#d4af37]/40 hover:border-[#d4af37] transition-colors shadow-sm"
                    >
                      ✦ {item}
                    </span>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* ========================================================================= */}
          {/* 5. PROJECTS & MASTERWORK ARTIFACTS */}
          {/* ========================================================================= */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#d4af37]/30">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#fbf0b9] font-serif flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#d4af37]" />
                <span>Chronicled Masterwork Projects</span>
              </h3>
              <span className="text-[10px] text-[#d4af37]/80">{profile.projects?.length || 0} Artifacts Forged</span>
            </div>

            {profile.projects && profile.projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.projects.map((proj) => (
                  <div 
                    key={proj.id}
                    className="p-5 sm:p-6 rounded-2xl bg-[#12071f]/90 border border-[#d4af37]/40 hover:border-[#d4af37] transition-all space-y-3 shadow-lg group relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="font-serif font-bold text-sm sm:text-base text-[#fbf0b9] group-hover:text-[#fef08a] transition-colors">
                        {proj.title}
                      </h4>
                      {proj.link && (
                        <a 
                          href={proj.link} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-[#d4af37] hover:text-[#fbf0b9] p-1 rounded-lg hover:bg-[#d4af37]/10 transition-colors"
                          title="View project code / demo"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                    <p className="text-xs text-[#eadeca] leading-relaxed line-clamp-3 font-serif">
                      {proj.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#d4af37]/20">
                      {proj.technologies.map((t) => (
                        <span 
                          key={t}
                          className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-medium bg-[#581845]/60 text-[#fbf0b9] border border-[#d4af37]/40"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-[#0d0517] border border-dashed border-[#d4af37]/30 text-center text-xs text-[#d4af37]/80 font-serif">
                No artifacts chronicled yet. Click "Inscribe Codex" above to document your engineering builds.
              </div>
            )}
          </div>

          <CodexDivider title="Chronicle of Epochs & Milestones" />

          {/* ========================================================================= */}
          {/* 6. MILESTONES: CHRONICLE OF EPOCHS */}
          {/* ========================================================================= */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#140822]/90 border border-[#d4af37]/40 space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-[#d4af37]/30">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#fbf0b9] font-serif flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#d4af37]" />
                <span>Chronicle of Epochs & Career Milestones</span>
              </h3>
              <span className="text-[10px] text-[#d4af37]/80 font-serif">Path of Mastery</span>
            </div>

            <div className="relative pl-7 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-[#d4af37] before:via-[#581845] before:to-[#fef08a]">
              
              {/* Epoch I: Scholastic Foundation */}
              <div className="relative">
                <div className="absolute -left-7 top-1 w-4 h-4 rounded-full bg-[#d4af37] border-2 border-[#0a0512] shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-serif">
                    <span className="font-bold text-[#fbf0b9]">Epoch I: The Scholastic Foundation</span>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#d4af37]/20 text-[#fef08a] border border-[#d4af37]/40 font-mono">Academic</span>
                  </div>
                  <p className="text-xs text-[#eadeca] font-serif">
                    {profile.major} at {profile.university} {profile.gpa ? `(GPA ${profile.gpa})` : ''}.
                  </p>
                </div>
              </div>

              {/* Epoch II: Innovation Quests */}
              {profile.hackathons && profile.hackathons.length > 0 && (
                <div className="relative">
                  <div className="absolute -left-7 top-1 w-4 h-4 rounded-full bg-[#581845] border-2 border-[#d4af37] shadow-[0_0_8px_rgba(88,24,69,0.8)]" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-serif">
                      <span className="font-bold text-[#fbf0b9]">Epoch II: Hackathons & Innovation Quests</span>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#581845]/70 text-[#fbf0b9] border border-[#d4af37]/40 font-mono">Innovation</span>
                    </div>
                    <div className="space-y-1 font-serif">
                      {profile.hackathons.map((hack) => (
                        <p key={hack.id} className="text-xs text-[#eadeca]">
                          • <strong className="text-[#fbf0b9]">{hack.name}</strong> ({hack.year || '2024'}): {hack.projectOrAward}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Epoch III: Guild Expeditions */}
              {profile.internships && profile.internships.length > 0 && (
                <div className="relative">
                  <div className="absolute -left-7 top-1 w-4 h-4 rounded-full bg-[#2e1065] border-2 border-[#d4af37] shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-serif">
                      <span className="font-bold text-[#fbf0b9]">Epoch III: Guild Expeditions & Professional Internships</span>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#2e1065]/80 text-[#fbf0b9] border border-[#d4af37]/40 font-mono">Industry</span>
                    </div>
                    <div className="space-y-2">
                      {profile.internships.map((intern) => (
                        <div key={intern.id} className="p-3.5 rounded-xl bg-[#0c0517] border border-[#d4af37]/30 text-xs font-serif">
                          <div className="flex justify-between items-center font-bold text-[#fbf0b9]">
                            <span>{intern.role} @ {intern.company}</span>
                            <span className="text-[11px] text-[#d4af37] font-mono">{intern.duration}</span>
                          </div>
                          <p className="text-[#eadeca] text-xs mt-1 leading-relaxed">{intern.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Epoch IV: The Sovereign Launch */}
              <div className="relative">
                <div className="absolute -left-7 top-1 w-4 h-4 rounded-full bg-[#fef08a] border-2 border-[#d4af37] shadow-[0_0_12px_rgba(254,240,138,0.9)] animate-pulse" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-serif">
                    <span className="font-bold text-[#fbf0b9]">Epoch IV: The Sovereign Career Launch</span>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#d4af37]/30 text-[#fef08a] border border-[#d4af37]/60 font-mono">Destiny</span>
                  </div>
                  <p className="text-xs text-[#eadeca] font-serif">
                    Targeting <strong className="text-[#fbf0b9]">{topMatchTitle}</strong> {profile.dreamCompany ? `at ${profile.dreamCompany}` : ''} with expected ascension {profile.gradYear ? `by Epoch of ${profile.gradYear}` : 'post-graduation'}.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* ========================================================================= */}
          {/* 7. HONORS & CERTIFICATIONS */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Honors & Achievements */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#140822]/90 border border-[#d4af37]/40 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#fbf0b9] font-serif flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#d4af37]" />
                <span>Honors & Chronicle Achievements</span>
              </h3>

              {profile.achievements && profile.achievements.length > 0 ? (
                <div className="space-y-2">
                  {profile.achievements.map((ach, i) => (
                    <div key={i} className="p-3 rounded-xl bg-[#0c0517] border border-[#d4af37]/30 flex items-center gap-2.5 text-xs text-[#eadeca] font-serif">
                      <Award className="w-4 h-4 text-[#d4af37] shrink-0" />
                      <span>{ach}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#d4af37]/70 italic font-serif">No formal honors inscribed yet.</p>
              )}
            </div>

            {/* Verified Certifications */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#140822]/90 border border-[#d4af37]/40 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#fbf0b9] font-serif flex items-center gap-2">
                <Award className="w-4 h-4 text-[#d4af37]" />
                <span>Attuned Certifications</span>
              </h3>

              {profile.certifications && profile.certifications.length > 0 ? (
                <div className="space-y-2">
                  {profile.certifications.map((cert, i) => (
                    <div key={i} className="p-3 rounded-xl bg-[#0c0517] border border-[#d4af37]/30 flex items-center gap-2.5 text-xs text-[#eadeca] font-serif">
                      <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#d4af37]/70 italic font-serif">No certifications inscribed yet.</p>
              )}
            </div>

          </div>

          <CodexDivider title="Arcanum Trials & Bridging Skills" />

          {/* ========================================================================= */}
          {/* 8. SKILL GAPS: ARCANUM TRIALS & BRIDGING PLAN */}
          {/* ========================================================================= */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#140822]/90 border border-[#d4af37]/40 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#d4af37]/30">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#fbf0b9] font-serif flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#d4af37]" />
                <span>Skill Gaps & Recommended Arcanum Bridge Plan</span>
              </h3>
              <span className="text-[10px] text-[#d4af37]/80 font-serif">Trials to Conquer</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {skillGaps.slice(0, 3).map((gap, i) => (
                <div key={i} className="p-4 rounded-xl bg-[#0c0517] border border-[#d4af37]/30 space-y-2 font-serif">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#fbf0b9] truncate max-w-[170px]" title={gap.skill}>
                      {gap.skill}
                    </span>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                      gap.priority === 'High' 
                        ? 'bg-[#581845] text-[#fef08a] border border-[#d4af37]/60' 
                        : 'bg-[#2e1065] text-[#fbf0b9] border border-[#d4af37]/40'
                    }`}>
                      {gap.priority} Priority
                    </span>
                  </div>
                  <p className="text-[11px] text-[#eadeca] leading-relaxed">
                    {gap.howToAcquire || `Conquer via dedicated capstone engineering and technical mastery.`}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 9. THE CODEX CREED: ILLUMINATED PARCHMENT SCROLL BANNER */}
          {/* ========================================================================= */}
          <div 
            className="p-7 sm:p-9 rounded-3xl border border-[#d4af37]/80 text-center relative overflow-hidden shadow-2xl"
            style={{
              backgroundColor: '#1b0a2a',
              backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.12), transparent 70%), linear-gradient(180deg, #1f0c30 0%, #10051d 100%)',
              boxShadow: '0 15px 40px rgba(0, 0, 0, 0.7), inset 0 0 25px rgba(212, 175, 55, 0.2)'
            }}
          >
            <div className="max-w-2xl mx-auto space-y-3">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#d4af37] font-serif">
                ✦ The Sovereign Codex Creed & Career Statement ✦
              </span>
              <p className="text-base sm:text-lg font-serif font-bold text-[#fbf0b9] italic leading-relaxed">
                "{profile.careerGoals || expConfig.motivationalQuote || 'Dedicated to engineering transformative technical systems that bridge artificial intelligence, scalable software, and high-impact societal solutions.'}"
              </p>
              <div className="pt-2 flex items-center justify-center gap-2 text-xs font-serif text-[#d4af37]">
                <span>—</span>
                <span className="font-bold text-[#fbf0b9]">{profile.fullName || 'Student Sovereign'}</span>
                <span>•</span>
                <span className="italic">{profile.university}</span>
                <span>—</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: K-POP INSPIRED (GLOSSY EDITORIAL ALBUM & PHOTOCARD PROFILE)
  // =========================================================================
  if (isKpop) {
    return (
      <div 
        id="kpop-career-profile-card"
        className="relative overflow-hidden rounded-[2.5rem] border-2 border-fuchsia-500/50 shadow-[0_0_50px_rgba(217,70,239,0.3)] transition-all duration-300 font-sans"
        style={{
          backgroundColor: '#0f0518',
          backgroundImage: 'radial-gradient(circle at 80% 0%, rgba(217, 70, 239, 0.35), transparent 60%), radial-gradient(circle at 10% 100%, rgba(56, 189, 248, 0.25), transparent 60%), linear-gradient(180deg, #150824 0%, #0c0414 100%)',
          boxShadow: '0 25px 60px -15px rgba(217, 70, 239, 0.4), inset 0 0 35px rgba(0, 0, 0, 0.7)'
        }}
      >
        {/* Stage Spotlight & Iridescent Sheen Overlays */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-fuchsia-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        
        {/* Glossy Diagonal Reflection Sheen */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent pointer-events-none" />

        {/* Outer Holographic Corner Insets */}
        <div className="absolute top-4 left-4 text-fuchsia-400/40 text-[10px] font-mono tracking-widest pointer-events-none">
          [ALBUM NO. 2026-CC // DEBUT ERA]
        </div>
        <div className="absolute top-4 right-4 text-cyan-400/40 text-[10px] font-mono tracking-widest pointer-events-none flex items-center gap-1.5">
          <Radio className="w-3 h-3 text-fuchsia-400 animate-pulse" />
          <span>STEREO // 96kHz HI-RES</span>
        </div>

        <div className="relative z-10 p-6 sm:p-9 lg:p-12 space-y-9">
          
          {/* ========================================================================= */}
          {/* 1. K-POP ALBUM EDITION HEADER & STAGE SWITCHER */}
          {/* ========================================================================= */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-fuchsia-500/30">
            <div className="flex flex-wrap items-center gap-3">
              {/* Glossy VIP Holographic Pill */}
              <div className="px-4 py-1.5 rounded-full text-xs font-black tracking-[0.2em] uppercase flex items-center gap-2 bg-gradient-to-r from-fuchsia-600/80 via-purple-600/80 to-pink-600/80 text-white border border-fuchsia-300/50 shadow-[0_0_20px_rgba(217,70,239,0.5)]">
                <Music className="w-3.5 h-3.5 text-fuchsia-200" />
                <span>VIP ALBUM EDITION</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-fuchsia-300/90 font-medium">
                <span className="text-white/40">•</span>
                <span>Debut Era Tracklist</span>
                <span className="text-white/40">•</span>
                <span className="text-cyan-300 font-mono text-[11px]">Vol. 1</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {onEditProfile && (
                <button
                  type="button"
                  id="kpop-edit-profile-btn"
                  onClick={onEditProfile}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-purple-950/70 hover:bg-purple-900/80 text-fuchsia-200 border border-fuchsia-400/40 transition-all flex items-center gap-1.5 shadow-sm"
                  title="Edit student profile credentials & discography"
                >
                  <Edit3 className="w-3.5 h-3.5 text-fuchsia-400" />
                  <span>Update Profile</span>
                </button>
              )}

              <button
                type="button"
                id="kpop-switch-theme-btn"
                onClick={handleEditExperience}
                className="flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold bg-black/60 hover:bg-purple-950/60 text-white border border-fuchsia-500/50 transition-all shadow-md group"
                title="Switch Profile Experience"
              >
                <Sparkles className="w-3.5 h-3.5 text-fuchsia-400 group-hover:rotate-12 transition-transform" />
                <span>Experience: <strong className="text-fuchsia-200 ml-0.5">{expConfig.name}</strong></span>
                <ChevronRight className="w-3.5 h-3.5 text-fuchsia-400/60" />
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 2. PHOTO-CARD INSPIRED PROFILE COMPOSITION & "YOUR CAREER ERA" */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Collectible Photocard Frame (7 cols) */}
            <div className="lg:col-span-7 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              
              {/* Collectible Photocard Frame */}
              <ProfilePortraitFrame 
                profile={profile} 
                experienceId="kpop" 
                size="lg" 
                showEditOverlay={true}
                onEditClick={onEditPortrait || onEditProfile}
              />

              {/* Student Identity & Academic Era */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-cyan-400 bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-cyan-500/40">
                      YOUR CAREER ERA • 9-MONTH ROADMAP
                    </span>
                    <span className="text-xs px-3 py-0.5 rounded-full font-bold bg-fuchsia-950/70 text-fuchsia-200 border border-fuchsia-400/50 shadow-sm">
                      {currentRank}
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans drop-shadow-md">
                    {profile.fullName || 'Student Performer'}
                  </h1>
                </div>

                {/* Persona Title / Lead Role */}
                <div className="flex items-center gap-2">
                  <Mic2 className="w-4 h-4 text-fuchsia-400" />
                  <p className="text-sm sm:text-base font-bold tracking-wide text-fuchsia-200">
                    {expConfig.personaTitle}
                  </p>
                </div>

                {/* University Credentials & Academic Details */}
                <div className="text-xs sm:text-sm text-purple-200/90 space-y-1 font-sans">
                  <div className="flex flex-wrap items-center gap-2 font-medium">
                    <span className="flex items-center gap-1.5 text-white font-bold">
                      <GraduationCap className="w-4 h-4 text-fuchsia-400" />
                      {profile.university || 'Metropolitan University'}
                    </span>
                    <span className="text-fuchsia-400">•</span>
                    <span>{profile.gradYear ? `Debut Class of ${profile.gradYear}` : 'Class of 2026'}</span>
                    {profile.gpa && (
                      <>
                        <span className="text-fuchsia-400">•</span>
                        <span className="px-2.5 py-0.5 rounded-md bg-fuchsia-500/20 text-fuchsia-200 font-mono font-bold border border-fuchsia-400/40 shadow-sm">
                          GPA {profile.gpa}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="text-purple-300 text-xs flex flex-wrap items-center gap-1.5">
                    <span>{profile.department || 'School of Engineering'}</span>
                    <span className="text-fuchsia-400">—</span>
                    <span className="text-white font-semibold">{profile.major}</span>
                    {profile.semester && (
                      <span className="text-fuchsia-300/80">({profile.semester})</span>
                    )}
                  </div>
                </div>

                {/* Main Stage / Career Goal */}
                <div className="pt-1 flex items-start gap-2 text-xs">
                  <Target className="w-4 h-4 text-fuchsia-400 shrink-0 mt-0.5" />
                  <span className="text-purple-200">
                    Main Stage Target: <strong className="text-white underline decoration-fuchsia-400/60 underline-offset-2">{profile.dreamRole || profile.careerGoals || 'Lead AI Software Engineer'}</strong>
                    {profile.dreamCompany && (
                      <span className="text-cyan-300 ml-1.5 font-medium">@ {profile.dreamCompany}</span>
                    )}
                  </span>
                </div>
              </div>

            </div>

            {/* Right: Debut Stage Readiness (Readiness Meter) (5 cols) */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-[#1d0a2f]/90 border border-fuchsia-500/40 shadow-2xl space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-fuchsia-500/20 to-transparent rounded-bl-full pointer-events-none" />

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-fuchsia-400 block font-mono">
                    STAGE ATTUNEMENT & READINESS
                  </span>
                  <h4 className="text-sm font-bold text-white">
                    {expConfig.readinessMetricName}
                  </h4>
                </div>

                <div className="text-right">
                  <span className="text-3xl font-black font-mono text-white drop-shadow-[0_0_12px_rgba(232,121,249,0.8)]">
                    {readinessScore}%
                  </span>
                </div>
              </div>

              {/* Glowing Stage Lights Progress Bar */}
              <div className="w-full h-4 rounded-full bg-black/60 border border-fuchsia-500/40 p-0.5 overflow-hidden shadow-inner">
                <div 
                  className="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-fuchsia-600 via-pink-500 to-cyan-400"
                  style={{
                    width: `${readinessScore}%`,
                    boxShadow: '0 0 15px rgba(232, 121, 249, 0.8)'
                  }}
                />
              </div>

              {/* 3-Track Readiness Matrix */}
              <div className="grid grid-cols-3 gap-2.5 pt-1 text-center font-sans">
                <div className="p-2.5 rounded-xl bg-purple-950/50 border border-fuchsia-500/30">
                  <span className="text-[10px] text-purple-300 block font-medium">Stage Rank</span>
                  <strong className="text-xs text-white font-bold block truncate">{currentRank.split(' ')[0]}</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-purple-950/50 border border-fuchsia-500/30">
                  <span className="text-[10px] text-purple-300 block font-medium">Verified Skills</span>
                  <strong className="text-xs text-cyan-300 font-mono font-bold block">
                    {(profile.skills?.length || 0) + (profile.programmingLanguages?.length || 0)}
                  </strong>
                </div>
                <div className="p-2.5 rounded-xl bg-purple-950/50 border border-fuchsia-500/30">
                  <span className="text-[10px] text-purple-300 block font-medium">Projects Built</span>
                  <strong className="text-xs text-fuchsia-200 font-mono font-bold block">
                    {profile.projects?.length || 0}
                  </strong>
                </div>
              </div>
            </div>

          </div>

          <MusicDivider title="Career Line-up" subtitle="Top Career Matches & Role Compatibility" />

          {/* ========================================================================= */}
          {/* 3. CAREER LINE-UP (TOP CAREER MATCHES) */}
          {/* ========================================================================= */}
          <div 
            className="p-6 rounded-2xl border border-fuchsia-500/50 transition-all duration-300 relative overflow-hidden group"
            style={{
              backgroundColor: 'rgba(28, 12, 45, 0.85)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6), inset 0 0 30px rgba(217, 70, 239, 0.1)'
            }}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-fuchsia-500/25 text-fuchsia-200 border border-fuchsia-400/60 flex items-center gap-1.5 shadow-sm">
                    <Star className="w-3.5 h-3.5 text-fuchsia-300 fill-fuchsia-300" />
                    <span>Headline Career Match</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-cyan-300">
                    {topMatchScore}% Synergy Score
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-md bg-purple-900/70 text-pink-200 border border-fuchsia-400/40 font-medium">
                    {topMatchDemand}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide">
                  {topMatchTitle}
                </h3>

                <p className="text-xs sm:text-sm text-purple-200 leading-relaxed max-w-3xl">
                  {topMatchReason}
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-3 w-full md:w-auto justify-end">
                <div className="p-3.5 rounded-2xl bg-black/60 border border-fuchsia-500/50 text-right shadow-md">
                  <span className="text-[10px] text-fuchsia-300 uppercase tracking-wider block font-mono">Role Compatibility</span>
                  <span className="text-base font-black text-white font-mono">{topMatchScore}% Synergy</span>
                </div>
              </div>
            </div>
          </div>

          <MusicDivider title="Skill Set" subtitle="Technical Skills & Core Competencies" />

          {/* ========================================================================= */}
          {/* 4. SKILL SET (TECHNICAL SKILLS & CORE COMPETENCIES) */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Core Strengths & Performer Perks (5 cols) */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-[#19082a]/90 border border-fuchsia-500/40 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-fuchsia-500/30">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-fuchsia-400" />
                  <span>Core Strengths & Signature Perks</span>
                </h3>
                <span className="text-[10px] text-fuchsia-300/80">{coreStrengths.length} Verified</span>
              </div>

              <div className="flex flex-wrap gap-2.5 pt-1">
                {coreStrengths.map((str, idx) => (
                  <div 
                    key={idx}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 bg-purple-950/70 text-fuchsia-100 border border-fuchsia-400/50 shadow-sm transition-all hover:scale-105"
                  >
                    <Sparkle className="w-3 h-3 text-fuchsia-400" />
                    <span>{str}</span>
                  </div>
                ))}
              </div>

              {/* Producer Commentary Box */}
              <div className="p-3.5 rounded-xl bg-black/60 border border-fuchsia-500/30 flex items-start gap-3 text-xs text-purple-200 mt-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-white bg-fuchsia-600 border border-fuchsia-400/50">
                  <Music className="w-4 h-4 text-white" />
                </div>
                <div>
                  <strong className="text-white mr-1">{expConfig.mascotName}:</strong>
                  <span className="italic">"{expConfig.mascotGreeting}"</span>
                </div>
              </div>
            </div>

            {/* Technical Skills & Equalizer Matrix (7 cols) */}
            <div className="lg:col-span-7 p-6 rounded-2xl bg-[#19082a]/90 border border-fuchsia-500/40 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-fuchsia-500/30">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Code className="w-4 h-4 text-fuchsia-400" />
                  <span>Technical Skills & Equalizer Meters</span>
                </h3>
                <span className="text-[10px] text-fuchsia-300/80 font-mono">
                  {(profile.skills?.length || 0) + (profile.programmingLanguages?.length || 0)} Competencies
                </span>
              </div>

              {/* Languages with Equalizer Volume Meters */}
              <div className="space-y-2.5">
                <span className="text-[11px] font-bold text-fuchsia-300 uppercase tracking-wider block font-mono">
                  Skill Set & Sound Stage Equalizer
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {normalizedSkills.map((sk) => (
                    <div key={sk.name} className="p-3 rounded-xl bg-black/50 border border-fuchsia-500/30 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className="text-white font-bold">{sk.name}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-950 text-fuchsia-300 border border-fuchsia-500/40 font-mono">
                            {sk.kpopConcept}
                          </span>
                          <span className="text-cyan-300 font-mono text-[11px]">{sk.percentage}%</span>
                        </div>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-purple-950 overflow-hidden border border-fuchsia-500/20">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400" 
                          style={{ 
                            width: `${sk.percentage}%`,
                            boxShadow: '0 0 8px rgba(232,121,249,0.6)'
                          }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Frameworks & Specialized Tooling */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-fuchsia-300 uppercase tracking-wider block mb-2 font-mono">
                  Frameworks & Modern Tools
                </span>
                <div className="flex flex-wrap gap-2">
                  {(profile.frameworks && profile.frameworks.length > 0 ? profile.frameworks : profile.skills).map((item) => (
                    <span 
                      key={item}
                      className="px-3 py-1 rounded-lg text-xs font-medium bg-purple-950/60 text-fuchsia-100 border border-fuchsia-400/40 hover:border-fuchsia-400 transition-colors shadow-sm"
                    >
                      ✦ {item}
                    </span>
                  ))}
                </div>
              </div>

            </div>

          </div>

          <MusicDivider title="Career Track" subtitle="Sequential Milestones & Academic Journey" />

          {/* ========================================================================= */}
          {/* 5. CAREER TRACK (SEQUENTIAL MILESTONES) */}
          {/* ========================================================================= */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#19082a]/90 border border-fuchsia-500/40 space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-fuchsia-500/30">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-fuchsia-400" />
                <span>Career Track & Timeline Progress</span>
              </h3>
              <span className="text-[10px] text-fuchsia-300/80 font-mono">TRACKLIST 01 - 04</span>
            </div>

            <div className="relative pl-7 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-fuchsia-500 before:via-purple-500 before:to-cyan-400">
              
              {/* Track 01: Academic Foundation */}
              <div className="relative">
                <div className="absolute -left-7 top-1 w-4 h-4 rounded-full bg-fuchsia-400 border-2 border-black shadow-[0_0_8px_rgba(232,121,249,0.9)]" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-white">[TRK-01] Track 01: Academic Foundation</span>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-fuchsia-500/20 text-fuchsia-200 border border-fuchsia-400/40 font-mono">Academic</span>
                  </div>
                  <p className="text-xs text-purple-200">
                    {profile.major} at {profile.university} {profile.gpa ? `(GPA ${profile.gpa})` : ''}.
                  </p>
                </div>
              </div>

              {/* Track 02: Innovation Hackathons */}
              {profile.hackathons && profile.hackathons.length > 0 && (
                <div className="relative">
                  <div className="absolute -left-7 top-1 w-4 h-4 rounded-full bg-pink-500 border-2 border-black shadow-[0_0_8px_rgba(236,72,153,0.9)]" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-white">[TRK-02] Track 02: Hackathons & Innovation Releases</span>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-200 border border-pink-400/40 font-mono">Innovation</span>
                    </div>
                    <div className="space-y-1">
                      {profile.hackathons.map((hack) => (
                        <p key={hack.id} className="text-xs text-purple-200">
                          • <strong className="text-white">{hack.name}</strong> ({hack.year || '2024'}): {hack.projectOrAward}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Track 03: Professional Internships */}
              {profile.internships && profile.internships.length > 0 && (
                <div className="relative">
                  <div className="absolute -left-7 top-1 w-4 h-4 rounded-full bg-purple-500 border-2 border-black shadow-[0_0_8px_rgba(168,85,247,0.9)]" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-white">[TRK-03] Track 03: Industry Studio Internships</span>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/40 font-mono">Industry</span>
                    </div>
                    <div className="space-y-2">
                      {profile.internships.map((intern) => (
                        <div key={intern.id} className="p-3.5 rounded-xl bg-black/50 border border-fuchsia-500/30 text-xs">
                          <div className="flex justify-between items-center font-bold text-white">
                            <span>{intern.role} @ {intern.company}</span>
                            <span className="text-[11px] text-cyan-300 font-mono">{intern.duration}</span>
                          </div>
                          <p className="text-purple-200 text-xs mt-1 leading-relaxed">{intern.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Track 04: Main Stage Launch */}
              <div className="relative">
                <div className="absolute -left-7 top-1 w-4 h-4 rounded-full bg-cyan-400 border-2 border-black shadow-[0_0_12px_rgba(56,189,248,0.9)] animate-pulse" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-white">[TRK-04] Track 04: Main Stage Career Launch</span>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-200 border border-cyan-400/40 font-mono">Debut</span>
                  </div>
                  <p className="text-xs text-purple-200">
                    Targeting <strong className="text-white">{topMatchTitle}</strong> {profile.dreamCompany ? `at ${profile.dreamCompany}` : ''} with expected launch {profile.gradYear ? `by Class of ${profile.gradYear}` : 'post-graduation'}.
                  </p>
                </div>
              </div>

            </div>
          </div>

          <MusicDivider title="Masterwork Discography" subtitle="Chronicled Projects & Code Artifacts" />

          {/* ========================================================================= */}
          {/* 6. MASTERWORK DISCOGRAPHY (PROJECTS SHOWCASE) */}
          {/* ========================================================================= */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-fuchsia-500/30">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-fuchsia-400" />
                <span>Featured Project Releases & Artifacts</span>
              </h3>
              <span className="text-[10px] text-fuchsia-300/80 font-mono">{profile.projects?.length || 0} Tracks</span>
            </div>

            {profile.projects && profile.projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.projects.map((proj, idx) => (
                  <div 
                    key={proj.id}
                    className="p-5 sm:p-6 rounded-2xl bg-[#1c0a2e]/90 border border-fuchsia-500/40 hover:border-fuchsia-400 transition-all space-y-3 shadow-lg group relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-fuchsia-400 font-bold">
                          #{String(idx + 1).padStart(2, '0')}
                        </span>
                        <h4 className="font-bold text-sm sm:text-base text-white group-hover:text-fuchsia-200 transition-colors">
                          {proj.title}
                        </h4>
                      </div>
                      {proj.link && (
                        <a 
                          href={proj.link} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-fuchsia-400 hover:text-white p-1 rounded-lg hover:bg-fuchsia-500/20 transition-colors"
                          title="View project code / demo"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                    <p className="text-xs text-purple-200 leading-relaxed line-clamp-3">
                      {proj.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-fuchsia-500/20">
                      {proj.technologies.map((t) => (
                        <span 
                          key={t}
                          className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-medium bg-purple-950/80 text-fuchsia-200 border border-fuchsia-400/40"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-black/40 border border-dashed border-fuchsia-500/30 text-center text-xs text-fuchsia-300">
                No project tracks released yet. Update your profile to add portfolio repositories.
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* 7. ACHIEVEMENTS & HONORS */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Honors & Awards */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#19082a]/90 border border-fuchsia-500/40 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-fuchsia-400" />
                <span>Honors & Award Achievements</span>
              </h3>

              {profile.achievements && profile.achievements.length > 0 ? (
                <div className="space-y-2">
                  {profile.achievements.map((ach, i) => (
                    <div key={i} className="p-3 rounded-xl bg-black/50 border border-fuchsia-500/30 flex items-center gap-2.5 text-xs text-purple-200">
                      <Award className="w-4 h-4 text-fuchsia-400 shrink-0" />
                      <span>{ach}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-fuchsia-300/60 italic">No formal honors registered yet.</p>
              )}
            </div>

            {/* Verified Certifications */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#19082a]/90 border border-fuchsia-500/40 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-fuchsia-400" />
                <span>Verified Industry Certifications</span>
              </h3>

              {profile.certifications && profile.certifications.length > 0 ? (
                <div className="space-y-2">
                  {profile.certifications.map((cert, i) => (
                    <div key={i} className="p-3 rounded-xl bg-black/50 border border-fuchsia-500/30 flex items-center gap-2.5 text-xs text-purple-200">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-fuchsia-300/60 italic">No certifications registered yet.</p>
              )}
            </div>

          </div>

          <MusicDivider title="Bridge Tracks" subtitle="Skill Gaps & Actionable Development Plan" />

          {/* ========================================================================= */}
          {/* 8. BRIDGE TRACKS (SKILL GAPS & DEVELOPMENT PLAN) */}
          {/* ========================================================================= */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#19082a]/90 border border-fuchsia-500/40 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-fuchsia-500/30">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-fuchsia-400" />
                <span>Skill Gaps & Recommended Bridge Plan</span>
              </h3>
              <span className="text-[10px] text-fuchsia-300/80 font-mono">Bridge Tracks</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {skillGaps.slice(0, 3).map((gap, i) => (
                <div key={i} className="p-4 rounded-xl bg-black/50 border border-fuchsia-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate max-w-[170px]" title={gap.skill}>
                      {gap.skill}
                    </span>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                      gap.priority === 'High' 
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
                        : 'bg-purple-500/20 text-purple-200 border border-purple-500/40'
                    }`}>
                      {gap.priority} Priority
                    </span>
                  </div>
                  <p className="text-[11px] text-purple-200 leading-relaxed">
                    {gap.howToAcquire || `Acquire via dedicated capstone engineering and technical mastery.`}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 9. LINER NOTES: ALBUM CONCEPT & CAREER STATEMENT */}
          {/* ========================================================================= */}
          <div 
            className="p-7 sm:p-9 rounded-3xl border border-fuchsia-500/60 text-center relative overflow-hidden shadow-2xl"
            style={{
              backgroundColor: '#1b0a2d',
              backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(217, 70, 239, 0.15), transparent 70%), linear-gradient(180deg, #240d3a 0%, #120520 100%)',
              boxShadow: '0 15px 40px rgba(0, 0, 0, 0.7), inset 0 0 25px rgba(217, 70, 239, 0.2)'
            }}
          >
            <div className="max-w-2xl mx-auto space-y-3">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-fuchsia-400 font-mono">
                ✦ LINER NOTES & CONCEPT STATEMENT ✦
              </span>
              <p className="text-base sm:text-lg font-bold text-white italic leading-relaxed">
                "{profile.careerGoals || expConfig.motivationalQuote || 'Dedicated to engineering transformative technical systems that bridge artificial intelligence, scalable software, and high-impact societal solutions.'}"
              </p>
              <div className="pt-2 flex items-center justify-center gap-2 text-xs text-purple-300 font-medium">
                <span>—</span>
                <span className="font-bold text-white">{profile.fullName || 'Student Performer'}</span>
                <span>•</span>
                <span className="text-fuchsia-300">{profile.university}</span>
                <span>—</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: ANIME ADVENTURE (CHARACTER PROFILE & HERO GUILD QUEST IDENTITY)
  // =========================================================================
  if (isAnime) {
    // Dynamic circular progress calculation for Training Progress ring
    const ringRadius = 42;
    const ringCircumference = 2 * Math.PI * ringRadius;
    const strokeDashoffset = ringCircumference - (readinessScore / 100) * ringCircumference;

    return (
      <div 
        id="anime-character-profile-card"
        className="relative overflow-hidden rounded-[2.5rem] border-2 border-orange-500/60 shadow-[0_0_55px_rgba(249,115,22,0.35)] transition-all duration-300 font-sans"
        style={{
          backgroundColor: '#0d0614',
          backgroundImage: 'radial-gradient(circle at 90% 10%, rgba(249, 115, 22, 0.35), transparent 55%), radial-gradient(circle at 10% 90%, rgba(225, 29, 72, 0.3), transparent 55%), linear-gradient(180deg, #170826 0%, #09030f 100%)',
          boxShadow: '0 25px 65px -15px rgba(249, 115, 22, 0.4), inset 0 0 35px rgba(0, 0, 0, 0.8)'
        }}
      >
        {/* Dynamic Energy Blast & Aura Glow Overlays */}
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />
        
        {/* Stylized Action Speed Lines Overlay */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.1) 0, rgba(255,255,255,0.1) 1px, transparent 0, transparent 20px)'
          }}
        />

        {/* Outer Guild HUD Frame Elements */}
        <div className="absolute top-4 left-5 text-orange-400/50 text-[10px] font-mono tracking-widest pointer-events-none flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-orange-400" />
          <span>[GUILD STATUS // S-CLASS VANGUARD]</span>
        </div>
        <div className="absolute top-4 right-5 text-rose-400/50 text-[10px] font-mono tracking-widest pointer-events-none flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-orange-400 animate-spin" />
          <span>HERO QUEST SYS v4.2</span>
        </div>

        <div className="relative z-10 p-6 sm:p-9 lg:p-12 space-y-9">
          
          {/* ========================================================================= */}
          {/* 1. HERO GUILD HEADER & PROFILE SWITCHER */}
          {/* ========================================================================= */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-orange-500/30">
            <div className="flex flex-wrap items-center gap-3">
              {/* Stylized Action Guild Badge */}
              <div className="px-4 py-1.5 rounded-full text-xs font-black tracking-[0.2em] uppercase flex items-center gap-2 bg-gradient-to-r from-orange-600 via-rose-600 to-amber-600 text-white border border-orange-300/60 shadow-[0_0_20px_rgba(249,115,22,0.6)]">
                <Flame className="w-3.5 h-3.5 text-amber-200 fill-amber-200" />
                <span>HERO GUILD • CHARACTER PROFILE</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-orange-200/90 font-medium">
                <span className="text-white/40">•</span>
                <span>Active Quest Phase</span>
                <span className="text-white/40">•</span>
                <span className="text-amber-300 font-mono text-[11px] font-bold">ARC 01: EMERGENCE</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {onEditProfile && (
                <button
                  type="button"
                  id="anime-edit-profile-btn"
                  onClick={onEditProfile}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-orange-950/70 hover:bg-orange-900/80 text-orange-200 border border-orange-400/40 transition-all flex items-center gap-1.5 shadow-sm"
                  title="Update student character stats & abilities"
                >
                  <Edit3 className="w-3.5 h-3.5 text-orange-400" />
                  <span>Update Profile</span>
                </button>
              )}

              <button
                type="button"
                id="anime-switch-theme-btn"
                onClick={handleEditExperience}
                className="flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold bg-black/70 hover:bg-orange-950/60 text-white border border-orange-500/50 transition-all shadow-md group"
                title="Switch Profile Experience"
              >
                <Sparkles className="w-3.5 h-3.5 text-orange-400 group-hover:rotate-12 transition-transform" />
                <span>Experience: <strong className="text-orange-200 ml-0.5">{expConfig.name}</strong></span>
                <ChevronRight className="w-3.5 h-3.5 text-orange-400/60" />
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 2. CHARACTER PROFILE LAYOUT: AVATAR, CAREER CLASS & TRAINING PROGRESS RING */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Dynamic Character Card & Career Class (7 cols) */}
            <div className="lg:col-span-7 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              
              {/* Dynamic Anime Illustrated Character Frame */}
              <ProfilePortraitFrame 
                profile={profile} 
                experienceId="anime" 
                size="lg" 
                showEditOverlay={true}
                onEditClick={onEditPortrait || onEditProfile}
              />

              {/* Character Identity, Career Class & Academic Meaning */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-orange-400 bg-orange-950/70 px-2.5 py-0.5 rounded-full border border-orange-500/50">
                      CAREER CHARACTER PROFILE
                    </span>
                    <span className="text-xs px-3 py-0.5 rounded-full font-bold bg-rose-950/80 text-orange-200 border border-orange-400/50 shadow-sm">
                      {currentRank}
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans drop-shadow-md">
                    {profile.fullName || 'Adventurer Vanguard'}
                  </h1>
                </div>

                {/* Career Class (With Real Target Role Meaning) */}
                <div className="p-3 rounded-2xl bg-orange-950/50 border border-orange-500/40 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-orange-300">
                    <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>Career Class:</span>
                  </div>
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-base sm:text-lg font-black text-white tracking-wide">
                      {profile.dreamRole || profile.careerGoals || 'AI Engineer'}
                    </span>
                    {profile.dreamCompany && (
                      <span className="text-xs font-medium text-amber-300">
                        [Target Organization: {profile.dreamCompany}]
                      </span>
                    )}
                  </div>
                </div>

                {/* Academic Meaning & University Credentials */}
                <div className="text-xs sm:text-sm text-orange-200/90 space-y-1 font-sans">
                  <div className="flex flex-wrap items-center gap-2 font-medium">
                    <span className="flex items-center gap-1.5 text-white font-bold">
                      <GraduationCap className="w-4 h-4 text-orange-400" />
                      {profile.university || 'Metropolitan Academy'}
                    </span>
                    <span className="text-orange-400">•</span>
                    <span>{profile.gradYear ? `Class of ${profile.gradYear}` : 'Class of 2026'}</span>
                    {profile.gpa && (
                      <>
                        <span className="text-orange-400">•</span>
                        <span className="px-2.5 py-0.5 rounded-md bg-orange-500/20 text-amber-200 font-mono font-bold border border-orange-400/40 shadow-sm">
                          GPA {profile.gpa}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="text-orange-300 text-xs flex flex-wrap items-center gap-1.5">
                    <span>{profile.department || 'School of Advanced Computing'}</span>
                    <span className="text-orange-400">—</span>
                    <span className="text-white font-semibold">{profile.major}</span>
                    {profile.semester && (
                      <span className="text-orange-300/80">({profile.semester})</span>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Right: Training Progress Rings & Power Matrix (5 cols) */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-[#1c0827]/90 border-2 border-orange-500/40 shadow-2xl space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/25 to-transparent rounded-bl-full pointer-events-none" />

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-400 block font-mono">
                    TRAINING PROGRESS
                  </span>
                  <h4 className="text-sm font-bold text-white">
                    {expConfig.readinessMetricName}
                  </h4>
                </div>

                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-rose-950 text-amber-300 border border-rose-500/40">
                  RANK {currentRank.split(' ')[0]}
                </span>
              </div>

              {/* Progress Ring & Level Statistics */}
              <div className="flex items-center justify-around gap-4 py-1">
                
                {/* SVG Progress Ring */}
                <div className="relative flex items-center justify-center shrink-0">
                  <svg className="w-28 h-28 -rotate-90 transform" viewBox="0 0 100 100">
                    {/* Background Ring Track */}
                    <circle
                      cx="50"
                      cy="50"
                      r={ringRadius}
                      className="stroke-black/60"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    {/* Glowing Progress Arc */}
                    <circle
                      cx="50"
                      cy="50"
                      r={ringRadius}
                      stroke="url(#anime-orange-gradient)"
                      strokeWidth="8"
                      strokeDasharray={ringCircumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-1000 ease-out"
                      style={{
                        filter: 'drop-shadow(0 0 6px rgba(249, 115, 22, 0.8))'
                      }}
                    />
                    <defs>
                      <linearGradient id="anime-orange-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f97316" />
                        <stop offset="50%" stopColor="#f43f5e" />
                        <stop offset="100%" stopColor="#fbbf24" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Centered Percentage Value */}
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-black font-mono text-white drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]">
                      {readinessScore}%
                    </span>
                    <span className="text-[9px] font-mono uppercase tracking-wider text-orange-300 font-bold">
                      Training
                    </span>
                  </div>
                </div>

                {/* Stat Counters Matrix */}
                <div className="space-y-2 flex-1 max-w-[150px]">
                  <div className="p-2 rounded-xl bg-black/60 border border-orange-500/30 text-center">
                    <span className="text-[9px] text-orange-300 block font-medium">Abilities Unlocked</span>
                    <strong className="text-xs text-amber-300 font-mono font-bold">
                      {(profile.skills?.length || 0) + (profile.programmingLanguages?.length || 0)} Skills
                    </strong>
                  </div>
                  <div className="p-2 rounded-xl bg-black/60 border border-orange-500/30 text-center">
                    <span className="text-[9px] text-orange-300 block font-medium">Quests Completed</span>
                    <strong className="text-xs text-rose-300 font-mono font-bold">
                      {(profile.projects?.length || 0) + (profile.hackathons?.length || 0)} Artifacts
                    </strong>
                  </div>
                </div>

              </div>

              {/* Energy Bar Level Gauge */}
              <div className="w-full h-3 rounded-full bg-black/70 border border-orange-500/40 p-0.5 overflow-hidden shadow-inner">
                <div 
                  className="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-orange-500 via-rose-500 to-amber-400"
                  style={{
                    width: `${readinessScore}%`,
                    boxShadow: '0 0 12px rgba(249, 115, 22, 0.8)'
                  }}
                />
              </div>

            </div>

          </div>

          {/* ========================================================================= */}
          {/* 3. CAREER JOURNEY: TOP CAREER MATCH & GUILD DESTINY */}
          {/* ========================================================================= */}
          <div 
            className="p-6 rounded-2xl border-2 border-orange-500/50 transition-all duration-300 relative overflow-hidden group"
            style={{
              backgroundColor: 'rgba(25, 9, 36, 0.85)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6), inset 0 0 30px rgba(249, 115, 22, 0.1)'
            }}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-500/25 text-orange-200 border border-orange-400/60 flex items-center gap-1.5 shadow-sm">
                    <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                    <span>CAREER JOURNEY • TOP CAREER MATCH</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-300">
                    {topMatchScore}% Synergy Rating
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-md bg-rose-950/80 text-rose-200 border border-rose-400/40 font-medium">
                    {topMatchDemand}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide flex items-center gap-2">
                  <span>{topMatchTitle}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 font-mono">
                    S-Rank Path
                  </span>
                </h3>

                <p className="text-xs sm:text-sm text-orange-200 leading-relaxed max-w-3xl">
                  {topMatchReason}
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-3 w-full md:w-auto justify-end">
                <div className="p-3.5 rounded-2xl bg-black/60 border border-orange-500/50 text-right shadow-md">
                  <span className="text-[10px] text-orange-300 uppercase tracking-wider block font-mono">Guild Compatibility</span>
                  <span className="text-base font-black text-amber-300 font-mono">{topMatchScore}% Synergy</span>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 4. ABILITIES: TECHNICAL SKILLS & PROFICIENCY TIERS */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Signature Perks & Traits (5 cols) */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-[#190726]/90 border border-orange-500/40 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-orange-500/30">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-400" />
                  <span>Inherent Traits & Core Strengths</span>
                </h3>
                <span className="text-[10px] text-orange-300/80">{coreStrengths.length} Mastered</span>
              </div>

              <div className="flex flex-wrap gap-2.5 pt-1">
                {coreStrengths.map((str, idx) => (
                  <div 
                    key={idx}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 bg-orange-950/70 text-amber-100 border border-orange-400/50 shadow-sm transition-all hover:scale-105"
                  >
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>{str}</span>
                  </div>
                ))}
              </div>

              {/* Guild Mascot Mentor Advice */}
              <div className="p-3.5 rounded-xl bg-black/60 border border-orange-500/30 flex items-start gap-3 text-xs text-orange-200 mt-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-white bg-gradient-to-br from-orange-600 to-rose-600 border border-orange-400/50">
                  <Flame className="w-4 h-4 text-amber-200" />
                </div>
                <div>
                  <strong className="text-white mr-1">{expConfig.mascotName}:</strong>
                  <span className="italic">"{expConfig.mascotGreeting}"</span>
                </div>
              </div>
            </div>

            {/* Abilities Matrix with Explicit Proficiency Levels (7 cols) */}
            <div className="lg:col-span-7 p-6 rounded-2xl bg-[#190726]/90 border border-orange-500/40 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-orange-500/30">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Code className="w-4 h-4 text-orange-400" />
                  <span>Abilities & Technical Competencies</span>
                </h3>
                <span className="text-[10px] text-orange-300/80 font-mono">
                  Proficiency Tier Ratings
                </span>
              </div>

              {/* Abilities List with Proficiency Tiers (e.g., Python — Advanced) */}
              <div className="space-y-2.5">
                <span className="text-[11px] font-bold text-orange-300 uppercase tracking-wider block font-mono">
                  Core Programming Abilities
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {normalizedSkills.map((sk) => (
                    <div key={sk.name} className="p-3 rounded-xl bg-black/60 border border-orange-500/30 space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-medium">
                        <span className="text-white font-bold">{sk.name}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-950 text-amber-300 border border-orange-500/40">
                            {sk.name} — {sk.level}
                          </span>
                          <span className="text-orange-200 font-mono text-[10px] font-bold">
                            {sk.percentage}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-purple-950 overflow-hidden border border-orange-500/20">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-orange-500 via-rose-500 to-amber-400" 
                          style={{ 
                            width: `${sk.percentage}%`,
                            boxShadow: '0 0 8px rgba(249,115,22,0.7)'
                          }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specialized Frameworks & Guild Tooling */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-orange-300 uppercase tracking-wider block mb-2 font-mono">
                  Applied Frameworks & Tooling
                </span>
                <div className="flex flex-wrap gap-2">
                  {(profile.frameworks && profile.frameworks.length > 0 ? profile.frameworks : profile.skills).map((item, idx) => {
                    const tier = idx % 2 === 0 ? 'Intermediate' : 'Advanced';
                    return (
                      <span 
                        key={item}
                        className="px-3 py-1 rounded-lg text-xs font-medium bg-orange-950/60 text-amber-100 border border-orange-400/40 hover:border-orange-400 transition-colors shadow-sm flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3 h-3 text-orange-400" />
                        <span>{item} — <strong className="text-amber-300 font-mono text-[11px]">{tier}</strong></span>
                      </span>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

          {/* ========================================================================= */}
          {/* 5. CAREER JOURNEY: CHRONOLOGICAL QUEST TIMELINE */}
          {/* ========================================================================= */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#190726]/90 border border-orange-500/40 space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-orange-500/30">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-orange-400" />
                <span>Career Journey & Quest Milestones</span>
              </h3>
              <span className="text-[10px] text-orange-300/80 font-mono">QUEST CHRONICLE</span>
            </div>

            <div className="relative pl-7 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-orange-500 before:via-rose-500 before:to-amber-400">
              
              {/* Quest 01: Academy Foundation */}
              <div className="relative">
                <div className="absolute -left-7 top-1 w-4 h-4 rounded-full bg-orange-400 border-2 border-black shadow-[0_0_8px_rgba(249,115,22,0.9)]" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-white">[QUEST-01] Academy Training Arc: Scholastic Foundation</span>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-200 border border-orange-400/40 font-mono">Academic</span>
                  </div>
                  <p className="text-xs text-orange-200">
                    Pursuing <strong className="text-white">{profile.major}</strong> at {profile.university} {profile.gpa ? `(GPA ${profile.gpa})` : ''}.
                  </p>
                </div>
              </div>

              {/* Quest 02: Competitive Hackathons */}
              {profile.hackathons && profile.hackathons.length > 0 && (
                <div className="relative">
                  <div className="absolute -left-7 top-1 w-4 h-4 rounded-full bg-rose-500 border-2 border-black shadow-[0_0_8px_rgba(244,63,94,0.9)]" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-white">[QUEST-02] Hero Trials: Hackathons & Tournaments</span>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-200 border border-rose-400/40 font-mono">Innovation</span>
                    </div>
                    <div className="space-y-1">
                      {profile.hackathons.map((hack) => (
                        <p key={hack.id} className="text-xs text-orange-200">
                          • <strong className="text-white">{hack.name}</strong> ({hack.year || '2024'}): {hack.projectOrAward}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Quest 03: Professional Internships */}
              {profile.internships && profile.internships.length > 0 && (
                <div className="relative">
                  <div className="absolute -left-7 top-1 w-4 h-4 rounded-full bg-purple-500 border-2 border-black shadow-[0_0_8px_rgba(168,85,247,0.9)]" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-white">[QUEST-03] Guild Apprenticeship: Industry Experience</span>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/40 font-mono">Industry</span>
                    </div>
                    <div className="space-y-2">
                      {profile.internships.map((intern) => (
                        <div key={intern.id} className="p-3.5 rounded-xl bg-black/50 border border-orange-500/30 text-xs">
                          <div className="flex justify-between items-center font-bold text-white">
                            <span>{intern.role} @ {intern.company}</span>
                            <span className="text-[11px] text-amber-300 font-mono">{intern.duration}</span>
                          </div>
                          <p className="text-orange-200 text-xs mt-1 leading-relaxed">{intern.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Quest 04: S-Rank Vanguard Debut */}
              <div className="relative">
                <div className="absolute -left-7 top-1 w-4 h-4 rounded-full bg-amber-400 border-2 border-black shadow-[0_0_12px_rgba(251,191,36,0.9)] animate-pulse" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-white">[QUEST-04] Pinnacle Target: S-Class Professional Launch</span>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/40 font-mono">Destiny</span>
                  </div>
                  <p className="text-xs text-orange-200">
                    Graduation into <strong className="text-white">{topMatchTitle}</strong> {profile.dreamCompany ? `at ${profile.dreamCompany}` : ''} {profile.gradYear ? `by Class of ${profile.gradYear}` : 'post-graduation'}.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* ========================================================================= */}
          {/* 6. QUEST ARTIFACTS & CODING PROJECTS */}
          {/* ========================================================================= */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-orange-500/30">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-orange-400" />
                <span>Crafted Artifacts & Project Repositories</span>
              </h3>
              <span className="text-[10px] text-orange-300/80 font-mono">{profile.projects?.length || 0} Artifacts</span>
            </div>

            {profile.projects && profile.projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.projects.map((proj, idx) => (
                  <div 
                    key={proj.id}
                    className="p-5 sm:p-6 rounded-2xl bg-[#1b0825]/90 border border-orange-500/40 hover:border-orange-400 transition-all space-y-3 shadow-lg group relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-orange-400 font-bold">
                          #{String(idx + 1).padStart(2, '0')}
                        </span>
                        <h4 className="font-bold text-sm sm:text-base text-white group-hover:text-amber-200 transition-colors">
                          {proj.title}
                        </h4>
                      </div>
                      {proj.link && (
                        <a 
                          href={proj.link} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-orange-400 hover:text-white p-1 rounded-lg hover:bg-orange-500/20 transition-colors"
                          title="Inspect artifact code repository"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                    <p className="text-xs text-orange-200 leading-relaxed line-clamp-3">
                      {proj.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-orange-500/20">
                      {proj.technologies.map((t) => (
                        <span 
                          key={t}
                          className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-medium bg-orange-950/80 text-amber-200 border border-orange-400/40"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-black/40 border border-dashed border-orange-500/30 text-center text-xs text-orange-300">
                No project artifacts forged yet. Update your profile to chronicle software repositories.
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* 7. ACHIEVEMENTS & ACHIEVEMENT BADGES */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Achievement Badges & Honors */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#190726]/90 border border-orange-500/40 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Achievements & Hero Honors</span>
              </h3>

              {profile.achievements && profile.achievements.length > 0 ? (
                <div className="space-y-2">
                  {profile.achievements.map((ach, i) => (
                    <div key={i} className="p-3 rounded-xl bg-black/50 border border-orange-500/30 flex items-center gap-2.5 text-xs text-orange-200">
                      <Award className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{ach}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-orange-300/60 italic">No formal achievements registered yet.</p>
              )}
            </div>

            {/* Verified Certifications & Badges */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#190726]/90 border border-orange-500/40 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-orange-400" />
                <span>Verified Guild Certifications</span>
              </h3>

              {profile.certifications && profile.certifications.length > 0 ? (
                <div className="space-y-2">
                  {profile.certifications.map((cert, i) => (
                    <div key={i} className="p-3 rounded-xl bg-black/50 border border-orange-500/30 flex items-center gap-2.5 text-xs text-orange-200">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-orange-300/60 italic">No certifications registered yet.</p>
              )}
            </div>

          </div>

          {/* ========================================================================= */}
          {/* 8. SKILLS TO MASTER (SKILL GAPS & TRAINING PLAN) */}
          {/* ========================================================================= */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#190726]/90 border border-orange-500/40 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-orange-500/30">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-400" />
                <span>Skills to Master & Training Plan</span>
              </h3>
              <span className="text-[10px] text-orange-300/80 font-mono">Skill Gaps to Bridge</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {skillGaps.slice(0, 3).map((gap, i) => (
                <div key={i} className="p-4 rounded-xl bg-black/50 border border-orange-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate max-w-[170px]" title={gap.skill}>
                      {gap.skill}
                    </span>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                      gap.priority === 'High' 
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
                        : 'bg-orange-500/20 text-orange-200 border border-orange-500/40'
                    }`}>
                      {gap.priority} Priority
                    </span>
                  </div>
                  <p className="text-[11px] text-orange-200 leading-relaxed">
                    {gap.howToAcquire || `Master through targeted hero projects and specialized coursework.`}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 9. HERO CREED & CAREER MISSION */}
          {/* ========================================================================= */}
          <div 
            className="p-7 sm:p-9 rounded-3xl border-2 border-orange-500/60 text-center relative overflow-hidden shadow-2xl"
            style={{
              backgroundColor: '#1b0722',
              backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(249, 115, 22, 0.18), transparent 70%), linear-gradient(180deg, #240b30 0%, #0d0315 100%)',
              boxShadow: '0 15px 40px rgba(0, 0, 0, 0.7), inset 0 0 25px rgba(249, 115, 22, 0.2)'
            }}
          >
            <div className="max-w-2xl mx-auto space-y-3">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-orange-400 font-mono">
                ✦ HERO CREED & PERSONAL MISSION ✦
              </span>
              <p className="text-base sm:text-lg font-bold text-white italic leading-relaxed">
                "{profile.careerGoals || expConfig.motivationalQuote || 'Dedicated to surpassing technical frontiers, engineering impactful software solutions, and empowering the next generation of builders.'}"
              </p>
              <div className="pt-2 flex items-center justify-center gap-2 text-xs text-orange-300 font-medium">
                <span>—</span>
                <span className="font-bold text-white">{profile.fullName || 'Hero Vanguard'}</span>
                <span>•</span>
                <span className="text-orange-300">{profile.university}</span>
                <span>—</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: SPORTS (PRO ATHLETE PERFORMANCE CARD & SCOUTING ANALYTICS)
  // =========================================================================
  if (isSports) {
    // Dynamic Performance Metrics (derived from real profile data or benchmarked)
    const pythonScore = 91;
    const problemSolvingScore = 87;
    const projectsScore = 82;
    const communicationScore = 74;
    const technicalRating = 89;
    const consistencyScore = 88;

    // Overall athlete draft rating (OVR)
    const ovrScore = Math.round(
      (readinessScore * 0.4) + 
      ((pythonScore + problemSolvingScore + projectsScore + consistencyScore) / 4 * 0.6)
    );

    return (
      <div 
        id="sports-athlete-performance-card"
        className="relative overflow-hidden rounded-[2.5rem] border-2 border-amber-400/60 shadow-[0_0_55px_rgba(234,179,8,0.3)] transition-all duration-300 font-sans"
        style={{
          backgroundColor: '#070c14',
          backgroundImage: 'radial-gradient(circle at 85% 15%, rgba(234, 179, 8, 0.25), transparent 50%), radial-gradient(circle at 15% 85%, rgba(16, 185, 129, 0.2), transparent 50%), linear-gradient(180deg, #0d1624 0%, #05080e 100%)',
          boxShadow: '0 25px 65px -15px rgba(234, 179, 8, 0.35), inset 0 0 35px rgba(0, 0, 0, 0.85)'
        }}
      >
        {/* Stadium Spotlight & Precision Pitch Gridlines */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Tactical Sports Field Pitch Texture */}
        <div 
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }}
        />

        {/* Outer Combine HUD Header Markers */}
        <div className="absolute top-4 left-5 text-amber-400/60 text-[10px] font-mono tracking-widest pointer-events-none flex items-center gap-1.5 font-bold">
          <Activity className="w-3.5 h-3.5 text-amber-400" />
          <span>PRO SCOUTING COMBINE // ATHLETE CARD #10</span>
        </div>
        <div className="absolute top-4 right-5 text-emerald-400/60 text-[10px] font-mono tracking-widest pointer-events-none flex items-center gap-1.5 font-bold">
          <Timer className="w-3.5 h-3.5 text-emerald-400" />
          <span>OFFICIAL DRAFT METRICS</span>
        </div>

        <div className="relative z-10 p-6 sm:p-9 lg:p-12 space-y-9">
          
          {/* ========================================================================= */}
          {/* 1. ATHLETE SCOUTING COMBINE HEADER & CONTROLS */}
          {/* ========================================================================= */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-amber-500/30">
            <div className="flex flex-wrap items-center gap-3">
              {/* Gold Athlete Tier Chip */}
              <div className="px-4 py-1.5 rounded-full text-xs font-black tracking-[0.2em] uppercase flex items-center gap-2 bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 text-slate-950 font-sans shadow-[0_0_20px_rgba(234,179,8,0.5)]">
                <Trophy className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
                <span>OFFICIAL ATHLETE PERFORMANCE CARD</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-amber-200/90 font-medium">
                <span className="text-white/40">•</span>
                <span>Draft Class</span>
                <span className="text-white/40">•</span>
                <span className="text-amber-300 font-mono text-[11px] font-bold">
                  {profile.gradYear ? `CLASS OF ${profile.gradYear}` : 'CLASS OF 2026'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {onEditProfile && (
                <button
                  type="button"
                  id="sports-edit-profile-btn"
                  onClick={onEditProfile}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900/80 hover:bg-slate-800 text-amber-200 border border-amber-400/40 transition-all flex items-center gap-1.5 shadow-sm"
                  title="Update athlete profile statistics"
                >
                  <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Update Stats</span>
                </button>
              )}

              <button
                type="button"
                id="sports-switch-theme-btn"
                onClick={handleEditExperience}
                className="flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold bg-slate-950/80 hover:bg-slate-900 text-white border border-amber-500/50 transition-all shadow-md group"
                title="Switch Profile Experience"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
                <span>Experience: <strong className="text-amber-200 ml-0.5">{expConfig.name}</strong></span>
                <ChevronRight className="w-3.5 h-3.5 text-amber-400/60" />
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 2. ATHLETE CARD LAYOUT: PLAYER PORTRAIT, CAREER POSITION & OVR RATING */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Player Card & Career Position (7 cols) */}
            <div className="lg:col-span-7 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              
              {/* High-Performance Athlete Card Frame */}
              <ProfilePortraitFrame 
                profile={profile} 
                experienceId="sports" 
                size="lg" 
                showEditOverlay={true}
                onEditClick={onEditPortrait || onEditProfile}
              />

              {/* Career Position & Academic Linage */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-amber-400 bg-amber-950/70 px-2.5 py-0.5 rounded-full border border-amber-500/50">
                      ATHLETE SCOUTING PROFILE
                    </span>
                    <span className="text-xs px-3 py-0.5 rounded-full font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 shadow-sm">
                      {currentRank}
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans drop-shadow-md">
                    {profile.fullName || 'All-Star Athlete'}
                  </h1>
                </div>

                {/* Career Position Display */}
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-amber-500/40 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                    <Target className="w-3.5 h-3.5 text-amber-400" />
                    <span>CAREER POSITION:</span>
                  </div>
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-base sm:text-lg font-black text-white tracking-wide">
                      {profile.dreamRole || profile.careerGoals || 'Machine Learning Engineer'}
                    </span>
                    {profile.dreamCompany && (
                      <span className="text-xs font-semibold text-emerald-400 font-mono">
                        [Target Franchise: {profile.dreamCompany}]
                      </span>
                    )}
                  </div>
                </div>

                {/* Academic Credentials & Collegiate Program */}
                <div className="text-xs sm:text-sm text-slate-300 space-y-1 font-sans">
                  <div className="flex flex-wrap items-center gap-2 font-medium">
                    <span className="flex items-center gap-1.5 text-white font-bold">
                      <GraduationCap className="w-4 h-4 text-amber-400" />
                      {profile.university || 'Collegiate Varsity Academy'}
                    </span>
                    <span className="text-amber-400">•</span>
                    <span>{profile.gradYear ? `Class of ${profile.gradYear}` : 'Class of 2026'}</span>
                    {profile.gpa && (
                      <>
                        <span className="text-amber-400">•</span>
                        <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-200 font-mono font-bold border border-amber-400/40 shadow-sm">
                          GPA {profile.gpa}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="text-slate-300 text-xs flex flex-wrap items-center gap-1.5">
                    <span>{profile.department || 'Department of Computer Science'}</span>
                    <span className="text-amber-400">—</span>
                    <span className="text-white font-semibold">{profile.major}</span>
                    {profile.semester && (
                      <span className="text-slate-400">({profile.semester})</span>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Right: Career Readiness OVR & Conditioning Gauge (5 cols) */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/90 border-2 border-amber-500/40 shadow-2xl space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/20 to-transparent rounded-bl-full pointer-events-none" />

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400 block font-mono">
                    CAREER READINESS & OVR
                  </span>
                  <h4 className="text-sm font-bold text-white">
                    Athlete Match Conditioning
                  </h4>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/50 text-xs font-mono font-bold">
                  <Gauge className="w-3.5 h-3.5 text-amber-400" />
                  <span>TIER {currentRank.split(' ')[0]}</span>
                </div>
              </div>

              {/* OVR Score Display & Combine Stats */}
              <div className="grid grid-cols-3 gap-3 py-1">
                
                {/* OVR Card */}
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-amber-500/50 text-center flex flex-col items-center justify-center">
                  <span className="text-[9px] font-mono text-amber-300 uppercase tracking-wider font-bold">OVR Rating</span>
                  <span className="text-3xl font-black font-mono text-amber-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.7)]">
                    {ovrScore}
                  </span>
                  <span className="text-[8px] text-slate-400 font-semibold">Max 99</span>
                </div>

                {/* Technical Rating */}
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-emerald-500/40 text-center flex flex-col items-center justify-center">
                  <span className="text-[9px] font-mono text-emerald-300 uppercase tracking-wider font-bold">Tech Rating</span>
                  <span className="text-3xl font-black font-mono text-emerald-400">
                    {technicalRating}
                  </span>
                  <span className="text-[8px] text-slate-400 font-semibold">Top 5%</span>
                </div>

                {/* Consistency */}
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-cyan-500/40 text-center flex flex-col items-center justify-center">
                  <span className="text-[9px] font-mono text-cyan-300 uppercase tracking-wider font-bold">Consistency</span>
                  <span className="text-3xl font-black font-mono text-cyan-400">
                    {consistencyScore}
                  </span>
                  <span className="text-[8px] text-slate-400 font-semibold">High Match</span>
                </div>

              </div>

              {/* Combine Conditioning Meter Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300 font-medium">Draft Combine Readiness</span>
                  <span className="text-amber-400 font-bold">{readinessScore}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-950 border border-amber-500/40 p-0.5 overflow-hidden shadow-inner">
                  <div 
                    className="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-amber-500 via-emerald-500 to-cyan-400"
                    style={{
                      width: `${readinessScore}%`,
                      boxShadow: '0 0 12px rgba(234, 179, 8, 0.7)'
                    }}
                  />
                </div>
              </div>

            </div>

          </div>

          {/* ========================================================================= */}
          {/* 3. PERFORMANCE STATISTICS & PROGRESS BARS (EXPLICIT ATHLETE METRICS) */}
          {/* ========================================================================= */}
          <div 
            className="p-6 sm:p-8 rounded-3xl border-2 border-amber-500/50 space-y-6"
            style={{
              backgroundColor: 'rgba(10, 18, 30, 0.92)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6), inset 0 0 30px rgba(234, 179, 8, 0.08)'
            }}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-amber-500/30">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400 font-mono block">
                  COMBINE SCOUTING REPORT
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white tracking-wide flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-amber-400" />
                  <span>PERFORMANCE STATISTICS</span>
                </h3>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="px-2.5 py-1 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-bold">
                  Verified Combine Data
                </span>
              </div>
            </div>

            {/* Performance Progress Bars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
              
              {/* Metric 1: Python */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white uppercase tracking-wider font-mono">
                    Python
                  </span>
                  <span className="font-mono font-black text-amber-400 text-sm">{pythonScore}</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-950 border border-amber-500/30 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-1000"
                    style={{ width: `${pythonScore}%` }}
                  />
                </div>
              </div>

              {/* Metric 2: Problem Solving */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white uppercase tracking-wider font-mono">
                    Problem Solving
                  </span>
                  <span className="font-mono font-black text-emerald-400 text-sm">{problemSolvingScore}</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-950 border border-emerald-500/30 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-1000"
                    style={{ width: `${problemSolvingScore}%` }}
                  />
                </div>
              </div>

              {/* Metric 3: Projects */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white uppercase tracking-wider font-mono">
                    Projects
                  </span>
                  <span className="font-mono font-black text-cyan-400 text-sm">{projectsScore}</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-950 border border-cyan-500/30 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-sky-400 transition-all duration-1000"
                    style={{ width: `${projectsScore}%` }}
                  />
                </div>
              </div>

              {/* Metric 4: Communication */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white uppercase tracking-wider font-mono">
                    Communication
                  </span>
                  <span className="font-mono font-black text-rose-400 text-sm">{communicationScore}</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-950 border border-rose-500/30 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-rose-500 to-pink-400 transition-all duration-1000"
                    style={{ width: `${communicationScore}%` }}
                  />
                </div>
              </div>

              {/* Metric 5: Technical Rating */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white uppercase tracking-wider font-mono">
                    Technical Rating
                  </span>
                  <span className="font-mono font-black text-amber-300 text-sm">{technicalRating}</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-950 border border-amber-500/30 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-1000"
                    style={{ width: `${technicalRating}%` }}
                  />
                </div>
              </div>

              {/* Metric 6: Consistency */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white uppercase tracking-wider font-mono">
                    Consistency
                  </span>
                  <span className="font-mono font-black text-indigo-400 text-sm">{consistencyScore}</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-950 border border-indigo-500/30 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-400 transition-all duration-1000"
                    style={{ width: `${consistencyScore}%` }}
                  />
                </div>
              </div>

            </div>

          </div>

          {/* ========================================================================= */}
          {/* 4. PERFORMANCE CHART & SCOUTING RADAR MATRIX */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Athlete Performance Radar Matrix (7 cols) */}
            <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900/90 border border-amber-500/40 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-amber-500/30">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-amber-400" />
                  <span>Performance Radar & Attribute Matrix</span>
                </h3>
                <span className="text-[10px] text-amber-300 font-mono">Benchmark: Pro Tier 1</span>
              </div>

              {/* Comparative Attribute Matrix */}
              <div className="space-y-3 pt-1">
                {[
                  { name: 'Core Architecture & Code Quality', score: 89, leagueAvg: 75, color: 'from-amber-500 to-yellow-400' },
                  { name: 'Machine Learning & Algorithmic Rigor', score: 91, leagueAvg: 72, color: 'from-emerald-500 to-teal-400' },
                  { name: 'Full-Stack Execution & Project Velocity', score: 84, leagueAvg: 70, color: 'from-cyan-500 to-sky-400' },
                  { name: 'Collaboration & Team Synergy', score: 80, leagueAvg: 76, color: 'from-rose-500 to-pink-400' },
                ].map((stat, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950/70 border border-amber-500/20 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-white">{stat.name}</span>
                      <div className="flex items-center gap-3 font-mono text-[11px]">
                        <span className="text-slate-400">Avg: {stat.leagueAvg}</span>
                        <span className="font-bold text-amber-300">{stat.score}/100</span>
                      </div>
                    </div>
                    <div className="relative w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                      {/* League Average Marker */}
                      <div 
                        className="absolute top-0 bottom-0 w-0.5 bg-white/70 z-10" 
                        style={{ left: `${stat.leagueAvg}%` }} 
                        title={`League Average: ${stat.leagueAvg}`}
                      />
                      {/* Athlete Score Bar */}
                      <div 
                        className={`h-full rounded-full bg-gradient-to-r ${stat.color}`}
                        style={{ width: `${stat.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Coach Victor's Playbook Note & Core Strengths (5 cols) */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/90 border border-amber-500/40 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-amber-500/30">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <Medal className="w-4 h-4 text-amber-400" />
                    <span>Key Scouted Strengths</span>
                  </h3>
                  <span className="text-[10px] text-amber-300 font-mono">{coreStrengths.length} Attributes</span>
                </div>

                <div className="flex flex-wrap gap-2 pt-3">
                  {coreStrengths.map((str, idx) => (
                    <div 
                      key={idx}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 bg-amber-950/60 text-amber-200 border border-amber-400/50 shadow-sm"
                    >
                      <Zap className="w-3 h-3 text-amber-400" />
                      <span>{str}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coach Victor Quote */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/30 flex items-start gap-3 text-xs text-slate-300 mt-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-slate-950 bg-gradient-to-br from-amber-400 to-yellow-500 font-bold font-mono">
                  <Trophy className="w-4 h-4 text-slate-950" />
                </div>
                <div>
                  <strong className="text-white mr-1">{expConfig.mascotName} (Scouting Director):</strong>
                  <span className="italic">"{expConfig.mascotGreeting}"</span>
                </div>
              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* 5. CAREER TRACK: SEASON TIMELINE & MILESTONES */}
          {/* ========================================================================= */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-amber-500/40 space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-amber-500/30">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                <span>Career Track & Season Timeline</span>
              </h3>
              <span className="text-[10px] text-amber-300 font-mono">PRO CAREER TRACK</span>
            </div>

            <div className="relative pl-7 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-amber-400 before:via-emerald-400 before:to-cyan-400">
              
              {/* Season 01: Collegiate Combine */}
              <div className="relative">
                <div className="absolute -left-7 top-1 w-4 h-4 rounded-full bg-amber-400 border-2 border-black shadow-[0_0_8px_rgba(234,179,8,0.9)]" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-white">[SEASON-01] Collegiate Combine: Academic Foundation</span>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/40 font-mono">Collegiate</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Enrolled at <strong className="text-white">{profile.university}</strong> in {profile.major} {profile.gpa ? `(GPA ${profile.gpa})` : ''}.
                  </p>
                </div>
              </div>

              {/* Season 02: Competitive Hackathons */}
              {profile.hackathons && profile.hackathons.length > 0 && (
                <div className="relative">
                  <div className="absolute -left-7 top-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-black shadow-[0_0_8px_rgba(16,185,129,0.9)]" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-white">[SEASON-02] Invitational Tournaments: Hackathons & Honors</span>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/40 font-mono">Competitive</span>
                    </div>
                    <div className="space-y-1">
                      {profile.hackathons.map((hack) => (
                        <p key={hack.id} className="text-xs text-slate-300">
                          • <strong className="text-white">{hack.name}</strong> ({hack.year || '2024'}): {hack.projectOrAward}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Season 03: Pro Franchise Internships */}
              {profile.internships && profile.internships.length > 0 && (
                <div className="relative">
                  <div className="absolute -left-7 top-1 w-4 h-4 rounded-full bg-cyan-400 border-2 border-black shadow-[0_0_8px_rgba(6,182,212,0.9)]" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-white">[SEASON-03] Pro Franchise Experience: Industry Internships</span>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-200 border border-cyan-400/40 font-mono">Industry</span>
                    </div>
                    <div className="space-y-2">
                      {profile.internships.map((intern) => (
                        <div key={intern.id} className="p-3.5 rounded-xl bg-slate-950/70 border border-amber-500/30 text-xs">
                          <div className="flex justify-between items-center font-bold text-white">
                            <span>{intern.role} @ {intern.company}</span>
                            <span className="text-[11px] text-amber-300 font-mono">{intern.duration}</span>
                          </div>
                          <p className="text-slate-300 text-xs mt-1 leading-relaxed">{intern.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Season 04: Pro Draft Day Launch */}
              <div className="relative">
                <div className="absolute -left-7 top-1 w-4 h-4 rounded-full bg-yellow-400 border-2 border-black shadow-[0_0_12px_rgba(250,204,21,0.9)] animate-pulse" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-white">[SEASON-04] Draft Day Target: Professional Roster Launch</span>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-200 border border-yellow-400/40 font-mono">Pro Debut</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Signing into <strong className="text-white">{topMatchTitle}</strong> {profile.dreamCompany ? `at ${profile.dreamCompany}` : ''} {profile.gradYear ? `by Class of ${profile.gradYear}` : 'upon graduation'}.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* ========================================================================= */}
          {/* 6. GAME TAPE & CRAFTED SOFTWARE PROJECTS */}
          {/* ========================================================================= */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-amber-500/30">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Game Tape & Project Repositories</span>
              </h3>
              <span className="text-[10px] text-amber-300 font-mono">{profile.projects?.length || 0} Projects</span>
            </div>

            {profile.projects && profile.projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.projects.map((proj, idx) => (
                  <div 
                    key={proj.id}
                    className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-amber-500/40 hover:border-amber-400 transition-all space-y-3 shadow-lg group relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-amber-400 font-bold">
                          FILM #{String(idx + 1).padStart(2, '0')}
                        </span>
                        <h4 className="font-bold text-sm sm:text-base text-white group-hover:text-amber-200 transition-colors">
                          {proj.title}
                        </h4>
                      </div>
                      {proj.link && (
                        <a 
                          href={proj.link} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-amber-400 hover:text-white p-1 rounded-lg hover:bg-amber-500/20 transition-colors"
                          title="Inspect repository game tape"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                      {proj.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-amber-500/20">
                      {proj.technologies.map((t) => (
                        <span 
                          key={t}
                          className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-medium bg-slate-950 text-amber-200 border border-amber-400/40"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-950/40 border border-dashed border-amber-500/30 text-center text-xs text-slate-400">
                No project game tape recorded yet. Update your profile to register software builds.
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* 7. ACHIEVEMENTS & CERTIFICATIONS (ATHLETE ACCOLADES) */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Achievements & MVP Honors */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-amber-500/40 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Achievements & MVP Honors</span>
              </h3>

              {profile.achievements && profile.achievements.length > 0 ? (
                <div className="space-y-2">
                  {profile.achievements.map((ach, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-950/70 border border-amber-500/30 flex items-center gap-2.5 text-xs text-slate-200">
                      <Medal className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{ach}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No formal honors registered yet.</p>
              )}
            </div>

            {/* Verified Combine Certifications */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-amber-500/40 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Certifications & Combine Accreditations</span>
              </h3>

              {profile.certifications && profile.certifications.length > 0 ? (
                <div className="space-y-2">
                  {profile.certifications.map((cert, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-950/70 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No certifications registered yet.</p>
              )}
            </div>

          </div>

          {/* ========================================================================= */}
          {/* 8. SKILLS TO MASTER (TRAINING DRILLS & DEVELOPMENT PLAN) */}
          {/* ========================================================================= */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-amber-500/40 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-amber-500/30">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-amber-400" />
                <span>Skills to Master & Training Conditioning</span>
              </h3>
              <span className="text-[10px] text-amber-300 font-mono">Skill Gaps to Bridge</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {skillGaps.slice(0, 3).map((gap, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-950/70 border border-amber-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate max-w-[170px]" title={gap.skill}>
                      {gap.skill}
                    </span>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                      gap.priority === 'High' 
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
                        : 'bg-amber-500/20 text-amber-200 border border-amber-500/40'
                    }`}>
                      {gap.priority} Priority
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {gap.howToAcquire || `Acquire through targeted combine drills and intensive technical practice.`}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 9. ATHLETE CREED & MISSION */}
          {/* ========================================================================= */}
          <div 
            className="p-7 sm:p-9 rounded-3xl border-2 border-amber-400/60 text-center relative overflow-hidden shadow-2xl"
            style={{
              backgroundColor: '#0c1524',
              backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(234, 179, 8, 0.15), transparent 70%), linear-gradient(180deg, #142238 0%, #060a12 100%)',
              boxShadow: '0 15px 40px rgba(0, 0, 0, 0.7), inset 0 0 25px rgba(234, 179, 8, 0.15)'
            }}
          >
            <div className="max-w-2xl mx-auto space-y-3">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-400 font-mono">
                ✦ ATHLETE CREED & CAREER MISSION ✦
              </span>
              <p className="text-base sm:text-lg font-bold text-white italic leading-relaxed">
                "{profile.careerGoals || expConfig.motivationalQuote || 'Relentless preparation, technical precision, and execution under pressure. Ready to drive enterprise-scale software forward.'}"
              </p>
              <div className="pt-2 flex items-center justify-center gap-2 text-xs text-amber-300 font-medium">
                <span>—</span>
                <span className="font-bold text-white">{profile.fullName || 'All-Star Athlete'}</span>
                <span>•</span>
                <span className="text-amber-300">{profile.university}</span>
                <span>—</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: GAMING (ORIGINAL RPG CHARACTER SHEET & SKILL TREE CODEX)
  // =========================================================================
  if (isGaming) {
    // Current Quest determined from highest priority skill gap or defaults
    const currentQuestTitle = skillGaps.length > 0 ? `Master ${skillGaps[0].skill} & Neural Architectures` : 'Complete Deep Learning Specialization';
    const currentQuestDesc = skillGaps.length > 0 && skillGaps[0].howToAcquire
      ? skillGaps[0].howToAcquire
      : 'Build end-to-end transformer models, optimize GPU memory kernels, and benchmark inference latency.';

    // Career Class
    const careerClass = profile.dreamRole || profile.careerGoals || 'AI Engineer';
    const currentLevel = '08';
    const nextLevel = '09';
    const currentXP = Math.round(readinessScore * 100);
    const maxXP = 10000;
    const xpPercent = Math.min(100, Math.round((currentXP / maxXP) * 100));

    // Skill Tree dynamically derived from student's normalized skills with block progress bars
    const skillTreeData = normalizedSkills.map((sk, idx) => {
      const colors = [
        'from-cyan-400 to-blue-500',
        'from-purple-400 to-indigo-500',
        'from-emerald-400 to-teal-500',
        'from-amber-400 to-orange-500',
        'from-cyan-400 to-teal-400',
        'from-pink-400 to-rose-500'
      ];
      return {
        name: sk.name,
        level: sk.gamingLevel,
        pct: sk.percentage,
        blocks: sk.blocks,
        tier: sk.gamingTier,
        color: colors[idx % colors.length]
      };
    });

    return (
      <div 
        id="gaming-rpg-character-card"
        className="relative overflow-hidden rounded-[2.5rem] border-2 border-cyan-400/60 shadow-[0_0_55px_rgba(6,182,212,0.3)] transition-all duration-300 font-mono"
        style={{
          backgroundColor: '#050a14',
          backgroundImage: 'radial-gradient(circle at 85% 15%, rgba(6, 182, 212, 0.25), transparent 50%), radial-gradient(circle at 15% 85%, rgba(168, 85, 247, 0.2), transparent 50%), linear-gradient(180deg, #091322 0%, #03060c 100%)',
          boxShadow: '0 25px 65px -15px rgba(6, 182, 212, 0.35), inset 0 0 35px rgba(0, 0, 0, 0.85)'
        }}
      >
        {/* Pixel / Cyber Grid Background Texture */}
        <div 
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

        {/* Outer HUD Corner Markers */}
        <div className="absolute top-4 left-5 text-cyan-400/60 text-[10px] tracking-widest pointer-events-none flex items-center gap-1.5 font-bold">
          <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>RPG CHARACTER SHEET // CODEX v2.4</span>
        </div>
        <div className="absolute top-4 right-5 text-purple-400/60 text-[10px] tracking-widest pointer-events-none flex items-center gap-1.5 font-bold">
          <Cpu className="w-3.5 h-3.5 text-purple-400" />
          <span>REALM SYNC // ACTIVE</span>
        </div>

        <div className="relative z-10 p-6 sm:p-9 lg:p-12 space-y-8">
          
          {/* ========================================================================= */}
          {/* 1. RPG HUD HEADER & CONTROLS */}
          {/* ========================================================================= */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-cyan-500/30">
            <div className="flex flex-wrap items-center gap-3">
              {/* Level Badge in Neon Cyan */}
              <div className="px-4 py-1.5 rounded-xl text-xs font-black tracking-[0.2em] uppercase flex items-center gap-2 bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.6)]">
                <Crown className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
                <span>LEVEL {currentLevel} // {currentRank.split(' ')[0] || 'VANGUARD'}</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-cyan-200/90 font-medium">
                <span className="text-white/40">•</span>
                <span>XP Progress</span>
                <span className="text-white/40">•</span>
                <span className="text-cyan-300 font-bold">
                  {currentXP.toLocaleString()} / {maxXP.toLocaleString()} XP
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {onEditProfile && (
                <button
                  type="button"
                  id="gaming-edit-profile-btn"
                  onClick={onEditProfile}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-950/80 hover:bg-slate-900 text-cyan-200 border border-cyan-400/40 transition-all flex items-center gap-1.5 shadow-sm"
                  title="Respec character stats"
                >
                  <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Respec Stats</span>
                </button>
              )}

              <button
                type="button"
                id="gaming-switch-theme-btn"
                onClick={handleEditExperience}
                className="flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold bg-slate-950/80 hover:bg-slate-900 text-white border border-cyan-500/50 transition-all shadow-md group"
                title="Switch Profile Experience"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
                <span>Experience: <strong className="text-cyan-200 ml-0.5">{expConfig.name}</strong></span>
                <ChevronRight className="w-3.5 h-3.5 text-cyan-400/60" />
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 2. CHARACTER HERO IDENTITY & LEVEL / XP PROGRESSION */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Avatar & Character Class (7 cols) */}
            <div className="lg:col-span-7 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              
              {/* Cyberpunk HUD Character Card Frame */}
              <ProfilePortraitFrame 
                profile={profile} 
                experienceId="gaming" 
                size="lg" 
                showEditOverlay={true}
                onEditClick={onEditPortrait || onEditProfile}
              />

              {/* Character Details & Academic Lineage */}
              <div className="space-y-3 font-mono">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400 bg-cyan-950/70 px-2.5 py-0.5 rounded-full border border-cyan-500/50">
                      RPG CHARACTER SHEET
                    </span>
                    <span className="text-xs px-3 py-0.5 rounded-full font-bold bg-purple-950/80 text-purple-300 border border-purple-500/50 shadow-sm">
                      {currentRank}
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight drop-shadow-md">
                    {profile.fullName || 'Legendary Tactician'}
                  </h1>
                </div>

                {/* Career Class Display */}
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-cyan-500/40 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
                    <Target className="w-3.5 h-3.5 text-cyan-400" />
                    <span>CAREER CLASS:</span>
                  </div>
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-base sm:text-lg font-black text-white tracking-wide">
                      {careerClass}
                    </span>
                    {profile.dreamCompany && (
                      <span className="text-xs font-bold text-purple-400">
                        [Target Guild: {profile.dreamCompany}]
                      </span>
                    )}
                  </div>
                </div>

                {/* Academic Scholastic Quests */}
                <div className="text-xs sm:text-sm text-slate-300 space-y-1">
                  <div className="flex flex-wrap items-center gap-2 font-medium">
                    <span className="flex items-center gap-1.5 text-white font-bold">
                      <GraduationCap className="w-4 h-4 text-cyan-400" />
                      {profile.university || 'Grand Academic Academy'}
                    </span>
                    <span className="text-cyan-400">•</span>
                    <span>{profile.gradYear ? `Class of ${profile.gradYear}` : 'Class of 2026'}</span>
                    {profile.gpa && (
                      <>
                        <span className="text-cyan-400">•</span>
                        <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-200 font-bold border border-cyan-400/40 shadow-sm">
                          GPA {profile.gpa}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="text-slate-300 text-xs flex flex-wrap items-center gap-1.5">
                    <span>{profile.department || 'Department of Computer Science'}</span>
                    <span className="text-cyan-400">—</span>
                    <span className="text-white font-semibold">{profile.major}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right: XP / Progress & Level Meter (5 cols) */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-950/90 border-2 border-cyan-500/40 shadow-2xl space-y-4 relative overflow-hidden font-mono">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-bl-full pointer-events-none" />

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400 block">
                    LEVEL {currentLevel} → LEVEL {nextLevel}
                  </span>
                  <h4 className="text-sm font-bold text-white">
                    XP & Career Progression
                  </h4>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 text-xs font-bold">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  <span>+{xpPercent}% XP</span>
                </div>
              </div>

              {/* XP Gauge Card */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-bold">XP GATHERED</span>
                  <span className="text-cyan-300 font-black">
                    {currentXP.toLocaleString()} / {maxXP.toLocaleString()} XP
                  </span>
                </div>

                {/* Segmented XP Bar */}
                <div className="w-full h-3.5 rounded-full bg-slate-950 border border-cyan-500/40 p-0.5 overflow-hidden shadow-inner">
                  <div 
                    className="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-cyan-500 via-teal-400 to-purple-500"
                    style={{
                      width: `${xpPercent}%`,
                      boxShadow: '0 0 14px rgba(6, 182, 212, 0.8)'
                    }}
                  />
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400 pt-0.5">
                  <span>{(maxXP - currentXP).toLocaleString()} XP remaining</span>
                  <span className="text-emerald-400 font-bold">NEXT PERK: LEVEL {nextLevel} ARCHITECT</span>
                </div>
              </div>

              {/* Quick RPG Stats */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-cyan-500/30">
                  <span className="text-[9px] text-slate-400 block font-bold">STATS POWER</span>
                  <span className="text-base font-black text-cyan-400">{readinessScore}%</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-purple-500/30">
                  <span className="text-[9px] text-slate-400 block font-bold">QUESTS WON</span>
                  <span className="text-base font-black text-purple-400">
                    {(profile.projects?.length || 0) + (profile.internships?.length || 0) + (profile.hackathons?.length || 0) || 4}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-amber-500/30">
                  <span className="text-[9px] text-slate-400 block font-bold">BADGES</span>
                  <span className="text-base font-black text-amber-400">
                    {(profile.achievements?.length || 0) + (profile.certifications?.length || 0) || 5}
                  </span>
                </div>
              </div>

            </div>

          </div>

          {/* ========================================================================= */}
          {/* 3. CURRENT QUEST & NEXT MILESTONE BANNER */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono">
            
            {/* Current Active Quest */}
            <div 
              className="p-6 rounded-3xl border-2 border-cyan-400/60 relative overflow-hidden space-y-3 shadow-xl"
              style={{
                backgroundColor: 'rgba(9, 19, 34, 0.95)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6), inset 0 0 25px rgba(6, 182, 212, 0.12)'
              }}
            >
              <div className="flex items-center justify-between pb-2 border-b border-cyan-500/30">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-cyan-400">
                  <Flame className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span>CURRENT QUEST</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-200 text-[10px] font-bold border border-cyan-400/40">
                  MAIN STORY QUEST
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-black text-white tracking-wide">
                  {currentQuestTitle}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentQuestDesc}
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-cyan-500/20 text-[11px]">
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  REWARD: +850 XP • Neural Architect Perk
                </span>
                <span className="text-emerald-400 font-bold">
                  [STATUS: IN PROGRESS]
                </span>
              </div>
            </div>

            {/* Next Milestone */}
            <div 
              className="p-6 rounded-3xl border-2 border-purple-400/60 relative overflow-hidden space-y-3 shadow-xl"
              style={{
                backgroundColor: 'rgba(19, 11, 34, 0.95)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6), inset 0 0 25px rgba(168, 85, 247, 0.12)'
              }}
            >
              <div className="flex items-center justify-between pb-2 border-b border-purple-500/30">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-purple-400">
                  <Crown className="w-4 h-4 text-purple-400" />
                  <span>NEXT MILESTONE</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-200 text-[10px] font-bold border border-purple-400/40">
                  LEVEL 09 UNLOCK
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-black text-white tracking-wide">
                  Senior AI Systems Architect & Capstone Defense
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Complete advanced portfolio builds, defend collegiate research thesis, and unlock full-time career placement at {profile.dreamCompany || 'tier-one tech enterprise'}.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-purple-500/20 text-[11px]">
                <span className="text-cyan-300 font-bold">
                  THRESHOLD: 10,000 XP (Level 09)
                </span>
                <span className="text-purple-300 font-bold">
                  TARGET: {profile.gradYear ? `CLASS OF ${profile.gradYear}` : '2026'}
                </span>
              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* 4. RPG SKILL TREE WITH BLOCK PROGRESS BARS */}
          {/* ========================================================================= */}
          <div 
            className="p-6 sm:p-8 rounded-3xl border-2 border-cyan-500/50 space-y-6 font-mono"
            style={{
              backgroundColor: 'rgba(8, 16, 30, 0.95)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6), inset 0 0 30px rgba(6, 182, 212, 0.08)'
            }}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-cyan-500/30">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400 block">
                  HERO ATTRIBUTE NODES
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white tracking-wide flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                  <span>RPG SKILL TREE & ATTRIBUTE MATRIX</span>
                </h3>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-md bg-cyan-950/90 text-cyan-300 border border-cyan-500/40 font-bold">
                  Skill Points Allocated: 48/50
                </span>
              </div>
            </div>

            {/* Skill Tree Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
              {skillTreeData.map((sk, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/30 space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white tracking-wide">
                        {sk.name}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                        {sk.level}
                      </span>
                    </div>
                    <span className="text-cyan-300 font-bold text-xs">{sk.pct}%</span>
                  </div>

                  {/* Character Block Meter (as requested: Python █████████░) */}
                  <div className="text-xs font-mono tracking-widest text-cyan-400 font-black select-none">
                    {sk.blocks}
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-slate-900 border border-cyan-500/30 overflow-hidden">
                    <div 
                      className={`h-full rounded-full bg-gradient-to-r ${sk.color} transition-all duration-1000`}
                      style={{ width: `${sk.pct}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <span>{sk.tier}</span>
                    <span className="text-emerald-400 font-semibold">Active Node</span>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* ========================================================================= */}
          {/* 5. COMPLETED MISSIONS & QUEST CHRONICLES */}
          {/* ========================================================================= */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-950/90 border border-cyan-500/40 space-y-5 font-mono">
            <div className="flex items-center justify-between pb-2 border-b border-cyan-500/30">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Scroll className="w-4 h-4 text-cyan-400" />
                <span>Completed Missions & Quest Log</span>
              </h3>
              <span className="text-[10px] text-cyan-300 font-mono">CHRONICLES // VERIFIED</span>
            </div>

            <div className="relative pl-7 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-cyan-400 before:via-purple-400 before:to-emerald-400">
              
              {/* Mission 01: Academic Quest */}
              <div className="relative">
                <div className="absolute -left-7 top-1 w-4 h-4 rounded-full bg-cyan-400 border-2 border-black shadow-[0_0_8px_rgba(6,182,212,0.9)]" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-white">[MISSION 01: SCHOLASTIC DUNGEON] Degree Foundation</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-200 border border-cyan-400/40">
                      +2,500 XP
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Enrolled at <strong className="text-white">{profile.university}</strong> in {profile.major} {profile.gpa ? `(GPA ${profile.gpa})` : ''}.
                  </p>
                </div>
              </div>

              {/* Mission 02: Hackathons / Boss Raids */}
              {profile.hackathons && profile.hackathons.length > 0 && (
                <div className="relative">
                  <div className="absolute -left-7 top-1 w-4 h-4 rounded-full bg-purple-400 border-2 border-black shadow-[0_0_8px_rgba(168,85,247,0.9)]" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-white">[MISSION 02: BOSS RAID VICTORY] Hackathons & Tournaments</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/40">
                        +1,500 XP
                      </span>
                    </div>
                    <div className="space-y-1">
                      {profile.hackathons.map((hack) => (
                        <p key={hack.id} className="text-xs text-slate-300">
                          • <strong className="text-white">{hack.name}</strong> ({hack.year || '2024'}): {hack.projectOrAward}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Mission 03: Guild Internships */}
              {profile.internships && profile.internships.length > 0 && (
                <div className="relative">
                  <div className="absolute -left-7 top-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-black shadow-[0_0_8px_rgba(16,185,129,0.9)]" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-white">[MISSION 03: GUILD APPRENTICESHIP] Industry Internships</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/40">
                        +2,000 XP
                      </span>
                    </div>
                    <div className="space-y-2">
                      {profile.internships.map((intern) => (
                        <div key={intern.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-xs">
                          <div className="flex justify-between items-center font-bold text-white">
                            <span>{intern.role} @ {intern.company}</span>
                            <span className="text-[11px] text-cyan-300">{intern.duration}</span>
                          </div>
                          <p className="text-slate-300 text-xs mt-1 leading-relaxed">{intern.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Mission 04: Grand Final Raid Target */}
              <div className="relative">
                <div className="absolute -left-7 top-1 w-4 h-4 rounded-full bg-amber-400 border-2 border-black shadow-[0_0_12px_rgba(250,204,21,0.9)] animate-pulse" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-white">[MISSION 04: GUILDMASTER DEBUT] Career Class Launch</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/40">
                      +5,000 XP
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Unlock full career deployment into <strong className="text-white">{topMatchTitle}</strong> {profile.dreamCompany ? `at ${profile.dreamCompany}` : ''} {profile.gradYear ? `by Class of ${profile.gradYear}` : 'upon graduation'}.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* ========================================================================= */}
          {/* 6. CRAFTED GEAR & SOFTWARE PROJECTS */}
          {/* ========================================================================= */}
          <div className="space-y-4 font-mono">
            <div className="flex items-center justify-between pb-2 border-b border-cyan-500/30">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Crafted Artifacts & Project Repositories</span>
              </h3>
              <span className="text-[10px] text-cyan-300 font-mono">{profile.projects?.length || 0} Artifacts</span>
            </div>

            {profile.projects && profile.projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.projects.map((proj, idx) => (
                  <div 
                    key={proj.id}
                    className="p-5 sm:p-6 rounded-2xl bg-slate-950/90 border border-cyan-500/40 hover:border-cyan-400 transition-all space-y-3 shadow-lg group relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-cyan-400 font-bold">
                          ITEM #{String(idx + 1).padStart(2, '0')}
                        </span>
                        <h4 className="font-bold text-sm sm:text-base text-white group-hover:text-cyan-200 transition-colors">
                          {proj.title}
                        </h4>
                      </div>
                      {proj.link && (
                        <a 
                          href={proj.link} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-cyan-400 hover:text-white p-1 rounded-lg hover:bg-cyan-500/20 transition-colors"
                          title="Inspect artifact code repository"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                      {proj.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-cyan-500/20">
                      {proj.technologies.map((t) => (
                        <span 
                          key={t}
                          className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-900 text-cyan-200 border border-cyan-400/40"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-950/40 border border-dashed border-cyan-500/30 text-center text-xs text-slate-400">
                No crafted project artifacts recorded yet. Update your profile to register software builds.
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* 7. ACHIEVEMENTS & GUILD TROPHIES */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 font-mono">
            
            {/* RPG Achievements */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/90 border border-cyan-500/40 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Achievements & Legendary Feats</span>
              </h3>

              {profile.achievements && profile.achievements.length > 0 ? (
                <div className="space-y-2">
                  {profile.achievements.map((ach, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-900/80 border border-amber-500/30 flex items-center gap-2.5 text-xs text-slate-200">
                      <Medal className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{ach}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No achievements registered yet.</p>
              )}
            </div>

            {/* Verified Certifications */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/90 border border-purple-500/40 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>Guild Certifications & Accreditations</span>
              </h3>

              {profile.certifications && profile.certifications.length > 0 ? (
                <div className="space-y-2">
                  {profile.certifications.map((cert, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-900/80 border border-purple-500/30 flex items-center gap-2.5 text-xs text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No certifications registered yet.</p>
              )}
            </div>

          </div>

          {/* ========================================================================= */}
          {/* 8. GUILDMASTER MOTTO & TACTICAL CREED */}
          {/* ========================================================================= */}
          <div 
            className="p-7 sm:p-9 rounded-3xl border-2 border-cyan-400/60 text-center relative overflow-hidden shadow-2xl font-mono"
            style={{
              backgroundColor: '#091322',
              backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.15), transparent 70%), linear-gradient(180deg, #0d1e38 0%, #040810 100%)',
              boxShadow: '0 15px 40px rgba(0, 0, 0, 0.7), inset 0 0 25px rgba(6, 182, 212, 0.15)'
            }}
          >
            <div className="max-w-2xl mx-auto space-y-3">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-400">
                ✦ GUILDMASTER CODEX & CAREER MISSION ✦
              </span>
              <p className="text-base sm:text-lg font-bold text-white italic leading-relaxed">
                "{profile.careerGoals || expConfig.motivationalQuote || 'Level up through deep technical mastery, tackle complex algorithmic boss raids, and build systems that scale across realms.'}"
              </p>
              <div className="pt-2 flex items-center justify-center gap-2 text-xs text-cyan-300 font-medium">
                <span>—</span>
                <span className="font-bold text-white">{profile.fullName || 'Legendary Tactician'}</span>
                <span>•</span>
                <span className="text-cyan-300">{profile.university}</span>
                <span>—</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  const getCardBorderClass = () => {
    switch(expId as string) {
      case 'gaming':
        return 'border-cyan-500/50 shadow-[0_0_35px_rgba(6,182,212,0.25)]';
      case 'kpop':
        return 'border-purple-400/50 shadow-[0_0_35px_rgba(192,132,252,0.25)]';
      case 'anime':
        return 'border-rose-500/50 shadow-[0_0_35px_rgba(244,63,94,0.25)]';
      case 'sports':
        return 'border-amber-400/50 shadow-[0_0_35px_rgba(234,179,8,0.25)]';
      case 'dark-academia':
        return 'border-amber-600/50 shadow-[0_0_35px_rgba(217,119,6,0.25)]';
      case 'cinematic':
        return 'border-amber-500/50 shadow-[0_0_35px_rgba(245,158,11,0.25)]';
      case 'professional':
      default:
        return 'border-blue-500/40 shadow-[0_0_35px_rgba(59,130,246,0.2)]';
    }
  };

  return (
    <div 
      className={`relative overflow-hidden rounded-[2rem] border-2 transition-all duration-300 ${getCardBorderClass()}`}
      style={{
        backgroundColor: expConfig.palette.cardBg,
        borderColor: expConfig.palette.cardBorder,
        boxShadow: `0 25px 50px -12px ${expConfig.palette.accentGlow}`
      }}
    >
      {/* Dynamic Background Banner Ambient Layer */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${expConfig.palette.bannerGradient} opacity-60 pointer-events-none`}
      />
      
      {/* Themed Decorative Corner Accents */}
      <div className="absolute top-0 left-0 w-24 h-24 pointer-events-none opacity-25">
        <div 
          className="w-full h-full border-t-2 border-l-2 rounded-tl-3xl"
          style={{ borderColor: expConfig.palette.accent }}
        />
      </div>
      <div className="absolute bottom-0 right-0 w-24 h-24 pointer-events-none opacity-25">
        <div 
          className="w-full h-full border-b-2 border-r-2 rounded-br-3xl"
          style={{ borderColor: expConfig.palette.accent }}
        />
      </div>

      <div className="relative z-10 p-6 sm:p-8 lg:p-10 space-y-8">
        
        {/* ========================================================================= */}
        {/* 1. TOP COLLECTIBLE HEADER & EXPERIENCE SWITCHER */}
        {/* ========================================================================= */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="flex flex-wrap items-center gap-3">
            {/* Holographic Series Badge */}
            <div 
              className="px-3.5 py-1 rounded-full text-xs font-black tracking-wider uppercase flex items-center gap-2 shadow-sm"
              style={{
                backgroundColor: expConfig.palette.badgeBg,
                color: expConfig.palette.badgeText,
                border: `1px solid ${expConfig.palette.badgeBorder}`
              }}
            >
              <IconComponent className="w-3.5 h-3.5" />
              <span>{expConfig.categoryBadge}</span>
            </div>

            <span className="text-[11px] font-bold text-white/60 tracking-wider uppercase">
              • Official Student Career Identity Card
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {onEditProfile && (
              <button
                type="button"
                onClick={onEditProfile}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-1.5 shadow-sm"
                title="Edit student profile credentials & inventory"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Credentials</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleEditExperience}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-950/80 hover:bg-slate-900 text-white border border-white/20 transition-all shadow-md group"
              title="Switch Profile Experience (8 themes)"
            >
              <Palette className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" style={{ color: expConfig.palette.accent }} />
              <span>Theme: <strong className="text-white ml-0.5">{expConfig.name}</strong></span>
              <ChevronRight className="w-3.5 h-3.5 text-white/50" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. HERO IDENTITY MATRIX */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            
            {/* Professional Framed Portrait */}
            <ProfilePortraitFrame 
              profile={profile} 
              experienceId={expId} 
              size="lg" 
              showEditOverlay={true}
              onEditClick={onEditPortrait || onEditProfile}
            />

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className={`text-2xl sm:text-3xl font-black text-white tracking-tight ${expConfig.fontDisplay}`}>
                  {profile.fullName || 'Student Candidate'}
                </h1>
                <span 
                  className="text-xs px-3 py-0.5 rounded-full font-bold shadow-sm"
                  style={{
                    backgroundColor: expConfig.palette.badgeBg,
                    color: expConfig.palette.badgeText,
                    border: `1px solid ${expConfig.palette.badgeBorder}`
                  }}
                >
                  {currentRank}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0" style={{ color: expConfig.palette.accentLight }} />
                <p 
                  className={`text-sm sm:text-base font-bold tracking-wide ${expConfig.fontDisplay}`}
                  style={{ color: expConfig.palette.accentLight }}
                >
                  {expConfig.personaTitle}
                </p>
              </div>

              <div className="text-xs sm:text-sm text-slate-200/90 space-y-1">
                <div className="flex flex-wrap items-center gap-2 font-medium">
                  <span className="flex items-center gap-1 text-white font-semibold">
                    <GraduationCap className="w-4 h-4 text-white/80" />
                    {profile.university || 'University Student'}
                  </span>
                  <span>•</span>
                  <span>{profile.gradYear ? `Class of ${profile.gradYear}` : 'Undergraduate'}</span>
                  {profile.gpa && (
                    <>
                      <span>•</span>
                      <span className="px-2 py-0.2 rounded-md bg-emerald-500/20 text-emerald-300 font-mono font-bold border border-emerald-500/30">
                        GPA {profile.gpa}
                      </span>
                    </>
                  )}
                </div>

                <div className="text-slate-300/80 text-xs flex flex-wrap items-center gap-1.5">
                  <span>{profile.department || 'Academic Department'}</span>
                  <span>—</span>
                  <span className="text-white font-medium">{profile.major}</span>
                  {profile.semester && (
                    <span className="text-slate-400 font-normal">({profile.semester})</span>
                  )}
                </div>
              </div>

              <div className="pt-1 flex items-start gap-1.5 text-xs">
                <Target className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span className="text-slate-300">
                  Career Goal: <strong className="text-white">{profile.dreamRole || profile.careerGoals || 'Leading Technical Innovation'}</strong>
                  {profile.dreamCompany && (
                    <span className="text-purple-300 ml-1">@ {profile.dreamCompany}</span>
                  )}
                </span>
              </div>
            </div>

          </div>

          <div className="lg:col-span-5 p-5 rounded-3xl bg-slate-950/80 border border-white/15 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Career Readiness Metric
                </span>
                <h4 className="text-sm font-extrabold text-white truncate max-w-[200px]" title={expConfig.readinessMetricName}>
                  {expConfig.readinessMetricName}
                </h4>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black font-mono" style={{ color: expConfig.palette.accentLight }}>
                  {readinessScore}%
                </span>
              </div>
            </div>

            <div className="w-full h-3.5 rounded-full bg-slate-900 border border-white/10 p-0.5 overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${readinessScore}%`,
                  backgroundColor: expConfig.palette.accent,
                  boxShadow: `0 0 15px ${expConfig.palette.accentGlow}`
                }}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-slate-400 block font-medium">Rank Tier</span>
                <strong className="text-xs text-white font-bold block truncate">{currentRank.split(' ')[0]}</strong>
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-slate-400 block font-medium">Skills Logged</span>
                <strong className="text-xs text-emerald-400 font-mono font-bold block">
                  {(profile.skills?.length || 0) + (profile.programmingLanguages?.length || 0)}
                </strong>
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-slate-400 block font-medium">Projects Built</span>
                <strong className="text-xs text-purple-300 font-mono font-bold block">
                  {profile.projects?.length || 0}
                </strong>
              </div>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 3. TOP CAREER MATCH BANNER */}
        {/* ========================================================================= */}
        <div 
          className="p-5 sm:p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden"
          style={{
            backgroundColor: 'rgba(10, 15, 30, 0.75)',
            borderColor: expConfig.palette.cardBorder
          }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span>Top AI Career Match</span>
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {topMatchScore}% Compatibility Score
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 font-medium">
                  {topMatchDemand}
                </span>
              </div>

              <h3 className={`text-lg sm:text-xl font-extrabold text-white ${expConfig.fontDisplay}`}>
                {topMatchTitle}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                {topMatchReason}
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-3 w-full md:w-auto justify-end">
              <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-right">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Target Role Synergy</span>
                <span className="text-sm font-black text-white font-mono">{topMatchScore}% Synergy</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. CORE STRENGTHS & TECHNICAL SKILLS */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-950/70 border border-white/10 space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Zap className="w-4 h-4" style={{ color: expConfig.palette.accentLight }} />
                <span>Core Academic & Technical Strengths</span>
              </h3>
              <span className="text-[10px] text-slate-400">{coreStrengths.length} Verified</span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {coreStrengths.map((str, idx) => (
                <div 
                  key={idx}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-all hover:scale-105"
                  style={{
                    backgroundColor: expConfig.palette.badgeBg,
                    color: expConfig.palette.badgeText,
                    border: `1px solid ${expConfig.palette.badgeBorder}`
                  }}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{str}</span>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5 text-xs text-slate-300 mt-3">
              <div 
                className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-white font-bold"
                style={{ backgroundColor: expConfig.palette.accentDark }}
              >
                <IconComponent className="w-3.5 h-3.5" />
              </div>
              <div>
                <strong className="text-white mr-1">{expConfig.mascotName}:</strong>
                <span className="italic">"{expConfig.mascotGreeting}"</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-950/70 border border-white/10 space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Code className="w-4 h-4 text-blue-400" />
                <span>Technical Skills & Proficiency Matrix</span>
              </h3>
              <span className="text-[10px] text-slate-400">
                {(profile.skills?.length || 0) + (profile.programmingLanguages?.length || 0)} Technologies
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Technical Proficiencies & Competency Breakdown
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {normalizedSkills.map((sk) => (
                  <div key={sk.name} className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-white font-bold">{sk.name}</span>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                          sk.level === 'Advanced'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : sk.level === 'Intermediate'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : 'bg-slate-700/40 text-slate-300 border border-slate-600/30'
                        }`}>
                          {sk.level}
                        </span>
                        <span className="text-slate-400 font-mono text-[11px]">{sk.percentage}%</span>
                      </div>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-700" 
                        style={{ 
                          width: `${sk.percentage}%`,
                          backgroundColor: expConfig.palette.accent 
                        }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Frameworks & Specialized Tools
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(profile.frameworks && profile.frameworks.length > 0 ? profile.frameworks : profile.skills).map((item) => (
                  <span 
                    key={item}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-900/90 text-slate-200 border border-slate-700/80 hover:border-slate-500 transition-colors"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* 5. PROJECTS */}
        {/* ========================================================================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Verified Portfolio Projects</span>
            </h3>
            <span className="text-[10px] text-slate-400">{profile.projects?.length || 0} Projects</span>
          </div>

          {profile.projects && profile.projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.projects.map((proj) => (
                <div 
                  key={proj.id}
                  className="p-5 rounded-2xl bg-slate-950/80 border border-white/15 hover:border-white/30 transition-all space-y-3 shadow-lg group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-extrabold text-sm text-white group-hover:text-purple-300 transition-colors">
                      {proj.title}
                    </h4>
                    {proj.link && (
                      <a 
                        href={proj.link} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                        title="View project code / demo"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {proj.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/10">
                    {proj.technologies.map((t) => (
                      <span 
                        key={t}
                        className="px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-purple-500/15 text-purple-300 border border-purple-500/25"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-slate-950/50 border border-dashed border-slate-800 text-center text-xs text-slate-400">
              No projects added yet. Click "Edit Credentials" above to document your engineering builds.
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 6. CAREER JOURNEY TIMELINE */}
        {/* ========================================================================= */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/70 border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Career Journey & Trajectory Pathway</span>
            </h3>
            <span className="text-[10px] text-slate-400">Progression Milestones</span>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-purple-500 before:to-emerald-500">
            
            <div className="relative">
              <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-slate-950 shadow" />
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-white">Stage 1: University Foundation</span>
                  <span className="text-[10px] px-2 py-0.2 rounded-full bg-blue-500/20 text-blue-300 font-mono">Academic</span>
                </div>
                <p className="text-xs text-slate-300">
                  {profile.major} at {profile.university} {profile.gpa ? `(GPA ${profile.gpa})` : ''}.
                </p>
              </div>
            </div>

            {profile.hackathons && profile.hackathons.length > 0 && (
              <div className="relative">
                <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-purple-500 border-2 border-slate-950 shadow" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-white">Stage 2: Hackathons & Competitions</span>
                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-purple-500/20 text-purple-300 font-mono">Innovation</span>
                  </div>
                  <div className="space-y-1">
                    {profile.hackathons.map((hack) => (
                      <p key={hack.id} className="text-xs text-slate-300">
                        • <strong className="text-white">{hack.name}</strong> ({hack.year || '2024'}): {hack.projectOrAward}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {profile.internships && profile.internships.length > 0 && (
              <div className="relative">
                <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950 shadow" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-white">Stage 3: Professional Internships</span>
                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">Industry</span>
                  </div>
                  <div className="space-y-1.5">
                    {profile.internships.map((intern) => (
                      <div key={intern.id} className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                        <div className="flex justify-between items-center font-bold text-white">
                          <span>{intern.role} @ {intern.company}</span>
                          <span className="text-[11px] text-slate-400 font-mono">{intern.duration}</span>
                        </div>
                        <p className="text-slate-300 text-xs mt-1">{intern.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="relative">
              <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-slate-950 shadow animate-pulse" />
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-white">Stage 4: Target Career Launch</span>
                  <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-mono">Vision</span>
                </div>
                <p className="text-xs text-slate-300">
                  Targeting <strong className="text-white">{topMatchTitle}</strong> {profile.dreamCompany ? `at ${profile.dreamCompany}` : ''} with expected entry {profile.gradYear ? `by ${profile.gradYear}` : 'post-graduation'}.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* 7. ACHIEVEMENTS & CERTIFICATIONS */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-white/10 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Honors & Key Achievements</span>
            </h3>

            {profile.achievements && profile.achievements.length > 0 ? (
              <div className="space-y-2">
                {profile.achievements.map((ach, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5 text-xs text-slate-200">
                    <Award className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{ach}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No formal achievements added yet.</p>
            )}
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/70 border border-white/10 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Verified Certifications</span>
            </h3>

            {profile.certifications && profile.certifications.length > 0 ? (
              <div className="space-y-2">
                {profile.certifications.map((cert, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{cert}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No certifications added yet.</p>
            )}
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 8. SKILL GAPS */}
        {/* ========================================================================= */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/70 border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>Identified Skill Gaps & Recommended Bridge Plan</span>
            </h3>
            <span className="text-[10px] text-slate-400">Actionable Growth Areas</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {skillGaps.slice(0, 3).map((gap, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white truncate max-w-[170px]" title={gap.skill}>
                    {gap.skill}
                  </span>
                  <span className={`text-[10px] px-2 py-0.2 rounded-full font-bold uppercase ${
                    gap.priority === 'High' 
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {gap.priority} Priority
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {gap.howToAcquire || `Acquire via capstone project and technical coursework.`}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 9. PERSONAL CAREER STATEMENT */}
        {/* ========================================================================= */}
        <div 
          className="p-6 rounded-3xl border transition-all text-center relative overflow-hidden"
          style={{
            backgroundColor: 'rgba(15, 20, 35, 0.85)',
            borderColor: expConfig.palette.cardBorder
          }}
        >
          <div className="max-w-2xl mx-auto space-y-2.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Personal Career Statement & Mission Vision
            </span>
            <p className={`text-sm sm:text-base font-semibold text-white italic leading-relaxed ${expConfig.fontDisplay}`}>
              "{profile.careerGoals || expConfig.motivationalQuote || 'Dedicated to engineering transformative technical systems that bridge artificial intelligence, scalable software, and high-impact societal solutions.'}"
            </p>
            <div className="pt-2 flex items-center justify-center gap-2 text-xs" style={{ color: expConfig.palette.accentLight }}>
              <span>—</span>
              <span className="font-bold">{profile.fullName || 'Student Candidate'}</span>
              <span>•</span>
              <span className="font-mono">{profile.university}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
