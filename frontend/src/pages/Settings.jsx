import React from 'react'
import { useTheme } from '../contexts/ThemeContext'

export default function Settings() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Settings</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">Appearance</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium dark:text-gray-200">Dark Mode</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Adjust the appearance of the application
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm font-medium dark:text-white cursor-pointer"
          >
            {theme === "dark" ? "Switch to Light" : "Switch to Dark"}
          </button>
        </div>
      </div>
    </div>
  )
}
