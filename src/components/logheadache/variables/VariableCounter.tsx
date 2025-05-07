
import React from 'react';

interface VariableCounterProps {
  count: number;
  maxCount: number;
}

export function VariableCounter({ count, maxCount }: VariableCounterProps) {
  return (
    <section className="mb-6 bg-indigo-500/10 rounded-xl p-4 border border-indigo-500/20">
      <div className="flex items-center justify-between">
        <span className="text-indigo-300">Variables Added</span>
        <span className="text-xl font-semibold text-indigo-300">{count}/{maxCount}</span>
      </div>
    </section>
  );
}
