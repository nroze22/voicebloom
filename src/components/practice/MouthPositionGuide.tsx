import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  XCircle,
  Info,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Volume2
} from 'lucide-react';
import { mouthPositions } from '@/lib/data/mouth-positions';
import { useTextToSpeech } from '@/lib/hooks/useTextToSpeech';

interface MouthPositionGuideProps {
  sound: string;
  onClose: () => void;
}

export default function MouthPositionGuide({ sound, onClose }: MouthPositionGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { speak } = useTextToSpeech();
  const position = mouthPositions[sound as keyof typeof mouthPositions];

  const steps = position.description.trim().split('\n').map(step => step.trim());

  const playExample = (word: string) => {
    speak(word, {
      rate: 0.8, // Slightly slower for clarity
      onEnd: () => {
        // Optional: Show a visual cue that the word has been spoken
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">
                "{sound}" Sound Position Guide
              </h2>
              <p className="text-muted-foreground">
                Follow these steps to make the perfect sound
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <XCircle className="h-5 w-5" />
            </Button>
          </div>

          {/* Step-by-Step Guide */}
          <div className="space-y-4 mb-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border ${
                  currentStep === index ? 'bg-primary/5 border-primary' : 'bg-muted/50'
                }`}
                onClick={() => setCurrentStep(index)}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep === index ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{step}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Tips Section */}
          <div className="space-y-4 mb-6">
            <h3 className="font-semibold flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-500" />
              Helpful Tips
            </h3>
            <div className="grid gap-2">
              {position.tips.map((tip, index) => (
                <div key={index} className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 mt-1 flex-shrink-0 text-green-500" />
                  <span className="text-sm">{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Common Mistakes */}
          <div className="space-y-4 mb-6">
            <h3 className="font-semibold flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              Watch Out For
            </h3>
            <div className="grid gap-2">
              {position.common_mistakes.map((mistake, index) => (
                <div key={index} className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 mt-1 flex-shrink-0 text-yellow-500" />
                  <span className="text-sm">{mistake}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Practice Words */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Practice Words
            </h3>
            <div className="flex flex-wrap gap-2">
              {position.practice_words.map((item, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => playExample(item.word)}
                >
                  <Volume2 className="h-3 w-3" />
                  <span>{item.word}</span>
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {item.position}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}