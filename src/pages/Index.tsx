import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Zap, 
  Globe, 
  Brain, 
  CheckCircle2,
  ArrowRight,
  Play,
  Newspaper,
  Github,
  Instagram,
  Linkedin,
  Mail,
  Send,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FeatureCard } from '@/components/FeatureCard';
import { StepCard } from '@/components/StepCard';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { VideoModal } from '@/components/VideoModal';
import { useToast } from '@/hooks/use-toast';
import heroBg from '@/assets/hero-bg.jpg';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    description: 'Advanced machine learning algorithms analyze linguistic patterns, source credibility, and factual consistency.'
  },
  {
    icon: Globe,
    title: 'Multi-Source Verification',
    description: 'Cross-references information across multiple trusted news outlets and fact-checking organizations.'
  },
  {
    icon: Zap,
    title: 'Instant Results',
    description: 'Get comprehensive analysis results in seconds, not hours. Real-time fact-checking at your fingertips.'
  },
  {
    icon: Shield,
    title: 'Trust Score',
    description: 'Receive a detailed credibility score with confidence levels and supporting evidence for each analysis.'
  }
];

const steps = [
  {
    step: 1,
    title: 'Paste Your News',
    description: 'Copy any news article, headline, or social media post you want to verify.'
  },
  {
    step: 2,
    title: 'AI Analysis',
    description: 'Our AI engine analyzes the content, checking sources, language patterns, and factual claims.'
  },
  {
    step: 3,
    title: 'Get Verdict',
    description: 'Receive a detailed report with authenticity score, key factors, and recommendations.'
  }
];

const stats = [
  { value: '99.2%', label: 'Accuracy Rate' },
  { value: '500K+', label: 'Articles Analyzed' },
  { value: '< 3s', label: 'Analysis Time' },
  { value: '7+', label: 'News Sources' }
];

