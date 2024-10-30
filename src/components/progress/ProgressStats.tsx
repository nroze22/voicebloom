import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, Calendar, Clock, Star } from 'lucide-react';
import type { Progress as ProgressType } from '@/lib/types';

interface ProgressStatsProps {
  progress: ProgressType;
}

export function ProgressStats({ progress }: ProgressStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Overall Progress
            </h3>
            <span className="text-2xl font-bold">
              {Math.round((progress.accuracy + progress.fluency + progress.consistency) / 3)}%
            </span>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Accuracy</span>
                <span>{progress.accuracy}%</span>
              </div>
              <Progress value={progress.accuracy} />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Fluency</span>
                <span>{progress.fluency}%</span>
              </div>
              <Progress value={progress.fluency} />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Consistency</span>
                <span>{progress.consistency}%</span>
              </div>
              <Progress value={progress.consistency} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Practice Streak</div>
                <div className="text-2xl font-bold">{progress.practiceStreak} days</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Time Practiced</div>
                <div className="text-2xl font-bold">{progress.minutesPracticed} mins</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
                <Star className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Sounds Mastered</div>
                <div className="text-2xl font-bold">{progress.soundsMastered.length}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}