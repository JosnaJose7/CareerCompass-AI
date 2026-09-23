import { Router, Response } from 'express';
import { optionalAuthOrGuest, AuthenticatedRequest } from '../middleware/auth';
import { expensiveAiLimiter } from '../middleware/rateLimit';
import { validateResumeRequest } from '../middleware/requestValidation';
import { getGeminiClient, generateGeminiContentWithFallback } from '../services/gemini';
import { parseJSONFromResponse } from '../services/jsonParser';
import { extractTextFromPDFBase64 } from '../services/resumeParser';
import { getFallbackResumeAnalysis } from '../fallbacks/fallbackData';
import { logger } from '../services/logger';

const router = Router();

// 3. Resume & Portfolio Analyzer Endpoint (Supports Text & PDF upload up to 15MB)
router.post(
  '/resume-analyzer',
  optionalAuthOrGuest,
  expensiveAiLimiter,
  validateResumeRequest,
  async (req: AuthenticatedRequest, res: Response) => {
    const startTime = Date.now();
    const uid = req.user?.uid || 'guest';
    let { resumeText, pdfBase64, targetRole } = req.body;
    targetRole = targetRole || 'Software Engineer';

    try {
      // If PDF base64 is provided and resumeText is short/missing, extract text from PDF on server
      if (pdfBase64 && (!resumeText || resumeText.length < 50)) {
        try {
          const extracted = await extractTextFromPDFBase64(pdfBase64);
          if (extracted && extracted.trim().length > 0) {
            resumeText = extracted;
          }
        } catch (err: any) {
          logger.warn('Server PDF extraction notice, proceeding with text:', { reason: err?.message });
        }
      }

      if (!resumeText || !resumeText.trim()) {
        return res.status(400).json({
          error: 'Unable to extract legible text from the uploaded document. Please paste resume text directly.',
          code: 'INVALID_RESUME_CONTENT'
        });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        logger.info('Gemini API key missing; serving deterministic resume analysis', { uid, targetRole });
        res.setHeader('X-AI-Service-Status', 'deterministic_fallback');
        return res.json(getFallbackResumeAnalysis(targetRole));
      }

      const ai = getGeminiClient();
      const prompt = `
You are an expert ATS (Applicant Tracking System) parser, Tech Recruiter, and Senior Resume Auditor.
Analyze this student resume for the target position: "${targetRole}".

Resume Content:
"""
${resumeText.substring(0, 15000)}
"""

Perform a detailed evaluation covering:
1. Overall Resume Score (0-100) and ATS Score (0-100)
2. Category Scores: ATS Compatibility, Impact & Action Verbs, Technical Depth, Grammar & Readability
3. Grammar Analysis: Grammar score (0-100), count of issues found, specific grammar & phrasing feedback items, tone and clarity assessment
4. Skills Analysis: Identified technical skills, frameworks/tools, soft skills, and skill proficiency level estimate
5. Missing Keywords: Key industry/role terms missing for "${targetRole}"
6. Projects Analysis: Project section quality score (0-100), key project strengths, project weaknesses/vague points, and impact quantification tips
7. Generated Suggestions: High-impact bullet point rewrites (Original vs High-Impact Rewrite vs Recruiter Reason), general actionable recommendations, structural format items

Return a valid JSON object matching this structure EXACTLY:
{
  "resumeScore": 86,
  "atsScore": 84,
  "targetRole": "${targetRole}",
  "overallSummary": "A strong student resume with solid technical coursework. Enhancing project metrics and fixing minor passive phrasing will significantly boost call-through rates.",
  "categoryScores": {
    "atsCompatibility": 88,
    "impactAndAction": 82,
    "technicalDepth": 90,
    "grammarAndStyle": 86
  },
  "grammarAnalysis": {
    "score": 88,
    "issueCount": 2,
    "feedbackItems": [
      {
        "type": "Clarity / Conciseness",
        "description": "Replaced passive phrasing with direct metric-driven active verbs.",
        "snippet": "Was responsible for developing REST endpoints",
        "suggestion": "Architected 6 REST API endpoints in Node.js, slashing reservation latency by 35%."
      }
    ],
    "toneAssessment": "Professional and technically focused with good readability."
  },
  "skillsAnalysis": {
    "technicalSkills": ["Python", "TypeScript", "React", "Node.js", "SQL", "Git"],
    "frameworksAndTools": ["Express", "Tailwind CSS", "PostgreSQL", "Docker", "AWS"],
    "softSkills": ["Problem Solving", "Cross-functional Collaboration", "System Design"],
    "proficiencyLevel": "Intermediate / Advanced Undergraduate"
  },
  "missingKeywords": ["CI/CD Pipeline", "Unit Testing", "Microservices Architecture", "Redis Caching"],
  "projectsAnalysis": {
    "score": 85,
    "strengths": [
      "Projects clearly highlight end-to-end full stack architecture with realistic user impact.",
      "Effective demonstration of modern AI API integration."
    ],
    "weaknesses": [
      "Lacks concrete quantified business or performance metrics on project 2.",
      "Missing public live demo URL link in project descriptions."
    ],
    "quantificationTips": [
      "Always include metrics: users served, percentage speed improvements, test coverage numbers, or query latency drops.",
      "Specify exact database record volume handled."
    ]
  },
  "suggestions": {
    "bulletPointRewrites": [
      {
        "original": "Worked on the frontend using React and fixed bugs.",
        "rewrite": "Engineered 12 responsive React components and resolved 25+ critical UI issues, elevating Lighthouse accessibility score from 74 to 98.",
        "reason": "Quantifies engineering volume and proves tangible user-facing value."
      }
    ],
    "actionableRecommendations": [
      "Add a dedicated 'Key Technical Accomplishments' or 'Featured Projects' section near top of page.",
      "Link your GitHub profile and include live deployment links for all major projects."
    ],
    "formattingTips": [
      "Ensure uniform date formatting throughout (e.g., 'June 2025 – August 2025').",
      "Keep margins between 0.5 and 0.75 inches for clean single-page printing."
    ]
  }
}

Return ONLY valid JSON.
`;

      const rawText = await generateGeminiContentWithFallback(ai, {
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.6,
        },
      });

      const parsed = parseJSONFromResponse(rawText);
      logger.info('Resume analysis completed successfully', {
        uid,
        targetRole,
        durationMs: Date.now() - startTime
      });
      return res.json(parsed);
    } catch (err: any) {
      logger.error('Error analyzing resume, falling back to deterministic result:', err, {
        uid,
        targetRole,
        durationMs: Date.now() - startTime
      });
      res.setHeader('X-AI-Service-Status', 'fallback_recovered');
      return res.json(getFallbackResumeAnalysis(targetRole));
    }
  }
);

export default router;
