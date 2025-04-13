
import React, { useState, useRef, useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Play, Info, Dumbbell, Award, Volume2, Volume1, VolumeX, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { Slider } from '@/components/ui/slider';

// Sample video URLs for different exercises with reliable backup sources
const exerciseVideoUrls = {
  // More reliable video sources
  'Bench Press': 'https://player.vimeo.com/external/530253146.sd.mp4?s=ac94db1562c649fefe00c8f0e437a14459feccc0&profile_id=164',
  'Push-up': 'https://player.vimeo.com/external/558954802.sd.mp4?s=1de985948e6e850c322868c88d9575a239c5818c&profile_id=164',
  'Shoulder Press': 'https://player.vimeo.com/external/495492198.sd.mp4?s=86009dafa9c8d5fa655aadee1f48bcfa2999b8a2&profile_id=164',
  'Pull-up': 'https://player.vimeo.com/external/684072395.sd.mp4?s=2c34e9d22c648877c5b48b609363c31580b8a298&profile_id=164',
  'Bicep Curl': 'https://player.vimeo.com/external/691412770.sd.mp4?s=307ae98ed42c493c6ce8d1bf678f0e1d8774cb76&profile_id=164',
  'Tricep Extension': 'https://player.vimeo.com/external/657880192.sd.mp4?s=7add993bb9db573af9ec0e695145c00223758388&profile_id=164',
  
  'Squat': 'https://player.vimeo.com/external/496463781.sd.mp4?s=7e09e037b197df126b2c07c85d244c124d3d78a9&profile_id=164',
  'Deadlift': 'https://player.vimeo.com/external/487740048.sd.mp4?s=57ad4b07383f2821c412a8d08a0a3079682851d1&profile_id=164',
  'Lunge': 'https://player.vimeo.com/external/556070169.sd.mp4?s=bdb93ab8023577cd5948ba0e0d37f7f47654aee9&profile_id=164',
  'Leg Press': 'https://player.vimeo.com/external/568448048.sd.mp4?s=db0188b3080e9230ed0efe6533c223ada6a72d0d&profile_id=164',
  
  'Plank': 'https://player.vimeo.com/external/556071954.sd.mp4?s=e011143591444df8d3eaeddc2175dfb131f99650&profile_id=164',
  'Sit-up': 'https://player.vimeo.com/external/690330440.sd.mp4?s=b43bce64e8ba3e29e7ad66d03194e1f808332817&profile_id=164',
  'Russian Twist': 'https://player.vimeo.com/external/510483775.sd.mp4?s=c34c373f54bb0f188e0dc6fadb9e809e4940d731&profile_id=164',
  
  'Burpee': 'https://player.vimeo.com/external/528378677.sd.mp4?s=8aa38015c18b37d4b9a72cf1d9539df17acf4ccf&profile_id=164',
  'Clean and Jerk': 'https://player.vimeo.com/external/531467877.sd.mp4?s=f06cea1f479948aefc8691242d7005b4da03e6e0&profile_id=164',
  
  'Lat Pulldown': 'https://player.vimeo.com/external/523089050.sd.mp4?s=859a8ad0c4589b02d8a05bd99fa32f873c324f43&profile_id=164',
  'Cable Row': 'https://player.vimeo.com/external/550777491.sd.mp4?s=c22563dfc33d47f4e3cad1151bd720f402ef2605&profile_id=164',
  'Leg Extension': 'https://player.vimeo.com/external/556071145.sd.mp4?s=52362f21ad4912328b5465c355f5dd9884e6a433&profile_id=164',
};

// Fallback video in case the main one fails
const fallbackVideo = 'https://player.vimeo.com/external/517090076.sd.mp4?s=ec2a75d5299ec8190c606582c19cc31573984f5a&profile_id=164';

const FormLibrary = () => {
  const [activeCategory, setActiveCategory] = useState('upper-body');
  
  // Mock library data with videos
  const libraryData = {
    'upper-body': [
      { id: 1, title: 'Bench Press', difficulty: 'intermediate', duration: '2:15', thumbnail: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80', videoUrl: exerciseVideoUrls['Bench Press'] },
      { id: 2, title: 'Push-up', difficulty: 'beginner', duration: '1:45', thumbnail: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80', videoUrl: exerciseVideoUrls['Push-up'] },
      { id: 3, title: 'Shoulder Press', difficulty: 'intermediate', duration: '1:55', thumbnail: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80', videoUrl: exerciseVideoUrls['Shoulder Press'] },
      { id: 4, title: 'Pull-up', difficulty: 'advanced', duration: '1:30', thumbnail: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80', videoUrl: exerciseVideoUrls['Pull-up'] },
      { id: 5, title: 'Bicep Curl', difficulty: 'beginner', duration: '2:10', thumbnail: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80', videoUrl: exerciseVideoUrls['Bicep Curl'] },
      { id: 6, title: 'Tricep Extension', difficulty: 'beginner', duration: '1:50', thumbnail: 'https://images.unsplash.com/photo-1584863231364-2edc166de576?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80', videoUrl: exerciseVideoUrls['Tricep Extension'] },
    ],
    'lower-body': [
      { id: 7, title: 'Squat', difficulty: 'intermediate', duration: '2:25', thumbnail: 'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80', videoUrl: exerciseVideoUrls['Squat'] },
      { id: 8, title: 'Deadlift', difficulty: 'advanced', duration: '2:35', thumbnail: 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80', videoUrl: exerciseVideoUrls['Deadlift'] },
      { id: 9, title: 'Lunge', difficulty: 'beginner', duration: '1:45', thumbnail: 'https://images.unsplash.com/photo-1434608519344-49d476545882?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1174&q=80', videoUrl: exerciseVideoUrls['Lunge'] },
      { id: 10, title: 'Leg Press', difficulty: 'intermediate', duration: '2:05', thumbnail: 'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80', videoUrl: exerciseVideoUrls['Leg Press'] },
    ],
    'core': [
      { id: 11, title: 'Plank', difficulty: 'beginner', duration: '1:30', thumbnail: 'https://images.unsplash.com/photo-1566241134883-13eb2393a3cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1176&q=80', videoUrl: exerciseVideoUrls['Plank'] },
      { id: 12, title: 'Sit-up', difficulty: 'beginner', duration: '1:20', thumbnail: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1025&q=80', videoUrl: exerciseVideoUrls['Sit-up'] },
      { id: 13, title: 'Russian Twist', difficulty: 'intermediate', duration: '1:40', thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80', videoUrl: exerciseVideoUrls['Russian Twist'] },
    ],
    'full-body': [
      { id: 14, title: 'Burpee', difficulty: 'advanced', duration: '2:20', thumbnail: 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80', videoUrl: exerciseVideoUrls['Burpee'] },
      { id: 15, title: 'Clean and Jerk', difficulty: 'advanced', duration: '2:45', thumbnail: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80', videoUrl: exerciseVideoUrls['Clean and Jerk'] },
    ],
    'gym-exercises': [
      { id: 16, title: 'Lat Pulldown', difficulty: 'intermediate', duration: '2:15', thumbnail: 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80', videoUrl: exerciseVideoUrls['Lat Pulldown'] },
      { id: 17, title: 'Cable Row', difficulty: 'intermediate', duration: '1:55', thumbnail: 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80', videoUrl: exerciseVideoUrls['Cable Row'] },
      { id: 18, title: 'Leg Extension', difficulty: 'beginner', duration: '1:35', thumbnail: 'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80', videoUrl: exerciseVideoUrls['Leg Extension'] },
    ],
  };
  
  // Active videos for the selected category
  const activeVideos = libraryData[activeCategory as keyof typeof libraryData] || [];
  
  // Video player state
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState<boolean>(false);
  const [videoProgress, setVideoProgress] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(50);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  
  // Video ref to control playback
  const videoRef = useRef<HTMLVideoElement | null>(null);
  
  // Handle video selection
  const handleVideoSelect = (videoId: number) => {
    setSelectedVideo(videoId);
    setIsVideoLoading(true);
    setVideoProgress(0);
    setHasError(false);
    
    // Simulate video loading
    const loadingInterval = setInterval(() => {
      setVideoProgress(prev => {
        const newProgress = prev + Math.floor(Math.random() * 15) + 5;
        if (newProgress >= 100) {
          clearInterval(loadingInterval);
          setIsVideoLoading(false);
          return 100;
        }
        return newProgress;
      });
    }, 200);
  };

  // Handle video volume change
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    
    if (videoRef.current) {
      videoRef.current.volume = newVolume / 100;
    }
    
    // Auto-unmute when volume is increased from zero
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
      if (videoRef.current) videoRef.current.muted = false;
    }
    
    // Auto-mute when volume is set to zero
    if (newVolume === 0 && !isMuted) {
      setIsMuted(true);
      if (videoRef.current) videoRef.current.muted = true;
    }
  };
  
  // Toggle mute status
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };
  
  // Toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };
  
  // Handle video error
  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error("Video error:", e);
    setHasError(true);
    setIsVideoLoading(false);
    
    toast({
      title: "Video Error",
      description: "We're having trouble playing this video. Trying a backup source...",
      variant: "destructive",
    });
    
    // Attempt to use fallback video
    if (videoRef.current) {
      videoRef.current.src = fallbackVideo;
      videoRef.current.load();
      videoRef.current.play().catch(err => {
        console.error("Fallback video failed to play:", err);
        toast({
          title: "Playback Failed",
          description: "Unable to play video. Please try again later.",
          variant: "destructive",
        });
      });
    }
  };
  
  // When component unmounts, clean up video element
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = '';
        videoRef.current.load();
      }
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container max-w-7xl py-8 px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Form Library</h1>
            <p className="text-muted-foreground">Browse perfect form examples for all workouts</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Info className="h-4 w-4 mr-1" /> How to Use
            </Button>
            <Button variant="default" size="sm">
              <Dumbbell className="h-4 w-4 mr-1" /> Request Exercise
            </Button>
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
                {selectedVideo ? (
                  // Video player view
                  <div className="col-span-full bg-muted rounded-lg overflow-hidden">
                    <div className="aspect-video bg-black relative">
                      {isVideoLoading ? (
                        // Loading state
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/80">
                          <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
                          <p className="text-sm mb-2">Loading video...</p>
                          <div className="w-64 mb-2">
                            <Progress value={videoProgress} className="h-2" />
                          </div>
                          <p className="text-xs text-muted-foreground">{videoProgress}%</p>
                        </div>
                      ) : hasError ? (
                        // Error state
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/80">
                          <p className="text-lg font-semibold mb-2">Video Unavailable</p>
                          <p className="text-sm text-center max-w-md mb-4">
                            Sorry, we couldn't play this video. We're trying to load a backup video instead.
                          </p>
                          <Button 
                            onClick={() => {
                              setHasError(false);
                              setIsVideoLoading(true);
                              setTimeout(() => setIsVideoLoading(false), 1500);
                            }} 
                            variant="outline"
                            size="sm"
                          >
                            Try Again
                          </Button>
                        </div>
                      ) : (
                        // Video player
                        <>
                          <video 
                            ref={videoRef}
                            className="w-full h-full object-cover"
                            src={activeVideos.find(v => v.id === selectedVideo)?.videoUrl || fallbackVideo}
                            poster={activeVideos.find(v => v.id === selectedVideo)?.thumbnail}
                            autoPlay
                            muted={isMuted}
                            playsInline
                            loop
                            onError={handleVideoError}
                            onLoadStart={() => setIsVideoLoading(true)}
                            onCanPlay={() => {
                              setIsVideoLoading(false);
                              setIsPlaying(true);
                            }}
                            onPlay={() => {
                              setIsPlaying(true);
                              toast({
                                title: "Video Started",
                                description: `Now playing: ${activeVideos.find(v => v.id === selectedVideo)?.title} form guide`,
                              });
                            }}
                            onPause={() => setIsPlaying(false)}
                          >
                            Your browser does not support the video tag.
                          </video>
                          
                          {/* Video controls overlay */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="text-white" onClick={togglePlayPause}>
                                  {isPlaying ? (
                                    <Pause className="h-6 w-6" />
                                  ) : (
                                    <Play className="h-6 w-6" />
                                  )}
                                </Button>
                                
                                <div className="flex items-center gap-2">
                                  <Button variant="ghost" size="icon" className="text-white" onClick={toggleMute}>
                                    {isMuted || volume === 0 ? (
                                      <VolumeX className="h-5 w-5" />
                                    ) : volume < 50 ? (
                                      <Volume1 className="h-5 w-5" />
                                    ) : (
                                      <Volume2 className="h-5 w-5" />
                                    )}
                                  </Button>
                                  
                                  <div className="w-24 hidden sm:block">
                                    <Slider
                                      value={[volume]}
                                      min={0}
                                      max={100}
                                      step={1}
                                      onValueChange={handleVolumeChange}
                                    />
                                  </div>
                                </div>
                              </div>
                              
                              <div className="text-white text-sm">
                                {activeVideos.find(v => v.id === selectedVideo)?.title} - Perfect Form
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold">
                            {activeVideos.find(v => v.id === selectedVideo)?.title} Perfect Form
                          </h3>
                          <p className="text-muted-foreground text-sm">
                            Watch and learn the perfect form technique
                          </p>
                        </div>
                        
                        <Button variant="outline" size="sm" onClick={() => setSelectedVideo(null)}>
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
                  // Video grid view
                  <>
                    {activeVideos.map(video => (
                      <Card key={video.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <div 
                          className="aspect-video bg-muted relative cursor-pointer"
                          onClick={() => handleVideoSelect(video.id)}
                        >
                          <img 
                            src={video.thumbnail} 
                            alt={video.title} 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <Button variant="secondary" size="icon">
                              <Play className="h-6 w-6" />
                            </Button>
                          </div>
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-0.5 text-xs rounded">
                            {video.duration}
                          </div>
                        </div>
                        
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{video.title}</h3>
                              <p className="text-xs text-muted-foreground">Perfect form demonstration</p>
                            </div>
                            <Badge variant={
                              video.difficulty === 'beginner' ? 'outline' : 
                              video.difficulty === 'intermediate' ? 'secondary' : 
                              'default'
                            }>
                              {video.difficulty}
                            </Badge>
                          </div>
                        </CardContent>
                        
                        <CardFooter className="px-4 pb-4 pt-0">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => handleVideoSelect(video.id)}
                          >
                            <Play className="h-4 w-4 mr-1" /> Watch Tutorial
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </>
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
