
import React from 'react';
import { Dumbbell } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  
  return (
    <header className="w-full bg-background py-4 px-6 border-b border-border/40 sticky top-0 z-10">
      <div className="container max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Dumbbell className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">
            FormFit <span className="text-primary">AI</span>
          </h1>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className={`transition-colors ${location.pathname === '/' ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`}>
            Dashboard
          </Link>
          <Link to="/form-analyzer" className={`transition-colors ${location.pathname === '/form-analyzer' ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`}>
            Form Analyzer
          </Link>
          <Link to="/form-library" className={`transition-colors ${location.pathname === '/form-library' ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`}>
            Form Library
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
