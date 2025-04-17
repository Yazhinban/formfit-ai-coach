
import React from 'react';
import { Activity } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="text-center py-8 text-muted-foreground">
      <Activity className="h-12 w-12 mx-auto mb-3 opacity-20" />
      <p>No progress data yet</p>
      <p className="text-sm">Add your first progress entry below</p>
    </div>
  );
};

export default EmptyState;
