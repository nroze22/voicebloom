import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Play,
  Star,
  Trophy,
  TrendingUp,
  Calendar,
  Brain,
  Volume2
} from 'lucide-react';
import PracticeExercise from './PracticeExercise';
import { useTextToSpeech } from '@/lib/hooks/useTextToSpeech';
import { motion, AnimatePresence } from 'framer-motion';

interface Sound {
  id: string;
  name: string;
  description: string;
  progress: number;
  exercises: {
    type: string;
    completed: boolean;
  }[];
}

const sounds: Sound[] = [
  {
    id: 'R',
    name: 'R Sound',
    description: 'Practice the "R" sound in different word positions',
    progress: 0,
    exercises: [
      { type: 'initial', completed: false },
      { type: 'medial', completed: false },
      { type: 'final', completed: false }
    ]
  },
  {
    id: 'S',
    name: 'S Sound',
    description: 'Master the "S" sound with various words',
    progress: 0,
    exercises: [
      { type: 'initial', completed: false },
      { type: 'medial', completed: false },
      { type: 'final', completed: false }
    ]
  },
  {
    id: 'L',
    name: 'L Sound',
    description: 'Learn proper "L" sound pronunciation',
    progress: 0,
    exercises: [
      { type: 'initial', completed: false },
      { type: 'medial', completed: false },
      { type: 'final', completed: false }
    ]
  },
  {
    id: 'TH',
    name: 'TH Sound',
    description: 'Practice both voiced and unvoiced TH sounds',
    progress: 0,
    exercises: [
      { type: 'initial', completed: false },
      { type: 'medial', completed: false },
      { type: 'final', completed: false }
    ]
  }
];

export default function PracticeDashboard() {
  const [selectedSound, setSelectedSound] = useState<string | null>(null);
  const [soundProgress, setSoundProgress] = useState<Record<string, number>>({});
  const [streak, setStreak] = useState(0);
  const [lastPractice, setLastPractice] = useState<Date | null>(null);
  const { speak } = useTextToSpeech();

  useEffect(() => {
    // Load progress from localStorage
    const savedProgress = localStorage.getItem('sound-progress');
    if (savedProgress) {
      setSoundProgress(JSON.parse(savedProgress));
    }

    const savedStreak = localStorage.getItem('practice-streak');
    if (savedStreak) {
      setStreak(parseInt(savedStreak));
    }

    const savedLastPractice = localStorage.getItem('last-practice');
    if (savedLastPractice) {
      setLastPractice(new Date(savedLastPractice));
    }
  }, []);

  const handleExerciseComplete = (results: Record<string, number>) => {
    // Update progress
    const averageProgress = Object.values(results).reduce((a, b) => a + b, 0) / Object.values(results).length;
    const newProgress = {
      ...soundProgress,
      [selectedSound!]: averageProgress
    };
    setSoundProgress(newProgress);
    localStorage.setItem('sound-progress', JSON.stringify(newProgress));

    // Update streak
    const today = new Date();
    if (!lastPractice || today.getDate() !== lastPractice.getDate()) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem('practice-streak', newStreak.toString());
    }

    // Update last practice
    setLastPractice(today);
    localStorage.setItem('last-practice', today.toISOString());
  };

  const playExampleSound = (sound: string) => {
    const examples: Record<string, string> = {
      'R': 'red rabbit runs',
      'S': 'sunny summer sky',
      'L': 'little lamp light',
      'TH': 'think through things'
    };
    speak(examples[sound]);
  };

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
          <Badge variant="outline" className="text-lg">
            Progress: {Math.round(soundProgress[selectedSound] || 0)}%
          </Badge>
        </div>

        <PracticeExercise
          sound={selectedSound}
          onComplete={handleExerciseComplete}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <Trophy className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Streak</div>
              <div className="text-2xl font-bold">{streak} days</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Average Progress</div>
              <div className="text-2xl font-bold">
                {Math.round(
                  Object.values(soundProgress).reduce((a, b) => a + b, 0) /
                  Math.max(Object.values(soundProgress).length, 1)
                )}%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Last Practice</div>
              <div className="text-2xl font-bold">
                {lastPractice ? new Date(lastPractice).toLocaleDateString() : 'Never'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sound Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {sounds.map((sound) => (
            <motion.div
              key={sound.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">{sound.name}</h3>
                    <Badge variant="outline">
                      {Math.round(soundProgress[sound.id] || 0)}% Complete
                    </Badge>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {sound.description}
                  </p>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => setSelectedSound(sound.id)}
                      className="flex-1"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Practice
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => playExampleSound(sound.id)}
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}