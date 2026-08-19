/**
 * Packaging Thermal Model
 * 
 * Junction Temperature: Tj = Ta + P * θJA
 */

interface PackagingInput {
  power: number; // W
  thermalResistance: number; // °C/W
  ambientTemp: number; // °C
}

interface PackagingOutput {
  junctionTemp: number; // °C
  pass: boolean;
}

export function calculatePackaging({
  power,
  thermalResistance,
  ambientTemp
}: PackagingInput): PackagingOutput {
  
  const junctionTemp = ambientTemp + (power * thermalResistance);
  
  // Typical maximum junction temperature constraint
  const pass = junctionTemp <= 125;

  return {
    junctionTemp: Number(junctionTemp.toFixed(2)),
    pass
  };
}
