import React, { useState } from 'react';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Sparkles, 
  MessageSquare, 
  FileText, 
  GraduationCap, 
  Award, 
  CheckSquare, 
  XSquare, 
  Plus, 
  Search, 
  Star, 
  BookOpen, 
  Send, 
  Lock, 
  Globe, 
  ChevronRight, 
  TrendingUp, 
  Target, 
  Briefcase, 
  BarChart3, 
  ThumbsUp, 
  Edit3, 
  Trash2,
  Bookmark,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  UserCheck,
  Zap,
  Filter
} from 'lucide-react';
import { 
  FacultyStudent, 
  FacultyRecommendation, 
  FacultyApprovalRequest, 
  FacultyFeedbackItem, 
  FacultyNote, 
  CareerRoadmap,
  RoadmapMilestone
} from '../types';
import { 
  initialFacultyStudents, 
  initialFacultyRecommendations, 
  initialFacultyApprovals, 
  initialFacultyFeedback, 
  initialFacultyNotes, 
  mockStudentRoadmap 
} from '../data/facultyData';

interface FacultyDashboardProps {
  onNavigateToRoadmap?: (roleTitle: string) => void;
}

export const FacultyDashboard: React.FC<FacultyDashboardProps> = ({ onNavigateToRoadmap }) => {
  // State
  const [students, setStudents] = useState<FacultyStudent[]>(initialFacultyStudents);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('std_01');
  const [recommendations, setRecommendations] = useState<FacultyRecommendation[]>(initialFacultyRecommendations);
  const [approvals, setApprovals] = useState<FacultyApprovalRequest[]>(initialFacultyApprovals);
  const [feedbacks, setFeedbacks] = useState<FacultyFeedbackItem[]>(initialFacultyFeedback);
  const [notes, setNotes] = useState<FacultyNote[]>(initialFacultyNotes);
  const [studentRoadmap, setStudentRoadmap] = useState<CareerRoadmap>(mockStudentRoadmap);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'progress' | 'recommendations' | 'approvals' | 'feedback' | 'roadmap' | 'notes'>('progress');
  const [studentSearchQuery, setStudentSearchQuery] = useState<string>('');
  const [approvalFilter, setApprovalFilter] = useState<'All' | 'Pending' | 'Approved' | 'Revision Requested'>('All');

  // Form States
  // New Recommendation
  const [newRecTitle, setNewRecTitle] = useState<string>('');
  const [newRecRationale, setNewRecRationale] = useState<string>('');
  const [newRecPriority, setNewRecPriority] = useState<'High' | 'Medium' | 'Low'>('High');

  // New Feedback
  const [newFbCategory, setNewFbCategory] = useState<'Roadmap' | 'Interview' | 'Resume' | 'Overall Academic'>('Roadmap');
  const [newFbRating, setNewFbRating] = useState<number>(5);
  const [newFbText, setNewFbText] = useState<string>('');
  const [newFbActionItem, setNewFbActionItem] = useState<string>('');
  const [newFbActionItemsList, setNewFbActionItemsList] = useState<string[]>([]);

  // New Note
  const [newNoteText, setNewNoteText] = useState<string>('');
  const [newNoteCategory, setNewNoteCategory] = useState<'Academic' | 'Career Guidance' | 'Placement Alert' | 'Personal'>('Career Guidance');
  const [newNotePrivate, setNewNotePrivate] = useState<boolean>(false);

  // New Roadmap Milestone (Faculty Append)
  const [isAddingMilestone, setIsAddingMilestone] = useState<boolean>(false);
  const [newMTitle, setNewMTitle] = useState<string>('');
  const [newMPeriod, setNewMPeriod] = useState<string>('');
  const [newMDesc, setNewMDesc] = useState<string>('');

  // Approval Comment Modal / Expand
  const [selectedApprovalModal, setSelectedApprovalModal] = useState<FacultyApprovalRequest | null>(null);
  const [facultyApprovalComment, setFacultyApprovalComment] = useState<string>('');

  // Current Selected Student Object
  const currentStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  // Filtered Students
  const filteredStudents = students.filter((s) => 
    s.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
    s.rollNumber.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
    s.targetRole.toLowerCase().includes(studentSearchQuery.toLowerCase())
  );

  // Handlers
  // 1. Approvals
  const handleApprovalAction = (request: FacultyApprovalRequest, newStatus: 'Approved' | 'Revision Requested' | 'Rejected', comment?: string) => {
    setApprovals((prev) =>
      prev.map((item) =>
        item.id === request.id
          ? {
              ...item,
              status: newStatus,
              facultyComment: comment || facultyApprovalComment || item.facultyComment,
              reviewedDate: new Date().toISOString().split('T')[0]
            }
          : item
      )
    );

    // Update student status if roadmap approved
    if (request.type === 'Roadmap Approval' && newStatus === 'Approved') {
      setStudents((prev) =>
        prev.map((s) => (s.id === request.studentId ? { ...s, status: 'Approved' } : s))
      );
    }

    setSelectedApprovalModal(null);
    setFacultyApprovalComment('');
  };

  // 2. Add Recommendation
  const handleAddRecommendation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecTitle.trim() || !newRecRationale.trim()) return;

    const newRec: FacultyRecommendation = {
      id: `rec_${Date.now()}`,
      studentId: currentStudent.id,
      roleTitle: newRecTitle,
      rationale: newRecRationale,
      recommendedBy: 'Dr. Sarah Jenkins (Faculty Advisor)',
      priority: newRecPriority,
      status: 'Recommended',
      dateAdded: new Date().toISOString().split('T')[0]
    };

    setRecommendations([newRec, ...recommendations]);
    setNewRecTitle('');
    setNewRecRationale('');
  };

  // 3. Add Feedback
  const handleAddActionItem = () => {
    if (!newFbActionItem.trim()) return;
    setNewFbActionItemsList([...newFbActionItemsList, newFbActionItem.trim()]);
    setNewFbActionItem('');
  };

  const handleRemoveActionItem = (index: number) => {
    setNewFbActionItemsList(newFbActionItemsList.filter((_, i) => i !== index));
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFbText.trim()) return;

    const newFb: FacultyFeedbackItem = {
      id: `fb_${Date.now()}`,
      studentId: currentStudent.id,
      facultyName: 'Dr. Sarah Jenkins',
      category: newFbCategory,
      rating: newFbRating,
      feedbackText: newFbText,
      actionItems: newFbActionItemsList.length > 0 ? newFbActionItemsList : ['Follow roadmap milestones provided by mentor'],
      date: new Date().toISOString().split('T')[0]
    };

    setFeedbacks([newFb, ...feedbacks]);
    setNewFbText('');
    setNewFbActionItemsList([]);
  };

  // 4. Add Note
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const newN: FacultyNote = {
      id: `note_${Date.now()}`,
      studentId: currentStudent.id,
      authorName: 'Dr. Sarah Jenkins',
      content: newNoteText,
      category: newNoteCategory,
      isPrivate: newNotePrivate,
      createdAt: `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    };

    setNotes([newN, ...notes]);
    setNewNoteText('');
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  // 5. Add Milestone to Student Roadmap
  const handleAddRoadmapMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMTitle.trim()) return;

    const newMs: RoadmapMilestone = {
      id: `ms_${Date.now()}`,
      period: newMPeriod || `Month ${studentRoadmap.milestones.length * 2 + 1} - Month ${studentRoadmap.milestones.length * 2 + 2}`,
      title: newMTitle,
      description: newMDesc || 'Faculty appended milestone focused on academic specialization and industry readiness.',
      completed: false,
      tasks: ['Review course material with faculty advisor', 'Submit milestone deliverable'],
      recommendedResources: [{ title: 'Faculty Reference Materials', type: 'Course' }],
      resumeBulletSuggestion: `Completed specialized faculty module in ${newMTitle}.`
    };

    setStudentRoadmap({
      ...studentRoadmap,
      milestones: [...studentRoadmap.milestones, newMs]
    });

    setNewMTitle('');
    setNewMPeriod('');
    setNewMDesc('');
    setIsAddingMilestone(false);
  };

  // Student specific subsets
  const studentRecommendations = recommendations.filter((r) => r.studentId === currentStudent.id);
  const studentApprovals = approvals.filter((a) => a.studentId === currentStudent.id);
  const studentFeedbacks = feedbacks.filter((f) => f.studentId === currentStudent.id);
  const studentNotes = notes.filter((n) => n.studentId === currentStudent.id);

  // Overall Stats
  const pendingApprovalsCount = approvals.filter((a) => a.status === 'Pending').length;
  const avgReadiness = Math.round(students.reduce((acc, curr) => acc + curr.readinessScore, 0) / students.length);

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Faculty Portal Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 backdrop-blur-xl shadow-2xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Academic Advisor & Faculty Mentorship Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <span>Faculty Mentorship Dashboard</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Monitor student career progress, endorse tailored career paths, approve roadmaps and internship credits, provide structured evaluations, and record advisor notes.
            </p>
          </div>

          {/* Active Faculty Badge */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-3.5 shrink-0">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-lg shadow-md">
              DJ
            </div>
            <div>
              <div className="text-xs font-extrabold text-white">Dr. Sarah Jenkins</div>
              <div className="text-[11px] text-indigo-300 font-medium">Professor & Placement Mentor</div>
              <div className="text-[10px] text-slate-400">Computer Science Dept.</div>
            </div>
          </div>
        </div>

        {/* High Level Key Faculty Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10">
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-400" /> Enrolled Mentees
            </span>
            <div className="text-xl font-black text-white">{students.length} Students</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" /> Pending Approvals
            </span>
            <div className="text-xl font-black text-amber-400">{pendingApprovalsCount} Action Required</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Avg Career Readiness
            </span>
            <div className="text-xl font-black text-emerald-400">{avgReadiness}%</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-purple-400" /> Endorsed Roles
            </span>
            <div className="text-xl font-black text-purple-300">{recommendations.length} Recommendations</div>
          </div>
        </div>
      </div>

      {/* Student Selection Directory Bar */}
      <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-extrabold text-white">Select Student for Mentorship Review:</h3>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={studentSearchQuery}
              onChange={(e) => setStudentSearchQuery(e.target.value)}
              placeholder="Filter by name, ID, or target role..."
              className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-64"
            />
          </div>
        </div>

        {/* Student Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {filteredStudents.map((st) => {
            const isSelected = st.id === selectedStudentId;
            return (
              <button
                key={st.id}
                onClick={() => setSelectedStudentId(st.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 relative ${
                  isSelected
                    ? 'bg-gradient-to-br from-indigo-950/90 to-slate-900 border-indigo-500 shadow-lg ring-1 ring-indigo-500/50'
                    : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                }`}
              >
                <div className="relative">
                  <img
                    src={st.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                    alt={st.name}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-700 shrink-0"
                  />
                  <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-950 ${
                    st.status === 'Approved' ? 'bg-emerald-500' : st.status === 'On Track' ? 'bg-blue-500' : 'bg-amber-500'
                  }`} />
                </div>

                <div className="space-y-0.5 min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate">{st.name}</span>
                    <span className="text-[10px] font-mono font-bold text-slate-400">{st.rollNumber}</span>
                  </div>
                  <div className="text-[11px] text-indigo-300 font-semibold truncate">{st.targetRole}</div>
                  <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                    <span>CGPA: <strong className="text-white">{st.cgpa}</strong></span>
                    <span className="text-emerald-400 font-bold">{st.readinessScore}% Ready</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Navigation Tabs for Faculty Dashboard */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800">
        {[
          { id: 'progress', label: '1. Student Progress', icon: BarChart3, badge: null },
          { id: 'recommendations', label: '2. Career Recommendations', icon: Briefcase, badge: studentRecommendations.length },
          { id: 'approvals', label: '3. Approvals Hub', icon: CheckSquare, badge: pendingApprovalsCount },
          { id: 'roadmap', label: '4. Roadmap Review', icon: Target, badge: null },
          { id: 'feedback', label: '5. Feedback & Evaluation', icon: MessageSquare, badge: studentFeedbacks.length },
          { id: 'notes', label: '6. Advisor Notes', icon: FileText, badge: studentNotes.length }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.badge !== null && tab.badge > 0 && (
                <span className={`px-2 py-0.2 rounded-full text-[10px] font-black ${
                  isActive ? 'bg-white text-indigo-900' : 'bg-indigo-500/30 text-indigo-300'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: STUDENT PROGRESS */}
      {activeTab === 'progress' && (
        <div className="space-y-6">
          
          {/* Selected Student Profile Banner */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-indigo-500/20 backdrop-blur-xl space-y-6 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              <div className="flex items-center gap-4">
                <img
                  src={currentStudent.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                  alt={currentStudent.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-lg"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-white">{currentStudent.name}</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {currentStudent.rollNumber}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                      currentStudent.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}>
                      {currentStudent.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    {currentStudent.department} • {currentStudent.major} ({currentStudent.year})
                  </p>
                  <p className="text-xs text-indigo-300 font-semibold">
                    Target Career Role: <span className="text-white font-bold">{currentStudent.targetRole}</span>
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setActiveTab('feedback')}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Give Feedback</span>
                </button>
                <button
                  onClick={() => setActiveTab('recommendations')}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Recommend Path</span>
                </button>
              </div>

            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
              
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                  <span>AI Readiness Score</span>
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-emerald-400">{currentStudent.readinessScore}%</span>
                  <span className="text-[10px] text-slate-400">Industry Job Ready</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${currentStudent.readinessScore}%` }} />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                  <span>Roadmap Completion</span>
                  <Target className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-indigo-400">{currentStudent.milestoneProgress}%</span>
                  <span className="text-[10px] text-slate-400">Milestones Cleared</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${currentStudent.milestoneProgress}%` }} />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                  <span>Academic Standing</span>
                  <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white">{currentStudent.cgpa}</span>
                  <span className="text-[10px] font-bold text-emerald-400">CGPA / 4.0</span>
                </div>
                <p className="text-[11px] text-slate-400">University Honors Division</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                  <span>Mock Interview Score</span>
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-amber-300">{currentStudent.mockInterviewScore}/100</span>
                  <span className="text-[10px] text-slate-400">Technical & Behavioral</span>
                </div>
                <p className="text-[11px] text-slate-400">Last Session: 5 days ago</p>
              </div>

            </div>
          </div>

          {/* Student Portfolio & Achievements Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-indigo-500/20 backdrop-blur-xl space-y-4 shadow-xl">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>Verified Student Projects & Experience</span>
              </h3>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">RAG AI Knowledge Search Engine</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Verified Capstone</span>
                  </div>
                  <p className="text-xs text-slate-300">Built multi-modal RAG search using PyTorch, Qdrant Vector DB, and LangChain API.</p>
                  <div className="flex items-center gap-1.5 pt-1">
                    {['PyTorch', 'Qdrant', 'React', 'FastAPI'].map((t) => (
                      <span key={t} className="px-2 py-0.2 rounded bg-slate-900 text-[10px] text-slate-400 font-mono">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">NVIDIA AI Research Intern</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">3 Months Internship</span>
                  </div>
                  <p className="text-xs text-slate-300">Optimized inference batching for LLM microservices using TensorRT-LLM.</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-indigo-500/20 backdrop-blur-xl space-y-4 shadow-xl">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Verified Certifications & Technical Skills</span>
              </h3>

              <div className="space-y-2">
                {[
                  { title: 'AWS Certified Solutions Architect Associate', date: 'Jul 2026', badge: 'Cloud' },
                  { title: 'Deep Learning Specialization (DeepLearning.AI)', date: 'May 2026', badge: 'AI & ML' },
                  { title: 'TensorFlow Developer Certificate', date: 'Jan 2026', badge: 'AI Engine' }
                ].map((c) => (
                  <div key={c.title} className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <div className="font-bold text-white">{c.title}</div>
                      <div className="text-[10px] text-slate-400">Issued: {c.date}</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-extrabold">
                      {c.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: CAREER RECOMMENDATIONS */}
      {activeTab === 'recommendations' && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Form: Add New Faculty Recommendation (4 cols) */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-indigo-500/20 backdrop-blur-xl space-y-5 shadow-xl">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-indigo-400" />
                  <span>Recommend Career Path</span>
                </h3>
                <p className="text-xs text-slate-400">Endorse a specific career path or specialized role for {currentStudent.name}.</p>
              </div>

              <form onSubmit={handleAddRecommendation} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Target Role Title:</label>
                  <input
                    type="text"
                    value={newRecTitle}
                    onChange={(e) => setNewRecTitle(e.target.value)}
                    placeholder="e.g. LLM Systems Engineer, MLOps Specialist..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Academic & Skills Rationale:</label>
                  <textarea
                    value={newRecRationale}
                    onChange={(e) => setNewRecRationale(e.target.value)}
                    rows={3}
                    placeholder="Why is this role suitable based on their performance and skills?"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Priority Tier:</label>
                  <select
                    value={newRecPriority}
                    onChange={(e) => setNewRecPriority(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="High">High Priority Recommendation</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Secondary Exploration</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Recommendation</span>
                </button>
              </form>
            </div>

            {/* List: Existing Recommendations for Selected Student (7 cols) */}
            <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-indigo-500/20 backdrop-blur-xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-400" />
                    <span>Faculty Recommendations for {currentStudent.name}</span>
                  </h3>
                  <p className="text-xs text-slate-400">Mentors' official endorsements and path recommendations.</p>
                </div>
                <span className="text-xs font-bold text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full">
                  {studentRecommendations.length} Endorsed
                </span>
              </div>

              {studentRecommendations.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-800 rounded-2xl">
                  No faculty recommendations recorded for this student yet. Use the form on the left to add one!
                </div>
              ) : (
                <div className="space-y-3">
                  {studentRecommendations.map((rec) => (
                    <div key={rec.id} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm text-white">{rec.roleTitle}</span>
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            rec.priority === 'High' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-indigo-500/20 text-indigo-300'
                          }`}>
                            {rec.priority} Priority
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-900 text-[10px] text-slate-400">
                            {rec.status}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">{rec.rationale}</p>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                        <span>Endorsed by: <strong className="text-slate-200">{rec.recommendedBy}</strong></span>
                        <span className="font-mono text-[10px]">{rec.dateAdded}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* TAB 3: APPROVALS HUB */}
      {activeTab === 'approvals' && (
        <div className="space-y-6">
          
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-indigo-500/20 backdrop-blur-xl space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-indigo-400" />
                  <span>Student Approvals & Exemption Requests</span>
                </h3>
                <p className="text-xs text-slate-400">Review roadmap submissions, internship credit exemptions, and career track changes.</p>
              </div>

              {/* Approval Filter Buttons */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800">
                {(['All', 'Pending', 'Approved', 'Revision Requested'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setApprovalFilter(st)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      approvalFilter === st ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Approval Requests Cards List */}
            <div className="space-y-4">
              {approvals
                .filter((app) => approvalFilter === 'All' || app.status === approvalFilter)
                .map((req) => (
                  <div key={req.id} className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300">
                          <FileText className="w-4 h-4" />
                        </span>
                        <div>
                          <span className="text-xs font-extrabold text-indigo-300 block">{req.type}</span>
                          <h4 className="text-sm font-extrabold text-white">{req.title}</h4>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-400">Student: <strong className="text-white">{req.studentName}</strong></span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                          req.status === 'Approved'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : req.status === 'Pending'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        }`}>
                          {req.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{req.description}</p>

                    {req.facultyComment && (
                      <div className="p-3 rounded-xl bg-slate-900 border border-indigo-500/20 text-xs text-indigo-200 flex items-start gap-2">
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-white">Faculty Review Comment:</strong> {req.facultyComment}
                        </div>
                      </div>
                    )}

                    {/* Faculty Action Buttons */}
                    {req.status === 'Pending' && (
                      <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2 justify-end">
                        <button
                          onClick={() => handleApprovalAction(req, 'Approved', 'Approved by Faculty Mentor.')}
                          className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve Request</span>
                        </button>

                        <button
                          onClick={() => {
                            setSelectedApprovalModal(req);
                            setFacultyApprovalComment('Please revise the project milestones to include unit testing.');
                          }}
                          className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                        >
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Request Revision</span>
                        </button>

                        <button
                          onClick={() => handleApprovalAction(req, 'Rejected', 'Does not meet departmental credit criteria.')}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-900/50 text-slate-300 hover:text-rose-200 text-xs font-bold transition-all"
                        >
                          <span>Reject</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: ROADMAP REVIEW */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6">
          
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-indigo-500/20 backdrop-blur-xl space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-extrabold mb-1">
                  <Target className="w-3.5 h-3.5" />
                  <span>Roadmap Under Faculty Review</span>
                </div>
                <h3 className="text-xl font-black text-white">
                  {studentRoadmap.roleTitle} Roadmap ({currentStudent.name})
                </h3>
                <p className="text-xs text-slate-300 max-w-2xl mt-1">
                  {studentRoadmap.overview}
                </p>
              </div>

              <button
                onClick={() => setIsAddingMilestone(!isAddingMilestone)}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Append Faculty Milestone</span>
              </button>
            </div>

            {/* Form to Append New Faculty Milestone */}
            {isAddingMilestone && (
              <form onSubmit={handleAddRoadmapMilestone} className="p-5 rounded-2xl bg-slate-950 border border-indigo-500/40 space-y-4">
                <h4 className="text-xs font-extrabold text-indigo-300">Append Custom Milestone to Student Roadmap:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={newMTitle}
                    onChange={(e) => setNewMTitle(e.target.value)}
                    placeholder="Milestone Title (e.g. Capstone Research Defense)..."
                    className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                    required
                  />
                  <input
                    type="text"
                    value={newMPeriod}
                    onChange={(e) => setNewMPeriod(e.target.value)}
                    placeholder="Time Period (e.g. Month 7 - Month 8)..."
                    className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                </div>
                <textarea
                  value={newMDesc}
                  onChange={(e) => setNewMDesc(e.target.value)}
                  rows={2}
                  placeholder="Milestone description and faculty guidelines..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white resize-none"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsAddingMilestone(false)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold"
                  >
                    Add Milestone
                  </button>
                </div>
              </form>
            )}

            {/* Interactive Timeline Breakdown */}
            <div className="space-y-4">
              {studentRoadmap.milestones.map((ms, idx) => (
                <div key={ms.id} className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center font-extrabold text-xs ${
                        ms.completed ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {idx + 1}
                      </span>
                      <div>
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">{ms.period}</span>
                        <h4 className="text-sm font-extrabold text-white">{ms.title}</h4>
                      </div>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                      ms.completed ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {ms.completed ? 'Completed by Student' : 'In Progress / Upcoming'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">{ms.description}</p>

                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Required Tasks:</span>
                    <div className="space-y-1">
                      {ms.tasks.map((tsk, tIdx) => (
                        <div key={tIdx} className="flex items-center gap-2 text-xs text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{tsk}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 5: FEEDBACK & EVALUATION */}
      {activeTab === 'feedback' && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Form: Post Structured Feedback (5 cols) */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-indigo-500/20 backdrop-blur-xl space-y-5 shadow-xl">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-indigo-400" />
                  <span>Provide Student Feedback</span>
                </h3>
                <p className="text-xs text-slate-400">Post evaluation feedback, star rating, and actionable goals for {currentStudent.name}.</p>
              </div>

              <form onSubmit={handleSubmitFeedback} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Category:</label>
                  <select
                    value={newFbCategory}
                    onChange={(e) => setNewFbCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Roadmap">Career Roadmap Progress</option>
                    <option value="Interview">Mock Technical Interview</option>
                    <option value="Resume">Resume & Portfolio Review</option>
                    <option value="Overall Academic">Overall Academic Standing</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Performance Rating:</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewFbRating(star)}
                        className={`p-1.5 rounded-lg transition-all ${
                          star <= newFbRating ? 'text-amber-400 scale-110' : 'text-slate-600'
                        }`}
                      >
                        <Star className="w-5 h-5 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Detailed Feedback Comments:</label>
                  <textarea
                    value={newFbText}
                    onChange={(e) => setNewFbText(e.target.value)}
                    rows={4}
                    placeholder="Provide constructive feedback, strengths, and areas to improve..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                    required
                  />
                </div>

                {/* Action Items List Builder */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300">Action Items for Student:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newFbActionItem}
                      onChange={(e) => setNewFbActionItem(e.target.value)}
                      placeholder="Add an action item (e.g. Practice 3 graph problems)..."
                      className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddActionItem}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold"
                    >
                      Add
                    </button>
                  </div>

                  {newFbActionItemsList.length > 0 && (
                    <div className="space-y-1 pt-1">
                      {newFbActionItemsList.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-950/80 text-xs text-slate-200">
                          <span>• {item}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveActionItem(idx)}
                            className="text-slate-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Feedback</span>
                </button>
              </form>
            </div>

            {/* List: Existing Feedback for Student (7 cols) */}
            <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-indigo-500/20 backdrop-blur-xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <span>Feedback Logs ({currentStudent.name})</span>
                  </h3>
                  <p className="text-xs text-slate-400">Past evaluations and assigned mentor action items.</p>
                </div>
              </div>

              {studentFeedbacks.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-800 rounded-2xl">
                  No feedback recorded yet for this student. Use the form on the left to submit a review.
                </div>
              ) : (
                <div className="space-y-4">
                  {studentFeedbacks.map((fb) => (
                    <div key={fb.id} className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
                            {fb.category}
                          </span>
                          <div className="flex items-center text-amber-400">
                            {Array.from({ length: fb.rating }).map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-current" />
                            ))}
                          </div>
                        </div>

                        <span className="text-[10px] font-mono text-slate-400">{fb.date}</span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">{fb.feedbackText}</p>

                      {fb.actionItems.length > 0 && (
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Action Items:</span>
                          <ul className="space-y-1 text-xs text-indigo-200 list-disc list-inside">
                            {fb.actionItems.map((ai, i) => (
                              <li key={i}>{ai}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="text-[10px] text-slate-400 text-right">
                        Evaluator: <strong className="text-slate-300">{fb.facultyName}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* TAB 6: ADVISOR NOTES */}
      {activeTab === 'notes' && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Form: Add Advisor Note (5 cols) */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-indigo-500/20 backdrop-blur-xl space-y-5 shadow-xl">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <span>Add Advisor Note</span>
                </h3>
                <p className="text-xs text-slate-400">Record private faculty notes or shared student advisement logs.</p>
              </div>

              <form onSubmit={handleAddNote} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Category Tag:</label>
                  <select
                    value={newNoteCategory}
                    onChange={(e) => setNewNoteCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Career Guidance">Career Guidance</option>
                    <option value="Academic">Academic Performance</option>
                    <option value="Placement Alert">Placement & Internship Alert</option>
                    <option value="Personal">Personal Mentorship</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Note Content:</label>
                  <textarea
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    rows={4}
                    placeholder="Enter confidential or shared advisement notes..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                    required
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="privateCheck"
                    checked={newNotePrivate}
                    onChange={(e) => setNewNotePrivate(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="privateCheck" className="text-xs text-slate-300 flex items-center gap-1.5 cursor-pointer">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Private Note (Faculty Only - Hidden from Student)</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Save Advisor Note</span>
                </button>
              </form>
            </div>

            {/* List: Notes Feed (7 cols) */}
            <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-indigo-500/20 backdrop-blur-xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-purple-400" />
                    <span>Advisor Notes Log ({currentStudent.name})</span>
                  </h3>
                  <p className="text-xs text-slate-400">Historical notes recorded during advisement meetings.</p>
                </div>
              </div>

              {studentNotes.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-800 rounded-2xl">
                  No advisor notes created for this student yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {studentNotes.map((nt) => (
                    <div key={nt.id} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300">
                            {nt.category}
                          </span>
                          {nt.isPrivate ? (
                            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold flex items-center gap-1">
                              <Lock className="w-3 h-3" /> Private
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                              <Globe className="w-3 h-3" /> Shared
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => handleDeleteNote(nt.id)}
                          className="text-slate-500 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-xs text-slate-200 leading-relaxed">{nt.content}</p>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
                        <span>Author: <strong className="text-slate-300">{nt.authorName}</strong></span>
                        <span className="font-mono">{nt.createdAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* Revision Request / Approval Comment Modal */}
      {selectedApprovalModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-white">Faculty Review & Comments</h3>
              <button
                onClick={() => setSelectedApprovalModal(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Add review comments or revision instructions for <strong>{selectedApprovalModal.studentName}</strong>'s request: "<em>{selectedApprovalModal.title}</em>".
            </p>

            <textarea
              value={facultyApprovalComment}
              onChange={(e) => setFacultyApprovalComment(e.target.value)}
              rows={4}
              placeholder="Enter instructions for student revision..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedApprovalModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleApprovalAction(selectedApprovalModal, 'Revision Requested', facultyApprovalComment)}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow"
              >
                Send Revision Request
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
