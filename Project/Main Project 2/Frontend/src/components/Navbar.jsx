import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = ({ isLoggedIn, setIsLoggedIn, isAdmin }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('Logging out user');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-rose-600 to-rose-400 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0"
          >
            <Link to="/" className="flex items-center">
              <span className="text-white text-2xl font-bold tracking-tight">
                <span className="text-3xl">B</span>ichola
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link
                to="/"
                className="text-white hover:bg-rose-500/20 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300"
              >
                Home
              </Link>
              {isLoggedIn && (
                <>
                  <Link
                    to="/matches"
                    className="text-white hover:bg-rose-500/20 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300"
                  >
                    Matches
                  </Link>
                  <Link
                    to="/profile"
                    className="text-white hover:bg-rose-500/20 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/reviews"
                    className="text-white hover:bg-rose-500/20 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300"
                  >
                    Reviews
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="text-white hover:bg-rose-500/20 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300"
                    >
                      Admin Panel
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:block">
            {isLoggedIn ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="relative group"
              >
                <div className="absolute inset-0 bg-white/20 rounded-lg blur group-hover:bg-white/30 transition-all duration-300"></div>
                <div className="relative px-6 py-2 bg-white text-rose-600 rounded-lg font-medium hover:bg-rose-50 transition-all duration-300 flex items-center space-x-2">
                  <span>Logout</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </div>
              </motion.button>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center space-x-4"
              >
                <Link
                  to="/login"
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-white/20 rounded-lg blur group-hover:bg-white/30 transition-all duration-300"></div>
                  <div className="relative px-6 py-2 bg-white text-rose-600 rounded-lg font-medium hover:bg-rose-50 transition-all duration-300 flex items-center space-x-2">
                    <span>Login</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      />
                    </svg>
                  </div>
                </Link>
                <Link
                  to="/signup"
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-white/20 rounded-lg blur group-hover:bg-white/30 transition-all duration-300"></div>
                  <div className="relative px-6 py-2 bg-white text-rose-600 rounded-lg font-medium hover:bg-rose-50 transition-all duration-300 flex items-center space-x-2">
                    <span>Register</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                      />
                    </svg>
                  </div>
                </Link>
              </motion.div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:bg-rose-500/20 p-2 rounded-md focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={{ height: isMenuOpen ? 'auto' : 0 }}
        className="md:hidden overflow-hidden"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            to="/"
            className="text-white hover:bg-rose-500/20 block px-3 py-2 rounded-md text-base font-medium"
          >
            Home
          </Link>
          {isLoggedIn && (
            <>
              <Link
                to="/matches"
                className="text-white hover:bg-rose-500/20 block px-3 py-2 rounded-md text-base font-medium"
              >
                Matches
              </Link>
              <Link
                to="/profile"
                className="text-white hover:bg-rose-500/20 block px-3 py-2 rounded-md text-base font-medium"
              >
                Profile
              </Link>
              <Link
                to="/reviews"
                className="text-white hover:bg-rose-500/20 block px-3 py-2 rounded-md text-base font-medium"
              >
                Reviews
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-white hover:bg-rose-500/20 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Admin Panel
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-white hover:bg-rose-500/20 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
              >
                Logout
              </button>
            </>
          )}
          {!isLoggedIn && (
            <>
              <Link
                to="/login"
                className="text-white hover:bg-rose-500/20 block px-3 py-2 rounded-md text-base font-medium"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-white hover:bg-rose-500/20 block px-3 py-2 rounded-md text-base font-medium"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar;