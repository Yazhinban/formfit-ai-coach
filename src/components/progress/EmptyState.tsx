
import React from 'react';
import { Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const EmptyState: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center py-10 px-6 bg-gradient-to-b from-background to-muted/30 rounded-lg shadow-sm"
    >
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 3, -3, 0]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="inline-block bg-background/80 p-5 rounded-full shadow-inner"
      >
        <Activity className="h-14 w-14 mx-auto text-primary opacity-60" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h3 className="text-xl font-medium mt-5 mb-2">No progress data yet</h3>
        <p className="text-muted-foreground">Track your fitness journey by adding your first entry below</p>
      </motion.div>
    </motion.div>
  );
};

export default EmptyState;
