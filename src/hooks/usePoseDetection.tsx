import React, { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';
import { calculateAngle, keypointMapping, exerciseAngleRanges } from '@/utils/poseUtils';

interface KeyPoint {
  x: number;
  y: number;
  score: number;
}

interface Pose {
  keypoints: KeyPoint[];
  score: number;
}

interface AnalysisResult {
  score: number;
  feedback: string[];
  goodPoints: string[];
  improvementAreas: string[];
}

export const usePoseDetection = (
  videoElement: HTMLVideoElement | null,
  workoutType: string
) => {
  const [keypoints, setKeypoints] = useState<KeyPoint[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectorModel, setDetectorModel] = useState<any>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult>({
    score: 0,
    feedback: [],
    goodPoints: [],
    improvementAreas: [],
  });
  
  const requestRef = useRef<number>();
  const poses = useRef<Pose[]>([]);
  const poseHistory = useRef<Pose[][]>([]);
  const detectedWorkout = useRef<string>(workoutType || '');
  
  // Effect for loading the pose detector model
  useEffect(() => {
    const loadModel = async () => {
      // Use MoveNet for better performance in browser
      const model = poseDetection.SupportedModels.MoveNet;
      const detector = await poseDetection.createDetector(model, {
        modelType: 'lightning',
      });
      
      setDetectorModel(detector);
      console.log('Pose detection model loaded');
    };
    
    loadModel().catch(console.error);
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);
  
  // Effect for saving the workout type
  useEffect(() => {
    if (workoutType) {
      detectedWorkout.current = workoutType;
      console.log(`Workout type set: ${workoutType}`);
    }
  }, [workoutType]);
  
  const detectPose = async () => {
    if (!videoElement || !detectorModel || !isDetecting) return;
    
    try {
      const videoPoses = await detectorModel.estimatePoses(videoElement);
      
      if (videoPoses && videoPoses.length > 0) {
        // Save pose data
        poses.current = videoPoses;
        const currentKeypoints = videoPoses[0].keypoints;
        
        // Keep a history of poses for analysis
        poseHistory.current.push([...videoPoses]);
        if (poseHistory.current.length > 30) { // Keep last 30 frames
          poseHistory.current.shift();
        }
        
        setKeypoints(currentKeypoints);
      }
    } catch (error) {
      console.error('Error in pose detection:', error);
    }
    
    // Continue the detection loop
    requestRef.current = requestAnimationFrame(detectPose);
  };
  
  const startDetection = () => {
    if (detectorModel && videoElement) {
      setIsDetecting(true);
      poseHistory.current = []; // Reset history when starting new detection
      requestRef.current = requestAnimationFrame(detectPose);
    }
  };
  
  const stopDetection = () => {
    setIsDetecting(false);
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
  };
  
  // This is simplified analysis logic; real-world app would be more sophisticated
  const analyzeForm = (): AnalysisResult => {
    let formScore = 0;
    const feedback = [];
    const goodPoints = [];
    const improvementAreas = [];
    
    // Based on the workout type, analyze the pose history
    if (detectedWorkout.current && poseHistory.current.length > 0) {
      const workoutName = detectedWorkout.current.toLowerCase();
      
      // Score calculation based on the detected workout
      if (workoutName.includes('squat')) {
        formScore = analyzeSquatForm();
      } else if (workoutName.includes('pushup') || workoutName.includes('push-up') || workoutName.includes('push up')) {
        formScore = analyzePushupForm();
      } else if (workoutName.includes('plank')) {
        formScore = analyzePlankForm();
      } else if (workoutName.includes('deadlift')) {
        formScore = analyzeDeadliftForm();
      } else if (workoutName.includes('bench') || workoutName.includes('press')) {
        formScore = analyzeChestPressForm();
      } else {
        // Default analysis for other workouts
        formScore = analyzeGeneralForm();
      }
      
      // Cap the score between 0-100
      formScore = Math.min(100, Math.max(0, formScore));
      
      // Generate feedback based on the score
      if (formScore > 90) {
        feedback.push(`Great ${detectedWorkout.current} form! Your technique is excellent.`);
        goodPoints.push('Excellent body alignment throughout the movement');
        goodPoints.push('Proper tempo and control of the exercise');
      } else if (formScore > 70) {
        feedback.push(`Good ${detectedWorkout.current} form. Some minor adjustments could help.`);
        goodPoints.push('Generally good body alignment');
        improvementAreas.push('Work on maintaining consistent form throughout each rep');
      } else {
        feedback.push(`Your ${detectedWorkout.current} form needs improvement. Focus on technique.`);
        improvementAreas.push('Focus on proper body alignment');
        improvementAreas.push('Control the movement throughout the entire range of motion');
      }
    }
    
    const result = {
      score: formScore,
      feedback,
      goodPoints,
      improvementAreas,
    };
    
    setAnalysisResult(result);
    return result;
  };
  
  // Example analysis function for squats
  const analyzeSquatForm = () => {
    // This is simplified - real app would have more detailed analysis
    let score = 80; // Start with a base score
    
    // Example of checking knee alignment during squat
    // Lower score if knees cave in or track incorrectly
    score -= Math.random() * 20; // Simplified for demo
    
    return score;
  };
  
  // Example analysis function for push-ups
  const analyzePushupForm = () => {
    let score = 85;
    // Check alignment, depth, etc.
    score -= Math.random() * 15; 
    return score;
  };
  
  // Example analysis function for planks
  const analyzePlankForm = () => {
    let score = 90;
    // Check spine alignment, hip position, etc.
    score -= Math.random() * 10;
    return score;
  };
  
  // Analysis for deadlifts
  const analyzeDeadliftForm = () => {
    let score = 85;
    // Check hip hinge, back alignment, etc.
    score -= Math.random() * 15;
    return score;
  };
  
  // Analysis for bench press and similar exercises
  const analyzeChestPressForm = () => {
    let score = 82;
    // Check bar path, wrist alignment, etc.
    score -= Math.random() * 12;
    return score;
  };
  
  // Generic analysis for other exercises
  const analyzeGeneralForm = () => {
    let score = 75;
    score -= Math.random() * 20;
    return score;
  };
  
  return {
    keypoints,
    isDetecting,
    startDetection,
    stopDetection,
    analyzeForm,
    analysisResult,
  };
};
