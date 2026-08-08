import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, MessageSquare, Send } from 'lucide-react';
import { MockDataService } from '@/services/mockDataService';
import { Story } from '@/types';
import { Badge } from '@/components/common/Badge';
import { Card } from '@/components/common/Card';
import { Avatar } from '@/components/common/Avatar';
import { Button } from '@/components/common/Button';
import toast from 'react-hot-toast';

import { storyApi } from '@/services/api/storyApi';

export const PublicStoryReaderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [story, setStory] = useState<Story | null>(null);
  const [likeCount, setLikeCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<{ author: string; avatar?: string; text: string; time: string }[]>([
    {
      author: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
      text: 'The pacing in Chapter 1 is incredible! The cyber rain atmospheric descriptions really pulled me in.',
      time: '2 hours ago',
    },
    {
      author: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
      text: 'Can not wait to see what Unit-7 reveals in the next chapter!',
      time: '1 day ago',
    },
  ]);

  useEffect(() => {
    if (id) {
      loadStory(id);
    }
  }, [id]);

  const loadStory = async (storyId: string) => {
    try {
      const res = await storyApi.getStoryById(storyId);
      if (res && res.success && res.data) {
        setStory(res.data);
        setLikeCount(res.data.likeCount || 0);
        return;
      }
    } catch {
      // Fallback
    }

    const found = MockDataService.getStoryById(storyId);
    if (found) {
      setStory(found);
      setLikeCount(found.likeCount || 189);
    } else {
      const defaultStory = MockDataService.getStories()[0];
      setStory(defaultStory);
      setLikeCount(defaultStory.likeCount);
    }
  };

  const handleLike = async () => {
    if (!story) return;
    try {
      const res = await storyApi.likeStory(story.id);
      if (res && res.success && res.data) {
        setHasLiked(res.data.liked);
        setLikeCount(res.data.likeCount);
        toast.success(res.data.liked ? 'Liked story!' : 'Unliked story');
        return;
      }
    } catch {
      // Fallback
    }

    if (hasLiked) {
      setLikeCount((prev) => prev - 1);
      setHasLiked(false);
    } else {
      setLikeCount((prev) => prev + 1);
      setHasLiked(true);
      MockDataService.likeStory(story.id);
      toast.success('Added to your favorite story likes!');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Story link copied to clipboard!');
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setComments([
      {
        author: 'Alex Rivers',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        text: commentText.trim(),
        time: 'Just now',
      },
      ...comments,
    ]);
    setCommentText('');
    toast.success('Comment published!');
  };

  if (!story) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/stories')}
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-brand-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Story Discovery</span>
        </button>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleShare} leftIcon={<Share2 className="w-3.5 h-3.5" />}>
            Share
          </Button>
          <Button
            variant={hasLiked ? 'ai-gradient' : 'outline'}
            size="sm"
            onClick={handleLike}
            leftIcon={<Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-white' : 'text-rose-500'}`} />}
          >
            {likeCount} Likes
          </Button>
        </div>
      </div>

      {/* Story Hero Info */}
      <Card className="p-8 glass-panel border-brand-500/20 shadow-glow-primary space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="cyan" size="sm">{story.genre}</Badge>
              <Badge variant="amber" size="sm">{story.wordCount} WORDS</Badge>
            </div>
            <h1 className="text-3xl font-bold font-display text-slate-900 dark:text-slate-100">
              {story.title}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
              "{story.synopsis}"
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Avatar name={story.authorName || 'Alex Rivers'} src={story.authorAvatar} size="lg" />
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{story.authorName || 'Alex Rivers'}</p>
              <p className="text-[10px] text-slate-400">Published Author</p>
            </div>
          </div>
        </div>

        {/* Cover Graphic */}
        {story.coverImageUrl && (
          <div className="h-64 sm:h-80 w-full rounded-xl overflow-hidden">
            <img src={story.coverImageUrl} alt={story.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Chapter Prose Reader */}
        <div className="prose dark:prose-invert max-w-none font-serif text-base leading-relaxed text-slate-900 dark:text-slate-100 space-y-4 pt-4">
          <p>
            The terminal blinks in rhythmic neon cyan. Jax wipes rain and sweat from his goggles as the hex-code decrypts on screen.
          </p>
          <p>
            "This isn't corporate data," Jax mutters into his headset microphone. "It's an interstellar broadcast stream dated 2,400 years ago."
          </p>
          <p>
            Suddenly, the power grid across Sector 7 drops to zero. In the blacked-out room, Jax's cybernetic arm warms up on its own, typing coordinates he has never seen before...
          </p>
          <p>
            Unit-7's voice echoes softly through the headset speakers: "Jax, do not execute the binary sequence. It is not an archive—it is an activation key."
          </p>
        </div>
      </Card>

      {/* Reader Comments Section */}
      <Card className="p-6 space-y-6">
        <h3 className="text-base font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-brand-500" />
          <span>Reader Discussion ({comments.length})</span>
        </h3>

        <form onSubmit={handleAddComment} className="flex gap-3">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write your thoughts or feedback on this story..."
            className="flex-1 rounded-xl bg-white dark:bg-dark-800 border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs focus:outline-none text-slate-900 dark:text-slate-100"
          />
          <Button type="submit" variant="ai-gradient" size="sm" rightIcon={<Send className="w-3.5 h-3.5" />}>
            Comment
          </Button>
        </form>

        <div className="space-y-4 pt-2">
          {comments.map((c, idx) => (
            <div key={idx} className="flex gap-3 p-3 rounded-xl bg-slate-50 dark:bg-dark-800/60 border border-slate-100 dark:border-slate-800">
              <Avatar name={c.author} src={c.avatar} size="md" />
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">{c.author}</span>
                  <span className="text-[10px] text-slate-400">{c.time}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
