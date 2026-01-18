import { Link, useNavigate } from 'react-router-dom';
import { FileText, LogOut, User, Menu, Settings, Moon, Sun, Flame, Info, Sidebar, Edit, Search, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import React, { useState } from 'react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Add global styles to prevent layout shift
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      body {
        overflow-x: hidden !important;
        position: relative !important;
      }
      html {
        overflow-x: hidden !important;
      }
      /* Prevent content shift when modal opens */
      [data-radix-scroll-lock] {
        padding-right: 0 !important;
      }
      body[data-radix-scroll-lock] {
        overflow: visible !important;
        padding-right: 0 !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsSheetOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsSheetOpen(false);
  };

  const getThemeIcon = () => {
    if (theme === 'brown') return <Moon className="h-4 w-4 mr-2" />;
    if (theme === 'green') return <Flame className="h-4 w-4 mr-2" />;
    return <Sun className="h-4 w-4 mr-2" />;
  };

  const getThemeLabel = () => {
    if (theme === 'brown') return 'Green Mode';
    if (theme === 'green') return 'Purple Mode';
    return 'Brown Mode';
  };

  
  return (
    <>
      <nav className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between relative px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center space-x-2 ml-12 -ml-3 md:ml-12">
            <img 
              src="/favicon.ico" 
              alt="NewsScope Logo" 
              className="w-6 h-6 lg:w-8 lg:h-8"
            />
            <span className="text-xl font-bold">NewsScope</span>
          </Link>

          {/* Home Button - Absolute Center - Hidden on mobile */}
          <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:block">
            <Button variant="ghost" onClick={() => handleNavigation('/')}>
              Home
            </Button>
          </div>

          {/* User Menu - Desktop Sidebar */}
          <div className="hidden md:flex items-center space-x-4 mr-16">
            <Button variant="outline" size="sm" onClick={() => setIsSheetOpen(true)}>
              <Sidebar className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button variant="outline" size="icon" className="md:hidden mr-16" onClick={() => setIsSheetOpen(true)}>
            <Sidebar className="h-5 w-5" />
          </Button>
        </div>
      </nav>

      {/* Sidebar - Both Desktop and Mobile - Rendered outside navbar */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen} modal={false}>
        {/* Custom overlay to replicate exact original effect */}
        {isSheetOpen && (
          <div 
            className="fixed inset-0 z-50 bg-black/80 animate-in fade-in-0 duration-300" 
            onClick={() => setIsSheetOpen(false)}
          />
        )}
        <SheetContent side="right" className="bg-background z-[60] w-80">
          <div className="flex flex-col space-y-4 mt-8">
            <Button variant="outline" onClick={() => handleNavigation('/detect')}>
              <Search className="h-4 w-4 mr-2" />
              Detect
            </Button>
            <Button variant="outline" onClick={toggleTheme}>
              {getThemeIcon()}
              {getThemeLabel()}
            </Button>
            <Button variant="outline" onClick={() => handleNavigation('/about')}>
              <Info className="h-4 w-4 mr-2" />
              About
            </Button>
            {user && (
              <>
                <Button variant="outline" onClick={() => handleNavigation('/profile')}>
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
                <Button variant="outline" onClick={() => handleNavigation('/settings')}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
