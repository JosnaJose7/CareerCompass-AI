export const APP_NAME = 'CareerCompass AI';

export type CoreAppThemeId = 
  | 'professional'
  | 'ocean'
  | 'sunset'
  | 'forest'
  | 'lavender'
  | 'monochrome'
  | 'retro'
  | 'cyberpunk'
  | 'dark-academia'
  | 'candy';

export type AppThemeId = 
  | CoreAppThemeId
  // Backward compatibility aliases
  | 'midnight'
  | 'aurora'
  | 'minimal'
  | 'dark-neon';

export type ColorMode = 'light' | 'dark' | 'system';
export type ResolvedColorMode = 'light' | 'dark';

export type ProfileExperienceId = 
  | 'professional'
  | 'kpop'
  | 'anime'
  | 'sports'
  | 'gaming'
  | 'dark-fantasy'
  | 'dark-academia'
  | 'cinematic'
  | 'fantasy'; // Backward compatibility alias

// Backward compatibility alias for legacy code
export type ExperienceThemeId = ProfileExperienceId | AppThemeId;

export interface ThemeVariantTokens {
  background: string;
  backgroundSecondary: string;
  surface: string;
  surfaceElevated: string;
  surfaceHover: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderSubtle: string;
  borderFocus: string;
  primary: string;
  primaryHover: string;
  primaryText: string;
  primaryGlow: string;
  secondary: string;
  secondaryHover: string;
  secondaryText: string;
  accent: string;
  accentHover: string;
  accentText: string;
  accentGlow: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  cardBg: string;
  cardBorder: string;
  cardShadow: string;
  inputBg: string;
  inputBorder: string;
  inputText: string;
  buttonBg: string;
  buttonText: string;
  buttonHoverBg: string;
  navbarBg: string;
  navbarBorder: string;
  navActiveBg: string;
  navActiveText: string;
  navInactiveText: string;
  navContainerBg: string;
  navContainerBorder: string;
  success: string;
  warning: string;
  danger: string;
  chartColors: [string, string, string, string, string];
  heroGradient: string;
  activeTabGradient: string;
  buttonGradient: string;
}

export interface AppThemeConfig {
  id: AppThemeId;
  name: string;
  subtitle: string;
  purpose: string;
  categoryBadge: string;
  fontDisplay: string;
  fontBody: string;
  cardRadius: string;
  buttonRadius: string;
  inputRadius: string;
  borderWidth: string;
  buttonStyleType: 'corporate-saas' | 'ocean-pill' | 'editorial-warm' | 'botanical-pebble' | 'fashion-couture' | 'swiss-minimal' | 'retro-tactile' | 'cyber-chamfer' | 'scholarly-wax' | 'candy-bounce';
  cardStyleType: 'corporate' | 'oceanic' | 'warm-editorial' | 'botanical' | 'couture' | 'swiss' | 'retro-hard' | 'cyber-hud' | 'scholarly' | 'candy-3d';
  visualAtmosphere: string;
  decorativePattern: 'corporate-subtle' | 'ocean-waves' | 'warm-sunset' | 'botanical-lines' | 'editorial-stars' | 'monochrome-minimal' | 'retro-dots' | 'cyber-grid' | 'academic-arch' | 'candy-bubbles';
  previewDots: string[];
  light: ThemeVariantTokens;
  dark: ThemeVariantTokens;
  // Backward compatibility palette access
  palette?: ThemeVariantTokens;
  tokens?: any;
  flavor: {
    platformTitle: string;
    platformBadge: string;
    tagline: string;
    discoverySectionTitle?: string;
    assessmentSectionTitle: string;
    roadmapSectionTitle: string;
    skillsSectionTitle: string;
    resumeSectionTitle?: string;
    interviewSectionTitle?: string;
    facultySectionTitle: string;
  };
}

export interface ProfileExperienceConfig {
  id: ProfileExperienceId;
  name: string;
  categoryBadge: string;
  tagline: string;
  shortDescription: string;
  personaTitle: string;
  mascotName: string;
  mascotGreeting: string;
  motivationalQuote: string;
  readinessMetricName: string;
  rankTitles: {
    level1: string;
    level2: string;
    level3: string;
    level4: string;
  };
  palette: {
    accent: string;
    accentLight: string;
    accentDark: string;
    accentGlow: string;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    cardBg: string;
    cardBorder: string;
    bannerGradient: string;
    avatarBorder: string;
    previewDots: string[];
  };
  fontDisplay: string;
  badgeIconName: string;
}

// Backward compatibility aliases
export type ThemeColorPalette = ThemeVariantTokens;
export type AppThemeColorPalette = ThemeVariantTokens;
export type AppThemeTokens = any;
export type AppThemeFlavor = any;
export type ExperienceThemeConfig = AppThemeConfig;
