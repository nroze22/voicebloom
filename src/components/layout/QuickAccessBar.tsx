import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  ChevronUp, 
  Play, 
  Trash2,
  Plus,
  Save,
  Volume2
} from "lucide-react";
import { useTextToSpeech } from "@/lib/hooks/useTextToSpeech";
import { toast } from "@/components/ui/use-toast";

interface SavedPhrase {
  id: string;
  text: string;
  timestamp: number;
}

export default function QuickAccessBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentPhrase, setCurrentPhrase] = useState<string[]>([]);
  const [savedPhrases, setSavedPhrases] = useState<SavedPhrase[]>(() => {
    const saved = localStorage.getItem('saved-phrases');
    return saved ? JSON.parse(saved) : [];
  });
  const { speak, isSpeaking } = useTextToSpeech();

  // Common phrases organized by category
  const quickPhrases = {
    actions: ["I want", "I need", "I like", "Give me", "Help me"],
    objects: ["water", "food", "bathroom", "toy", "book"],
    feelings: ["happy", "sad", "tired", "hungry", "thirsty"],
    responses: ["yes", "no", "maybe", "thank you", "please"],
    places: ["home", "school", "outside", "park", "store"],
    time: ["now", "later", "soon", "today", "tomorrow"],
  };

  const addToPhrase = (word: string) => {
    setCurrentPhrase(prev => [...prev, word]);
  };

  const removeLastWord = () => {
    setCurrentPhrase(prev => prev.slice(0, -1));
  };

  const clearPhrase = () => {
    setCurrentPhrase([]);
  };

  const savePhrase = () => {
    if (currentPhrase.length === 0) return;
    
    const phrase = {
      id: Date.now().toString(),
      text: currentPhrase.join(' '),
      timestamp: Date.now(),
    };
    
    const updatedPhrases = [phrase, ...savedPhrases].slice(0, 10);
    setSavedPhrases(updatedPhrases);
    localStorage.setItem('saved-phrases', JSON.stringify(updatedPhrases));
    
    toast({
      title: "Phrase Saved",
      description: "Your phrase has been saved for quick access.",
    });
  };

  const speakCurrentPhrase = () => {
    if (currentPhrase.length === 0) return;
    speak(currentPhrase.join(' '));
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t z-40">
      <div className="container mx-auto">
        <Button
          variant="ghost"
          className="w-full py-2 flex items-center justify-center gap-2"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <MessageSquare className="h-4 w-4" />
          Phrase Builder
          <ChevronUp className={`h-4 w-4 transform transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`} />
        </Button>

        {isExpanded && (
          <div className="p-4 border-t space-y-4">
            {/* Current Phrase Display */}
            <div className="bg-muted p-3 rounded-lg min-h-[60px] flex items-center justify-between gap-2">
              <div className="flex flex-wrap gap-2">
                {currentPhrase.length > 0 ? (
                  currentPhrase.map((word, index) => (
                    <Badge key={index} variant="secondary">
                      {word}
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground">
                    Select words to build your phrase...
                  </span>
                )}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {currentPhrase.length > 0 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={removeLastWord}
                      title="Remove last word"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={savePhrase}
                      title="Save phrase"
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={speakCurrentPhrase}
                      disabled={isSpeaking}
                      title="Speak phrase"
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Quick Access Categories */}
            <div className="space-y-3">
              {Object.entries(quickPhrases).map(([category, words]) => (
                <div key={category}>
                  <h4 className="text-sm font-medium mb-2 capitalize">
                    {category}
                  </h4>
                  <div className="flex gap-2 overflow-x-auto pb-2 tablet-scrollbar">
                    {words.map((word) => (
                      <Button
                        key={word}
                        variant="outline"
                        size="sm"
                        className="flex-shrink-0"
                        onClick={() => addToPhrase(word)}
                      >
                        {word}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Saved Phrases */}
            {savedPhrases.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Saved Phrases</h4>
                <div className="flex gap-2 overflow-x-auto pb-2 tablet-scrollbar">
                  {savedPhrases.map((phrase) => (
                    <Button
                      key={phrase.id}
                      variant="secondary"
                      size="sm"
                      className="flex-shrink-0"
                      onClick={() => setCurrentPhrase(phrase.text.split(' '))}
                    >
                      {phrase.text}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}