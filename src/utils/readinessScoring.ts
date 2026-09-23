/**
 * CareerCompass AI - 11-Dimensional Holistic Readiness Scoring Engine
 * 
 * Evaluates student profiles and diagnostic assessments across 11 distinct dimensions.
 * Each dimension is normalized to a common 0–100 scale before applying calibrated weights.
 * 
 * Total Weight Sum = EXACTLY 100% (1.00).
 */

import { DimensionBreakdown, DimensionDetail, CareerReadinessResult, StudentProfile, AssessmentResponses } from '../types';

/**
 * Centralized Configuration of Weights for the 11-Dimensional Framework.
 * Calibrated for university students and early-career software engineering talent:
 * 
 * 1.  Academics (10%): Degree rigor, GPA/CGPA, university standing, foundational coursework.
 * 2.  Technical Skills (15%): Programming languages, frameworks, developer tools, proficiencies.
 * 3.  Projects (15%): Portfolio projects, practical complexity, live deployment, hackathons, internships.
 * 4.  Certifications (8%): Industry-recognized cloud, dev, or domain credentials (AWS, Docker, etc.).
 * 5.  Interests (7%): Passion vectors and proactive curiosity in modern engineering domains.
 * 6.  Personality (8%): Analytical endurance, team collaboration, user-centric focus, work style.
 * 7.  Learning Style (7%): Weekly study commitment, self-directed agility, methodology diversity.
 * 8.  Aptitude (10%): Logical reasoning, quantitative analysis, verbal ability, problem-solving speed.
 * 9.  Domain Preferences (7%): Technology specialization and target industry clarity.
 * 10. Work Environment (6%): Workplace adaptability, remote/hybrid fit, company size alignment.
 * 11. Career Goals (7%): Strategic clarity, defined target role, employer targeting, compensation realism.
 * 
 * SUM: 0.10 + 0.15 + 0.15 + 0.08 + 0.07 + 0.08 + 0.07 + 0.10 + 0.07 + 0.06 + 0.07 = 1.00 (100%)
 */
export const DIMENSION_WEIGHTS: Record<keyof DimensionBreakdown, number> = {
  academics: 0.10,
  technicalSkills: 0.15,
  projects: 0.15,
  certifications: 0.08,
  interests: 0.07,
  personality: 0.08,
  learningStyle: 0.07,
  aptitude: 0.10,
  domainPreferences: 0.07,
  workEnvironment: 0.06,
  careerGoals: 0.07,
} as const;

export const DIMENSION_LABELS: Record<keyof DimensionBreakdown, string> = {
  academics: 'Academics',
  technicalSkills: 'Technical Skills',
  projects: 'Projects',
  certifications: 'Certifications',
  interests: 'Interests',
  personality: 'Personality',
  learningStyle: 'Learning Style',
  aptitude: 'Aptitude',
  domainPreferences: 'Domain Preferences',
  workEnvironment: 'Work Environment',
  careerGoals: 'Career Goals',
};

export const DIMENSION_DESCRIPTIONS: Record<keyof DimensionBreakdown, string> = {
  academics: 'Degree program, GPA/CGPA performance, and university foundational coursework.',
  technicalSkills: 'Core programming languages, frameworks, modern developer tooling, and depth.',
  projects: 'Hands-on portfolio projects, code complexity, live deployments, and hackathons.',
  certifications: 'Industry-standard cloud, developer, and infrastructure credentials (e.g. AWS, Docker).',
  interests: 'Enthusiasm and active exploration across high-growth engineering domains.',
  personality: 'Analytical endurance, problem-solving persistence, and team collaboration dynamics.',
  learningStyle: 'Weekly self-study commitment and practical hands-on learning agility.',
  aptitude: 'Cognitive reasoning, quantitative problem solving, and algorithmic logic comprehension.',
  domainPreferences: 'Industry alignment and technological track focus (e.g., Full-Stack, AI Systems).',
  workEnvironment: 'Clarity on preferred workplace dynamics, team size, and collaboration models.',
  careerGoals: 'Strategic vision, defined target roles, employer research, and career timeline.',
};

