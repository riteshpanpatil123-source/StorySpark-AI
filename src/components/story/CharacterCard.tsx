import React from 'react';
import { User, Sparkles } from 'lucide-react';
import { Character } from '@/types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Avatar } from '../common/Avatar';

export interface CharacterCardProps {
  character: Character;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => {
  return (
    <Card className="flex flex-col space-y-4">
      <div className="flex items-center gap-3">
        <Avatar name={character.name} src={character.avatarUrl} size="lg" />
        <div>
          <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 font-display">
            {character.name}
          </h4>
          <Badge variant="cyan" size="sm">
            {character.archetype}
          </Badge>
        </div>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
        {character.backstory}
      </p>

      <div className="flex flex-wrap gap-1">
        {character.personalityTraits.map((trait, idx) => (
          <span
            key={idx}
            className="text-[10px] px-2 py-0.5 rounded bg-brand-500/10 text-brand-500 font-medium"
          >
            {trait}
          </span>
        ))}
      </div>
    </Card>
  );
};
