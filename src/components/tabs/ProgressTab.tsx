import { Card } from '@/components/ui/card';
import { ProgressStats } from '@/components/progress/ProgressStats';
import type { Progress, SoundStage } from '@/lib/types';

interface ProgressTabProps {
  progress: Progress;
  stages: SoundStage[];
}

export default function ProgressTab({ progress, stages }: ProgressTabProps) {
  const completedStages = stages.filter(stage => stage.complete).length;
  const completionPercentage = (completedStages / stages.length) * 100;

  return (
    <div className="space-y-6">
      <ProgressStats progress={progress} />
      
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {progress.currentChallenges.map((challenge, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 border-b last:border-0"
            >
              <span>{challenge}</span>
              <span className="text-sm text-gray-500">In Progress</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}