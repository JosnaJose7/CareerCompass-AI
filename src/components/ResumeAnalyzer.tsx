import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  Zap, 
  Award,
  RefreshCw,
  Upload,
  FileCheck,
  X,
  BookOpen,
  BarChart3,
  Layers,
  HelpCircle,
  Code2,
  TrendingUp,
  CheckCircle,
  Lightbulb
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { ResumeAnalysisResult } from '../types';

// Configure pdfjs worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

interface ResumeAnalyzerProps {
  onAnalyze: (resumeText: string, targetRole: string, pdfBase64?: string) => void;
  analysis: ResumeAnalysisResult | null;
  isAnalyzing: boolean;
}

const SAMPLE_RESUME_TEXT = `
ALEX CHEN
Computer Science Senior | Stanford University
Email: alex.chen@stanford.edu | GitHub: github.com/alexchen | LinkedIn: linkedin.com/in/alexchen

EDUCATION
Stanford University - B.S. in Computer Science (GPA: 3.8 / 4.0)
Relevant Coursework: Data Structures & Algorithms, Operating Systems, Machine Learning, Web Applications.

EXPERIENCE & PROJECTS
Software Engineering Intern - Campus Tech Lab (Summer 2025)
- Developed features for student portal using React and JavaScript.
- Worked with backend team on API integrations and database bug fixes.
- Fixed UI bugs and improved loading times for student dashboard.

AI Code Assistant Chrome Extension (Course Project)
- Built a Chrome Extension using Gemini API that explains code snippets on GitHub.
- Created popup interface in React and TypeScript.
- Wrote documentation and README on GitHub repository.

SKILLS
Programming: Python, TypeScript, JavaScript, SQL, C++, HTML/CSS
Frameworks & Tools: React, Node.js, Express, Git, Docker, VS Code
`;

