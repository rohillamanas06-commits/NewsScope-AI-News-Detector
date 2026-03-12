import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Brain, Shield, Zap, Globe } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">About NewsScope</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Advanced AI-powered news detection platform helping you identify authentic news from misinformation.
            </p>
          </div>

          {/* Mission Section */}
          <div className="bg-muted/30 rounded-2xl p-8 mb-12">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              In an era of information overload, NewsScope empowers users to make informed decisions by providing 
              accurate, AI-driven news verification. We believe everyone deserves access to truthful information 
              and the tools to verify it.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="p-6 rounded-xl border border-border bg-card">
              <Brain className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">AI-Powered Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Advanced machine learning algorithms analyze linguistic patterns and source credibility.
              </p>
            </div>
            <div className="p-6 rounded-xl border border-border bg-card">
              <Globe className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Multi-Source Verification</h3>
              <p className="text-sm text-muted-foreground">
                Cross-references information across multiple trusted news outlets.
              </p>
            </div>
            <div className="p-6 rounded-xl border border-border bg-card">
              <Zap className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Instant Results</h3>
              <p className="text-sm text-muted-foreground">
                Get comprehensive analysis results in seconds with real-time fact-checking.
              </p>
            </div>
            <div className="p-6 rounded-xl border border-border bg-card">
              <Shield className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Trust Score</h3>
              <p className="text-sm text-muted-foreground">
                Receive detailed credibility scores with confidence levels and evidence.
              </p>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default About;
