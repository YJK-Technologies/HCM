import { useTheme } from './ThemeContext';

const ThemeSwitcher = ({ layout = "vertical" }) => {
  const { theme, setAppTheme } = useTheme();

  const themes = [
    { name: 'Emerald', color: '#2ecc71' },
    { name: 'Violet', color: '#9b59b6' },
    { name: 'Tangerine', color: '#e67e22' },
    { name: 'Charcoal', color: '#34495e' },
    { name: 'Teal', color: '#1abc9c' },
  ];

  return (
    <div
      className={`theme-dropdown-container ${
        layout === "horizontal"
          ? "d-flex flex-row align-items-center gap-3"
          : "d-flex flex-column align-items-center gap-3"
      }`}
    >
      {themes.map((t) => (
        <div
          key={t.name}
          className="theme-item-wrapper"
          onClick={() => setAppTheme(t.name)}
        >
          <div
            title={t.name}
            className={`theme-circle ${
              theme === t.name ? 'active' : ''
            }`}
            style={{ backgroundColor: t.color }}
          />
        </div>
      ))}
    </div>
  );
};

export default ThemeSwitcher;