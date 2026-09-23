import React from 'react';

export interface AbstractAvatarPreset {
  id: string;
  name: string;
  category: 'abstract' | 'geometric' | 'minimalist' | 'gradient';
  description: string;
  renderSvg: (props?: { className?: string; size?: number }) => React.ReactNode;
}

export interface GeneratedAvatarStyle {
  id: string;
  name: string;
  genre: 'cyber' | 'pixel' | 'fantasy' | 'minimal' | 'synthwave' | 'poly';
  description: string;
  palette: string[];
  renderSvg: (seed: string, colorIndex?: number, props?: { className?: string }) => React.ReactNode;
}

// ============================================================================
// 1. ABSTRACT ILLUSTRATED AVATARS (ORIGINAL VECTOR ARTWORKS)
// ============================================================================
export const ABSTRACT_AVATAR_PRESETS: AbstractAvatarPreset[] = [
  {
    id: 'abstract-prism-crystal',
    name: 'Prism Geometry',
    category: 'geometric',
    description: 'Vibrant refractive crystalline geometry with multi-angled facets',
    renderSvg: ({ className = 'w-full h-full' } = {}) => (
      <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="120" rx="24" fill="#0f172a" />
        <defs>
          <linearGradient id="prism1" x1="20" y1="20" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38bdf8" />
            <stop offset="0.5" stopColor="#818cf8" />
            <stop offset="1" stopColor="#c084fc" />
          </linearGradient>
          <linearGradient id="prism2" x1="100" y1="20" x2="20" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f43f5e" />
            <stop offset="0.5" stopColor="#fb923c" />
            <stop offset="1" stopColor="#fbbf24" />
          </linearGradient>
          <linearGradient id="prism3" x1="60" y1="10" x2="60" y2="110" gradientUnits="userSpaceOnUse">
            <stop stopColor="#22d3ee" stopOpacity="0.8" />
            <stop offset="1" stopColor="#4f46e5" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        <polygon points="60,18 102,42 102,90 60,114 18,90 18,42" fill="url(#prism3)" />
        <polygon points="60,18 102,42 60,66 18,42" fill="url(#prism1)" opacity="0.9" />
        <polygon points="60,66 102,42 102,90 60,66" fill="#6366f1" opacity="0.8" />
        <polygon points="60,66 102,90 60,114 18,90" fill="url(#prism2)" opacity="0.85" />
        <polygon points="18,42 60,66 18,90" fill="#06b6d4" opacity="0.75" />
        <circle cx="60" cy="66" r="8" fill="#ffffff" opacity="0.9" />
        <polygon points="60,35 75,52 60,69 45,52" fill="#ffffff" opacity="0.3" />
      </svg>
    )
  },
  {
    id: 'abstract-celestial-orb',
    name: 'Celestial Nexus',
    category: 'abstract',
    description: 'Orbital energy rings orbiting an ethereal cosmic core',
    renderSvg: ({ className = 'w-full h-full' } = {}) => (
      <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="120" rx="24" fill="#090514" />
        <defs>
          <radialGradient id="orbCore" cx="60" cy="60" r="45" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ec4899" />
            <stop offset="0.4" stopColor="#8b5cf6" />
            <stop offset="0.8" stopColor="#3b82f6" />
            <stop offset="1" stopColor="#090514" />
          </radialGradient>
          <linearGradient id="ringGrad1" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
            <stop stopColor="#06b6d4" />
            <stop offset="1" stopColor="#f43f5e" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="42" fill="url(#orbCore)" opacity="0.85" />
        <ellipse cx="60" cy="60" rx="46" ry="18" stroke="url(#ringGrad1)" strokeWidth="2.5" transform="rotate(-30 60 60)" />
        <ellipse cx="60" cy="60" rx="46" ry="18" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4 4" transform="rotate(45 60 60)" />
        <circle cx="60" cy="60" r="16" fill="#ffffff" opacity="0.95" filter="drop-shadow(0 0 8px rgba(255,255,255,0.8))" />
        <circle cx="34" cy="42" r="3" fill="#38bdf8" />
        <circle cx="86" cy="78" r="4" fill="#f472b6" />
        <circle cx="78" cy="38" r="2.5" fill="#fef08a" />
      </svg>
    )
  },
  {
    id: 'abstract-bauhaus-arch',
    name: 'Bauhaus Arch',
    category: 'geometric',
    description: 'Clean modern architectural forms and bold minimalist color blocking',
    renderSvg: ({ className = 'w-full h-full' } = {}) => (
      <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="120" rx="24" fill="#18181b" />
        <circle cx="60" cy="60" r="42" fill="#27272a" />
        <path d="M30 96V54C30 37.4315 43.4315 24 60 24C76.5685 24 90 37.4315 90 54V96H30Z" fill="#3b82f6" />
        <path d="M45 96V60C45 51.7157 51.7157 45 60 45C68.2843 45 75 51.7157 75 60V96H45Z" fill="#fbbf24" />
        <circle cx="60" cy="36" r="8" fill="#f43f5e" />
        <rect x="36" y="78" width="48" height="4" rx="2" fill="#18181b" opacity="0.8" />
        <circle cx="60" cy="72" r="5" fill="#18181b" />
      </svg>
    )
  },
  {
    id: 'abstract-emerald-helix',
    name: 'Emerald Helix',
    category: 'gradient',
    description: 'Harmonious biophilic green ribbons flowing in equilibrium',
    renderSvg: ({ className = 'w-full h-full' } = {}) => (
      <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="120" rx="24" fill="#022c22" />
        <defs>
          <linearGradient id="emGrad1" x1="20" y1="20" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#34d399" />
            <stop offset="1" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="emGrad2" x1="100" y1="20" x2="20" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#a7f3d0" />
            <stop offset="1" stopColor="#10b981" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="44" stroke="#065f46" strokeWidth="4" />
        <path d="M26 60C26 41.2223 41.2223 26 60 26C78.7777 26 94 41.2223 94 60C94 78.7777 78.7777 94 60 94" stroke="url(#emGrad1)" strokeWidth="8" strokeLinecap="round" />
        <path d="M40 60C40 48.9543 48.9543 40 60 40C71.0457 40 80 48.9543 80 60C80 71.0457 71.0457 80 60 80" stroke="url(#emGrad2)" strokeWidth="6" strokeLinecap="round" />
        <circle cx="60" cy="60" r="9" fill="#6ee7b7" />
        <circle cx="60" cy="60" r="4" fill="#ffffff" />
      </svg>
    )
  },
  {
    id: 'abstract-aurora-waves',
    name: 'Aurora Waves',
    category: 'abstract',
    description: 'Ethereal curtains of northern spectral light waves',
    renderSvg: ({ className = 'w-full h-full' } = {}) => (
      <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="120" rx="24" fill="#080e1a" />
        <defs>
          <linearGradient id="aurora1" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2dd4bf" />
            <stop offset="0.5" stopColor="#6366f1" />
            <stop offset="1" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        <path d="M20 90C40 70 50 100 70 80C90 60 100 90 110 70V110H20V90Z" fill="url(#aurora1)" opacity="0.4" />
        <path d="M10 75C35 45 55 90 80 60C95 45 105 70 115 50V110H10V75Z" fill="url(#aurora1)" opacity="0.6" />
        <path d="M15 55C30 30 60 65 85 35C100 20 110 40 120 25V110H15V55Z" fill="url(#aurora1)" opacity="0.8" />
        <circle cx="35" cy="30" r="2.5" fill="#ffffff" opacity="0.8" />
        <circle cx="85" cy="22" r="3" fill="#ffffff" opacity="0.9" />
        <circle cx="100" cy="45" r="2" fill="#ffffff" opacity="0.7" />
      </svg>
    )
  },
  {
    id: 'abstract-origami-crane',
    name: 'Origami Vanguard',
    category: 'geometric',
    description: 'Minimalist folded geometry evoking balance, craft, and ascension',
    renderSvg: ({ className = 'w-full h-full' } = {}) => (
      <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="120" rx="24" fill="#1e1b4b" />
        <defs>
          <linearGradient id="oriGrad" x1="30" y1="20" x2="90" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fb7185" />
            <stop offset="1" stopColor="#a855f7" />
          </linearGradient>
        </defs>
        <polygon points="60,20 85,50 60,80 35,50" fill="url(#oriGrad)" />
        <polygon points="60,20 85,50 60,55" fill="#fda4af" opacity="0.9" />
        <polygon points="60,55 85,50 60,80" fill="#9333ea" opacity="0.8" />
        <polygon points="60,20 35,50 60,55" fill="#e11d48" opacity="0.7" />
        <polygon points="60,55 35,50 60,80" fill="#7e22ce" opacity="0.9" />
        <polygon points="60,80 75,102 60,95" fill="#c084fc" />
        <polygon points="60,80 45,102 60,95" fill="#a855f7" />
      </svg>
    )
  },
  {
    id: 'abstract-quantum-lattice',
    name: 'Quantum Lattice',
    category: 'minimalist',
    description: 'Clean isometric node network symbolizing connected logic and intelligence',
    renderSvg: ({ className = 'w-full h-full' } = {}) => (
      <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="120" rx="24" fill="#0f172a" />
        <line x1="60" y1="26" x2="90" y2="44" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
        <line x1="90" y1="44" x2="90" y2="76" stroke="#38bdf8" strokeWidth="2" />
        <line x1="90" y1="76" x2="60" y2="94" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
        <line x1="60" y1="94" x2="30" y2="76" stroke="#38bdf8" strokeWidth="2" />
        <line x1="30" y1="76" x2="30" y2="44" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
        <line x1="30" y1="44" x2="60" y2="26" stroke="#38bdf8" strokeWidth="2" />
        
        <line x1="60" y1="26" x2="60" y2="60" stroke="#818cf8" strokeWidth="2" />
        <line x1="90" y1="44" x2="60" y2="60" stroke="#818cf8" strokeWidth="2" />
        <line x1="90" y1="76" x2="60" y2="60" stroke="#818cf8" strokeWidth="2" />
        <line x1="60" y1="94" x2="60" y2="60" stroke="#818cf8" strokeWidth="2" />
        <line x1="30" y1="76" x2="60" y2="60" stroke="#818cf8" strokeWidth="2" />
        <line x1="30" y1="44" x2="60" y2="60" stroke="#818cf8" strokeWidth="2" />

        <circle cx="60" cy="26" r="5" fill="#38bdf8" />
        <circle cx="90" cy="44" r="5" fill="#38bdf8" />
        <circle cx="90" cy="76" r="5" fill="#818cf8" />
        <circle cx="60" cy="94" r="5" fill="#c084fc" />
        <circle cx="30" cy="76" r="5" fill="#818cf8" />
        <circle cx="30" cy="44" r="5" fill="#38bdf8" />
        <circle cx="60" cy="60" r="7" fill="#ffffff" filter="drop-shadow(0 0 6px #38bdf8)" />
      </svg>
    )
  },
  {
    id: 'abstract-golden-mandala',
    name: 'Solar Emblem',
    category: 'geometric',
    description: 'Golden radiant sun glyph signifying enlightenment and mastery',
    renderSvg: ({ className = 'w-full h-full' } = {}) => (
      <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="120" rx="24" fill="#1c1408" />
        <defs>
          <radialGradient id="sunGrad" cx="60" cy="60" r="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fef08a" />
            <stop offset="0.5" stopColor="#eab308" />
            <stop offset="1" stopColor="#854d0e" />
          </radialGradient>
        </defs>
        <circle cx="60" cy="60" r="42" stroke="#eab308" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
        <circle cx="60" cy="60" r="32" fill="url(#sunGrad)" />
        <circle cx="60" cy="60" r="22" stroke="#fef08a" strokeWidth="2" fill="#1c1408" />
        <circle cx="60" cy="60" r="10" fill="#fef08a" />
        {/* Sun rays */}
        <line x1="60" y1="12" x2="60" y2="22" stroke="#fde047" strokeWidth="3" strokeLinecap="round" />
        <line x1="60" y1="98" x2="60" y2="108" stroke="#fde047" strokeWidth="3" strokeLinecap="round" />
        <line x1="12" y1="60" x2="22" y2="60" stroke="#fde047" strokeWidth="3" strokeLinecap="round" />
        <line x1="98" y1="60" x2="108" y2="60" stroke="#fde047" strokeWidth="3" strokeLinecap="round" />
        <line x1="26" y1="26" x2="33" y2="33" stroke="#fde047" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="87" y1="87" x2="94" y2="94" stroke="#fde047" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="26" y1="94" x2="33" y2="87" stroke="#fde047" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="87" y1="33" x2="94" y2="26" stroke="#fde047" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    )
  }
];

