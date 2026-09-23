import React, { useState, useEffect } from 'react';
import { CareerCard } from './CareerCard';
import { DataSourcesMethodologyModal } from './DataSourcesMethodologyModal';
import { ScenarioSimulator } from './ScenarioSimulator';
import { BackButton } from './BackButton';
import {
  Compass,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Clock,
  BookOpen,
  Award,
  BarChart3,
  Brain,
  Sliders,
  RotateCcw,
  Plus,
  Trash2,
  TrendingUp,
  Briefcase,
  Layers,
  Info,
  Database,
  History,
  AlertCircle
} from 'lucide-react';
import { User } from 'firebase/auth';
import { db, doc, setDoc, addDoc, collection, getDocs, query, where } from '../lib/firebase';
import { fetchWithAuth } from '../lib/api';
import {
  AssessmentResponses,
  AssessmentReport,
  AssessmentProject,
  AssessmentCertification,
  AptitudeQuestion
} from '../types';
import { calculate11DimensionReadiness, DIMENSION_LABELS, DIMENSION_WEIGHTS } from '../utils/readinessScoring';

// Standard 10 Aptitude Test Questions
const SAMPLE_APTITUDE_QUESTIONS: AptitudeQuestion[] = [
  {
    id: 'q1',
    category: 'Logical Reasoning',
    question: 'If all Coders are Problem Solvers, and some Problem Solvers are Designers, which of the following statements MUST be true?',
    options: [
      'All Designers are Coders',
      'Some Coders may be Designers',
      'No Coders are Designers',
      'All Problem Solvers are Coders'
    ],
    correctAnswer: 1,
    explanation: 'Since some problem solvers are designers and all coders are problem solvers, there is an intersection overlap where some coders may be designers.'
  },
  {
    id: 'q2',
    category: 'Logical Reasoning',
    question: 'Complete the sequence: 2, 6, 12, 20, 30, ?',
    options: ['36', '40', '42', '48'],
    correctAnswer: 2,
    explanation: 'The differences between consecutive terms are +4, +6, +8, +10, so the next difference is +12. 30 + 12 = 42.'
  },
  {
    id: 'q3',
    category: 'Quantitative Aptitude',
    question: 'A server processes 150 requests per minute. If server capacity is increased by 40%, how many requests can it process in 2.5 hours?',
    options: ['22,500', '31,500', '26,250', '30,000'],
    correctAnswer: 1,
    explanation: 'New rate = 150 * 1.4 = 210 requests/min. Total minutes = 2.5 * 60 = 150 mins. Total requests = 210 * 150 = 31,500.'
  },
  {
    id: 'q4',
    category: 'Quantitative Aptitude',
    question: 'The probability of a bug occurring in a module is 0.2. What is the probability that at least one bug occurs across 2 independent modules?',
    options: ['0.36', '0.40', '0.04', '0.64'],
    correctAnswer: 0,
    explanation: 'P(at least 1 bug) = 1 - P(no bugs) = 1 - (0.8 * 0.8) = 1 - 0.64 = 0.36.'
  },
  {
    id: 'q5',
    category: 'Verbal Ability',
    question: 'Choose the word most nearly OPPOSITE in meaning to "OBSOLETE":',
    options: ['Outdated', 'Contemporary', 'Archived', 'Redundant'],
    correctAnswer: 1,
    explanation: 'Obsolete means no longer produced or used; out of date. Contemporary means living or modern.'
  },
  {
    id: 'q6',
    category: 'Verbal Ability',
    question: 'Identify the sentence with correct grammatical structure and technical clarity:',
    options: [
      'The developer refactored the database, which reduced latency by 40%.',
      'Having refactored the database, latency was reduced by 40% by the developer.',
      'The database refactored by the developer reduced 40% of latency.',
      'Refactoring the database, 40% latency was reduced by developer.'
    ],
    correctAnswer: 0,
    explanation: 'Option A has clear active subject-verb agreement without dangling modifiers.'
  },
  {
    id: 'q7',
    category: 'Problem Solving',
    question: 'An API endpoint experiences high latency due to database read locks. Which architectural pattern best mitigates this?',
    options: [
      'Implement an in-memory Redis cache layer with read-through strategy',
      'Increase client-side retry interval to 10 seconds',
      'Convert all GET requests to synchronous POST requests',
      'Remove database primary key indexes'
    ],
    correctAnswer: 0,
    explanation: 'In-memory caching serves read requests without hitting database disk locks.'
  },
  {
    id: 'q8',
    category: 'Problem Solving',
    question: 'In a microservices architecture, how do you handle data consistency across independent databases without distributed transactions?',
    options: [
      'Saga Pattern with compensating events',
      'Monolithic database merger',
      'Ignore consistency errors',
      'Synchronous RPC chaining'
    ],
    correctAnswer: 0,
    explanation: 'The Saga Pattern manages distributed transactions via a sequence of local transactions and compensating events.'
  },
  {
    id: 'q9',
    category: 'Basic Programming',
    question: 'What is the worst-case time complexity of searching for an item in an unsorted array vs a Hash Table?',
    options: [
      'Array: O(N), Hash Table: O(N)',
      'Array: O(1), Hash Table: O(N)',
      'Array: O(N log N), Hash Table: O(1)',
      'Array: O(N), Hash Table: O(1) average / O(N) worst'
    ],
    correctAnswer: 3,
    explanation: 'Searching an unsorted array takes O(N) linear time. A Hash Table offers O(1) average lookup, but worst-case O(N) if all keys collide.'
  },
  {
    id: 'q10',
    category: 'Basic Programming',
    question: 'What will be the output of the code `[1, 2, 3].map(x => x * 2).reduce((a, b) => a + b, 0)`?',
    options: ['6', '12', '18', '24'],
    correctAnswer: 1,
    explanation: '[1, 2, 3] mapped with x*2 becomes [2, 4, 6]. Sum is 2 + 4 + 6 = 12.'
  }
];

