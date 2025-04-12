
import React, { useState, useRef } from 'react';
import Header from '@/components/Header';
import VideoInput from '@/components/VideoInput';
import PoseAnalysis from '@/components/PoseAnalysis';
import ChatInterface from '@/components/ChatInterface';
import ResultsView from '@/components/ResultsView';
import { usePoseDetection } from '@/hooks/usePoseDetection';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, RotateCcw, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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
            <VideoInput onVideoLoaded={handleVideoLoaded} />
            
            <div className="mt-6 flex justify-end">
              <Button 
                onClick={() => setActiveTab("analyze")}
                disabled={!videoElement}
              >
                Next: Analyze Form <Check className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="analyze" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="overflow-hidden">
                  <div className="relative video-container bg-black">
                    {videoElement && (
                      <>
                        <PoseAnalysis 
                          videoElement={videoElement} 
                          keypoints={keypoints} 
                          issues={analysisResult?.issues.map(i => ({ part: i.part, issue: i.issue })) || []} 
                        />
                      </>
                    )}
                  </div>
                  
                  <div className="p-4 flex justify-between border-t">
                    {isAnalyzing ? (
                      <Button variant="outline" onClick={handleStopAnalysis}>
                        <Pause className="mr-2 h-4 w-4" /> Stop Analysis
                      </Button>
                    ) : (
                      <Button variant="default" onClick={handleStartAnalysis}>
                        <Play className="mr-2 h-4 w-4" /> Start Analysis
                      </Button>
                    )}
                    
                    <Button variant="outline" onClick={handleResetAnalysis}>
                      <RotateCcw className="mr-2 h-4 w-4" /> Reset
                    </Button>
                  </div>
                </Card>
                
                {analysisComplete && analysisResult && (
                  <div className="mt-6">
                    <ResultsView 
                      exercise={analysisResult.exercise}
                      score={analysisResult.score}
                      issues={analysisResult.issues}
                      reps={analysisResult.reps}
                    />
                  </div>
                )}
              </div>
              
              <div>
                <ChatInterface 
                  onSendMessage={handleSendMessage}
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setActiveTab("upload")}
              >
                Back to Upload
              </Button>
              
              <Button 
                onClick={() => setActiveTab("results")}
                disabled={!analysisComplete}
              >
                View Results <Check className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="results" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {analysisComplete && analysisResult ? (
                  <>
                    <Card className="mb-6">
                      <CardHeader>
                        <CardTitle>Exercise Analysis</CardTitle>
                        <CardDescription>
                          {analysisResult.exercise} form assessment
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResultsView 
                          exercise={analysisResult.exercise}
                          score={analysisResult.score}
                          issues={analysisResult.issues}
                          reps={analysisResult.reps}
                        />
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Improvement Tips</CardTitle>
                        <CardDescription>
                          Suggested exercises and corrections
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {analysisResult.issues.map((issue, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                                {i + 1}
                              </div>
                              <div>
                                <h4 className="font-medium">Fix: {issue.issue}</h4>
                                <p className="text-sm text-muted-foreground">{issue.suggestion}</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>No Analysis Available</CardTitle>
                      <CardDescription>
                        Upload a video and complete the analysis to see results
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        onClick={() => setActiveTab("upload")}
                      >
                        Start Analysis
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              <div>
                <ChatInterface 
                  onSendMessage={handleSendMessage}
                />
              </div>
            </div>
            
            <div className="mt-6">
              <Button 
                variant="outline"
                onClick={() => setActiveTab("analyze")}
              >
                Back to Analysis
              </Button>
            </div>
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