export interface WhatIfSimulationModifiers {
  addedAWS?: boolean;
  addedDocker?: boolean;
  improvedDSA?: boolean;
  twoAIProjects?: boolean;
  improvedSQL?: boolean;
  cloudInternship?: boolean;
  internshipExperience?: boolean;
  moreProjects?: boolean;
  customSkills?: string[];
  selectedScenarios?: string[];
}

/**
 * Normalizes academic performance to 0-100 scale.
 * Safely parses GPA on 4.0 scale, 10.0 scale, percentages, or defaults to 70 if not yet entered.
 */
export function normalizeAcademics(raw: {
  gpa?: string | number;
  cgpa?: string | number;
  major?: string;
  department?: string;
  university?: string;
  semester?: string;
}): number {
  let score = 70; // Sensible baseline for matriculated university student

  const gpaStr = String(raw.cgpa || raw.gpa || '').trim();
  if (gpaStr) {
    const matches = gpaStr.match(/(\d+(\.\d+)?)/);
    if (matches) {
      const val = parseFloat(matches[1]);
      if (!isNaN(val)) {
        if (gpaStr.includes('/ 10') || (val > 4.0 && val <= 10.0)) {
          // 10.0 Scale
          score = (val / 10.0) * 100;
        } else if (gpaStr.includes('%') || (val > 10.0 && val <= 100.0)) {
          // Direct percentage
          score = val;
        } else if (val <= 4.0 && val > 0) {
          // 4.0 Scale: e.g. 3.8 / 4.0 = 95%
          score = (val / 4.0) * 100;
        }
      }
    }
  }

  // Major/Department alignment bonus for computing & STEM
  const majorText = `${raw.major || ''} ${raw.department || ''}`.toLowerCase();
  if (
    majorText.includes('computer') ||
    majorText.includes('software') ||
    majorText.includes('data') ||
    majorText.includes('information') ||
    majorText.includes('electrical') ||
    majorText.includes('ai')
  ) {
    score += 4;
  }

  if (raw.university && raw.university.trim().length > 2) {
    score += 2;
  }

  return Math.min(100, Math.max(35, Math.round(score)));
}

/**
 * Normalizes technical skills to 0-100 scale.
 * Evaluates programming languages count, frameworks, developer tooling, and proficiencies.
 */
export function normalizeTechnicalSkills(
  raw: {
    languages?: string[];
    programmingLanguages?: string[];
    frameworks?: string[];
    tools?: string[];
    skills?: string[];
    customSkills?: string[];
    skillProficiency?: Record<string, number | string>;
    proficiency?: Record<string, string>;
  },
  whatIf?: WhatIfSimulationModifiers
): number {
  const languages = raw.languages || raw.programmingLanguages || [];
  const frameworks = raw.frameworks || [];
  const allSkills = raw.skills || [];
  const tools = raw.tools || raw.customSkills || [];

  const langCount = languages.length > 0 ? languages.length : Math.min(3, Math.floor(allSkills.length / 2));
  const frameworkCount = frameworks.length > 0 ? frameworks.length : Math.max(0, allSkills.length - langCount);

  // Baseline score by language count
  let score = 35; // Minimal baseline for exploring beginner
  if (langCount === 1) score = 55;
  else if (langCount === 2) score = 68;
  else if (langCount === 3) score = 78;
  else if (langCount >= 4) score = 88;

  // Framework & tooling contribution (up to +12)
  score += Math.min(12, frameworkCount * 3 + tools.length * 2);

  // Stated proficiency adjustment if available
  const profMap = raw.skillProficiency || raw.proficiency;
  if (profMap && typeof profMap === 'object') {
    const values = Object.values(profMap);
    if (values.length > 0) {
      let sum = 0;
      values.forEach(v => {
        if (typeof v === 'number') sum += (v / 5) * 100;
        else if (v === 'Advanced') sum += 95;
        else if (v === 'Intermediate') sum += 80;
        else sum += 65;
      });
      const avgProf = sum / values.length;
      // Blend 80% count-based, 20% verified proficiency
      score = score * 0.8 + avgProf * 0.2;
    }
  }

  // Apply What-If scenario modifiers directly to Technical Skills
  if (whatIf?.addedDocker || whatIf?.selectedScenarios?.includes('addedDocker')) {
    score += 10;
  }
  if (whatIf?.improvedSQL || whatIf?.selectedScenarios?.includes('improvedSQL')) {
    score += 8;
  }
  if (whatIf?.improvedDSA || whatIf?.selectedScenarios?.includes('improvedDSA')) {
    score += 8;
  }
  if (whatIf?.addedAWS || whatIf?.selectedScenarios?.includes('addedAWS')) {
    score += 6;
  }
  if (whatIf?.customSkills && whatIf.customSkills.length > 0) {
    score += Math.min(12, whatIf.customSkills.length * 4);
  }

  return Math.min(100, Math.max(30, Math.round(score)));
}

