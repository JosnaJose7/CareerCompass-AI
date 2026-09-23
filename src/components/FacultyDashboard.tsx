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
  Filter,
  Brain,
  ShieldAlert,
  History,
  RotateCcw,
  Check,
  X,
  Compass,
  FileCheck
} from 'lucide-react';
import { 
  FacultyStudent, 
  FacultyRecommendation, 
  FacultyApprovalRequest, 
  FacultyFeedbackItem, 
  FacultyNote, 
  CareerRoadmap,
  RoadmapMilestone,
  FacultyEndorsement,
  FacultyAuditItem,
  UserAuthRole
} from '../types';
import { 
  initialFacultyStudents, 
  initialFacultyRecommendations, 
  initialFacultyApprovals, 
  initialFacultyFeedback, 
  initialFacultyNotes, 
  mockStudentRoadmap 
} from '../data/facultyData';
import { BackButton } from './BackButton';
import { db, collection, addDoc, FirebaseUser } from '../lib/firebase';

interface FacultyDashboardProps {
  onNavigateToRoadmap?: (roleTitle: string) => void;
  onBack?: () => void;
  user?: FirebaseUser | null;
  userRole?: UserAuthRole | null;
  onOpenAuth?: () => void;
  onRefreshRole?: () => Promise<void>;
}

