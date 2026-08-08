import React, { useState } from 'react';
import { 
  Map, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Clock, 
  BookOpen, 
  Copy, 
  Check, 
  ExternalLink, 
  Award, 
  Target, 
  Bookmark,
  Calendar,
  Code2,
  GraduationCap,
  HelpCircle,
  ListTodo,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  CheckSquare,
  BarChart2,
  Filter,
  Search,
  Zap,
  Briefcase
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CareerRoadmap, RoadmapMilestone, MonthlyGoal, RoadmapProject, RoadmapCourse, RoadmapPracticeQuestion } from '../types';

interface RoadmapViewProps {
  roadmap: CareerRoadmap | null;
  setRoadmap?: React.Dispatch<React.SetStateAction<CareerRoadmap | null>>;
  onUpdateMilestoneTask: (milestoneId: string, taskIndex: number, completed: boolean) => void;
  onSaveRoadmap: () => void;
  isSaving: boolean;
  onGenerateRoadmapForRole: (roleTitle: string) => void;
  isGenerating: boolean;
}

type SubTab = 'overview' | 'weekly' | 'projects' | 'courses' | 'questions' | 'checklist';

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  roadmap,
  setRoadmap,
  onUpdateMilestoneTask,
  onSaveRoadmap,
  isSaving,
  onGenerateRoadmapForRole,
  isGenerating,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('overview');
  const [copiedBulletId, setCopiedBulletId] = useState<string | null>(null);
  
  // Accordion states
  const [expandedMonths, setExpandedMonths] = useState<Record<string, boolean>>({ month_1: true });
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({});
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});
  
  // Master checklist search & filter
  const [checklistSearch, setChecklistSearch] = useState('');
  const [checklistFilter, setChecklistFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const triggerConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 65,
      origin: { y: 0.7 }
    });
  };

  const handleCopyBullet = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBulletId(id);
    setTimeout(() => setCopiedBulletId(null), 2000);
  };

  if (isGenerating) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center rounded-3xl bg-slate-900/60 border border-indigo-500/30 backdrop-blur-xl space-y-6 animate-pulse">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-2xl">
          <Map className="w-8 h-8 animate-bounce" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-black text-white">Architecting Personalized Career Roadmap...</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Gemini is structuring weekly goals, monthly milestones, portfolio projects, curated courses, practice questions, and interactive checklist items.
          </p>
        </div>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="max-w-3xl mx-auto p-10 text-center rounded-3xl bg-slate-900/60 border border-indigo-500/20 backdrop-blur-xl space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
          <Map className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">No Active Career Roadmap</h3>
          <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto">
            Select a career role from AI Discovery or enter your target position below to generate a step-by-step career readiness roadmap.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
          <button
            onClick={() => onGenerateRoadmapForRole('Full-Stack Software Engineer')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg"
          >
            Software Engineer Roadmap
          </button>
          <button
            onClick={() => onGenerateRoadmapForRole('Data Analyst & Insights')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white transition-all shadow-lg"
          >
            Data Analyst Roadmap
          </button>
        </div>
      </div>
    );
  }

  // Define roadmap collections with fallbacks
  const milestones = roadmap.milestones || [];
  const monthlyGoals = roadmap.monthlyGoals || [];
  const projects = roadmap.projects || [];
  const courses = roadmap.courses || [];
  const practiceQuestions = roadmap.practiceQuestions || [];

  // Toggle Handlers
  const toggleMilestone = (mIdx: number) => {
    if (!setRoadmap) return;
    setRoadmap(prev => {
      if (!prev) return null;
      const updated = [...prev.milestones];
      const nextState = !updated[mIdx].completed;
      updated[mIdx] = { ...updated[mIdx], completed: nextState };
      if (nextState) triggerConfetti();
      return { ...prev, milestones: updated };
    });
  };

  const toggleMilestoneTask = (milestoneId: string, taskIdx: number) => {
    onUpdateMilestoneTask(milestoneId, taskIdx, false); // triggers parent callback
  };

  const toggleWeeklyTask = (monthIdx: number, weekIdx: number, taskIdx: number) => {
    if (!setRoadmap) return;
    setRoadmap(prev => {
      if (!prev || !prev.monthlyGoals) return prev;
      const updatedMonths = JSON.parse(JSON.stringify(prev.monthlyGoals)) as MonthlyGoal[];
      const task = updatedMonths[monthIdx].weeklyGoals[weekIdx].tasks[taskIdx];
      task.completed = !task.completed;
      if (task.completed) triggerConfetti();

      // Check if all tasks in week are completed
      const allWeekDone = updatedMonths[monthIdx].weeklyGoals[weekIdx].tasks.every(t => t.completed);
      // Check if all weeks in month are completed
      const allMonthDone = updatedMonths[monthIdx].weeklyGoals.every(w => w.tasks.every(t => t.completed));
      updatedMonths[monthIdx].completed = allMonthDone;

      return { ...prev, monthlyGoals: updatedMonths };
    });
  };

  const toggleProject = (pIdx: number) => {
    if (!setRoadmap) return;
    setRoadmap(prev => {
      if (!prev || !prev.projects) return prev;
      const updated = [...prev.projects];
      updated[pIdx].completed = !updated[pIdx].completed;
      if (updated[pIdx].completed) triggerConfetti();
      return { ...prev, projects: updated };
    });
  };

  const toggleCourse = (cIdx: number) => {
    if (!setRoadmap) return;
    setRoadmap(prev => {
      if (!prev || !prev.courses) return prev;
      const updated = [...prev.courses];
      updated[cIdx].completed = !updated[cIdx].completed;
      if (updated[cIdx].completed) triggerConfetti();
      return { ...prev, courses: updated };
    });
  };

  const togglePracticeQuestion = (qIdx: number) => {
    if (!setRoadmap) return;
    setRoadmap(prev => {
      if (!prev || !prev.practiceQuestions) return prev;
      const updated = [...prev.practiceQuestions];
      updated[qIdx].completed = !updated[qIdx].completed;
      if (updated[qIdx].completed) triggerConfetti();
      return { ...prev, practiceQuestions: updated };
    });
  };

  // Progress Calculations
  let totalItems = 0;
  let completedItems = 0;

  // 1. Milestones
  milestones.forEach(m => {
    totalItems += 1;
    if (m.completed) completedItems += 1;
  });

  // 2. Weekly Tasks
  monthlyGoals.forEach(m => {
    (m.weeklyGoals || []).forEach(w => {
      (w.tasks || []).forEach(t => {
        totalItems += 1;
        if (t.completed) completedItems += 1;
      });
    });
  });

  // 3. Projects
  projects.forEach(p => {
    totalItems += 1;
    if (p.completed) completedItems += 1;
  });

  // 4. Courses
  courses.forEach(c => {
    totalItems += 1;
    if (c.completed) completedItems += 1;
  });

  // 5. Practice Questions
  practiceQuestions.forEach(q => {
    totalItems += 1;
    if (q.completed) completedItems += 1;
  });

  const overallPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      
      {/* Dynamic Header & Progress Dashboard */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 backdrop-blur-xl shadow-2xl space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Target Role: {roadmap.roleTitle}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Personalized Career Roadmap
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {roadmap.overview}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-start lg:self-center">
            <div className="px-4 py-2.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Estimated Ready</span>
              <span className="text-xs font-black text-indigo-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                {roadmap.estimatedTimeToJobReady}
              </span>
            </div>

            <button
              onClick={onSaveRoadmap}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-2xl text-xs font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg hover:brightness-110 transition-all flex items-center gap-2"
            >
              <Bookmark className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save to Firebase'}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="pt-4 border-t border-indigo-500/20 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-indigo-300 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-indigo-400" />
              Overall Job Readiness Progress
            </span>
            <span className="text-white font-mono text-sm bg-indigo-500/20 px-3 py-0.5 rounded-full border border-indigo-500/30">
              {completedItems} / {totalItems} Tasks ({overallPercent}%)
            </span>
          </div>
          
          <div className="w-full h-3 rounded-full bg-slate-950/80 p-0.5 border border-indigo-500/30 overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 transition-all duration-500 shadow-md shadow-indigo-500/30"
              style={{ width: `${overallPercent}%` }}
            />
          </div>

          {/* Sub-Stat Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 text-[11px] font-semibold text-slate-300">
            <div className="p-2 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-center gap-2">
              <Target className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="truncate">
                {milestones.filter(m => m.completed).length}/{milestones.length} Milestones
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">
                {monthlyGoals.filter(m => m.completed).length}/{monthlyGoals.length} Monthly Goals
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-center gap-2">
              <Code2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="truncate">
                {projects.filter(p => p.completed).length}/{projects.length} Projects
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-center gap-2">
              <GraduationCap className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span className="truncate">
                {courses.filter(c => c.completed).length}/{courses.length} Courses
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-center gap-2 col-span-2 sm:col-span-1">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">
                {practiceQuestions.filter(q => q.completed).length}/{practiceQuestions.length} Questions
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Sub-Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800/80">
        {[
          { id: 'overview', label: 'Milestones Timeline', icon: Target, count: milestones.length },
          { id: 'weekly', label: 'Weekly & Monthly Goals', icon: Calendar, count: monthlyGoals.length },
          { id: 'projects', label: 'Portfolio Projects', icon: Code2, count: projects.length },
          { id: 'courses', label: 'Courses & Certs', icon: GraduationCap, count: courses.length },
          { id: 'questions', label: 'Practice Questions', icon: HelpCircle, count: practiceQuestions.length },
          { id: 'checklist', label: 'Master Checklist', icon: CheckSquare, count: totalItems },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as SubTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 border border-slate-800'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-indigo-400'}`} />
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                isActive ? 'bg-indigo-700 text-white' : 'bg-slate-950 text-slate-400'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Chronological Milestones Timeline */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6 relative before:absolute before:inset-0 before:left-6 sm:before:left-8 before:w-0.5 before:bg-indigo-500/20">
          {milestones.map((milestone, idx) => (
            <div key={milestone.id || idx} className="relative pl-12 sm:pl-16 group">
              {/* Timeline Marker Node */}
              <button
                onClick={() => toggleMilestone(idx)}
                className={`absolute left-3 sm:left-5 top-6 -translate-x-1/2 w-8 h-8 rounded-full border-2 flex items-center justify-center font-extrabold text-xs shadow-lg transition-transform group-hover:scale-110 ${
                  milestone.completed 
                    ? 'bg-emerald-500 border-emerald-400 text-white shadow-emerald-500/30' 
                    : 'bg-slate-900 border-indigo-500 text-indigo-400 shadow-indigo-500/20'
                }`}
              >
                {milestone.completed ? <Check className="w-4 h-4" /> : idx + 1}
              </button>

              <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/70 border border-indigo-500/20 hover:border-indigo-500/40 backdrop-blur-xl space-y-5 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                      {milestone.period}
                    </span>
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      {milestone.title}
                      {milestone.completed && (
                        <span className="text-[10px] bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full">
                          Phase Completed
                        </span>
                      )}
                    </h3>
                  </div>
                  
                  <button
                    onClick={() => toggleMilestone(idx)}
                    className={`self-start sm:self-center px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      milestone.completed
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                        : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 hover:bg-indigo-500/20'
                    }`}
                  >
                    {milestone.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                    <span>{milestone.completed ? 'Completed' : 'Mark Phase Done'}</span>
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {milestone.description}
                </p>

                {/* Tasks */}
                <div>
                  <h4 className="text-xs font-bold text-slate-200 mb-3 uppercase tracking-wider">
                    Phase Execution Checklist:
                  </h4>
                  <div className="space-y-2">
                    {(milestone.tasks || []).map((task, tIdx) => (
                      <div
                        key={tIdx}
                        onClick={() => toggleMilestone(idx)}
                        className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-indigo-500/30 cursor-pointer transition-all"
                      >
                        <div className="pt-0.5">
                          {milestone.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-600 hover:text-indigo-400 shrink-0" />
                          )}
                        </div>
                        <span className={`text-xs leading-relaxed ${milestone.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                          {task}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Resources */}
                {milestone.recommendedResources && milestone.recommendedResources.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-indigo-300 mb-2 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      Recommended Learning Resources:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {milestone.recommendedResources.map((res, rIdx) => (
                        <a
                          key={rIdx}
                          href={res.url || '#'}
                          target={res.url ? '_blank' : '_self'}
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-400/20 text-indigo-200 text-xs font-medium transition-all"
                        >
                          <span className="font-bold">[{res.type}]</span>
                          <span>{res.title}</span>
                          {res.url && <ExternalLink className="w-3 h-3 text-indigo-400" />}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Resume Bullet Suggestion */}
                {milestone.resumeBulletSuggestion && (
                  <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" />
                        Suggested Resume Bullet Point:
                      </span>
                      <button
                        onClick={() => handleCopyBullet(milestone.resumeBulletSuggestion, milestone.id || `m_${idx}`)}
                        className="flex items-center gap-1 text-[11px] font-bold text-indigo-300 hover:text-white"
                      >
                        {copiedBulletId === (milestone.id || `m_${idx}`) ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Bullet</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-slate-200 font-mono italic leading-relaxed bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                      • {milestone.resumeBulletSuggestion}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: Weekly & Monthly Goals */}
      {activeSubTab === 'weekly' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>Structured Weekly Breakdown across Months 1 through 4</span>
            </div>
            <span className="text-[11px] text-slate-400">
              {monthlyGoals.length} Monthly Chapters
            </span>
          </div>

          {monthlyGoals.map((month, mIdx) => {
            const isExpanded = expandedMonths[month.id || `month_${mIdx}`] ?? true;
            const toggleExpand = () => {
              setExpandedMonths(prev => ({
                ...prev,
                [month.id || `month_${mIdx}`]: !isExpanded
              }));
            };

            const monthTasksTotal = (month.weeklyGoals || []).reduce((acc, w) => acc + (w.tasks || []).length, 0);
            const monthTasksDone = (month.weeklyGoals || []).reduce(
              (acc, w) => acc + (w.tasks || []).filter(t => t.completed).length, 0
            );

            return (
              <div 
                key={month.id || mIdx}
                className="rounded-3xl bg-slate-900/70 border border-indigo-500/20 overflow-hidden shadow-xl"
              >
                {/* Month Header */}
                <div 
                  onClick={toggleExpand}
                  className="p-5 sm:p-6 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between cursor-pointer hover:bg-slate-950/80 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm border ${
                      month.completed 
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' 
                        : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                    }`}>
                      M{month.monthNumber || mIdx + 1}
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white flex items-center gap-2">
                        {month.title}
                        {month.completed && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                            Month Completed
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {month.summary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-xs font-mono font-bold text-slate-300 bg-slate-900 px-3 py-1 rounded-xl border border-slate-800">
                      {monthTasksDone}/{monthTasksTotal} Tasks
                    </span>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </div>
                </div>

                {/* Weekly Goals Cards inside Month */}
                {isExpanded && (
                  <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/40">
                    {(month.weeklyGoals || []).map((week, wIdx) => {
                      const weekTasksDone = (week.tasks || []).filter(t => t.completed).length;
                      const weekTasksTotal = (week.tasks || []).length;
                      const isWeekDone = weekTasksTotal > 0 && weekTasksDone === weekTasksTotal;

                      return (
                        <div 
                          key={week.id || wIdx}
                          className={`p-5 rounded-2xl border transition-all space-y-4 ${
                            isWeekDone
                              ? 'bg-emerald-950/20 border-emerald-500/30'
                              : 'bg-slate-950/70 border-slate-800 hover:border-indigo-500/30'
                          }`}
                        >
                          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                            <div>
                              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                                Week {week.weekNumber || wIdx + 1}
                              </span>
                              <h4 className="text-sm font-black text-white">
                                {week.title}
                              </h4>
                            </div>
                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                              isWeekDone
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
                            }`}>
                              {weekTasksDone}/{weekTasksTotal}
                            </span>
                          </div>

                          <div className="text-[11px] text-indigo-300 flex items-center gap-1.5 font-medium bg-indigo-950/30 p-2 rounded-xl border border-indigo-500/20">
                            <Zap className="w-3 h-3 text-indigo-400 shrink-0" />
                            <span>Focus: {week.focus}</span>
                          </div>

                          {/* Task Checkboxes */}
                          <div className="space-y-2">
                            {(week.tasks || []).map((task, tIdx) => (
                              <div
                                key={task.id || tIdx}
                                onClick={() => toggleWeeklyTask(mIdx, wIdx, tIdx)}
                                className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 cursor-pointer transition-all"
                              >
                                <div className="pt-0.5">
                                  {task.completed ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                  ) : (
                                    <Circle className="w-4 h-4 text-slate-600 hover:text-indigo-400 shrink-0" />
                                  )}
                                </div>
                                <span className={`text-xs leading-snug ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                                  {task.title}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: Portfolio Projects */}
      {activeSubTab === 'projects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, pIdx) => (
            <div 
              key={project.id || pIdx}
              className={`p-6 sm:p-7 rounded-3xl border backdrop-blur-xl flex flex-col justify-between space-y-6 transition-all ${
                project.completed
                  ? 'bg-emerald-950/20 border-emerald-500/30'
                  : 'bg-slate-900/70 border-indigo-500/20 hover:border-indigo-500/40'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                      project.difficulty === 'Beginner' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                      project.difficulty === 'Intermediate' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                      'bg-purple-500/20 text-purple-300 border-purple-500/30'
                    }`}>
                      {project.difficulty}
                    </span>
                    <h3 className="text-lg font-black text-white pt-1">
                      {project.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => toggleProject(pIdx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      project.completed
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-300 hover:bg-indigo-600 hover:text-white'
                    }`}
                  >
                    {project.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                    <span>{project.completed ? 'Built' : 'Mark Built'}</span>
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {project.description}
                </p>

                {/* Tech Stack Pills */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Recommended Tech Stack:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(project.techStack || []).map((tech, tIdx) => (
                      <span 
                        key={tIdx}
                        className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Deliverables */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Key Deliverables:
                  </span>
                  <ul className="space-y-1.5">
                    {(project.keyDeliverables || []).map((deliv, dIdx) => (
                      <li key={dIdx} className="text-xs text-slate-300 flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                        <span>{deliv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Resume Bullet */}
              {project.resumeBullet && (
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5 pt-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-indigo-300 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" /> Resume Bullet
                    </span>
                    <button
                      onClick={() => handleCopyBullet(project.resumeBullet, `p_${pIdx}`)}
                      className="text-indigo-400 hover:text-white font-bold flex items-center gap-1"
                    >
                      {copiedBulletId === `p_${pIdx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedBulletId === `p_${pIdx}` ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="text-[11px] font-mono italic text-slate-300">
                    • {project.resumeBullet}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: Courses & Certifications */}
      {activeSubTab === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {courses.map((course, cIdx) => (
            <div 
              key={course.id || cIdx}
              className={`p-6 rounded-3xl border backdrop-blur-xl flex flex-col justify-between space-y-5 transition-all ${
                course.completed
                  ? 'bg-emerald-950/20 border-emerald-500/30'
                  : 'bg-slate-900/70 border-indigo-500/20 hover:border-indigo-500/40'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                    {course.type}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {course.duration}
                  </span>
                </div>

                <h3 className="text-base font-black text-white leading-snug">
                  {course.title}
                </h3>

                <p className="text-xs text-indigo-300 font-medium">
                  Provided by {course.provider}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => toggleCourse(cIdx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    course.completed
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-300 hover:bg-indigo-600 hover:text-white'
                  }`}
                >
                  {course.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                  <span>{course.completed ? 'Completed' : 'Mark Done'}</span>
                </button>

                {course.url && (
                  <a
                    href={course.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-300 transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 5: Practice Questions */}
      {activeSubTab === 'questions' && (
        <div className="space-y-4">
          {practiceQuestions.map((q, qIdx) => {
            const hintRevealed = revealedHints[q.id || `q_${qIdx}`] || false;
            const solutionRevealed = revealedSolutions[q.id || `q_${qIdx}`] || false;

            const toggleHint = () => {
              setRevealedHints(prev => ({ ...prev, [q.id || `q_${qIdx}`]: !hintRevealed }));
            };

            const toggleSolution = () => {
              setRevealedSolutions(prev => ({ ...prev, [q.id || `q_${qIdx}`]: !solutionRevealed }));
            };

            return (
              <div 
                key={q.id || qIdx}
                className={`p-6 rounded-3xl border backdrop-blur-xl space-y-4 transition-all ${
                  q.completed
                    ? 'bg-emerald-950/20 border-emerald-500/30'
                    : 'bg-slate-900/70 border-indigo-500/20 hover:border-indigo-500/40'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                      {q.category}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Question #{qIdx + 1}
                    </span>
                  </div>

                  <button
                    onClick={() => togglePracticeQuestion(qIdx)}
                    className={`self-start sm:self-center px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      q.completed
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-300 hover:bg-amber-500 hover:text-slate-950'
                    }`}
                  >
                    {q.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                    <span>{q.completed ? 'Mastered' : 'Mark Mastered'}</span>
                  </button>
                </div>

                <h3 className="text-base font-black text-white leading-relaxed">
                  {q.question}
                </h3>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={toggleHint}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 transition-all flex items-center gap-1.5"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                    <span>{hintRevealed ? 'Hide Hint' : 'Show Hint'}</span>
                  </button>

                  <button
                    onClick={toggleSolution}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 transition-all flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>{solutionRevealed ? 'Hide Solution' : 'Reveal Solution Key Points'}</span>
                  </button>
                </div>

                {hintRevealed && (
                  <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 leading-relaxed">
                    <span className="font-bold text-amber-300 block mb-1">💡 Hint:</span>
                    {q.hint}
                  </div>
                )}

                {solutionRevealed && (
                  <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-200 leading-relaxed space-y-1">
                    <span className="font-bold text-purple-300 block">✨ Answer Summary Key Points:</span>
                    <p className="font-mono">{q.solutionSummary}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 6: Master Interactive Checklist */}
      {activeSubTab === 'checklist' && (
        <div className="space-y-6">
          {/* Filter & Search Header */}
          <div className="p-4 rounded-3xl bg-slate-900/80 border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={checklistSearch}
                onChange={e => setChecklistSearch(e.target.value)}
                placeholder="Search checklist tasks..."
                className="w-full pl-9 pr-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {(['all', 'pending', 'completed'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setChecklistFilter(f)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                    checklistFilter === f
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Grouped Checklist */}
          <div className="space-y-6">
            
            {/* 1. Milestone Phases */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-400" />
                <span>Chronological Milestones ({milestones.length})</span>
              </h3>
              <div className="space-y-2">
                {milestones.map((m, idx) => {
                  if (checklistFilter === 'completed' && !m.completed) return null;
                  if (checklistFilter === 'pending' && m.completed) return null;
                  if (checklistSearch && !m.title.toLowerCase().includes(checklistSearch.toLowerCase())) return null;

                  return (
                    <div
                      key={m.id || idx}
                      onClick={() => toggleMilestone(idx)}
                      className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-indigo-500/30 cursor-pointer flex items-center justify-between gap-3 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        {m.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-600 shrink-0" />
                        )}
                        <span className={`text-xs font-bold ${m.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                          {m.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-indigo-400 font-mono shrink-0">
                        {m.period}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Weekly Goal Tasks */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>Weekly Execution Tasks</span>
              </h3>
              <div className="space-y-2">
                {monthlyGoals.flatMap((m, mIdx) => 
                  (m.weeklyGoals || []).flatMap((w, wIdx) => 
                    (w.tasks || []).map((t, tIdx) => {
                      if (checklistFilter === 'completed' && !t.completed) return null;
                      if (checklistFilter === 'pending' && t.completed) return null;
                      if (checklistSearch && !t.title.toLowerCase().includes(checklistSearch.toLowerCase())) return null;

                      return (
                        <div
                          key={`${mIdx}_${wIdx}_${tIdx}`}
                          onClick={() => toggleWeeklyTask(mIdx, wIdx, tIdx)}
                          className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-indigo-500/30 cursor-pointer flex items-center justify-between gap-3 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            {t.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-600 shrink-0" />
                            )}
                            <span className={`text-xs ${t.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                              {t.title}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono shrink-0">
                            Month {m.monthNumber} • Week {w.weekNumber}
                          </span>
                        </div>
                      );
                    })
                  )
                )}
              </div>
            </div>

            {/* 3. Projects */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-blue-400" />
                <span>Portfolio Projects ({projects.length})</span>
              </h3>
              <div className="space-y-2">
                {projects.map((p, idx) => {
                  if (checklistFilter === 'completed' && !p.completed) return null;
                  if (checklistFilter === 'pending' && p.completed) return null;
                  if (checklistSearch && !p.title.toLowerCase().includes(checklistSearch.toLowerCase())) return null;

                  return (
                    <div
                      key={p.id || idx}
                      onClick={() => toggleProject(idx)}
                      className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-indigo-500/30 cursor-pointer flex items-center justify-between gap-3 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        {p.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-600 shrink-0" />
                        )}
                        <span className={`text-xs font-bold ${p.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                          {p.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-blue-400 font-mono shrink-0">
                        {p.difficulty}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. Courses */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-purple-400" />
                <span>Courses & Certifications ({courses.length})</span>
              </h3>
              <div className="space-y-2">
                {courses.map((c, idx) => {
                  if (checklistFilter === 'completed' && !c.completed) return null;
                  if (checklistFilter === 'pending' && c.completed) return null;
                  if (checklistSearch && !c.title.toLowerCase().includes(checklistSearch.toLowerCase())) return null;

                  return (
                    <div
                      key={c.id || idx}
                      onClick={() => toggleCourse(idx)}
                      className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-indigo-500/30 cursor-pointer flex items-center justify-between gap-3 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        {c.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-600 shrink-0" />
                        )}
                        <span className={`text-xs font-bold ${c.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                          {c.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-purple-400 font-mono shrink-0">
                        {c.provider}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 5. Practice Questions */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>Practice & Interview Questions ({practiceQuestions.length})</span>
              </h3>
              <div className="space-y-2">
                {practiceQuestions.map((q, idx) => {
                  if (checklistFilter === 'completed' && !q.completed) return null;
                  if (checklistFilter === 'pending' && q.completed) return null;
                  if (checklistSearch && !q.question.toLowerCase().includes(checklistSearch.toLowerCase())) return null;

                  return (
                    <div
                      key={q.id || idx}
                      onClick={() => togglePracticeQuestion(idx)}
                      className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-indigo-500/30 cursor-pointer flex items-center justify-between gap-3 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        {q.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-600 shrink-0" />
                        )}
                        <span className={`text-xs ${q.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                          {q.question}
                        </span>
                      </div>
                      <span className="text-[10px] text-amber-400 font-mono shrink-0">
                        {q.category}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
