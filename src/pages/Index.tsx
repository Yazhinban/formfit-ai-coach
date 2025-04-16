
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import WorkoutDisplay from '@/components/WorkoutDisplay';
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

interface WorkoutItem {
  id: number;
  day: string;
  exercise: string;
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Personal Information Card - Now in its own column */}
          <Card>
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
          
          {/* Weekly Workout Plan Card - Now in its own column */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Weekly Workout Plan
              </CardTitle>
              <CardDescription>
                Plan your workout routine for the entire week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Day</TableHead>
                    <TableHead>Workout Type</TableHead>
                    <TableHead className="w-[150px] text-right">Exercises</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(daysOfWeek).map(([day, label]) => (
                    <TableRow key={day}>
                      <TableCell className="font-medium">{label}</TableCell>
                      <TableCell>
                        <Select 
                          value={weeklyPlan[day as keyof typeof weeklyPlan]} 
                          onValueChange={(value) => handleWorkoutPlanChange(day, value)}
                        >
                          <SelectTrigger id={day} className="w-full">
                            <SelectValue placeholder="Select workout" />
                          </SelectTrigger>
                          <SelectContent>
                            {workoutOptions.map((option) => (
                              <SelectItem key={`${day}-${option}`} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog open={dialogOpen && selectedDay === day} onOpenChange={(open) => {
                          setDialogOpen(open);
                          if (open) setSelectedDay(day);
                        }}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="flex items-center gap-1">
                              <Plus className="h-3.5 w-3.5" />
                              Add Exercises
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add Exercises for {label}</DialogTitle>
                              <DialogDescription>
                                Enter specific exercises you want to do on {label}.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="flex items-end gap-2">
                                <div className="grid gap-2 flex-1">
                                  <Label htmlFor="exercise-name">Exercise Name</Label>
                                  <Input
                                    id="exercise-name"
                                    value={newExercise}
                                    onChange={(e) => setNewExercise(e.target.value)}
                                    placeholder="E.g., Bench Press, Squats"
                                  />
                                </div>
                                <Button onClick={handleAddExercise}>Add</Button>
                              </div>
                              
                              {workouts.filter(w => w.day === day).length > 0 ? (
                                <div>
                                  <Label>Current Exercises:</Label>
                                  <ul className="mt-2 space-y-1">
                                    {workouts
                                      .filter(workout => workout.day === day)
                                      .map((workout) => (
                                        <li key={workout.id} className="flex items-center justify-between gap-2">
                                          <div className="flex items-center gap-2">
                                            <ChevronRight className="h-4 w-4 text-primary" />
                                            <span>{workout.exercise}</span>
                                          </div>
                                          <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-7 w-7"
                                            onClick={() => handleDeleteWorkout(workout.id)}
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </li>
                                      ))
                                    }
                                  </ul>
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground">
                                  No exercises added for {label} yet.
                                </p>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        {workouts.filter(w => w.day === day).length > 0 && (
                          <div className="text-sm text-muted-foreground mt-1">
                            {workouts.filter(w => w.day === day).length} exercise(s)
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <Separator className="my-4" />
              <div className="flex justify-end">
                <Button onClick={handleSavePlan}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Plan
                </Button>
              </div>
            </CardContent>
          </Card>
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
