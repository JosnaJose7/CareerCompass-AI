import { Router, Response } from 'express';
import { optionalAuthOrGuest, AuthenticatedRequest } from '../middleware/auth';
import { expensiveAiLimiter } from '../middleware/rateLimit';
import { validateRoadmapRequest } from '../middleware/requestValidation';
import { getGeminiClient, generateGeminiContentWithFallback } from '../services/gemini';
import { parseJSONFromResponse } from '../services/jsonParser';
import { getFallbackRoadmap } from '../fallbacks/fallbackData';
import { logger } from '../services/logger';

const router = Router();

// 2. Career Roadmap Generator Endpoint
router.post(
  '/roadmap',
  optionalAuthOrGuest,
  expensiveAiLimiter,
  validateRoadmapRequest,
  async (req: AuthenticatedRequest, res: Response) => {
    const startTime = Date.now();
    const { profile, targetRole } = req.body;
    const uid = req.user?.uid || 'guest';

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        logger.info('Gemini API key missing; serving deterministic roadmap', { uid, targetRole });
        res.setHeader('X-AI-Service-Status', 'deterministic_fallback');
        return res.json(getFallbackRoadmap(targetRole));
      }

      const ai = getGeminiClient();
      const prompt = `
You are CareerCompass AI. Create a highly detailed, personalized, step-by-step career readiness roadmap for a university student aiming to land a job as "${targetRole}".

Student Background:
- Major: ${profile?.major || 'Relevant Studies'}
- Current Skills: ${(profile?.skills || []).join(', ')}
- Graduation Year: ${profile?.gradYear || '2026'}

Provide a comprehensive roadmap including:
1. Milestones (3 distinct chronological phases)
2. Monthly Goals (Month 1 to Month 4, each containing 4 actionable Weekly Goals with specific task checklists)
3. Projects (2-3 realistic portfolio projects with tech stack, deliverables, and resume bullet points)
4. Courses (3-4 top recommended courses or certifications)
5. Practice Questions (4-5 technical/interview practice questions with hints and solution summaries)

Return a valid JSON object matching this structure EXACTLY:
{
  "roleTitle": "${targetRole}",
  "overview": "An inspiring 2-3 sentence overview of this career preparation journey.",
  "estimatedTimeToJobReady": "4 - 6 Months",
  "milestones": [
    {
      "id": "m1",
      "period": "Phase 1: Months 1-2 (Technical Foundation & Core Tools)",
      "title": "Master Primary Industry Stack & Tools",
      "description": "Solidify essential tools and core methodologies required for junior ${targetRole} positions.",
      "completed": false,
      "tasks": [
        "Complete advanced tutorial on core framework",
        "Build a mini CLI or foundational API"
      ],
      "recommendedResources": [
        {
          "title": "Coursera: Full-Stack Web Development",
          "type": "Course",
          "url": "https://coursera.org"
        }
      ],
      "resumeBulletSuggestion": "Developed scalable components using React and TypeScript, improving user page speed by 25%."
    }
  ],
  "monthlyGoals": [
    {
      "month": 1,
      "title": "Foundational Mastery & Tooling Setup",
      "focus": "Core engineering principles, clean code, and project scaffolding.",
      "weeklyGoals": [
        {
          "week": 1,
          "focus": "Environment setup, modern Git workflows, and project scaffolding",
          "tasks": ["Initialize repository", "Configure ESLint and TypeScript", "Build basic layout"]
        },
        {
          "week": 2,
          "focus": "Database modeling and API architecture",
          "tasks": ["Design schema", "Create initial REST endpoints", "Write database seed script"]
        },
        {
          "week": 3,
          "focus": "Core business logic implementation and state management",
          "tasks": ["Implement service layer", "Connect frontend store", "Handle async requests"]
        },
        {
          "week": 4,
          "focus": "Automated testing and CI pipeline setup",
          "tasks": ["Write unit tests", "Setup GitHub Actions workflow", "Deploy preview"]
        }
      ]
    },
    {
      "month": 2,
      "title": "Intermediate Architecture & Cloud Deployment",
      "focus": "Cloud hosting, containerization, and real-time features.",
      "weeklyGoals": [
        {
          "week": 5,
          "focus": "Containerizing microservices with Docker",
          "tasks": ["Write Dockerfile", "Configure docker-compose", "Test locally"]
        },
        {
          "week": 6,
          "focus": "Cloud deployment to AWS / GCP",
          "tasks": ["Provision compute instance", "Set up DNS and SSL", "Test live deployment"]
        },
        {
          "week": 7,
          "focus": "Caching and performance optimization",
          "tasks": ["Implement Redis caching", "Optimize SQL queries", "Profile memory usage"]
        },
        {
          "week": 8,
          "focus": "Authentication security and role-based access",
          "tasks": ["Audit JWT validation", "Implement rate limiting", "Verify input sanitization"]
        }
      ]
    }
  ],
  "projects": [
    {
      "id": "proj_1",
      "title": "Production-Grade AI Application Showcase",
      "description": "Full-stack cloud-native web application showcasing real-time API integrations, database optimization, and CI/CD deployment.",
      "technologies": ["TypeScript", "React", "Node.js", "Docker", "PostgreSQL"],
      "deliverables": [
        "Interactive live demo deployed with custom domain",
        "Public GitHub repository with comprehensive README and architecture diagram",
        "Automated unit and integration test suite with >80% coverage"
      ],
      "resumeBullet": "Engineered responsive full-stack platform in TypeScript and React, integrating automated CI/CD and reducing deployment turnaround by 40%."
    }
  ],
  "courses": [
    {
      "id": "c1",
      "title": "Full Stack Open - University of Helsinki",
      "provider": "University of Helsinki",
      "url": "https://fullstackopen.com",
      "importance": "Essential",
      "skillsCovered": ["React", "Node.js", "GraphQL", "CI/CD", "TypeScript"]
    }
  ],
  "practiceQuestions": [
    {
      "id": "q1",
      "category": "Technical Coding & Problem Solving",
      "question": "Explain how you would design a scalable rate limiter for a multi-tenant API.",
      "hint": "Consider token bucket or sliding window log algorithms, and where state should be stored in a distributed system.",
      "sampleAnswerOutline": "Discuss token bucket vs leaky bucket, Redis sliding window counter, handling distributed concurrency, and HTTP 429 response headers."
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
      logger.info('Roadmap generated successfully', {
        uid,
        targetRole,
        durationMs: Date.now() - startTime
      });
      return res.json(parsed);
    } catch (err: any) {
      logger.error('Error generating roadmap, falling back to deterministic roadmap:', err, {
        uid,
        targetRole,
        durationMs: Date.now() - startTime
      });
      res.setHeader('X-AI-Service-Status', 'fallback_recovered');
      return res.json(getFallbackRoadmap(targetRole));
    }
  }
);

export default router;
