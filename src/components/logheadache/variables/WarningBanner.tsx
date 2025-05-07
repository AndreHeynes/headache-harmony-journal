
import React from 'react';

export function WarningBanner() {
  return (
    <div className="mb-6 bg-amber-500/20 border border-amber-500/30 rounded-xl p-4">
      <div className="flex items-start space-x-3">
        <i className="fa-solid fa-triangle-exclamation text-amber-500 mt-1"></i>
        <p className="text-sm text-amber-200">Variables cannot be modified after submission. Please review carefully before saving.</p>
      </div>
    </div>
  );
}
