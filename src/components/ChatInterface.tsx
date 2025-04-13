
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, User, Bot } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: 1,
    text: "Hello! I'm your FormFit AI coach. Upload a workout video or use your camera, and I'll analyze your form to help you exercise safely and effectively.",
    sender: 'ai',
    timestamp: new Date(),
  },
];

// Fitness knowledge base for AI responses
const fitnessKnowledge = {
  greetings: [
    "Hello! I'm your FormFit AI coach. How can I help you today?",
    "Hi there! Ready to work on your fitness goals?",
    "Welcome back! Looking to improve your form or start a new workout?"
  ],
  workouts: {
    "bench press": "The bench press is a compound exercise that targets the chest, shoulders, and triceps. For proper form: 1) Lie flat on a bench, 2) Grip the bar slightly wider than shoulder-width, 3) Lower the bar to mid-chest, 4) Push the bar up while keeping shoulders back.",
    "squat": "The squat is a fundamental lower body exercise. For proper form: 1) Stand with feet shoulder-width apart, 2) Lower your body as if sitting in a chair, 3) Keep your chest up and knees tracking over toes, 4) Push through your heels to stand up.",
    "deadlift": "The deadlift is a powerful posterior chain exercise. For proper form: 1) Stand with feet hip-width apart, 2) Hinge at the hips with flat back, 3) Grasp the bar with hands outside knees, 4) Drive through heels and extend hips to stand.",
    "shoulder press": "The shoulder press targets the deltoids and triceps. For proper form: 1) Stand with feet shoulder-width apart, 2) Hold weights at shoulder level, 3) Press weights overhead without arching back, 4) Lower weights with control.",
    "bicep curl": "For proper bicep curl form: 1) Stand straight with weights at your sides, 2) Keep elbows close to torso, 3) Curl weights up without swinging, 4) Lower with control.",
    "plank": "For a proper plank: 1) Support your weight on forearms and toes, 2) Create a straight line from head to heels, 3) Engage core and glutes, 4) Avoid sagging or pike position.",
    "lunge": "For proper lunge form: 1) Step forward with one leg, 2) Lower until both knees form 90-degree angles, 3) Push through front heel to return, 4) Keep torso upright."
  },
  plans: {
    "strength": "Here's a 4-day strength training plan:\n\nDay 1 - Lower Body\n- Squats: 4 sets of 5 reps\n- Deadlifts: 3 sets of 5 reps\n- Leg Press: 3 sets of 8 reps\n- Calf Raises: 3 sets of 12 reps\n\nDay 2 - Upper Body Push\n- Bench Press: 4 sets of 5 reps\n- Shoulder Press: 3 sets of 8 reps\n- Incline Dumbbell Press: 3 sets of 10 reps\n- Triceps Extensions: 3 sets of 12 reps\n\nDay 3 - Rest\n\nDay 4 - Upper Body Pull\n- Pull-ups: 4 sets of 6-8 reps\n- Barbell Rows: 3 sets of 8 reps\n- Face Pulls: 3 sets of 12 reps\n- Bicep Curls: 3 sets of 12 reps\n\nDay 5 - Full Body\n- Front Squats: 3 sets of 8 reps\n- Romanian Deadlifts: 3 sets of 10 reps\n- Push-ups: 3 sets of 12 reps\n- Dumbbell Rows: 3 sets of 10 reps per arm\n\nDays 6-7 - Rest",
    "hypertrophy": "Here's a 5-day hypertrophy plan:\n\nDay 1 - Chest & Triceps\n- Bench Press: 4 sets of 8-10 reps\n- Incline Dumbbell Press: 4 sets of 10-12 reps\n- Cable Flyes: 3 sets of 12-15 reps\n- Tricep Pushdowns: 4 sets of 10-12 reps\n- Overhead Tricep Extensions: 3 sets of 12-15 reps\n\nDay 2 - Back & Biceps\n- Pull-ups: 4 sets of 8-10 reps\n- Seated Rows: 4 sets of 10-12 reps\n- Lat Pulldowns: 3 sets of 12-15 reps\n- Barbell Curls: 4 sets of 10-12 reps\n- Hammer Curls: 3 sets of 12-15 reps\n\nDay 3 - Legs\n- Squats: 4 sets of 8-10 reps\n- Leg Press: 4 sets of 10-12 reps\n- Romanian Deadlifts: 3 sets of 10-12 reps\n- Leg Extensions: 3 sets of 12-15 reps\n- Leg Curls: 3 sets of 12-15 reps\n- Calf Raises: 4 sets of 15-20 reps\n\nDay 4 - Shoulders & Abs\n- Overhead Press: 4 sets of 8-10 reps\n- Lateral Raises: 4 sets of 12-15 reps\n- Face Pulls: 3 sets of 12-15 reps\n- Hanging Leg Raises: 3 sets of 12-15 reps\n- Cable Crunches: 3 sets of 15-20 reps\n\nDay 5 - Full Body\n- Deadlifts: 3 sets of 8-10 reps\n- Dips: 3 sets of 10-12 reps\n- Pull-ups: 3 sets of 8-10 reps\n- Lunges: 3 sets of 10-12 reps per leg\n\nDays 6-7 - Rest",
    "cardio": "Here's a weekly cardio plan:\n\nDay 1 - HIIT\n- 5 min warm-up\n- 20 min interval training (30 sec sprint, 90 sec walk)\n- 5 min cool-down\n\nDay 2 - Steady State\n- 30-45 min moderate intensity (running, cycling, or swimming)\n\nDay 3 - Active Recovery\n- 20-30 min light walking or yoga\n\nDay 4 - HIIT\n- 5 min warm-up\n- 20 min interval training (40 sec high intensity, 80 sec recovery)\n- 5 min cool-down\n\nDay 5 - Steady State\n- 30-45 min moderate intensity cardio of your choice\n\nDay 6 - Cross Training\n- 45 min activity (hiking, sports, swimming, etc.)\n\nDay 7 - Rest",
    "weekly": "Here's a balanced weekly workout plan:\n\nMonday - Upper Body\n- Push-ups: 3 sets of 10-15 reps\n- Dumbbell Rows: 3 sets of 12 reps per arm\n- Shoulder Press: 3 sets of 12 reps\n- Tricep Dips: 3 sets of 12-15 reps\n- Bicep Curls: 3 sets of 12 reps\n\nTuesday - Cardio\n- 5 min warm-up\n- 20 min interval training\n- 5 min cool-down\n\nWednesday - Lower Body\n- Squats: 3 sets of 12-15 reps\n- Lunges: 3 sets of 10 reps per leg\n- Glute Bridges: 3 sets of 15 reps\n- Calf Raises: 3 sets of 20 reps\n\nThursday - Rest or Light Activity\n\nFriday - Full Body\n- Deadlifts: 3 sets of 10 reps\n- Push-ups: 3 sets of 12 reps\n- Pull-ups or Lat Pulldowns: 3 sets of 8-10 reps\n- Planks: 3 sets of 30-60 seconds\n\nSaturday - Cardio or Active Recovery\n- 30-45 min activity of choice\n\nSunday - Rest"
  },
  nutrition: {
    "protein": "Protein is essential for muscle repair and growth. Aim for 1.6-2.2g per kg of bodyweight daily. Good sources include lean meats, fish, eggs, dairy, legumes, and protein supplements.",
    "carbs": "Carbohydrates are your body's primary energy source. Focus on complex carbs like whole grains, fruits, vegetables, and legumes. Time higher carb intake around workouts for optimal performance.",
    "fat": "Healthy fats are essential for hormone production. Include sources like avocados, nuts, seeds, olive oil, and fatty fish. Aim for 0.5-1g per kg of bodyweight daily.",
    "meal timing": "Pre-workout: Eat a balanced meal with carbs and protein 2-3 hours before, or a small snack 30-60 minutes before.\nPost-workout: Consume protein and carbs within 2 hours after training for optimal recovery.",
    "supplements": "Common supplements include:\n- Protein powder: Convenient for meeting protein goals\n- Creatine: Improves strength and power output\n- Caffeine: Enhances performance and focus\n- Fish oil: Supports joint health and reduces inflammation\nConsult a healthcare provider before starting any supplement regimen."
  },
  recovery: {
    "sleep": "Prioritize 7-9 hours of quality sleep per night. Sleep is when your body repairs muscle tissue and consolidates motor learning from training.",
    "rest days": "Include 1-2 rest days weekly. Active recovery like walking or yoga on rest days can enhance blood flow without causing additional stress.",
    "stretching": "Incorporate daily stretching, focusing on tight areas. Hold each stretch for 20-30 seconds without bouncing. Consider adding yoga or dedicated mobility work to your routine.",
    "foam rolling": "Use a foam roller for 5-10 minutes daily to release tension in muscles and fascia. Roll slowly over tight areas, pausing on tender spots for 20-30 seconds."
  }
};