/**
 * Normalizes practical project experience to 0-100 scale.
 * Evaluates portfolio count, live links, hackathons, and internship experiences.
 */
export function normalizeProjects(
  raw: {
    projects?: any[];
    projectExperience?: any[];
    hackathons?: any[];
    internships?: any[];
  },
  whatIf?: WhatIfSimulationModifiers
): number {
  const projects = raw.projects || raw.projectExperience || [];
  const projectCount = Array.isArray(projects) ? projects.length : 0;
  const hackathons = Array.isArray(raw.hackathons) ? raw.hackathons.length : 0;
  const internships = Array.isArray(raw.internships) ? raw.internships.length : 0;

  let score = 30; // Baseline for student with academic lab work but no custom projects
  if (projectCount === 1) score = 62;
  else if (projectCount === 2) score = 76;
  else if (projectCount === 3) score = 88;
  else if (projectCount >= 4) score = 95;

  // Project quality bonus for live deployment or repository link
  const hasLiveLink = projects.some((p: any) => p.link || p.isDeployed);
  if (hasLiveLink) score += 4;

  // Hackathon contribution (+4 per hackathon, up to +8)
  score += Math.min(8, hackathons * 4);

  // Internship experience (+10 per internship, up to +15)
  score += Math.min(15, internships * 10);

  // Apply What-If scenario modifiers directly to Projects
  if (whatIf?.twoAIProjects || whatIf?.selectedScenarios?.includes('twoAIProjects')) {
    score += 16;
  }
  if (whatIf?.moreProjects) {
    score += 12;
  }
  if (
    whatIf?.cloudInternship ||
    whatIf?.internshipExperience ||
    whatIf?.selectedScenarios?.includes('cloudInternship') ||
    whatIf?.selectedScenarios?.includes('internshipExperience')
  ) {
    score += 18;
  }

  return Math.min(100, Math.max(25, Math.round(score)));
}

/**
 * Normalizes certifications and verified credentials to 0-100 scale.
 * For university students, industry certifications are a high-leverage differentiator.
 */
export function normalizeCertifications(
  raw: {
    certifications?: any[];
  },
  whatIf?: WhatIfSimulationModifiers
): number {
  const certs = raw.certifications || [];
  const certCount = Array.isArray(certs) ? certs.length : 0;

  // Student baseline: 35 (most college students have 0 formal certs; not fatal, but differentiated when present)
  let score = 35;
  if (certCount === 1) score = 72;
  else if (certCount === 2) score = 86;
  else if (certCount >= 3) score = 96;

  // Apply What-If scenario modifiers directly to Certifications
  if (whatIf?.addedAWS || whatIf?.selectedScenarios?.includes('addedAWS')) {
    score += 28; // Earning AWS Developer / Cloud Practitioner directly elevates certification dimension
  }
  if (whatIf?.addedDocker || whatIf?.selectedScenarios?.includes('addedDocker')) {
    score += 18; // Completing Docker Certified Associate
  }

  return Math.min(100, Math.max(30, Math.round(score)));
}

