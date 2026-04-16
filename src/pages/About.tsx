import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <button
        onClick={() => navigate('/')}
        className="hidden md:block fixed top-4 left-4 z-50 p-2 hover:bg-muted rounded-lg transition-colors"
        aria-label="Back to home"
      >
        <ArrowLeft className="h-6 w-6" />
      </button>

      <main className="pt-8 pb-16">
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
            <p className="text-muted-foreground leading-relaxed mb-4">
              In an era of unprecedented information overload and rapid digital communication, NewsScope empowers users to make informed decisions by providing accurate, AI-driven news verification and fact-checking capabilities. We are committed to helping individuals and organizations distinguish between credible reporting and misleading or false information that can spread rapidly across social media and messaging platforms. We believe everyone deserves access to truthful, verified information and the tools to independently verify claims and statements.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our dedicated team is working tirelessly to develop advanced artificial intelligence and machine learning technologies that can analyze news content, verify sources, and provide comprehensive credibility assessments. We are passionate about combating misinformation and supporting media literacy in communities around the world.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
};

export default About;