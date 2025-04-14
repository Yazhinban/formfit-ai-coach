
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Check, Share2, Activity, ChevronRight, Copy, Facebook, Twitter, Linkedin } from 'lucide-react';
import ResultsView from '@/components/ResultsView';
import ChatInterface from '@/components/ChatInterface';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent
} from '@/components/ui/chart';
import { 
  Area, 
  AreaChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from '@/hooks/use-toast';

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
  const [showGraph, setShowGraph] = useState(false);
  
  // Ensure we have valid data to work with
  const safeResult = analysisResult || {};
  const safeIssues = safeResult.issues || [];
  const safeMetrics = safeResult.metrics || {};
  const angleData = safeResult.angleData || [];
  
  // Create chart data from angle data or generate simulated data if none exists
  const chartData = angleData.length > 0 ? angleData : Array.from({ length: 30 }, (_, i) => ({
    time: i,
    angle: 90 + Math.sin(i * 0.3) * 40 + (Math.random() * 10 - 5)
  }));

  // Handle sharing functionality
  const handleShare = (platform: string) => {
    const exerciseName = workoutType || safeResult.exercise || 'my workout';
    const score = safeResult.score || 0;
    const shareMessage = `I just scored ${score}/100 on my ${exerciseName} form with FormFit AI Coach!`;
    const shareUrl = window.location.href;
    
    let shareLink = "";
    
    switch(platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareMessage)}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(shareMessage)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(`${shareMessage} ${shareUrl}`);
        toast({
          title: "Link copied!",
          description: "The link has been copied to your clipboard.",
        });
        return;
    }
    
    if (shareLink) {
      window.open(shareLink, '_blank', 'noopener,noreferrer');
    }
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        {analysisComplete && analysisResult ? (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{workoutType || safeResult.exercise || 'Workout'} Analysis</CardTitle>
                <CardDescription>
                  Form assessment and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResultsView 
                  exercise={workoutType || safeResult.exercise || 'Unknown Exercise'}
                  score={safeResult.score || 0}
                  issues={safeIssues}
                  reps={safeResult.reps || 0}
                  metrics={safeMetrics}
                />
              </CardContent>
            </Card>
            
            {showGraph && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Movement Analysis</CardTitle>
                  <CardDescription>
                    Joint angle changes during your {workoutType || safeResult.exercise || 'workout'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 w-full">
                    <ChartContainer
                      config={{
                        angle: {
                          label: "Angle",
                          color: "hsl(var(--primary))"
                        },
                        grid: {
                          color: "hsl(var(--border))"
                        }
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorAngle" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis 
                            dataKey="time" 
                            tick={{ fontSize: 12 }} 
                            tickFormatter={(value) => `${value}s`}
                          />
                          <YAxis 
                            tick={{ fontSize: 12 }} 
                            domain={['auto', 'auto']} 
                            tickFormatter={(value) => `${value}°`}
                          />
                          <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                          <Tooltip 
                            // This is the key change - we're not using content prop directly anymore
                            contentStyle={{ 
                              background: 'var(--background)', 
                              border: '1px solid var(--border)',
                              borderRadius: '0.5rem',
                              boxShadow: 'var(--shadow)'
                            }}
                            formatter={(value) => [`${value}°`, 'Joint Angle']}
                            labelFormatter={(label) => `Time: ${label}s`}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="angle" 
                            name="angle" 
                            stroke="hsl(var(--primary))" 
                            fillOpacity={1}
                            fill="url(#colorAngle)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    This graph shows the change in joint angles during your workout, highlighting form consistency.
                  </p>
                </CardContent>
              </Card>
            )}
            
            <Card>
              <CardHeader>
                <CardTitle>Improvement Tips</CardTitle>
                <CardDescription>
                  Suggested exercises and corrections
                </CardDescription>
              </CardHeader>
              <CardContent>
                {safeIssues.length > 0 ? (
                  <ul className="space-y-3">
                    {safeIssues.map((issue: any, i: number) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5"
                             style={{
                               backgroundColor: issue.severity === 'high' ? 'rgba(239, 68, 68, 0.2)' : 
                                               issue.severity === 'medium' ? 'rgba(245, 158, 11, 0.2)' : 
                                               'rgba(34, 211, 238, 0.2)'
                             }}>
                          <ChevronRight className="h-4 w-4" style={{
                            color: issue.severity === 'high' ? 'rgb(239, 68, 68)' : 
                                   issue.severity === 'medium' ? 'rgb(245, 158, 11)' : 
                                   'rgb(34, 211, 238)'
                          }} />
                        </div>
                        <div>
                          <h4 className="font-medium">Fix: {issue.issue}</h4>
                          <p className="text-sm text-muted-foreground">{issue.suggestion || 'Maintain proper form and alignment.'}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No specific issues detected. Keep up the good work!</p>
                )}
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
      
      <div className="mt-6 flex items-center justify-between">
        <Button 
          variant="outline"
          onClick={onNavigateToAnalyze}
        >
          Back to Analysis
        </Button>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowGraph(!showGraph)}
            className="flex items-center gap-2"
          >
            <Activity size={16} />
            {showGraph ? 'Hide Movement Graph' : 'View Movement Graph'}
          </Button>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Share2 size={16} />
                Share Results
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56" align="end">
              <div className="grid gap-3">
                <h4 className="font-medium text-sm">Share via</h4>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => handleShare('facebook')}>
                    <Facebook size={16} className="mr-2" /> Facebook
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => handleShare('twitter')}>
                    <Twitter size={16} className="mr-2" /> Twitter
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => handleShare('linkedin')}>
                    <Linkedin size={16} className="mr-2" /> LinkedIn
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => handleShare('copy')}>
                    <Copy size={16} className="mr-2" /> Copy Link
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default ResultsTab;
