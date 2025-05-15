
import React from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause, Square } from 'lucide-react';

interface WorkoutControlsProps {
  isWorkoutActive: boolean;
  isPaused: boolean;
  canStart: boolean;
  onStart: () => void;
  onPauseResume: () => void;
  onStop: () => void;
}

const WorkoutControls: React.FC<WorkoutControlsProps> = ({
  isWorkoutActive,
  isPaused,
  canStart,
  onStart,
  onPauseResume,
  onStop
}) => {
  return (
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
  );
};

export default WorkoutControls;
