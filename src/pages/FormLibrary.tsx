
import React, { useState, useRef, useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Play, Info, Dumbbell, Award, Volume2, Volume1, VolumeX, Loader2, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// Sample exercise videos - replace images with video URLs
const exerciseVideos = {
  'Bench Press': 'https://storage.googleapis.com/webfundamentals-assets/videos/chrome.mp4',
  'Push-up': 'https://assets.mixkit.co/videos/preview/mixkit-man-exercising-in-a-gym-23478-large.mp4',
  'Shoulder Press': 'https://assets.mixkit.co/videos/preview/mixkit-woman-at-the-gym-performing-shoulder-presses-40342-large.mp4',
  'Pull-up': 'https://assets.mixkit.co/videos/preview/mixkit-man-exercising-alone-in-a-gym-42897-large.mp4',
  'Bicep Curl': 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-training-with-dumbbells-in-a-gym-23964-large.mp4',
  'Tricep Extension': 'https://assets.mixkit.co/videos/preview/mixkit-trainer-helping-man-to-exercise-correctly-in-the-gym-37006-large.mp4',
  'Squat': 'https://assets.mixkit.co/videos/preview/mixkit-woman-lifting-weights-in-a-gym-23966-large.mp4',
  'Deadlift': 'https://assets.mixkit.co/videos/preview/mixkit-man-exercising-in-a-gym-with-dumbbells-23476-large.mp4',
  'Lunge': 'https://assets.mixkit.co/videos/preview/mixkit-trainer-guiding-woman-while-working-out-in-the-gym-40340-large.mp4',
  'Leg Press': 'https://assets.mixkit.co/videos/preview/mixkit-woman-lifting-weights-in-a-gym-23966-large.mp4',
  'Plank': 'https://assets.mixkit.co/videos/preview/mixkit-woman-doing-exercises-on-a-mat-in-the-gym-23964-large.mp4',
  'Sit-up': 'https://assets.mixkit.co/videos/preview/mixkit-woman-exercising-on-a-mat-40341-large.mp4',
  'Russian Twist': 'https://assets.mixkit.co/videos/preview/mixkit-woman-doing-exercises-on-a-mat-in-the-gym-23970-large.mp4',
  'Burpee': 'https://assets.mixkit.co/videos/preview/mixkit-man-exercising-in-a-gym-23478-large.mp4',
  'Clean and Jerk': 'https://assets.mixkit.co/videos/preview/mixkit-man-exercising-in-a-gym-23472-large.mp4',
  'Lat Pulldown': 'https://assets.mixkit.co/videos/preview/mixkit-woman-exercising-on-a-machine-at-the-gym-40329-large.mp4',
  'Cable Row': 'https://assets.mixkit.co/videos/preview/mixkit-trainer-helping-woman-use-machine-at-the-gym-40330-large.mp4',
  'Leg Extension': 'https://assets.mixkit.co/videos/preview/mixkit-trainer-guiding-woman-while-working-out-in-the-gym-40340-large.mp4',
};

// Thumbnails for previews - use first frame of videos
const exerciseThumbnails = {
  'Bench Press': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  'Push-up': 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  'Shoulder Press': 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80',
  'Pull-up': 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  'Bicep Curl': 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  'Tricep Extension': 'https://images.unsplash.com/photo-1584863231364-2edc166de576?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  'Squat': 'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80',
  'Deadlift': 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80',
  'Lunge': 'https://images.unsplash.com/photo-1434608519344-49d476545882?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1174&q=80',
  'Leg Press': 'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80',
  'Plank': 'https://images.unsplash.com/photo-1566241134883-13eb2393a3cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1176&q=80',
  'Sit-up': 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1025&q=80',
  'Russian Twist': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  'Burpee': 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80',
  'Clean and Jerk': 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  'Lat Pulldown': 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80',
  'Cable Row': 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80',
  'Leg Extension': 'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80',
};

const FormLibrary = () => {
  const [activeCategory, setActiveCategory] = useState('upper-body');
  const [requestExercise, setRequestExercise] = useState('');
  const [requestedExercises, setRequestedExercises] = useState<Array<{id: number, title: string, difficulty: string, video: string, thumbnail: string}>>([]);
  const [isPlaying, setIsPlaying] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const videoRefs = useRef<{[key: string]: HTMLVideoElement | null}>({});
  
  // Mock library data with videos instead of images
  const libraryData = {
    'upper-body': [
      { id: 1, title: 'Bench Press', difficulty: 'intermediate', video: exerciseVideos['Bench Press'], thumbnail: exerciseThumbnails['Bench Press'] },
      { id: 2, title: 'Push-up', difficulty: 'beginner', video: exerciseVideos['Push-up'], thumbnail: exerciseThumbnails['Push-up'] },
      { id: 3, title: 'Shoulder Press', difficulty: 'intermediate', video: exerciseVideos['Shoulder Press'], thumbnail: exerciseThumbnails['Shoulder Press'] },
      { id: 4, title: 'Pull-up', difficulty: 'advanced', video: exerciseVideos['Pull-up'], thumbnail: exerciseThumbnails['Pull-up'] },
      { id: 5, title: 'Bicep Curl', difficulty: 'beginner', video: exerciseVideos['Bicep Curl'], thumbnail: exerciseThumbnails['Bicep Curl'] },
      { id: 6, title: 'Tricep Extension', difficulty: 'beginner', video: exerciseVideos['Tricep Extension'], thumbnail: exerciseThumbnails['Tricep Extension'] },
    ],
    'lower-body': [
      { id: 7, title: 'Squat', difficulty: 'intermediate', video: exerciseVideos['Squat'], thumbnail: exerciseThumbnails['Squat'] },
      { id: 8, title: 'Deadlift', difficulty: 'advanced', video: exerciseVideos['Deadlift'], thumbnail: exerciseThumbnails['Deadlift'] },
      { id: 9, title: 'Lunge', difficulty: 'beginner', video: exerciseVideos['Lunge'], thumbnail: exerciseThumbnails['Lunge'] },
      { id: 10, title: 'Leg Press', difficulty: 'intermediate', video: exerciseVideos['Leg Press'], thumbnail: exerciseThumbnails['Leg Press'] },
    ],
    'core': [
      { id: 11, title: 'Plank', difficulty: 'beginner', video: exerciseVideos['Plank'], thumbnail: exerciseThumbnails['Plank'] },
      { id: 12, title: 'Sit-up', difficulty: 'beginner', video: exerciseVideos['Sit-up'], thumbnail: exerciseThumbnails['Sit-up'] },
      { id: 13, title: 'Russian Twist', difficulty: 'intermediate', video: exerciseVideos['Russian Twist'], thumbnail: exerciseThumbnails['Russian Twist'] },
    ],
    'full-body': [
      { id: 14, title: 'Burpee', difficulty: 'advanced', video: exerciseVideos['Burpee'], thumbnail: exerciseThumbnails['Burpee'] },
      { id: 15, title: 'Clean and Jerk', difficulty: 'advanced', video: exerciseVideos['Clean and Jerk'], thumbnail: exerciseThumbnails['Clean and Jerk'] },
    ],
    'gym-exercises': [
      { id: 16, title: 'Lat Pulldown', difficulty: 'intermediate', video: exerciseVideos['Lat Pulldown'], thumbnail: exerciseThumbnails['Lat Pulldown'] },
      { id: 17, title: 'Cable Row', difficulty: 'intermediate', video: exerciseVideos['Cable Row'], thumbnail: exerciseThumbnails['Cable Row'] },
      { id: 18, title: 'Leg Extension', difficulty: 'beginner', video: exerciseVideos['Leg Extension'], thumbnail: exerciseThumbnails['Leg Extension'] },
    ],
  };
  
  // Active exercises for the selected category
  const activeExercises = libraryData[activeCategory as keyof typeof libraryData] || [];
  
  // Selected exercise state
  const [selectedExercise, setSelectedExercise] = useState<number | null>(null);
  
  // Handle video play/pause
  const togglePlayPause = (videoId: number) => {
    if (isPlaying === videoId) {
      // Pause current video
      const videoElement = videoRefs.current[`video-${videoId}`];
      if (videoElement) {
        videoElement.pause();
      }
      setIsPlaying(null);
    } else {
      // Pause any playing video
      if (isPlaying !== null) {
        const prevVideoElement = videoRefs.current[`video-${isPlaying}`];
        if (prevVideoElement) {
          prevVideoElement.pause();
        }
      }
      
      // Play new video
      const videoElement = videoRefs.current[`video-${videoId}`];
      if (videoElement) {
        videoElement.play();
      }
      setIsPlaying(videoId);
    }
  };
  
  // Handle mute toggle
  const toggleMute = () => {
    setIsMuted(!isMuted);
    // Apply to all video refs
    Object.values(videoRefs.current).forEach(video => {
      if (video) {
        video.muted = !isMuted;
      }
    });
  };
  
  const handleExerciseSelect = (exerciseId: number) => {
    setSelectedExercise(exerciseId);
    
    toast({
      title: "Exercise Selected",
      description: `Viewing details for ${activeExercises.find(ex => ex.id === exerciseId)?.title}`,
    });
  };
  
  const handleSubmitRequest = () => {
    if (requestExercise.trim()) {
      const newExerciseId = Math.max(...Object.values(libraryData).flatMap(exercises => exercises.map(ex => ex.id))) + 1;
      
      const newRequestedExercise = {
        id: newExerciseId,
        title: requestExercise,
        difficulty: 'custom',
        video: 'https://assets.mixkit.co/videos/preview/mixkit-man-exercising-in-a-gym-23478-large.mp4', // Default video
        thumbnail: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
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
          
          {/* All categories share the same layout, so we'll use one content area */}
          {Object.keys(libraryData).map(category => (
            <TabsContent key={category} value={category} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Show requested exercises at the top */}
                {category === activeCategory && requestedExercises.length > 0 && (
                  <>
                    {requestedExercises.map(exercise => (
                      <Card key={`requested-${exercise.id}`} className="overflow-hidden hover:shadow-md transition-shadow border-primary/20">
                        <div 
                          className="aspect-video bg-muted relative cursor-pointer"
                        >
                          <video
                            ref={el => videoRefs.current[`video-${exercise.id}`] = el}
                            src={exercise.video}
                            poster={exercise.thumbnail}
                            className="w-full h-full object-cover"
                            loop
                            muted={isMuted}
                            onClick={() => togglePlayPause(exercise.id)}
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
                          
                          {/* Play/Pause Button Overlay */}
                          <div
                            className="absolute inset-0 flex items-center justify-center"
                            onClick={() => togglePlayPause(exercise.id)}
                          >
                            <Button
                              variant="secondary"
                              size="icon"
                              className="bg-black/50 hover:bg-black/70 text-white transition-opacity opacity-0 hover:opacity-100"
                              onClick={(e) => {
                                e.stopPropagation();
                                togglePlayPause(exercise.id);
                              }}
                            >
                              {isPlaying === exercise.id ? (
                                <Pause className="h-6 w-6" />
                              ) : (
                                <Play className="h-6 w-6" />
                              )}
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
                            className="flex-1 mr-2"
                            onClick={() => handleExerciseSelect(exercise.id)}
                          >
                            <Info className="h-4 w-4 mr-1" /> View Details
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-none"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleMute();
                            }}
                          >
                            {isMuted ? (
                              <VolumeX className="h-4 w-4" />
                            ) : (
                              <Volume2 className="h-4 w-4" />
                            )}
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </>
                )}
              
                {selectedExercise ? (
                  // Exercise details view
                  <div className="col-span-full bg-muted rounded-lg overflow-hidden">
                    <div className="aspect-video relative">
                      <video 
                        ref={el => videoRefs.current[`video-detail-${selectedExercise}`] = el}
                        src={
                          requestedExercises.find(ex => ex.id === selectedExercise)?.video || 
                          activeExercises.find(ex => ex.id === selectedExercise)?.video
                        } 
                        poster={
                          requestedExercises.find(ex => ex.id === selectedExercise)?.thumbnail || 
                          activeExercises.find(ex => ex.id === selectedExercise)?.thumbnail
                        }
                        className="w-full h-full object-cover"
                        controls
                        autoPlay
                        muted={isMuted}
                      />
                      
                      <div className="absolute top-4 right-4 flex space-x-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="bg-black/50 text-white"
                          onClick={toggleMute}
                        >
                          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                        </Button>
                      </div>
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
                  // Exercise grid view - show regular exercises after requested ones
                  activeExercises.map(exercise => (
                    <Card key={exercise.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div 
                        className="aspect-video bg-muted relative cursor-pointer"
                      >
                        <video
                          ref={el => videoRefs.current[`video-${exercise.id}`] = el}
                          src={exercise.video}
                          poster={exercise.thumbnail}
                          className="w-full h-full object-cover"
                          loop
                          muted={isMuted}
                          onClick={() => togglePlayPause(exercise.id)}
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
                        
                        {/* Play/Pause Button Overlay */}
                        <div
                          className="absolute inset-0 flex items-center justify-center"
                          onClick={() => togglePlayPause(exercise.id)}
                        >
                          <Button
                            variant="secondary"
                            size="icon"
                            className="bg-black/50 hover:bg-black/70 text-white transition-opacity opacity-0 hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePlayPause(exercise.id);
                            }}
                          >
                            {isPlaying === exercise.id ? (
                              <Pause className="h-6 w-6" />
                            ) : (
                              <Play className="h-6 w-6" />
                            )}
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
                          className="flex-1 mr-2"
                          onClick={() => handleExerciseSelect(exercise.id)}
                        >
                          <Info className="h-4 w-4 mr-1" /> View Details
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-none"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMute();
                          }}
                        >
                          {isMuted ? (
                            <VolumeX className="h-4 w-4" />
                          ) : (
                            <Volume2 className="h-4 w-4" />
                          )}
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
