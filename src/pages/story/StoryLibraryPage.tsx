import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Search,
  Filter,
  Plus,
  LayoutGrid,
  List,
  Trash2,
  Copy,
  Edit,
  Send,
  Eye,
  Heart,
} from 'lucide-react';
import { StoryCard } from '@/components/story/StoryCard';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Card } from '@/components/common/Card';
import { MockDataService } from '@/services/mockDataService';
import { Story } from '@/types';
import toast from 'react-hot-toast';

import { storyApi } from '@/services/api/storyApi';

export const StoryLibraryPage: React.FC = () => {
  const navigate = useNavigate();
  const [stories, setStories] = useState<Story[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'words'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      const res = await storyApi.getStories();
      if (res && res.success && res.data) {
        setStories(res.data);
      } else {
        setStories(MockDataService.getStories());
      }
    } catch {
      setStories(MockDataService.getStories());
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await storyApi.deleteStory(id);
      } catch {
        MockDataService.deleteStory(id);
      }
      loadStories();
      toast.success('Story removed from library');
    }
  };

  const handleDuplicate = (id: string) => {
    const duplicated = MockDataService.duplicateStory(id);
    if (duplicated) {
      loadStories();
      toast.success(`Duplicated story as "${duplicated.title}"`);
    }
  };

  const handleTogglePublish = async (story: Story) => {
    const newStatus = story.status === 'published' ? 'draft' : 'published';
    try {
      if (newStatus === 'published') {
        await storyApi.publishStory(story.id);
      } else {
        await storyApi.updateStory(story.id, { status: 'draft', isPublic: false });
      }
    } catch {
      MockDataService.saveStory({
        ...story,
        status: newStatus,
        isPublic: newStatus === 'published',
      });
    }
    loadStories();
    toast.success(`Story status changed to ${newStatus}`);
  };

  const genres = ['All', 'Sci-Fi', 'Fantasy', 'Mystery', 'Horror', 'Romance', 'Thriller'];

  const filteredStories = stories
    .filter((story) => {
      const matchesSearch =
        story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.synopsis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesGenre = selectedGenre === 'All' || story.genre === selectedGenre;
      const matchesStatus = statusFilter === 'all' || story.status === statusFilter;
      return matchesSearch && matchesGenre && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') return (b.viewCount || 0) - (a.viewCount || 0);
      if (sortBy === 'words') return (b.wordCount || 0) - (a.wordCount || 0);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-2">
            My Story Library
            <BookOpen className="w-5 h-5 text-brand-500" />
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage your AI written chapters, published works, and draft storyboards.
          </p>
        </div>

        <Button
          variant="ai-gradient"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => navigate('/app/story-generator')}
        >
          Create New Story
        </Button>
      </div>

      {/* Filter Controls Bar */}
      <div className="p-4 rounded-xl glass-panel space-y-3">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, synopsis, or tag..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-white dark:bg-dark-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none text-slate-900 dark:text-slate-100"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto">
            <div className="flex p-1 rounded-lg bg-slate-100 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 text-xs">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                  statusFilter === 'all'
                    ? 'bg-white dark:bg-dark-700 text-brand-500 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                All ({stories.length})
              </button>
              <button
                onClick={() => setStatusFilter('published')}
                className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                  statusFilter === 'published'
                    ? 'bg-white dark:bg-dark-700 text-emerald-500 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                Published
              </button>
              <button
                onClick={() => setStatusFilter('draft')}
                className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                  statusFilter === 'draft'
                    ? 'bg-white dark:bg-dark-700 text-amber-500 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                Drafts
              </button>
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-1.5 px-3 rounded-lg bg-white dark:bg-dark-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="newest">Sort: Newest</option>
              <option value="popular">Sort: Most Viewed</option>
              <option value="words">Sort: Word Count</option>
            </select>

            {/* Grid / List View Toggle */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-dark-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-dark-700 text-brand-500' : 'text-slate-400'}`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white dark:bg-dark-700 text-brand-500' : 'text-slate-400'}`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Genre Pill Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                selectedGenre === g
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-dark-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Stories Display Grid or List */}
      {filteredStories.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStories.map((story) => (
              <div key={story.id} className="relative group/wrapper flex flex-col">
                <StoryCard story={story} />
                <div className="mt-2 flex items-center justify-between gap-1 p-2 rounded-xl bg-slate-100/80 dark:bg-dark-800/80 border border-slate-200 dark:border-slate-700 text-xs">
                  <button
                    onClick={() => navigate(`/app/editor/${story.id}`)}
                    className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-brand-500"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleTogglePublish(story)}
                    className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-emerald-500"
                  >
                    <Send className="w-3.5 h-3.5" /> {story.status === 'published' ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    onClick={() => handleDuplicate(story.id)}
                    className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-amber-500"
                  >
                    <Copy className="w-3.5 h-3.5" /> Duplicate
                  </button>
                  <button
                    onClick={() => handleDelete(story.id, story.title)}
                    className="p-1 text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredStories.map((story) => (
              <Card key={story.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3
                      onClick={() => navigate(`/app/editor/${story.id}`)}
                      className="text-base font-bold font-display text-slate-900 dark:text-slate-100 hover:text-brand-500 cursor-pointer"
                    >
                      {story.title}
                    </h3>
                    <Badge variant={story.status === 'published' ? 'emerald' : 'amber'} size="sm">
                      {story.status}
                    </Badge>
                    <Badge variant="cyan" size="sm">{story.genre}</Badge>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{story.synopsis}</p>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400 shrink-0">
                  <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {story.viewCount}</span>
                  <span className="flex items-center gap-1 text-rose-500"><Heart className="w-3.5 h-3.5" /> {story.likeCount}</span>
                  <span>{story.wordCount} words</span>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/app/editor/${story.id}`)}>
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(story.id, story.title)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )
      ) : (
        <Card className="p-12 text-center space-y-4 glass-panel">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">No Stories Found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Your story library is empty or no stories match the applied search and filter parameters.
          </p>
          <Button variant="ai-gradient" onClick={() => navigate('/app/story-generator')}>
            Create Your First Story
          </Button>
        </Card>
      )}
    </div>
  );
};
