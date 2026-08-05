import React, { useState } from 'react';
import { Laugh, Star, Copy, Check } from 'lucide-react';
import { Joke } from '@/types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import toast from 'react-hot-toast';

export interface JokeCardProps {
  joke: Joke;
}

export const JokeCard: React.FC<JokeCardProps> = ({ joke }) => {
  const [showPunchline, setShowPunchline] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${joke.setup}\n${joke.punchline}`);
    setCopied(true);
    toast.success('Joke copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="flex flex-col justify-between space-y-4">
      <div className="flex items-center justify-between">
        <Badge variant="amber" size="sm">
          <Laugh className="w-3 h-3 mr-1 inline" />
          {joke.category}
        </Badge>
        <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span>{joke.ratingAverage.toFixed(1)}</span>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 font-display">
          "{joke.setup}"
        </p>

        {showPunchline ? (
          <p className="text-sm font-medium text-brand-600 dark:text-ai-spark italic bg-brand-500/5 dark:bg-dark-700/50 p-3 rounded-lg border border-brand-500/20">
            {joke.punchline}
          </p>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPunchline(true)}
            className="w-full text-xs"
          >
            Reveal Punchline
          </Button>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
        <span className="text-[10px] text-slate-400 font-mono">
          {new Date(joke.createdAt).toLocaleDateString()}
        </span>
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-lg text-slate-400 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-dark-700 transition-colors"
          title="Copy Joke"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    </Card>
  );
};