const PERSONALITY_SCENARIOS = [
  { id: 'p1', trait: 'Deep Analytical Work', question: 'I enjoy spending hours debugging complex, intricate code architectures without interruption.' },
  { id: 'p2', trait: 'Collaborative Problem Solving', question: 'I prefer brainstorming system architectures in a team over solo implementation.' },
  { id: 'p3', trait: 'User-Centric Design', question: 'I care deeply about how visual aesthetics, intuitive ergonomics, and latency affect end-users.' },
  { id: 'p4', trait: 'Algorithmic Optimization', question: 'I am excited by reducing time complexity from O(N^2) to O(N log N) or memory footprints.' },
  { id: 'p5', trait: 'System Reliability & Infrastructure', question: 'I enjoy setting up automated CI/CD pipelines, container orchestration, and server resilience.' }
];

interface CareerAssessmentProps {
  user: User | null;
  profile: any;
  onOpenAuth: () => void;
  onNavigateToRoadmap?: (roleTitle: string) => void;
  onBack?: () => void;
}

export const CareerAssessment: React.FC<CareerAssessmentProps> = ({
  user,
  profile,
  onOpenAuth,
  onNavigateToRoadmap,
  onBack
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<AssessmentResponses>({
    personalInfo: {
      fullName: user?.displayName || 'Alex Morgan',
      university: profile?.university || 'Stanford University',
      department: profile?.major || 'Computer Science & Engineering',
      semester: 'Semester 6',
      cgpa: profile?.gpa || '3.8',
      preferredLocation: 'San Francisco, CA / Remote'
    },
    careerGoals: {
      targetRole: 'Full-Stack Software Engineer',
      dreamCompany: 'Google, Stripe, OpenAI',
      postGradGoal: 'Immediate High-Growth Job Placement',
      expectedSalary: '$90,000 - $130,000 / year'
    },
    technicalSkills: {
      languages: ['Python', 'TypeScript', 'SQL', 'JavaScript'],
      frameworks: ['React', 'Node.js', 'Express', 'Tailwind CSS'],
      tools: ['Git', 'Docker', 'PostgreSQL', 'VS Code'],
      skillProficiency: {
        Python: 4,
        TypeScript: 4,
        React: 4,
        'Node.js': 3,
        SQL: 3
      }
    },
    projectExperience: [
      {
        id: 'p1',
        name: 'AI Code Assistant Chrome Extension',
        techStack: 'React, TypeScript, Gemini API',
        description: 'Built a browser extension that explains complex code snippets on GitHub in real time.'
      }
    ],
    certifications: [
      {
        id: 'c1',
        title: 'AWS Certified Developer Associate',
        provider: 'Amazon Web Services',
        year: '2025'
      }
    ],
    interests: ['Artificial Intelligence & ML', 'Programming & Software Architecture', 'Tech Startups & Product Strategy'],
    personality: { p1: 4, p2: 5, p3: 4, p4: 4, p5: 3 },
    learningStyle: {
      methods: ['Building Hands-on Portfolio Projects', 'Interactive Video Tutorials'],
      timeCommitment: '10 - 15 Hours / Week'
    },
    aptitudeTest: {
      answers: {},
      score: 0,
      totalQuestions: 10,
      timeSpentSeconds: 0
    },
    domainPreferences: ['Full-Stack Web Development', 'AI / Machine Learning Systems'],
    workEnvironment: {
      companySize: 'Mid-sized tech or high-growth startup',
      workStyle: 'Hybrid (2 days office, 3 days remote)',
      riskTolerance: 'Balanced'
    },
    selfEvaluation: {
      codingConfidence: 4,
      systemDesignConfidence: 3,
      problemSolvingConfidence: 4,
      communicationConfidence: 4
    }
  });

  const [report, setReport] = useState<AssessmentReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [savedHistory, setSavedHistory] = useState<any[]>([]);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);
  const [testTimeSeconds, setTestTimeSeconds] = useState<number>(600);
  const [isTestActive, setIsTestActive] = useState<boolean>(false);

  // Steps
  const STEP_TITLES = [
    'Introduction',
    'Academic Background',
    'Career Goals',
    'Technical Skills',
    'Projects & Experience',
    'Certifications',
    'Interests',
    'Work Style Scenarios',
    'Learning Style',
    'Timed Aptitude Test',
    'Domain Preferences',
    'Work Environment',
    'Self-Evaluation',
    'Review & Generate'
  ];

  // Timer for Aptitude
  useEffect(() => {
    let timer: any;
    if (isTestActive && testTimeSeconds > 0) {
      timer = setInterval(() => setTestTimeSeconds(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isTestActive, testTimeSeconds]);

  const calculateAptitudeScore = () => {
    let correct = 0;
    SAMPLE_APTITUDE_QUESTIONS.forEach(q => {
      if (formData.aptitudeTest?.answers?.[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    setFormData(prev => ({
      ...prev,
      aptitudeTest: {
        ...prev.aptitudeTest!,
        score: correct,
        timeSpentSeconds: 600 - testTimeSeconds
      }
    }));
    return correct;
  };

  const handleGenerateReport = async () => {
    setIsAnalyzing(true);
    try {
      const aptScore = calculateAptitudeScore();
      const res = await fetchWithAuth('/api/gemini/career-assessment', {
        method: 'POST',
        body: JSON.stringify({ responses: formData, aptitudeScore: aptScore })
      });
      const data = await res.json();
      if (data && data.topRecommendations) {
        setReport(data);
      }
    } catch (err) {
      console.error('Error generating assessment report:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleResetAssessment = () => {
    setCurrentStep(1);
    setReport(null);
    setTestTimeSeconds(600);
    setIsTestActive(false);
  };

  const handleNextStep = () => {
    if (currentStep === 10) {
      calculateAptitudeScore();
      setIsTestActive(false);
    }
    if (currentStep < 14) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleGenerateReport();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const toggleArrayItem = (list: string[], item: string) => {
    if (list.includes(item)) {
      return list.filter(i => i !== item);
    } else {
      return [...list, item];
    }
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* 1. Top Level Header */}
      <div className="space-y-2 border-b border-white/[0.08] pb-5">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div className="flex items-start gap-3">
            {onBack && <BackButton onClick={onBack} />}
            <div>
              <div className="flex items-center gap-2 text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                <Brain className="w-3.5 h-3.5" />
                <span>Intelligence Diagnostic Matrix</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
                Career Assessment Diagnostic
              </h1>
              <p className="text-xs text-slate-400">
                14-step multi-dimensional evaluation of technical competencies, work scenarios, and aptitude.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsMethodologyOpen(true)}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Methodology</span>
            </button>
            {report && (
              <button
                type="button"
                onClick={handleResetAssessment}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Diagnostic</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. REPORT VIEW (When Complete) */}
      {report ? (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* Executive Summary */}
          <div className="p-6 rounded-xl bg-[#131724] border border-white/[0.08] space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-400">
                Diagnostic Results Synthesized
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">
                Readiness Score: {report.readinessScore}%
              </span>
            </div>

            <div className="space-y-1.5">
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Executive Profile Summary
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                {report.summary}
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden mt-3">
              <div
                className="bg-indigo-500 h-full"
                style={{ width: `${report.readinessScore}%` }}
              />
            </div>
          </div>

          {/* 11-Dimensional Holistic Evaluation Framework Breakdown */}
          {(() => {
            const computed = calculate11DimensionReadiness(formData || profile);
            const activeBreakdown = report.readinessBreakdown || computed.breakdown;
            return (
              <div className="p-6 rounded-xl bg-[#131724] border border-white/[0.08] space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-indigo-400" />
                      <h3 className="text-sm font-bold text-white tracking-tight">
                        11-Dimensional Holistic Evaluation Framework
                      </h3>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Calibrated multi-dimensional assessment. Normalized 0–100 scale, weights strictly total 100%.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-slate-400">Readiness Index:</span>
                    <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                      {report.readinessScore}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {computed.dimensionDetails.map(dim => {
                    const score = activeBreakdown[dim.key] ?? dim.score;
                    return (
                      <div
                        key={dim.key}
                        className="p-3.5 rounded-lg bg-[#0E111B] border border-white/[0.06] space-y-2 hover:border-white/[0.12] transition-colors"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-200">{dim.label}</span>
                          <span className="font-mono font-bold text-white">{score}<span className="text-[10px] text-slate-500 font-normal">/100</span></span>
                        </div>
                        <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              score >= 85
                                ? 'bg-emerald-400'
                                : score >= 70
                                ? 'bg-indigo-400'
                                : 'bg-amber-400'
                            }`}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span>Weight: {(dim.weight * 100).toFixed(0)}%</span>
                          <span className="font-mono text-indigo-300">
                            Contrib: +{(score * dim.weight).toFixed(1)} pts
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-tight">
                          {dim.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Top Recommendations */}
          <div className="space-y-4">
            <h2 className="text-xs uppercase tracking-wider font-bold text-slate-400">
              Matched Career Pathways ({report.topRecommendations?.length || 0})
            </h2>

            <div className="space-y-4">
              {report.topRecommendations?.map((rec, index) => (
                <CareerCard
                  key={rec.id || index}
                  recommendation={rec}
                  rankIndex={index}
                  onNavigateToRoadmap={onNavigateToRoadmap}
                />
              ))}
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-[#131724] border border-white/[0.08] space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Validated Strengths</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                {report.strengthsAndWeaknesses?.strengths?.map((str, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">&bull;</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-[#131724] border border-white/[0.08] space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Areas for Development</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                {report.strengthsAndWeaknesses?.weaknesses?.map((weak, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">&bull;</span>
                    <span>{weak}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* What-If Simulator Section */}
          <div className="pt-4">
            <ScenarioSimulator
              profile={profile}
              assessmentReport={report}
              onNavigateToRoadmap={onNavigateToRoadmap}
            />
          </div>

        </div>
      ) : (
        /* 3. STEP-BY-STEP WORKFLOW */
        <div className="p-6 rounded-xl bg-[#131724] border border-white/[0.08] space-y-6 shadow-sm">
          
          {/* Step Indicator Header */}
          <div className="space-y-2 border-b border-white/[0.06] pb-4">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Step {currentStep} of 14</span>
              <span className="text-white font-sans font-semibold">{STEP_TITLES[currentStep - 1]}</span>
            </div>
            <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-500 h-full transition-all duration-200" 
                style={{ width: `${(currentStep / 14) * 100}%` }}
              />
            </div>
          </div>

          {/* Step 1: Intro */}
          {currentStep === 1 && (
            <div className="space-y-5 py-2">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Comprehensive Career Assessment Diagnostic
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                  This multi-step diagnostic evaluates your academic profile, skill competencies, project background, personality factors, and aptitude for tailored career guidance.
                </p>
              </div>

              <div className="space-y-3 pt-2 text-xs text-slate-300">
                <div className="p-3 rounded-lg bg-[#0E111B] border border-white/[0.06] flex items-start gap-3">
                  <span className="font-mono font-bold text-indigo-400">01.</span>
                  <div>
                    <strong className="text-white">Academic & Technical Matrix:</strong> Specify your degree, core languages, frameworks, and portfolio projects.
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[#0E111B] border border-white/[0.06] flex items-start gap-3">
                  <span className="font-mono font-bold text-indigo-400">02.</span>
                  <div>
                    <strong className="text-white">Scenario & Aptitude Diagnostic:</strong> Complete 5 work-style scenarios and a 10-question timed aptitude assessment.
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[#0E111B] border border-white/[0.06] flex items-start gap-3">
                  <span className="font-mono font-bold text-indigo-400">03.</span>
                  <div>
                    <strong className="text-white">Actionable Report & Projection:</strong> Receive verified match percentages, skill gap matrix, and roadmap milestones.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Academic Background */}
          {currentStep === 2 && (
            <div className="space-y-5 py-2">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white">Academic Background</h2>
                <p className="text-xs text-slate-400">Provide your university degree and status.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Full Name</label>
                  <input
                    type="text"
                    value={formData.personalInfo?.fullName || ''}
                    onChange={e => setFormData({ ...formData, personalInfo: { ...formData.personalInfo!, fullName: e.target.value } })}
                    className="w-full px-3 py-2 rounded-lg border border-white/[0.12] bg-[#0E111B] text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">University</label>
                  <input
                    type="text"
                    value={formData.personalInfo?.university || ''}
                    onChange={e => setFormData({ ...formData, personalInfo: { ...formData.personalInfo!, university: e.target.value } })}
                    className="w-full px-3 py-2 rounded-lg border border-white/[0.12] bg-[#0E111B] text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Major / Department</label>
                  <input
                    type="text"
                    value={formData.personalInfo?.department || ''}
                    onChange={e => setFormData({ ...formData, personalInfo: { ...formData.personalInfo!, department: e.target.value } })}
                    className="w-full px-3 py-2 rounded-lg border border-white/[0.12] bg-[#0E111B] text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Semester / Year</label>
                  <select
                    value={formData.personalInfo?.semester || 'Semester 6'}
                    onChange={e => setFormData({ ...formData, personalInfo: { ...formData.personalInfo!, semester: e.target.value } })}
                    className="w-full px-3 py-2 rounded-lg border border-white/[0.12] bg-[#0E111B] text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Semester 1">Semester 1 (Year 1)</option>
                    <option value="Semester 2">Semester 2 (Year 1)</option>
                    <option value="Semester 3">Semester 3 (Year 2)</option>
                    <option value="Semester 4">Semester 4 (Year 2)</option>
                    <option value="Semester 5">Semester 5 (Year 3)</option>
                    <option value="Semester 6">Semester 6 (Year 3)</option>
                    <option value="Semester 7">Semester 7 (Year 4)</option>
                    <option value="Semester 8">Semester 8 (Year 4)</option>
                    <option value="Graduated">Graduated / Post-Graduate</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Career Goals */}
          {currentStep === 3 && (
            <div className="space-y-5 py-2">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white">Career Goals & Aspirations</h2>
                <p className="text-xs text-slate-400">Define your target roles and post-graduation focus.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Target Role</label>
                  <input
                    type="text"
                    value={formData.careerGoals?.targetRole || ''}
                    onChange={e => setFormData({ ...formData, careerGoals: { ...formData.careerGoals!, targetRole: e.target.value } })}
                    placeholder="e.g. Software Engineer, Machine Learning Engineer"
                    className="w-full px-3 py-2 rounded-lg border border-white/[0.12] bg-[#0E111B] text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Target Companies</label>
                  <input
                    type="text"
                    value={formData.careerGoals?.dreamCompany || ''}
                    onChange={e => setFormData({ ...formData, careerGoals: { ...formData.careerGoals!, dreamCompany: e.target.value } })}
                    placeholder="e.g. Google, Stripe, OpenAI"
                    className="w-full px-3 py-2 rounded-lg border border-white/[0.12] bg-[#0E111B] text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Technical Skills */}
          {currentStep === 4 && (
            <div className="space-y-5 py-2">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white">Technical Skills</h2>
                <p className="text-xs text-slate-400">Select the programming languages and frameworks you use.</p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="space-y-2">
                  <label className="font-semibold text-slate-300 block">Programming Languages</label>
                  <div className="flex flex-wrap gap-2">
                    {['Python', 'TypeScript', 'JavaScript', 'SQL', 'Java', 'C++', 'Go', 'Rust', 'Kotlin'].map(lang => {
                      const isSel = formData.technicalSkills?.languages?.includes(lang);
                      return (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => {
                            const updated = toggleArrayItem(formData.technicalSkills?.languages || [], lang);
                            setFormData({ ...formData, technicalSkills: { ...formData.technicalSkills!, languages: updated } });
                          }}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                            isSel
                              ? 'bg-indigo-600 text-white border-indigo-500 shadow-xs'
                              : 'border-white/[0.10] bg-[#0E111B] text-slate-300 hover:border-white/[0.20]'
                          }`}
                        >
                          {lang}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="font-semibold text-slate-300 block">Frameworks & Tools</label>
                  <div className="flex flex-wrap gap-2">
                    {['React', 'Node.js', 'Express', 'Tailwind CSS', 'Docker', 'PostgreSQL', 'Git', 'Next.js', 'PyTorch'].map(tool => {
                      const isSel = formData.technicalSkills?.frameworks?.includes(tool);
                      return (
                        <button
                          key={tool}
                          type="button"
                          onClick={() => {
                            const updated = toggleArrayItem(formData.technicalSkills?.frameworks || [], tool);
                            setFormData({ ...formData, technicalSkills: { ...formData.technicalSkills!, frameworks: updated } });
                          }}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                            isSel
                              ? 'bg-indigo-600 text-white border-indigo-500 shadow-xs'
                              : 'border-white/[0.10] bg-[#0E111B] text-slate-300 hover:border-white/[0.20]'
                          }`}
                        >
                          {tool}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Projects & Experience */}
          {currentStep === 5 && (
            <div className="space-y-5 py-2">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-lg font-bold text-white">Projects & Experience</h2>
                  <p className="text-xs text-slate-400">Key capstone or side projects you have built.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newP: AssessmentProject = {
                      id: Date.now().toString(),
                      name: 'New Project',
                      techStack: 'React, Node.js',
                      description: 'Project description...',
                      isDeployed: false,
                      isTeam: false,
                      difficulty: 'Intermediate'
                    };
                    setFormData({ ...formData, projectExperience: [...(formData.projectExperience || []), newP] });
                  }}
                  className="px-3 py-1.5 rounded-lg border border-white/[0.12] bg-[#0E111B] text-xs font-semibold text-slate-200 hover:bg-white/[0.04]"
                >
                  + Add Project
                </button>
              </div>

              <div className="space-y-4 text-xs">
                {formData.projectExperience?.map((proj, idx) => (
                  <div key={proj.id} className="space-y-3 pb-4 border-b border-white/[0.06] last:border-b-0">
                    <div className="flex items-center justify-between font-mono text-slate-400">
                      <span>Project #{idx + 1}</span>
                      {formData.projectExperience!.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = formData.projectExperience!.filter(p => p.id !== proj.id);
                            setFormData({ ...formData, projectExperience: updated });
                          }}
                          className="text-slate-400 hover:text-rose-400"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={proj.name}
                        onChange={e => {
                          const updated = formData.projectExperience!.map(p => p.id === proj.id ? { ...p, name: e.target.value } : p);
                          setFormData({ ...formData, projectExperience: updated });
                        }}
                        placeholder="Project Title"
                        className="px-3 py-2 rounded-lg border border-white/[0.12] bg-[#0E111B] text-white focus:outline-none focus:border-indigo-500"
                      />
                      <input
                        type="text"
                        value={proj.techStack}
                        onChange={e => {
                          const updated = formData.projectExperience!.map(p => p.id === proj.id ? { ...p, techStack: e.target.value } : p);
                          setFormData({ ...formData, projectExperience: updated });
                        }}
                        placeholder="Tech Stack (e.g. React, Python)"
                        className="px-3 py-2 rounded-lg border border-white/[0.12] bg-[#0E111B] text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <textarea
                      value={proj.description}
                      onChange={e => {
                        const updated = formData.projectExperience!.map(p => p.id === proj.id ? { ...p, description: e.target.value } : p);
                        setFormData({ ...formData, projectExperience: updated });
                      }}
                      placeholder="Brief Description"
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg border border-white/[0.12] bg-[#0E111B] text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Certifications */}
          {currentStep === 6 && (
            <div className="space-y-5 py-2">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-lg font-bold text-white">Certifications & Credentials</h2>
                  <p className="text-xs text-slate-400">List industry or academic certifications.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newC: AssessmentCertification = {
                      id: Date.now().toString(),
                      title: 'New Certification',
                      provider: 'AWS / Coursera',
                      year: '2025'
                    };
                    setFormData({ ...formData, certifications: [...(formData.certifications || []), newC] });
                  }}
                  className="px-3 py-1.5 rounded-lg border border-white/[0.12] bg-[#0E111B] text-xs font-semibold text-slate-200 hover:bg-white/[0.04]"
                >
                  + Add Certification
                </button>
              </div>

              <div className="space-y-3 text-xs">
                {formData.certifications?.map((c) => (
                  <div key={c.id} className="flex items-center gap-3">
                    <input
                      type="text"
                      value={c.title}
                      onChange={e => {
                        const updated = formData.certifications!.map(item => item.id === c.id ? { ...item, title: e.target.value } : item);
                        setFormData({ ...formData, certifications: updated });
                      }}
                      placeholder="Certification Name"
                      className="flex-1 px-3 py-2 rounded-lg border border-white/[0.12] bg-[#0E111B] text-white focus:outline-none focus:border-indigo-500"
                    />
                    <input
                      type="text"
                      value={c.provider}
                      onChange={e => {
                        const updated = formData.certifications!.map(item => item.id === c.id ? { ...item, provider: e.target.value } : item);
                        setFormData({ ...formData, certifications: updated });
                      }}
                      placeholder="Provider (e.g. AWS)"
                      className="w-40 px-3 py-2 rounded-lg border border-white/[0.12] bg-[#0E111B] text-white focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = formData.certifications!.filter(item => item.id !== c.id);
                        setFormData({ ...formData, certifications: updated });
                      }}
                      className="text-slate-400 hover:text-rose-400 text-xs"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 7: Interests */}
          {currentStep === 7 && (
            <div className="space-y-5 py-2">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white">Interests & Areas of Curiosity</h2>
                <p className="text-xs text-slate-400">Select domains that align with what you enjoy building.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                {[
                  'Programming & Software Architecture',
                  'Artificial Intelligence & ML',
                  'Algorithmic Problem Solving',
                  'Data Analytics & Visualization',
                  'Cloud Infrastructure & DevOps',
                  'Cybersecurity & Network Defense',
                  'UI/UX & Web Performance',
                  'Academic Research & Writing'
                ].map(item => {
                  const isSel = formData.interests?.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        const updated = toggleArrayItem(formData.interests || [], item);
                        setFormData({ ...formData, interests: updated });
                      }}
                      className={`p-3.5 rounded-lg border text-left font-medium transition-all flex items-center justify-between ${
                        isSel
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-xs'
                          : 'border-white/[0.10] bg-[#0E111B] text-slate-300 hover:border-white/[0.20]'
                      }`}
                    >
                      <span>{item}</span>
                      {isSel && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 8: Work Style Scenarios */}
          {currentStep === 8 && (
            <div className="space-y-5 py-2">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white">Work Style Scenarios</h2>
                <p className="text-xs text-slate-400">Rate how strongly each statement describes your preferences (1 to 5).</p>
              </div>

              <div className="space-y-5 text-xs">
                {PERSONALITY_SCENARIOS.map((sc, i) => {
                  const val = formData.personality?.[sc.id] || 3;
                  return (
                    <div key={sc.id} className="space-y-2.5 pb-4 border-b border-white/[0.06] last:border-b-0">
                      <div className="flex items-center justify-between font-mono text-slate-400">
                        <span>#{i+1} {sc.trait}</span>
                        <span className="text-indigo-400 font-semibold">Rating: {val}/5</span>
                      </div>
                      <p className="text-xs text-slate-200">{sc.question}</p>
                      <div className="flex items-center gap-2 pt-1">
                        {[1, 2, 3, 4, 5].map(rating => (
                          <button
                            key={rating}
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                personality: { ...(formData.personality || {}), [sc.id]: rating }
                              });
                            }}
                            className={`flex-1 py-2 rounded-lg border text-xs font-mono font-bold transition-all ${
                              val === rating
                                ? 'bg-indigo-600 text-white border-indigo-500 shadow-xs'
                                : 'border-white/[0.10] bg-[#0E111B] text-slate-300 hover:border-white/[0.20]'
                            }`}
                          >
                            {rating}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 9: Learning Style */}
          {currentStep === 9 && (
            <div className="space-y-5 py-2 text-xs">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white">Learning Style & Commitment</h2>
                <p className="text-xs text-slate-400">Select how you learn best and your weekly available time.</p>
              </div>

              <div className="space-y-3">
                <label className="font-semibold text-slate-300 block">Preferred Methods</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    'Building Hands-on Portfolio Projects',
                    'Interactive Video Tutorials',
                    'Official Documentation & Books',
                    'Solving Practice Coding Challenges'
                  ].map(m => {
                    const isSel = formData.learningStyle?.methods?.includes(m);
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => {
                          const updated = toggleArrayItem(formData.learningStyle?.methods || [], m);
                          setFormData({ ...formData, learningStyle: { ...formData.learningStyle!, methods: updated } });
                        }}
                        className={`p-3.5 rounded-lg border text-left font-medium transition-all ${
                          isSel
                            ? 'bg-indigo-600 text-white border-indigo-500 shadow-xs'
                            : 'border-white/[0.10] bg-[#0E111B] text-slate-300 hover:border-white/[0.20]'
                        }`}
                      >
                        {m}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 10: Timed Aptitude Test */}
          {currentStep === 10 && (
            <div className="space-y-5 py-2">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <div>
                  <h2 className="text-lg font-bold text-white">Aptitude & Reasoning Evaluation</h2>
                  <p className="text-xs text-slate-400">10 core aptitude questions across logic, quantitative reasoning, and programming.</p>
                </div>
                <div className="text-xs font-mono font-bold text-indigo-400 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                  Timer: {formatTimer(testTimeSeconds)}
                </div>
              </div>

              <div className="space-y-5 text-xs">
                {SAMPLE_APTITUDE_QUESTIONS.map((q, idx) => {
                  const selAns = formData.aptitudeTest?.answers?.[q.id];
                  return (
                    <div key={q.id} className="space-y-2.5 pb-4 border-b border-white/[0.06] last:border-b-0">
                      <div className="flex items-center justify-between font-mono text-slate-400">
                        <span>Question 0{idx + 1} / 10</span>
                        <span className="text-slate-400">{q.category}</span>
                      </div>
                      <p className="text-xs text-white font-medium">{q.question}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {q.options.map((opt, optIdx) => {
                          const isPicked = selAns === optIdx;
                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  aptitudeTest: {
                                    ...formData.aptitudeTest!,
                                    answers: { ...(formData.aptitudeTest?.answers || {}), [q.id]: optIdx }
                                  }
                                });
                              }}
                              className={`p-2.5 rounded-lg border text-left text-xs font-medium transition-all ${
                                isPicked
                                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-xs'
                                  : 'border-white/[0.10] bg-[#0E111B] text-slate-300 hover:border-white/[0.20]'
                              }`}
                            >
                              <span className="font-mono text-slate-400 mr-2">{String.fromCharCode(65 + optIdx)}.</span>
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 11: Domain Preferences */}
          {currentStep === 11 && (
            <div className="space-y-5 py-2">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white">Domain Preferences</h2>
                <p className="text-xs text-slate-400">Select target technology sectors you want to specialize in.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                {[
                  'Full-Stack Web Development',
                  'AI / Machine Learning Systems',
                  'Data Engineering & Analytics',
                  'Cloud Architecture & DevOps',
                  'Cybersecurity & Network Engineering',
                  'Mobile Application Development'
                ].map(d => {
                  const isSel = formData.domainPreferences?.includes(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => {
                        const updated = toggleArrayItem(formData.domainPreferences || [], d);
                        setFormData({ ...formData, domainPreferences: updated });
                      }}
                      className={`p-3.5 rounded-lg border text-left font-medium transition-all ${
                        isSel
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-xs'
                          : 'border-white/[0.10] bg-[#0E111B] text-slate-300 hover:border-white/[0.20]'
                      }`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 12: Work Environment */}
          {currentStep === 12 && (
            <div className="space-y-5 py-2 text-xs">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white">Work Environment Preferences</h2>
                <p className="text-xs text-slate-400">Specify organization size and flexibility preferences.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Company Size</label>
                  <select
                    value={formData.workEnvironment?.companySize || 'Mid-sized tech or high-growth startup'}
                    onChange={e => setFormData({ ...formData, workEnvironment: { ...formData.workEnvironment!, companySize: e.target.value } })}
                    className="w-full px-3 py-2 rounded-lg border border-white/[0.12] bg-[#0E111B] text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Early-stage startup (1-20 people)">Early-stage startup (1-20 people)</option>
                    <option value="Mid-sized tech or high-growth startup">Mid-sized tech or high-growth startup</option>
                    <option value="Large enterprise / FAANG">Large enterprise / FAANG</option>
                    <option value="Research institution / University lab">Research institution / University lab</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Work Arrangement</label>
                  <select
                    value={formData.workEnvironment?.workStyle || 'Hybrid'}
                    onChange={e => setFormData({ ...formData, workEnvironment: { ...formData.workEnvironment!, workStyle: e.target.value } })}
                    className="w-full px-3 py-2 rounded-lg border border-white/[0.12] bg-[#0E111B] text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Remote-First">Remote-First</option>
                    <option value="Hybrid (2-3 days office)">Hybrid (2-3 days office)</option>
                    <option value="Onsite">Onsite</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 13: Self-Evaluation */}
          {currentStep === 13 && (
            <div className="space-y-5 py-2 text-xs">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white">Self-Evaluation</h2>
                <p className="text-xs text-slate-400">Rate your current confidence in key software disciplines (1 to 5).</p>
              </div>

              <div className="space-y-4">
                {[
                  { key: 'codingConfidence', label: 'Programming & Implementation' },
                  { key: 'problemSolvingConfidence', label: 'Algorithmic Problem Solving' },
                  { key: 'systemDesignConfidence', label: 'System Design & Architecture' },
                  { key: 'communicationConfidence', label: 'Technical Communication & Team Collaboration' }
                ].map(item => {
                  const val = (formData.selfEvaluation as any)?.[item.key] || 3;
                  return (
                    <div key={item.key} className="space-y-1.5">
                      <div className="flex justify-between text-slate-300 font-medium">
                        <span>{item.label}</span>
                        <span className="font-mono text-indigo-400">{val} / 5</span>
                      </div>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(r => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                selfEvaluation: { ...(formData.selfEvaluation || {}), [item.key]: r }
                              });
                            }}
                            className={`flex-1 py-2 rounded-lg border text-xs font-mono font-bold transition-all ${
                              val === r
                                ? 'bg-indigo-600 text-white border-indigo-500 shadow-xs'
                                : 'border-white/[0.10] bg-[#0E111B] text-slate-300 hover:border-white/[0.20]'
                            }`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 14: Review & Generate */}
          {currentStep === 14 && (
            <div className="space-y-5 py-2 text-xs">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white">Review & Complete Assessment</h2>
                <p className="text-xs text-slate-400">Verify your responses before triggering the AI recommendation matrix.</p>
              </div>

              <div className="space-y-3 border-y border-white/[0.06] py-4 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Candidate:</span>
                  <span className="font-semibold text-white">{formData.personalInfo?.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Degree & University:</span>
                  <span className="font-semibold text-white">{formData.personalInfo?.department} @ {formData.personalInfo?.university}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Role:</span>
                  <span className="font-semibold text-white">{formData.careerGoals?.targetRole}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Selected Languages:</span>
                  <span className="font-semibold text-white">{formData.technicalSkills?.languages?.join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Aptitude Progress:</span>
                  <span className="font-semibold text-indigo-400 font-mono">{Object.keys(formData.aptitudeTest?.answers || {}).length} / 10 Answered</span>
                </div>
              </div>
            </div>
          )}

          {/* Step Controls / Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={handlePrevStep}
              disabled={currentStep === 1}
              className={`px-4 py-2 rounded-lg border border-white/[0.12] text-xs font-semibold transition-all ${
                currentStep === 1
                  ? 'opacity-30 cursor-not-allowed text-slate-500'
                  : 'bg-[#0E111B] text-slate-300 hover:bg-white/[0.04]'
              }`}
            >
              Previous
            </button>

            <button
              type="button"
              onClick={handleNextStep}
              disabled={isAnalyzing}
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all inline-flex items-center gap-2 shadow-xs cursor-pointer"
            >
              {isAnalyzing ? (
                <span>Generating Career Report...</span>
              ) : currentStep === 14 ? (
                <>
                  <span>Generate Career Report</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <span>Next Step</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

        </div>
      )}

      {/* Methodology Modal */}
      <DataSourcesMethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />

    </div>
  );
};
