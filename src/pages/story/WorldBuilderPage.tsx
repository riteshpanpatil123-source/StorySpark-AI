import React, { useState, useEffect } from 'react';
import { Globe, Sparkles, Wand2 } from 'lucide-react';
import { WorldCard } from '@/components/story/WorldCard';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { MockDataService } from '@/services/mockDataService';
import { World } from '@/types';
import toast from 'react-hot-toast';

export const WorldBuilderPage: React.FC = () => {
  const [worlds, setWorlds] = useState<World[]>([]);
  const [name, setName] = useState('Helios Outpost');
  const [genre, setGenre] = useState('Sci-Fi Space Opera');
  const [description, setDescription] = useState('A mining colony orbiting a dying star encased in solar collection arrays.');
  const [rules, setRules] = useState('Artificial gravity fluctuates during solar flare activity.');

  useEffect(() => {
    setWorlds(MockDataService.getWorlds());
  }, []);

  const handleCreateWorld = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const created = MockDataService.saveWorld({
      name,
      genre,
      description,
      rules,
      isPublic: true,
    });

    setWorlds([created, ...worlds]);
    toast.success(`World lore "${name}" saved to library!`);
    setName('');
    setDescription('');
  };

  const handleDeleteWorld = (id: string, worldName: string) => {
    if (window.confirm(`Are you sure you want to remove world "${worldName}" from your lore library?`)) {
      MockDataService.deleteWorld(id);
      setWorlds(MockDataService.getWorlds());
      toast.success(`Removed "${worldName}" from World Lore`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-2">
            World Builder & Lore
            <Globe className="w-5 h-5 text-emerald-500" />
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Define magic systems, tech rulesets, and realm descriptions for consistent AI narrative building.
          </p>
        </div>
      </div>

      {/* Creation Form */}
      <Card className="p-6 glass-panel border-emerald-500/20 space-y-4">
        <h2 className="text-base font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Wand2 className="w-4 h-4 text-emerald-500" />
          <span>Build New Realm Lore</span>
        </h2>

        <form onSubmit={handleCreateWorld} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Realm / World Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Helios Outpost" />
            <Input label="Genre Style" value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="e.g. Sci-Fi Space Opera" />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
              World Overview & Atmospheric Setting
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Describe the environment, society, and atmosphere..."
              className="w-full rounded-lg text-xs bg-white dark:bg-dark-800 border border-slate-300 dark:border-slate-700 p-3 text-slate-900 dark:text-slate-100 focus:outline-none"
            />
          </div>

          <Input label="World Ruleset & Physics / Magic Laws" value={rules} onChange={(e) => setRules(e.target.value)} placeholder="e.g. Gravity shifts every 12 hours..." />

          <div className="flex justify-end">
            <Button type="submit" variant="ai-gradient" leftIcon={<Sparkles className="w-4 h-4" />}>
              Save Realm Lore
            </Button>
          </div>
        </form>
      </Card>

      {/* World Display Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider font-mono">
          Saved World Lore ({worlds.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {worlds.map((w) => (
            <WorldCard key={w.id} world={w} onDelete={handleDeleteWorld} />
          ))}
        </div>
      </div>
    </div>
  );
};
