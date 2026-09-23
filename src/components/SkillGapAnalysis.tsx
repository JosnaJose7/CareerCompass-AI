import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Check,
  BarChart3
} from 'lucide-react';
import { SkillGapAnalysisResult, StudentProfile } from '../types';
import { BackButton } from './BackButton';

interface SkillGapAnalysisProps {
  analysis: SkillGapAnalysisResult | null;
  onAnalyze: (targetRole: string) => void;
  isAnalyzing: boolean;
  profile: StudentProfile;
  onBack?: () => void;
}

export const SkillGapAnalysis: React.FC<SkillGapAnalysisProps> = ({
  analysis,
  onAnalyze,
  isAnalyzing,
  profile,
  onBack,
}) => {
  const [selectedRole, setSelectedRole] = useState(
    analysis?.targetRole || profile.dreamRole || 'Full-Stack Software Engineer'
  );
  const [completedSkillIds, setCompletedSkillIds] = useState<string[]>([]);
  const [filterPriority, setFilterPriority] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');

  const popularRoles = [
    'Full-Stack Software Engineer',
    'AI / Machine Learning Engineer',
    'Cloud & DevOps Solutions Architect',
    'Data Scientist'
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

  const filteredMissingSkills = (analysis?.missingSkills || []).filter(item => {
    if (filterPriority === 'All') return true;
    return item.priority.toLowerCase() === filterPriority.toLowerCase();
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      
      {/* 1. Header */}
      <div className="border-b border-white/[0.08] pb-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
          <div className="flex items-start gap-3">
            {onBack && <BackButton onClick={onBack} />}
            <div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-indigo-400 uppercase tracking-wider">
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Competency Benchmarks</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
                Skill Gap Analysis
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Benchmark your technical profile against market requirements for <span className="text-slate-200 font-semibold">{selectedRole}</span>.
              </p>
            </div>
          </div>

          {/* Role selector */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              placeholder="Target Role"
              className="px-3 py-1.5 rounded-lg border border-white/[0.12] bg-[#131724] text-white text-xs focus:outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={() => handleRunAnalysis(selectedRole)}
              disabled={isAnalyzing}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all whitespace-nowrap shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
        </div>

        {/* Popular role pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {popularRoles.map(role => (
            <button
              key={role}
              type="button"
              onClick={() => handleRunAnalysis(role)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                selectedRole === role
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'border border-white/[0.10] bg-[#131724] text-slate-400 hover:border-white/[0.20] hover:text-white'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Analysis Results */}
      {analysis ? (
        <div className="space-y-6">
          
          {/* Readiness Score Progress */}
          <div className="p-5 sm:p-6 rounded-xl bg-[#131724] border border-white/[0.08] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-mono text-indigo-400">
                Target Role Readiness
              </span>
              <span className="text-2xl font-bold text-white font-mono">
                {analysis.readinessScore}% Match
              </span>
            </div>

            <div className="w-full bg-white/[0.06] h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${analysis.readinessScore}%` }}
              />
            </div>

            <p className="text-xs text-slate-400 leading-relaxed pt-1">
              {analysis.overallAssessment || `Evaluated against industry benchmarks for ${selectedRole}. Matched skills satisfy core foundation.`}
            </p>
          </div>

          {/* Matched Strengths & Missing Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Matched Skills */}
            <div className="p-5 rounded-xl bg-[#131724] border border-white/[0.08] shadow-sm space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Verified Matching Skills ({analysis.matchedSkills?.length || 0})</span>
              </h3>
              
              <div className="flex flex-wrap gap-2 text-xs">
                {analysis.matchedSkills?.map((skill, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 text-[11px] font-medium">
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="p-5 rounded-xl bg-[#131724] border border-white/[0.08] shadow-sm space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>Critical Skill Gaps ({analysis.missingSkills?.length || 0})</span>
              </h3>

              <div className="space-y-2.5 text-xs">
                {filteredMissingSkills.map((gap, idx) => {
                  const isDone = completedSkillIds.includes(gap.skill);

                  return (
                    <div key={idx} className="flex items-start justify-between gap-3 p-2.5 rounded-lg bg-[#0E111B] border border-white/[0.06]">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${isDone ? 'line-through text-slate-600' : 'text-slate-200'}`}>
                            {gap.skill}
                          </span>
                          <span className="text-[10px] uppercase px-1.5 py-0.5 rounded border border-amber-500/20 bg-amber-500/10 text-amber-300 font-mono">
                            {gap.priority} Priority
                          </span>
                        </div>
                        <p className="text-slate-400 text-[11px]">
                          {gap.recommendedAction || 'Recommended to learn through portfolio projects'}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleMissingSkillCompleted(gap.skill)}
                        className={`w-5 h-5 rounded border shrink-0 flex items-center justify-center transition-colors cursor-pointer ${
                          isDone
                            ? 'bg-indigo-600 border-indigo-500 text-white'
                            : 'border-white/[0.15] bg-[#131724] text-transparent hover:border-white/[0.3]'
                        }`}
                        title="Mark as learned"
                      >
                        {isDone && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Action Steps */}
          {analysis.learningResources && analysis.learningResources.length > 0 && (
            <div className="p-5 rounded-xl bg-[#131724] border border-white/[0.08] shadow-sm space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-indigo-400">
                Recommended Learning Path & Resources
              </h3>
              
              <div className="space-y-2 text-xs">
                {analysis.learningResources.map((res, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-slate-300">
                    <span className="text-indigo-400 font-mono select-none">0{idx + 1}.</span>
                    <div>
                      <strong className="text-white font-semibold">{res.title}</strong>
                      <span className="text-slate-400"> &bull; {res.provider || 'Online Course'} ({res.estimatedHours || 15} hrs)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      ) : (
        <div className="py-16 text-center space-y-4 bg-[#131724] rounded-xl border border-white/[0.08] p-6 shadow-sm">
          <p className="text-xs text-slate-400">Click "Analyze" to benchmark your profile against {selectedRole}.</p>
          <button
            type="button"
            onClick={() => handleRunAnalysis(selectedRole)}
            className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all inline-flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <span>Run Skill Gap Benchmark</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
};
