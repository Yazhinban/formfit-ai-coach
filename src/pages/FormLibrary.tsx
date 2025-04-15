
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Info, Dumbbell, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// Exercise images for each workout
const exerciseImages = {
  'Bench Press': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  'Push-up': 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  'Shoulder Press': 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80',
  'Pull-up': 'https://images.unsplash.com/photo-1627483297886-49710ae1fc22?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  'Bicep Curl': 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  'Tricep Extension': 'https://images.unsplash.com/photo-1584863231364-2edc166de576?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  'Squat': 'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80',
  'Deadlift': 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80',
  'Lunge': 'https://images.unsplash.com/photo-1434608519344-49d476545882?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1174&q=80',
  'Leg Press': 'https://images.unsplash.com/photo-1595078475328-1ab05d0a6a0e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80',
  'Plank': 'https://images.unsplash.com/photo-1566241134883-13eb2393a3cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1176&q=80',
  'Sit-up': 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1025&q=80',
  'Russian Twist': 'https://images.unsplash.com/photo-1544033527-b192daee1f5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  'Burpee': 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80',
  'Clean and Jerk': 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  'Lat Pulldown': 'https://images.unsplash.com/photo-1544033527-b192daee1f5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  'Cable Row': 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  'Leg Extension': 'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80',
};

const FormLibrary = () => {
  const [activeCategory, setActiveCategory] = useState('upper-body');
  const [requestExercise, setRequestExercise] = useState('');
  const [requestedExercises, setRequestedExercises] = useState<Array<{id: number, title: string, difficulty: string, image: string}>>([]);
  const [selectedExercise, setSelectedExercise] = useState<number | null>(null);
  
  const libraryData = {
    'upper-body': [
      { id: 1, title: 'Bench Press', difficulty: 'intermediate', image: exerciseImages['Bench Press'] },
      { id: 2, title: 'Push-up', difficulty: 'beginner', image: exerciseImages['Push-up'] },
      { id: 3, title: 'Shoulder Press', difficulty: 'intermediate', image: exerciseImages['Shoulder Press'] },
      { id: 4, title: 'Pull-up', difficulty: 'advanced', image: exerciseImages['Pull-up'] },
      { id: 5, title: 'Bicep Curl', difficulty: 'beginner', image: exerciseImages['Bicep Curl'] },
      { id: 6, title: 'Tricep Extension', difficulty: 'beginner', image: exerciseImages['Tricep Extension'] },
    ],
    'lower-body': [
      { id: 7, title: 'Squat', difficulty: 'intermediate', image: exerciseImages['Squat'] },
      { id: 8, title: 'Deadlift', difficulty: 'advanced', image: exerciseImages['Deadlift'] },
      { id: 9, title: 'Lunge', difficulty: 'beginner', image: exerciseImages['Lunge'] },
      { id: 10, title: 'Leg Press', difficulty: 'intermediate', image: exerciseImages['Leg Press'] },
    ],
    'core': [
      { id: 11, title: 'Plank', difficulty: 'beginner', image: exerciseImages['Plank'] },
      { id: 12, title: 'Sit-up', difficulty: 'beginner', image: exerciseImages['Sit-up'] },
      { id: 13, title: 'Russian Twist', difficulty: 'intermediate', image: exerciseImages['Russian Twist'] },
    ],
    'full-body': [
      { id: 14, title: 'Burpee', difficulty: 'advanced', image: exerciseImages['Burpee'] },
      { id: 15, title: 'Clean and Jerk', difficulty: 'advanced', image: exerciseImages['Clean and Jerk'] },
    ],
    'gym-exercises': [
      { id: 16, title: 'Lat Pulldown', difficulty: 'intermediate', image: exerciseImages['Lat Pulldown'] },
      { id: 17, title: 'Cable Row', difficulty: 'intermediate', image: exerciseImages['Cable Row'] },
      { id: 18, title: 'Leg Extension', difficulty: 'beginner', image: exerciseImages['Leg Extension'] },
    ],
  };
  
  const activeExercises = libraryData[activeCategory as keyof typeof libraryData] || [];
  
  const handleExerciseSelect = (exerciseId: number) => {
    setSelectedExercise(exerciseId);
    
    toast({
      title: "Exercise Selected",
      description: `Viewing details for ${activeExercises.find(ex => ex.id === exerciseId)?.title}`,
    });
  };
  
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    // Set a fallback image when the main image fails to load
    event.currentTarget.src = 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80';
    
    toast({
      title: "Image Error",
      description: "There was a problem loading the image. Using a fallback image.",
      variant: "destructive",
    });
  };
  
  const handleSubmitRequest = () => {
    if (requestExercise.trim()) {
      const newExerciseId = Math.max(...Object.values(libraryData).flatMap(exercises => exercises.map(ex => ex.id))) + 1;
      
      const newRequestedExercise = {
        id: newExerciseId,
        title: requestExercise,
        difficulty: 'custom',
        image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
      };
      
      setRequestedExercises(prev => [newRequestedExercise, ...prev]);
      
      toast({
        title: "Exercise Request Submitted",
        description: "Your requested exercise has been added to the library!",
      });
      
      setRequestExercise('');
    } else {
      toast({
        title: "Empty Request",
        description: "Please describe what type of exercise you want to request.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container max-w-7xl py-8 px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Form Library</h1>
            <p className="text-muted-foreground">Browse perfect form examples for all workouts</p>
          </div>
          
          <div className="w-full md:w-auto">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <Textarea 
                placeholder="Describe what type of workout you want to request..."
                className="min-h-[60px] sm:min-w-[250px]"
                value={requestExercise}
                onChange={(e) => setRequestExercise(e.target.value)}
              />
              <Button 
                onClick={handleSubmitRequest}
                className="whitespace-nowrap"
              >
                <Dumbbell className="h-4 w-4 mr-1" /> Request Exercise
              </Button>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="upper-body" onValueChange={setActiveCategory} className="w-full">
          <div className="border-b">
            <TabsList className="w-full justify-start overflow-x-auto no-scrollbar">
              <TabsTrigger value="upper-body">Upper Body</TabsTrigger>
              <TabsTrigger value="lower-body">Lower Body</TabsTrigger>
              <TabsTrigger value="core">Core</TabsTrigger>
              <TabsTrigger value="full-body">Full Body</TabsTrigger>
              <TabsTrigger value="gym-exercises">Gym Exercises</TabsTrigger>
            </TabsList>
          </div>
          
          {Object.keys(libraryData).map(category => (
            <TabsContent key={category} value={category} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category === activeCategory && requestedExercises.length > 0 && (
                  <>
                    {requestedExercises.map(exercise => (
                      <Card key={`requested-${exercise.id}`} className="overflow-hidden hover:shadow-md transition-shadow border-primary/20">
                        <div 
                          className="aspect-video bg-muted relative cursor-pointer"
                          onClick={() => handleExerciseSelect(exercise.id)}
                        >
                          <img
                            src={exercise.image}
                            alt={`${exercise.title} exercise form`}
                            className="w-full h-full object-cover"
                            onError={handleImageError}
                          />
                          
                          <div className="absolute top-2 right-2">
                            <Badge variant="secondary" className="bg-primary/20">Requested</Badge>
                          </div>
                          
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <Button 
                              variant="secondary" 
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleExerciseSelect(exercise.id);
                              }}
                            >
                              <Info className="h-6 w-6" />
                            </Button>
                          </div>
                        </div>
                        
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{exercise.title}</h3>
                              <p className="text-xs text-muted-foreground">Custom exercise</p>
                            </div>
                            <Badge variant="outline">
                              custom
                            </Badge>
                          </div>
                        </CardContent>
                        
                        <CardFooter className="px-4 pb-4 pt-0 flex justify-between">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => handleExerciseSelect(exercise.id)}
                          >
                            <Info className="h-4 w-4 mr-1" /> View Details
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </>
                )}
              
                {selectedExercise ? (
                  <div className="col-span-full bg-muted rounded-lg overflow-hidden">
                    <div className="aspect-video relative">
                      <img 
                        src={
                          requestedExercises.find(ex => ex.id === selectedExercise)?.image || 
                          activeExercises.find(ex => ex.id === selectedExercise)?.image
                        }
                        alt={`${requestedExercises.find(ex => ex.id === selectedExercise)?.title || 
                             activeExercises.find(ex => ex.id === selectedExercise)?.title} perfect form`}
                        className="w-full h-full object-cover"
                        onError={handleImageError}
                      />
                    </div>
                    
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold">
                            {
                              requestedExercises.find(ex => ex.id === selectedExercise)?.title || 
                              activeExercises.find(ex => ex.id === selectedExercise)?.title
                            } Perfect Form
                          </h3>
                          <p className="text-muted-foreground text-sm">
                            Learn the perfect form technique
                          </p>
                        </div>
                        
                        <Button variant="outline" size="sm" onClick={() => setSelectedExercise(null)}>
                          Back to Library
                        </Button>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-2">Key Form Points</h4>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-start gap-2">
                              <Award className="h-4 w-4 mt-0.5 text-primary" />
                              <span>Maintain proper alignment throughout the movement</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Award className="h-4 w-4 mt-0.5 text-primary" />
                              <span>Control the movement in both directions</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Award className="h-4 w-4 mt-0.5 text-primary" />
                              <span>Breathe at the right moments during the exercise</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Award className="h-4 w-4 mt-0.5 text-primary" />
                              <span>Keep proper tension in target muscles</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Common Mistakes to Avoid</h4>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-start gap-2">
                              <span className="h-4 w-4 bg-destructive/20 rounded-full flex items-center justify-center text-destructive text-xs mt-0.5">×</span>
                              <span>Using momentum instead of muscle control</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="h-4 w-4 bg-destructive/20 rounded-full flex items-center justify-center text-destructive text-xs mt-0.5">×</span>
                              <span>Incorrect joint alignment causing stress</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="h-4 w-4 bg-destructive/20 rounded-full flex items-center justify-center text-destructive text-xs mt-0.5">×</span>
                              <span>Poor range of motion limiting effectiveness</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div className="flex justify-between">
                        <Button variant="outline" size="sm">
                          <BarChart3 className="h-4 w-4 mr-1" /> Try Form Analysis
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  activeExercises.map(exercise => (
                    <Card key={exercise.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div 
                        className="aspect-video bg-muted relative cursor-pointer"
                        onClick={() => handleExerciseSelect(exercise.id)}
                      >
                        <img
                          src={exercise.image}
                          alt={`${exercise.title} exercise form`}
                          className="w-full h-full object-cover"
                          onError={handleImageError}
                        />
                        
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <Button 
                            variant="secondary" 
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExerciseSelect(exercise.id);
                            }}
                          >
                            <Info className="h-6 w-6" />
                          </Button>
                        </div>
                      </div>
                      
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{exercise.title}</h3>
                            <p className="text-xs text-muted-foreground">Perfect form guide</p>
                          </div>
                          <Badge variant={
                            exercise.difficulty === 'beginner' ? 'outline' : 
                            exercise.difficulty === 'intermediate' ? 'secondary' : 
                            'default'
                          }>
                            {exercise.difficulty}
                          </Badge>
                        </div>
                      </CardContent>
                      
                      <CardFooter className="px-4 pb-4 pt-0 flex justify-between">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => handleExerciseSelect(exercise.id)}
                        >
                          <Info className="h-4 w-4 mr-1" /> View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
};

export default FormLibrary;
