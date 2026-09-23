import { Router, Response } from 'express';
import { optionalAuthOrGuest, AuthenticatedRequest } from '../middleware/auth';
import { expensiveAiLimiter } from '../middleware/rateLimit';
import { validateAssessmentRequest } from '../middleware/requestValidation';
import { getGeminiClient, generateGeminiContentWithFallback } from '../services/gemini';
import { parseJSONFromResponse } from '../services/jsonParser';
import { validateAndNormalizeAssessmentReport } from '../services/validation';
import { getFallbackAssessmentReport } from '../fallbacks/fallbackData';
import { logger } from '../services/logger';

const router = Router();

// 9. AI Career Assessment Analyzer Handler
const handleCareerAssessmentRoute = async (req: AuthenticatedRequest, res: Response) => {
  const startTime = Date.now();
  const uid = req.user?.uid || 'guest';

  try {
    const responses = req.body.responses || req.body;
    const whatIfParams = req.body.whatIfParams;
    const aptitudeScore = req.body.aptitudeScore;

    // Support structured assessment dimensions object or flat responses across all 11+ dimensions
    const dims = responses.structuredAssessment?.dimensions || responses.dimensions || responses;
    const personalInfo = dims.academicBackground || dims.personalInfo || responses.personalInfo || {};
    const careerGoals = dims.careerGoals || responses.careerGoals || {};
    const technicalSkills = dims.technicalSkills || responses.technicalSkills || {};
    const projectExperience = dims.projectsAndExperience || dims.projectExperience || responses.projectExperience || [];
    const certifications = dims.certifications || responses.certifications || [];
    const interests = dims.interests || responses.interests || [];
    const personality = dims.personalityAndWorkStyle || dims.personality || responses.personality || {};
    const learningStyle = dims.learningPreferences || dims.learningStyle || responses.learningStyle || {};
    const aptitudeTest = dims.aptitude || dims.aptitudeTest || responses.aptitudeTest || {};
    if (typeof aptitudeScore === 'number' && !aptitudeTest.percentage) {
      aptitudeTest.percentage = aptitudeScore;
    }
    const careerPreferences = dims.careerDomainPreferences || dims.careerPreferences || responses.careerPreferences || {};
    const workPreferences = dims.workEnvironmentPreferences || dims.workPreferences || responses.workPreferences || {};
    const selfEvaluation = dims.selfEvaluation || responses.selfEvaluation || {};

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      logger.info('Gemini API key missing; serving deterministic assessment report', { uid });
      res.setHeader('X-AI-Service-Status', 'deterministic_fallback');
      const fallbackReport = getFallbackAssessmentReport(responses, whatIfParams);
      const validatedFallback = validateAndNormalizeAssessmentReport(fallbackReport, responses, whatIfParams);
      return res.json(validatedFallback);
    }

    const ai = getGeminiClient();

    // 10-Point Explicit Prompt for Gemini with strict zero-generic-advice mandate
    const prompt = `
You are CareerCompass AI, an expert Senior Principal AI Career Strategist and Technical Talent Advisor.
You must conduct an exhaustive, evidence-based career analysis of the university student based on their complete multi-dimensional assessment.

CRITICAL DIRECTIVE ON CAREER ADVICE QUALITY:
- DO NOT generate generic, platitudinous, or cookie-cutter career advice.
- Every insight, recommendation, weakness, and milestone MUST be grounded directly in the student's verified skills, projects, coursework, and evaluation dimensions.
- Career recommendations MUST NEVER be determined from aptitude test scores alone. Aptitude is strictly ONE contributing factor among all 11 evaluation dimensions.

MANDATORY 10-POINT ANALYSIS REQUIREMENTS:
1. ANALYZE EVERY RELEVANT ASSESSMENT DIMENSION:
   - Dimension 1 (Academic Background): Degree, Major (${personalInfo.department || personalInfo.major || 'Computer Science'}), Semester (${personalInfo.semester || 'N/A'}), CGPA (${personalInfo.cgpa || 'N/A'}), University (${personalInfo.university || 'N/A'}), Preferred Location (${personalInfo.preferredLocation || 'Flexible'})
   - Dimension 2 (Career Goals): Target Role (${careerGoals.targetRole || 'Software Engineer'}), Secondary Role (${careerGoals.secondaryRole || 'None'}), Target Companies (${careerGoals.dreamCompany || 'Top Tech'}), Post-Grad Goal (${careerGoals.postGradGoal || 'Employment'}), Expected Salary (${careerGoals.expectedSalary || 'Market Rate'}), Work Arrangement (${careerGoals.workArrangement || 'Flexible'})
   - Dimension 3 (Technical Skills): Languages (${JSON.stringify(technicalSkills.programmingLanguages || [])}), Frameworks (${JSON.stringify(technicalSkills.frameworks || [])}), Tools (${JSON.stringify(technicalSkills.toolsAndPlatforms || [])}), Databases (${JSON.stringify(technicalSkills.databases || [])})
   - Dimension 4 (Projects & Experience): ${JSON.stringify(projectExperience)}
   - Dimension 5 (Certifications): ${JSON.stringify(certifications)}
   - Dimension 6 (Interests & Passions): ${JSON.stringify(interests)}
   - Dimension 7 (Personality & Work Style): Collaboration (${personality.collaborationStyle || 'Balanced'}), Problem Solving (${personality.problemSolvingApproach || 'Analytical'}), Risk Appetite (${personality.riskTolerance || 'Calculated'})
   - Dimension 8 (Learning Preferences): Weekly Hours (${learningStyle.weeklyCommitmentHours || 15} hrs/week), Format (${learningStyle.preferredFormat || 'Interactive projects'})
   - Dimension 9 (Aptitude Assessment): Logical (${aptitudeTest.logicalReasoningScore || 'N/A'}), Quantitative (${aptitudeTest.quantitativeScore || 'N/A'}), Overall (${aptitudeTest.percentage || aptitudeScore || 80}%)
   - Dimension 10 (Career Domain & Work Preferences): Preferred Domains (${JSON.stringify(careerPreferences.domains || [])}), Environment (${JSON.stringify(workPreferences)})
   - Dimension 11 (Self-Evaluation): Confidence (${selfEvaluation.overallConfidence || 'Moderate'})

2. GENERATE EXACTLY 3 DISTINCT, GROUNDED CAREER PATHS:
   Each career path must feature:
   - Specific role title
   - Match Score (0-100)
   - "whyRecommended": Concrete explanation showing multi-factor alignment
   - "supportingFactors": Array of 3 specific evidentiary points
   - "areasForImprovement": Array of 2 technical or strategic gaps
   - "requiredSkills", "matchingSkills", "missingSkills"
   - "salaryRanges": { entry, mid, senior }
   - "demandGrowth" and "futureDemand"
   - "topEmployers"

3. READINESS RADAR & CATEGORY BREAKDOWN:
   - Technical Competence (0-100)
   - Project Depth (0-100)
   - Industry Alignment (0-100)
   - Problem Solving & Aptitude (0-100)
   - Soft Skills & Collaboration (0-100)

4. SKILL GAP CLOSURE MATRIX & ACTIONABLE ROADMAP:
   - Immediate Next Steps (Day 1 - Day 30)
   - Mid-term Objectives (Months 2 - 4)
   - Portfolio Project Proposal with real architecture deliverables

Return a valid JSON object matching the standard Career Assessment Report schema.
Return ONLY valid JSON.
`;

    const rawText = await generateGeminiContentWithFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.65,
      },
    });

    const parsed = parseJSONFromResponse(rawText);
    const validated = validateAndNormalizeAssessmentReport(parsed, responses, whatIfParams);

    logger.info('Career assessment report generated and validated successfully', {
      uid,
      durationMs: Date.now() - startTime
    });

    return res.json(validated);
  } catch (err: any) {
    logger.error('Error generating career assessment report, falling back to deterministic dataset:', err, {
      uid,
      durationMs: Date.now() - startTime
    });
    res.setHeader('X-AI-Service-Status', 'fallback_recovered');
    const fallbackReport = getFallbackAssessmentReport(req.body.responses || req.body, req.body.whatIfParams);
    const validatedFallback = validateAndNormalizeAssessmentReport(fallbackReport, req.body.responses || req.body, req.body.whatIfParams);
    return res.json(validatedFallback);
  }
};

router.post('/career-assessment/analyze', optionalAuthOrGuest, expensiveAiLimiter, validateAssessmentRequest, handleCareerAssessmentRoute);
router.post('/gemini/career-assessment', optionalAuthOrGuest, expensiveAiLimiter, validateAssessmentRequest, handleCareerAssessmentRoute);

export default router;
