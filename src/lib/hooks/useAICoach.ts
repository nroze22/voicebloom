import { useState, useCallback } from 'react';
import { OpenAI } from 'openai';
import { toast } from 'sonner';
import type { AIFeedback } from '@/lib/types';

const COACHING_PROMPT = `You are an expert speech therapist specializing in helping children improve their pronunciation. 
Analyze the following speech sample focusing on the target sound.

Consider:
- Precise phonetic accuracy
- Age-appropriate feedback
- Positive reinforcement
- Specific, actionable tips
- Engaging, encouraging tone

Provide feedback that includes:
1. Overall assessment
2. Specific strengths
3. Areas for improvement
4. Fun practice suggestions
5. Encouragement for next attempt

Format response as JSON with properties:
- accuracy (0-100)
- feedback (array of observations)
- suggestions (array of practice tips)
- encouragement (motivational message)
- nextSteps (array of recommended exercises)`;

export function useAICoach(apiKey: string) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastFeedback, setLastFeedback] = useState<AIFeedback | null>(null);

  const openai = apiKey ? new OpenAI({ apiKey, dangerouslyAllowBrowser: true }) : null;

  const analyzeSpeech = useCallback(async (
    audioBlob: Blob,
    targetSound: string,
    currentWord: string,
    difficulty: number
  ): Promise<AIFeedback> => {
    if (!openai) {
      toast.error('API key required for AI coaching');
      throw new Error('No API key configured');
    }

    setIsProcessing(true);

    try {
      // First, transcribe the audio
      const formData = new FormData();
      formData.append('file', audioBlob);
      formData.append('model', 'whisper-1');
      formData.append('response_format', 'verbose_json');
      formData.append('temperature', '0.2');
      formData.append('prompt', `Focus on the "${targetSound}" sound in the word "${currentWord}".`);

      const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
        body: formData
      });

      if (!transcriptionResponse.ok) {
        throw new Error('Failed to transcribe audio');
      }

      const transcriptionData = await transcriptionResponse.json();

      // Then, analyze the pronunciation with GPT-4
      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: COACHING_PROMPT
          },
          {
            role: 'user',
            content: `
              Target sound: ${targetSound}
              Target word: ${currentWord}
              Difficulty level: ${difficulty}
              Transcription: ${transcriptionData.text}
              
              Provide detailed feedback focusing on the "${targetSound}" sound.
            `
          }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      });

      const analysis = JSON.parse(completion.choices[0]?.message?.content || '{}');
      
      const feedback: AIFeedback = {
        pronunciation: analysis.accuracy || 0,
        clarity: analysis.clarity || 0,
        rhythm: analysis.rhythm || 0,
        suggestions: analysis.suggestions || [],
        encouragement: analysis.encouragement || 'Keep practicing!'
      };

      setLastFeedback(feedback);
      return feedback;

    } catch (error) {
      console.error('Speech analysis failed:', error);
      toast.error('Unable to analyze speech. Please try again.');
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [openai, apiKey]);

  const generateExercise = useCallback(async (
    sound: string,
    difficulty: number,
    previousAccuracy?: number
  ) => {
    if (!openai) {
      toast.error('API key required for exercise generation');
      throw new Error('No API key configured');
    }

    try {
      setIsProcessing(true);

      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `Generate a fun, age-appropriate speech exercise for practicing the "${sound}" sound.
            Consider:
            - Difficulty level: ${difficulty}/5
            ${previousAccuracy ? `- Previous accuracy: ${previousAccuracy}%` : ''}
            - Make it engaging and game-like
            - Include visual elements
            - Provide clear instructions
            
            Format as JSON with:
            - title
            - description
            - words (array)
            - activity
            - successCriteria
            - encouragement`
          }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      });

      return JSON.parse(completion.choices[0]?.message?.content || '{}');

    } catch (error) {
      console.error('Exercise generation failed:', error);
      toast.error('Failed to generate exercise. Please try again.');
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [openai]);

  const getPersonalizedTips = useCallback(async (
    sound: string,
    recentProgress: number[]
  ) => {
    if (!openai) {
      toast.error('API key required for personalized tips');
      throw new Error('No API key configured');
    }

    try {
      setIsProcessing(true);

      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `Generate personalized tips for improving "${sound}" sound pronunciation.
            Recent progress: ${recentProgress.join(', ')}%
            
            Provide:
            - Analysis of progress trend
            - Specific improvement strategies
            - Motivation based on progress
            - Next milestone to aim for`
          }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      });

      return JSON.parse(completion.choices[0]?.message?.content || '{}');

    } catch (error) {
      console.error('Failed to generate tips:', error);
      toast.error('Unable to generate personalized tips');
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [openai]);

  return {
    analyzeSpeech,
    generateExercise,
    getPersonalizedTips,
    isProcessing,
    lastFeedback
  };
}