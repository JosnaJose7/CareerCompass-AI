import { Request, Response, NextFunction } from 'express';
import { logger } from '../services/logger';

function sendValidationError(res: Response, req: Request, message: string, details?: any) {
  logger.warn('Request validation failed', {
    route: req.path,
    method: req.method,
    message,
    details
  });
  return res.status(400).json({
    error: message,
    code: 'INVALID_REQUEST',
    details
  });
}

/**
 * 1. Validates Career Recommendations request
 */
export function validateRecommendationsRequest(req: Request, res: Response, next: NextFunction) {
  const body = req.body;
  if (!body || typeof body !== 'object') {
    return sendValidationError(res, req, 'Request body must be a valid JSON object.');
  }

  const major = body.major || body.personalInfo?.major || body.department;
  if (!major || typeof major !== 'string' || major.trim().length === 0) {
    return sendValidationError(res, req, 'Field "major" is required and must be a non-empty string.');
  }

  if (major.length > 150) {
    return sendValidationError(res, req, 'Field "major" exceeds maximum length of 150 characters.');
  }

  if (body.skills && (!Array.isArray(body.skills) || body.skills.length > 100)) {
    return sendValidationError(res, req, 'Field "skills" must be an array of at most 100 items.');
  }

  next();
}

/**
 * 2. Validates Career Roadmap request
 */
export function validateRoadmapRequest(req: Request, res: Response, next: NextFunction) {
  const body = req.body;
  if (!body || typeof body !== 'object') {
    return sendValidationError(res, req, 'Request body must be a valid JSON object.');
  }

  const targetRole = body.targetRole || body.roleTitle || body.profile?.dreamRole;
  if (!targetRole || typeof targetRole !== 'string' || targetRole.trim().length < 2) {
    return sendValidationError(res, req, 'Field "targetRole" or "roleTitle" is required (minimum 2 characters).');
  }

  if (targetRole.length > 150) {
    return sendValidationError(res, req, 'Field "targetRole" exceeds maximum length of 150 characters.');
  }

  next();
}

/**
 * 3. Validates Resume Analysis request (preserves PDF uploads up to 15MB base64)
 */
export function validateResumeRequest(req: Request, res: Response, next: NextFunction) {
  const body = req.body;
  if (!body || typeof body !== 'object') {
    return sendValidationError(res, req, 'Request body must be a valid JSON object.');
  }

  const hasResumeText = typeof body.resumeText === 'string' && body.resumeText.trim().length >= 20;
  const hasPdfBase64 = typeof body.pdfBase64 === 'string' && body.pdfBase64.trim().length >= 50;

  if (!hasResumeText && !hasPdfBase64) {
    return sendValidationError(
      res,
      req,
      'Either "resumeText" (minimum 20 characters) or "pdfBase64" (valid PDF base64 string) must be provided.'
    );
  }

  if (body.resumeText && body.resumeText.length > 60000) {
    return sendValidationError(res, req, 'Field "resumeText" exceeds maximum length of 60,000 characters.');
  }

  if (body.pdfBase64 && body.pdfBase64.length > 20000000) {
    return sendValidationError(res, req, 'PDF file size exceeds maximum limit of 15MB.');
  }

  if (body.targetRole && (typeof body.targetRole !== 'string' || body.targetRole.length > 150)) {
    return sendValidationError(res, req, 'Field "targetRole" must be a string under 150 characters.');
  }

  next();
}

/**
 * 4. Validates Interview Questions request
 */
export function validateInterviewQuestionsRequest(req: Request, res: Response, next: NextFunction) {
  const body = req.body;
  if (!body || typeof body !== 'object') {
    return sendValidationError(res, req, 'Request body must be a valid JSON object.');
  }

  const roleTitle = body.roleTitle || body.targetRole || body.role;
  if (!roleTitle || typeof roleTitle !== 'string' || roleTitle.trim().length < 2) {
    return sendValidationError(res, req, 'Field "roleTitle" is required (minimum 2 characters).');
  }

  if (roleTitle.length > 150) {
    return sendValidationError(res, req, 'Field "roleTitle" exceeds maximum length of 150 characters.');
  }

  if (body.roundType && (typeof body.roundType !== 'string' || body.roundType.length > 100)) {
    return sendValidationError(res, req, 'Field "roundType" must be a string under 100 characters.');
  }

  next();
}

/**
 * 5. Validates Interview Evaluation request
 */
