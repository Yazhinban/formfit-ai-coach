
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, BarChart3 } from 'lucide-react';
import { 
  ProgressEntry, 
  calculateWeightChange, 
  calculateFormImprovement, 
  filterDataByTimeRange 
} from './progress/types';
import WeightChangeIndicator from './progress/WeightChangeIndicator';
import WeightChart from './progress/WeightChart';
import ProgressTable from './progress/ProgressTable';
import ProgressEntryForm from './progress/ProgressEntryForm';
import EmptyState from './progress/EmptyState';
import { motion } from 'framer-motion';

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

  // Calculate form improvement percentage
  const formImprovementPercent = calculateFormImprovement(progressData);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Card className="h-full shadow-lg transition-all duration-300 hover:shadow-xl">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-background rounded-t-lg">
          <motion.div variants={childVariants}>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Progress
            </CardTitle>
            <CardDescription>
              Track your fitness journey and improvements over time
            </CardDescription>
          </motion.div>
          
          <motion.div variants={childVariants}>
            <Tabs 
              defaultValue="weekly" 
              value={activeTab} 
              onValueChange={(value) => setActiveTab(value as 'weekly' | 'monthly')} 
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>
            </Tabs>
          </motion.div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {progressData.length > 0 ? (
            <>
              <motion.div 
                variants={childVariants}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <WeightChangeIndicator weightChangePercent={weightChangePercent} />
                
                {/* New Form Improvement Indicator */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-3 bg-background p-4 rounded-lg border shadow-sm"
                >
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-medium">Form Improvement</div>
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, delay: 0.2 }}
                      className={`flex items-center gap-1.5 text-sm font-medium rounded-full px-2.5 py-1 ${
                        formImprovementPercent > 0 
                          ? 'text-green-600 bg-green-50 border border-green-200' 
                          : formImprovementPercent < 0 
                            ? 'text-amber-600 bg-amber-50 border border-amber-200'
                            : 'text-blue-600 bg-blue-50 border border-blue-200'
                      }`}
                    >
                      <BarChart3 className="h-3.5 w-3.5" />
                      {Math.abs(formImprovementPercent).toFixed(1)}%
                    </motion.span>
                  </div>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                    <div 
                      className={`h-2.5 rounded-full bg-muted overflow-hidden`}
                    >
                      <div 
                        className={`h-full rounded-full ${
                          formImprovementPercent > 0 
                            ? 'bg-gradient-to-r from-green-400 to-green-500'
                            : formImprovementPercent < 0
                              ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                              : 'bg-gradient-to-r from-blue-400 to-blue-500'
                        }`}
                        style={{ width: `${Math.min(100, Math.abs(formImprovementPercent))}%` }}
                      ></div>
                    </div>
                  </motion.div>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.8 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="text-xs text-muted-foreground pt-1"
                  >
                    {formImprovementPercent > 0 
                      ? "Your form has improved! Keep up the good work." 
                      : formImprovementPercent < 0 
                        ? "Your form scores have decreased. Focus on proper technique." 
                        : "Your form is consistent. Continue practicing."
                    }
                  </motion.p>
                </motion.div>
              </motion.div>
              
              <motion.div variants={childVariants}>
                <WeightChart filteredData={filteredData} />
              </motion.div>
              
              <motion.div variants={childVariants}>
                <ProgressTable filteredData={filteredData} />
              </motion.div>
            </>
          ) : (
            <motion.div variants={childVariants}>
              <EmptyState />
            </motion.div>
          )}
          
          <motion.div variants={childVariants}>
            <ProgressEntryForm onAddEntry={onAddProgress} />
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProgressTracking;
