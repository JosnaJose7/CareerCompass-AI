import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  Code2, 
  Award, 
  TrendingUp, 
  Sparkles, 
  Target, 
  Zap, 
  Layers, 
  BarChart3, 
  Clock, 
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Search,
  Filter,
  GraduationCap
} from 'lucide-react';
import { SkillGapAnalysisResult, StudentProfile } from '../types';

interface SkillGapAnalysisProps {
  analysis: SkillGapAnalysisResult | null;
  onAnalyze: (targetRole: string) => void;
  isAnalyzing: boolean;
  profile: StudentProfile;
}

export const SkillGapAnalysis: React.FC<SkillGapAnalysisProps> = ({
  analysis,
  onAnalyze,
  isAnalyzing,
  profile,
}) => {
  const [selectedRole, setSelectedRole] = useState(
    analysis?.targetRole || profile.dreamRole || 'Full-Stack Software Engineer'
  );
  const [customRoleInput, setCustomRoleInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [completedSkillIds, setCompletedSkillIds] = useState<string[]>([]);
  const [filterPriority, setFilterPriority] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');

  const popularRoles = [
    'Full-Stack Software Engineer',
    'AI / Machine Learning Engineer',
    'Cloud & DevOps Solutions Architect',
    'Data Engineer & Analytics Architect',
    'Associate Product Manager (APM)'
  ];

  const handleRunAnalysis = (roleToRun: string) => {
    if (!roleToRun.trim()) return;
    setSelectedRole(roleToRun);
    onAnalyze(roleToRun);
  };

  const toggleMissingSkillCompleted = (id: string) => {
    setCompletedSkillIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Calculate live dynamic progress score
  const totalMissing = analysis?.missingSkills?.length || 0;
  const newlyCompleted = completedSkillIds.length;
  const baseReadiness = analysis?.readinessScore || 70;
  
  // Calculate adjusted readiness bonus
  const readinessBonus = totalMissing > 0 ? Math.round((newlyCompleted / totalMissing) * (100 - baseReadiness)) : 0;
  const currentReadinessScore = Math.min(100, baseReadiness + readinessBonus);

  const filteredMissingSkills = (analysis?.missingSkills || []).filter(item => {
    if (filterPriority === 'All') return true;
    return item.priority.toLowerCase() === filterPriority.toLowerCase();
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
          <BarChart3 className="w-4 h-4 text-amber-400" />
          <span>Industry Benchmark Comparison</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
          AI Skill Gap Analysis
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto">
          Compare your current technical stack against real-time industry benchmark requirements for your target role.
        </p>
      </div>

      {/* Target Role Selector Bar */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
            <Target className="w-5 h-5 text-blue-400" />
            <span>Select Target Industry Role:</span>
          </div>

          <button
            onClick={() => setShowCustomInput(!showCustomInput)}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            {showCustomInput ? 'Choose from Popular Roles' : '+ Enter Custom Role'}
          </button>
        </div>

        {showCustomInput ? (
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="e.g. Cybersecurity Specialist, Backend Engineer, Quantitative Developer..."
                value={customRoleInput}
                onChange={(e) => setCustomRoleInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button
              onClick={() => handleRunAnalysis(customRoleInput)}
              disabled={isAnalyzing || !customRoleInput.trim()}
              className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Analyze Gap</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {popularRoles.map((role) => (
              <button
                key={role}
                onClick={() => handleRunAnalysis(role)}
                disabled={isAnalyzing}
                className={`px-3.5 py-2 rounded-2xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  selectedRole === role
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30 border border-blue-400'
                    : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                <span>{role}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Loading State */}
      {isAnalyzing && (
        <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-xl space-y-4">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-100">Comparing Skills vs Industry Standards...</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Evaluating candidate portfolio against modern job market standards for <strong>{selectedRole}</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Analysis Content */}
      {!isAnalyzing && analysis && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Readiness Dashboard Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/80 border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 blur-[100px] pointer-events-none" />

            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              
              {/* Readiness Meter Gauge */}
              <div className="flex items-center gap-6 w-full lg:w-auto">
                <div className="relative flex flex-col items-center justify-center w-28 h-28 rounded-3xl bg-slate-950/90 border-2 border-indigo-500/30 text-slate-100 shadow-2xl shrink-0">
                  <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
                    {currentReadinessScore}%
                  </span>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-0.5">
                    Readiness
                  </span>
                </div>

                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                      Target Role: {analysis.targetRole}
                    </span>
                    {newlyCompleted > 0 && (
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold animate-pulse">
                        +{readinessBonus}% Skill Progress
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                    {analysis.overallSummary}
                  </p>

                  {/* Readiness Progress Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                      <span>Skill Match Progress</span>
                      <span className="text-indigo-300">{currentReadinessScore} / 100% Ready</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 transition-all duration-500"
                        style={{ width: `${currentReadinessScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats Column */}
              <div className="grid grid-cols-2 gap-3 w-full lg:w-64 shrink-0">
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    Completed Skills
                  </span>
                  <span className="text-xl font-bold text-emerald-400 mt-1 block">
                    {analysis.completedSkills.length} Verified
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    Missing Skill Gaps
                  </span>
                  <span className="text-xl font-bold text-amber-400 mt-1 block">
                    {totalMissing - newlyCompleted} Remaining
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Side-by-Side Comparison: Current Skills vs Industry Benchmarks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* 1. Completed Candidate Skills */}
            <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-bold text-slate-100">
                    Completed & Verified Skills ({analysis.completedSkills.length})
                  </h3>
                </div>
                <span className="text-xs text-slate-400">Candidate Profile Matches</span>
              </div>

              <div className="space-y-3">
                {analysis.completedSkills.map((sk, idx) => (
                  <div 
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-950/60 border border-emerald-500/20 flex items-start gap-3"
                  >
                    <div className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-200">{sk.skill}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold">
                          {sk.proficiency}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {sk.matchReason}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Industry Skill Benchmarks */}
            <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  <h3 className="text-base font-bold text-slate-100">
                    Industry Skill Benchmarks ({analysis.industryBenchmarks?.length || 3})
                  </h3>
                </div>
                <span className="text-xs text-slate-400">{analysis.targetRole} Standards</span>
              </div>

              <div className="space-y-3">
                {(analysis.industryBenchmarks || []).map((bm, idx) => (
                  <div 
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-950/60 border border-blue-500/20 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-300">{bm.skill}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-bold uppercase">
                        {bm.importance}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {bm.demandTrend}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Missing Skills Deep Dive Section */}
          <div className="space-y-6">
            
            {/* Header & Filter Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                  <span>Missing Skills & Learning Plan ({filteredMissingSkills.length})</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Check off missing skills as you learn them to track your career readiness progress live.
                </p>
              </div>

              {/* Priority Filter */}
              <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800 shrink-0">
                <Filter className="w-3.5 h-3.5 text-slate-500 ml-2" />
                {(['All', 'High', 'Medium', 'Low'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setFilterPriority(p)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                      filterPriority === p
                        ? 'bg-slate-800 text-slate-100'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Missing Skills Cards Grid */}
            <div className="space-y-6">
              {filteredMissingSkills.map((gapItem) => {
                const isMarkedDone = completedSkillIds.includes(gapItem.id);

                return (
                  <div
                    key={gapItem.id}
                    className={`p-6 sm:p-7 rounded-3xl border transition-all duration-300 backdrop-blur-xl shadow-xl ${
                      isMarkedDone
                        ? 'bg-emerald-950/20 border-emerald-500/40 opacity-80'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700/80'
                    }`}
                  >
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                      
                      <div className="flex items-start gap-3">
                        {/* Interactive Completion Checkbox */}
                        <button
                          onClick={() => toggleMissingSkillCompleted(gapItem.id)}
                          className={`p-1.5 rounded-xl border mt-0.5 transition-all ${
                            isMarkedDone
                              ? 'bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-900/40'
                              : 'bg-slate-950 text-slate-500 border-slate-800 hover:border-slate-600'
                          }`}
                          title={isMarkedDone ? 'Mark as Pending' : 'Mark as Learned'}
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className={`text-lg font-bold tracking-tight ${isMarkedDone ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                              {gapItem.skill}
                            </h4>
                            
                            {/* Priority Badge */}
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              gapItem.priority === 'High'
                                ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                                : gapItem.priority === 'Medium'
                                ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                                : 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
                            }`}>
                              {gapItem.priority} Priority
                            </span>

                            {/* Difficulty Badge */}
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-400 text-[10px] font-semibold">
                              Difficulty: {gapItem.difficulty}
                            </span>
                          </div>
                          
                          <p className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                            <span>Category: <strong className="text-slate-300">{gapItem.category}</strong></span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-indigo-400" />
                              Estimated: {gapItem.estimatedHours} hours
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Action state */}
                      <span className="text-xs font-semibold text-slate-400">
                        {isMarkedDone ? '✓ Skill Completed' : 'In Progress'}
                      </span>
                    </div>

                    {/* Resources Grid: Courses, Projects, Certifications */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pt-5">
                      
                      {/* 1. Recommended Courses */}
                      <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                        <h5 className="text-xs font-extrabold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4 text-indigo-400" />
                          <span>Recommended Courses</span>
                        </h5>
                        <div className="space-y-2">
                          {gapItem.recommendedCourses.map((c, idx) => (
                            <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 text-xs">
                              <a
                                href={c.url || '#'}
                                target="_blank"
                                rel="noreferrer"
                                className="font-bold text-slate-200 hover:text-indigo-300 transition-colors flex items-center justify-between gap-1"
                              >
                                <span className="line-clamp-1">{c.title}</span>
                                <ExternalLink className="w-3 h-3 shrink-0 text-slate-500" />
                              </a>
                              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                                <span>{c.provider}</span>
                                <span className="text-indigo-400 font-semibold">{c.level}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 2. Recommended Portfolio Projects */}
                      <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                        <h5 className="text-xs font-extrabold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Code2 className="w-4 h-4 text-emerald-400" />
                          <span>Portfolio Projects</span>
                        </h5>
                        <div className="space-y-2">
                          {gapItem.projects.map((proj, idx) => (
                            <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 text-xs space-y-1">
                              <span className="font-bold text-emerald-300 block">{proj.title}</span>
                              <p className="text-[11px] text-slate-400 line-clamp-2">{proj.description}</p>
                              {proj.keyDeliverables && proj.keyDeliverables.length > 0 && (
                                <ul className="text-[10px] text-slate-400 space-y-0.5 pt-1 border-t border-slate-800/50">
                                  {proj.keyDeliverables.slice(0, 2).map((d, dIdx) => (
                                    <li key={dIdx} className="flex items-center gap-1">
                                      <span className="text-emerald-400 font-bold">•</span>
                                      <span className="line-clamp-1">{d}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 3. Recommended Certifications */}
                      <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                        <h5 className="text-xs font-extrabold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-purple-400" />
                          <span>Industry Certifications</span>
                        </h5>
                        <div className="space-y-2">
                          {gapItem.certifications.map((cert, idx) => (
                            <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 text-xs">
                              <span className="font-bold text-slate-200 block">{cert.title}</span>
                              <span className="text-[10px] text-purple-400 font-medium block mt-0.5">
                                Issued by {cert.issuer}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
