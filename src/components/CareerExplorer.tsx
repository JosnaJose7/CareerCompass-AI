import React, { useState } from 'react';
import { 
  Search, 
  ArrowRight, 
  Bookmark, 
  TrendingUp,
  Building,
  CheckCircle2,
  ListTodo
} from 'lucide-react';
import { careerExplorerData } from '../data/careerExplorerData';
import { DataSourcesMethodologyModal } from './DataSourcesMethodologyModal';
import { BackButton } from './BackButton';

interface CareerExplorerProps {
  onSelectRoleForRoadmap?: (roleTitle: string) => void;
  onSelectRoleForSkillGap?: (roleTitle: string) => void;
  onSaveCareer?: (career: { title: string; salary: string; growth: string; reasoning: string }) => void;
  savedCareers?: any[];
  onBack?: () => void;
}

export const CareerExplorer: React.FC<CareerExplorerProps> = ({
  onSelectRoleForRoadmap,
  onSelectRoleForSkillGap,
  onSaveCareer,
  savedCareers = [],
  onBack,
}) => {
  const [selectedCareerId, setSelectedCareerId] = useState<string>(careerExplorerData[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeDetailTab, setActiveDetailTab] = useState<'overview' | 'skills' | 'companies' | 'roadmap'>('overview');
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);

  const categories = ['All', 'AI & Data Science', 'Software Engineering', 'Cloud & Infrastructure', 'Cybersecurity'];

  const filteredCareers = careerExplorerData.filter(career => {
    const matchesCategory = selectedCategory === 'All' || career.category === selectedCategory;
    const matchesSearch = career.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          career.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          career.skills.technical.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const selectedCareer = careerExplorerData.find(c => c.id === selectedCareerId) || careerExplorerData[0];
  const isSaved = savedCareers.some(sc => sc.title?.toLowerCase() === selectedCareer.title.toLowerCase());

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      
      {/* 1. Header */}
      <div className="space-y-4 border-b border-white/[0.08] pb-5">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div className="flex items-start gap-3">
            {onBack && <BackButton onClick={onBack} />}
            <div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-indigo-400 uppercase tracking-wider">
                <Building className="w-3.5 h-3.5" />
                <span>Industry Roles Directory</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
                Career Explorer
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Explore in-depth technical roles, salary compensation tracks, day-in-the-life expectations, and hiring benchmarks.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search careers & skills..."
                className="px-3 py-1.5 pl-8 rounded-lg border border-white/[0.12] bg-[#131724] text-white text-xs focus:outline-none focus:border-indigo-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'border border-white/[0.10] bg-[#131724] text-slate-400 hover:border-white/[0.20] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Master-Detail Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left: Role List */}
        <div className="space-y-2 md:border-r md:border-white/[0.08] md:pr-4">
          <span className="text-xs uppercase tracking-wider font-mono text-indigo-400 block pb-1">
            Roles ({filteredCareers.length})
          </span>

          <div className="space-y-1.5">
            {filteredCareers.map((c) => {
              const isSelected = c.id === selectedCareer.id;

              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCareerId(c.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all flex flex-col cursor-pointer border ${
                    isSelected
                      ? 'bg-indigo-600/15 border-indigo-500/60 font-semibold text-white shadow-xs'
                      : 'bg-[#131724] border-white/[0.06] hover:border-white/[0.15] text-slate-300'
                  }`}
                >
                  <span className="text-xs font-semibold text-white">{c.title}</span>
                  <span className={`text-[11px] font-mono mt-0.5 ${isSelected ? 'text-indigo-300' : 'text-slate-400'}`}>
                    {c.salary?.entry || '$95,000'} • {c.badge || 'High Growth'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Role Detail */}
        <div className="md:col-span-2 space-y-5">
          
          <div className="p-6 rounded-xl bg-[#131724] border border-white/[0.08] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-indigo-400 uppercase tracking-wider">
                {selectedCareer.category}
              </span>
              <div className="flex items-center gap-2">
                {onSaveCareer && (
                  <button
                    type="button"
                    onClick={() => onSaveCareer({
                      title: selectedCareer.title,
                      salary: selectedCareer.salary?.entry || '$95,000',
                      growth: selectedCareer.badge || 'High Growth',
                      reasoning: selectedCareer.description
                    })}
                    className="text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded-lg border border-white/[0.12] bg-[#0E111B] shadow-xs cursor-pointer hover:border-white/[0.25]"
                  >
                    <Bookmark className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{isSaved ? 'Saved' : 'Save'}</span>
                  </button>
                )}
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white tracking-tight">
              {selectedCareer.title}
            </h2>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {selectedCareer.description}
            </p>

            <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-400 border-t border-white/[0.08] pt-3">
              <div><strong className="text-slate-200">Salary Range:</strong> {selectedCareer.salary?.entry || '$90,000'} - {selectedCareer.salary?.senior || '$160,000+'}</div>
              <div><strong className="text-slate-200">Market Demand:</strong> {selectedCareer.badge || 'High Demand'}</div>
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="flex items-center gap-4 text-xs font-medium border-b border-white/[0.08] pb-2">
            {[
              { key: 'overview', label: 'Day in the Life' },
              { key: 'skills', label: 'Required Skills' },
              { key: 'companies', label: 'Top Employers' },
              { key: 'roadmap', label: 'Action Roadmap' }
            ].map(tab => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveDetailTab(tab.key as any)}
                className={`transition-colors pb-1 cursor-pointer ${
                  activeDetailTab === tab.key
                    ? 'text-indigo-400 font-semibold border-b-2 border-indigo-500'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-4 text-xs leading-relaxed text-slate-300">
            {activeDetailTab === 'overview' && (
              <div className="space-y-3 p-5 rounded-xl bg-[#131724] border border-white/[0.08]">
                <h4 className="font-mono text-indigo-400 uppercase tracking-wider text-[11px] font-semibold">
                  Daily Responsibilities & Typical Tasks
                </h4>
                <ul className="space-y-2 pl-1">
                  {selectedCareer.dayInLife?.map((task, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeDetailTab === 'skills' && (
              <div className="space-y-4 p-5 rounded-xl bg-[#131724] border border-white/[0.08]">
                <div>
                  <h4 className="font-mono text-indigo-400 uppercase tracking-wider text-[11px] font-semibold mb-2">
                    Core Technical Stack
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCareer.skills.technical.map((sk, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-md bg-[#0E111B] border border-white/[0.08] text-slate-200 text-[11px] font-mono">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-mono text-indigo-400 uppercase tracking-wider text-[11px] font-semibold mb-2">
                    Frameworks & Specialized Tools
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCareer.skills.frameworksAndTools?.map((sk, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-md bg-[#0E111B] border border-white/[0.08] text-slate-200 text-[11px] font-mono">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-mono text-indigo-400 uppercase tracking-wider text-[11px] font-semibold mb-2">
                    Foundational Soft Skills
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCareer.skills.softSkills?.map((sk, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-md bg-[#0E111B] border border-white/[0.08] text-slate-300 text-[11px]">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeDetailTab === 'companies' && (
              <div className="space-y-3 p-5 rounded-xl bg-[#131724] border border-white/[0.08]">
                <h4 className="font-mono text-indigo-400 uppercase tracking-wider text-[11px] font-semibold">
                  Top Hiring Companies & Sectors
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedCareer.topCompanies?.map((comp, i) => (
                    <div key={i} className="p-3 rounded-lg border border-white/[0.06] bg-[#0E111B]">
                      <span className="font-semibold text-white block">{comp.name}</span>
                      <span className="text-[11px] font-mono text-indigo-400 block">{comp.industry}</span>
                      <span className="text-[10px] text-slate-400 mt-1 block">{comp.hiringFocus}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeDetailTab === 'roadmap' && (
              <div className="space-y-3 p-5 rounded-xl bg-[#131724] border border-white/[0.08]">
                <h4 className="font-mono text-indigo-400 uppercase tracking-wider text-[11px] font-semibold">
                  Preparation Roadmap Phases
                </h4>
                <div className="space-y-2.5">
                  {selectedCareer.roadmap?.map((phase, i) => (
                    <div key={i} className="p-3 rounded-lg border border-white/[0.06] bg-[#0E111B] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-white">{phase.title}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-indigo-500/20 bg-indigo-500/10 text-indigo-300">
                          {phase.duration}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{phase.topics.join(' • ')}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-white/[0.08] flex flex-wrap gap-3">
            {onSelectRoleForRoadmap && (
              <button
                type="button"
                onClick={() => onSelectRoleForRoadmap(selectedCareer.title)}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all inline-flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <span>Generate {selectedCareer.title} Roadmap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {onSelectRoleForSkillGap && (
              <button
                type="button"
                onClick={() => onSelectRoleForSkillGap(selectedCareer.title)}
                className="px-4 py-2 rounded-lg border border-white/[0.12] bg-[#131724] text-slate-200 hover:bg-white/[0.04] font-medium text-xs transition-all cursor-pointer"
              >
                Benchmark Skill Gap
              </button>
            )}
          </div>

        </div>

      </div>

      <DataSourcesMethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />

    </div>
  );
};
