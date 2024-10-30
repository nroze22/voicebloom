import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Progress, SoundStage } from '@/lib/types';

interface ProgressState extends Progress {
  stages: SoundStage[];
  updateProgress: (progress: Partial<Progress>) => void;
  updateStages: (stages: SoundStage[]) => void;
  completeStage: (stageId: string) => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      accuracy: 0,
      fluency: 0,
      consistency: 0,
      practiceStreak: 0,
      lastPractice: new Date(),
      minutesPracticed: 0,
      soundsMastered: [],
      currentChallenges: [],
      stages: [],
      updateProgress: (newProgress) =>
        set((state) => ({ ...state, ...newProgress })),
      updateStages: (stages) => set({ stages }),
      completeStage: (stageId) =>
        set((state) => ({
          stages: state.stages.map((stage) =>
            stage.id === stageId ? { ...stage, complete: true } : stage
          ),
          soundsMastered: [...state.soundsMastered, stageId],
        })),
    }),
    {
      name: 'voice-bloom-progress',
    }
  )
);