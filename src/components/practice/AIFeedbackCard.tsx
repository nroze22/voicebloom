import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Brain,
  ThumbsUp,
  Lightbulb,
  ArrowRight,
  Target
} from 'lucide-react';

interface AIFeedbackCardProps {
  analysis: {
    accuracy: number;
    feedback: string;
    suggestions: string[];
    nextSteps: string[];
  };
  onExerciseSelect: (exercise: string) => void;
}

export function AIFeedbackCard({ analysis, onExerciseSelect }: AIFeedbackCardProps) {
  return (
    <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-5 w-5 text-purple-500" />
          <h3 className="font-semibold">AI Speech Analysis</h3>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Pronunciation Accuracy</div>
            <Progress value={analysis.accuracy} className="h-2" />
          </div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {analysis.accuracy}%
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white/50 dark:bg-white/5 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <ThumbsUp className="h-4 w-4 text-green-500" />
              <span className="font-medium">Feedback</span>
            </div>
            <p className="text-gray-700 dark:text-gray-300">{analysis.feedback}</p>
          </div>

          <div className="bg-white/50 dark:bg-white/5 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              <span className="font-medium">Suggestions</span>
            </div>
            <ul className="space-y-2">
              {analysis.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 mt-1 flex-shrink-0" />
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white/50 dark:bg-white/5 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-blue-500" />
              <span className="font-medium">Next Steps</span>
            </div>
            <div className="grid gap-2">
              {analysis.nextSteps.map((step, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start"
                  onClick={() => onExerciseSelect(step)}
                >
                  {step}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}