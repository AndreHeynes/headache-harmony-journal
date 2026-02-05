
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VariableDefinition } from './types';
import { Clock, ArrowRight, Activity } from "lucide-react";

interface VariableTemplatesListProps {
  templates: VariableDefinition[];
  onAdd: (template: VariableDefinition) => void;
  onCreateCustom: () => void;
  remainingSlots: number;
}

const getTrackingTimeLabel = (time: string) => {
  switch (time) {
    case 'before': return 'Before headache';
    case 'during': return 'During headache';
    case 'after': return 'After headache';
    default: return time;
  }
};

const getTrackingTimeIcon = (time: string) => {
  switch (time) {
    case 'before': return <Clock className="h-3 w-3" />;
    case 'during': return <Activity className="h-3 w-3" />;
    case 'after': return <ArrowRight className="h-3 w-3" />;
    default: return null;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'trigger': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
    case 'symptom': return 'bg-red-500/20 text-red-300 border-red-500/30';
    case 'treatment': return 'bg-green-500/20 text-green-300 border-green-500/30';
    default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  }
};

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
              <div key={template.id} className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-medium text-white">{template.name}</h3>
                    <p className="text-sm text-gray-400 mt-1">{template.description}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAdd(template)}
                    className="bg-indigo-900/30 border-indigo-500/30 text-indigo-300 ml-3"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="outline" className={getTypeColor(template.type)}>
                    {template.type}
                  </Badge>
                  <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/30 flex items-center gap-1">
                    {getTrackingTimeIcon(template.trackingTime)}
                    {getTrackingTimeLabel(template.trackingTime)}
                  </Badge>
                  <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                    {template.valueType}
                  </Badge>
                </div>
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
