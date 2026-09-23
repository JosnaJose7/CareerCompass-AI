import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  AppThemeId, 
  ColorMode, 
  ResolvedColorMode, 
  ProfileExperienceId, 
  AppThemeConfig, 
  ProfileExperienceConfig, 
  ThemeVariantTokens 
} from '../themes/types';
import { 
  APP_THEMES, 
  PROFILE_EXPERIENCES 
} from '../themes/themeConfig';

interface ThemeContextType {
  // 1. Application Theme System (Visual Design System)
  appThemeId: AppThemeId;
  currentAppTheme: AppThemeConfig;
  setAppTheme: (id: AppThemeId) => void;
  resetAppTheme: () => void;

  // 2. Independent Color Mode (Light / Dark / System)
  colorMode: ColorMode;
  resolvedColorMode: ResolvedColorMode;
  setColorMode: (mode: ColorMode) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Active Design Tokens for current (AppTheme + ResolvedColorMode)
  activeTokens: ThemeVariantTokens;

  // Modals for App Theme
  isAppThemeModalOpen: boolean;
  openAppThemeModal: () => void;
  closeAppThemeModal: () => void;

  // 3. Profile Experience System (Student Identity Only)
  profileExperienceId: ProfileExperienceId;
  currentProfileExperience: ProfileExperienceConfig;
  setProfileExperience: (id: ProfileExperienceId) => void;
  resetProfileExperience: () => void;
  isProfileExperienceModalOpen: boolean;
  openProfileExperienceModal: () => void;
  closeProfileExperienceModal: () => void;

  // Profile Sync
  syncFromProfile: (profileAppTheme?: string, profileColorMode?: string, profileExp?: string, legacyTheme?: string) => void;
  
  // Backward compatibility properties
  currentTheme: AppThemeConfig;
  setTheme: (id: AppThemeId) => void;
  setIsDarkMode: (isDark: boolean) => void;
}

const LOCAL_STORAGE_APP_THEME_KEY = 'careercompass_app_theme_v2';
const LOCAL_STORAGE_COLOR_MODE_KEY = 'careercompass_color_mode_v2';
const LOCAL_STORAGE_PROFILE_EXP_KEY = 'careercompass_profile_experience_v2';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Helper to normalize app theme IDs with legacy migration
function normalizeAppThemeId(rawId?: string): AppThemeId {
  if (!rawId) return 'professional';
  const clean = rawId.toLowerCase().trim() as AppThemeId;
  if (APP_THEMES[clean]) return clean;
  if (clean === 'midnight') return 'professional';
  if (clean === 'aurora') return 'ocean';
  if (clean === 'minimal') return 'monochrome';
  if (clean === 'dark-neon') return 'cyberpunk';
  return 'professional';
}

// Helper to normalize color modes
function normalizeColorMode(rawMode?: string): ColorMode {
  if (rawMode === 'light' || rawMode === 'dark' || rawMode === 'system') {
    return rawMode;
  }
  return 'dark';
}

