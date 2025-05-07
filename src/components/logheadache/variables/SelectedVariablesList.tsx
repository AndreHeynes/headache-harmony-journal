
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { VariableDefinition } from './types';

interface SelectedVariablesListProps {
  variables: VariableDefinition[];
  onEdit: (variable: VariableDefinition) => void;
  onRemove: (variable: VariableDefinition) => void;
}

export function SelectedVariablesList({ variables, onEdit, onRemove }: SelectedVariablesListProps) {
  if (variables.length === 0) {
    return null;
  }

  return (
    <Card className="bg-gray-800/50 border-white/10 mb-6">
      <div className="p-6 space-y-6">
        <h2 className="text-lg font-medium text-white">Selected Variables</h2>
        <div className="space-y-3">
          {variables.map(variable => (
            <div key={variable.id} className="bg-gray-700/30 rounded-lg p-4 border border-gray-600 flex justify-between items-center">
              <div>
                <h3 className="font-medium text-white">{variable.name}</h3>
                <p className="text-sm text-gray-400">{variable.description}</p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(variable)}
                  className="bg-gray-600/50 border-gray-500"
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRemove(variable)}
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
  );
}
