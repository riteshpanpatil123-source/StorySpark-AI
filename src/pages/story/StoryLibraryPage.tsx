import React, { useState } from 'react';
import { BookOpen, Search, Filter, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StoryCard } from '@/components/story/StoryCard';
import { Button } from '@/components/common/Button';
import { Story } from '@/types';

export const StoryLibraryPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');

  const mockStories: Story[] = [
    {
      id: 'story_1',
      userId: 'usr_1',
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
      userId: 'usr_1',
      title: 'The Alchemist of Aethelgard',
      slug: 'alchemist-of-aethelgard',
      synopsis: 'In a city built on floating crystal spires, an apprentice alchemist unlocks Forbidden Flame magic.',
      genre: 'Fantasy',
      tags: ['fantasy', 'magic'],
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

  const genres = ['All', 'Sci-Fi', 'Fantasy', 'Mystery', 'Horror'];

  const filteredStories = mockStories.filter((story) => {
    const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || story.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-2">
            My Story Library
            <BookOpen className="w-5 h-5 text-brand-500" />
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage your written chapters, published stories, and uncommitted drafts.
          </p>
        </div>

        <Button
          variant="ai-gradient"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => navigate('/app/story-generator')}
        >
          Create Story
        </Button>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl glass-panel">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search my library..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-white dark:bg-dark-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none text-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedGenre === g
                  ? 'bg-brand-500 text-white'
                  : 'bg-slate-100 dark:bg-dark-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStories.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>
    </div>
  );
};
