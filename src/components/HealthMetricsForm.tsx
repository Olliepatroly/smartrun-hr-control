
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import { CardiacDisabilityOption } from '@/types/health';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

const HealthMetricsForm = () => {
  const { user, healthMetrics } = useAuth();
  const [weight, setWeight] = useState<string>(healthMetrics?.weight?.toString() || '');
  const [height, setHeight] = useState<string>(healthMetrics?.height?.toString() || '');
  const [vo2max, setVo2max] = useState<string>(healthMetrics?.vo2max?.toString() || '');
  const [restingHeartRate, setRestingHeartRate] = useState<string>(healthMetrics?.resting_heart_rate?.toString() || '');
  const [maxHeartRate, setMaxHeartRate] = useState<string>(healthMetrics?.max_heart_rate?.toString() || '');
  const [cardiacDisability, setCardiacDisability] = useState<CardiacDisabilityOption>(
    (healthMetrics?.cardiac_disability as CardiacDisabilityOption) || null
  );
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const saveHealthMetrics = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setLoading(true);
    
    const healthData = {
      user_id: user.id,
      weight: weight ? parseFloat(weight) : null,
      height: height ? parseFloat(height) : null,
      vo2max: vo2max ? parseFloat(vo2max) : null,
      resting_heart_rate: restingHeartRate ? parseInt(restingHeartRate) : null,
      max_heart_rate: maxHeartRate ? parseInt(maxHeartRate) : null,
      cardiac_disability: cardiacDisability,
      updated_at: new Date().toISOString(),
    };

    try {
      if (healthMetrics?.id) {
        // Update existing record
        const { error } = await supabase
          .from('health_metrics')
          .update(healthData)
          .eq('id', healthMetrics.id);
          
        if (error) throw error;
        
        toast({
          title: "Health metrics updated",
          description: "Your health metrics have been updated successfully",
        });
      } else {
        // Create new record
        const { error } = await supabase
          .from('health_metrics')
          .insert([healthData]);
          
        if (error) throw error;
        
        toast({
          title: "Health metrics saved",
          description: "Your health metrics have been saved successfully",
        });
      }
      
      // Refresh the page to update the context
      window.location.reload();
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save health metrics",
        variant: "destructive",
      });
      console.error('Error saving health metrics:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Health Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={saveHealthMetrics} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Enter your weight"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                step="0.1"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="Enter your height"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vo2max">VO2 Max (if known)</Label>
              <Input
                id="vo2max"
                type="number"
                step="0.1"
                value={vo2max}
                onChange={(e) => setVo2max(e.target.value)}
                placeholder="Optional"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="restingHeartRate">Resting Heart Rate (bpm)</Label>
              <Input
                id="restingHeartRate"
                type="number"
                value={restingHeartRate}
                onChange={(e) => setRestingHeartRate(e.target.value)}
                placeholder="Enter resting heart rate"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxHeartRate">Max Heart Rate (bpm)</Label>
              <Input
                id="maxHeartRate"
                type="number"
                value={maxHeartRate}
                onChange={(e) => setMaxHeartRate(e.target.value)}
                placeholder="Enter max heart rate"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cardiacDisability">Cardiac Disability (if any)</Label>
            <Select
              value={cardiacDisability || "none"}
              onValueChange={(value) => setCardiacDisability(value === "none" ? null : value as CardiacDisabilityOption)}
            >
              <SelectTrigger id="cardiacDisability">
                <SelectValue placeholder="Select if applicable" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="CABG">CABG</SelectItem>
                <SelectItem value="Arrhythmia">Arrhythmia</SelectItem>
                <SelectItem value="MI">MI</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <CardFooter className="px-0 pb-0 pt-4">
            <Button type="submit" className="w-full md:w-auto" disabled={loading}>
              {loading ? "Saving..." : "Save Health Metrics"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default HealthMetricsForm;
