import React, { useState } from 'react';
import { 
  TrendingUp, 
  Bookmark, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Briefcase,
  DollarSign,
  Sparkles,
  Layers
} from 'lucide-react';
import { AssessmentReportRecommendation } from '../types';

interface CareerCardProps {
  recommendation: AssessmentReportRecommendation | any;
  rankIndex: number;
  onNavigateToRoadmap?: (roleTitle: string) => void;
  onSaveCareer?: (career: any) => void;
  isSaved?: boolean;
}

export const CareerCard: React.FC<CareerCardProps> = ({
  recommendation,
  rankIndex,
  onNavigateToRoadmap,
  onSaveCareer,
  isSaved = false,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [showFullSummary, setShowFullSummary] = useState<boolean>(false);

  const title = recommendation.title || 'Software Engineer';
  const matchScore = recommendation.matchScore || 85;
  const shortSummary = recommendation.shortSummary || recommendation.aiReasoning || recommendation.whyRecommended || recommendation.reason || '';
  
  const entrySalary = recommendation.salaryRanges?.entry || recommendation.salaryRange?.entry || '$90,000 - $125,000';
  const demandGrowth = recommendation.demandGrowth || '+24% High Growth';

  const strengths: string[] = recommendation.strengths && recommendation.strengths.length > 0
    ? recommendation.strengths
    : recommendation.matchingSkills?.slice(0, 3) || ['Algorithmic Problem Solving', 'Full-Stack Architecture'];

  const skillGaps: string[] = recommendation.missingSkills && recommendation.missingSkills.length > 0
    ? recommendation.missingSkills
    : recommendation.skillsGap?.map((g: any) => g.skill || g) || ['Cloud Infrastructure', 'CI/CD Pipelines'];

  const recommendedNextSteps: string[] = recommendation.recommendedNextSteps && recommendation.recommendedNextSteps.length > 0
    ? recommendation.recommendedNextSteps
    : recommendation.areasForImprovement || [
        `Complete production projects tailored to ${title}`,
        'Reinforce core distributed system fundamentals',
        'Mock interview practice with STAR behavioral format'
      ];

  const formattedRank = String(rankIndex + 1).padStart(2, '0');

  return (
    <div className="p-5 rounded-xl bg-[#131724] border border-white/[0.08] hover:border-white/[0.16] transition-all shadow-sm space-y-4">
      
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        
        {/* Left: Rank + Title + Score */}
        <div className="flex items-start gap-3.5 flex-1">
          <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-xs font-mono font-bold text-slate-400 shrink-0">
            {formattedRank}
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {title}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                {matchScore}% Match
              </span>
              <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{demandGrowth}</span>
              </span>
            </div>

            {/* Concise Summary with 'Read more' */}
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              {showFullSummary || shortSummary.length <= 130
                ? shortSummary
                : `${shortSummary.slice(0, 130)}...`
              }
            </p>
            {shortSummary.length > 130 && (
              <button
                type="button"
                onClick={() => setShowFullSummary(!showFullSummary)}
                className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer inline-block"
              >
                {showFullSummary ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>
        </div>

        {/* Right: Salary & Actions */}
        <div className="flex items-center sm:flex-col sm:items-end justify-between gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/[0.06]">
          <div className="text-left sm:text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Entry Salary
            </span>
            <span className="text-xs font-bold text-white font-mono">
              {entrySalary}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onSaveCareer && (
              <button
                type="button"
                onClick={() => onSaveCareer(recommendation)}
                className={`p-2 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                  isSaved
                    ? 'border-indigo-500 bg-indigo-600 text-white shadow-xs'
                    : 'border-white/[0.10] bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08]'
                }`}
                title={isSaved ? 'Saved to Bookmarks' : 'Save Career'}
                aria-label="Save Career"
              >
                <Bookmark className="w-3.5 h-3.5" />
              </button>
            )}

            {onNavigateToRoadmap && (
              <button
                type="button"
                onClick={() => onNavigateToRoadmap(title)}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <span>Build Roadmap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Highlights: Strengths & Missing Gaps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
        <div className="p-2.5 rounded-lg bg-[#0E111B] border border-white/[0.06] flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Top Strengths</span>
            <span className="text-slate-200 truncate block">{strengths.slice(0, 2).join(' &bull; ')}</span>
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-[#0E111B] border border-white/[0.06] flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Key Skill Gaps</span>
            <span className="text-slate-200 truncate block">{skillGaps.slice(0, 2).join(' &bull; ')}</span>
          </div>
        </div>
      </div>

      {/* Expandable Deep Analysis View */}
      <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer py-1"
        >
          <span>{isExpanded ? 'Hide Detailed Analysis' : 'View Career Details & Next Steps'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        <span className="text-[11px] text-slate-400 font-mono">
          Tier 1 Match
        </span>
      </div>

      {/* Expanded Drawer Details */}
      {isExpanded && (
        <div className="pt-3 border-t border-white/[0.08] space-y-4 text-xs animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Validated Matching Competencies</span>
              </h4>
              <ul className="space-y-1 text-slate-300">
                {strengths.map((s: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-white flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>Recommended Skill Enhancements</span>
              </h4>
              <ul className="space-y-1 text-slate-300">
                {skillGaps.map((g: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#0E111B] border border-white/[0.06] space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Strategic AI Next Steps
            </span>
            <div className="space-y-1 text-slate-300">
              {recommendedNextSteps.map((step: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-indigo-400 font-mono font-bold">{idx + 1}.</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
