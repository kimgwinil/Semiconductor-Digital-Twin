/**
 * Dry Etch (RIE) Model
 * 
 * Etch Depth = Etch Rate * Time
 * Etch Rate depends on RF Power
 * Anisotropy depends on Pressure
 */

interface EtchInput {
  rfPower: number; // W
  pressure: number; // mTorr
  timeSec: number; // sec
}

interface EtchOutput {
  etchRate: number; // nm/s
  etchDepth: number; // nm
  undercut: number; // nm (lateral etch)
  anisotropy: number; // 0 to 1
}

export function calculateEtch({
  rfPower,
  pressure,
  timeSec
}: EtchInput): EtchOutput {
  
  // 1. Etch Rate calculation
  // Base etch rate driven by ion energy (RF power)
  // Moderate pressure increases radical density but too high reduces mean free path
  // Educational simplified model:
  const baseRate = rfPower * 0.005; // 1000W -> 5 nm/s
  
  // Pressure modifier (peaks around 50 mTorr for rate, but reduces anisotropy)
  const pressureMod = 1 - Math.pow((pressure - 50) / 100, 2); 
  const etchRate = baseRate * pressureMod;

  // 2. Etch Depth
  const etchDepth = etchRate * timeSec;

  // 3. Anisotropy & Undercut
  // Higher pressure = more collisions = more isotropic (lower anisotropy)
  // Range: 10 mTorr -> ~0.95, 100 mTorr -> ~0.5
  let anisotropy = 1 - (pressure / 200); 
  anisotropy = Math.max(0.1, Math.min(1.0, anisotropy));

  const undercut = etchDepth * (1 - anisotropy);

  return {
    etchRate: Number(etchRate.toFixed(2)),
    etchDepth: Number(etchDepth.toFixed(2)),
    undercut: Number(undercut.toFixed(2)),
    anisotropy: Number(anisotropy.toFixed(2))
  };
}
