import React, { useState, useEffect } from 'react';
import { Globe, Sparkles, Wand2, X } from 'lucide-react';
import { WorldCard } from '@/components/story/WorldCard';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { MockDataService } from '@/services/mockDataService';
import { worldApi } from '@/services/api/worldApi';
import { World } from '@/types';
import toast from 'react-hot-toast';

export const WorldBuilderPage: React.FC = () => {
  const [worlds, setWorlds] = useState<World[]>([]);
  const [editingWorldId, setEditingWorldId] = useState<string | null>(null);

  const [name, setName] = useState('Helios Outpost');
  const [genre, setGenre] = useState('Sci-Fi Space Opera');
  const [description, setDescription] = useState('A mining colony orbiting a dying star encased in solar collection arrays.');
  const [rules, setRules] = useState('Artificial gravity fluctuates during solar flare activity.');

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    loadWorlds();
  }, []);

  const loadWorlds = async () => {
    setIsLoading(true);
    try {
      const res = await worldApi.getWorlds();
      if (res && res.success && Array.isArray(res.data)) {
        setWorlds(res.data);
        return;
      }
      setWorlds(MockDataService.getWorlds());
    } catch {
      setWorlds(MockDataService.getWorlds());
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveWorld = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('World / Realm name is required');
      return;
    }

    setIsSaving(true);
    try {
      if (editingWorldId) {
        const res = await worldApi.updateWorld(editingWorldId, {
          name,
          genre,
          description,
          rules,
          isPublic: true,
        });

        if (res && res.success && res.data) {
          toast.success(`World lore "${name}" updated!`);
          setEditingWorldId(null);
          resetForm();
          loadWorlds();
          return;
        }
      } else {
        const res = await worldApi.createWorld({
          name,
          genre,
          description,
          rules,
          isPublic: true,
        });

        if (res && res.success && res.data) {
          setWorlds([res.data, ...worlds]);
          toast.success(`World lore "${name}" saved to database!`);
          resetForm();
          return;
        }
      }
    } catch (error: any) {
      console.error('Save world error:', error);
      toast.error(error?.response?.data?.error?.message || 'Failed to save world lore.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditWorld = (world: World) => {
    setEditingWorldId(world.id);
    setName(world.name);
    setGenre(world.genre);
    setDescription(world.description || '');
    setRules(world.rules || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingWorldId(null);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setGenre('Sci-Fi Space Opera');
    setDescription('');
    setRules('');
  };

  const handleDeleteWorld = async (id: string, worldName: string) => {
    if (window.confirm(`Are you sure you want to remove world "${worldName}" from your lore library?`)) {
      try {
        await worldApi.deleteWorld(id);
        toast.success(`Removed "${worldName}" from World Lore`);
        loadWorlds();
      } catch (error: any) {
        toast.error(error?.response?.data?.error?.message || 'Failed to delete world lore.');
      }
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

      {/* Creation / Edit Form */}
      <Card className="p-6 glass-panel border-emerald-500/20 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h2 className="text-base font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-emerald-500" />
            <span>{editingWorldId ? 'Edit Realm Lore' : 'Build New Realm Lore'}</span>
          </h2>
          {editingWorldId && (
            <Button variant="ghost" size="sm" onClick={handleCancelEdit} leftIcon={<X className="w-3.5 h-3.5" />}>
              Cancel Edit
            </Button>
          )}
        </div>

        <form onSubmit={handleSaveWorld} className="space-y-4">
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

          <div className="flex justify-end gap-2">
            {editingWorldId && (
              <Button type="button" variant="ghost" onClick={handleCancelEdit}>
                Cancel
              </Button>
            )}
            <Button type="submit" variant="ai-gradient" isLoading={isSaving} leftIcon={<Sparkles className="w-4 h-4" />}>
              {editingWorldId ? 'Update Realm Lore' : 'Save Realm Lore'}
            </Button>
          </div>
        </form>
      </Card>

      {/* World Display Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider font-mono">
          Saved World Lore ({worlds.length})
        </h2>
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading World Lore...</div>
        ) : worlds.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {worlds.map((w) => (
              <WorldCard key={w.id} world={w} onDelete={handleDeleteWorld} onEdit={handleEditWorld} />
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center text-xs text-slate-400 space-y-2">
            <p>Your World Lore Library is empty.</p>
            <p className="text-slate-500">Build your first realm lore using the form above!</p>
          </Card>
        )}
      </div>
    </div>
  );
};
