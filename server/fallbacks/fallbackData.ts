import { calculate11DimensionReadiness } from '../services/scoring';

export function getFallbackChatReply(query: string, profile: any, roadmap: any): string {
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

export function getFallbackRecommendations(profile: any) {
  const userSkills = profile?.skills || ['TypeScript', 'React', 'Node.js', 'Python', 'SQL'];

  return [
    {
      id: 'role_fb_1',
      title: 'Full-Stack Software Engineer',
      matchScore: 96,
      shortSummary: 'High-impact engineering path leveraging modern web technologies, APIs, and cloud microservice architecture.',
      whyRecommended: 'Recommended because: Strong proficiency in React & TypeScript, active web coursework projects, solid logical problem solving, and structured team collaboration skills.',
      supportingFactors: [
        'Strong web development stack proficiency (React, TypeScript, Node.js)',
        'Demonstrated project portfolio with full-stack API integration',
        'Solid logical problem-solving performance',
        'Academic coursework alignment in computer science & software engineering'
      ],
      areasForImprovement: [
        'Expand production experience with cloud deployment platforms (AWS/GCP)',
        'Strengthen automated CI/CD deployment pipeline configuration'
      ],
      requiredSkills: ['TypeScript', 'React', 'Node.js', 'REST APIs', 'SQL', 'Git'],
      matchingSkills: userSkills,
      relevantInterests: profile?.interests || ['Web Development', 'Full-Stack Systems', 'Cloud APIs'],
      relevantProjects: profile?.projects?.map((p: any) => p.name || p.title) || ['Web Application Portfolio Project'],
      relevantAssessmentStrengths: ['Logical Problem Solving (85%+ Aptitude)', 'Structured Team Collaboration Rating'],
      missingSkills: ['Docker & Containerization', 'AWS / Cloud Deployment', 'GraphQL'],
      recommendedNextSteps: [
        'Complete a hands-on Docker & Kubernetes containerization tutorial',
        'Build and deploy a full-stack REST API project to Vercel/Cloud Run',
        'Earn the AWS Certified Cloud Practitioner credential'
      ],
      keyResponsibilities: ['Build scalable web applications', 'Design database schemas', 'Write automated tests and documentation'],
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
      whyRecommended: 'Recommended because: High analytical aptitude performance, Python algorithm background, strong interest in AI applications, and quantitative problem solving.',
      supportingFactors: [
        'Python proficiency and algorithmic problem solving',
        'High quantitative and analytical reasoning aptitude score',
        'Strong passion and interest in artificial intelligence models',
        'Structured problem-solving approach to complex tasks'
      ],
      areasForImprovement: [
        'Gain hands-on experience with vector database index tuning',
        'Learn LLM evaluation frameworks and benchmark metrics'
      ],
      requiredSkills: ['Python', 'PyTorch / TensorFlow', 'Vector DBs', 'LLM Prompt Engineering', 'SQL'],
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
      whyRecommended: 'Recommended because: High interest in cloud infrastructure, methodical problem solving, Linux terminal familiarity, and systematic work style.',
      supportingFactors: [
        'System architecture interest and structured problem solving',
        'Linux terminal and Git version control mastery',
        'Reliable execution and attention to infrastructure safety'
      ],
      areasForImprovement: [
        'Build practical experience with Kubernetes cluster management',
        'Learn Infrastructure-as-Code with Terraform'
      ],
      requiredSkills: ['Linux', 'Docker & Kubernetes', 'AWS / Cloud', 'Terraform', 'CI/CD'],
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
      whyRecommended: 'Recommended because: Strong quantitative test results, SQL & database proficiency, structured analytical mindset, and data domain interest.',
      supportingFactors: [
        'Strong SQL and database schema design skills',
        'Quantitative data logic aptitude score',
        'Structured analytical approach to complex data flows'
      ],
      areasForImprovement: [
        'Gain experience with distributed data engines (Apache Spark/Databricks)',
        'Learn Airflow DAG workflow scheduling'
      ],
      requiredSkills: ['SQL', 'Python', 'Apache Spark', 'Data Warehousing', 'ETL Pipelines'],
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
      whyRecommended: 'Recommended because: High communication and leadership scores, technical background, interest in product strategy, and user empathy.',
      supportingFactors: [
        'High cross-functional communication & leadership self-ratings',
        'Technical engineering background for effective developer collaboration',
        'Strategic product vision and interest in user experience'
      ],
      areasForImprovement: [
        'Practice writing formal Product Requirement Documents (PRDs)',
        'Learn A/B testing analytics and product funnel metrics'
      ],
      requiredSkills: ['Product Strategy', 'Technical Specs (PRDs)', 'User Research', 'Data Analytics', 'Agile/Scrum'],
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

export function getFallbackRoadmap(targetRole: string) {
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

export function getFallbackResumeAnalysis(targetRole: string) {
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

export function getFallbackQuestions(targetRole: string) {
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

export function getFallbackEvaluation(category?: string) {
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

export function getFallbackSkillGapAnalysis(targetRole: string, profile: any) {
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

export function getFallbackAssessmentReport(responses: any, whatIfParams?: any) {
  // Deterministic 11-Dimensional Holistic Evaluation Engine
  const evalResult = calculate11DimensionReadiness(responses, whatIfParams);
  const readiness = evalResult.readinessScore;
  const readinessBreakdown = evalResult.breakdown;

  const dims = responses?.structuredAssessment?.dimensions || responses?.dimensions || responses || {};
  const personalInfo = dims.academicBackground || dims.personalInfo || responses?.personalInfo || {};
  const careerGoals = dims.careerGoals || responses?.careerGoals || {};
  const technicalSkills = dims.technicalSkills || responses?.technicalSkills || {};
  const projectExperience = dims.projectsAndExperience || dims.projectExperience || responses?.projectExperience || [];
  const interests = dims.interests || responses?.interests || [];

  const name = personalInfo.fullName || 'Student';
  const major = personalInfo.department || personalInfo.major || 'Computer Science';
  const targetRole = careerGoals.targetRole || 'Software Engineer';
  const userLanguages = technicalSkills.languages && technicalSkills.languages.length > 0
    ? technicalSkills.languages
    : ['Python', 'JavaScript', 'TypeScript'];
  const aptitudeScore = readinessBreakdown.aptitude;
  const projectCount = Array.isArray(projectExperience) ? projectExperience.length : 1;

  return {
    readinessScore: readiness,
    readinessBreakdown,
    summary: `Based on an 11-dimensional holistic evaluation across your ${major} academic coursework, ${aptitudeScore}% analytical aptitude accuracy, technical depth in ${userLanguages.slice(0, 3).join(', ')}, and practical project portfolio, your calculated career readiness index is ${readiness}%.`,
    topRecommendations: [
      {
        id: 'rec_1',
        title: targetRole !== 'Other' ? targetRole : 'Full-Stack Software Engineer',
        matchScore: Math.min(97, readiness + 6),
        shortSummary: `Direct alignment with your degree in ${major}, languages (${userLanguages.join(', ')}), and analytical problem-solving foundation.`,
        whyRecommended: `Recommended because: Demonstrated aptitude test score (${aptitudeScore}%), ${major} academic coursework, practical programming experience in ${userLanguages.slice(0, 3).join(', ')}, and active portfolio development.`,
        supportingFactors: [
          `Strong foundational background in ${major}`,
          `High performance in Aptitude Assessment (${aptitudeScore}%) reflecting analytical ability`,
          `Practical coding experience in ${userLanguages.slice(0, 3).join(', ')}`,
          `${projectCount} hands-on portfolio project(s) demonstrated`
        ],
        areasForImprovement: [
          'Expand hands-on experience with production containerization (Docker & Kubernetes)',
          'Increase automated unit, integration, and end-to-end test coverage'
        ],
        requiredSkills: ['React', 'TypeScript', 'Node.js', 'REST APIs', 'SQL', 'Git'],
        matchingSkills: userLanguages,
        relevantInterests: interests.length > 0 ? interests : ['Web Systems', 'Software Architecture', 'Cloud Infrastructure'],
        relevantProjects: projectExperience.map((p: any) => p.name).filter(Boolean).length > 0
          ? projectExperience.map((p: any) => p.name).filter(Boolean)
          : ['Full-Stack Web Application Portfolio'],
        relevantAssessmentStrengths: [`High Aptitude Accuracy (${aptitudeScore}%)`, 'Strong Algorithmic & Systematic Problem-Solving'],
        missingSkills: ['Docker & Kubernetes', 'CI/CD Automated Deployment Pipelines'],
        recommendedNextSteps: [
          'Containerize existing web applications with Docker Compose and PostgreSQL',
          'Deploy full-stack REST API microservice with GitHub Actions CI/CD',
          'Practice system architecture and algorithmic technical interview problems'
        ],
        dayInLife: 'Architecting REST APIs, collaborating with cross-functional product and design teams, writing unit tests, and deploying feature releases.',
        salaryRanges: {
          entry: '$95,000 - $125,000',
          mid: '$135,000 - $175,000',
          senior: '$180,000 - $240,000+'
        },
        demandGrowth: '+32% High Growth',
        futureDemand: 'High 5-year outlook driven by rapid cloud migration and modern web software adoption.',
        topEmployers: ['Google', 'Microsoft', 'Stripe', 'Amazon', 'Meta']
      },
      {
        id: 'rec_2',
        title: 'AI & Machine Learning Systems Developer',
        matchScore: Math.min(94, readiness + 2),
        shortSummary: 'Combines algorithmic problem-solving, Python data processing, and modern LLM / generative AI integration.',
        whyRecommended: 'Recommended because: High score in quantitative and logical reasoning, strong interest in intelligent systems, Python proficiency, and analytical mindset.',
        supportingFactors: [
          'Strong quantitative and logical reasoning accuracy',
          'Python programming proficiency for ML pipeline scripting',
          'Enthusiasm for generative AI agents and intelligent search systems',
          'Systematic approach to algorithmic challenges'
        ],
        areasForImprovement: [
          'Gain hands-on experience with vector database indexing and retrieval-augmented generation (RAG)',
          'Learn open-source LLM fine-tuning techniques and evaluation frameworks'
        ],
        requiredSkills: ['Python', 'PyTorch / TensorFlow', 'Vector DBs', 'LLM Prompt Engineering', 'SQL'],
        matchingSkills: userLanguages.filter((l: string) => ['Python', 'SQL', 'C++', 'Java'].includes(l)).length > 0
          ? userLanguages.filter((l: string) => ['Python', 'SQL', 'C++', 'Java'].includes(l))
          : ['Python', 'SQL'],
        relevantInterests: ['Artificial Intelligence', 'Machine Learning', 'Data Science'],
        relevantProjects: ['AI Study Assistant & Search Index'],
        relevantAssessmentStrengths: ['Logical Reasoning Aptitude', 'Fast Algorithmic Comprehension'],
        missingSkills: ['Vector Databases (Pinecone/Chroma)', 'LangChain / LlamaIndex'],
        recommendedNextSteps: [
          'Build a Retrieval-Augmented Generation (RAG) assistant using Gemini API and Pinecone',
          'Benchmark prompt pipelines and model accuracy metrics',
          'Complete end-to-end ML deployment tutorial on Google Cloud Vertex AI'
        ],
        dayInLife: 'Building vector search indices, tuning agentic prompt workflows, deploying AI APIs, and analyzing model latency metrics.',
        salaryRanges: {
          entry: '$105,000 - $135,000',
          mid: '$150,000 - $190,000',
          senior: '$200,000 - $260,000+'
        },
        demandGrowth: '+42% Explosive Growth',
        futureDemand: 'Top-tier global demand driven by enterprise generative AI integration.',
        topEmployers: ['OpenAI', 'Anthropic', 'NVIDIA', 'Google AI', 'Microsoft']
      },
      {
        id: 'rec_3',
        title: 'Cloud & DevOps Solutions Engineer',
        matchScore: whatIfParams?.addedAWS || whatIfParams?.addedDocker ? 92 : 83,
        shortSummary: 'Focuses on resilient cloud infrastructure, container orchestration, and automated CI/CD release pipelines.',
        whyRecommended: 'Recommended because: Structured approach to systems architecture, adaptability, interest in scalable backend infrastructure, and systematic work style.',
        supportingFactors: [
          'Structured logical problem-solving and systematic engineering style',
          'Familiarity with version control (Git) and command-line environments',
          'High adaptability and steady focus in complex technical scenarios'
        ],
        areasForImprovement: [
          'Obtain hands-on experience configuring Kubernetes clusters and Helm charts',
          'Practice Infrastructure-as-Code scripts with Terraform'
        ],
        requiredSkills: ['Linux', 'Docker & Kubernetes', 'AWS / Cloud', 'Terraform', 'CI/CD'],
        matchingSkills: ['Linux', 'Git', 'Node.js'],
        relevantInterests: ['Cloud Infrastructure', 'DevOps & CI/CD', 'Distributed Systems'],
        relevantProjects: ['Automated Deployment Script & Cloud Infrastructure'],
        relevantAssessmentStrengths: ['Systematic Work-Style Rating', 'Strong Analytical Problem Solving'],
        missingSkills: ['Kubernetes & Helm', 'Terraform', 'AWS IAM & Cloud Security'],
        recommendedNextSteps: [
          'Set up local Kubernetes cluster using Minikube or Kind',
          'Write Terraform scripts to provision cloud VPC and compute instances',
          'Prepare for AWS Certified Cloud Practitioner / Solutions Architect exam'
        ],
        dayInLife: 'Configuring Kubernetes clusters, automating deployment pipelines, monitoring server telemetry, and managing cloud security policies.',
        salaryRanges: {
          entry: '$92,000 - $120,000',
          mid: '$130,000 - $165,000',
          senior: '$175,000 - $225,000+'
        },
        demandGrowth: '+28% Steady Demand',
        futureDemand: 'Continuous demand as enterprises transition legacy infrastructure to multi-cloud architectures.',
        topEmployers: ['AWS', 'Datadog', 'HashiCorp', 'Snowflake', 'Cloudflare']
      },
      {
        id: 'rec_4',
        title: 'Data Engineer & Analytics Architect',
        matchScore: 84,
        shortSummary: 'Designs resilient ETL data pipelines, optimizes SQL data warehouses, and powers real-time business intelligence.',
        whyRecommended: 'Recommended because: High score in data handling, quantitative logic, SQL/Python familiarity, and structured thinking.',
        supportingFactors: [
          'Strong SQL querying and database schema design foundation',
          'Quantitative aptitude score reflecting logical data manipulation',
          'Python data manipulation and backend scripting experience'
        ],
        areasForImprovement: [
          'Gain exposure to distributed data compute engines (Apache Spark)',
          'Learn DAG workflow orchestration with Apache Airflow'
        ],
        requiredSkills: ['SQL', 'Python', 'Apache Spark', 'Data Warehousing', 'ETL Pipelines'],
        matchingSkills: ['SQL', 'Python', 'Data Structures'],
        relevantInterests: ['Data Engineering', 'Business Intelligence', 'Database Systems'],
        relevantProjects: ['Database Schema & Analytics Dashboard Project'],
        relevantAssessmentStrengths: ['Quantitative Aptitude Score', 'Structured Data Handling'],
        missingSkills: ['Apache Spark / Databricks', 'Snowflake / BigQuery', 'Apache Airflow'],
        recommendedNextSteps: [
          'Build an ETL pipeline ingesting public APIs into PostgreSQL with automated cron',
          'Learn Apache Spark data transformations with PySpark',
          'Model dimensional star schema data marts'
        ],
        dayInLife: 'Building Apache Spark data pipelines, indexing PostgreSQL databases, and maintaining real-time data streaming infrastructure.',
        salaryRanges: {
          entry: '$88,000 - $115,000',
          mid: '$125,000 - $160,000',
          senior: '$165,000 - $215,000+'
        },
        demandGrowth: '+26% Growth',
        futureDemand: 'Essential foundation across all data-driven enterprises and AI applications.',
        topEmployers: ['Snowflake', 'Databricks', 'Uber', 'Palantir', 'Capital One']
      },
      {
        id: 'rec_5',
        title: 'Technical Product Manager / Solutions Engineer',
        matchScore: 81,
        shortSummary: 'Bridges technical software execution with business strategy, user experience design, and stakeholder communication.',
        whyRecommended: 'Recommended because: High communication and leadership ratings, interest in product strategy, user empathy, and solid computer science foundation.',
        supportingFactors: [
          'High self-assessed communication and cross-functional leadership skills',
          'Technical computer science foundation for effective engineer collaboration',
          'Strong understanding of customer requirements and product vision'
        ],
        areasForImprovement: [
          'Practice drafting formal Product Requirement Documents (PRDs)',
          'Learn A/B testing analytics and product funnel conversion metrics'
        ],
        requiredSkills: ['Product Strategy', 'Technical Specs (PRDs)', 'User Research', 'Data Analytics', 'Agile/Scrum'],
        matchingSkills: ['Communication', 'Data Analysis', 'User Research'],
        relevantInterests: ['Product Management', 'User Experience', 'Tech Entrepreneurship'],
        relevantProjects: ['User-Facing Application & Product Spec'],
        relevantAssessmentStrengths: ['Cross-Functional Collaboration Rating', 'Holistic Problem Solving'],
        missingSkills: ['PRD Specs Writing', 'Figma Wireframing', 'A/B Test Analytics'],
        recommendedNextSteps: [
          'Write a complete Product Requirement Document (PRD) for a new developer tool feature',
          'Learn product telemetry tracking with Mixpanel or PostHog',
          'Practice product sense and execution mock interview questions'
        ],
        dayInLife: 'Leading sprint planning, defining feature requirements, interviewing users, and aligning engineering deliverables with business milestones.',
        salaryRanges: {
          entry: '$90,000 - $120,000',
          mid: '$135,000 - $170,000',
          senior: '$180,000 - $235,000+'
        },
        demandGrowth: '+20% Growth',
        futureDemand: 'Strategic leadership role in high demand across tech companies of all sizes.',
        topEmployers: ['Salesforce', 'Atlassian', 'Adobe', 'Apple', 'LinkedIn']
      }
    ],
    strengthsAndWeaknesses: {
      strengths: [
        `Strong Aptitude Score (${aptitudeScore}%) demonstrating quick analytical and quantitative problem solving`,
        `Practical familiarity with programming languages (${userLanguages.slice(0, 3).join(', ')})`,
        `Active hands-on portfolio builder with ${projectCount} documented project(s)`
      ],
      weaknesses: [
        'Could expand production deployment experience with Docker, Kubernetes, and CI/CD pipelines',
        'Needs additional practical experience with distributed system architecture design trade-offs'
      ]
    },
    skillGapAnalysis: [
      {
        skill: 'Docker & Containerization',
        category: 'DevOps & Deployment',
        importance: 'High',
        recommendedCourses: ['Docker & Kubernetes: Hands-On Practical Guide'],
        certifications: ['Docker Certified Associate'],
        projectIdeas: ['Containerize full-stack application using Docker Compose with PostgreSQL']
      },
      {
        skill: 'AWS / Cloud Infrastructure',
        category: 'Cloud Services',
        importance: 'High',
        recommendedCourses: ['AWS Certified Solutions Architect Associate Course'],
        certifications: ['AWS Certified Cloud Practitioner'],
        projectIdeas: ['Deploy a serverless REST API using AWS Lambda, API Gateway, and DynamoDB']
      },
      {
        skill: 'Automated Unit & Integration Testing',
        category: 'Software Quality',
        importance: 'Medium',
        recommendedCourses: ['Testing React & Node.js Applications with Jest & Vitest'],
        certifications: ['Software Quality & Testing Certification'],
        projectIdeas: ['Add 80%+ unit test coverage and configure GitHub Actions CI pipeline']
      }
    ],
    actionRoadmap: [
      {
        month: 'Month 1',
        focus: 'Core Technical Mastery & Algorithmic Practice',
        weeklyTasks: [
          'Complete 20 LeetCode Medium problem challenges on Hash Maps, Arrays, and Trees',
          'Optimize GitHub portfolio and write comprehensive README for top project'
        ]
      },
      {
        month: 'Month 2',
        focus: 'Containerization & Cloud Deployment',
        weeklyTasks: [
          'Dockerize full-stack application and publish images to Docker Hub',
          'Deploy application backend live on AWS EC2 or Cloud Run with HTTPS'
        ]
      },
      {
        month: 'Month 3',
        focus: 'Capstone Portfolio & Resume Alignment',
        weeklyTasks: [
          'Build an advanced project integrating Gemini AI API and vector search',
          'Update resume using Google XYZ bullet point metric formula'
        ]
      },
      {
        month: 'Month 4',
        focus: 'Mock Interviews & Industry Networking',
        weeklyTasks: [
          'Conduct 5 timed technical mock interviews using the Interview Prep module',
          'Connect with 10 engineering managers and university alumni on LinkedIn'
        ]
      }
    ],
    interviewTips: [
      'Master the STAR method (Situation, Task, Action, Result) for behavioral questions, ensuring every answer ends with a measurable quantifiable outcome.',
      'Always clarify requirements, constraints, and edge cases out loud before writing code in technical interviews.',
      'Prepare 2-3 thoughtful questions about team culture and engineering roadmap for the interviewer at the end of the session.'
    ],
    whatIfSimulations: {
      currentReadiness: readiness,
      hypotheticalReadiness: Math.min(98, readiness + 8),
      impactSummary: whatIfParams
        ? 'Simulation updated! Adding AWS Cloud Certification and Docker containerization increases overall career readiness score by +8% and boosts Cloud/DevOps Engineer match score by +10%!'
        : 'Adding AWS Cloud Certification and Docker containerization will increase overall career readiness by +8% and boost Tier-1 tech company interview shortlisting chances by +15%!',
      leveragedImprovements: [
        'Containerizing portfolio projects boosts production readiness rating by +12%',
        'Achieving 90%+ in Aptitude Test increases top tech company shortlisting probability by +15%',
        'Adding AWS credentials opens up Cloud Engineer & DevOps interview calls'
      ]
    },
    createdAt: new Date().toISOString()
  };
}

export function getFallbackScenarioSimulatorResult(profile: any, selectedScenarios: string[] = [], customSkills: string[] = []) {
  const resolvedGapsList: Array<{ skill: string; resolvedBy: string; impactNote: string }> = [];

  const scenarioFlags = {
    selectedScenarios,
    customSkills,
    addedAWS: selectedScenarios.includes('addedAWS'),
    addedDocker: selectedScenarios.includes('addedDocker'),
    twoAIProjects: selectedScenarios.includes('twoAIProjects'),
    improvedDSA: selectedScenarios.includes('improvedDSA'),
    improvedSQL: selectedScenarios.includes('improvedSQL'),
    cloudInternship: selectedScenarios.includes('cloudInternship')
  };

  if (scenarioFlags.addedAWS) {
    resolvedGapsList.push({
      skill: 'AWS & Cloud Architecture',
      resolvedBy: 'What if I earned an AWS Cloud Certification?',
      impactNote: 'Satisfies enterprise cloud deployment prerequisites and adds +10 to Certifications.'
    });
  }

  if (scenarioFlags.addedDocker) {
    resolvedGapsList.push({
      skill: 'Docker Containerization & Microservices',
      resolvedBy: 'What if I mastered Docker & Kubernetes?',
      impactNote: 'Elevates DevOps and production deployment readiness (+12 to Technical Skills).'
    });
  }

  if (scenarioFlags.twoAIProjects) {
    resolvedGapsList.push({
      skill: 'Generative AI & LLM Systems Portfolio',
      resolvedBy: 'What if I completed 2 AI portfolio projects?',
      impactNote: 'Closes practical project gaps and adds +15 to Practical Projects.'
    });
  }

  if (scenarioFlags.improvedDSA) {
    resolvedGapsList.push({
      skill: 'Data Structures & Algorithmic Problem Solving',
      resolvedBy: 'What if I solved 50 LeetCode problems?',
      impactNote: 'Boosts Timed Aptitude by +12 and raises technical interview pass probability.'
    });
  }

  if (scenarioFlags.improvedSQL) {
    resolvedGapsList.push({
      skill: 'Advanced Relational Database Optimization',
      resolvedBy: 'What if I mastered SQL Indexing & Schemas?',
      impactNote: 'Improves Data Engineering competency (+8 to Technical Skills).'
    });
  }

  if (scenarioFlags.cloudInternship) {
    resolvedGapsList.push({
      skill: 'Industry Cloud Engineering Work Experience',
      resolvedBy: 'What if I complete a summer internship?',
      impactNote: 'Elevates Practical Projects by +18 and Work Environment Adaptability by +10.'
    });
  }

  // Handle custom skills
  customSkills.forEach(skill => {
    resolvedGapsList.push({
      skill: skill,
      resolvedBy: `Custom Skill Upgrade: ${skill}`,
      impactNote: `Strengthens specialized competency in ${skill} (+4 to Technical Skills).`
    });
  });

  // Calculate baseline and simulated metrics through the 11-Dimensional Holistic Framework
  const baseResult = calculate11DimensionReadiness(profile);
  const simResult = calculate11DimensionReadiness(profile, scenarioFlags);

  const baseReadiness = baseResult.readinessScore;
  const simReadiness = resolvedGapsList.length > 0
    ? Math.min(98, Math.max(baseReadiness + 1, simResult.readinessScore))
    : baseReadiness;
  const readinessDelta = simReadiness - baseReadiness;

  const baseTopMatch = Math.min(96, Math.max(70, baseReadiness + 4));
  const simTopMatch = Math.min(99, Math.max(baseTopMatch + 1, baseTopMatch + Math.round(readinessDelta * 1.1)));
  const matchDelta = simTopMatch - baseTopMatch;
  const gapsClosedCount = resolvedGapsList.length;
  const baseGapsCount = Math.max(5, gapsClosedCount + 2);

  return {
    simulationNotice: "SIMULATED ESTIMATE - NOT A GUARANTEED OUTCOME. Hypothetical scenario results do not modify your permanent profile.",
    baselineMetrics: {
      readinessScore: baseReadiness,
      topMatchScore: baseTopMatch,
      totalGapsCount: baseGapsCount,
      readinessBreakdown: baseResult.breakdown
    },
    simulatedMetrics: {
      readinessScore: simReadiness,
      topMatchScore: simTopMatch,
      readinessDelta: `+${readinessDelta}%`,
      matchDelta: `+${matchDelta}%`,
      gapsClosedCount: gapsClosedCount,
      marketTier: simReadiness >= 90 ? "High Market Ready (Top 10% Candidate)" : simReadiness >= 80 ? "Competitive Candidate" : "Developing Candidate",
      salaryPotentialNote: simReadiness >= 88 
        ? "Estimated entry salary potential shifts from $95K-$115K up to $115K-$140K (+~$20K potential entry uplift)."
        : "Estimated entry salary potential shifts from $85K-$100K up to $100K-$120K.",
      readinessBreakdown: simResult.breakdown
    },
    affectedPathways: [
      {
        roleTitle: "Cloud & DevOps Solutions Engineer",
        beforeMatch: 72,
        afterMatch: Math.min(97, 72 + (selectedScenarios.includes('addedAWS') || selectedScenarios.includes('addedDocker') || selectedScenarios.includes('cloudInternship') ? 21 : 5)),
        matchDelta: selectedScenarios.includes('addedAWS') || selectedScenarios.includes('cloudInternship') ? "+21%" : "+8%",
        impactLevel: "High Upgrade",
        rankShift: "Shifted to #1 Top Recommended Target",
        explanation: "Adding cloud infrastructure skills and internship experience directly satisfies production deployment and IAM security prerequisites."
      },
      {
        roleTitle: "Full-Stack AI Software Engineer",
        beforeMatch: 82,
        afterMatch: Math.min(98, 82 + (selectedScenarios.includes('twoAIProjects') || selectedScenarios.includes('improvedDSA') ? 14 : 6)),
        matchDelta: selectedScenarios.includes('twoAIProjects') ? "+14%" : "+6%",
        impactLevel: "Major Upgrade",
        rankShift: "Maintained Top Ranking with High Confidence",
        explanation: "Building AI projects and improving DSA algorithms elevates vector search and full-stack system optimization performance."
      },
      {
        roleTitle: "Data Engineer & Analytics Architect",
        beforeMatch: 76,
        afterMatch: Math.min(94, 76 + (selectedScenarios.includes('improvedSQL') ? 18 : 6)),
        matchDelta: selectedScenarios.includes('improvedSQL') ? "+18%" : "+6%",
        impactLevel: "Moderate Upgrade",
        rankShift: "Upgraded Market Fit",
        explanation: "Improving SQL indexing and relational schema design directly resolves data warehousing bottlenecks."
      }
    ],
    skillGapChanges: {
      resolvedGaps: resolvedGapsList,
      remainingGaps: [
        {
          skill: "System Design & Distributed Scalability",
          importance: "Medium",
          suggestedNextScenario: "Test a scenario for System Design or Microservices architecture."
        }
      ]
    },
    overallTakeaway: gapsClosedCount > 0
      ? `By applying ${selectedScenarios.length + customSkills.length} scenario improvements, your overall readiness score jumps from ${baseReadiness}% to ${simReadiness}%, closing ${gapsClosedCount} key skill gaps and boosting your market competitiveness.`
      : "Select one or more scenario presets above to see how hypothetical skill additions transform your readiness score, career match percentages, and resolved skill gaps!"
  };
}
