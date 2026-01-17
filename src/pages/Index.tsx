import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  ArrowRight,
  Newspaper
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { VideoModal } from '@/components/VideoModal';
import heroBg from '@/assets/hero-bg.jpg';

const Index: React.FC = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(0);

  const newsImages = {
    breaking: [
      { url: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&h=400&fit=crop', title: 'Global News & Current Events' },
      { url: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop', label: 'World' },
      { url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=400&h=300&fit=crop', label: 'Politics' }
    ],
    technology: [
      { url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop', title: 'Technology & Innovation' },
      { url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop', label: 'AI & ML' },
      { url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop', label: 'Startups' }
    ],
    science: [
      { url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=400&fit=crop', title: 'Science & Research' },
      { url: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=400&h=300&fit=crop', label: 'Medicine' },
      { url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop', label: 'Space' }
    ],
    business: [
      { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop', title: 'Business & Economy' },
      { url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop', label: 'Finance' },
      { url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop', label: 'Market' }
    ],
    sports: [
      { url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=400&fit=crop', title: 'Sports & Athletics' },
      { url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=300&fit=crop', label: 'Football' },
      { url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop', label: 'Olympics' }
    ]
  };

  const genres = [
    { id: 'breaking', label: 'Breaking' },
    { id: 'technology', label: 'Tech' },
    { id: 'science', label: 'Science' },
    { id: 'business', label: 'Business' },
    { id: 'sports', label: 'Sports' }
  ];

  // Auto-rotate images every 1.5 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setSelectedGenre((prev) => (prev + 1) % genres.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const currentGenre = genres[selectedGenre];
  const currentImages = newsImages[currentGenre.id];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />

      {/* Hero Section */}
      <section className="relative py-16 md:py-0 md:min-h-screen flex items-center overflow-hidden bg-muted/30">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        
        
        <div className="container mx-auto px-4 relative z-10 pt-20">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            {/* Left side - Text content */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 mb-8 opacity-0 animate-fade-in">
                <Shield className="w-4 h-4 text-gold" />
                <span className="text-sm font-medium text-gold">AI-Powered Fact Checking</span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 opacity-0 animate-slide-up" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
                <span className="text-foreground">Uncover the </span>
                <span className="text-gradient">Truth</span>
                <span className="text-foreground"> Behind Every Story</span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl lg:text-xl text-muted-foreground mb-10 leading-relaxed opacity-0 animate-slide-up" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
                NewsScope uses advanced AI to analyze news articles, detect misinformation, 
                and help you make informed decisions about what you read.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 w-full opacity-0 animate-slide-up" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
                  <div className="flex flex-row justify-between w-full gap-3">
                    <Button variant="default" size="lg" asChild className="bg-gold text-background hover:bg-gold-light shadow-lg font-semibold w-1/2 min-w-[120px] px-2 py-2.5">
                      <Link to="/detect" className="flex items-center justify-center gap-2 px-2">
                        <span className="truncate">Get Started</span>
                        <ArrowRight className="w-4 h-4 flex-shrink-0" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="lg" asChild className="border-gold text-gold hover:bg-gold hover:text-background shadow-lg font-semibold w-1/2 min-w-[120px] px-2 py-2.5">
                      <Link to="/learn-more" className="flex items-center justify-center gap-2 px-2">
                        <span className="truncate">Learn More</span>
                        <ArrowRight className="w-4 h-4 flex-shrink-0" />
                      </Link>
                    </Button>
                  </div>
              </div>
            </div>

            {/* Right side - News Images */}
            <div className="relative opacity-0 animate-fade-in mt-12 md:mt-0" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
              <div className="relative h-[350px] sm:h-[400px] md:h-[550px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-border/50 mx-auto w-full max-w-md md:max-w-none">
                {/* Image Grid */}
                <div className="absolute inset-0 grid grid-cols-2 gap-2 sm:gap-3 p-3 sm:p-4 bg-card/50">
                  {/* Large featured image */}
                  <div className="col-span-2 h-[180px] sm:h-[240px] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700 relative group">
                    <img 
                      key={currentImages[0].url}
                      src={currentImages[0].url}
                      alt="News" 
                      className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <span className="text-xs text-gold font-semibold uppercase">{currentGenre.label}</span>
                      <h4 className="text-white font-bold text-lg mt-1">{currentImages[0].title}</h4>
                    </div>
                  </div>
                  
                  {/* Smaller images */}
                  <div className="h-[140px] sm:h-[200px] rounded-xl overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-blue-700 relative group">
                    <img 
                      key={currentImages[1].url}
                      src={currentImages[1].url}
                      alt="News" 
                      className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <span className="text-xs text-gold font-medium">{currentImages[1].label}</span>
                    </div>
                  </div>
                  
                  <div className="h-[140px] sm:h-[200px] rounded-xl overflow-hidden bg-gradient-to-br from-purple-700 via-purple-600 to-purple-700 relative group">
                    <img 
                      key={currentImages[2].url}
                      src={currentImages[2].url}
                      alt="News" 
                      className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <span className="text-xs text-gold font-medium">{currentImages[2].label}</span>
                    </div>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-4 right-4 z-10">
                  <div className="px-3 py-1 bg-background/80 backdrop-blur-sm rounded-full border border-gold/40">
                    <span className="text-xs text-gold font-mono font-semibold">NEWS GALLERY</span>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -z-10 -top-6 -right-6 w-full h-full bg-gradient-to-br from-gold/10 to-transparent rounded-3xl blur-xl" />
              <div className="absolute -z-20 -top-10 -right-10 w-full h-full bg-gradient-to-br from-gold/5 to-transparent rounded-3xl blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <VideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />
    </div>
  );
};

export default Index;
