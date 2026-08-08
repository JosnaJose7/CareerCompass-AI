import { JobMarketOverview } from '../types';

export const initialJobMarketData: JobMarketOverview = {
  lastUpdated: 'Q3 2026 Live Market Feed',
  industrySector: 'Technology & AI Engineering',
  aiSummary: 'The 2026 tech hiring landscape prioritizes AI-integrated software development, cloud native architecture, vector data engineering, and zero-trust security. Candidates with strong full-stack skills plus LLM integration capabilities command a 24% salary premium in campus recruitment.',
  topHiringSkills: [
    { skill: 'Python / PyTorch', demandPercentage: 94, category: 'AI & Data', yearOverYearGrowth: '+38%', avgSalaryBonus: '+$18,000' },
    { skill: 'TypeScript & React', demandPercentage: 91, category: 'Frontend / Full-Stack', yearOverYearGrowth: '+22%', avgSalaryBonus: '+$12,000' },
    { skill: 'SQL & Vector DBs', demandPercentage: 88, category: 'Database & Storage', yearOverYearGrowth: '+45%', avgSalaryBonus: '+$15,000' },
    { skill: 'Docker & Kubernetes', demandPercentage: 84, category: 'Cloud & DevOps', yearOverYearGrowth: '+29%', avgSalaryBonus: '+$14,000' },
    { skill: 'Node.js & Express', demandPercentage: 82, category: 'Backend Systems', yearOverYearGrowth: '+18%', avgSalaryBonus: '+$10,000' },
    { skill: 'Prompt Eng & RAG', demandPercentage: 78, category: 'Generative AI', yearOverYearGrowth: '+120%', avgSalaryBonus: '+$22,000' },
    { skill: 'AWS / GCP Cloud', demandPercentage: 76, category: 'Cloud Platforms', yearOverYearGrowth: '+25%', avgSalaryBonus: '+$16,000' },
    { skill: 'Cybersecurity & OAuth', demandPercentage: 72, category: 'Security', yearOverYearGrowth: '+31%', avgSalaryBonus: '+$14,000' }
  ],
  trendingTechnologies: [
    { technology: 'Generative AI & LLM APIs', category: 'Artificial Intelligence', momentumScore: 98, year2024: 35, year2025: 72, year2026: 98, year2027: 120, adoptionLevel: 'Rapid Growth' },
    { technology: 'Vector DBs (Pinecone, Qdrant)', category: 'Database Systems', momentumScore: 92, year2024: 20, year2025: 55, year2026: 92, year2027: 110, adoptionLevel: 'Rapid Growth' },
    { technology: 'React 19 & Next.js App Router', category: 'Frontend Frameworks', momentumScore: 89, year2024: 65, year2025: 80, year2026: 89, year2027: 95, adoptionLevel: 'Mainstream' },
    { technology: 'Kubernetes & Serverless', category: 'Cloud Infrastructure', momentumScore: 86, year2024: 60, year2025: 74, year2026: 86, year2027: 92, adoptionLevel: 'Mainstream' },
    { technology: 'Rust & WebAssembly', category: 'Systems Programming', momentumScore: 80, year2024: 30, year2025: 52, year2026: 80, year2027: 105, adoptionLevel: 'Emerging' },
    { technology: 'Zero Trust & Cloud Security', category: 'Security Architecture', momentumScore: 83, year2024: 45, year2025: 65, year2026: 83, year2027: 98, adoptionLevel: 'Mainstream' }
  ],
  popularCareers: [
    { role: 'AI / ML Engineer', openingsIndex: 124000, popularityScore: 96, demandLevel: 'Very High', entrySalary: 115000, midSalary: 165000, seniorSalary: 235000, topEmployers: ['OpenAI', 'Google', 'Microsoft', 'NVIDIA', 'Anthropic'], futureGrowthRate: '+34%' },
    { role: 'Full-Stack Engineer', openingsIndex: 148000, popularityScore: 94, demandLevel: 'Very High', entrySalary: 95000, midSalary: 142000, seniorSalary: 195000, topEmployers: ['Meta', 'Amazon', 'Stripe', 'Apple', 'Uber'], futureGrowthRate: '+22%' },
    { role: 'Cloud & DevOps Architect', openingsIndex: 98000, popularityScore: 89, demandLevel: 'Very High', entrySalary: 102000, midSalary: 152000, seniorSalary: 210000, topEmployers: ['AWS', 'Microsoft Azure', 'Datadog', 'Snowflake'], futureGrowthRate: '+28%' },
    { role: 'Data Engineer & Architect', openingsIndex: 86000, popularityScore: 87, demandLevel: 'High', entrySalary: 92000, midSalary: 138000, seniorSalary: 188000, topEmployers: ['Databricks', 'Palantir', 'Capital One', 'Salesforce'], futureGrowthRate: '+25%' },
    { role: 'Cybersecurity Engineer', openingsIndex: 75000, popularityScore: 85, demandLevel: 'High', entrySalary: 88000, midSalary: 135000, seniorSalary: 185000, topEmployers: ['Palo Alto Networks', 'CrowdStrike', 'Cloudflare', 'Cisco'], futureGrowthRate: '+30%' },
    { role: 'Product Manager (APM)', openingsIndex: 52000, popularityScore: 82, demandLevel: 'Moderate', entrySalary: 98000, midSalary: 148000, seniorSalary: 205000, topEmployers: ['Google', 'LinkedIn', 'Atlassian', 'Airbnb'], futureGrowthRate: '+18%' }
  ],
  salaryBreakdowns: [
    { role: 'AI / ML Engineer', entryLevel: 115000, midLevel: 165000, seniorLevel: 235000, avgBonus: 22000 },
    { role: 'Full-Stack Engineer', entryLevel: 95000, midLevel: 142000, seniorLevel: 195000, avgBonus: 15000 },
    { role: 'Cloud & DevOps Architect', entryLevel: 102000, midLevel: 152000, seniorLevel: 210000, avgBonus: 18000 },
    { role: 'Data Engineer', entryLevel: 92000, midLevel: 138000, seniorLevel: 188000, avgBonus: 14000 },
    { role: 'Cybersecurity Analyst', entryLevel: 88000, midLevel: 135000, seniorLevel: 185000, avgBonus: 13000 },
    { role: 'Technical Product Manager', entryLevel: 98000, midLevel: 148000, seniorLevel: 205000, avgBonus: 19000 }
  ],
  demandLevelDistribution: [
    { level: 'Very High Growth (Hot)', percentage: 58, color: '#10B981', rolesCount: 142000 },
    { level: 'High Steady Demand', percentage: 28, color: '#3B82F6', rolesCount: 68000 },
    { level: 'Moderate Baseline', percentage: 11, color: '#F59E0B', rolesCount: 26000 },
    { level: 'Saturated / Legacy', percentage: 3, color: '#EF4444', rolesCount: 7000 }
  ],
  futureScopeRadar: [
    { subject: 'AI Integration', growthPotential: 98, aiResilience: 95, remoteFlexibility: 88, entryAccessibility: 78 },
    { subject: 'Full-Stack Web', growthPotential: 85, aiResilience: 80, remoteFlexibility: 92, entryAccessibility: 90 },
    { subject: 'Cloud & DevOps', growthPotential: 92, aiResilience: 88, remoteFlexibility: 85, entryAccessibility: 72 },
    { subject: 'Data Engineering', growthPotential: 90, aiResilience: 86, remoteFlexibility: 88, entryAccessibility: 75 },
    { subject: 'Cybersecurity', growthPotential: 94, aiResilience: 92, remoteFlexibility: 80, entryAccessibility: 70 },
    { subject: 'Product & UX', growthPotential: 80, aiResilience: 85, remoteFlexibility: 90, entryAccessibility: 82 }
  ]
};
