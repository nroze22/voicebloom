import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PlayCircle, Mic, Camera } from 'lucide-react';
import type { Exercise } from '@/lib/types';

interface ExerciseCardProps {
  exercise: Exercise;
  onStart: (exerciseId: string) => void;
  onComplete: (exerciseId: string) => void;
}

export function ExerciseCard({ exercise, onStart, onComplete }: ExerciseCardProps) {
  const getIcon = () => {
    switch (exercise.type) {
      case 'listen':
        return <PlayCircle className="h-6 w-6" />;
      case 'watch':
        return <Camera className="h-6 w-6" />;
      case 'speak':
        return <Mic className="h-6 w-6" />;
      default:
        return null;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
            {getIcon()}
          </div>
          <div>
            <h3 className="font-semibold text-lg">{exercise.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {exercise.description}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span>Difficulty</span>
            <div className="flex gap-1">
              {[1, 2, 3].map((level) => (
                <div
                  key={level}
                  className={`w-2 h-2 rounded-full ${
                    level <= exercise.difficulty
                      ? 'bg-blue-500'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              ))}
            </div>
          </div>

          <Progress value={exercise.completed ? 100 : 0} />

          <div className="flex gap-2">
            <Button
              className="flex-1"
              onClick={() => onStart(exercise.id)}
              variant={exercise.completed ? 'outline' : 'default'}
            >
              {exercise.completed ? 'Practice Again' : 'Start Exercise'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}