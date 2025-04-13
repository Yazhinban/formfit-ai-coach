
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import VideoInput from '@/components/VideoInput';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

interface UploadTabProps {
  onVideoLoaded: (video: HTMLVideoElement, file: File | null) => void;
  videoElement: HTMLVideoElement | null;
  onNavigateToAnalyze: () => void;
  onWorkoutTypeChange: (workoutType: string) => void;
}

const workoutCategories = {
  "Upper Body": ["Bench Press", "Push-up", "Pull-up", "Shoulder Press", "Bicep Curl", "Tricep Extension", "Rows", "Lat Pulldown"],
  "Lower Body": ["Squat", "Deadlift", "Lunge", "Leg Press", "Leg Extension", "Hamstring Curl", "Calf Raise"],
  "Core": ["Plank", "Sit-up", "Russian Twist", "Leg Raise", "Mountain Climber", "Ab Crunch"],
  "Full Body": ["Burpee", "Turkish Get-up", "Clean and Jerk", "Snatch", "Thruster"]
};

// Flatten categories for the select dropdown
const allWorkouts = Object.values(workoutCategories).flat();

const UploadTab: React.FC<UploadTabProps> = ({
  onVideoLoaded,
  videoElement,
  onNavigateToAnalyze,
  onWorkoutTypeChange
}) => {
  const [selectedWorkout, setSelectedWorkout] = useState<string>("");
  
  const handleWorkoutChange = (value: string) => {
    setSelectedWorkout(value);
    onWorkoutTypeChange(value);
  };

  return (
    <div className="space-y-6">
      <VideoInput onVideoLoaded={onVideoLoaded} />
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="workout-type" className="text-base font-medium">What workout are you uploading?</Label>
          <Select 
            value={selectedWorkout} 
            onValueChange={handleWorkoutChange}
          >
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder="Select workout type" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(workoutCategories).map(([category, workouts]) => (
                <React.Fragment key={category}>
                  <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">{category}</div>
                  {workouts.map(workout => (
                    <SelectItem key={workout} value={workout}>
                      {workout}
                    </SelectItem>
                  ))}
                </React.Fragment>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <Button 
          onClick={onNavigateToAnalyze}
          disabled={!videoElement || !selectedWorkout}
        >
          Next: Analyze Form <Check className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default UploadTab;
