/**
 * Wafer Manufacturing Model
 * 
 * Gross Dies Per Wafer (DPW) Approximation
 * DPW ≈ π(D/2)² / A_die − πD / √(2A_die)
 */

interface WaferInput {
  diameter: number; // mm (200 or 300)
  dieWidth: number; // mm
  dieHeight: number; // mm
}

interface WaferOutput {
  grossDies: number;
  dieArea: number; // mm^2
}

export function calculateWafer({
  diameter,
  dieWidth,
  dieHeight
}: WaferInput): WaferOutput {
  const dieArea = dieWidth * dieHeight;
  const radius = diameter / 2;
  
  // Wafer area
  const waferArea = Math.PI * radius * radius;
  
  // Edge loss approximation
  const edgeLoss = (Math.PI * diameter) / Math.sqrt(2 * dieArea);
  
  let dpw = Math.floor(waferArea / dieArea - edgeLoss);
  
  if (dpw < 0 || dieArea === 0) {
    dpw = 0;
  }

  return {
    grossDies: dpw,
    dieArea: Number(dieArea.toFixed(2))
  };
}
