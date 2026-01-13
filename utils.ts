import { Point, ChallengeShape, Difficulty } from './types';

// Palette de l'application (synchronisée avec App.tsx)
const COLORS = ['#1c1917', '#ef4444', '#3b82f6', '#22c55e'];

// --- SHAPE DATA ---
export const CHALLENGE_SHAPES: ChallengeShape[] = [
  // --- EASY (APPRENTI) ---
  {
    name: 'Cercle',
    difficulty: Difficulty.EASY,
    targetColor: COLORS[2], // Bleu
    points: Array.from({ length: 50 }, (_, i) => {
      const angle = (i / 50) * Math.PI * 2;
      return { x: 0.5 + 0.35 * Math.cos(angle), y: 0.5 + 0.35 * Math.sin(angle) };
    })
  },
  {
    name: 'Carré',
    difficulty: Difficulty.EASY,
    targetWidth: 8, // Épais
    points: [{ x: 0.2, y: 0.2 }, { x: 0.8, y: 0.2 }, { x: 0.8, y: 0.8 }, { x: 0.2, y: 0.8 }, { x: 0.2, y: 0.2 }]
  },
  {
    name: 'Triangle',
    difficulty: Difficulty.EASY,
    targetColor: COLORS[3], // Vert
    points: [{ x: 0.5, y: 0.2 }, { x: 0.8, y: 0.8 }, { x: 0.2, y: 0.8 }, { x: 0.5, y: 0.2 }]
  },
  {
    name: 'Losange',
    difficulty: Difficulty.EASY,
    points: [{ x: 0.5, y: 0.15 }, { x: 0.85, y: 0.5 }, { x: 0.5, y: 0.85 }, { x: 0.15, y: 0.5 }, { x: 0.5, y: 0.15 }]
  },
  {
    name: 'Rectangle',
    difficulty: Difficulty.EASY,
    points: [{ x: 0.15, y: 0.35 }, { x: 0.85, y: 0.35 }, { x: 0.85, y: 0.65 }, { x: 0.15, y: 0.65 }, { x: 0.15, y: 0.35 }]
  },

  // --- MEDIUM (INITIÉ) ---
  {
    name: 'Étoile',
    difficulty: Difficulty.MEDIUM,
    targetColor: COLORS[1], // Rouge
    targetWidth: 2, // Fin
    points: [
      { x: 0.5, y: 0.15 }, { x: 0.6, y: 0.4 }, { x: 0.9, y: 0.4 }, { x: 0.65, y: 0.6 },
      { x: 0.75, y: 0.9 }, { x: 0.5, y: 0.75 }, { x: 0.25, y: 0.9 }, { x: 0.35, y: 0.6 },
      { x: 0.1, y: 0.4 }, { x: 0.4, y: 0.4 }, { x: 0.5, y: 0.15 }
    ]
  },
  {
    name: 'Cœur',
    difficulty: Difficulty.MEDIUM,
    targetColor: COLORS[1], // Rouge
    points: Array.from({ length: 60 }, (_, i) => {
      const t = (i / 60) * Math.PI * 2;
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
      return { x: 0.5 + x * 0.02, y: 0.5 + y * 0.02 };
    })
  },
  {
    name: 'Lune',
    difficulty: Difficulty.MEDIUM,
    targetColor: COLORS[2], // Bleu
    points: Array.from({ length: 40 }, (_, i) => {
      const t = (i / 39) * Math.PI - Math.PI/2;
      const r = 0.35;
      if (i < 20) return { x: 0.5 + r * Math.cos(t), y: 0.5 + r * Math.sin(t) };
      const t2 = Math.PI/2 - (t + Math.PI/2);
      return { x: 0.5 + r * 0.6 * Math.cos(t2), y: 0.5 + r * Math.sin(t2) };
    })
  },
  {
    name: 'Nuage',
    difficulty: Difficulty.MEDIUM,
    targetWidth: 8,
    points: [
      { x: 0.3, y: 0.7 }, { x: 0.2, y: 0.6 }, { x: 0.2, y: 0.4 }, { x: 0.4, y: 0.3 },
      { x: 0.6, y: 0.3 }, { x: 0.8, y: 0.4 }, { x: 0.8, y: 0.6 }, { x: 0.7, y: 0.7 }, { x: 0.3, y: 0.7 }
    ]
  },

  // --- HARD (MAÎTRE) ---
  {
    name: 'Poisson',
    difficulty: Difficulty.HARD,
    targetColor: COLORS[2], // Bleu
    targetWidth: 4,
    points: [
      { x: 0.2, y: 0.5 }, { x: 0.4, y: 0.35 }, { x: 0.7, y: 0.35 }, { x: 0.85, y: 0.25 },
      { x: 0.85, y: 0.75 }, { x: 0.7, y: 0.65 }, { x: 0.4, y: 0.65 }, { x: 0.2, y: 0.5 }
    ]
  },
  {
    name: 'Éclair',
    difficulty: Difficulty.HARD,
    targetColor: COLORS[0], // Noir/Stone
    targetWidth: 2,
    points: [
      { x: 0.6, y: 0.1 }, { x: 0.3, y: 0.5 }, { x: 0.5, y: 0.5 }, { x: 0.4, y: 0.9 },
      { x: 0.7, y: 0.4 }, { x: 0.5, y: 0.4 }, { x: 0.6, y: 0.1 }
    ]
  },
  {
    name: 'Spirale',
    difficulty: Difficulty.HARD,
    targetWidth: 8,
    points: Array.from({ length: 100 }, (_, i) => {
      const t = (i / 100) * 5 * Math.PI;
      const r = 0.025 * t; 
      return { x: 0.5 + r * Math.cos(t), y: 0.5 + r * Math.sin(t) };
    })
  },
  {
    name: 'Trèfle',
    difficulty: Difficulty.HARD,
    targetColor: COLORS[3], // Vert
    points: Array.from({ length: 80 }, (_, i) => {
      const t = (i / 80) * Math.PI * 2;
      const r = 0.35 * Math.sin(3 * t);
      return { x: 0.5 + r * Math.cos(t), y: 0.5 + r * Math.sin(t) };
    })
  }
];

