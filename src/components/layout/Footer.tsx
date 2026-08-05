import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Github, Twitter, Discord } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white dark:bg-dark-900 border-t border-slate-200 dark:border-slate-800/80 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand Col */}
        <div className="space-y-4 md:col-span-1">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-ai-spark flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg gradient-text">
              StorySpark AI
            </span>
          </Link>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enterprise-grade AI creative studio empowering writers, creators, and teams worldwide.
          </p>
          <div className="flex items-center gap-3 text-slate-400">
            <a href="#" className="hover:text-brand-500 transition-colors"><Twitter className="w-4 h-4" /></a>
            <a href="#" className="hover:text-brand-500 transition-colors"><Github className="w-4 h-4" /></a>
            <a href="#" className="hover:text-brand-500 transition-colors"><Discord className="w-4 h-4" /></a>
          </div>
        </div>

        {/* Links Col 1 */}
        <div>
          <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-3 font-mono">
            Product
          </h4>
          <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
            <li><Link to="/features" className="hover:text-brand-500 transition-colors">Features</Link></li>
            <li><Link to="/pricing" className="hover:text-brand-500 transition-colors">Pricing Tiers</Link></li>
            <li><Link to="/app/story-generator" className="hover:text-brand-500 transition-colors">AI Story Generator</Link></li>
            <li><Link to="/app/joke-generator" className="hover:text-brand-500 transition-colors">AI Joke Studio</Link></li>
          </ul>
        </div>

        {/* Links Col 2 */}
        <div>
          <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-3 font-mono">
            Resources
          </h4>
          <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
            <li><Link to="/about" className="hover:text-brand-500 transition-colors">About Us</Link></li>
            <li><Link to="/faq" className="hover:text-brand-500 transition-colors">FAQ & Support</Link></li>
            <li><Link to="/community" className="hover:text-brand-500 transition-colors">Community Feed</Link></li>
            <li><Link to="/contact" className="hover:text-brand-500 transition-colors">Contact Sales</Link></li>
          </ul>
        </div>

        {/* Legal Col */}
        <div>
          <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-3 font-mono">
            Legal & Trust
          </h4>
          <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
            <li><a href="#" className="hover:text-brand-500 transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-brand-500 transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-brand-500 transition-colors">Security Architecture</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-8 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
        <span>© 2026 StorySpark AI Inc. All rights reserved.</span>
        <span>Built with React 18, Vite, TypeScript & Tailwind CSS.</span>
      </div>
    </footer>
  );
};
