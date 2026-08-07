import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Sun, Moon, Search, Bell, LogOut, Shield } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { toggleTheme } from '@/store/slices/themeSlice';
import { toggleSidebar, toggleCommandPalette } from '@/store/slices/uiSlice';
import { logout } from '@/store/slices/authSlice';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';

export const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const theme = useAppSelector((state) => state.theme.mode);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 dark:border-slate-800/80">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        {/* Brand Logo & Sidebar Trigger */}
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-dark-700 transition-colors"
            >
              <Sparkles className="w-5 h-5 text-brand-500" />
            </button>
          )}

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-ai-spark flex items-center justify-center shadow-glow-primary group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg leading-none tracking-tight gradient-text">
                StorySpark AI
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                Creative Studio
              </span>
            </div>
          </Link>
        </div>

        {/* Search Command Trigger */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <button
            onClick={() => dispatch(toggleCommandPalette())}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-dark-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-400 text-xs hover:border-brand-500/40 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              <span>Search stories, characters, or prompts...</span>
            </div>
            <div className="flex items-center gap-1 font-mono text-[10px] bg-slate-200 dark:bg-dark-700 px-1.5 py-0.5 rounded">
              <span>⌘K</span>
            </div>
          </button>
        </div>

        {/* User Quick Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => dispatch(toggleTheme())}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-dark-700 transition-colors"
            title="Toggle Light/Dark Theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>

          {isAuthenticated ? (
            <>
              <button
                onClick={() => navigate('/app/notifications')}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-dark-700 transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-ai-spark" />
              </button>

              <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />

              <div className="flex items-center gap-3">
                <Link to="/app/profile" className="flex items-center gap-2 group">
                  <Avatar name={user?.displayName || user?.username} src={user?.avatarUrl} size="md" />
                  <div className="hidden lg:flex flex-col text-left">
                    <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-brand-500 transition-colors">
                      {user?.displayName || user?.username}
                    </span>
                    <Badge variant={user?.tier === 'pro' ? 'amber' : 'brand'} size="sm">
                      {user?.tier?.toUpperCase() || 'FREE'}
                    </Badge>
                  </div>
                </Link>

                {user?.role === 'admin' && (
                  <button
                    onClick={() => navigate('/admin')}
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-dark-700 transition-colors"
                    title="Admin Panel"
                  >
                    <Shield className="w-5 h-5" />
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-brand-500 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium rounded-xl bg-brand-600 hover:bg-brand-500 text-white shadow-glow-primary transition-all active:scale-[0.98]"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
