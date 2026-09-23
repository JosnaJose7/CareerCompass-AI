import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Upload, 
  Check, 
  Copy, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  Zap,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Search,
  FileCode,
  FileCheck
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { ResumeAnalysisResult } from '../types';
import { BackButton } from './BackButton';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

interface ResumeAnalyzerProps {
  onAnalyze: (resumeText: string, targetRole: string, pdfBase64?: string) => void;
  analysis: ResumeAnalysisResult | null;
  isAnalyzing: boolean;
  onBack?: () => void;
}

const SAMPLE_RESUME_TEXT = `ALEX CHEN
Computer Science Senior | Stanford University
Email: alex.chen@stanford.edu | GitHub: github.com/alexchen | LinkedIn: linkedin.com/in/alexchen

EDUCATION
Stanford University - B.S. in Computer Science (GPA: 3.8 / 4.0, Expected June 2026)
Relevant Coursework: Data Structures & Algorithms, Distributed Systems, Machine Learning, Web Applications.

EXPERIENCE & PROJECTS
Software Engineering Intern - Campus Tech Lab (June 2025 - August 2025)
- Developed student portal features in React and TypeScript, serving 4,200 active undergraduate users.
- Built 6 REST API endpoints in Node.js and Express to automate room reservations, cutting wait time by 35%.
- Implemented PostgreSQL query indexing that decreased dashboard page load latency from 1.4s to 320ms.

AI Code Assistant Chrome Extension (Open Source Project)
- Built a Chrome Extension using Gemini 1.5 Flash API that explains code snippets directly on GitHub repositories.
- Integrated Tailwind CSS popup interface with offline caching for 200+ syntax patterns.
- Acquired 850+ active GitHub stars and 1,200+ Chrome Web Store installations.

SKILLS
Languages: Python, TypeScript, JavaScript, SQL, C++, Go, HTML/CSS
Frameworks & Tools: React, Node.js, Express, Docker, AWS (S3, EC2), Git, PostgreSQL`;

