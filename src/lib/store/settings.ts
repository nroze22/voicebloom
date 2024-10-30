import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  apiKey: string;
  voiceId: string;
  speechRate: number;
  setApiKey: (key: string) => void;
  setVoiceId: (id: string) => void;
  setSpeechRate: (rate: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      apiKey: '',
      voiceId: '',
      speechRate: 1,
      setApiKey: (key) => set({ apiKey: key }),
      setVoiceId: (id) => set({ voiceId: id }),
      setSpeechRate: (rate) => set({ speechRate: rate }),
    }),
    {
      name: 'voicebloom-settings',
    }
  )
);