export function validateInterviewEvaluationRequest(req: Request, res: Response, next: NextFunction) {
  const body = req.body;
  if (!body || typeof body !== 'object') {
    return sendValidationError(res, req, 'Request body must be a valid JSON object.');
  }

  const question = typeof body.question === 'object' ? body.question?.question : body.question;
  if (!question || typeof question !== 'string' || question.trim().length < 2) {
    return sendValidationError(res, req, 'Field "question" is required.');
  }

  if (question.length > 3000) {
    return sendValidationError(res, req, 'Field "question" exceeds maximum length of 3000 characters.');
  }

  const answer = body.userAnswer || body.answer;
  if (!answer || typeof answer !== 'string' || answer.trim().length < 2) {
    return sendValidationError(res, req, 'Candidate "userAnswer" is required (minimum 2 characters).');
  }

  if (answer.length > 10000) {
    return sendValidationError(res, req, 'Candidate "userAnswer" exceeds maximum length of 10,000 characters.');
  }

  next();
}

/**
 * 6. Validates Labor Market Insights request
 */
export function validateMarketRequest(req: Request, res: Response, next: NextFunction) {
  const body = req.body;
  if (body && typeof body === 'object' && body.sector) {
    if (typeof body.sector !== 'string' || body.sector.length > 150) {
      return sendValidationError(res, req, 'Field "sector" must be a string under 150 characters.');
    }
  }
  next();
}

/**
 * 7. Validates AI Advisor Chat request
 */
export function validateChatRequest(req: Request, res: Response, next: NextFunction) {
  const body = req.body;
  if (!body || typeof body !== 'object') {
    return sendValidationError(res, req, 'Request body must be a valid JSON object.');
  }

  const message = body.message || body.userMessage;
  const history = body.history || body.messages;

  if (!message && (!Array.isArray(history) || history.length === 0)) {
    return sendValidationError(res, req, 'Field "message" or non-empty "history" array is required.');
  }

  if (message && (typeof message !== 'string' || message.trim().length === 0)) {
    return sendValidationError(res, req, 'Field "message" must be a non-empty string.');
  }

  if (message && message.length > 3000) {
    return sendValidationError(res, req, 'Field "message" exceeds maximum length of 3000 characters.');
  }

  if (history && (!Array.isArray(history) || history.length > 100)) {
    return sendValidationError(res, req, 'Field "history" must be an array of at most 100 messages.');
  }

  next();
}

/**
 * 8. Validates Skill Gap Analysis request
 */
export function validateSkillGapRequest(req: Request, res: Response, next: NextFunction) {
  const body = req.body;
  if (!body || typeof body !== 'object') {
    return sendValidationError(res, req, 'Request body must be a valid JSON object.');
  }

  const targetRole = body.targetRole || body.role || body.profile?.dreamRole;
  if (!targetRole || typeof targetRole !== 'string' || targetRole.trim().length < 2) {
    return sendValidationError(res, req, 'Field "targetRole" is required (minimum 2 characters).');
  }

  if (targetRole.length > 150) {
    return sendValidationError(res, req, 'Field "targetRole" exceeds maximum length of 150 characters.');
  }

  next();
}

/**
 * 9. Validates Career Assessment Analysis request
 */
export function validateAssessmentRequest(req: Request, res: Response, next: NextFunction) {
  const body = req.body;
  if (!body || typeof body !== 'object') {
    return sendValidationError(res, req, 'Request body must be a valid JSON object.');
  }

  const responses = body.responses || body;
  if (!responses || typeof responses !== 'object') {
    return sendValidationError(res, req, 'Assessment "responses" object is required.');
  }

  if (body.aptitudeScore !== undefined && (typeof body.aptitudeScore !== 'number' || body.aptitudeScore < 0 || body.aptitudeScore > 100)) {
    return sendValidationError(res, req, 'Field "aptitudeScore" must be a number between 0 and 100.');
  }

  next();
}

/**
 * 10. Validates What-If Scenario Simulator request
 */
export function validateScenarioRequest(req: Request, res: Response, next: NextFunction) {
  const body = req.body;
  if (!body || typeof body !== 'object') {
    return sendValidationError(res, req, 'Request body must be a valid JSON object.');
  }

  const scenarios = body.selectedScenarios || body.scenarios;
  if (scenarios !== undefined && (!Array.isArray(scenarios) || scenarios.length > 30)) {
    return sendValidationError(res, req, 'Field "scenarios" must be an array of at most 30 items.');
  }

  if (body.customSkills !== undefined && (!Array.isArray(body.customSkills) || body.customSkills.length > 30)) {
    return sendValidationError(res, req, 'Field "customSkills" must be an array of at most 30 items.');
  }

  if (body.baseScore !== undefined && (typeof body.baseScore !== 'number' || body.baseScore < 0 || body.baseScore > 100)) {
    return sendValidationError(res, req, 'Field "baseScore" must be a number between 0 and 100.');
  }

  next();
}
