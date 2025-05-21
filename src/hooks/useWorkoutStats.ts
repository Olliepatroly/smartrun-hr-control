
import { useWorkout } from '@/contexts/WorkoutContext';
import { formatTime } from '@/utils/heartRateUtils';

export const useWorkoutStats = () => {
  const { 
    workoutElapsed, 
    workoutDistance, 
    currentHR, 
    currentSpeed,
    workoutActive,
    workoutPaused
  } = useWorkout();

  const formattedTime = formatTime(workoutElapsed);
  const formattedDistance = workoutDistance.toFixed(2);
  const calories = calculateCalories(workoutElapsed, currentSpeed, currentHR);
  const isWorkoutRunning = workoutActive && !workoutPaused;

  return {
    formattedTime,
    formattedDistance,
    calories,
    isWorkoutRunning,
    currentSpeed,
    currentHR
  };
};

// Simple calorie calculation formula (estimation)
const calculateCalories = (seconds: number, speed: number, heartRate: number | null): number => {
  if (!heartRate) return 0;
  
  // Very simplified formula for demonstration
  // In a real app, would account for user weight, age, gender, etc.
  const minutesExercised = seconds / 60;
  const averageHeartRate = heartRate;
  const averageSpeed = speed;
  
  // Base metabolic rate * intensity factor * time
  return Math.round((averageHeartRate * 0.1) * (1 + averageSpeed / 10) * minutesExercised);
};
