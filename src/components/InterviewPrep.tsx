import React, { useState } from 'react';
import { 
  Award, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Lightbulb, 
  Users, 
  Cpu, 
  Code2, 
  MessageSquare,
  Terminal,
  Play,
  Check,
  FileCode,
  Layers,
  Sparkle
} from 'lucide-react';
import { InterviewQuestion, AnswerEvaluation } from '../types';

interface InterviewPrepProps {
  onGenerateQuestions: (targetRole: string) => void;
  onEvaluateAnswer: (question: string, userAnswer: string, targetRole: string, category?: string) => void;
  questions: InterviewQuestion[];
  evaluation: AnswerEvaluation | null;
  isGenerating: boolean;
  isEvaluating: boolean;
  targetRole: string;
  setTargetRole: (role: string) => void;
}

type CategoryFilter = 'All' | 'HR' | 'Technical' | 'Coding' | 'Behavioral';

export const InterviewPrep: React.FC<InterviewPrepProps> = ({
  onGenerateQuestions,
  onEvaluateAnswer,
  questions,
  evaluation,
  isGenerating,
  isEvaluating,
  targetRole,
  setTargetRole,
}) => {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluatedQuestionsMap, setEvaluatedQuestionsMap] = useState<Record<string, AnswerEvaluation>>({});

  const presetRoles = [
    'Full-Stack Software Engineer',
    'AI / Machine Learning Engineer',
    'Data Analyst & Architect',
    'Cloud & DevOps Solutions Architect',
    'Associate Product Manager (APM)'
  ];

  // Filter questions by active category
  const filteredQuestions = questions.filter(q => {
    if (activeCategory === 'All') return true;
    return q.category === activeCategory;
  });

  const currentQuestion = filteredQuestions[selectedQuestionIndex] || filteredQuestions[0];

  const handleGenerate = (roleToGenerate: string) => {
    if (!roleToGenerate.trim()) return;
    onGenerateQuestions(roleToGenerate);
    setSelectedQuestionIndex(0);
    setUserAnswer('');
    setEvaluatedQuestionsMap({});
  };

  const handleSelectQuestion = (idx: number, question: InterviewQuestion) => {
    setSelectedQuestionIndex(idx);
    // Pre-fill starter code if it's a coding question and user hasn't typed anything
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

  // Keep track of evaluations per question
  React.useEffect(() => {
    if (evaluation && currentQuestion) {
      setEvaluatedQuestionsMap(prev => ({
        ...prev,
        [currentQuestion.id || currentQuestion.question]: evaluation
      }));
    }
  }, [evaluation, currentQuestion]);

  const currentEvaluation = currentQuestion ? evaluatedQuestionsMap[currentQuestion.id || currentQuestion.question] || evaluation : null;

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'HR':
        return <Users className="w-3.5 h-3.5 text-purple-400" />;
      case 'Technical':
        return <Cpu className="w-3.5 h-3.5 text-blue-400" />;
      case 'Coding':
        return <Code2 className="w-3.5 h-3.5 text-amber-400" />;
      case 'Behavioral':
        return <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-indigo-400" />;
    }
  };

  const getCategoryBadgeClass = (cat: string) => {
    switch (cat) {
      case 'HR':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'Technical':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Coding':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'Behavioral':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      default:
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/50 to-purple-900/40 border border-indigo-500/30 backdrop-blur-xl shadow-2xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Campus Interview & AI Bar Raiser Simulator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Role-Based Interview Question Generator & Evaluator
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Generate structured questions across <strong>HR</strong>, <strong>Technical</strong>, <strong>Coding</strong>, and <strong>Behavioral</strong> categories. Write your answers or code solutions to get instant Gemini AI evaluation scores.
            </p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleGenerate(targetRole); }} className="flex gap-2 shrink-0">
            <input
              type="text"
              required
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="Target Role (e.g. Software Engineer)"
              className="px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 min-w-[200px]"
            />
            <button
              type="submit"
              disabled={isGenerating || !targetRole.trim()}
              className="px-4 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 whitespace-nowrap"
            >
              {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{isGenerating ? 'Generating...' : 'Generate Questions'}</span>
            </button>
          </form>
        </div>

        {/* Preset Career Quick Buttons */}
        <div className="pt-2 border-t border-white/10 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
            Quick Career Selector:
          </span>
          {presetRoles.map((role) => (
            <button
              key={role}
              onClick={() => {
                setTargetRole(role);
                handleGenerate(role);
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${
                targetRole === role
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                  : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Questions Section */}
      {questions.length > 0 && (
        <div className="space-y-6">
          
          {/* Category Tabs Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-2 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex flex-wrap items-center gap-1.5">
              {(['All', 'HR', 'Technical', 'Coding', 'Behavioral'] as CategoryFilter[]).map((cat) => {
                const count = cat === 'All' ? questions.length : questions.filter(q => q.category === cat).length;
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      setSelectedQuestionIndex(0);
                      const firstCatQ = questions.find(q => cat === 'All' || q.category === cat);
                      if (firstCatQ && firstCatQ.category === 'Coding' && firstCatQ.starterCode) {
                        setUserAnswer(firstCatQ.starterCode);
                      } else {
                        setUserAnswer('');
                      }
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    {getCategoryIcon(cat)}
                    <span>{cat} Questions</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-indigo-800 text-white' : 'bg-slate-800 text-slate-400'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="text-xs text-slate-400 px-3 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>Target Role: <strong className="text-white">{targetRole}</strong></span>
            </div>
          </div>

          {/* Main Workspace (Split Navigator & Workspace) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Questions List Sidebar (4 cols) */}
            <div className="lg:col-span-4 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                {activeCategory} Questions ({filteredQuestions.length}):
              </h3>
              <div className="space-y-2.5">
                {filteredQuestions.map((q, idx) => {
                  const isSelected = selectedQuestionIndex === idx;
                  const hasEvaluation = evaluatedQuestionsMap[q.id || q.question];
                  return (
                    <button
                      key={q.id || idx}
                      onClick={() => handleSelectQuestion(idx, q)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all ${
                        isSelected
                          ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-lg ring-1 ring-indigo-400/50'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider mb-1.5">
                        <span className="flex items-center gap-1 text-slate-400">
                          {getCategoryIcon(q.category)}
                          <span>Q{idx + 1}</span>
                        </span>
                        <div className="flex items-center gap-1.5">
                          {hasEvaluation && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-extrabold">
                              Score: {hasEvaluation.score}
                            </span>
                          )}
                          <span className={`px-2 py-0.5 rounded-full border text-[10px] ${getCategoryBadgeClass(q.category)}`}>
                            {q.category}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs font-semibold line-clamp-2 leading-relaxed">
                        {q.question}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Workspace Area (8 cols) */}
            {currentQuestion && (
              <div className="lg:col-span-8 space-y-6">
                
                {/* Active Question Box */}
                <div className="p-6 rounded-3xl bg-slate-900/80 border border-indigo-500/30 backdrop-blur-xl space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${getCategoryBadgeClass(currentQuestion.category)}`}>
                      {getCategoryIcon(currentQuestion.category)}
                      <span>{currentQuestion.category} Question</span>
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      Target Role: {targetRole}
                    </span>
                  </div>

                  <h2 className="text-base sm:text-lg font-extrabold text-white leading-relaxed">
                    "{currentQuestion.question}"
                  </h2>

                  {/* Problem Statement for Coding questions */}
                  {currentQuestion.category === 'Coding' && currentQuestion.problemStatement && (
                    <div className="p-4 rounded-2xl bg-slate-950/70 border border-amber-500/30 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                        <FileCode className="w-4 h-4 text-amber-400" />
                        <span>Problem Specification:</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-mono">
                        {currentQuestion.problemStatement}
                      </p>
                    </div>
                  )}

                  {/* Test Cases for Coding Questions */}
                  {currentQuestion.category === 'Coding' && currentQuestion.testCases && currentQuestion.testCases.length > 0 && (
                    <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-2">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-blue-400" />
                        <span>Sample Test Cases:</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {currentQuestion.testCases.map((tc, tcIdx) => (
                          <div key={tcIdx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 text-[11px] font-mono space-y-1">
                            <div className="text-slate-400"><strong className="text-indigo-300">Input:</strong> {tc.input}</div>
                            <div className="text-slate-400"><strong className="text-emerald-300">Output:</strong> {tc.output}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Coach Hint */}
                  {currentQuestion.hint && (
                    <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 text-xs flex items-start gap-2.5">
                      <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-indigo-300 font-bold mb-0.5">Interview Coach Strategy:</strong>
                        <span>{currentQuestion.hint}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Response / Code Playground Box */}
                <div className="p-6 rounded-3xl bg-slate-900/70 border border-indigo-500/20 backdrop-blur-xl space-y-4 shadow-lg">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-300 flex items-center gap-2">
                      {currentQuestion.category === 'Coding' ? (
                        <>
                          <Code2 className="w-4 h-4 text-amber-400" />
                          <span>Code Editor / Implementation Playground:</span>
                        </>
                      ) : (
                        <>
                          <MessageSquare className="w-4 h-4 text-indigo-400" />
                          <span>Your Response (STAR Method / Concept Explanation):</span>
                        </>
                      )}
                    </label>

                    {currentQuestion.category === 'Coding' && currentQuestion.starterCode && (
                      <button
                        type="button"
                        onClick={() => setUserAnswer(currentQuestion.starterCode || '')}
                        className="text-[11px] font-semibold text-slate-400 hover:text-amber-300 underline"
                      >
                        Reset Starter Code
                      </button>
                    )}
                  </div>

                  <textarea
                    rows={currentQuestion.category === 'Coding' ? 10 : 6}
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder={
                      currentQuestion.category === 'Coding'
                        ? '// Write your algorithmic solution in TypeScript / JavaScript...\nfunction solution() {\n  // Implementation here\n}'
                        : currentQuestion.category === 'HR'
                        ? 'Explain your motivation, personal alignment with company mission, and career vision...'
                        : currentQuestion.category === 'Behavioral'
                        ? 'Situation: During my university software project...\nTask: I was responsible for...\nAction: I took the initiative to...\nResult: We successfully delivered with a 40% performance gain...'
                        : 'Explain the core architectural concepts, trade-offs, and practical execution...'
                    }
                    className={`w-full p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 leading-relaxed ${
                      currentQuestion.category === 'Coding' ? 'font-mono text-amber-200/90' : 'font-sans'
                    }`}
                  />

                  <div className="flex justify-end">
                    <button
                      onClick={handleEvaluate}
                      disabled={isEvaluating || !userAnswer.trim()}
                      className="px-6 py-3 rounded-xl text-xs font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
                    >
                      {isEvaluating ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Gemini Bar Raiser Evaluating...</span>
                        </>
                      ) : (
                        <>
                          {currentQuestion.category === 'Coding' ? <Play className="w-4 h-4 fill-current" /> : <Send className="w-4 h-4" />}
                          <span>Submit Answer for AI Grading</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Gemini Evaluation Result Card */}
                {currentEvaluation && (
                  <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-indigo-500/40 backdrop-blur-xl shadow-2xl space-y-5 animate-fade-in">
                    
                    {/* Score Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${
                          currentEvaluation.score >= 80 ? 'from-emerald-600 to-teal-500' : 'from-amber-600 to-indigo-600'
                        } text-white font-black text-xl flex items-center justify-center shadow-lg`}>
                          {currentEvaluation.score}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-extrabold text-white">Gemini Interview Coach Rating</h4>
                            <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                              {currentQuestion.category} Evaluation
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">Graded on clarity, technical depth, Big-O complexity, and STAR methodology.</p>
                        </div>
                      </div>
                    </div>

                    {/* Strengths & Improvements Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 space-y-2">
                        <h5 className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Answer Strengths:
                        </h5>
                        <ul className="space-y-1.5 text-xs text-slate-300">
                          {currentEvaluation.strengths.map((s, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-emerald-400 mt-0.5">•</span>
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/20 space-y-2">
                        <h5 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 text-amber-400" /> Areas to Polish:
                        </h5>
                        <ul className="space-y-1.5 text-xs text-slate-300">
                          {currentEvaluation.areasForImprovement.map((a, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-amber-400 mt-0.5">•</span>
                              <span>{a}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Specific Category Advice Blocks */}
                    {currentEvaluation.codeQualityAnalysis && (
                      <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-1">
                        <h5 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                          <Terminal className="w-4 h-4 text-amber-400" /> Code Quality & Big-O Complexity:
                        </h5>
                        <p className="text-xs text-slate-200 leading-relaxed font-mono">{currentEvaluation.codeQualityAnalysis}</p>
                      </div>
                    )}

                    {currentEvaluation.technicalFeedback && (
                      <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/30 space-y-1">
                        <h5 className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                          <Cpu className="w-4 h-4 text-blue-400" /> Technical Architecture Feedback:
                        </h5>
                        <p className="text-xs text-slate-200 leading-relaxed">{currentEvaluation.technicalFeedback}</p>
                      </div>
                    )}

                    {currentEvaluation.starFormatSuggestions && (
                      <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-1">
                        <h5 className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                          <Sparkle className="w-4 h-4 text-purple-400" /> STAR Storytelling Advice:
                        </h5>
                        <p className="text-xs text-slate-200 leading-relaxed">{currentEvaluation.starFormatSuggestions}</p>
                      </div>
                    )}

                    {/* Model Answer / Solution */}
                    <div className="space-y-2">
                      <h5 className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-purple-400" /> Exemplary Model Answer / Solution Code:
                      </h5>
                      <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto">
                        {currentEvaluation.modelAnswer}
                      </div>
                    </div>

                  </div>
                )}

              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
};
