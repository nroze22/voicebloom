import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Star, Clock, Brain } from 'lucide-react';
import PhraseActions from './PhraseActions';
import { toast } from 'sonner';

interface PhraseBuilderProps {
  apiKey: string;
}

export function PhraseBuilder({ apiKey }: PhraseBuilderProps) {
  const [currentPhrase, setCurrentPhrase] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [savedPhrases, setSavedPhrases] = useState<string[]>([]);
  const [recentPhrases, setRecentPhrases] = useState<string[]>([]);
  const [customWord, setCustomWord] = useState('');

  // Common phrases organized by category
  const quickPhrases = {
    actions: ["I want", "I need", "I like", "Give me", "Help me"],
    feelings: ["happy", "sad", "tired", "hungry", "thirsty"],
    objects: ["water", "food", "toy", "book", "phone"],
    places: ["home", "school", "park", "store", "bathroom"],
    time: ["now", "later", "today", "please", "thank you"],
  };

  useEffect(() => {
    // Load saved phrases from localStorage
    const saved = localStorage.getItem('saved-phrases');
    if (saved) setSavedPhrases(JSON.parse(saved));

    const recent = localStorage.getItem('recent-phrases');
    if (recent) setRecentPhrases(JSON.parse(recent));
  }, []);

  const addWord = (word: string) => {
    setCurrentPhrase(prev => [...prev, word]);
    
    // Add to recent phrases
    const updatedRecent = [word, ...recentPhrases.filter(p => p !== word)].slice(0, 10);
    setRecentPhrases(updatedRecent);
    localStorage.setItem('recent-phrases', JSON.stringify(updatedRecent));
  };

  const savePhrase = () => {
    if (currentPhrase.length === 0) return;

    const phrase = currentPhrase.join(' ');
    const updatedSaved = [phrase, ...savedPhrases.filter(p => p !== phrase)].slice(0, 10);
    setSavedPhrases(updatedSaved);
    localStorage.setItem('saved-phrases', JSON.stringify(updatedSaved));
    
    toast.success('Phrase saved successfully');
  };

  const clearPhrase = () => {
    setCurrentPhrase([]);
    setSuggestions([]);
  };

  const addCustomWord = () => {
    if (customWord.trim()) {
      addWord(customWord.trim());
      setCustomWord('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Current Phrase Display */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950">
        <CardContent className="p-4">
          <div className="min-h-[60px] flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              {currentPhrase.length > 0 ? (
                currentPhrase.map((word, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary"
                    className="text-lg py-2 px-3"
                  >
                    {word}
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground">
                  Select words to build your phrase...
                </span>
              )}
            </div>
            
            <PhraseActions
              phrase={currentPhrase}
              onSave={savePhrase}
              onClear={clearPhrase}
            />
          </div>
        </CardContent>
      </Card>

      {/* Custom Word Input */}
      <div className="flex gap-2">
        <Input
          placeholder="Add custom word..."
          value={customWord}
          onChange={(e) => setCustomWord(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addCustomWord()}
        />
        <Button onClick={addCustomWord}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Quick Access Categories */}
      {Object.entries(quickPhrases).map(([category, words]) => (
        <div key={category}>
          <h4 className="text-sm font-medium mb-2 capitalize">{category}</h4>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollable-content">
            {words.map((word) => (
              <Button
                key={word}
                variant="outline"
                size="sm"
                className="flex-shrink-0"
                onClick={() => addWord(word)}
              >
                {word}
              </Button>
            ))}
          </div>
        </div>
      ))}

      {/* Saved & Recent Phrases */}
      {(savedPhrases.length > 0 || recentPhrases.length > 0) && (
        <div className="grid grid-cols-2 gap-4">
          {savedPhrases.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                Saved Phrases
              </h4>
              <div className="space-y-2">
                {savedPhrases.map((phrase, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setCurrentPhrase(phrase.split(' '))}
                  >
                    {phrase}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {recentPhrases.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                <Clock className="h-4 w-4 text-blue-500" />
                Recent Words
              </h4>
              <div className="space-y-2">
                {recentPhrases.map((word, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => addWord(word)}
                  >
                    {word}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}