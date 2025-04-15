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

// Updated exercise videos with exercise-specific content from reliable sources
const exerciseVideos = {
  'Bench Press': 'https://content.jwplatform.com/videos/TwfGq2t7-zJnQNIky.mp4', // Bench press instructional video
  'Push-up': 'https://content.jwplatform.com/videos/rAX3NwdL-640.mp4', // Push-up instructional video
  'Shoulder Press': 'https://content.jwplatform.com/videos/UoaQR95W-Gzesw4D6.mp4', // Shoulder press video
  'Pull-up': 'https://content.jwplatform.com/videos/CwphpUOW-640.mp4', // Pull-up demonstration
  'Bicep Curl': 'https://content.jwplatform.com/videos/qUpv6R9v-640.mp4', // Bicep curl tutorial
  'Tricep Extension': 'https://content.jwplatform.com/videos/v7PQD8sj-640.mp4', // Tricep extension demonstration
  'Squat': 'https://content.jwplatform.com/videos/8TbJTFy3-640.mp4', // Squat form video
  'Deadlift': 'https://content.jwplatform.com/videos/nCRrkXIe-640.mp4', // Deadlift tutorial
  'Lunge': 'https://content.jwplatform.com/videos/lN4xhpFB-640.mp4', // Lunge form video
  'Leg Press': 'https://content.jwplatform.com/videos/9fIiCeki-640.mp4', // Leg press machine demo
  'Plank': 'https://content.jwplatform.com/videos/OrXlpL1Z-640.mp4', // Plank demonstration
  'Sit-up': 'https://content.jwplatform.com/videos/XefT51Ym-640.mp4', // Sit-up form video
  'Russian Twist': 'https://content.jwplatform.com/videos/LwVG4P5u-640.mp4', // Russian twist demo
  'Burpee': 'https://content.jwplatform.com/videos/YjqunrHp-640.mp4', // Burpee tutorial
  'Clean and Jerk': 'https://content.jwplatform.com/videos/oVHCJ2zF-640.mp4', // Olympic lifting demo
  'Lat Pulldown': 'https://content.jwplatform.com/videos/k2yP84m5-640.mp4', // Lat pulldown machine
  'Cable Row': 'https://content.jwplatform.com/videos/6QIsMtpW-640.mp4', // Cable row proper form
  'Leg Extension': 'https://content.jwplatform.com/videos/9toYjIjV-640.mp4', // Leg extension machine demo
};

