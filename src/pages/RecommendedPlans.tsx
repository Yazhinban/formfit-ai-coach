
import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const RecommendedPlans = () => {
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
                <CardHeader>
                  <CardTitle className="capitalize">{level} Workout Plan</CardTitle>
                  <CardDescription>
                    {level === 'beginner' ? 'Perfect for those just starting their fitness journey' :
                     level === 'intermediate' ? 'For those with some training experience' :
                     'Advanced training for experienced athletes'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
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
                      {/* Beginner Plan */}
                      {level === 'beginner' && [
                        ['Monday', 'Full Body', 'Squats, Push-ups, Rows', '45 min'],
                        ['Tuesday', 'Rest/Cardio', 'Walking, Light Cycling', '30 min'],
                        ['Wednesday', 'Full Body', 'Lunges, Shoulder Press, Planks', '45 min'],
                        ['Thursday', 'Rest/Mobility', 'Stretching, Yoga', '30 min'],
                        ['Friday', 'Full Body', 'Deadlifts, Bench Press, Core', '45 min'],
                        ['Saturday', 'Active Recovery', 'Swimming, Light Cardio', '40 min'],
                        ['Sunday', 'Rest', 'Complete Rest', '-'],
                      ].map(([day, focus, exercises, duration]) => (
                        <TableRow key={day}>
                          <TableCell>{day}</TableCell>
                          <TableCell>{focus}</TableCell>
                          <TableCell>{exercises}</TableCell>
                          <TableCell>{duration}</TableCell>
                        </TableRow>
                      ))}
                      
                      {/* Intermediate Plan */}
                      {level === 'intermediate' && [
                        ['Monday', 'Push', 'Bench Press, Shoulder Press, Triceps', '60 min'],
                        ['Tuesday', 'Pull', 'Rows, Pull-ups, Biceps', '60 min'],
                        ['Wednesday', 'Legs', 'Squats, Deadlifts, Lunges', '60 min'],
                        ['Thursday', 'Upper Body', 'Push-ups, Dips, Lateral Raises', '60 min'],
                        ['Friday', 'Lower Body', 'Front Squats, RDLs, Calf Raises', '60 min'],
                        ['Saturday', 'HIIT/Core', 'Circuit Training, Abs Work', '45 min'],
                        ['Sunday', 'Rest', 'Active Recovery or Rest', '-'],
                      ].map(([day, focus, exercises, duration]) => (
                        <TableRow key={day}>
                          <TableCell>{day}</TableCell>
                          <TableCell>{focus}</TableCell>
                          <TableCell>{exercises}</TableCell>
                          <TableCell>{duration}</TableCell>
                        </TableRow>
                      ))}
                      
                      {/* Pro Plan */}
                      {level === 'pro' && [
                        ['Monday', 'Push Power', 'Bench Press, OHP, Advanced Push', '75 min'],
                        ['Tuesday', 'Pull Power', 'Deadlifts, Weighted Pull-ups, Rows', '75 min'],
                        ['Wednesday', 'Legs Power', 'Squat Variations, Olympic Lifts', '75 min'],
                        ['Thursday', 'Push Hypertrophy', 'Volume Push Work, Isolation', '70 min'],
                        ['Friday', 'Pull Hypertrophy', 'Back Volume, Grip Work', '70 min'],
                        ['Saturday', 'Legs Hypertrophy', 'Leg Volume, Plyometrics', '70 min'],
                        ['Sunday', 'Recovery', 'Mobility Work, Light Cardio', '45 min'],
                      ].map(([day, focus, exercises, duration]) => (
                        <TableRow key={day}>
                          <TableCell>{day}</TableCell>
                          <TableCell>{focus}</TableCell>
                          <TableCell>{exercises}</TableCell>
                          <TableCell>{duration}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
