import { 
  FacultyStudent, 
  FacultyRecommendation, 
  FacultyApprovalRequest, 
  FacultyFeedbackItem, 
  FacultyNote,
  CareerRoadmap,
  AssessmentReport,
  SkillGapAnalysisResult
} from '../types';

export const mockStudentRoadmap: CareerRoadmap = {
  id: 'rdmp_std01',
  userId: 'std_01',
  roleTitle: 'AI / ML Engineer',
  overview: 'Comprehensive 9-Month Roadmap tailored for Alex Rivera to achieve job readiness in Production AI Engineering, LLM System Architecture, and MLOps.',
  estimatedTimeToJobReady: '6 - 9 Months',
  milestones: [
    {
      id: 'm1',
      period: 'Month 1 - Month 2',
      title: 'Foundation & Core AI Mathematics',
      description: 'Master advanced Python, Linear Algebra, Multivariable Calculus, Probability, and PyTorch tensors.',
      completed: true,
      tasks: [
        'Complete PyTorch Deep Learning Specialization',
        'Build custom Neural Network from scratch in NumPy',
        'Solve 25 DSA Array/Matrix problems'
      ],
      recommendedResources: [
        { title: 'Deep Learning with PyTorch', type: 'Book' },
        { title: 'Stanford CS229 Machine Learning', type: 'Course' }
      ],
      resumeBulletSuggestion: 'Implemented custom backpropagation and neural network architectures in PyTorch.'
    },
    {
      id: 'm2',
      period: 'Month 3 - Month 4',
      title: 'NLP, Vector Databases & RAG Architecture',
      description: 'Build production-grade retrieval augmented generation pipelines using Pinecone, Qdrant, and LangChain.',
      completed: true,
      tasks: [
        'Build semantic search engine with sentence transformers',
        'Implement hybrid keyword/vector search in Qdrant',
        'Create interactive RAG agent with streaming responses'
      ],
      recommendedResources: [
        { title: 'LangChain & Vector DB Masterclass', type: 'Course' }
      ],
      resumeBulletSuggestion: 'Engineered a multi-modal RAG system reducing query latency by 42%.'
    },
    {
      id: 'm3',
      period: 'Month 5 - Month 6',
      title: 'LLM Fine-Tuning & Model Evaluation',
      description: 'Parameter-efficient fine-tuning (LoRA/QLoRA) on open-weight models like Llama 3 and Mistral.',
      completed: false,
      tasks: [
        'Fine-tune Llama 3 8B model using Unsloth on custom domain dataset',
        'Set up automated evaluation metrics (BLEU, ROUGE, G-Eval)',
        'Quantize model to GGUF format for edge deployment'
      ],
      recommendedResources: [
        { title: 'Hugging Face Open LLM Leaderboard Handbook', type: 'Book' }
      ],
      resumeBulletSuggestion: 'Fine-tuned 8B parameter LLMs achieving 91% accuracy on domain QA tasks.'
    },
    {
      id: 'm4',
      period: 'Month 7 - Month 9',
      title: 'MLOps, Deployment & Capstone Launch',
      description: 'Containerize models with Docker, deploy on Cloud Run / Kubernetes with Prometheus monitoring.',
      completed: false,
      tasks: [
        'Deploy API endpoints using Fast-API and Docker',
        'Set up MLflow experiment tracking pipeline',
        'Conduct full mock technical interview'
      ],
      recommendedResources: [
        { title: 'Full Stack Deep Learning Course', type: 'Course' }
      ],
      resumeBulletSuggestion: 'Architected scalable MLOps pipeline serving 10k+ daily inference requests.'
    }
  ]
};

