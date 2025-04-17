
import React from 'react';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface WeightChangeIndicatorProps {
  weightChangePercent: number;
}

const WeightChangeIndicator: React.FC<WeightChangeIndicatorProps> = ({ weightChangePercent }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-2 animate-fade-in"
    >
      <div className="flex justify-between items-center">
        <Label>Weight Change</Label>
        <motion.span 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, delay: 0.2 }}
          className={`flex items-center gap-1 text-sm font-medium rounded-full px-2 py-0.5 ${
            weightChangePercent > 0 
              ? 'text-green-500 bg-green-50' 
              : weightChangePercent < 0 
                ? 'text-red-500 bg-red-50' 
                : 'text-blue-500 bg-blue-50'
          }`}
        >
          {weightChangePercent > 0 ? (
            <TrendingUp className="h-3 w-3" />
          ) : weightChangePercent < 0 ? (
            <TrendingDown className="h-3 w-3" />
          ) : null}
          {weightChangePercent.toFixed(1)}%
        </motion.span>
      </div>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 0.8 }}
      >
        <Progress 
          value={Math.abs(weightChangePercent)} 
          max={10} 
          className={`h-2 ${
            weightChangePercent >= 0 
              ? 'bg-muted [&>div]:bg-green-500' 
              : 'bg-muted [&>div]:bg-red-500'
          }`}
        />
      </motion.div>
    </motion.div>
  );
};

export default WeightChangeIndicator;