const dist = (p1: Point, p2: Point) => Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

export const resampleAndNormalize = (points: Point[], sampleCount: number = 50): Point[] => {
  if (points.length < 2) return [];
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  points.forEach(p => {
    minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y);
  });
  const width = maxX - minX; const height = maxY - minY; const maxDim = Math.max(width, height);
  if (maxDim === 0) return Array(sampleCount).fill({ x: 0.5, y: 0.5 });
  const normalized: Point[] = points.map(p => ({
    x: (p.x - minX) / maxDim + (1 - width / maxDim) / 2,
    y: (p.y - minY) / maxDim + (1 - height / maxDim) / 2
  }));
  const totalLen = normalized.reduce((acc, p, i, arr) => i === 0 ? 0 : acc + dist(arr[i-1], p), 0);
  const step = totalLen / (sampleCount - 1);
  const result: Point[] = [normalized[0]];
  let currentDist = 0; let nextSampleDist = step;
  for (let i = 1; i < normalized.length; i++) {
    let p1 = normalized[i-1]; let p2 = normalized[i]; let d = dist(p1, p2);
    while (currentDist + d >= nextSampleDist && result.length < sampleCount) {
      const ratio = (nextSampleDist - currentDist) / d;
      result.push({ x: p1.x + (p2.x - p1.x) * ratio, y: p1.y + (p2.y - p1.y) * ratio });
      nextSampleDist += step;
    }
    currentDist += d;
  }
  while (result.length < sampleCount) result.push(normalized[normalized.length - 1]);
  return result;
};

export const calculateSimilarity = (userPoints: Point[], targetPoints: Point[]): number => {
  if (userPoints.length === 0) return 0;
  const u = resampleAndNormalize(userPoints, 50);
  const t = resampleAndNormalize(targetPoints, 50);
  let totalError = 0;
  u.forEach(pU => {
    let minD = Infinity;
    t.forEach(pT => { const d = dist(pU, pT); if (d < minD) minD = d; });
    totalError += minD;
  });
  let reverseError = 0;
  t.forEach(pT => {
    let minD = Infinity;
    u.forEach(pU => { const d = dist(pT, pU); if (d < minD) minD = d; });
    reverseError += minD;
  });
  const avgError = (totalError / u.length + reverseError / t.length) / 2;
  const score = Math.max(0, 100 - (avgError * 450)); 
  return Math.round(score);
};