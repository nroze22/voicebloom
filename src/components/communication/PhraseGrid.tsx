import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import type { Phrase } from '@/lib/types';

interface PhraseGridProps {
  phrases: Phrase[];
  onPhraseSelect: (phrase: Phrase) => void;
  onAddPhrase: (text: string) => void;
}

export function PhraseGrid({ phrases, onPhraseSelect, onAddPhrase }: PhraseGridProps) {
  const [search, setSearch] = useState('');
  const [newPhrase, setNewPhrase] = useState('');

  const filteredPhrases = phrases.filter(phrase =>
    phrase.text.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddPhrase = () => {
    if (newPhrase.trim()) {
      onAddPhrase(newPhrase.trim());
      setNewPhrase('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="pl-9"
            placeholder="Search phrases..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Add new phrase..."
            value={newPhrase}
            onChange={(e) => setNewPhrase(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddPhrase()}
          />
          <Button onClick={handleAddPhrase}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {filteredPhrases.map((phrase) => (
          <Button
            key={phrase.id}
            variant="outline"
            className="h-auto py-3 justify-start"
            onClick={() => onPhraseSelect(phrase)}
          >
            <div className="flex items-center gap-2">
              {phrase.imageUrl && (
                <img
                  src={phrase.imageUrl}
                  alt=""
                  className="w-6 h-6 rounded object-cover"
                />
              )}
              <span>{phrase.text}</span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}