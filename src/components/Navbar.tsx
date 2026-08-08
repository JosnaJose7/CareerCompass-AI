import React, { useState } from 'react';
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
  Sun, 
  Moon,
  Briefcase,
  Award,
  AlertTriangle,
  MailCheck,
  BarChart3,
  TrendingUp,
  GraduationCap
} from 'lucide-react';
import { User } from 'firebase/auth';
import { sendEmailVerification } from '../lib/firebase';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User | null;
  onOpenAuth: () => void;
  onSignOut: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  user,
  onOpenAuth,
  onSignOut,
  isDarkMode,
  setIsDarkMode,
  savedCount,
}) => {
  const [verificationSent, setVerificationSent] = useState(false);

  const navItems = [
    { id: 'discover', label: 'AI Discovery', icon: Sparkles },
    { id: 'jobmarket', label: 'Job Market', icon: TrendingUp },
    { id: 'explorer', label: 'Career Explorer', icon: Briefcase },
    { id: 'profile', label: 'Student Profile', icon: UserIcon },
    { id: 'skillgap', label: 'Skill Gap', icon: BarChart3 },
    { id: 'roadmap', label: 'Career Roadmap', icon: Map },
    { id: 'resume', label: 'Resume Analyzer', icon: FileText },
    { id: 'interview', label: 'Interview Prep', icon: Award },
    { id: 'advisor', label: 'AI Mentor', icon: MessageSquare },
    { id: 'faculty', label: 'Faculty Portal', icon: GraduationCap },
    { id: 'saved', label: 'Saved Paths', icon: Bookmark, badge: savedCount },
  ];

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
    <header className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-[#080910]/80 border-slate-800/80 text-slate-100' 
        : 'bg-white/80 border-slate-200/80 text-slate-800 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Name */}
          <div 
            onClick={() => setActiveTab('discover')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5" />
              <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                  CareerCompass
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  AI
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400 hidden sm:block">
                University Career Discovery Platform
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/40 dark:bg-slate-950/60 p-1.5 rounded-2xl border border-slate-800/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-900/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-purple-500/30 text-purple-200 border border-purple-400/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* Dark/Light mode toggle */}
            <button
              onClick={() => setIsDarkMode(prev => !prev)}
              title="Toggle Theme"
              className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-all"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            {/* Auth Button / Profile Badge */}
            {user ? (
              <div className="flex items-center gap-2">
                {!user.emailVerified && user.email && (
                  <button
                    onClick={handleResendVerification}
                    title="Email unverified. Click to resend verification link."
                    className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-medium hover:bg-amber-500/20 transition-all"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{verificationSent ? 'Link Sent!' : 'Verify Email'}</span>
                  </button>
                )}

                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold text-[10px]">
                    {user.email?.charAt(0).toUpperCase() || 'S'}
                  </div>
                  <span className="text-slate-200 max-w-[110px] truncate">
                    {user.displayName || user.email?.split('@')[0] || 'Student'}
                  </span>
                </div>

                <button
                  onClick={onSignOut}
                  title="Sign Out"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/20 transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-900/20 hover:brightness-110 active:scale-95 transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In / Sync</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Horizontal Scroll Bar */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold'
                    : 'bg-slate-900/60 text-slate-400 border border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="ml-0.5 px-1.5 text-[10px] rounded-full bg-purple-500/30 text-purple-200">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