export const initialFacultyStudents: FacultyStudent[] = [
  {
    id: 'std_01',
    name: 'Alex Rivera',
    email: 'alex.rivera@university.edu',
    rollNumber: 'CS2023-042',
    department: 'Computer Science & Engineering',
    major: 'Artificial Intelligence & Data Science',
    year: 'Senior (Final Year)',
    cgpa: '3.88',
    readinessScore: 88,
    milestoneProgress: 75,
    status: 'Pending Review',
    targetRole: 'AI / ML Engineer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    enrolledDate: 'Aug 2023',
    lastActive: '2 hours ago',
    completedProjectsCount: 4,
    certificationsCount: 3,
    mockInterviewScore: 92,
    roadmapApprovalStatus: 'Pending',
    endorsement: {
      id: 'end_01',
      studentId: 'std_01',
      targetRole: 'AI / ML Engineer',
      endorsedBy: 'Dr. Sarah Jenkins',
      facultyDesignation: 'Professor & Head of AI Research',
      department: 'Department of Computer Science',
      status: 'Pending',
      endorsementStatement: 'Alex exhibits top-tier mathematical aptitude and project execution in PyTorch and Vector Retrieval systems. Highly recommended for Senior AI Apprenticeships and ML Engineering campus placements.',
      strengthsHighlighted: ['Deep PyTorch Mastery', 'Vector DB Architecture', 'Outstanding 3.88 CGPA', 'Strong Academic Integrity'],
      institutionalStamp: 'VERIFIED_FACULTY_OVERSIGHT_DEPT_CS',
      dateEndorsed: '2026-08-05',
      officialBadgeIssued: false
    },
    assessmentReport: {
      userId: 'std_01',
      readinessScore: 88,
      summary: 'Alex demonstrates strong analytical capabilities, superior foundational math, and robust deep learning competencies. Profile aligns exceptionally well with modern LLM Engineering and MLOps roles.',
      createdAt: '2026-08-01',
      strengthsAndWeaknesses: {
        strengths: [
          'High proficiency in Python, PyTorch, LangChain, and Qdrant',
          'Completed rigorous 3-month NVIDIA AI Research summer internship',
          'Excellent quantitative aptitude score (90%) and strong CGPA (3.88)'
        ],
        weaknesses: [
          'Needs deeper hands-on experience with production Kubernetes model serving',
          'Should expand knowledge of distributed multi-GPU training clusters (DeepSpeed/FSDP)'
        ]
      },
      topRecommendations: [
        {
          id: 'rec_ai_01',
          title: 'AI / ML Engineer',
          matchScore: 94,
          shortSummary: 'Designs, trains, fine-tunes, and deploys deep learning models and generative AI systems in production.',
          whyRecommended: 'Alex scored in the 95th percentile for ML fundamentals with 4 verified projects including vector database RAG architectures.',
          matchingSkills: ['PyTorch', 'Python', 'FastAPI', 'Vector Databases', 'Transformers'],
          missingSkills: ['Kubernetes / KubeFlow', 'Triton Inference Server', 'DeepSpeed'],
          dayInLife: 'Architecting neural embeddings, tuning hyperparameters, running inference benchmarks, and scaling API endpoints.',
          salaryRanges: { entry: '$115,000', mid: '$155,000', senior: '$210,000' },
          demandGrowth: '+38% YoY',
          futureDemand: 'Extremely High',
          topEmployers: ['OpenAI', 'Google DeepMind', 'NVIDIA', 'Anthropic', 'Meta AI']
        },
        {
          id: 'rec_ai_02',
          title: 'LLM Systems Architect',
          matchScore: 90,
          shortSummary: 'Specializes in retrieval-augmented pipelines, agentic workflows, and fine-tuning open-weights models.',
          whyRecommended: 'High synergy with Alex’s RAG Knowledge Search Capstone project and prompt optimization experience.',
          matchingSkills: ['LangChain', 'Llama-3 Fine-tuning', 'LoRA / QLoRA', 'Docker'],
          missingSkills: ['vLLM Distributed Serving', 'Quantization Toolchains'],
          dayInLife: 'Building context caching pipelines, setting up evaluation benchmarks with G-Eval, and quantizing weights.',
          salaryRanges: { entry: '$120,000', mid: '$165,000', senior: '$225,000' },
          demandGrowth: '+46% YoY',
          futureDemand: 'Exponential Growth',
          topEmployers: ['Microsoft AI', 'Databricks', 'Cohere', 'Scale AI']
        },
        {
          id: 'rec_ai_03',
          title: 'Data & Applied Scientist',
          matchScore: 84,
          shortSummary: 'Applies statistical modeling, regression, and machine learning to derive predictive insights.',
          whyRecommended: 'Strong academic performance in calculus and linear algebra supports statistical rigor.',
          matchingSkills: ['NumPy', 'Pandas', 'Scikit-Learn', 'Statistics', 'SQL'],
          missingSkills: ['A/B Testing Frameworks', 'PySpark / BigQuery'],
          dayInLife: 'Designing experiment hypotheses, extracting multi-terabyte datasets, and training predictive classification trees.',
          salaryRanges: { entry: '$105,000', mid: '$140,000', senior: '$185,000' },
          demandGrowth: '+22% YoY',
          futureDemand: 'High',
          topEmployers: ['Amazon', 'Uber', 'Spotify', 'Stripe']
        }
      ],
      skillGapAnalysis: [
        {
          skill: 'Kubernetes / KubeFlow',
          category: 'MLOps',
          importance: 'High Priority',
          recommendedCourses: ['Cloud Native MLOps on GKE', 'Kubernetes for Machine Learning'],
          certifications: ['Certified Kubernetes Application Developer (CKAD)'],
          projectIdeas: ['Deploy a multi-replica vLLM inference server on local Minikube with HPA auto-scaling']
        },
        {
          skill: 'Distributed Training (FSDP / DeepSpeed)',
          category: 'AI Infrastructure',
          importance: 'Medium Priority',
          recommendedCourses: ['Hugging Face Distributed Training Masterclass'],
          certifications: ['NVIDIA DLI Multi-GPU Training'],
          projectIdeas: ['Fine-tune a 13B parameter model across 2 simulated GPU shards with gradient accumulation']
        }
      ],
      actionRoadmap: [
        { month: 'Month 1-2', focus: 'Deepen Distributed MLOps', weeklyTasks: ['Set up local Kubernetes cluster', 'Dockerize Fast-API model serving endpoint'] },
        { month: 'Month 3-4', focus: 'Fine-Tuning & Quantization', weeklyTasks: ['Run Unsloth LoRA on domain QA dataset', 'Quantize to GGUF format'] },
        { month: 'Month 5-6', focus: 'Portfolio Publishing & Mock Interviews', weeklyTasks: ['Publish research capstone to GitHub', 'Practice 10 system design interviews'] }
      ],
      interviewTips: [
        'Review backpropagation gradient math on whiteboard',
        'Prepare detailed explanation of attention mechanism Q, K, V matrix multiplications',
        'Structure system design answers using STAR methodology'
      ],
      whatIfSimulations: {
        currentReadiness: 88,
        hypotheticalReadiness: 95,
        impactSummary: 'Adding Kubernetes certification and distributed training project boosts job match to 95%.',
        leveragedImprovements: ['Kubernetes Certification', 'Multi-GPU Fine-tuning Project']
      }
    },
    skillGapAnalysis: {
      targetRole: 'AI / ML Engineer',
      readinessScore: 88,
      overallSummary: 'Strong foundation in PyTorch, Python, and RAG architectures. Bridging Kubernetes MLOps and distributed training will elevate readiness to 95%+.',
      industryDemandOutlook: 'Very High - 38% annual growth with 42,000+ national entry-level openings.',
      completedSkills: [
        { skill: 'PyTorch & Neural Networks', category: 'Machine Learning', proficiency: 'Mastered', matchReason: 'Completed 4 deep learning projects & specialization' },
        { skill: 'Python & Data Engineering', category: 'Programming', proficiency: 'Mastered', matchReason: 'Advanced Python OOP, NumPy, Pandas' },
        { skill: 'RAG & Vector Databases', category: 'AI Architecture', proficiency: 'Proficient', matchReason: 'Built vector search capstone in Qdrant & LangChain' },
        { skill: 'FastAPI & REST Microservices', category: 'Backend', proficiency: 'Proficient', matchReason: 'Deployed model inference endpoints' }
      ],
      missingSkills: [
        {
          id: 'sk_gap_01',
          skill: 'Kubernetes & Model Serving (KServe / Triton)',
          category: 'MLOps',
          priority: 'High',
          difficulty: 'Advanced',
          estimatedHours: 40,
          recommendedCourses: [
            { title: 'Kubernetes for Machine Learning Engineers', provider: 'Coursera', level: 'Intermediate' }
          ],
          projects: [
            { title: 'Auto-Scaling LLM Inference Engine', description: 'Deploy FastAPI server on Kubernetes cluster with custom autoscaling based on GPU latency.', keyDeliverables: ['Dockerfile', 'K8s deployment YAML', 'Load test report'] }
          ],
          certifications: [
            { title: 'Certified Kubernetes Application Developer', issuer: 'Linux Foundation' }
          ],
          completed: false
        },
        {
          id: 'sk_gap_02',
          skill: 'Distributed Multi-GPU Training (FSDP / DeepSpeed)',
          category: 'AI Infrastructure',
          priority: 'Medium',
          difficulty: 'Advanced',
          estimatedHours: 30,
          recommendedCourses: [
            { title: 'Distributed Deep Learning at Scale', provider: 'DeepLearning.AI', level: 'Advanced' }
          ],
          projects: [
            { title: 'Multi-GPU LoRA Benchmark', description: 'Compare throughput of DDP vs FSDP when fine-tuning Llama-3.', keyDeliverables: ['Benchmark script', 'Wandb telemetry log'] }
          ],
          certifications: [
            { title: 'NVIDIA DLI Multi-GPU Certificate', issuer: 'NVIDIA DLI' }
          ],
          completed: false
        }
      ],
      industryBenchmarks: [
        { skill: 'Python / PyTorch', importance: 'Critical (Mandatory)', demandTrend: '+35% YoY' },
        { skill: 'Vector Databases', importance: 'High Priority', demandTrend: '+80% YoY' },
        { skill: 'Kubernetes MLOps', importance: 'High Priority', demandTrend: '+45% YoY' }
      ]
    },
    roadmap: mockStudentRoadmap,
    auditTrail: [
      {
        id: 'aud_01',
        timestamp: '2026-08-01 09:30',
        actor: '🤖 AI Assessment Engine (Gemini 2.5)',
        action: 'Generated 12-Dimension Career Assessment Report',
        category: 'AI Assessment',
        details: 'Evaluated academic records, projects, and aptitude test. Computed initial 88% readiness score for AI/ML Engineer.',
        status: 'Pending'
      },
      {
        id: 'aud_02',
        timestamp: '2026-08-02 14:15',
        actor: 'Dr. Sarah Jenkins (Advisor)',
        action: 'Faculty Reviewed AI Assessment & Profile',
        category: 'Faculty Endorsement',
        details: 'Validated NVIDIA internship and verified capstone source repository. Added positive advisement note.',
        status: 'Pending'
      },
      {
        id: 'aud_03',
        timestamp: '2026-08-04 11:20',
        actor: 'Dr. Sarah Jenkins (Advisor)',
        action: 'Submitted Structured Evaluation Feedback',
        category: 'Feedback Added',
        details: 'Assigned 5-star rating on career trajectory with 2 key action items for GitHub README publishing.',
        status: 'Pending'
      }
    ]
  },
  {
    id: 'std_02',
    name: 'Sophia Patel',
    email: 'sophia.patel@university.edu',
    rollNumber: 'CS2023-089',
    department: 'Computer Science & Engineering',
    major: 'Software Systems',
    year: 'Junior (3rd Year)',
    cgpa: '3.75',
    readinessScore: 82,
    milestoneProgress: 60,
    status: 'Approved',
    targetRole: 'Full-Stack Software Engineer',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150',
    enrolledDate: 'Aug 2024',
    lastActive: '1 day ago',
    completedProjectsCount: 3,
    certificationsCount: 2,
    mockInterviewScore: 85,
    roadmapApprovalStatus: 'Approved',
    endorsement: {
      id: 'end_02',
      studentId: 'std_02',
      targetRole: 'Full-Stack Software Engineer',
      endorsedBy: 'Dr. Sarah Jenkins',
      facultyDesignation: 'Professor & Placement Mentor',
      department: 'Department of Computer Science',
      status: 'Approved',
      endorsementStatement: 'Sophia demonstrates outstanding full-stack capability with React, Node.js, and AWS Cloud Architecture. Completed hackathon project in top 5%. Endorsed for Enterprise Software Engineering placements.',
      strengthsHighlighted: ['React & Node.js Microservices', 'AWS Certified Solutions Architect', 'Team Leadership in Hackathons', 'Strong Code Quality'],
      institutionalStamp: 'OFFICIALLY_ENDORSED_FACULTY_COUNCIL',
      dateEndorsed: '2026-08-03',
      officialBadgeIssued: true
    },
    assessmentReport: {
      userId: 'std_02',
      readinessScore: 82,
      summary: 'Sophia has a solid software engineering foundation with React, TypeScript, and Express. Great team player with strong UI craftsmanship.',
      createdAt: '2026-08-02',
      strengthsAndWeaknesses: {
        strengths: ['Modern frontend frameworks (React, Tailwind)', 'Certified AWS Solutions Architect', 'Good problem-solving speed'],
        weaknesses: ['Needs more database query optimization practice (PostgreSQL indexing)', 'Could strengthen unit testing coverage (Jest/Cypress)']
      },
      topRecommendations: [
        {
          id: 'rec_ai_04',
          title: 'Full-Stack Software Engineer',
          matchScore: 92,
          shortSummary: 'Builds end-to-end web applications with modern frontend frameworks and scalable backend services.',
          whyRecommended: 'Completed 3 full-stack applications with verified AWS certification.',
          matchingSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS'],
          missingSkills: ['GraphQL', 'Redis Caching', 'Docker Orchestration'],
          dayInLife: 'Developing responsive UI components, building RESTful microservices, and writing database migrations.',
          salaryRanges: { entry: '$95,000', mid: '$135,000', senior: '$175,000' },
          demandGrowth: '+26% YoY',
          futureDemand: 'Very High',
          topEmployers: ['Salesforce', 'Adobe', 'Stripe', 'Atlassian']
        }
      ],
      skillGapAnalysis: [
        {
          skill: 'Redis Caching & Session Store',
          category: 'Backend Architecture',
          importance: 'High Priority',
          recommendedCourses: ['Redis University for Developers'],
          certifications: ['Redis Certified Developer'],
          projectIdeas: ['Implement caching layer for high-traffic product catalog API']
        }
      ],
      actionRoadmap: [
        { month: 'Month 1-2', focus: 'Testing & CI/CD', weeklyTasks: ['Write Jest & Playwright tests', 'Set up GitHub Actions CI workflow'] }
      ],
      interviewTips: ['Practice designing scalable URL shortener system', 'Review React lifecycle and custom hook optimizations'],
      whatIfSimulations: {
        currentReadiness: 82,
        hypotheticalReadiness: 90,
        impactSummary: 'Adding Redis and Cypress end-to-end testing boosts readiness to 90%.',
        leveragedImprovements: ['Redis Microservices Project', 'Cypress Automation']
      }
    },
    auditTrail: [
      {
        id: 'aud_11',
        timestamp: '2026-08-02 10:00',
        actor: '🤖 AI Assessment Engine (Gemini 2.5)',
        action: 'Generated Full-Stack Engineer Career Assessment',
        category: 'AI Assessment',
        details: 'Evaluated 3 web projects and AWS certification with 82% initial readiness score.',
        status: 'Pending'
      },
      {
        id: 'aud_12',
        timestamp: '2026-08-03 16:30',
        actor: 'Dr. Sarah Jenkins (Advisor)',
        action: 'Officially Endorsed Career Plan & Approved Roadmap',
        category: 'Faculty Endorsement',
        details: 'Approved AWS skill badge verification and issued official faculty endorsement badge.',
        status: 'Approved'
      }
    ]
  },
  {
    id: 'std_03',
    name: 'Marcus Chen',
    email: 'marcus.chen@university.edu',
    rollNumber: 'IT2023-104',
    department: 'Information Technology',
    major: 'Cloud & Infrastructure',
    year: 'Senior (Final Year)',
    cgpa: '3.45',
    readinessScore: 71,
    milestoneProgress: 45,
    status: 'Needs Attention',
    targetRole: 'Cloud & DevOps Architect',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    enrolledDate: 'Aug 2023',
    lastActive: '3 days ago',
    completedProjectsCount: 2,
    certificationsCount: 1,
    mockInterviewScore: 68,
    roadmapApprovalStatus: 'Needs Revision',
    endorsement: {
      id: 'end_03',
      studentId: 'std_03',
      targetRole: 'Cloud & DevOps Architect',
      endorsedBy: 'Prof. Alan Vance',
      facultyDesignation: 'Associate Professor & Systems Lead',
      department: 'Department of Information Technology',
      status: 'Needs Revision',
      endorsementStatement: 'Marcus exhibits passion for Cloud Infrastructure and Linux system administration, but requires improvement in Data Structures problem solving before receiving placement endorsement.',
      strengthsHighlighted: ['Linux Administration', 'Docker Containerization', 'Networking Fundamentals'],
      institutionalStamp: 'CONDITIONAL_REVIEW_IN_PROGRESS',
      dateEndorsed: '2026-08-04',
      officialBadgeIssued: false
    },
    auditTrail: [
      {
        id: 'aud_21',
        timestamp: '2026-08-01 15:00',
        actor: '🤖 AI Assessment Engine (Gemini 2.5)',
        action: 'Generated Cloud Architecture Assessment',
        category: 'AI Assessment',
        details: 'Calculated 71% readiness score with noted gaps in algorithm speed.',
        status: 'Pending'
      },
      {
        id: 'aud_22',
        timestamp: '2026-08-04 14:00',
        actor: 'Prof. Alan Vance (Advisor)',
        action: 'Requested Roadmap Revision (DSA Milestones Required)',
        category: 'Roadmap Approval',
        details: 'Requested addition of 3 LeetCode problem solving milestones per week before final sign-off.',
        status: 'Needs Revision'
      }
    ]
  },
  {
    id: 'std_04',
    name: 'Emma Watson',
    email: 'emma.watson@university.edu',
    rollNumber: 'CS2023-015',
    department: 'Computer Science & Engineering',
    major: 'Cybersecurity',
    year: 'Senior (Final Year)',
    cgpa: '3.92',
    readinessScore: 94,
    milestoneProgress: 90,
    status: 'Approved',
    targetRole: 'Cybersecurity Analyst',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    enrolledDate: 'Aug 2023',
    lastActive: 'Just now',
    completedProjectsCount: 5,
    certificationsCount: 4,
    mockInterviewScore: 96,
    roadmapApprovalStatus: 'Approved',
    endorsement: {
      id: 'end_04',
      studentId: 'std_04',
      targetRole: 'Cybersecurity Analyst & Threat Hunter',
      endorsedBy: 'Dr. Sarah Jenkins',
      facultyDesignation: 'Department Head & Security Mentor',
      department: 'Department of Computer Science',
      status: 'Approved',
      endorsementStatement: 'Emma has maintained top departmental rank (3.92 CGPA) and holds CompTIA Security+ & CEH certifications. Outstanding threat hunting capstone project. 100% endorsed for Defense & Enterprise SecOps roles.',
      strengthsHighlighted: ['3.92 Departmental Rank #1', 'CompTIA Security+ Certified', 'Penetration Testing & Wireshark', 'Flawless Academic Record'],
      institutionalStamp: 'HIGHEST_HONORS_OFFICIALLY_ENDORSED',
      dateEndorsed: '2026-08-01',
      officialBadgeIssued: true
    },
    auditTrail: [
      {
        id: 'aud_31',
        timestamp: '2026-07-30 08:45',
        actor: '🤖 AI Assessment Engine (Gemini 2.5)',
        action: 'Generated Cybersecurity Specialist Assessment',
        category: 'AI Assessment',
        details: 'Evaluated 4 security certifications and high mock interview performance. 94% readiness score.',
        status: 'Approved'
      },
      {
        id: 'aud_32',
        timestamp: '2026-08-01 10:30',
        actor: 'Dr. Sarah Jenkins (Advisor)',
        action: 'Granted Official Departmental Honors Endorsement',
        category: 'Faculty Endorsement',
        details: 'Signed off on career plan and nominated for Departmental Valedictorian award.',
        status: 'Approved'
      }
    ]
  }
];

