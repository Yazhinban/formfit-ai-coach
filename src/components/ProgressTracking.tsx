
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp } from 'lucide-react';
import { ProgressEntry, calculateWeightChange, filterDataByTimeRange } from './progress/types';
import WeightChangeIndicator from './progress/WeightChangeIndicator';
import WeightChart from './progress/WeightChart';
import ProgressTable from './progress/ProgressTable';
import ProgressEntryForm from './progress/ProgressEntryForm';
import EmptyState from './progress/EmptyState';

interface ProgressTrackingProps {
  progressData: ProgressEntry[];
  onAddProgress: (entry: Partial<ProgressEntry>) => void;
}

const ProgressTracking: React.FC<ProgressTrackingProps> = ({
  progressData,
  onAddProgress
}) => {
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly'>('weekly');

  // Filter data based on selected time period
  const filteredData = React.useMemo(() => 
    filterDataByTimeRange(progressData, activeTab), 
    [progressData, activeTab]
  );

  // Calculate weight change percentage
  const weightChangePercent = calculateWeightChange(progressData);

  return (
    <Card className="h-full shadow-lg transition-all duration-300 hover:shadow-xl">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-background rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Progress
        </CardTitle>
        <CardDescription>
          Track your fitness journey and improvements over time
        </CardDescription>
        
        <Tabs defaultValue="weekly" value={activeTab} onValueChange={(value) => setActiveTab(value as 'weekly' | 'monthly')} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {progressData.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-4">
              <WeightChangeIndicator weightChangePercent={weightChangePercent} />
            </div>
            
            <WeightChart filteredData={filteredData} />
            
            <ProgressTable filteredData={filteredData} />
          </>
        ) : (
          <EmptyState />
        )}
        
        <ProgressEntryForm onAddEntry={onAddProgress} />
      </CardContent>
    </Card>
  );
};

export default ProgressTracking;