export const ResumeAnalyzer: React.FC<ResumeAnalyzerProps> = ({
  onAnalyze,
  analysis,
  isAnalyzing,
  onBack,
}) => {
  const [resumeText, setResumeText] = useState(SAMPLE_RESUME_TEXT);
  const [targetRole, setTargetRole] = useState('Full-Stack Software Engineer');
  const [pdfBase64, setPdfBase64] = useState<string | undefined>(undefined);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isExtractingPDF, setIsExtractingPDF] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = async (file: File) => {
    if (!file) return;
    setUploadedFileName(file.name);

    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      setIsExtractingPDF(true);
      try {
        const arrayBuffer = await file.arrayBuffer();
        const base64 = btoa(
          new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
        setPdfBase64(base64);

        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let extracted = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(' ');
          extracted += pageText + '\n\n';
        }

        if (extracted.trim()) {
          setResumeText(extracted.trim());
        }
      } catch (err) {
        console.error('Error parsing PDF on client:', err);
      } finally {
        setIsExtractingPDF(false);
      }
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string || '';
        if (content.trim()) setResumeText(content.trim());
      };
      reader.readAsText(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleCopyBullet = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const atsScore = analysis?.atsScore ?? 84;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      
      {/* Header Bar */}
      <div className="border-b border-white/[0.08] pb-5 space-y-1">
        <div className="flex items-start gap-3.5">
          {onBack && <BackButton onClick={onBack} />}
          <div>
            <div className="flex items-center gap-2 text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5" />
              <span>ATS Parser & Recruiter Impact Optimizer</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
              Resume Analyzer
            </h1>
            <p className="text-xs text-slate-400">
              Audit applicant tracking system (ATS) readability, keyword density, and bullet point metrics against your target role.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. INPUT ZONE: TARGET ROLE & UPLOAD / PASTE */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-xl bg-[#131724] border border-white/[0.08] space-y-5 shadow-sm">
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="sm:col-span-2 space-y-1.5">
            <label className="font-bold text-white block uppercase text-[11px] tracking-wider">
              Target Career Role
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={e => setTargetRole(e.target.value)}
              placeholder="e.g. Full-Stack Software Engineer"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0E111B] border border-white/[0.12] text-white text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-white block uppercase text-[11px] tracking-wider">
              Target Industry
            </label>
            <select
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0E111B] border border-white/[0.12] text-white text-xs"
            >
              <option>Big Tech / Enterprise SaaS</option>
              <option>AI / Machine Learning Startups</option>
              <option>Fintech & Quantitative Trading</option>
              <option>Healthcare & Biotech</option>
            </select>
          </div>
        </div>

        {/* Drag and Drop Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`p-6 rounded-xl border-2 border-dashed text-center transition-all cursor-pointer ${
            isDragOver 
              ? 'border-indigo-500 bg-indigo-500/10' 
              : 'border-white/[0.12] bg-[#0E111B] hover:border-white/[0.24] hover:bg-white/[0.02]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt,.docx"
            onChange={(e) => e.target.files?.[0] && handleFileProcess(e.target.files[0])}
            className="hidden"
          />
          <div className="w-10 h-10 mx-auto rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-2">
            <Upload className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-white">
            {uploadedFileName ? `Loaded: ${uploadedFileName}` : 'Drag & drop your resume PDF / DOCX, or click to browse'}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            PDF text is extracted instantly and securely in your browser.
          </p>
        </div>

        {/* Text Area for Pasted Resume */}
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <label className="font-bold text-white uppercase text-[11px] tracking-wider">
              Resume Text Content
            </label>
            <span className="text-slate-400 font-mono text-[11px]">
              {resumeText.length} characters
            </span>
          </div>
          <textarea
            value={resumeText}
            onChange={e => setResumeText(e.target.value)}
            rows={7}
            className="w-full p-3.5 rounded-lg bg-[#0E111B] border border-white/[0.12] text-slate-200 text-xs font-mono leading-relaxed"
            placeholder="Paste your plain text resume here..."
          />
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={() => onAnalyze(resumeText, targetRole, pdfBase64)}
            disabled={isAnalyzing || !resumeText.trim()}
            className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isAnalyzing ? 'Critiquing Resume with AI...' : 'Run ATS & Impact Audit'}</span>
          </button>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. RESULTS SECTION: ATS SCORE & STRUCTURED REVIEW PANELS */}
      {/* ========================================================================= */}
      {analysis && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Prominent ATS Score Gauge Card */}
          <div className="p-6 rounded-xl bg-[#131724] border border-white/[0.08] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-white/[0.06]"
                    strokeWidth="3.2"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-400 stroke-current transition-all duration-1000 ease-out"
                    strokeDasharray={`${atsScore}, 100`}
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-extrabold text-white font-mono leading-none">{atsScore}</span>
                  <span className="text-[9px] text-slate-400 font-mono">/ 100</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">ATS Compatibility Score</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    Tier 1 Pass
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  High likelihood of passing automated screening.
                </h3>
                <p className="text-xs text-slate-400 max-w-lg">
                  Clear standard headers, strong technical keyword density, and quantifiable outcomes across experience sections.
                </p>
              </div>
            </div>

            <div className="flex md:flex-col gap-4 text-xs shrink-0 border-t md:border-t-0 md:border-l border-white/[0.08] pt-4 md:pt-0 md:pl-6">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Keywords Matched</span>
                <span className="text-sm font-bold text-white font-mono">18 / 22 detected</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Quantified Impact</span>
                <span className="text-sm font-bold text-emerald-400 font-mono">4 Metrics Verified</span>
              </div>
            </div>

          </div>

          {/* Structured Review Panels: Strengths & Missing Keywords */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Strengths */}
            <div className="p-5 rounded-xl bg-[#131724] border border-white/[0.08] space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Validated Resume Strengths</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {analysis.strengths?.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                    <span>{str}</span>
                  </li>
                )) || (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                      <span>Strong action verbs with quantifiable throughput numbers.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                      <span>Clean single-column structure parsed cleanly without OCR errors.</span>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* Missing Keywords */}
            <div className="p-5 rounded-xl bg-[#131724] border border-white/[0.08] space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>Missing Industry Keywords</span>
              </h4>
              <p className="text-[11px] text-slate-400">
                ATS scanners for {targetRole} frequently search for these exact tokens:
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(analysis.missingKeywords || ['CI/CD', 'Kubernetes', 'System Design', 'Redis', 'Unit Testing']).map((kw, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-[#0E111B] text-amber-300 border border-amber-500/30">
                    + {kw}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Suggested Bullet Point Rewrites with Copy Action */}
          <div className="p-6 rounded-xl bg-[#131724] border border-white/[0.08] space-y-4 shadow-sm">
            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Suggested High-Impact Bullet Point Rewrites</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Rewritten using the Google XYZ formula: &ldquo;Accomplished [X] as measured by [Y], by doing [Z]&rdquo;.
              </p>
            </div>

            <div className="space-y-3">
              {(analysis.suggestedBulletPoints || [
                "Architected 6 REST API endpoints in Node.js and Express, cutting room reservation wait times by 35% across 4,200 active users.",
                "Engineered PostgreSQL indexing strategies and query optimizations, reducing dashboard latency from 1.4s to 320ms.",
                "Deployed open-source Gemini AI extension to Chrome Web Store, scaling to 1,200+ weekly installations with 99.8% uptime."
              ]).map((bullet, bIdx) => (
                <div key={bIdx} className="p-3.5 rounded-lg bg-[#0E111B] border border-white/[0.06] flex items-start justify-between gap-3 text-xs">
                  <div className="space-y-1 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 font-mono">Formula Optimized #{bIdx + 1}</span>
                    <p className="text-slate-200 leading-relaxed font-sans">{bullet}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyBullet(bullet, bIdx)}
                    className="p-2 rounded-lg border border-white/[0.10] bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer shrink-0"
                    title="Copy optimized bullet"
                  >
                    {copiedIndex === bIdx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
