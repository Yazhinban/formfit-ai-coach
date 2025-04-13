
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Pause, RotateCcw } from 'lucide-react';
import PoseAnalysis from '@/components/PoseAnalysis';
import ResultsView from '@/components/ResultsView';
import ChatInterface from '@/components/ChatInterface';

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
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="overflow-hidden">
          <div className="relative video-container bg-black">
            {videoElement && (
              <PoseAnalysis 
                videoElement={videoElement} 
                keypoints={keypoints} 
                issues={analysisResult?.issues.map((i: any) => ({ part: i.part, issue: i.issue })) || []} 
              />
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
