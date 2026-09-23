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
  FirebaseUser,
  getUserAuthRole
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
  SkillGapAnalysisResult,
  UserAuthRole
} from './types';
import { fetchWithAuth } from './lib/api';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { ProfileBuilder } from './components/ProfileBuilder';
import { CareerRecommendations } from './components/CareerRecommendations';
import { CareerAssessment } from './components/CareerAssessment';
import { CareerExplorer } from './components/CareerExplorer';
import { RoadmapView } from './components/RoadmapView';
import { ResumeAnalyzer } from './components/ResumeAnalyzer';
import { InterviewPrep } from './components/InterviewPrep';
import { SkillGapAnalysis } from './components/SkillGapAnalysis';
import { JobMarketDashboard } from './components/JobMarketDashboard';
import { ScenarioSimulator } from './components/ScenarioSimulator';
import { AdvisorChat } from './components/AdvisorChat';
import { SavedCareersView } from './components/SavedCareersView';
import { FacultyDashboard } from './components/FacultyDashboard';
import { ProfileView } from './components/ProfileView';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AmbientThemeBackground } from './components/AmbientThemeBackground';
import { ThemeSelectorModal } from './components/ThemeSelectorModal';
import { ProfileExperienceModal } from './components/ProfileExperienceModal';
import { SettingsModal } from './components/SettingsModal';
import { AppThemeId, ProfileExperienceId } from './themes/types';
import { INITIAL_CAREER_RECOMMENDATIONS } from './data/defaultRecommendations';
import { Sparkles, MessageSquare, X } from 'lucide-react';

