import React from 'react';
import { 
  User as UserIcon, 
  Crown, 
  Sparkles, 
  Star, 
  Zap, 
  ShieldCheck, 
  Trophy, 
  Activity, 
  Flame, 
  Radio, 
  Camera,
  CheckCircle2
} from 'lucide-react';
import { StudentProfile } from '../../types';
import { ProfileExperienceId } from '../../themes/types';
import { ABSTRACT_AVATAR_PRESETS, GENERATED_AVATAR_STYLES } from './AvatarPresets';

export interface ProfilePortraitFrameProps {
  profile: StudentProfile;
  experienceId?: ProfileExperienceId | string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showEditOverlay?: boolean;
  onEditClick?: () => void;
  className?: string;
}

export const ProfilePortraitFrame: React.FC<ProfilePortraitFrameProps> = ({
  profile,
  experienceId = 'professional',
  size = 'lg',
  showEditOverlay = false,
  onEditClick,
  className = ''
}) => {
  const expId = (profile.profileExperience as ProfileExperienceId) || (experienceId as ProfileExperienceId) || 'professional';
  const isDarkFantasy = expId === 'dark-fantasy' || expId === 'fantasy';
  const isKpop = expId === 'kpop';
  const isAnime = expId === 'anime';
  const isSports = expId === 'sports';
  const isGaming = expId === 'gaming';
  const isProfessional = expId === 'professional' || (!isDarkFantasy && !isKpop && !isAnime && !isSports && !isGaming);

  // Determine size classes
  const sizeMap = {
    sm: 'w-14 h-14 text-lg',
    md: 'w-20 h-20 text-2xl',
    lg: 'w-28 h-28 sm:w-32 sm:h-32 text-4xl sm:text-5xl',
    xl: 'w-36 h-36 sm:w-44 sm:h-44 text-5xl sm:text-6xl'
  };

  const containerDimension = sizeMap[size] || sizeMap.lg;

  // Render Inner Avatar Core Content
  const renderAvatarContent = () => {
    // 1. Uploaded Photo (rendered completely unmodified as pure clean image)
    if (profile.avatarType === 'upload' && profile.avatarUrl) {
      return (
        <img 
          src={profile.avatarUrl} 
          alt={profile.fullName || 'Student portrait'}
          className="w-full h-full object-cover rounded-inherit"
        />
      );
    }

    // 2. Abstract Illustrated Avatar
    if (profile.avatarType === 'abstract' && profile.avatarStyle) {
      const preset = ABSTRACT_AVATAR_PRESETS.find(p => p.id === profile.avatarStyle) || ABSTRACT_AVATAR_PRESETS[0];
      return preset.renderSvg({ className: 'w-full h-full' });
    }

    // 3. Generated Non-Photorealistic Avatar Style
    if (profile.avatarType === 'generated' && profile.avatarStyle) {
      const genStyle = GENERATED_AVATAR_STYLES.find(s => s.id === profile.avatarStyle) || GENERATED_AVATAR_STYLES[0];
      return genStyle.renderSvg(profile.fullName || 'student', 0, { className: 'w-full h-full' });
    }

    // Fallback: If custom avatarUrl is stored without explicit avatarType
    if (profile.avatarUrl && profile.avatarUrl.startsWith('data:image')) {
      return (
        <img 
          src={profile.avatarUrl} 
          alt={profile.fullName || 'Student portrait'}
          className="w-full h-full object-cover rounded-inherit"
        />
      );
    }

    // Fallback: Clean Initials / Vector Icon
    return (
      <span className="font-extrabold select-none">
        {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : <UserIcon className="w-1/2 h-1/2" />}
      </span>
    );
  };

  // =========================================================================
  // FRAME 1: DARK FANTASY (ORNATE GOTHIC ARCH & ANTIQUE GOLD FILIGREE FRAME)
  // =========================================================================
  if (isDarkFantasy) {
    return (
      <div className={`relative shrink-0 group ${className}`}>
        {/* Outer Filigree Glow */}
        <div className="absolute -inset-2 bg-gradient-to-r from-[#d4af37]/30 via-[#581845]/40 to-[#d4af37]/30 rounded-[2rem] blur-md opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none" />

        {/* Ornate Double-Bordered Vault Frame */}
        <div 
          className={`relative flex items-center justify-center ${containerDimension} rounded-3xl text-[#fbf0b9] shadow-2xl font-serif font-extrabold overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]`}
          style={{
            backgroundColor: '#1b0a2a',
            border: '3.5px double #d4af37',
            boxShadow: '0 0 35px rgba(212, 175, 55, 0.4), inset 0 0 24px rgba(88, 24, 69, 0.9)'
          }}
        >
          {renderAvatarContent()}

          {/* Edit Overlay Button */}
          {showEditOverlay && (
            <button
              type="button"
              onClick={onEditClick}
              className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-[#fbf0b9] transition-opacity cursor-pointer z-30"
              title="Change Portrait or Upload Photo"
            >
              <Camera className="w-6 h-6 text-[#d4af37] animate-pulse" />
              <span className="text-[10px] font-serif font-bold uppercase tracking-wider mt-1 text-[#fef08a]">
                Edit Portrait
              </span>
            </button>
          )}

          {/* Antique Gilded Inner Border Overlay */}
          <div className="absolute inset-1 rounded-2xl border border-[#d4af37]/40 pointer-events-none z-10" />
        </div>

        {/* Ornate Gold Crown Crest */}
        <div 
          className="absolute -top-2.5 -right-2.5 w-8 h-8 rounded-full flex items-center justify-center text-[#fbf0b9] text-xs shadow-xl bg-[#581845] border-2 border-[#d4af37] z-20"
          title="Sovereign Crest"
        >
          <Crown className="w-4 h-4 text-[#d4af37]" />
        </div>

        {/* Floating Arcanum Rune Bottom Ribbon */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[9px] font-serif font-bold uppercase tracking-widest bg-[#fef3c7] text-[#4a0424] border border-[#d4af37] whitespace-nowrap shadow-lg z-20">
          ᚛ S-RANK CODEX ᚜
        </div>
      </div>
    );
  }

  // =========================================================================
  // FRAME 2: SPORTS (METALLIC ATHLETE COMBINE CARD FRAME)
  // =========================================================================
  if (isSports) {
    return (
      <div className={`relative shrink-0 group ${className}`}>
        {/* Dynamic Stadium Amber Halo */}
        <div className="absolute -inset-2 bg-gradient-to-tr from-amber-500/30 via-yellow-400/20 to-orange-500/30 rounded-3xl blur-md opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none" />

        {/* Athlete Foil Card Container */}
        <div 
          className={`relative flex items-center justify-center ${containerDimension} rounded-2xl text-amber-300 shadow-2xl font-mono font-black overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]`}
          style={{
            backgroundColor: '#0c0a09',
            border: '3px solid #f59e0b',
            boxShadow: '0 0 30px rgba(245, 158, 11, 0.4), inset 0 0 20px rgba(180, 83, 9, 0.6)'
          }}
        >
          {renderAvatarContent()}

          {/* Edit Overlay Button */}
          {showEditOverlay && (
            <button
              type="button"
              onClick={onEditClick}
              className="absolute inset-0 bg-black/70 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-amber-300 transition-opacity cursor-pointer z-30"
              title="Change Portrait or Upload Photo"
            >
              <Camera className="w-6 h-6 text-amber-400" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider mt-1 text-white">
                Edit Scout Pic
              </span>
            </button>
          )}

          {/* Holographic Combine Scan Corner Badges */}
          <div className="absolute top-1.5 left-1.5 w-2 h-2 border-t-2 border-l-2 border-amber-400 pointer-events-none z-10" />
          <div className="absolute top-1.5 right-1.5 w-2 h-2 border-t-2 border-r-2 border-amber-400 pointer-events-none z-10" />
          <div className="absolute bottom-1.5 left-1.5 w-2 h-2 border-b-2 border-l-2 border-amber-400 pointer-events-none z-10" />
          <div className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b-2 border-r-2 border-amber-400 pointer-events-none z-10" />
        </div>

        {/* Top-Right Jersey Badge Number */}
        <div 
          className="absolute -top-2.5 -right-2.5 px-2 py-0.5 rounded-md flex items-center gap-1 text-black font-mono font-black text-[10px] bg-gradient-to-r from-amber-300 to-yellow-400 border border-white shadow-xl z-20"
          title="Draft Combine #10"
        >
          <Trophy className="w-3 h-3 text-black" />
          <span>#10</span>
        </div>

        {/* Bottom Scouting Grade Pill */}
        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[9px] font-mono font-black uppercase tracking-wider bg-black text-amber-400 border border-amber-400/80 whitespace-nowrap shadow-lg z-20 flex items-center gap-1">
          <Activity className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
          <span>SCOUT GRADE: 94.8</span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // FRAME 3: GAMING (CYBERPUNK HUD CHARACTER-CARD FRAME)
  // =========================================================================
  if (isGaming) {
    return (
      <div className={`relative shrink-0 group ${className}`}>
        {/* Neon Cyber Cyan Ring */}
        <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/40 via-blue-600/30 to-fuchsia-500/40 rounded-2xl blur-md opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none" />

        {/* Cyber HUD Character Card */}
        <div 
          className={`relative flex items-center justify-center ${containerDimension} rounded-xl text-cyan-300 shadow-2xl font-mono font-black overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]`}
          style={{
            backgroundColor: '#050b14',
            border: '2.5px solid #06b6d4',
            boxShadow: '0 0 25px rgba(6, 182, 212, 0.4), inset 0 0 20px rgba(8, 51, 68, 0.8)'
          }}
        >
          {renderAvatarContent()}

          {/* Cyber Scanline Texture */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.08)_1px,transparent_1px)] [background-size:100%_4px] pointer-events-none z-10" />

          {/* Edit Overlay Button */}
          {showEditOverlay && (
            <button
              type="button"
              onClick={onEditClick}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-cyan-300 transition-opacity cursor-pointer z-30"
              title="Change Portrait or Upload Photo"
            >
              <Camera className="w-6 h-6 text-cyan-400 animate-bounce" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider mt-1 text-white">
                Edit Avatar
              </span>
            </button>
          )}

          {/* Tech HUD Corner Brackets */}
          <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-cyan-300 pointer-events-none z-20" />
          <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-cyan-300 pointer-events-none z-20" />
          <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-cyan-300 pointer-events-none z-20" />
          <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-cyan-300 pointer-events-none z-20" />
        </div>

        {/* Top-Right Level Gem */}
        <div 
          className="absolute -top-2.5 -right-2.5 px-2 py-0.5 rounded-lg flex items-center gap-1 text-cyan-200 font-mono font-black text-[10px] bg-slate-900 border border-cyan-400 shadow-xl z-20"
          title="Character Level 08"
        >
          <Zap className="w-3 h-3 text-cyan-400 fill-cyan-400" />
          <span>LVL 08</span>
        </div>

        {/* Bottom Cyber Rank HUD Tag */}
        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-widest bg-cyan-950 text-cyan-300 border border-cyan-400/80 whitespace-nowrap shadow-lg z-20">
          [ TECH ARCHETYPE ]
        </div>
      </div>
    );
  }

  // =========================================================================
  // FRAME 4: K-POP INSPIRED (IRIDESCENT HOLOGRAPHIC PHOTOCARD FRAME)
  // =========================================================================
  if (isKpop) {
    return (
      <div className={`relative shrink-0 group ${className}`}>
        {/* Holographic Prismatic Halo */}
        <div className="absolute -inset-2 bg-gradient-to-tr from-fuchsia-500/40 via-cyan-400/30 to-pink-500/40 rounded-3xl blur-md opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none" />

        {/* Photocard Outer Body */}
        <div 
          className={`relative flex items-center justify-center ${containerDimension} rounded-2xl text-white shadow-2xl font-sans font-black overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]`}
          style={{
            backgroundColor: '#120524',
            border: '3px solid transparent',
            backgroundImage: 'linear-gradient(#120524, #120524), linear-gradient(135deg, #e879f9 0%, #22d3ee 50%, #f472b6 100%)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
            boxShadow: '0 0 30px rgba(232, 121, 249, 0.45)'
          }}
        >
          {renderAvatarContent()}

          {/* Holographic Foil Glitter Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/15 pointer-events-none z-10" />

          {/* Edit Overlay Button */}
          {showEditOverlay && (
            <button
              type="button"
              onClick={onEditClick}
              className="absolute inset-0 bg-purple-950/80 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-fuchsia-200 transition-opacity cursor-pointer z-30"
              title="Change Portrait or Upload Photo"
            >
              <Camera className="w-6 h-6 text-fuchsia-400" />
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider mt-1 text-white">
                Edit Photocard
              </span>
            </button>
          )}
        </div>

        {/* Top-Right Sparkle Star Stamp */}
        <div 
          className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs bg-gradient-to-r from-fuchsia-500 to-pink-500 border border-white shadow-xl z-20"
          title="Center Debut Photocard"
        >
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>

        {/* Bottom Idol Debut Ribbon */}
        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[9px] font-sans font-bold uppercase tracking-wider bg-gradient-to-r from-fuchsia-600 to-cyan-600 text-white border border-white/50 whitespace-nowrap shadow-lg z-20">
          ✦ MAIN CENTER DEBUT ✦
        </div>
      </div>
    );
  }

  // =========================================================================
  // FRAME 5: ANIME (ILLUSTRATED GUILD VANGUARD CHARACTER FRAME)
  // =========================================================================
  if (isAnime) {
    return (
      <div className={`relative shrink-0 group ${className}`}>
        {/* Flaming Aura Halo */}
        <div className="absolute -inset-2 bg-gradient-to-r from-orange-500/40 via-rose-500/30 to-amber-400/40 rounded-3xl blur-md opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none" />

        {/* Anime Vanguard Shield Container */}
        <div 
          className={`relative flex items-center justify-center ${containerDimension} rounded-2xl text-amber-200 shadow-2xl font-sans font-extrabold overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]`}
          style={{
            backgroundColor: '#120704',
            border: '3px solid #f97316',
            boxShadow: '0 0 30px rgba(249, 115, 22, 0.45), inset 0 0 20px rgba(124, 45, 18, 0.7)'
          }}
        >
          {renderAvatarContent()}

          {/* Edit Overlay Button */}
          {showEditOverlay && (
            <button
              type="button"
              onClick={onEditClick}
              className="absolute inset-0 bg-black/75 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-orange-300 transition-opacity cursor-pointer z-30"
              title="Change Portrait or Upload Photo"
            >
              <Camera className="w-6 h-6 text-orange-400" />
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider mt-1 text-white">
                Edit Character
              </span>
            </button>
          )}

          {/* Inner Sharp Framing Accent */}
          <div className="absolute inset-1 rounded-xl border border-orange-400/30 pointer-events-none z-10" />
        </div>

        {/* Top-Right Flame Seal */}
        <div 
          className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs bg-gradient-to-r from-orange-500 to-amber-400 border border-white shadow-xl z-20"
          title="S-Class Awakened Vanguard"
        >
          <Flame className="w-3.5 h-3.5 text-white fill-white" />
        </div>

        {/* Bottom S-Rank Hero Pill */}
        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-widest bg-gradient-to-r from-orange-600 to-amber-500 text-white border border-white/40 whitespace-nowrap shadow-lg z-20">
          S-CLASS VANGUARD
        </div>
      </div>
    );
  }

  // =========================================================================
  // FRAME 6: PROFESSIONAL / DEFAULT (CLEAN EXECUTIVE VERIFIED FRAME)
  // =========================================================================
  return (
    <div className={`relative shrink-0 group ${className}`}>
      {/* Subtle Ambient Elevation Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-indigo-600/15 to-slate-400/20 rounded-3xl blur-sm opacity-50 group-hover:opacity-90 transition-opacity pointer-events-none" />

      {/* Clean Corporate Rounded Square Frame */}
      <div 
        className={`relative flex items-center justify-center ${containerDimension} rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-700/80 text-blue-300 shadow-xl font-sans font-bold overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]`}
        style={{
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 15px rgba(59, 130, 246, 0.15)'
        }}
      >
        {renderAvatarContent()}

        {/* Edit Overlay Button */}
        {showEditOverlay && (
          <button
            type="button"
            onClick={onEditClick}
            className="absolute inset-0 bg-slate-950/75 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-blue-300 transition-opacity cursor-pointer z-30"
            title="Change Portrait or Upload Photo"
          >
            <Camera className="w-6 h-6 text-blue-400" />
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider mt-1 text-white">
              Edit Portrait
            </span>
          </button>
        )}

        {/* Subtle Inset Bevel */}
        <div className="absolute inset-0.5 rounded-[14px] border border-white/10 pointer-events-none z-10" />
      </div>

      {/* Top-Right Verified Executive Badge */}
      <div 
        className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white bg-blue-600 border-2 border-slate-900 shadow-lg z-20"
        title="Verified Student Identity"
      >
        <ShieldCheck className="w-3.5 h-3.5 text-white" />
      </div>

      {/* Bottom Professional Accreditation Pill */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[9px] font-sans font-semibold uppercase tracking-wider bg-slate-900 text-slate-300 border border-slate-700 whitespace-nowrap shadow-md z-20 flex items-center gap-1">
        <CheckCircle2 className="w-2.5 h-2.5 text-blue-400" />
        <span>VERIFIED CANDIDATE</span>
      </div>
    </div>
  );
};
