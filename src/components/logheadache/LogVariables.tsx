
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define variable types for consistent processing
export type VariableType = 'trigger' | 'symptom' | 'treatment' | 'neutral';
export type VariableValueType = 'numeric' | 'scale' | 'boolean' | 'selection' | 'text';
export type VariableTrackingTime = 'before' | 'during' | 'after';

interface VariableDefinition {
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

// Predefined variable templates that users can choose from
const VARIABLE_TEMPLATES: VariableDefinition[] = [
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

interface WeatherData {
  condition: string;
  temperature: number;
  humidity: number;
}

export default function LogVariables() {
  const navigate = useNavigate();
  const [selectedVariables, setSelectedVariables] = useState<VariableDefinition[]>([]);
  const [customVariableName, setCustomVariableName] = useState('');
  const [customVariableType, setCustomVariableType] = useState<VariableType>('trigger');
  const [customValueType, setCustomValueType] = useState<VariableValueType>('scale');
  const [customTrackingTime, setCustomTrackingTime] = useState<VariableTrackingTime>('before');
  const [customDescription, setCustomDescription] = useState('');
  const [variableSelectionStep, setVariableSelectionStep] = useState<boolean>(true);
  const [editing, setEditing] = useState<boolean>(false);
  const [finalReview, setFinalReview] = useState<boolean>(false);
  const [variableOptions, setVariableOptions] = useState<string[]>([]);
  const [currentEditingVariable, setCurrentEditingVariable] = useState<VariableDefinition | null>(null);
  
  const MAX_VARIABLES = 4;
  const remainingSlots = MAX_VARIABLES - selectedVariables.length;

  // Weather API Integration (could be used for one of the variables)
  const { data: weatherData } = useQuery({
    queryKey: ['weather'],
    queryFn: async (): Promise<WeatherData> => {
      try {
        // Note: In a real app, you'd want to handle location permission and use a real weather API
        // This is just a mock implementation
        return {
          condition: 'sunny',
          temperature: 22,
          humidity: 45
        };
      } catch (error) {
        toast("Weather data unavailable", {
          description: "Using manual weather input instead"
        });
        throw error;
      }
    },
    enabled: true, // Enable the query by default
  });

  const handleAddVariable = (template?: VariableDefinition) => {
    if (selectedVariables.length >= MAX_VARIABLES) {
      toast.error("Maximum variable limit reached", {
        description: "You can only track up to 4 variables"
      });
      return;
    }

    if (template) {
      // Add predefined template
      if (!selectedVariables.some(v => v.id === template.id)) {
        setSelectedVariables([...selectedVariables, template]);
        toast.success("Variable added", {
          description: `${template.name} has been added to your tracking list`
        });
      } else {
        toast.error("Variable already added", {
          description: "This variable is already in your tracking list"
        });
      }
    } else {
      // Add custom variable
      if (!customVariableName.trim()) {
        toast.error("Missing information", {
          description: "Please provide a name for your variable"
        });
        return;
      }

      const newVariable: VariableDefinition = {
        id: `custom_${Date.now()}`,
        name: customVariableName,
        description: customDescription || `Track ${customVariableName.toLowerCase()}`,
        type: customVariableType,
        valueType: customValueType,
        trackingTime: customTrackingTime,
        options: customValueType === 'selection' ? variableOptions : undefined,
        min: customValueType === 'scale' || customValueType === 'numeric' ? 0 : undefined,
        max: customValueType === 'scale' ? 10 : (customValueType === 'numeric' ? 100 : undefined),
        defaultValue: customValueType === 'scale' ? 5 : (customValueType === 'numeric' ? 0 : (customValueType === 'boolean' ? false : ''))
      };

      setSelectedVariables([...selectedVariables, newVariable]);
      
      // Reset form
      setCustomVariableName('');
      setCustomDescription('');
      setCustomVariableType('trigger');
      setCustomValueType('scale');
      setCustomTrackingTime('before');
      setVariableOptions([]);
      
      toast.success("Custom variable added", {
        description: `${newVariable.name} has been added to your tracking list`
      });
    }
  };

  const handleRemoveVariable = (variable: VariableDefinition) => {
    setSelectedVariables(selectedVariables.filter(v => v.id !== variable.id));
    toast.info("Variable removed", {
      description: `${variable.name} has been removed from your tracking list`
    });
  };

  const handleEditVariable = (variable: VariableDefinition) => {
    setCurrentEditingVariable(variable);
    setCustomVariableName(variable.name);
    setCustomDescription(variable.description);
    setCustomVariableType(variable.type);
    setCustomValueType(variable.valueType);
    setCustomTrackingTime(variable.trackingTime);
    setVariableOptions(variable.options || []);
    setEditing(true);
    setVariableSelectionStep(false);
  };

  const handleUpdateVariable = () => {
    if (!currentEditingVariable) return;
    
    const updatedVariable: VariableDefinition = {
      ...currentEditingVariable,
      name: customVariableName,
      description: customDescription,
      type: customVariableType,
      valueType: customValueType,
      trackingTime: customTrackingTime,
      options: customValueType === 'selection' ? variableOptions : undefined,
    };

    setSelectedVariables(
      selectedVariables.map(v => v.id === currentEditingVariable.id ? updatedVariable : v)
    );

    // Reset edit mode
    setEditing(false);
    setVariableSelectionStep(true);
    setCurrentEditingVariable(null);
    setCustomVariableName('');
    setCustomDescription('');
    setCustomVariableType('trigger');
    setCustomValueType('scale');
    setCustomTrackingTime('before');
    setVariableOptions([]);

    toast.success("Variable updated", {
      description: `${updatedVariable.name} has been updated`
    });
  };

  const handleAddOption = (option: string) => {
    if (option && !variableOptions.includes(option)) {
      setVariableOptions([...variableOptions, option]);
    }
  };

  const handleRemoveOption = (option: string) => {
    setVariableOptions(variableOptions.filter(o => o !== option));
  };

  const handleSaveVariables = () => {
    // This would save to your backend/database
    console.log('Saving variables to database:', selectedVariables);
    
    // Structure the data in a way that makes backend processing easier
    const variableConfig = {
      userId: 'user123', // This would come from auth
      variables: selectedVariables.map(variable => ({
        variableId: variable.id,
        name: variable.name,
        type: variable.type,
        valueType: variable.valueType,
        trackingTime: variable.trackingTime,
        options: variable.options,
        min: variable.min,
        max: variable.max,
        defaultValue: variable.defaultValue
      })),
      createdAt: new Date().toISOString(),
      modifiedAt: null, // This setup prevents modification
      // The selection is locked after saving
      locked: true
    };
    
    console.log('Variable configuration for database:', variableConfig);
    
    toast.success("Variables saved successfully", {
      description: "Your variables have been locked and cannot be modified"
    });
    
    // Navigate back to the log page or dashboard
    navigate('/log');
  };

  const handleCancel = () => {
    if (editing) {
      // Cancel editing
      setEditing(false);
      setVariableSelectionStep(true);
      setCurrentEditingVariable(null);
      setCustomVariableName('');
      setCustomDescription('');
      setCustomVariableType('trigger');
      setCustomValueType('scale');
      setCustomTrackingTime('before');
      setVariableOptions([]);
    } else if (finalReview) {
      // Back from final review
      setFinalReview(false);
    } else if (!variableSelectionStep) {
      // Back to variable selection
      setVariableSelectionStep(true);
    } else {
      // Cancel the whole process
      navigate('/log');
    }
  };

  // Get available variable templates (filtering out already selected ones)
  const availableTemplates = VARIABLE_TEMPLATES.filter(
    template => !selectedVariables.some(v => v.id === template.id)
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 pb-20">
      <header className="flex items-center justify-between mb-6">
        <button className="text-gray-400" onClick={handleCancel}>
          <i className="fa-solid fa-chevron-left text-xl"></i>
        </button>
        <h1 className="text-xl font-semibold">
          {finalReview 
            ? "Review Variables" 
            : (editing 
                ? `Edit ${currentEditingVariable?.name}` 
                : (variableSelectionStep 
                    ? "Custom Variables" 
                    : "Add New Variable"))}
        </h1>
        <div className="w-8"></div> {/* Spacer for alignment */}
      </header>

      {/* Warning Banner */}
      <div className="mb-6 bg-amber-500/20 border border-amber-500/30 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <i className="fa-solid fa-triangle-exclamation text-amber-500 mt-1"></i>
          <p className="text-sm text-amber-200">Variables cannot be modified after submission. Please review carefully before saving.</p>
        </div>
      </div>

      {/* Variable Counter */}
      <section className="mb-6 bg-indigo-500/10 rounded-xl p-4 border border-indigo-500/20">
        <div className="flex items-center justify-between">
          <span className="text-indigo-300">Variables Added</span>
          <span className="text-xl font-semibold text-indigo-300">{selectedVariables.length}/{MAX_VARIABLES}</span>
        </div>
      </section>

      {/* Main Content */}
      {finalReview ? (
        // Final Review Screen
        <Card className="bg-gray-800/50 border-white/10 mb-6">
          <div className="p-6 space-y-6">
            <h2 className="text-lg font-medium text-white mb-4">Final Review</h2>
            
            {selectedVariables.length > 0 ? (
              <div className="space-y-4">
                {selectedVariables.map((variable, index) => (
                  <div key={variable.id} className="bg-gray-700/30 rounded-lg p-4 border border-gray-600 relative">
                    <h3 className="font-medium text-indigo-300">{variable.name}</h3>
                    <div className="text-sm text-gray-400 mt-1">{variable.description}</div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-400">
                      <div>Type: <span className="text-gray-300 capitalize">{variable.type}</span></div>
                      <div>Value: <span className="text-gray-300 capitalize">{variable.valueType}</span></div>
                      <div>Timing: <span className="text-gray-300 capitalize">{variable.trackingTime}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>No variables added yet.</p>
              </div>
            )}
            
            <div className="border-t border-gray-700 pt-6 flex justify-between">
              <Button variant="outline" onClick={() => setFinalReview(false)} className="bg-gray-700/30 border-gray-600">
                Back to Edit
              </Button>
              <Button
                onClick={handleSaveVariables}
                className="bg-indigo-600 hover:bg-indigo-700"
                disabled={selectedVariables.length === 0}
              >
                Save & Lock Variables
              </Button>
            </div>
          </div>
        </Card>
      ) : variableSelectionStep ? (
        // Variable Selection Step
        <div className="space-y-6">
          {/* Selected Variables */}
          {selectedVariables.length > 0 && (
            <Card className="bg-gray-800/50 border-white/10 mb-6">
              <div className="p-6 space-y-6">
                <h2 className="text-lg font-medium text-white">Selected Variables</h2>
                <div className="space-y-3">
                  {selectedVariables.map(variable => (
                    <div key={variable.id} className="bg-gray-700/30 rounded-lg p-4 border border-gray-600 flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-white">{variable.name}</h3>
                        <p className="text-sm text-gray-400">{variable.description}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditVariable(variable)}
                          className="bg-gray-600/50 border-gray-500"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveVariable(variable)}
                          className="bg-red-900/30 border-red-800/50 text-red-300 hover:bg-red-900/50"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Variable Templates */}
          {remainingSlots > 0 && (
            <Card className="bg-gray-800/50 border-white/10 mb-6">
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium text-white">Available Templates</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setVariableSelectionStep(false)}
                    className="bg-indigo-900/30 border-indigo-500/30 text-indigo-300"
                  >
                    Create Custom
                  </Button>
                </div>
                <div className="space-y-3">
                  {availableTemplates.length > 0 ? (
                    availableTemplates.map(template => (
                      <div key={template.id} className="bg-gray-700/30 rounded-lg p-4 border border-gray-600 flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-white">{template.name}</h3>
                          <p className="text-sm text-gray-400">{template.description}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddVariable(template)}
                          className="bg-indigo-900/30 border-indigo-500/30 text-indigo-300"
                        >
                          Add
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-400">
                      <p>No more templates available.</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900/95 border-t border-gray-800">
            <div className="flex space-x-3">
              <Button
                variant="outline"
                className="flex-1 bg-gray-800 text-gray-300"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-indigo-600 text-white"
                onClick={() => setFinalReview(true)}
                disabled={selectedVariables.length === 0}
              >
                Review & Save
              </Button>
            </div>
          </div>
        </div>
      ) : (
        // Custom Variable Form
        <Card className="bg-gray-800/50 border-white/10 mb-20">
          <div className="p-6 space-y-6">
            <h2 className="text-lg font-medium text-white">{editing ? 'Edit Variable' : 'Create Custom Variable'}</h2>

            <div className="space-y-4">
              <div>
                <Label className="text-white/60 mb-2 block">Variable Name</Label>
                <Input
                  value={customVariableName}
                  onChange={(e) => setCustomVariableName(e.target.value)}
                  placeholder="Enter variable name"
                  className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>

              <div>
                <Label className="text-white/60 mb-2 block">Description</Label>
                <Textarea
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  placeholder="Describe what this variable tracks"
                  className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>

              <div>
                <Label className="text-white/60 mb-2 block">Variable Type</Label>
                <RadioGroup value={customVariableType} onValueChange={(value) => setCustomVariableType(value as VariableType)}>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center space-x-3 bg-gray-700/30 border border-gray-600 rounded-lg p-4">
                      <RadioGroupItem value="trigger" id="trigger" className="text-indigo-500" />
                      <Label htmlFor="trigger" className="text-gray-300">Trigger</Label>
                    </div>
                    <div className="flex items-center space-x-3 bg-gray-700/30 border border-gray-600 rounded-lg p-4">
                      <RadioGroupItem value="symptom" id="symptom" className="text-indigo-500" />
                      <Label htmlFor="symptom" className="text-gray-300">Symptom</Label>
                    </div>
                    <div className="flex items-center space-x-3 bg-gray-700/30 border border-gray-600 rounded-lg p-4">
                      <RadioGroupItem value="treatment" id="treatment" className="text-indigo-500" />
                      <Label htmlFor="treatment" className="text-gray-300">Treatment</Label>
                    </div>
                    <div className="flex items-center space-x-3 bg-gray-700/30 border border-gray-600 rounded-lg p-4">
                      <RadioGroupItem value="neutral" id="neutral" className="text-indigo-500" />
                      <Label htmlFor="neutral" className="text-gray-300">Neutral Factor</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-white/60 mb-2 block">Tracking Time</Label>
                <RadioGroup value={customTrackingTime} onValueChange={(value) => setCustomTrackingTime(value as VariableTrackingTime)}>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center space-x-3 bg-gray-700/30 border border-gray-600 rounded-lg p-4">
                      <RadioGroupItem value="before" id="before" className="text-indigo-500" />
                      <Label htmlFor="before" className="text-gray-300">Before Headache</Label>
                    </div>
                    <div className="flex items-center space-x-3 bg-gray-700/30 border border-gray-600 rounded-lg p-4">
                      <RadioGroupItem value="during" id="during" className="text-indigo-500" />
                      <Label htmlFor="during" className="text-gray-300">During Headache</Label>
                    </div>
                    <div className="flex items-center space-x-3 bg-gray-700/30 border border-gray-600 rounded-lg p-4">
                      <RadioGroupItem value="after" id="after" className="text-indigo-500" />
                      <Label htmlFor="after" className="text-gray-300">After Headache</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-white/60 mb-2 block">Value Type</Label>
                <RadioGroup value={customValueType} onValueChange={(value) => setCustomValueType(value as VariableValueType)}>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center space-x-3 bg-gray-700/30 border border-gray-600 rounded-lg p-4">
                      <RadioGroupItem value="scale" id="scale" className="text-indigo-500" />
                      <Label htmlFor="scale" className="text-gray-300">Scale (0-10)</Label>
                    </div>
                    <div className="flex items-center space-x-3 bg-gray-700/30 border border-gray-600 rounded-lg p-4">
                      <RadioGroupItem value="numeric" id="numeric" className="text-indigo-500" />
                      <Label htmlFor="numeric" className="text-gray-300">Numeric Value</Label>
                    </div>
                    <div className="flex items-center space-x-3 bg-gray-700/30 border border-gray-600 rounded-lg p-4">
                      <RadioGroupItem value="boolean" id="boolean" className="text-indigo-500" />
                      <Label htmlFor="boolean" className="text-gray-300">Yes/No</Label>
                    </div>
                    <div className="flex items-center space-x-3 bg-gray-700/30 border border-gray-600 rounded-lg p-4">
                      <RadioGroupItem value="selection" id="selection" className="text-indigo-500" />
                      <Label htmlFor="selection" className="text-gray-300">Multiple Options</Label>
                    </div>
                    <div className="flex items-center space-x-3 bg-gray-700/30 border border-gray-600 rounded-lg p-4">
                      <RadioGroupItem value="text" id="text" className="text-indigo-500" />
                      <Label htmlFor="text" className="text-gray-300">Text Entry</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Options for selection type */}
              {customValueType === 'selection' && (
                <div className="space-y-3">
                  <Label className="text-white/60 mb-2 block">Options</Label>
                  
                  {variableOptions.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {variableOptions.map((option, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-gray-700/50 rounded p-2 border border-gray-600">
                          <span className="text-gray-300">{option}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveOption(option)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add an option"
                      className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddOption((e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                    />
                    <Button
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        handleAddOption(input.value);
                        input.value = '';
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Fixed Action Buttons (only show for custom variable form) */}
      {!variableSelectionStep && !finalReview && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900/95 border-t border-gray-800">
          <div className="flex space-x-3">
            <Button
              variant="outline"
              className="flex-1 bg-gray-800 text-gray-300"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-indigo-600 text-white"
              onClick={editing ? handleUpdateVariable : () => handleAddVariable()}
              disabled={!customVariableName || (customValueType === 'selection' && variableOptions.length < 2)}
            >
              {editing ? 'Update Variable' : 'Add Variable'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
