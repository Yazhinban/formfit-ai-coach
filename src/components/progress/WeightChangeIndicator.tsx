import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Scale } from 'lucide-react';

interface WeightChangeIndicatorProps {
  weightChangePercent: number;
}

const WeightChangeIndicator: React.FC<WeightChangeIndicatorProps> = ({ weightChangePercent }) => {
  const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');
  
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
        <div className="flex items-center gap-2">
          <Scale className="h-4 w-4 text-muted-foreground" />
          <Label className="text-sm font-medium">Weight</Label>
        </div>
        <Select value={unit} onValueChange={(value: 'kg' | 'lbs') => setUnit(value)}>
          <SelectTrigger className="w-[80px] h-8">
            <SelectValue>{unit.toUpperCase()}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="kg">KG</SelectItem>
            <SelectItem value="lbs">LBS</SelectItem>
          </SelectContent>
        </Select>
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
