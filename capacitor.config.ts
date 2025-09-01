
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.oliver.smartrun',
  appName: 'smartrun-hr-control',
  webDir: 'dist',
  server: {
    url: 'https://d79050c9-42a6-4cb4-a29f-dbb04ce5c6b2.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    // Configure Bluetooth permissions
    CapacitorHttp: {
      enabled: true
    }
  }
};

export default config;
