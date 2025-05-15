
export interface HeartRateZone {
  min: number;
  max: number;
  color: string;
  text: string;
}

export interface HeartRateZones {
  [key: number]: HeartRateZone;
}

export const calculateMaxHeartRate = (age: number = 30): number => {
  // Simple formula: 220 - age
  return 220 - age;
};

export const getHeartRateZones = (maxHR: number): HeartRateZones => {
  return {
    1: { min: 0.5, max: 0.6, color: 'bg-hrzone-1', text: 'Zone 1 (Recovery)' },
    2: { min: 0.6, max: 0.7, color: 'bg-hrzone-2', text: 'Zone 2 (Endurance)' },
    3: { min: 0.7, max: 0.8, color: 'bg-hrzone-3', text: 'Zone 3 (Aerobic)' },
    4: { min: 0.8, max: 0.9, color: 'bg-hrzone-4', text: 'Zone 4 (Threshold)' },
    5: { min: 0.9, max: 1.0, color: 'bg-hrzone-5', text: 'Zone 5 (Maximum)' }
  };
};

export const determineHeartRateZone = (currentHR: number, maxHR: number): number | null => {
  if (!currentHR || !maxHR) return null;
  
  const hrPercentage = currentHR / maxHR;
  const zones = getHeartRateZones(maxHR);
  
  for (const [zone, range] of Object.entries(zones)) {
    if (hrPercentage >= range.min && hrPercentage < range.max) {
      return parseInt(zone);
    }
  }
  
  return null;
};

export const calculateTargetHR = (zone: number | null, maxHR: number, customMin?: number, customMax?: number): { min: number, max: number } | null => {
  if (customMin && customMax) {
    return { min: customMin, max: customMax };
  }
  
  if (!zone || !maxHR) return null;
  
  const zones = getHeartRateZones(maxHR);
  const targetZone = zones[zone];
  
  if (!targetZone) return null;
  
  return {
    min: Math.round(maxHR * targetZone.min),
    max: Math.round(maxHR * targetZone.max)
  };
};

export const getZoneColor = (zone: number | null): string => {
  if (!zone) return 'bg-gray-200';
  
  const colors = {
    1: 'bg-hrzone-1',
    2: 'bg-hrzone-2',
    3: 'bg-hrzone-3',
    4: 'bg-hrzone-4',
    5: 'bg-hrzone-5'
  };
  
  return colors[zone] || 'bg-gray-200';
};

export const getTextColor = (zone: number | null): string => {
  return zone ? 'text-white' : 'text-gray-800';
};

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};
