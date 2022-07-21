import create from "zustand";

import {
  RacingStore,
  ContainerStore,
  Industries,
  SoundStore,
  ConfettiStore,
} from "@types";

export const useRacingStore = create<RacingStore>((set, get) => ({
  isPaused: false,
  setIsPaused: (bool) => set({ isPaused: bool }),
  racingStatus: {
    "Financial Services": false,
    Retail: false,
    "Growth Markets": false,
    "Public Sector": false,
    "Energy & Commodities": false,
  },
  setIsFinishedRacing: (industry: Industries) => {
    set({
      racingStatus: {
        ...get().racingStatus,
        [industry]: false,
      } as RacingStore["racingStatus"],
    });
  },

  getIsFinishedRacing: () =>
    Object.keys(get().racingStatus).every(
      (key) => !get().racingStatus[key as Industries]
    ),
  startRacing: () =>
    set({
      racingStatus: Object.keys(get().racingStatus).reduce(
        (acc, key) => ({
          ...acc,
          [key]: true,
        }),
        {}
      ) as RacingStore["racingStatus"],
    }),
}));

export const useContainerStore = create<ContainerStore>((set) => ({
  containerBounds: {},
  setContainerBounds: (attrs) => set({ containerBounds: { ...attrs } }),
}));

export const useSoundStore = create<SoundStore>((set, get) => ({
  raceAudio:
    typeof Audio !== "undefined"
      ? new Audio("/soundtracks/Super Mario Bros - Main Race.mp3")
      : undefined,
  victoryAudio:
    typeof Audio !== "undefined"
      ? new Audio("/soundtracks/Victory.mp3")
      : undefined,
  isMute: false,
  playRaceAudio: () => get().raceAudio?.play(),
  pauseRaceAudio: () => get().raceAudio?.pause(),
  playVictoryAudio: () => get().victoryAudio?.play(),
  pauseVictoryAudio: () => get().victoryAudio?.play(),
  setIsMute: () => set({ isMute: !get().isMute }),
}));

export const useConfettiStore = create<ConfettiStore>((set) => ({
  confettiIsRunning: false,
  launchConfetti: () => set({ confettiIsRunning: true }),
  resetConfetti: () => set({ confettiIsRunning: false }),
}));
