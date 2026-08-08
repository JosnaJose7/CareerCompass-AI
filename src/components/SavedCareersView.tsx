import React from 'react';
import { 
  Bookmark, 
  Trash2, 
  ArrowRight, 
  TrendingUp, 
  DollarSign, 
  Sparkles,
  Map,
  CheckCircle2
} from 'lucide-react';
import { SavedCareerItem, CareerRoadmap } from '../types';

interface SavedCareersViewProps {
  savedCareers: SavedCareerItem[];
  savedRoadmaps: CareerRoadmap[];
  onRemoveSavedCareer: (id: string) => void;
  onSelectRoadmap: (roadmap: CareerRoadmap) => void;
  onSelectRoleForRoadmap: (title: string) => void;
  user: any;
  onOpenAuth: () => void;
}

export const SavedCareersView: React.FC<SavedCareersViewProps> = ({
  savedCareers,
  savedRoadmaps,
  onRemoveSavedCareer,
  onSelectRoadmap,
  onSelectRoleForRoadmap,
  user,
  onOpenAuth,
}) => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/50 to-purple-900/40 border border-indigo-500/30 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-2">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Firebase Cloud Storage</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Saved Career Paths & Roadmaps
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1">
            Access your bookmarked career options and saved action roadmaps from any browser or device.
          </p>
        </div>

        {!user && (
          <button
            onClick={onOpenAuth}
            className="px-4 py-2.5 rounded-2xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shrink-0"
          >
            Sign In to Sync Firebase Data
          </button>
        )}
      </div>

      {/* Saved Roadmaps Section */}
      <div className="space-y-4">
        <h2 className="text-base font-extrabold text-white flex items-center gap-2">
          <Map className="w-5 h-5 text-indigo-400" />
          <span>Saved Career Roadmaps ({savedRoadmaps.length}):</span>
        </h2>

        {savedRoadmaps.length === 0 ? (
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-500 italic">
            No saved roadmaps yet. Click "Save to Firebase" on any generated roadmap.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {savedRoadmaps.map((rm, idx) => (
              <div
                key={rm.id || idx}
                className="p-5 rounded-2xl bg-slate-900/70 border border-indigo-500/20 hover:border-indigo-500/40 backdrop-blur-xl space-y-3 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                    {rm.estimatedTimeToJobReady || 'Career Plan'}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {rm.milestones?.length || 0} Phases
                  </span>
                </div>

                <h3 className="font-bold text-sm text-white">{rm.roleTitle}</h3>
                <p className="text-xs text-slate-300 line-clamp-2">{rm.overview}</p>

                <button
                  onClick={() => onSelectRoadmap(rm)}
                  className="w-full py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Open Roadmap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Saved Careers Section */}
      <div className="space-y-4">
        <h2 className="text-base font-extrabold text-white flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-purple-400" />
          <span>Bookmarked Career Roles ({savedCareers.length}):</span>
        </h2>

        {savedCareers.length === 0 ? (
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-500 italic">
            No bookmarked career roles. Click the bookmark icon on AI Discovery cards.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedCareers.map((item) => (
              <div
                key={item.id || item.title}
                className="relative p-5 rounded-2xl bg-slate-900/70 border border-indigo-500/20 backdrop-blur-xl space-y-3 transition-all"
              >
                <button
                  onClick={() => item.id && onRemoveSavedCareer(item.id)}
                  className="absolute top-4 right-4 p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800"
                  title="Remove from saved"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2 pr-8">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                    {item.matchScore}% Match
                  </span>
                  <h3 className="font-bold text-sm text-white truncate">{item.title}</h3>
                </div>

                <div className="text-xs text-slate-300 space-y-1">
                  <p><strong>Salary:</strong> {item.salary}</p>
                  <p><strong>Demand:</strong> {item.growth}</p>
                  <p className="line-clamp-2 italic text-slate-400">{item.reasoning}</p>
                </div>

                <button
                  onClick={() => onSelectRoleForRoadmap(item.title)}
                  className="w-full py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white border border-slate-700 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Generate Roadmap for {item.title}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
