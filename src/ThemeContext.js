import { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

const themes = {

  // ── 1. Midnight Gold ─────────────────────────────────────────────────────────
  // Black base with gold accents — mirrors the YJK logo directly
  MidnightGold: {
    '--bg-color': '#F5F0E8',
    '--font-color': '#1A1A1A',
    '--font-hover': '#F5F0E8',
    '--border-color': '#D4B86A',
    '--chart-bg': '#FFFFFF',
    '--sidenav-menu': '#1A1A1A',
    '--sidenav-hover': '#C9A84C',
    '--but': '#C9A84C',
    '--but-border': '#A8863A',
    '--but-hover': '#A8863A',
    '--ag-header': '#1A1A1A',
    '--ag-h1': '#1A1A1A',
    '--ag-row': '#FAF6EE',
    '--ag-col': '#EDE0C4',
    '--ag-row-even-hover': '#D4B86A',
    '--ag-row-odd-hover': '#D4B86A',
    '--exp-input-field': '#F5F0E8',
  },

  // ── 2. Royal Obsidian ────────────────────────────────────────────────────────
  // Deep navy with warm gold — premium and corporate
  RoyalObsidian: {
    '--bg-color': '#EEF2F7',
    '--font-color': '#0D1B2A',
    '--font-hover': '#EEF2F7',
    '--border-color': '#C4B07A',
    '--chart-bg': '#FFFFFF',
    '--sidenav-menu': '#0D1B2A',
    '--sidenav-hover': '#B8922A',
    '--but': '#B8922A',
    '--but-border': '#8F7020',
    '--but-hover': '#8F7020',
    '--ag-header': '#0D1B2A',
    '--ag-h1': '#0D1B2A',
    '--ag-row': '#F2F6FB',
    '--ag-col': '#D6E2EF',
    '--ag-row-even-hover': '#D4AF5A',
    '--ag-row-odd-hover': '#D4AF5A',
    '--exp-input-field': '#EEF2F7',
  },

  // ── 3. Antique Bronze ────────────────────────────────────────────────────────
  // Warm brown tones that echo the logo's amber gradient
  AntiqueBronze: {
    '--bg-color': '#FBF4E8',
    '--font-color': '#3E2A10',
    '--font-hover': '#FBF4E8',
    '--border-color': '#D4A870',
    '--chart-bg': '#FFFFFF',
    '--sidenav-menu': '#3E2A10',
    '--sidenav-hover': '#C07A2A',
    '--but': '#C07A2A',
    '--but-border': '#8F5A1A',
    '--but-hover': '#8F5A1A',
    '--ag-header': '#3E2A10',
    '--ag-h1': '#3E2A10',
    '--ag-row': '#FDF8F0',
    '--ag-col': '#F0DFC0',
    '--ag-row-even-hover': '#E0A84E',
    '--ag-row-odd-hover': '#E0A84E',
    '--exp-input-field': '#FBF4E8',
  },

  // ── 4. Slate & Gold ──────────────────────────────────────────────────────────
  // Cool dark slate with gold pops — sleek and modern
  SlateGold: {
    '--bg-color': '#F0F2F5',
    '--font-color': '#2C3444',
    '--font-hover': '#F0F2F5',
    '--border-color': '#C0B080',
    '--chart-bg': '#FFFFFF',
    '--sidenav-menu': '#2C3444',
    '--sidenav-hover': '#BF9B3A',
    '--but': '#BF9B3A',
    '--but-border': '#8F7220',
    '--but-hover': '#8F7220',
    '--ag-header': '#2C3444',
    '--ag-h1': '#2C3444',
    '--ag-row': '#F5F6F8',
    '--ag-col': '#DDE2EA',
    '--ag-row-even-hover': '#D9BB6A',
    '--ag-row-odd-hover': '#D9BB6A',
    '--exp-input-field': '#F0F2F5',
  },

  // ── 5. Forest & Gilt ─────────────────────────────────────────────────────────
  // Dark forest green with muted gold — earthy luxury
  ForestGilt: {
    '--bg-color': '#EFF5EF',
    '--font-color': '#1B3A2A',
    '--font-hover': '#EFF5EF',
    '--border-color': '#B8C89A',
    '--chart-bg': '#FFFFFF',
    '--sidenav-menu': '#1B3A2A',
    '--sidenav-hover': '#B59A35',
    '--but': '#B59A35',
    '--but-border': '#856E20',
    '--but-hover': '#856E20',
    '--ag-header': '#1B3A2A',
    '--ag-h1': '#1B3A2A',
    '--ag-row': '#F4F9F4',
    '--ag-col': '#CFE4CF',
    '--ag-row-even-hover': '#D4BE72',
    '--ag-row-odd-hover': '#D4BE72',
    '--exp-input-field': '#EFF5EF',
  },

  // ── 6. Crimson Crest ─────────────────────────────────────────────────────────
  // Deep burgundy with gold — bold and prestigious
  CrimsonCrest: {
    '--bg-color': '#FBF0F2',
    '--font-color': '#4A0E1A',
    '--font-hover': '#FBF0F2',
    '--border-color': '#D4A0A8',
    '--chart-bg': '#FFFFFF',
    '--sidenav-menu': '#4A0E1A',
    '--sidenav-hover': '#C49A25',
    '--but': '#C49A25',
    '--but-border': '#8F6E15',
    '--but-hover': '#8F6E15',
    '--ag-header': '#4A0E1A',
    '--ag-h1': '#4A0E1A',
    '--ag-row': '#FEF5F6',
    '--ag-col': '#F0D0D4',
    '--ag-row-even-hover': '#E0BA5A',
    '--ag-row-odd-hover': '#E0BA5A',
    '--exp-input-field': '#FBF0F2',
  },

  // ── 7. Ivory & Brass ─────────────────────────────────────────────────────────
  // Warm ivory with brass gold — refined and minimal
  IvoryBrass: {
    '--bg-color': '#F7F2E8',
    '--font-color': '#2A2010',
    '--font-hover': '#F7F2E8',
    '--border-color': '#C8B080',
    '--chart-bg': '#FFFFFF',
    '--sidenav-menu': '#2A2010',
    '--sidenav-hover': '#A07830',
    '--but': '#A07830',
    '--but-border': '#7A5820',
    '--but-hover': '#7A5820',
    '--ag-header': '#2A2010',
    '--ag-h1': '#2A2010',
    '--ag-row': '#FBF8F2',
    '--ag-col': '#EDE0C8',
    '--ag-row-even-hover': '#C49A50',
    '--ag-row-odd-hover': '#C49A50',
    '--exp-input-field': '#F7F2E8',
  },

  Emerald: {
    '--bg-color': '#E8F8F5',
    '--font-color': '#004D40',
    '--font-hover': '#FFFFFF',
    '--border-color': '#80CBC4',
    '--chart-bg': '#FFFFFF',
    '--sidenav-menu': '#004D40',
    '--sidenav-hover': '#4DB6AC',
    '--but': '#4DB6AC',
    '--but-border': '#003630',
    '--but-hover': '#003630',
    '--ag-header': '#004D40',
    '--ag-h1': '#004D40',
    '--ag-row': '#F1FFF9',
    '--ag-col': '#B2DFDB',
    '--ag-row-even-hover': '#80CBC4',
    '--ag-row-odd-hover': '#80CBC4',
    '--exp-input-field': '#E8F8F5',
  },

  Violet: {
    '--bg-color': '#F8F4FF',
    '--font-color': '#4A148C',
    '--font-hover': '#FFFFFF',
    '--border-color': '#E1BEE7',
    '--chart-bg': '#FFFFFF',
    '--sidenav-menu': '#6A1B9A',
    '--sidenav-hover': '#9C27B0',
    '--but': '#9C27B0',
    '--but-border': '#7B1FA2',
    '--but-hover': '#7B1FA2',
    '--ag-header': '#6A1B9A',
    '--ag-h1': '#6A1B9A',
    '--ag-row': '#F3E5F5',
    '--ag-col': '#E1BEE7',
    '--ag-row-even-hover': '#CE93D8',
    '--ag-row-odd-hover': '#CE93D8',
    '--exp-input-field': '#F8F4FF',
  },

  Tangerine: {
    '--bg-color': '#FEF5E7',
    '--font-color': '#333333',
    '--font-hover': '#FFFFFF',
    '--border-color': '#F5CBA7',
    '--chart-bg': '#FFFFFF',
    '--sidenav-menu': '#E67E22',
    '--sidenav-hover': '#F39C12',
    '--but': '#F39C12',
    '--but-border': '#D68910',
    '--but-hover': '#D68910',
    '--ag-header': '#E67E22',
    '--ag-h1': '#E67E22',
    '--ag-row': '#FCF3CF',
    '--ag-col': '#FAD7A0',
    '--ag-row-even-hover': '#F7DC6F',
    '--ag-row-odd-hover': '#F7DC6F',
    '--exp-input-field': '#FEF5E7',
  },

  Charcoal: {
    '--bg-color': '#F9F9F9',
    '--font-color': '#212121',
    '--font-hover': '#FFFFFF',
    '--border-color': '#E0E0E0',
    '--chart-bg': '#FFFFFF',
    '--sidenav-menu': '#303030',
    '--sidenav-hover': '#616161',
    '--but': '#616161',
    '--but-border': '#424242',
    '--but-hover': '#424242',
    '--ag-header': '#303030',
    '--ag-h1': '#303030',
    '--ag-row': '#F0F0F0',
    '--ag-col': '#E0E0E0',
    '--ag-row-even-hover': '#BDBDBD',
    '--ag-row-odd-hover': '#BDBDBD',
    '--exp-input-field': '#F9F9F9',
  },

  Teal: {
    '--bg-color': '#F0FFFF',
    '--font-color': '#3C5B5B',
    '--font-hover': '#FFFFFF',
    '--border-color': '#B2DFDB',
    '--chart-bg': '#FFFFFF',
    '--sidenav-menu': '#00695C',
    '--sidenav-hover': '#00897B',
    '--but': '#00897B',
    '--but-border': '#00796B',
    '--but-hover': '#00796B',
    '--ag-header': '#00695C',
    '--ag-h1': '#00695C',
    '--ag-row': '#E0F2F1',
    '--ag-col': '#B2DFDB',
    '--ag-row-even-hover': '#80CBC4',
    '--ag-row-odd-hover': '#80CBC4',
    '--exp-input-field': '#F0FFFF',
  },

  Blue: {
    '--bg-color': '#E3F2FD',
    '--font-color': '#0D47A1',
    '--font-hover': '#FFFFFF',
    '--border-color': '#BBDEFB',
    '--chart-bg': '#FFFFFF',
    '--sidenav-menu': '#1565C0',
    '--sidenav-hover': '#2196F3',
    '--but': '#2196F3',
    '--but-border': '#1976D2',
    '--but-hover': '#1976D2',
    '--ag-header': '#1565C0',
    '--ag-h1': '#1565C0',
    '--ag-row': '#F0F8FF',
    '--ag-col': '#90CAF9',
    '--ag-row-even-hover': '#64B5F6',
    '--ag-row-odd-hover': '#64B5F6',
    '--exp-input-field': '#E3F2FD',
  },
  NavyBlue: {
    '--bg-color': '#F4F7FB',
    '--font-color': '#0B1D3A',
    '--font-hover': '#FFFFFF',
    '--border-color': '#D0DCEB',
    '--chart-bg': '#FFFFFF',
    '--sidenav-menu': '#0B1D3A',
    '--sidenav-hover': '#1D3B6C',
    '--but': '#1D3B6C',
    '--but-border': '#0B1D3A',
    '--but-hover': '#0B1D3A',
    '--ag-header': '#0B1D3A',
    '--ag-h1': '#0B1D3A',
    '--ag-row': '#E8EFF7',
    '--ag-col': '#C1D4E8',
    '--ag-row-even-hover': '#9BB8D7',
    '--ag-row-odd-hover': '#9BB8D7',
    '--exp-input-field': '#F4F7FB',
  },

  PremiumGold: {
    '--bg-color': '#FCFBF7',          
    '--font-color': '#1A1A1A',        
    '--font-hover': '#FFFFFF',
    '--border-color': '#D4AF37',      
    '--chart-bg': '#FFFFFF',          
    '--sidenav-menu': '#0A0A0A',      
    '--sidenav-hover': '#E6BC32',     
    '--but': '#D4AF37',               
    '--but-border': '#B8860B',        
    '--but-hover': '#B8860B',         
    '--ag-header': '#0A0A0A',         
    '--ag-h1': '#0A0A0A',             
    '--ag-row': '#FFFFFF',            
    '--ag-col': '#F3E8CE',            
    '--ag-row-even-hover': '#F7EBAA', 
    '--ag-row-odd-hover': '#F7EBAA',
    '--exp-input-field': '#FCFBF7',   
  }
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('PremiumGold');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && themes[savedTheme]) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      applyTheme('PremiumGold');
    }
  }, []);

  const applyTheme = (themeName) => {
    const root = document.documentElement;
    if (themes[themeName]) {
      Object.keys(themes[themeName]).forEach((key) => {
        root.style.setProperty(key, themes[themeName][key]);
      });
    } else {
      console.error(`Theme "${themeName}" not found.`);
      applyTheme('PremiumGold');
    }
  };

  const setAppTheme = (themeName) => {
    setTheme(themeName);
    applyTheme(themeName);
    localStorage.setItem('theme', themeName);
  };

  return (
    <ThemeContext.Provider value={{ theme, setAppTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};