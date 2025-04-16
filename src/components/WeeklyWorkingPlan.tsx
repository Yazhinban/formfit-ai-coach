
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarDays, Clock, Dumbbell, Plus, Trash2 } from 'lucide-react';

interface WorkoutPlan {
  id: string;
  day: string;
  exerciseType: string;
  duration: string;
  setsReps: string;
  completed: boolean;
}

interface WeeklyWorkingPlanProps {
  plans: WorkoutPlan[];
  onAddPlan: (plan: Partial<WorkoutPlan>) => void;
  onUpdatePlan: (id: string, updates: Partial<WorkoutPlan>) => void;
  onDeletePlan: (id: string) => void;
}

const WeeklyWorkingPlan: React.FC<WeeklyWorkingPlanProps> = ({
  plans,
  onAddPlan,
  onUpdatePlan,
  onDeletePlan
}) => {
  const [newPlan, setNewPlan] = React.useState<Partial<WorkoutPlan>>({
    day: "monday",
    exerciseType: "",
    duration: "",
    setsReps: "",
    completed: false
  });

  const handleInputChange = (field: keyof WorkoutPlan, value: string | boolean) => {
    setNewPlan(prev => ({ ...prev, [field]: value }));
  };

  const handleAddPlan = () => {
    onAddPlan(newPlan);
    setNewPlan({
      day: "monday",
      exerciseType: "",
      duration: "",
      setsReps: "",
      completed: false
    });
  };

  // Group plans by day for better organization
  const plansByDay: Record<string, WorkoutPlan[]> = plans.reduce(
    (acc, plan) => {
      const day = plan.day.toLowerCase();
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(plan);
      return acc;
    },
    {} as Record<string, WorkoutPlan[]>
  );

  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  
  const getDayLabel = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Dumbbell className="h-5 w-5" />
          Weekly Working Plan
        </CardTitle>
        <CardDescription>
          Schedule your workouts for the week
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 grid-cols-1">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr,1fr,1fr] md:grid-cols-[1fr,1fr,80px]">
            <div>
              <Label htmlFor="day">Day</Label>
              <select 
                id="day" 
                className="w-full rounded-md border border-input px-3 py-2 text-sm"
                value={newPlan.day}
                onChange={(e) => handleInputChange('day', e.target.value)}
              >
                {days.map(day => (
                  <option key={day} value={day}>{getDayLabel(day)}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="exerciseType">Exercise Type</Label>
              <Input 
                id="exerciseType" 
                value={newPlan.exerciseType}
                onChange={(e) => handleInputChange('exerciseType', e.target.value)}
                placeholder="e.g., Strength, Cardio"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input 
                  id="duration" 
                  value={newPlan.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  placeholder="30 mins"
                />
              </div>
              <div>
                <Label htmlFor="setsReps">Sets/Reps</Label>
                <Input 
                  id="setsReps" 
                  value={newPlan.setsReps}
                  onChange={(e) => handleInputChange('setsReps', e.target.value)}
                  placeholder="3x12"
                />
              </div>
            </div>
          </div>
          <Button onClick={handleAddPlan} className="w-full flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Workout
          </Button>
        </div>

        <div className="space-y-4">
          {days.map((day) => (
            <div key={day} className="space-y-2">
              <h3 className="font-medium text-sm text-muted-foreground">{getDayLabel(day)}</h3>
              
              {plansByDay[day]?.length > 0 ? (
                <div className="space-y-2">
                  {plansByDay[day].map((plan) => (
                    <div 
                      key={plan.id} 
                      className={`p-3 rounded-lg border ${plan.completed ? 'bg-muted/50' : 'bg-background'} flex justify-between items-center`}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox 
                          checked={plan.completed}
                          onCheckedChange={(checked) => 
                            onUpdatePlan(plan.id, { completed: checked === true })}
                          id={`completed-${plan.id}`}
                        />
                        <div>
                          <p className={`font-medium ${plan.completed ? 'line-through text-muted-foreground' : ''}`}>
                            {plan.exerciseType}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3" />
                            <span>{plan.duration}</span>
                            {plan.setsReps && (
                              <>
                                <span>•</span>
                                <span>{plan.setsReps}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeletePlan(plan.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-2">No workouts scheduled</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyWorkingPlan;
