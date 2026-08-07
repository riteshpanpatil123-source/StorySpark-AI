import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, Heart } from 'lucide-react';
import { MockDataService } from '@/services/mockDataService';
import { Story } from '@/types';
import { Badge } from '@/components/common/Badge';
import { Card } from '@/components/common/Card';
import { Avatar } from '@/components/common/Avatar';

export const PublicStoriesPage: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');

  useEffect(() => {
    const allStories = MockDataService.getStories();
    // Filter only public / published stories
    setStories(allStories.filter((s) => s.isPublic || s.status === 'published'));
  }, []);

  const genres = ['All', 'Sci-Fi', 'Fantasy', 'Mystery', 'Horror', 'Romance'];

  const filtered = stories.filter((story) => {
    const matchesSearch =
      story.title.toLowerCase().includes(search.toLowerCase()) ||
      story.synopsis.toLowerCase().includes(search.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || story.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="brand" size="md">STORYSPARK DISCOVERY</Badge>
        <h1 className="text-4xl font-bold font-display text-slate-900 dark:text-slate-100 tracking-tight">
          Explore AI-Crafted Stories
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Immerse yourself in infinite worlds created by writers, storytellers, and AI creative pilots worldwide.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl glass-panel space-y-4 max-w-4xl mx-auto border border-brand-500/20">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search published stories, authors, or genres..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-dark-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
            {genres.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  selectedGenre === g
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((story) => (
          <Card key={story.id} className="p-0 overflow-hidden group hover:border-brand-500/50 transition-all flex flex-col">
            <div className="relative h-48 bg-slate-200 dark:bg-dark-700 overflow-hidden">
              <img
                src={story.coverImageUrl || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80'}
                alt={story.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 right-3">
                <Badge variant="cyan" size="sm">{story.genre}</Badge>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <Link to={`/stories/${story.id}`}>
                  <h3 className="text-lg font-bold font-display text-slate-900 dark:text-slate-100 group-hover:text-brand-500 transition-colors line-clamp-1">
                    {story.title}
                  </h3>
                </Link>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {story.synopsis}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Avatar name={story.authorName || 'Author'} src={story.authorAvatar} size="sm" />
                  <span className="font-medium text-slate-600 dark:text-slate-300">{story.authorName || 'Alex Rivers'}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {story.viewCount}</span>
                  <span className="flex items-center gap-1 text-rose-500"><Heart className="w-3.5 h-3.5 fill-rose-500/20" /> {story.likeCount}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