// Thumbnails for previews - keeping the same thumbnail images
const exerciseThumbnails = {
  'Bench Press': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
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
  const [videoLoadErrors, setVideoLoadErrors] = useState<{[key: string]: boolean}>({});
  const [playButtonVisible, setPlayButtonVisible] = useState<{[key: string]: boolean}>({});
  
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
  
  const activeExercises = libraryData[activeCategory as keyof typeof libraryData] || [];
  
  const [selectedExercise, setSelectedExercise] = useState<number | null>(null);
  
  const handleVideoError = (videoId: number | string) => {
    console.error(`Video error for ID: ${videoId}`);
    setVideoLoadErrors(prev => ({...prev, [videoId]: true}));
    
    toast({
      title: "Video Error",
      description: "There was a problem loading the video. Trying fallback source...",
      variant: "destructive",
    });
    
    const videoElement = videoRefs.current[`video-${videoId}`];
    const exerciseTitle = activeExercises.find(ex => ex.id === Number(videoId))?.title || 
                         requestedExercises.find(ex => ex.id === Number(videoId))?.title;
    
    if (videoElement) {
      if (exerciseTitle?.includes('Bench')) {
        videoElement.src = "https://content.jwplatform.com/videos/TwfGq2t7-zJnQNIky.mp4";
      } else if (exerciseTitle?.includes('Push')) {
        videoElement.src = "https://content.jwplatform.com/videos/rAX3NwdL-640.mp4";
      } else if (exerciseTitle?.includes('Squat') || exerciseTitle?.includes('Leg')) {
        videoElement.src = "https://content.jwplatform.com/videos/8TbJTFy3-640.mp4";
      } else {
        videoElement.src = "https://content.jwplatform.com/videos/YjqunrHp-640.mp4";
      }
    }
  };
  
  const handleVideoLoaded = (videoId: number | string) => {
    setVideoLoadErrors(prev => ({...prev, [videoId]: false}));
    setPlayButtonVisible(prev => ({...prev, [videoId]: true}));
  };
  
  const togglePlayPause = (videoId: number) => {
    if (isPlaying === videoId) {
      const videoElement = videoRefs.current[`video-${videoId}`];
      if (videoElement) {
        videoElement.pause();
      }
      setIsPlaying(null);
    } else {
      if (isPlaying !== null) {
        const prevVideoElement = videoRefs.current[`video-${isPlaying}`];
        if (prevVideoElement) {
          prevVideoElement.pause();
        }
      }
      
      const videoElement = videoRefs.current[`video-${videoId}`];
      if (videoElement) {
        const playPromise = videoElement.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(videoId);
            })
            .catch(error => {
              console.error("Video play error:", error);
              toast({
                title: "Playback Error",
                description: "Could not play the video. Please try again.",
                variant: "destructive",
              });
            });
        }
      }
    }
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
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
  
  useEffect(() => {
    const preloadVideos = () => {
      Object.entries(exerciseVideos).forEach(([key, url]) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.src = url;
        
        video.onloadedmetadata = () => {
          console.log(`Video metadata loaded for ${key}`);
        };
        
        video.onerror = () => {
          console.error(`Error preloading video for ${key}`);
        };
      });
    };
    
    preloadVideos();
  }, []);
  
  useEffect(() => {
    setIsPlaying(null);
  }, [activeCategory]);
  
  useEffect(() => {
    const retryFailedVideos = () => {
      Object.entries(videoLoadErrors).forEach(([key, hasError]) => {
        if (hasError) {
          const videoId = key.replace('video-', '');
          const videoElement = videoRefs.current[`video-${videoId}`];
          if (videoElement) {
            videoElement.load();
          }
        }
      });
    };
    
    const timeoutId = setTimeout(retryFailedVideos, 3000);
    return () => clearTimeout(timeoutId);
  }, [videoLoadErrors]);
  
  const handleSubmitRequest = () => {
    if (requestExercise.trim()) {
      const newExerciseId = Math.max(...Object.values(libraryData).flatMap(exercises => exercises.map(ex => ex.id))) + 1;
      
      let customVideoUrl = 'https://content.jwplatform.com/videos/YjqunrHp-640.mp4';
      
      const lowerCaseRequest = requestExercise.toLowerCase();
      if (lowerCaseRequest.includes('bench') || lowerCaseRequest.includes('chest')) {
        customVideoUrl = 'https://content.jwplatform.com/videos/TwfGq2t7-zJnQNIky.mp4';
      } else if (lowerCaseRequest.includes('squat') || lowerCaseRequest.includes('leg')) {
        customVideoUrl = 'https://content.jwplatform.com/videos/8TbJTFy3-640.mp4';
      } else if (lowerCaseRequest.includes('push')) {
        customVideoUrl = 'https://content.jwplatform.com/videos/rAX3NwdL-640.mp4';
      } else if (lowerCaseRequest.includes('pull') || lowerCaseRequest.includes('back')) {
        customVideoUrl = 'https://content.jwplatform.com/videos/CwphpUOW-640.mp4';
      } else if (lowerCaseRequest.includes('bicep') || lowerCaseRequest.includes('curl')) {
        customVideoUrl = 'https://content.jwplatform.com/videos/qUpv6R9v-640.mp4';
      }
      
      const newRequestedExercise = {
        id: newExerciseId,
        title: requestExercise,
        difficulty: 'custom',
        video: customVideoUrl,
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
          
          {Object.keys(libraryData).map(category => (
            <TabsContent key={category} value={category} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category === activeCategory && requestedExercises.length > 0 && (
                  <>
                    {requestedExercises.map(exercise => (
                      <Card key={`requested-${exercise.id}`} className="overflow-hidden hover:shadow-md transition-shadow border-primary/20">
                        <div 
                          className="aspect-video bg-muted relative cursor-pointer"
                        >
                          {videoLoadErrors[exercise.id] && (
                            <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
                              <p className="text-sm text-muted-foreground">Video unavailable</p>
                            </div>
                          )}
                          
                          <video
                            ref={el => videoRefs.current[`video-${exercise.id}`] = el}
                            src={exercise.video}
                            poster={exercise.thumbnail}
                            className="w-full h-full object-cover"
                            loop
                            muted={isMuted}
                            preload="metadata"
                            onClick={() => togglePlayPause(exercise.id)}
                            onError={() => handleVideoError(exercise.id)}
                            onLoadedMetadata={() => handleVideoLoaded(exercise.id)}
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
                          
                          <div
                            className="absolute inset-0 flex items-center justify-center"
                            onClick={() => togglePlayPause(exercise.id)}
                          >
                            <Button
                              variant="secondary"
                              size="icon"
                              className={`bg-black/50 hover:bg-black/70 text-white transition-opacity ${isPlaying === exercise.id ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}
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
                        onError={() => {
                          const videoElement = videoRefs.current[`video-detail-${selectedExercise}`];
                          if (videoElement) {
                            videoElement.src = "https://content.jwplatform.com/videos/YjqunrHp-640.mp4";
                          }
                        }}
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
                  activeExercises.map(exercise => (
                    <Card key={exercise.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div 
                        className="aspect-video bg-muted relative cursor-pointer"
                      >
                        {videoLoadErrors[exercise.id] && (
                          <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
                            <p className="text-sm text-muted-foreground">Video unavailable</p>
                          </div>
                        )}
                        
                        <video
                          ref={el => videoRefs.current[`video-${exercise.id}`] = el}
                          src={exercise.video}
                          poster={exercise.thumbnail}
                          className="w-full h-full object-cover"
                          loop
                          muted={isMuted}
                          preload="metadata"
                          onClick={() => togglePlayPause(exercise.id)}
                          onError={() => handleVideoError(exercise.id)}
                          onLoadedMetadata={() => handleVideoLoaded(exercise.id)}
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
                        
                        <div
                          className="absolute inset-0 flex items-center justify-center"
                          onClick={() => togglePlayPause(exercise.id)}
                        >
                          <Button
                            variant="secondary"
                            size="icon"
                            className={`bg-black/50 hover:bg-black/70 text-white transition-opacity ${isPlaying === exercise.id ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}
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
