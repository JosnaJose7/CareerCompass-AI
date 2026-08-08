import React, { useState } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  Sparkles, 
  DollarSign, 
  Zap, 
  Briefcase, 
  Target, 
  Layers, 
  Search, 
  RefreshCw, 
  ArrowUpRight, 
  Building2, 
  CheckCircle2, 
  Cpu, 
  PieChart as PieChartIcon, 
  Compass,
  Award
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell, 
  RadarChart, 
  Radar, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Legend 
} from 'recharts';
import { JobMarketOverview, CareerDemandItem } from '../types';
import { initialJobMarketData } from '../data/jobMarketData';

interface JobMarketDashboardProps {
  onSelectRoleForRoadmap?: (roleTitle: string) => void;
  onExploreSkillGap?: (roleTitle: string) => void;
}

export const JobMarketDashboard: React.FC<JobMarketDashboardProps> = ({
  onSelectRoleForRoadmap,
  onExploreSkillGap
}) => {
  const [marketData, setMarketData] = useState<JobMarketOverview>(initialJobMarketData);
  const [selectedSector, setSelectedSector] = useState<string>('Technology & AI Engineering');
  const [customSectorInput, setCustomSectorInput] = useState<string>('');
  const [isFetchingLive, setIsFetchingLive] = useState<boolean>(false);
  const [selectedCareerModal, setSelectedCareerModal] = useState<CareerDemandItem | null>(null);
  const [chartViewFilter, setChartViewFilter] = useState<'All' | 'Skills' | 'Trends' | 'Salaries' | 'Scope'>('All');

  const presetSectors = [
    'Technology & AI Engineering',
    'Data Science & Analytics',
    'Cloud & DevOps Solutions',
    'Cybersecurity & Network Security',
    'Fintech & Quantitative Tech'
  ];

  const handleFetchSector = async (sectorName: string) => {
    setSelectedSector(sectorName);
    setIsFetchingLive(true);
    try {
      const res = await fetch('/api/job-market-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sector: sectorName })
      });
      const data = await res.json();
      if (data && data.topHiringSkills) {
        setMarketData(data);
      }
    } catch (err) {
      console.error('Failed to fetch live market insights:', err);
    } finally {
      setIsFetchingLive(false);
    }
  };

  const handleCustomSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSectorInput.trim()) return;
    handleFetchSector(customSectorInput);
    setCustomSectorInput('');
  };

  // Color Palette
  const PIE_COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Header & Sector Controller */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/50 to-purple-900/40 border border-indigo-500/30 backdrop-blur-xl shadow-2xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Real-Time Job Market & Career Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Interactive Job Market Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Analyze top hiring skills, salary ranges, trending tech momentum, popular careers, demand distribution, and 5-year future scope projections.
            </p>
          </div>

          {/* AI Custom Market Fetcher */}
          <form onSubmit={handleCustomSearch} className="flex gap-2 shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={customSectorInput}
                onChange={(e) => setCustomSectorInput(e.target.value)}
                placeholder="Search sector (e.g. AI Robotics)..."
                className="pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 min-w-[210px]"
              />
            </div>
            <button
              type="submit"
              disabled={isFetchingLive || !customSectorInput.trim()}
              className="px-4 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-1.5 whitespace-nowrap"
            >
              {isFetchingLive ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{isFetchingLive ? 'Analyzing...' : 'Analyze Market'}</span>
            </button>
          </form>
        </div>

        {/* Preset Industry Sector Pills */}
        <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
            Industry Sector:
          </span>
          {presetSectors.map((sector) => {
            const isActive = selectedSector === sector;
            return (
              <button
                key={sector}
                onClick={() => handleFetchSector(sector)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                  isActive
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                    : 'bg-slate-900/70 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                {sector}
              </button>
            );
          })}
        </div>

        {/* AI Market Brief Summary Box */}
        {marketData.aiSummary && (
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-indigo-500/20 text-xs text-slate-300 flex items-start gap-3">
            <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white font-bold block mb-0.5">
                Executive Market Intelligence Brief ({marketData.industrySector}):
              </strong>
              <span>{marketData.aiSummary}</span>
            </div>
          </div>
        )}
      </div>

      {/* High Level Key Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Top Skill Demand</span>
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">
            {marketData.topHiringSkills[0]?.skill || 'Python'}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
            <span>{marketData.topHiringSkills[0]?.demandPercentage || 94}% Demand Rate</span>
            <span className="text-slate-500">•</span>
            <span>{marketData.topHiringSkills[0]?.yearOverYearGrowth || '+38% YoY'}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Average Starting Salary</span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">
            ${(marketData.popularCareers[0]?.entrySalary || 115000).toLocaleString()}/yr
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Highest Entry: AI & Cloud</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Top Hiring Career</span>
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white truncate">
            {marketData.popularCareers[0]?.role || 'AI/ML Engineer'}
          </div>
          <div className="text-xs text-slate-400">
            {(marketData.popularCareers[0]?.openingsIndex || 124000).toLocaleString()} open positions
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Market Growth Scope</span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">
            {marketData.popularCareers[0]?.futureGrowthRate || '+34%'}
          </div>
          <div className="text-xs text-emerald-400 font-semibold">
            Very High 5-Year Outlook
          </div>
        </div>

      </div>

      {/* View Filter Switcher */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 w-fit">
        {(['All', 'Skills', 'Trends', 'Salaries', 'Scope'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setChartViewFilter(mode)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              chartViewFilter === mode
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {mode === 'All' ? 'Full Dashboard' : `${mode} Charts`}
          </button>
        ))}
      </div>

      {/* Section 1 & 2: Top Hiring Skills & Trending Technologies Charts */}
      {(chartViewFilter === 'All' || chartViewFilter === 'Skills') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Chart 1: Top Hiring Skills */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-indigo-500/20 backdrop-blur-xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-base font-extrabold text-white">1. Top Hiring Skills Demand (%)</h3>
                </div>
                <p className="text-xs text-slate-400">Percentage of job postings requiring key technical skills.</p>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                2026 Demand Index
              </span>
            </div>

            <div className="h-[300px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={marketData.topHiringSkills} layout="vertical" margin={{ left: 20, right: 20, top: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: '#94A3B8', fontSize: 11 }} unit="%" />
                  <YAxis dataKey="skill" type="category" tick={{ fill: '#E2E8F0', fontSize: 11 }} width={120} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#FFF', fontSize: '12px' }} 
                    formatter={(val: number) => [`${val}% Demand Rate`, 'Employer Demand']}
                  />
                  <Bar dataKey="demandPercentage" fill="#6366F1" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Quick Skill Cards List */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800">
              {marketData.topHiringSkills.slice(0, 4).map((sk) => (
                <div key={sk.skill} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] space-y-0.5">
                  <div className="font-bold text-white truncate">{sk.skill}</div>
                  <div className="text-emerald-400 font-semibold">{sk.yearOverYearGrowth} YoY</div>
                  <div className="text-slate-400 text-[10px]">{sk.avgSalaryBonus} Premium</div>
                </div>
              ))}
            </div>
          </div>

          {/* Chart 2: Trending Technologies Adoption Momentum */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-indigo-500/20 backdrop-blur-xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-purple-400" />
                  <h3 className="text-base font-extrabold text-white">2. Trending Technologies Momentum</h3>
                </div>
                <p className="text-xs text-slate-400">Multi-year adoption trajectory across tech stacks (2024–2027).</p>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Momentum Score
              </span>
            </div>

            <div className="h-[300px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={marketData.trendingTechnologies} margin={{ left: 0, right: 10, top: 10, bottom: 10 }}>
                  <defs>
                    <linearGradient id="colorMomentum" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#A855F7" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#A855F7" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="technology" tick={{ fill: '#94A3B8', fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={50} />
                  <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#FFF', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="momentumScore" stroke="#C084FC" strokeWidth={3} fillOpacity={1} fill="url(#colorMomentum)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Adoption Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
              {marketData.trendingTechnologies.slice(0, 3).map((tech) => (
                <div key={tech.technology} className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px]">
                  <span className="font-bold text-slate-200">{tech.technology}</span>
                  <span className="px-2 py-0.2 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-semibold">
                    {tech.adoptionLevel}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Section 3 & 4: Popular Careers & Salary Breakdown Charts */}
      {(chartViewFilter === 'All' || chartViewFilter === 'Salaries' || chartViewFilter === 'Trends') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Chart 3: Popular Careers Demand Index */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-indigo-500/20 backdrop-blur-xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-base font-extrabold text-white">3. Popular Careers Openings Index</h3>
                </div>
                <p className="text-xs text-slate-400">Total active job openings & popularity scores.</p>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Live Openings
              </span>
            </div>

            <div className="h-[300px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={marketData.popularCareers} margin={{ left: 0, right: 10, top: 10, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="role" tick={{ fill: '#94A3B8', fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={50} />
                  <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#FFF', fontSize: '12px' }}
                    formatter={(val: number) => [val.toLocaleString(), 'Estimated Openings']}
                  />
                  <Bar dataKey="openingsIndex" fill="#10B981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <p className="text-[11px] text-slate-400 italic text-center">
              💡 Tip: Click any role below to view full career roadmap and top hiring companies.
            </p>
          </div>

          {/* Chart 4: Average Salary Progression by Experience */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-indigo-500/20 backdrop-blur-xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-amber-400" />
                  <h3 className="text-base font-extrabold text-white">4. Average Salary by Experience Level ($ USD)</h3>
                </div>
                <p className="text-xs text-slate-400">Comparing Entry-Level (0-2 yrs), Mid-Level (3-5 yrs), and Senior Tier.</p>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Annual Compensation
              </span>
            </div>

            <div className="h-[300px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={marketData.salaryBreakdowns} margin={{ left: 0, right: 10, top: 10, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="role" tick={{ fill: '#94A3B8', fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={50} />
                  <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#FFF', fontSize: '12px' }}
                    formatter={(val: number) => [`$${val.toLocaleString()}`, 'Salary']}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="entryLevel" name="Entry Level" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="midLevel" name="Mid Level" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="seniorLevel" name="Senior Tier" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
              <span className="text-slate-400">Average Tech Annual Bonus:</span>
              <strong className="text-amber-300 font-extrabold">+$15,000 to +$25,000 / year</strong>
            </div>
          </div>

        </div>
      )}

      {/* Section 5 & 6: Demand Level Distribution & 5-Year Future Scope Radar */}
      {(chartViewFilter === 'All' || chartViewFilter === 'Scope') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Chart 5: Demand Level Market Share Distribution (4 cols) */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-indigo-500/20 backdrop-blur-xl space-y-4 shadow-xl">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-emerald-400" />
                <h3 className="text-base font-extrabold text-white">5. Hiring Demand Level Distribution</h3>
              </div>
              <p className="text-xs text-slate-400">Proportion of job roles classified by demand intensity.</p>
            </div>

            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={marketData.demandLevelDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="percentage"
                    nameKey="level"
                  >
                    {marketData.demandLevelDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#FFF', fontSize: '12px' }}
                    formatter={(val: number) => [`${val}% of Roles`, 'Share']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Demand Legend */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              {marketData.demandLevelDistribution.map((item) => (
                <div key={item.level} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-300 font-semibold">{item.level}</span>
                  </div>
                  <strong className="text-white font-mono">{item.percentage}%</strong>
                </div>
              ))}
            </div>
          </div>

          {/* Chart 6: 5-Year Future Scope Radar Chart (7 cols) */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-indigo-500/20 backdrop-blur-xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-base font-extrabold text-white">6. Future Scope & Resilience Radar (5-Year Outlook)</h3>
                </div>
                <p className="text-xs text-slate-400">Evaluating growth potential, AI resilience, remote flexibility, and entry accessibility.</p>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                2026–2031 Vision
              </span>
            </div>

            <div className="h-[300px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={marketData.futureScopeRadar}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#E2E8F0', fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                  <Radar name="Growth Potential" dataKey="growthPotential" stroke="#6366F1" fill="#6366F1" fillOpacity={0.4} />
                  <Radar name="AI Automation Resilience" dataKey="aiResilience" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#FFF', fontSize: '12px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}

      {/* Popular Careers Interactive Table / Exploration Cards */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-indigo-500/20 backdrop-blur-xl space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-400" />
              <span>Career Role Directory & Action Hub</span>
            </h3>
            <p className="text-xs text-slate-400">Select a popular career path to inspect top hiring companies and jump directly into a personalized roadmap or skill gap analysis.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {marketData.popularCareers.map((car) => (
            <div 
              key={car.role} 
              className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/50 transition-all space-y-4 group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                    car.demandLevel === 'Very High' 
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                  }`}>
                    {car.demandLevel} Demand
                  </span>
                  <span className="text-[11px] font-bold text-emerald-400 font-mono">
                    {car.futureGrowthRate} Growth
                  </span>
                </div>

                <h4 className="text-base font-extrabold text-white group-hover:text-indigo-300 transition-colors">
                  {car.role}
                </h4>

                <div className="space-y-1 text-xs">
                  <div className="text-slate-300 flex items-center justify-between">
                    <span className="text-slate-400">Starting Salary:</span>
                    <strong className="text-white">${car.entrySalary.toLocaleString()}/yr</strong>
                  </div>
                  <div className="text-slate-300 flex items-center justify-between">
                    <span className="text-slate-400">Openings Index:</span>
                    <strong className="text-slate-200">{car.openingsIndex.toLocaleString()}</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Top Hiring Employers:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {car.topEmployers.map((emp) => (
                      <span key={emp} className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] text-slate-300">
                        {emp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
                {onSelectRoleForRoadmap && (
                  <button
                    onClick={() => onSelectRoleForRoadmap(car.role)}
                    className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1 shadow"
                  >
                    <span>View Roadmap</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {onExploreSkillGap && (
                  <button
                    onClick={() => onExploreSkillGap(car.role)}
                    className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1"
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Skill Gap</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
