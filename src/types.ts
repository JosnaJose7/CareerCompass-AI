export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface Internship {
  id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
}

export interface Hackathon {
  id: string;
  name: string;
  projectOrAward: string;
  year?: string;
}

export interface StudentProfile {
  id?: string;
  userId: string;

  // Basic Info
  fullName?: string;

  // Academic Details
  university: string;
  department?: string;
  major: string;
  semester?: string;
  gradYear: string;
  gpa?: string;
  cgpa?: string;

  // Skills & Technical Stack
  skills: string[];
  programmingLanguages?: string[];
  frameworks?: string[];

  // Portfolio & Experiences
  projects: Project[];
  certifications: string[];
  hackathons?: Hackathon[];
  internships?: Internship[];
  achievements?: string[];

  // Aspirations & Preferences
  interests: string[];
  dreamCompany?: string;
  dreamRole?: string;
  preferredCountry?: string;
  preferredWorkStyle?: 'Remote' | 'Hybrid' | 'On-site' | 'Flexible';
  workPreference: 'Remote' | 'Hybrid' | 'On-site' | 'Flexible';
  expectedSalary?: string;
  targetIndustries: string[];
  careerGoals: string;

  updatedAt?: string;
}

export interface SkillGapItem {
  skill: string;
  type: 'missing' | 'strong' | 'developing';
  importance: 'High' | 'Medium' | 'Low';
  howToAcquire?: string;
}

export interface CareerRecommendation {
  id: string;
  title: string;
  matchScore: number; // 0 - 100
  shortSummary: string;
  dayInLife: string;
  salaryRange: {
    entry: string;
    mid: string;
    senior?: string;
  };
  demandGrowth: string; // e.g. "+22% Very High Growth"
  futureDemand: string; // 5-year outlook & industry demand trend
  reason: string; // Direct match reasoning
  strengths: string[]; // Key candidate strengths for this role
  weaknesses: string[]; // Relative weaknesses or areas for improvement
  missingSkills: string[]; // Key missing skills to bridge
  keyResponsibilities: string[];
  matchingSkills: string[];
  skillsGap: SkillGapItem[];
  aiReasoning: string;
  topEmployers: string[];
}

export interface WeeklyTaskItem {
  id: string;
  title: string;
  completed: boolean;
}

export interface WeeklyGoal {
  id: string;
  weekNumber: number;
  title: string;
  focus: string;
  tasks: WeeklyTaskItem[];
}

export interface MonthlyGoal {
  id: string;
  monthNumber: number;
  title: string;
  summary: string;
  completed: boolean;
  weeklyGoals: WeeklyGoal[];
}

export interface RoadmapProject {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  techStack: string[];
  keyDeliverables: string[];
  resumeBullet: string;
  completed: boolean;
}

export interface RoadmapCourse {
  id: string;
  title: string;
  provider: string;
  type: 'Free' | 'Paid' | 'Certification';
  duration: string;
  url?: string;
  completed: boolean;
}

export interface RoadmapPracticeQuestion {
  id: string;
  category: 'Coding' | 'System Design' | 'Behavioral' | 'Domain Knowledge';
  question: string;
  hint: string;
  solutionSummary: string;
  completed: boolean;
}

export interface RoadmapMilestone {
  id: string;
  period: string; // e.g., "Month 1 - Month 2 (Foundation & Core Skills)"
  title: string;
  description: string;
  completed: boolean;
  tasks: string[];
  recommendedResources: { title: string; type: 'Course' | 'Book' | 'Certification' | 'Project'; url?: string }[];
  resumeBulletSuggestion: string;
}

export interface CareerRoadmap {
  id?: string;
  userId: string;
  roleTitle: string;
  overview: string;
  estimatedTimeToJobReady: string; // e.g. "6 - 9 Months"
  milestones: RoadmapMilestone[];
  monthlyGoals?: MonthlyGoal[];
  projects?: RoadmapProject[];
  courses?: RoadmapCourse[];
  practiceQuestions?: RoadmapPracticeQuestion[];
  createdAt?: string;
}

export interface GrammarAnalysis {
  score: number; // 0 - 100
  issuesFound: number;
  grammarFeedback: string[];
  toneAndClarity: string;
}

export interface SkillsAnalysis {
  identifiedSkills: string[];
  technicalStack: string[];
  softSkills: string[];
  skillLevelEstimate: string;
}

export interface ProjectsAnalysis {
  projectScore: number; // 0 - 100
  strengths: string[];
  weaknesses: string[];
  impactQuantificationTips: string[];
}

export interface ScoreCategory {
  category: string;
  score: number; // 0 - 100
  feedback: string;
}

export interface ResumeAnalysisResult {
  resumeScore: number; // Overall Resume Score (0 - 100)
  atsScore: number; // 0 - 100
  targetRole: string;
  overallSummary: string;
  
  // Category Breakdown
  categoryScores?: ScoreCategory[];

  // Detailed Analysis Modules
  grammar?: GrammarAnalysis;
  skills?: SkillsAnalysis;
  projects?: ProjectsAnalysis;

