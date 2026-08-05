import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Laugh, User, Globe, Wand2, BookOpen, Zap, Plus, ArrowRight, TrendingUp } from 'lucide-react';
import { useAppSelector } from '@/hooks/reduxHooks';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { StoryCard } from '@/components/story/StoryCard';
import { Story } from '@/types';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  // Mock data for recent stories
  const mockStories: Story[] = [
    {
      id: 'story_1',
      userId: user?.id || 'usr_1',
      title: 'Echoes of Orion',
      slug: 'echoes-of-orion',
      synopsis: 'A rogue AI pilot discovers an ancient signal at the edge of the galaxy.',
      genre: 'Sci-Fi',
      tags: ['sci-fi', 'space', 'ai'],
      status: 'published',
      isPublic: true,
      viewCount: 1420,
      likeCount: 189,
      commentCount: 24,
      ratingAverage: 4.8,
      ratingCount: 32,
      wordCount: 4200,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'story_2',
      userId: user?.id || 'usr_1',
      title: 'The Alchemist of Aethelgard',
      slug: 'alchemist-of-aethelgard',
      synopsis: 'In a city built on floating crystal spires, an apprentice alchemist unlocks Forbidden Flame magic.',
      genre: 'Fantasy',
      tags: ['fantasy', 'magic', 'adventure'],
      status: 'draft',
      isPublic: false,
      viewCount: 350,
      likeCount: 42,
      commentCount: 5,
      ratingAverage: 4.6,
      ratingCount: 10,
      wordCount: 2800,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-brand-600/20 via-ai-spark/10 to-ai-glow/20 border border-brand-500/30 glass-panel shadow-glow-primary">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-2">
            Welcome back, {user?.displayName || user?.username || 'Creator'}!
            <Sparkles className="w-5 h-5 text-ai-spark" />
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Your creative studio is active. You have <strong className="text-brand-500">4,500 / 10,000</strong> AI tokens remaining this billing cycle.
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
            <p className="text-[11px] text-slate-400 mt-1">Multi-chapter plots</p>
          </Card>

          <Card
            className="p-4 cursor-pointer hover:border-ai-amber/50 transition-all group"
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
            className="p-4 cursor-pointer hover:border-ai-spark/50 transition-all group"
            onClick={() => navigate('/app/character-builder')}
          >
            <div className="w-10 h-10 rounded-xl bg-ai-spark/10 text-ai-spark flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <User className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-display">
              Character Vault
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">Personas & traits</p>
          </Card>

          <Card
            className="p-4 cursor-pointer hover:border-emerald-500/50 transition-all group"
            onClick={() => navigate('/app/world-builder')}
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-display">
              World Builder
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">Lore & rulesets</p>
          </Card>
        </div>
      </div>

      {/* Recent Stories & Token Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-display text-slate-900 dark:text-slate-100">
              Recent Studio Drafts
            </h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/app/library')}>
              View All Library
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mockStories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        </div>

        {/* Sidebar Widget Column */}
        <div className="space-y-6">
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                Token Consumption
              </span>
              <Badge variant="cyan" size="sm">45% USED</Badge>
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
              Tokens reset on <strong>Aug 28, 2026</strong>. Upgrade to Pro for unlimited generation capabilities.
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
        </div>
      </div>
    </div>
  );
};
