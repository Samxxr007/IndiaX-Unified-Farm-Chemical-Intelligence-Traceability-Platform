/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Foliage & Canopy (Primary Greens)
        primary: {
          DEFAULT: '#1B4D3E', // Deep Forest Canopy (agri-forest)
          leaf: '#2D6A4F',    // Active Crop Green
          forest: '#1B4D3E',  // Deep Forest Canopy
          sprout: '#D8F3DC',  // Tender Shoot Accent / Active Pill
          hover: '#143D31',
          subtle: '#EAF5EC',
        },
        // Earth, Soil & Canvas (Surfaces & Neutrals)
        earth: {
          canvas: '#FAF8F5',  // Warm Cream / Raw Linen Canvas
          surface: '#FFFFFF', // Crisp Clean Sheet
          card: '#FDFBF7',    // Sun-dried Parchment Card
          border: '#E6DFD5',  // Warm Sandstone Border
          borderDark: '#D4C9BC',
          bark: '#3D2B1F',    // Deep Umber / High-contrast Headings
          timber: '#705847',  // Weathered Wood / Muted Labels
          moss: '#14281D',    // Deep Earth-Canopy Slate for Sidebar
          slateMoss: '#16281E', // Diagnostic Risk Panel
        },
        // Harvest & Field Status Tokens
        crop: {
          healthy: '#2B9348', // Harvest Ready (Success)
          'healthy-bg': '#EAF5EC',
          'healthy-border': '#A7D7B5',
        },
        soil: {
          dry: '#D97706',     // Amber Ochre / Moderate Alert (Warning)
          'dry-bg': '#FEF3C7',
          'dry-border': '#FCD34D',
        },
        blight: {
          danger: '#B91C1C',  // Rust Red / Severe Risk (Critical)
          'danger-bg': '#FEE2E2',
          'danger-border': '#FCA5A5',
        },
        water: {
          stream: '#1D70B8',  // Canal Water Blue / Regulatory Sync (Info)
          'stream-bg': '#E0F2FE',
          'stream-border': '#BAE6FD',
        },
        // Status Aliases for backward compatibility
        status: {
          success: '#2B9348',
          'success-bg': '#EAF5EC',
          'success-border': '#A7D7B5',
          warning: '#D97706',
          'warning-bg': '#FEF3C7',
          'warning-border': '#FCD34D',
          danger: '#B91C1C',
          'danger-bg': '#FEE2E2',
          'danger-border': '#FCA5A5',
          info: '#1D70B8',
          'info-bg': '#E0F2FE',
          'info-border': '#BAE6FD',
        },
        background: '#FAF8F5', // Warm Cream Canvas
        surface: {
          DEFAULT: '#FFFFFF',
          inset: '#F4EFEA',
          card: '#FDFBF7',
        },
        text: {
          primary: '#3D2B1F', // Deep Umber Primary
          secondary: '#705847', // Weathered Wood Secondary
          muted: '#9C8878',
        },
        border: {
          DEFAULT: '#E6DFD5', // Warm Sandstone Border
          dark: '#D4C9BC',
          light: '#F4EFEA',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(61, 43, 31, 0.05), 0 1px 2px -1px rgba(61, 43, 31, 0.03), inset 0 1px 0 0 rgba(255, 255, 255, 0.9)',
        'card-hover': '0 4px 12px -2px rgba(61, 43, 31, 0.08), 0 2px 6px -1px rgba(61, 43, 31, 0.04), inset 0 1px 0 0 rgba(255, 255, 255, 1)',
        'panel': '0 10px 25px -5px rgba(20, 40, 29, 0.25), 0 8px 10px -6px rgba(20, 40, 29, 0.2)',
        'hud': '0 20px 30px -10px rgba(20, 40, 29, 0.4), inset 0 1px 0 0 rgba(216, 243, 220, 0.15)',
        'modal': '0 25px 50px -12px rgba(61, 43, 31, 0.2), inset 0 1px 0 0 rgba(255, 255, 255, 0.8)',
        'dropdown': '0 12px 24px -4px rgba(61, 43, 31, 0.1), 0 4px 8px -2px rgba(61, 43, 31, 0.05)',
      },
      borderRadius: {
        'card': '10px',
      },
    },
  },
  plugins: [],
}
