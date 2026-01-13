export interface Point {
  x: number;
  y: number;
}

export interface Stroke {
  points: Point[];
  color: string;
  width: number;
  isSilent: boolean; 
}

export enum AppMode {
  NORMAL = 'Libre',
  SILENCE = 'Silence',
  CHALLENGE = 'Jeu Aveugle'
}

export enum Difficulty {
  EASY = 'Apprenti',
  MEDIUM = 'Initié',
  HARD = 'Maître'
}

export interface ChallengeShape {
  name: string;
  points: Point[];
  difficulty: Difficulty;
  targetColor?: string; // Couleur spécifique requise
  targetWidth?: number; // Épaisseur spécifique requise
}