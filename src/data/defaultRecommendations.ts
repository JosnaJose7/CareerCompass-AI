import { CareerRecommendation } from '../types';

export const INITIAL_CAREER_RECOMMENDATIONS: CareerRecommendation[] = [
  {
    id: 'role_init_1',
    title: 'Full-Stack AI Software Engineer',
    matchScore: 94,
    shortSummary: 'High-impact engineering path designing end-to-end web applications powered by generative AI models, vector stores, and resilient microservices.',
    whyRecommended: 'Recommended because: Strong proficiency in React, TypeScript, and Python, hands-on Gemini API project portfolio, 3.8 GPA in Computer Science, and solid systems fundamentals.',
    supportingFactors: [
      'Strong web development stack proficiency (React, TypeScript, Node.js)',
      'Hands-on AI integration experience with Gemini API in browser extensions',
      'Solid algorithmic problem solving and data structures foundation (3.8 GPA)',
      'AWS Certified Developer Associate credential validating cloud readiness'
    ],
    areasForImprovement: [
      'Deepen container orchestration with Kubernetes for multi-agent workloads',
      'Optimize vector database index tuning (Pinecone/Milvus/pgvector)'
    ],
    requiredSkills: ['TypeScript', 'React', 'Python', 'Node.js', 'REST APIs', 'SQL', 'Git', 'Docker'],
    matchingSkills: ['Python', 'TypeScript', 'React', 'Node.js', 'SQL', 'Git', 'Data Structures'],
    relevantInterests: ['Artificial Intelligence', 'Full-Stack Development', 'Cloud Computing'],
    relevantProjects: ['AI Code Assistant Chrome Extension'],
    relevantAssessmentStrengths: ['Algorithmic Problem Solving (90%+)', 'Logical Reasoning', 'Full-Stack Architecture'],
    missingSkills: ['Docker & Containerization', 'Vector Databases & Embeddings', 'CI/CD Pipelines'],
    recommendedNextSteps: [
      'Complete a production project containerizing an AI web application with Docker',
      'Integrate vector search and retrieval-augmented generation (RAG) into a portfolio app',
      'Conduct 3 mock technical coding interviews focusing on system design fundamentals'
    ],
    dayInLife: 'Architect scalable web services, craft responsive user interfaces in React, fine-tune LLM prompt pipelines, and collaborate with product teams on deployment.',
    salaryRange: {
      entry: '$115,000 - $145,000',
      mid: '$150,000 - $190,000',
      senior: '$195,000 - $260,000'
    },
    demandGrowth: '+28% Very High Growth',
    futureDemand: 'Exponential expansion driven by generative AI enterprise adoption across all major digital platforms.',
    reason: 'Exceptional alignment between full-stack JavaScript foundations and Python AI development skills.',
    strengths: ['Algorithmic Problem Solving', 'Full-Stack Architecture', 'Gemini API Integration', 'Fast Learner'],
    weaknesses: ['Kubernetes Orchestration', 'Microservice Performance Profiling'],
    keyResponsibilities: [
      'Design and build responsive frontend interfaces and robust backend APIs',
      'Integrate generative AI APIs, embeddings, and vector storage pipelines',
      'Write clean, documented, and thoroughly tested production code',
      'Deploy and monitor cloud applications on AWS/GCP'
    ],
    skillsGap: [
      { skill: 'Docker & Containerization', type: 'missing', importance: 'High', howToAcquire: 'Complete hands-on containerization tutorial and deploy a container to Cloud Run.' },
      { skill: 'CI/CD Pipelines', type: 'missing', importance: 'Medium', howToAcquire: 'Set up automated GitHub Actions for linting, testing, and deployment.' }
    ],
    aiReasoning: 'Your combination of frontend and backend coursework projects positions you directly for competitive junior engineering hiring rounds.',
    topEmployers: ['Microsoft', 'Google', 'Stripe', 'Linear', 'Anthropic', 'Scale AI']
  },
  {
    id: 'role_init_2',
    title: 'Machine Learning & Systems Developer',
    matchScore: 89,
    shortSummary: 'Develop scalable machine learning pipelines, inference servers, model evaluation benchmarks, and production data workflows.',
    whyRecommended: 'Recommended because: Strong analytical foundation in Python, high quantitative aptitude, interest in deep learning systems, and computer science coursework.',
    supportingFactors: [
      'Python programming proficiency and data structure mastery',
      'High quantitative and analytical reasoning performance',
      'Strong passion and interest in artificial intelligence models',
      'Academic coursework alignment in machine learning & algorithms'
    ],
    areasForImprovement: [
      'Gain hands-on experience with MLops frameworks (MLflow, Kubeflow)',
      'Benchmark latency and memory consumption on GPU inference runtimes'
    ],
    requiredSkills: ['Python', 'PyTorch / TensorFlow', 'SQL', 'Docker', 'REST APIs', 'Math & Statistics'],
    matchingSkills: ['Python', 'SQL', 'Data Structures', 'Git'],
    relevantInterests: ['Artificial Intelligence', 'Tech Startups', 'Cloud Computing'],
    relevantProjects: ['AI Code Assistant Chrome Extension'],
    relevantAssessmentStrengths: ['Quantitative Analysis', 'Pattern Recognition', 'Mathematical Modeling'],
    missingSkills: ['PyTorch / TensorFlow', 'MLOps & Experiment Tracking', 'CUDA / GPU Optimization'],
    recommendedNextSteps: [
      'Build and train an open-source PyTorch classifier model and export to ONNX',
      'Explore quantization techniques (INT8, FP16) to reduce model inference memory footprint',
      'Deploy an automated model inference API endpoint on AWS SageMaker or Modal'
    ],
    dayInLife: 'Benchmark model latency, build data preprocessing pipelines, fine-tune open weights, and optimize inference endpoints for high-throughput serving.',
    salaryRange: {
      entry: '$120,000 - $155,000',
      mid: '$160,000 - $205,000',
      senior: '$210,000 - $280,000'
    },
    demandGrowth: '+32% Explosive Growth',
    futureDemand: 'Highest industry growth trajectory as companies operationalize machine learning systems across products.',
    reason: 'Direct match between algorithmic problem-solving ability and Python ML engineering prerequisites.',
    strengths: ['Analytical Thinking', 'Python Foundation', 'Systems Logic'],
    weaknesses: ['GPU Memory Profiling', 'Distributed Training Infrastructure'],
    keyResponsibilities: [
      'Build end-to-end data pipelines for training and evaluation',
      'Deploy and monitor low-latency model inference servers',
      'Implement evaluation benchmarks and regression testing for model outputs'
    ],
    skillsGap: [
      { skill: 'PyTorch / Frameworks', type: 'missing', importance: 'High', howToAcquire: 'Complete hands-on deep learning tutorials and implement neural networks from scratch.' },
      { skill: 'MLOps Tools', type: 'missing', importance: 'Medium', howToAcquire: 'Learn MLflow for experiment tracking and model registry management.' }
    ],
    aiReasoning: 'Your strong computer science core enables a smooth pivot into high-paying ML systems and infrastructure roles.',
    topEmployers: ['OpenAI', 'Meta', 'NVIDIA', 'Databricks', 'Snowflake']
  },
  {
    id: 'role_init_3',
    title: 'Cloud Infrastructure & DevOps Engineer',
    matchScore: 85,
    shortSummary: 'Architect resilient multi-region cloud systems, automated deployment pipelines, infrastructure as code, and zero-trust security postures.',
    whyRecommended: 'Recommended because: AWS Certified Developer credential, systems development interests, disciplined problem-solving, and cloud computing passion.',
    supportingFactors: [
      'AWS Certified Developer Associate credential already attained',
      'Interest in Cloud Computing and scalable tech infrastructure',
      'Proficiency in TypeScript and Node.js for serverless functions',
      'Strong understanding of networking and Linux fundamentals'
    ],
    areasForImprovement: [
      'Master Terraform or Pulumi for Infrastructure-as-Code (IaC)',
      'Implement Prometheus and Grafana distributed telemetry dashboards'
    ],
    requiredSkills: ['AWS / GCP', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD Pipelines', 'Linux', 'Python / Bash'],
    matchingSkills: ['AWS Certified Developer Associate', 'Node.js', 'SQL', 'Git'],
    relevantInterests: ['Cloud Computing', 'Tech Startups'],
    relevantProjects: ['AI Code Assistant Chrome Extension'],
    relevantAssessmentStrengths: ['Systematic Troubleshooting', 'Architecture Design', 'Root Cause Analysis'],
    missingSkills: ['Terraform / IaC', 'Kubernetes', 'Prometheus & Grafana'],
    recommendedNextSteps: [
      'Write Terraform configuration scripts to provision a complete VPC and serverless cluster',
      'Configure automated container deployment pipelines with GitHub Actions and AWS ECR',
      'Earn the AWS Certified Solutions Architect Associate credential'
    ],
    dayInLife: 'Automate deployment workflows, design high-availability cloud architecture, manage secrets and IAM policies, and monitor system health metrics.',
    salaryRange: {
      entry: '$105,000 - $135,000',
      mid: '$140,000 - $180,000',
      senior: '$185,000 - $245,000'
    },
    demandGrowth: '+21% Steady High Growth',
    futureDemand: 'Constant demand as cloud modernization and security compliance remain top enterprise priorities.',
    reason: 'Existing AWS certification gives an early competitive advantage over generic software engineering applicants.',
    strengths: ['Cloud Fundamentals', 'AWS Knowledge', 'Structured Problem Solving'],
    weaknesses: ['Infrastructure-as-Code Mastery', 'Large-Scale Kubernetes Management'],
    keyResponsibilities: [
      'Provision and manage cloud infrastructure using Terraform',
      'Maintain continuous integration and deployment pipelines',
      'Ensure 99.99% system availability, disaster recovery, and security compliance'
    ],
    skillsGap: [
      { skill: 'Terraform', type: 'missing', importance: 'High', howToAcquire: 'Write modular Terraform templates for cloud infrastructure.' },
      { skill: 'Kubernetes', type: 'missing', importance: 'High', howToAcquire: 'Deploy a multi-container microservice application to a Kubernetes cluster.' }
    ],
    aiReasoning: 'Your existing AWS certification puts you in the top 15% of university seniors seeking infrastructure roles.',
    topEmployers: ['Amazon Web Services', 'Cloudflare', 'HashiCorp', 'Palantir', 'Datadog']
  },
  {
    id: 'role_init_4',
    title: 'Data Platform Engineer',
    matchScore: 82,
    shortSummary: 'Engineer high-throughput data pipelines, real-time analytics streaming, Lakehouse storage engines, and data transformation models.',
    whyRecommended: 'Recommended because: Strong SQL foundation, Python proficiency, structured data design skills, and analytical thinking.',
    supportingFactors: [
      'Solid SQL querying and relational schema design proficiency',
      'Python data manipulation and algorithmic scripting skills',
      'Academic coursework in database management systems',
      'Interest in full-stack backend data flow and analytics'
    ],
    areasForImprovement: [
      'Build real-time event streaming pipelines with Apache Kafka or Redpanda',
      'Learn dbt (data build tool) for modern data warehouse transformations'
    ],
    requiredSkills: ['SQL', 'Python', 'Apache Spark / Kafka', 'dbt', 'Snowflake / BigQuery', 'Airflow', 'Data Modeling'],
    matchingSkills: ['SQL', 'Python', 'Data Structures', 'Git'],
    relevantInterests: ['Artificial Intelligence', 'Full-Stack Development'],
    relevantProjects: ['AI Code Assistant Chrome Extension'],
    relevantAssessmentStrengths: ['Data Schema Design', 'Query Optimization', 'Logical Reasoning'],
    missingSkills: ['Apache Spark / Kafka', 'dbt', 'Apache Airflow Workflow Orchestration'],
    recommendedNextSteps: [
      'Build a modern data pipeline using dbt, DuckDB, and Python to transform a 10M-row dataset',
      'Schedule automated DAGs using Apache Airflow to orchestrate data ingestion',
      'Explore columnar storage formats (Parquet, Arrow) for fast analytical querying'
    ],
    dayInLife: 'Build robust ETL/ELT pipelines, optimize data warehouse query performance, maintain data quality tests, and collaborate with data scientists.',
    salaryRange: {
      entry: '$105,000 - $135,000',
      mid: '$140,000 - $175,000',
      senior: '$180,000 - $235,000'
    },
    demandGrowth: '+23% Strong Growth',
    futureDemand: 'High enterprise demand for foundational data platforms feeding AI models and business analytics.',
    reason: 'Strong SQL and Python foundation provides the core capabilities needed for modern data engineering.',
    strengths: ['SQL Mastery', 'Analytical Mindset', 'Python Automation'],
    weaknesses: ['Distributed Streaming Systems', 'Data Quality SLA Frameworks'],
    keyResponsibilities: [
      'Develop scalable ingestion pipelines for structured and unstructured data',
      'Maintain data warehouse architectures in Snowflake or BigQuery',
      'Implement automated data validation tests and alert monitoring'
    ],
    skillsGap: [
      { skill: 'dbt (Data Build Tool)', type: 'missing', importance: 'High', howToAcquire: 'Complete dbt Fundamentals certification and build a modular SQL transformation project.' },
      { skill: 'Apache Airflow', type: 'missing', importance: 'Medium', howToAcquire: 'Create and schedule data ingestion DAGs in Airflow.' }
    ],
    aiReasoning: 'Data platform engineers are among the most sought-after technical profiles as companies expand their data-driven initiatives.',
    topEmployers: ['Snowflake', 'Uber', 'Airbnb', 'Netflix', 'DoorDash']
  },
  {
    id: 'role_init_5',
    title: 'Product-Focused Frontend Engineer',
    matchScore: 81,
    shortSummary: 'Craft pixel-perfect user interfaces, fluid micro-interactions, responsive design systems, and lightning-fast client performance.',
    whyRecommended: 'Recommended because: Hands-on React & TypeScript project experience, modern CSS styling proficiency, and user experience focus.',
    supportingFactors: [
      'Proven hands-on React and TypeScript development experience',
      'Modern Tailwind CSS styling and responsive design skills',
      'Completed browser extension project with rich user interaction',
      'Strong eye for UI ergonomics and component reusability'
    ],
    areasForImprovement: [
      'Master web accessibility standards (WCAG 2.1 AA) and keyboard navigation',
      'Deepen knowledge of Core Web Vitals optimization and bundle sizing'
    ],
    requiredSkills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'State Management', 'Web Performance', 'Testing (Jest/Playwright)'],
    matchingSkills: ['TypeScript', 'React', 'Git'],
    relevantInterests: ['Full-Stack Development', 'Tech Startups'],
    relevantProjects: ['AI Code Assistant Chrome Extension'],
    relevantAssessmentStrengths: ['UI Component Architecture', 'Visual Precision', 'User Empathy'],
    missingSkills: ['Next.js App Router', 'End-to-End Testing (Playwright)', 'Accessibility (a11y)'],
    recommendedNextSteps: [
      'Build a high-performance Next.js web application with server components and streaming UI',
      'Write end-to-end automated test suites using Playwright',
      'Audit and optimize a web application to achieve 95+ Google Lighthouse scores'
    ],
    dayInLife: 'Build interactive UI components, optimize animation performance, implement design system tokens, and collaborate with product designers.',
    salaryRange: {
      entry: '$100,000 - $130,000',
      mid: '$135,000 - $170,000',
      senior: '$175,000 - $230,000'
    },
    demandGrowth: '+18% Steady Growth',
    futureDemand: 'Continuous need for high-caliber UI engineers who can turn complex AI features into intuitive user experiences.',
    reason: 'Your React, TypeScript, and Tailwind foundation aligns directly with modern product engineering teams.',
    strengths: ['React & TypeScript', 'Modern CSS & Tailwind', 'Fast Prototyping'],
    weaknesses: ['Performance Profiling Tools', 'Advanced a11y Compliance'],
    keyResponsibilities: [
      'Develop modular, accessible, and performant UI components in React',
      'Optimize web application loading speed, rendering performance, and SEO',
      'Collaborate closely with designers and product managers to refine user flows'
    ],
    skillsGap: [
      { skill: 'Next.js', type: 'missing', importance: 'High', howToAcquire: 'Build a production full-stack Next.js app with Server Actions.' },
      { skill: 'Playwright E2E Testing', type: 'missing', importance: 'Medium', howToAcquire: 'Write automated user interaction tests for critical flows.' }
    ],
    aiReasoning: 'Product engineering teams consistently prize engineers who combine design sensitivity with strong TypeScript foundations.',
    topEmployers: ['Vercel', 'Figma', 'Notion', 'Airbnb', 'GitHub']
  }
];
