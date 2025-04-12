
import { useState, useEffect, useRef } from 'react';

// This is a mock implementation that simulates pose detection
// In a real app, you would integrate a model like MoveNet here
interface PosePoint {
  x: number;
  y: number;
  score: number;
}

interface PoseKeypoint {
  position: PosePoint;
  part: string;
  score: number;
}

interface FormIssue {
  part: string;
  issue: string;
  severity: 'low' | 'medium' | 'high';
  suggestion: string;
}

// This will be replaced with actual pose detection in production
const mockPoseData = (videoTime: number): PoseKeypoint[] => {
  // Generate fake keypoints for demonstration
  const keypoints: PoseKeypoint[] = [
    // Head
    { part: 'nose', position: { x: 300 + Math.sin(videoTime) * 5, y: 100, score: 0.9 }, score: 0.9 },
    { part: 'leftEye', position: { x: 280 + Math.sin(videoTime) * 3, y: 90, score: 0.8 }, score: 0.8 },
    { part: 'rightEye', position: { x: 320 + Math.sin(videoTime) * 3, y: 90, score: 0.8 }, score: 0.8 },
    { part: 'leftEar', position: { x: 270 + Math.sin(videoTime) * 2, y: 100, score: 0.7 }, score: 0.7 },
    { part: 'rightEar', position: { x: 330 + Math.sin(videoTime) * 2, y: 100, score: 0.7 }, score: 0.7 },
    
    // Body
    { part: 'leftShoulder', position: { x: 260 + Math.sin(videoTime + 1) * 3, y: 160, score: 0.9 }, score: 0.9 },
    { part: 'rightShoulder', position: { x: 340 + Math.sin(videoTime + 1) * 3, y: 160, score: 0.9 }, score: 0.9 },
    { part: 'leftElbow', position: { x: 240 + Math.cos(videoTime) * 20, y: 220 + Math.sin(videoTime) * 10, score: 0.8 }, score: 0.8 },
    { part: 'rightElbow', position: { x: 360 + Math.cos(videoTime) * 20, y: 220 + Math.sin(videoTime) * 10, score: 0.8 }, score: 0.8 },
    { part: 'leftWrist', position: { x: 230 + Math.sin(videoTime) * 25, y: 280 + Math.cos(videoTime) * 20, score: 0.7 }, score: 0.7 },
    { part: 'rightWrist', position: { x: 370 + Math.sin(videoTime) * 25, y: 280 + Math.cos(videoTime) * 20, score: 0.7 }, score: 0.7 },
    
    // Lower Body
    { part: 'leftHip', position: { x: 280, y: 300, score: 0.8 }, score: 0.8 },
    { part: 'rightHip', position: { x: 320, y: 300, score: 0.8 }, score: 0.8 },
    { part: 'leftKnee', position: { x: 280, y: 400 + Math.sin(videoTime) * 10, score: 0.7 }, score: 0.7 },
    { part: 'rightKnee', position: { x: 320, y: 400 + Math.sin(videoTime) * 10, score: 0.7 }, score: 0.7 },
    { part: 'leftAnkle', position: { x: 280, y: 480 + Math.cos(videoTime) * 5, score: 0.6 }, score: 0.6 },
    { part: 'rightAnkle', position: { x: 320, y: 480 + Math.cos(videoTime) * 5, score: 0.6 }, score: 0.6 },
  ];
  
  return keypoints;
};

// Mock function to detect form issues
const mockFormAnalysis = (keypoints: PoseKeypoint[]): {
  score: number;
  exercise: string;
  issues: FormIssue[];
  reps?: number;
} => {
  // For demonstration, we're hardcoding a sample analysis
  return {
    score: 75,
    exercise: 'Squat',
    reps: 5,
    issues: [
      {
        part: 'knees',
        issue: 'Knees caving inward during descent',
        severity: 'medium',
        suggestion: 'Focus on pushing knees outward in line with toes'
      },
      {
        part: 'back',
        issue: 'Excessive forward lean',
        severity: 'high',
        suggestion: 'Keep chest up and maintain neutral spine'
      },
      {
        part: 'ankles',
        issue: 'Limited ankle mobility',
        severity: 'low',
        suggestion: 'Work on ankle mobility exercises and consider elevating heels slightly'
      }
    ]
  };
};

export const usePoseDetection = (videoElement: HTMLVideoElement | null) => {
  const [keypoints, setKeypoints] = useState<PoseKeypoint[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    score: number;
    exercise: string;
    issues: FormIssue[];
    reps?: number;
  } | null>(null);
  
  const rafId = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Start pose detection
  const startDetection = () => {
    if (!videoElement || isDetecting) return;
    
    setIsDetecting(true);
    lastTimeRef.current = 0;
    
    const detectPose = (time: number) => {
      if (!videoElement) {
        setIsDetecting(false);
        return;
      }
      
      // Only process every 100ms for performance in this mock
      if (time - lastTimeRef.current > 100) {
        const elapsedSeconds = videoElement.currentTime;
        const mockData = mockPoseData(elapsedSeconds);
        setKeypoints(mockData);
        lastTimeRef.current = time;
      }
      
      rafId.current = requestAnimationFrame(detectPose);
    };
    
    rafId.current = requestAnimationFrame(detectPose);
  };
  
  // Stop pose detection
  const stopDetection = () => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
    
    setIsDetecting(false);
  };
  
  // Analyze the recorded poses
  const analyzeForm = () => {
    // In a real app, this would analyze the complete sequence of poses
    const result = mockFormAnalysis(keypoints);
    setAnalysisResult(result);
    return result;
  };
  
  useEffect(() => {
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);
  
  return {
    keypoints,
    isDetecting,
    startDetection,
    stopDetection,
    analyzeForm,
    analysisResult,
  };
};
