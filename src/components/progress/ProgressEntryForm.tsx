
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { ProgressEntry } from './types';

interface ProgressEntryFormProps {
  onAddEntry: (entry: Partial<ProgressEntry>) => void;
}

const ProgressEntryForm: React.FC<ProgressEntryFormProps> = ({ onAddEntry }) => {
  const [newEntry, setNewEntry] = useState<Partial<ProgressEntry>>({
    date: new Date().toISOString().split('T')[0],
    weight: undefined,
    workout: '',
    notes: ''
  });

  const handleInputChange = (field: keyof ProgressEntry, value: string | number) => {
    setNewEntry(prev => ({ ...prev, [field]: value }));
  };

  const handleAddEntry = () => {
    onAddEntry(newEntry);
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      weight: undefined,
      workout: '',
      notes: ''
    });
  };

  return (
    <div className="border-t pt-4 mt-6">
      <h4 className="font-medium mb-3">Add New Progress Entry</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={newEntry.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="weight">Weight (kg/lbs)</Label>
          <Input
            id="weight"
            type="number"
            placeholder="Your weight"
            value={newEntry.weight || ''}
            onChange={(e) => handleInputChange('weight', parseFloat(e.target.value))}
          />
        </div>
      </div>
      
      <div className="space-y-2 mt-3">
        <Label htmlFor="workout">Workout Completed</Label>
        <Input
          id="workout"
          placeholder="e.g., Push Day, 5k Run, Yoga"
          value={newEntry.workout || ''}
          onChange={(e) => handleInputChange('workout', e.target.value)}
        />
      </div>
      
      <div className="space-y-2 mt-3">
        <Label htmlFor="notes">Notes</Label>
        <Input
          id="notes"
          placeholder="Any additional notes about your progress"
          value={newEntry.notes || ''}
          onChange={(e) => handleInputChange('notes', e.target.value)}
        />
      </div>
      
      <Button 
        onClick={handleAddEntry} 
        className="w-full mt-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300 animate-fade-in"
      >
        <Plus className="h-4 w-4 mr-2" /> Add Progress Entry
      </Button>
    </div>
  );
};

export default ProgressEntryForm;
