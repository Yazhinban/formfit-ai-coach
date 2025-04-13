
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
  
  const { 
    keypoints, 
    isDetecting, 
    startDetection, 
    stopDetection, 
    analyzeForm,
    analysisResult
  } = usePoseDetection(videoElement);

  const handleVideoLoaded = (video: HTMLVideoElement, file: File | null) => {
    setVideoElement(video);
    setVideoFile(file);
    setAnalysisComplete(false);
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
    
    setIsAnalyzing(true);
    
    if (videoFile) {
      // For uploaded videos, play the video and detect poses
      videoElement.play().catch(console.error);
    }
    
    startDetection();
    
    toast({
      title: "Analysis Started",
      description: "Analyzing your form...",
    });
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
      description: `Form score: ${result.score}/100`,
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
  };

  const handleSendMessage = async (message: string): Promise<string> => {
    // In a real app, this would call an AI service
    return new Promise((resolve) => {
      setTimeout(() => {
        if (message.toLowerCase().includes('squat')) {
          resolve("For proper squat form, keep your chest up, back straight, and knees tracking over your toes. Descend until your thighs are parallel to the ground. Would you like me to analyze your squat form?");
        } else if (message.toLowerCase().includes('feedback')) {
          resolve("Based on your video, I noticed your knees are caving inward slightly. Try to push your knees outward in line with your toes throughout the movement. Your depth is good, but work on maintaining a more upright torso position.");
        } else {
          resolve("I'm here to help with your exercise form! Upload a video or record yourself working out, and I can provide feedback to help you improve and prevent injuries.");
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
            />
          </TabsContent>
          
          <TabsContent value="results" className="mt-6">
            <ResultsTab 
              analysisComplete={analysisComplete}
              analysisResult={analysisResult}
              onSendMessage={handleSendMessage}
              onNavigateToAnalyze={() => setActiveTab("analyze")}
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
