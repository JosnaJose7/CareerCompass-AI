import React, { useState } from 'react';
import { 
  Sparkles, 
  Briefcase, 
  Database,
  Sliders,
  ArrowRight,
  TrendingUp,
  Target,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Award,
  FileText,
  Map,
  Compass,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Info
} from 'lucide-react';
import { CareerRecommendation, StudentProfile, DimensionBreakdown } from '../types';
import { CareerCard } from './CareerCard';
import { DataSourcesMethodologyModal } from './DataSourcesMethodologyModal';
import { calculate11DimensionReadiness, DIMENSION_LABELS, DIMENSION_WEIGHTS } from '../utils/readinessScoring';

interface CareerRecommendationsProps {
  recommendations: CareerRecommendation[];
  onSelectRoleForRoadmap: (roleTitle: string) => void;
  onSaveCareer: (career: CareerRecommendation) => void;
  savedTitles: string[];
  isGenerating: boolean;
  onGoToProfile: () => void;
  onOpenScenarioSimulator?: () => void;
  userName?: string;
  profile?: StudentProfile;
  readinessScore?: number;
  readinessBreakdown?: DimensionBreakdown;
}

export const CareerRecommendations: React.FC<CareerRecommendationsProps> = ({
  recommendations,
  onSelectRoleForRoadmap,
  onSaveCareer,
  savedTitles,
  isGenerating,
  onGoToProfile,
  onOpenScenarioSimulator,
  userName = 'Student',
  profile,
  readinessScore: propReadinessScore,
  readinessBreakdown: propReadinessBreakdown
}) => {
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);
  const [showFullTopSummary, setShowFullTopSummary] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);

  // Compute 11-dimensional readiness dynamically from student profile
  const readinessResult = calculate11DimensionReadiness(profile || {});
  const displayScore = propReadinessScore ?? readinessResult.readinessScore;
  const breakdown: DimensionBreakdown = propReadinessBreakdown ?? readinessResult.breakdown;

  // Today's formatted date
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  }).format(new Date());

  if (isGenerating) {
    return (
      <div className="py-24 text-center max-w-xl mx-auto space-y-4">
        <div className="w-12 h-12 mx-auto rounded-xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 animate-pulse">
          <Sparkles className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Synthesizing Career Trajectories
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
          Evaluating 11 holistic profile dimensions: academic credentials, tech stack depth, project portfolio, hackathons, and market demand vectors.
        </p>
        <div className="w-48 mx-auto h-1.5 bg-white/[0.08] rounded-full overflow-hidden mt-4">
          <div className="h-full bg-indigo-500 rounded-full animate-pulse w-3/4" />
        </div>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="py-20 max-w-xl mx-auto text-center space-y-5">
        <div className="w-12 h-12 mx-auto rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-indigo-400">
          <Target className="w-6 h-6" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Personal Career Command Center
          </h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            Complete your student profile with coursework, technical skills, and project experience to generate personalized AI recommendations.
          </p>
        </div>
        <div>
          <button
            type="button"
            onClick={onGoToProfile}
            className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all inline-flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <span>Complete Student Profile</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const topMatch = recommendations[0];

  return (
    <div className="space-y-8 pb-12">
      
      {/* ========================================================================= */}
      {/* 1. PERSONAL CAREER COMMAND CENTER (Dashboard / Home Header) */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        {/* Welcome Row */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-white/[0.08] pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Good morning, {userName}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Your career readiness at a glance &bull; {todayFormatted}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-xs">
            {onOpenScenarioSimulator && (
              <button
                type="button"
                onClick={onOpenScenarioSimulator}
                className="px-3 py-1.5 rounded-lg border border-white/[0.10] bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08] flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                <span>What-If Simulator</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsMethodologyOpen(true)}
              className="text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-slate-400" />
              <span>Methodology</span>
            </button>
          </div>
        </div>

        {/* Command Center: Career Readiness Score & 5 Metric Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Main Hero Score Gauge Card (5 Cols) */}
          <div className="lg:col-span-5 p-6 rounded-xl bg-[#131724] border border-white/[0.08] flex flex-col justify-between space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Career Readiness Index
              </span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>&uarr; 6 points this month</span>
              </span>
            </div>

            {/* Circular Gauge Visualization */}
            <div className="flex items-center gap-6 py-1">
              <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  {/* Track */}
                  <path
                    className="text-white/[0.06]"
                    strokeWidth="3.2"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Active Indicator */}
                  <path
                    className="text-indigo-500 stroke-current transition-all duration-1000 ease-out"
                    strokeDasharray={`${displayScore}, 100`}
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-extrabold text-white font-mono leading-none">{displayScore}</span>
                  <span className="text-[9px] text-slate-400 font-mono">/ 100</span>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white leading-tight">
                  {displayScore >= 85 ? "Excellent market positioning." : displayScore >= 75 ? "Strong career readiness trajectory." : "Foundational readiness in progress."}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Evaluated across the 11-Dimensional Holistic Framework with {displayScore >= 80 ? 'solid technical competencies' : 'growing portfolio proof'}.
                </p>
                <button
                  type="button"
                  onClick={() => setShowBreakdown(!showBreakdown)}
                  className="mt-1 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <BarChart3 className="w-3 h-3" />
                  <span>{showBreakdown ? 'Hide 11-Dimension Breakdown' : 'View 11-Dimension Breakdown'}</span>
                  {showBreakdown ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
              <span>Target Role: <strong className="text-slate-200">{topMatch?.title || 'Software Engineer'}</strong></span>
              <button 
                onClick={onGoToProfile}
                className="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
              >
                Update Profile &rarr;
              </button>
            </div>
          </div>

          {/* Clean Grid of 5 Important Metric Cards (7 Cols) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
            
            {/* 1. Profile Completion */}
            <div className="p-4 rounded-xl bg-[#131724] border border-white/[0.08] flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Profile</span>
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <div>
                <div className="text-xl font-bold text-white font-mono">92%</div>
                <div className="text-[11px] text-slate-400">11 of 11 areas complete</div>
              </div>
              <div className="w-full bg-white/[0.06] h-1 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full w-[92%]" />
              </div>
            </div>

            {/* 2. Skill Match */}
            <div className="p-4 rounded-xl bg-[#131724] border border-white/[0.08] flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Skill Match</span>
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div>
                <div className="text-xl font-bold text-white font-mono">{topMatch?.matchScore || 85}%</div>
                <div className="text-[11px] text-slate-400">High technical fit</div>
              </div>
              <div className="w-full bg-white/[0.06] h-1 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full" style={{ width: `${topMatch?.matchScore || 85}%` }} />
              </div>
            </div>

            {/* 3. Resume ATS Score */}
            <div className="p-4 rounded-xl bg-[#131724] border border-white/[0.08] flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">ATS Score</span>
                <FileText className="w-3.5 h-3.5 text-sky-400" />
              </div>
              <div>
                <div className="text-xl font-bold text-white font-mono">84<span className="text-xs text-slate-400">/100</span></div>
                <div className="text-[11px] text-slate-400">Recruiter ready</div>
              </div>
              <div className="w-full bg-white/[0.06] h-1 rounded-full overflow-hidden">
                <div className="bg-sky-400 h-full w-[84%]" />
              </div>
            </div>

            {/* 4. Interview Readiness */}
            <div className="p-4 rounded-xl bg-[#131724] border border-white/[0.08] flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Interview</span>
                <Award className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div>
                <div className="text-xl font-bold text-white font-mono">79%</div>
                <div className="text-[11px] text-slate-400">4 categories tested</div>
              </div>
              <div className="w-full bg-white/[0.06] h-1 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full w-[79%]" />
              </div>
            </div>

            {/* 5. Roadmap Progress */}
            <div className="p-4 rounded-xl bg-[#131724] border border-white/[0.08] flex flex-col justify-between space-y-2 col-span-2 sm:col-span-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Roadmap Momentum</span>
                <Map className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl font-bold text-white font-mono">Month 02 <span className="text-xs text-indigo-300 font-normal">Active</span></div>
                  <div className="text-[11px] text-slate-400">6 of 12 weekly tasks completed</div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-indigo-400 font-mono">50%</span>
                </div>
              </div>
              <div className="w-full bg-white/[0.06] h-1 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full w-[50%]" />
              </div>
            </div>

          </div>
        </div>

        {/* Expandable 11-Dimensional Holistic Breakdown Panel */}
        {showBreakdown && (
          <div className="p-5 rounded-xl bg-[#131724] border border-indigo-500/30 space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white tracking-tight">
                    11-Dimensional Holistic Evaluation Breakdown
                  </h3>
                </div>
                <p className="text-[11px] text-slate-400">
                  Calibrated multi-dimensional framework. Normalized 0–100 scale, weights strictly total 100%.
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-slate-400 font-mono">
                  Composite Index: <strong className="text-emerald-400">{displayScore}/100</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setShowBreakdown(false)}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {readinessResult.dimensionDetails.map(dim => (
                <div
                  key={dim.key}
                  className="p-3 rounded-lg bg-[#0E111B] border border-white/[0.06] space-y-2 hover:border-white/[0.12] transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{dim.label}</span>
                    <span className="font-mono font-bold text-white">{breakdown[dim.key]}<span className="text-[10px] text-slate-500 font-normal">/100</span></span>
                  </div>
                  <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        breakdown[dim.key] >= 85
                          ? 'bg-emerald-400'
                          : breakdown[dim.key] >= 70
                          ? 'bg-indigo-400'
                          : 'bg-amber-400'
                      }`}
                      style={{ width: `${breakdown[dim.key]}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Weight: {(dim.weight * 100).toFixed(0)}%</span>
                    <span className="font-mono text-indigo-300">
                      Contrib: +{(breakdown[dim.key] * dim.weight).toFixed(1)} pts
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-white/[0.06] flex items-start gap-2 text-[11px] text-slate-400">
              <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
              <span>{readinessResult.summary}</span>
            </div>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 2. CAREER RECOMMENDATIONS SECTION (Centerpiece) */}
      {/* ========================================================================= */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Your Best-Fit Careers
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Ranked by AI alignment across skills, coursework, and industry trajectory.
            </p>
          </div>

          <span className="text-xs font-mono text-slate-400">
            {recommendations.length} Recommended Roles
          </span>
        </div>

        {/* Stack of Clean Career Cards */}
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <CareerCard
              key={rec.id || index}
              recommendation={rec}
              rankIndex={index}
              onNavigateToRoadmap={onSelectRoleForRoadmap}
              onSaveCareer={onSaveCareer}
              isSaved={savedTitles.includes(rec.title)}
            />
          ))}
        </div>
      </section>

      {/* Methodology Modal */}
      <DataSourcesMethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />

    </div>
  );
};
