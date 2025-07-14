import * as React from "react"

const ThemeContext = React.createContext({
  theme: "light",
  setTheme: () => null,
})

function ThemeProvider({ children, defaultTheme = "light", storageKey = "vite-ui-theme" }) {
  // Initialize with default theme to prevent blank screen
  const [theme, setTheme] = React.useState(defaultTheme);
  
  // Only try to load from localStorage after component mounts
  React.useEffect(() => {
    try {
      const storedTheme = localStorage.getItem(storageKey);
      if (storedTheme) {
        setTheme(storedTheme);
      } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setTheme("dark");
      }
    } catch (error) {
      console.error("Failed to get theme from localStorage:", error);
    }
  }, [storageKey]);

  React.useEffect(() => {
    try {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(theme);
      
      // Ensure body has background color set
      document.body.style.backgroundColor = theme === "dark" 
        ? "hsl(222.2 84% 4.9%)" 
        : "hsl(0 0% 100%)";
      document.body.style.color = theme === "dark"
        ? "hsl(210 40% 98%)" 
        : "hsl(222.2 84% 4.9%)";
    } catch (error) {
      console.error("Failed to update theme:", error);
    }
  }, [theme]);

  const value = React.useMemo(
    () => ({
      theme,
      setTheme: (newTheme) => {
        try {
          localStorage.setItem(storageKey, newTheme);
          setTheme(newTheme);
        } catch (error) {
          console.error("Failed to set theme:", error);
        }
      },
    }),
    [theme, storageKey]
  )

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

function useTheme() {
  const context = React.useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

function ThemeToggle({ className }) {
  const { theme, setTheme } = useTheme()

  return (
    <button
      className={className}
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  )
}

export { ThemeProvider, ThemeToggle, useTheme } 