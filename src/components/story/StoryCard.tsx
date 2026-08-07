import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, BookOpen } from 'lucide-react';
import { Story } from '@/types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Avatar } from '../common/Avatar';

export interface StoryCardProps {
  story: Story;
}

export const StoryCard: React.FC<StoryCardProps> = ({ story }) => {
  return (
    <Card className="flex flex-col h-full group p-0 overflow-hidden">
      {/* Cover Image */}
      <div className="relative h-44 w-full bg-slate-200 dark:bg-dark-700 overflow-hidden">
        {story.coverImageUrl ? (
          <img
            src={story.coverImageUrl}
            alt={story.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-600/40 via-ai-spark/30 to-ai-glow/40 flex items-center justify-center p-4">
            <BookOpen className="w-10 h-10 text-white/50" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge variant="cyan" size="sm">{story.genre}</Badge>
        </div>
      </div>

      {/* Content Body */}
      <div className="flex flex-col flex-1 p-5 space-y-3">
        <Link to={`/app/editor/${story.id}`}>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 font-display group-hover:text-brand-500 transition-colors line-clamp-1">
            {story.title}
          </h3>
        </Link>
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {story.synopsis}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {story.tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-dark-700 text-slate-500 dark:text-slate-400 font-mono">
              #{tag}
            </span>
          ))}
        </div>

        {/* Footer Meta */}
        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Avatar name={story.authorName || 'Author'} src={story.authorAvatar} size="sm" />
            <span className="truncate max-w-[100px] text-slate-600 dark:text-slate-300 font-medium">
              {story.authorName || 'Anonymous'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>{story.viewCount}</span>
            </span>
            <span className="flex items-center gap-1 text-rose-500">
              <Heart className="w-3.5 h-3.5 fill-rose-500/20" />
              <span>{story.likeCount}</span>
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
