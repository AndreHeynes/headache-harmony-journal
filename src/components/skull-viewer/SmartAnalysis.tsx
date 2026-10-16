
import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { InlineDisclaimer } from '@/components/disclaimer';

interface SmartAnalysisProps {
  selectedKeys: string[];
}

export const SmartAnalysis = ({ selectedKeys }: SmartAnalysisProps) => {
  const selectedHotspots = selectedKeys;
  const analysis = useMemo(() => {
    if (selectedKeys.length === 0) return null;

    // Keys are on the patient's own side (e.g. temple_left)
    const hasLeft = selectedKeys.some(k => k.endsWith('_left'));
    const hasRight = selectedKeys.some(k => k.endsWith('_right'));
    const hasBoth = selectedKeys.some(k =>
      k.endsWith('_center') || k === 'pressure_band' || k === 'crown' || k === 'skull_base'
    );

    let distribution = 'Unilateral';
    if (hasBoth || (hasLeft && hasRight)) {
      distribution = 'Bilateral';
    } else if (hasLeft) {
      distribution = 'Left-sided';
    } else if (hasRight) {
      distribution = 'Right-sided';
    }

    // Determine pattern (focal, regional, diffuse)
    let pattern = 'Focal';
    if (selectedHotspots.length > 3) {
      pattern = 'Diffuse';
    } else if (selectedHotspots.length > 1) {
      pattern = 'Regional';
    }

    // Determine anatomical regions
    const regions = [];
    if (selectedKeys.some(k => k.includes('forehead') || k.includes('eye'))) {
      regions.push('Frontal');
    }
    if (selectedKeys.some(k => k.includes('temple'))) {
      regions.push('Temporal');
    }
    if (selectedKeys.some(k => k.includes('occipital') || k.includes('crown'))) {
      regions.push('Occipital');
    }
    if (selectedKeys.some(k => k.includes('skull_base'))) {
      regions.push('Cervical');
    }

    return {
      distribution,
      pattern,
      regions,
      intensity: selectedHotspots.length
    };
  }, [selectedKeys]);

  if (!analysis) return null;

  return (
    <div className="mt-4 space-y-3">
      <Card className="bg-cyan-50/10 border-cyan-200/20">
        <div className="p-4">
          <h3 className="text-sm font-medium text-cyan-100 mb-3">Smart Analysis</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-white/60">Distribution:</span>
              <span className="ml-2 text-white">{analysis.distribution}</span>
            </div>
            <div>
              <span className="text-white/60">Pattern:</span>
              <span className="ml-2 text-white">{analysis.pattern}</span>
            </div>
            {analysis.regions.length > 0 && (
              <div className="col-span-2">
                <span className="text-white/60">Regions:</span>
                <span className="ml-2 text-white">{analysis.regions.join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      </Card>
      
      <InlineDisclaimer 
        disclaimerId="ai-analysis-disclaimer"
        variant="info"
        size="sm"
        condensed={true}
        showTitle={false}
      />
    </div>
  );
};
