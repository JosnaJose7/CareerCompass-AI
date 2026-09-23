import React, { useState } from 'react';
import { 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ArrowRight, 
  Code2, 
  Award, 
  BookOpen,
  Mic,
  Volume2,
  Sparkles,
  MessageSquare,
  Zap,
  Layers,
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { InterviewQuestion, AnswerEvaluation } from '../types';
import { BackButton } from './BackButton';

interface InterviewPrepProps {
  onGenerateQuestions: (targetRole: string) => void;
  onEvaluateAnswer: (question: string, userAnswer: string, targetRole: string, category?: string) => void;
  questions: InterviewQuestion[];
  evaluation: AnswerEvaluation | null;
  isGenerating: boolean;
  isEvaluating: boolean;
  targetRole: string;
  setTargetRole: (role: string) => void;
  onBack?: () => void;
}

type CategoryFilter = 'All' | 'Technical' | 'Behavioral' | 'Coding' | 'HR' | 'System Design';

export const InterviewPrep: React.FC<InterviewPrepProps> = ({
  onGenerateQuestions,
  onEvaluateAnswer,
  questions,
  evaluation,
  isGenerating,
  isEvaluating,
  targetRole,
  setTargetRole,
  onBack,
}) => {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [evaluatedQuestionsMap, setEvaluatedQuestionsMap] = useState<Record<string, AnswerEvaluation>>({});

  const filteredQuestions = questions.filter(q => {
    if (activeCategory === 'All') return true;
    return q.category?.toLowerCase() === activeCategory.toLowerCase();
  });

  const currentQuestion = filteredQuestions[selectedQuestionIndex] || filteredQuestions[0] || questions[0];

  const handleGenerate = (roleToGenerate: string) => {
    if (!roleToGenerate.trim()) return;
    onGenerateQuestions(roleToGenerate);
    setSelectedQuestionIndex(0);
    setUserAnswer('');
    setEvaluatedQuestionsMap({});
  };

  const handleSelectQuestion = (idx: number, question: InterviewQuestion) => {
    setSelectedQuestionIndex(idx);
    if (question.category === 'Coding' && question.starterCode) {
      setUserAnswer(question.starterCode);
    } else {
      setUserAnswer('');
    }
  };

  const handleEvaluate = () => {
    if (!currentQuestion || !userAnswer.trim()) return;
    onEvaluateAnswer(currentQuestion.question, userAnswer, targetRole, currentQuestion.category);
  };

  React.useEffect(() => {
    if (evaluation && currentQuestion) {
      setEvaluatedQuestionsMap(prev => ({
        ...prev,
        [currentQuestion.id || currentQuestion.question]: evaluation
      }));
    }
  }, [evaluation, currentQuestion]);

  const currentEvaluation = currentQuestion ? evaluatedQuestionsMap[currentQuestion.id || currentQuestion.question] || evaluation : null;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      
      {/* Header Bar */}
      <div className="border-b border-white/[0.08] pb-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            {onBack && <BackButton onClick={onBack} />}
            <div>
              <div className="flex items-center gap-2 text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                <Award className="w-3.5 h-3.5" />
                <span>AI Mock Interview Simulator & Answer Critique</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
                Interview Preparation Lab
              </h1>
              <p className="text-xs text-slate-400">
                Simulate real technical, behavioral (STAR), and live coding interviews with Gemini recruiter grading.
              </p>
            </div>
          </div>

          {/* Target Role & Generator */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="Target Role"
              className="px-3 py-2 rounded-lg bg-[#0E111B] border border-white/[0.12] text-white text-xs"
            />
            <button
              type="button"
              onClick={() => handleGenerate(targetRole)}
              disabled={isGenerating}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-xs transition-all whitespace-nowrap cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? 'Generating...' : 'Refresh Question Bank'}
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1">
          {(['All', 'Technical', 'Behavioral', 'Coding', 'HR', 'System Design'] as CategoryFilter[]).map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setActiveCategory(cat);
                setSelectedQuestionIndex(0);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2-COLUMN MOCK INTERVIEW LAB: QUESTION BANK & ACTIVE ARENA */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Question Bank Sidebar (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-1">
            <span>Question Bank ({filteredQuestions.length})</span>
            <span className="font-mono text-[11px]">{targetRole}</span>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredQuestions.map((q, idx) => {
              const isSelected = (filteredQuestions[selectedQuestionIndex] || filteredQuestions[0])?.question === q.question;
              const hasEvaluation = !!evaluatedQuestionsMap[q.id || q.question];

              return (
                <div
                  key={q.id || idx}
                  onClick={() => handleSelectQuestion(idx, q)}
                  className={`p-3 rounded-xl border text-xs transition-all cursor-pointer space-y-1.5 ${
                    isSelected 
                      ? 'bg-indigo-500/15 border-indigo-500/40 text-white shadow-xs' 
                      : 'bg-[#131724] border-white/[0.08] text-slate-300 hover:border-white/[0.16] hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase text-indigo-400">
                      {q.category || 'Technical'}
                    </span>
                    {hasEvaluation && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                        <Check className="w-3 h-3" />
                        <span>Graded</span>
                      </span>
                    )}
                  </div>
                  <p className="line-clamp-2 leading-relaxed font-medium">
                    {q.question}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Question & Answer Sandbox (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {currentQuestion ? (
            <div className="p-6 rounded-xl bg-[#131724] border border-white/[0.08] space-y-5 shadow-sm">
              
              {/* Question Header */}
              <div className="space-y-2 border-b border-white/[0.06] pb-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                    {currentQuestion.category || 'Technical'} &bull; Difficulty: {currentQuestion.difficulty || 'Mid-Senior'}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Candidate Prompt
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                  {currentQuestion.question}
                </h3>
              </div>

              {/* Input Area (Text or Voice Mode) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-white uppercase text-[11px] tracking-wider">
                    Your Response
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsRecording(!isRecording);
                      if (!isRecording && !userAnswer) {
                        setUserAnswer("In my previous internship at Campus Tech Lab, I encountered high query latency during peak hours. I spearheaded the database indexing audit, analyzed slow queries using EXPLAIN ANALYZE, and restructured 4 composite indexes, which reduced median latency by 68%.");
                      }
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                      isRecording 
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse' 
                        : 'bg-white/[0.04] text-slate-300 border border-white/[0.08] hover:text-white'
                    }`}
                  >
                    <Mic className="w-3 h-3" />
                    <span>{isRecording ? 'Listening (Simulated)...' : 'Dictate Answer'}</span>
                  </button>
                </div>

                <textarea
                  value={userAnswer}
                  onChange={e => setUserAnswer(e.target.value)}
                  rows={6}
                  className="w-full p-4 rounded-xl bg-[#0E111B] border border-white/[0.12] text-white text-xs leading-relaxed font-sans"
                  placeholder="Structure your answer using STAR (Situation, Task, Action, Result) or discuss trade-offs..."
                />
              </div>

              {/* Evaluate Button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleEvaluate}
                  disabled={isEvaluating || !userAnswer.trim()}
                  className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isEvaluating ? 'Evaluating with Recruiter Criteria...' : 'Evaluate Answer'}</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="p-8 text-center bg-[#131724] rounded-xl border border-white/[0.08] text-slate-400 text-xs">
              Select a question from the question bank to start practicing.
            </div>
          )}

          {/* AI Feedback Report Panel */}
          {currentEvaluation && (
            <div className="p-6 rounded-xl bg-[#131724] border border-white/[0.08] space-y-5 shadow-sm animate-in fade-in duration-200">
              
              {/* Score & Verdict */}
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider block">Recruiter Evaluation</span>
                  <h4 className="text-base font-bold text-white mt-0.5">Performance Breakdown</h4>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-extrabold text-white font-mono leading-none">
                    {currentEvaluation.score || 88}<span className="text-xs text-slate-400 font-mono">/100</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Strong Candidate</span>
                </div>
              </div>

              {/* 4 Feedback Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                
                {/* Clarity & STAR Structure */}
                <div className="p-4 rounded-lg bg-[#0E111B] border border-white/[0.06] space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Structure & STAR Flow</span>
                  <p className="text-slate-300 leading-relaxed">
                    {currentEvaluation.structureFeedback || 'Clear logical sequencing with explicit cause-and-effect progression.'}
                  </p>
                </div>

                {/* Technical Accuracy */}
                <div className="p-4 rounded-lg bg-[#0E111B] border border-white/[0.06] space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Technical Precision</span>
                  <p className="text-slate-300 leading-relaxed">
                    {currentEvaluation.technicalAccuracyFeedback || 'Demonstrated exact domain terminology and practical architectural nuance.'}
                  </p>
                </div>

              </div>

              {/* Missing Points & Suggested Ideal Answer */}
              <div className="p-4 rounded-lg bg-[#0E111B] border border-white/[0.06] space-y-2 text-xs">
                <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider block">Suggested Recruiter-Grade Answer</span>
                <p className="text-slate-200 italic leading-relaxed">
                  &ldquo;{currentEvaluation.suggestedAnswer || 'In my previous role, I resolved query bottlenecks by deploying read replicas and setting up compound B-tree indexes, improving response latency by 45%.'}&rdquo;
                </p>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
