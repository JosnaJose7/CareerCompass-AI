import { Router, Response } from 'express';
import { optionalAuthOrGuest, AuthenticatedRequest } from '../middleware/auth';
import { standardAiLimiter } from '../middleware/rateLimit';
import { validateScenarioRequest } from '../middleware/requestValidation';
import { getGeminiClient, generateGeminiContentWithFallback } from '../services/gemini';
import { parseJSONFromResponse } from '../services/jsonParser';
import { getFallbackScenarioSimulatorResult } from '../fallbacks/fallbackData';
import { logger } from '../services/logger';

const router = Router();

// 10. Dedicated Scenario Simulator Handler
const handleScenarioSimulatorRoute = async (req: AuthenticatedRequest, res: Response) => {
  const startTime = Date.now();
  const uid = req.user?.uid || 'guest';
  const currentProfile = req.body.currentProfile || req.body.baseProfile || {};
  const selectedScenarios = req.body.selectedScenarios || req.body.scenarios || [];
  const customSkills = req.body.customSkills || [];
  const baseScore = req.body.baseScore;

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      logger.info('Gemini API key missing; serving deterministic scenario simulation', { uid });
      res.setHeader('X-AI-Service-Status', 'deterministic_fallback');
      const fallback = getFallbackScenarioSimulatorResult(currentProfile, selectedScenarios, customSkills);
      if (baseScore && typeof baseScore === 'number') {
        fallback.baselineMetrics.readinessScore = baseScore;
      }
      return res.json({
        ...fallback,
        updatedReadinessScore: fallback.simulatedMetrics.readinessScore,
        summary: fallback.overallTakeaway
      });
    }

    const ai = getGeminiClient();
    const prompt = `
You are CareerCompass AI "What If" Scenario Simulator Engine.
Analyze the student's baseline profile and recalculate how applying specific hypothetical skill/achievement upgrades transforms their career match scores, readiness, skill gap resolutions, and pathway rankings.

IMPORTANT DIRECTIVES:
1. Do NOT permanently alter the student's actual profile. This is a hypothetical simulation.
2. Compare Before vs After metrics clearly.
3. For each active scenario, explicitly explain which career pathways are affected and why.
4. Categorize skill gaps into RESOLVED (Closed) vs REMAINING.

Student Baseline Profile:
- Name: ${currentProfile?.fullName || currentProfile?.personalInfo?.fullName || 'Student'}
- Major: ${currentProfile?.major || currentProfile?.personalInfo?.department || 'Computer Science'}
- Technical Skills: ${(currentProfile?.skills || currentProfile?.technicalSkills?.languages || ['Python', 'React', 'SQL']).join(', ')}
- Certifications: ${(currentProfile?.certifications || []).join(', ')}
- Target Role: ${currentProfile?.dreamRole || currentProfile?.careerGoals?.targetRole || 'Full-Stack Software Engineer'}

Hypothetical Skill Upgrades Applied in Simulation:
- Preset Scenarios Active: ${selectedScenarios.join(', ') || 'None selected'}
- Custom Added Skills: ${customSkills.join(', ') || 'None'}

Return a valid JSON object matching this structure EXACTLY:
{
  "simulationNotice": "SIMULATED ESTIMATE - NOT A GUARANTEED OUTCOME. Hypothetical scenario results do not modify your permanent profile.",
  "updatedReadinessScore": 92,
  "summary": "AI summary of how these additions boost readiness.",
  "baselineMetrics": {
    "readinessScore": ${baseScore || 76},
    "topMatchScore": 82,
    "totalGapsCount": 5
  },
  "simulatedMetrics": {
    "readinessScore": 92,
    "topMatchScore": 95,
    "totalGapsCount": 2,
    "scoreDelta": "+16%",
    "unlockedPathwaysCount": 2
  },
  "impactBreakdown": [
    {
      "factor": "Hypothetical Scenario Upgrades",
      "delta": "+16%",
      "explanation": "Adding Docker and CI/CD directly satisfies industry DevOps requirements for junior full-stack roles."
    }
  ],
  "pathwayRankingChanges": [
    {
      "role": "Full-Stack Software Engineer",
      "oldScore": 82,
      "newScore": 95,
      "status": "Accelerated"
    },
    {
      "role": "DevOps & Cloud Engineer",
      "oldScore": 68,
      "newScore": 88,
      "status": "Newly Unlocked"
    }
  ],
  "resolvedSkillGaps": ["Docker Containerization", "CI/CD Pipeline Scaffolding"],
  "remainingSkillGaps": ["Kubernetes Cluster Orchestration", "Redis In-Memory Caching"],
  "overallTakeaway": "Simulated trajectory indicates that closing containerization and automated testing gaps positions you within the top 10% of junior campus applicants."
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
    logger.info('Scenario simulation completed successfully', {
      uid,
      scenariosCount: selectedScenarios.length,
      durationMs: Date.now() - startTime
    });

    return res.json(parsed);
  } catch (err: any) {
    logger.error('Error running scenario simulator, falling back to deterministic result:', err, {
      uid,
      durationMs: Date.now() - startTime
    });
    res.setHeader('X-AI-Service-Status', 'fallback_recovered');
    const fallback = getFallbackScenarioSimulatorResult(currentProfile, selectedScenarios, customSkills);
    return res.json({
      ...fallback,
      updatedReadinessScore: fallback.simulatedMetrics.readinessScore,
      summary: fallback.overallTakeaway
    });
  }
};

router.post('/scenario-simulator', optionalAuthOrGuest, standardAiLimiter, validateScenarioRequest, handleScenarioSimulatorRoute);
router.post('/gemini/what-if-simulate', optionalAuthOrGuest, standardAiLimiter, validateScenarioRequest, handleScenarioSimulatorRoute);

export default router;
