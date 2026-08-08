import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import * as pdfParseModule from 'pdf-parse';
const pdfParse = (pdfParseModule as any).default || pdfParseModule;

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI SDK lazily/safely
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY || '';
  return new GoogleGenAI({ apiKey });
}

// Clean JSON response helper from Gemini output string
function parseJSONFromResponse(rawText: string): any {
  try {
    const cleanText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (err) {
    console.error('JSON parsing error:', err, 'Raw text:', rawText);
    throw new Error('Failed to parse structured response from AI');
  }
}

// Helper to call Gemini with retries and fallback models (handles 503 Service Unavailable / High Demand)
async function generateGeminiContentWithFallback(
  ai: GoogleGenAI,
  params: { contents: string; config?: any }
): Promise<string> {
  const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
  let lastError: any = null;

  for (const model of modelsToTry) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: params.contents,
          config: params.config,
        });
        if (response && response.text) {
          return response.text;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Gemini call attempt ${attempt + 1} with model ${model} failed:`, err?.message || err);
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }
  }

  throw lastError || new Error('All Gemini model calls failed');
}

// ------------------- API ROUTES -------------------

// 1. Career Discovery & Recommendations Endpoint
app.post('/api/recommendations', async (req, res) => {
  try {
    const profile = req.body;
    if (!profile || !profile.major) {
      return res.status(400).json({ error: 'Student profile with major is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback mock recommendations if API key is not provided
      return res.json({
        recommendations: getFallbackRecommendations(profile)
      });
    }

    const ai = getGeminiClient();
    const prompt = `
You are CareerCompass AI, an expert career counselor and talent strategist for university students.
Analyze the following comprehensive university student profile and recommend TOP 5 distinct, highly relevant, and realistic career paths.

Student Profile:
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

Return a valid JSON object matching this structure EXACTLY with TOP 5 career recommendations:
{
  "recommendations": [
    {
      "id": "role_1",
      "title": "Exact Role Title (e.g. Full-Stack AI Engineer)",
      "matchScore": 94,
      "shortSummary": "A concise 2-sentence summary of why this role fits them.",
      "dayInLife": "A realistic paragraph detailing a typical workday for a junior/entry-level professional in this role.",
      "salaryRange": {
        "entry": "$95,000 - $125,000",
        "mid": "$140,000 - $180,000",
        "senior": "$190,000 - $240,000+"
      },
      "demandGrowth": "+32% Explosive Demand",
      "futureDemand": "Extremely high 5-year outlook. Rising demand driven by enterprise generative AI automation and modern web platforms.",
      "reason": "Direct explanation of why their degree, projects, and skills make them a standout candidate.",
      "strengths": ["Strong foundational Python & React skills", "Relevant coursework project in AI agents", "High CGPA demonstrating academic discipline"],
      "weaknesses": ["Limited production experience with Docker & Kubernetes", "Needs more experience writing automated unit tests"],
      "missingSkills": ["Docker & Kubernetes", "Vector Databases (Pinecone/Chroma)", "CI/CD Deployment Pipelines"],
      "keyResponsibilities": ["Design responsive web applications", "Integrate LLM API endpoints", "Optimize database query speeds"],
      "matchingSkills": ["Python", "React", "TypeScript", "SQL"],
      "skillsGap": [
        {
          "skill": "Docker & Containerization",
          "type": "missing",
          "importance": "High",
          "howToAcquire": "Complete a hands-on 10-hour Docker tutorial and containerize a project."
        }
      ],
      "aiReasoning": "In-depth career fit evaluation detailing alignment with student goals.",
      "topEmployers": ["Google", "Microsoft", "Stripe", "OpenAI"]
    }
  ]
}
Return ONLY valid JSON with exactly 5 objects in the recommendations array.
`;

    const rawText = await generateGeminiContentWithFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const parsed = parseJSONFromResponse(rawText);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating recommendations:', error);
    // Return fallback gracefully
    return res.json({
      recommendations: getFallbackRecommendations(req.body)
    });
  }
});

// 2. Career Roadmap Generator Endpoint
app.post('/api/roadmap', async (req, res) => {
  try {
    const { profile, targetRole } = req.body;
    if (!targetRole) {
      return res.status(400).json({ error: 'Target role is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
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
      "id": "month_1",
      "monthNumber": 1,
      "title": "Month 1: Core Fundamentals & Environment Setup",
      "summary": "Master core programming concepts, setup development environment, and master Git version control.",
      "completed": false,
      "weeklyGoals": [
        {
          "id": "w1_1",
          "weekNumber": 1,
          "title": "Week 1: Core Syntax & Language Mastery",
          "focus": "Language primitives, data structures, and scope",
          "tasks": [
            { "id": "t1_1", "title": "Complete 15 fundamental coding challenges", "completed": false },
            { "id": "t1_2", "title": "Set up VSCode, Linter, and Git repository structure", "completed": false }
          ]
        }
      ]
    }
  ],
  "projects": [
    {
      "id": "p1",
      "title": "Full-Stack Web Portal with Authentication",
      "difficulty": "Intermediate",
      "description": "Build a responsive full-stack application featuring live REST API, user auth, and persistent database storage.",
      "techStack": ["React", "TypeScript", "Node.js", "PostgreSQL"],
      "keyDeliverables": [
        "User registration & JWT login workflow",
        "REST API endpoints with CRUD operations",
        "Hosted live demo with GitHub source repository"
      ],
      "resumeBullet": "Architected and shipped full-stack portal serving 200+ users with 99.8% server availability.",
      "completed": false
    }
  ],
  "courses": [
    {
      "id": "c1",
      "title": "Full Stack Web Development Specialization",
      "provider": "Coursera / Meta",
      "type": "Certification",
      "duration": "30 Hours",
      "url": "https://coursera.org",
      "completed": false
    }
  ],
  "practiceQuestions": [
    {
      "id": "q1",
      "category": "Coding",
      "question": "How do you optimize API endpoint response times and database query latency?",
      "hint": "Consider indexing, caching, pagination, avoiding N+1 queries, and lazy loading.",
      "solutionSummary": "Add database indexes on queried columns, cache frequent GET responses in Redis/memory, use limit-offset pagination, and optimize joins.",
      "completed": false
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
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating roadmap:', error);
    return res.json(getFallbackRoadmap(req.body.targetRole));
  }
});

// 3. Resume & Portfolio Analyzer Endpoint (Supports Text & PDF upload)
app.post('/api/resume-analyzer', async (req, res) => {
  try {
    let { resumeText, pdfBase64, targetRole } = req.body;
    targetRole = targetRole || 'Software Engineer';

    // If PDF base64 is provided and resumeText is short/missing, extract text from PDF on server
    if (pdfBase64 && (!resumeText || resumeText.length < 50)) {
      try {
        const pdfBuffer = Buffer.from(pdfBase64, 'base64');
        const pdfData = await pdfParse(pdfBuffer);
        if (pdfData && pdfData.text) {
          resumeText = pdfData.text;
        }
      } catch (err) {
        console.error('Failed to parse PDF on server, falling back to passed text:', err);
      }
    }

    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({ error: 'Resume text or PDF file is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json(getFallbackResumeAnalysis(targetRole));
    }

    const ai = getGeminiClient();
    const prompt = `
You are an expert ATS (Applicant Tracking System) parser, Tech Recruiter, and Senior Resume Auditor.
Analyze this student resume for the target position: "${targetRole}".

Resume Content:
"""
${resumeText}
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
  "categoryScores": [
    { "category": "ATS Compatibility", "score": 88, "feedback": "Clean layout and standard section headers easily parsed by ATS software." },
    { "category": "Impact & Action Verbs", "score": 78, "feedback": "Some bullets use passive wording. Upgrade to strong action verbs with metrics." },
    { "category": "Technical Depth", "score": 85, "feedback": "Good variety of programming languages and web frameworks." },
    { "category": "Grammar & Readability", "score": 92, "feedback": "Professional tone with minimal typos or awkward phrasing." }
  ],
  "grammar": {
    "score": 92,
    "issuesFound": 2,
    "grammarFeedback": [
      "Ensure consistent tense usage: use past tense for completed projects ('developed', 'built') and present tense for current roles.",
      "Avoid first-person pronouns ('I', 'my') in bullet points for standard recruiter formatting."
    ],
    "toneAndClarity": "Professional, concise, and academic. Strong readability overall."
  },
  "skills": {
    "identifiedSkills": ["TypeScript", "Python", "React", "Node.js", "SQL", "Git", "Docker"],
    "technicalStack": ["React", "Express", "PostgreSQL", "Tailwind CSS", "REST APIs"],
    "softSkills": ["Problem Solving", "Team Collaboration", "Agile Mindset"],
    "skillLevelEstimate": "Intermediate / Entry-Level Ready"
  },
  "projects": {
    "projectScore": 82,
    "strengths": [
      "Clear project titles with GitHub repository links",
      "Demonstrates practical full-stack technology usage"
    ],
    "weaknesses": [
      "Lacks numerical metrics (e.g. user count, percentage performance gain, latency reduction)",
      "Project descriptions could highlight technical challenges overcome"
    ],
    "impactQuantificationTips": [
      "Add user metrics: 'Used by 500+ students during campus hackathon'",
      "Add performance metrics: 'Reduced API loading time by 40% with database indexing'"
    ]
  },
  "keyStrengths": [
    "Strong technical alignment with ${targetRole}",
    "Clean education section with relevant coursework listed"
  ],
  "missingKeywords": [
    "CI/CD Pipeline",
    "Unit Testing (Jest / Vitest)",
    "Agile / Scrum Methodologies",
    "AWS / Cloud Deployment"
  ],
  "suggestions": [
    "Quantify at least 2 project bullet points with concrete numbers (% growth, speed gain, user count).",
    "Add a dedicated 'Certifications & Cloud' subsection if you hold AWS or Docker credentials.",
    "Tailor bullet points specifically to match keywords in target job descriptions."
  ],
  "bulletPointImprovements": [
    {
      "original": "Worked on a web application for student events.",
      "improved": "Architected a responsive student event portal in React and Express, serving 1,200+ monthly active users with 99.9% uptime.",
      "reason": "Replaced passive verb with power verb, specified tech stack, and added measurable user impact metrics."
    },
    {
      "original": "Fixed bugs and made database queries faster.",
      "improved": "Optimized SQL indexing and refactored database queries, reducing API response latency by 180ms across core user endpoints.",
      "reason": "Quantified performance gain and highlighted database engineering techniques."
    }
  ],
  "formatActionItems": [
    "Ensure section headers use standard naming (Education, Experience, Projects, Skills).",
    "Keep overall resume strictly to 1 single page for campus recruiting."
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
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error analyzing resume:', error);
    return res.json(getFallbackResumeAnalysis(req.body.targetRole || 'Software Engineer'));
  }
});

// 4. Interview Questions Endpoint (HR, Technical, Coding, Behavioral)
app.post('/api/interview-prep', async (req, res) => {
  try {
    const { targetRole } = req.body;
    const role = targetRole || 'Software Engineer';

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
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
      "starterCode": "function twoSum(nums: number[], target: number): number[] {\n  const map = new Map<number, number>();\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (map.has(diff)) {\n      return [map.get(diff)!, i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}",
      "testCases": [
        { "input": "nums = [2, 7, 11, 15], target = 9", "output": "[0, 1]" },
        { "input": "nums = [3, 2, 4], target = 6", "output": "[1, 2]" }
      ]
    },
    {
      "id": "beh_1",
      "question": "Describe a situation during a team project where a teammate was not pulling their weight or missed a key deadline. How did you handle it?",
      "category": "Behavioral",
      "hint": "Use STAR format (Situation, Task, Action, Result). Focus on empathy, proactive communication, and delivery.",
      "sampleKeyPoints": ["Identify roadblock early", "Private empathetic conversation", "Re-allocated tasks and delivered project"]
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
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating interview questions:', error);
    return res.json({ questions: getFallbackQuestions(req.body.targetRole || 'Software Engineer') });
  }
});

// 5. Evaluate Interview Answer Endpoint
app.post('/api/evaluate-interview-answer', async (req, res) => {
  try {
    const { question, userAnswer, targetRole, category } = req.body;
    if (!userAnswer) {
      return res.status(400).json({ error: 'User answer is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json(getFallbackEvaluation(category));
    }

    const ai = getGeminiClient();
    const prompt = `
You are an expert Interview Coach and Senior Hiring Bar Raiser for candidates applying for "${targetRole || 'Software Engineer'}".

Question Category: "${category || 'Interview Question'}"
Question Asked: "${question}"
Candidate's Response: "${userAnswer}"

Perform a thorough grading of the response (0 to 100 score).
Provide category-specific feedback:
- For HR / Behavioral: STAR method completeness, tone, authenticity, and leadership metrics.
- For Technical: Accuracy, architectural depth, trade-off understanding, and clear explanations.
- For Coding: Algorithmic correctness, time/space complexity (Big-O), code readability, and edge-case handling.

Return a valid JSON object matching this structure EXACTLY:
{
  "score": 88,
  "strengths": [
    "Clear structure and logical progression of thoughts",
    "Solid technical depth in explaining core trade-offs"
  ],
  "areasForImprovement": [
    "Include more specific numerical metrics (% performance gain, user count)",
    "Address time/space Big-O complexity explicitly"
  ],
  "starFormatSuggestions": "Structure using STAR: Situation (15%), Task (15%), Action (50%), Result (20%). Conclude with a metric.",
  "technicalFeedback": "Great grasp of async promises and relational database indexing.",
  "codeQualityAnalysis": "Time Complexity: O(N), Space Complexity: O(N). Code is clean and handles edge cases well.",
  "modelAnswer": "An exemplary 100-point candidate answer..."
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
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error evaluating interview answer:', error);
    return res.json(getFallbackEvaluation(req.body.category));
  }
});

// 6. Job Market Insights Endpoint
app.post('/api/job-market-insights', async (req, res) => {
  try {
    const { sector } = req.body;
    const targetSector = sector || 'Technology & AI Engineering';

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({
        lastUpdated: 'Q3 2026 Live Market Feed',
        industrySector: targetSector,
        aiSummary: `Live market overview for ${targetSector}. High demand for core technical execution, system architecture, and AI capabilities.`,
        topHiringSkills: [
          { skill: 'Python / PyTorch', demandPercentage: 94, category: 'AI & Data', yearOverYearGrowth: '+38%', avgSalaryBonus: '+$18,000' },
          { skill: 'TypeScript & React', demandPercentage: 91, category: 'Frontend', yearOverYearGrowth: '+22%', avgSalaryBonus: '+$12,000' },
          { skill: 'SQL & Vector DBs', demandPercentage: 88, category: 'Database', yearOverYearGrowth: '+45%', avgSalaryBonus: '+$15,000' },
          { skill: 'Docker & Kubernetes', demandPercentage: 84, category: 'Cloud/DevOps', yearOverYearGrowth: '+29%', avgSalaryBonus: '+$14,000' },
          { skill: 'Node.js & Express', demandPercentage: 82, category: 'Backend', yearOverYearGrowth: '+18%', avgSalaryBonus: '+$10,000' },
          { skill: 'Generative AI & RAG', demandPercentage: 78, category: 'AI Engine', yearOverYearGrowth: '+120%', avgSalaryBonus: '+$22,000' }
        ],
        trendingTechnologies: [
          { technology: 'Generative AI & LLMs', category: 'AI', momentumScore: 98, year2024: 35, year2025: 72, year2026: 98, year2027: 120, adoptionLevel: 'Rapid Growth' },
          { technology: 'Vector DBs (Qdrant/Pinecone)', category: 'Database', momentumScore: 92, year2024: 20, year2025: 55, year2026: 92, year2027: 110, adoptionLevel: 'Rapid Growth' },
          { technology: 'React 19 & Next.js', category: 'Frontend', momentumScore: 89, year2024: 65, year2025: 80, year2026: 89, year2027: 95, adoptionLevel: 'Mainstream' },
          { technology: 'Kubernetes & Serverless', category: 'Cloud', momentumScore: 86, year2024: 60, year2025: 74, year2026: 86, year2027: 92, adoptionLevel: 'Mainstream' }
        ],
        popularCareers: [
          { role: `${targetSector} Specialist`, openingsIndex: 112000, popularityScore: 95, demandLevel: 'Very High', entrySalary: 110000, midSalary: 160000, seniorSalary: 225000, topEmployers: ['Google', 'Microsoft', 'NVIDIA', 'Amazon'], futureGrowthRate: '+32%' },
          { role: 'Full-Stack Software Engineer', openingsIndex: 145000, popularityScore: 92, demandLevel: 'Very High', entrySalary: 95000, midSalary: 142000, seniorSalary: 195000, topEmployers: ['Meta', 'Apple', 'Stripe', 'Uber'], futureGrowthRate: '+22%' },
          { role: 'Cloud Solutions Architect', openingsIndex: 94000, popularityScore: 88, demandLevel: 'High', entrySalary: 102000, midSalary: 152000, seniorSalary: 210000, topEmployers: ['AWS', 'Datadog', 'Snowflake', 'Azure'], futureGrowthRate: '+26%' }
        ],
        salaryBreakdowns: [
          { role: `${targetSector} Lead`, entryLevel: 110000, midLevel: 160000, seniorLevel: 225000, avgBonus: 20000 },
          { role: 'Full-Stack Engineer', entryLevel: 95000, midLevel: 142000, seniorLevel: 195000, avgBonus: 15000 },
          { role: 'Cloud Architect', entryLevel: 102000, midLevel: 152000, seniorLevel: 210000, avgBonus: 18000 }
        ],
        demandLevelDistribution: [
          { level: 'Very High Growth', percentage: 60, color: '#10B981', rolesCount: 135000 },
          { level: 'High Demand', percentage: 25, color: '#3B82F6', rolesCount: 58000 },
          { level: 'Moderate Baseline', percentage: 12, color: '#F59E0B', rolesCount: 22000 },
          { level: 'Legacy', percentage: 3, color: '#EF4444', rolesCount: 6000 }
        ],
        futureScopeRadar: [
          { subject: 'AI Integration', growthPotential: 96, aiResilience: 94, remoteFlexibility: 88, entryAccessibility: 76 },
          { subject: 'Full-Stack Web', growthPotential: 86, aiResilience: 82, remoteFlexibility: 92, entryAccessibility: 90 },
          { subject: 'Cloud & Infrastructure', growthPotential: 92, aiResilience: 88, remoteFlexibility: 85, entryAccessibility: 74 }
        ]
      });
    }

    const ai = getGeminiClient();
    const prompt = `
You are a senior labor market economist and tech recruiter analyzing current 2026 hiring statistics for the target sector: "${targetSector}".

Generate a complete job market analysis object with rich data for charts:
1. "topHiringSkills": Array of 8 top skills (skill, demandPercentage number 0-100, category, yearOverYearGrowth string like "+34%", avgSalaryBonus string like "+$16,000")
2. "trendingTechnologies": Array of 6 tech frameworks/tools (technology, category, momentumScore number 0-100, year2024 number, year2025 number, year2026 number, year2027 number, adoptionLevel 'Mainstream'|'Rapid Growth'|'Emerging')
3. "popularCareers": Array of 6 careers (role, openingsIndex number e.g. 110000, popularityScore number 0-100, demandLevel 'Very High'|'High'|'Moderate', entrySalary number USD, midSalary number, seniorSalary number, topEmployers array of 4 companies, futureGrowthRate string like "+30%")
4. "salaryBreakdowns": Array of 6 matching roles (role, entryLevel number USD, midLevel number, seniorLevel number, avgBonus number)
5. "demandLevelDistribution": Array of 4 items (level, percentage number total 100%, color hex string, rolesCount number)
6. "futureScopeRadar": Array of 6 dimensions (subject, growthPotential number 0-100, aiResilience number 0-100, remoteFlexibility number 0-100, entryAccessibility number 0-100)
7. "aiSummary": 2-3 sentence executive market summary.

Return ONLY valid JSON matching this schema:
{
  "lastUpdated": "Q3 2026 Live Market Feed",
  "industrySector": "${targetSector}",
  "aiSummary": "...",
  "topHiringSkills": [...],
  "trendingTechnologies": [...],
  "popularCareers": [...],
  "salaryBreakdowns": [...],
  "demandLevelDistribution": [...],
  "futureScopeRadar": [...]
}
`;

    const rawText = await generateGeminiContentWithFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const parsed = parseJSONFromResponse(rawText);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating job market insights:', error);
    return res.json({
      lastUpdated: 'Q3 2026 Live Market Feed',
      industrySector: req.body.sector || 'Technology & AI Engineering',
      aiSummary: 'High growth across AI, cloud computing, and full-stack software development.',
      topHiringSkills: [
        { skill: 'Python & PyTorch', demandPercentage: 94, category: 'AI', yearOverYearGrowth: '+38%', avgSalaryBonus: '+$18,000' },
        { skill: 'TypeScript & React', demandPercentage: 91, category: 'Frontend', yearOverYearGrowth: '+22%', avgSalaryBonus: '+$12,000' }
      ],
      trendingTechnologies: [
        { technology: 'Generative AI', category: 'AI', momentumScore: 98, year2024: 35, year2025: 72, year2026: 98, year2027: 120, adoptionLevel: 'Rapid Growth' }
      ],
      popularCareers: [
        { role: 'Software Engineer', openingsIndex: 120000, popularityScore: 95, demandLevel: 'Very High', entrySalary: 100000, midSalary: 150000, seniorSalary: 210000, topEmployers: ['Google', 'Meta'], futureGrowthRate: '+30%' }
      ],
      salaryBreakdowns: [
        { role: 'Software Engineer', entryLevel: 100000, midLevel: 150000, seniorLevel: 210000, avgBonus: 18000 }
      ],
      demandLevelDistribution: [
        { level: 'Very High Growth', percentage: 60, color: '#10B981', rolesCount: 120000 }
      ],
      futureScopeRadar: [
        { subject: 'AI Integration', growthPotential: 96, aiResilience: 94, remoteFlexibility: 88, entryAccessibility: 76 }
      ]
    });
  }
});

// 6. AI Career Advisor Chatbot Endpoint
app.post('/api/chat-advisor', async (req, res) => {
  try {
    const { messages, profile, roadmap, skillGap } = req.body;
    const lastUserMsg = messages && messages.length > 0 ? messages[messages.length - 1]?.text || "Hello" : "Hello";

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({
        reply: getFallbackChatReply(lastUserMsg, profile, roadmap)
      });
    }

    const ai = getGeminiClient();

    const systemContext = `
You are Compass AI, a elite, empathetic, and expert AI Career Mentor for university students.
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

    return res.json({
      reply: rawText || getFallbackChatReply(lastUserMsg, profile, roadmap)
    });
  } catch (error: any) {
    console.error('Error in chat advisor:', error);
    const lastUserMsg = req.body.messages?.[req.body.messages.length - 1]?.text || "Hello";
    return res.json({
      reply: getFallbackChatReply(lastUserMsg, req.body.profile, req.body.roadmap)
    });
  }
});

function getFallbackChatReply(query: string, profile: any, roadmap: any): string {
  const q = query.toLowerCase();
  const major = profile?.major || 'Computer Science';
  const skills = (profile?.skills || []).join(', ') || 'programming fundamentals';
  const role = profile?.dreamRole || roadmap?.roleTitle || 'Software Engineer';

  if (q.includes('which career suits me') || q.includes('career suits') || q.includes('best career')) {
    return `### 🎯 Personalized Career Suitability Analysis

Based on your academic background in **${major}** and current skills (**${skills}**), here are the top 3 high-yield career paths tailored for you:

1. **${role} (95% Match)**
   - **Why it fits:** Direct alignment with your **${major}** background and technical skill set in **${skills}**.
   - **Estimated Entry Salary:** $90,000 - $130,000 / year
   - **Core Focus:** Building scalable web applications, REST APIs, and modern component architectures.

2. **Cloud & DevOps Engineer (88% Match)**
   - **Why it fits:** High industry demand for automation, CI/CD pipelines, and cloud infrastructure management.
   - **Estimated Entry Salary:** $95,000 - $135,000 / year
   - **Core Focus:** AWS/GCP, Docker, Kubernetes, Terraform, and automated deployments.

3. **Data Engineer / Analytics Specialist (85% Match)**
   - **Why it fits:** Capitalizes on analytical problem-solving, database querying, and data pipeline construction.
   - **Estimated Entry Salary:** $85,000 - $120,000 / year
   - **Core Focus:** Python, SQL, PostgreSQL, Apache Spark, and dashboarding.

**Next Step:** Head over to the **AI Discovery** tab or **Career Explorer** to dive into day-in-the-life breakdowns and salary benchmarks!`;
  }

  if (q.includes('google') || q.includes('get into google') || q.includes('land google')) {
    return `### 🚀 Step-by-Step Guide to Landing a Role at Google

Landing a Software Engineering or Product role at Google requires a structured 4-pillar strategy:

1. **Master Data Structures & Algorithms (DSA)**
   - **Goal:** Solve 150-200 LeetCode Medium problems in Python, C++, or Java.
   - **Key Focus Areas:** Binary Trees, Graphs (BFS/DFS), Dynamic Programming, Sliding Window, and Hash Maps.
   - **Interview Prep:** Practice speaking out loud while writing code on a clean whiteboard or Google Doc without auto-complete.

2. **Apply Google's X-Y-Z Resume Formula**
   - Frame every project bullet as: *"Accomplished [X], as measured by [Y], by doing [Z]"*.
   - **Example:** *"Improved database query response times by 35% (Y) by implementing Redis caching and SQL indexing (Z) on a full-stack portal serving 1,200 users (X)."*

3. **Master Googleyness & Behavioral Questions**
   - Prepare 5 STAR stories (Situation, Task, Action, Result) showcasing leadership, handling ambiguity, working in cross-functional teams, and learning from failure.

4. **Campus Recruiting & Referral Channels**
   - Apply early when Google University Graduate & STEP Internship roles open in August/September.
   - Connect with university alumni currently working at Google on LinkedIn for informational chats and internal referrals.`;
  }

  if (q.includes('aws') || q.includes('learn aws') || q.includes('cloud')) {
    return `### ☁️ Should You Learn AWS? (Career & ROI Breakdown)

**Short Answer:** **Yes, absolutely!** Cloud proficiency in AWS is one of the highest-demanded skills for modern **${role}** positions.

#### Why AWS is a Game-Changer for Your Resume:
- **80%+ of Enterprise Tech:** Most startups and Fortune 500 companies host their application backends on AWS.
- **Stand Out from Other Students:** Most university grads only know local code execution. Demonstrating live deployments on AWS proves production readiness.

#### Recommended Learning Path for University Students:
1. **Core AWS Services to Master:**
   - **EC2 & Elastic Beanstalk:** Virtual servers and app hosting
   - **S3:** Object storage for uploads & user media
   - **Lambda:** Serverless function execution
   - **DynamoDB / RDS:** Cloud database persistence
2. **First Hands-On Project:**
   - Build a REST API using Node.js/Python, connect it to PostgreSQL on AWS RDS, host media on S3, and deploy the backend on EC2 or AWS App Runner.
3. **Certification Goal:**
   - Target the **AWS Certified Cloud Practitioner** (Foundational) or **AWS Certified Solutions Architect – Associate**.`;
  }

  if (q.includes('dsa') || q.includes('explain dsa') || q.includes('data structures')) {
    return `### 🧩 What is Data Structures & Algorithms (DSA)?

**Data Structures & Algorithms (DSA)** is the fundamental backbone of computer science and technical interviewing.

#### 1. What are Data Structures?
A **Data Structure** is a specific way of organizing, storing, and managing data in memory so it can be accessed efficiently.
- **Linear:** Arrays, Linked Lists, Stacks, Queues
- **Non-Linear:** Trees (Binary Search Trees), Graphs, Hash Tables, Heaps

#### 2. What are Algorithms?
An **Algorithm** is a step-by-step set of instructions to solve a specific computational problem.
- **Examples:** Searching (Binary Search), Sorting (QuickSort, MergeSort), Graph Traversal (BFS, DFS), Dynamic Programming.

#### 3. Why Top Tech Companies Test DSA in Interviews:
- **Scalability:** They want engineers who write code that runs efficiently at scale (evaluated using **Big-O Notation** for Time & Space complexity).
- **Problem Solving:** Tests how you break down complex, unfamiliar constraints into logical code.

#### 💡 Recommended DSA Roadmap for Students:
1. Start with Arrays & Hash Tables (O(1) lookup speed)
2. Practice Two Pointers & Sliding Window techniques
3. Master Recursion, Trees, and BFS/DFS Graph Traversals
4. Build a daily habit of 1 LeetCode problem per day!`;
  }

  if (q.includes('review my roadmap') || q.includes('review roadmap') || q.includes('roadmap review')) {
    const timeToReady = roadmap?.estimatedTimeToJobReady || '4 - 6 Months';
    const milestoneCount = (roadmap?.milestones || []).length;
    const projectCount = (roadmap?.projects || []).length;

    return `### 🗺️ AI Mentor Review of Your Active Career Roadmap

**Roadmap Target:** **${roadmap?.roleTitle || role}**
**Estimated Readiness:** **${timeToReady}** | **Phases:** **${milestoneCount} Milestones** | **Portfolio Projects:** **${projectCount} Projects**

#### 🌟 Overall Score: **92 / 100 (Strong Readiness Structure)**

#### Key Strengths:
1. **Structured Progression:** Clear movement from core technical foundations to full-stack project building and recruiting readiness.
2. **Portfolio Focus:** Includes realistic projects with resume bullet suggestions designed for ATS screening.
3. **Weekly Execution Goals:** Actionable checklists break down long-term goals into achievable weekly habits.

#### 💡 3 Recommendations to Accelerate Your Job-Ready Timeline:
1. **Prioritize Live Deployment:** Ensure all portfolio projects are hosted live on Cloud Run or Vercel with a public GitHub README link.
2. **Mock Interview Routine:** Practice 2-3 mock behavioral & technical interview questions every week using our Interview Prep module.
3. **Networking Goal:** Connect with 3 alumni on LinkedIn in your target role every week to request 15-minute coffee chats!`;
  }

  return `As your AI Career Mentor, I'm here to support your journey towards becoming a successful **${role}**!

Here are some great questions you can ask me:
- **"Which career suits me?"** – Get custom role recommendations based on your major & skills.
- **"How to get into Google?"** – Get the step-by-step campus recruiting blueprint for Google/FAANG.
- **"Should I learn AWS?"** – Learn how cloud certifications boost your hiring chances.
- **"Explain DSA."** – Master Data Structures & Algorithms concepts and interview prep tips.
- **"Review my roadmap."** – Get an instant AI audit of your current career preparation plan.

What would you like to explore next?`;
}


// 7. Skill Gap Analysis Endpoint
app.post('/api/skill-gap', async (req, res) => {
  try {
    const { targetRole, profile } = req.body;
    const role = targetRole || profile?.dreamRole || 'Software Engineer';

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
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
      "difficulty": "Intermediate",
      "estimatedHours": 18,
      "recommendedCourses": [
        {
          "title": "Docker & Kubernetes: Hands-on Mastery",
          "provider": "Coursera / Udemy",
          "level": "Intermediate",
          "url": "https://www.coursera.org"
        }
      ],
      "projects": [
        {
          "title": "Dockerize Microservice Stack",
          "description": "Containerize a multi-container web app with Docker Compose, PostgreSQL database, and automated health checks.",
          "keyDeliverables": [
            "Multi-stage Dockerfile optimizing bundle size",
            "docker-compose.yml configuration with network isolation",
            "Deployed live demo or public GitHub repository"
          ]
        }
      ],
      "certifications": [
        {
          "title": "Docker Certified Associate (DCA)",
          "issuer": "Mirantis / Docker"
        }
      ],
      "completed": false
    },
    {
      "id": "sg_2",
      "skill": "AWS Cloud Services & Deployment",
      "category": "Cloud Infrastructure",
      "priority": "High",
      "difficulty": "Intermediate",
      "estimatedHours": 25,
      "recommendedCourses": [
        {
          "title": "AWS Certified Developer Associate Training",
          "provider": "AWS Training & Certification",
          "level": "Intermediate",
          "url": "https://aws.amazon.com/training/"
        }
      ],
      "projects": [
        {
          "title": "Serverless API on AWS Lambda & S3",
          "description": "Deploy an API Gateway with Lambda functions and DynamoDB persistence.",
          "keyDeliverables": [
            "Infrastructure as Code setup",
            "Live serverless endpoint",
            "CloudWatch logs and alarms configured"
          ]
        }
      ],
      "certifications": [
        {
          "title": "AWS Certified Developer – Associate",
          "issuer": "Amazon Web Services"
        }
      ],
      "completed": false
    },
    {
      "id": "sg_3",
      "skill": "Automated Testing (Jest / Vitest)",
      "category": "Software Quality",
      "priority": "Medium",
      "difficulty": "Beginner",
      "estimatedHours": 10,
      "recommendedCourses": [
        {
          "title": "Testing React Apps with Jest & React Testing Library",
          "provider": "Frontend Masters",
          "level": "Beginner",
          "url": "https://frontendmasters.com"
        }
      ],
      "projects": [
        {
          "title": "Unit & Integration Test Suite for React App",
          "description": "Achieve 85%+ code coverage on critical user flows and API mock responses.",
          "keyDeliverables": [
            "Jest/Vitest test runner integration",
            "Mock service worker setup for API testing"
          ]
        }
      ],
      "certifications": [
        {
          "title": "JavaScript Automated Testing Specialist",
          "issuer": "FreeCodeCamp / Open Certification"
        }
      ],
      "completed": false
    }
  ],
  "industryBenchmarks": [
    {
      "skill": "TypeScript / React",
      "importance": "Mandatory",
      "demandTrend": "Required in 80%+ of full-stack engineering job descriptions"
    },
    {
      "skill": "Docker / Cloud Infrastructure",
      "importance": "Highly Recommended",
      "demandTrend": "Increases interview call-through rates by 35%"
    },
    {
      "skill": "CI/CD & Testing",
      "importance": "Standard Expectation",
      "demandTrend": "Expected for mid-tier and senior entry hiring"
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
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error analyzing skill gap:', error);
    return res.json(getFallbackSkillGapAnalysis(req.body?.targetRole || 'Software Engineer', req.body?.profile));
  }
});

// ------------------- FALLBACK HELPER DATA -------------------
function getFallbackRecommendations(profile: any) {
  const userSkills = profile?.skills || ['TypeScript', 'React', 'Node.js', 'Python', 'SQL'];

  return [
    {
      id: 'role_fb_1',
      title: 'Full-Stack Software Engineer',
      matchScore: 96,
      shortSummary: 'High-impact engineering path leveraging modern web technologies, APIs, and cloud microservice architecture.',
      dayInLife: 'You start with team daily standup, build responsive UI components in React/TypeScript, design REST/GraphQL API endpoints, and review peer pull requests.',
      salaryRange: { entry: '$95,000 - $125,000', mid: '$145,000 - $190,000', senior: '$200,000 - $260,000+' },
      demandGrowth: '+22% High Demand',
      futureDemand: 'Extremely high 5-year outlook across technology hubs, startups, and enterprise transformations globally.',
      reason: 'Your strong foundation in web technologies, university coursework projects, and programming logic makes Full-Stack Engineering an outstanding match.',
      strengths: ['Hands-on project experience in web stacks', 'Solid understanding of data structures', 'Strong problem solving and team collaboration'],
      weaknesses: ['Limited experience with cloud architecture (AWS/GCP)', 'Needs deeper exposure to CI/CD automated deployment pipelines'],
      missingSkills: ['Docker & Containerization', 'AWS / Cloud Deployment', 'GraphQL'],
      keyResponsibilities: ['Build scalable web applications', 'Design database schemas', 'Write automated tests and documentation'],
      matchingSkills: userSkills,
      skillsGap: [
        { skill: 'Docker & Containerization', type: 'missing', importance: 'High', howToAcquire: 'Complete a hands-on Docker tutorial and containerize a web app.' },
        { skill: 'AWS / Cloud Services', type: 'missing', importance: 'Medium', howToAcquire: 'Earn the AWS Certified Cloud Practitioner credential.' }
      ],
      aiReasoning: 'Your combination of frontend and backend coursework projects positions you directly for competitive junior engineering hiring rounds.',
      topEmployers: ['Microsoft', 'Amazon', 'Stripe', 'Linear']
    },
    {
      id: 'role_fb_2',
      title: 'AI / Machine Learning Engineer',
      matchScore: 92,
      shortSummary: 'Build intelligent applications, fine-tune transformer models, vector search indexing, and AI agent workflows.',
      dayInLife: 'You analyze dataset quality, fine-tune domain-specific LLM prompts, build RAG pipelines using vector databases, and benchmark model inference latency.',
      salaryRange: { entry: '$105,000 - $140,000', mid: '$165,000 - $220,000', senior: '$230,000 - $320,000+' },
      demandGrowth: '+38% Explosive Demand',
      futureDemand: 'Unprecedented demand growth over the next decade as enterprise software adopts generative AI and autonomous workflows.',
      reason: 'Your background in Python algorithms and analytical thinking positions you well for the fastest growing sector in software.',
      strengths: ['Python proficiency', 'Analytical mindset and math foundation', 'Enthusiasm for cutting-edge AI technologies'],
      weaknesses: ['Requires hands-on experience with vector stores (Pinecone/Weaviate)', 'Could strengthen knowledge of ML model evaluation metrics'],
      missingSkills: ['Vector Databases (Pinecone/Chroma)', 'PyTorch / TensorFlow', 'LangChain / LlamaIndex'],
      keyResponsibilities: ['Develop LLM API integrations', 'Build vector database pipelines', 'Deploy scalable AI microservices'],
      matchingSkills: ['Python', 'SQL', 'Algorithms'],
      skillsGap: [
        { skill: 'Vector Databases', type: 'missing', importance: 'High', howToAcquire: 'Build an open-source RAG search application using Pinecone or Chroma.' }
      ],
      aiReasoning: 'AI application engineering is in massive shortage; your technical profile allows you to transition rapidly with targeted portfolio projects.',
      topEmployers: ['OpenAI', 'Google DeepMind', 'Anthropic', 'Scale AI']
    },
    {
      id: 'role_fb_3',
      title: 'Cloud & DevOps Solutions Architect',
      matchScore: 88,
      shortSummary: 'Automate infrastructure, CI/CD pipelines, container orchestration, and cloud reliability at enterprise scale.',
      dayInLife: 'You write Infrastructure-as-Code in Terraform, configure Kubernetes clusters, optimize cloud cost efficiency, and monitor system health.',
      salaryRange: { entry: '$90,000 - $115,000', mid: '$135,000 - $175,000', senior: '$185,000 - $250,000+' },
      demandGrowth: '+20% Steady Demand',
      futureDemand: 'Consistent high demand as companies migrate workload architectures to multi-cloud environments.',
      reason: 'Systems understanding and cloud orchestration skills are prized assets with minimal risk of automation.',
      strengths: ['System architecture concepts', 'Linux terminal familiarity', 'Git version control mastery'],
      weaknesses: ['Lack of hands-on Kubernetes orchestration', 'Needs practice with Terraform Infrastructure-as-Code'],
      missingSkills: ['Kubernetes & Helm', 'Terraform', 'CI/CD Pipelines (GitHub Actions)'],
      keyResponsibilities: ['Manage cloud deployments', 'Maintain CI/CD pipelines', 'Enhance platform security & uptime'],
      matchingSkills: ['Linux', 'Git', 'Node.js'],
      skillsGap: [
        { skill: 'Kubernetes', type: 'missing', importance: 'Medium', howToAcquire: 'Set up a local minikube cluster with sample microservices.' }
      ],
      aiReasoning: 'Strong technical foundation opens lucrative operations and platform engineering paths.',
      topEmployers: ['Datadog', 'HashiCorp', 'Snowflake', 'AWS']
    },
    {
      id: 'role_fb_4',
      title: 'Data Engineer & Analytics Architect',
      matchScore: 86,
      shortSummary: 'Architect high-throughput data pipelines, ETL workflows, and real-time data warehouses for business intelligence.',
      dayInLife: 'You write SQL queries, design Snowflake data schemas, build Apache Airflow data pipelines, and optimize database query indexing.',
      salaryRange: { entry: '$85,000 - $110,000', mid: '$130,000 - $165,000', senior: '$180,000 - $230,000+' },
      demandGrowth: '+24% High Growth',
      futureDemand: 'High steady growth; modern AI models rely heavily on clean, well-structured data pipelines.',
      reason: 'Your database and SQL skills translate directly into managing mission-critical enterprise data flows.',
      strengths: ['SQL & Database querying', 'Data manipulation in Python/Pandas', 'Structured logical thinking'],
      weaknesses: ['Needs exposure to distributed processing (Apache Spark/Databricks)', 'Requires practice with Airflow DAG orchestration'],
      missingSkills: ['Apache Spark', 'Snowflake / BigQuery', 'Airflow Pipeline Orchestration'],
      keyResponsibilities: ['Build scalable ETL pipelines', 'Maintain data warehouse health', 'Optimize SQL query performance'],
      matchingSkills: ['SQL', 'Python', 'Data Structures'],
      skillsGap: [
        { skill: 'Distributed Data (Spark/Databricks)', type: 'missing', importance: 'High', howToAcquire: 'Complete a PySpark data processing project on AWS.' }
      ],
      aiReasoning: 'Data engineering is the foundation of all AI and business intelligence initiatives across industry leaders.',
      topEmployers: ['Databricks', 'Snowflake', 'Palantir', 'Capital One']
    },
    {
      id: 'role_fb_5',
      title: 'Associate Product Manager (APM)',
      matchScore: 85,
      shortSummary: 'Bridge technical engineering execution with product vision, user research, and strategic feature roadmaps.',
      dayInLife: 'You analyze product usage analytics, interview end users, write product specifications, and lead sprint planning with engineers.',
      salaryRange: { entry: '$90,000 - $120,000', mid: '$140,000 - $180,000', senior: '$190,000 - $260,000+' },
      demandGrowth: '+18% High Growth',
      futureDemand: 'Strong demand for tech-savvy product leaders who can bridge business goals with complex AI/tech capabilities.',
      reason: 'Your technical background combined with communication skills makes you a strong candidate for prestigious APM rotations.',
      strengths: ['Cross-functional communication', 'Technical literacy', 'Structured problem-solving'],
      weaknesses: ['Limited formal product requirement documentation (PRDs)', 'Needs practice with wireframing tools (Figma)'],
      missingSkills: ['PRD Writing & Specs', 'A/B Testing Analytics', 'Figma Wireframing'],
      keyResponsibilities: ['Define product feature roadmaps', 'Analyze user churn & metric funnels', 'Lead team sprint planning'],
      matchingSkills: ['Communication', 'Data Analysis', 'User Research'],
      skillsGap: [
        { skill: 'PRD Specs & Roadmapping', type: 'missing', importance: 'Medium', howToAcquire: 'Practice writing sample Product Requirement Documents in Notion.' }
      ],
      aiReasoning: 'Prestigious APM programs explicitly target technical graduates with strong product empathy.',
      topEmployers: ['Google APM Program', 'Uber', 'Atlassian', 'Lyft']
    }
  ];
}

function getFallbackRoadmap(targetRole: string) {
  const role = targetRole || 'Software Engineer';
  return {
    roleTitle: role,
    overview: `Your strategic preparation roadmap for landing an entry-level ${role} position. Focuses on foundational technical mastery, portfolio proof, weekly execution goals, and interview readiness.`,
    estimatedTimeToJobReady: '4 - 6 Months',
    milestones: [
      {
        id: 'fb_m1',
        period: 'Phase 1: Months 1-2 (Technical Foundation & Core Tools)',
        title: 'Master Core Skillset & Standards',
        description: 'Build deep confidence in fundamental industry technologies, frameworks, and workflow best practices.',
        completed: true,
        tasks: [
          'Complete key framework specialization course',
          'Set up GitHub profile with clean READMEs and commit history',
          'Solve 25+ targeted algorithmic/problem-solving challenges'
        ],
        recommendedResources: [
          { title: 'FreeCodeCamp / Full Stack Open', type: 'Course', url: 'https://fullstackopen.com' },
          { title: 'LeetCode / HackerRank Practice', type: 'Project', url: 'https://leetcode.com' }
        ],
        resumeBulletSuggestion: 'Engineered responsive web applications utilizing TypeScript and modern state management, ensuring smooth rendering performance.'
      },
      {
        id: 'fb_m2',
        period: 'Phase 2: Months 3-4 (Full-Scale Portfolio Project & Certification)',
        title: 'Ship a Featured Production Project',
        description: 'Architect a complete end-to-end application solving a real student or industry problem, deployed to live cloud infrastructure.',
        completed: false,
        tasks: [
          'Design database schema and REST API specifications',
          'Implement user authentication and external API integration',
          'Deploy to Vercel/Render/Cloud Run with continuous delivery'
        ],
        recommendedResources: [
          { title: 'AWS Cloud Practitioner / Developer Certification', type: 'Certification' },
          { title: 'System Design Primer (GitHub)', type: 'Book', url: 'https://github.com' }
        ],
        resumeBulletSuggestion: 'Architected and deployed a full-stack SaaS application handling live API queries, achieving 99.8% uptime on cloud hosting.'
      },
      {
        id: 'fb_m3',
        period: 'Phase 3: Months 5-6 (Campus Recruiting, Resume & Mock Interviews)',
        title: 'Campus Applications & Behavioral Excellence',
        description: 'Optimize ATS resume keywords, prepare STAR behavioral stories, and practice technical interview problem solving under timed conditions.',
        completed: false,
        tasks: [
          'Run resume through ATS keyword analyzer for 5 target job postings',
          'Conduct 3 mock technical interviews with peers or AI mentor',
          'Reach out to 15 university alumni on LinkedIn for coffee chats'
        ],
        recommendedResources: [
          { title: 'Cracking the Coding / Technical Interview', type: 'Book' },
          { title: 'LinkedIn Alumni Search Network', type: 'Course' }
        ],
        resumeBulletSuggestion: 'Selected for competitive university tech fellowship based on technical project execution and peer leadership.'
      }
    ],
    monthlyGoals: [
      {
        id: 'month_1',
        monthNumber: 1,
        title: 'Month 1: Core Fundamentals & Workflow Automation',
        summary: 'Solidify foundational syntax, Git workflow best practices, and algorithmic problem-solving basics.',
        completed: false,
        weeklyGoals: [
          {
            id: 'w1_1',
            weekNumber: 1,
            title: 'Week 1: Development Setup & Environment Config',
            focus: 'VS Code extensions, Git/GitHub SSH, and linters',
            tasks: [
              { id: 'wt1_1', title: 'Configure VSCode with ES7+, Tailwind, and Prettier extensions', completed: true },
              { id: 'wt1_2', title: 'Create GitHub account and configure SSH key authentication', completed: true },
              { id: 'wt1_3', title: 'Build a mini hello-world repository with custom README', completed: false }
            ]
          },
          {
            id: 'w1_2',
            weekNumber: 2,
            title: 'Week 2: Advanced Data Structures & Control Logic',
            focus: 'Arrays, Objects, Hash Maps, and Recursion',
            tasks: [
              { id: 'wt2_1', title: 'Solve 10 Easy array and string manipulation questions on LeetCode', completed: false },
              { id: 'wt2_2', title: 'Understand Big-O time and space complexity trade-offs', completed: false }
            ]
          },
          {
            id: 'w1_3',
            weekNumber: 3,
            title: 'Week 3: RESTful API Principles & Asynchronous JS/TS',
            focus: 'Fetch/Axios, Promises, Async/Await, and API Status Codes',
            tasks: [
              { id: 'wt3_1', title: 'Build a command-line weather/quote fetcher utility using public APIs', completed: false },
              { id: 'wt3_2', title: 'Implement robust error handling and loading indicators', completed: false }
            ]
          },
          {
            id: 'w1_4',
            weekNumber: 4,
            title: 'Week 4: First Mini Project & Code Review',
            focus: 'Clean Code, modular design, and peer code review',
            tasks: [
              { id: 'wt4_1', title: 'Complete first standalone functional prototype', completed: false },
              { id: 'wt4_2', title: 'Publish project repository and write detailed documentation', completed: false }
            ]
          }
        ]
      },
      {
        id: 'month_2',
        monthNumber: 2,
        title: 'Month 2: Full-Stack Architecture & Databases',
        summary: 'Build REST APIs, design relational database schemas, and integrate backend databases.',
        completed: false,
        weeklyGoals: [
          {
            id: 'w2_1',
            weekNumber: 5,
            title: 'Week 5: Relational Database Modeling & SQL',
            focus: 'PostgreSQL/MySQL, primary/foreign keys, and JOIN queries',
            tasks: [
              { id: 'wt5_1', title: 'Design an Entity-Relationship (ER) diagram for an e-commerce platform', completed: false },
              { id: 'wt5_2', title: 'Write SQL queries for complex aggregations and joins', completed: false }
            ]
          },
          {
            id: 'w2_2',
            weekNumber: 6,
            title: 'Week 6: Express & Server Middleware Integration',
            focus: 'Routing, middleware authentication, and CORS',
            tasks: [
              { id: 'wt6_1', title: 'Build Express backend server with modular routes', completed: false },
              { id: 'wt6_2', title: 'Add JWT user authentication and password hashing', completed: false }
            ]
          },
          {
            id: 'w2_3',
            weekNumber: 7,
            title: 'Week 7: Frontend Component Architecture',
            focus: 'React Hooks, custom hooks, and state management',
            tasks: [
              { id: 'wt7_1', title: 'Connect React client to Express REST API endpoints', completed: false },
              { id: 'wt7_2', title: 'Add toast notifications and form input validations', completed: false }
            ]
          },
          {
            id: 'w2_4',
            weekNumber: 8,
            title: 'Week 8: Full-Stack Integration & Cloud Deployment',
            focus: 'Vercel, Render, Cloud Run, and Environment Variables',
            tasks: [
              { id: 'wt8_1', title: 'Deploy full-stack web application to live production host', completed: false },
              { id: 'wt8_2', title: 'Secure backend API keys using environment variables', completed: false }
            ]
          }
        ]
      },
      {
        id: 'month_3',
        monthNumber: 3,
        title: 'Month 3: Capstone Project & Cloud Certification',
        summary: 'Architect an ambitious flagship portfolio project and prepare for industry certifications.',
        completed: false,
        weeklyGoals: [
          {
            id: 'w3_1',
            weekNumber: 9,
            title: 'Week 9: Capstone Requirements & UI Wireframing',
            focus: 'Figma mockups, API specifications, and architecture diagrams',
            tasks: [
              { id: 'wt9_1', title: 'Draft technical architecture spec document for Capstone Project', completed: false },
              { id: 'wt9_2', title: 'Design UI screens in Figma or Excalidraw', completed: false }
            ]
          },
          {
            id: 'w3_2',
            weekNumber: 10,
            title: 'Week 10: Capstone Core Logic & API Construction',
            focus: 'Core business logic, external API integrations, and search',
            tasks: [
              { id: 'wt10_1', title: 'Implement core database models and backend services', completed: false },
              { id: 'wt10_2', title: 'Integrate external AI / Gemini API endpoints', completed: false }
            ]
          },
          {
            id: 'w3_3',
            weekNumber: 11,
            title: 'Week 11: Polish, Accessibility & Testing',
            focus: 'Jest unit tests, WCAG AA compliance, and mobile responsiveness',
            tasks: [
              { id: 'wt11_1', title: 'Write unit tests for core helper utilities and API endpoints', completed: false },
              { id: 'wt11_2', title: 'Audit mobile responsiveness across all viewport sizes', completed: false }
            ]
          },
          {
            id: 'w3_4',
            weekNumber: 12,
            title: 'Week 12: Production Launch & Demo Video',
            focus: 'Live deployment, custom domain, and 2-minute video pitch',
            tasks: [
              { id: 'wt12_1', title: 'Record a polished 2-minute Loom walkthrough video', completed: false },
              { id: 'wt12_2', title: 'Add live demo links and video embed to GitHub README', completed: false }
            ]
          }
        ]
      },
      {
        id: 'month_4',
        monthNumber: 4,
        title: 'Month 4: Resume ATS Optimization & Interview Prep',
        summary: 'Finalize ATS-ready resume, practice technical coding questions, and master behavioral STAR method.',
        completed: false,
        weeklyGoals: [
          {
            id: 'w4_1',
            weekNumber: 13,
            title: 'Week 13: ATS Resume Engineering',
            focus: 'Action verbs, quantified metrics, and ATS keyword match',
            tasks: [
              { id: 'wt13_1', title: 'Revise project bullet points using Google XYZ formula', completed: false },
              { id: 'wt13_2', title: 'Run resume through ATS analyzer for 5 target job posts', completed: false }
            ]
          },
          {
            id: 'w4_2',
            weekNumber: 14,
            title: 'Week 14: System Design & Architectural Concepts',
            focus: 'Load balancing, caching, database sharding, and queues',
            tasks: [
              { id: 'wt14_1', title: 'Study System Design Primer for common interview patterns', completed: false },
              { id: 'wt14_2', title: 'Practice designing URL shortener or chat application on whiteboard', completed: false }
            ]
          },
          {
            id: 'w4_3',
            weekNumber: 15,
            title: 'Week 15: Mock Behavioral & Technical Interviews',
            focus: 'STAR technique, communication clarity, and timed coding',
            tasks: [
              { id: 'wt15_1', title: 'Prepare 5 STAR stories covering leadership, conflict, and failure', completed: false },
              { id: 'wt15_2', title: 'Complete 3 mock interview sessions with AI Career Advisor', completed: false }
            ]
          },
          {
            id: 'w4_4',
            weekNumber: 16,
            title: 'Week 16: Active Campus Recruiting & Outreach',
            focus: 'LinkedIn networking, university career fairs, and applications',
            tasks: [
              { id: 'wt16_1', title: 'Submit 25 customized job applications to target tech companies', completed: false },
              { id: 'wt16_2', title: 'Reach out to 10 alumni or hiring managers on LinkedIn', completed: false }
            ]
          }
        ]
      }
    ],
    projects: [
      {
        id: 'p1',
        title: 'Full-Stack Smart Analytics Dashboard',
        difficulty: 'Intermediate' as const,
        description: 'A responsive full-stack analytics platform featuring live charts, user authentication, and data filtering.',
        techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'PostgreSQL'],
        keyDeliverables: [
          'Interactive charting with Recharts/D3',
          'JWT authentication with role-based access control',
          'REST API endpoints with automated SQL query optimization',
          'Live deployment on Cloud Run / Vercel'
        ],
        resumeBullet: 'Architected a full-stack analytics dashboard serving 500+ active users, reducing query latency by 35% through SQL index optimization.',
        completed: false
      },
      {
        id: 'p2',
        title: 'AI-Powered Resume & Skill Matcher',
        difficulty: 'Advanced' as const,
        description: 'An intelligent web service that analyzes candidate resumes against job descriptions using Gemini AI.',
        techStack: ['TypeScript', 'Gemini API', 'Express', 'Tailwind CSS'],
        keyDeliverables: [
          'PDF parser and text extraction pipeline',
          'Server-side Gemini AI integration for ATS analysis',
          'Actionable gap analysis and score breakdown UI'
        ],
        resumeBullet: 'Engineered an AI-driven resume scoring tool utilizing Google Gemini API, achieving 92% user satisfaction across 120+ student test sessions.',
        completed: false
      }
    ],
    courses: [
      {
        id: 'c1',
        title: 'Full Stack Web Development Specialization',
        provider: 'University of Helsinki (Full Stack Open)',
        type: 'Free' as const,
        duration: '60 Hours',
        url: 'https://fullstackopen.com',
        completed: true
      },
      {
        id: 'c2',
        title: 'Cloud Architect & Infrastructure Fundamentals',
        provider: 'Google Cloud Training',
        type: 'Certification' as const,
        duration: '25 Hours',
        url: 'https://cloud.google.com/training',
        completed: false
      },
      {
        id: 'c3',
        title: 'Data Structures & Algorithmic Thinking',
        provider: 'Coursera / Princeton',
        type: 'Free' as const,
        duration: '40 Hours',
        url: 'https://coursera.org',
        completed: false
      }
    ],
    practiceQuestions: [
      {
        id: 'q1',
        category: 'Coding' as const,
        question: 'How do you detect a cycle in a linked list in O(n) time and O(1) space?',
        hint: 'Use Floyd\'s Cycle-Finding Algorithm (Slow and Fast pointers).',
        solutionSummary: 'Initialize two pointers (slow moving 1 step, fast moving 2 steps). If fast and slow meet, a cycle exists. If fast reaches null, there is no cycle.',
        completed: false
      },
      {
        id: 'q2',
        category: 'System Design' as const,
        question: 'How would you design a scalable rate limiter for an API with millions of daily requests?',
        hint: 'Discuss Token Bucket, Leaky Bucket, or Fixed/Sliding Window Counter algorithms, and using Redis for atomic increments.',
        solutionSummary: 'Implement a Sliding Window Counter algorithm using Redis memory cache with atomic INCR and EXPIRE operations to track client IP/token request counts per minute.',
        completed: false
      },
      {
        id: 'q3',
        category: 'Behavioral' as const,
        question: 'Tell me about a time you encountered a tight deadline or technical obstacle during a team project.',
        hint: 'Use the STAR method (Situation, Task, Action, Result) with clear quantitative metrics.',
        solutionSummary: 'Describe a specific technical bottleneck, how you triaged tasks, communicated with teammates, applied a workaround or optimization, and achieved on-time delivery.',
        completed: false
      },
      {
        id: 'q4',
        category: 'Domain Knowledge' as const,
        question: 'What is the difference between SQL and NoSQL databases, and when should you choose each?',
        hint: 'Compare ACID compliance, schema flexibility, relational integrity, horizontal vs vertical scaling.',
        solutionSummary: 'SQL databases (e.g. PostgreSQL) offer strict schemas, ACID compliance, and relational integrity ideal for complex transactions. NoSQL (e.g. MongoDB/Firestore) offers flexible schemas and horizontal scalability ideal for unstructured or rapidly evolving data.',
        completed: false
      }
    ]
  };
}

function getFallbackResumeAnalysis(targetRole: string) {
  const role = targetRole || 'Software Engineer';
  return {
    resumeScore: 86,
    atsScore: 84,
    targetRole: role,
    overallSummary: `Your resume demonstrates strong technical coursework and relevant projects. To maximize your callback rate for ${role}, emphasize quantifiable achievements, fix minor phrasing, and incorporate key missing ATS keywords.`,
    categoryScores: [
      { category: 'ATS Compatibility', score: 88, feedback: 'Standard single-column formatting easily extracted by applicant tracking systems.' },
      { category: 'Impact & Action Verbs', score: 78, feedback: 'Good power verbs used, but several bullets lack quantifiable metric outcomes.' },
      { category: 'Technical Depth', score: 85, feedback: 'Strong coverage of languages, frameworks, and modern development tooling.' },
      { category: 'Grammar & Readability', score: 92, feedback: 'Clear, concise academic tone with high readability.' }
    ],
    grammar: {
      score: 92,
      issuesFound: 2,
      grammarFeedback: [
        "Ensure consistent tense usage: use past tense for completed projects ('developed', 'built') and present tense for current roles.",
        "Avoid first-person pronouns ('I', 'my') in bullet points for standard recruiter formatting."
      ],
      toneAndClarity: "Professional, concise, and academic. Excellent overall readability."
    },
    skills: {
      identifiedSkills: ["Python", "TypeScript", "React", "Node.js", "SQL", "Git", "Docker"],
      technicalStack: ["React", "Express", "PostgreSQL", "Tailwind CSS", "REST APIs"],
      softSkills: ["Problem Solving", "Team Collaboration", "Agile Mindset"],
      skillLevelEstimate: "Intermediate / Entry-Level Ready"
    },
    projects: {
      projectScore: 82,
      strengths: [
        "Clear project titles with GitHub repository links",
        "Demonstrates practical full-stack technology usage"
      ],
      weaknesses: [
        "Lacks numerical metrics (e.g. user count, percentage performance gain, latency reduction)",
        "Project descriptions could highlight technical challenges overcome"
      ],
      impactQuantificationTips: [
        "Add user metrics: 'Used by 500+ students during campus hackathon'",
        "Add performance metrics: 'Reduced API loading time by 40% with database indexing'"
      ]
    },
    keyStrengths: [
      'Clean education section with relevant course titles highlighted',
      'Good variety of technical tools and programming languages',
      'Clear project titles and links provided'
    ],
    missingKeywords: [
      'Agile / Scrum Methodologies',
      'Unit & Integration Testing (Jest)',
      'Continuous Integration (CI/CD Pipeline)',
      'AWS / Cloud Deployment'
    ],
    suggestions: [
      'Format bullet points using the Google XYZ formula: Accomplished [X], as measured by [Y], by doing [Z].',
      'Add a dedicated "Certifications & Cloud" section if you hold AWS or Docker credentials.',
      'Tailor technical skills section to match job posting requirements directly.'
    ],
    bulletPointImprovements: [
      {
        original: 'Created a website for a student club to manage events.',
        improved: 'Engineered a full-stack web portal in React & Express for 300+ club members, automating event RSVPs and cutting administrative overhead by 60%.',
        reason: 'Replaced passive phrasing with active power verbs and added measurable quantitative results.'
      },
      {
        original: 'Helped with database bug fixes and query optimizations.',
        improved: 'Refactored SQL query indexing and database schema design, reducing API response latency by 180ms across primary user endpoints.',
        reason: 'Specified exact database technology and measured performance improvement.'
      }
    ],
    formatActionItems: [
      'Format bullet points using the Google XYZ formula: Accomplished [X], as measured by [Y], by doing [Z].',
      'Ensure standard single-column PDF layout for optimal ATS parser extraction.'
    ]
  };
}

function getFallbackQuestions(targetRole: string) {
  const role = targetRole || 'Software Engineer';
  return [
    {
      id: 'hr_1',
      question: `Why are you specifically interested in starting your career as a ${role} at our company, and where do you envision yourself in 3 years?`,
      category: 'HR',
      hint: 'Connect company mission with your personal projects, learning velocity, and career goals.',
      sampleKeyPoints: [
        'Mention specific engineering or product achievements of the target company',
        'Demonstrate commitment to continuous technical growth and teamwork',
        'Highlight long-term impact aspirations'
      ]
    },
    {
      id: 'hr_2',
      question: 'How do you prioritize competing deadlines when managing university coursework, personal portfolio projects, and interview prep?',
      category: 'HR',
      hint: 'Demonstrate time management frameworks (e.g., Eisenhower matrix, time-blocking, Agile sprints).',
      sampleKeyPoints: [
        'Mention concrete time-blocking methods',
        'Explain how you communicate proactively if trade-offs are required',
        'Highlight personal discipline and consistency'
      ]
    },
    {
      id: 'tech_1',
      question: `Explain the fundamental architectural differences between REST and GraphQL APIs, and when you would choose REST for a ${role} backend.`,
      category: 'Technical',
      hint: 'Discuss over-fetching / under-fetching, caching simplicity (HTTP status codes), client query flexibility, and backend complexity.',
      sampleKeyPoints: [
        'Over-fetching vs flexible schema queries',
        'CDN caching advantages of standard HTTP endpoints in REST',
        'Security and rate-limiting considerations'
      ]
    },
    {
      id: 'tech_2',
      question: 'How does indexing in relational databases (like PostgreSQL) improve read query performance, and what is the trade-off during write operations?',
      category: 'Technical',
      hint: 'Explain B-Tree data structure indexing, O(log N) lookup vs O(N) sequential table scan, and index maintenance overhead during INSERTs/UPDATEs.',
      sampleKeyPoints: [
        'B-Tree index structure for accelerated WHERE / JOIN lookups',
        'Trade-off: slower INSERT / UPDATE / DELETE operations due to index rebuilding',
        'Selective indexing best practices'
      ]
    },
    {
      id: 'code_1',
      question: 'Write a function "validAnagram(s: string, t: string): boolean" that checks if string t is an anagram of string s.',
      category: 'Coding',
      hint: 'Use a Hash Map or Frequency Array of 26 character counts for O(N) time and O(1) auxiliary space complexity.',
      sampleKeyPoints: [
        'Frequency count using Hash Map or array of length 26',
        'Check string length parity upfront',
        'Time Complexity: O(N), Space Complexity: O(1)'
      ],
      problemStatement: 'Given two strings s and t, return true if t is an anagram of s, and false otherwise. An Anagram is a word formed by rearranging the letters of a different word, typically using all the original letters exactly once.',
      starterCode: 'function validAnagram(s: string, t: string): boolean {\n  if (s.length !== t.length) return false;\n  const count: { [key: string]: number } = {};\n  for (let char of s) {\n    count[char] = (count[char] || 0) + 1;\n  }\n  for (let char of t) {\n    if (!count[char]) return false;\n    count[char]--;\n  }\n  return true;\n}',
      testCases: [
        { input: 's = "anagram", t = "nagaram"', output: 'true' },
        { input: 's = "rat", t = "car"', output: 'false' }
      ]
    },
    {
      id: 'code_2',
      question: 'Write a function "maxSubArray(nums: number[]): number" that finds the contiguous subarray with the largest sum (Kadane\'s Algorithm).',
      category: 'Coding',
      hint: 'Use Kadane\'s Algorithm: maintain current sub-array sum and max sum seen so far in O(N) time.',
      sampleKeyPoints: [
        'Kadane\'s Algorithm O(N) time complexity',
        'O(1) space complexity',
        'Handle negative number arrays properly'
      ],
      problemStatement: 'Given an integer array nums, find the subarray with the largest sum, and return its sum.',
      starterCode: 'function maxSubArray(nums: number[]): number {\n  let maxSoFar = nums[0];\n  let currentMax = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    currentMax = Math.max(nums[i], currentMax + nums[i]);\n    maxSoFar = Math.max(maxSoFar, currentMax);\n  }\n  return maxSoFar;\n}',
      testCases: [
        { input: 'nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]', output: '6' },
        { input: 'nums = [1]', output: '1' }
      ]
    },
    {
      id: 'beh_1',
      question: 'Describe a situation where a technical project deadline was at risk due to unexpected bugs or scope creep. How did you handle it?',
      category: 'Behavioral',
      hint: 'Focus on triage, clear team communication, pragmatic feature trade-offs, and lessons learned.',
      sampleKeyPoints: [
        'Outline initial deadline and unexpected technical roadblock',
        'Explain how you communicated with team/mentor and prioritized MVP features',
        'Highlight successful delivery and future prevention steps'
      ]
    },
    {
      id: 'beh_2',
      question: 'Tell me about a time when you received constructive or critical feedback on your code during a peer review or project grade. How did you respond?',
      category: 'Behavioral',
      hint: 'Demonstrate humility, active listening, taking ownership, and applying feedback to improve future work.',
      sampleKeyPoints: [
        'Acknowledge the feedback constructively without defensiveness',
        'Describe changes made to refactor code or improve testing',
        'Share how it permanently upgraded your coding standard'
      ]
    }
  ];
}

function getFallbackEvaluation(category?: string) {
  const cat = category || 'Behavioral';
  return {
    score: 88,
    strengths: [
      `Clear, structured articulation tailored for a ${cat} interview evaluation`,
      'Demonstrates solid problem-solving process and personal accountability',
      'Positive tone and strong communication clarity'
    ],
    areasForImprovement: [
      'Incorporate more specific numeric impact metrics (e.g., % speedup, latency reduction, user count)',
      'Explicitly highlight Big-O time/space complexity or system scalability implications'
    ],
    starFormatSuggestions: 'Structure using the STAR framework: Situation (15%), Task (15%), Action (50%), Result (20%). Conclude with a strong quantifiable metric.',
    technicalFeedback: 'Great technical depth! Emphasize memory allocation trade-offs and edge-case validation.',
    codeQualityAnalysis: 'Time Complexity: O(N) linear scan, Space Complexity: O(1) auxiliary memory. Code is clean and readable.',
    modelAnswer: 'In my senior software project, our team faced high latency on our backend API. I took the initiative to profile memory usage, identified unindexed database queries, and implemented Redis caching, which reduced load times by 45% and allowed us to successfully pass our final capstone review.'
  };
}

function getFallbackSkillGapAnalysis(targetRole: string, profile: any) {
  const userSkills = profile?.skills || ['TypeScript', 'React', 'Node.js', 'Python', 'SQL'];

  return {
    targetRole,
    readinessScore: 78,
    overallSummary: `Solid foundation in core development for ${targetRole}. To bridge the remaining 22% gap to senior entry readiness, focus on containerization, cloud deployment, and automated testing.`,
    industryDemandOutlook: `High Demand (+25% YoY growth for ${targetRole} positions in tech hubs)`,
    completedSkills: userSkills.map((sk: string) => ({
      skill: sk,
      category: 'Core Technical Stack',
      proficiency: 'Proficient',
      matchReason: 'Active skill listed in candidate profile and academic portfolio.'
    })),
    missingSkills: [
      {
        id: 'sg_fb_1',
        skill: 'Docker & Containerization',
        category: 'DevOps & Deployment',
        priority: 'High',
        difficulty: 'Intermediate',
        estimatedHours: 15,
        recommendedCourses: [
          {
            title: 'Docker & Kubernetes: The Complete Guide',
            provider: 'Udemy / Coursera',
            level: 'Intermediate',
            url: 'https://www.coursera.org'
          }
        ],
        projects: [
          {
            title: 'Dockerize Full-Stack App with Microservices',
            description: 'Containerize frontend, backend API, and database into docker-compose microservices.',
            keyDeliverables: [
              'Multi-stage Dockerfile for optimized production build',
              'Docker-compose.yml file with network isolation',
              'Public GitHub repo with container setup instructions'
            ]
          }
        ],
        certifications: [
          {
            title: 'Docker Certified Associate (DCA)',
            issuer: 'Mirantis / Docker'
          }
        ],
        completed: false
      },
      {
        id: 'sg_fb_2',
        skill: 'AWS Cloud Architecture',
        category: 'Cloud Infrastructure',
        priority: 'High',
        difficulty: 'Intermediate',
        estimatedHours: 25,
        recommendedCourses: [
          {
            title: 'AWS Certified Developer Associate Prep',
            provider: 'AWS Training / Udemy',
            level: 'Intermediate',
            url: 'https://aws.amazon.com/training/'
          }
        ],
        projects: [
          {
            title: 'Serverless API Deployment on AWS Lambda',
            description: 'Build and deploy a REST API with API Gateway, AWS Lambda, and DynamoDB.',
            keyDeliverables: [
              'Live AWS serverless API endpoint',
              'CloudWatch monitoring & error logging',
              'Infrastructure as Code setup script'
            ]
          }
        ],
        certifications: [
          {
            title: 'AWS Certified Developer - Associate',
            issuer: 'Amazon Web Services'
          }
        ],
        completed: false
      },
      {
        id: 'sg_fb_3',
        skill: 'Automated Testing (Jest / Vitest)',
        category: 'Software Quality',
        priority: 'Medium',
        difficulty: 'Beginner',
        estimatedHours: 10,
        recommendedCourses: [
          {
            title: 'Unit and Integration Testing in React & Node',
            provider: 'Frontend Masters',
            level: 'Beginner',
            url: 'https://frontendmasters.com'
          }
        ],
        projects: [
          {
            title: 'Unit Test Suite for Critical Application Flows',
            description: 'Write unit tests achieving 80%+ code coverage for user authentication and data processing.',
            keyDeliverables: [
              'Configured Jest / Vitest test runner',
              'Mock service worker for API request testing',
              'GitHub Actions CI pipeline running tests automatically'
            ]
          }
        ],
        certifications: [
          {
            title: 'Software Quality & Testing Certification',
            issuer: 'FreeCodeCamp / Open Certification'
          }
        ],
        completed: false
      }
    ],
    industryBenchmarks: [
      {
        skill: 'Core Stack (React / TypeScript / Python)',
        importance: 'Mandatory',
        demandTrend: 'Required by 90%+ of junior tech job descriptions'
      },
      {
        skill: 'Docker & Cloud Deployment',
        importance: 'High Priority',
        demandTrend: 'Distinguishes top 15% of candidates in technical screens'
      },
      {
        skill: 'Automated Testing & CI/CD',
        importance: 'Standard Expectation',
        demandTrend: 'Expected standard in modern engineering teams'
      }
    ]
  };
}

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
    console.log(`CareerCompass AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
