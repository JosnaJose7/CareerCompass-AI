import { Router, Response } from 'express';
import { optionalAuthOrGuest, AuthenticatedRequest } from '../middleware/auth';
import { standardAiLimiter } from '../middleware/rateLimit';
import { validateInterviewQuestionsRequest, validateInterviewEvaluationRequest } from '../middleware/requestValidation';
import { getGeminiClient, generateGeminiContentWithFallback } from '../services/gemini';
import { parseJSONFromResponse } from '../services/jsonParser';
import { getFallbackQuestions, getFallbackEvaluation } from '../fallbacks/fallbackData';
import { logger } from '../services/logger';

const router = Router();

// 4. Interview Questions Handler (HR, Technical, Coding, Behavioral)
const handleInterviewQuestionsRoute = async (req: AuthenticatedRequest, res: Response) => {
  const startTime = Date.now();
  const uid = req.user?.uid || 'guest';
  const role = req.body.targetRole || req.body.roleTitle || 'Software Engineer';

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      logger.info('Gemini API key missing; serving deterministic interview questions', { uid, role });
      res.setHeader('X-AI-Service-Status', 'deterministic_fallback');
      return res.json({ questions: getFallbackQuestions(role) });
    }

    const ai = getGeminiClient();
    const prompt = `
You are a senior hiring manager and technical interviewer conducting campus recruitment for university candidates applying for "${role}".

Generate 8 distinct, high-yield interview questions divided across these 4 MANDATORY categories:
1. "HR" (Culture fit, company motivation, career trajectory, team alignment)
2. "Technical" (Architecture concepts, system design, framework internals, performance trade-offs)
3. "Coding" (Data structures, algorithmic problem solving, string/array logic, function boilerplate)
4. "Behavioral" (STAR method stories, leadership under pressure, conflict resolution, learning from failure)

Provide 2 questions per category (8 total). For "Coding" questions, include problemStatement, starterCode, and testCases array.

Return a valid JSON object matching this structure EXACTLY:
{
  "questions": [
    {
      "id": "hr_1",
      "question": "Why do you want to join our team as a ${role}, and what personal project best demonstrates your growth mindset?",
      "category": "HR",
      "hint": "Connect company culture with your personal learning journey and career goals.",
      "sampleKeyPoints": ["Show company alignment", "Highlight self-driven project growth", "Express long-term ambition"]
    },
    {
      "id": "tech_1",
      "question": "Explain the difference between SQL and NoSQL databases, and when you would choose PostgreSQL over MongoDB for a ${role} project.",
      "category": "Technical",
      "hint": "Discuss ACID compliance, relational schemas, indexing vs document-based flexibility, and scalability.",
      "sampleKeyPoints": ["ACID vs BASE consistency", "Schema enforcement vs dynamic schema", "Indexing & JOIN performance"]
    },
    {
      "id": "code_1",
      "question": "Write a function 'twoSum(nums: number[], target: number): number[]' that returns indices of the two numbers such that they add up to target.",
      "category": "Coding",
      "hint": "Use a Hash Map to store complement values for O(N) linear time complexity.",
      "sampleKeyPoints": ["Hash Map lookup O(1)", "Single pass algorithm", "Handle edge cases"],
      "problemStatement": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      "starterCode": "function twoSum(nums: number[], target: number): number[] {\\n  const map = new Map<number, number>();\\n  for (let i = 0; i < nums.length; i++) {\\n    const diff = target - nums[i];\\n    if (map.has(diff)) {\\n      return [map.get(diff)!, i];\\n    }\\n    map.set(nums[i], i);\\n  }\\n  return [];\\n}",
      "testCases": [
        { "input": "nums = [2, 7, 11, 15], target = 9", "output": "[0, 1]" },
        { "input": "nums = [3, 2, 4], target = 6", "output": "[1, 2]" }
      ]
    },
    {
      "id": "beh_1",
      "question": "Tell me about a challenging technical bug or team disagreement you encountered during a project and how you resolved it.",
      "category": "Behavioral",
      "hint": "Structure using STAR: Situation, Task, Action, Result with quantified learnings.",
      "sampleKeyPoints": ["Clear root cause isolation", "Collaborative problem resolution", "Constructive reflection"]
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
    logger.info('Interview questions generated successfully', {
      uid,
      role,
      durationMs: Date.now() - startTime
    });
    return res.json(parsed);
  } catch (err: any) {
    logger.error('Error generating interview questions, falling back to deterministic bank:', err, {
      uid,
      role,
      durationMs: Date.now() - startTime
    });
    res.setHeader('X-AI-Service-Status', 'fallback_recovered');
    return res.json({ questions: getFallbackQuestions(role) });
  }
};

// 5. Interview Answer Evaluation Handler
const handleInterviewEvaluationRoute = async (req: AuthenticatedRequest, res: Response) => {
  const startTime = Date.now();
  const uid = req.user?.uid || 'guest';
  const { question, userAnswer, answer, targetRole, category = 'General' } = req.body;
  const candidateAnswer = userAnswer || answer || '';
  const questionText = typeof question === 'object' ? question?.question : question;

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      logger.info('Gemini API key missing; serving deterministic evaluation', { uid });
      res.setHeader('X-AI-Service-Status', 'deterministic_fallback');
      return res.json(getFallbackEvaluation(category));
    }

    const ai = getGeminiClient();
    const prompt = `
