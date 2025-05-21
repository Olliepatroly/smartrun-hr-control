
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Brain } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";

interface AIRecommendationButtonProps {
  isWorkoutActive: boolean;
  currentHR: number | null;
  targetHR: { min: number, max: number } | null;
  currentSpeed: number;
  minSpeed: number;
  maxSpeed: number;
  onAIRecommendation: (action: string, amount: number) => void;
}

const AIRecommendationButton: React.FC<AIRecommendationButtonProps> = ({
  isWorkoutActive,
  currentHR,
  targetHR,
  currentSpeed,
  minSpeed,
  maxSpeed,
  onAIRecommendation
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAIAnalysis = async () => {
    if (!isWorkoutActive || !currentHR || !targetHR) {
      toast.error("Workout must be active and heart rate data available for AI analysis");
      return;
    }

    setIsAnalyzing(true);

    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to use AI recommendations");
        setIsAnalyzing(false);
        return;
      }

      console.log("Sending data to analyze-metrics:", {
        userId: user.id,
        currentHR,
        targetZoneMin: targetHR.min,
        targetZoneMax: targetHR.max,
        currentSpeed,
        minSpeed,
        maxSpeed
      });

      // Call the analyze-metrics edge function
      const { data, error } = await supabase.functions.invoke('analyze-metrics', {
        body: {
          userId: user.id,
          currentHR,
          targetZoneMin: targetHR.min,
          targetZoneMax: targetHR.max,
          currentSpeed,
          minSpeed,
          maxSpeed
        }
      });

      if (error) {
        console.error("Error calling analyze-metrics function:", error);
        toast.error("Could not get AI recommendation");
        setIsAnalyzing(false);
        return;
      }

      console.log("AI recommendation response:", data);

      // Handle the recommendation
      if (data && data.action && typeof data.amount === 'number' && onAIRecommendation) {
        toast.success(`AI recommends to ${data.action} speed by ${data.amount} km/h`);
        onAIRecommendation(data.action, data.amount);
      } else {
        toast.info("AI analyzed your workout but has no speed change recommendations");
      }
    } catch (error) {
      console.error("Error in AI analysis:", error);
      toast.error("An error occurred during AI analysis");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex justify-end">
      <Button 
        size="sm" 
        onClick={handleAIAnalysis}
        disabled={!isWorkoutActive || isAnalyzing || !currentHR}
        className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
      >
        <Brain className="mr-2 h-4 w-4" />
        {isAnalyzing ? "Analyzing..." : "AI Speed Recommendation"}
      </Button>
    </div>
  );
};

export default AIRecommendationButton;
