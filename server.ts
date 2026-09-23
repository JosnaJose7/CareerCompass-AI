import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

import authRouter from './server/routes/auth';
import recommendationsRouter from './server/routes/recommendations';
import roadmapRouter from './server/routes/roadmap';
import resumeRouter from './server/routes/resume';
import interviewRouter from './server/routes/interview';
import marketRouter from './server/routes/market';
import chatRouter from './server/routes/chat';
import skillGapRouter from './server/routes/skillGap';
import assessmentRouter from './server/routes/assessment';
import scenarioRouter from './server/routes/scenario';
import facultyRouter from './server/routes/faculty';
import { globalApiLimiter } from './server/middleware/rateLimit';
import { logger } from './server/services/logger';

dotenv.config();

const app = express();
const PORT = 3000;

// Sensible route-specific body parsing:
// Allocate 15MB limit exclusively for PDF resume uploads on /api/resume-analyzer;
// Restrict all other API routes to a safe 1MB payload size.
app.use((req, res, next) => {
  if (req.path === '/api/resume-analyzer') {
    express.json({ limit: '15mb' })(req, res, next);
  } else {
    express.json({ limit: '1mb' })(req, res, next);
  }
});
app.use(express.urlencoded({ limit: '1mb', extended: true }));

// Global API rate limiting
app.use('/api', globalApiLimiter);

// Mount Modular Routes
// 0. Auth & Role Verification / Custom Claims
app.use('/api', authRouter);

// 1. Recommendations
app.use('/api', recommendationsRouter);

// 2. Career Roadmap
app.use('/api', roadmapRouter);

// 3. Resume & Portfolio Analyzer (Supports 15MB Base64 PDF uploads)
app.use('/api', resumeRouter);

// 4 & 5. Interview Prep & Answer Evaluation
app.use('/api', interviewRouter);

// 6. Job Market Insights (Public labor analytics)
app.use('/api', marketRouter);

// 7. AI Career Advisor Chat
app.use('/api', chatRouter);

// 8. Skill Gap Analysis
app.use('/api', skillGapRouter);

// 9. Career Assessment Analyzer
app.use('/api', assessmentRouter);

// 10. Scenario Simulator
app.use('/api', scenarioRouter);

// 11. Faculty-Only Cohort Insights
app.use('/api', facultyRouter);

// Centralized error-handling middleware (strips stack traces and sensitive error details)
app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err?.type === 'entity.too.large' || err?.status === 413) {
    logger.warn('Payload too large error rejected', { route: req.path, method: req.method });
    return res.status(413).json({
      error: 'Payload Too Large: The request exceeds maximum permissible size limit.',
      code: 'PAYLOAD_TOO_LARGE'
    });
  }

  logger.error('Unhandled server exception', err, { route: req.path, method: req.method });
  return res.status(500).json({
    error: 'An unexpected internal server error occurred.',
    code: 'SERVER_ERROR'
  });
});

// ------------------- VITE MIDDLEWARE / PRODUCTION SETUP -------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    logger.info(`CareerCompass AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

export default app;
