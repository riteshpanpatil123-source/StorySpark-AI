import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Laugh,
  User,
  Globe,
  Plus,
  BookOpen,
  Eye,
  Heart,
  FileText,
  Send,
  TrendingUp,
} from 'lucide-react';
import { useAppSelector } from '@/hooks/reduxHooks';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { StoryCard } from '@/components/story/StoryCard';
import { Story } from '@/types';
import { MockDataService } from '@/services/mockDataService';

import { storyApi } from '@/services/api/storyApi';
import { characterApi } from '@/services/api/characterApi';
import { worldApi } from '@/services/api/worldApi';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const [stories, setStories] = useState<Story[]>([]);
  const [characterCount, setCharacterCount] = useState<number>(0);
  const [worldCount, setWorldCount] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'all' | 'published' | 'drafts'>('all');

  useEffect(() => {
    loadDashboardMetrics();
  }, []);

  const loadDashboardMetrics = async () => {
    try {
      const [sRes, cRes, wRes] = await Promise.allSettled([
        storyApi.getStories(),
        characterApi.getCharacters(),
        worldApi.getWorlds(),
      ]);

      if (sRes.status === 'fulfilled' && sRes.value.success && sRes.value.data) {
        setStories(sRes.value.data);
      } else {
        setStories(MockDataService.getStories());
      }

      if (cRes.status === 'fulfilled' && cRes.value.success && cRes.value.data) {
        setCharacterCount(cRes.value.data.length);
      } else {
        setCharacterCount(MockDataService.getCharacters().length);
      }

      if (wRes.status === 'fulfilled' && wRes.value.success && wRes.value.data) {
        setWorldCount(wRes.value.data.length);
      } else {
        setWorldCount(MockDataService.getWorlds().length);
      }
    } catch {
      setStories(MockDataService.getStories());
      setCharacterCount(MockDataService.getCharacters().length);
      setWorldCount(MockDataService.getWorlds().length);
    }
  };

  const publishedCount = stories.filter((s) => s.status === 'published').length;
  const draftCount = stories.filter((s) => s.status === 'draft').length;
  const totalViews = stories.reduce((acc, s) => acc + (s.viewCount || 0), 0);
  const totalLikes = stories.reduce((acc, s) => acc + (s.likeCount || 0), 0);
  const totalWords = stories.reduce((acc, s) => acc + (s.wordCount || 0), 0);

  const displayedStories = stories.filter((s) => {
    if (activeTab === 'published') return s.status === 'published';
    if (activeTab === 'drafts') return s.status === 'draft';
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-brand-600/20 via-ai-spark/10 to-ai-glow/20 border border-brand-500/30 glass-panel shadow-glow-primary">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-2">
            Welcome back, {user?.displayName || user?.username || 'Creator'}!
            <Sparkles className="w-5 h-5 text-ai-spark" />
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Your studio is active with <strong className="text-brand-500">{totalWords.toLocaleString()}</strong> words written across {stories.length} stories. <strong>4,500 / 10,000</strong> tokens remaining.
          </p>
        </div>

        <Button
          variant="ai-gradient"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => navigate('/app/story-generator')}
        >
          New Story Studio
        </Button>
      </div>

      {/* Real-time Studio Statistics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-mono uppercase font-semibold">Total Stories</p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-display">{stories.length}</h3>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-mono uppercase font-semibold">Published</p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-display">{publishedCount}</h3>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-mono uppercase font-semibold">Drafts</p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-display">{draftCount}</h3>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center shrink-0">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-mono uppercase font-semibold">Total Views</p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-display">{totalViews}</h3>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3 col-span-2 sm:col-span-1">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-mono uppercase font-semibold">Total Likes</p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-display">{totalLikes}</h3>
          </div>
        </Card>
      </div>

      {/* Quick Launchers Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider font-mono">
          Quick Launchers
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card
            className="p-4 cursor-pointer hover:border-brand-500/50 transition-all group"
            onClick={() => navigate('/app/story-generator')}
          >
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-display">
              Story Generator
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">Multi-chapter AI plots</p>
          </Card>

          <Card
            className="p-4 cursor-pointer hover:border-amber-500/50 transition-all group"
            onClick={() => navigate('/app/joke-generator')}
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Laugh className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-display">
              Joke Studio
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">Punchlines & humor</p>
          </Card>

          <Card
            className="p-4 cursor-pointer hover:border-purple-500/50 transition-all group"
            onClick={() => navigate('/app/character-builder')}
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <User className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-display">
              Character Vault
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">{characterCount} saved personas</p>
          </Card>

          <Card
            className="p-4 cursor-pointer hover:border-emerald-500/50 transition-all group"
            onClick={() => navigate('/app/world-builder')}
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-display">
              World Lore
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">{worldCount} realm lore sets</p>
          </Card>
        </div>
      </div>

      {/* Main Studio Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-lg font-bold font-display text-slate-900 dark:text-slate-100">
              Studio Workspace
            </h2>
            <div className="flex items-center gap-2">
              <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-dark-800 border border-slate-200 dark:border-slate-700/60 text-xs">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    activeTab === 'all'
                      ? 'bg-white dark:bg-dark-700 text-brand-500 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  All ({stories.length})
                </button>
                <button
                  onClick={() => setActiveTab('published')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    activeTab === 'published'
                      ? 'bg-white dark:bg-dark-700 text-emerald-500 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  Published ({publishedCount})
                </button>
                <button
                  onClick={() => setActiveTab('drafts')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    activeTab === 'drafts'
                      ? 'bg-white dark:bg-dark-700 text-amber-500 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  Drafts ({draftCount})
                </button>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/app/library')}>
                Library
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {displayedStories.length > 0 ? (
              displayedStories.slice(0, 4).map((story) => (
                <StoryCard key={story.id} story={story} />
              ))
            ) : (
              <div className="col-span-2 p-8 text-center border border-dashed border-slate-300 dark:border-slate-700 rounded-xl space-y-2">
                <p className="text-sm text-slate-500 dark:text-slate-400">No stories found in this category.</p>
                <Button variant="outline" size="sm" onClick={() => navigate('/app/story-generator')}>
                  Create One Now
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Widgets Column */}
        <div className="space-y-6">
          <Card className="p-5 space-y-4 glass-panel border-brand-500/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                Token Balance
              </span>
              <Badge variant="cyan" size="sm">45% CONSUMED</Badge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-600 dark:text-slate-300">Monthly Usage</span>
                <span className="text-brand-500 font-bold">4,500 / 10,000</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-dark-700 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-brand-500 to-ai-spark rounded-full w-[45%]" />
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              Tokens reset next billing cycle. Upgrade to Pro Tier for unlimited generation capabilities.
            </p>

            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => navigate('/app/billing')}
            >
              Manage Subscription
            </Button>
          </Card>

          <Card className="p-5 space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-brand-500" />
              <span>Recent Activity Log</span>
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>Generated chapter 1 for <strong>Echoes of Orion</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span>Saved draft for <strong>The Alchemist of Aethelgard</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                <span>Created character persona <strong>Jax Vane</strong></span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};
