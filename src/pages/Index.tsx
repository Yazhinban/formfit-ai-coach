import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import WorkoutDisplay from '@/components/WorkoutDisplay';
import WeeklyWorkingPlan from '@/components/WeeklyWorkingPlan';
import StreakCalendar from '@/components/StreakCalendar';
import ProgressTracking from '@/components/ProgressTracking';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { UserRound, CalendarDays, Dumbbell, ChevronRight, VideoIcon, Plus, Save, Trash2, Clock, HeartPulse, Siren, Apple, Gauge } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { v4 as uuidv4 } from 'uuid';

interface WorkoutItem {
  id: number;
  day: string;
  exercise: string;
}

interface WorkoutPlan {
  id: string;
  day: string;
  exerciseType: string;
  duration: string;
  setsReps: string;
  completed: boolean;
}

interface StreakDay {
  date: Date;
  attended: boolean;
}

interface ProgressEntry {
  id: string;
  date: string;
  weight?: number;
  strength?: number;
  endurance?: number;
  formQuality?: number;
  notes?: string;
}

const Index = () => {
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    age: "",
    height: "",
    weight: "",
    diet: "",
    fitnessGoals: "",
    preferredWorkoutTimes: "",
    injuries: "",
    nutritionPreferences: "",
    experienceLevel: ""
  });

  const [weeklyPlan, setWeeklyPlan] = useState({
    monday: "",
    tuesday: "",
    wednesday: "",
    thursday: "",
    friday: "",
    saturday: "",
    sunday: ""
  });

  const [selectedDay, setSelectedDay] = useState("");
  const [newExercise, setNewExercise] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [workouts, setWorkouts] = useState<WorkoutItem[]>([]);
  const [workoutCounter, setWorkoutCounter] = useState(1);

  const [workingPlans, setWorkingPlans] = useState<WorkoutPlan[]>([
    {
      id: uuidv4(),
      day: "monday",
      exerciseType: "Push Day",
      duration: "45 min",
      setsReps: "4x12",
      completed: false
    },
    {
      id: uuidv4(),
      day: "wednesday",
      exerciseType: "Pull Day",
      duration: "50 min",
      setsReps: "4x10",
      completed: false
    },
    {
      id: uuidv4(),
      day: "friday",
      exerciseType: "Leg Day",
      duration: "60 min",
      setsReps: "3x15",
      completed: true
    }
  ]);
  
  const [streakDays, setStreakDays] = useState<StreakDay[]>([
    { date: new Date(Date.now() - 86400000 * 0), attended: true },
    { date: new Date(Date.now() - 86400000 * 1), attended: true },
    { date: new Date(Date.now() - 86400000 * 2), attended: true },
    { date: new Date(Date.now() - 86400000 * 3), attended: false },
    { date: new Date(Date.now() - 86400000 * 4), attended: true }
  ]);
  
  const [progressData, setProgressData] = useState<ProgressEntry[]>([
    {
      id: uuidv4(),
      date: new Date(Date.now() - 86400000 * 0).toISOString().split('T')[0],
      weight: 175,
      strength: 80,
      endurance: 75,
      formQuality: 85
    },
    {
      id: uuidv4(),
      date: new Date(Date.now() - 86400000 * 7).toISOString().split('T')[0],
      weight: 178,
      strength: 75,
      endurance: 70,
      formQuality: 80
    },
    {
      id: uuidv4(),
      date: new Date(Date.now() - 86400000 * 14).toISOString().split('T')[0],
      weight: 180,
      strength: 70,
      endurance: 65,
      formQuality: 75
    },
    {
      id: uuidv4(),
      date: new Date(Date.now() - 86400000 * 21).toISOString().split('T')[0],
      weight: 182,
      strength: 65,
      endurance: 60,
      formQuality: 70
    }
  ]);

  const handlePersonalInfoChange = (field: string, value: string) => {
    setPersonalInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleWorkoutPlanChange = (day: string, value: string) => {
    setWeeklyPlan(prev => ({
      ...prev,
      [day]: value
    }));
  };

  const handleAddExercise = () => {
    if (!selectedDay) {
      toast({
        title: "No Day Selected",
        description: "Please select a day to add exercises to.",
        variant: "destructive",
      });
      return;
    }

    if (!newExercise.trim()) {
      toast({
        title: "No Exercise Entered",
        description: "Please enter an exercise name.",
        variant: "destructive",
      });
      return;
    }

    const newWorkout: WorkoutItem = {
      id: workoutCounter,
      day: selectedDay,
      exercise: newExercise
    };

    setWorkouts(prev => [...prev, newWorkout]);
    setWorkoutCounter(prev => prev + 1);
    setNewExercise("");
    
    toast({
      title: "Exercise Added",
      description: `Added ${newExercise} to ${selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}'s workout.`,
    });
  };

  const handleDeleteWorkout = (id: number) => {
    setWorkouts(prev => prev.filter(workout => workout.id !== id));
    
    toast({
      title: "Workout Removed",
      description: "The workout has been removed from your plan.",
    });
  };

  const handleAddWorkingPlan = (plan: Partial<WorkoutPlan>) => {
    const newPlan: WorkoutPlan = {
      id: uuidv4(),
      day: plan.day || "monday",
      exerciseType: plan.exerciseType || "",
      duration: plan.duration || "",
      setsReps: plan.setsReps || "",
      completed: plan.completed || false
    };
    
    setWorkingPlans(prev => [...prev, newPlan]);
    
    toast({
      title: "Plan Added",
      description: `Added ${newPlan.exerciseType} to your workout plan.`,
    });
  };

  const handleUpdateWorkingPlan = (id: string, updates: Partial<WorkoutPlan>) => {
    setWorkingPlans(prev => 
      prev.map(plan => 
        plan.id === id ? { ...plan, ...updates } : plan
      )
    );
  };

  const handleDeleteWorkingPlan = (id: string) => {
    setWorkingPlans(prev => prev.filter(plan => plan.id !== id));
    
    toast({
      title: "Plan Removed",
      description: "The workout plan has been removed.",
    });
  };

  const handleAddStreakDay = (date: Date, attended: boolean) => {
    const existingIndex = streakDays.findIndex(day => 
      day.date.getFullYear() === date.getFullYear() &&
      day.date.getMonth() === date.getMonth() &&
      day.date.getDate() === date.getDate()
    );
    
    if (existingIndex >= 0) {
      const updatedDays = [...streakDays];
      updatedDays[existingIndex] = { date, attended };
      setStreakDays(updatedDays);
    } else {
      setStreakDays(prev => [...prev, { date, attended }]);
    }
    
    toast({
      title: attended ? "Attendance Marked" : "Absence Recorded",
      description: `You've marked ${new Date(date).toLocaleDateString()} as ${attended ? 'attended' : 'missed'}.`,
    });
  };

  const handleAddProgressEntry = (entry: Partial<ProgressEntry>) => {
    const newEntry: ProgressEntry = {
      id: uuidv4(),
      date: entry.date || new Date().toISOString().split('T')[0],
      weight: entry.weight,
      strength: entry.strength,
      endurance: entry.endurance,
      formQuality: entry.formQuality,
      notes: entry.notes
    };
    
    setProgressData(prev => [...prev, newEntry]);
    
    toast({
      title: "Progress Recorded",
      description: "Your progress entry has been saved.",
    });
  };

  const workoutOptions = [
    "Rest Day",
    "Upper Body",
    "Lower Body",
    "Push Day",
    "Pull Day",
    "Core & Abs",
    "Cardio",
    "Full Body",
    "HIIT",
    "Yoga/Flexibility"
  ];

  const handleSavePlan = () => {
    toast({
      title: "Plan Saved",
      description: "Your workout plan has been saved successfully.",
    });
  };

  const handleSaveProfile = () => {
    toast({
      title: "Profile Saved",
      description: "Your personal information has been saved successfully.",
    });
  };

  const daysOfWeek = {
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday"
  };

  const experienceLevels = [
    "Beginner",
    "Intermediate",
    "Advanced",
    "Professional",
    "Athletic",
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container max-w-7xl py-8 px-4 sm:px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">FormFit Dashboard</h1>
            <p className="text-muted-foreground">Manage your fitness profile and workout plan</p>
          </div>
          <Link to="/form-analyzer">
            <Button className="flex items-center gap-2" size="lg">
              <VideoIcon className="h-5 w-5" /> 
              Go to Form Analyzer
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <UserRound className="h-5 w-5" />
                Personal Info
              </CardTitle>
              <CardDescription>
                Your profile information helps us personalize workout recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    value={personalInfo.name} 
                    onChange={(e) => handlePersonalInfoChange('name', e.target.value)} 
                    placeholder="Your name"
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input 
                      id="age" 
                      value={personalInfo.age} 
                      onChange={(e) => handlePersonalInfoChange('age', e.target.value)} 
                      placeholder="Age"
                    />
                  </div>
                  <div>
                    <Label htmlFor="height">Height</Label>
                    <Input 
                      id="height" 
                      value={personalInfo.height} 
                      onChange={(e) => handlePersonalInfoChange('height', e.target.value)} 
                      placeholder="cm/ft"
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight">Weight</Label>
                    <Input 
                      id="weight" 
                      value={personalInfo.weight} 
                      onChange={(e) => handlePersonalInfoChange('weight', e.target.value)} 
                      placeholder="kg/lbs"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="fitnessGoals" className="flex items-center gap-2">
                    <HeartPulse className="h-4 w-4" /> Fitness Goals
                  </Label>
                  <Textarea
                    id="fitnessGoals"
                    value={personalInfo.fitnessGoals}
                    onChange={(e) => handlePersonalInfoChange('fitnessGoals', e.target.value)}
                    placeholder="E.g., lose weight, build muscle, improve endurance"
                    className="min-h-[60px]"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="preferredWorkoutTimes" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Preferred Workout Times
                  </Label>
                  <Select
                    value={personalInfo.preferredWorkoutTimes}
                    onValueChange={(value) => handlePersonalInfoChange('preferredWorkoutTimes', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="When do you prefer to workout?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning</SelectItem>
                      <SelectItem value="afternoon">Afternoon</SelectItem>
                      <SelectItem value="evening">Evening</SelectItem>
                      <SelectItem value="night">Night</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="injuries" className="flex items-center gap-2">
                    <Siren className="h-4 w-4" /> Injuries or Limitations
                  </Label>
                  <Textarea
                    id="injuries"
                    value={personalInfo.injuries}
                    onChange={(e) => handlePersonalInfoChange('injuries', e.target.value)}
                    placeholder="Any injuries or physical limitations we should know about?"
                    className="min-h-[60px]"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="nutritionPreferences" className="flex items-center gap-2">
                    <Apple className="h-4 w-4" /> Nutrition Preferences
                  </Label>
                  <Textarea
                    id="nutritionPreferences"
                    value={personalInfo.nutritionPreferences}
                    onChange={(e) => handlePersonalInfoChange('nutritionPreferences', e.target.value)}
                    placeholder="E.g., Vegetarian, High-protein, Low-carb, etc."
                    className="min-h-[60px]"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="experienceLevel" className="flex items-center gap-2">
                    <Gauge className="h-4 w-4" /> Experience Level
                  </Label>
                  <Select
                    value={personalInfo.experienceLevel}
                    onValueChange={(value) => handlePersonalInfoChange('experienceLevel', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="What's your fitness experience level?" />
                    </SelectTrigger>
                    <SelectContent>
                      {experienceLevels.map((level) => (
                        <SelectItem key={level} value={level.toLowerCase()}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button className="mt-2" onClick={handleSaveProfile}>Save Profile</Button>
              </div>
            </CardContent>
          </Card>
          
          <WeeklyWorkingPlan 
            plans={workingPlans}
            onAddPlan={handleAddWorkingPlan}
            onUpdatePlan={handleUpdateWorkingPlan}
            onDeletePlan={handleDeleteWorkingPlan}
          />
          
          <StreakCalendar 
            streakDays={streakDays}
            onAddStreakDay={handleAddStreakDay}
          />
          
          <ProgressTracking 
            progressData={progressData}
            onAddProgress={handleAddProgressEntry}
          />
        </div>

        <WorkoutDisplay workouts={workouts} onDelete={handleDeleteWorkout} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Workout Recommendations</CardTitle>
              <CardDescription>Based on your profile and goals</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {[
                  "Focus on compound exercises for maximum efficiency",
                  "Include 2-3 days of strength training per week",
                  "Add 1-2 days of cardio for heart health",
                  "Don't forget mobility work and stretching",
                  "Rest is crucial - ensure you have 1-2 rest days"
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <ChevronRight className="h-5 w-5 text-primary mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Nutrition Tips</CardTitle>
              <CardDescription>General guidance for your fitness journey</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {[
                  "Aim for 0.8-1g of protein per pound of bodyweight",
                  "Stay hydrated - drink at least 8 glasses of water daily",
                  "Eat a balanced diet with plenty of vegetables",
                  "Time your carbohydrates around your workouts",
                  "Consider protein intake within 30 minutes post-workout"
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <ChevronRight className="h-5 w-5 text-primary mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
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
    </div>
  );
};

export default Index;
