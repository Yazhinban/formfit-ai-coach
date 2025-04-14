
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Pause, RotateCcw, Loader } from 'lucide-react';
import PoseAnalysis from '@/components/PoseAnalysis';
import ResultsView from '@/components/ResultsView';
import ChatInterface from '@/components/ChatInterface';
import { Progress } from "@/components/ui/progress";

interface AnalysisTabProps {
  videoElement: HTMLVideoElement | null;
  keypoints: any[];
  isAnalyzing: boolean;
  analysisComplete: boolean;
  analysisResult: any;
  onStartAnalysis: () => void;
  onStopAnalysis: () => void;
  onResetAnalysis: () => void;
  onSendMessage: (message: string) => Promise<string>;
  onNavigateToResults: () => void;
  onNavigateToUpload: () => void;
  workoutType: string;
  analysisProgress: number;
}

const AnalysisTab: React.FC<AnalysisTabProps> = ({
  videoElement,
  keypoints,
  isAnalyzing,
  analysisComplete,
  analysisResult,
  onStartAnalysis,
  onStopAnalysis,
  onResetAnalysis,
  onSendMessage,
  onNavigateToResults,
  onNavigateToUpload,
  workoutType,
  analysisProgress,
}) => {
  // Create a safe mapping function to handle undefined issues
  const getIssues = () => {
    if (!analysisResult || !analysisResult.issues) {
      return [];
    }
    return analysisResult.issues.map((i: any) => ({ part: i.part, issue: i.issue })) || [];
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="overflow-hidden">
          <div className="relative video-container bg-black">
            {videoElement && (
              <>
                <PoseAnalysis 
                  videoElement={videoElement} 
                  keypoints={keypoints} 
                  issues={getIssues()} 
                />
                
                {/* Loading overlay during analysis */}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20">
                    <div className="text-center">
                      <Loader className="h-10 w-10 animate-spin text-primary mb-3" />
                      <h3 className="text-xl font-medium text-white mb-2">Analyzing {workoutType || 'Workout'}</h3>
                      <div className="w-64 mb-2">
                        <Progress value={analysisProgress} className="h-2" />
                      </div>
                      <p className="text-white/70">{analysisProgress}% complete</p>
                    </div>
                  </div>
                )}
                
                {/* Analysis complete message */}
                {analysisComplete && (
                  <div className="absolute top-4 right-4 bg-green-500/90 text-white px-3 py-1.5 rounded-full font-medium">
                    Analysis Done
                  </div>
                )}
                
                {/* Live workout type indicator */}
                {workoutType && (
                  <div className="absolute top-4 left-4 bg-background/70 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                    {workoutType}
                  </div>
                )}
              </>
            )}
          </div>
          
          <div className="p-4 flex justify-between border-t">
            {isAnalyzing ? (
              <Button variant="outline" onClick={onStopAnalysis}>
                <Pause className="mr-2 h-4 w-4" /> Stop Analysis
              </Button>
            ) : (
              <Button variant="default" onClick={onStartAnalysis}>
                <Play className="mr-2 h-4 w-4" /> Start Analysis
              </Button>
            )}
            
            <Button variant="outline" onClick={onResetAnalysis}>
              <RotateCcw className="mr-2 h-4 w-4" /> Reset
            </Button>
          </div>
        </Card>
        
        {analysisComplete && analysisResult && (
          <div className="mt-6">
            <ResultsView 
              exercise={analysisResult.exercise || workoutType || 'Unknown Exercise'}
              score={analysisResult.score || 0}
              issues={analysisResult.issues || []}
              reps={analysisResult.reps || 0}
            />
          </div>
        )}
      </div>
      
      <div>
        <ChatInterface 
          onSendMessage={onSendMessage}
        />
      </div>
      
      <div className="lg:col-span-3 mt-6 flex justify-between">
        <Button 
          variant="outline" 
          onClick={onNavigateToUpload}
        >
          Back to Upload
        </Button>
        
        <Button 
          onClick={onNavigateToResults}
          disabled={!analysisComplete}
        >
          View Results
        </Button>
      </div>
    </div>
  );
};

export default AnalysisTab;