export const initialFacultyRecommendations: FacultyRecommendation[] = [
  {
    id: 'rec_01',
    studentId: 'std_01',
    roleTitle: 'LLM Systems & AI Engineer',
    rationale: 'Alex demonstrated exceptional mastery in PyTorch and vector databases during the Capstone Project. High fit for generative AI roles.',
    recommendedBy: 'Dr. Sarah Jenkins (Department Head)',
    priority: 'High',
    status: 'Recommended',
    dateAdded: '2026-08-01'
  },
  {
    id: 'rec_02',
    studentId: 'std_01',
    roleTitle: 'Applied Data Scientist',
    rationale: 'Solid statistics background and strong CGPA. Excellent alternative path for research lab assistantships.',
    recommendedBy: 'Prof. Robert Taylor',
    priority: 'Medium',
    status: 'Under Discussion',
    dateAdded: '2026-07-28'
  },
  {
    id: 'rec_03',
    studentId: 'std_02',
    roleTitle: 'Full-Stack Developer (React/Node)',
    rationale: 'Sophia built a complete microservices architecture for the departmental hackathon.',
    recommendedBy: 'Dr. Sarah Jenkins',
    priority: 'High',
    status: 'Accepted',
    dateAdded: '2026-08-03'
  },
  {
    id: 'rec_04',
    studentId: 'std_03',
    roleTitle: 'Site Reliability Engineer (SRE)',
    rationale: 'Marcus needs additional hands-on AWS practice but exhibits strong troubleshooting aptitude.',
    recommendedBy: 'Prof. Alan Vance',
    priority: 'High',
    status: 'Recommended',
    dateAdded: '2026-08-05'
  }
];

