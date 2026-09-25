# 🧭 CareerCompass AI — AI-Powered Career Guidance & Mentorship Platform

**CareerCompass AI** is an AI-powered career guidance, skill assessment, job-market analytics, resume analysis, interview preparation, and faculty mentorship platform.

It combines **Google Gemini**, **React**, **TypeScript**, **Tailwind CSS**, **Express.js**, and **Firebase** to provide students with personalized career insights and actionable development plans, while providing faculty mentors with tools to monitor and guide student progress.

---

## ✨ Key Features

### 1. 📊 Job Market Analytics Dashboard

- **Top Hiring Skills**: Displays structured skill-demand percentages, year-over-year growth indicators, and salary premium information across AI, Cloud, Full-Stack, Security, and other technology areas.
- **Trending Technology Momentum**: Tracks technology trends across multiple years with adoption-level classifications such as *Mainstream*, *Rapid Growth*, and *Emerging*.
- **Popular Careers Directory**: Provides career information including job-opening indicators, entry/mid/senior salary information, hiring employers, and required skills.
- **Demand Level Distribution**: Visualizes the distribution of career-market demand across different sectors.
- **5-Year Future Scope Radar**: Multi-axis analysis covering growth potential, AI automation resilience, remote-work flexibility, and entry accessibility.
- **Interactive Visualizations**: Uses charts and visual analytics to make career and market information easier to understand.

> **Note:** The current job-market dashboard uses structured application datasets for analytics and visualization. It is not a direct real-time feed from external job portals.

### 2. 🎓 Faculty Mentorship Portal

- **Student Progress Tracker**: Allows faculty members to view student readiness, academic information, career goals, roadmap progress, projects, and skills.
- **Career Endorsements**: Faculty mentors can provide career recommendations and academic guidance.
- **Approvals & Guidance**: Supports roadmap reviews, career-track guidance, academic approvals, and internship-related guidance.
- **Structured Feedback & Evaluation**: Provides ratings, evaluation comments, milestone goals, and actionable feedback.
- **Advisor Notes**: Supports academic and career guidance notes for mentor-student interactions.
- **Role-Based Access**: Faculty access is protected using Firebase authentication and role-based authorization.

> **Note:** Some faculty and student information is seeded/sample data intended for application demonstration.

### 3. 🎯 AI Career Assessment & Discovery

- **Interactive Career Assessment**: Collects information about student skills, interests, academic background, projects, experience, career preferences, and goals.
- **AI Career Recommendations**: Generates personalized career recommendations based on the student's profile.
- **Career Match Analysis**: Provides career match scores and supporting factors.
- **Career Insights**: Explains why specific career paths may be relevant to the student's profile.
- **Development Recommendations**: Identifies skills and areas that students can improve.

### 4. 🗺️ Personalized Career Roadmap

- **AI Roadmap Generation**: Generates personalized career-development roadmaps based on the student's profile and target career.
- **Milestone-Based Planning**: Breaks career preparation into structured milestones.
- **Task Tracking**: Provides actionable learning and development tasks.
- **Learning Resources**: Recommends resources relevant to the student's career path.
- **Project Recommendations**: Suggests projects that can help students develop required skills.
- **Resume Bullet Suggestions**: Provides suggestions for converting project work into stronger resume points.
- **Progress Tracking**: Allows students to monitor their roadmap development.

### 5. 🔬 Skill Gap Analysis Engine

- **Skill Delta Analysis**: Compares the student's current skills with skills required for a target career.
- **Current Skill Identification**: Identifies skills already possessed by the student.
- **Required Skill Identification**: Determines skills associated with the selected career.
- **Gap Detection**: Highlights missing or underdeveloped skills.
- **Actionable Bridge Plans**: Recommends learning activities, projects, and development tasks to address identified gaps.
- **Career-Specific Guidance**: Connects skill gaps directly with the student's target career.

### 6. 📄 AI Resume Analyzer

- **AI Resume Audit**: Analyzes resume content and provides an overall resume score.
- **ATS Analysis**: Provides an ATS-oriented score and keyword analysis.
- **Resume Strengths**: Identifies strong areas of the resume.
- **Improvement Suggestions**: Highlights areas that can be improved.
- **Skills Analysis**: Extracts and analyzes technical skills, frameworks, and tools.
- **Industry Alignment**: Evaluates the relevance of resume content to the target career.
- **PDF Resume Upload**: Supports PDF resume processing through the backend.
- **Resume Bullet Enhancement**: Generates improved versions of resume bullet points.

### 7. 🎙️ AI Mock Interview

- **Technical Interview Simulation**: Provides an interactive technical interview experience.
- **Question & Answer Interaction**: Students can answer AI-generated interview questions.
- **Response Evaluation**: Evaluates student responses.
- **Performance Scoring**: Provides scores based on interview performance.
- **Instant Feedback**: Identifies strengths and areas for improvement.
- **Sample Responses**: Provides improved or sample answers for learning.
- **Interview Preparation**: Helps students practice before technical interviews.

