import { StudentProfile } from '../types';

export const sampleProfiles: { label: string; profile: Partial<StudentProfile> }[] = [
  {
    label: "Computer Science Senior (Software & AI Focus)",
    profile: {
      university: "Stanford University",
      major: "Computer Science (AI & Systems track)",
      gradYear: "2026",
      gpa: "3.8",
      skills: ["Python", "TypeScript", "React", "Node.js", "PyTorch", "SQL", "Git", "Docker", "REST APIs", "Data Structures"],
      interests: ["Artificial Intelligence", "Full-Stack Development", "Cloud Computing", "Tech Startups", "Autonomous Systems"],
      certifications: ["AWS Certified Developer Associate", "Deep Learning Specialization (Coursera)"],
      projects: [
        {
          id: "p1",
          title: "AI Code Assistant Chrome Extension",
          description: "Built a browser extension using Gemini API that explains complex code snippets and generates unit tests on GitHub.",
          technologies: ["TypeScript", "React", "Gemini API", "Tailwind CSS"],
          link: "https://github.com/example/ai-code-assistant"
        },
        {
          id: "p2",
          title: "Distributed Task Scheduler",
          description: "Engineered a high-throughput microservice in Node.js & Redis to handle 10,000+ async task queues with retry logic.",
          technologies: ["Node.js", "Redis", "Docker", "Jest"],
        }
      ],
      workPreference: "Hybrid",
      targetIndustries: ["Technology", "AI & Machine Learning", "Fintech"],
      careerGoals: "Land a Software Engineer or AI Systems Developer role at a top technology company or high-growth AI startup after graduation."
    }
  },
  {
    label: "Business Analytics & Data Junior",
    profile: {
      university: "UC Berkeley",
      major: "Data Science & Business Administration",
      gradYear: "2027",
      gpa: "3.7",
      skills: ["SQL", "Python (Pandas/NumPy)", "Tableau", "PowerBI", "A/B Testing", "Excel / Financial Modeling", "Google Analytics", "Communication"],
      interests: ["Data Analytics", "Product Strategy", "Growth Marketing", "Management Consulting", "Consumer Tech"],
      certifications: ["Google Data Analytics Professional Certificate", "SQL for Data Science (Coursera)"],
      projects: [
        {
          id: "p3",
          title: "E-Commerce Customer Churn Analysis",
          description: "Analyzed 50,000+ user records using Python & Tableau to discover key drivers of customer attrition, presenting insights to university faculty.",
          technologies: ["Python", "Pandas", "Scikit-Learn", "Tableau"]
        }
      ],
      workPreference: "Remote",
      targetIndustries: ["Fintech", "Consulting", "E-Commerce"],
      careerGoals: "Become a Product Analyst or Data Consultant, converting complex data into business decisions."
    }
  },
  {
    label: "UI/UX Design & Human-Computer Interaction Student",
    profile: {
      university: "University of Michigan",
      major: "Information & HCI Design",
      gradYear: "2026",
      gpa: "3.9",
      skills: ["Figma", "User Research", "Wireframing & Prototyping", "Design Systems", "Usability Testing", "HTML/CSS", "Design Thinking", "Accessibility (WCAG)"],
      interests: ["Product Design", "Design Systems", "User Psychology", "Accessibility", "EdTech"],
      certifications: ["Google UX Design Professional Certificate"],
      projects: [
        {
          id: "p4",
          title: "Campus Study Buddy App Redesign",
          description: "Conducted user interviews with 25 students, redesigned app navigation in Figma, increasing user task completion speed by 40%.",
          technologies: ["Figma", "User Research", "Prototyping"]
        }
      ],
      workPreference: "Hybrid",
      targetIndustries: ["Technology", "Healthcare Tech", "EdTech"],
      careerGoals: "Work as an Associate Product Designer crafting intuitive digital tools for millions of users."
    }
  }
];
