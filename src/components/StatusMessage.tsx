
import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

interface StatusMessageProps {
  message: string | null;
}

const StatusMessage: React.FC<StatusMessageProps> = ({ message }) => {
  const [visible, setVisible] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<string | null>(null);

  useEffect(() => {
    if (message) {
      setCurrentMessage(message);
      setVisible(true);
      
      // Hide after 5 seconds
      const timer = setTimeout(() => {
        setVisible(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!currentMessage) return null;

  return (
    <div 
      className={cn(
        "p-3 rounded-lg bg-blue-50 text-blue-800 text-sm transition-opacity duration-300 flex items-center",
        visible ? "opacity-100" : "opacity-0"
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-2 text-blue-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{currentMessage}</span>
    </div>
  );
};

export default StatusMessage;
