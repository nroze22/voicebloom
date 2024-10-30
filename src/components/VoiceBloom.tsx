import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, 
  Volume2,
  Brain,
  MessageSquare,
  Trophy,
  Trees,
  Star,
  Clock,
  PlayCircle,
  Camera,
  CheckCircle2,
  Settings,
  Sparkles,
  Gamepad2,
  GraduationCap,
  Stethoscope
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PracticeTab from '@/components/tabs/PracticeTab';
import CommunicateTab from '@/components/tabs/CommunicateTab';
import ProgressTab from '@/components/tabs/ProgressTab';
import SettingsDialog from '@/components/settings/SettingsDialog';
import { useSettingsStore } from '@/lib/store/settings';
import { defaultProgress } from '@/lib/defaults';
import { initialSoundStages } from '@/lib/defaults';

export default function VoiceBloom() {
  const [showSettings, setShowSettings] = useState(false);
  const settings = useSettingsStore();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b z-20">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trees className="h-8 w-8 text-green-600 dark:text-green-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                VoiceBloom
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 hidden sm:flex"
                onClick={() => window.open('https://openai.com/blog/chatgpt', '_blank')}
              >
                <Brain className="h-4 w-4" />
                Powered by AI
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setShowSettings(true)}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 pb-32">
        <Tabs defaultValue="practice" className="space-y-8">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="practice" className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              <span className="hidden sm:inline">Practice</span>
            </TabsTrigger>
            <TabsTrigger value="communicate" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Communicate</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">Progress</span>
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="practice">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <PracticeTab />
              </motion.div>
            </TabsContent>

            <TabsContent value="communicate">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <CommunicateTab settings={settings} />
              </motion.div>
            </TabsContent>

            <TabsContent value="progress">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <ProgressTab 
                  progress={defaultProgress} 
                  stages={initialSoundStages} 
                />
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold">AI-Powered</h3>
                <p className="text-sm text-muted-foreground">Smart feedback & analysis</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <Gamepad2 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold">Fun Learning</h3>
                <p className="text-sm text-muted-foreground">Interactive exercises & games</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
                <GraduationCap className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold">Expert Guidance</h3>
                <p className="text-sm text-muted-foreground">Professional therapy methods</p>
              </div>
            </div>
          </Card>
        </div>
      </main>

      {/* Settings Dialog */}
      <SettingsDialog 
        open={showSettings} 
        onOpenChange={setShowSettings} 
      />
    </div>
  );
}