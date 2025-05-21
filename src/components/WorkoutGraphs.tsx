
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";

interface WorkoutGraphsProps {
  heartRateData: { time: number; value: number | null }[];
  speedData: { time: number; value: number | null }[];
  isWorkoutActive: boolean;
  currentHR: number | null;
  targetHR: { min: number, max: number } | null;
  currentSpeed: number;
  minSpeed: number;
  maxSpeed: number;
  onAIRecommendation?: (action: string, amount: number) => void;
}

const WorkoutGraphs: React.FC<WorkoutGraphsProps> = ({ 
  heartRateData, 
  speedData,
  isWorkoutActive,
  currentHR,
  targetHR,
  currentSpeed,
  minSpeed,
  maxSpeed,
  onAIRecommendation
}) => {
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);

  // Format the time values for display on the X-axis
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

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
    <div className="space-y-4">
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

      <div className="grid grid-cols-1 gap-4">
        {/* Heart Rate Graph */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Heart Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[150px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={heartRateData}
                  margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="time"
                    tickFormatter={formatTime}
                    minTickGap={30}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis 
                    domain={['dataMin - 10', 'dataMax + 10']}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value} BPM`, 'Heart Rate']}
                    labelFormatter={(time) => `Time: ${formatTime(time as number)}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    dot={false}
                    animationDuration={300}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Speed Graph */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Speed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[150px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={speedData}
                  margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="time"
                    tickFormatter={formatTime}
                    minTickGap={30}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis 
                    domain={['dataMin - 0.5', 'dataMax + 0.5']}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip
                    formatter={(value) => [`${value} km/h`, 'Speed']}
                    labelFormatter={(time) => `Time: ${formatTime(time as number)}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#0EA5E9"
                    strokeWidth={2}
                    dot={false}
                    animationDuration={300}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkoutGraphs;