export const initialFacultyApprovals: FacultyApprovalRequest[] = [
  {
    id: 'app_01',
    studentId: 'std_01',
    studentName: 'Alex Rivera',
    type: 'Roadmap Approval',
    title: 'AI / ML Engineering 9-Month Custom Track',
    description: 'Submitted customized milestone plan covering PyTorch, RAG Pipelines, Docker Containerization, and Fine-tuning Llama-3.',
    status: 'Pending',
    submittedDate: '2026-08-06'
  },
  {
    id: 'app_02',
    studentId: 'std_01',
    studentName: 'Alex Rivera',
    type: 'Internship Credit',
    title: 'NVIDIA AI Research Intern Exemption Request',
    description: '3-month summer internship certificate at NVIDIA AI Labs under Dr. M. Harris.',
    status: 'Pending',
    submittedDate: '2026-08-05'
  },
  {
    id: 'app_03',
    studentId: 'std_02',
    studentName: 'Sophia Patel',
    type: 'Skill Certification',
    title: 'AWS Certified Solutions Architect Associate',
    description: 'Passed certification exam with 890/1000 score. Requesting skill badge verification.',
    status: 'Approved',
    submittedDate: '2026-08-02',
    facultyComment: 'Verified with AWS credential ID #88492. Great achievement!',
    reviewedDate: '2026-08-03'
  },
  {
    id: 'app_04',
    studentId: 'std_03',
    studentName: 'Marcus Chen',
    type: 'Career Choice',
    title: 'Target Role Change to Cloud Architect',
    description: 'Requesting mentor guidance and approval to switch focus from Web Dev to Cloud Infrastructure.',
    status: 'Needs Revision',
    submittedDate: '2026-08-04',
    facultyComment: 'Please add 3 weekly LeetCode DSA problem sessions before final approval.',
    reviewedDate: '2026-08-04'
  }
];

