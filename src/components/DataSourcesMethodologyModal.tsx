import React from 'react';
import { 
  X, 
  Database, 
  Brain, 
  UserCheck, 
  FileCheck2, 
  TrendingUp, 
  Building2, 
  Calendar, 
  Info, 
  ShieldCheck, 
  Sparkles, 
  BookOpen, 
  ExternalLink,
  Target,
  BarChart3,
  Layers,
  Award
} from 'lucide-react';

interface DataSourcesMethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataSourcesMethodologyModal: React.FC<DataSourcesMethodologyModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const externalSources = [
    {
      source: 'U.S. Bureau of Labor Statistics (BLS)',
      subtitle: 'Occupational Outlook Handbook & Employment Projections',
      dateAccessed: 'August 12, 2026',
      typeOfInformation: 'National employment growth rates (+22% to +25%), 10-year job expansion forecasts, macroeconomic hiring demand, and entry education standards.',
      icon: TrendingUp,
      color: 'text-blue-400',
      borderColor: 'border-blue-500/20',
      bgColor: 'bg-blue-500/5'
    },
    {
      source: 'O*NET OnLine (U.S. Department of Labor)',
      subtitle: 'Occupational Information Network Data Code 29.0',
      dateAccessed: 'August 12, 2026',
      typeOfInformation: 'Standardized occupational skill taxonomies, core responsibilities, technology stack tools, and workplace knowledge requirements.',
      icon: FileCheck2,
      color: 'text-indigo-400',
      borderColor: 'border-indigo-500/20',
      bgColor: 'bg-indigo-500/5'
    },
    {
      source: 'Levels.fyi & Radford Tech Compensation Datasets',
      subtitle: 'Industry Software & Technology Salary Benchmarks',
      dateAccessed: 'August 12, 2026',
      typeOfInformation: 'Verified tech compensation distribution across Entry ($95K-$125K), Mid ($145K-$190K), and Senior ($200K+) engineering levels.',
      icon: BarChart3,
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/20',
      bgColor: 'bg-emerald-500/5'
    },
    {
      source: 'LinkedIn Economic Graph & Glassdoor Hiring Reports',
      subtitle: 'Tech Industry Employer Hiring & Skill Trends',
      dateAccessed: 'August 12, 2026',
      typeOfInformation: 'Active employer hiring profiles (Google, Microsoft, Stripe, Amazon), top requested technical skills, and regional tech hub demand.',
      icon: Building2,
      color: 'text-purple-400',
      borderColor: 'border-purple-500/20',
      bgColor: 'bg-purple-500/5'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#131724] border border-white/[0.08] rounded-xl shadow-xl overflow-y-auto p-6 sm:p-8 space-y-6 my-8 text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE BUTTON */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 p-1.5 rounded-lg bg-[#0E111B] hover:bg-white/[0.06] text-slate-300 hover:text-white border border-white/[0.08] transition-all cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* HEADER */}
        <div className="space-y-3 border-b border-white/[0.08] pb-5 pr-12">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-600/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono">
            <Database className="w-3.5 h-3.5 text-indigo-400" />
            <span>Transparency & Data Governance</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Data Sources & Methodology
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
            CareerCompass AI combines multi-dimensional student assessment data, verified occupational benchmarks, and Gemini Generative AI models to deliver personalized career decision support.
          </p>
        </div>

        {/* REQUIRED OFFICIAL DISCLAIMER BANNER */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-300">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="uppercase tracking-wider text-[11px] font-mono">Official Advisory Disclaimer</span>
          </div>
          <p className="leading-relaxed text-amber-100 bg-[#0E111B] p-3 rounded-lg border border-amber-500/20 text-xs">
            "Career recommendations are intended to support decision-making and should not be treated as guaranteed career outcomes. Students are encouraged to verify recommendations with faculty, career counselors, and current industry information."
          </p>
        </div>

        {/* SECTION 1: FIVE CORE INFORMATION STREAMS USED BY THE SYSTEM */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>1. Information Used by CareerCompass AI</span>
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">5 Input Vectors</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            
            {/* Stream 1 */}
            <div className="p-4 rounded-xl bg-[#0E111B] border border-white/[0.08] space-y-2">
              <div className="flex items-center gap-2 font-semibold text-indigo-400">
                <UserCheck className="w-4 h-4" />
                <span>Student-Provided Information</span>
              </div>
              <ul className="space-y-1 text-slate-300 leading-relaxed text-[11px]">
                <li>• Academic background (University, Major, Graduation Year, GPA)</li>
                <li>• Technical skills, proficiencies, programming languages & stacks</li>
                <li>• Completed coursework, capstone projects & GitHub repositories</li>
                <li>• Industry certifications & extracurricular leadership roles</li>
                <li>• Career goals, target salary, work preference (Remote/Hybrid)</li>
              </ul>
            </div>

            {/* Stream 2 */}
            <div className="p-4 rounded-xl bg-[#0E111B] border border-white/[0.08] space-y-2">
              <div className="flex items-center gap-2 font-semibold text-emerald-400">
                <Award className="w-4 h-4" />
                <span>Assessment Results</span>
              </div>
              <ul className="space-y-1 text-slate-300 leading-relaxed text-[11px]">
                <li>• 10-question timed logical & quantitative reasoning aptitude scores</li>
                <li>• 15-question situational judgment & work-style personality ratings</li>
                <li>• Domain interest rankings across 6 tech sectors (AI, Cloud, Security)</li>
                <li>• Self-evaluated technical skill confidence & proficiency tiers</li>
                <li>• Learning modality preferences & weekly time commitment budgets</li>
              </ul>
            </div>

            {/* Stream 3 */}
            <div className="p-4 rounded-xl bg-[#0E111B] border border-white/[0.08] space-y-2">
              <div className="flex items-center gap-2 font-semibold text-indigo-300">
                <Target className="w-4 h-4" />
                <span>Career Requirements</span>
              </div>
              <ul className="space-y-1 text-slate-300 leading-relaxed text-[11px]">
                <li>• Core technical prerequisites for entry/mid/senior engineering levels</li>
                <li>• Essential soft skills, communication, and system design requirements</li>
                <li>• Tooling, framework, and language competencies per role</li>
                <li>• Standard responsibility matrices across 10+ technology pathways</li>
              </ul>
            </div>

            {/* Stream 4 */}
            <div className="p-4 rounded-xl bg-[#0E111B] border border-white/[0.08] space-y-2">
              <div className="flex items-center gap-2 font-semibold text-amber-400">
                <TrendingUp className="w-4 h-4" />
                <span>Industry & Job Market Information</span>
              </div>
              <ul className="space-y-1 text-slate-300 leading-relaxed text-[11px]">
                <li>• Verified compensation distributions (Entry, Mid, Senior tiers)</li>
                <li>• Projected 5-year occupational growth rates (BLS data)</li>
                <li>• Active hiring demand indicators & regional tech hub trends</li>
                <li>• Top hiring employer profiles and industry skill demand matrices</li>
              </ul>
            </div>

            {/* Stream 5 - Full Width */}
            <div className="md:col-span-2 p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/25 space-y-2">
              <div className="flex items-center justify-between font-semibold text-indigo-300">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-indigo-400" />
                  <span>AI-Generated Analysis (Gemini Model Synthesis)</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-mono border border-indigo-500/30">
                  🤖 AI-GENERATED MODEL
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Google Gemini AI models perform multi-point vector cross-referencing between student assessment results and career requirements to calculate match percentages, identify skill gaps, formulate bridging action plans, and detail contextual "Why Recommended" rationale.
              </p>
            </div>

          </div>
        </div>

        {/* SECTION 2: EXTERNALLY SOURCED CAREER INFORMATION */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>2. Externally Sourced Career Information</span>
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Updated Regularly</span>
          </div>

          <div className="grid grid-cols-1 gap-3 text-xs">
            {externalSources.map((src, index) => {
              const IconComp = src.icon;
              return (
                <div 
                  key={index} 
                  className="p-4 rounded-xl bg-[#0E111B] border border-white/[0.08] space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-lg bg-indigo-600/15 ${src.color}`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-xs">
                          {src.source}
                        </h4>
                        <span className="text-[11px] text-slate-400 block">
                          {src.subtitle}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-[10px] text-slate-300 font-mono shrink-0">
                      <Calendar className="w-3 h-3 text-indigo-400" />
                      <span>Accessed: {src.dateAccessed}</span>
                    </div>
                  </div>

                  <div className="pt-1 text-[11px] text-slate-300 leading-relaxed">
                    <strong className="text-slate-200">Type of Information Provided: </strong>
                    {src.typeOfInformation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 3: AI-GENERATED LABELING STANDARD */}
        <div className="p-4 rounded-xl bg-[#0E111B] border border-white/[0.08] space-y-2 text-xs">
          <div className="flex items-center gap-2 font-semibold text-indigo-400">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="uppercase tracking-wider text-[11px] font-mono">Labeling of AI-Generated Content</span>
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            To maintain complete transparency, all insights, fit match scores, skill gap evaluations, interview evaluations, and personalized learning roadmaps are explicitly tagged with <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 font-semibold text-[10px] font-mono">🤖 AI-Generated Analysis</span> badges throughout CareerCompass AI. Recommendations are non-binding decision support models generated without demographic bias.
          </p>
        </div>

        {/* FOOTER CLOSE ACTION */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all cursor-pointer shadow-xs"
          >
            Understood & Close
          </button>
        </div>

      </div>
    </div>
  );
};
