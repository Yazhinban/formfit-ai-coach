
import React from 'react';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

interface WeightChangeIndicatorProps {
  weightChangePercent: number;
}

const WeightChangeIndicator: React.FC<WeightChangeIndicatorProps> = ({ weightChangePercent }) => {
  return (
    <div className="space-y-2 animate-fade-in">
      <div className="flex justify-between">
        <Label>Weight Change</Label>
        <span className={`text-xs ${weightChangePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {weightChangePercent.toFixed(1)}%
        </span>
      </div>
      <Progress 
        value={Math.abs(weightChangePercent)} 
        max={10} 
        className="h-2 bg-muted" 
      />
    </div>
  );
};

export default WeightChangeIndicator;
