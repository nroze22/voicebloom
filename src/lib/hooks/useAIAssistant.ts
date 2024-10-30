import { useState, useCallback } from 'react';
import { OpenAI } from 'openai';
import { toast } from '@/components/ui/use-toast';
import { useSettingsStore } from '@/lib/store/settings';

interface ExerciseGeneration {
  exercises: Array<{
    name: string;
    description: string;
    words: string[];
    phrases: string[];
    activity: string;
    tips: string[];
    difficulty: number;
  }>;
  nextSteps: string[];
  adaptiveSuggestions: string[];
}

interface PhraseGeneration {
  phrases: Array<{
    text: string;
    category: string;
    context: string;
    imagePrompt?: string;
  }>;
  suggestions: string[];
}

export function useAIAssistant() {
  const { apiKey, preferredModel } = useSettingsStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openai = apiKey ? new OpenAI({ apiKey, dangerouslyAllowBrowser: true }) : null;

  const generateExercises = useCallback(async (
    sound: string,
    level: string,
    previousPerformance?: number
  ): Promise<ExerciseGeneration> => {
    if (!openai) {
      toast({
        title: 'API Key Required',
        description: 'Please add your API key in settings to use AI features.',
        variant: 'destructive'
      });
      throw new Error('No API client initialized');
    }

    try {
      setIsProcessing(true);
      const prompt = `Generate personalized speech therapy exercises for the "${sound}" sound at ${level} level.
      ${previousPerformance ? `Previous performance: ${previousPerformance}%` : ''}
      Include:
      - 5 engaging exercises with varying difficulty
      - Target words and phrases
      - Fun, age-appropriate activities
      - Visual cues and mouth positioning tips
      - Adaptive suggestions based on performance
      Format as JSON with exercises array and additional guidance.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'system', content: prompt }],
        response_format: { type: 'json_object' }
      });
      
      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (err) {
      setError('Failed to generate exercises');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [openai]);

  const generatePhrases = useCallback(async (context: string): Promise<PhraseGeneration> => {
    if (!openai) {
      toast({
        title: 'API Key Required',
        description: 'Please add your API key in settings to use AI features.',
        variant: 'destructive'
      });
      throw new Error('No API client initialized');
    }

    try {
      setIsProcessing(true);
      const prompt = `Generate contextually relevant AAC phrases for: "${context}"
      Consider:
      - Age-appropriate language
      - Common daily situations
      - Social interactions
      - Emotional expression
      Format as JSON with phrases array including category and context.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'system', content: prompt }],
        response_format: { type: 'json_object' }
      });
      
      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (err) {
      setError('Failed to generate phrases');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [openai]);

  return {
    generateExercises,
    generatePhrases,
    isProcessing,
    error
  };
}