You are a Principal Engineering Bar-Raiser and Lead Technical Recruiter evaluating a student interview candidate for "${targetRole || 'Software Engineer'}".

Interview Question Category: ${category}
Question: "${questionText}"
Candidate's Transcribed Answer:
"""
${candidateAnswer}
"""

Conduct an objective, constructive, and detailed evaluation:
1. Overall Score (0-100)
2. Dimensional Breakdown (0-100 each):
   - Relevance & Technical Accuracy
   - Clarity & Communication Style
   - Depth & Problem-Solving Approach
   - Confidence & Delivery Tone
3. Key Strengths (2-3 concrete bullet points highlighting what the candidate did well)
4. Specific Areas for Improvement (2-3 actionable points on what was missed or can be sharpened)
5. Model Exemplar Answer (a polished, top-tier response demonstrating optimal structure and technical depth)

Return a valid JSON object matching this structure EXACTLY:
{
  "score": 85,
  "feedback": "Concise 2-sentence executive summary of candidate answer strength.",
  "strengths": [
    "Clear structure articulating the core concepts directly",
    "Good practical examples cited from hands-on coursework"
  ],
  "improvements": [
    "Quantify impact with specific metrics where applicable",
    "Address system scalability trade-offs more explicitly"
  ],
  "categoryScores": {
    "relevance": 88,
    "clarity": 84,
    "depth": 82,
    "confidence": 86
  },
  "idealAnswer": "A comprehensive, high-scoring model response illustrating ideal industry phrasing and technical precision."
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
    logger.info('Interview answer evaluated successfully', {
      uid,
      category,
      durationMs: Date.now() - startTime
    });
    return res.json(parsed);
  } catch (err: any) {
    logger.error('Error evaluating interview answer, falling back to deterministic score:', err, {
      uid,
      durationMs: Date.now() - startTime
    });
    res.setHeader('X-AI-Service-Status', 'fallback_recovered');
    return res.json(getFallbackEvaluation(category));
  }
};

router.post('/interview/questions', optionalAuthOrGuest, standardAiLimiter, validateInterviewQuestionsRequest, handleInterviewQuestionsRoute);
router.post('/interview-prep', optionalAuthOrGuest, standardAiLimiter, validateInterviewQuestionsRequest, handleInterviewQuestionsRoute);
router.post('/interview/evaluate', optionalAuthOrGuest, standardAiLimiter, validateInterviewEvaluationRequest, handleInterviewEvaluationRoute);
router.post('/evaluate-interview-answer', optionalAuthOrGuest, standardAiLimiter, validateInterviewEvaluationRequest, handleInterviewEvaluationRoute);

export default router;
