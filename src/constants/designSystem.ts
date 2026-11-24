/**
 * Radiant Contemporary Silk Heritage Design System (CSHDS)
 * Vibrant, modern, high-contrast palette for Vạn Phúc Silk Village
 */

export const DESIGN_TOKENS = {
  colors: {
    // Vibrant Silk Ruby & Magenta (Rực rỡ, cuốn hút)
    crimson: {
      DEFAULT: '#E11D48',
      hover: '#BE123C',
      light: '#FFF1F2',
      border: 'rgba(225, 29, 72, 0.3)',
      gradient: 'linear-gradient(135deg, #E11D48 0%, #BE123C 50%, #9F1239 100%)',
    },
    // Radiant Amber Gold (Hoàng kim óng ánh)
    gold: {
      DEFAULT: '#F59E0B',
      hover: '#D97706',
      light: '#FFFBEB',
      border: 'rgba(245, 158, 11, 0.4)',
      shimmer: 'linear-gradient(135deg, #FDE68A 0%, #F59E0B 50%, #D97706 100%)',
    },
    // Royal Sapphire Blue (Lam ngọc sâu lắng)
    sapphire: {
      DEFAULT: '#2563EB',
      hover: '#1D4ED8',
      light: '#EFF6FF',
      border: 'rgba(37, 99, 235, 0.3)',
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
    },
    // Vivid Emerald Jade (Ngọc lục bảo)
    jade: {
      DEFAULT: '#059669',
      hover: '#047857',
      light: '#ECFDF5',
      border: 'rgba(5, 150, 105, 0.3)',
    },
    canvas: {
      DEFAULT: '#FFFFFF',
      subtle: '#FAFAFA',
      surface: '#FFFFFF',
    },
    ink: {
      primary: '#0F172A',
      secondary: '#334155',
      muted: '#64748B',
      hairline: '#E2E8F0',
    },
  },
  typography: {
    display: '"Times New Roman", Times, serif',
    sans: '"Times New Roman", Times, serif',
    mono: '"JetBrains Mono", ui-monospace, monospace',
  },
  radius: {
    badge: '9999px',
    button: '0.875rem', // 14px
    card: '1.25rem', // 20px
    hero: '1.75rem', // 28px
  },
  shadows: {
    silkCard: '0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.03)',
    silkCardHover: '0 20px 35px -5px rgba(225, 29, 72, 0.12), 0 10px 20px -5px rgba(245, 158, 11, 0.1)',
    glowGold: '0 0 24px -2px rgba(245, 158, 11, 0.4)',
    glowCrimson: '0 0 24px -2px rgba(225, 29, 72, 0.45)',
  },
} as const;

export const HERITAGE_BADGES = {
  nationalHeritage: {
    vi: 'Di sản Văn hóa Quốc gia',
    en: 'National Intangible Cultural Heritage',
    className: 'silk-badge silk-badge-crimson',
  },
  worldCrafts: {
    vi: 'Thành viên WCC Creative Craft City',
    en: 'WCC Creative Craft City Member',
    className: 'silk-badge silk-badge-sapphire',
  },
  ocopFiveStar: {
    vi: 'OCOP 5 Sao Tơ Lụa Thủ Công',
    en: '5-Star OCOP Silk Craft',
    className: 'silk-badge silk-badge-gold',
  },
} as const;
