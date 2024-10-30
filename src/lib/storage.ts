import type { UserSettings, Progress, SoundStage, Phrase } from '@/lib/types';

const STORAGE_KEYS = {
  SETTINGS: 'voice-bloom-settings',
  PROGRESS: 'voice-bloom-progress',
  STAGES: 'voice-bloom-stages',
  PHRASES: 'voice-bloom-phrases',
} as const;

export function getStoredSettings(): UserSettings | null {
  const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  return stored ? JSON.parse(stored) : null;
}

export function storeSettings(settings: UserSettings): void {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

export function getStoredProgress(): Progress | null {
  const stored = localStorage.getItem(STORAGE_KEYS.PROGRESS);
  return stored ? JSON.parse(stored) : null;
}

export function storeProgress(progress: Progress): void {
  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
}

export function getStoredStages(): SoundStage[] {
  const stored = localStorage.getItem(STORAGE_KEYS.STAGES);
  return stored ? JSON.parse(stored) : [];
}

export function storeStages(stages: SoundStage[]): void {
  localStorage.setItem(STORAGE_KEYS.STAGES, JSON.stringify(stages));
}

export function getStoredPhrases(): Phrase[] {
  const stored = localStorage.getItem(STORAGE_KEYS.PHRASES);
  return stored ? JSON.parse(stored) : [];
}

export function storePhrases(phrases: Phrase[]): void {
  localStorage.setItem(STORAGE_KEYS.PHRASES, JSON.stringify(phrases));
}