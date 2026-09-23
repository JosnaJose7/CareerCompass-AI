import React from 'react';
import { 
  Bookmark, 
  Trash2, 
  ArrowRight,
  BookMarked
} from 'lucide-react';
import { SavedCareerItem, CareerRoadmap } from '../types';
import { BackButton } from './BackButton';

interface SavedCareersViewProps {
  savedCareers: SavedCareerItem[];
  savedRoadmaps: CareerRoadmap[];
  onRemoveSavedCareer: (id: string) => void;
  onSelectRoadmap: (roadmap: CareerRoadmap) => void;
  onSelectRoleForRoadmap: (title: string) => void;
  user: any;
  onOpenAuth: () => void;
  onBack?: () => void;
}

export const SavedCareersView: React.FC<SavedCareersViewProps> = ({
  savedCareers,
  savedRoadmaps,
  onRemoveSavedCareer,
  onSelectRoadmap,
  onSelectRoleForRoadmap,
  user,
  onOpenAuth,
  onBack,
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      
      {/* 1. Header */}
      <div className="border-b border-white/[0.08] pb-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
          <div className="flex items-start gap-3">
            {onBack && <BackButton onClick={onBack} />}
            <div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-indigo-400 uppercase tracking-wider">
                <BookMarked className="w-3.5 h-3.5" />
                <span>Personal Saved Trajectories</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
                Saved Career Trajectories & Roadmaps
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Your bookmarked career pathways and active step-by-step preparation roadmaps.
              </p>
            </div>
          </div>

          {!user && (
            <button
              type="button"
              onClick={onOpenAuth}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-xs cursor-pointer shrink-0"
            >
              Sign In to Sync
            </button>
          )}
        </div>
      </div>

      {/* 2. Saved Roadmaps */}
      <div className="p-5 sm:p-6 rounded-xl bg-[#131724] border border-white/[0.08] shadow-sm space-y-4">
        <h2 className="text-xs uppercase tracking-wider font-mono text-indigo-400 font-semibold">
          Active Roadmaps ({savedRoadmaps.length})
        </h2>

        {savedRoadmaps.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-2">
            No saved roadmaps yet. Generate and save a roadmap to access it here.
          </p>
        ) : (
          <div className="space-y-2.5">
            {savedRoadmaps.map((rm, idx) => (
              <div
                key={rm.id || idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#0E111B] border border-white/[0.06]"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-indigo-400 font-mono">0{idx + 1}.</span>
                    <h3 className="text-sm font-semibold text-white">{rm.targetRole || rm.roleTitle}</h3>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded border border-indigo-500/20 bg-indigo-500/10 text-indigo-300">
                      {rm.durationMonths || 6} Months
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 pl-6">
                    {rm.overview || 'Step-by-step preparation milestone roadmap'}
                  </p>
                </div>

                <div className="pl-6 sm:pl-0 shrink-0">
                  <button
                    type="button"
                    onClick={() => onSelectRoadmap(rm)}
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <span>Open Roadmap</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Saved Careers */}
      <div className="p-5 sm:p-6 rounded-xl bg-[#131724] border border-white/[0.08] shadow-sm space-y-4">
        <h2 className="text-xs uppercase tracking-wider font-mono text-indigo-400 font-semibold">
          Bookmarked Career Roles ({savedCareers.length})
        </h2>

        {savedCareers.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-2">
            No bookmarked roles yet. Click the bookmark icon on any career recommendation card.
          </p>
        ) : (
          <div className="space-y-2.5">
            {savedCareers.map((c, idx) => (
              <div
                key={c.id || idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#0E111B] border border-white/[0.06]"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-indigo-400 font-mono">0{idx + 1}.</span>
                    <h3 className="text-sm font-semibold text-white">{c.title}</h3>
                    {c.matchScore && (
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded border border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
                        {c.matchScore}% Match
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 pl-6">
                    {c.salary || c.salaryRange?.entry || '$90,000 - $120,000'}
                  </p>
                </div>

                <div className="flex items-center gap-2 pl-6 sm:pl-0 shrink-0">
                  <button
                    type="button"
                    onClick={() => onSelectRoleForRoadmap(c.title)}
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <span>Build Roadmap</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemoveSavedCareer(c.id)}
                    className="p-1.5 rounded-lg border border-white/[0.10] bg-[#131724] text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-all cursor-pointer"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
