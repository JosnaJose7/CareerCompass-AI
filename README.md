# 🧭 CareerCompass AI — Next-Gen AI Career Guidance & Job Market Analytics Platform

**CareerCompass AI** is a comprehensive, AI-driven career guidance, job market analytics, and faculty mentorship platform powered by **Google Gemini 2.5**, **React 18**, **TypeScript**, **Tailwind CSS**, and **Firebase (Auth & Firestore)**.

It empowers students and job seekers with data-driven career recommendations, personalized 9-month roadmaps, skill gap diagnostics, resume optimization, interactive mock interviews, and live job market intelligence — while providing faculty mentors with a dedicated portal to guide student outcomes.

---

## ✨ Key Features

### 1. 📊 Interactive Job Market Dashboard
- **Top Hiring Skills**: Real-time demand percentages, YoY growth rates, and salary premiums across AI, Cloud, Full-Stack, and Security.
- **Trending Technology Momentum**: Multi-year technology trajectory tracking (2024–2027) with adoption level classification (*Mainstream*, *Rapid Growth*, *Emerging*).
- **Popular Careers Directory**: Job openings index, entry/mid/senior salary breakdowns, and top hiring employers.
- **Demand Level Distribution**: Visualized market share distribution across high-growth and saturated career sectors.
- **5-Year Future Scope Radar**: Multi-axis radar analysis evaluating growth potential, AI automation resilience, remote flexibility, and entry accessibility.

### 2. 🎓 Faculty Mentorship Portal
- **Student Progress Tracker**: Monitor student readiness scores, CGPA, roadmap completion rates, and verified capstone portfolios.
- **Career Endorsements**: Faculty advisors can post official role recommendations and academic rationale.
- **Approvals Hub**: Review and approve student roadmap submissions, internship credit exemptions, and career track changes.
- **Structured Feedback & Rating**: Provide star ratings, evaluation comments, and actionable milestone goals.
- **Advisor Notes**: Maintain confidential or shared academic and placement guidance notes.

### 3. 🎯 AI Career Discovery & Roadmaps
- **Custom Milestone Generation**: Generates 9-month actionable career roadmaps tailored to student background, skills, and target roles.
- **Task Tracking**: Interactive checklist with recommended learning resources and resume bullet suggestions.

### 4. 🔬 Skill Gap Analysis Engine
- **Skill Delta Matrix**: Visual comparisons between current competencies and target role prerequisites.
- **Actionable Bridge Plans**: Targeted project ideas and learning modules to bridge skill gaps rapidly.

### 5. 📄 Resume Analyzer & 🎙️ Interactive Interview Prep
- **AI Resume Audit**: Scoring resume impact, keyword alignment, formatting, and industry fit.
- **AI Mock Technical Interviewer**: Question-and-answer simulation with instant scoring, feedback, and sample responses.

### 6. 🔐 Firebase Auth & Cloud Firestore
- Multi-user authentication (Google OAuth & Email/Password) with serverless Firestore database persistence.

---

## 🛠️ Tech Stack & Architecture

- **Frontend Framework**: React 18 with TypeScript & Vite
- **Styling**: Tailwind CSS with custom dark/neon gradient accents
- **Data Visualizations**: Recharts (Bar Charts, Area Trajectory, Pie Distributions, Radar Charts)
- **Icons**: Lucide React
- **Backend & APIs**: Express server with Vite middleware integration
- **AI Engine**: Google Gen AI SDK (`@google/genai`) using Gemini models
- **Database & Auth**: Firebase Firestore & Firebase Auth

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/career-compass-ai.git
   cd career-compass-ai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory (or update `.env.example`):
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key_here
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

---

## 📦 Building for Production

To build the application for deployment:

```bash
npm run build
```

To run the compiled CommonJS production bundle:

```bash
npm start
```

---

## 📤 How to Export to GitHub

To export or push this project to your GitHub account from AI Studio:

1. Click the **Settings (⚙️) / Options menu** at the top right corner of the AI Studio interface.
2. Select **Export to GitHub** (or **Export ZIP** to download locally).
3. Connect your GitHub account and specify your repository name to complete the export.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
