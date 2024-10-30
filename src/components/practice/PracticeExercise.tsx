import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Mic,
  Volume2,
  Camera,
  Brain,
  Star,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import InteractivePractice from './InteractivePractice';
import { useAITherapist } from '@/lib/hooks/useAITherapist';
import { useTextToSpeech } from '@/lib/hooks/useTextToSpeech';
import { toast } from 'sonner';

const practiceWords = {
  'R': [
    { word: 'red', difficulty: 1 },
    { word: 'rain', difficulty: 1 },
    { word: 'rabbit', difficulty: 2 },
    { word: 'river', difficulty: 2 },
    { word: 'rainbow', difficulty: 3 }
  ],
  'S': [
    { word: 'sun', difficulty: 1 },
    { word: 'sand', difficulty: 1 },
    { word: 'sister', difficulty: 2 },
    { word: 'sunset', difficulty: 2 },
    { word: 'sunshine', difficulty: 3 }
  ],
  'L': [
    { word: 'light', difficulty: 1 },
    { word: 'love', difficulty: 1 },
    { word: 'letter', difficulty: 2 },
    { word: 'ladder', difficulty: 2 },
    { word: 'lightning', difficulty: 3 }
  ],
  'TH': [
    { word: 'thin', difficulty: 1 },
    { word: 'think', difficulty: 1 },
    { word: 'thunder', difficulty: 2 },
    { word: 'therapy', difficulty: 2 },
    { word: 'thousand', difficulty: 3 }
  ]
};

interface PracticeExerciseProps {
  sound: string;
  onComplete: (results: any) => void;
}

export default function PracticeExercise({ sound, onComplete }: PracticeExerciseProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [currentTab, setCurrentTab] = useState('practice');
  const [lastAnalysis, setLastAnalysis] = useState<any>(null);
  const [streak, setStreak] = useState(0);

  const words = practiceWords[sound as keyof typeof practiceWords] || [];
  const currentWord = words[currentWordIndex];

  const { speak } = useTextToSpeech();
  const { analyzeSpeech } = useAITherapist();

  useEffect(() => {
    // Load progress from localStorage
    const savedProgress = localStorage.getItem(`practice-progress-${sound}`);
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, [sound]);

  const handleAnalysisComplete = (analysis: any) => {
    setLastAnalysis(analysis);
    
    // Update progress
    const newProgress = {
      ...progress,
      [currentWord.word]: analysis.accuracy
    };
    setProgress(newProgress);
    localStorage.setItem(`practice-progress-${sound}`, JSON.stringify(newProgress));

    // Update streak
    if (analysis.accuracy >= 85) {
      setStreak(prev => prev + 1);
      if (streak + 1 >= 3) {
        toast.success("Amazing streak! You're mastering this sound!");
      }
    } else {
      setStreak(0);
    }

    // Show success/failure feedback
    if (analysis.accuracy >= 85) {
      toast.success("Great pronunciation! Keep going!");
    } else {
      toast.info("Let's try that again. Focus on the feedback.");
    }

    // Move to next word if accuracy is good enough
    if (analysis.accuracy >= 85 && currentWordIndex < words.length - 1) {
      setTimeout(() => {
        setCurrentWordIndex(prev => prev + 1);
        setLastAnalysis(null);
      }, 2000);
    }

    // Complete exercise if all words are done well
    if (currentWordIndex === words.length - 1 && analysis.accuracy >= 85) {
      setTimeout(() => {
        setShowResults(true);
        onComplete(newProgress);
      }, 2000);
    }
  };

  const resetExercise = () => {
    setCurrentWordIndex(0);
    setLastAnalysis(null);
    setShowResults(false);
    setStreak(0);
  };

  return (
    <div className="space-y-6">
      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="practice">Practice</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="practice" className="space-y-4">
          {!showResults ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <Badge variant="outline" className="text-lg">
                  Word {currentWordIndex + 1} of {words.length}
                </Badge>
                <Badge variant="secondary" className="text-lg">
                  Streak: {streak}
                </Badge>
              </div>

              <InteractivePractice
                targetSound={sound}
                currentWord={currentWord.word}
                difficulty={currentWord.difficulty}
                onAnalysisComplete={handleAnalysisComplete}
              />

              {lastAnalysis && (
                <Card className="mt-4">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold">Analysis Results</h3>
                        <Badge variant={lastAnalysis.accuracy >= 85 ? 'success' : 'secondary'}>
                          {Math.round(lastAnalysis.accuracy)}% Accuracy
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        {lastAnalysis.feedback.map((feedback: string, index: number) => (
                          <div key={index} className="flex items-start gap-2">
                            <ArrowRight className="h-4 w-4 mt-1 flex-shrink-0" />
                            <p className="text-sm">{feedback}</p>
                          </div>
                        ))}
                      </div>

                      {lastAnalysis.suggestions.length > 0 && (
                        <div className="bg-muted p-3 rounded-lg">
                          <h4 className="font-medium mb-2">Suggestions</h4>
                          <ul className="space-y-1">
                            {lastAnalysis.suggestions.map((suggestion: string, index: number) => (
                              <li key={index} className="text-sm">• {suggestion}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Exercise Complete!</h2>
                <p className="text-gray-600 mb-4">
                  You've successfully practiced all words for the "{sound}" sound.
                </p>
                <Button onClick={resetExercise}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Practice Again
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="progress">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Word Progress</h3>
              <div className="space-y-4">
                {words.map((word, index) => (
                  <div key={word.word} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{word.word}</span>
                      <Badge variant="outline">
                        {progress[word.word] ? `${Math.round(progress[word.word])}%` : 'Not Started'}
                      </Badge>
                    </div>
                    <Progress
                      value={progress[word.word] || 0}
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}