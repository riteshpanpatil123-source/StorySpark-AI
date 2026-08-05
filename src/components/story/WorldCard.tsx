import React from 'react';
import { Globe, Shield } from 'lucide-react';
import { World } from '@/types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

export interface WorldCardProps {
  world: World;
}

export const WorldCard: React.FC<WorldCardProps> = ({ world }) => {
  return (
    <Card className="flex flex-col space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Globe className="w-4 h-4" />
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 font-display">
            {world.name}
          </h4>
        </div>
        <Badge variant="emerald" size="sm">{world.genre}</Badge>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
        {world.description}
      </p>

      {world.rules && (
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
          <span className="font-semibold text-slate-300">Ruleset: </span>
          <span className="italic">{world.rules}</span>
        </div>
      )}
    </Card>
  );
};
