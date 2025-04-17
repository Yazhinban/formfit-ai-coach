
import React from 'react';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface WeightChangeIndicatorProps {
  weightChangePercent: number;
}

const WeightChangeIndicator: React.FC<WeightChangeIndicatorProps> = ({ weightChangePercent }) => {
  // Determine the appropriate color based on weight change
  const getColorClasses = () => {
    if (weightChangePercent > 0) {
      return {
        badge: 'text-green-600 bg-green-50 border border-green-200',
        progress: 'bg-muted [&>div]:bg-gradient-to-r [&>div]:from-green-400 [&>div]:to-green-500'
      };
    } else if (weightChangePercent < 0) {
      return {
        badge: 'text-red-600 bg-red-50 border border-red-200',
        progress: 'bg-muted [&>div]:bg-gradient-to-r [&>div]:from-red-400 [&>div]:to-red-500'
      };
    } else {
      return {
        badge: 'text-blue-600 bg-blue-50 border border-blue-200',
        progress: 'bg-muted [&>div]:bg-gradient-to-r [&>div]:from-blue-400 [&>div]:to-blue-500'
      };
    }
  };

  const colors = getColorClasses();
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-3 bg-background p-4 rounded-lg border shadow-sm"
    >
      <div className="flex justify-between items-center">
        <Label className="text-sm font-medium">Weight Change</Label>
        <motion.span 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, delay: 0.2 }}
          className={`flex items-center gap-1.5 text-sm font-medium rounded-full px-2.5 py-1 ${colors.badge}`}
        >
          {weightChangePercent > 0 ? (
            <TrendingUp className="h-3.5 w-3.5" />
          ) : weightChangePercent < 0 ? (
            <TrendingDown className="h-3.5 w-3.5" />
          ) : (
            <Minus className="h-3.5 w-3.5" />
          )}
          {Math.abs(weightChangePercent).toFixed(1)}%
        </motion.span>
      </div>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Progress 
          value={Math.abs(weightChangePercent)} 
          max={10} 
          className={`h-2.5 rounded-full ${colors.progress}`}
        />
      </motion.div>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-xs text-muted-foreground pt-1"
      >
        {weightChangePercent > 0 
          ? "Weight gaining trend detected" 
          : weightChangePercent < 0 
            ? "Weight loss trend detected" 
            : "Weight stable"
        }
      </motion.p>
    </motion.div>
  );
};

export default WeightChangeIndicator;