// ============================================================================
// 2. GENERATED NON-PHOTOREALISTIC AVATAR STYLES
// ============================================================================
export const GENERATED_AVATAR_STYLES: GeneratedAvatarStyle[] = [
  {
    id: 'style-cyber-vector',
    name: 'Cyberpunk Vector Hologram',
    genre: 'cyber',
    description: 'Futuristic HUD wireframe visor & neon vector telemetry',
    palette: ['#06b6d4', '#3b82f6', '#ec4899', '#10b981'],
    renderSvg: (seed: string, colorIndex = 0, { className = 'w-full h-full' } = {}) => {
      const colors = ['#06b6d4', '#a855f7', '#ec4899', '#3b82f6', '#10b981'];
      const mainColor = colors[colorIndex % colors.length];
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="120" height="120" rx="24" fill="#080c16" />
          <defs>
            <linearGradient id={`cyberG_${seed}`} x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
              <stop stopColor={mainColor} />
              <stop offset="1" stopColor="#6366f1" />
            </linearGradient>
          </defs>
          {/* Cyber grid lines */}
          <path d="M10 60H110 M60 10V110" stroke={mainColor} strokeOpacity="0.2" strokeWidth="1" />
          <circle cx="60" cy="60" r="46" stroke={mainColor} strokeWidth="1" strokeDasharray="6 3" strokeOpacity="0.5" />
          {/* Head & Visor contour */}
          <path d="M42 40C42 28 50 20 60 20C70 20 78 28 78 40V68C78 78 70 86 60 86C50 86 42 78 42 68V40Z" fill="#111827" stroke={mainColor} strokeWidth="2.5" />
          {/* Glowing Visor */}
          <path d="M36 48H84C86 48 88 50 88 53V57C88 60 86 62 84 62H36C34 62 32 60 32 57V53C32 50 34 48 36 48Z" fill={`url(#cyberG_${seed})`} filter="drop-shadow(0 0 8px rgba(6,182,212,0.8))" />
          <line x1="38" y1="55" x2="82" y2="55" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          {/* Shoulders */}
          <path d="M26 108C26 94 38 90 60 90C82 90 94 94 94 108" stroke={mainColor} strokeWidth="2.5" strokeLinecap="round" />
          {/* Audio/Data nodes */}
          <rect x="36" y="50" width="4" height="10" rx="2" fill="#ffffff" />
          <rect x="80" y="50" width="4" height="10" rx="2" fill="#ffffff" />
          <text x="60" y="102" textAnchor="middle" fill={mainColor} fontSize="8" fontFamily="monospace" fontWeight="bold">ID // 0X8F</text>
        </svg>
      );
    }
  },
  {
    id: 'style-pixel-vanguard',
    name: '8-Bit Pixel Vanguard',
    genre: 'pixel',
    description: 'Retro pixelated tech hero avatar with game-ready block styling',
    palette: ['#fbbf24', '#34d399', '#60a5fa', '#f472b6'],
    renderSvg: (seed: string, colorIndex = 0, { className = 'w-full h-full' } = {}) => {
      const colors = ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6'];
      const accent = colors[colorIndex % colors.length];
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="120" height="120" rx="24" fill="#18181b" />
          {/* Pixelated Hair / Helmet */}
          <rect x="42" y="24" width="36" height="12" fill={accent} />
          <rect x="36" y="30" width="48" height="12" fill={accent} />
          {/* Face */}
          <rect x="36" y="42" width="48" height="30" fill="#fde047" />
          {/* Pixel Eyes */}
          <rect x="44" y="48" width="8" height="8" fill="#18181b" />
          <rect x="46" y="48" width="4" height="4" fill="#ffffff" />
          <rect x="68" y="48" width="8" height="8" fill="#18181b" />
          <rect x="70" y="48" width="4" height="4" fill="#ffffff" />
          {/* Pixel Glasses / Shades */}
          <rect x="40" y="46" width="16" height="10" fill="#09090b" opacity="0.85" />
          <rect x="64" y="46" width="16" height="10" fill="#09090b" opacity="0.85" />
          <rect x="56" y="48" width="8" height="4" fill="#09090b" opacity="0.85" />
          {/* Pixel Smile */}
          <rect x="52" y="64" width="16" height="4" fill="#18181b" />
          {/* Pixel Armor / Hoodie */}
          <rect x="30" y="78" width="60" height="32" fill={accent} />
          <rect x="46" y="78" width="28" height="32" fill="#ffffff" opacity="0.3" />
          <rect x="56" y="86" width="8" height="18" fill="#18181b" />
        </svg>
      );
    }
  },
  {
    id: 'style-minimal-duotone',
    name: 'Minimalist Duotone Silhouette',
    genre: 'minimal',
    description: 'High-contrast studio silhouette with elegant geometric framing',
    palette: ['#6366f1', '#ec4899', '#14b8a6', '#f97316'],
    renderSvg: (seed: string, colorIndex = 0, { className = 'w-full h-full' } = {}) => {
      const colors = ['#6366f1', '#ec4899', '#0d9488', '#ea580c', '#8b5cf6'];
      const bgAccent = colors[colorIndex % colors.length];
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="120" height="120" rx="24" fill="#09090b" />
          {/* Duotone Circle */}
          <circle cx="60" cy="56" r="40" fill={bgAccent} />
          <path d="M60 16C82.0914 16 100 33.9086 100 56C100 78.0914 82.0914 96 60 96V16Z" fill="#ffffff" opacity="0.25" />
          {/* Silhouette Head */}
          <circle cx="60" cy="46" r="18" fill="#09090b" />
          {/* Silhouette Hair */}
          <path d="M42 42C42 30 50 24 60 24C70 24 78 30 78 42C78 44 74 38 60 38C46 38 42 44 42 42Z" fill="#ffffff" opacity="0.9" />
          {/* Silhouette Torso */}
          <path d="M30 104C30 84 44 74 60 74C76 74 90 84 90 104H30Z" fill="#09090b" />
          <circle cx="60" cy="48" r="3" fill="#ffffff" opacity="0.6" />
        </svg>
      );
    }
  },
  {
    id: 'style-poly-mesh',
    name: 'Polyhedral Low-Poly Cyber Mesh',
    genre: 'poly',
    description: '3D faceted vector mesh representing multi-dimensional intellect',
    palette: ['#38bdf8', '#818cf8', '#a855f7', '#34d399'],
    renderSvg: (seed: string, colorIndex = 0, { className = 'w-full h-full' } = {}) => {
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="120" height="120" rx="24" fill="#0a0a14" />
          {/* Low Poly Head */}
          <polygon points="60,20 80,35 60,50" fill="#38bdf8" />
          <polygon points="60,20 40,35 60,50" fill="#0284c7" />
          <polygon points="40,35 28,55 46,65 60,50" fill="#0369a1" />
          <polygon points="80,35 92,55 74,65 60,50" fill="#7dd3fc" />
          <polygon points="46,65 60,50 74,65 60,82" fill="#818cf8" />
          <polygon points="28,55 46,65 44,86 60,82" fill="#6366f1" />
          <polygon points="92,55 74,65 76,86 60,82" fill="#a5b4fc" />
          <polygon points="44,86 60,82 76,86 60,102" fill="#4f46e5" />
          {/* Glowing Vertex Points */}
          <circle cx="60" cy="20" r="2.5" fill="#ffffff" />
          <circle cx="80" cy="35" r="2.5" fill="#ffffff" />
          <circle cx="40" cy="35" r="2.5" fill="#ffffff" />
          <circle cx="60" cy="50" r="3" fill="#ffffff" />
          <circle cx="60" cy="82" r="3" fill="#ffffff" />
          <circle cx="60" cy="102" r="2.5" fill="#ffffff" />
        </svg>
      );
    }
  },
  {
    id: 'style-fantasy-sigil',
    name: 'Fantasy Arcane Inscription Glyph',
    genre: 'fantasy',
    description: 'Mystical arcanum crest radiating ancient scholastic mastery',
    palette: ['#d4af37', '#fef08a', '#c084fc', '#fb7185'],
    renderSvg: (seed: string, colorIndex = 0, { className = 'w-full h-full' } = {}) => {
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="120" height="120" rx="24" fill="#0e071a" />
          <defs>
            <radialGradient id="sigilG" cx="60" cy="60" r="45" gradientUnits="userSpaceOnUse">
              <stop stopColor="#581845" />
              <stop offset="1" stopColor="#0e071a" />
            </radialGradient>
          </defs>
          <circle cx="60" cy="60" r="44" fill="url(#sigilG)" stroke="#d4af37" strokeWidth="2" strokeDasharray="4 2" />
          <circle cx="60" cy="60" r="34" stroke="#d4af37" strokeWidth="1.5" />
          {/* Dual Intersecting Triangles (Hexagram Seal) */}
          <polygon points="60,28 86,72 34,72" stroke="#fef08a" strokeWidth="2" fill="none" />
          <polygon points="60,92 86,48 34,48" stroke="#d4af37" strokeWidth="2" fill="none" />
          {/* Central Eye / Orb */}
          <circle cx="60" cy="60" r="10" fill="#581845" stroke="#fef08a" strokeWidth="2" />
          <circle cx="60" cy="60" r="4" fill="#ffffff" filter="drop-shadow(0 0 4px #fef08a)" />
          {/* Runes */}
          <text x="60" y="24" textAnchor="middle" fill="#d4af37" fontSize="8" fontFamily="serif">᚛ ᚌ ᚜</text>
          <text x="60" y="104" textAnchor="middle" fill="#d4af37" fontSize="8" fontFamily="serif">᚛ ᚏ ᚜</text>
        </svg>
      );
    }
  },
  {
    id: 'style-synthwave-neon',
    name: 'Synthwave Neon Vector',
    genre: 'synthwave',
    description: 'Retro 80s outrun wireframe horizon with luminous neon sun',
    palette: ['#ec4899', '#06b6d4', '#f59e0b', '#8b5cf6'],
    renderSvg: (seed: string, colorIndex = 0, { className = 'w-full h-full' } = {}) => {
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="120" height="120" rx="24" fill="#0d041a" />
          <defs>
            <linearGradient id="synthSun" x1="60" y1="20" x2="60" y2="70" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f43f5e" />
              <stop offset="0.7" stopColor="#fbbf24" />
            </linearGradient>
          </defs>
          {/* Glowing Sun with Horizontal Blinds */}
          <circle cx="60" cy="46" r="28" fill="url(#synthSun)" />
          <line x1="32" y1="42" x2="88" y2="42" stroke="#0d041a" strokeWidth="2.5" />
          <line x1="34" y1="49" x2="86" y2="49" stroke="#0d041a" strokeWidth="3" />
          <line x1="38" y1="57" x2="82" y2="57" stroke="#0d041a" strokeWidth="3.5" />
          <line x1="44" y1="65" x2="76" y2="65" stroke="#0d041a" strokeWidth="4" />
          {/* Perspective Grid */}
          <line x1="10" y1="74" x2="110" y2="74" stroke="#06b6d4" strokeWidth="2" />
          <line x1="10" y1="84" x2="110" y2="84" stroke="#06b6d4" strokeWidth="1.5" />
          <line x1="10" y1="96" x2="110" y2="96" stroke="#06b6d4" strokeWidth="1" />
          <line x1="60" y1="74" x2="10" y2="114" stroke="#ec4899" strokeWidth="1.5" />
          <line x1="60" y1="74" x2="35" y2="114" stroke="#ec4899" strokeWidth="1.5" />
          <line x1="60" y1="74" x2="60" y2="114" stroke="#ec4899" strokeWidth="1.5" />
          <line x1="60" y1="74" x2="85" y2="114" stroke="#ec4899" strokeWidth="1.5" />
          <line x1="60" y1="74" x2="110" y2="114" stroke="#ec4899" strokeWidth="1.5" />
        </svg>
      );
    }
  }
];
