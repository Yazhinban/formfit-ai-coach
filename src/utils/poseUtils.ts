
// Utility functions for pose analysis
// In a production app, this would contain algorithms for form checking

// Calculate angle between three points
export const calculateAngle = (
  p1: { x: number, y: number },
  p2: { x: number, y: number },
  p3: { x: number, y: number }
): number => {
  const radians = Math.atan2(p3.y - p2.y, p3.x - p2.x) - 
                 Math.atan2(p1.y - p2.y, p1.x - p2.x);
  let angle = Math.abs(radians * 180.0 / Math.PI);
  
  if (angle > 180.0) {
    angle = 360.0 - angle;
  }
  
  return angle;
};

// Check if a pose is symmetric (left and right sides are balanced)
export const checkSymmetry = (
  leftKeypoint: { x: number, y: number },
  rightKeypoint: { x: number, y: number },
  midpoint: { x: number, y: number },
  threshold: number = 0.1
): boolean => {
  const leftDistance = Math.sqrt(
    Math.pow(leftKeypoint.x - midpoint.x, 2) + 
    Math.pow(leftKeypoint.y - midpoint.y, 2)
  );
  
  const rightDistance = Math.sqrt(
    Math.pow(rightKeypoint.x - midpoint.x, 2) + 
    Math.pow(rightKeypoint.y - midpoint.y, 2)
  );
  
  const difference = Math.abs(leftDistance - rightDistance);
  const average = (leftDistance + rightDistance) / 2;
  
  return difference / average < threshold;
};

// Map keypoint indices to body parts
export const keypointMapping: Record<string, number> = {
  nose: 0,
  leftEye: 1,
  rightEye: 2,
  leftEar: 3,
  rightEar: 4,
  leftShoulder: 5,
  rightShoulder: 6,
  leftElbow: 7,
  rightElbow: 8,
  leftWrist: 9,
  rightWrist: 10,
  leftHip: 11,
  rightHip: 12,
  leftKnee: 13,
  rightKnee: 14,
  leftAnkle: 15,
  rightAnkle: 16,
};

// Function to detect if knees are caving in during a squat
export const checkKneeCaving = (
  keypoints: any[], // Replace with your pose detection model's format
  hipWidth: number  // baseline measurement
): boolean => {
  const leftKnee = keypoints[keypointMapping.leftKnee];
  const rightKnee = keypoints[keypointMapping.rightKnee];
  const leftAnkle = keypoints[keypointMapping.leftAnkle];
  const rightAnkle = keypoints[keypointMapping.rightAnkle];
  
  // Calculate knee width and ankle width
  const kneeWidth = Math.abs(leftKnee.position.x - rightKnee.position.x);
  const ankleWidth = Math.abs(leftAnkle.position.x - rightAnkle.position.x);
  
  // If knees are significantly closer than ankles relative to hip width,
  // it may indicate knee caving
  return kneeWidth < ankleWidth * 0.8;
};

// Standard angle ranges for common exercises
export const exerciseAngleRanges = {
  squat: {
    knees: { min: 80, max: 120 }, // Knee angle at bottom position
    hips: { min: 70, max: 110 },  // Hip angle at bottom position
    ankles: { min: 60, max: 90 }, // Ankle dorsiflexion
  },
  deadlift: {
    hips: { min: 45, max: 90 },   // Hip hinge angle
    knees: { min: 140, max: 170 }, // Slight knee bend
    back: { min: 160, max: 180 },  // Straight back
  },
  plank: {
    shoulders: { min: 80, max: 100 }, // Shoulder position
    hips: { min: 170, max: 180 },     // Hip alignment (straight)
  }
};
