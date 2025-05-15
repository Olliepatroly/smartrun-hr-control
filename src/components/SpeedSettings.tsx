
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SpeedSettingsProps {
  minSpeed: number;
  maxSpeed: number;
  speedStep: number;
  onSettingsChange: (minSpeed: number, maxSpeed: number, speedStep: number) => void;
}

const SpeedSettings: React.FC<SpeedSettingsProps> = ({
  minSpeed,
  maxSpeed,
  speedStep,
  onSettingsChange
}) => {
  const handleMinSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMinSpeed = parseFloat(e.target.value);
    if (!isNaN(newMinSpeed)) {
      onSettingsChange(newMinSpeed, Math.max(newMinSpeed + 0.1, maxSpeed), speedStep);
    }
  };

  const handleMaxSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMaxSpeed = parseFloat(e.target.value);
    if (!isNaN(newMaxSpeed)) {
      onSettingsChange(Math.min(minSpeed, newMaxSpeed - 0.1), newMaxSpeed, speedStep);
    }
  };

  const handleSpeedStepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSpeedStep = parseFloat(e.target.value);
    if (!isNaN(newSpeedStep)) {
      onSettingsChange(minSpeed, maxSpeed, newSpeedStep);
    }
  };

  return (
    <div className="space-y-4">
      <Label className="block text-gray-700">Speed Adjustment</Label>
      
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-gray-700 whitespace-nowrap">Min Speed:</span>
          <Input
            type="number"
            value={minSpeed}
            min={0.5}
            max={maxSpeed - 0.1}
            step={0.1}
            onChange={handleMinSpeedChange}
            className="w-20 text-center"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-gray-700 whitespace-nowrap">Max Speed:</span>
          <Input
            type="number"
            value={maxSpeed}
            min={minSpeed + 0.1}
            max={20}
            step={0.1}
            onChange={handleMaxSpeedChange}
            className="w-20 text-center"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-gray-700">Adjustment Step:</span>
        <Input
          type="number"
          value={speedStep}
          min={0.05}
          max={0.5}
          step={0.05}
          onChange={handleSpeedStepChange}
          className="w-20 text-center"
        />
        <span className="text-gray-500">km/h</span>
      </div>
    </div>
  );
};

export default SpeedSettings;
