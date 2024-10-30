import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useSettingsStore } from '@/lib/store/settings';
import { toast } from 'sonner';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { apiKey, speechRate, setApiKey, setSpeechRate } = useSettingsStore();
  const [tempApiKey, setTempApiKey] = useState(apiKey);

  const handleSave = () => {
    setApiKey(tempApiKey);
    toast.success('Settings saved successfully');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="apiKey">OpenAI API Key</Label>
            <Input
              id="apiKey"
              type="password"
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
              placeholder="sk-..."
            />
          </div>
          <div className="grid gap-2">
            <Label>Speech Rate</Label>
            <Slider
              value={[speechRate]}
              onValueChange={([value]) => setSpeechRate(value)}
              min={0.5}
              max={2}
              step={0.1}
            />
            <span className="text-sm text-muted-foreground text-center">
              {speechRate}x
            </span>
          </div>
        </div>
        <Button onClick={handleSave}>Save Changes</Button>
      </DialogContent>
    </Dialog>
  );
}