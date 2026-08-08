import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Filter, 
  DollarSign, 
  Building2, 
  BookOpen, 
  Video, 
  MapPin, 
  CheckCircle2, 
  ExternalLink, 
  Bookmark, 
  ChevronRight, 
  Code, 
  Cloud, 
  ShieldAlert, 
  Server, 
  Layout, 
  BarChart, 
  Cpu, 
  Gamepad, 
  ServerCog,
  Briefcase,
  Layers,
  ArrowRight,
  Play,
  Share2,
  Check
} from 'lucide-react';
import { CareerDetail, careerExplorerData } from '../data/careerExplorerData';

interface CareerExplorerProps {
  onSelectRoleForRoadmap?: (roleTitle: string) => void;
  onSelectRoleForSkillGap?: (roleTitle: string) => void;
  onSaveCareer?: (career: { title: string; salary: string; growth: string; reasoning: string }) => void;
  savedCareers?: any[];
}

export const CareerExplorer: React.FC<CareerExplorerProps> = ({
  onSelectRoleForRoadmap,
  onSelectRoleForSkillGap,
  onSaveCareer,
  savedCareers = []
}) => {
  const [selectedCareerId, setSelectedCareerId] = useState<string>(careerExplorerData[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeDetailTab, setActiveDetailTab] = useState<'overview' | 'skills' | 'companies' | 'roadmap' | 'videos_resources'>('overview');
  const [copiedLink, setCopiedLink] = useState(false);

  const categories = ['All', 'AI & Data Science', 'Software Engineering', 'Cloud & Infrastructure', 'Cybersecurity', 'Gaming & Interactive Media'];

  const filteredCareers = careerExplorerData.filter(career => {
    const matchesCategory = selectedCategory === 'All' || career.category === selectedCategory;
    const matchesSearch = career.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          career.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          career.skills.technical.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const selectedCareer = careerExplorerData.find(c => c.id === selectedCareerId) || careerExplorerData[0];

  const isSaved = savedCareers.some(sc => sc.title?.toLowerCase() === selectedCareer.title.toLowerCase());

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return Sparkles;
      case 'Code': return Code;
      case 'Cloud': return Cloud;
      case 'ShieldAlert': return ShieldAlert;
      case 'Server': return Server;
      case 'Layout': return Layout;
      case 'BarChart': return BarChart;
      case 'Cpu': return Cpu;
      case 'Gamepad': return Gamepad;
      case 'ServerCog': return ServerCog;
      default: return Briefcase;
    }
  };

  const IconComponent = getIcon(selectedCareer.iconName);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold">
          <Briefcase className="w-4 h-4 text-amber-400" />
          <span>Interactive Career & Technology Index</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
          Explore High-Growth Tech Careers
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto">
          Deep-dive into industry descriptions, real compensation bands, required skills, hiring companies, learning roadmaps, curated videos, and documentation.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search careers, skills (e.g. Python, Docker, AI, React)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                    : 'bg-slate-950/80 hover:bg-slate-800 text-slate-400 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Main Grid: Left Career List (Sidebar/Cards) & Right Detailed View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Career Cards List */}
        <div className="lg:col-span-4 space-y-3 max-h-[850px] overflow-y-auto pr-1 scrollbar-thin">
          <div className="flex items-center justify-between px-2 pb-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Careers ({filteredCareers.length})
            </span>
            <span className="text-[11px] text-slate-500">Click to Inspect</span>
          </div>

          {filteredCareers.map((c) => {
            const CardIcon = getIcon(c.iconName);
            const isSelected = c.id === selectedCareerId;

            return (
              <div
                key={c.id}
                onClick={() => {
                  setSelectedCareerId(c.id);
                  setActiveDetailTab('overview');
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                  isSelected
                    ? 'bg-gradient-to-r from-slate-900 to-blue-950/70 border-blue-500/60 shadow-xl shadow-blue-950/30'
                    : 'bg-slate-900/40 hover:bg-slate-900/80 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {isSelected && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-500" />
                )}

                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-xl shrink-0 transition-colors ${
                    isSelected ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40' : 'bg-slate-950 text-blue-400 border border-slate-800 group-hover:border-slate-700'
                  }`}>
                    <CardIcon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className={`text-sm font-bold truncate ${isSelected ? 'text-white' : 'text-slate-200 group-hover:text-blue-300'}`}>
                        {c.title}
                      </h3>
                      <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'text-blue-400 translate-x-1' : 'text-slate-600'}`} />
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                      {c.description}
                    </p>

                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-800/60">
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        {c.salary.average}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400">
                        {c.badge}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredCareers.length === 0 && (
            <div className="p-8 text-center rounded-2xl bg-slate-900/30 border border-slate-800 text-slate-400 space-y-2">
              <Search className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-xs">No careers matching "{searchQuery}". Try another keyword or filter.</p>
            </div>
          )}
        </div>

        {/* Right Detail Panel */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Detail Header Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl relative overflow-hidden backdrop-blur-xl space-y-6">
            <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 blur-[100px] pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              
              <div className="flex items-center gap-4">
                <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl shadow-blue-900/30">
                  <IconComponent className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300">
                      {selectedCareer.category}
                    </span>
                    <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                      {selectedCareer.badge}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight mt-1">
                    {selectedCareer.title}
                  </h2>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    if (onSaveCareer) {
                      onSaveCareer({
                        title: selectedCareer.title,
                        salary: selectedCareer.salary.average,
                        growth: selectedCareer.badge,
                        reasoning: selectedCareer.description
                      });
                    }
                  }}
                  className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
                    isSaved
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
                  }`}
                >
                  <Bookmark className="w-4 h-4 text-amber-400" />
                  <span>{isSaved ? 'Saved to Paths' : 'Save Path'}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all flex items-center gap-1.5"
                  title="Share Link"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                  <span>{copiedLink ? 'Copied!' : 'Share'}</span>
                </button>
              </div>

            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-center space-y-0.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Average Salary</span>
                <span className="text-base font-extrabold text-emerald-400 block">{selectedCareer.salary.average}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-center space-y-0.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Entry Salary</span>
                <span className="text-base font-extrabold text-slate-200 block">{selectedCareer.salary.entry}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-center space-y-0.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Senior Salary</span>
                <span className="text-base font-extrabold text-indigo-400 block">{selectedCareer.salary.senior}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-center space-y-0.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Hiring Leaders</span>
                <span className="text-base font-extrabold text-blue-400 block">{selectedCareer.topCompanies.length} Top Cos</span>
              </div>
            </div>

            {/* Interactive Section Tabs */}
            <div className="flex items-center gap-1 border-b border-slate-800 overflow-x-auto pb-1 scrollbar-none pt-2">
              {[
                { id: 'overview', label: 'Overview & Day in Life', icon: Briefcase },
                { id: 'skills', label: 'Required Skills', icon: Code },
                { id: 'companies', label: 'Top Companies', icon: Building2 },
                { id: 'roadmap', label: 'Learning Roadmap', icon: Layers },
                { id: 'videos_resources', label: 'Videos & Resources', icon: Video }
              ].map((tab) => {
                const TabIcon = tab.icon;
                const isActive = activeDetailTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveDetailTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    <TabIcon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT 1: OVERVIEW & DAY IN LIFE */}
            {activeDetailTab === 'overview' && (
              <div className="space-y-6 animate-fade-in pt-2">
                
                {/* Description & Role Summary */}
                <div className="space-y-3">
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-blue-400">
                    Role Summary & Industry Scope
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                    {selectedCareer.overview}
                  </p>
                </div>

                {/* A Day in the Life */}
                <div className="space-y-3">
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-emerald-400">
                    A Day in the Life of a {selectedCareer.title}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedCareer.dayInLife.map((item, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-xs text-slate-300 leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Salary Bands Detailed Breakdown */}
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-amber-400" />
                    <span>Detailed Salary Growth Spectrum</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 font-bold block">Entry Level (0-2 Yrs)</span>
                      <span className="text-lg font-bold text-slate-100">{selectedCareer.salary.entry}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-blue-500/30">
                      <span className="text-[10px] text-blue-400 font-bold block">Mid-Level (2-5 Yrs)</span>
                      <span className="text-lg font-bold text-blue-300">{selectedCareer.salary.mid}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/30">
                      <span className="text-[10px] text-emerald-400 font-bold block">Senior & Staff (5+ Yrs)</span>
                      <span className="text-lg font-bold text-emerald-300">{selectedCareer.salary.senior}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Action Bridge to Skill Gap / Roadmap */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-blue-500/30">
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">Ready to prepare for {selectedCareer.title}?</h4>
                    <p className="text-xs text-slate-400">Analyze your current profile gap or generate an AI roadmap.</p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    {onSelectRoleForSkillGap && (
                      <button
                        onClick={() => onSelectRoleForSkillGap(selectedCareer.title)}
                        className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                      >
                        <BarChart className="w-3.5 h-3.5" />
                        <span>Run Skill Gap</span>
                      </button>
                    )}
                    {onSelectRoleForRoadmap && (
                      <button
                        onClick={() => onSelectRoleForRoadmap(selectedCareer.title)}
                        className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>Generate Roadmap</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* TAB CONTENT 2: SKILLS */}
            {activeDetailTab === 'skills' && (
              <div className="space-y-6 animate-fade-in pt-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  
                  {/* Technical Core Skills */}
                  <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                      <Code className="w-4 h-4 text-blue-400" />
                      <span>Technical Core Stack</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCareer.skills.technical.map((sk, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Frameworks & Tools */}
                  <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-emerald-400" />
                      <span>Frameworks & Tools</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCareer.skills.frameworksAndTools.map((tool, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Soft Skills & Mindset */}
                  <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span>Soft Skills & Mindset</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCareer.skills.softSkills.map((soft, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
                          {soft}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* TAB CONTENT 3: TOP COMPANIES */}
            {activeDetailTab === 'companies' && (
              <div className="space-y-4 animate-fade-in pt-2">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300">
                  Key Employers & Hiring Focus Areas
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedCareer.topCompanies.map((comp, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-base font-bold text-slate-100">{comp.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                          {comp.industry}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        <strong className="text-indigo-400">Hiring Focus:</strong> {comp.hiringFocus}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT 4: LEARNING ROADMAP */}
            {activeDetailTab === 'roadmap' && (
              <div className="space-y-5 animate-fade-in pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-indigo-400">
                    Step-by-Step Skill Progression Roadmap
                  </h3>
                  <span className="text-xs text-slate-400 font-medium">4 Core Phases</span>
                </div>

                <div className="space-y-4">
                  {selectedCareer.roadmap.map((step, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 relative space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-extrabold text-xs">
                            {idx + 1}
                          </span>
                          <h4 className="text-sm font-bold text-slate-100">{step.title}</h4>
                        </div>
                        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-semibold">
                          {step.duration}
                        </span>
                      </div>

                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-800/60">
                        {step.topics.map((topic, tIdx) => (
                          <li key={tIdx} className="text-xs text-slate-300 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT 5: VIDEOS & RESOURCES */}
            {activeDetailTab === 'videos_resources' && (
              <div className="space-y-6 animate-fade-in pt-2">
                
                {/* Videos Section */}
                <div className="space-y-3">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-rose-400" />
                    <span>Curated Video Tutorials & Talks ({selectedCareer.videos.length})</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {selectedCareer.videos.map((vid, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-3">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">{vid.category}</span>
                          <h4 className="text-xs font-bold text-slate-200 line-clamp-2">{vid.title}</h4>
                          <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                            <span>{vid.channel}</span>
                            <span className="text-slate-500">{vid.duration}</span>
                          </div>
                        </div>

                        <a
                          href={vid.url}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-1"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Watch Tutorial</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resources Section */}
                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                    <span>Official Documentation & Practice Platforms ({selectedCareer.resources.length})</span>
                  </h3>

                  <div className="space-y-2.5">
                    {selectedCareer.resources.map((res, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-200">{res.title}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold uppercase">
                              {res.type}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">{res.description}</p>
                          <span className="text-[10px] text-slate-500 block">Provided by {res.provider}</span>
                        </div>

                        <a
                          href={res.url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-indigo-300 hover:text-indigo-200 border border-slate-800 text-xs font-bold transition-all flex items-center gap-1 shrink-0"
                        >
                          <span>Open Resource</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
