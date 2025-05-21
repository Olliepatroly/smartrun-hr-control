
import React from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause, Square, ChevronUp, ChevronDown } from 'lucide-react';

interface WorkoutControlsProps {
  isWorkoutActive: boolean;
  isPaused: boolean;
  canStart: boolean;
  currentSpeed: number;
  onStart: () => void;
  onPauseResume: () => void;
  onStop: () => void;
  onSpeedChange?: (change: number) => void;
}

const WorkoutControls: React.FC<WorkoutControlsProps> = ({
  isWorkoutActive,
  isPaused,
  canStart,
  currentSpeed,
  onStart,
  onPauseResume,
  onStop,
  onSpeedChange
}) => {
  const handleSpeedIncrease = () => {
    if (onSpeedChange) onSpeedChange(0.1);
  };
  
  const handleSpeedDecrease = () => {
    if (onSpeedChange) onSpeedChange(-0.1);
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <Button
          onClick={onStart}
          disabled={!canStart || isWorkoutActive}
          className="flex-1"
          variant="default"
          size="lg"
        >
          <Play className="mr-2" size={16} />
          Start
        </Button>
        
        <Button
          onClick={onPauseResume}
          disabled={!isWorkoutActive}
          className="flex-1"
          variant={isPaused ? "default" : "secondary"}
          size="lg"
        >
          {isPaused ? (
            <>
              <Play className="mr-2" size={16} />
              Resume
            </>
          ) : (
            <>
              <Pause className="mr-2" size={16} />
              Pause
            </>
          )}
        </Button>
        
        <Button
          onClick={onStop}
          disabled={!isWorkoutActive}
          className="flex-1"
          variant="destructive"
          size="lg"
        >
          <Square className="mr-2" size={16} />
          Stop
        </Button>
      </div>
      
      {isWorkoutActive && onSpeedChange && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            onClick={handleSpeedDecrease}
            variant="outline"
            size="sm"
            className="px-2"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">Adjust Speed</span>
          <Button
            onClick={handleSpeedIncrease}
            variant="outline"
            size="sm"
            className="px-2"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default WorkoutControls;
