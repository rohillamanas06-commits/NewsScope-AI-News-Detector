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

        {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10 text-white">
          <div className="flex items-center justify-between px-4 md:px-12 py-3">
            {/* Logo Text */}
            <div className="flex items-center gap-2">
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex ml-auto items-center gap-6">
              <a href="/about" className="text-xs text-white/60 hover:text-white transition-colors">About</a>
              <a href="/contact" className="text-xs text-white/60 hover:text-white transition-colors">Contact</a>
              <a href="/faq" className="text-xs text-white/60 hover:text-white transition-colors">FAQ</a>
              <a href="/terms" className="text-xs text-white/60 hover:text-white transition-colors">Terms</a>
              <a href="/privacy" className="text-xs text-white/60 hover:text-white transition-colors">Privacy</a>
              <button
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
                className="px-4 py-1.5 text-xs bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded transition-colors duration-200"
              >
                {isAuthenticated ? 'Dive In' : 'Sign In'}
              </button>
            </div>

            {/* Mobile Controls - Stay fixed in place */}
            <div className="md:hidden flex items-center gap-2">
              {/* Mobile Sign In Button */}
              <button
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
                className="px-3 py-1.5 text-xs bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded transition-colors duration-200"
              >
                {isAuthenticated ? 'Dive In' : 'Sign In'}
              </button>

              {/* Mobile Menu Button - Fixed position */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="ml-2 text-white hover:text-emerald-500 transition-colors flex-shrink-0"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-white/10 bg-black/95 px-4 py-4 space-y-3">
              <a href="/about" className="block text-xs text-white/60 hover:text-white transition-colors py-2">About</a>
              <a href="/contact" className="block text-xs text-white/60 hover:text-white transition-colors py-2">Contact</a>
              <a href="/faq" className="block text-xs text-white/60 hover:text-white transition-colors py-2">FAQ</a>
              <a href="/terms" className="block text-xs text-white/60 hover:text-white transition-colors py-2">Terms</a>
              <a href="/privacy" className="block text-xs text-white/60 hover:text-white transition-colors py-2">Privacy</a>
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
