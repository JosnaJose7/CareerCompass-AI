import { 
  FacultyStudent, 
  FacultyRecommendation, 
  FacultyApprovalRequest, 
  FacultyFeedbackItem, 
  FacultyNote,
  CareerRoadmap
} from '../types';

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
    mockInterviewScore: 92
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
    status: 'On Track',
    targetRole: 'Full-Stack Software Engineer',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150',
    enrolledDate: 'Aug 2024',
    lastActive: '1 day ago',
    completedProjectsCount: 3,
    certificationsCount: 2,
    mockInterviewScore: 85
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
    mockInterviewScore: 68
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
    mockInterviewScore: 96
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
    status: 'Pending',
    submittedDate: '2026-08-06'
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
    content: 'Student express high interest in graduate AI research programs at Stanford & CMU as back-up option. Letter of recommendation requested.',
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
