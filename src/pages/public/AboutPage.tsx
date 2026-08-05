import React from 'react';
import { Sparkles, Shield, Users, Heart } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';

export const AboutPage: React.FC = () => {
  return (
    <div className="py-12 space-y-16 max-w-5xl mx-auto px-4">
      <div className="text-center space-y-4">
        <Badge variant="cyan" size="md">OUR MISSION</Badge>
        <h1 className="text-4xl md:text-5xl font-extrabold font-display text-slate-900 dark:text-slate-100">
          Democratizing Creative Storytelling
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-2xl mx-auto leading-relaxed">
          StorySpark AI was founded by artificial intelligence engineers and published authors with a vision to amplify human creativity, not replace it.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="space-y-3 p-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold font-display text-slate-900 dark:text-slate-100">Creative Flow</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Eliminating writer's block by giving storytellers intelligent inline co-pilots.
          </p>
        </Card>

        <Card className="space-y-3 p-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-ai-spark/10 text-ai-spark flex items-center justify-center mx-auto">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold font-display text-slate-900 dark:text-slate-100">IP Protection</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Your stories, characters, and worlds belong 100% to you. We never train public models on private drafts.
          </p>
        </Card>

        <Card className="space-y-3 p-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold font-display text-slate-900 dark:text-slate-100">Global Community</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Connecting creators across 120+ countries to share, rate, and collaborate on stories.
          </p>
        </Card>
      </div>
    </div>
  );
};
