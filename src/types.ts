import { Rectangle } from "pixi.js";

export type Industries =
  | "Financial Services"
  | "Retail"
  | "Growth Markets"
  | "Public Sector"
  | "Energy & Commodities";

export interface MascotAttribute {
  mascot: string;
  industry: Industries;
  image: string;
  rectColor: string;
  rectBorder: string;
  headshot?: string;
}

export interface Revenue {
  revenueGuide: number;
  workSold: number;
}

export interface DBData extends Revenue {
  _id: string;
  industry: Industries;
  lastModified: Date;
}

export interface RevenueData extends MascotAttribute {
  revenue: Revenue;
}

export interface RacingStore {
  isPaused: boolean;
  setIsPaused: (bool: boolean) => void;
  racingStatus: {
    [key in Industries]: boolean;
  };
  setIsFinishedRacing: (industry: Industries) => void;
  getIsFinishedRacing: () => boolean;
  startRacing: () => void;
}

export interface ContainerStore {
  containerBounds: Rectangle | {};
  setContainerBounds: (arg0: Rectangle) => void;
}

export interface RevenueDataStore {
  revenueData: MascotAttribute;
  setRevenueData: () => MascotAttribute & RevenueData;
}

export interface SoundStore {
  raceAudio: HTMLAudioElement | undefined;
  victoryAudio: HTMLAudioElement | undefined;
  isMute: boolean;
  playRaceAudio: () => void;
  playVictoryAudio: () => void;
  pauseRaceAudio: () => void;
  pauseVictoryAudio: () => void;
  mute: () => void;
  unmute: () => void;
}

export interface ConfettiStore {
  confettiIsRunning: boolean;
  launchConfetti: () => void;
  resetConfetti: () => void;
}
