
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayCircle, ThumbsUp } from 'lucide-react';

// Mock data for form library
const workoutCategories = [
  {
    id: 'upper',
    name: 'Upper Body',
    exercises: [
      { id: 'pushup', name: 'Push-Up', description: 'Targets chest, shoulders, and triceps', videoUrl: '#', thumbnail: 'https://placehold.co/300x200/2196f3/white?text=Push-Up', difficulty: 'Beginner' },
      { id: 'pullup', name: 'Pull-Up', description: 'Targets back and biceps', videoUrl: '#', thumbnail: 'https://placehold.co/300x200/2196f3/white?text=Pull-Up', difficulty: 'Intermediate' },
      { id: 'shoulderpress', name: 'Shoulder Press', description: 'Targets shoulders and triceps', videoUrl: '#', thumbnail: 'https://placehold.co/300x200/2196f3/white?text=Shoulder+Press', difficulty: 'Beginner' },
    ]
  },
  {
    id: 'lower',
    name: 'Lower Body',
    exercises: [
      { id: 'squat', name: 'Squat', description: 'Targets quadriceps, hamstrings, and glutes', videoUrl: '#', thumbnail: 'https://placehold.co/300x200/2196f3/white?text=Squat', difficulty: 'Beginner' },
      { id: 'deadlift', name: 'Deadlift', description: 'Targets lower back, glutes, and hamstrings', videoUrl: '#', thumbnail: 'https://placehold.co/300x200/2196f3/white?text=Deadlift', difficulty: 'Intermediate' },
      { id: 'lunge', name: 'Lunge', description: 'Targets quadriceps, hamstrings, and glutes', videoUrl: '#', thumbnail: 'https://placehold.co/300x200/2196f3/white?text=Lunge', difficulty: 'Beginner' },
    ]
  },
  {
    id: 'core',
    name: 'Core',
    exercises: [
      { id: 'plank', name: 'Plank', description: 'Targets core, shoulders, and back', videoUrl: '#', thumbnail: 'https://placehold.co/300x200/2196f3/white?text=Plank', difficulty: 'Beginner' },
      { id: 'russiantwist', name: 'Russian Twist', description: 'Targets obliques and abs', videoUrl: '#', thumbnail: 'https://placehold.co/300x200/2196f3/white?text=Russian+Twist', difficulty: 'Intermediate' },
      { id: 'situp', name: 'Sit-Up', description: 'Targets abs', videoUrl: '#', thumbnail: 'https://placehold.co/300x200/2196f3/white?text=Sit-Up', difficulty: 'Beginner' },
    ]
  },
  {
    id: 'fullbody',
    name: 'Full Body',
    exercises: [
      { id: 'burpee', name: 'Burpee', description: 'Full body exercise', videoUrl: '#', thumbnail: 'https://placehold.co/300x200/2196f3/white?text=Burpee', difficulty: 'Advanced' },
      { id: 'mountainclimber', name: 'Mountain Climber', description: 'Targets core, shoulders, and legs', videoUrl: '#', thumbnail: 'https://placehold.co/300x200/2196f3/white?text=Mountain+Climber', difficulty: 'Intermediate' },
      { id: 'jumpingjack', name: 'Jumping Jack', description: 'Full body cardio exercise', videoUrl: '#', thumbnail: 'https://placehold.co/300x200/2196f3/white?text=Jumping+Jack', difficulty: 'Beginner' },
    ]
  }
];

const FormLibrary = () => {
  const [selectedExercise, setSelectedExercise] = useState<any>(null);
  
  const handleExerciseClick = (exercise: any) => {
    setSelectedExercise(exercise);
  };
  
  const handleCloseDetails = () => {
    setSelectedExercise(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container max-w-7xl py-8 px-4 sm:px-6">
        <h1 className="text-3xl font-bold mb-2">Form Library</h1>
        <p className="text-muted-foreground mb-8">Perfect form reference videos for common exercises</p>
        
        {selectedExercise ? (
          <div className="animate-fade-in">
            <Button 
              variant="outline" 
              onClick={handleCloseDetails}
              className="mb-4"
            >
              Back to Library
            </Button>
            
            <Card className="overflow-hidden">
              <div className="video-container bg-black">
                <div className="flex items-center justify-center h-full">
                  <PlayCircle className="w-16 h-16 text-primary animate-pulse-glow" />
                </div>
              </div>
              
              <CardHeader>
                <CardTitle>{selectedExercise.name}</CardTitle>
                <CardDescription>
                  {selectedExercise.description} • {selectedExercise.difficulty} Level
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <h3 className="font-semibold mb-2">Perfect Form Tips:</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Maintain proper alignment throughout the movement</li>
                  <li>Control the motion during both concentric and eccentric phases</li>
                  <li>Focus on engaging the primary muscle groups</li>
                  <li>Breathe properly during each repetition</li>
                </ul>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button variant="secondary">
                  Compare My Form
                </Button>
                <Button variant="outline">
                  <ThumbsUp className="mr-2 h-4 w-4" /> Helpful
                </Button>
              </CardFooter>
            </Card>
          </div>
        ) : (
          <Tabs defaultValue="upper" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              {workoutCategories.map(category => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {workoutCategories.map(category => (
              <TabsContent key={category.id} value={category.id} className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.exercises.map(exercise => (
                    <Card 
                      key={exercise.id} 
                      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer hover:border-primary"
                      onClick={() => handleExerciseClick(exercise)}
                    >
                      <div className="relative aspect-video">
                        <img 
                          src={exercise.thumbnail} 
                          alt={exercise.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <PlayCircle className="text-white w-12 h-12" />
                        </div>
                      </div>
                      <CardHeader>
                        <CardTitle className="text-lg">{exercise.name}</CardTitle>
                        <CardDescription>{exercise.description}</CardDescription>
                      </CardHeader>
                      <CardFooter>
                        <p className="text-xs text-muted-foreground">
                          Difficulty: <span className="font-medium">{exercise.difficulty}</span>
                        </p>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
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

export default FormLibrary;
