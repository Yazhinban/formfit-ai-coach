
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ProgressEntry } from './types';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface ProgressEntryFormProps {
  onAddEntry: (entry: Partial<ProgressEntry>) => void;
}

const ProgressEntryForm: React.FC<ProgressEntryFormProps> = ({ onAddEntry }) => {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [weight, setWeight] = useState<number | undefined>(undefined);
  const [workout, setWorkout] = useState<string>('');
  const [formScore, setFormScore] = useState<number | undefined>(undefined);
  const [exerciseType, setExerciseType] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onAddEntry({
      date,
      weight,
      workout,
      formScore,
      exerciseType,
      notes: notes.trim() ? notes : undefined
    });
    
    // Reset form
    setWeight(undefined);
    setWorkout('');
    setFormScore(undefined);
    setExerciseType('');
    setNotes('');
    setIsExpanded(false);
  };

  return (
    <div className="mt-6">
      {!isExpanded ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Button 
            onClick={() => setIsExpanded(true)} 
            className="w-full flex items-center justify-center gap-2 group"
            variant="outline"
          >
            <Plus className="h-4 w-4 group-hover:scale-125 transition-transform" />
            <span>Add New Entry</span>
          </Button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="bg-muted/20 rounded-lg p-4 border"
        >
          <h3 className="font-medium mb-4">Add Progress Entry</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input 
                  type="date" 
                  id="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (lbs)</Label>
                <Input 
                  type="number" 
                  id="weight" 
                  placeholder="Enter weight" 
                  value={weight || ''} 
                  onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="workout">Workout Type</Label>
                <Input 
                  id="workout" 
                  placeholder="e.g. Push Day, Cardio, etc." 
                  value={workout} 
                  onChange={(e) => setWorkout(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="formScore">Form Score (0-100)</Label>
                <Input 
                  type="number"
                  min="0"
                  max="100" 
                  id="formScore" 
                  placeholder="Enter form score" 
                  value={formScore || ''} 
                  onChange={(e) => setFormScore(e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="exerciseType">Exercise Analyzed</Label>
                <Input 
                  id="exerciseType" 
                  placeholder="e.g. Squat, Deadlift, etc." 
                  value={exerciseType} 
                  onChange={(e) => setExerciseType(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea 
                id="notes" 
                placeholder="Add any additional notes..." 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setIsExpanded(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Entry</Button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default ProgressEntryForm;
