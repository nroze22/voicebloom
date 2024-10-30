export type Theme = 'dark' | 'light' | 'system';

export type SoundStage = {
  id: string;
  name: string;
  description: string;
  complete: boolean;
  exercises: Exercise[];
};

export type Exercise = {
  id: string;
  type: 'listen' | 'watch' | 'speak' | 'game';
  title: string;
  description: string;
  difficulty: 1 | 2 | 3;
  words: string[];
  completed: boolean;
};

export type CommunicationCategory = {
  id: string;
  name: string;
  icon: string;
  color: string;
  phrases: Phrase[];
};

export type Phrase = {
  id: string;
  text: string;
  imageUrl?: string;
  usageCount: number;
};

export type Progress = {
  accuracy: number;
  fluency: number;
  consistency: number;
  practiceStreak: number;
  lastPractice: Date;
  minutesPracticed: number;
  soundsMastered: string[];
  currentChallenges: string[];
};

export type AIFeedback = {
  pronunciation: number;
  clarity: number;
  rhythm: number;
  suggestions: string[];
  encouragement: string;
};

export type UserSettings = {
  apiKey: string;
  groqApiKey: string;
  voicePreference: string;
  speechRate: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  focusSounds: string[];
  dailyGoalMinutes: number;
  notifications: boolean;
  textSize: 'small' | 'medium' | 'large';
  highContrast: boolean;
  preferredModel: 'openai' | 'groq';
};