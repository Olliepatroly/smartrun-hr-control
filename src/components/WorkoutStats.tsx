
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Clock, FastForward, Timer, Navigation } from 'lucide-react';
import { cn } from "@/lib/utils";

interface WorkoutStatsProps {
  currentSpeed: number | null;
  targetHR: { min: number, max: number } | null;
  time: string;
  distance: number | null;
}

const WorkoutStats: React.FC<WorkoutStatsProps> = ({
  currentSpeed,
  targetHR,
  time,
  distance
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <StatCard 
        label="Current Speed"
        value={currentSpeed ? `${currentSpeed.toFixed(1)}` : "--"}
        unit="km/h"
        icon={<FastForward className="text-indigo-700" />}
      />
      
      <StatCard 
        label="Target HR"
        value={targetHR ? `${targetHR.min}-${targetHR.max}` : "--"}
        unit="BPM"
        icon={<Navigation className="text-green-600" />}
      />
      
      <StatCard 
        label="Time"
        value={time}
        icon={<Clock className="text-blue-600" />}
      />
      
      <StatCard 
        label="Distance"
        value={distance ? distance.toFixed(2) : "--"}
        unit="km"
        icon={<Timer className="text-purple-600" />}
      />
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: string;
  unit?: string;
  icon: React.ReactNode;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  label, 
  value, 
  unit, 
  icon,
  className 
}) => {
  return (
    <Card className={cn("bg-gray-50 overflow-hidden", className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-1">
          <div className="text-gray-500 text-sm">{label}</div>
          <div>{icon}</div>
        </div>
        <div className="flex items-baseline">
          <span className="text-2xl font-bold">{value}</span>
          {unit && <span className="text-gray-500 ml-1 text-sm">{unit}</span>}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkoutStats;
