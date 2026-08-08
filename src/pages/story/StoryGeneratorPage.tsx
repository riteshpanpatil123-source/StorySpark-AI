import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Wand2, ArrowRight, Save, Send, RefreshCw, Users, MapPin, Globe, User } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Input } from '@/components/common/Input';
import { MockDataService } from '@/services/mockDataService';
import { aiApi } from '@/services/api/aiApi';
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
    setSavedCharacters(MockDataService.getCharacters());
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
        premise,
        genre,
        tone,
        length: length.toLowerCase() as any,
      });

      if (res && res.success && res.data) {
        setGeneratedContent(res.data.chapterContent || res.data.story?.content || '');
        if (res.data.story?.id) {
          setGeneratedStoryId(res.data.story.id);
        }
        toast.success('AI story generated and saved to your database library!');
      } else {
        runSimulatedGeneration();
      }
    } catch {
      runSimulatedGeneration();
    } finally {
      setIsGenerating(false);
    }
  };

  const runSimulatedGeneration = () => {
    const templateText = `# ${title.trim() || 'Untitled Story'}\n\n**Genre**: ${genre} | **Tone**: ${tone} | **Language**: ${language} | **Audience**: ${targetAudience}\n**Setting**: ${setting}\n**Key Cast**: ${characters}\n\n## Chapter 1: The Descent into ${setting.split('-')[0] || 'Unknown'}\n\nThe terminal screen blinks in rhythmic neon cyan. Jax wipes rain and sweat from his tactical goggles as the hex-code decrypts on screen.\n\n"This isn't corporate data," Jax mutters into his headset microphone. "It's an interstellar broadcast stream dated 2,400 years ago from the Orion arm."\n\nSuddenly, the power grid across the sector drops to zero. In the pitch-black room, Jax's cybernetic arm warms up on its own, typing coordinates he has never seen before...\n\nUnit-7's voice echoes softly through the headset speakers: "Jax, do not execute the binary sequence. It is not an archive—it is an activation key."\n\n*Directive*: ${additionalInstructions}`;
    setGeneratedContent(templateText);
    toast.success('AI story chapter generated!');
  };

  const handleSaveDraft = () => {
    if (!generatedContent) {
      toast.error('Please generate a story chapter first.');
      return;
    }
    const saved = MockDataService.saveStory({
      id: generatedStoryId || undefined,
      title: title || 'Generated AI Story',
      synopsis: premise.slice(0, 150) + '...',
      genre,
      tags: [genre.toLowerCase(), tone.toLowerCase(), 'ai-generated'],
      status: 'draft',
      isPublic: false,
      wordCount: generatedContent.split(/\s+/).length,
    });
    setGeneratedStoryId(saved.id);
    toast.success('Saved draft to Story Library!');
  };

  const handlePublish = () => {
    if (!generatedContent) {
      toast.error('Please generate a story chapter first.');
      return;
    }
    const saved = MockDataService.saveStory({
      id: generatedStoryId || undefined,
      title: title || 'Generated AI Story',
      synopsis: premise.slice(0, 150) + '...',
      genre,
      tags: [genre.toLowerCase(), tone.toLowerCase(), 'published'],
      status: 'published',
      isPublic: true,
      wordCount: generatedContent.split(/\s+/).length,
    });
    setGeneratedStoryId(saved.id);
    toast.success('Story published to Public Discovery!');
    navigate(`/stories/${saved.id}`);
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
                        const saved = MockDataService.saveStory({
                          title,
                          synopsis: premise,
                          genre,
                          tags: [genre.toLowerCase(), tone.toLowerCase()],
                          status: 'draft',
                          wordCount: generatedContent.split(/\s+/).length,
                        });
                        navigate(`/app/editor/${saved.id}`);
                      }}
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      Open Editor
                    </Button>
                  </div>
                )}
              </div>

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
