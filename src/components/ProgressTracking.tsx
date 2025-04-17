
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Activity, LineChart, BarChart, Scale, Calendar, Plus, ChevronRight, Dumbbell } from 'lucide-react';
import {
  LineChart as RechartsLineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface ProgressEntry {
  id: string;
  date: string;
  weight?: number;
  workout?: string;
  notes?: string;
}

interface ProgressTrackingProps {
  progressData: ProgressEntry[];
  onAddProgress: (entry: Partial<ProgressEntry>) => void;
}

const ProgressTracking: React.FC<ProgressTrackingProps> = ({
  progressData,
  onAddProgress
}) => {
  const [activeTab, setActiveTab] = useState('weekly');
  const [newEntry, setNewEntry] = useState<Partial<ProgressEntry>>({
    date: new Date().toISOString().split('T')[0],
    weight: undefined,
    workout: '',
    notes: ''
  });

  const handleInputChange = (field: keyof ProgressEntry, value: string | number) => {
    setNewEntry(prev => ({ ...prev, [field]: value }));
  };

  const handleAddEntry = () => {
    onAddProgress(newEntry);
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      weight: undefined,
      workout: '',
      notes: ''
    });
  };

  // Filter data based on selected time period
  const filteredData = React.useMemo(() => {
    const now = new Date();
    const startDate = new Date();
    
    if (activeTab === 'weekly') {
      startDate.setDate(now.getDate() - 7);
    } else {
      startDate.setMonth(now.getMonth() - 1);
    }
    
    return progressData
      .filter(entry => new Date(entry.date) >= startDate)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [progressData, activeTab]);

  // Calculate weight change percentage
  const calculateWeightChange = () => {
    if (progressData.length < 2) return 0;
    
    const sortedData = [...progressData]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    const latest = sortedData[0];
    const previous = sortedData[sortedData.length - 1];
    
    if (!latest.weight || !previous.weight) return 0;
    
    return ((latest.weight - previous.weight) / previous.weight) * 100;
  };

  const weightChangePercent = calculateWeightChange();

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
        
        <Tabs defaultValue="weekly" value={activeTab} onValueChange={setActiveTab} className="w-full">
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
            </div>
            
            <div className="h-[240px] w-full mt-6 animate-fade-in">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart
                  data={filteredData.map(entry => ({
                    date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    weight: entry.weight
                  }))}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    name="Weight" 
                    stroke="#0EA5E9" 
                    strokeWidth={2}
                    dot={{ strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4">
              <div className="overflow-auto max-h-64 rounded-md border">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Weight</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Workout</th>
                    </tr>
                  </thead>
                  <tbody className="bg-background divide-y divide-border">
                    {filteredData.map((entry) => (
                      <tr key={entry.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-2 text-sm">{new Date(entry.date).toLocaleDateString()}</td>
                        <td className="px-4 py-2 text-sm">{entry.weight} kg</td>
                        <td className="px-4 py-2 text-sm">{entry.workout || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p>No progress data yet</p>
            <p className="text-sm">Add your first progress entry below</p>
          </div>
        )}
        
        <div className="border-t pt-4 mt-6">
          <h4 className="font-medium mb-3">Add New Progress Entry</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={newEntry.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg/lbs)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="Your weight"
                value={newEntry.weight || ''}
                onChange={(e) => handleInputChange('weight', parseFloat(e.target.value))}
              />
            </div>
          </div>
          
          <div className="space-y-2 mt-3">
            <Label htmlFor="workout">Workout Completed</Label>
            <Input
              id="workout"
              placeholder="e.g., Push Day, 5k Run, Yoga"
              value={newEntry.workout || ''}
              onChange={(e) => handleInputChange('workout', e.target.value)}
            />
          </div>
          
          <div className="space-y-2 mt-3">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              placeholder="Any additional notes about your progress"
              value={newEntry.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
            />
          </div>
          
          <Button 
            onClick={handleAddEntry} 
            className="w-full mt-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300 animate-fade-in"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Progress Entry
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressTracking;
