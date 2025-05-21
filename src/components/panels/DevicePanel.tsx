
import React from 'react';
import DeviceConnection from '@/components/DeviceConnection';
import { useWorkout } from '@/contexts/WorkoutContext';

const DevicePanel: React.FC = () => {
  const { handleHRConnect, handleTreadmillConnect } = useWorkout();

  return (
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
  );
};

export default DevicePanel;
