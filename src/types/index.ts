export interface User {
  id: string;
  name: string;
  organization: string;
  department: string;
  studentId: string;
  course: string;
  role: 'STUDENT' | 'INSTRUCTOR';
}

export interface WaferState {
  id: string;
  diameter: number; // mm
  layers: WaferLayer[];
  processHistory: ProcessRecord[];
}

export interface WaferLayer {
  material: string;
  thickness: number; // nm
  color: string;
}

export interface ProcessRecord {
  module: string;
  timestamp: number;
  parameterSet: Record<string, any>;
  result: Record<string, any>;
}

export interface SimulationResult {
  targetValue: number;
  actualValue: number;
  measuredValue: number;
  measurementError: number;
  errorPercent: number;
  pass: boolean;
  unit: string;
}

export interface AppState {
  user: User | null;
  wafer: WaferState | null;
  currentModule: string;
}
