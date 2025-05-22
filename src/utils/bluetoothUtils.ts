
import { BleClient, BleDevice, dataViewToText } from '@capacitor-community/bluetooth-le';

// Bluetooth service and characteristic UUIDs
const HR_SERVICE = '0000180d-0000-1000-8000-00805f9b34fb';
const HR_CHARACTERISTIC = '00002a37-0000-1000-8000-00805f9b34fb';

// Standard FTMS (Fitness Machine Service) UUIDs
const FTMS_SERVICE = '00001826-0000-1000-8000-00805f9b34fb';
const TREADMILL_SPEED_CHARACTERISTIC = '00002acd-0000-1000-8000-00805f9b34fb';

export interface BluetoothDevice {
  deviceId: string;
  name: string;
  rssi: number;
  device: BleDevice;
}

/**
 * Initialize the Bluetooth LE client
 */
export const initializeBluetooth = async (): Promise<boolean> => {
  try {
    await BleClient.initialize();
    console.log('Bluetooth LE initialized');
    return true;
  } catch (error) {
    console.error('Error initializing Bluetooth', error);
    return false;
  }
};

/**
 * Scan for Bluetooth LE devices
 * @param services Services to filter by
 */
export const scanForDevices = async (services: string[] = []): Promise<BluetoothDevice[]> => {
  try {
    const devices: BluetoothDevice[] = [];
    
    await BleClient.requestLEScan(
      {
        services,
        allowDuplicates: false,
      },
      (result) => {
        if (result.localName) {
          devices.push({
            deviceId: result.device.deviceId,
            name: result.localName,
            rssi: result.rssi,
            device: result.device
          });
        }
      }
    );
    
    // Scan for 5 seconds then stop
    setTimeout(async () => {
      await BleClient.stopLEScan();
      console.log('Stopped scanning');
    }, 5000);
    
    return devices;
  } catch (error) {
    console.error('Error scanning for Bluetooth devices', error);
    return [];
  }
};

/**
 * Scan specifically for HR monitors
 */
export const scanForHeartRateMonitors = async (): Promise<BluetoothDevice[]> => {
  return scanForDevices([HR_SERVICE]);
};

/**
 * Scan specifically for treadmills
 */
export const scanForTreadmills = async (): Promise<BluetoothDevice[]> => {
  return scanForDevices([FTMS_SERVICE]);
};

/**
 * Connect to a heart rate monitor and start notifications
 * @param device The heart rate device to connect to
 * @param onHeartRateChange Callback when heart rate data changes
 */
export const connectToHeartRateMonitor = async (
  device: BleDevice,
  onHeartRateChange: (heartRate: number) => void
): Promise<void> => {
  try {
    await BleClient.connect(device.deviceId);
    console.log('Connected to HR device');
    
    // Set up notifications for heart rate
    await BleClient.startNotifications(
      device.deviceId,
      HR_SERVICE,
      HR_CHARACTERISTIC,
      (data) => {
        // Heart rate is the second byte in the response for most devices
        const heartRate = data.getUint8(1);
        onHeartRateChange(heartRate);
      }
    );
    
  } catch (error) {
    console.error('Error connecting to heart rate device', error);
    throw error;
  }
};

/**
 * Connect to a treadmill and start notifications
 * @param device The treadmill device to connect to
 * @param onSpeedChange Callback when speed data changes
 */
export const connectToTreadmill = async (
  device: BleDevice,
  onSpeedChange: (speed: number) => void
): Promise<void> => {
  try {
    await BleClient.connect(device.deviceId);
    console.log('Connected to treadmill device');
    
    // Set up notifications for treadmill speed
    await BleClient.startNotifications(
      device.deviceId,
      FTMS_SERVICE,
      TREADMILL_SPEED_CHARACTERISTIC,
      (data) => {
        // Parse speed data according to the FTMS specification
        // Speed is typically in units of 0.01 km/h
        const speedRaw = data.getUint16(0, true);
        const speedKmh = speedRaw * 0.01;
        onSpeedChange(speedKmh);
      }
    );
    
  } catch (error) {
    console.error('Error connecting to treadmill device', error);
    throw error;
  }
};

/**
 * Disconnect from a Bluetooth device
 * @param deviceId The device ID to disconnect from
 */
export const disconnectDevice = async (deviceId: string): Promise<void> => {
  try {
    await BleClient.disconnect(deviceId);
    console.log(`Disconnected from device: ${deviceId}`);
  } catch (error) {
    console.error('Error disconnecting from device', error);
    throw error;
  }
};

