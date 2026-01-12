import React from 'react';
import { 
  Shield, 
  Zap, 
  Globe, 
  Brain, 
  CheckCircle2,
  ArrowRight,
  Play,
  Github,
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

      <Footer />

      <VideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />
    </div>
  );
};

export default LearnMore;
