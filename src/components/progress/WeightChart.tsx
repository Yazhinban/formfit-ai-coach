
import React from 'react';
import {
  LineChart,
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
    formScore: entry.formScore,
    workout: entry.workout || 'Not specified',
    exercise: entry.exerciseType || 'Unknown exercise'
  }));

  // Calculate min and max for better Y-axis visualization
  const weights = chartData.map(item => item.weight).filter(Boolean) as number[];
  const minWeight = weights.length > 0 ? Math.max(0, Math.min(...weights) - 5) : 0;
  const maxWeight = weights.length > 0 ? Math.max(...weights) + 5 : 100;
  
  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border rounded-lg shadow-md">
          <p className="font-medium">{label}</p>
          {payload[0]?.value !== undefined && (
            <p className="text-sm text-blue-500">Weight: <span className="font-semibold">{payload[0].value} lbs</span></p>
          )}
          {payload[1]?.value !== undefined && (
            <p className="text-sm text-green-500">Form Score: <span className="font-semibold">{payload[1].value}</span></p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            {payload[0]?.payload.workout} 
            {payload[0]?.payload.exercise !== 'Unknown exercise' ? ` (${payload[0]?.payload.exercise})` : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  // Animation variants for chart container
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut" } 
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="h-[280px] w-full mt-6 bg-gradient-to-r from-background to-muted/5 p-4 rounded-lg border shadow-sm"
    >
      <div className="mb-2 flex justify-between items-center">
        <h3 className="text-sm font-medium">Progress Tracking</h3>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Weight (lbs)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Form Score</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
        >
          <defs>
            <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorFormScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1}/>
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
            yAxisId="left"
            domain={[minWeight > 0 ? minWeight : 'auto', 'auto']}
            tick={{ fontSize: 11 }} 
            tickMargin={8}
            axisLine={{ stroke: '#e5e7eb' }}
            tickFormatter={(value) => `${value}`}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            domain={[0, 100]}
            tick={{ fontSize: 11 }} 
            tickMargin={8}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="weight" 
            name="Weight" 
            stroke="#0EA5E9" 
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 2, fill: 'white' }}
            activeDot={{ r: 6, stroke: '#0EA5E9', strokeWidth: 2, fill: 'white' }}
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="formScore" 
            name="Form Score" 
            stroke="#22c55e" 
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 2, fill: 'white' }}
            activeDot={{ r: 6, stroke: '#22c55e', strokeWidth: 2, fill: 'white' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default WeightChart;
