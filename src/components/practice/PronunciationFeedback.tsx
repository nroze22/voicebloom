import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Brain,
  ThumbsUp,
  AlertTriangle,
  ArrowRight,
  Target,
  Waveform
} from 'lucide-react';

interface PronunciationFeedbackProps {
  analysis: {
    scores: {
      overall: number;
      pronunciation: number;
      fluency: number;
      rhythm: number;
    };
    feedback: {
      strengths: string[];
      improvements: string[];
      nextSteps: string[];
    };
    phonetic: {
      phonemes: {
        target: string;
        actual: string;
        accuracy: number;
        position: string;
      }[];
    };
  };
}

export default function PronunciationFeedback({ analysis }: PronunciationFeedbackProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-4"
      >
        {/* Overall Score */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Analysis Results</h3>
              </div>
              <Badge variant={analysis.scores.overall >= 85 ? 'success' : 'secondary'}>
                {Math.round(analysis.scores.overall)}% Overall
              </Badge>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Pronunciation</span>
                  <span>{Math.round(analysis.scores.pronunciation)}%</span>
                </div>
                <Progress value={analysis.scores.pronunciation} />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Fluency</span>
                  <span>{Math.round(analysis.scores.fluency)}%</span>
                </div>
                <Progress value={analysis.scores.fluency} />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Rhythm</span>
                  <span>{Math.round(analysis.scores.rhythm)}%</span>
                </div>
                <Progress value={analysis.scores.rhythm} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Feedback */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <ThumbsUp className="h-5 w-5 text-green-500" />
                <h3 className="font-semibold">Strengths</h3>
              </div>
              <ul className="space-y-2">
                {analysis.feedback.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-1 flex-shrink-0" />
                    <span className="text-sm">{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <h3 className="font-semibold">Areas to Improve</h3>
              </div>
              <ul className="space-y-2">
                {analysis.feedback.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-1 flex-shrink-0" />
                    <span className="text-sm">{improvement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Phonetic Analysis */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Waveform className="h-5 w-5 text-blue-500" />
              <h3 className="font-semibold">Phonetic Details</h3>
            </div>
            <div className="space-y-3">
              {analysis.phonetic.phonemes.map((phoneme, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <span className="font-mono">{phoneme.target}</span>
                    {' → '}
                    <span className="font-mono">{phoneme.actual}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      ({phoneme.position})
                    </span>
                  </div>
                  <Badge variant={phoneme.accuracy >= 85 ? 'success' : 'secondary'}>
                    {Math.round(phoneme.accuracy)}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-purple-500" />
              <h3 className="font-semibold">Next Steps</h3>
            </div>
            <ul className="space-y-2">
              {analysis.feedback.nextSteps.map((step, index) => (
                <li key={index} className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 mt-1 flex-shrink-0" />
                  <span className="text-sm">{step}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}