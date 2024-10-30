import { useState, useCallback } from 'react';
import { OpenAI } from 'openai';
import { toast } from 'sonner';
import { useSettingsStore } from '@/lib/store/settings';

interface PhoneticAnalysis {
  phonemes: {
    target: string;
    actual: string;
    accuracy: number;
    position: 'initial' | 'medial' | 'final';
  }[];
  stress: {
    pattern: string;
    accuracy: number;
  };
  intonation: {
    pattern: string;
    naturalness: number;
  };
}

interface AnalysisResult {
  text: string;
  confidence: number;
  phonetic: PhoneticAnalysis;
  feedback: {
    strengths: string[];
    improvements: string[];
    nextSteps: string[];
  };
  scores: {
    overall: number;
    pronunciation: number;
    fluency: number;
    rhythm: number;
  };
}

export function useSpeechAnalysis() {
  const { apiKey } = useSettingsStore();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastResult, setLastResult] = useState<AnalysisResult | null>(null);

  const openai = apiKey ? new OpenAI({ apiKey, dangerouslyAllowBrowser: true }) : null;

  const analyzeAudio = useCallback(async (
    audioBlob: Blob,
    targetPhoneme: string,
    context?: string
  ): Promise<AnalysisResult> => {
    if (!openai) {
      toast.error('API key required for speech analysis');
      throw new Error('API key not configured');
    }

    setIsAnalyzing(true);

    try {
      // First, transcribe the audio
      const formData = new FormData();
      formData.append('file', audioBlob);
      formData.append('model', 'whisper-1');
      formData.append('response_format', 'verbose_json');
      formData.append('temperature', '0.2');
      formData.append('prompt', `Focus on the "${targetPhoneme}" sound.`);

      const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
        body: formData
      });

      if (!transcriptionResponse.ok) {
        throw new Error('Transcription failed');
      }

      const transcriptionData = await transcriptionResponse.json();

      // Then, perform detailed analysis
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an expert speech therapist and phonetician. Analyze the pronunciation of "${targetPhoneme}" in the following text. Consider:
            - Phonetic accuracy
            - Position-specific challenges
            - Coarticulation effects
            - Prosodic features
            Provide detailed feedback and scores.`
          },
          {
            role: 'user',
            content: `Text: "${transcriptionData.text}"
            Target sound: ${targetPhoneme}
            ${context ? `Context: ${context}` : ''}`
          }
        ],
        temperature: 0.2,
        response_format: { type: 'json_object' }
      });

      const analysis = JSON.parse(completion.choices[0]?.message?.content || '{}');
      
      const result: AnalysisResult = {
        text: transcriptionData.text,
        confidence: transcriptionData.confidence,
        phonetic: analysis.phonetic,
        feedback: analysis.feedback,
        scores: analysis.scores
      };

      setLastResult(result);
      return result;

    } catch (error) {
      console.error('Speech analysis failed:', error);
      toast.error('Analysis failed. Please try again.');
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  }, [apiKey, openai]);

  return {
    analyzeAudio,
    isAnalyzing,
    lastResult
  };
}