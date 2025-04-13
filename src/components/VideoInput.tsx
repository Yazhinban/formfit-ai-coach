
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, Camera, Video, Pause, RotateCcw, Timer, X, Check, Gallery } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface VideoInputProps {
  onVideoLoaded: (videoElement: HTMLVideoElement, file: File | null) => void;
}

const VideoInput = ({ onVideoLoaded }: VideoInputProps) => {
  const [recordingState, setRecordingState] = useState<'idle' | 'recording' | 'recorded' | 'preview'>('idle');
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [timerValue, setTimerValue] = useState<number | null>(null);
  const [countDown, setCountDown] = useState<number | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const videoUrl = URL.createObjectURL(file);
    setVideoSrc(videoUrl);
    
    if (videoRef.current) {
      videoRef.current.onloadedmetadata = () => {
        if (videoRef.current) {
          onVideoLoaded(videoRef.current, file);
        }
      };
    }
    
    stopCameraStream();
    setIsLiveMode(false);
  };

  const startCameraStream = async () => {
    try {
      const constraints = {
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            onVideoLoaded(videoRef.current, null);
          }
        };
      }
      
      setIsLiveMode(true);
      setVideoSrc(null);
      setRecordingState('preview');
      
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Camera Access Error",
        description: "Unable to access your camera. Please check your permissions.",
        variant: "destructive"
      });
    }
  };

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    
    setIsLiveMode(false);
    setRecordingState('idle');
    
    // Clear all timers
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    
    setTimerValue(null);
    setCountDown(null);
    setRecordingTime(0);
  };

  const prepareRecording = () => {
    setRecordingState('preview');
    setTimerValue(null);
    setCountDown(null);
  };

  const startRecording = (withCountdown: boolean = false) => {
    if (!streamRef.current) return;
    
    if (withCountdown && countDown === null) {
      setCountDown(3);
      return;
    }
    
    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(streamRef.current);
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const videoUrl = URL.createObjectURL(blob);
      setVideoSrc(videoUrl);
      
      // Create a synthetic file from the blob
      const file = new File([blob], "recorded-workout.webm", { type: 'video/webm' });
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
        videoRef.current.src = videoUrl;
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            onVideoLoaded(videoRef.current, file);
          }
        };
      }
    };
    
    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setRecordingState('recording');
    setRecordingTime(0);
    
    // Start the recording timer
    recordingTimerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    
    // If timer is set, automatically stop recording after specified time
    if (timerValue) {
      timerRef.current = setTimeout(() => {
        stopRecording();
      }, timerValue * 1000);
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setRecordingState('recorded');
      
      // Clear the recording timer
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      
      // Clear the timer if it's set
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }
  };
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle countdown timer
  useEffect(() => {
    if (countDown !== null && countDown > 0) {
      const timer = setTimeout(() => {
        setCountDown(countDown - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (countDown === 0) {
      startRecording(false);
    }
  }, [countDown]);

  return (
    <div className="space-y-4">
      <div className="video-container bg-muted border border-border relative">
        {!videoSrc && !isLiveMode && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Upload size={48} className="text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Upload a video or use your camera</p>
          </div>
        )}
        
        {countDown !== null && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
            <div className="text-7xl font-bold text-white animate-pulse-glow">
              {countDown}
            </div>
          </div>
        )}
        
        {recordingState === 'recording' && (
          <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full flex items-center">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse mr-2"></span>
            <span>{formatTime(recordingTime)}</span>
          </div>
        )}
        
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src={videoSrc || undefined}
          autoPlay={isLiveMode}
          playsInline
          muted={isLiveMode}
          loop={!isLiveMode && !!videoSrc}
          controls={!isLiveMode && !!videoSrc}
        />
      </div>
      
      <div className="flex flex-wrap gap-2">
        {recordingState === 'preview' ? (
          <>
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2">
              <Button
                onClick={() => startRecording(false)}
                variant="default"
                className="flex-1 bg-primary"
              >
                <Video className="mr-2 h-4 w-4" /> Record Now
              </Button>
              
              <Button
                onClick={() => startRecording(true)}
                variant="outline"
                className="flex-1"
              >
                <RotateCcw className="mr-2 h-4 w-4" /> With Countdown
              </Button>
              
              <Button
                onClick={() => setTimerValue(30)}
                variant={timerValue === 30 ? "secondary" : "outline"}
                className="flex-1"
              >
                <Timer className="mr-2 h-4 w-4" /> 30s
              </Button>
              
              <Button
                onClick={() => setTimerValue(60)}
                variant={timerValue === 60 ? "secondary" : "outline"}
                className="flex-1"
              >
                <Timer className="mr-2 h-4 w-4" /> 60s
              </Button>
            </div>
            
            <Button
              onClick={stopCameraStream}
              variant="outline"
              className="w-full sm:w-auto"
            >
              <X className="mr-2 h-4 w-4" /> Exit Camera
            </Button>
          </>
        ) : recordingState === 'recording' ? (
          <Button
            onClick={stopRecording}
            variant="destructive"
            className="w-full"
          >
            <Pause className="mr-2 h-4 w-4" /> Stop Recording
          </Button>
        ) : recordingState === 'recorded' ? (
          <>
            <Button
              onClick={prepareRecording}
              variant="outline"
              className="flex-1"
            >
              <Camera className="mr-2 h-4 w-4" /> Record Again
            </Button>
            
            <Button
              onClick={stopCameraStream}
              variant="outline"
              className="flex-1"
            >
              <X className="mr-2 h-4 w-4" /> Exit Camera
            </Button>
            
            <Button
              variant="secondary"
              className="w-full sm:w-auto mt-2 sm:mt-0"
            >
              <Check className="mr-2 h-4 w-4" /> Use This Video
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="flex-1"
            >
              <Upload className="mr-2 h-4 w-4" /> Upload Video
            </Button>
            
            <Button
              onClick={startCameraStream}
              variant="outline"
              className="flex-1"
            >
              <Camera className="mr-2 h-4 w-4" /> Use Camera
            </Button>
            
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => toast({
                title: "Gallery access",
                description: "Opening your device gallery...",
              })}
            >
              <Gallery className="mr-2 h-4 w-4" /> Gallery
            </Button>
          </>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};

export default VideoInput;