// Helper function to generate AI responses based on user input
const generateAIResponse = (message: string): string => {
  const lowercaseMessage = message.toLowerCase();
  
  // Check for greetings
  if (lowercaseMessage.includes('hi') || lowercaseMessage.includes('hello') || lowercaseMessage.includes('hey')) {
    return fitnessKnowledge.greetings[Math.floor(Math.random() * fitnessKnowledge.greetings.length)];
  }
  
  // Check for workout plan requests
  if (lowercaseMessage.includes('workout plan') || lowercaseMessage.includes('training plan')) {
    if (lowercaseMessage.includes('strength')) {
      return fitnessKnowledge.plans.strength;
    } else if (lowercaseMessage.includes('muscle') || lowercaseMessage.includes('hypertrophy')) {
      return fitnessKnowledge.plans.hypertrophy;
    } else if (lowercaseMessage.includes('cardio')) {
      return fitnessKnowledge.plans.cardio;
    } else if (lowercaseMessage.includes('week')) {
      return fitnessKnowledge.plans.weekly;
    } else {
      return "I'd be happy to provide a workout plan! What are your specific goals? Strength, muscle building (hypertrophy), cardio, or a general weekly plan?";
    }
  }
  
  // Check for specific exercise form questions
  for (const [exercise, description] of Object.entries(fitnessKnowledge.workouts)) {
    if (lowercaseMessage.includes(exercise)) {
      return description;
    }
  }
  
  // Check for nutrition questions
  if (lowercaseMessage.includes('protein')) {
    return fitnessKnowledge.nutrition.protein;
  } else if (lowercaseMessage.includes('carb')) {
    return fitnessKnowledge.nutrition.carbs;
  } else if (lowercaseMessage.includes('fat')) {
    return fitnessKnowledge.nutrition.fat;
  } else if ((lowercaseMessage.includes('meal') && lowercaseMessage.includes('timing')) || 
             (lowercaseMessage.includes('when') && lowercaseMessage.includes('eat'))) {
    return fitnessKnowledge.nutrition.meal_timing;
  } else if (lowercaseMessage.includes('supplement')) {
    return fitnessKnowledge.nutrition.supplements;
  } else if (lowercaseMessage.includes('nutrition') || lowercaseMessage.includes('diet')) {
    return "I can help with nutrition advice! What specific aspect are you interested in? Protein intake, carbohydrates, healthy fats, meal timing, or supplements?";
  }
  
  // Check for recovery questions
  if (lowercaseMessage.includes('sleep')) {
    return fitnessKnowledge.recovery.sleep;
  } else if (lowercaseMessage.includes('rest day')) {
    return fitnessKnowledge.recovery.rest_days;
  } else if (lowercaseMessage.includes('stretch')) {
    return fitnessKnowledge.recovery.stretching;
  } else if (lowercaseMessage.includes('foam roll')) {
    return fitnessKnowledge.recovery.foam_rolling;
  } else if (lowercaseMessage.includes('recovery')) {
    return "For optimal recovery, focus on quality sleep (7-9 hours nightly), proper nutrition, hydration, and including rest days in your training schedule. Would you like specific information about sleep, rest days, stretching, or foam rolling?";
  }
  
  // Default responses for general fitness questions
  if (lowercaseMessage.includes('best exercise')) {
    return "The 'best' exercise depends on your specific goals! For overall strength, compound movements like squats, deadlifts, bench press, and pull-ups are excellent. For cardiovascular health, consider activities you enjoy enough to do consistently like running, cycling, or swimming. What's your primary fitness goal?";
  }
  
  if (lowercaseMessage.includes('lose weight') || lowercaseMessage.includes('fat loss')) {
    return "Effective fat loss combines proper nutrition (moderate calorie deficit of 300-500 calories/day), strength training to preserve muscle, and cardiovascular exercise. Focus on sustainable lifestyle changes rather than quick fixes. Would you like a specific fat loss workout plan or nutrition guidance?";
  }
  
  if (lowercaseMessage.includes('build muscle') || lowercaseMessage.includes('gain muscle')) {
    return "To build muscle, focus on progressive overload (gradually increasing weight/reps), adequate protein intake (1.6-2.2g per kg of bodyweight), caloric surplus (250-500 extra calories daily), and proper recovery. Would you like a specific muscle-building workout plan?";
  }
  
  if (lowercaseMessage.includes('beginner') || lowercaseMessage.includes('start')) {
    return "For beginners, focus on learning proper form with basic compound movements. Start with 2-3 full-body workouts per week, allowing 48 hours between sessions for recovery. Begin with bodyweight or light weights and gradually increase as you master the movements. Would you like a beginner-friendly workout plan?";
  }
  
  // Generic response if no specific match
  return "I'm your FormFit AI coach, ready to help with workout form, exercise suggestions, training plans, and fitness advice. Could you please provide more details about what you're looking for?";
};

