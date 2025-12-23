import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Newspaper, Menu, X, Palette, ScanSearch } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState('sepia');
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'sepia';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const themes = ['sepia', 'purple', 'green'];
    const currentIndex = themes.indexOf(theme);
    const newTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const isHome = location.pathname === '/';

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled || !isHome
          ? "bg-background/80 backdrop-blur-lg shadow-md border-b border-border/50"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group"
          >
            <img 
              src="/favicon.ico" 
              alt="NewsScope Logo" 
              className="w-8 h-8 md:w-9 md:h-9"
            />
            <span className="font-display text-xl md:text-2xl font-bold text-foreground">
              NewsScope
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/"
              className={cn(
                "text-sm font-medium transition-colors hover:text-secondary",
                location.pathname === '/' 
                  ? "text-secondary" 
                  : "text-foreground"
              )}
            >
              Home
            </Link>
            <Link 
              to="/detect"
              className={cn(
                "text-sm font-medium transition-colors hover:text-secondary",
                location.pathname === '/detect' 
                  ? "text-secondary" 
                  : "text-foreground"
              )}
            >
              Detect
            </Link>
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-all hover:scale-110 border border-border"
              title="Toggle Theme"
            >
              <Palette className="w-4 h-4 text-foreground" />
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-lg border-b border-border animate-slide-down">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link 
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-medium py-2 hover:text-secondary transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/detect"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-medium py-2 hover:text-secondary transition-colors"
            >
              Detect
            </Link>
            
            <Button variant="default" asChild className="w-full bg-gold text-background hover:bg-gold/90">
              <Link to="/detect" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2">
                <ScanSearch className="w-5 h-5" />
                Analyze News
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
