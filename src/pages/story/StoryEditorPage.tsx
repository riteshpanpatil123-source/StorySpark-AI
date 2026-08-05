import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sparkles, Save, Wand2, ArrowLeft, Volume2, Image, FileText, Check } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import toast from 'react-hot-toast';

export const StoryEditorPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('Echoes of Orion');
  const [content, setContent] = useState(
    `Chapter 1: The Signal\n\nThe terminal blinks in rhythmic neon cyan. Jax wipes rain and sweat from his goggles as the hex-code decrypts on screen.\n\n"This isn't corporate data," Jax mutters into his headset. "It's an interstellar broadcast stream dated 2,400 years ago."\n\nSuddenly, the power grid across Sector 7 drops to zero. In the blacked-out room, Jax's cybernetic arm warms up on its own, typing coordinates he has never seen before...`
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isAIAnalyzing, setIsAIAnalyzing] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Story draft saved successfully!');
    }, 600);
  };

  const handleAICoach = () => {
    setIsAIAnalyzing(true);
    setTimeout(() => {
      setIsAIAnalyzing(false);
      toast.success('AI Writing Coach: Sentence pacing improved & 2 passive verbs optimized!');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/app/dashboard')}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-dark-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-bold font-display bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none"
            />
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Badge variant="cyan" size="sm">Sci-Fi</Badge>
              <span>• {content.split(/\s+/).length} words</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            isLoading={isAIAnalyzing}
            onClick={handleAICoach}
            leftIcon={<Wand2 className="w-4 h-4 text-purple-500" />}
          >
            AI Coach
          </Button>

          <Button
            variant="ai-gradient"
            size="sm"
            isLoading={isSaving}
            onClick={handleSave}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Draft
          </Button>
        </div>
      </div>

      {/* Editor Main Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-9">
          <Card className="p-8 min-h-[600px] glass-panel border-brand-500/20">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-full min-h-[550px] bg-transparent font-serif text-base leading-relaxed text-slate-900 dark:text-slate-100 focus:outline-none resize-none"
            />
          </Card>
        </div>

        {/* Sidebar Tools Drawer */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="p-4 space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
              AI Creative Conversion
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
              onClick={() => toast.success('Audio narration synthesis queued!')}
            >
              Narrate with TTS
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
