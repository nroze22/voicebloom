import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { 
  Volume2, 
  Save,
  Copy,
  Trash2,
  Pause,
  Download,
  Share2
} from 'lucide-react';
import { useTextToSpeech } from '@/lib/hooks/useTextToSpeech';

interface PhraseActionsProps {
  phrase: string[];
  onSave: () => void;
  onClear: () => void;
  className?: string;
}

export default function PhraseActions({ 
  phrase, 
  onSave, 
  onClear,
  className = '' 
}: PhraseActionsProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { speak, pause, resume, cancel } = useTextToSpeech();

  const handleSpeak = async () => {
    if (phrase.length === 0) return;

    try {
      if (isSpeaking) {
        pause();
        setIsSpeaking(false);
      } else {
        setIsSpeaking(true);
        await speak(phrase.join(' '), {
          rate: 0.9, // Slightly slower for clarity
          pitch: 1,
          volume: 1,
          onEnd: () => {
            setIsSpeaking(false);
            toast.success('Finished speaking');
          },
          onError: () => {
            setIsSpeaking(false);
            toast.error('Failed to speak phrase');
          }
        });
      }
    } catch (error) {
      setIsSpeaking(false);
      toast.error('Failed to speak phrase');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(phrase.join(' '));
      toast.success('Phrase copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy phrase');
    }
  };

  const handleDownload = () => {
    try {
      const blob = new Blob([phrase.join(' ')], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'phrase.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Phrase downloaded');
    } catch (error) {
      toast.error('Failed to download phrase');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          text: phrase.join(' '),
          title: 'Shared from VoiceBloom'
        });
        toast.success('Phrase shared successfully');
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          toast.error('Failed to share phrase');
        }
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <Button
        variant="outline"
        size="icon"
        onClick={handleSpeak}
        disabled={phrase.length === 0}
        className={isSpeaking ? 'animate-pulse' : ''}
      >
        {isSpeaking ? <Pause className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={onSave}
        disabled={phrase.length === 0}
      >
        <Save className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={handleCopy}
        disabled={phrase.length === 0}
      >
        <Copy className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={handleDownload}
        disabled={phrase.length === 0}
      >
        <Download className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={handleShare}
        disabled={phrase.length === 0}
      >
        <Share2 className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={onClear}
        disabled={phrase.length === 0}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}