import { Router, Response } from 'express';
import { optionalAuthOrGuest, AuthenticatedRequest } from '../middleware/auth';
import { standardAiLimiter } from '../middleware/rateLimit';
import { validateRecommendationsRequest } from '../middleware/requestValidation';
import { getGeminiClient, generateGeminiContentWithFallback } from '../services/gemini';
import { parseJSONFromResponse } from '../services/jsonParser';
import { getFallbackRecommendations } from '../fallbacks/fallbackData';
import { logger } from '../services/logger';

const router = Router();

// 1. Career Discovery & Recommendations Endpoint
router.post(
  '/recommendations',
  optionalAuthOrGuest,
  standardAiLimiter,
  validateRecommendationsRequest,
  async (req: AuthenticatedRequest, res: Response) => {
    const startTime = Date.now();
    const profile = req.body;
    const uid = req.user?.uid || 'guest';

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        logger.info('Gemini API key missing; serving deterministic career recommendations', { uid });
        res.setHeader('X-AI-Service-Status', 'deterministic_fallback');
        return res.json({
          recommendations: getFallbackRecommendations(profile)
        });
      }

      const ai = getGeminiClient();
      const prompt = `
You are CareerCompass AI, an expert career counselor and talent strategist for university students.
Analyze the following comprehensive university student profile and recommend TOP 5 distinct, highly relevant, and realistic career paths.

CRITICAL MANDATE FOR RECOMMENDATIONS:
Career recommendations MUST NEVER be determined from aptitude scores alone.
You MUST consider the candidate's complete 11-dimension student profile:
1. Academic background (Degree, Major, Semester, CGPA)
2. Technical skills and proficiency (Languages, Frameworks, Tools)
3. Projects and experience (Hands-on portfolio apps, hackathons, internships)
4. Certifications
5. Interests & Passions
6. Personality / work-style responses
7. Learning preferences & weekly commitment
8. Aptitude assessment results (strictly ONE supporting factor among all 11)
9. Career domain preferences
10. Work-environment preferences
11. Career goals & salary expectations

Student Profile Data:
- Full Name: ${profile.fullName || 'Student'}
- University: ${profile.university || 'University'}
- Department: ${profile.department || 'N/A'}
- Major: ${profile.major}
- Semester: ${profile.semester || 'N/A'}
- Graduation Year: ${profile.gradYear || '2026'}
- CGPA / GPA: ${profile.cgpa || profile.gpa || 'N/A'}
- Programming Languages: ${(profile.programmingLanguages || []).join(', ')}
- Frameworks & Tools: ${(profile.frameworks || []).join(', ')}
- Core Skills: ${(profile.skills || []).join(', ')}
- Interests & Domains: ${(profile.interests || []).join(', ')}
- Certifications: ${(profile.certifications || []).join(', ')}
- Achievements: ${(profile.achievements || []).join(', ')}
- Internships: ${JSON.stringify(profile.internships || [])}
- Projects: ${JSON.stringify(profile.projects || [])}
- Hackathons: ${JSON.stringify(profile.hackathons || [])}
- Dream Company: ${profile.dreamCompany || 'Top Tech Company'}
- Dream Role: ${profile.dreamRole || 'Software Engineer'}
- Preferred Country: ${profile.preferredCountry || 'Global / Remote'}
- Preferred Work Style: ${profile.preferredWorkStyle || profile.workPreference || 'Flexible'}
- Expected Salary: ${profile.expectedSalary || 'Standard Tech Salary'}
- Career Goals: ${profile.careerGoals || 'Not specified'}

For EVERY recommended career path, generate a transparent explanation showing which factors contributed to the recommendation.

Return a valid JSON object matching this structure EXACTLY with TOP 5 career recommendations:
{
  "recommendations": [
    {
      "id": "rec_1",
      "title": "Exact Role Title",
      "matchScore": 95,
      "shortSummary": "A concise 2-sentence summary of why this role aligns with the student profile.",
      "whyRecommended": "Recommended because: High technical alignment with Python and React, strong quantitative aptitude, matching interests in Machine Learning, and proven hackathon experience.",
      "supportingFactors": [
        "Major in Computer Science directly satisfies core educational prerequisites",
        "Experience in TypeScript and React aligns with production engineering requirements",
        "Demonstrated project portfolio in AI applications"
      ],
      "areasForImprovement": [
        "Strengthen containerization skills with Docker and Kubernetes",
        "Gain hands-on experience with cloud deployment on AWS or GCP"
      ],
      "requiredSkills": ["Python", "Machine Learning", "PyTorch", "Docker", "SQL"],
      "matchingSkills": ["Python", "SQL", "Git"],
      "relevantInterests": ["Artificial Intelligence", "Data Science"],
      "relevantProjects": ["AI Code Assistant Chrome Extension"],
      "relevantAssessmentStrengths": ["Logical Reasoning", "Quantitative Aptitude"],
      "missingSkills": ["PyTorch", "Docker", "Kubernetes"],
      "dayInLife": "A detailed 3-sentence description of a typical work day for this role.",
      "salaryRanges": {
        "entry": "$95,000 - $125,000",
        "mid": "$135,000 - $175,000",
        "senior": "$180,000 - $240,000+"
      },
      "demandGrowth": "+32% YoY High Growth",
      "futureDemand": "5-year industry hiring demand outlook.",
      "topEmployers": ["Google", "Microsoft", "OpenAI", "Anthropic", "Stripe"]
    }
  ]
}

Return ONLY valid JSON.
`;

      const rawText = await generateGeminiContentWithFallback(ai, {
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const parsed = parseJSONFromResponse(rawText);
      logger.info('Recommendations generated successfully', {
        uid,
        durationMs: Date.now() - startTime
      });
      return res.json(parsed);
    } catch (err: any) {
      logger.error('Error in recommendations endpoint, falling back to deterministic dataset:', err, {
        uid,
        durationMs: Date.now() - startTime
      });
      res.setHeader('X-AI-Service-Status', 'fallback_recovered');
      return res.json({
        recommendations: getFallbackRecommendations(profile)
      });
    }
  }
);

export default router;
