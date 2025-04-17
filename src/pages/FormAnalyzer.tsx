
import React, { useState } from 'react';
import Header from '@/components/Header';
import { usePoseDetection } from '@/hooks/usePoseDetection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

// Import refactored components
import UploadTab from '@/components/upload/UploadTab';
import AnalysisTab from '@/components/analysis/AnalysisTab';
import ResultsTab from '@/components/results/ResultsTab';

const FormAnalyzer = () => {
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
        if (message.toLowerCase().includes('workout plan')) {
          resolve(`Here's a balanced weekly workout plan:
          Monday: Upper body (bench press, rows, shoulder press)
          Tuesday: Lower body (squats, lunges, leg press)
          Wednesday: Rest or light cardio
          Thursday: Push exercises (chest, shoulders, triceps)
          Friday: Pull exercises (back, biceps)
          Saturday: Core and cardio
          Sunday: Rest day`);
        } else if (message.toLowerCase().includes(workoutType?.toLowerCase() || '')) {
          resolve(`For proper ${workoutType} form, focus on maintaining proper alignment and technique. Would you like me to analyze your ${workoutType} form?`);
        } else if (message.toLowerCase().includes('feedback')) {
          resolve(`Based on your ${workoutType || 'workout'} video, I noticed some areas for improvement. Keep working on maintaining proper form throughout the movement.`);
        } else if (message.toLowerCase().includes('sets') || message.toLowerCase().includes('reps')) {
          resolve(`For ${workoutType || 'most exercises'}, I recommend 3-4 sets of 8-12 reps for muscle growth, or 4-6 sets of 3-5 reps for strength. Rest 60-90 seconds between sets.`);
        } else if (message.toLowerCase().includes('diet') || message.toLowerCase().includes('nutrition')) {
          resolve(`For optimal fitness results, focus on balanced nutrition with adequate protein (0.8-1g per pound of bodyweight), complex carbs for energy, and healthy fats. Stay hydrated and time your meals around your workouts.`);
        } else {
          resolve("I'm your AI fitness coach! I can help with exercise form, workout plans, and technique tips. What would you like to know about your workout today?");
        }
      }, 1000);
    });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      className="min-h-screen bg-background flex flex-col"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Header />
      
      <motion.main className="flex-1 container max-w-7xl py-8 px-4 sm:px-6" variants={itemVariants}>
        <motion.div className="flex items-center gap-3 mb-4" variants={itemVariants}>
          <Link to="/">
            <Button variant="outline" size="sm" className="flex items-center gap-2 group">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </Button>
          </Link>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <motion.h1 
            className="text-3xl font-bold mb-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Form Analyzer
          </motion.h1>
          <motion.div 
            className="flex items-center gap-2 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p className="text-muted-foreground">Upload or record your workout to get real-time form correction</p>
            <span className="inline-flex items-center">
              <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" />
            </span>
          </motion.div>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-muted/80 via-muted to-muted/80 shadow-inner">
              <TabsTrigger value="upload" className="data-[state=active]:bg-background data-[state=active]:shadow-md transition-all duration-300">Upload Video</TabsTrigger>
              <TabsTrigger value="analyze" className="data-[state=active]:bg-background data-[state=active]:shadow-md transition-all duration-300">Analyze Form</TabsTrigger>
              <TabsTrigger value="results" className="data-[state=active]:bg-background data-[state=active]:shadow-md transition-all duration-300">Results</TabsTrigger>
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
                analysisResult={analysisResult || {}}
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
                analysisResult={analysisResult || {}}
                onSendMessage={handleSendMessage}
                onNavigateToAnalyze={() => setActiveTab("analyze")}
                workoutType={workoutType}
              />
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.main>
      
      <footer className="py-6 border-t">
        <div className="container max-w-7xl px-4 sm:px-6">
          <p className="text-center text-muted-foreground text-sm">
            FormFit AI Coach © {new Date().getFullYear()} | AI Powered Workout Analysis
          </p>
        </div>
      </footer>
    </motion.div>
  );
};

export default FormAnalyzer;
