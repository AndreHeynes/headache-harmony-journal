
import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SKULL_HOTSPOTS } from './skull-hotspots';
import { InlineDisclaimer } from '@/components/disclaimer';

interface SmartAnalysisProps {
  selectedHotspots: string[];
}

export const SmartAnalysis = ({ selectedHotspots }: SmartAnalysisProps) => {
  const analysis = useMemo(() => {
    if (selectedHotspots.length === 0) return null;

    const selectedHotspotData = SKULL_HOTSPOTS.filter(h => selectedHotspots.includes(h.id));
    
    // Determine distribution (left, right, bilateral)
    const hasLeft = selectedHotspotData.some(h => 
      h.id.includes('left') || h.id.includes('right') // Note: our IDs are reversed for visual reasons
    );
    const hasRight = selectedHotspotData.some(h => 
      h.id.includes('right') || h.id.includes('left') // Note: our IDs are reversed for visual reasons
    );
    const hasBoth = selectedHotspotData.some(h => 
      h.id.includes('both') || h.id.includes('middle') || h.id.includes('pressure-band')
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
    if (selectedHotspotData.some(h => h.id.includes('forehead') || h.id.includes('eye'))) {
      regions.push('Frontal');
    }
    if (selectedHotspotData.some(h => h.id.includes('temple'))) {
      regions.push('Temporal');
    }
    if (selectedHotspotData.some(h => h.id.includes('occiput') || h.id.includes('back'))) {
      regions.push('Occipital');
    }
    if (selectedHotspotData.some(h => h.id.includes('neck') || h.id.includes('base'))) {
      regions.push('Cervical');
    }

    return {
      distribution,
      pattern,
      regions,
      intensity: selectedHotspots.length
    };
  }, [selectedHotspots]);

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
