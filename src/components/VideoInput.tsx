
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, Camera, Video } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface VideoInputProps {
  onVideoLoaded: (videoElement: HTMLVideoElement, file: File | null) => void;
}

const VideoInput = ({ onVideoLoaded }: VideoInputProps) => {
  const [recordingState, setRecordingState] = useState<'idle' | 'recording' | 'recorded'>('idle');
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isLiveMode, setIsLiveMode] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

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
  };

  const startRecording = () => {
    if (!streamRef.current) return;
    
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
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setRecordingState('recorded');
    }
  };

  return (
    <div className="space-y-4">
      <div className="video-container bg-muted border border-border">
        {!videoSrc && !isLiveMode && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Upload size={48} className="text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Upload a video or use your camera</p>
          </div>
        )}
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src={videoSrc || undefined}
          autoPlay={isLiveMode}
          playsInline
          muted={isLiveMode}
          loop={!isLiveMode}
          controls={!isLiveMode && !!videoSrc}
        />
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          className="flex-1"
          disabled={recordingState === 'recording'}
        >
          <Upload className="mr-2 h-4 w-4" /> Upload Video
        </Button>
        
        {!isLiveMode ? (
          <Button
            onClick={startCameraStream}
            variant="outline"
            className="flex-1"
            disabled={recordingState === 'recording'}
          >
            <Camera className="mr-2 h-4 w-4" /> Use Camera
          </Button>
        ) : recordingState === 'idle' ? (
          <Button
            onClick={startRecording}
            variant="default"
            className="flex-1 bg-primary"
          >
            <Video className="mr-2 h-4 w-4" /> Start Recording
          </Button>
        ) : (
          <Button
            onClick={stopRecording}
            variant="destructive"
            className="flex-1"
          >
            <span className="mr-2 h-2 w-2 rounded-full bg-current animate-pulse" /> Stop Recording
          </Button>
        )}
        
        {isLiveMode && (
          <Button
            onClick={stopCameraStream}
            variant="outline"
            className="flex-1"
            disabled={recordingState === 'recording'}
          >
            Exit Camera
          </Button>
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
