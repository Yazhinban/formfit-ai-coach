
import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  UserRound, 
  CalendarDays, 
  Dumbbell, 
  ChevronRight, 
  VideoIcon, 
  TrendingUp, 
  ClipboardList, 
  PieChart,
  Apple 
} from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container max-w-7xl py-8 px-4 sm:px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">FormFit Dashboard</h1>
            <p className="text-muted-foreground">Your fitness journey at a glance</p>
          </div>
          <Link to="/form-analyzer">
            <Button className="flex items-center gap-2" size="lg">
              <VideoIcon className="h-5 w-5" /> 
              Go to Form Analyzer
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:bg-accent/50 transition-colors">
            <Link to="/personal-info" className="block h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserRound className="h-5 w-5 text-primary" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  View and manage your profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Edit your profile, goals, and preferences</p>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Link>
          </Card>
          
          <Card className="hover:bg-accent/50 transition-colors">
            <Link to="/workout-plan" className="block h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-primary" />
                  Weekly Workout Plan
                </CardTitle>
                <CardDescription>
                  Manage your workout schedule
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Schedule and track your weekly workouts</p>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Link>
          </Card>
          
          <Card className="hover:bg-accent/50 transition-colors">
            <Link to="/calendar" className="block h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  Calendar
                </CardTitle>
                <CardDescription>
                  Track your workout attendance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Maintain your workout streak and monitor consistency</p>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Link>
          </Card>
          
          <Card className="hover:bg-accent/50 transition-colors">
            <Link to="/progress" className="block h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Progress
                </CardTitle>
                <CardDescription>
                  Track your fitness journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Monitor your improvements and achievements</p>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Link>
          </Card>
          
          <Card className="hover:bg-accent/50 transition-colors">
            <Link to="/nutrition-tips" className="block h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Apple className="h-5 w-5 text-primary" />
                  Nutrition & Tips
                </CardTitle>
                <CardDescription>
                  Expert guidance for optimal results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Workout recommendations and nutrition advice</p>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Link>
          </Card>
          
          <Card className="hover:bg-accent/50 transition-colors">
            <Link to="/form-analyzer" className="block h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <VideoIcon className="h-5 w-5 text-primary" />
                  Form Analyzer
                </CardTitle>
                <CardDescription>
                  Get feedback on your exercise form
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Upload videos and receive AI-powered form analysis</p>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Link>
          </Card>
        </div>
        
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Dumbbell className="h-6 w-6 text-primary" />
            Welcome to FormFit AI
          </h2>
          <p className="text-muted-foreground mb-6">
            Your comprehensive fitness companion designed to help you train smarter, 
            track progress effectively, and achieve your fitness goals faster with 
            AI-powered form analysis and personalized recommendations.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/form-analyzer">
              <Button variant="default" className="gap-1">
                <VideoIcon className="h-4 w-4" /> 
                Try Form Analysis
              </Button>
            </Link>
            <Link to="/workout-plan">
              <Button variant="outline" className="gap-1">
                <ClipboardList className="h-4 w-4" /> 
                Plan Your Week
              </Button>
            </Link>
          </div>
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

export default Index;
