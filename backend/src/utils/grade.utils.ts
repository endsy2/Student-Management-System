/** Default grade scale per the spec. Highest threshold first. */
export const GRADE_SCALE: { letter: string; min: number }[] = [
  { letter: 'A', min: 90 },
  { letter: 'B', min: 80 },
  { letter: 'C', min: 70 },
  { letter: 'D', min: 60 },
  { letter: 'F', min: 0 },
];

/** Converts a percentage (0–100) to a letter grade. */
export function toLetterGrade(percentage: number): string {
  return GRADE_SCALE.find((g) => percentage >= g.min)?.letter ?? 'F';
}

export interface WeightedItem {
  score: number;
  maxScore: number;
  weight: number;
}

/** Weighted average as a percentage (0–100). */
export function weightedAverage(items: WeightedItem[]): number {
  const totalWeight = items.reduce((sum, i) => sum + i.weight, 0);
  if (totalWeight === 0) return 0;
  const weighted = items.reduce((sum, i) => sum + (i.score / i.maxScore) * 100 * i.weight, 0);
  return Math.round((weighted / totalWeight) * 100) / 100;
}
