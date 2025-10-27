export type LevelConfig = {
  id: number;
  rows: number;
  cols: number;
  timeSeconds: number;
};

export const LEVELS: LevelConfig[] = [
  { id: 1, rows: 2, cols: 3, timeSeconds: 90 },
  { id: 2, rows: 3, cols: 4, timeSeconds: 80 },
  { id: 3, rows: 4, cols: 4, timeSeconds: 70 },
  { id: 4, rows: 4, cols: 5, timeSeconds: 60 },
  { id: 5, rows: 5, cols: 6, timeSeconds: 50 },
  { id: 6, rows: 6, cols: 6, timeSeconds: 45 },
  { id: 7, rows: 6, cols: 7, timeSeconds: 40 },
  { id: 8, rows: 6, cols: 8, timeSeconds: 35 },
  { id: 9, rows: 7, cols: 8, timeSeconds: 30 },
  { id: 10, rows: 8, cols: 8, timeSeconds: 25 },
];
