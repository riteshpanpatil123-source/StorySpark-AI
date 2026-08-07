import React, { useState, useEffect } from 'react';
import { User, Sparkles, Wand2 } from 'lucide-react';
import { CharacterCard } from '@/components/story/CharacterCard';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { MockDataService } from '@/services/mockDataService';
import { Character } from '@/types';
import toast from 'react-hot-toast';

export const CharacterBuilderPage: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [name, setName] = useState('Valerie Thorne');
  const [archetype, setArchetype] = useState('Netrunner Specialist');
  const [traits, setTraits] = useState('Analytical, Fearless, Secretive');
  const [backstory, setBackstory] = useState('An elite cyber operator who unlocked corporate encryption key archives.');

  useEffect(() => {
    setCharacters(MockDataService.getCharacters());
  }, []);

  const handleCreateCharacter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const created = MockDataService.saveCharacter({
      name,
      archetype,
      personalityTraits: traits.split(',').map((t) => t.trim()),
      backstory,
      isPublic: true,
    });

    setCharacters([created, ...characters]);
    toast.success(`Character persona "${name}" forged!`);
    setName('');
    setBackstory('');
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

      {/* Creation Form */}
      <Card className="p-6 glass-panel border-purple-500/20 space-y-4">
        <h2 className="text-base font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Wand2 className="w-4 h-4 text-purple-500" />
          <span>Forge New Character Persona</span>
        </h2>

        <form onSubmit={handleCreateCharacter} className="space-y-4">
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

          <div className="flex justify-end">
            <Button type="submit" variant="ai-gradient" leftIcon={<Sparkles className="w-4 h-4" />}>
              Save Persona to Vault
            </Button>
          </div>
        </form>
      </Card>

      {/* Character Vault Display */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider font-mono">
          Character Vault ({characters.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {characters.map((char) => (
            <CharacterCard key={char.id} character={char} />
          ))}
        </div>
      </div>
    </div>
  );
};
