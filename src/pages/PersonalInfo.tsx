
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Link } from 'react-router-dom';
import { VideoIcon, HeartPulse, Clock, Siren, Apple, Gauge } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const PersonalInfo = () => {
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    age: "",
    height: "",
    weight: "",
    diet: "",
    fitnessGoals: "",
    preferredWorkoutTimes: "",
    injuries: "",
    nutritionPreferences: "",
    experienceLevel: ""
  });

  const handlePersonalInfoChange = (field: string, value: string) => {
    setPersonalInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = () => {
    toast({
      title: "Profile Saved",
      description: "Your personal information has been saved successfully.",
    });
  };

  const experienceLevels = [
    "Beginner",
    "Intermediate",
    "Advanced",
    "Professional",
    "Athletic",
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container max-w-7xl py-8 px-4 sm:px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Personal Information</h1>
            <p className="text-muted-foreground">Update your profile details</p>
          </div>
          <Link to="/form-analyzer">
            <Button className="flex items-center gap-2" size="lg">
              <VideoIcon className="h-5 w-5" /> 
              Go to Form Analyzer
            </Button>
          </Link>
        </div>
        
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader className="pb-3">
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>
              Your profile information helps us personalize workout recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  value={personalInfo.name} 
                  onChange={(e) => handlePersonalInfoChange('name', e.target.value)} 
                  placeholder="Your name"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input 
                    id="age" 
                    value={personalInfo.age} 
                    onChange={(e) => handlePersonalInfoChange('age', e.target.value)} 
                    placeholder="Age"
                  />
                </div>
                <div>
                  <Label htmlFor="height">Height</Label>
                  <Input 
                    id="height" 
                    value={personalInfo.height} 
                    onChange={(e) => handlePersonalInfoChange('height', e.target.value)} 
                    placeholder="cm/ft"
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Weight</Label>
                  <Input 
                    id="weight" 
                    value={personalInfo.weight} 
                    onChange={(e) => handlePersonalInfoChange('weight', e.target.value)} 
                    placeholder="kg/lbs"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="fitnessGoals" className="flex items-center gap-2">
                  <HeartPulse className="h-4 w-4" /> Fitness Goals
                </Label>
                <Textarea
                  id="fitnessGoals"
                  value={personalInfo.fitnessGoals}
                  onChange={(e) => handlePersonalInfoChange('fitnessGoals', e.target.value)}
                  placeholder="E.g., lose weight, build muscle, improve endurance"
                  className="min-h-[60px]"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="preferredWorkoutTimes" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Preferred Workout Times
                </Label>
                <Select
                  value={personalInfo.preferredWorkoutTimes}
                  onValueChange={(value) => handlePersonalInfoChange('preferredWorkoutTimes', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="When do you prefer to workout?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning</SelectItem>
                    <SelectItem value="afternoon">Afternoon</SelectItem>
                    <SelectItem value="evening">Evening</SelectItem>
                    <SelectItem value="night">Night</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="injuries" className="flex items-center gap-2">
                  <Siren className="h-4 w-4" /> Injuries or Limitations
                </Label>
                <Textarea
                  id="injuries"
                  value={personalInfo.injuries}
                  onChange={(e) => handlePersonalInfoChange('injuries', e.target.value)}
                  placeholder="Any injuries or physical limitations we should know about?"
                  className="min-h-[60px]"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="nutritionPreferences" className="flex items-center gap-2">
                  <Apple className="h-4 w-4" /> Nutrition Preferences
                </Label>
                <Textarea
                  id="nutritionPreferences"
                  value={personalInfo.nutritionPreferences}
                  onChange={(e) => handlePersonalInfoChange('nutritionPreferences', e.target.value)}
                  placeholder="E.g., Vegetarian, High-protein, Low-carb, etc."
                  className="min-h-[60px]"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="experienceLevel" className="flex items-center gap-2">
                  <Gauge className="h-4 w-4" /> Experience Level
                </Label>
                <Select
                  value={personalInfo.experienceLevel}
                  onValueChange={(value) => handlePersonalInfoChange('experienceLevel', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="What's your fitness experience level?" />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceLevels.map((level) => (
                      <SelectItem key={level} value={level.toLowerCase()}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button className="mt-4" onClick={handleSaveProfile}>Save Profile</Button>
            </div>
          </CardContent>
        </Card>
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

export default PersonalInfo;
