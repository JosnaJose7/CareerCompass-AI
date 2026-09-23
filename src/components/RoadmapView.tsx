import React, { useState, useMemo } from 'react';
import { 
  Map, 
  CheckCircle2, 
  Circle, 
  Copy, 
  Check, 
  ExternalLink, 
  Award, 
  Calendar,
  Code2,
  BookOpen,
  ArrowRight,
  Bookmark,
  Layers,
  Sparkles,
  Target,
  FileCode2,
  FolderGit2,
  GraduationCap,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Clock,
  Zap,
  TrendingUp,
  ShieldCheck,
  Briefcase,
  Flame,
  CheckCheck,
  Compass,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { CareerRoadmap, RoadmapMilestone, MonthlyGoal, RoadmapProject, RoadmapCourse, RoadmapPracticeQuestion } from '../types';
import { BackButton } from './BackButton';

interface RoadmapViewProps {
  roadmap: CareerRoadmap | null;
  setRoadmap?: React.Dispatch<React.SetStateAction<CareerRoadmap | null>>;
  onUpdateMilestoneTask: (milestoneId: string, taskIndex: number, completed: boolean) => void;
  onSaveRoadmap: () => void;
  isSaving: boolean;
  onGenerateRoadmapForRole: (roleTitle: string) => void;
  isGenerating: boolean;
  onBack?: () => void;
}

type MainTab = 'journey' | 'pathmap' | 'projects' | 'courses' | 'practice';

interface StageDefinition {
  id: string;
  stageNumber: string;
  name: string;
  subtitle: string;
  focusSummary: string;
  focusPriorities: string[];
  aiInsight: string;
  skillPipeline: {
    learn: string;
    apply: string;
    strengthens: string;
    outcome: string;
  };
  evidenceProduced: string[];
}

const STAGES_META: StageDefinition[] = [
  {
    id: 'stage_1',
    stageNumber: '01',
    name: 'FOUNDATION',
    subtitle: 'Build the fundamentals you are currently missing',
    focusSummary: 'Master core language syntax, systems architecture, algorithmic complexity, and foundational tooling before tackling complex workflows.',
    focusPriorities: [
      'Core language primitives & data structures',
      'System design fundamentals & architectural patterns',
      'Version control & continuous development environment',
      'Algorithmic problem solving and Big-O efficiency'
    ],
    aiInsight: 'Your baseline academic profile is solid, but entry-level hiring filters test heavily on raw fundamentals. Mastering core data structures and Git hygiene eliminates early screening drop-offs.',
    skillPipeline: {
      learn: 'Core Language Primitives & Algorithms',
      apply: 'Foundational API & Data Modules',
      strengthens: 'Algorithmic Problem-Solving Aptitude',
      outcome: 'Pass Technical Phone Screens'
    },
    evidenceProduced: [
      'Clean GitHub repositories with semantic commit logs',
      '25+ solved LeetCode / algorithmic challenge solutions',
      'Foundational module documentation & test cases'
    ]
  },
  {
    id: 'stage_2',
    stageNumber: '02',
    name: 'BUILD',
    subtitle: 'Turn knowledge into practical ability',
    focusSummary: 'Transition from isolated coding exercises to architecting real-world components, full-stack endpoints, and robust database layers.',
    focusPriorities: [
      'Production frameworks and modern state management',
      'REST / GraphQL API design & database ORMs',
      'Authentication, authorization & security best practices',
      'Automated testing & error handling frameworks'
    ],
    aiInsight: 'Most student applicants stop at simple tutorials. This stage emphasizes shipping end-to-end features with production-grade error boundaries and persistent storage.',
    skillPipeline: {
      learn: 'Modern Frameworks & Backend Services',
      apply: 'Full-Stack Web / API Application',
      strengthens: 'End-to-End System Architecture',
      outcome: 'Demonstrate Real Engineering Autonomy'
    },
    evidenceProduced: [
      'Interactive full-stack web application',
      'Documented REST API with live Swagger/Postman specs',
      'Automated CI unit testing suite'
    ]
  },
  {
    id: 'stage_3',
    stageNumber: '03',
    name: 'PROVE',
    subtitle: 'Create evidence that you can do the job',
    focusSummary: 'Build indisputable proof of competency through deployed cloud artifacts, recognized certifications, and quantified portfolio case studies.',
    focusPriorities: [
      'Cloud containerization & production deployment (AWS / Docker)',
      'Quantified resume bullet points (Google XYZ formula)',
      'Industry-recognized developer certifications',
      'Technical case studies & open source contributions'
    ],
    aiInsight: 'Recruiters spend an average of 6 seconds skimming a resume. Verifiable cloud deployment URLs and measurable performance metrics instantly place you in the top 10% of applicants.',
    skillPipeline: {
      learn: 'Docker & Cloud Deployment Infrastructure',
      apply: 'Live Cloud SaaS Artifact with Domain',
      strengthens: 'DevOps & Production Readiness',
      outcome: 'Beat ATS Screening Filters'
    },
    evidenceProduced: [
      'Live deployed production application with 99%+ uptime',
      'Industry certification credential badge',
      'Portfolio website with architecture deep-dives'
    ]
  },
  {
    id: 'stage_4',
    stageNumber: '04',
    name: 'LAUNCH',
    subtitle: 'Turn your preparation into opportunities',
    focusSummary: 'Targeted application campaigns, mock technical & STAR behavioral interviews, alumni networking, and strategic recruiter outreach.',
    focusPriorities: [
      'ATS resume tailored to specific job postings',
      'STAR method behavioral stories & leadership anecdotes',
      'Live technical live-coding & system design practice',
      'Targeted networking with university alumni & hiring managers'
    ],
    aiInsight: 'The final conversion barrier is interview communication. Transforming your engineering achievements into structured STAR narratives drives offer conversion.',
    skillPipeline: {
      learn: 'STAR Behavioral Framework & Live Mock Prep',
      apply: 'Targeted Applications & Alumni Coffee Chats',
      strengthens: 'Interview Presence & Communication',
      outcome: 'Secure Competitive Job Offers'
    },
    evidenceProduced: [
      'ATS-optimized resume tailored to 10+ target roles',
      'STAR interview matrix with 8+ documented scenarios',
      '15+ active recruiter connections & warm referrals'
    ]
  }
];

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  roadmap,
  setRoadmap,
  onUpdateMilestoneTask,
  onSaveRoadmap,
  isSaving,
  onGenerateRoadmapForRole,
  isGenerating,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<MainTab>('journey');
  const [selectedStageIndex, setSelectedStageIndex] = useState<number>(0);
  const [expandedStages, setExpandedStages] = useState<Record<string, boolean>>({
    'stage_0': true,
    'stage_1': false,
    'stage_2': false,
    'stage_3': false,
  });
  const [expandedMilestones, setExpandedMilestones] = useState<Record<string, boolean>>({});
  const [expandedTasksAll, setExpandedTasksAll] = useState<Record<string, boolean>>({});
  const [readMoreSections, setReadMoreSections] = useState<Record<string, boolean>>({});
  const [copiedBulletId, setCopiedBulletId] = useState<string | null>(null);
  const [recentlyCompletedTaskId, setRecentlyCompletedTaskId] = useState<string | null>(null);

  // Helper to copy bullet
  const handleCopyBullet = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBulletId(id);
    setTimeout(() => setCopiedBulletId(null), 2000);
  };

  // Toggle stage expansion
  const toggleStage = (stageKey: string) => {
    setExpandedStages(prev => ({
      ...prev,
      [stageKey]: !prev[stageKey]
    }));
  };

  // Toggle Read More for specific card
  const toggleReadMore = (id: string) => {
    setReadMoreSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Toggle "View all tasks" for a milestone
  const toggleViewAllTasks = (milestoneId: string) => {
    setExpandedTasksAll(prev => ({
      ...prev,
      [milestoneId]: !prev[milestoneId]
    }));
  };

  // Map incoming roadmap data into 4 standardized stages
  const normalizedStages = useMemo(() => {
    if (!roadmap) return [];

    const milestones = roadmap.milestones || [];
    const monthlyGoals = roadmap.monthlyGoals || [];

    return STAGES_META.map((meta, index) => {
      // Find corresponding milestone or goal
      const milestone = milestones[index] || null;
      const monthlyGoal = monthlyGoals[index] || null;

      // Extract tasks
      let rawTasks: { id: string; title: string; completed: boolean; effort?: string }[] = [];

      if (milestone && Array.isArray(milestone.tasks)) {
        rawTasks = milestone.tasks.map((t: any, tIdx: number) => {
          if (typeof t === 'string') {
            const effortEstimates = ['45 min', '2 hrs', '3 hrs', '1.5 hrs', '4 hrs'];
            return {
              id: `${milestone.id || `m_${index}`}_t_${tIdx}`,
              title: t,
              completed: milestone.completed || false,
              effort: effortEstimates[tIdx % effortEstimates.length]
            };
          }
          return {
            id: t.id || `${milestone.id}_t_${tIdx}`,
            title: t.title || 'Action task',
            completed: !!t.completed,
            effort: t.effort || '2 hrs'
          };
        });
      } else if (monthlyGoal && Array.isArray(monthlyGoal.weeklyGoals)) {
        monthlyGoal.weeklyGoals.forEach((wg) => {
          (wg.tasks || []).forEach((t, tIdx) => {
            rawTasks.push({
              id: t.id || `${wg.id}_t_${tIdx}`,
              title: t.title,
              completed: !!t.completed,
              effort: '2 hrs'
            });
          });
        });
      }

      // Default fallback tasks if none present
      if (rawTasks.length === 0) {
        const defaultStageTasks: Record<number, string[]> = {
          0: [
            'Complete core language syntax and standard library drills',
            'Implement fundamental data structures (Stacks, Queues, Binary Trees)',
            'Set up automated Git workflow with pre-commit hooks'
          ],
          1: [
            'Architect a responsive client interface with TypeScript and React',
            'Develop secure backend REST endpoints with JWT authentication',
            'Write integration test suites with 80%+ code coverage'
          ],
          2: [
            'Deploy full-stack artifact to cloud infrastructure with continuous delivery',
            'Earn target cloud developer certification credential',
            'Document performance optimization metrics using Google XYZ format'
          ],
          3: [
            'Tailor resume keywords to 10 top tier job descriptions',
            'Conduct 3 timed mock interview rounds with technical mentors',
            'Execute outbound networking campaign targeting 15 alumni engineers'
          ]
        };

        const defaultEfforts = ['45 min', '2 hrs', '4 hrs'];
        rawTasks = (defaultStageTasks[index] || ['Complete milestone objective']).map((title, tIdx) => ({
          id: `stage_${index}_task_${tIdx}`,
          title,
          completed: index === 0, // Mark first as done by default for motivation
          effort: defaultEfforts[tIdx % defaultEfforts.length]
        }));
      }

      const completedCount = rawTasks.filter(t => t.completed).length;
      const totalCount = rawTasks.length;
      const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
      const isCompleted = progress === 100;

      return {
        ...meta,
        index,
        milestoneId: milestone?.id || `m_${index}`,
        customTitle: milestone?.title || monthlyGoal?.title || `${meta.name}: ${meta.subtitle}`,
        customDescription: milestone?.description || monthlyGoal?.summary || meta.focusSummary,
        tasks: rawTasks,
        completedCount,
        totalCount,
        progress,
        isCompleted,
        resumeBullet: milestone?.resumeBulletSuggestion || (roadmap.projects && roadmap.projects[index]?.resumeBullet) || null,
        resources: milestone?.recommendedResources || []
      };
    });
  }, [roadmap]);

  // Overall Statistics
  const stats = useMemo(() => {
    let total = 0;
    let completed = 0;
    normalizedStages.forEach(s => {
      total += s.totalCount;
      completed += s.completedCount;
    });

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    // Dynamic Career Readiness calculation: Base 60% + scaled completion
    const baseReadiness = 62;
    const earnedReadiness = Math.round((completionRate / 100) * 36);
    const careerReadiness = Math.min(98, baseReadiness + earnedReadiness);

    const completedStagesCount = normalizedStages.filter(s => s.isCompleted).length;
    const currentActiveStage = normalizedStages.find(s => !s.isCompleted) || normalizedStages[normalizedStages.length - 1];

    return {
      totalTasks: total,
      completedTasks: completed,
      completionRate,
      careerReadiness,
      completedStagesCount,
      currentActiveStage
    };
  }, [normalizedStages]);

  // Next Best Action determination
  const nextBestAction = useMemo(() => {
    for (const stage of normalizedStages) {
      const incompleteTask = stage.tasks.find(t => !t.completed);
      if (incompleteTask) {
        return {
          task: incompleteTask,
          stage: stage,
          why: `This unlocks Stage ${stage.stageNumber} (${stage.name}) and advances your readiness by +3%.`
        };
      }
    }
    return null;
  }, [normalizedStages]);

  // Handle task toggling
  const handleToggleTask = (stageIndex: number, milestoneId: string, taskIndex: number, currentVal: boolean) => {
    onUpdateMilestoneTask(milestoneId, taskIndex, !currentVal);

    if (setRoadmap && roadmap) {
      // Local state update for immediate UI reflection
      const updatedMilestones = (roadmap.milestones || []).map((m, mIdx) => {
        if (mIdx === stageIndex || m.id === milestoneId) {
          const currentTasks = [...(m.tasks || [])];
          if (typeof currentTasks[taskIndex] === 'object') {
            currentTasks[taskIndex] = { ...currentTasks[taskIndex], completed: !currentVal };
          }
          return {
            ...m,
            tasks: currentTasks,
            completed: !currentVal
          };
        }
        return m;
      });

      setRoadmap({
        ...roadmap,
        milestones: updatedMilestones
      });
    }

    if (!currentVal) {
      setRecentlyCompletedTaskId(`${milestoneId}_${taskIndex}`);
      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.75 },
        colors: ['#6366F1', '#818CF8', '#A5B4FC', '#38BDF8', '#10B981']
      });
      setTimeout(() => setRecentlyCompletedTaskId(null), 3000);
    }
  };

  // Loading State
  if (isGenerating) {
    return (
      <div className="py-24 text-center max-w-xl mx-auto space-y-5">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 animate-pulse shadow-sm">
          <Compass className="w-7 h-7 animate-spin" style={{ animationDuration: '8s' }} />
        </div>
        <div className="space-y-2">
          <span className="text-[11px] font-mono font-bold text-indigo-400 uppercase tracking-widest">
            AI Strategy Engine Active
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Synthesizing Career Journey
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
            Structuring the optimal path from your current skills to target role requirements across 4 dedicated career stages.
          </p>
        </div>
        <div className="w-56 mx-auto h-1.5 bg-white/[0.08] rounded-full overflow-hidden mt-4">
          <div className="h-full bg-indigo-500 rounded-full animate-pulse w-3/4" />
        </div>
      </div>
    );
  }

  // Empty / Prompt state
  if (!roadmap) {
    return (
      <div className="py-20 max-w-2xl mx-auto space-y-6 text-center">
        {onBack && (
          <div className="flex justify-start">
            <BackButton onClick={onBack} />
          </div>
        )}
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#131724] border border-white/[0.08] flex items-center justify-center text-indigo-400 shadow-sm">
          <Map className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <span className="text-[11px] font-mono font-semibold text-indigo-400 uppercase tracking-wider">
            Personalized Career Journey
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Design Your Strategic Career Path
          </h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Choose a target profession to generate a comprehensive 4-stage career trajectory tailored to your background.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
          {[
            { title: 'Full-Stack Software Engineer', icon: Code2, desc: 'Frontend, backend services, cloud deployment' },
            { title: 'AI / Machine Learning Engineer', icon: Sparkles, desc: 'Model fine-tuning, RAG pipelines, PyTorch' },
            { title: 'Data Scientist & Analytics', icon: TrendingUp, desc: 'SQL modeling, ETL, business intelligence' }
          ].map((role) => {
            const Icon = role.icon;
            return (
              <button
                key={role.title}
                type="button"
                onClick={() => onGenerateRoadmapForRole(role.title)}
                className="p-4 rounded-xl bg-[#131724] border border-white/[0.08] hover:border-indigo-500/50 hover:bg-[#181D2E] text-left transition-all group cursor-pointer space-y-2"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {role.title}
                </h4>
                <p className="text-[11px] text-slate-400 leading-snug">
                  {role.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const targetRoleTitle = roadmap.roleTitle || (roadmap as any).targetRole || 'Target Career Path';

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION: Career Destination & Journey Progress */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#131724] border border-white/[0.08] relative overflow-hidden shadow-sm space-y-6">
        
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            {onBack && (
              <div className="mb-2">
                <BackButton onClick={onBack} />
              </div>
            )}
            
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-[11px] font-mono font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                <span>Personalized Career Journey</span>
              </span>
              <span className="text-slate-600 text-xs">&bull;</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                {stats.careerReadiness}% Career Readiness
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Your path to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white to-slate-200">{targetRoleTitle}</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {roadmap.overview || `A tailored 4-stage progression engineered to transform your current foundation into verifiable, interview-ready capability for junior to mid-level ${targetRoleTitle} roles.`}
            </p>
          </div>

          {/* Action Header Button */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onSaveRoadmap}
              disabled={isSaving}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-xs inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Bookmark className="w-4 h-4" />
              <span>{isSaving ? 'Saving to Firebase...' : 'Save Strategy'}</span>
            </button>
          </div>
        </div>

        {/* Supporting Meta Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/[0.06] text-xs">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase text-slate-500 block">Current Level</span>
            <span className="font-semibold text-slate-200">
              {stats.completedStagesCount === 0 ? 'Foundation Builder' : stats.completedStagesCount <= 2 ? 'Intermediate Candidate' : 'Job-Ready Advanced'}
            </span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase text-slate-500 block">Target Role</span>
            <span className="font-semibold text-indigo-300 truncate block">{targetRoleTitle}</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase text-slate-500 block">Estimated Journey</span>
            <span className="font-semibold text-slate-200">{roadmap.estimatedTimeToJobReady || '4 Months'}</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase text-slate-500 block">Next Milestone</span>
            <span className="font-semibold text-slate-200 truncate block">
              {stats.currentActiveStage ? `Stage ${stats.currentActiveStage.stageNumber}: ${stats.currentActiveStage.name}` : 'Complete Ready'}
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* HORIZONTAL STAGE JOURNEY PROGRESSOR (START → BUILD → PROVE → LAUNCH) */}
        {/* ========================================================================= */}
        <div className="space-y-2.5 pt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider">
              Strategic Journey Stages
            </span>
            <span className="text-[11px] font-mono text-indigo-300">
              {stats.completedStagesCount} of 4 Stages Completed
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {normalizedStages.map((stg, idx) => {
              const isCurrent = stats.currentActiveStage?.index === idx;
              const isDone = stg.isCompleted;

              return (
                <button
                  key={stg.id}
                  type="button"
                  onClick={() => {
                    setSelectedStageIndex(idx);
                    setActiveTab('journey');
                    setExpandedStages(prev => ({ ...prev, [`stage_${idx}`]: true }));
                  }}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                    isCurrent
                      ? 'bg-indigo-600/15 border-indigo-500/60 ring-1 ring-indigo-500/40 shadow-xs'
                      : isDone
                      ? 'bg-[#0E111B] border-emerald-500/30 text-slate-300'
                      : 'bg-[#0E111B]/60 border-white/[0.06] text-slate-500 hover:border-white/[0.15]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className={`text-[10px] font-mono font-bold ${
                      isCurrent ? 'text-indigo-400' : isDone ? 'text-emerald-400' : 'text-slate-500'
                    }`}>
                      STAGE {stg.stageNumber}
                    </span>
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : isCurrent ? (
                      <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                    ) : (
                      <Circle className="w-3 h-3 text-slate-600" />
                    )}
                  </div>
                  <h4 className={`text-xs font-bold ${
                    isCurrent ? 'text-white' : isDone ? 'text-slate-200' : 'text-slate-400'
                  }`}>
                    {stg.name}
                  </h4>
                  <div className="mt-2 w-full bg-white/[0.06] h-1 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 rounded-full ${
                        isDone ? 'bg-emerald-400' : isCurrent ? 'bg-indigo-500' : 'bg-slate-700'
                      }`}
                      style={{ width: `${stg.progress}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. PERSISTENT "NEXT BEST ACTION" HERO BANNER */}
      {/* ========================================================================= */}
      {nextBestAction && (
        <motion.div 
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 0, y: 0 }}
          className="p-5 rounded-2xl bg-gradient-to-r from-[#171C2E] via-[#131724] to-[#121520] border border-indigo-500/30 shadow-md relative overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                  <Zap className="w-3 h-3 text-indigo-400" />
                  <span>Next Best Action</span>
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Stage {nextBestAction.stage.stageNumber} &bull; {nextBestAction.task.effort || '2 hrs'}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                {nextBestAction.task.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-indigo-300">Why now:</strong> {nextBestAction.why}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const taskIdx = nextBestAction.stage.tasks.findIndex(t => t.id === nextBestAction.task.id);
                handleToggleTask(
                  nextBestAction.stage.index,
                  nextBestAction.stage.milestoneId,
                  taskIdx >= 0 ? taskIdx : 0,
                  false
                );
              }}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-sm shrink-0 flex items-center justify-center gap-2 cursor-pointer group"
            >
              <Check className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Complete Action</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* 3. NAVIGATION TABS (Journey, Path Map, Projects, Courses, Practice) */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-white/[0.08] pb-1">
        {[
          { key: 'journey', label: 'Career Journey (4 Stages)', icon: Layers },
          { key: 'pathmap', label: 'Career Path Node Map', icon: Map },
          { key: 'projects', label: `Portfolio Proof (${roadmap.projects?.length || roadmap.portfolioProjects?.length || 0})`, icon: FolderGit2 },
          { key: 'courses', label: `Curated Courses (${roadmap.courses?.length || roadmap.recommendedCourses?.length || 0})`, icon: GraduationCap },
          { key: 'practice', label: `Interview Practice (${roadmap.practiceQuestions?.length || 0})`, icon: MessageSquare }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as MainTab)}
              className={`px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 border ${
                isActive
                  ? 'bg-indigo-600/15 border-indigo-500/40 text-white shadow-xs'
                  : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 4. MAIN 2-COLUMN DESKTOP LAYOUT (Journey View) */}
      {/* ========================================================================= */}
      {activeTab === 'journey' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ------------------------------------------------------------- */}
          {/* LEFT COLUMN: 4 CAREER STAGES & MILESTONES (68% width on lg) */}
          {/* ------------------------------------------------------------- */}
          <div className="lg:col-span-8 space-y-6">
            
            {normalizedStages.map((stage, sIdx) => {
              const isExpanded = expandedStages[`stage_${sIdx}`] ?? (sIdx === 0);
              const isCurrent = stats.currentActiveStage?.index === sIdx;
              const hasCompletedAll = stage.isCompleted;
              const isAllTasksShown = expandedTasksAll[stage.milestoneId];
              const visibleTasks = isAllTasksShown ? stage.tasks : stage.tasks.slice(0, 3);
              const readMoreOpen = readMoreSections[`stage_${sIdx}`];

              return (
                <motion.div
                  key={stage.id}
                  layout
                  className={`rounded-2xl border transition-all ${
                    isCurrent
                      ? 'bg-[#131724] border-indigo-500/40 shadow-sm'
                      : hasCompletedAll
                      ? 'bg-[#131724]/90 border-white/[0.08]'
                      : 'bg-[#131724]/70 border-white/[0.06]'
                  }`}
                >
                  {/* Stage Card Header */}
                  <div 
                    onClick={() => toggleStage(`stage_${sIdx}`)}
                    className="p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2.5">
                        <span className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold ${
                          hasCompletedAll
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            : isCurrent
                            ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40'
                            : 'bg-white/[0.04] text-slate-400 border border-white/[0.08]'
                        }`}>
                          STAGE {stage.stageNumber}
                        </span>
                        <span className="text-xs text-slate-500">&bull;</span>
                        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                          {stage.name}
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                        {stage.customTitle}
                      </h3>

                      <p className="text-xs text-slate-400 leading-relaxed">
                        {stage.subtitle}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right hidden sm:block">
                        <span className="text-[11px] font-mono font-bold text-white block">
                          {stage.completedCount}/{stage.totalCount} Tasks
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {stage.progress}% Complete
                        </span>
                      </div>
                      <div className={`p-1.5 rounded-lg border border-white/[0.08] text-slate-400 transition-transform ${isExpanded ? 'rotate-180 bg-white/[0.04]' : ''}`}>
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Stage Content Expansion */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-5 sm:px-6 pb-6 space-y-6 border-t border-white/[0.06] pt-5"
                      >
                        
                        {/* 1. What You're Building & Focus Areas */}
                        <div className="p-4 rounded-xl bg-[#0E111B] border border-white/[0.06] space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider">
                              Stage Architectural Focus
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleReadMore(`stage_${sIdx}`);
                              }}
                              className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
                            >
                              {readMoreOpen ? 'Show less' : 'Read more'}
                            </button>
                          </div>

                          <p className="text-xs text-slate-300 leading-relaxed">
                            {stage.customDescription}
                          </p>

                          {/* Expandable deep explanation */}
                          {readMoreOpen && (
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] space-y-2 text-xs text-slate-300"
                            >
                              <div className="font-semibold text-white">Why This Stage Matters For {targetRoleTitle}:</div>
                              <p className="text-[11px] text-slate-400 leading-relaxed">
                                {stage.focusSummary}
                              </p>
                            </motion.div>
                          )}

                          {/* Focus Priorities Chips */}
                          <div className="space-y-1.5 pt-1">
                            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                              Key Priorities in this Stage:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {stage.focusPriorities.map((p, pIdx) => (
                                <span 
                                  key={pIdx}
                                  className="text-[11px] px-2.5 py-1 rounded-md bg-white/[0.04] text-slate-200 border border-white/[0.08] flex items-center gap-1.5"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                                  <span>{p}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* 2. Skill → Project → Career Connection Pipeline */}
                        <div className="p-4 rounded-xl bg-[#0E111B] border border-white/[0.06] space-y-3">
                          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                            Career Alignment Pipeline
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                            <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06] space-y-1">
                              <span className="text-[10px] font-mono text-indigo-400 block font-bold">1. LEARN</span>
                              <p className="text-[11px] font-medium text-slate-200">{stage.skillPipeline.learn}</p>
                            </div>
                            <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06] space-y-1">
                              <span className="text-[10px] font-mono text-indigo-400 block font-bold">2. APPLY</span>
                              <p className="text-[11px] font-medium text-slate-200">{stage.skillPipeline.apply}</p>
                            </div>
                            <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06] space-y-1">
                              <span className="text-[10px] font-mono text-indigo-400 block font-bold">3. STRENGTHENS</span>
                              <p className="text-[11px] font-medium text-slate-200">{stage.skillPipeline.strengthens}</p>
                            </div>
                            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                              <span className="text-[10px] font-mono text-emerald-400 block font-bold">4. OUTCOME</span>
                              <p className="text-[11px] font-medium text-emerald-200">{stage.skillPipeline.outcome}</p>
                            </div>
                          </div>
                        </div>

                        {/* 3. AI Insight Banner */}
                        <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-500/25 flex items-start gap-3 text-xs">
                          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-mono font-bold text-indigo-300 uppercase">AI Strategy Insight</span>
                            <p className="text-slate-300 leading-relaxed text-[11px]">
                              {stage.aiInsight}
                            </p>
                          </div>
                        </div>

                        {/* 4. Evidence You'll Produce */}
                        <div className="space-y-2">
                          <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider block">
                            Evidence You Will Produce
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {stage.evidenceProduced.map((ev, evIdx) => (
                              <div key={evIdx} className="p-2.5 rounded-lg bg-[#0E111B] border border-white/[0.06] flex items-start gap-2 text-xs">
                                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                                <span className="text-[11px] text-slate-300">{ev}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 5. Actionable Tasks (Milestone Checklist) */}
                        <div className="space-y-3 pt-2 border-t border-white/[0.06]">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white uppercase tracking-wide">
                                Action Execution Tasks
                              </span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-slate-400">
                                {stage.completedCount} of {stage.totalCount} Done
                              </span>
                            </div>
                            {stage.tasks.length > 3 && (
                              <button
                                type="button"
                                onClick={() => toggleViewAllTasks(stage.milestoneId)}
                                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
                              >
                                {isAllTasksShown ? 'Show top 3 tasks' : `View all (${stage.tasks.length}) tasks`}
                              </button>
                            )}
                          </div>

                          <div className="space-y-2">
                            {visibleTasks.map((task, tIdx) => {
                              const isTaskDone = task.completed;
                              return (
                                <div
                                  key={task.id || tIdx}
                                  onClick={() => handleToggleTask(sIdx, stage.milestoneId, tIdx, isTaskDone)}
                                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                                    isTaskDone
                                      ? 'bg-white/[0.02] border-white/[0.04] text-slate-400'
                                      : 'bg-[#0E111B] border-white/[0.08] hover:border-indigo-500/40 text-slate-200 shadow-xs'
                                  }`}
                                >
                                  <div className="flex items-start gap-3 flex-1">
                                    <button
                                      type="button"
                                      className={`w-4 h-4 rounded border shrink-0 flex items-center justify-center mt-0.5 transition-colors ${
                                        isTaskDone
                                          ? 'bg-indigo-600 border-indigo-600 text-white'
                                          : 'border-white/[0.20] bg-white/[0.04] group-hover:border-indigo-400'
                                      }`}
                                    >
                                      {isTaskDone && <Check className="w-3 h-3 stroke-[2.5]" />}
                                    </button>
                                    <div className="space-y-1">
                                      <span className={`text-xs font-medium leading-relaxed block ${
                                        isTaskDone ? 'line-through text-slate-500' : 'text-slate-200'
                                      }`}>
                                        {task.title}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 shrink-0">
                                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-slate-400 border border-white/[0.06] flex items-center gap-1">
                                      <Clock className="w-3 h-3 text-slate-500" />
                                      <span>{task.effort || '2 hrs'}</span>
                                    </span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                      isTaskDone
                                        ? 'bg-emerald-500/10 text-emerald-400'
                                        : 'bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20'
                                    }`}>
                                      {isTaskDone ? 'Completed' : 'Mark Complete'}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* 6. Resume Bullet Recommendation */}
                        {stage.resumeBullet && (
                          <div className="p-3.5 rounded-xl bg-[#0E111B] border border-white/[0.06] space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono uppercase font-bold text-indigo-400">
                                Recommended ATS Resume Bullet
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopyBullet(stage.resumeBullet || '', `bullet_${sIdx}`)}
                                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                              >
                                {copiedBulletId === `bullet_${sIdx}` ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    <span className="text-emerald-400">Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>Copy for Resume</span>
                                  </>
                                )}
                              </button>
                            </div>
                            <p className="text-xs text-slate-300 italic leading-relaxed">
                              &ldquo;{stage.resumeBullet}&rdquo;
                            </p>
                          </div>
                        )}

                        {/* 7. Milestone Completed Unlocked Banner */}
                        {hasCompletedAll && (
                          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-2">
                            <div className="flex items-center gap-2 font-bold text-xs">
                              <Award className="w-4 h-4 text-emerald-400" />
                              <span>Stage {stage.stageNumber} Completed &bull; What you unlocked:</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-emerald-200">
                              <div className="flex items-center gap-1.5">
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span>+8% Career Readiness Impact</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Unlocked Stage {sIdx < 3 ? `0${sIdx + 2}` : 'Job Application Ready'}</span>
                              </div>
                            </div>
                          </div>
                        )}

                      </motion.div>
                    )}
                  </AnimatePresence>

                </motion.div>
              );
            })}

          </div>

          {/* ------------------------------------------------------------- */}
          {/* RIGHT COLUMN: STICKY CAREER PROGRESS PANEL (32% width on lg) */}
          {/* ------------------------------------------------------------- */}
          <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-6">
            
            {/* Career Readiness Card */}
            <div className="p-5 rounded-2xl bg-[#131724] border border-white/[0.08] space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-indigo-400 uppercase tracking-wider">
                  Live Career Metric
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  +{stats.completionRate}% Progress
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                    {stats.careerReadiness}%
                  </div>
                  <span className="text-xs text-slate-400 block mt-0.5">
                    Target Role Readiness
                  </span>
                </div>

                <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 flex items-center justify-center relative">
                  <div 
                    className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" 
                    style={{ animationDuration: '12s' }}
                  />
                  <Flame className="w-6 h-6 text-indigo-400" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Task Execution Momentum</span>
                  <span className="font-mono text-white">{stats.completedTasks} / {stats.totalTasks}</span>
                </div>
                <div className="w-full bg-white/[0.06] h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-500 h-full transition-all duration-300 rounded-full" 
                    style={{ width: `${stats.completionRate}%` }} 
                  />
                </div>
              </div>
            </div>

            {/* Target Role & Stage Status Card */}
            <div className="p-5 rounded-2xl bg-[#131724] border border-white/[0.08] space-y-3.5 text-xs shadow-sm">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
                <span className="text-slate-400">Target Career</span>
                <span className="font-bold text-white truncate max-w-[160px]">{targetRoleTitle}</span>
              </div>

              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
                <span className="text-slate-400">Active Phase</span>
                <span className="font-mono font-bold text-indigo-400">
                  {stats.currentActiveStage ? `Stage 0${stats.currentActiveStage.index + 1} (${stats.currentActiveStage.name})` : 'All Done'}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
                <span className="text-slate-400">Milestones Complete</span>
                <span className="font-mono font-bold text-slate-200">
                  {stats.completedStagesCount} / 4 Stages
                </span>
              </div>

              {/* Skills to prioritize */}
              <div className="space-y-2 pt-1">
                <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">
                  Top Skills to Master
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['React & TypeScript', 'REST API Architecture', 'Cloud Deployment', 'Algorithms & STAR Prep'].map((s, idx) => (
                    <span 
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded bg-white/[0.04] text-slate-300 border border-white/[0.08]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Save & Quick Role Switch */}
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={onSaveRoadmap}
                  disabled={isSaving}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Saving to Firebase...' : 'Save Strategy to Account'}</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. CAREER PATH MAP (Visual Node Journey) */}
      {/* ========================================================================= */}
      {activeTab === 'pathmap' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-[#131724] border border-white/[0.08] space-y-8 shadow-sm">
          <div className="space-y-1">
            <span className="text-[11px] font-mono font-bold text-indigo-400 uppercase tracking-wider">
              Chronological Node Path
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Sequential Career Milestones Map
            </h2>
            <p className="text-xs text-slate-400">
              A high-level architectural view of every critical gate from university baseline to job-ready candidate.
            </p>
          </div>

          <div className="relative pl-6 sm:pl-10 space-y-8 before:absolute before:inset-0 before:left-3 sm:before:left-5 before:w-0.5 before:bg-white/[0.08]">
            {[
              { id: 'node_start', title: 'START: University Student Profile', desc: 'Current academic baseline & core coursework', isDone: true, type: 'start' },
              { id: 'node_1', title: 'Stage 01: Foundational Language & Tools', desc: 'Master syntax primitives, algorithms, Git workflow', isDone: normalizedStages[0]?.isCompleted, type: 'stage' },
              { id: 'node_2', title: 'Stage 02: Full-Stack Application Architecture', desc: 'Build responsive client interface and secure backend REST API', isDone: normalizedStages[1]?.isCompleted, type: 'stage' },
              { id: 'node_3', title: 'Stage 03: Cloud Deployment & Portfolio Proof', desc: 'Ship production artifact with 99.8% uptime & earn certification', isDone: normalizedStages[2]?.isCompleted, type: 'stage' },
              { id: 'node_4', title: 'Stage 04: ATS Resume & Mock Interview Mastery', desc: 'STAR behavioral stories, live coding practice, recruiter outreach', isDone: normalizedStages[3]?.isCompleted, type: 'stage' },
              { id: 'node_end', title: 'GOAL: Job-Ready Hire for ' + targetRoleTitle, desc: 'Interview-ready portfolio, verified credentials, confident delivery', isDone: stats.completedStagesCount === 4, type: 'goal' }
            ].map((node, nIdx) => {
              return (
                <div key={node.id} className="relative z-10">
                  {/* Node Icon Indicator */}
                  <div className={`absolute -left-6 sm:-left-10 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center bg-[#0B0D14] ${
                    node.isDone 
                      ? 'border-emerald-400 text-emerald-400' 
                      : nIdx === 1 
                      ? 'border-indigo-500 text-indigo-400 ring-2 ring-indigo-500/20' 
                      : 'border-white/[0.20] text-slate-600'
                  }`}>
                    {node.isDone ? (
                      <Check className="w-3 h-3 stroke-[3]" />
                    ) : (
                      <div className={`w-1.5 h-1.5 rounded-full ${nIdx === 1 ? 'bg-indigo-400' : 'bg-slate-600'}`} />
                    )}
                  </div>

                  <div className={`p-4 rounded-xl border ${
                    node.isDone
                      ? 'bg-[#0E111B] border-emerald-500/30'
                      : nIdx === 1
                      ? 'bg-indigo-600/10 border-indigo-500/40 shadow-xs'
                      : 'bg-[#0E111B]/60 border-white/[0.06]'
                  }`}>
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={`text-sm font-bold ${node.isDone ? 'text-white' : nIdx === 1 ? 'text-indigo-300' : 'text-slate-300'}`}>
                        {node.title}
                      </h4>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        node.isDone 
                          ? 'bg-emerald-500/15 text-emerald-300' 
                          : nIdx === 1 
                          ? 'bg-indigo-500/20 text-indigo-300' 
                          : 'bg-white/[0.04] text-slate-500'
                      }`}>
                        {node.isDone ? 'UNLOCKED' : nIdx === 1 ? 'CURRENT FOCUS' : 'UPCOMING'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {node.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. PORTFOLIO PROJECTS VIEW */}
      {/* ========================================================================= */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="space-y-1">
            <span className="text-[11px] font-mono font-bold text-indigo-400 uppercase tracking-wider">
              Production Artifacts
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Recommended Portfolio Proof Projects
            </h2>
            <p className="text-xs text-slate-400">
              Architectural projects engineered to demonstrate technical depth on GitHub and pass ATS technical screenings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(roadmap.projects || roadmap.portfolioProjects || []).map((proj: any, pIdx: number) => (
              <div 
                key={proj.id || pIdx} 
                className="p-5 rounded-2xl bg-[#131724] border border-white/[0.08] space-y-3.5 flex flex-col justify-between shadow-sm hover:border-white/[0.18] transition-all"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono text-indigo-400 block font-bold">PROJECT 0{pIdx + 1}</span>
                      <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">{proj.title}</h3>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 shrink-0">
                      {proj.difficulty || 'Intermediate'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {proj.description}
                  </p>

                  {/* Key Deliverables */}
                  {proj.keyDeliverables && proj.keyDeliverables.length > 0 && (
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Deliverables:</span>
                      <ul className="space-y-1 text-[11px] text-slate-400">
                        {proj.keyDeliverables.map((del: string, dIdx: number) => (
                          <li key={dIdx} className="flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-indigo-400" />
                            <span>{del}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="space-y-2.5 pt-3 border-t border-white/[0.06]">
                  {(proj.techStack || proj.technologies) && (
                    <div className="flex flex-wrap gap-1">
                      {(proj.techStack || proj.technologies || []).map((tech: string, tidx: number) => (
                        <span key={tidx} className="text-[10px] px-2 py-0.5 rounded bg-white/[0.04] text-slate-300 border border-white/[0.08]">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {proj.resumeBullet && (
                    <div className="p-2.5 rounded-lg bg-[#0E111B] border border-white/[0.06] flex items-start justify-between gap-2">
                      <p className="text-[11px] text-slate-300 italic leading-relaxed">
                        &ldquo;{proj.resumeBullet}&rdquo;
                      </p>
                      <button
                        type="button"
                        onClick={() => handleCopyBullet(proj.resumeBullet || '', `proj-${pIdx}`)}
                        className="text-slate-400 hover:text-white shrink-0 p-1 cursor-pointer"
                        title="Copy bullet"
                      >
                        {copiedBulletId === `proj-${pIdx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. CURATED COURSES VIEW */}
      {/* ========================================================================= */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          <div className="space-y-1">
            <span className="text-[11px] font-mono font-bold text-indigo-400 uppercase tracking-wider">
              Skill Acquisition
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Curated Courses & Industry Certifications
            </h2>
            <p className="text-xs text-slate-400">
              Targeted educational resources and industry credentials that carry weight on LinkedIn and technical applications.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {(roadmap.courses || roadmap.recommendedCourses || []).map((course: any, cIdx: number) => (
              <div key={cIdx} className="p-5 rounded-2xl bg-[#131724] border border-white/[0.08] space-y-3 shadow-sm flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider">
                      {course.provider || course.platform || 'Online Course'}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-slate-400">
                      {course.type || course.duration || '30 Hours'}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{course.title}</h3>
                  {course.skillsCovered && (
                    <p className="text-xs text-slate-400">
                      <strong>Covers:</strong> {Array.isArray(course.skillsCovered) ? course.skillsCovered.join(', ') : course.skillsCovered}
                    </p>
                  )}
                </div>

                {course.url && (
                  <a
                    href={course.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="pt-2 flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
                  >
                    <span>View Course Curriculum</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. PRACTICE QUESTIONS VIEW */}
      {/* ========================================================================= */}
      {activeTab === 'practice' && (
        <div className="space-y-6">
          <div className="space-y-1">
            <span className="text-[11px] font-mono font-bold text-indigo-400 uppercase tracking-wider">
              Technical & Behavioral Drill
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Target Role Interview Questions
            </h2>
            <p className="text-xs text-slate-400">
              High-frequency interview questions with architectural hints and structured answer breakdowns.
            </p>
          </div>

          <div className="space-y-3">
            {(roadmap.practiceQuestions || []).map((q: any, qIdx: number) => (
              <div key={qIdx} className="p-5 rounded-2xl bg-[#131724] border border-white/[0.08] space-y-3 shadow-sm">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-indigo-400 font-bold">QUESTION 0{qIdx + 1}</span>
                  <span className="px-2.5 py-0.5 rounded bg-white/[0.04] text-slate-400 border border-white/[0.06]">
                    {q.category || 'Technical'}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white leading-snug">{q.question}</h3>
                
                {q.hint && (
                  <div className="p-3 rounded-xl bg-[#0E111B] border border-white/[0.06] text-xs text-slate-300 space-y-1">
                    <span className="text-[10px] font-mono uppercase font-bold text-indigo-400 block">Strategic Hint:</span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{q.hint}</p>
                  </div>
                )}

                {q.solutionSummary && (
                  <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-xs text-slate-300 space-y-1">
                    <span className="text-[10px] font-mono uppercase font-bold text-indigo-300 block">Recommended Architecture / Key Answer:</span>
                    <p className="text-[11px] text-slate-300 leading-relaxed">{q.solutionSummary}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