/**
 * Normalizes interests and passion vectors to 0-100 scale.
 */
export function normalizeInterests(raw: { interests?: string[] }): number {
  const interests = Array.isArray(raw.interests) ? raw.interests : [];
  if (interests.length === 0) return 50;
  if (interests.length === 1) return 70;
  if (interests.length === 2) return 84;

  let score = 92;
  // High-demand technological alignment bonus
  const interestText = interests.join(' ').toLowerCase();
  if (
    interestText.includes('ai') ||
    interestText.includes('machine learning') ||
    interestText.includes('cloud') ||
    interestText.includes('distributed') ||
    interestText.includes('security')
  ) {
    score += 4;
  }

  return Math.min(100, Math.max(40, score));
}

/**
 * Normalizes personality and work-style dynamics to 0-100 scale.
 * Evaluates analytical endurance, team collaboration, user focus from assessment scenarios.
 */
export function normalizePersonality(raw: {
  personality?: Record<string, number>;
  preferredWorkStyle?: string;
  workPreference?: string;
}): number {
  if (raw.personality && typeof raw.personality === 'object') {
    const ratings = Object.values(raw.personality).filter(r => typeof r === 'number' && !isNaN(r));
    if (ratings.length > 0) {
      const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
      return Math.min(100, Math.max(40, Math.round((avg / 5) * 100)));
    }
  }

  // Profile work preference fallback
  const pref = raw.preferredWorkStyle || raw.workPreference;
  if (pref && ['Hybrid', 'Remote', 'Flexible'].includes(pref)) {
    return 80;
  }

  return 75; // Standard healthy collaborative baseline
}

/**
 * Normalizes learning style and weekly dedication to 0-100 scale.
 */
export function normalizeLearningStyle(raw: {
  learningStyle?: {
    methods?: string[];
    timeCommitment?: string;
  };
}): number {
  const style = raw.learningStyle || {};
  let score = 72;

  const time = String(style.timeCommitment || '');
  if (time.includes('15+') || time.includes('20+')) {
    score = 95;
  } else if (time.includes('10 - 15') || time.includes('10-15')) {
    score = 88;
  } else if (time.includes('5 - 10') || time.includes('5-10')) {
    score = 76;
  } else if (time.includes('< 5') || time.includes('1-5')) {
    score = 60;
  }

  const methods = Array.isArray(style.methods) ? style.methods : [];
  if (methods.length >= 2) score += 6;
  else if (methods.length === 1) score += 3;

  return Math.min(100, Math.max(45, Math.round(score)));
}

/**
 * Normalizes cognitive and programming aptitude to 0-100 scale.
 * Aptitude is strictly ONE of the 11 dimensions (10% weight).
 */
export function normalizeAptitude(
  raw: {
    aptitudeTest?: {
      percentage?: number;
      score?: number;
      totalScore?: number;
      maxScore?: number;
      totalQuestions?: number;
    };
    aptitudeScore?: number;
    skills?: string[];
    programmingLanguages?: string[];
    gpa?: string | number;
    cgpa?: string | number;
  },
  whatIf?: WhatIfSimulationModifiers
): number {
  let score = 75; // Baseline derived aptitude

  const test = raw.aptitudeTest || {};
  if (typeof test.percentage === 'number' && !isNaN(test.percentage)) {
    score = test.percentage;
  } else if (typeof raw.aptitudeScore === 'number' && !isNaN(raw.aptitudeScore)) {
    score = raw.aptitudeScore > 10 ? raw.aptitudeScore : (raw.aptitudeScore / 10) * 100;
  } else if (typeof test.score === 'number' && typeof test.totalQuestions === 'number' && test.totalQuestions > 0) {
    score = (test.score / test.totalQuestions) * 100;
  } else if (typeof test.totalScore === 'number' && typeof test.maxScore === 'number' && test.maxScore > 0) {
    score = (test.totalScore / test.maxScore) * 100;
  } else {
    // Systematic derivation when test not yet completed:
    // Tech students with multiple programming languages and strong GPA have proven algorithmic competence
    const langs = raw.programmingLanguages || raw.skills || [];
    if (langs.length >= 3) score += 4;
    const gpaVal = parseFloat(String(raw.cgpa || raw.gpa || '0'));
    if (!isNaN(gpaVal) && (gpaVal >= 3.6 || gpaVal >= 8.5)) score += 4;
  }

  // Apply What-If scenario modifiers directly to Aptitude
  if (whatIf?.improvedDSA || whatIf?.selectedScenarios?.includes('improvedDSA')) {
    score += 15; // Master Data Structures & Algorithms directly elevates aptitude & logic score
  }

  return Math.min(100, Math.max(30, Math.round(score)));
}

