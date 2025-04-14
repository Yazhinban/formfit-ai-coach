
import React, { useState } from 'react';
import Header from '@/components/Header';
import { usePoseDetection } from '@/hooks/usePoseDetection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { UserRound, CalendarDays, Dumbbell } from 'lucide-react';

// Import refactored components
import UploadTab from '@/components/upload/UploadTab';
import AnalysisTab from '@/components/analysis/AnalysisTab';
import ResultsTab from '@/components/results/ResultsTab';

const Index = () => {
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisComplete, setAnalysisComplete] = useState<boolean>(false);
  const [workoutType, setWorkoutType] = useState<string>("");
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);
  
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
  
  const { 
    keypoints, 
    isDetecting, 
    startDetection, 
    stopDetection, 
    analyzeForm,
    analysisResult
  } = usePoseDetection(videoElement, workoutType);

  const handleVideoLoaded = (video: HTMLVideoElement, file: File | null) => {
    setVideoElement(video);
    setVideoFile(file);
    setAnalysisComplete(false);
  };

  const handleWorkoutTypeChange = (type: string) => {
    setWorkoutType(type);
  };

  const handleStartAnalysis = () => {
    if (!videoElement) {
      toast({
        title: "No Video Available",
        description: "Please upload a video or use your camera first.",
        variant: "destructive",
      });
      return;
    }
    
    if (!workoutType) {
      toast({
        title: "Workout Type Missing",
        description: "Please select what type of workout you're doing.",
        variant: "destructive",
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    if (videoFile) {
      // For uploaded videos, play the video and detect poses
      videoElement.play().catch(console.error);
    }
    
    startDetection();
    
    toast({
      title: "Analysis Started",
      description: `Analyzing your ${workoutType} form...`,
    });
    
    // Simulate analysis progress
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.floor(Math.random() * 10) + 1;
      if (progress >= 100) {
        progress = 100;
        clearInterval(progressInterval);
      }
      setAnalysisProgress(progress);
    }, 500);
    
    // Simulate analysis completion (in real app, this would be event-driven)
    setTimeout(() => {
      if (progressInterval) clearInterval(progressInterval);
      setAnalysisProgress(100);
      handleStopAnalysis();
    }, 5000); // 5 seconds for simulation
  };

  const handleStopAnalysis = () => {
    if (videoElement && videoFile) {
      videoElement.pause();
    }
    
    stopDetection();
    setIsAnalyzing(false);
    
    // Perform final analysis
    const result = analyzeForm();
    setAnalysisComplete(true);
    
    toast({
      title: "Analysis Complete",
      description: `${workoutType} form score: ${result.score}/100`,
    });
    
    // Switch to results tab
    setActiveTab("results");
  };

  const handleResetAnalysis = () => {
    if (videoElement && videoFile) {
      videoElement.currentTime = 0;
    }
    
    stopDetection();
    setIsAnalyzing(false);
    setAnalysisComplete(false);
    setAnalysisProgress(0);
  };

  const handleSendMessage = async (message: string): Promise<string> => {
    // In a real app, this would call an AI service
    return new Promise((resolve) => {
      setTimeout(() => {
        if (message.toLowerCase().includes('workout plan')) {
          resolve(`Here's a balanced weekly workout plan:
          Monday: Upper body (bench press, rows, shoulder press)
          Tuesday: Lower body (squats, lunges, leg press)
          Wednesday: Rest or light cardio
          Thursday: Push exercises (chest, shoulders, triceps)
          Friday: Pull exercises (back, biceps)
          Saturday: Core and cardio
          Sunday: Rest day`);
        } else if (message.toLowerCase().includes(workoutType?.toLowerCase() || '')) {
          resolve(`For proper ${workoutType} form, focus on maintaining proper alignment and technique. Would you like me to analyze your ${workoutType} form?`);
        } else if (message.toLowerCase().includes('feedback')) {
          resolve(`Based on your ${workoutType || 'workout'} video, I noticed some areas for improvement. Keep working on maintaining proper form throughout the movement.`);
        } else if (message.toLowerCase().includes('sets') || message.toLowerCase().includes('reps')) {
          resolve(`For ${workoutType || 'most exercises'}, I recommend 3-4 sets of 8-12 reps for muscle growth, or 4-6 sets of 3-5 reps for strength. Rest 60-90 seconds between sets.`);
        } else if (message.toLowerCase().includes('diet') || message.toLowerCase().includes('nutrition')) {
          resolve(`For optimal fitness results, focus on balanced nutrition with adequate protein (0.8-1g per pound of bodyweight), complex carbs for energy, and healthy fats. Stay hydrated and time your meals around your workouts.`);
        } else {
          resolve("I'm your AI fitness coach! I can help with exercise form, workout plans, and technique tips. What would you like to know about your workout today?");
        }
      }, 1000);
    });
  };

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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container max-w-7xl py-8 px-4 sm:px-6">
        <h1 className="text-3xl font-bold mb-2">Form Analyzer</h1>
        <p className="text-muted-foreground mb-8">Upload or record your workout to get real-time form correction</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Personal Info Card */}
          <Card>
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
                <Button size="sm">
                  <Dumbbell className="h-4 w-4 mr-2" />
                  Save Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload Video</TabsTrigger>
            <TabsTrigger value="analyze">Analyze Form</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="mt-6">
            <UploadTab 
              onVideoLoaded={handleVideoLoaded}
              videoElement={videoElement}
              onNavigateToAnalyze={() => setActiveTab("analyze")}
              onWorkoutTypeChange={handleWorkoutTypeChange}
            />
          </TabsContent>
          
          <TabsContent value="analyze" className="mt-6">
            <AnalysisTab 
              videoElement={videoElement}
              keypoints={keypoints}
              isAnalyzing={isAnalyzing}
              analysisComplete={analysisComplete}
              analysisResult={analysisResult}
              onStartAnalysis={handleStartAnalysis}
              onStopAnalysis={handleStopAnalysis}
              onResetAnalysis={handleResetAnalysis}
              onSendMessage={handleSendMessage}
              onNavigateToResults={() => setActiveTab("results")}
              onNavigateToUpload={() => setActiveTab("upload")}
              workoutType={workoutType}
              analysisProgress={analysisProgress}
            />
          </TabsContent>
          
          <TabsContent value="results" className="mt-6">
            <ResultsTab 
              analysisComplete={analysisComplete}
              analysisResult={analysisResult}
              onSendMessage={handleSendMessage}
              onNavigateToAnalyze={() => setActiveTab("analyze")}
              workoutType={workoutType}
            />
          </TabsContent>
        </Tabs>
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