export const ResumeAnalyzer: React.FC<ResumeAnalyzerProps> = ({
  onAnalyze,
  analysis,
  isAnalyzing,
}) => {
  const [resumeText, setResumeText] = useState(SAMPLE_RESUME_TEXT);
  const [targetRole, setTargetRole] = useState('Full-Stack Software Engineer');
  const [pdfBase64, setPdfBase64] = useState<string | undefined>(undefined);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileSize, setUploadedFileSize] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState<number>(SAMPLE_RESUME_TEXT.trim().split(/\s+/).length);
  const [isExtractingPDF, setIsExtractingPDF] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'ats' | 'grammar' | 'skills' | 'projects' | 'suggestions'>('overview');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = async (file: File) => {
    if (!file) return;

    setUploadedFileName(file.name);
    setUploadedFileSize(`${(file.size / 1024).toFixed(1)} KB`);

    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      setIsExtractingPDF(true);
      try {
        const arrayBuffer = await file.arrayBuffer();

        // Convert to base64 for server processing fallback
        const base64 = btoa(
          new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
        setPdfBase64(base64);

        // Client-side extraction via pdfjs
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
          setWordCount(extracted.trim().split(/\s+/).length);
        }
      } catch (err) {
        console.error('Error parsing PDF on client:', err);
      } finally {
        setIsExtractingPDF(false);
      }
    } else {
      // Text / DOCX file reading
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string || '';
        setResumeText(content);
        setWordCount(content.trim().split(/\s+/).length);
      };
      reader.readAsText(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileProcess(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileProcess(file);
  };

  const handleRemoveFile = () => {
    setUploadedFileName(null);
    setUploadedFileSize(null);
    setPdfBase64(undefined);
    setResumeText(SAMPLE_RESUME_TEXT);
    setWordCount(SAMPLE_RESUME_TEXT.trim().split(/\s+/).length);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim() || !targetRole.trim()) return;
    onAnalyze(resumeText, targetRole, pdfBase64);
  };

  const handleCopyRewrite = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyKeyword = (keyword: string) => {
    navigator.clipboard.writeText(keyword);
    setCopiedKeyword(keyword);
    setTimeout(() => setCopiedKeyword(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/50 to-purple-900/40 border border-indigo-500/30 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full PDF Parsing & Recruiter Audit Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              AI Resume & Portfolio Analyzer
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1 leading-relaxed">
              Upload your PDF resume to calculate your <strong>Resume Score</strong>, <strong>ATS Score</strong>, <strong>Grammar Check</strong>, <strong>Skills Breakdown</strong>, <strong>Missing Keywords</strong>, and <strong>Project Quantification</strong>.
            </p>
          </div>

          <button
            onClick={() => {
              handleRemoveFile();
              setResumeText(SAMPLE_RESUME_TEXT);
            }}
            className="px-3.5 py-2 rounded-2xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all flex items-center gap-1.5 shrink-0"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Load Sample Student Resume</span>
          </button>
        </div>
      </div>

      {/* Upload & Form Container */}
      <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-slate-900/60 border border-indigo-500/20 backdrop-blur-xl space-y-6">
        
        {/* Target Position & Submit Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Target Position / Job Title</label>
            <input
              type="text"
              required
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Full-Stack Software Engineer, AI/ML Engineer, Data Analyst"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-end justify-end">
            <button
              type="submit"
              disabled={isAnalyzing || isExtractingPDF || !resumeText.trim()}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Auditing Resume & ATS Match...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Resume for {targetRole}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* PDF Upload Dropzone */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-2">Upload PDF Resume or Paste Resume Text</label>
          
          {uploadedFileName ? (
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-indigo-500/40 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center shrink-0">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{uploadedFileName}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      {isExtractingPDF ? 'Extracting...' : 'PDF Loaded'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {uploadedFileSize} • Approx. {wordCount} words extracted
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRemoveFile}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
                title="Remove uploaded file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 sm:p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all text-center space-y-2 ${
                isDragging 
                  ? 'border-indigo-400 bg-indigo-500/10' 
                  : 'border-slate-800 hover:border-indigo-500/40 bg-slate-950/40'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Upload className="w-6 h-6" />
              </div>

              <div>
                <span className="text-xs font-bold text-indigo-300 hover:underline">
                  Click to upload PDF / Document
                </span>
                <span className="text-xs text-slate-400"> or drag and drop your file here</span>
              </div>
              <p className="text-[10px] text-slate-500">
                Supports PDF, DOCX, TXT (Max 10MB). Text is parsed automatically for instant AI analysis.
              </p>
            </div>
          )}
        </div>

        {/* Text Area for Resume Content */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-slate-400">Extracted / Editable Resume Content</label>
            <span className="text-[10px] text-slate-500 font-mono">{wordCount} words</span>
          </div>
          <textarea
            rows={8}
            required
            value={resumeText}
            onChange={(e) => {
              setResumeText(e.target.value);
              setWordCount(e.target.value.trim().split(/\s+/).length);
            }}
            placeholder="Paste or edit your resume text here..."
            className="w-full p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-indigo-500 leading-relaxed"
          />
        </div>
      </form>

      {/* Analysis Output Section */}
      {analysis && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Executive Overall Score Hero Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-indigo-500/30 backdrop-blur-xl shadow-2xl space-y-6">
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-white/10">
              
              {/* Dual Score Dials */}
              <div className="flex items-center gap-4 sm:gap-6">
                
                {/* Overall Resume Score */}
                <div className="relative flex flex-col items-center justify-center w-28 h-28 rounded-3xl bg-gradient-to-tr from-blue-950 via-indigo-950 to-purple-950 border-2 border-indigo-400 text-white shadow-xl shrink-0">
                  <span className="text-3xl font-black text-indigo-300">{analysis.resumeScore || 85}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Resume Score</span>
                </div>

                {/* ATS Score */}
                <div className="relative flex flex-col items-center justify-center w-28 h-28 rounded-3xl bg-gradient-to-tr from-slate-950 to-indigo-950 border-2 border-emerald-500 text-white shadow-xl shrink-0">
                  <span className="text-3xl font-black text-emerald-400">{analysis.atsScore}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">ATS Match</span>
                </div>

              </div>

              {/* Summary Text */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[11px] font-bold">
                    Target Role: {analysis.targetRole}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                    (analysis.resumeScore || 85) >= 80 
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}>
                    {(analysis.resumeScore || 85) >= 80 ? '🌟 Highly Competitive Candidate' : '⚠️ Action Items Needed'}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-white">
                  Audit Executive Summary
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {analysis.overallSummary}
                </p>
              </div>

            </div>

            {/* Category Scores Progress Bars */}
            {analysis.categoryScores && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {analysis.categoryScores.map((cat, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-300">{cat.category}</span>
                      <span className="font-black text-indigo-400">{cat.score}/100</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          cat.score >= 85 ? 'bg-emerald-400' : cat.score >= 70 ? 'bg-indigo-400' : 'bg-amber-400'
                        }`} 
                        style={{ width: `${cat.score}%` }} 
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-2">
                      {cat.feedback}
                    </p>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* Interactive Analysis Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-white/10 scrollbar-none">
            {[
              { id: 'overview', label: 'Overview & Strengths', icon: BarChart3 },
              { id: 'ats', label: 'ATS & Keywords', icon: Sparkles },
              { id: 'grammar', label: 'Grammar & Tone', icon: BookOpen },
              { id: 'skills', label: 'Skills Audit', icon: Code2 },
              { id: 'projects', label: 'Projects Audit', icon: Layers },
              { id: 'suggestions', label: 'Bullet Rewrites & Tips', icon: Award },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                      : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: OVERVIEW & STRENGTHS */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Key Strengths */}
              <div className="p-6 rounded-3xl bg-slate-900/60 border border-indigo-500/20 backdrop-blur-xl space-y-4">
                <h4 className="text-xs font-extrabold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Key Resume Strengths Recognized:
                </h4>
                <ul className="space-y-2.5 text-xs text-slate-200">
                  {analysis.keyStrengths.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                      <span className="text-emerald-400 font-bold shrink-0">✓</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Format Action Items */}
              <div className="p-6 rounded-3xl bg-slate-900/60 border border-indigo-500/20 backdrop-blur-xl space-y-4">
                <h4 className="text-xs font-extrabold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  Format & Structure Action Items:
                </h4>
                <ul className="space-y-2.5 text-xs text-slate-200">
                  {analysis.formatActionItems.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                      <span className="text-indigo-400 font-bold shrink-0">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: ATS & KEYWORDS */}
          {activeTab === 'ats' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-slate-900/60 border border-indigo-500/20 backdrop-blur-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    Missing ATS Keywords for {analysis.targetRole}:
                  </h4>
                  <span className="text-[11px] text-slate-400">Click keyword to copy to clipboard</span>
                </div>

                <div className="flex flex-wrap gap-2.5 pt-1">
                  {analysis.missingKeywords.map((kw, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleCopyKeyword(kw)}
                      className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-200 text-xs font-semibold transition-all flex items-center gap-1.5 group"
                    >
                      <span>+ {kw}</span>
                      {copiedKeyword === kw ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GRAMMAR & TONE */}
          {activeTab === 'grammar' && analysis.grammar && (
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-indigo-500/20 backdrop-blur-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-white">Grammar & Tone Evaluation</h4>
                    <p className="text-xs text-slate-400">{analysis.grammar.toneAndClarity}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-2xl font-black text-indigo-300">{analysis.grammar.score}</span>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Grammar Score</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Detected Phrasing & Grammar Feedback ({analysis.grammar.issuesFound} Items):
                </span>
                <div className="space-y-2.5">
                  {analysis.grammar.grammarFeedback.map((fb, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
                      <span className="text-indigo-400 font-bold shrink-0 mt-0.5">💡</span>
                      <span>{fb}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SKILLS AUDIT */}
          {activeTab === 'skills' && analysis.skills && (
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-indigo-500/20 backdrop-blur-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/30 text-purple-300 flex items-center justify-center">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-white">Skills Section Breakdown</h4>
                    <p className="text-xs text-slate-400">Estimated Proficiency: <strong className="text-indigo-300">{analysis.skills.skillLevelEstimate}</strong></p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Languages */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider block">Programming Languages:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.skills.identifiedSkills.map((sk, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-200 text-xs font-medium border border-indigo-500/20">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Frameworks */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-purple-300 uppercase tracking-wider block">Frameworks & Tools:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.skills.technicalStack.map((st, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-200 text-xs font-medium border border-purple-500/20">
                        {st}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Soft Skills */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">Soft Skills & Workflow:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.skills.softSkills.map((sf, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-200 text-xs font-medium border border-emerald-500/20">
                        {sf}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PROJECTS AUDIT */}
          {activeTab === 'projects' && analysis.projects && (
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-indigo-500/20 backdrop-blur-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-500/30 text-blue-300 flex items-center justify-center">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-white">Project Section Audit</h4>
                    <p className="text-xs text-slate-400">Project Quality Score: <strong className="text-blue-300">{analysis.projects.projectScore}/100</strong></p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strengths */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">Project Strengths:</span>
                  <div className="space-y-2">
                    {analysis.projects.strengths.map((s, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200 flex items-center gap-2">
                        <span>✓</span>
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weaknesses */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">Areas to Improve:</span>
                  <div className="space-y-2">
                    {analysis.projects.weaknesses.map((w, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-center gap-2">
                        <span>!</span>
                        <span>{w}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quantification Tips */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider block">💡 How to Quantify Project Impact:</span>
                <div className="space-y-2">
                  {analysis.projects.impactQuantificationTips.map((tip, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-900 text-xs text-slate-300">
                      • {tip}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: BULLET REWRITES & SUGGESTIONS */}
          {activeTab === 'suggestions' && (
            <div className="space-y-6">
              
              {/* AI Bullet Point Rewrite Recommendations */}
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-indigo-500/20 backdrop-blur-xl space-y-6">
                <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                  <Award className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-base font-bold text-white">AI-Quantified Bullet Point Rewrite Suggestions</h3>
                </div>

                <div className="space-y-4">
                  {analysis.bulletPointImprovements.map((item, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                      
                      {/* Original */}
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Original Bullet:</span>
                        <p className="text-xs text-slate-400 font-mono italic p-2 rounded-lg bg-slate-900 border border-slate-800">
                          "{item.original}"
                        </p>
                      </div>

                      {/* Improved */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">AI High-Impact Rewrite:</span>
                          <button
                            type="button"
                            onClick={() => handleCopyRewrite(item.improved, idx)}
                            className="flex items-center gap-1 text-[11px] font-bold text-indigo-300 hover:text-white"
                          >
                            {copiedIndex === idx ? (
                              <span className="text-emerald-400 flex items-center gap-1"><Check className="w-3 h-3" /> Copied!</span>
                            ) : (
                              <span className="flex items-center gap-1"><Copy className="w-3 h-3" /> Copy Rewrite</span>
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-emerald-200 font-mono font-medium p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                          • {item.improved}
                        </p>
                      </div>

                      {/* Reason */}
                      <p className="text-[11px] text-slate-400 italic">
                        💡 <strong>Recruiter Note:</strong> {item.reason}
                      </p>

                    </div>
                  ))}
                </div>
              </div>

              {/* General Suggestions */}
              {analysis.suggestions && analysis.suggestions.length > 0 && (
                <div className="p-6 rounded-3xl bg-slate-900/60 border border-indigo-500/20 backdrop-blur-xl space-y-3">
                  <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    General Suggestions to Boost Callback Rate:
                  </h4>
                  <div className="space-y-2">
                    {analysis.suggestions.map((sug, idx) => (
                      <div key={idx} className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-100 flex items-start gap-2">
                        <span className="font-bold text-indigo-400 shrink-0 mt-0.5">•</span>
                        <span>{sug}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      )}

    </div>
  );
};
