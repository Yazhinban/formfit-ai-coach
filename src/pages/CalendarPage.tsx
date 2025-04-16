
import React from 'react';
import Header from '@/components/Header';
import StreakCalendar from '@/components/StreakCalendar';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { VideoIcon } from 'lucide-react';

interface StreakDay {
  date: Date;
  attended: boolean;
}

const CalendarPage = () => {
  const [streakDays, setStreakDays] = React.useState<StreakDay[]>([
    { date: new Date(Date.now() - 86400000 * 0), attended: true },
    { date: new Date(Date.now() - 86400000 * 1), attended: true },
    { date: new Date(Date.now() - 86400000 * 2), attended: true },
    { date: new Date(Date.now() - 86400000 * 3), attended: false },
    { date: new Date(Date.now() - 86400000 * 4), attended: true }
  ]);

  const handleAddStreakDay = (date: Date, attended: boolean) => {
    const existingIndex = streakDays.findIndex(day => 
      day.date.getFullYear() === date.getFullYear() &&
      day.date.getMonth() === date.getMonth() &&
      day.date.getDate() === date.getDate()
    );
    
    if (existingIndex >= 0) {
      const updatedDays = [...streakDays];
      updatedDays[existingIndex] = { date, attended };
      setStreakDays(updatedDays);
    } else {
      setStreakDays(prev => [...prev, { date, attended }]);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container max-w-7xl py-8 px-4 sm:px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Workout Calendar</h1>
            <p className="text-muted-foreground">Track your workout attendance and maintain your streak</p>
          </div>
          <Link to="/form-analyzer">
            <Button className="flex items-center gap-2" size="lg">
              <VideoIcon className="h-5 w-5" /> 
              Go to Form Analyzer
            </Button>
          </Link>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <StreakCalendar 
            streakDays={streakDays}
            onAddStreakDay={handleAddStreakDay}
          />
        </div>
      </main>
      
      <footer className="py-6 border-t">
        <div className="container max-w-7xl px-4 sm:px-6">
          <p className="text-center text-muted-foreground text-sm">
            FormFit AI Coach © {new Date().getFullYear()} | AI Powered Workout Analysis
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CalendarPage;
