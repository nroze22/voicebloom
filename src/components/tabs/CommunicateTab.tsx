import { Card, CardContent } from '@/components/ui/card';
import { PhraseBuilder } from '@/components/communication/PhraseBuilder';
import type { UserSettings } from '@/lib/types';

interface CommunicateTabProps {
  settings: UserSettings;
}

export default function CommunicateTab({ settings }: CommunicateTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <PhraseBuilder apiKey={settings.apiKey} />
        </CardContent>
      </Card>
    </div>
  );
}