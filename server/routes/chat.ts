import { Router, Response } from 'express';
import { optionalAuthOrGuest, AuthenticatedRequest } from '../middleware/auth';
import { standardAiLimiter } from '../middleware/rateLimit';
import { validateChatRequest } from '../middleware/requestValidation';
import { getGeminiClient, generateGeminiContentWithFallback } from '../services/gemini';
import { getFallbackChatReply } from '../fallbacks/fallbackData';
import { logger } from '../services/logger';

const router = Router();

// 7. AI Career Advisor Chatbot Handler
const handleChatAdvisorRoute = async (req: AuthenticatedRequest, res: Response) => {
  const startTime = Date.now();
  const uid = req.user?.uid || 'guest';
  const { messages, history, profile, roadmap } = req.body;
  const historyList = messages || history || [];
  const lastUserMsg = req.body.message || (historyList.length > 0 ? historyList[historyList.length - 1]?.text || "Hello" : "Hello");

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      logger.info('Gemini API key missing; serving deterministic chat advice', { uid });
      res.setHeader('X-AI-Service-Status', 'deterministic_fallback');
      return res.json({
        reply: getFallbackChatReply(lastUserMsg, profile, roadmap)
      });
    }

    const ai = getGeminiClient();

    const systemContext = `
You are Compass AI, an elite, empathetic, and expert AI Career Mentor for university students.
Student Context:
- Major: ${profile?.major || 'Computer Science / Engineering'}
- Graduation Year: ${profile?.gradYear || '2026'}
- Current Skills: ${(profile?.skills || []).join(', ') || 'General Programming'}
- Dream Target Role: ${profile?.dreamRole || 'Software Engineer'}
- Career Goals: ${profile?.careerGoals || 'Land an internship or entry-level position at a top tech company'}
- Active Roadmap Target: ${roadmap?.roleTitle || 'Not generated yet'}

When the student asks specific questions, answer with clear formatting (markdown bullet points, bold headers, actionable steps, and encouraging tone):
1. "Which career suits me?": Analyze their major (${profile?.major}) and skills (${(profile?.skills || []).join(', ')}). Recommend 3 specific roles with match reasoning, salary expectations, and key skills to learn.
2. "How to get into Google?": Give a step-by-step roadmap for Google campus recruiting (DSA mastery on LeetCode, System Design basics, Google XYZ resume bullet formula, and Googleyness STAR behavioral prep).
3. "Should I learn AWS?": Explain whether AWS is valuable for their target role (${profile?.dreamRole || 'Software Engineer'}), the ROI on learning cloud services, recommended certifications (AWS Cloud Practitioner / Solutions Architect), and starter projects (EC2, S3, Lambda, DynamoDB).
4. "Explain DSA.": Give a clear, intuitive breakdown of Data Structures & Algorithms, why tech companies use DSA interviews, key Big-O complexity concepts, and the top 14 coding patterns to master.
5. "Review my roadmap.": Review their active roadmap for ${roadmap?.roleTitle || 'Software Engineer'}. Give a readiness score (e.g. 90/100), evaluate their timeline (${roadmap?.estimatedTimeToJobReady || '4-6 months'}), highlight strengths, and suggest 3 ways to accelerate progress.

Keep your tone inspiring, direct, and practical.
`;

    const prompt = `${systemContext}\nStudent question: ${lastUserMsg}`;

    const rawText = await generateGeminiContentWithFallback(ai, {
      contents: prompt,
      config: {
        temperature: 0.7,
      },
    });

    logger.info('Advisor chat reply generated successfully', {
      uid,
      durationMs: Date.now() - startTime
    });

    return res.json({
      reply: rawText || getFallbackChatReply(lastUserMsg, profile, roadmap)
    });
  } catch (error: any) {
    logger.error('Error in chat advisor, falling back to deterministic reply:', error, {
      uid,
      durationMs: Date.now() - startTime
    });
    res.setHeader('X-AI-Service-Status', 'fallback_recovered');
    return res.json({
      reply: getFallbackChatReply(lastUserMsg, req.body.profile, req.body.roadmap)
    });
  }
};

router.post('/chat', optionalAuthOrGuest, standardAiLimiter, validateChatRequest, handleChatAdvisorRoute);
router.post('/chat-advisor', optionalAuthOrGuest, standardAiLimiter, validateChatRequest, handleChatAdvisorRoute);

export default router;
