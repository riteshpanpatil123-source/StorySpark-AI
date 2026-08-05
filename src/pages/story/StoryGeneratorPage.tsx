import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Wand2, ArrowRight, RefreshCw, Check } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Badge } from '@/components/common/Badge';
import { aiApi } from '@/services/api/aiApi';
import toast from 'react-hot-toast';

export const StoryGeneratorPage: React.FC = () => {
  const navigate = useNavigate();
  const [premise, setPremise] = useState('A rogue Cyberpunk hacker accidentally downloads the memory drive of an ancient space probe.');
  const [genre, setGenre] = useState('Sci-Fi');
  const [tone, setTone] = useState('Suspenseful');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedStoryContent, setGeneratedStoryContent] = useState('');

  const genres = ['Sci-Fi', 'Fantasy', 'Mystery', 'Horror', 'Romance', 'Thriller'];
  const tones = ['Suspenseful', 'Dark', 'Humorous', 'Poetic', 'Action-Packed'];

  const handleGenerate = async () => {
    if (!premise.trim()) {
      toast.error('Please enter a story premise');
      return;
    }

    setIsGenerating(true);
    setGeneratedStoryContent('');

    try {
      // Simulate real-time streaming text generation
      const mockResultText = `CHAPTER 1: THE RECURSIVE PROBE\n\nThe terminal blinks in rhythmic neon cyan. Jax wipes rain and sweat from his goggles as the hex-code decrypts on screen.\n\n"This isn't corporate data," Jax mutters into his headset. "It's an interstellar broadcast stream dated 2,400 years ago."\n\nSuddenly, the power grid across Sector 7 drops to zero. In the blacked-out room, Jax's cybernetic arm warms up on its own, typing coordinates he has never seen before...`;
      
      let idx = 0;
      const interval = setInterval(() => {
        if (idx < mockResultText.length) {
          setGeneratedStoryContent((prev) => prev + mockResultText[idx]);
          idx++;
        } else {
          clearInterval(interval);
          setIsGenerating(false);
          toast.success('Story chapter generated successfully!');
        }
      }, 15);
    } catch (error) {
      toast.error('AI Generation failed. Retrying...');
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-2">
            AI Story Generator Studio
            <Sparkles className="w-5 h-5 text-ai-spark" />
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Configure premise parameters, tone, and genre to ignite your AI story.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Config Panel (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 space-y-5 glass-panel border-brand-500/20">
            <h2 className="text-base font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Wand2 className="w-4 h-4 text-brand-500" />
              <span>Prompt & Parameters</span>
            </h2>

            {/* Premise Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Story Premise / Core Idea
              </label>
              <textarea
                value={premise}
                onChange={(e) => setPremise(e.target.value)}
                rows={4}
                placeholder="Describe your story idea..."
                className="w-full rounded-lg text-xs bg-white dark:bg-dark-800 border border-slate-300 dark:border-slate-700 p-3 focus:outline-none focus:ring-2 focus:ring-brand-500/30 text-slate-900 dark:text-slate-100"
              />
            </div>

            {/* Genre Select */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Genre
              </label>
              <div className="flex flex-wrap gap-1.5">
                {genres.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGenre(g)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      genre === g
                        ? 'bg-brand-500 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-dark-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Tone Select */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Writing Tone
              </label>
              <div className="flex flex-wrap gap-1.5">
                {tones.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      tone === t
                        ? 'bg-ai-spark text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-dark-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              variant="ai-gradient"
              className="w-full py-3"
              isLoading={isGenerating}
              onClick={handleGenerate}
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              Generate AI Chapter
            </Button>
          </Card>
        </div>

        {/* Right Output Preview Canvas (7 Cols) */}
        <div className="lg:col-span-7">
          <Card className="p-6 h-full min-h-[500px] flex flex-col justify-between glass-panel border-brand-500/20 shadow-glow-primary">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="cyan" size="sm">{genre}</Badge>
                  <Badge variant="brand" size="sm">{tone}</Badge>
                </div>
                {generatedStoryContent && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/app/editor/draft_new')}
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Open in Editor
                  </Button>
                )}
              </div>

              <div className="font-serif text-sm leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap min-h-[350px]">
                {generatedStoryContent || (
                  <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 p-8 space-y-2">
                    <Sparkles className="w-8 h-8 text-slate-500 animate-pulse" />
                    <p className="text-xs">
                      Configure your prompt parameters on the left and click "Generate AI Chapter".
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
