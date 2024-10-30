import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from 'sonner';

interface SpeakOptions {
  onEnd?: () => void;
  onError?: (error: Error) => void;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const voicesLoadedRef = useRef(false);

  // Initialize voices when they become available
  const initVoices = useCallback(() => {
    return new Promise<void>((resolve) => {
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        voicesLoadedRef.current = true;
        resolve();
      } else {
        speechSynthesis.addEventListener('voiceschanged', () => {
          voicesLoadedRef.current = true;
          resolve();
        }, { once: true });
      }
    });
  }, []);

  const getPreferredVoice = useCallback(() => {
    const voices = window.speechSynthesis.getVoices();
    
    // Priority list of preferred voices
    const preferredVoices = [
      'Google US English Female',
      'Microsoft Aria Online (Natural)',
      'Samantha',
      'Daniel',
      'Google US English'
    ];

    // Try to find a preferred voice
    for (const preferredVoice of preferredVoices) {
      const voice = voices.find(v => v.name === preferredVoice);
      if (voice) return voice;
    }

    // Fallback to first available English voice
    return voices.find(voice => voice.lang.startsWith('en')) || voices[0];
  }, []);

  const speak = useCallback(async (text: string, options: SpeakOptions = {}) => {
    if (!text) return;

    const { rate = 1, pitch = 1, volume = 1, onEnd, onError } = options;

    try {
      // Cancel any ongoing speech
      cancel();

      // Ensure voices are loaded
      if (!voicesLoadedRef.current) {
        await initVoices();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      const voice = getPreferredVoice();
      
      if (!voice) {
        throw new Error('No voice available');
      }

      utterance.voice = voice;
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        onEnd?.();
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsSpeaking(false);
        onError?.(new Error(event.error));
      };

      // Store reference to current utterance
      utteranceRef.current = utterance;

      // Start speaking
      window.speechSynthesis.speak(utterance);

      // Return a promise that resolves when speech is complete
      return new Promise<void>((resolve, reject) => {
        utterance.onend = () => {
          setIsSpeaking(false);
          onEnd?.();
          resolve();
        };
        utterance.onerror = (event) => {
          setIsSpeaking(false);
          const error = new Error(event.error);
          onError?.(error);
          reject(error);
        };
      });

    } catch (error) {
      console.error('Speech synthesis error:', error);
      setIsSpeaking(false);
      onError?.(error as Error);
      toast.error('Failed to initialize speech synthesis');
      throw error;
    }
  }, [getPreferredVoice, initVoices]);

  const pause = useCallback(() => {
    window.speechSynthesis.pause();
    setIsSpeaking(false);
  }, []);

  const resume = useCallback(() => {
    window.speechSynthesis.resume();
    setIsSpeaking(true);
  }, []);

  const cancel = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    utteranceRef.current = null;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);

  return {
    speak,
    pause,
    resume,
    cancel,
    isSpeaking
  };
}