
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Play, Info, Dumbbell, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';

// Sample video URLs for different exercises
const exerciseVideoUrls = {
  // Upper body videos
  'Bench Press': 'https://storage.googleapis.com/afs-prod/media/27c9014416924d618460e5e662232e2c/800.webm',
  'Push-up': 'https://storage.googleapis.com/afs-prod/media/02bd218036ae4671b4424e3999198bb8/800.webm',
  'Shoulder Press': 'https://storage.googleapis.com/afs-prod/media/a8fe0759532b424b97667f063bad17c6/800.webm',
  'Pull-up': 'https://storage.googleapis.com/afs-prod/media/02bd218036ae4671b4424e3999198bb8/800.webm',
  'Bicep Curl': 'https://storage.googleapis.com/afs-prod/media/254b9e73fb4e4219bc07fce324320d0c/800.webm',
  'Tricep Extension': 'https://storage.googleapis.com/afs-prod/media/1f0e276c1b6544e183c1857192d2a60c/800.webm',
  
  // Lower body videos
  'Squat': 'https://storage.googleapis.com/afs-prod/media/0a791a27d98440509efd4917a8138b32/800.webm',
  'Deadlift': 'https://storage.googleapis.com/afs-prod/media/6bb58e81eba94530ae20953466adea7e/800.webm',
  'Lunge': 'https://storage.googleapis.com/afs-prod/media/98ac61c3f5e04702848e1fd555e36a4b/800.webm',
  'Leg Press': 'https://storage.googleapis.com/afs-prod/media/0a791a27d98440509efd4917a8138b32/800.webm',
  
  // Core videos
  'Plank': 'https://storage.googleapis.com/afs-prod/media/915ada84fde5420ea345ffdcba3a180b/800.webm',
  'Sit-up': 'https://storage.googleapis.com/afs-prod/media/b784ca81c9f14d6eace1efd52d553dad/800.webm',
  'Russian Twist': 'https://storage.googleapis.com/afs-prod/media/e76abc0781d64457a13a867408084e3f/800.webm',
  
  // Full body videos
  'Burpee': 'https://storage.googleapis.com/afs-prod/media/863dfb85a3bb422d90c12f373e61e223/800.webm',
  'Clean and Jerk': 'https://storage.googleapis.com/afs-prod/media/d2ceacfcfa1345099559bc79dff8a6fc/800.webm',
  
  // Gym exercises
  'Lat Pulldown': 'https://storage.googleapis.com/afs-prod/media/c2c7e4ac9e004db5a5d05c912e2eaefc/800.webm',
  'Cable Row': 'https://storage.googleapis.com/afs-prod/media/c2c7e4ac9e004db5a5d05c912e2eaefc/800.webm',
  'Leg Extension': 'https://storage.googleapis.com/afs-prod/media/0a791a27d98440509efd4917a8138b32/800.webm',
};

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
  
  // Handle video selection
  const handleVideoSelect = (videoId: number) => {
    setSelectedVideo(videoId);
    setIsVideoLoading(true);
    setVideoProgress(0);
    
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
                          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                          <p className="text-sm mb-2">Loading video...</p>
                          <div className="w-64 mb-2">
                            <Progress value={videoProgress} className="h-2" />
                          </div>
                          <p className="text-xs text-muted-foreground">{videoProgress}%</p>
                        </div>
                      ) : (
                        // Video player
                        <video 
                          controls 
                          autoPlay
                          className="w-full h-full object-cover"
                          src={activeVideos.find(v => v.id === selectedVideo)?.videoUrl}
                          poster={activeVideos.find(v => v.id === selectedVideo)?.thumbnail}
                          onError={() => {
                            toast({
                              title: "Video Error",
                              description: "There was an error playing this video. Please try again.",
                              variant: "destructive",
                            });
                          }}
                          onPlay={() => {
                            toast({
                              title: "Video Started",
                              description: `Now playing: ${activeVideos.find(v => v.id === selectedVideo)?.title} form guide`,
                            });
                          }}
                        >
                          Your browser does not support the video tag.
                        </video>
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
