import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  Volume2,
  Camera,
  Brain,
  Star,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Gamepad2,
  Book,
  Wand2
} from 'lucide-react';
import InteractivePractice from '@/components/practice/InteractivePractice';
import { useAIAssistant } from '@/lib/hooks/useAIAssistant';
import { useTextToSpeech } from '@/lib/hooks/useTextToSpeech';

const practiceStages = [
  {
    id: 'listen',
    name: 'Listen & Learn',
    icon: Volume2,
    description: 'Hear correct pronunciations',
    color: 'text-blue-500',
    bgColor: 'bg-blue-100 dark:bg-blue-900',
  },
  {
    id: 'watch',
    name: 'Watch & Observe',
    icon: Camera,
    description: 'See proper mouth positions',
    color: 'text-purple-500',
    bgColor: 'bg-purple-100 dark:bg-purple-900',
  },
  {
    id: 'speak',
    name: 'Speak & Practice',
    icon: Mic,
    description: 'Practice with AI feedback',
    color: 'text-green-500',
    bgColor: 'bg-green-100 dark:bg-green-900',
  },
  {
    id: 'play',
    name: 'Play & Learn',
    icon: Gamepad2,
    description: 'Fun learning games',
    color: 'text-orange-500',
    bgColor: 'bg-orange-100 dark:bg-orange-900',
  }
];

const soundCategories = [
  {
    id: 'R',
    name: 'R Sound',
    examples: ['red', 'rain', 'run'],
    difficulty: 2,
  },
  {
    id: 'S',
    name: 'S Sound',
    examples: ['sun', 'see', 'say'],
    difficulty: 1,
  },
  {
    id: 'L',
    name: 'L Sound',
    examples: ['light', 'love', 'life'],
    difficulty: 1,
  },
  {
    id: 'TH',
    name: 'TH Sound',
    examples: ['think', 'three', 'thank'],
    difficulty: 3,
  }
];

export default function PracticeTab() {
  const [selectedSound, setSelectedSound] = useState<string | null>(null);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [lastAnalysis, setLastAnalysis] = useState<any>(null);
  
  const { generateExercises } = useAIAssistant();
  const { speak } = useTextToSpeech();

  const handleAnalysisComplete = async (analysis: any) => {
    setLastAnalysis(analysis);
    try {
      const exercises = await generateExercises(
        selectedSound!,
        'intermediate',
        analysis.accuracy
      );
      console.log('New exercises generated:', exercises);
    } catch (error) {
      console.error('Failed to generate exercises:', error);
    }
  };

  const playExample = (sound: string, example: string) => {
    speak(example);
  };

  if (selectedSound && selectedStage) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => {
              setSelectedStage(null);
              setLastAnalysis(null);
            }}
          >
            ← Back to Stages
          </Button>
          <Badge variant="secondary" className="text-lg">
            Practicing "{selectedSound}" Sound
          </Badge>
        </div>

        <InteractivePractice
          targetSound={selectedSound}
          currentWord="rain"
          difficulty={2}
          onAnalysisComplete={handleAnalysisComplete}
        />
      </div>
    );
  }

  if (selectedSound) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setSelectedSound(null)}
          >
            ← Back to Sounds
          </Button>
          <Badge variant="secondary" className="text-lg">
            {soundCategories.find(s => s.id === selectedSound)?.name}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {practiceStages.map((stage) => (
            <motion.div
              key={stage.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedStage(stage.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-xl ${stage.bgColor}`}>
                      <stage.icon className={`h-6 w-6 ${stage.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{stage.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {stage.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <Wand2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Speech Journey</h2>
              <p className="text-sm text-muted-foreground">
                Choose a sound to practice
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {soundCategories.map((sound) => (
              <motion.div
                key={sound.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedSound(sound.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold">{sound.name}</h3>
                      <Badge variant="secondary">
                        Level {sound.difficulty}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {sound.examples.map((example) => (
                        <Button
                          key={example}
                          variant="outline"
                          size="sm"
                          className="text-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            playExample(sound.id, example);
                          }}
                        >
                          <Volume2 className="h-3 w-3 mr-1" />
                          {example}
                        </Button>
                      ))}
                    </div>

                    <Progress value={33} className="h-2" />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}