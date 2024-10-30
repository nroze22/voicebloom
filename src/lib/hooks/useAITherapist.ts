import { useState, useCallback } from 'react';
import { OpenAI } from 'openai';
import { toast } from 'sonner';
import { useSettingsStore } from '@/lib/store/settings';

interface AnalysisResult {
  accuracy: number;
  feedback: string[];
  suggestions: string[];
  nextSteps: string[];
  confidence: number;
  areas: {
    articulation: number;
    fluency: number;
    rhythm: number;
    stress: number;
    intonation: number;
  };
  technicalDetails: {
    formants: number[];
    pitch: number[];
    intensity: number[];
    spectralMoments: number[];
  };
}

interface AIModel {
  name: string;
  version: string;
  specialization: string[];
  weightings: {
    accuracy: number;
    fluency: number;
    naturalness: number;
  };
}

const MODELS: AIModel[] = [
  {
    name: 'gpt-4',
    version: '0613',
    specialization: ['general-analysis', 'context-understanding'],
    weightings: { accuracy: 0.4, fluency: 0.3, naturalness: 0.3 }
  },
  {
    name: 'whisper-large-v3',
    version: '0613',
    specialization: ['phonetic-analysis', 'accent-detection'],
    weightings: { accuracy: 0.5, fluency: 0.3, naturalness: 0.2 }
  }
];

export function useAITherapist() {
  const { apiKey, preferredModel } = useSettingsStore();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<AnalysisResult | null>(null);
  const [modelConfidence, setModelConfidence] = useState<Record<string, number>>({});

  const openai = apiKey ? new OpenAI({ apiKey, dangerouslyAllowBrowser: true }) : null;

  const analyzeSpeech = useCallback(async (audioBlob: Blob, targetSound: string): Promise<AnalysisResult> => {
    if (!apiKey) {
      toast.error('API Key Required', {
        description: 'Please add your OpenAI API key in settings to use AI features.'
      });
      throw new Error('No API key configured');
    }

    setIsAnalyzing(true);

    try {
      // First, transcribe the audio with enhanced settings
      const formData = new FormData();
      formData.append('file', audioBlob);
      formData.append('model', 'whisper-1');
      formData.append('response_format', 'verbose_json');
      formData.append('temperature', '0.2');
      formData.append('prompt', `Focus on the "${targetSound}" sound pronunciation.`);

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

      // Parallel analysis using multiple models
      const analysisPromises = MODELS.map(async (model) => {
        const completion = await openai!.chat.completions.create({
          model: model.name,
          messages: [
            {
              role: 'system',
              content: `You are an expert speech therapist specializing in phonetic analysis and pronunciation improvement. 
              Focus on analyzing the "${targetSound}" sound in the following transcription.
              Consider:
              - Precise phonetic accuracy
              - Articulatory features
              - Coarticulation effects
              - Prosodic elements
              Provide detailed analysis including:
              - Accuracy score (0-100)
              - Specific articulatory feedback
              - Technical phonetic details
              - Personalized improvement strategies
              Format response as JSON.`
            },
            {
              role: 'user',
              content: transcriptionData.text
            }
          ],
          temperature: 0.2,
          response_format: { type: 'json_object' }
        });

        return {
          model: model.name,
          analysis: JSON.parse(completion.choices[0]?.message?.content || '{}'),
          confidence: completion.choices[0]?.finish_reason === 'stop' ? 1 : 0.5
        };
      });

      const analysisResults = await Promise.all(analysisPromises);

      // Weighted ensemble of model predictions
      const combinedAnalysis = analysisResults.reduce((acc, { model, analysis, confidence }) => {
        const modelWeight = MODELS.find(m => m.name === model)?.weightings || {
          accuracy: 0.33,
          fluency: 0.33,
          naturalness: 0.33
        };

        setModelConfidence(prev => ({ ...prev, [model]: confidence }));

        return {
          accuracy: acc.accuracy + (analysis.accuracy * modelWeight.accuracy * confidence),
          feedback: [...new Set([...acc.feedback, ...analysis.feedback])],
          suggestions: [...new Set([...acc.suggestions, ...analysis.suggestions])],
          nextSteps: [...new Set([...acc.nextSteps, ...analysis.nextSteps])],
          confidence: acc.confidence + (confidence / analysisResults.length),
          areas: {
            articulation: acc.areas.articulation + (analysis.areas?.articulation || 0) * confidence,
            fluency: acc.areas.fluency + (analysis.areas?.fluency || 0) * confidence,
            rhythm: acc.areas.rhythm + (analysis.areas?.rhythm || 0) * confidence,
            stress: acc.areas.stress + (analysis.areas?.stress || 0) * confidence,
            intonation: acc.areas.intonation + (analysis.areas?.intonation || 0) * confidence,
          },
          technicalDetails: {
            formants: analysis.technicalDetails?.formants || [],
            pitch: analysis.technicalDetails?.pitch || [],
            intensity: analysis.technicalDetails?.intensity || [],
            spectralMoments: analysis.technicalDetails?.spectralMoments || [],
          }
        };
      }, {
        accuracy: 0,
        feedback: [],
        suggestions: [],
        nextSteps: [],
        confidence: 0,
        areas: {
          articulation: 0,
          fluency: 0,
          rhythm: 0,
          stress: 0,
          intonation: 0
        },
        technicalDetails: {
          formants: [],
          pitch: [],
          intensity: [],
          spectralMoments: []
        }
      });

      // Normalize the combined scores
      const normalizedAnalysis: AnalysisResult = {
        ...combinedAnalysis,
        accuracy: Math.round(combinedAnalysis.accuracy * 100) / 100,
        areas: Object.entries(combinedAnalysis.areas).reduce((acc, [key, value]) => ({
          ...acc,
          [key]: Math.round((value / analysisResults.length) * 100) / 100
        }), {} as typeof combinedAnalysis.areas)
      };

      setLastAnalysis(normalizedAnalysis);
      return normalizedAnalysis;

    } catch (error) {
      console.error('AI Analysis failed:', error);
      toast.error('Analysis Failed', {
        description: 'Unable to analyze speech. Please try again.'
      });
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  }, [apiKey, openai]);

  return {
    analyzeSpeech,
    isAnalyzing,
    lastAnalysis,
    modelConfidence
  };
}