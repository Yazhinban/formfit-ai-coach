
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="h-[220px] w-full mt-4 bg-gradient-to-r from-background to-muted/5 p-3 rounded-lg border shadow-sm"
    >
      <div className="mb-2 flex justify-between items-center">
        <h3 className="text-sm font-medium">Progress Overview</h3>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-500/80"></div>
            <span>Weight</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
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
            tick={{ fontSize: 10 }} 
            tickMargin={8}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis 
            domain={[minWeight > 0 ? minWeight : 'auto', 'auto']}
            tick={{ fontSize: 10 }} 
            tickMargin={8}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--background))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="weight" 
            stroke="#0EA5E9" 
            strokeWidth={2}
            dot={{ r: 3, strokeWidth: 2, fill: 'white' }}
            activeDot={{ r: 5, stroke: '#0EA5E9', strokeWidth: 2, fill: 'white' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default WeightChart;
