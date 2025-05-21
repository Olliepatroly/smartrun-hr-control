import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  calculateMaxHeartRate,
  calculateTargetHR,
  getHeartRateZones,
  determineHeartRateZone,
  getZoneColor
} from '@/utils/heartRateUtils';
import { Device } from '@/components/DeviceConnection';
import { toast } from 'sonner';

interface WorkoutContextProps {
  // Device state
  hrConnected: boolean;
  treadmillConnected: boolean;
  selectedHRDevice: Device | null;
  selectedTreadmillDevice: Device | null;
  setHrConnected: (connected: boolean) => void;
  setTreadmillConnected: (connected: boolean) => void;
  setSelectedHRDevice: (device: Device | null) => void;
  setSelectedTreadmillDevice: (device: Device | null) => void;
  
  // Heart rate and zones
  maxHR: number;
  currentHR: number | null;
  targetZone: number | null;
  customMinHR: number | null;
  customMaxHR: number | null;
  setMaxHR: (hr: number) => void;
  setCurrentHR: (hr: number | null) => void;
  setTargetZone: (zone: number | null) => void;
  setCustomMinHR: (hr: number | null) => void;
  setCustomMaxHR: (hr: number | null) => void;
  
  // Speed settings
  minSpeed: number;
  maxSpeed: number;
  speedStep: number;
  currentSpeed: number;
  setMinSpeed: (speed: number) => void;
  setMaxSpeed: (speed: number) => void;
  setSpeedStep: (step: number) => void;
  setCurrentSpeed: (speed: number) => void;
  
  // Workout state
  workoutActive: boolean;
  workoutPaused: boolean;
  workoutStartTime: Date | null;
  workoutElapsed: number;
  workoutDistance: number;
  setWorkoutActive: (active: boolean) => void;
  setWorkoutPaused: (paused: boolean) => void;
  setWorkoutStartTime: (time: Date | null) => void;
  setWorkoutElapsed: (elapsed: number) => void;
  setWorkoutDistance: (distance: number) => void;
  
  // Graph data
  heartRateData: { time: number; value: number | null }[];
  speedData: { time: number; value: number | null }[];
  setHeartRateData: (data: { time: number; value: number | null }[]) => void;
  setSpeedData: (data: { time: number; value: number | null }[]) => void;
  
  // UI state
  statusMessage: string | null;
  showStatusMessage: (message: string) => void;
  
  // Computed values
  currentZone: number | null;
  zoneColor: string;
  zoneText: string | null;
  targetHR: { min: number, max: number } | null;
  
  // Action handlers
  handleHRConnect: (device: Device) => void;
  handleTreadmillConnect: (device: Device) => void;
  handleSelectZone: (zone: number) => void;
  handleCustomHRChange: (min: number | null, max: number | null) => void;
  handleSpeedSettingsChange: (newMinSpeed: number, newMaxSpeed: number, newSpeedStep: number) => void;
  handleStartWorkout: () => void;
  handlePauseResumeWorkout: () => void;
  handleStopWorkout: () => void;
  handleAIRecommendation: (action: string, amount: number) => void;
  canStartWorkout: () => boolean;
}

export const WorkoutContext = createContext<WorkoutContextProps | undefined>(undefined);

