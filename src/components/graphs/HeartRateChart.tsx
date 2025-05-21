
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

interface HeartRateChartProps {
  heartRateData: { time: number; value: number | null }[];
  formatTime: (time: number) => string;
}

const HeartRateChart: React.FC<HeartRateChartProps> = ({ 
  heartRateData,
  formatTime
}) => {
  return (
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
  );
};

export default HeartRateChart;
