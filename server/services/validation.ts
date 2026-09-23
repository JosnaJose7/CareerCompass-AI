import { DIMENSION_WEIGHTS } from './scoring';
import { getFallbackAssessmentReport } from '../fallbacks/fallbackData';

/**
 * Server-side JSON Validator & Normalizer to guarantee strict adherence to AssessmentReport schema
 */
export function validateAndNormalizeAssessmentReport(data: any, responses: any, whatIfParams?: any) {
  const fallback = getFallbackAssessmentReport(responses, whatIfParams);

  if (!data || typeof data !== 'object') {
    return fallback;
  }

  // 1. Readiness Score & 11-Dimensional Holistic Breakdown
  let readinessBreakdown = fallback.readinessBreakdown;
  let readinessScore = fallback.readinessScore;

  if (data.readinessBreakdown && typeof data.readinessBreakdown === 'object') {
    readinessBreakdown = {
      academics: typeof data.readinessBreakdown.academics === 'number' && !isNaN(data.readinessBreakdown.academics)
        ? Math.min(100, Math.max(0, Math.round(data.readinessBreakdown.academics)))
        : fallback.readinessBreakdown.academics,
      technicalSkills: typeof data.readinessBreakdown.technicalSkills === 'number' && !isNaN(data.readinessBreakdown.technicalSkills)
        ? Math.min(100, Math.max(0, Math.round(data.readinessBreakdown.technicalSkills)))
        : fallback.readinessBreakdown.technicalSkills,
      projects: typeof data.readinessBreakdown.projects === 'number' && !isNaN(data.readinessBreakdown.projects)
        ? Math.min(100, Math.max(0, Math.round(data.readinessBreakdown.projects)))
        : fallback.readinessBreakdown.projects,
      certifications: typeof data.readinessBreakdown.certifications === 'number' && !isNaN(data.readinessBreakdown.certifications)
        ? Math.min(100, Math.max(0, Math.round(data.readinessBreakdown.certifications)))
        : fallback.readinessBreakdown.certifications,
      interests: typeof data.readinessBreakdown.interests === 'number' && !isNaN(data.readinessBreakdown.interests)
        ? Math.min(100, Math.max(0, Math.round(data.readinessBreakdown.interests)))
        : fallback.readinessBreakdown.interests,
      personality: typeof data.readinessBreakdown.personality === 'number' && !isNaN(data.readinessBreakdown.personality)
        ? Math.min(100, Math.max(0, Math.round(data.readinessBreakdown.personality)))
        : fallback.readinessBreakdown.personality,
      learningStyle: typeof data.readinessBreakdown.learningStyle === 'number' && !isNaN(data.readinessBreakdown.learningStyle)
        ? Math.min(100, Math.max(0, Math.round(data.readinessBreakdown.learningStyle)))
        : fallback.readinessBreakdown.learningStyle,
      aptitude: typeof data.readinessBreakdown.aptitude === 'number' && !isNaN(data.readinessBreakdown.aptitude)
        ? Math.min(100, Math.max(0, Math.round(data.readinessBreakdown.aptitude)))
        : fallback.readinessBreakdown.aptitude,
      domainPreferences: typeof data.readinessBreakdown.domainPreferences === 'number' && !isNaN(data.readinessBreakdown.domainPreferences)
        ? Math.min(100, Math.max(0, Math.round(data.readinessBreakdown.domainPreferences)))
        : fallback.readinessBreakdown.domainPreferences,
      workEnvironment: typeof data.readinessBreakdown.workEnvironment === 'number' && !isNaN(data.readinessBreakdown.workEnvironment)
        ? Math.min(100, Math.max(0, Math.round(data.readinessBreakdown.workEnvironment)))
        : fallback.readinessBreakdown.workEnvironment,
      careerGoals: typeof data.readinessBreakdown.careerGoals === 'number' && !isNaN(data.readinessBreakdown.careerGoals)
        ? Math.min(100, Math.max(0, Math.round(data.readinessBreakdown.careerGoals)))
        : fallback.readinessBreakdown.careerGoals,
    };

    // Calculate exact weighted sum
    let weightedSum = 0;
    for (const key of Object.keys(DIMENSION_WEIGHTS) as Array<keyof typeof DIMENSION_WEIGHTS>) {
      weightedSum += readinessBreakdown[key] * DIMENSION_WEIGHTS[key];
    }
    readinessScore = Math.min(98, Math.max(25, Math.round(weightedSum)));
  } else if (typeof data.readinessScore === 'number' && !isNaN(data.readinessScore)) {
    readinessScore = Math.min(98, Math.max(25, Math.round(data.readinessScore)));
  }

  // 2. Executive Summary
  const summary = typeof data.summary === 'string' && data.summary.trim().length > 10
    ? data.summary.trim()
    : fallback.summary;

  // 3. Top Recommendations (up to 5 careers)
  let topRecommendations: any[] = [];
  if (Array.isArray(data.topRecommendations) && data.topRecommendations.length > 0) {
    topRecommendations = data.topRecommendations.slice(0, 5).map((rec: any, idx: number) => {
      const defaultRec = fallback.topRecommendations[idx] || fallback.topRecommendations[0];
      const matchScore = typeof rec.matchScore === 'number' && !isNaN(rec.matchScore)
        ? Math.min(100, Math.max(30, Math.round(rec.matchScore)))
        : defaultRec.matchScore;

      const title = typeof rec.title === 'string' && rec.title.trim() ? rec.title.trim() : defaultRec.title;
      const shortSummary = typeof rec.shortSummary === 'string' && rec.shortSummary.trim() ? rec.shortSummary.trim() : defaultRec.shortSummary;
      const whyRecommended = typeof rec.whyRecommended === 'string' && rec.whyRecommended.trim() ? rec.whyRecommended.trim() : defaultRec.whyRecommended;
      
      const supportingFactors = Array.isArray(rec.supportingFactors) && rec.supportingFactors.length > 0
        ? rec.supportingFactors.filter((s: any) => typeof s === 'string' && s.trim())
        : defaultRec.supportingFactors;

      const areasForImprovement = Array.isArray(rec.areasForImprovement) && rec.areasForImprovement.length > 0
        ? rec.areasForImprovement.filter((s: any) => typeof s === 'string' && s.trim())
        : defaultRec.areasForImprovement;

      const requiredSkills = Array.isArray(rec.requiredSkills) && rec.requiredSkills.length > 0
        ? rec.requiredSkills.filter((s: any) => typeof s === 'string' && s.trim())
        : defaultRec.requiredSkills;

      const matchingSkills = Array.isArray(rec.matchingSkills) && rec.matchingSkills.length > 0
        ? rec.matchingSkills.filter((s: any) => typeof s === 'string' && s.trim())
        : defaultRec.matchingSkills;

      const relevantInterests = Array.isArray(rec.relevantInterests) && rec.relevantInterests.length > 0
        ? rec.relevantInterests.filter((s: any) => typeof s === 'string' && s.trim())
        : defaultRec.relevantInterests;

      const relevantProjects = Array.isArray(rec.relevantProjects) && rec.relevantProjects.length > 0
        ? rec.relevantProjects.filter((s: any) => typeof s === 'string' && s.trim())
        : defaultRec.relevantProjects;

      const relevantAssessmentStrengths = Array.isArray(rec.relevantAssessmentStrengths) && rec.relevantAssessmentStrengths.length > 0
        ? rec.relevantAssessmentStrengths.filter((s: any) => typeof s === 'string' && s.trim())
        : defaultRec.relevantAssessmentStrengths;

      const missingSkills = Array.isArray(rec.missingSkills) && rec.missingSkills.length > 0
        ? rec.missingSkills.filter((s: any) => typeof s === 'string' && s.trim())
        : defaultRec.missingSkills;

      const recommendedNextSteps = Array.isArray(rec.recommendedNextSteps) && rec.recommendedNextSteps.length > 0
        ? rec.recommendedNextSteps.filter((s: any) => typeof s === 'string' && s.trim())
        : defaultRec.recommendedNextSteps;

      const dayInLife = typeof rec.dayInLife === 'string' && rec.dayInLife.trim() ? rec.dayInLife.trim() : defaultRec.dayInLife;
      
      const salaryRanges = {
        entry: rec.salaryRanges?.entry || defaultRec.salaryRanges.entry,
        mid: rec.salaryRanges?.mid || defaultRec.salaryRanges.mid,
        senior: rec.salaryRanges?.senior || defaultRec.salaryRanges.senior
      };

      const demandGrowth = typeof rec.demandGrowth === 'string' && rec.demandGrowth.trim() ? rec.demandGrowth.trim() : defaultRec.demandGrowth;
      const futureDemand = typeof rec.futureDemand === 'string' && rec.futureDemand.trim() ? rec.futureDemand.trim() : defaultRec.futureDemand;
      const topEmployers = Array.isArray(rec.topEmployers) && rec.topEmployers.length > 0
        ? rec.topEmployers.filter((s: any) => typeof s === 'string' && s.trim())
        : defaultRec.topEmployers;

      return {
        id: rec.id || `rec_${idx + 1}`,
        title,
        matchScore,
        shortSummary,
        whyRecommended,
        supportingFactors,
        areasForImprovement,
        requiredSkills,
        matchingSkills,
        relevantInterests,
        relevantProjects,
        relevantAssessmentStrengths,
        missingSkills,
        recommendedNextSteps,
        dayInLife,
        salaryRanges,
        demandGrowth,
        futureDemand,
        topEmployers
      };
    });
  } else {
    topRecommendations = fallback.topRecommendations;
  }

  // 4. Strengths & Weaknesses
  const strengths = Array.isArray(data.strengthsAndWeaknesses?.strengths) && data.strengthsAndWeaknesses.strengths.length > 0
    ? data.strengthsAndWeaknesses.strengths.filter((s: any) => typeof s === 'string' && s.trim())
    : fallback.strengthsAndWeaknesses.strengths;

  const weaknesses = Array.isArray(data.strengthsAndWeaknesses?.weaknesses) && data.strengthsAndWeaknesses.weaknesses.length > 0
    ? data.strengthsAndWeaknesses.weaknesses.filter((s: any) => typeof s === 'string' && s.trim())
    : fallback.strengthsAndWeaknesses.weaknesses;

  // 5. Skill Gap Analysis
  let skillGapAnalysis: any[] = [];
  if (Array.isArray(data.skillGapAnalysis) && data.skillGapAnalysis.length > 0) {
    skillGapAnalysis = data.skillGapAnalysis.map((gap: any, i: number) => {
      const def = fallback.skillGapAnalysis[i] || fallback.skillGapAnalysis[0];
      return {
        skill: typeof gap.skill === 'string' && gap.skill.trim() ? gap.skill.trim() : def.skill,
        category: typeof gap.category === 'string' && gap.category.trim() ? gap.category.trim() : def.category,
        importance: typeof gap.importance === 'string' && gap.importance.trim() ? gap.importance.trim() : def.importance,
        recommendedCourses: Array.isArray(gap.recommendedCourses) && gap.recommendedCourses.length > 0
          ? gap.recommendedCourses.filter((c: any) => typeof c === 'string' && c.trim())
          : def.recommendedCourses,
        certifications: Array.isArray(gap.certifications) && gap.certifications.length > 0
          ? gap.certifications.filter((c: any) => typeof c === 'string' && c.trim())
          : def.certifications,
        projectIdeas: Array.isArray(gap.projectIdeas) && gap.projectIdeas.length > 0
          ? gap.projectIdeas.filter((p: any) => typeof p === 'string' && p.trim())
          : def.projectIdeas
      };
    });
  } else {
    skillGapAnalysis = fallback.skillGapAnalysis;
  }

  // 6. Action Roadmap (4 Months)
  let actionRoadmap: any[] = [];
  if (Array.isArray(data.actionRoadmap) && data.actionRoadmap.length > 0) {
    actionRoadmap = data.actionRoadmap.map((item: any, i: number) => {
      const def = fallback.actionRoadmap[i] || fallback.actionRoadmap[0];
      return {
        month: typeof item.month === 'string' && item.month.trim() ? item.month.trim() : `Month ${i + 1}`,
        focus: typeof item.focus === 'string' && item.focus.trim() ? item.focus.trim() : def.focus,
        weeklyTasks: Array.isArray(item.weeklyTasks) && item.weeklyTasks.length > 0
          ? item.weeklyTasks.filter((t: any) => typeof t === 'string' && t.trim())
          : def.weeklyTasks
      };
    });
  } else {
    actionRoadmap = fallback.actionRoadmap;
  }

  // 7. Interview Tips
  const interviewTips = Array.isArray(data.interviewTips) && data.interviewTips.length > 0
    ? data.interviewTips.filter((t: any) => typeof t === 'string' && t.trim())
    : fallback.interviewTips;

  // 8. What-If Simulations
  const currentReadiness = typeof data.whatIfSimulations?.currentReadiness === 'number'
    ? Math.min(100, Math.max(20, Math.round(data.whatIfSimulations.currentReadiness)))
    : readinessScore;

  const hypotheticalReadiness = typeof data.whatIfSimulations?.hypotheticalReadiness === 'number'
    ? Math.min(100, Math.max(20, Math.round(data.whatIfSimulations.hypotheticalReadiness)))
    : Math.min(98, readinessScore + 8);

  const impactSummary = typeof data.whatIfSimulations?.impactSummary === 'string' && data.whatIfSimulations.impactSummary.trim()
    ? data.whatIfSimulations.impactSummary.trim()
    : fallback.whatIfSimulations.impactSummary;

  const leveragedImprovements = Array.isArray(data.whatIfSimulations?.leveragedImprovements) && data.whatIfSimulations.leveragedImprovements.length > 0
    ? data.whatIfSimulations.leveragedImprovements.filter((s: any) => typeof s === 'string' && s.trim())
    : fallback.whatIfSimulations.leveragedImprovements;

  return {
    readinessScore,
    readinessBreakdown,
    summary,
    topRecommendations,
    strengthsAndWeaknesses: {
      strengths,
      weaknesses
    },
    skillGapAnalysis,
    actionRoadmap,
    interviewTips,
    whatIfSimulations: {
      currentReadiness,
      hypotheticalReadiness,
      impactSummary,
      leveragedImprovements
    },
    createdAt: new Date().toISOString()
  };
}