/**
 * Normalizes domain preferences and tech specialization clarity to 0-100 scale.
 */
export function normalizeDomainPreferences(raw: {
  domainPreferences?: any;
  careerPreferences?: any;
  targetIndustries?: string[];
  interests?: string[];
}): number {
  const domains = raw.domainPreferences || raw.careerPreferences || raw.targetIndustries;

  if (Array.isArray(domains)) {
    if (domains.length === 0) return 55;
    if (domains.length === 1) return 75;
    return 90;
  }

  if (domains && typeof domains === 'object') {
    const ratings = Object.values(domains).filter(r => typeof r === 'number' && !isNaN(r as number));
    if (ratings.length > 0) {
      const avg = (ratings as number[]).reduce((a, b) => a + b, 0) / ratings.length;
      return Math.min(100, Math.max(40, Math.round((avg / 5) * 100)));
    }
  }

  return 65;
}

/**
 * Normalizes work environment preferences and cultural adaptability to 0-100 scale.
 */
export function normalizeWorkEnvironment(
  raw: {
    workEnvironment?: any;
    workPreferences?: any;
    workPreference?: string;
    preferredWorkStyle?: string;
  },
  whatIf?: WhatIfSimulationModifiers
): number {
  let score = 70;
  const env = raw.workEnvironment || raw.workPreferences;

  if (env && typeof env === 'object') {
    if (env.environment || env.companySize) score += 12;
    if (env.workStyle || env.workLifePriority) score += 8;
  } else if (raw.workPreference || raw.preferredWorkStyle) {
    score = 80;
  }

  // Work experience through internship directly elevates workplace readiness
  if (
    whatIf?.cloudInternship ||
    whatIf?.internshipExperience ||
    whatIf?.selectedScenarios?.includes('cloudInternship') ||
    whatIf?.selectedScenarios?.includes('internshipExperience')
  ) {
    score += 10;
  }

  return Math.min(100, Math.max(40, Math.round(score)));
}

/**
 * Normalizes career goals, clarity of target role, and compensation expectations to 0-100 scale.
 */
export function normalizeCareerGoals(raw: {
  careerGoals?: any;
  dreamRole?: string;
  dreamCompany?: string;
  expectedSalary?: string;
}): number {
  let score = 40;
  const goals = raw.careerGoals;

  const targetRole = typeof goals === 'object' ? goals?.targetRole : raw.dreamRole;
  const dreamCompany = typeof goals === 'object' ? goals?.dreamCompany : raw.dreamCompany;
  const expectedSalary = typeof goals === 'object' ? goals?.expectedSalary : raw.expectedSalary;
  const goalsStatement = typeof goals === 'string' ? goals : (goals?.postGradGoal || '');

  if (targetRole && targetRole.trim().length > 2) score += 25;
  if (dreamCompany && dreamCompany.trim().length > 1) score += 15;
  if (expectedSalary && expectedSalary.trim().length > 1) score += 10;
  if (goalsStatement && goalsStatement.trim().length > 10) score += 10;

  return Math.min(100, Math.max(40, Math.round(score)));
}

