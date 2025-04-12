
import React, { useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';

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

interface PoseSegment {
  from: number;
  to: number;
}

// Skeleton segments representing connections between keypoints
const POSE_SEGMENTS: PoseSegment[] = [
  { from: 5, to: 7 }, // Left shoulder to left elbow
  { from: 7, to: 9 }, // Left elbow to left wrist
  { from: 6, to: 8 }, // Right shoulder to right elbow
  { from: 8, to: 10 }, // Right elbow to right wrist
  { from: 5, to: 6 }, // Left shoulder to right shoulder
  { from: 5, to: 11 }, // Left shoulder to left hip
  { from: 6, to: 12 }, // Right shoulder to right hip
  { from: 11, to: 12 }, // Left hip to right hip
  { from: 11, to: 13 }, // Left hip to left knee
  { from: 13, to: 15 }, // Left knee to left ankle
  { from: 12, to: 14 }, // Right hip to right knee
  { from: 14, to: 16 }, // Right knee to right ankle
];

interface PoseAnalysisProps {
  videoElement: HTMLVideoElement | null;
  keypoints: PoseKeypoint[];
  issues: { part: string; issue: string }[];
}

const PoseAnalysis: React.FC<PoseAnalysisProps> = ({ videoElement, keypoints, issues }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  
  // Draw pose skeleton on the overlay
  useEffect(() => {
    if (!overlayRef.current || !keypoints.length || !videoElement) return;
    
    const overlay = overlayRef.current;
    const container = overlay.parentElement;
    
    if (!container) return;
    
    // Clear any existing elements
    while (overlay.firstChild) {
      overlay.removeChild(overlay.firstChild);
    }
    
    // Get the dimensions of the container
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    
    // Scale factor for keypoints
    const scaleX = containerWidth / videoElement.videoWidth;
    const scaleY = containerHeight / videoElement.videoHeight;
    
    // Add keypoints
    keypoints.forEach((keypoint, index) => {
      if (keypoint.score > 0.3) { // Only show confident keypoints
        const { x, y } = keypoint.position;
        
        // Scale the coordinates to match the container size
        const scaledX = x * scaleX;
        const scaledY = y * scaleY;
        
        const point = document.createElement('div');
        point.className = 'pose-keypoint';
        point.style.left = `${scaledX}px`;
        point.style.top = `${scaledY}px`;
        
        // Highlight issues
        const hasIssue = issues.some(issue => issue.part === keypoint.part);
        if (hasIssue) {
          point.classList.add('bg-destructive');
          point.classList.add('animate-pulse-glow');
        }
        
        overlay.appendChild(point);
      }
    });
    
    // Add segments
    POSE_SEGMENTS.forEach(segment => {
      const from = keypoints[segment.from];
      const to = keypoints[segment.to];
      
      // Only draw if both points are confident
      if (from && to && from.score > 0.3 && to.score > 0.3) {
        const fromX = from.position.x * scaleX;
        const fromY = from.position.y * scaleY;
        const toX = to.position.x * scaleX;
        const toY = to.position.y * scaleY;
        
        // Calculate length and angle
        const length = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
        const angle = Math.atan2(toY - fromY, toX - fromX) * (180 / Math.PI);
        
        const segment = document.createElement('div');
        segment.className = 'pose-segment';
        segment.style.width = `${length}px`;
        segment.style.left = `${fromX}px`;
        segment.style.top = `${fromY}px`;
        segment.style.transform = `rotate(${angle}deg)`;
        
        // Highlight segments connected to problematic parts
        const hasIssue = issues.some(issue => 
          issue.part === from.part || issue.part === to.part
        );
        
        if (hasIssue) {
          segment.classList.add('bg-destructive');
        }
        
        overlay.appendChild(segment);
      }
    });
    
  }, [keypoints, videoElement, issues]);
  
  return (
    <div className="w-full relative">
      <div ref={overlayRef} className="absolute inset-0 z-10 pointer-events-none" />
    </div>
  );
};

export default PoseAnalysis;
