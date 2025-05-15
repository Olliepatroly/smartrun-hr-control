
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface HeartRateZonesProps {
  selectedZone: number | null;
  onSelectZone: (zone: number) => void;
  customMin: number | null;
  customMax: number | null;
  onCustomChange: (min: number | null, max: number | null) => void;
}

const HeartRateZones: React.FC<HeartRateZonesProps> = ({
  selectedZone,
  onSelectZone,
  customMin,
  customMax,
  onCustomChange
}) => {
  const handleCustomMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : null;
    onCustomChange(value, customMax);
  };

  const handleCustomMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : null;
    onCustomChange(customMin, value);
  };

  return (
    <div className="space-y-4">
      <Label className="block text-gray-700 mb-2">Target Heart Rate Zone</Label>
      <div className="grid grid-cols-5 gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((zone) => (
          <Button
            key={zone}
            type="button"
            onClick={() => onSelectZone(zone)}
            variant="ghost"
            className={cn(
              "h-auto py-2 flex flex-col items-center justify-center text-white",
              `bg-hrzone-${zone} hover:bg-opacity-90`,
              selectedZone === zone && "ring-2 ring-offset-2 ring-primary"
            )}
          >
            <span className="font-medium">Zone {zone}</span>
            <span className="text-xs">
              ({zone === 1 ? '50-60%' : 
                zone === 2 ? '60-70%' : 
                zone === 3 ? '70-80%' : 
                zone === 4 ? '80-90%' : '90-100%'})
            </span>
          </Button>
        ))}
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-gray-700 shrink-0">Custom:</span>
        <Input
          type="number"
          placeholder="Min"
          className="w-16 text-center"
          value={customMin || ''}
          onChange={handleCustomMinChange}
        />
        <span className="text-gray-500">-</span>
        <Input
          type="number"
          placeholder="Max"
          className="w-16 text-center"
          value={customMax || ''}
          onChange={handleCustomMaxChange}
        />
        <span className="text-gray-500 ml-1">BPM</span>
      </div>
    </div>
  );
};

export default HeartRateZones;
