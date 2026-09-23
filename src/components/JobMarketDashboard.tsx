import React, { useState } from 'react';
import { 
  TrendingUp, 
  Search, 
  ArrowRight,
  BarChart3
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid
} from 'recharts';
import { JobMarketOverview, CareerDemandItem } from '../types';
import { initialJobMarketData } from '../data/jobMarketData';
import { BackButton } from './BackButton';
import { fetchWithAuth } from '../lib/api';

interface JobMarketDashboardProps {
  onSelectRoleForRoadmap?: (roleTitle: string) => void;
  onExploreSkillGap?: (roleTitle: string) => void;
  onBack?: () => void;
}

export const JobMarketDashboard: React.FC<JobMarketDashboardProps> = ({
  onSelectRoleForRoadmap,
  onExploreSkillGap,
  onBack,
}) => {
  const [marketData, setMarketData] = useState<JobMarketOverview>(initialJobMarketData);
  const [selectedSector, setSelectedSector] = useState<string>('Technology & AI Engineering');
  const [customSectorInput, setCustomSectorInput] = useState<string>('');
  const [isFetchingLive, setIsFetchingLive] = useState<boolean>(false);

  const presetSectors = [
    'Technology & AI Engineering',
    'Data Science & Analytics',
    'Cloud & DevOps Solutions',
    'Cybersecurity'
  ];

  const handleFetchSector = async (sectorName: string) => {
    setSelectedSector(sectorName);
    setIsFetchingLive(true);
    try {
      const res = await fetchWithAuth('/api/job-market-insights', {
        method: 'POST',
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

  const salaryChartData = marketData.trendingCareers?.slice(0, 5).map(c => ({
    name: c.title.split(' ')[0] + ' ' + (c.title.split(' ')[1] || ''),
    entry: parseInt(c.salaryEntry?.replace(/[^0-9]/g, '') || '90'),
    experienced: parseInt(c.salaryExperienced?.replace(/[^0-9]/g, '') || '160')
  })) || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      
      {/* 1. Header */}
      <div className="border-b border-white/[0.08] pb-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
          <div className="flex items-start gap-3">
            {onBack && <BackButton onClick={onBack} />}
            <div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-indigo-400 uppercase tracking-wider">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Hiring Trends & Salary Benchmarks</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
                Job Market Intelligence
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time industry hiring trends, compensation benchmarks, and in-demand technical competencies.
              </p>
            </div>
          </div>

          {/* Sector Search */}
          <form onSubmit={handleCustomSearch} className="flex gap-2">
            <input
              type="text"
              value={customSectorInput}
              onChange={(e) => setCustomSectorInput(e.target.value)}
              placeholder="Search sector (e.g. AI)"
              className="px-3 py-1.5 rounded-lg border border-white/[0.12] bg-[#131724] text-white text-xs focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={isFetchingLive}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isFetchingLive ? 'Loading...' : 'Filter'}
            </button>
          </form>
        </div>

        {/* Sector Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {presetSectors.map(sec => (
            <button
              key={sec}
              type="button"
              onClick={() => handleFetchSector(sec)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                selectedSector === sec
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'border border-white/[0.10] bg-[#131724] text-slate-400 hover:border-white/[0.20] hover:text-white'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Top Hiring Skills & In-Demand Roles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Top Hiring Skills */}
        <div className="p-5 sm:p-6 rounded-xl bg-[#131724] border border-white/[0.08] shadow-sm space-y-4">
          <h2 className="text-xs uppercase tracking-wider font-mono text-indigo-400 font-semibold">
            Top In-Demand Skills
          </h2>
          
          <div className="space-y-3.5 text-xs">
            {marketData.topHiringSkills?.slice(0, 6).map((skill, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-slate-200">
                  <span className="font-medium text-white"><span className="text-indigo-400 font-mono">0{idx + 1}.</span> {skill.name}</span>
                  <span className="text-indigo-400 font-mono">{skill.demandPercent}% Demand</span>
                </div>
                <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full transition-all" style={{ width: `${skill.demandPercent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Demand Roles */}
        <div className="p-5 sm:p-6 rounded-xl bg-[#131724] border border-white/[0.08] shadow-sm space-y-4">
          <h2 className="text-xs uppercase tracking-wider font-mono text-indigo-400 font-semibold">
            High-Growth Roles
          </h2>

          <div className="space-y-2.5 text-xs">
            {marketData.trendingCareers?.slice(0, 4).map((career, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-[#0E111B] border border-white/[0.06] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">{career.title}</span>
                  <span className="text-[11px] font-mono text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{career.growthRate}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400 pt-1 text-[11px]">
                  <span>{career.salaryEntry} - {career.salaryExperienced}</span>
                  {onSelectRoleForRoadmap && (
                    <button
                      type="button"
                      onClick={() => onSelectRoleForRoadmap(career.title)}
                      className="font-medium text-indigo-400 hover:text-indigo-300 cursor-pointer flex items-center gap-1 transition-colors"
                    >
                      <span>Roadmap</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 3. Salary Distribution Chart */}
      <div className="p-5 sm:p-6 rounded-xl bg-[#131724] border border-white/[0.08] shadow-sm space-y-4">
        <h2 className="text-xs uppercase tracking-wider font-mono text-indigo-400 font-semibold">
          Salary Benchmarks (USD in Thousands)
        </h2>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salaryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.06)" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#131724', 
                  borderColor: 'rgba(255, 255, 255, 0.12)', 
                  color: '#ffffff',
                  fontSize: '12px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                }} 
              />
              <Bar dataKey="entry" fill="#475569" radius={[4, 4, 0, 0]} name="Entry Level ($k)" />
              <Bar dataKey="experienced" fill="#6366f1" radius={[4, 4, 0, 0]} name="Experienced ($k)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
