
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProfileSettings from '@/components/ProfileSettings';
import HealthMetricsForm from '@/components/HealthMetricsForm';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';

const Profile = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Profile</h1>
        <Button 
          onClick={() => navigate('/')} 
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          <Dumbbell className="mr-2 h-4 w-4" />
          Go to Workout
        </Button>
      </div>
      <ProfileSettings />
      <HealthMetricsForm />
    </div>
  );
};

export default Profile;
