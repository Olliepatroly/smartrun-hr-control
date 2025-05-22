
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Wifi, Bluetooth, Link } from 'lucide-react';
import { toast } from "sonner";
import { 
  BluetoothDevice,
  initializeBluetooth,
  scanForHeartRateMonitors,
  scanForTreadmills,
  connectToHeartRateMonitor,
  connectToTreadmill,
  disconnectDevice
} from '@/utils/bluetoothUtils';
import { BleDevice } from '@capacitor-community/bluetooth-le';

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
  const [bluetoothDevices, setBluetoothDevices] = useState<Record<string, BluetoothDevice>>({});
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [bluetoothInitialized, setBluetoothInitialized] = useState(false);

  // Initialize Bluetooth LE on component mount
  useEffect(() => {
    const init = async () => {
      const success = await initializeBluetooth();
      setBluetoothInitialized(success);
      if (!success) {
        toast.error("Bluetooth initialization failed. Please check device permissions.");
      }
    };
    
    init();
  }, []);

  const handleScan = async () => {
    if (!bluetoothInitialized) {
      toast.error("Bluetooth not initialized. Please restart the app.");
      return;
    }

    setIsScanning(true);
    toast.info(`Scanning for ${type === 'hr' ? 'heart rate monitors' : 'treadmills'}...`);
    
    try {
      let foundDevices: BluetoothDevice[] = [];
      
      if (type === 'hr') {
        foundDevices = await scanForHeartRateMonitors();
      } else {
        foundDevices = await scanForTreadmills();
      }
      
      const deviceMap: Record<string, BluetoothDevice> = {};
      const formattedDevices: Device[] = [];
      
      foundDevices.forEach(device => {
        deviceMap[device.deviceId] = device;
        formattedDevices.push({
          id: device.deviceId,
          name: device.name || `Unknown Device (${device.deviceId.substring(0, 6)})`
        });
      });
      
      setBluetoothDevices(deviceMap);
      setDevices(formattedDevices);
      
      if (formattedDevices.length === 0) {
        toast.info("No devices found. Please make sure your device is in pairing mode.");
      } else {
        toast.success(`Found ${formattedDevices.length} ${type === 'hr' ? 'heart rate monitors' : 'treadmills'}`);
      }
    } catch (error) {
      console.error('Error scanning for devices', error);
      toast.error("Error scanning for devices. Please check permissions.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleConnect = async () => {
    if (!selectedDevice) return;
    
    const device = devices.find(d => d.id === selectedDevice);
    if (!device) return;
    
    toast.info(`Connecting to ${device.name}...`);
    
    try {
      const bleDevice = bluetoothDevices[selectedDevice]?.device;
      if (!bleDevice) {
        throw new Error("Device not found");
      }

      // Connect to the device based on type
      if (type === 'hr') {
        await connectToHeartRateMonitor(bleDevice, (heartRate) => {
          // Forward the heart rate data to the parent component
          const { handleHeartRateChange } = window as any;
          if (typeof handleHeartRateChange === 'function') {
            handleHeartRateChange(heartRate);
          }
        });
      } else {
        await connectToTreadmill(bleDevice, (speed) => {
          // Forward the speed data to the parent component
          const { handleTreadmillSpeedChange } = window as any;
          if (typeof handleTreadmillSpeedChange === 'function') {
            handleTreadmillSpeedChange(speed);
          }
        });
      }
      
      setIsConnected(true);
      toast.success(`Connected to ${device.name}!`);
      onConnect(device);
    } catch (error) {
      console.error(`Error connecting to ${device.name}`, error);
      toast.error(`Failed to connect to ${device.name}. Please try again.`);
    }
  };

  // Clean up connections on unmount
  useEffect(() => {
    return () => {
      if (isConnected && selectedDevice) {
        disconnectDevice(selectedDevice).catch(console.error);
      }
    };
  }, [isConnected, selectedDevice]);

  // Use real Bluetooth in production, but in development or preview mode, 
  // fall back to simulated devices for testing
  const useMockDevices = process.env.NODE_ENV === 'development' || window.location.hostname.includes('lovable');
  
  const handleMockScan = () => {
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
  
  const handleMockConnect = () => {
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
          onClick={useMockDevices ? handleMockScan : handleScan} 
          disabled={isScanning || isConnected} 
          className="flex-1"
          variant="default"
        >
          {type === 'hr' ? <Bluetooth className="mr-2" size={16} /> : <Wifi className="mr-2" size={16} />}
          Scan
        </Button>
        
        <Button 
          size="sm" 
          onClick={useMockDevices ? handleMockConnect : handleConnect} 
          disabled={!selectedDevice || isScanning || isConnected} 
          className="flex-1"
          variant="default"
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
