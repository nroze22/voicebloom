import { useState, useCallback } from 'react';
import { Groq } from '@groq/groq-sdk';
import { toast } from '@/components/ui/use-toast';

interface GroqAnalysisResult {
  accuracy: number;
  feedback: string[];
  suggestions: string[];
  confidence: number;
}

export function useGroqAnalysis(apiKey: string | null) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastResult, setLastResult] = useState<GroqAnalysisResult | null>(null);

  const groq = apiKey ? new Groq({ apiKey }) : null;

  const analyzeWithLlama = async (transcription: string, targetSound: string): Promise<GroqAnalysisResult> => {
    if (!groq) {
      throw new Error('Groq client not initialized');
    }

    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are a speech therapy expert analyzing pronunciation. Focus on the "${targetSound}" sound in the following transcription. Provide detailed feedback on accuracy, specific issues, and suggestions for improvement. Format response as JSON with properties: accuracy (0-100), feedback (array of observations), suggestions (array of improvement tips), confidence (0-100).`
          },
          {
            role: 'user',
            content: transcription
          }
        ],
        model: 'llama2-70b-4096',
        temperature: 0.3,
        max_tokens: 1024,
        top_p: 0.9,
        response_format: { type: 'json_object' }
      });

      const analysis = JSON.parse(completion.choices[0]?.message?.content || '{}');
      
      return {
        accuracy: analysis.accuracy || 0,
        feedback: analysis.feedback || [],
        suggestions: analysis.suggestions || [],
        confidence: analysis.confidence || 0
      };
    } catch (error) {
      console.error('Llama analysis failed:', error);
      throw error;
    }
  };

  const analyzePronunciation = useCallback(async (audioBlob: Blob, targetSound: string): Promise<GroqAnalysisResult> => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please add your Groq API key in settings to use speech analysis.",
        variant: "destructive"
      });
      throw new Error("API key not configured");
    }

    try {
      setIsAnalyzing(true);

      // First, convert audio to text using Whisper API
      const formData = new FormData();
      formData.append('file', audioBlob);
      formData.append('model', 'whisper-1');

      const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.VITE_OPENAI_API_KEY}`,
        },
        body: formData
      });

      if (!transcriptionResponse.ok) {
        throw new Error('Failed to transcribe audio');
      }

      const { text } = await transcriptionResponse.json();

      // Then analyze the transcription with Llama through Groq
      const result = await analyzeWithLlama(text, targetSound);
      setLastResult(result);
      return result;

    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze pronunciation. Please try again.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  }, [apiKey, groq]);

  return {
    analyzePronunciation,
    isAnalyzing,
    lastResult
  };
}