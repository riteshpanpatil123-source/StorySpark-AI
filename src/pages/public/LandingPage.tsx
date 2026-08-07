import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, BookOpen, Laugh, User, Globe, Wand2, Shield } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedGenre, setSelectedGenre] = useState('Sci-Fi');
  const [demoOutput, setDemoOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const sampleGenerations: Record<string, string> = {
    'Sci-Fi': 'The neon rain slicked the cobblestones of New Neo City. Captain Vance adjusted his ocular lens, tracking the faint hyper-pulse signal emanating from the derelict cargo ship hovering overhead...',
    'Fantasy': 'High atop Mount Aethelgard, the last dragon rider whistled into the blizzard. A golden flame pierced the fog as Ignis descended, her scales glowing with ancient rune magic...',
    'Mystery': 'Detective Halloway stared at the grandfather clock. It had stopped precisely at 3:14 AM, the exact moment Lord Harrington vanished from the locked study without leaving a single footprint...',
  };

  const handleRunDemo = () => {
    setIsGenerating(true);
    setDemoOutput('');
    const fullText = sampleGenerations[selectedGenre];
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setDemoOutput((prev) => prev + fullText[index]);
        index++;
      } else {
        clearInterval(interval);
        setIsGenerating(false);
      }
    }, 20);
  };

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 lg:pt-20 text-center px-4 max-w-5xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border-brand-500/30 text-xs font-semibold text-brand-600 dark:text-ai-spark shadow-glow-primary"
        >
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span>Next-Generation AI Creative Studio v2.0 Live</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold font-display leading-tight tracking-tight text-slate-900 dark:text-slate-100"
        >
          Ignite Your Imagination with{' '}
          <span className="gradient-text">Enterprise AI</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed"
        >
          StorySpark AI is the all-in-one creative platform for novelists, scriptwriters, creators, and businesses. Generate rich stories, jokes, persistent characters, comic scripts, and AI narrations.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <Button
            variant="ai-gradient"
            size="lg"
            rightIcon={<ArrowRight className="w-5 h-5" />}
            onClick={() => navigate('/register')}
          >
            Start Creating Free
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/features')}
          >
            Explore AI Features
          </Button>
        </motion.div>

        {/* Interactive Live AI Demo */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="pt-10 max-w-3xl mx-auto"
        >
          <Card className="text-left space-y-4 p-6 glass-panel border-brand-500/20 shadow-glow-primary">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-ai-spark" />
                <span className="font-display font-semibold text-sm text-slate-900 dark:text-slate-100">
                  Interactive AI Generator Sandbox
                </span>
              </div>
              <div className="flex items-center gap-2">
                {['Sci-Fi', 'Fantasy', 'Mystery'].map((genre) => (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                      selectedGenre === genre
                        ? 'bg-brand-500 text-white'
                        : 'bg-slate-100 dark:bg-dark-700 text-slate-400'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            <div className="min-h-[100px] p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed border border-slate-800 relative">
              {demoOutput || 'Click "Spark Sample Story" below to watch real-time AI story generation in action...'}
            </div>

            <div className="flex justify-end">
              <Button
                variant="ai-gradient"
                size="sm"
                isLoading={isGenerating}
                onClick={handleRunDemo}
              >
                Spark Sample Story
              </Button>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <Badge variant="cyan" size="md">CREATIVE SUITE</Badge>
          <h2 className="text-3xl md:text-4xl font-bold font-display text-slate-900 dark:text-slate-100">
            Everything You Need to Build Worlds
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl mx-auto">
            From plot outlines to comic book screenplays, StorySpark AI equips you with enterprise tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-display text-slate-900 dark:text-slate-100">
              AI Story Generator
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Craft multi-chapter stories with dynamic plot outline generation, genre-matched tone, and custom premise controls.
            </p>
          </Card>

          <Card className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-ai-spark/10 text-ai-spark flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-display text-slate-900 dark:text-slate-100">
              Character Vault
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Build persistent character personas with personality traits, speech patterns, and backstory memories injected directly into stories.
            </p>
          </Card>

          <Card className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-display text-slate-900 dark:text-slate-100">
              World Lore Builder
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Formulate fantasy rulesets, magic systems, and geographic locations to maintain deep world continuity across chapters.
            </p>
          </Card>

          <Card className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Laugh className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-display text-slate-900 dark:text-slate-100">
              AI Joke Studio
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Generate hilarious punchlines, dad jokes, dark humor, and stand-up routines categorized by topic and rating.
            </p>
          </Card>

          <Card className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Wand2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-display text-slate-900 dark:text-slate-100">
              AI Writing Coach
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Get real-time grammar checks, readability metrics, sentence expansion, and tone adjustments right inside the writing editor.
            </p>
          </Card>

          <Card className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-display text-slate-900 dark:text-slate-100">
              Enterprise Security
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              JWT authentication, refresh token rotation, strict RBAC, and encrypted database persistence protect your intellectual property.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="max-w-5xl mx-auto px-4 text-center">
        <Card className="p-10 glass-panel border-brand-500/30 shadow-glow-primary space-y-6">
          <Badge variant="amber" size="md">READY TO SPARK?</Badge>
          <h2 className="text-3xl md:text-4xl font-extrabold font-display text-slate-900 dark:text-slate-100">
            Join Over 100,000+ Creators Today
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            Create your account now and receive 5,000 free AI generation tokens every month.
          </p>
          <Button
            variant="ai-gradient"
            size="lg"
            onClick={() => navigate('/register')}
          >
            Create Your Free Account
          </Button>
        </Card>
      </section>
    </div>
  );
};
