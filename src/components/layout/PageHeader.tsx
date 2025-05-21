
import React from 'react';
import { Button } from "@/components/ui/button";
import { Heart, HelpCircle } from 'lucide-react';
import ProfileDropdown from '@/components/ProfileDropdown';

interface PageHeaderProps {
  onHelpClick: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ onHelpClick }) => {
  return (
    <header className="bg-indigo-700 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Heart className="h-6 w-6" />
          <h1 className="text-2xl font-bold">SmartRun HR</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            size="sm"
            variant="outline" 
            onClick={onHelpClick}
            className="border-indigo-400 hover:bg-indigo-600 text-white"
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            Help
          </Button>
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
