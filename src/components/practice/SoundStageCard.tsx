import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Wand2 } from 'lucide-react';
import type { SoundStage } from '@/lib/types';

interface SoundStageCardProps {
  stage: SoundStage;
  onSelect: (stageId: string) => void;
  isActive: boolean;
}

export function SoundStageCard({ stage, onSelect, isActive }: SoundStageCardProps) {
  return (
    <Card 
      className={`
        cursor-pointer transition-all duration-300
        ${isActive ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}
        ${stage.complete ? 'bg-green-50 dark:bg-green-900/50' : 'bg-white/50 dark:bg-gray-800/50'}
      `}
      onClick={() => onSelect(stage.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center
            ${stage.complete ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-gray-700'}
          `}>
            {stage.complete ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <Wand2 className="h-5 w-5" />
            )}
          </div>
          <div className="flex-1">
            <div className="font-medium flex items-center justify-between">
              {stage.name}
              <Badge variant="secondary" className="ml-2">
                {stage.exercises.length} exercises
              </Badge>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {stage.description}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}