
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Activity, LineChart, BarChart, Scale, Calendar, Plus, ChevronRight } from 'lucide-react';
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
  strength?: number;
  endurance?: number;
  formQuality?: number;
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
    strength: undefined,
    endurance: undefined,
    formQuality: undefined,
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
      strength: undefined,
      endurance: undefined,
      formQuality: undefined,
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

  // Get the latest entry for calculations
  const latestEntry = React.useMemo(() => {
    if (progressData.length === 0) return null;
    
    return progressData.reduce((latest, current) => {
      return new Date(current.date) > new Date(latest.date) ? current : latest;
    }, progressData[0]);
  }, [progressData]);

  // Calculate improvement percentages
  const calculateImprovement = (field: keyof ProgressEntry) => {
    if (progressData.length < 2 || !latestEntry) return 0;
    
    const previousEntries = [...progressData]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // Skip first (latest) entry and find the next one with the field
    const previousEntry = previousEntries
      .slice(1)
      .find(entry => entry[field] !== undefined);
    
    if (!previousEntry || previousEntry[field] === undefined || latestEntry[field] === undefined) {
      return 0;
    }
    
    const current = latestEntry[field] as number;
    const previous = previousEntry[field] as number;
    
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  return (
    <Card className="h-full">
      <CardHeader>
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Form Quality</Label>
                  <span className={`text-xs ${calculateImprovement('formQuality') >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {calculateImprovement('formQuality').toFixed(1)}%
                  </span>
                </div>
                <Progress value={latestEntry?.formQuality || 0} max={100} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Strength Progress</Label>
                  <span className={`text-xs ${calculateImprovement('strength') >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {calculateImprovement('strength').toFixed(1)}%
                  </span>
                </div>
                <Progress value={latestEntry?.strength || 0} max={100} className="h-2" />
              </div>
            </div>
            
            <div className="h-[200px] w-full mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart
                  data={filteredData.map(entry => ({
                    date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    weight: entry.weight,
                    formQuality: entry.formQuality,
                    strength: entry.strength,
                    endurance: entry.endurance
                  }))}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="formQuality" name="Form Quality" stroke="#8884d8" />
                  <Line type="monotone" dataKey="strength" name="Strength" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="weight" name="Weight" stroke="#ffc658" />
                </RechartsLineChart>
              </ResponsiveContainer>
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
          <div className="grid grid-cols-2 gap-3">
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
          
          <div className="grid grid-cols-3 gap-3 mt-3">
            <div className="space-y-2">
              <Label htmlFor="strength">Strength (0-100)</Label>
              <Input
                id="strength"
                type="number"
                placeholder="0-100"
                min="0"
                max="100"
                value={newEntry.strength || ''}
                onChange={(e) => handleInputChange('strength', parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endurance">Endurance (0-100)</Label>
              <Input
                id="endurance"
                type="number"
                placeholder="0-100"
                min="0"
                max="100"
                value={newEntry.endurance || ''}
                onChange={(e) => handleInputChange('endurance', parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="formQuality">Form Quality (0-100)</Label>
              <Input
                id="formQuality"
                type="number"
                placeholder="0-100"
                min="0"
                max="100"
                value={newEntry.formQuality || ''}
                onChange={(e) => handleInputChange('formQuality', parseFloat(e.target.value))}
              />
            </div>
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
          
          <Button onClick={handleAddEntry} className="w-full mt-4">
            <Plus className="h-4 w-4 mr-2" /> Add Progress Entry
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressTracking;