interface ChatInterfaceProps {
  onSendMessage: (message: string) => Promise<string>;
  disabled?: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onSendMessage, disabled = false }) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isProcessing) return;
    
    const userMessage: Message = {
      id: Date.now(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsProcessing(true);
    
    try {
      // First try to use the provided onSendMessage prop
      let response: string;
      
      try {
        response = await onSendMessage(newMessage);
        
        // If the response is empty or an error occurred, fall back to our local AI
        if (!response || response.includes("couldn't process")) {
          response = generateAIResponse(newMessage);
        }
      } catch (error) {
        // Fall back to our local AI if the external one fails
        response = generateAIResponse(newMessage);
      }
      
      const aiMessage: Message = {
        id: Date.now() + 1,
        text: response,
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Show toast for important AI responses
      if (response.includes("workout plan") || response.includes("Day 1")) {
        toast({
          title: "Workout Plan Ready",
          description: "Your personalized workout plan has been created!",
        });
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Even if everything fails, still give a response
      const fallbackResponse = generateAIResponse(newMessage);
      
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: fallbackResponse,
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="flex flex-col h-[400px] overflow-hidden">
      <div className="p-4 border-b bg-muted/30">
        <h2 className="font-semibold">AI Coach Chat</h2>
      </div>
      
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary/20 border border-border'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {message.sender === 'user' ? (
                    <User size={14} />
                  ) : (
                    <Bot size={14} />
                  )}
                  <span className="text-xs font-semibold">
                    {message.sender === 'user' ? 'You' : 'FormFit AI'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
              </div>
            </div>
          ))}
          
          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-secondary/20 border border-border max-w-[80%] rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Bot size={14} />
                  <span className="text-xs font-semibold">FormFit AI</span>
                </div>
                <div className="flex gap-1 items-center">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-150"></div>
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-300"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t mt-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex gap-2"
        >
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Ask about your form or exercises..."
            disabled={disabled || isProcessing}
            className="flex-1"
          />
          <Button
            type="submit"
            size="icon"
            disabled={disabled || isProcessing || !newMessage.trim()}
          >
            <Send size={18} />
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default ChatInterface;
