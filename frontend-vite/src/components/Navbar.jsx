import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, LogOut, Settings, Home, Upload } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { useToast } from '../context/ToastContext';

const Navbar = ({ onMenuToggle }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { addToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    addToast('Logged out successfully', 'success');
    navigate('/login');
    setShowDropdown(false);
  };

  return (
    <nav className="bg-card border-b border-muted sticky top-0 z-40">
      <div className="px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-accent hover:text-accent-foreground transition">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <span className="text-card font-bold">V</span>
          </div>
          <span className="hidden sm:inline">VideoHub</span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 mx-4 max-w-md hidden sm:flex">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-secondary text-foreground placeholder-muted-foreground rounded-full py-2 px-4 pl-4 focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-accent transition"
            >
              <Search size={18} />
            </button>
          </div>
        </form>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                to="/upload"
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-full hover:bg-accent/90 transition font-medium"
              >
                <Upload size={18} />
                Upload
              </Link>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 px-3 py-1 rounded-full hover:bg-secondary transition"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-sm">
                      {user.username?.[0]?.toUpperCase()}
                    </div>
                  )}
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-lg border border-muted z-50">
                    <div className="p-3 border-b border-muted">
                      <p className="font-semibold text-foreground">{user.username}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>

                    <Link
                      to={`/channel/${user._id}`}
                      onClick={() => setShowDropdown(false)}
                      className="block px-4 py-2 hover:bg-secondary transition text-foreground flex items-center gap-2"
                    >
                      <Home size={16} />
                      My Channel
                    </Link>

                    <Link
                      to="/dashboard"
                      onClick={() => setShowDropdown(false)}
                      className="block px-4 py-2 hover:bg-secondary transition text-foreground flex items-center gap-2"
                    >
                      <Settings size={16} />
                      Dashboard
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-secondary transition text-destructive flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-accent text-accent-foreground rounded-full hover:bg-accent/90 transition font-medium"
            >
              Sign In
            </Link>
          )}

          <button
            onClick={onMenuToggle}
            className="sm:hidden p-2 hover:bg-secondary rounded-lg transition"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
