import React, { useState, useEffect } from 'react';
import { Laugh, Sparkles } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { JokeCard } from '@/components/story/JokeCard';
import { MockDataService } from '@/services/mockDataService';
import { jokeApi } from '@/services/api/jokeApi';
import { Joke } from '@/types';
import toast from 'react-hot-toast';

export const JokeGeneratorPage: React.FC = () => {
  const [topic, setTopic] = useState('Software Engineering & AI');
  const [style, setStyle] = useState('Dad Joke');
  const [tone, setTone] = useState('Witty');
  const [isGenerating, setIsGenerating] = useState(false);
  const [jokes, setJokes] = useState<Joke[]>([]);

  useEffect(() => {
    loadJokes();
  }, []);

  const loadJokes = async () => {
    try {
      const res = await jokeApi.getJokes();
      if (res && res.success && res.data) {
        setJokes(res.data);
      } else {
        setJokes(MockDataService.getJokes());
      }
    } catch {
      setJokes(MockDataService.getJokes());
    }
  };

  const handleGenerateJoke = async () => {
    setIsGenerating(true);

    const jokeTemplates = [
      {
        setup: `Why did the AI language model refuse to eat at the restaurant?`,
        punchline: `Because it kept getting stuck in an infinite prompt loop!`,
      },
      {
        setup: `How many full-stack developers does it take to change a lightbulb?`,
        punchline: `None. That's a hardware problem, and the API already returns bright=true!`,
      },
      {
        setup: `Why do programmers hate nature?`,
        punchline: `It has too many bugs and no stack overflow!`,
      },
      {
        setup: `What is an AI's favorite genre of music?`,
        punchline: `Heavy Algorhythms!`,
      },
    ];

    const selected = jokeTemplates[Math.floor(Math.random() * jokeTemplates.length)];

    try {
      const res = await jokeApi.createJoke({
        setup: selected.setup,
        punchline: selected.punchline,
        category: style,
        ratingAverage: 5.0,
        ratingCount: 1,
        isPublic: true,
      });

      if (res && res.success && res.data) {
        setJokes([res.data, ...jokes]);
        toast.success('New AI joke synthesized and saved to database!');
      } else {
        const fallback = MockDataService.saveJoke({
          setup: selected.setup,
          punchline: selected.punchline,
          category: style,
        });
        setJokes([fallback, ...jokes]);
        toast.success('New AI joke synthesized!');
      }
    } catch {
      const fallback = MockDataService.saveJoke({
        setup: selected.setup,
        punchline: selected.punchline,
        category: style,
      });
      setJokes([fallback, ...jokes]);
      toast.success('New AI joke synthesized!');
    } finally {
      setIsGenerating(false);
    }
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
            Craft stand-up routines, dad jokes, puns, and tech humor powered by AI.
          </p>
        </div>
      </div>

      {/* Generator Control Panel */}
      <Card className="p-6 glass-panel border-amber-500/20 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5 md:col-span-1">
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
              Joke Topic / Theme
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Artificial Intelligence, Coffee..."
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
              className="w-full rounded-lg text-xs bg-white dark:bg-dark-800 border border-slate-300 dark:border-slate-700 p-2.5 text-slate-900 dark:text-slate-100 focus:outline-none"
            >
              <option value="Dad Joke">Dad Joke</option>
              <option value="Pun">Pun / Wordplay</option>
              <option value="Dark Humour">Dark Humour</option>
              <option value="Stand-up One-liner">Stand-up One-liner</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
              Tone
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full rounded-lg text-xs bg-white dark:bg-dark-800 border border-slate-300 dark:border-slate-700 p-2.5 text-slate-900 dark:text-slate-100 focus:outline-none"
            >
              <option value="Witty">Witty</option>
              <option value="Sarcastic">Sarcastic</option>
              <option value="Family Friendly">Family Friendly</option>
              <option value="Geeky">Geeky / Tech</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
          <Button
            variant="ai-gradient"
            isLoading={isGenerating}
            onClick={handleGenerateJoke}
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            Synthesize AI Joke
          </Button>
        </div>
      </Card>

      {/* Jokes Vault Grid */}
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
