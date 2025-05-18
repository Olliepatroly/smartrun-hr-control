import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Heart, HelpCircle } from 'lucide-react';
import { Toaster } from 'sonner';
import { toast } from 'sonner';

import DeviceConnection, { Device } from '@/components/DeviceConnection';
import HeartRateZones from '@/components/HeartRateZones';
import SpeedSettings from '@/components/SpeedSettings';
import WorkoutControls from '@/components/WorkoutControls';
import HeartRateMonitor from '@/components/HeartRateMonitor';
import WorkoutStats from '@/components/WorkoutStats';
import StatusMessage from '@/components/StatusMessage';
import HelpModal from '@/components/HelpModal';
import ProfileDropdown from '@/components/ProfileDropdown';

import {
  calculateMaxHeartRate,
  determineHeartRateZone,
  getZoneColor,
  getHeartRateZones,
  calculateTargetHR,
  formatTime
} from '@/utils/heartRateUtils';

const Index = () => {
  // Device state
  const [hrConnected, setHrConnected] = useState(false);
  const [treadmillConnected, setTreadmillConnected] = useState(false);
  const [selectedHRDevice, setSelectedHRDevice] = useState<Device | null>(null);
  const [selectedTreadmillDevice, setSelectedTreadmillDevice] = useState<Device | null>(null);
  
  // Heart rate and zones
  const [maxHR, setMaxHR] = useState(calculateMaxHeartRate(30));
  const [currentHR, setCurrentHR] = useState<number | null>(null);
  const [targetZone, setTargetZone] = useState<number | null>(null);
  const [customMinHR, setCustomMinHR] = useState<number | null>(null);
  const [customMaxHR, setCustomMaxHR] = useState<number | null>(null);
  
  // Speed settings
  const [minSpeed, setMinSpeed] = useState(1.0);
  const [maxSpeed, setMaxSpeed] = useState(5.0);
  const [speedStep, setSpeedStep] = useState(0.1);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  
  // Workout state
  const [workoutActive, setWorkoutActive] = useState(false);
  const [workoutPaused, setWorkoutPaused] = useState(false);
  const [workoutStartTime, setWorkoutStartTime] = useState<Date | null>(null);
  const [workoutElapsed, setWorkoutElapsed] = useState(0);
  const [workoutDistance, setWorkoutDistance] = useState(0);
  
  // UI state
  const [statusMessage, setStatusMessage] = useState<string | null>('Connect your heart rate monitor and treadmill to begin');
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  
  // Simulated heart rate interval
  useEffect(() => {
    if (hrConnected) {
      const interval = setInterval(() => {
        simulateHRData();
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [hrConnected, workoutActive, workoutPaused, currentSpeed, targetZone]);
  
  // Workout timer
  useEffect(() => {
    if (workoutActive && !workoutPaused) {
      const interval = setInterval(() => {
        setWorkoutElapsed(prev => prev + 1);
        // Update distance (km/h to km/s)
        setWorkoutDistance(prev => prev + currentSpeed / 3600);
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [workoutActive, workoutPaused, currentSpeed]);
  
  // Heart rate adjustment logic
  useEffect(() => {
    if (!workoutActive || workoutPaused || !currentHR) return;
    
    const targetHR = calculateTargetHR(targetZone, maxHR, customMinHR, customMaxHR);
    if (!targetHR) return;
    
    // Adjust speed based on heart rate
    const adjustSpeedForHeartRate = () => {
      if (currentHR < targetHR.min && currentSpeed < maxSpeed) {
        setCurrentSpeed(prev => Math.min(maxSpeed, prev + speedStep));
        showStatusMessage('Increasing speed to raise heart rate');
      } else if (currentHR > targetHR.max && currentSpeed > minSpeed) {
        setCurrentSpeed(prev => Math.max(minSpeed, prev - speedStep));
        showStatusMessage('Decreasing speed to lower heart rate');
      }
    };
    
    // Don't adjust speed every second - use a timer
    const timer = setTimeout(adjustSpeedForHeartRate, 3000);
    return () => clearTimeout(timer);
    
  }, [currentHR, workoutActive, workoutPaused, targetZone, customMinHR, customMaxHR]);
  
  // Simulate heart rate data
  const simulateHRData = () => {
    if (!hrConnected) return;
    
    let simulatedHR;
    
    if (workoutActive && !workoutPaused) {
      // Base HR on speed with some randomness
      const speedFactor = (currentSpeed - minSpeed) / (maxSpeed - minSpeed);
      simulatedHR = 70 + Math.round(90 * speedFactor) + Math.floor(Math.random() * 5) - 2;
      
      // If target zone is set, simulate HR gradually moving toward that zone
      if (targetZone) {
        const zones = getHeartRateZones(maxHR);
        const zone = zones[targetZone];
        const targetHR = Math.round(maxHR * ((zone.min + zone.max) / 2));
        // Move current HR 5% closer to target
        if (currentHR) {
          simulatedHR = currentHR + Math.round((targetHR - currentHR) * 0.05) + Math.floor(Math.random() * 3) - 1;
        }
      }
    } else {
      // Resting HR with slight variation
      simulatedHR = 65 + Math.floor(Math.random() * 5);
    }
    
    setCurrentHR(simulatedHR);
  };
  
  // Connect handlers
  const handleHRConnect = (device: Device) => {
    setSelectedHRDevice(device);
    setHrConnected(true);
    showStatusMessage(`Connected to ${device.name}`);
    
    // Simulate initial heart rate
    setTimeout(() => {
      setCurrentHR(65 + Math.floor(Math.random() * 10));
    }, 500);
  };
  
  const handleTreadmillConnect = (device: Device) => {
    setSelectedTreadmillDevice(device);
    setTreadmillConnected(true);
    showStatusMessage(`Connected to ${device.name}`);
    
    // Set initial speed
    setCurrentSpeed(minSpeed);
  };
  
  // Zone selection handlers
  const handleSelectZone = (zone: number) => {
    setTargetZone(zone);
    setCustomMinHR(null);
    setCustomMaxHR(null);
    
    const targetHR = calculateTargetHR(zone, maxHR);
    if (targetHR) {
      showStatusMessage(`Target set to Zone ${zone} (${targetHR.min}-${targetHR.max} BPM)`);
    }
  };
  
  const handleCustomHRChange = (min: number | null, max: number | null) => {
    if (min && max && min < max) {
      setCustomMinHR(min);
      setCustomMaxHR(max);
      setTargetZone(null);
      showStatusMessage(`Target set to custom range (${min}-${max} BPM)`);
    }
  };
  
  // Speed setting handlers
  const handleSpeedSettingsChange = (newMinSpeed: number, newMaxSpeed: number, newSpeedStep: number) => {
    setMinSpeed(newMinSpeed);
    setMaxSpeed(newMaxSpeed);
    setSpeedStep(newSpeedStep);
    
    // Adjust current speed if needed
    if (currentSpeed < newMinSpeed) {
      setCurrentSpeed(newMinSpeed);
    } else if (currentSpeed > newMaxSpeed) {
      setCurrentSpeed(newMaxSpeed);
    }
  };
  
  // Workout control handlers
  const handleStartWorkout = () => {
    if (!canStartWorkout()) {
      return;
    }
    
    setWorkoutActive(true);
    setWorkoutPaused(false);
    setWorkoutStartTime(new Date());
    setWorkoutElapsed(0);
    setWorkoutDistance(0);
    
    // Set initial speed to minimum
    setCurrentSpeed(minSpeed);
    
    showStatusMessage('Workout started!');
    toast.success('Workout started!');
  };
  
  const handlePauseResumeWorkout = () => {
    setWorkoutPaused(!workoutPaused);
    
    if (workoutPaused) {
      showStatusMessage('Workout resumed');
      toast.info('Workout resumed');
    } else {
      showStatusMessage('Workout paused');
      toast.info('Workout paused');
    }
  };
  
  const handleStopWorkout = () => {
    setWorkoutActive(false);
    setWorkoutPaused(false);
    
    // Gradually reduce speed to minimum
    const reduceSpeed = () => {
      setCurrentSpeed(prev => {
        const newSpeed = Math.max(minSpeed, prev - speedStep);
        if (newSpeed > minSpeed) {
          setTimeout(reduceSpeed, 1000);
        }
        return newSpeed;
      });
    };
    
    if (currentSpeed > minSpeed) {
      reduceSpeed();
    }
    
    showStatusMessage('Workout completed!');
    toast.success('Workout completed!');
  };
  
  // Helper functions
  const canStartWorkout = (): boolean => {
    if (!hrConnected || !treadmillConnected) {
      toast.error('Please connect both devices before starting');
      return false;
    }
    
    if (!targetZone && (!customMinHR || !customMaxHR)) {
      toast.error('Please select a target heart rate zone or set custom values');
      return false;
    }
    
    return true;
  };
  
  const showStatusMessage = (message: string) => {
    setStatusMessage(message);
    
    // Clear after 5 seconds
    setTimeout(() => {
      setStatusMessage(null);
    }, 5000);
  };
  
  // Calculate current state
  const currentZone = currentHR ? determineHeartRateZone(currentHR, maxHR) : null;
  const zoneColor = getZoneColor(currentZone);
  const zoneText = currentZone ? getHeartRateZones(maxHR)[currentZone].text : null;
  const targetHR = calculateTargetHR(targetZone, maxHR, customMinHR, customMaxHR);
  const formattedTime = formatTime(workoutElapsed);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-center" />
      
      {/* Header */}
      <header className="bg-indigo-700 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Heart className="h-6 w-6" />
            <h1 className="text-2xl font-bold">SmartRun HR</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              size="sm"
              variant="outline" 
              onClick={() => setIsHelpModalOpen(true)}
              className="border-indigo-400 hover:bg-indigo-600 text-white"
            >
              <HelpCircle className="mr-2 h-4 w-4" />
              Help
            </Button>
            <ProfileDropdown />
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow container mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Device Connection Panel */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Device Connections</h2>
            
            {/* Heart Rate Monitor Connection */}
            <div className="mb-6">
              <DeviceConnection
                type="hr"
                onConnect={handleHRConnect}
              />
            </div>
            
            {/* Treadmill Connection */}
            <div>
              <DeviceConnection
                type="treadmill"
                onConnect={handleTreadmillConnect}
              />
            </div>
          </div>
          
          {/* Control Panel */}
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
              onStart={handleStartWorkout}
              onPauseResume={handlePauseResumeWorkout}
              onStop={handleStopWorkout}
            />
          </div>
          
          {/* Monitoring Panel */}
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
            
            {/* Status Messages */}
            <StatusMessage message={statusMessage} />
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 text-center text-sm">
        <p>SmartRun HR Control System © 2025 | For demonstration purposes only</p>
      </footer>
      
      {/* Help Modal */}
      <HelpModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
    </div>
  );
};

export default Index;
