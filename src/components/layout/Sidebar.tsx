import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Sparkles,
  Laugh,
  User,
  Globe,
  Wand2,
  BookOpen,
  Users,
  History,
  Heart,
  Settings,
  CreditCard,
  Zap,
} from 'lucide-react';
import { useAppSelector } from '@/hooks/reduxHooks';
import { Badge } from '../common/Badge';

export const Sidebar: React.FC = () => {
  const isSidebarOpen = useAppSelector((state) => state.ui.isSidebarOpen);
  const user = useAppSelector((state) => state.auth.user);

  const mainNav = [
    { title: 'Dashboard', icon: LayoutDashboard, path: '/app/dashboard' },
    { title: 'Story Studio', icon: Sparkles, path: '/app/story-generator' },
    { title: 'Joke Studio', icon: Laugh, path: '/app/joke-generator' },
    { title: 'Character Vault', icon: User, path: '/app/character-builder' },
    { title: 'World Lore', icon: Globe, path: '/app/world-builder' },
    { title: 'AI Writing Coach', icon: Wand2, path: '/app/writing-coach' },
    { title: 'My Library', icon: BookOpen, path: '/app/library' },
    { title: 'Community Feed', icon: Users, path: '/community' },
  ];

  const secondaryNav = [
    { title: 'Generation History', icon: History, path: '/app/history' },
    { title: 'Favorites', icon: Heart, path: '/app/favorites' },
    { title: 'Settings', icon: Settings, path: '/app/settings' },
    { title: 'Billing & Plan', icon: CreditCard, path: '/app/billing' },
  ];

  return (
    <AnimatePresence mode="wait">
      {isSidebarOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 260, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="hidden md:flex flex-col h-[calc(100vh-4rem)] sticky top-16 bg-white/70 dark:bg-dark-800/60 backdrop-blur-xl border-r border-slate-200/80 dark:border-slate-800/80 shrink-0 z-30 overflow-hidden"
        >
          <div className="flex flex-col flex-1 p-4 overflow-y-auto space-y-6">
            {/* Quick Action Button */}
            <NavLink
              to="/app/story-generator"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl gradient-btn font-semibold text-sm shadow-glow-primary hover:scale-[1.02] transition-transform"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>Create New Story</span>
            </NavLink>

            {/* Core Studio Nav */}
            <div className="space-y-1">
              <p className="px-3 text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 font-mono">
                Studio Modules
              </p>
              {mainNav.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold border border-brand-500/20'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-dark-700/60'
                    }`
                  }
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span>{item.title}</span>
                </NavLink>
              ))}
            </div>

            {/* Account & Library Nav */}
            <div className="space-y-1 pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
              <p className="px-3 text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 font-mono">
                Workspace
              </p>
              {secondaryNav.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold border border-brand-500/20'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-dark-700/60'
                    }`
                  }
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span>{item.title}</span>
                </NavLink>
              ))}
            </div>

            {/* Pro Upgrade Widget Banner */}
            <div className="mt-auto p-4 rounded-xl bg-gradient-to-br from-brand-600/10 via-ai-spark/10 to-ai-glow/10 border border-brand-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="amber" size="sm">PRO PLAN</Badge>
                <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Unlock unlimited AI tokens, DALL-E image gen & audio narration.
              </p>
              <NavLink
                to="/app/billing"
                className="block text-center py-2 px-3 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-sm transition-all"
              >
                Upgrade Plan
              </NavLink>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
