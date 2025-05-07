
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { VariableDefinition } from './types';

interface VariableTemplatesListProps {
  templates: VariableDefinition[];
  onAdd: (template: VariableDefinition) => void;
  onCreateCustom: () => void;
  remainingSlots: number;
}

export function VariableTemplatesList({ templates, onAdd, onCreateCustom, remainingSlots }: VariableTemplatesListProps) {
  if (remainingSlots <= 0) {
    return null;
  }

  return (
    <Card className="bg-gray-800/50 border-white/10 mb-6">
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-white">Available Templates</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={onCreateCustom}
            className="bg-indigo-900/30 border-indigo-500/30 text-indigo-300"
          >
            Create Custom
          </Button>
        </div>
        <div className="space-y-3">
          {templates.length > 0 ? (
            templates.map(template => (
              <div key={template.id} className="bg-gray-700/30 rounded-lg p-4 border border-gray-600 flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-white">{template.name}</h3>
                  <p className="text-sm text-gray-400">{template.description}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAdd(template)}
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
  );
}
