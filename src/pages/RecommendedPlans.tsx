
import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "@/hooks/use-toast";

interface WorkoutPlan {
  day: string;
  focus: string;
  exercises: string;
  duration: string;
}

const beginnerPlan: WorkoutPlan[] = [
  { day: 'Monday', focus: 'Full Body', exercises: 'Squats, Push-ups, Rows', duration: '45 min' },
  { day: 'Tuesday', focus: 'Rest/Cardio', exercises: 'Walking, Light Cycling', duration: '30 min' },
  { day: 'Wednesday', focus: 'Full Body', exercises: 'Lunges, Shoulder Press, Planks', duration: '45 min' },
  { day: 'Thursday', focus: 'Rest/Mobility', exercises: 'Stretching, Yoga', duration: '30 min' },
  { day: 'Friday', focus: 'Full Body', exercises: 'Deadlifts, Bench Press, Core', duration: '45 min' },
  { day: 'Saturday', focus: 'Active Recovery', exercises: 'Swimming, Light Cardio', duration: '40 min' },
  { day: 'Sunday', focus: 'Rest', exercises: 'Complete Rest', duration: '-' },
];

const intermediatePlan: WorkoutPlan[] = [
  { day: 'Monday', focus: 'Push', exercises: 'Bench Press, Shoulder Press, Triceps', duration: '60 min' },
  { day: 'Tuesday', focus: 'Pull', exercises: 'Rows, Pull-ups, Biceps', duration: '60 min' },
  { day: 'Wednesday', focus: 'Legs', exercises: 'Squats, Deadlifts, Lunges', duration: '60 min' },
  { day: 'Thursday', focus: 'Upper Body', exercises: 'Push-ups, Dips, Lateral Raises', duration: '60 min' },
  { day: 'Friday', focus: 'Lower Body', exercises: 'Front Squats, RDLs, Calf Raises', duration: '60 min' },
  { day: 'Saturday', focus: 'HIIT/Core', exercises: 'Circuit Training, Abs Work', duration: '45 min' },
  { day: 'Sunday', focus: 'Rest', exercises: 'Active Recovery or Rest', duration: '-' },
];

const proPlan: WorkoutPlan[] = [
  { day: 'Monday', focus: 'Push Power', exercises: 'Bench Press, OHP, Advanced Push', duration: '75 min' },
  { day: 'Tuesday', focus: 'Pull Power', exercises: 'Deadlifts, Weighted Pull-ups, Rows', duration: '75 min' },
  { day: 'Wednesday', focus: 'Legs Power', exercises: 'Squat Variations, Olympic Lifts', duration: '75 min' },
  { day: 'Thursday', focus: 'Push Hypertrophy', exercises: 'Volume Push Work, Isolation', duration: '70 min' },
  { day: 'Friday', focus: 'Pull Hypertrophy', exercises: 'Back Volume, Grip Work', duration: '70 min' },
  { day: 'Saturday', focus: 'Legs Hypertrophy', exercises: 'Leg Volume, Plyometrics', duration: '70 min' },
  { day: 'Sunday', focus: 'Recovery', exercises: 'Mobility Work, Light Cardio', duration: '45 min' },
];

const RecommendedPlans = () => {
  const navigate = useNavigate();

  const handleLoadPlan = (planType: string) => {
    // Store the selected plan in localStorage
    const planToSave = planType === 'beginner' 
      ? beginnerPlan 
      : planType === 'intermediate' 
        ? intermediatePlan 
        : proPlan;
    
    localStorage.setItem('selectedWorkoutPlan', JSON.stringify(planToSave));
    
    // Show success toast
    toast({
      title: "Plan loaded successfully",
      description: `The ${planType} plan has been loaded to your workout plan.`,
    });
    
    // Navigate to workout plan page
    navigate('/workout-plan');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container max-w-7xl py-8 px-4 sm:px-6">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/workout-plan">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Workout Plan
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold mb-2">Recommended Workout Plans</h1>
            <p className="text-muted-foreground">Choose a plan that matches your fitness level</p>
          </div>
        </div>
        
        <Tabs defaultValue="beginner" className="w-full">
          <TabsList className="w-full grid grid-cols-3 max-w-[400px]">
            <TabsTrigger value="beginner">Beginner</TabsTrigger>
            <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
            <TabsTrigger value="pro">Pro</TabsTrigger>
          </TabsList>
          
          {['beginner', 'intermediate', 'pro'].map((level) => (
            <TabsContent key={level} value={level}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="capitalize">{level} Workout Plan</CardTitle>
                    <CardDescription>
                      {level === 'beginner' ? 'Perfect for those just starting their fitness journey' :
                       level === 'intermediate' ? 'For those with some training experience' :
                       'Advanced training for experienced athletes'}
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={() => handleLoadPlan(level)}
                    className="ml-auto flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Load Plan
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Day</TableHead>
                          <TableHead>Focus</TableHead>
                          <TableHead>Exercises</TableHead>
                          <TableHead>Duration</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {level === 'beginner' && beginnerPlan.map((plan) => (
                          <TableRow key={plan.day}>
                            <TableCell>{plan.day}</TableCell>
                            <TableCell>{plan.focus}</TableCell>
                            <TableCell>{plan.exercises}</TableCell>
                            <TableCell>{plan.duration}</TableCell>
                          </TableRow>
                        ))}
                        
                        {level === 'intermediate' && intermediatePlan.map((plan) => (
                          <TableRow key={plan.day}>
                            <TableCell>{plan.day}</TableCell>
                            <TableCell>{plan.focus}</TableCell>
                            <TableCell>{plan.exercises}</TableCell>
                            <TableCell>{plan.duration}</TableCell>
                          </TableRow>
                        ))}
                        
                        {level === 'pro' && proPlan.map((plan) => (
                          <TableRow key={plan.day}>
                            <TableCell>{plan.day}</TableCell>
                            <TableCell>{plan.focus}</TableCell>
                            <TableCell>{plan.exercises}</TableCell>
                            <TableCell>{plan.duration}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
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

export default RecommendedPlans;
