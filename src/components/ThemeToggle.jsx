import { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

const storageKey = "aryan-portfolio-theme";

function preferredTheme() {
  if (typeof window === "undefined") return "dark";
  const saved = window.localStorage.getItem(storageKey);
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState(preferredTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(storageKey, theme);
  }, [theme]);

  const nextTheme = theme === "dark" ? "light" : "dark";
  return (
    <button
      className="theme-toggle"
      type="button"
      aria-label={`Switch to ${nextTheme} mode`}
      aria-pressed={theme === "light"}
      onClick={() => setTheme(nextTheme)}
    >
      <span className="theme-toggle__track" aria-hidden="true">
        <FiSun className="theme-toggle__sun" />
        <FiMoon className="theme-toggle__moon" />
        <span className="theme-toggle__thumb" />
      </span>
      <span className="sr-only">Switch to {nextTheme} mode</span>
    </button>
  );
}
