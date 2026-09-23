import React, { useState } from 'react';
import { 
  User, 
  Sparkles, 
  Target, 
  GraduationCap, 
  Award, 
  Check, 
  Plus, 
  Trash2, 
  Edit3, 
  Bookmark, 
  Palette, 
  Building, 
  LogOut, 
  LogIn, 
  ChevronRight,
  TrendingUp,
  FileText,
  MessageSquare,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'motion/react';
import { StudentProfile, SavedCareerItem, CareerRoadmap, UserAuthRole } from '../types';
import { FirebaseUser } from '../lib/firebase';

interface ProfileViewProps {
  profile: StudentProfile;
  user: FirebaseUser | null;
  userRole?: UserAuthRole | null;
  savedCareers: SavedCareerItem[];
  savedRoadmaps: CareerRoadmap[];
  onOpenAuth: () => void;
  onSignOut: () => void;
  onOpenThemeModal: () => void;
  onOpenProfileExperienceModal: () => void;
  onNavigateToTab: (tab: string) => void;
  onUpdateProfile: (updated: Partial<StudentProfile>) => void;
  onOpenEditProfileModal: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  user,
  userRole,
  savedCareers,
  savedRoadmaps,
  onOpenAuth,
  onSignOut,
  onOpenThemeModal,
  onOpenProfileExperienceModal,
  onNavigateToTab,
  onUpdateProfile,
  onOpenEditProfileModal
}) => {
  const [newSkillInput, setNewSkillInput] = useState('');
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [targetRoleInput, setTargetRoleInput] = useState(profile.dreamRole || 'AI / Machine Learning Engineer');

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillInput.trim()) return;
    if (profile.skills.includes(newSkillInput.trim())) {
      setNewSkillInput('');
      return;
    }
    const updatedSkills = [...profile.skills, newSkillInput.trim()];
    onUpdateProfile({ skills: updatedSkills });
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updatedSkills = profile.skills.filter(s => s !== skillToRemove);
    onUpdateProfile({ skills: updatedSkills });
  };

  const handleSaveTargetRole = () => {
    if (!targetRoleInput.trim()) return;
    onUpdateProfile({ dreamRole: targetRoleInput.trim() });
    setIsEditingTarget(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10 pb-20">
      
      {/* 1. IDENTITY & TARGET ROLE HEADER */}
      <section className="p-6 sm:p-8 rounded-2xl bg-[#131724] border border-white/[0.08] relative overflow-hidden shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-xl font-mono shrink-0">
              {profile.major ? profile.major.substring(0, 2).toUpperCase() : 'CC'}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {user?.email ? user.email.split('@')[0] : 'Student Scholar'}
                </h2>
                {userRole && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${
                    userRole.isAdmin
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : userRole.isFaculty
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}>
                    Role: {userRole.role}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {profile.major || 'Computer Science'} &bull; {profile.university || 'University'} &bull; Class of {profile.gradYear || '2026'}
              </p>
              <div className="text-[10px] text-slate-500 flex items-center gap-1 font-mono pt-0.5">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Firestore Security: Student Isolated Storage (userId == auth.uid)</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenEditProfileModal}
            className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer inline-flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Full Profile</span>
          </button>
        </div>

        {/* Target Career Field */}
        <div className="pt-4 border-t border-white/[0.06] space-y-2">
          <span className="text-[10px] font-mono uppercase font-bold text-indigo-400 tracking-wider block">
            Target Career
          </span>

          {isEditingTarget ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={targetRoleInput}
                onChange={(e) => setTargetRoleInput(e.target.value)}
                placeholder="e.g. Full-Stack Engineer, AI Specialist..."
                className="px-3 py-1.5 rounded-lg bg-[#0E111B] border border-indigo-500/50 text-xs text-white focus:outline-none flex-1 max-w-sm"
              />
              <button
                type="button"
                onClick={handleSaveTargetRole}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 cursor-pointer"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditingTarget(false)}
                className="px-2 py-1.5 text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">
                {profile.dreamRole || 'AI / Machine Learning Engineer'}
              </h3>
              <button
                type="button"
                onClick={() => setIsEditingTarget(true)}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
              >
                Change Target
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 2. PROGRESS METRICS (How ready you are, Resume, Interview) */}
      <section className="grid grid-cols-3 gap-3 text-center">
        <div className="p-4 rounded-xl bg-[#131724] border border-white/[0.06] space-y-1">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">
            Readiness
          </span>
          <span className="text-xl font-extrabold font-mono text-emerald-400">
            62%
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#131724] border border-white/[0.06] space-y-1">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">
            Resume Score
          </span>
          <span className="text-xl font-extrabold font-mono text-white">
            78 <span className="text-xs text-slate-500">/ 100</span>
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#131724] border border-white/[0.06] space-y-1">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">
            Interview Prep
          </span>
          <span className="text-xl font-extrabold font-mono text-indigo-400">
            64%
          </span>
        </div>
      </section>

      {/* 3. SKILLS INVENTORY (Direct Chip Array) */}
      <section className="p-6 rounded-2xl bg-[#131724] border border-white/[0.06] space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">
            Your Skills ({profile.skills.length})
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {profile.skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1.5 rounded-lg bg-[#0E111B] border border-white/[0.08] text-xs text-slate-200 flex items-center gap-1.5 group"
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
              >
                &times;
              </button>
            </span>
          ))}
        </div>

        <form onSubmit={handleAddSkill} className="flex items-center gap-2 pt-2">
          <input
            type="text"
            placeholder="Add a new skill (e.g. Docker, GraphQL)..."
            value={newSkillInput}
            onChange={(e) => setNewSkillInput(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-[#0E111B] border border-white/[0.08] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 flex-1 max-w-sm"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-indigo-600 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
          >
            + Add
          </button>
        </form>
      </section>

      {/* 4. ACTIONS & SETTINGS LIST */}
      <section className="p-6 rounded-2xl bg-[#131724] border border-white/[0.06] divide-y divide-white/[0.06]">
        
        {/* Saved Careers */}
        <div 
          onClick={() => onNavigateToTab('saved')}
          className="py-3.5 flex items-center justify-between cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <Bookmark className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
              Saved Careers & Roadmaps
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>{savedCareers.length + savedRoadmaps.length} saved</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Theme & Styling */}
        <div 
          onClick={onOpenThemeModal}
          className="py-3.5 flex items-center justify-between cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <Palette className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
              Theme & Experience Style
            </span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </div>

        {/* Faculty & Administrative Portal */}
        <div 
          onClick={() => onNavigateToTab('faculty')}
          className="py-3.5 flex items-center justify-between cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <Building className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
              Faculty & Institutional Portal
            </span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </div>

        {/* Auth / Sign In / Sign Out */}
        <div className="py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold text-slate-200">
              {user ? `Signed in as ${user.email}` : 'Guest Student'}
            </span>
          </div>

          {user ? (
            <button
              type="button"
              onClick={onSignOut}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
            >
              Sign Out
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
            >
              Sign In / Sync
            </button>
          )}
        </div>

      </section>

    </div>
  );
};
