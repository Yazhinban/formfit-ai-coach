
import React, { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Header from '@/components/Header';
import WeeklyWorkingPlan from '@/components/WeeklyWorkingPlan';
import { Button } from '@/components/ui/button';
import { VideoIcon, BookOpen } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

interface WorkoutPlan {
  id: string;
  day: string;
  exerciseType: string;
  duration: string;
  setsReps: string;
  completed: boolean;
}

const WorkoutPlanPage = () => {
  const navigate = useNavigate();
  const [workingPlans, setWorkingPlans] = React.useState<WorkoutPlan[]>([
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

  // Check for loaded plans from local storage
  useEffect(() => {
    const savedPlan = localStorage.getItem('selectedWorkoutPlan');
    if (savedPlan) {
      try {
        const planData = JSON.parse(savedPlan);
        const formattedPlans = planData.map((plan: any) => ({
          id: uuidv4(),
          day: plan.day.toLowerCase(),
          exerciseType: plan.focus,
          duration: plan.duration,
          setsReps: plan.exercises.includes(',') ? '3x12' : '4x10', // Default sets/reps
          completed: false
        }));
        
        setWorkingPlans(formattedPlans);
        // Clear the saved plan after loading
        localStorage.removeItem('selectedWorkoutPlan');
      } catch (error) {
        console.error('Error loading saved workout plan:', error);
      }
    }
  }, []);

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
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container max-w-7xl py-8 px-4 sm:px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Weekly Workout Plan</h1>
            <p className="text-muted-foreground">Schedule and manage your weekly workouts</p>
          </div>
          <div className="flex gap-4">
            <Link to="/form-analyzer">
              <Button className="flex items-center gap-2" variant="outline">
                <VideoIcon className="h-5 w-5" /> 
                Form Analyzer
              </Button>
            </Link>
            <Link to="/recommended-plans">
              <Button className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                View Recommended Plans
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          {/* Weekly schedule in table format */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Schedule Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Day</TableHead>
                      <TableHead>Workout Type</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Sets & Reps</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
                      const plansForDay = workingPlans.filter(p => p.day.toLowerCase() === day);
                      
                      return plansForDay.length > 0 ? (
                        plansForDay.map((plan) => (
                          <TableRow key={plan.id}>
                            <TableCell className="capitalize">{day}</TableCell>
                            <TableCell>{plan.exerciseType}</TableCell>
                            <TableCell>{plan.duration}</TableCell>
                            <TableCell>{plan.setsReps}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                plan.completed 
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {plan.completed ? 'Completed' : 'Pending'}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow key={day}>
                          <TableCell className="capitalize">{day}</TableCell>
                          <TableCell colSpan={4} className="text-muted-foreground">No workout scheduled</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          <div className="max-w-4xl mx-auto">
            <WeeklyWorkingPlan 
              plans={workingPlans}
              onAddPlan={handleAddWorkingPlan}
              onUpdatePlan={handleUpdateWorkingPlan}
              onDeletePlan={handleDeleteWorkingPlan}
            />
          </div>
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

export default WorkoutPlanPage;
