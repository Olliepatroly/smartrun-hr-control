
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProfileSettings from '@/components/ProfileSettings';
import HealthMetricsForm from '@/components/HealthMetricsForm';

const Profile = () => {
  const { user, profile } = useAuth();

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
      <ProfileSettings />
      <HealthMetricsForm />
    </div>
  );
};

export default Profile;
