import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  User as UserIcon, 
  Sparkles, 
  Map, 
  FileText, 
  MessageSquare, 
  Bookmark, 
  LogOut, 
  LogIn, 
  Briefcase, 
  Award, 
  AlertTriangle, 
  BarChart3, 
  TrendingUp, 
  GraduationCap, 
  Sliders, 
  Settings,
  Menu,
  X,
  ChevronDown,
  Palette,
  ShieldCheck,
  Zap,
  ArrowLeft,
  Navigation2
} from 'lucide-react';
import { User } from 'firebase/auth';
import { sendEmailVerification } from '../lib/firebase';
import { StudentProfile, UserAuthRole } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User | null;
  userRole?: UserAuthRole | null;
  profile?: StudentProfile;
  onOpenAuth: () => void;
  onSignOut: () => void;
  isDarkMode?: boolean;
  setIsDarkMode?: (val: boolean | ((prev: boolean) => boolean)) => void;
  savedCount: number;
  onOpenSettings?: () => void;
  onOpenThemeModal?: () => void;
  onBack?: () => void;
  canGoBack?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  user,
  userRole,
  profile,
  onOpenAuth,
  onSignOut,
  savedCount,
  onOpenSettings,
  onOpenThemeModal,
  onBack,
  canGoBack = false,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [exploreMenuOpen, setExploreMenuOpen] = useState(false);
  const [prepMenuOpen, setPrepMenuOpen] = useState(false);

  // Close drawer on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        setIsDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen]);

  const navItems = [
    { id: 'discover', label: 'AI Matches', icon: Sparkles },
    { id: 'assessment', label: 'Assessment', icon: Award },
    { id: 'explorer', label: 'Career Explorer', icon: Compass },
    { id: 'roadmap', label: 'Roadmap', icon: Map },
    { id: 'resume', label: 'Resume Analyzer', icon: FileText },
    { id: 'interview', label: 'Interview Prep', icon: MessageSquare },
    { id: 'skillgap', label: 'Skill Gap', icon: BarChart3 },
    { id: 'jobmarket', label: 'Market Trends', icon: TrendingUp },
    { id: 'scenario', label: 'What-If Simulator', icon: Sliders },
    { id: 'chat', label: 'AI Advisor', icon: Sparkles },
    { id: 'saved', label: 'Saved', icon: Bookmark, badge: savedCount },
    { id: 'faculty', label: 'Faculty Hub', icon: GraduationCap },
    { id: 'profile', label: 'Profile', icon: UserIcon },
  ];

  const handleSelectNav = (id: string) => {
    setActiveTab(id);
    setIsDrawerOpen(false);
    setExploreMenuOpen(false);
    setPrepMenuOpen(false);
  };

  const handleResendVerification = async () => {
    if (user && !user.emailVerified) {
      try {
        await sendEmailVerification(user);
        setVerificationSent(true);
        setTimeout(() => setVerificationSent(false), 6000);
      } catch (err) {
        console.error('Failed to resend verification:', err);
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0E111B]/95 backdrop-blur-md border-b border-white/[0.08]">
      {/* Email Verification Banner */}
      {user && !user.emailVerified && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-xs text-amber-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Please verify your email address to unlock cloud synchronization.</span>
          </div>
          <button
            type="button"
            onClick={handleResendVerification}
            disabled={verificationSent}
            className="underline hover:text-amber-200 font-semibold cursor-pointer ml-2"
          >
            {verificationSent ? 'Verification link sent!' : 'Resend link'}
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo & Back Button */}
          <div className="flex items-center gap-3">
            {canGoBack && onBack && (
              <button
                type="button"
                onClick={onBack}
                aria-label="Go back to previous view"
                className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white border border-white/[0.06] transition-colors cursor-pointer"
                title="Go back"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}

            <div 
              onClick={() => handleSelectNav('discover')} 
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30 ring-1 ring-white/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-indigo-500/50">
                <Navigation2 className="w-5 h-5 text-white fill-white/20 -rotate-12 transition-transform duration-300 group-hover:rotate-0" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                  <span>CareerCompass</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">AI</span>
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Student Career Navigation</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
            {/* Primary quick links */}
            <button
              type="button"
              onClick={() => handleSelectNav('discover')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'discover'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Matches</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectNav('assessment')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'assessment'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Assessment</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectNav('explorer')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'explorer'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explorer</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectNav('roadmap')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'roadmap'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Roadmap</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectNav('resume')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'resume'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Resume</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectNav('interview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'interview'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Interview</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectNav('skillgap')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'skillgap'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Skill Gap</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectNav('jobmarket')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'jobmarket'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Market</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectNav('scenario')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'scenario'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>What-If</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectNav('chat')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'chat'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Advisor</span>
            </button>
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center gap-2">
            
            {/* Saved items button */}
            <button
              type="button"
              onClick={() => handleSelectNav('saved')}
              className={`p-2 rounded-xl border transition-all relative cursor-pointer ${
                activeTab === 'saved'
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-white/[0.04] text-slate-300 hover:text-white border-white/[0.06] hover:bg-white/[0.08]'
              }`}
              title="Saved Careers & Roadmaps"
            >
              <Bookmark className="w-4 h-4" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Theme Studio Button */}
            {onOpenThemeModal && (
              <button
                type="button"
                onClick={onOpenThemeModal}
                className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.06] transition-colors cursor-pointer"
                title="Theme Studio"
              >
                <Palette className="w-4 h-4 text-indigo-400" />
              </button>
            )}

            {/* Settings Button */}
            {onOpenSettings && (
              <button
                type="button"
                onClick={onOpenSettings}
                className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.06] transition-colors cursor-pointer"
                title="Settings & Preferences"
              >
                <Settings className="w-4 h-4" />
              </button>
            )}

            {/* Profile Button */}
            <button
              type="button"
              onClick={() => handleSelectNav('profile')}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-white/[0.04] text-slate-300 hover:text-white border-white/[0.06] hover:bg-white/[0.08]'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Profile</span>
              {userRole && user && (
                <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase hidden md:inline ${
                  userRole.isAdmin 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : userRole.isFaculty
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {userRole.role}
                </span>
              )}
            </button>

            {/* Auth / Sign In Button */}
            {user ? (
              <button
                type="button"
                onClick={onSignOut}
                className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors cursor-pointer"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              type="button"
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.06] cursor-pointer"
              aria-label="Toggle navigation drawer"
            >
              {isDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isDrawerOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 bg-[#0E111B]/98 border-b border-white/[0.10] p-4 max-h-[85vh] overflow-y-auto space-y-2 shadow-2xl backdrop-blur-lg">
          <div className="grid grid-cols-2 gap-2 pb-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectNav(item.id)}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2.5 transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                      : 'bg-white/[0.03] text-slate-300 hover:text-white border-white/[0.06] hover:bg-white/[0.06]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0 text-indigo-400" />
                  <span className="truncate">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-auto bg-amber-500 text-black text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-400">
            <span>{user ? `Signed in as ${user.email?.split('@')[0]}` : 'Guest Student Mode'}</span>
            {user && (
              <button
                type="button"
                onClick={onSignOut}
                className="text-red-400 hover:text-red-300 font-semibold cursor-pointer"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
