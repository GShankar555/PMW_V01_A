import React from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface HeaderProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="relative z-20 bg-background/90 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Link
              to="/"
              className="flex items-center space-x-3 focus-ring rounded-xl p-1"
            >
              <img src="/logo1.png" alt="logo" className="w-14" />
              <span className="text-2xl font-bold text-white">
                PlanMyWeekend
              </span>
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={`transition-colors duration-150 font-medium focus-ring rounded-lg px-3 py-1 ${
                isActive("/")
                  ? "text-highlight"
                  : "text-white/80 hover:text-highlight focus:text-highlight"
              }`}
            >
              Home
            </Link>
            <Link
              to="/explore"
              className={`transition-colors duration-150 font-medium focus-ring rounded-lg px-3 py-1 ${
                isActive("/explore")
                  ? "text-highlight"
                  : "text-white/80 hover:text-highlight focus:text-highlight"
              }`}
            >
              Explore
            </Link>
            <Link
              to="/saved"
              className={`transition-colors duration-150 font-medium focus-ring rounded-lg px-3 py-1 ${
                isActive("/saved")
                  ? "text-highlight"
                  : "text-white/80 hover:text-highlight focus:text-highlight"
              }`}
            >
              Saved
            </Link>
            <Link
              to="/planner"
              className={`transition-colors duration-150 font-medium focus-ring rounded-lg px-3 py-1 ${
                isActive("/planner")
                  ? "text-highlight"
                  : "text-white/80 hover:text-highlight focus:text-highlight"
              }`}
            >
              Planner
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link
              to="/explore"
              className="hidden sm:block bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-2xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-220 focus-ring"
            >
              Get Started
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white p-2 rounded-xl hover:bg-white/10 transition-colors duration-150 focus-ring"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            isMobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="py-4 space-y-2">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg font-medium transition-colors duration-150 ${
                isActive("/")
                  ? "text-highlight bg-highlight/10"
                  : "text-white/80 hover:text-highlight hover:bg-white/5"
              }`}
            >
              Home
            </Link>
            <Link
              to="/explore"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg font-medium transition-colors duration-150 ${
                isActive("/explore")
                  ? "text-highlight bg-highlight/10"
                  : "text-white/80 hover:text-highlight hover:bg-white/5"
              }`}
            >
              Explore
            </Link>
            <Link
              to="/saved"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg font-medium transition-colors duration-150 ${
                isActive("/saved")
                  ? "text-highlight bg-highlight/10"
                  : "text-white/80 hover:text-highlight hover:bg-white/5"
              }`}
            >
              Saved
            </Link>
            <Link
              to="/planner"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg font-medium transition-colors duration-150 ${
                isActive("/planner")
                  ? "text-highlight bg-highlight/10"
                  : "text-white/80 hover:text-highlight hover:bg-white/5"
              }`}
            >
              Planner
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
