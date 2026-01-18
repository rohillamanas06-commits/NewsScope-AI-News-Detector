import React from 'react';
import { 
  Shield, 
  Zap, 
  Globe, 
  Brain, 
  CheckCircle2,
  ArrowRight,
  Play,
  ExternalLink,
  Instagram,
  Linkedin,
  Mail,
  Pilcrow
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FeatureCard } from '@/components/FeatureCard';
import { StepCard } from '@/components/StepCard';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { VideoModal } from '@/components/VideoModal';
import { useToast } from '@/hooks/use-toast';

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

const LearnMore: React.FC = () => {
  const [isVideoOpen, setIsVideoOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />

      {/* Section Divider */}
      <div className="container mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Features Section */}
      <section className="py-20 md:py-24 lg:py-32 bg-background relative overflow-x-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16 px-4">
            <span className="text-sm font-medium text-primary uppercase tracking-wider mb-4 block">
              Features
            </span>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Why Choose NewsScope?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base px-4">
              Powered by cutting-edge AI technology to bring you accurate and reliable news verification.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4">
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
      <section className="py-20 md:py-24 lg:py-32 relative bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 lg:gap-20 items-center">
            <div>
              <span className="text-sm font-medium text-primary uppercase tracking-wider mb-4 block">
                How It Works
              </span>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-8">
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

      {/* Meet the Developer Section */}
      <section className="py-20 md:py-24 lg:py-32 bg-background relative overflow-x-hidden">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <div className="max-w-xl mx-auto">
            <span className="text-sm font-medium text-primary uppercase tracking-wider mb-4 block">
              Meet the Developer
            </span>
            <div className="flex flex-col items-center gap-4">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-gold/80 to-primary/80 flex items-center justify-center mb-2 shadow-lg overflow-hidden border-4 border-gold">
                <img src="/founder.Jpg" alt="Manas Rohilla" className="object-cover w-full h-full" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Manas Rohilla</h3>
              <p className="text-base text-muted-foreground font-medium mb-2">Founder & Developer</p>
              <p className="text-muted-foreground max-w-md mx-auto text-sm sm:text-base mb-4">
                Passionate about building applications that make a difference.
              </p>
              <div className="flex flex-row gap-4 justify-center mt-2">
                <a href="https://instagram.com/manas_rohilla_" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-yellow-400 flex items-center justify-center shadow-md hover:scale-110 transition-transform">
                  <Instagram className="w-5 h-5 text-white" />
                </a>
                <a href="https://github.com/rohillamanas06-commits" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center shadow-md hover:scale-110 transition-transform">
                  <ExternalLink className="w-5 h-5 text-white" />
                </a>
                <a href="https://www.linkedin.com/in/manas-rohilla-b73415338/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-md hover:scale-110 transition-transform">
                  <Linkedin className="w-5 h-5 text-white" />
                </a>
                <a href="mailto:rohillamanas06@gmail.com" className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-amber-500 flex items-center justify-center shadow-md hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5 text-white" />
                </a>
                <a href="https://peerlist.io/rohillamanas06" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-teal-400 flex items-center justify-center shadow-md hover:scale-110 transition-transform">
                  <Pilcrow className="w-5 h-5 text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <VideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />
    </div>
  );
};

export default LearnMore;
