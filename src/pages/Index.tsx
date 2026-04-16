import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, LayoutDashboard, MoreVertical } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';

const Index: React.FC = () => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
          <div className="px-6 py-2 flex items-center justify-end relative h-12">
            {/* Sign In / Dive In Button - Desktop Only */}
            {!isMobile && (
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
            )}

            {/* Three Dots Menu - Mobile Only */}
            {isMobile && (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 text-white hover:opacity-80 transition-all duration-300 flex items-center"
                >
                  <MoreVertical size={24} />
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-lg border border-gray-700 z-40">
                    <button
                      onClick={() => {
                        navigate(isAuthenticated ? '/dashboard' : '/login');
                        setIsMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 text-white hover:bg-gray-800 transition-colors duration-200 flex items-center gap-2 rounded-lg"
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
            )}
          </div>
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
