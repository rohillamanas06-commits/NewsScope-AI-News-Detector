import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, LayoutDashboard, Menu, X } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';

const Index: React.FC = () => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Array of news images to rotate through
  const newsImages = ['/new1.jpg'];

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      // Check if width is less than 768px (Tailwind md breakpoint)
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };

    // Check on mount
    checkMobile();

    // Also check on window resize
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle scroll to show/hide navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Image carousel - rotate every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % newsImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [newsImages.length]);

  return (
    <div className="relative w-full overflow-visible">
      {/* Hero Section Container - Same for Desktop and Mobile */}
      <section
        className="relative w-full overflow-hidden flex flex-col items-center justify-start text-center px-6"
        style={{
          paddingTop: '5rem',
          paddingBottom: '10rem',
          height: '100vh',
        }}
      >
        {/* Picture Background */}
        <img
          ref={imageRef}
          src={newsImages[currentImageIndex]}
          alt="Hero background"
          className="absolute inset-0 z-0 w-full h-full object-cover transition-opacity duration-500"
          style={{
            objectPosition: 'center 30%',
          }}
        />

        {/* Black Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-30 w-full transition-all duration-300"
          style={{
            background: '#000000',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            opacity: 1,
            pointerEvents: 'auto',
          }}
        >
          <div className="px-6 py-2 flex items-center justify-between h-12">
            {/* Mobile Menu Button - Left Side */}
            {isMobile && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            )}

            {/* Sign In / Dive In Button - Right Side */}
            {isMobile ? (
              <button
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
                className="px-3 py-1.5 text-xs bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded transition-colors duration-200"
              >
                {isAuthenticated ? 'Dive In' : 'Sign In'}
              </button>
            ) : (
              <div className="ml-auto">
                <button
                  onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
                  className="px-5 py-2 bg-transparent text-white font-medium rounded-lg hover:opacity-80 transition-all duration-300 flex items-center gap-2"
                >
                  {isAuthenticated ? (
                    <>
                      <LayoutDashboard size={18} />
                      Dive In
                    </>
                  ) : (
                    <>
                      <LogIn size={18} />
                      Sign In
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-white/10 bg-black/95 px-4 py-4 space-y-3">
              <a href="/about" className="block text-sm text-white/60 hover:text-white transition-colors py-2">About</a>
              <a href="/contact" className="block text-sm text-white/60 hover:text-white transition-colors py-2">Contact</a>
              <a href="/faq" className="block text-sm text-white/60 hover:text-white transition-colors py-2">FAQ</a>
              <a href="/terms" className="block text-sm text-white/60 hover:text-white transition-colors py-2">Terms</a>
              <a href="/privacy" className="block text-sm text-white/60 hover:text-white transition-colors py-2">Privacy</a>
            </div>
          )}
        </nav>

        {/* Gradient Overlay - Removed for clean sky */}
        <div className="absolute inset-0 bg-transparent z-[1] pointer-events-none" />

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center justify-center">
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
