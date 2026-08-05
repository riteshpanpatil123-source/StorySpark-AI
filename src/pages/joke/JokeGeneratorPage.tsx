import React, { useState } from 'react';
import { Laugh, Sparkles, Plus } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { JokeCard } from '@/components/story/JokeCard';
import { Joke } from '@/types';
import toast from 'react-hot-toast';

export const JokeGeneratorPage: React.FC = () => {
  const [topic, setTopic] = useState('Software Engineering');
  const [style, setStyle] = useState('Dad Joke');
  const [isGenerating, setIsGenerating] = useState(false);
  const [jokes, setJokes] = useState<Joke[]>([
    {
      id: 'jk_1',
      userId: 'usr_1',
      setup: 'Why do programmers prefer dark mode?',
      punchline: 'Because light attracts bugs!',
      category: 'Programmer Humour',
      ratingAverage: 4.9,
      ratingCount: 142,
      isPublic: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'jk_2',
      userId: 'usr_1',
      setup: 'There are 10 types of people in the world...',
      punchline: 'Those who understand binary, and those who do not.',
      category: 'Tech Jokes',
      ratingAverage: 4.7,
      ratingCount: 88,
      isPublic: true,
      createdAt: new Date().toISOString(),
    },
  ]);

  const handleGenerateJoke = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newJoke: Joke = {
        id: 'jk_' + Date.now(),
        userId: 'usr_1',
        setup: `Why did the AI go to creative writing school?`,
        punchline: `To learn how to process human emotions without throwing a 500 server error!`,
        category: style,
        ratingAverage: 5.0,
        ratingCount: 1,
        isPublic: true,
        createdAt: new Date().toISOString(),
      };
      setJokes([newJoke, ...jokes]);
      setIsGenerating(false);
      toast.success('New AI joke generated!');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-2">
            AI Joke Studio
            <Laugh className="w-5 h-5 text-amber-500" />
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Craft stand-up routines, punchlines, and humorous anecdotes powered by AI.
          </p>
        </div>
      </div>

      {/* Generator Control Card */}
      <Card className="p-6 glass-panel border-amber-500/20 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
              Joke Topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Artificial Intelligence, Coffee, Marriage..."
              className="w-full rounded-lg text-xs bg-white dark:bg-dark-800 border border-slate-300 dark:border-slate-700 p-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
              Humour Style
            </label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full rounded-lg text-xs bg-white dark:bg-dark-800 border border-slate-300 dark:border-slate-700 p-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            >
              <option value="Dad Joke">Dad Joke</option>
              <option value="Pun">Pun / Wordplay</option>
              <option value="Dark Humour">Dark Humour</option>
              <option value="Stand-up One-liner">Stand-up One-liner</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            variant="ai-gradient"
            isLoading={isGenerating}
            onClick={handleGenerateJoke}
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            Generate AI Joke
          </Button>
        </div>
      </Card>

      {/* Jokes Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider font-mono">
          Joke Vault ({jokes.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jokes.map((jk) => (
            <JokeCard key={jk.id} joke={jk} />
          ))}
        </div>
      </div>
    </div>
  );
};
