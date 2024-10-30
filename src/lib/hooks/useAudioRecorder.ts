import { useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';

interface AudioRecorderOptions {
  onDataAvailable?: (blob: Blob) => void;
  onVisualizationData?: (data: Uint8Array) => void;
  visualizerOptions?: {
    fftSize?: number;
    smoothingTimeConstant?: number;
  };
}

export function useAudioRecorder(options: AudioRecorderOptions = {}) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [duration, setDuration] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const startTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number>();
  const chunksRef = useRef<Blob[]>([]);

  const initializeAudioContext = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });

      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      
      // Configure analyser node
      analyserRef.current.fftSize = options.visualizerOptions?.fftSize || 256;
      analyserRef.current.smoothingTimeConstant = 
        options.visualizerOptions?.smoothingTimeConstant || 0.8;

      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      return stream;
    } catch (error) {
      toast.error('Microphone access denied');
      throw error;
    }
  }, [options.visualizerOptions]);

  const updateVisualization = useCallback(() => {
    if (!analyserRef.current || !isRecording) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Calculate audio level (0-100)
    const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
    setAudioLevel((average / 255) * 100);

    options.onVisualizationData?.(dataArray);

    // Update duration
    setDuration(Date.now() - startTimeRef.current);

    animationFrameRef.current = requestAnimationFrame(updateVisualization);
  }, [isRecording, options]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await initializeAudioContext();
      chunksRef.current = [];

      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
          options.onDataAvailable?.(e.data);
        }
      };

      recorder.start(100); // Collect data every 100ms
      mediaRecorderRef.current = recorder;
      startTimeRef.current = Date.now();
      setIsRecording(true);
      updateVisualization();

    } catch (error) {
      console.error('Failed to start recording:', error);
      toast.error('Failed to start recording');
    }
  }, [initializeAudioContext, updateVisualization, options]);

  const stopRecording = useCallback(() => {
    if (!mediaRecorderRef.current) return;

    return new Promise<Blob>((resolve) => {
      mediaRecorderRef.current!.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        resolve(audioBlob);
      };

      mediaRecorderRef.current!.stop();
      mediaRecorderRef.current!.stream.getTracks().forEach(track => track.stop());
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (audioContextRef.current) {
        audioContextRef.current.close();
      }

      setIsRecording(false);
      setDuration(0);
      setAudioLevel(0);
    });
  }, []);

  const cancelRecording = useCallback(() => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    setIsRecording(false);
    setDuration(0);
    setAudioLevel(0);
    chunksRef.current = [];
  }, []);

  return {
    isRecording,
    audioLevel,
    duration,
    startRecording,
    stopRecording,
    cancelRecording
  };
}