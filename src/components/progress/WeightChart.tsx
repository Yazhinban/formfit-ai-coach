
import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { motion } from 'framer-motion';
import { ProgressEntry } from './types';

interface WeightChartProps {
  filteredData: ProgressEntry[];
}

const WeightChart: React.FC<WeightChartProps> = ({ filteredData }) => {
  const chartData = filteredData.map(entry => ({
    date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: entry.weight,
    workout: entry.workout || 'Not specified'
  }));

  // Calculate min and max for better Y-axis visualization
  const weights = chartData.map(item => item.weight);
  const minWeight = Math.max(0, Math.min(...weights) - 5);
  const maxWeight = Math.max(...weights) + 5;
  
  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border rounded-lg shadow-md">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-primary">Weight: <span className="font-semibold">{payload[0].value} lbs</span></p>
          <p className="text-xs text-muted-foreground mt-1">Workout: {payload[0].payload.workout}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="h-[280px] w-full mt-6 bg-gradient-to-r from-background to-muted/5 p-4 rounded-lg border shadow-sm"
    >
      <div className="mb-2 flex justify-between items-center">
        <h3 className="text-sm font-medium text-muted-foreground">Weight Progression</h3>
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
        >
          <defs>
            <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 11 }} 
            tickMargin={8}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis 
            domain={[minWeight, maxWeight]}
            tick={{ fontSize: 11 }} 
            tickMargin={8}
            axisLine={{ stroke: '#e5e7eb' }}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="weight" 
            name="Weight" 
            stroke="#0EA5E9" 
            strokeWidth={2}
            fill="url(#colorWeight)"
            activeDot={{ r: 6, stroke: '#0EA5E9', strokeWidth: 2, fill: 'white' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default WeightChart;
