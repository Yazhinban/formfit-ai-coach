
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, AlertTriangle, ChevronRight, Activity, BarChart, Copy, Share2 } from 'lucide-react';
import { Button } from './ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

interface FormIssue {
  part: string;
  issue: string;
  severity: 'low' | 'medium' | 'high';
  suggestion: string;
}

interface ResultsViewProps {
  exercise: string;
  score: number;
  issues: FormIssue[];
  reps?: number;
  metrics?: {
    kneeAngle?: number;
    hipAngle?: number;
    backAngle?: number;
  };
}

// Sample movement data for the graph
const generateMovementData = () => {
  const data = [];
  for (let i = 0; i < 20; i++) {
    const value = Math.floor(50 + Math.sin(i * 0.5) * 30 * Math.random());
    data.push({
      time: i,
      angle: value,
    });
  }
  return data;
};

const ResultsView: React.FC<ResultsViewProps> = ({ exercise, score, issues = [], reps, metrics }) => {
  // Ensure issues is always an array
  const safeIssues = Array.isArray(issues) ? issues : [];
  
  // Round the score to the nearest integer
  const roundedScore = Math.round(score);
  
  // State for showing/hiding the movement graph
  const [showMovementGraph, setShowMovementGraph] = useState(true);
  
  // Generate movement data for the graph
  const movementData = generateMovementData();
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <span>Form Analysis</span>
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                AI-Powered
              </span>
            </CardTitle>
            <div className="text-2xl font-bold">
              <span className={roundedScore >= 80 ? 'text-secondary' : roundedScore >= 60 ? 'text-amber-500' : 'text-destructive'}>
                {roundedScore}/100
              </span>
            </div>
          </div>
          <CardDescription className="flex items-center gap-2">
            <span>{exercise}</span>
            {reps && (
              <>
                <span className="w-1 h-1 rounded-full bg-muted-foreground inline-block"></span>
                <span>{reps} reps</span>
              </>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {score >= 80 && (
              <div className="flex items-center gap-2 text-secondary bg-secondary/10 px-3 py-2 rounded-md">
                <CheckCircle2 size={20} />
                <span className="font-medium">Great form! Keep it up.</span>
              </div>
            )}
            
            {metrics && (
              <div className="grid grid-cols-3 gap-2 mt-4">
                {metrics.kneeAngle !== undefined && (
                  <div className="bg-muted/50 p-3 rounded-md text-center">
                    <div className="text-xs text-muted-foreground mb-1">Knee Angle</div>
                    <div className="font-semibold">{metrics.kneeAngle}°</div>
                  </div>
                )}
                
                {metrics.hipAngle !== undefined && (
                  <div className="bg-muted/50 p-3 rounded-md text-center">
                    <div className="text-xs text-muted-foreground mb-1">Hip Angle</div>
                    <div className="font-semibold">{metrics.hipAngle}°</div>
                  </div>
                )}
                
                {metrics.backAngle !== undefined && (
                  <div className="bg-muted/50 p-3 rounded-md text-center">
                    <div className="text-xs text-muted-foreground mb-1">Back Angle</div>
                    <div className="font-semibold">{metrics.backAngle}°</div>
                  </div>
                )}
              </div>
            )}
            
            {showMovementGraph && (
              <div className="mt-4">
                <div className="text-sm font-medium mb-2 flex items-center gap-1">
                  <Activity size={16} />
                  <span>Movement Analysis</span>
                </div>
                <div className="bg-muted/30 rounded-md p-2" style={{ height: '180px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={movementData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#888" opacity={0.2} />
                      <XAxis dataKey="time" tick={{ fontSize: 10 }} label={{ value: 'Time (s)', position: 'insideBottom', offset: -5, fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} label={{ value: 'Angle (°)', angle: -90, position: 'insideLeft', fontSize: 10 }} />
                      <Tooltip 
                        formatter={(value) => [`${value}°`, 'Angle']}
                        labelFormatter={(label) => `Time: ${label}s`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="angle" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2} 
                        dot={{ r: 2 }} 
                        activeDot={{ r: 4 }} 
                        animationDuration={500}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
            
            {safeIssues.length > 0 ? (
              <div className="space-y-3">
                <h3 className="font-medium text-sm text-muted-foreground">Form Corrections:</h3>
                {safeIssues.map((issue, index) => (
                  <div key={index} className="border-l-2 pl-4 py-1 space-y-1" style={{
                    borderColor: issue.severity === 'high' ? 'hsl(var(--destructive))' : 
                               issue.severity === 'medium' ? 'hsl(38 92% 50%)' : 
                               'hsl(var(--secondary))'
                  }}>
                    <div className="flex items-center gap-2">
                      {issue.severity === 'high' ? (
                        <AlertTriangle size={16} className="text-destructive" />
                      ) : (
                        <ChevronRight size={16} className="text-muted-foreground" />
                      )}
                      <p className="font-medium text-sm">
                        <span className="capitalize">{issue.part}</span>: {issue.issue}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">{issue.suggestion}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No form issues detected.</p>
            )}
            
            <div className="flex justify-between mt-4">
              <Button 
                variant={showMovementGraph ? "default" : "outline"} 
                size="sm" 
                className="flex items-center gap-2"
                onClick={() => setShowMovementGraph(!showMovementGraph)}
              >
                {showMovementGraph ? <BarChart size={16} /> : <Activity size={16} />}
                {showMovementGraph ? "Hide Movement Graph" : "View Movement Graph"}
              </Button>
              
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Share2 size={16} /> Share Results
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsView;
