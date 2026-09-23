import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Sparkles, 
  Palette, 
  Image as ImageIcon, 
  Check, 
  Trash2, 
  RefreshCw, 
  Layers, 
  Eye, 
  Info, 
  ShieldCheck, 
  Sliders,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { StudentProfile } from '../../types';
import { ProfileExperienceId } from '../../themes/types';
import { PROFILE_EXPERIENCES } from '../../themes/themeConfig';
import { useTheme } from '../../context/ThemeContext';
import { ABSTRACT_AVATAR_PRESETS, GENERATED_AVATAR_STYLES, AbstractAvatarPreset, GeneratedAvatarStyle } from './AvatarPresets';
import { ProfilePortraitFrame } from './ProfilePortraitFrame';

interface ProfilePortraitStudioProps {
  profile: StudentProfile;
  setProfile: React.Dispatch<React.SetStateAction<StudentProfile>>;
  className?: string;
}

export const ProfilePortraitStudio: React.FC<ProfilePortraitStudioProps> = ({
  profile,
  setProfile,
  className = ''
}) => {
  const { profileExperienceId, currentProfileExperience, setProfileExperience } = useTheme();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Active Tab: 'upload' | 'abstract' | 'generated'
  const [activeTab, setActiveTab] = useState<'upload' | 'abstract' | 'generated'>(() => {
    if (profile.avatarType === 'upload' && profile.avatarUrl) return 'upload';
    if (profile.avatarType === 'generated') return 'generated';
    return 'abstract';
  });

  // State for drag and drop
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  // State for abstract filter
  const [abstractCategory, setAbstractCategory] = useState<string>('all');

  // State for generated style customizer
  const [selectedGenStyleId, setSelectedGenStyleId] = useState<string>(
    profile.avatarType === 'generated' && profile.avatarStyle ? profile.avatarStyle : GENERATED_AVATAR_STYLES[0].id
  );
  const [genColorIndex, setGenColorIndex] = useState<number>(0);
  const [genSeed, setGenSeed] = useState<string>(profile.fullName || 'student-seed-1');

  // Preview Experience (defaults to active user experience)
  const activeExpId = (profile.profileExperience as ProfileExperienceId) || profileExperienceId || 'professional';
  const [previewExpId, setPreviewExpId] = useState<ProfileExperienceId>(activeExpId);

  // Handle File Upload
  const handleFile = (file: File) => {
    setUploadError(null);
    setUploadSuccess(false);

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, WebP, GIF).');
      return;
    }

    // Limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size should be under 5MB for optimal browser performance.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setProfile(prev => ({
          ...prev,
          avatarUrl: result,
          avatarType: 'upload',
          avatarStyle: undefined
        }));
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3500);
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to read image file. Please try another image.');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleSelectAbstract = (preset: AbstractAvatarPreset) => {
    setProfile(prev => ({
      ...prev,
      avatarUrl: undefined,
      avatarType: 'abstract',
      avatarStyle: preset.id
    }));
  };

  const handleSelectGenerated = (styleId: string, colorIdx: number = genColorIndex) => {
    setSelectedGenStyleId(styleId);
    setProfile(prev => ({
      ...prev,
      avatarUrl: undefined,
      avatarType: 'generated',
      avatarStyle: styleId
    }));
  };

  const handleClearAvatar = () => {
    setProfile(prev => ({
      ...prev,
      avatarUrl: undefined,
      avatarType: 'initials',
      avatarStyle: undefined
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Filtered abstract presets
  const filteredAbstractPresets = abstractCategory === 'all' 
    ? ABSTRACT_AVATAR_PRESETS 
    : ABSTRACT_AVATAR_PRESETS.filter(p => p.category === abstractCategory);

  const selectedGenStyle = GENERATED_AVATAR_STYLES.find(s => s.id === selectedGenStyleId) || GENERATED_AVATAR_STYLES[0];

  return (
    <div 
      id="profile-portrait-studio"
      className={`p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl shadow-2xl space-y-6 ${className}`}
    >
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-blue-600/30 to-purple-600/30 text-blue-300 border border-blue-500/30 shadow-inner">
            <ImageIcon className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-slate-100 tracking-tight">
                Personalized Profile Portrait Studio
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-300 border border-blue-400/20">
                Live Themed Framing
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Upload your photograph, pick an abstract illustration, or choose a procedural non-photorealistic avatar style.
            </p>
          </div>
        </div>

        {/* Current Active Type Indicator */}
        <div className="flex items-center gap-2">
          {profile.avatarType === 'upload' && (
            <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Real Photograph Active</span>
            </span>
          )}
          {profile.avatarType === 'abstract' && (
            <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center gap-1.5 shadow-sm">
              <Palette className="w-3.5 h-3.5" />
              <span>Abstract Vector Active</span>
            </span>
          )}
          {profile.avatarType === 'generated' && (
            <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generated Style Active</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Studio Grid: Left Controls (7 cols) + Right Live Preview (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: 3-WAY AVATAR SELECTION MODES (7 cols) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Mode Tabs */}
          <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <button
              type="button"
              id="tab-upload-photo-btn"
              onClick={() => setActiveTab('upload')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                activeTab === 'upload'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Upload className="w-4 h-4 shrink-0" />
              <span>1. Upload Photo</span>
            </button>

            <button
              type="button"
              id="tab-abstract-avatar-btn"
              onClick={() => setActiveTab('abstract')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                activeTab === 'abstract'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Palette className="w-4 h-4 shrink-0" />
              <span>2. Abstract Avatars</span>
            </button>

            <button
              type="button"
              id="tab-generated-style-btn"
              onClick={() => setActiveTab('generated')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                activeTab === 'generated'
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>3. Stylized Art</span>
            </button>
          </div>

          {/* TAB 1 CONTENT: UPLOAD OWN PROFILE PHOTOGRAPH */}
          {activeTab === 'upload' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`relative p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center space-y-3 ${
                  isDragging
                    ? 'border-blue-400 bg-blue-500/15 scale-[0.99]'
                    : 'border-slate-700 hover:border-blue-500/60 bg-slate-950/60 hover:bg-slate-950/90'
                }`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                  accept="image/png, image/jpeg, image/webp, image/gif"
                  className="hidden"
                />

                <div className="w-14 h-14 mx-auto rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center shadow-inner">
                  <Upload className="w-6 h-6 animate-pulse" />
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-200">
                    Click to browse or drag & drop your photograph
                  </p>
                  <p className="text-xs text-slate-400">
                    Supports PNG, JPG, WebP, or GIF (max 5MB)
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Your facial identity is preserved unmodified</span>
                </div>
              </div>

              {/* Status messages */}
              {uploadError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {uploadSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Photograph uploaded and applied to your profile portrait!</span>
                </div>
              )}

              {/* Upload Privacy & Identity Notice */}
              <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/20 text-xs text-blue-200/90 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-blue-300">
                  <Info className="w-4 h-4 text-blue-400" />
                  <span>Profile Image Guarantee</span>
                </div>
                <p className="text-[11px] text-blue-200/80 leading-relaxed">
                  The uploaded photograph is used exclusively as your student profile picture and framed inside your chosen theme. We do not automatically alter, distort, or AI-synthesize your real facial identity.
                </p>
              </div>

              {profile.avatarType === 'upload' && profile.avatarUrl && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={profile.avatarUrl} 
                      alt="Current avatar preview" 
                      className="w-9 h-9 rounded-lg object-cover border border-slate-700"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">Custom Photograph</span>
                      <span className="text-[10px] text-emerald-400 font-mono">Active Profile Picture</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleClearAvatar}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-rose-500/30 transition-all flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove Photo</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2 CONTENT: ABSTRACT ILLUSTRATED AVATARS */}
          {activeTab === 'abstract' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Category Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pb-1">
                {['all', 'geometric', 'abstract', 'minimalist', 'gradient'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setAbstractCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-all ${
                      abstractCategory === cat
                        ? 'bg-purple-600 text-white font-bold shadow-sm'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Grid of Abstract Presets */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-[300px] overflow-y-auto p-1 pr-2">
                {filteredAbstractPresets.map((preset) => {
                  const isSelected = profile.avatarType === 'abstract' && profile.avatarStyle === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectAbstract(preset)}
                      className={`relative p-2.5 rounded-2xl border text-left transition-all group flex flex-col items-center space-y-2 ${
                        isSelected
                          ? 'bg-purple-950/60 border-purple-400 shadow-lg shadow-purple-950/60 scale-[1.03]'
                          : 'bg-slate-950/60 hover:bg-slate-900 border-slate-800 hover:border-purple-500/50'
                      }`}
                    >
                      {/* Avatar SVG Container */}
                      <div className="w-16 h-16 rounded-xl overflow-hidden shadow-md">
                        {preset.renderSvg()}
                      </div>

                      <div className="w-full text-center">
                        <span className="text-[11px] font-bold text-slate-200 block truncate">
                          {preset.name}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono capitalize">
                          {preset.category}
                        </span>
                      </div>

                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-purple-500 text-white flex items-center justify-center shadow">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <p className="text-[11px] text-slate-400 italic">
                * All abstract illustrated avatars are 100% original, copyright-safe, non-celebrity vector illustrations.
              </p>
            </div>
          )}

          {/* TAB 3 CONTENT: GENERATED NON-PHOTOREALISTIC STYLES */}
          {activeTab === 'generated' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Style Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {GENERATED_AVATAR_STYLES.map((style) => {
                  const isSelected = selectedGenStyleId === style.id && profile.avatarType === 'generated';
                  return (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => handleSelectGenerated(style.id)}
                      className={`p-3 rounded-2xl border text-left transition-all flex flex-col items-center text-center space-y-2 ${
                        isSelected
                          ? 'bg-cyan-950/60 border-cyan-400 shadow-lg shadow-cyan-950/60 scale-[1.02]'
                          : 'bg-slate-950/60 hover:bg-slate-900 border-slate-800 hover:border-cyan-500/50'
                      }`}
                    >
                      <div className="w-14 h-14 rounded-xl overflow-hidden shadow-md">
                        {style.renderSvg(genSeed, genColorIndex)}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-200 block truncate">
                          {style.name}
                        </span>
                        <span className="text-[9px] text-cyan-400 font-mono uppercase tracking-wider">
                          {style.genre}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Colorway & Seed Controls */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Colorway Palette & Procedural Seed</span>
                  </span>
                  
                  <button
                    type="button"
                    onClick={() => {
                      const newColor = (genColorIndex + 1) % 5;
                      setGenColorIndex(newColor);
                      setGenSeed(`seed-${Date.now()}`);
                      handleSelectGenerated(selectedGenStyleId, newColor);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 text-[11px] font-semibold transition-all flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Cycle Seed</span>
                  </button>
                </div>

                {/* Color Swatches */}
                <div className="flex items-center gap-2">
                  {selectedGenStyle.palette.map((color, idx) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => {
                        setGenColorIndex(idx);
                        handleSelectGenerated(selectedGenStyleId, idx);
                      }}
                      className={`w-7 h-7 rounded-full transition-transform border-2 ${
                        genColorIndex === idx ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: color }}
                      title={`Palette color ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Non-photorealistic procedurally generated styling. No copyrighted characters or celebrity likenesses used.</span>
              </div>
            </div>
          )}

        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: LIVE THEMED FRAMED PORTRAIT PREVIEW (5 cols) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-950/80 border border-slate-800 flex flex-col items-center text-center space-y-5">
          
          <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800/80">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-blue-400" />
              <span>Live Framed Preview</span>
            </span>

            {/* Frame Experience Selector */}
            <select
              value={previewExpId}
              onChange={(e) => {
                const newExp = e.target.value as ProfileExperienceId;
                setPreviewExpId(newExp);
                setProfile(prev => ({ ...prev, profileExperience: newExp }));
                setProfileExperience(newExp);
              }}
              className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700 text-[11px] font-semibold text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="professional">Professional Frame</option>
              <option value="dark-fantasy">Dark Fantasy Frame</option>
              <option value="sports">Sports Frame</option>
              <option value="gaming">Gaming Frame</option>
              <option value="kpop">K-pop Frame</option>
              <option value="anime">Anime Frame</option>
            </select>
          </div>

          {/* Framed Portrait Display */}
          <div className="py-4">
            <ProfilePortraitFrame 
              profile={profile} 
              experienceId={previewExpId}
              size="xl"
            />
          </div>

          {/* Description of Current Frame */}
          <div className="space-y-1">
            <span className="text-xs font-extrabold text-slate-200">
              {PROFILE_EXPERIENCES[previewExpId]?.name || 'Professional'} Portrait Frame
            </span>
            <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed">
              {previewExpId === 'dark-fantasy' && 'Ornate gothic arch with antique gold filigree, wax crown seal, and arcanum rune ribbon.'}
              {previewExpId === 'sports' && 'Draft combine athlete card with gold foil bevels, jersey badge #10, and scouting score.'}
              {previewExpId === 'gaming' && 'Cyberpunk HUD character card with neon cyan scanlines, Level 08 gem, and tech archetype tag.'}
              {previewExpId === 'kpop' && 'Iridescent holographic photocard with pastel shimmer, sparkle star stamp, and center debut ribbon.'}
              {previewExpId === 'anime' && 'Guild vanguard shield frame with flaming aura energy, awakened crest, and S-Rank badge.'}
              {previewExpId === 'professional' && 'Executive minimalist frame with verified student badge and clean accreditation border.'}
            </p>
          </div>

          {/* Active Avatar Meta Summary */}
          <div className="w-full pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Identity Format:</span>
            <span className="font-semibold text-slate-200 capitalize">
              {profile.avatarType === 'upload' ? 'Personal Photo' : profile.avatarType === 'generated' ? 'Stylized Procedural' : profile.avatarType === 'abstract' ? 'Abstract Vector' : 'Monogram Initials'}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
