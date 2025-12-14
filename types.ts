export interface BottleData {
  id: string; // e.g., "0", "1", "25"
  number: number;
  name: string;
  colors: {
    top: string;
    bottom: string;
    topLabel: string;
    bottomLabel: string;
  };
  theme: string;
  affirmation: string;
  tags: string[]; // e.g., ["Angelic", "Rescue", "Master"]
  
  // Extended Details
  alias?: string; // e.g., "Equilibrium_2 2-和平~女祭司(向外)"
  mixedColor?: string; // e.g., "藍色"
  tarot?: string; // e.g., "女祭司"
  tarotImage?: string; // Path to tarot image e.g. "/tarot/2.jpg"
  positivePersonality?: string; // ★ 正向的人格面
  challengePersonality?: string; // ★ 可以改善的人格面
  spiritualLevel?: string; // ★ 心靈層面
  mentalLevel?: string; // ★ 心理層面
  emotionalLevel?: string; // ★ 情感層面
  physicalLevel?: string; // ★ 身體層面
  whereToApply?: string; // ★ 使用部位
}

export interface ReadingResult {
  introduction: string;
  positions: {
    1: string; // Soul Bottle
    2: string; // Gifts & Challenges
    3: string; // Here & Now
    4: string; // Future
  };
  summary: string;
}

export enum ViewState {
  HOME = 'HOME',
  GALLERY = 'GALLERY',
  READING = 'READING',
}

export interface SelectionState {
  [key: number]: BottleData | null; // 1, 2, 3, 4 positions
}