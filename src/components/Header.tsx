
import React from 'react';
import { Dumbbell, ArrowLeft, Calendar, TrendingUp, ClipboardList, User, VideoIcon, Apple } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const Header = () => {
  const location = useLocation();
  
  return (
    <header className="w-full bg-background py-4 px-6 border-b border-border/40 sticky top-0 z-10">
      <div className="container max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          {location.pathname !== '/' && (
            <Button variant="ghost" size="icon" asChild className="mr-2">
              <Link to="/">
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back to Home</span>
              </Link>
            </Button>
          )}
          <Link to="/" className="flex items-center gap-2">
            <Dumbbell className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">
              FormFit <span className="text-primary">AI</span>
            </h1>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex items-center space-x-6 mr-4">
            <Link to="/" className={`transition-colors ${location.pathname === '/' ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`}>
              Dashboard
            </Link>
            <Link to="/form-analyzer" className={`transition-colors ${location.pathname === '/form-analyzer' ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`}>
              Form Analyzer
            </Link>
          </nav>
          
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  Dashboard Tools
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 w-[400px] md:grid-cols-1 lg:w-[500px]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="/"
                        >
                          <Dumbbell className="h-6 w-6 mb-2" />
                          <div className="mb-2 mt-4 text-lg font-medium">
                            FormFit AI
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Track your fitness progress and improve your workout form
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <ListItem
                      href="/personal-info"
                      title="Personal Information"
                      icon={<User className="h-4 w-4 mr-2" />}
                    >
                      Manage your profile details and fitness goals
                    </ListItem>
                    <ListItem
                      href="/workout-plan"
                      title="Weekly Workout Plan"
                      icon={<ClipboardList className="h-4 w-4 mr-2" />}
                    >
                      Schedule and manage your weekly workouts
                    </ListItem>
                    <ListItem
                      href="/calendar"
                      title="Calendar"
                      icon={<Calendar className="h-4 w-4 mr-2" />}
                    >
                      Track your workout attendance and maintain your streak
                    </ListItem>
                    <ListItem
                      href="/progress"
                      title="Progress"
                      icon={<TrendingUp className="h-4 w-4 mr-2" />}
                    >
                      Monitor your fitness improvements over time
                    </ListItem>
                    <ListItem
                      href="/nutrition-tips"
                      title="Nutrition & Tips"
                      icon={<Apple className="h-4 w-4 mr-2" />}
                    >
                      Expert workout and nutrition guidance
                    </ListItem>
                    <ListItem
                      href="/form-analyzer"
                      title="Form Analyzer"
                      icon={<VideoIcon className="h-4 w-4 mr-2" />}
                    >
                      Upload videos and get AI feedback on your form
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </header>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { 
    title: string;
    icon?: React.ReactNode;
  }
>(({ className, title, icon, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="flex items-center text-sm font-medium leading-none">
            {icon}
            {title}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default Header;
