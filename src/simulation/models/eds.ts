/**
 * EDS (Electrical Die Sorting) Model
 * 
 * Yield Model (Poisson): Y = exp(-A * D)
 * A = Die Area (cm^2)
 * D = Defect Density (defects/cm^2)
 */

interface EdsInput {
  totalDies: number;
  dieAreaMm2: number; // mm^2
  defectDensity: number; // defects/cm^2
}

interface EdsOutput {
  goodDies: number;
  yieldPercent: number;
  pass: boolean;
}

export function calculateEDS({
  totalDies,
  dieAreaMm2,
  defectDensity
}: EdsInput): EdsOutput {
  
  // Convert mm^2 to cm^2
  const dieAreaCm2 = dieAreaMm2 / 100;

  // Poisson Yield Model
  const yieldRate = Math.exp(-defectDensity * dieAreaCm2);
  
  const goodDies = Math.floor(totalDies * yieldRate);
  const yieldPercent = yieldRate * 100;

  return {
    goodDies,
    yieldPercent: Number(yieldPercent.toFixed(2)),
    pass: yieldPercent >= 80 // Example target yield
  };
}
