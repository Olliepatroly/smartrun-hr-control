
import React from 'react';
import HeartRateZones from '@/components/HeartRateZones';
import SpeedSettings from '@/components/SpeedSettings';
import WorkoutControls from '@/components/WorkoutControls';
import { useWorkout } from '@/contexts/WorkoutContext';

const ControlPanel: React.FC = () => {
  const { 
    targetZone, 
    customMinHR, 
    customMaxHR, 
    handleSelectZone, 
    handleCustomHRChange,
    minSpeed,
    maxSpeed,
    speedStep,
    handleSpeedSettingsChange,
    workoutActive,
    workoutPaused,
    hrConnected,
    treadmillConnected,
    targetHR,
    handleStartWorkout,
    handlePauseResumeWorkout,
    handleStopWorkout,
    currentSpeed,
    setCurrentSpeed
  } = useWorkout();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Workout Control</h2>
      
      {/* Target Zone Selection */}
      <div className="mb-6">
        <HeartRateZones
          selectedZone={targetZone}
          onSelectZone={handleSelectZone}
          customMin={customMinHR}
          customMax={customMaxHR}
          onCustomChange={handleCustomHRChange}
        />
      </div>
      
      {/* Speed Adjustment Settings */}
      <div className="mb-6">
        <SpeedSettings
          minSpeed={minSpeed}
          maxSpeed={maxSpeed}
          speedStep={speedStep}
          onSettingsChange={handleSpeedSettingsChange}
        />
      </div>
      
      {/* Workout Controls */}
      <WorkoutControls
        isWorkoutActive={workoutActive}
        isPaused={workoutPaused}
        canStart={hrConnected && treadmillConnected && (!!targetZone || (!!customMinHR && !!customMaxHR))}
        currentSpeed={currentSpeed}
        onStart={handleStartWorkout}
        onPauseResume={handlePauseResumeWorkout}
        onStop={handleStopWorkout}
        onSpeedChange={(change) => {
          const newSpeed = Math.max(minSpeed, Math.min(maxSpeed, currentSpeed + change));
          setCurrentSpeed(newSpeed);
        }}
      />
    </div>
  );
};

export default ControlPanel;
