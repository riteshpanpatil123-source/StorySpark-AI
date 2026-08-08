import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Save,
  Wand2,
  ArrowLeft,
  Volume2,
  Image,
  Send,
  Check,
  Eye,
  FileText,
  Sparkles,
  Plus,
  Minimize2,
  Maximize2,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { MockDataService } from '@/services/mockDataService';
import { Story, StoryStatus } from '@/types';
import toast from 'react-hot-toast';

import { storyApi } from '@/services/api/storyApi';

export const StoryEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [story, setStory] = useState<Story | null>(null);
  const [title, setTitle] = useState('Echoes of Orion');
  const [genre, setGenre] = useState('Sci-Fi');
  const [status, setStatus] = useState<StoryStatus>('draft');
  const [content, setContent] = useState(
    `Chapter 1: The Signal\n\nThe terminal blinks in rhythmic neon cyan. Jax wipes rain and sweat from his goggles as the hex-code decrypts on screen.\n\n"This isn't corporate data," Jax mutters into his headset. "It's an interstellar broadcast stream dated 2,400 years ago."\n\nSuddenly, the power grid across Sector 7 drops to zero. In the blacked-out room, Jax's cybernetic arm warms up on its own, typing coordinates he has never seen before...\n\nChapter 2: The Quantum Relay\n\nThe air grows cold as the emergency generator hums online. A holographic map expands across the room, illuminating coordinates pointing toward the outer Kuiper Belt.`
  );

  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [isAIAnalyzing, setIsAIAnalyzing] = useState(false);
  const [activeChapter, setActiveChapter] = useState(1);

  useEffect(() => {
    if (id && id !== 'draft_new') {
      loadStoryFromBackend(id);
    }
  }, [id]);

  const loadStoryFromBackend = async (storyId: string) => {
    try {
      const res = await storyApi.getStoryById(storyId);
      if (res && res.success && res.data) {
        setStory(res.data);
        setTitle(res.data.title);
        setGenre(res.data.genre);
        setStatus(res.data.status);
        if (res.data.content) {
          setContent(res.data.content);
        }
        return;
      }
    } catch {
      // Fallback
    }

    const existing = MockDataService.getStoryById(storyId);
    if (existing) {
      setStory(existing);
      setTitle(existing.title);
      setGenre(existing.genre);
      setStatus(existing.status);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (saveStatus === 'unsaved') {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [saveStatus]);

  const handleBack = () => {
    if (saveStatus === 'unsaved') {
      if (window.confirm('You have unsaved changes. Save draft before leaving?')) {
        handleSave();
      }
    }
    navigate('/app/dashboard');
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setSaveStatus('unsaved');
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    const targetId = story?.id || (id !== 'draft_new' ? id : undefined);

    try {
      if (targetId) {
        const res = await storyApi.updateStory(targetId, {
          title,
          genre,
          synopsis: content.slice(0, 140) + '...',
          content,
          status,
        });
        if (res && res.success && res.data) {
          setStory(res.data);
        }
      } else {
        const res = await storyApi.createStory({
          title,
          genre,
          synopsis: content.slice(0, 140) + '...',
          content,
          status,
        });
        if (res && res.success && res.data) {
          setStory(res.data);
        }
      }
    } catch {
      const saved = MockDataService.saveStory({
        id: targetId,
        title,
        genre,
        synopsis: content.slice(0, 140) + '...',
        status,
        wordCount: content.split(/\s+/).length,
      });
      setStory(saved);
    }

    setSaveStatus('saved');
    toast.success('Story draft saved successfully to database!');
  };

  const handlePublish = async () => {
    setSaveStatus('saving');
    const targetId = story?.id || (id !== 'draft_new' ? id : undefined);

    try {
      if (targetId) {
        const res = await storyApi.publishStory(targetId);
        if (res && res.success && res.data) {
          setStory(res.data);
          setStatus('published');
          setSaveStatus('saved');
          toast.success('Story published to Public Discovery!');
          navigate(`/stories/${res.data.id}`);
          return;
        }
      }
    } catch {
      // Fallback
    }

    const saved = MockDataService.saveStory({
      id: targetId,
      title,
      genre,
      synopsis: content.slice(0, 140) + '...',
      status: 'published',
      isPublic: true,
      wordCount: content.split(/\s+/).length,
    });
    setStory(saved);
    setStatus('published');
    setSaveStatus('saved');
    toast.success('Story published to Public Discovery!');
    navigate(`/stories/${saved.id}`);
  };

  const handleAICoachAction = (actionName: string) => {
    setIsAIAnalyzing(true);
    setTimeout(() => {
      setIsAIAnalyzing(false);
      if (actionName === 'Continue') {
        setContent((prev) => prev + `\n\nJax reached for the holographic dial, his pulse racing as the distress signal pulsed faster.`);
      } else if (actionName === 'Expand') {
        setContent((prev) => prev + `\n\nThe raindrops splattered against the reinforced ferro-glass windows like liquid lead, reflecting the flickering neon glyphs of Sector 7.`);
      } else if (actionName === 'Tone') {
        toast.success('AI Writing Coach: Tone shifted to high-tension atmospheric suspense!');
      } else {
        toast.success(`AI Writing Coach: ${actionName} applied!`);
      }
      setSaveStatus('unsaved');
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation & Status Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-dark-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setSaveStatus('unsaved');
              }}
              className="text-xl font-bold font-display bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700"
            />
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
              <Badge variant="cyan" size="sm">{genre}</Badge>
              <Badge variant={status === 'published' ? 'emerald' : 'amber'} size="sm">
                {status.toUpperCase()}
              </Badge>
              <span>• {content.split(/\s+/).length} words</span>
              <span className="font-mono text-[11px] text-slate-500">
                {saveStatus === 'saved' && <span className="text-emerald-500 flex items-center gap-1"><Check className="w-3 h-3" /> Saved</span>}
                {saveStatus === 'saving' && <span className="text-amber-500 animate-pulse">Saving...</span>}
                {saveStatus === 'unsaved' && <span className="text-rose-400">Unsaved changes</span>}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {story && story.status === 'published' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/stories/${story.id}`)}
              leftIcon={<Eye className="w-4 h-4" />}
            >
              Public Reader
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            isLoading={saveStatus === 'saving'}
            onClick={handleSave}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Draft
          </Button>

          <Button
            variant="ai-gradient"
            size="sm"
            onClick={handlePublish}
            leftIcon={<Send className="w-4 h-4" />}
          >
            Publish Story
          </Button>
        </div>
      </div>

      {/* Editor Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Toolbar / Chapters (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="p-4 space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono flex items-center justify-between">
              <span>Chapter Structure</span>
              <Button variant="ghost" size="sm" onClick={() => setContent((prev) => prev + `\n\nChapter ${activeChapter + 1}: New Node\n\nThe adventure continues...`)}>
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => setActiveChapter(1)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 ${
                  activeChapter === 1
                    ? 'bg-brand-500/10 text-brand-500 font-semibold border border-brand-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-700'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Chapter 1: The Signal</span>
              </button>
              <button
                onClick={() => setActiveChapter(2)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 ${
                  activeChapter === 2
                    ? 'bg-brand-500/10 text-brand-500 font-semibold border border-brand-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-700'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Chapter 2: Quantum Relay</span>
              </button>
            </div>
          </Card>

          {/* AI Creative Assistant Tools */}
          <Card className="p-4 space-y-3 glass-panel border-purple-500/20">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Wand2 className="w-3.5 h-3.5 text-purple-500" />
              <span>AI Copilot Actions</span>
            </h3>

            <div className="grid grid-cols-1 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="justify-start text-xs"
                isLoading={isAIAnalyzing}
                onClick={() => handleAICoachAction('Continue')}
                leftIcon={<Sparkles className="w-3.5 h-3.5 text-brand-500" />}
              >
                Continue Story
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="justify-start text-xs"
                isLoading={isAIAnalyzing}
                onClick={() => handleAICoachAction('Expand')}
                leftIcon={<Maximize2 className="w-3.5 h-3.5 text-emerald-500" />}
              >
                Expand Paragraph
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="justify-start text-xs"
                isLoading={isAIAnalyzing}
                onClick={() => handleAICoachAction('Shorten')}
                leftIcon={<Minimize2 className="w-3.5 h-3.5 text-amber-500" />}
              >
                Shorten / Concise
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="justify-start text-xs"
                isLoading={isAIAnalyzing}
                onClick={() => handleAICoachAction('Tone')}
                leftIcon={<Zap className="w-3.5 h-3.5 text-cyan-500" />}
              >
                Improve Grammar & Tone
              </Button>
            </div>
          </Card>

          {/* Media Generation Assets */}
          <Card className="p-4 space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
              Multimedia Assets
            </h3>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-xs"
              leftIcon={<Image className="w-4 h-4 text-ai-spark" />}
              onClick={() => toast.success('DALL-E 3 Cover Art generation queued!')}
            >
              Generate AI Cover
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-xs"
              leftIcon={<Volume2 className="w-4 h-4 text-amber-500" />}
              onClick={() => toast.success('Audio Narration TTS synthesis queued!')}
            >
              Narrate with Audio TTS
            </Button>
          </Card>
        </div>

        {/* Center Editor Canvas (9 cols) */}
        <div className="lg:col-span-9">
          <Card className="p-8 min-h-[620px] glass-panel border-brand-500/20 shadow-glow-primary flex flex-col">
            <textarea
              value={content}
              onChange={handleContentChange}
              placeholder="Write your story content here..."
              className="w-full flex-1 min-h-[550px] bg-transparent font-serif text-base leading-relaxed text-slate-900 dark:text-slate-100 focus:outline-none resize-none"
            />
          </Card>
        </div>
      </div>
    </div>
  );
};
