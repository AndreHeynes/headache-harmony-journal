
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VariableDefinition } from './types';
import { Clock, ArrowRight, Activity } from "lucide-react";

interface SelectedVariablesListProps {
  variables: VariableDefinition[];
  onEdit: (variable: VariableDefinition) => void;
  onRemove: (variable: VariableDefinition) => void;
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
            <div key={variable.id} className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-white">{variable.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">{variable.description}</p>
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
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="outline" className={getTypeColor(variable.type)}>
                  {variable.type}
                </Badge>
                <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/30 flex items-center gap-1">
                  {getTrackingTimeIcon(variable.trackingTime)}
                  {getTrackingTimeLabel(variable.trackingTime)}
                </Badge>
                <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                  {variable.valueType}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
