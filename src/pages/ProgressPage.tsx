
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import Header from '@/components/Header';
import ProgressTracking from '@/components/ProgressTracking';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { VideoIcon } from 'lucide-react';
import { ProgressEntry } from '@/components/progress/types';
import { motion } from 'framer-motion';

const ProgressPage = () => {
  const [progressData, setProgressData] = React.useState<ProgressEntry[]>([
    {
      id: uuidv4(),
      date: new Date(Date.now() - 86400000 * 0).toISOString().split('T')[0],
      weight: 175,
      workout: "Push Day",
      formScore: 85,
      exerciseType: "Push-up"
    },
    {
      id: uuidv4(),
      date: new Date(Date.now() - 86400000 * 7).toISOString().split('T')[0],
      weight: 178,
      workout: "Pull Day",
      formScore: 78,
      exerciseType: "Pull-up"
    },
    {
      id: uuidv4(),
      date: new Date(Date.now() - 86400000 * 14).toISOString().split('T')[0],
      weight: 180,
      workout: "Leg Day",
      formScore: 72,
      exerciseType: "Squat"
    },
    {
      id: uuidv4(),
      date: new Date(Date.now() - 86400000 * 21).toISOString().split('T')[0],
      weight: 182,
      workout: "Rest Day",
      formScore: 65,
      exerciseType: "Deadlift"
    }
  ]);

  const handleAddProgressEntry = (entry: Partial<ProgressEntry>) => {
    const newEntry: ProgressEntry = {
      id: uuidv4(),
      date: entry.date || new Date().toISOString().split('T')[0],
      weight: entry.weight,
      workout: entry.workout,
      formScore: entry.formScore,
      exerciseType: entry.exerciseType,
      notes: entry.notes
    };
    
    setProgressData(prev => [...prev, newEntry]);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-background flex flex-col"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Header />
      
      <motion.main 
        className="flex-1 container max-w-7xl py-8 px-4 sm:px-6"
        variants={itemVariants}
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Progress Tracking</h1>
            <p className="text-muted-foreground">Monitor your fitness improvements over time</p>
          </div>
          <Link to="/form-analyzer">
            <Button className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300" size="lg">
              <VideoIcon className="h-5 w-5" /> 
              Go to Form Analyzer
            </Button>
          </Link>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <ProgressTracking
            progressData={progressData}
            onAddProgress={handleAddProgressEntry}
          />
        </div>
      </motion.main>
      
      <footer className="py-6 border-t">
        <div className="container max-w-7xl px-4 sm:px-6">
          <p className="text-center text-muted-foreground text-sm">
            FormFit AI Coach © {new Date().getFullYear()} | AI Powered Workout Analysis
          </p>
        </div>
      </footer>
    </motion.div>
  );
};

export default ProgressPage;
