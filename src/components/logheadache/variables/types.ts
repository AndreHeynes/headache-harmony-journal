
export type VariableType = 'trigger' | 'symptom' | 'treatment' | 'neutral';
export type VariableValueType = 'numeric' | 'scale' | 'boolean' | 'selection' | 'text';
export type VariableTrackingTime = 'before' | 'during' | 'after';

export interface VariableDefinition {
  id: string;
  name: string;
  description: string;
  type: VariableType;
  valueType: VariableValueType;
  trackingTime: VariableTrackingTime;
  options?: string[]; // For selection type
  min?: number; // For scale/numeric types
  max?: number; // For scale/numeric types
  defaultValue?: any;
}

export interface WeatherData {
  condition: string;
  temperature: number;
  humidity: number;
}
