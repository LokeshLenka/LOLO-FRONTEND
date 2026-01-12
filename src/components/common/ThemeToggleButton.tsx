import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { Moon, Sun } from "lucide-react";

export const ThemeToggleButton: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-[#03a1b0] dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-[#03a1b0] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#03a1b0]/50"
      aria-label="Toggle Theme"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <div className="relative w-6 h-6">
        {/* Sun Icon (Visible in Light Mode) */}
        <Sun 
          className={`absolute inset-0 w-full h-full transition-all duration-500 transform ${
            theme === 'dark' ? 'rotate-90 opacity-0 scale-50' : 'rotate-0 opacity-100 scale-100'
          }`} 
        />
        
        {/* Moon Icon (Visible in Dark Mode) */}
        <Moon 
          className={`absolute inset-0 w-full h-full transition-all duration-500 transform ${
            theme === 'dark' ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-50'
          }`} 
        />
      </div>
    </button>
  );
};
