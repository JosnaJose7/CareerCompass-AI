import { ProfileExperienceConfig, ProfileExperienceId } from './types';

export const PROFILE_EXPERIENCES_DATA: Record<string, ProfileExperienceConfig> = {
  // 1. PROFESSIONAL / SCHOLAR
  'professional': {
    id: 'professional',
    name: 'Executive Scholar',
    categoryBadge: 'University Verified',
    tagline: 'Standard University & Corporate Accreditation Profile',
    shortDescription: 'Refined executive credentials with soft plum and muted lavender accents.',
    personaTitle: 'Certified Candidate',
    mascotName: 'Career Advisor AI',
    mascotGreeting: 'Academic rigor and verified competencies pave the path to leadership.',
    motivationalQuote: 'Excellence is an enduring habit forged through deliberate practice.',
    readinessMetricName: 'Employability Index',
    rankTitles: {
      level1: 'Associate Apprentice',
      level2: 'Practicing Specialist',
      level3: 'Senior Fellow',
      level4: 'Distinguished Fellow'
    },
    palette: {
      accent: '#382436',
      accentLight: '#A37790',
      accentDark: '#261B24',
      accentGlow: 'rgba(56, 36, 54, 0.12)',
      badgeBg: '#F5ECF2',
      badgeText: '#382436',
      badgeBorder: '#E4D4DE',
      cardBg: '#FFFFFF',
      cardBorder: '#EDE2E8',
      bannerGradient: 'from-[#382436] via-[#4F2D4A] to-[#2B1A2A]',
      avatarBorder: '#A37790',
      previewDots: ['#382436', '#A37790', '#B9A8CE']
    },
    fontDisplay: 'Plus Jakarta Sans, sans-serif',
    badgeIconName: 'Sparkles'
  },

  // 2. K-POP / CREATIVE SHOWCASE
  'kpop': {
    id: 'kpop',
    name: 'Showcase Editorial',
    categoryBadge: 'Debut Showcase',
    tagline: 'High-Contrast Collectible Editorial Photocard Profile',
    shortDescription: 'Dusty rose and soft blush photocard borders, debut tier ranking, and dreamy accents.',
    personaTitle: 'All-Rounder Trainee',
    mascotName: 'Chae-won (Producer AI)',
    mascotGreeting: 'Your center-stage performance shines through every mastered skill!',
    motivationalQuote: 'Center stage is won with heart, rhythm, and unwavering practice.',
    readinessMetricName: 'Debut Readiness',
    rankTitles: {
      level1: 'Debut Trainee',
      level2: 'Lead Performer',
      level3: 'Main Vocal / Visual',
      level4: 'Center All-Rounder'
    },
    palette: {
      accent: '#D49BAE',
      accentLight: '#E8B4C8',
      accentDark: '#8E4D68',
      accentGlow: 'rgba(212, 155, 174, 0.25)',
      badgeBg: '#FDF2F6',
      badgeText: '#8E4D68',
      badgeBorder: '#F5D0DD',
      cardBg: '#FFFFFF',
      cardBorder: '#F2DFE6',
      bannerGradient: 'from-[#6E334E] via-[#A65B7D] to-[#4A2033]',
      avatarBorder: '#D49BAE',
      previewDots: ['#D49BAE', '#E8B4C8', '#4A2033']
    },
    fontDisplay: 'Outfit, sans-serif',
    badgeIconName: 'Music'
  },

  // 3. ANIME / GUILD VANGUARD
  'anime': {
    id: 'anime',
    name: 'Guild Vanguard',
    categoryBadge: 'Guild Hunter',
    tagline: 'Hunter Guild License & Power Ranking Profile',
    shortDescription: 'Muted amethyst and gold seals with heroic progression badges.',
    personaTitle: 'S-Rank Guild Vanguard',
    mascotName: 'Ren (Guildmaster AI)',
    mascotGreeting: 'Every solved algorithm fuels your inner hunter aura. Let us clear the dungeon!',
    motivationalQuote: 'Limit breaks happen only when facing challenges that terrify others.',
    readinessMetricName: 'Combat Power Index',
    rankTitles: {
      level1: 'E-Rank Novice',
      level2: 'B-Rank Vanguard',
      level3: 'A-Rank Elite',
      level4: 'S-Rank National Hunter'
    },
    palette: {
      accent: '#B9A8CE',
      accentLight: '#D2C6E2',
      accentDark: '#4F3B66',
      accentGlow: 'rgba(185, 168, 206, 0.25)',
      badgeBg: '#F7F3FB',
      badgeText: '#4F3B66',
      badgeBorder: '#DFD5EB',
      cardBg: '#FFFFFF',
      cardBorder: '#EDE5F4',
      bannerGradient: 'from-[#46315D] via-[#6B4E8C] to-[#2E1F40]',
      avatarBorder: '#B9A8CE',
      previewDots: ['#B9A8CE', '#D2C6E2', '#46315D']
    },
    fontDisplay: 'Outfit, sans-serif',
    badgeIconName: 'Flame'
  },

  // 4. ATHLETIC / COMBINE
  'sports': {
    id: 'sports',
    name: 'Athletic Scout Card',
    categoryBadge: 'Championship Scout',
    tagline: 'Combine Athletic Scout Card & OVR Scorecard',
    shortDescription: 'Warm bronze and champagne gold athlete jersey metrics and combine ratings.',
    personaTitle: 'Franchise Quarterback',
    mascotName: 'Coach Marcus',
    mascotGreeting: 'Lock in on film study and reps. We are taking home the championship ring!',
    motivationalQuote: 'Champions are built in the dark when nobody is watching the scoreboard.',
    readinessMetricName: 'Combine OVR Rating',
    rankTitles: {
      level1: 'Walk-On Rookie',
      level2: 'Varsity Starter',
      level3: 'All-American Star',
      level4: 'MVP Hall of Famer'
    },
    palette: {
      accent: '#C5A880',
      accentLight: '#DFCAA8',
      accentDark: '#664B29',
      accentGlow: 'rgba(197, 168, 128, 0.25)',
      badgeBg: '#FAF6F0',
      badgeText: '#664B29',
      badgeBorder: '#EADECE',
      cardBg: '#FFFFFF',
      cardBorder: '#F0E7DD',
      bannerGradient: 'from-[#4F361E] via-[#7D5B38] to-[#332212]',
      avatarBorder: '#C5A880',
      previewDots: ['#C5A880', '#DFCAA8', '#4F361E']
    },
    fontDisplay: 'Plus Jakarta Sans, sans-serif',
    badgeIconName: 'Trophy'
  },

  // 5. GAMING / CYBER TACTICIAN
  'gaming': {
    id: 'gaming',
    name: 'Gaming RPG HUD',
    categoryBadge: 'Legendary Hero',
    tagline: 'RPG Character Sheet with XP Gauge',
    shortDescription: 'Soft mauve tech gauges, Level 99 stat blocks, and legendary equipment slots.',
    personaTitle: 'Mythic Cyber Tactician',
    mascotName: 'Companion AI',
    mascotGreeting: 'Quest objectives updated. Critical strike chance on technical interviews maximized!',
    motivationalQuote: 'Grinding yields XP. Mastery unlocks legendary drops.',
    readinessMetricName: 'Level & Gear Score',
    rankTitles: {
      level1: 'Level 1 Adventurer',
      level2: 'Level 35 Duelist',
      level3: 'Level 70 Archmage',
      level4: 'Level 99 Mythic Titan'
    },
    palette: {
      accent: '#A37790',
      accentLight: '#C49DB4',
      accentDark: '#4A2A3E',
      accentGlow: 'rgba(163, 119, 144, 0.25)',
      badgeBg: '#F8F1F5',
      badgeText: '#4A2A3E',
      badgeBorder: '#E6D3DF',
      cardBg: '#FFFFFF',
      cardBorder: '#EDE0E8',
      bannerGradient: 'from-[#422238] via-[#6B3B5B] to-[#2B1524]',
      avatarBorder: '#A37790',
      previewDots: ['#A37790', '#C49DB4', '#422238']
    },
    fontDisplay: 'Outfit, sans-serif',
    badgeIconName: 'Gamepad2'
  },

  // 6. DARK FANTASY / CODEX
  'dark-fantasy': {
    id: 'dark-fantasy',
    name: 'Arcane Codex',
    categoryBadge: 'Eldritch Order',
    tagline: 'Ancient Grimoire & Archival Seal Profile',
    shortDescription: 'Filigree borders, wax seals, and weathered parchment aesthetics in deep plum.',
    personaTitle: 'Grand Arch-Mage of the Codex',
    mascotName: 'Morrigan (Codex Keeper)',
    mascotGreeting: 'The stars align over the arcane repository. Unseal your competencies.',
    motivationalQuote: 'Knowledge inscribed in focus cannot be extinguished by doubt.',
    readinessMetricName: 'Arcane Mastery Tier',
    rankTitles: {
      level1: 'Neophyte Scribe',
      level2: 'Adept Conjurer',
      level3: 'High Sorcerer',
      level4: 'Supreme Arch-Mage'
    },
    palette: {
      accent: '#7A4B6E',
      accentLight: '#9E6C91',
      accentDark: '#3D1C35',
      accentGlow: 'rgba(122, 75, 110, 0.25)',
      badgeBg: '#F7EDF4',
      badgeText: '#3D1C35',
      badgeBorder: '#E3CFDE',
      cardBg: '#FFFFFF',
      cardBorder: '#ECE0E9',
      bannerGradient: 'from-[#3D1A35] via-[#5C2B51] to-[#240F20]',
      avatarBorder: '#7A4B6E',
      previewDots: ['#7A4B6E', '#9E6C91', '#3D1A35']
    },
    fontDisplay: 'Playfair Display, serif',
    badgeIconName: 'ShieldAlert'
  },

  // 7. DARK ACADEMIA / OXFORD ARCHIVE
  'dark-academia': {
    id: 'dark-academia',
    name: 'Oxford Archive Scholar',
    categoryBadge: 'Oxford Archive',
    tagline: 'Classical Scholar Fellow & Antiquarian Archive Profile',
    shortDescription: 'Bookplate frames, classic serif citations, and refined warm plum engravings.',
    personaTitle: 'Senior Research Fellow',
    mascotName: 'Professor Sterling',
    mascotGreeting: 'In the quiet cloisters of the library, true intellectual majesty takes form.',
    motivationalQuote: 'Sapere Aude — Dare to know with relentless scholarly devotion.',
    readinessMetricName: 'Erudition Coefficient',
    rankTitles: {
      level1: 'Undergraduate Scholar',
      level2: 'Junior Fellow',
      level3: 'Senior Researcher',
      level4: 'Distinguished Professor'
    },
    palette: {
      accent: '#825C76',
      accentLight: '#A8849E',
      accentDark: '#42243A',
      accentGlow: 'rgba(130, 92, 118, 0.25)',
      badgeBg: '#F8F1F6',
      badgeText: '#42243A',
      badgeBorder: '#E7D6E3',
      cardBg: '#FFFFFF',
      cardBorder: '#EDE2EB',
      bannerGradient: 'from-[#3B1F34] via-[#5A3350] to-[#251221]',
      avatarBorder: '#825C76',
      previewDots: ['#825C76', '#A8849E', '#3B1F34']
    },
    fontDisplay: 'Playfair Display, serif',
    badgeIconName: 'BookOpen'
  },

  // 8. CINEMATIC
  'cinematic': {
    id: 'cinematic',
    name: 'Cinematic Monolith',
    categoryBadge: 'Feature Director',
    tagline: 'Production Slate & Executive Director Profile',
    shortDescription: 'Widescreen 2.39:1 aspect card header, laurel wreath, and director credits in rose-gold.',
    personaTitle: 'Visionary Director',
    mascotName: 'Orson (Producer AI)',
    mascotGreeting: 'Lights, camera, career. Direct your trajectory like a masterpiece.',
    motivationalQuote: 'Every great career is a story directed by visionary choices.',
    readinessMetricName: 'Production Box Office OVR',
    rankTitles: {
      level1: 'Assistant Director',
      level2: 'Line Producer',
      level3: 'Executive Producer',
      level4: 'Auteur Director'
    },
    palette: {
      accent: '#96637B',
      accentLight: '#B8879E',
      accentDark: '#4A2839',
      accentGlow: 'rgba(150, 99, 123, 0.25)',
      badgeBg: '#F9F1F5',
      badgeText: '#4A2839',
      badgeBorder: '#E9D6E1',
      cardBg: '#FFFFFF',
      cardBorder: '#EDE1E8',
      bannerGradient: 'from-[#421E30] via-[#6E3553] to-[#290F1D]',
      avatarBorder: '#96637B',
      previewDots: ['#96637B', '#B8879E', '#421E30']
    },
    fontDisplay: 'Outfit, sans-serif',
    badgeIconName: 'Film'
  }
};

PROFILE_EXPERIENCES_DATA['fantasy'] = PROFILE_EXPERIENCES_DATA['dark-fantasy'];

export const PROFILE_EXPERIENCE_LIST_DATA: ProfileExperienceConfig[] = [
  PROFILE_EXPERIENCES_DATA['professional'],
  PROFILE_EXPERIENCES_DATA['kpop'],
  PROFILE_EXPERIENCES_DATA['anime'],
  PROFILE_EXPERIENCES_DATA['sports'],
  PROFILE_EXPERIENCES_DATA['gaming'],
  PROFILE_EXPERIENCES_DATA['dark-fantasy'],
  PROFILE_EXPERIENCES_DATA['dark-academia'],
  PROFILE_EXPERIENCES_DATA['cinematic']
];
