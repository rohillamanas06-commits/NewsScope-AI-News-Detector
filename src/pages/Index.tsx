import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, LayoutDashboard, Menu, X } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';

const Index: React.FC = () => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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

  // Handle scroll to show/hide navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative w-full overflow-visible">
      {/* Desktop Version */}
      {!isMobile && (
        <>
          {/* Hero Section Container */}
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
                {/* Sign In / Dive In Button */}
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
      )}

      {/* Mobile Version */}
      {isMobile && (
        <>
          {/* Mobile Navbar */}
          <nav className="fixed top-0 left-0 right-0 z-40 w-full bg-black border-b border-gray-800">
            <div className="px-4 py-3 flex items-center justify-between h-14">
              <div className="text-white font-bold text-lg">NewsScope</div>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white p-2 hover:bg-gray-900 rounded-lg transition-all"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
              <div className="bg-black border-t border-gray-800 px-4 py-3 space-y-2">
                <button
                  onClick={() => {
                    navigate('/about');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left text-white py-2 px-3 hover:bg-gray-900 rounded-lg transition-all"
                >
                  About
                </button>
                <button
                  onClick={() => {
                    navigate('/learn');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left text-white py-2 px-3 hover:bg-gray-900 rounded-lg transition-all"
                >
                  Learn
                </button>
                <button
                  onClick={() => {
                    navigate('/contact');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left text-white py-2 px-3 hover:bg-gray-900 rounded-lg transition-all"
                >
                  Contact
                </button>
                <button
                  onClick={() => {
                    navigate('/faq');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left text-white py-2 px-3 hover:bg-gray-900 rounded-lg transition-all"
                >
                  FAQ
                </button>
                <div className="pt-2 border-t border-gray-800">
                  <button
                    onClick={() => {
                      navigate(isAuthenticated ? '/dashboard' : '/login');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 font-medium"
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
              </div>
            )}
          </nav>

          {/* Mobile Hero Section */}
          <section
            className="relative w-full overflow-hidden flex flex-col items-center justify-start text-center px-4 pt-20"
            style={{
              paddingBottom: '3rem',
              minHeight: 'auto',
            }}
          >
            {/* Picture Background */}
            <img
              ref={imageRef}
              src={newsImages[currentImageIndex]}
              alt="Hero background"
              className="w-full h-48 object-cover rounded-lg mb-6 transition-opacity duration-500"
              style={{
                objectPosition: 'center 30%',
              }}
            />

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center justify-center py-4">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Welcome to NewsScope
              </h1>
              <p className="text-gray-600 text-sm md:text-base mb-6 leading-relaxed">
                Discover and analyze news with advanced AI-powered detection. Stay informed with real-time news coverage.
              </p>
              
              {/* Quick Action Button */}
              <button
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium flex items-center gap-2 mb-4"
              >
                {isAuthenticated ? (
                  <>
                    <LayoutDashboard size={20} />
                    Dive In
                  </>
                ) : (
                  <>
                    <LogIn size={20} />
                    Get Started
                  </>
                )}
              </button>

              {/* Info Cards */}
              <div className="w-full grid grid-cols-1 gap-3 mt-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-1">🚀 Advanced Detection</h3>
                  <p className="text-xs text-gray-600">AI-powered news analysis</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-1">📊 Real-time Updates</h3>
                  <p className="text-xs text-gray-600">Stay updated with latest news</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-1">🔒 Secure & Private</h3>
                  <p className="text-xs text-gray-600">Your data is protected</p>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="w-full mt-8 space-y-2 text-center">
                <p className="text-gray-500 text-xs mb-3">Quick Links</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => navigate('/about')}
                    className="text-xs text-blue-600 hover:text-blue-700 underline"
                  >
                    About
                  </button>
                  <span className="text-gray-300">•</span>
                  <button
                    onClick={() => navigate('/learn')}
                    className="text-xs text-blue-600 hover:text-blue-700 underline"
                  >
                    Learn
                  </button>
                  <span className="text-gray-300">•</span>
                  <button
                    onClick={() => navigate('/faq')}
                    className="text-xs text-blue-600 hover:text-blue-700 underline"
                  >
                    FAQ
                  </button>
                  <span className="text-gray-300">•</span>
                  <button
                    onClick={() => navigate('/contact')}
                    className="text-xs text-blue-600 hover:text-blue-700 underline"
                  >
                    Contact
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Mobile Footer */}
          <Footer />
        </>
      )}
    </div>
  );
};

export default Index;
