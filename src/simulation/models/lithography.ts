/**
 * Rayleigh Criterion & Lithography Dose Model
 * 
 * Resolution (R) = k1 * (λ / NA)
 * Actual CD depends on Exposure Dose (E)
 */

interface LithoInput {
  wavelength: number; // nm
  na: number; // Numerical Aperture
  dose: number; // mJ/cm2
  targetCD?: number; // nm
}

interface LithoOutput {
  resolutionLimit: number;
  actualCD: number;
  isResolutionFailed: boolean;
  message: string;
}

export function calculateLithography({
  wavelength,
  na,
  dose,
  targetCD = 100 // Default 100nm target
}: LithoInput): LithoOutput {
  // Educational k1 factor
  const k1 = 0.6;
  
  // Rayleigh Resolution Limit
  const resolutionLimit = k1 * (wavelength / na);
  
  // Is the target printable? 
  // If resolution limit is significantly larger than target, pattern collapses
  const isResolutionFailed = resolutionLimit > targetCD * 1.2;

  let actualCD = 0;
  let message = "OK";

  if (isResolutionFailed) {
    actualCD = 0; // Pattern failed to resolve
    message = "Resolution Limit Exceeded (Pattern Collapsed)";
  } else {
    // Optimal dose for target CD is assumed to be 30 mJ/cm2
    const optimalDose = 30; 
    
    // Positive PR: Higher dose = smaller remaining line width
    const doseSensitivity = 1.5; // nm per mJ/cm2
    
    actualCD = targetCD - (dose - optimalDose) * doseSensitivity;
    
    // Clamp to realistic physical bounds
    if (actualCD < 0) {
      actualCD = 0;
      message = "Overexposed (Pattern completely removed)";
    } else if (actualCD > targetCD * 1.5) {
      message = "Underexposed (Pattern too thick/bridging)";
    }
  }

  return {
    resolutionLimit: Number(resolutionLimit.toFixed(2)),
    actualCD: Number(actualCD.toFixed(2)),
    isResolutionFailed,
    message
  };
}
