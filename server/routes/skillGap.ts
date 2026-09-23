import { Router, Response } from 'express';
import { optionalAuthOrGuest, AuthenticatedRequest } from '../middleware/auth';
import { standardAiLimiter } from '../middleware/rateLimit';
import { validateSkillGapRequest } from '../middleware/requestValidation';
import { getGeminiClient, generateGeminiContentWithFallback } from '../services/gemini';
import { parseJSONFromResponse } from '../services/jsonParser';
import { getFallbackSkillGapAnalysis } from '../fallbacks/fallbackData';
import { logger } from '../services/logger';

const router = Router();

// 8. Skill Gap Analysis Endpoint
router.post(
  '/skill-gap',
  optionalAuthOrGuest,
  standardAiLimiter,
  validateSkillGapRequest,
  async (req: AuthenticatedRequest, res: Response) => {
    const startTime = Date.now();
    const uid = req.user?.uid || 'guest';
    const { targetRole, profile } = req.body;
    const role = targetRole || profile?.dreamRole || 'Software Engineer';

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        logger.info('Gemini API key missing; serving deterministic skill gap analysis', { uid, role });
        res.setHeader('X-AI-Service-Status', 'deterministic_fallback');
        return res.json(getFallbackSkillGapAnalysis(role, profile));
      }

      const ai = getGeminiClient();
      const prompt = `
You are an expert AI Talent Analyst and Skill Gap Assessment Specialist for university students.
Compare the student's current skills against the current industry standards for the target role: "${role}".

Student Profile:
- Major: ${profile?.major || 'Computer Science'}
- Core Skills: ${(profile?.skills || []).join(', ')}
- Languages: ${(profile?.programmingLanguages || []).join(', ')}
- Frameworks: ${(profile?.frameworks || []).join(', ')}
- Certifications: ${(profile?.certifications || []).join(', ')}
- Projects: ${JSON.stringify(profile?.projects || [])}
- Career Goals: ${profile?.careerGoals || 'Career growth'}

Perform a rigorous comparison between Current Skills and Industry Required Skills for "${role}".

Return a valid JSON object matching this structure EXACTLY:
{
  "targetRole": "${role}",
  "readinessScore": 74,
  "overallSummary": "Solid foundation in core programming and web development. To reach 90%+ competitive readiness for top tier ${role} roles, focus on containerization, CI/CD, and system design.",
  "industryDemandOutlook": "High Demand (+22% YoY growth across enterprise tech and modern startups)",
  "completedSkills": [
    {
      "skill": "TypeScript / JavaScript",
      "category": "Frontend & Systems",
      "proficiency": "Mastered",
      "matchReason": "Strong hands-on experience demonstrated in coursework and portfolio projects."
    },
    {
      "skill": "React & Web Architecture",
      "category": "Frontend Frameworks",
      "proficiency": "Proficient",
      "matchReason": "Directly matches modern frontend software engineering benchmark."
    }
  ],
  "missingSkills": [
    {
      "id": "sg_1",
      "skill": "Docker & Containerization",
      "category": "DevOps & Cloud",
      "priority": "High",
      "currentLevel": "Beginner",
      "targetLevel": "Proficient",
      "gapDescription": "Industry standard for junior candidates mandates containerizing applications for seamless staging and production environments.",
      "estimatedHoursToBridge": 20,
      "recommendedCourses": [
        {
          "title": "Docker for Developers (Docker Captain Series)",
          "platform": "Coursera",
          "url": "https://coursera.org"
        }
      ],
      "recommendedProjects": [
        {
          "title": "Containerized Microservice Deployment",
          "description": "Scaffold a multi-container app with frontend, backend, and PostgreSQL orchestrated via docker-compose."
        }
      ]
    },
    {
      "id": "sg_2",
      "skill": "CI/CD & GitHub Actions Automation",
      "category": "DevOps & Tooling",
      "priority": "High",
      "currentLevel": "None",
      "targetLevel": "Intermediate",
      "gapDescription": "Top engineering teams look for candidates who automate testing and linting upon pull request creation.",
      "estimatedHoursToBridge": 15,
      "recommendedCourses": [
        {
          "title": "Automated Testing & GitHub Actions",
          "platform": "freeCodeCamp",
          "url": "https://freecodecamp.org"
        }
      ],
      "recommendedProjects": [
        {
          "title": "Automated Lint, Test, & Preview Workflow",
          "description": "Configure GitHub Actions pipeline that lints TypeScript, executes Jest unit tests, and triggers automated cloud preview builds."
        }
      ]
    },
    {
      "id": "sg_3",
      "skill": "System Design Fundamentals & Caching",
      "category": "Architecture",
      "priority": "Medium",
      "currentLevel": "Beginner",
      "targetLevel": "Intermediate",
      "gapDescription": "Understanding horizontal scaling, load balancing, and Redis caching is key for technical rounds.",
      "estimatedHoursToBridge": 25,
      "recommendedCourses": [
        {
          "title": "System Design for University Grads",
          "platform": "Educative.io",
          "url": "https://educative.io"
        }
      ],
      "recommendedProjects": [
        {
          "title": "Distributed Rate Limiter & Cache Service",
          "description": "Implement an in-memory Redis cache with sliding window rate limiting for REST endpoints."
        }
      ]
    }
  ],
  "learningTracks": [
    {
      "track": "High-Priority 30-Day Sprint",
      "timeframe": "Weeks 1-4",
      "description": "Fast-track closure of production deployment and containerization gaps.",
      "skillsCovered": ["Docker", "CI/CD Pipelines", "Automated Testing"]
    },
    {
      "track": "Architecture & Interview Deep Dive",
      "timeframe": "Weeks 5-8",
      "description": "Deepen backend scale and system design interview readiness.",
      "skillsCovered": ["System Design", "Redis Caching", "Database Indexing"]
    }
  ]
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
      logger.info('Skill gap analysis generated successfully', {
        uid,
        role,
        durationMs: Date.now() - startTime
      });
      return res.json(parsed);
    } catch (err: any) {
      logger.error('Error generating skill gap analysis, falling back to deterministic dataset:', err, {
        uid,
        role,
        durationMs: Date.now() - startTime
      });
      res.setHeader('X-AI-Service-Status', 'fallback_recovered');
      return res.json(getFallbackSkillGapAnalysis(role, profile));
    }
  }
);

export default router;
