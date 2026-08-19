export interface HmiMetric {
  id: string;
  label: string;
  unit: string;
  setpoint: number;
  actual: number;
  tolerance: number;
}

export function advanceActualValues(metrics: HmiMetric[], running: boolean): HmiMetric[] {
  return metrics.map((metric) => {
    const target = running ? metric.setpoint : Math.min(metric.setpoint, metric.actual);
    const ratio = Math.abs(metric.actual - target) / Math.max(Math.abs(target), 1);
    const response = running ? (ratio > 100 ? 0.62 : ratio > 10 ? 0.38 : 0.18) : 0.06;
    const next = metric.actual + (target - metric.actual) * response;
    return { ...metric, actual: Math.abs(target - next) < 0.01 ? target : next };
  });
}

export function metricWithinTolerance(metric: HmiMetric): boolean {
  return Math.abs(metric.actual - metric.setpoint) <= metric.tolerance;
}

export function calculateProcessYield(baseYield: number, faultLoss: number, outOfToleranceCount: number): number {
  return Math.max(0, Math.min(100, baseYield - faultLoss - outOfToleranceCount * 1.5));
}
