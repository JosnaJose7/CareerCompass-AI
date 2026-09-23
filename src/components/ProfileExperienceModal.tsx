import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Sparkles, 
  BookOpen, 
  ShieldAlert, 
  Gamepad2, 
  Flame, 
  Music, 
  Trophy, 
  Film,
  User as UserIcon, 
  CheckCircle2
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { PROFILE_EXPERIENCE_LIST, PROFILE_EXPERIENCES } from '../themes/themeConfig';
import { ProfileExperienceId, ProfileExperienceConfig } from '../themes/types';

interface ProfileExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExperience?: (experienceId: ProfileExperienceId) => void;
}

const EXP_ICONS: Record<ProfileExperienceId, React.ElementType> = {
  'professional': Sparkles,
  'kpop': Music,
  'anime': Flame,
  'sports': Trophy,
  'gaming': Gamepad2,
  'dark-fantasy': ShieldAlert,
  'fantasy': ShieldAlert,
  'dark-academia': BookOpen,
  'cinematic': Film
};

export const ProfileExperienceModal: React.FC<ProfileExperienceModalProps> = ({
  isOpen,
  onClose,
  onSelectExperience
}) => {
  const { profileExperienceId, setProfileExperience } = useTheme();
  const [selectedExpId, setSelectedExpId] = useState<ProfileExperienceId>(profileExperienceId);

  if (!isOpen) return null;

  const handleApply = (id: ProfileExperienceId) => {
    setSelectedExpId(id);
    setProfileExperience(id);
    if (onSelectExperience) {
      onSelectExperience(id);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl rounded-3xl bg-white border border-[#EDE2E8] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#EDE2E8]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F5ECF2] text-[#382436] border border-[#E4D4DE] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#A37790]" />
              <span>Student Profile Personalization</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#261B24] tracking-tight">
              Select Your Profile Persona Archetype
            </h2>
            <p className="text-xs sm:text-sm text-[#685665] mt-1">
              Customize your student profile showcase card, readiness metric titles, and avatar credentials.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#685665] hover:text-[#261B24] hover:bg-[#FAF4F7] transition-colors shrink-0"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Experience Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {PROFILE_EXPERIENCE_LIST.map((exp) => {
            const isSelected = selectedExpId === exp.id;
            const Icon = EXP_ICONS[exp.id] || Sparkles;

            return (
              <div
                key={exp.id}
                onClick={() => setSelectedExpId(exp.id)}
                className={`p-4 rounded-2xl border text-left transition-all relative group cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#382436] bg-[#FAF4F7] ring-2 ring-[#382436]/10 shadow-sm'
                    : 'border-[#EDE2E8] bg-white hover:border-[#A37790] hover:bg-[#FAF7F8]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#F5ECF2] text-[#382436] border border-[#E4D4DE]">
                      {exp.categoryBadge}
                    </span>
                    <Icon className="w-4 h-4 text-[#A37790]" />
                  </div>

                  <h3 className="font-bold text-sm text-[#261B24]">
                    {exp.name}
                  </h3>
                  <p className="text-xs text-[#685665] mt-1 leading-relaxed line-clamp-2">
                    {exp.shortDescription}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#EDE2E8] flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#382436]">
                    {exp.readinessMetricName}
                  </span>
                  
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-[#382436] text-white flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EDE2E8]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#EDE2E8] bg-white text-[#685665] hover:text-[#261B24] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleApply(selectedExpId)}
            className="px-5 py-2 text-xs font-bold rounded-xl bg-[#382436] hover:bg-[#2B1A2A] text-white transition-all shadow-sm"
          >
            Apply to Profile
          </button>
        </div>
      </div>
    </div>
  );
};
