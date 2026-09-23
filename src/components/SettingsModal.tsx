import React from 'react';
import { 
  X, 
  Settings as SettingsIcon, 
  User as UserIcon,
} from 'lucide-react';
import { ThemeSettingsSection } from './ThemeSettingsSection';
import { AppThemeId, ProfileExperienceId } from '../themes/types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToProfile?: () => void;
  onAppThemeSaved?: (themeId: AppThemeId) => void;
  onProfileExperienceSaved?: (expId: ProfileExperienceId) => void;
  onThemeSavedToProfile?: (themeId: any) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onNavigateToProfile,
  onProfileExperienceSaved,
  onThemeSavedToProfile
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl bg-[#131724] border border-white/[0.08] shadow-xl p-6 sm:p-8 text-slate-100 transition-all duration-300">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 shadow-xs">
              <SettingsIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 id="settings-modal-title" className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Profile Personalization & Preferences
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Customize your personal student identity card, avatar frame, and showcase badges.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#0E111B] hover:bg-white/[0.06] text-slate-300 hover:text-white transition-all cursor-pointer"
            aria-label="Close settings modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="py-6 space-y-6">
          <ThemeSettingsSection 
            onProfileExperienceChanged={onProfileExperienceSaved}
            onThemeChanged={onThemeSavedToProfile} 
          />

          {/* Quick Profile Navigation */}
          {onNavigateToProfile && (
            <div className="p-4 rounded-xl bg-[#0E111B] border border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                  <UserIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-white">Full Student Profile Editor</h4>
                  <p className="text-[11px] text-slate-400">
                    Manage coursework, projects, internships, certifications, and technical skills.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToProfile();
                }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-all cursor-pointer shadow-xs"
              >
                Go to Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
