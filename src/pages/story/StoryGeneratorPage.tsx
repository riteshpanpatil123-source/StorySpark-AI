import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Wand2, ArrowRight, Save, Send, RefreshCw, Users, MapPin, Globe, User } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Input } from '@/components/common/Input';
import { MockDataService } from '@/services/mockDataService';
import { aiApi } from '@/services/api/aiApi';
import { storyApi } from '@/services/api/storyApi';
import { characterApi } from '@/services/api/characterApi';
import { Character, World } from '@/types';
import toast from 'react-hot-toast';

export const StoryGeneratorPage: React.FC = () => {
  const navigate = useNavigate();

  // Form State
  const [title, setTitle] = useState('Echoes of Orion');
  const [premise, setPremise] = useState('A rogue Cyberpunk hacker accidentally downloads the memory drive of an ancient interstellar space probe.');
  const [genre, setGenre] = useState('Sci-Fi');
  const [tone, setTone] = useState('Suspenseful');
  const [length, setLength] = useState<'Short' | 'Medium' | 'Long'>('Medium');
  const [language] = useState('English');
  const [targetAudience, setTargetAudience] = useState('Young Adult');
  const [setting, setSetting] = useState('Sector 7 - Subterranean Orbital City');
  const [characters, setCharacters] = useState('Jax Vane (Rogue Hacker), Unit-7 (Ancient AI)');
  const [additionalInstructions] = useState('Include high-stakes tension and vivid atmospheric cyber-rain visuals.');

  // Vault data integration
  const [savedCharacters, setSavedCharacters] = useState<Character[]>([]);
  const [savedWorlds, setSavedWorlds] = useState<World[]>([]);

  useEffect(() => {
    characterApi.getCharacters()
      .then((res) => {
        if (res && res.success && Array.isArray(res.data)) {
          setSavedCharacters(res.data);
        } else {
          setSavedCharacters(MockDataService.getCharacters());
        }
      })
      .catch(() => {
        setSavedCharacters(MockDataService.getCharacters());
      });
    setSavedWorlds(MockDataService.getWorlds());
  }, []);

  // Execution State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [generatedStoryId, setGeneratedStoryId] = useState<string | null>(null);

  const genres = ['Sci-Fi', 'Fantasy', 'Mystery', 'Thriller', 'Horror', 'Romance', 'Comedy', 'Adventure', 'Drama', 'Historical', 'Children\'s'];
  const tones = ['Dark', 'Funny', 'Emotional', 'Inspirational', 'Suspenseful', 'Serious', 'Cinematic', 'Lighthearted'];
  const lengths: ('Short' | 'Medium' | 'Long')[] = ['Short', 'Medium', 'Long'];

  const handleGenerate = async () => {
    if (!premise.trim()) {
      toast.error('Please enter a story premise or core idea');
      return;
    }

    setIsGenerating(true);
    setGeneratedContent('');

    try {
      const res = await aiApi.generateStory({
        title,
        premise,
        genre,
        tone,
        length: length.toLowerCase() as any,
        setting,
        characters,
        language,
        targetAudience,
        additionalInstructions,
      });

      if (res && res.success && res.data) {
        setGeneratedContent(res.data.chapterContent || '');
        const storyObj = (res.data as any).story;
        if (storyObj && storyObj.id) {
          setGeneratedStoryId(storyObj.id);
        }
        toast.success('AI story generated and saved to database!');
      } else {
        toast.error('AI story generation failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Generation error:', error);
      toast.error(error?.response?.data?.error?.message || 'Failed to generate AI story. Please check backend.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!generatedContent) {
      toast.error('Please generate a story chapter first.');
      return;
    }

    try {
      if (generatedStoryId) {
        await storyApi.updateStory(generatedStoryId, {
          title: title || 'Generated AI Story',
          synopsis: premise.slice(0, 150) + '...',
          content: generatedContent,
          genre,
          status: 'draft',
          isPublic: false,
        });
        toast.success('Story draft updated in database!');
      } else {
        const res = await storyApi.createStory({
          title: title || 'Generated AI Story',
          synopsis: premise.slice(0, 150) + '...',
          content: generatedContent,
          genre,
          status: 'draft',
          isPublic: false,
        });
        if (res && res.success && res.data) {
          setGeneratedStoryId(res.data.id);
          toast.success('Story draft saved to database!');
        }
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.error?.message || 'Failed to save story draft to database.');
    }
  };

  const handlePublish = async () => {
    if (!generatedContent) {
      toast.error('Please generate a story chapter first.');
      return;
    }

    try {
      let storyId = generatedStoryId;
      if (!storyId) {
        const res = await storyApi.createStory({
          title: title || 'Generated AI Story',
          synopsis: premise.slice(0, 150) + '...',
          content: generatedContent,
          genre,
          status: 'draft',
          isPublic: false,
        });
        if (res && res.success && res.data) {
          storyId = res.data.id;
          setGeneratedStoryId(storyId);
        }
      }

      if (storyId) {
        await storyApi.publishStory(storyId);
        toast.success('Story published to Public Discovery!');
        navigate(`/stories/${storyId}`);
        return;
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.error?.message || 'Failed to publish story.');
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
            Configure premise parameters, tone, length, and world rules to generate structured multi-chapter plots.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Config Panel (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 space-y-5 glass-panel border-brand-500/20">
            <h2 className="text-base font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Wand2 className="w-4 h-4 text-brand-500" />
              <span>Prompt & Story Parameters</span>
            </h2>

            {/* Story Title */}
            <Input
              label="Working Story Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Echoes of Orion"
            />

            {/* Premise Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Story Premise / Core Idea *
              </label>
              <textarea
                value={premise}
                onChange={(e) => setPremise(e.target.value)}
                rows={3}
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
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
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
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
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

            {/* Length & Audience */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Target Length
                </label>
                <div className="flex gap-1">
                  {lengths.map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setLength(l)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium text-center transition-all ${
                        length === l
                          ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
                          : 'bg-slate-100 dark:bg-dark-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Target Audience
                </label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full rounded-lg text-xs bg-white dark:bg-dark-800 border border-slate-300 dark:border-slate-700 p-2 text-slate-900 dark:text-slate-100 focus:outline-none"
                >
                  <option value="Young Adult">Young Adult</option>
                  <option value="Adult">Adult</option>
                  <option value="Children">Children</option>
                  <option value="All Ages">All Ages</option>
                </select>
              </div>
            </div>

            {/* Advanced Context: Setting & Characters */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              {/* World Lore Selection */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                    Setting / World Context
                  </label>
                  {savedWorlds.length > 0 && (
                    <span className="text-[10px] text-emerald-500 font-medium">From World Vault:</span>
                  )}
                </div>
                {savedWorlds.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-1">
                    {savedWorlds.map((w) => (
                      <button
                        key={w.id}
                        type="button"
                        onClick={() => {
                          setSetting(`${w.name} (${w.genre}) - ${w.description}`);
                          toast.success(`Loaded world lore: ${w.name}`);
                        }}
                        className="px-2 py-0.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] flex items-center gap-1 border border-emerald-500/20"
                      >
                        <Globe className="w-2.5 h-2.5" />
                        {w.name}
                      </button>
                    ))}
                  </div>
                )}
                <Input
                  value={setting}
                  onChange={(e) => setSetting(e.target.value)}
                  leftIcon={<MapPin className="w-3.5 h-3.5" />}
                  placeholder="e.g. Sector 7 - Cyberpunk Metropolis"
                />
              </div>

              {/* Character Vault Selection */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                    Key Characters
                  </label>
                  {savedCharacters.length > 0 && (
                    <span className="text-[10px] text-purple-500 font-medium">From Character Vault:</span>
                  )}
                </div>
                {savedCharacters.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-1">
                    {savedCharacters.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          const charInfo = `${c.name} (${c.archetype})`;
                          if (!characters.includes(c.name)) {
                            setCharacters((prev) => (prev ? `${prev}, ${charInfo}` : charInfo));
                            toast.success(`Added character: ${c.name}`);
                          }
                        }}
                        className="px-2 py-0.5 rounded bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 text-[10px] flex items-center gap-1 border border-purple-500/20"
                      >
                        <User className="w-2.5 h-2.5" />
                        + {c.name}
                      </button>
                    ))}
                  </div>
                )}
                <Input
                  value={characters}
                  onChange={(e) => setCharacters(e.target.value)}
                  leftIcon={<Users className="w-3.5 h-3.5" />}
                  placeholder="e.g. Jax Vane (Protagonist), Lyra Vance (Companion)"
                />
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
              {isGenerating ? 'Synthesizing Plot Nodes...' : 'Generate AI Story Chapter'}
            </Button>
          </Card>
        </div>

        {/* Right Output Preview Canvas (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="p-6 h-full min-h-[550px] flex flex-col justify-between glass-panel border-brand-500/20 shadow-glow-primary">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="cyan" size="sm">{genre}</Badge>
                  <Badge variant="brand" size="sm">{tone}</Badge>
                  <Badge variant="amber" size="sm">{length}</Badge>
                </div>

                {generatedContent && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSaveDraft}
                      leftIcon={<Save className="w-3.5 h-3.5" />}
                    >
                      Save Draft
                    </Button>
                    <Button
                      variant="ai-gradient"
                      size="sm"
                      onClick={() => {
                        if (generatedStoryId) {
                          navigate(`/app/editor/${generatedStoryId}`);
                        } else {
                          handleSaveDraft();
                        }
                      }}
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      Open Editor
                    </Button>
                  </div>
                )}
              </div>

              {generatedContent && generatedStoryId && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-2 text-xs text-emerald-700 dark:text-emerald-300">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="font-semibold">Saved in Database & My Library (Draft)</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-emerald-600 dark:text-emerald-300 hover:text-emerald-800"
                    onClick={() => navigate('/app/library')}
                  >
                    Go to My Library →
                  </Button>
                </div>
              )}

              <div className="font-serif text-sm leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap min-h-[400px] p-2">
                {generatedContent || (
                  <div className="h-full min-h-[380px] flex flex-col items-center justify-center text-center text-slate-400 p-8 space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 animate-pulse" />
                    </div>
                    <p className="text-xs max-w-sm">
                      Configure your title, premise, genre, and tone on the left parameters panel, then click "Generate AI Story Chapter".
                    </p>
                  </div>
                )}
              </div>
            </div>

            {generatedContent && (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">
                  Word Count: <strong>{generatedContent.split(/\s+/).length} words</strong>
                </span>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={handleGenerate} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
                    Regenerate
                  </Button>
                  <Button variant="outline" size="sm" onClick={handlePublish} leftIcon={<Send className="w-3.5 h-3.5 text-emerald-500" />}>
                    Publish
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
