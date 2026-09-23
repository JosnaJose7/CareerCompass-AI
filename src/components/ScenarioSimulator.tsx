import React, { useState } from 'react';
import { 
  Sliders, 
  ArrowRight, 
  CheckCircle2, 
  Plus, 
  X, 
  TrendingUp, 
  Check, 
  Database,
  BarChart3,
  Layers,
  Sparkles
} from 'lucide-react';
import { StudentProfile } from '../types';
import { DataSourcesMethodologyModal } from './DataSourcesMethodologyModal';
import { BackButton } from './BackButton';
import { calculate11DimensionReadiness, DIMENSION_LABELS, DIMENSION_WEIGHTS } from '../utils/readinessScoring';
import { fetchWithAuth } from '../lib/api';

interface ScenarioSimulatorProps {
  profile?: StudentProfile;
  assessmentReport?: any;
  onNavigateToRoadmap?: (roleTitle: string) => void;
  onBack?: () => void;
}

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({
  profile,
  assessmentReport,
  onNavigateToRoadmap,
  onBack,
}) => {
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>(['addedAWS', 'addedDocker']);
  const [customSkills, setCustomSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);

  const presets = [
    {
      id: 'addedAWS',
      title: 'What if I learn AWS?',
      description: 'Cloud Practitioner, EC2, S3, IAM, and serverless principles.',
      impact: 'Certifications +28, Tech Skills +6'
    },
    {
      id: 'addedDocker',
      title: 'What if I complete Docker certification?',
      description: 'Docker containerization, multi-stage builds, and microservices packaging.',
      impact: 'Certifications +18, Tech Skills +10'
    },
    {
      id: 'improvedDSA',
      title: 'What if I improve DSA?',
      description: 'Master Data Structures & Algorithms, solve 50+ LeetCode problems.',
      impact: 'Aptitude +15, Tech Skills +8'
    },
    {
      id: 'twoAIProjects',
      title: 'What if I build two AI projects?',
      description: 'Develop production generative AI applications with Gemini API.',
      impact: 'Projects +16, Tech Skills +6'
    },
    {
      id: 'improvedSQL',
      title: 'What if I improve SQL?',
      description: 'Master SQL indexing, query optimization, and schema design.',
      impact: 'Tech Skills +8 (Relational DB)'
    },
    {
      id: 'internshipExperience',
      title: 'What if I complete a summer internship?',
      description: '3 months hands-on software development team experience.',
      impact: 'Projects +18, Work Env +10'
    }
  ];

  const handleToggleScenario = (id: string) => {
    setSelectedScenarios(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillInput.trim() || customSkills.includes(newSkillInput.trim())) return;
    setCustomSkills([...customSkills, newSkillInput.trim()]);
    setNewSkillInput('');
  };

  const handleRemoveCustomSkill = (skill: string) => {
    setCustomSkills(customSkills.filter(s => s !== skill));
  };

  // Base and Simulated Evaluation using genuine 11-Dimensional Holistic Framework
  const baseEvaluation = calculate11DimensionReadiness(assessmentReport?.structuredAssessment || profile || assessmentReport || {});
  
  const simulationModifiers = {
    selectedScenarios,
    customSkills,
    addedAWS: selectedScenarios.includes('addedAWS'),
    addedDocker: selectedScenarios.includes('addedDocker'),
    improvedDSA: selectedScenarios.includes('improvedDSA'),
    twoAIProjects: selectedScenarios.includes('twoAIProjects'),
    improvedSQL: selectedScenarios.includes('improvedSQL'),
    internshipExperience: selectedScenarios.includes('internshipExperience'),
  };

  const simEvaluation = calculate11DimensionReadiness(
    assessmentReport?.structuredAssessment || profile || assessmentReport || {},
    simulationModifiers
  );

  const baseScore = assessmentReport?.readinessScore ?? baseEvaluation.readinessScore;
  const simulatedScore = simulationResult?.updatedReadinessScore ?? simEvaluation.readinessScore;

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    try {
      const activeScenarios = presets.filter(p => selectedScenarios.includes(p.id));
      const res = await fetchWithAuth('/api/gemini/what-if-simulate', {
        method: 'POST',
        body: JSON.stringify({
          scenarios: activeScenarios.map(s => s.title),
          customSkills,
          baseProfile: profile,
          baseScore
        })
      });
      const data = await res.json();
      if (data && (data.updatedReadinessScore || data.simulatedMetrics)) {
        setSimulationResult(data);
      }
    } catch (err) {
      console.error('Error running What-If simulation:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="space-y-2 border-b border-white/[0.08] pb-5">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div className="flex items-start gap-3">
            {onBack && <BackButton onClick={onBack} />}
            <div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-indigo-400 uppercase tracking-wider">
                <Sliders className="w-3.5 h-3.5" />
                <span>Predictive Career Modelling</span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
                "What-If" Scenario Simulator
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Simulate hypothetical skill additions, certifications, or projects to project future career readiness.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsMethodologyOpen(true)}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 shrink-0 transition-colors"
          >
            <Database className="w-3.5 h-3.5 text-indigo-400" />
            <span>Simulation Methodology</span>
          </button>
        </div>
      </div>

      {/* Scenario Presets */}
      <div className="space-y-3">
        <h3 className="text-xs uppercase tracking-wider font-mono text-indigo-400">
          Select Hypothetical Scenarios ({selectedScenarios.length} active)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {presets.map(p => {
            const isSelected = selectedScenarios.includes(p.id);

            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleToggleScenario(p.id)}
                className={`p-3.5 rounded-xl border text-left transition-all flex items-start justify-between gap-3 cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600/15 border-indigo-500/60 shadow-xs'
                    : 'border-white/[0.08] bg-[#131724] text-slate-300 hover:border-white/[0.18]'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{p.title}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                      isSelected ? 'border-indigo-500/40 bg-indigo-500/20 text-indigo-300' : 'border-white/[0.10] bg-white/[0.04] text-slate-400'
                    }`}>
                      {p.impact}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="shrink-0 mt-0.5">
                  {isSelected ? (
                    <div className="w-5 h-5 rounded-md bg-indigo-600 flex items-center justify-center text-white">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-md border border-white/[0.15] bg-[#0E111B] flex items-center justify-center text-slate-400">
                      <Plus className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Skills Input */}
      <div className="space-y-3 pt-2">
        <form onSubmit={handleAddCustomSkill} className="flex gap-2">
          <input
            type="text"
            value={newSkillInput}
            onChange={(e) => setNewSkillInput(e.target.value)}
            placeholder="Add custom skill (e.g. Kubernetes, Rust, GraphQL)"
            className="flex-1 px-3 py-2 rounded-lg border border-white/[0.12] bg-[#131724] text-white text-xs focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg border border-white/[0.12] bg-[#131724] text-xs font-semibold text-slate-200 hover:bg-white/[0.04] transition-colors cursor-pointer"
          >
            + Add Skill
          </button>
        </form>

        {customSkills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {customSkills.map(skill => (
              <span key={skill} className="px-2.5 py-1 rounded-lg border border-white/[0.10] bg-[#131724] text-slate-200 text-xs font-mono inline-flex items-center gap-1.5">
                <span>{skill}</span>
                <button type="button" onClick={() => handleRemoveCustomSkill(skill)} className="text-slate-400 hover:text-rose-400">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Simulation Action & Score Projection */}
      <div className="pt-6 border-t border-white/[0.08] space-y-6">
        
        {/* Score comparison */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-[#131724] border border-white/[0.08]">
          <div>
            <span className="text-xs uppercase tracking-wider font-mono text-indigo-400 block">
              Projected Readiness Score
            </span>
            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-3xl font-mono font-bold text-white">
                {simulatedScore}%
              </span>
              <span className="text-xs font-mono text-slate-400">
                (Base: {baseScore}% → +{simulatedScore - baseScore}% projected gain)
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all inline-flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
          >
            {isSimulating ? (
              <span>Simulating with AI...</span>
            ) : (
              <>
                <span>Run AI Scenario Projection</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        {/* Dimension-Level Impact Breakdown */}
        <div className="p-5 rounded-xl bg-[#131724] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                11-Dimensional Scenario Impact
              </h4>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              {Object.keys(simEvaluation.breakdown).filter(k => simEvaluation.breakdown[k as keyof typeof simEvaluation.breakdown] > baseEvaluation.breakdown[k as keyof typeof baseEvaluation.breakdown]).length} Dimension(s) Upgraded
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {baseEvaluation.dimensionDetails.map(dim => {
              const baseVal = baseEvaluation.breakdown[dim.key];
              const simVal = simEvaluation.breakdown[dim.key];
              const diff = simVal - baseVal;
              const hasChanged = diff > 0;

              return (
                <div
                  key={dim.key}
                  className={`p-3 rounded-lg border text-xs space-y-1.5 transition-colors ${
                    hasChanged
                      ? 'bg-indigo-950/20 border-indigo-500/40'
                      : 'bg-[#0E111B] border-white/[0.05]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-semibold ${hasChanged ? 'text-indigo-200' : 'text-slate-300'}`}>
                      {dim.label}
                    </span>
                    {hasChanged ? (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        +{diff}
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-slate-500">Unchanged</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Base: {baseVal}%</span>
                    <span className={hasChanged ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                      Sim: {simVal}%
                    </span>
                  </div>

                  <div className="w-full bg-white/[0.06] h-1 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        hasChanged ? 'bg-indigo-400' : 'bg-slate-600'
                      }`}
                      style={{ width: `${simVal}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed simulation feedback if returned */}
        {simulationResult && (
          <div className="space-y-3 p-5 rounded-xl bg-[#131724] border border-white/[0.08] text-xs">
            <h4 className="font-mono uppercase tracking-wider text-indigo-400 text-xs font-semibold">
              AI Scenario Analysis
            </h4>
            <p className="text-slate-300 leading-relaxed max-w-3xl">
              {simulationResult.summary || `Adding these capabilities significantly improves your competitive positioning for senior-track software engineering roles.`}
            </p>
          </div>
        )}

      </div>

      <DataSourcesMethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />

    </div>
  );
};
