
import React, { useState } from 'react';
import Header from '@/components/Header';
import { usePoseDetection } from '@/hooks/usePoseDetection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

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
        if (message.toLowerCase().includes(workoutType?.toLowerCase() || '')) {
          resolve(`For proper ${workoutType} form, focus on maintaining proper alignment and technique. Would you like me to analyze your ${workoutType} form?`);
        } else if (message.toLowerCase().includes('feedback')) {
          resolve(`Based on your ${workoutType || 'workout'} video, I noticed some areas for improvement. Keep working on maintaining proper form throughout the movement.`);
        } else if (message.toLowerCase().includes('sets') || message.toLowerCase().includes('reps')) {
          resolve(`For ${workoutType || 'most exercises'}, I recommend 3-4 sets of 8-12 reps for muscle growth, or 4-6 sets of 3-5 reps for strength. Rest 60-90 seconds between sets.`);
        } else {
          resolve("I'm your AI fitness coach! I can help with exercise form, workout plans, and technique tips. What would you like to know about your workout today?");
        }
      }, 1000);
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container max-w-7xl py-8 px-4 sm:px-6">
        <h1 className="text-3xl font-bold mb-2">FormFit AI Coach</h1>
        <p className="text-muted-foreground mb-8">Upload or record your workout to get real-time form correction</p>
        
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
