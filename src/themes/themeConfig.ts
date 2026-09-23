import { AppThemeConfig, ProfileExperienceConfig } from './types';
import { APP_THEMES_DATA } from './appThemes';
import { PROFILE_EXPERIENCES_DATA, PROFILE_EXPERIENCE_LIST_DATA } from './profileExperiences';

// ============================================================================
// 10 DISTINCT APPLICATION THEMES
// ============================================================================
export const APP_THEMES: Record<string, AppThemeConfig> = {
  ...APP_THEMES_DATA,
  // Backward compatibility aliases
  'midnight': APP_THEMES_DATA['professional'],
  'aurora': APP_THEMES_DATA['ocean'],
  'minimal': APP_THEMES_DATA['monochrome'],
  'dark-neon': APP_THEMES_DATA['cyberpunk'],
};

export const APP_THEME_LIST: AppThemeConfig[] = [
  APP_THEMES['professional'],
  APP_THEMES['ocean'],
  APP_THEMES['sunset'],
  APP_THEMES['forest'],
  APP_THEMES['lavender'],
  APP_THEMES['monochrome'],
  APP_THEMES['retro'],
  APP_THEMES['cyberpunk'],
  APP_THEMES['dark-academia'],
  APP_THEMES['candy']
];

// ============================================================================
// 8 DISTINCT STUDENT PROFILE EXPERIENCES
// ============================================================================
export const PROFILE_EXPERIENCES: Record<string, ProfileExperienceConfig> = PROFILE_EXPERIENCES_DATA;

export const PROFILE_EXPERIENCE_LIST: ProfileExperienceConfig[] = PROFILE_EXPERIENCE_LIST_DATA;
