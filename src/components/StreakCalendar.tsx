
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarCheck, CalendarDays, CalendarX, Trophy, Clock } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface StreakDay {
  date: Date;
  attended: boolean;
}

interface StreakCalendarProps {
  streakDays: StreakDay[];
  onAddStreakDay: (date: Date, attended: boolean) => void;
}

const StreakCalendar: React.FC<StreakCalendarProps> = ({ 
  streakDays, 
  onAddStreakDay
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const getAttendanceForDate = (date: Date): boolean | undefined => {
    const found = streakDays.find(day => isSameDay(new Date(day.date), date));
    return found?.attended;
  };

  const handleAddAttendance = (attended: boolean) => {
    if (selectedDate) {
      onAddStreakDay(selectedDate, attended);
    }
  };

  const currentStreak = React.useMemo(() => {
    if (!streakDays.length) return 0;
    
    // Sort by date descending
    const sortedDays = [...streakDays]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    let streak = 0;
    for (const day of sortedDays) {
      if (day.attended) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }, [streakDays]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          Calendar
        </CardTitle>
        <CardDescription>
          Track your workout attendance and maintain your streak
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-3 rounded-full">
              <Trophy className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Streak</p>
              <p className="text-2xl font-bold">{currentStreak} days</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs">Attended</span>
            </div>
            <div className="flex items-center gap-1 ml-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-xs">Missed</span>
            </div>
          </div>
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarDays className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className={cn("p-3 pointer-events-auto")}
              modifiers={{
                attended: streakDays
                  .filter(day => day.attended)
                  .map(day => new Date(day.date)),
                missed: streakDays
                  .filter(day => !day.attended)
                  .map(day => new Date(day.date)),
              }}
              modifiersStyles={{
                attended: { 
                  backgroundColor: 'rgba(34, 197, 94, 0.2)', 
                  color: 'rgb(22, 163, 74)',
                  fontWeight: 'bold'
                },
                missed: { 
                  backgroundColor: 'rgba(239, 68, 68, 0.2)', 
                  color: 'rgb(220, 38, 38)',
                  fontWeight: 'bold'
                },
              }}
            />
          </PopoverContent>
        </Popover>

        <div className="space-y-2 pt-2">
          <p className="text-sm font-medium">Mark attendance for {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'selected date'}:</p>
          
          <div className="flex gap-2">
            <Button 
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={() => handleAddAttendance(true)}
            >
              <CalendarCheck className="h-4 w-4 mr-2" />
              Attended
            </Button>
            <Button 
              className="flex-1 bg-red-600 hover:bg-red-700"
              onClick={() => handleAddAttendance(false)}
            >
              <CalendarX className="h-4 w-4 mr-2" />
              Missed
            </Button>
          </div>
        </div>
        
        <div className="space-y-2 pt-2">
          <p className="text-sm font-medium">Recent Activity:</p>
          <div className="space-y-2">
            {streakDays
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 5)
              .map((day, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${day.attended ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span>{format(new Date(day.date), 'MMM d, yyyy')}</span>
                  </div>
                  <Badge variant={day.attended ? "default" : "destructive"}>
                    {day.attended ? 'Attended' : 'Missed'}
                  </Badge>
                </div>
              ))}
            
            {streakDays.length === 0 && (
              <p className="text-sm text-muted-foreground">No activity recorded yet</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StreakCalendar;