// Helper to normalize profile experience IDs with legacy migration
function normalizeProfileExperienceId(rawId?: string): ProfileExperienceId {
  if (!rawId) return 'professional';
  const clean = rawId.toLowerCase().trim() as ProfileExperienceId;
  if (PROFILE_EXPERIENCES[clean]) return clean;
  if (clean === 'fantasy' || clean === ('fantasy-codex' as any)) return 'dark-fantasy';
  if (clean === ('anime-adventure' as any)) return 'anime';
  if (clean === ('sports-performance' as any)) return 'sports';
  return 'professional';
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State 1: App Theme (Visual Design System)
  const [appThemeId, setAppThemeIdState] = useState<AppThemeId>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_APP_THEME_KEY);
      return normalizeAppThemeId(saved || 'professional');
    } catch {
      return 'professional';
    }
  });

  // State 2: Color Mode ('light' | 'dark' | 'system') — Default to Dark
  const [colorMode, setColorModeState] = useState<ColorMode>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_COLOR_MODE_KEY);
      return normalizeColorMode(saved || 'dark');
    } catch {
      return 'dark';
    }
  });

  // System color scheme listener
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemPrefersDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Computed Resolved Color Mode ('light' | 'dark')
  const resolvedColorMode: ResolvedColorMode = useMemo(() => {
    if (colorMode === 'system') {
      return systemPrefersDark ? 'dark' : 'light';
    }
    return colorMode;
  }, [colorMode, systemPrefersDark]);

  const isDarkMode = resolvedColorMode === 'dark';

  // State 3: Profile Experience (Student Identity Only)
  const [profileExperienceId, setProfileExperienceIdState] = useState<ProfileExperienceId>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PROFILE_EXP_KEY);
      return normalizeProfileExperienceId(saved || 'professional');
    } catch {
      return 'professional';
    }
  });

  // Modal Visibility States
  const [isAppThemeModalOpen, setIsAppThemeModalOpen] = useState(false);
  const [isProfileExperienceModalOpen, setIsProfileExperienceModalOpen] = useState(false);

  // Active configurations
  const currentAppTheme = useMemo(() => {
    return APP_THEMES[appThemeId] || APP_THEMES['professional'];
  }, [appThemeId]);

  const activeTokens = useMemo<ThemeVariantTokens>(() => {
    return isDarkMode ? currentAppTheme.dark : currentAppTheme.light;
  }, [currentAppTheme, isDarkMode]);

  const currentProfileExperience = useMemo(() => {
    return PROFILE_EXPERIENCES[profileExperienceId] || PROFILE_EXPERIENCES['professional'];
  }, [profileExperienceId]);

  // Setter for System 1: Application Theme
  const setAppTheme = useCallback((id: AppThemeId) => {
    const validId = normalizeAppThemeId(id);
    setAppThemeIdState(validId);
    try {
      localStorage.setItem(LOCAL_STORAGE_APP_THEME_KEY, validId);
    } catch (e) {
      console.warn('Failed to save app theme in localStorage:', e);
    }
  }, []);

  // Reset System 1: Application Theme to Default Professional
  const resetAppTheme = useCallback(() => {
    setAppThemeIdState('professional');
    try {
      localStorage.setItem(LOCAL_STORAGE_APP_THEME_KEY, 'professional');
    } catch (e) {
      console.warn('Failed to reset app theme in localStorage:', e);
    }
  }, []);

  // Setter for Color Mode
  const setColorMode = useCallback((mode: ColorMode) => {
    const validMode = normalizeColorMode(mode);
    setColorModeState(validMode);
    try {
      localStorage.setItem(LOCAL_STORAGE_COLOR_MODE_KEY, validMode);
    } catch (e) {
      console.warn('Failed to save color mode in localStorage:', e);
    }
  }, []);

  // Toggle Dark Mode
  const toggleDarkMode = useCallback(() => {
    setColorMode(resolvedColorMode === 'dark' ? 'light' : 'dark');
  }, [resolvedColorMode, setColorMode]);

  // Backwards compatibility setIsDarkMode
  const setIsDarkMode = useCallback((isDark: boolean) => {
    setColorMode(isDark ? 'dark' : 'light');
  }, [setColorMode]);

  // Setter for System 2: Profile Experience
  const setProfileExperience = useCallback((id: ProfileExperienceId) => {
    const validId = normalizeProfileExperienceId(id);
    setProfileExperienceIdState(validId);
    try {
      localStorage.setItem(LOCAL_STORAGE_PROFILE_EXP_KEY, validId);
    } catch (e) {
      console.warn('Failed to save profile experience in localStorage:', e);
    }
  }, []);

  // Reset System 2: Profile Experience to Default Professional
  const resetProfileExperience = useCallback(() => {
    setProfileExperienceIdState('professional');
    try {
      localStorage.setItem(LOCAL_STORAGE_PROFILE_EXP_KEY, 'professional');
    } catch (e) {
      console.warn('Failed to reset profile experience in localStorage:', e);
    }
  }, []);

  // Sync both independently from Firestore profile
  const syncFromProfile = useCallback((profileAppTheme?: string, profileColorMode?: string, profileExp?: string, legacyTheme?: string) => {
    if (profileAppTheme) {
      const normalized = normalizeAppThemeId(profileAppTheme);
      setAppThemeIdState(normalized);
      try { localStorage.setItem(LOCAL_STORAGE_APP_THEME_KEY, normalized); } catch {}
    } else if (legacyTheme) {
      const normalized = normalizeAppThemeId(legacyTheme);
      setAppThemeIdState(normalized);
    }

    if (profileColorMode) {
      const normalizedMode = normalizeColorMode(profileColorMode);
      setColorModeState(normalizedMode);
      try { localStorage.setItem(LOCAL_STORAGE_COLOR_MODE_KEY, normalizedMode); } catch {}
    }

    if (profileExp) {
      const normalizedExp = normalizeProfileExperienceId(profileExp);
      setProfileExperienceIdState(normalizedExp);
      try { localStorage.setItem(LOCAL_STORAGE_PROFILE_EXP_KEY, normalizedExp); } catch {}
    } else if (legacyTheme) {
      const normalizedExp = normalizeProfileExperienceId(legacyTheme);
      setProfileExperienceIdState(normalizedExp);
    }
  }, []);

  // =========================================================================
  // DYNAMIC CSS DESIGN TOKEN INJECTION ONTO :root & body
  // =========================================================================
  useEffect(() => {
    const root = document.documentElement;
    const tokens = activeTokens;

    // 1. Data attributes & Classes
    root.setAttribute('data-theme', appThemeId);
    root.setAttribute('data-mode', resolvedColorMode);
    
    if (isDarkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }

    // Clean prior theme- and experience- classes
    const existingClasses = Array.from(root.classList);
    existingClasses.forEach(cls => {
      if (cls.startsWith('theme-') || cls.startsWith('mode-') || cls.startsWith('experience-')) {
        root.classList.remove(cls);
      }
    });

    root.classList.add(`theme-${appThemeId}`);
    root.classList.add(`mode-${resolvedColorMode}`);
    root.classList.add(`experience-${profileExperienceId}`);

    // Clean body classes as well
    const bodyClasses = Array.from(document.body.classList);
    bodyClasses.forEach(cls => {
      if (cls.startsWith('theme-') || cls.startsWith('mode-') || cls.startsWith('experience-')) {
        document.body.classList.remove(cls);
      }
    });
    document.body.classList.add(`theme-${appThemeId}`);
    document.body.classList.add(`mode-${resolvedColorMode}`);
    document.body.classList.add(`experience-${profileExperienceId}`);

    // 2. Set Centralized CSS Custom Properties (Tokens)
    root.style.setProperty('--background', tokens.background);
    root.style.setProperty('--background-secondary', tokens.backgroundSecondary);
    root.style.setProperty('--surface', tokens.surface);
    root.style.setProperty('--surface-elevated', tokens.surfaceElevated);
    root.style.setProperty('--surface-hover', tokens.surfaceHover);
    root.style.setProperty('--text-primary', tokens.textPrimary);
    root.style.setProperty('--text-secondary', tokens.textSecondary);
    root.style.setProperty('--text-muted', tokens.textMuted);
    root.style.setProperty('--border', tokens.border);
    root.style.setProperty('--border-subtle', tokens.borderSubtle);
    root.style.setProperty('--border-focus', tokens.borderFocus);
    root.style.setProperty('--primary', tokens.primary);
    root.style.setProperty('--primary-hover', tokens.primaryHover);
    root.style.setProperty('--primary-text', tokens.primaryText);
    root.style.setProperty('--primary-glow', tokens.primaryGlow);
    root.style.setProperty('--secondary', tokens.secondary);
    root.style.setProperty('--secondary-hover', tokens.secondaryHover);
    root.style.setProperty('--secondary-text', tokens.secondaryText);
    root.style.setProperty('--accent', tokens.accent);
    root.style.setProperty('--accent-hover', tokens.accentHover);
    root.style.setProperty('--accent-text', tokens.accentText);
    root.style.setProperty('--accent-glow', tokens.accentGlow);
    root.style.setProperty('--badge-bg', tokens.badgeBg);
    root.style.setProperty('--badge-text', tokens.badgeText);
    root.style.setProperty('--badge-border', tokens.badgeBorder);
    root.style.setProperty('--card-bg', tokens.cardBg);
    root.style.setProperty('--card-border', tokens.cardBorder);
    root.style.setProperty('--card-shadow', tokens.cardShadow);
    root.style.setProperty('--input-bg', tokens.inputBg);
    root.style.setProperty('--input-border', tokens.inputBorder);
    root.style.setProperty('--input-text', tokens.inputText);
    root.style.setProperty('--button-bg', tokens.buttonBg);
    root.style.setProperty('--button-text', tokens.buttonText);
    root.style.setProperty('--button-hover-bg', tokens.buttonHoverBg);
    root.style.setProperty('--navbar-bg', tokens.navbarBg || tokens.background);
    root.style.setProperty('--navbar-border', tokens.navbarBorder || tokens.border);
    root.style.setProperty('--nav-active-bg', tokens.navActiveBg || tokens.primary);
    root.style.setProperty('--nav-active-text', tokens.navActiveText || tokens.primaryText);
    root.style.setProperty('--nav-inactive-text', tokens.navInactiveText || tokens.textMuted);
    root.style.setProperty('--nav-container-bg', tokens.navContainerBg || tokens.surface);
    root.style.setProperty('--nav-container-border', tokens.navContainerBorder || tokens.border);
    root.style.setProperty('--success', tokens.success);
    root.style.setProperty('--warning', tokens.warning);
    root.style.setProperty('--danger', tokens.danger);

    // Charts
    root.style.setProperty('--chart-1', tokens.chartColors[0]);
    root.style.setProperty('--chart-2', tokens.chartColors[1]);
    root.style.setProperty('--chart-3', tokens.chartColors[2]);
    root.style.setProperty('--chart-4', tokens.chartColors[3]);
    root.style.setProperty('--chart-5', tokens.chartColors[4]);

    // Typography & Radii
    root.style.setProperty('--font-display', currentAppTheme.fontDisplay);
    root.style.setProperty('--font-body', currentAppTheme.fontBody);
    root.style.setProperty('--radius-card', currentAppTheme.cardRadius);
    root.style.setProperty('--radius-btn', currentAppTheme.buttonRadius);
    root.style.setProperty('--radius-input', currentAppTheme.inputRadius || currentAppTheme.buttonRadius);
    root.style.setProperty('--border-width', currentAppTheme.borderWidth || '1px');

    // Profile Experience overrides for profile components
    const prof = currentProfileExperience;
    root.style.setProperty('--profile-accent', prof.palette.accent);
    root.style.setProperty('--profile-accent-light', prof.palette.accentLight);
    root.style.setProperty('--profile-accent-dark', prof.palette.accentDark);
    root.style.setProperty('--profile-accent-glow', prof.palette.accentGlow);
    root.style.setProperty('--profile-card-bg', prof.palette.cardBg);
    root.style.setProperty('--profile-card-border', prof.palette.cardBorder);
    root.style.setProperty('--profile-badge-bg', prof.palette.badgeBg);
    root.style.setProperty('--profile-badge-text', prof.palette.badgeText);
    root.style.setProperty('--profile-badge-border', prof.palette.badgeBorder);
  }, [appThemeId, resolvedColorMode, activeTokens, isDarkMode, currentAppTheme, profileExperienceId, currentProfileExperience]);

  return (
    <ThemeContext.Provider
      value={{
        // 1. Application Theme
        appThemeId,
        currentAppTheme,
        setAppTheme,
        resetAppTheme,

        // 2. Independent Color Mode
        colorMode,
        resolvedColorMode,
        setColorMode,
        isDarkMode,
        toggleDarkMode,

        // Active tokens
        activeTokens,

        // Modals
        isAppThemeModalOpen,
        openAppThemeModal: () => setIsAppThemeModalOpen(true),
        closeAppThemeModal: () => setIsAppThemeModalOpen(false),

        // 3. Profile Experience
        profileExperienceId,
        currentProfileExperience,
        setProfileExperience,
        resetProfileExperience,
        isProfileExperienceModalOpen: isProfileExperienceModalOpen,
        openProfileExperienceModal: () => setIsProfileExperienceModalOpen(true),
        closeProfileExperienceModal: () => setIsProfileExperienceModalOpen(false),

        // Sync
        syncFromProfile,

        // Backward compatibility
        currentTheme: currentAppTheme,
        setTheme: setAppTheme,
        setIsDarkMode
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
