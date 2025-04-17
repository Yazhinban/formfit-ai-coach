
import React from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChevronRight, VideoIcon, Apple, UtensilsCrossed, Coffee, Salad, Scale, Leaf, Wind, Timer, BarChart, Flame, Heart, Award, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

const NutritionTips = () => {
  const workoutRecommendations = [
    {
      title: "Focus on compound exercises",
      description: "Compound exercises like squats, deadlifts, and pull-ups work multiple muscle groups, maximizing workout efficiency.",
      icon: <Flame className="h-5 w-5 text-primary" />
    },
    {
      title: "Proper form over heavy weights",
      description: "Always prioritize using correct form over lifting heavier weights. This prevents injury and ensures muscle engagement.",
      icon: <Scale className="h-5 w-5 text-primary" />
    },
    {
      title: "Include rest days",
      description: "Rest days are essential for muscle recovery and growth. Aim for 1-2 rest days per week.",
      icon: <Wind className="h-5 w-5 text-primary" />
    },
    {
      title: "Progressive overload",
      description: "Gradually increase weight, frequency, or reps to continuously challenge your muscles.",
      icon: <BarChart className="h-5 w-5 text-primary" />
    },
    {
      title: "Timed workouts",
      description: "Keep your workouts to 45-60 minutes to maintain intensity and prevent cortisol spikes.",
      icon: <Timer className="h-5 w-5 text-primary" />
    }
  ];
  
  const nutritionTips = [
    {
      title: "Protein intake",
      description: "Aim for 0.8-1g of protein per pound of bodyweight daily to support muscle growth and recovery.",
      icon: <UtensilsCrossed className="h-5 w-5 text-primary" />
    },
    {
      title: "Hydration",
      description: "Drink at least 8 glasses of water daily. Increase intake during intense workouts or hot weather.",
      icon: <Coffee className="h-5 w-5 text-primary" />
    },
    {
      title: "Balanced macros",
      description: "Balance your macronutrients (proteins, carbs, fats) based on your specific fitness goals.",
      icon: <Scale className="h-5 w-5 text-primary" />
    },
    {
      title: "Meal timing",
      description: "Time your carbohydrates around workouts and consider protein intake within 30 minutes post-workout.",
      icon: <Timer className="h-5 w-5 text-primary" />
    },
    {
      title: "Whole foods focus",
      description: "Prioritize whole, unprocessed foods rich in micronutrients to fuel performance and recovery.",
      icon: <Apple className="h-5 w-5 text-primary" />
    },
    {
      title: "Vegetable intake",
      description: "Aim for 5+ servings of vegetables daily to ensure adequate micronutrient and fiber intake.",
      icon: <Salad className="h-5 w-5 text-primary" />
    },
    {
      title: "Anti-inflammatory foods",
      description: "Include foods rich in omega-3s and antioxidants to reduce exercise-induced inflammation.",
      icon: <Leaf className="h-5 w-5 text-primary" />
    }
  ];

  // Additional success tips for enhanced UI
  const successTips = [
    {
      title: "Consistency is key",
      description: "Regular workouts, even shorter ones, are more effective than occasional intense sessions.",
      icon: <Award className="h-5 w-5 text-primary" />
    },
    {
      title: "Track your progress",
      description: "Record your workouts, nutrition, and measurements to see improvements over time.",
      icon: <BarChart className="h-5 w-5 text-primary" />
    },
    {
      title: "Set realistic goals",
      description: "Create achievable short-term goals that lead to your long-term fitness vision.",
      icon: <Trophy className="h-5 w-5 text-primary" />
    },
    {
      title: "Listen to your body",
      description: "Pay attention to recovery needs and adjust workout intensity accordingly.",
      icon: <Heart className="h-5 w-5 text-primary" />
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container max-w-7xl py-8 px-4 sm:px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Workout & Nutrition Guidance</h1>
            <p className="text-muted-foreground">Expert advice to maximize your fitness results</p>
          </div>
          <Link to="/form-analyzer">
            <Button className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300" size="lg">
              <VideoIcon className="h-5 w-5" /> 
              Go to Form Analyzer
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-1 shadow-lg transition-all duration-300 hover:shadow-xl animate-fade-in">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-background rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Flame className="h-5 w-5" />
                Workout Recommendations
              </CardTitle>
              <CardDescription>Science-backed exercise guidance for optimal results</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {workoutRecommendations.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3 border-b border-border/30 pb-3 last:border-0 group hover:bg-muted/30 p-2 rounded-md transition-colors">
                    <div className="bg-primary/10 p-2 rounded-full mt-0.5 group-hover:bg-primary/20 transition-colors">
                      {tip.icon}
                    </div>
                    <div>
                      <h3 className="font-medium">{tip.title}</h3>
                      <p className="text-muted-foreground text-sm">{tip.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-1 shadow-lg transition-all duration-300 hover:shadow-xl animate-fade-in">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-background rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Apple className="h-5 w-5" />
                Nutrition Tips
              </CardTitle>
              <CardDescription>Dietary guidance to fuel your performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {nutritionTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3 border-b border-border/30 pb-3 last:border-0 group hover:bg-muted/30 p-2 rounded-md transition-colors">
                    <div className="bg-primary/10 p-2 rounded-full mt-0.5 group-hover:bg-primary/20 transition-colors">
                      {tip.icon}
                    </div>
                    <div>
                      <h3 className="font-medium">{tip.title}</h3>
                      <p className="text-muted-foreground text-sm">{tip.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-1 shadow-lg transition-all duration-300 hover:shadow-xl animate-fade-in">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-background rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Success Factors
              </CardTitle>
              <CardDescription>Key principles for long-term fitness success</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {successTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3 border-b border-border/30 pb-3 last:border-0 group hover:bg-muted/30 p-2 rounded-md transition-colors">
                    <div className="bg-primary/10 p-2 rounded-full mt-0.5 group-hover:bg-primary/20 transition-colors">
                      {tip.icon}
                    </div>
                    <div>
                      <h3 className="font-medium">{tip.title}</h3>
                      <p className="text-muted-foreground text-sm">{tip.description}</p>
                    </div>
                  </li>
                ))}
                
                <div className="mt-4 pt-4 border-t">
                  <Link to="/form-analyzer">
                    <Button variant="outline" className="w-full group">
                      <span>Analyze Your Form</span>
                      <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </ul>
            </CardContent>
          </Card>
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

export default NutritionTips;
