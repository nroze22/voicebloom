import { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, 
  Volume2, 
  Camera,
  XCircle,
  AlertCircle,
  CheckCircle2,
  Brain,
  Sparkles,
  Play,
  Pause
} from 'lucide-react';
import { useAudioRecorder } from '@/lib/hooks/useAudioRecorder';
import { useTextToSpeech } from '@/lib/hooks/useTextToSpeech';
import { useAITherapist } from '@/lib/hooks/useAITherapist';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import AudioVisualizer from './AudioVisualizer';

interface InteractivePracticeProps {
  targetSound: string;
  currentWord: string;
  difficulty: number;
  onAnalysisComplete?: (result: any) => void;
}

export default function InteractivePractice({ 
  targetSound,
  currentWord,
  difficulty,
  onAnalysisComplete 
}: InteractivePracticeProps) {
  const [showMouthPosition, setShowMouthPosition] = useState(false);
  const [visualFeedback, setVisualFeedback] = useState<'success' | 'error' | null>(null);
  const [showTip, setShowTip] = useState(true);
  
  const { speak, isSpeaking } = useTextToSpeech();
  const { analyzeSpeech, isAnalyzing } = useAITherapist();
  const { 
    isRecording,
    audioLevel,
    duration,
    startRecording,
    stopRecording
  } = useAudioRecorder({
    visualizerOptions: {
      fftSize: 256,
      smoothingTimeConstant: 0.8
    }
  });

  const handleStartRecording = useCallback(async () => {
    if (isRecording) {
      const audioBlob = await stopRecording();
      try {
        const analysis = await analyzeSpeech(audioBlob, targetSound);
        setVisualFeedback(analysis.accuracy >= 85 ? 'success' : 'error');
        onAnalysisComplete?.(analysis);

        if (analysis.accuracy >= 85) {
          toast.success("Excellent pronunciation!", {
            description: "You're making great progress!",
            icon: <Sparkles className="h-4 w-4 text-yellow-500" />
          });
        } else {
          toast.info("Let's try again!", {
            description: "Focus on the feedback and keep practicing.",
            icon: <Brain className="h-4 w-4 text-blue-500" />
          });
        }
      } catch (error) {
        toast.error("Oops! Something went wrong.", {
          description: "Please try recording again.",
        });
      }
    } else {
      setShowTip(false);
      await startRecording();
    }
  }, [isRecording, stopRecording, startRecording, analyzeSpeech, targetSound, onAnalysisComplete]);

  const playExample = useCallback(() => {
    speak(currentWord, {
      onEnd: () => {
        toast.success("Now it's your turn!", {
          description: "Try to match the pronunciation.",
          icon: <Mic className="h-4 w-4" />
        });
      }
    });
  }, [currentWord, speak]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="relative overflow-hidden">
        <CardContent className="p-6 space-y-6">
          {/* Current Word Display */}
          <div className="text-center space-y-2">
            <motion.h2 
              className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              {currentWord}
            </motion.h2>
            <Badge variant="secondary" className="text-lg">
              Difficulty: {Array(difficulty).fill('★').join('')}
            </Badge>
          </div>

          {/* Practice Tip */}
          <AnimatePresence>
            {showTip && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <Brain className="h-5 w-5 text-blue-500 mt-1" />
                  <div>
                    <h4 className="font-medium mb-1">Practice Tip</h4>
                    <p className="text-sm text-muted-foreground">
                      Listen to the correct pronunciation first, then try to match it.
                      Focus on the "{targetSound}" sound!
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Audio Visualization */}
          <AnimatePresence>
            {isRecording && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <AudioVisualizer 
                  audioLevel={audioLevel} 
                  isRecording={isRecording} 
                />
                <div className="text-center text-sm text-muted-foreground mt-2">
                  Recording: {(duration / 1000).toFixed(1)}s
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Practice Controls */}
          <div className="grid grid-cols-3 gap-4">
            <Button
              variant="outline"
              className={`h-24 flex flex-col items-center justify-center gap-2 ${
                isSpeaking ? 'border-primary' : ''
              }`}
              onClick={playExample}
              disabled={isRecording || isAnalyzing}
            >
              {isSpeaking ? (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <Volume2 className="h-6 w-6 text-primary" />
                </motion.div>
              ) : (
                <Volume2 className="h-6 w-6" />
              )}
              <span>Listen</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2"
              onClick={() => setShowMouthPosition(!showMouthPosition)}
              disabled={isRecording || isAnalyzing}
            >
              <Camera className="h-6 w-6" />
              <span>View Position</span>
            </Button>
            
            <Button
              variant={isRecording ? 'destructive' : 'outline'}
              className={`h-24 flex flex-col items-center justify-center gap-2 ${
                isRecording ? 'animate-pulse' : ''
              }`}
              onClick={handleStartRecording}
              disabled={isAnalyzing || isSpeaking}
            >
              {isRecording ? (
                <>
                  <Pause className="h-6 w-6" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Mic className="h-6 w-6" />
                  <span>Record</span>
                </>
              )}
            </Button>
          </div>

          {/* Processing State */}
          {isAnalyzing && (
            <div className="text-center space-y-2">
              <Progress value={undefined} className="w-full" />
              <p className="text-sm text-muted-foreground animate-pulse">
                Analyzing your pronunciation...
              </p>
            </div>
          )}

          {/* Visual Feedback */}
          <AnimatePresence>
            {visualFeedback && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`text-6xl ${
                    visualFeedback === 'success' ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {visualFeedback === 'success' ? (
                    <CheckCircle2 className="h-24 w-24" />
                  ) : (
                    <AlertCircle className="h-24 w-24" />
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mouth Position Overlay */}
          <AnimatePresence>
            {showMouthPosition && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute inset-0 bg-white dark:bg-gray-900 p-6"
              >
                <div className="relative h-full">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-0 right-0"
                    onClick={() => setShowMouthPosition(false)}
                  >
                    <XCircle className="h-5 w-5" />
                  </Button>
                  
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <motion.div 
                      className="w-64 h-64 mb-4 bg-muted rounded-full flex items-center justify-center"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <span className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                        {targetSound}
                      </span>
                    </motion.div>
                    <h3 className="text-lg font-semibold mb-2">
                      Mouth Position for "{targetSound}"
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      {targetSound === 'R' ? 
                        'Curl your tongue back slightly without touching the roof of your mouth.' :
                       targetSound === 'S' ? 
                        'Place your tongue behind your top teeth and let air flow.' :
                       targetSound === 'L' ? 
                        'Touch the tip of your tongue to the ridge behind your top teeth.' :
                        'Position your tongue as shown in the diagram.'}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}