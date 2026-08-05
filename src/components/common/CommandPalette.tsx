import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, BookOpen, Laugh, User, Globe, Wand2, Settings } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { setCommandPaletteOpen } from '@/store/slices/uiSlice';

export const CommandPalette: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.isCommandPaletteOpen);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        dispatch(setCommandPaletteOpen(!isOpen));
      }
      if (e.key === 'Escape' && isOpen) {
        dispatch(setCommandPaletteOpen(false));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, isOpen]);

  const commands = [
    { title: 'Create Story', icon: <Sparkles className="w-4 h-4 text-brand-500" />, path: '/app/story-generator' },
    { title: 'Craft Joke', icon: <Laugh className="w-4 h-4 text-ai-amber" />, path: '/app/joke-generator' },
    { title: 'Create Character', icon: <User className="w-4 h-4 text-ai-spark" />, path: '/app/character-builder' },
    { title: 'World Lore Builder', icon: <Globe className="w-4 h-4 text-emerald-500" />, path: '/app/world-builder' },
    { title: 'AI Writing Coach', icon: <Wand2 className="w-4 h-4 text-purple-500" />, path: '/app/writing-coach' },
    { title: 'My Story Library', icon: <BookOpen className="w-4 h-4 text-blue-500" />, path: '/app/library' },
    { title: 'Settings', icon: <Settings className="w-4 h-4 text-slate-400" />, path: '/app/settings' },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path: string) => {
    dispatch(setCommandPaletteOpen(false));
    navigate(path);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(setCommandPaletteOpen(false))}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-xl bg-white dark:bg-dark-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-10"
          >
            <div className="flex items-center px-4 border-b border-slate-200 dark:border-slate-700/80">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or search..."
                className="w-full py-4 px-3 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none text-sm"
                autoFocus
              />
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-slate-100 dark:bg-dark-700 text-slate-400">
                ESC
              </span>
            </div>

            <div className="p-2 max-h-80 overflow-y-auto">
              {filteredCommands.length > 0 ? (
                filteredCommands.map((cmd, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(cmd.path)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-700 text-slate-800 dark:text-slate-200 text-sm transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {cmd.icon}
                      <span>{cmd.title}</span>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">Jump to</span>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-slate-400">No matching commands</div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
