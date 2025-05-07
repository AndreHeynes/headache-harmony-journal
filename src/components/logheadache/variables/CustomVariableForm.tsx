
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { VariableType, VariableValueType, VariableTrackingTime } from './types';

interface CustomVariableFormProps {
  isEditing: boolean;
  variableName: string;
  setVariableName: (name: string) => void;
  description: string;
  setDescription: (desc: string) => void;
  variableType: VariableType;
  setVariableType: (type: VariableType) => void;
  valueType: VariableValueType;
  setValueType: (type: VariableValueType) => void;
  trackingTime: VariableTrackingTime;
  setTrackingTime: (time: VariableTrackingTime) => void;
  options: string[];
  setOptions: (options: string[]) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

export function CustomVariableForm({
  isEditing,
  variableName,
  setVariableName,
  description,
  setDescription,
  variableType,
  setVariableType,
  valueType,
  setValueType,
  trackingTime,
  setTrackingTime,
  options,
  setOptions,
  onCancel,
  onSubmit
}: CustomVariableFormProps) {
  const [newOption, setNewOption] = useState('');

  const handleAddOption = (option: string) => {
    if (option && !options.includes(option)) {
      setOptions([...options, option]);
      setNewOption('');
    }
  };

  const handleRemoveOption = (option: string) => {
    setOptions(options.filter(o => o !== option));
  };

  return (
    <Card className="bg-gray-800/50 border-white/10 mb-20">
      <div className="p-6 space-y-6">
        <h2 className="text-lg font-medium text-white">{isEditing ? 'Edit Variable' : 'Create Custom Variable'}</h2>

        <div className="space-y-4">
          <div>
            <Label className="text-white/60 mb-2 block">Variable Name</Label>
            <Input
              value={variableName}
              onChange={(e) => setVariableName(e.target.value)}
              placeholder="Enter variable name"
              className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
            />
          </div>

          <div>
            <Label className="text-white/60 mb-2 block">Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this variable tracks"
              className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
            />
          </div>

          <div>
            <Label className="text-white/60 mb-2 block">Variable Type</Label>
            <RadioGroup value={variableType} onValueChange={(value) => setVariableType(value as VariableType)}>
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
            <RadioGroup value={trackingTime} onValueChange={(value) => setTrackingTime(value as VariableTrackingTime)}>
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
            <RadioGroup value={valueType} onValueChange={(value) => setValueType(value as VariableValueType)}>
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
          {valueType === 'selection' && (
            <div className="space-y-3">
              <Label className="text-white/60 mb-2 block">Options</Label>
              
              {options.length > 0 && (
                <div className="space-y-2 mb-3">
                  {options.map((option, idx) => (
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
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddOption(newOption);
                    }
                  }}
                />
                <Button
                  onClick={() => handleAddOption(newOption)}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Add
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900/95 border-t border-gray-800">
        <div className="flex space-x-3">
          <Button
            variant="outline"
            className="flex-1 bg-gray-800 text-gray-300"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-indigo-600 text-white"
            onClick={onSubmit}
            disabled={!variableName || (valueType === 'selection' && options.length < 2)}
          >
            {isEditing ? 'Update Variable' : 'Add Variable'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
