import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Smile, Meh, Frown } from "lucide-react";
import { useEpisode } from "@/contexts/EpisodeContext";

interface LogPainIntensityProps {
  episodeId?: string | null;
}

export default function LogPainIntensity({ episodeId }: LogPainIntensityProps) {
  const [painLevel, setPainLevel] = useState([5]);
  const [severity, setSeverity] = useState<'Mild' | 'Moderate' | 'Severe'>('Moderate');
  const [selectedCharacteristics, setSelectedCharacteristics] = useState<string[]>([]);
  const { updateEpisode, activeEpisode } = useEpisode();
  
  // Load existing data if available
  useEffect(() => {
    if (activeEpisode?.pain_intensity) {
      setPainLevel([activeEpisode.pain_intensity]);
    }
  }, [activeEpisode]);

  // Update severity based on pain level
  useEffect(() => {
    const level = painLevel[0];
    if (level >= 1 && level <= 3) setSeverity('Mild');
    else if (level >= 4 && level <= 6) setSeverity('Moderate');
    else if (level >= 7 && level <= 10) setSeverity('Severe');
  }, [painLevel]);

  // Save pain intensity when it changes
  const handlePainLevelChange = async (value: number[]) => {
    setPainLevel(value);
    if (episodeId) {
      await updateEpisode(episodeId, { pain_intensity: value[0] });
    }
  };

  // Toggle characteristic selection
  const handleCharacteristicToggle = (characteristic: string) => {
    setSelectedCharacteristics(prev => {
      const updated = prev.includes(characteristic)
        ? prev.filter(c => c !== characteristic)
        : [...prev, characteristic];
      
      // Store in notes or a custom field if needed
      return updated;
    });
  };

  // Get color based on severity
  const getSeverityColor = () => {
    switch (severity) {
      case 'Mild': return 'text-green-400';
      case 'Moderate': return 'text-orange-400';
      case 'Severe': return 'text-red-400';
      default: return 'text-white';
    }
  };

  // Get icon and background based on severity
  const getSeverityVisuals = () => {
    switch (severity) {
      case 'Mild':
        return { 
          icon: <Smile className="h-8 w-8 text-green-400" />,
          bgColor: 'from-green-500/20 to-green-500/10'
        };
      case 'Moderate':
        return { 
          icon: <Meh className="h-8 w-8 text-orange-400" />,
          bgColor: 'from-orange-500/20 to-orange-500/10'
        };
      case 'Severe':
        return { 
          icon: <Frown className="h-8 w-8 text-red-400" />,
          bgColor: 'from-red-500/20 to-red-500/10'
        };
    }
  };

  const visuals = getSeverityVisuals();
  const characteristics = [
    "Sharp",
    "Stabbing",
    "Dull",
    "Throbbing",
    "Band of pressure",
    "Tooth ache-like"
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <div className="p-4 space-y-6">
          <h2 className="text-lg font-medium text-white">Pain Intensity Scale</h2>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 bg-gray-700/40 rounded-full flex items-center justify-center">
                <Smile className="h-6 w-6 text-green-400" />
              </div>
              <span className="text-sm text-green-400">Mild (1-3)</span>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 bg-gray-700/40 rounded-full flex items-center justify-center">
                <Meh className="h-6 w-6 text-orange-400" />
              </div>
              <span className="text-sm text-orange-400">Moderate (4-6)</span>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 bg-gray-700/40 rounded-full flex items-center justify-center">
                <Frown className="h-6 w-6 text-red-400" />
              </div>
              <span className="text-sm text-red-400">Severe (7-10)</span>
            </div>
          </div>

          <div className="text-center py-6">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <div className={`absolute inset-0 bg-gradient-to-br ${visuals.bgColor} rounded-full animate-pulse`}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  {visuals.icon}
                  <span className={`text-4xl font-bold block mt-2 ${getSeverityColor()}`}>
                    {painLevel[0]}
                  </span>
                </div>
              </div>
            </div>
            <span className={`font-semibold text-lg ${getSeverityColor()}`}>
              {severity} Pain
            </span>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between text-sm text-white/60">
              <span>No Pain</span>
              <span>Worst Pain</span>
            </div>
            
            <Slider
              value={painLevel}
              onValueChange={handlePainLevelChange}
              max={10}
              step={1}
              className="py-4"
            />

            <div className="grid grid-cols-11 gap-1 text-xs text-white/40">
              {Array.from({ length: 11 }, (_, i) => (
                <div key={i} className="text-center">{i}</div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-medium text-white">Pain Characteristics</h2>
          <div className="grid grid-cols-2 gap-3">
            {characteristics.map((characteristic) => (
              <Button
                key={characteristic}
                variant="secondary"
                className={`${
                  selectedCharacteristics.includes(characteristic)
                    ? 'bg-primary/30 border-primary text-white'
                    : 'bg-gray-700/40 hover:bg-gray-700/60 text-white'
                }`}
                onClick={() => handleCharacteristicToggle(characteristic)}
              >
                {characteristic}
              </Button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
