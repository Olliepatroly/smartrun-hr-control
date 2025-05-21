
import React from 'react';
import HeartRateChart from './graphs/HeartRateChart';
import SpeedChart from './graphs/SpeedChart';
import AIRecommendationButton from './AIRecommendationButton';
import { formatTime } from '@/utils/chartUtils';

interface WorkoutGraphsProps {
  heartRateData: { time: number; value: number | null }[];
  speedData: { time: number; value: number | null }[];
  isWorkoutActive: boolean;
  currentHR: number | null;
  targetHR: { min: number, max: number } | null;
  currentSpeed: number;
  minSpeed: number;
  maxSpeed: number;
  onAIRecommendation?: (action: string, amount: number) => void;
}

const WorkoutGraphs: React.FC<WorkoutGraphsProps> = ({ 
  heartRateData, 
  speedData,
  isWorkoutActive,
  currentHR,
  targetHR,
  currentSpeed,
  minSpeed,
  maxSpeed,
  onAIRecommendation
}) => {
  return (
    <div className="space-y-4">
      {onAIRecommendation && (
        <AIRecommendationButton
          isWorkoutActive={isWorkoutActive}
          currentHR={currentHR}
          targetHR={targetHR}
          currentSpeed={currentSpeed}
          minSpeed={minSpeed}
          maxSpeed={maxSpeed}
          onAIRecommendation={onAIRecommendation}
        />
      )}

      <div className="grid grid-cols-1 gap-4">
        {/* Heart Rate Graph */}
        <HeartRateChart 
          heartRateData={heartRateData} 
          formatTime={formatTime} 
        />

        {/* Speed Graph */}
        <SpeedChart 
          speedData={speedData} 
          formatTime={formatTime} 
        />
      </div>
    </div>
  );
};

export default WorkoutGraphs;
