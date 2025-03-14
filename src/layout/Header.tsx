import { useState } from "react";
import { IconSun, IconMoon } from "@tabler/icons-react";

export default function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Gym Management System
        </h2>

        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            {isDarkMode ? (
              <IconSun className="h-5 w-5" />
            ) : (
              <IconMoon className="h-5 w-5" />
            )}
          </button>

          {/* Profile Menu - Can be expanded later */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Admin
            </span>
            <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>
      </div>
    </header>
  );
}
