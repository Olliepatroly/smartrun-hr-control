
import React from 'react';
import { Button } from "@/components/ui/button";
import { Heart, HelpCircle, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from 'lucide-react';

interface PageHeaderProps {
  onHelpClick: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ onHelpClick }) => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const displayName = profile?.username || user?.email?.split('@')[0] || 'User';

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
            className="border-indigo-400 hover:bg-indigo-600 text-white flex items-center"
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Help</span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="border-indigo-400 hover:bg-indigo-600 text-white">
                <User className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">{displayName}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
