import React, { useState, useEffect } from 'react';
import { User, Sparkles, Wand2, X } from 'lucide-react';
import { CharacterCard } from '@/components/story/CharacterCard';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { MockDataService } from '@/services/mockDataService';
import { characterApi } from '@/services/api/characterApi';
import { Character } from '@/types';
import toast from 'react-hot-toast';

export const CharacterBuilderPage: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [editingCharacterId, setEditingCharacterId] = useState<string | null>(null);

  const [name, setName] = useState('Valerie Thorne');
  const [archetype, setArchetype] = useState('Netrunner Specialist');
  const [traits, setTraits] = useState('Analytical, Fearless, Secretive');
  const [backstory, setBackstory] = useState('An elite cyber operator who unlocked corporate encryption key archives.');
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = async () => {
    setIsLoading(true);
    try {
      const res = await characterApi.getCharacters();
      if (res && res.success && Array.isArray(res.data)) {
        setCharacters(res.data);
        return;
      }
      setCharacters(MockDataService.getCharacters());
    } catch {
      setCharacters(MockDataService.getCharacters());
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCharacter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Character name is required');
      return;
    }

    setIsSaving(true);
    const traitList = traits.split(',').map((t) => t.trim()).filter(Boolean);

    try {
      if (editingCharacterId) {
        const res = await characterApi.updateCharacter(editingCharacterId, {
          name,
          archetype,
          personalityTraits: traitList,
          backstory,
          isPublic: true,
        });

        if (res && res.success && res.data) {
          toast.success(`Character persona "${name}" updated!`);
          setEditingCharacterId(null);
          resetForm();
          loadCharacters();
          return;
        }
      } else {
        const res = await characterApi.createCharacter({
          name,
          archetype,
          personalityTraits: traitList,
          backstory,
          isPublic: true,
        });

        if (res && res.success && res.data) {
          setCharacters([res.data, ...characters]);
          toast.success(`Character persona "${name}" saved to database!`);
          resetForm();
          return;
        }
      }
    } catch (error: any) {
      console.error('Save character error:', error);
      toast.error(error?.response?.data?.error?.message || 'Failed to save character persona.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditCharacter = (char: Character) => {
    setEditingCharacterId(char.id);
    setName(char.name);
    setArchetype(char.archetype);
    setTraits(char.personalityTraits ? char.personalityTraits.join(', ') : '');
    setBackstory(char.backstory || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingCharacterId(null);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setArchetype('Protagonist');
    setTraits('');
    setBackstory('');
  };

  const handleDeleteCharacter = async (id: string, charName: string) => {
    if (window.confirm(`Are you sure you want to remove character "${charName}" from your vault?`)) {
      try {
        await characterApi.deleteCharacter(id);
        toast.success(`Removed "${charName}" from Character Vault`);
        loadCharacters();
      } catch (error: any) {
        toast.error(error?.response?.data?.error?.message || 'Failed to delete character.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-2">
            Character Vault & Personas
            <User className="w-5 h-5 text-purple-500" />
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Define character archetypes, speech patterns, and traits to inject into your AI story generator.
          </p>
        </div>
      </div>

      {/* Creation / Edit Form */}
      <Card className="p-6 glass-panel border-purple-500/20 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h2 className="text-base font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-purple-500" />
            <span>{editingCharacterId ? 'Edit Character Persona' : 'Forge New Character Persona'}</span>
          </h2>
          {editingCharacterId && (
            <Button variant="ghost" size="sm" onClick={handleCancelEdit} leftIcon={<X className="w-3.5 h-3.5" />}>
              Cancel Edit
            </Button>
          )}
        </div>

        <form onSubmit={handleSaveCharacter} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Character Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Valerie Thorne" />
            <Input label="Archetype / Role" value={archetype} onChange={(e) => setArchetype(e.target.value)} placeholder="e.g. Netrunner Specialist" />
          </div>

          <Input label="Personality Traits (comma separated)" value={traits} onChange={(e) => setTraits(e.target.value)} placeholder="Analytical, Fearless, Secretive" />

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
              Character Backstory & Motivation
            </label>
            <textarea
              value={backstory}
              onChange={(e) => setBackstory(e.target.value)}
              rows={3}
              placeholder="Describe their origin, conflict, and core desires..."
              className="w-full rounded-lg text-xs bg-white dark:bg-dark-800 border border-slate-300 dark:border-slate-700 p-3 text-slate-900 dark:text-slate-100 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2">
            {editingCharacterId && (
              <Button type="button" variant="ghost" onClick={handleCancelEdit}>
                Cancel
              </Button>
            )}
            <Button type="submit" variant="ai-gradient" isLoading={isSaving} leftIcon={<Sparkles className="w-4 h-4" />}>
              {editingCharacterId ? 'Update Persona in Vault' : 'Save Persona to Vault'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Character Vault Display */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider font-mono">
          Character Vault ({characters.length})
        </h2>
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading Character Vault...</div>
        ) : characters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {characters.map((char) => (
              <CharacterCard key={char.id} character={char} onDelete={handleDeleteCharacter} onEdit={handleEditCharacter} />
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center text-xs text-slate-400 space-y-2">
            <p>Your Character Vault is empty.</p>
            <p className="text-slate-500">Forge your first character persona using the form above!</p>
          </Card>
        )}
      </div>
    </div>
  );
};
