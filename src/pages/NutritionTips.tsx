
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChevronRight, VideoIcon, Apple, UtensilsCrossed, Coffee, Salad, Scale, Leaf, Pills, Flask, Battery, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from 'framer-motion';

const NutritionTips = () => {
  const [dietType, setDietType] = useState<'bulking' | 'cutting'>('bulking');

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
      icon: <Coffee className="h-5 w-5 text-primary" />
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

  const supplementTips = [
    {
      title: "Protein Powder",
      description: "A convenient way to meet protein requirements, especially post-workout. Choose whey, plant-based, or casein depending on your dietary preferences.",
      icon: <Flask className="h-5 w-5 text-primary" />
    },
    {
      title: "Creatine Monohydrate",
      description: "One of the most researched supplements, enhances strength, power, and muscle recovery. Take 3-5g daily, no need for loading phase.",
      icon: <Pills className="h-5 w-5 text-primary" />
    },
    {
      title: "Pre-Workout",
      description: "Contains caffeine and other ingredients to boost energy and focus. Look for products without excessive stimulants or artificial colors.",
      icon: <Battery className="h-5 w-5 text-primary" />
    },
    {
      title: "BCAAs",
      description: "Branch-chain amino acids may help with muscle retention during caloric deficit or fasted training. Not essential if protein intake is adequate.",
      icon: <Pills className="h-5 w-5 text-primary" />
    },
    {
      title: "Fish Oil / Omega-3",
      description: "Supports joint health, reduces inflammation, and provides cardiovascular benefits. Look for high EPA/DHA content.",
      icon: <Heart className="h-5 w-5 text-primary" />
    },
    {
      title: "Vitamin D",
      description: "Essential for bone health, immune function, and hormonal health. Most people are deficient, especially in northern climates.",
      icon: <Pills className="h-5 w-5 text-primary" />
    },
    {
      title: "ZMA (Zinc, Magnesium, B6)",
      description: "Supports sleep quality, recovery, and hormonal balance. Take before bed on an empty stomach.",
      icon: <Flask className="h-5 w-5 text-primary" />
    }
  ];

  const bulkingPlan = [
    { meal: "Breakfast", foods: "Oatmeal with protein powder, banana, and peanut butter", calories: "~600", protein: "35g", carbs: "70g", fat: "20g" },
    { meal: "Snack", foods: "Greek yogurt with berries and honey", calories: "~300", protein: "20g", carbs: "35g", fat: "5g" },
    { meal: "Lunch", foods: "Chicken breast, brown rice, and vegetables", calories: "~550", protein: "40g", carbs: "60g", fat: "10g" },
    { meal: "Pre-workout", foods: "Protein shake and banana", calories: "~300", protein: "25g", carbs: "30g", fat: "3g" },
    { meal: "Post-workout", foods: "Whey protein and sweet potato", calories: "~350", protein: "30g", carbs: "45g", fat: "2g" },
    { meal: "Dinner", foods: "Salmon, quinoa, and steamed vegetables", calories: "~600", protein: "40g", carbs: "50g", fat: "25g" },
    { meal: "Before bed", foods: "Cottage cheese and almonds", calories: "~250", protein: "25g", carbs: "5g", fat: "15g" }
  ];

  const cuttingPlan = [
    { meal: "Breakfast", foods: "Egg whites, whole egg, and spinach", calories: "~250", protein: "25g", carbs: "5g", fat: "10g" },
    { meal: "Snack", foods: "Protein shake with water", calories: "~120", protein: "25g", carbs: "3g", fat: "1g" },
    { meal: "Lunch", foods: "Grilled chicken salad with light dressing", calories: "~350", protein: "35g", carbs: "15g", fat: "12g" },
    { meal: "Pre-workout", foods: "Apple with small amount of almond butter", calories: "~150", protein: "3g", carbs: "20g", fat: "8g" },
    { meal: "Post-workout", foods: "Whey protein with water", calories: "~120", protein: "25g", carbs: "3g", fat: "1g" },
    { meal: "Dinner", foods: "White fish, steamed vegetables, and small portion of rice", calories: "~350", protein: "30g", carbs: "25g", fat: "10g" },
    { meal: "Evening", foods: "Greek yogurt (0% fat)", calories: "~100", protein: "18g", carbs: "6g", fat: "0g" }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container max-w-7xl py-8 px-4 sm:px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Nutrition & Supplements Guide</h1>
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
          {/* Diet Plans */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1 shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            <Card>
              <CardHeader className="bg-gradient-to-r from-primary/10 to-background rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <UtensilsCrossed className="h-5 w-5" />
                  Diet Plans
                </CardTitle>
                <CardDescription>Sample meal plans for your fitness goals</CardDescription>
                <Tabs 
                  value={dietType} 
                  onValueChange={(v) => setDietType(v as 'bulking' | 'cutting')} 
                  className="mt-2"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger 
                      value="bulking" 
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all"
                    >
                      Bulking
                    </TabsTrigger>
                    <TabsTrigger 
                      value="cutting" 
                      className="data-[state=active]:bg-red-600 data-[state=active]:text-white transition-all"
                    >
                      Cutting
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent>
                <motion.div 
                  className="overflow-x-auto"
                  key={dietType}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-border/30 text-xs font-medium text-muted-foreground">
                        <th className="py-2 px-1 text-left">Meal</th>
                        <th className="py-2 px-1 text-left">Foods</th>
                        <th className="py-2 px-1 text-right">Calories</th>
                        <th className="py-2 px-1 text-right">Protein</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(dietType === 'bulking' ? bulkingPlan : cuttingPlan).map((meal, i) => (
                        <tr 
                          key={i} 
                          className={`border-b border-border/10 hover:bg-muted/30 transition-colors ${
                            i % 2 === 0 ? 'bg-muted/5' : ''
                          }`}
                        >
                          <td className="py-2 px-1 text-sm font-medium">{meal.meal}</td>
                          <td className="py-2 px-1 text-sm">{meal.foods}</td>
                          <td className="py-2 px-1 text-sm text-right">{meal.calories}</td>
                          <td className="py-2 px-1 text-sm text-right">{meal.protein}</td>
                        </tr>
                      ))}
                      <tr className="font-medium">
                        <td colSpan={2} className="py-2 px-1 text-right text-sm">Daily Total:</td>
                        <td className="py-2 px-1 text-right text-sm">
                          {dietType === 'bulking' ? '~2,950' : '~1,440'} cal
                        </td>
                        <td className="py-2 px-1 text-right text-sm">
                          {dietType === 'bulking' ? '~215g' : '~161g'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </motion.div>
                
                <div className="mt-4 pt-2 border-t border-border/30">
                  <p className="text-xs text-muted-foreground mb-2">
                    {dietType === 'bulking' 
                      ? 'This bulking plan aims for a 500 calorie surplus to promote muscle growth.' 
                      : 'This cutting plan creates a 500 calorie deficit while maintaining protein intake.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Nutrition Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1 shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            <Card>
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
                    <motion.li 
                      key={i}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className="flex items-start gap-3 border-b border-border/30 pb-3 last:border-0 group hover:bg-muted/30 p-2 rounded-md transition-colors"
                    >
                      <div className="bg-primary/10 p-2 rounded-full mt-0.5 group-hover:bg-primary/20 transition-colors">
                        {tip.icon}
                      </div>
                      <div>
                        <h3 className="font-medium">{tip.title}</h3>
                        <p className="text-muted-foreground text-sm">{tip.description}</p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Supplement Tips - New card replacing the workout recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1 shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            <Card>
              <CardHeader className="bg-gradient-to-r from-primary/10 to-background rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Pills className="h-5 w-5" />
                  Gym Supplements
                </CardTitle>
                <CardDescription>Science-backed supplements to consider for your fitness journey</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {supplementTips.map((tip, i) => (
                    <motion.li 
                      key={i}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className="flex items-start gap-3 border-b border-border/30 pb-3 last:border-0 group hover:bg-muted/30 p-2 rounded-md transition-colors"
                    >
                      <div className="bg-primary/10 p-2 rounded-full mt-0.5 group-hover:bg-primary/20 transition-colors">
                        {tip.icon}
                      </div>
                      <div>
                        <h3 className="font-medium">{tip.title}</h3>
                        <p className="text-muted-foreground text-sm">{tip.description}</p>
                      </div>
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-6 pt-4 border-t border-border/30">
                  <p className="text-xs text-muted-foreground mb-4">
                    Note: Always consult with a healthcare professional before starting any supplement regimen. Quality and sourcing matter - look for third-party tested products.
                  </p>
                  <Link to="/form-analyzer">
                    <Button variant="outline" className="w-full group">
                      <span>Analyze Your Form</span>
                      <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
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
