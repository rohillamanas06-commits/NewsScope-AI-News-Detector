import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { Footer } from '@/components/Footer';

const Index: React.FC = () => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  // Detect mobile and redirect if on mobile
  useEffect(() => {
    const checkMobile = () => {
      // Check if width is less than 768px (Tailwind md breakpoint)
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (mobile) {
        // Redirect based on auth status - only check actual token keys
        const authToken = localStorage.getItem('authToken') ||
                         localStorage.getItem('auth_token') ||
                         localStorage.getItem('token') ||
                         sessionStorage.getItem('authToken') ||
                         sessionStorage.getItem('auth_token');
        
        if (authToken) {
          window.location.href = '/dashboard';
        } else {
          window.location.href = '/login';
        }
      }
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

  return (
    <div className="relative w-full overflow-visible bg-white">
      {/* Only show desktop version */}
      {!isMobile ? (
        <>
          {/* Hero Section Container */}
          <section
            className="relative w-full overflow-hidden bg-white flex flex-col items-center justify-start text-center px-6"
            style={{
              paddingTop: '5rem',
              paddingBottom: '10rem',
              height: '100vh',
            }}
          >
            {/* Picture Background */}
            <img
              ref={imageRef}
              src="/egor-vikhrev-C7dZP5JoTzc-unsplash (1).jpg"
              alt="Hero background"
              className="absolute inset-0 z-0 w-full h-full object-cover"
              style={{
                objectPosition: 'center 30%',
              }}
            />

            {/* Black Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-30 w-full transition-all duration-300"
              style={{
                background: isScrolled ? '#000000' : 'transparent',
                borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                opacity: isScrolled ? 1 : 0,
                pointerEvents: isScrolled ? 'auto' : 'none',
              }}
            >
              <div className="px-6 py-4 flex items-center justify-end relative h-16">
                {/* Sign In Button */}
                <button
                  onClick={() => navigate('/login')}
                  className="px-5 py-2 bg-transparent text-white font-medium rounded-lg hover:opacity-80 transition-all duration-300 flex items-center gap-2"
                >
                  <LogIn size={18} />
                  Sign In
                </button>
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
        </>
      ) : (
        <div className="w-full h-screen bg-white flex items-center justify-center">
          {/* Redirecting message for mobile */}
        </div>
      )}
    </div>
  );
};

export default Index;