### 8. 🤖 Google Gemini AI Integration

- **Google Gen AI SDK**: Uses the `@google/genai` SDK for AI functionality.
- **AI Career Recommendations**: Generates personalized career insights.
- **AI Roadmap Generation**: Produces career-development plans.
- **AI Skill Analysis**: Supports skill-gap analysis.
- **AI Resume Analysis**: Processes resume information and generates feedback.
- **AI Interview Assistance**: Supports interactive interview preparation.
- **Server-Side API Integration**: Gemini API access is handled through the backend.

### 9. 🔐 Firebase Authentication

- **Email & Password Authentication**
- **Google OAuth Authentication**
- **Email Verification**
- **Password Reset**
- **Persistent Authentication Sessions**
- **Role-Aware Authentication**
- **Firebase ID Token Verification**

### 10. 🗄️ Cloud Firestore

- **User Profile Storage**
- **Career Assessment Data**
- **Career Strategies**
- **Roadmap Information**
- **Student Information**
- **Faculty Information**
- **Application-Specific Records**
- **Persistent Cloud Data Storage**

### 11. 🛡️ Role-Based Security

- **Firebase ID Token Verification**
- **Firebase Custom Claims**
- **Backend Authorization Middleware**
- **Faculty Role Verification**
- **Protected API Routes**
- **Request Validation**
- **Rate Limiting**
- **Payload Size Restrictions**

---

## 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │       STUDENT        │
                    └──────────┬───────────┘
                               │
                               ▼
              ┌─────────────────────────────┐
              │   React + TypeScript + Vite │
              │          FRONTEND           │
              │                             │
              │ • Career Assessment         │
              │ • Recommendations            │
              │ • Career Roadmap             │
              │ • Skill Gap Analysis         │
              │ • Resume Analyzer            │
              │ • Interview Preparation     │
              │ • Job Market Dashboard      │
              └──────────────┬──────────────┘
                             │
                             ▼
                  ┌────────────────────┐
                  │    Express.js      │
                  │    BACKEND API     │
                  └─────────┬──────────┘
                            │
                 ┌──────────┴──────────┐
                 │                     │
                 ▼                     ▼
        ┌─────────────────┐   ┌─────────────────┐
        │   Google Gemini │   │    Firebase     │
        │    AI Engine    │   │                 │
        │                 │   │ • Authentication│
        │ • Recommendations│  │ • Firestore     │
        │ • Roadmaps      │   │ • Custom Claims │
        │ • Resume        │   │                 │
        │ • Interview     │   └─────────────────┘
        └─────────────────┘
```

---

#### 🚀 Getting Started

#### 📌 Prerequisites

- **Node.js** v18.x or higher
- **npm** v9.x or higher

### 📥 Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/JosnaJose7/CareerCompass-AI.git
cd CareerCompass-AI
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

> ⚠️ **Security Warning:** Never commit private API keys, passwords, or service-account credentials to GitHub.

#### 4. Start the Development Server

```bash
npm run dev
```

Open the local development URL provided by Vite in your browser.

---

## 📦 Production Build

### 🔨 Build the Application

```bash
npm run build
```

### ▶️ Start the Production Server

```bash
npm start
```

---

## 🔒 Security

CareerCompass AI implements multiple security mechanisms to protect application data and API access:

- 🔐 **Firebase Authentication**
- 🪪 **Firebase ID Token Verification**
- 🛡️ **Firebase Custom Claims**
- 👤 **Backend Authorization Middleware**
- ✅ **API Request Validation**
- 🚦 **AI API Rate Limiting**
- 📦 **Restricted Request Payload Sizes**
- 🤖 **Server-Side Gemini API Access**
- 🔑 **Environment-Based Secret Configuration**

---

## 🎯 Project Objectives

- 🎓 Help students identify suitable career paths.
- 🔬 Identify skill gaps between students and target careers.
- 🗺️ Generate personalized career-development roadmaps.
- 📄 Improve resume quality using AI-assisted analysis.
- 🎙️ Provide interactive technical interview preparation.
- 📊 Visualize structured job-market and technology trends.
- 👨‍🏫 Enable faculty members to monitor and mentor students.
- 📈 Connect academic progress with career readiness.
- 🤖 Use AI to provide personalized career-development guidance.

---

## 🔮 Future Enhancements

- 🌐 Integration with live job-market APIs
- 💼 Real-time job listings
- 🎯 Automated job matching
- 📡 Integration with external labor-market datasets
- 📊 Advanced faculty analytics
- 📄 Deeper resume-to-job matching
- 🎙️ Advanced interview evaluation
- 📚 Personalized learning-resource recommendations
- 🔔 Notifications and reminders
- 📈 Advanced career trend analysis

---

## 📜 License

This project is licensed under the **MIT License**.

See the [`LICENSE`](LICENSE) file for more information.

---

## 👩‍💻 Author

**Josna Jose**

**CareerCompass AI**

B.Tech — Computer Science & Engineering  
Artificial Intelligence & Machine Learning
