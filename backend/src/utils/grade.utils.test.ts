import { toLetterGrade, weightedAverage } from './grade.utils';

describe('grade utils', () => {
  it.each([
    [95, 'A'],
    [85, 'B'],
    [72, 'C'],
    [60, 'D'],
    [40, 'F'],
  ])('maps %d%% to %s', (pct, letter) => {
    expect(toLetterGrade(pct)).toBe(letter);
  });

  it('computes a weighted average (30% homework + 70% exam)', () => {
    const avg = weightedAverage([
      { score: 80, maxScore: 100, weight: 0.3 },
      { score: 90, maxScore: 100, weight: 0.7 },
    ]);
    expect(avg).toBe(87); // 80*0.3 + 90*0.7
  });

  it('returns 0 when there are no items', () => {
    expect(weightedAverage([])).toBe(0);
  });
});
