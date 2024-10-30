import { useState, useEffect } from 'react';

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join('');

      setTranscript(transcript);
    };

    recognition.onerror = (event: any) => {
      setError(event.error);
    };

    return () => {
      recognition.stop();
    };
  }, []);

  const startListening = () => {
    setIsListening(true);
    setError(null);
    // Start recognition
  };

  const stopListening = () => {
    setIsListening(false);
    // Stop recognition
  };

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening
  };
}