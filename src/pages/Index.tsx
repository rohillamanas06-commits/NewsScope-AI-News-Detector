import React, { useCallback, useRef, useEffect, useState } from 'react';
import { Footer } from '@/components/Footer';

const Index: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const requestRef = useRef<number>();
  const opacityRef = useRef(0);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [dots, setDots] = useState('.');
  const [textIndex, setTextIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(true);

  // Rotating text options
  const rotatingTexts = [
    'NewsScope uses advanced AI to detect misinformation.',
    'Analyze news articles with cutting-edge technology.',
    'Identify authentic news from misleading content.',
    'Make informed decisions about what you read.',
    'Empower yourself with truth and clarity.',
  ];

  // Detect mobile and redirect if on mobile
  useEffect(() => {
    const checkMobile = () => {
      // Check if width is less than 768px (Tailwind md breakpoint)
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (mobile) {
        // Redirect based on auth status
        const authToken = localStorage.getItem('authToken') ||
                         localStorage.getItem('auth_token') ||
                         localStorage.getItem('token') ||
                         localStorage.getItem('user') ||
                         localStorage.getItem('currentUser') ||
                         sessionStorage.getItem('authToken') ||
                         sessionStorage.getItem('user');
        
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

  // Update video opacity with fade in/out logic
  const updateOpacity = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.duration === 0) return;

    const { currentTime, duration } = video;
    let opacity = 1;

    // Fade in over 0.5s at start
    if (currentTime < 0.5) {
      opacity = Math.max(0, currentTime / 0.5);
    }
    // Fade out over 0.5s before end
    else if (currentTime > duration - 0.5) {
      opacity = Math.max(0, (duration - currentTime) / 0.5);
    }
    // Full opacity in middle
    else {
      opacity = 1;
    }

    // Update DOM only if opacity changed significantly
    if (Math.abs(opacity - opacityRef.current) > 0.01) {
      opacityRef.current = opacity;
      video.style.opacity = String(opacity);
    }

    requestRef.current = requestAnimationFrame(updateOpacity);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      requestRef.current = requestAnimationFrame(updateOpacity);
    };

    const handlePause = () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };

    const handleEnded = () => {
      // Set opacity to 0
      video.style.opacity = '0';
      // Wait 100ms, then reset and play again
      setTimeout(() => {
        if (video) {
          video.currentTime = 0;
          video.play().catch((e) => console.warn('Video replay failed:', e.message));
        }
      }, 100);
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    // Attempt autoplay
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        console.log('Video autoplay started');
      }).catch((e) => {
        console.warn('Autoplay prevented:', e.message);
        // Fallback: play on user interaction
        const handleInteraction = () => {
          video.play().catch((err) => console.warn('Play failed:', err.message));
          document.removeEventListener('click', handleInteraction);
          window.removeEventListener('touchstart', handleInteraction);
        };
        document.addEventListener('click', handleInteraction, { once: true });
        window.addEventListener('touchstart', handleInteraction, { once: true });
      });
    }

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, [updateOpacity]);

  // Show loading screen after 9 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoadingScreen(true);
    }, 9000); // 9 seconds

    return () => clearTimeout(timer);
  }, []);

  // Rotate text every 1.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % rotatingTexts.length);
    }, 1500); // 1.5 seconds

    return () => clearInterval(interval);
  }, [rotatingTexts.length]);

  // Handle background audio - play on user click
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleClick = () => {
      // Play audio on first click
      audio.play().catch((e) => console.warn('Audio play failed:', e.message));
      // Remove listener after first click to avoid repeating
      document.removeEventListener('click', handleClick);
    };

    // Stop audio when loading screen appears (before navigation)
    if (showLoadingScreen && audio) {
      audio.pause();
      audio.currentTime = 0;
    } else {
      // Add click listener when not showing loading screen
      document.addEventListener('click', handleClick);
    }

    return () => {
      document.removeEventListener('click', handleClick);
      if (audio && showLoadingScreen) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [showLoadingScreen]);

  // Handle 3-second loading screen and redirect
  useEffect(() => {
    if (!showLoadingScreen) return;

    const timer = setTimeout(() => {
      // Check multiple possible auth storage keys
      const authToken = localStorage.getItem('authToken') ||
                       localStorage.getItem('auth_token') ||
                       localStorage.getItem('token') ||
                       localStorage.getItem('user') ||
                       localStorage.getItem('currentUser') ||
                       sessionStorage.getItem('authToken') ||
                       sessionStorage.getItem('user');
      
      console.log('Auth check:', { authToken }); // Debug log
      
      if (authToken) {
        window.location.href = '/dashboard';
      } else {
        window.location.href = '/login';
      }
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, [showLoadingScreen]);

  // Animate loading dots
  useEffect(() => {
    if (!showLoadingScreen) return;

    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === '.') return '..';
        if (prev === '..') return '...';
        return '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, [showLoadingScreen]);

  return (
    <div className="relative w-full overflow-visible bg-white">
      {/* Only show desktop version */}
      {!isMobile ? (
        <>
          {/* Background Audio */}
          <audio
            ref={audioRef}
            src="/dbsound-forest-path-avala-mountains-246781.mp3"
            loop
            muted={false}
            preload="auto"
            className="hidden"
          />

      {/* Hero Section Container */}
      <section
        className="relative w-full overflow-hidden bg-white flex flex-col items-center justify-start text-center px-6"
        style={{
          paddingTop: '5rem',
          paddingBottom: '10rem',
          height: '100vh',
        }}
      >
        {/* Video Background */}
        <video
          ref={videoRef}
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4"
          className="absolute inset-0 z-0 w-full h-full object-cover"
          style={{
            objectPosition: 'center -80%',
            willChange: 'opacity',
            opacity: 1,
          }}
          autoPlay
          muted
          playsInline
          preload="auto"
        />

        {/* Gradient Overlay - Removed for clean sky */}
        <div className="absolute inset-0 bg-transparent z-[1] pointer-events-none" />

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center justify-center">
          {/* Headline */}
          <h1
            className="text-5xl sm:text-7xl md:text-8xl max-w-7xl font-normal text-black animate-fade-rise"
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              lineHeight: 0.95,
              letterSpacing: '-2.46px',
            }}
          >
            Uncover the <span className="text-gray-400 italic">Truth</span>{' '}
            Behind <span className="text-gray-400 italic">Every</span> Story
          </h1>

          {/* Description */}
          <p
            className="text-base sm:text-lg max-w-2xl mt-8 leading-relaxed text-gray-500 animate-fade-rise-delay min-h-[28px]"
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              transition: 'opacity 0.3s ease-in-out',
            }}
          >
            {rotatingTexts[textIndex]}
          </p>


        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Loading Screen Overlay */}
      {showLoadingScreen && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div className="text-center">
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-normal text-white animate-fade-rise"
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
              }}
            >
              Getting things ready{dots}
            </h2>
          </div>
        </div>
      )}
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
