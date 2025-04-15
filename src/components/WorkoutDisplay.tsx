
import React from 'react';
import { Dumbbell, Calendar, Clock, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface WorkoutItem {
  id: number;
  day: string;
  exercise: string;
}

interface WorkoutDisplayProps {
  workouts: WorkoutItem[];
  onDelete: (id: number) => void;
}

const WorkoutDisplay: React.FC<WorkoutDisplayProps> = ({ workouts, onDelete }) => {
  if (!workouts.length) {
    return null;
  }

  // Group workouts by day
  const workoutsByDay: Record<string, WorkoutItem[]> = {};
  workouts.forEach(workout => {
    if (!workoutsByDay[workout.day]) {
      workoutsByDay[workout.day] = [];
    }
    workoutsByDay[workout.day].push(workout);
  });

  return (
    <div className="space-y-4 mt-4">
      <h3 className="text-lg font-medium">Your Planned Workouts</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(workoutsByDay).map(([day, dayWorkouts]) => (
          <Card key={day} className="overflow-hidden">
            <div className="bg-primary/10 p-3 flex items-center justify-between border-b">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="font-medium capitalize">{day}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {dayWorkouts.length} {dayWorkouts.length === 1 ? 'exercise' : 'exercises'}
              </span>
            </div>
            <CardContent className="p-3">
              <ul className="space-y-2">
                {dayWorkouts.map((workout) => (
                  <li key={workout.id} className="flex items-center justify-between gap-2 p-2 hover:bg-muted/50 rounded-md">
                    <div className="flex items-center gap-2">
                      <Dumbbell className="h-4 w-4 text-primary" />
                      <span>{workout.exercise}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => onDelete(workout.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WorkoutDisplay;
