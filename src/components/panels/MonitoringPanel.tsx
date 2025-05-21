
import React from 'react';
import HeartRateMonitor from '@/components/HeartRateMonitor';
import WorkoutStats from '@/components/WorkoutStats';
import WorkoutGraphs from '@/components/WorkoutGraphs';
import StatusMessage from '@/components/StatusMessage';
import { useWorkout } from '@/contexts/WorkoutContext';
import { formatTime } from '@/utils/heartRateUtils';

const MonitoringPanel: React.FC = () => {
  const { 
    currentHR,
    zoneText,
    zoneColor,
    workoutActive,
    workoutPaused,
    currentSpeed,
    targetHR,
    workoutElapsed,
    workoutDistance,
    statusMessage,
    heartRateData,
    speedData,
    minSpeed,
    maxSpeed,
    handleAIRecommendation
  } = useWorkout();

  const formattedTime = formatTime(workoutElapsed);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Live Monitoring</h2>
      
      {/* Heart Rate Display */}
      <div className="mb-6">
        <HeartRateMonitor
          currentHR={currentHR}
          zoneText={zoneText}
          zoneColor={zoneColor}
          isActive={workoutActive && !workoutPaused}
        />
      </div>
      
      {/* Treadmill Stats */}
      <div className="mb-6">
        <WorkoutStats
          currentSpeed={currentSpeed}
          targetHR={targetHR}
          time={formattedTime}
          distance={workoutDistance}
        />
      </div>
      
      {/* Graphs */}
      <div className="mb-6">
        <WorkoutGraphs
          heartRateData={heartRateData}
          speedData={speedData}
          isWorkoutActive={workoutActive}
          currentHR={currentHR}
          targetHR={targetHR}
          currentSpeed={currentSpeed}
          minSpeed={minSpeed}
          maxSpeed={maxSpeed}
          onAIRecommendation={handleAIRecommendation}
        />
      </div>
      
      {/* Status Messages */}
      <StatusMessage message={statusMessage} />
    </div>
  );
};

export default MonitoringPanel;
