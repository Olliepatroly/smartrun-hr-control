
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Help & Instructions</DialogTitle>
          <DialogDescription>
            Learn how to use the SmartRun HR Control System
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 text-gray-700">
          <div>
            <h4 className="font-semibold text-lg mb-2">Getting Started</h4>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Connect your Bluetooth/ANT+ heart rate monitor by clicking "Scan" and selecting your device</li>
              <li>Connect your Technogym treadmill using the same process</li>
              <li>Select your target heart rate zone or set custom BPM values</li>
              <li>Configure your minimum and maximum treadmill speeds</li>
              <li>Click "Start" to begin your smart workout</li>
            </ol>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-2">Heart Rate Zones</h4>
            <p className="mb-2">The system will automatically adjust treadmill speed to keep you in your target zone:</p>
            <ul className="space-y-1">
              <li><span className="font-medium">Zone 1 (50-60%):</span> Very light - Recovery/Warm up</li>
              <li><span className="font-medium">Zone 2 (60-70%):</span> Light - Fat burning, endurance</li>
              <li><span className="font-medium">Zone 3 (70-80%):</span> Moderate - Aerobic fitness</li>
              <li><span className="font-medium">Zone 4 (80-90%):</span> Hard - Anaerobic threshold</li>
              <li><span className="font-medium">Zone 5 (90-100%):</span> Maximum - Sprint training</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-2">Safety Information</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Always warm up before starting intense exercise</li>
              <li>Consult with a physician before beginning any new exercise program</li>
              <li>Stop immediately if you feel dizzy, faint, or experience chest pain</li>
              <li>Stay hydrated during your workout</li>
            </ul>
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="default">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HelpModal;
