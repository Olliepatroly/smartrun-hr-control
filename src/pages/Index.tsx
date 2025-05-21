
import React, { useState } from 'react';
import { Toaster } from 'sonner';
import { WorkoutProvider } from '@/contexts/WorkoutContext';
import PageHeader from '@/components/layout/PageHeader';
import PageFooter from '@/components/layout/PageFooter';
import DevicePanel from '@/components/panels/DevicePanel';
import ControlPanel from '@/components/panels/ControlPanel';
import MonitoringPanel from '@/components/panels/MonitoringPanel';
import HelpModal from '@/components/HelpModal';

const Index = () => {
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  return (
    <WorkoutProvider>
      <div className="min-h-screen flex flex-col">
        <Toaster position="top-center" />
        
        {/* Header */}
        <PageHeader onHelpClick={() => setIsHelpModalOpen(true)} />
        
        {/* Main Content */}
        <main className="flex-grow container mx-auto p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Device Connection Panel */}
            <DevicePanel />
            
            {/* Control Panel */}
            <ControlPanel />
            
            {/* Monitoring Panel */}
            <MonitoringPanel />
          </div>
        </main>
        
        {/* Footer */}
        <PageFooter />
        
        {/* Help Modal */}
        <HelpModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
      </div>
    </WorkoutProvider>
  );
};

export default Index;
