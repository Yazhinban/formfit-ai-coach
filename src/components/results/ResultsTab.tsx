
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';
import ResultsView from '@/components/ResultsView';
import ChatInterface from '@/components/ChatInterface';

interface ResultsTabProps {
  analysisComplete: boolean;
  analysisResult: any;
  onSendMessage: (message: string) => Promise<string>;
  onNavigateToAnalyze: () => void;
  workoutType?: string;
}

const ResultsTab: React.FC<ResultsTabProps> = ({
  analysisComplete,
  analysisResult,
  onSendMessage,
  onNavigateToAnalyze,
  workoutType,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        {analysisComplete && analysisResult ? (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{workoutType || analysisResult.exercise} Analysis</CardTitle>
                <CardDescription>
                  Form assessment and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResultsView 
                  exercise={workoutType || analysisResult.exercise}
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
                  {analysisResult.issues.map((issue: any, i: number) => (
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
              <Button onClick={onNavigateToAnalyze}>
                Start Analysis
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      <div>
        <ChatInterface 
          onSendMessage={onSendMessage}
        />
      </div>
      
      <div className="mt-6">
        <Button 
          variant="outline"
          onClick={onNavigateToAnalyze}
        >
          Back to Analysis
        </Button>
      </div>
    </div>
  );
};

export default ResultsTab;
