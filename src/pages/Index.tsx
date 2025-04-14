
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { UserRound, CalendarDays, Dumbbell, ChevronRight, VideoIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const Index = () => {
  // Personal info state
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    age: "",
    height: "",
    weight: "",
    diet: ""
  });

  // Weekly workout plan state
  const [weeklyPlan, setWeeklyPlan] = useState({
    monday: "",
    tuesday: "",
    wednesday: "",
    thursday: "",
    friday: "",
    saturday: "",
    sunday: ""
  });

  // Handle personal info changes
  const handlePersonalInfoChange = (field: string, value: string) => {
    setPersonalInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle workout plan changes
  const handleWorkoutPlanChange = (day: string, value: string) => {
    setWeeklyPlan(prev => ({
      ...prev,
      [day]: value
    }));
  };

  // Available workout types for the weekly plan
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Profile Info Card */}
          <Card className="md:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <UserRound className="h-5 w-5" />
                Personal Info
              </CardTitle>
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
                  <Label htmlFor="diet">Diet Preferences (Optional)</Label>
                  <Input 
                    id="diet" 
                    value={personalInfo.diet} 
                    onChange={(e) => handlePersonalInfoChange('diet', e.target.value)} 
                    placeholder="E.g., Vegetarian, High-protein, etc."
                  />
                </div>
                <Button className="mt-2">Save Profile</Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Weekly Workout Plan Card - takes 2/3 of the space */}
          <Card className="md:col-span-2">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries({
                  monday: "Monday",
                  tuesday: "Tuesday",
                  wednesday: "Wednesday",
                  thursday: "Thursday",
                  friday: "Friday",
                  saturday: "Saturday",
                  sunday: "Sunday"
                }).map(([day, label]) => (
                  <div key={day} className="flex flex-col gap-1.5">
                    <Label htmlFor={day}>{label}</Label>
                    <Select 
                      value={weeklyPlan[day as keyof typeof weeklyPlan]} 
                      onValueChange={(value) => handleWorkoutPlanChange(day, value)}
                    >
                      <SelectTrigger id={day}>
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
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="flex justify-end">
                <Button onClick={handleSavePlan}>
                  <Dumbbell className="h-4 w-4 mr-2" />
                  Save Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
