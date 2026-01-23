import { Link, useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  User, 
  Menu, 
  Settings, 
  Search, 
  Info, 
  Sidebar,
  LayoutDashboard,
  LogIn,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const isMobile = useIsMobile();

  // Lock body scroll on mobile when sidebar is open
  useEffect(() => {
    if (isMobile && isSheetOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100vh';
      return () => {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.height = '';
      };
    }
    // Always clean up if not open
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.height = '';
  }, [isMobile, isSheetOpen]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsSheetOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsSheetOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between relative px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/favicon.ico" 
              alt="NewsScope Logo" 
              className="w-6 h-6 lg:w-8 lg:h-8"
            />
            <span className="text-xl font-bold">NewsScope</span>
          </Link>

          {/* Right Side - Auth State */}
          <div className="flex items-center gap-2">
            {/* Always show sidebar menu button */}
            <div className="hidden md:flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsSheetOpen(true)}
              >
                <Sidebar className="h-4 w-4" />
              </Button>
            </div>
            {/* Mobile: Menu Button */}
            <Button 
              variant="outline" 
              size="icon" 
              className="md:hidden" 
              onClick={() => setIsSheetOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen} modal={true}>
        <SheetContent side="right" className="bg-background/95 backdrop-blur-md z-[60] w-80 shadow-2xl" style={{ padding: 0 }}>
          <div
            className="flex flex-col h-full pt-12 px-4"
            onClick={e => e.stopPropagation()}
          >
            {/* Top Section - Auth Buttons (always visible) */}
            <div className="pb-6 border-b border-border/50">
              <div className="space-y-3">
                {!isAuthenticated ? (
                  <>
                    <Button variant="default" onClick={() => handleNavigation('/login')} className="w-full h-11 font-medium">
                      <LogIn className="h-4 w-4 mr-2" />
                      Login
                    </Button>
                    <Button variant="outline" onClick={() => handleNavigation('/signup')} className="w-full h-11 font-medium">
                      Sign Up
                    </Button>
                  </>
                ) : (
                  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl border border-border/30">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-base truncate">{user.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Middle Section - Navigation & Theme */}
            <div className="flex-1 py-6 space-y-2">
              {/* Home Button - Always visible at top */}
              <Button variant="ghost" onClick={() => handleNavigation('/')} className="w-full justify-start h-11 px-4 rounded-lg hover:bg-muted/50">
                <Home className="h-4 w-4 mr-3" />
                Home
              </Button>
              
              {isAuthenticated && (
                <>
                  <Button variant="ghost" onClick={() => handleNavigation('/dashboard')} className="w-full justify-start h-11 px-4 rounded-lg hover:bg-muted/50">
                    <LayoutDashboard className="h-4 w-4 mr-3" />
                    Dashboard
                  </Button>
                  <Button variant="ghost" onClick={() => handleNavigation('/detect')} className="w-full justify-start h-11 px-4 rounded-lg hover:bg-muted/50">
                    <Search className="h-4 w-4 mr-3" />
                    Detect News
                  </Button>
                </>
              )}
              <Button variant="ghost" onClick={toggleTheme} className="w-full justify-start h-11 px-4 rounded-lg hover:bg-muted/50">
                <Settings className="h-4 w-4 mr-3" />
                Change Theme
              </Button>
              {isAuthenticated && (
                <Button variant="ghost" onClick={() => handleNavigation('/about')} className="w-full justify-start h-11 px-4 rounded-lg hover:bg-muted/50">
                  <Info className="h-4 w-4 mr-3" />
                  About
                </Button>
              )}
              {!isAuthenticated && (
                <Button variant="ghost" onClick={() => handleNavigation('/about')} className="w-full justify-start h-11 px-4 rounded-lg hover:bg-muted/50">
                  <Info className="h-4 w-4 mr-3" />
                  About
                </Button>
              )}
              {isAuthenticated && (
                <Button variant="ghost" onClick={handleLogout} className="w-full justify-start h-11 px-4 rounded-lg hover:bg-destructive/10 text-destructive hover:text-destructive">
                  <LogOut className="h-4 w-4 mr-3" />
                  Logout
                </Button>
              )}
            </div>

            {/* Bottom Section - Empty */}
            <div className="pt-4 border-t border-border/50">
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};