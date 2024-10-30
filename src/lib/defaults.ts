import type { UserSettings, Progress, SoundStage } from '@/lib/types';

export const defaultSettings: UserSettings = {
  apiKey: '',
  groqApiKey: '',
  voicePreference: 'default',
  speechRate: 1,
  difficulty: 'beginner',
  focusSounds: ['R', 'S', 'L', 'TH'],
  dailyGoalMinutes: 15,
  notifications: true,
  textSize: 'medium',
  highContrast: false,
  preferredModel: 'openai',
};

export const defaultProgress: Progress = {
  accuracy: 0,
  fluency: 0,
  consistency: 0,
  practiceStreak: 0,
  lastPractice: new Date(),
  minutesPracticed: 0,
  soundsMastered: [],
  currentChallenges: [],
};

export const initialSoundStages: SoundStage[] = [
  {
    id: 'listen-learn',
    name: 'Listen & Learn',
    description: 'Master the correct sound pronunciation',
    complete: false,
    exercises: [
      {
        id: 'basic-sounds',
        type: 'listen',
        title: 'Basic Sound Recognition',
        description: 'Listen and identify correct pronunciations',
        difficulty: 1,
        words: ['rain', 'red', 'run'],
        completed: false,
      },
      {
        id: 'sound-pairs',
        type: 'listen',
        title: 'Sound Pairs',
        description: 'Compare correct and incorrect pronunciations',
        difficulty: 1,
        words: ['right/light', 'rain/lane', 'read/lead'],
        completed: false,
      },
    ],
  },
  {
    id: 'visual-cues',
    name: 'Visual Learning',
    description: 'Watch and learn proper mouth positioning',
    complete: false,
    exercises: [
      {
        id: 'mouth-position',
        type: 'watch',
        title: 'Mouth Position Guide',
        description: 'Learn the correct tongue and lip placement',
        difficulty: 1,
        words: [],
        completed: false,
      },
    ],
  },
  {
    id: 'practice-speak',
    name: 'Practice Speaking',
    description: 'Practice with AI-guided feedback',
    complete: false,
    exercises: [
      {
        id: 'single-words',
        type: 'speak',
        title: 'Single Word Practice',
        description: 'Practice with simple words',
        difficulty: 1,
        words: ['red', 'run', 'rain'],
        completed: false,
      },
      {
        id: 'phrases',
        type: 'speak',
        title: 'Phrase Practice',
        description: 'Practice with short phrases',
        difficulty: 2,
        words: ['red rabbit', 'running river', 'rainy road'],
        completed: false,
      },
    ],
  },
  {
    id: 'game-practice',
    name: 'Fun Games',
    description: 'Practice through interactive games',
    complete: false,
    exercises: [
      {
        id: 'word-match',
        type: 'game',
        title: 'Word Matching',
        description: 'Match words with similar sounds',
        difficulty: 1,
        words: ['red/read', 'right/write', 'race/raise'],
        completed: false,
      },
    ],
  },
];