/**
 * MASTER EVALUATOR: Calculates the transparent 11-Dimensional Holistic Career Readiness Score.
 * 
 * Supports both StudentProfile objects and AssessmentResponses objects.
 * Guarantees a deterministic score where weights strictly sum to 100%.
 */
export function calculate11DimensionReadiness(
  input: StudentProfile | AssessmentResponses | any,
  whatIf?: WhatIfSimulationModifiers
): CareerReadinessResult {
  // Safe extraction across both profile formats
  const dims = input?.structuredAssessment?.dimensions || input?.dimensions || input || {};
  const personalInfo = dims.academicBackground || dims.personalInfo || input?.personalInfo || input || {};
  const technicalSkills = dims.technicalSkills || input?.technicalSkills || input || {};
  const projectExperience = dims.projectsAndExperience || dims.projectExperience || input?.projectExperience || input || {};
  const certifications = dims.certifications || input?.certifications || input || {};
  const interests = dims.interests || input?.interests || input || {};
  const personality = dims.personalityAndWorkStyle || dims.personality || input?.personality || input || {};
  const learningStyle = dims.learningPreferences || dims.learningStyle || input?.learningStyle || input || {};
  const aptitude = dims.aptitude || dims.aptitudeTest || input?.aptitudeTest || input || {};
  const domainPrefs = dims.careerDomainPreferences || dims.careerPreferences || input?.careerPreferences || dims.domainPreferences || input?.domainPreferences || input || {};
  const workEnv = dims.workEnvironmentPreferences || dims.workPreferences || input?.workPreferences || dims.workEnvironment || input?.workEnvironment || input || {};
  const careerGoals = dims.careerGoals || input?.careerGoals || input || {};

  // Compute normalized 0-100 scores for each dimension
  const breakdown: DimensionBreakdown = {
    academics: normalizeAcademics(personalInfo),
    technicalSkills: normalizeTechnicalSkills(technicalSkills, whatIf),
    projects: normalizeProjects(projectExperience, whatIf),
    certifications: normalizeCertifications(certifications, whatIf),
    interests: normalizeInterests(interests),
    personality: normalizePersonality(personality),
    learningStyle: normalizeLearningStyle(learningStyle),
    aptitude: normalizeAptitude(aptitude, whatIf),
    domainPreferences: normalizeDomainPreferences(domainPrefs),
    workEnvironment: normalizeWorkEnvironment(workEnv, whatIf),
    careerGoals: normalizeCareerGoals(careerGoals),
  };

  // Compute exact weighted sum
  let weightedSum = 0;
  const dimensionDetails: DimensionDetail[] = [];

  for (const key of Object.keys(DIMENSION_WEIGHTS) as Array<keyof DimensionBreakdown>) {
    const score = breakdown[key];
    const weight = DIMENSION_WEIGHTS[key];
    const weightedContribution = Math.round(score * weight * 10) / 10;
    weightedSum += score * weight;

    dimensionDetails.push({
      key,
      label: DIMENSION_LABELS[key],
      score,
      weight,
      weightedContribution,
      description: DIMENSION_DESCRIPTIONS[key],
    });
  }

  // Realistic boundary clamp [25, 98]
  const readinessScore = Math.min(98, Math.max(25, Math.round(weightedSum)));

  // Generate transparent summary of the top driving dimensions
  const sortedByScore = [...dimensionDetails].sort((a, b) => b.score - a.score);
  const topStrength = sortedByScore[0];
  const secondaryStrength = sortedByScore[1];
  const lowestArea = sortedByScore[sortedByScore.length - 1];

  const summary = `Multi-dimensional evaluation indicates an overall career readiness index of ${readinessScore}%. Key strengths include ${topStrength.label} (${topStrength.score}/100) and ${secondaryStrength.label} (${secondaryStrength.score}/100), with greatest growth upside in ${lowestArea.label} (${lowestArea.score}/100).`;

  return {
    readinessScore,
    breakdown,
    dimensionDetails,
    summary,
  };
}
