
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Wifi, Bluetooth, Link } from 'lucide-react';
import { toast } from "sonner";

export interface Device {
  id: string;
  name: string;
}

interface DeviceConnectionProps {
  type: 'hr' | 'treadmill';
  onConnect: (device: Device) => void;
}

const DeviceConnection: React.FC<DeviceConnectionProps> = ({ type, onConnect }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    toast.info(`Scanning for ${type === 'hr' ? 'heart rate monitors' : 'treadmills'}...`);
    
    // Simulate device discovery
    setTimeout(() => {
      const mockDevices = type === 'hr' 
        ? [
            { id: 'hr1', name: 'Polar H10' },
            { id: 'hr2', name: 'Garmin HRM-Pro' },
            { id: 'hr3', name: 'Wahoo TICKR' }
          ] 
        : [
            { id: 'tm1', name: 'Technogym Run 1000' },
            { id: 'tm2', name: 'Technogym Run 2000' }
          ];
      
      setDevices(mockDevices);
      setIsScanning(false);
      toast.success(`Found ${mockDevices.length} ${type === 'hr' ? 'heart rate monitors' : 'treadmills'}`);
    }, 2000);
  };

  const handleConnect = () => {
    if (!selectedDevice) return;
    
    const device = devices.find(d => d.id === selectedDevice);
    if (!device) return;
    
    toast.info(`Connecting to ${device.name}...`);
    
    // Simulate connection
    setTimeout(() => {
      setIsConnected(true);
      toast.success(`Connected to ${device.name}!`);
      onConnect(device);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-gray-700 flex items-center gap-2">
          {type === 'hr' 
            ? <><Bluetooth className="text-red-500" size={16} /> Heart Rate Monitor</> 
            : <><Wifi className="text-indigo-500" size={16} /> Treadmill</>}
        </h3>
        <Badge variant={isConnected ? 'success' : 'secondary'} className="font-medium text-xs">
          {isConnected ? 'Connected' : 'Disconnected'}
        </Badge>
      </div>

      <div className="flex space-x-2">
        <Button 
          size="sm" 
          onClick={handleScan} 
          disabled={isScanning || isConnected} 
          className="flex-1"
          variant="default"
        >
          {type === 'hr' ? <Bluetooth className="mr-2" size={16} /> : <Wifi className="mr-2" size={16} />}
          Scan
        </Button>
        
        <Button 
          size="sm" 
          onClick={handleConnect} 
          disabled={!selectedDevice || isScanning || isConnected} 
          className="flex-1"
          variant="success"
        >
          <Link className="mr-2" size={16} />
          Connect
        </Button>
      </div>

      <Select
        disabled={devices.length === 0 || isConnected}
        value={selectedDevice}
        onValueChange={setSelectedDevice}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={devices.length ? "Select device..." : "No devices found"} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {devices.map((device) => (
              <SelectItem key={device.id} value={device.id}>{device.name}</SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default DeviceConnection;
