
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { VideoIcon, Calendar } from 'lucide-react';
import { ProgressEntry } from '@/components/progress/types';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import WeightChart from '@/components/progress/WeightChart';
import ProgressTable from '@/components/progress/ProgressTable';
import ProgressEntryForm from '@/components/progress/ProgressEntryForm';

const ProgressPage = () => {
  const [timeRange, setTimeRange] = React.useState('8');
  const [progressData, setProgressData] = React.useState<ProgressEntry[]>([
    {
      id: uuidv4(),
      date: new Date(Date.now() - 86400000 * 0).toISOString().split('T')[0],
      weight: 74.5,
      workout: "Push Day",
      formScore: 85,
      exerciseType: "Push-up"
    },
    {
      id: uuidv4(),
      date: new Date(Date.now() - 86400000 * 7).toISOString().split('T')[0],
      weight: 75.5,
      workout: "Pull Day",
      formScore: 78,
      exerciseType: "Pull-up"
    },
    {
      id: uuidv4(),
      date: new Date(Date.now() - 86400000 * 14).toISOString().split('T')[0],
      weight: 76.2,
      workout: "Leg Day",
      formScore: 72,
      exerciseType: "Squat"
    },
    {
      id: uuidv4(),
      date: new Date(Date.now() - 86400000 * 21).toISOString().split('T')[0],
      weight: 78,
      workout: "Rest Day",
      formScore: 65,
      exerciseType: "Deadlift"
    }
  ]);

  const handleAddProgressEntry = (entry: Partial<ProgressEntry>) => {
    const newEntry: ProgressEntry = {
      id: uuidv4(),
      date: entry.date || new Date().toISOString().split('T')[0],
      weight: entry.weight,
      workout: entry.workout,
      formScore: entry.formScore,
      exerciseType: entry.exerciseType,
      notes: entry.notes
    };
    
    setProgressData(prev => [...prev, newEntry]);
  };

  // Calculate metrics for the progress cards
  const startingWeight = progressData.length > 0 ? 
    [...progressData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0]?.weight || 0 : 0;
  
  const currentWeight = progressData.length > 0 ?
    [...progressData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.weight || 0 : 0;
  
  const weightChange = currentWeight - startingWeight;
  const goalProgress = 70; // Example progress percentage
  
  // Workout completion metrics
  const completedWorkouts = 35; // Example completed workouts
  const targetWorkouts = 40; // Example target
  const completionRate = Math.round((completedWorkouts / targetWorkouts) * 100);
  const weeklyAverage = 4.4; // Example weekly average

  // Filter data based on time range
  const filteredData = progressData.filter(entry => {
    const entryDate = new Date(entry.date).getTime();
    const cutoffDate = new Date(Date.now() - parseInt(timeRange) * 7 * 86400000).getTime();
    return entryDate >= cutoffDate;
  });

  return (
    <motion.div 
      className="min-h-screen bg-background flex flex-col"
      initial="hidden"
      animate="visible"
    >
      <Header />
      
      <main className="flex-1 container max-w-7xl py-8 px-4 sm:px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Progress</h1>
            <p className="text-muted-foreground">Track and visualize your fitness journey</p>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <label htmlFor="time-range" className="mr-2 text-sm font-medium">
                Time Range:
              </label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4">Last 4 Weeks</SelectItem>
                  <SelectItem value="8">Last 8 Weeks</SelectItem>
                  <SelectItem value="12">Last 12 Weeks</SelectItem>
                  <SelectItem value="26">Last 6 Months</SelectItem>
                  <SelectItem value="52">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Link to="/form-analyzer">
              <Button className="flex items-center gap-2">
                <VideoIcon className="h-5 w-5" /> 
                Form Analyzer
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Weight Progress Card */}
          <Card className="p-6">
            <h2 className="text-xl font-bold">Weight Progress</h2>
            <p className="text-muted-foreground mb-4">Weight loss progress toward your goal</p>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Goal Progress</span>
                  <span className="text-sm font-medium">{goalProgress}%</span>
                </div>
                <Progress value={goalProgress} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Starting Weight</p>
                  <p className="text-3xl font-bold">{startingWeight} kg</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Weight</p>
                  <p className="text-3xl font-bold">{currentWeight} kg</p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-center text-sm text-muted-foreground">Weight Change</p>
                <p className={`text-center text-4xl font-bold ${weightChange < 0 ? 'text-cyan-500' : weightChange > 0 ? 'text-amber-500' : 'text-blue-500'}`}>
                  {weightChange < 0 ? '' : '+'}
                  {weightChange.toFixed(1)} kg
                </p>
              </div>
            </div>
          </Card>
          
          {/* Workout Completion Card */}
          <Card className="p-6">
            <h2 className="text-xl font-bold">Workout Completion</h2>
            <p className="text-muted-foreground mb-4">Your workout attendance and consistency</p>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Completion Rate</span>
                  <span className="text-sm font-medium">{completionRate}%</span>
                </div>
                <Progress value={completionRate} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Completed Workouts</p>
                  <p className="text-3xl font-bold">{completedWorkouts}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Target Workouts</p>
                  <p className="text-3xl font-bold">{targetWorkouts}</p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-center text-sm text-muted-foreground">Weekly Average</p>
                <p className="text-center text-4xl font-bold text-cyan-500">{weeklyAverage} workouts</p>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="space-y-8">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Weight Tracking</h2>
            <WeightChart filteredData={filteredData} />
          </Card>
          
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Progress History</h2>
            <ProgressTable filteredData={filteredData} />
          </Card>
          
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Add Progress Entry</h2>
            <ProgressEntryForm onAddEntry={handleAddProgressEntry} />
          </Card>
        </div>
      </main>
      
      <footer className="py-6 border-t">
        <div className="container max-w-7xl px-4 sm:px-6">
          <p className="text-center text-muted-foreground text-sm">
            FormFit AI Coach © {new Date().getFullYear()} | AI Powered Workout Analysis
          </p>
        </div>
      </footer>
    </motion.div>
  );
};

export default ProgressPage;
