import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { StoryCard } from '@/components/story/StoryCard';
import { MockDataService } from '@/services/mockDataService';
import { Story } from '@/types';

export const CommunityPage: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    setStories(MockDataService.getStories());
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-2">
            Community Studio Feed
            <Users className="w-5 h-5 text-brand-500" />
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            See trending stories, published AI chapters, and community creative highlights.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((s) => (
          <StoryCard key={s.id} story={s} />
        ))}
      </div>
    </div>
  );
};