export const WorkoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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
  
  // Graph data
  const [heartRateData, setHeartRateData] = useState<{ time: number; value: number | null }[]>([]);
  const [speedData, setSpeedData] = useState<{ time: number; value: number | null }[]>([]);
  
  // UI state
  const [statusMessage, setStatusMessage] = useState<string | null>('Connect your heart rate monitor and treadmill to begin');
  
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
        
        // Update graph data when workout is active
        if (currentHR !== null) {
          setHeartRateData(prevData => {
            const newData = [...prevData, { time: workoutElapsed, value: currentHR }];
            // Keep only the last 60 data points (60 seconds)
            return newData.slice(-60);
          });
        }
        
        setSpeedData(prevData => {
          const newData = [...prevData, { time: workoutElapsed, value: currentSpeed }];
          // Keep only the last 60 data points (60 seconds)
          return newData.slice(-60);
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [workoutActive, workoutPaused, currentSpeed, currentHR, workoutElapsed]);
  
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
        const targetHeartRate = Math.round(maxHR * ((zone.min + zone.max) / 2));
        // Move current HR 5% closer to target
        if (currentHR) {
          simulatedHR = currentHR + Math.round((targetHeartRate - currentHR) * 0.05) + Math.floor(Math.random() * 3) - 1;
        }
      }
    } else {
      // Resting HR with slight variation
      simulatedHR = 65 + Math.floor(Math.random() * 5);
    }
    
    setCurrentHR(simulatedHR);
  };

  // Helper functions
  const showStatusMessage = (message: string) => {
    setStatusMessage(message);
    
    // Clear after 5 seconds
    setTimeout(() => {
      setStatusMessage(null);
    }, 5000);
  };
  
  // Handle events
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
  
  const handleStartWorkout = () => {
    if (!canStartWorkout()) {
      return;
    }
    
    setWorkoutActive(true);
    setWorkoutPaused(false);
    setWorkoutStartTime(new Date());
    setWorkoutElapsed(0);
    setWorkoutDistance(0);
    
    // Reset graph data on workout start
    setHeartRateData([]);
    setSpeedData([]);
    
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

  const handleAIRecommendation = (action: string, amount: number) => {
    if (action === 'increase') {
      const newSpeed = Math.min(maxSpeed, currentSpeed + amount);
      setCurrentSpeed(newSpeed);
      showStatusMessage(`AI increased speed to ${newSpeed.toFixed(1)} km/h`);
    } else if (action === 'decrease') {
      const newSpeed = Math.max(minSpeed, currentSpeed - amount);
      setCurrentSpeed(newSpeed);
      showStatusMessage(`AI decreased speed to ${newSpeed.toFixed(1)} km/h`);
    }
  };
  
  // Calculated values
  const currentZone = currentHR ? determineHeartRateZone(currentHR, maxHR) : null;
  const zoneColor = getZoneColor(currentZone);
  const zoneText = currentZone ? getHeartRateZones(maxHR)[currentZone].text : null;
  const targetHR = calculateTargetHR(targetZone, maxHR, customMinHR, customMaxHR);
  
  const value = {
    // Device state
    hrConnected,
    treadmillConnected,
    selectedHRDevice,
    selectedTreadmillDevice,
    setHrConnected,
    setTreadmillConnected,
    setSelectedHRDevice,
    setSelectedTreadmillDevice,
    
    // Heart rate and zones
    maxHR,
    currentHR,
    targetZone,
    customMinHR,
    customMaxHR,
    setMaxHR,
    setCurrentHR,
    setTargetZone,
    setCustomMinHR,
    setCustomMaxHR,
    
    // Speed settings
    minSpeed,
    maxSpeed,
    speedStep,
    currentSpeed,
    setMinSpeed,
    setMaxSpeed,
    setSpeedStep,
    setCurrentSpeed,
    
    // Workout state
    workoutActive,
    workoutPaused,
    workoutStartTime,
    workoutElapsed,
    workoutDistance,
    setWorkoutActive,
    setWorkoutPaused,
    setWorkoutStartTime,
    setWorkoutElapsed,
    setWorkoutDistance,
    
    // Graph data
    heartRateData,
    speedData,
    setHeartRateData,
    setSpeedData,
    
    // UI state
    statusMessage,
    showStatusMessage,
    
    // Computed values
    currentZone,
    zoneColor,
    zoneText,
    targetHR,
    
    // Action handlers
    handleHRConnect,
    handleTreadmillConnect,
    handleSelectZone,
    handleCustomHRChange,
    handleSpeedSettingsChange,
    handleStartWorkout,
    handlePauseResumeWorkout,
    handleStopWorkout,
    handleAIRecommendation,
    canStartWorkout,
  };
  
  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  
  if (context === undefined) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  
  return context;
};
