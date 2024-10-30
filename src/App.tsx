import { ThemeProvider } from '@/components/theme-provider';
import VoiceBloom from '@/components/VoiceBloom';
import { Toaster } from 'sonner';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="voicebloom-theme">
      <VoiceBloom />
      <Toaster position="top-center" />
    </ThemeProvider>
  );
}

export default App;