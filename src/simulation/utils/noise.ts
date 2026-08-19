export function generateMeasurementNoise(actualValue: number, tolerancePct: number = 0.01): number {
  // Simple seeded-like noise or random within tolerance
  // For education, we want it slight but noticeable
  const errorRange = actualValue * tolerancePct;
  const noise = (Math.random() * 2 - 1) * errorRange;
  return Number((actualValue + noise).toFixed(2));
}