export const FacultyDashboard: React.FC<FacultyDashboardProps> = ({ 
  onNavigateToRoadmap, 
  onBack,
  user,
  userRole,
  onOpenAuth,
  onRefreshRole
}) => {
  // State
  const [students, setStudents] = useState<FacultyStudent[]>(initialFacultyStudents);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('std_01');
  const [recommendations, setRecommendations] = useState<FacultyRecommendation[]>(initialFacultyRecommendations);
  const [approvals, setApprovals] = useState<FacultyApprovalRequest[]>(initialFacultyApprovals);
  const [feedbacks, setFeedbacks] = useState<FacultyFeedbackItem[]>(initialFacultyFeedback);
  const [notes, setNotes] = useState<FacultyNote[]>(initialFacultyNotes);
  const [studentRoadmap, setStudentRoadmap] = useState<CareerRoadmap>(mockStudentRoadmap);

  // Security & Audit State
  const [showSecurityAuditModal, setShowSecurityAuditModal] = useState<boolean>(false);
  const [firestoreSyncStatus, setFirestoreSyncStatus] = useState<string | null>(null);
  const [isRefreshingClaims, setIsRefreshingClaims] = useState<boolean>(false);

  // Role-Based Access Control Verification
  // NEVER trusts a client-side field: verified via cryptographically signed token claims,
  // trusted Firestore roster, or verified superadmin email.
  const isAuthorized = Boolean(userRole?.isFaculty || userRole?.isAdmin);

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'profile' | 'ai-vs-faculty' | 'skillgap' | 'roadmap' | 'approvals' | 'endorsement' | 'feedback' | 'notes' | 'audit'
  >('profile');
  
  const [studentSearchQuery, setStudentSearchQuery] = useState<string>('');
  const [approvalFilter, setApprovalFilter] = useState<'All' | 'Pending' | 'Approved' | 'Needs Revision' | 'Rejected'>('All');

  // Form States
  // 1. New Faculty Recommendation
  const [newRecTitle, setNewRecTitle] = useState<string>('');
  const [newRecRationale, setNewRecRationale] = useState<string>('');
  const [newRecPriority, setNewRecPriority] = useState<'High' | 'Medium' | 'Low'>('High');

  // 2. New Feedback
  const [newFbCategory, setNewFbCategory] = useState<'Roadmap' | 'Interview' | 'Resume' | 'Overall Academic'>('Roadmap');
  const [newFbRating, setNewFbRating] = useState<number>(5);
  const [newFbText, setNewFbText] = useState<string>('');
  const [newFbActionItem, setNewFbActionItem] = useState<string>('');
  const [newFbActionItemsList, setNewFbActionItemsList] = useState<string[]>([]);

  // 3. New Advisor Note
  const [newNoteText, setNewNoteText] = useState<string>('');
  const [newNoteCategory, setNewNoteCategory] = useState<'Academic' | 'Career Guidance' | 'Placement Alert' | 'Personal'>('Career Guidance');
  const [newNotePrivate, setNewNotePrivate] = useState<boolean>(false);

  // 4. New Roadmap Milestone
  const [isAddingMilestone, setIsAddingMilestone] = useState<boolean>(false);
  const [newMTitle, setNewMTitle] = useState<string>('');
  const [newMPeriod, setNewMPeriod] = useState<string>('');
  const [newMDesc, setNewMDesc] = useState<string>('');

  // 5. Endorsement Form State
  const [endorsementStatement, setEndorsementStatement] = useState<string>('');
  const [endorsementStrengthInput, setEndorsementStrengthInput] = useState<string>('');
  const [endorsementStrengths, setEndorsementStrengths] = useState<string[]>([]);
  const [endorsementStatus, setEndorsementStatus] = useState<'Pending' | 'Approved' | 'Needs Revision' | 'Rejected'>('Approved');

  // 6. Approval Action Modal
  const [selectedApprovalModal, setSelectedApprovalModal] = useState<FacultyApprovalRequest | null>(null);
  const [pendingActionType, setPendingActionType] = useState<'Approved' | 'Needs Revision' | 'Rejected'>('Approved');
  const [facultyApprovalComment, setFacultyApprovalComment] = useState<string>('');

  // Current Selected Student Object
  const currentStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  // Filtered Students
  const filteredStudents = students.filter((s) => 
    s.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
    s.rollNumber.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
    s.targetRole.toLowerCase().includes(studentSearchQuery.toLowerCase())
  );

  // Helper: Append Audit Log (Preserving history & AI output integrity)
  const appendAuditLog = (studentId: string, action: string, category: FacultyAuditItem['category'], details: string, status?: 'Pending' | 'Approved' | 'Needs Revision' | 'Rejected') => {
    const newLog: FacultyAuditItem = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      actor: 'Dr. Sarah Jenkins (Faculty Advisor)',
      action,
      category,
      details,
      status
    };

    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? { ...s, auditTrail: [newLog, ...(s.auditTrail || [])] }
          : s
      )
    );
  };

  // Helper: Persist verified action to Firestore collection 'facultyActions'
  // Protected by Firestore security rules: ordinary students get PERMISSION_DENIED
  const recordFirestoreAction = async (payload: {
    action: string;
    type: 'Roadmap Approval' | 'Recommendation' | 'Feedback' | 'Note' | 'Endorsement';
    category: string;
    details: string;
    studentId: string;
    studentName: string;
    status?: 'Pending' | 'Approved' | 'Needs Revision' | 'Rejected';
    isPrivate?: boolean;
  }) => {
    if (user && isAuthorized) {
      try {
        await addDoc(collection(db, 'facultyActions'), {
          facultyUid: user.uid,
          facultyEmail: user.email || '',
          facultyName: user.displayName || (user.email ? user.email.split('@')[0] : 'Dr. Sarah Jenkins'),
          facultyDesignation: userRole?.isAdmin ? 'Academic Administrator' : 'Professor & Placement Mentor',
          studentId: payload.studentId,
          studentName: payload.studentName,
          action: payload.action,
          type: payload.type,
          category: payload.category,
          status: payload.status || 'Approved',
          details: payload.details,
          isPrivate: Boolean(payload.isPrivate),
          createdAt: new Date().toISOString(),
          timestamp: new Date().toLocaleString()
        });
        setFirestoreSyncStatus('Recorded to institutional ledger in Firestore (facultyActions)');
        setTimeout(() => setFirestoreSyncStatus(null), 4000);
      } catch (err: any) {
        console.warn('Firestore facultyActions sync notice:', err);
      }
    }
  };

  // Handlers
  // 1. Approvals Hub Action
  const handleApprovalAction = (
    request: FacultyApprovalRequest, 
    newStatus: 'Approved' | 'Needs Revision' | 'Rejected', 
    comment?: string
  ) => {
    const finalComment = comment || facultyApprovalComment || (
      newStatus === 'Approved' ? 'Approved by Faculty Mentor.' :
      newStatus === 'Needs Revision' ? 'Revision required to meet departmental criteria.' :
      'Rejected by Faculty Mentor.'
    );

    setApprovals((prev) =>
      prev.map((item) =>
        item.id === request.id
          ? {
              ...item,
              status: newStatus,
              facultyComment: finalComment,
              reviewedDate: new Date().toISOString().split('T')[0]
            }
          : item
      )
    );

    // If it's a roadmap approval request, update student's roadmap approval status without destroying AI data
    if (request.type === 'Roadmap Approval') {
      setStudents((prev) =>
        prev.map((s) =>
          s.id === request.studentId
            ? { 
                ...s, 
                roadmapApprovalStatus: newStatus,
                status: newStatus === 'Approved' ? 'Approved' : newStatus === 'Needs Revision' ? 'Pending Review' : 'Needs Attention'
              }
            : s
        )
      );
    }

    appendAuditLog(
      request.studentId,
      `Roadmap Status changed to ${newStatus}`,
      'Roadmap Approval',
      `Reviewed request "${request.title}". Note: "${finalComment}"`,
      newStatus
    );

    recordFirestoreAction({
      action: `Roadmap Status changed to ${newStatus}`,
      type: 'Roadmap Approval',
      category: 'Roadmap Approval',
      details: `Reviewed request "${request.title}". Note: "${finalComment}"`,
      studentId: request.studentId,
      studentName: request.studentName,
      status: newStatus
    });

    setSelectedApprovalModal(null);
    setFacultyApprovalComment('');
  };

  // 2. Direct Roadmap Decision
  const handleRoadmapDecision = (newStatus: 'Pending' | 'Approved' | 'Needs Revision' | 'Rejected', rationale: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === currentStudent.id
          ? { 
              ...s, 
              roadmapApprovalStatus: newStatus,
              status: newStatus === 'Approved' ? 'Approved' : newStatus === 'Needs Revision' ? 'Pending Review' : 'Needs Attention'
            }
          : s
      )
    );

    // Update existing roadmap approval request if exists
    setApprovals((prev) =>
      prev.map((app) =>
        app.studentId === currentStudent.id && app.type === 'Roadmap Approval'
          ? {
              ...app,
              status: newStatus,
              facultyComment: rationale,
              reviewedDate: new Date().toISOString().split('T')[0]
            }
          : app
      )
    );

    appendAuditLog(
      currentStudent.id,
      `Roadmap marked as ${newStatus}`,
      'Roadmap Approval',
      `Faculty decision on ${studentRoadmap.roleTitle} roadmap. Rationale: ${rationale}`,
      newStatus
    );

    recordFirestoreAction({
      action: `Roadmap marked as ${newStatus}`,
      type: 'Roadmap Approval',
      category: 'Roadmap Approval',
      details: `Faculty decision on ${studentRoadmap.roleTitle} roadmap. Rationale: ${rationale}`,
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      status: newStatus
    });
  };

  // 3. Add Faculty Recommendation
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
    
    appendAuditLog(
      currentStudent.id,
      `Recommended Career Path: ${newRecTitle}`,
      'Faculty Endorsement',
      `Faculty endorsed ${newRecTitle} with ${newRecPriority} priority: "${newRecRationale}"`
    );

    recordFirestoreAction({
      action: `Recommended Career Path: ${newRecTitle}`,
      type: 'Recommendation',
      category: 'Faculty Endorsement',
      details: `Priority: ${newRecPriority}. Rationale: "${newRecRationale}"`,
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      status: 'Approved'
    });

    setNewRecTitle('');
    setNewRecRationale('');
  };

  // 4. Add Feedback
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

    appendAuditLog(
      currentStudent.id,
      `Provided ${newFbCategory} Feedback (${newFbRating}/5 Stars)`,
      'Feedback Added',
      `Evaluation: "${newFbText.slice(0, 80)}..." | ${newFb.actionItems.length} action items assigned.`
    );

    recordFirestoreAction({
      action: `Provided ${newFbCategory} Feedback (${newFbRating}/5 Stars)`,
      type: 'Feedback',
      category: 'Feedback Added',
      details: `Score: ${newFbRating}/5. Text: "${newFbText}". Action items: ${newFb.actionItems.join('; ')}`,
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      status: 'Approved'
    });

    setNewFbText('');
    setNewFbActionItemsList([]);
  };

  // 5. Add Advisor Note
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

    appendAuditLog(
      currentStudent.id,
      `Recorded ${newNotePrivate ? 'Private' : 'Shared'} Advisor Note`,
      'Note Added',
      `Note Category: ${newNoteCategory}. Visibility: ${newNotePrivate ? 'Confidential Faculty Only' : 'Shared with Student'}`
    );

    recordFirestoreAction({
      action: `Recorded ${newNotePrivate ? 'Private' : 'Shared'} Advisor Note`,
      type: 'Note',
      category: 'Note Added',
      details: `Category: ${newNoteCategory}. Note: "${newNoteText}"`,
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      status: 'Approved',
      isPrivate: newNotePrivate
    });

    setNewNoteText('');
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  // 6. Add Milestone to Student Roadmap (Faculty Append - Preserving original AI milestones)
  const handleAddRoadmapMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMTitle.trim()) return;

    const newMs: RoadmapMilestone = {
      id: `ms_fac_${Date.now()}`,
      period: newMPeriod || `Month ${studentRoadmap.milestones.length * 2 + 1} - Month ${studentRoadmap.milestones.length * 2 + 2} (Faculty Specified)`,
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

    appendAuditLog(
      currentStudent.id,
      `Appended Custom Faculty Milestone: ${newMTitle}`,
      'Roadmap Approval',
      `Appended human oversight milestone to student learning track without altering AI baseline.`
    );

    recordFirestoreAction({
      action: `Appended Custom Faculty Milestone: ${newMTitle}`,
      type: 'Roadmap Approval',
      category: 'Roadmap Approval',
      details: `Milestone: ${newMTitle} (${newMs.period}) - ${newMs.description}`,
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      status: 'Approved'
    });

    setNewMTitle('');
    setNewMPeriod('');
    setNewMDesc('');
    setIsAddingMilestone(false);
  };

  // 7. Save Career Plan Endorsement
  const handleSaveEndorsement = (e: React.FormEvent) => {
    e.preventDefault();
    const strengths = endorsementStrengths.length > 0 ? endorsementStrengths : (currentStudent.endorsement?.strengthsHighlighted || ['High Technical Aptitude', 'Strong Project Execution']);
    const statement = endorsementStatement.trim() || currentStudent.endorsement?.endorsementStatement || `Officially verified and endorsed for ${currentStudent.targetRole} career track.`;

    const updatedEndorsement: FacultyEndorsement = {
      id: currentStudent.endorsement?.id || `end_${Date.now()}`,
      studentId: currentStudent.id,
      targetRole: currentStudent.targetRole,
      endorsedBy: 'Dr. Sarah Jenkins',
      facultyDesignation: 'Professor & Placement Mentor',
      department: currentStudent.department,
      status: endorsementStatus,
      endorsementStatement: statement,
      strengthsHighlighted: strengths,
      institutionalStamp: `FACULTY_VERIFIED_${currentStudent.rollNumber.replace(/[^A-Z0-9]/gi, '_').toUpperCase()}`,
      dateEndorsed: new Date().toISOString().split('T')[0],
      officialBadgeIssued: endorsementStatus === 'Approved'
    };

    setStudents((prev) =>
      prev.map((s) =>
        s.id === currentStudent.id
          ? { 
              ...s, 
              endorsement: updatedEndorsement,
              status: endorsementStatus === 'Approved' ? 'Approved' : endorsementStatus === 'Needs Revision' ? 'Pending Review' : 'Needs Attention'
            }
          : s
      )
    );

    appendAuditLog(
      currentStudent.id,
      `Career Plan Endorsement set to ${endorsementStatus}`,
      'Faculty Endorsement',
      `Statement: "${statement.slice(0, 80)}..." | Official Badge: ${endorsementStatus === 'Approved' ? 'Active' : 'Pending'}`,
      endorsementStatus
    );

    recordFirestoreAction({
      action: `Career Plan Endorsement set to ${endorsementStatus}`,
      type: 'Endorsement',
      category: 'Faculty Endorsement',
      details: `Official Endorsement for ${currentStudent.targetRole}: "${statement}". Highlighted strengths: ${strengths.join(', ')}`,
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      status: endorsementStatus
    });
  };

  // Student specific subsets
  const studentRecommendations = recommendations.filter((r) => r.studentId === currentStudent.id);
  const studentApprovals = approvals.filter((a) => a.studentId === currentStudent.id);
  const studentFeedbacks = feedbacks.filter((f) => f.studentId === currentStudent.id);
  const studentNotes = notes.filter((n) => n.studentId === currentStudent.id);

  // Overall Stats
  const pendingApprovalsCount = approvals.filter((a) => a.status === 'Pending').length;
  const avgReadiness = Math.round(students.reduce((acc, curr) => acc + curr.readinessScore, 0) / students.length);

  // Status Badge Helper
  const renderStatusBadge = (status: 'Pending' | 'Approved' | 'Needs Revision' | 'Rejected' | 'On Track' | 'Pending Review' | 'Needs Attention') => {
    switch (status) {
      case 'Approved':
      case 'On Track':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Approved</span>
          </span>
        );
      case 'Needs Revision':
      case 'Needs Attention':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-amber-400" />
            <span>Needs Revision</span>
          </span>
        );
      case 'Rejected':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
            <XSquare className="w-3 h-3 text-rose-400" />
            <span>Rejected</span>
          </span>
        );
      case 'Pending':
      case 'Pending Review':
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
            <Clock className="w-3 h-3 text-blue-400" />
            <span>Pending</span>
          </span>
        );
    }
  };

  // RBAC ACCESS CONTROL BARRIER
  // Blocks ordinary students and unauthenticated guests from accessing faculty functionality
  if (!isAuthorized) {
    const isSuperAdminEmail = user?.email?.toLowerCase() === 'shynijose14@gmail.com';

    return (
      <div id="faculty-portal-root" className="space-y-6 animate-fade-in pb-16 max-w-4xl mx-auto pt-4">
        {onBack && <BackButton onClick={onBack} />}

        {/* Access Barrier Card */}
        <div className="p-8 sm:p-10 rounded-2xl bg-[#131724] border border-red-500/20 shadow-2xl relative overflow-hidden space-y-6">
          {/* Ambient Security Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

          {/* Header */}
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 shadow-lg shadow-rose-950/40">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-mono font-bold tracking-wide">
                  <Lock className="w-3 h-3" />
                  <span>RESTRICTED ACCESS &bull; FACULTY RBAC GATE</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  Faculty Authorization Required
                </h1>
              </div>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/[0.06] text-right">
              <span className="text-[10px] text-slate-400 block font-mono">Current Auth Role</span>
              <span className="text-xs font-bold text-amber-400 font-mono uppercase">
                {userRole?.role || 'Guest (Student)'}
              </span>
            </div>
          </div>

          {/* Explanation */}
          <div className="relative z-10 space-y-4 text-xs text-slate-300 leading-relaxed">
            <p>
              The <strong>Faculty Mentorship & Advisory Portal</strong> allows institutional mentors to review student academic records, approve and alter learning roadmaps, issue authoritative departmental endorsements, and record advisory notes.
            </p>
            <p className="p-4 rounded-xl bg-slate-950/60 border border-white/[0.06] text-slate-400">
              <strong className="text-white">Security & Student Isolation Guarantee:</strong> To prevent unauthorized tampering with academic records and roadmaps, ordinary student accounts and unauthenticated guests are strictly blocked from writing to the <code className="text-indigo-300 bg-indigo-950/50 px-1.5 py-0.5 rounded font-mono">facultyActions</code> collection and accessing faculty oversight tooling.
            </p>
          </div>

          {/* Account Details Box */}
          <div className="relative z-10 p-4 rounded-xl bg-slate-950/80 border border-white/[0.08] space-y-2.5 font-mono text-[11px]">
            <div className="flex items-center justify-between py-1 border-b border-white/[0.04]">
              <span className="text-slate-400">Authenticated Account:</span>
              <span className="text-white font-semibold">{user?.email || 'None (Guest Mode Session)'}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-white/[0.04]">
              <span className="text-slate-400">Assigned Role:</span>
              <span className="text-amber-400 font-bold uppercase">{userRole?.role || 'student'}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-white/[0.04]">
              <span className="text-slate-400">Token Claims Source:</span>
              <span className="text-slate-300">{userRole?.customClaimsSource || 'Default Student Policy'}</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-400">Firestore Rules Permission:</span>
              <span className="text-rose-400 font-semibold flex items-center gap-1">
                <X className="w-3.5 h-3.5" />
                <span>WRITE FORBIDDEN on /facultyActions</span>
              </span>
            </div>
          </div>

          {/* Superadmin Quick-Resolution notice */}
          {isSuperAdminEmail && (
            <div className="relative z-10 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30 space-y-2">
              <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Superadmin Account Detected ({user?.email})</span>
              </div>
              <p className="text-[11px] text-slate-300">
                You are authenticated with the registered project owner address. Click below to refresh your token claims and gain administrative access.
              </p>
              <button
                type="button"
                onClick={async () => {
                  if (onRefreshRole) {
                    setIsRefreshingClaims(true);
                    await onRefreshRole();
                    setIsRefreshingClaims(false);
                  }
                }}
                disabled={isRefreshingClaims}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer inline-flex items-center gap-2"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isRefreshingClaims ? 'animate-spin' : ''}`} />
                <span>{isRefreshingClaims ? 'Refreshing Token Claims...' : 'Refresh Administrator Role'}</span>
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="relative z-10 flex flex-wrap items-center gap-3 pt-2">
            {onOpenAuth && !user && (
              <button
                type="button"
                onClick={onOpenAuth}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/30 cursor-pointer inline-flex items-center gap-2"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Sign In with Faculty Account</span>
              </button>
            )}

            {onOpenAuth && user && (
              <button
                type="button"
                onClick={onOpenAuth}
                className="px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-white text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <Users className="w-4 h-4 text-indigo-400" />
                <span>Switch to Faculty Institutional Account</span>
              </button>
            )}

            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
              >
                Return to Student Dashboard
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowSecurityAuditModal(!showSecurityAuditModal)}
              className="px-4 py-2.5 rounded-xl bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-500/30 text-indigo-300 text-xs font-semibold transition-all ml-auto cursor-pointer inline-flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{showSecurityAuditModal ? 'Hide RBAC Specs' : 'Inspect RBAC Security Model'}</span>
            </button>
          </div>

          {/* Collapsible RBAC Security Specification for Mini Project Review 3 */}
          {showSecurityAuditModal && (
            <div className="relative z-10 pt-6 border-t border-white/[0.08] space-y-4 animate-fade-in text-xs text-slate-300">
              <div className="flex items-center gap-2 text-indigo-400 font-bold font-mono">
                <Brain className="w-4 h-4" />
                <span>CareerCompass AI &bull; Role-Based Access Control Architecture</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-[11px]">
                <div className="p-3 rounded-xl bg-slate-950 border border-white/[0.06] space-y-1">
                  <span className="text-indigo-400 font-bold block">1. Cryptographic Claims</span>
                  <p className="text-slate-400">
                    Roles are verified via signed Firebase ID Token JWT custom claims (<code className="text-indigo-300">request.auth.token.role == 'faculty'</code>). Client profile fields are ignored.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-white/[0.06] space-y-1">
                  <span className="text-indigo-400 font-bold block">2. Firestore Rule Barrier</span>
                  <p className="text-slate-400">
                    The <code className="text-indigo-300">facultyActions</code> collection enforces <code className="text-indigo-300">isFaculty()</code> on all create/update/delete requests. Students cannot bypass.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-white/[0.06] space-y-1">
                  <span className="text-indigo-400 font-bold block">3. Student Record Isolation</span>
                  <p className="text-slate-400">
                    Students can read/write strictly their own records (<code className="text-indigo-300">userId == request.auth.uid</code>) for profiles, roadmaps, saved items, and assessments.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-white/[0.06] space-y-1">
                  <span className="text-indigo-400 font-bold block">4. Server-Side Custom Claims Minting</span>
                  <p className="text-slate-400">
                    Custom claims are provisioned using Firebase Admin SDK (<code className="text-indigo-300">server/authService.ts</code>) or trusted admin rosters.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div id="faculty-portal-root" className="space-y-6 animate-fade-in pb-16 max-w-7xl mx-auto">
      
      {/* Faculty Portal Header */}
      <div className="p-6 rounded-xl bg-[#131724] border border-white/[0.08] shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-3">
            {onBack && <BackButton onClick={onBack} />}
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>Human-in-the-Loop AI Oversight • Faculty Advisory Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                <span>Faculty Mentorship & Advisory Portal</span>
              </h1>
              <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
                Review student profiles and AI assessments, compare algorithmic recommendations with faculty insight, validate skill gaps, approve learning roadmaps, and submit official endorsements.
              </p>
            </div>
          </div>

          {/* Active Faculty Badge */}
          <div className="p-4 rounded-xl bg-[#0E111B] border border-white/[0.08] flex items-center gap-3.5 shrink-0">
            <div className="w-10 h-10 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold text-sm">
              {user?.email ? user.email.substring(0, 2).toUpperCase() : 'DJ'}
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>{user?.email ? user.email.split('@')[0] : 'Dr. Sarah Jenkins'}</span>
                <span className="p-0.5 rounded-full bg-emerald-500/20 text-emerald-400" title="Verified RBAC Token">
                  <CheckCircle2 className="w-3 h-3" />
                </span>
                <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 text-[9px] font-mono font-bold uppercase">
                  {userRole?.role || 'FACULTY'}
                </span>
              </div>
              <div className="text-[11px] text-indigo-300 font-medium">
                {userRole?.isAdmin ? 'Academic Administrator' : 'Professor & Placement Mentor'}
              </div>
              <div className="text-[10px] text-slate-500">
                {user?.email || 'Dept. of Computer Science & Engineering'}
              </div>
            </div>
          </div>
        </div>

        {/* Sync Status Toast Bar */}
        {firestoreSyncStatus && (
          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{firestoreSyncStatus}</span>
          </div>
        )}

        {/* High Level Key Faculty Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/[0.06]">
          <div className="p-3 rounded-lg bg-[#0E111B] border border-white/[0.06] space-y-1">
            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-400" /> Enrolled Mentees
            </span>
            <div className="text-xl font-bold font-mono text-white">{students.length} Students</div>
          </div>

          <div className="p-3 rounded-lg bg-[#0E111B] border border-white/[0.06] space-y-1">
            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" /> Pending Approvals
            </span>
            <div className="text-xl font-bold font-mono text-amber-400">{pendingApprovalsCount} Action Required</div>
          </div>

          <div className="p-3 rounded-lg bg-[#0E111B] border border-white/[0.06] space-y-1">
            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Avg Career Readiness
            </span>
            <div className="text-xl font-bold font-mono text-emerald-400">{avgReadiness}%</div>
          </div>

          <div className="p-3 rounded-lg bg-[#0E111B] border border-white/[0.06] space-y-1">
            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-indigo-400" /> Faculty Endorsements
            </span>
            <div className="text-xl font-bold font-mono text-indigo-300">
              {students.filter(s => s.endorsement?.status === 'Approved').length} Verified
            </div>
          </div>
        </div>
      </div>

      {/* Student Selection Directory Bar */}
      <div className="p-5 rounded-xl bg-[#131724] border border-white/[0.08] space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold">Select Student for Oversight & Evaluation:</h3>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={studentSearchQuery}
              onChange={(e) => setStudentSearchQuery(e.target.value)}
              placeholder="Search by name, roll number, or role..."
              className="pl-8 pr-3 py-1.5 rounded-lg bg-[#0E111B] border border-white/[0.12] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-64"
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
                className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 relative cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600/15 border-indigo-500/60 shadow-xs ring-1 ring-indigo-500/40'
                    : 'bg-[#0E111B] border-white/[0.06] hover:border-white/[0.15]'
                }`}
              >
                <div className="relative">
                  <img
                    src={st.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                    alt={st.name}
                    className="w-10 h-10 rounded-lg object-cover border border-white/[0.10] shrink-0"
                  />
                  <span className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#0E111B] ${
                    st.status === 'Approved' ? 'bg-emerald-500' : st.status === 'On Track' ? 'bg-indigo-500' : 'bg-amber-500'
                  }`} />
                </div>

                <div className="space-y-0.5 min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white truncate">{st.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">{st.rollNumber}</span>
                  </div>
                  <div className="text-[11px] text-indigo-300 font-medium truncate">{st.targetRole}</div>
                  <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                    <span>CGPA: <strong className="text-white font-mono">{st.cgpa}</strong></span>
                    <span className="text-emerald-400 font-mono font-semibold">{st.readinessScore}% Ready</span>
                  </div>
                  <div className="pt-1 flex items-center justify-between text-[10px]">
                    <span className="text-slate-500">Roadmap:</span>
                    {renderStatusBadge(st.roadmapApprovalStatus || 'Pending')}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Navigation Tabs for Faculty Dashboard */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-[#131724] border border-white/[0.08] overflow-x-auto">
        {[
          { id: 'profile', label: '1. Profile & AI Report', icon: BarChart3, badge: null },
          { id: 'ai-vs-faculty', label: '2. AI vs Faculty Recs', icon: Compass, badge: studentRecommendations.length },
          { id: 'skillgap', label: '3. Skill Gap Analysis', icon: Target, badge: currentStudent.skillGapAnalysis?.missingSkills?.length || 2 },
          { id: 'roadmap', label: '4. Learning Roadmap Review', icon: BookOpen, badge: currentStudent.roadmapApprovalStatus },
          { id: 'approvals', label: '5. Approvals Hub', icon: CheckSquare, badge: pendingApprovalsCount },
          { id: 'endorsement', label: '6. Career Plan Endorsement', icon: Award, badge: currentStudent.endorsement?.status },
          { id: 'feedback', label: '7. Feedback & Evaluation', icon: MessageSquare, badge: studentFeedbacks.length },
          { id: 'notes', label: '8. Advisor Notes', icon: FileText, badge: studentNotes.length },
          { id: 'audit', label: '9. Audit & Transparency Log', icon: History, badge: null }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{tab.label}</span>
              {tab.badge !== null && tab.badge !== undefined && (
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                  isActive ? 'bg-white text-indigo-900 font-bold' : 'bg-indigo-500/20 text-indigo-300'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: STUDENT PROFILE & AI ASSESSMENT REPORT */}
      {/* ========================================================================= */}
      {activeTab === 'profile' && (
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
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-black text-white">{currentStudent.name}</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {currentStudent.rollNumber}
                    </span>
                    {renderStatusBadge(currentStudent.roadmapApprovalStatus || 'Pending')}
                  </div>
                  <p className="text-xs text-slate-300">
                    {currentStudent.department} • {currentStudent.major} ({currentStudent.year})
                  </p>
                  <p className="text-xs text-indigo-300 font-semibold">
                    Target Career Path: <span className="text-white font-bold">{currentStudent.targetRole}</span>
                  </p>
                </div>
              </div>

              {/* Quick Oversight Actions */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setActiveTab('endorsement')}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Endorse Career Plan</span>
                </button>
                <button
                  onClick={() => setActiveTab('feedback')}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Provide Evaluation</span>
                </button>
              </div>

            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
              
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-cyan-400" /> AI Readiness Score
                  </span>
                  <span className="text-[10px] text-cyan-300 font-mono">Algorithmic</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-emerald-400">{currentStudent.readinessScore}%</span>
                  <span className="text-[10px] text-slate-400">Market Benchmark</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${currentStudent.readinessScore}%` }} />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                  <span>Roadmap Progress</span>
                  <Target className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-indigo-400">{currentStudent.milestoneProgress}%</span>
                  <span className="text-[10px] text-slate-400">Milestones Done</span>
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
                  <span className="text-[10px] text-slate-400">Technical & STAR</span>
                </div>
                <p className="text-[11px] text-slate-400">Last Session: Active</p>
              </div>

            </div>
          </div>

          {/* AI Assessment Report Detailed Section (Preserved for Human Review) */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-indigo-500/20 backdrop-blur-xl space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                      🤖 AI Assessment Output (Read-Only)
                    </span>
                    <span className="text-xs text-slate-400">Generated by Gemini 2.5 Multi-Vector Engine</span>
                  </div>
                  <h3 className="text-base font-extrabold text-white">Full AI Career Assessment Report</h3>
                </div>
              </div>

              <span className="text-xs font-mono text-slate-400">
                Report Date: {currentStudent.assessmentReport?.createdAt || '2026-08-01'}
              </span>
            </div>

            {/* Assessment Narrative Summary */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">AI Synthesis Narrative:</span>
              <p className="text-xs text-slate-200 leading-relaxed">
                {currentStudent.assessmentReport?.summary || 'Alex demonstrates strong analytical capabilities, superior foundational math, and robust deep learning competencies. Profile aligns exceptionally well with modern LLM Engineering and MLOps roles.'}
              </p>
            </div>

            {/* Strengths & Weaknesses Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>AI Identified Strengths:</span>
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                  {(currentStudent.assessmentReport?.strengthsAndWeaknesses?.strengths || [
                    'High proficiency in Python, PyTorch, LangChain, and Qdrant',
                    'Completed rigorous 3-month NVIDIA AI Research summer internship',
                    'Excellent quantitative aptitude score (90%) and strong CGPA (3.88)'
                  ]).map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span>AI Identified Growth Areas:</span>
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                  {(currentStudent.assessmentReport?.strengthsAndWeaknesses?.weaknesses || [
                    'Needs deeper hands-on experience with production Kubernetes model serving',
                    'Should expand knowledge of distributed multi-GPU training clusters (DeepSpeed/FSDP)'
                  ]).map((w, idx) => (
                    <li key={idx}>{w}</li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

          {/* Student Portfolio & Achievements Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-indigo-500/20 backdrop-blur-xl space-y-4 shadow-xl">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>Verified Student Projects & Practical Experience</span>
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
                <span>Verified Certifications & Technical Badges</span>
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

      {/* ========================================================================= */}
      {/* TAB 2: AI RECOMMENDATIONS VS FACULTY RECOMMENDATIONS */}
      {/* ========================================================================= */}
      {activeTab === 'ai-vs-faculty' && (
        <div className="space-y-6">
          
          {/* Comparison Header Banner */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-indigo-500/20 backdrop-blur-xl space-y-2 shadow-xl">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-extrabold text-white">
                Human Oversight: AI Recommendations vs Faculty Recommendations
              </h2>
            </div>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Carefully examine the algorithmic match scores generated by the AI assessment model alongside faculty mentors' human wisdom and departmentally endorsed career tracks. Faculty recommendations do not overwrite AI data, maintaining complete transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT COLUMN: 🤖 AI RECOMMENDATIONS (6 cols) */}
            <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900/80 border border-cyan-500/30 backdrop-blur-xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300">
                    <Brain className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-white">🤖 AI Career Recommendations</h3>
                    <span className="text-[10px] text-cyan-300 font-mono">Algorithmic Skill Graph Matches</span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {currentStudent.assessmentReport?.topRecommendations?.length || 3} Roles Match
                </span>
              </div>

              <div className="space-y-3">
                {(currentStudent.assessmentReport?.topRecommendations || [
                  {
                    id: 'rec_ai_01',
                    title: 'AI / ML Engineer',
                    matchScore: 94,
                    shortSummary: 'Designs, trains, fine-tunes, and deploys deep learning models in production.',
                    whyRecommended: 'Scored 95th percentile in ML fundamentals with vector database capstone.',
                    matchingSkills: ['PyTorch', 'Python', 'FastAPI', 'Vector Databases'],
                    missingSkills: ['Kubernetes', 'DeepSpeed'],
                    salaryRanges: { entry: '$115,000', mid: '$155,000', senior: '$210,000' },
                    demandGrowth: '+38% YoY'
                  }
                ]).map((rec) => (
                  <div key={rec.id} className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/20 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="font-extrabold text-sm text-white">{rec.title}</span>
                        <div className="text-[10px] text-slate-400">Demand: <strong className="text-emerald-400">{rec.demandGrowth}</strong></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 font-mono font-extrabold text-xs">
                          {rec.matchScore}% Match
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{rec.shortSummary}</p>

                    <div className="p-2.5 rounded-xl bg-slate-900/80 text-[11px] space-y-1">
                      <div className="text-cyan-300 font-semibold">AI Rationale:</div>
                      <p className="text-slate-300">{rec.whyRecommended}</p>
                    </div>

                    {rec.matchingSkills && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {rec.matchingSkills.map((sk) => (
                          <span key={sk} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 text-[10px] font-mono">
                            ✓ {sk}
                          </span>
                        ))}
                        {rec.missingSkills?.map((ms) => (
                          <span key={ms} className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 text-[10px] font-mono">
                            Gap: {ms}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN: 👨‍🏫 FACULTY RECOMMENDATIONS (6 cols) */}
            <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900/80 border border-indigo-500/30 backdrop-blur-xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-white">👨‍🏫 Faculty Recommendations</h3>
                    <span className="text-[10px] text-indigo-300 font-mono">Human Advisor Endorsements</span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {studentRecommendations.length} Endorsed
                </span>
              </div>

              {/* Form: Add New Faculty Recommendation */}
              <form onSubmit={handleAddRecommendation} className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/30 space-y-3">
                <h4 className="text-xs font-extrabold text-indigo-300 flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Endorse New Career Pathway for {currentStudent.name}:</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newRecTitle}
                    onChange={(e) => setNewRecTitle(e.target.value)}
                    placeholder="Role Title (e.g. LLM Systems Engineer)..."
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    required
                  />
                  <select
                    value={newRecPriority}
                    onChange={(e) => setNewRecPriority(e.target.value as any)}
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="High">High Priority Recommendation</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Secondary Exploration</option>
                  </select>
                </div>

                <textarea
                  value={newRecRationale}
                  onChange={(e) => setNewRecRationale(e.target.value)}
                  rows={2}
                  placeholder="Academic & skills rationale based on student project performance..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                  required
                />

                <button
                  type="submit"
                  className="w-full py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow hover:brightness-110 transition-all flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Faculty Endorsement</span>
                </button>
              </form>

              {/* List of Existing Faculty Recommendations */}
              <div className="space-y-3">
                {studentRecommendations.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-800 rounded-2xl">
                    No faculty recommendations added for this student yet. Use the form above to endorse a career track.
                  </div>
                ) : (
                  studentRecommendations.map((rec) => (
                    <div key={rec.id} className="p-4 rounded-2xl bg-slate-950/80 border border-indigo-500/30 space-y-2">
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
                        <span>Advisor: <strong className="text-slate-200">{rec.recommendedBy}</strong></span>
                        <span className="font-mono text-[10px]">{rec.dateAdded}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SKILL GAP ANALYSIS */}
      {/* ========================================================================= */}
      {activeTab === 'skillgap' && (
        <div className="space-y-6">
          
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-indigo-500/20 backdrop-blur-xl space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-extrabold mb-1">
                  <Target className="w-3.5 h-3.5" />
                  <span>Target Role: {currentStudent.targetRole}</span>
                </div>
                <h3 className="text-xl font-black text-white">
                  Skill Gap & Curriculum Readiness Analysis
                </h3>
                <p className="text-xs text-slate-300 max-w-2xl mt-1">
                  Evaluates {currentStudent.name}'s verified coursework and project competencies against current industry hiring benchmarks.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center shrink-0">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Skill Alignment</span>
                <span className="text-2xl font-black text-emerald-400">{currentStudent.readinessScore}%</span>
              </div>
            </div>

            {/* Completed Skills vs Missing Skill Gaps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Mastered / Completed Skills */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verified Mastered Skills (Student Strengths)</span>
                </h4>

                <div className="space-y-2.5">
                  {(currentStudent.skillGapAnalysis?.completedSkills || [
                    { skill: 'PyTorch & Neural Networks', category: 'Machine Learning', proficiency: 'Mastered', matchReason: 'Completed 4 deep learning projects & specialization' },
                    { skill: 'Python & Data Engineering', category: 'Programming', proficiency: 'Mastered', matchReason: 'Advanced Python OOP, NumPy, Pandas' },
                    { skill: 'RAG & Vector Databases', category: 'AI Architecture', proficiency: 'Proficient', matchReason: 'Built vector search capstone in Qdrant & LangChain' }
                  ]).map((cs, i) => (
                    <div key={i} className="p-3.5 rounded-2xl bg-slate-950/70 border border-emerald-500/20 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">{cs.skill}</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                          {cs.proficiency}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{cs.matchReason}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Missing Skills / Priority Gaps */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-amber-400 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  <span>Identified Skill Gaps (Faculty Oversight Focus)</span>
                </h4>

                <div className="space-y-2.5">
                  {(currentStudent.skillGapAnalysis?.missingSkills || [
                    {
                      id: 'sk_gap_01',
                      skill: 'Kubernetes & Model Serving (KServe / Triton)',
                      category: 'MLOps',
                      priority: 'High',
                      difficulty: 'Advanced',
                      estimatedHours: 40,
                      recommendedCourses: [{ title: 'Kubernetes for Machine Learning Engineers', provider: 'Coursera', level: 'Intermediate' }]
                    },
                    {
                      id: 'sk_gap_02',
                      skill: 'Distributed Multi-GPU Training (FSDP / DeepSpeed)',
                      category: 'AI Infrastructure',
                      priority: 'Medium',
                      difficulty: 'Advanced',
                      estimatedHours: 30,
                      recommendedCourses: [{ title: 'Distributed Deep Learning at Scale', provider: 'DeepLearning.AI', level: 'Advanced' }]
                    }
                  ]).map((ms) => (
                    <div key={ms.id} className="p-3.5 rounded-2xl bg-slate-950/70 border border-amber-500/20 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs">{ms.skill}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ms.priority === 'High' ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-500/20 text-blue-300'
                        }`}>
                          {ms.priority} Priority
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>Estimated Effort: <strong className="text-white">{ms.estimatedHours} Hours</strong></span>
                        <span>Level: <strong className="text-white">{ms.difficulty}</strong></span>
                      </div>

                      {ms.recommendedCourses && ms.recommendedCourses[0] && (
                        <div className="p-2 rounded-xl bg-slate-900 text-[10px] text-indigo-300 flex items-center justify-between">
                          <span>Course: {ms.recommendedCourses[0].title}</span>
                          <span className="text-slate-500">{ms.recommendedCourses[0].provider}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: LEARNING ROADMAP REVIEW & OVERSIGHT */}
      {/* ========================================================================= */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6">
          
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-indigo-500/20 backdrop-blur-xl space-y-6 shadow-xl">
            
            {/* Roadmap Header & Oversight Decision Panel */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-800 pb-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-extrabold">
                    <Target className="w-3.5 h-3.5" />
                    <span>Roadmap Under Faculty Oversight</span>
                  </span>
                  {renderStatusBadge(currentStudent.roadmapApprovalStatus || 'Pending')}
                </div>
                <h3 className="text-xl font-black text-white">
                  {studentRoadmap.roleTitle} Career Roadmap ({currentStudent.name})
                </h3>
                <p className="text-xs text-slate-300 max-w-2xl">
                  {studentRoadmap.overview}
                </p>
              </div>

              {/* Faculty Roadmap Decision Buttons */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 shrink-0">
                <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Faculty Roadmap Decision:</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleRoadmapDecision('Approved', 'All milestones verified by faculty mentor.')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      currentStudent.roadmapApprovalStatus === 'Approved'
                        ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                        : 'bg-slate-900 hover:bg-emerald-700 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>

                  <button
                    onClick={() => handleRoadmapDecision('Needs Revision', 'Revision requested by mentor: adjust timeline and add testing.')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      currentStudent.roadmapApprovalStatus === 'Needs Revision'
                        ? 'bg-amber-600 text-white ring-2 ring-amber-400'
                        : 'bg-slate-900 hover:bg-amber-700 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Request Revision</span>
                  </button>

                  <button
                    onClick={() => handleRoadmapDecision('Rejected', 'Does not align with accredited graduation milestones.')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      currentStudent.roadmapApprovalStatus === 'Rejected'
                        ? 'bg-rose-600 text-white ring-2 ring-rose-400'
                        : 'bg-slate-900 hover:bg-rose-700 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    <XSquare className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Append Milestone Button */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-bold text-slate-300">
                Milestones Breakdown ({studentRoadmap.milestones.length} Phases):
              </span>

              <button
                onClick={() => setIsAddingMilestone(!isAddingMilestone)}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Append Faculty Milestone</span>
              </button>
            </div>

            {/* Form to Append New Faculty Milestone */}
            {isAddingMilestone && (
              <form onSubmit={handleAddRoadmapMilestone} className="p-5 rounded-2xl bg-slate-950 border border-indigo-500/40 space-y-4">
                <h4 className="text-xs font-extrabold text-indigo-300">Append Custom Milestone (Preserves AI Baseline):</h4>
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

      {/* ========================================================================= */}
      {/* TAB 5: APPROVALS HUB */}
      {/* ========================================================================= */}
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
                {(['All', 'Pending', 'Approved', 'Needs Revision', 'Rejected'] as const).map((st) => (
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
                        {renderStatusBadge(req.status)}
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{req.description}</p>

                    {req.facultyComment && (
                      <div className="p-3 rounded-xl bg-slate-900 border border-indigo-500/20 text-xs text-indigo-200 flex items-start gap-2">
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-white">Faculty Comment ({req.reviewedDate}):</strong> {req.facultyComment}
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
                            setPendingActionType('Needs Revision');
                            setFacultyApprovalComment('Please revise the project milestones to include testing.');
                          }}
                          className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                        >
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Request Revision</span>
                        </button>

                        <button
                          onClick={() => {
                            setSelectedApprovalModal(req);
                            setPendingActionType('Rejected');
                            setFacultyApprovalComment('Does not meet departmental credit criteria.');
                          }}
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

      {/* ========================================================================= */}
      {/* TAB 6: CAREER PLAN ENDORSEMENT PORTAL */}
      {/* ========================================================================= */}
      {activeTab === 'endorsement' && (
        <div className="space-y-6">
          
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-indigo-500/20 backdrop-blur-xl space-y-6 shadow-xl">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[11px] font-extrabold">
                  <Award className="w-3.5 h-3.5" />
                  <span>Institutional Human Oversight & Endorsement</span>
                </div>
                <h3 className="text-xl font-black text-white">
                  Endorse Student Career Plan ({currentStudent.name})
                </h3>
                <p className="text-xs text-slate-300 max-w-2xl">
                  Issue an official academic mentor endorsement for {currentStudent.name}'s target career path in <strong>{currentStudent.targetRole}</strong>. This verified credential is shared with campus recruiters and placement teams.
                </p>
              </div>

              {/* Current Endorsement Status Badge */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center shrink-0">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Endorsement Status</span>
                <div className="pt-1">
                  {renderStatusBadge(currentStudent.endorsement?.status || 'Pending')}
                </div>
              </div>
            </div>

            {/* Official Endorsement Certificate Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950/80 via-slate-950 to-purple-950/80 border-2 border-indigo-500/40 space-y-4 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <ShieldCheck className="w-64 h-64 text-white" />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-300 font-bold block">
                      University Departmental Endorsement
                    </span>
                    <h4 className="text-lg font-black text-white">{currentStudent.targetRole} Endorsement</h4>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400 block">Institutional Stamp:</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {currentStudent.endorsement?.institutionalStamp || 'VERIFIED_FACULTY_OVERSIGHT_COUNCIL'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-200 italic leading-relaxed pt-2 border-t border-slate-800">
                "{currentStudent.endorsement?.endorsementStatement || 'Alex exhibits top-tier mathematical aptitude and project execution in PyTorch and Vector Retrieval systems. Highly recommended for Senior AI Apprenticeships and ML Engineering campus placements.'}"
              </p>

              {/* Endorsed Strengths Chips */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Highlighted Student Competencies:</span>
                <div className="flex flex-wrap gap-2">
                  {(currentStudent.endorsement?.strengthsHighlighted || [
                    'Deep PyTorch Mastery',
                    'Vector DB Architecture',
                    'Outstanding 3.88 CGPA',
                    'Strong Academic Integrity'
                  ]).map((st, i) => (
                    <span key={i} className="px-3 py-1 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
                      ★ {st}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs text-slate-400">
                <span>Signed by: <strong className="text-white">{currentStudent.endorsement?.endorsedBy || 'Dr. Sarah Jenkins'}</strong> ({currentStudent.endorsement?.facultyDesignation || 'Professor & Placement Mentor'})</span>
                <span className="font-mono text-[11px]">Date: {currentStudent.endorsement?.dateEndorsed || '2026-08-05'}</span>
              </div>
            </div>

            {/* Form: Update or Grant Official Endorsement */}
            <form onSubmit={handleSaveEndorsement} className="p-6 rounded-3xl bg-slate-950 border border-indigo-500/30 space-y-4">
              <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-400" />
                <span>Configure Mentor Endorsement Details:</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Approval Status:</label>
                  <select
                    value={endorsementStatus}
                    onChange={(e) => setEndorsementStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Approved">Approved (Official Endorsement Issued)</option>
                    <option value="Pending">Pending (Under Evaluation)</option>
                    <option value="Needs Revision">Needs Revision (Additional Milestones Required)</option>
                    <option value="Rejected">Rejected (Not Endorsed)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Target Role Title:</label>
                  <input
                    type="text"
                    value={currentStudent.targetRole}
                    disabled
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Official Endorsement Statement:</label>
                <textarea
                  value={endorsementStatement || (currentStudent.endorsement?.endorsementStatement || '')}
                  onChange={(e) => setEndorsementStatement(e.target.value)}
                  rows={3}
                  placeholder="Provide authoritative faculty rationale validating the student's capability for this role..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl text-xs font-extrabold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:brightness-110 text-white shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <Award className="w-4 h-4" />
                <span>Save & Issue Faculty Endorsement</span>
              </button>
            </form>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: FEEDBACK & EVALUATION */}
      {/* ========================================================================= */}
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

      {/* ========================================================================= */}
      {/* TAB 8: ADVISOR NOTES */}
      {/* ========================================================================= */}
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
                              <Lock className="w-3 h-3" /> Private (Faculty Only)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                              <Globe className="w-3 h-3" /> Shared with Student
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

      {/* ========================================================================= */}
      {/* TAB 9: AUDIT & TRANSPARENCY LOG (HUMAN-AI OVERSIGHT HISTORY) */}
      {/* ========================================================================= */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-indigo-500/20 backdrop-blur-xl space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-extrabold">
                  <History className="w-3.5 h-3.5" />
                  <span>Immutable Human-AI Oversight Audit Trail</span>
                </div>
                <h3 className="text-xl font-black text-white">
                  Decision History & Transparency Log ({currentStudent.name})
                </h3>
                <p className="text-xs text-slate-300 max-w-3xl">
                  Chronological history preserving original AI outputs alongside faculty interventions, approvals, endorsements, and milestone modifications. Ensures accountability and academic data integrity.
                </p>
              </div>

              <span className="text-xs font-bold text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                {(currentStudent.auditTrail?.length || 3)} Events Logged
              </span>
            </div>

            {/* Chronological Audit Feed */}
            <div className="space-y-3">
              {(currentStudent.auditTrail || [
                {
                  id: 'aud_01',
                  timestamp: '2026-08-01 09:30',
                  actor: '🤖 AI Assessment Engine (Gemini 2.5)',
                  action: 'Generated 12-Dimension Career Assessment Report',
                  category: 'AI Assessment',
                  details: 'Evaluated academic records, projects, and aptitude test. Computed initial 88% readiness score for AI/ML Engineer.',
                  status: 'Pending'
                },
                {
                  id: 'aud_02',
                  timestamp: '2026-08-02 14:15',
                  actor: 'Dr. Sarah Jenkins (Advisor)',
                  action: 'Faculty Reviewed AI Assessment & Profile',
                  category: 'Faculty Endorsement',
                  details: 'Validated NVIDIA internship and verified capstone source repository. Added positive advisement note.',
                  status: 'Pending'
                },
                {
                  id: 'aud_03',
                  timestamp: '2026-08-04 11:20',
                  actor: 'Dr. Sarah Jenkins (Advisor)',
                  action: 'Submitted Structured Evaluation Feedback',
                  category: 'Feedback Added',
                  details: 'Assigned 5-star rating on career trajectory with 2 key action items for GitHub README publishing.',
                  status: 'Pending'
                }
              ]).map((log, idx) => (
                <div key={log.id || idx} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        log.category === 'AI Assessment'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : log.category === 'Faculty Endorsement'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : log.category === 'Roadmap Approval'
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {log.category}
                      </span>
                      <h4 className="text-xs font-bold text-white">{log.action}</h4>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                      <span>{log.timestamp}</span>
                      {log.status && renderStatusBadge(log.status)}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{log.details}</p>

                  <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
                    Actor: <strong className="text-slate-200">{log.actor}</strong>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      )}

      {/* Revision Request / Approval Comment Modal */}
      {selectedApprovalModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-indigo-400" />
                <span>Faculty Review: {pendingActionType}</span>
              </h3>
              <button
                onClick={() => setSelectedApprovalModal(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Provide formal feedback or revision requirements for <strong>{selectedApprovalModal.studentName}</strong>'s request: "<em>{selectedApprovalModal.title}</em>".
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
                onClick={() => handleApprovalAction(selectedApprovalModal, pendingActionType, facultyApprovalComment)}
                className={`px-4 py-2 rounded-xl text-white text-xs font-bold shadow ${
                  pendingActionType === 'Approved' ? 'bg-emerald-600 hover:bg-emerald-500' :
                  pendingActionType === 'Needs Revision' ? 'bg-amber-600 hover:bg-amber-500' : 'bg-rose-600 hover:bg-rose-500'
                }`}
              >
                Confirm {pendingActionType}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
