import React, { useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  auth, 
  firebaseSignOut, 
  db, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  FirebaseUser 
} from './lib/firebase';
import { 
  StudentProfile, 
  CareerRecommendation, 
  CareerRoadmap, 
  ResumeAnalysisResult, 
  InterviewQuestion, 
  AnswerEvaluation, 
  ChatMessage, 
  SavedCareerItem,
  SkillGapAnalysisResult
} from './types';
import { sampleProfiles } from './data/sampleProfiles';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { ProfileBuilder } from './components/ProfileBuilder';
import { CareerRecommendations } from './components/CareerRecommendations';
import { RoadmapView } from './components/RoadmapView';
import { ResumeAnalyzer } from './components/ResumeAnalyzer';
import { InterviewPrep } from './components/InterviewPrep';
import { AdvisorChat } from './components/AdvisorChat';
import { SavedCareersView } from './components/SavedCareersView';
import { SkillGapAnalysis } from './components/SkillGapAnalysis';
import { CareerExplorer } from './components/CareerExplorer';
import { JobMarketDashboard } from './components/JobMarketDashboard';
import { FacultyDashboard } from './components/FacultyDashboard';

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('discover');

  // Initial Student Profile
  const [profile, setProfile] = useState<StudentProfile>({
    userId: 'guest',
    university: 'Stanford University',
    major: 'Computer Science',
    gradYear: '2026',
    gpa: '3.8',
    skills: ['Python', 'TypeScript', 'React', 'Node.js', 'SQL', 'Git', 'Data Structures'],
    interests: ['Artificial Intelligence', 'Full-Stack Development', 'Cloud Computing', 'Tech Startups'],
    certifications: ['AWS Certified Developer Associate'],
    projects: [
      {
        id: 'p1',
        title: 'AI Code Assistant Chrome Extension',
        description: 'Built a browser extension using Gemini API that explains complex code snippets and generates unit tests.',
        technologies: ['TypeScript', 'React', 'Gemini API', 'Tailwind CSS']
      }
    ],
    workPreference: 'Hybrid',
    targetIndustries: ['Technology', 'AI & Machine Learning'],
    careerGoals: 'Land a Software Engineer or AI Systems Developer role at a top technology company or high-growth startup after graduation.'
  });

  // App Data States
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [roadmap, setRoadmap] = useState<CareerRoadmap | null>(null);
  const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysisResult | null>(null);
  const [interviewQuestions, setInterviewQuestions] = useState<InterviewQuestion[]>([]);
  const [interviewEvaluation, setInterviewEvaluation] = useState<AnswerEvaluation | null>(null);
  const [targetInterviewRole, setTargetInterviewRole] = useState('Full-Stack Software Engineer');
  const [skillGapAnalysis, setSkillGapAnalysis] = useState<SkillGapAnalysisResult | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('careercompass_chat_messages');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse saved chat messages:', e);
    }
    return [
      {
        id: 'm0',
        sender: 'ai',
        text: "Hello! I'm Compass AI, your personal AI Career Mentor. Ask me: 'Which career suits me?', 'How to get into Google?', 'Should I learn AWS?', 'Explain DSA.', or 'Review my roadmap.'!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });
  const [savedCareers, setSavedCareers] = useState<SavedCareerItem[]>([]);
  const [savedRoadmaps, setSavedRoadmaps] = useState<CareerRoadmap[]>([]);

  // Loading States
  const [isGeneratingRecs, setIsGeneratingRecs] = useState(false);
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [isAnalyzingResume, setIsAnalyzingResume] = useState(false);
  const [isGeneratingInterview, setIsGeneratingInterview] = useState(false);
  const [isEvaluatingInterview, setIsEvaluatingInterview] = useState(false);
  const [isAnalyzingSkillGap, setIsAnalyzingSkillGap] = useState(false);
  const [isChatThinking, setIsChatThinking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Listen for Auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setProfile(prev => ({ ...prev, userId: currentUser.uid }));
        // Load user data from Firestore
        loadUserDataFromFirestore(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const [showProfileBanner, setShowProfileBanner] = useState(false);

  // Fetch Firestore Data for Authenticated User
  const loadUserDataFromFirestore = async (uid: string) => {
    try {
      // 1. Fetch Profile
      const profileRef = doc(db, 'profiles', uid);
      const profileSnap = await getDoc(profileRef);
      if (profileSnap.exists()) {
        setProfile(profileSnap.data() as StudentProfile);
        setShowProfileBanner(false);
      } else {
        // First login! Prompt profile creation
        setShowProfileBanner(true);
      }

      // 2. Fetch Saved Careers
      const careersQ = query(collection(db, 'savedCareers'), where('userId', '==', uid));
      const careersSnap = await getDocs(careersQ);
      const fetchedCareers: SavedCareerItem[] = [];
      careersSnap.forEach(d => {
        fetchedCareers.push({ id: d.id, ...d.data() } as SavedCareerItem);
      });
      setSavedCareers(fetchedCareers);

      // 3. Fetch Saved Roadmaps
      const roadmapsQ = query(collection(db, 'roadmaps'), where('userId', '==', uid));
      const roadmapsSnap = await getDocs(roadmapsQ);
      const fetchedRoadmaps: CareerRoadmap[] = [];
      roadmapsSnap.forEach(d => {
        fetchedRoadmaps.push({ id: d.id, ...d.data() } as CareerRoadmap);
      });
      setSavedRoadmaps(fetchedRoadmaps);

      // 4. Fetch Saved Chat History
      const chatRef = doc(db, 'chatHistory', uid);
      const chatSnap = await getDoc(chatRef);
      if (chatSnap.exists()) {
        const chatData = chatSnap.data();
        if (chatData?.messages && Array.isArray(chatData.messages) && chatData.messages.length > 0) {
          setChatMessages(chatData.messages);
          localStorage.setItem('careercompass_chat_messages', JSON.stringify(chatData.messages));
        }
      }
    } catch (err) {
      console.error('Error loading Firestore user data:', err);
    }
  };

  // Initial Auto-Generate Recommendations on mount
  useEffect(() => {
    if (recommendations.length === 0) {
      handleGenerateRecommendations();
    }
    if (!skillGapAnalysis) {
      handleAnalyzeSkillGap(profile.dreamRole || 'Full-Stack Software Engineer');
    }
  }, []);

  // 1. Generate Career Recommendations
  const handleGenerateRecommendations = async () => {
    try {
      setIsGeneratingRecs(true);
      const res = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      const data = await res.json();
      if (data.recommendations) {
        setRecommendations(data.recommendations);
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    } finally {
      setIsGeneratingRecs(false);
    }
  };

  // Skill Gap Analysis Handler
  const handleAnalyzeSkillGap = async (targetRole: string) => {
    try {
      setIsAnalyzingSkillGap(true);
      const res = await fetch('/api/skill-gap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetRole, profile })
      });
      const data = await res.json();
      setSkillGapAnalysis(data);
    } catch (err) {
      console.error('Error analyzing skill gap:', err);
    } finally {
      setIsAnalyzingSkillGap(false);
    }
  };

  // 2. Generate Career Roadmap for Target Role
  const handleGenerateRoadmap = async (roleTitle: string) => {
    try {
      setIsGeneratingRoadmap(true);
      setActiveTab('roadmap');
      const res = await fetch('/api/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, targetRole: roleTitle })
      });
      const data = await res.json();
      setRoadmap(data);
    } catch (err) {
      console.error('Error generating roadmap:', err);
    } finally {
      setIsGeneratingRoadmap(false);
    }
  };

  // 3. Analyze Resume
  const handleAnalyzeResume = async (resumeText: string, targetRole: string, pdfBase64?: string) => {
    try {
      setIsAnalyzingResume(true);
      const res = await fetch('/api/resume-analyzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, targetRole, pdfBase64 })
      });
      const data = await res.json();
      setResumeAnalysis(data);
    } catch (err) {
      console.error('Error analyzing resume:', err);
    } finally {
      setIsAnalyzingResume(false);
    }
  };

  // 4. Generate Interview Questions
  const handleGenerateInterview = async (roleTitle: string) => {
    try {
      setIsGeneratingInterview(true);
      setTargetInterviewRole(roleTitle);
      const res = await fetch('/api/interview-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetRole: roleTitle })
      });
      const data = await res.json();
      if (data.questions) {
        setInterviewQuestions(data.questions);
      }
    } catch (err) {
      console.error('Error generating interview questions:', err);
    } finally {
      setIsGeneratingInterview(false);
    }
  };

  // 5. Evaluate Interview Answer
  const handleEvaluateAnswer = async (question: string, userAnswer: string, roleTitle: string, category?: string) => {
    try {
      setIsEvaluatingInterview(true);
      const res = await fetch('/api/evaluate-interview-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, userAnswer, targetRole: roleTitle, category })
      });
      const data = await res.json();
      setInterviewEvaluation(data);
    } catch (err) {
      console.error('Error evaluating answer:', err);
    } finally {
      setIsEvaluatingInterview(false);
    }
  };

  // 6. Chat with AI Mentor (with persistence)
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...chatMessages, userMsg];
    setChatMessages(newHistory);
    try {
      localStorage.setItem('careercompass_chat_messages', JSON.stringify(newHistory));
    } catch (e) {
      console.error('Failed to save chat to localStorage:', e);
    }
    setIsChatThinking(true);

    try {
      const res = await fetch('/api/chat-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory,
          profile,
          roadmap,
          skillGap: skillGapAnalysis
        })
      });
      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.reply || "I'm here to help guide your career path!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const updatedHistory = [...newHistory, aiMsg];
      setChatMessages(updatedHistory);
      try {
        localStorage.setItem('careercompass_chat_messages', JSON.stringify(updatedHistory));
      } catch (e) {
        console.error('Failed to save chat to localStorage:', e);
      }

      // Persist to Firestore if user is logged in
      if (user) {
        try {
          await setDoc(doc(db, 'chatHistory', user.uid), {
            userId: user.uid,
            messages: updatedHistory,
            updatedAt: new Date().toISOString()
          });
        } catch (e) {
          console.error('Error persisting chat history to Firestore:', e);
        }
      }
    } catch (err) {
      console.error('Error sending chat message:', err);
    } finally {
      setIsChatThinking(false);
    }
  };

  // Clear Chat History
  const handleClearChatHistory = async () => {
    const initialMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'ai',
      text: "Hello! I'm Compass AI, your personal AI Career Mentor. Ask me: 'Which career suits me?', 'How to get into Google?', 'Should I learn AWS?', 'Explain DSA.', or 'Review my roadmap.'!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages([initialMsg]);
    try {
      localStorage.removeItem('careercompass_chat_messages');
    } catch (e) {
      console.error('Error removing chat from localStorage:', e);
    }
    if (user) {
      try {
        await deleteDoc(doc(db, 'chatHistory', user.uid));
      } catch (e) {
        console.error('Error deleting chat history from Firestore:', e);
      }
    }
  };

  // 7. Save Profile to Firestore
  const handleSaveProfile = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    try {
      setIsSaving(true);
      await setDoc(doc(db, 'profiles', user.uid), {
        ...profile,
        userId: user.uid,
        updatedAt: new Date().toISOString()
      });
      setShowProfileBanner(false);
      alert('Profile successfully created & saved to your account!');
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('Failed to save profile. Check Firestore connection.');
    } finally {
      setIsSaving(false);
    }
  };

  // 8. Save Roadmap to Firestore
  const handleSaveRoadmap = async () => {
    if (!roadmap) return;
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    try {
      setIsSaving(true);
      const docRef = await addDoc(collection(db, 'roadmaps'), {
        ...roadmap,
        userId: user.uid,
        createdAt: new Date().toISOString()
      });
      const savedItem = { ...roadmap, id: docRef.id, userId: user.uid };
      setSavedRoadmaps(prev => [...prev, savedItem]);
      alert(`Roadmap for "${roadmap.roleTitle}" saved to your Firebase account!`);
    } catch (err) {
      console.error('Error saving roadmap:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // 9. Save Career Recommendation
  const handleSaveCareer = async (career: CareerRecommendation) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    const exists = savedCareers.some(c => c.title === career.title);
    if (exists) return;

    try {
      const newSaved: SavedCareerItem = {
        userId: user.uid,
        title: career.title,
        matchScore: career.matchScore,
        salary: career.salaryRange.entry,
        growth: career.demandGrowth,
        skillsGapCount: career.skillsGap.length,
        reasoning: career.shortSummary,
        savedAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'savedCareers'), newSaved);
      newSaved.id = docRef.id;
      setSavedCareers(prev => [...prev, newSaved]);
    } catch (err) {
      console.error('Error saving career:', err);
    }
  };

  // 10. Remove Saved Career
  const handleRemoveSavedCareer = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'savedCareers', id));
      setSavedCareers(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Error deleting saved career:', err);
    }
  };

  // 11. Update Roadmap Task Completion
  const handleUpdateMilestoneTask = (milestoneId: string, taskIndex: number, completed: boolean) => {
    if (!roadmap) return;
    const updatedMilestones = roadmap.milestones.map(m => {
      if (m.id === milestoneId) {
        return { ...m, completed: completed };
      }
      return m;
    });
    setRoadmap({ ...roadmap, milestones: updatedMilestones });
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-[#080910] text-slate-100 selection:bg-blue-500 selection:text-white' 
        : 'bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white'
    }`}>
      
      {/* Elegant Dark Background Ambient Radial Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-50">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[160px]" />
        <div className="absolute top-1/3 -right-40 w-[700px] h-[700px] bg-purple-900/10 rounded-full blur-[180px]" />
        <div className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[160px]" />
      </div>

      {/* Main App Content Wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onSignOut={() => firebaseSignOut(auth)}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          savedCount={savedCareers.length + savedRoadmaps.length}
        />

        {/* First Login Profile Creation Banner */}
        {user && showProfileBanner && (
          <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-purple-900/40 border-b border-blue-500/30 px-4 py-3">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <p className="text-slate-200">
                  <span className="font-bold text-white">Welcome! Complete your Profile:</span> Setup your university degree, skills, and projects so Gemini AI can personalize your career discovery.
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveTab('profile');
                }}
                className="px-4 py-1.5 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:brightness-110 transition-all shrink-0"
              >
                Setup Student Profile →
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Body Views */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          
          {activeTab === 'discover' && (
            <CareerRecommendations
              recommendations={recommendations}
              onSelectRoleForRoadmap={handleGenerateRoadmap}
              onSaveCareer={handleSaveCareer}
              savedTitles={savedCareers.map(c => c.title)}
              isGenerating={isGeneratingRecs}
              onGoToProfile={() => setActiveTab('profile')}
            />
          )}

          {activeTab === 'explorer' && (
            <CareerExplorer
              onSelectRoleForRoadmap={handleGenerateRoadmap}
              onSelectRoleForSkillGap={(roleTitle) => {
                setActiveTab('skillgap');
                handleAnalyzeSkillGap(roleTitle);
              }}
              onSaveCareer={(item) => {
                if (user) {
                  handleSaveCareer({
                    id: Date.now().toString(),
                    title: item.title,
                    matchScore: 90,
                    shortSummary: item.reasoning,
                    dayInLife: '',
                    salaryRange: { entry: item.salary, mid: item.salary },
                    demandGrowth: item.growth,
                    futureDemand: '',
                    reason: item.reasoning,
                    strengths: [],
                    weaknesses: [],
                    missingSkills: [],
                    keyResponsibilities: [],
                    matchingSkills: [],
                    skillsGap: [],
                    aiReasoning: '',
                    topEmployers: []
                  });
                } else {
                  setIsAuthModalOpen(true);
                }
              }}
              savedCareers={savedCareers}
            />
          )}

          {activeTab === 'jobmarket' && (
            <JobMarketDashboard
              onSelectRoleForRoadmap={(roleTitle) => {
                setActiveTab('roadmap');
                handleGenerateRoadmap(roleTitle);
              }}
              onExploreSkillGap={(roleTitle) => {
                setActiveTab('skillgap');
                handleAnalyzeSkillGap(roleTitle);
              }}
            />
          )}

          {activeTab === 'faculty' && (
            <FacultyDashboard
              onNavigateToRoadmap={(roleTitle) => {
                setActiveTab('roadmap');
                handleGenerateRoadmap(roleTitle);
              }}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileBuilder
              profile={profile}
              setProfile={setProfile}
              onSaveProfile={handleSaveProfile}
              onGenerateRecommendations={() => {
                setActiveTab('discover');
                handleGenerateRecommendations();
              }}
              isSaving={isSaving}
              isGenerating={isGeneratingRecs}
            />
          )}

          {activeTab === 'skillgap' && (
            <SkillGapAnalysis
              analysis={skillGapAnalysis}
              onAnalyze={handleAnalyzeSkillGap}
              isAnalyzing={isAnalyzingSkillGap}
              profile={profile}
            />
          )}

          {activeTab === 'roadmap' && (
            <RoadmapView
              roadmap={roadmap}
              setRoadmap={setRoadmap}
              onUpdateMilestoneTask={handleUpdateMilestoneTask}
              onSaveRoadmap={handleSaveRoadmap}
              isSaving={isSaving}
              onGenerateRoadmapForRole={handleGenerateRoadmap}
              isGenerating={isGeneratingRoadmap}
            />
          )}

          {activeTab === 'resume' && (
            <ResumeAnalyzer
              onAnalyze={handleAnalyzeResume}
              analysis={resumeAnalysis}
              isAnalyzing={isAnalyzingResume}
            />
          )}

          {activeTab === 'interview' && (
            <InterviewPrep
              onGenerateQuestions={handleGenerateInterview}
              onEvaluateAnswer={handleEvaluateAnswer}
              questions={interviewQuestions}
              evaluation={interviewEvaluation}
              isGenerating={isGeneratingInterview}
              isEvaluating={isEvaluatingInterview}
              targetRole={targetInterviewRole}
              setTargetRole={setTargetInterviewRole}
            />
          )}

          {activeTab === 'advisor' && (
            <AdvisorChat
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              onClearHistory={handleClearChatHistory}
              isThinking={isChatThinking}
              profile={profile}
              roadmap={roadmap}
            />
          )}

          {activeTab === 'saved' && (
            <SavedCareersView
              savedCareers={savedCareers}
              savedRoadmaps={savedRoadmaps}
              onRemoveSavedCareer={handleRemoveSavedCareer}
              onSelectRoadmap={(rm) => {
                setRoadmap(rm);
                setActiveTab('roadmap');
              }}
              onSelectRoleForRoadmap={handleGenerateRoadmap}
              user={user}
              onOpenAuth={() => setIsAuthModalOpen(true)}
            />
          )}

        </main>

        {/* Footer */}
        <footer className={`mt-auto border-t py-6 transition-colors duration-300 ${
          isDarkMode ? 'bg-[#080910]/90 border-slate-800/60 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
        }`}>
          <div className="max-w-7xl mx-auto px-4 text-center text-xs space-y-1">
            <p className="font-semibold text-slate-300">
              CareerCompass AI &copy; {new Date().getFullYear()} — Powered by Gemini AI & Firebase Firestore
            </p>
            <p className="text-[11px] text-slate-500">
              Tailored career discovery, skill matrix roadmaps, and recruiter resume feedback for university students.
            </p>
          </div>
        </footer>

      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(isNew) => {
          if (isNew) {
            setActiveTab('profile');
            setShowProfileBanner(true);
          }
        }}
      />

    </div>
  );
}
