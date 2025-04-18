import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Share2, Copy, Facebook, Twitter, Linkedin } from 'lucide-react';
import ResultsView from '@/components/ResultsView';
import ChatInterface from '@/components/ChatInterface';
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
  const safeResult = analysisResult || {};
  const safeIssues = safeResult.issues || [];
  const safeMetrics = safeResult.metrics || {};

  const handleShare = (platform: string) => {
    const exerciseName = workoutType || safeResult.exercise || 'my workout';
    const score = safeResult.score ? Math.round(safeResult.score) : 0;
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

  const handleEnhancedMessage = async (message: string): Promise<string> => {
    let context = "";
    
    if (workoutType) {
      context += `The user is currently analyzing their ${workoutType} workout. `;
    }
    
    if (analysisComplete && safeResult) {
      context += `Their form score is ${Math.round(safeResult.score || 0)}/100. `;
      
      if (safeIssues.length > 0) {
        context += `They have ${safeIssues.length} form issues including: ${safeIssues.map((i: any) => i.issue).join(', ')}. `;
      }
    }
    
    if (message.toLowerCase().includes('workout plan')) {
      return `Here's a balanced weekly workout plan:
      Monday: Upper body (bench press, rows, shoulder press)
      Tuesday: Lower body (squats, lunges, leg press)
      Wednesday: Rest or light cardio
      Thursday: Push exercises (chest, shoulders, triceps)
      Friday: Pull exercises (back, biceps)
      Saturday: Core and cardio
      Sunday: Rest day`;
    } 
    else if (message.toLowerCase().includes('form') || message.toLowerCase().includes('technique')) {
      if (workoutType) {
        return `For proper ${workoutType} form:
        
        ${workoutType === 'squat' ? '1. Keep your chest up and back straight\n2. Push knees out in line with toes\n3. Descend until hips are below parallel\n4. Drive through your heels' : ''}
        ${workoutType === 'deadlift' ? '1. Keep your back flat and core tight\n2. Push through the floor with your legs\n3. Keep the bar close to your body\n4. Hinge at the hips, don\'t squat the weight up' : ''}
        ${workoutType === 'bench press' ? '1. Retract your shoulder blades\n2. Keep feet flat on the floor\n3. Lower the bar to mid-chest\n4. Drive the bar up in a slight arc' : ''}
        ${workoutType === 'pushup' ? '1. Maintain a rigid plank position\n2. Hands at shoulder width or slightly wider\n3. Lower until chest nearly touches the ground\n4. Push back up with full extension' : ''}
        ${!['squat', 'deadlift', 'bench press', 'pushup'].includes(workoutType) ? '1. Focus on proper alignment\n2. Maintain controlled movements\n3. Use a weight appropriate for your strength level\n4. Breathe properly throughout the movement' : ''}`;
      } else {
        return "For proper exercise form, focus on maintaining good posture, controlling the movement throughout the full range of motion, and using a weight that allows you to perform the exercise correctly. Would you like specific advice for a particular exercise?";
      }
    }
    else if (message.toLowerCase().includes('diet') || message.toLowerCase().includes('nutrition')) {
      return `For optimal fitness results:
      
      1. Protein: Aim for 0.8-1g per pound of bodyweight daily
      2. Carbs: Focus on complex carbs around workout times
      3. Fats: Include healthy fats like avocados, nuts, and olive oil
      4. Hydration: Drink at least 8 glasses of water daily
      5. Timing: Consider eating protein within 30 minutes after workouts
      
      Remember that consistency is more important than perfection!`;
    } 
    else if (message.toLowerCase().includes('sets') || message.toLowerCase().includes('reps')) {
      return "Optimal sets and reps depend on your goals: \n\n- Strength: 4-6 sets of 3-5 reps (heavy weight, longer rest)\n- Muscle growth: 3-4 sets of 8-12 reps (moderate weight)\n- Endurance: 2-3 sets of 15-20 reps (lighter weight, shorter rest)\n\nFor " + (workoutType || 'most exercises') + ", I'd recommend starting with 3 sets of 8-12 reps with a weight that challenges you by the last few reps.";
    }
    else if (message.toLowerCase().includes('improve') || message.toLowerCase().includes('better')) {
      if (analysisComplete && safeIssues.length > 0) {
        return `Based on your analysis, here's how you can improve your ${workoutType || 'workout'} form:
        
        ${safeIssues.map((issue: any, i: number) => `${i+1}. ${issue.suggestion || issue.issue}`).join('\n')}
        
        Would you like more specific advice on any of these points?`;
      } else {
        return `To improve your ${workoutType || 'exercise'} form:
        
        1. Record yourself from multiple angles
        2. Compare with tutorial videos by professionals
        3. Start with lighter weights to perfect technique
        4. Consider working with a qualified trainer
        5. Perform mobility work to address limitations
        
        The most common issue is rushing through reps - focus on quality over quantity!`;
      }
    }
    
    return onSendMessage(message);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        {analysisComplete && safeResult ? (
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
          onSendMessage={handleEnhancedMessage}
        />
      </div>
      
      <div className="mt-6 flex items-center justify-between">
        <Button 
          variant="outline"
          onClick={onNavigateToAnalyze}
        >
          Back to Analysis
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
  );
};

export default ResultsTab;