export const initialFacultyFeedback: FacultyFeedbackItem[] = [
  {
    id: 'fb_01',
    studentId: 'std_01',
    facultyName: 'Dr. Sarah Jenkins',
    category: 'Roadmap',
    rating: 5,
    feedbackText: 'Alex’s career trajectory is exceptionally well structured. The project scope on Vector DBs and LangChain demonstrates deep practical skills.',
    actionItems: [
      'Publish Capstone repository on GitHub with clean README documentation',
      'Apply for campus placement drives with Microsoft and Google AI'
    ],
    date: '2026-08-04'
  },
  {
    id: 'fb_02',
    studentId: 'std_01',
    facultyName: 'Prof. David Miller',
    category: 'Interview',
    rating: 4,
    feedbackText: 'Strong technical explanation during the mock system design session. Work on slowing down pacing when explaining distributed cache consistency.',
    actionItems: [
      'Practice STAR method for behavioral leadership questions',
      'Review CAP theorem trade-offs in distributed systems'
    ],
    date: '2026-07-29'
  },
  {
    id: 'fb_03',
    studentId: 'std_03',
    facultyName: 'Prof. Alan Vance',
    category: 'Overall Academic',
    rating: 3,
    feedbackText: 'Marcus possesses great enthusiasm for DevOps, but needs to boost DSA practice problem consistency to pass initial online coding assessments.',
    actionItems: [
      'Complete 3 LeetCode Medium array & graph questions weekly',
      'Schedule follow-up review with academic mentor before end of month'
    ],
    date: '2026-08-02'
  }
];

export const initialFacultyNotes: FacultyNote[] = [
  {
    id: 'note_01',
    studentId: 'std_01',
    authorName: 'Dr. Sarah Jenkins',
    content: 'Student expresses high interest in graduate AI research programs at Stanford & CMU as back-up option. Letter of recommendation requested.',
    category: 'Career Guidance',
    isPrivate: false,
    createdAt: '2026-08-04 14:30'
  },
  {
    id: 'note_02',
    studentId: 'std_01',
    authorName: 'Dr. Sarah Jenkins',
    content: 'Internal Note: Nominated Alex for Departmental Student Researcher of the Year Award.',
    category: 'Placement Alert',
    isPrivate: true,
    createdAt: '2026-08-02 09:15'
  },
  {
    id: 'note_03',
    studentId: 'std_03',
    authorName: 'Prof. Alan Vance',
    content: 'Marcus missed deadline for Cloud Computing Lab #3 due to illness. Extended deadline granted to Aug 10.',
    category: 'Academic',
    isPrivate: false,
    createdAt: '2026-08-01 11:00'
  }
];
