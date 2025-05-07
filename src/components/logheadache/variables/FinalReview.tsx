
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { VariableDefinition } from './types';

interface FinalReviewProps {
  variables: VariableDefinition[];
  onGoBack: () => void;
  onSave: () => void;
}

export function FinalReview({ variables, onGoBack, onSave }: FinalReviewProps) {
  return (
    <Card className="bg-gray-800/50 border-white/10 mb-6">
      <div className="p-6 space-y-6">
        <h2 className="text-lg font-medium text-white mb-4">Final Review</h2>
        
        {variables.length > 0 ? (
          <div className="space-y-4">
            {variables.map((variable) => (
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
          <Button variant="outline" onClick={onGoBack} className="bg-gray-700/30 border-gray-600">
            Back to Edit
          </Button>
          <Button
            onClick={onSave}
            className="bg-indigo-600 hover:bg-indigo-700"
            disabled={variables.length === 0}
          >
            Save & Lock Variables
          </Button>
        </div>
      </div>
    </Card>
  );
}
