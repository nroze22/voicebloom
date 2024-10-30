import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Star, Clock, Plus } from 'lucide-react';
import { useAIAssistant } from '@/lib/hooks/useAIAssistant';
import { useTextToSpeech } from '@/lib/hooks/useTextToSpeech';
import type { Phrase } from '@/lib/types';

interface PhraseLibraryProps {
  apiKey: string;
  onPhraseSelect: (phrase: Phrase) => void;
}

export function PhraseLibrary({ apiKey, onPhraseSelect }: PhraseLibraryProps) {
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState<Phrase[]>([]);
  const [recentPhrases, setRecentPhrases] = useState<Phrase[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  const { generatePhrases } = useAIAssistant(apiKey);
  const { speak } = useTextToSpeech();

  useEffect(() => {
    if (search.length > 2) {
      // Simulate AI-powered autocomplete
      setSuggestions([
        `${search} please`,
        `I want ${search}`,
        `Can you help me ${search}`,
        `I need ${search}`
      ]);
    } else {
      setSuggestions([]);
    }
  }, [search]);

  const handlePhraseClick = (phrase: Phrase) => {
    onPhraseSelect(phrase);
    setRecentPhrases(prev => {
      const newRecent = [phrase, ...prev.filter(p => p.id !== phrase.id)].slice(0, 10);
      localStorage.setItem('recent-phrases', JSON.stringify(newRecent));
      return newRecent;
    });
  };

  const toggleFavorite = (phrase: Phrase) => {
    setFavorites(prev => {
      const isFavorite = prev.some(p => p.id === phrase.id);
      const newFavorites = isFavorite
        ? prev.filter(p => p.id !== phrase.id)
        : [...prev, phrase];
      localStorage.setItem('favorite-phrases', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-9"
              placeholder="Search phrases..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {suggestions.length > 0 && (
            <div className="p-2 bg-muted rounded-lg">
              {suggestions.map((suggestion, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  className="w-full justify-start text-left"
                  onClick={() => handlePhraseClick({
                    id: Date.now().toString(),
                    text: suggestion,
                    usageCount: 0
                  })}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          )}

          <Tabs defaultValue="favorites">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="favorites">
                <Star className="h-4 w-4 mr-2" />
                Favorites
              </TabsTrigger>
              <TabsTrigger value="recent">
                <Clock className="h-4 w-4 mr-2" />
                Recent
              </TabsTrigger>
            </TabsList>

            <TabsContent value="favorites" className="space-y-2">
              {favorites.map((phrase) => (
                <Button
                  key={phrase.id}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handlePhraseClick(phrase)}
                >
                  {phrase.text}
                </Button>
              ))}
            </TabsContent>

            <TabsContent value="recent" className="space-y-2">
              {recentPhrases.map((phrase) => (
                <Button
                  key={phrase.id}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handlePhraseClick(phrase)}
                >
                  {phrase.text}
                </Button>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}