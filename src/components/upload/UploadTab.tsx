
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import VideoInput from '@/components/VideoInput';

interface UploadTabProps {
  onVideoLoaded: (video: HTMLVideoElement, file: File | null) => void;
  videoElement: HTMLVideoElement | null;
  onNavigateToAnalyze: () => void;
}

const UploadTab: React.FC<UploadTabProps> = ({
  onVideoLoaded,
  videoElement,
  onNavigateToAnalyze,
}) => {
  return (
    <div>
      <VideoInput onVideoLoaded={onVideoLoaded} />
      
      <div className="mt-6 flex justify-end">
        <Button 
          onClick={onNavigateToAnalyze}
          disabled={!videoElement}
        >
          Next: Analyze Form <Check className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default UploadTab;
