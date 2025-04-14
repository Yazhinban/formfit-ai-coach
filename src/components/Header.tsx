
import React from 'react';
import { Dumbbell } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="w-full bg-background py-4 px-6 border-b border-border/40 sticky top-0 z-10">
      <div className="container max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Dumbbell className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">
            FormFit <span className="text-primary">AI</span>
          </h1>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Form Analyzer</Link>
          <Link to="/form-library" className="text-muted-foreground hover:text-foreground transition-colors">Form Library</Link>
          <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">Exercises</Link>
          <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">About</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
