
import { VariableDefinition } from './types';

// Predefined variable templates that users can choose from
export const VARIABLE_TEMPLATES: VariableDefinition[] = [
  {
    id: 'stress',
    name: 'Stress Level',
    description: 'Track your stress level before headaches',
    type: 'trigger',
    valueType: 'scale',
    trackingTime: 'before',
    min: 0,
    max: 10,
    defaultValue: 5
  },
  {
    id: 'sleep',
    name: 'Sleep Quality',
    description: 'Rate your sleep quality',
    type: 'trigger',
    valueType: 'selection',
    trackingTime: 'before',
    options: ['excellent', 'good', 'fair', 'poor'],
    defaultValue: ''
  },
  {
    id: 'water',
    name: 'Water Intake',
    description: 'Number of glasses of water per day',
    type: 'trigger',
    valueType: 'numeric',
    trackingTime: 'before',
    min: 0,
    max: 20,
    defaultValue: 0
  },
  {
    id: 'light',
    name: 'Light Sensitivity',
    description: 'Select your light sensitivity level',
    type: 'symptom',
    valueType: 'selection',
    trackingTime: 'during',
    options: ['none', 'mild', 'moderate', 'severe'],
    defaultValue: ''
  },
  {
    id: 'weather',
    name: 'Weather Condition',
    description: 'Current weather condition',
    type: 'trigger',
    valueType: 'selection',
    trackingTime: 'before',
    options: ['sunny', 'cloudy', 'rainy', 'stormy', 'humid', 'dry'],
    defaultValue: ''
  },
  {
    id: 'cycle',
    name: 'Menstrual Cycle',
    description: 'Track menstrual cycle phase',
    type: 'trigger',
    valueType: 'selection',
    trackingTime: 'before',
    options: ['menstrual', 'follicular', 'ovulation', 'luteal'],
    defaultValue: ''
  },
  {
    id: 'noise',
    name: 'Noise Sensitivity',
    description: 'Select your noise sensitivity level',
    type: 'symptom',
    valueType: 'selection',
    trackingTime: 'during',
    options: ['none', 'mild', 'moderate', 'severe'],
    defaultValue: ''
  },
  {
    id: 'caffeine',
    name: 'Caffeine Intake',
    description: 'Number of caffeinated drinks consumed',
    type: 'trigger',
    valueType: 'numeric',
    trackingTime: 'before',
    min: 0,
    max: 10,
    defaultValue: 0
  },
  {
    id: 'screen_time',
    name: 'Screen Time',
    description: 'Hours spent looking at screens',
    type: 'trigger',
    valueType: 'numeric',
    trackingTime: 'before',
    min: 0,
    max: 24,
    defaultValue: 0
  },
  {
    id: 'medication_effective',
    name: 'Medication Effectiveness',
    description: 'How effective was your medication?',
    type: 'treatment',
    valueType: 'scale',
    trackingTime: 'after',
    min: 0,
    max: 10,
    defaultValue: 5
  }
];
