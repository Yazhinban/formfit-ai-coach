
import { useState, useEffect, useRef } from 'react';

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

interface WorkoutMetrics {
  reps: number;
  formScore: number;
  workoutType: string;
  confidence: number;
}

export interface AnalysisResult {
  score: number;
  exercise: string;
  issues: FormIssue[];
  reps?: number;
  metrics?: {
    kneeAngle?: number;
    hipAngle?: number;
    backAngle?: number;
  };
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
    { part: 'leftKnee', position: { x: 280, y: 400 + Math.sin(videoTime) * 20, score: 0.7 }, score: 0.7 },
    { part: 'rightKnee', position: { x: 320, y: 400 + Math.sin(videoTime) * 20, score: 0.7 }, score: 0.7 },
    { part: 'leftAnkle', position: { x: 280, y: 480 + Math.cos(videoTime) * 5, score: 0.6 }, score: 0.6 },
    { part: 'rightAnkle', position: { x: 320, y: 480 + Math.cos(videoTime) * 5, score: 0.6 }, score: 0.6 },
  ];
  
  return keypoints;
};

// Mock workout detection function - would be ML-based in production
const detectWorkoutType = (keypoints: PoseKeypoint[]): { type: string; confidence: number } => {
  // For demonstration purposes
  const types = ['Squat', 'Push-up', 'Plank', 'Deadlift', 'Lunge'];
  const randomIndex = Math.floor(Date.now() / 1000) % types.length;
  return { 
    type: types[randomIndex], 
    confidence: 0.75 + Math.random() * 0.2
  };
};

// Mock function to detect form issues
const mockFormAnalysis = (keypoints: PoseKeypoint[], workoutType: string): AnalysisResult => {
  // Generate more realistic and specific analysis based on workout type
  
  let score: number;
  let issues: FormIssue[] = [];
  let reps = Math.floor(Math.random() * 8) + 3; // Random reps between 3 and 10
  
  switch(workoutType) {
    case 'Squat':
      score = 75;
      issues = [
        {
          part: 'knees',
          issue: 'Knees caving inward during descent',
          severity: 'medium',
          suggestion: 'Focus on pushing knees outward in line with toes. Try using a resistance band around knees during practice.'
        },
        {
          part: 'back',
          issue: 'Excessive forward lean',
          severity: 'high',
          suggestion: 'Keep chest up and maintain neutral spine. Practice wall squats to build proper form awareness.'
        },
        {
          part: 'ankles',
          issue: 'Limited ankle mobility',
          severity: 'low',
          suggestion: 'Work on ankle mobility exercises and consider elevating heels slightly with a small plate under them.'
        }
      ];
      break;
      
    case 'Push-up':
      score = 82;
      issues = [
        {
          part: 'elbows',
          issue: 'Elbows flaring out too wide',
          severity: 'medium',
          suggestion: 'Keep elbows at a 45-degree angle to your body to protect shoulders.'
        },
        {
          part: 'hips',
          issue: 'Hips sagging during movement',
          severity: 'high',
          suggestion: 'Engage your core throughout the entire movement. Practice plank holds to build core strength.'
        }
      ];
      break;
      
    case 'Plank':
      score = 90;
      issues = [
        {
          part: 'hips',
          issue: 'Hips too high',
          severity: 'low',
          suggestion: 'Lower hips to create a straight line from head to heels.'
        }
      ];
      break;
      
    case 'Deadlift':
      score = 68;
      issues = [
        {
          part: 'back',
          issue: 'Rounding of lower back',
          severity: 'high',
          suggestion: 'Maintain a neutral spine throughout the movement. Practice hip hinging without weight.'
        },
        {
          part: 'knees',
          issue: 'Knees too far forward at start',
          severity: 'medium',
          suggestion: 'Position shins close to the bar with knees behind the bar at starting position.'
        },
        {
          part: 'shoulders',
          issue: 'Shoulders rolling forward',
          severity: 'medium',
          suggestion: 'Keep shoulders retracted and down throughout the lift.'
        }
      ];
      break;
      
    default:
      score = 85;
      issues = [
        {
          part: 'form',
          issue: 'Minor form inconsistencies',
          severity: 'low',
          suggestion: 'Focus on maintaining consistent form throughout the entire set.'
        }
      ];
  }
  
  // Return analysis result
  return {
    score,
    exercise: workoutType,
    issues,
    reps,
    metrics: {
      kneeAngle: Math.floor(85 + Math.random() * 20),
      hipAngle: Math.floor(100 + Math.random() * 30),
      backAngle: Math.floor(160 + Math.random() * 20)
    }
  };
};

export const usePoseDetection = (videoElement: HTMLVideoElement | null) => {
  const [keypoints, setKeypoints] = useState<PoseKeypoint[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedWorkout, setDetectedWorkout] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [workoutMetrics, setWorkoutMetrics] = useState<WorkoutMetrics | null>(null);
  
  const rafId = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const keypointHistoryRef = useRef<PoseKeypoint[][]>([]);
  const processingTimeRef = useRef<number[]>([]);

  // Start pose detection
  const startDetection = () => {
    if (!videoElement || isDetecting) return;
    
    setIsDetecting(true);
    lastTimeRef.current = 0;
    keypointHistoryRef.current = [];
    processingTimeRef.current = [];
    
    const detectPose = (time: number) => {
      if (!videoElement) {
        setIsDetecting(false);
        return;
      }
      
      // Only process every 100ms for performance in this mock
      // In production with real ML, we'd optimize this based on device capability
      if (time - lastTimeRef.current > 100) {
        const startTime = performance.now();
        
        const elapsedSeconds = videoElement.currentTime;
        const mockData = mockPoseData(elapsedSeconds);
        setKeypoints(mockData);
        
        // Store keypoint history for better analysis
        keypointHistoryRef.current.push(mockData);
        if (keypointHistoryRef.current.length > 30) { // Keep last 30 frames (3 seconds at 10fps)
          keypointHistoryRef.current.shift();
        }
        
        // Detect workout type every 10 frames
        if (keypointHistoryRef.current.length % 10 === 0) {
          const workoutResult = detectWorkoutType(mockData);
          if (workoutResult.confidence > 0.7) {
            setDetectedWorkout(workoutResult.type);
            // Update workout metrics
            setWorkoutMetrics({
              reps: Math.floor(elapsedSeconds / 3), // Mock rep counting
              formScore: Math.round(70 + Math.random() * 25),
              workoutType: workoutResult.type,
              confidence: workoutResult.confidence
            });
          }
        }
        
        lastTimeRef.current = time;
        
        // Track processing time for performance optimization
        const endTime = performance.now();
        processingTimeRef.current.push(endTime - startTime);
        if (processingTimeRef.current.length > 50) {
          processingTimeRef.current.shift();
        }
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
    // In production, this would analyze the complete sequence of poses
    // using a more sophisticated biomechanical model
    
    // For now, we use mock data
    const workoutType = detectedWorkout || 'Squat';
    const result = mockFormAnalysis(keypoints, workoutType);
    setAnalysisResult(result);
    return result;
  };
  
  // Get average processing time for performance metrics
  const getPerformanceMetrics = () => {
    if (processingTimeRef.current.length === 0) return { avgProcessingTime: 0 };
    
    const sum = processingTimeRef.current.reduce((a, b) => a + b, 0);
    const avgProcessingTime = sum / processingTimeRef.current.length;
    
    return { avgProcessingTime };
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
    detectedWorkout,
    workoutMetrics,
    performanceMetrics: getPerformanceMetrics()
  };
};
