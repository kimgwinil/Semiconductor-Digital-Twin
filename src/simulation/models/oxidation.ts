/**
 * Deal-Grove Model Implementation for educational purposes.
 * x^2 + A*x = B(t + tau)
 * x = [-A + sqrt(A^2 + 4B(t + tau))] / 2
 * 
 * B = Parabolic rate constant
 * B/A = Linear rate constant
 * Values approximated for educational ranges (800-1200°C)
 */

interface OxidationInput {
  temperature: number; // °C
  timeMin: number; // minutes
  isWet: boolean;
  initialOxideNm?: number;
}

interface OxidationOutput {
  actualThicknessNm: number;
}

export function calculateOxideThickness({
  temperature,
  timeMin,
  isWet,
  initialOxideNm = 0
}: OxidationInput): OxidationOutput {
  // Convert T to Kelvin
  const T = temperature + 273.15;
  const k = 8.617e-5; // Boltzmann eV/K

  // Empirical activation energies and pre-exponential factors
  // (Simplified for educational simulation, yielding realistic ~10-1000nm values)
  
  let Ea_B, Ea_BA, C_B, C_BA;

  if (isWet) {
    // Wet Oxidation (H2O) - Faster
    Ea_B = 0.71; 
    C_B = 3.86e2; // um^2/hr
    Ea_BA = 2.05;
    C_BA = 1.63e8; // um/hr
  } else {
    // Dry Oxidation (O2) - Slower
    Ea_B = 1.24;
    C_B = 7.72e2;
    Ea_BA = 2.0;
    C_BA = 6.23e6;
  }

  // Calculate Rate Constants (in um and hr)
  const B = C_B * Math.exp(-Ea_B / (k * T));
  const BA = C_BA * Math.exp(-Ea_BA / (k * T));
  const A = B / BA;

  // Convert time to hours
  const t_hr = timeMin / 60;

  // Account for initial oxide (convert to um)
  const xi = initialOxideNm / 1000;
  
  // Calculate tau (time to grow initial oxide)
  const tau = (xi * xi + A * xi) / B;

  // Deal-Grove formula
  const t_total = t_hr + tau;
  
  let thicknessUm = 0;
  if (t_total > 0) {
     thicknessUm = (-A + Math.sqrt(A * A + 4 * B * t_total)) / 2;
  }

  // Convert back to nm
  const actualThicknessNm = thicknessUm * 1000;

  return {
    actualThicknessNm: Number(actualThicknessNm.toFixed(2))
  };
}
