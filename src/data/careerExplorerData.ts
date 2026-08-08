export interface CareerDetail {
  id: string;
  title: string;
  category: string;
  iconName: string;
  badge: string;
  description: string;
  overview: string;
  dayInLife: string[];
  salary: {
    entry: string;
    mid: string;
    senior: string;
    average: string;
  };
  skills: {
    technical: string[];
    frameworksAndTools: string[];
    softSkills: string[];
  };
  topCompanies: {
    name: string;
    industry: string;
    hiringFocus: string;
  }[];
  roadmap: {
    phase: string;
    title: string;
    duration: string;
    topics: string[];
  }[];
  videos: {
    title: string;
    channel: string;
    duration: string;
    url: string;
    category: string;
  }[];
  resources: {
    title: string;
    type: 'Documentation' | 'Course' | 'Book' | 'Community' | 'Practice Platform' | 'Guide';
    provider: string;
    url: string;
    description: string;
  }[];
}

export const careerExplorerData: CareerDetail[] = [
  {
    id: 'ai-engineer',
    title: 'AI Engineer',
    category: 'AI & Data Science',
    iconName: 'Sparkles',
    badge: 'High Demand (+32%)',
    description: 'Builds, deploys, and optimizes artificial intelligence models, Large Language Models (LLMs), RAG pipelines, and autonomous AI agents for real-world products.',
    overview: 'AI Engineers bridge the gap between AI research and product deployment. They integrate foundation models (Gemini, GPT-4, Claude), optimize AI inference latency, fine-tune open-weights models (Llama 3, Mistral), and build resilient LLM orchestration architectures.',
    dayInLife: [
      'Design retrieval-augmented generation (RAG) vector database pipelines.',
      'Fine-tune open-source LLMs using LoRA/QLoRA for domain-specific applications.',
      'Deploy low-latency AI microservices on Kubernetes or AWS SageMaker.',
      'Evaluate model hallucinations, safety guardrails, and latency performance.'
    ],
    salary: {
      entry: '$115,000 / yr',
      mid: '$165,000 / yr',
      senior: '$240,000+ / yr',
      average: '$172,000 / yr'
    },
    skills: {
      technical: ['Python', 'LLM Prompt Engineering', 'RAG Architecture', 'Vector DBs (Pinecone, Qdrant, Chroma)', 'Fine-Tuning (LoRA)', 'LangChain / LlamaIndex', 'Function Calling & Tool Use'],
      frameworksAndTools: ['PyTorch', 'Transformers (Hugging Face)', 'vLLM / Ollama', 'Docker', 'FastAPI', 'Google Cloud Vertex AI'],
      softSkills: ['Analytical Problem Solving', 'AI Ethics & Safety', 'Technical Storytelling', 'Iterative Experimentation']
    },
    topCompanies: [
      { name: 'Google', industry: 'Big Tech / AI', hiringFocus: 'Gemini, Vertex AI & Search AI' },
      { name: 'OpenAI', industry: 'AI Research & Frontier Models', hiringFocus: 'GPT-4, Codex, Agents' },
      { name: 'Anthropic', industry: 'AI Safety & LLMs', hiringFocus: 'Claude & AI Safety Guardrails' },
      { name: 'Microsoft', industry: 'Enterprise Cloud & Copilot', hiringFocus: 'Azure OpenAI & Copilot Ecosystem' },
      { name: 'NVIDIA', industry: 'AI Infrastructure & Hardware', hiringFocus: 'NeMo, CUDA & Enterprise AI' }
    ],
    roadmap: [
      {
        phase: 'Phase 1',
        title: 'Core Fundamentals (Months 1 - 2)',
        duration: '2 Months',
        topics: ['Master Python & Data Structures', 'Linear Algebra & Probability Basics', 'REST APIs with FastAPI', 'Git & Docker Essentials']
      },
      {
        phase: 'Phase 2',
        title: 'Machine Learning & Neural Networks (Months 3 - 4)',
        duration: '2 Months',
        topics: ['Supervised & Unsupervised ML with Scikit-Learn', 'PyTorch Neural Networks', 'Convolutional & Recurrent Architectures', 'Model Evaluation Metrics']
      },
      {
        phase: 'Phase 3',
        title: 'Generative AI, RAG & LLMs (Months 5 - 7)',
        duration: '3 Months',
        topics: ['LLM APIs & Prompt Engineering', 'Vector Embeddings & Vector Stores', 'RAG Pipelines with Hybrid Search', 'AI Agent Orchestration (LangGraph / AutoGen)']
      },
      {
        phase: 'Phase 4',
        title: 'AI Ops & Production Deployment (Months 8 - 9)',
        duration: '2 Months',
        topics: ['Model Quantization & vLLM Serving', 'LLM Evaluation & Guardrails', 'AWS SageMaker / GCP Vertex AI', 'CI/CD for AI Microservices']
      }
    ],
    videos: [
      {
        title: 'AI Engineer Roadmap 2026 - Complete Guide',
        channel: 'FreeCodeCamp',
        duration: '42 mins',
        url: 'https://www.youtube.com/results?search_query=AI+Engineer+Roadmap',
        category: 'Career Roadmap'
      },
      {
        title: 'Building Production-Grade RAG Systems',
        channel: 'DeepLearning.AI',
        duration: '1 hr 15 mins',
        url: 'https://www.youtube.com/results?search_query=Production+RAG+Pipeline+Tutorial',
        category: 'Technical Workshop'
      },
      {
        title: 'Full Stack LLM Application Architecture',
        channel: 'LangChain Official',
        duration: '28 mins',
        url: 'https://www.youtube.com/results?search_query=LangChain+RAG+FastAPI+React',
        category: 'Project Tutorial'
      }
    ],
    resources: [
      {
        title: 'DeepLearning.AI - AI Engineering & LLM Courses',
        type: 'Course',
        provider: 'Andrew Ng / DeepLearning.AI',
        url: 'https://www.deeplearning.ai',
        description: 'Industry standard courses on generative AI, prompt engineering, and building LLM applications.'
      },
      {
        title: 'Hugging Face Transformers Documentation',
        type: 'Documentation',
        provider: 'Hugging Face',
        url: 'https://huggingface.co/docs',
        description: 'Official guides for loading, fine-tuning, and inference using open-weights models.'
      },
      {
        title: 'Pinecone Vector Database University',
        type: 'Guide',
        provider: 'Pinecone',
        url: 'https://www.pinecone.io/learn/',
        description: 'In-depth tutorials on vector embeddings, similarity search algorithms, and production RAG.'
      }
    ]
  },
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    category: 'Software Engineering',
    iconName: 'Code',
    badge: 'Core Tech Standard',
    description: 'Designs, develops, tests, and maintains robust software systems, enterprise applications, and scalable backend/frontend architectures.',
    overview: 'Software Engineers write production-grade code that scales to millions of users. They apply clean architecture principles, design efficient data structures, write automated unit tests, and collaborate with product teams to ship reliable software.',
    dayInLife: [
      'Write clean, modular code in TypeScript, Python, Java, or C++.',
      'Participate in daily agile standups and code reviews.',
      'Debug application performance bottlenecks and memory leaks.',
      'Design RESTful & GraphQL APIs with secure authentication.'
    ],
    salary: {
      entry: '$92,000 / yr',
      mid: '$140,000 / yr',
      senior: '$205,000+ / yr',
      average: '$145,000 / yr'
    },
    skills: {
      technical: ['Data Structures & Algorithms', 'Object-Oriented Design', 'System Architecture', 'REST & GraphQL APIs', 'SQL & Relational Databases', 'Git Version Control', 'Automated Testing (Jest / PyTest)'],
      frameworksAndTools: ['Node.js / Express', 'React', 'Docker', 'PostgreSQL', 'Linux CLI', 'GitHub Actions'],
      softSkills: ['Code Cleanliness & Refactoring', 'Collaborative Problem Solving', 'Agile Methodologies', 'Clear Documentation']
    },
    topCompanies: [
      { name: 'Google', industry: 'Big Tech', hiringFocus: 'Large scale distribution, Search, Cloud' },
      { name: 'Meta', industry: 'Social Networks & AR/VR', hiringFocus: 'High throughput frontend & backend systems' },
      { name: 'Apple', industry: 'Consumer Tech & OS', hiringFocus: 'Swift, C++, Systems Architecture' },
      { name: 'Amazon', industry: 'E-commerce & Cloud', hiringFocus: 'AWS Microservices, Scalable backend' },
      { name: 'Microsoft', industry: 'Enterprise & OS', hiringFocus: 'C#, Azure, TypeScript' }
    ],
    roadmap: [
      {
        phase: 'Phase 1',
        title: 'Programming Fundamentals (Months 1 - 2)',
        duration: '2 Months',
        topics: ['Master Python or TypeScript', 'Git & GitHub Collaboration', 'Command Line Navigation', 'Basic Memory & Variables']
      },
      {
        phase: 'Phase 2',
        title: 'Data Structures & Algorithms (Months 3 - 4)',
        duration: '2 Months',
        topics: ['Arrays, Hash Tables, Linked Lists', 'Trees, Graphs, Search & Sort Algorithms', 'Big-O Time & Space Complexity', 'LeetCode Medium Problem Solving']
      },
      {
        phase: 'Phase 3',
        title: 'Full-Stack Architecture & Databases (Months 5 - 6)',
        duration: '2 Months',
        topics: ['REST APIs & HTTP Protocols', 'SQL Queries & Relational DB Schema', 'ORM Setup (Drizzle / Prisma)', 'Frontend State Management']
      },
      {
        phase: 'Phase 4',
        title: 'System Design & DevOps (Months 7 - 8)',
        duration: '2 Months',
        topics: ['Caching (Redis) & Load Balancing', 'Docker Containerization', 'CI/CD Automated Testing', 'System Design Interview Patterns']
      }
    ],
    videos: [
      {
        title: 'Software Engineering Roadmap for Beginners',
        channel: 'NeetCode',
        duration: '35 mins',
        url: 'https://www.youtube.com/results?search_query=Software+Engineer+Roadmap+NeetCode',
        category: 'Career Roadmap'
      },
      {
        title: 'System Design Interview Primer',
        channel: 'ByteByteGo',
        duration: '50 mins',
        url: 'https://www.youtube.com/results?search_query=System+Design+Interview+ByteByteGo',
        category: 'System Architecture'
      },
      {
        title: 'Full-Stack Software Development Project Walkthrough',
        channel: 'Traversy Media',
        duration: '2 hrs 10 mins',
        url: 'https://www.youtube.com/results?search_query=Full+stack+Node+React+Express+PostgreSQL',
        category: 'Project Build'
      }
    ],
    resources: [
      {
        title: 'NeetCode 150 - LeetCode Practice Roadmap',
        type: 'Practice Platform',
        provider: 'NeetCode',
        url: 'https://neetcode.io',
        description: 'Curated list of 150 algorithm coding challenges categorized by topic for software engineering interviews.'
      },
      {
        title: 'Designing Data-Intensive Applications',
        type: 'Book',
        provider: 'Martin Kleppmann / O\'Reilly',
        url: 'https://dataintensive.net',
        description: 'The definitive handbook on distributed systems, data storage, indexing, and reliability.'
      },
      {
        title: 'MDN Web Docs & Computer Science Curricula',
        type: 'Documentation',
        provider: 'Mozilla Developer Network',
        url: 'https://developer.mozilla.org',
        description: 'Gold-standard technical reference for JavaScript, HTML, CSS, Web APIs, and browser engineering.'
      }
    ]
  },
  {
    id: 'cloud-engineer',
    title: 'Cloud Engineer',
    category: 'Cloud & Infrastructure',
    iconName: 'Cloud',
    badge: 'In High Demand (+28%)',
    description: 'Architects, provisions, and manages cloud infrastructure across AWS, Google Cloud, or Azure using Infrastructure as Code (IaC).',
    overview: 'Cloud Engineers build scalable, secure, and cost-effective cloud foundations. They automate cloud deployments using Terraform and CloudFormation, configure Virtual Private Clouds (VPCs), manage IAM permissions, and maintain serverless and containerized environments.',
    dayInLife: [
      'Write Terraform scripts to provision cloud infrastructure as code.',
      'Configure auto-scaling groups, load balancers, and CDN caching.',
      'Enforce zero-trust IAM security permissions across cloud accounts.',
      'Monitor cloud resource costs, performance logs, and reliability alerts.'
    ],
    salary: {
      entry: '$98,000 / yr',
      mid: '$148,000 / yr',
      senior: '$210,000+ / yr',
      average: '$152,000 / yr'
    },
    skills: {
      technical: ['Amazon Web Services (AWS)', 'Google Cloud Platform (GCP)', 'Infrastructure as Code (Terraform)', 'Linux System Administration', 'Networking (VPC, CIDR, DNS, BGP)', 'Cloud Security & IAM'],
      frameworksAndTools: ['Terraform', 'Kubernetes / EKS / GKE', 'Docker', 'Bash / Python Scripting', 'AWS CloudFormation', 'Prometheus & Grafana'],
      softSkills: ['High Availability Strategy', 'Cost Optimization Mindset', 'Incident Response', 'Disaster Recovery Planning']
    },
    topCompanies: [
      { name: 'Amazon Web Services (AWS)', industry: 'Cloud Provider', hiringFocus: 'Cloud Infrastructure & Managed Services' },
      { name: 'Google Cloud Platform (GCP)', industry: 'Cloud Leader', hiringFocus: 'Kubernetes, BigQuery & Cloud Native' },
      { name: 'Microsoft Azure', industry: 'Enterprise Cloud', hiringFocus: 'Hybrid Cloud & Enterprise Infrastructure' },
      { name: 'Salesforce', industry: 'SaaS Platform', hiringFocus: 'Global Infrastructure & High Availability' },
      { name: 'Datadog', industry: 'Cloud Monitoring', hiringFocus: 'Observability & Cloud Systems Performance' }
    ],
    roadmap: [
      {
        phase: 'Phase 1',
        title: 'Linux & Networking Basics (Months 1 - 2)',
        duration: '2 Months',
        topics: ['Linux Shell Scripting & SSH', 'TCP/IP, Subnetting, DNS, HTTP/S', 'Git Version Control', 'Basic Python Automation']
      },
      {
        phase: 'Phase 2',
        title: 'Core AWS or GCP Services (Months 3 - 4)',
        duration: '2 Months',
        topics: ['Compute (EC2 / Compute Engine)', 'Storage (S3 / Cloud Storage)', 'Networking (VPC / Subnets)', 'Identity & Access Management (IAM)']
      },
      {
        phase: 'Phase 3',
        title: 'Infrastructure as Code & Containers (Months 5 - 6)',
        duration: '2 Months',
        topics: ['Terraform Modules & State Management', 'Docker Containerization', 'Serverless (AWS Lambda / Cloud Run)', 'Cloud Security Best Practices']
      },
      {
        phase: 'Phase 4',
        title: 'Kubernetes & Certification Prep (Months 7 - 8)',
        duration: '2 Months',
        topics: ['Container Orchestration with Kubernetes', 'AWS Certified Solutions Architect Study', 'CI/CD Pipelines (GitHub Actions / GitLab)', 'Cost Management & Monitoring']
      }
    ],
    videos: [
      {
        title: 'AWS Cloud Engineer Roadmap',
        channel: 'TechWithNana',
        duration: '40 mins',
        url: 'https://www.youtube.com/results?search_query=TechWithNana+Cloud+Engineer+Roadmap',
        category: 'Career Roadmap'
      },
      {
        title: 'Terraform Full Course - Infrastructure as Code',
        channel: 'FreeCodeCamp',
        duration: '2 hrs 30 mins',
        url: 'https://www.youtube.com/results?search_query=Terraform+Full+Course+FreeCodeCamp',
        category: 'Technical Workshop'
      },
      {
        title: 'AWS Solutions Architect Associate Masterclass',
        channel: 'Stephane Maarek',
        duration: '1 hr 10 mins',
        url: 'https://www.youtube.com/results?search_query=AWS+Solutions+Architect+Associate+Prep',
        category: 'Certification Prep'
      }
    ],
    resources: [
      {
        title: 'AWS Skill Builder Official Free Training',
        type: 'Course',
        provider: 'Amazon Web Services',
        url: 'https://explore.skillbuilder.aws',
        description: 'Interactive labs and courses straight from AWS engineers.'
      },
      {
        title: 'HashiCorp Terraform Tutorials',
        type: 'Documentation',
        provider: 'HashiCorp Developer',
        url: 'https://developer.hashicorp.com/terraform/tutorials',
        description: 'Step-by-step documentation for provisioning multi-cloud infrastructures.'
      },
      {
        title: 'A Cloud Guru / Pluralsight Labs',
        type: 'Practice Platform',
        provider: 'Pluralsight',
        url: 'https://www.pluralsight.com/cloud-guru',
        description: 'Hands-on cloud sandbox environments for AWS, GCP, and Azure certifications.'
      }
    ]
  },
  {
    id: 'cybersecurity-specialist',
    title: 'Cybersecurity Specialist',
    category: 'Cybersecurity',
    iconName: 'ShieldAlert',
    badge: 'Critical Need (+35%)',
    description: 'Protects networks, applications, and corporate data from cyber threats, vulnerabilities, unauthorized access, and zero-day exploits.',
    overview: 'Cybersecurity Specialists conduct penetration testing, monitor Security Operations Centers (SOCs), harden cloud environments, and respond to cyber incidents. They ensure compliance with ISO 27001, SOC 2, and GDPR standards.',
    dayInLife: [
      'Perform vulnerability scans and ethical penetration tests on web apps.',
      'Analyze SIEM logs (Splunk/Elastic) for suspicious network activity.',
      'Investigate security alerts and contain potential ransomware threats.',
      'Configure firewalls, zero-trust network access, and MFA policies.'
    ],
    salary: {
      entry: '$90,000 / yr',
      mid: '$135,000 / yr',
      senior: '$195,000+ / yr',
      average: '$142,000 / yr'
    },
    skills: {
      technical: ['Ethical Hacking & Penetration Testing', 'Network Security & Firewalls', 'SIEM & SOC Operations (Splunk, Sentinel)', 'Cryptography & PKI', 'Vulnerability Assessment (Nessus, Wireshark)', 'Identity & Access Management'],
      frameworksAndTools: ['Wireshark', 'Burp Suite', 'Metasploit', 'Splunk', 'Kali Linux', 'Python / Bash Scripting'],
      softSkills: ['Ethical Integrity', 'Analytical Forensics', 'Crisis Communication', 'Regulatory Compliance Knowledge']
    },
    topCompanies: [
      { name: 'CrowdStrike', industry: 'Cybersecurity Leader', hiringFocus: 'Endpoint protection, Threat intelligence, Incident response' },
      { name: 'Palo Alto Networks', industry: 'Network & Cloud Security', hiringFocus: 'Next-gen firewalls & SASE cloud security' },
      { name: 'Cloudflare', industry: 'DDoS & Internet Security', hiringFocus: 'DNS, Zero-Trust, WAF security' },
      { name: 'Mandiant (Google Cloud)', industry: 'Cyber Defense & Forensics', hiringFocus: 'Threat hunting, Incident response' },
      { name: 'IBM Security', industry: 'Enterprise Security', hiringFocus: 'QRadar SIEM, Cryptography, SOC operations' }
    ],
    roadmap: [
      {
        phase: 'Phase 1',
        title: 'Networking & OS Hardening (Months 1 - 2)',
        duration: '2 Months',
        topics: ['CompTIA Network+ / Security+ Concepts', 'Linux & Windows Admin Commands', 'Wireshark Packet Analysis', 'TCP/IP Protocol Deep Dive']
      },
      {
        phase: 'Phase 2',
        title: 'Security Operations & Defensive Security (Months 3 - 4)',
        duration: '2 Months',
        topics: ['SIEM Log Monitoring with Splunk', 'Endpoint Detection & Response (EDR)', 'Vulnerability Scanning with Nessus', 'Firewall Rules & Zero-Trust Architecture']
      },
      {
        phase: 'Phase 3',
        title: 'Offensive Security & Web App Hacking (Months 5 - 6)',
        duration: '2 Months',
        topics: ['OWASP Top 10 Web Vulnerabilities', 'Burp Suite & Web Hacking Fundamentals', 'Metasploit & Privilege Escalation', 'TryHackMe & HackTheBox Labs']
      },
      {
        phase: 'Phase 4',
        title: 'Cloud Security & Certification (Months 7 - 8)',
        duration: '2 Months',
        topics: ['AWS / GCP Cloud Security Controls', 'Certified Ethical Hacker (CEH) or CompTIA Security+', 'Incident Response Playbooks', 'Forensics & Malware Analysis']
      }
    ],
    videos: [
      {
        title: 'How to Become a Cybersecurity Specialist in 2026',
        channel: 'NetworkChuck',
        duration: '28 mins',
        url: 'https://www.youtube.com/results?search_query=NetworkChuck+Cybersecurity+Roadmap',
        category: 'Career Roadmap'
      },
      {
        title: 'Wireshark Packet Analysis Masterclass',
        channel: 'David Bombal',
        duration: '1 hr 15 mins',
        url: 'https://www.youtube.com/results?search_query=Wireshark+Tutorial+David+Bombal',
        category: 'Technical Workshop'
      },
      {
        title: 'Ethical Hacking & Web App Security (OWASP Top 10)',
        channel: 'FreeCodeCamp',
        duration: '3 hrs 20 mins',
        url: 'https://www.youtube.com/results?search_query=Ethical+Hacking+Course+FreeCodeCamp',
        category: 'Hands-on Course'
      }
    ],
    resources: [
      {
        title: 'TryHackMe - Hands-On Cyber Security Training',
        type: 'Practice Platform',
        provider: 'TryHackMe',
        url: 'https://tryhackme.com',
        description: 'Interactive gamified cyber security learning paths from beginner to pentester.'
      },
      {
        title: 'OWASP Top 10 Web Application Security Risks',
        type: 'Documentation',
        provider: 'OWASP Foundation',
        url: 'https://owasp.org/www-project-top-ten/',
        description: 'Industry benchmark standard for web application security threats and defenses.'
      },
      {
        title: 'Hack The Box - Penetration Testing Labs',
        type: 'Practice Platform',
        provider: 'Hack The Box',
        url: 'https://www.hackthebox.com',
        description: 'Vulnerable lab machines to test ethical hacking, exploitation, and post-exploitation skills.'
      }
    ]
  },
  {
    id: 'backend-developer',
    title: 'Backend Developer',
    category: 'Software Engineering',
    iconName: 'Server',
    badge: 'Core Infrastructure',
    description: 'Builds server-side APIs, database management systems, authentication services, and high-performance microservices that power web applications.',
    overview: 'Backend Developers focus on data logic, application security, database query performance, and server orchestration. They build REST, gRPC, and GraphQL APIs, implement caching strategies, and guarantee 99.99% uptime for business-critical logic.',
    dayInLife: [
      'Design relational schemas (PostgreSQL) and NoSQL collections (MongoDB).',
      'Implement gRPC microservices and RESTful API endpoints.',
      'Optimize database queries and indexing for millisecond response times.',
      'Configure Redis caching layers and message queues (Kafka / RabbitMQ).'
    ],
    salary: {
      entry: '$88,000 / yr',
      mid: '$135,000 / yr',
      senior: '$190,000+ / yr',
      average: '$138,000 / yr'
    },
    skills: {
      technical: ['Node.js / Express', 'Python (FastAPI / Django)', 'Java (Spring Boot) or Go (Golang)', 'SQL & Database Optimization', 'REST, GraphQL & gRPC APIs', 'Redis Caching & Kafka Queues'],
      frameworksAndTools: ['PostgreSQL / MySQL', 'Docker', 'Prisma / Drizzle ORM', 'Postman / Bruno', 'Linux / Bash Scripting'],
      softSkills: ['API Schema Design', 'Data Consistency & Concurrency', 'System Scalability Mindset', 'Security Best Practices']
    },
    topCompanies: [
      { name: 'Stripe', industry: 'Fintech & Payments', hiringFocus: 'Ultra-reliable payment processing APIs' },
      { name: 'Uber', industry: 'Mobility & Logistics', hiringFocus: 'High throughput real-time location microservices' },
      { name: 'Netflix', industry: 'Streaming Media', hiringFocus: 'Distributed backend systems & gRPC services' },
      { name: 'Airbnb', industry: 'Travel & Hospitality', hiringFocus: 'Search index, Booking engine backend' },
      { name: 'Twilio', industry: 'Communications API', hiringFocus: 'Low-latency API messaging infrastructure' }
    ],
    roadmap: [
      {
        phase: 'Phase 1',
        title: 'Programming Language & HTTP (Months 1 - 2)',
        duration: '2 Months',
        topics: ['Master Node.js, Python, or Go', 'HTTP Verbs, Headers & Status Codes', 'Git Version Control', 'Basic CRUD Applications']
      },
      {
        phase: 'Phase 2',
        title: 'Databases & Query Optimization (Months 3 - 4)',
        duration: '2 Months',
        topics: ['PostgreSQL Schemas, Joins, & Indexes', 'ORM Integration (Drizzle / Prisma)', 'NoSQL DBs (MongoDB / DynamoDB)', 'Database Migrations & Transactions']
      },
      {
        phase: 'Phase 3',
        title: 'API Design, Auth & Caching (Months 5 - 6)',
        duration: '2 Months',
        topics: ['JWT Authentication & OAuth2.0', 'Redis Caching Strategy', 'GraphQL vs REST Architecture', 'Rate Limiting & Security Headers']
      },
      {
        phase: 'Phase 4',
        title: 'Microservices & Message Queues (Months 7 - 8)',
        duration: '2 Months',
        topics: ['Dockerizing Microservices', 'Message Brokers (RabbitMQ / Apache Kafka)', 'CI/CD Pipelines & Unit Testing (Jest / PyTest)', 'Load Testing & Monitoring']
      }
    ],
    videos: [
      {
        title: 'Backend Developer Roadmap - Complete Tech Stack',
        channel: 'Hussein Nasser',
        duration: '45 mins',
        url: 'https://www.youtube.com/results?search_query=Hussein+Nasser+Backend+Developer+Roadmap',
        category: 'Career Roadmap'
      },
      {
        title: 'Node.js & Express REST API with PostgreSQL',
        channel: 'FreeCodeCamp',
        duration: '2 hrs 15 mins',
        url: 'https://www.youtube.com/results?search_query=Node.js+Express+PostgreSQL+FreeCodeCamp',
        category: 'Project Build'
      },
      {
        title: 'Database Indexing & Query Performance Masterclass',
        channel: 'Hussein Nasser',
        duration: '50 mins',
        url: 'https://www.youtube.com/results?search_query=Database+Indexing+Hussein+Nasser',
        category: 'Technical Workshop'
      }
    ],
    resources: [
      {
        title: 'Roadmap.sh - Backend Developer Guide',
        type: 'Guide',
        provider: 'Roadmap.sh',
        url: 'https://roadmap.sh/backend',
        description: 'Interactive step-by-step visual roadmap for backend software engineering.'
      },
      {
        title: 'PostgreSQL Official Documentation',
        type: 'Documentation',
        provider: 'PostgreSQL Global Development Group',
        url: 'https://www.postgresql.org/docs/',
        description: 'Deep reference guide for queries, indexing, JSONB data, and performance tuning.'
      },
      {
        title: 'Prisma / Drizzle ORM University',
        type: 'Course',
        provider: 'Prisma / Drizzle',
        url: 'https://www.prisma.io/docs',
        description: 'Modern type-safe database access guides for full-stack and backend Node/TypeScript developers.'
      }
    ]
  },
  {
    id: 'frontend-developer',
    title: 'Frontend Developer',
    category: 'Software Engineering',
    iconName: 'Layout',
    badge: 'High User Impact',
    description: 'Crafts fast, accessible, responsive, and visually stunning web interfaces using React, TypeScript, Next.js, and modern CSS frameworks.',
    overview: 'Frontend Developers are responsible for the user interface and browser user experience. They convert UI design mocks into fluid web applications, manage complex state architectures, optimize Core Web Vitals, and ensure WCAG accessibility standards.',
    dayInLife: [
      'Build modular, reusable React components with Tailwind CSS.',
      'Manage client-side state using React Context, Redux, or Zustand.',
      'Integrate RESTful and GraphQL backend endpoints seamlessly.',
      'Optimize bundle size, image loading, and LCP/CLS performance metrics.'
    ],
    salary: {
      entry: '$85,000 / yr',
      mid: '$130,000 / yr',
      senior: '$185,000+ / yr',
      average: '$132,000 / yr'
    },
    skills: {
      technical: ['TypeScript / JavaScript (ES6+)', 'React 18 / Next.js', 'Tailwind CSS', 'State Management (Zustand / Redux)', 'HTML5 & WCAG Accessibility', 'Performance & Core Web Vitals'],
      frameworksAndTools: ['Vite', 'Next.js App Router', 'Framermotion / Motion', 'Shadcn UI', 'Figma to Code Workflow'],
      softSkills: ['UI/UX Eye for Detail', 'Design System Architecture', 'Cross-Browser Compatibility', 'Empathy for End-Users']
    },
    topCompanies: [
      { name: 'Vercel', industry: 'Frontend Cloud', hiringFocus: 'Next.js core framework, Edge network, React performance' },
      { name: 'Figma', industry: 'Design Tools', hiringFocus: 'WebGL, Canvas, Complex browser state engine' },
      { name: 'Airbnb', industry: 'Travel Tech', hiringFocus: 'Design system, Mobile responsive web app' },
      { name: 'Stripe', industry: 'Fintech Design Leader', hiringFocus: 'Pristine UI components & developer dashboard' },
      { name: 'Shopify', industry: 'E-commerce', hiringFocus: 'Storefront performance, Hydrogen & React' }
    ],
    roadmap: [
      {
        phase: 'Phase 1',
        title: 'HTML, CSS & Modern JS (Months 1 - 2)',
        duration: '2 Months',
        topics: ['Semantic HTML5 & Accessibility (a11y)', 'CSS Flexbox, Grid & Responsive Design', 'Modern JS ES6+ (Async/Await, Array Methods)', 'DOM Manipulation']
      },
      {
        phase: 'Phase 2',
        title: 'React & TypeScript Mastery (Months 3 - 4)',
        duration: '2 Months',
        topics: ['React Hooks & Component Lifecycle', 'TypeScript Interfaces & Generics', 'Tailwind CSS Utility Styling', 'Client-side Routing & Form Handling']
      },
      {
        phase: 'Phase 3',
        title: 'Next.js, State & API Fetching (Months 5 - 6)',
        duration: '2 Months',
        topics: ['Next.js App Router & Server Components', 'Zustand / TanStack Query (React Query)', 'Rest APIs & GraphQL Integration', 'Framer Motion UI Animations']
      },
      {
        phase: 'Phase 4',
        title: 'Testing, Performance & Build Tools (Months 7 - 8)',
        duration: '2 Months',
        topics: ['Vitest & React Testing Library', 'Vite & Webpack Configs', 'Lighthouse & Core Web Vitals Optimization', 'Design Systems & Component Libraries']
      }
    ],
    videos: [
      {
        title: 'Frontend Developer Roadmap 2026',
        channel: 'Josh Tried Coding',
        duration: '32 mins',
        url: 'https://www.youtube.com/results?search_query=Frontend+Developer+Roadmap+2026',
        category: 'Career Roadmap'
      },
      {
        title: 'React 18 & TypeScript Masterclass',
        channel: 'FreeCodeCamp',
        duration: '4 hrs',
        url: 'https://www.youtube.com/results?search_query=React+TypeScript+Full+Course+FreeCodeCamp',
        category: 'Full Course'
      },
      {
        title: 'Next.js App Router & Tailwind CSS Full Project',
        channel: 'Web Dev Simplified',
        duration: '1 hr 45 mins',
        url: 'https://www.youtube.com/results?search_query=Next.js+App+Router+Web+Dev+Simplified',
        category: 'Project Tutorial'
      }
    ],
    resources: [
      {
        title: 'Frontend Masters Learning Paths',
        type: 'Course',
        provider: 'Frontend Masters',
        url: 'https://frontendmasters.com',
        description: 'Industry-leading deep dives taught by core contributors and engineers.'
      },
      {
        title: 'React Official Documentation (react.dev)',
        type: 'Documentation',
        provider: 'Meta / React Core Team',
        url: 'https://react.dev',
        description: 'Interactive tutorial and reference for modern React with hooks and server components.'
      },
      {
        title: 'Tailwind CSS Documentation & Components',
        type: 'Documentation',
        provider: 'Tailwind Labs',
        url: 'https://tailwindcss.com/docs',
        description: 'Official utility-first CSS framework reference.'
      }
    ]
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    category: 'AI & Data Science',
    iconName: 'BarChart',
    badge: 'Strategic & Insights',
    description: 'Extracts actionable business insights, predictive models, and statistical trends from massive structured and unstructured datasets.',
    overview: 'Data Scientists blend statistics, machine learning, and domain knowledge to solve complex business questions. They build predictive models, run A/B experimentation frameworks, perform exploratory data analysis (EDA), and present executive dashboards.',
    dayInLife: [
      'Clean and wrangle messy datasets using Pandas and SQL.',
      'Train predictive models (XGBoost, Random Forests) for churn prediction.',
      'Design A/B testing experiments and evaluate statistical significance.',
      'Build interactive dashboards (Tableau / Streamlit) for stakeholders.'
    ],
    salary: {
      entry: '$95,000 / yr',
      mid: '$145,000 / yr',
      senior: '$210,000+ / yr',
      average: '$150,000 / yr'
    },
    skills: {
      technical: ['Python (Pandas, NumPy, Scipy)', 'Advanced SQL & Data Warehousing', 'Statistical Modeling & Hypothesis Testing', 'Machine Learning (Scikit-Learn, XGBoost)', 'Data Visualization (Seaborn, Plotly)', 'A/B Experimentation'],
      frameworksAndTools: ['Jupyter Notebooks', 'Snowflake / BigQuery', 'Tableau / PowerBI', 'Streamlit', 'Git & Docker'],
      softSkills: ['Executive Presentation', 'Business Acumen', 'Curiosity & Hypothesis Formulation', 'Data Storytelling']
    },
    topCompanies: [
      { name: 'Google', industry: 'Search & Ad Tech', hiringFocus: 'Search ranking, Ad auction models, User analytics' },
      { name: 'Meta', industry: 'Social Networks', hiringFocus: 'Growth analytics, Content recommendation, A/B testing' },
      { name: 'Spotify', industry: 'Music & Audio Streaming', hiringFocus: 'Recommendation algorithms, Personalization' },
      { name: 'Amazon', industry: 'E-commerce & Cloud', hiringFocus: 'Supply chain forecasting, Pricing algorithms' },
      { name: 'McKinsey & Company', industry: 'Management Consulting', hiringFocus: 'Enterprise data science & strategy' }
    ],
    roadmap: [
      {
        phase: 'Phase 1',
        title: 'Python, SQL & Mathematics (Months 1 - 2)',
        duration: '2 Months',
        topics: ['Python Data Wrangling (Pandas, NumPy)', 'Complex SQL (Window Functions, CTEs)', 'Descriptive & Inferential Statistics', 'Probability Distributions']
      },
      {
        phase: 'Phase 2',
        title: 'Exploratory Data Analysis & Viz (Months 3 - 4)',
        duration: '2 Months',
        topics: ['Data Visualization (Matplotlib, Seaborn)', 'Feature Engineering & Outlier Detection', 'Tableau / PowerBI Dashboards', 'Communicating Data Insights']
      },
      {
        phase: 'Phase 3',
        title: 'Applied Machine Learning (Months 5 - 6)',
        duration: '2 Months',
        topics: ['Linear & Logistic Regression', 'Decision Trees, Random Forests, XGBoost', 'Model Evaluation (ROC-AUC, Precision/Recall)', 'Kaggle Competition Practice']
      },
      {
        phase: 'Phase 4',
        title: 'A/B Testing & Data Pipelines (Months 7 - 8)',
        duration: '2 Months',
        topics: ['A/B Testing & Hypothesis Testing', 'Snowflake / BigQuery Warehousing', 'Deploying Streamlit Data Apps', 'Production Model Monitoring']
      }
    ],
    videos: [
      {
        title: 'Data Scientist Roadmap - Skills & Tools',
        channel: 'Ken Jee',
        duration: '28 mins',
        url: 'https://www.youtube.com/results?search_query=Ken+Jee+Data+Scientist+Roadmap',
        category: 'Career Roadmap'
      },
      {
        title: 'Python for Data Science Full Course',
        channel: 'FreeCodeCamp',
        duration: '12 hrs',
        url: 'https://www.youtube.com/results?search_query=Python+Data+Science+Course+FreeCodeCamp',
        category: 'Full Course'
      },
      {
        title: 'Advanced SQL Window Functions for Data Analytics',
        channel: 'Luke Barousse',
        duration: '45 mins',
        url: 'https://www.youtube.com/results?search_query=Luke+Barousse+SQL+Data+Analytics',
        category: 'Technical Workshop'
      }
    ],
    resources: [
      {
        title: 'Kaggle - Data Science Competitions & Datasets',
        type: 'Practice Platform',
        provider: 'Google / Kaggle',
        url: 'https://www.kaggle.com',
        description: 'World-renowned platform for data science notebooks, competitions, and datasets.'
      },
      {
        title: 'DataCamp - Interactive Data Science Track',
        type: 'Course',
        provider: 'DataCamp',
        url: 'https://www.datacamp.com',
        description: 'Hands-on interactive browser coding in Python, R, and SQL.'
      },
      {
        title: 'Pandas & Scikit-Learn Documentation',
        type: 'Documentation',
        provider: 'PyData',
        url: 'https://pandas.pydata.org/docs/',
        description: 'Official API reference for Python data manipulation and machine learning.'
      }
    ]
  },
  {
    id: 'ml-engineer',
    title: 'ML Engineer (Machine Learning)',
    category: 'AI & Data Science',
    iconName: 'Cpu',
    badge: 'High Salary & Growth',
    description: 'Designs deep learning architectures, trains statistical models, and deploys scalable ML training and inference systems.',
    overview: 'Machine Learning Engineers combine computer science rigors with machine learning algorithms. Unlike Data Scientists who focus on insight discovery, ML Engineers focus on building scalable production code to train and serve models at massive scale.',
    dayInLife: [
      'Implement deep learning neural networks in PyTorch or TensorFlow.',
      'Optimize training pipelines and distributed GPU clusters.',
      'Track ML experiments using MLflow or Weights & Biases.',
      'Deploy real-time inference endpoints on Kubernetes or Triton server.'
    ],
    salary: {
      entry: '$110,000 / yr',
      mid: '$160,000 / yr',
      senior: '$235,000+ / yr',
      average: '$168,000 / yr'
    },
    skills: {
      technical: ['PyTorch / TensorFlow', 'Deep Learning & Neural Networks', 'Distributed GPU Training (CUDA / DeepSpeed)', 'MLOps (MLflow, Kubeflow)', 'Computer Vision or NLP', 'Model Optimization (Quantization, ONNX)'],
      frameworksAndTools: ['PyTorch', 'Weights & Biases', 'Docker & Kubernetes', 'Triton Inference Server', 'FastAPI'],
      softSkills: ['Mathematical Rigor', 'Experimental Discipline', 'System Architecture Skills', 'Research to Product Translation']
    },
    topCompanies: [
      { name: 'NVIDIA', industry: 'AI Chips & Infrastructure', hiringFocus: 'TensorRT, CUDA, Deep learning frameworks' },
      { name: 'Google Brain / DeepMind', industry: 'Frontier AI Research', hiringFocus: 'Deep learning research & production scaling' },
      { name: 'Tesla', industry: 'Autonomous Vehicles & Robotics', hiringFocus: 'Real-time Computer Vision & Autopilot ML' },
      { name: 'Meta AI (FAIR)', industry: 'Social & Open Source AI', hiringFocus: 'PyTorch, Llama models, Computer Vision' },
      { name: 'Apple', industry: 'On-Device AI', hiringFocus: 'CoreML, On-device neural network optimization' }
    ],
    roadmap: [
      {
        phase: 'Phase 1',
        title: 'Math & Python Systems (Months 1 - 2)',
        duration: '2 Months',
        topics: ['Multivariable Calculus & Linear Algebra', 'Python OOP & C++ Basics', 'NumPy Vectorized Computation', 'Data Structures & Algorithms']
      },
      {
        phase: 'Phase 2',
        title: 'Classic ML & Scikit-Learn (Months 3 - 4)',
        duration: '2 Months',
        topics: ['Supervised & Unsupervised Learning', 'Gradient Descent Optimization', 'Feature Engineering & Cross Validation', 'Model Hyperparameter Tuning']
      },
      {
        phase: 'Phase 3',
        title: 'Deep Learning with PyTorch (Months 5 - 7)',
        duration: '3 Months',
        topics: ['PyTorch Tensors & Autograd', 'Convolutional Neural Networks (CNNs)', 'Transformers & Attention Mechanisms', 'Weights & Biases Experiment Tracking']
      },
      {
        phase: 'Phase 4',
        title: 'MLOps & Inference Serving (Months 8 - 9)',
        duration: '2 Months',
        topics: ['Model Conversion to ONNX / TensorRT', 'Triton Inference Server Deployment', 'Distributed Training with PyTorch DDP', 'CI/CD Pipelines for ML']
      }
    ],
    videos: [
      {
        title: 'Machine Learning Engineer Roadmap',
        channel: 'Boris Pashhaver',
        duration: '38 mins',
        url: 'https://www.youtube.com/results?search_query=Machine+Learning+Engineer+Roadmap',
        category: 'Career Roadmap'
      },
      {
        title: 'Neural Networks: Zero to Hero',
        channel: 'Andrej Karpathy',
        duration: '2 hrs 15 mins',
        url: 'https://www.youtube.com/results?search_query=Andrej+Karpathy+Neural+Networks+Zero+to+Hero',
        category: 'Masterclass'
      },
      {
        title: 'PyTorch for Deep Learning Full Course',
        channel: 'FreeCodeCamp',
        duration: '25 hrs',
        url: 'https://www.youtube.com/results?search_query=PyTorch+Deep+Learning+Course+FreeCodeCamp',
        category: 'Full Course'
      }
    ],
    resources: [
      {
        title: 'Fast.ai - Practical Deep Learning for Coders',
        type: 'Course',
        provider: 'Jeremy Howard / Fast.ai',
        url: 'https://www.fast.ai',
        description: 'Top-rated code-first course for learning deep learning and neural networks.'
      },
      {
        title: 'PyTorch Official Tutorials & Documentation',
        type: 'Documentation',
        provider: 'PyTorch Foundation',
        url: 'https://pytorch.org/tutorials/',
        description: 'Hands-on recipes for training, distributed compute, and mobile deployment.'
      },
      {
        title: 'Full Stack MLOps Course',
        type: 'Course',
        provider: 'Made With ML',
        url: 'https://madewithml.com',
        description: 'Guide to building, testing, deploying, and maintaining production machine learning systems.'
      }
    ]
  },
  {
    id: 'game-developer',
    title: 'Game Developer',
    category: 'Gaming & Interactive Media',
    iconName: 'Gamepad',
    badge: 'Creative & Technical',
    description: 'Creates interactive video games, 3D graphics rendering engines, physics simulations, and multiplayer game logic using Unreal Engine or Unity.',
    overview: 'Game Developers bring virtual worlds to life. They write C++ or C# scripts for character movement, AI behaviors, physics interactions, shaders, and networking logic. They collaborate with 3D artists, game designers, and audio engineers.',
    dayInLife: [
      'Program game mechanics, character controls, and combat systems in C++ or C#.',
      'Optimize 3D graphics frame rates, LOD meshes, and memory budgets.',
      'Implement enemy AI behavior trees and pathfinding algorithms.',
      'Integrate multiplayer networking synchronization and physics.'
    ],
    salary: {
      entry: '$78,000 / yr',
      mid: '$118,000 / yr',
      senior: '$170,000+ / yr',
      average: '$122,000 / yr'
    },
    skills: {
      technical: ['C++ or C# Programming', 'Unreal Engine 5 or Unity', '3D Math & Matrix Transformations', 'Physics & Collision Systems', 'Shader Programming (HLSL / GLSL)', 'Multiplayer Networking'],
      frameworksAndTools: ['Unreal Engine 5', 'Unity Engine', 'Blender Basics', 'RenderDoc', 'Git / Perforce'],
      softSkills: ['Creative Gameplay Design', 'Performance Optimization Mindset', 'Cross-Discipline Collaboration', 'Attention to Animation Timing']
    },
    topCompanies: [
      { name: 'Epic Games', industry: 'Game Engine & Gaming', hiringFocus: 'Unreal Engine 5, Fortnite, C++' },
      { name: 'Riot Games', industry: 'Competitive Gaming', hiringFocus: 'League of Legends, Valorant, Systems & Networking' },
      { name: 'Electronic Arts (EA)', industry: 'AAA Gaming Publisher', hiringFocus: 'Frostbite Engine, Sports & Action Games' },
      { name: 'Blizzard Entertainment', industry: 'AAA RPG & Strategy', hiringFocus: 'C++, World design, Online multiplayer' },
      { name: 'Unity Technologies', industry: 'Game Engine Platform', hiringFocus: 'Runtime rendering, Engine C# architecture' }
    ],
    roadmap: [
      {
        phase: 'Phase 1',
        title: 'C++ / C# & 3D Math Fundamentals (Months 1 - 2)',
        duration: '2 Months',
        topics: ['Master C# or C++ Object-Oriented Principles', 'Vectors, Quaternions, & Matrix Transformations', 'Data Structures & Memory Allocation', 'Git / Perforce Setup']
      },
      {
        phase: 'Phase 2',
        title: 'Game Engine Basics (Months 3 - 4)',
        duration: '2 Months',
        topics: ['Unreal Engine Blueprint/C++ or Unity Component Architecture', 'Character Physics & Collision Detection', 'UI Systems & Input Managers', 'Building 2D & 3D Prototypes']
      },
      {
        phase: 'Phase 3',
        title: 'AI, Shaders & Game Mechanics (Months 5 - 6)',
        duration: '2 Months',
        topics: ['NavMesh Pathfinding & Behavior Trees', 'HLSL / GLSL Custom Shaders & Particle Effects', 'Audio Integration & Animation State Machines', 'Game Jam Project Submission']
      },
      {
        phase: 'Phase 4',
        title: 'Multiplayer & Performance Profiling (Months 7 - 8)',
        duration: '2 Months',
        topics: ['Netcode & Client-Side Prediction', 'Profiling CPU/GPU Frame Spikes with RenderDoc', 'Packaging & Publishing Game Demos', 'Portfolio Game Reel']
      }
    ],
    videos: [
      {
        title: 'How to Become a Game Developer in 2026',
        channel: 'Sebastian Lague',
        duration: '30 mins',
        url: 'https://www.youtube.com/results?search_query=Sebastian+Lague+Game+Developer+Roadmap',
        category: 'Career Roadmap'
      },
      {
        title: 'Unreal Engine 5 C++ Full Beginner Course',
        channel: 'FreeCodeCamp',
        duration: '11 hrs',
        url: 'https://www.youtube.com/results?search_query=Unreal+Engine+5+C%2B%2B+Course+FreeCodeCamp',
        category: 'Full Course'
      },
      {
        title: 'Unity C# 3D Game Development Tutorial',
        channel: 'Brackeys',
        duration: '1 hr 40 mins',
        url: 'https://www.youtube.com/results?search_query=Brackeys+Unity+3D+Tutorial',
        category: 'Project Build'
      }
    ],
    resources: [
      {
        title: 'Unreal Engine Official Learning Portal',
        type: 'Course',
        provider: 'Epic Games',
        url: 'https://dev.epicgames.com/community/learning',
        description: 'Official Epic Games interactive video courses for C++, Blueprints, and graphics.'
      },
      {
        title: 'Unity Learn Portal',
        type: 'Course',
        provider: 'Unity Technologies',
        url: 'https://learn.unity.com',
        description: 'Guided learning pathways for game design, C# scripting, and 3D worlds.'
      },
      {
        title: 'Itch.io Game Jams & Community',
        type: 'Community',
        provider: 'Itch.io',
        url: 'https://itch.io/jams',
        description: 'Participate in weekend game jams to build portfolio projects and receive community feedback.'
      }
    ]
  },
  {
    id: 'devops-engineer',
    title: 'DevOps Engineer',
    category: 'Cloud & Infrastructure',
    iconName: 'ServerCog',
    badge: 'Automation Core (+30%)',
    description: 'Automates software build, testing, and deployment pipelines (CI/CD) while guaranteeing platform reliability, monitoring, and zero-downtime releases.',
    overview: 'DevOps Engineers unify software development and IT operations. They implement continuous integration/continuous deployment (CI/CD) pipelines, orchestrate Kubernetes clusters, automate infrastructure provisioning, and manage site reliability engineering (SRE) practices.',
    dayInLife: [
      'Maintain GitHub Actions and GitLab CI/CD build pipelines.',
      'Manage production Kubernetes (EKS/GKE) cluster health and auto-scaling.',
      'Automate server configuration with Ansible or Terraform.',
      'Set up alerting dashboards in Grafana and Datadog for site reliability.'
    ],
    salary: {
      entry: '$95,000 / yr',
      mid: '$142,000 / yr',
      senior: '$200,000+ / yr',
      average: '$148,000 / yr'
    },
    skills: {
      technical: ['CI/CD Pipelines (GitHub Actions, GitLab, Jenkins)', 'Kubernetes & Docker Container Orchestration', 'Infrastructure as Code (Terraform)', 'Linux System Internals & Bash', 'Monitoring & Observability (Prometheus, Grafana)', 'Python / Go Automation'],
      frameworksAndTools: ['Kubernetes', 'Docker', 'Terraform', 'Helm', 'ArgoCD', 'Datadog / Prometheus'],
      softSkills: ['Automation-First Mindset', 'SRE Incident Management', 'Cross-Team Communication', 'Process Efficiency']
    },
    topCompanies: [
      { name: 'GitLab', industry: 'DevOps Platform', hiringFocus: 'CI/CD, DevSecOps, Cloud Native' },
      { name: 'GitHub (Microsoft)', industry: 'Developer Ecosystem', hiringFocus: 'Actions, Enterprise infrastructure' },
      { name: 'Red Hat', industry: 'Enterprise Linux & Cloud', hiringFocus: 'OpenShift, Linux internals, Ansible' },
      { name: 'Datadog', industry: 'Observability & Monitoring', hiringFocus: 'Monitoring, Telemetry, Reliability' },
      { name: 'HashiCorp', industry: 'Cloud Automation Tools', hiringFocus: 'Terraform, Vault, Nomad' }
    ],
    roadmap: [
      {
        phase: 'Phase 1',
        title: 'Linux Systems & Shell Scripting (Months 1 - 2)',
        duration: '2 Months',
        topics: ['Linux System Administration & Permissions', 'Bash Shell Scripting & Automation', 'Git Branching Strategies', 'Networking Basics (DNS, SSH, HTTP)']
      },
      {
        phase: 'Phase 2',
        title: 'Containers & Docker Mastery (Months 3 - 4)',
        duration: '2 Months',
        topics: ['Dockerfiles & Image Optimization', 'Docker Compose Multi-container Stacks', 'Container Security & Scanning', 'Local Container Testing']
      },
      {
        phase: 'Phase 3',
        title: 'CI/CD & Infrastructure as Code (Months 5 - 6)',
        duration: '2 Months',
        topics: ['GitHub Actions / GitLab CI Workflows', 'Terraform Modules & Cloud Deployment', 'Helm Charts & Configuration', 'Automated Testing Integration']
      },
      {
        phase: 'Phase 4',
        title: 'Kubernetes & GitOps / Observability (Months 7 - 8)',
        duration: '2 Months',
        topics: ['Kubernetes Clusters (EKS/GKE) Deployment', 'ArgoCD GitOps Deployment', 'Prometheus & Grafana Alerting', 'CKA Certification Prep']
      }
    ],
    videos: [
      {
        title: 'DevOps Engineer Roadmap 2026',
        channel: 'TechWithNana',
        duration: '45 mins',
        url: 'https://www.youtube.com/results?search_query=TechWithNana+DevOps+Engineer+Roadmap',
        category: 'Career Roadmap'
      },
      {
        title: 'Docker and Kubernetes Course for Beginners',
        channel: 'FreeCodeCamp',
        duration: '3 hrs 30 mins',
        url: 'https://www.youtube.com/results?search_query=Docker+Kubernetes+FreeCodeCamp',
        category: 'Full Course'
      },
      {
        title: 'GitHub Actions CI/CD Pipeline Tutorial',
        channel: 'DevOps Toolkit',
        duration: '40 mins',
        url: 'https://www.youtube.com/results?search_query=GitHub+Actions+CI+CD+DevOps+Toolkit',
        category: 'Project Tutorial'
      }
    ],
    resources: [
      {
        title: 'Roadmap.sh - DevOps Roadmap',
        type: 'Guide',
        provider: 'Roadmap.sh',
        url: 'https://roadmap.sh/devops',
        description: 'Interactive visual tree for learning DevOps engineering step-by-step.'
      },
      {
        title: 'Kubernetes Official Interactive Documentation',
        type: 'Documentation',
        provider: 'Cloud Native Computing Foundation (CNCF)',
        url: 'https://kubernetes.io/docs/home/',
        description: 'Official API documentation and tutorials for container orchestration.'
      },
      {
        title: 'KodeKloud - Interactive DevOps Labs',
        type: 'Practice Platform',
        provider: 'KodeKloud',
        url: 'https://kodekloud.com',
        description: 'Hands-on terminal lab environments for CKA, Docker, Terraform, and Linux.'
      }
    ]
  }
];