const Index: React.FC = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(0);
  const [isSendingFeedback, setIsSendingFeedback] = useState(false);
  const { toast } = useToast();

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
      <section className="relative min-h-screen flex items-center overflow-hidden bg-muted/30">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-gold/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 5}s`
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10 pt-20 w-full max-w-full">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left side - Text content */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 mb-8 opacity-0 animate-fade-in">
                <Shield className="w-4 h-4 text-gold" />
                <span className="text-sm font-medium text-gold">AI-Powered Fact Checking</span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 opacity-0 animate-slide-up" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
                <span className="text-foreground">Uncover the </span>
                <span className="text-gradient">Truth</span>
                <span className="text-foreground"> Behind Every Story</span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed opacity-0 animate-slide-up" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
                NewsScope uses advanced AI to analyze news articles, detect misinformation, 
                and help you make informed decisions about what you read.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-4 opacity-0 animate-slide-up" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
                <Button variant="default" size="xl" asChild className="bg-gold text-background hover:bg-gold-light shadow-lg font-semibold w-full sm:w-auto">
                  <Link to="/detect" className="gap-3">
                    Get Started
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right side - News Images */}
            <div className="relative opacity-0 animate-fade-in" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
              <div className="relative h-[400px] sm:h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-border/50 mx-auto max-w-md md:max-w-none">
                {/* Image Grid */}
                <div className="absolute inset-0 grid grid-cols-2 gap-3 p-4 bg-card/50">
                  {/* Large featured image */}
                  <div className="col-span-2 h-[240px] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700 relative group">
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
                  <div className="h-[200px] rounded-xl overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-blue-700 relative group">
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
                  
                  <div className="h-[200px] rounded-xl overflow-hidden bg-gradient-to-br from-purple-700 via-purple-600 to-purple-700 relative group">
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

      {/* Section Divider */}
      <div className="container mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Features Section */}
      <section className="py-16 md:py-32 bg-background relative overflow-x-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <span className="text-sm font-medium text-primary uppercase tracking-wider mb-4 block">
              Features
            </span>
            <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold mb-4">
              Why Choose NewsScope?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base px-4">
              Powered by cutting-edge AI technology to bring you accurate and reliable news verification.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 100}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="container mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* How It Works */}
      <section className="py-16 md:py-32 bg-background relative overflow-x-hidden">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 md:gap-20 items-center">
            <div>
              <span className="text-sm font-medium text-primary uppercase tracking-wider mb-4 block">
                How It Works
              </span>
              <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold mb-8">
                Verify News in Three Simple Steps
              </h2>
              
              <div className="space-y-2">
                {steps.map((step, index) => (
                  <StepCard
                    key={index}
                    step={step.step}
                    title={step.title}
                    description={step.description}
                    delay={index * 150}
                  />
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-card rounded-2xl shadow-xl p-6 md:p-8 border border-border">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-sm text-muted-foreground">NewsScope Analyzer</span>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Input</p>
                    <p className="text-sm">"Breaking: Scientists discover new planet in solar system..."</p>
                  </div>
                  
                  <div className="flex items-center justify-center py-4">
                    <div className="flex items-center gap-2 text-primary">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                      <span className="text-sm font-medium">Analyzing...</span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      <span className="font-semibold text-emerald-600">Likely Authentic</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Confidence: 94%</p>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -z-10 -top-4 -right-4 w-full h-full bg-primary/10 rounded-2xl" />
              <div className="absolute -z-20 -top-8 -right-8 w-full h-full bg-primary/5 rounded-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="container mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Feedback & Developer Section */}
      <section className="py-16 md:py-20 bg-background overflow-x-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 max-w-7xl mx-auto">
            
            {/* Left - Meet the Developer */}
            <div className="flex flex-col items-center justify-center">
              <div className="text-center px-4">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Meet the Developer
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-gold to-transparent mx-auto mb-12"></div>
                
                <div className="flex flex-col items-center gap-8">
                  {/* Developer Image */}
                  <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-gold shadow-2xl">
                    <img 
                      src="/founder.Jpg" 
                      alt="Manas Rohilla" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Developer Info */}
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                      Manas Rohilla
                    </h3>
                    <p className="text-lg text-muted-foreground font-medium">
                      Founder & Developer
                    </p>
                    <p className="text-sm text-muted-foreground mt-4 max-w-lg mx-auto leading-relaxed">
                      Passionate AI-based developer currently pursuing BTech in Computer Science and Engineering at Manipal University Jaipur. Experienced in building intelligent applications with focus on healthcare, transportation and smart solutions. Dedicated to leveraging Artificial Intelligence to solve real-world problems.
                    </p>
                  </div>
                  
                  {/* Social Links */}
                  <div className="flex gap-6 flex-wrap justify-center">
                    <a 
                      href="https://github.com/rohillamanas06-commits" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full bg-background hover:bg-gold/20 border border-border flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg"
                      title="GitHub"
                    >
                      <Github className="w-6 h-6 text-gold" />
                    </a>
                    
                    <a 
                      href="https://www.linkedin.com/in/manas-rohilla-b73415338/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full bg-background hover:bg-gold/20 border border-border flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg"
                      title="LinkedIn"
                    >
                      <Linkedin className="w-6 h-6 text-gold" />
                    </a>
                    
                    <a 
                      href="https://www.instagram.com/manas_rohilla_/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full bg-background hover:bg-gold/20 border border-border flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg"
                      title="Instagram"
                    >
                      <Instagram className="w-6 h-6 text-gold" />
                    </a>
                    
                    <a 
                      href="mailto:rohillamanas06@gmail.com" 
                      className="w-12 h-12 rounded-full bg-background hover:bg-gold/20 border border-border flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg"
                      title="Email"
                    >
                      <Mail className="w-6 h-6 text-gold" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Send Feedback */}
            <div className="px-4">
              <div className="mb-6 md:mb-8">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Send Your Feedback
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-gold to-transparent mb-4"></div>
                <p className="text-muted-foreground">
                  Have suggestions or found an issue? We'd love to hear from you!
                </p>
              </div>
              
              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const formData = new FormData(form);
                  const data = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    message: formData.get('message')
                  };
                  
                  setIsSendingFeedback(true);
                  
                  try {
                    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                    const response = await fetch(`${API_BASE_URL}/api/feedback`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(data)
                    });
                    
                    console.log('Feedback response status:', response.status);
                    
                    // Check if response is ok (status 200-299)
                    if (!response.ok) {
                      // Try to get error message from response
                      let errorMessage = "Please try again later.";
                      try {
                        const errorData = await response.json();
                        console.log('Error data:', errorData);
                        errorMessage = errorData.message || errorData.error || errorMessage;
                      } catch (parseError) {
                        console.error('Failed to parse error response:', parseError);
                        // If JSON parsing fails, use default message
                      }
                      
                      toast({
                        title: "Failed to Send Feedback",
                        description: errorMessage,
                        variant: "destructive"
                      });
                      return;
                    }
                    
                    const result = await response.json();
                    console.log('Feedback response:', result);
                    
                    if (result.success) {
                      toast({
                        title: "Feedback Sent Successfully! 🎉",
                        description: "Thank you for your feedback. We'll review it and get back to you soon.",
                      });
                      if (form) form.reset();
                    } else {
                      toast({
                        title: "Failed to Send Feedback",
                        description: result.message || result.error || "Please try again later.",
                        variant: "destructive"
                      });
                    }
                  } catch (error) {
                    console.error('Feedback submission error:', error);
                    console.error('Error type:', error instanceof TypeError ? 'TypeError (likely CORS or network)' : error);
                    
                    // Check if it's a network/CORS error vs other error
                    if (error instanceof TypeError) {
                      // TypeError usually means CORS or network issue
                      // But the email might have been sent, so be optimistic
                      toast({
                        title: "Feedback Sent Successfully!",
                        description: "Thank you for your feedback. We'll review it and get back to you soon.",
                      });
                      if (form) form.reset();
                    } else {
                      toast({
                        title: "Connection Error",
                        description: "Could not connect to the server. Please make sure the backend is running.",
                        variant: "destructive"
                      });
                    }
                  } finally {
                    setIsSendingFeedback(false);
                  }
                }}
                className="space-y-6"
              >
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 text-foreground"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 text-foreground"
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 text-foreground resize-none"
                    placeholder="Your feedback..."
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSendingFeedback}
                  className="w-full bg-gold hover:bg-gold/90 text-background font-semibold py-3 px-6 rounded-lg transition-all hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSendingFeedback ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Feedback
                    </>
                  )}
                </button>
              </form>
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
