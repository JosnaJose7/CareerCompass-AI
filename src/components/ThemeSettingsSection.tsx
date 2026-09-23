import React, { useState } from 'react';
import { 
  User, 
  Sparkles, 
  Check, 
  Palette, 
  Award, 
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { PROFILE_EXPERIENCE_LIST } from '../themes/themeConfig';
import { ProfileExperienceId } from '../themes/types';

interface ThemeSettingsSectionProps {
  onAppThemeChanged?: (themeId: any) => void;
  onProfileExperienceChanged?: (expId: ProfileExperienceId) => void;
  onThemeChanged?: (themeId: any) => void;
}

const PROFILE_ACCENT_COLORS = [
  { id: 'mauve', name: 'Dusty Mauve', hex: '#B58A9F', bg: 'bg-[#B58A9F]' },
  { id: 'blush', name: 'Soft Blush', hex: '#DDA5B6', bg: 'bg-[#DDA5B6]' },
  { id: 'lavender', name: 'Dreamy Lavender', hex: '#B0A4C8', bg: 'bg-[#B0A4C8]' },
  { id: 'rose', name: 'Soft Rose', hex: '#E08E9B', bg: 'bg-[#E08E9B]' },
  { id: 'plum', name: 'Deep Plum', hex: '#663A5B', bg: 'bg-[#663A5B]' },
  { id: 'champagne', name: 'Warm Champagne', hex: '#C5A880', bg: 'bg-[#C5A880]' },
];

const PROFILE_BANNERS = [
  { id: 'blush-glow', name: 'Soft Blush Glow', gradient: 'from-[#6E334E] via-[#A65B7D] to-[#4A2033]' },
  { id: 'lavender-aurora', name: 'Lavender Aurora', gradient: 'from-[#46315D] via-[#6B4E8C] to-[#2E1F40]' },
  { id: 'plum-twilight', name: 'Plum Twilight', gradient: 'from-[#382436] via-[#4F2D4A] to-[#2B1A2A]' },
  { id: 'warm-bronze', name: 'Warm Bronze Silk', gradient: 'from-[#4F361E] via-[#7D5B38] to-[#332212]' },
  { id: 'mauve-dusk', name: 'Mauve Dusk', gradient: 'from-[#422238] via-[#6B3B5B] to-[#2B1524]' },
];

export const ThemeSettingsSection: React.FC<ThemeSettingsSectionProps> = ({
  onProfileExperienceChanged,
}) => {
  const { 
    profileExperienceId, 
    setProfileExperience, 
    currentProfileExperience 
  } = useTheme();

  const [selectedAccent, setSelectedAccent] = useState(PROFILE_ACCENT_COLORS[0].id);
  const [selectedBanner, setSelectedBanner] = useState(PROFILE_BANNERS[0].id);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleSelectExp = (id: ProfileExperienceId) => {
    setProfileExperience(id);
    if (onProfileExperienceChanged) onProfileExperienceChanged(id);
    setSaveStatus('Profile Persona Updated');
    setTimeout(() => setSaveStatus(null), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Palette className="w-4 h-4" />
            </span>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Profile Personalization & Persona
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Customize your personal student identity card, avatar frame, and showcase badges.
          </p>
        </div>

        {saveStatus && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-fade-in">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {saveStatus}
          </span>
        )}
      </div>

      {/* 1. Student Persona & Identity Archetype */}
      <div className="space-y-3">
        <label className="text-xs font-mono uppercase tracking-wider text-indigo-400 block font-semibold">
          Select Profile Persona Archetype
        </label>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PROFILE_EXPERIENCE_LIST.map((exp) => {
            const isSelected = profileExperienceId === exp.id;
            return (
              <button
                key={exp.id}
                type="button"
                onClick={() => handleSelectExp(exp.id)}
                className={`p-4 rounded-xl border text-left transition-all relative group cursor-pointer ${
                  isSelected
                    ? 'border-indigo-500/60 bg-indigo-600/15 ring-1 ring-indigo-500/40 shadow-xs'
                    : 'border-white/[0.08] bg-[#0E111B] hover:border-white/[0.18]'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-white/[0.10] bg-white/[0.04] text-slate-300">
                    {exp.categoryBadge}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-white">
                  {exp.name}
                </h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {exp.shortDescription}
                </p>

                <div className="mt-3 flex items-center gap-1.5 pt-2 border-t border-white/[0.06]">
                  <span className="text-[11px] text-slate-500">Metric:</span>
                  <span className="text-[11px] font-mono font-medium text-slate-300 truncate">
                    {exp.readinessMetricName}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Profile Accent Color */}
      <div className="space-y-3 pt-2">
        <label className="text-xs font-mono uppercase tracking-wider text-indigo-400 block font-semibold">
          Profile Card Accent Color
        </label>
        <div className="flex flex-wrap items-center gap-3">
          {PROFILE_ACCENT_COLORS.map((color) => {
            const isSelected = selectedAccent === color.id;
            return (
              <button
                key={color.id}
                type="button"
                onClick={() => {
                  setSelectedAccent(color.id);
                  setSaveStatus('Accent color updated');
                  setTimeout(() => setSaveStatus(null), 2000);
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-500/60 bg-indigo-600/15 text-white shadow-xs'
                    : 'border-white/[0.08] bg-[#0E111B] hover:border-white/[0.18] text-slate-300'
                }`}
              >
                <span 
                  className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0" 
                  style={{ backgroundColor: color.hex }}
                />
                <span>{color.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400 ml-1" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Profile Card Banner Atmosphere */}
      <div className="space-y-3 pt-2">
        <label className="text-xs font-mono uppercase tracking-wider text-indigo-400 block font-semibold">
          Profile Header Banner Style
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PROFILE_BANNERS.map((banner) => {
            const isSelected = selectedBanner === banner.id;
            return (
              <button
                key={banner.id}
                type="button"
                onClick={() => {
                  setSelectedBanner(banner.id);
                  setSaveStatus('Banner style updated');
                  setTimeout(() => setSaveStatus(null), 2000);
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer bg-[#0E111B] ${
                  isSelected
                    ? 'border-indigo-500/60 ring-1 ring-indigo-500/40 shadow-xs'
                    : 'border-white/[0.08] hover:border-white/[0.18]'
                }`}
              >
                <div className={`h-12 w-full rounded-lg bg-gradient-to-r ${banner.gradient} mb-2.5 flex items-center justify-end p-2 border border-white/10`}>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>
                <span className="text-xs font-semibold text-white block">{banner.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