function AppContent() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isProfileEditorModalOpen, setIsProfileEditorModalOpen] = useState(false);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('discover');
  const [navigationHistory, setNavigationHistory] = useState<string[]>(['discover']);

  const navigateTo = (tab: string) => {
    if (tab === activeTab) return;
    setNavigationHistory(prev => {
      if (prev[prev.length - 1] === tab) return prev;
      return [...prev, tab];
    });
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    setNavigationHistory(prev => {
      if (prev.length > 1) {
        const nextHist = [...prev];
        nextHist.pop();
        const prevTab = nextHist[nextHist.length - 1] || 'discover';
        setActiveTab(prevTab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return nextHist;
      } else {
        setActiveTab('discover');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return ['discover'];
      }
    });
  };

  const { 
    appThemeId,
    profileExperienceId,
    isDarkMode, 
    setIsDarkMode, 
    isAppThemeModalOpen, 
    openAppThemeModal, 
    closeAppThemeModal,
    isProfileExperienceModalOpen,
    openProfileExperienceModal,
    closeProfileExperienceModal,
    syncFromProfile 
  } = useTheme();

  // Initial Student Profile
  const [profile, setProfile] = useState<StudentProfile>({
    userId: 'guest',
    university: 'Stanford University',
    major: 'Computer Science',
    gradYear: '2026',
    gpa: '3.8',
    dreamRole: 'AI / Machine Learning Engineer',
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
    careerGoals: 'Land a Software Engineer or AI Systems Developer role at a top technology company or high-growth startup after graduation.',
    appTheme: 'professional',
    profileExperience: 'professional',
    experienceTheme: 'professional'
  });

  // App Data States
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>(INITIAL_CAREER_RECOMMENDATIONS);
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
        text: "Hello! I'm CareerCompass AI. Ask me anything about your career path, resume bullets, or next steps!",
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
  const [userRole, setUserRole] = useState<UserAuthRole | null>(null);

  // Refresh user role custom claims or directory status
  const refreshUserRole = async () => {
    if (user) {
      const updated = await getUserAuthRole(user, true);
      setUserRole(updated);
    }
  };

  // Listen for Auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setProfile(prev => ({ ...prev, userId: currentUser.uid }));
        loadUserDataFromFirestore(currentUser.uid);
        const resolvedRole = await getUserAuthRole(currentUser);
        setUserRole(resolvedRole);
      } else {
        setUserRole({
          uid: 'guest',
          email: null,
          role: 'student',
          isFaculty: false,
          isAdmin: false,
          emailVerified: false,
          customClaimsSource: 'guest_student'
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const [showProfileBanner, setShowProfileBanner] = useState(false);

  // Fetch Firestore Data for Authenticated User
  const loadUserDataFromFirestore = async (uid: string) => {
    try {
      // 1. Profile
      const profileRef = doc(db, 'profiles', uid);
      const profileSnap = await getDoc(profileRef);
      if (profileSnap.exists()) {
        const profileData = profileSnap.data() as StudentProfile;
        setProfile(profileData);
        syncFromProfile(profileData.appTheme, profileData.profileExperience, profileData.experienceTheme);
        setShowProfileBanner(false);
      } else {
        setShowProfileBanner(true);
      }

      // 2. Saved Careers
      const careersQ = query(collection(db, 'savedCareers'), where('userId', '==', uid));
      const careersSnap = await getDocs(careersQ);
      const fetchedCareers: SavedCareerItem[] = [];
      careersSnap.forEach(d => {
        fetchedCareers.push({ id: d.id, ...d.data() } as SavedCareerItem);
      });
      setSavedCareers(fetchedCareers);

      // 3. Saved Roadmaps
      const roadmapsQ = query(collection(db, 'roadmaps'), where('userId', '==', uid));
      const roadmapsSnap = await getDocs(roadmapsQ);
      const fetchedRoadmaps: CareerRoadmap[] = [];
      roadmapsSnap.forEach(d => {
        fetchedRoadmaps.push({ id: d.id, ...d.data() } as CareerRoadmap);
      });
      setSavedRoadmaps(fetchedRoadmaps);

      // 4. Chat History
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

  // Sync App Theme change to Firestore
  const handleAppThemeSavedToProfile = async (newAppTheme: AppThemeId) => {
    setProfile(prev => ({ ...prev, appTheme: newAppTheme }));
    if (user) {
      try {
        await setDoc(doc(db, 'profiles', user.uid), {
          appTheme: newAppTheme
        }, { merge: true });
      } catch (e) {
        console.warn('Failed to sync app theme preference to Firestore:', e);
      }
    }
  };

  // Sync Profile Experience change to Firestore
  const handleProfileExperienceSavedToProfile = async (newProfileExp: ProfileExperienceId) => {
    setProfile(prev => ({ 
      ...prev, 
      profileExperience: newProfileExp,
      experienceTheme: newProfileExp 
    }));
    if (user) {
      try {
        await setDoc(doc(db, 'profiles', user.uid), {
          profileExperience: newProfileExp,
          experienceTheme: newProfileExp
        }, { merge: true });
      } catch (e) {
        console.warn('Failed to sync profile experience to Firestore:', e);
      }
    }
  };

  // Initial Auto-Generate Recommendations on mount
  useEffect(() => {
    if (recommendations.length === 0) {
      handleGenerateRecommendations();
    }
    if (!skillGapAnalysis) {
      handleAnalyzeSkillGap(profile.dreamRole || 'AI / Machine Learning Engineer');
    }
  }, []);

  // 1. Generate Career Recommendations
  const handleGenerateRecommendations = async () => {
    try {
      setIsGeneratingRecs(true);
      const res = await fetchWithAuth('/api/recommendations', {
        method: 'POST',
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

  // 2. Skill Gap Analysis
  const handleAnalyzeSkillGap = async (targetRole: string) => {
    try {
      setIsAnalyzingSkillGap(true);
      const res = await fetchWithAuth('/api/skill-gap', {
        method: 'POST',
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

  // 3. Generate Career Roadmap
  const handleGenerateRoadmap = async (roleTitle: string) => {
    try {
      setIsGeneratingRoadmap(true);
      navigateTo('roadmap');
      const res = await fetchWithAuth('/api/roadmap', {
        method: 'POST',
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

  // 4. Analyze Resume
  const handleAnalyzeResume = async (resumeText: string, targetRole: string, pdfBase64?: string) => {
    try {
      setIsAnalyzingResume(true);
      const res = await fetchWithAuth('/api/resume-analyzer', {
        method: 'POST',
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

  // 5. Generate Interview Questions
  const handleGenerateInterview = async (roleTitle: string, roundType: string = 'Full-Round') => {
    try {
      setIsGeneratingInterview(true);
      const res = await fetchWithAuth('/api/interview/questions', {
        method: 'POST',
        body: JSON.stringify({ roleTitle, roundType })
      });
      const data = await res.json();
      if (data.questions) {
        setInterviewQuestions(data.questions);
        setInterviewEvaluation(null);
      }
    } catch (err) {
      console.error('Error generating interview questions:', err);
    } finally {
      setIsGeneratingInterview(false);
    }
  };

  // 6. Evaluate Interview Answer
  const handleEvaluateAnswer = async (question: any, answer: string, role?: string, category?: string) => {
    try {
      setIsEvaluatingInterview(true);
      const questionText = typeof question === 'object' ? question?.question : question;
      const questionCategory = category || (typeof question === 'object' ? question?.category : 'Technical');
      const res = await fetchWithAuth('/api/interview/evaluate', {
        method: 'POST',
        body: JSON.stringify({ 
          question: questionText, 
          userAnswer: answer,
          answer, 
          targetRole: role || targetInterviewRole || 'Software Engineer',
          category: questionCategory
        })
      });
      const data = await res.json();
      setInterviewEvaluation(data);
    } catch (err) {
      console.error('Error evaluating interview answer:', err);
    } finally {
      setIsEvaluatingInterview(false);
    }
  };

  // 7. Advisor Chat
  const handleSendMessage = async (userText: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const updatedMessages = [...chatMessages, userMsg];
    setChatMessages(updatedMessages);
    setIsChatThinking(true);

    try {
      const res = await fetchWithAuth('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: userText,
          history: updatedMessages,
          profile,
          roadmap
        })
      });
      const data = await res.json();
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.reply || "I'm here to help navigate your university career journey!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      const updatedHistory = [...updatedMessages, aiMsg];
      setChatMessages(updatedHistory);
      try {
        localStorage.setItem('careercompass_chat_messages', JSON.stringify(updatedHistory));
      } catch (e) {
        console.error('Failed to save chat to localStorage:', e);
      }

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

  const handleClearChatHistory = async () => {
    const initialMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'ai',
      text: "Hello! I'm CareerCompass AI. Ask me anything about your career path, resume bullets, or next steps!",
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

  // 8. Save Profile
  const handleSaveProfile = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    try {
      setIsSaving(true);
      await setDoc(doc(db, 'profiles', user.uid), {
        ...profile,
        appTheme: appThemeId,
        profileExperience: profileExperienceId,
        experienceTheme: profileExperienceId,
        userId: user.uid,
        updatedAt: new Date().toISOString()
      });
      setShowProfileBanner(false);
      setIsProfileEditorModalOpen(false);
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // 9. Save Career
  const handleSaveCareer = async (career: CareerRecommendation) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    try {
      const isAlreadySaved = savedCareers.some(c => c.title === career.title);
      if (isAlreadySaved) {
        const itemToDelete = savedCareers.find(c => c.title === career.title);
        if (itemToDelete?.id) {
          await deleteDoc(doc(db, 'savedCareers', itemToDelete.id));
          setSavedCareers(prev => prev.filter(c => c.id !== itemToDelete.id));
        }
        return;
      }
      const newItem: SavedCareerItem = {
        title: career.title,
        salary: career.salaryRange ? `${career.salaryRange.entry} - ${career.salaryRange.mid}` : '$110,000',
        growth: career.demandGrowth || 'High',
        matchScore: career.matchScore || 90,
        skillsGapCount: career.missingSkills?.length || 2,
        reasoning: career.shortSummary || career.reason || '',
        savedAt: new Date().toISOString(),
        userId: user.uid
      };
      const docRef = await addDoc(collection(db, 'savedCareers'), newItem);
      setSavedCareers(prev => [{ id: docRef.id, ...newItem }, ...prev]);
    } catch (err) {
      console.error('Error saving career:', err);
    }
  };

  // 10. Update Milestone Task in Roadmap
  const handleUpdateMilestoneTask = async (milestoneId: string, taskIndex: number, completed: boolean) => {
    if (!roadmap) return;
    const updatedMilestones = roadmap.milestones.map(m => {
      if (m.id === milestoneId) {
        const updatedTasks = [...m.tasks];
        if (typeof updatedTasks[taskIndex] === 'string') {
          updatedTasks[taskIndex] = { title: updatedTasks[taskIndex] as string, completed };
        } else {
          updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], completed };
        }
        const allDone = updatedTasks.every(t => typeof t === 'object' ? t.completed : false);
        return { ...m, tasks: updatedTasks, completed: allDone };
      }
      return m;
    });
    setRoadmap({ ...roadmap, milestones: updatedMilestones });
  };

  // 11. Save Roadmap to Firestore
  const handleSaveRoadmap = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    if (!roadmap) return;
    try {
      setIsSaving(true);
      const docRef = await addDoc(collection(db, 'roadmaps'), {
        ...roadmap,
        userId: user.uid,
        savedAt: new Date().toISOString()
      });
      setSavedRoadmaps(prev => [{ ...roadmap, id: docRef.id }, ...prev]);
    } catch (err) {
      console.error('Error saving roadmap:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0D14] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white relative">
      
      {/* Background ambient lighting */}
      <AmbientThemeBackground />

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={navigateTo}
        user={user}
        userRole={userRole}
        profile={profile}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onSignOut={() => firebaseSignOut(auth)}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        savedCount={savedCareers.length + savedRoadmaps.length}
        onOpenThemeModal={openAppThemeModal}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onBack={goBack}
        canGoBack={navigationHistory.length > 1}
      />

      <div className="flex-1 flex flex-col relative z-10">
        
        {/* Dynamic Body Views */}
        <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl relative z-10">
          
          {/* 1. DISCOVER / RECOMMENDATIONS */}
          {activeTab === 'discover' && (
            <CareerRecommendations
              recommendations={recommendations}
              onSelectRoleForRoadmap={handleGenerateRoadmap}
              onSaveCareer={handleSaveCareer}
              savedTitles={savedCareers.map(c => c.title)}
              isGenerating={isGeneratingRecs}
              onGoToProfile={() => navigateTo('profile')}
              onOpenScenarioSimulator={() => navigateTo('scenario')}
              userName={user?.displayName || profile.university}
              profile={profile}
            />
          )}

          {/* 2. CAREER ASSESSMENT */}
          {activeTab === 'assessment' && (
            <CareerAssessment
              user={user}
              profile={profile}
              onOpenAuth={() => setIsAuthModalOpen(true)}
              onNavigateToRoadmap={handleGenerateRoadmap}
              onBack={goBack}
            />
          )}

          {/* 3. CAREER EXPLORER */}
          {activeTab === 'explorer' && (
            <CareerExplorer
              onSelectRoleForRoadmap={handleGenerateRoadmap}
              onSelectRoleForSkillGap={(role) => {
                handleAnalyzeSkillGap(role);
                navigateTo('skillgap');
              }}
              onSaveCareer={(item) => {
                handleSaveCareer({
                  id: item.title,
                  title: item.title,
                  matchScore: 90,
                  shortSummary: item.reasoning,
                  reason: item.reasoning,
                  salaryRange: { entry: item.salary, mid: item.salary },
                  demandGrowth: item.growth,
                  futureDemand: 'High',
                  strengths: [],
                  weaknesses: [],
                  matchingSkills: [],
                  missingSkills: [],
                  skillsGap: [],
                  dayInLife: '',
                  keyResponsibilities: [],
                  aiReasoning: item.reasoning,
                  topEmployers: []
                });
              }}
              savedCareers={savedCareers}
              onBack={goBack}
            />
          )}

          {/* 4. LEARNING ROADMAP */}
          {activeTab === 'roadmap' && (
            <RoadmapView
              roadmap={roadmap}
              setRoadmap={setRoadmap}
              onUpdateMilestoneTask={handleUpdateMilestoneTask}
              onSaveRoadmap={handleSaveRoadmap}
              isSaving={isSaving}
              onGenerateRoadmapForRole={handleGenerateRoadmap}
              isGenerating={isGeneratingRoadmap}
              onBack={goBack}
            />
          )}

          {/* 5. RESUME ANALYZER */}
          {activeTab === 'resume' && (
            <ResumeAnalyzer
              onAnalyze={handleAnalyzeResume}
              analysis={resumeAnalysis}
              isAnalyzing={isAnalyzingResume}
              onBack={goBack}
            />
          )}

          {/* 6. INTERVIEW PREP */}
          {activeTab === 'interview' && (
            <InterviewPrep
              questions={interviewQuestions}
              evaluation={interviewEvaluation}
              isGenerating={isGeneratingInterview}
              isEvaluating={isEvaluatingInterview}
              targetRole={targetInterviewRole}
              setTargetRole={setTargetInterviewRole}
              onGenerateQuestions={(role) => handleGenerateInterview(role)}
              onEvaluateAnswer={handleEvaluateAnswer}
              onBack={goBack}
            />
          )}

          {/* 7. SKILL GAP ANALYSIS */}
          {activeTab === 'skillgap' && (
            <SkillGapAnalysis
              analysis={skillGapAnalysis}
              onAnalyze={handleAnalyzeSkillGap}
              isAnalyzing={isAnalyzingSkillGap}
              profile={profile}
              onBack={goBack}
            />
          )}

          {/* 8. JOB MARKET TRENDS */}
          {activeTab === 'jobmarket' && (
            <JobMarketDashboard
              onSelectRoleForRoadmap={handleGenerateRoadmap}
              onExploreSkillGap={(role) => {
                handleAnalyzeSkillGap(role);
                navigateTo('skillgap');
              }}
              onBack={goBack}
            />
          )}

          {/* 9. WHAT-IF SCENARIO SIMULATOR */}
          {activeTab === 'scenario' && (
            <ScenarioSimulator
              profile={profile}
              onNavigateToRoadmap={handleGenerateRoadmap}
              onBack={goBack}
            />
          )}

          {/* 10. AI ADVISOR CHAT */}
          {activeTab === 'chat' && (
            <AdvisorChat
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              onClearHistory={handleClearChatHistory}
              isThinking={isChatThinking}
              profile={profile}
              roadmap={roadmap}
              onBack={goBack}
            />
          )}

          {/* 11. SAVED CAREERS & ROADMAPS */}
          {activeTab === 'saved' && (
            <SavedCareersView
              savedCareers={savedCareers}
              savedRoadmaps={savedRoadmaps}
              onRemoveSavedCareer={async (id) => {
                try {
                  await deleteDoc(doc(db, 'savedCareers', id));
                  setSavedCareers(prev => prev.filter(c => c.id !== id));
                } catch (e) {
                  console.error(e);
                }
              }}
              onSelectRoadmap={(rm) => {
                setRoadmap(rm);
                navigateTo('roadmap');
              }}
              onSelectRoleForRoadmap={handleGenerateRoadmap}
              user={user}
              onOpenAuth={() => setIsAuthModalOpen(true)}
              onBack={goBack}
            />
          )}

          {/* 12. FACULTY & INSTITUTIONAL DASHBOARD */}
          {activeTab === 'faculty' && (
            <FacultyDashboard
              onNavigateToRoadmap={(roleTitle) => {
                handleGenerateRoadmap(roleTitle);
                navigateTo('roadmap');
              }}
              onBack={goBack}
              user={user}
              userRole={userRole}
              onOpenAuth={() => setIsAuthModalOpen(true)}
              onRefreshRole={refreshUserRole}
            />
          )}

          {/* 13. STUDENT PROFILE */}
          {activeTab === 'profile' && (
            <ProfileView
              profile={profile}
              user={user}
              userRole={userRole}
              savedCareers={savedCareers}
              savedRoadmaps={savedRoadmaps}
              onOpenAuth={() => setIsAuthModalOpen(true)}
              onSignOut={() => firebaseSignOut(auth)}
              onOpenThemeModal={openAppThemeModal}
              onOpenProfileExperienceModal={openProfileExperienceModal}
              onNavigateToTab={navigateTo}
              onUpdateProfile={(updated) => setProfile(prev => ({ ...prev, ...updated }))}
              onOpenEditProfileModal={() => setIsProfileEditorModalOpen(true)}
            />
          )}

        </main>

        {/* Minimal Footer */}
        <footer className="border-t border-white/[0.06] py-6 bg-[#0E111B]/80 text-slate-500 text-xs mt-auto">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-400">CareerCompass AI</span>
              <span>&copy; {new Date().getFullYear()}</span>
              <span>&bull;</span>
              <span>Built with Gemini AI &amp; Firestore</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-slate-400">
              <button 
                type="button" 
                onClick={() => navigateTo('faculty')}
                className="hover:text-indigo-400 cursor-pointer"
              >
                Faculty Dashboard
              </button>
              <button 
                type="button" 
                onClick={() => navigateTo('jobmarket')}
                className="hover:text-indigo-400 cursor-pointer"
              >
                Market Analytics
              </button>
              <button 
                type="button" 
                onClick={() => navigateTo('scenario')}
                className="hover:text-indigo-400 cursor-pointer"
              >
                What-If Simulator
              </button>
            </div>
          </div>
        </footer>

      </div>

      {/* Profile Builder Modal */}
      {isProfileEditorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-4xl bg-[#131724] border border-white/[0.10] rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div>
                <h3 className="text-xl font-bold text-white">Edit Student Profile</h3>
                <p className="text-xs text-slate-400">Update academic credentials, coursework, and technical skills</p>
              </div>
              <button
                type="button"
                onClick={() => setIsProfileEditorModalOpen(false)}
                className="p-1.5 rounded-lg bg-white/[0.04] text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ProfileBuilder
              profile={profile}
              setProfile={setProfile}
              onSaveProfile={handleSaveProfile}
              onGenerateRecommendations={() => {
                handleGenerateRecommendations();
                setIsProfileEditorModalOpen(false);
                navigateTo('discover');
              }}
              isSaving={isSaving}
              isGenerating={isGeneratingRecs}
              topRecommendation={recommendations[0]}
              skillGapAnalysis={skillGapAnalysis}
            />
          </div>
        </div>
      )}

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

      {/* Theme Studio Modal */}
      <ThemeSelectorModal
        isOpen={isAppThemeModalOpen}
        onClose={closeAppThemeModal}
        onAppThemeSaved={handleAppThemeSavedToProfile}
        onProfileExperienceSaved={handleProfileExperienceSavedToProfile}
        onThemeSavedToProfile={handleProfileExperienceSavedToProfile}
      />

      {/* Profile Experience Modal */}
      <ProfileExperienceModal
        isOpen={isProfileExperienceModalOpen}
        onClose={closeProfileExperienceModal}
        onSelectExperience={handleProfileExperienceSavedToProfile}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onNavigateToProfile={() => setActiveTab('profile')}
        onAppThemeSaved={handleAppThemeSavedToProfile}
        onProfileExperienceSaved={handleProfileExperienceSavedToProfile}
        onThemeSavedToProfile={handleProfileExperienceSavedToProfile}
      />

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
