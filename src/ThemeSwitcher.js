import { useTheme } from './ThemeContext';

const ThemeSwitcher = ({ layout = "vertical" }) => {
  const { theme, setAppTheme } = useTheme();

  const themes = [
    { name: 'MidnightGold',  label: 'Midnight Gold',   color: '#1A1A1A', },
    { name: 'RoyalObsidian', label: 'Royal Obsidian',  color: '#0D1B2A', },
    { name: 'AntiqueBronze', label: 'Antique Bronze',  color: '#3E2A10', },
    { name: 'SlateGold',     label: 'Slate & Gold',    color: '#2C3444', },
    { name: 'ForestGilt',    label: 'Forest & Gilt',   color: '#1B3A2A', },
    { name: 'CrimsonCrest',  label: 'Crimson Crest',   color: '#4A0E1A', },
    { name: 'IvoryBrass',    label: 'Ivory & Brass',   color: '#2A2010', },
    { name: 'Emerald',       label: 'Emerald',         color: '#2ECC71' },
    { name: 'Violet',        label: 'Violet',          color: '#9B59B6' },
    { name: 'Charcoal',      label: 'Charcoal',        color: '#34495E' },
    { name: 'Teal',          label: 'Teal',            color: '#1ABC9C' },
    { name: 'Blue',          label: 'Blue',            color: '#2196F3' },
    { name: 'NavyBlue',      label: 'NavyBlue',        color: '#0B1D3A' },
    { name: 'PremiumGold',   label: 'PremiumGold',     color: '#1A1A1A' }
  ];

  return (
    <div
      className={`theme-dropdown-container ${
        layout === 'horizontal'
          ? 'd-flex flex-row align-items-center gap-3'
          : 'd-flex flex-column align-items-center gap-3'
      }`}
    >
      {themes.map((t) => (
        <div
          key={t.name}
          className="theme-item-wrapper"
          onClick={() => setAppTheme(t.name)}
          title={t.label}
        >
          <div
            className={`theme-circle ${theme === t.name ? 'active' : ''}`}
            style={{
              backgroundColor: t.color,
              boxShadow: theme === t.name
                ? `0 0 0 3px #fff, 0 0 0 5px ${t.border}`
                : 'none',
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default ThemeSwitcher;