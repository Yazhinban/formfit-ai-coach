
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProgressEntry } from './types';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface ProgressEntryFormProps {
  onAddEntry: (entry: Partial<ProgressEntry>) => void;
}

const exerciseOptions = [
  'Squat',
  'Deadlift',
  'Bench Press',
  'Push-up',
  'Pull-up',
  'Overhead Press',
  'Barbell Row',
  'Lunges',
  'Plank',
  'Other'
];

const ProgressEntryForm: React.FC<ProgressEntryFormProps> = ({ onAddEntry }) => {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [weight, setWeight] = useState<number | undefined>(undefined);
  const [workout, setWorkout] = useState<string>('');
  const [exerciseType, setExerciseType] = useState<string>('');
  const [formScore, setFormScore] = useState<number | undefined>(undefined);
  const [equipmentWeight, setEquipmentWeight] = useState<number | undefined>(undefined);
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
  const [equipmentUnit, setEquipmentUnit] = useState<'kg' | 'lbs'>('kg');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onAddEntry({
      date,
      weight: weight ? (weightUnit === 'kg' ? weight : weight / 2.20462) : undefined,
      workout,
      exerciseType,
      formScore,
      equipmentWeight: equipmentWeight ? (equipmentUnit === 'kg' ? equipmentWeight : equipmentWeight / 2.20462) : undefined,
    });
    
    // Reset form
    setWeight(undefined);
    setWorkout('');
    setExerciseType('');
    setFormScore(undefined);
    setEquipmentWeight(undefined);
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
                <Label htmlFor="weight">Body Weight</Label>
                <div className="flex gap-2">
                  <Input 
                    type="number" 
                    id="weight" 
                    placeholder="Enter weight" 
                    value={weight || ''} 
                    onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : undefined)}
                    className="flex-1"
                  />
                  <Select value={weightUnit} onValueChange={(value: 'kg' | 'lbs') => setWeightUnit(value)}>
                    <SelectTrigger className="w-[80px]">
                      <SelectValue>{weightUnit.toUpperCase()}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">KG</SelectItem>
                      <SelectItem value="lbs">LBS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                <Label htmlFor="exercise">Exercise</Label>
                <Select value={exerciseType} onValueChange={setExerciseType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select exercise" />
                  </SelectTrigger>
                  <SelectContent>
                    {exerciseOptions.map((exercise) => (
                      <SelectItem key={exercise} value={exercise.toLowerCase()}>
                        {exercise}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="equipmentWeight">Equipment Weight</Label>
                <div className="flex gap-2">
                  <Input 
                    type="number"
                    id="equipmentWeight" 
                    placeholder="Enter weight" 
                    value={equipmentWeight || ''} 
                    onChange={(e) => setEquipmentWeight(e.target.value ? Number(e.target.value) : undefined)}
                    className="flex-1"
                  />
                  <Select value={equipmentUnit} onValueChange={(value: 'kg' | 'lbs') => setEquipmentUnit(value)}>
                    <SelectTrigger className="w-[80px]">
                      <SelectValue>{equipmentUnit.toUpperCase()}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">KG</SelectItem>
                      <SelectItem value="lbs">LBS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="formScore">Form Score</Label>
                <Input 
                  type="number"
                  id="formScore"
                  placeholder="Enter form score (0-100)"
                  value={formScore || ''}
                  onChange={(e) => {
                    const value = e.target.value ? Number(e.target.value) : undefined;
                    if (value === undefined || (value >= 0 && value <= 100)) {
                      setFormScore(value);
                    }
                  }}
                  min="0"
                  max="100"
                />
              </div>
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
