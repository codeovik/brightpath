import React from 'react'
import { Link } from 'react-router-dom'
import logoLight from '../assets/light-logo.png'
import logoDark from '../assets/dark-logo.png'

import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const { user, signout } = useAuth();

  return (
    <nav className="sticky top-0 z-40 w-full border-b-3 border-level-2 bg-background/75 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center active:scale-95 transition-all">
          <img
            src={logoLight}
            alt="Logo"
            className="h-8 w-auto dark:hidden"
          />
          <img
            src={logoDark}
            alt="Logo"
            className="hidden h-8 w-auto dark:block"
          />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {['Home', 'Courses', 'Students', 'Teachers'].map((item) => (
            <Link
              key={item}
              to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
              className="text-sm font-medium text-gray-700 transition-colors hover:text-black dark:text-gray-300 dark:hover:text-white"
            >
              {item}
            </Link>
          ))}
        </div>

        {user ? (
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="active:scale-95 transition-all">
              <img src={user.profilePicture} alt={user.name} className="h-9 w-9 rounded-full" />
            </Link>
            <button
              onClick={signout}
              className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <Link
            to="/signin"
            className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  )
}
