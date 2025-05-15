
import React from 'react';
import { cn } from "@/lib/utils";
import { Heart } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface HeartRateMonitorProps {
  currentHR: number | null;
  zoneText: string | null;
  zoneColor: string;
  isActive: boolean;
}

const HeartRateMonitor: React.FC<HeartRateMonitorProps> = ({
  currentHR,
  zoneText,
  zoneColor,
  isActive
}) => {
  // Circle properties
  const radius = 40;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate the progress arc - complete if no HR data
  const offset = currentHR ? circumference - (currentHR / 220) * circumference : circumference;

  return (
    <div className="flex justify-center">
      <div className="relative w-48 h-48">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            className="text-gray-200"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
          />
          {/* Progress circle */}
          <circle
            className={cn(
              "progress-ring__circle text-red-500", 
              isActive && "animate-heartbeat"
            )}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: offset
            }}
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 mb-1">
            <Heart className="text-red-500" size={24} fill="currentColor" />
            <div className="text-4xl font-bold text-gray-800">
              {currentHR || '--'}
            </div>
          </div>
          <div className="text-sm text-gray-500">BPM</div>
          <Badge
            className={cn("mt-2", zoneColor)}
            variant="secondary"
          >
            {zoneText || 'Zone: --'}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default HeartRateMonitor;