  keyStrengths: string[];
  missingKeywords: string[];
  suggestions: string[]; // General actionable suggestions
  bulletPointImprovements: {
    original: string;
    improved: string;
    reason: string;
  }[];
  formatActionItems: string[];
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category: 'HR' | 'Technical' | 'Coding' | 'Behavioral';
  hint: string;
  sampleKeyPoints: string[];
  starterCode?: string;
  problemStatement?: string;
  testCases?: { input: string; output: string }[];
}

export interface AnswerEvaluation {
  score: number; // 0 - 10 or 0 - 100
  strengths: string[];
  areasForImprovement: string[];
  starFormatSuggestions?: string;
  technicalFeedback?: string;
  codeQualityAnalysis?: string;
  modelAnswer: string;
}

export interface SavedCareerItem {
  id?: string;
  userId: string;
  title: string;
  matchScore: number;
  salary: string;
  growth: string;
  skillsGapCount: number;
  reasoning: string;
  savedAt: string;
}

export interface RecommendedCourse {
  title: string;
  provider: string;
  level: string;
  url?: string;
}

export interface RecommendedProject {
  title: string;
  description: string;
  keyDeliverables: string[];
}

export interface RecommendedCertification {
  title: string;
  issuer: string;
}

export interface CompletedSkillItem {
  skill: string;
  category: string;
  proficiency: 'Mastered' | 'Proficient' | 'Basic';
  matchReason: string;
}

export interface SkillGapMissingSkill {
  id: string;
  skill: string;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: number;
  recommendedCourses: RecommendedCourse[];
  projects: RecommendedProject[];
  certifications: RecommendedCertification[];
  completed: boolean;
}

export interface SkillGapAnalysisResult {
  targetRole: string;
  readinessScore: number; // 0 - 100%
  overallSummary: string;
  industryDemandOutlook: string;
  completedSkills: CompletedSkillItem[];
  missingSkills: SkillGapMissingSkill[];
  industryBenchmarks: { skill: string; importance: string; demandTrend: string }[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface HiringSkillItem {
  skill: string;
  demandPercentage: number; // e.g. 92
  category: string;
  yearOverYearGrowth: string; // e.g. "+34%"
  avgSalaryBonus: string; // e.g. "+$14k"
}

export interface TechTrendItem {
  technology: string;
  category: string;
  momentumScore: number; // 0-100
  year2024: number;
  year2025: number;
  year2026: number;
  year2027: number;
  adoptionLevel: 'Mainstream' | 'Rapid Growth' | 'Emerging';
}

export interface CareerDemandItem {
  role: string;
  openingsIndex: number; // e.g. 85000
  popularityScore: number; // 0-100
  demandLevel: 'Very High' | 'High' | 'Moderate';
  entrySalary: number; // in USD
  midSalary: number;
  seniorSalary: number;
  topEmployers: string[];
  futureGrowthRate: string; // e.g. "+28%"
}

export interface SalaryBreakdownItem {
  role: string;
  entryLevel: number;
  midLevel: number;
  seniorLevel: number;
  avgBonus: number;
}

export interface DemandLevelItem {
  level: string;
  percentage: number;
  color: string;
  rolesCount: number;
}

export interface FutureScopeItem {
  subject: string;
  growthPotential: number; // 0-100
  aiResilience: number;
  remoteFlexibility: number;
  entryAccessibility: number;
}

export interface JobMarketOverview {
  lastUpdated: string;
  industrySector: string;
  topHiringSkills: HiringSkillItem[];
  trendingTechnologies: TechTrendItem[];
  popularCareers: CareerDemandItem[];
  salaryBreakdowns: SalaryBreakdownItem[];
  demandLevelDistribution: DemandLevelItem[];
  futureScopeRadar: FutureScopeItem[];
  aiSummary: string;
}

export interface FacultyStudent {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  department: string;
  major: string;
  year: string;
  cgpa: string;
  readinessScore: number; // 0-100
  milestoneProgress: number; // 0-100
  status: 'On Track' | 'Pending Review' | 'Needs Attention' | 'Approved';
  targetRole: string;
  avatar?: string;
  enrolledDate: string;
  lastActive: string;
  completedProjectsCount: number;
  certificationsCount: number;
  mockInterviewScore: number;
}

export interface FacultyRecommendation {
  id: string;
  studentId: string;
  roleTitle: string;
  rationale: string;
  recommendedBy: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Recommended' | 'Accepted' | 'Under Discussion';
  dateAdded: string;
}

export interface FacultyApprovalRequest {
  id: string;
  studentId: string;
  studentName: string;
  type: 'Roadmap Approval' | 'Career Choice' | 'Internship Credit' | 'Project Exemption' | 'Skill Certification';
  title: string;
  description: string;
  status: 'Pending' | 'Approved' | 'Revision Requested' | 'Rejected';
  submittedDate: string;
  facultyComment?: string;
  reviewedDate?: string;
}

export interface FacultyFeedbackItem {
  id: string;
  studentId: string;
  facultyName: string;
  category: 'Roadmap' | 'Interview' | 'Resume' | 'Overall Academic';
  rating: number; // 1 to 5
  feedbackText: string;
  actionItems: string[];
  date: string;
}

export interface FacultyNote {
  id: string;
  studentId: string;
  authorName: string;
  content: string;
  category: 'Academic' | 'Career Guidance' | 'Placement Alert' | 'Personal';
  isPrivate: boolean;
  createdAt: string;
  updatedAt?: string;
}

