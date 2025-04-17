
import React from 'react';
import { Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const EmptyState: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center py-8 text-muted-foreground"
    >
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 2, -2, 0]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        <Activity className="h-12 w-12 mx-auto mb-3 opacity-20" />
      </motion.div>
      <p className="text-lg font-medium">No progress data yet</p>
      <p className="text-sm">Add your first progress entry below</p>
    </motion.div>
  );
};

export default EmptyState;
