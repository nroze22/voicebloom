import { Trees, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onSettingsClick: () => void;
}

export default function Header({ onSettingsClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-5xl items-center">
        <div className="flex items-center gap-2 mr-4">
          <Trees className="h-6 w-6 text-green-600" />
          <span className="font-bold text-xl bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            VoiceBloom
          </span>
        </div>
        
        <div className="flex-1" />
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onSettingsClick}
          className="ml-2"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}